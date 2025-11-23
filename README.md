# 1DV610-L2

Repository for the second laboration in LNU's course 1dv610. This repository will contain a npm package for generating qr codes.

~~Due to time limitation and complexity this package cannot generate scannable qr codes at the moment. The missing component for this is error correction which would require advanced mathematics or use of an external library which was not allowed for this laboration.~~

**Update:** Error correction has now been implemented using the external `reedsolomon` library, making the generated QR codes scannable.

## Installation

```bash
npm install @klas05/qr-generator
```
Not yet published as a package since it's functionality is not yet reached the desired level.

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
import { generateQRCode, renderASCIIMatrix, renderSVGMatrix } from "@klas05/qr-generator";

// Generate a QR code matrix
const matrix = generateQRCode("Hello, World!", { mode: "byte" });

// Render as ASCII art
const asciiArt = renderASCIIMatrix(matrix);
console.log(asciiArt);

// Render as SVG
const svg = renderSVGMatrix(matrix);
// Use in web applications or save to file
```

### Advanced Usage

```javascript
import {
  generateQRCode,
  validateInput,
  buildDataCodewords,
  codewordsToBits,
  renderASCIIMatrix,
  renderSVGMatrix,
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

// 5. Render as ASCII or SVG
const asciiArt = renderASCIIMatrix(matrix);
console.log(asciiArt);

const svg = renderSVGMatrix(matrix, 10); // 10px module size
document.getElementById("qr-container").innerHTML = svg;
```

### API Reference

---

#### `generateQRCode(text, options)`

Generates a QR code matrix for the given text.

**Parameters:**

- `text` (string): The text to encode in the QR code
- `options` (object, optional):
  - `mode` (string): Encoding mode. Currently only supports `"byte"` (default: `"byte"`)
  - `maskPattern` (number): Mask pattern (0-7) (default: `0`)

**Returns:** A 21x21 matrix representing the QR code (Version 1)

**Example:**
```javascript
const matrix = generateQRCode("Hello, World!", { mode: "byte" });
// Returns a 21x21 matrix array
```

#### `renderASCIIMatrix(matrix)`

Renders a QR code matrix as ASCII art for console display.

**Parameters:**

- `matrix` (Array): The QR code matrix from `generateQRCode()`

**Returns:** A string containing the ASCII representation

**Example:**
```javascript
const matrix = generateQRCode("Test", { mode: "byte" });
const asciiArt = renderASCIIMatrix(matrix);
console.log(asciiArt);
// Outputs ASCII art representation of the QR code
```

#### `renderSVGMatrix(matrix, moduleSize)`

Renders a QR code matrix as an SVG image for web applications.

**Parameters:**

- `matrix` (Array): The QR code matrix from `generateQRCode()`
- `moduleSize` (number, optional): Size of each QR module in pixels (default: 10)

**Returns:** A string containing the SVG markup

**Example:**
```javascript
const matrix = generateQRCode("Test", { mode: "byte" });

// Default module size (10px)
const svg = renderSVGMatrix(matrix);

// Custom module size for larger QR code
const largeSVG = renderSVGMatrix(matrix, 20);

// Use in web page
document.getElementById("qr-container").innerHTML = svg;

// Or save to file
fs.writeFileSync("qrcode.svg", svg);
```

#### `validateInput(text, options)`

Validates the input text and options for QR code generation.

**Parameters:**

- `text` (string): The text to validate
- `options` (object, optional): The options to validate

**Throws:** Error if input is invalid or exceeds capacity

**Example:**
```javascript
try {
  validateInput("Hello, World!", { mode: "byte" });
  console.log("Input is valid!");
} catch (error) {
  console.error("Invalid input:", error.message);
}
```

#### `buildDataCodewords(text, options)`

Builds the data codewords from the input text using the specified encoding mode.

**Parameters:**

- `text` (string): The text to encode
- `options` (object, optional): Encoding options

**Returns:** Array of data codewords (integers)

**Example:**
```javascript
const codewords = buildDataCodewords("Hello", { mode: "byte" });
console.log(codewords);
// Output: Array of integers representing encoded data
```

#### `codewordsToBits(codewords)`

Converts an array of codewords to a bit array.

**Parameters:**

- `codewords` (Array): Array of codeword integers

**Returns:** Array of bits (0s and 1s)

**Example:**
```javascript
const codewords = [72, 101, 108, 108, 111]; // Example codewords
const bits = codewordsToBits(codewords);
console.log(bits);
// Output: Array of 0s and 1s representing the bit sequence
```

### Supported Features

- **Version 1 QR codes** (21x21 modules)
- **Byte mode encoding** for text input
- **Error correction** using reedsolomon (external library)
- **Multiple mask patterns** (0-7)
- **ASCII rendering** for console output
- **SVG rendering** for web applications with customizable module size
- **Input validation** with capacity checking
- **Functional API** with 6 public functions
- **Modular design** for step-by-step processing

### Limitations

- Only supports Version 1 QR codes
- Byte mode encoding only
- ~~**No error correction implementation** - generated codes are not scannable~~
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
├── index.js                    # Main entry point and example
├── QRCodeGenerator.js          # Main QR code generator class
├── InputValidator.js           # Input validation class
├── DataEncoder.js              # Data encoding orchestrator
├── DataStream.js               # Data stream construction
├── ErrorCorrectionEncoder.js   # Error correction encoder
├── QRMatrix.js                 # QR matrix construction
├── DataPlacer.js               # Data placement in matrix
├── FormatInfoPlacer.js         # Format information placement
├── MaskApplier.js              # Mask pattern application
├── QRRenderer.js               # ASCII and SVG rendering
├── conversionUtils.js          # Bit/byte conversion utilities
└── constants.js                # Shared constants
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

- ~~Implement Reed-Solomon error correction~~
- ~~Add image output formats (PNG, SVG)~~
- Add support for higher QR code versions
- Implement numeric and alphanumeric encoding modes
- Add automatic version selection based on input length
- Create a proper test suite
- Add PNG output format

## Acknowledgments

- Created for LNU course 1DV610 (Software Quality)
- Developed as an educational exercise in clean code principles
