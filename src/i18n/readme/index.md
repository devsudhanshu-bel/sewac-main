# i18n/index.js Documentation

## 1. File Overview

**File:** `src/i18n/index.js`

This file acts as the public export entry point for the application's custom internationalization system.

---

## 2. Re-exported APIs

It re-exports:

```js
LanguageProvider
useLanguage
```

from:

```text
./LanguageContext
```

It also exports the default `LanguageContext`.

---

## 3. Purpose

Instead of importing directly from:

```text
src/i18n/LanguageContext
```

application files can import the public i18n APIs from:

```text
src/i18n
```

This provides a cleaner import boundary.

---

## 4. Export Structure

The file exposes:

```js
export {
  LanguageProvider,
  useLanguage,
} from "./LanguageContext";

export { default } from "./LanguageContext";
```

---

## 5. Relationship

```text
Components
    ↓
src/i18n/index.js
    ↓
LanguageContext.jsx
    ↓
Translation dictionaries
```

---

## 6. Summary

`index.js` contains no translation strings and no language state of its own.

Its responsibility is simply to provide a convenient public entry point for the i18n module.
