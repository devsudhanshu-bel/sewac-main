const { PrismaClient } = require("../../generated/telemetry");

const telemetryDb = new PrismaClient({
    log: ["error"],
});

module.exports = telemetryDb;