# citizenHistoricalProcessing.repository.js Documentation

## 1. File Overview

**File:** `citizenHistoricalProcessing.repository.js`

The processing repository provides database access for:

```text
Historical Processing Jobs
Historical Processing Records
```

It supports discovery, schema inspection, row counts, batch reads, keyset pagination, and table pattern matching.

---

# 2. DEFAULT_BATCH_SIZE

The default processing batch size is:

```text
500
```

This value is exposed as:

```text
DEFAULT_BATCH_SIZE
```

---

# 3. validateIdentifier()

Validates dynamic PostgreSQL identifiers.

A valid identifier must:

```text
be a string
start with a letter
contain letters, numbers, or underscores
```

Invalid identifiers throw:

```text
Invalid SQL identifier
```

---

# 4. getPublicTables()

Retrieves all base tables from:

```text
public
```

The results are ordered by:

```text
table_name ASC
```

The function returns only table names.

---

# 5. getTableColumns()

Retrieves schema information for a specified table.

The returned fields include:

```text
column_name
data_type
udt_name
is_nullable
ordinal_position
```

Results are ordered by:

```text
ordinal_position ASC
```

---

# 6. tableExists()

Checks whether a specified table exists in the public schema.

Returns:

```text
true
```

or:

```text
false
```

---

# 7. getTableRowCount()

Counts all rows in a specified table.

The PostgreSQL count is converted to a JavaScript number.

---

# 8. getDailyTableBatch()

Reads a batch from a daily table.

Parameters:

```text
tableName
offset
limit
```

Default values:

```text
offset = 0
limit = 500
```

---

# 9. Batch Size Validation

The batch limit must:

```text
be an integer
be greater than 0
not exceed 5000
```

The offset must:

```text
be an integer
be >= 0
```

Invalid values throw an error.

---

# 10. Batch Ordering

Records are selected using:

```text
ORDER BY id ASC
```

and retrieved using:

```text
LIMIT
OFFSET
```

---

# 11. getDailyTableBatchAfterId()

Provides keyset pagination.

Instead of using:

```text
OFFSET
```

the query uses:

```text
WHERE id > lastId
```

and:

```text
ORDER BY id ASC
```

This is intended to perform better for very large tables.

---

# 12. Keyset Pagination Validation

`lastId` must:

```text
be an integer
be >= 0
```

The batch limit follows the same:

```text
1–5000
```

validation.

---

# 13. getTableIdRange()

Retrieves:

```text
MIN(id)
MAX(id)
```

from a table.

The result contains:

```text
firstId
lastId
```

---

# 14. getTableTimestampColumns()

Inspects table columns and identifies timestamp fields matching:

```text
iot_timestamp
iotTimestamp
received_timestamp
receivedTimestamp
created_at
createdAt
```

This can be used to determine date-related columns in discovered tables.

---

# 15. getTableSample()

Retrieves a small sample of rows from a table.

Default:

```text
5 rows
```

Maximum:

```text
100 rows
```

Records are ordered by:

```text
id ASC
```

---

# 16. getTablesMatchingPattern()

Retrieves public base tables whose names match a supplied PostgreSQL `LIKE` pattern.

The function requires a non-empty string pattern.

Results are ordered by:

```text
table_name ASC
```

---

# 17. Source Table Protection

The repository explicitly documents that:

```text
getDailyTableBatch()
```

only reads the source table.

It does not:

```text
INSERT
UPDATE
DELETE
```

records in the daily vehicle table.

---

# 18. Pagination Strategy

The repository supports two approaches:

```text
OFFSET pagination
```

and:

```text
Keyset pagination
```

For large historical datasets, keyset pagination is preferable because it avoids repeatedly scanning and skipping large numbers of previous rows.

---

# 19. Complete Repository Flow

```text
Discover Tables
      ↓
Inspect Schema
      ↓
Check Table
      ↓
Count Rows
      ↓
Read Batch
      ↓
OR
Read After Last ID
      ↓
Process Records
```

---

# 20. Exports

The repository exports:

```text
DEFAULT_BATCH_SIZE
validateIdentifier
getPublicTables
getTableColumns
tableExists
getTableRowCount
getDailyTableBatch
getDailyTableBatchAfterId
getTableIdRange
getTableTimestampColumns
getTableSample
getTablesMatchingPattern
```

---

# 21. Summary

`citizenHistoricalProcessing.repository.js` is the source-table inspection and batch-reading repository for historical processing. It discovers public tables, inspects schemas, validates identifiers, checks existence, counts records, reads batches using offset or keyset pagination, determines timestamp columns, samples tables, and discovers tables matching a naming pattern.
