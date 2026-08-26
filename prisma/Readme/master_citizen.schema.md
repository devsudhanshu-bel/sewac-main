# SEWAC Master Citizen Database Schema

## 1. File Overview

**File:** `master_citizen.schema(6).prisma`

This Prisma schema defines the database structure for the SEWAC **Master
Citizen** data domain.

The documentation below is generated strictly from the supplied Prisma
schema and preserves the structures explicitly declared in that source.

The schema is organized around:

``` text
Prisma generator configuration
PostgreSQL datasource configuration
Enums
Models
Fields
Defaults
Indexes
Relations
Database mappings
```

# 2. Prisma Client Configuration

## Generator: `client`

``` prisma
generator client {
provider      = "prisma-client-js"
  output        = "../src/generated/master_citizen"
  binaryTargets = ["native", "debian-openssl-3.0.x"]
}
```

# 3. Database Configuration

## Datasource: `db`

``` prisma
datasource db {
provider = "postgresql"
  url      = env("MASTER_CITIZEN_DATABASE_URL")
}
```

# 4. Enums

No enum declarations are present in the supplied schema.

# 5. Models

The schema declares the following Prisma models:

-   `city_table`
-   `master_citizen_map`
-   `master_citizen_map_backup`

# 5.1 `city_table` Model

The complete model declaration is:

``` prisma
model city_table {
city_id         Int       @id @default(autoincrement())
  city_name       String    @unique @db.VarChar(100)
  geo_boundary    Json?
  created_at      DateTime? @default(now()) @db.Timestamp(6)

  // Name of the dynamically-created city table.
  // Example:
  //
  // bangalore_city
  //
  city_table_name String?   @db.VarChar(150)

  @@map("city")
}
```

## Field Inventory

  Field               Declaration
  ------------------- ----------------------------------------------
  `city_id`           `Int       @id @default(autoincrement())`
  `city_name`         `String    @unique @db.VarChar(100)`
  `geo_boundary`      `Json?`
  `created_at`        `DateTime? @default(now()) @db.Timestamp(6)`
  `city_table_name`   `String?   @db.VarChar(150)`

## Model-Level Attributes

-   `@@map("city")`

# 5.2 `master_citizen_map` Model

The complete model declaration is:

``` prisma
model master_citizen_map {
id           Int      @id @default(autoincrement())

  phone_number String   @unique @db.VarChar(20)

  ward_id      Int

  created_at   DateTime @default(now()) @db.Timestamp(6)

  updated_at   DateTime @updatedAt @db.Timestamp(6)

  // Fast lookup for all citizens belonging to a Ward.
  @@index([ward_id])

  @@map("master_citizen_map")
}
```

## Field Inventory

  Field            Declaration
  ---------------- ---------------------------------------------
  `id`             `Int      @id @default(autoincrement())`
  `phone_number`   `String   @unique @db.VarChar(20)`
  `ward_id`        `Int`
  `created_at`     `DateTime @default(now()) @db.Timestamp(6)`
  `updated_at`     `DateTime @updatedAt @db.Timestamp(6)`

## Model-Level Attributes

-   `@@index([ward_id])`
-   `@@map("master_citizen_map")`

# 5.3 `master_citizen_map_backup` Model

The complete model declaration is:

``` prisma
model master_citizen_map_backup {
id           Int      @id @default(autoincrement())

  phone_number String   @db.VarChar(20)

  ward_id      Int

  created_at   DateTime @default(now()) @db.Timestamp(6)

  updated_at   DateTime @updatedAt @db.Timestamp(6)

  // Fast lookup by phone number.
  @@index([phone_number])

  // Fast lookup by Ward.
  @@index([ward_id])

  @@map("master_citizen_map_backup")
}
```

## Field Inventory

  Field            Declaration
  ---------------- ---------------------------------------------
  `id`             `Int      @id @default(autoincrement())`
  `phone_number`   `String   @db.VarChar(20)`
  `ward_id`        `Int`
  `created_at`     `DateTime @default(now()) @db.Timestamp(6)`
  `updated_at`     `DateTime @updatedAt @db.Timestamp(6)`

## Model-Level Attributes

-   `@@index([phone_number])`
-   `@@index([ward_id])`
-   `@@map("master_citizen_map_backup")`

# 6. Database Mappings

Where the schema declares:

``` text
@map(...)
@@map(...)
```

those declarations define Prisma-to-database field or table mappings.

------------------------------------------------------------------------

# 7. Keys, Defaults, Indexes, and Constraints

The schema's database behavior is defined by the exact attributes
present in the source, including where applicable:

``` text
@id
@unique
@@unique
@@index
@default
@updatedAt
@relation
@map
@@map
```

No constraint or index is inferred where one is not explicitly declared.

------------------------------------------------------------------------

# 8. Relationship Architecture

Where explicit `@relation(...)` declarations are present, they define
Prisma-level relationships between the corresponding models.

Scalar identifier fields without an explicit Prisma relation are not
documented as relations solely because of their names.

------------------------------------------------------------------------

# 9. Data-Type Architecture

The Prisma scalar types, optionality markers, database-specific
mappings, and defaults shown above are the authoritative representation
of the supplied schema.

A field ending with:

``` text
?
```

is optional.

A field without `?` is required.

------------------------------------------------------------------------

# 10. Complete Schema Flow

``` text
SEWAC Application
        ↓
Generated Prisma Client
        ↓
Configured Database
        ↓
Declared Models
        ↓
Fields + Constraints + Indexes + Relations
        ↓
Persistent Data
```

------------------------------------------------------------------------

# 11. Important Implementation Detail

This documentation is based strictly on the supplied Prisma source.

No external models, undocumented relations, inferred business rules, or
additional database behavior have been added.

Where the schema does not explicitly define a behavior, that behavior is
not treated as implemented by the schema.

------------------------------------------------------------------------

# 12. Summary

The supplied Prisma schema establishes the persistent database contract
for the SEWAC {domain} data layer.

Its authoritative structure consists of the exact:

``` text
Generators
Datasource
Enums
Models
Fields
Data Types
Defaults
Mappings
Indexes
Constraints
Relations
```

declared in the source file.

Application-level business logic, processing workflows, validation, and
analytics remain outside the Prisma schema unless explicitly represented
by schema constraints.
