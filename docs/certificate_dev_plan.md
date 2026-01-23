# certificate_dev_plan.md
Last updated: 2026-01-21

## 0) Objective

Implement a **simple, unified, configurable certificate system** for Amanoba courses, where an admin can choose:

- **Title / Credential** (e.g., `AAE — Amanoba‑Accredited Expert`)
- **Design Template** (visual template selector)
- **Completion phrase** + optional bullet statements
- Generate **PDF** + **LinkedIn-ready image** + **verification URL**

The learner can view, download, and share the certificate reliably.

---

## Status snapshot (2026-01-21)
- ✅ Data model (`Certificate`) saved in MongoDB.
- ✅ Admin issuance API (`POST /api/certificates/issue`) with completion check.
- ✅ Public verification API + page (`/certificate/[slug]`).
- ✅ Image render endpoint + auto-upload to imgbb (PNG, 1200×627).
- ✅ Admin UI page: issue + list certificates (`/admin/certificates`).
- 🔄 Referral link attached to certificate view/share (uses player referral code).
- ⏳ PDF export (decide if needed; currently image-only).
- ⏳ Admin analytics (issuance counts, course breakdown).
- ⏳ Auto certificate issuance after course completion (cron/hook).
- ⏳ Design templates system (currently single default_v1).

---

## 1) Core Requirements

### 1.1 Admin must be able to select
- `designTemplateId`
- `credentialId` (title variant)
- `completionPhraseId`
- `deliverableBulletIds[]` (0–4 items)
- `locale` (at least `en`, `hu`)
- issue metadata (date, course, learner)

### 1.2 Outputs must include
- **PDF** (print-friendly)
- **Image** for sharing (LinkedIn-friendly)
- **Public verification page** (unique URL with certificate details)

Notes:
- LinkedIn commonly uses a **1.91:1 image ratio** for link previews (e.g., **1200×627 px**). citeturn0search0turn0search4
- Coursera shares certificates via a **secure certificate URL**. citeturn0search1
- LinkedIn Learning supports **shareable certificate links** that open a details page. citeturn0search17

---

## 2) Data Model

### 2.1 Certificate record (database)
Store the **issued** certificate (immutable snapshot of the selected options at issuance time).

```ts
type Certificate = {
  id: string;                        // UUID
  certificateNumber: string;         // short human-readable code (optional)
  playerId: string;                  // internal learner id
  recipientName: string;             // display name at issuance time
  courseId: string;
  courseTitle: string;               // snapshot at issuance time
  locale: "en" | "hu";

  designTemplateId: string;          // e.g., "greenBlueAccent_v1"
  credentialId: string;              // e.g., "AAE"
  completionPhraseId: string;        // e.g., "completed_final_assessment"
  deliverableBulletIds: string[];    // 0–4 ids

  issuedAtISO: string;               // ISO-8601 timestamp
  awardedPhraseId: string;           // usually fixed

  verificationSlug: string;          // random, unguessable slug
  pdfAssetPath?: string;             // storage location
  imageAssetPath?: string;           // storage location
};
```

### 2.2 Configuration dictionaries (code or database)
These define selectable options and can be updated without code changes.

- `certificate_credentials.json`
- `certificate_phrases.json`
- `certificate_templates.json`
- `certificate_bullets.json`

Keep them versioned.

---

## 3) Copy System

### 3.1 Completion phrases (single select)
Example IDs and EN copy:

- `completed_final_assessment` → “Successfully completed the final assessment”
- `passed_all_requirements` → “Passed all course requirements”
- `fulfilled_program_requirements` → “Successfully fulfilled all program requirements”
- `completed_verified_results` → “Completed the program with verified results”
- `earned_through_assessment` → “Earned certification through assessment”

### 3.2 Awarded phrase (fixed by default)
Use one canonical line (EN):
- `awarded_verified_mastery` → “Awarded in recognition of verified mastery and successful completion of the Amanoba learning program.”

### 3.3 Credential titles (single select)
Store each credential with:
- `credentialId` (e.g., `AAE`)
- `displayName` (e.g., “Amanoba‑Accredited Expert”)
- optional `shortName`

Example list (EN):
- Amanoba Certified Professional
- Amanoba‑Accredited Expert
- Amanoba Verified Specialist
- Official Amanoba Professional
- Certified Craft Professional
- Master‑Level Creator
- Advanced Practitioner
- Professional Credential
- Verified Expertise
- Recognized Certification

### 3.4 Bullet statements (0–4)
Admin can add 0–4 bullets under the completion phrase.

---

## 4) Template System

### 4.1 Template definition
A `designTemplateId` selects:
- layout grid
- background
- fonts (brand-approved)
- accent palette
- logo placement (logo must remain unmodified)
- safe zones for text

### 4.2 Template assets
Each template should include:
- `preview.png` (admin picker)
- `layout.json` (regions and typographic scale)
- `background.png` or CSS background definition
- token set (colors, spacing, fonts)

### 4.3 Required template variants
- At least 2 templates at launch (e.g., `modernMinimal_v1`, `greenBlueAccent_v1`)
- Ability to add more without migrations (config-driven)

---

## 5) Rendering

### 5.1 Rendering approach (recommended)
**HTML → PDF + Image** (server-side) using a deterministic renderer:
- render HTML with the selected template + text
- export PDF
- export image at LinkedIn-friendly size (see 5.2)

Alternative: PDF form template filling (acceptable if you already have a pipeline).

### 5.2 Image sizes
Generate at least:
- `share_1200x627.png` (1.91:1, LinkedIn-friendly) citeturn0search0turn0search4

Optional:
- `share_1600x840.png` for higher fidelity (same ratio)

### 5.3 Storage
Store generated assets in your preferred object storage (or Vercel blob equivalents), referenced by `pdfAssetPath` and `imageAssetPath`.

---

## 6) Verification

### 6.1 Verification URL
Create a public, unguessable verification page:
- `/certificate/{verificationSlug}`

Page must show:
- recipient name
- course title
- credential title
- issue date
- certificate id/number
- optional issuer/brand elements
- “Verify” status

This mirrors the “share certificate via secure URL” pattern used by major learning platforms. citeturn0search1turn0search17

---

## 7) API Contracts

### 7.1 Issue certificate (server-side)
`POST /api/certificates/issue`

Body:
```json
{
  "playerId": "…",
  "courseId": "…",
  "locale": "en",
  "designTemplateId": "greenBlueAccent_v1",
  "credentialId": "AAE",
  "completionPhraseId": "completed_final_assessment",
  "deliverableBulletIds": ["passed_all_requirements", "earned_through_assessment"]
}
```

Response:
```json
{
  "certificateId": "uuid",
  "verificationUrl": "/certificate/slug",
  "pdfUrl": "/api/certificates/uuid/render?format=pdf",
  "imageUrl": "/api/certificates/uuid/render?format=png&variant=share_1200x627"
}
```

### 7.2 Render certificate
`GET /api/certificates/{certificateId}/render?format=pdf|png&variant=share_1200x627`

---

## 8) Admin UX

### 8.1 Certificate builder screen
- Recipient (prefilled from player)
- Course (prefilled)
- Locale selector
- Credential dropdown (with preview text)
- Completion phrase dropdown
- Bullet multi-select (max 4)
- Template picker (visual tiles)
- Live preview
- “Issue certificate” button

### 8.2 Guardrails
- enforce max lengths
- enforce bullet limit
- enforce required fields
- block issuance if course completion rules are not met

---

## 9) Learner UX

- Show certificate tile on course completion screen
- Actions:
  - View verification page
  - Download PDF
  - Download/share image

Optional: “Add to LinkedIn” guidance (copy snippet + link to verification page).

---

## 10) Testing Checklist

- New user, no completion: issuance not allowed
- Completed course: issuance succeeds
- Different locales render correctly
- Template picker works and preview matches output
- PDF renders with correct wrapping (no clipping)
- Image renders at 1200×627 with safe margins (no cropping)
- Verification URL resolves and displays correct data
- Security: authenticated routes enforce ownership; verification page shows only intended public fields

---

## 11) Definition of Done

- Admin can issue certificates with configurable title + template
- PDF + share image generated and stored
- Verification page works for any issued certificate
- i18n works for EN and HU for all phrases used
- Tests pass and visual verification completed on at least 2 templates

## 12) Referral hook (growth)

- Verification page must show the related course and link to it with the referrer’s referral code (`?ref=CODE`).
- The referral code should be generated from the issuing player (same logic as `/api/referrals`).
- When a visitor clicks “Enroll” from the certificate page and signs up/enrolls, the referral flow should award points as per the referral program.

## Status (2026-01-20)
- ✅ Model created (`Certificate`)
- ✅ Public verification API `/api/certificates/[slug]` returns certificate + course + referral code
- ✅ Public verification page `/[locale]/certificate/[slug]` with enroll CTA (referral-aware)
- ✅ Shared referral code helper (`app/lib/referral-code.ts`) reused by certificate and referral APIs
- ✅ EN/HU i18n strings for certificate UI
- ✅ Admin-only issuance endpoint `/api/certificates/issue` creates certificate snapshots (assets pending)
- ✅ PNG rendering endpoint `/api/certificates/{id}/render?format=png&variant=share_1200x627` (edge ImageResponse)
- ✅ Imgbb upload on issuance: render → upload image → store imageAssetPath
- ⏳ PDF rendering (not required if we stay image-only)
- ⏳ Admin certificate builder UI
- ⏳ Course-completion gated issuance UX (UI)
