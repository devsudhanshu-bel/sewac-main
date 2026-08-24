# ComplaintFilters Component Documentation

## 1. File Overview

**File:** `ComplaintFilters.jsx`  
**Location:** `src/components/complaints/ComplaintFilters.jsx`

`ComplaintFilters` provides the filtering controls used by the Complaints page.

It supports:

```text
Search
Category
Date From
Date To
Reset
```

The component is controlled by the parent `Complaints.jsx` page.

---

## 2. Props

```jsx
<ComplaintFilters
  filters={filters}
  onFilterChange={handleFilterChange}
  onReset={resetFilters}
/>
```

| Prop | Purpose |
|---|---|
| `filters` | Current filter values |
| `onFilterChange` | Callback used when an individual filter changes |
| `onReset` | Callback used to reset all filters |

---

## 3. Search

The search field uses:

```text
filters.search
```

and calls:

```js
onFilterChange("search", value)
```

when the user enters text.

The placeholder is localized through:

```text
complaints.filters.searchPlaceholder
```

---

## 4. Category Filter

The category dropdown contains:

```text
All
MISSED_COLLECTION
OVERFLOWING_BIN
ILLEGAL_DUMPING
STREET_LITTER
DAMAGED_BIN
OTHER
```

The displayed labels are translated through the language context.

The selected value is:

```text
filters.category
```

---

## 5. Date From

The first date input is controlled by:

```text
filters.dateFrom
```

Changes are sent to the parent using:

```js
onFilterChange("dateFrom", value)
```

---

## 6. Date To

The second date input is controlled by:

```text
filters.dateTo
```

Changes are sent using:

```js
onFilterChange("dateTo", value)
```

---

## 7. Reset

The Reset button calls:

```js
onReset
```

The component itself does not reset the state.

The parent page owns the filter state and performs the reset.

---

## 8. FilterSelect Helper

The file contains an internal reusable:

```text
FilterSelect
```

component.

It receives:

```text
label
value
onChange
options
```

and renders a styled `<select>` with:

```text
Floating label
Dropdown icon
Options
```

---

## 9. Language Support

The component uses:

```js
useLanguage()
```

and translates:

```text
Search placeholder
Category
Category options
Date-to label
Reset
```

---

## 10. Data Flow

```text
User Input
    ↓
ComplaintFilters
    ↓
onFilterChange()
    ↓
Complaints.jsx
    ↓
Fetch complaints with filters
```

---

## 11. Responsibilities

`ComplaintFilters` handles only the filter UI.

It does not:

```text
Call the complaints API
Fetch data
Perform pagination
Store the main filter state
```

The parent page performs those responsibilities.

---

## 12. Summary

`ComplaintFilters.jsx` is the controlled filtering interface for the Complaints page. It provides search, category, date-range, and reset controls while leaving state management and API requests to `Complaints.jsx`.
