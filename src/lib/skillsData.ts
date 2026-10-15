import { SkillCategory, ProficiencyLevel } from "@/types/database";

export interface SkillDefinition {
  name: string;
  category: SkillCategory;
}

export const PRESET_SKILLS: SkillDefinition[] = [
  // Languages
  { name: "Kotlin", category: "Languages" },
  { name: "Java", category: "Languages" },
  { name: "TypeScript", category: "Languages" },
  { name: "JavaScript", category: "Languages" },
  { name: "Python", category: "Languages" },
  { name: "Go", category: "Languages" },
  { name: "Rust", category: "Languages" },
  { name: "Swift", category: "Languages" },
  { name: "SQL", category: "Languages" },

  // Frameworks
  { name: "Jetpack Compose", category: "Frameworks" },
  { name: "Android SDK", category: "Frameworks" },
  { name: "React", category: "Frameworks" },
  { name: "Next.js", category: "Frameworks" },
  { name: "Flutter", category: "Frameworks" },
  { name: "Node.js", category: "Frameworks" },
  { name: "Tailwind CSS", category: "Frameworks" },
  { name: "Spring Boot", category: "Frameworks" },

  // Databases
  { name: "PostgreSQL", category: "Databases" },
  { name: "Supabase", category: "Databases" },
  { name: "Room DB", category: "Databases" },
  { name: "MongoDB", category: "Databases" },
  { name: "Redis", category: "Databases" },

  // Cloud & DevOps
  { name: "Docker", category: "Cloud & DevOps" },
  { name: "Kubernetes", category: "Cloud & DevOps" },
  { name: "Cloudflare Workers", category: "Cloud & DevOps" },
  { name: "AWS", category: "Cloud & DevOps" },
  { name: "GCP", category: "Cloud & DevOps" },

  // Tools
  { name: "REST APIs", category: "Tools" },
  { name: "GraphQL", category: "Tools" },
  { name: "Git & GitHub", category: "Tools" },
  { name: "CI/CD Pipelines", category: "Tools" },
  { name: "Hilt / Dagger", category: "Tools" },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  "Languages",
  "Frameworks",
  "Databases",
  "Cloud & DevOps",
  "Tools",
];

export interface CandidateSkillState {
  skillName: string;
  category: SkillCategory;
  proficiency: ProficiencyLevel;
  yearsExperience: number;
}

export const QUICK_PRESETS: {
  title: string;
  role: string;
  icon: string;
  skills: { skillName: string; proficiency: ProficiencyLevel; yearsExperience: number }[];
}[] = [
  {
    title: "Android Specialist",
    role: "Mobile App Engineer",
    icon: "🤖",
    skills: [
      { skillName: "Kotlin", proficiency: "advanced", yearsExperience: 3 },
      { skillName: "Jetpack Compose", proficiency: "advanced", yearsExperience: 2 },
      { skillName: "Android SDK", proficiency: "expert", yearsExperience: 4 },
      { skillName: "Room DB", proficiency: "intermediate", yearsExperience: 2 },
      { skillName: "REST APIs", proficiency: "advanced", yearsExperience: 3 },
      { skillName: "Git & GitHub", proficiency: "advanced", yearsExperience: 4 },
    ],
  },
  {
    title: "Full-Stack Next.js / Supabase",
    role: "Modern Web Engineer",
    icon: "⚡",
    skills: [
      { skillName: "TypeScript", proficiency: "advanced", yearsExperience: 3 },
      { skillName: "Next.js", proficiency: "advanced", yearsExperience: 2 },
      { skillName: "React", proficiency: "expert", yearsExperience: 4 },
      { skillName: "Supabase", proficiency: "intermediate", yearsExperience: 1 },
      { skillName: "Tailwind CSS", proficiency: "advanced", yearsExperience: 3 },
      { skillName: "PostgreSQL", proficiency: "intermediate", yearsExperience: 2 },
      { skillName: "Git & GitHub", proficiency: "advanced", yearsExperience: 4 },
    ],
  },
  {
    title: "Backend Go / Python",
    role: "Services & Data Engineer",
    icon: "⚙️",
    skills: [
      { skillName: "Python", proficiency: "expert", yearsExperience: 4 },
      { skillName: "SQL", proficiency: "expert", yearsExperience: 4 },
      { skillName: "PostgreSQL", proficiency: "advanced", yearsExperience: 3 },
      { skillName: "REST APIs", proficiency: "advanced", yearsExperience: 3 },
      { skillName: "Docker", proficiency: "intermediate", yearsExperience: 2 },
      { skillName: "Redis", proficiency: "intermediate", yearsExperience: 2 },
    ],
  },
];
