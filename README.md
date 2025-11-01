# Parametric Toothbrush Lab

This project hosts a browser-based parametric toothbrush designer built with React, Three.js, and @react-three/fiber delivered via ES module CDNs. Adjust the brush dimensions and bristle layout in real time, then export the geometry as OBJ or STL.

## Getting started

The app is completely static and relies on online ES module CDNs. To preview locally you only need Node.js (v18+) to run the lightweight static file server included in the repo.

```bash
npm run start
```

Then open [http://localhost:4173](http://localhost:4173) in your browser.

> **Note:** Because dependencies are loaded from `esm.sh`, the development machine must have internet access.

## Features

- Adjustable handle, neck, head, and bristle parameters that stay constrained to realistic toothbrush proportions.
- Instanced bristle geometry that updates interactively to reflect slider changes.
- Export the current toothbrush configuration as either an OBJ or STL file.
- Physically-inspired lighting with orbit controls for inspecting the model from every angle.

## Project structure

```
index.html          # Entry point with root container
server.mjs          # Minimal static file server for local preview
src/
  App.js            # React application shell and UI controls
  main.js           # React entry point
  styles.css        # Layout and styling for app shell and controls
  parameterConfig.js# Default parameter values and slider metadata
  ToothbrushScene.js# Three.js toothbrush construction and lighting
```

## Default dimensions

Adult toothbrush proportions (derived from the provided diagram) are used as the baseline:

- Handle length: 195 mm
- Head length: 29 mm
- Head width: 12 mm
- Neck length: 15 mm
- Bristle rows × columns: 4 × 10
- Bristle radius: 1.4 mm

Use the sliders to explore alternative ergonomics while staying close to practical sizes.
