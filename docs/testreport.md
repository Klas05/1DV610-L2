# Test Report (Run: 2025-10-02)

## Scope

Version 1 QR, modes: byte/numeric/alnum (validation only), mask patterns 0–3. No error correction implemented.

## Test Matrix

| Area            | Cases                             | Method Source                               |
| --------------- | --------------------------------- | ------------------------------------------- |
| Matrix build    | size, cell domain                 | [`generateQRCode`](src/index.js)            |
| Rendering       | non-empty, line count             | [`renderASCIIMatrix`](src/index.js)         |
| Validation pass | byte, numeric, alnum              | [`validateInput`](src/index.js)             |
| Validation fail | empty, wrong mode chars, overflow | [`validateInput`](src/index.js)             |
| Encoding        | codeword count, byte range        | [`buildDataCodewords`](src/index.js)        |
| Bit conversion  | length, bit domain                | [`codewordsToBits`](src/conversionUtils.js) |
| Masks           | patterns 0–3 size check           | [`generateQRCode`](src/index.js)            |

## Execution Summary

All tests passed. 0 failures.

## Failures

None.

## Coverage / Gaps

Covered: data path up to matrix + ASCII rendering. Not covered: error correction, higher versions, performance, scan validity.

## Risks

Output not scannable (missing ECC). Single version limits future extensibility untested.

## Next Actions

1. Implement Reed–Solomon and add ECC tests.
2. Manual scanning tests
