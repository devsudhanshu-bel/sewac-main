const telemetryDailyRepository =
  require("../repositories/telemetryDaily.repository");

const citizenHistoricalGpsResolver =
  require("./citizenHistoricalGpsResolver.service");


// =====================================================
// CITIZEN HISTORICAL TELEMETRY RESOLVER
// =====================================================
//
// PURPOSE:
//
// Read ONE telemetry record from the existing
// Telemetry DB and resolve:
//
// Telemetry
//     ↓
// GPS
//     ↓
// City
//     ↓
// Zone
//     ↓
// Division
//     ↓
// Ward
//
// IMPORTANT:
//
// This service is READ-ONLY.
//
// It does NOT:
// - modify telemetry
// - modify vehicle tables
// - modify day tables
// - insert historical data
//
// =====================================================


class CitizenHistoricalTelemetryResolver {

  // ===================================================
  // RESOLVE ONE TELEMETRY RECORD
  // ===================================================

  async resolveTelemetryRecord(
    record
  ) {

    if (!record) {

      throw new Error(
        "Telemetry record is required"
      );

    }


    // -----------------------------------------------
    // Extract GPS
    // -----------------------------------------------

    const latitude =
      record.latitude !== null &&
      record.latitude !== undefined
        ? Number(record.latitude)
        : null;


    const longitude =
      record.longitude !== null &&
      record.longitude !== undefined
        ? Number(record.longitude)
        : null;


    // -----------------------------------------------
    // Validate GPS
    // -----------------------------------------------

    if (
      latitude === null ||
      longitude === null
    ) {

      return {

        matched: false,

        reason: "GPS_NOT_AVAILABLE",

        telemetry: {
          id: record.id,
          vehicleNumber:
            record.vehiclenumber,
          rfidEpc:
            record.rfidepc,
          citizenId:
            record.citizenid,
        },

      };

    }


    if (
      Number.isNaN(latitude) ||
      Number.isNaN(longitude)
    ) {

      return {

        matched: false,

        reason: "INVALID_GPS",

        telemetry: {
          id: record.id,
          vehicleNumber:
            record.vehiclenumber,
          rfidEpc:
            record.rfidepc,
          citizenId:
            record.citizenid,
        },

      };

    }


    // -----------------------------------------------
    // Resolve GPS
    // -----------------------------------------------

    const boundaryResult =
      await citizenHistoricalGpsResolver.resolve(
        latitude,
        longitude
      );


    // -----------------------------------------------
    // Return complete result
    // -----------------------------------------------

    return {

      matched:
        boundaryResult.matched,

      reason:
        boundaryResult.reason || null,

      telemetry: {

        id:
          record.id,

        iotTimestamp:
          record.iottimestamp,

        receivedTimestamp:
          record.receivedtimestamp,

        rfidEpc:
          record.rfidepc,

        citizenId:
          record.citizenid,

        wasteType:
          record.wastetype,

        latitude,

        longitude,

        wetWeight:
          record.wetweight,

        dryWeight:
          record.dryweight,

        otherWeight:
          record.otherweight,

        cumulativeWeight:
          record.cumulativeweight,

        vehicleNumber:
          record.vehiclenumber,

        driverName:
          record.drivername,

        collectionType:
          record.collectiontype,

      },


      location:
        boundaryResult.matched
          ? {

              city:
                boundaryResult.city,

              zone:
                boundaryResult.zone,

              division:
                boundaryResult.division,

              ward:
                boundaryResult.ward,

            }

          : null,

    };

  }


  // ===================================================
  // READ ONE VEHICLE'S FIRST TELEMETRY RECORD
  // ===================================================
  //
  // This is intentionally limited to ONE record.
  //
  // We use it for the first integration test.
  //
  // ===================================================

  async resolveFirstTelemetryRecord(
    vehicleTableName
  ) {

    const records =
      await telemetryDailyRepository
        .getVehicleTelemetry(
          vehicleTableName,
          0,
          1
        );


    if (!records.length) {

      return {

        matched: false,

        reason:
          "NO_TELEMETRY_RECORDS",

        telemetry: null,

        location: null,

      };

    }


    return await this.resolveTelemetryRecord(
      records[0]
    );

  }

}


module.exports =
  new CitizenHistoricalTelemetryResolver();