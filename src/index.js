import { validateInput } from "./validator.js";
import { encodeByte } from "./encoder.js";

export function generateQRCode(text, options) {
  validateInput(text, options);

  const encodedData = encodeByte(text);
  return matrix;
}
