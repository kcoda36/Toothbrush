import React from "https://esm.sh/react@18.2.0?dev";
import { Canvas } from "https://esm.sh/@react-three/fiber@8.15.13?deps=react@18.2.0,three@0.160.0&bundle";
import { OrbitControls } from "https://esm.sh/@react-three/drei@9.103.0?deps=@react-three/fiber@8.15.13,react@18.2.0,three@0.160.0&bundle";
import { OBJExporter } from "https://esm.sh/three@0.160.0/examples/jsm/exporters/OBJExporter.js";
import { STLExporter } from "https://esm.sh/three@0.160.0/examples/jsm/exporters/STLExporter.js";

import Toothbrush, { ToothbrushEnvironment } from "./ToothbrushScene.js";
import { defaultToothbrushParams, sliderGroups } from "./parameterConfig.js";

const h = React.createElement;

function formatValue(value, step) {
  const decimals = step && step < 1 ? Math.ceil(Math.log10(1 / step)) : 0;
  return value.toFixed(decimals);
}

function App() {
  const [params, setParams] = React.useState(defaultToothbrushParams);
  const toothbrushRef = React.useRef(null);

  const handleSliderChange = React.useCallback(
    (key) => (event) => {
      const nextValue = parseFloat(event.target.value);
      setParams((current) => ({ ...current, [key]: nextValue }));
    },
    []
  );

  const downloadModel = React.useCallback((format) => {
    const group = toothbrushRef.current && toothbrushRef.current.object;
    if (!group) return;

    group.updateMatrixWorld(true);
    let data;
    let fileName = `toothbrush-${format}.${format}`;
    let mimeType = "text/plain";

    if (format === "obj") {
      const exporter = new OBJExporter();
      data = exporter.parse(group);
      mimeType = "text/plain";
    } else if (format === "stl") {
      const exporter = new STLExporter();
      const stlString = exporter.parse(group);
      data = stlString;
      mimeType = "application/vnd.ms-pki.stl";
    } else {
      return;
    }

    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(url);
  }, []);

  const sliderElements = sliderGroups.map((group) =>
    h(
      React.Fragment,
      { key: group.title },
      h("h2", null, group.title),
      ...group.sliders.map((slider) =>
        h(
          "div",
          { className: "slider-group", key: slider.key },
          h(
            "label",
            { htmlFor: slider.key },
            slider.label,
            h(
              "output",
              { htmlFor: slider.key },
              `${formatValue(params[slider.key], slider.step || 1)}${
                slider.unit ? ` ${slider.unit}` : ""
              }`
            )
          ),
          h("input", {
            type: "range",
            id: slider.key,
            min: slider.min,
            max: slider.max,
            step: slider.step || 1,
            value: params[slider.key],
            onChange: handleSliderChange(slider.key),
          })
        )
      )
    )
  );

  return h(
    React.Fragment,
    null,
    h(
      "div",
      { className: "app-shell" },
      h(
        "div",
        { className: "canvas-container" },
        h(
          Canvas,
          {
            shadows: true,
            camera: { position: [140, 160, 240], fov: 35, near: 0.1, far: 2000 },
          },
          h(
            React.Suspense,
            { fallback: null },
            h(ToothbrushEnvironment),
            h(Toothbrush, { params, ref: toothbrushRef }),
            h(
              "mesh",
              {
                rotation: [-Math.PI / 2, 0, 0],
                position: [0, -110, 0],
                receiveShadow: true,
              },
              h("planeGeometry", { args: [600, 600] }),
              h("shadowMaterial", { opacity: 0.25 })
            )
          ),
          h(OrbitControls, {
            enablePan: false,
            minDistance: 120,
            maxDistance: 420,
            maxPolarAngle: Math.PI / 2.1,
          })
        )
      ),
      h(
        "aside",
        { className: "controls-panel" },
        h("h1", null, "Toothbrush Parametric Lab"),
        h(
          "p",
          null,
          "Adjust handle, head, and bristle parameters to explore toothbrush ergonomics."
        ),
        sliderElements,
        h(
          "div",
          { className: "download-controls" },
          h(
            "button",
            { type: "button", onClick: () => downloadModel("obj") },
            "Download OBJ"
          ),
          h(
            "button",
            { type: "button", onClick: () => downloadModel("stl") },
            "Download STL"
          )
        )
      )
    ),
    h(
      "footer",
      { className: "footer-note" },
      "Dimensions start with adult toothbrush defaults. Adjust sliders to tailor sizes in millimeters."
    )
  );
}

export default App;
