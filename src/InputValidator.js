import { CAPACITY_V1 } from "./constants.js";

export class InputValidator {
  constructor(version = 1, errorCorrectionLevel = "L") {
    this.version = version;
    this.errorCorrectionLevel = errorCorrectionLevel;
  }

  validate(text, options = {}) {
    const mode = options.mode || "byte";
    const ecLevel = options.ecLevel || this.errorCorrectionLevel;

    this.#validateString(text);
    this.#validateMode(text, mode);
    this.#validateLength(text, mode, ecLevel);
  }

  #validateString(text) {
    if (!text || typeof text !== "string") {
      throw new Error("Input must be a non-empty string.");
    }
  }

  #validateMode(text, mode) {
    if (mode === "numeric" && !/^\d+$/.test(text)) {
      throw new Error("Numeric mode supports only digits 0–9.");
    }

    if (mode === "alnum" && !/^[0-9A-Z $%*+\-\.\/:]+$/.test(text)) {
      throw new Error("Alphanumeric mode supports: 0–9, A–Z, space, $%*+-./:");
    }
  }

  #validateLength(text, mode, ecLevel) {
    const maxLen = CAPACITY_V1[mode][ecLevel];
    const length =
      mode === "byte" ? new TextEncoder().encode(text).length : text.length;

    if (length > maxLen) {
      throw new Error(
        `Too long for Version 1 (${mode}, EC ${ecLevel}). Max = ${maxLen}, got ${length}.`
      );
    }
  }
}
