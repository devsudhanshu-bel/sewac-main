# overviewService.js Documentation

## 1. File Overview

### File Name
`overviewService.js`

### File Location
`src/services/overviewService.js`

### Purpose

`overviewService.js` contains the business logic and database operations used by the SEWAC Admin Overview module.

It is called by `overviewController.js` and combines data from multiple database sources to produce Overview dashboard information.

---

## 2. Database Dependencies

The service imports:

```js
const helperDb = require("../config/helperDb");
const mainDb = require("../config/mainDb");
const telemetryDb = require("../config/telemetryDb");
const masterCitizenPrisma = require("../config/masterCitizenPrisma");
```

Therefore, Overview data can come from:

```text
Helper database
Main database
Telemetry database
Master Citizen database
```

---

## 3. Main Exported Functions

The service exports:

```text
getSummary
getVehicleSummary
getGenerationTrend
getMapData
getOverviewFilters
```

---

## 4. Helper Functions

The service contains several internal helpers used to validate data, construct dynamic table names, resolve geographic scope, and combine telemetry information.

Important helpers include:

```text
quoteIdentifier()
parseId()
validateDate()
getDayTableName()
getAllWardScope()
getSelectedWardScope()
getVehicleTablesForDate()
buildTelemetryUnion()
getTelemetryRows()
getTotalCitizens()
normalizeGeoBoundary()
```

---

## 5. quoteIdentifier()

Validates dynamic database identifiers using:

```js
const IDENTIFIER_REGEX = /^[A-Za-z_][A-Za-z0-9_]*$/;
```

Unsafe identifiers cause an error:

```text
Unsafe database identifier
```

This is important because the service works with dynamically named geographic database tables.

---

## 6. parseId()

Converts an ID value into a positive integer.

Empty values are treated as:

```text
null
```

Invalid values cause an error:

```text
[fieldName] must be a positive integer
```

This helper is used for:

```text
cityId
zoneId
divisionId
wardId
```

---

## 7. validateDate()

Validates the requested date.

If no date is supplied, the service uses the current date.

The required format is:

```text
YYYY-MM-DD
```

Invalid formats cause:

```text
date must be in YYYY-MM-DD format
```

The function returns both the original date string and a JavaScript Date object.

---

## 8. getDayTableName()

Creates a dynamic daily table name from a Date object.

The generated format is:

```text
day_DDMMYYYY
```

For example:

```text
day_21082026
```

This is used when working with date-specific data tables.

---

## 9. Geographic Hierarchy

The service understands the hierarchy:

```text
City
  ↓
Zone
  ↓
Division
  ↓
Ward
```

The master citizen database is used to resolve these relationships.

---

## 10. getAllWardScope()

Retrieves all available wards across the geographic hierarchy.

The function:

1. Reads cities.
2. Resolves each city's dynamic table.
3. Reads zones.
4. Resolves zone tables.
5. Reads divisions.
6. Resolves division tables.
7. Reads wards.
8. Builds a normalized ward list.

Each resulting ward contains information such as:

```text
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

---

## 11. getSelectedWardScope()

Resolves the selected geographic filter.

Supported parameters:

```text
cityId
zoneId
divisionId
wardId
```

The hierarchy is validated.

For example:

```text
zoneId requires cityId
divisionId requires zoneId
wardId requires divisionId
```

If no city filter is selected, the function returns the complete ward scope.

---

## 12. getVehicleTablesForDate()

Retrieves vehicle-related tables for a selected date and optional ward numbers.

This function supports the Overview vehicle and telemetry calculations.

---

## 13. buildTelemetryUnion()

Builds a combined telemetry SQL query from multiple vehicle tables.

This allows telemetry information from different tables to be processed as a unified dataset.

---

## 14. getTelemetryRows()

Retrieves telemetry records for the selected vehicle tables and date.

The resulting telemetry data is used by other Overview calculations.

---

## 15. getTotalCitizens()

Retrieves the total citizen count used by Overview summary calculations.

---

## 16. getSummary()

`getSummary()` is the main Overview summary operation.

Parameters:

```text
date
cityId
zoneId
divisionId
wardId
```

The function validates the date and geographic IDs, resolves the selected ward scope, and combines relevant citizen, vehicle, waste, and telemetry data.

The result is returned to `overviewController.js`.

---

## 17. getVehicleSummary()

`getVehicleSummary()` generates vehicle-related summary information.

Parameters:

```text
cityId
zoneId
divisionId
wardId
```

The service uses the selected geographic scope and telemetry information.

The service also defines:

```js
const VEHICLE_INACTIVITY_MINUTES = 30;
```

This value is used in vehicle inactivity calculations.

---

## 18. getGenerationTrend()

`getGenerationTrend()` produces waste-generation trend information.

Parameters:

```text
date
cityId
zoneId
divisionId
wardId
```

It validates the date and geographic filters before generating the trend data.

---

## 19. normalizeGeoBoundary()

Normalizes geographic boundary information before it is returned as part of map-related data.

This helper supports the Overview map functionality.

---

## 20. getMapData()

`getMapData()` retrieves map-related Overview information.

Parameters:

```text
cityId
zoneId
```

The function resolves the selected geographic hierarchy and prepares location/boundary information.

The map result includes geographic information such as city, zone, divisions, wards, and normalized geographic boundaries.

---

## 21. getOverviewFilters()

Retrieves the filter values used by the Overview frontend.

The current implementation reads distinct values from `master_citizen_data`.

It retrieves:

```text
cities
wards
```

The returned structure is:

```js
{
  cities: [...],
  wards: [...],
}
```

---

## 22. Data Sources

The Overview service combines several data sources.

```text
Overview Request
       ↓
Geographic Scope
       ↓
Citizen Data
       +
Vehicle Data
       +
Telemetry Data
       +
Master Citizen Data
       ↓
Overview Result
```

---

## 23. Dynamic Geographic Tables

The service uses table names stored in the master citizen database.

The hierarchy is:

```text
city_table_name
      ↓
zone_table_name
      ↓
division_table_name
      ↓
ward_table_name
```

Dynamic identifiers are validated before being used.

---

## 24. Date-Based Processing

Overview data can be date-dependent.

The service:

```text
Validates Date
     ↓
Creates Date Object
     ↓
Creates Daily Table Name
     ↓
Reads Date-Specific Data
```

The daily table naming convention is:

```text
day_DDMMYYYY
```

---

## 25. Geographic Filtering

The service supports progressively specific filtering:

```text
No filter
   ↓
City
   ↓
Zone
   ↓
Division
   ↓
Ward
```

The selected hierarchy is validated so that lower-level filters cannot be used without their parent filters.

---

## 26. Controller-Service Relationship

```text
overviewRoutes.js
      ↓
overviewController.js
      ↓
overviewService.js
      ↓
Multiple Database Sources
      ↓
Processed Overview Data
      ↓
overviewController.js
      ↓
Frontend
```

---

## 27. Important Implementation Notes

- The service uses multiple database connections.
- It uses Prisma for master citizen hierarchy operations.
- It also uses raw SQL queries.
- Dynamic table identifiers are validated.
- IDs are converted to positive integers.
- Dates must follow `YYYY-MM-DD`.
- Geographic filtering follows City → Zone → Division → Ward.
- Vehicle inactivity calculations use a 30-minute threshold.
- Map data includes geographic boundary information.
- Overview filters currently provide cities and wards.

---

## 28. Export Structure

```js
module.exports = {
  getSummary,
  getVehicleSummary,
  getGenerationTrend,
  getMapData,
  getOverviewFilters,
};
```

---

## 29. Summary

`overviewService.js` is the main business/data-processing layer for the Overview dashboard.

It combines:

```text
Citizen Information
+
Plant / Vehicle Information
+
Telemetry
+
Geographic Hierarchy
+
Date-Based Data
```

to provide:

```text
Overview Summary
Vehicle Summary
Generation Trend
Map Data
Overview Filters
```

The service keeps complex database processing out of the controller and provides the frontend with structured Overview data.
