# plantService.js Documentation

## 1. File Overview

**File:** `plantService.js`  
**Location:** `src/services/plantService.js`

`plantService.js` contains the business/data-access logic for the Plants module.

It uses both:

```text
mainDb
Prisma
```

depending on the operation.

---

## 2. Database Dependencies

The service imports:

```js
const mainDb = require("../config/mainDb");
const { PrismaClient } = require("../generated/sewac");
```

A Prisma client is created for the `sewac` database.

---

# 3. getAllPlants()

## Purpose

Returns a paginated list of active plants.

The query starts with:

```sql
WHERE status = 'ACTIVE'
```

---

## Supported Query Parameters

```text
page
limit
search
city
zone
division
ward
```

### page

Defaults to:

```text
1
```

### limit

Defaults to:

```text
10
```

### search

Searches both:

```text
plant_name
plant_manager
```

using PostgreSQL `ILIKE`.

### city

Filters by exact city.

### zone

Filters by exact zone.

### division

Filters by exact division.

### ward

Filters by exact ward.

---

## Pagination

The service calculates:

```js
offset = (page - 1) * limit
```

The database query uses:

```sql
LIMIT
OFFSET
```

The response is:

```json
{
  "plants": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

---

## Database

`getAllPlants()` uses:

```js
mainDb.query(...)
```

against:

```text
plant_master
```

---

# 4. getPlantById()

Uses Prisma:

```js
prisma.plant_master.findUnique({
  where: {
    id: Number(id)
  }
})
```

If the plant does not exist:

```text
Plant not found
```

is thrown.

---

# 5. createPlant()

Creates a new `plant_master` record.

The service reads:

```text
plant_name
plant_type
city
zone
division
ward
plant_manager
capacity_ton_per_day
vehicles_enrolled
total_waste_collected
latitude
longitude
status
```

and passes these values to:

```js
prisma.plant_master.create()
```

---

# 6. updatePlant()

First checks whether the plant exists.

Then performs:

```js
prisma.plant_master.update()
```

using:

```text
id
```

and the supplied request body.

If the plant does not exist:

```text
Plant not found
```

is thrown.

The current implementation passes the body directly as Prisma update data.

---

# 7. deletePlant()

The Plants module uses a **soft delete**.

The service first verifies that the plant exists.

It does not physically remove the row.

Instead:

```js
status: "INACTIVE"
```

is written to the existing record.

This allows the plant record to remain in the database while excluding it from the active plant directory.

---

# 8. getPlantDashboard()

Uses `mainDb.query()` to calculate:

```text
total_plants
total_vehicles
total_waste
```

only from:

```sql
WHERE status='ACTIVE'
```

The service converts the database values to numbers and returns:

```json
{
  "totalPlants": 0,
  "totalVehiclesEnrolled": 0,
  "totalWasteCollected": 0
}
```

---

# 9. getPlantLocations()

Returns active plants that have valid stored coordinates.

The query selects:

```text
id
plant_name
zone
latitude
longitude
status
```

and requires:

```text
status = ACTIVE
latitude IS NOT NULL
longitude IS NOT NULL
```

Results are ordered by:

```text
plant_name
```

---

# 10. Data Access Pattern

```text
Plant Controller
      ↓
Plant Service
      ├── mainDb.query()
      │
      └── Prisma
             ↓
       plant_master
```

---

# 11. Important Implementation Notes

- `getAllPlants()` uses raw SQL through `mainDb`.
- `getPlantDashboard()` uses raw SQL through `mainDb`.
- `getPlantLocations()` uses raw SQL through `mainDb`.
- `getPlantById()` uses Prisma.
- `createPlant()` uses Prisma.
- `updatePlant()` uses Prisma.
- `deletePlant()` uses Prisma.
- Active directory queries exclude `INACTIVE` plants.
- Delete is implemented as a soft delete.
- Pagination is calculated in the service layer.

---

# 12. Summary

`plantService.js` is the central service layer for plant data operations. It provides directory filtering and pagination, individual plant retrieval, creation, update, soft deletion, dashboard statistics, and map-location data.
