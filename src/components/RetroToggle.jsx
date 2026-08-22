import { useState } from "react";
import { getRetroPref, setRetroPref } from "../utils/retro";

// Rendered once at the top level (see main.jsx) so it survives route
// changes and controls the site-wide retro skin via the `data-retro`
// attribute on <html> (see retro.css).
function RetroToggle() {
  const [retro, setRetro] = useState(getRetroPref);

  const toggle = () => {
    const next = !retro;
    setRetro(next);
    setRetroPref(next);
  };

  return (
    <>
      <button
        onClick={toggle}
        aria-pressed={retro}
        title={retro ? "Return to the future" : "Take me back to 1998"}
        className="site-retro-toggle fixed top-4 left-4 z-[9999] rounded border border-zinc-700 bg-zinc-900/80 px-3 py-1.5 text-xs font-mono text-zinc-300 backdrop-blur hover:border-red-500 hover:text-red-400 transition"
      >
        {retro ? "⏻ exit_retro.exe" : "◧ retro_mode.exe"}
      </button>

      {retro && (
        <>
          {/* Yes, an actual <marquee>. Legacy tag, still renders. That's the joke. */}
          <marquee className="retro-marquee" scrollamount="4">
            🚧 UNDER CONSTRUCTION 🚧 &nbsp; BEST VIEWED IN NETSCAPE NAVIGATOR 4.0 AT 800x600 &nbsp; 🚧
            &nbsp; <a href="/contact">SIGN MY GUESTBOOK</a> &nbsp; 🚧 &nbsp; POWERED BY A 56K MODEM
            &nbsp; 🚧
          </marquee>

          <div className="retro-hitcounter fixed bottom-4 right-4 z-[9998] text-center">
            <div className="retro-hitcounter-label">YOU ARE VISITOR</div>
            <div className="retro-counter-digits">013337</div>
          </div>
        </>
      )}
    </>
  );
}

export default RetroToggle;
