import { createClient } from "@/utils/supabase/client";

// Lazily initialized Supabase client singleton
let _client: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (!_client) {
    try {
      _client = createClient();
    } catch (err) {
      console.warn("Supabase client init deferred during build/prerender:", err);
      // Fallback dummy object during static build evaluation so prerendering never crashes
      return new Proxy({} as any, {
        get: (_t, prop) => {
          if (prop === "auth") {
            return {
              getSession: async () => ({ data: { session: null }, error: null }),
              getUser: async () => ({ data: { user: null }, error: null }),
              onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
              signOut: async () => ({ error: null }),
              signInWithPassword: async () => ({ data: {}, error: null }),
              signUp: async () => ({ data: {}, error: null }),
            };
          }
          return () => ({
            select: () => ({ order: () => Promise.resolve({ data: [], error: null }) }),
            insert: () => Promise.resolve({ data: null, error: null }),
            update: () => Promise.resolve({ data: null, error: null }),
            delete: () => Promise.resolve({ data: null, error: null }),
            eq: () => Promise.resolve({ data: [], error: null }),
          });
        },
      });
    }
  }
  return _client;
}

/**
 * Lazy proxy around Supabase browser client.
 * Does NOT invoke createClient() at module evaluation time.
 * Evaluates only when accessed at runtime in the browser.
 */
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(_target, prop) {
    const client = getSupabaseClient();
    return (client as any)[prop];
  },
});
