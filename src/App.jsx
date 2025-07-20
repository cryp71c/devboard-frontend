import { useState } from "react";
import { useNavigate } from "react-router-dom";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [orbKey, setOrbKey] = useState(0);
  const navigate = useNavigate();

  const handleClick = (path) => {
    if (isLoading) return;

    setIsLoading(true);
    setOrbKey((prev) => prev + 1); // restart animation
    setTimeout(() => {
      navigate(path);
    }, 2500); // match swirl duration
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
      {/* Orb Container - Forces perfect centering */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div
          key={orbKey}
          className={`w-[400px] h-[400px] rounded-full transition-all duration-500
            ${isLoading ? "animate-collapse-spin" : "animate-idle-rotate-pulse"}`}
          style={{
            background: "conic-gradient(from 90deg at center, #4f46e5, #ec4899, #0ea5e9, #4f46e5)",
            filter: "blur(160px) brightness(120%) contrast(130%)",
            mixBlendMode: "screen",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center space-y-6 px-4">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500">
          Alex Rapino
        </h1>
        <p className="text-lg text-gray-400">
          Cybersecurity Analyst | Backend Developer | Computer Engineer
        </p>
        <p className="text-lg text-gray-400">
          Welcome to my portfolio! Explore my experiences, projects, and resume.
          <br />
          Click the buttons below to navigate.
          <br />
          This site is currently under construction, but feel free to explore!
        </p>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => handleClick("/experiences")}
            className="bg-indigo-600 px-5 py-2 rounded text-white hover:bg-indigo-700 transition"
          >
            Experiences
          </button>
          <button
            onClick={() => handleClick("/projects")}
            className="bg-indigo-600 px-5 py-2 rounded text-white hover:bg-indigo-700 transition"
          >
            Projects
          </button>
          <button
            onClick={() => handleClick("/resume")}
            className="bg-indigo-600 px-5 py-2 rounded text-white hover:bg-indigo-700 transition"
          >
            Resume
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
