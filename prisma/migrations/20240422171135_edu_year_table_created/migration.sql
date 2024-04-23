/*
  Warnings:

  - You are about to drop the column `edu_year` on the `InternForm` table. All the data in the column will be lost.
  - Added the required column `edu_year_id` to the `InternForm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InternForm" DROP COLUMN "edu_year",
ADD COLUMN     "edu_year_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "EduYear" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "EduYear_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InternForm" ADD CONSTRAINT "InternForm_edu_year_id_fkey" FOREIGN KEY ("edu_year_id") REFERENCES "EduYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
