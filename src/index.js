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

const matrix = generateQRCode("Hello, World!", { mode: "byte" });
const asciiArt = renderASCIIMatrix(matrix);
console.log(asciiArt);