import { insertPayload } from "./dataplacer.js";
import { placeFormatInfo } from "./formatinfo.js";
import { applyMask } from "./masking.js";

const MATRIX_SIZE = 21; // Version 1 QR code size
const TIMING_PATTERN_COLUMN = 6;
const TIMING_PATTERN_ROW = 6;
const FINDER_PATTERN_SIZE = 7;
const DARK_MODULE_ROW = 8;
const DARK_MODULE_COL = 13;

export function buildMatrix(data, maskPattern = 0) {
  const matrix = createMatrix();
  insertPayload(matrix, data);
  placeFormatInfo(matrix, maskPattern);
  placeDarkModule(matrix);
  applyMask(matrix, maskPattern);
  padMatrix(matrix);
  return matrix;
}

function createMatrix() {
  const matrix = createEmptyMatrix(MATRIX_SIZE);
  const finderPositions = getFinderPositions();

  finderPositions.forEach(([row, col]) => {
    placeFinderPattern(matrix, row, col);
    placeSeparator(matrix, row, col);
  });

  placeTimingPatterns(matrix);
  reserveFormatBits(matrix);

  return matrix;
}

function createEmptyMatrix(size) {
  return Array.from({ length: size }, () => Array(size).fill(null));
}

function getFinderPositions() {
  return [
    [0, 0],
    [0, MATRIX_SIZE - FINDER_PATTERN_SIZE],
    [MATRIX_SIZE - FINDER_PATTERN_SIZE, 0],
  ];
}

function placeFinderPattern(matrix, row, col) {
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
      matrix[row + rowOffset][col + colOffset] = pattern[rowOffset][colOffset];
    }
  }
}

function placeSeparator(matrix, row, col) {
  for (let rowOffset = -1; rowOffset <= FINDER_PATTERN_SIZE; rowOffset++) {
    for (let colOffset = -1; colOffset <= FINDER_PATTERN_SIZE; colOffset++) {
      const targetRow = row + rowOffset;
      const targetCol = col + colOffset;

      if (
        isInBounds(targetRow, targetCol) &&
        isOutsideFinderPattern(rowOffset, colOffset)
      ) {
        matrix[targetRow][targetCol] = 0;
      }
    }
  }
}

function placeTimingPatterns(matrix) {
  for (let i = 8; i < MATRIX_SIZE - 8; i++) {
    if (matrix[i][TIMING_PATTERN_COLUMN] === null) {
      matrix[i][TIMING_PATTERN_COLUMN] = i % 2;
    }
    if (matrix[TIMING_PATTERN_ROW][i] === null) {
      matrix[TIMING_PATTERN_ROW][i] = i % 2;
    }
  }
}

function reserveFormatBits(matrix) {
  reserveTopLeftFormatBits(matrix);
  reserveBottomLeftTopRightFormatBits(matrix);
}

function placeDarkModule(matrix) {
  matrix[DARK_MODULE_ROW][DARK_MODULE_COL] = 1;
}

function padMatrix(matrix) {
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (matrix[row][col] === null) {
        matrix[row][col] = 0; // Pad with 0s
      }
    }
  }
}

function isInBounds(row, col) {
  return row >= 0 && row < MATRIX_SIZE && col >= 0 && col < MATRIX_SIZE;
}

function isOutsideFinderPattern(rowOffset, colOffset) {
  return (
    rowOffset < 0 ||
    rowOffset > FINDER_PATTERN_SIZE - 1 ||
    colOffset < 0 ||
    colOffset > FINDER_PATTERN_SIZE - 1
  );
}

function reserveTopLeftFormatBits(matrix) {
  // Horizontal format bits (row 8, columns 0-8, skipping timing pattern)
  for (let col = 0; col <= 8; col++) {
    if (col !== TIMING_PATTERN_COLUMN) {
      matrix[8][col] = "F"; // 'F' for Format bit
    }
  }

  // Vertical format bits (column 8, rows 0-8, skipping timing pattern)
  for (let row = 0; row <= 8; row++) {
    if (row !== TIMING_PATTERN_ROW) {
      matrix[row][8] = "F";
    }
  }
}

function reserveBottomLeftTopRightFormatBits(matrix) {
  // Bottom-left format bits (column 8, rows 13-20)
  for (let row = 13; row < MATRIX_SIZE; row++) {
    matrix[row][8] = "F";
  }

  // Top-right format bits (row 8, columns 13-20)
  for (let col = 13; col < MATRIX_SIZE; col++) {
    matrix[8][col] = "F";
  }
}
