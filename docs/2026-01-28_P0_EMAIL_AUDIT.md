# P0: Code-level email audit and transactional email localization

**Date**: 2026-01-28  
**Scope**: ROADMAP § Global audit — send-time language, unsubscribe footer, gate on language integrity

---

## Email send paths audited

| Email | Locale | Localized template | Unsubscribe footer | Language integrity gate |
|-------|--------|--------------------|--------------------|-------------------------|
| **Lesson** | `emailLocale` (player + course) | Subject/body from lesson + course translations | ✅ `renderLessonUnsubscribeFooterHtml` (all locales) | ✅ `ensureEmailLanguageIntegrity` on final subject/html |
| **Welcome** | `emailLocale` | `renderWelcomeEmailSubject/Html` (getLocaleStrings) | — (one-time enrollment) | ✅ `ensureEmailLanguageIntegrity`; exempt: displayName, courseName |
| **Completion** | `emailLocale` | `renderCompletionEmailSubject/Html` | — (one-time celebration) | ✅ `ensureEmailLanguageIntegrity`; exempt: displayName, courseName |
| **Reminder** | `emailLocale` | `renderReminderEmailSubject/Html` | ✅ **Added** `renderLessonUnsubscribeFooterHtml` (same as lesson) | ✅ `ensureEmailLanguageIntegrity`; exempt: displayName, courseName |
| **Payment** | `emailLocale` (param or player) | `renderPaymentConfirmationEmail` | ✅ `renderPaymentUnsubscribeFooterHtml` (all locales) | ✅ `ensureEmailLanguageIntegrity`; exempt: displayName, courseName, amount, date, transactionId, replyTo |

---

## Changes made

1. **Reminder email** (`sendReminderEmail` in `app/lib/email/email-service.ts`):
   - Appends a **localized unsubscribe footer** (same as lesson emails) so reminder emails include "Unsubscribe from lesson emails" in the recipient’s language.
   - Uses `getOrGenerateUnsubscribeToken` and `renderLessonUnsubscribeFooterHtml({ locale: emailLocale, unsubscribeUrl, courseName, tokens })`.
   - Integrity check runs on the **final** body (including footer).

---

## Transactional email localization

- **Source**: `app/lib/email/email-localization.ts`.
- **Locales**: en, hu, ar, hi, id, pt, vi, tr, bg, pl, ru (same as `app/lib/i18n/locales`).
- **Welcome / Completion / Reminder**: Use `getLocaleStrings(locale)` for subject and body; RTL/dir for ar.
- **Payment**: Uses same locale set; labels and signoff localized.
- **Unsubscribe**: `LESSON_UNSUBSCRIBE_STRINGS` and `PAYMENT_UNSUBSCRIBE_STRINGS` have entries for all supported locales; fallback to `en` when missing.

No missing locales or exempt-string issues found; sending is gated on `ensureEmailLanguageIntegrity` for all paths above.

---

## Summary

- All send paths use **emailLocale** (normalized from player + course or param).
- **Unsubscribe**: Lesson and payment use localized footers; reminder now uses the same lesson footer; welcome/completion remain one-time without unsubscribe (by design).
- **Language integrity**: Every send path runs `ensureEmailLanguageIntegrity` before calling Resend; failures block send and are logged.
