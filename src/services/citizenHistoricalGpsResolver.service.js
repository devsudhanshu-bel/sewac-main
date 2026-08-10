const boundaryService = require(
  "./citizenHistoricalBoundary.service"
);


// =====================================================
// CITIZEN HISTORICAL GPS RESOLVER
// =====================================================
//
// Responsibility:
//
// GPS
//   ↓
// City
//   ↓
// Zone
//   ↓
// Division
//   ↓
// Ward
//
// This service ONLY resolves the location.
//
// It does NOT:
// - modify telemetry
// - insert telemetry
// - insert historical data
// - modify citizen tables
//
// =====================================================


class CitizenHistoricalGpsResolver {

  constructor() {

    this.boundaryCache = null;

  }


  // ===================================================
  // LOAD / REFRESH CACHE
  // ===================================================

  async loadBoundaries() {

    console.log(
      "Loading citizen historical boundary cache..."
    );

    this.boundaryCache =
      await boundaryService.loadBoundaryCache();

    console.log(
      "Citizen historical boundary cache loaded."
    );

    return this.boundaryCache;
  }


  // ===================================================
  // GET CACHE
  // ===================================================

  async getBoundaryCache() {

    if (!this.boundaryCache) {

      await this.loadBoundaries();

    }

    return this.boundaryCache;
  }


  // ===================================================
  // REFRESH CACHE
  // ===================================================

  async refreshBoundaries() {

    this.boundaryCache = null;

    return await this.loadBoundaries();

  }


  // ===================================================
  // RESOLVE GPS
  // ===================================================

  async resolve(
    latitude,
    longitude
  ) {

    const cache =
      await this.getBoundaryCache();


    const result =
      boundaryService.resolveGpsPoint(
        latitude,
        longitude,
        cache
      );


    return result;

  }


  // ===================================================
  // RESOLVE TELEMETRY PACKET
  // ===================================================
  //
  // This is intentionally compatible with the
  // telemetry packet structure.
  //
  // We ONLY read latitude / longitude.
  //
  // ===================================================

  async resolvePacket(packet) {

    if (!packet) {

      return {
        matched: false,
        reason: "INVALID_PACKET",
      };

    }


    const latitude =
      packet.latitude;

    const longitude =
      packet.longitude;


    return await this.resolve(
      latitude,
      longitude
    );

  }


  // ===================================================
  // GET WARD TABLE
  // ===================================================
  //
  // Convenience helper for the historical processor.
  //
  // ===================================================

  async resolveWardTable(
    latitude,
    longitude
  ) {

    const result =
      await this.resolve(
        latitude,
        longitude
      );


    if (!result.matched) {

      return result;

    }


    return {

      matched: true,

      cityId:
        result.city.cityId,

      cityName:
        result.city.cityName,

      zoneId:
        result.zone.zoneId,

      zoneName:
        result.zone.zoneName,

      divisionId:
        result.division.divisionId,

      divisionName:
        result.division.divisionName,

      wardId:
        result.ward.wardId,

      wardNo:
        result.ward.wardNo,

      wardName:
        result.ward.wardName,

      wardTableName:
        result.ward.wardTableName,

    };

  }

}


// =====================================================
// EXPORT SINGLE INSTANCE
// =====================================================

module.exports =
  new CitizenHistoricalGpsResolver();