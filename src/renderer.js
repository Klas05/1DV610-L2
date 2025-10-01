import { PADDING_SIZE } from "./constants.js";

export function renderASCIIMatrix(matrix) {
  const size = matrix.length;
  const fullSize = size + 2 * PADDING_SIZE;
  const lines = [];

  for (let r = -PADDING_SIZE; r < size + PADDING_SIZE; r++) {
    let line = "";
    for (let c = -PADDING_SIZE; c < size + PADDING_SIZE; c++) {
      if (r < 0 || r >= size || c < 0 || c >= size) {
        line += "  "; // Padding
      } else {
        line += matrix[r][c] === 1 ? "██" : "  "; // Black or white module
      }
    }
    lines.push(line);
  }

  return lines.join("\n");
}
