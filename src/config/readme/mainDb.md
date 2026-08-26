# mainDb.js Documentation

## 1. File Overview

The Main DB module creates a PostgreSQL connection pool for the main SEWAC database.

It uses:

```text
pg
```

for direct PostgreSQL access.

---

# 2. Database URL

The connection string is selected using:

```text
process.env.SEWAC_DATABASE_URL
```

with fallback:

```text
process.env.DATABASE_URL
```

The effective configuration is:

```text
SEWAC_DATABASE_URL || DATABASE_URL
```

---

# 3. PostgreSQL Pool

The module initializes:

```text
new Pool()
```

using the selected connection string.

---

# 4. SSL Configuration

SSL is enabled with:

```text
rejectUnauthorized: false
```

This permits SSL database connections without enforcing certificate-authority validation.

---

# 5. Direct SQL Access

The exported pool can be used by application modules through PostgreSQL pool operations such as:

```text
query()
```

and other standard pool functionality.

---

# 6. Export

The pool is exported as:

```text
mainDb
```

---

# 7. Typical Flow

```text
Application Module
       ↓
mainDb.query()
       ↓
SEWAC PostgreSQL Database
       ↓
Query Result
```

---

# 8. Summary

`mainDb.js` provides a reusable PostgreSQL connection pool for the main SEWAC database. It prioritizes `SEWAC_DATABASE_URL`, falls back to `DATABASE_URL`, enables SSL, and exports the pool for direct SQL operations.
