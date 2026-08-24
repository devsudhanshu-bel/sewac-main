# WasteGenMap.jsx Documentation

## 1. File Overview

**File:** `WasteGenMap.jsx`  
**Location:** `src/components/waste-generators/WasteGenMap.jsx`

`WasteGenMap` is the telemetry map component for the Waste Generators page.

It combines:

```text
Ward boundary
Vehicle telemetry coordinates
GVP telemetry points
```

on a Leaflet map.

---

## 2. Props

```js
{
  selectedDate
}
```

The selected date controls which daily telemetry data is requested.

The geographic selection is obtained from:

```js
useFilters()
```

---

## 3. Map Technology

The component uses:

```text
Leaflet
React Leaflet
Carto Light tiles
GeoJSON
```

Imported React Leaflet elements include:

```text
CircleMarker
GeoJSON
MapContainer
TileLayer
Tooltip
ZoomControl
useMap
```

---

## 4. Default Map

Default center:

```text
12.9716, 77.5946
```

which represents Bengaluru.

Default zoom:

```text
11
```

---

## 5. Backend API

The map requests:

```text
GET /api/waste-generators/map
```

The request is based on the selected date and geographic filter state.

---

## 6. Filter Context

The component uses:

```js
useFilters()
```

to access:

```text
selectedCity
selectedZone
selectedDivision
selectedWard
```

The map therefore follows the selected administrative scope.

---

## 7. GeoJSON Boundary Handling

The component contains helpers for:

```text
Coordinate-pair detection
Coordinate reversal
Geometry normalization
```

It supports:

```text
Polygon
MultiPolygon
```

boundaries.

This is necessary because GeoJSON coordinates are represented as:

```text
[longitude, latitude]
```

while Leaflet expects:

```text
[latitude, longitude]
```

---

## 8. Telemetry Points

Vehicle telemetry is displayed using white-bordered green:

```text
CircleMarker
```

Each point can show:

```text
Collection Vehicle
Source Vehicle Table
IoT Timestamp
Coordinates
Ward
```

in its tooltip.

---

## 9. GVP Points

GVP telemetry points are displayed separately using red:

```text
CircleMarker
```

The GVP tooltip can show:

```text
GVP Point
Vehicle
Table
IoT Timestamp
Unit
Remarks
GVP waste
Coordinates
Ward
```

---

## 10. Map Summary

When telemetry exists, the map displays a summary containing:

```text
Number of visible telemetry coordinates
Number of vehicle tables
Number of GVP points
```

---

## 11. Loading State

While the map API is loading, an overlay displays:

```text
Loading daily vehicle telemetry...
```

The overlay prevents pointer interaction while loading.

---

## 12. No Ward State

If no ward is selected, the map displays:

```text
Select a ward
```

with the instruction to choose:

```text
City
Zone
Division
Ward
```

from the Header.

---

## 13. Error State

When the map request fails, the component displays:

```text
Map unavailable
```

along with the error message.

---

## 14. No Boundary State

If a ward is selected but no boundary is available, the component displays:

```text
Ward boundary unavailable for this selection
```

---

## 15. No Telemetry State

If no telemetry points are available for the selected date:

```text
No telemetry points for this date
```

is displayed.

---

## 16. Map Rendering Flow

```text
Header Filters + Date
        ↓
WasteGenMap
        ↓
/api/waste-generators/map
        ↓
Normalize Boundary
        ↓
Normalize Telemetry
        ↓
Leaflet Map
   ├── Ward Boundary
   ├── Vehicle Points
   └── GVP Points
```

---

## 17. Animation / Map Behavior

The component uses GSAP and Leaflet map helpers to manage map presentation and map-related transitions.

The map can fit its view to available geographic data rather than relying only on the default Bengaluru center.

---

## 18. Summary

`WasteGenMap.jsx` is the spatial monitoring component of the Waste Generators page. It combines the selected ward boundary with daily vehicle and GVP telemetry and provides detailed tooltips and loading/empty/error states.
