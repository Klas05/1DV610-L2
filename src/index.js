import { QRCodeGenerator } from "./QRCodeGenerator.js";
import { InputValidator } from "./InputValidator.js";
import { DataEncoder } from "./DataEncoder.js";
import { QRRenderer } from "./QRRenderer.js";
import { codewordsToBits } from "./conversionUtils.js";

// Main high-level API (backwards compatibility)
export function generateQRCode(text, options = {}) {
  const generator = new QRCodeGenerator();
  return generator.generate(text, options);
}

export function renderASCIIMatrix(matrix) {
  const renderer = new QRRenderer();
  return renderer.renderASCII(matrix);
}

export function renderSVGMatrix(matrix, moduleSize) {
  const renderer = new QRRenderer();
  return renderer.renderSVG(matrix, moduleSize);
}

export function validateInput(text, options = {}) {
  const validator = new InputValidator();
  return validator.validate(text, options);
}

export function buildDataCodewords(text, options = {}) {
  const encoder = new DataEncoder();
  return encoder.encode(text, options);
}

// Export utility function
export { codewordsToBits };
