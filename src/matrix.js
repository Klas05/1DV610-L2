import { insertPayload } from './dataPlacer.js';

const MATRIX_SIZE = 21; // Version 1 QR code size
const TIMING_PATTERN_COLUMN = 6;
const TIMING_PATTERN_ROW = 6;
const FINDER_PATTERN_SIZE = 7;

function createEmptyMatrix(size) {
  return Array.from({ length: size }, () => Array(size).fill(null));
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

function placeTimingPatterns(matrix) {
  for (let i = 0; i < MATRIX_SIZE; i++) {
    if (matrix[i][TIMING_PATTERN_COLUMN] === null) {
      matrix[i][TIMING_PATTERN_COLUMN] = (i + 1) % 2;
    }
    if (matrix[TIMING_PATTERN_ROW][i] === null) {
      matrix[TIMING_PATTERN_ROW][i] = (i + 1) % 2;
    }
  }
}

function getFinderPositions() {
  return [
    [0, 0],
    [0, MATRIX_SIZE - FINDER_PATTERN_SIZE],
    [MATRIX_SIZE - FINDER_PATTERN_SIZE, 0],
  ];
}

function createMatrix() {
  const matrix = createEmptyMatrix(MATRIX_SIZE);
  const finderPositions = getFinderPositions();

  finderPositions.forEach(([row, col]) => {
    placeFinderPattern(matrix, row, col);
    placeSeparator(matrix, row, col);
  });

  placeTimingPatterns(matrix);
  return matrix;
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

export function buildMatrix(data) {
  const matrix = createMatrix();
  insertPayload(matrix, data);
  padMatrix(matrix);
  return matrix;
}
