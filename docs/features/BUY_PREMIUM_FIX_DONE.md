# Buy premium fix — done

**Status**: ✅ Fixed (courseId case normalization in payment checkout and webhook).  
**Detail**: See RELEASE_NOTES.md for the change; for implementation detail and rollback, see the docs below.

---

## What was fixed

- **Problem**: Course schema stores `courseId` in uppercase; checkout and webhook did not normalize input, so lowercase/mixed-case courseIds caused "Course not found".
- **Fix**: Normalize `courseId` with `toUpperCase().trim()` in `app/api/payments/create-checkout/route.ts` and `app/api/payments/webhook/route.ts`.

---

## Reference docs (detail only)

| Doc | Content |
|-----|---------|
| `BUY_PREMIUM_FIX_PLAN.md` | Root cause and fix plan |
| `BUY_PREMIUM_FIX_SUMMARY.md` | Summary and code snippets |
| `BUY_PREMIUM_FIX_STATUS.md` | Status at time of fix (commit/testing) |
| `BUY_PREMIUM_FIX_ROLLBACK_PLAN.md` | Rollback options |

For release version and high-level list of changes, use **RELEASE_NOTES.md**.
