# overviewRoutes.js Documentation

## 1. File Overview

### File Name
`overviewRoutes.js`

### File Location
`src/routes/overviewRoutes.js`

### Purpose

`overviewRoutes.js` defines the HTTP endpoints for the SEWAC Admin Overview module.

The routes connect incoming requests to controller functions in `overviewController.js`.

---

## 2. Dependencies

The file imports:

```js
const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const checkPermission = require("../middlewares/checkPermission");
```

The controller functions are imported from:

```js
const {
  getSummary,
  getVehicleSummary,
  getGenerationTrend,
  getMapData,
  getOverviewFilters
} = require("../controllers/overviewController");
```

A new Express router is created using:

```js
const router = express.Router();
```

---

## 3. Overview Endpoints

The router defines these endpoints:

| Method | Endpoint | Controller |
|---|---|---|
| GET | `/summary` | `getSummary` |
| GET | `/vehicle-summary` | `getVehicleSummary` |
| GET | `/generation-trend` | `getGenerationTrend` |
| GET | `/map` | `getMapData` |
| GET | `/filters` | `getOverviewFilters` |

The final URL depends on the prefix used when this router is mounted by the main application.

---

## 4. GET /summary

```js
router.get("/summary", getSummary);
```

This endpoint retrieves the main Overview summary.

The controller receives query parameters such as:

```text
date
cityId
zoneId
divisionId
wardId
```

---

## 5. GET /vehicle-summary

```js
router.get("/vehicle-summary", getVehicleSummary);
```

This endpoint retrieves vehicle summary information.

Supported query parameters include:

```text
cityId
zoneId
divisionId
wardId
```

---

## 6. GET /generation-trend

```js
router.get("/generation-trend", getGenerationTrend);
```

This endpoint retrieves waste-generation trend information.

Supported query parameters include:

```text
date
cityId
zoneId
divisionId
wardId
```

---

## 7. GET /map

```js
router.get("/map", getMapData);
```

This endpoint retrieves Overview map information.

Supported query parameters:

```text
cityId
zoneId
```

---

## 8. GET /filters

```js
router.get(
  "/filters",
  getOverviewFilters
);
```

This endpoint retrieves Overview filter information.

It does not require query parameters.

---

## 9. Route-to-Controller Mapping

```text
/summary
    ↓
getSummary()

/vehicle-summary
    ↓
getVehicleSummary()

/generation-trend
    ↓
getGenerationTrend()

/map
    ↓
getMapData()

/filters
    ↓
getOverviewFilters()
```

---

## 10. Middleware Notes

`authMiddleware` and `checkPermission` are imported in this file.

In the current route definitions, the listed endpoints are connected directly to their controller functions rather than passing those imported middleware functions into the route declarations.

Therefore, authentication/permission enforcement for these specific route declarations is not performed by these lines themselves.

---

## 11. Export

The router is exported using:

```js
module.exports = router;
```

The main server/application can mount this router under an Overview API prefix.

---

## 12. Complete Request Flow

```text
Frontend
   ↓
HTTP GET Request
   ↓
overviewRoutes.js
   ↓
overviewController.js
   ↓
overviewService.js
   ↓
Database / Data Sources
   ↓
JSON Response
   ↓
Frontend
```

---

## 13. Summary

`overviewRoutes.js` is responsible only for defining Overview HTTP endpoints and connecting them to the correct controller functions.

It keeps route definitions separate from request processing and service/database logic.
