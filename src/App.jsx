import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

function App() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      <Helmet>
        <title>cryp71c — Offensive Security Analyst & Backend Developer</title>
      </Helmet>
      {/* Orb Container - ambient only now that Nav handles navigation;
          no click-to-collapse animation gating the actual page change. */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div
          className="w-[400px] h-[400px] rounded-full animate-idle-rotate-pulse"
          style={{
            background: "conic-gradient(from 90deg at center, #dc2626, #450a0a, #71717a, #dc2626)",
            filter: "blur(160px) brightness(120%) contrast(130%)",
            mixBlendMode: "screen",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center space-y-6 px-4">
        <h1 className="text-5xl font-extrabold leading-[1.2] py-1 text-red-400 drop-shadow-[0_0_35px_rgba(220,38,38,0.6)]">
          cryp71c
        </h1>
        <p className="text-lg text-zinc-400">
        Offensive Security Analyst | Backend Developer | Computer Engineer
        </p>

        <p className="text-lg text-zinc-400">
          I build things, break things, and occasionally discover those were the same step.
        </p>

        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
          Mostly security research, low-level code, firmware, and questionable amounts of soldering.
          The projects below are what survived long enough to get documented.
        </p>

        <div className="flex flex-wrap justify-center gap-4 max-w-xl mx-auto pt-2">
          <Link
            to="/projects"
            className="w-48 bg-red-700 bg-gradient-to-b from-red-500 to-red-800 border border-red-900/60 px-5 py-3 rounded text-white font-medium shadow-lg shadow-red-950/50 hover:from-red-400 hover:to-red-700 transition"
          >
            View Projects
          </Link>
          <Link
            to="/contact"
            className="w-48 bg-zinc-900 border border-zinc-700 px-5 py-3 rounded text-white font-medium hover:bg-zinc-800 hover:border-red-600 transition"
          >
            Get In Touch
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;
