-- AlterEnum
ALTER TYPE "USER_TYPE" ADD VALUE 'ADMIN';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordChangeToken" TEXT NOT NULL DEFAULT '';
