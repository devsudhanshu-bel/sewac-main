# OverviewKPIs Component Documentation

## File
`src/components/overview/OverviewKPIs.jsx`

## Purpose
`OverviewKPIs` displays the high-level KPI cards at the top of the Overview dashboard.

## Input
```jsx
<OverviewKPIs data={overviewData?.summary} />
```

The component receives summary data through the `data` prop.

## KPI Values
The component calculates and displays:
```text
Total Waste Collected
Collection Points
Total Citizens
Citizen Waste-Giving Trend
```

The exact labels/icons are defined through the KPI configuration inside the component.

## Safe Data
The incoming object is normalized with safe/default values so missing backend properties do not break the dashboard.

Numeric values are converted using `Number(...)` with zero fallbacks.

## Waste Formatting
Waste values are converted from kilograms to tons when the value reaches the relevant threshold. The displayed value is formatted for dashboard readability.

## Citizen Percentages
The component derives:
```text
Trash Given %
Trash Not Given %
```

from the total citizen count.

The calculation protects against division by zero.

## Animation
GSAP is used for KPI card animations. Refs are maintained for the KPI card elements so numerical values/cards can animate when the component renders or updates.

## Localization
The component uses the language context for the displayed KPI labels.

## Summary
`OverviewKPIs.jsx` is a presentation component. It does not fetch data itself; it receives the summary from `Overview.jsx`, normalizes it, calculates display values, and renders the animated KPI cards.
