const gpsResolver =
  require(
    "../services/citizenHistoricalGpsResolver.service"
  );


// =====================================================
// TEST CONFIGURATION
// =====================================================
//
// This point is inside our temporary:
//
// Bengaluru East Test Zone
//       ↓
// East Test Division
//       ↓
// Ward 174 - Test Ibbaluru
//
// =====================================================

const TEST_LATITUDE =
   12.9325;

const TEST_LONGITUDE =
  77.6275;


// =====================================================
// MAIN TEST
// =====================================================

async function test() {

  console.log("");

  console.log(
    "================================================="
  );

  console.log(
    "CITIZEN HISTORICAL GPS RESOLVER TEST"
  );

  console.log(
    "================================================="
  );

  console.log("");

  console.log(
    "Test Latitude :",
    TEST_LATITUDE
  );

  console.log(
    "Test Longitude:",
    TEST_LONGITUDE
  );

  console.log("");


  try {

    // -----------------------------------------------
    // Load boundary cache
    // -----------------------------------------------

    await gpsResolver.loadBoundaries();


    console.log("");

    console.log(
      "Resolving GPS..."
    );

    console.log("");


    // -----------------------------------------------
    // Resolve
    // -----------------------------------------------

    const result =
      await gpsResolver.resolve(
        TEST_LATITUDE,
        TEST_LONGITUDE
      );


    // -----------------------------------------------
    // Print result
    // -----------------------------------------------

    console.log(
      "RESULT:"
    );

    console.log("");

    console.log(
      JSON.stringify(
        result,
        null,
        2
      )
    );


    // -----------------------------------------------
    // Success
    // -----------------------------------------------

    if (result.matched) {

      console.log("");

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
        `  ${result.city.cityName}`
      );

      console.log("");

      console.log(
        "ZONE:"
      );

      console.log(
        `  ${result.zone.zoneName}`
      );

      console.log("");

      console.log(
        "DIVISION:"
      );

      console.log(
        `  ${result.division.divisionName}`
      );

      console.log("");

      console.log(
        "WARD:"
      );

      console.log(
        `  ${result.ward.wardNo} - ${result.ward.wardName}`
      );

      console.log("");

      console.log(
        "WARD TABLE:"
      );

      console.log(
        `  ${result.ward.wardTableName}`
      );

      console.log("");

      console.log(
        "================================================="
      );

    } else {

      console.log("");

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

      console.log("");

    }

  } catch (error) {

    console.error("");

    console.error(
      "================================================="
    );

    console.error(
      "GPS RESOLVER TEST FAILED"
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