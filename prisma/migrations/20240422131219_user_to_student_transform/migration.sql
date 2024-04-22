/*
  Warnings:

  - You are about to drop the column `user_id` on the `InternStatus` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[student_id]` on the table `InternStatus` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "InternStatus" DROP CONSTRAINT "InternStatus_user_id_fkey";

-- DropIndex
DROP INDEX "InternStatus_user_id_key";

-- AlterTable
ALTER TABLE "InternStatus" DROP COLUMN "user_id",
ADD COLUMN     "student_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "InternStatus_student_id_key" ON "InternStatus"("student_id");

-- AddForeignKey
ALTER TABLE "InternStatus" ADD CONSTRAINT "InternStatus_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
