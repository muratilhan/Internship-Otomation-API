/*
  Warnings:

  - A unique constraint covering the columns `[interview_id]` on the table `InternStatus` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[form_id]` on the table `InternStatus` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "InternStatus_interview_id_key" ON "InternStatus"("interview_id");

-- CreateIndex
CREATE UNIQUE INDEX "InternStatus_form_id_key" ON "InternStatus"("form_id");
