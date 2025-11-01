import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'https://esm.sh/react@18.2.0';
import * as THREE from 'https://esm.sh/three@0.162.0';
import { OrbitControls } from 'https://unpkg.com/three@0.162.0/examples/jsm/controls/OrbitControls.js?module';
import { buildToothbrush } from '../three/buildToothbrush.js';

const ToothbrushCanvas = forwardRef(({ parameters }, ref) => {
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const controlsRef = useRef(null);
  const modelRef = useRef(null);
  const animationRef = useRef(null);

  const initializeScene = () => {
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f4ff);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 2000);
    camera.position.set(160, 140, 200);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(180, 220, 160);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.set(2048, 2048);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-160, 80, -140);
    scene.add(fillLight);

    const ambient = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambient);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(800, 800),
      new THREE.ShadowMaterial({ color: 0x8a99af, opacity: 0.18 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -40;
    ground.receiveShadow = true;
    scene.add(ground);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, parameters.handleLength / 2, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.04;
    controls.minDistance = 120;
    controls.maxDistance = 420;

    rendererRef.current = renderer;
    sceneRef.current = scene;
    controlsRef.current = controls;
    scene.userData.camera = camera;
  };

  const resizeRenderer = () => {
    const canvas = canvasRef.current;
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = scene?.userData?.camera;

    if (!canvas || !renderer || !camera) {
      return;
    }

    const width = canvas.clientWidth || canvas.parentElement.offsetWidth;
    const height = canvas.clientHeight || canvas.parentElement.offsetHeight || 600;

    if (canvas.width !== width || canvas.height !== height) {
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
  };

  const updateModel = () => {
    const scene = sceneRef.current;
    if (!scene) {
      return;
    }

    if (modelRef.current) {
      scene.remove(modelRef.current);
    }

    const toothbrush = buildToothbrush(parameters);
    toothbrush.position.y = 20;
    toothbrush.rotation.x = THREE.MathUtils.degToRad(-18);
    toothbrush.rotation.z = THREE.MathUtils.degToRad(12);

    scene.add(toothbrush);
    modelRef.current = toothbrush;
  };

  const animate = () => {
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = scene?.userData?.camera;
    const controls = controlsRef.current;

    if (!renderer || !scene || !camera) {
      return;
    }

    resizeRenderer();

    if (controls) {
      controls.update();
    }

    renderer.render(scene, camera);
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    initializeScene();
    updateModel();
    animate();

    const handleResize = () => resizeRenderer();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      rendererRef.current?.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateModel();
    if (controlsRef.current) {
      controlsRef.current.target.set(0, parameters.handleLength / 2, 0);
    }
  }, [parameters]);

  useImperativeHandle(
    ref,
    () => ({
      async downloadModel(format = 'obj') {
        if (!modelRef.current) {
          return;
        }

        if (format === 'obj') {
          const { OBJExporter } = await import(
            'https://unpkg.com/three@0.162.0/examples/jsm/exporters/OBJExporter.js?module'
          );
          const exporter = new OBJExporter();
          const result = exporter.parse(modelRef.current);
          const blob = new Blob([result], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'toothbrush.obj';
          link.click();
          URL.revokeObjectURL(url);
        } else {
          const { STLExporter } = await import(
            'https://unpkg.com/three@0.162.0/examples/jsm/exporters/STLExporter.js?module'
          );
          const exporter = new STLExporter();
          const result = exporter.parse(modelRef.current, { binary: false });
          const blob = new Blob([result], { type: 'application/sla' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'toothbrush.stl';
          link.click();
          URL.revokeObjectURL(url);
        }
      },
    }),
    []
  );

  return <canvas ref={canvasRef} />;
});

export default ToothbrushCanvas;
