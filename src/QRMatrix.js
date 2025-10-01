import {
  MATRIX_SIZE,
  FINDER_PATTERN_SIZE,
  TIMING_PATTERN_COLUMN,
  TIMING_PATTERN_ROW,
  DARK_MODULE_ROW,
  DARK_MODULE_COL,
} from "./constants.js";
import { DataPlacer } from "./DataPlacer.js";
import { FormatInfoPlacer } from "./FormatInfoPlacer.js";
import { MaskApplier } from "./MaskApplier.js";
import { codewordsToBits } from "./conversionUtils.js";

export class QRMatrix {
  constructor(version = 1) {
    this.version = version;
    this.size = MATRIX_SIZE;
    this.matrix = null;
    this.formatInfoPlacer = new FormatInfoPlacer();
    this.maskApplier = new MaskApplier();
  }

  build(dataCodewords, maskPattern = 0) {
    this.matrix = this.#createTemplate();

    const bits = codewordsToBits(dataCodewords);
    this.#placeData(bits);
    this.formatInfoPlacer.place(this.matrix, maskPattern);
    this.#placeDarkModule();
    this.maskApplier.applyMask(this.matrix, maskPattern);
    this.#padMatrix();

    return this.matrix;
  }

  #createTemplate() {
    const matrix = this.#createEmptyMatrix();

    this.#placeFinderPatterns(matrix);
    this.#placeTimingPatterns(matrix);
    this.#reserveFormatBits(matrix);

    return matrix;
  }

  #createEmptyMatrix() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(null));
  }

  #placeFinderPatterns(matrix) {
    const positions = this.#getFinderPositions();

    positions.forEach(([row, col]) => {
      this.#placeFinderPattern(matrix, row, col);
      this.#placeSeparator(matrix, row, col);
    });
  }

  #getFinderPositions() {
    return [
      [0, 0],
      [0, MATRIX_SIZE - FINDER_PATTERN_SIZE],
      [MATRIX_SIZE - FINDER_PATTERN_SIZE, 0],
    ];
  }

  #placeFinderPattern(matrix, row, col) {
    const pattern = [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1],
    ];

    for (let rowOffset = 0; rowOffset < pattern.length; rowOffset++) {
      for (
        let colOffset = 0;
        colOffset < pattern[rowOffset].length;
        colOffset++
      ) {
        matrix[row + rowOffset][col + colOffset] =
          pattern[rowOffset][colOffset];
      }
    }
  }

  #placeSeparator(matrix, row, col) {
    for (let rowOffset = -1; rowOffset <= FINDER_PATTERN_SIZE; rowOffset++) {
      for (let colOffset = -1; colOffset <= FINDER_PATTERN_SIZE; colOffset++) {
        const targetRow = row + rowOffset;
        const targetCol = col + colOffset;

        if (
          this.#isInBounds(targetRow, targetCol) &&
          this.#isOutsideFinderPattern(rowOffset, colOffset)
        ) {
          matrix[targetRow][targetCol] = 0;
        }
      }
    }
  }

  #placeTimingPatterns(matrix) {
    for (let i = 8; i < MATRIX_SIZE - 8; i++) {
      if (matrix[i][TIMING_PATTERN_COLUMN] === null) {
        matrix[i][TIMING_PATTERN_COLUMN] = i % 2;
      }
      if (matrix[TIMING_PATTERN_ROW][i] === null) {
        matrix[TIMING_PATTERN_ROW][i] = i % 2;
      }
    }
  }

  #reserveFormatBits(matrix) {
    this.#reserveTopLeftFormatBits(matrix);
    this.#reserveBottomLeftTopRightFormatBits(matrix);
  }

  #placeData(bits) {
    const placer = new DataPlacer(this.matrix, bits);
    placer.placeAll();
  }

  #placeDarkModule() {
    this.matrix[DARK_MODULE_ROW][DARK_MODULE_COL] = 1;
  }

  #padMatrix() {
    for (let row = 0; row < this.matrix.length; row++) {
      for (let col = 0; col < this.matrix[row].length; col++) {
        if (this.matrix[row][col] === null) {
          this.matrix[row][col] = 0;
        }
      }
    }
  }

  #isInBounds(row, col) {
    return row >= 0 && row < MATRIX_SIZE && col >= 0 && col < MATRIX_SIZE;
  }

  #isOutsideFinderPattern(rowOffset, colOffset) {
    return (
      rowOffset < 0 ||
      rowOffset > FINDER_PATTERN_SIZE - 1 ||
      colOffset < 0 ||
      colOffset > FINDER_PATTERN_SIZE - 1
    );
  }

  #reserveTopLeftFormatBits(matrix) {
    for (let col = 0; col <= 8; col++) {
      if (col !== TIMING_PATTERN_COLUMN) {
        matrix[8][col] = "F";
      }
    }

    for (let row = 0; row <= 8; row++) {
      if (row !== TIMING_PATTERN_ROW) {
        matrix[row][8] = "F";
      }
    }
  }

  #reserveBottomLeftTopRightFormatBits(matrix) {
    for (let row = 13; row < MATRIX_SIZE; row++) {
      matrix[row][8] = "F";
    }

    for (let col = 13; col < MATRIX_SIZE; col++) {
      matrix[8][col] = "F";
    }
  }
}
