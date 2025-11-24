import { BITS_PER_BYTE, BINARY_BASE } from "./constants.js";

export function stringToBytes(text) {
  const encoder = new TextEncoder();
  return encoder.encode(text);
}

export function codewordsToBits(codewords) {
  const allBits = [];
  for (const codeword of codewords) {
    allBits.push(...byteToBits(codeword));
  }
  return allBits;
}

export function byteToBits(byte) {
  return numberToBits(byte, BITS_PER_BYTE);
}

export function numberToBits(number, bitLength) {
  return number
    .toString(BINARY_BASE)
    .padStart(bitLength, "0")
    .split("")
    .map(Number);
}
