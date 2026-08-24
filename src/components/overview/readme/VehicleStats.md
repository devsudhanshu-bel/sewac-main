# VehicleStats Component Documentation

## File
`src/components/overview/VehicleStats.jsx`

## Purpose
`VehicleStats` displays vehicle-status statistics and the vehicle-related waste-generation trend in the Overview dashboard.

## Inputs
```jsx
<VehicleStats
  vehicleData={...}
  trendData={...}
/>
```

### `vehicleData`
Contains vehicle summary values.

### `trendData`
Contains the generation trend used for the chart.

## Vehicle KPIs
The component derives:
```text
Total Vehicles
Running Vehicles
Inactive Vehicles
```

It also calculates the corresponding running/inactive percentages.

## Safe Data
Incoming vehicle data is normalized so missing or invalid numeric values become safe dashboard values.

## Trend Data
The trend data is converted into chart-ready records.

Waste-generation values are converted from kilograms to tons for display.

## Chart
The component uses the charting configuration present in the current implementation and provides a custom tooltip for trend values.

## Animation
GSAP is used to animate the vehicle statistic cards.

Refs are maintained for:
```text
section
left card
right card
stat cards
```

## Localization
Displayed labels are obtained through the language context.

## Summary
`VehicleStats.jsx` is a presentation/visualization component. `Overview.jsx` supplies vehicle and trend data; `VehicleStats` calculates display statistics, animates the cards, and renders the generation trend.
