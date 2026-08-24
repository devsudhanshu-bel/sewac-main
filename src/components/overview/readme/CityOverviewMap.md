# CityOverviewMap Component Documentation

## File
`src/components/overview/CityOverviewMap.jsx`

## Purpose
`CityOverviewMap` is the main interactive administrative map used by the Overview page. It displays the city boundary and cascading geographic layers for zones, divisions, and wards. It also supports switching the map view to related Overview visualizations.

## Inputs
```jsx
<CityOverviewMap
  cityId={...}
  onViewChange={...}
  selectedDate={...}
  mapData={...}
/>
```

- `cityId` — city identifier; defaults to city ID `1`.
- `onViewChange` — callback used when the user changes the map view.
- `selectedDate` — selected dashboard date.
- `mapData` — Overview map/route data supplied by the parent.

## Geographic Data
The component loads:
- City boundary
- Zones and their boundaries
- Divisions inside the selected zone
- Wards inside the selected division
- Plant information used by the map

Relevant backend routes include:
```text
/api/master-citizen/map/city/:cityId
/api/master-citizen/map/zone/:zoneTableName/divisions
/api/master-citizen/map/division/:divisionTableName/wards
/api/plants
```

## Cascading Selection
The map follows:
```text
City
  ↓
Zone
  ↓
Division
  ↓
Ward
```

Selecting a zone loads its divisions. Selecting a division loads its wards. The selected geographic level is then focused on the map.

## Map Layers
The component renders Leaflet/React-Leaflet layers for:
- City
- Zones
- Divisions
- Wards

Different color definitions are maintained for the geographic levels.

## Selection and Focus
The map automatically calculates GeoJSON bounds and focuses the map when a geographic selection changes. A reset option returns the map to the broader city view.

## Async Safety
Separate abort controllers are maintained for division, ward, and plant requests so stale requests can be cancelled when selections change.

## View Switching
The component exposes a map-view selector through `onViewChange`. This allows the Overview area to switch between the available map/visualization views.

## Responsive Map
Leaflet resize handling is included so the map recalculates its size when its container changes.

## Summary
`CityOverviewMap.jsx` is the geographic controller of the Overview map. It combines administrative boundaries, cascading selections, plant data, and map navigation while keeping the actual map rendering inside the component.
