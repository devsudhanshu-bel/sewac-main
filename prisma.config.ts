import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/master_citizen.schema.prisma",

  datasource: {
    url: env("MASTER_CITIZEN_DATABASE_URL"),
  },
});