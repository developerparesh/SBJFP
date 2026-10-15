"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { PRESET_SKILLS, SKILL_CATEGORIES, QUALIFICATION_OPTIONS } from "@/lib/skillsData";
import {
  ApplicationStatus,
  EmploymentType,
  InterviewSlot,
  ExperienceLevel,
} from "@/types/database";
import { getStoredInterviewSlots, saveStoredInterviewSlots } from "@/lib/interviewSlotsData";

interface EmployerJob {
  id: string;
  title: string;
  companyName: string;
  employmentType: EmploymentType;
  location: string;
  isRemote: boolean;
  salaryMin: number;
  salaryMax: number;
  minMatchThreshold: number;
  minExperienceYears: number;
  experienceLevel: ExperienceLevel;
  minQualification: string;
  description: string;
  status: "published" | "draft";
  createdAt: string;
  requirements: { skillName: string; isRequired: boolean; minYears: number }[];
}

interface PipelineApplicant {
  id: string;
  jobId: string;
  candidateName: string;
  candidateEmail: string;
  experienceLevel: ExperienceLevel;
  qualification: string;
  graduationYear?: number;
  matchScore: number;
  matchedSkills: string[];
  missingRequired: string[];
  missingPreferred: string[];
  status: ApplicationStatus;
  appliedAt: string;
  viewedAt: string | null;
}

export default function EmployerDashboardPage() {
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();

  const [activeTab, setActiveTab] = useState<"jobs" | "create" | "pipeline" | "interviews">("jobs");

  // Posted Jobs
  const [jobs, setJobs] = useState<EmployerJob[]>([
    {
      id: "job-fresher-000",
      title: "Junior Software Engineer (Freshers Welcome)",
      companyName: profile?.companyName || "CodeCraft Studios",
      employmentType: "full-time",
      location: "Remote / Hyderabad",
      isRemote: true,
      salaryMin: 600000,
      salaryMax: 950000,
      minMatchThreshold: 60,
      minExperienceYears: 0,
      experienceLevel: "fresher",
      minQualification: "Any Degree / BCA / B.Tech / Self-Taught",
      description:
        "Kickstart your engineering career! We welcome passionate freshers and new graduates with solid foundations in JavaScript and React.",
      status: "published",
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      requirements: [
        { skillName: "JavaScript", isRequired: true, minYears: 0 },
        { skillName: "React", isRequired: true, minYears: 0 },
        { skillName: "Git & GitHub", isRequired: true, minYears: 0 },
        { skillName: "TypeScript", isRequired: false, minYears: 0 },
      ],
    },
    {
      id: "job-android-001",
      title: "Senior Android Developer",
      companyName: profile?.companyName || "TechMatrix Labs",
      employmentType: "full-time",
      location: "Bangalore (Hybrid)",
      isRemote: true,
      salaryMin: 1600000,
      salaryMax: 2400000,
      minMatchThreshold: 75,
      minExperienceYears: 3,
      experienceLevel: "3-5_years",
      minQualification: "B.Tech / B.E. / MCA or Equivalent",
      description:
        "Building offline-first Android apps using modern Kotlin and Jetpack Compose. You will collaborate with product designers to craft fluid mobile experiences.",
      status: "published",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      requirements: [
        { skillName: "Kotlin", isRequired: true, minYears: 3 },
        { skillName: "Jetpack Compose", isRequired: true, minYears: 2 },
        { skillName: "REST APIs", isRequired: true, minYears: 2 },
        { skillName: "Room DB", isRequired: true, minYears: 1 },
        { skillName: "CI/CD Pipelines", isRequired: false, minYears: 1 },
        { skillName: "Hilt / Dagger", isRequired: false, minYears: 1 },
      ],
    },
    {
      id: "job-fullstack-002",
      title: "Full-Stack Next.js & Supabase Engineer",
      companyName: profile?.companyName || "Apex Cloud Innovations",
      employmentType: "full-time",
      location: "Remote",
      isRemote: true,
      salaryMin: 1800000,
      salaryMax: 2800000,
      minMatchThreshold: 70,
      minExperienceYears: 2,
      experienceLevel: "1-3_years",
      minQualification: "B.Tech / B.E. / BCA / MCA / Any Degree",
      description:
        "Looking for a full-stack engineer to build scalable web platforms with Next.js App Router, TypeScript, and Supabase.",
      status: "published",
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      requirements: [
        { skillName: "TypeScript", isRequired: true, minYears: 2 },
        { skillName: "Next.js", isRequired: true, minYears: 2 },
        { skillName: "React", isRequired: true, minYears: 2 },
        { skillName: "Supabase", isRequired: true, minYears: 1 },
        { skillName: "Tailwind CSS", isRequired: false, minYears: 1 },
        { skillName: "PostgreSQL", isRequired: false, minYears: 1 },
      ],
    },
  ]);

  // Applicants Pipeline
  const [applicants, setApplicants] = useState<PipelineApplicant[]>([
    {
      id: "app-204",
      jobId: "job-fresher-000",
      candidateName: "Neha Patel",
      candidateEmail: "neha.patel@example.com",
      experienceLevel: "fresher",
      qualification: "B.Tech Computer Science (2026 Grad)",
      graduationYear: 2026,
      matchScore: 94,
      matchedSkills: ["JavaScript", "React", "Git & GitHub", "TypeScript"],
      missingRequired: [],
      missingPreferred: ["REST APIs"],
      status: "shortlisted",
      appliedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      viewedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
    {
      id: "app-201",
      jobId: "job-android-001",
      candidateName: "Aarav Sharma",
      candidateEmail: "aarav.dev@example.com",
      experienceLevel: "3-5_years",
      qualification: "B.Tech IT (2023 Grad)",
      graduationYear: 2023,
      matchScore: 88,
      matchedSkills: ["Kotlin", "Jetpack Compose", "REST APIs", "Room DB", "Git & GitHub"],
      missingRequired: [],
      missingPreferred: ["Hilt / Dagger"],
      status: "shortlisted",
      appliedAt: new Date(Date.now() - 86400000).toISOString(),
      viewedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: "app-202",
      jobId: "job-android-001",
      candidateName: "Rohan Varma",
      candidateEmail: "rohan.v@example.com",
      experienceLevel: "fresher",
      qualification: "BCA Computer Applications (2025 Grad)",
      graduationYear: 2025,
      matchScore: 65,
      matchedSkills: ["Kotlin", "REST APIs"],
      missingRequired: ["Jetpack Compose", "Room DB"],
      missingPreferred: ["CI/CD Pipelines", "Hilt / Dagger"],
      status: "submitted",
      appliedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      viewedAt: null,
    },
    {
      id: "app-203",
      jobId: "job-fullstack-002",
      candidateName: "Priya Nair",
      candidateEmail: "priya.nair@example.com",
      experienceLevel: "1-3_years",
      qualification: "M.Tech Software Engineering (2024 Grad)",
      graduationYear: 2024,
      matchScore: 92,
      matchedSkills: ["TypeScript", "Next.js", "React", "Supabase", "Tailwind CSS"],
      missingRequired: [],
      missingPreferred: ["PostgreSQL"],
      status: "interview_scheduled",
      appliedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      viewedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ]);

  // Interview Slots State
  const [interviewSlots, setInterviewSlots] = useState<InterviewSlot[]>([]);

  // Slot Form State
  const [slotJobId, setSlotJobId] = useState<string>("job-android-001");
  const [slotDate, setSlotDate] = useState<string>("Tomorrow (Oct 16, 2026)");
  const [slotTime, setSlotTime] = useState<string>("10:30 AM - 11:15 AM IST");
  const [slotDuration, setSlotDuration] = useState<number>(45);
  const [slotMeetingLink, setSlotMeetingLink] = useState<string>("https://meet.google.com/sbj-meet-new");
  const [slotNotes, setSlotNotes] = useState<string>("Round 1: Technical Architecture & Problem Solving");

  // Load Interview Slots
  useEffect(() => {
    setInterviewSlots(getStoredInterviewSlots());
  }, []);

  // Create Job Form State
  const [formTitle, setFormTitle] = useState("");
  const [formType, setFormType] = useState<EmploymentType>("full-time");
  const [formLocation, setFormLocation] = useState("Bangalore (Hybrid)");
  const [formIsRemote, setFormIsRemote] = useState(true);
  const [formSalaryMin, setFormSalaryMin] = useState(1200000);
  const [formSalaryMax, setFormSalaryMax] = useState(2000000);
  const [formThreshold, setFormThreshold] = useState(70);
  const [formExpLevel, setFormExpLevel] = useState<ExperienceLevel>("fresher");
  const [formMinExpYears, setFormMinExpYears] = useState<number>(0);
  const [formMinQualification, setFormMinQualification] = useState<string>(
    "Any Degree / BCA / B.Tech / Self-Taught"
  );
  const [formDesc, setFormDesc] = useState("");
  const [formRequirements, setFormRequirements] = useState<
    { skillName: string; isRequired: boolean; minYears: number }[]
  >([
    { skillName: "TypeScript", isRequired: true, minYears: 1 },
    { skillName: "React", isRequired: true, minYears: 1 },
    { skillName: "Git & GitHub", isRequired: true, minYears: 0 },
    { skillName: "Tailwind CSS", isRequired: false, minYears: 0 },
  ]);

  // Skill Selector in Create Job
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchSkill, setSearchSkill] = useState<string>("");

  // Pipeline Filter
  const [pipelineJobFilter, setPipelineJobFilter] = useState<string>("all");
  const [pipelineQualifiedOnly, setPipelineQualifiedOnly] = useState<boolean>(false);
  const [pipelineExpFilter, setPipelineExpFilter] = useState<"all" | "fresher" | "experienced">("all");

  // Notification Toast
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
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
        <svg className="animate-spin h-5 w-5 mr-3 text-[var(--navy)]" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        Loading Employer Portal...
      </div>
    );
  }

  // Toggle requirement in form
  const handleToggleFormSkill = (skillName: string) => {
    const exists = formRequirements.some((r) => r.skillName.toLowerCase() === skillName.toLowerCase());
    if (exists) {
      setFormRequirements(formRequirements.filter((r) => r.skillName.toLowerCase() !== skillName.toLowerCase()));
    } else {
      setFormRequirements([
        ...formRequirements,
        { skillName, isRequired: true, minYears: formExpLevel === "fresher" ? 0 : 1 },
      ]);
    }
  };

  const handleUpdateReqType = (skillName: string, isRequired: boolean) => {
    setFormRequirements(
      formRequirements.map((r) => (r.skillName === skillName ? { ...r, isRequired } : r))
    );
  };

  const handleUpdateReqYears = (skillName: string, delta: number) => {
    setFormRequirements(
      formRequirements.map((r) => {
        if (r.skillName === skillName) {
          const next = Math.max(0, Math.min(15, r.minYears + delta));
          return { ...r, minYears: next };
        }
        return r;
      })
    );
  };

  // Handle Create Job
  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showToast("Please provide a job title.");
      return;
    }
    if (formRequirements.length === 0) {
      showToast("Please add at least 1 skill requirement.");
      return;
    }

    const newJob: EmployerJob = {
      id: `job-${Date.now()}`,
      title: formTitle.trim(),
      companyName: profile?.companyName || "Tech Innovations Ltd",
      employmentType: formType,
      location: formLocation.trim() || "Remote",
      isRemote: formIsRemote,
      salaryMin: Number(formSalaryMin),
      salaryMax: Number(formSalaryMax),
      minMatchThreshold: Number(formThreshold),
      minExperienceYears: Number(formMinExpYears),
      experienceLevel: formExpLevel,
      minQualification: formMinQualification,
      description: formDesc.trim() || "Role specifications and requirements.",
      status: "published",
      createdAt: new Date().toISOString(),
      requirements: formRequirements,
    };

    setJobs([newJob, ...jobs]);
    showToast(`Role "${newJob.title}" posted successfully with ${formRequirements.length} skill requirements!`);

    setFormTitle("");
    setFormDesc("");
    setActiveTab("jobs");
  };

  // Handle Add Interview Slot
  const handleAddInterviewSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedJob = jobs.find((j) => j.id === slotJobId);
    const newSlot: InterviewSlot = {
      id: `slot-${Date.now()}`,
      job_id: slotJobId,
      job_title: matchedJob ? matchedJob.title : "Technical Role",
      date: slotDate.trim(),
      time: slotTime.trim(),
      duration_minutes: slotDuration,
      meeting_link: slotMeetingLink.trim(),
      notes: slotNotes.trim(),
      status: "available",
      candidate_id: null,
      candidate_name: null,
      created_at: new Date().toISOString(),
    };

    const updated = [newSlot, ...interviewSlots];
    setInterviewSlots(updated);
    saveStoredInterviewSlots(updated);
    showToast(`Interview slot added for ${newSlot.job_title}!`);
  };

  // Delete Slot
  const handleDeleteSlot = (slotId: string) => {
    const updated = interviewSlots.filter((s) => s.id !== slotId);
    setInterviewSlots(updated);
    saveStoredInterviewSlots(updated);
    showToast("Interview slot removed.");
  };

  // Update Applicant Status in Pipeline
  const handleUpdateApplicantStatus = (appId: string, newStatus: ApplicationStatus) => {
    setApplicants((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            status: newStatus,
            viewedAt: app.viewedAt || new Date().toISOString(),
          };
        }
        return app;
      })
    );
    showToast(`Candidate status updated to: ${newStatus}`);
  };

  // Filtered applicants
  const filteredApplicants = applicants.filter((app) => {
    const matchesJob = pipelineJobFilter === "all" || app.jobId === pipelineJobFilter;
    const currentJob = jobs.find((j) => j.id === app.jobId);
    const meetsThreshold = currentJob ? app.matchScore >= currentJob.minMatchThreshold : true;
    const matchesQual = !pipelineQualifiedOnly || meetsThreshold;

    let matchesExp = true;
    if (pipelineExpFilter === "fresher") {
      matchesExp = app.experienceLevel === "fresher";
    } else if (pipelineExpFilter === "experienced") {
      matchesExp = app.experienceLevel !== "fresher";
    }

    return matchesJob && matchesQual && matchesExp;
  });

  const availableFormSkills = PRESET_SKILLS.filter((s) => {
    const matchCat = selectedCategory === "All" || s.category === selectedCategory;
    const matchSearch = s.name.toLowerCase().includes(searchSkill.toLowerCase().trim());
    return matchCat && matchSearch;
  });

  const bookedSlotsCount = interviewSlots.filter((s) => s.status === "booked").length;
  const availableSlotsCount = interviewSlots.filter((s) => s.status === "available").length;

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[var(--navy)] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 animate-bounce">
          <span className="text-emerald-400 font-bold text-lg">✓</span>
          <span className="text-xs font-medium">{notification}</span>
        </div>
      )}

      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/logo.png" alt="SBJFP" width={32} height={32} className="rounded-lg" />
              <span className="font-extrabold text-xl tracking-tight text-[var(--navy)]">SBJFP</span>
            </Link>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Employer Portal
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-800">{profile?.fullName}</p>
              <p className="text-[11px] text-slate-400">{profile?.companyName || "Hiring Manager"}</p>
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
        {/* Banner */}
        <div
          className="rounded-2xl p-6 sm:p-8 text-white mb-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
          style={{ backgroundColor: "var(--navy)" }}
        >
          <div>
            <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-white/10 text-[var(--mint)] mb-3 inline-block">
              Freshers & Experienced Hiring Suite • Qualification Grounded
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">
              {profile?.companyName ? `${profile.companyName} Hiring Suite` : "Employer Hiring Suite"}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
              Post roles for Freshers or Experienced candidates, set minimum qualifications, and offer interview slots that candidates can self-select directly.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-white/5 p-4 rounded-xl border border-white/10 min-w-[280px]">
            <div className="text-center">
              <span className="block text-2xl font-black text-white">{jobs.length}</span>
              <span className="text-[10px] text-slate-300 uppercase tracking-wide">Jobs Posted</span>
            </div>
            <div className="text-center border-x border-white/10">
              <span className="block text-2xl font-black text-[var(--mint)]">{applicants.length}</span>
              <span className="text-[10px] text-slate-300 uppercase tracking-wide">Applicants</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-black text-amber-300">
                {interviewSlots.length}
              </span>
              <span className="text-[10px] text-slate-300 uppercase tracking-wide">Interview Slots</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 mb-8 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("jobs")}
            className={`py-3 px-5 text-sm font-bold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === "jobs"
                ? "border-[var(--blue)] text-[var(--blue)] bg-white rounded-t-xl"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>📋 Active Postings</span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-[var(--blue)]">
              {jobs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("create")}
            className={`py-3 px-5 text-sm font-bold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === "create"
                ? "border-[var(--blue)] text-[var(--blue)] bg-white rounded-t-xl"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>➕ Post Structured Role</span>
          </button>

          <button
            onClick={() => setActiveTab("pipeline")}
            className={`py-3 px-5 text-sm font-bold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === "pipeline"
                ? "border-[var(--blue)] text-[var(--blue)] bg-white rounded-t-xl"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>👥 Candidate Pipeline</span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-700">
              {applicants.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("interviews")}
            className={`py-3 px-5 text-sm font-bold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === "interviews"
                ? "border-[var(--blue)] text-[var(--blue)] bg-white rounded-t-xl"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>📅 Interview Slots (HR)</span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-700 font-extrabold">
              {availableSlotsCount} open / {bookedSlotsCount} booked
            </span>
          </button>
        </div>

        {/* TAB 1: ACTIVE JOBS */}
        {activeTab === "jobs" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Your Posted Roles</h2>
                <p className="text-xs text-slate-500">
                  Manage requirement weights, thresholds, experience targets, and view applicant pools.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("create")}
                className="py-2 px-4 rounded-xl font-bold text-xs bg-[var(--blue)] text-white hover:opacity-90 shadow-sm transition"
              >
                + Post New Job
              </button>
            </div>

            <div className="space-y-4">
              {jobs.map((job) => {
                const jobApplicants = applicants.filter((a) => a.jobId === job.id);
                const highFitCount = jobApplicants.filter(
                  (a) => a.matchScore >= job.minMatchThreshold
                ).length;
                const isFresher =
                  job.minExperienceYears === 0 || job.experienceLevel === "fresher";

                return (
                  <div
                    key={job.id}
                    className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-extrabold text-slate-900">{job.title}</h3>
                          {isFresher && (
                            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                              🌱 Freshers Welcome (0+ yrs)
                            </span>
                          )}
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {job.status}
                          </span>
                          {job.isRemote && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-[var(--blue)]">
                              Remote
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-slate-500 mt-1">
                          {job.location} • {job.employmentType} • Posted{" "}
                          {new Date(job.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setPipelineJobFilter(job.id);
                            setActiveTab("pipeline");
                          }}
                          className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center gap-2"
                        >
                          <span>Review Applicants</span>
                          <span className="px-1.5 py-0.2 rounded-full bg-[var(--navy)] text-white text-[10px]">
                            {jobApplicants.length}
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            setSlotJobId(job.id);
                            setActiveTab("interviews");
                          }}
                          className="py-1.5 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition border border-purple-200"
                        >
                          📅 Add Slots
                        </button>
                      </div>
                    </div>

                    {/* Stats & Salary Strip */}
                    <div className="grid sm:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-xl text-xs">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Salary Range:</span>
                        <span className="font-extrabold text-slate-800">
                          ₹{job.salaryMin.toLocaleString("en-IN")} - ₹{job.salaryMax.toLocaleString("en-IN")}{" "}
                          / yr
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Experience Target:</span>
                        <span className="font-extrabold text-slate-800">
                          {isFresher
                            ? "🌱 Freshers (0 Yrs)"
                            : `💼 ${job.minExperienceYears}+ Years Experience`}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Target Qualification:</span>
                        <span className="font-extrabold text-slate-800 truncate block">
                          🎓 {job.minQualification}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Qualified Candidates:</span>
                        <span className="font-extrabold text-emerald-600">
                          {highFitCount} of {jobApplicants.length} meet threshold
                        </span>
                      </div>
                    </div>

                    {/* Skills Requirements Preview */}
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Configured Skill Weights:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {job.requirements.map((req) => (
                          <span
                            key={req.skillName}
                            className={`text-xs px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 ${
                              req.isRequired
                                ? "bg-blue-50 text-[var(--blue)] border border-blue-200"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            <span>{req.isRequired ? "★" : "○"}</span>
                            <span>{req.skillName}</span>
                            <span className="text-[10px] text-slate-400">({req.minYears}+ yrs)</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: CREATE STRUCTURED JOB */}
        {activeTab === "create" && (
          <form onSubmit={handleCreateJob} className="space-y-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Post a Structured Role</h2>
              <p className="text-xs text-slate-500">
                Define required skills, experience bounds (Freshers or Experienced), and qualification criteria.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Role Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Junior Kotlin Developer (Freshers Welcome)"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Employment Type</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as EmploymentType)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[var(--blue)] bg-white"
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              {/* Target Experience Level */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Experience Level Target *</label>
                <select
                  value={formExpLevel}
                  onChange={(e) => {
                    const level = e.target.value as ExperienceLevel;
                    setFormExpLevel(level);
                    if (level === "fresher") {
                      setFormMinExpYears(0);
                    } else if (level === "1-3_years") {
                      setFormMinExpYears(1);
                    } else if (level === "3-5_years") {
                      setFormMinExpYears(3);
                    } else if (level === "5+_years") {
                      setFormMinExpYears(5);
                    }
                  }}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-[var(--blue)] bg-white"
                >
                  <option value="fresher">🌱 Freshers Welcome (0 Years Experience)</option>
                  <option value="1-3_years">⚡ 1 - 3 Years (Junior / Associate)</option>
                  <option value="3-5_years">💼 3 - 5 Years (Mid-Level)</option>
                  <option value="5+_years">🚀 5+ Years (Senior / Lead)</option>
                  <option value="any">Any Experience Level</option>
                </select>
              </div>

              {/* Minimum Experience Years */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Minimum Experience (Years) *</label>
                <input
                  type="number"
                  min={0}
                  max={20}
                  required
                  value={formMinExpYears}
                  onChange={(e) => setFormMinExpYears(Number(e.target.value))}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
                />
              </div>

              {/* Minimum Qualification Requirement */}
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700">Required / Preferred Qualification *</label>
                <select
                  value={formMinQualification}
                  onChange={(e) => setFormMinQualification(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-[var(--blue)] bg-white"
                >
                  {QUALIFICATION_OPTIONS.map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Bangalore, Mumbai, Remote"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
                />
              </div>

              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="remoteCheckbox"
                  checked={formIsRemote}
                  onChange={(e) => setFormIsRemote(e.target.checked)}
                  className="rounded text-[var(--blue)] focus:ring-[var(--blue)] h-4 w-4"
                />
                <label htmlFor="remoteCheckbox" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Allows 100% Remote Work
                </label>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Minimum Annual Salary (₹ INR) *</label>
                <input
                  type="number"
                  required
                  step={50000}
                  value={formSalaryMin}
                  onChange={(e) => setFormSalaryMin(Number(e.target.value))}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Maximum Annual Salary (₹ INR) *</label>
                <input
                  type="number"
                  required
                  step={50000}
                  value={formSalaryMax}
                  onChange={(e) => setFormSalaryMax(Number(e.target.value))}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
                />
              </div>

              <div className="md:col-span-2 space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">
                    Candidate Minimum Match Threshold: <strong className="text-[var(--blue)]">{formThreshold}%</strong>
                  </span>
                  <span className="text-slate-500">
                    Candidates scoring below this will be flagged as Under-Threshold
                  </span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={95}
                  step={5}
                  value={formThreshold}
                  onChange={(e) => setFormThreshold(Number(e.target.value))}
                  className="w-full accent-[var(--blue)]"
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700">Role Description</label>
                <textarea
                  rows={3}
                  placeholder="Outline responsibilities and team dynamics..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
                />
              </div>
            </div>

            {/* Skill Requirements Builder */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Structured Skill Requirements ({formRequirements.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Select skills, designate them as <strong>Required (75% weight)</strong> or{" "}
                  <strong>Preferred (25% weight)</strong>, and configure minimum years (0 for Freshers!).
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search skills to add..."
                    value={searchSkill}
                    onChange={(e) => setSearchSkill(e.target.value)}
                    className="text-xs p-2 rounded-lg border border-slate-200 bg-white"
                  />
                  <div className="flex flex-wrap gap-1">
                    <button
                      type="button"
                      onClick={() => setSelectedCategory("All")}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                        selectedCategory === "All" ? "bg-[var(--navy)] text-white" : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      All
                    </button>
                    {SKILL_CATEGORIES.map((cat) => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                          selectedCategory === cat ? "bg-[var(--navy)] text-white" : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                  {availableFormSkills.map((s) => {
                    const isAdded = formRequirements.some(
                      (r) => r.skillName.toLowerCase() === s.name.toLowerCase()
                    );
                    return (
                      <button
                        type="button"
                        key={s.name}
                        onClick={() => handleToggleFormSkill(s.name)}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition ${
                          isAdded
                            ? "bg-blue-100 border-[var(--blue)] text-[var(--blue)]"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {isAdded ? "✓ " : "+ "}
                        {s.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                {formRequirements.map((req) => (
                  <div
                    key={req.skillName}
                    className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <span className="font-bold text-slate-900">{req.skillName}</span>

                    <div className="flex items-center gap-3">
                      <div className="flex rounded-lg border border-slate-200 p-0.5 bg-slate-100">
                        <button
                          type="button"
                          onClick={() => handleUpdateReqType(req.skillName, true)}
                          className={`px-2.5 py-1 rounded-md font-bold text-[11px] transition ${
                            req.isRequired ? "bg-blue-600 text-white shadow-xs" : "text-slate-600"
                          }`}
                        >
                          Required (75%)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateReqType(req.skillName, false)}
                          className={`px-2.5 py-1 rounded-md font-bold text-[11px] transition ${
                            !req.isRequired ? "bg-slate-700 text-white shadow-xs" : "text-slate-600"
                          }`}
                        >
                          Preferred (25%)
                        </button>
                      </div>

                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                        <button
                          type="button"
                          onClick={() => handleUpdateReqYears(req.skillName, -1)}
                          className="px-2 py-1 text-slate-500 hover:bg-slate-100 font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 py-1 font-bold text-slate-800">
                          {req.minYears}+ yrs
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateReqYears(req.skillName, 1)}
                          className="px-2 py-1 text-slate-500 hover:bg-slate-100 font-bold"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleFormSkill(req.skillName)}
                        className="text-slate-400 hover:text-red-500 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab("jobs")}
                className="py-2.5 px-5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl text-xs font-bold bg-[var(--blue)] text-white hover:opacity-90 shadow-sm"
              >
                Publish Structured Listing
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: CANDIDATE PIPELINE */}
        {activeTab === "pipeline" && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-slate-500">Filter Job:</span>
                <select
                  value={pipelineJobFilter}
                  onChange={(e) => setPipelineJobFilter(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-700"
                >
                  <option value="all">All Jobs ({applicants.length})</option>
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.title}
                    </option>
                  ))}
                </select>

                <span className="text-xs font-bold text-slate-500 ml-2">Experience:</span>
                <select
                  value={pipelineExpFilter}
                  onChange={(e) =>
                    setPipelineExpFilter(e.target.value as "all" | "fresher" | "experienced")
                  }
                  className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-700"
                >
                  <option value="all">All Experience Levels</option>
                  <option value="fresher">🌱 Freshers Only</option>
                  <option value="experienced">💼 Experienced Only</option>
                </select>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer ml-2">
                  <input
                    type="checkbox"
                    checked={pipelineQualifiedOnly}
                    onChange={(e) => setPipelineQualifiedOnly(e.target.checked)}
                    className="rounded text-[var(--blue)] focus:ring-[var(--blue)]"
                  />
                  <span>Qualified Only (≥ Threshold)</span>
                </label>
              </div>

              <span className="text-xs font-bold text-slate-400">
                Showing {filteredApplicants.length} Candidates
              </span>
            </div>

            {/* Applicant Cards */}
            <div className="space-y-4">
              {filteredApplicants.map((app) => {
                const job = jobs.find((j) => j.id === app.jobId);
                const scoreColor =
                  app.matchScore >= 80
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                    : app.matchScore >= 60
                    ? "bg-amber-50 text-amber-700 border-amber-300"
                    : "bg-slate-100 text-slate-600 border-slate-200";

                const isFresher = app.experienceLevel === "fresher";

                return (
                  <div
                    key={app.id}
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-extrabold text-slate-900">
                            {app.candidateName}
                          </h3>
                          {isFresher ? (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                              🌱 Fresher
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                              💼 Experienced
                            </span>
                          )}
                          <span className="text-xs text-slate-400">• {app.candidateEmail}</span>
                        </div>

                        {/* Candidate Qualification Strip */}
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                          <span className="font-semibold text-slate-700">
                            🎓 {app.qualification}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="font-bold text-[var(--blue)]">
                            Applied for: {job?.title || "Role"}
                          </span>
                        </div>
                      </div>

                      {/* Score Badge */}
                      <div className="flex items-center gap-3">
                        <div className={`px-3 py-1.5 rounded-xl border text-center ${scoreColor}`}>
                          <span className="text-lg font-black">{app.matchScore}%</span>
                          <span className="text-[10px] font-bold uppercase ml-1">Match</span>
                        </div>
                      </div>
                    </div>

                    {/* Skill Breakdown */}
                    <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                        Verified Skill Match Breakdown:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {app.matchedSkills.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-semibold text-[11px]"
                          >
                            ✓ {s}
                          </span>
                        ))}
                        {app.missingRequired.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 font-semibold text-[11px]"
                          >
                            ✕ {s} (Missing Required)
                          </span>
                        ))}
                        {app.missingPreferred.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-600 text-[11px]"
                          >
                            ○ {s} (Missing Preferred)
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action & Status Progression Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                      <div className="text-[11px] text-slate-400">
                        Applied {new Date(app.appliedAt).toLocaleDateString()}
                        {app.viewedAt && (
                          <span className="text-emerald-600 font-semibold ml-2">
                            • Opened {new Date(app.viewedAt).toLocaleTimeString()}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSlotJobId(app.jobId);
                            setActiveTab("interviews");
                          }}
                          className="px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 font-bold text-xs border border-purple-200 hover:bg-purple-100 transition"
                        >
                          📅 Offer Interview Slot
                        </button>

                        <span className="text-slate-500 font-semibold ml-2">Stage:</span>
                        <select
                          value={app.status}
                          onChange={(e) =>
                            handleUpdateApplicantStatus(app.id, e.target.value as ApplicationStatus)
                          }
                          className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 font-bold text-slate-800 capitalize focus:outline-none"
                        >
                          <option value="submitted">Submitted</option>
                          <option value="viewed">Viewed by Employer</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="interview_scheduled">Interview Scheduled</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredApplicants.length === 0 && (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                  <span className="text-3xl block mb-2">👥</span>
                  <p className="text-xs font-bold text-slate-700">No applicants matching filter</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: INTERVIEW SLOTS (HR) */}
        {activeTab === "interviews" && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  HR Interview Slots & Scheduling
                </h2>
                <p className="text-xs text-slate-500">
                  Add available interview slots for your roles. Candidates will see these slots in their portal and choose their preferred time.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 font-bold">
                  {availableSlotsCount} Open Slots
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
                  {bookedSlotsCount} Booked by Candidates
                </span>
              </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Form */}
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-extrabold text-slate-900">➕ Add New Interview Slot</h3>
                  <p className="text-xs text-slate-500">
                    Offer a time window for technical screening or hiring manager rounds.
                  </p>
                </div>

                <form onSubmit={handleAddInterviewSlot} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Target Role *</label>
                    <select
                      value={slotJobId}
                      onChange={(e) => setSlotJobId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold text-slate-800 bg-white"
                    >
                      {jobs.map((j) => (
                        <option key={j.id} value={j.id}>
                          {j.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Date *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tomorrow (Oct 16, 2026)"
                      value={slotDate}
                      onChange={(e) => setSlotDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Time Slot *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 10:30 AM - 11:15 AM"
                        value={slotTime}
                        onChange={(e) => setSlotTime(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Duration</label>
                      <select
                        value={slotDuration}
                        onChange={(e) => setSlotDuration(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold bg-white"
                      >
                        <option value={30}>30 mins</option>
                        <option value={45}>45 mins</option>
                        <option value={60}>60 mins</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Meeting Link (Google Meet / Zoom)</label>
                    <input
                      type="url"
                      placeholder="https://meet.google.com/..."
                      value={slotMeetingLink}
                      onChange={(e) => setSlotMeetingLink(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Agenda / Interviewer Notes</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Technical live coding & architecture evaluation"
                      value={slotNotes}
                      onChange={(e) => setSlotNotes(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl font-bold bg-[var(--blue)] text-white hover:opacity-90 transition shadow-sm"
                  >
                    Publish Interview Slot
                  </button>
                </form>
              </div>

              {/* Right Column: Existing Slots */}
              <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">
                      Offered Interview Slots ({interviewSlots.length})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Review open slots or confirmed bookings made by candidates.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
                  {interviewSlots.map((slot) => {
                    const isBooked = slot.status === "booked";

                    return (
                      <div
                        key={slot.id}
                        className={`p-4 rounded-xl border transition ${
                          isBooked
                            ? "bg-emerald-50/50 border-emerald-300"
                            : "bg-slate-50/70 border-slate-200"
                        } space-y-3`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-xs text-slate-900">
                                {slot.job_title}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                  isBooked
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                    : "bg-purple-100 text-purple-700 border border-purple-200"
                                }`}
                              >
                                {isBooked ? "Confirmed by Candidate" : "Open / Available"}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-slate-700 mt-1">
                              📅 {slot.date} • ⏰ {slot.time} ({slot.duration_minutes}m)
                            </p>
                          </div>

                          <button
                            onClick={() => handleDeleteSlot(slot.id)}
                            className="text-xs text-slate-400 hover:text-red-500 font-bold self-start"
                            title="Cancel slot"
                          >
                            ✕ Remove
                          </button>
                        </div>

                        {isBooked ? (
                          <div className="p-2.5 bg-emerald-100/60 rounded-lg text-xs flex items-center justify-between">
                            <span className="font-bold text-emerald-900">
                              Booked by: {slot.candidate_name || "Shortlisted Candidate"}
                            </span>
                            {slot.meeting_link && (
                              <a
                                href={slot.meeting_link}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1 rounded-md bg-emerald-700 text-white font-bold text-[11px] hover:bg-emerald-800"
                              >
                                Join Video Call →
                              </a>
                            )}
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-500 flex items-center justify-between">
                            <span>Awaiting candidate selection in Candidate Portal</span>
                            {slot.meeting_link && (
                              <span className="text-slate-400 font-mono text-[10px] truncate max-w-[200px]">
                                {slot.meeting_link}
                              </span>
                            )}
                          </div>
                        )}

                        {slot.notes && (
                          <p className="text-[11px] text-slate-500 italic bg-white/70 p-2 rounded-lg border border-slate-100">
                            Agenda: {slot.notes}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
