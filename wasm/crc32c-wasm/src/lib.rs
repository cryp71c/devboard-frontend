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

/// Computes the CRC32C (Castagnoli) checksum of `data`, portable path.
#[wasm_bindgen]
pub fn crc32c_u32(data: &[u8]) -> u32 {
    // initialize CRC
    let mut crc32c_portable_u32_accumulator: u32 = 0xFFFFFFFF;

    for byte in data {
        let mut u32_byte_copy = u32::from(*byte);

        for _ in 0..8 {
            let feedback = (u32_byte_copy ^ crc32c_portable_u32_accumulator) & 1;
            crc32c_portable_u32_accumulator >>= 1;

            if feedback == 1 {
                crc32c_portable_u32_accumulator ^= 0x82F63B78;
            }

            u32_byte_copy >>= 1;
        }
    }

    crc32c_portable_u32_accumulator ^= 0xFFFFFFFF;

    crc32c_portable_u32_accumulator
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn matches_known_crc32c_vectors() {
        let test_cases: [(&[u8], u32); 10] = [
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

        for (input, expected) in test_cases {
            assert_eq!(crc32c_u32(input), expected, "mismatch for input: {:?}", input);
        }
    }
}
