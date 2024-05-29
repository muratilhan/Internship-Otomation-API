-- AlterTable
ALTER TABLE "Holidays" ADD COLUMN     "desc" TEXT;

-- CreateTable
CREATE TABLE "ActiveFollowUp" (
    "id" SERIAL NOT NULL,
    "active_follow_up_id" TEXT,

    CONSTRAINT "ActiveFollowUp_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ActiveFollowUp" ADD CONSTRAINT "ActiveFollowUp_active_follow_up_id_fkey" FOREIGN KEY ("active_follow_up_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
