/*
  Warnings:

  - You are about to drop the column `nationalId` on the `EmployeeDocuments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EmployeeDocuments" DROP COLUMN "nationalId",
ADD COLUMN     "nationalIdCard" TEXT;
