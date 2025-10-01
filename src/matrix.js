import { insertPayload } from "./dataplacer.js";
import { placeFormatInfo } from "./formatinfo.js";
import { MaskApplier } from "./MaskApplier.js";
import {
  MATRIX_SIZE,
  FINDER_PATTERN_SIZE,
  TIMING_PATTERN_COLUMN,
  TIMING_PATTERN_ROW,
  DARK_MODULE_ROW,
  DARK_MODULE_COL,
} from "./constants.js";

// Builds complete QR matrix: template -> data -> format -> masking
export function buildMatrix(data, maskPattern = 0) {
  const maskApplier = new MaskApplier();
  const matrix = createMatrixTemplate();
  insertPayload(matrix, data);
  placeFormatInfo(matrix, maskPattern);
  placeDarkModule(matrix);
  maskApplier.applyMask(matrix, maskPattern);
  padMatrix(matrix);
  return matrix;
}

// Creates base QR structure with finder patterns, timing patterns, format reservations
function createMatrixTemplate() {
  const matrixTemplate = createEmptyMatrix(MATRIX_SIZE);
  const finderPositions = getFinderPositions();

  finderPositions.forEach(([row, col]) => {
    placeFinderPattern(matrixTemplate, row, col);
    placeSeparator(matrixTemplate, row, col);
  });

  placeTimingPatterns(matrixTemplate);
  reserveFormatBits(matrixTemplate);

  return matrixTemplate;
}

function createEmptyMatrix(size) {
  return Array.from({ length: size }, () => Array(size).fill(null));
}

// Finder patterns go in three corners to help scanners locate the QR code
function getFinderPositions() {
  return [
    [0, 0], // top-left
    [0, MATRIX_SIZE - FINDER_PATTERN_SIZE], // top-right
    [MATRIX_SIZE - FINDER_PATTERN_SIZE, 0], // bottom-left
  ];
}

// 7x7 bullseye pattern that QR scanners use for positioning and orientation
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

// White border around finder patterns so they don't blend with data
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

// Alternating black/white lines that help with size detection and distortion correction
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

// Mark spots where format info will go (error correction level + mask pattern)
function reserveFormatBits(matrix) {
  reserveTopLeftFormatBits(matrix);
  reserveBottomLeftTopRightFormatBits(matrix);
}

// Always-black module required by QR standard
function placeDarkModule(matrix) {
  matrix[DARK_MODULE_ROW][DARK_MODULE_COL] = 1;
}

// Fill any leftover null spots with white
function padMatrix(matrix) {
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (matrix[row][col] === null) {
        matrix[row][col] = 0;
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
      matrix[8][col] = "F";
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
