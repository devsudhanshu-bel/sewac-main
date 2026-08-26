# masterCitizenSync.routes.js Documentation

## 1. File Overview

**File:** `masterCitizenSync.routes(1).js`\
**Location:** `src/routes/masterCitizenSync.routes.js`

The master-citizen sync router provides:

``` text
Full Master Citizen Sync
Ward-Wise Master Citizen Sync
```

It uses:

``` text
masterCitizenSync.controller
```

------------------------------------------------------------------------

# 2. POST /sync

Calls:

``` text
controller.syncAllCitizens
```

Full documented endpoint:

``` text
POST /api/master-citizen/sync
```

This route triggers synchronization for all citizens.

------------------------------------------------------------------------

# 3. POST /sync/ward/:wardNo

Calls:

``` text
controller.syncOneWard
```

Full documented endpoint:

``` text
POST /api/master-citizen/sync/ward/:wardNo
```

Path parameter:

``` text
wardNo
```

Example:

``` text
POST /api/master-citizen/sync/ward/216
```

This route triggers synchronization for one ward.

------------------------------------------------------------------------

# 4. Route Summary

  Method   Endpoint               Controller          Purpose
  -------- ---------------------- ------------------- -------------------
  POST     `/sync`                `syncAllCitizens`   Sync all citizens
  POST     `/sync/ward/:wardNo`   `syncOneWard`       Sync one ward

------------------------------------------------------------------------

# 5. Complete Route Flow

``` text
Master Citizen Sync Router
          ↓
+-------------------------------+
|                               |
POST /sync              POST /sync/ward/:wardNo
|                               |
↓                               ↓
syncAllCitizens             syncOneWard
```

------------------------------------------------------------------------

# 6. Authentication

No:

``` text
authMiddleware
checkPermission
```

is attached to these routes in the provided route file.

------------------------------------------------------------------------

# 7. Summary

`masterCitizenSync.routes(1).js` defines the master-citizen
synchronization routes. It supports a full citizen synchronization
operation and a ward-specific synchronization operation using `wardNo`.
