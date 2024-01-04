-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "projectId" INTEGER;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;
