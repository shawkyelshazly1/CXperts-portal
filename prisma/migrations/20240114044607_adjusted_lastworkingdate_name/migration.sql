/*
  Warnings:

  - You are about to drop the column `lastWorkingDay` on the `Resignation` table. All the data in the column will be lost.
  - Added the required column `lastWorkingDate` to the `Resignation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Resignation" DROP COLUMN "lastWorkingDay",
ADD COLUMN     "lastWorkingDate" TIMESTAMP(3) NOT NULL;
