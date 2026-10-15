"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SAMPLE_JOBS } from "@/lib/sampleJobs";

interface CompanyProfile {
  id: string;
  name: string;
  logo: string;
  headline: string;
  location: string;
  workPolicy: string;
  teamSize: string;
  techStack: string[];
  perks: { icon: string; title: string; desc: string }[];
  engineeringValues: string[];
}

const COMPANIES: Record<string, CompanyProfile> = {
  "techmatrix-labs": {
    id: "techmatrix-labs",
    name: "TechMatrix Labs",
    logo: "🤖",
    headline: "Building the Next-Gen Mobile & Cloud Architecture",
    location: "Bangalore, India",
    workPolicy: "Hybrid (2 Days Office, 3 Days Remote)",
    teamSize: "45 Engineers",
    techStack: ["Kotlin", "Jetpack Compose", "Android SDK", "Room DB", "REST APIs", "CI/CD Pipelines"],
    perks: [
      { icon: "💻", title: "Top-Tier Hardware", desc: "Latest MacBook Pro M-series or Linux workstation of your choice." },
      { icon: "📚", title: "₹50,000 Learning Budget", desc: "Annual stipend for tech conferences, books, and verified certifications." },
      { icon: "🏥", title: "Comprehensive Health", desc: "₹10,00,000 family health cover with OPD and mental wellness support." },
      { icon: "⚡", title: "Async-First Culture", desc: "No endless meetings. We communicate clearly through design docs and PRs." },
    ],
    engineeringValues: [
      "We value explainable architecture over premature optimizations.",
      "Zero-tolerance for whiteboard trivia—interviews reflect real-world problem solving.",
      "Every engineer owns their features from prototype to production observability.",
    ],
  },
  "codecraft-studios": {
    id: "codecraft-studios",
    name: "CodeCraft Studios",
    logo: "🌱",
    headline: "Where High-Growth Freshers and Experienced Builders Craft Web Apps",
    location: "Remote / Hyderabad, India",
    workPolicy: "100% Remote Anywhere in India",
    teamSize: "28 Engineers",
    techStack: ["JavaScript", "React", "TypeScript", "Tailwind CSS", "Node.js", "Git & GitHub"],
    perks: [
      { icon: "🌱", title: "Fresher Accelerator", desc: "1-on-1 dedicated mentorship and paired programming from Day 1." },
      { icon: "🏠", title: "Home Office Stipend", desc: "₹35,000 reimbursement for ergonomic chairs, desks, and fast internet." },
      { icon: "🌴", title: "Flexible Time Off", desc: "24 paid vacation days + mandatory recharge weeks twice a year." },
      { icon: "🚀", title: "High Ownership", desc: "Ship customer-facing features directly to production in your first sprint." },
    ],
    engineeringValues: [
      "We believe practical skills matter more than college prestige.",
      "Transparent compensation: fixed salaries clearly posted on all job descriptions.",
      "Continuous feedback and constructive code reviews without gatekeeping.",
    ],
  },
  "apex-cloud": {
    id: "apex-cloud",
    name: "Apex Cloud Innovations",
    logo: "⚡",
    headline: "High-Throughput Distributed Cloud Systems & Data Platforms",
    location: "Remote / Pune, India",
    workPolicy: "Remote First",
    teamSize: "60 Engineers",
    techStack: ["TypeScript", "Next.js", "Supabase", "PostgreSQL", "Docker", "Redis"],
    perks: [
      { icon: "📈", title: "Competitive ESOPs", desc: "Real equity grants with generous vesting and buyback programs." },
      { icon: "🌐", title: "Remote Flexibility", desc: "Work from anywhere in India with flexible working hours." },
      { icon: "🎓", title: "Conference Sponsorship", desc: "Company pays all travel and tickets for speaking at developer summits." },
      { icon: "🧘", title: "Wellness Allowance", desc: "Monthly fitness, gym, and meditation subscription reimbursement." },
    ],
    engineeringValues: [
      "Simplicity in system design beats clever complexity every time.",
      "Database indexing, connection pooling, and latency are first-class considerations.",
      "Blameless post-mortems and shared accountability.",
    ],
  },
};

export default function CompanyShowcasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const companySlug = resolvedParams.id.toLowerCase();
  const company = COMPANIES[companySlug] || {
    id: companySlug,
    name: companySlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    logo: "🏢",
    headline: "Engineering Excellence & Transparent Career Growth",
    location: "Bangalore / Remote, India",
    workPolicy: "Flexible Remote & Hybrid",
    teamSize: "35+ Engineers",
    techStack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Git & GitHub"],
    perks: [
      { icon: "💻", title: "Modern Equipment", desc: "High-performance developer laptop provided on Day 1." },
      { icon: "🏥", title: "Health Insurance", desc: "Complete family healthcare coverage." },
      { icon: "📚", title: "Learning Allowance", desc: "Annual budget for courses and books." },
    ],
    engineeringValues: [
      "Structured skill matching without keyword resume filters.",
      "Transparent compensation and transparent interview expectations.",
    ],
  };

  // Find jobs posted by this company or matching title/stack
  const openRoles = SAMPLE_JOBS.filter(
    (j) =>
      j.company_name.toLowerCase().includes(company.name.toLowerCase().split(" ")[0]) ||
      company.name.toLowerCase().includes(j.company_name.toLowerCase().split(" ")[0])
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#0b1320] text-slate-100 font-sans selection:bg-[#42D6A4]/30">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <Link href="/jobs" className="hover:text-[#42D6A4] transition-colors">Jobs Directory</Link>
          <span>/</span>
          <span className="text-slate-200">Company Showcase</span>
          <span>/</span>
          <span className="text-[#42D6A4] font-semibold">{company.name}</span>
        </div>

        {/* Hero Company Banner */}
        <div className="bg-[#102A43]/80 border border-slate-700/80 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl mb-10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#1479C9]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-slate-800">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-4xl shadow-xl flex-shrink-0">
              {company.logo}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  ✓ Verified Hiring Partner
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-300 font-medium">📍 {company.location}</span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-300 font-medium">👥 {company.teamSize}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {company.name}
              </h1>
              <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
                {company.headline}
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-4 text-center min-w-[160px] self-stretch sm:self-auto flex flex-col justify-center">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Work Policy</div>
              <div className="text-sm font-bold text-[#42D6A4] mt-1">{company.workPolicy}</div>
            </div>
          </div>

          {/* Primary Tech Stack */}
          <div className="pt-6">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Core Engineering Stack
            </div>
            <div className="flex flex-wrap gap-2">
              {company.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-200 shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 2-Column Details: Engineering Values & Verified Perks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Engineering Values */}
          <div className="lg:col-span-2 bg-[#102A43]/50 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>⚡</span> Engineering Culture &amp; Architecture Principles
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                How technical decisions and interviews are conducted at {company.name}.
              </p>
            </div>

            <div className="space-y-3">
              {company.engineeringValues.map((val, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                    {val}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits & Perks */}
          <div className="bg-[#102A43]/50 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>🎁</span> Verified Perks &amp; Benefits
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Transparent compensations &amp; stipends.
              </p>
            </div>

            <div className="space-y-4">
              {company.perks.map((perk) => (
                <div key={perk.title} className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">{perk.icon}</span>
                  <div>
                    <h3 className="text-xs font-bold text-white">{perk.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{perk.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Open Roles at this Company */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
                <span>💼</span> Open Engineering Roles ({openRoles.length > 0 ? openRoles.length : 1})
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                All roles feature verified skill matching and upfront transparent INR salary bands.
              </p>
            </div>
            <Link
              href="/jobs"
              className="text-xs font-bold text-[#42D6A4] hover:underline"
            >
              Browse all platform jobs →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(openRoles.length > 0 ? openRoles : [SAMPLE_JOBS[0]]).map((job) => (
              <div
                key={job.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                      {job.experience_level === "fresher" ? "🌱 Fresher Friendly" : "💼 Experienced"}
                    </span>
                    <span className="text-xs font-bold text-emerald-400">
                      ₹{job.salary_min?.toLocaleString("en-IN")} - ₹{job.salary_max?.toLocaleString("en-IN")} / yr
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{job.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                  <span className="text-xs text-slate-400">{job.location}</span>
                  <Link
                    href={`/jobs/${job.id}`}
                    className="px-4 py-2 bg-[#1479C9] hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition"
                  >
                    Simulate Match &amp; Apply →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
