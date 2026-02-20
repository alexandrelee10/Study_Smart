/*
  Warnings:

  - You are about to drop the column `actualMinutes` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `completedAt` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `difficulty` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `durationMinutes` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Lesson` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[courseId,order]` on the table `Lesson` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "actualMinutes",
DROP COLUMN "completedAt",
DROP COLUMN "date",
DROP COLUMN "difficulty",
DROP COLUMN "durationMinutes",
DROP COLUMN "startedAt",
DROP COLUMN "status",
ADD COLUMN     "isPreview" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "isPublished" SET DEFAULT true;

-- CreateTable
CREATE TABLE "LessonProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "date" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "durationMinutes" INTEGER,
    "actualMinutes" INTEGER,
    "status" "LessonStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "difficulty" "Difficulty",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LessonProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LessonProgress_userId_idx" ON "LessonProgress"("userId");

-- CreateIndex
CREATE INDEX "LessonProgress_lessonId_idx" ON "LessonProgress"("lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "LessonProgress_userId_lessonId_key" ON "LessonProgress"("userId", "lessonId");

-- CreateIndex
CREATE INDEX "Lesson_courseId_idx" ON "Lesson"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_courseId_order_key" ON "Lesson"("courseId", "order");

-- AddForeignKey
ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
