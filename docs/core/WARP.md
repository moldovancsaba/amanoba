# Amanoba AI Assistant Guide

**Version**: 2.9.49
**Last Updated**: 2026-05-23
**Status**: Current quick reference. For the full operating loop, read `READMEDEV.md`, `docs/HANDOVER.md`, and `docs/core/agent_working_loop_canonical_operating_document.md`.

---

## Current Baseline

- **Repository**: `moldovancsaba/amanoba`
- **Framework**: Next.js 16.2.6 App Router
- **Runtime UI system**: Mantine-only baseline with shared GDS pattern contracts
- **Design/UI/UX SSOT**: `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM`
- **Database**: MongoDB Atlas via Mongoose
- **Auth**: SSO-only registered-user flow through `sso.doneisbetter.com`, with anonymous learner/game access where supported
- **Routing guard**: `proxy.ts` with NextAuth edge auth and next-intl locale routing
- **Email providers**: Resend or Mailgun via `EMAIL_PROVIDER`
- **Course model**: flexible lesson count; a course can have 1 lesson or any number of lessons

## Required Session Start

```sh
git fetch origin && git status -sb
```

Read in this order:

1. `READMEDEV.md`
2. `docs/HANDOVER.md`
3. `docs/core/agent_working_loop_canonical_operating_document.md`
4. `docs/status/PRODUCTION_STATUS.md`
5. `docs/architecture/layout_grammar.md` when touching UI, courses, quizzes, lessons, docs, or architecture

## Hard Rules

- Do not reintroduce Tailwind, Radix, Sonner, Vaul, or local design-system wrappers.
- Do not add page-local hard-coded colors, spacing scales, or mode-specific readability hacks.
- Use Mantine primitives and the shared pattern contracts before creating new UI structure.
- Keep `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM` as the design SSOT.
- Keep `docs/HANDOVER.md` current when behavior, commands, dependencies, architecture, or process changes.
- Run the relevant quality gates before claiming completion.

## Quality Gates

```sh
npm run lint
npm run type-check
npm test
npm run build
npm run ui:check:mantine
npm run ui:check:foundation
npm run ui:check:layout
npm run docs:check
npm audit
```

## Current Architecture Pointers

- `app/[locale]`: localized routes and learner/admin/editor surfaces.
- `app/components/patterns`: canonical local pattern contracts.
- `app/components/providers/MantineRuntimeProvider.tsx`: Mantine runtime root.
- `app/lib/ui/mantine-theme.ts`: Amanoba Mantine theme adapter.
- `proxy.ts`: route protection, locale routing, auth redirects.
- `app/lib/email`: Resend/Mailgun email transport layer.
- `docs/product/PATTERN_CONTRACT_INVENTORY.md`: Amanoba pattern-service inventory.

## Work Tracking

The work-tracking SSOT is GitHub Project 12 in `moldovancsaba/mvp-factory-control`, not local task files. Use assigned issues there for status and ownership.
