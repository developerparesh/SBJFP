import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://telhpmszmasybazaifdq.supabase.co";

const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_-jKWz6qucrtO4L0Jn8OJCA_x0UUOLZs";

export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseKey
  );
