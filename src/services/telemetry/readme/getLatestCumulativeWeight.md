# getLatestCumulativeWeight.js Documentation

## 1. File Overview

**File:** `getLatestCumulativeWeight(1).js`

This file defines a small asynchronous helper function that retrieves
the latest cumulative vehicle weight recorded in the telemetry log
table.

The function performs:

``` text
Telemetry log lookup
        ↓
Latest record selection
        ↓
cumulative_weight_kg extraction
        ↓
Numeric normalization
        ↓
Return cumulative weight
```

The service uses:

``` text
mainDb
    ↓
telemetry_logs
```

------------------------------------------------------------------------

# 2. Dependencies

The file imports:

``` js
const mainDb = require("../../config/mainDb");
```

Therefore the database connection is provided by:

``` text
../../config/mainDb
```

No other dependencies are used.

------------------------------------------------------------------------

# 3. getLatestCumulativeWeight()

The main exported function is:

``` js
const getLatestCumulativeWeight = async () => {
```

The function is asynchronous and does not accept any parameters.

Its purpose is to retrieve the cumulative weight from the most recent
telemetry-log record.

------------------------------------------------------------------------

# 4. Database Query

The function executes:

``` sql
SELECT cumulative_weight_kg
FROM telemetry_logs
ORDER BY id DESC
LIMIT 1
```

The query operates on:

``` text
telemetry_logs
```

and selects:

``` text
cumulative_weight_kg
```

------------------------------------------------------------------------

# 5. Latest Record Selection

The query orders records using:

``` text
id DESC
```

This means the record with the highest:

``` text
id
```

is treated as the latest record.

Only one record is retrieved because the query uses:

``` text
LIMIT 1
```

Therefore the selection flow is:

``` text
telemetry_logs
      ↓
ORDER BY id DESC
      ↓
Highest ID first
      ↓
LIMIT 1
      ↓
Latest cumulative weight
```

------------------------------------------------------------------------

# 6. Empty Table Handling

After the query executes, the function checks:

``` js
if (rows.length === 0)
```

If no telemetry records exist, the function returns:

``` text
0
```

Therefore:

``` text
No telemetry logs
        ↓
cumulative weight = 0
```

------------------------------------------------------------------------

# 7. Cumulative Weight Extraction

When a record exists, the function reads:

``` text
rows[0].cumulative_weight_kg
```

This is the database value representing the latest cumulative weight.

------------------------------------------------------------------------

# 8. Numeric Conversion

The database value is converted using:

``` js
Number(rows[0].cumulative_weight_kg)
```

This normalizes the result into a JavaScript number.

------------------------------------------------------------------------

# 9. Invalid / Falsy Numeric Result

The function uses:

``` js
Number(rows[0].cumulative_weight_kg) || 0
```

Therefore if the converted value is falsy, the function returns:

``` text
0
```

This includes cases such as:

``` text
null
undefined
NaN
0
```

The resulting function value is therefore always intended to be numeric.

------------------------------------------------------------------------

# 10. Return Value

The function returns:

``` text
latest cumulative_weight_kg
```

as a JavaScript number.

Possible result:

``` text
1250
```

If no record exists:

``` text
0
```

If the stored value cannot be converted to a usable number:

``` text
0
```

------------------------------------------------------------------------

# 11. Input Parameters

The function accepts no arguments:

``` js
getLatestCumulativeWeight()
```

All required information comes directly from:

``` text
telemetry_logs
```

------------------------------------------------------------------------

# 12. Error Handling

The function does not contain an explicit:

``` text
try / catch
```

block.

Therefore database errors raised by:

``` js
mainDb.query()
```

are propagated to the caller.

The function only handles the normal empty-result condition internally.

------------------------------------------------------------------------

# 13. Database Responsibility

The function uses:

``` text
mainDb
```

to access:

``` text
telemetry_logs
```

It does not access:

``` text
Telemetry database
Master Citizen database
Vehicle master
Redis
```

Only the configured:

``` text
mainDb
```

connection is used.

------------------------------------------------------------------------

# 14. Complete Execution Flow

``` text
getLatestCumulativeWeight()
          ↓
mainDb.query()
          ↓
telemetry_logs
          ↓
ORDER BY id DESC
          ↓
LIMIT 1
          ↓
Any row?
     ┌────┴────┐
     │         │
    NO        YES
     │         │
     ↓         ↓
   return 0   Read cumulative_weight_kg
                       ↓
                  Number(...)
                       ↓
                  Falsy value?
                  ┌────┴────┐
                  │         │
                 YES        NO
                  │         │
                  ↓         ↓
                return 0   return number
```

------------------------------------------------------------------------

# 15. Export

The function is exported directly using:

``` js
module.exports = getLatestCumulativeWeight;
```

Other modules can therefore import and invoke it as a function.

------------------------------------------------------------------------

# 16. Summary

`getLatestCumulativeWeight(1).js` is a lightweight database helper for
retrieving the most recent cumulative telemetry weight.

Its logic is:

``` text
Read telemetry_logs
        ↓
Select highest ID
        ↓
Read cumulative_weight_kg
        ↓
Convert to Number
        ↓
Return value
```

If the table contains no records:

``` text
return 0
```

If the stored cumulative-weight value cannot produce a usable numeric
result:

``` text
return 0
```

The function has no input parameters and no explicit error recovery.
Database query failures are propagated to the caller.

Overall:

``` text
mainDb
   ↓
telemetry_logs
   ↓
Latest Record
   ↓
cumulative_weight_kg
   ↓
Number
   ↓
Latest Cumulative Weight
```
