export const defaultParams = {
  handleLength: 190,
  handleWidth: 14,
  handleThickness: 6,
  headLength: 28,
  headWidth: 13,
  headThickness: 6,
  bristleCount: 900,
  bristleRadius: 0.5,
  bristleHeight: 10,
  metalness: 0.1,
  roughness: 0.8,
};

export const paramMetadata = [
  {
    title: "Handle",
    sliders: [
      { key: "handleLength", label: "Handle Length", min: 120, max: 220, step: 1, unit: "mm" },
      { key: "handleWidth", label: "Handle Width", min: 8, max: 20, step: 0.5, unit: "mm" },
      { key: "handleThickness", label: "Handle Thickness", min: 3, max: 10, step: 0.5, unit: "mm" },
    ],
  },
  {
    title: "Head",
    sliders: [
      { key: "headLength", label: "Head Length", min: 20, max: 40, step: 0.5, unit: "mm" },
      { key: "headWidth", label: "Head Width", min: 8, max: 20, step: 0.5, unit: "mm" },
      { key: "headThickness", label: "Head Thickness", min: 3, max: 10, step: 0.5, unit: "mm" },
    ],
  },
  {
    title: "Bristles",
    sliders: [
      { key: "bristleCount", label: "Bristle Count", min: 50, max: 1600, step: 10 },
      { key: "bristleRadius", label: "Bristle Radius", min: 0.2, max: 1.5, step: 0.1, unit: "mm" },
      { key: "bristleHeight", label: "Bristle Height", min: 4, max: 14, step: 0.5, unit: "mm" },
    ],
  },
];
