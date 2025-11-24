import { InputValidator } from "@klas05/qr-generator/src/InputValidator.js";
import { DataEncoder } from "@klas05/qr-generator/src/DataEncoder.js";
import { QRMatrix } from "@klas05/qr-generator/src/QRMatrix.js";
import { QRRenderer } from "@klas05/qr-generator/src/QRRenderer.js";

export class QRCodeGenerator {
  constructor(version = 1, errorCorrectionLevel = "L") {
    this.version = version;
    this.errorCorrectionLevel = errorCorrectionLevel;
    this.validator = new InputValidator(version, errorCorrectionLevel);
    this.encoder = new DataEncoder();
    this.renderer = new QRRenderer();
  }

  generate(text, options = {}) {
    const mode = options.mode || "byte";
    const maskPattern = options.maskPattern || 0;

    this.validator.validate(text, { mode, errorCorrectionLevel: this.errorCorrectionLevel });

    const encodedData = this.encoder.encode(text, {
      mode,
      errorCorrectionLevel: this.errorCorrectionLevel
    });
    const matrix = new QRMatrix(this.version);

    return matrix.build(encodedData, maskPattern);
  }

  generateASCII(text, options = {}) {
    const matrix = this.generate(text, options);
    return this.renderer.renderASCII(matrix);
  }
}
