/**
 * RATE LIMITER (In-Memory Sliding Window)
 * Protects auth endpoints and API routes from brute-force, scraping, and abusive bursts.
 */

interface RateLimitRecord {
  timestamps: number[];
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

class SlidingWindowRateLimiter {
  private cache: Map<string, RateLimitRecord> = new Map();
  private cleanupIntervalMs = 60_000;
  private lastCleanup = Date.now();

  constructor() {
    // Periodic sweep of stale entries
    if (typeof setInterval !== "undefined") {
      setInterval(() => this.cleanup(), this.cleanupIntervalMs);
    }
  }

  private cleanup() {
    const now = Date.now();
    const maxWindow = 120_000; // 2 minutes
    for (const [key, record] of this.cache.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < maxWindow);
      if (record.timestamps.length === 0) {
        this.cache.delete(key);
      }
    }
    this.lastCleanup = now;
  }

  /**
   * Evaluates if a request from an identifier is allowed under the given limit and window.
   * @param identifier IP or session key
   * @param limit Maximum allowed requests in the window
   * @param windowMs Window duration in milliseconds (default: 60,000ms / 1 min)
   */
  public check(
    identifier: string,
    limit: number = 60,
    windowMs: number = 60_000
  ): RateLimitResult {
    const now = Date.now();
    let record = this.cache.get(identifier);

    if (!record) {
      record = { timestamps: [] };
      this.cache.set(identifier, record);
    }

    // Keep only timestamps within the current sliding window
    record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

    const count = record.timestamps.length;

    if (count >= limit) {
      const oldestTimestamp = record.timestamps[0] || now;
      const resetSeconds = Math.ceil((oldestTimestamp + windowMs - now) / 1000);
      return {
        success: false,
        limit,
        remaining: 0,
        resetSeconds: Math.max(1, resetSeconds),
      };
    }

    // Record this request
    record.timestamps.push(now);

    return {
      success: true,
      limit,
      remaining: Math.max(0, limit - record.timestamps.length),
      resetSeconds: Math.ceil(windowMs / 1000),
    };
  }

  public reset(identifier: string) {
    this.cache.delete(identifier);
  }

  public resetAll() {
    this.cache.clear();
  }
}

export const rateLimiter = new SlidingWindowRateLimiter();
