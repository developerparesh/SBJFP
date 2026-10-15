import { createClient } from "@/utils/supabase/client";

/**
 * Singleton browser Supabase client using @supabase/ssr createBrowserClient.
 * Safe for browser execution with Publishable / Anon key.
 */
export const supabase = createClient();
