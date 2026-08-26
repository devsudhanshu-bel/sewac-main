# citizenHistorical.repository.js Documentation

## 1. File Overview

**File:** `citizenHistorical.repository.js`

The Citizen Historical Repository manages the historical database structure and historical telemetry records.

Its structure is:

```text
Yearly Table
    ↓
Monthly Table
    ↓
Historical Telemetry Data
```

The yearly table acts as an index, while the monthly table stores the actual historical telemetry.

---

# 2. getYearlyTableName()

Generates the yearly historical table name:

```text
ward_{wardNo}_{year}
```

Example:

```text
ward_101_2026
```

The year is taken from the supplied date or the current date.

---

# 3. getMonthlyTableName()

Generates the monthly historical table name:

```text
ward_{wardNo}_{MMYYYY}
```

Example:

```text
ward_101_082026
```

The month is zero-padded to two digits.

---

# 4. getMonthNumber()

Returns the numeric month:

```text
1–12
```

based on the supplied Date object.

---

# 5. getMonthName()

Converts the Date object's month into its full month name.

Examples:

```text
January
February
...
December
```

---

# 6. tableExists()

Checks whether a table exists in the PostgreSQL `public` schema.

The query uses:

```text
information_schema.tables
```

and returns:

```text
true
```

or:

```text
false
```

---

# 7. ensureMonthlyIndexes()

Creates indexes on the actual monthly telemetry table for:

```text
rfid_epc
citizen_id
vehicle_number
iot_timestamp
```

Each index uses:

```text
CREATE INDEX IF NOT EXISTS
```

so existing indexes are preserved.

---

# 8. updateYearlyMonthIndex()

Updates the yearly index table with information about a monthly historical table.

It first reads:

```text
record_count
first_record_at
last_record_at
```

from the monthly table.

It then checks whether the corresponding month already exists in the yearly table.

---

# 9. Existing Month Update

If the month already exists, the yearly index row is updated with:

```text
month_name
table_name
record_count
first_record_at
last_record_at
updated_at
```

The existing row is identified using:

```text
month_number
```

---

# 10. New Month Registration

If the month does not exist in the yearly index, a new row is inserted containing:

```text
month_number
month_name
table_name
record_count
first_record_at
last_record_at
created_at
updated_at
```

---

# 11. insertHistoricalRecord()

Inserts a telemetry record into a monthly historical table.

The stored fields include:

```text
telemetry_id
iot_timestamp
received_timestamp
vehicle_number
driver_name
unit_number
firmware_version
latitude
longitude
city_id
zone_id
division_id
ward_id
ward_no
citizen_id
rfid_epc
citizen_contact
waste_type
collection_type
wet_weight
dry_weight
other_weight
cumulative_weight
remarks
error_code
driver_action
```

---

# 12. Duplicate Protection

Historical insertion uses:

```sql
ON CONFLICT (telemetry_id)
DO NOTHING
```

Therefore duplicate telemetry IDs are intentionally ignored.

This makes historical processing idempotent.

---

# 13. Insert Result

When a new record is inserted:

```json
{
  "inserted": true,
  "duplicate": false,
  "record": "..."
}
```

When the telemetry record already exists:

```json
{
  "inserted": false,
  "duplicate": true,
  "record": null
}
```

---

# 14. countRecords()

Counts all records in a historical table.

The PostgreSQL count is converted to a JavaScript number before being returned.

---

# 15. Complete Repository Flow

```text
Ward + Date
     ↓
Generate yearly table
     ↓
Generate monthly table
     ↓
Check historical structure
     ↓
Monthly telemetry table
     ↓
Insert telemetry
     ↓
Duplicate protection
     ↓
Update yearly month index
     ↓
Historical record counts
```

---

# 16. Export

The file exports a single instance of:

```text
CitizenHistoricalRepository
```

---

# 17. Summary

`citizenHistorical.repository.js` provides the database repository layer for citizen historical storage. It generates yearly/monthly table names, verifies tables, maintains monthly telemetry indexes, updates yearly month indexes with statistics, inserts historical telemetry records with duplicate protection, and counts historical records.
