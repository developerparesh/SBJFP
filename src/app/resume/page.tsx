"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { CandidateSkillState } from "@/lib/skillsData";
import { getVerifiedSkills } from "@/lib/assessmentData";

export default function ResumePage() {
  const { profile } = useAuth();
  const [skills, setSkills] = useState<CandidateSkillState[]>([
    { skillName: "Kotlin", category: "Languages", proficiency: "advanced", yearsExperience: 3 },
    { skillName: "Jetpack Compose", category: "Frameworks", proficiency: "advanced", yearsExperience: 2 },
    { skillName: "Android SDK", category: "Frameworks", proficiency: "expert", yearsExperience: 4 },
    { skillName: "React", category: "Frameworks", proficiency: "advanced", yearsExperience: 3 },
    { skillName: "TypeScript", category: "Languages", proficiency: "advanced", yearsExperience: 3 },
    { skillName: "Git & GitHub", category: "Tools", proficiency: "expert", yearsExperience: 4 },
    { skillName: "PostgreSQL", category: "Databases", proficiency: "intermediate", yearsExperience: 2 },
  ]);
  const [verifiedSkills, setVerifiedSkills] = useState<string[]>([]);
  const [qualification, setQualification] = useState("B.Tech / B.E. (Computer Science / IT)");
  const [expLevel, setExpLevel] = useState("3-5_years");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSkills = localStorage.getItem("sbjfp_candidate_skills");
      if (savedSkills) {
        try {
          const parsed = JSON.parse(savedSkills);
          if (Array.isArray(parsed) && parsed.length > 0) setSkills(parsed);
        } catch {
          // fallback
        }
      }
      const savedEdu = localStorage.getItem("sbjfp_candidate_education");
      if (savedEdu) {
        try {
          const parsed = JSON.parse(savedEdu);
          if (parsed.qualification) setQualification(parsed.qualification);
          if (parsed.expLevel) setExpLevel(parsed.expLevel);
        } catch {
          // fallback
        }
      }
      setVerifiedSkills(getVerifiedSkills());
    }
  }, []);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 py-8 px-4 sm:px-6 font-sans">
      {/* Top Action Toolbar (Hidden during print) */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link
          href="/dashboard/candidate"
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition shadow-sm"
        >
          ← Back to Candidate Dashboard
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 hidden sm:inline">
            Print layout is auto-optimized for A4 paper.
          </span>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-[#1479C9] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
          >
            <span>🖨️</span> Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Main Resume Sheet */}
      <main className="max-w-4xl mx-auto bg-white border border-slate-200 shadow-xl rounded-2xl p-8 sm:p-12 print:border-none print:shadow-none print:p-0 print:m-0 print:rounded-none">
        {/* Header */}
        <header className="border-b-2 border-slate-900 pb-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {profile?.fullName || "Paresh K."}
              </h1>
              <p className="text-sm font-semibold text-slate-600 mt-1">
                {expLevel === "fresher" ? "Entry-Level / Fresher Software Engineer" : "Software Engineer (Skill-Verified)"}
              </p>
            </div>
            <div className="text-xs text-slate-600 sm:text-right space-y-1">
              <div>📍 Bangalore / Remote, India</div>
              <div>✉️ contact@developerparesh.dev</div>
              <div className="font-semibold text-blue-700">SBJFP Verified Talent ID: #SBJ-7842</div>
            </div>
          </div>
        </header>

        {/* Section 1: Verified Skills Matrix */}
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
            <span>🏅</span> Verified Technical Skills &amp; Proficiencies
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {skills.map((skill) => {
              const isVerified = verifiedSkills.includes(skill.skillName);
              return (
                <div
                  key={skill.skillName}
                  className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                      <span>{skill.skillName}</span>
                      {isVerified && (
                        <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1 rounded font-extrabold" title="Skill Verified via Assessment">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 capitalize">
                      {skill.category}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600 capitalize bg-white px-2 py-0.5 rounded border border-slate-200">
                    {skill.proficiency}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 2: Education & Qualifications */}
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
            <span>🎓</span> Education &amp; Academic Background
          </h2>
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">{qualification}</h3>
              <p className="text-xs text-slate-600 mt-0.5">Computer Science &amp; Information Technology</p>
            </div>
            <div className="text-xs font-semibold text-slate-500 sm:text-right">
              <div>Graduation: 2026</div>
              <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Verified Degree
              </span>
            </div>
          </div>
        </section>

        {/* Section 3: Key Technical Projects */}
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
            <span>🚀</span> Verified Engineering Projects
          </h2>
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                <h3 className="text-sm font-bold text-slate-900">
                  Skill-Based Job Finding Platform (SBJFP)
                </h3>
                <span className="text-xs text-slate-500 font-mono">Next.js • Supabase • Cloudflare</span>
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Architected a modern full-stack web application delivering explainable 75/25 skill matching, transparent salaries, HR interview slot booking, and Cloudflare Workers edge deployment. Built with clean architecture and Supabase Row Level Security.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                <h3 className="text-sm font-bold text-slate-900">
                  Offline-First Android Architecture Showcase
                </h3>
                <span className="text-xs text-slate-500 font-mono">Kotlin • Jetpack Compose • Room DB</span>
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Implemented dynamic MVI state management, Kotlin Coroutines, and local SQL caching with Room DB. Integrated real-time sync with REST APIs and zero-crash test coverage.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: SBJFP Platform Guarantee */}
        <footer className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <span>
            Verified by <strong>SBJFP (Skill-Based Job Finding Platform)</strong>
          </span>
          <span className="font-mono">
            Direct Verification Link: https://sbjfp.developerparesh-dev.workers.dev
          </span>
        </footer>
      </main>
    </div>
  );
}
