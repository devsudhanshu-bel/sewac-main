# CustomerGrev Component Documentation

## File
`src/components/overview/CustomerGrev.jsx`

## Purpose
`CustomerGrev` displays customer grievance/complaint locations on an interactive Leaflet map.

## Data Source
The component retrieves complaint-location data from:
```text
/api/complaints-grev/locations
```

The response is normalized before it is displayed.

## Map
The default map is centered around Bengaluru and uses Leaflet.

The component:
- Converts complaint coordinates to numeric latitude/longitude values.
- Reads complaint boundary information when available.
- Converts supported GeoJSON/boundary structures into drawable Leaflet paths.
- Fits the map to the available complaint/boundary area.

## Complaint Information
The component prepares translated labels for:
```text
Complaint
Ticket
Status
Category
Phone
Description
Address
Latitude
Longitude
```

A complaint marker can expose the corresponding complaint information to the user.

## Boundary Processing
The component contains helpers for:
- Parsing possible JSON geometry.
- Converting GeoJSON to paths.
- Normalizing boundary structures.
- Testing whether complaint points fall inside polygons.

This allows complaint visibility to be constrained by the available geographic boundary.

## Localization
All user-facing labels are obtained through `useLanguage`, including loading, error, complaint details, and unavailable-value messages.

## Loading and Error States
The component fetches its data asynchronously and provides translated loading/error UI instead of silently failing.

## Summary
`CustomerGrev.jsx` is the complaint-location map used in the Overview area. Its main responsibility is to retrieve grievance locations, normalize geographic data, display complaint markers, and present complaint details in the selected language.
