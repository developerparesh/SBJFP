"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Verifying your authentication...");

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          setStatus(`Authentication failed: ${error.message}`);
          setTimeout(() => router.push("/auth/signin"), 3000);
          return;
        }

        if (session?.user) {
          const queryRole = searchParams.get("role");
          const userRole = (session.user.user_metadata?.role as string) || queryRole || "candidate";

          // If role was passed via query params (e.g. OAuth signup), ensure metadata is saved
          if (queryRole && session.user.user_metadata?.role !== queryRole) {
            await supabase.auth.updateUser({
              data: { role: queryRole },
            });
          }

          setStatus("Success! Redirecting to your dashboard...");
          setTimeout(() => {
            router.push(`/dashboard/${userRole}`);
          }, 800);
        } else {
          setStatus("No active session found. Redirecting to sign in...");
          setTimeout(() => router.push("/auth/signin"), 2000);
        }
      } catch (err: unknown) {
        setStatus("An error occurred during verification. Redirecting...");
        setTimeout(() => router.push("/auth/signin"), 2500);
      }
    };

    handleAuth();
  }, [router, searchParams]);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center max-w-md w-full">
      <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center bg-blue-50 text-[var(--blue)]">
        <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
      <h2 className="text-lg font-bold text-slate-800 mb-1">Completing Sign In</h2>
      <p className="text-sm text-slate-500">{status}</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "var(--bg)" }}>
      <Suspense fallback={<div className="text-slate-500">Loading verification...</div>}>
        <CallbackHandler />
      </Suspense>
    </div>
  );
}
