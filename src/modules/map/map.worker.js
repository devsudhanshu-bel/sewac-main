import mapService from "./map.service.js";

class MapWorker {
  interval = null;

  isRunning = false;

  start() {
    if (this.interval) {
      console.log("⚠️ Map Worker is already running.");
      return;
    }

    console.log("🚛 Map Worker Started");
    console.log("⏱️ Polling vehicle telemetry every 2 seconds...");

    this.interval = setInterval(async () => {
      if (this.isRunning) {
        return;
      }

      this.isRunning = true;

      try {
        console.log("🔄 Checking for latest telemetry...");

        await mapService.syncLiveLocations();
      } catch (error) {
        console.error("❌ Map Worker Error:");
        console.error(error);
      } finally {
        this.isRunning = false;
      }
    }, 2000);
  }

  stop() {
    if (!this.interval) {
      console.log("⚠️ Map Worker is not running.");
      return;
    }

    clearInterval(this.interval);

    this.interval = null;
    this.isRunning = false;

    console.log("🛑 Map Worker Stopped");
  }
}

export default new MapWorker();