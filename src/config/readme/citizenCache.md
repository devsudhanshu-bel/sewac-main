# citizenCache.js Documentation

## 1. File Overview

The Citizen Cache module maintains in-memory citizen RFID lookup data and scan/telemetry state.

It uses:

```text
helperDb
```

as the source for loading citizen information.

The module maintains:

```text
citizenCache
activeScans
telemetryQueue
```

---

# 2. citizenCache

The primary cache is:

```text
new Map()
```

It maps citizen RFID values to citizen information.

Each RFID entry contains:

```text
citizen
wasteType
matchedRFID
```

---

# 3. loadCitizenCache()

Loads citizen data from:

```text
master_citizen_data
```

using:

```text
helperDb.query()
```

The query retrieves:

```text
SELECT * FROM master_citizen_data
```

---

# 4. Cache Reset

Before loading new records, the existing cache is cleared using:

```text
citizenCache.clear()
```

This ensures the cache reflects the latest database query rather than retaining stale entries.

---

# 5. Wet RFID Mapping

If a citizen has:

```text
wetRFID
```

the RFID is inserted into the cache with:

```text
wasteType: "WET"
```

and:

```text
matchedRFID: citizen.wetRFID
```

---

# 6. Dry RFID Mapping

If a citizen has:

```text
dryRFID
```

the RFID is inserted with:

```text
wasteType: "DRY"
```

and:

```text
matchedRFID: citizen.dryRFID
```

---

# 7. Multiple RFID Support

A citizen can contribute up to two cache entries:

```text
wetRFID
dryRFID
```

Both entries reference the same:

```text
citizen
```

object while carrying different waste-type metadata.

---

# 8. Cache Size Logging

After loading all records, the module logs:

```text
Cache loaded with <number> RFIDs
```

The number is:

```text
citizenCache.size
```

---

# 9. activeScans

The module maintains:

```text
activeScans = new Set()
```

This provides an in-memory collection for tracking currently active scans.

No scan-processing logic is implemented in this file itself.

---

# 10. telemetryQueue

The module also initializes:

```text
telemetryQueue = []
```

This provides an in-memory telemetry queue.

No queue processing logic is implemented in this file.

---

# 11. Exports

The module exports:

```text
citizenCache
activeScans
telemetryQueue
loadCitizenCache
```

---

# 12. Complete Flow

```text
loadCitizenCache()
       ↓
Query master_citizen_data
       ↓
Clear Existing Cache
       ↓
Read Citizens
       ↓
Map wetRFID → WET
       ↓
Map dryRFID → DRY
       ↓
Log Cache Size
```

---

# 13. Summary

`citizenCache.js` provides the in-memory citizen RFID cache used for fast RFID validation and waste-type identification. It loads citizen records from `master_citizen_data`, creates separate WET and DRY RFID mappings, and also exposes shared in-memory collections for active scans and telemetry queue state.
