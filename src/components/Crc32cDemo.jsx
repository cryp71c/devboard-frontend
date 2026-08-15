import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import init, { crc32c_u32 } from "../wasm/crc32c/crc32c_wasm.js";

// Known CRC32C("123456789") test vector — used to self-check the loaded
// WASM module actually computes the right thing before trusting it with
// user input.
const SELF_CHECK_INPUT = "123456789";
const SELF_CHECK_EXPECTED = 0xe3069283;

function formatThroughput(bytes, ms) {
  if (ms <= 0) return "—";
  const bytesPerSecond = bytes / (ms / 1000);
  const mibPerSecond = bytesPerSecond / (1024 * 1024);
  if (mibPerSecond < 1) return `${(bytesPerSecond / 1024).toFixed(1)} KiB/s`;
  if (mibPerSecond > 1024) return `${(mibPerSecond / 1024).toFixed(2)} GiB/s`;
  return `${mibPerSecond.toFixed(1)} MiB/s`;
}

function toHex(n) {
  return "0x" + (n >>> 0).toString(16).toUpperCase().padStart(8, "0");
}

export default function Crc32cDemo() {
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [selfCheckOk, setSelfCheckOk] = useState(null);
  const [text, setText] = useState("");
  const [fileInfo, setFileInfo] = useState(null); // { name, bytes: Uint8Array }
  const [result, setResult] = useState(null); // { hex, byteCount, ms, source }
  const fileInputRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    init()
      .then(() => {
        if (cancelled) return;
        const check = crc32c_u32(new TextEncoder().encode(SELF_CHECK_INPUT));
        setSelfCheckOk(check === SELF_CHECK_EXPECTED);
        setStatus("ready");
      })
      .catch((err) => {
        console.error("Failed to load CRC32C WASM module:", err);
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const runHash = (bytes, source) => {
    const start = performance.now();
    const checksum = crc32c_u32(bytes);
    const ms = performance.now() - start;
    setResult({ hex: toHex(checksum), byteCount: bytes.length, ms, source });
  };

  const handleHashText = () => {
    runHash(new TextEncoder().encode(text), "text");
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    file.arrayBuffer().then((buf) => {
      const bytes = new Uint8Array(buf);
      setFileInfo({ name: file.name, bytes });
      runHash(bytes, file.name);
    });
  };

  return (
    <div>
      <p className="text-sm text-zinc-400 mb-4 leading-relaxed">
        The exact portable CRC32C implementation from the{" "}
        <code className="px-1 py-0.5 bg-zinc-950 text-red-300 rounded text-xs font-mono">mmfsr</code> project,
        compiled to WebAssembly and executing live in your browser right now — not a simulation. It's the
        portable path specifically: the hand-written SSE4.2 and ARM CRC-extension assembly use real CPU
        instructions that don't exist in WebAssembly's instruction set, so there's no honest way to run the
        hardware-accelerated path in a browser sandbox. What you're about to run is the same reference
        implementation the hardware paths are benchmarked against — full story on{" "}
        <Link to="/blog/crc32c-from-scratch-rust-inline-assembly" className="text-red-400 hover:underline">
          the blog
        </Link>
        .
      </p>

      {status === "loading" && (
        <div className="flex items-center gap-3 text-zinc-400 text-sm">
          <div className="h-4 w-4 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
          Loading WASM module...
        </div>
      )}

      {status === "error" && (
        <p className="text-red-400 text-sm">
          Couldn't load the WASM module. Your browser may not support WebAssembly, or it failed to fetch.
        </p>
      )}

      {status === "ready" && (
        <>
          <div className="mb-4 text-xs">
            {selfCheckOk ? (
              <span className="text-green-400">
                ✓ Self-check passed — CRC32C("123456789") = {toHex(SELF_CHECK_EXPECTED)}
              </span>
            ) : (
              <span className="text-red-400">
                ✗ Self-check failed — something's wrong with this build, results below may not be trustworthy.
              </span>
            )}
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste some text to hash..."
            rows={4}
            className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 transition resize-none font-mono text-sm mb-3"
          />

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <button
              onClick={handleHashText}
              disabled={text.length === 0}
              className="px-4 py-2 bg-gradient-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 disabled:from-zinc-700 disabled:to-zinc-700 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition"
            >
              Hash This Text
            </button>
            <span className="text-zinc-500 text-sm">or</span>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-zinc-800 border border-zinc-600 hover:bg-zinc-700 hover:border-red-600 rounded-lg text-sm font-medium transition"
            >
              Upload a File
            </button>
            <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" />
            {fileInfo && <span className="text-zinc-400 text-xs font-mono">{fileInfo.name}</span>}
          </div>

          {result && (
            <div className="bg-black rounded-lg border border-zinc-700 p-4 font-mono text-sm space-y-1">
              <div className="flex justify-between gap-4">
                <span className="text-zinc-500">CRC32C:</span>
                <span className="text-red-300">{result.hex}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-zinc-500">Input size:</span>
                <span className="text-zinc-300">{result.byteCount.toLocaleString()} bytes</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-zinc-500">Time:</span>
                <span className="text-zinc-300">{result.ms.toFixed(3)} ms</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-zinc-500">Throughput:</span>
                <span className="text-amber-400">{formatThroughput(result.byteCount, result.ms)}</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
