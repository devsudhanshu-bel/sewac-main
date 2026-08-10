require("./config/loadEnv");

const telemetryDailyRepository =
  require("./repositories/telemetryDaily.repository");

const telemetryResolver =
  require(
    "./services/citizenHistoricalTelemetryResolver.service"
  );


// =====================================================
// TEST CONFIGURATION
// =====================================================

const TEST_DATE =
  new Date(
    2026,
    7,
    9
  );


// =====================================================
// BIGINT SAFE JSON STRINGIFY
// =====================================================

function safeStringify(
  value
) {

  return JSON.stringify(
    value,
    (key, value) =>
      typeof value === "bigint"
        ? value.toString()
        : value,
    2
  );

}


// =====================================================
// MAIN TEST
// =====================================================

async function test() {

  try {

    console.log("");

    console.log(
      "================================================="
    );

    console.log(
      "CITIZEN HISTORICAL TELEMETRY RESOLVER TEST"
    );

    console.log(
      "================================================="
    );

    console.log("");


    // =================================================
    // STEP 1
    // =================================================

    const dayTableName =
      telemetryDailyRepository
        .getDayTableName(
          TEST_DATE
        );


    console.log(
      "Processing date:",
      TEST_DATE.toDateString()
    );

    console.log(
      "Day Table:",
      dayTableName
    );

    console.log("");


    // =================================================
    // STEP 2
    // =================================================

    const dayExists =
      await telemetryDailyRepository
        .dayTableExists(
          dayTableName
        );


    console.log(
      "Day Table Exists:",
      dayExists
    );

    console.log("");


    if (!dayExists) {

      console.log(
        "No telemetry found for this date."
      );

      return;

    }


    // =================================================
    // STEP 3
    // =================================================

    const vehicles =
      await telemetryDailyRepository
        .getVehiclesFromDayTable(
          dayTableName
        );


    console.log(
      `Vehicles Found: ${vehicles.length}`
    );

    console.log("");


    if (!vehicles.length) {

      console.log(
        "No vehicles registered in the day table."
      );

      return;

    }


    // =================================================
    // STEP 4
    // =================================================
    //
    // FIRST INTEGRATION TEST
    //
    // Process ONLY:
    //
    // - first vehicle
    // - first telemetry record
    //
    // No historical DB writes yet.
    //
    // =================================================

    const vehicle =
      vehicles[0];


    console.log(
      "---------------------------------------------"
    );

    console.log(
      "TEST VEHICLE"
    );

    console.log(
      "Vehicle Number:",
      vehicle.vehicleNumber
    );

    console.log(
      "Vehicle Table:",
      vehicle.vehicleTableName
    );

    console.log("");


    // =================================================
    // STEP 5
    // =================================================

    const vehicleExists =
      await telemetryDailyRepository
        .vehicleTableExists(
          vehicle.vehicleTableName
        );


    console.log(
      "Vehicle Table Exists:",
      vehicleExists
    );

    console.log("");


    if (!vehicleExists) {

      console.log(
        "Vehicle table does not exist."
      );

      return;

    }


    // =================================================
    // STEP 6
    // =================================================

    console.log(
      "Reading first telemetry record..."
    );

    console.log("");


    const result =
      await telemetryResolver
        .resolveFirstTelemetryRecord(
          vehicle.vehicleTableName
        );


    // =================================================
    // STEP 7
    // =================================================

    console.log(
      "RESULT:"
    );

    console.log("");


    console.log(
      safeStringify(
        result
      )
    );


    console.log("");


    // =================================================
    // STEP 8
    // =================================================

    if (
      result.matched
    ) {

      console.log(
        "================================================="
      );

      console.log(
        "GPS MATCH SUCCESS"
      );

      console.log(
        "================================================="
      );

      console.log("");

      console.log(
        "CITY:"
      );

      console.log(
        `  ${result.location.city.cityName}`
      );

      console.log("");

      console.log(
        "ZONE:"
      );

      console.log(
        `  ${result.location.zone.zoneName}`
      );

      console.log("");

      console.log(
        "DIVISION:"
      );

      console.log(
        `  ${result.location.division.divisionName}`
      );

      console.log("");

      console.log(
        "WARD:"
      );

      console.log(
        `  ${result.location.ward.wardNo} - ${result.location.ward.wardName}`
      );

      console.log("");

      console.log(
        "WARD TABLE:"
      );

      console.log(
        `  ${result.location.ward.wardTableName}`
      );

      console.log("");

      console.log(
        "================================================="
      );

    } else {

      console.log(
        "================================================="
      );

      console.log(
        "GPS MATCH FAILED"
      );

      console.log(
        "================================================="
      );

      console.log("");

      console.log(
        "Reason:",
        result.reason
      );

    }

  } catch (error) {

    console.error("");

    console.error(
      "================================================="
    );

    console.error(
      "CITIZEN HISTORICAL TELEMETRY RESOLVER FAILED"
    );

    console.error(
      "================================================="
    );

    console.error("");

    console.error(
      error
    );

  } finally {

    process.exit(0);

  }

}


// =====================================================
// RUN
// =====================================================

test();