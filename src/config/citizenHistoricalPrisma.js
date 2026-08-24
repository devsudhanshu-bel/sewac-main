import { PrismaClient } from "../generated/citizenHistorical/client.js";

// =====================================================
// CITIZEN HISTORICAL PRISMA CLIENT
// =====================================================
//
// Dedicated Prisma client for:
//
// citizen_historical_db
//
// Uses:
// CITIZEN_HISTORICAL_DATABASE_URL
//
// Generated Prisma client:
// src/generated/citizenHistorical/client.js
//
// =====================================================

const citizenHistoricalPrisma = new PrismaClient({
  log: ["error"],
});

// =====================================================
// DATABASE CONNECTION TEST
// =====================================================

export async function connectCitizenHistoricalDB() {
  try {
    await citizenHistoricalPrisma.$connect();

    console.log(
      "✅ Citizen Historical DB connected successfully"
    );
  } catch (error) {
    console.error(
      "❌ Citizen Historical DB connection failed:",
      error
    );

    throw error;
  }
}

// =====================================================
// DATABASE DISCONNECT
// =====================================================

export async function disconnectCitizenHistoricalDB() {
  try {
    await citizenHistoricalPrisma.$disconnect();

    console.log(
      "🔌 Citizen Historical DB disconnected"
    );
  } catch (error) {
    console.error(
      "❌ Citizen Historical DB disconnect failed:",
      error
    );
  }
}

// =====================================================
// EXPORT PRISMA CLIENT
// =====================================================

export default citizenHistoricalPrisma;