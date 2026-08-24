# AverageWeightChart.jsx Component Documentation

## 1. File Overview

**File:** `AverageWeightChart.jsx`  
**Location:** `src/components/vehicles/AverageWeightChart.jsx`

`AverageWeightChart` displays a line-chart visualization comparing waste generated with the vehicle-related values configured in the component.

---

## 2. Chart Library

The component uses:

```text
Recharts
```

including:

```text
ResponsiveContainer
LineChart
Line
XAxis
YAxis
CartesianGrid
Tooltip
ReferenceLine
```

---

## 3. Local Dataset

The current implementation uses a local `chartData` array.

The data contains entries for:

```text
City Corporation (West)
West Corporation
North Corporation
Central/City Corporation
East Corporation
South Corporation
```

Each record contains:

```text
zone
waste
vehicles
```

---

## 4. Threshold

The component defines:

```js
const THRESHOLD = 70;
```

The threshold is used as a reference line in the chart.

---

## 5. Chart Metrics

The chart uses:

```text
Waste Generated
Vehicles Running
```

and compares values against the threshold where applicable.

---

## 6. Custom X-Axis

A custom X-axis tick component is used to prevent long zone labels from overlapping.

The labels are converted into controlled line breaks such as:

```text
City
Corporation
(West)
```

---

## 7. Custom Tooltip

The component defines a custom tooltip for displaying detailed values when the user interacts with the chart.

The tooltip uses translated labels including:

```text
Zone Name
Vehicles Running
Difference
Over Threshold
Below Threshold
Average Waste
```

---

## 8. Language Support

The component uses:

```js
useLanguage()
```

and translation keys under:

```text
vehicles.averageWeightChart.*
```

---

## 9. View By

The UI includes a `View By` control with the current chart context supporting:

```text
City
```

---

## 10. Visualization

The chart uses a responsive container so it can adapt to the available page width.

The chart includes:

```text
Grid
X-axis
Y-axis
Line(s)
Reference threshold
Tooltip
Legend
```

---

## 11. Important Implementation Detail

The current `AverageWeightChart.jsx` contains its chart dataset locally.

It does **not** make an API request in the current implementation.

Therefore, the values displayed by this component are not directly fetched from `/api/vehicles/summary`.

---

## 12. Summary

`AverageWeightChart.jsx` is the analytical chart component on the Vehicles page. It currently uses local zone-level data, a threshold of `70`, Recharts, custom axis labels, a custom tooltip, and multilingual labels.
