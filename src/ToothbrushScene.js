import React from "https://esm.sh/react@18.2.0?dev";
import * as THREE from "https://esm.sh/three@0.160.0";

const h = React.createElement;

function createHandleGeometry(params) {
  const {
    handleLength,
    handleWidth,
    handleThickness,
    indentLength,
    indentDepth,
    neckLength,
  } = params;

  const shape = new THREE.Shape();
  const halfWidth = handleWidth / 2;
  const indentStart = handleLength - indentLength - neckLength;
  const indentEnd = handleLength - neckLength;

  shape.moveTo(-halfWidth, 0);
  shape.lineTo(halfWidth, 0);
  shape.lineTo(halfWidth, indentStart);
  shape.quadraticCurveTo(
    halfWidth,
    indentStart + indentLength * 0.35,
    halfWidth - indentDepth,
    indentEnd
  );
  shape.lineTo(halfWidth - indentDepth, handleLength - neckLength * 0.5);
  shape.quadraticCurveTo(
    halfWidth - indentDepth,
    handleLength,
    0,
    handleLength
  );
  shape.quadraticCurveTo(
    -(halfWidth - indentDepth),
    handleLength,
    -(halfWidth - indentDepth),
    handleLength - neckLength * 0.5
  );
  shape.lineTo(-(halfWidth - indentDepth), indentEnd);
  shape.quadraticCurveTo(
    -halfWidth,
    indentStart + indentLength * 0.35,
    -halfWidth,
    indentStart
  );
  shape.lineTo(-halfWidth, 0);

  const extrude = new THREE.ExtrudeGeometry(shape, {
    depth: handleThickness,
    bevelEnabled: false,
  });

  extrude.center();
  extrude.rotateX(Math.PI / 2);
  extrude.translate(0, handleThickness / 2, 0);

  return extrude;
}

function createHeadGeometry(params) {
  const { headLength, headWidth, headThickness } = params;
  const shape = new THREE.Shape();
  const halfWidth = headWidth / 2;
  const radius = Math.min(headLength, headWidth) * 0.35;

  shape.moveTo(-halfWidth, 0);
  shape.lineTo(halfWidth, 0);
  shape.lineTo(halfWidth, headLength - radius);
  shape.quadraticCurveTo(halfWidth, headLength, halfWidth - radius, headLength);
  shape.lineTo(-halfWidth + radius, headLength);
  shape.quadraticCurveTo(-halfWidth, headLength, -halfWidth, headLength - radius);
  shape.lineTo(-halfWidth, 0);

  const extrude = new THREE.ExtrudeGeometry(shape, {
    depth: headThickness,
    bevelEnabled: false,
  });

  extrude.center();
  extrude.rotateX(Math.PI / 2);
  extrude.translate(0, headThickness / 2, 0);

  return extrude;
}

export const Toothbrush = React.forwardRef(function Toothbrush(props, ref) {
  const { params } = props;
  const groupRef = React.useRef();
  const bristleRef = React.useRef();

  React.useImperativeHandle(ref, () => ({
    get object() {
      return groupRef.current;
    },
  }));

  const handleGeometry = React.useMemo(
    () => createHandleGeometry(params),
    [
      params.handleLength,
      params.handleWidth,
      params.handleThickness,
      params.indentLength,
      params.indentDepth,
      params.neckLength,
    ]
  );

  const headGeometry = React.useMemo(
    () => createHeadGeometry(params),
    [params.headLength, params.headWidth, params.headThickness]
  );

  const neckGeometry = React.useMemo(() => {
    const width = params.headWidth * 0.65;
    const thickness = params.handleThickness * 0.55;
    return new THREE.BoxGeometry(width, params.neckLength, thickness);
  }, [params.headWidth, params.handleThickness, params.neckLength]);

  const bristleGeometry = React.useMemo(() => {
    const geometry = new THREE.CylinderGeometry(
      params.bristleRadius,
      params.bristleRadius * 0.92,
      params.bristleHeight,
      10
    );
    geometry.translate(0, params.bristleHeight / 2, 0);
    return geometry;
  }, [params.bristleRadius, params.bristleHeight]);

  const bristleMaterial = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#c4f1f9",
        metalness: 0.1,
        roughness: 0.4,
      }),
    []
  );

  const bristleTransforms = React.useMemo(() => {
    const { headLength, headWidth, headThickness, bristleRows, bristleColumns, bristleSpacingRatio } = params;
    const usableLength = headLength * 0.75;
    const usableWidth = headWidth * 0.8;

    const rowSpacing =
      bristleRows > 1 ? (usableWidth * bristleSpacingRatio) / (bristleRows - 1) : 0;
    const columnSpacing =
      bristleColumns > 1
        ? (usableLength * bristleSpacingRatio) / (bristleColumns - 1)
        : 0;

    const startX = -((bristleRows - 1) * rowSpacing) / 2;
    const startZ = -((bristleColumns - 1) * columnSpacing) / 2;

    const positions = [];
    for (let row = 0; row < bristleRows; row += 1) {
      for (let col = 0; col < bristleColumns; col += 1) {
        const x = startX + row * rowSpacing;
        const z = startZ + col * columnSpacing;
        positions.push({ x, z });
      }
    }

    const baseHeight = headThickness * 0.55;
    return { positions, baseHeight };
  }, [
    params.headLength,
    params.headWidth,
    params.headThickness,
    params.bristleRows,
    params.bristleColumns,
    params.bristleSpacingRatio,
  ]);

  React.useEffect(() => {
    if (!bristleRef.current) return;
    const dummy = new THREE.Object3D();
    bristleTransforms.positions.forEach((pos, index) => {
      dummy.position.set(pos.x, bristleTransforms.baseHeight, pos.z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      bristleRef.current.setMatrixAt(index, dummy.matrix);
    });
    bristleRef.current.instanceMatrix.needsUpdate = true;
  }, [bristleTransforms]);

  const headCenterY =
    params.handleLength - params.neckLength / 2 + params.headThickness / 2;

  return h(
    "group",
    { ref: groupRef, position: [0, -params.handleLength / 2, 0] },
    h(
      "mesh",
      { geometry: handleGeometry, castShadow: true, receiveShadow: true },
      h("meshStandardMaterial", {
        color: "#60a5fa",
        metalness: 0.18,
        roughness: 0.55,
      })
    ),
    h(
      "mesh",
      {
        geometry: neckGeometry,
        position: [0, params.handleLength / 2 - params.neckLength / 2, 0],
        castShadow: true,
        receiveShadow: true,
      },
      h("meshStandardMaterial", {
        color: "#3b82f6",
        metalness: 0.15,
        roughness: 0.5,
      })
    ),
    h(
      "mesh",
      {
        geometry: headGeometry,
        position: [0, headCenterY - params.handleLength / 2, 0],
        castShadow: true,
        receiveShadow: true,
      },
      h("meshStandardMaterial", {
        color: "#e0f2fe",
        metalness: 0.05,
        roughness: 0.32,
      })
    ),
    h("instancedMesh", {
      ref: bristleRef,
      args: [bristleGeometry, bristleMaterial, bristleTransforms.positions.length],
      position: [0, headCenterY - params.handleLength / 2, 0],
      castShadow: true,
      receiveShadow: false,
    })
  );
});

export function ToothbrushEnvironment() {
  return h(
    React.Fragment,
    null,
    h("hemisphereLight", { intensity: 0.35, groundColor: "#1f2937" }),
    h("spotLight", {
      position: [120, 220, 180],
      angle: Math.PI / 5,
      penumbra: 0.35,
      intensity: 1.2,
      castShadow: true,
    }),
    h("directionalLight", {
      position: [-140, 160, -100],
      intensity: 0.6,
      castShadow: true,
    })
  );
}

export default Toothbrush;
