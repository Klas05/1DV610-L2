/**
 * Builds the 19 data codewords for Version 1 QR
 * using byte mode and error correction level L.
 */

import { stringToBytes, byteToBits, numberToBits } from "./conversionUtils.js";
import {
  BYTE_MODE_INDICATOR,
  BYTE_MODE_BITS,
  CHAR_COUNT_BITS,
  MAX_DATA_CODEWORDS,
  BITS_PER_CODEWORD,
  TERMINATOR_MAX_BITS,
  PAD_BYTES,
} from "./constants.js";

export class DataStream {
  constructor(text, options = {}) {
    this.text = text;
    this.mode = options.mode || "byte";
    this.maxBits = MAX_DATA_CODEWORDS * BITS_PER_CODEWORD;
  }

  build() {
    this.#validateMode();

    const dataBits = this.#createDataBits();
    const paddedBits = this.#addPadding(dataBits);
    return this.#convertBitsToCodewords(paddedBits);
  }

  #validateMode() {
    if (this.mode !== "byte") {
      throw new Error("Only byte mode is supported in this implementation.");
    }
  }

  #createDataBits() {
    const byteData = stringToBytes(this.text);
    const bits = [];

    bits.push(...this.#createModeIndicator());
    bits.push(...this.#createCharacterCount(byteData.length));
    bits.push(...this.#createDataSection(byteData));

    return bits;
  }

  #addPadding(dataBits) {
    const bits = [...dataBits];

    this.#addTerminatorBits(bits);
    this.#addBytePadding(bits);

    return bits;
  }

  #convertBitsToCodewords(bits) {
    const codewords = [];

    for (let i = 0; i < bits.length; i += BITS_PER_CODEWORD) {
      const codewordBits = bits.slice(i, i + BITS_PER_CODEWORD);
      const codeword = parseInt(codewordBits.join(""), 2);
      codewords.push(codeword);
    }

    this.#addPadCodewords(codewords);
    return codewords;
  }

  #createModeIndicator() {
    return numberToBits(BYTE_MODE_INDICATOR, BYTE_MODE_BITS);
  }

  #createCharacterCount(length) {
    return numberToBits(length, CHAR_COUNT_BITS);
  }

  #createDataSection(byteData) {
    const bits = [];
    for (const byte of byteData) {
      bits.push(...byteToBits(byte));
    }
    return bits;
  }

  #addTerminatorBits(bits) {
    const terminatorLength = Math.min(
      TERMINATOR_MAX_BITS,
      this.maxBits - bits.length
    );
    bits.push(...Array(terminatorLength).fill(0));
  }

  #addBytePadding(bits) {
    while (bits.length % BITS_PER_CODEWORD !== 0) {
      bits.push(0);
    }
  }

  #addPadCodewords(codewords) {
    let padIndex = 0;
    while (codewords.length < MAX_DATA_CODEWORDS) {
      codewords.push(PAD_BYTES[padIndex % PAD_BYTES.length]);
      padIndex++;
    }
  }
}
