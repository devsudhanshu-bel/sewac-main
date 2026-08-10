/*
  Warnings:

  - You are about to drop the `zones` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "zones" DROP CONSTRAINT "zones_city_id_fkey";

-- AlterTable
ALTER TABLE "city" ADD COLUMN     "city_table_name" VARCHAR(150);

-- DropTable
DROP TABLE "zones";
