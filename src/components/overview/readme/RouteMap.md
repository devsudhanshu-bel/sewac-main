# RouteMap Component Documentation

## File
`src/components/overview/RouteMap.jsx`

## Purpose
`RouteMap` renders vehicle/route information on a Leaflet map within the Overview map area.

## Inputs
```jsx
<RouteMap
  mapData={...}
  selectedDate={...}
  selectedCity={...}
  selectedZone={...}
  selectedDivision={...}
  selectedWard={...}
/>
```

## Map Data
The component reads route/vehicle information from `mapData`.

It normalizes GPS coordinates before attempting to display them.

## Geographic Boundary
The component determines the selected administrative boundary from:
```text
City
Zone
Division
Ward
```

GeoJSON boundary data is normalized and converted into Leaflet layers.

## Route Rendering
Routes are processed from the supplied map data. The component identifies route points, normalizes their coordinates, and uses those positions to construct the visible route/vehicle representation.

## Vehicle Markers
A Leaflet vehicle icon is defined for route/vehicle positions.

Vehicle information is associated with the route data so the map can represent moving/registered vehicles within the selected area.

## Map Fitting
When route points or a selected boundary are available, the map calculates bounds and focuses on the relevant area.

## Selected Boundary
The component derives a `boundaryKey` from the selected administrative scope. This prevents unrelated boundary data from being mixed with the currently selected geographic context.

## Responsive Map
Leaflet resize handling is included to keep the map correctly sized when its container changes.

## Summary
`RouteMap.jsx` is a map-only visualization component. It receives route data from the Overview page, normalizes GPS and boundary data, displays vehicle/route information, and focuses the map on the selected administrative area.
