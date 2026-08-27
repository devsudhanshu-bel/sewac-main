# Dashboard.jsx Documentation

## 1. File Overview

The `Dashboard` component provides the CMADS Security Dashboard.

It displays counts for:

```text
Registered Devices
Behavior Records
Risk Events
```

Data is loaded through the dashboard service.

## 2. Dashboard Service Functions

The component imports:

```text
getDevices
getBehaviorHistory
getRiskHistory
```

from:

```text
dashboardService
```

## 3. Component State

Three state variables are maintained:

```text
devices
behavior
risk
```

All are initialized as empty arrays.

## 4. Dashboard Loading

When the component mounts, `useEffect()` calls:

```text
loadDashboard()
```

## 5. loadDashboard()

The function performs three asynchronous operations:

```text
getDevices()
getBehaviorHistory()
getRiskHistory()
```

The results are stored in the corresponding state variables.

## 6. Device Data

The devices state is populated from:

```text
devicesData.devices
```

If no devices array is returned:

```text
[]
```

is used.

## 7. Behavior Data

The behavior state is populated from:

```text
behaviorData.history
```

with an empty array as the fallback.

## 8. Risk Data

The risk state is populated from:

```text
riskData.history
```

with an empty array as the fallback.

## 9. Error Handling

If dashboard loading fails, the error is logged using:

```text
console.error(error)
```

No dedicated error message is rendered by the component.

## 10. Dashboard Cards

Three cards are displayed.

### Registered Devices

The value is:

```text
devices.length
```

### Behavior Records

The value is:

```text
behavior.length
```

### Risk Events

The value is:

```text
risk.length
```

## 11. UI Structure

```text
Dashboard
   ↓
Title: CMADS Security Dashboard
   ↓
Three Metric Cards
   ├── Registered Devices
   ├── Behavior Records
   └── Risk Events
```

## 12. Styling

The component uses Tailwind CSS classes for:

```text
dark background
white text
responsive layout
rounded cards
spacing
typography
```

## 13. Export

The component is exported as:

```text
export default Dashboard
```

## 14. Summary

`Dashboard.jsx` provides a concise CMADS security overview by retrieving device, behavior-history, and risk-history data from the dashboard service and displaying their respective record counts.
