# OverviewKPIs Component Documentation

## 1. Component Overview

### Component Name

`OverviewKPIs`

### File Location

```text
src/components/overview/OverviewKPIs.jsx
```

### Purpose

The `OverviewKPIs` component is responsible for displaying the primary Key Performance Indicators (KPIs) of the SEWAC dashboard's Overview page.

It provides a quick summary of the most important system-level statistics without requiring the user to navigate through individual dashboard sections.

The component currently displays four KPI cards:

1. **Total Waste Collected**
2. **Collection Points**
3. **Total Citizens**
4. **Citizens Trend**

The first three cards display individual numerical KPIs, while the fourth card provides a comparison between citizens who gave waste and citizens who did not give waste.

---

# 2. Responsibilities

The component is responsible for:

* Receiving Overview KPI data through props.
* Formatting numerical values for display.
* Converting waste from kilograms to tons when appropriate.
* Calculating citizen participation percentages.
* Displaying KPI icons.
* Rendering the KPI cards using Tailwind CSS.
* Animating the KPI cards when the component is mounted.
* Handling missing data safely.
* Formatting large numbers using JavaScript's `toLocaleString()`.

The component **does not directly communicate with the backend API**.

Instead, the parent component is responsible for obtaining the data and passing it through the `data` prop.

---

# 3. Component Interface

The component receives one prop:

```jsx
<OverviewKPIs data={data} />
```

### Prop

| Prop   | Type   | Required | Description                                                      |
| ------ | ------ | -------- | ---------------------------------------------------------------- |
| `data` | Object | Yes      | Contains the KPI information used to populate the Overview cards |

Expected data structure:

```js
{
  totalWasteCollected: number,
  collectionPoints: number,
  totalCitizens: number,
  trashGiven: number,
  notGiven: number
}
```

### Field Description

| Field                 | Description                               | Unit  |
| --------------------- | ----------------------------------------- | ----- |
| `totalWasteCollected` | Total amount of waste collected           | KG    |
| `collectionPoints`    | Number of collection points               | Count |
| `totalCitizens`       | Total number of citizens                  | Count |
| `trashGiven`          | Number of citizens who gave waste         | Count |
| `notGiven`            | Number of citizens who did not give waste | Count |

---

# 4. Data Flow

The component follows a simple one-way data flow.

```text
Backend / API
      ↓
Parent Overview Component
      ↓
Overview KPI Data
      ↓
OverviewKPIs
      ↓
Data Formatting
      ↓
KPI Cards
      ↓
User Interface
```

The component does not perform API requests itself.

This keeps the component focused on presentation and data formatting.

---

# 5. KPI Cards

## 5.1 Total Waste Collected

The first card displays the total amount of waste collected.

The backend value is expected to be provided in kilograms.

The component automatically determines whether the value should be displayed in kilograms or tons.

### Conversion Rule

If the waste value is less than `1000 KG`:

```text
Display → KG
```

If the waste value is greater than or equal to `1000 KG`:

```text
Display → TON / TONS
```

The conversion is:

```text
Tons = Kilograms / 1000
```

### Examples

```text
850 KG
↓
850.00 KG
```

```text
1000 KG
↓
1.00 TON
```

```text
8106.79 KG
↓
8.11 TONS
```

### Implementation

The component contains a local helper function:

```js
const formatWaste = (value) => {
  const kg = Number(value) || 0;

  if (kg >= 1000) {
    const tons = kg / 1000;

    return {
      value: tons.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      unit: tons === 1 ? "TON" : "TONS",
    };
  }

  return {
    value: kg.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    unit: "KG",
  };
};
```

The function also ensures that the displayed value always contains two decimal places.

---

# 6. Collection Points

The second KPI card displays the total number of collection points.

The value comes from:

```js
data.collectionPoints
```

It is converted into a JavaScript number and formatted using:

```js
Number(data.collectionPoints).toLocaleString()
```

This allows large values to be displayed with thousands separators.

For example:

```text
1000 → 1,000
10000 → 10,000
100000 → 100,000
```

No unit is displayed for this KPI because the value represents a count.

---

# 7. Total Citizens

The third KPI card displays the total number of citizens registered in the system.

The value comes from:

```js
data.totalCitizens
```

It is formatted using:

```js
Number(data.totalCitizens).toLocaleString()
```

For example:

```text
1250 → 1,250
```

The KPI uses the `Users` icon from `lucide-react`.

---

# 8. Citizens Trend

The fourth card is different from the first three KPI cards.

Instead of displaying a single statistic, it provides a breakdown of citizen participation.

It displays:

* Trash Given
* Not Given

Each category includes:

* Number of citizens
* Percentage of total citizens

---

# 9. Trash Given Percentage

The percentage of citizens who gave waste is calculated using:

```text
Trash Given Percentage =
(Trash Given / Total Citizens) × 100
```

The implementation checks whether the total citizen count is greater than zero before performing the calculation.

```js
const trashGivenPercentage =
  data.totalCitizens > 0
    ? ((data.trashGiven / data.totalCitizens) * 100).toFixed(1)
    : "0.0";
```

The result is displayed with one decimal place.

Example:

```text
Total Citizens = 1000
Trash Given = 750

Percentage =
(750 / 1000) × 100
= 75.0%
```

---

# 10. Not Given Percentage

The percentage of citizens who did not give waste is calculated using:

```text
Not Given Percentage =
(Not Given / Total Citizens) × 100
```

Implementation:

```js
const notGivenPercentage =
  data.totalCitizens > 0
    ? ((data.notGiven / data.totalCitizens) * 100).toFixed(1)
    : "0.0";
```

Example:

```text
Total Citizens = 1000
Not Given = 250

Percentage =
(250 / 1000) × 100
= 25.0%
```

---

# 11. Division-by-Zero Protection

The component prevents division by zero when calculating citizen percentages.

If:

```text
totalCitizens = 0
```

both percentages are displayed as:

```text
0.0%
```

This prevents invalid values such as:

```text
NaN%
Infinity%
```

from appearing in the dashboard.

---

# 12. KPI Data Preparation

The component uses `useMemo()` to prepare the KPI information.

```js
const kpis = useMemo(() => {
  if (!data) return [];

  const waste = formatWaste(data.totalWasteCollected);

  return [
    ...
  ];
}, [data]);
```

The dependency array contains:

```js
[data]
```

Therefore, the KPI data is recalculated when the `data` prop changes.

This keeps the KPI preparation tied to the actual input data.

---

# 13. Handling Missing Data

The component contains two levels of protection.

First:

```js
if (!data) return [];
```

inside the `useMemo()` calculation.

Second:

```js
if (!data) return null;
```

before rendering.

Therefore, if the parent component has not yet supplied KPI data, the component does not attempt to render incomplete KPI information.

---

# 14. Icons

The component uses icons from `lucide-react`.

Imported icons:

```js
import {
  Trash2,
  MapPinned,
  Users,
  User
} from "lucide-react";
```

### Icon Mapping

| KPI                   | Icon        |
| --------------------- | ----------- |
| Total Waste Collected | `Trash2`    |
| Collection Points     | `MapPinned` |
| Total Citizens        | `Users`     |
| Trash Given           | `User`      |
| Not Given             | `User`      |

The Trash Given and Not Given rows use the same `User` icon but with different colors.

---

# 15. Color Coding

The component uses different visual colors to distinguish the KPI categories.

### Total Waste Collected

```text
Icon: Pink
Background: Light Pink
```

### Collection Points

```text
Icon: Violet
Background: Light Violet
```

### Total Citizens

```text
Icon: Violet
Background: Light Violet
```

### Trash Given

```text
Icon: Green
Value: Green
```

### Not Given

```text
Icon: Orange
Value: Orange
```

The colors provide visual differentiation without changing the underlying data.

---

# 16. UI Layout

The component uses a four-column CSS grid:

```jsx
<div className="grid grid-cols-4 gap-6">
```

The layout therefore places the four KPI sections horizontally.

Conceptually:

```text
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ Total Waste      │ │ Collection       │ │ Total Citizens   │ │ Citizens Trend   │
│ Collected        │ │ Points           │ │                  │ │                  │
│                  │ │                  │ │                  │ │ Trash Given      │
│ 8.11 TONS        │ │ 1,250           │ │ 10,500           │ │ 8,000 (76.2%)    │
│                  │ │                  │ │                  │ │                  │
│                  │ │                  │ │                  │ │ Not Given        │
│                  │ │                  │ │                  │ │ 2,500 (23.8%)    │
└──────────────────┘ └──────────────────┘ └──────────────────┘ └──────────────────┘
```

---

# 17. Card Styling

Each KPI card has:

```text
Height: 110px
Border radius: 22px
White background
Light border
Horizontal padding
Subtle shadow
```

The main card class includes:

```text
bg-white
h-[110px]
rounded-[22px]
border
border-[#EEF1F6]
px-7
shadow-[0_4px_12px_rgba(15,23,42,0.04)]
```

The styling is implemented using Tailwind CSS.

---

# 18. GSAP Animation

The component uses GSAP to animate the KPI cards when they are mounted.

The animation is created inside:

```js
useEffect(() => {
  gsap.fromTo(...)
}, []);
```

Each card initially has:

```text
Opacity: 0
Y position: 28px
Scale: 0.94
Blur: 8px
```

The final state is:

```text
Opacity: 1
Y position: 0
Scale: 1
Blur: 0
```

Animation settings:

```text
Duration: 0.85 seconds
Stagger: 0.1 seconds
Easing: power3.out
```

The stagger causes each KPI card to appear slightly after the previous card.

---

# 19. DOM References

The component uses:

```js
const cardsRef = useRef([]);
```

Each rendered card is assigned to an index in the reference array:

```js
ref={(el) => (cardsRef.current[index] = el)}
```

The fourth card is assigned manually:

```js
ref={(el) => (cardsRef.current[3] = el)}
```

GSAP then uses these DOM references to animate the cards.

---

# 20. Dependencies

The component uses the following libraries:

### React

Used for:

* `useEffect`
* `useMemo`
* `useRef`

### Lucide React

Used for the KPI icons.

### GSAP

Used for entrance animations.

---

# 21. Component Lifecycle

The basic lifecycle is:

```text
Component Mounts
      ↓
GSAP animation starts
      ↓
Data is received
      ↓
KPI values are formatted
      ↓
Citizen percentages are calculated
      ↓
Cards are rendered
      ↓
User views dashboard
```

If the `data` prop changes, the memoized KPI data is recalculated.

---

# 22. Important Implementation Notes

* Backend waste values are assumed to be in KG.
* Waste values are converted to tons only when they reach 1000 KG.
* Waste values are displayed with two decimal places.
* Collection points and citizen counts use `toLocaleString()`.
* Citizen percentages use one decimal place.
* Division by zero is handled.
* Missing `data` results in no rendered component.
* KPI data preparation is memoized with `useMemo()`.
* The component does not make API calls.
* GSAP handles only the visual entrance animation.
* Tailwind CSS handles the layout and styling.
* `lucide-react` provides the icons.

---

# 23. Summary

`OverviewKPIs` acts as the **high-level statistical summary section** of the Overview page.

It transforms raw dashboard statistics into four easily readable cards:

```text
Total Waste Collected
        +
Collection Points
        +
Total Citizens
        +
Citizens Trend
```

This allows dashboard users to immediately understand the overall waste collection activity, collection infrastructure, citizen count, and citizen participation without navigating to detailed sections.
