# SEWAC SEWAC Database Schema

## 1. File Overview

**File:** `sewac.schema(9).prisma`

This Prisma schema defines the database structure for the SEWAC
**SEWAC** data domain.

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
  output        = "../src/generated/sewac"
  binaryTargets = ["native", "debian-openssl-3.0.x"]
}
```

# 3. Database Configuration

## Datasource: `db`

``` prisma
datasource db {
provider = "postgresql"
  url      = env("SEWAC_DATABASE_URL")
}
```

# 4. Enums

## `CitizenComplaintCategory`

The schema declares:

``` prisma
enum CitizenComplaintCategory {
MISSED_COLLECTION
  OVERFLOWING_BIN
  ILLEGAL_DUMPING
  STREET_LITTER
  DAMAGED_BIN
  OTHER
}
```

## `CitizenComplaintStatus`

The schema declares:

``` prisma
enum CitizenComplaintStatus {
PENDING
  ASSIGNED
  IN_PROGRESS
  READY_FOR_VERIFICATION
  OTP_SENT
  CLOSED
}
```

# 5. Models

The schema declares the following Prisma models:

-   `telemetry_logs`
-   `vehicle_incidents`
-   `vehicle_master`
-   `vehicle_telemetry`
-   `plant_master`
-   `edit_logs`
-   `citizen_complaints`

# 5.1 `telemetry_logs` Model

The complete model declaration is:

``` prisma
model telemetry_logs {
id                   Int      @id @default(autoincrement())
  iot_timestamp        DateTime
  received_at          DateTime @default(now())
  rfid_epc             String   @db.VarChar(100)
  citizen_id           Int?
  waste_type           String?  @db.VarChar(20)
  latitude             Decimal? @db.Decimal(10, 8)
  longitude            Decimal? @db.Decimal(11, 8)
  wet_weight_kg        Decimal? @db.Decimal(10, 2)
  dry_weight_kg        Decimal? @db.Decimal(10, 2)
  other_weight_kg      Decimal? @db.Decimal(10, 2)
  cumulative_weight_kg Decimal? @db.Decimal(12, 2)
  driver_name          String?  @db.VarChar(100)
  vehicle_id           String?  @db.VarChar(50)
  firmware_version     String?  @db.VarChar(30)
  unit_number          String?  @db.VarChar(30)
  collection_type      String?  @db.VarChar(20)
  remarks              String?  @db.VarChar(1)
  err_code             String?  @db.VarChar(20)
  citizen_contact      String?  @db.VarChar(20)
  driver_action        Int      @default(0)

  @@index([rfid_epc])
  @@index([vehicle_id])
  @@index([received_at])
}
```

## Field Inventory

  Field                    Declaration
  ------------------------ ------------------------------------------
  `id`                     `Int      @id @default(autoincrement())`
  `iot_timestamp`          `DateTime`
  `received_at`            `DateTime @default(now())`
  `rfid_epc`               `String   @db.VarChar(100)`
  `citizen_id`             `Int?`
  `waste_type`             `String?  @db.VarChar(20)`
  `latitude`               `Decimal? @db.Decimal(10, 8)`
  `longitude`              `Decimal? @db.Decimal(11, 8)`
  `wet_weight_kg`          `Decimal? @db.Decimal(10, 2)`
  `dry_weight_kg`          `Decimal? @db.Decimal(10, 2)`
  `other_weight_kg`        `Decimal? @db.Decimal(10, 2)`
  `cumulative_weight_kg`   `Decimal? @db.Decimal(12, 2)`
  `driver_name`            `String?  @db.VarChar(100)`
  `vehicle_id`             `String?  @db.VarChar(50)`
  `firmware_version`       `String?  @db.VarChar(30)`
  `unit_number`            `String?  @db.VarChar(30)`
  `collection_type`        `String?  @db.VarChar(20)`
  `remarks`                `String?  @db.VarChar(1)`
  `err_code`               `String?  @db.VarChar(20)`
  `citizen_contact`        `String?  @db.VarChar(20)`
  `driver_action`          `Int      @default(0)`

## Model-Level Attributes

-   `@@index([rfid_epc])`
-   `@@index([vehicle_id])`
-   `@@index([received_at])`

# 5.2 `vehicle_incidents` Model

The complete model declaration is:

``` prisma
model vehicle_incidents {
id                Int             @id @default(autoincrement())
  vehicle_id        String?         @db.VarChar(50)
  date_time         DateTime?       @default(now()) @db.Timestamp(6)
  main_road         String?         @db.VarChar(100)
  cross_road        String?         @db.VarChar(100)
  speed_flagged_kmh Decimal?        @db.Decimal(6, 2)
  speed_limit_kmh   Decimal?        @db.Decimal(6, 2)
  excess_speed_kmh  Decimal?        @db.Decimal(6, 2)
  status            String?         @default("OVER_LIMIT") @db.VarChar(30)
  vehicle_master    vehicle_master? @relation(fields: [vehicle_id], references: [vehicle_id], onDelete: Cascade, onUpdate: NoAction)
}
```

## Field Inventory

  --------------------------------------------------------------------------------------------------------------------------------------------------------
  Field                               Declaration
  ----------------------------------- --------------------------------------------------------------------------------------------------------------------
  `id`                                `Int             @id @default(autoincrement())`

  `vehicle_id`                        `String?         @db.VarChar(50)`

  `date_time`                         `DateTime?       @default(now()) @db.Timestamp(6)`

  `main_road`                         `String?         @db.VarChar(100)`

  `cross_road`                        `String?         @db.VarChar(100)`

  `speed_flagged_kmh`                 `Decimal?        @db.Decimal(6, 2)`

  `speed_limit_kmh`                   `Decimal?        @db.Decimal(6, 2)`

  `excess_speed_kmh`                  `Decimal?        @db.Decimal(6, 2)`

  `status`                            `String?         @default("OVER_LIMIT") @db.VarChar(30)`

  `vehicle_master`                    `vehicle_master? @relation(fields: [vehicle_id], references: [vehicle_id], onDelete: Cascade, onUpdate: NoAction)`
  --------------------------------------------------------------------------------------------------------------------------------------------------------

# 5.3 `vehicle_master` Model

The complete model declaration is:

``` prisma
model vehicle_master {
id                Int                 @id @default(autoincrement())
  vehicle_id        String              @unique @db.VarChar(50)
  vehicle_type      String?             @db.VarChar(50)
  city              String?             @db.VarChar(100)
  zone              String?             @db.VarChar(100)
  division          String?             @db.VarChar(100)
  ward              String?             @db.VarChar(100)
  status            String?             @default("ACTIVE") @db.VarChar(30)
  created_at        DateTime?           @default(now()) @db.Timestamp(6)
  ward_no           Int?
  vehicle_incidents vehicle_incidents[]
  vehicle_telemetry vehicle_telemetry[]
}
```

## Field Inventory

  ----------------------------------------------------------------------------------------------
  Field                               Declaration
  ----------------------------------- ----------------------------------------------------------
  `id`                                `Int                 @id @default(autoincrement())`

  `vehicle_id`                        `String              @unique @db.VarChar(50)`

  `vehicle_type`                      `String?             @db.VarChar(50)`

  `city`                              `String?             @db.VarChar(100)`

  `zone`                              `String?             @db.VarChar(100)`

  `division`                          `String?             @db.VarChar(100)`

  `ward`                              `String?             @db.VarChar(100)`

  `status`                            `String?             @default("ACTIVE") @db.VarChar(30)`

  `created_at`                        `DateTime?           @default(now()) @db.Timestamp(6)`

  `ward_no`                           `Int?`

  `vehicle_incidents`                 `vehicle_incidents[]`

  `vehicle_telemetry`                 `vehicle_telemetry[]`
  ----------------------------------------------------------------------------------------------

# 5.4 `vehicle_telemetry` Model

The complete model declaration is:

``` prisma
model vehicle_telemetry {
id             Int             @id @default(autoincrement())
  vehicle_id     String?         @db.VarChar(50)
  latitude       Decimal?        @db.Decimal(10, 8)
  longitude      Decimal?        @db.Decimal(11, 8)
  speed_kmh      Decimal?        @db.Decimal(6, 2)
  fuel_level     Decimal?        @db.Decimal(5, 2)
  battery_health Decimal?        @db.Decimal(5, 2)
  engine_status  String?         @db.VarChar(30)
  recorded_at    DateTime?       @default(now()) @db.Timestamp(6)
  vehicle_master vehicle_master? @relation(fields: [vehicle_id], references: [vehicle_id], onDelete: Cascade, onUpdate: NoAction)
}
```

## Field Inventory

  --------------------------------------------------------------------------------------------------------------------------------------------------------
  Field                               Declaration
  ----------------------------------- --------------------------------------------------------------------------------------------------------------------
  `id`                                `Int             @id @default(autoincrement())`

  `vehicle_id`                        `String?         @db.VarChar(50)`

  `latitude`                          `Decimal?        @db.Decimal(10, 8)`

  `longitude`                         `Decimal?        @db.Decimal(11, 8)`

  `speed_kmh`                         `Decimal?        @db.Decimal(6, 2)`

  `fuel_level`                        `Decimal?        @db.Decimal(5, 2)`

  `battery_health`                    `Decimal?        @db.Decimal(5, 2)`

  `engine_status`                     `String?         @db.VarChar(30)`

  `recorded_at`                       `DateTime?       @default(now()) @db.Timestamp(6)`

  `vehicle_master`                    `vehicle_master? @relation(fields: [vehicle_id], references: [vehicle_id], onDelete: Cascade, onUpdate: NoAction)`
  --------------------------------------------------------------------------------------------------------------------------------------------------------

# 5.5 `plant_master` Model

The complete model declaration is:

``` prisma
model plant_master {
id                    Int       @id @default(autoincrement())
  plant_name            String    @db.VarChar(150)
  plant_type            String?   @db.VarChar(50)
  city                  String?   @db.VarChar(100)
  zone                  String?   @db.VarChar(100)
  division              String?   @db.VarChar(100)
  ward                  String?   @db.VarChar(100)
  plant_manager         String?   @db.VarChar(100)
  capacity_ton_per_day  Decimal?  @default(0) @db.Decimal(10, 2)
  vehicles_enrolled     Int?      @default(0)
  total_waste_collected Decimal?  @default(0) @db.Decimal(12, 2)
  latitude              Decimal?  @db.Decimal(10, 8)
  longitude             Decimal?  @db.Decimal(11, 8)
  status                String?   @default("ACTIVE") @db.VarChar(30)
  created_at            DateTime? @default(now()) @db.Timestamp(6)
}
```

## Field Inventory

  Field                     Declaration
  ------------------------- ------------------------------------------------
  `id`                      `Int       @id @default(autoincrement())`
  `plant_name`              `String    @db.VarChar(150)`
  `plant_type`              `String?   @db.VarChar(50)`
  `city`                    `String?   @db.VarChar(100)`
  `zone`                    `String?   @db.VarChar(100)`
  `division`                `String?   @db.VarChar(100)`
  `ward`                    `String?   @db.VarChar(100)`
  `plant_manager`           `String?   @db.VarChar(100)`
  `capacity_ton_per_day`    `Decimal?  @default(0) @db.Decimal(10, 2)`
  `vehicles_enrolled`       `Int?      @default(0)`
  `total_waste_collected`   `Decimal?  @default(0) @db.Decimal(12, 2)`
  `latitude`                `Decimal?  @db.Decimal(10, 8)`
  `longitude`               `Decimal?  @db.Decimal(11, 8)`
  `status`                  `String?   @default("ACTIVE") @db.VarChar(30)`
  `created_at`              `DateTime? @default(now()) @db.Timestamp(6)`

# 5.6 `edit_logs` Model

The complete model declaration is:

``` prisma
model edit_logs {
id              Int       @id @default(autoincrement())
  performed_by    String    @db.VarChar(100)
  role            String    @db.VarChar(50)
  module          String    @db.VarChar(100)
  action          String    @db.VarChar(100)
  record_id       String?   @db.VarChar(100)
  description     String?
  ip_address      String?   @db.VarChar(100)
  created_at      DateTime? @default(now()) @db.Timestamp(6)
  performed_by_id Int?
  success         Boolean?  @default(true)

  @@index([created_at], map: "idx_edit_logs_created_at")
  @@index([module], map: "idx_edit_logs_module")
  @@index([role], map: "idx_edit_logs_role")
}
```

## Field Inventory

  Field               Declaration
  ------------------- ----------------------------------------------
  `id`                `Int       @id @default(autoincrement())`
  `performed_by`      `String    @db.VarChar(100)`
  `role`              `String    @db.VarChar(50)`
  `module`            `String    @db.VarChar(100)`
  `action`            `String    @db.VarChar(100)`
  `record_id`         `String?   @db.VarChar(100)`
  `description`       `String?`
  `ip_address`        `String?   @db.VarChar(100)`
  `created_at`        `DateTime? @default(now()) @db.Timestamp(6)`
  `performed_by_id`   `Int?`
  `success`           `Boolean?  @default(true)`

## Model-Level Attributes

-   `@@index([created_at], map: "idx_edit_logs_created_at")`
-   `@@index([module], map: "idx_edit_logs_module")`
-   `@@index([role], map: "idx_edit_logs_role")`

# 5.7 `citizen_complaints` Model

The complete model declaration is:

``` prisma
model citizen_complaints {
id                      Int                      @id @default(autoincrement())
  ticket_number           String                   @unique
  phone_number            String                   @db.VarChar(20)
  title                   String                   @db.VarChar(150)
  description             String
  category                CitizenComplaintCategory
  image_url               String?
  latitude                Float
  longitude               Float
  address                 String
  status                  CitizenComplaintStatus   @default(PENDING)
  otp_hash                String?                  @db.VarChar(255)
  otp_expiry              DateTime?
  otp_verified            Boolean                  @default(false)
  assigned_to             String?                  @db.VarChar(100)
  remarks                 String?
  created_at              DateTime                 @default(now())
  updated_at              DateTime
  closed_at               DateTime?
  verification_code       String?                  @db.VarChar(6)
  verification_expires_at DateTime?                @db.Timestamp(6)

  @@index([created_at])
  @@index([phone_number])
  @@index([status])
  @@index([ticket_number])
}
```

## Field Inventory

  ----------------------------------------------------------------------------------------------
  Field                               Declaration
  ----------------------------------- ----------------------------------------------------------
  `id`                                `Int                      @id @default(autoincrement())`

  `ticket_number`                     `String                   @unique`

  `phone_number`                      `String                   @db.VarChar(20)`

  `title`                             `String                   @db.VarChar(150)`

  `description`                       `String`

  `category`                          `CitizenComplaintCategory`

  `image_url`                         `String?`

  `latitude`                          `Float`

  `longitude`                         `Float`

  `address`                           `String`

  `status`                            `CitizenComplaintStatus   @default(PENDING)`

  `otp_hash`                          `String?                  @db.VarChar(255)`

  `otp_expiry`                        `DateTime?`

  `otp_verified`                      `Boolean                  @default(false)`

  `assigned_to`                       `String?                  @db.VarChar(100)`

  `remarks`                           `String?`

  `created_at`                        `DateTime                 @default(now())`

  `updated_at`                        `DateTime`

  `closed_at`                         `DateTime?`

  `verification_code`                 `String?                  @db.VarChar(6)`

  `verification_expires_at`           `DateTime?                @db.Timestamp(6)`
  ----------------------------------------------------------------------------------------------

## Model-Level Attributes

-   `@@index([created_at])`
-   `@@index([phone_number])`
-   `@@index([status])`
-   `@@index([ticket_number])`

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
