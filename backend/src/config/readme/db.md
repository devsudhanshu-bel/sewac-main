# db.js Documentation

## 1. File Overview

This file creates and exports a PostgreSQL connection pool using the `pg` package.

It obtains the database connection configuration from the environment and exposes the configured pool for use by other application modules.

## 2. Dependencies

The file imports:

```text
pg
dotenv
```

Environment variables are initialized with:

```text
require("dotenv").config();
```

## 3. PostgreSQL Connection

A PostgreSQL `Pool` is created using:

```text
process.env.DATABASE_URL
```

The pool configuration enables SSL:

```text
ssl: {
  rejectUnauthorized: false
}
```

## 4. Export

The configured pool is exported with:

```text
module.exports = pool;
```

This allows other modules to reuse the PostgreSQL connection pool.

## 5. Execution Flow

```text
Load pg
   ↓
Load environment variables
   ↓
Read DATABASE_URL
   ↓
Create PostgreSQL Pool
   ↓
Configure SSL
   ↓
Export pool
```

## 6. Summary

`db.js` provides the application's PostgreSQL database connection pool. It loads environment variables, creates a `pg` pool from `DATABASE_URL`, enables SSL with certificate verification disabled, and exports the pool for reuse.
