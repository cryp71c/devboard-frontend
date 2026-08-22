import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

function App() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      <Helmet>
        <title>cryp71c — Offensive Security Analyst & Backend Developer</title>
      </Helmet>

      {/* Ambient backdrop — static, not animated. A quiet vignette instead
          of the earlier pulsing/rotating orb: presence without motion. */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle at center, rgba(127,29,29,0.25) 0%, rgba(0,0,0,0) 60%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 2px)",
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 text-center space-y-6 px-4">
        <h1 className="text-5xl font-bold leading-[1.2] py-1 text-red-400">
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
          <Link to="/projects" className="btn-primary w-48 px-5 py-3 text-sm font-medium">
            View Projects
          </Link>
          <Link to="/contact" className="btn-ghost w-48 px-5 py-3 text-sm font-medium">
            Get In Touch
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;
