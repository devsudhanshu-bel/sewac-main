# Overview.jsx Page Documentation

## 1. File Overview

**File:** `Overview.jsx`  
**Location:** `src/pages/Overview.jsx`

`Overview` is the main dashboard page for the SEWAC admin frontend.

It loads overview information based on the currently selected:

```text
Date
City
Zone
Division
Ward
```

and passes the returned data to the Overview visualization components.

---

## 2. Main Dependencies

The page imports:

```js
useEffect
useState
api
Header
OverviewKPIs
VehicleStats
CityOverviewMap
useFilters
```

---

## 3. State

The page maintains:

```text
overviewData
loading
error
selectedDate
```

### overviewData

Stores:

```text
summary
vehicleSummary
generationTrend
```

and, for no-data handling, can also contain:

```text
map
hasNoData
```

### loading

Controls the dashboard loading state.

### error

Stores a backend/server error message.

### selectedDate

Stores the date selected in the Header.

The initial value is the current date in:

```text
YYYY-MM-DD
```

format.

---

## 4. Filter Context

The page uses:

```js
useFilters()
```

to obtain:

```text
selectedCity
selectedZone
selectedDivision
selectedWard
```

The Overview request waits until all four cascading filters are available.

---

## 5. Overview API Requests

When the selected filters/date change, the page sends three requests in parallel:

```text
/api/admin/overview/summary
/api/admin/overview/vehicle-summary
/api/admin/overview/generation-trend
```

The first two use the complete:

```text
date
cityId
zoneId
divisionId
wardId
```

filter set.

---

## 6. Generation Trend Request

Generation Trend is intentionally division-wise.

Its request uses:

```text
date
cityId
zoneId
divisionId
```

and does **not** send:

```text
wardId
```

---

## 7. Parallel Request Flow

The page uses:

```js
Promise.all(...)
```

so the three Overview API requests are made together.

Conceptually:

```text
Selected Filters
      ↓
Overview.jsx
      ↓
┌──────────────┬──────────────────┬──────────────────┐
│ Summary API  │ Vehicle Summary  │ Generation Trend │
└──────────────┴──────────────────┴──────────────────┘
      ↓
Store Overview Data
```

---

## 8. No-Data Handling

The page detects a no-data condition when:

```text
totalWasteCollected === 0
collectionPoints === 0
generationTrend is empty
```

The page can then display:

```text
No Data Found
```

with the selected date.

---

## 9. Missing Day Table Handling

The page specifically handles PostgreSQL errors such as:

```text
42P01
relation does not exist
```

These can occur when the requested daily telemetry table does not exist.

Instead of treating this as a dashboard crash, the page converts it into a no-data state.

This allows the Header and filters to remain usable.

---

## 10. Real Error Handling

For other backend errors, the page stores the backend message in:

```js
error
```

The error is displayed below the Header rather than replacing the entire application layout.

---

## 11. Mounted Request Protection

The page uses:

```js
let mounted = true;
```

and cleans it up when the effect is destroyed.

This prevents state updates after the component is no longer mounted.

---

## 12. Header

The page always renders:

```jsx
<Header
  selectedDate={selectedDate}
  setSelectedDate={setSelectedDate}
/>
```

The Header therefore controls the selected date while the Overview page owns the selected-date state.

---

## 13. Loading UI

While loading, the page displays:

```text
Loading dashboard...
```

instead of the dashboard content.

---

## 14. Dashboard Components

When valid data is available, the page renders:

```text
OverviewKPIs
VehicleStats
CityOverviewMap
```

### OverviewKPIs

Receives:

```js
overviewData?.summary
```

### VehicleStats

Receives:

```text
vehicleSummary
generationTrend
```

### CityOverviewMap

Receives:

```js
overviewData?.map
```

---

## 15. Render Flow

```text
Header
  ↓
Loading?
  ├── Yes → Loading dashboard
  │
  └── No
       ↓
     Error?
       ├── Yes → Error message
       │
       └── No
            ↓
        No Data?
          ├── Yes → No Data Found
          │
          └── No → Dashboard
                    ├── OverviewKPIs
                    ├── VehicleStats
                    └── CityOverviewMap
```

---

## 16. Filter Refresh

The Overview API is reloaded whenever one of these changes:

```text
selectedDate
selectedCity
selectedZone
selectedDivision
selectedWard
```

This keeps the dashboard synchronized with the selected administrative scope.

---

## 17. Summary

`Overview.jsx` is the parent/container page for the SEWAC Overview dashboard.

It is responsible for:

- Managing the selected date.
- Reading cascading geographic filters.
- Fetching Overview data.
- Fetching vehicle summary data.
- Fetching generation trend data.
- Handling loading.
- Handling missing daily telemetry tables.
- Handling real backend errors.
- Passing data to child visualization components.
