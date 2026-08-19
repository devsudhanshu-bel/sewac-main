const mainDb =
  require("../../config/mainDb");

const masterCitizenPrisma =
  require("../../config/masterCitizenPrisma");


/* =========================================================
   BENGALURU CITY ID
========================================================= */

/*
   Existing Master Citizen city table:

   Bengaluru / Bangalore
   city_id = 1
*/

const BENGALURU_CITY_ID = 1;


/* =========================================================
   NORMALIZE GEO BOUNDARY
========================================================= */

function normalizeGeoBoundary(
  value
) {

  if (
    value === null ||
    value === undefined
  ) {

    return null;

  }


  if (
    typeof value === "string"
  ) {

    try {

      return JSON.parse(
        value
      );

    } catch (
      error
    ) {

      console.error(
        "❌ Failed to parse city geo_boundary:",
        error
      );

      return null;

    }

  }


  return value;

}


/* =========================================================
   POINT IN RING
========================================================= */

/*
   Ray-casting algorithm.

   Coordinates are expected as:

   [longitude, latitude]
*/

function pointInRing(
  longitude,
  latitude,
  ring
) {

  if (
    !Array.isArray(
      ring
    ) ||
    ring.length < 3
  ) {

    return false;

  }


  let inside = false;


  for (
    let i = 0,
        j = ring.length - 1;

    i < ring.length;

    j = i++
  ) {

    const pointI =
      ring[i];

    const pointJ =
      ring[j];


    if (
      !Array.isArray(
        pointI
      ) ||
      !Array.isArray(
        pointJ
      ) ||
      pointI.length < 2 ||
      pointJ.length < 2
    ) {

      continue;

    }


    const xi =
      Number(
        pointI[0]
      );

    const yi =
      Number(
        pointI[1]
      );

    const xj =
      Number(
        pointJ[0]
      );

    const yj =
      Number(
        pointJ[1]
      );


    if (
      !Number.isFinite(
        xi
      ) ||
      !Number.isFinite(
        yi
      ) ||
      !Number.isFinite(
        xj
      ) ||
      !Number.isFinite(
        yj
      )
    ) {

      continue;

    }


    const intersects =
      (
        (yi > latitude) !==
        (yj > latitude)
      ) &&
      (
        longitude <
        (
          (xj - xi) *
          (latitude - yi) /
          (
            yj - yi
          )
        ) +
        xi
      );


    if (
      intersects
    ) {

      inside =
        !inside;

    }

  }


  return inside;

}


/* =========================================================
   POINT IN POLYGON
========================================================= */

/*
   Polygon coordinates:

   [
     outerRing,
     holeRing,
     holeRing
   ]

   The point must be inside the outer ring
   and NOT inside any hole.
*/

function pointInPolygon(
  longitude,
  latitude,
  coordinates
) {

  if (
    !Array.isArray(
      coordinates
    ) ||
    coordinates.length === 0
  ) {

    return false;

  }


  const outerRing =
    coordinates[0];


  if (
    !pointInRing(
      longitude,
      latitude,
      outerRing
    )
  ) {

    return false;

  }


  /*
     Check holes.
  */

  for (
    let i = 1;

    i < coordinates.length;

    i++
  ) {

    if (
      pointInRing(
        longitude,
        latitude,
        coordinates[i]
      )
    ) {

      return false;

    }

  }


  return true;

}


/* =========================================================
   POINT IN MULTI POLYGON
========================================================= */

function pointInMultiPolygon(
  longitude,
  latitude,
  coordinates
) {

  if (
    !Array.isArray(
      coordinates
    )
  ) {

    return false;

  }


  return coordinates.some(
    (
      polygon
    ) =>
      pointInPolygon(
        longitude,
        latitude,
        polygon
      )
  );

}


/* =========================================================
   POINT INSIDE GEO BOUNDARY
========================================================= */

/*
   Supports:

   1. Feature
   2. FeatureCollection
   3. Polygon
   4. MultiPolygon
   5. GeometryCollection
   6. Raw coordinate arrays
*/

function pointInsideGeoBoundary(
  longitude,
  latitude,
  geoBoundary
) {

  if (
    !geoBoundary
  ) {

    return false;

  }


  /* =======================================================
     FEATURE
  ======================================================= */

  if (
    geoBoundary.type ===
    "Feature"
  ) {

    return pointInsideGeoBoundary(
      longitude,
      latitude,
      geoBoundary.geometry
    );

  }


  /* =======================================================
     FEATURE COLLECTION
  ======================================================= */

  if (
    geoBoundary.type ===
    "FeatureCollection"
  ) {

    if (
      !Array.isArray(
        geoBoundary.features
      )
    ) {

      return false;

    }


    return geoBoundary.features.some(
      (
        feature
      ) =>
        pointInsideGeoBoundary(
          longitude,
          latitude,
          feature
        )
    );

  }


  /* =======================================================
     GEOMETRY COLLECTION
  ======================================================= */

  if (
    geoBoundary.type ===
    "GeometryCollection"
  ) {

    if (
      !Array.isArray(
        geoBoundary.geometries
      )
    ) {

      return false;

    }


    return geoBoundary.geometries.some(
      (
        geometry
      ) =>
        pointInsideGeoBoundary(
          longitude,
          latitude,
          geometry
        )
    );

  }


  /* =======================================================
     POLYGON
  ======================================================= */

  if (
    geoBoundary.type ===
    "Polygon"
  ) {

    return pointInPolygon(
      longitude,
      latitude,
      geoBoundary.coordinates
    );

  }


  /* =======================================================
     MULTI POLYGON
  ======================================================= */

  if (
    geoBoundary.type ===
    "MultiPolygon"
  ) {

    return pointInMultiPolygon(
      longitude,
      latitude,
      geoBoundary.coordinates
    );

  }


  /* =======================================================
     RAW COORDINATES
  ======================================================= */

  if (
    Array.isArray(
      geoBoundary
    )
  ) {

    /*
       Polygon:

       [
         [
           [lng, lat],
           [lng, lat]
         ]
       ]
    */

    if (
      geoBoundary.length > 0 &&
      Array.isArray(
        geoBoundary[0]
      ) &&
      Array.isArray(
        geoBoundary[0][0]
      ) &&
      typeof geoBoundary[0][0][0] ===
        "number"
    ) {

      return pointInPolygon(
        longitude,
        latitude,
        geoBoundary
      );

    }


    /*
       MultiPolygon:

       [
         [
           [
             [lng, lat],
             [lng, lat]
           ]
         ]
       ]
    */

    if (
      geoBoundary.length > 0 &&
      Array.isArray(
        geoBoundary[0]
      ) &&
      Array.isArray(
        geoBoundary[0][0]
      ) &&
      Array.isArray(
        geoBoundary[0][0][0]
      )
    ) {

      return pointInMultiPolygon(
        longitude,
        latitude,
        geoBoundary
      );

    }

  }


  return false;

}


/* =========================================================
   GET BENGALURU CITY BOUNDARY
========================================================= */

const getBengaluruCityBoundary =
  async () => {

    console.log("");

    console.log(
      "============================================================"
    );

    console.log(
      "🏙️ FETCHING BENGALURU CITY BOUNDARY"
    );

    console.log(
      "============================================================"
    );


    const cityRows =
      await masterCitizenPrisma.$queryRawUnsafe(
        `
          SELECT
            city_id,
            city_name,
            geo_boundary,
            city_table_name
          FROM "city"
          WHERE city_id = $1
          LIMIT 1
        `,
        BENGALURU_CITY_ID
      );


    if (
      !cityRows ||
      cityRows.length === 0
    ) {

      throw new Error(
        `Bengaluru city with id ${BENGALURU_CITY_ID} not found.`
      );

    }


    const city =
      cityRows[0];


    const geoBoundary =
      normalizeGeoBoundary(
        city.geo_boundary
      );


    if (
      !geoBoundary
    ) {

      throw new Error(
        "Bengaluru city geo_boundary is empty."
      );

    }


    console.log(
      "🏙️ CITY ID:",
      city.city_id
    );

    console.log(
      "🏙️ CITY NAME:",
      city.city_name
    );

    console.log(
      "🏙️ CITY TABLE:",
      city.city_table_name
    );

    console.log(
      "🏙️ GEO BOUNDARY TYPE:",
      geoBoundary.type ||
        "coordinates"
    );

    console.log(
      "============================================================"
    );


    return geoBoundary;

  };


/* =========================================================
   GET COMPLAINT LOCATIONS
========================================================= */

const getComplaintLocations =
  async () => {

    try {

      /* =====================================================
         FETCH BENGALURU BOUNDARY
      ===================================================== */

      const bengaluruBoundary =
        await getBengaluruCityBoundary();


      /* =====================================================
         FETCH COMPLAINTS
      ===================================================== */

      const query = `
        SELECT
          id,
          ticket_number,
          phone_number,
          title,
          description,
          category,
          image_url,
          latitude,
          longitude,
          address,
          status
        FROM citizen_complaints
        WHERE latitude IS NOT NULL
          AND longitude IS NOT NULL
        ORDER BY created_at DESC;
      `;


      const result =
        await mainDb.query(
          query
        );


      console.log("");

      console.log(
        "============================================================"
      );

      console.log(
        "📍 COMPLAINT GREVANCE MAP"
      );

      console.log(
        "============================================================"
      );

      console.log(
        "📍 TOTAL DATABASE COMPLAINTS:",
        result.rows.length
      );


      /* =====================================================
         FILTER + FORMAT
      ===================================================== */

      const locations = [];


      let outsideBengaluruCount =
        0;

      let invalidCoordinatesCount =
        0;


      for (
        const complaint
        of result.rows
      ) {

        const latitude =
          Number(
            complaint.latitude
          );

        const longitude =
          Number(
            complaint.longitude
          );


        /* ===================================================
           VALIDATE COORDINATES
        =================================================== */

        if (
          !Number.isFinite(
            latitude
          ) ||
          !Number.isFinite(
            longitude
          )
        ) {

          invalidCoordinatesCount++;

          continue;

        }


        /* ===================================================
           VALIDATE LATITUDE / LONGITUDE RANGE
        =================================================== */

        if (
          latitude < -90 ||
          latitude > 90 ||
          longitude < -180 ||
          longitude > 180
        ) {

          invalidCoordinatesCount++;

          continue;

        }


        /* ===================================================
           CHECK BENGALURU CITY BOUNDARY
        =================================================== */

        const insideBengaluru =
          pointInsideGeoBoundary(
            longitude,
            latitude,
            bengaluruBoundary
          );


        if (
          !insideBengaluru
        ) {

          outsideBengaluruCount++;


          console.log(
            "🚫 OUTSIDE BENGALURU:",
            {
              id:
                complaint.id,

              ticket:
                complaint.ticket_number,

              lat:
                latitude,

              long:
                longitude,

              address:
                complaint.address,
            }
          );


          continue;

        }


        /* ===================================================
           ADD VALID BENGALURU COMPLAINT
        =================================================== */

        locations.push({

          lat:
            latitude,

          long:
            longitude,

          data: {

            id:
              complaint.id,

            ticket_number:
              complaint.ticket_number,

            phone_number:
              complaint.phone_number,

            title:
              complaint.title,

            description:
              complaint.description,

            category:
              complaint.category,

            image_url:
              complaint.image_url,

            address:
              complaint.address,

            status:
              complaint.status,

          },

        });

      }


      /* =====================================================
         FINAL LOGS
      ===================================================== */

      console.log(
        "------------------------------------------------------------"
      );

      console.log(
        "📍 TOTAL COMPLAINTS:",
        result.rows.length
      );

      console.log(
        "📍 VALID BENGALURU COMPLAINTS:",
        locations.length
      );

      console.log(
        "🚫 OUTSIDE BENGALURU:",
        outsideBengaluruCount
      );

      console.log(
        "⚠️ INVALID COORDINATES:",
        invalidCoordinatesCount
      );

      console.log(
        "============================================================"
      );


      if (
        locations.length > 0
      ) {

        console.log(
          "📍 FIRST BENGALURU COMPLAINT:",
          locations[0]
        );

      }


      console.log(
        "============================================================"
      );

      console.log("");


      /* =====================================================
         IMPORTANT RESPONSE
      ===================================================== */

      return {

        boundary:
          bengaluruBoundary,

        locations,

        totalDatabaseComplaints:
          result.rows.length,

        validBengaluruComplaints:
          locations.length,

        outsideBengaluru:
          outsideBengaluruCount,

        invalidCoordinates:
          invalidCoordinatesCount,

      };

    } catch (
      error
    ) {

      console.error("");

      console.error(
        "❌ COMPLAINT GREVANCE MAP SERVICE ERROR:"
      );

      console.error(
        error
      );

      console.error("");

      throw error;

    }

  };


/* =========================================================
   EXPORTS
========================================================= */

module.exports = {

  getComplaintLocations,

};