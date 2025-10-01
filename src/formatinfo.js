import { TIMING_PATTERN_COLUMN, TIMING_PATTERN_ROW } from "./constants.js";

// Places format info bits that tell scanners error correction level and mask pattern
// Placed redundantly in two locations for reliability

const FORMAT_INFO_PATTERNS = {
  0: [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0], // mask 0
  1: [1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1], // mask 1
  2: [1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0], // mask 2
  3: [1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1], // mask 3
  4: [1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1], // mask 4
  5: [1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0], // mask 5
  6: [1, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1], // mask 6
  7: [1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0], // mask 7
};

export function placeFormatInfo(matrix, maskPattern = 0) {
  const formatBits = FORMAT_INFO_PATTERNS[maskPattern];

  placeTopLeftFormatInfo(matrix, formatBits);
  placeBottomLeftTopRightFormatInfo(matrix, formatBits);
}

// L-shaped placement around top-left finder pattern
function placeTopLeftFormatInfo(matrix, formatBits) {
  let bitIndex = 0;

  for (let col = 0; col <= 8; col++) {
    if (col !== TIMING_PATTERN_COLUMN) {
      matrix[8][col] = formatBits[bitIndex++];
    }
  }

  for (let row = 7; row >= 0; row--) {
    if (row !== TIMING_PATTERN_ROW) {
      matrix[row][8] = formatBits[bitIndex++];
    }
  }
}

// Split between bottom-left and top-right for redundancy
function placeBottomLeftTopRightFormatInfo(matrix, formatBits) {
  let bitIndex = 0;

  for (let row = 20; row >= 13; row--) {
    matrix[row][8] = formatBits[bitIndex++];
  }

  for (let col = 20; col >= 13; col--) {
    matrix[8][col] = formatBits[bitIndex++];
  }
}
