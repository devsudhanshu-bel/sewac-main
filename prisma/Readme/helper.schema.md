# SEWAC Helper Database Schema

## 1. File Overview

**File:** `helper.schema(5).prisma`

This Prisma schema defines the database structure for the SEWAC Helper
data domain.

The documentation below is generated strictly from the supplied Prisma
schema and preserves the structures explicitly declared in that source.

The schema is organized around:

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

# 2. Prisma Configuration

## 2.1 Generator: `client`

``` prisma
generator client {
provider      = "prisma-client-js"
  output        = "../src/generated/helper"
  binaryTargets = ["native", "debian-openssl-3.0.x"]
}
```

The generator configuration above defines how Prisma Client is generated
for this schema.

# 3. Datasource Configuration

## 3.1 Datasource: `db`

``` prisma
datasource db {
provider = "postgresql"
  url      = env("HELPER_DATABASE_URL")
}
```

This datasource defines the database provider and connection
configuration declared by the source schema.

# 4. Enums

## 4.1 `TrackingStatus`

The schema declares:

``` prisma
enum TrackingStatus {
FOUND
  NOT_FOUND
}
```

Declared values:

-   `FOUND`
-   `NOT_FOUND`

## 4.2 `WasteType`

The schema declares:

``` prisma
enum WasteType {
DRY
  WET
}
```

Declared values:

-   `DRY`
-   `WET`

# 5. Models

The schema declares the following Prisma models:

-   `Moderator`
-   `RFIDMapping`
-   `TrackingLog`
-   `master_citizen_data`
-   `survey_attribute_specific`
-   `users`

# 6.1 `Moderator` Model

The complete model declaration is:

``` prisma
model Moderator {
id        Int      @id @default(autoincrement())
  username  String   @unique
  password  String
  role      String   @default("MODERATOR")
  createdAt DateTime @default(now())
}
```

## Field Structure

The fields declared by this model are documented according to their
exact Prisma definitions.

  Field         Declaration
  ------------- -------------------------------------
  `id`          `Int @id @default(autoincrement())`
  `username`    `String @unique`
  `password`    `String`
  `role`        `String @default("MODERATOR")`
  `createdAt`   `DateTime @default(now())`

# 6.2 `RFIDMapping` Model

The complete model declaration is:

``` prisma
model RFIDMapping {
id          Int        @id @default(autoincrement())
  slno        String
  phoneNumber String?
  rfid        String     @unique
  wasteType   WasteType?
  createdAt   DateTime   @default(now())

  @@unique([slno, wasteType])
}
```

## Field Structure

The fields declared by this model are documented according to their
exact Prisma definitions.

  Field           Declaration
  --------------- -------------------------------------
  `id`            `Int @id @default(autoincrement())`
  `slno`          `String`
  `phoneNumber`   `String?`
  `rfid`          `String @unique`
  `wasteType`     `WasteType?`
  `createdAt`     `DateTime @default(now())`

## Model-Level Attributes

-   `@@unique([slno, wasteType])`

# 6.3 `TrackingLog` Model

The complete model declaration is:

``` prisma
model TrackingLog {
id          Int            @id @default(autoincrement())
  workerId    String
  slno        String?
  citizenName String?
  phoneNumber String?
  remarks     String?
  createdAt   DateTime       @default(now())
  address     String?
  buildingNo  String?
  drySlno     String?
  floorNo     String?
  latitude    Float?
  longitude   Float?
  photoUrl    String?
  updatedAt   DateTime
  wetSlno     String?
  status      TrackingStatus @default(FOUND)
}
```

## Field Structure

The fields declared by this model are documented according to their
exact Prisma definitions.

  Field           Declaration
  --------------- -------------------------------------
  `id`            `Int @id @default(autoincrement())`
  `workerId`      `String`
  `slno`          `String?`
  `citizenName`   `String?`
  `phoneNumber`   `String?`
  `remarks`       `String?`
  `createdAt`     `DateTime @default(now())`
  `address`       `String?`
  `buildingNo`    `String?`
  `drySlno`       `String?`
  `floorNo`       `String?`
  `latitude`      `Float?`
  `longitude`     `Float?`
  `photoUrl`      `String?`
  `updatedAt`     `DateTime`
  `wetSlno`       `String?`
  `status`        `TrackingStatus @default(FOUND)`

# 6.4 `master_citizen_data` Model

The complete model declaration is:

``` prisma
model master_citizen_data {
id                  Int      @id @default(autoincrement())
  phoneNumber         String   @unique
  city                String?
  ward                String?
  area                String?
  wasteGeneratorTypes String?
  houseNumber         String?
  floorNumber         String?
  householdType       String?
  personName          String?
  contactNumber       String?
  numberOfPeople      String?
  buildingPhoto       String?
  createdAt           DateTime @default(now())
  updatedAt           DateTime
  dryRFID             String?
  drySlno             String?
  wetRFID             String?
  wetSlno             String?
  lat                 Decimal? @db.Decimal(10, 8)
  lng                 Decimal? @db.Decimal(11, 8)
}
```

## Field Structure

The fields declared by this model are documented according to their
exact Prisma definitions.

  Field                   Declaration
  ----------------------- -------------------------------------
  `id`                    `Int @id @default(autoincrement())`
  `phoneNumber`           `String @unique`
  `city`                  `String?`
  `ward`                  `String?`
  `area`                  `String?`
  `wasteGeneratorTypes`   `String?`
  `houseNumber`           `String?`
  `floorNumber`           `String?`
  `householdType`         `String?`
  `personName`            `String?`
  `contactNumber`         `String?`
  `numberOfPeople`        `String?`
  `buildingPhoto`         `String?`
  `createdAt`             `DateTime @default(now())`
  `updatedAt`             `DateTime`
  `dryRFID`               `String?`
  `drySlno`               `String?`
  `wetRFID`               `String?`
  `wetSlno`               `String?`
  `lat`                   `Decimal? @db.Decimal(10, 8)`
  `lng`                   `Decimal? @db.Decimal(11, 8)`

# 6.5 `survey_attribute_specific` Model

The complete model declaration is:

``` prisma
model survey_attribute_specific {
city                String?
  ward                String?
  area                String?
  wasteGeneratorTypes String?
  houseNumber         String?
  floorNumber         String?
  householdType       String?
  personName          String?
  contactNumber       String?
  numberOfPeople      String?
  buildingPhoto       String?
  id                  Int      @id @default(autoincrement())
  lat                 Decimal? @db.Decimal(10, 8)
  lng                 Decimal? @db.Decimal(11, 8)
  createdAt           DateTime @default(now())
  updatedAt           DateTime
}
```

## Field Structure

The fields declared by this model are documented according to their
exact Prisma definitions.

  Field                   Declaration
  ----------------------- -------------------------------------
  `city`                  `String?`
  `ward`                  `String?`
  `area`                  `String?`
  `wasteGeneratorTypes`   `String?`
  `houseNumber`           `String?`
  `floorNumber`           `String?`
  `householdType`         `String?`
  `personName`            `String?`
  `contactNumber`         `String?`
  `numberOfPeople`        `String?`
  `buildingPhoto`         `String?`
  `id`                    `Int @id @default(autoincrement())`
  `lat`                   `Decimal? @db.Decimal(10, 8)`
  `lng`                   `Decimal? @db.Decimal(11, 8)`
  `createdAt`             `DateTime @default(now())`
  `updatedAt`             `DateTime`

# 6.6 `users` Model

The complete model declaration is:

``` prisma
model users {
id            Int       @id @default(autoincrement())
  full_name     String    @db.VarChar(100)
  email         String    @unique @db.VarChar(150)
  password_hash String
  role          String    @default("citizen") @db.VarChar(20)
  created_at    DateTime? @default(now()) @db.Timestamp(6)
}
```

## Field Structure

The fields declared by this model are documented according to their
exact Prisma definitions.

  Field             Declaration
  ----------------- ----------------------------------------------
  `id`              `Int @id @default(autoincrement())`
  `full_name`       `String @db.VarChar(100)`
  `email`           `String @unique @db.VarChar(150)`
  `password_hash`   `String`
  `role`            `String @default("citizen") @db.VarChar(20)`
  `created_at`      `DateTime? @default(now()) @db.Timestamp(6)`

# 7. Database Mappings

Where the schema declares:

``` text
@@map(...)
```

the Prisma model is mapped to the specified database table name.

Where the schema declares:

``` text
@map(...)
```

the Prisma field is mapped to the specified database column name.

These mappings are part of the database contract represented by the
Prisma schema.

------------------------------------------------------------------------

# 8. Keys, Defaults, Indexes, and Constraints

The supplied schema may define database behavior through Prisma
attributes such as:

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

Only attributes actually present in the supplied source are treated as
implemented schema behavior.

------------------------------------------------------------------------

# 9. Relationship Architecture

Where explicit `@relation(...)` declarations are present, they define
Prisma-level relationships between the corresponding models.

Scalar identifier fields without an explicit Prisma relation are not
documented as foreign-key relationships solely from their names.

------------------------------------------------------------------------

# 10. Data-Type Architecture

The schema's declared Prisma scalar types determine how Helper data is
represented.

Types should be interpreted exactly as declared in the source,
including:

``` text
String
Int
BigInt
Boolean
DateTime
Decimal
Float
```

Only types actually present in the supplied schema form part of this
schema's data model.

------------------------------------------------------------------------

# 11. Optionality

A field ending in:

``` text
?
```

is optional in Prisma.

A field without:

``` text
?
```

is required.

This distinction is preserved directly from the supplied schema.

------------------------------------------------------------------------

# 12. Default Values

Where fields contain:

``` text
@default(...)
```

the specified expression is the declared default value for new records.

Where fields contain:

``` text
@updatedAt
```

Prisma manages the field's update timestamp automatically.

------------------------------------------------------------------------

# 13. Indexing

Any declared:

``` text
@index
@@index
@@unique
```

definitions are part of the schema's database access and constraint
strategy.

The exact indexed fields and combinations are preserved in each model's
declaration above.

------------------------------------------------------------------------

# 14. Complete Schema Architecture

The supplied Helper schema can be represented as:

``` text
SEWAC Helper Application
          ↓
Generated Prisma Client
          ↓
Configured PostgreSQL Database
          ↓
Helper Models
          ↓
Fields + Defaults + Constraints + Indexes + Relations
          ↓
Persistent Helper Data
```

------------------------------------------------------------------------

# 15. Important Implementation Detail

This documentation is based strictly on:

``` text
helper.schema(5).prisma
```

No external models, undocumented relations, inferred business rules, or
additional database behavior have been added.

Where the schema does not explicitly define a behavior, that behavior is
not treated as part of the Prisma schema.

------------------------------------------------------------------------

# 16. Summary

`helper.schema(5).prisma` defines the Prisma database contract for the
SEWAC Helper data layer.

The authoritative structure consists of the exact:

``` text
Generators
Datasource
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

declared in the supplied Prisma source.

The schema establishes the persistent database structure consumed by the
Helper application, while application-level business logic remains
outside the Prisma schema itself.
