# GEO Improvement Plan — Appearance in AI Chat Results

**Status**: Plan (open)  
**Last updated**: 2026-02-06  
**Focus**: Making Amanoba and its courses **discoverable and citable** when users ask AI assistants (ChatGPT, Perplexity, Google AI Overview, Claude, etc.) about learning platforms, 30-day courses, or specific topics.

**Cross-ref**: `layout_grammar.md` (§6 UI), `ARCHITECTURE.md`, course metadata in `app/[locale]/courses/[courseId]/layout.tsx`. For traditional search engines, see `docs/SEO_IMPROVEMENT_PLAN.md` (optional).

---

## 1. What is GEO (Generative Engine Optimization)?

- **GEO** = optimizing so your content is **retrieved, summarized, and cited** by AI chat products when users ask questions (e.g. “What are good 30-day learning courses?”, “Where can I learn generative AI?”).
- AI systems use the open web (and sometimes APIs) for **retrieval** and **attribution**. The better your content is **machine-readable**, **factual**, and **clearly about one thing**, the more likely it is to be surfaced and linked in an AI answer.
- Many AI answers are backed by **search** (Bing, Google); others use **crawled/indexed** pages. So crawlability and clear structure help both.

---

## 2. Current state (baseline)

| Area | Status | Notes |
|------|--------|--------|
| **Course detail metadata** | Done | OG, twitter, canonical; good for humans and some crawlers |
| **Structured data (JSON-LD)** | Missing | No Course/Organization schema — AI systems can’t reliably parse “this is a course with these properties” |
| **Sitemap** | Missing | Crawlers (including those that feed AI) don’t get a single list of course URLs |
| **robots.txt** | Default | No explicit allow/sitemap; ensure public course pages are allowed |
| **Clear “what is this” content** | Partial | Course name/description exist; landing and courses list could state “what is Amanoba” and “what courses” more explicitly for extraction |
| **Stable, citable URLs** | Done | Course URLs are stable and descriptive (`/en/courses/COURSE_ID`) |
| **One topic per URL** | Done | Each course has one canonical URL |

---

## 3. Goals

- Increase the chance that **Amanoba** is mentioned when users ask AI about “30-day courses”, “learning platforms”, “structured learning”, etc.
- Increase the chance that **specific courses** (e.g. generative AI, productivity) appear or are cited when relevant questions are asked.
- Make it easy for AI systems to **cite** you with a correct URL and a short, accurate summary (title + description).
- Stay **crawlable** and **machine-friendly** so current and future AI retrieval systems can discover and use your content.

---

## 4. Recommended actions (priority order)

### 4.1 Structured data — JSON-LD (Course, Organization, WebSite) — high impact

- **What**: Emit **schema.org** JSON-LD on the site so AI (and search) can parse “what this is” without guessing.
  - **Course** (on each course detail page): `name`, `description`, `provider` (Organization), `timeRequired` (e.g. P30D), `inLanguage`, `image`, `url`, `hasCourseInstance` if useful.
  - **Organization** (root or locale layout): Amanoba as `Organization` with `name`, `url`, `logo`, optional `description`.
  - **WebSite** (root or locale layout): `url`, `name`, `potentialAction` (e.g. SearchAction) if you have search; links the Organization.
- **Where**: Course layout or course page: `<script type="application/ld+json">` with the Course object. Locale layout or a shared component: Organization + WebSite.
- **Why**: Structured data is a direct signal for “this page is a course with these attributes”; retrieval and citation both benefit.
- **Ref**: [schema.org/Course](https://schema.org/Course), [schema.org/Organization](https://schema.org/Organization), [schema.org/WebSite](https://schema.org/WebSite).

### 4.2 Sitemap — high impact for discovery

- **What**: **Dynamic sitemap** listing:
  - Key static pages: `/`, `/[locale]/courses`, `/[locale]/privacy`, `/[locale]/terms`.
  - Every **active** course: `/[locale]/courses/[courseId]` for each locale and each course with `isActive: true`.
- **Where**: `app/sitemap.ts` (Next.js `MetadataRoute.Sitemap`), fetching courses from DB.
- **Why**: Many systems that feed AI (and classic search) use sitemaps to discover URLs. Without it, new or less-linked courses may be discovered slowly or not at all.
- **Ref**: [Next.js sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap).

### 4.3 robots.txt — allow crawlers for public content

- **What**: Explicit **robots.txt** (e.g. `app/robots.ts`) that:
  - **Allows** crawling of public routes: `/`, `/[locale]/courses`, `/[locale]/courses/*`, and other public pages.
  - **Disallows** `/admin`, `/api`, `/auth`, `/editor`, `/dashboard`, `/my-courses` (or as appropriate).
  - **Points to** the sitemap URL (e.g. `https://www.amanoba.com/sitemap.xml`).
- **Why**: Ensures crawlers (including those used for AI retrieval) know they are allowed to index course and landing pages and where to find the full URL list.
- **Ref**: [Next.js robots](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots).

### 4.4 Clear, factual “about” and “catalog” content — medium impact

- **What**: Ensure key pages contain **short, factual statements** that an AI can extract and cite:
  - **Landing** (e.g. `/[locale]`): One or two sentences: “Amanoba is a …” and “It offers 30-day structured courses with …”.
  - **Courses list** (`/[locale]/courses`): A sentence like “Amanoba offers the following courses: …” and/or a clear list of course names + one-line descriptions; keep title/description meta aligned.
  - **Course detail**: Already has name + description; ensure description is **plain language** (no jargon-only) and answers “what will I learn?” or “what is this course?”.
- **Where**: Copy in the relevant page components and in `generateMetadata` / static `metadata` (title, description).
- **Why**: AI answers often pull a concise “summary” from the page; clear sentences and a clear catalog improve the chance of an accurate, citable mention.

### 4.5 Machine-readable course catalog (optional but strong for GEO)

- **What**: Expose a **public, machine-friendly** list of courses that AI systems (or aggregators) can consume:
  - Option A: A **dedicated page** (e.g. `/[locale]/courses` or `/[locale]/courses/catalog`) that includes **JSON-LD ItemList** of courses (each item with `name`, `description`, `url`, `provider`).
  - Option B: A **public API or static JSON** (e.g. `/.well-known/courses.json` or `/api/public/courses`) returning minimal course list with name, description, url, language.
- **Where**: New page component and/or API route; ensure no auth required and cacheable.
- **Why**: Some tools may prefer a single “catalog” URL or endpoint to answer “what courses does Amanoba offer?” without scraping every course page.
- **Ref**: [schema.org/ItemList](https://schema.org/ItemList), [schema.org/Course](https://schema.org/Course).

### 4.6 Per-page metadata (title, description) — medium impact

- **What**: Every page that you want to appear in AI (or search) results should have a **unique, descriptive** title and description:
  - **Courses list**: e.g. “Courses | Amanoba — 30-day structured learning” and a one-sentence description of the catalog.
  - **Landing**: Strong, brand + value-proposition title and description.
  - **Course detail**: Already in place; keep descriptions concise and factual (good for both humans and extraction).
- **Why**: Title and description are often used as the “snippet” in citations; clarity and accuracy improve attribution.
- **Ref**: Existing pattern in `app/[locale]/courses/[courseId]/layout.tsx`.

### 4.7 Crawlability and semantics — low effort, baseline

- **What**: Keep **semantic HTML** (headings, sections) and **one primary topic per URL**. Avoid blocking **general-purpose crawlers** on public course and landing pages (do not disallow bots that might be used for AI indexing unless you explicitly do not want to appear in AI answers).
- **Why**: Clean structure and crawlability are the baseline for any system that reads your pages to answer user questions.

### 4.8 Public lesson view pages (`/courses/[courseId]/day/[dayNumber]/view`) — high GEO/SEO value

**Idea**: Expose every lesson as a **public, read-only** page at a stable URL (e.g. `https://www.amanoba.com/en/courses/GENERATIVE_AI_APPS_AGENTS_2026_EN/day/2/view`) with **no links to these pages from elsewhere on amanoba.com**. Only the lesson content, bibliography, “Read more” links, and an **Enroll** CTA (e.g. card on the right). No quiz, no prev/next lesson nav — just “Amanoba logo + Back to Course” and the Enroll card.

**Verdict: Good for GEO and SEO.** It gives agents and search engines many more **indexable, citable** URLs with substantive content (each lesson = one page with unique knowledge, answers, and sources). When an AI or search engine surfaces “Day 2: Building your first agent”, it can link to that exact view URL; the visitor reads the lesson and can enroll. No accidental discovery from the main app because you don’t link to `/view` internally; discovery happens via sitemap, external links, or AI/search.

**Benefits:** GEO (precise citations), SEO (long-tail landing pages), value-first conversion, one topic per URL.

**Caveats:** Duplicate content — mitigate by making `/view` the **canonical** for the public lesson and enrolled `/day/N` noindex (or behind auth). Decide scope: all days for all active courses, or e.g. first N days only. Do **not** link to `/view` from the main app.

**Actionable tasks:** Implementation is broken down in **`docs/TASKLIST.md`** under **P3 — Public lesson view pages (GEO)** (API, route, layout, metadata, canonical/noindex, sitemap, no-internal-links policy).

**Policy — no internal links to /view:** Do not add links to `/[locale]/courses/[courseId]/day/[dayNumber]/view` from course detail, day navigator, dashboard, or anywhere else on amanoba.com. View pages are discoverable only via sitemap, external links, or AI/search. This avoids accidental user navigation to the read-only view from the main app.

---

## 5. What to avoid (GEO)

- **Blocking AI/crawler user-agents** on public course and landing pages if you want to appear in AI chat.
- **Vague or thin content** — e.g. a course page with no real description — gives the model little to cite.
- **Duplicate or contradictory** info across URLs (e.g. same course at multiple URLs without canonical) can dilute or confuse attribution.
- **Relying only on JavaScript** for the main “what is this” content — ensure critical text (title, description, key sentences) is in the initial HTML or in structured data so crawlers see it.

---

## 6. Implementation checklist

| # | Action | Owner | Done |
|---|--------|--------|------|
| 1 | Add JSON-LD Course (and optionally Organization + WebSite) on course detail and locale layout | — | |
| 2 | Add `app/sitemap.ts` (static routes + active courses from DB) | — | |
| 3 | Add `app/robots.ts` (allow public, disallow admin/api/auth, sitemap URL) | — | |
| 4 | Add or tighten “what is Amanoba” and “courses catalog” copy on landing and courses list | — | |
| 5 | Add or refine metadata (title/description) for courses list and landing | — | |
| 6 | (Optional) Add machine-readable catalog: ItemList JSON-LD page or public `/api/public/courses` | — | |
| 7 | Verify public course and landing pages are not blocked for common crawlers | — | |
| 8 | Public lesson view: see **TASKLIST.md** § P3 — Public lesson view pages (GEO) for broken-down tasks (API, route, layout, metadata, canonical, sitemap, policy) | — | |

---

## 7. Monitoring and iteration

- **Search Console** (and Bing): Submit sitemap; confirm course URLs are indexed (indexed pages are candidates for AI retrieval that uses search indices).
- **Manual checks**: Periodically ask ChatGPT, Perplexity, Claude, or Google AI “What 30-day learning platforms exist?” or “What courses does Amanoba offer?” and see if Amanoba or specific courses are mentioned and linked.
- **Referrer or UTM**: If any AI product sends referrers or supports campaign params, track “AI” or “chat” traffic to course and landing pages to measure GEO impact over time.

---

**Maintained by**: Amanoba team  
**References**: schema.org (Course, Organization, WebSite, ItemList), Next.js metadata/sitemap/robots, best practices for AI citation and retrieval (e.g. clear structure, factual content, stable URLs).
