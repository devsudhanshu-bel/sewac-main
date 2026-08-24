# EditVehicleModal.jsx Component Documentation

## 1. File Overview

**File:** `EditVehicleModal.jsx`  
**Location:** `src/components/vehicles/EditVehicleModal.jsx`

`EditVehicleModal` allows an existing vehicle record to be edited.

---

## 2. Props

The component receives:

```text
vehicle
onClose
onSuccess
```

### `vehicle`

The vehicle record being edited.

### `onClose`

Closes the modal.

### `onSuccess`

Called after a successful update.

---

## 3. Form Fields

The editable form contains:

```text
vehicle_id
vehicle_type
city
zone
division
ward
status
```

---

## 4. Existing Vehicle Data

When a vehicle is supplied, the component initializes the form from the selected vehicle.

It also resolves the existing geographic selections through the available City → Zone → Division → Ward data.

---

## 5. Geographic Hierarchy

The component loads:

```text
GET /api/filters/cities
GET /api/filters/zones/:cityId
GET /api/filters/divisions/:zoneId
GET /api/filters/wards/:divisionId
```

---

## 6. Cascading City Change

When City changes:

```text
Zone
Division
Ward
```

are cleared.

The new Zones are then loaded using the selected City ID.

---

## 7. Cascading Zone Change

When Zone changes:

```text
Division
Ward
```

are cleared.

The new Divisions are loaded using the selected Zone ID.

---

## 8. Cascading Division Change

When Division changes:

```text
Ward
```

is cleared.

The new Wards are loaded using the selected Division ID.

---

## 9. Ward Change

Selecting a Ward updates the form's:

```text
ward
```

value.

---

## 10. Vehicle Types

The component supports:

```text
Mini Truck
Auto Tipper
Compactor
Dumper
```

---

## 11. Status

The vehicle status can be:

```text
ACTIVE
INACTIVE
```

---

## 12. Validation

The component validates:

```text
vehicle_id
vehicle_type
city
zone
division
ward
status
```

If required information is missing, it displays:

```text
Please fill all fields.
```

---

## 13. Update API

The update request is:

```text
PUT /api/vehicles/:vehicleId
```

Specifically:

```js
/api/vehicles/${vehicle.vehicle_id}
```

The complete form is sent as the request body.

---

## 14. Loading States

The component maintains loading states for:

```text
Cities
Zones
Divisions
Wards
Submitting
```

This allows dropdowns and the Update action to reflect the current operation.

---

## 15. Success Flow

After a successful update:

```js
onSuccess();
onClose();
```

The parent can refresh the vehicle list.

---

## 16. Error Handling

Update errors are logged and a translated error message is displayed.

Fallback:

```text
Failed to update vehicle
```

---

## 17. Language Support

The component uses:

```js
useLanguage()
```

with translation keys under:

```text
vehicles.editVehicle.*
```

---

## 18. Summary

`EditVehicleModal.jsx` is the vehicle-editing modal. It loads and manages the dependent geographic dropdown hierarchy, validates the form, sends `PUT /api/vehicles/:vehicleId`, and notifies the parent after a successful update.
