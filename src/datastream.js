/**
 * Builds the 19 data codewords for Version 1 QR
 * using byte mode and error correction level L.
 */

import { stringToBytes, byteToBits, numberToBits } from "./encoder.js";

// Constants for QR Code Version 1, Level L
const BYTE_MODE_INDICATOR = 4;
const BYTE_MODE_BITS = 4;
const CHAR_COUNT_BITS = 8;
const MAX_DATA_CODEWORDS = 19;
const BITS_PER_CODEWORD = 8;
const MAX_BITS = MAX_DATA_CODEWORDS * BITS_PER_CODEWORD;
const TERMINATOR_MAX_BITS = 4;
const PAD_BYTES = [0xec, 0x11];

export function buildDataCodewords(text, { mode = "byte" } = {}) {
  validateMode(mode);

  const dataBits = createDataBits(text);
  const paddedBits = addPadding(dataBits);
  return convertBitsToCodewords(paddedBits);
}

function createDataBits(text) {
  const byteData = stringToBytes(text);
  const bits = [];

  bits.push(...createModeIndicator());
  bits.push(...createCharacterCount(byteData.length));
  bits.push(...createDataSection(byteData));

  return bits;
}

function addPadding(dataBits) {
  const bits = [...dataBits];

  addTerminatorBits(bits);
  addBytePadding(bits);

  return bits;
}

function convertBitsToCodewords(bits) {
  const codewords = [];

  // Convert bits to codewords
  for (let i = 0; i < bits.length; i += BITS_PER_CODEWORD) {
    const codewordBits = bits.slice(i, i + BITS_PER_CODEWORD);
    const codeword = parseInt(codewordBits.join(""), 2);
    codewords.push(codeword);
  }

  // Add pad codewords if needed
  addPadCodewords(codewords);

  return codewords;
}

function validateMode(mode) {
  if (mode !== "byte") {
    throw new Error("Only byte mode is supported in this implementation.");
  }
}

function createModeIndicator() {
  return numberToBits(BYTE_MODE_INDICATOR, BYTE_MODE_BITS);
}

function createCharacterCount(length) {
  return numberToBits(length, CHAR_COUNT_BITS);
}

function createDataSection(byteData) {
  const bits = [];
  for (const byte of byteData) {
    bits.push(...byteToBits(byte));
  }
  return bits;
}

function addTerminatorBits(bits) {
  const terminatorLength = Math.min(
    TERMINATOR_MAX_BITS,
    MAX_BITS - bits.length
  );
  bits.push(...Array(terminatorLength).fill(0));
}

function addBytePadding(bits) {
  while (bits.length % BITS_PER_CODEWORD !== 0) {
    bits.push(0);
  }
}

function addPadCodewords(codewords) {
  let padIndex = 0;

  while (codewords.length < MAX_DATA_CODEWORDS) {
    codewords.push(PAD_BYTES[padIndex % PAD_BYTES.length]);
    padIndex++;
  }
}
