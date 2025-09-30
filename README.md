# 1DV610-L2

Repository for the second laboration in LNU's course 1dv610. This repository will contain a npm package for generating qr codes.

Due to time limitation and complexity this package cannot generate scannable qr codes at the moment. The missing component for this is error correction which would require advanced mathematics or use of an external library which was not allowed for this laboration.

## Installation

```bash
npm install @klas05/qr-generator
```

### Development Installation

If you want to contribute or run the development version:

```bash
git clone https://github.com/Klas05/1DV610-L2.git
cd 1DV610-L2
npm install
```

## Usage

### Basic Example

```javascript
import { generateQRCode, renderASCIIMatrix } from "@klas05/qr-generator";

// Generate a QR code matrix
const matrix = generateQRCode("Hello, World!", { mode: "byte" });

// Render as ASCII art
const asciiArt = renderASCIIMatrix(matrix);
console.log(asciiArt);
```

### Advanced Usage

```javascript
import {
  generateQRCode,
  validateInput,
  buildDataCodewords,
  codewordsToBits,
  renderASCIIMatrix,
} from "@klas05/qr-generator";

// Step-by-step QR code generation
const text = "Hello, World!";
const options = { mode: "byte" };

// 1. Validate input
validateInput(text, options);

// 2. Build data codewords
const codewords = buildDataCodewords(text, options);

// 3. Convert to bits
const bits = codewordsToBits(codewords);

// 4. Generate final matrix (you can also use generateQRCode for steps 1-4)
const matrix = generateQRCode(text, options);

// 5. Render as ASCII
const asciiArt = renderASCIIMatrix(matrix);
console.log(asciiArt);
```

### API Reference

#### `generateQRCode(text, options)`

Generates a QR code matrix for the given text.

**Parameters:**

- `text` (string): The text to encode in the QR code
- `options` (object, optional):
  - `mode` (string): Encoding mode. Currently only supports `"byte"` (default: `"byte"`)
  - `ecLevel` (string): Error correction level. Supports `"L"`, `"M"`, `"Q"`, `"H"` (default: `"L"`)

**Returns:** A 21x21 matrix representing the QR code (Version 1)

#### `validateInput(text, options)`

Validates the input text and options for QR code generation.

**Parameters:**

- `text` (string): The text to validate
- `options` (object, optional): The options to validate

**Throws:** Error if input is invalid or exceeds capacity

#### `buildDataCodewords(text, options)`

Builds the data codewords from the input text using the specified encoding mode.

**Parameters:**

- `text` (string): The text to encode
- `options` (object, optional): Encoding options

**Returns:** Array of data codewords (integers)

#### `codewordsToBits(codewords)`

Converts an array of codewords to a bit array.

**Parameters:**

- `codewords` (Array): Array of codeword integers

**Returns:** Array of bits (0s and 1s)

#### `renderASCIIMatrix(matrix)`

Renders a QR code matrix as ASCII art for console display.

**Parameters:**

- `matrix` (Array): The QR code matrix from `generateQRCode()`

**Returns:** A string containing the ASCII representation

### Supported Features

- **Version 1 QR codes** (21x21 modules)
- **Byte mode encoding** for text input
- **Error correction levels** L, M, Q, H (validation only)
- **ASCII rendering** for visual output
- **Input validation** with capacity checking
- **Modular API** for step-by-step processing

### Limitations

- Only supports Version 1 QR codes
- Byte mode encoding only
- **No error correction implementation** - generated codes are not scannable
- No support for numeric or alphanumeric modes
- No automatic version selection

## Running the Example

```bash
npm run start
```

This will run the example in [src/index.js](src/index.js) and display a QR code for "Hello, World!".

## Project Structure

```
src/
├── index.js          # Main entry point and example
├── validator.js      # Input validation
├── datastream.js     # Data codeword generation
├── encoder.js        # Bit encoding utilities
├── matrix.js         # QR code matrix construction
├── dataPlacer.js     # Data placement in matrix
├── formatinfo.js     # Format information placement
├── masking.js        # Mask pattern application
└── renderer.js       # ASCII rendering
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

This project was created as a university assignment for LNU's course 1DV610. While the project is primarily educational, contributions that improve the code quality or add missing features are welcome.

### Development Guidelines

1. **Fork the repository** and create a feature branch
2. **Follow the existing code style** and modular structure
3. **Add tests** for new functionality (when test framework is added)
4. **Update documentation** for any API changes
5. **Submit a pull request** with a clear description

### Potential Improvements

- Implement Reed-Solomon error correction
- Add support for higher QR code versions
- Implement numeric and alphanumeric encoding modes
- Add automatic version selection based on input length
- Create a proper test suite
- Add image output formats (PNG, SVG)

## Acknowledgments

- Created for LNU course 1DV610 (Software Quality)
- Developed as an educational exercise in clean code principles
