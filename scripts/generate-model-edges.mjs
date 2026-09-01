import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'meshoptimizer';

const MODEL_DIR = path.resolve('public/models');
const MODEL_DIRS = [MODEL_DIR, path.join(MODEL_DIR, 'viewer')];
const EDGE_THRESHOLD_ANGLE = 60;
const MAGIC = [0x50, 0x45, 0x44, 0x47];
const VERSION = 1;
const FILE_HEADER_BYTES = 8;
const RECORD_HEADER_BYTES = 32;
const DEFAULT_EDGE_EXPORT_SETTINGS = { segmentLimit: 2000, samplingMode: 'uniform' };
const MODEL_EDGE_EXPORT_SETTINGS = new Map([
  ['CCTV管道检测车.glb', { segmentLimit: 1400, samplingMode: 'uniform' }],
]);

function toArrayBuffer(buffer) {
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}

async function loadScene(filePath) {
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  const source = await readFile(filePath);
  const gltf = await loader.parseAsync(toArrayBuffer(source), `${path.dirname(filePath)}${path.sep}`);
  return gltf.scene;
}

function selectEdgeSegments(position, settings) {
  const segmentCount = position.count / 2;
  if (segmentCount <= settings.segmentLimit) return null;

  if (settings.samplingMode === 'longest') {
    return Array.from({ length: segmentCount }, (_, segmentIndex) => {
      let lengthSquared = 0;
      for (let axis = 0; axis < 3; axis += 1) {
        const start = position.getComponent(segmentIndex * 2, axis);
        const end = position.getComponent(segmentIndex * 2 + 1, axis);
        const delta = start - end;
        lengthSquared += delta * delta;
      }
      return { segmentIndex, lengthSquared };
    })
      .sort((a, b) => b.lengthSquared - a.lengthSquared)
      .slice(0, settings.segmentLimit)
      .map(({ segmentIndex }) => segmentIndex);
  }

  return Array.from({ length: settings.segmentLimit }, (_, targetIndex) => Math.min(
    segmentCount - 1,
    Math.floor((targetIndex * segmentCount) / settings.segmentLimit),
  ));
}

function encodeMeshEdges(scene, settings) {
  const records = [];
  scene.traverse((node) => {
    if (!node.isMesh) return;

    if (!node.geometry?.getAttribute('position')) {
      records.push({ segmentCount: 0, sourceSegmentCount: 0, min: [0, 0, 0], size: [1, 1, 1], positions: new Uint16Array() });
      return;
    }

    const edges = new THREE.EdgesGeometry(node.geometry, EDGE_THRESHOLD_ANGLE);
    const position = edges.getAttribute('position');
    if (!position?.count) {
      records.push({ segmentCount: 0, sourceSegmentCount: 0, min: [0, 0, 0], size: [1, 1, 1], positions: new Uint16Array() });
      edges.dispose();
      return;
    }

    const sourceSegmentCount = position.count / 2;
    const box = new THREE.Box3().setFromBufferAttribute(position);
    const min = box.min.toArray();
    const rawSize = box.getSize(new THREE.Vector3()).toArray();
    const size = rawSize.map((value) => (value > 0 ? value : 1));
    const selectedSegments = selectEdgeSegments(position, settings);
    const segmentCount = selectedSegments?.length ?? sourceSegmentCount;
    const positions = new Uint16Array(segmentCount * 6);

    for (let targetSegment = 0; targetSegment < segmentCount; targetSegment += 1) {
      const sourceSegment = selectedSegments?.[targetSegment] ?? targetSegment;
      for (let endpoint = 0; endpoint < 2; endpoint += 1) {
        const vertexIndex = sourceSegment * 2 + endpoint;
        for (let axis = 0; axis < 3; axis += 1) {
          const value = position.getComponent(vertexIndex, axis);
          positions[targetSegment * 6 + endpoint * 3 + axis] = Math.max(
            0,
            Math.min(65535, Math.round(((value - min[axis]) / size[axis]) * 65535)),
          );
        }
      }
    }

    records.push({ segmentCount, sourceSegmentCount, min, size, positions });
    edges.dispose();
  });
  return records;
}

function writeEdgeFile(records) {
  const byteLength = FILE_HEADER_BYTES + records.reduce(
    (total, record) => total + RECORD_HEADER_BYTES + record.positions.byteLength,
    0,
  );
  const output = new ArrayBuffer(byteLength);
  const bytes = new Uint8Array(output);
  bytes.set(MAGIC, 0);
  const view = new DataView(output);
  view.setUint16(4, VERSION, true);
  view.setUint16(6, records.length, true);

  let offset = FILE_HEADER_BYTES;
  records.forEach((record, meshIndex) => {
    view.setUint16(offset, meshIndex, true);
    view.setUint16(offset + 2, 0, true);
    view.setUint32(offset + 4, record.segmentCount, true);
    record.min.forEach((value, axis) => view.setFloat32(offset + 8 + axis * 4, value, true));
    record.size.forEach((value, axis) => view.setFloat32(offset + 20 + axis * 4, value, true));
    new Uint16Array(output, offset + RECORD_HEADER_BYTES, record.positions.length).set(record.positions);
    offset += RECORD_HEADER_BYTES + record.positions.byteLength;
  });

  return new Uint8Array(output);
}

await MeshoptDecoder.ready;

for (const modelDir of MODEL_DIRS) {
  let entries;
  try {
    entries = await readdir(modelDir, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') continue;
    throw error;
  }

  const modelFiles = entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.glb'))
    .map((entry) => entry.name)
    .sort();

  for (const modelFile of modelFiles) {
    const inputPath = path.join(modelDir, modelFile);
    const outputPath = path.join(modelDir, `${path.basename(modelFile, '.glb')}.edges`);
    const scene = await loadScene(inputPath);
    const settings = MODEL_EDGE_EXPORT_SETTINGS.get(modelFile) ?? DEFAULT_EDGE_EXPORT_SETTINGS;
    const records = encodeMeshEdges(scene, settings);
    const edgeData = writeEdgeFile(records);
    await writeFile(outputPath, edgeData);
    const sourceSegments = records.reduce((total, record) => total + record.sourceSegmentCount, 0);
    const segments = records.reduce((total, record) => total + record.segmentCount, 0);
    const relativeModel = path.relative(MODEL_DIR, inputPath);
    console.log(`${relativeModel}: ${records.length} meshes, ${sourceSegments} -> ${segments} edge segments, ${(edgeData.byteLength / 1024 / 1024).toFixed(2)} MiB`);
  }
}
