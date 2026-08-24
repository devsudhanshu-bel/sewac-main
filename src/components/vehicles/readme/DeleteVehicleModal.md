# DeleteVehicleModal.jsx Component Documentation

## 1. File Overview

**File:** `DeleteVehicleModal.jsx`  
**Location:** `src/components/vehicles/DeleteVehicleModal.jsx`

`DeleteVehicleModal` performs the deletion of a selected vehicle.

---

## 2. Props

The component receives:

```text
vehicle
onClose
onSuccess
```

---

## 3. Vehicle ID Validation

Before deleting, the component checks:

```js
vehicle?.vehicle_id
```

If the vehicle ID is missing, the function returns without making an API request.

---

## 4. Delete API

The component sends:

```text
DELETE /api/vehicles/:vehicleId
```

using:

```js
api.delete(`/api/vehicles/${vehicle.vehicle_id}`)
```

---

## 5. Success Flow

After successful deletion:

```js
onSuccess();
```

The parent can then refresh the directory.

---

## 6. Error Handling

If deletion fails, the component logs:

```text
Delete Vehicle Error:
```

to the console.

---

## 7. UI

The modal uses:

```text
X
Trash2
AlertTriangle
```

icons to represent:

```text
Close
Delete
Warning
```

---

## 8. Language Support

The component uses:

```js
useLanguage()
```

for translated delete-modal text.

---

## 9. Summary

`DeleteVehicleModal.jsx` is the destructive-action modal for vehicle deletion. It validates the selected vehicle ID, sends `DELETE /api/vehicles/:vehicleId`, calls `onSuccess()` after successful deletion, and reports errors through the console.
