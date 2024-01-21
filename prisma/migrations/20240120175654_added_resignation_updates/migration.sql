/*
  Warnings:

  - You are about to drop the column `comment` on the `Resignation` table. All the data in the column will be lost.
  - Made the column `reason` on table `Resignation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Resignation" DROP COLUMN "comment",
ALTER COLUMN "reason" SET NOT NULL;

-- CreateTable
CREATE TABLE "ResignationResolution" (
    "id" SERIAL NOT NULL,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "resignationId" INTEGER,

    CONSTRAINT "ResignationResolution_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ResignationResolution" ADD CONSTRAINT "ResignationResolution_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Employee"("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResignationResolution" ADD CONSTRAINT "ResignationResolution_resignationId_fkey" FOREIGN KEY ("resignationId") REFERENCES "Resignation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
