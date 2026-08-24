# EditPlantModal Component Documentation

## File
`src/components/plants/EditPlantModal.jsx`

## Purpose
`EditPlantModal` edits an existing plant, including its administrative location and map coordinates.

## Inputs
```jsx
<EditPlantModal
  plant={selectedPlant}
  onClose={...}
  onSuccess={...}
/>
```

## Existing Data
When a plant is supplied, the component loads its existing location and form values.

## Location APIs
The component loads cascading location data through:
```text
/api/filters/cities
/api/filters/zones/:cityId
/api/filters/divisions/:zoneId
/api/filters/wards/:divisionId
```

## Location Selection
Changing:
```text
City
```
reloads zones.

Changing:
```text
Zone
```
reloads divisions.

Changing:
```text
Division
```
reloads wards.

The selected ward and map location are kept in the edit form.

## Map
Leaflet is used to display the plant location. Latitude and longitude can be updated through the map interaction.

## Update API
The component sends the edited plant through:
```text
PUT /api/plants/:plantId
```

## Success
After a successful update, `onSuccess` is called so the parent page can refresh its data.

## Summary
`EditPlantModal.jsx` is the Plant edit form. It combines existing plant data, cascading location filters, map-based coordinates, validation/submission, and the plant update API.
