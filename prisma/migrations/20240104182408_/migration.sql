/*
  Warnings:

  - A unique constraint covering the columns `[employeeID]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_managerId_fkey";

-- DropForeignKey
ALTER TABLE "EmployeeDocuments" DROP CONSTRAINT "EmployeeDocuments_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "LoginDetails" DROP CONSTRAINT "LoginDetails_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "VacationRequest" DROP CONSTRAINT "VacationRequest_employeeId_fkey";

-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "managerId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "EmployeeDocuments" ALTER COLUMN "employeeId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "LoginDetails" ALTER COLUMN "employeeId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "VacationRequest" ALTER COLUMN "employeeId" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Employee_employeeID_key" ON "Employee"("employeeID");

-- AddForeignKey
ALTER TABLE "LoginDetails" ADD CONSTRAINT "LoginDetails_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("employeeID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Employee"("employeeID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeDocuments" ADD CONSTRAINT "EmployeeDocuments_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("employeeID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VacationRequest" ADD CONSTRAINT "VacationRequest_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("employeeID") ON DELETE RESTRICT ON UPDATE CASCADE;
