# DeletePlantModal Component Documentation

## File
`src/components/plants/DeletePlantModal.jsx`

## Purpose
`DeletePlantModal` confirms and performs deletion of a selected plant.

## Inputs
```jsx
<DeletePlantModal
  plant={selectedPlant}
  onClose={...}
  onSuccess={...}
/>
```

- `plant` is the selected plant.
- `onClose` closes the modal.
- `onSuccess` notifies the parent after deletion.

## API
The component sends:
```text
DELETE /api/plants/:plantId
```

The selected plant ID is inserted into the URL.

## Flow
```text
Select Plant
   ↓
Open Delete Modal
   ↓
Confirm
   ↓
DELETE /api/plants/:id
   ↓
onSuccess()
   ↓
Close
```

## UI
The component uses Lucide icons and the language context for the confirmation interface.

## Summary
`DeletePlantModal.jsx` is the destructive-action confirmation layer for Plant management. The parent page handles refreshing the Plant dashboard after `onSuccess`.
