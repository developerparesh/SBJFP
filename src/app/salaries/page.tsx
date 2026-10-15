"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SALARY_BENCHMARKS } from "@/lib/salaryBenchmarkData";
import { SAMPLE_JOBS } from "@/lib/sampleJobs";

export default function SalariesPage() {
  const [expKey, setExpKey] = useState<"fresher" | "1-3_years" | "3-5_years">("1-3_years");
  const [domainKey, setDomainKey] = useState<"frontend" | "android" | "backend">("android");

  const benchmark =
    SALARY_BENCHMARKS[expKey]?.[domainKey] || SALARY_BENCHMARKS["1-3_years"]["android"];

  const formatINR = (val: number) => {
    return `₹${(val / 100000).toFixed(1)} Lakhs`;
  };

  const matchingJobs = SAMPLE_JOBS.filter((j) => {
    if (domainKey === "android") return j.title.toLowerCase().includes("android");
    if (domainKey === "frontend") return j.title.toLowerCase().includes("software") || j.title.toLowerCase().includes("full-stack");
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#0b1320] text-slate-100 font-sans selection:bg-[#42D6A4]/30">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <Link href="/jobs" className="hover:text-[#42D6A4] transition-colors">
            Jobs Directory
          </Link>
          <span>/</span>
          <span className="text-slate-200">Salary Transparency</span>
        </div>

        {/* Hero Section */}
        <div className="bg-[#102A43]/80 border border-slate-700/80 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl mb-10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#1479C9]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
              <span>💎</span> 100% Upfront Transparent Data
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Engineering Salary Benchmarks &amp; Market Percentiles
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
              Explore real CTC distributions based on verified skill evaluations, Indian tech hubs, and experience bands. No generic averages—grounded in verified technical criteria.
            </p>
          </div>

          {/* Interactive Filters Bar */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap gap-4 items-center justify-between">
            {/* Experience Level Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Experience:
              </span>
              <div className="flex bg-slate-900 border border-slate-700 rounded-xl p-1">
                {[
                  { key: "fresher", label: "🌱 Fresher (0y)" },
                  { key: "1-3_years", label: "1-3 yrs" },
                  { key: "3-5_years", label: "3-5+ yrs" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setExpKey(tab.key as any)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                      expKey === tab.key
                        ? "bg-[#1479C9] text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Domain Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Domain:
              </span>
              <div className="flex bg-slate-900 border border-slate-700 rounded-xl p-1">
                {[
                  { key: "android", label: "🤖 Android / Mobile" },
                  { key: "frontend", label: "⚡ Frontend & Web" },
                  { key: "backend", label: "⚙️ Backend & Systems" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setDomainKey(tab.key as any)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                      domainKey === tab.key
                        ? "bg-[#1479C9] text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4-Percentile Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              25th Percentile (Entry Band)
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-200 mt-1">
              {formatINR(benchmark.p25)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">₹{benchmark.p25.toLocaleString("en-IN")} / yr</p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-900/60 to-indigo-900/60 border border-blue-500/40 shadow-lg">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 flex items-center justify-between">
              <span>50th Percentile (Median)</span>
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            </span>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1">
              {formatINR(benchmark.p50)}
            </div>
            <p className="text-[11px] text-blue-200 mt-1 font-semibold">
              ₹{benchmark.p50.toLocaleString("en-IN")} / yr (Market Standard)
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              75th Percentile (High Match)
            </span>
            <div className="text-2xl sm:text-3xl font-black text-[#42D6A4] mt-1">
              {formatINR(benchmark.p75)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">₹{benchmark.p75.toLocaleString("en-IN")} / yr</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              90th Percentile (Tier 1 CTC)
            </span>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 mt-1">
              {formatINR(benchmark.p90)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">₹{benchmark.p90.toLocaleString("en-IN")} / yr</p>
          </div>
        </div>

        {/* Visual Percentile Range Bar */}
        <div className="bg-[#102A43]/50 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-white">
                {benchmark.role} — Compensation Spread
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Based on {benchmark.sampleSize.toLocaleString()} verified skill profiles in India tech hubs.
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Spread: {formatINR(benchmark.p25)} — {formatINR(benchmark.p90)}
            </span>
          </div>

          {/* Bar Diagram */}
          <div className="space-y-2 pt-2">
            <div className="w-full bg-slate-800 h-6 rounded-xl overflow-hidden flex shadow-inner">
              <div className="w-[25%] bg-slate-700/80 flex items-center justify-center text-[10px] font-bold text-slate-300">
                25th
              </div>
              <div className="w-[35%] bg-[#1479C9] flex items-center justify-center text-[10px] font-bold text-white">
                50th Median
              </div>
              <div className="w-[25%] bg-emerald-600 flex items-center justify-center text-[10px] font-bold text-white">
                75th
              </div>
              <div className="w-[15%] bg-amber-500 flex items-center justify-center text-[10px] font-bold text-slate-950">
                90th
              </div>
            </div>

            <div className="flex justify-between text-xs text-slate-400 font-mono pt-1">
              <span>{formatINR(benchmark.p25)}</span>
              <span className="text-[#1479C9] font-bold">{formatINR(benchmark.p50)}</span>
              <span className="text-[#42D6A4] font-bold">{formatINR(benchmark.p75)}</span>
              <span className="text-amber-400 font-bold">{formatINR(benchmark.p90)}</span>
            </div>
          </div>

          {/* Market Trend Insight */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
            <span className="text-xl">📈</span>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#42D6A4]">
                Market Trend Insight
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {benchmark.marketTrend}
              </p>
            </div>
          </div>
        </div>

        {/* High-Impact Skills Multiplier Cards */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>⚡</span> Skills That Boost CTC For This Role
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {benchmark.topSkills.map((sk) => (
              <div key={sk.skill} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-white">{sk.skill}</span>
                  <span className="block text-[11px] text-slate-400 mt-0.5">High hiring premium</span>
                </div>
                <div className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-xs">
                  +{sk.boostPct}% CTC
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verified Matching Roles Available Now */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>💼</span> Active Roles Matching This Band
            </h2>
            <Link href="/jobs" className="text-xs font-bold text-[#42D6A4] hover:underline">
              View all roles in directory →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matchingJobs.slice(0, 2).map((job) => (
              <div key={job.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wide">
                    {job.company_name}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-0.5">{job.title}</h3>
                  <p className="text-xs font-bold text-emerald-400 mt-1">
                    ₹{job.salary_min?.toLocaleString("en-IN")} - ₹{job.salary_max?.toLocaleString("en-IN")} / yr
                  </p>
                </div>
                <Link
                  href={`/jobs/${job.id}`}
                  className="px-4 py-2 bg-[#1479C9] hover:bg-blue-600 text-white font-bold text-xs rounded-xl whitespace-nowrap transition"
                >
                  View Details →
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
