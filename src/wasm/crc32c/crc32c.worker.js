// Module worker: hashes text or a File off the main thread, in chunks, so
// the tab never freezes regardless of input size. Progress messages let the
// UI show a real progress bar instead of just staring at a spinner.
import init, { crc32c_u32, Crc32cHasher } from "./crc32c_wasm.js";

const CHUNK_SIZE = 8 * 1024 * 1024; // 8 MiB per chunk

let wasmReady = init();

function toHex(n) {
  return "0x" + (n >>> 0).toString(16).toUpperCase().padStart(8, "0");
}

async function hashBytes(bytes) {
  // Small enough to just do in one call — no need to chunk a few KB of text.
  const checksum = crc32c_u32(bytes);
  return toHex(checksum);
}

async function hashFile(file) {
  const hasher = new Crc32cHasher();
  const total = file.size;
  let processed = 0;
  let lastProgressPost = 0;

  for (let offset = 0; offset < total; offset += CHUNK_SIZE) {
    const slice = file.slice(offset, Math.min(offset + CHUNK_SIZE, total));
    const buf = await slice.arrayBuffer();
    hasher.update(new Uint8Array(buf));
    processed += buf.byteLength;

    // Throttle progress messages so we're not flooding postMessage on tiny files.
    const now = performance.now();
    if (now - lastProgressPost > 50 || processed === total) {
      self.postMessage({ type: "progress", processed, total });
      lastProgressPost = now;
    }
  }

  const checksum = hasher.finalize();
  hasher.free();
  return toHex(checksum);
}

self.onmessage = async (e) => {
  const { type, id } = e.data;

  try {
    await wasmReady;

    if (type === "self-check") {
      const result = crc32c_u32(new TextEncoder().encode("123456789"));
      self.postMessage({ type: "self-check-result", id, result });
      return;
    }

    if (type === "hash-text") {
      const start = performance.now();
      const bytes = new TextEncoder().encode(e.data.text);
      const hex = await hashBytes(bytes);
      const ms = performance.now() - start;
      self.postMessage({ type: "done", id, hex, byteCount: bytes.length, ms, source: "text" });
      return;
    }

    if (type === "hash-file") {
      const file = e.data.file;
      const start = performance.now();
      const hex = await hashFile(file);
      const ms = performance.now() - start;
      self.postMessage({ type: "done", id, hex, byteCount: file.size, ms, source: file.name });
      return;
    }
  } catch (err) {
    self.postMessage({ type: "error", id, message: err?.message || String(err) });
  }
};
