# DeleteWasteGeneratorModal.jsx Documentation

## 1. File Overview

**File:** `DeleteWasteGeneratorModal.jsx`  
**Location:** `src/components/waste-generators/DeleteWasteGeneratorModal.jsx`

`DeleteWasteGeneratorModal` provides a confirmation dialog before deleting a Waste Generator.

---

## 2. Props

```js
{
  open,
  onClose,
  citizen,
  refreshData
}
```

### `open`

Controls modal visibility.

### `onClose`

Closes the modal.

### `citizen`

Contains the Waste Generator selected for deletion.

### `refreshData`

Optional callback used to refresh the parent data after deletion.

---

## 3. Conditional Rendering

The component returns `null` when:

```js
!open || !citizen
```

So it only appears when a citizen is selected and deletion mode is active.

---

## 4. Delete Identifier

The current implementation uses:

```text
citizen.phoneNumber
```

as the identifier in the delete endpoint.

---

## 5. Delete API

The component sends:

```text
DELETE /api/waste-generators/:phoneNumber
```

using:

```js
api.delete(`/api/waste-generators/${citizen.phoneNumber}`)
```

---

## 6. Confirmation UI

The modal displays:

```text
Delete Waste Generator
```

and asks:

```text
Are you sure you want to delete [Citizen Name]?
```

The selected citizen's:

```text
personName
```

is displayed in the confirmation message.

---

## 7. Actions

### Cancel

Calls:

```js
onClose()
```

### Delete

Calls:

```js
handleDelete()
```

which performs the backend DELETE request.

---

## 8. Successful Deletion

After the DELETE request succeeds:

```js
refreshData()
```

is called when supplied.

Then:

```js
onClose()
```

closes the modal.

A success alert is also displayed:

```text
Waste Generator deleted successfully.
```

---

## 9. Error Handling

If deletion fails, the component logs the error and displays:

```text
err.response.data.message
```

or the fallback:

```text
Failed to delete waste generator.
```

---

## 10. Flow

```text
Waste Generator Directory
        ↓
Delete selected record
        ↓
Confirmation Modal
        ↓
User confirms
        ↓
DELETE /api/waste-generators/:phoneNumber
        ↓
refreshData()
        ↓
Close Modal
```

---

## 11. Summary

`DeleteWasteGeneratorModal.jsx` is the destructive-action confirmation component for Waste Generators. It uses the selected citizen's phone number to perform the DELETE request and refreshes the parent data after successful deletion.
