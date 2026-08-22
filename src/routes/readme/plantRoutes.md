# plantRoutes.js Documentation

## 1. File Overview

### File Name
`plantRoutes.js`

### File Location
`src/routes/plantRoutes.js`

### Purpose

`plantRoutes.js` defines the REST API endpoints for the Plants module.

It connects HTTP requests to functions in `plantController.js`.

---

## 2. Dependencies

The route imports Express:

```js
const express = require("express");
```

It imports the Plant controller functions:

```js
const {
  getAllPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant,
  getPlantDashboard,
  getPlantLocations
} = require("../controllers/plantController");
```

---

## 3. Endpoints

| Method | Route | Controller |
|---|---|---|
| GET | `/` | `getAllPlants` |
| GET | `/dashboard` | `getPlantDashboard` |
| GET | `/locations` | `getPlantLocations` |
| GET | `/:id` | `getPlantById` |
| POST | `/` | `createPlant` |
| PUT | `/:id` | `updatePlant` |
| DELETE | `/:id` | `deletePlant` |

The final URL depends on the prefix used when this router is mounted.

---

## 4. GET /

```js
router.get("/", getAllPlants);
```

Retrieves the plant directory.

Query parameters are forwarded through `req.query`.

The service supports pagination and filtering.

---

## 5. GET /dashboard

```js
router.get("/dashboard", getPlantDashboard);
```

Retrieves Plant dashboard statistics.

---

## 6. GET /locations

```js
router.get("/locations", getPlantLocations);
```

Retrieves active plant locations.

Only plants with non-null latitude and longitude values are returned by the service.

---

## 7. GET /:id

```js
router.get("/:id", getPlantById);
```

Retrieves one plant using its route ID.

Example structure:

```text
GET /plants/10
```

The `10` value is available to the controller as:

```js
req.params.id
```

---

## 8. POST /

```js
router.post("/", createPlant);
```

Creates a new plant.

Plant information is provided in:

```js
req.body
```

---

## 9. PUT /:id

```js
router.put("/:id", updatePlant);
```

Updates an existing plant.

The request contains:

```text
Plant ID → req.params.id
Updated Data → req.body
```

---

## 10. DELETE /:id

```js
router.delete("/:id", deletePlant);
```

Requests deletion of a plant.

The Plant service implements this as a soft delete by changing the status to `INACTIVE`.

---

## 11. Route Ordering

The specific routes:

```text
/dashboard
/locations
```

are declared before:

```text
/:id
```

This ensures requests to `/dashboard` and `/locations` are handled by their dedicated routes rather than being interpreted as plant IDs.

---

## 12. Complete Route Flow

```text
Frontend
   ↓
HTTP Request
   ↓
plantRoutes.js
   ↓
plantController.js
   ↓
plantService.js
   ↓
Database
   ↓
JSON Response
   ↓
Frontend
```

---

## 13. Export

The router is exported using:

```js
module.exports = router;
```

---

## 14. Summary

`plantRoutes.js` provides the REST endpoints required by the Plants frontend.

It separates URL definitions from controller logic and service/database operations.
