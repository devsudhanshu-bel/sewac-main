const cron = require("node-cron");

const service =
  require("../services/masterCitizenSync.service");

// =====================================================
// MASTER CITIZEN WEEKLY SYNC
// =====================================================
//
// Runs automatically once every week.
//
// Schedule:
// Every Sunday at 2:00 AM
//
// Timezone:
// Asia/Kolkata (IST)
//
// Cron:
// 0 2 * * 0
//
// =====================================================

let syncRunning = false;

// =====================================================
// START WEEKLY SYNC
// =====================================================

function startMasterCitizenWeeklySync() {
  console.log(
    "================================================="
  );

  console.log(
    "MASTER CITIZEN WEEKLY SYNC SCHEDULER STARTED"
  );

  console.log(
    "Schedule: Every Sunday at 2:00 AM IST"
  );

  console.log(
    "================================================="
  );

  cron.schedule(
    "0 2 * * 0",

    async () => {
      // ------------------------------------------------
      // PREVENT OVERLAPPING SYNCS
      // ------------------------------------------------

      if (syncRunning) {
        console.warn(
          "Master Citizen sync already running. Skipping this scheduled run."
        );

        return;
      }

      syncRunning = true;

      const startedAt =
        Date.now();

      console.log(
        "================================================="
      );

      console.log(
        "AUTOMATIC MASTER CITIZEN WEEKLY SYNC STARTED"
      );

      console.log(
        `Started at: ${new Date().toISOString()}`
      );

      console.log(
        "================================================="
      );

      try {
        const result =
          await service.syncAllCitizens();

        console.log(
          "================================================="
        );

        console.log(
          "AUTOMATIC MASTER CITIZEN WEEKLY SYNC COMPLETED"
        );

        console.log(
          `Source records: ${result.sourceRecords}`
        );

        console.log(
          `Processed: ${result.processed}`
        );

        console.log(
          `Inserted / Updated: ${result.insertedOrUpdated}`
        );

        console.log(
          `Unmatched wards: ${result.unmatchedWard}`
        );

        console.log(
          `Failed: ${result.failed}`
        );

        console.log(
          `Batches: ${result.batches}`
        );

        console.log(
          `Sync duration: ${result.durationMs} ms`
        );

        console.log(
          `Total duration: ${Date.now() - startedAt} ms`
        );

        console.log(
          "================================================="
        );

      } catch (error) {
        console.error(
          "================================================="
        );

        console.error(
          "AUTOMATIC MASTER CITIZEN WEEKLY SYNC FAILED"
        );

        console.error(
          error
        );

        console.error(
          "================================================="
        );

      } finally {
        syncRunning = false;
      }
    },

    {
      timezone: "Asia/Kolkata",
    }
  );
}

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  startMasterCitizenWeeklySync,
};