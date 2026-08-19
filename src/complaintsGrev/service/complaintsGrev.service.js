const mainDb = require("../../config/mainDb");
const masterCitizenPrisma =
  require("../../config/masterCitizenPrisma");

/**
 * ============================================================
 * COMPLAINTS GRIEVANCE MAP SERVICE
 * ============================================================
 *
 * Fetches citizen complaints and returns ONLY complaints
 * whose latitude/longitude falls inside the Bengaluru
 * city boundary.
 *
 * Bengaluru city boundary is fetched from:
 *
 * master-citizen DB
 *       ↓
 * city table
 *       ↓
 * city_id = 1
 *       ↓
 * geo_boundary
 *
 * Complaint data comes from:
 *
 * SEWAC DB
 *       ↓
 * citizen_complaints
 *
 * ============================================================
 *
 * RESPONSE FORMAT
 *
 * [
 *   {
 *     lat: 12.9716,
 *     long: 77.5946,
 *     data: {
 *       id: 1,
 *       ticket_number: "...",
 *       phone_number: "...",
 *       title: "...",
 *       description: "...",
 *       category: "...",
 *       image_url: "...",
 *       address: "...",
 *       status: "PENDING"
 *     }
 *   }
 * ]
 *
 * ============================================================
 */


/* =========================================================
   BENGALURU CITY ID
========================================================= */

/*
   From the existing master-citizen city map:

   Bengaluru / Bangalore = city_id 1
*/

const BENGALURU_CITY_ID = 1;


/* =========================================================
   NORMALIZE GEO BOUNDARY
========================================================= */

function normalizeGeoBoundary(value) {
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
      return JSON.parse(value);
    } catch (error) {
      console.error(
        "❌ Failed to parse city geo_boundary JSON:",
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

   point:
     [longitude, latitude]

   ring:
     [
       [longitude, latitude],
       [longitude, latitude],
       ...
     ]

   Returns true when the point lies inside the ring.
*/

function pointInRing(
  longitude,
  latitude,
  ring
) {
  if (
    !Array.isArray(ring) ||
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
    const pointI = ring[i];
    const pointJ = ring[j];

    if (
      !Array.isArray(pointI) ||
      !Array.isArray(pointJ) ||
      pointI.length < 2 ||
      pointJ.length < 2
    ) {
      continue;
    }

    const xi = Number(pointI[0]);
    const yi = Number(pointI[1]);

    const xj = Number(pointJ[0]);
    const yj = Number(pointJ[1]);

    if (
      !Number.isFinite(xi) ||
      !Number.isFinite(yi) ||
      !Number.isFinite(xj) ||
      !Number.isFinite(yj)
    ) {
      continue;
    }

    const intersects =
      (
        yi > latitude
      ) !==
      (
        yj > latitude
      ) &&
      longitude <
        (
          (xj - xi) *
            (latitude - yi) /
            (yj - yi)
        ) +
          xi;

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
}


/* =========================================================
   POINT IN POLYGON
========================================================= */

/*
   Polygon structure:

   coordinates = [
     outerRing,
     holeRing,
     holeRing,
     ...
   ]

   First ring = outer boundary.
   Remaining rings = holes.

   A point must:
     1. Be inside outer ring
     2. NOT be inside any hole
*/

function pointInPolygon(
  longitude,
  latitude,
  polygonCoordinates
) {
  if (
    !Array.isArray(
      polygonCoordinates
    ) ||
    polygonCoordinates.length === 0
  ) {
    return false;
  }

  const outerRing =
    polygonCoordinates[0];

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
    i < polygonCoordinates.length;
    i++
  ) {
    const hole =
      polygonCoordinates[i];

    if (
      pointInRing(
        longitude,
        latitude,
        hole
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
  multiPolygonCoordinates
) {
  if (
    !Array.isArray(
      multiPolygonCoordinates
    )
  ) {
    return false;
  }

  for (
    const polygonCoordinates
    of multiPolygonCoordinates
  ) {
    if (
      pointInPolygon(
        longitude,
        latitude,
        polygonCoordinates
      )
    ) {
      return true;
    }
  }

  return false;
}


/* =========================================================
   POINT IN GEOJSON
========================================================= */

/*
   Supports:

   1. Feature
   2. FeatureCollection
   3. Polygon
   4. MultiPolygon
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


  /* -------------------------------------------------------
     GEOJSON FEATURE
  ------------------------------------------------------- */

  if (
    geoBoundary.type === "Feature"
  ) {
    return pointInsideGeoBoundary(
      longitude,
      latitude,
      geoBoundary.geometry
    );
  }


  /* -------------------------------------------------------
     GEOJSON FEATURE COLLECTION
  ------------------------------------------------------- */

  if (
    geoBoundary.type === "FeatureCollection"
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


  /* -------------------------------------------------------
     GEOJSON POLYGON
  ------------------------------------------------------- */

  if (
    geoBoundary.type === "Polygon"
  ) {
    return pointInPolygon(
      longitude,
      latitude,
      geoBoundary.coordinates
    );
  }


  /* -------------------------------------------------------
     GEOJSON MULTI POLYGON
  ------------------------------------------------------- */

  if (
    geoBoundary.type === "MultiPolygon"
  ) {
    return pointInMultiPolygon(
      longitude,
      latitude,
      geoBoundary.coordinates
    );
  }


  /*
     Some databases may store only the
     coordinates array instead of a complete
     GeoJSON object.

     Try to detect that format.
  */

  if (
    Array.isArray(geoBoundary)
  ) {

    /*
       Polygon-like:

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
       MultiPolygon-like:

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

      /* -----------------------------------------------------
         FETCH BENGALURU BOUNDARY FIRST
      ----------------------------------------------------- */

      const bengaluruBoundary =
        await getBengaluruCityBoundary();


      /* -----------------------------------------------------
         FETCH COMPLAINTS
      ----------------------------------------------------- */

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


      /* -----------------------------------------------------
         FILTER + FORMAT
      ----------------------------------------------------- */

      const locations = [];


      let outsideBengaluruCount = 0;

      let invalidCoordinatesCount = 0;


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


        /* ---------------------------------------------------
           VALIDATE COORDINATES
        --------------------------------------------------- */

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


        /* ---------------------------------------------------
           VALIDATE LATITUDE RANGE
        --------------------------------------------------- */

        if (
          latitude < -90 ||
          latitude > 90 ||
          longitude < -180 ||
          longitude > 180
        ) {

          invalidCoordinatesCount++;

          continue;
        }


        /* ---------------------------------------------------
           CHECK BENGALURU BOUNDARY
        --------------------------------------------------- */

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


        /* ---------------------------------------------------
           ADD VALID BENGALURU COMPLAINT
        --------------------------------------------------- */

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


      /* -----------------------------------------------------
         FINAL LOGS
      ----------------------------------------------------- */

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


      return locations;

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