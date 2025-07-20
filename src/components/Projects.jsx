import { Link } from "react-router-dom";
import SpherePackingViewer from "../components/SpherePackingViewer";

function Projects() {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-6">
      <h1 className="text-4xl font-bold text-center text-indigo-400 mb-4">
        Projects
      </h1>
      <p className="text-center max-w-2xl mx-auto text-gray-300 mb-12">
        A showcase of interactive and technical projects exploring algorithms, visuals, and web technologies.
      </p>

      <div className="grid grid-cols-1 gap-10 max-w-7xl mx-auto">
        {/* Project Card */}
        <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-2xl font-semibold text-indigo-300">Sphere Packing Visualizer</h2>
            <p className="text-sm text-gray-400 mt-1">
              Visualizes a 3D sphere packing algorithm using WebGL and Web Workers.
            </p>
          </div>
          <div className="p-6">
            <SpherePackingViewer />
          </div>
        </div>

        {/* Add more project containers below this */}
        {/* <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden">...</div> */}
      </div>

      <div className="text-center mt-12">
        <Link
          to="/"
          className="inline-block px-5 py-2 bg-indigo-600 rounded-md hover:bg-indigo-700 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default Projects;
