# wasteGeneratorService.js Documentation

## 1. File Overview

**File:** `wasteGeneratorService(20260826-120552).js`

This service implements the waste-generator directory, citizen activity,
waste analytics, GVP trend, citizen update, and map functionality for
SEWAC.

The service integrates:

``` text
SEWAC database
Helper database
Master Citizen geographic hierarchy
Telemetry database
Edit logging
```

The major flow is:

``` text
City
 ↓
Zone
 ↓
Division
 ↓
Ward
 ↓
Master Citizen / Waste Generator
 ↓
Daily Vehicle Telemetry
 ↓
Citizen Waste
 ↓
Activity Status / Summary / Trends / Map
```

------------------------------------------------------------------------

# 2. Dependencies

The service uses:

``` text
SewacClient
HelperClient
masterCitizenPrisma
telemetryDb
logEdit
```

The generated Prisma clients are:

``` text
../generated/sewac
../generated/helper
```

The Master Citizen and telemetry clients are loaded from:

``` text
../config/masterCitizenPrisma
../config/telemetryDb
```

------------------------------------------------------------------------

# 3. Database Responsibility

  Component               Responsibility
  ----------------------- -------------------------------------------------
  `sewacPrisma`           SEWAC generated Prisma client
  `helperPrisma`          `master_citizen_data` access
  `masterCitizenPrisma`   City → Zone → Division → Ward hierarchy
  `telemetryDb`           Daily telemetry directory and vehicle telemetry
  `logEdit`               Edit auditing

------------------------------------------------------------------------

# 4. DATABASE IDENTIFIER SAFETY

The service defines:

``` js
IDENTIFIER_REGEX = /^[A-Za-z_][A-Za-z0-9_]*$/
```

This validates dynamic PostgreSQL identifiers.

The validation is applied before dynamic table names are interpolated
into SQL.

------------------------------------------------------------------------

# 5. quoteIdentifier()

`quoteIdentifier()` safely quotes dynamic database identifiers.

Invalid identifiers produce:

``` text
Unsafe database identifier: <identifier>
```

Valid identifiers are returned as quoted PostgreSQL identifiers.

This protects dynamic references such as:

``` text
City tables
Zone tables
Division tables
Ward tables
Day tables
Vehicle telemetry tables
```

------------------------------------------------------------------------

# 6. isMissingRelationError()

This helper identifies PostgreSQL missing-relation errors.

It recognizes:

``` text
42P01
```

and Prisma's:

``` text
P2010 + meta.code 42P01
```

It also checks whether the error message contains:

``` text
42P01
```

or:

``` text
does not exist
```

Missing dynamic tables are therefore handled as expected
data-availability conditions.

------------------------------------------------------------------------

# 7. parseId()

This helper converts an incoming ID into a positive integer.

It accepts:

``` text
cityId
zoneId
divisionId
wardId
```

Missing values return:

``` text
null
```

Invalid values throw:

``` text
<fieldName> must be a positive integer
```

------------------------------------------------------------------------

# 8. normalizeSearch()

This helper converts search input to a trimmed string.

If the value is:

``` text
undefined
null
```

the result is:

``` text
""
```

------------------------------------------------------------------------

# 9. validateDate()

This function validates the requested date.

The expected format is:

``` text
YYYY-MM-DD
```

If no date is provided, the current date is used.

Invalid format produces:

``` text
date must be in YYYY-MM-DD format
```

Invalid dates produce:

``` text
Invalid date
```

The function returns:

``` text
value
date
```

where:

``` text
value = YYYY-MM-DD
date  = JavaScript Date object
```

------------------------------------------------------------------------

# 10. formatDateLocal()

This helper formats a JavaScript Date without using:

``` text
toISOString()
```

The format is:

``` text
YYYY-MM-DD
```

It is specifically used to prevent timezone-related calendar-date shifts
during the three-day activity calculation.

------------------------------------------------------------------------

# 11. getDayTableName()

The telemetry directory follows the convention:

``` text
day_DDMMYYYY
```

For example:

``` text
2026-08-23
    ↓
day_23082026
```

------------------------------------------------------------------------

# 12. getAllWardScope()

This function retrieves the complete geographic hierarchy.

The hierarchy is:

``` text
City
 ↓
Zone
 ↓
Division
 ↓
Ward
```

It begins from:

``` text
city_table
```

------------------------------------------------------------------------

# 13. City Resolution

Cities are retrieved using:

``` js
masterCitizenPrisma.city_table.findMany()
```

ordered by:

``` text
city_id ASC
```

Each city must provide:

``` text
city_table_name
```

------------------------------------------------------------------------

# 14. Zone Resolution

For each city dynamic table, the service retrieves:

``` text
zone_id
zone_name
zone_table_name
```

ordered by:

``` text
zone_id ASC
```

------------------------------------------------------------------------

# 15. Division Resolution

For every zone dynamic table, the service retrieves:

``` text
division_id
division_name
division_table_name
```

ordered by:

``` text
division_id ASC
```

------------------------------------------------------------------------

# 16. Ward Resolution

For every division dynamic table, the service retrieves:

``` text
ward_id
ward_no
ward_name
ward_table_name
```

ordered by:

``` text
ward_no ASC
```

------------------------------------------------------------------------

# 17. Ward Scope Object

Each resolved ward contains:

``` text
cityId
cityName
zoneId
zoneName
divisionId
divisionName
divisionTableName
wardId
wardNo
wardName
wardTableName
```

This object is reused by the directory and analytics functions.

------------------------------------------------------------------------

# 18. getSelectedWardScope()

This function resolves the requested geographic filters.

Supported hierarchy:

``` text
cityId
 ↓
zoneId
 ↓
divisionId
 ↓
wardId
```

------------------------------------------------------------------------

# 19. Hierarchical Filter Requirements

The service enforces:

``` text
zoneId requires cityId
divisionId requires zoneId
wardId requires divisionId
```

Therefore filters cannot skip levels.

------------------------------------------------------------------------

# 20. No City Filter

If no `cityId` is supplied, the function returns:

``` text
filtered = false
wards = getAllWardScope()
```

This provides the complete geographic scope.

------------------------------------------------------------------------

# 21. Selected City

If `cityId` is supplied, the service retrieves the city from:

``` text
city_table
```

If it does not exist:

``` text
City not found
```

If it has no dynamic table:

``` text
City has no dynamic table registered
```

------------------------------------------------------------------------

# 22. Selected Zone

If `zoneId` is supplied, the zone query is restricted to that ID.

If the selected zone does not exist in the selected city:

``` text
Zone not found in selected city
```

------------------------------------------------------------------------

# 23. Selected Division

If `divisionId` is supplied, the division query is restricted to that
ID.

If it does not exist:

``` text
Division not found in selected zone
```

------------------------------------------------------------------------

# 24. Selected Ward

If `wardId` is supplied, the ward query is restricted to that ID.

If it does not exist:

``` text
Ward not found in selected division
```

A final empty result also produces:

``` text
Ward not found
```

------------------------------------------------------------------------

# 25. getMasterCitizensForWard()

This function retrieves citizens for a specific ward from:

``` text
master_citizen_data
```

using:

``` text
helperPrisma
```

------------------------------------------------------------------------

# 26. Ward Number Requirement

If the ward has no usable:

``` text
wardNo
```

the function returns:

``` text
[]
```

------------------------------------------------------------------------

# 27. Citizen Data Fields

The function reads:

``` text
id
phoneNumber
city
ward
area
wasteGeneratorTypes
houseNumber
floorNumber
householdType
personName
contactNumber
numberOfPeople
buildingPhoto
createdAt
updatedAt
dryRFID
drySlno
wetRFID
wetSlno
lat
lng
```

------------------------------------------------------------------------

# 28. Master Citizen Filtering

The source table is filtered using:

``` text
TRIM(ward) = selected ward number
```

The results are ordered by:

``` text
id DESC
```

------------------------------------------------------------------------

# 29. Geographic Fields Added to Citizens

Each citizen receives:

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
```

This allows the API response to combine citizen information with the
geographic hierarchy.

------------------------------------------------------------------------

# 30. citizenMatchesSearch()

The directory search is performed in JavaScript.

The search is normalized to lowercase.

Searchable fields include:

``` text
personName
phoneNumber
contactNumber
area
houseNumber
floorNumber
ward
dryRFID
drySlno
wetRFID
wetSlno
city
```

------------------------------------------------------------------------

# 31. Search Matching

The search succeeds when any searchable field contains the search
string.

The comparison is:

``` text
case-insensitive substring matching
```

------------------------------------------------------------------------

# 32. getVehicleTablesForDate()

This function resolves vehicle telemetry tables for a selected date.

It reads the corresponding:

``` text
day_DDMMYYYY
```

table from:

``` text
telemetryDb
```

------------------------------------------------------------------------

# 33. Ward-Scoped Telemetry

The function optionally accepts:

``` text
wardNos
```

When supplied, the query uses:

``` text
ward_no = ANY($1::integer[])
```

This restricts telemetry to the selected wards.

If an empty ward array is supplied:

``` text
[]
```

is immediately returned.

------------------------------------------------------------------------

# 34. Vehicle Table Result

Each telemetry mapping contains:

``` text
vehicleNumber
vehicleTableName
wardNo
```

------------------------------------------------------------------------

# 35. Missing Day Table

If the day table does not exist, the service logs a warning and returns:

``` text
[]
```

This is treated as:

``` text
No telemetry available for that day
```

------------------------------------------------------------------------

# 36. buildTelemetryUnion()

This function constructs a SQL:

``` text
UNION ALL
```

across multiple vehicle telemetry tables.

Each table contributes:

``` text
id
iottimestamp
receivedtimestamp
citizenid
latitude
longitude
wetweight
dryweight
otherweight
cumulativeweight
vehiclenumber
unitnumber
remarks
citizencontact
wardNo
sourceVehicleTable
```

------------------------------------------------------------------------

# 37. Telemetry Source Metadata

Every telemetry row receives:

``` text
wardNo
```

from the daily directory.

It also receives:

``` text
sourceVehicleTable
```

containing the originating vehicle telemetry table.

This allows later aggregation to retain:

``` text
Vehicle
Ward
Telemetry source
```

------------------------------------------------------------------------

# 38. getTelemetryRows()

This function executes the telemetry union.

The returned field names are normalized to camelCase:

``` text
iotTimestamp
receivedTimestamp
citizenId
wetWeight
dryWeight
otherWeight
cumulativeWeight
vehicleNumber
unitNumber
citizenContact
```

------------------------------------------------------------------------

# 39. Telemetry Date Filtering

Telemetry is restricted to:

``` text
iottimestamp >= selectedDate
```

and:

``` text
iottimestamp < selectedDate + 1 day
```

Thus only telemetry belonging to the selected calendar day is returned.

------------------------------------------------------------------------

# 40. Telemetry Ordering

Rows are ordered by:

``` text
wardNo ASC
vehicleNumber ASC
iotTimestamp ASC
id ASC
```

This ordering is important for cumulative-weight delta calculations.

------------------------------------------------------------------------

# 41. Citizen Activity Definition

Citizen activity is defined independently from the selected day's total
waste.

A citizen is:

``` text
ACTIVE
```

when positive waste was recorded on at least one of the last three
consecutive calendar days.

Otherwise:

``` text
INACTIVE
```

------------------------------------------------------------------------

# 42. Three-Day Activity Window

For a selected date:

``` text
Day 0 = selected date
Day 1 = previous date
Day 2 = two days before
```

Example:

``` text
Selected = 21 Aug

Check:
21 Aug
20 Aug
19 Aug
```

------------------------------------------------------------------------

# 43. Default Citizen Activity

Every valid citizen initially receives:

``` text
INACTIVE
```

Only positive telemetry can change the status to:

``` text
ACTIVE
```

------------------------------------------------------------------------

# 44. Activity Waste Formula

For each telemetry row:

``` text
waste =
wetWeight
+
dryWeight
+
otherWeight
```

If:

``` text
waste > 0
```

the citizen becomes:

``` text
ACTIVE
```

------------------------------------------------------------------------

# 45. Activity Citizen Matching

Telemetry is matched to citizens using:

``` text
citizenId
```

Only integer citizen IDs are accepted.

------------------------------------------------------------------------

# 46. Activity Early Exit

If every citizen has already become:

``` text
ACTIVE
```

the service stops checking the remaining days.

This avoids unnecessary telemetry queries.

------------------------------------------------------------------------

# 47. getAllWasteGenerators()

This is the main waste-generator directory endpoint logic.

It supports:

``` text
Pagination
Search
Date selection
City
Zone
Division
Ward
Waste metrics
Three-day activity status
```

------------------------------------------------------------------------

# 48. Directory Pagination

Supported page sizes are:

``` text
10
20
50
```

Any other requested limit falls back to:

``` text
10
```

The requested page is forced to a minimum of:

``` text
1
```

------------------------------------------------------------------------

# 49. Required Geographic Header

The directory requires all four:

``` text
cityId
zoneId
divisionId
wardId
```

If any is missing, the service returns an empty directory.

The response contains:

``` text
wasteGenerators = []
pagination = zero totals
filter = supplied IDs
date = selected date
```

------------------------------------------------------------------------

# 50. Exactly One Ward Requirement

After resolving the geographic hierarchy, the directory requires:

``` text
wards.length === 1
```

If not, an empty response is returned.

This ensures the directory operates on exactly one ward.

------------------------------------------------------------------------

# 51. Ward Number Validation

The selected ward must contain a valid:

``` text
wardNo
```

If not, an empty response is returned.

------------------------------------------------------------------------

# 52. Citizen Directory Retrieval

The service reads all citizens from:

``` text
master_citizen_data
```

for the selected ward.

Search filtering is applied afterward.

------------------------------------------------------------------------

# 53. Directory Waste Metrics

The service calls:

``` text
getDirectoryWasteMetrics()
```

to calculate:

``` text
totalWaste
historicalWaste
collectionDays
averageWaste
```

for each citizen.

------------------------------------------------------------------------

# 54. Directory Activity Status

The service separately calls:

``` text
getCitizenActivityStatus()
```

This means:

``` text
Waste metrics
```

and:

``` text
Activity status
```

are calculated independently.

------------------------------------------------------------------------

# 55. Citizen Directory Output

Each citizen receives:

``` text
totalWaste
averageWaste
status
```

in addition to the original citizen and geographic fields.

------------------------------------------------------------------------

# 56. Directory Total

The total is:

``` text
citizensWithWaste.length
```

This represents the number of citizens remaining after search filtering.

------------------------------------------------------------------------

# 57. Directory Pagination

Pagination is applied after:

``` text
Citizen retrieval
+
Search
+
Waste metrics
+
Activity status
```

The safe page is constrained to:

``` text
1 ... totalPages
```

------------------------------------------------------------------------

# 58. getHistoricalDayTables()

This function discovers historical telemetry day tables from:

``` text
information_schema.tables
```

It searches for:

``` text
day_%
```

------------------------------------------------------------------------

# 59. Historical Day Table Validation

Only table names matching:

``` text
day_DDMMYYYY
```

are accepted.

The table name is converted into:

``` text
YYYY-MM-DD
```

for chronological comparison.

------------------------------------------------------------------------

# 60. Historical Date Restriction

Only tables whose date is:

``` text
<= selectedDate
```

are returned.

The resulting list is sorted:

``` text
date ASC
```

------------------------------------------------------------------------

# 61. getHistoricalVehicleTables()

This function resolves vehicle telemetry tables from a historical day
table.

It requires:

``` text
dayTableName
wardNos
```

The query filters using:

``` text
ward_no = ANY($1::integer[])
```

------------------------------------------------------------------------

# 62. getCitizenWasteForDay()

This function calculates waste per citizen for one day.

For every telemetry row:

``` text
wetWeight
+
dryWeight
+
otherWeight
```

is calculated.

The result is accumulated in:

``` text
citizenWaste
```

using:

``` text
citizenId → total waste
```

------------------------------------------------------------------------

# 63. getDirectoryWasteMetrics()

This function calculates historical citizen waste metrics.

Each citizen starts with:

``` text
totalWaste = 0
historicalWaste = 0
collectionDays = 0
averageWaste = 0
```

------------------------------------------------------------------------

# 64. Historical Waste Definition

For every historical day containing positive waste for a citizen:

``` text
historicalWaste += waste
collectionDays += 1
```

The selected date contributes additionally to:

``` text
totalWaste
```

------------------------------------------------------------------------

# 65. Historical Average Formula

The average is:

``` text
averageWaste =
historicalWaste / collectionDays
```

when:

``` text
collectionDays > 0
```

Otherwise:

``` text
averageWaste = 0
```

------------------------------------------------------------------------

# 66. Historical Metric Rounding

The service rounds:

``` text
totalWaste
historicalWaste
averageWaste
```

to:

``` text
2 decimal places
```

------------------------------------------------------------------------

# 67. getWasteGeneratorByPhone()

This function finds the current citizen record using:

``` text
phoneNumber
```

and optional geographic filters.

If the phone number is missing:

``` text
Phone number is required
```

------------------------------------------------------------------------

# 68. Phone-Based Lookup

The service resolves the selected geographic scope and searches each
ward table for:

``` text
"phoneNumber" = $1
```

The first matching row is returned.

------------------------------------------------------------------------

# 69. Phone Lookup Response

The result includes the citizen fields plus:

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

------------------------------------------------------------------------

# 70. getWasteGeneratorByPhone() Not Found

If no ward contains the phone number:

``` text
Waste Generator not found
```

is thrown.

------------------------------------------------------------------------

# 71. updateWasteGenerator()

This function updates an existing citizen record.

The current citizen is first resolved using:

``` text
phoneNumber
```

------------------------------------------------------------------------

# 72. Updateable Fields

Only the following fields can be modified:

``` text
personName
phoneNumber
area
wasteGeneratorTypes
houseNumber
floorNumber
householdType
contactNumber
numberOfPeople
buildingPhoto
dryRFID
drySlno
wetRFID
wetSlno
lat
lng
```

------------------------------------------------------------------------

# 73. Update Field Safety

Only fields explicitly included in:

``` text
allowedFields
```

are accepted.

Dynamic SQL identifiers are passed through:

``` text
quoteIdentifier()
```

------------------------------------------------------------------------

# 74. Empty Update

If no valid fields are supplied:

``` text
No valid fields supplied for update
```

is thrown.

------------------------------------------------------------------------

# 75. Updated Timestamp

Every successful update also sets:

``` text
updatedAt = CURRENT_TIMESTAMP
```

------------------------------------------------------------------------

# 76. Update Record Matching

The update is performed using:

``` text
phoneNumber
```

The updated record is returned using:

``` text
RETURNING *
```

------------------------------------------------------------------------

# 77. Edit Logging

Successful updates are logged through:

``` text
logEdit()
```

with:

``` text
module = Waste Generators
action = UPDATE
recordId = updated.phoneNumber
```

The description contains:

``` text
Updated Waste Generator <personName>
```

------------------------------------------------------------------------

# 78. createWasteGenerator()

Creation is intentionally disabled.

Calling this function throws:

``` text
Creating Waste Generators is disabled. Citizens are managed through the ward citizen tables.
```

Therefore waste-generator creation is not performed through this
service.

------------------------------------------------------------------------

# 79. deleteWasteGenerator()

Deletion is intentionally disabled.

Calling this function throws:

``` text
Deleting Waste Generators is disabled. Current citizen records are managed through the ward citizen tables.
```

------------------------------------------------------------------------

# 80. Citizen Count

`getCitizenCountForWards()` counts rows directly from each selected ward
table.

The query is:

``` text
COUNT(*)
```

------------------------------------------------------------------------

# 81. Missing Ward Table During Count

If a ward table does not exist:

``` text
42P01
```

the service logs a warning and continues.

The missing ward contributes:

``` text
0
```

to the count.

------------------------------------------------------------------------

# 82. getSummary()

This function produces waste-generator KPI values.

The response contains:

``` text
totalWasteGenerators
activeWasteGenerators
inactiveWasteGenerators
totalWasteGenerated
averageWaste
aboveAverage
belowAverage
```

------------------------------------------------------------------------

# 83. Summary Geographic Scope

The summary accepts:

``` text
date
cityId
zoneId
divisionId
wardId
```

The geographic hierarchy is resolved through:

``` text
getSelectedWardScope()
```

------------------------------------------------------------------------

# 84. Empty Scope Summary

If no wards are resolved, the summary returns all zero values.

------------------------------------------------------------------------

# 85. Summary Without Valid Ward Numbers

If the resolved wards have no valid ward numbers, the service still
counts:

``` text
totalWasteGenerators
```

but returns:

``` text
activeWasteGenerators = 0
inactiveWasteGenerators = total
totalWasteGenerated = 0
averageWaste = 0
aboveAverage = 0
belowAverage = 0
```

------------------------------------------------------------------------

# 86. Summary Telemetry

The service resolves vehicle telemetry tables for the selected date and
selected ward numbers.

If there are no vehicle tables, all citizens are considered inactive for
the selected day's activity summary.

------------------------------------------------------------------------

# 87. Summary Citizen Waste

Telemetry rows are grouped by:

``` text
citizenId
```

The waste formula is:

``` text
wetWeight
+
dryWeight
+
otherWeight
```

------------------------------------------------------------------------

# 88. Total Waste Generated

The summary adds the waste for every citizen present in:

``` text
citizenWaste
```

to calculate:

``` text
totalWasteGenerated
```

------------------------------------------------------------------------

# 89. Active Waste Generators

The active count is:

``` text
Math.min(
  citizenWaste.size,
  totalWasteGenerators
)
```

Therefore it represents citizens with telemetry-associated waste without
exceeding the registered citizen count.

------------------------------------------------------------------------

# 90. Inactive Waste Generators

The inactive count is:

``` text
totalWasteGenerators
-
activeWasteGenerators
```

with a lower bound of:

``` text
0
```

------------------------------------------------------------------------

# 91. Summary Average Waste

The average is calculated over active waste generators:

``` text
averageWaste =
totalWasteGenerated /
activeWasteGenerators
```

If there are no active generators:

``` text
averageWaste = 0
```

------------------------------------------------------------------------

# 92. Above-Average Count

For every citizen with recorded waste:

``` text
waste >= averageWaste
```

is classified as:

``` text
aboveAverage
```

Therefore equality with the average is included in the above-average
count.

------------------------------------------------------------------------

# 93. Below-Average Count

For every citizen:

``` text
waste < averageWaste
```

increments:

``` text
belowAverage
```

------------------------------------------------------------------------

# 94. getGVPTrend()

This function calculates ward-level:

``` text
GVP
```

values for the selected date.

The result is returned once per resolved ward.

------------------------------------------------------------------------

# 95. GVP Definition

A telemetry row is considered GVP when:

``` text
unitNumber exists
```

and:

``` text
unitNumber does not contain "UHF"
```

and:

``` text
remarks === "O"
```

and:

``` text
citizenContact is null or empty
```

------------------------------------------------------------------------

# 96. GVP Waste Calculation

GVP waste is derived from cumulative-weight differences.

For each:

``` text
sourceVehicleTable + vehicleNumber
```

the service tracks:

``` text
previous cumulative weight
```

------------------------------------------------------------------------

# 97. Cumulative Weight Delta

The calculation is:

``` text
actualWaste =
currentCumulative - previousCumulative
```

with:

``` text
Math.max(..., 0)
```

If there is no previous value:

``` text
actualWaste = 0
```

------------------------------------------------------------------------

# 98. Ward GVP Aggregation

Positive GVP waste is added to:

``` text
wardGVP[wardNo]
```

------------------------------------------------------------------------

# 99. GVP Trend Without Telemetry

If no vehicle telemetry tables exist for the selected date, every ward
is returned with:

``` text
value = 0
gvp = 0
color = "#16A34A"
```

------------------------------------------------------------------------

# 100. GVP Trend Response

Each ward result contains:

``` text
wardId
wardNo
wardName
divisionName
zoneName
date
value
gvp
color
```

The results are sorted by:

``` text
wardNo ASC
```

------------------------------------------------------------------------

# 101. getMapTelemetryRows()

This function is similar to the standard telemetry retrieval but
additionally requires:

``` text
latitude IS NOT NULL
longitude IS NOT NULL
```

Only coordinate-bearing telemetry records are returned.

------------------------------------------------------------------------

# 102. getWasteGeneratorMap()

This function produces the waste-generator telemetry map for exactly one
selected ward.

It accepts:

``` text
date
cityId
zoneId
divisionId
wardId
```

------------------------------------------------------------------------

# 103. Map Ward Requirement

The selected scope must contain:

``` text
exactly one ward
```

Otherwise:

``` text
Map requires exactly one selected ward
```

------------------------------------------------------------------------

# 104. Map Boundary

The service reads the selected ward boundary from its:

``` text
divisionTableName
```

using:

``` text
ward_id
```

The requested field is:

``` text
geo_boundary
```

------------------------------------------------------------------------

# 105. Map Boundary Response

The map returns:

``` text
boundary
boundaryAvailable
```

If no geometry exists:

``` text
boundary = null
boundaryAvailable = false
```

------------------------------------------------------------------------

# 106. Map Vehicle Tables

The selected ward's numeric:

``` text
wardNo
```

is used to retrieve daily vehicle telemetry tables.

------------------------------------------------------------------------

# 107. Map Telemetry Points

Each valid telemetry record with coordinates becomes a map point.

The point contains:

``` text
id
pointKey
sourceVehicleTable
latitude
longitude
vehicleNumber
citizenId
iotTimestamp
receivedTimestamp
wetWeight
dryWeight
otherWeight
cumulativeWeight
weightDelta
unitNumber
remarks
citizenContact
wardNo
isGVP
```

------------------------------------------------------------------------

# 108. Map Point Key

A unique diagnostic:

``` text
pointKey
```

is constructed using:

``` text
sourceVehicleTable
vehicleNumber
id
iotTimestamp
latitude
longitude
```

------------------------------------------------------------------------

# 109. Map Weight Delta

For every vehicle telemetry stream:

``` text
current cumulative weight
-
previous cumulative weight
```

is calculated.

Negative deltas are forced to:

``` text
0
```

The returned value is rounded to:

``` text
3 decimal places
```

------------------------------------------------------------------------

# 110. Map GVP Points

When a map point satisfies the GVP conditions, it is added to:

``` text
gvpPoints
```

with:

``` text
pointType = "GVP"
gvpWaste = weightDelta
```

------------------------------------------------------------------------

# 111. Map Vehicle Counts

The service calculates:

``` text
points
gvpPoints
```

per telemetry vehicle table.

Each vehicle summary contains:

``` text
vehicleNumber
vehicleTableName
wardNo
points
gvpPoints
```

------------------------------------------------------------------------

# 112. Map Diagnostic Logging

The map operation logs:

``` text
selectedDate
dayTable
wardNo
vehicleTables
telemetryRows
validCoordinatePoints
gvpPoints
vehicles
```

This provides operational visibility into the map-data pipeline.

------------------------------------------------------------------------

# 113. Unique Collection Points

The service creates coordinate keys using:

``` text
latitude,longitude
```

rounded to:

``` text
7 decimal places
```

The number of unique coordinate pairs becomes:

``` text
totalCollectionPoints
```

------------------------------------------------------------------------

# 114. Map Final Response

The response contains:

``` text
date
dayTable
ward
boundary
boundaryAvailable
vehicles
points
totalPoints
gvpPoints
totalGVPPoints
```

------------------------------------------------------------------------

# 115. Map Ward Metadata

The returned ward object contains:

``` text
wardId
wardNo
wardName
divisionId
divisionName
zoneId
zoneName
```

------------------------------------------------------------------------

# 116. Complete Waste Generator Directory Flow

``` text
City / Zone / Division / Ward
            ↓
Selected Ward
            ↓
master_citizen_data
            ↓
Search
            ↓
Historical Telemetry
            ↓
totalWaste
averageWaste
            +
Three-Day Telemetry
            ↓
ACTIVE / INACTIVE
            ↓
Pagination
            ↓
Waste Generator Directory
```

------------------------------------------------------------------------

# 117. Complete Summary Flow

``` text
Geographic Scope
      ↓
Ward Tables
      ↓
Citizen Count
      +
Daily Vehicle Tables
      ↓
Telemetry
      ↓
Citizen ID
      ↓
Wet + Dry + Other
      ↓
Citizen Waste
      ↓
Total Waste
      ↓
Average
      ↓
Above / Below Average
```

------------------------------------------------------------------------

# 118. Complete GVP Flow

``` text
Daily Telemetry
      ↓
Vehicle + Source Table
      ↓
Cumulative Weight
      ↓
Current - Previous
      ↓
Positive Delta
      ↓
GVP Conditions
      ↓
Ward Aggregation
      ↓
GVP Trend
```

------------------------------------------------------------------------

# 119. Complete Map Flow

``` text
Selected Ward
      ↓
Ward Boundary
      +
Daily Vehicle Tables
      ↓
Telemetry with Coordinates
      ↓
Map Points
      ↓
Cumulative Weight Delta
      ↓
GVP Classification
      ↓
Collection Points + GVP Points
```

------------------------------------------------------------------------

# 120. Important Status Distinction

The directory status:

``` text
ACTIVE / INACTIVE
```

is based on:

``` text
positive waste recorded on any of the last 3 calendar days
```

It is therefore not simply:

``` text
selected-date totalWaste > 0
```

A citizen can have:

``` text
totalWaste = 0
status = ACTIVE
```

when the citizen recorded positive waste on one of the previous two
days.

------------------------------------------------------------------------

# 121. Important Waste Distinction

The directory's:

``` text
totalWaste
```

represents waste on the selected date.

The directory's:

``` text
averageWaste
```

represents the historical average across days where positive waste was
recorded.

------------------------------------------------------------------------

# 122. Important Historical Average Formula

The historical average is:

``` text
Historical Average
=
Historical Positive Waste
÷
Number of Collection Days
```

Days with no positive waste do not increment:

``` text
collectionDays
```

------------------------------------------------------------------------

# 123. Important Summary Average Formula

The summary's:

``` text
averageWaste
```

is different from the directory's historical average.

Summary average:

``` text
Total Selected-Day Waste
÷
Number of Active Waste Generators
```

Directory average:

``` text
Historical Waste
÷
Historical Collection Days
```

These are separate metrics.

------------------------------------------------------------------------

# 124. Important GVP Distinction

GVP waste is not calculated directly from:

``` text
wetWeight + dryWeight + otherWeight
```

Instead, GVP uses:

``` text
cumulativeWeight delta
```

and then applies the GVP classification conditions.

------------------------------------------------------------------------

# 125. Important GVP Classification

A row is GVP only when all relevant conditions are satisfied:

``` text
unitNumber exists
AND
unitNumber does not contain UHF
AND
remarks = O
AND
citizenContact is empty/null
```

------------------------------------------------------------------------

# 126. Important Geographic Source

The geographic hierarchy is driven by:

``` text
masterCitizenPrisma
```

not by arbitrary values from citizen or telemetry rows.

The hierarchy remains:

``` text
City
 ↓
Zone
 ↓
Division
 ↓
Ward
```

------------------------------------------------------------------------

# 127. Important Creation / Deletion Restriction

Waste Generator creation is disabled.

Waste Generator deletion is disabled.

The service treats current citizens as records managed by:

``` text
ward citizen tables
```

Therefore only updates are provided for the current citizen record
workflow.

------------------------------------------------------------------------

# 128. Missing Dynamic Table Philosophy

The service treats missing dynamic relations as recoverable conditions
in many analytics operations.

Examples:

``` text
Missing day table
    ↓
No telemetry

Missing ward table
    ↓
Zero contribution

Missing vehicle telemetry table
    ↓
No vehicle telemetry contribution
```

------------------------------------------------------------------------

# 129. Exports

The service exports:

``` text
getAllWasteGenerators
getWasteGeneratorByPhone
getSummary
getGVPTrend
createWasteGenerator
updateWasteGenerator
deleteWasteGenerator
getSelectedWardScope
getWasteGeneratorMap
```

------------------------------------------------------------------------

# 130. Overall Architecture

``` text
                    wasteGeneratorService
                              │
       ┌──────────────────────┼──────────────────────┐
       │                      │                      │
       ↓                      ↓                      ↓
 Geographic Scope       Citizen Directory       Analytics
       │                      │                      │
       ↓                      ↓          ┌───────────┼───────────┐
 City → Zone →          Master Citizen    ↓           ↓           ↓
 Division → Ward            Data       Summary     GVP Trend    Map
       │                      │
       └──────────────────────┼──────────────────────┐
                              ↓                      ↓
                       Daily Telemetry        Historical Telemetry
                              │                      │
                              ↓                      ↓
                         Waste / GVP             Averages
```

------------------------------------------------------------------------

# 131. Summary

`wasteGeneratorService(20260826-120552).js` is the primary backend
service for SEWAC waste-generator management and analytics.

Its major responsibilities are:

``` text
Geographic scope resolution
Waste generator directory
Citizen search
Selected-day waste calculation
Historical waste averages
Three-day citizen activity status
Citizen lookup by phone
Citizen update
Citizen KPI summary
GVP trend
Ward boundary retrieval
Waste telemetry map
```

The core citizen waste formula is:

``` text
Citizen Waste
=
Wet Weight
+
Dry Weight
+
Other Weight
```

The three-day activity rule is:

``` text
Positive waste on any of:
selected date
previous day
two days before
        ↓
ACTIVE
```

Otherwise:

``` text
INACTIVE
```

The historical directory average is:

``` text
Historical Positive Waste
÷
Positive Collection Days
```

The summary average is:

``` text
Selected-Day Total Waste
÷
Active Waste Generators
```

The GVP calculation is:

``` text
Current Cumulative Weight
-
Previous Cumulative Weight
=
GVP Waste Delta
```

subject to the GVP classification rules.

The map combines:

``` text
Ward Boundary
+
Vehicle Telemetry Coordinates
+
Weight Delta
+
GVP Classification
```

to produce the operational waste-generator map.

Overall data flow:

``` text
Master Citizen Hierarchy
        ↓
Selected Geographic Scope
        ↓
Citizen / Ward Records
        +
Daily Telemetry
        +
Historical Telemetry
        ↓
Waste Generator Analytics
        ↓
Directory
Summary
GVP Trend
Map
```
