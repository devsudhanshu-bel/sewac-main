# vehicleController.js Documentation

## 1. File Overview

The Vehicle Controller provides HTTP endpoints for vehicle management and vehicle analytics.

It delegates business logic to:

```text
vehicleService
```

The available operations are:

```text
Get All Vehicles
Get Vehicle
Create Vehicle
Update Vehicle
Delete Vehicle
Get Vehicle Summary
Get Vehicle Directory
Get Average Weight by Zone
```

---

# 2. getAllVehicles()

Passes:

```text
req.query
```

to:

```text
vehicleService.getAllVehicles()
```

This allows the service to process available query filters.

---

# 3. Get All Vehicles Response

Successful requests return:

```text
HTTP 200
```

with:

```json
{
  "success": true,
  "data": "..."
}
```

Errors return:

```text
HTTP 500
```

---

# 4. getVehicleById()

Reads:

```text
req.params.vehicleId
```

and passes it to:

```text
vehicleService.getVehicleById()
```

Successful requests return:

```text
HTTP 200
```

---

# 5. createVehicle()

Passes:

```text
req.body
```

to:

```text
vehicleService.createVehicle()
```

Successful creation returns:

```text
HTTP 201
```

with:

```json
{
  "success": true,
  "data": "..."
}
```

---

# 6. updateVehicle()

Reads:

```text
req.params.vehicleId
```

and:

```text
req.body
```

and calls:

```text
vehicleService.updateVehicle(vehicleId, body)
```

Successful updates return:

```text
HTTP 200
```

---

# 7. deleteVehicle()

Reads:

```text
req.params.vehicleId
```

and calls:

```text
vehicleService.deleteVehicle()
```

Successful deletion returns:

```text
HTTP 200
```

---

# 8. getVehicleSummary()

Calls:

```text
vehicleService.getVehicleSummary()
```

and returns the resulting summary.

Successful requests return:

```text
HTTP 200
```

---

# 9. getVehicleDirectory()

Passes:

```text
req.query
```

to:

```text
vehicleService.getVehicleDirectory()
```

This supports directory-style retrieval using query filters.

---

# 10. getAverageWeightByZone()

Reads:

```text
req.query.date
```

and passes it to:

```text
vehicleService.getAverageWeightByZone(date)
```

The returned data represents average vehicle/waste weight information grouped by zone.

---

# 11. Common Error Handling

All controller methods log errors and return:

```text
HTTP 500
```

with:

```json
{
  "success": false,
  "message": "..."
}
```

The underlying error message is passed through.

---

# 12. Complete Flow

```text
HTTP Request
     ↓
Read Params / Query / Body
     ↓
vehicleService
     ↓
Return Data
```

For errors:

```text
Service Error
     ↓
console.error()
     ↓
HTTP 500
```

---

# 13. Exports

The controller exports:

```text
getAllVehicles
getVehicleById
createVehicle
updateVehicle
deleteVehicle
getVehicleSummary
getVehicleDirectory
getAverageWeightByZone
```

---

# 14. Summary

`vehicleController.js` is the HTTP controller for vehicle management and analytics. It delegates CRUD operations, vehicle directory retrieval, vehicle summaries, and zone-level average-weight calculations to `vehicleService`, while consistently returning structured success responses and HTTP 500 responses for unexpected errors.
