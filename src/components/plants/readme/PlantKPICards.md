# PlantKPICards Component Documentation

## File
`src/components/plants/PlantKPICards.jsx`

## Purpose
`PlantKPICards` presents the high-level Plant dashboard metrics.

## Input
```jsx
<PlantKPICards data={dashboardData} />
```

The KPI definitions are derived from the dashboard `data` prop.

## Rendering
The component maps the KPI configuration into cards and renders the associated icon and value.

## Responsibility
The component is presentation-focused:
```text
Plants.jsx
   ↓
dashboardData
   ↓
PlantKPICards
   ↓
KPI cards
```

It does not perform the dashboard API request itself.

## Summary
`PlantKPICards.jsx` is the reusable Plant KPI display component.
