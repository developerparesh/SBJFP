"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  MOCK_QUESTIONS,
  MockQuestion,
  evaluateMockAnswer,
  FeedbackResult,
} from "@/lib/mockInterviewData";

export default function MockInterviewPracticePage() {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);

  const currentQuestion: MockQuestion = MOCK_QUESTIONS[selectedIdx];

  const handleAnalyze = () => {
    if (!userAnswer.trim()) return;
    setIsEvaluating(true);
    setFeedback(null);

    setTimeout(() => {
      const result = evaluateMockAnswer(currentQuestion, userAnswer);
      setFeedback(result);
      setIsEvaluating(false);
    }, 1200);
  };

  const handleLoadSample = () => {
    setUserAnswer(currentQuestion.idealSummary);
    setFeedback(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b1320] text-slate-100 font-sans selection:bg-[#42D6A4]/30">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <Link href="/interviews" className="hover:text-[#42D6A4] transition-colors">
            Interview Hub
          </Link>
          <span>/</span>
          <span className="text-slate-200">AI Mock Practice</span>
        </div>

        {/* Hero Section */}
        <div className="bg-[#102A43]/80 border border-slate-700/80 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl mb-10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#1479C9]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
              <span>🤖</span> Interactive AI Evaluation
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              AI Technical Mock Interview Simulator
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
              Practice real-world technical architecture questions asked by hiring teams. Get instant feedback on your technical depth, key concept coverage, and trade-off explanations.
            </p>
          </div>

          {/* Role Selector Tabs */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap gap-2">
            {MOCK_QUESTIONS.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => {
                  setSelectedIdx(idx);
                  setUserAnswer("");
                  setFeedback(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  selectedIdx === idx
                    ? "bg-[#1479C9] text-white shadow-md shadow-blue-500/20"
                    : "bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <span>{idx === 0 ? "🤖" : idx === 1 ? "⚡" : "🌱"}</span>
                <span>{q.role}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Practice Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left Column: Question & Answer Area */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              {/* Question Header */}
              <div className="border-b border-slate-800 pb-5">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                    {currentQuestion.category}
                  </span>
                  <span className="text-xs text-slate-500">
                    Question {selectedIdx + 1} of {MOCK_QUESTIONS.length}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white leading-snug">
                  {currentQuestion.question}
                </h2>
                <p className="text-xs text-slate-400 mt-2 bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">💡 Tip:</span>
                  <span>{currentQuestion.hint}</span>
                </p>
              </div>

              {/* Answer Input */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Your Response:
                  </label>
                  <button
                    onClick={handleLoadSample}
                    className="text-xs text-[#42D6A4] hover:underline font-semibold"
                  >
                    Load Model Answer Sample
                  </button>
                </div>

                <textarea
                  rows={8}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your explanation here as you would speak it to an interviewer... e.g. 'Dispatchers.Default is designed for CPU-bound computations...'"
                  className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#1479C9] font-mono leading-relaxed"
                />

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <span className="text-xs text-slate-500">
                    {userAnswer.trim().split(/\s+/).filter(Boolean).length} words
                  </span>

                  <div className="flex items-center gap-2">
                    {userAnswer && (
                      <button
                        onClick={() => {
                          setUserAnswer("");
                          setFeedback(null);
                        }}
                        className="px-3 py-2 text-xs text-slate-400 hover:text-slate-200"
                      >
                        Clear
                      </button>
                    )}
                    <button
                      onClick={handleAnalyze}
                      disabled={!userAnswer.trim() || isEvaluating}
                      className={`px-6 py-2.5 rounded-xl font-bold text-xs text-white shadow-md transition flex items-center gap-2 ${
                        userAnswer.trim() && !isEvaluating
                          ? "bg-gradient-to-r from-[#1479C9] to-blue-600 hover:from-blue-600 hover:to-blue-500 cursor-pointer"
                          : "bg-slate-800 text-slate-500 cursor-not-allowed"
                      }`}
                    >
                      {isEvaluating ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                          <span>Analyzing with AI...</span>
                        </>
                      ) : (
                        <>
                          <span>⚡</span>
                          <span>Analyze with AI Interviewer</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: AI Analysis & Feedback */}
          <div className="lg:col-span-5 space-y-6">
            {feedback ? (
              <div className="bg-[#102A43]/70 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Overall Evaluation Score
                    </span>
                    <div className="text-3xl font-black text-[#42D6A4] mt-0.5">
                      {feedback.score} <span className="text-xs font-normal text-slate-300">/ 100</span>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      feedback.grade === "Exceptional"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : feedback.grade === "Solid"
                        ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    {feedback.grade}
                  </span>
                </div>

                {/* Key Concepts Analysis */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Core Concepts Coverage:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {feedback.conceptsFound.map((c) => (
                      <span
                        key={c}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1"
                      >
                        <span>✓</span> {c}
                      </span>
                    ))}
                    {feedback.conceptsMissing.map((c) => (
                      <span
                        key={c}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1"
                      >
                        <span>✕</span> {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Strengths */}
                {feedback.strengths.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      What You Did Well:
                    </span>
                    <ul className="text-xs text-slate-300 space-y-1">
                      {feedback.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-400">✓</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {feedback.improvements.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      Architectural Improvements:
                    </span>
                    <ul className="text-xs text-slate-300 space-y-1">
                      {feedback.improvements.map((imp, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-400">→</span>
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Model Answer Preview */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#42D6A4] block">
                    Model Response Blueprint:
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed font-mono">
                    {currentQuestion.idealSummary}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center text-slate-400 space-y-3">
                <span className="text-4xl block">🎙️</span>
                <h3 className="text-sm font-bold text-white">AI Feedback Waiting</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Type your answer to the interview question on the left and click &quot;Analyze with AI Interviewer&quot; to inspect your score and missing trade-offs.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
