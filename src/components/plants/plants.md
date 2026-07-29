Perfect. Since your frontend is wired to these endpoints, here are the Thunder Client requests to verify everything end-to-end.

---

# 1. Create Plant

### Method

```http
POST
```

### Endpoint

```http
http://localhost:5002/api/plants
```

### Body (JSON)

```json
{
  "plant_name": "KR Puram Plant",
  "plant_type": "Dry Waste",
  "city": "Bangalore",
  "zone": "East Corporation",
  "division": "Mahadevapura",
  "ward": "KR Puram",
  "plant_manager": "Ramesh Kumar",
  "capacity_ton_per_day": 250,
  "vehicles_enrolled": 18,
  "total_waste_collected": 0,
  "latitude": 12.9986,
  "longitude": 77.6954,
  "status": "ACTIVE"
}
```

### Expected Response

```json
{
  "success": true,
  "data": {
    ...
  }
}
```

---

# 2. Get All Plants

### Method

```http
GET
```

### Endpoint

```http
http://localhost:5002/api/plants
```

No body required.

Use this to verify the newly created plant appears in the directory.

---

# 3. Update Plant

### Method

```http
PUT
```

### Endpoint

Example:

```http
http://localhost:5002/api/plants/2
```

(Change `2` to the actual plant ID.)

### Body

```json
{
  "plant_name": "KR Puram Plant Updated",
  "plant_type": "Dry Waste",
  "city": "Bangalore",
  "zone": "East Corporation",
  "division": "Mahadevapura",
  "ward": "KR Puram",
  "plant_manager": "Suresh Kumar",
  "capacity_ton_per_day": 300,
  "vehicles_enrolled": 22,
  "total_waste_collected": 25,
  "latitude": 12.9986,
  "longitude": 77.6954,
  "status": "ACTIVE"
}
```

### Expected Response

```json
{
  "success": true,
  "data": {
    ...
  }
}
```

---

# 4. Delete Plant

### Method

```http
DELETE
```

### Endpoint

```http
http://localhost:5002/api/plants/2
```

(Change `2` to the target plant ID.)

### Body

❌ No body required.

### Expected Response

```json
{
  "success": true,
  "message": "Plant deleted successfully."
}
```

(or whatever message your backend returns)

---

# 5. Dashboard KPIs

### Method

```http
GET
```

### Endpoint

```http
http://localhost:5002/api/plants/dashboard
```

This verifies the KPI cards on the Plant Overview page.

---

# 6. Plant Locations (Map)

### Method

```http
GET
```

### Endpoint

```http
http://localhost:5002/api/plants/locations
```

This endpoint supplies the latitude and longitude used by the Leaflet map.

---

# 7. Verify Updated Data

After creating or updating a plant, call:

```http
GET http://localhost:5002/api/plants
```

to confirm the changes are reflected.

---

## Complete endpoint summary

| Function        | Method | Endpoint                |
| --------------- | ------ | ----------------------- |
| Create Plant    | POST   | `/api/plants`           |
| Get All Plants  | GET    | `/api/plants`           |
| Update Plant    | PUT    | `/api/plants/:id`       |
| Delete Plant    | DELETE | `/api/plants/:id`       |
| Dashboard KPIs  | GET    | `/api/plants/dashboard` |
| Plant Locations | GET    | `/api/plants/locations` |

These are the endpoints your Plant frontend currently depends on, so testing them in Thunder Client will verify both the backend and the frontend integration.
