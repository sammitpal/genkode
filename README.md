# genkode - Random String & ID Generator for Node.js

![npm version](https://img.shields.io/npm/v/genkode)
![npm downloads](https://img.shields.io/npm/dw/genkode)
![license](https://img.shields.io/npm/l/genkode)
![types](https://img.shields.io/npm/types/genkode)

A lightweight Node.js utility to generate random alphanumeric, alphabetic, or numeric strings.  
Fully compatible with TypeScript. No external dependencies.

---

## 📦 Installation

```bash
npm install genkode
```

---

## 🚀 Usage

### Basic generation

```ts
import { generateCode } from 'genkode';

generateCode({ length: 12 });
// Example: rqfvYxJRWfoP  (alpha by default)

generateCode({ length: 12, type: "alphanumeric" });
// Example: aZ8kL2pQ9xW1

generateCode({ length: 12, type: "numeric" });
// Example: 362128126198

// Cryptographically secure generation
generateCode({ length: 12, type: "alphanumeric", secure: true });
// Example: Tz3mW8qA1nXp
```

### Case control

```ts
generateCode({ length: 12, case: "upper" });
// Example: RQFVYXJRWFOP

generateCode({ length: 12, case: "lower" });
// Example: rqfvyxjrwfop

generateCode({ length: 12, type: "alphanumeric", case: "upper" });
// Example: AZ8KL2PQ9XW1

generateCode({ length: 12, type: "alphanumeric", case: "lower" });
// Example: az8kl2pq9xw1
```

### Prefix & suffix

```ts
generateCode({ length: 10, prefix: "USER_" });
// Example: USER_rqfvYxJRWf

generateCode({ length: 10, suffix: "_END" });
// Example: rqfvYxJRWf_END

generateCode({ length: 8, prefix: "INV_", suffix: "_2024" });
// Example: INV_rqfvYxJR_2024
```

### Batch generation

```ts
// Returns string[] when count is provided
generateCode({ length: 10, count: 5 });
// Example: [ 'rqfvYxJRWf', 'TzAmW8qAnX', 'pLkQmNbVcD', 'HgFsJwKyRt', 'MnPxZuCvBe' ]

// Guarantee uniqueness within the batch
generateCode({ length: 10, count: 5, unique: true });
```

### Short ID mode

```ts
// No visually ambiguous characters (0, O, 1, l, I)
generateCode({ length: 12, shortId: true });
// Example: 3Ks9mBx4nPqR

// Combined with case
generateCode({ length: 12, shortId: true, case: "upper" });
// Example: 3KS9MBX4NPQR
```
---

## ⚙️ API

### `generateCode(options)`

Returns `string` when `count` is omitted, `string[]` when `count` is provided.

| Property  | Type | Default | Description |
|-----------|------|---------|-------------|
| `length`  | `number` | 6 | **Required.** Length of the generated string (1–100,000) |
| `type`    | `"alpha"` \| `"numeric"` \| `"alphanumeric"` | `"alpha"` | Character set to use |
| `case`    | `"upper"` \| `"lower"` | — | Force all letters to uppercase or lowercase. Has no effect on `type: "numeric"` |
| `secure`  | `boolean` | `false` | Use `crypto.getRandomValues` with rejection sampling for cryptographically secure, unbiased output |
| `prefix`  | `string` | `""` | Static string prepended to every generated code |
| `suffix`  | `string` | `""` | Static string appended to every generated code |
| `count`   | `number` | — | Generate a batch — returns `string[]` instead of `string` |
| `unique`  | `boolean` | `false` | Guarantee all codes in a batch are unique. Throws `KodeError` if `count` exceeds the total possible combinations |
| `shortId` | `boolean` | `false` | Use a reduced charset that excludes visually ambiguous characters (`0`, `O`, `1`, `l`, `I`). Overrides `type`. Respects `case` |

### `KodeError`

All validation failures throw a `KodeError` (extends `Error`, `name: "KodeError"`).

```ts
import { generateCode, KodeError } from 'genkode';

try {
  generateCode({ length: 0 });
} catch (err) {
  if (err instanceof KodeError) {
    console.error(err.message); // "length must be at least 1, got: 0"
  }
}
```

Throws for:
- `length` less than 1 or greater than 100,000
- `length` or `count` that is not an integer
- `unique: true` with a `count` that exceeds the total possible combinations for the given charset and length

---

## ⚡ Why genkode?

- Zero dependencies
- Fast buffered generation — random bytes are fetched in bulk, not one at a time
- TypeScript support with overloaded return types (`string` vs `string[]`)
- Cryptographically secure mode with rejection sampling to eliminate modulo bias
- Batch generation with optional uniqueness guarantee
- Short ID mode without ambiguous characters
- Case control for uppercase or lowercase output

---

## 🧩 Use Cases

- Database IDs
- Tokens / API keys
- Session identifiers
- Invoice & order numbers (with prefix/suffix)
- Temporary codes
- Unique batch identifiers
- Human-readable codes (shortId + case for clarity)
- Random test data

---

## 🔒 Security

By default, `generateCode` uses `Math.random`, which is fast but **not cryptographically secure**.

Set `secure: true` to use `crypto.getRandomValues` (Web Crypto API) with **rejection sampling**, which produces unbiased, cryptographically secure output. Use this when generating tokens, API keys, or any value where predictability is a security concern.

```ts
generateCode({ length: 32, type: "alphanumeric", secure: true });
```

> **Note:** Standard random generation uses buffered byte fetching for performance. Secure mode also uses buffering but applies rejection sampling to ensure every character in the charset has an exactly equal probability of being selected.

---

## 🔗 Related Package

JavaScript-only version:

node-mumble (by same developer)  
https://www.npmjs.com/package/node-mumble

---

## 📄 License

MIT