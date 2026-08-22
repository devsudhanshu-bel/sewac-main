# CityOverviewMap.jsx Documentation

## 1. File Overview

### File Name
`CityOverviewMap.jsx`

### File Location
`src/components/overview/CityOverviewMap.jsx`

### Purpose

`CityOverviewMap` is the interactive map component used in the SEWAC Overview page.

It combines Leaflet map rendering with SEWAC backend APIs to display the Bengaluru/city geographic hierarchy, including zones, divisions, wards, and plant-related information.

It also provides map controls and overlays for related Overview information.

---

## 2. Main Technologies

The component uses:

```text
React
React Leaflet
Leaflet
Lucide React
createPortal
```

Important React hooks include:

```text
useState
useEffect
useMemo
useRef
useCallback
useLayoutEffect
```

---

## 3. Backend Configuration

The API base URL is obtained from:

```js
import.meta.env.VITE_API_BASE_URL
```

with a local fallback:

```text
http://localhost:5002
```

The component defines these city-map endpoints:

```text
/api/master-citizen/map/city/:cityId
/api/master-citizen/map/zone/:zoneTableName/divisions
/api/master-citizen/map/division/:divisionTableName/wards
```

---

## 4. Plants Endpoint

The component also defines:

```text
/api/plants
```

This is used to retrieve Plant information displayed in relation to the map.

---

## 5. Default City

The default city ID is:

```js
const DEFAULT_CITY_ID = 1;
```

This is used when no specific city selection is supplied to the map logic.

---

## 6. Geographic Hierarchy

The map follows the hierarchy:

```text
City
  ↓
Zone
  ↓
Division
  ↓
Ward
```

The component loads the appropriate lower-level geographic information as the user interacts with the map.

---

## 7. GeoJSON Rendering

The component imports:

```js
GeoJSON
```

from React Leaflet.

GeoJSON is used to render geographic boundaries for the city hierarchy.

Different colors are assigned to:

```text
Zones
Divisions
Wards
```

through the configured color arrays.

---

## 8. Zone Colors

The component defines:

```text
ZONE_COLORS
```

These colors are used to visually distinguish zone boundaries.

---

## 9. Division Colors

The component defines:

```text
DIVISION_COLORS
```

These colors allow different divisions to be visually distinguished on the map.

---

## 10. Ward Colors

The component defines:

```text
WARD_COLORS
```

These colors are used when rendering ward-level boundaries.

---

## 11. Leaflet Components

The component uses:

```text
MapContainer
TileLayer
GeoJSON
ZoomControl
Pane
useMap
```

### MapContainer

Provides the main interactive Leaflet map.

### TileLayer

Provides the underlying map tiles.

### GeoJSON

Displays geographic boundaries.

### ZoomControl

Provides map zoom controls.

### Pane

Controls the visual layer ordering.

### useMap

Allows nested map logic to access the Leaflet map instance.

---

## 12. Additional UI Icons

The component uses Lucide icons including:

```text
ChevronDown
ChevronUp
Map
Route
RotateCcw
MapPinned
Factory
MessageSquareWarning
```

These support map controls and related map actions.

---

## 13. createPortal

The component imports:

```js
createPortal
```

from React DOM.

This is used when map-related UI needs to be rendered into a different DOM location while remaining controlled by the React component.

---

## 14. Plants Integration

The component imports:

```js
import Plants from "../plants/Plants";
```

This connects the Overview map with Plant-related UI/data.

---

## 15. Customer Complaint Integration

The component imports:

```js
import CustomerGrev from "./CustomerGrev";
```

This allows customer complaint/geographical complaint information to be integrated into the Overview map experience.

---

## 16. Map Interaction

The component maintains map-related state and references to support:

```text
Loading map data
Switching geographic levels
Displaying boundaries
Refreshing map information
Opening map overlays
Resetting map state
```

---

## 17. API Flow

The general map data flow is:

```text
Overview Page
      ↓
CityOverviewMap
      ↓
City Map API
      ↓
Zone/Division/Ward APIs
      ↓
GeoJSON Data
      ↓
Leaflet Map
```

---

## 18. Plant Map Flow

```text
CityOverviewMap
      ↓
/api/plants
      ↓
Plant Data
      ↓
Map / Plant Overlay
```

---

## 19. Map Styling

The component uses Leaflet styles through:

```js
import "leaflet/dist/leaflet.css";
```

Custom colors are applied to GeoJSON layers to make different administrative levels visually distinct.

---

## 20. Overall Responsibility

`CityOverviewMap.jsx` is responsible for:

- Rendering the Overview geographic map.
- Loading city map information.
- Loading division information.
- Loading ward information.
- Rendering GeoJSON boundaries.
- Providing map controls.
- Displaying plant-related information.
- Integrating complaint map information.
- Managing map state and interactions.

---

## 21. Summary

`CityOverviewMap.jsx` is the main geographic visualization component of the Overview module.

It connects the React frontend to the Master Citizen map APIs and converts geographic backend data into an interactive Leaflet/GeoJSON visualization.
