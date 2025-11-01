import * as THREE from 'https://esm.sh/three@0.162.0';

const createHandle = (parameters) => {
  const {
    handleLength,
    handleWidth,
    handleThickness,
    indentDepth,
    indentLength,
  } = parameters;

  const halfWidth = handleWidth / 2;
  const narrowed = Math.max(halfWidth - indentDepth, halfWidth * 0.7);
  const shape = new THREE.Shape();
  const indentStart = handleLength - indentLength;

  shape.moveTo(-halfWidth, 0);
  shape.lineTo(-halfWidth, indentStart);
  shape.quadraticCurveTo(-halfWidth, indentStart + indentLength * 0.45, -narrowed, handleLength);
  shape.lineTo(narrowed, handleLength);
  shape.quadraticCurveTo(halfWidth, indentStart + indentLength * 0.45, halfWidth, indentStart);
  shape.lineTo(halfWidth, 0);
  shape.quadraticCurveTo(halfWidth * 0.9, -4, 0, -4);
  shape.quadraticCurveTo(-halfWidth * 0.9, -4, -halfWidth, 0);

  const extrudeSettings = {
    depth: handleThickness,
    bevelEnabled: true,
    bevelSize: Math.min(1.2, handleThickness * 0.12),
    bevelSegments: 2,
    bevelThickness: Math.min(1, handleThickness * 0.1),
    curveSegments: 32,
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geometry.center();
  geometry.translate(0, handleLength / 2 - 2, 0);

  const material = new THREE.MeshStandardMaterial({
    color: 0x4f6df5,
    roughness: 0.4,
    metalness: 0.05,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  return mesh;
};

const createHead = (parameters, handleLength) => {
  const { headLength, headWidth, headThickness } = parameters;
  const radius = headWidth / 2;
  const shape = new THREE.Shape();

  shape.moveTo(-radius, 0);
  shape.lineTo(-radius, headLength - radius);
  shape.absarc(0, headLength - radius, radius, Math.PI, 0, false);
  shape.lineTo(radius, 0);
  shape.absarc(0, radius, radius, 0, Math.PI, false);

  const extrudeSettings = {
    depth: headThickness,
    bevelEnabled: true,
    bevelSize: Math.min(0.8, headThickness * 0.12),
    bevelSegments: 2,
    bevelThickness: Math.min(0.6, headThickness * 0.1),
    curveSegments: 32,
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geometry.center();
  geometry.translate(0, handleLength / 2 + headLength / 2, 0);

  const material = new THREE.MeshStandardMaterial({
    color: 0xf4f6fb,
    roughness: 0.35,
    metalness: 0.05,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  return mesh;
};

const createBristles = (parameters, handleLength) => {
  const {
    headLength,
    headWidth,
    headThickness,
    bristleRows,
    bristleColumns,
    bristleRadius,
    bristleHeight,
    bristleTilt,
    bristleMargin,
    bristleSpacingFactor,
  } = parameters;

  const group = new THREE.Group();
  const usableLength = headLength - 2 * bristleMargin;
  const usableWidth = headWidth - 2 * bristleMargin;

  const rowSpacing =
    bristleRows > 1 ? (usableLength / (bristleRows - 1)) * bristleSpacingFactor : 0;
  const columnSpacing =
    bristleColumns > 1 ? (usableWidth / (bristleColumns - 1)) * bristleSpacingFactor : 0;

  const startY = handleLength / 2 + bristleMargin - headLength / 2;
  const startX = -usableWidth / 2;

  const geometry = new THREE.CylinderGeometry(bristleRadius, bristleRadius * 0.85, bristleHeight, 12, 1);
  geometry.rotateX(Math.PI / 2);

  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.3,
    metalness: 0.1,
  });

  for (let row = 0; row < bristleRows; row += 1) {
    for (let col = 0; col < bristleColumns; col += 1) {
      const bristle = new THREE.Mesh(geometry, material);
      const offsetY = startY + row * rowSpacing;
      const offsetX = startX + col * columnSpacing;
      const tiltRadians = THREE.MathUtils.degToRad((row - (bristleRows - 1) / 2) * (bristleTilt / bristleRows));

      bristle.position.set(
        offsetX,
        offsetY,
        headThickness / 2 + bristleHeight / 2 + 1
      );
      bristle.rotation.y = tiltRadians;
      bristle.castShadow = true;
      bristle.receiveShadow = true;
      group.add(bristle);
    }
  }

  return group;
};

export const buildToothbrush = (parameters) => {
  const group = new THREE.Group();
  group.name = 'Toothbrush';

  const handle = createHandle(parameters);
  const head = createHead(parameters, parameters.handleLength);
  const bristles = createBristles(parameters, parameters.handleLength);

  group.add(handle);
  group.add(head);
  group.add(bristles);

  return group;
};
