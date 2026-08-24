# CreatePlantModal Component Documentation

## File
`src/components/plants/CreatePlantModal.jsx`

## Purpose
`CreatePlantModal` provides the form and map interface used to create a new plant.

## Inputs
```jsx
<CreatePlantModal
  onClose={...}
  onSuccess={...}
/>
```

- `onClose` closes the modal.
- `onSuccess` is called after a successful plant creation.

## Location Hierarchy
The form loads and cascades:
```text
City
  ↓
Zone
  ↓
Division
  ↓
Ward
```

Relevant endpoints include:
```text
/api/master-citizen/cities
/api/master-citizen/map/city/:cityId
/api/master-citizen/map/zone/:zoneTableName/divisions
/api/master-citizen/map/division/:divisionTableName/wards
```

## Plant Creation API
Plant creation is performed through the shared Axios instance using:
```text
POST /api/plants
```

## Map
The modal includes a Leaflet map and plant marker. A map click/location interaction can update the plant's latitude and longitude.

## Form
The component manages plant information and selected geographic values, then converts the selected city/zone/division/ward records into the request payload expected by the backend.

## Loading/Error Handling
Location data is loaded asynchronously and the form handles request errors. Plant submission is also asynchronous and reports failures to the user.

## Summary
`CreatePlantModal.jsx` combines plant form entry, cascading administrative location selection, map-based location selection, and the backend plant-creation request.
