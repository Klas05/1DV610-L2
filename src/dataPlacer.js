import { MATRIX_SIZE, TIMING_PATTERN_COLUMN, COLUMN_PAIR_WIDTH } from "./constants.js";

// Places data bits in QR matrix using zigzag column pattern
// Starts from bottom-right, moves up/down in 2-column pairs

export class DataPlacer {
  constructor(matrix, data) {
    this.matrix = matrix;
    this.data = data;
    this.dataIndex = 0;
    this.isMovingUp = true;
  }

  placeAll() {
    for (
      let col = MATRIX_SIZE - 1;
      col > 0 && this.hasMoreData();
      col -= COLUMN_PAIR_WIDTH
    ) {
      col = this.skipTimingPatternIfNeeded(col);
      this.processColumnPair(col);
      this.toggleDirection();
    }

    return this.matrix;
  }

  // Process right column then left column in each pair
  processColumnPair(col) {
    const traversal = new ColumnTraversal(this.isMovingUp);

    for (let row of traversal.getRows()) {
      this.tryPlacingBitPair(row, col);
      if (!this.hasMoreData()) break;
    }
  }

  tryPlacingBitPair(row, col) {
    this.tryPlacingBit(row, col); // Right column
    this.tryPlacingBit(row, col - 1); // Left column
  }

  tryPlacingBit(row, col) {
    if (this.isCellAvailable(row, col) && this.hasMoreData()) {
      this.matrix[row][col] = this.data[this.dataIndex++];
    }
  }

  // Skip timing pattern column during traversal
  skipTimingPatternIfNeeded(col) {
    return col === TIMING_PATTERN_COLUMN ? col - 1 : col;
  }

  hasMoreData() {
    return this.dataIndex < this.data.length;
  }

  // Only place in empty cells (null = available)
  isCellAvailable(row, col) {
    return this.matrix[row][col] === null;
  }

  // Alternate between up and down movement
  toggleDirection() {
    this.isMovingUp = !this.isMovingUp;
  }
}

class ColumnTraversal {
  constructor(isMovingUp) {
    this.isMovingUp = isMovingUp;
  }

  getRows() {
    if (this.isMovingUp) {
      return this.getUpwardTraversal();
    } else {
      return this.getDownwardTraversal();
    }
  }

  getUpwardTraversal() {
    return Array.from({ length: MATRIX_SIZE }, (_, i) => MATRIX_SIZE - 1 - i);
  }

  getDownwardTraversal() {
    return Array.from({ length: MATRIX_SIZE }, (_, i) => i);
  }
}

export function insertPayload(matrix, data) {
  const placer = new DataPlacer(matrix, data);
  return placer.placeAll();
}
