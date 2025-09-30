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
    matrix[i][6] = (i + 1) % 2; // Vertical timing pattern
    matrix[6][i] = (i + 1) % 2; // Horizontal timing pattern
  }
}

export function createMatrix() {
  const matrix = createEmptyMatrix(size);
  placeTimingPatterns(matrix);
  placeFinderPattern(matrix, 0, 0);
  placeFinderPattern(matrix, 0, size - 7);
  placeFinderPattern(matrix, size - 7, 0);
  return matrix;
}

function insertPayload(matrix, data) {
  let dataIndex = 0;
  const matrixSize = matrix.length;

  for (let row = matrixSize - 1; row >= 0 && dataIndex < data.length; row--) {
    for (let col = matrixSize - 1; col >= 0 && dataIndex < data.length; col--) {
      if (matrix[row][col] === null) {
        matrix[row][col] = data[dataIndex];
        dataIndex++;
      }
    }
  }

  // Replace any remaining nulls with 0s
  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      if (matrix[r][c] === null) {
        matrix[r][c] = 0;
      }
    }
  }

  return matrix;
}

export function createMatrixWithPayload(data) {
  let matrix = createMatrix();
  matrix = insertPayload(matrix, data);
  return matrix;
}
