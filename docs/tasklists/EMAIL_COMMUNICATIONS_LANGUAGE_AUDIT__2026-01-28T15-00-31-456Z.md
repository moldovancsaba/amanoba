# Email Communications Language Integrity Audit

Generated: 2026-01-28T15:00:31.467Z
Scope: **code-level email communications**
Mode: **READ-ONLY** (no DB writes)

## Safety Rollback Plan
- This audit is read-only (no DB writes). Rollback is not applicable.

## Unsubscribe Footer (Daily Lesson Emails)
- ✅ Unsubscribe footer passes language integrity for all supported locales: hu, en, ar, hi, id, pt, vi, tr, bg, pl, ru

## Transactional Email Templates (Code-level)
- ✅ Transactional templates pass language integrity for all supported locales: hu, en, ar, hi, id, pt, vi, tr, bg, pl, ru

## Action Items
- [ ] If any locale fails: fix templates until audit passes

Report: `/Users/moldovancsaba/Projects/amanoba/scripts/reports/email-communications-language-audit__2026-01-28T15-00-31-456Z.json`