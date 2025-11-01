import React from "https://esm.sh/react@18.2.0?dev";
import { Handle } from "./Handle.js";
import { Head } from "./Head.js";
import { Bristles } from "./Bristles.js";
import { useParams } from "../store.js";

const h = React.createElement;

export const Toothbrush = React.forwardRef(function Toothbrush(_, ref) {
  const groupRef = React.useRef();
  const { handleLength, headLength } = useParams();
  const totalLength = handleLength + headLength;

  React.useImperativeHandle(ref, () => groupRef.current, []);

  return h(
    "group",
    { ref: groupRef, position: [-totalLength / 2, 0, 0] },
    h(Handle, null),
    h(
      "group",
      { position: [handleLength, 0, 0] },
      h(Head, null),
      h(Bristles, null)
    )
  );
});
