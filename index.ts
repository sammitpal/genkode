import type { GenerateOptions } from "./kode.interface.js";

const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const NUMERIC = "0123456789";
const ALPHANUM = ALPHA + NUMERIC;

function generate(length: number, charset: string): string {
  let result = "";
  const max = charset.length;

  while (length > 0) {
    const index = Math.floor(Math.random() * max);
    result += charset[index]!;
    length--;
  }

  return result;
}


function generateSecure(length: number, charset: string): string {
  const max = charset.length;
  const result: string[] = [];
  const randomBuffer = new Uint8Array(1);

  while (result.length < length) {
    crypto.getRandomValues(randomBuffer);
    const byte = randomBuffer[0]!;

    if (byte < Math.floor(256 / max) * max) {
      result.push(charset[byte % max]!);
    }
  }

  return result.join("");
}


function randomString(length: number): string {
  return generate(length, ALPHANUM);
}

function randomAlpha(length: number): string {
  return generate(length, ALPHA);
}

function randomNumeric(length: number): string {
  return generate(length, NUMERIC);
}


export function generateCode({length,type = "alpha",secure = false}: GenerateOptions): string {
  const charset =
    type === "alpha" ? ALPHA :
    type === "numeric" ? NUMERIC :
    ALPHANUM;

  return secure
    ? generateSecure(length, charset)
    : generate(length, charset);
}