# WasteGenKPIs.jsx Documentation

## 1. File Overview

**File:** `WasteGenKPIs.jsx`  
**Location:** `src/components/waste-generators/WasteGenKPIs.jsx`

`WasteGenKPIs` displays high-level Waste Generator statistics for the selected filters/date.

---

## 2. Props

```js
{
  summary
}
```

The parent page provides the summary returned by the Waste Generator summary API.

---

## 3. No-Data Behavior

If:

```js
!summary
```

the component returns:

```js
null
```

---

## 4. Summary Values

The component uses:

```text
totalWasteGenerated
averageWaste
totalWasteGenerators
activeWasteGenerators
inactiveWasteGenerators
aboveAverage
belowAverage
```

---

## 5. Waste Formatting

Backend waste values are treated as KG.

The display rule is:

```text
<= 1000 KG
    ↓
KG

> 1000 KG
    ↓
TONS
```

Exactly:

```text
1000 KG
```

remains displayed as KG.

---

## 6. Total Waste

The total waste value comes from:

```js
summary?.totalWasteGenerated
```

and is formatted using the waste formatter.

---

## 7. Average Waste

Average waste comes from:

```js
summary?.averageWaste
```

and is formatted using the same KG/TONS rule.

---

## 8. Waste Generator Counts

The component displays:

```text
Total Waste Generators
Active Waste Generators
Inactive Waste Generators
```

The values are safely converted to numbers.

---

## 9. Above / Below Average

The summary also contains:

```text
aboveAverage
belowAverage
```

which are represented as KPI information.

---

## 10. Animation

The component uses:

```text
GSAP
```

with:

```js
gsap.from(...)
```

to animate the KPI section when it appears.

The animation uses a short fade/vertical movement.

---

## 11. Icons

Lucide icons used include:

```text
Trash2
Scale
UserRound
```

These visually represent waste and generator statistics.

---

## 12. Language Support

The component uses:

```js
useLanguage()
```

for translated KPI labels and text.

---

## 13. Data Flow

```text
Waste Generators API
        ↓
WasteGenerators.jsx
        ↓
summary
        ↓
WasteGenKPIs
        ↓
Formatted KPI Cards
```

---

## 14. Summary

`WasteGenKPIs.jsx` is the KPI presentation component for the Waste Generators page. It converts backend KG values into readable KG/TONS values, displays generator activity statistics, and provides a GSAP entrance animation.
