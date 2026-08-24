# plantRoutes.js Documentation

## 1. File Overview

**File:** `plantRoutes.js`  
**Location:** `src/routes/plantRoutes.js`

The Plants router defines the HTTP endpoints for the Plants module.

In `app.js`, it is mounted at:

```text
/api/plants
```

Therefore the effective endpoints are:

```text
GET    /api/plants
GET    /api/plants/:id
POST   /api/plants
PUT    /api/plants/:id
DELETE /api/plants/:id
GET    /api/plants/dashboard
GET    /api/plants/locations
```

---

## 2. Imported Dependencies

The router imports:

```text
express
authMiddleware
checkPermission
plantController
```

The controller functions used are:

```text
getAllPlants
getPlantById
createPlant
updatePlant
deletePlant
getPlantDashboard
getPlantLocations
```

### Important

The current route definitions do not attach `authMiddleware` or `checkPermission` to the listed routes, even though those modules are imported in the file.

---

# 3. GET /api/plants/dashboard

Calls:

```text
getPlantDashboard
```

Returns aggregate plant statistics.

This route is declared before:

```text
/:id
```

so `dashboard` is treated as a static route.

---

# 4. GET /api/plants/locations

Calls:

```text
getPlantLocations
```

Returns active plant records containing map coordinates.

---

# 5. GET /api/plants

Calls:

```text
getAllPlants
```

Supports query parameters processed by the service:

```text
page
limit
search
city
zone
division
ward
```

---

# 6. GET /api/plants/:id

Calls:

```text
getPlantById
```

The ID is obtained from:

```text
req.params.id
```

---

# 7. POST /api/plants

Calls:

```text
createPlant
```

The plant information is received through:

```text
req.body
```

The controller returns HTTP `201` after successful creation.

---

# 8. PUT /api/plants/:id

Calls:

```text
updatePlant
```

Inputs:

```text
req.params.id
req.body
```

---

# 9. DELETE /api/plants/:id

Calls:

```text
deletePlant
```

The underlying service performs a soft delete by setting:

```text
status = INACTIVE
```

---

# 10. Route Flow

```text
Frontend
   ↓
/api/plants/*
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

# 11. Static Route Ordering

The router intentionally places:

```text
/dashboard
/locations
```

before:

```text
/:id
```

This prevents the static route names from being interpreted as plant IDs.

---

# 12. Summary

`plantRoutes.js` defines the REST interface for the Plants module and connects each HTTP operation to its corresponding controller.
