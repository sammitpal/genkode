# genkode

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

### 1. Generate Alphanumeric String

```ts
import { mumble } from 'genkode';

console.log(mumble(12));

// Example output:
// vl6QLrr3xIBe
```

---

### 2. Generate Alphabet-only String

```ts
import { mumblealpha } from 'genkode';

console.log(mumblealpha(12));

// Example output:
// rqfvYxJRWfoP
```

---

### 3. Generate Numeric String

```ts
import { mumblenum } from 'genkode';

console.log(mumblenum(12));

// Example output:
// 362128126198
```

---

## ⚙️ API

| Function        | Description                          |
|----------------|--------------------------------------|
| `mumble(n)`     | Returns alphanumeric string          |
| `mumblealpha(n)`| Returns alphabet-only string         |
| `mumblenum(n)`  | Returns numeric string               |

- `n` → Length of the required string

---

## 🧩 Use Cases

These generated strings can be used for:

- Database IDs  
- Tokens / API keys  
- Session identifiers  
- Temporary codes  
- Random test data  

---

## 🔒 Notes

- This package uses standard random generation (`Math.random`)
- Suitable for general-purpose use
- Not recommended for cryptographic/security-critical use cases

---

## 🔗 Related Package

This package is also available as a JavaScript-only version:

**node-mumble** (by the same developer)  
https://www.npmjs.com/package/node-mumble

---

## 📄 License

ISC
