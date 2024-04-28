/*
  Warnings:

  - You are about to drop the column `intern_id` on the `Interview` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Interview" DROP CONSTRAINT "Interview_intern_id_fkey";

-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "intern_id",
ADD COLUMN     "student_id" TEXT;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
