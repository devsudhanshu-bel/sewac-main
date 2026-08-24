# OverspeedingIncidents.jsx Component Documentation

## 1. File Overview

**File:** `OverspeedingIncidents.jsx`  
**Location:** `src/components/vehicles/OverspeedingIncidents.jsx`

`OverspeedingIncidents` is a vehicle overspeeding incident visualization component.

---

## 2. Current Data Source

The current implementation uses a local:

```js
incidents
```

array.

The component does **not** make an API request.

---

## 3. Incident Information

The local incident records contain:

```text
id
vehicleId
vehicleNo
driver
date
mainRoad
crossRoad
speed
limit
excess
status
```

---

## 4. Incident Table

The component displays incident information including:

```text
Vehicle
Driver
Date/Time
Road
Speed
Speed Limit
Excess
Status
```

---

## 5. Status

The current incidents use:

```text
Over Limit
```

as the incident status.

---

## 6. Speed Information

Each record stores:

```text
speed
limit
excess
```

For example:

```text
Speed: 78
Limit: 50
Excess: 28
```

---

## 7. Status Badge

A reusable `StatusBadge` function displays the incident status.

The component uses:

```text
AlertTriangle
ChevronDown
```

from Lucide React.

---

## 8. Important Implementation Detail

Although the component represents vehicle overspeeding information, the current implementation is **dummy/static data**.

There is no backend request in the current file.

Therefore, it should not be described as a live telemetry API component unless the implementation is later changed.

---

## 9. Summary

`OverspeedingIncidents.jsx` is a presentational overspeeding-incidents component using local dummy data. It displays vehicle, driver, road, speed, limit, excess speed, and status information.
