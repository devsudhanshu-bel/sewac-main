# cmadsPrisma.js Documentation

## 1. File Overview

The CMADS Prisma module creates a Prisma client for the CMADS database.

It uses the generated Prisma client:

```text
../generated/cmads
```

---

# 2. Prisma Client Initialization

A Prisma client is created using:

```text
new PrismaClient()
```

---

# 3. Database URL

The Prisma datasource URL is explicitly configured using:

```text
process.env.CMADS_DATABASE_URL
```

If that value is unavailable, it falls back to:

```text
process.env.DATABASE_URL
```

The effective configuration is:

```text
CMADS_DATABASE_URL || DATABASE_URL
```

---

# 4. Datasource Override

The datasource configuration is passed directly through:

```text
datasources.db.url
```

This ensures the generated CMADS Prisma client connects using the configured CMADS database URL.

---

# 5. Export

The initialized Prisma client is exported directly:

```text
module.exports = prisma
```

---

# 6. Usage

Other modules can import the exported client and use it for CMADS database operations such as:

```text
Queries
Creates
Updates
Deletes
Transactions
```

depending on the generated Prisma schema.

---

# 7. Summary

`cmadsPrisma.js` initializes and exports a Prisma client dedicated to CMADS database access. It prioritizes `CMADS_DATABASE_URL` and falls back to `DATABASE_URL` when the CMADS-specific environment variable is unavailable.
