import { useGLTF } from '@react-three/drei';

export function getProjectModelSource(model) {
  return model.viewerSrc ?? model.src;
}

export function preloadProjectModel(model) {
  useGLTF.preload(getProjectModelSource(model));
}
