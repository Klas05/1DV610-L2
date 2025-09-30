import { validateInput } from "./validator.js";
import { encodeByte } from "./encoder.js";
import { createMatrixWithPayload } from "./matrix.js";

export function generateQRCode(text, options) {
  validateInput(text, options);

  const encodedData = encodeByte(text);
  const matrix = createMatrixWithPayload(encodedData);
  return matrix;
}
