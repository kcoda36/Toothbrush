import React from "https://esm.sh/react@18.2.0?dev";
import { Canvas } from "https://esm.sh/@react-three/fiber@8.15.13?deps=react@18.2.0,three@0.160.0&bundle";
import { OrbitControls, Environment } from "https://esm.sh/@react-three/drei@9.103.0?deps=@react-three/fiber@8.15.13,react@18.2.0,three@0.160.0&bundle";
import { OBJExporter } from "https://esm.sh/three-stdlib@2.28.12/exporters/OBJExporter.js";
import { STLExporter } from "https://esm.sh/three-stdlib@2.28.12/exporters/STLExporter.js";

import { Toothbrush } from "./components/Toothbrush.js";
import { useParams } from "./store.js";
import { paramMetadata } from "./params.js";

const h = React.createElement;

function Slider({ config }) {
  const value = useParams((state) => state[config.key]);
  const setParam = useParams((state) => state.setParam);

  const decimals = config.step && config.step < 1 ? Math.ceil(Math.log10(1 / config.step)) : 0;
  const formatted = value.toFixed(decimals);

  return h(
    "label",
    { className: "row" },
    h("span", null, config.label),
    h("input", {
      type: "range",
      min: config.min,
      max: config.max,
      step: config.step || 1,
      value,
      onChange: (event) => setParam(config.key, parseFloat(event.target.value)),
    }),
    h("span", { className: "val" }, `${formatted}${config.unit ? ` ${config.unit}` : ""}`)
  );
}

function ControlsPanel({ onExport, onReset }) {
  const params = useParams();

  return h(
    "aside",
    { className: "right" },
    h("h2", null, "Toothbrush Parameters (mm)"),
    ...paramMetadata.map((section) =>
      h(
        React.Fragment,
        { key: section.title },
        h("h3", null, section.title),
        ...section.sliders.map((slider) => h(Slider, { key: slider.key, config: slider }))
      )
    ),
    h(
      "div",
      { className: "buttons" },
      h(
        "button",
        { type: "button", onClick: () => onExport("obj") },
        "Download OBJ"
      ),
      h(
        "button",
        { type: "button", onClick: () => onExport("stl") },
        "Download STL"
      ),
      h(
        "button",
        { type: "button", onClick: onReset },
        "Reset Defaults"
      )
    ),
    h("div", { className: "meta" }, h("pre", null, JSON.stringify(params, null, 2)))
  );
}

export default function App() {
  const brushRef = React.useRef();
  const reset = useParams((state) => state.reset);

  const exporters = React.useMemo(
    () => ({ obj: new OBJExporter(), stl: new STLExporter() }),
    []
  );

  const handleExport = React.useCallback(
    (format) => {
      const group = brushRef.current;
      if (!group) return;

      group.updateMatrixWorld(true);

      let data;
      let mime = "text/plain";
      let filename = `toothbrush.${format}`;

      if (format === "obj") {
        data = exporters.obj.parse(group);
      } else if (format === "stl") {
        const result = exporters.stl.parse(group, { binary: false });
        data = typeof result === "string" ? result : new TextDecoder().decode(result);
        mime = "model/stl";
      } else {
        return;
      }

      const blob = new Blob([data], { type: mime });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      anchor.click();
      URL.revokeObjectURL(url);
    },
    [exporters]
  );

  const handleReset = React.useCallback(() => {
    reset();
  }, [reset]);

  return h(
    "div",
    { className: "layout" },
    h(
      "div",
      { className: "left" },
      h(
        Canvas,
        {
          shadows: true,
          camera: { position: [120, 120, 180], fov: 40 },
          style: { width: "100%", height: "100%" },
        },
        h("color", { args: ["#0b0e13"], attach: "background" }),
        h(
          React.Suspense,
          { fallback: null },
          h("ambientLight", { intensity: 0.6 }),
          h("directionalLight", {
            intensity: 0.8,
            position: [120, 200, 100],
            castShadow: true,
          }),
          h(Environment, { preset: "city" }),
          h("gridHelper", { args: [600, 60], position: [0, -40, 0] }),
          h(Toothbrush, { ref: brushRef }),
          h(
            "mesh",
            {
              rotation: [-Math.PI / 2, 0, 0],
              position: [0, -40.5, 0],
              receiveShadow: true,
            },
            h("planeGeometry", { args: [600, 600] }),
            h("shadowMaterial", { opacity: 0.25 })
          )
        ),
        h(OrbitControls, { makeDefault: true })
      )
    ),
    h(ControlsPanel, { onExport: handleExport, onReset: handleReset })
  );
}
