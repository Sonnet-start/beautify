import type { NextRequest } from "next/server";

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>();

export function createRateLimit(config: RateLimitConfig) {
  const { windowMs, maxRequests } = config;

  return function rateLimit(request: NextRequest): {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
  } {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const key = `rate_limit:${ip}`;
    const now = Date.now();

    const entry = rateLimitStore.get(key);

    if (!entry || now > entry.resetTime) {
      // Reset or create new entry
      const newEntry: RateLimitEntry = {
        count: 1,
        resetTime: now + windowMs,
      };
      rateLimitStore.set(key, newEntry);

      return {
        success: true,
        limit: maxRequests,
        remaining: maxRequests - 1,
        reset: newEntry.resetTime,
      };
    }

    if (entry.count >= maxRequests) {
      return {
        success: false,
        limit: maxRequests,
        remaining: 0,
        reset: entry.resetTime,
      };
    }

    entry.count++;
    rateLimitStore.set(key, entry);

    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - entry.count,
      reset: entry.resetTime,
    };
  };
}

// Cleanup old entries every 5 minutes
setInterval(
  () => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (now > entry.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  },
  5 * 60 * 1000
);
