# citizenHistoricalGpsResolver.service.js Documentation

## 1. File Overview

**File:** `citizenHistoricalGpsResolver.service.js`\
**Location:** `src/services/citizenHistoricalGpsResolver.service.js`

This service is responsible only for resolving GPS coordinates against
the citizen historical geographic boundary hierarchy.

The resolution flow is:

``` text
GPS
 ↓
City
 ↓
Zone
 ↓
Division
 ↓
Ward
```

It does not modify telemetry or historical/citizen data.

It handles:

``` text
Boundary cache loading
Boundary cache refresh
GPS coordinate resolution
Telemetry packet resolution
Ward table resolution
```

------------------------------------------------------------------------

## 2. Dependencies

The service uses:

``` text
citizenHistoricalBoundary.service
```

The boundary service provides:

``` text
Boundary cache loading
GPS point resolution
```

The resolver maintains its own in-memory reference to the loaded
boundary cache.

------------------------------------------------------------------------

# 3. Service Responsibility

The resolver is intentionally limited to location resolution.

It does **not**:

``` text
Modify telemetry
Insert telemetry
Insert historical data
Modify citizen tables
```

Its responsibility is to obtain the boundary hierarchy and resolve a GPS
coordinate against it.

------------------------------------------------------------------------

# 4. CitizenHistoricalGpsResolver Class

The service is implemented using:

``` js
class CitizenHistoricalGpsResolver
```

The class maintains:

``` js
this.boundaryCache
```

which is initially:

``` text
null
```

The cache is populated lazily when a GPS resolution is requested.

------------------------------------------------------------------------

# 5. Constructor

The constructor initializes:

``` js
this.boundaryCache = null;
```

No database operation or boundary loading is performed during
construction.

The boundary data is loaded only when required.

------------------------------------------------------------------------

# 6. loadBoundaries()

This method loads or refreshes the complete citizen historical boundary
cache.

It calls:

``` js
boundaryService.loadBoundaryCache()
```

The returned hierarchy is stored in:

``` text
this.boundaryCache
```

The method logs:

``` text
Loading citizen historical boundary cache...
```

before loading.

After loading, it logs:

``` text
Citizen historical boundary cache loaded.
```

The loaded cache is also returned.

------------------------------------------------------------------------

# 7. getBoundaryCache()

This method retrieves the currently loaded boundary cache.

It performs lazy loading.

If:

``` text
this.boundaryCache
```

does not exist, it calls:

``` js
loadBoundaries()
```

After the cache is available, it returns:

``` text
this.boundaryCache
```

Therefore the normal flow is:

``` text
getBoundaryCache()
      ↓
Cache exists?
   ↙       ↘
 YES       NO
  ↓         ↓
Return   loadBoundaries()
cache        ↓
          store cache
              ↓
          return cache
```

------------------------------------------------------------------------

# 8. refreshBoundaries()

This method explicitly refreshes the boundary cache.

It first clears the existing cache:

``` js
this.boundaryCache = null;
```

It then calls:

``` js
loadBoundaries()
```

The newly loaded hierarchy becomes the active cache.

The method returns the refreshed boundary cache.

The flow is:

``` text
Existing Cache
      ↓
Clear Cache
      ↓
Load Boundary Hierarchy
      ↓
Store New Cache
      ↓
Return New Cache
```

------------------------------------------------------------------------

# 9. resolve()

This is the main GPS-resolution method.

It receives:

``` text
latitude
longitude
```

The method first obtains the boundary cache using:

``` js
getBoundaryCache()
```

It then passes the coordinates and cache to:

``` js
boundaryService.resolveGpsPoint(
  latitude,
  longitude,
  cache
)
```

The result from the boundary service is returned directly.

------------------------------------------------------------------------

# 10. GPS Resolution Flow

The complete resolver flow is:

``` text
Latitude + Longitude
        ↓
getBoundaryCache()
        ↓
Boundary Cache
        ↓
boundaryService.resolveGpsPoint()
        ↓
City
        ↓
Zone
        ↓
Division
        ↓
Ward
```

The resolver itself does not perform the geometric calculations.

Those calculations are delegated to:

``` text
citizenHistoricalBoundary.service
```

------------------------------------------------------------------------

# 11. resolvePacket()

This method provides compatibility with the telemetry packet structure.

It receives:

``` text
packet
```

The resolver only reads:

``` text
packet.latitude
packet.longitude
```

It does not modify the packet.

------------------------------------------------------------------------

## Invalid Packet

If:

``` text
packet
```

is missing or falsy, the method returns:

``` json
{
  "matched": false,
  "reason": "INVALID_PACKET"
}
```

No boundary resolution is attempted.

------------------------------------------------------------------------

## Valid Packet

For a valid packet, the service extracts:

``` js
const latitude = packet.latitude;
const longitude = packet.longitude;
```

and passes them to:

``` js
resolve(latitude, longitude)
```

The resulting geographic resolution is returned.

------------------------------------------------------------------------

# 12. Telemetry Packet Compatibility

The packet-resolution flow is:

``` text
Telemetry Packet
       ↓
Read latitude
       ↓
Read longitude
       ↓
resolve()
       ↓
Boundary Cache
       ↓
GPS Resolution
```

Only latitude and longitude are consumed by this method.

------------------------------------------------------------------------

# 13. resolveWardTable()

This method is a convenience helper intended for the historical
processor.

It receives:

``` text
latitude
longitude
```

and first calls:

``` js
resolve(latitude, longitude)
```

------------------------------------------------------------------------

## Unmatched Location

If the GPS resolution does not match a valid geographic hierarchy:

``` text
result.matched === false
```

the method returns the complete resolution result unchanged.

This preserves the failure reason and any partially resolved hierarchy
information supplied by the boundary service.

------------------------------------------------------------------------

## Matched Location

When the location is successfully resolved, the method returns a
flattened object containing:

``` text
cityId
cityName
zoneId
zoneName
divisionId
divisionName
wardId
wardNo
wardName
wardTableName
```

The response also contains:

``` text
matched: true
```

------------------------------------------------------------------------

# 14. resolveWardTable() Response

A successful response has the structure:

``` json
{
  "matched": true,
  "cityId": "...",
  "cityName": "...",
  "zoneId": "...",
  "zoneName": "...",
  "divisionId": "...",
  "divisionName": "...",
  "wardId": "...",
  "wardNo": "...",
  "wardName": "...",
  "wardTableName": "..."
}
```

The most directly useful field for the historical processor is:

``` text
wardTableName
```

------------------------------------------------------------------------

# 15. Boundary Cache Architecture

The resolver maintains an in-memory cache:

``` text
CitizenHistoricalGpsResolver
          ↓
   boundaryCache
          ↓
citizenHistoricalBoundary.service
          ↓
Boundary Repository
```

The resolver therefore does not directly query the repository.

Boundary loading is delegated through:

``` text
boundaryService.loadBoundaryCache()
```

------------------------------------------------------------------------

# 16. Cache Lifecycle

The cache lifecycle is:

``` text
Service Created
      ↓
boundaryCache = null
      ↓
First GPS Resolution
      ↓
getBoundaryCache()
      ↓
loadBoundaries()
      ↓
Cache Stored
      ↓
Subsequent Resolutions
      ↓
Reuse Existing Cache
```

When boundary data needs to be refreshed:

``` text
refreshBoundaries()
      ↓
Clear Existing Cache
      ↓
Reload Boundary Data
      ↓
Store Refreshed Cache
```

------------------------------------------------------------------------

# 17. Error / Result Handling

The resolver does not introduce custom error handling around:

``` text
loadBoundaries()
resolve()
```

Errors from the underlying boundary service can therefore propagate
through these methods.

For invalid input, explicit result objects are returned for:

``` text
Invalid packet
```

while GPS coordinate validation and geographic failure reasons are
handled by:

``` text
boundaryService.resolveGpsPoint()
```

------------------------------------------------------------------------

# 18. Architecture

``` text
Historical Processor / Telemetry Flow
              ↓
    CitizenHistoricalGpsResolver
              │
       ┌──────┴──────┐
       ↓             ↓
getBoundaryCache()  resolvePacket()
       ↓             ↓
loadBoundaries()    resolve()
       ↓             ↓
citizenHistoricalBoundary.service
              ↓
       Boundary Cache
              ↓
      resolveGpsPoint()
              ↓
   City → Zone → Division → Ward
```

For ward-table resolution:

``` text
GPS
 ↓
resolve()
 ↓
Geographic Hierarchy
 ↓
resolveWardTable()
 ↓
Flattened Ward Information
 ↓
wardTableName
```

------------------------------------------------------------------------

# 19. Export

The module exports a **single instance** of:

``` text
CitizenHistoricalGpsResolver
```

using:

``` js
module.exports =
  new CitizenHistoricalGpsResolver();
```

Therefore consumers of this module share the same resolver instance and
its in-memory boundary cache.

------------------------------------------------------------------------

# 20. Available Methods

The exported resolver instance provides:

``` text
loadBoundaries()
getBoundaryCache()
refreshBoundaries()
resolve()
resolvePacket()
resolveWardTable()
```

------------------------------------------------------------------------

# 21. Summary

`citizenHistoricalGpsResolver.service.js` is the GPS-resolution layer
for the citizen historical processing flow.

It maintains an in-memory boundary cache, lazily loads the hierarchy
when required, supports explicit cache refresh, and delegates geographic
point resolution to `citizenHistoricalBoundary.service`.

It can resolve either:

``` text
latitude + longitude
```

or a telemetry packet containing:

``` text
latitude
longitude
```

For successfully matched locations, it can also provide a flattened
geographic result containing the corresponding:

``` text
City
Zone
Division
Ward
Ward Table
```

The service does not modify telemetry, insert historical records, or
modify citizen tables; it is solely responsible for geographic
resolution.
