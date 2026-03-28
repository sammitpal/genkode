/// <reference types="node" />
import test from "node:test";
import assert from "node:assert";
import { generateCode } from "../dist/index.js";

// Helper regex
const alphaRegex = /^[A-Za-z]+$/;
const numericRegex = /^[0-9]+$/;
const alphanumRegex = /^[A-Za-z0-9]+$/;

test("should generate string of correct length", () => {
  const result = generateCode({ length: 20 });
  assert.strictEqual(result.length, 20);
});

test("should generate alphabet-only string", () => {
  const result = generateCode({ length: 30, type: "alpha" });
  assert.ok(alphaRegex.test(result));
});

test("should generate numeric-only string", () => {
  const result = generateCode({ length: 30, type: "numeric" });
  assert.ok(numericRegex.test(result));
});

test("should generate alphanumeric string", () => {
  const result = generateCode({ length: 30, type: "alphanumeric" });
  assert.ok(alphanumRegex.test(result));
});

test("should generate secure string (alpha)", () => {
  const result = generateCode({ length: 25, type: "alpha", secure: true });
  assert.strictEqual(result.length, 25);
  assert.ok(alphaRegex.test(result));
});

test("should generate secure numeric string", () => {
  const result = generateCode({ length: 25, type: "numeric", secure: true });
  assert.strictEqual(result.length, 25);
  assert.ok(numericRegex.test(result));
});

test("should generate secure alphanumeric string", () => {
  const result = generateCode({ length: 25, type: "alphanumeric", secure: true });
  assert.strictEqual(result.length, 25);
  assert.ok(alphanumRegex.test(result));
});

test("should generate different values each time (non-deterministic)", () => {
  const a = generateCode({ length: 20 });
  const b = generateCode({ length: 20 });

  assert.notStrictEqual(a, b);
});

test("should handle small length", () => {
  const result = generateCode({ length: 1 });
  assert.strictEqual(result.length, 1);
});

test("should handle large length", () => {
  const result = generateCode({ length: 1000 });
  assert.strictEqual(result.length, 1000);
});