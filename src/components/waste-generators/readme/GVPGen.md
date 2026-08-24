# GVPGen.jsx Documentation

## 1. File Overview

**File:** `GVPGen.jsx`  
**Location:** `src/components/waste-generators/GVPGen.jsx`

`GVPGen` displays the GVP generation trend for all wards under the selected division.

The component intentionally does **not** use the selected ward for the graph.

---

## 2. Props

```js
{
  selectedDate,
  selectedCity,
  selectedZone,
  selectedDivision
}
```

The graph is based on:

```text
Date
City
Zone
Division
```

---

## 3. Important Ward Behavior

`selectedWard` is intentionally not part of this component.

The graph represents:

```text
ALL wards
under the selected division
```

for the selected date.

---

## 4. State

The component maintains:

```text
data
loading
error
```

### `data`

Stores the GVP trend records.

### `loading`

Controls the chart loading state.

### `error`

Stores an API error message.

---

## 5. Required City

The component requires:

```js
selectedCity?.city_id
```

If no city is selected:

```text
data = []
error = ""
```

and the component does not request GVP data.

---

## 6. Query Parameters

The request can include:

```text
date
cityId
zoneId
divisionId
```

The query is built with `URLSearchParams`.

---

## 7. Backend API

The component requests:

```text
GET /api/waste-generators/gvp-trend
```

with the selected query parameters.

---

## 8. Data Processing

The returned data is normalized into the chart's expected structure.

The component maps ward-level GVP values so they can be represented on the X-axis and Y-axis.

The implementation also handles numeric values safely before rendering the chart.

---

## 9. Chart

The component uses Recharts:

```text
ResponsiveContainer
LineChart
Line
XAxis
YAxis
CartesianGrid
Tooltip
```

The result is a responsive line chart.

---

## 10. Visualization Flow

```text
Date
 +
City
 +
Zone
 +
Division
 ↓
/api/waste-generators/gvp-trend
 ↓
GVP Data
 ↓
Normalize Data
 ↓
Recharts LineChart
 ↓
Ward-wise GVP Trend
```

---

## 11. Language Support

The component uses:

```js
useLanguage()
```

and the translation function:

```js
t()
```

for chart labels, loading messages, empty states, and other UI text.

---

## 12. Summary

`GVPGen.jsx` is the analytical GVP trend component of the Waste Generators page. It displays GVP generation for all wards belonging to the selected division and date, using the GVP trend backend endpoint and a responsive Recharts line chart.
