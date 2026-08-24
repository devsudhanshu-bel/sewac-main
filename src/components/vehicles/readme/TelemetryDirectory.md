# TelemetryDirectory.jsx Component Documentation

## 1. File Overview

**File:** `TelemetryDirectory.jsx`  
**Location:** `src/components/vehicles/TelemetryDirectory.jsx`

`TelemetryDirectory` is the main vehicle directory and CRUD interface on the Vehicles page.

It provides:

```text
Vehicle listing
Search
Status filtering
Pagination
CSV download
Create Vehicle
Edit Vehicle
Delete Vehicle
```

---

## 2. API

The directory fetches vehicles using:

```text
GET /api/vehicles
```

with query parameters:

```text
page
limit
search
status
```

---

## 3. State

The component maintains:

```text
telemetry
page
limit
search
status
pagination
showCreateModal
showEditModal
showDeleteModal
selectedVehicle
```

---

## 4. Vehicle Fetching

The request is made using:

```js
api.get("/api/vehicles", {
  params: {
    page,
    limit,
    search,
    status,
  },
});
```

Vehicle records are read from:

```text
res.data.data.vehicles
```

Pagination information is read from:

```text
res.data.data.pagination
```

---

## 5. Search

The search field is:

```text
Search by Vehicle ID
```

The search value is sent to the backend through:

```text
search
```

---

## 6. Status Filter

The status filter supports:

```text
All Status
ACTIVE
INACTIVE
```

The selected value is sent as the:

```text
status
```

query parameter.

---

## 7. Pagination

The component maintains:

```text
page
limit
```

and reads the pagination response from the backend.

The UI also provides a rows-per-page control.

---

## 8. Directory Columns

The directory represents vehicle information including:

```text
Vehicle ID
Vehicle Number
Vehicle Type
City
Zone
Division
Ward
Status
Actions
```

The visible directory header also includes route/zone and last-update information in the current UI.

---

## 9. Status Badge

`StatusBadge` displays:

```text
ACTIVE → Active
INACTIVE → Inactive
```

using translated labels.

---

## 10. Create Vehicle

Clicking:

```text
Create Vehicle
```

opens:

```text
CreateVehicleModal
```

The modal receives:

```text
onClose
onSuccess
```

After creation, the directory can refresh its data.

---

## 11. Edit Vehicle

Selecting the Update/Edit action stores the selected vehicle in:

```text
selectedVehicle
```

and opens:

```text
EditVehicleModal
```

---

## 12. Delete Vehicle

Selecting Delete stores the selected vehicle and opens:

```text
DeleteVehicleModal
```

---

## 13. CSV Download

The component provides:

```text
Download
```

functionality.

The generated CSV contains:

```text
Vehicle ID
Vehicle Number
Vehicle Type
City
Zone
Division
Ward
Status
```

---

## 14. CSV Generation

The component:

```text
escapes CSV values
creates CSV rows
creates a Blob
creates a temporary download URL
creates a download link
triggers the browser download
cleans up the temporary URL
```

The generated filename is:

```text
vehicles.csv
```

---

## 15. Empty State

When no vehicles are returned, the directory displays:

```text
No vehicles found.
```

---

## 16. Language Support

The component uses:

```js
useLanguage()
```

and translation keys under:

```text
vehicles.telemetryDirectory.*
```

---

## 17. Component Flow

```text
TelemetryDirectory
       ↓
GET /api/vehicles
       ↓
Vehicles + Pagination
       ↓
Search / Status / Page
       ↓
Vehicle Table
       │
       ├── Create → CreateVehicleModal
       ├── Edit   → EditVehicleModal
       └── Delete → DeleteVehicleModal
```

---

## 18. Summary

`TelemetryDirectory.jsx` is the main vehicle CRUD directory. It is backend-driven, supports search/status/pagination, provides CSV export, and coordinates the Create, Edit, and Delete vehicle modals.
