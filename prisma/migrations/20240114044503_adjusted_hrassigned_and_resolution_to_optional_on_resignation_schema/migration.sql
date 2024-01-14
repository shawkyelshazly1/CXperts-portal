-- DropForeignKey
ALTER TABLE "Resignation" DROP CONSTRAINT "Resignation_hrAssignedId_fkey";

-- AlterTable
ALTER TABLE "Resignation" ALTER COLUMN "resolution" DROP NOT NULL,
ALTER COLUMN "hrAssignedId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Resignation" ADD CONSTRAINT "Resignation_hrAssignedId_fkey" FOREIGN KEY ("hrAssignedId") REFERENCES "Employee"("employeeId") ON DELETE SET NULL ON UPDATE CASCADE;
