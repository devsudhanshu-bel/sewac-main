const citizenHistoricalRepository =
  require("../repositories/citizenHistorical.repository");

const telemetryDailyRepository =
  require("../repositories/telemetryDaily.repository");

const telemetryResolver =
  require(
    "./citizenHistoricalTelemetryResolver.service"
  );


// =====================================================
// CITIZEN HISTORICAL PROCESSOR
// =====================================================
//
// FLOW:
//
// DAY TABLE
//      ↓
// VEHICLE TABLE
//      ↓
// TELEMETRY
//      ↓
// GPS RESOLVER
//      ↓
// CITY
//      ↓
// ZONE
//      ↓
// DIVISION
//      ↓
// WARD
//      ↓
// MONTHLY TELEMETRY TABLE
//      ↓
// YEARLY MONTH INDEX
//
// =====================================================
//
// MONTHLY TABLE
//     = ACTUAL DATA
//
// YEARLY TABLE
//     = INDEX ONLY
//
// =====================================================


class CitizenHistoricalProcessor {


  // ===================================================
  // PROCESS ONE TELEMETRY RECORD
  // ===================================================

  async processRecord(
    record
  ) {

    console.log(
      "Processing telemetry:",
      record.id
    );


    // =================================================
    // STEP 1
    // RESOLVE GPS → HIERARCHY
    // =================================================

    const resolved =
      await telemetryResolver
        .resolveTelemetryRecord(
          record
        );


    if (
      !resolved.matched
    ) {

      console.log(
        "GPS resolution failed:",
        resolved.reason
      );


      return {

        processed: false,

        reason:
          resolved.reason,

        telemetryId:
          record.id,

      };
    }


    // =================================================
    // STEP 2
    // GET LOCATION
    // =================================================

    const location =
      resolved.location;


    if (
      !location
    ) {

      return {

        processed: false,

        reason:
          "LOCATION_NOT_FOUND",

        telemetryId:
          record.id,

      };
    }


    const city =
      location.city;

    const zone =
      location.zone;

    const division =
      location.division;

    const ward =
      location.ward;


    // =================================================
    // STEP 3
    // VALIDATE WARD
    // =================================================

    if (
      !ward ||
      ward.wardNo === undefined ||
      ward.wardNo === null
    ) {

      return {

        processed: false,

        reason:
          "WARD_NOT_FOUND",

        telemetryId:
          record.id,

        city,

        zone,

        division,

      };
    }


    // =================================================
    // STEP 4
    // TELEMETRY DATE
    // =================================================

    const recordDate =
      record.iotTimestamp
        ? new Date(
            record.iotTimestamp
          )
        : new Date();


    if (
      Number.isNaN(
        recordDate.getTime()
      )
    ) {

      throw new Error(
        `Invalid telemetry timestamp: ${record.iotTimestamp}`
      );
    }


    console.log(
      "Processing date:",
      recordDate
    );


    // =================================================
    // STEP 5
    // GET YEARLY INDEX TABLE
    // =================================================

    const yearlyTable =
      citizenHistoricalRepository
        .getYearlyTableName(
          ward.wardNo,
          recordDate
        );


    // =================================================
    // STEP 6
    // GET MONTHLY TELEMETRY TABLE
    // =================================================

    const monthlyTable =
      citizenHistoricalRepository
        .getMonthlyTableName(
          ward.wardNo,
          recordDate
        );


    console.log(
      "Yearly Table:",
      yearlyTable
    );


    console.log(
      "Monthly Table:",
      monthlyTable
    );


    // =================================================
    // STEP 7
    // CHECK YEARLY TABLE
    // =================================================

    const yearlyExists =
      await citizenHistoricalRepository
        .tableExists(
          yearlyTable
        );


    if (
      !yearlyExists
    ) {

      throw new Error(
        `Historical yearly table does not exist: ${yearlyTable}`
      );
    }


    // =================================================
    // STEP 8
    // CHECK MONTHLY TABLE
    // =================================================

    const monthlyExists =
      await citizenHistoricalRepository
        .tableExists(
          monthlyTable
        );


    if (
      !monthlyExists
    ) {

      throw new Error(
        `Historical monthly table does not exist: ${monthlyTable}`
      );
    }


    // =================================================
    // STEP 9
    // PREPARE HISTORICAL RECORD
    // =================================================

    const historicalRecord = {

      // -----------------------------------------------
      // TELEMETRY
      // -----------------------------------------------

      telemetryId:
        record.id,

      iotTimestamp:
        record.iotTimestamp,

      receivedTimestamp:
        record.receivedTimestamp,


      // -----------------------------------------------
      // VEHICLE
      // -----------------------------------------------

      vehicleNumber:
        record.vehicleNumber,

      driverName:
        record.driverName,

      unitNumber:
        record.unitNumber,

      firmwareVersion:
        record.firmwareVersion,


      // -----------------------------------------------
      // GPS
      // -----------------------------------------------

      latitude:
        record.latitude,

      longitude:
        record.longitude,


      // -----------------------------------------------
      // HIERARCHY
      // -----------------------------------------------

      cityId:
        city?.cityId ??
        null,

      zoneId:
        zone?.zoneId ??
        null,

      divisionId:
        division?.divisionId ??
        null,

      wardId:
        ward?.wardId ??
        null,

      wardNo:
        ward?.wardNo ??
        null,


      // -----------------------------------------------
      // CITIZEN
      // -----------------------------------------------

      citizenId:
        record.citizenId,

      rfidEpc:
        record.rfidEpc,

      citizenContact:
        record.citizenContact,


      // -----------------------------------------------
      // WASTE
      // -----------------------------------------------

      wasteType:
        record.wasteType,

      collectionType:
        record.collectionType,

      wetWeight:
        record.wetWeight,

      dryWeight:
        record.dryWeight,

      otherWeight:
        record.otherWeight,

      cumulativeWeight:
        record.cumulativeWeight,


      // -----------------------------------------------
      // OTHER
      // -----------------------------------------------

      remarks:
        record.remarks,

      errorCode:
        record.errorCode,

      driverAction:
        record.driverAction,

    };


    console.log(
      "Historical Record Prepared"
    );


    // =================================================
    // STEP 10
    // INSERT INTO MONTHLY TELEMETRY TABLE
    // =================================================

    console.log(
      "Inserting into monthly historical table..."
    );


    const monthlyResult =
      await citizenHistoricalRepository
        .insertHistoricalRecord(
          monthlyTable,
          historicalRecord
        );


    // =================================================
    // HANDLE INSERT RESULT
    // =================================================

    if (
      monthlyResult.inserted
    ) {

      console.log(
        "Monthly historical record inserted."
      );

    } else if (
      monthlyResult.duplicate
    ) {

      console.log(
        "Monthly historical record already exists."
      );

      console.log(
        "Skipping duplicate telemetry:",
        record.id
      );

    }


    // =================================================
    // STEP 11
    // UPDATE YEARLY INDEX
    // =================================================
    //
    // VERY IMPORTANT:
    //
    // We DO NOT insert telemetry into the yearly table.
    //
    // We only update its monthly index.
    //
    // =================================================

    console.log(
      "Updating yearly month index..."
    );


    const yearlyIndex =
      await citizenHistoricalRepository
        .updateYearlyMonthIndex(
          yearlyTable,
          monthlyTable,
          recordDate
        );


    console.log(
      "Yearly month index updated."
    );


    // =================================================
    // STEP 12
    // ENSURE MONTHLY INDEXES
    // =================================================

    await citizenHistoricalRepository
      .ensureMonthlyIndexes(
        monthlyTable
      );


    // =================================================
    // STEP 13
    // RETURN SUCCESS
    // =================================================

    return {

      processed: true,

      duplicate:
        monthlyResult.duplicate,

      telemetryId:
        record.id,

      city,

      zone,

      division,

      ward,

      yearlyTable,

      monthlyTable,

      monthlyRecord:
        monthlyResult.record,

      yearlyIndex,

    };
  }


  // ===================================================
  // PROCESS FIRST RECORD OF FIRST VEHICLE
  // ===================================================

  async processFirstRecord(
    date
  ) {

    // =================================================
    // STEP 1
    // DAY TABLE
    // =================================================

    const dayTable =
      telemetryDailyRepository
        .getDayTableName(
          date
        );


    console.log(
      "Day Table:",
      dayTable
    );


    // =================================================
    // STEP 2
    // CHECK DAY TABLE
    // =================================================

    const dayExists =
      await telemetryDailyRepository
        .dayTableExists(
          dayTable
        );


    if (
      !dayExists
    ) {

      return {

        processed: false,

        reason:
          "DAY_TABLE_NOT_FOUND",

        dayTable,

      };
    }


    // =================================================
    // STEP 3
    // GET VEHICLES
    // =================================================

    const vehicles =
      await telemetryDailyRepository
        .getVehiclesFromDayTable(
          dayTable
        );


    if (
      !vehicles.length
    ) {

      return {

        processed: false,

        reason:
          "NO_VEHICLES",

        dayTable,

      };
    }


    console.log(
      `Vehicles found: ${vehicles.length}`
    );


    // =================================================
    // STEP 4
    // FIRST VEHICLE
    // =================================================

    const vehicle =
      vehicles[0];


    const vehicleTableName =
      vehicle.vehicleTableName ||
      vehicle.vehicle_table_name;


    console.log(
      "Vehicle:",
      vehicle.vehicleNumber ||
      vehicle.vehicle_number
    );


    console.log(
      "Vehicle Table:",
      vehicleTableName
    );


    if (
      !vehicleTableName
    ) {

      return {

        processed: false,

        reason:
          "VEHICLE_TABLE_NOT_FOUND",

        dayTable,

        vehicle,

      };
    }


    // =================================================
    // STEP 5
    // GET FIRST TELEMETRY
    // =================================================

    const records =
      await telemetryDailyRepository
        .getVehicleTelemetry(
          vehicleTableName,
          0,
          1
        );


    if (
      !records.length
    ) {

      return {

        processed: false,

        reason:
          "NO_TELEMETRY_RECORDS",

        dayTable,

        vehicle,

      };
    }


    console.log(
      `Telemetry records found: ${records.length}`
    );


    // =================================================
    // STEP 6
    // PROCESS TELEMETRY
    // =================================================

    return await this.processRecord(
      records[0]
    );
  }

}


// =====================================================
// EXPORT
// =====================================================

module.exports =
  new CitizenHistoricalProcessor();