# hi.js Translation Documentation

## 1. File Overview

**File:** `src/i18n/translations/hi.js`  
**Language:** Hindi  
**Language Code:** `hi`

This file contains the frontend translation dictionary for the `Hindi` interface.

The file exports one translation object:

```js
export default hi;
```

The object is imported by `LanguageContext.jsx` and registered under the `hi` language code.

---

## 2. Translation Architecture

```text
hi.js
   ↓
LanguageContext.jsx
   ↓
translations["hi"]
   ↓
t("feature.key")
   ↓
Translated UI
```

---

## 3. Structured Translation Keys

The translation object is organized into feature-based/nested sections.

The source file contains sections covering areas such as:

```text
common
language
header
sidebar
filters
overview
users
generationTrend
gvp / GVP map areas
waste generators
vehicles
plants
complaints
city overview map
other feature-specific UI sections
```

The exact nested structure should be treated as the source of truth because the dictionaries contain many feature-specific keys.

---

## 4. Common Translation Areas

The `common` section contains reusable interface text such as:

```text
Search
Save
Cancel
Delete
Edit
Add
Close
Apply
Reset
Yes
No
Active
Inactive
Loading
Actions
All
Total
Included
```

Components can therefore avoid duplicating these common labels.

---

## 5. Language Selector Text

The `language` section contains the display names used by the language-selection UI.

The supported language names correspond to:

```text
English
Kannada
Hindi
```

---

## 6. Navigation and Header

The dictionary contains translation groups for application-level navigation and header content, including:

```text
Overview
Waste Generators
Vehicles
Plant
Complaints
Users
Logs
AI Agent
Settings
Logout
```

Header and filter labels are also included.

---

## 7. Overview Translations

The Overview translation area contains strings for:

```text
Overview title
Overview KPIs
Citizens Trend
Vehicle Fleet Status
Generation Trend
City Overview Map
GVP Overview Map
Map filters
Ward boundaries
Plants
Collection points
Customer grievances
```

These keys are consumed by Overview-related components.

---

## 8. Plants Translations

The translation dictionaries contain Plant-related strings for:

```text
Plant dashboard
Plant directory
Create plant
Edit plant
Delete plant
Plant locations
Plant KPIs
Loading/error states
Plant table/detail text
```

---

## 9. Users Translations

The Users section contains text for:

```text
Users page
Admin Level 1 users
Contractor users
User table
Actions
Pagination
Add/Edit user modal
Delete user modal
Validation errors
Loading states
```

Examples of nested keys used by the current frontend include:

```text
users.modal.deleteTitle
users.modal.deleteConfirmation
users.modal.deleteWarning
users.modal.errors.updateFailed
users.modal.errors.deleteFailed
```

---

## 10. Complaints Translations

The dictionaries contain text for the Complaints module, including areas such as:

```text
Complaint header
Complaint filters
Complaint KPIs
Complaint table
Complaint details
Complaint status labels
```

---

## 11. Waste Generator Translations

The Waste Generators dictionary contains groups for:

```text
Waste Generator page
KPIs
GVP generation trend
Collection point monitoring
Map states
Map legend
Telemetry status
Tooltips
Errors
```

---

## 12. Vehicles Translations

Vehicle-related strings cover areas such as:

```text
Vehicle page
Vehicle KPIs
Average weight
Telemetry directory
Create/Edit/Delete vehicle
Loading
Retry
Errors
```

---

## 13. Map Translation Areas

The dictionaries contain several map-specific groups.

They cover:

```text
City
Zone
Division
Ward
GVP points
Plants
Ward boundaries
Route maps
Collection points
Coordinates
Latitude
Longitude
Map loading states
Empty states
Map errors
Tooltips
```

---

## 14. Translation Key Usage

Components request values using dot-separated paths.

Example:

```js
t("users.modal.deleteTitle", "Delete User")
```

The path is resolved by `getNestedValue()` inside `LanguageContext.jsx`.

---

## 15. Relationship Between the Three Dictionaries

The three files are intended to expose the same conceptual application areas:

```text
en.js
hi.js
kn.js
```

The active file is selected by the current language code.

```text
language = "en" → en.js
language = "hi" → hi.js
language = "kn" → kn.js
```

---

## 16. Important Implementation Note

These are JavaScript translation objects rather than JSON resource files.

Therefore:

```text
translation key
      ↓
JavaScript object
      ↓
LanguageContext
      ↓
t()
```

There is no HTTP translation-resource request in the current frontend implementation.

---

## 17. Summary

The `hi.js` file is the localized text catalog for the Hindi interface.

It provides translated strings used throughout the application's:

```text
Navigation
Header
Filters
Overview
Plants
Users
Complaints
Vehicles
Waste Generators
Maps
Modals
Validation messages
Loading/error states
```

The actual key hierarchy in the source file is the authoritative structure for developers adding or changing translated UI text.
