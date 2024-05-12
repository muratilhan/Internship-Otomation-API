/*
  Warnings:

  - You are about to drop the column `isMailSended` on the `ConfidentalReport` table. All the data in the column will be lost.
  - You are about to alter the column `auth_name` on the `ConfidentalReport` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `auth_position` on the `ConfidentalReport` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `reg_number` on the `ConfidentalReport` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `auth_tc_number` on the `ConfidentalReport` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `auth_title` on the `ConfidentalReport` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - Made the column `isGraduate` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ConfidentalReport" DROP COLUMN "isMailSended",
ADD COLUMN     "desc" TEXT,
ADD COLUMN     "isMailResponded" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "auth_name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "auth_position" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "reg_number" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "auth_tc_number" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "auth_title" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "isCompanyMailSended" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "isGraduate" SET NOT NULL,
ALTER COLUMN "isGraduate" SET DEFAULT false;
