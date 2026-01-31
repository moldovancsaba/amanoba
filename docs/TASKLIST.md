# Amanoba Task List

**Version**: 2.9.26  
**Last Updated**: 2026-01-28

---

## Active Tasks

Tasks are listed in priority order. Upon completion, tasks are moved to **RELEASE_NOTES.md**.

---

## Active Tasks (open only)

No open P0 tasks. Completed work (Certificate v0.1, Editor User, User profile customization) → **RELEASE_NOTES.md**.

---

## Backlog — Next Priorities (see ROADMAP.md)

- **P0 — Global audit**: Communication + catalog language integrity. **Done 2026-01-28**: Catalog locale resolution (APIs + frontend), email audit (reminder unsubscribe), transactional localization; see `docs/2026-01-28_P0_CATALOG_LANGUAGE_INTEGRITY.md`, `docs/2026-01-28_P0_EMAIL_AUDIT.md`.
- **P2 — Onboarding Survey / Email Automation / Multi-Format Forking**: As per ROADMAP. **P2 tech debt (2026-01-28)**: APP_URL single source, certificate colors in `app/lib/constants/certificate-colors.ts`, auth event method `sso`, ENVIRONMENT_SETUP/VERCEL_DEPLOYMENT Facebook→SSO, CSP already done.
- **P1 — Tech debt**: Design system/CTA cleanup, remove client debug logs, Facebook cleanup. See ROADMAP § Tech Debt. **Delivered 2026-01-28**: design-system/globals alignment, client debug log removed, Facebook wording removed; **Design system CTA (2026-01-28)**: Tailwind wired to design-system CSS variables (`--cta-bg`); admin quests/rewards non-CTA yellow → neutral. See `docs/2026-01-28_CTA_YELLOW_AUDIT.md`, `docs/2026-01-28_P1_TECH_DEBT_DELIVERY.md`.
- **P1 — Tech audit follow-up (Jan 2026)**: npm audit, fix critical lint errors, hardcoded URLs/colors, debug route, Next Image in admin. **TypeScript (P1.7)**: ✅ Complete — TS enforced in build (`ignoreBuildErrors: false`). See `docs/2026-01-28_TYPESCRIPT_AUDIT_COMPLETE.md`. Track: `docs/2026-01-30_TECH_AUDIT_JANUARY.md` and `docs/tasklists/TECH_AUDIT_JANUARY__2026-01-30.md`.

---

## 🎯 Recommended Next 3 Items

1. ~~**Global audit (P0)**~~ — **Done** (2026-01-28). Catalog + email audit + transactional emails. See `docs/2026-01-28_P0_CATALOG_LANGUAGE_INTEGRITY.md`, `docs/2026-01-28_P0_EMAIL_AUDIT.md`.
2. **Onboarding Survey / Email Automation / Multi-Format Forking (P2)** — As per ROADMAP (onboarding done; email automation + multi-format forking planned).
3. ~~**P1 Tech audit follow-up**~~ — **Done** (2026-01-31): Next 16 upgrade, 0 npm vulnerabilities, 0 lint warnings; eslint removed from next.config. See `docs/2026-01-30_TECH_AUDIT_JANUARY.md`.

---

## Legend

- ✅ **DONE**: Task completed and verified  
- 🟡 **IN PROGRESS**: Currently being worked on  
- ⏳ **PENDING / TODO**: Not yet started  
- 🚫 **BLOCKED**: Waiting on dependency  
- ⚠️ **AT RISK**: Behind schedule or facing issues  

---

**Maintained By**: AI Agent  
**Review Cycle**: Updated after each major release  
**Last Major Update**: v2.9.26 (Docs/code sync: operating doc, .state in gitignore, code/docs aligned)
