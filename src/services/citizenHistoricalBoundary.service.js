const repository = require(
  "../repositories/citizenHistoricalBoundary.repository"
);


// =====================================================
// POINT-IN-POLYGON
// =====================================================
//
// Uses the ray-casting algorithm.
//
// IMPORTANT:
// GeoJSON coordinates are:
//
// [longitude, latitude]
//
// NOT:
//
// [latitude, longitude]
//
// =====================================================

function pointInPolygon(
  latitude,
  longitude,
  polygon
) {
  if (
    !Array.isArray(polygon) ||
    polygon.length < 3
  ) {
    return false;
  }

  const x = Number(longitude);
  const y = Number(latitude);

  if (
    !Number.isFinite(x) ||
    !Number.isFinite(y)
  ) {
    return false;
  }

  let inside = false;

  for (
    let i = 0, j = polygon.length - 1;
    i < polygon.length;
    j = i++
  ) {
    const xi = Number(polygon[i][0]);
    const yi = Number(polygon[i][1]);

    const xj = Number(polygon[j][0]);
    const yj = Number(polygon[j][1]);

    if (
      !Number.isFinite(xi) ||
      !Number.isFinite(yi) ||
      !Number.isFinite(xj) ||
      !Number.isFinite(yj)
    ) {
      continue;
    }

    // -------------------------------------------------
    // Ray-casting intersection
    // -------------------------------------------------

    const intersects =
      ((yi > y) !== (yj > y)) &&
      (
        x <
        (
          ((xj - xi) * (y - yi)) /
          (yj - yi)
        ) + xi
      );

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
}


// =====================================================
// POINT-IN-MULTIPOLYGON
// =====================================================

function pointInMultiPolygon(
  latitude,
  longitude,
  polygons
) {
  if (!Array.isArray(polygons)) {
    return false;
  }

  for (const polygon of polygons) {
    if (
      !Array.isArray(polygon) ||
      polygon.length === 0
    ) {
      continue;
    }

    // -------------------------------------------------
    // First ring = exterior boundary
    // -------------------------------------------------

    const exteriorRing = polygon[0];

    if (
      !pointInPolygon(
        latitude,
        longitude,
        exteriorRing
      )
    ) {
      continue;
    }

    // -------------------------------------------------
    // Remaining rings = holes
    // -------------------------------------------------

    let insideHole = false;

    for (
      let i = 1;
      i < polygon.length;
      i++
    ) {
      if (
        pointInPolygon(
          latitude,
          longitude,
          polygon[i]
        )
      ) {
        insideHole = true;
        break;
      }
    }

    if (!insideHole) {
      return true;
    }
  }

  return false;
}


// =====================================================
// NORMALIZE GEO BOUNDARY
// =====================================================
//
// Supports:
//
// Polygon
// MultiPolygon
// Feature
// FeatureCollection
// Direct coordinates
//
// =====================================================

function normalizeBoundary(
  boundary
) {
  if (
    boundary === null ||
    boundary === undefined
  ) {
    return null;
  }

  let value = boundary;

  // ---------------------------------------------------
  // JSON string
  // ---------------------------------------------------

  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch (error) {
      return null;
    }
  }

  if (
    typeof value !== "object" ||
    value === null
  ) {
    return null;
  }

  // ---------------------------------------------------
  // GeoJSON Feature
  // ---------------------------------------------------

  if (
    value.type === "Feature" &&
    value.geometry
  ) {
    return value.geometry;
  }

  // ---------------------------------------------------
  // GeoJSON FeatureCollection
  // ---------------------------------------------------

  if (
    value.type === "FeatureCollection" &&
    Array.isArray(value.features)
  ) {
    return {
      type: "FeatureCollection",
      features: value.features,
    };
  }

  // ---------------------------------------------------
  // Polygon
  // ---------------------------------------------------

  if (
    value.type === "Polygon" &&
    Array.isArray(value.coordinates)
  ) {
    return {
      type: "Polygon",
      coordinates: value.coordinates,
    };
  }

  // ---------------------------------------------------
  // MultiPolygon
  // ---------------------------------------------------

  if (
    value.type === "MultiPolygon" &&
    Array.isArray(value.coordinates)
  ) {
    return {
      type: "MultiPolygon",
      coordinates: value.coordinates,
    };
  }

  // ---------------------------------------------------
  // Plain coordinates object
  // ---------------------------------------------------

  if (
    Array.isArray(value.coordinates)
  ) {
    return {
      type: inferCoordinateType(
        value.coordinates
      ),
      coordinates: value.coordinates,
    };
  }

  // ---------------------------------------------------
  // Direct coordinate array
  // ---------------------------------------------------

  if (Array.isArray(value)) {
    return {
      type: inferCoordinateType(value),
      coordinates: value,
    };
  }

  return null;
}


// =====================================================
// INFER COORDINATE TYPE
// =====================================================

function inferCoordinateType(
  coordinates
) {
  if (
    !Array.isArray(coordinates) ||
    coordinates.length === 0
  ) {
    return null;
  }

  // ---------------------------------------------------
  // Polygon
  //
  // [
  //   [
  //     [lng, lat],
  //     [lng, lat]
  //   ]
  // ]
  //
  // ---------------------------------------------------

  if (
    Array.isArray(coordinates[0]) &&
    Array.isArray(coordinates[0][0]) &&
    typeof coordinates[0][0][0] === "number"
  ) {
    return "Polygon";
  }

  // ---------------------------------------------------
  // MultiPolygon
  //
  // [
  //   [
  //     [
  //       [lng, lat],
  //       [lng, lat]
  //     ]
  //   ]
  // ]
  //
  // ---------------------------------------------------

  if (
    Array.isArray(coordinates[0]) &&
    Array.isArray(coordinates[0][0]) &&
    Array.isArray(coordinates[0][0][0])
  ) {
    return "MultiPolygon";
  }

  return null;
}


// =====================================================
// CHECK POINT AGAINST BOUNDARY
// =====================================================

function pointInsideBoundary(
  latitude,
  longitude,
  boundary
) {
  const normalized =
    normalizeBoundary(boundary);

  if (!normalized) {
    return false;
  }

  // ---------------------------------------------------
  // FeatureCollection
  // ---------------------------------------------------

  if (
    normalized.type ===
    "FeatureCollection"
  ) {
    for (
      const feature of normalized.features
    ) {
      if (
        pointInsideBoundary(
          latitude,
          longitude,
          feature
        )
      ) {
        return true;
      }
    }

    return false;
  }

  // ---------------------------------------------------
  // Polygon
  // ---------------------------------------------------

  if (
    normalized.type === "Polygon"
  ) {
    return pointInMultiPolygon(
      latitude,
      longitude,
      [
        normalized.coordinates,
      ]
    );
  }

  // ---------------------------------------------------
  // MultiPolygon
  // ---------------------------------------------------

  if (
    normalized.type === "MultiPolygon"
  ) {
    return pointInMultiPolygon(
      latitude,
      longitude,
      normalized.coordinates
    );
  }

  return false;
}


// =====================================================
// FIND CITY
// =====================================================

function findCityForPoint(
  latitude,
  longitude,
  cities
) {
  if (!Array.isArray(cities)) {
    return null;
  }

  for (
    const city of cities
  ) {
    if (
      pointInsideBoundary(
        latitude,
        longitude,
        city.cityBoundary
      )
    ) {
      return city;
    }
  }

  return null;
}


// =====================================================
// FIND ZONE
// =====================================================

function findZoneForPoint(
  latitude,
  longitude,
  city
) {
  if (
    !city ||
    !Array.isArray(city.zones)
  ) {
    return null;
  }

  for (
    const zone of city.zones
  ) {
    if (
      pointInsideBoundary(
        latitude,
        longitude,
        zone.zoneBoundary
      )
    ) {
      return zone;
    }
  }

  return null;
}


// =====================================================
// FIND DIVISION
// =====================================================

function findDivisionForPoint(
  latitude,
  longitude,
  zone
) {
  if (
    !zone ||
    !Array.isArray(zone.divisions)
  ) {
    return null;
  }

  for (
    const division of zone.divisions
  ) {
    if (
      pointInsideBoundary(
        latitude,
        longitude,
        division.divisionBoundary
      )
    ) {
      return division;
    }
  }

  return null;
}


// =====================================================
// FIND WARD
// =====================================================

function findWardForPoint(
  latitude,
  longitude,
  division
) {
  if (
    !division ||
    !Array.isArray(division.wards)
  ) {
    return null;
  }

  for (
    const ward of division.wards
  ) {
    if (
      pointInsideBoundary(
        latitude,
        longitude,
        ward.wardBoundary
      )
    ) {
      return ward;
    }
  }

  return null;
}


// =====================================================
// LOAD BOUNDARY CACHE
// =====================================================
//
// Database
//    ↓
// Complete hierarchy
//    ↓
// RAM
//    ↓
// GPS resolution
//
// We DON'T query the database for every telemetry row.
//
// =====================================================

async function loadBoundaryCache() {
  const hierarchy =
    await repository.getCompleteBoundaryHierarchy();

  return hierarchy;
}


// =====================================================
// RESOLVE GPS POINT
// =====================================================
//
// GPS
// ↓
// City
// ↓
// Zone
// ↓
// Division
// ↓
// Ward
//
// =====================================================

function resolveGpsPoint(
  latitude,
  longitude,
  boundaryCache
) {
  const numericLatitude =
    Number(latitude);

  const numericLongitude =
    Number(longitude);

  // ---------------------------------------------------
  // Validate coordinates
  // ---------------------------------------------------

  if (
    !Number.isFinite(numericLatitude) ||
    !Number.isFinite(numericLongitude)
  ) {
    return {
      matched: false,
      reason: "INVALID_COORDINATES",
    };
  }

  // ---------------------------------------------------
  // Find City
  // ---------------------------------------------------

  const city =
    findCityForPoint(
      numericLatitude,
      numericLongitude,
      boundaryCache
    );

  if (!city) {
    return {
      matched: false,
      reason: "OUTSIDE_CITY",
    };
  }

  // ---------------------------------------------------
  // Find Zone
  // ---------------------------------------------------

  const zone =
    findZoneForPoint(
      numericLatitude,
      numericLongitude,
      city
    );

  if (!zone) {
    return {
      matched: false,
      reason: "ZONE_NOT_FOUND",

      city: {
        cityId: city.cityId,
        cityName: city.cityName,
      },
    };
  }

  // ---------------------------------------------------
  // Find Division
  // ---------------------------------------------------

  const division =
    findDivisionForPoint(
      numericLatitude,
      numericLongitude,
      zone
    );

  if (!division) {
    return {
      matched: false,
      reason: "DIVISION_NOT_FOUND",

      city: {
        cityId: city.cityId,
        cityName: city.cityName,
      },

      zone: {
        zoneId: zone.zoneId,
        zoneName: zone.zoneName,
      },
    };
  }

  // ---------------------------------------------------
  // Find Ward
  // ---------------------------------------------------

  const ward =
    findWardForPoint(
      numericLatitude,
      numericLongitude,
      division
    );

  if (!ward) {
    return {
      matched: false,
      reason: "WARD_NOT_FOUND",

      city: {
        cityId: city.cityId,
        cityName: city.cityName,
      },

      zone: {
        zoneId: zone.zoneId,
        zoneName: zone.zoneName,
      },

      division: {
        divisionId:
          division.divisionId,

        divisionName:
          division.divisionName,
      },
    };
  }

  // ---------------------------------------------------
  // SUCCESS
  // ---------------------------------------------------

  return {
    matched: true,

    city: {
      cityId:
        city.cityId,

      cityName:
        city.cityName,
    },

    zone: {
      zoneId:
        zone.zoneId,

      zoneName:
        zone.zoneName,
    },

    division: {
      divisionId:
        division.divisionId,

      divisionName:
        division.divisionName,
    },

    ward: {
      wardId:
        ward.wardId,

      wardNo:
        ward.wardNo,

      wardName:
        ward.wardName,

      wardTableName:
        ward.wardTableName,
    },
  };
}


// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  pointInPolygon,

  pointInMultiPolygon,

  normalizeBoundary,

  pointInsideBoundary,

  loadBoundaryCache,

  resolveGpsPoint,
};