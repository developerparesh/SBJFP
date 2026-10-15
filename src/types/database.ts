export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "candidate" | "employer";
export type SkillCategory = "Languages" | "Frameworks" | "Databases" | "Cloud & DevOps" | "Tools" | "Other";
export type ProficiencyLevel = "beginner" | "intermediate" | "advanced" | "expert";
export type EmploymentType = "full-time" | "part-time" | "contract" | "remote" | "internship";
export type SalaryPeriod = "yearly" | "monthly" | "hourly";
export type JobStatus = "draft" | "published" | "closed";
export type ApplicationStatus = "submitted" | "viewed" | "shortlisted" | "interview_scheduled" | "rejected" | "accepted";

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  company_name: string | null;
  avatar_url: string | null;
  headline: string | null;
  bio: string | null;
  location: string | null;
  phone: string | null;
  website_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  created_at: string;
}

export interface CandidateSkill {
  id: string;
  candidate_id: string;
  skill_id: string;
  proficiency_level: ProficiencyLevel;
  years_experience: number;
  created_at: string;
  skill?: Skill;
}

export interface Job {
  id: string;
  employer_id: string;
  title: string;
  description: string;
  employment_type: EmploymentType;
  location: string;
  is_remote: boolean;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  salary_period: SalaryPeriod;
  min_match_threshold: number | null;
  status: JobStatus;
  created_at: string;
  updated_at: string;
  skills?: JobSkill[];
  employer?: Profile;
}

export interface JobSkill {
  id: string;
  job_id: string;
  skill_id: string;
  is_required: boolean;
  min_years: number;
  created_at: string;
  skill?: Skill;
}

export interface JobApplication {
  id: string;
  job_id: string;
  candidate_id: string;
  status: ApplicationStatus;
  match_score: number;
  cover_note: string | null;
  employer_viewed_at: string | null;
  created_at: string;
  updated_at: string;
  job?: Job;
  candidate?: Profile;
}

export type SlotStatus = "available" | "booked" | "completed" | "cancelled";

export interface InterviewSlot {
  id: string;
  job_id: string;
  job_title: string;
  employer_id?: string;
  candidate_id?: string | null;
  candidate_name?: string | null;
  date: string; // e.g. "2026-10-18"
  time: string; // e.g. "10:30 AM - 11:15 AM"
  duration_minutes: number;
  meeting_link?: string;
  notes?: string;
  status: SlotStatus;
  created_at: string;
}

