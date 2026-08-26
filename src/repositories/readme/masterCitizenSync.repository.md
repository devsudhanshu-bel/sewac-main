# masterCitizenSync.repository.js Documentation

## 1. File Overview

The Master Citizen Sync Repository synchronizes citizen information from the helper database into the Master Citizen hierarchy.

The hierarchy is:

```text
City
 ↓
Zone
 ↓
Division
 ↓
Ward
 ↓
Dynamic Ward Citizen Table
```

It also maintains phone-number-to-ward mappings.

---

## 2. Configuration

The default citizen batch size is:

```text
5000
```

The ward upsert chunk size is:

```text
2000
```

The chunk size is used to keep PostgreSQL parameter usage within a safe range.

---

## 3. validateTableName()

Validates dynamic table names before SQL interpolation.

The table name must:

```text
be a non-empty string
contain only letters, numbers, and underscores
```

Unsafe names throw an error.

---

## 4. normalizeWardNumber()

Normalizes different ward representations into the actual numeric ward number.

Supported examples include:

```text
216
"216"
"Ward 216"
"WARD 216"
"ward-216"
"Ibbaluru-216"
```

The result is:

```text
216
```

or:

```text
null
```

when no valid number can be extracted.

---

## 5. normalizePhoneNumber()

Normalizes phone numbers into a canonical format.

Examples include:

```text
9876543210
919876543210
+919876543210
+91 9876543210
98765-43210
```

Indian numbers are normalized to:

```text
+91XXXXXXXXXX
```

Other valid international numbers may retain their `+` format.

Invalid numbers return:

```text
null
```

---

## 6. getHelperCitizens()

Reads citizens from:

```text
master_citizen_data
```

in the helper database.

The method supports:

```text
skip
take
```

pagination.

Results are ordered by:

```text
id ASC
```

The selected citizen fields include:

```text
id
phoneNumber
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

---

## 7. getAllWardMappings()

Builds the complete Master Citizen hierarchy.

It traverses:

```text
City
 ↓
Zone
 ↓
Division
 ↓
Ward
```

and collects the dynamic ward table information.

---

## 8. Ward Mapping Structure

Each ward mapping contains:

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

A key distinction is maintained between:

```text
wardId
```

and:

```text
wardNo
```

where:

```text
wardId = internal database ward ID
wardNo = actual municipal ward number
```

---

## 9. Ward Validation During Mapping

A ward must have:

```text
ward_table_name
```

and a valid normalized:

```text
ward_no
```

Invalid or incomplete hierarchy entries are skipped.

---

## 10. bulkUpsertWardCitizens()

Synchronizes citizens into a dynamic ward citizen table.

The operation is performed in chunks of:

```text
2000 citizens
```

The method validates:

```text
wardTableName
citizens
```

before processing.

---

## 11. Citizen Fields Upserted

The ward table synchronization includes:

```text
id
phoneNumber
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

---

## 12. Citizen Conflict Handling

The upsert uses:

```text
ON CONFLICT (id)
DO UPDATE
```

Therefore existing citizen records are updated with the latest helper-database values.

---

## 13. syncCitizenWardMappings()

Creates phone-number-to-ward mappings.

The important rule is:

```text
wardNo = actual municipal ward number
```

The mapping table stores:

```text
phone_number
ward_id
```

where the stored `ward_id` value represents the actual ward number for this mapping system.

---

## 14. Phone Normalization and Deduplication

Citizens are normalized by phone number.

A:

```text
Set
```

is used to remove duplicate phone numbers before insertion.

Invalid phone numbers are counted separately.

---

## 15. New Mapping Insert

New phone mappings are inserted into:

```text
master_citizen_map
```

using:

```text
ON CONFLICT (phone_number)
DO NOTHING
```

Existing mappings are therefore not modified.

---

## 16. Backup Mapping

Newly inserted mappings are also copied into:

```text
master_citizen_map_backup
```

Existing backup records are protected using:

```text
ON CONFLICT (phone_number)
DO NOTHING
```

---

## 17. syncCitizenWardMappings() Result

The method returns:

```text
received
validPhones
inserted
skippedExisting
skippedInvalidPhone
```

This provides synchronization statistics.

---

## 18. Complete Sync Flow

```text
Helper Database
      ↓
master_citizen_data
      ↓
Load Citizens
      ↓
Load City / Zone / Division / Ward Hierarchy
      ↓
Resolve Actual Ward Number
      ↓
Normalize Citizens
      ↓
Bulk Upsert Ward Citizens
      ↓
Normalize Phone Numbers
      ↓
Create New Phone → Ward Mappings
      ↓
Backup New Mappings
```

---

## 19. Exports

The repository exports:

```text
getHelperCitizens
getAllWardMappings
bulkUpsertWardCitizens
syncCitizenWardMappings
normalizeWardNumber
normalizePhoneNumber
```

---

## 20. Summary

`masterCitizenSync.repository.js` is responsible for synchronizing helper-database citizens into the dynamic Master Citizen ward hierarchy. It resolves actual municipal ward numbers, normalizes citizen phone numbers, performs chunked ward-table upserts, creates new phone-to-ward mappings without changing existing mappings, and backs up newly created mappings.
