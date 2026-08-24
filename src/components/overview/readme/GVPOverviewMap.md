# GVPOverviewMap Component Documentation

## File
`src/components/overview/GVPOverviewMap.jsx`

## Purpose
`GVPOverviewMap` provides the GVP-focused geographic visualization for the Overview module.

GVP means the waste-generator information represented by the SEWAC waste-generator data.

## Inputs
```jsx
<GVPOverviewMap selectedDate={selectedDate} />
```

The component reads the current geographic filters from `FilterContext` and receives the selected date from its parent.

## Filters
The component uses:
```text
City
Zone
Division
Ward
Date
```

The selected IDs are used to build a filter key and retrieve the corresponding GVP map information.

## API
The component requests:
```text
/api/waste-generators/map
```

The request is made through the shared Axios instance.

## Map Technology
The map uses:
- React
- React-Leaflet/Leaflet
- Carto light tiles

Default map settings include a Bengaluru-area center and zoom level `11`.

## Geometry Normalization
The component contains geometry utilities that:
- Detect coordinate pairs.
- Reverse coordinate order when required.
- Normalize Polygon and MultiPolygon geometry.
- Convert backend geometry into a form Leaflet can render.

## GVP Points
Returned GVP records are converted into visible map points using numeric:
```text
latitude
longitude
```

Additional information can include:
```text
ward name
ward number
GVP count
```

## Map Fitting
When boundary geometry or GVP points are available, the component calculates Leaflet bounds and fits the map to the visible geographic data.

## Responsive Behavior
Leaflet resize handling is included so the map remains correctly sized when its container changes.

## Localization
The component uses the language context for user-facing text and formats the selected date using the active locale.

## Difference From GVPGen
`GVPOverviewMap.jsx` is a **map visualization**.

The separate GVP generation component is a **trend/chart visualization**. They should not be treated as the same component.

## Summary
`GVPOverviewMap.jsx` is the Overview GVP map. It combines current geographic filters, the selected date, backend GVP map data, normalized geometry, and Leaflet rendering to provide a geographic GVP view.
