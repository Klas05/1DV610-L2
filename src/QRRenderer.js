import { PADDING_SIZE } from "./constants.js";

export class QRRenderer {
  renderASCII(matrix) {
    const matrixSize = matrix.length;
    const outputLines = [];

    for (let row = -PADDING_SIZE; row < matrixSize + PADDING_SIZE; row++) {
      let currentLine = "";
      for (let col = -PADDING_SIZE; col < matrixSize + PADDING_SIZE; col++) {
        if (this.#isOutsideMatrix(row, col, matrixSize)) {
          currentLine += "  ";
        } else {
          currentLine += matrix[row][col] === 1 ? "██" : "  ";
        }
      }
      outputLines.push(currentLine);
    }

    return outputLines.join("\n");
  }

  #isOutsideMatrix(row, col, matrixSize) {
    return row < 0 || row >= matrixSize || col < 0 || col >= matrixSize;
  }
}
