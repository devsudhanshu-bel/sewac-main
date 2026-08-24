# complaintsGrev.service.js Documentation

## 1. File Overview

**File:** `complaintsGrev.service.js`  
**Location:** `src/complaintsGrev/service/complaintsGrev.service.js`

This service generates the complaint-location dataset used by the Complaint Grievance Map.

Its main responsibilities are:

```text
Retrieve Bengaluru boundary
Retrieve complaint coordinates
Validate coordinates
Check whether complaints are inside Bengaluru
Format map locations
Return boundary + statistics
```

---

# 2. Bengaluru Boundary

The service retrieves Bengaluru's city record from the Master Citizen database.

The query reads:

```text
city_id
city_name
geo_boundary
city_table_name
```

using the configured:

```text
BENGALURU_CITY_ID
```

If the city cannot be found, the service throws an error.

---

# 3. Boundary Normalization

The service normalizes the stored geographic boundary.

It supports:

```text
GeoJSON Polygon
GeoJSON MultiPolygon
Raw Polygon coordinates
Raw MultiPolygon coordinates
```

Unsupported/invalid boundary structures result in:

```text
false
```

when performing point containment checks.

---

# 4. Point-In-Ring Algorithm

The service contains a point-in-ring calculation based on ray intersection.

It checks whether:

```text
longitude
latitude
```

falls inside the supplied ring.

---

# 5. Point-In-Polygon

For a Polygon:

```text
outer ring
+
optional hole rings
```

the point must be:

```text
inside outer ring
AND
outside every hole
```

---

# 6. Point-In-MultiPolygon

For a MultiPolygon, the service checks each polygon until a containing polygon is found.

A point is considered inside when at least one polygon contains it.

---

# 7. getBengaluruCityBoundary()

This internal function:

1. Queries the Master Citizen database.
2. Finds Bengaluru using `BENGALURU_CITY_ID`.
3. Reads `geo_boundary`.
4. Normalizes the boundary.
5. Returns the normalized boundary.

It throws errors when:

```text
Bengaluru city does not exist
geo_boundary is empty
```

---

# 8. getComplaintLocations()

## Step 1 — Boundary

The service first loads:

```text
Bengaluru boundary
```

---

## Step 2 — Complaint Query

It retrieves complaints from:

```text
citizen_complaints
```

with:

```text
latitude IS NOT NULL
longitude IS NOT NULL
```

The selected fields include:

```text
id
ticket_number
phone_number
title
description
category
image_url
latitude
longitude
address
status
```

Results are ordered by:

```text
created_at DESC
```

---

# 9. Coordinate Validation

Each latitude and longitude is converted using:

```js
Number()
```

The service rejects coordinates that are not finite numbers.

It also rejects coordinates outside:

```text
Latitude:  -90 to 90
Longitude: -180 to 180
```

---

# 10. Bengaluru Boundary Filtering

For each valid coordinate, the service runs:

```text
pointInsideGeoBoundary()
```

If the complaint is outside Bengaluru:

```text
outsideBengaluruCount++
```

and the complaint is excluded from the returned map locations.

---

# 11. Map Location Format

Valid complaints are converted to:

```json
{
  "lat": 12.9716,
  "long": 77.5946,
  "data": {
    "id": 1,
    "ticket_number": "...",
    "phone_number": "...",
    "title": "...",
    "description": "...",
    "category": "...",
    "image_url": "...",
    "address": "...",
    "status": "CLOSED"
  }
}
```

---

# 12. Returned Service Object

The service returns:

```json
{
  "boundary": {},
  "locations": [],
  "totalDatabaseComplaints": 0,
  "validBengaluruComplaints": 0,
  "outsideBengaluru": 0,
  "invalidCoordinates": 0
}
```

---

# 13. Statistics

The service tracks:

### totalDatabaseComplaints

Number of complaint records returned by the coordinate query.

### validBengaluruComplaints

Number of complaints with valid coordinates that are inside Bengaluru.

### outsideBengaluru

Number of valid-coordinate complaints outside the Bengaluru boundary.

### invalidCoordinates

Number of records with invalid or out-of-range coordinates.

---

# 14. Database Flow

```text
Master Citizen DB
      ↓
Bengaluru geo_boundary
      ↓
Normalize boundary

Complaint DB
      ↓
Complaint coordinates
      ↓
Validate coordinates
      ↓
Point-in-polygon check
      ↓
Valid Bengaluru locations
```

---

# 15. Error Handling

The service logs:

```text
COMPLAINT GREVANCE MAP SERVICE ERROR
```

and rethrows the error.

The controller then converts it into the HTTP error response.

---

# 16. Important Implementation Notes

- The service does not return complaints outside Bengaluru.
- Invalid coordinates are excluded.
- Latitude/longitude ranges are validated before geographic testing.
- Polygon holes are handled.
- MultiPolygon boundaries are handled.
- The Bengaluru boundary is obtained from the Master Citizen database.
- Complaint data comes from `citizen_complaints`.
- The service returns both boundary information and map locations.

---

# 17. Summary

`complaintsGrev.service.js` is the geographic processing layer for the Complaint Grievance Map. It combines complaint coordinate retrieval with Bengaluru boundary validation to ensure that the frontend map receives only valid complaint locations within the configured city boundary.
