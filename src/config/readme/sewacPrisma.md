# sewacPrisma.js Documentation

## 1. File Overview

The SEWAC Prisma module initializes the Prisma client for the main SEWAC database.

It uses the generated Prisma client:

```text
../generated/sewac
```

---

# 2. Prisma Client Initialization

The module creates:

```text
new SewacClient()
```

and stores it as:

```text
prisma
```

---

# 3. Database Responsibility

The generated SEWAC Prisma client provides the models and datasource configuration required for main SEWAC database operations.

---

# 4. Export

The initialized Prisma client is exported:

```text
module.exports = prisma
```

---

# 5. Usage Flow

```text
Application Module
       ↓
prisma
       ↓
Generated SEWAC Prisma Client
       ↓
SEWAC Database Operations
```

---

# 6. Summary

`sewacPrisma.js` provides a shared Prisma client for the main SEWAC database by initializing the generated SEWAC Prisma client and exporting the resulting instance.
