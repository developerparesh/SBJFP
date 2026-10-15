"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SAMPLE_JOBS } from "@/lib/sampleJobs";
import { EmploymentType, ExperienceLevel } from "@/types/database";

export default function PublicJobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExp, setSelectedExp] = useState<string>("all");
  const [filterRemoteOnly, setFilterRemoteOnly] = useState(false);
  const [filterFresherOnly, setFilterFresherOnly] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("all");

  const filteredJobs = useMemo(() => {
    return SAMPLE_JOBS.filter((job) => {
      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        job.title.toLowerCase().includes(query) ||
        job.company_name.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.requirements.some((r) => r.skillName.toLowerCase().includes(query));

      // Exp match
      const isFresherJob = job.min_experience_years === 0 || job.experience_level === "fresher";
      let matchesExp = true;
      if (selectedExp === "fresher" || filterFresherOnly) {
        matchesExp = isFresherJob;
      } else if (selectedExp === "1-3_years") {
        matchesExp = job.experience_level === "1-3_years" || (job.min_experience_years !== undefined && job.min_experience_years >= 1 && job.min_experience_years <= 3);
      } else if (selectedExp === "3-5_years") {
        matchesExp = job.experience_level === "3-5_years" || (job.min_experience_years !== undefined && job.min_experience_years > 3);
      }

      // Remote
      const matchesRemote = !filterRemoteOnly || job.is_remote;

      // Type
      const matchesType = selectedType === "all" || job.employment_type === selectedType;

      return matchesSearch && matchesExp && matchesRemote && matchesType;
    });
  }, [searchQuery, selectedExp, filterRemoteOnly, filterFresherOnly, selectedType]);

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col font-sans">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Hero */}
        <div className="rounded-2xl p-8 sm:p-10 text-white mb-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6" style={{ backgroundColor: "var(--navy)" }}>
          <div className="space-y-3">
            <span className="text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-white/10 text-[var(--mint)] inline-block">
              Skill-Based Opportunities • Transparent Salaries
            </span>
            <h1 className="text-3xl sm:text-4xl font-black">
              Explore Verified Tech Roles
            </h1>
            <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
              Every job listing has structured required skills, preferred bonuses, minimum qualifications, and verified compensation ranges upfront.
            </p>
          </div>

          <div className="bg-white/10 p-5 rounded-2xl border border-white/10 text-center min-w-[200px]">
            <span className="text-3xl font-black text-[var(--mint)] block">{SAMPLE_JOBS.length}</span>
            <span className="text-xs text-slate-300 uppercase tracking-wider font-semibold">Active Postings</span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-8 space-y-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role, skill (e.g. Kotlin, React, Python, Supabase), or company..."
              className="w-full py-3 pl-11 pr-4 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[var(--blue)] font-medium"
            />
            <svg className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              {/* Freshers Quick Toggle */}
              <label className="flex items-center gap-2 font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 cursor-pointer transition hover:bg-emerald-100">
                <input
                  type="checkbox"
                  checked={filterFresherOnly}
                  onChange={(e) => setFilterFresherOnly(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>🌱 Freshers Welcome Only</span>
              </label>

              {/* Remote Toggle */}
              <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterRemoteOnly}
                  onChange={(e) => setFilterRemoteOnly(e.target.checked)}
                  className="rounded text-[var(--blue)] focus:ring-[var(--blue)]"
                />
                <span>Remote Only</span>
              </label>

              {/* Experience Dropdown */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-semibold">Experience:</span>
                <select
                  value={selectedExp}
                  onChange={(e) => setSelectedExp(e.target.value)}
                  className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 font-bold text-slate-700"
                >
                  <option value="all">All Experience Levels</option>
                  <option value="fresher">🌱 Freshers (0 Yrs)</option>
                  <option value="1-3_years">⚡ 1 - 3 Years</option>
                  <option value="3-5_years">💼 3+ Years</option>
                </select>
              </div>

              {/* Employment Type */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-semibold">Type:</span>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 font-bold text-slate-700"
                >
                  <option value="all">All Types</option>
                  <option value="full-time">Full-time</option>
                  <option value="contract">Contract</option>
                </select>
              </div>
            </div>

            <span className="text-slate-400 font-semibold">
              Showing {filteredJobs.length} of {SAMPLE_JOBS.length} opportunities
            </span>
          </div>
        </div>

        {/* Job Cards Grid */}
        <div className="space-y-4">
          {filteredJobs.map((job) => {
            const isFresher = job.min_experience_years === 0 || job.experience_level === "fresher";

            return (
              <div
                key={job.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-[var(--blue)] transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-extrabold text-slate-900">{job.title}</h2>
                      {isFresher && (
                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                          🌱 Freshers Welcome
                        </span>
                      )}
                      {job.is_remote && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[var(--blue)] border border-blue-200">
                          Remote
                        </span>
                      )}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 capitalize">
                        {job.employment_type}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-500">
                      {job.company_name} • {job.location}
                    </p>
                  </div>

                  <div className="flex flex-col sm:items-end gap-1">
                    <div className="text-xs font-black text-slate-900 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                      ₹{job.salary_min?.toLocaleString("en-IN")} - ₹{job.salary_max?.toLocaleString("en-IN")} / yr
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Match Threshold: {job.min_match_threshold}%
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{job.description}</p>

                {/* Qualification & Experience Strip */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 py-2 border-y border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-400">Experience:</span>
                    <span className="font-extrabold text-slate-800">
                      {isFresher ? "🌱 Freshers (0 Yrs)" : `💼 ${job.min_experience_years}+ Years`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-400">Education:</span>
                    <span className="font-extrabold text-slate-800">
                      🎓 {job.min_qualification || "Open to Any Degree"}
                    </span>
                  </div>
                </div>

                {/* Structured Requirements Pills */}
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-2">
                    Required & Preferred Skills:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.map((req) => (
                      <span
                        key={req.skillName}
                        className={`text-xs px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 ${
                          req.isRequired
                            ? "bg-blue-50 text-[var(--blue)] border border-blue-200"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <span>{req.isRequired ? "★" : "○"}</span>
                        <span>{req.skillName}</span>
                        {req.minYears > 0 && (
                          <span className="text-[10px] text-slate-400">({req.minYears}+ yrs)</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400">
                    Posted {new Date(job.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/jobs/${job.id}`}
                      className="text-xs font-bold py-2 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
                    >
                      Calculate My Match →
                    </Link>
                    <Link
                      href={`/auth/signup?role=candidate&redirect=/jobs/${job.id}`}
                      className="text-xs font-bold py-2 px-4 rounded-xl bg-[var(--blue)] text-white hover:opacity-90 shadow-sm transition"
                    >
                      1-Click Apply
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredJobs.length === 0 && (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
              <span className="text-3xl block">🔍</span>
              <p className="text-sm font-bold text-slate-800">No jobs matching your search criteria</p>
              <p className="text-xs text-slate-400">
                Try clearing filters or search for another technology like Kotlin, Next.js, or React.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
