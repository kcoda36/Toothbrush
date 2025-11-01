# Toothbrush Designer

This project contains a browser-based parametric toothbrush designer built with React and Three.js. It renders a custom 3D toothbrush model that can be tuned with intuitive sliders and exported to OBJ or STL for further editing or 3D printing.

## Features

- ✅ Adjustable geometric parameters for the handle, head, and bristles using responsive sliders.
- ✅ Real-time 3D visualization with orbit controls, soft lighting, and ground shadows.
- ✅ Parametric bristle distribution constrained to the toothbrush head, including tilt and density controls.
- ✅ One-click export of the generated geometry to **OBJ** or **STL** formats.
- ✅ Default measurements based on standard adult toothbrush dimensions, with optional tweaks for custom designs.

## Getting Started

The project is framework-agnostic and relies on ESM builds served from public CDNs, so you can open it directly in a modern browser without a bundler.

1. Serve the repository or open `index.html` directly in a browser that supports ES modules.
2. Adjust the sliders in the left panel to modify the toothbrush.
3. Use the export button to download your model as OBJ or STL.

> **Tip:** When serving locally, any static file server will work (e.g. `python -m http.server` from the project root).

## File Overview

- `index.html` – entry point that loads the React application.
- `src/styles.css` – layout and styling for the control panel and canvas.
- `src/main.jsx` – bootstraps the React application.
- `src/App.jsx` – coordinates parameter state, controls, and the canvas.
- `src/components/ParameterControls.jsx` – slider UI and download controls.
- `src/components/ToothbrushCanvas.jsx` – sets up Three.js, renders the toothbrush, and handles exports.
- `src/config/toothbrushParameters.js` – default values and slider ranges.
- `src/three/buildToothbrush.js` – procedural geometry builder for the toothbrush.

## Assets & Credits

The default dimensions are inspired by widely used ergonomic toothbrush references for adult and youth models.
