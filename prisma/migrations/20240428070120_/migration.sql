/*
  Warnings:

  - The primary key for the `Holidays` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Holidays` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[survey_id]` on the table `Interview` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[confidentalReport_id]` on the table `Interview` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Holidays" DROP CONSTRAINT "Holidays_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Holidays_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "InternForm" ADD COLUMN     "isInTerm" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "weekDayWork" BOOLEAN[],
ADD COLUMN     "workOnSaturday" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "confidentalReport_id" TEXT,
ADD COLUMN     "survey_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Interview_survey_id_key" ON "Interview"("survey_id");

-- CreateIndex
CREATE UNIQUE INDEX "Interview_confidentalReport_id_key" ON "Interview"("confidentalReport_id");

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "Survey"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_confidentalReport_id_fkey" FOREIGN KEY ("confidentalReport_id") REFERENCES "ConfidentalReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;
