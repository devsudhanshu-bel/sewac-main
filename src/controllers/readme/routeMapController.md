# routeMapController.js Documentation

## 1. File Overview

The Route Map Controller exposes live vehicle-location data for the map interface.

It delegates validation and business logic to:

```text
routeMapService
```

The controller accepts optional geographic and hierarchy filters.

---

# 2. getLiveRouteMap()

The method:

```text
getLiveRouteMap(req, res)
```

reads the following query parameters:

```text
latitude
longitude
cityId
zoneId
divisionId
wardId
```

---

# 3. Service Delegation

All supplied query parameters are passed to:

```text
routeMapService.getLiveRouteMap()
```

as:

```json
{
  "latitude": "...",
  "longitude": "...",
  "cityId": "...",
  "zoneId": "...",
  "divisionId": "...",
  "wardId": "..."
}
```

The service performs the actual validation and business logic.

---

# 4. Successful Response

A successful request returns:

```text
HTTP 200
```

with:

```json
{
  "success": true,
  "message": "...",
  "data": "..."
}
```

---

# 5. Vehicle Availability Message

The controller checks:

```text
data.vehicles
```

and determines whether it contains vehicles.

If vehicles exist:

```text
Live vehicle locations fetched successfully.
```

If no vehicles exist:

```text
No vehicles found for the selected ward.
```

No-vehicle results are still treated as successful requests.

---

# 6. Error Status Handling

If the service provides:

```text
error.statusCode
```

and it is an integer, that value is used as the HTTP status.

Otherwise:

```text
HTTP 500
```

is used.

---

# 7. Client Error Protection

For expected client-side errors:

```text
400–499
```

the original:

```text
error.message
```

is returned.

For unexpected server/database errors:

```text
500
```

the controller returns:

```text
Unable to fetch live vehicle locations.
```

This prevents raw SQL/database errors from being exposed to the client.

---

# 8. Error Response

The error response structure is:

```json
{
  "success": false,
  "message": "...",
  "data": null
}
```

---

# 9. Complete Flow

```text
Request
  ↓
Read Query Filters
  ↓
routeMapService.getLiveRouteMap()
  ↓
Vehicle Data
  ↓
Check Vehicle Availability
  ↓
HTTP 200
```

Errors:

```text
Service Error
  ↓
Read statusCode
  ↓
4xx → Expose expected message
5xx → Generic message
```

---

# 10. Export

The controller exports:

```text
getLiveRouteMap
```

---

# 11. Summary

`routeMapController.js` is the live vehicle-location HTTP controller. It accepts optional GPS and geographic hierarchy filters, delegates processing to `routeMapService`, treats an empty vehicle result as a successful response, preserves expected client error messages, and hides raw server/database errors behind a generic message.
