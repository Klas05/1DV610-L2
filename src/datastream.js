/**
 * Builds the 19 data codewords for Version 1 QR
 * using byte mode and error correction level L.
 */

import { stringToBytes, byteToBits, numberToBits } from "./encoder.js";
import {
  BYTE_MODE_INDICATOR,
  BYTE_MODE_BITS,
  CHAR_COUNT_BITS,
  MAX_DATA_CODEWORDS,
  BITS_PER_CODEWORD,
  TERMINATOR_MAX_BITS,
  PAD_BYTES,
} from "./constants.js";

// Builds data codewords for QR Version 1 using byte mode
// Structure: mode indicator + char count + data + terminator + padding

const MAX_BITS = MAX_DATA_CODEWORDS * BITS_PER_CODEWORD;

export function buildDataCodewords(text, { mode = "byte" } = {}) {
  validateMode(mode);

  const dataBits = createDataBits(text);
  const paddedBits = addPadding(dataBits);
  return convertBitsToCodewords(paddedBits);
}

// Creates: mode(4) + count(8) + data(variable)
function createDataBits(text) {
  const byteData = stringToBytes(text);
  const bits = [];

  bits.push(...createModeIndicator());
  bits.push(...createCharacterCount(byteData.length));
  bits.push(...createDataSection(byteData));

  return bits;
}

// Adds terminator and pads to byte boundary
function addPadding(dataBits) {
  const bits = [...dataBits];

  addTerminatorBits(bits);
  addBytePadding(bits);

  return bits;
}

// Groups 8 bits into codewords, adds pad codewords if needed
function convertBitsToCodewords(bits) {
  const codewords = [];

  for (let i = 0; i < bits.length; i += BITS_PER_CODEWORD) {
    const codewordBits = bits.slice(i, i + BITS_PER_CODEWORD);
    const codeword = parseInt(codewordBits.join(""), 2);
    codewords.push(codeword);
  }

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

// Add 0000 terminator (up to 4 bits)
function addTerminatorBits(bits) {
  const terminatorLength = Math.min(
    TERMINATOR_MAX_BITS,
    MAX_BITS - bits.length
  );
  bits.push(...Array(terminatorLength).fill(0));
}

// Pad with zeros to reach byte boundary
function addBytePadding(bits) {
  while (bits.length % BITS_PER_CODEWORD !== 0) {
    bits.push(0);
  }
}

// Fill with alternating 11101100 00010001 pattern
function addPadCodewords(codewords) {
  let padIndex = 0;

  while (codewords.length < MAX_DATA_CODEWORDS) {
    codewords.push(PAD_BYTES[padIndex % PAD_BYTES.length]);
    padIndex++;
  }
}
