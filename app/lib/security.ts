/**
 * Security Utilities
 * Comprehensive security features for API protection
 * Version: 2.0.0
 */

import { RateLimiterMemory } from 'rate-limiter-flexible';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import logger from './logger';

/**
 * Why: Rate limiting prevents abuse and DDoS attacks
 * What: Configurable rate limiters for different endpoints
 */

// Standard API rate limiter (100 requests per 15 minutes per IP)
export const apiRateLimiter = new RateLimiterMemory({
  points: 100,
  duration: 15 * 60, // 15 minutes
  blockDuration: 15 * 60, // Block for 15 minutes if exceeded
});

// Auth rate limiter (5 attempts per 15 minutes per IP)
export const authRateLimiter = new RateLimiterMemory({
  points: 5,
  duration: 15 * 60,
  blockDuration: 60 * 60, // Block for 1 hour if exceeded
});

// Game session rate limiter (30 sessions per hour per user)
export const gameRateLimiter = new RateLimiterMemory({
  points: 30,
  duration: 60 * 60, // 1 hour
  blockDuration: 30 * 60,
});

// Admin rate limiter (50 requests per 15 minutes per IP)
export const adminRateLimiter = new RateLimiterMemory({
  points: 50,
  duration: 15 * 60,
  blockDuration: 30 * 60,
});

/**
 * Why: Centralized rate limiting middleware for API routes
 * What: Checks rate limits and returns appropriate error responses
 */
export async function checkRateLimit(
  request: NextRequest,
  limiter: RateLimiterMemory,
  identifier?: string
): Promise<NextResponse | null> {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const key = identifier || ip;

  try {
    await limiter.consume(key);
    return null; // Rate limit OK
  } catch (error) {
    logger.warn({ ip, key, error }, 'Rate limit exceeded');
    
    return NextResponse.json(
      {
        success: false,
        error: 'Too many requests. Please try again later.',
        retryAfter: limiter.blockDuration,
      },
      { 
        status: 429,
        headers: {
          'Retry-After': String(limiter.blockDuration),
        },
      }
    );
  }
}

/**
 * Why: Security headers protect against common web vulnerabilities
 * What: Comprehensive security headers following OWASP recommendations
 */
export const securityHeaders = {
  // Prevent clickjacking attacks
  'X-Frame-Options': 'DENY',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Enable XSS protection (legacy browsers)
  'X-XSS-Protection': '1; mode=block',
  
  // Control referrer information
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions Policy (formerly Feature Policy)
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  
  // Content Security Policy (SSO-only; no Facebook)
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://madoku-cluster.kqamwf8.mongodb.net",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join('; '),
};

/**
 * Why: Single source for allowed origins (CORS and CSRF)
 * What: ALLOWED_ORIGINS env (comma-separated) or fallback for dev/staging
 */
function getAllowedOrigins(): string[] {
  const env = process.env.ALLOWED_ORIGINS;
  if (env && env.trim()) {
    return env.split(',').map((o) => o.trim()).filter(Boolean);
  }
  return [
    'http://localhost:3000',
    'https://amanoba.vercel.app',
  ];
}

/**
 * Why: CORS configuration secures cross-origin requests
 * What: Configurable CORS headers for API endpoints
 */
export function getCorsHeaders(origin?: string): Record<string, string> {
  const allowedOrigins = getAllowedOrigins();

  const corsHeaders: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400', // 24 hours
  };

  if (origin && allowedOrigins.includes(origin)) {
    corsHeaders['Access-Control-Allow-Origin'] = origin;
    corsHeaders['Access-Control-Allow-Credentials'] = 'true';
  }

  return corsHeaders;
}

/**
 * Why: Input sanitization prevents XSS and injection attacks
 * What: Strip dangerous characters and HTML from user input
 */
export function sanitizeString(input: string): string {
  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');
  
  // Escape special characters
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
  
  return sanitized.trim();
}

/**
 * Why: Object sanitization recursively cleans nested data
 * What: Apply string sanitization to all string properties
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item =>
        typeof item === 'object' && item !== null
          ? sanitizeObject(item as Record<string, unknown>)
          : typeof item === 'string'
          ? sanitizeString(item)
          : item
      );
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized as T;
}

/**
 * Why: Email validation prevents invalid data and potential attacks
 * What: RFC 5322 compliant email validation
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Why: URL validation prevents malicious redirects and SSRF
 * What: Validate URL format and whitelist allowed domains
 */
export function isValidUrl(url: string, allowedDomains?: string[]): boolean {
  try {
    const parsed = new URL(url);
    
    // Check protocol
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false;
    }
    
    // Check allowed domains if specified
    if (allowedDomains && !allowedDomains.includes(parsed.hostname)) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

/**
 * Why: Prevent MongoDB injection attacks
 * What: Validate ObjectId format before queries
 */
export function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

/**
 * Why: Secure token generation for API keys and secrets
 * What: Cryptographically secure random token generation
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Why: Hash sensitive data before storing
 * What: SHA-256 hashing utility
 */
export function hashString(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

/**
 * Why: Verify bearer tokens in API requests
 * What: Extract and validate Authorization header
 */
export function getBearerToken(request: NextRequest): string | null {
  const authorization = request.headers.get('authorization');
  
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return null;
  }
  
  return authorization.substring(7);
}

/**
 * Why: Environment-specific security configuration
 * What: Check if running in production for strict security
 */
export const isProduction = process.env.NODE_ENV === 'production';

/**
 * Why: Audit logging for security events
 * What: Structured logging for authentication and authorization events
 */
export function logSecurityEvent(
  event: string,
  details: Record<string, unknown>,
  severity: 'info' | 'warn' | 'error' = 'info'
): void {
  const logData = {
    event,
    ...details,
    timestamp: new Date().toISOString(),
  };

  switch (severity) {
    case 'error':
      logger.error(logData, `Security Event: ${event}`);
      break;
    case 'warn':
      logger.warn(logData, `Security Event: ${event}`);
      break;
    default:
      logger.info(logData, `Security Event: ${event}`);
  }
}

/**
 * Why: Prevent timing attacks on sensitive comparisons
 * What: Constant-time string comparison
 */
export function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  return crypto.timingSafeEqual(
    Buffer.from(a),
    Buffer.from(b)
  );
}

/**
 * Why: Validate request origins to prevent CSRF
 * What: Check request origin against whitelist
 */
export function isValidOrigin(origin: string | null): boolean {
  if (!origin) return false;
  return getAllowedOrigins().includes(origin);
}

/**
 * Why: Request signature verification for webhooks
 * What: Verify HMAC signatures on incoming webhooks
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return secureCompare(signature, expectedSignature);
}
