# citizenHistoricalPrisma.js Documentation

## 1. File Overview

The Citizen Historical Prisma module creates the dedicated Prisma client for the:

```text
citizen_historical_db
```

database.

This client is isolated from:

```text
Helper DB
Master Citizen DB
Telemetry DB
Main SEWAC DB
```

---

# 2. Prisma Client

The Prisma client is imported from:

```text
../generated/citizenHistorical
```

A dedicated instance is created using:

```text
new PrismaClient()
```

with:

```text
log: ["error"]
```

---

# 3. Database Responsibility

The client is intended only for:

```text
Historical Processing
Historical Storage
```

It is not shared with the other application databases.

---

# 4. connectCitizenHistoricalDB()

Explicitly establishes a connection using:

```text
citizenHistoricalPrisma.$connect()
```

---

# 5. Successful Connection

After a successful connection, the module logs:

```text
Citizen Historical DB connected successfully
```

---

# 6. Connection Failure

If the connection fails:

```text
Citizen Historical DB connection failed:
```

is logged and the original error is rethrown.

This allows the application startup or caller to handle the connection failure.

---

# 7. disconnectCitizenHistoricalDB()

Disconnects the Prisma client using:

```text
citizenHistoricalPrisma.$disconnect()
```

---

# 8. Successful Disconnect

The module logs:

```text
Citizen Historical DB disconnected
```

---

# 9. Disconnect Error

Disconnect failures are logged as:

```text
Citizen Historical DB disconnect failed:
```

The error is not rethrown.

---

# 10. Exports

The module exports the Prisma client:

```text
citizenHistoricalPrisma
```

and additionally exposes:

```text
connectCitizenHistoricalDB
disconnectCitizenHistoricalDB
```

---

# 11. Connection Lifecycle

```text
Application
    ↓
connectCitizenHistoricalDB()
    ↓
citizenHistoricalPrisma
    ↓
Historical Operations
    ↓
disconnectCitizenHistoricalDB()
```

---

# 12. Summary

`citizenHistoricalPrisma.js` provides an isolated Prisma client dedicated to the Citizen Historical database. It configures error-level Prisma logging and exposes explicit connection and disconnection helpers for the historical processing subsystem.
