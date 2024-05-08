/*
  Warnings:

  - You are about to drop the column `isSealed` on the `InternStatus` table. All the data in the column will be lost.
  - You are about to drop the column `isSealed` on the `Interview` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "InternForm" DROP CONSTRAINT "InternForm_edu_year_id_fkey";

-- AlterTable
ALTER TABLE "InternForm" ALTER COLUMN "edu_year_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "InternStatus" DROP COLUMN "isSealed";

-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "isSealed";

-- AddForeignKey
ALTER TABLE "InternForm" ADD CONSTRAINT "InternForm_edu_year_id_fkey" FOREIGN KEY ("edu_year_id") REFERENCES "EduYear"("id") ON DELETE SET NULL ON UPDATE CASCADE;
