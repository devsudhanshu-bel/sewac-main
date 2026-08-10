const repository =
  require(
    "./repositories/telemetryDaily.repository"
  );


// =====================================================
// TEST DATE
// =====================================================
//
// IMPORTANT:
//
// Change this to a date for which telemetry data
// actually exists.
//
// For today's test:
//
// 09 August 2026
//
// =====================================================

const TEST_DATE =
  new Date(
    2026,
    7,
    9
  );


// =====================================================
// MAIN
// =====================================================

async function test() {

  try {

    console.log("");

    console.log(
      "================================================="
    );

    console.log(
      "TELEMETRY DAILY REPOSITORY TEST"
    );

    console.log(
      "================================================="
    );

    console.log("");


    // =================================================
    // STEP 1
    // =================================================

    const dayTableName =
      repository.getDayTableName(
        TEST_DATE
      );


    console.log(
      "Processing date:",
      TEST_DATE.toDateString()
    );

    console.log(
      "Day table:",
      dayTableName
    );

    console.log("");


    // =================================================
    // STEP 2
    // =================================================

    const dayExists =
      await repository.dayTableExists(
        dayTableName
      );


    console.log(
      "Day table exists:",
      dayExists
    );

    console.log("");


    if (!dayExists) {

      console.log(
        "No telemetry day table found."
      );

      console.log(
        `Expected table: ${dayTableName}`
      );

      return;

    }


    // =================================================
    // STEP 3
    // =================================================

    const vehicles =
      await repository.getVehiclesFromDayTable(
        dayTableName
      );


    console.log(
      `Vehicles found: ${vehicles.length}`
    );

    console.log("");


    // =================================================
    // STEP 4
    // =================================================

    for (
      const vehicle of vehicles
    ) {

      console.log(
        "---------------------------------------------"
      );

      console.log(
        "VEHICLE"
      );

      console.log(
        "Vehicle Number:",
        vehicle.vehicleNumber
      );

      console.log(
        "Vehicle Table:",
        vehicle.vehicleTableName
      );

      console.log(
        "Created At:",
        vehicle.createdAt
      );


      // -----------------------------------------------
      // Check vehicle table
      // -----------------------------------------------

      const vehicleExists =
        await repository.vehicleTableExists(
          vehicle.vehicleTableName
        );


      console.log(
        "Vehicle table exists:",
        vehicleExists
      );


      if (!vehicleExists) {

        console.log(
          "WARNING: Vehicle table does not exist."
        );

        continue;

      }


      // -----------------------------------------------
      // Count telemetry
      // -----------------------------------------------

      const telemetryCount =
        await repository.getVehicleTelemetryCount(
          vehicle.vehicleTableName
        );


      console.log(
        "Telemetry records:",
        telemetryCount
      );


      // -----------------------------------------------
      // Read first batch
      // -----------------------------------------------

      const telemetry =
        await repository.getVehicleTelemetry(
          vehicle.vehicleTableName,
          0,
          5
        );


      console.log(
        "First records:",
        telemetry.length
      );


      // -----------------------------------------------
      // Print records
      // -----------------------------------------------

      for (
        const record of telemetry
      ) {

        console.log("");

        console.log(
          "Telemetry ID:",
          record.id
        );

        console.log(
          "Timestamp:",
          record.receivedtimestamp
        );

        console.log(
          "RFID:",
          record.rfidepc
        );

        console.log(
          "Citizen ID:",
          record.citizenid
        );

        console.log(
          "Latitude:",
          record.latitude
        );

        console.log(
          "Longitude:",
          record.longitude
        );

        console.log(
          "Vehicle:",
          record.vehiclenumber
        );

      }

      console.log("");
    }


    // =================================================
    // COMPLETE
    // =================================================

    console.log("");

    console.log(
      "================================================="
    );

    console.log(
      "TELEMETRY DAILY REPOSITORY TEST COMPLETED"
    );

    console.log(
      "================================================="
    );

  } catch (error) {

    console.error("");

    console.error(
      "================================================="
    );

    console.error(
      "TELEMETRY DAILY REPOSITORY TEST FAILED"
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