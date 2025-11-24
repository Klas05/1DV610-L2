# Test Report (Run: 2025-11-24)

## Scope

Version 1 QR, modes: byte/numeric/alnum (validation only), mask patterns 0–3. Reed-Solomon error correction implemented and tested.

## Test Matrix

| Area                        | Cases (asserted properties)                                                        | Method Source                               |
| --------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------- |
| Matrix build                | dimension = 21x21, cell values are {0,1}                                           | [`generateQRCode`](src/index.js)            |
| Rendering                   | ASCII string produced                                                              | [`renderASCIIMatrix`](src/index.js)         |
| Validation accept           | samples for byte / numeric / alnum do not throw                                    | [`validateInput`](src/index.js)             |
| Validation reject           | empty input, mode char violation, length overflow throws                           | [`validateInput`](src/index.js)             |
| Encoding                    | data codeword count expected, each codeword 0–255                                  | [`buildDataCodewords`](src/index.js)        |
| Bit conversion              | bitstream length = 8 \* codewords, all bits ∈ {0,1}                                | [`codewordsToBits`](src/conversionUtils.js) |
| Masks                       | patterns 0–3 generate 21x21, matrices differ between patterns                      | [`generateQRCode`](src/index.js)            |
| **Reed-Solomon ECC**        |                                                                                    |                                             |
| Basic EC encoding           | output length = data + EC count, data preserved, EC codewords generated            | [`ErrorCorrectionEncoder`](src/index.js)    |
| EC levels (L/M/Q/H)         | each level (7/10/13/17 EC codewords) produces correct output length                | [`ErrorCorrectionEncoder`](src/index.js)    |
| EC validation - type errors | non-array data, empty array correctly rejected with TypeError                      | [`ErrorCorrectionEncoder`](src/index.js)    |
| EC validation - count       | zero, negative, non-integer EC counts correctly rejected                           | [`ErrorCorrectionEncoder`](src/index.js)    |
| EC validation - codewords   | values >255, <0, or non-integer codewords correctly rejected with index info       | [`ErrorCorrectionEncoder`](src/index.js)    |
| EC codeword generation      | EC codewords are non-zero and valid bytes (0-255)                                  | [`ErrorCorrectionEncoder`](src/index.js)    |
| EC integration              | full pipeline with buildDataCodewords produces data + EC codewords                 | [`buildDataCodewords`](src/index.js)        |
| EC determinism              | identical inputs produce identical outputs                                         | [`ErrorCorrectionEncoder`](src/index.js)    |
| EC edge values              | min (0), mid (127), max (255) byte values correctly encoded                        | [`ErrorCorrectionEncoder`](src/index.js)    |
| **Manual scanning tests**   | QR codes manually tested with smartphone for various example texts (all scannable) | Physical device scanning                    |

## Execution Summary

All 15 test suites passed, including 7 new Reed-Solomon error correction test suites. 0 failures.

Total kind of automated tests: 15 (8 original + 7 error correction)
Manual scanning tests: Multiple example QR codes successfully scanned on physical devices

## Failures

None.

## Coverage / Gaps

**Covered:**

- Complete data path: validation → encoding → error correction → matrix building → rendering
- Reed-Solomon error correction for all QR code error correction levels (L, M, Q, H)
- Input validation and error handling for error correction
- ASCII rendering for console output
- Manual scanning validation with real devices

**Not covered:**

- Higher QR code versions (only Version 1 tested)
- Numeric and alphanumeric encoding modes (validation only)
- Performance benchmarks
- Automated scanning validation
- SVG rendering tests
- Additional mask patterns (4-7)

## Risks

**Mitigated:**

- ~~Output not scannable~~ → Error correction now implemented and validated with manual scanning tests

**Remaining:**

- Single version (Version 1) limits extensibility for longer text inputs
- Only byte mode fully implemented (numeric/alphanumeric modes validated but not encoded)
- Limited mask pattern coverage (0-3 of 8 possible patterns)

## Next Actions

1. ~~Implement Reed–Solomon and add ECC tests~~ ✓ Completed
2. ~~Manual scanning tests~~ ✓ Completed
3. Consider implementing higher QR code versions (V2-V40) for longer text support
4. Implement numeric and alphanumeric encoding modes
5. Add remaining mask patterns (4-7)
6. Consider automated scanning validation using image processing libraries
7. Add performance benchmarking tests
