# helperDb.js Documentation

## 1. File Overview

The Helper DB module creates a PostgreSQL connection pool using the Node.js:

```text
pg
```

library.

The pool is used for direct SQL access to the Helper database.

---

# 2. PostgreSQL Pool

The module creates:

```text
new Pool()
```

using a database connection string.

---

# 3. Database URL

The connection string is selected using:

```text
process.env.HELPER_DATABASE_URL
```

with fallback:

```text
process.env.DATABASE_URL
```

Therefore:

```text
HELPER_DATABASE_URL || DATABASE_URL
```

determines the active database connection.

---

# 4. SSL Configuration

The PostgreSQL connection enables SSL with:

```text
rejectUnauthorized: false
```

This allows the application to establish SSL connections without requiring certificate-authority verification.

---

# 5. Direct SQL Usage

Because the module exports a PostgreSQL:

```text
Pool
```

other modules can perform direct queries through methods such as:

```text
query()
```

---

# 6. Export

The initialized pool is exported as:

```text
helperDb
```

---

# 7. Typical Flow

```text
Application Module
      ↓
helperDb.query()
      ↓
PostgreSQL Helper Database
      ↓
Query Result
```

---

# 8. Summary

`helperDb.js` provides a reusable PostgreSQL connection pool for the Helper database. It selects `HELPER_DATABASE_URL` when available, falls back to `DATABASE_URL`, enables SSL, and exports the pool for direct SQL operations.
