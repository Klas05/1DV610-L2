import { validateInput } from "./validator.js";

export function generateQRCode(text, options) {
  // Validate input first
  validateInput(text, options);

  // QR code generation logic goes here
}
