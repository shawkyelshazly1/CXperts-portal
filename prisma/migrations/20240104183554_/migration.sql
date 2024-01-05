/*
  Warnings:

  - You are about to drop the column `employeeID` on the `Employee` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[employeeId]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `employeeId` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_managerId_fkey";

-- DropForeignKey
ALTER TABLE "EmployeeDocuments" DROP CONSTRAINT "EmployeeDocuments_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "LoginDetails" DROP CONSTRAINT "LoginDetails_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "VacationRequest" DROP CONSTRAINT "VacationRequest_approvedBy_fkey";

-- DropForeignKey
ALTER TABLE "VacationRequest" DROP CONSTRAINT "VacationRequest_employeeId_fkey";

-- DropIndex
DROP INDEX "Employee_employeeID_key";

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "employeeID",
ADD COLUMN     "employeeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "VacationRequest" ALTER COLUMN "approvedBy" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Employee_employeeId_key" ON "Employee"("employeeId");

-- AddForeignKey
ALTER TABLE "LoginDetails" ADD CONSTRAINT "LoginDetails_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Employee"("employeeId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeDocuments" ADD CONSTRAINT "EmployeeDocuments_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VacationRequest" ADD CONSTRAINT "VacationRequest_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VacationRequest" ADD CONSTRAINT "VacationRequest_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "Employee"("employeeId") ON DELETE SET NULL ON UPDATE CASCADE;
