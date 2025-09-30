const BITS_PER_BYTE = 8;
const BINARY_BASE = 2;

export function stringToBytes(text) {
  const encoder = new TextEncoder();
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

export function numberToBits(num, length) {
  return num.toString(BINARY_BASE).padStart(length, "0").split("").map(Number);
}
