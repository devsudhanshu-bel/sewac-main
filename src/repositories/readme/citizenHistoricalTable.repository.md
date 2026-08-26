# citizenHistoricalTable.repository.js Documentation

## 1. File Overview

**File:** `citizenHistoricalTable.repository.js`

The repository manages the creation and registration of historical tables.

Its structure is:

```text
Yearly Index Table
        ↓
Monthly Historical Table
        ↓
Historical Telemetry Records
```

---

# 2. MONTH_NAMES

The repository defines the complete month-name list:

```text
January
February
March
April
May
June
July
August
September
October
November
December
```

---

# 3. validateIdentifier()

Validates dynamic SQL identifiers.

A valid identifier must:

```text
be a string
start with a letter
contain letters, numbers, or underscores
```

Invalid values throw:

```text
Invalid SQL identifier
```

---

# 4. generateYearlyIndexTableName()

Generates:

```text
ward_{wardNo}_{year}
```

Example:

```text
ward_101_2026
```

Ward validation requires:

```text
positive integer
```

Year validation requires:

```text
integer >= 2000
```

---

# 5. generateMonthlyTableName()

Generates:

```text
ward_{wardNo}_{MMYYYY}
```

Example:

```text
ward_101_082026
```

Validation requires:

```text
positive ward number
month 1–12
year >= 2000
```

---

# 6. tableExists()

Checks whether a table exists in the PostgreSQL public schema.

Returns:

```text
true
```

or:

```text
false
```

---

# 7. createYearlyIndexTable()

Creates the yearly index table when it does not already exist.

The table contains:

```text
month_number
month_name
table_name
created_at
```

The primary key is:

```text
month_number
```

---

# 8. createMonthlyHistoryTable()

Creates the monthly historical telemetry table.

The table stores:

```text
historical_id
source_telemetry_id
source_vehicle_table
vehicle_number
ward_no
iot_timestamp
received_timestamp
rfid_epc
citizen_id
waste_type
latitude
longitude
wet_weight
dry_weight
other_weight
cumulative_weight
driver_name
firmware_version
unit_number
collection_type
remarks
error_code
citizen_contact
driver_action
source_day_table
archived_at
```

---

# 9. Historical Record Identity

The monthly table uses:

```text
historical_id
```

as an identity primary key.

It also creates a unique index over:

```text
source_vehicle_table
source_telemetry_id
```

This prevents the same source telemetry record from being archived more than once for the same source vehicle table.

---

# 10. ensureWardHistoricalTables()

The main table-management method is:

```text
ensureWardHistoricalTables({
  wardNo,
  month,
  year
})
```

It determines the required:

```text
yearly table
monthly table
```

and creates missing tables.

---

# 11. Yearly Table Creation

The method checks:

```text
yearlyTableName
```

using:

```text
tableExists()
```

If the table does not exist:

```text
createYearlyIndexTable()
```

is called.

---

# 12. Monthly Table Creation

The method checks:

```text
monthlyTableName
```

using:

```text
tableExists()
```

If the table does not exist:

```text
createMonthlyHistoryTable()
```

is called.

---

# 13. Monthly Registration

After ensuring both tables exist, the repository calls:

```text
registerMonthlyTable()
```

This registers the monthly table in the yearly index.

---

# 14. registerMonthlyTable()

The method inserts:

```text
month_number
month_name
table_name
```

into the yearly table.

It uses:

```text
ON CONFLICT (month_number)
DO UPDATE
```

so the existing month entry is updated rather than duplicated.

---

# 15. getYearlyIndex()

Retrieves the yearly index for a ward and year.

If the yearly table does not exist:

```text
[]
```

is returned.

Otherwise the result contains:

```text
month_number
month_name
table_name
created_at
```

ordered by:

```text
month_number ASC
```

---

# 16. getMonthlyRowCount()

Counts all rows in a monthly historical table.

The PostgreSQL count is converted into a JavaScript number.

---

# 17. Table Management Flow

```text
wardNo + month + year
        ↓
Generate yearly table
        ↓
Generate monthly table
        ↓
Check yearly table
        ↓
Create if missing
        ↓
Check monthly table
        ↓
Create if missing
        ↓
Register month
        ↓
Return table information
```

---

# 18. ensureWardHistoricalTables() Result

The method returns:

```text
wardNo
year
month
monthName
yearlyTableName
monthlyTableName
yearlyTableCreated
monthlyTableCreated
```

This indicates both the selected table names and whether either table was newly created.

---

# 19. Historical Table Architecture

```text
ward_101_2026
      ↓
+-------------------+
| January           |
| February          |
| ...               |
| August            |
| ...               |
+-------------------+
      ↓
ward_101_082026
      ↓
Historical Telemetry
```

The yearly table functions as the month index, while the monthly table stores the historical records.

---

# 20. Exports

The repository exports:

```text
MONTH_NAMES
validateIdentifier
generateYearlyIndexTableName
generateMonthlyTableName
tableExists
createYearlyIndexTable
createMonthlyHistoryTable
ensureWardHistoricalTables
registerMonthlyTable
getYearlyIndex
getMonthlyRowCount
```

---

# 21. Summary

`citizenHistoricalTable.repository.js` is the historical table-management repository. It generates yearly and monthly table names, creates missing historical tables, defines the monthly historical schema, creates uniqueness protection for source telemetry records, registers monthly tables in yearly indexes, retrieves yearly indexes, and counts monthly historical records.
