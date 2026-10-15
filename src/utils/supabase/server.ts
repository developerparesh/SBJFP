import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const FALLBACK_URL = "https://telhpmszmasybazaifdq.supabase.co";
const FALLBACK_KEY = "sb_publishable_-jKWz6qucrtO4L0Jn8OJCA_x0UUOLZs";

export const createClient = (cookieStore: Awaited<ReturnType<typeof cookies>>) => {
  const envUrl = typeof process !== "undefined" ? process.env?.NEXT_PUBLIC_SUPABASE_URL : undefined;
  const envKey =
    typeof process !== "undefined"
      ? process.env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY
      : undefined;

  const url = envUrl && envUrl.trim().length > 0 ? envUrl.trim() : FALLBACK_URL;
  const key = envKey && envKey.trim().length > 0 ? envKey.trim() : FALLBACK_KEY;

  return createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
};
