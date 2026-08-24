# KPICards.jsx Component Documentation

## 1. File Overview

**File:** `KPICards.jsx`  
**Location:** `src/components/vehicles/KPICards.jsx`

`KPICards` displays the main vehicle KPIs at the top of the Vehicles page.

---

## 2. Props

The component receives:

```js
summary
```

The expected summary values are:

```text
totalVehicles
activeVehicles
inactiveVehicles
averageWeightPerVehicle
```

---

## 3. Safe Numeric Values

The component converts incoming values using:

```js
Number(...)
```

and falls back to:

```text
0
```

This prevents invalid or missing API values from breaking the KPI display.

---

## 4. Calculated Percentages

The component calculates:

```text
Active %
Inactive %
```

from the total number of vehicles.

The percentages are calculated from:

```text
activeVehicles
inactiveVehicles
totalVehicles
```

---

## 5. KPI Information

The component displays vehicle information including:

```text
Total Vehicles
Active Vehicles
Inactive Vehicles
Per Vehicles Avg
Weight Collection
```

---

## 6. GSAP Animation

The component uses:

```js
gsap
```

to animate the KPI section when it is rendered.

A `useRef` is used to target the KPI section.

---

## 7. Language Support

The component uses:

```js
useLanguage()
```

and translation keys under:

```text
vehicles.kpis.*
```

Examples include:

```text
vehicles.kpis.totalVehicles
vehicles.kpis.activeVehicles
vehicles.kpis.inactiveVehicles
vehicles.kpis.averageWeight
vehicles.kpis.weightCollection
```

---

## 8. Component Flow

```text
Vehicles.jsx
    ↓
summary prop
    ↓
KPICards
    ↓
Safe numeric values
    ↓
Percentage calculations
    ↓
Animated KPI cards
```

---

## 9. Summary

`KPICards.jsx` is the top-level vehicle statistics component. It receives summary data from `Vehicles.jsx`, safely normalizes the values, calculates percentages, animates the display, and supports translations.
