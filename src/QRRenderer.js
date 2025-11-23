export class QRRenderer {
  static #PADDING_SIZE = 4;
  static #DEFAULT_MODULE_SIZE = 10;

  renderASCII(matrix) {
    const matrixSize = matrix.length;
    const outputLines = [];

    for (
      let row = -QRRenderer.#PADDING_SIZE;
      row < matrixSize + QRRenderer.#PADDING_SIZE;
      row++
    ) {
      let currentLine = "";
      for (
        let col = -QRRenderer.#PADDING_SIZE;
        col < matrixSize + QRRenderer.#PADDING_SIZE;
        col++
      ) {
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

  renderSVG(matrix, moduleSize = QRRenderer.#DEFAULT_MODULE_SIZE) {
    const matrixSize = matrix.length;
    const totalSize = this.#calculateTotalSize(matrixSize, moduleSize);

    const svgParts = [
      this.#createSVGHeader(totalSize),
      this.#createBackground(totalSize),
      this.#createQRModules(matrix, moduleSize),
      this.#createSVGFooter(),
    ];

    return svgParts.join("");
  }

  #calculateTotalSize(matrixSize, moduleSize) {
    return (matrixSize + 2 * QRRenderer.#PADDING_SIZE) * moduleSize;
  }

  #createSVGHeader(totalSize) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalSize} ${totalSize}" width="${totalSize}" height="${totalSize}">`;
  }

  #createBackground(totalSize) {
    return `<rect width="${totalSize}" height="${totalSize}" fill="white"/>`;
  }

  #createQRModules(matrix, moduleSize) {
    const matrixSize = matrix.length;
    const modules = [];

    for (let row = 0; row < matrixSize; row++) {
      for (let col = 0; col < matrixSize; col++) {
        if (this.#isBlackModule(matrix, row, col)) {
          modules.push(this.#createModuleRect(row, col, moduleSize));
        }
      }
    }
    return modules.join("");
  }

  #isBlackModule(matrix, row, col) {
    return matrix[row][col] === 1;
  }

  #createModuleRect(row, col, moduleSize) {
    const x = (col + QRRenderer.#PADDING_SIZE) * moduleSize;
    const y = (row + QRRenderer.#PADDING_SIZE) * moduleSize;
    return `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="black"/>`;
  }

  #createSVGFooter() {
    return "</svg>";
  }
}
