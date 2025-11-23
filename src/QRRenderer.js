export class QRRenderer {
  static #PADDING_SIZE = 4;

  renderASCII(matrix) {
    const matrixSize = matrix.length;
    const outputLines = [];

    for (let row = -QRRenderer.#PADDING_SIZE; row < matrixSize + QRRenderer.#PADDING_SIZE; row++) {
      let currentLine = "";
      for (let col = -QRRenderer.#PADDING_SIZE; col < matrixSize + QRRenderer.#PADDING_SIZE; col++) {
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
