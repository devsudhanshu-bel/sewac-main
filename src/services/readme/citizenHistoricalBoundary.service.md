# citizenHistoricalBoundary.service.js Documentation

## 1. File Overview

**File:** `citizenHistoricalBoundary.service.js`\
**Location:** `src/services/citizenHistoricalBoundary.service.js`

This service provides the business logic for resolving a GPS coordinate
against the configured geographic hierarchy.

It handles:

``` text
Point-in-polygon detection
MultiPolygon detection
GeoJSON boundary normalization
Coordinate type inference
Feature / FeatureCollection handling
City resolution
Zone resolution
Division resolution
Ward resolution
Boundary hierarchy caching
GPS point resolution
```

------------------------------------------------------------------------

## 2. Dependencies

The service uses:

``` text
citizenHistoricalBoundary.repository
```

The repository is responsible for loading the complete geographic
boundary hierarchy.

The service performs the actual geographic point-in-boundary checks in
memory.

------------------------------------------------------------------------

# 3. pointInPolygon()

This function determines whether a GPS point lies inside a polygon.

It uses the:

``` text
Ray-casting algorithm
```

The function receives:

``` text
latitude
longitude
polygon
```

GeoJSON coordinates are interpreted as:

``` text
[longitude, latitude]
```

Therefore:

``` text
x = longitude
y = latitude
```

------------------------------------------------------------------------

## Validation

The function returns:

``` text
false
```

when:

-   `polygon` is not an array
-   The polygon contains fewer than 3 points
-   Latitude is not numeric/finite
-   Longitude is not numeric/finite
-   A polygon coordinate contains invalid numeric values

Invalid coordinate pairs inside the polygon are skipped.

------------------------------------------------------------------------

## Ray-Casting

For every polygon edge, the service checks whether a horizontal ray from
the point intersects the edge.

Every intersection toggles:

``` text
inside = true / false
```

After processing all edges, the final value determines whether the point
lies inside the polygon.

------------------------------------------------------------------------

# 4. pointInMultiPolygon()

This function determines whether a point lies inside a collection of
polygon geometries.

It receives:

``` text
latitude
longitude
polygons
```

If `polygons` is not an array, it returns:

``` text
false
```

------------------------------------------------------------------------

## Exterior Boundary

For each polygon:

``` text
polygon[0]
```

is treated as the exterior ring.

The point must first be inside this exterior ring.

------------------------------------------------------------------------

## Holes

Any remaining rings are treated as holes:

``` text
polygon[1]
polygon[2]
...
```

If the point falls inside one of these holes, that polygon does not
match.

The function returns:

``` text
true
```

when the point is inside an exterior ring and outside all of its holes.

Otherwise it returns:

``` text
false
```

------------------------------------------------------------------------

# 5. normalizeBoundary()

This function converts different boundary representations into a
normalized GeoJSON-style structure.

It supports:

``` text
JSON strings
Polygon
MultiPolygon
Feature
FeatureCollection
Objects containing coordinates
Direct coordinate arrays
```

------------------------------------------------------------------------

## Null / Undefined

If the supplied boundary is:

``` text
null
undefined
```

the function returns:

``` text
null
```

------------------------------------------------------------------------

## JSON String

When the boundary is a string, the service attempts:

``` js
JSON.parse()
```

If parsing fails, it returns:

``` text
null
```

------------------------------------------------------------------------

## GeoJSON Feature

For a GeoJSON Feature:

``` text
type = "Feature"
geometry = ...
```

the service returns the contained geometry.

------------------------------------------------------------------------

## GeoJSON FeatureCollection

For a GeoJSON FeatureCollection, the service preserves:

``` text
type
features
```

and returns the FeatureCollection structure.

------------------------------------------------------------------------

## Polygon

A Polygon with a valid `coordinates` array is normalized as:

``` json
{
  "type": "Polygon",
  "coordinates": []
}
```

------------------------------------------------------------------------

## MultiPolygon

A MultiPolygon with a valid `coordinates` array is normalized as:

``` json
{
  "type": "MultiPolygon",
  "coordinates": []
}
```

------------------------------------------------------------------------

## Coordinate Objects

Objects containing a `coordinates` array are assigned a type using:

``` text
inferCoordinateType()
```

------------------------------------------------------------------------

## Direct Coordinate Arrays

A raw coordinate array is also converted into:

``` text
{
  type,
  coordinates
}
```

If no supported coordinate type can be inferred, the function returns:

``` text
null
```

------------------------------------------------------------------------

# 6. inferCoordinateType()

This helper attempts to determine whether a raw coordinate structure
represents a:

``` text
Polygon
MultiPolygon
```

------------------------------------------------------------------------

## Polygon Detection

A Polygon is expected in the form:

``` text
[
  [
    [longitude, latitude],
    [longitude, latitude]
  ]
]
```

When the nested structure matches the expected Polygon format, the
function returns:

``` text
"Polygon"
```

------------------------------------------------------------------------

## MultiPolygon Detection

A MultiPolygon is expected in the form:

``` text
[
  [
    [
      [longitude, latitude],
      [longitude, latitude]
    ]
  ]
]
```

When the nested structure matches the expected MultiPolygon format, the
function returns:

``` text
"MultiPolygon"
```

------------------------------------------------------------------------

## Unsupported Structure

If the coordinate structure cannot be identified, the function returns:

``` text
null
```

------------------------------------------------------------------------

# 7. pointInsideBoundary()

This function provides the main boundary-checking abstraction.

It first calls:

``` js
normalizeBoundary()
```

If normalization fails, it returns:

``` text
false
```

------------------------------------------------------------------------

## FeatureCollection

For a FeatureCollection, the service checks every feature recursively.

If any feature contains the point, it returns:

``` text
true
```

If none match:

``` text
false
```

------------------------------------------------------------------------

## Polygon

For a Polygon, the coordinates are passed to:

``` text
pointInMultiPolygon()
```

as a single polygon.

------------------------------------------------------------------------

## MultiPolygon

For a MultiPolygon, the complete coordinate collection is passed to:

``` text
pointInMultiPolygon()
```

------------------------------------------------------------------------

## Unsupported Geometry

If the normalized boundary is not a supported:

``` text
FeatureCollection
Polygon
MultiPolygon
```

the function returns:

``` text
false
```

------------------------------------------------------------------------

# 8. findCityForPoint()

This function searches the loaded city hierarchy for the city containing
a GPS coordinate.

It receives:

``` text
latitude
longitude
cities
```

If `cities` is not an array, it returns:

``` text
null
```

For every city, it checks:

``` text
city.cityBoundary
```

using:

``` text
pointInsideBoundary()
```

The first matching city is returned.

If no city contains the point:

``` text
null
```

------------------------------------------------------------------------

# 9. findZoneForPoint()

This function searches for the zone containing the GPS coordinate.

It receives:

``` text
latitude
longitude
city
```

The city must contain:

``` text
city.zones
```

as an array.

For each zone, the service checks:

``` text
zone.zoneBoundary
```

using:

``` text
pointInsideBoundary()
```

The first matching zone is returned.

If no zone matches:

``` text
null
```

------------------------------------------------------------------------

# 10. findDivisionForPoint()

This function searches for the division containing the GPS coordinate.

It receives:

``` text
latitude
longitude
zone
```

The zone must contain:

``` text
zone.divisions
```

as an array.

For every division, the service checks:

``` text
division.divisionBoundary
```

The first matching division is returned.

If no division matches:

``` text
null
```

------------------------------------------------------------------------

# 11. findWardForPoint()

This function searches for the ward containing the GPS coordinate.

It receives:

``` text
latitude
longitude
division
```

The division must contain:

``` text
division.wards
```

as an array.

For every ward, the service checks:

``` text
ward.wardBoundary
```

The first matching ward is returned.

If no ward matches:

``` text
null
```

------------------------------------------------------------------------

# 12. loadBoundaryCache()

This function loads the complete geographic hierarchy from the
repository.

It calls:

``` js
repository.getCompleteBoundaryHierarchy()
```

The returned hierarchy is intended to be kept in memory and reused for
GPS resolution.

The architecture is:

``` text
Database
    ↓
Complete Boundary Hierarchy
    ↓
RAM / Boundary Cache
    ↓
GPS Resolution
```

This avoids querying the database for every telemetry/GPS point.

------------------------------------------------------------------------

# 13. resolveGpsPoint()

This is the main GPS-resolution function.

It receives:

``` text
latitude
longitude
boundaryCache
```

The resolution hierarchy is:

``` text
GPS Point
    ↓
City
    ↓
Zone
    ↓
Division
    ↓
Ward
```

------------------------------------------------------------------------

## Coordinate Normalization

Latitude and longitude are converted using:

``` js
Number(latitude)
Number(longitude)
```

The service requires both values to be finite numbers.

If either coordinate is invalid, it returns:

``` json
{
  "matched": false,
  "reason": "INVALID_COORDINATES"
}
```

------------------------------------------------------------------------

# 14. City Resolution

The service searches the boundary cache using:

``` text
findCityForPoint()
```

If no city contains the coordinate, the response is:

``` json
{
  "matched": false,
  "reason": "OUTSIDE_CITY"
}
```

No lower-level geographic resolution is attempted.

------------------------------------------------------------------------

# 15. Zone Resolution

After finding a city, the service searches its zones.

If no matching zone is found, it returns:

``` json
{
  "matched": false,
  "reason": "ZONE_NOT_FOUND",
  "city": {
    "cityId": "...",
    "cityName": "..."
  }
}
```

The response preserves the matched city information.

------------------------------------------------------------------------

# 16. Division Resolution

After finding a zone, the service searches its divisions.

If no matching division is found, it returns:

``` json
{
  "matched": false,
  "reason": "DIVISION_NOT_FOUND",
  "city": {
    "cityId": "...",
    "cityName": "..."
  },
  "zone": {
    "zoneId": "...",
    "zoneName": "..."
  }
}
```

The matched city and zone are retained in the response.

------------------------------------------------------------------------

# 17. Ward Resolution

After finding a division, the service searches its wards.

If no matching ward is found, it returns:

``` json
{
  "matched": false,
  "reason": "WARD_NOT_FOUND",
  "city": {
    "cityId": "...",
    "cityName": "..."
  },
  "zone": {
    "zoneId": "...",
    "zoneName": "..."
  },
  "division": {
    "divisionId": "...",
    "divisionName": "..."
  }
}
```

The successfully resolved hierarchy levels are preserved.

------------------------------------------------------------------------

# 18. Successful GPS Resolution

When the GPS coordinate matches all four hierarchy levels, the service
returns:

``` json
{
  "matched": true,
  "city": {
    "cityId": "...",
    "cityName": "..."
  },
  "zone": {
    "zoneId": "...",
    "zoneName": "..."
  },
  "division": {
    "divisionId": "...",
    "divisionName": "..."
  },
  "ward": {
    "wardId": "...",
    "wardNo": "...",
    "wardName": "...",
    "wardTableName": "..."
  }
}
```

The ward response therefore includes both its identifying information
and its configured table name.

------------------------------------------------------------------------

# 19. Geographic Resolution Flow

The complete resolution process is:

``` text
Latitude + Longitude
        ↓
Validate coordinates
        ↓
Find City Boundary
        ↓
Find Zone Boundary
        ↓
Find Division Boundary
        ↓
Find Ward Boundary
        ↓
Return Geographic Hierarchy
```

At every level, failure stops the resolution process and returns the
appropriate reason.

------------------------------------------------------------------------

# 20. Boundary Processing Flow

Boundary data can originate in several forms:

``` text
JSON String
    ↓
Parsed Object
    ↓
GeoJSON Feature
    ↓
Geometry
```

or:

``` text
Raw Coordinates
    ↓
Coordinate Type Inference
    ↓
Polygon / MultiPolygon
```

The resulting normalized boundary is then processed using:

``` text
pointInsideBoundary()
    ↓
pointInMultiPolygon()
    ↓
pointInPolygon()
```

------------------------------------------------------------------------

# 21. Architecture

``` text
Repository
    ↓
Complete Boundary Hierarchy
    ↓
Boundary Cache
    ↓
resolveGpsPoint()
    │
    ├── findCityForPoint()
    │       ↓
    │   cityBoundary
    │
    ├── findZoneForPoint()
    │       ↓
    │   zoneBoundary
    │
    ├── findDivisionForPoint()
    │       ↓
    │   divisionBoundary
    │
    └── findWardForPoint()
            ↓
        wardBoundary
```

The geometric processing is performed entirely by the service after the
hierarchy has been loaded.

------------------------------------------------------------------------

# 22. Exported Functions

The service exports:

``` text
pointInPolygon
pointInMultiPolygon
normalizeBoundary
pointInsideBoundary
loadBoundaryCache
resolveGpsPoint
```

The following functions remain internal helpers and are not exported:

``` text
generateOTP
findCityForPoint
findZoneForPoint
findDivisionForPoint
findWardForPoint
inferCoordinateType
```

------------------------------------------------------------------------

# 23. Summary

`citizenHistoricalBoundary.service.js` is the geographic
boundary-resolution layer for GPS-based location classification.

It normalizes GeoJSON and coordinate data, performs ray-casting
point-in-polygon checks, supports Polygon and MultiPolygon boundaries
including holes, and resolves GPS coordinates through the complete:

``` text
City → Zone → Division → Ward
```

hierarchy.

The complete hierarchy is loaded through the repository and can be
cached in memory, allowing GPS points to be resolved without performing
a database query for every coordinate.
