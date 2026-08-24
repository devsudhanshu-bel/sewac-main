# CreateVehicleModal.jsx Component Documentation

## 1. File Overview

**File:** `CreateVehicleModal.jsx`  
**Location:** `src/components/vehicles/CreateVehicleModal.jsx`

`CreateVehicleModal` provides the form used to create a new vehicle.

---

## 2. Props

The component receives:

```text
onClose
onSuccess
```

### `onClose`

Closes the modal.

### `onSuccess`

Called after the vehicle is successfully created.

---

## 3. Form State

The form contains:

```text
vehicle_id
vehicle_type
city
zone
division
ward
status
```

The default status is:

```text
ACTIVE
```

---

## 4. Geographic Dropdowns

The modal maintains separate lists for:

```text
cities
zones
divisions
wards
```

The dropdown hierarchy is:

```text
City
  ↓
Zone
  ↓
Division
  ↓
Ward
```

---

## 5. City API

Cities are loaded using:

```text
GET /api/filters/cities
```

This is executed when the component mounts.

---

## 6. Zone API

Zones are loaded after selecting a city:

```text
GET /api/filters/zones/:cityId
```

---

## 7. Division API

Divisions are loaded after selecting a zone:

```text
GET /api/filters/divisions/:zoneId
```

---

## 8. Ward API

Wards are loaded after selecting a division:

```text
GET /api/filters/wards/:divisionId
```

---

## 9. Vehicle Types

The vehicle type selection includes:

```text
Mini Truck
Auto Tipper
Compactor
Dumper
```

---

## 10. Status

The available status values are:

```text
ACTIVE
INACTIVE
```

---

## 11. Validation

Before submission, the component checks that:

```text
vehicle_id
vehicle_type
city
zone
division
ward
status
```

are all present.

If any field is missing, the component displays:

```text
Please fill all fields.
```

---

## 12. Create API

After successful validation, the component sends:

```text
POST /api/vehicles
```

with the complete form object.

---

## 13. Success Flow

After a successful POST request:

```js
onSuccess();
onClose();
```

The parent can therefore refresh the vehicle directory and close the modal.

---

## 14. Error Handling

If creation fails, the component:

```text
logs the error
shows a translated alert
```

with the fallback:

```text
Failed to create vehicle
```

---

## 15. Language Support

The component uses:

```js
useLanguage()
```

and translation keys under:

```text
vehicles.createVehicle.*
```

---

## 16. Summary

`CreateVehicleModal.jsx` is the vehicle creation form. It loads the City → Zone → Division → Ward hierarchy, validates all required fields, sends a `POST /api/vehicles` request, and notifies the parent after successful creation.
