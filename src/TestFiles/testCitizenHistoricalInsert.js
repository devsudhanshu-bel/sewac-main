require("../config/loadEnv");

const citizenHistoricalProcessor =
  require(
    "../services/citizenHistoricalProcessor.service"
  );


// =====================================================
// TEST DATE
// =====================================================

const TEST_DATE =
  new Date(
    2026,
    7,
    9
  );


// =====================================================
// BIGINT SAFE JSON
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
// MAIN
// =====================================================

async function test() {

  try {

    console.log("");

    console.log(
      "================================================="
    );

    console.log(
      "CITIZEN HISTORICAL FIRST INSERT TEST"
    );

    console.log(
      "================================================="
    );

    console.log("");

    console.log(
      "Processing:",
      TEST_DATE.toDateString()
    );

    console.log("");


    // =================================================
    // PROCESS ONE RECORD
    // =================================================

    const result =
      await citizenHistoricalProcessor
        .processFirstRecord(
          TEST_DATE
        );


    console.log("");

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
    // SUCCESS
    // =================================================

    if (
      result.processed
    ) {

      console.log(
        "================================================="
      );

      console.log(
        "HISTORICAL INSERT SUCCESS"
      );

      console.log(
        "================================================="
      );

      console.log("");

      console.log(
        "CITY:",
        result.city.cityName
      );

      console.log(
        "ZONE:",
        result.zone.zoneName
      );

      console.log(
        "DIVISION:",
        result.division.divisionName
      );

      console.log(
        "WARD:",
        `${result.ward.wardNo} - ${result.ward.wardName}`
      );

      console.log(
        "WARD TABLE:",
        result.ward.wardTableName
      );

      console.log("");

      console.log(
        "MONTHLY TABLE:",
        result.monthlyTable
      );

      console.log(
        "YEARLY TABLE:",
        result.yearlyTable
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
        "HISTORICAL PROCESSING NOT COMPLETED"
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
      "HISTORICAL INSERT TEST FAILED"
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