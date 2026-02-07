# SEO Improvement Plan — Amanoba

**Status**: Plan (open) — **Secondary to GEO**  
**Last updated**: 2026-02-06  

**Primary focus**: For **appearance in AI chat results** (ChatGPT, Perplexity, Google AI Overview, etc.), see **`docs/GEO_IMPROVEMENT_PLAN.md`**. This doc covers traditional search engine optimization (Google/Bing SERPs); many GEO actions (sitemap, structured data, crawlability) also help SEO.

**Cross-ref**: `layout_grammar.md` (§6 UI), `ARCHITECTURE.md`, `GEO_IMPROVEMENT_PLAN.md`, course metadata in `app/[locale]/courses/[courseId]/layout.tsx`

---

## 1. Current state (baseline)

| Area | Status | Notes |
|------|--------|--------|
| **Root / locale metadata** | Done | `app/[locale]/layout.tsx`: static title, description, OG, twitter, robots |
| **Course detail metadata** | Done | `generateMetadata` in course layout: OG, twitter, canonical, robots; fallback for missing/error |
| **Certificate metadata** | Done | Dynamic OG/twitter for `/certificate/[slug]` |
| **Sitemap** | Missing | No `sitemap.ts` or `sitemap.xml` — crawlers don’t get a list of URLs |
| **robots.txt** | Default only | Next.js default; no explicit allow/sitemap reference |
| **Structured data (JSON-LD)** | Missing | No Course, Organization, or WebSite schema for rich results |
| **International (hreflang)** | Partial | Locales exist; course layout has `alternates.languages`; root metadata has single locale |
| **Per-page metadata** | Partial | Courses and certificates have dynamic meta; courses list, games, dashboard may use only default |
| **Core Web Vitals / performance** | Unknown | No audit referenced; affects ranking and UX |

---

## 2. Goals

- Improve discoverability of **courses** and **landing** in search (Google, Bing, etc.).
- Keep **social previews** reliable (LinkedIn, Twitter, Facebook) — already improved for course URLs.
- Support **multi-locale** (hu, en, etc.) so the right language version is shown per region.
- Lay groundwork for **rich results** (e.g. course cards in SERPs) and **analytics** of search traffic.

---

## 3. Recommended actions (priority order)

### 3.1 Sitemap (high impact, low effort)

- **What**: Add a **dynamic sitemap** that lists:
  - Static routes: `/`, `/[locale]/courses`, `/[locale]/privacy`, `/[locale]/terms`, etc.
  - All **active** course URLs: `/[locale]/courses/[courseId]` for each locale and each course with `isActive: true`.
- **Where**: Next.js App Router — `app/sitemap.ts` (or `app/[locale]/sitemap.ts` if you prefer locale-prefixed). Use `MetadataRoute.Sitemap` and fetch courses from DB.
- **Why**: Tells search engines which URLs exist and how often they change; improves discovery of new courses.
- **Ref**: [Next.js generate sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap).

### 3.2 robots.txt (high impact, low effort)

- **What**: Add `app/robots.ts` that:
  - Allows crawlers for public paths (`/`, `/[locale]/courses`, `/[locale]/courses/[courseId]`, etc.).
  - Disallows `/admin`, `/api`, `/auth`, `/editor`, `/dashboard`, `/my-courses` (or restrict as needed).
  - References the sitemap URL (e.g. `https://www.amanoba.com/sitemap.xml`).
- **Why**: Directs crawlers to content pages and sitemap; avoids wasting crawl budget on admin/auth.
- **Ref**: [Next.js robots.txt](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots).

### 3.3 Structured data (JSON-LD) (high value for courses)

- **What**: Emit **JSON-LD** in course detail pages:
  - **Course**: name, description, provider (Amanoba), duration (e.g. 30 days), language, thumbnail, URL.
  - Optionally **Organization** (and **WebSite**) in root or locale layout for brand.
- **Where**: Course layout or course page component; inject `<script type="application/ld+json">` with the course object. Use schema.org/Course and, if needed, Organization/WebSite.
- **Why**: Enables rich results (course cards, knowledge panel) and clearer semantics for search engines.
- **Ref**: [Google Course structured data](https://developers.google.com/search/docs/appearance/structured-data/course), [schema.org/Course](https://schema.org/Course).

### 3.4 International SEO (hreflang)

- **What**: Ensure **hreflang** and **canonical** are consistent:
  - In locale layout or metadata: provide `alternates.languages` for all supported locales (hu, en, ar, …) with absolute URLs for the same logical page.
  - Course layout already sets `alternates.canonical` and `alternates.languages` for the course URL — verify it includes all locales you care about for that course (e.g. only locales where the course exists).
- **Why**: Reduces duplicate-content issues and helps show the correct language/region version in SERPs.
- **Ref**: [Next.js alternates](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#alternates), [Google hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions).

### 3.5 Per-route metadata (medium impact)

- **What**: Add or refine `generateMetadata` (or static `metadata`) for:
  - **Courses list** (`/[locale]/courses`): title/description focused on “browse courses”, OG image if you have a generic one.
  - **Games** (`/[locale]/games`, `/[locale]/games/madoku`, etc.): unique titles/descriptions per game.
  - **Public landing** (e.g. `/[locale]` if it’s the main landing): strong headline and description for brand and primary keywords.
- **Why**: Each important URL gets a relevant title/description in SERPs and in shares.
- **Ref**: Existing pattern in `app/[locale]/courses/[courseId]/layout.tsx`.

### 3.6 Performance and Core Web Vitals

- **What**: Run **Lighthouse** (or PageSpeed Insights) on:
  - Landing (`/en`, `/hu`),
  - Courses list (`/en/courses`),
  - One course detail (`/en/courses/<courseId>`).
  - Fix LCP, CLS, INP where possible (images, fonts, layout stability).
- **Why**: Ranking and UX both benefit from good Core Web Vitals; avoids “poor experience” labels in search.
- **Ref**: [Web Vitals](https://web.dev/vitals/), Next.js image/link best practices.

### 3.7 Monitoring and iteration

- **What**:
  - Use **Google Search Console** (and Bing Webmaster Tools): submit sitemap, check coverage, indexation, and search performance.
  - Use **Google Analytics 4** (or existing analytics): segment by landing page and by `/courses` to see which courses and locales get traffic.
  - Optionally track “search” or “organic” as a source to tie back to SEO changes.
- **Why**: Validates that sitemap/robots and metadata are working and guides next steps (e.g. which courses to optimize further).

---

## 4. Optional (later)

- **Blog or “Learn” section**: If you add articles or learning resources, give them dedicated URLs and metadata; can drive long-tail search.
- **FAQ or How-it-works page**: Structured data (FAQPage) can enable rich snippets.
- **Geographic targeting**: If “GEO” meant **geographic** (e.g. country-specific landing pages or content), add:
  - Clear locale/country in metadata and content.
  - Optional geo-specific sitemaps or hreflang by country (e.g. en-GB vs en-US) if you expand to that.

---

## 5. Implementation checklist

| # | Action | Owner | Done |
|---|--------|--------|------|
| 1 | Add `app/sitemap.ts` (static routes + active courses from DB) | — | |
| 2 | Add `app/robots.ts` (allow public, disallow admin/api/auth, sitemap URL) | — | |
| 3 | Add JSON-LD Course (and optionally Organization) on course detail page | — | |
| 4 | Verify hreflang/alternates for course and main locale layout | — | |
| 5 | Add or refine metadata for courses list, games, landing | — | |
| 6 | Run Lighthouse on key URLs and fix critical issues | — | |
| 7 | Register sitemap in GSC and confirm indexation | — | |

---

**Maintained by**: Amanoba team  
**References**: Next.js metadata and sitemap/robots docs, Google Search Central (structured data, international, quality), `layout_grammar.md`.
