# PlantLocations Component Documentation

## File
`src/components/plants/PlantLocations.jsx`

## Purpose
`PlantLocations` displays Plant records geographically on a Leaflet map.

## Input
```jsx
<PlantLocations plants={formattedPlantLocations} />
```

## Map
The component uses Leaflet/React-Leaflet and creates a map from the supplied plant coordinates.

## Plant Coordinates
Each plant is expected to provide usable:
```text
latitude
longitude
```

The parent page prepares the location data before passing it to the component.

## Bounds
The component calculates bounds from the available plant markers and fits the map to the Plant locations when possible.

## Marker Assets
Leaflet marker image assets are imported explicitly so the standard marker visuals work correctly in the Vite frontend.

## Summary
`PlantLocations.jsx` is the geographic visualization for Plant locations. It receives prepared Plant data from the parent and focuses the map around the available plant markers.
