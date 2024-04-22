/*
  Warnings:

  - You are about to drop the column `student_id` on the `ConfidentalReport` table. All the data in the column will be lost.
  - You are about to drop the column `student_id` on the `User` table. All the data in the column will be lost.
  - Added the required column `school_number` to the `ConfidentalReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ConfidentalReport" DROP COLUMN "student_id",
ADD COLUMN     "school_number" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "student_id",
ADD COLUMN     "school_number" TEXT;
