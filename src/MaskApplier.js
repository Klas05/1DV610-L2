import { FINDER_PATTERN_POSITIONS, SEPARATOR_SIZE } from "./constants.js";

export class MaskApplier {
  applyMask(matrix, maskPattern = 0) {
    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        if (this.#isDataModule(matrix, row, col)) {
          if (this.#shouldMask(row, col, maskPattern)) {
            matrix[row][col] = matrix[row][col] === 1 ? 0 : 1;
          }
        }
      }
    }
  }

  #isDataModule(matrix, row, col) {
    if (this.#isFinderPattern(row, col)) return false;
    if (this.#isSeparator(row, col)) return false;
    if (row === 6 || col === 6) return false;
    if (this.#isFormatInfo(row, col)) return false;
    return true;
  }

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
    if ((row === 7 && col <= 7) || (col === 7 && row <= 6)) return true;
    if ((row === 7 && col >= 13 && col <= 20) || (col === 13 && row <= 6))
      return true;
    if ((row === 13 && col <= 7) || (col === 7 && row >= 13 && row <= 20))
      return true;
    return false;
  }

  #isFormatInfo(row, col) {
    if (row === 8 && col <= 8 && col !== 6) return true;
    if (col === 8 && row <= 8 && row !== 6) return true;
    if (col === 8 && row >= 13) return true;
    if (row === 8 && col >= 13) return true;
    return false;
  }
}
