import { PrismaClient } from "../../generated/sewac/index.js";

const globalForPrisma = globalThis;

const sewacPrisma =
  globalForPrisma.sewacPrisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "info", "warn", "error"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.sewacPrisma = sewacPrisma;
}

export default sewacPrisma;