"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { UserRole } from "@/context/AuthContext";

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get("role") as UserRole) === "employer" ? "employer" : "candidate";

  const [role, setRole] = useState<UserRole>(initialRole);
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const displayName = role === "employer" && companyName.trim() ? `${fullName.trim()} (${companyName.trim()})` : fullName.trim();

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: displayName,
            company_name: role === "employer" ? companyName.trim() : null,
            role,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      // If user is immediately signed in (e.g. email confirm disabled in Supabase)
      if (data.session) {
        router.push(`/dashboard/${role}`);
      } else {
        // Email confirmation is required
        setSuccessMsg(
          `Account created! We have sent a confirmation link to ${email}. Please check your email to activate your account.`
        );
        setLoading(false);
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to create account.");
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setErrorMsg(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?role=${role}`,
        queryParams: {
          role,
        },
      },
    });
    if (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <div className="bg-white py-8 px-6 shadow-sm border border-slate-200/80 rounded-2xl sm:px-10">
      {/* Role Selection Tabs */}
      <div className="mb-6">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
          I want to:
        </label>
        <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-xl" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={role === "candidate"}
            onClick={() => setRole("candidate")}
            className={`py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
              role === "candidate"
                ? "bg-white text-[var(--navy)] shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>👤</span> Find Jobs (Candidate)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={role === "employer"}
            onClick={() => setRole("employer")}
            className={`py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
              role === "employer"
                ? "bg-white text-[var(--navy)] shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>🏢</span> Hire Talent (Employer)
          </button>
        </div>
      </div>

      {/* Success Alert */}
      {successMsg && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
          <div className="flex items-start gap-2.5">
            <span className="text-base" aria-hidden="true">✉️</span>
            <div>
              <p className="font-bold">Check your inbox</p>
              <p className="mt-1 leading-relaxed">{successMsg}</p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-100 text-right">
            <Link href="/auth/signin" className="text-xs font-bold text-emerald-700 hover:underline">
              Go to Sign In →
            </Link>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex flex-col gap-2" role="alert">
          <div className="flex items-start gap-2.5">
            <span className="text-base" aria-hidden="true">⚠️</span>
            <p className="flex-1 font-semibold">{errorMsg}</p>
          </div>
          {errorMsg.toLowerCase().includes("rate limit") && (
            <div className="mt-2 p-3 bg-white/80 rounded-lg border border-red-200 text-xs text-slate-700 space-y-1.5">
              <p className="font-bold text-red-800">Why this happens & how to fix it immediately:</p>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                <li>
                  Supabase&apos;s free built-in email service limits outgoing emails to <strong>3-4 per hour</strong>.
                </li>
                <li>
                  <strong>Recommended Quick Fix:</strong> In your <strong>Supabase Dashboard ➔ Authentication ➔ Providers ➔ Email</strong>, toggle <strong>OFF &quot;Confirm email&quot;</strong> and save. Users will then register and log in instantly without email limits.
                </li>
                <li>
                  <strong>Alternative:</strong> Use the <strong>&quot;Continue with Google&quot;</strong> button below to sign in immediately without email limits.
                </li>
              </ul>
            </div>
          )}
        </div>
      )}

      {!successMsg && (
        <form className="space-y-4" onSubmit={handleSignUp}>
          <div>
            <label htmlFor="fullName" className="block text-sm font-semibold" style={{ color: "var(--navy)" }}>
              {role === "employer" ? "Contact Person Name" : "Full Name"}
            </label>
            <div className="mt-1">
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={role === "employer" ? "Jane Doe (HR Lead)" : "John Developer"}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1479C9] focus:border-transparent text-sm transition"
              />
            </div>
          </div>

          {role === "employer" && (
            <div>
              <label htmlFor="companyName" className="block text-sm font-semibold" style={{ color: "var(--navy)" }}>
                Company Name
              </label>
              <div className="mt-1">
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Acme Tech Innovations"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1479C9] focus:border-transparent text-sm transition"
                />
              </div>
            </div>
          )}

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
                placeholder={role === "employer" ? "hiring@company.com" : "you@example.com"}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1479C9] focus:border-transparent text-sm transition"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold" style={{ color: "var(--navy)" }}>
              Password
            </label>
            <div className="mt-1 relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1479C9] focus:border-transparent text-sm transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 text-sm"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-sm text-sm font-bold text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1479C9] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: role === "candidate" ? "var(--blue)" : "var(--navy)" }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Creating Account...
                </span>
              ) : (
                `Create ${role === "candidate" ? "Candidate" : "Employer"} Account`
              )}
            </button>
          </div>
        </form>
      )}

      {/* Social login divider */}
      {!successMsg && (
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-medium">Or continue with</span>
            </div>
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={handleGoogleSignUp}
              className="w-full flex justify-center items-center gap-2.5 py-2.5 px-4 border border-slate-300 rounded-xl bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Google
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 pt-5 border-t border-slate-100 text-center">
        <Link href="/" className="text-xs font-medium text-slate-400 hover:text-slate-600">
          ← Back to homepage
        </Link>
      </div>
    </div>
  );
}

export default function SignUpPage() {
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
          Create your SBJFP account
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/auth/signin" className="font-semibold hover:underline" style={{ color: "var(--blue)" }}>
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Suspense fallback={<div className="bg-white p-8 rounded-2xl text-center text-slate-400">Loading form...</div>}>
          <SignUpForm />
        </Suspense>
      </div>
    </div>
  );
}
