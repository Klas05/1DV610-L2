// QR Code Version 1 Constants
export const MATRIX_SIZE = 21;
export const FINDER_PATTERN_SIZE = 7;
export const TIMING_PATTERN_COLUMN = 6;
export const TIMING_PATTERN_ROW = 6;
export const DARK_MODULE_ROW = 8;
export const DARK_MODULE_COL = 13;

// Data encoding constants
export const BYTE_MODE_INDICATOR = 4;
export const BYTE_MODE_BITS = 4;
export const CHAR_COUNT_BITS = 8;
export const MAX_DATA_CODEWORDS = 19;
export const BITS_PER_CODEWORD = 8;
export const TERMINATOR_MAX_BITS = 4;
export const PAD_BYTES = [0xec, 0x11];

// Data placement constants
export const COLUMN_PAIR_WIDTH = 2;

// Encoding constants
export const BITS_PER_BYTE = 8;
export const BINARY_BASE = 2;

// Masking pattern constants
export const FINDER_PATTERN_POSITIONS = [
  [0, 0], // top-left
  [0, 14], // top-right
  [14, 0], // bottom-left
];
export const SEPARATOR_SIZE = 7;
export const SEPARATOR_POSITION = 7;
export const FORMAT_INFO_POSITION = 8;
export const BOTTOM_RIGHT_REGION_START = 13;
export const MATRIX_MAX_INDEX = MATRIX_SIZE - 1;

// QR Version 1 capacity limits
export const CAPACITY_V1 = {
  numeric: { L: 41, M: 34, Q: 27, H: 17 },
  alnum: { L: 25, M: 20, Q: 16, H: 10 },
  byte: { L: 17, M: 14, Q: 11, H: 7 },
};

// Error correction parameters for Version 1
export const ERROR_CORRECTION_CODEWORDS = {
  L: 7,  // 19 data + 7 EC = 26 total
  M: 10, // 16 data + 10 EC = 26 total
  Q: 13, // 13 data + 13 EC = 26 total
  H: 17, // 9 data + 17 EC = 26 total
};

export const TOTAL_CODEWORDS_V1 = 26;
