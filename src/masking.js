export function applyMask(matrix, maskPattern = 0) {
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (isDataModule(matrix, row, col)) {
        if (shouldMask(row, col, maskPattern)) {
          matrix[row][col] = matrix[row][col] === 1 ? 0 : 1; // Flip bit
        }
      }
    }
  }
}

function isDataModule(matrix, row, col) {
  if (isFinderPattern(row, col)) return false;
  if (isSeparator(row, col)) return false;
  if (row === 6 || col === 6) return false;
  if (isFormatInfo(row, col)) return false;
  return true;
}

function shouldMask(row, col, maskPattern) {
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

function isFinderPattern(row, col) {
  const patterns = [
    [0, 0],
    [0, 14],
    [14, 0], // Top-left, top-right, bottom-left corners
  ];

  return patterns.some(
    ([patternRow, patternCol]) =>
      row >= patternRow &&
      row < patternRow + 7 &&
      col >= patternCol &&
      col < patternCol + 7
  );
}

function isSeparator(row, col) {
  if ((row === 7 && col <= 7) || (col === 7 && row <= 6)) {
    return true;
  }

  if ((row === 7 && col >= 13 && col <= 20) || (col === 13 && row <= 6)) {
    return true;
  }

  if ((row === 13 && col <= 7) || (col === 7 && row >= 13 && row <= 20)) {
    return true;
  }

  return false;
}

function isFormatInfo(row, col) {
  // Format info around top-left
  if (row === 8 && col <= 8 && col !== 6) return true;
  if (col === 8 && row <= 8 && row !== 6) return true;

  // Format info bottom-left and top-right
  if (col === 8 && row >= 13) return true;
  if (row === 8 && col >= 13) return true;

  return false;
}
