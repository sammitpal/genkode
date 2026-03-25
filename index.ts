import type { GenerateCodeOptions } from "./kode.interface.js";

const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const NUMERIC = "0123456789";
const ALPHANUM = ALPHA + NUMERIC;

function generate(length: number, charset: string): string {
  let result = "";
  const max = charset.length;

  while (length > 0) {
    const index = Math.floor(Math.random() * max);
    result += charset[index];
    length--;
  }

  return result;
}

export function generateCode({ length, type = "alphanumeric" }: GenerateCodeOptions): string {
  if (type === "alpha") return generate(length, ALPHA);
  if (type === "numeric") return generate(length, NUMERIC);
  return generate(length, ALPHANUM);
}

export function randomString(length: number): string {
  return generate(length, ALPHANUM);
}

export function randomAlpha(length: number): string {
  return generate(length, ALPHA);
}

export function randomNumeric(length: number): string {
  return generate(length, NUMERIC);
}
