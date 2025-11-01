import * as THREE from "https://esm.sh/three@0.160.0";
import React from "https://esm.sh/react@18.2.0?dev";
import { useParams } from "../store.js";

const h = React.createElement;

function buildHandleShape(handleLength, handleWidth, headWidth) {
  const halfWidth = handleWidth / 2;
  const halfHeadWidth = headWidth / 2;
  const waistLength = 12;
  const waistStart = handleLength - waistLength;
  const waistWidth = Math.max(halfHeadWidth + 1.5, halfWidth * 0.8);

  const shape = new THREE.Shape();
  shape.moveTo(0, -halfWidth);
  shape.lineTo(waistStart, -halfWidth);
  shape.quadraticCurveTo(
    waistStart + waistLength * 0.4,
    -halfWidth,
    waistStart + waistLength * 0.6,
    -waistWidth
  );
  shape.lineTo(handleLength, -waistWidth);
  shape.lineTo(handleLength, waistWidth);
  shape.quadraticCurveTo(
    waistStart + waistLength * 0.6,
    halfWidth,
    waistStart,
    halfWidth
  );
  shape.lineTo(0, halfWidth);
  shape.lineTo(0, -halfWidth);
  return shape;
}

export function Handle({ color = "#2d2d2d" } = {}) {
  const { handleLength, handleWidth, handleThickness, headWidth } = useParams();

  const geometry = React.useMemo(() => {
    const shape = buildHandleShape(handleLength, handleWidth, headWidth);
    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: handleThickness,
      bevelEnabled: true,
      bevelThickness: 0.6,
      bevelSize: 0.6,
      bevelSegments: 2,
      curveSegments: 16,
    });
    geom.rotateX(Math.PI / 2);
    geom.translate(0, handleThickness / 2, 0);
    return geom;
  }, [handleLength, handleWidth, handleThickness, headWidth]);

  return h(
    "mesh",
    {
      geometry,
      castShadow: true,
      receiveShadow: true,
      position: [handleLength / 2, 0, 0],
    },
    h("meshStandardMaterial", { color, metalness: 0.05, roughness: 0.9 })
  );
}
