-- DropForeignKey
ALTER TABLE "InternForm" DROP CONSTRAINT "InternForm_company_info_id_fkey";

-- DropForeignKey
ALTER TABLE "InternForm" DROP CONSTRAINT "InternForm_student_info_id_fkey";

-- CreateTable
CREATE TABLE "Holidays" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Holidays_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InternForm" ADD CONSTRAINT "InternForm_student_info_id_fkey" FOREIGN KEY ("student_info_id") REFERENCES "StudentInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternForm" ADD CONSTRAINT "InternForm_company_info_id_fkey" FOREIGN KEY ("company_info_id") REFERENCES "CompanyInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
