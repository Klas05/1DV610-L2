// Format information for Error Correction Level L (01) with different mask patterns
const FORMAT_INFO_PATTERNS = {
  // Mask 0: 111011111000100
  0: [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0],
  // Mask 1: 111001011110011
  1: [1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1],
  // Mask 2: 111110110101010
  2: [1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0],
  // Mask 3: 111100010011101
  3: [1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1],
  // Mask 4: 110011000101111
  4: [1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1],
  // Mask 5: 110001100011000
  5: [1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0],
  // Mask 6: 110110001000001
  6: [1, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  // Mask 7: 110100101110110
  7: [1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0],
};
const TIMING_PATTERN_COLUMN = 6;
const TIMING_PATTERN_ROW = 6;

export function placeFormatInfo(matrix, maskPattern = 0) {
  const formatBits = FORMAT_INFO_PATTERNS[maskPattern];
  
  placeTopLeftFormatInfo(matrix, formatBits);
  
  placeBottomLeftTopRightFormatInfo(matrix, formatBits);
}

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

function placeBottomLeftTopRightFormatInfo(matrix, formatBits) {
  let bitIndex = 0;
  
  // Bottom-left format bits (column 8, rows 20 down to 13)
  for (let row = 20; row >= 13; row--) {
    matrix[row][8] = formatBits[bitIndex++];
  }
  
  // Top-right format bits (row 8, columns 20 down to 13)
  for (let col = 20; col >= 13; col--) {
    matrix[8][col] = formatBits[bitIndex++];
  }
}