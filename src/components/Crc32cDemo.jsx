import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const SELF_CHECK_EXPECTED = 0xe3069283;

function formatThroughput(bytes, ms) {
  if (ms <= 0) return "—";
  const bytesPerSecond = bytes / (ms / 1000);
  const mibPerSecond = bytesPerSecond / (1024 * 1024);
  if (mibPerSecond < 1) return `${(bytesPerSecond / 1024).toFixed(1)} KiB/s`;
  if (mibPerSecond > 1024) return `${(mibPerSecond / 1024).toFixed(2)} GiB/s`;
  return `${mibPerSecond.toFixed(1)} MiB/s`;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KiB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MiB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GiB`;
}

export default function Crc32cDemo() {
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [selfCheckOk, setSelfCheckOk] = useState(null);
  const [text, setText] = useState("");
  const [fileInfo, setFileInfo] = useState(null); // { name, size }
  const [hashing, setHashing] = useState(false);
  const [progress, setProgress] = useState(null); // { processed, total } | null
  const [result, setResult] = useState(null); // { hex, byteCount, ms, source }
  const [hashError, setHashError] = useState(null);
  const fileInputRef = useRef(null);
  const workerRef = useRef(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const worker = new Worker(new URL("../wasm/crc32c/crc32c.worker.js", import.meta.url), {
      type: "module",
    });
    workerRef.current = worker;

    worker.onmessage = (e) => {
      const msg = e.data;
      if (msg.type === "self-check-result") {
        setSelfCheckOk(msg.result === SELF_CHECK_EXPECTED);
        setStatus("ready");
      } else if (msg.type === "progress") {
        setProgress({ processed: msg.processed, total: msg.total });
      } else if (msg.type === "done") {
        setResult({ hex: msg.hex, byteCount: msg.byteCount, ms: msg.ms, source: msg.source });
        setHashing(false);
        setProgress(null);
      } else if (msg.type === "error") {
        setHashError(msg.message);
        setHashing(false);
        setProgress(null);
      }
    };

    worker.onerror = (err) => {
      console.error("CRC32C worker error:", err);
      setStatus("error");
    };

    worker.postMessage({ type: "self-check" });

    return () => worker.terminate();
  }, []);

  const startHash = (message) => {
    setHashError(null);
    setResult(null);
    setHashing(true);
    setProgress(null);
    requestIdRef.current += 1;
    workerRef.current?.postMessage({ ...message, id: requestIdRef.current });
  };

  const handleHashText = () => {
    startHash({ type: "hash-text", text });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileInfo({ name: file.name, size: file.size });
    startHash({ type: "hash-file", file });
  };

  const progressPercent = progress && progress.total > 0 ? (progress.processed / progress.total) * 100 : 0;

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
        . Files are hashed in a background worker, in 8 MiB chunks, so the page never freezes — nothing is
        ever uploaded anywhere, it's all local to your browser.
      </p>

      {status === "loading" && (
        <div className="flex items-center gap-3 text-zinc-400 text-sm">
          <div className="h-4 w-4 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
          Loading WASM module...
        </div>
      )}

      {status === "error" && (
        <p className="text-red-400 text-sm">
          Couldn't load the WASM module. Your browser may not support WebAssembly or Web Workers, or it
          failed to fetch.
        </p>
      )}

      {status === "ready" && (
        <>
          <div className="mb-4 text-xs">
            {selfCheckOk ? (
              <span className="text-green-400">
                ✓ Self-check passed — CRC32C("123456789") = 0xE3069283
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
            disabled={hashing}
            className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 transition resize-none font-mono text-sm mb-3 disabled:opacity-50"
          />

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <button
              onClick={handleHashText}
              disabled={hashing || text.length === 0}
              className="px-4 py-2 bg-red-600 bg-gradient-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 disabled:bg-zinc-700 disabled:from-zinc-700 disabled:to-zinc-700 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition"
            >
              Hash This Text
            </button>
            <span className="text-zinc-500 text-sm">or</span>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={hashing}
              className="px-4 py-2 bg-zinc-800 border border-zinc-600 hover:bg-zinc-700 hover:border-red-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition"
            >
              Upload a File
            </button>
            <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" />
            {fileInfo && (
              <span className="text-zinc-400 text-xs font-mono">
                {fileInfo.name} ({formatBytes(fileInfo.size)})
              </span>
            )}
          </div>

          {hashing && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                <span>Hashing...</span>
                {progress && (
                  <span>
                    {formatBytes(progress.processed)} / {formatBytes(progress.total)}
                  </span>
                )}
              </div>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-150"
                  style={{ width: `${progress ? progressPercent : 100}%` }}
                />
              </div>
            </div>
          )}

          {hashError && <p className="text-red-400 text-sm mb-4">Error: {hashError}</p>}

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
                <span className="text-zinc-300">{result.ms.toFixed(0)} ms</span>
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
