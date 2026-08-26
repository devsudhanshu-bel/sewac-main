# masterCitizenPrisma.js Documentation

## 1. File Overview

The Master Citizen Prisma module initializes the Prisma client for the Master Citizen database.

It uses the generated Prisma client:

```text
../generated/master_citizen
```

---

# 2. Prisma Client Initialization

The module creates:

```text
new PrismaClient()
```

and stores the instance as:

```text
masterCitizenPrisma
```

---

# 3. Database Responsibility

The client is dedicated to Master Citizen database operations.

It can be used by application modules for Prisma-based operations defined by the generated Master Citizen schema.

---

# 4. Export

The initialized client is exported directly:

```text
module.exports = masterCitizenPrisma
```

---

# 5. Usage Flow

```text
Application Module
       ↓
masterCitizenPrisma
       ↓
Generated Master Citizen Prisma Schema
       ↓
Database Operations
```

---

# 6. Summary

`masterCitizenPrisma.js` provides a shared Prisma client for the Master Citizen database. It initializes the generated Master Citizen Prisma client and exports the instance for reuse across the application.
