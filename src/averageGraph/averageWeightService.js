const mainDb = require("../config/mainDb");

/* ============================================================
   DATE VALIDATION
   ============================================================ */

const validateDate = (date) => {
  if (!date) {
    throw new Error("Date is required");
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("date must be in YYYY-MM-DD format");
  }

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error("Invalid date");
  }

  return date;
};


/* ============================================================
   DAY TABLE NAME
   ============================================================ */

const getDayTableName = (date) => {
  const [year, month, day] = date.split("-");

  return `day_${day}${month}${year}`;
};


/* ============================================================
   SAFE IDENTIFIER
   ============================================================ */

const isSafeIdentifier = (value) => {
  return (
    typeof value === "string" &&
    /^[a-zA-Z0-9_]+$/.test(value)
  );
};


/* ============================================================
   CHECK TABLE EXISTS
   ============================================================ */

const tableExists = async (tableName) => {
  if (!isSafeIdentifier(tableName)) {
    return false;
  }

  const result = await mainDb.query(
    `
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = $1
      ) AS exists
    `,
    [tableName]
  );

  return result.rows[0]?.exists === true;
};


/* ============================================================
   GET VEHICLE MASTER DATA
   ============================================================ */

const getVehicleMaster = async () => {
  const result = await mainDb.query(
    `
      SELECT
        vehicle_id,
        city,
        zone,
        division,
        ward
      FROM vehicle_master
    `
  );

  return result.rows || [];
};


/* ============================================================
   GET AVERAGE WEIGHT GRAPH
   ============================================================

   REQUIRED:
      date

   FLOW:

      date
        ↓
      day_DDMMYYYY
        ↓
      vehicle_number
      vehicle_table_name
        ↓
      vehicle_master
        ↓
      zone
        ↓
      telemetry table
        ↓
      wetweight
      dryweight
      otherweight
        ↓
      zone-wise result

   ============================================================ */

const getAverageWeightGraph = async ({ date }) => {
  /* ----------------------------------------------------------
     VALIDATE DATE
     ---------------------------------------------------------- */

     const dbInfo = await mainDb.query(`
    SELECT
        current_database() AS database,
        current_schema() AS schema
`);

console.log("========================================");
console.log("AVERAGE GRAPH DB CONNECTION");
console.log(dbInfo.rows[0]);
console.log("========================================");

  validateDate(date);

  const dayTable = getDayTableName(date);


  /* ----------------------------------------------------------
     CHECK DAY TABLE
     ---------------------------------------------------------- */

  const dayTableExists = await tableExists(dayTable);

  if (!dayTableExists) {
    return {
      message: `No daily vehicle table found for ${date}`,
      data: [],
    };
  }


  /* ----------------------------------------------------------
     GET DAY TABLE DATA
     ---------------------------------------------------------- */

  const dailyResult = await mainDb.query(
    `
      SELECT
        vehicle_number,
        vehicle_table_name,
        ward_no
      FROM "${dayTable}"
    `
  );

  const dailyVehicles = dailyResult.rows || [];


  /* ----------------------------------------------------------
     DAY TABLE EXISTS BUT EMPTY
     ---------------------------------------------------------- */

  if (dailyVehicles.length === 0) {
    return {
      message: `Daily vehicle table ${dayTable} exists but contains no vehicle data`,
      data: [],
    };
  }


  /* ----------------------------------------------------------
     GET VEHICLE MASTER
     ---------------------------------------------------------- */

  const masterVehicles = await getVehicleMaster();


  if (masterVehicles.length === 0) {
    return {
      message: "vehicle_master contains no vehicle data",
      data: [],
    };
  }


  /* ----------------------------------------------------------
     VEHICLE MASTER LOOKUP
     ---------------------------------------------------------- */

  const vehicleLookup = new Map();

  for (const vehicle of masterVehicles) {
    if (!vehicle.vehicle_id) {
      continue;
    }

    vehicleLookup.set(
      String(vehicle.vehicle_id).trim(),
      vehicle
    );
  }


  /* ----------------------------------------------------------
     GROUP DAILY VEHICLES BY TELEMETRY TABLE
     ---------------------------------------------------------- */

  const telemetryGroups = new Map();

  for (const dailyVehicle of dailyVehicles) {
    const vehicleNumber = String(
      dailyVehicle.vehicle_number || ""
    ).trim();

    const telemetryTable = String(
      dailyVehicle.vehicle_table_name || ""
    ).trim();


    if (!vehicleNumber) {
      continue;
    }

    if (!telemetryTable) {
      continue;
    }

    if (!isSafeIdentifier(telemetryTable)) {
      continue;
    }


    /* --------------------------------------------------------
       FIND VEHICLE IN MASTER
       -------------------------------------------------------- */

    const masterVehicle =
      vehicleLookup.get(vehicleNumber);

    if (!masterVehicle) {
      continue;
    }


    /* --------------------------------------------------------
       CREATE TELEMETRY GROUP
       -------------------------------------------------------- */

    if (!telemetryGroups.has(telemetryTable)) {
      telemetryGroups.set(telemetryTable, []);
    }

    telemetryGroups.get(telemetryTable).push({
      vehicleNumber,
      masterVehicle,
    });
  }


  /* ----------------------------------------------------------
     NO MATCHING VEHICLES
     ---------------------------------------------------------- */

  if (telemetryGroups.size === 0) {
    return {
      message:
        "No vehicles from the daily table were found in vehicle_master",
      data: [],
    };
  }


  /* ----------------------------------------------------------
     ZONE ACCUMULATOR
     ---------------------------------------------------------- */

  const zoneMap = new Map();


  /* ----------------------------------------------------------
     PROCESS EACH TELEMETRY TABLE
     ---------------------------------------------------------- */

  for (const [
    telemetryTable,
    vehicles,
  ] of telemetryGroups) {

    /* --------------------------------------------------------
       CHECK TELEMETRY TABLE
       -------------------------------------------------------- */

    const telemetryTableExists =
      await tableExists(telemetryTable);

    if (!telemetryTableExists) {
      console.warn(
        `Telemetry table not found: ${telemetryTable}`
      );

      continue;
    }


    /* --------------------------------------------------------
       VEHICLES BELONGING TO THIS TELEMETRY TABLE
       -------------------------------------------------------- */

    const tableVehicleLookup = new Map();

    for (const vehicle of vehicles) {
      tableVehicleLookup.set(
        String(vehicle.vehicleNumber).trim(),
        vehicle.masterVehicle
      );
    }


    /* --------------------------------------------------------
       GET TELEMETRY FOR SELECTED DATE
       -------------------------------------------------------- */

    const telemetryResult = await mainDb.query(
      `
        SELECT
          vehiclenumber,
          receivedtimestamp,
          wetweight,
          dryweight,
          otherweight
        FROM "${telemetryTable}"
        WHERE DATE(receivedtimestamp) = $1::date
      `,
      [date]
    );

    const telemetryRows =
      telemetryResult.rows || [];


    if (telemetryRows.length === 0) {
      continue;
    }


    /* --------------------------------------------------------
       PROCESS TELEMETRY
       -------------------------------------------------------- */

    for (const row of telemetryRows) {
      const vehicleNumber = String(
        row.vehiclenumber || ""
      ).trim();


      if (!vehicleNumber) {
        continue;
      }


      const masterVehicle =
        tableVehicleLookup.get(vehicleNumber);


      if (!masterVehicle) {
        continue;
      }


      /* ------------------------------------------------------
         ZONE

         vehicle_master is the source of truth.
         ------------------------------------------------------ */

      const zoneValue =
        masterVehicle.zone ?? "Unknown";

      const zoneName =
        String(zoneValue);


      const zoneKey =
        String(
          masterVehicle.zone ?? "UNKNOWN"
        );


      /* ------------------------------------------------------
         CREATE ZONE
         ------------------------------------------------------ */

      if (!zoneMap.has(zoneKey)) {
        zoneMap.set(zoneKey, {
          zoneId: masterVehicle.zone,
          zoneName,
          wasteGenerated: 0,
          vehicles: new Set(),
        });
      }


      const zoneData =
        zoneMap.get(zoneKey);


      /* ------------------------------------------------------
         WEIGHT

         Same weight calculation:

         wetweight
         +
         dryweight
         +
         otherweight
         ------------------------------------------------------ */

      const wetWeight =
        Number(row.wetweight || 0);

      const dryWeight =
        Number(row.dryweight || 0);

      const otherWeight =
        Number(row.otherweight || 0);


      const totalWeight =
        wetWeight +
        dryWeight +
        otherWeight;


      if (!Number.isFinite(totalWeight)) {
        continue;
      }


      /* ------------------------------------------------------
         ADD TO ZONE
         ------------------------------------------------------ */

      zoneData.wasteGenerated +=
        totalWeight;


      zoneData.vehicles.add(
        vehicleNumber
      );
    }
  }


  /* ----------------------------------------------------------
     NO TELEMETRY DATA
     ---------------------------------------------------------- */

  if (zoneMap.size === 0) {
    return {
      message:
        `No telemetry weight data found for ${date}`,
      data: [],
    };
  }


  /* ----------------------------------------------------------
     BUILD FINAL GRAPH DATA
     ---------------------------------------------------------- */

  const graphData = [];


  for (const zoneData of zoneMap.values()) {
    const vehiclesRunning =
      zoneData.vehicles.size;


    const wasteGenerated =
      Number(
        zoneData.wasteGenerated.toFixed(2)
      );


    /*
     * Average waste per running vehicle.
     */

    const averageWaste =
      vehiclesRunning > 0
        ? Number(
            (
              wasteGenerated /
              vehiclesRunning
            ).toFixed(2)
          )
        : 0;


    graphData.push({
      zoneId:
        zoneData.zoneId,

      zoneName:
        zoneData.zoneName,

      wasteGenerated,

      vehiclesRunning,

      averageWaste,
    });
  }


  /* ----------------------------------------------------------
     SORT ZONES
     ---------------------------------------------------------- */

  graphData.sort((a, b) =>
    String(a.zoneName).localeCompare(
      String(b.zoneName)
    )
  );


  /* ----------------------------------------------------------
     FINAL RESPONSE
     ---------------------------------------------------------- */

  return {
    message:
      "Average weight graph data fetched successfully",

    data:
      graphData,
  };
};


module.exports = {
  getAverageWeightGraph,
};