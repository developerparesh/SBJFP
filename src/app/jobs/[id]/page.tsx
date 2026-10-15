"use client";

import React, { useState, useMemo, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SAMPLE_JOBS } from "@/lib/sampleJobs";
import { calculateSkillMatch } from "@/lib/matching";
import { useAuth } from "@/context/AuthContext";

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { user, profile } = useAuth();
  const resolvedParams = use(params);
  const jobId = resolvedParams.id;

  const job = SAMPLE_JOBS.find((j) => j.id === jobId);

  // Selected Skills for Match Simulator
  const [selectedSkillNames, setSelectedSkillNames] = useState<Set<string>>(() => {
    // Default select first 2 required skills
    const initial = new Set<string>();
    if (job) {
      job.requirements.slice(0, 2).forEach((r) => initial.add(r.skillName.toLowerCase()));
    }
    return initial;
  });

  const [applied, setApplied] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const savedApps = JSON.parse(localStorage.getItem("sbjfp_applications") || "[]");
        return savedApps.some((a: any) => a.jobId === jobId);
      } catch {
        return false;
      }
    }
    return false;
  });

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const toggleSkill = (skillName: string) => {
    const updated = new Set(selectedSkillNames);
    const key = skillName.toLowerCase();
    if (updated.has(key)) {
      updated.delete(key);
    } else {
      updated.add(key);
    }
    setSelectedSkillNames(updated);
  };

  // Calculate live simulated match score
  const matchResult = useMemo(() => {
    if (!job) return null;
    const candidateSkills = Array.from(selectedSkillNames).map((name) => ({
      skillName: name,
    }));
    return calculateSkillMatch(candidateSkills, job.requirements, job.min_match_threshold);
  }, [job, selectedSkillNames]);

  // Handle Apply
  const handleApply = () => {
    if (!job) return;

    if (!user) {
      router.push(`/auth/signup?role=candidate&redirect=/jobs/${job.id}`);
      return;
    }

    const salaryFormatted =
      job.salary_min && job.salary_max
        ? `₹${job.salary_min.toLocaleString("en-IN")} - ₹${job.salary_max.toLocaleString("en-IN")} / year`
        : "Competitive";

    const newApp = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.company_name,
      location: job.location,
      salaryText: salaryFormatted,
      matchScore: matchResult?.score || 80,
      status: "submitted",
      appliedAt: new Date().toISOString(),
      viewedAt: null,
    };

    if (typeof window !== "undefined") {
      try {
        const prev = JSON.parse(localStorage.getItem("sbjfp_applications") || "[]");
        localStorage.setItem("sbjfp_applications", JSON.stringify([newApp, ...prev]));
      } catch {
        // ignore
      }
    }

    setApplied(true);
    showToast(`Application submitted with ${matchResult?.score}% match score!`);
  };

  if (!job) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex flex-col font-sans">
        <Header />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center max-w-md space-y-4">
            <span className="text-4xl block">🔍</span>
            <h1 className="text-lg font-bold text-slate-800">Job Not Found</h1>
            <p className="text-xs text-slate-500">
              The role you are looking for may have expired or been fulfilled.
            </p>
            <Link
              href="/jobs"
              className="inline-block py-2 px-5 rounded-xl text-xs font-bold bg-[var(--blue)] text-white"
            >
              ← Back to Jobs Board
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isFresher = job.min_experience_years === 0 || job.experience_level === "fresher";

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col font-sans">
      <Header />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[var(--navy)] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 animate-bounce">
          <span className="text-emerald-400 font-bold text-lg">✓</span>
          <span className="text-xs font-medium">{toastMsg}</span>
        </div>
      )}

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/jobs" className="hover:text-slate-600 font-semibold">
            ← All Jobs
          </Link>
          <span>/</span>
          <span className="text-slate-700 font-bold">{job.title}</span>
        </div>

        {/* Job Header Hero */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{job.title}</h1>
                {isFresher && (
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    🌱 Freshers Welcome (0+ yrs)
                  </span>
                )}
                {job.is_remote && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-[var(--blue)] border border-blue-200">
                    Remote
                  </span>
                )}
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-600 capitalize">
                  {job.employment_type}
                </span>
              </div>
              <p className="text-sm font-bold text-slate-500">
                {job.company_name} • {job.location}
              </p>
            </div>

            {/* Salary Strip */}
            <div className="flex flex-col sm:items-end gap-1">
              <span className="text-xs text-slate-400 font-bold">Transparent Compensation</span>
              <span className="text-xl font-black text-slate-900">
                ₹{job.salary_min?.toLocaleString("en-IN")} - ₹{job.salary_max?.toLocaleString("en-IN")}{" "}
                / year
              </span>
              <span className="text-[11px] text-slate-400">
                Min. Match Threshold: {job.min_match_threshold}%
              </span>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl text-xs border border-slate-100">
            <div>
              <span className="text-slate-400 block text-[11px]">Experience Target:</span>
              <span className="font-extrabold text-slate-800">
                {isFresher ? "🌱 Freshers Welcome (0 Yrs)" : `💼 ${job.min_experience_years}+ Years`}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Required Qualification:</span>
              <span className="font-extrabold text-slate-800">
                🎓 {job.min_qualification || "Open to Any Degree"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Location Flexibility:</span>
              <span className="font-extrabold text-slate-800">
                {job.is_remote ? "100% Remote Allowed" : "On-site / Hybrid"}
              </span>
            </div>
          </div>
        </div>

        {/* Two Column Layout: Details & Match Simulator */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Description & Skill Requirements */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 mb-2">Role Overview</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Structured Skill Requirements */}
            <div className="border-t border-slate-100 pt-6 space-y-4">
              <h2 className="text-base font-extrabold text-slate-900">
                Structured Technical Requirements
              </h2>
              <p className="text-xs text-slate-500">
                Our match engine calculates fit strictly on these verified requirements. Required skills contribute 75% of your match score; preferred skills contribute 25%.
              </p>

              <div className="space-y-2.5">
                {job.requirements.map((req) => (
                  <div
                    key={req.skillName}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{req.skillName}</span>
                      {req.isRequired ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-[var(--blue)]">
                          Required (75%)
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-600">
                          Preferred (25%)
                        </span>
                      )}
                    </div>
                    <span className="text-slate-500 font-semibold text-[11px]">
                      {req.minYears === 0 ? "0+ yrs (Freshers)" : `${req.minYears}+ yrs exp`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Match Calculator & 1-Click Apply */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 sticky top-24">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-extrabold text-slate-900">
                  🎯 Interactive Match Simulator
                </h3>
                <span className="text-[10px] uppercase font-bold text-slate-400">Live Preview</span>
              </div>
              <p className="text-xs text-slate-500">
                Select the skills you possess to see your deterministic score in real-time.
              </p>
            </div>

            {/* Score Display Card */}
            {matchResult && (
              <div
                className={`p-5 rounded-2xl border text-center space-y-2 transition ${
                  matchResult.score >= 80
                    ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                    : matchResult.score >= 60
                    ? "bg-amber-50 border-amber-300 text-amber-950"
                    : "bg-slate-50 border-slate-300 text-slate-900"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="text-4xl font-black">{matchResult.score}%</span>
                  <span className="text-xs font-bold uppercase tracking-wider block text-left">
                    Match<br />Score
                  </span>
                </div>

                <p className="text-xs font-semibold leading-relaxed">
                  {matchResult.explanation}
                </p>

                <div className="pt-1">
                  <span
                    className={`inline-block text-[11px] font-bold px-3 py-1 rounded-full ${
                      matchResult.meetsThreshold
                        ? "bg-emerald-600 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {matchResult.meetsThreshold
                      ? `✓ Meets Employer Threshold (≥ ${job.min_match_threshold}%)`
                      : `✕ Below Minimum Threshold (${job.min_match_threshold}%)`}
                  </span>
                </div>
              </div>
            )}

            {/* Toggleable Skills Checklist */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">
                Do you have these skills? (Click to toggle)
              </span>

              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                {job.requirements.map((req) => {
                  const isChecked = selectedSkillNames.has(req.skillName.toLowerCase());

                  return (
                    <button
                      type="button"
                      key={req.skillName}
                      onClick={() => toggleSkill(req.skillName)}
                      className={`w-full p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition ${
                        isChecked
                          ? "bg-blue-50 border-[var(--blue)] text-[var(--blue)]"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <span>
                        {isChecked ? "✓ " : "○ "} {req.skillName}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {req.isRequired ? "Required" : "Bonus"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Apply Action */}
            <div className="pt-2 border-t border-slate-100">
              {applied ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-1">
                  <span className="text-xs font-bold text-emerald-800 block">
                    You have applied to this role! ✓
                  </span>
                  <Link
                    href="/dashboard/candidate"
                    className="text-xs text-[var(--blue)] font-bold hover:underline"
                  >
                    View in Application Tracker →
                  </Link>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleApply}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-[var(--blue)] text-white hover:opacity-90 transition shadow-sm"
                >
                  {user ? "1-Click Apply with My Skills" : "Sign In & Apply with 1-Click →"}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
