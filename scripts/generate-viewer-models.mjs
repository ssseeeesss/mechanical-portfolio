import assert from 'node:assert/strict';
import { mkdir, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import { NodeIO } from '@gltf-transform/core';
import { EXTMeshoptCompression, KHRMeshQuantization } from '@gltf-transform/extensions';
import { meshopt } from '@gltf-transform/functions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';

const MODEL_DIR = path.resolve('public/models');
const VIEWER_MODEL_DIR = path.join(MODEL_DIR, 'viewer');

function listMeshNodesInSceneOrder(root) {
  const nodes = [];
  const visited = new Set();
  const visit = (node) => {
    if (visited.has(node)) return;
    visited.add(node);
    if (node.getMesh()) nodes.push(node);
    node.listChildren().forEach(visit);
  };

  root.listScenes().forEach((scene) => scene.listChildren().forEach(visit));
  return nodes;
}

function getStructure(document) {
  const root = document.getRoot();
  const meshNodes = listMeshNodesInSceneOrder(root);
  const meshes = root.listMeshes();
  const primitives = meshes.flatMap((mesh) => mesh.listPrimitives());

  return {
    meshNodeNames: meshNodes.map((node) => node.getName()),
    meshNodeGeometry: meshNodes.map((node) => node.getMesh().listPrimitives().map((primitive) => ({
      positionCount: primitive.getAttribute('POSITION')?.getCount() ?? 0,
      indexCount: primitive.getIndices()?.getCount() ?? 0,
    }))),
    meshNodeCount: meshNodes.length,
    primitiveCount: primitives.length,
    positionCount: primitives.reduce(
      (total, primitive) => total + (primitive.getAttribute('POSITION')?.getCount() ?? 0),
      0,
    ),
    indexCount: primitives.reduce(
      (total, primitive) => total + (primitive.getIndices()?.getCount() ?? 0),
      0,
    ),
  };
}

function assertStructurePreserved(source, optimized, modelFile) {
  assert.deepEqual(optimized.meshNodeNames, source.meshNodeNames, `${modelFile}: mesh node order changed`);
  assert.deepEqual(optimized.meshNodeGeometry, source.meshNodeGeometry, `${modelFile}: mesh traversal changed`);
  assert.equal(optimized.meshNodeCount, source.meshNodeCount, `${modelFile}: mesh node count changed`);
  assert.equal(optimized.primitiveCount, source.primitiveCount, `${modelFile}: primitive count changed`);
  assert.equal(optimized.positionCount, source.positionCount, `${modelFile}: vertex count changed`);
  assert.equal(optimized.indexCount, source.indexCount, `${modelFile}: index count changed`);
}

function captureSplitCandidates(document) {
  return document.getRoot().listNodes()
    .filter((node) => node.getMesh() && node.listChildren().length)
    .map((node) => ({ node, name: node.getName(), children: node.listChildren() }));
}

function restoreSplitMeshOrder(candidates, modelFile) {
  candidates.forEach(({ node, name, children }) => {
    if (node.getMesh()) return;
    const originalChildren = new Set(children);
    const generatedChildren = node.listChildren().filter((child) => !originalChildren.has(child));
    assert.equal(generatedChildren.length, 1, `${modelFile}: quantized root mesh could not be identified`);

    const meshNode = generatedChildren[0];
    meshNode.setName(name);
    node.listChildren().forEach((child) => node.removeChild(child));
    node.addChild(meshNode);
    children.forEach((child) => node.addChild(child));
  });
}

await Promise.all([MeshoptEncoder.ready, MeshoptDecoder.ready]);
await mkdir(VIEWER_MODEL_DIR, { recursive: true });

const writer = new NodeIO()
  .registerExtensions([EXTMeshoptCompression, KHRMeshQuantization])
  .registerDependencies({ 'meshopt.encoder': MeshoptEncoder });
const reader = new NodeIO()
  .registerExtensions([EXTMeshoptCompression, KHRMeshQuantization])
  .registerDependencies({ 'meshopt.decoder': MeshoptDecoder });

const modelFiles = (await readdir(MODEL_DIR, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.glb'))
  .map((entry) => entry.name)
  .sort();

for (const modelFile of modelFiles) {
  const inputPath = path.join(MODEL_DIR, modelFile);
  const outputPath = path.join(VIEWER_MODEL_DIR, modelFile);
  const document = await writer.read(inputPath);
  const sourceStructure = getStructure(document);
  const splitCandidates = captureSplitCandidates(document);

  await document.transform(meshopt({
    encoder: MeshoptEncoder,
    level: 'high',
    quantizePosition: 14,
  }));
  restoreSplitMeshOrder(splitCandidates, modelFile);
  await writer.write(outputPath, document);

  const optimizedDocument = await reader.read(outputPath);
  const optimizedStructure = getStructure(optimizedDocument);
  assertStructurePreserved(sourceStructure, optimizedStructure, modelFile);

  const sourceBytes = await readFile(inputPath);
  const optimizedBytes = await readFile(outputPath);
  const sourceGzipBytes = gzipSync(sourceBytes).byteLength;
  const optimizedGzipBytes = gzipSync(optimizedBytes).byteLength;
  const reduction = 100 - (optimizedGzipBytes / sourceGzipBytes) * 100;

  console.log(
    `${modelFile}: ${(sourceBytes.byteLength / 1024 / 1024).toFixed(2)} -> `
    + `${(optimizedBytes.byteLength / 1024 / 1024).toFixed(2)} MiB, gzip `
    + `${(sourceGzipBytes / 1024 / 1024).toFixed(2)} -> `
    + `${(optimizedGzipBytes / 1024 / 1024).toFixed(2)} MiB (${reduction.toFixed(1)}% smaller)`,
  );
}
