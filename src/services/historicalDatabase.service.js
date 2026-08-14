const repository =
  require(
    "../repositories/historicalDatabase.repository"
  );

// =====================================================
// ARCHIVE DATE
// =====================================================

async function archiveDate(
  processingDate = new Date()
) {

  const date =
    processingDate instanceof Date
      ? processingDate
      : new Date(processingDate);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    throw new Error(
      "Invalid processing date"
    );
  }

  const year =
    date.getFullYear();

  const month =
    date.getMonth() + 1;

  // ===================================================
  // STEP 1
  // GET DAY TABLE
  // ===================================================

  const dayResult =
    await repository.getVehiclesFromDayTable(
      date
    );

  if (!dayResult.exists) {
    return {

      archived: false,

      reason:
        "DAY_TABLE_NOT_FOUND",

      dayTable:
        dayResult.dayTable,

    };
  }

  // ===================================================
  // STEP 2
  // NO VEHICLES
  // ===================================================

  if (
    dayResult.vehicles.length === 0
  ) {
    return {

      archived: false,

      reason:
        "NO_VEHICLES",

      dayTable:
        dayResult.dayTable,

    };
  }

  // ===================================================
  // RESULTS
  // ===================================================

  const vehicleResults = [];

  let totalRecords = 0;

  // ===================================================
  // STEP 3
  // PROCESS EACH VEHICLE
  // ===================================================

  for (
    const vehicle
    of dayResult.vehicles
  ) {

    const vehicleNumber =
      vehicle.vehicle_number;

    const vehicleTableName =
      vehicle.vehicle_table_name;

    const wardNo =
      Number(vehicle.ward_no);

    // -------------------------------------------------
    // VALIDATE WARD
    // -------------------------------------------------

    if (
      !Number.isInteger(wardNo)
    ) {

      vehicleResults.push({

        vehicleNumber,

        vehicleTableName,

        archived: false,

        reason:
          "INVALID_WARD_NO",

      });

      continue;
    }

    // -------------------------------------------------
    // HISTORICAL TABLE NAMES
    // -------------------------------------------------

    const yearTableName =
      repository.getYearTableName(
        wardNo,
        year
      );

    const monthTableName =
      repository.getMonthTableName(
        wardNo,
        month,
        year
      );

    // -------------------------------------------------
    // CREATE YEAR TABLE
    // -------------------------------------------------

    await repository.createYearTable(
      yearTableName
    );

    // -------------------------------------------------
    // CREATE MONTH TABLE
    // -------------------------------------------------

    await repository.createMonthTable(
      monthTableName
    );

    // -------------------------------------------------
    // REGISTER MONTH
    // -------------------------------------------------

    await repository.registerMonthInYear(
      yearTableName,
      month,
      year,
      monthTableName
    );

    // -------------------------------------------------
    // GET TELEMETRY
    // -------------------------------------------------

    const telemetry =
      await repository.getVehicleTelemetry(
        vehicleTableName
      );

    let inserted =
      0;

    let duplicates =
      0;

    // -------------------------------------------------
    // INSERT RECORDS
    // -------------------------------------------------

    for (
      const record
      of telemetry
    ) {

      const result =
        await repository.insertHistoricalRecord(
          monthTableName,
          {

            sourceTelemetryId:
              Number(record.id),

            sourceVehicleTable:
              vehicleTableName,

            vehicleNumber:
              record.vehicleNumber ||
              vehicleNumber,

            wardNo,

            iotTimestamp:
              record.iotTimestamp,

            receivedTimestamp:
              record.receivedTimestamp,

            rfidEpc:
              record.rfidEpc,

            citizenId:
              record.citizenId,

            wasteType:
              record.wasteType,

            latitude:
              record.latitude,

            longitude:
              record.longitude,

            wetWeight:
              record.wetWeight,

            dryWeight:
              record.dryWeight,

            otherWeight:
              record.otherWeight,

            cumulativeWeight:
              record.cumulativeWeight,

            driverName:
              record.driverName,

            firmwareVersion:
              record.firmwareVersion,

            unitNumber:
              record.unitNumber,

            collectionType:
              record.collectionType,

            remarks:
              record.remarks,

            errorCode:
              record.errorCode,

            citizenContact:
              record.citizenContact,

            driverAction:
              record.driverAction,

          }
        );

      if (
        result.inserted
      ) {
        inserted++;
      } else {
        duplicates++;
      }

    }

    // -------------------------------------------------
    // VEHICLE RESULT
    // -------------------------------------------------

    totalRecords += inserted;

    vehicleResults.push({

      vehicleNumber,

      wardNo,

      sourceTable:
        vehicleTableName,

      yearTable:
        yearTableName,

      monthTable:
        monthTableName,

      sourceRecords:
        telemetry.length,

      inserted,

      duplicates,

      archived:
        true,

    });

  }

  // ===================================================
  // FINAL RESULT
  // ===================================================

  return {

    archived: true,

    processingDate:
      date.toISOString(),

    dayTable:
      dayResult.dayTable,

    year,

    month,

    vehicles:
      vehicleResults.length,

    totalRecords,

    vehicleResults,

  };
}

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  archiveDate,
};