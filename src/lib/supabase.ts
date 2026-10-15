import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables. " +
      "Copy .env.example to .env.local and fill in your Supabase project values."
  );
}

/**
 * Browser-safe Supabase client using the anon (public) key.
 * ⚠️ Never use the service_role key in this file or any client-side code.
 * Row Level Security (RLS) policies on each table enforce access control.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
