# permissions(6).js Documentation

## 1. File Overview

This file defines the application's role-based access-control configuration.

Three roles are configured:

```text
ADMIN_LAYER_1
ADMIN_LAYER_2
WORKER
```

## 2. ADMIN_LAYER_1

Access:

```text
overview
waste_generators
vehicles
plants
logs
audit_logs
edit_logs
users
settings
```

Privileges:

```text
canEdit = true
canDelete = true
sensitiveAccess = true
```

This is the most privileged role defined in the file.

## 3. ADMIN_LAYER_2

Access:

```text
overview
waste_generators
vehicles
plants
logs
audit_logs
users
settings
```

`edit_logs` is disabled.

Privileges:

```text
canEdit = false
canDelete = false
sensitiveAccess = false
```

## 4. WORKER

Access:

```text
overview
vehicles
plants
logs
settings
```

Disabled areas:

```text
waste_generators
audit_logs
edit_logs
users
```

Privileges:

```text
canEdit = false
canDelete = false
sensitiveAccess = false
```

## 5. Permission Matrix

| Permission | ADMIN_LAYER_1 | ADMIN_LAYER_2 | WORKER |
|---|---:|---:|---:|
| overview | Yes | Yes | Yes |
| waste_generators | Yes | Yes | No |
| vehicles | Yes | Yes | Yes |
| plants | Yes | Yes | Yes |
| logs | Yes | Yes | Yes |
| audit_logs | Yes | Yes | No |
| edit_logs | Yes | No | No |
| users | Yes | Yes | No |
| settings | Yes | Yes | Yes |
| canEdit | Yes | No | No |
| canDelete | Yes | No | No |
| sensitiveAccess | Yes | No | No |

## 6. Export

The complete permission object is exported with:

```text
module.exports = ROLE_ACCESS;
```

Other modules can import this configuration when making role-based authorization or access decisions.

## 7. Access Structure

Based strictly on the configured permissions:

```text
ADMIN_LAYER_1
    ↓
Highest configured access
    ↓
ADMIN_LAYER_2
    ↓
Restricted administrative access
    ↓
WORKER
    ↓
Operational access
```

The file defines the permission matrix itself; it does not contain the enforcement mechanism.

## 8. Summary

`permissions(6).js` centralizes role-based access configuration for the three defined SEWAC roles. It controls application-section access together with editing, deletion, and sensitive-access privileges.
