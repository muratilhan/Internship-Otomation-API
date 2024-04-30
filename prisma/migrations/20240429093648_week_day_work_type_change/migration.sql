/*
  Warnings:

  - The `weekDayWork` column on the `InternForm` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "InternForm" DROP COLUMN "weekDayWork",
ADD COLUMN     "weekDayWork" INTEGER[];
