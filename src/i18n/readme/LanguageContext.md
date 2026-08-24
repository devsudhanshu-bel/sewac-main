# LanguageContext.jsx Documentation

## 1. File Overview

**File:** `src/i18n/LanguageContext.jsx`

This file implements the application's custom internationalization context.

It provides:

- Current language state
- Language switching
- Persistent language selection
- Translation lookup
- Available-language metadata
- HTML language synchronization
- React context access through `useLanguage()`

The current implementation uses three translation objects:

```text
en
hi
kn
```

---

## 2. Translation Resources

The file imports:

```js
import en from "./translations/en";
import kn from "./translations/kn";
import hi from "./translations/hi";
```

They are combined into:

```js
const translations = {
  en,
  kn,
  hi,
};
```

Therefore the supported language codes in this implementation are:

| Code | Language |
|---|---|
| `en` | English |
| `kn` | Kannada |
| `hi` | Hindi |

---

## 3. LanguageContext

The context is created with:

```js
const LanguageContext = createContext(null);
```

Components do not access the translation objects directly. They normally use:

```js
const { t } = useLanguage();
```

---

## 4. Default Language

The default language is:

```text
en
```

This is defined as:

```js
const DEFAULT_LANGUAGE = "en";
```

If no valid language has previously been saved, English is selected.

---

## 5. Persistent Storage

The selected language is stored in browser `localStorage` using:

```text
sewac-language
```

The constant is:

```js
const STORAGE_KEY = "sewac-language";
```

This means the selected language can survive page reloads.

---

## 6. Initial Language Selection

`getInitialLanguage()` performs the following process:

```text
Read localStorage
       ↓
Check "sewac-language"
       ↓
Check whether the code exists
       ↓
Use saved language if valid
       ↓
Otherwise use English
```

Invalid or missing saved values therefore fall back to:

```text
en
```

---

## 7. Nested Translation Lookup

The helper:

```js
getNestedValue(object, path)
```

allows translation keys to use dot notation.

Example:

```text
users.modal.deleteTitle
```

is resolved conceptually as:

```text
translations
   ↓
users
   ↓
modal
   ↓
deleteTitle
```

This allows the translation dictionaries to remain structured by feature.

---

## 8. setLanguage()

The context exposes:

```js
setLanguage(newLanguage)
```

The function first checks:

```js
translations[newLanguage]
```

If the language is unsupported, it logs:

```text
Unsupported language: <language>
```

and does not change the active language.

For a supported language it:

```text
Updates React state
        ↓
Stores language in localStorage
```

---

## 9. t() Translation Function

The context exposes:

```js
t(key, fallback)
```

The lookup order is:

```text
Requested translation key
        ↓
Translation exists?
     /          Yes        No
   ↓           ↓
value       fallback
               ↓
          if no fallback
               ↓
             key
```

Therefore missing translations do not silently become blank strings.

---

## 10. Fallback Behaviour

Example:

```js
t(
  "users.modal.errors.updateFailed",
  "Failed to update user."
)
```

If the requested key exists, its translated value is returned.

If it does not exist, the supplied English fallback is returned.

If neither exists, the key itself is returned.

---

## 11. HTML Language Attribute

The context runs:

```js
document.documentElement.lang = language;
```

whenever the active language changes.

Therefore:

```text
English → <html lang="en">
Kannada → <html lang="kn">
Hindi   → <html lang="hi">
```

---

## 12. availableLanguages

The context exposes:

```js
availableLanguages
```

containing:

```text
English
Kannada
Hindi
```

Each item contains:

```text
code
name
```

This allows a language selector component to build its options from the context.

---

## 13. Context Value

The provider exposes:

```text
language
setLanguage
t
translations
availableLanguages
```

So consuming components can access both the active language and the translation helper.

---

## 14. useLanguage()

The exported hook is:

```js
useLanguage()
```

It reads the current `LanguageContext`.

If a component attempts to use the hook outside `LanguageProvider`, it throws:

```text
useLanguage must be used inside a LanguageProvider
```

This protects the application from incorrectly mounted translation-aware components.

---

## 15. Provider Flow

The overall frontend flow is:

```text
main.jsx
   ↓
LanguageProvider
   ↓
Application
   ↓
Page / Component
   ↓
useLanguage()
   ↓
t("translation.key")
   ↓
Current language dictionary
   ↓
Translated UI text
```

---

## 16. Dependencies

This file relies on React APIs:

```text
createContext
useContext
useEffect
useMemo
useState
```

No external i18n library is used in this implementation.

The translation system is custom-built around React Context.

---

## 17. Summary

`LanguageContext.jsx` is the central internationalization controller for the frontend.

It is responsible for:

```text
Language state
      +
Language persistence
      +
Language validation
      +
Nested key lookup
      +
Fallback text
      +
HTML lang synchronization
      +
Translation context
```
