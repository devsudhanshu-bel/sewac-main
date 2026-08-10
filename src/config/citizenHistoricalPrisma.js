const {
  PrismaClient,
} = require("../generated/citizenHistorical");


// =====================================================
// CITIZEN HISTORICAL PRISMA CLIENT
// =====================================================
//
// Dedicated Prisma client for:
//
// citizen_historical_db
//
// IMPORTANT:
//
// This client is completely independent from:
//
// - Helper DB
// - Master Citizen DB
// - Telemetry DB
// - Main SEWAC DB
//
// The Citizen Historical system uses this client only
// for historical processing and storage.
//
// =====================================================

const citizenHistoricalPrisma =
  new PrismaClient({
    log: ["error"],
  });


// =====================================================
// DATABASE CONNECTION TEST
// =====================================================

async function connectCitizenHistoricalDB() {
  try {
    await citizenHistoricalPrisma.$connect();

    console.log(
      "Citizen Historical DB connected successfully"
    );
  } catch (error) {
    console.error(
      "Citizen Historical DB connection failed:",
      error
    );

    throw error;
  }
}


// =====================================================
// DATABASE DISCONNECT
// =====================================================

async function disconnectCitizenHistoricalDB() {
  try {
    await citizenHistoricalPrisma.$disconnect();

    console.log(
      "Citizen Historical DB disconnected"
    );
  } catch (error) {
    console.error(
      "Citizen Historical DB disconnect failed:",
      error
    );
  }
}


// =====================================================
// EXPORT
// =====================================================

module.exports =
  citizenHistoricalPrisma;

module.exports.connectCitizenHistoricalDB =
  connectCitizenHistoricalDB;

module.exports.disconnectCitizenHistoricalDB =
  disconnectCitizenHistoricalDB;