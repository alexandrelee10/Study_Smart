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
  const adminPassword = await bcrypt.hash("Admin123!", 10)

  const adminUser = await prisma.user.upsert({
    where: {email: "admin@studysmart.dev"},
    update: {},
    create: {
      username:"admin",
      firstName: "Admin",
      lastName: "Example",
      email: "admin@studysmart.dev",
      password
    },
  });

// ---------- COURSES ----------
const coursesData = [
  {
    name: "Computer Science I",
    code: "COP2210",
    type: "COMPUTER_SCIENCE",
    edLevel: "COLLEGE",
    image: "/assets/courses/cp.png",
    difficulty: "MEDIUM",
    description:
      "Learn the foundations of programming and computational thinking. You’ll write your first programs, practice problem-solving, work with variables, conditionals, loops, functions, and basic data structures. Great for building confidence and learning how to think like a developer.",
  },
  {
    name: "College Algebra",
    code: "MAC1105",
    type: "MATH",
    edLevel: "COLLEGE",
    image: "/assets/courses/ca.png",
    difficulty: "MEDIUM",
    description:
      "Master core algebra skills used across STEM fields. Topics include functions, linear/quadratic equations, inequalities, factoring, exponents/logarithms, and graph interpretation. Strong focus on building accuracy, speed, and confidence for higher math.",
  },
  {
    name: "Data Structures",
    code: "COP3530",
    type: "COMPUTER_SCIENCE",
    edLevel: "COLLEGE",
    image: "/assets/courses/cp.png",
    difficulty: "HARD",
    description:
      "Go beyond basic programming into real software engineering skills. Learn arrays, linked lists, stacks, queues, hash tables, trees, and graphs—plus when to use each. You’ll analyze runtime (Big-O) and implement structures that power real apps and interviews.",
  },
  {
    name: "Precalculus",
    code: "MAC1147",
    type: "MATH",
    edLevel: "COLLEGE",
    image: "/assets/courses/ca.png",
    difficulty: "HARD",
    description:
      "Prepare for calculus with deeper function work and advanced algebra. Cover polynomial/rational/exponential/log functions, trigonometry basics, transformations, and problem-solving with graphs. Perfect bridge course for STEM majors.",
  },
  {
    name: "Critical Reading",
    code: "REA1101",
    type: "READING",
    edLevel: "HIGH_SCHOOL",
    image: "/assets/courses/eng.png",
    difficulty: "EASY",
    description:
      "Build strong reading comprehension and analysis skills. Practice annotating, identifying main ideas, understanding tone, making inferences, and summarizing arguments. Helps with test prep, essays, and understanding complex texts faster.",
  },
  {
    name: "English Composition I",
    code: "ENC1101",
    type: "ENGLISH",
    edLevel: "COLLEGE",
    image: "/assets/courses/eng.png",
    difficulty: "MEDIUM",
    description:
      "Learn to write clear, persuasive academic essays. Focus on thesis development, structure, revision, grammar, and research basics. You’ll practice writing and editing with feedback so your writing sounds confident and professional.",
  },
  {
    name: "English Composition II",
    code: "ENC1102",
    type: "ENGLISH",
    edLevel: "COLLEGE",
    image: "/assets/courses/eng.png",
    difficulty: "HARD",
    description:
      "Strengthen research writing and argumentation. Learn source credibility, citations, synthesis writing, and advanced essay structure. You’ll write longer pieces with stronger evidence and polish—great prep for upper-division courses.",
  },
  {
    name: "General Biology",
    code: "BSC2010",
    type: "SCIENCE",
    edLevel: "COLLEGE",
    image: "/assets/courses/sci.png",
    difficulty: "MEDIUM",
    description:
      "Explore the fundamentals of life science: cells, DNA, genetics, evolution, ecosystems, and human body basics. Ideal for building science literacy and preparing for health or STEM pathways.",
  },
  {
    name: "General Chemistry",
    code: "CHM1045",
    type: "SCIENCE",
    edLevel: "COLLEGE",
    image: "/assets/courses/sci.png",
    difficulty: "HARD",
    description:
      "Learn the core principles of chemistry—atomic structure, bonding, reactions, stoichiometry, and solutions. Emphasis on problem-solving and calculation skills used in labs and advanced science courses.",
  },
  {
    name: "World History",
    code: "HIS1010",
    type: "HISTORY",
    edLevel: "HIGH_SCHOOL",
    image: "/assets/courses/his.png",
    difficulty: "EASY",
    description:
      "Understand major world events and how they shaped modern society. Covers key civilizations, revolutions, global conflicts, and cultural movements. Great for building context, critical thinking, and strong essay responses.",
  },
  {
    name: "Foundations of Nursing",
    code: "NUR1020",
    type: "NURSING",
    edLevel: "COLLEGE",
    image: "/assets/courses/nursing.png",
    difficulty: "HARD",
    description:
      "A strong introduction to nursing fundamentals: patient care basics, safety, vital signs, communication, ethics, and clinical reasoning. Designed to build professional habits and confidence before advanced clinical courses.",
  },
  {
    name: "Social Media Marketing",
    code: "SMM2000",
    type: "SOCIAL_MEDIA",
    edLevel: "COLLEGE",
    image: "/assets/courses/sm.png",
    difficulty: "MEDIUM",
    description:
      "Learn how brands grow online. Topics include content strategy, platform fundamentals, audience research, analytics, and campaign planning. Great for creators and entrepreneurs who want repeatable growth systems.",
  },
] as const;



const courses = await Promise.all(
  coursesData.map((c) =>
    prisma.course.upsert({
      where: { code: c.code },
      update: {
        name: c.name,
        type: c.type,
        edLevel: c.edLevel,
        image: c.image,
        description: c.description,
        difficulty: c.difficulty,
      },
      create: {
        name: c.name,
        code: c.code,
        type: c.type,
        edLevel: c.edLevel,
        image: c.image,
        description: c.description,
        difficulty: c.difficulty,
      },
    })
  )
);

const [
  cs,
  math,
  cs2,
  math2,
  reading1,
  english1,
  english2,
  science1,
  science2,
  history1,
  nursing1,
  social1,
] = courses;

  
// ---------- LESSONS  ----------
const lessonPairs = [
  {
    courseId: cs.id,
    lessons: [
      {
        order: 0,
        name: "Lesson 1: Getting Started",
        description: "Course overview, expectations, and how to study effectively for this subject.",
        isPublished: true,
        isPreview: true,
      },
      {
        order: 1,
        name: "Lesson 2: Core Foundations",
        description: "Key fundamentals to build confidence before moving into harder topics.",
        isPublished: true,
        isPreview: false,
      },
    ],
  },
  {
    courseId: math.id,
    lessons: [
      {
        order: 0,
        name: "Lesson 1: Course Setup + Basics",
        description: "Quick refresher on prerequisites and the most important concepts you’ll use daily.",
        isPublished: true,
        isPreview: true,
      },
      {
        order: 1,
        name: "Lesson 2: Problem-Solving Patterns",
        description: "How to approach problems step-by-step with accuracy and speed.",
        isPublished: true,
        isPreview: false,
      },
    ],
  },
  {
    courseId: cs2.id,
    lessons: [
      {
        order: 0,
        name: "Lesson 1: Why Data Structures Matter",
        description: "Big picture: how structures power real apps and why interviews care.",
        isPublished: true,
        isPreview: true,
      },
      {
        order: 1,
        name: "Lesson 2: Arrays vs Linked Lists",
        description: "Tradeoffs, runtime, memory, and when to choose each.",
        isPublished: true,
        isPreview: false,
      },
    ],
  },
  {
    courseId: math2.id,
    lessons: [
      {
        order: 0,
        name: "Lesson 1: Functions Review",
        description: "Function behavior, notation, transformations—your toolkit before calculus.",
        isPublished: true,
        isPreview: true,
      },
      {
        order: 1,
        name: "Lesson 2: Trig Essentials",
        description: "Core trig identities, unit circle intuition, and solving basic trig equations.",
        isPublished: true,
        isPreview: false,
      },
    ],
  },
  {
    courseId: reading1.id,
    lessons: [
      {
        order: 0,
        name: "Lesson 1: Active Reading",
        description: "Annotation, questioning the text, and pulling meaning quickly.",
        isPublished: true,
        isPreview: true,
      },
      {
        order: 1,
        name: "Lesson 2: Inference & Tone",
        description: "How to read between the lines and identify author intent.",
        isPublished: true,
        isPreview: false,
      },
    ],
  },
  {
    courseId: english1.id,
    lessons: [
      {
        order: 0,
        name: "Lesson 1: Thesis + Structure",
        description: "Write strong thesis statements and outline essays that flow cleanly.",
        isPublished: true,
        isPreview: true,
      },
      {
        order: 1,
        name: "Lesson 2: Editing for Clarity",
        description: "Fix wordiness, improve transitions, and tighten arguments.",
        isPublished: true,
        isPreview: false,
      },
    ],
  },
  {
    courseId: english2.id,
    lessons: [
      {
        order: 0,
        name: "Lesson 1: Research Basics",
        description: "Finding credible sources, note-taking, and avoiding weak evidence.",
        isPublished: true,
        isPreview: true,
      },
      {
        order: 1,
        name: "Lesson 2: Citations & Synthesis",
        description: "Integrate sources smoothly and cite correctly without sounding robotic.",
        isPublished: true,
        isPreview: false,
      },
    ],
  },
  {
    courseId: science1.id,
    lessons: [
      {
        order: 0,
        name: "Lesson 1: Cells & Life Basics",
        description: "Core biology foundations—cells, organelles, and what they do.",
        isPublished: true,
        isPreview: true,
      },
      {
        order: 1,
        name: "Lesson 2: DNA & Genetics Intro",
        description: "Genes, traits, basic inheritance, and how to think through problems.",
        isPublished: true,
        isPreview: false,
      },
    ],
  },
  {
    courseId: science2.id,
    lessons: [
      {
        order: 0,
        name: "Lesson 1: Atoms & Bonding",
        description: "Atomic structure, periodic trends, and why bonding happens.",
        isPublished: true,
        isPreview: true,
      },
      {
        order: 1,
        name: "Lesson 2: Stoichiometry Starter",
        description: "Moles, balancing reactions, and step-by-step calculation habits.",
        isPublished: true,
        isPreview: false,
      },
    ],
  },
  {
    courseId: history1.id,
    lessons: [
      {
        order: 0,
        name: "Lesson 1: Timelines & Cause/Effect",
        description: "How historians connect events and build narratives from facts.",
        isPublished: true,
        isPreview: true,
      },
      {
        order: 1,
        name: "Lesson 2: Writing Strong Responses",
        description: "Answer prompts with context + evidence instead of summaries.",
        isPublished: true,
        isPreview: false,
      },
    ],
  },
  {
    courseId: nursing1.id,
    lessons: [
      {
        order: 0,
        name: "Lesson 1: Patient Safety Essentials",
        description: "Safety basics, infection control, and clinical mindset.",
        isPublished: true,
        isPreview: true,
      },
      {
        order: 1,
        name: "Lesson 2: Vital Signs & Assessment",
        description: "Vitals, what’s normal vs abnormal, and what to do next.",
        isPublished: true,
        isPreview: false,
      },
    ],
  },
  {
    courseId: social1.id,
    lessons: [
      {
        order: 0,
        name: "Lesson 1: Content Strategy Basics",
        description: "How to plan content that matches goals and audience.",
        isPublished: true,
        isPreview: true,
      },
      {
        order: 1,
        name: "Lesson 2: Analytics & Iteration",
        description: "Measure what matters and improve campaigns using data.",
        isPublished: true,
        isPreview: false,
      },
    ],
  },
] as const;

await Promise.all(
  lessonPairs.flatMap(({ courseId, lessons }) =>
    lessons.map((l) =>
      prisma.lesson.upsert({
        where: { courseId_order: { courseId, order: l.order } },
        update: {
          name: l.name,
          description: l.description,
          isPublished: l.isPublished,
          isPreview: l.isPreview,
        },
        create: {
          courseId,
          order: l.order,
          name: l.name,
          description: l.description,
          isPublished: l.isPublished,
          isPreview: l.isPreview,
        },
      })
    )
  )
);

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
