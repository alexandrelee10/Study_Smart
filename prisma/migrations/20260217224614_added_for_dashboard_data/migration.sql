-- CreateTable
CREATE TABLE "PlanItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlanItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PlanItem_userId_date_idx" ON "PlanItem"("userId", "date");

-- AddForeignKey
ALTER TABLE "PlanItem" ADD CONSTRAINT "PlanItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
