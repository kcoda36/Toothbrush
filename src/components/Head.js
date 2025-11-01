import * as THREE from "https://esm.sh/three@0.160.0";
import React from "https://esm.sh/react@18.2.0?dev";
import { useParams } from "../store.js";

const h = React.createElement;

export function Head({ color = "#dddddd" } = {}) {
  const { headLength, headWidth, headThickness } = useParams();

  const geometry = React.useMemo(() => {
    return new THREE.BoxGeometry(headLength, headThickness, headWidth);
  }, [headLength, headWidth, headThickness]);

  return h(
    "mesh",
    {
      geometry,
      position: [headLength / 2, 0, 0],
      castShadow: true,
      receiveShadow: true,
    },
    h("meshStandardMaterial", { color, metalness: 0.1, roughness: 0.7 })
  );
}
