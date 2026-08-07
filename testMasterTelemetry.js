require("./src/config/loadEnv");

const initializeTelemetryDB = require("./src/telemetry/initialize/initializeTelemetryDB");
const telemetryPipelineService=require("./src/telemetry/services/TelemetryPipelineService");

(async () => {

    try {

        await initializeTelemetryDB.initialize();

        await telemetryPipelineService.process({

            iotTimestamp: new Date(),

            receivedTimestamp: new Date(),

            rfidEpc: "300833B2DDD9014000000001",

            citizenId: 1,

            wasteType: "WET",

            latitude: 12.971598,

            longitude: 77.594566,

            wetWeight: 5,

            dryWeight: 2,

            otherWeight: 0,

            cumulativeWeight: 7,

            driverName: "Rajesh",

            vehicleNumber: "KA01AB1234",

            firmwareVersion: "1.0.0",

            unitNumber: "UNIT001",

            collectionType: "Door",

            remarks: "OK",

            errorCode: null,

            citizenContact: "9876543210",

            driverAction: "Collected"

        });

        console.log("TEST PASSED");

    } catch (err) {

        console.error(err);

    } finally {

        process.exit();

    }

})();