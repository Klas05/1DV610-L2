# Test Report (Run: 2025-10-02)

## Scope

Version 1 QR, modes: byte/numeric/alnum (validation only), mask patterns 0–3. No error correction implemented.

## Test Matrix

| Area              | Cases (asserted properties)                                   | Method Source                               |
| ----------------- | ------------------------------------------------------------- | ------------------------------------------- |
| Matrix build      | dimension = 21x21, cell values are {0,1}                      | [`generateQRCode`](src/index.js)            |
| Rendering         | ASCII string produced                                         | [`renderASCIIMatrix`](src/index.js)         |
| Validation accept | samples for byte / numeric / alnum do not throw               | [`validateInput`](src/index.js)             |
| Validation reject | empty input, mode char violation, length overflow throws      | [`validateInput`](src/index.js)             |
| Encoding          | data codeword count expected, each codeword 0–255             | [`buildDataCodewords`](src/index.js)        |
| Bit conversion    | bitstream length = 8 \* codewords, all bits ∈ {0,1}           | [`codewordsToBits`](src/conversionUtils.js) |
| Masks             | patterns 0–3 generate 21x21, matrices differ between patterns | [`generateQRCode`](src/index.js)            |

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
2. Manual scanning tests.
