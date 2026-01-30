-- CreateEnum
CREATE TYPE "CalendarEventType" AS ENUM ('STUDY', 'CLASS', 'ASSIGNMENT', 'EXAM', 'MEETING', 'REMINDER', 'OTHER');

-- CreateEnum
CREATE TYPE "CalendarEventStatus" AS ENUM ('CONFIRMED', 'TENTATIVE', 'CANCELED');

-- CreateEnum
CREATE TYPE "RecurrenceFrequency" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');

-- CreateTable
CREATE TABLE "CalendarEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "type" "CalendarEventType" NOT NULL DEFAULT 'OTHER',
    "status" "CalendarEventStatus" NOT NULL DEFAULT 'CONFIRMED',
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3),
    "allDay" BOOLEAN NOT NULL DEFAULT false,
    "courseId" TEXT,
    "assignmentId" TEXT,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalendarEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalendarRecurrence" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "frequency" "RecurrenceFrequency" NOT NULL,
    "interval" INTEGER NOT NULL DEFAULT 1,
    "byWeekday" INTEGER[],
    "until" TIMESTAMP(3),
    "count" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalendarRecurrence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "minutes" INTEGER NOT NULL DEFAULT 0,
    "sessions" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DailyProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CalendarEvent_userId_idx" ON "CalendarEvent"("userId");

-- CreateIndex
CREATE INDEX "CalendarEvent_courseId_idx" ON "CalendarEvent"("courseId");

-- CreateIndex
CREATE INDEX "CalendarEvent_assignmentId_idx" ON "CalendarEvent"("assignmentId");

-- CreateIndex
CREATE INDEX "CalendarEvent_startAt_idx" ON "CalendarEvent"("startAt");

-- CreateIndex
CREATE UNIQUE INDEX "CalendarRecurrence_eventId_key" ON "CalendarRecurrence"("eventId");

-- CreateIndex
CREATE INDEX "DailyProgress_userId_date_idx" ON "DailyProgress"("userId", "date");

-- CreateIndex
CREATE INDEX "DailyProgress_courseId_date_idx" ON "DailyProgress"("courseId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "DailyProgress_userId_courseId_date_key" ON "DailyProgress"("userId", "courseId", "date");

-- CreateIndex
CREATE INDEX "Assignment_dueDate_idx" ON "Assignment"("dueDate");

-- AddForeignKey
ALTER TABLE "CalendarEvent" ADD CONSTRAINT "CalendarEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarEvent" ADD CONSTRAINT "CalendarEvent_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarEvent" ADD CONSTRAINT "CalendarEvent_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarRecurrence" ADD CONSTRAINT "CalendarRecurrence_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "CalendarEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyProgress" ADD CONSTRAINT "DailyProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyProgress" ADD CONSTRAINT "DailyProgress_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
