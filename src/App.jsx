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
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* Orb Container - Forces perfect centering */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div
          key={orbKey}
          className={`w-[400px] h-[400px] rounded-full transition-all duration-500
            ${isLoading ? "animate-collapse-spin" : "animate-idle-rotate-pulse"}`}
          style={{
            background: "conic-gradient(from 90deg at center, #dc2626, #450a0a, #71717a, #dc2626)",
            filter: "blur(160px) brightness(120%) contrast(130%)",
            mixBlendMode: "screen",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center space-y-6 px-4">
        <h1 className="text-5xl font-extrabold leading-[1.2] py-1 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-zinc-200 to-red-600 drop-shadow-[0_0_25px_rgba(220,38,38,0.35)]">
          cryp71c
        </h1>
        <p className="text-lg text-zinc-400">
          Cybersecurity Analyst | Backend Developer | Computer Engineer
        </p>
        <p className="text-lg text-zinc-400">
          Welcome to my portfolio! Explore my projects, blog, and security work.
          <br />
          Click the buttons below to navigate.
          <br />
          This site is currently under construction, but feel free to explore!
        </p>

        <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
          <button
            onClick={() => handleClick("/projects")}
            className="w-56 bg-gradient-to-b from-red-500 to-red-800 border border-red-900/60 px-5 py-2 rounded text-white font-medium shadow-lg shadow-red-950/50 hover:from-red-400 hover:to-red-700 transition"
          >
            Projects
          </button>
          <button
            onClick={() => handleClick("/blog")}
            className="w-56 bg-gradient-to-b from-red-500 to-red-800 border border-red-900/60 px-5 py-2 rounded text-white font-medium shadow-lg shadow-red-950/50 hover:from-red-400 hover:to-red-700 transition"
          >
            Blog
          </button>
          <button
            onClick={() => handleClick("/htb")}
            className="w-56 bg-gradient-to-b from-red-500 to-red-800 border border-red-900/60 px-5 py-2 rounded text-white font-medium shadow-lg shadow-red-950/50 hover:from-red-400 hover:to-red-700 transition"
          >
            Security Lab
          </button>
          <button
            onClick={() => handleClick("/certifications")}
            className="w-56 bg-gradient-to-b from-red-500 to-red-800 border border-red-900/60 px-5 py-2 rounded text-white font-medium shadow-lg shadow-red-950/50 hover:from-red-400 hover:to-red-700 transition"
          >
            Certifications
          </button>
          <button
            onClick={() => handleClick("/contact")}
            className="w-56 bg-gradient-to-b from-red-500 to-red-800 border border-red-900/60 px-5 py-2 rounded text-white font-medium shadow-lg shadow-red-950/50 hover:from-red-400 hover:to-red-700 transition"
          >
            Contact
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
