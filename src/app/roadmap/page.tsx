"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ROADMAP_PRESETS, TargetRoadmap } from "@/lib/roadmapData";

export default function CareerRoadmapPage() {
  const [selectedJobKey, setSelectedJobKey] = useState<string>("job-android-001");
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const roadmap: TargetRoadmap = ROADMAP_PRESETS[selectedJobKey] || ROADMAP_PRESETS["job-android-001"];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`sbjfp_roadmap_tasks_${selectedJobKey}`);
      if (saved) {
        try {
          setCompletedTasks(JSON.parse(saved));
        } catch {
          // ignore
        }
      } else {
        setCompletedTasks({ t1: true });
      }
    }
  }, [selectedJobKey]);

  const toggleTask = (taskId: string) => {
    const updated = { ...completedTasks, [taskId]: !completedTasks[taskId] };
    setCompletedTasks(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(`sbjfp_roadmap_tasks_${selectedJobKey}`, JSON.stringify(updated));
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Simulate Completing Bridge Skills and Adding to Candidate Profile
  const handleSimulateCompletion = () => {
    if (typeof window !== "undefined") {
      const currentSkillsRaw = localStorage.getItem("sbjfp_candidate_skills");
      let currentSkills: any[] = [];
      try {
        currentSkills = currentSkillsRaw ? JSON.parse(currentSkillsRaw) : [];
      } catch {
        currentSkills = [];
      }

      const existingNames = new Set(currentSkills.map((s: any) => s.skillName.toLowerCase()));

      roadmap.missingSkills.forEach((skillName) => {
        if (!existingNames.has(skillName.toLowerCase())) {
          currentSkills.push({
            skillName,
            category: "Frameworks",
            proficiency: "advanced",
            yearsExperience: 2,
          });
        }
      });

      localStorage.setItem("sbjfp_candidate_skills", JSON.stringify(currentSkills));
    }

    showToast(`🎉 Verified skills added to your profile! Match score elevated to ${roadmap.projectedScore}%.`);
  };

  const totalTasks = roadmap.milestones.reduce((acc, m) => acc + m.tasks.length, 0);
  const doneTasks = Object.values(completedTasks).filter(Boolean).length;
  const progressPct = Math.round((doneTasks / (totalTasks || 1)) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b1320] text-slate-100 font-sans selection:bg-[#42D6A4]/30">
      <Header />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[var(--navy)] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 animate-bounce">
          <span className="text-emerald-400 font-bold text-lg">✓</span>
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <Link href="/dashboard/candidate" className="hover:text-[#42D6A4] transition-colors">
            Candidate Portal
          </Link>
          <span>/</span>
          <span className="text-slate-200">Skill Gap Bridge Roadmap</span>
        </div>

        {/* Hero Section */}
        <div className="bg-[#102A43]/80 border border-slate-700/80 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl mb-10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#1479C9]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
              <span>🗺️</span> 14-Day Accelerated Study Plan
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Skill Gap Bridge &amp; Career Roadmap
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
              Don&apos;t get rejected by invisible ATS filters. Follow a structured, 14-day step-by-step curriculum with hands-on projects and official documentation to reach <strong>90%+ match</strong> for your target engineering role.
            </p>
          </div>

          {/* Target Job Selector */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Target Role:
              </span>
              <div className="flex bg-slate-900 border border-slate-700 rounded-xl p-1">
                {[
                  { key: "job-android-001", label: "🤖 Senior Android Engineer" },
                  { key: "job-fullstack-002", label: "⚡ Next.js & Supabase Fullstack" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setSelectedJobKey(tab.key)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                      selectedJobKey === tab.key
                        ? "bg-[#1479C9] text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSimulateCompletion}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
            >
              <span>✅</span> Simulate Skills Added &amp; Elevate Match
            </button>
          </div>
        </div>

        {/* Match Projection & Gap Overview Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          {/* Left: Match Score Evolution */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#102A43] to-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--mint)] block mb-1">
                Match Score Projection
              </span>
              <h2 className="text-xl font-extrabold text-white">
                {roadmap.targetRole}
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Target Employer: <strong>{roadmap.companyName}</strong>
              </p>
            </div>

            {/* Score Visual Progression */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-300">Current Match: {roadmap.currentScore}%</span>
                <span className="text-[#42D6A4]">Projected Match: {roadmap.projectedScore}%</span>
              </div>

              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden flex">
                <div
                  className="bg-slate-500 h-full"
                  style={{ width: `${roadmap.currentScore}%` }}
                />
                <div
                  className="bg-gradient-to-r from-[#1479C9] to-[#42D6A4] h-full animate-pulse"
                  style={{ width: `${roadmap.projectedScore - roadmap.currentScore}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Threshold: 75% required</span>
                <span className="text-emerald-400 font-semibold">
                  +{roadmap.projectedScore - roadmap.currentScore}% Score Delta
                </span>
              </div>
            </div>

            {/* Study Progress */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-300">Curriculum Progress</span>
                <span className="text-[#42D6A4]">{progressPct}% ({doneTasks}/{totalTasks} tasks)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right: Identified Skill Gaps to Bridge */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block mb-1">
                Identified Missing Capabilities
              </span>
              <h3 className="text-lg font-bold text-white">
                Skills Required To Clear Employer Threshold
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {roadmap.overview}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {roadmap.missingSkills.map((sk) => (
                <div
                  key={sk}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between"
                >
                  <span className="text-xs font-bold text-slate-200">{sk}</span>
                  <div className="mt-2 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded w-fit border border-emerald-500/20">
                    High Match Impact
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Estimated Daily Commitment: <strong>45 mins / day</strong></span>
              <Link href={`/jobs/${roadmap.jobId}`} className="text-[#42D6A4] font-bold hover:underline">
                View Job Description →
              </Link>
            </div>
          </div>
        </div>

        {/* 14-Day Step-by-Step Curriculum */}
        <section className="space-y-6 mb-12">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
              <span>📅</span> 14-Day Step-by-Step Curriculum
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Check off tasks as you learn. Completing each phase prepares you for verified technical interviews.
            </p>
          </div>

          <div className="space-y-6">
            {roadmap.milestones.map((m, mIdx) => (
              <div
                key={m.phaseTitle}
                className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5"
              >
                {/* Milestone Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#1479C9]/20 text-blue-300 border border-blue-500/30">
                        {m.dayRange}
                      </span>
                      <span className="text-xs font-bold text-slate-300">
                        Focus: {m.focusSkill}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{m.phaseTitle}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{m.objective}</p>
                  </div>

                  <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs self-start sm:self-auto">
                    +{m.scoreImpact}% Match Boost
                  </div>
                </div>

                {/* Tasks List */}
                <div className="space-y-3">
                  {m.tasks.map((task) => {
                    const isDone = completedTasks[task.id];
                    return (
                      <div
                        key={task.id}
                        onClick={() => toggleTask(task.id)}
                        className={`p-4 rounded-2xl border transition cursor-pointer flex items-start gap-3.5 ${
                          isDone
                            ? "bg-emerald-950/20 border-emerald-500/30 text-slate-300"
                            : "bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-200"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold mt-0.5 transition ${
                            isDone
                              ? "bg-emerald-500 text-slate-950"
                              : "border border-slate-600 bg-slate-800"
                          }`}
                        >
                          {isDone && "✓"}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className={`text-sm font-bold ${isDone ? "line-through text-slate-400" : "text-white"}`}>
                            {task.title}
                          </h4>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            {task.desc}
                          </p>

                          <div className="mt-2.5 flex items-center gap-2">
                            <span className="text-[10px] text-slate-500 uppercase font-bold">
                              Curated Resource:
                            </span>
                            <a
                              href={task.resourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs font-bold text-[#42D6A4] hover:underline flex items-center gap-1"
                            >
                              <span>{task.resourceName}</span>
                              <span>↗</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Next Step Action CTA */}
        <div className="bg-gradient-to-r from-blue-900 to-[#102A43] rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="text-xl font-bold mb-1">Ready to Test Your Verified Skills?</h3>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Once you finish your practice, take the 3-minute interactive assessments on your profile to earn verified badges and receive automatic interview invites from employers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/candidate"
              className="px-5 py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs rounded-xl shadow-md transition whitespace-nowrap"
            >
              Open Candidate Dashboard →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
