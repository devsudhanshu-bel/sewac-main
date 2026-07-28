import { PrismaClient } from "../../generated/helper/index.js";

const globalForPrisma = globalThis;

const helperPrisma =
  globalForPrisma.helperPrisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "info", "warn", "error"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.helperPrisma = helperPrisma;
}

export default helperPrisma;