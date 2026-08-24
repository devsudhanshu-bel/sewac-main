# UpdateWasteGeneratorModal.jsx Documentation

## 1. File Overview

**File:** `UpdateWasteGeneratorModal.jsx`  
**Location:** `src/components/waste-generators/UpdateWasteGeneratorModal.jsx`

`UpdateWasteGeneratorModal` provides the edit form for an existing Waste Generator.

It loads the selected citizen into the form, allows the record to be modified, and sends the update to the backend.

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

Contains the selected Waste Generator record.

### `refreshData`

Refreshes the parent data after a successful update.

---

## 3. Form State

The form stores:

```text
personName
phoneNumber
wetRFID
dryRFID
city
zone
division
ward
area
```

---

## 4. Geographic State

The component maintains:

```text
cities
zones
divisions
wards
```

and loads them hierarchically.

---

## 5. Loading Existing Data

When the modal opens and a citizen exists, the form is populated from:

```text
citizen.personName
citizen.phoneNumber
citizen.wetRFID
citizen.dryRFID
citizen.city
citizen.zone
citizen.division
citizen.ward
citizen.area
```

It then loads the available cities.

---

## 6. Geographic APIs

### Cities

```text
GET /api/filters/cities
```

### Zones

```text
GET /api/filters/zones/:cityId
```

### Divisions

```text
GET /api/filters/divisions/:zoneId
```

### Wards

```text
GET /api/filters/wards/:divisionId
```

The dependent lists are reset as higher-level selections change.

---

## 7. Editable Fields

The form includes:

```text
Citizen Name
Phone Number
Wet RFID
Dry RFID
City
Zone
Division
Ward
Area
```

---

## 8. Update API

The current implementation uses:

```text
PUT /api/waste-generators/:phoneNumber
```

with:

```js
citizen.phoneNumber
```

as the URL identifier.

---

## 9. Update Flow

```text
Selected Citizen
      ↓
Open UpdateWasteGeneratorModal
      ↓
Load Existing Data
      ↓
Edit Fields
      ↓
handleUpdate()
      ↓
PUT /api/waste-generators/:phoneNumber
      ↓
refreshData()
      ↓
Close Modal
```

---

## 10. Refresh

After a successful update:

```js
await refreshData();
```

is called when the callback is supplied.

This allows the parent page to reload its summary/directory information.

---

## 11. Summary

`UpdateWasteGeneratorModal.jsx` is the edit modal for Waste Generators. It supports citizen/RFID/geographic information, uses dependent location APIs, updates the selected record through the Waste Generator PUT endpoint, and refreshes the parent data after success.
