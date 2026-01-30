# Email Communications Language Integrity Audit

Generated: 2026-01-28T10:36:21.158Z
Scope: **code-level email communications**
Mode: **READ-ONLY** (no DB writes)

## Safety Rollback Plan
- This audit is read-only (no DB writes). Rollback is not applicable.

## Unsubscribe Footer (Daily Lesson Emails)
- ✅ Unsubscribe footer passes language integrity for all supported locales: hu, en, ar, hi, id, pt, vi, tr, bg, pl, ru

## Communication Flow Coverage
These flows are **not** currently audited for language integrity end-to-end (final email HTML as received by the user):
- [ ] Welcome email (English-only template today)
- [ ] Completion email (English-only template today)
- [ ] Reminder email (English-only template today)
- [ ] Payment confirmation email (HU localized; other locales English today)

## Action Items
- [ ] P0: Localize transactional emails for all supported locales (or gate sending by locale)

Report: `/Users/moldovancsaba/Projects/amanoba/scripts/reports/email-communications-language-audit__2026-01-28T10-36-21-154Z.json`