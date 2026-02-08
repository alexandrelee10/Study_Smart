import "dotenv/config";

import {
  PrismaClient,
  AssignmentStatus,
  CalendarEventType,
  RecurrenceFrequency,
} from "@prisma/client";

import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

// ✅ REQUIRED for Prisma v7 when adapter-pg is installed
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding StudySmart...");

  // ---------- USER ----------
  const password = await bcrypt.hash("Password123!", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@studysmart.dev" },
    update: {},
    create: {
      username: "demo",
      firstName: "Demo",
      lastName: "Student",
      email: "demo@studysmart.dev",
      password,
    },
  });

  // ---------- COURSES ----------
  const cs = await prisma.course.create({
    data: {
      name: "Computer Science I",
      code: "COP2210",
      type: "COMPUTER_SCIENCE",
      edLevel: "COLLEGE",
    },
  });

  const math = await prisma.course.create({
    data: {
      name: "College Algebra",
      code: "MAC1105",
      edLevel: "COLLEGE",
    },
  });

  // ---------- ENROLLMENTS ----------
  await prisma.enrollment.createMany({
    data: [
      { userId: user.id, courseId: cs.id },
      { userId: user.id, courseId: math.id },
    ],
    skipDuplicates: true,
  });

  // ---------- ASSIGNMENT ----------
  const assignment = await prisma.assignment.create({
    data: {
      title: "HW 1 — Variables & Loops",
      courseId: cs.id,
      status: AssignmentStatus.TODO,
      assignedToId: user.id,
    },
  });

  // ---------- STUDY SESSION ----------
  await prisma.studySession.create({
    data: {
      userId: user.id,
      courseId: cs.id,
      minutes: 45,
      notes: "Reviewed loops and conditionals.",
    },
  });

  // ---------- STUDY GOAL ----------
  await prisma.studyGoal.create({
    data: {
      userId: user.id,
      courseId: cs.id,
      targetMinutesPerWeek: 240,
    },
  });

  // ---------- CALENDAR EVENT ----------
  const start = new Date();
  start.setHours(18, 0, 0, 0);

  const event = await prisma.calendarEvent.create({
    data: {
      userId: user.id,
      title: "CS Study Block",
      type: CalendarEventType.STUDY,
      startAt: start,
      isRecurring: true,
      courseId: cs.id,
    },
  });

  await prisma.calendarRecurrence.create({
    data: {
      eventId: event.id,
      frequency: RecurrenceFrequency.WEEKLY,
      byWeekday: [1, 3, 5], // Mon/Wed/Fri
    },
  });

  // ---------- DAILY PROGRESS ----------
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.dailyProgress.upsert({
    where: {
      userId_courseId_date: {
        userId: user.id,
        courseId: cs.id,
        date: today,
      },
    },
    update: { minutes: 45, sessions: 1 },
    create: {
      userId: user.id,
      courseId: cs.id,
      date: today,
      minutes: 45,
      sessions: 1,
    },
  });

  console.log("✅ Seed completed successfully");
  console.log("🔐 Demo login:");
  console.log("   email: demo@studysmart.dev");
  console.log("   password: Password123!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
