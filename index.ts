import type { GenerateOptions } from "./kode.interface.js";
import { KodeError } from "./kode.interface.js";

// ─── Charsets ────────────────────────────────────────────────────────────────

const ALPHA_MIXED = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const ALPHA_UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const ALPHA_LOWER = "abcdefghijklmnopqrstuvwxyz";

const NUMERIC = "0123456789";

const ALPHANUM_MIXED = ALPHA_MIXED + NUMERIC;
const ALPHANUM_UPPER = ALPHA_UPPER + NUMERIC;
const ALPHANUM_LOWER = ALPHA_LOWER + NUMERIC;

// Feature 7: Short ID charset — high-entropy, URL-safe, no lookalikes
const SHORT_ID_MIXED = "23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ";
const SHORT_ID_UPPER = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const SHORT_ID_LOWER = "23456789abcdefghjkmnpqrstuvwxyz";

// crypto.getRandomValues() hard cap in Node.js (and browsers)
const RANDOM_BYTES_MAX = 65_536;

// ─── Feature 6: Length validation ────────────────────────────────────────────

const MAX_SAFE_LENGTH = 100_000;

function validateLength(length: number): void {
  if (!Number.isInteger(length)) {
    throw new KodeError(`length must be an integer, got: ${length}`);
  }
  if (length < 1) {
    throw new KodeError(`length must be at least 1, got: ${length}`);
  }
  if (length > MAX_SAFE_LENGTH) {
    throw new KodeError(
      `length exceeds maximum safe value of ${MAX_SAFE_LENGTH}, got: ${length}`
    );
  }
}

function validateCount(count: number): void {
  if (!Number.isInteger(count)) {
    throw new KodeError(`count must be an integer, got: ${count}`);
  }
  if (count < 1) {
    throw new KodeError(`count must be at least 1, got: ${count}`);
  }
}

// ─── Core generators ─────────────────────────────────────────────────────────

/** Feature 5 (internal): buffered — uses a chunked random buffer for performance */
function generate(length: number, charset: string): string {
  const max     = charset.length;
  const result  = new Array<string>(length);
  // Stay within the 65536-byte getRandomValues cap
  const bufSize = Math.min(Math.max(length, 256), RANDOM_BYTES_MAX);
  const buffer  = new Uint8Array(bufSize);

  let filled = 0;
  let bi     = bufSize; // force first refill

  while (filled < length) {
    if (bi >= bufSize) {
      crypto.getRandomValues(buffer);
      bi = 0;
    }
    result[filled++] = charset[buffer[bi++]! % max]!;
  }

  return result.join("");
}

/**
 * Secure generation: rejection-sampling to eliminate modulo bias.
 * Buffered — fills a large buffer instead of 1-byte-at-a-time.
 */
function generateSecure(length: number, charset: string): string {
  const max       = charset.length;
  const threshold = Math.floor(256 / max) * max; // rejection boundary
  const result    = new Array<string>(length);
  // Stay within the 65536-byte cap; over-allocate so fewer refills are needed
  const bufSize   = Math.min(Math.max(length * 3, 256), RANDOM_BYTES_MAX);
  const buffer    = new Uint8Array(bufSize);

  let filled = 0;
  let bi     = bufSize; // force first refill

  while (filled < length) {
    if (bi >= bufSize) {
      crypto.getRandomValues(buffer);
      bi = 0;
    }
    const byte = buffer[bi++]!;
    if (byte < threshold) {
      result[filled++] = charset[byte % max]!;
    }
  }

  return result.join("");
}

// ─── Charset resolution helper ────────────────────────────────────────────────

function resolveCharset(
  type: GenerateOptions["type"] = "alpha",
  caseOpt: GenerateOptions["case"],
  shortId = false
): string {
  if (shortId) {
    return caseOpt === "upper" ? SHORT_ID_UPPER :
           caseOpt === "lower" ? SHORT_ID_LOWER :
                                 SHORT_ID_MIXED;
  }

  if (type === "numeric") return NUMERIC; // case has no effect on digits

  if (type === "alpha") {
    return caseOpt === "upper" ? ALPHA_UPPER :
           caseOpt === "lower" ? ALPHA_LOWER :
                                 ALPHA_MIXED;
  }

  // alphanumeric
  return caseOpt === "upper" ? ALPHANUM_UPPER :
         caseOpt === "lower" ? ALPHANUM_LOWER :
                               ALPHANUM_MIXED;
}

// ─── Single-code generator (internal) ────────────────────────────────────────

function _generateOne(
  length: number,
  charset: string,
  secure: boolean,
  prefix = "",
  suffix = ""
): string {
  const raw = secure ? generateSecure(length, charset) : generate(length, charset);
  return prefix + raw + suffix;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Generate one or more codes synchronously.
 *
 * - `count`   → batch generation
 * - `unique`  → guarantee uniqueness within batch
 * - `prefix`  → static prefix
 * - `suffix`  → static suffix
 * - `shortId` → compact high-entropy charset without ambiguous characters
 * - `case`    → "upper" or "lower" to restrict letter casing
 */
export function generateCode(options: GenerateOptions & { count?: undefined }): string;
export function generateCode(options: GenerateOptions & { count: number }): string[];
export function generateCode(options: GenerateOptions): string | string[] {
  const {
    length = 6,
    type    = "alpha",
    secure  = false,
    prefix  = "",
    suffix  = "",
    count,
    shortId = false,
    unique  = false,
    case: caseOpt,
  } = options;

  // Feature 6: Validation
  validateLength(length);
  if (count !== undefined) validateCount(count);

  const charset = resolveCharset(type, caseOpt, shortId);

  // Feature 8: unique batch guard — check feasibility
  if (unique && count !== undefined) {
    const possibleCombinations = Math.pow(charset.length, length);
    if (count > possibleCombinations) {
      throw new KodeError(
        `Cannot generate ${count} unique codes of length ${length} from charset of size ` +
        `${charset.length} (max possible: ${possibleCombinations})`
      );
    }
  }

  // Feature 3: Batch generation
  if (count !== undefined) {
    const seen = unique ? new Set<string>() : null;
    const results: string[] = [];

    while (results.length < count) {
      const code = _generateOne(length, charset, secure, prefix, suffix);
      if (seen) {
        if (seen.has(code)) continue;
        seen.add(code);
      }
      results.push(code);
    }

    return results;
  }

  // Single code
  return _generateOne(length, charset, secure, prefix, suffix);
}

export { KodeError };