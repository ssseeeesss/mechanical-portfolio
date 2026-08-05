import {
  Component,
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import * as THREE from 'three';
import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { Bounds, OrbitControls, useBounds, useGLTF, useProgress } from '@react-three/drei';
import useMediaQuery from '../hooks/useMediaQuery';
import './ProjectModelViewer.css';

const AXIS_INDEX = { x: 0, y: 1, z: 2 };
const EDGE_COLOR = 0x17262d;
const EDGE_FILE_MAGIC = [0x50, 0x45, 0x44, 0x47];
const EDGE_FILE_VERSION = 1;
const EDGE_FILE_HEADER_BYTES = 8;
const EDGE_RECORD_HEADER_BYTES = 32;
const MAX_EDGE_SEGMENTS_PER_MESH = 2000;
const MAX_EDGE_SEGMENTS_PER_HEAVY_MESH = 1400;

class ModelErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

function LoadingOverlay({ poster }) {
  const { active, progress } = useProgress();
  if (!active && progress >= 100) return null;

  return (
    <div className="model-loading-overlay" role="status" aria-live="polite">
      <img src={poster} alt="" />
      <div>
        <span>LOADING MODEL</span>
        <strong>{Math.round(progress)}%</strong>
      </div>
    </div>
  );
}

function cloneSceneWithMaterials(source) {
  const scene = source.clone(true);
  const hsl = { h: 0, s: 0, l: 0 };
  scene.traverse((node) => {
    if (!node.isMesh || !node.material) return;
    node.material = Array.isArray(node.material)
      ? node.material.map((material) => material.clone())
      : node.material.clone();
    const materials = Array.isArray(node.material) ? node.material : [node.material];
    materials.forEach((material) => {
      if (material.color) {
        // CAD 导出的浅灰材质在浅色画布上对比度不足，统一压低亮度但保留原有色相。
        material.color.multiplyScalar(0.56);
        material.color.getHSL(hsl);
        material.color.setHSL(hsl.h, hsl.s, Math.min(hsl.l, 0.52));
      }
      if ('envMapIntensity' in material) material.envMapIntensity = 0.72;
      if ('roughness' in material) material.roughness = Math.max(material.roughness, 0.58);
      if ('metalness' in material) material.metalness = Math.min(material.metalness, 0.28);
      material.needsUpdate = true;
    });
    node.castShadow = true;
    node.receiveShadow = true;
  });
  return scene;
}

function parseEdgeData(buffer) {
  const view = new DataView(buffer);
  if (buffer.byteLength < EDGE_FILE_HEADER_BYTES || !EDGE_FILE_MAGIC.every((value, index) => view.getUint8(index) === value)) {
    throw new Error('Invalid model edge data');
  }
  if (view.getUint16(4, true) !== EDGE_FILE_VERSION) throw new Error('Unsupported model edge data version');

  const meshCount = view.getUint16(6, true);
  const records = new Array(meshCount);
  let offset = EDGE_FILE_HEADER_BYTES;
  for (let recordIndex = 0; recordIndex < meshCount; recordIndex += 1) {
    if (offset + EDGE_RECORD_HEADER_BYTES > buffer.byteLength) throw new Error('Truncated model edge data');
    const meshIndex = view.getUint16(offset, true);
    const segmentCount = view.getUint32(offset + 4, true);
    const min = [
      view.getFloat32(offset + 8, true),
      view.getFloat32(offset + 12, true),
      view.getFloat32(offset + 16, true),
    ];
    const size = [
      view.getFloat32(offset + 20, true),
      view.getFloat32(offset + 24, true),
      view.getFloat32(offset + 28, true),
    ];
    const positionCount = segmentCount * 6;
    const positionBytes = positionCount * Uint16Array.BYTES_PER_ELEMENT;
    const positionOffset = offset + EDGE_RECORD_HEADER_BYTES;
    if (meshIndex >= meshCount || positionOffset + positionBytes > buffer.byteLength) throw new Error('Invalid model edge record');
    records[meshIndex] = { segmentCount, min, size, positions: new Uint16Array(buffer, positionOffset, positionCount) };
    offset += EDGE_RECORD_HEADER_BYTES + positionBytes;
  }
  if (records.some((record) => !record)) throw new Error('Incomplete model edge data');
  return records;
}

function sampleEdgePositions(record, segmentLimit, samplingMode = 'uniform') {
  if (record.segmentCount <= segmentLimit) return record.positions;

  const positions = new Uint16Array(segmentLimit * 6);
  if (samplingMode === 'longest') {
    const rankedSegments = Array.from({ length: record.segmentCount }, (_, segmentIndex) => {
      const offset = segmentIndex * 6;
      let lengthSquared = 0;

      for (let axis = 0; axis < 3; axis += 1) {
        const delta = (record.positions[offset + axis] - record.positions[offset + axis + 3]) * record.size[axis];
        lengthSquared += delta * delta;
      }

      return { segmentIndex, lengthSquared };
    });
    rankedSegments.sort((a, b) => b.lengthSquared - a.lengthSquared);

    rankedSegments.slice(0, segmentLimit).forEach(({ segmentIndex }, targetIndex) => {
      positions.set(record.positions.subarray(segmentIndex * 6, segmentIndex * 6 + 6), targetIndex * 6);
    });
    return positions;
  }

  for (let targetIndex = 0; targetIndex < segmentLimit; targetIndex += 1) {
    const sourceIndex = Math.min(
      record.segmentCount - 1,
      Math.floor((targetIndex * record.segmentCount) / segmentLimit),
    );
    positions.set(record.positions.subarray(sourceIndex * 6, sourceIndex * 6 + 6), targetIndex * 6);
  }
  return positions;
}

function createEdgeOverlays(scene, records, segmentLimit, samplingMode) {
  const overlays = [];
  let meshIndex = 0;

  scene.traverse((mesh) => {
    if (!mesh.isMesh) return;
    const record = records[meshIndex];
    if (!record) throw new Error(`Missing edge data for mesh ${meshIndex}`);
    meshIndex += 1;
    if (!record.segmentCount) return;

    const geometry = new THREE.BufferGeometry();
    const positions = sampleEdgePositions(record, segmentLimit, samplingMode);
    geometry.setAttribute('position', new THREE.Uint16BufferAttribute(positions, 3, true));
    const material = new THREE.LineBasicMaterial({
      color: EDGE_COLOR,
      depthWrite: false,
      opacity: 0.78,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
      transparent: true,
    });
    const overlay = new THREE.LineSegments(geometry, material);
    overlay.name = `${mesh.name || 'mesh'}-edge-overlay`;
    overlay.position.fromArray(record.min);
    overlay.scale.fromArray(record.size);
    overlay.renderOrder = 3;
    overlay.raycast = () => null;
    overlay.userData.portfolioEdgeOverlay = true;
    overlay.userData.portfolioPartId = mesh.userData.portfolioPartId;
    mesh.add(overlay);
    overlays.push(overlay);
  });

  if (meshIndex !== records.length) throw new Error('Model edge data does not match mesh count');
  return overlays;
}

function getEdgeSource(model) {
  if (model.edgeSrc) return model.edgeSrc;
  return model.src.replace(/\.glb$/i, '.edges');
}

function useModelEdgeData(model) {
  const edgeBuffer = useLoader(THREE.FileLoader, getEdgeSource(model), (loader) => {
    loader.setResponseType('arraybuffer');
  });
  return useMemo(() => parseEdgeData(edgeBuffer), [edgeBuffer]);
}

function ModelAsset({
  model,
  controlsRef,
  resetSignal,
  clipping,
  selectedPartId,
  onSelectPart,
  onPartsReady,
}) {
  const { scene: sourceScene } = useGLTF(model.src);
  const edgeRecords = useModelEdgeData(model);
  const scene = useMemo(() => cloneSceneWithMaterials(sourceScene), [sourceScene]);
  const defaultEdgeSegmentLimit = model.viewer?.performanceMode === 'heavy'
    ? MAX_EDGE_SEGMENTS_PER_HEAVY_MESH
    : MAX_EDGE_SEGMENTS_PER_MESH;
  const edgeSegmentLimit = model.viewer?.edgeSegmentLimit ?? defaultEdgeSegmentLimit;
  const edgeSamplingMode = model.viewer?.edgeSamplingMode ?? 'uniform';
  const edgeOverlays = useMemo(
    () => createEdgeOverlays(scene, edgeRecords, edgeSegmentLimit, edgeSamplingMode),
    [edgeRecords, edgeSamplingMode, edgeSegmentLimit, scene],
  );
  const bounds = useBounds();
  const camera = useThree((state) => state.camera);
  const invalidate = useThree((state) => state.invalidate);
  const viewDirection = model.viewer?.viewDirection;
  const modelBounds = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    return {
      center: box.getCenter(new THREE.Vector3()),
      size: box.getSize(new THREE.Vector3()),
    };
  }, [scene]);
  const parts = useMemo(() => {
    let index = 0;
    const result = [];

    scene.traverse((node) => {
      if (!node.isMesh) return;
      index += 1;
      const id = `part-${index}`;
      node.userData.portfolioPartId = id;
      node.children.forEach((child) => {
        if (child.userData.portfolioEdgeOverlay) child.userData.portfolioPartId = id;
      });
      result.push({ id, label: `Node ${String(index).padStart(2, '0')}` });
    });

    return result;
  }, [scene]);

  useEffect(() => {
    onPartsReady(parts);
  }, [onPartsReady, parts]);

  useEffect(() => () => {
    edgeOverlays.forEach((overlay) => {
      overlay.removeFromParent();
      overlay.geometry.dispose();
      overlay.material.dispose();
    });
  }, [edgeOverlays]);

  const fitPresetView = useCallback(() => {
    if (!viewDirection || viewDirection.length !== 3) return false;

    bounds.refresh(scene);
    const { center, distance } = bounds.getSize();
    const direction = new THREE.Vector3(...viewDirection).normalize();
    const controls = controlsRef.current;
    const dampingEnabled = controls?.enableDamping;

    if (controls) {
      controls.enableDamping = false;
      controls.update();
    }

    camera.position.copy(center).addScaledVector(direction, distance);
    camera.lookAt(center);
    camera.updateMatrixWorld();
    if (controls) {
      controls.target.copy(center);
      controls.update();
      controls.enableDamping = dampingEnabled;
    }
    bounds.clip();
    controls?.saveState();
    invalidate();
    return true;
  }, [bounds, camera, controlsRef, invalidate, scene, viewDirection]);

  useLayoutEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (!fitPresetView()) {
        bounds.refresh(scene).clip().fit();
        controlsRef.current?.saveState();
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [bounds, controlsRef, fitPresetView, scene]);

  useEffect(() => {
    if (resetSignal === 0) return;
    if (fitPresetView()) return;
    bounds.refresh(scene).clip().fit();
    controlsRef.current?.reset();
  }, [bounds, controlsRef, fitPresetView, resetSignal, scene]);

  useEffect(() => {
    scene.traverse((node) => {
      if ((!node.isMesh && !node.userData.portfolioEdgeOverlay) || !node.material) return;
      const materials = Array.isArray(node.material) ? node.material : [node.material];
      const isSelected = !selectedPartId || node.userData.portfolioPartId === selectedPartId;

      materials.forEach((material) => {
        if (!material.userData.portfolioOriginal) {
          material.userData.portfolioOriginal = {
            opacity: material.opacity,
            transparent: material.transparent,
            depthWrite: material.depthWrite,
          };
        }

        const original = material.userData.portfolioOriginal;
        material.opacity = selectedPartId && !isSelected ? 0.16 : original.opacity;
        material.transparent = Boolean(selectedPartId) || original.transparent;
        material.depthWrite = selectedPartId && !isSelected ? false : original.depthWrite;
        material.needsUpdate = true;
      });
    });
  }, [scene, selectedPartId]);

  useEffect(() => {
    const axis = AXIS_INDEX[clipping.axis];
    const normal = new THREE.Vector3();
    const centerAxis = modelBounds.center.getComponent(axis);
    normal.setComponent(axis, 1);
    const halfSize = Math.max(modelBounds.size.getComponent(axis) / 2, 0.001);
    const planePosition = centerAxis + clipping.position * halfSize;
    const pointOnPlane = modelBounds.center.clone().setComponent(axis, planePosition);
    const clippingPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(normal, pointOnPlane);

    scene.traverse((node) => {
      if ((!node.isMesh && !node.userData.portfolioEdgeOverlay) || !node.material) return;
      const materials = Array.isArray(node.material) ? node.material : [node.material];
      materials.forEach((material) => {
        material.clippingPlanes = clipping.enabled ? [clippingPlane] : [];
        material.clipIntersection = false;
        material.needsUpdate = true;
      });
    });
  }, [clipping, modelBounds, scene]);

  const handleDoubleClick = useCallback((event) => {
    event.stopPropagation();
    let current = event.object;
    while (current && !current.userData.portfolioPartId) current = current.parent;
    if (current?.userData.portfolioPartId) onSelectPart(current.userData.portfolioPartId);
  }, [onSelectPart]);

  return <primitive object={scene} dispose={null} onDoubleClick={handleDoubleClick} />;
}

function ModelViewport({ model, projectTitle }) {
  const isCompact = useMediaQuery('(max-width: 900px)');
  const viewerOptions = model.viewer ?? {};
  const isHeavyModel = viewerOptions.performanceMode === 'heavy';
  const controlsRef = useRef(null);
  const [resetSignal, setResetSignal] = useState(0);
  const [clipping, setClipping] = useState({ enabled: false, axis: 'x', position: 0 });
  const [selectedPartId, setSelectedPartId] = useState(null);
  const [parts, setParts] = useState([]);
  const [partsPanelOpen, setPartsPanelOpen] = useState(false);

  const onPartsReady = useCallback((nextParts) => setParts(nextParts), []);
  const onSelectPart = useCallback((partId) => {
    setSelectedPartId((current) => (current === partId ? null : partId));
    setPartsPanelOpen(true);
  }, []);
  const handleCanvasWheel = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);
  const handleResetView = useCallback(() => {
    const controls = controlsRef.current;
    if (!viewerOptions.viewDirection || !controls) {
      setResetSignal((value) => value + 1);
      return;
    }

    const dampingEnabled = controls.enableDamping;
    controls.enableDamping = false;
    controls.update();
    controls.reset();
    controls.enableDamping = dampingEnabled;
    controls.update();
  }, [viewerOptions.viewDirection]);
  const selectedPart = parts.find((part) => part.id === selectedPartId);
  const setClipAxis = (axis) => setClipping((current) => ({ ...current, enabled: true, axis }));
  const setClipPosition = (event) => {
    setClipping((current) => ({ ...current, position: Number(event.target.value) / 100 }));
  };

  return (
    <div className="model-viewer model-viewer-fullscreen">
      <div className="model-canvas-shell" onWheel={handleCanvasWheel}>
        <Canvas
          frameloop="demand"
          dpr={isCompact || isHeavyModel ? [1, 1] : [1, 1.35]}
          camera={{ position: [6, 4, 8], fov: 34, near: 0.01, far: 2000 }}
          gl={{
            antialias: !isCompact && !isHeavyModel,
            alpha: false,
            powerPreference: 'high-performance',
            failIfMajorPerformanceCaveat: false,
            depth: true,
            stencil: false,
          }}
          onCreated={({ gl }) => {
            gl.localClippingEnabled = true;
            gl.setClearColor(new THREE.Color('#dce5e8'), 1);
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 0.82;
          }}
        >
          <ambientLight intensity={0.72} />
          <directionalLight position={[5, 8, 6]} intensity={1.55} />
          <directionalLight position={[-4, 2, -5]} intensity={0.48} />
          <Suspense fallback={null}>
            <Bounds margin={1.18}>
              <ModelAsset
                model={model}
                controlsRef={controlsRef}
                resetSignal={resetSignal}
                clipping={clipping}
                selectedPartId={selectedPartId}
                onSelectPart={onSelectPart}
                onPartsReady={onPartsReady}
              />
            </Bounds>
          </Suspense>
          <OrbitControls
            ref={controlsRef}
            makeDefault
            enableDamping
            dampingFactor={viewerOptions.dampingFactor ?? 0.12}
            rotateSpeed={viewerOptions.rotateSpeed ?? 0.72}
            zoomSpeed={0.78}
            zoomToCursor
            enablePan
            panSpeed={0.8}
            mouseButtons={{
              LEFT: THREE.MOUSE.PAN,
              MIDDLE: THREE.MOUSE.ROTATE,
              RIGHT: THREE.MOUSE.PAN,
            }}
            touches={{
              ONE: THREE.TOUCH.ROTATE,
              TWO: THREE.TOUCH.DOLLY_PAN,
            }}
            autoRotate={false}
            minPolarAngle={0.08}
            maxPolarAngle={Math.PI * 0.92}
          />
        </Canvas>
        <LoadingOverlay poster={model.poster} />

        <div className="model-viewer-toolbar" aria-label="三维模型控制">
          <button type="button" onClick={handleResetView}>复位视角</button>
          <button
            type="button"
            className={clipping.enabled ? 'active' : ''}
            onClick={() => setClipping((current) => ({ ...current, enabled: !current.enabled }))}
          >
            {clipping.enabled ? '关闭剖视' : '开启剖视'}
          </button>
          <a href={model.src} download={model.fileName} className="model-download-link">下载 GLB</a>
        </div>
      </div>

      <aside className={`model-control-panel ${partsPanelOpen ? 'is-open' : ''}`} aria-label={`${projectTitle}三维模型控制面板`}>
        <button
          type="button"
          className="model-mobile-panel-toggle"
          onClick={() => setPartsPanelOpen((open) => !open)}
          aria-expanded={partsPanelOpen}
        >
          <span>模型控制与零件</span>
          <span aria-hidden="true">{partsPanelOpen ? '−' : '+'}</span>
        </button>

        <div className="model-control-panel-body">
          <section className="model-control-block" aria-labelledby="section-control-title">
            <div className="model-control-heading">
              <span id="section-control-title">剖视图</span>
              <span>{clipping.enabled ? 'ACTIVE' : 'READY'}</span>
            </div>
            <div className="model-axis-buttons" role="group" aria-label="选择剖切方向">
              {['x', 'y', 'z'].map((axis) => (
                <button
                  key={axis}
                  type="button"
                  className={clipping.enabled && clipping.axis === axis ? 'active' : ''}
                  onClick={() => setClipAxis(axis)}
                >
                  {axis.toUpperCase()} 轴
                </button>
              ))}
            </div>
            <label className="model-range-label" htmlFor="model-clip-position">
              <span>切面位置</span>
              <output>{Math.round(clipping.position * 100)}%</output>
            </label>
            <input
              id="model-clip-position"
              className="model-range"
              type="range"
              min="-100"
              max="100"
              step="1"
              value={Math.round(clipping.position * 100)}
              onChange={setClipPosition}
              aria-label="调整剖切面位置"
            />
            <p className="model-control-help">拖动滑块移动剖切面，或切换 X / Y / Z 轴。</p>
          </section>

          <section className="model-control-block" aria-labelledby="parts-control-title">
            <div className="model-control-heading">
              <span id="parts-control-title">零件选择</span>
              <span>{parts.length ? `${parts.length} PARTS` : 'LOADING'}</span>
            </div>
            <p className="model-control-help">双击模型零件，或从列表选择；其他零件会降低亮度。</p>
            <div className="model-parts-list" role="listbox" aria-label="模型零件列表">
              {parts.length ? parts.map((part) => (
                <button
                  key={part.id}
                  type="button"
                  role="option"
                  aria-selected={selectedPartId === part.id}
                  className={selectedPartId === part.id ? 'active' : ''}
                  onClick={() => onSelectPart(part.id)}
                >
                  <span>{part.label}</span>
                  <span>{selectedPartId === part.id ? 'VIEW' : 'SELECT'}</span>
                </button>
              )) : (
                <span className="model-parts-empty">正在读取零件节点…</span>
              )}
            </div>
            {selectedPart && (
              <button type="button" className="model-clear-selection" onClick={() => setSelectedPartId(null)}>
                清除零件选择
              </button>
            )}
          </section>
        </div>
      </aside>
    </div>
  );
}

function ModelFailure({ model, onRetry }) {
  return (
    <div className="model-runtime-fallback" role="alert">
      <img src={model.poster} alt={model.alt} />
      <div>
        <h4>3D 模型加载失败</h4>
        <p>项目图片与文字内容仍可正常浏览。</p>
        <button type="button" onClick={onRetry}>重新加载</button>
      </div>
    </div>
  );
}

function ModelDialog({ children, projectTitle, onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = dialogRef.current?.querySelectorAll('button:not([disabled]), a[href], input:not([disabled])');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [onClose]);

  return createPortal(
    <div className="model-dialog-backdrop" onClick={onClose}>
      <div
        ref={dialogRef}
        className="model-dialog"
        data-lenis-prevent
        role="dialog"
        aria-modal="true"
        aria-label={`${projectTitle}三维模型全屏查看器`}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
        <button ref={closeRef} type="button" className="model-dialog-close" onClick={onClose} aria-label="关闭三维模型全屏查看器">
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>,
    document.body,
  );
}

export default function ProjectModelViewer({ model, projectTitle, accent, onClose }) {
  const [retryKey, setRetryKey] = useState(0);
  const retry = useCallback(() => {
    useGLTF.clear(model.src);
    setRetryKey((value) => value + 1);
  }, [model.src]);

  return (
    <ModelDialog projectTitle={projectTitle} onClose={onClose}>
      <div style={{ '--model-accent': accent }} className="model-viewer-root">
        <ModelErrorBoundary
          key={`${model.src}-${retryKey}`}
          fallback={<ModelFailure model={model} onRetry={retry} />}
        >
          <ModelViewport model={model} projectTitle={projectTitle} />
        </ModelErrorBoundary>
      </div>
    </ModelDialog>
  );
}
