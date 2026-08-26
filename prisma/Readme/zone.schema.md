# SEWAC Zone Database Schema

## 1. File Overview

**File:** `zone.schema(7).prisma`

This Prisma schema defines the database structure for the SEWAC Zone
data domain.

The documentation is generated strictly from the supplied Prisma schema
and preserves the structures explicitly declared in the source.

The schema consists of:

``` text
Prisma generator configuration
PostgreSQL datasource configuration
Declared enums
Declared models
Fields
Defaults
Indexes
Relations
Database mappings
```

------------------------------------------------------------------------

# 2. Prisma Generator Configuration

## Generator: `client`

``` prisma
generator client {
provider      = "prisma-client-js"
  output        = "../src/generated/zone"
  binaryTargets = ["native", "debian-openssl-3.0.x"]
}
```

This generator defines how the Prisma Client for the Zone schema is
generated.

# 3. Datasource Configuration

## Datasource: `db`

``` prisma
datasource db {
provider = "postgresql"
  url      = env("SEWAC_ZONE_URL")
}
```

This datasource defines the database provider and connection
configuration declared by the source schema.

# 4. Enums

No enum declarations were detected in the supplied schema.

# 5. Models

The schema declares the following Prisma models:

-   `city_table`
-   `division_table`
-   `ward_table`
-   `zone_table`

# 5.1 `city_table` Model

The model is declared as:

``` prisma
model city_table {
city_id        Int              @id @default(autoincrement())
  city_name      String           @unique @db.VarChar(100)
  geo_boundary   Json?
  created_at     DateTime?        @default(now()) @db.Timestamp(6)
  division_table division_table[]
  ward_table     ward_table[]
  zone_table     zone_table[]
}
```

## Field Inventory

  Field              Declaration
  ------------------ -----------------------------------------------------
  `city_id`          `Int              @id @default(autoincrement())`
  `city_name`        `String           @unique @db.VarChar(100)`
  `geo_boundary`     `Json?`
  `created_at`       `DateTime?        @default(now()) @db.Timestamp(6)`
  `division_table`   `division_table[]`
  `ward_table`       `ward_table[]`
  `zone_table`       `zone_table[]`

# 5.2 `division_table` Model

The model is declared as:

``` prisma
model division_table {
division_id   Int          @id @default(autoincrement())
  division_name String       @db.VarChar(150)
  city_id       Int
  zone_id       Int
  geo_boundary  Json?
  created_at    DateTime?    @default(now()) @db.Timestamp(6)
  city_table    city_table   @relation(fields: [city_id], references: [city_id], onDelete: Cascade, onUpdate: NoAction, map: "fk_division_city")
  zone_table    zone_table   @relation(fields: [zone_id], references: [zone_id], onDelete: Cascade, onUpdate: NoAction, map: "fk_division_zone")
  ward_table    ward_table[]

  @@index([city_id], map: "idx_division_city")
  @@index([city_id, zone_id], map: "idx_division_city_zone")
  @@index([zone_id], map: "idx_division_zone")
}
```

## Field Inventory

  ------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  Field                               Declaration
  ----------------------------------- ------------------------------------------------------------------------------------------------------------------------------------
  `division_id`                       `Int          @id @default(autoincrement())`

  `division_name`                     `String       @db.VarChar(150)`

  `city_id`                           `Int`

  `zone_id`                           `Int`

  `geo_boundary`                      `Json?`

  `created_at`                        `DateTime?    @default(now()) @db.Timestamp(6)`

  `city_table`                        `city_table   @relation(fields: [city_id], references: [city_id], onDelete: Cascade, onUpdate: NoAction, map: "fk_division_city")`

  `zone_table`                        `zone_table   @relation(fields: [zone_id], references: [zone_id], onDelete: Cascade, onUpdate: NoAction, map: "fk_division_zone")`

  `ward_table`                        `ward_table[]`
  ------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Model-Level Attributes

-   `@@index([city_id], map: "idx_division_city")`
-   `@@index([city_id, zone_id], map: "idx_division_city_zone")`
-   `@@index([zone_id], map: "idx_division_zone")`

# 5.3 `ward_table` Model

The model is declared as:

``` prisma
model ward_table {
ward_id        Int            @id @default(autoincrement())
  ward_no        Int            @unique
  ward_name      String         @db.VarChar(150)
  city_id        Int
  zone_id        Int
  division_id    Int
  geo_boundary   Json?
  created_at     DateTime?      @default(now()) @db.Timestamp(6)
  city_table     city_table     @relation(fields: [city_id], references: [city_id], onDelete: Cascade, onUpdate: NoAction, map: "fk_ward_city")
  division_table division_table @relation(fields: [division_id], references: [division_id], onDelete: Cascade, onUpdate: NoAction, map: "fk_ward_division")
  zone_table     zone_table     @relation(fields: [zone_id], references: [zone_id], onDelete: Cascade, onUpdate: NoAction, map: "fk_ward_zone")

  @@index([city_id], map: "idx_ward_city")
  @@index([division_id], map: "idx_ward_division")
  @@index([city_id, zone_id, division_id], map: "idx_ward_hierarchy")
  @@index([zone_id], map: "idx_ward_zone")
}
```

## Field Inventory

  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  Field                               Declaration
  ----------------------------------- ----------------------------------------------------------------------------------------------------------------------------------------------
  `ward_id`                           `Int            @id @default(autoincrement())`

  `ward_no`                           `Int            @unique`

  `ward_name`                         `String         @db.VarChar(150)`

  `city_id`                           `Int`

  `zone_id`                           `Int`

  `division_id`                       `Int`

  `geo_boundary`                      `Json?`

  `created_at`                        `DateTime?      @default(now()) @db.Timestamp(6)`

  `city_table`                        `city_table     @relation(fields: [city_id], references: [city_id], onDelete: Cascade, onUpdate: NoAction, map: "fk_ward_city")`

  `division_table`                    `division_table @relation(fields: [division_id], references: [division_id], onDelete: Cascade, onUpdate: NoAction, map: "fk_ward_division")`

  `zone_table`                        `zone_table     @relation(fields: [zone_id], references: [zone_id], onDelete: Cascade, onUpdate: NoAction, map: "fk_ward_zone")`
  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Model-Level Attributes

-   `@@index([city_id], map: "idx_ward_city")`
-   `@@index([division_id], map: "idx_ward_division")`
-   `@@index([city_id, zone_id, division_id], map: "idx_ward_hierarchy")`
-   `@@index([zone_id], map: "idx_ward_zone")`

# 5.4 `zone_table` Model

The model is declared as:

``` prisma
model zone_table {
zone_id         Int              @id @default(autoincrement())
  zone_name       String           @db.VarChar(150)
  city_id         Int
  total_divisions Int?             @default(0)
  total_wards     Int?             @default(0)
  geo_boundary    Json?
  created_at      DateTime?        @default(now()) @db.Timestamp(6)
  division_table  division_table[]
  ward_table      ward_table[]
  city_table      city_table       @relation(fields: [city_id], references: [city_id], onDelete: Cascade, onUpdate: NoAction, map: "fk_zone_city")

  @@index([city_id], map: "idx_zone_city")
  @@index([zone_name], map: "idx_zone_name")
}
```

## Field Inventory

  ------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  Field                               Declaration
  ----------------------------------- ------------------------------------------------------------------------------------------------------------------------------------
  `zone_id`                           `Int              @id @default(autoincrement())`

  `zone_name`                         `String           @db.VarChar(150)`

  `city_id`                           `Int`

  `total_divisions`                   `Int?             @default(0)`

  `total_wards`                       `Int?             @default(0)`

  `geo_boundary`                      `Json?`

  `created_at`                        `DateTime?        @default(now()) @db.Timestamp(6)`

  `division_table`                    `division_table[]`

  `ward_table`                        `ward_table[]`

  `city_table`                        `city_table       @relation(fields: [city_id], references: [city_id], onDelete: Cascade, onUpdate: NoAction, map: "fk_zone_city")`
  ------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Model-Level Attributes

-   `@@index([city_id], map: "idx_zone_city")`
-   `@@index([zone_name], map: "idx_zone_name")`

# 6. Database Mappings

Where the schema declares:

``` text
@@map(...)
```

the Prisma model is mapped to the specified database table.

Where the schema declares:

``` text
@map(...)
```

the Prisma field is mapped to the specified database column.

These mappings are part of the database contract defined by the Zone
schema.

------------------------------------------------------------------------

# 7. Keys, Defaults, Indexes, and Constraints

The schema may define database behavior through:

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

Only declarations actually present in the supplied source are treated as
implemented behavior.

------------------------------------------------------------------------

# 8. Relationship Architecture

Where an explicit:

``` text
@relation(...)
```

is declared, it defines a Prisma-level relationship between the
corresponding models.

Scalar fields are not treated as relations unless the schema explicitly
declares the relation.

------------------------------------------------------------------------

# 9. Optionality

Fields declared with:

``` text
?
```

are optional.

Fields without:

``` text
?
```

are required.

This distinction is preserved exactly from the supplied Prisma schema.

------------------------------------------------------------------------

# 10. Default Values

Fields containing:

``` text
@default(...)
```

have the declared default value when a new record is created.

Fields containing:

``` text
@updatedAt
```

are automatically maintained by Prisma when the record is updated.

------------------------------------------------------------------------

# 11. Indexing Strategy

Any declared:

``` text
@unique
@@unique
@@index
```

definitions form part of the schema's database access and constraint
strategy.

The exact declarations are preserved under each model above.

------------------------------------------------------------------------

# 12. Complete Zone Schema Architecture

``` text
SEWAC Zone Application
        ↓
Generated Prisma Client
        ↓
Configured PostgreSQL Database
        ↓
Zone Models
        ↓
Fields + Defaults + Constraints + Indexes + Relations
        ↓
Persistent Zone Data
```

------------------------------------------------------------------------

# 13. Important Implementation Detail

This documentation is based strictly on:

``` text
zone.schema(7).prisma
```

No external models, undocumented relationships, inferred business rules,
or additional database behavior have been added.

Where the supplied Prisma schema does not explicitly define a behavior,
that behavior is not treated as part of the schema.

------------------------------------------------------------------------

# 14. Summary

`zone.schema(7).prisma` defines the Prisma database contract for the
SEWAC Zone data layer.

The authoritative structure consists of the exact:

``` text
Generator configuration
Datasource configuration
Enums
Models
Fields
Data types
Defaults
Mappings
Indexes
Constraints
Relations
```

declared in the supplied source.

The schema establishes the persistent database structure used by the
Zone application layer, while application-level business logic remains
outside the Prisma schema itself.
