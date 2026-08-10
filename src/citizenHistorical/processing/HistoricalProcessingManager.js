const citizenHistoricalPrisma =
  require("../../config/citizenHistoricalPrisma");


// =====================================================
// CITIZEN HISTORICAL PROCESSING MANAGER
// =====================================================
//
// Manages the state of the daily historical
// processing pipeline.
//
// IMPORTANT:
//
// This is NOT telemetry data.
//
// This is ONLY processing metadata.
//
// It allows the historical worker to:
//
// - know which day is being processed
// - know whether processing is running
// - know how many records were processed
// - resume after failure
// - prevent duplicate processing
// - track failed records
//
// =====================================================


class HistoricalProcessingManager {


  // ===================================================
  // DATE NORMALIZER
  // ===================================================

  normalizeProcessingDate(
    processingDate
  ) {

    // -----------------------------------------------
    // STRING
    // -----------------------------------------------

    if (
      typeof processingDate === "string"
    ) {

      const value =
        processingDate.trim();


      // Already YYYY-MM-DD

      if (
        /^\d{4}-\d{2}-\d{2}$/.test(
          value
        )
      ) {

        return value;

      }


      const parsed =
        new Date(value);


      if (
        Number.isNaN(
          parsed.getTime()
        )
      ) {

        throw new Error(
          `Invalid processing date: ${processingDate}`
        );

      }


      return this.formatDate(
        parsed
      );

    }


    // -----------------------------------------------
    // JAVASCRIPT DATE
    // -----------------------------------------------

    if (
      processingDate instanceof Date
    ) {

      if (
        Number.isNaN(
          processingDate.getTime()
        )
      ) {

        throw new Error(
          "Invalid processing Date object"
        );

      }


      return this.formatDate(
        processingDate
      );

    }


    // -----------------------------------------------
    // INVALID
    // -----------------------------------------------

    throw new Error(
      `Invalid processing date: ${processingDate}`
    );

  }


  // ===================================================
  // FORMAT JS DATE
  // ===================================================

  formatDate(
    date
  ) {

    const year =
      date.getFullYear();


    const month =
      String(
        date.getMonth() + 1
      ).padStart(
        2,
        "0"
      );


    const day =
      String(
        date.getDate()
      ).padStart(
        2,
        "0"
      );


    return `${year}-${month}-${day}`;

  }


  // ===================================================
  // CREATE PROCESSING TABLES
  // ===================================================

  async initialize() {

    console.log(
      "Initializing historical processing tables..."
    );


    // =================================================
    // PROCESSING JOBS
    // =================================================

    await citizenHistoricalPrisma
      .$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS
        historical_processing_jobs (

          job_id BIGSERIAL PRIMARY KEY,

          processing_date DATE NOT NULL,

          status VARCHAR(30) NOT NULL
            DEFAULT 'PENDING',

          started_at TIMESTAMP(6),

          completed_at TIMESTAMP(6),

          last_heartbeat_at TIMESTAMP(6),

          total_vehicles INTEGER
            DEFAULT 0,

          total_records BIGINT
            DEFAULT 0,

          processed_records BIGINT
            DEFAULT 0,

          failed_records BIGINT
            DEFAULT 0,

          skipped_records BIGINT
            DEFAULT 0,

          created_at TIMESTAMP(6)
            DEFAULT CURRENT_TIMESTAMP,

          updated_at TIMESTAMP(6)
            DEFAULT CURRENT_TIMESTAMP,

          CONSTRAINT
            historical_processing_jobs_date_unique
            UNIQUE (processing_date)

        )
      `);


    // =================================================
    // PROCESSING RECORDS
    // =================================================

    await citizenHistoricalPrisma
      .$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS
        historical_processing_records (

          processing_record_id BIGSERIAL PRIMARY KEY,

          job_id BIGINT NOT NULL,

          vehicle_table_name VARCHAR(150) NOT NULL,

          telemetry_id BIGINT NOT NULL,

          status VARCHAR(30) NOT NULL
            DEFAULT 'PENDING',

          attempts INTEGER NOT NULL
            DEFAULT 0,

          started_at TIMESTAMP(6),

          processed_at TIMESTAMP(6),

          failed_at TIMESTAMP(6),

          error_message TEXT,

          historical_table_name VARCHAR(150),

          created_at TIMESTAMP(6)
            DEFAULT CURRENT_TIMESTAMP,

          updated_at TIMESTAMP(6)
            DEFAULT CURRENT_TIMESTAMP,

          CONSTRAINT
            historical_processing_records_unique
            UNIQUE (
              job_id,
              vehicle_table_name,
              telemetry_id
            ),

          CONSTRAINT
            historical_processing_records_job_fk
            FOREIGN KEY (job_id)
            REFERENCES historical_processing_jobs(job_id)
            ON DELETE CASCADE

        )
      `);


    // =================================================
    // INDEXES
    // =================================================

    await citizenHistoricalPrisma
      .$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS
        historical_processing_jobs_status_idx

        ON historical_processing_jobs
        (status)
      `);


    await citizenHistoricalPrisma
      .$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS
        historical_processing_records_job_idx

        ON historical_processing_records
        (job_id)
      `);


    await citizenHistoricalPrisma
      .$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS
        historical_processing_records_status_idx

        ON historical_processing_records
        (status)
      `);


    await citizenHistoricalPrisma
      .$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS
        historical_processing_records_vehicle_idx

        ON historical_processing_records
        (vehicle_table_name)
      `);


    console.log(
      "Historical processing tables initialized."
    );

  }


  // ===================================================
  // GET JOB BY DATE
  // ===================================================

  async getJobByDate(
    processingDate
  ) {

    const normalizedDate =
      this.normalizeProcessingDate(
        processingDate
      );


    const result =
      await citizenHistoricalPrisma
        .$queryRawUnsafe(
          `
          SELECT *

          FROM historical_processing_jobs

          WHERE processing_date =
                $1::date

          LIMIT 1
          `,
          normalizedDate
        );


    return result[0] || null;

  }


  // ===================================================
  // CREATE JOB
  // ===================================================

  async createJob(
    processingDate
  ) {

    const normalizedDate =
      this.normalizeProcessingDate(
        processingDate
      );


    const result =
      await citizenHistoricalPrisma
        .$queryRawUnsafe(
          `
          INSERT INTO
          historical_processing_jobs
          (
            processing_date,
            status
          )

          VALUES
          (
            $1::date,
            'PENDING'
          )

          ON CONFLICT (
            processing_date
          )

          DO NOTHING

          RETURNING *
          `,
          normalizedDate
        );


    // -----------------------------------------------
    // Another process may have created it.
    // -----------------------------------------------

    if (
      !result.length
    ) {

      return await this.getJobByDate(
        normalizedDate
      );

    }


    return result[0];

  }


  // ===================================================
  // RESET FAILED JOB FOR RETRY
  // ===================================================
  //
  // IMPORTANT:
  //
  // We DO NOT delete the job.
  //
  // We DO NOT delete historical telemetry.
  //
  // We DO NOT delete successfully processed records.
  //
  // We only reset the job's aggregate counters and
  // put previously FAILED / PROCESSING records back
  // into PENDING state.
  //
  // Already PROCESSED records remain PROCESSED.
  //
  // ===================================================

  async resetFailedJobForRetry(
    jobId
  ) {

    console.log(
      "Resetting failed historical job for retry:",
      jobId?.toString
        ? jobId.toString()
        : jobId
    );


    // =================================================
    // RESET JOB
    // =================================================

    const jobResult =
      await citizenHistoricalPrisma
        .$queryRawUnsafe(
          `
          UPDATE historical_processing_jobs

          SET

            status = 'PENDING',

            started_at = NULL,

            completed_at = NULL,

            last_heartbeat_at = NULL,

            total_vehicles = 0,

            total_records = 0,

            processed_records = 0,

            failed_records = 0,

            skipped_records = 0,

            updated_at =
              CURRENT_TIMESTAMP

          WHERE job_id = $1

          AND status = 'FAILED'

          RETURNING *
          `,
          jobId
        );


    // =================================================
    // RESET FAILED RECORDS
    // =================================================
    //
    // A record that failed before should be retried.
    //
    // attempts is intentionally preserved.
    //
    // =================================================

    await citizenHistoricalPrisma
      .$executeRawUnsafe(
        `
        UPDATE historical_processing_records

        SET

          status = 'PENDING',

          started_at = NULL,

          failed_at = NULL,

          error_message = NULL,

          updated_at =
            CURRENT_TIMESTAMP

        WHERE job_id = $1

        AND status IN (
          'FAILED',
          'PROCESSING'
        )
        `,
        jobId
      );


    if (
      jobResult.length
    ) {

      console.log(
        "Historical job reset successfully."
      );


      return jobResult[0];

    }


    return await this.getJobById(
      jobId
    );

  }


  // ===================================================
  // GET JOB BY ID
  // ===================================================

  async getJobById(
    jobId
  ) {

    const result =
      await citizenHistoricalPrisma
        .$queryRawUnsafe(
          `
          SELECT *

          FROM historical_processing_jobs

          WHERE job_id = $1

          LIMIT 1
          `,
          jobId
        );


    return result[0] || null;

  }


  // ===================================================
  // GET OR CREATE JOB
  // ===================================================
  //
  // IMPORTANT:
  //
  // If the existing job is FAILED:
  //
  //     reset it
  //     ↓
  //     retry it
  //
  // If it is COMPLETED:
  //
  //     return it untouched
  //
  // If it is RUNNING:
  //
  //     return it untouched
  //
  // ===================================================

  async getOrCreateJob(
    processingDate
  ) {

    const normalizedDate =
      this.normalizeProcessingDate(
        processingDate
      );


    let existing =
      await this.getJobByDate(
        normalizedDate
      );


    // -----------------------------------------------
    // NO JOB
    // -----------------------------------------------

    if (
      !existing
    ) {

      return await this.createJob(
        normalizedDate
      );

    }


    // -----------------------------------------------
    // COMPLETED
    // -----------------------------------------------

    if (
      existing.status ===
      "COMPLETED"
    ) {

      console.log(
        "Historical job already completed."
      );


      return existing;

    }


    // -----------------------------------------------
    // FAILED
    // -----------------------------------------------

    if (
      existing.status ===
      "FAILED"
    ) {

      existing =
        await this.resetFailedJobForRetry(
          existing.job_id
        );


      return existing;

    }


    // -----------------------------------------------
    // RUNNING
    // -----------------------------------------------

    if (
      existing.status ===
      "RUNNING"
    ) {

      console.log(
        "Historical job is already RUNNING."
      );


      return existing;

    }


    // -----------------------------------------------
    // PENDING
    // -----------------------------------------------

    return existing;

  }


  // ===================================================
  // START JOB
  // ===================================================

  async startJob(
    jobId
  ) {

    const result =
      await citizenHistoricalPrisma
        .$queryRawUnsafe(
          `
          UPDATE historical_processing_jobs

          SET

            status = 'RUNNING',

            started_at =
              COALESCE(
                started_at,
                CURRENT_TIMESTAMP
              ),

            completed_at = NULL,

            last_heartbeat_at =
              CURRENT_TIMESTAMP,

            updated_at =
              CURRENT_TIMESTAMP

          WHERE job_id = $1

          RETURNING *
          `,
          jobId
        );


    return result[0] || null;

  }


  // ===================================================
  // HEARTBEAT
  // ===================================================

  async heartbeat(
    jobId
  ) {

    await citizenHistoricalPrisma
      .$executeRawUnsafe(
        `
        UPDATE historical_processing_jobs

        SET

          last_heartbeat_at =
            CURRENT_TIMESTAMP,

          updated_at =
            CURRENT_TIMESTAMP

        WHERE job_id = $1
        `,
        jobId
      );

  }


  // ===================================================
  // UPDATE VEHICLE COUNT
  // ===================================================

  async updateVehicleCount(
    jobId,
    totalVehicles
  ) {

    await citizenHistoricalPrisma
      .$executeRawUnsafe(
        `
        UPDATE historical_processing_jobs

        SET

          total_vehicles = $1,

          updated_at =
            CURRENT_TIMESTAMP

        WHERE job_id = $2
        `,
        totalVehicles,
        jobId
      );

  }


  // ===================================================
  // UPDATE TOTAL RECORD COUNT
  // ===================================================

  async updateTotalRecords(
    jobId,
    totalRecords
  ) {

    await citizenHistoricalPrisma
      .$executeRawUnsafe(
        `
        UPDATE historical_processing_jobs

        SET

          total_records = $1,

          updated_at =
            CURRENT_TIMESTAMP

        WHERE job_id = $2
        `,
        totalRecords,
        jobId
      );

  }


  // ===================================================
  // COMPLETE JOB
  // ===================================================

  async completeJob(
    jobId
  ) {

    const result =
      await citizenHistoricalPrisma
        .$queryRawUnsafe(
          `
          UPDATE historical_processing_jobs

          SET

            status = 'COMPLETED',

            completed_at =
              CURRENT_TIMESTAMP,

            last_heartbeat_at =
              CURRENT_TIMESTAMP,

            updated_at =
              CURRENT_TIMESTAMP

          WHERE job_id = $1

          RETURNING *
          `,
          jobId
        );


    return result[0] || null;

  }


  // ===================================================
  // FAIL JOB
  // ===================================================

  async failJob(
    jobId
  ) {

    const result =
      await citizenHistoricalPrisma
        .$queryRawUnsafe(
          `
          UPDATE historical_processing_jobs

          SET

            status = 'FAILED',

            completed_at = NULL,

            last_heartbeat_at =
              CURRENT_TIMESTAMP,

            updated_at =
              CURRENT_TIMESTAMP

          WHERE job_id = $1

          RETURNING *
          `,
          jobId
        );


    return result[0] || null;

  }


  // ===================================================
  // INCREMENT PROCESSED
  // ===================================================

  async incrementProcessed(
    jobId
  ) {

    await citizenHistoricalPrisma
      .$executeRawUnsafe(
        `
        UPDATE historical_processing_jobs

        SET

          processed_records =
            processed_records + 1,

          updated_at =
            CURRENT_TIMESTAMP

        WHERE job_id = $1
        `,
        jobId
      );

  }


  // ===================================================
  // INCREMENT FAILED
  // ===================================================

  async incrementFailed(
    jobId
  ) {

    await citizenHistoricalPrisma
      .$executeRawUnsafe(
        `
        UPDATE historical_processing_jobs

        SET

          failed_records =
            failed_records + 1,

          updated_at =
            CURRENT_TIMESTAMP

        WHERE job_id = $1
        `,
        jobId
      );

  }


  // ===================================================
  // INCREMENT SKIPPED
  // ===================================================

  async incrementSkipped(
    jobId
  ) {

    await citizenHistoricalPrisma
      .$executeRawUnsafe(
        `
        UPDATE historical_processing_jobs

        SET

          skipped_records =
            skipped_records + 1,

          updated_at =
            CURRENT_TIMESTAMP

        WHERE job_id = $1
        `,
        jobId
      );

  }


  // ===================================================
  // REGISTER TELEMETRY RECORD
  // ===================================================

  async registerRecord(
    jobId,
    vehicleTableName,
    telemetryId
  ) {

    const result =
      await citizenHistoricalPrisma
        .$queryRawUnsafe(
          `
          INSERT INTO
          historical_processing_records
          (
            job_id,
            vehicle_table_name,
            telemetry_id,
            status
          )

          VALUES
          (
            $1,
            $2,
            $3,
            'PENDING'
          )

          ON CONFLICT
          (
            job_id,
            vehicle_table_name,
            telemetry_id
          )

          DO NOTHING

          RETURNING *
          `,

          jobId,

          vehicleTableName,

          telemetryId
        );


    // -----------------------------------------------
    // NEW RECORD
    // -----------------------------------------------

    if (
      result.length
    ) {

      return result[0];

    }


    // -----------------------------------------------
    // EXISTING RECORD
    // -----------------------------------------------

    const existing =
      await citizenHistoricalPrisma
        .$queryRawUnsafe(
          `
          SELECT *

          FROM historical_processing_records

          WHERE job_id = $1

          AND vehicle_table_name = $2

          AND telemetry_id = $3

          LIMIT 1
          `,

          jobId,

          vehicleTableName,

          telemetryId
        );


    return existing[0] || null;

  }


  // ===================================================
  // GET RECORD
  // ===================================================

  async getRecord(
    jobId,
    vehicleTableName,
    telemetryId
  ) {

    const result =
      await citizenHistoricalPrisma
        .$queryRawUnsafe(
          `
          SELECT *

          FROM historical_processing_records

          WHERE job_id = $1

          AND vehicle_table_name = $2

          AND telemetry_id = $3

          LIMIT 1
          `,

          jobId,

          vehicleTableName,

          telemetryId
        );


    return result[0] || null;

  }


  // ===================================================
  // START RECORD
  // ===================================================

  async startRecord(
    processingRecordId
  ) {

    const result =
      await citizenHistoricalPrisma
        .$queryRawUnsafe(
          `
          UPDATE
          historical_processing_records

          SET

            status = 'PROCESSING',

            attempts =
              attempts + 1,

            started_at =
              CURRENT_TIMESTAMP,

            failed_at = NULL,

            error_message = NULL,

            updated_at =
              CURRENT_TIMESTAMP

          WHERE processing_record_id = $1

          RETURNING *
          `,
          processingRecordId
        );


    return result[0] || null;

  }


  // ===================================================
  // COMPLETE RECORD
  // ===================================================

  async completeRecord(
    processingRecordId,
    historicalTableName
  ) {

    const result =
      await citizenHistoricalPrisma
        .$queryRawUnsafe(
          `
          UPDATE
          historical_processing_records

          SET

            status = 'PROCESSED',

            processed_at =
              CURRENT_TIMESTAMP,

            failed_at = NULL,

            error_message = NULL,

            historical_table_name = $1,

            updated_at =
              CURRENT_TIMESTAMP

          WHERE processing_record_id = $2

          RETURNING *
          `,

          historicalTableName,

          processingRecordId
        );


    return result[0] || null;

  }


  // ===================================================
  // FAIL RECORD
  // ===================================================

  async failRecord(
    processingRecordId,
    errorMessage
  ) {

    const result =
      await citizenHistoricalPrisma
        .$queryRawUnsafe(
          `
          UPDATE
          historical_processing_records

          SET

            status = 'FAILED',

            failed_at =
              CURRENT_TIMESTAMP,

            error_message = $1,

            updated_at =
              CURRENT_TIMESTAMP

          WHERE processing_record_id = $2

          RETURNING *
          `,

          errorMessage,

          processingRecordId
        );


    return result[0] || null;

  }


  // ===================================================
  // GET PENDING / FAILED RECORDS
  // ===================================================

  async getPendingRecords(
    jobId,
    limit = 100
  ) {

    const safeLimit =
      Math.max(
        1,
        Math.min(
          Number(limit) || 100,
          1000
        )
      );


    return await citizenHistoricalPrisma
      .$queryRawUnsafe(
        `
        SELECT *

        FROM historical_processing_records

        WHERE job_id = $1

        AND status IN (
          'PENDING',
          'FAILED'
        )

        ORDER BY
          processing_record_id ASC

        LIMIT ${safeLimit}
        `,
        jobId
      );

  }


  // ===================================================
  // GET JOB SUMMARY
  // ===================================================

  async getJobSummary(
    jobId
  ) {

    const result =
      await citizenHistoricalPrisma
        .$queryRawUnsafe(
          `
          SELECT

            job_id,

            processing_date,

            status,

            total_vehicles,

            total_records,

            processed_records,

            failed_records,

            skipped_records,

            started_at,

            completed_at,

            last_heartbeat_at,

            created_at,

            updated_at

          FROM historical_processing_jobs

          WHERE job_id = $1

          LIMIT 1
          `,
          jobId
        );


    return result[0] || null;

  }

}


// =====================================================
// EXPORT
// =====================================================

module.exports =
  new HistoricalProcessingManager();