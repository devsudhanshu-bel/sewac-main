# Vehicles.jsx Page Documentation

## 1. File Overview

**File:** `Vehicles.jsx`  
**Location:** `src/pages/Vehicles.jsx`

`Vehicles` is the main vehicle-management and vehicle-monitoring page in the SEWAC admin frontend.

The page combines:

```text
Vehicle KPI Cards
Vehicle Route Map
Average Weight Chart
Telemetry Directory
```

---

## 2. Imports

The page imports:

```js
useEffect
useState
api
Header
KPICards
VehicleRouteMap
AverageWeightChart
TelemetryDirectory
```

---

## 3. Vehicle Summary State

The page maintains:

```js
const [summary, setSummary] = useState({
  totalVehicles: 0,
  activeVehicles: 0,
  inactiveVehicles: 0,
  averageWeightPerVehicle: 0,
});
```

The summary contains:

```text
totalVehicles
activeVehicles
inactiveVehicles
averageWeightPerVehicle
```

---

## 4. Vehicle Summary API

The page requests:

```text
GET /api/vehicles/summary
```

The response data is read from:

```js
res?.data?.data
```

If the response does not contain usable data, the component falls back to zero values.

---

## 5. Initial Loading

The summary request is triggered once when the page mounts:

```js
useEffect(() => {
  fetchSummary();
}, []);
```

---

## 6. Error Handling

If the summary request fails, the page logs:

```text
Vehicle Summary Error:
```

to the console.

The page does not display a dedicated error message in the current implementation.

The summary remains at its safe zero-value defaults.

---

## 7. Header

The page renders:

```jsx
<Header />
```

at the top.

---

## 8. KPI Cards

The summary is passed to:

```jsx
<KPICards summary={summary} />
```

This component displays the high-level vehicle statistics.

---

## 9. Vehicle Route Map

The page renders:

```jsx
<VehicleRouteMap />
```

The route map manages its own route data and OSRM requests.

---

## 10. Average Weight Chart

The page renders:

```jsx
<AverageWeightChart />
```

The chart currently manages its own chart dataset inside the component.

---

## 11. Telemetry Directory

The page renders:

```jsx
<TelemetryDirectory />
```

This component handles vehicle listing, search, status filtering, pagination, CSV download, and vehicle CRUD modals.

---

## 12. Page Structure

```text
Vehicles.jsx
    │
    ├── Header
    │
    ├── KPICards
    │
    ├── VehicleRouteMap
    │
    ├── AverageWeightChart
    │
    └── TelemetryDirectory
```

---

## 13. Data Flow

```text
Vehicles.jsx
     │
     ├── GET /api/vehicles/summary
     │          ↓
     │       summary
     │          ↓
     │      KPICards
     │
     ├── VehicleRouteMap
     │          ↓
     │       OSRM routes
     │
     ├── AverageWeightChart
     │          ↓
     │       local chart data
     │
     └── TelemetryDirectory
                ↓
          GET /api/vehicles
```

---

## 14. Layout

The page uses a responsive vertical layout with:

```text
full-width sections
responsive horizontal padding
vertical spacing
scrollable page body
```

The page background is:

```text
#F8F9FD
```

---

## 15. Summary

`Vehicles.jsx` is the parent page that brings together the vehicle analytics and management features.

It is responsible for:

- Fetching the vehicle summary.
- Passing summary data to `KPICards`.
- Rendering the route map.
- Rendering the average-weight chart.
- Rendering the telemetry directory.
- Providing the common page Header.
