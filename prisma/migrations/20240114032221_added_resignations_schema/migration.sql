-- CreateTable
CREATE TABLE "Resignation" (
    "id" SERIAL NOT NULL,
    "employeeId" TEXT NOT NULL,
    "reason" TEXT,
    "status" TEXT DEFAULT 'pending',
    "comment" TEXT,
    "resolution" TEXT NOT NULL,
    "lastWorkingDay" TIMESTAMP(3) NOT NULL,
    "hrAssignedId" TEXT NOT NULL,

    CONSTRAINT "Resignation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Resignation_employeeId_key" ON "Resignation"("employeeId");

-- AddForeignKey
ALTER TABLE "Resignation" ADD CONSTRAINT "Resignation_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resignation" ADD CONSTRAINT "Resignation_hrAssignedId_fkey" FOREIGN KEY ("hrAssignedId") REFERENCES "Employee"("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE;
