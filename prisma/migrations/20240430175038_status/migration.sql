/*
  Warnings:

  - The values [START,DOING,END] on the enum `INTERN_STATUS` will be removed. If these variants are still used in the database, this will fail.

*/

-- CreateTable
CREATE TABLE "InternStatusTrack" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT NOT NULL,
    "prevStatus" "INTERN_STATUS" NOT NULL,
    "nextStatus" "INTERN_STATUS" NOT NULL,
    "desc" TEXT NOT NULL,

    CONSTRAINT "InternStatusTrack_pkey" PRIMARY KEY ("id")
);

-- AlterEnum
BEGIN;
CREATE TYPE "INTERN_STATUS_new" AS ENUM ('FRM01', 'FRM02', 'FRM03', 'RED01', 'MLK01', 'MLK02', 'MLK03', 'MLK04', 'RED02', 'RED03', 'STJ00');
ALTER TABLE "InternStatus" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "InternStatus" ALTER COLUMN "status" TYPE "INTERN_STATUS_new" USING ("status"::text::"INTERN_STATUS_new");
ALTER TABLE "InternStatusTrack" ALTER COLUMN "prevStatus" TYPE "INTERN_STATUS_new" USING ("prevStatus"::text::"INTERN_STATUS_new");
ALTER TABLE "InternStatusTrack" ALTER COLUMN "nextStatus" TYPE "INTERN_STATUS_new" USING ("nextStatus"::text::"INTERN_STATUS_new");
ALTER TYPE "INTERN_STATUS" RENAME TO "INTERN_STATUS_old";
ALTER TYPE "INTERN_STATUS_new" RENAME TO "INTERN_STATUS";
DROP TYPE "INTERN_STATUS_old";
ALTER TABLE "InternStatus" ALTER COLUMN "status" SET DEFAULT 'FRM01';
COMMIT;

-- AlterTable
ALTER TABLE "InternStatus" ADD COLUMN     "internStatusTrack_id" TEXT,
ALTER COLUMN "status" SET DEFAULT 'FRM01';


-- AddForeignKey
ALTER TABLE "InternStatus" ADD CONSTRAINT "InternStatus_internStatusTrack_id_fkey" FOREIGN KEY ("internStatusTrack_id") REFERENCES "InternStatusTrack"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternStatusTrack" ADD CONSTRAINT "InternStatusTrack_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
