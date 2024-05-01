-- DropForeignKey
ALTER TABLE "ConfidentalReport" DROP CONSTRAINT "ConfidentalReport_createdById_fkey";

-- AlterTable
ALTER TABLE "ConfidentalReport" ADD COLUMN     "companyAccesToken" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "isSealed" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "createdById" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "graduationDate" TIMESTAMP(3),
ADD COLUMN     "isGraduate" BOOLEAN;

-- AddForeignKey
ALTER TABLE "ConfidentalReport" ADD CONSTRAINT "ConfidentalReport_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
