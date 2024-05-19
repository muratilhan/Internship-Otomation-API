/*
  Warnings:

  - You are about to drop the column `isCompanyMailSended` on the `Interview` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "isCompanyMailSended",
ADD COLUMN     "lastDateOfMailSended" TIMESTAMP(3);
