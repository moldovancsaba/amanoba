# Certificate A/B Test Design

**Status**: Design (P1 #4)  
**Related**: TASKLIST P1 #4 (define), P1 #5 (implement)

This document defines how we A/B test certificate **template variants**: assign one of several template IDs (e.g. `default_v1` vs `minimal`) when issuing a certificate, and optionally by cohort.

---

## Goals

- **Template variants**: Support multiple certificate designs (e.g. templateId A vs B) so we can measure which design performs better (e.g. shares, completion satisfaction).
- **Assignment**: Choose variant either **at issue time** (when the certificate is created) or **by cohort** (assign learner to a variant earlier; same variant used at issue).
- **Tracking**: Know which variant was issued per certificate (already stored as `designTemplateId` on `Certificate`); optional analytics event on view/share (P1 #5).

---

## Current state (post P1 #5)

- **Certificate model** (`app/lib/models/certificate.ts`): Each issued certificate has `designTemplateId` and `credentialId`. These are immutable once issued.
- **Issue flow** (`app/api/certification/final-exam/submit/route.ts`): New certificates use **resolveTemplateVariantAtIssue** (course + global CertificationSettings); variant chosen by stable hash(playerId, courseId). Single template: `course.certification.templateId` or global `templateId`; A/B: `course.certification.templateVariantIds` or global `templateVariantIds`.
- **Rendering**: Certificate image routes use **certificate.designTemplateId** (via `mapDesignTemplateIdToRender`) so each issued cert renders with its assigned variant. Profile route falls back to course template when no issued cert exists (preview).

---

## Template variants

- **Variant = template ID**: Each variant is a string template ID (e.g. `default_v1`, `minimal`, or custom `cert_template_a`, `cert_template_b`). The rendering layer (image route, PDF) must support each ID (e.g. map to layout/theme).
- **Allowed variants per context**: Either:
  - **Course-level**: `course.certification.templateVariantIds?: string[]` (e.g. `['default_v1', 'minimal']`). If unset, fall back to a single default (e.g. `course.certification.templateId ?? 'default_v1'`).
  - **Global fallback**: From `CertificationSettings` (e.g. `templateVariantIds` or single `templateId`). If only one variant is configured, no A/B; that one is used.

---

## Assignment strategies

### 1. Assign at issue (recommended for MVP)

- **When**: At certificate creation time (e.g. in final-exam/submit when we call `Certificate.create`).
- **How**:  
  - Resolve allowed template IDs: `course.certification.templateVariantIds ?? [course.certification.templateId ?? global default]` (if single value, treat as one-element array).  
  - Pick one:  
    - **Random**: `variants[Math.floor(Math.random() * variants.length)]`.  
    - **Stable by learner/course**: `variants[hash(playerId + courseId) % variants.length]` so the same learner always gets the same variant for that course (if they re-issue or we ever re-render).
- **Stored**: Set `designTemplateId` (and if needed `credentialId`) on the new certificate. No extra collection.

### 2. Assign by cohort (optional, for pre-issue experiments)

- **When**: At enrolment or first visit to certification flow (before certificate exists).
- **How**: Store cohort/variant on a small entity keyed by `(playerId, courseId)`, e.g.:
  - **Option A**: `CourseProgress.certificateVariantId?: string` (optional field). When issuing, read variant from progress; if missing, fall back to “assign at issue” (strategy 1).
  - **Option B**: New collection e.g. `CertificateCohort` with `playerId`, `courseId`, `templateVariantId`, `assignedAtISO`. At issue, look up cohort and use its variant; if none, assign at issue and optionally write back.
- **Weights**: If we want 50/50 or 70/30, assignment (at cohort or at issue) can use weighted random (e.g. `templateVariantIds` plus optional `weights?: number[]` in config).

---

## Config shape (for implementation)

- **Course** `certification` (optional, for P1 #5 implementation):
  - `templateId?: string` — single template (current behaviour when no A/B).
  - `templateVariantIds?: string[]` — list of template IDs for A/B (e.g. `['default_v1', 'minimal']`). If present and length > 1, use A/B; otherwise use single template.
  - Optional: `templateVariantWeights?: number[]` (same length as `templateVariantIds`; e.g. `[0.5, 0.5]` for 50/50).
- **Global** `CertificationSettings`: same idea (single `templateId` or future `templateVariantIds` / weights) as fallback when course has nothing.

---

## Rendering (image / PDF)

- **Source of truth**: Use **certificate.designTemplateId** (and certificate.credentialId) when rendering the certificate image or PDF. Do **not** use only `course.certification.templateId` for the slug/image route, so that each issued certificate renders with the variant it was assigned.
- **Mapping**: Rendering layer must map `designTemplateId` to the actual layout (e.g. `default_v1` → default layout, `minimal` → minimal layout). Today’s `TemplateId` in image routes is effectively `'default' | 'minimal'`; we can map stored IDs (e.g. `default_v1` → `default`, `minimal` → `minimal`) in the route.

---

## Analytics (P1 #5)

- **Issued**: Which variant was issued is already recorded on the certificate (`designTemplateId`). No extra field required for “which variant issued.”
- **Optional**: Emit an analytics event when the user views or shares the certificate (e.g. `certificate_viewed` / `certificate_shared` with `templateVariantId: certificate.designTemplateId`), so we can compare engagement by variant.

---

## Summary

| Aspect | Decision |
|--------|----------|
| **Variants** | Template IDs (e.g. `default_v1`, `minimal`); configurable per course (or global) as a list. |
| **Assignment at issue** | Resolve allowed IDs from course (or global); pick by random or stable hash(playerId, courseId); set `certificate.designTemplateId`. |
| **Assignment by cohort** | Optional: store variant on `CourseProgress.certificateVariantId` or `CertificateCohort`; at issue use it if set, else assign at issue. |
| **Tracking** | Certificate already stores `designTemplateId`. Optional: view/share event with variant (P1 #5). |
| **Rendering** | Use `certificate.designTemplateId` (not only course templateId) when generating certificate image/PDF. |

This design is sufficient to implement P1 #5 (A/B assignment and tracking) and keeps the certificate model unchanged; only issue flow and rendering need to use the new config and the stored `designTemplateId`.
