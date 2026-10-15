"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      setSubmitted(true);
      setLoading(false);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to send reset link.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8" style={{ backgroundColor: "var(--bg)" }}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="SBJFP Logo"
            width={44}
            height={44}
            className="rounded-xl shadow-sm"
            priority
          />
          <span className="font-extrabold text-2xl tracking-tight" style={{ color: "var(--navy)" }}>
            SBJFP
          </span>
        </Link>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight" style={{ color: "var(--navy)" }}>
          Reset your password
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Enter your email address and we will send you a link to reset your password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200/80 rounded-2xl sm:px-10">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5" role="alert">
              <span className="text-base" aria-hidden="true">⚠️</span>
              <p className="flex-1 font-medium">{errorMsg}</p>
            </div>
          )}

          {submitted ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-xl bg-emerald-100 text-emerald-700" aria-hidden="true">
                ✉️
              </div>
              <h2 className="text-lg font-bold text-slate-800 mb-2">Check your email</h2>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                If an account exists for <span className="font-semibold text-slate-700">{email}</span>, you will receive password reset instructions shortly.
              </p>
              <Link
                href="/auth/signin"
                className="inline-block py-2.5 px-6 rounded-xl text-sm font-bold text-white transition"
                style={{ backgroundColor: "var(--blue)" }}
              >
                Return to Sign In
              </Link>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold" style={{ color: "var(--navy)" }}>
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1479C9] focus:border-transparent text-sm transition"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-sm text-sm font-bold text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1479C9] disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "var(--blue)" }}
                >
                  {loading ? "Sending link..." : "Send Reset Link"}
                </button>
              </div>

              <div className="pt-2 text-center">
                <Link href="/auth/signin" className="text-xs font-semibold text-slate-500 hover:text-slate-800">
                  ← Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
