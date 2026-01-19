# Amanoba Task List

**Version**: 2.7.0  
**Last Updated**: 2025-01-20T20:00:00.000Z

---

## Active Tasks

Tasks are listed in priority order. Upon completion, tasks are moved to RELEASE_NOTES.md.

---

## 💳 HIGH PRIORITY: Monetization System (Stripe Integration)

**Status**: 🔴 **BLOCKING REVENUE**  
**Estimated**: 2-3 days  
**Priority**: HIGH

### User Stories
- As a student, I want to purchase premium courses so I can access premium content
- As a student, I want my premium status to activate automatically after successful payment
- As an admin, I want to see payment transactions so I can track revenue
- As a student, I want to see my subscription status in my profile

| ID | Task | Owner | Expected Delivery | Status |
|----|------|-------|-------------------|--------|
| STRIPE1 | Install Stripe SDK: `npm install stripe @stripe/stripe-js` | AI | 2025-01-20 | ✅ DONE |
| STRIPE2 | Add Stripe environment variables: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` | AI | 2025-01-20 | ✅ DONE |
| STRIPE3 | Create PaymentTransaction model (`app/lib/models/payment-transaction.ts`) for transaction logging | AI | 2025-01-20 | ✅ DONE |
| STRIPE4 | Update Player model: Add `stripeCustomerId` and `paymentHistory` fields | AI | 2025-01-20 | ✅ DONE |
| STRIPE5 | Create `/api/payments/create-checkout` endpoint: Generate Stripe Checkout session for course purchase | AI | TBD | ⏳ PENDING |
| STRIPE6 | Create `/api/payments/webhook` endpoint: Handle Stripe webhook events (payment success, failure, refund) | AI | TBD | ⏳ PENDING |
| STRIPE7 | Implement payment success handler: Activate premium status, update Player model, log transaction | AI | TBD | ⏳ PENDING |
| STRIPE8 | Add payment button to course detail page (`app/[locale]/courses/[courseId]/page.tsx`) for premium courses | AI | TBD | ⏳ PENDING |
| STRIPE9 | Create payment confirmation email: Send email after successful payment | AI | TBD | ⏳ PENDING |
| STRIPE10 | Add payment history to player profile page: Display past transactions | AI | TBD | ⏳ PENDING |
| STRIPE11 | Create admin payment dashboard: View all transactions, revenue analytics | AI | TBD | ⏳ PENDING |
| STRIPE12 | Test payment flow: End-to-end testing with Stripe test mode | AI | TBD | ⏳ PENDING |
| STRIPE13 | Add error handling: Payment failures, webhook verification, idempotency | AI | TBD | ⏳ PENDING |

---

## 📋 MEDIUM-HIGH PRIORITY: Onboarding Survey & Segmentation

**Status**: 🟡 **UX IMPROVEMENT**  
**Estimated**: 1-2 days  
**Priority**: MEDIUM-HIGH

### User Stories
- As a new student, I want to complete an onboarding survey so I get personalized course recommendations
- As a student, I want to see course recommendations based on my interests and skill level
- As an admin, I want to see survey responses so I can understand student needs

| ID | Task | Owner | Expected Delivery | Status |
|----|------|-------|-------------------|--------|
| SURVEY1 | Create Survey model (`app/lib/models/survey.ts`): Store survey questions and configuration | AI | TBD | ⏳ PENDING |
| SURVEY2 | Create SurveyResponse model (`app/lib/models/survey-response.ts`): Store student answers | AI | TBD | ⏳ PENDING |
| SURVEY3 | Create seed script for onboarding survey: Define 5-10 default questions | AI | TBD | ⏳ PENDING |
| SURVEY4 | Create `/api/surveys/onboarding` GET endpoint: Fetch survey questions | AI | TBD | ⏳ PENDING |
| SURVEY5 | Create `/api/surveys/onboarding` POST endpoint: Save survey responses | AI | TBD | ⏳ PENDING |
| SURVEY6 | Update Player model: Add `surveyCompleted`, `skillLevel`, `interests` fields | AI | TBD | ⏳ PENDING |
| SURVEY7 | Create onboarding survey page (`app/[locale]/onboarding/page.tsx`): Multi-step form UI | AI | TBD | ⏳ PENDING |
| SURVEY8 | Implement course recommendation logic: Match courses based on survey responses | AI | TBD | ⏳ PENDING |
| SURVEY9 | Add course recommendations to dashboard: Display recommended courses | AI | TBD | ⏳ PENDING |
| SURVEY10 | Create survey analytics in admin dashboard: View response statistics | AI | TBD | ⏳ PENDING |
| SURVEY11 | Add survey completion tracking: Mark player as survey completed | AI | TBD | ⏳ PENDING |
| SURVEY12 | Redirect new users to survey: Show survey modal or redirect after signup | AI | TBD | ⏳ PENDING |

---

## 📧 LOW-MEDIUM PRIORITY: Email Automation Enhancement

**Status**: 🟢 **MARKETING OPTIMIZATION**  
**Estimated**: 2-5 days  
**Priority**: LOW-MEDIUM (depends on marketing strategy)

### User Stories
- As an admin, I want to segment students by skill level so I can send targeted emails
- As a student, I want to receive upsell emails after completing courses
- As an admin, I want to see email analytics so I can improve campaigns

### Phase 1: Resend Enhancement (2-3 days)

| ID | Task | Owner | Expected Delivery | Status |
|----|------|-------|-------------------|--------|
| EMAIL1 | Add `emailSegment` field to Player model: Auto-calculate from course progress (beginner/intermediate/advanced) | AI | TBD | ⏳ PENDING |
| EMAIL2 | Create email template system: Segment-specific templates for lesson emails | AI | TBD | ⏳ PENDING |
| EMAIL3 | Enhance `sendCompletionEmail`: Add upsell logic (recommend related courses) | AI | TBD | ⏳ PENDING |
| EMAIL4 | Add email analytics tracking: Log email opens, clicks to EventLog model | AI | TBD | ⏳ PENDING |
| EMAIL5 | Create course recommendation logic: Find related courses for upsell emails | AI | TBD | ⏳ PENDING |
| EMAIL6 | Create email analytics dashboard in admin UI: View open rates, click rates | AI | TBD | ⏳ PENDING |
| EMAIL7 | Add personalized email content: Use player progress and preferences in emails | AI | TBD | ⏳ PENDING |

### Phase 2: MailerLite/ActiveCampaign Integration (3-5 days) - OPTIONAL

| ID | Task | Owner | Expected Delivery | Status |
|----|------|-------|-------------------|--------|
| EMAIL8 | Evaluate MailerLite vs ActiveCampaign: Choose email marketing platform | AI | TBD | ⏳ PENDING |
| EMAIL9 | Install MailerLite/ActiveCampaign SDK | AI | TBD | ⏳ PENDING |
| EMAIL10 | Create `/api/email/sync-subscriber` endpoint: Sync player data to email platform | AI | TBD | ⏳ PENDING |
| EMAIL11 | Create webhook handler: Handle email platform events (opens, clicks, unsubscribes) | AI | TBD | ⏳ PENDING |
| EMAIL12 | Set up automated workflows: Drip campaigns, nurture sequences in email platform | AI | TBD | ⏳ PENDING |
| EMAIL13 | Create A/B testing setup: Test different email subject lines and content | AI | TBD | ⏳ PENDING |

**Note**: Phase 2 only if advanced marketing automation is needed. Phase 1 (Resend enhancement) should be sufficient for most use cases.

---

## 🚛 Upcoming: Multi-Format Course Forking (30d → 7d / Weekend / 1d / 1h)

| ID | Task | Owner | Expected Delivery | Status |
|----|------|-------|-------------------|--------|
| MF1 | Forking core: parent→child link, auto-sync default, selective detach toggle scaffold | AI | TBD | ⏳ PENDING |
| MF2 | Lesson mapping UI: select/reorder lessons for target schedule (7d/1d/1h linear, weekend Fri-Sat-Sun slots) | AI | TBD | ⏳ PENDING |
| MF3 | Variant quiz strategies: inherit daily quizzes, end mega-quiz, diagnostic random pool (fixed counts per format) | AI | TBD | ⏳ PENDING |
| MF4 | 7-day child creation/publish: pick 7 lessons, daily cadence, inherited quizzes | AI | TBD | ⏳ PENDING |
| MF5 | Weekend child creation/publish: pick 1 Fri + 2 Sat + 1 Sun lessons; calendar-fixed schedule | AI | TBD | ⏳ PENDING |
| MF6 | 1-day child creation/publish: pick 10 lessons, disable per-lesson quizzes, build 50-question final quiz with pass % | AI | TBD | ⏳ PENDING |
| MF7 | 1-hour child creation/publish: pick 2 lessons, 50-question diagnostic random pool, score-band → course slug recommendations | AI | TBD | ⏳ PENDING |
| MF8 | Parent change propagation: sync log + alert to child courses; preview before publish | AI | TBD | ⏳ PENDING |

---

## 🏅 Upcoming: Certificate System v0.1 (Shareable, Course-Aware)

| ID | Task | Owner | Expected Delivery | Status |
|----|------|-------|-------------------|--------|
| CS1 | Certificate model + eligibility hooks in course settings (inherit to children by default) | AI | TBD | ⏳ PENDING |
| CS2 | Certificate rendering pipeline (OG-friendly image) with per-course assets and CDN URL storage | AI | TBD | ⏳ PENDING |
| CS3 | Public share endpoint (unguessable ID) with course/result display + social meta | AI | TBD | ⏳ PENDING |
| CS4 | Profile certificates tab: list, view, download, share | AI | TBD | ⏳ PENDING |
| CS5 | Admin revoke/regenerate flow; reissue when branding/rules change | AI | TBD | ⏳ PENDING |
| CS6 | Achievement tie-in: certificate issuance recorded as achievement entry | AI | TBD | ⏳ PENDING |
| CS7 | Score-band rule mapping for 1-day pass % and 1-hour recommendations to course slugs | AI | TBD | ⏳ PENDING |

---

## 🧾 AI 30 Nap Lesson Content Rewrite (Structured, Rich Copy)

| ID | Task | Owner | Expected Delivery | Status |
|----|------|-------|-------------------|--------|
| LC4 | Rewrite Day 4 content to structured, example-rich format | AI | TBD | ⏳ PENDING |
| LC5 | Rewrite Day 5 content to structured, example-rich format | AI | TBD | ⏳ PENDING |
| LC6 | Rewrite Day 6 content to structured, example-rich format | AI | TBD | ⏳ PENDING |
| LC7 | Rewrite Day 7 content to structured, example-rich format | AI | TBD | ⏳ PENDING |
| LC8 | Rewrite Day 8 content to structured, example-rich format | AI | TBD | ⏳ PENDING |
| LC9 | Rewrite Day 9 content to structured, example-rich format | AI | TBD | ⏳ PENDING |
| LC10 | Rewrite Day 10 content to structured, example-rich format | AI | TBD | ⏳ PENDING |
| LC11 | Rewrite Day 11 content to structured, example-rich format | AI | TBD | ⏳ PENDING |
| LC12 | Rewrite Day 12 content to structured, example-rich format | AI | TBD | ⏳ PENDING |
| LC13 | Rewrite Day 13 content to structured, example-rich format | AI | TBD | ⏳ PENDING |
| LC14 | Rewrite Day 14 content to structured, example-rich format | AI | TBD | ⏳ PENDING |
| LC15 | Rewrite Day 15 content to structured, example-rich format | AI | TBD | ⏳ PENDING |
| LC16 | Rewrite Day 16 content to structured, example-rich format | AI | TBD | ⏳ PENDING |
| LC17 | Rewrite Day 17 content to structured, example-rich format | AI | TBD | ⏳ PENDING |
| LC18 | Rewrite Day 18 content to structured, example-rich format | AI | TBD | ⏳ PENDING |
| LC19 | Rewrite Day 19 content to structured, example-rich format | AI | TBD | ⏳ PENDING |
| LC20 | Rewrite Day 20 content to structured, example-rich format | AI | TBD | ⏳ PENDING |
| LC21 | Rewrite Day 21 content to structured, example-rich format | AI | TBD | ⏳ PENDING |
| LC22 | Rewrite Day 22 content to structured, example-rich format | AI | TBD | ⏳ PENDING |
| LC23 | Rewrite Day 23 content to structured, example-rich format | AI | TBD | ⏳ PENDING |
| LC24 | Rewrite Day 24 content to structured, example-rich format | AI | TBD | ⏳ PENDING |
| LC25 | Rewrite Day 25 content to structured, example-rich format | AI | TBD | ⏳ PENDING |
| LC26 | Rewrite Day 26 content to structured, example-rich format | AI | TBD | ⏳ PENDING |
| LC27 | Rewrite Day 27 content to structured, example-rich format | AI | TBD | ⏳ PENDING |
| LC28 | Rewrite Day 28 content to structured, example-rich format | AI | TBD | ⏳ PENDING |
| LC29 | Rewrite Day 29 content to structured, example-rich format | AI | TBD | ⏳ PENDING |
| LC30 | Rewrite Day 30 content to structured, example-rich format | AI | TBD | ⏳ PENDING |

---

## 🎓 30-Day Learning Platform Transformation

### Phase 1: Foundation & Data Models ✅ COMPLETE

| ID | Task | Owner | Expected Delivery | Status |
|----|------|-------|-------------------|--------|
| 1.1 | Course & Lesson Data Models | AI | 2025-01-14 | ✅ DONE |
| 1.2 | Email Service Integration | AI | 2025-01-14 | ✅ DONE |
| 1.3 | Game Repurposing for Assessments | AI | 2025-01-14 | ✅ DONE |
| 1.4 | Internationalization (i18n) Setup | AI | 2025-01-14 | ✅ DONE |
| 1.5 | Design System Update | AI | 2025-01-17 | ✅ DONE |
| 1.6 | Production Error Fixes (i18n) | AI | 2025-01-17 | ✅ DONE |

---

### Phase 2: Course Builder & Admin Tools ✅ COMPLETE

| ID | Task | Owner | Expected Delivery | Status |
|----|------|-------|-------------------|--------|
| 2.1 | Admin Course Management Pages | AI | Week 3 | ✅ DONE |
| 2.2 | 30-Day Lesson Builder UI | AI | Week 3 | ✅ DONE |
| 2.3 | Rich Text Editor Integration | AI | Week 3 | ✅ DONE |
| 2.4 | Course Preview Functionality | AI | Week 3 | ✅ DONE |
| 2.5 | Publish/Unpublish Workflow | AI | Week 3 | ✅ DONE |
| 2.6 | Student Course Listing & Enrollment | AI | Week 4 | ✅ DONE |
| 2.7 | Student Course Dashboard | AI | Week 4 | ✅ DONE |
| 2.8 | Daily Lesson Viewer | AI | Week 4 | ✅ DONE |
| 2.9 | Assessment Game Integration | AI | Week 4 | ✅ DONE (basic linking) |

---

### Phase 3: Email Automation ✅ COMPLETE

| ID | Task | Owner | Expected Delivery | Status |
|----|------|-------|-------------------|--------|
| 3.1 | Daily Email Scheduler | AI | Week 5 | ✅ DONE |
| 3.2 | Timezone-Aware Email Scheduling | AI | Week 5 | ✅ DONE |
| 3.3 | Email Delivery Tracking | AI | Week 5 | ✅ DONE |
| 3.4 | Catch-Up Email Logic | AI | Week 5 | ✅ DONE |
| 3.5 | Email Preferences UI | AI | Week 6 | ✅ DONE |
| 3.6 | Unsubscribe Functionality | AI | Week 6 | ✅ DONE |
| 3.7 | Email Settings Page | AI | Week 6 | ✅ DONE |
| 3.8 | First Course Seeded (AI 30 Nap) | AI | 2025-01-17 | ✅ DONE |

---

### Phase 4: Assessment Integration ✅ COMPLETE

| ID | Task | Owner | Expected Delivery | Status |
|----|------|-------|-------------------|--------|
| 4.1 | Quiz Assessment System | AI | Week 7 | ✅ DONE |
| 4.2 | Quiz Question Management (Two-step deletion) | AI | Week 7 | ✅ DONE |
| 4.3 | Course Export/Import System | AI | Week 8 | ✅ DONE |
| 4.4 | Course Deletion with Cascading Deletes | AI | Week 8 | ✅ DONE |
| 4.5 | Feature Flags System | AI | Week 8 | ✅ DONE |
| 4.6 | Student Quiz Completion Flow | AI | Week 8 | ✅ DONE |
| 4.7 | Course Creation Guide Course | AI | Week 8 | ✅ DONE |

---

### Phase 1: Foundation (Days 1-7)

| ID | Task | Owner | Expected Delivery | Status |
|----|------|-------|-------------------|--------|
| 1.1 | Initialize repository and base files | AI | 2025-10-10 | ✅ DONE |
| 1.2 | Copy and configure base Next.js structure | AI | 2025-10-10 | ✅ DONE |
| 1.3 | Environment configuration and documentation | AI | 2025-10-10 | ✅ DONE |
| 1.4 | Initialize core documentation structure | AI | 2025-10-10 | ✅ DONE |

---

### Phase 2: Database Layer (Days 8-14)

| ID | Task | Owner | Expected Delivery | Status |
|----|------|-------|-------------------|--------|
| 2.1 | MongoDB connection and logger setup | AI | 2025-10-10 | ✅ DONE |
| 2.2 | Define 21 Mongoose models with validation | AI | 2025-10-12 | ✅ DONE |
| 2.3 | Database seed scripts and initialization | AI | 2025-10-12 | ✅ DONE |

---

### Phase 3: Gamification Core (Days 15-21)

| ID | Task | Owner | Expected Delivery | Status |
|----|------|-------|-------------------|--------|
| 3.1 | Points system core and API | AI | 2025-10-12 | ✅ DONE |
| 3.2 | Achievement system library and UI | AI | 2025-10-12 | ✅ DONE |
| 3.3 | XP and leveling system with titles | AI | 2025-10-12 | ✅ DONE |
| 3.4 | Streak system and rewards | AI | 2025-10-12 | ✅ DONE |
| 3.5 | Progressive disclosure gating | AI | 2025-10-12 | ✅ DONE |

---

### Phase 4: Games Integration (Days 22-28)

| ID | Task | Owner | Expected Delivery | Status |
|----|------|-------|-------------------|--------|
| 4.1 | Port QUIZZZ and WHACKPOP from PlayMass | AI | 2025-10-12 | ✅ DONE |
| 4.2 | Port Madoku engine with premium gating | AI | 2025-10-12 | ✅ DONE |
| 4.3 | Unified game session API | AI | 2025-10-12 | ✅ DONE |
| 4.4 | Game launcher and navigation | AI | 2025-10-12 | ✅ DONE |
| 4.5 | Facebook OAuth authentication system | AI | 2025-10-12 | ✅ DONE |

---

### Phase 5: Advanced Features (Days 29-35)

| ID | Task | Owner | Expected Delivery | Status |
|----|------|-------|-------------------|--------|
| 5.1 | Leaderboards with daily cron | AI | 2025-10-12 | ✅ DONE |
| 5.2 | Daily challenges system | AI | 2025-10-12 | ✅ DONE |
| 5.3 | Quest system | AI | 2025-10-12 | ✅ DONE |

---

### Phase 6: Analytics (Days 36-42)

| ID | Task | Owner | Expected Delivery | Status |
|----|------|-------|-------------------|--------|
| 6.1 | Event logging system and instrumentation | AI | 2025-11-06 | ✅ DONE |
| 6.2 | Aggregation pipeline and cron | AI | 2025-11-08 | ✅ DONE |
| 6.3 | Admin analytics dashboard with 6 charts | AI | 2025-11-10 | ✅ DONE |

---

### Phase 7: Profile & Social (Days 43-49)

| ID | Task | Owner | Expected Delivery | Status |
|----|------|-------|-------------------|--------|
| 7.1 | Player profile pages and components | AI | 2025-11-13 | ✅ DONE |
| 7.2 | Referral system integration from PlayMass | AI | 2025-11-15 | ✅ DONE |

---

### Phase 8: Admin Tools (Days 50-56)

| ID | Task | Owner | Expected Delivery | Status |
|----|------|-------|-------------------|--------|
| 8.1 | Admin dashboard and layout | AI | 2025-11-18 | ✅ DONE |
| 8.2 | Copy admin game management from PlayMass | AI | 2025-11-20 | ✅ DONE |
| 8.3 | Gamification admin tools and premium management | AI | 2025-11-22 | ✅ DONE |

---

### Phase 9: Polish (Days 57-63)

| ID | Task | Owner | Expected Delivery | Status |
|----|------|-------|-------------------|--------|
| 9.1 | Design system and UI primitives | AI | 2025-11-25 | ✅ DONE |
| 9.2 | Animations and transitions | AI | 2025-11-26 | ✅ DONE |
| 9.3 | Responsive design pass | AI | 2025-11-27 | ✅ DONE |
| 9.4 | PWA configuration and push notifications | AI | 2025-11-28 | ✅ DONE |
| 9.5 | Accessibility improvements (WCAG AA) | AI | 2025-11-29 | ✅ DONE |

---

### Phase 10: Launch (Days 64-70)

| ID | Task | Owner | Expected Delivery | Status |
|----|------|-------|-------------------|--------|
| 10.1 | Security hardening and compliance | AI | 2025-12-02 | ✅ DONE |
| 10.2 | Production environment configuration | AI | 2025-12-03 | ✅ DONE |
| 10.3 | Manual QA test plan and execution | AI | 2025-12-04 | 🔄 READY |
| 10.4 | Performance optimization | AI | 2025-12-05 | ✅ DONE |
| 10.5 | Database backup and migration scripts | AI | 2025-12-06 | 📝 DOCUMENTED |
| 10.6 | Final documentation synchronization | AI | 2025-12-07 | ✅ DONE |
| 10.7 | Version control, tagging, and push | AI | 2025-12-08 | 🔄 READY |
| 10.8 | Deploy to Vercel and verify | AI | 2025-12-09 | 📝 DOCUMENTED |
| 10.9 | Post-launch monitoring setup | AI | 2025-12-10 | ✅ DONE |
| 10.10 | Rollback plan documentation | AI | 2025-12-11 | ✅ DONE |

---

## Legend

- ✅ **DONE**: Task completed and verified
- 🔄 **IN PROGRESS**: Currently being worked on
- ⏳ **PENDING**: Not yet started
- 🚫 **BLOCKED**: Waiting on dependency
- ⚠️ **AT RISK**: Behind schedule or facing issues

---

**Maintained By**: Narimato  
**Review Cycle**: Daily during active development
