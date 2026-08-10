const repository =
  require("./repositories/citizenHistoricalBoundary.repository");

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
      "CITIZEN HISTORICAL BOUNDARY INSPECTION"
    );
    console.log(
      "================================================="
    );
    console.log("");

    const cities =
      await repository.getAllCities();

    console.log(
      `Cities found: ${cities.length}`
    );

    // =================================================
    // CITY
    // =================================================

    for (const city of cities) {
      console.log("");
      console.log(
        "-------------------------------------------------"
      );

      console.log(
        `CITY: ${city.city_name}`
      );

      console.log(
        `City ID: ${city.city_id}`
      );

      console.log(
        `City Table: ${city.city_table_name}`
      );

      console.log(
        "Boundary type:",
        getBoundaryType(
          city.geo_boundary
        )
      );

      if (city.geo_boundary) {
        console.log(
          "Boundary preview:",
          JSON.stringify(
            city.geo_boundary
          ).slice(0, 300)
        );
      }

      // -----------------------------------------------
      // No city table
      // -----------------------------------------------

      if (!city.city_table_name) {
        console.log(
          "No city table configured."
        );

        continue;
      }

      // =================================================
      // ZONES
      // =================================================

      const zones =
        await repository.getZonesForCity(
          city.city_table_name
        );

      console.log(
        `Zones: ${zones.length}`
      );

      for (const zone of zones) {
        console.log("");
        console.log(
          `  ZONE: ${zone.zone_name}`
        );

        console.log(
          `  Zone ID: ${zone.zone_id}`
        );

        console.log(
          `  Zone Table: ${zone.zone_table_name}`
        );

        console.log(
          "  Boundary type:",
          getBoundaryType(
            zone.geo_boundary
          )
        );

        if (zone.geo_boundary) {
          console.log(
            "  Boundary preview:",
            JSON.stringify(
              zone.geo_boundary
            ).slice(0, 300)
          );
        }

        // ---------------------------------------------
        // No zone table
        // ---------------------------------------------

        if (!zone.zone_table_name) {
          console.log(
            "  No zone table configured."
          );

          continue;
        }

        // =================================================
        // DIVISIONS
        // =================================================

        const divisions =
          await repository.getDivisionsForZone(
            zone.zone_table_name
          );

        console.log(
          `  Divisions: ${divisions.length}`
        );

        for (const division of divisions) {
          console.log("");

          console.log(
            `    DIVISION: ${division.division_name}`
          );

          console.log(
            `    Division ID: ${division.division_id}`
          );

          console.log(
            `    Division Table: ${division.division_table_name}`
          );

          console.log(
            "    Boundary type:",
            getBoundaryType(
              division.geo_boundary
            )
          );

          if (division.geo_boundary) {
            console.log(
              "    Boundary preview:",
              JSON.stringify(
                division.geo_boundary
              ).slice(0, 300)
            );
          }

          // ---------------------------------------------
          // No division table
          // ---------------------------------------------

          if (
            !division.division_table_name
          ) {
            console.log(
              "    No division table configured."
            );

            continue;
          }

          // =================================================
          // WARDS
          // =================================================

          const wards =
            await repository.getWardsForDivision(
              division.division_table_name
            );

          console.log(
            `    Wards: ${wards.length}`
          );

          for (const ward of wards) {
            console.log("");

            console.log(
              `      WARD: ${ward.ward_no} - ${ward.ward_name}`
            );

            console.log(
              `      Ward ID: ${ward.ward_id}`
            );

            console.log(
              `      Ward Table: ${ward.ward_table_name}`
            );

            console.log(
              "      Boundary type:",
              getBoundaryType(
                ward.geo_boundary
              )
            );

            if (ward.geo_boundary) {
              console.log(
                "      Boundary preview:",
                JSON.stringify(
                  ward.geo_boundary
                ).slice(0, 350)
              );
            }

            // =================================================
            // WARD SUMMARY
            // =================================================

            console.log(
              "      -------------------------------------"
            );

            console.log(
              "      Historical Mapping:"
            );

            console.log(
              `      City       : ${city.city_name}`
            );

            console.log(
              `      Zone       : ${zone.zone_name}`
            );

            console.log(
              `      Division   : ${division.division_name}`
            );

            console.log(
              `      Ward       : ${ward.ward_no} - ${ward.ward_name}`
            );

            console.log(
              `      Citizen DB Table : ${ward.ward_table_name}`
            );

            console.log(
              "      -------------------------------------"
            );
          }
        }
      }
    }

    console.log("");

    console.log(
      "================================================="
    );

    console.log(
      "BOUNDARY INSPECTION COMPLETED"
    );

    console.log(
      "================================================="
    );

    console.log("");
  } catch (error) {
    console.error("");

    console.error(
      "================================================="
    );

    console.error(
      "BOUNDARY INSPECTION FAILED"
    );

    console.error(
      "================================================="
    );

    console.error("");

    console.error(
      error
    );

    console.error("");
  } finally {
    process.exit(0);
  }
}

// =====================================================
// BOUNDARY TYPE HELPER
// =====================================================

function getBoundaryType(
  boundary
) {
  if (
    boundary === null ||
    boundary === undefined
  ) {
    return "NULL";
  }

  // -----------------------------------------------
  // JSON stored as string
  // -----------------------------------------------

  if (
    typeof boundary === "string"
  ) {
    try {
      const parsed =
        JSON.parse(boundary);

      return (
        parsed?.type ||
        "JSON_STRING"
      );
    } catch {
      return "INVALID_JSON";
    }
  }

  // -----------------------------------------------
  // JSONB returned as object
  // -----------------------------------------------

  if (
    typeof boundary === "object"
  ) {
    return (
      boundary.type ||
      "OBJECT_WITHOUT_TYPE"
    );
  }

  return typeof boundary;
}

// =====================================================
// RUN
// =====================================================

test();