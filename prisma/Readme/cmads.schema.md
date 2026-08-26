# SEWAC CMADS Database Schema

## 1. File Overview

**File:** `cmads.schema.prisma`

This Prisma schema defines the database structure for the SEWAC
**CMADS** data domain.

The provided schema is documented below strictly from the supplied
Prisma source.

------------------------------------------------------------------------

# 2. Prisma Schema Source

The supplied schema contains:

``` text
generator client {
  provider      = "prisma-client-js"
  output        = "../src/generated/cmads"
  binaryTargets = ["native", "debian-openssl-3.0.x"]
}

datasource db {
  provider = "postgresql"
  url      = env("CMADS_DATABASE_URL")
}

model admins {
  id                Int                 @id(map: "users_pkey") @default(autoincrement())
  full_name         String              @db.VarChar(100)
  email             String              @unique(map: "users_email_key") @db.VarChar(150)
  password_hash     String
  created_at        DateTime?           @default(now()) @db.Timestamp(6)
  role              String              @default("WORKER") @db.VarChar(50)
  phone_number      String?             @db.VarChar(20)
  parent_admin_id   Int?
  status            String?             @default("ACTIVE") @db.VarChar(30)
  behavior_profiles behavior_profiles[]
  behavior_samples  behavior_samples[]
  devices           devices[]
  risk_events       risk_events[]
  preferences admin_preferences?
  edit_requests_requested edit_requests[] @relation("EditRequestRequester")
  edit_requests_approved edit_requests[] @relation("EditRequestApprover")
  temporary_permissions temporary_permissions[]
}

model admin_preferences {
  id                  Int      @id @default(autoincrement())
  admin_id            Int      @unique
  language            String   @default("English") @db.VarChar(30)
  theme               String   @default("Light") @db.VarChar(30)
  date_format         String   @default("DD MMM YYYY") @db.VarChar(30)
  time_format         String   @default("12 Hour") @db.VarChar(30)
  default_dashboard   String   @default("Overview") @db.VarChar(50)
  created_at          DateTime @default(now()) @db.Timestamp(6)
  updated_at          DateTime @updatedAt @db.Timestamp(6)
  admin admins @relation(fields: [admin_id], references: [id], onDelete: Cascade)
}

model audit_logs {
  id                Int       @id @default(autoincrement())
  admin_id          Int?
  event_type        String    @db.VarChar(100)
  event_description String?
  ip_address        String?   @db.VarChar(100)
  created_at        DateTime? @default(now()) @db.Timestamp(6)
}

model behavior_profiles {
  id                  Int       @id @default(autoincrement())
  admin_id            Int
  enrollment_phrase   String    @db.VarChar(255)
  avg_dwell_time      Decimal?  @db.Decimal(10, 2)
  avg_flight_time     Decimal?  @db.Decimal(10, 2)
  avg_typing_speed    Decimal?  @db.Decimal(10, 2)
  avg_backspace_usage Decimal?  @db.Decimal(10, 2)
  avg_error_rate      Decimal?  @db.Decimal(10, 2)
  created_at          DateTime? @default(now()) @db.Timestamp(6)
  admins              admins    @relation(fields: [admin_id], references: [id], onDelete: Cascade, onUpdate: NoAction, map: "fk_behavior_admin")
}

model behavior_samples {
  id                  Int       @id @default(autoincrement())
  admin_id            Int
  dwell_time          Decimal?  @db.Decimal(10, 2)
  flight_time         Decimal?  @db.Decimal(10, 2)
  typing_speed        Decimal?  @db.Decimal(10, 2)
  backspace_usage     Decimal?  @db.Decimal(10, 2)
  error_rate          Decimal?  @db.Decimal(10, 2)
  similarity_score    Decimal?  @db.Decimal(10, 2)
  verification_result String?   @db.VarChar(50)
  created_at          DateTime? @default(now()) @db.Timestamp(6)
  sample_type         String?   @db.VarChar(50)
  admins              admins    @relation(fields: [admin_id], references: [id], onDelete: Cascade, onUpdate: NoAction, map: "fk_behavior_sample_admin")
}

model devices {
  id                 Int       @id @default(autoincrement())
  admin_id           Int
  device_fingerprint String    @db.VarChar(255)
  device_name        String?   @db.VarChar(255)
  trust_score        Int?      @default(50)
  status             String?   @default("ACTIVE") @db.VarChar(20)
  registration_token_hash   String?   @db.VarChar(255)
  token_expires_at          DateTime? @db.Timestamp(6)
  first_seen         DateTime? @default(now()) @db.Timestamp(6)
  last_seen          DateTime? @default(now()) @db.Timestamp(6)
  created_at         DateTime? @default(now()) @db.Timestamp(6)
  admins             admins    @relation(fields: [admin_id], references: [id], onDelete: Cascade, onUpdate: NoAction, map: "fk_admin")

  @@index([admin_id], map: "idx_devices_admin")
  @@index([device_fingerprint], map: "idx_devices_fingerprint")
  @@unique([admin_id, device_fingerprint], map: "devices_admin_device_fingerprint_key")
}

model risk_events {
  id                 Int       @id @default(autoincrement())
  admin_id           Int?
  identity_score     Decimal?  @db.Decimal(5, 2)
  device_score       Decimal?  @db.Decimal(5, 2)
  behavior_score     Decimal?  @db.Decimal(5, 2)
  overall_risk_score Decimal?  @db.Decimal(5, 2)
  decision           String?   @db.VarChar(20)
  created_at         DateTime? @default(now()) @db.Timestamp(6)
  admins             admins?   @relation(fields: [admin_id], references: [id], onDelete: NoAction, onUpdate: NoAction)
}

model security_alerts {
  id          Int       @id @default(autoincrement())
  admin_id    Int?
  alert_layer String?   @db.VarChar(50)
  severity    String?   @db.VarChar(20)
  alert_type  String?   @db.VarChar(100)
  description String?
  ip_address  String?
  created_at  DateTime? @default(now()) @db.Timestamp(6)
}

model edit_requests {
  id                    Int       @id @default(autoincrement())
  requested_by_admin_id Int
  approved_by_admin_id  Int?
  module                String    @db.VarChar(50)
  action                String    @db.VarChar(20)
  target_identifier     String    @db.VarChar(100)
  reason                String    @db.Text
  status                String    @default("PENDING") @db.VarChar(20)
  approval_token String? @unique @db.VarChar(255)
  requested_at          DateTime  @default(now())
  approved_at           DateTime?
  expires_at            DateTime?
  requester             admins @relation("EditRequestRequester", fields: [requested_by_admin_id], references: [id])
  approver              admins? @relation("EditRequestApprover", fields: [approved_by_admin_id], references: [id])
}

model temporary_permissions {
  id         Int      @id @default(autoincrement())
  admin_id   Int
  module     String   @db.VarChar(50)
  target_identifier String @db.VarChar(100)
  approved_by Int
  expires_at DateTime
  created_at DateTime @default(now())
  admin admins @relation(fields: [admin_id], references: [id])
  @@unique([admin_id, module, target_identifier])
}
```

------------------------------------------------------------------------

# 3. Schema Structure

The schema above defines the Prisma configuration, datasource
configuration, generators, models, fields, mappings, indexes,
constraints, and relationships exactly as present in the source.

The following sections document each declared component without
introducing fields or relationships that are not present in the provided
schema.

------------------------------------------------------------------------

# 4. Generator Configuration

The Prisma generator configuration is taken directly from the supplied
schema.

Its responsibility is to generate the Prisma Client used by the CMADS
application layer.

The generated-client architecture is:

``` text
cmads.schema(3).prisma
        ↓
Prisma Generator
        ↓
Generated Prisma Client
        ↓
CMADS Application
```

------------------------------------------------------------------------

# 5. Datasource Configuration

The datasource configuration is taken directly from the supplied schema.

It defines the database provider and the environment variable used to
establish the database connection.

The database flow is:

``` text
CMADS Application
        ↓
Environment-based Database URL
        ↓
Configured Database
```

------------------------------------------------------------------------

# 6. Models

The schema's declared Prisma models are documented individually below.

# 7. admins Model

The schema declares:

``` prisma
model admins
```

The model definition is:

``` prisma
model admins {
id                Int                 @id(map: "users_pkey") @default(autoincrement())
  full_name         String              @db.VarChar(100)
  email             String              @unique(map: "users_email_key") @db.VarChar(150)
  password_hash     String
  created_at        DateTime?           @default(now()) @db.Timestamp(6)
  role              String              @default("WORKER") @db.VarChar(50)
  phone_number      String?             @db.VarChar(20)
  parent_admin_id   Int?
  status            String?             @default("ACTIVE") @db.VarChar(30)
  behavior_profiles behavior_profiles[]
  behavior_samples  behavior_samples[]
  devices           devices[]
  risk_events       risk_events[]
  preferences admin_preferences?
  edit_requests_requested edit_requests[] @relation("EditRequestRequester")
  edit_requests_approved edit_requests[] @relation("EditRequestApprover")
  temporary_permissions temporary_permissions[]
}
```

# 8. admin_preferences Model

The schema declares:

``` prisma
model admin_preferences
```

The model definition is:

``` prisma
model admin_preferences {
id                  Int      @id @default(autoincrement())
  admin_id            Int      @unique
  language            String   @default("English") @db.VarChar(30)
  theme               String   @default("Light") @db.VarChar(30)
  date_format         String   @default("DD MMM YYYY") @db.VarChar(30)
  time_format         String   @default("12 Hour") @db.VarChar(30)
  default_dashboard   String   @default("Overview") @db.VarChar(50)
  created_at          DateTime @default(now()) @db.Timestamp(6)
  updated_at          DateTime @updatedAt @db.Timestamp(6)
  admin admins @relation(fields: [admin_id], references: [id], onDelete: Cascade)
}
```

# 9. audit_logs Model

The schema declares:

``` prisma
model audit_logs
```

The model definition is:

``` prisma
model audit_logs {
id                Int       @id @default(autoincrement())
  admin_id          Int?
  event_type        String    @db.VarChar(100)
  event_description String?
  ip_address        String?   @db.VarChar(100)
  created_at        DateTime? @default(now()) @db.Timestamp(6)
}
```

# 10. behavior_profiles Model

The schema declares:

``` prisma
model behavior_profiles
```

The model definition is:

``` prisma
model behavior_profiles {
id                  Int       @id @default(autoincrement())
  admin_id            Int
  enrollment_phrase   String    @db.VarChar(255)
  avg_dwell_time      Decimal?  @db.Decimal(10, 2)
  avg_flight_time     Decimal?  @db.Decimal(10, 2)
  avg_typing_speed    Decimal?  @db.Decimal(10, 2)
  avg_backspace_usage Decimal?  @db.Decimal(10, 2)
  avg_error_rate      Decimal?  @db.Decimal(10, 2)
  created_at          DateTime? @default(now()) @db.Timestamp(6)
  admins              admins    @relation(fields: [admin_id], references: [id], onDelete: Cascade, onUpdate: NoAction, map: "fk_behavior_admin")
}
```

# 11. behavior_samples Model

The schema declares:

``` prisma
model behavior_samples
```

The model definition is:

``` prisma
model behavior_samples {
id                  Int       @id @default(autoincrement())
  admin_id            Int
  dwell_time          Decimal?  @db.Decimal(10, 2)
  flight_time         Decimal?  @db.Decimal(10, 2)
  typing_speed        Decimal?  @db.Decimal(10, 2)
  backspace_usage     Decimal?  @db.Decimal(10, 2)
  error_rate          Decimal?  @db.Decimal(10, 2)
  similarity_score    Decimal?  @db.Decimal(10, 2)
  verification_result String?   @db.VarChar(50)
  created_at          DateTime? @default(now()) @db.Timestamp(6)
  sample_type         String?   @db.VarChar(50)
  admins              admins    @relation(fields: [admin_id], references: [id], onDelete: Cascade, onUpdate: NoAction, map: "fk_behavior_sample_admin")
}
```

# 12. devices Model

The schema declares:

``` prisma
model devices
```

The model definition is:

``` prisma
model devices {
id                 Int       @id @default(autoincrement())
  admin_id           Int
  device_fingerprint String    @db.VarChar(255)
  device_name        String?   @db.VarChar(255)
  trust_score        Int?      @default(50)
  status             String?   @default("ACTIVE") @db.VarChar(20)
  registration_token_hash   String?   @db.VarChar(255)
  token_expires_at          DateTime? @db.Timestamp(6)
  first_seen         DateTime? @default(now()) @db.Timestamp(6)
  last_seen          DateTime? @default(now()) @db.Timestamp(6)
  created_at         DateTime? @default(now()) @db.Timestamp(6)
  admins             admins    @relation(fields: [admin_id], references: [id], onDelete: Cascade, onUpdate: NoAction, map: "fk_admin")

  @@index([admin_id], map: "idx_devices_admin")
  @@index([device_fingerprint], map: "idx_devices_fingerprint")
  @@unique([admin_id, device_fingerprint], map: "devices_admin_device_fingerprint_key")
}
```

# 13. risk_events Model

The schema declares:

``` prisma
model risk_events
```

The model definition is:

``` prisma
model risk_events {
id                 Int       @id @default(autoincrement())
  admin_id           Int?
  identity_score     Decimal?  @db.Decimal(5, 2)
  device_score       Decimal?  @db.Decimal(5, 2)
  behavior_score     Decimal?  @db.Decimal(5, 2)
  overall_risk_score Decimal?  @db.Decimal(5, 2)
  decision           String?   @db.VarChar(20)
  created_at         DateTime? @default(now()) @db.Timestamp(6)
  admins             admins?   @relation(fields: [admin_id], references: [id], onDelete: NoAction, onUpdate: NoAction)
}
```

# 14. security_alerts Model

The schema declares:

``` prisma
model security_alerts
```

The model definition is:

``` prisma
model security_alerts {
id          Int       @id @default(autoincrement())
  admin_id    Int?
  alert_layer String?   @db.VarChar(50)
  severity    String?   @db.VarChar(20)
  alert_type  String?   @db.VarChar(100)
  description String?
  ip_address  String?
  created_at  DateTime? @default(now()) @db.Timestamp(6)
}
```

# 15. edit_requests Model

The schema declares:

``` prisma
model edit_requests
```

The model definition is:

``` prisma
model edit_requests {
id                    Int       @id @default(autoincrement())
  requested_by_admin_id Int
  approved_by_admin_id  Int?
  module                String    @db.VarChar(50)
  action                String    @db.VarChar(20)
  target_identifier     String    @db.VarChar(100)
  reason                String    @db.Text
  status                String    @default("PENDING") @db.VarChar(20)
  approval_token String? @unique @db.VarChar(255)
  requested_at          DateTime  @default(now())
  approved_at           DateTime?
  expires_at            DateTime?
  requester             admins @relation("EditRequestRequester", fields: [requested_by_admin_id], references: [id])
  approver              admins? @relation("EditRequestApprover", fields: [approved_by_admin_id], references: [id])
}
```

# 16. temporary_permissions Model

The schema declares:

``` prisma
model temporary_permissions
```

The model definition is:

``` prisma
model temporary_permissions {
id         Int      @id @default(autoincrement())
  admin_id   Int
  module     String   @db.VarChar(50)
  target_identifier String @db.VarChar(100)
  approved_by Int
  expires_at DateTime
  created_at DateTime @default(now())
  admin admins @relation(fields: [admin_id], references: [id])
  @@unique([admin_id, module, target_identifier])
}
```

# Model-Level Documentation

Each model above should be interpreted according to the exact Prisma
declarations in the source.

For every declared field, the following aspects are significant:

``` text
Field name
Prisma scalar type
Optionality / required status
Default value
Database-specific type mapping
Primary-key status
Unique constraints
Indexes
Relations
Table mapping
```

These properties are determined by the supplied schema rather than by
application assumptions.

------------------------------------------------------------------------

# Database Mapping

Where the schema defines:

``` prisma
@@map(...)
```

the Prisma model name maps to the specified PostgreSQL table name.

Where the schema defines field-level:

``` prisma
@map(...)
```

the Prisma field maps to the specified database column name.

------------------------------------------------------------------------

# Indexing and Constraints

Any declarations such as:

``` text
@id
@unique
@@unique
@@index
@default
@updatedAt
@relation
```

are part of the database behavior represented by the Prisma schema.

They should be preserved when generating or migrating the corresponding
database structure.

------------------------------------------------------------------------

# Relationship Architecture

If the supplied schema declares Prisma relations, those relations define
application-level associations between the corresponding models.

If no explicit relation is declared for a scalar identifier, the scalar
field should not be documented as a Prisma foreign-key relation merely
from its name.

------------------------------------------------------------------------

# Data-Type Architecture

The schema's scalar types determine how CMADS data is represented
through Prisma.

The relevant type categories are those explicitly present in the
supplied source, such as:

``` text
String
Int
BigInt
Boolean
DateTime
Decimal
Float
```

Only types actually declared by the supplied schema should be treated as
part of the CMADS data model.

------------------------------------------------------------------------

# Complete Schema Flow

The supplied schema can be represented conceptually as:

``` text
CMADS Application
        ↓
Generated Prisma Client
        ↓
Configured Database
        ↓
Declared CMADS Models
        ↓
Fields / Constraints / Indexes / Relations
        ↓
Persistent CMADS Data
```

------------------------------------------------------------------------

# Important Implementation Detail

This documentation is based strictly on:

``` text
cmads.schema(3).prisma
```

No external schema definitions, undocumented business rules, additional
models, or inferred relationships have been added.

Where the Prisma source does not define a behavior, this documentation
does not treat that behavior as implemented by the schema.

------------------------------------------------------------------------

# Summary

`cmads.schema(3).prisma` defines the Prisma representation of the CMADS
database layer.

The authoritative structure is the set of:

``` text
Prisma generator configuration
Datasource configuration
Declared models
Declared fields
Data types
Defaults
Mappings
Indexes
Constraints
Relations
```

contained in the supplied schema.

The Prisma schema establishes the database contract used by the CMADS
application while application-level business logic remains outside the
schema itself.
