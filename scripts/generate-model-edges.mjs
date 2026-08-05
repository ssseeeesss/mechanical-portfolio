import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const MODEL_DIR = path.resolve('public/models');
const EDGE_THRESHOLD_ANGLE = 60;
const MAGIC = [0x50, 0x45, 0x44, 0x47];
const VERSION = 1;
const FILE_HEADER_BYTES = 8;
const RECORD_HEADER_BYTES = 32;

function toArrayBuffer(buffer) {
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}

async function loadScene(filePath) {
  const loader = new GLTFLoader();
  const source = await readFile(filePath);
  const gltf = await loader.parseAsync(toArrayBuffer(source), `${path.dirname(filePath)}${path.sep}`);
  return gltf.scene;
}

function encodeMeshEdges(scene) {
  const records = [];
  scene.traverse((node) => {
    if (!node.isMesh) return;

    if (!node.geometry?.getAttribute('position')) {
      records.push({ segmentCount: 0, min: [0, 0, 0], size: [1, 1, 1], positions: new Uint16Array() });
      return;
    }

    const edges = new THREE.EdgesGeometry(node.geometry, EDGE_THRESHOLD_ANGLE);
    const position = edges.getAttribute('position');
    const segmentCount = position ? position.count / 2 : 0;
    const box = new THREE.Box3().setFromBufferAttribute(position);
    const min = box.min.toArray();
    const rawSize = box.getSize(new THREE.Vector3()).toArray();
    const size = rawSize.map((value) => (value > 0 ? value : 1));
    const positions = new Uint16Array(position ? position.count * 3 : 0);

    for (let vertexIndex = 0; vertexIndex < position.count; vertexIndex += 1) {
      for (let axis = 0; axis < 3; axis += 1) {
        const value = position.getComponent(vertexIndex, axis);
        positions[vertexIndex * 3 + axis] = Math.max(
          0,
          Math.min(65535, Math.round(((value - min[axis]) / size[axis]) * 65535)),
        );
      }
    }

    records.push({ segmentCount, min, size, positions });
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

const modelFiles = (await readdir(MODEL_DIR, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.glb'))
  .map((entry) => entry.name)
  .sort();

for (const modelFile of modelFiles) {
  const inputPath = path.join(MODEL_DIR, modelFile);
  const outputPath = path.join(MODEL_DIR, `${path.basename(modelFile, '.glb')}.edges`);
  const scene = await loadScene(inputPath);
  const records = encodeMeshEdges(scene);
  const edgeData = writeEdgeFile(records);
  await writeFile(outputPath, edgeData);
  const segments = records.reduce((total, record) => total + record.segmentCount, 0);
  console.log(`${modelFile}: ${records.length} meshes, ${segments} edge segments, ${(edgeData.byteLength / 1024 / 1024).toFixed(2)} MiB`);
}
