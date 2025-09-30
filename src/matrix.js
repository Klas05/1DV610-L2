const size = 21; // Version 1 QR code size

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
  for (let r = 0; r < pattern.length; r++) {
    for (let c = 0; c < pattern[r].length; c++) {
      matrix[row + r][col + c] = pattern[r][c];
    }
  }
}

function placeTimingPatterns(matrix) {
  for (let i = 0; i < size; i++) {
    if (matrix[i][6] === null) {
      matrix[i][6] = (i + 1) % 2;
    }
    if (matrix[6][i] === null) {
      matrix[6][i] = (i + 1) % 2;
    }
  }
}

export function createMatrix() {
  const matrix = createEmptyMatrix(size);
  placeFinderPattern(matrix, 0, 0);
  placeFinderPattern(matrix, 0, size - 7);
  placeFinderPattern(matrix, size - 7, 0);
  placeTimingPatterns(matrix);
  return matrix;
}

function insertPayload(matrix, data) {
  let dataIndex = 0;
  const matrixSize = matrix.length;
  let isDirectionUp = true;

  let col = matrixSize - 1;
  while (col > 0 && dataIndex < data.length) {
    if (col === 6) col--; // Skip vertical timing pattern
    if (isDirectionUp) {
      for (let row = matrixSize - 1; row >= 0; row--) {
        dataIndex = tryPlacingBitPair(matrix, row, col, data, dataIndex);
      }
    } else {
      for (let row = 0; row < matrixSize; row++) {
        dataIndex = tryPlacingBitPair(matrix, row, col, data, dataIndex);
      }
    }
    isDirectionUp = !isDirectionUp;
    col -= 2;
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
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (matrix[r][c] === null) {
        matrix[r][c] = 0; // Pad with 0s
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
