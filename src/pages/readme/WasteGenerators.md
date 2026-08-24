# WasteGenerators.jsx Page Documentation

## 1. File Overview

**File:** `WasteGenerators.jsx`  
**Location:** `src/pages/WasteGenerators.jsx`

`WasteGenerators` is the parent page for the complete Waste Generators feature.

It coordinates:

```text
Waste Generator KPIs
Waste Generator Map
GVP Generation Trend
Waste Generator Directory
```

---

## 2. Main Dependencies

The page uses:

```text
Header
WasteGenKPIs
WasteGenMap
GVPGen
WasteGenDir
FilterContext
LanguageContext
Axios API
```

---

## 3. Date State

The selected date is stored in:

```js
selectedDate
```

with the current date as the initial value.

The date is passed to:

```text
Header
WasteGenMap
GVPGen
Summary API
Directory API
```

---

## 4. Filter Context

The page reads:

```text
selectedCity
selectedZone
selectedDivision
selectedWard
```

from:

```js
useFilters()
```

These filters control the Waste Generator API requests.

---

## 5. Summary State

The page maintains:

```text
summary
```

which comes from:

```text
GET /api/waste-generators/summary
```

The query can contain:

```text
date
cityId
zoneId
divisionId
wardId
```

---

## 6. Directory State

The page maintains:

```text
citizens
directoryLoading
directorySearch
directoryPage
directoryPageSize
directoryTotal
directoryTotalPages
syncing
```

This allows the directory to support:

```text
Search
Pagination
Page size
Loading
Ward synchronization
```

---

## 7. Summary API

The page calls:

```text
GET /api/waste-generators/summary
```

The city is required.

The other geographic filters are included when selected.

---

## 8. Directory API

The page calls:

```text
GET /api/waste-generators/directory
```

with:

```text
page
limit
cityId
zoneId
divisionId
wardId
date
search
```

The response provides:

```text
wasteGenerators
pagination
```

which are stored in the page state.

---

## 9. Directory Pagination

The directory page resets to page `1` when:

```text
City changes
Zone changes
Division changes
Ward changes
Search changes
```

Changing page size also resets the page to:

```text
1
```

---

## 10. Ward Synchronization

The page provides:

```text
Sync Ward
```

through `WasteGenDir`.

It obtains the selected ward number from:

```text
ward_no
wardNo
ward_number
wardNumber
```

and uses the first valid positive integer.

---

## 11. Sync API

The synchronization request is:

```text
POST /api/master-citizen/sync/ward/:wardNo
```

After a successful sync:

```text
directory page = 1
directory reload
success alert
```

---

## 12. Sync Error Handling

The page displays the backend error message when available:

```text
response.data.message
response.data.error
error.message
```

Otherwise it uses the translated fallback:

```text
Failed to sync the selected ward.
```

---

## 13. Waste Generator KPI

The page renders:

```jsx
<WasteGenKPIs summary={summary} />
```

The KPI component is therefore completely driven by the summary returned by the parent.

---

## 14. Waste Generator Map

The page renders:

```jsx
<WasteGenMap
  selectedDate={selectedDate}
/>
```

The map obtains the geographic filters through `useFilters()` itself.

---

## 15. GVP Generation

The page renders:

```jsx
<GVPGen
  selectedDate={selectedDate}
  selectedCity={selectedCity}
  selectedZone={selectedZone}
  selectedDivision={selectedDivision}
/>
```

The GVP graph intentionally represents all wards under the selected division rather than filtering to one selected ward.

---

## 16. Directory

The page renders:

```jsx
<WasteGenDir
  citizens={citizens}
  search={directorySearch}
  onSearch={setDirectorySearch}
  onUpdate={handleUpdate}
  onSync={handleSync}
  syncing={syncing}
  loading={directoryLoading}
  page={directoryPage}
  pageSize={directoryPageSize}
  total={directoryTotal}
  totalPages={directoryTotalPages}
  onPageChange={setDirectoryPage}
  onPageSizeChange={...}
/>
```

---

## 17. Update Behavior

The current page defines:

```js
handleUpdate(citizen)
```

which currently logs:

```text
Update Waste Generator:
```

and the selected citizen.

The actual update modal/navigation can be connected through this handler.

---

## 18. Page Layout

The page structure is:

```text
Header
   ↓
Waste Generators Title
   ↓
WasteGenKPIs
   ↓
┌───────────────────────┬───────────────────────┐
│ WasteGenMap           │ GVPGen                │
└───────────────────────┴───────────────────────┘
   ↓
WasteGenDir
```

On smaller screens the two map/chart sections stack vertically.

---

## 19. Language System

The page uses:

```js
useLanguage()
```

and not React-i18next's `useTranslation`.

The page translates:

```text
Title
Description
Sync messages
```

using the custom SEWAC language system.

---

## 20. Complete Data Flow

```text
Header Filters + Date
          ↓
   WasteGenerators.jsx
          │
          ├── Summary API
          │      ↓
          │  WasteGenKPIs
          │
          ├── WasteGenMap
          │      ↓
          │  Map API
          │
          ├── GVPGen
          │      ↓
          │  GVP Trend API
          │
          └── Directory API
                 ↓
            WasteGenDir
                 ├── Search
                 ├── Pagination
                 ├── Sync
                 └── Update
```

---

## 21. Summary

`WasteGenerators.jsx` is the main orchestration page for the Waste Generators module.

It is responsible for:

- Managing the selected date.
- Reading geographic filters.
- Loading Waste Generator summary data.
- Loading the paginated directory.
- Managing directory search.
- Managing directory pagination.
- Synchronizing the selected ward.
- Passing data to KPI, map, GVP, and directory components.
- Handling API loading and synchronization state.
