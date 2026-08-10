/*
  Warnings:

  - You are about to drop the `city` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "city";

-- CreateTable
CREATE TABLE "citizen_history_sync_state" (
    "id" SERIAL NOT NULL,
    "lastProcessedDate" DATE,
    "lastProcessedVehicle" TEXT,
    "lastProcessedTelemetryId" BIGINT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "citizen_history_sync_state_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_daily_ward_tracking" (
    "id" BIGSERIAL NOT NULL,
    "trackingDate" DATE NOT NULL,
    "vehicleNumber" TEXT NOT NULL,
    "cityId" INTEGER,
    "zoneId" INTEGER,
    "divisionId" INTEGER,
    "wardId" INTEGER,
    "wardNo" INTEGER,
    "firstSeenAt" TIMESTAMP(3) NOT NULL,
    "lastSeenAt" TIMESTAMP(3) NOT NULL,
    "packetCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicle_daily_ward_tracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "citizen_history_processing_errors" (
    "id" BIGSERIAL NOT NULL,
    "telemetryId" BIGINT,
    "processingDate" DATE NOT NULL,
    "vehicleNumber" TEXT,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "rfidEpc" TEXT,
    "errorType" TEXT NOT NULL,
    "errorMessage" TEXT NOT NULL,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "citizen_history_processing_errors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "vehicle_daily_ward_tracking_trackingDate_idx" ON "vehicle_daily_ward_tracking"("trackingDate");

-- CreateIndex
CREATE INDEX "vehicle_daily_ward_tracking_vehicleNumber_idx" ON "vehicle_daily_ward_tracking"("vehicleNumber");

-- CreateIndex
CREATE INDEX "vehicle_daily_ward_tracking_trackingDate_vehicleNumber_idx" ON "vehicle_daily_ward_tracking"("trackingDate", "vehicleNumber");

-- CreateIndex
CREATE INDEX "vehicle_daily_ward_tracking_trackingDate_wardNo_idx" ON "vehicle_daily_ward_tracking"("trackingDate", "wardNo");

-- CreateIndex
CREATE INDEX "citizen_history_processing_errors_processingDate_idx" ON "citizen_history_processing_errors"("processingDate");

-- CreateIndex
CREATE INDEX "citizen_history_processing_errors_telemetryId_idx" ON "citizen_history_processing_errors"("telemetryId");

-- CreateIndex
CREATE INDEX "citizen_history_processing_errors_vehicleNumber_idx" ON "citizen_history_processing_errors"("vehicleNumber");

-- CreateIndex
CREATE INDEX "citizen_history_processing_errors_resolved_idx" ON "citizen_history_processing_errors"("resolved");
