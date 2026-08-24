# PlantDirectory Component Documentation

## File
`src/components/plants/PlantDirectory.jsx`

## Purpose
`PlantDirectory` displays the tabular directory of plants and provides pagination plus plant actions.

## Inputs
```jsx
<PlantDirectory
  plants={plants}
  pagination={pagination}
  onCreatePlant={...}
  onEditPlant={...}
  onDeletePlant={...}
/>
```

## Plant Data
The component accepts an array of plants and a pagination object.

It safely handles missing arrays and pagination values.

## Pagination
The component maintains:
```text
currentPage
rowsPerPage
```

It calculates:
```text
totalPages
startEntry
endEntry
```

and generates the visible page-number controls.

## Actions
Plant actions are delegated through callbacks:
```text
onCreatePlant
onEditPlant
onDeletePlant
```

The directory therefore does not own the modal implementation.

## Summary
`PlantDirectory.jsx` is the table/pagination layer for the Plant page. It presents the plant records and delegates create, edit, and delete operations to the parent.
