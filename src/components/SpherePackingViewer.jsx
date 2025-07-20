import { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const PackedSpheres = ({ positions, radius }) => {
  const meshRef = useRef();
  useEffect(() => {
    if (!meshRef.current || !positions.length) return;
    const temp = new THREE.Object3D();
    positions.forEach((pos, i) => {
      temp.position.set(...pos);
      temp.updateMatrix();
      meshRef.current.setMatrixAt(i, temp.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [positions]);

  return (
    <instancedMesh ref={meshRef} args={[null, null, positions.length]}>
      <sphereGeometry args={[radius, 18, 18]} />
      <meshStandardMaterial color="deepskyblue" metalness={0.3} roughness={0.6} />
    </instancedMesh>
  );
};

function estimateSphereCount(length, width, height, diameter) {
  const r = diameter / 2;
  const x = Math.floor(length / (2 * r));
  const y = Math.floor(width / (2 * r));
  const z = Math.floor(height / (Math.sqrt(2) * r));
  return x * y * z;
}

export default function SpherePackingViewer() {
  const [boxLength, setBoxLength] = useState(100);
  const [boxWidth, setBoxWidth] = useState(100);
  const [boxHeight, setBoxHeight] = useState(100);
  const [diameter, setDiameter] = useState(10);
  const [positions, setPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const radius = diameter / 2;
  const sphereLimit = 5000;

  const generateSpheres = () => {
    setIsLoading(true);
    const worker = new Worker("/sphereWorker.js");
    worker.postMessage({
      length: boxLength,
      width: boxWidth,
      height: boxHeight,
      diameter,
      limit: sphereLimit,
    });
    worker.onmessage = (e) => {
      const result = e.data;
      const limited = result.slice(0, sphereLimit);
      setPositions(limited);
      setIsLoading(false);
      worker.terminate();
    };
  };

  useEffect(() => {
    generateSpheres();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => generateSpheres(), 300);
    return () => clearTimeout(delay);
  }, [boxLength, boxWidth, boxHeight, diameter]);

  const estimatedCount = estimateSphereCount(boxLength, boxWidth, boxHeight, diameter);
  const center = [boxLength / 2, boxWidth / 2, boxHeight / 2];

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto p-4 text-white">
      <div className="flex-1 space-y-6">
        <div className="h-[600px] border border-slate-700 shadow-xl rounded-xl overflow-hidden">
          <Canvas camera={{ position: [center[0], center[1], center[2] + 300], fov: 70 }}>
            <ambientLight intensity={0.9} />
            <directionalLight position={[10, 10, 10]} intensity={0.6} />
            <pointLight position={[0, 100, 0]} intensity={0.4} />
            <OrbitControls target={center} />
            <PackedSpheres positions={positions} radius={radius} />
            <mesh position={center}>
              <boxGeometry args={[boxLength, boxWidth, boxHeight]} />
              <meshBasicMaterial color="gray" wireframe transparent opacity={0.2} />
            </mesh>
          </Canvas>
        </div>

        <div className="text-sm text-gray-300 text-center">
          Total spheres: {positions.length.toLocaleString()} / {sphereLimit}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <label>Length (cm)</label>
            <input type="range" min={50} max={300} value={boxLength} onChange={(e) => {
              const newVal = Number(e.target.value);
              if (estimateSphereCount(newVal, boxWidth, boxHeight, diameter) <= sphereLimit)
                setBoxLength(newVal);
            }} className="w-full" />
            <div>{boxLength.toFixed(1)} cm</div>
          </div>
          <div>
            <label>Width (cm)</label>
            <input type="range" min={50} max={300} value={boxWidth} onChange={(e) => {
              const newVal = Number(e.target.value);
              if (estimateSphereCount(boxLength, newVal, boxHeight, diameter) <= sphereLimit)
                setBoxWidth(newVal);
            }} className="w-full" />
            <div>{boxWidth.toFixed(1)} cm</div>
          </div>
          <div>
            <label>Height (cm)</label>
            <input type="range" min={50} max={300} value={boxHeight} onChange={(e) => {
              const newVal = Number(e.target.value);
              if (estimateSphereCount(boxLength, boxWidth, newVal, diameter) <= sphereLimit)
                setBoxHeight(newVal);
            }} className="w-full" />
            <div>{boxHeight.toFixed(1)} cm</div>
          </div>
          <div>
            <label>Sphere Diameter (cm)</label>
            <input type="range" min={2} max={20} step={0.5} value={diameter} onChange={(e) => {
              const newVal = Number(e.target.value);
              if (estimateSphereCount(boxLength, boxWidth, boxHeight, newVal) <= sphereLimit)
                setDiameter(newVal);
            }} className="w-full" />
            <div>{diameter.toFixed(1)} cm</div>
          </div>
        </div>

        {estimatedCount > sphereLimit && (
          <div className="text-red-400 text-sm text-center">
            ⚠️ Max sphere limit reached: {estimatedCount} &gt; {sphereLimit}. Reduce box size or increase diameter.
          </div>
        )}
      </div>

      <div className="w-full lg:max-w-sm bg-slate-800 p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-2 text-indigo-400">About this Project</h2>
        <p className="text-sm text-gray-300 leading-relaxed">
          This interactive tool demonstrates a <strong>sphere packing algorithm</strong> written in C++ and ported to the web.
          It calculates how many equal-sized spheres can fit inside a rectangular box,
          using a hexagonal close-packed stacking method similar to how oranges are stacked in a crate.
        </p>
        <p className="mt-4 text-sm text-gray-400">
          Try adjusting the dimensions and sphere diameter using the sliders to see how the packing density changes.
          The algorithm runs in a background thread (Web Worker) for optimal performance.
        </p>
        <p className="mt-4 text-xs text-gray-500 italic">
          Originally written to test math and spatial reasoning in 3D, this became a fun performance & UI challenge. 
          But it started as a curious thought late one night in my dorm: “How many tennis balls could fit in my room?”
          That simple question led me to discover the fascinating world of sphere packing, and eventually to share this
          project and story during an interview — which helped me land my current role in tech.
        </p>
        <p className="mt-4 text-sm text-gray-400">
          Learn more about sphere packing on <a href="https://mathworld.wolfram.com/SpherePacking.html" className="text-indigo-300 hover:underline">MathWorld Wolfram</a>.
        </p>
        <p className="mt-4 text-sm text-gray-400">
          MIT's exploration of Sphere Packing can be found in this <a href="https://math.mit.edu/classes/18.095/2015IAP/lecture6/lect_notes.pdf" className="text-indigo-300 hover:underline">lecture note</a>.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="bg-indigo-700 text-white px-2 py-1 rounded">C++</span>
          <span className="bg-blue-600 text-white px-2 py-1 rounded">WebGL</span>
          <span className="bg-purple-600 text-white px-2 py-1 rounded">React</span>
          <span className="bg-gray-600 text-white px-2 py-1 rounded">Three.js</span>
        </div>

        <a
          href="https://github.com/cryp71c/SpherePacking"
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-4 text-sm text-indigo-300 hover:text-indigo-400"
        >
          View C++ Source Code on GitHub →
        </a>
      </div>
    </div>
  );
}
