/**
 * Generates URL-safe, non-sequential, unique public IDs for surprises.
 * Example formats: "ABC123XYZ" or "sp-x7m9k2a4"
 * Ensures internal database UUIDs are never leaked to public links.
 */

const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz";

export function generatePublicId(length = 8, prefix = ""): string {
  let result = "";
  const alphabetLength = ALPHABET.length;

  // Use crypto.getRandomValues if available (browser/Node 19+), else Math.random fallback
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const randomBytes = new Uint8Array(length);
    crypto.getRandomValues(randomBytes);
    for (let i = 0; i < length; i++) {
      result += ALPHABET[randomBytes[i] % alphabetLength];
    }
  } else {
    for (let i = 0; i < length; i++) {
      result += ALPHABET[Math.floor(Math.random() * alphabetLength)];
    }
  }

  return prefix ? `${prefix}${result}` : result;
}

export function isValidPublicId(publicId: string): boolean {
  if (!publicId || typeof publicId !== "string") return false;
  // Allows alphanumeric strings and dashes, length between 4 and 32 characters
  return /^[a-zA-Z0-9_-]{4,32}$/.test(publicId);
}
