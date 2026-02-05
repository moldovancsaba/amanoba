# Email Communications Language Integrity Audit

Generated: 2026-01-28T19:41:23.828Z
Scope: **code-level email communications**
Mode: **READ-ONLY** (no DB writes)

## Safety Rollback Plan
- This audit is read-only (no DB writes). Rollback is not applicable.

## Unsubscribe Footer (Daily Lesson Emails)
- ✅ Unsubscribe footer passes language integrity for all supported locales: hu, en, ar, hi, id, pt, vi, tr, bg, pl, ru

## Transactional Email Templates (Code-level)
- ❌ Transactional templates fail language integrity for 1 locale(s):
  - [ ] ar
    - welcome.html (ar): Language integrity failed for welcome.html (ar): contains long Latin segments for Arabic.
    - completion.html (ar): Language integrity failed for completion.html (ar): contains long Latin segments for Arabic.
    - reminder.html (ar): Language integrity failed for reminder.html (ar): contains long Latin segments for Arabic.

## Action Items
- [ ] If any locale fails: fix templates until audit passes

Report: `/Users/moldovancsaba/Projects/amanoba/scripts/reports/email-communications-language-audit__2026-01-28T19-41-23-817Z.json`