import {
  FINDER_PATTERN_POSITIONS,
  SEPARATOR_SIZE,
  SEPARATOR_POSITION,
  TIMING_PATTERN_ROW,
  TIMING_PATTERN_COLUMN,
  FORMAT_INFO_POSITION,
  BOTTOM_RIGHT_REGION_START,
  MATRIX_MAX_INDEX,
} from "./constants.js";

export class MaskApplier {
  applyMask(matrix, maskPattern = 0) {
    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        this.#applyMaskToCell(matrix, row, col, maskPattern);
      }
    }
  }

  #applyMaskToCell(matrix, row, col, maskPattern) {
    if (!this.#isDataModule(matrix, row, col)) {
      return;
    }

    if (this.#shouldMask(row, col, maskPattern)) {
      this.#flipBit(matrix, row, col);
    }
  }

  #flipBit(matrix, row, col) {
    matrix[row][col] = matrix[row][col] === 1 ? 0 : 1;
  }

  #isDataModule(matrix, row, col) {
    if (this.#isFinderPattern(row, col)) return false;
    if (this.#isSeparator(row, col)) return false;
    if (row === TIMING_PATTERN_ROW || col === TIMING_PATTERN_COLUMN) return false;
    if (this.#isFormatInfo(row, col)) return false;
    return true;
  }

  // QR Code Masking Patterns as per ISO/IEC 18004
  #shouldMask(row, col, maskPattern) {
    switch (maskPattern) {
      case 0:
        return (row + col) % 2 === 0;
      case 1:
        return row % 2 === 0;
      case 2:
        return col % 3 === 0;
      case 3:
        return (row + col) % 3 === 0;
      case 4:
        return (Math.floor(row / 2) + Math.floor(col / 3)) % 2 === 0;
      case 5:
        return ((row * col) % 2) + ((row * col) % 3) === 0;
      case 6:
        return (((row * col) % 2) + ((row * col) % 3)) % 2 === 0;
      case 7:
        return (((row + col) % 2) + ((row * col) % 3)) % 2 === 0;
      default:
        return false;
    }
  }

  #isFinderPattern(row, col) {
    return FINDER_PATTERN_POSITIONS.some(
      ([patternRow, patternCol]) =>
        row >= patternRow &&
        row < patternRow + SEPARATOR_SIZE &&
        col >= patternCol &&
        col < patternCol + SEPARATOR_SIZE
    );
  }

  #isSeparator(row, col) {
    return (
      this.#isTopLeftSeparator(row, col) ||
      this.#isTopRightSeparator(row, col) ||
      this.#isBottomLeftSeparator(row, col)
    );
  }

  #isTopLeftSeparator(row, col) {
    return (
      (row === SEPARATOR_POSITION && col <= SEPARATOR_POSITION) ||
      (col === SEPARATOR_POSITION && row <= TIMING_PATTERN_ROW)
    );
  }

  #isTopRightSeparator(row, col) {
    return (
      (row === SEPARATOR_POSITION && col >= BOTTOM_RIGHT_REGION_START && col <= MATRIX_MAX_INDEX) ||
      (col === BOTTOM_RIGHT_REGION_START && row <= TIMING_PATTERN_ROW)
    );
  }

  #isBottomLeftSeparator(row, col) {
    return (
      (row === BOTTOM_RIGHT_REGION_START && col <= SEPARATOR_POSITION) ||
      (col === SEPARATOR_POSITION && row >= BOTTOM_RIGHT_REGION_START && row <= MATRIX_MAX_INDEX)
    );
  }

  #isFormatInfo(row, col) {
    if (row === FORMAT_INFO_POSITION && col <= FORMAT_INFO_POSITION && col !== TIMING_PATTERN_COLUMN) return true;
    if (col === FORMAT_INFO_POSITION && row <= FORMAT_INFO_POSITION && row !== TIMING_PATTERN_ROW) return true;
    if (col === FORMAT_INFO_POSITION && row >= BOTTOM_RIGHT_REGION_START) return true;
    if (row === FORMAT_INFO_POSITION && col >= BOTTOM_RIGHT_REGION_START) return true;
    return false;
  }
}
