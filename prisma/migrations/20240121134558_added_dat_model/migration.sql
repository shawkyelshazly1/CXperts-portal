-- CreateTable
CREATE TABLE "DisciplinaryActions" (
    "id" SERIAL NOT NULL,
    "submissionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittorId" TEXT NOT NULL,
    "actionCategory" TEXT NOT NULL,
    "incidentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actionType" TEXT NOT NULL,
    "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
    "actionedEmployeeId" TEXT NOT NULL,
    "approverId" TEXT,

    CONSTRAINT "DisciplinaryActions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DisciplinaryActions" ADD CONSTRAINT "DisciplinaryActions_submittorId_fkey" FOREIGN KEY ("submittorId") REFERENCES "Employee"("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisciplinaryActions" ADD CONSTRAINT "DisciplinaryActions_actionedEmployeeId_fkey" FOREIGN KEY ("actionedEmployeeId") REFERENCES "Employee"("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisciplinaryActions" ADD CONSTRAINT "DisciplinaryActions_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "Employee"("employeeId") ON DELETE SET NULL ON UPDATE CASCADE;
