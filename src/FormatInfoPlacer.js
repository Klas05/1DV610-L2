import { TIMING_PATTERN_COLUMN, TIMING_PATTERN_ROW } from "./constants.js";

export class FormatInfoPlacer {
  constructor() {
    this.formatPatterns = {
      0: [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0],
      1: [1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1],
      2: [1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0],
      3: [1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1],
      4: [1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1],
      5: [1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0],
      6: [1, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      7: [1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0],
    };
  }

  place(matrix, maskPattern = 0) {
    const formatBits = this.formatPatterns[maskPattern];

    this.#placeTopLeftFormatInfo(matrix, formatBits);
    this.#placeBottomLeftTopRightFormatInfo(matrix, formatBits);
  }

  #placeTopLeftFormatInfo(matrix, formatBits) {
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

  #placeBottomLeftTopRightFormatInfo(matrix, formatBits) {
    let bitIndex = 0;

    for (let row = 20; row >= 13; row--) {
      matrix[row][8] = formatBits[bitIndex++];
    }

    for (let col = 20; col >= 13; col--) {
      matrix[8][col] = formatBits[bitIndex++];
    }
  }
}
