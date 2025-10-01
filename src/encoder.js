import { BITS_PER_BYTE, BINARY_BASE } from "./constants.js";

// Basic encoding utilities for converting text and numbers to bits

export function stringToBytes(text) {
  const encoder = new TextEncoder(); // UTF-8 encoding
  return encoder.encode(text);
}

export function codewordsToBits(codewords) {
  const bits = [];
  for (const codeword of codewords) {
    bits.push(...byteToBits(codeword));
  }
  return bits;
}

export function byteToBits(byte) {
  return numberToBits(byte, BITS_PER_BYTE);
}

// Convert number to binary array with specified length
export function numberToBits(num, length) {
  return num.toString(BINARY_BASE).padStart(length, "0").split("").map(Number);
}
