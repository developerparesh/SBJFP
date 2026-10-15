# SBJFP — Skill-Based Job Finding Platform

> **Skills meet opportunity.**

## Overview

SBJFP is a skills-based job finding platform being built to connect candidates and employers through structured skill matching, transparent salary information, and clear application tracking.

## Project Status

🚧 **Phase 1 — Landing Page** (current)

The landing page is live. Candidate registration, employer dashboard, job application system, and interview booking are **planned** and not yet operational.

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript, static export)
- **Styling:** Tailwind CSS v4
- **Backend:** Supabase (PostgreSQL + Auth + Row Level Security)
- **Hosting:** Cloudflare Pages

## Local Development

```bash
# 1. Copy env template and fill in your Supabase anon key
cp .env.example .env.local

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Build for Production

```bash
npm run build   # outputs static site to /out
```

## Deployment

See [CLOUDFLARE.md](./CLOUDFLARE.md) for Cloudflare Pages setup instructions.

## Environment Variables

| Variable | Where to get it | Safe for browser? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → anon public | ✅ Yes |

⚠️ **Never** commit `service_role` key, database password, or JWT secret.

## Project Structure

```
src/
  app/          # Next.js App Router pages and layout
  components/
    sections/   # Landing page section components
    Header.tsx
    Footer.tsx
  lib/
    supabase.ts # Browser-safe Supabase client
public/
  logo.png      # SBJFP brand logo
```
