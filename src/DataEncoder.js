import { DataStream } from "@klas05/qr-generator/src/DataStream.js";
import { ErrorCorrectionEncoder } from "@klas05/qr-generator/src/ErrorCorrectionEncoder.js";
import { ERROR_CORRECTION_CODEWORDS } from "@klas05/qr-generator/src/constants.js";

export class DataEncoder {
  #errorCorrectionEncoder;

  constructor() {
    this.#errorCorrectionEncoder = new ErrorCorrectionEncoder();
  }

  encode(text, options = {}) {
    const errorCorrectionLevel = options.errorCorrectionLevel || "L";

    const dataStream = new DataStream(text, options);
    const dataCodewords = dataStream.build();

    const ecCount = ERROR_CORRECTION_CODEWORDS[errorCorrectionLevel];
    const codewordsWithErrorCorrection = this.#errorCorrectionEncoder.encode(
      dataCodewords,
      ecCount
    );

    return codewordsWithErrorCorrection;
  }
}
