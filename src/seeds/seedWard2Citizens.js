const helperPrisma =
  require("../config/helperPrisma");


// =====================================================
// WARD 2 CITIZEN SIMULATION SEED
// =====================================================

const TOTAL_CITIZENS = 1000;

const WARD = "2";

const CITY = "Bangalore";

const AREA_PREFIX =
  "Zone A - Division 1 - Ward 2";

const BATCH_SIZE = 100;


// =====================================================
// SYNTHETIC NAMES
// =====================================================

const firstNames = [
  "Aarav",
  "Vihaan",
  "Aditya",
  "Arjun",
  "Rohan",
  "Rahul",
  "Karthik",
  "Vikram",
  "Akash",
  "Siddharth",

  "Ananya",
  "Aadhya",
  "Diya",
  "Ishita",
  "Kavya",
  "Meera",
  "Sneha",
  "Pooja",
  "Riya",
  "Nandini",

  "Sanjay",
  "Manoj",
  "Suresh",
  "Mahesh",
  "Prakash",
  "Ramesh",
  "Ganesh",
  "Dinesh",
  "Nikhil",
  "Varun",

  "Priya",
  "Divya",
  "Swathi",
  "Shreya",
  "Keerthi",
  "Lakshmi",
  "Deepa",
  "Asha",
  "Pallavi",
  "Bhavana",
];


const lastNames = [
  "Kumar",
  "Sharma",
  "Reddy",
  "Shetty",
  "Gowda",
  "Rao",
  "Patil",
  "Naik",
  "Joshi",
  "Nair",

  "Iyer",
  "Menon",
  "Pillai",
  "Bhat",
  "Hegde",
  "Desai",
  "Kulkarni",
  "Verma",
  "Singh",
  "Das",
];


const householdTypes = [
  "Owner",
  "Tenant",
];


const wasteGeneratorTypes = [
  "Individual HHs",
];


// =====================================================
// HELPERS
// =====================================================

function pad(
  value,
  length
) {

  return String(
    value
  ).padStart(
    length,
    "0"
  );

}


// =====================================================
// NAME
// =====================================================

function generateName(
  index
) {

  const firstName =
    firstNames[
      index %
      firstNames.length
    ];

  const lastName =
    lastNames[
      Math.floor(
        index /
        firstNames.length
      ) %
      lastNames.length
    ];

  return `${firstName} ${lastName}`;

}


// =====================================================
// PHONE
// =====================================================

function generatePhone(
  index
) {

  return `701${pad(
    index + 1,
    7
  )}`;

}


// =====================================================
// CONTACT
// =====================================================

function generateContact(
  index
) {

  return `801${pad(
    index + 1,
    7
  )}`;

}


// =====================================================
// DRY RFID
// =====================================================

function generateDryRFID(
  index
) {

  const sequence =
    (index + 1)
      .toString(16)
      .toUpperCase()
      .padStart(
        10,
        "0"
      );

  return `E2004702A000${sequence}`;

}


// =====================================================
// WET RFID
// =====================================================

function generateWetRFID(
  index
) {

  const sequence =
    (index + 1)
      .toString(16)
      .toUpperCase()
      .padStart(
        10,
        "0"
      );

  return `E2004702B000${sequence}`;

}


// =====================================================
// DRY SERIAL
// =====================================================

function generateDrySln(
  index
) {

  return `W2-D-${pad(
    index + 1,
    6
  )}`;

}


// =====================================================
// WET SERIAL
// =====================================================

function generateWetSln(
  index
) {

  return `W2-W-${pad(
    index + 1,
    6
  )}`;

}


// =====================================================
// HOUSE NUMBER
// =====================================================

function generateHouseNumber(
  index
) {

  const block =
    Math.floor(
      index / 50
    ) + 1;

  const house =
    (index % 50) + 1;

  return `${block}-${pad(
    house,
    2
  )}`;

}


// =====================================================
// FLOOR
// =====================================================

function generateFloorNumber(
  index
) {

  const floors = [
    "Ground floor",
    "1st Floor",
    "2nd Floor",
    "3rd Floor",
  ];

  return floors[
    index %
    floors.length
  ];

}


// =====================================================
// PEOPLE
// =====================================================

function generateNumberOfPeople(
  index
) {

  const values = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
  ];

  return values[
    index %
    values.length
  ];

}


// =====================================================
// AREA
// =====================================================

function generateArea(
  index
) {

  const block =
    Math.floor(
      index / 100
    ) + 1;

  return `${AREA_PREFIX} - Block ${block}`;

}


// =====================================================
// WARD 2 LATITUDE
// =====================================================
//
// IMPORTANT:
//
// PostgreSQL column type:
// lat -> numeric
//
// Number(...) ensures we send a numeric value,
// not the string returned by toFixed().
// =====================================================

function generateLatitude(
  index
) {

  const row =
    Math.floor(
      index / 25
    );

  const offset =
    index % 25;

  return Number(
    (
      12.897500 +
      row * 0.00015 +
      offset * 0.000002
    ).toFixed(8)
  );

}


// =====================================================
// WARD 2 LONGITUDE
// =====================================================
//
// PostgreSQL column type:
// lng -> numeric
// =====================================================

function generateLongitude(
  index
) {

  const row =
    Math.floor(
      index / 25
    );

  const offset =
    index % 25;

  return Number(
    (
      77.597500 +
      offset * 0.00015 +
      row * 0.000002
    ).toFixed(8)
  );

}


// =====================================================
// BUILD CITIZEN
// =====================================================

function buildCitizen(
  index
) {

  const now =
    new Date();

  return {

    phoneNumber:
      generatePhone(
        index
      ),

    city:
      CITY,

    ward:
      WARD,

    area:
      generateArea(
        index
      ),

    wasteGeneratorTypes:
      wasteGeneratorTypes[
        index %
        wasteGeneratorTypes.length
      ],

    houseNumber:
      generateHouseNumber(
        index
      ),

    floorNumber:
      generateFloorNumber(
        index
      ),

    householdType:
      householdTypes[
        index %
        householdTypes.length
      ],

    personName:
      generateName(
        index
      ),

    contactNumber:
      generateContact(
        index
      ),

    numberOfPeople:
      generateNumberOfPeople(
        index
      ),

    buildingPhoto:
      null,

    createdAt:
      now,

    updatedAt:
      now,

    dryRFID:
      generateDryRFID(
        index
      ),

    drySlno:
      generateDrySln(
        index
      ),

    wetRFID:
      generateWetRFID(
        index
      ),

    wetSlno:
      generateWetSln(
        index
      ),

    lat:
      generateLatitude(
        index
      ),

    lng:
      generateLongitude(
        index
      ),

  };

}


// =====================================================
// BULK INSERT
// =====================================================
//
// One SQL query per 100 citizens.
//
// This avoids Prisma's 5-second interactive
// transaction timeout.
// =====================================================

async function insertBatch(
  citizens
) {

  if (
    citizens.length === 0
  ) {

    return;

  }


  const values = [];

  const placeholders = [];


  for (
    let i = 0;
    i < citizens.length;
    i++
  ) {

    const citizen =
      citizens[i];

    const base =
      i * 20;


    placeholders.push(
      `(
        $${base + 1},
        $${base + 2},
        $${base + 3},
        $${base + 4},
        $${base + 5},
        $${base + 6},
        $${base + 7},
        $${base + 8},
        $${base + 9},
        $${base + 10},
        $${base + 11},
        $${base + 12},
        $${base + 13},
        $${base + 14},
        $${base + 15},
        $${base + 16},
        $${base + 17},
        $${base + 18},
        $${base + 19},
        $${base + 20}
      )`
    );


    values.push(

      citizen.phoneNumber,

      citizen.city,

      citizen.ward,

      citizen.area,

      citizen.wasteGeneratorTypes,

      citizen.houseNumber,

      citizen.floorNumber,

      citizen.householdType,

      citizen.personName,

      citizen.contactNumber,

      citizen.numberOfPeople,

      citizen.buildingPhoto,

      citizen.createdAt,

      citizen.updatedAt,

      citizen.dryRFID,

      citizen.drySlno,

      citizen.wetRFID,

      citizen.wetSlno,

      citizen.lat,

      citizen.lng

    );

  }


  const query = `

    INSERT INTO "master_citizen_data"
    (
      "phoneNumber",
      "city",
      "ward",
      "area",
      "wasteGeneratorTypes",
      "houseNumber",
      "floorNumber",
      "householdType",
      "personName",
      "contactNumber",
      "numberOfPeople",
      "buildingPhoto",
      "createdAt",
      "updatedAt",
      "dryRFID",
      "drySlno",
      "wetRFID",
      "wetSlno",
      "lat",
      "lng"
    )

    VALUES

    ${placeholders.join(",")}

  `;


  await helperPrisma.$executeRawUnsafe(
    query,
    ...values
  );

}


// =====================================================
// SEED
// =====================================================

async function seed() {

  console.log("");

  console.log(
    "================================================="
  );

  console.log(
    "SEWAC WARD 2 CITIZEN SIMULATION SEED"
  );

  console.log(
    "================================================="
  );

  console.log("");

  console.log(
    `Generating ${TOTAL_CITIZENS} synthetic citizens...`
  );

  console.log(
    `City : ${CITY}`
  );

  console.log(
    `Ward : ${WARD}`
  );

  console.log("");


  // =================================================
  // GENERATE CITIZENS
  // =================================================

  const citizens = [];


  for (
    let i = 0;
    i < TOTAL_CITIZENS;
    i++
  ) {

    citizens.push(
      buildCitizen(
        i
      )
    );

  }


  console.log(
    `Generated citizens: ${citizens.length}`
  );


  // =================================================
  // INSERT
  // =================================================

  let inserted = 0;


  for (
    let i = 0;
    i < citizens.length;
    i += BATCH_SIZE
  ) {

    const batch =
      citizens.slice(
        i,
        i + BATCH_SIZE
      );


    await insertBatch(
      batch
    );


    inserted +=
      batch.length;


    console.log(
      `Inserted ${inserted}/${TOTAL_CITIZENS}`
    );

  }


  // =================================================
  // VERIFY
  // =================================================

  const countResult =
    await helperPrisma.$queryRaw`

      SELECT
        COUNT(*)::int AS count

      FROM "master_citizen_data"

      WHERE "ward" = ${WARD}

    `;


  console.log("");

  console.log(
    "================================================="
  );

  console.log(
    "WARD 2 SEED COMPLETED"
  );

  console.log(
    "================================================="
  );

  console.log("");

  console.log(
    "Ward:",
    WARD
  );

  console.log(
    "Expected:",
    TOTAL_CITIZENS
  );

  console.log(
    "Ward 2 citizens:",
    countResult[0]?.count
  );

  console.log("");

}


// =====================================================
// EXECUTE
// =====================================================

seed()

  .catch(
    (error) => {

      console.error("");

      console.error(
        "WARD 2 SEED FAILED"
      );

      console.error(
        error
      );

      process.exit(
        1
      );

    }
  )

  .finally(
    async () => {

      await helperPrisma.$disconnect();

    }
  );