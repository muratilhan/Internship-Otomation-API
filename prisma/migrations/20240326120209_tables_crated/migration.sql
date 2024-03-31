-- CreateEnum
CREATE TYPE "INTERN_STATUS" AS ENUM ('START', 'DOING', 'END');

-- CreateTable
CREATE TABLE "InternForm" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "total_work_day" INTEGER NOT NULL,
    "edu_year" TEXT NOT NULL,
    "edu_program" TEXT NOT NULL DEFAULT 'Bilgisayar Mühendisliği',
    "edu_faculty" TEXT NOT NULL DEFAULT 'Mühendislik Fakültesi',
    "student_id" TEXT,
    "follow_up_id" TEXT,
    "student_info_id" TEXT,
    "company_info_id" TEXT,

    CONSTRAINT "InternForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentInfo" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fathers_name" TEXT NOT NULL,
    "mothers_name" TEXT NOT NULL,
    "birth_place" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "StudentInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyInfo" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "fax" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "service_area" TEXT NOT NULL,

    CONSTRAINT "CompanyInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InternStatus" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT,
    "interview_id" TEXT,
    "form_id" TEXT,
    "status" "INTERN_STATUS" NOT NULL DEFAULT 'START',

    CONSTRAINT "InternStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interview" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date" TIMESTAMP(3) NOT NULL,
    "intern_id" TEXT,
    "comission_id" TEXT,

    CONSTRAINT "Interview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InternForm_student_info_id_key" ON "InternForm"("student_info_id");

-- CreateIndex
CREATE UNIQUE INDEX "InternForm_company_info_id_key" ON "InternForm"("company_info_id");

-- CreateIndex
CREATE UNIQUE INDEX "InternStatus_user_id_key" ON "InternStatus"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "InternStatus_interview_id_key" ON "InternStatus"("interview_id");

-- CreateIndex
CREATE UNIQUE INDEX "InternStatus_form_id_key" ON "InternStatus"("form_id");

-- AddForeignKey
ALTER TABLE "InternForm" ADD CONSTRAINT "InternForm_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternForm" ADD CONSTRAINT "InternForm_follow_up_id_fkey" FOREIGN KEY ("follow_up_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternForm" ADD CONSTRAINT "InternForm_student_info_id_fkey" FOREIGN KEY ("student_info_id") REFERENCES "StudentInfo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternForm" ADD CONSTRAINT "InternForm_company_info_id_fkey" FOREIGN KEY ("company_info_id") REFERENCES "CompanyInfo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternStatus" ADD CONSTRAINT "InternStatus_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternStatus" ADD CONSTRAINT "InternStatus_interview_id_fkey" FOREIGN KEY ("interview_id") REFERENCES "Interview"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternStatus" ADD CONSTRAINT "InternStatus_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "InternForm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_intern_id_fkey" FOREIGN KEY ("intern_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_comission_id_fkey" FOREIGN KEY ("comission_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
