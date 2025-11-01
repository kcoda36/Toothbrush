import React from 'https://esm.sh/react@18.2.0';

const ControlSlider = ({ label, name, value, onChange, range }) => {
  const { min, max, step, unit } = range;
  return (
    <div className="slider">
      <label htmlFor={name}>
        <span>{label}</span>
        <small>
          {value}
          {unit && ` ${unit}`}
        </small>
      </label>
      <input
        id={name}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(name, parseFloat(event.target.value))}
      />
    </div>
  );
};

const ParameterControls = ({ parameters, onParameterChange, parameterRanges, format, setFormat, onDownload }) => {
  const sliderEntries = [
    { label: 'Handle Length', name: 'handleLength' },
    { label: 'Handle Width', name: 'handleWidth' },
    { label: 'Handle Thickness', name: 'handleThickness' },
    { label: 'Indent Depth', name: 'indentDepth' },
    { label: 'Indent Length', name: 'indentLength' },
    { label: 'Head Length', name: 'headLength' },
    { label: 'Head Width', name: 'headWidth' },
    { label: 'Head Thickness', name: 'headThickness' },
    { label: 'Bristle Rows', name: 'bristleRows' },
    { label: 'Bristle Columns', name: 'bristleColumns' },
    { label: 'Bristle Radius', name: 'bristleRadius' },
    { label: 'Bristle Height', name: 'bristleHeight' },
    { label: 'Bristle Tilt', name: 'bristleTilt' },
    { label: 'Bristle Margin', name: 'bristleMargin' },
    { label: 'Bristle Spacing Factor', name: 'bristleSpacingFactor' },
  ];

  return (
    <div className="controls-panel">
      <h1>Parametric Toothbrush</h1>
      <p>
        Adjust the geometry sliders to explore different toothbrush designs. The 3D
        preview updates instantly and you can export the mesh as OBJ or STL for
        further modeling or printing.
      </p>
      <div className="slider-group">
        {sliderEntries.map(({ label, name }) => (
          <ControlSlider
            key={name}
            label={label}
            name={name}
            value={parameters[name]}
            onChange={onParameterChange}
            range={parameterRanges[name]}
          />
        ))}
      </div>
      <div className="download-controls">
        <select value={format} onChange={(event) => setFormat(event.target.value)}>
          <option value="obj">Wavefront OBJ (.obj)</option>
          <option value="stl">STereoLithography (.stl)</option>
        </select>
        <button type="button" onClick={() => onDownload(format)}>
          Download Toothbrush Model
        </button>
      </div>
    </div>
  );
};

export default ParameterControls;
