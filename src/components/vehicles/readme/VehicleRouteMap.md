# VehicleRouteMap.jsx Component Documentation

## 1. File Overview

**File:** `VehicleRouteMap.jsx`  
**Location:** `src/components/vehicles/VehicleRouteMap.jsx`

`VehicleRouteMap` displays vehicle routes on an interactive map using React Leaflet and OpenStreetMap-compatible map tiles.

The component uses OSRM to calculate vehicle routes.

---

## 2. Mapping Libraries

The component uses:

```text
react-leaflet
leaflet
leaflet.css
```

Map components include:

```text
MapContainer
TileLayer
Marker
Popup
Polyline
ZoomControl
useMap
```

---

## 3. Initial Map

The default map center is:

```text
12.9716, 77.5946
```

which corresponds to the Bengaluru area.

The initial zoom is:

```text
12
```

---

## 4. OSRM Routing

The component sends routing requests to:

```text
https://router.project-osrm.org/route/v1/driving/
```

The route is calculated using:

```text
driving
```

profile.

The request uses vehicle coordinates and a depot destination.

---

## 5. Route State

The component maintains:

```text
routes
loading
error
```

---

## 6. Route Data

Each route contains information used by the map such as:

```text
id
driver
status
distance
duration
geometry
color
```

---

## 7. Active Vehicles

The component derives:

```js
activeVehicles
```

by filtering routes where:

```text
status === "active"
```

---

## 8. Inactive Vehicles

The component derives:

```js
inactiveVehicles
```

where:

```text
status === "inactive"
```

---

## 9. Total Distance

The total route distance is calculated by summing:

```text
vehicle.distance
```

for all routes.

Distance is displayed in kilometers.

Example format:

```text
12.4 km
```

---

## 10. Total Duration

The total route duration is calculated from:

```text
vehicle.duration
```

The component formats durations as:

```text
2h 15m
```

or:

```text
45 min
```

---

## 11. Depot

The map contains a depot marker representing:

```text
BBMP Depot
```

The popup displays:

```text
Status: Operational
Total Vehicles
```

---

## 12. Collection Points

The component contains a predefined set of collection-point coordinates.

Each point is displayed as a marker.

The popup identifies:

```text
Collection Point 1
Collection Point 2
...
```

and describes it as a:

```text
Waste Collection Zone
```

---

## 13. Vehicle Markers

Every vehicle with route geometry receives a marker.

The marker position is taken from the current first geometry coordinate.

The icon changes according to:

```text
active → active truck icon
inactive → inactive truck icon
```

---

## 14. Vehicle Popup

Vehicle popups display:

```text
Vehicle ID
Driver
Status
Distance
ETA
```

---

## 15. Route Polylines

Every vehicle route is rendered using:

```text
Polyline
```

The geometry coordinates are converted from:

```text
[longitude, latitude]
```

to:

```text
[latitude, longitude]
```

for Leaflet.

---

## 16. Route Popup

Clicking a route displays:

```text
Vehicle ID Route
Driver
Route Distance
Estimated Time
Vehicle Status
```

---

## 17. Fit Bounds

`FitBounds` uses Leaflet's:

```js
map.fitBounds()
```

to automatically adjust the map to the route geometry.

Padding is applied so routes do not touch the map edges.

---

## 18. Loading State

While routes are being fetched, the component displays:

```text
Loading Routes
Fetching routes from OSRM...
```

with a spinner.

---

## 19. Error State

If the OSRM request fails, the component displays:

```text
Failed to Load Routes
```

along with the error message.

---

## 20. Map Legend

The map legend identifies:

```text
Active Vehicle
Inactive Vehicle
Route
Collection Point
Depot
```

---

## 21. Route Summary Badges

The header displays:

```text
[number] Vehicles
[number] Active
[total distance]
```

---

## 22. Component Flow

```text
VehicleRouteMap
      ↓
Vehicle Route Data
      ↓
OSRM
      ↓
Route Geometry
      ↓
Map
 ├── Depot
 ├── Collection Points
 ├── Vehicle Markers
 └── Route Polylines
```

---

## 23. Summary

`VehicleRouteMap.jsx` is the live-style route visualization component of the Vehicles page. It calculates driving routes through OSRM, renders them with Leaflet, shows vehicle/depot/collection markers, provides route popups, automatically fits map bounds, and displays loading/error states.
