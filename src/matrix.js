const MATRIX_SIZE = 21; // Version 1 QR code size
const TIMING_PATTERN_COLUMN = 6;
const TIMING_PATTERN_ROW = 6;
const COLUMN_PAIR_WIDTH = 2;
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

export function createMatrix() {
  const matrix = createEmptyMatrix(MATRIX_SIZE);
  const finderPositions = getFinderPositions();

  finderPositions.forEach(([row, col]) => {
    placeFinderPattern(matrix, row, col);
    placeSeparator(matrix, row, col);
  });

  placeTimingPatterns(matrix);
  return matrix;
}

function processColumnPair(matrix, col, data, dataIndex, isMovingUp) {
  const startRow = isMovingUp ? MATRIX_SIZE - 1 : 0;
  const endRow = isMovingUp ? -1 : MATRIX_SIZE;
  const step = isMovingUp ? -1 : 1;

  for (let row = startRow; row !== endRow; row += step) {
    dataIndex = tryPlacingBitPair(matrix, row, col, data, dataIndex);
  }
  return dataIndex;
}

function insertPayload(matrix, data) {
  if (!data || data.length === 0) {
    throw new Error("Data cannot be empty");
  }

  let dataIndex = 0;
  let isMovingUp = true;

  for (
    let col = MATRIX_SIZE - 1;
    col > 0 && dataIndex < data.length;
    col -= COLUMN_PAIR_WIDTH
  ) {
    if (col === TIMING_PATTERN_COLUMN) {
      col--; // Skip vertical timing pattern
    }

    dataIndex = processColumnPair(matrix, col, data, dataIndex, isMovingUp);
    isMovingUp = !isMovingUp;
  }

  return matrix;
}

function tryPlacingBitPair(matrix, row, col, data, dataIndex) {
  if (matrix[row][col] === null && dataIndex < data.length) {
    matrix[row][col] = data[dataIndex++];
  }
  if (matrix[row][col - 1] === null && dataIndex < data.length) {
    matrix[row][col - 1] = data[dataIndex++];
  }
  return dataIndex;
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
  let matrix = createMatrix();
  matrix = insertPayload(matrix, data);
  padMatrix(matrix);
  return matrix;
}
