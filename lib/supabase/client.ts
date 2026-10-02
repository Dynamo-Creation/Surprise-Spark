import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { sanitizeSupabaseUrl, sanitizeSupabaseKey, isSupabaseConfigured } from "./config";

export { isSupabaseConfigured };

let browserClient: SupabaseClient | undefined;

/**
 * Creates or returns the singleton Supabase client for browser components with cookie-based session persistence.
 */
export function createClient() {
  if (typeof window !== "undefined" && browserClient) {
    return browserClient;
  }

  const supabaseUrl = sanitizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseAnonKey = sanitizeSupabaseKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  const client = createBrowserClient(supabaseUrl, supabaseAnonKey);
  if (typeof window !== "undefined") {
    browserClient = client;
  }
  return client;
}
