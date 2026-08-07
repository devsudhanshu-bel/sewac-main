require("./src/config/loadEnv");

const tableManager = require("./src/telemetry/managers/TableManager");

(async () => {
    try {

        console.log("Creating Vehicle Table...");

        const table = await tableManager.ensureVehicleTable(
            "KA01AB1234"
        );

        console.log("SUCCESS");
        console.log(table);

    } catch (err) {

        console.error(err);

    } finally {

        process.exit();

    }
})();