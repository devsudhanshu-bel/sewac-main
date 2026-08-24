# main.jsx — Language Provider Integration

## 1. Relationship to i18n

The application's main entry point integrates the language system through `LanguageProvider`.

The provider must wrap the React application so that components using:

```js
useLanguage()
```

can access the active language and `t()` function.

---

## 2. Application Flow

Conceptually:

```text
React Root
    ↓
LanguageProvider
    ↓
App
    ↓
Pages
    ↓
Components
    ↓
useLanguage()
```

---

## 3. Why the Provider Is Global

The Users, Plants, Complaints, Overview, Vehicles and Waste Generators components can independently request translated strings.

Because the provider is placed at the application level, they all share:

```text
current language
language setter
translation function
available language list
```

---

## 4. Important Implementation Note

`main.jsx` is not a translation dictionary.

It is the application bootstrap location that makes the translation context available to the component tree.
