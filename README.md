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

### Generate using main API

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

---

## ⚙️ API

### `generateCode(options)`

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `length` | `number` | — | Required. Length of the generated string |
| `type` | `"alpha"` \| `"numeric"` \| `"alphanumeric"` | `"alpha"` | Character set to use |
| `secure` | `boolean` | `false` | Use `crypto.getRandomValues` for cryptographically secure output |

---

## ⚡ Why genkode?

- Zero dependencies
- Fast and lightweight
- TypeScript support
- Simple and flexible API
- Multiple formats (alpha, numeric, alphanumeric)
- Optional cryptographically secure mode via Web Crypto API

---

## 🧩 Use Cases

- Database IDs  
- Tokens / API keys  
- Session identifiers  
- Temporary codes  
- Random test data  

---

## 🔒 Security

By default, `generateCode` uses `Math.random`, which is fast but **not cryptographically secure**.

Set `secure: true` to use `crypto.getRandomValues` (Web Crypto API), which produces unbiased, cryptographically secure output. Use this when generating tokens, API keys, or any value where predictability is a security concern.

```ts
generateCode({ length: 32, type: "alphanumeric", secure: true });
```

---

## 🔗 Related Package

JavaScript-only version:

node-mumble (by same developer)  
https://www.npmjs.com/package/node-mumble

---

## 📄 License

MIT