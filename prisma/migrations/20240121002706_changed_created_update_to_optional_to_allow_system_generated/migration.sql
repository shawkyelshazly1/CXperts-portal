-- DropForeignKey
ALTER TABLE "ResignationResolution" DROP CONSTRAINT "ResignationResolution_creatorId_fkey";

-- AlterTable
ALTER TABLE "ResignationResolution" ALTER COLUMN "creatorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ResignationResolution" ADD CONSTRAINT "ResignationResolution_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Employee"("employeeId") ON DELETE SET NULL ON UPDATE CASCADE;
