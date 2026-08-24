# Plants.jsx Page Documentation

## 1. File Overview

**File:** `Plants.jsx`  
**Location:** `src/pages/Plants.jsx`

`Plants` is the main Plant Overview page in the SEWAC frontend.

It loads Plant dashboard information, Plant records, and Plant locations, then combines those datasets with:

```text
Plant KPI Cards
Plant Locations
Plant Directory
Create Plant Modal
Edit Plant Modal
Delete Plant Modal
```

---

## 2. Main Dependencies

The page imports:

```text
useEffect
useState
createPortal
api
Header
CreatePlantModal
EditPlantModal
DeletePlantModal
PlantKPICards
PlantLocations
PlantDirectory
```

---

## 3. State

The page maintains:

```text
dashboardData
loading
error
plants
plantLocations
pagination
showCreateModal
showEditModal
showDeleteModal
selectedPlant
```

---

## 4. Dashboard Data

`dashboardData` stores the result from:

```text
/api/plants/dashboard
```

This data is passed to:

```jsx
<PlantKPICards data={dashboardData} />
```

---

## 5. Plant List

`plants` stores the Plant records returned by:

```text
/api/plants
```

The response also provides pagination information stored in:

```text
pagination
```

---

## 6. Plant Locations

`plantLocations` stores geographic Plant information returned by:

```text
/api/plants/locations
```

This data is supplied to:

```text
PlantLocations
```

---

## 7. Dashboard API Requests

The page makes three requests in parallel:

```text
/api/plants/dashboard
/api/plants
/api/plants/locations
```

using:

```js
Promise.all(...)
```

---

## 8. Dashboard Request Flow

```text
Plants.jsx
    ↓
Promise.all()
    ├── Plant Dashboard
    ├── Plant List
    └── Plant Locations
          ↓
      Store State
          ↓
      Render Dashboard
```

---

## 9. Create Plant

The function:

```js
handleCreatePlant
```

sets:

```js
setShowCreateModal(true)
```

This opens the Create Plant modal.

The modal is rendered using:

```js
createPortal(...)
```

and is mounted into:

```text
document.body
```

After successful creation:

```js
fetchDashboard
```

is called again.

---

## 10. Edit Plant

The function:

```js
handleEditPlant(plant)
```

stores the selected Plant:

```js
setSelectedPlant(plant)
```

and opens:

```text
EditPlantModal
```

The modal receives:

```text
plant
onClose
onSuccess
```

After success, the page calls:

```text
fetchDashboard
```

to refresh the Plant data.

---

## 11. Delete Plant

The function:

```js
handleDeletePlant(plant)
```

stores the selected Plant and opens:

```text
DeletePlantModal
```

The modal receives:

```text
plant
onClose
onSuccess
```

After successful deletion, the page refreshes the entire Plant dashboard.

---

## 12. Modal State

The three modal visibility states are:

```text
showCreateModal
showEditModal
showDeleteModal
```

The currently selected Plant is stored in:

```text
selectedPlant
```

---

## 13. Background Scroll Prevention

When any Plant modal is open:

```js
document.body.style.overflow = "hidden";
```

When all modals are closed:

```js
document.body.style.overflow = "auto";
```

This prevents the background page from scrolling while a modal is active.

---

## 14. Loading State

While initial Plant data is loading, the page displays:

```text
Loading Plant Dashboard...
```

---

## 15. Error Handling

If an API request fails, the page stores:

```text
err.response?.data?.message
```

or:

```text
Unable to connect to the server.
```

The page then displays the error and provides:

```text
Retry
```

which calls:

```js
fetchDashboard
```

again.

---

## 16. Page Header

The page renders:

```jsx
<Header variant="dashboard" />
```

followed by:

```text
Plant Overview
Monitor all waste processing plants and their operations
```

---

## 17. Plant KPI Cards

The page renders:

```jsx
<PlantKPICards data={dashboardData} />
```

This component is responsible for displaying Plant-level KPI information.

---

## 18. Plant Locations

The page combines Plant location records with matching Plant records.

For each location it finds:

```js
plants.find((p) => p.id === location.id)
```

and adds:

```text
plant_manager
vehicles_enrolled
capacity_ton_per_day
latitude
longitude
```

The resulting data is passed to:

```jsx
<PlantLocations />
```

---

## 19. Plant Directory

The page renders:

```jsx
<PlantDirectory
  plants={plants}
  pagination={pagination}
  onCreatePlant={handleCreatePlant}
  onEditPlant={handleEditPlant}
  onDeletePlant={handleDeletePlant}
/>
```

This connects the directory actions directly to the page's modal state.

---

## 20. Overall Page Flow

```text
Plants.jsx
    ↓
Fetch Dashboard + Plants + Locations
    ↓
┌──────────────────────────────┐
│ Plant KPI Cards              │
│ Plant Locations              │
│ Plant Directory              │
└──────────────────────────────┘
    ↓
User Action
    ├── Create → CreatePlantModal
    ├── Edit   → EditPlantModal
    └── Delete → DeletePlantModal
    ↓
Successful Action
    ↓
fetchDashboard()
    ↓
Refresh Page Data
```

---

## 21. Summary

`Plants.jsx` is the parent page for the entire Plant management feature.

It is responsible for:

- Fetching Plant dashboard data.
- Fetching Plant records.
- Fetching Plant locations.
- Managing pagination data.
- Opening Create/Edit/Delete Plant modals.
- Tracking the selected Plant.
- Refreshing data after successful Plant operations.
- Preventing background scrolling while modals are open.
- Handling loading and API errors.
- Connecting Plant child components together.
