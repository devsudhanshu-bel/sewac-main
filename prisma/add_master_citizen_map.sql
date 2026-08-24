-- =====================================================
-- MASTER CITIZEN PHONE → WARD MAPPING
-- =====================================================

CREATE TABLE IF NOT EXISTS "master_citizen_map" (
    id SERIAL PRIMARY KEY,

    phone_number VARCHAR(20) NOT NULL UNIQUE,

    ward_id INTEGER NOT NULL,

    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =====================================================
-- INDEX
-- =====================================================

CREATE INDEX IF NOT EXISTS
"master_citizen_map_ward_id_idx"
ON "master_citizen_map" ("ward_id");


-- =====================================================
-- MASTER CITIZEN PHONE → WARD BACKUP
-- =====================================================

CREATE TABLE IF NOT EXISTS "master_citizen_map_backup" (
    id SERIAL PRIMARY KEY,

    phone_number VARCHAR(20) NOT NULL,

    ward_id INTEGER NOT NULL,

    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =====================================================
-- BACKUP INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS
"master_citizen_map_backup_phone_number_idx"
ON "master_citizen_map_backup" ("phone_number");


CREATE INDEX IF NOT EXISTS
"master_citizen_map_backup_ward_id_idx"
ON "master_citizen_map_backup" ("ward_id");