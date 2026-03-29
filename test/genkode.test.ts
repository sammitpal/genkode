/// <reference types="node" />
import test from "node:test";
import assert from "node:assert";
import { generateCode, KodeError } from "../dist/index.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const alphaRegex    = /^[A-Za-z]+$/;
const numericRegex  = /^[0-9]+$/;
const alphanumRegex = /^[A-Za-z0-9]+$/;
const urlSafeRegex  = /^[A-Za-z0-9\-_]+$/;

const shortIdCharset = "23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ";
const shortIdRegex   = new RegExp(`^[${shortIdCharset}]+$`);

// ─── Existing core tests ──────────────────────────────────────────────────────

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

// ─── Feature 1: URL-safe mode ─────────────────────────────────────────────────

test("[urlSafe] alpha charset produces URL-safe characters", () => {
  const result = generateCode({ length: 100, type: "alpha", urlSafe: true });
  assert.ok(urlSafeRegex.test(result), `Not URL-safe: ${result}`);
  assert.strictEqual(result.length, 100);
});

test("[urlSafe] numeric charset produces URL-safe characters", () => {
  const result = generateCode({ length: 100, type: "numeric", urlSafe: true });
  assert.ok(urlSafeRegex.test(result), `Not URL-safe: ${result}`);
});

test("[urlSafe] alphanumeric charset produces URL-safe characters", () => {
  const result = generateCode({ length: 100, type: "alphanumeric", urlSafe: true });
  assert.ok(urlSafeRegex.test(result), `Not URL-safe: ${result}`);
});

test("[urlSafe] secure + urlSafe combination works", () => {
  const result = generateCode({ length: 30, type: "alphanumeric", secure: true, urlSafe: true });
  assert.ok(urlSafeRegex.test(result));
  assert.strictEqual(result.length, 30);
});

test("[urlSafe] false (default) behaves identically to omitting the flag", () => {
  const withFlag    = generateCode({ length: 20, type: "alphanumeric", urlSafe: false });
  const withoutFlag = generateCode({ length: 20, type: "alphanumeric" });
  assert.ok(alphanumRegex.test(withFlag));
  assert.ok(alphanumRegex.test(withoutFlag));
});

// ─── Feature 2: Prefix & suffix ───────────────────────────────────────────────

test("[prefix] attaches static prefix to generated string", () => {
  const result = generateCode({ length: 10, prefix: "USER_" });
  assert.ok(result.startsWith("USER_"), `Expected prefix: ${result}`);
});

test("[suffix] attaches static suffix to generated string", () => {
  const result = generateCode({ length: 10, suffix: "_END" });
  assert.ok(result.endsWith("_END"), `Expected suffix: ${result}`);
});

test("[prefix+suffix] both attached simultaneously", () => {
  const result = generateCode({ length: 8, prefix: "START-", suffix: "-END" });
  assert.ok(result.startsWith("START-"), `Missing prefix: ${result}`);
  assert.ok(result.endsWith("-END"),     `Missing suffix: ${result}`);
});

test("[prefix+suffix] core segment has the requested length", () => {
  const result = generateCode({ length: 8, prefix: "PRE_", suffix: "_SUF" });
  // Total = prefix(4) + core(8) + suffix(4) = 16
  assert.strictEqual(result.length, 16);
  const core = result.slice(4, -4);
  assert.strictEqual(core.length, 8);
  assert.ok(alphaRegex.test(core));
});

test("[prefix] empty prefix behaves like no prefix", () => {
  const result = generateCode({ length: 10, prefix: "" });
  assert.strictEqual(result.length, 10);
});

// ─── Feature 3: Batch generation ─────────────────────────────────────────────

test("[batch] returns an array when count is specified", () => {
  const results = generateCode({ length: 10, count: 5 });
  assert.ok(Array.isArray(results));
  assert.strictEqual(results.length, 5);
});

test("[batch] each item has the correct length", () => {
  const results = generateCode({ length: 12, count: 20 });
  for (const r of results) {
    assert.strictEqual(r.length, 12, `Wrong length: ${r}`);
  }
});

test("[batch] each item matches the requested type", () => {
  const results = generateCode({ length: 15, type: "numeric", count: 10 });
  for (const r of results) {
    assert.ok(numericRegex.test(r), `Not numeric: ${r}`);
  }
});

test("[batch] count=1 returns a single-element array", () => {
  const results = generateCode({ length: 8, count: 1 });
  assert.ok(Array.isArray(results));
  assert.strictEqual(results.length, 1);
});

test("[batch] large batch returns correct count", () => {
  const results = generateCode({ length: 10, count: 500 });
  assert.strictEqual(results.length, 500);
});

test("[batch] without count returns a plain string (not array)", () => {
  const result = generateCode({ length: 10 });
  assert.strictEqual(typeof result, "string");
});

// ─── Feature 5: Buffered generation (internal — validated via output shape) ───

test("[buffered] high-volume generation maintains correct length", () => {
  for (const len of [1, 7, 16, 64, 128, 255, 256, 257, 1000]) {
    const result = generateCode({ length: len });
    assert.strictEqual(result.length, len, `Failed at length ${len}`);
  }
});

test("[buffered] secure mode high-volume maintains correct length", () => {
  for (const len of [1, 7, 16, 64, 128, 255, 256, 257, 1000]) {
    const result = generateCode({ length: len, secure: true });
    assert.strictEqual(result.length, len, `Secure failed at length ${len}`);
  }
});

// ─── Feature 6: Length validation & error handling ────────────────────────────

test("[validation] throws KodeError for length = 0", () => {
  assert.throws(
    () => generateCode({ length: 0 }),
    (err) => err instanceof KodeError && /length/.test(err.message)
  );
});

test("[validation] throws KodeError for negative length", () => {
  assert.throws(
    () => generateCode({ length: -5 }),
    (err) => err instanceof KodeError
  );
});

test("[validation] throws KodeError for non-integer length", () => {
  assert.throws(
    () => generateCode({ length: 4.5 }),
    (err) => err instanceof KodeError
  );
});

test("[validation] throws KodeError for length exceeding safe maximum", () => {
  assert.throws(
    () => generateCode({ length: 100_001 }),
    (err) => err instanceof KodeError && /maximum/.test(err.message)
  );
});

test("[validation] throws KodeError for count = 0", () => {
  assert.throws(
    () => generateCode({ length: 10, count: 0 }),
    (err) => err instanceof KodeError
  );
});

test("[validation] throws KodeError for negative count", () => {
  assert.throws(
    () => generateCode({ length: 10, count: -1 }),
    (err) => err instanceof KodeError
  );
});

test("[validation] length = 1 is valid (boundary)", () => {
  assert.doesNotThrow(() => generateCode({ length: 1 }));
});

test("[validation] length = 100000 is valid (boundary)", () => {
  // Buffer is chunked to stay within Node's 65536-byte getRandomValues cap
  assert.doesNotThrow(() => {
    const result = generateCode({ length: 100_000 });
    assert.strictEqual(result.length, 100_000);
  });
});

test("[validation] KodeError is an instance of Error", () => {
  try {
    generateCode({ length: 0 });
    assert.fail("Should have thrown");
  } catch (err) {
    assert.ok(err instanceof Error);
    assert.strictEqual((err as Error).name, "KodeError");
  }
});

// ─── Feature 7: Short ID mode ─────────────────────────────────────────────────

test("[shortId] generates string of correct length", () => {
  const result = generateCode({ length: 12, shortId: true });
  assert.strictEqual(result.length, 12);
});

test("[shortId] only uses short-ID charset characters", () => {
  const result = generateCode({ length: 200, shortId: true });
  assert.ok(shortIdRegex.test(result), `Unexpected chars: ${result}`);
});

test("[shortId] excludes ambiguous characters (0, O, 1, l, I)", () => {
  const result = generateCode({ length: 500, shortId: true });
  assert.ok(!/[0O1lI]/.test(result), `Contains ambiguous chars: ${result}`);
});

test("[shortId] works with secure mode", () => {
  const result = generateCode({ length: 20, shortId: true, secure: true });
  assert.ok(shortIdRegex.test(result));
  assert.strictEqual(result.length, 20);
});

test("[shortId] overrides type option", () => {
  const result = generateCode({ length: 50, shortId: true, type: "numeric" });
  assert.ok(shortIdRegex.test(result), `shortId should override type: ${result}`);
});

// ─── Feature 8: Unique batch guarantee ───────────────────────────────────────

test("[unique] batch contains no duplicates", () => {
  const results = generateCode({ length: 10, count: 100, unique: true });
  const set = new Set(results);
  assert.strictEqual(set.size, results.length);
});

test("[unique] works with prefix and suffix (uniqueness on full string)", () => {
  const results = generateCode({ length: 8, count: 50, unique: true, prefix: "ID_" });
  const set = new Set(results);
  assert.strictEqual(set.size, 50);
});

test("[unique] throws KodeError when count exceeds possible combinations", () => {
  // charset = numeric (10 chars), length = 1 → only 10 possible codes
  assert.throws(
    () => generateCode({ length: 1, type: "numeric", count: 11, unique: true }),
    (err) => err instanceof KodeError && /unique|combination/i.test(err.message)
  );
});

test("[unique] count exactly at max combinations does not throw", () => {
  // numeric, length 1 → 10 possible codes
  assert.doesNotThrow(() =>
    generateCode({ length: 1, type: "numeric", count: 10, unique: true })
  );
});

test("[unique] false (default) allows duplicates in large batches from tiny charset", () => {
  const results = generateCode({ length: 1, type: "numeric", count: 20 });
  assert.strictEqual(results.length, 20); // duplicates are fine
});

// ─── Cross-feature combinations ───────────────────────────────────────────────

test("[combo] urlSafe + prefix + batch", () => {
  const results = generateCode({
    length: 10, type: "alphanumeric", urlSafe: true, prefix: "tok-", count: 20,
  });
  for (const r of results) {
    assert.ok(r.startsWith("tok-"), `Missing prefix: ${r}`);
    const core = r.slice(4);
    assert.ok(urlSafeRegex.test(core), `Not URL-safe: ${core}`);
  }
});

test("[combo] shortId + unique + batch", () => {
  const results = generateCode({ length: 8, shortId: true, count: 50, unique: true });
  const set = new Set(results);
  assert.strictEqual(set.size, 50);
  for (const r of results) {
    assert.ok(shortIdRegex.test(r));
  }
});

test("[combo] secure + prefix + suffix + batch", () => {
  const results = generateCode({
    length: 10, type: "alphanumeric", secure: true, prefix: "S_", suffix: "_E", count: 10,
  });
  for (const r of results) {
    assert.ok(r.startsWith("S_"), `Missing prefix: ${r}`);
    assert.ok(r.endsWith("_E"),   `Missing suffix: ${r}`);
    assert.strictEqual(r.length, 14); // 2 + 10 + 2
  }
});

// ─── Feature 10: Case ─────────────────────────────────────────────────────────

const upperRegex        = /^[A-Z0-9]+$/;
const lowerRegex        = /^[a-z0-9]+$/;
const upperAlphaRegex   = /^[A-Z]+$/;
const lowerAlphaRegex   = /^[a-z]+$/;

test("[case] upper produces only uppercase letters (alpha)", () => {
  const result = generateCode({ length: 50, type: "alpha", case: "upper" });
  assert.ok(upperAlphaRegex.test(result), `Not all uppercase: ${result}`);
  assert.strictEqual(result.length, 50);
});

test("[case] lower produces only lowercase letters (alpha)", () => {
  const result = generateCode({ length: 50, type: "alpha", case: "lower" });
  assert.ok(lowerAlphaRegex.test(result), `Not all lowercase: ${result}`);
  assert.strictEqual(result.length, 50);
});

test("[case] upper produces only uppercase letters and digits (alphanumeric)", () => {
  const result = generateCode({ length: 50, type: "alphanumeric", case: "upper" });
  assert.ok(upperRegex.test(result), `Not all uppercase: ${result}`);
});

test("[case] lower produces only lowercase letters and digits (alphanumeric)", () => {
  const result = generateCode({ length: 50, type: "alphanumeric", case: "lower" });
  assert.ok(lowerRegex.test(result), `Not all lowercase: ${result}`);
});

test("[case] numeric ignores case (digits are caseless)", () => {
  const upper = generateCode({ length: 20, type: "numeric", case: "upper" });
  const lower = generateCode({ length: 20, type: "numeric", case: "lower" });
  assert.ok(/^[0-9]+$/.test(upper));
  assert.ok(/^[0-9]+$/.test(lower));
});

test("[case] no case option returns mixed case (default behaviour unchanged)", () => {
  // Run enough chars that both cases are statistically certain to appear
  const result = generateCode({ length: 200, type: "alpha" });
  assert.ok(/[A-Z]/.test(result), "Expected at least one uppercase letter");
  assert.ok(/[a-z]/.test(result), "Expected at least one lowercase letter");
});

test("[case] upper works with secure mode", () => {
  const result = generateCode({ length: 30, type: "alpha", case: "upper", secure: true });
  assert.ok(upperAlphaRegex.test(result));
  assert.strictEqual(result.length, 30);
});

test("[case] lower works with secure mode", () => {
  const result = generateCode({ length: 30, type: "alpha", case: "lower", secure: true });
  assert.ok(lowerAlphaRegex.test(result));
  assert.strictEqual(result.length, 30);
});

test("[case] upper works with shortId", () => {
  const result = generateCode({ length: 30, shortId: true, case: "upper" });
  assert.ok(/^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]+$/.test(result), `Not shortId upper: ${result}`);
  assert.strictEqual(result.length, 30);
});

test("[case] lower works with shortId", () => {
  const result = generateCode({ length: 30, shortId: true, case: "lower" });
  assert.ok(/^[23456789abcdefghjkmnpqrstuvwxyz]+$/.test(result), `Not shortId lower: ${result}`);
  assert.strictEqual(result.length, 30);
});

test("[case] upper works in batch", () => {
  const results = generateCode({ length: 10, type: "alphanumeric", case: "upper", count: 20 });
  for (const r of results) {
    assert.ok(upperRegex.test(r), `Not all uppercase: ${r}`);
  }
});

test("[case] lower works with prefix and suffix", () => {
  const result = generateCode({ length: 8, type: "alpha", case: "lower", prefix: "id_", suffix: "_x" });
  assert.ok(result.startsWith("id_"));
  assert.ok(result.endsWith("_x"));
  const core = result.slice(3, -2);
  assert.ok(lowerAlphaRegex.test(core), `Core not lowercase: ${core}`);
});

test("[combo] case + unique + batch produces correct cased unique codes", () => {
  const results = generateCode({ length: 6, type: "alpha", case: "upper", count: 20, unique: true });
  const set = new Set(results);
  assert.strictEqual(set.size, 20);
  for (const r of results) {
    assert.ok(upperAlphaRegex.test(r), `Not uppercase: ${r}`);
  }
});