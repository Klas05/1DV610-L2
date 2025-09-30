export function renderASCIIMatrix(matrix) {
  const paddingSize = 4;
  const size = matrix.length;

  const fullSize = size + 2 * paddingSize;
  const lines = [];

  for (let r = -paddingSize; r < size + paddingSize; r++) {
    let line = "";
    for (let c = -paddingSize; c < size + paddingSize; c++) {
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
