import {
  generateQRCode,
  renderASCIIMatrix,
  validateInput,
  buildDataCodewords,
  codewordsToBits,
} from "../src/index.js";

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

console.log("\n=== Manual Tests Complete ===");
