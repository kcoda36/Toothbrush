import React, { useState, useCallback, useRef } from 'https://esm.sh/react@18.2.0';
import ParameterControls from './components/ParameterControls.jsx';
import ToothbrushCanvas from './components/ToothbrushCanvas.jsx';
import { defaultParameters, parameterRanges } from './config/toothbrushParameters.js';

const App = () => {
  const [parameters, setParameters] = useState(defaultParameters);
  const [format, setFormat] = useState('obj');
  const canvasRef = useRef(null);

  const handleParameterChange = useCallback((name, value) => {
    setParameters((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleDownload = useCallback(
    (targetFormat) => {
      canvasRef.current?.downloadModel(targetFormat);
    },
    []
  );

  return (
    <>
      <ParameterControls
        parameters={parameters}
        onParameterChange={handleParameterChange}
        parameterRanges={parameterRanges}
        format={format}
        setFormat={setFormat}
        onDownload={handleDownload}
      />
      <div className="canvas-panel">
        <ToothbrushCanvas ref={canvasRef} parameters={parameters} />
      </div>
    </>
  );
};

export default App;
