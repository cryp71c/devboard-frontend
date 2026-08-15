// This is the exact portable CRC32C implementation from the mmfsr project
// (the Rust rewrite of MmFS — see the "CRC32C From Scratch" blog post),
// compiled to WebAssembly so it can run live in the browser.
//
// It's the *portable* path specifically, not the hardware-accelerated one:
// the SSE4.2 (`crc32` instruction, x86-64) and ARM CRC-extension paths are
// hand-written inline assembly for real CPU instructions that don't exist
// in the WebAssembly instruction set, so there's no honest way to run them
// in a browser sandbox. What you're running here is the same bit-by-bit
// reference implementation the blog post benchmarks the hardware paths
// against — genuinely the slow baseline, not a simulation of the fast path.

use wasm_bindgen::prelude::*;

const INIT: u32 = 0xFFFFFFFF;
const XOROUT: u32 = 0xFFFFFFFF;
const POLY_REFLECTED: u32 = 0x82F63B78;

/// Feeds `data` through the accumulator, byte by byte, bit by bit. No init
/// or final XOR here — that's what makes this safe to call repeatedly across
/// chunks: the accumulator carries all the state that matters between calls.
fn absorb(mut accumulator: u32, data: &[u8]) -> u32 {
    for byte in data {
        let mut u32_byte_copy = u32::from(*byte);

        for _ in 0..8 {
            let feedback = (u32_byte_copy ^ accumulator) & 1;
            accumulator >>= 1;

            if feedback == 1 {
                accumulator ^= POLY_REFLECTED;
            }

            u32_byte_copy >>= 1;
        }
    }

    accumulator
}

/// Computes the CRC32C (Castagnoli) checksum of `data` in one call —
/// convenient when the whole input already fits comfortably in memory.
#[wasm_bindgen]
pub fn crc32c_u32(data: &[u8]) -> u32 {
    absorb(INIT, data) ^ XOROUT
}

/// Incremental CRC32C hasher. Lets a caller feed a large file through in
/// chunks (e.g. from a Web Worker reading a File in pieces) instead of
/// needing the entire input loaded into memory at once — the accumulator is
/// the only state that has to persist between calls, so peak memory is
/// roughly one chunk, not the whole file twice over (once in JS, once
/// copied into WASM linear memory).
#[wasm_bindgen]
pub struct Crc32cHasher {
    accumulator: u32,
}

#[wasm_bindgen]
impl Crc32cHasher {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Crc32cHasher {
        Crc32cHasher { accumulator: INIT }
    }

    /// Feed the next chunk of data in. Order matters — chunks must be fed in
    /// the same order the bytes appear in the original input.
    pub fn update(&mut self, data: &[u8]) {
        self.accumulator = absorb(self.accumulator, data);
    }

    /// Finish and return the checksum. Does not consume `self` (wasm-bindgen
    /// can't express that ergonomically), so don't reuse the hasher after
    /// calling this unless you actually want to start a fresh checksum from
    /// the same midpoint — call `new()` again instead.
    pub fn finalize(&self) -> u32 {
        self.accumulator ^ XOROUT
    }
}

impl Default for Crc32cHasher {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    const VECTORS: [(&[u8], u32); 10] = [
        (b"", 0x00000000),
        (b"1", 0x90F599E3),
        (b"12", 0x7355C460),
        (b"123", 0x107B2FB2),
        (b"1234", 0xF63AF4EE),
        (b"12345", 0x18D12335),
        (b"123456", 0x41357186),
        (b"1234567", 0x124297EA),
        (b"12345678", 0x6087809A),
        (b"123456789", 0xE3069283),
    ];

    #[test]
    fn matches_known_crc32c_vectors() {
        for (input, expected) in VECTORS {
            assert_eq!(crc32c_u32(input), expected, "mismatch for input: {:?}", input);
        }
    }

    #[test]
    fn streaming_matches_one_shot_regardless_of_chunking() {
        for (input, expected) in VECTORS {
            // whole input in one update() call
            let mut whole = Crc32cHasher::new();
            whole.update(input);
            assert_eq!(whole.finalize(), expected, "one-chunk mismatch for {:?}", input);

            // fed one byte at a time
            let mut one_byte_at_a_time = Crc32cHasher::new();
            for byte in input {
                one_byte_at_a_time.update(std::slice::from_ref(byte));
            }
            assert_eq!(
                one_byte_at_a_time.finalize(),
                expected,
                "byte-at-a-time mismatch for {:?}",
                input
            );

            // fed in awkward, unevenly-sized chunks
            if input.len() > 3 {
                let mut uneven = Crc32cHasher::new();
                uneven.update(&input[..1]);
                uneven.update(&input[1..3]);
                uneven.update(&input[3..]);
                assert_eq!(uneven.finalize(), expected, "uneven-chunk mismatch for {:?}", input);
            }
        }
    }
}
