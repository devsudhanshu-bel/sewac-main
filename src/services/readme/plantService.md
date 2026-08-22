# plantService.js Documentation

## 1. File Overview

### File Name
`plantService.js`

### File Location
`src/services/plantService.js`

### Purpose

`plantService.js` contains the business and database logic for the Plants module.

It is called by `plantController.js` and communicates with the SEWAC database.

---

## 2. Database Dependencies

The service imports:

```js
const mainDb = require("../config/mainDb");
const { PrismaClient } = require("../generated/sewac");
```

It creates a Prisma client:

```js
const prisma = new PrismaClient();
```

Two database access approaches are used:

```text
mainDb
   ↓
Raw SQL queries

Prisma
   ↓
plant_master model operations
```

---

## 3. getAllPlants(query)

Retrieves active plants with pagination and filters.

### Pagination

The service reads:

```text
page
limit
```

Defaults:

```text
page = 1
limit = 10
```

Offset is calculated as:

```text
(page - 1) × limit
```

### Filters

The service supports:

```text
search
city
zone
division
ward
```

The `search` filter checks:

```text
plant_name
plant_manager
```

using PostgreSQL `ILIKE`.

### Status

Only active plants are returned:

```sql
status = 'ACTIVE'
```

### Response

The service returns:

```js
{
  plants: plants.rows,
  pagination: {
    page,
    limit,
    total,
    totalPages,
  },
}
```

---

## 4. getPlantById(id)

Retrieves one plant using Prisma:

```js
prisma.plant_master.findUnique({
  where: {
    id: Number(id),
  },
});
```

If no plant is found:

```text
Plant not found
```

is thrown as an error.

---

## 5. createPlant(body)

Creates a new plant using Prisma.

The service extracts:

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

These values are passed to:

```js
prisma.plant_master.create()
```

The created plant is returned.

---

## 6. updatePlant(id, body)

First checks whether the plant exists.

```js
prisma.plant_master.findUnique()
```

If it does not exist:

```text
Plant not found
```

is thrown.

If it exists, the service updates the record using:

```js
prisma.plant_master.update()
```

The complete request body is passed as update data.

---

## 7. deletePlant(id)

The Plant module uses a soft-delete approach.

The service first checks whether the plant exists.

It then updates:

```text
status = "INACTIVE"
```

instead of physically deleting the database row.

This preserves the plant record while removing it from active Plant Directory results.

---

## 8. getPlantDashboard()

Retrieves Plant dashboard statistics using `mainDb`.

The SQL query calculates:

```text
total_plants
total_vehicles
total_waste
```

Only active plants are included.

The returned structure is:

```js
{
  totalPlants: Number(...),
  totalVehiclesEnrolled: Number(...),
  totalWasteCollected: Number(...),
}
```

---

## 9. getPlantLocations()

Retrieves active plant location information.

The query selects:

```text
id
plant_name
zone
latitude
longitude
status
```

Only records satisfying:

```text
status = 'ACTIVE'
latitude IS NOT NULL
longitude IS NOT NULL
```

are returned.

The results are ordered by:

```text
plant_name
```

---

## 10. Database Operations Summary

| Function | Database Method |
|---|---|
| `getAllPlants` | `mainDb.query()` |
| `getPlantById` | Prisma `findUnique()` |
| `createPlant` | Prisma `create()` |
| `updatePlant` | Prisma `findUnique()` + `update()` |
| `deletePlant` | Prisma `findUnique()` + `update()` |
| `getPlantDashboard` | `mainDb.query()` |
| `getPlantLocations` | `mainDb.query()` |

---

## 11. Plant Directory Data Flow

```text
Plant Directory
      ↓
GET /
      ↓
plantController.getAllPlants()
      ↓
plantService.getAllPlants()
      ↓
mainDb.query()
      ↓
plant_master
      ↓
Plants + Pagination
```

---

## 12. Create Flow

```text
Create Plant Modal
      ↓
POST /
      ↓
createPlant()
      ↓
plantService.createPlant()
      ↓
Prisma create()
      ↓
plant_master
      ↓
Created Plant
```

---

## 13. Update Flow

```text
Edit Plant
      ↓
PUT /:id
      ↓
updatePlant()
      ↓
plantService.updatePlant()
      ↓
Check Existing Plant
      ↓
Prisma update()
      ↓
Updated Plant
```

---

## 14. Delete Flow

```text
Delete Plant
      ↓
DELETE /:id
      ↓
deletePlant()
      ↓
Check Existing Plant
      ↓
status = INACTIVE
      ↓
Plant remains in database
      ↓
No longer appears as active
```

---

## 15. Dashboard Flow

```text
Plant Dashboard
      ↓
GET /dashboard
      ↓
getPlantDashboard()
      ↓
mainDb.query()
      ↓
Aggregate Active Plant Statistics
      ↓
Dashboard Response
```

---

## 16. Location Flow

```text
Plant Locations
      ↓
GET /locations
      ↓
getPlantLocations()
      ↓
mainDb.query()
      ↓
Active Plants With Coordinates
      ↓
Location Data
```

---

## 17. Active Plant Filtering

The Plant Directory and dashboard operations use active plants.

The active status is:

```text
ACTIVE
```

Soft-deleted plants are changed to:

```text
INACTIVE
```

and therefore are excluded from active Plant Directory queries.

---

## 18. Pagination

Pagination is calculated using:

```text
offset = (page - 1) × limit
```

The service returns:

```js
pagination: {
  page,
  limit,
  total,
  totalPages,
}
```

This allows the frontend to display the correct page and total number of records.

---

## 19. Search

The `search` query checks both:

```text
plant_name
plant_manager
```

The SQL condition uses:

```sql
ILIKE
```

with wildcard values:

```text
%search%
```

This provides case-insensitive partial matching.

---

## 20. Geographic Filtering

The Plant Directory can filter records by:

```text
city
zone
division
ward
```

These filters are added to the SQL `WHERE` clause when supplied.

---

## 21. Error Handling

The service throws errors when required operations cannot be completed.

For example:

```text
Plant not found
```

The controller catches these errors and converts them into HTTP responses.

---

## 22. Important Implementation Notes

- `plantService.js` is the main business/data layer for Plants.
- It uses both raw SQL and Prisma.
- Active plants use status `ACTIVE`.
- Delete is implemented as a soft delete.
- Plant Directory results are paginated.
- Plant Directory results support search.
- Plant Directory results support city, zone, division, and ward filters.
- Dashboard statistics include active plants only.
- Location results require valid latitude and longitude values.

---

## 23. Exported Functions

The service exports:

```js
module.exports = {
  getAllPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant,
  getPlantDashboard,
  getPlantLocations,
  updatePlant,
  deletePlant,
};
```

The source currently contains duplicate `updatePlant` and `deletePlant` entries in the export object. JavaScript resolves duplicate object keys to the later occurrence.

---

## 24. Summary

`plantService.js` contains the database and business logic supporting the Plants module.

It handles:

```text
Plant Listing
Plant Search
Plant Filtering
Pagination
Plant Details
Plant Creation
Plant Updates
Soft Deletion
Plant Dashboard Statistics
Plant Locations
```

The service sits between the Plant controller and the database layer.
