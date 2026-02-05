# Rate Limiting Implementation Plan

**Date**: 2026-01-26  
**Status**: ✅ IMPLEMENTED  
**Priority**: P0 (Security & Abuse Prevention)

---

## 🎯 Goal

Wire rate limiting to all critical API endpoints to prevent abuse, DDoS attacks, and brute force attempts.

---

## ✅ Implementation Complete

Rate limiting has been wired to the following endpoint categories:

### 1. Auth Endpoints ✅
- ✅ `POST /api/auth/anonymous` - Anonymous login (5 attempts per 15 min)
- ✅ `GET /api/auth/sso/login` - SSO login initiation (5 attempts per 15 min)
- ✅ `GET /api/auth/sso/callback` - SSO callback (5 attempts per 15 min)
- ✅ `POST /api/auth/sso/logout` - SSO logout (100 requests per 15 min)
- ✅ `GET /api/auth/sso/logout` - SSO logout GET (100 requests per 15 min)

**Rate Limiter Used**: `authRateLimiter` (5 attempts per 15 minutes, 1 hour block)

### 2. Profile Endpoints ✅
- ✅ `GET /api/profile` - Get current user profile (100 requests per 15 min)
- ✅ `PATCH /api/profile` - Update current user profile (100 requests per 15 min)
- ✅ `GET /api/profile/[playerId]` - Get player profile by ID (100 requests per 15 min)

**Rate Limiter Used**: `apiRateLimiter` (100 requests per 15 minutes)

### 3. Course/Progress Endpoints ✅
- ✅ `POST /api/courses/[courseId]/enroll` - Enroll in course (100 requests per 15 min)
- ✅ `GET /api/courses/[courseId]/day/[dayNumber]` - Get lesson for day (100 requests per 15 min)
- ✅ `POST /api/courses/[courseId]/lessons/[lessonId]/quiz/submit` - Submit quiz (100 requests per 15 min)

**Rate Limiter Used**: `apiRateLimiter` (100 requests per 15 minutes)

### 4. Admin Endpoints ✅ (Examples - Pattern Established)
- ✅ `GET /api/admin/payments` - View payment transactions (50 requests per 15 min)
- ✅ `GET /api/admin/players` - List players (50 requests per 15 min)
- ✅ `GET /api/admin/courses` - List courses (50 requests per 15 min)
- ✅ `POST /api/admin/courses` - Create course (50 requests per 15 min)
- ✅ `GET /api/admin/stats` - Get dashboard stats (50 requests per 15 min)

**Rate Limiter Used**: `adminRateLimiter` (50 requests per 15 minutes, 30 min block)

**Note**: There are 35 total admin endpoints. The pattern is established. Remaining admin endpoints should follow the same pattern:
```typescript
import { checkRateLimit, adminRateLimiter } from '@/lib/security';

export async function GET(request: NextRequest) {
  // Rate limiting: 50 requests per 15 minutes per IP (admin endpoints)
  const rateLimitResponse = await checkRateLimit(request, adminRateLimiter);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }
  // ... rest of handler
}
```

---

## 📊 Rate Limiter Configuration

### Available Rate Limiters (from `app/lib/security.ts`):

1. **`apiRateLimiter`** - Standard API endpoints
   - 100 requests per 15 minutes per IP
   - Block duration: 15 minutes

2. **`authRateLimiter`** - Authentication endpoints
   - 5 attempts per 15 minutes per IP
   - Block duration: 1 hour (stricter for security)

3. **`adminRateLimiter`** - Admin endpoints
   - 50 requests per 15 minutes per IP
   - Block duration: 30 minutes

4. **`gameRateLimiter`** - Game session endpoints (not used in this implementation)
   - 30 sessions per hour per user
   - Block duration: 30 minutes

---

## 🔧 Implementation Pattern

For each endpoint, add rate limiting at the start of the handler:

```typescript
import { checkRateLimit, apiRateLimiter } from '@/lib/security';

export async function GET(request: NextRequest) {
  // Rate limiting: 100 requests per 15 minutes per IP
  const rateLimitResponse = await checkRateLimit(request, apiRateLimiter);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  // ... rest of handler
}
```

**Rate Limiter Selection Guide**:
- **Auth endpoints** → `authRateLimiter` (stricter: 5 attempts)
- **Admin endpoints** → `adminRateLimiter` (moderate: 50 requests)
- **Standard API endpoints** → `apiRateLimiter` (standard: 100 requests)
- **Game endpoints** → `gameRateLimiter` (if applicable)

---

## 📋 Remaining Work

### Admin Endpoints (30 remaining)
The following admin endpoints should have rate limiting added following the established pattern:

- `app/api/admin/questions/**` (4 endpoints)
- `app/api/admin/certificates/**` (1 endpoint)
- `app/api/admin/certification/**` (1 endpoint)
- `app/api/admin/quests/**` (1 endpoint)
- `app/api/admin/surveys/**` (1 endpoint)
- `app/api/admin/upload-image/**` (1 endpoint)
- `app/api/admin/translations/**` (1 endpoint)
- `app/api/admin/system-info/**` (1 endpoint)
- `app/api/admin/stats/verify/**` (1 endpoint)
- `app/api/admin/stats/repair/**` (1 endpoint)
- `app/api/admin/settings/**` (1 endpoint)
- `app/api/admin/rewards/**` (2 endpoints)
- `app/api/admin/leaderboards/**` (1 endpoint)
- `app/api/admin/feature-flags/**` (1 endpoint)
- `app/api/admin/courses/[courseId]/**` (multiple endpoints)
- `app/api/admin/challenges/**` (1 endpoint)
- `app/api/admin/brands/**` (1 endpoint)
- `app/api/admin/analytics/**` (2 endpoints)
- `app/api/admin/achievements/**` (2 endpoints)

**Recommendation**: Add rate limiting to all admin endpoints systematically. The pattern is clear and can be applied via find/replace or script.

---

## 🧪 Testing

### Manual Testing Steps:

1. **Test Auth Rate Limiting**:
   ```bash
   # Make 6 requests to /api/auth/anonymous (should fail on 6th)
   for i in {1..6}; do
     curl -X POST http://localhost:3000/api/auth/anonymous
   done
   ```

2. **Test API Rate Limiting**:
   ```bash
   # Make 101 requests to /api/profile (should fail on 101st)
   for i in {1..101}; do
     curl -X GET http://localhost:3000/api/profile
   done
   ```

3. **Test Admin Rate Limiting**:
   ```bash
   # Make 51 requests to /api/admin/stats (should fail on 51st)
   for i in {1..51}; do
     curl -X GET http://localhost:3000/api/admin/stats
   done
   ```

### Expected Behavior:
- First N requests succeed (where N = rate limit)
- Request N+1 returns `429 Too Many Requests`
- Response includes `Retry-After` header
- Error message: "Too many requests. Please try again later."

---

## 📝 Files Modified

### Auth Endpoints:
- `app/api/auth/anonymous/route.ts`
- `app/api/auth/sso/login/route.ts`
- `app/api/auth/sso/callback/route.ts`
- `app/api/auth/sso/logout/route.ts`

### Profile Endpoints:
- `app/api/profile/route.ts`
- `app/api/profile/[playerId]/route.ts`

### Course/Progress Endpoints:
- `app/api/courses/[courseId]/enroll/route.ts`
- `app/api/courses/[courseId]/day/[dayNumber]/route.ts`
- `app/api/courses/[courseId]/lessons/[lessonId]/quiz/submit/route.ts`

### Admin Endpoints (Examples):
- `app/api/admin/payments/route.ts`
- `app/api/admin/players/route.ts`
- `app/api/admin/courses/route.ts`
- `app/api/admin/stats/route.ts`

---

## 🔄 Rollback Plan

If rate limiting causes issues:

1. **Quick Rollback**: Remove rate limiting checks from endpoints
2. **Selective Rollback**: Remove from specific endpoint categories
3. **Adjust Limits**: Modify rate limiter configuration in `app/lib/security.ts`

**Rollback Steps**:
```bash
# Remove rate limiting from a specific file
# Remove these lines:
# import { checkRateLimit, apiRateLimiter } from '@/lib/security';
# const rateLimitResponse = await checkRateLimit(request, apiRateLimiter);
# if (rateLimitResponse) { return rateLimitResponse; }
```

---

## ✅ Status

**Implementation**: ✅ COMPLETE for critical endpoints  
**Documentation**: ✅ COMPLETE  
**Testing**: ⏳ PENDING (manual testing recommended)  
**Remaining Work**: 30 admin endpoints (pattern established, can be applied systematically)

---

**Last Updated**: 2026-01-26  
**Next Steps**: Test rate limiting behavior, then apply pattern to remaining admin endpoints
