export interface RoadmapMilestone {
  dayRange: string;
  phaseTitle: string;
  focusSkill: string;
  scoreImpact: number; // e.g. +12%
  objective: string;
  tasks: {
    id: string;
    title: string;
    desc: string;
    resourceName: string;
    resourceUrl: string;
  }[];
}

export interface TargetRoadmap {
  jobId: string;
  targetRole: string;
  companyName: string;
  currentScore: number;
  projectedScore: number;
  missingSkills: string[];
  overview: string;
  milestones: RoadmapMilestone[];
}

export const ROADMAP_PRESETS: Record<string, TargetRoadmap> = {
  "job-android-001": {
    jobId: "job-android-001",
    targetRole: "Senior Android Developer",
    companyName: "TechMatrix Labs",
    currentScore: 72,
    projectedScore: 94,
    missingSkills: ["Jetpack Compose", "Room DB", "CI/CD Pipelines"],
    overview: "Bridge the gap from imperative XML Android to modern reactive Jetpack Compose and local SQLite caching with Room DB. Completing these 3 phases raises your match score from 72% to 94%.",
    milestones: [
      {
        dayRange: "Days 1–4",
        phaseTitle: "Phase 1: Declarative UI & State Hoisting in Compose",
        focusSkill: "Jetpack Compose",
        scoreImpact: 14,
        objective: "Master Compose state management, rememberSaveable, and unidirectional data flow (UDF).",
        tasks: [
          {
            id: "t1",
            title: "Study State Hoisting & MutableStateOf in Composable functions",
            desc: "Learn how to decouple UI rendering from state mutation using stateless composables and lambda event passing.",
            resourceName: "Official Android State in Compose Docs",
            resourceUrl: "https://developer.android.com/develop/ui/compose/state",
          },
          {
            id: "t2",
            title: "Implement a dynamic scrollable list with LazyColumn and itemsIndexed",
            desc: "Build a responsive feed with item keys to ensure optimized recomposition during filtering.",
            resourceName: "Compose Lists & Grids Guide",
            resourceUrl: "https://developer.android.com/develop/ui/compose/lists",
          },
        ],
      },
      {
        dayRange: "Days 5–9",
        phaseTitle: "Phase 2: Offline-First Local Data with Room DB",
        focusSkill: "Room DB",
        scoreImpact: 10,
        objective: "Implement SQLite entity schema, DAO interfaces, and reactive Flow emissions.",
        tasks: [
          {
            id: "t3",
            title: "Define Room Entity and DAO with suspend queries & Flow streams",
            desc: "Create an offline cache table with primary keys, indexes, and continuous Flow observations.",
            resourceName: "Save Data in a Local Database Using Room",
            resourceUrl: "https://developer.android.com/training/data-storage/room",
          },
          {
            id: "t4",
            title: "Implement Room Migrations and In-Memory Testing",
            desc: "Write unit tests using Room.inMemoryDatabaseBuilder to verify database write/read integrity without emulators.",
            resourceName: "Testing Room Databases Guide",
            resourceUrl: "https://developer.android.com/training/data-storage/room/testing-db",
          },
        ],
      },
      {
        dayRange: "Days 10–14",
        phaseTitle: "Phase 3: Clean MVVM Integration & Skill Verification",
        focusSkill: "CI/CD Pipelines",
        scoreImpact: 8,
        objective: "Combine Compose + ViewModel + Room into an end-to-end repository pattern and pass the SBJFP Skill Assessment.",
        tasks: [
          {
            id: "t5",
            title: "Connect Repository pattern with StateFlow in ViewModel",
            desc: "Expose UI state via StateFlow with SharingStarted.WhileSubscribed(5000) to optimize battery & resources.",
            resourceName: "Architecture: ViewModel Flow Best Practices",
            resourceUrl: "https://developer.android.com/topic/architecture/ui-layer/state-production",
          },
          {
            id: "t6",
            title: "Take SBJFP Kotlin & Compose Skill Assessment",
            desc: "Complete the 3-minute verified quiz on your candidate dashboard to earn the Verified Skill Badge 🏅.",
            resourceName: "Candidate Skill Assessment Portal",
            resourceUrl: "/dashboard/candidate",
          },
        ],
      },
    ],
  },
  "job-fullstack-002": {
    jobId: "job-fullstack-002",
    targetRole: "Full-Stack Next.js & Supabase Engineer",
    companyName: "Apex Cloud Innovations",
    currentScore: 68,
    projectedScore: 92,
    missingSkills: ["Supabase", "PostgreSQL", "Docker"],
    overview: "Accelerate your fullstack capabilities by mastering Supabase Row Level Security (RLS), Server Actions, and Postgres indexing.",
    milestones: [
      {
        dayRange: "Days 1–4",
        phaseTitle: "Phase 1: PostgreSQL Schemas & Row Level Security (RLS)",
        focusSkill: "PostgreSQL",
        scoreImpact: 12,
        objective: "Design relational schemas and write strict multi-tenant RLS security policies.",
        tasks: [
          {
            id: "t201",
            title: "Implement Row Level Security (RLS) on PostgreSQL tables",
            desc: "Write granular auth.uid() = user_id policies for SELECT, INSERT, UPDATE, and DELETE operations.",
            resourceName: "Supabase RLS Architecture Guide",
            resourceUrl: "https://supabase.com/docs/guides/auth/row-level-security",
          },
          {
            id: "t202",
            title: "Database Indexing & Query Plan Optimization",
            desc: "Use EXPLAIN ANALYZE to verify B-Tree index utilization on foreign key lookups.",
            resourceName: "PostgreSQL Indexing Essentials",
            resourceUrl: "https://www.postgresql.org/docs/current/indexes.html",
          },
        ],
      },
      {
        dayRange: "Days 5–9",
        phaseTitle: "Phase 2: Next.js Server Actions & Real-Time Supabase",
        focusSkill: "Supabase",
        scoreImpact: 14,
        objective: "Build end-to-end mutations with Next.js 15 Server Actions and Supabase SSR clients.",
        tasks: [
          {
            id: "t203",
            title: "Implement Server Actions with revalidatePath and Zod validation",
            desc: "Safely execute mutations on the server with progressive enhancement and type-safe schemas.",
            resourceName: "Next.js Server Actions Documentation",
            resourceUrl: "https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations",
          },
          {
            id: "t204",
            title: "Configure Supabase SSR middleware and cookie sessions",
            desc: "Ensure seamless session token refresh and auth guards on server components.",
            resourceName: "Supabase SSR Client Architecture",
            resourceUrl: "https://supabase.com/docs/guides/auth/server-side/nextjs",
          },
        ],
      },
      {
        dayRange: "Days 10–14",
        phaseTitle: "Phase 3: Containerization & Cloudflare Edge Verification",
        focusSkill: "Docker",
        scoreImpact: 8,
        objective: "Package fullstack application in multi-stage Docker builds and verify deployment.",
        tasks: [
          {
            id: "t205",
            title: "Write multi-stage Dockerfile for Next.js standalone output",
            desc: "Produce a lightweight ~80MB production image using Alpine node runtime.",
            resourceName: "Next.js Standalone Docker Deployment",
            resourceUrl: "https://github.com/vercel/next.js/tree/canary/examples/with-docker",
          },
          {
            id: "t206",
            title: "Take SBJFP TypeScript & SQL Skill Assessments",
            desc: "Pass the 3-minute interactive quizzes to unlock Verified Badges on your profile.",
            resourceName: "SBJFP Assessment Hub",
            resourceUrl: "/dashboard/candidate",
          },
        ],
      },
    ],
  },
};
