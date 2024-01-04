/*
  Warnings:

  - Added the required column `middleName` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nationality` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resignationDate` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "middleName" TEXT NOT NULL,
ADD COLUMN     "nationalId" TEXT,
ADD COLUMN     "nationality" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "resignationDate" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "EmployeeDocuments" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "medicalInsuranceCard" TEXT,
    "criminalRecord" TEXT,
    "nationalId" TEXT,
    "birthCertificate" TEXT,
    "educationDegree" TEXT,
    "millitaryCertificate" TEXT,
    "insuranceProof" TEXT,
    "workPermit" TEXT,
    "personalPhoto" TEXT,

    CONSTRAINT "EmployeeDocuments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeDocuments_employeeId_key" ON "EmployeeDocuments"("employeeId");

-- AddForeignKey
ALTER TABLE "EmployeeDocuments" ADD CONSTRAINT "EmployeeDocuments_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
