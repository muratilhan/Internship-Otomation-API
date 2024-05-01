/*
  Warnings:

  - You are about to drop the column `internStatusTrack_id` on the `InternStatus` table. All the data in the column will be lost.
  - Added the required column `internStatusId` to the `InternStatusTrack` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "InternStatus" DROP CONSTRAINT "InternStatus_internStatusTrack_id_fkey";

-- AlterTable
ALTER TABLE "InternStatus" DROP COLUMN "internStatusTrack_id";

-- AlterTable
ALTER TABLE "InternStatusTrack" ADD COLUMN     "internStatusId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "InternStatusTrack" ADD CONSTRAINT "InternStatusTrack_internStatusId_fkey" FOREIGN KEY ("internStatusId") REFERENCES "InternStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
