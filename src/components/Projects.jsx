import { useState } from "react";
import { Link } from "react-router-dom";
import SpherePackingViewer from "../components/SpherePackingViewer";
import { CATEGORIES, categoryBadgeClass } from "../utils/categories";

const PROJECT_CATEGORIES = {
  "sphere-packing": "Personal",
  mmfs: "College",
  "midnight-madness": "College",
  saml: "Security Research",
  "lipo-charger": "Personal",
};

function Projects() {
  const [categoryFilter, setCategoryFilter] = useState("all");

  const isVisible = (key) => categoryFilter === "all" || PROJECT_CATEGORIES[key] === categoryFilter;

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <Link to="/" className="text-indigo-500 hover:underline block mb-6">
          ← Back
        </Link>
      </div>
      <h1 className="text-4xl font-bold text-center text-indigo-400 mb-4">
        Projects
      </h1>
      <p className="text-center max-w-2xl mx-auto text-gray-300 mb-8">
        A showcase of interactive, systems-level, and technical projects — algorithms, visuals,
        file systems, low-level assembly, and hardware.
      </p>

      {/* Category Filters */}
      <div className="flex justify-center gap-3 mb-12 flex-wrap">
        <button
          onClick={() => setCategoryFilter("all")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            categoryFilter === "all"
              ? "bg-indigo-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
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
                ? "bg-indigo-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
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
            <p className="text-gray-400 text-lg">No projects in this category yet.</p>
          </div>
        )}

        {/* Sphere Packing Project Card */}
        {isVisible("sphere-packing") && (
        <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h2 className="text-2xl font-semibold text-indigo-300">Sphere Packing Visualizer</h2>
              <span className={categoryBadgeClass(PROJECT_CATEGORIES["sphere-packing"])}>
                {PROJECT_CATEGORIES["sphere-packing"]}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Visualizes a 3D sphere packing algorithm using WebGL and Web Workers.
            </p>
          </div>
          <div className="p-6">
            <SpherePackingViewer />
          </div>
        </div>
        )}

        {/* MmFS Card */}
        {isVisible("mmfs") && (
        <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h2 className="text-2xl font-semibold text-indigo-300">MmFS — Multimedia File System</h2>
              <span className={categoryBadgeClass(PROJECT_CATEGORIES.mmfs)}>
                {PROJECT_CATEGORIES.mmfs}
              </span>
              <span className="px-3 py-1 bg-green-900/50 text-green-300 border border-green-700 rounded-full text-xs font-semibold whitespace-nowrap">
                Completed
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-3 leading-relaxed">
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
              <Link to="/blog/mmfs-multimedia-file-system" className="text-indigo-400 hover:underline">
                on the blog
              </Link>. I'm now rewriting the on-disk layer in Rust with hardware-accelerated CRC32C
              for fast corruption detection — that{" "}
              <Link to="/blog/crc32c-from-scratch-rust-inline-assembly" className="text-indigo-400 hover:underline">
                write-up is here
              </Link>.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {["Python", "File System Design", "SHA-256", "Media Metadata"].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-indigo-900/50 text-indigo-300 rounded-full text-xs font-medium border border-indigo-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
        )}

        {/* Midnight Madness Card */}
        {isVisible("midnight-madness") && (
        <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h2 className="text-2xl font-semibold text-indigo-300">Midnight Madness — A 64-bit Hash in x86-64 Assembly</h2>
              <span className={categoryBadgeClass(PROJECT_CATEGORIES["midnight-madness"])}>
                {PROJECT_CATEGORIES["midnight-madness"]}
              </span>
              <span className="px-3 py-1 bg-green-900/50 text-green-300 border border-green-700 rounded-full text-xs font-semibold whitespace-nowrap">
                Completed
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-3 leading-relaxed">
              A side-quest out of MmFS's integrity-checking needs: SHA-256 is great, but it's built to
              survive an attacker, and most of the time my actual enemy is just a bad copy operation. So
              I wrote a streaming, non-cryptographic 64-bit hash entirely in x86-64 assembly — constant
              memory usage, 64 KiB blocks, a C-callable interface, and the same result no matter how Linux
              splits up the reads. Benchmarked against <code className="px-1 py-0.5 bg-gray-900 text-pink-400 rounded text-xs font-mono">sha256sum</code> on a 256 MB file, it came out
              about 1.31x faster.
              <br />
              <br />
              Then I ran it through <a href="https://github.com/rurban/smhasher" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">SMHasher</a> and got humbled: the round function
              (XOR → multiply by an odd constant → rotate) is fully reversible, which means a later word
              can cancel out the state change from an earlier one. Two equal-length, structured multi-word
              inputs can collide. Great case study in why "fast" and "well-distributed" aren't the same
              property — MmFS itself keeps SHA-256 for anything that actually matters.
              <br />
              <br />
              Full write-up — the design, the SMHasher results, and exactly why it fails — is{" "}
              <Link to="/blog/midnight-madness-64bit-hash" className="text-indigo-400 hover:underline">
                on the blog
              </Link>.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {["x86-64 Assembly", "NASM", "C", "SMHasher", "Hashing"].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-indigo-900/50 text-indigo-300 rounded-full text-xs font-medium border border-indigo-700"
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
        <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h2 className="text-2xl font-semibold text-indigo-300">Safe LLM Workspace Access via SAML Token Delegation</h2>
              <span className={categoryBadgeClass(PROJECT_CATEGORIES.saml)}>
                {PROJECT_CATEGORIES.saml}
              </span>
              <span className="px-3 py-1 bg-purple-900/50 text-purple-300 border border-purple-700 rounded-full text-xs font-semibold whitespace-nowrap">
                Early Research
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-3 leading-relaxed">
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
              on the <Link to="/blog" className="text-indigo-400 hover:underline">blog</Link> as it develops.
            </p>
          </div>
        </div>
        )}

        {/* MCP73831 LiPo Charger Card */}
        {isVisible("lipo-charger") && (
        <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h2 className="text-2xl font-semibold text-indigo-300">MCP73831 LiPo Charger Module</h2>
              <span className={categoryBadgeClass(PROJECT_CATEGORIES["lipo-charger"])}>
                {PROJECT_CATEGORIES["lipo-charger"]}
              </span>
              <span className="px-3 py-1 bg-green-900/50 text-green-300 border border-green-700 rounded-full text-xs font-semibold whitespace-nowrap">
                Completed
              </span>
            </div>

            {/* Board Renders (generated from the KiCad project, real board photos to come) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="bg-black rounded-lg border border-gray-700 p-4 flex flex-col items-center">
                <img
                  src="/projects/mcp73831-lipo-charger/board-top.svg"
                  alt="MCP73831 LiPo charger PCB, top copper and silkscreen layers"
                  className="w-full h-auto"
                  loading="lazy"
                />
                <span className="text-xs text-gray-500 mt-2">Top layer</span>
              </div>
              <div className="bg-black rounded-lg border border-gray-700 p-4 flex flex-col items-center">
                <img
                  src="/projects/mcp73831-lipo-charger/board-bottom.svg"
                  alt="MCP73831 LiPo charger PCB, bottom copper and silkscreen layers"
                  className="w-full h-auto"
                  loading="lazy"
                />
                <span className="text-xs text-gray-500 mt-2">Bottom layer</span>
              </div>
            </div>

            <p className="text-sm text-gray-400 mt-4 leading-relaxed">
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
              as <code className="px-1 py-0.5 bg-gray-900 text-pink-400 rounded text-xs font-mono">(Vin − Vbat) × current</code>,
              and SOT-23 packages are a lot smaller in your hands than they look in CAD. But it charges a
              battery, terminates around 4.2V, and the IC stays warm without cooking itself — exactly what
              a first PCB needs to do.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {["KiCad", "PCB Design", "Hardware", "Power Electronics"].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-indigo-900/50 text-indigo-300 rounded-full text-xs font-medium border border-indigo-700"
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
                className="inline-block px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition"
              >
                View on GitHub →
              </a>
            </div>
          </div>
        </div>
        )}
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
