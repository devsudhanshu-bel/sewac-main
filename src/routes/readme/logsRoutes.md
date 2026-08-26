# logsRoutes.js Documentation

## 1. File Overview

**File:** `logsRoutes.js`\
**Location:** `src/routes/logsRoutes.js`

The logs router provides endpoints for:

``` text
Logs Summary
Audit Logs
Edit Logs
```

It uses:

``` text
authMiddleware
checkPermission
logsController
```

------------------------------------------------------------------------

# 2. GET /summary

Calls:

``` text
logsController.getLogsSummary
```

Protected by:

``` text
authMiddleware
checkPermission("logs")
```

This route provides the logs summary operation.

------------------------------------------------------------------------

# 3. GET /audit

Calls:

``` text
logsController.getAuditLogs
```

Protected by:

``` text
authMiddleware
checkPermission("audit_logs")
```

This route provides access to audit logs.

------------------------------------------------------------------------

# 4. GET /edit

Calls:

``` text
logsController.getEditLogs
```

Protected by:

``` text
authMiddleware
checkPermission("edit_logs")
```

This route provides access to edit logs.

------------------------------------------------------------------------

# 5. Route Protection

  Method   Endpoint     Permission     Controller
  -------- ------------ -------------- ------------------
  GET      `/summary`   `logs`         `getLogsSummary`
  GET      `/audit`     `audit_logs`   `getAuditLogs`
  GET      `/edit`      `edit_logs`    `getEditLogs`

All three routes first use:

``` text
authMiddleware
```

------------------------------------------------------------------------

# 6. Complete Route Flow

``` text
Logs Router
     ↓
authMiddleware
     ↓
Permission Check
     ↓
+------------------+------------------+
|                  |                  |
/summary          /audit             /edit
|                  |                  |
↓                  ↓                  ↓
getLogsSummary   getAuditLogs      getEditLogs
```

------------------------------------------------------------------------

# 7. Endpoint Summary

  Method   Endpoint     Purpose
  -------- ------------ ------------------
  GET      `/summary`   Get logs summary
  GET      `/audit`     Get audit logs
  GET      `/edit`      Get edit logs

------------------------------------------------------------------------

# 8. Summary

`logsRoutes.js` is the protected logs routing layer. It exposes separate
endpoints for the logs summary, audit logs, and edit logs, with each
endpoint requiring authentication and its corresponding permission.
