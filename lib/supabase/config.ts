/**
 * Sanitizes and validates the Supabase URL to prevent build crashes
 * from accidental formatting prefixes, quotes, or trailing slashes.
 */
export function sanitizeSupabaseUrl(rawUrl?: string): string {
  if (!rawUrl || typeof rawUrl !== "string") {
    return "https://placeholder-project.supabase.co";
  }

  let cleaned = rawUrl.trim().replace(/^["']|["']$/g, "");

  // Remove accidental label prefixes like "URL::https://" or "URL: https://"
  cleaned = cleaned.replace(/^URL:*\s*/i, "").trim();

  // If user pasted bare domain like "unpumpwsxyjvfqwtslss.supabase.co"
  if (!cleaned.startsWith("http://") && !cleaned.startsWith("https://")) {
    if (cleaned.includes(".supabase.co") || cleaned.includes("localhost")) {
      cleaned = `https://${cleaned}`;
    } else {
      return "https://placeholder-project.supabase.co";
    }
  }

  try {
    const parsed = new URL(cleaned);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return cleaned;
    }
  } catch {
    // Malformed URL fallback
  }

  return "https://placeholder-project.supabase.co";
}

/**
 * Sanitizes and validates the Supabase Anon Key.
 */
export function sanitizeSupabaseKey(rawKey?: string): string {
  if (!rawKey || typeof rawKey !== "string") {
    return "placeholder-anon-key";
  }

  let cleaned = rawKey.trim().replace(/^["']|["']$/g, "");

  // Remove accidental label prefixes like "Anon Key:" or "Key:"
  cleaned = cleaned.replace(/^(Anon\s*Key|Key):*\s*/i, "").trim();

  return cleaned || "placeholder-anon-key";
}

export function isSupabaseConfigured(): boolean {
  const url = sanitizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key = sanitizeSupabaseKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  return Boolean(
    url &&
    key &&
    !url.includes("placeholder-project") &&
    key !== "placeholder-anon-key"
  );
}
