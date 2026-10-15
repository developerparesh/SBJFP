"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getStoredInterviewSlots } from "@/lib/interviewSlotsData";
import { InterviewSlot } from "@/types/database";

interface InterviewPrepItem {
  id: string;
  topic: string;
  category: string;
  completed: boolean;
}

export default function InterviewHubPage() {
  const [slots, setSlots] = useState<InterviewSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<InterviewSlot | null>(null);
  const [prepChecklist, setPrepChecklist] = useState<InterviewPrepItem[]>([
    { id: "p1", topic: "Review core architecture patterns (Clean Architecture, Modularization)", category: "Architecture", completed: false },
    { id: "p2", topic: "Be prepared to demonstrate State Management & Async concurrency flows", category: "Core Skills", completed: true },
    { id: "p3", topic: "Prepare 2 production challenges you solved and their trade-offs", category: "Experience", completed: false },
    { id: "p4", topic: "Test microphone, camera, and screen sharing setup", category: "Logistics", completed: true },
    { id: "p5", topic: "Prepare 2-3 thoughtful questions about the team's tech roadmap", category: "Culture", completed: false },
  ]);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const loaded = getStoredInterviewSlots();
    setSlots(loaded);
    // Find first booked slot, or default to the first slot for demonstration
    const booked = loaded.find((s) => s.status === "booked" || s.candidate_name) || loaded[0];
    if (booked) setSelectedSlot(booked);
  }, []);

  const toggleChecklist = (id: string) => {
    setPrepChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleCopyLink = (url?: string) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const completedCount = prepChecklist.filter((i) => i.completed).length;
  const progressPct = Math.round((completedCount / prepChecklist.length) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b1320] text-slate-100 font-sans selection:bg-[#42D6A4]/30">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb / Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
              <Link href="/dashboard/candidate" className="hover:text-[#42D6A4] transition-colors">Candidate Dashboard</Link>
              <span>/</span>
              <span className="text-slate-200">Interview Hub</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>🎙️</span> Live Interview Hub & Prep Checklist
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Confirmed technical rounds, preparation checklist, and video call link.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/candidate"
              className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl border border-slate-700 transition"
            >
              ← Back to Portal
            </Link>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Scheduled Interview Card & Google Meet Launcher */}
          <div className="lg:col-span-2 space-y-6">
            {selectedSlot ? (
              <div className="bg-[#102A43]/80 border border-slate-700/80 rounded-2xl p-6 sm:p-8 backdrop-blur shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#1479C9]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-800">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      {selectedSlot.status === "booked" ? "Confirmed Technical Round" : "Open Interview Slot"}
                    </span>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {selectedSlot.notes || "Technical Architecture & Code Walkthrough"}
                    </h2>
                    <p className="text-slate-300 font-medium text-base">
                      {selectedSlot.job_title}
                    </p>
                  </div>

                  {/* Date & Time Badge */}
                  <div className="bg-slate-900/90 border border-slate-700 rounded-xl p-4 text-center min-w-[140px]">
                    <div className="text-xs uppercase text-slate-400 font-bold tracking-wider mb-1">Date & Time</div>
                    <div className="text-lg font-bold text-[#42D6A4]">{selectedSlot.date}</div>
                    <div className="text-xs text-slate-300 font-medium">{selectedSlot.time} ({selectedSlot.duration_minutes} min)</div>
                  </div>
                </div>

                {/* Status Banner / Countdown */}
                <div className="my-6 bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-blue-900/40 border border-blue-500/30 rounded-xl p-4 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-xl font-bold">
                      ⏱️
                    </div>
                    <div>
                      <div className="text-xs text-blue-300 font-semibold uppercase tracking-wider">Interview Status</div>
                      <div className="text-sm font-bold text-white">Upcoming Round — Scheduled with Hiring Team</div>
                    </div>
                  </div>
                  <div className="text-xs font-mono bg-blue-950/80 border border-blue-500/30 px-3 py-1.5 rounded-lg text-blue-300">
                    Platform: Google Meet Video
                  </div>
                </div>

                {/* Google Meet Launcher & Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <a
                    href={selectedSlot.meeting_link || "https://meet.google.com"}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#1479C9] to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition transform hover:-translate-y-0.5"
                  >
                    <span>📹</span> Join Video Call
                  </a>

                  {selectedSlot.meeting_link && (
                    <button
                      onClick={() => handleCopyLink(selectedSlot.meeting_link)}
                      className="px-4 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-slate-700 font-semibold text-sm transition flex items-center gap-2"
                    >
                      <span>{copiedLink ? "✓ Copied" : "📋 Copy Link"}</span>
                    </button>
                  )}

                  <Link
                    href="/dashboard/candidate"
                    className="px-4 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-xl border border-slate-800 font-medium text-sm transition"
                  >
                    Reschedule
                  </Link>
                </div>

                {/* Candidate notes */}
                <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                  <span>💡</span>
                  <span>
                    Camera & mic permission recommended 5 mins early. Join directly from Chrome or mobile app.
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
                <div className="text-4xl mb-3">📅</div>
                <h3 className="text-lg font-bold text-white">No Confirmed Interview Yet</h3>
                <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
                  Once an employer shortlists your application, you will be invited to select an open interview slot here.
                </p>
                <Link
                  href="/dashboard/candidate"
                  className="mt-4 inline-block px-5 py-2.5 bg-[#1479C9] text-white font-semibold rounded-xl text-sm"
                >
                  View Active Applications
                </Link>
              </div>
            )}

            {/* Preparation Checklist */}
            <div className="bg-[#102A43]/50 border border-slate-800 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>📋</span> Technical Preparation Checklist
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Structured checklist based on the job&apos;s verified skill requirements.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-[#42D6A4]">{progressPct}%</span>
                  <div className="text-[10px] text-slate-400">{completedCount} of {prepChecklist.length} ready</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-6">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-[#42D6A4] h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              {/* Items */}
              <div className="space-y-3">
                {prepChecklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklist(item.id)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                      item.completed
                        ? "bg-emerald-950/20 border-emerald-500/30 text-slate-300"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-200"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold mt-0.5 transition ${
                        item.completed
                          ? "bg-emerald-500 text-slate-950"
                          : "border border-slate-600 bg-slate-800"
                      }`}
                    >
                      {item.completed && "✓"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          {item.category}
                        </span>
                      </div>
                      <p className={`text-sm ${item.completed ? "line-through text-slate-500" : "font-medium"}`}>
                        {item.topic}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Other Available Slots & Interview Advice */}
          <div className="space-y-6">
            {/* Slot Switcher */}
            <div className="bg-[#102A43]/50 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <span>🗓️</span> All Scheduled Rounds
              </h3>
              <div className="space-y-3">
                {slots.map((slot) => {
                  const isSelected = selectedSlot?.id === slot.id;
                  return (
                    <div
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-3 rounded-xl border cursor-pointer transition ${
                        isSelected
                          ? "bg-blue-600/10 border-blue-500 text-white"
                          : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-[#42D6A4]">{slot.date}</span>
                        <span className="text-slate-400">{slot.time}</span>
                      </div>
                      <div className="text-sm font-semibold truncate">{slot.job_title}</div>
                      <div className="text-xs text-slate-400 mt-1">{slot.notes || "Technical Round"}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Skill-Based Interview Tips */}
            <div className="bg-gradient-to-br from-[#102A43] to-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-[#42D6A4] uppercase tracking-wider mb-3 flex items-center gap-2">
                <span>💡</span> Skill-Based Evaluation Tips
              </h3>
              <ul className="text-xs text-slate-300 space-y-2.5 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>
                    <strong>Explain tradeoffs:</strong> Interviewers on SBJFP care about why you picked a certain library or architecture over alternatives.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>
                    <strong>Highlight practical experience:</strong> Walk through code snippets or PR scenarios rather than memorized theory.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>
                    <strong>Transparent skills:</strong> If a preferred skill is something you are still learning, be honest—employers respect self-awareness!
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
