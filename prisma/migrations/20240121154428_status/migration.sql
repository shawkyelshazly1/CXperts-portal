-- AlterTable
ALTER TABLE "DisciplinaryActions" ADD COLUMN     "approvalStatus" TEXT,
ALTER COLUMN "approvedOn" DROP NOT NULL;
