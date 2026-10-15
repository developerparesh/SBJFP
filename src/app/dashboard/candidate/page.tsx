"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function CandidateDashboardPage() {
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();

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

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col">
      {/* Top Navigation */}
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
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-800">{profile?.fullName}</p>
              <p className="text-[11px] text-slate-400">{profile?.email}</p>
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
        {/* Welcome Banner */}
        <div className="rounded-2xl p-6 sm:p-8 text-white mb-8" style={{ backgroundColor: "var(--navy)" }}>
          <span className="text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-white/10 text-[var(--mint)] mb-3 inline-block">
            Phase 2: Authentication Active
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">
            Welcome back, {profile?.fullName}!
          </h1>
          <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
            Your candidate profile is authenticated via Supabase. Next, you will be able to select your structured skills and discover high-match opportunities.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Card 1: Skill Profile */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl mb-4">
                🎯
              </div>
              <h2 className="text-base font-bold text-slate-900 mb-1">Your Skills Profile</h2>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Add your technical languages, tools, and experience levels to activate automated matching.
              </p>
            </div>
            <button
              disabled
              className="w-full py-2 px-3 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold cursor-not-allowed"
            >
              Profile Builder (Coming in Phase 4)
            </button>
          </div>

          {/* Card 2: Matched Jobs */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl mb-4">
                📊
              </div>
              <h2 className="text-base font-bold text-slate-900 mb-1">Matched Opportunities</h2>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Jobs that align with your structured skills will appear here with explainable match percentages.
              </p>
            </div>
            <button
              disabled
              className="w-full py-2 px-3 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold cursor-not-allowed"
            >
              Job Matches (Coming Soon)
            </button>
          </div>

          {/* Card 3: Applications */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl mb-4">
                📬
              </div>
              <h2 className="text-base font-bold text-slate-900 mb-1">Application Tracker</h2>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Track status updates and view real-time recorded employer interactions transparently.
              </p>
            </div>
            <button
              disabled
              className="w-full py-2 px-3 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold cursor-not-allowed"
            >
              Tracking View (Coming Soon)
            </button>
          </div>
        </div>

        {/* Account Details Box */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
            Authenticated Profile Details
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block mb-1">Full Name</span>
              <span className="font-semibold text-slate-800">{profile?.fullName}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block mb-1">Email</span>
              <span className="font-semibold text-slate-800 truncate block">{profile?.email}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block mb-1">User Role</span>
              <span className="font-semibold text-emerald-700 capitalize">{profile?.role}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block mb-1">Supabase User ID</span>
              <span className="font-mono text-[10px] text-slate-600 truncate block">{user.id}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
