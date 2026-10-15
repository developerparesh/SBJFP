export interface SalaryBenchmark {
  role: string;
  category: string;
  p25: number; // 25th percentile
  p50: number; // Median
  p75: number; // 75th percentile
  p90: number; // 90th percentile
  sampleSize: number;
  topSkills: { skill: string; boostPct: number }[];
  marketTrend: string;
}

export const SALARY_BENCHMARKS: Record<string, Record<string, SalaryBenchmark>> = {
  fresher: {
    frontend: {
      role: "Junior Web / Frontend Developer",
      category: "Frontend",
      p25: 450000,
      p50: 650000,
      p75: 850000,
      p90: 1100000,
      sampleSize: 1240,
      topSkills: [
        { skill: "React", boostPct: 15 },
        { skill: "TypeScript", boostPct: 18 },
        { skill: "Tailwind CSS", boostPct: 10 },
      ],
      marketTrend: "+12% YoY demand for verified React/TypeScript freshers with production git portfolios.",
    },
    android: {
      role: "Junior Android Engineer",
      category: "Mobile",
      p25: 500000,
      p50: 720000,
      p75: 950000,
      p90: 1250000,
      sampleSize: 890,
      topSkills: [
        { skill: "Kotlin", boostPct: 20 },
        { skill: "Jetpack Compose", boostPct: 25 },
        { skill: "REST APIs", boostPct: 12 },
      ],
      marketTrend: "High demand as legacy Java codebases migrate to modern declarative Compose.",
    },
    backend: {
      role: "Junior Backend Developer",
      category: "Backend",
      p25: 480000,
      p50: 700000,
      p75: 900000,
      p90: 1200000,
      sampleSize: 1050,
      topSkills: [
        { skill: "Python", boostPct: 14 },
        { skill: "PostgreSQL", boostPct: 16 },
        { skill: "Git & GitHub", boostPct: 10 },
      ],
      marketTrend: "Growing demand for strong SQL query indexing and API design foundations.",
    },
  },
  "1-3_years": {
    frontend: {
      role: "Frontend Engineer (React / Next.js)",
      category: "Frontend",
      p25: 800000,
      p50: 1250000,
      p75: 1650000,
      p90: 2100000,
      sampleSize: 2100,
      topSkills: [
        { skill: "Next.js", boostPct: 18 },
        { skill: "TypeScript", boostPct: 15 },
        { skill: "State Management", boostPct: 12 },
      ],
      marketTrend: "SSR and Edge runtime knowledge commanding 18% higher compensation.",
    },
    android: {
      role: "Android Developer (Kotlin)",
      category: "Mobile",
      p25: 900000,
      p50: 1400000,
      p75: 1850000,
      p90: 2300000,
      sampleSize: 1450,
      topSkills: [
        { skill: "Jetpack Compose", boostPct: 22 },
        { skill: "Coroutines / Flow", boostPct: 18 },
        { skill: "Room DB", boostPct: 12 },
      ],
      marketTrend: "Offline-first architecture and performance optimization are top screening criteria.",
    },
    backend: {
      role: "Backend Engineer (Go / Python / Node)",
      category: "Backend",
      p25: 950000,
      p50: 1450000,
      p75: 1950000,
      p90: 2500000,
      sampleSize: 1890,
      topSkills: [
        { skill: "Go", boostPct: 24 },
        { skill: "Docker", boostPct: 16 },
        { skill: "PostgreSQL", boostPct: 15 },
      ],
      marketTrend: "Microservices concurrency in Go offers the highest compensation delta.",
    },
  },
  "3-5_years": {
    frontend: {
      role: "Senior Frontend Engineer (Next.js)",
      category: "Frontend",
      p25: 1500000,
      p50: 2100000,
      p75: 2800000,
      p90: 3600000,
      sampleSize: 1820,
      topSkills: [
        { skill: "Next.js Server Components", boostPct: 20 },
        { skill: "Web Vitals / Performance", boostPct: 18 },
        { skill: "Design Systems", boostPct: 14 },
      ],
      marketTrend: "Companies paying top quartile for engineers with proven Core Web Vitals optimization.",
    },
    android: {
      role: "Senior Android Engineer (Jetpack Compose)",
      category: "Mobile",
      p25: 1650000,
      p50: 2350000,
      p75: 3100000,
      p90: 4000000,
      sampleSize: 1320,
      topSkills: [
        { skill: "Jetpack Compose", boostPct: 24 },
        { skill: "Modularization", boostPct: 19 },
        { skill: "CI/CD Pipelines", boostPct: 15 },
      ],
      marketTrend: "Multi-module architecture and clean MVI patterns yield fastest salary progression.",
    },
    backend: {
      role: "Senior Backend / Distributed Systems",
      category: "Backend",
      p25: 1750000,
      p50: 2500000,
      p75: 3400000,
      p90: 4400000,
      sampleSize: 1640,
      topSkills: [
        { skill: "Kubernetes", boostPct: 22 },
        { skill: "Go", boostPct: 25 },
        { skill: "High-Throughput Databases", boostPct: 18 },
      ],
      marketTrend: "Strong distributed caching and event-driven architectures lead the highest CTC bands.",
    },
  },
};
