// Simple in-memory rate limiter for NVIDIA API (38 requests per minute)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(identifier: string, maxRequests = 38, windowMs = 60000) {
  const now = Date.now();
  const record = requestCounts.get(identifier);

  if (!record || now > record.resetTime) {
    // Reset or new record
    requestCounts.set(identifier, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetIn: record.resetTime - now };
  }

  record.count++;
  return { allowed: true, remaining: maxRequests - record.count, resetIn: record.resetTime - now };
}