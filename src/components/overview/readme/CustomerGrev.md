# CustomerGrev.jsx Documentation

## 1. File Overview

### File Name
`CustomerGrev.jsx`

### File Location
`src/components/overview/CustomerGrev.jsx`

### Purpose

`CustomerGrev` displays customer complaint locations on an interactive Leaflet map.

It retrieves complaint location data from the backend and places complaint markers on the Bengaluru map.

---

## 2. Backend Endpoint

The component uses:

```text
/api/complaints-grev/locations
```

The base URL is taken from:

```js
VITE_API_BASE_URL
```

or:

```js
VITE_BACKEND_URL
```

with the deployed backend as the final fallback.

---

## 3. Main Technologies

The component uses:

```text
React
React Leaflet
Leaflet
```

React hooks used include:

```text
useEffect
useState
```

---

## 4. Map Components

The component uses:

```text
MapContainer
TileLayer
Marker
Popup
useMap
```

### MapContainer

Creates the interactive Leaflet map.

### TileLayer

Displays the base map.

### Marker

Displays individual complaint locations.

### Popup

Displays complaint details when a marker is selected.

### useMap

Provides access to the Leaflet map instance.

---

## 5. Bengaluru Boundary

The component defines:

```js
BENGALURU_BOUNDS
```

using:

```text
South-West: 12.83, 77.40
North-East: 13.15, 77.80
```

This boundary is used to:

- Remove complaints outside Bengaluru.
- Keep the map focused around Bengaluru.
- Prevent unnecessary map movement outside the intended area.

---

## 6. Default Map Position

The default map center is:

```text
12.9715987
77.5945627
```

which represents Bengaluru.

---

## 7. Complaint Categories

The component maps complaint category codes to readable labels.

Supported categories include:

```text
MISSED_COLLECTION
OVERFLOWING_BIN
ILLEGAL_DUMPING
STREET_LITTER
DAMAGED_BIN
OTHER
```

The labels displayed to users are:

```text
Missed Collection
Overflowing Bin
Illegal Dumping
Street Litter
Damaged Bin
Other
```

---

## 8. Complaint Status Styles

The component defines styling for complaint statuses:

```text
PENDING
ASSIGNED
IN_PROGRESS
READY_FOR_VERIFICATION
OTP_SENT
CLOSED
```

These styles allow complaint state information to be displayed consistently.

---

## 9. Data Fetching

The component uses `useEffect` to request complaint locations from the backend.

The general flow is:

```text
Component Mount
      ↓
Fetch Complaint Locations
      ↓
Backend API
      ↓
Complaint Location Data
      ↓
Filter Geographic Data
      ↓
Render Markers
```

---

## 10. Geographic Filtering

Complaint records are checked against the Bengaluru map bounds.

Locations outside the configured boundary are removed before marker rendering.

This prevents invalid or unrelated coordinates from appearing on the Overview map.

---

## 11. Complaint Markers

Each valid complaint location is represented by a Leaflet marker.

Selecting a marker opens a popup containing complaint-related information.

---

## 12. Map Bounds

The Bengaluru bounds also help keep the map focused on the intended operating region.

The component uses Leaflet's map functionality to manage the displayed geographic area.

---

## 13. Complaint Data Flow

```text
SEWAC Backend
      ↓
/api/complaints-grev/locations
      ↓
CustomerGrev.jsx
      ↓
Validate Coordinates
      ↓
Bengaluru Boundary Filter
      ↓
Leaflet Markers
      ↓
Complaint Popups
```

---

## 14. Error/Loading Handling

The component maintains React state for fetched complaint data and performs the API request inside an effect.

The UI is therefore driven by the latest backend complaint-location result available to the component.

---

## 15. Integration With Overview

`CustomerGrev` is imported by:

```text
CityOverviewMap.jsx
```

This makes complaint locations part of the Overview map experience.

The relationship is:

```text
Overview
   ↓
CityOverviewMap
   ↓
CustomerGrev
   ↓
Complaint Locations
```

---

## 16. Summary

`CustomerGrev.jsx` provides a geographical visualization of customer complaints.

Its main responsibilities are:

- Fetch complaint locations.
- Filter locations to Bengaluru.
- Render complaint markers.
- Display complaint information in popups.
- Provide complaint category/status information.
- Integrate complaint visualization with the Overview map.
