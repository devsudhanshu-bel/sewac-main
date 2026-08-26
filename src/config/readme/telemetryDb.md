# telemetryDb.js Documentation

## 1. File Overview

The Telemetry DB module initializes the Prisma client used for telemetry database operations.

It imports:

```text
PrismaClient
```

from:

```text
../../generated/telemetry
```

---

# 2. Prisma Client Initialization

The module creates:

```text
new PrismaClient()
```

with:

```text
log: ["error"]
```

This configures Prisma to log database errors.

---

# 3. Database Responsibility

The client is dedicated to telemetry database operations.

It can be used by modules responsible for:

```text
Vehicle Telemetry
Telemetry Processing
Telemetry Queries
```

according to the generated telemetry Prisma schema.

---

# 4. Export

The initialized client is exported as:

```text
telemetryDb
```

---

# 5. Usage Flow

```text
Application Module
       ↓
telemetryDb
       ↓
Generated Telemetry Prisma Client
       ↓
Telemetry Database
```

---

# 6. Summary

`telemetryDb.js` provides the application's Prisma client for telemetry database access. It uses the generated telemetry Prisma package and enables error-level Prisma logging.
