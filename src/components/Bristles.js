import * as THREE from "https://esm.sh/three@0.160.0";
import React from "https://esm.sh/react@18.2.0?dev";
import { useParams } from "../store.js";

const h = React.createElement;

export function Bristles({ color = "#7aa3c9" } = {}) {
  const {
    headLength,
    headWidth,
    headThickness,
    bristleCount,
    bristleRadius,
    bristleHeight,
  } = useParams();

  const meshRef = React.useRef();

  const geometry = React.useMemo(() => {
    const geom = new THREE.CylinderGeometry(
      bristleRadius,
      bristleRadius,
      bristleHeight,
      8
    );
    geom.translate(0, bristleHeight / 2, 0);
    return geom;
  }, [bristleRadius, bristleHeight]);

  const material = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({ color, metalness: 0, roughness: 0.5 }),
    [color]
  );

  const layout = React.useMemo(() => {
    const total = Math.max(1, Math.floor(bristleCount));
    const grid = Math.ceil(Math.sqrt(total));
    const rows = grid;
    const cols = grid;

    const inset = 1.2;
    const usableX = headLength - inset * 2;
    const usableZ = headWidth - inset * 2;

    const stepX = cols > 1 ? usableX / (cols - 1) : 0;
    const stepZ = rows > 1 ? usableZ / (rows - 1) : 0;

    const startX = inset;
    const startZ = -usableZ / 2;
    const baseY = headThickness / 2 + 0.1;

    return { rows, cols, total, stepX, stepZ, startX, startZ, baseY };
  }, [headLength, headWidth, headThickness, bristleCount]);

  React.useEffect(() => {
    if (!meshRef.current) return;
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();

    let placed = 0;
    for (let r = 0; r < layout.rows; r += 1) {
      for (let c = 0; c < layout.cols; c += 1) {
        if (placed >= bristleCount) break;
        position.set(
          layout.startX + c * layout.stepX,
          layout.baseY,
          layout.startZ + r * layout.stepZ
        );
        matrix.makeTranslation(position.x, position.y, position.z);
        meshRef.current.setMatrixAt(placed, matrix);
        placed += 1;
      }
    }

    meshRef.current.count = placed;
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [layout, bristleCount]);

  return h("instancedMesh", {
    ref: meshRef,
    args: [geometry, material, layout.rows * layout.cols],
    castShadow: true,
    receiveShadow: true,
    position: [0, 0, 0],
  });
}
