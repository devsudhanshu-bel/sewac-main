const telemetryDb = require("../../config/telemetryDb");
const masterTelemetryService = require("./MasterTelemetryService");

class TelemetryPipelineService {
  async process(packet) {
    return await telemetryDb.$transaction(
      async (tx) => {
        console.log("");
        console.log("========================================");
        console.log("STARTING TELEMETRY PIPELINE");
        console.log("========================================");

        const result = await masterTelemetryService.processPacket(tx, packet);

        console.log("");
        console.log("PIPELINE COMPLETED");

        return result;
      },

      {
        maxWait: 10000,
        timeout: 30000,
      },
    );
  }
}

module.exports = new TelemetryPipelineService();
