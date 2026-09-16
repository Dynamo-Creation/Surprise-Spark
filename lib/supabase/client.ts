import { createBrowserClient } from "@supabase/ssr";
import { sanitizeSupabaseUrl, sanitizeSupabaseKey, isSupabaseConfigured } from "./config";

export { isSupabaseConfigured };

/**
 * Creates a Supabase client for browser components with cookie-based session persistence.
 */
export function createClient() {
  const supabaseUrl = sanitizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseAnonKey = sanitizeSupabaseKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
