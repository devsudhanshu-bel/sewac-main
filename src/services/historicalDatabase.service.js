const telemetryDailyRepository =
  require("../repositories/telemetryDaily.repository");

const historicalRepository =
  require("../repositories/citizenHistoricalTable.repository");

// =====================================================
// HISTORICAL ARCHIVE SERVICE
// =====================================================

class HistoricalArchiveService {

  // ===================================================
  // ARCHIVE ONE DATE
  // ===================================================

  async archiveDate(
    processingDate
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

    // -----------------------------------------------
    // DATE VALUES
    // -----------------------------------------------

    const year =
      date.getFullYear();

    const month =
      date.getMonth() + 1;

    const monthName =
      historicalRepository.MONTH_NAMES[
        month - 1
      ];

    const dayTableName =
      telemetryDailyRepository.getDayTableName(
        date
      );

    // -----------------------------------------------
    // GET DAY TABLE VEHICLES
    // -----------------------------------------------

    const vehicles =
      await telemetryDailyRepository
        .getVehiclesFromDayTable(
          date
        );

    if (!vehicles.length) {

      return {

        success: true,

        sourceDatabase:
          "master_telemetry_db",

        sourceDayTable:
          dayTableName,

        year,

        month,

        monthName,

        archivedVehicles: 0,

        archivedRecords: 0,

        duplicateRecords: 0,

        vehicles: [],

      };

    }

    let archivedVehicles = 0;

    let archivedRecords = 0;

    let duplicateRecords = 0;

    const vehicleResults = [];

    // -----------------------------------------------
    // PROCESS EVERY VEHICLE
    // -----------------------------------------------

    for (
      const vehicle
      of vehicles
    ) {

      const vehicleNumber =
        vehicle.vehicle_number;

      const vehicleTableName =
        vehicle.vehicle_table_name;

      const wardNo =
        Number(
          vehicle.ward_no
        );

      if (
        !vehicleTableName
      ) {

        vehicleResults.push({

          vehicleNumber,

          vehicleTableName: null,

          wardNo,

          archived: false,

          reason:
            "VEHICLE_TABLE_NAME_MISSING",

        });

        continue;

      }

      if (
        !Number.isInteger(wardNo) ||
        wardNo <= 0
      ) {

        vehicleResults.push({

          vehicleNumber,

          vehicleTableName,

          wardNo,

          archived: false,

          reason:
            "WARD_NO_MISSING_OR_INVALID",

        });

        continue;

      }

      // ---------------------------------------------
      // HISTORICAL TABLE NAMES
      // ---------------------------------------------

      const yearlyTableName =
        historicalRepository
          .generateYearlyIndexTableName(
            wardNo,
            year
          );

      const monthlyTableName =
        historicalRepository
          .generateMonthlyTableName(
            wardNo,
            month,
            year
          );

      // ---------------------------------------------
      // ENSURE YEARLY TABLE
      // ---------------------------------------------

      const yearlyExists =
        await historicalRepository
          .tableExists(
            yearlyTableName
          );

      if (!yearlyExists) {

        await historicalRepository
          .createYearlyIndexTable(
            yearlyTableName
          );

      }

      // ---------------------------------------------
      // ENSURE MONTHLY TABLE
      // ---------------------------------------------

      const monthlyExists =
        await historicalRepository
          .tableExists(
            monthlyTableName
          );

      if (!monthlyExists) {

        await historicalRepository
          .createMonthlyHistoryTable(
            monthlyTableName
          );

      }

      // ---------------------------------------------
      // REGISTER MONTH
      // ---------------------------------------------

      await historicalRepository
        .registerMonthlyTable(
          yearlyTableName,
          month,
          monthName,
          monthlyTableName
        );

      // ---------------------------------------------
      // READ VEHICLE RECORDS
      // ---------------------------------------------

      let lastId = 0;

      let sourceRecords = 0;

      let inserted = 0;

      let duplicates = 0;

      while (true) {

        const records =
          await telemetryDailyRepository
            .getVehicleTelemetryAfterId(
              vehicleTableName,
              lastId,
              500
            );

        if (!records.length) {
          break;
        }

        sourceRecords +=
          records.length;

        // -------------------------------------------
        // INSERT EACH RECORD
        // -------------------------------------------

        for (
          const record
          of records
        ) {

          const result =
            await historicalRepository
              .insertHistoricalRecord(
                monthlyTableName,
                {
                  record,

                  wardNo,

                  vehicleTableName,

                  sourceDayTable:
                    dayTableName,
                }
              );

          if (result.inserted) {
            inserted++;
          } else {
            duplicates++;
          }

          // IMPORTANT:
          // Always advance using source ID.
          lastId =
            Number(record.id);
        }

        // -------------------------------------------
        // SAFETY
        // -------------------------------------------

        if (
          records.length < 500
        ) {
          break;
        }
      }

      archivedVehicles++;

      archivedRecords +=
        inserted;

      duplicateRecords +=
        duplicates;

      vehicleResults.push({

        vehicleNumber,

        vehicleTableName,

        wardNo,

        sourceDatabase:
          "master_telemetry_db",

        sourceDayTable:
          dayTableName,

        historicalYearTable:
          yearlyTableName,

        historicalMonthTable:
          monthlyTableName,

        sourceRecords,

        inserted,

        duplicates,

        archived: true,

      });

    }

    // -----------------------------------------------
    // RESULT
    // -----------------------------------------------

    return {

      success: true,

      sourceDatabase:
        "master_telemetry_db",

      sourceDayTable:
        dayTableName,

      year,

      month,

      monthName,

      archivedVehicles,

      archivedRecords,

      duplicateRecords,

      vehicles:
        vehicleResults,

    };

  }

}


// =====================================================
// EXPORT
// =====================================================

module.exports =
  new HistoricalArchiveService();