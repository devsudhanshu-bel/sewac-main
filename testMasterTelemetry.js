require("./src/config/loadEnv");

const initializeTelemetryDB = require("./src/telemetry/initialize/initializeTelemetryDB");
const telemetryPipelineService = require("./src/telemetry/services/TelemetryPipelineService");

(async () => {
  try {
    await initializeTelemetryDB.initialize();

    await telemetryPipelineService.process({

      // =====================================================
      // TIMESTAMPS
      // =====================================================

      iotTimestamp: new Date(),

      receivedTimestamp: new Date(),


      // =====================================================
      // CITIZEN / RFID
      // =====================================================

      rfidEpc: "E200470600106026083B0113",

      citizenId: 1,

      citizenContact: "9876543210",


      // =====================================================
      // WASTE
      // =====================================================

      wasteType: "WET",

      wetWeight: 5,

      dryWeight: 2,

      otherWeight: 0,

      cumulativeWeight: 7,


      // =====================================================
      // GPS
      // =====================================================
      //
      // Ward 101 - Test Ward A11
      //
      // Bangalore
      //   ↓
      // Test Zone A
      //   ↓
      // Test Division A1
      //   ↓
      // Ward 101
      //
      // =====================================================

      latitude: 12.8975,

      longitude: 77.5875,


      // =====================================================
      // VEHICLE
      // =====================================================

      vehicleNumber: "KA01AB1234",

      driverName: "Rajesh",

      unitNumber: "UNIT001",

      firmwareVersion: "1.0.0",


      // =====================================================
      // COLLECTION
      // =====================================================

      collectionType: "Door",

      remarks: "OK",

      errorCode: null,

      driverAction: "Collected"

    });

    console.log("");
    console.log("==================================");
    console.log("TEST PASSED");
    console.log("==================================");

  } catch (err) {

    console.error("");
    console.error("==================================");
    console.error("TEST FAILED");
    console.error("==================================");
    console.error(err);

  } finally {

    process.exit();

  }
})();