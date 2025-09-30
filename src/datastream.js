// Builds the 19 data codewords for Version 1 QR
// using byte mode and error correction level L.

import { stringToBytes, byteToBits, numberToBits } from "./encoder.js";

export function buildDataCodewords(text, { mode = "byte" } = {}) {
  if (mode !== "byte") {
    throw new Error("Only byte mode is supported in this implementation.");
  }

  const dataCodewords = [];
  // Implement the logic to build the 19 data codewords

  const byteData = stringToBytes(text);
  const byteBits = [];
  byteBits.push(...numberToBits(4, 4)); // Mode indicator for byte mode
  byteBits.push(...numberToBits(byteData.length, 8)); // Character count indicator
  for (const byte of byteData) byteBits.push(...byteToBits(byte));

  const maxBits = 19 * 8; // 19 codewords * 8 bits each (codeword = byte)
  const terminatorLength = Math.min(4, maxBits - byteBits.length);
  byteBits.push(...Array(terminatorLength).fill(0)); 

  while (byteBits.length % 8 !== 0) byteBits.push(0); 

  for (let i = 0; i < byteBits.length; i += 8) dataCodewords.push(parseInt(byteBits.slice(i, i + 8).join(""), 2));

  const padBytes = [0xec, 0x11];
  let padIndex = 0;

  while (dataCodewords.length < 19) {
    dataCodewords.push(padBytes[padIndex % 2]);
    padIndex++;
  }

  return dataCodewords;
}
