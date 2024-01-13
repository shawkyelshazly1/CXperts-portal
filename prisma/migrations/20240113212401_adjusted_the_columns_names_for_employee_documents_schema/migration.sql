/*
  Warnings:

  - You are about to drop the column `birthCertificate` on the `EmployeeDocuments` table. All the data in the column will be lost.
  - You are about to drop the column `criminalRecord` on the `EmployeeDocuments` table. All the data in the column will be lost.
  - You are about to drop the column `educationDegree` on the `EmployeeDocuments` table. All the data in the column will be lost.
  - You are about to drop the column `insuranceProof` on the `EmployeeDocuments` table. All the data in the column will be lost.
  - You are about to drop the column `medicalInsuranceCard` on the `EmployeeDocuments` table. All the data in the column will be lost.
  - You are about to drop the column `millitaryCertificate` on the `EmployeeDocuments` table. All the data in the column will be lost.
  - You are about to drop the column `nationalIdCard` on the `EmployeeDocuments` table. All the data in the column will be lost.
  - You are about to drop the column `personalPhoto` on the `EmployeeDocuments` table. All the data in the column will be lost.
  - You are about to drop the column `workPermit` on the `EmployeeDocuments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EmployeeDocuments" DROP COLUMN "birthCertificate",
DROP COLUMN "criminalRecord",
DROP COLUMN "educationDegree",
DROP COLUMN "insuranceProof",
DROP COLUMN "medicalInsuranceCard",
DROP COLUMN "millitaryCertificate",
DROP COLUMN "nationalIdCard",
DROP COLUMN "personalPhoto",
DROP COLUMN "workPermit",
ADD COLUMN     "birth_certificate" TEXT,
ADD COLUMN     "criminal_record" TEXT,
ADD COLUMN     "education_degree" TEXT,
ADD COLUMN     "insurance_proof" TEXT,
ADD COLUMN     "medical_insurance_card" TEXT,
ADD COLUMN     "millitary_certificate" TEXT,
ADD COLUMN     "national_id_card" TEXT,
ADD COLUMN     "personal_photo" TEXT,
ADD COLUMN     "work_permit" TEXT;
