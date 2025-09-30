function stringToBytes(text) {
  const encoder = new TextEncoder();
  return encoder.encode(text);
}

function byteToBits(byte) {
  return byte.toString(2).padStart(8, "0").split("").map(Number);
}

export function encodeByte(text) {
  const data = stringToBytes(text);
  const bitArray = [];

  for (const byte of data) {
    bitArray.push(...byteToBits(byte));
  }

  return bitArray;
}
