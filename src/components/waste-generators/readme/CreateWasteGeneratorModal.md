# CreateWasteGeneratorModal.jsx Documentation

## 1. File Overview

**File:** `CreateWasteGeneratorModal.jsx`  
**Location:** `src/components/waste-generators/CreateWasteGeneratorModal.jsx`

`CreateWasteGeneratorModal` provides the form used to create a new Waste Generator.

It collects citizen, household, geographic, and waste-generator information and submits the completed form to the backend.

---

## 2. Props

```js
{
  open,
  onClose,
  refreshData
}
```

### `open`

Controls whether the modal is rendered.

### `onClose`

Closes the modal.

### `refreshData`

Called after a successful creation so the parent page can reload its data.

---

## 3. Form State

The form contains:

```text
personName
phoneNumber
city
zone
division
ward
area
houseNumber
floorNumber
numberOfPeople
householdType
wasteGeneratorTypes
```

---

## 4. Geographic Dropdowns

The modal maintains:

```text
cities
zones
divisions
wards
```

The geographic hierarchy is:

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

## 5. Filter APIs

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

Each lower-level selection depends on the selected parent.

---

## 6. Form Fields

The modal provides:

```text
Citizen Name
Phone Number
City
Zone
Division
Ward
Area
House Number
Floor Number
Number Of People
Household Type
Waste Generator Type
```

---

## 7. Household Type

Available options:

```text
Residential
Commercial
Industrial
```

---

## 8. Waste Generator Type

Available options:

```text
Domestic
Commercial
Industrial
Institutional
```

---

## 9. Create API

When the form is submitted:

```text
POST /api/waste-generators
```

The current form object is sent as the request body.

Conceptually:

```text
Form
 ↓
POST /api/waste-generators
 ↓
Backend
 ↓
Waste Generator Created
```

---

## 10. Refresh After Creation

After a successful POST request:

```js
await refreshData();
```

is called.

This allows the parent `WasteGenerators` page to reload the summary/directory information.

---

## 11. Modal Flow

```text
Add Waste Generator
        ↓
CreateWasteGeneratorModal
        ↓
Enter Citizen Details
        ↓
Select City
        ↓
Select Zone
        ↓
Select Division
        ↓
Select Ward
        ↓
Enter Household Details
        ↓
Submit
        ↓
POST /api/waste-generators
        ↓
refreshData()
        ↓
Close / refresh parent
```

---

## 12. Summary

`CreateWasteGeneratorModal.jsx` is the creation form for Waste Generators. It handles dependent geographic dropdowns, household information, waste-generator classification, backend creation, and parent-data refresh.
