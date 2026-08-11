require("dotenv").config();

const helperPrisma =
  require("./config/helperPrisma");

async function test() {

  try {

    console.log(
      "Testing helper database connection..."
    );

    const result =
      await helperPrisma.$queryRaw`
        SELECT
          current_database() AS database,
          current_user AS username,
          NOW() AS server_time
      `;

    console.log("");

    console.log(
      "HELPER DATABASE CONNECTION SUCCESS"
    );

    console.log(
      result
    );

  } catch (error) {

    console.error("");

    console.error(
      "HELPER DATABASE CONNECTION FAILED"
    );

    console.error(
      error
    );

  } finally {

    await helperPrisma.$disconnect();

  }

}

test();