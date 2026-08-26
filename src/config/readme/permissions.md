# permissions.js Documentation

## 1. File Overview

The Permissions configuration defines role-based access control for the application.

The configuration is stored in:

```text
ROLE_ACCESS
```

Three roles are defined:

```text
ADMIN_LAYER_1
ADMIN_LAYER_2
WORKER
```

---

# 2. ADMIN_LAYER_1

This role has access to:

```text
overview
waste_generators
vehicles
plants
complaints
users
```

Additional privileges:

```text
canEdit: true
canDelete: true
sensitiveAccess: true
```

This is the highest permission level defined in the configuration.

---

# 3. ADMIN_LAYER_2

This role has access to:

```text
overview
waste_generators
vehicles
plants
complaints
users
```

Additional privileges:

```text
canEdit: true
canDelete: true
sensitiveAccess: false
```

Therefore it retains editing and deletion capabilities but does not have sensitive access.

---

# 4. WORKER

The worker role has access to:

```text
overview
vehicles
plants
```

The following modules are disabled:

```text
waste_generators
complaints
users
```

Additional privileges:

```text
canEdit: false
canDelete: false
sensitiveAccess: false
```

---

# 5. Permission Matrix

| Permission | ADMIN_LAYER_1 | ADMIN_LAYER_2 | WORKER |
|---|---:|---:|---:|
| overview | Yes | Yes | Yes |
| waste_generators | Yes | Yes | No |
| vehicles | Yes | Yes | Yes |
| plants | Yes | Yes | Yes |
| complaints | Yes | Yes | No |
| users | Yes | Yes | No |
| canEdit | Yes | Yes | No |
| canDelete | Yes | Yes | No |
| sensitiveAccess | Yes | No | No |

---

# 6. Usage

The configuration can be consumed by authorization middleware through:

```text
ROLE_ACCESS[role]
```

The requested module/page can then be checked against the corresponding role configuration.

---

# 7. Export

The module exports:

```text
ROLE_ACCESS
```

---

# 8. Summary

`permissions.js` defines the application's role-based access matrix. `ADMIN_LAYER_1` has full configured access including sensitive operations, `ADMIN_LAYER_2` has broad operational access without sensitive access, and `WORKER` is restricted to overview, vehicle, and plant functionality without edit/delete privileges.
