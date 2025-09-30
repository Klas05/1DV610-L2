import { validateInput } from "./validator.js";
import { buildDataCodewords } from "./datastream.js";
import { codewordsToBits } from "./encoder.js";
import { buildMatrix } from "./matrix.js";
import { renderASCIIMatrix } from "./renderer.js";

export function generateQRCode(text, options) {
  validateInput(text, options);

  const codewords = buildDataCodewords(text, options);
  const bits = codewordsToBits(codewords);
  const matrix = buildMatrix(bits);
  return matrix;
}

export { validateInput } from "./validator.js";
export { buildDataCodewords } from "./datastream.js";
export { codewordsToBits } from "./encoder.js";
export { renderASCIIMatrix } from "./renderer.js";
export { buildMatrix } from "./matrix.js";

const matrix = generateQRCode("Hello, World!", { mode: "byte" });
const asciiArt = renderASCIIMatrix(matrix);
console.log(asciiArt);
