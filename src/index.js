import { validateInput } from "./validator.js";
import { DataEncoder } from "./DataEncoder.js";
import { QRMatrix } from "./QRMatrix.js";
import { QRRenderer } from "./QRRenderer.js";

const qrRenderer = new QRRenderer();

export function generateQRCode(text, options) {
  validateInput(text, options);

  const dataEncoder = new DataEncoder();
  const codewords = dataEncoder.encode(text, options);
  const matrix = new QRMatrix().build(codewords, options.maskPattern || 0);
  return matrix;
}

export { validateInput } from "./validator.js";
export { codewordsToBits } from "./conversionUtils.js";

const matrix = generateQRCode("Hello, World!", { mode: "byte" });
const asciiArt = qrRenderer.renderASCII(matrix);
console.log(asciiArt);
