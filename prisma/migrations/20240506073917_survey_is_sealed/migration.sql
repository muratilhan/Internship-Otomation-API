/*
  Warnings:

  - You are about to drop the column `companyAccesToken` on the `ConfidentalReport` table. All the data in the column will be lost.
  - You are about to drop the column `school_number` on the `ConfidentalReport` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ConfidentalReport" DROP COLUMN "companyAccesToken",
DROP COLUMN "school_number";

-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "companyAccesToken" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Survey" ADD COLUMN     "isSealed" BOOLEAN NOT NULL DEFAULT false;
