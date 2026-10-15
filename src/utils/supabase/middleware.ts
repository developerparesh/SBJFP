import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const FALLBACK_URL = "https://telhpmszmasybazaifdq.supabase.co";
const FALLBACK_KEY = "sb_publishable_-jKWz6qucrtO4L0Jn8OJCA_x0UUOLZs";

export const updateSession = async (request: NextRequest) => {
  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const envUrl = typeof process !== "undefined" ? process.env?.NEXT_PUBLIC_SUPABASE_URL : undefined;
  const envKey =
    typeof process !== "undefined"
      ? process.env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY
      : undefined;

  const url = envUrl && envUrl.trim().length > 0 ? envUrl.trim() : FALLBACK_URL;
  const key = envKey && envKey.trim().length > 0 ? envKey.trim() : FALLBACK_KEY;

  const supabase = createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh user session by calling getUser
  await supabase.auth.getUser();

  return supabaseResponse;
};
