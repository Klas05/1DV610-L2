export function stringToBytes(text) {
  const encoder = new TextEncoder();
  return encoder.encode(text);
}

export function numberToBits(num, length) {
  return num.toString(2).padStart(length, "0").split("").map(Number);
}

export function byteToBits(byte) {
  return numberToBits(byte, 8);
}

export function codewordsToBits(codewords) {
  const bits = [];
  for (const codeword of codewords) {
    bits.push(...byteToBits(codeword));
  }
  return bits;
}
