# plantController.js Documentation

## 1. File Overview

**File:** `plantController.js`  
**Location:** `src/controllers/plantController.js`

`plantController.js` is the HTTP controller layer for the Plants module.

It receives requests from `plantRoutes.js`, calls the corresponding functions in `plantService.js`, and returns JSON responses.

The controller does not contain the main plant business/data logic.

---

## 2. Service Dependency

```js
const plantService = require("../services/plantService");
```

The relationship is:

```text
HTTP Request
     ↓
plantRoutes.js
     ↓
plantController.js
     ↓
plantService.js
     ↓
Database
```

---

## 3. Exported Functions

The controller exports:

```text
getAllPlants
getPlantById
createPlant
updatePlant
deletePlant
getPlantDashboard
getPlantLocations
```

---

## 4. getAllPlants()

### Purpose

Retrieves the plant directory.

### Service Call

```js
plantService.getAllPlants(req.query)
```

The complete query object is passed to the service.

This allows the service to process:

```text
page
limit
search
city
zone
division
ward
```

### Success

Returns:

```http
200 OK
```

with:

```json
{
  "success": true,
  "data": {}
}
```

### Error

Returns:

```http
500 Internal Server Error
```

with:

```json
{
  "success": false,
  "message": "..."
}
```

---

## 5. getPlantById()

### Endpoint Layer

Receives:

```text
req.params.id
```

and calls:

```js
plantService.getPlantById(req.params.id)
```

### Success

Returns HTTP `200`.

### Error

Returns HTTP `500`.

---

## 6. createPlant()

Receives the request body:

```js
req.body
```

and calls:

```js
plantService.createPlant(req.body)
```

On success it returns:

```http
201 Created
```

with:

```json
{
  "success": true,
  "data": {}
}
```

---

## 7. updatePlant()

Receives:

```text
req.params.id
req.body
```

and calls:

```js
plantService.updatePlant(
  req.params.id,
  req.body
)
```

A successful update returns HTTP `200`.

---

## 8. deletePlant()

Receives the plant ID from:

```text
req.params.id
```

and calls:

```js
plantService.deletePlant(req.params.id)
```

The service performs a soft delete by changing the plant status to `INACTIVE`.

The controller returns HTTP `200` on success.

---

## 9. getPlantDashboard()

Calls:

```js
plantService.getPlantDashboard()
```

No request body or route parameter is required.

The returned dashboard statistics are wrapped inside:

```json
{
  "success": true,
  "data": {}
}
```

---

## 10. getPlantLocations()

Calls:

```js
plantService.getPlantLocations()
```

The function returns the active plant locations used by map-related frontend functionality.

---

## 11. Error Handling

All controller methods follow:

```text
try
  ↓
service call
  ↓
success response
```

or:

```text
catch
  ↓
HTTP 500
  ↓
success: false
message: error.message
```

---

## 12. Data Flow

```text
Frontend
   ↓
/api/plants
   ↓
plantRoutes
   ↓
plantController
   ↓
plantService
   ↓
PostgreSQL / Prisma
   ↓
plantService
   ↓
plantController
   ↓
JSON Response
```

---

## 13. Summary

`plantController.js` keeps HTTP request handling separate from plant business/data operations. It exposes the complete Plants API controller interface for listing, viewing, creating, updating, soft deleting, dashboard statistics, and map locations.
