/* tslint:disable */
/* eslint-disable */

/**
 * Incremental CRC32C hasher. Lets a caller feed a large file through in
 * chunks (e.g. from a Web Worker reading a File in pieces) instead of
 * needing the entire input loaded into memory at once — the accumulator is
 * the only state that has to persist between calls, so peak memory is
 * roughly one chunk, not the whole file twice over (once in JS, once
 * copied into WASM linear memory).
 */
export class Crc32cHasher {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Finish and return the checksum. Does not consume `self` (wasm-bindgen
     * can't express that ergonomically), so don't reuse the hasher after
     * calling this unless you actually want to start a fresh checksum from
     * the same midpoint — call `new()` again instead.
     */
    finalize(): number;
    constructor();
    /**
     * Feed the next chunk of data in. Order matters — chunks must be fed in
     * the same order the bytes appear in the original input.
     */
    update(data: Uint8Array): void;
}

/**
 * Computes the CRC32C (Castagnoli) checksum of `data` in one call —
 * convenient when the whole input already fits comfortably in memory.
 */
export function crc32c_u32(data: Uint8Array): number;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_crc32chasher_free: (a: number, b: number) => void;
    readonly crc32c_u32: (a: number, b: number) => number;
    readonly crc32chasher_finalize: (a: number) => number;
    readonly crc32chasher_new: () => number;
    readonly crc32chasher_update: (a: number, b: number, c: number) => void;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
