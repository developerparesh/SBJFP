-- ==============================================================================
-- SBJFP — Skill-Based Job Finding Platform
-- Phase 3: Initial Database Schema, Indexes & Row Level Security (RLS)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 2. TABLE: public.profiles
-- Linked to Supabase Auth users. Stores candidate or employer identity.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('candidate', 'employer')),
  full_name TEXT NOT NULL,
  company_name TEXT,
  avatar_url TEXT,
  headline TEXT,
  bio TEXT,
  location TEXT,
  phone TEXT,
  website_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles (role);

-- ------------------------------------------------------------------------------
-- 3. TABLE: public.skills
-- Taxonomy of verified skills, programming languages, tools, and frameworks.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('Languages', 'Frameworks', 'Databases', 'Cloud & DevOps', 'Tools', 'Other')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS skills_category_idx ON public.skills (category);
CREATE INDEX IF NOT EXISTS skills_name_trgm_idx ON public.skills (name);

-- ------------------------------------------------------------------------------
-- 4. TABLE: public.candidate_skills
-- Junction table associating candidates with structured skills and experience.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.candidate_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  proficiency_level TEXT NOT NULL DEFAULT 'intermediate' CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  years_experience NUMERIC(4, 1) DEFAULT 1.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT candidate_skills_unique UNIQUE (candidate_id, skill_id)
);

CREATE INDEX IF NOT EXISTS candidate_skills_candidate_id_idx ON public.candidate_skills (candidate_id);
CREATE INDEX IF NOT EXISTS candidate_skills_skill_id_idx ON public.candidate_skills (skill_id);

-- ------------------------------------------------------------------------------
-- 5. TABLE: public.jobs
-- Structured job postings by employers with transparent salary & thresholds.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  employment_type TEXT NOT NULL DEFAULT 'full-time' CHECK (employment_type IN ('full-time', 'part-time', 'contract', 'remote', 'internship')),
  location TEXT NOT NULL DEFAULT 'Remote',
  is_remote BOOLEAN NOT NULL DEFAULT true,
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency TEXT NOT NULL DEFAULT 'INR',
  salary_period TEXT NOT NULL DEFAULT 'yearly' CHECK (salary_period IN ('yearly', 'monthly', 'hourly')),
  min_match_threshold INTEGER DEFAULT 70 CHECK (min_match_threshold IS NULL OR (min_match_threshold >= 0 AND min_match_threshold <= 100)),
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS jobs_employer_id_idx ON public.jobs (employer_id);
CREATE INDEX IF NOT EXISTS jobs_status_idx ON public.jobs (status);
CREATE INDEX IF NOT EXISTS jobs_created_at_idx ON public.jobs (created_at DESC);

-- ------------------------------------------------------------------------------
-- 6. TABLE: public.job_skills
-- Required and preferred skills per job posting to enable explainable matching.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.job_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  is_required BOOLEAN NOT NULL DEFAULT true,
  min_years NUMERIC(4, 1) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT job_skills_unique UNIQUE (job_id, skill_id)
);

CREATE INDEX IF NOT EXISTS job_skills_job_id_idx ON public.job_skills (job_id);
CREATE INDEX IF NOT EXISTS job_skills_skill_id_idx ON public.job_skills (skill_id);

-- ------------------------------------------------------------------------------
-- 7. TABLE: public.job_applications
-- Transparent application tracking and employer activity audit.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'viewed', 'shortlisted', 'interview_scheduled', 'rejected', 'accepted')),
  match_score INTEGER NOT NULL DEFAULT 0,
  cover_note TEXT,
  employer_viewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT job_applications_unique UNIQUE (job_id, candidate_id)
);

CREATE INDEX IF NOT EXISTS job_applications_job_id_idx ON public.job_applications (job_id);
CREATE INDEX IF NOT EXISTS job_applications_candidate_id_idx ON public.job_applications (candidate_id);
CREATE INDEX IF NOT EXISTS job_applications_status_idx ON public.job_applications (status);

-- ==============================================================================
-- 8. AUTOMATIC PROFILE CREATION TRIGGER
-- When a user registers through Supabase Auth, populate public.profiles row.
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name, company_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'candidate'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'company_name'
  )
  ON CONFLICT (id) DO UPDATE
  SET
    full_name = EXCLUDED.full_name,
    company_name = EXCLUDED.company_name;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- High-performance RLS with cached (select auth.uid()) patterns.
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- 9.1 PROFILES POLICIES
-- Anyone can view basic public profile details
CREATE POLICY "Profiles are publicly readable"
  ON public.profiles FOR SELECT
  USING (true);

-- Users can update only their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING ((SELECT auth.uid()) = id);

-- 9.2 SKILLS POLICIES
-- Skills taxonomy is readable by all authenticated and anonymous visitors
CREATE POLICY "Skills are readable by everyone"
  ON public.skills FOR SELECT
  USING (true);

-- 9.3 CANDIDATE SKILLS POLICIES
-- Candidates can manage their own skills
CREATE POLICY "Candidates can read all candidate skills"
  ON public.candidate_skills FOR SELECT
  USING (true);

CREATE POLICY "Candidates can insert own skills"
  ON public.candidate_skills FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = candidate_id);

CREATE POLICY "Candidates can update own skills"
  ON public.candidate_skills FOR UPDATE
  USING ((SELECT auth.uid()) = candidate_id);

CREATE POLICY "Candidates can delete own skills"
  ON public.candidate_skills FOR DELETE
  USING ((SELECT auth.uid()) = candidate_id);

-- 9.4 JOBS POLICIES
-- Anyone can browse published jobs; employers can view their own drafts
CREATE POLICY "Jobs are readable by all if published, or by owning employer"
  ON public.jobs FOR SELECT
  USING (status = 'published' OR (SELECT auth.uid()) = employer_id);

CREATE POLICY "Employers can insert own jobs"
  ON public.jobs FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = employer_id);

CREATE POLICY "Employers can update own jobs"
  ON public.jobs FOR UPDATE
  USING ((SELECT auth.uid()) = employer_id);

CREATE POLICY "Employers can delete own jobs"
  ON public.jobs FOR DELETE
  USING ((SELECT auth.uid()) = employer_id);

-- 9.5 JOB SKILLS POLICIES
CREATE POLICY "Job skills are readable by everyone"
  ON public.job_skills FOR SELECT
  USING (true);

CREATE POLICY "Employers can manage job skills for own jobs"
  ON public.job_skills FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.jobs
      WHERE jobs.id = job_skills.job_id
        AND jobs.employer_id = (SELECT auth.uid())
    )
  );

-- 9.6 JOB APPLICATIONS POLICIES
-- Candidates can view their own applications; Employers can view applications for their jobs
CREATE POLICY "Candidates can view own applications"
  ON public.job_applications FOR SELECT
  USING (
    (SELECT auth.uid()) = candidate_id
    OR EXISTS (
      SELECT 1 FROM public.jobs
      WHERE jobs.id = job_applications.job_id
        AND jobs.employer_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Candidates can apply to jobs"
  ON public.job_applications FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = candidate_id);

CREATE POLICY "Employers can update application status for their jobs"
  ON public.job_applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.jobs
      WHERE jobs.id = job_applications.job_id
        AND jobs.employer_id = (SELECT auth.uid())
    )
  );

-- ==============================================================================
-- 10. SEED DATA: Standard Technical Skills
-- ==============================================================================
INSERT INTO public.skills (name, category) VALUES
  ('Kotlin', 'Languages'),
  ('Java', 'Languages'),
  ('TypeScript', 'Languages'),
  ('JavaScript', 'Languages'),
  ('Python', 'Languages'),
  ('Go', 'Languages'),
  ('Rust', 'Languages'),
  ('Swift', 'Languages'),
  ('SQL', 'Languages'),
  ('Jetpack Compose', 'Frameworks'),
  ('Android SDK', 'Frameworks'),
  ('React', 'Frameworks'),
  ('Next.js', 'Frameworks'),
  ('Flutter', 'Frameworks'),
  ('Node.js', 'Frameworks'),
  ('Tailwind CSS', 'Frameworks'),
  ('Spring Boot', 'Frameworks'),
  ('PostgreSQL', 'Databases'),
  ('Supabase', 'Databases'),
  ('Room DB', 'Databases'),
  ('MongoDB', 'Databases'),
  ('Redis', 'Databases'),
  ('Docker', 'Cloud & DevOps'),
  ('Kubernetes', 'Cloud & DevOps'),
  ('Cloudflare Workers', 'Cloud & DevOps'),
  ('AWS', 'Cloud & DevOps'),
  ('GCP', 'Cloud & DevOps'),
  ('REST APIs', 'Tools'),
  ('GraphQL', 'Tools'),
  ('Git & GitHub', 'Tools'),
  ('CI/CD Pipelines', 'Tools'),
  ('Hilt / Dagger', 'Tools')
ON CONFLICT (name) DO NOTHING;
