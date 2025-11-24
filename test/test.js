import {
  generateQRCode,
  renderASCIIMatrix,
  validateInput,
  buildDataCodewords,
  codewordsToBits,
} from "../src/index.js";
import { ErrorCorrectionEncoder } from "../src/ErrorCorrectionEncoder.js";

console.log("=== QR Code Generator Manual Tests ===\n");

console.log("1. Testing basic QR code generation:");
try {
  const matrix = generateQRCode("Hello");
  console.log("QR matrix generated successfully");
  console.log("Matrix size:", matrix.length, "x", matrix[0].length);
  console.log("Sample matrix values:", matrix[0].slice(5, 10));
} catch (error) {
  console.log("Error:", error.message);
}
console.log("");

console.log("2. Testing ASCII rendering:");
try {
  const matrix = generateQRCode("Hi");
  const asciiArt = renderASCIIMatrix(matrix);
  console.log("ASCII rendering successful");
  console.log("ASCII QR Code:");
  console.log(asciiArt);
} catch (error) {
  console.log("Error:", error.message);
}
console.log("");

console.log("3. Testing input validation - valid inputs:");
const validInputs = [
  { text: "Hello", options: { mode: "byte" } },
  { text: "123456", options: { mode: "numeric" } },
  { text: "HELLO123", options: { mode: "alnum" } },
];

validInputs.forEach((test, index) => {
  try {
    validateInput(test.text, test.options);
    console.log(
      `Valid input ${index + 1}: "${test.text}" (${test.options.mode} mode)`
    );
  } catch (error) {
    console.log(
      `Unexpected error for valid input ${index + 1}:`,
      error.message
    );
  }
});
console.log("");

console.log("4. Testing input validation - invalid inputs:");
const invalidInputs = [
  { text: "", options: { mode: "byte" }, reason: "empty string" },
  {
    text: "abc123",
    options: { mode: "numeric" },
    reason: "letters in numeric mode",
  },
  {
    text: "hello world",
    options: { mode: "alnum" },
    reason: "lowercase in alnum mode",
  },
  {
    text: "A".repeat(50),
    options: { mode: "byte" },
    reason: "too long for V1",
  },
];

invalidInputs.forEach((test, index) => {
  try {
    validateInput(test.text, test.options);
    console.log(`Should have failed for ${test.reason}`);
  } catch (error) {
    console.log(`Correctly rejected ${test.reason}: ${error.message}`);
  }
});
console.log("");

console.log("5. Testing data encoding:");
try {
  const codewords = buildDataCodewords("Test", { mode: "byte" });
  console.log("Data encoding successful");
  console.log("Generated codewords:", codewords);
  console.log("Number of codewords:", codewords.length);
} catch (error) {
  console.log("Error:", error.message);
}
console.log("");

console.log("6. Testing codewords to bits conversion:");
try {
  const codewords = [72, 101, 108, 108, 111]; // "Hello" in ASCII
  const bits = codewordsToBits(codewords);
  console.log("Bits conversion successful");
  console.log("Input codewords:", codewords);
  console.log("Output bits length:", bits.length);
  console.log("First 16 bits:", bits.slice(0, 16).join(""));
  console.log(
    "Expected 8 bits per codeword:",
    bits.length / codewords.length,
    "bits per codeword"
  );
} catch (error) {
  console.log("Error:", error.message);
}
console.log("");

console.log("7. Testing different mask patterns:");
const testText = "QR";
for (let mask = 0; mask <= 3; mask++) {
  try {
    const matrix = generateQRCode(testText, { maskPattern: mask });
    console.log(`Mask pattern ${mask} generated successfully`);
  } catch (error) {
    console.log(`Mask pattern ${mask} failed:`, error.message);
  }
}
console.log("");

console.log("8. End-to-end test with ASCII output:");
try {
  const testStrings = ["Hi", "123", "QR"];

  testStrings.forEach((text) => {
    console.log(`\nGenerating QR code for: "${text}"`);
    const matrix = generateQRCode(text, { mode: "byte" });
    const ascii = renderASCIIMatrix(matrix);
    console.log("Matrix dimensions:", matrix.length, "x", matrix[0].length);
    console.log("ASCII representation:");
    console.log(
      ascii.split("\n").slice(0, 10).join("\n") +
        "\n...(showing first 10 lines)"
    );
  });

  console.log("End-to-end tests completed successfully");
} catch (error) {
  console.log("End-to-end test failed:", error.message);
}

console.log("\n=== Reed-Solomon Error Correction Tests ===\n");

console.log("9. Testing basic error correction encoding:");
try {
  const encoder = new ErrorCorrectionEncoder();
  const dataCodewords = [72, 101, 108, 108, 111]; // "Hello" in ASCII
  const ecCount = 7; // Error correction codewords for Level L
  const result = encoder.encode(dataCodewords, ecCount);

  console.log("✓ Error correction encoding successful");
  console.log(`  Input data length: ${dataCodewords.length}`);
  console.log(`  Error correction count: ${ecCount}`);
  console.log(`  Output length: ${result.length} (expected: ${dataCodewords.length + ecCount})`);
  console.log(`  Data portion preserved: ${JSON.stringify(result.slice(0, dataCodewords.length)) === JSON.stringify(dataCodewords)}`);
  console.log(`  Error correction codewords: [${result.slice(dataCodewords.length).join(", ")}]`);
} catch (error) {
  console.log("✗ Error:", error.message);
}
console.log("");

console.log("10. Testing error correction with different EC counts:");
const ecLevels = [
  { level: "L", count: 7 },
  { level: "M", count: 10 },
  { level: "Q", count: 13 },
  { level: "H", count: 17 }
];

ecLevels.forEach(({ level, count }) => {
  try {
    const encoder = new ErrorCorrectionEncoder();
    const dataCodewords = [84, 101, 115, 116]; // "Test"
    const result = encoder.encode(dataCodewords, count);

    console.log(`✓ Level ${level} (${count} EC codewords): output length ${result.length}`);
  } catch (error) {
    console.log(`✗ Level ${level} failed:`, error.message);
  }
});
console.log("");

console.log("11. Testing validation - invalid inputs:");
const invalidTests = [
  {
    name: "non-array data",
    data: "not an array",
    ecCount: 7,
    expectedError: "Data codewords must be an array"
  },
  {
    name: "empty array",
    data: [],
    ecCount: 7,
    expectedError: "Data codewords array cannot be empty"
  },
  {
    name: "zero error correction count",
    data: [72, 101],
    ecCount: 0,
    expectedError: "Error correction count must be a positive integer"
  },
  {
    name: "negative error correction count",
    data: [72, 101],
    ecCount: -5,
    expectedError: "Error correction count must be a positive integer"
  },
  {
    name: "non-integer error correction count",
    data: [72, 101],
    ecCount: 7.5,
    expectedError: "Error correction count must be a positive integer"
  },
  {
    name: "codeword value too large",
    data: [72, 256, 101],
    ecCount: 7,
    expectedError: "Invalid codeword at index 1: 256"
  },
  {
    name: "negative codeword value",
    data: [72, -1, 101],
    ecCount: 7,
    expectedError: "Invalid codeword at index 1: -1"
  },
  {
    name: "non-integer codeword",
    data: [72, 101.5, 101],
    ecCount: 7,
    expectedError: "Invalid codeword at index 1: 101.5"
  }
];

invalidTests.forEach((test) => {
  try {
    const encoder = new ErrorCorrectionEncoder();
    encoder.encode(test.data, test.ecCount);
    console.log(`✗ ${test.name}: Should have thrown an error`);
  } catch (error) {
    if (error.message.includes(test.expectedError)) {
      console.log(`✓ ${test.name}: Correctly rejected`);
    } else {
      console.log(`✗ ${test.name}: Wrong error message`);
      console.log(`  Expected: ${test.expectedError}`);
      console.log(`  Got: ${error.message}`);
    }
  }
});
console.log("");

console.log("12. Testing EC codewords are actually generated (not zeros):");
try {
  const encoder = new ErrorCorrectionEncoder();
  const dataCodewords = [72, 101, 108, 108, 111]; // "Hello"
  const result = encoder.encode(dataCodewords, 7);
  const ecCodewords = result.slice(dataCodewords.length);

  const hasNonZero = ecCodewords.some(codeword => codeword !== 0);
  const allValid = ecCodewords.every(codeword =>
    Number.isInteger(codeword) && codeword >= 0 && codeword <= 255
  );

  console.log(`✓ EC codewords generated: ${hasNonZero ? "Yes" : "No (all zeros!)"}`);
  console.log(`✓ All EC codewords valid bytes (0-255): ${allValid}`);
  console.log(`  EC codewords: [${ecCodewords.join(", ")}]`);
} catch (error) {
  console.log("✗ Error:", error.message);
}
console.log("");

console.log("13. Testing integration with buildDataCodewords:");
try {
  const text = "QR";
  const codewords = buildDataCodewords(text, {
    mode: "byte",
    errorCorrectionLevel: "L"
  });

  console.log("✓ Integration test successful");
  console.log(`  Input text: "${text}"`);
  console.log(`  Total codewords (data + EC): ${codewords.length}`);
  console.log(`  First few codewords: [${codewords.slice(0, 5).join(", ")}]`);
  console.log(`  Last few codewords (EC): [${codewords.slice(-7).join(", ")}]`);
} catch (error) {
  console.log("✗ Error:", error.message);
}
console.log("");

console.log("14. Testing deterministic encoding (same input = same output):");
try {
  const encoder = new ErrorCorrectionEncoder();
  const dataCodewords = [84, 101, 115, 116]; // "Test"
  const result1 = encoder.encode(dataCodewords, 7);
  const result2 = encoder.encode(dataCodewords, 7);

  const identical = JSON.stringify(result1) === JSON.stringify(result2);
  console.log(`✓ Encoding is deterministic: ${identical}`);
  console.log(`  First encoding: [${result1.join(", ")}]`);
  console.log(`  Second encoding: [${result2.join(", ")}]`);
} catch (error) {
  console.log("✗ Error:", error.message);
}
console.log("");

console.log("15. Testing with maximum valid codeword values:");
try {
  const encoder = new ErrorCorrectionEncoder();
  const dataCodewords = [0, 127, 255]; // Min, mid, max values
  const result = encoder.encode(dataCodewords, 5);

  console.log("✓ Edge value encoding successful");
  console.log(`  Input: [${dataCodewords.join(", ")}]`);
  console.log(`  Output length: ${result.length}`);
  console.log(`  Data preserved: ${JSON.stringify(result.slice(0, 3)) === JSON.stringify(dataCodewords)}`);
} catch (error) {
  console.log("✗ Error:", error.message);
}
console.log("");

console.log("\n=== Manual Tests Complete ===");
