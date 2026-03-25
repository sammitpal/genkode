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
// Example: aZ8kL2pQ9xW1

generateCode({ length: 12, type: "alpha" });
// Example: rqfvYxJRWfoP

generateCode({ length: 12, type: "numeric" });
// Example: 362128126198
```

---

### Simple helper functions

```ts
import { randomString, randomAlpha, randomNumeric } from 'genkode';

randomString(12);   // alphanumeric
randomAlpha(12);    // alphabets only
randomNumeric(12);  // numbers only
```

---

## ⚙️ API

### generateCode(options)

| Property | Type | Description |
|----------|------|-------------|
| length   | number | Required length of string |
| type     | "alpha" \| "numeric" \| "alphanumeric" | Optional (default: alphanumeric) |

---

## ⚡ Why genkode?

- Zero dependencies
- Fast and lightweight
- TypeScript support
- Simple and flexible API
- Multiple formats (alpha, numeric, alphanumeric)

---

## 🧩 Use Cases

- Database IDs  
- Tokens / API keys  
- Session identifiers  
- Temporary codes  
- Random test data  

---

## 🔒 Notes

- Uses Math.random (not cryptographically secure)
- Suitable for general-purpose usage

---

## 🔗 Related Package

JavaScript-only version:

node-mumble (by same developer)  
https://www.npmjs.com/package/node-mumble

---

## 📄 License

MIT
