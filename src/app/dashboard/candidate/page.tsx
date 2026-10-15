"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  PRESET_SKILLS,
  SKILL_CATEGORIES,
  QUICK_PRESETS,
  QUALIFICATION_OPTIONS,
  CandidateSkillState,
} from "@/lib/skillsData";
import { SAMPLE_JOBS } from "@/lib/sampleJobs";
import { calculateSkillMatch, MatchResult } from "@/lib/matching";
import {
  SkillCategory,
  ProficiencyLevel,
  ApplicationStatus,
  InterviewSlot,
  ExperienceLevel,
} from "@/types/database";
import { getStoredInterviewSlots, saveStoredInterviewSlots } from "@/lib/interviewSlotsData";

interface SavedApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  location: string;
  salaryText: string;
  matchScore: number;
  status: ApplicationStatus;
  appliedAt: string;
  viewedAt: string | null;
}

export default function CandidateDashboardPage() {
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();

  // Active Tab
  const [activeTab, setActiveTab] = useState<"skills" | "matches" | "applications">("skills");

  // Candidate Experience & Education
  const [candidateExpLevel, setCandidateExpLevel] = useState<ExperienceLevel>("fresher");
  const [candidateQualification, setCandidateQualification] = useState<string>(
    "B.Tech / B.E. (Computer Science / IT)"
  );
  const [candidateCollege, setCandidateCollege] = useState<string>("National Institute of Technology");
  const [candidateGradYear, setCandidateGradYear] = useState<number>(2026);

  // Candidate Skills State (Initialized with Android Specialist defaults)
  const [candidateSkills, setCandidateSkills] = useState<CandidateSkillState[]>([
    { skillName: "Kotlin", category: "Languages", proficiency: "advanced", yearsExperience: 3 },
    { skillName: "Jetpack Compose", category: "Frameworks", proficiency: "advanced", yearsExperience: 2 },
    { skillName: "Android SDK", category: "Frameworks", proficiency: "expert", yearsExperience: 4 },
    { skillName: "Room DB", category: "Databases", proficiency: "intermediate", yearsExperience: 2 },
    { skillName: "REST APIs", category: "Tools", proficiency: "advanced", yearsExperience: 3 },
    { skillName: "Git & GitHub", category: "Tools", proficiency: "advanced", yearsExperience: 4 },
  ]);

  // Skill Filtering & Search in Builder
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [saveStatus, setSaveStatus] = useState<string>("Synced");

  // Job Matching Filters & Sorting
  const [filterThresholdOnly, setFilterThresholdOnly] = useState<boolean>(false);
  const [filterRemoteOnly, setFilterRemoteOnly] = useState<boolean>(false);
  const [filterFreshersOnly, setFilterFreshersOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"match" | "salary" | "recent">("match");

  // Applications State
  const [applications, setApplications] = useState<SavedApplication[]>([
    {
      id: "app-101",
      jobId: "job-android-001",
      jobTitle: "Senior Android Developer",
      companyName: "TechMatrix Labs",
      location: "Bangalore (Hybrid)",
      salaryText: "₹16,00,000 - ₹24,00,000 / year",
      matchScore: 83,
      status: "shortlisted",
      appliedAt: new Date(Date.now() - 86400000).toISOString(),
      viewedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
  ]);

  // Interview Slots State
  const [interviewSlots, setInterviewSlots] = useState<InterviewSlot[]>([]);
  const [selectedSlotForJob, setSelectedSlotForJob] = useState<Record<string, string>>({});

  // Modal / Toast Notification
  const [notification, setNotification] = useState<string | null>(null);

  // Load from LocalStorage if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sbjfp_candidate_skills");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCandidateSkills(parsed);
          }
        } catch {
          // ignore
        }
      }
      const savedEdu = localStorage.getItem("sbjfp_candidate_education");
      if (savedEdu) {
        try {
          const parsed = JSON.parse(savedEdu);
          if (parsed.expLevel) setCandidateExpLevel(parsed.expLevel);
          if (parsed.qualification) setCandidateQualification(parsed.qualification);
          if (parsed.college) setCandidateCollege(parsed.college);
          if (parsed.gradYear) setCandidateGradYear(parsed.gradYear);
        } catch {
          // ignore
        }
      }
      const savedApps = localStorage.getItem("sbjfp_applications");
      if (savedApps) {
        try {
          const parsed = JSON.parse(savedApps);
          if (Array.isArray(parsed)) {
            setApplications(parsed);
          }
        } catch {
          // ignore
        }
      }
      setInterviewSlots(getStoredInterviewSlots());
    }
  }, []);

  // Save Education / Profile Details
  const saveEducation = (exp: ExperienceLevel, qual: string, college: string, year: number) => {
    setCandidateExpLevel(exp);
    setCandidateQualification(qual);
    setCandidateCollege(college);
    setCandidateGradYear(year);

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "sbjfp_candidate_education",
        JSON.stringify({ expLevel: exp, qualification: qual, college, gradYear: year })
      );
    }
    showToast("Education & experience level updated!");
  };

  // Sync to LocalStorage on skills change
  const saveSkills = (skillsToSave: CandidateSkillState[]) => {
    setCandidateSkills(skillsToSave);
    setSaveStatus("Saving...");
    if (typeof window !== "undefined") {
      localStorage.setItem("sbjfp_candidate_skills", JSON.stringify(skillsToSave));
    }
    setTimeout(() => {
      setSaveStatus("Profile Saved");
      setTimeout(() => setSaveStatus("Synced"), 2000);
    }, 300);
  };

  // Toggle or add a skill
  const handleToggleSkill = (skillDef: { name: string; category: SkillCategory }) => {
    const exists = candidateSkills.some((s) => s.skillName.toLowerCase() === skillDef.name.toLowerCase());
    if (exists) {
      const updated = candidateSkills.filter(
        (s) => s.skillName.toLowerCase() !== skillDef.name.toLowerCase()
      );
      saveSkills(updated);
    } else {
      const newEntry: CandidateSkillState = {
        skillName: skillDef.name,
        category: skillDef.category,
        proficiency: "intermediate",
        yearsExperience: candidateExpLevel === "fresher" ? 0 : 2,
      };
      saveSkills([...candidateSkills, newEntry]);
    }
  };

  // Update proficiency or years
  const handleUpdateProficiency = (skillName: string, level: ProficiencyLevel) => {
    const updated = candidateSkills.map((s) =>
      s.skillName === skillName ? { ...s, proficiency: level } : s
    );
    saveSkills(updated);
  };

  const handleUpdateYears = (skillName: string, delta: number) => {
    const updated = candidateSkills.map((s) => {
      if (s.skillName === skillName) {
        const nextYears = Math.max(0, Math.min(25, s.yearsExperience + delta));
        return { ...s, yearsExperience: nextYears };
      }
      return s;
    });
    saveSkills(updated);
  };

  // Apply Quick Preset
  const handleApplyPreset = (presetIndex: number) => {
    const preset = QUICK_PRESETS[presetIndex];
    if (!preset) return;

    if (preset.title.includes("Fresher")) {
      setCandidateExpLevel("fresher");
      setCandidateGradYear(2026);
    } else {
      setCandidateExpLevel("3-5_years");
    }

    const mapped: CandidateSkillState[] = preset.skills.map((item) => {
      const matchDef = PRESET_SKILLS.find((p) => p.name.toLowerCase() === item.skillName.toLowerCase());
      return {
        skillName: item.skillName,
        category: matchDef ? matchDef.category : "Languages",
        proficiency: item.proficiency,
        yearsExperience: item.yearsExperience,
      };
    });
    saveSkills(mapped);
    showToast(`Loaded ${preset.title} preset (${mapped.length} skills)!`);
  };

  // Show Toast
  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Compute Job Matches
  const matchedJobs = useMemo(() => {
    const candidateInput = candidateSkills.map((s) => ({
      skillName: s.skillName,
      yearsExperience: s.yearsExperience,
    }));

    return SAMPLE_JOBS.map((job) => {
      const match = calculateSkillMatch(
        candidateInput,
        job.requirements,
        job.min_match_threshold
      );
      return {
        ...job,
        match,
      };
    });
  }, [candidateSkills]);

  // Filtered & Sorted Jobs
  const displayedJobs = useMemo(() => {
    let list = [...matchedJobs];

    if (filterThresholdOnly) {
      list = list.filter((j) => j.match.meetsThreshold);
    }
    if (filterRemoteOnly) {
      list = list.filter((j) => j.is_remote);
    }
    if (filterFreshersOnly) {
      list = list.filter((j) => j.min_experience_years === 0 || j.experience_level === "fresher");
    }

    if (sortBy === "match") {
      list.sort((a, b) => b.match.score - a.match.score);
    } else if (sortBy === "salary") {
      list.sort((a, b) => (b.salary_max || 0) - (a.salary_max || 0));
    } else if (sortBy === "recent") {
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return list;
  }, [matchedJobs, filterThresholdOnly, filterRemoteOnly, filterFreshersOnly, sortBy]);

  // Apply to Job
  const handleApplyToJob = (job: typeof SAMPLE_JOBS[0] & { match: MatchResult }) => {
    const alreadyApplied = applications.some((a) => a.jobId === job.id);
    if (alreadyApplied) {
      showToast("You have already applied to this role. Check the Application Tracker.");
      setActiveTab("applications");
      return;
    }

    const salaryFormatted = job.salary_min && job.salary_max
      ? `₹${job.salary_min.toLocaleString("en-IN")} - ₹${job.salary_max.toLocaleString("en-IN")} / year`
      : "Competitive";

    const newApp: SavedApplication = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.company_name,
      location: job.location,
      salaryText: salaryFormatted,
      matchScore: job.match.score,
      status: "submitted",
      appliedAt: new Date().toISOString(),
      viewedAt: null,
    };

    const updated = [newApp, ...applications];
    setApplications(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("sbjfp_applications", JSON.stringify(updated));
    }

    showToast(`Application submitted to ${job.company_name} with ${job.match.score}% match score!`);
  };

  // Candidate Selects & Confirms an Interview Slot
  const handleConfirmSlotSelection = (appId: string, jobId: string) => {
    const slotId = selectedSlotForJob[jobId];
    if (!slotId) {
      showToast("Please choose an interview time slot first.");
      return;
    }

    const updatedSlots = interviewSlots.map((s) => {
      if (s.id === slotId) {
        return {
          ...s,
          status: "booked" as const,
          candidate_id: user?.id || "cand-current",
          candidate_name: profile?.fullName || "Candidate",
        };
      }
      return s;
    });

    setInterviewSlots(updatedSlots);
    saveStoredInterviewSlots(updatedSlots);

    const updatedApps = applications.map((app) => {
      if (app.id === appId) {
        return {
          ...app,
          status: "interview_scheduled" as ApplicationStatus,
        };
      }
      return app;
    });

    setApplications(updatedApps);
    if (typeof window !== "undefined") {
      localStorage.setItem("sbjfp_applications", JSON.stringify(updatedApps));
    }

    showToast("🎉 Interview time slot confirmed! Check details below.");
  };

  // Reschedule Slot
  const handleRescheduleSlot = (slotId: string, appId: string) => {
    const updatedSlots = interviewSlots.map((s) => {
      if (s.id === slotId) {
        return {
          ...s,
          status: "available" as const,
          candidate_id: null,
          candidate_name: null,
        };
      }
      return s;
    });

    setInterviewSlots(updatedSlots);
    saveStoredInterviewSlots(updatedSlots);

    const updatedApps = applications.map((app) => {
      if (app.id === appId) {
        return {
          ...app,
          status: "shortlisted" as ApplicationStatus,
        };
      }
      return app;
    });

    setApplications(updatedApps);
    if (typeof window !== "undefined") {
      localStorage.setItem("sbjfp_applications", JSON.stringify(updatedApps));
    }

    showToast("Interview cancelled. You can now choose another slot.");
  };

  // Simulate Employer Progression
  const handleAdvanceStatus = (appId: string) => {
    const nextStatusMap: Record<ApplicationStatus, ApplicationStatus> = {
      submitted: "viewed",
      viewed: "shortlisted",
      shortlisted: "interview_scheduled",
      interview_scheduled: "accepted",
      accepted: "accepted",
      rejected: "rejected",
    };

    const updated = applications.map((app) => {
      if (app.id === appId) {
        const next = nextStatusMap[app.status];
        return {
          ...app,
          status: next,
          viewedAt: app.viewedAt || new Date().toISOString(),
        };
      }
      return app;
    });

    setApplications(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("sbjfp_applications", JSON.stringify(updated));
    }
    showToast("Application status updated by employer!");
  };

  // Auth Guard
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-slate-500 text-sm">
        <svg className="animate-spin h-5 w-5 mr-3 text-[var(--blue)]" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        Loading Candidate Portal...
      </div>
    );
  }

  // Filter skills pool for builder
  const filteredAvailableSkills = PRESET_SKILLS.filter((s) => {
    const matchesCategory = selectedCategory === "All" || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
    return matchesCategory && matchesSearch;
  });

  const qualifiedCount = matchedJobs.filter((j) => j.match.meetsThreshold).length;

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[var(--navy)] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 animate-bounce">
          <span className="text-emerald-400 font-bold text-lg">✓</span>
          <span className="text-xs font-medium">{notification}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/logo.png" alt="SBJFP" width={32} height={32} className="rounded-lg" />
              <span className="font-extrabold text-xl tracking-tight text-[var(--navy)]">SBJFP</span>
            </Link>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Candidate Portal
            </span>
            {candidateExpLevel === "fresher" && (
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-mint-50 text-emerald-800 border border-emerald-300">
                🌱 Fresher Profile
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-800">{profile?.fullName || "Candidate"}</p>
              <p className="text-[11px] text-slate-400">
                {candidateExpLevel === "fresher" ? "Fresher (0 yrs)" : "Experienced"} • {candidateQualification}
              </p>
            </div>
            <button
              onClick={async () => {
                await signOut();
                router.push("/");
              }}
              className="py-1.5 px-3.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Portal Hero Banner */}
        <div
          className="rounded-2xl p-6 sm:p-8 text-white mb-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
          style={{ backgroundColor: "var(--navy)" }}
        >
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-2">
              <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-white/10 text-[var(--mint)]">
                Freshers & Experience Matching Active
              </span>
              <span className="text-xs text-slate-300">•</span>
              <span className="text-xs text-emerald-300 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {saveStatus}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">
              Welcome back, {profile?.fullName || "Candidate"}!
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
              Curate your verified skills, education qualification, and experience level. Discover roles tailored for freshers or experienced professionals with 1-click apply.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 bg-white/5 p-4 rounded-xl border border-white/10 min-w-[280px]">
            <div className="text-center">
              <span className="block text-2xl font-black text-[var(--mint)]">{candidateSkills.length}</span>
              <span className="text-[10px] text-slate-300 uppercase tracking-wide">Skills Added</span>
            </div>
            <div className="text-center border-x border-white/10">
              <span className="block text-2xl font-black text-white">{qualifiedCount}</span>
              <span className="text-[10px] text-slate-300 uppercase tracking-wide">Eligible Roles</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-black text-amber-300">{applications.length}</span>
              <span className="text-[10px] text-slate-300 uppercase tracking-wide">Applied</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 mb-8 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("skills")}
            className={`py-3 px-5 text-sm font-bold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === "skills"
                ? "border-[var(--blue)] text-[var(--blue)] bg-white rounded-t-xl"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>🎯 Skills & Education Builder</span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-[var(--blue)]">
              {candidateSkills.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("matches")}
            className={`py-3 px-5 text-sm font-bold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === "matches"
                ? "border-[var(--blue)] text-[var(--blue)] bg-white rounded-t-xl"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>📊 Matched Opportunities</span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-700">
              {qualifiedCount} qualified
            </span>
          </button>

          <button
            onClick={() => setActiveTab("applications")}
            className={`py-3 px-5 text-sm font-bold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === "applications"
                ? "border-[var(--blue)] text-[var(--blue)] bg-white rounded-t-xl"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>📬 Applications & Interview Slots</span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-700 font-extrabold">
              {applications.length}
            </span>
          </button>
        </div>

        {/* TAB 1: SKILLS & QUALIFICATION BUILDER */}
        {activeTab === "skills" && (
          <div className="space-y-8">
            {/* 1. Education & Experience Level Section */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900">
                    🎓 Qualification & Experience Background
                  </h2>
                  <p className="text-xs text-slate-500">
                    Specify whether you are a Fresher or Experienced, plus your degree/certification.
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {candidateExpLevel === "fresher" ? "🌱 Fresher (0-1 yr)" : "💼 Experienced"}
                </span>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                {/* Experience Level Selector */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Experience Level *</label>
                  <select
                    value={candidateExpLevel}
                    onChange={(e) =>
                      saveEducation(
                        e.target.value as ExperienceLevel,
                        candidateQualification,
                        candidateCollege,
                        candidateGradYear
                      )
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold bg-white text-slate-800 focus:ring-1 focus:ring-[var(--blue)]"
                  >
                    <option value="fresher">🌱 Fresher / New Graduate (0-1 yr)</option>
                    <option value="1-3_years">⚡ 1 - 3 Years (Junior)</option>
                    <option value="3-5_years">💼 3 - 5 Years (Mid-Level)</option>
                    <option value="5+_years">🚀 5+ Years (Senior / Lead)</option>
                  </select>
                </div>

                {/* Qualification Selector */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Highest Qualification *</label>
                  <select
                    value={candidateQualification}
                    onChange={(e) =>
                      saveEducation(
                        candidateExpLevel,
                        e.target.value,
                        candidateCollege,
                        candidateGradYear
                      )
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold bg-white text-slate-800 focus:ring-1 focus:ring-[var(--blue)]"
                  >
                    {QUALIFICATION_OPTIONS.map((q) => (
                      <option key={q} value={q}>
                        {q}
                      </option>
                    ))}
                  </select>
                </div>

                {/* College / Institution */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">College / Institution</label>
                  <input
                    type="text"
                    value={candidateCollege}
                    placeholder="e.g. State University / Self-Taught"
                    onChange={(e) => setCandidateCollege(e.target.value)}
                    onBlur={() =>
                      saveEducation(
                        candidateExpLevel,
                        candidateQualification,
                        candidateCollege,
                        candidateGradYear
                      )
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-1 focus:ring-[var(--blue)]"
                  />
                </div>

                {/* Graduation / Passing Year */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Graduation Year</label>
                  <select
                    value={candidateGradYear}
                    onChange={(e) =>
                      saveEducation(
                        candidateExpLevel,
                        candidateQualification,
                        candidateCollege,
                        Number(e.target.value)
                      )
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold bg-white text-slate-800 focus:ring-1 focus:ring-[var(--blue)]"
                  >
                    <option value={2027}>2027 (Upcoming)</option>
                    <option value={2026}>2026 (Final Year / Current)</option>
                    <option value={2025}>2025</option>
                    <option value={2024}>2024</option>
                    <option value={2023}>2023</option>
                    <option value={2022}>2022 or Earlier</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Quick Presets Bar */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900">⚡ 1-Click Role Presets</h2>
                  <p className="text-xs text-slate-500">
                    Instantly load verified skills for Freshers or Experienced roles.
                  </p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {QUICK_PRESETS.map((preset, idx) => (
                  <button
                    key={preset.title}
                    onClick={() => handleApplyPreset(idx)}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-[var(--blue)] hover:bg-blue-50/40 text-left transition flex items-start gap-3 group"
                  >
                    <span className="text-2xl">{preset.icon}</span>
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-[var(--blue)]">
                        {preset.title}
                      </p>
                      <p className="text-[11px] text-slate-500">{preset.role}</p>
                      <span className="text-[10px] text-slate-400 mt-1 inline-block">
                        {preset.skills.length} skills • Click to load
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Skills Selector Grid */}
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Available Skills Pool */}
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 mb-1">Select Skills</h3>
                  <p className="text-xs text-slate-500">
                    Click skills to add or remove them from your active profile.
                  </p>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search skills (e.g. Kotlin, Next.js, Supabase)..."
                    className="w-full text-xs py-2.5 pl-9 pr-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
                  />
                  <svg className="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedCategory("All")}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                      selectedCategory === "All"
                        ? "bg-[var(--navy)] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    All
                  </button>
                  {SKILL_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                        selectedCategory === cat
                          ? "bg-[var(--navy)] text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 max-h-80 overflow-y-auto p-1">
                  {filteredAvailableSkills.map((s) => {
                    const isSelected = candidateSkills.some(
                      (item) => item.skillName.toLowerCase() === s.name.toLowerCase()
                    );
                    return (
                      <button
                        key={s.name}
                        onClick={() => handleToggleSkill(s)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-blue-50 border-[var(--blue)] text-[var(--blue)] font-bold shadow-xs"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <span>{isSelected ? "✓" : "+"}</span>
                        <span>{s.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Active Profile Skills */}
              <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">
                      Active Profile Skills ({candidateSkills.length})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Configure proficiency and experience years for each verified skill.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      saveSkills([]);
                      showToast("Cleared candidate skills.");
                    }}
                    className="text-xs text-red-500 hover:underline font-semibold"
                  >
                    Clear All
                  </button>
                </div>

                {candidateSkills.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                    <span className="text-3xl block mb-2">📌</span>
                    <p className="text-xs font-bold text-slate-700 mb-1">No skills configured yet</p>
                    <p className="text-xs text-slate-400 mb-4">
                      Select skills from the left or choose a 1-Click Role Preset above.
                    </p>
                    <button
                      onClick={() => handleApplyPreset(1)}
                      className="text-xs py-2 px-4 rounded-xl font-bold bg-[var(--blue)] text-white hover:opacity-90"
                    >
                      Load Campus Graduate & Fresher
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {candidateSkills.map((s) => (
                      <div
                        key={s.skillName}
                        className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{s.skillName}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-200 text-slate-600">
                              {s.category}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <select
                            value={s.proficiency}
                            onChange={(e) =>
                              handleUpdateProficiency(s.skillName, e.target.value as ProficiencyLevel)
                            }
                            className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-[var(--blue)]"
                          >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                            <option value="expert">Expert</option>
                          </select>

                          <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden">
                            <button
                              onClick={() => handleUpdateYears(s.skillName, -1)}
                              className="px-2 py-1 text-slate-500 hover:bg-slate-100 text-xs font-bold"
                            >
                              -
                            </button>
                            <span className="px-2 py-1 text-xs font-bold text-slate-800">
                              {s.yearsExperience} yr{s.yearsExperience !== 1 ? "s" : ""}
                            </span>
                            <button
                              onClick={() => handleUpdateYears(s.skillName, 1)}
                              className="px-2 py-1 text-slate-500 hover:bg-slate-100 text-xs font-bold"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() =>
                              handleToggleSkill({ name: s.skillName, category: s.category })
                            }
                            className="p-1.5 text-slate-400 hover:text-red-500 transition"
                            title="Remove skill"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⚡</span>
                    <div>
                      <p className="text-xs font-bold text-emerald-900">
                        {qualifiedCount} Opportunities match your current profile
                      </p>
                      <p className="text-[11px] text-emerald-700">
                        Switch to Matched Opportunities to view explainable breakdown.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab("matches")}
                    className="py-1.5 px-3 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition"
                  >
                    View Matches →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MATCHED OPPORTUNITIES */}
        {activeTab === "matches" && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterFreshersOnly}
                    onChange={(e) => setFilterFreshersOnly(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>🌱 Freshers Welcome Only</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterThresholdOnly}
                    onChange={(e) => setFilterThresholdOnly(e.target.checked)}
                    className="rounded text-[var(--blue)] focus:ring-[var(--blue)]"
                  />
                  <span>Qualified Only (≥ Threshold)</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterRemoteOnly}
                    onChange={(e) => setFilterRemoteOnly(e.target.checked)}
                    className="rounded text-[var(--blue)] focus:ring-[var(--blue)]"
                  />
                  <span>Remote Only</span>
                </label>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "match" | "salary" | "recent")}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-700 focus:outline-none"
                >
                  <option value="match">Highest Match Score</option>
                  <option value="salary">Highest Salary</option>
                  <option value="recent">Most Recent</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {displayedJobs.map((job) => {
                const isApplied = applications.some((a) => a.jobId === job.id);
                const scoreColor =
                  job.match.score >= 80
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                    : job.match.score >= 60
                    ? "bg-amber-50 text-amber-700 border-amber-300"
                    : "bg-slate-100 text-slate-600 border-slate-200";

                const isFresherJob =
                  job.min_experience_years === 0 || job.experience_level === "fresher";

                return (
                  <div
                    key={job.id}
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-[var(--blue)] transition space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-extrabold text-slate-900">{job.title}</h3>
                          {isFresherJob && (
                            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                              <span>🌱</span> Freshers Welcome
                            </span>
                          )}
                          {job.is_remote && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-[var(--blue)] border border-blue-200">
                              Remote
                            </span>
                          )}
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 capitalize">
                            {job.employment_type}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-500">
                          {job.company_name} • {job.location}
                        </p>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
                        <div
                          className={`px-4 py-2 rounded-2xl border text-center flex items-center gap-2 ${scoreColor}`}
                        >
                          <span className="text-xl font-black">{job.match.score}%</span>
                          <span className="text-[11px] font-bold uppercase tracking-wide">Match</span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          Threshold: {job.min_match_threshold}% •{" "}
                          {job.match.meetsThreshold ? (
                            <strong className="text-emerald-600">Eligible</strong>
                          ) : (
                            <strong className="text-red-500">Under</strong>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Salary, Experience & Qualification Strip */}
                    <div className="grid sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl text-xs">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Compensation:</span>
                        <span className="font-extrabold text-slate-900">
                          ₹{job.salary_min?.toLocaleString("en-IN")} - ₹{job.salary_max?.toLocaleString("en-IN")}{" "}
                          / yr
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Experience Target:</span>
                        <span className="font-extrabold text-slate-800">
                          {isFresherJob
                            ? "🌱 Freshers (0+ yrs)"
                            : `💼 ${job.min_experience_years}+ Years Experience`}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Qualification:</span>
                        <span className="font-extrabold text-slate-800 truncate block">
                          🎓 {job.min_qualification || "Open to Any Degree"}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{job.description}</p>

                    {/* Skill Breakdown */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-extrabold text-slate-800">
                          Skill Breakdown & Match Explanation
                        </h4>
                        <span className="text-[11px] text-slate-500">{job.match.explanation}</span>
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs">
                        {job.match.matchedSkills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-100/70 text-emerald-800 font-semibold text-[11px]"
                          >
                            <span>✓</span> {skill}
                          </span>
                        ))}
                        {job.match.missingRequiredSkills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-100 text-rose-700 font-semibold text-[11px]"
                          >
                            <span>✕</span> {skill} (Required)
                          </span>
                        ))}
                        {job.match.missingPreferredSkills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-200/80 text-slate-600 text-[11px]"
                          >
                            <span>○</span> {skill} (Preferred)
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      {isApplied ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl">
                            Application Submitted ✓
                          </span>
                          <button
                            onClick={() => setActiveTab("applications")}
                            className="text-xs text-[var(--blue)] font-bold hover:underline"
                          >
                            View Tracker
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleApplyToJob(job)}
                          className={`py-2 px-5 rounded-xl font-bold text-xs transition ${
                            job.match.meetsThreshold
                              ? "bg-[var(--blue)] text-white hover:opacity-90 shadow-sm"
                              : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                          }`}
                        >
                          {job.match.meetsThreshold ? "1-Click Apply Now" : "Apply Anyway"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {displayedJobs.length === 0 && (
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                  <span className="text-3xl block mb-2">🔍</span>
                  <p className="text-sm font-bold text-slate-700">No matching jobs found</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Try unchecking filters or explore all experience levels.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: APPLICATION TRACKER & INTERVIEWS */}
        {activeTab === "applications" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">
                    Transparent Application Audit Tracker & Interview Booking
                  </h2>
                  <p className="text-xs text-slate-500">
                    Track recruiter review status and choose your preferred interview time slots directly when shortlisted.
                  </p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                  {applications.length} Active Applications
                </span>
              </div>

              {applications.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                  <span className="text-3xl block mb-2">📬</span>
                  <p className="text-xs font-bold text-slate-700">No applications submitted yet</p>
                  <p className="text-xs text-slate-400 mb-4">
                    Explore matched opportunities and apply with 1-click.
                  </p>
                  <button
                    onClick={() => setActiveTab("matches")}
                    className="py-2 px-4 rounded-xl text-xs font-bold bg-[var(--blue)] text-white"
                  >
                    Explore Job Matches
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {applications.map((app) => {
                    const steps: { key: ApplicationStatus; label: string }[] = [
                      { key: "submitted", label: "Submitted" },
                      { key: "viewed", label: "Viewed by Employer" },
                      { key: "shortlisted", label: "Shortlisted" },
                      { key: "interview_scheduled", label: "Interview Scheduled" },
                    ];

                    const statusIndex = steps.findIndex((s) => s.key === app.status);

                    const jobSlots = interviewSlots.filter((s) => s.job_id === app.jobId);
                    const bookedSlot = jobSlots.find(
                      (s) =>
                        s.status === "booked" &&
                        (s.candidate_id === user?.id || s.candidate_name === profile?.fullName)
                    );
                    const availableSlots = jobSlots.filter((s) => s.status === "available");
                    const isShortlistedOrBeyond = statusIndex >= 2;

                    return (
                      <div
                        key={app.id}
                        className="p-6 rounded-2xl border border-slate-200 bg-white space-y-5 shadow-xs"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div>
                            <h3 className="text-base font-extrabold text-slate-900">{app.jobTitle}</h3>
                            <p className="text-xs font-semibold text-slate-500">
                              {app.companyName} • {app.location}
                            </p>
                            <p className="text-xs font-bold text-slate-700 mt-1">
                              {app.salaryText}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="px-3 py-1.5 rounded-xl bg-blue-50 text-[var(--blue)] font-bold text-xs border border-blue-200">
                              {app.matchScore}% Match at Application
                            </div>
                            <button
                              onClick={() => handleAdvanceStatus(app.id)}
                              className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                              title="Simulate Employer Status Change"
                            >
                              Simulate Progress ➔
                            </button>
                          </div>
                        </div>

                        {/* Stepper */}
                        <div className="pt-2">
                          <div className="grid grid-cols-4 gap-2 text-center">
                            {steps.map((step, idx) => {
                              const isCompleted = statusIndex >= idx;
                              const isCurrent = statusIndex === idx;

                              return (
                                <div key={step.key} className="space-y-1.5">
                                  <div
                                    className={`h-2 rounded-full transition ${
                                      isCompleted
                                        ? "bg-emerald-500"
                                        : "bg-slate-200"
                                    }`}
                                  />
                                  <span
                                    className={`text-[10px] block font-bold truncate ${
                                      isCurrent
                                        ? "text-emerald-700"
                                        : isCompleted
                                        ? "text-slate-800"
                                        : "text-slate-400"
                                    }`}
                                  >
                                    {step.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Interview Section */}
                        {isShortlistedOrBeyond && (
                          <div className="pt-2">
                            {bookedSlot ? (
                              <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/70 space-y-3">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xl">🎉</span>
                                    <div>
                                      <h4 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wide">
                                        Interview Confirmed with {app.companyName}!
                                      </h4>
                                      <p className="text-xs font-bold text-emerald-800 mt-0.5">
                                        📅 {bookedSlot.date} • ⏰ {bookedSlot.time} ({bookedSlot.duration_minutes} mins)
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    {bookedSlot.meeting_link && (
                                      <a
                                        href={bookedSlot.meeting_link}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="py-1.5 px-3 rounded-lg bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition shadow-xs"
                                      >
                                        Join Video Call →
                                      </a>
                                    )}
                                    <button
                                      onClick={() => handleRescheduleSlot(bookedSlot.id, app.id)}
                                      className="py-1.5 px-2.5 rounded-lg border border-slate-300 bg-white text-slate-600 text-[11px] font-semibold hover:bg-slate-50"
                                    >
                                      Reschedule
                                    </button>
                                  </div>
                                </div>

                                {bookedSlot.notes && (
                                  <p className="text-[11px] text-emerald-900 bg-white/70 p-2 rounded-lg border border-emerald-200/60">
                                    <strong>Interview Agenda:</strong> {bookedSlot.notes}
                                  </p>
                                )}
                              </div>
                            ) : availableSlots.length > 0 ? (
                              <div className="p-5 rounded-xl border border-purple-200 bg-purple-50/50 space-y-4">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xl">📅</span>
                                    <h4 className="text-xs font-extrabold text-purple-950 uppercase tracking-wide">
                                      HR Has Offered {availableSlots.length} Interview Time Slots!
                                    </h4>
                                  </div>
                                  <p className="text-xs text-purple-800 mt-1">
                                    Select your preferred time slot below to confirm your technical discussion:
                                  </p>
                                </div>

                                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                                  {availableSlots.map((slot) => {
                                    const isChosen = selectedSlotForJob[app.jobId] === slot.id;

                                    return (
                                      <button
                                        type="button"
                                        key={slot.id}
                                        onClick={() =>
                                          setSelectedSlotForJob({
                                            ...selectedSlotForJob,
                                            [app.jobId]: slot.id,
                                          })
                                        }
                                        className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                                          isChosen
                                            ? "bg-purple-600 text-white border-purple-700 shadow-sm"
                                            : "bg-white text-slate-800 border-purple-200 hover:border-purple-400"
                                        }`}
                                      >
                                        <div>
                                          <p className={`text-xs font-extrabold ${isChosen ? "text-white" : "text-slate-900"}`}>
                                            {slot.date}
                                          </p>
                                          <p className={`text-xs font-semibold mt-1 ${isChosen ? "text-purple-100" : "text-purple-700"}`}>
                                            ⏰ {slot.time}
                                          </p>
                                        </div>
                                        <div className="mt-3 flex items-center justify-between text-[10px]">
                                          <span className={isChosen ? "text-purple-200" : "text-slate-400"}>
                                            {slot.duration_minutes} mins
                                          </span>
                                          <span className={`font-bold ${isChosen ? "text-white" : "text-purple-600"}`}>
                                            {isChosen ? "Selected ✓" : "Choose Slot"}
                                          </span>
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>

                                <div className="flex justify-end pt-1">
                                  <button
                                    type="button"
                                    onClick={() => handleConfirmSlotSelection(app.id, app.jobId)}
                                    disabled={!selectedSlotForJob[app.jobId]}
                                    className={`py-2 px-5 rounded-xl text-xs font-bold transition shadow-sm ${
                                      selectedSlotForJob[app.jobId]
                                        ? "bg-purple-700 text-white hover:bg-purple-800 cursor-pointer"
                                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                    }`}
                                  >
                                    Confirm Selected Interview Slot →
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/60 text-xs text-blue-900 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span>✨</span>
                                  <span>
                                    You have been shortlisted! Employer HR is preparing interview slots.
                                  </span>
                                </div>
                                <span className="text-[11px] font-semibold text-blue-700">
                                  Check back shortly
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Audit Details */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-slate-400 border-t border-slate-100">
                          <span>Applied on: {new Date(app.appliedAt).toLocaleString()}</span>
                          {app.viewedAt ? (
                            <span className="text-emerald-600 font-semibold">
                              Employer read receipt: {new Date(app.viewedAt).toLocaleTimeString()}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Awaiting employer review</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
