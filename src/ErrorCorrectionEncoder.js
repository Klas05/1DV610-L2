import rs from "reedsolomon";

export class ErrorCorrectionEncoder {
  static #MIN_CODEWORD_VALUE = 0;
  static #MAX_CODEWORD_VALUE = 255;
  static #MIN_ERROR_CORRECTION_COUNT = 1;

  #encoder;

  constructor() {
    this.#encoder = new rs.ReedSolomonEncoder(rs.GenericGF.QR_CODE_FIELD_256());
  }

  /**
   * Generates error correction codewords for the given data.
   *
   * @param {number[]} dataCodewords - Array of data codewords (integers 0-255).
   * @param {number} errorCorrectionCount - Number of error correction codewords to generate.
   * @returns {number[]} Array containing data codewords followed by error correction codewords.
   */
  encode(dataCodewords, errorCorrectionCount) {
    this.#validateInput(dataCodewords, errorCorrectionCount);

    const message = this.#createMessageArray(
      dataCodewords,
      errorCorrectionCount
    );
    this.#encoder.encode(message, errorCorrectionCount);

    return Array.from(message);
  }

  /**
   * Creates and populates the message array for Reed-Solomon encoding.
   *
   * @param {number[]} dataCodewords - Data codewords to copy.
   * @param {number} errorCorrectionCount - Number of error correction codewords.
   * @returns {Int32Array} Niche typed message array required by Reed-Solomon encoder with data codewords and space for EC codewords.
   */
  #createMessageArray(dataCodewords, errorCorrectionCount) {
    const totalLength = dataCodewords.length + errorCorrectionCount;
    const message = new Int32Array(totalLength);
    message.set(dataCodewords);
    return message;
  }

  /**
   * Validates input parameters for encoding.
   *
   * @param {number[]} dataCodewords - Array to validate.
   * @param {number} errorCorrectionCount - Count to validate.
   * @throws {TypeError} If dataCodewords is not an array.
   * @throws {Error} If validation fails.
   */
  #validateInput(dataCodewords, errorCorrectionCount) {
    this.#validateDataCodewordsType(dataCodewords);
    this.#validateDataCodewordsNotEmpty(dataCodewords);
    this.#validateErrorCorrectionCount(errorCorrectionCount);
    this.#validateCodewordValues(dataCodewords);
  }

  #validateDataCodewordsType(dataCodewords) {
    if (!Array.isArray(dataCodewords)) {
      throw new TypeError("Data codewords must be an array");
    }
  }

  #validateDataCodewordsNotEmpty(dataCodewords) {
    if (dataCodewords.length === 0) {
      throw new Error("Data codewords array cannot be empty");
    }
  }

  #validateErrorCorrectionCount(errorCorrectionCount) {
    if (
      !Number.isInteger(errorCorrectionCount) ||
      errorCorrectionCount < ErrorCorrectionEncoder.#MIN_ERROR_CORRECTION_COUNT
    ) {
      throw new Error("Error correction count must be a positive integer");
    }
  }

  #validateCodewordValues(dataCodewords) {
    dataCodewords.forEach((codeword, index) => {
      this.#validateSingleCodeword(codeword, index);
    });
  }

  #validateSingleCodeword(codeword, index) {
    if (!this.#isValidByteValue(codeword)) {
      throw new Error(
        `Invalid codeword at index ${index}: ${codeword}. Must be an integer between ${
          ErrorCorrectionEncoder.#MIN_CODEWORD_VALUE
        }-${ErrorCorrectionEncoder.#MAX_CODEWORD_VALUE}`
      );
    }
  }

  #isValidByteValue(value) {
    return (
      Number.isInteger(value) &&
      value >= ErrorCorrectionEncoder.#MIN_CODEWORD_VALUE &&
      value <= ErrorCorrectionEncoder.#MAX_CODEWORD_VALUE
    );
  }
}
