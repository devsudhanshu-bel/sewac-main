/*
|--------------------------------------------------------------------------
| CITIZEN MAP WORKER
|--------------------------------------------------------------------------
|
| IMPORTANT:
|
| The Citizen backend does NOT own telemetry.
|
| Live telemetry synchronization is handled by the
| Admin backend.
|
| Therefore this worker is intentionally disabled.
|
| The previous worker attempted:
|
| mapService.syncLiveLocations()
|
| every 2 seconds.
|
| That caused:
|
| TypeError: mapService.syncLiveLocations is not a function
|
| and was also unnecessary because the Citizen backend
| obtains live locations from the Admin backend.
|--------------------------------------------------------------------------
*/

class MapWorker {
  constructor() {
    this.interval = null;

    this.isRunning = false;
  }

  /*
  |--------------------------------------------------------------------------
  | START
  |--------------------------------------------------------------------------
  */

  start() {
    /*
     * Do NOT start a telemetry polling loop
     * inside the Citizen backend.
     */

    if (this.interval) {
      console.log("⚠️ Citizen Map Worker is already running.");

      return;
    }

    console.log("ℹ️ Citizen Map Worker disabled.");

    console.log(
      "ℹ️ Live telemetry synchronization is handled by the Admin backend.",
    );

    /*
     * Keep interval null intentionally.
     */
    this.interval = null;

    this.isRunning = false;
  }

  /*
  |--------------------------------------------------------------------------
  | STOP
  |--------------------------------------------------------------------------
  */

  stop() {
    if (this.interval) {
      clearInterval(this.interval);

      this.interval = null;
    }

    this.isRunning = false;

    console.log("🛑 Citizen Map Worker stopped.");
  }
}

export default new MapWorker();
