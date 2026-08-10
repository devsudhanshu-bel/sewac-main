-- CreateTable
CREATE TABLE "city" (
    "city_id" SERIAL NOT NULL,
    "city_name" VARCHAR(100) NOT NULL,
    "geo_boundary" JSONB,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "city_pkey" PRIMARY KEY ("city_id")
);

-- CreateTable
CREATE TABLE "zones" (
    "zone_id" SERIAL NOT NULL,
    "zone_name" VARCHAR(150) NOT NULL,
    "city_id" INTEGER NOT NULL,
    "total_divisions" INTEGER NOT NULL DEFAULT 0,
    "total_wards" INTEGER NOT NULL DEFAULT 0,
    "geo_boundary" JSONB,
    "zone_table_name" VARCHAR(150) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "zones_pkey" PRIMARY KEY ("zone_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "zones_zone_table_name_key" ON "zones"("zone_table_name");

-- CreateIndex
CREATE INDEX "idx_master_zone_city" ON "zones"("city_id");

-- CreateIndex
CREATE INDEX "idx_master_zone_name" ON "zones"("zone_name");

-- AddForeignKey
ALTER TABLE "zones" ADD CONSTRAINT "zones_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "city"("city_id") ON DELETE CASCADE ON UPDATE CASCADE;
