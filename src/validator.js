// Validates input against QR Version 1 capacity limits

const CAPACITY_V1 = {
  numeric: { L: 41, M: 34, Q: 27, H: 17 },
  alnum: { L: 25, M: 20, Q: 16, H: 10 },
  byte: { L: 17, M: 14, Q: 11, H: 7 }, // bytes, not characters
};

export function validateInput(text, { mode = "byte", ecLevel = "L" } = {}) {
  if (!text || typeof text !== "string") {
    throw new Error("Input must be a non-empty string.");
  }

  if (mode === "numeric" && !/^\d+$/.test(text)) {
    throw new Error("Numeric mode supports only digits 0–9.");
  }

  if (mode === "alnum" && !/^[0-9A-Z $%*+\-\.\/:]+$/.test(text)) {
    throw new Error("Alphanumeric mode supports: 0–9, A–Z, space, $%*+-./:");
  }

  const maxLen = CAPACITY_V1[mode][ecLevel];
  // byte mode counts UTF-8 bytes, not characters
  const length =
    mode === "byte" ? new TextEncoder().encode(text).length : text.length;

  if (length > maxLen) {
    throw new Error(
      `Too long for Version 1 (${mode}, EC ${ecLevel}). ` +
        `Max = ${maxLen}, got ${length}.`
    );
  }
}
