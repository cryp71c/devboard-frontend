import { useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SpherePackingViewer from "../components/SpherePackingViewer";
import { CATEGORIES, categoryBadgeClass } from "../utils/categories";

// Lazy-loaded: pulls in a small WASM module. Kept out of the main bundle
// the same way Projects itself is kept out of every other page's bundle.
const Crc32cDemo = lazy(() => import("./Crc32cDemo.jsx"));

const PROJECT_CATEGORIES = {
  "sphere-packing": "Personal",
  mmfs: "College",
  "midnight-madness": "College",
  ruff: "Security Research",
  saml: "Security Research",
  "lipo-charger": "Personal",
};

// Status badges use a separate escalation from category badges (Completed =
// green success, In Progress = red/active, Early Research = chrome/not-yet-
// solid) so the two badge types never share a color on the same card.
const STATUS_STYLES = {
  Completed: "bg-green-900/50 text-green-300 border-green-700",
  "In Progress": "bg-red-900/50 text-red-300 border-red-700",
  "Early Research": "bg-zinc-800 text-zinc-300 border-zinc-500",
};
const statusBadgeClass = (status) =>
  `px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${STATUS_STYLES[status]}`;

function Projects() {
  const [categoryFilter, setCategoryFilter] = useState("all");

  const isVisible = (key) => categoryFilter === "all" || PROJECT_CATEGORIES[key] === categoryFilter;

  return (
    <div className="min-h-screen bg-black text-white py-12 px-6">
      <Helmet>
        <title>Projects | cryp71c.dev</title>
      </Helmet>
      <div className="max-w-7xl mx-auto">
        <Link to="/" className="text-red-500 hover:underline block mb-6">
          ← Back
        </Link>
      </div>
      <h1 className="text-4xl font-bold leading-[1.2] py-1 text-center mb-4 text-red-400">
        Projects
      </h1>
      <p className="text-center max-w-2xl mx-auto text-zinc-300 mb-8">
        A showcase of interactive, systems-level, and technical projects — algorithms, visuals,
        file systems, low-level assembly, and hardware.
      </p>

      {/* Featured: Live WASM Demo — always visible regardless of category filter */}
      <div className="max-w-7xl mx-auto mb-12 bg-gradient-to-b from-zinc-800 to-zinc-900 border border-zinc-700 rounded-2xl shadow-lg shadow-black/50 overflow-hidden">
        <div className="p-6 pb-0">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h2 className="text-2xl font-semibold text-red-300">CRC32C — Live in Your Browser</h2>
            <span className={categoryBadgeClass("Personal")}>Personal</span>
            <span className="px-3 py-1 bg-yellow-900/50 text-yellow-300 border border-yellow-700 rounded-full text-xs font-semibold whitespace-nowrap">
              ⭐ Featured
            </span>
          </div>
        </div>
        <div className="p-6">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-24 bg-black/40 rounded-xl border border-zinc-700">
                <div className="h-6 w-6 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
              </div>
            }
          >
            <Crc32cDemo />
          </Suspense>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex justify-center gap-3 mb-12 flex-wrap">
        <button
          onClick={() => setCategoryFilter("all")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            categoryFilter === "all"
              ? "bg-red-600 bg-gradient-to-b from-red-500 to-red-700 text-white"
              : "bg-zinc-900 text-zinc-300 border border-zinc-700 hover:bg-zinc-800"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setCategoryFilter(category)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              categoryFilter === category
                ? "bg-red-600 bg-gradient-to-b from-red-500 to-red-700 text-white"
                : "bg-zinc-900 text-zinc-300 border border-zinc-700 hover:bg-zinc-800"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-10 max-w-7xl mx-auto">
        {/* Empty State */}
        {!Object.keys(PROJECT_CATEGORIES).some(isVisible) && (
          <div className="text-center py-12">
            <p className="text-zinc-400 text-lg">No projects in this category yet.</p>
          </div>
        )}

        {/* MCP73831 LiPo Charger Card */}
        {isVisible("lipo-charger") && (
        <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 border border-zinc-700 rounded-2xl shadow-lg shadow-black/50 overflow-hidden">
          <div className="p-6">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h2 className="text-2xl font-semibold text-red-300">MCP73831 LiPo Charger Module</h2>
              <span className={categoryBadgeClass(PROJECT_CATEGORIES["lipo-charger"])}>
                {PROJECT_CATEGORIES["lipo-charger"]}
              </span>
              <span className={statusBadgeClass("Completed")}>Completed</span>
            </div>

            {/* Board Renders (generated from the KiCad project, real board photos to come) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="bg-black rounded-lg border border-zinc-700 p-4 flex flex-col items-center">
                <img
                  src="/projects/mcp73831-lipo-charger/board-top.svg"
                  alt="MCP73831 LiPo charger PCB, top copper and silkscreen layers"
                  className="w-full h-auto"
                  loading="lazy"
                />
                <span className="text-xs text-zinc-500 mt-2">Top layer</span>
              </div>
              <div className="bg-black rounded-lg border border-zinc-700 p-4 flex flex-col items-center">
                <img
                  src="/projects/mcp73831-lipo-charger/board-bottom.svg"
                  alt="MCP73831 LiPo charger PCB, bottom copper and silkscreen layers"
                  className="w-full h-auto"
                  loading="lazy"
                />
                <span className="text-xs text-zinc-500 mt-2">Bottom layer</span>
              </div>
            </div>

            <p className="text-sm text-zinc-400 mt-4 leading-relaxed">
              My first full PCB design cycle, start to finish — schematic capture, layout, DRC/ERC
              validation, fabrication, and assembly. It's a compact single-cell LiPo charger board built
              around Microchip's MCP73831 linear charge controller, designed as a plug-in power module
              for a larger handheld project I'm building.
              <br />
              <br />
              The scope was deliberately small: charge a single-cell LiPo safely over USB with a minimal
              component count, through-hole connectors so it's easy to prototype on a breadboard first,
              and a compact enough footprint to mount as a module later. MCP73831 in a SOT-23-5 package,
              a 10 kΩ RPROG resistor setting ~100 mA charge current, a JST-PH battery connector, a 5V
              input header, a broken-out STAT pin for charge monitoring, and a ground pour for current
              return and thermal spreading on a 2-layer board.
              <br />
              <br />
              DRC/ERC came back clean — zero unconnected pads, zero footprint errors, just a handful of
              cosmetic silkscreen-overlap warnings. Fabricated through JLCPCB, parts from DigiKey,
              hand-soldered and continuity-tested. It wasn't perfect on the first pass — I'd size the
              power traces wider now that I actually understand how much heat a linear charger dissipates
              as <code className="px-1 py-0.5 bg-zinc-950 text-red-300 rounded text-xs font-mono">(Vin − Vbat) × current</code>,
              and SOT-23 packages are a lot smaller in your hands than they look in CAD. But it charges a
              battery, terminates around 4.2V, and the IC stays warm without cooking itself — exactly what
              a first PCB needs to do.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {["KiCad", "PCB Design", "Hardware", "Power Electronics"].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-xs font-medium border border-zinc-600"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="mt-4">
              <a
                href="https://github.com/cryp71c/mcp73831-lipo-charger-module"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-zinc-800 border border-zinc-600 hover:bg-zinc-700 hover:border-red-600 rounded-lg text-sm font-medium transition"
              >
                View on GitHub →
              </a>
            </div>
          </div>
        </div>
        )}

        {/* Midnight Madness Card */}
        {isVisible("midnight-madness") && (
        <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 border border-zinc-700 rounded-2xl shadow-lg shadow-black/50 overflow-hidden">
          <div className="p-6">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h2 className="text-2xl font-semibold text-red-300">Midnight Madness — A 64-bit Hash in x86-64 Assembly</h2>
              <span className={categoryBadgeClass(PROJECT_CATEGORIES["midnight-madness"])}>
                {PROJECT_CATEGORIES["midnight-madness"]}
              </span>
              <span className={statusBadgeClass("Completed")}>Completed</span>
            </div>
            <p className="text-sm text-zinc-400 mt-3 leading-relaxed">
              A side-quest out of MmFS's integrity-checking needs: SHA-256 is great, but it's built to
              survive an attacker, and most of the time my actual enemy is just a bad copy operation. So
              I wrote a streaming, non-cryptographic 64-bit hash entirely in x86-64 assembly — constant
              memory usage, 64 KiB blocks, a C-callable interface, and the same result no matter how Linux
              splits up the reads. Benchmarked against <code className="px-1 py-0.5 bg-zinc-950 text-red-300 rounded text-xs font-mono">sha256sum</code> on a 256 MB file, it came out
              about 1.31x faster.
              <br />
              <br />
              Then I ran it through <a href="https://github.com/rurban/smhasher" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">SMHasher</a> and got humbled: the round function
              (XOR → multiply by an odd constant → rotate) is fully reversible, which means a later word
              can cancel out the state change from an earlier one. Two equal-length, structured multi-word
              inputs can collide. Great case study in why "fast" and "well-distributed" aren't the same
              property — MmFS itself keeps SHA-256 for anything that actually matters.
              <br />
              <br />
              Full write-up — the design, the SMHasher results, and exactly why it fails — is{" "}
              <Link to="/blog/midnight-madness-64bit-hash" className="text-red-400 hover:underline">
                on the blog
              </Link>.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {["x86-64 Assembly", "NASM", "C", "SMHasher", "Hashing"].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-xs font-medium border border-zinc-600"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
        )}

        {/* Sphere Packing Project Card */}
        {isVisible("sphere-packing") && (
        <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 border border-zinc-700 rounded-2xl shadow-lg shadow-black/50 overflow-hidden">
          <div className="p-6 border-b border-zinc-700">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h2 className="text-2xl font-semibold text-red-300">Sphere Packing Visualizer</h2>
              <span className={categoryBadgeClass(PROJECT_CATEGORIES["sphere-packing"])}>
                {PROJECT_CATEGORIES["sphere-packing"]}
              </span>
            </div>
            <p className="text-sm text-zinc-400 mt-1">
              Visualizes a 3D sphere packing algorithm using WebGL and Web Workers.
            </p>
          </div>
          <div className="p-6">
            <SpherePackingViewer />
          </div>
        </div>
        )}

        {/* ruff Card */}
        {isVisible("ruff") && (
        <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 border border-zinc-700 rounded-2xl shadow-lg shadow-black/50 overflow-hidden">
          <div className="p-6">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h2 className="text-2xl font-semibold text-red-300">ruff — A Rust Rewrite of FFUF</h2>
              <span className={categoryBadgeClass(PROJECT_CATEGORIES.ruff)}>
                {PROJECT_CATEGORIES.ruff}
              </span>
              <span className={statusBadgeClass("In Progress")}>In Progress</span>
            </div>
            <pre className="mt-3 p-4 bg-black border border-zinc-800 rounded-lg text-green-400 text-xs font-mono overflow-x-auto leading-tight">
{`        ____________ _   _______
        | ___ \\ ___ \\ | | |  ___|
        | |_/ / |_/ / | | | |_
        |    /|    /| | | |  _|
        | |\\ \\| |\\ \\| |_| | |
        \\_| \\_\\_| \\_|\\___/\\_|

        v0.1`}
            </pre>
            <p className="text-sm text-zinc-400 mt-3 leading-relaxed">
              My attempt at a Rust reimplementation of <a href="https://github.com/ffuf/ffuf" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">FFUF</a>,
              the Go-based web fuzzer that ships with Kali. Still early, but the directory-fuzzing core
              works end to end: parse a target URL with a <code className="px-1 py-0.5 bg-zinc-950 text-red-300 rounded text-xs font-mono">FUZZ</code> placeholder,
              load a wordlist (defaults to Kali's own <code className="px-1 py-0.5 bg-zinc-950 text-red-300 rounded text-xs font-mono">dirbuster/big.txt</code>),
              percent-encode and substitute each entry into the URL, and fire the requests.
              <br />
              <br />
              The part I actually care about is the threading model. The wordlist gets split into chunks
              sized to the machine's real core count via <code className="px-1 py-0.5 bg-zinc-950 text-red-300 rounded text-xs font-mono">std::thread::available_parallelism()</code>,
              each chunk spawns one thread per request, and results come back through an mpsc channel to
              a single collector on the main thread instead of every worker thread printing on top of
              each other. There's also a small deliberate delay between spawning each request so it
              doesn't just carpet-bomb a target the instant it starts.
              <br />
              <br />
              Requests go out over a <code className="px-1 py-0.5 bg-zinc-950 text-red-300 rounded text-xs font-mono">reqwest</code> blocking
              client configured to accept self-signed certs (common on pentest targets), with a live
              progress bar and a config banner printed the same way FFUF does it. What's not built yet:
              vhost fuzzing (the flag is parsed but not wired up), response filtering by size or word
              count, and FFUF's output formats. Directory fuzzing with real multithreading was the first
              milestone, and it works.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {["Rust", "CLI Tools", "Multithreading", "Web Fuzzing", "Security Tooling"].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-xs font-medium border border-zinc-600"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="mt-4">
              <a
                href="https://github.com/cryp71c/ruff"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-zinc-800 border border-zinc-600 hover:bg-zinc-700 hover:border-red-600 rounded-lg text-sm font-medium transition"
              >
                View on GitHub →
              </a>
            </div>
          </div>
        </div>
        )}

        {/* MmFS Card */}
        {isVisible("mmfs") && (
        <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 border border-zinc-700 rounded-2xl shadow-lg shadow-black/50 overflow-hidden">
          <div className="p-6">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h2 className="text-2xl font-semibold text-red-300">MmFS — Multimedia File System</h2>
              <span className={categoryBadgeClass(PROJECT_CATEGORIES.mmfs)}>
                {PROJECT_CATEGORIES.mmfs}
              </span>
              <span className={statusBadgeClass("Completed")}>Completed</span>
            </div>
            <p className="text-sm text-zinc-400 mt-3 leading-relaxed">
              A file system built from scratch in Python for my Data Structures class, designed around
              one idea: media metadata like image dimensions, audio sample rate, or video duration
              shouldn't require decoding the whole file every time an application needs it.
              <br />
              <br />
              MmFS extracts that metadata once on ingest and caches it in a dedicated Media Acceleration
              Table, so later reads and stat calls don't touch the decoder at all. It also implements
              block allocation, hierarchical directories, multi-block files, symbolic links, and content-
              signature detection that recognizes formats like PNG, JPEG, WAV, MP4, and ZIP from the
              actual bytes rather than the file extension. Integrity is checked at three levels — per-
              block, per-extent, and whole-file — each backed by its own SHA-256.
              <br />
              <br />
              Full write-up — architecture, on-disk layout, and the design decisions behind it — is{" "}
              <Link to="/blog/mmfs-multimedia-file-system" className="text-red-400 hover:underline">
                on the blog
              </Link>. I'm now rewriting the on-disk layer in Rust with hardware-accelerated CRC32C
              for fast corruption detection — that{" "}
              <Link to="/blog/crc32c-from-scratch-rust-inline-assembly" className="text-red-400 hover:underline">
                write-up is here
              </Link>.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {["Python", "File System Design", "SHA-256", "Media Metadata"].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-xs font-medium border border-zinc-600"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
        )}

        {/* SAML-Delegated LLM Access Card */}
        {isVisible("saml") && (
        <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 border border-zinc-700 rounded-2xl shadow-lg shadow-black/50 overflow-hidden">
          <div className="p-6">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h2 className="text-2xl font-semibold text-red-300">Safe LLM Workspace Access via SAML Token Delegation</h2>
              <span className={categoryBadgeClass(PROJECT_CATEGORIES.saml)}>
                {PROJECT_CATEGORIES.saml}
              </span>
              <span className={statusBadgeClass("Early Research")}>Early Research</span>
            </div>
            <p className="text-sm text-zinc-400 mt-3 leading-relaxed">
              Most approaches to giving an LLM agent access to company systems mint it a new, standalone
              service identity — which usually ends up either over-privileged or stuck maintaining its
              own parallel permission model alongside the RBAC/SSO the company already has.
              <br />
              <br />
              I'm exploring an alternative: instead of a separate identity for the AI, the agent operates
              under a duplicated/scoped SAML token derived from the requesting user's own existing SSO
              session. The LLM never gets more access than the human it's acting for already has, and it
              rides on the SAML-based access control infrastructure that's already in place rather than
              introducing a new trust boundary.
              <br />
              <br />
              Still in the design/research phase — no public demo yet. I'll post findings and a writeup
              on the <Link to="/blog" className="text-red-400 hover:underline">blog</Link> as it develops.
            </p>
          </div>
        </div>
        )}
      </div>

      <div className="text-center mt-12">
        <Link
          to="/"
          className="inline-block px-5 py-2 bg-red-600 bg-gradient-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 rounded-md transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default Projects;
