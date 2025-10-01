import { PADDING_SIZE } from "./constants.js";

export class QRRenderer {
  renderASCII(matrix) {
    const size = matrix.length;
    const lines = [];

    for (let r = -PADDING_SIZE; r < size + PADDING_SIZE; r++) {
      let line = "";
      for (let c = -PADDING_SIZE; c < size + PADDING_SIZE; c++) {
        if (r < 0 || r >= size || c < 0 || c >= size) {
          line += "  ";
        } else {
          line += matrix[r][c] === 1 ? "██" : "  ";
        }
      }
      lines.push(line);
    }

    return lines.join("\n");
  }
}
