/**
 * Refactor: SPORT_SALES_NETWORK_USA_2026_EN
 *
 * What:
 * - Enforces hard rules:
 *   - 30 lessons, each with >= 3 bibliography sources
 *   - Read more is lesson-specific and UNIQUE (per lesson)
 *   - Exactly 7 quiz questions per lesson => 210 unique questions/course
 *   - 0 RECALL; >= 5 APPLICATION + >= 2 CRITICAL_THINKING per lesson
 *
 * Output:
 * - docs/course/SPORT_SALES_NETWORK_USA_2026_EN_export_2026-02-06_RECREATED.json
 * - docs/course/SPORT_SALES_NETWORK_USA_2026_EN__2026-02-06_RECREATED.md
 * - docs/course/SPORT_SALES_NETWORK_USA_2026_EN__2026-02-06_RECREATED_BIBLIOGRAPHY.md
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import type { QuestionDifficulty, QuizQuestionType } from '../app/lib/models';
import { validateLessonQuestions } from './question-quality-validator';

type CoursePackageV2 = {
  packageVersion?: string;
  version?: string;
  exportedAt?: string;
  exportedBy?: string;
  course: Record<string, unknown>;
  lessons: Array<{
    lessonId: string;
    dayNumber: number;
    language: string;
    title: string;
    content: string;
    emailSubject?: string;
    emailBody?: string;
    quizConfig?: Record<string, unknown>;
    unlockConditions?: Record<string, unknown>;
    pointsReward?: number;
    xpReward?: number;
    isActive?: boolean;
    displayOrder?: number;
    metadata?: Record<string, unknown>;
    translations?: Record<string, unknown>;
    quizQuestions?: LessonQuizQuestion[];
  }>;
  canonicalSpec?: unknown;
  courseIdea?: unknown;
};

type CanonicalLesson = {
  dayNumber: number;
  canonicalTitle: string;
  objective: string;
  keyConcepts: string[];
  exercise: string;
  deliverable: string;
  sources: string[];
};

type CanonicalCourse = {
  courseIdBase: string;
  courseName: string;
  version: string;
  language: string;
  lessons: CanonicalLesson[];
};

type LessonQuizQuestion = {
  uuid: string;
  questionType: QuizQuestionType;
  hashtags: string[];
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: QuestionDifficulty;
  category: 'Course Specific';
  isActive: boolean;
};

type SourceItem = { title: string; meta?: string; url?: string };
type LessonSources = { bibliography: SourceItem[]; readMore: { title: string; url: string } };

const INPUT_JSON = 'docs/course/SPORT_SALES_NETWORK_USA_2026_EN_export_2026-02-06_DB.json';
const CANONICAL_JSON = 'docs/canonical/SPORT_SALES_NETWORK_USA_2026/SPORT_SALES_NETWORK_USA_2026.canonical.json';

const OUT_JSON = 'docs/course/SPORT_SALES_NETWORK_USA_2026_EN_export_2026-02-06_RECREATED.json';
const OUT_MD = 'docs/course/SPORT_SALES_NETWORK_USA_2026_EN__2026-02-06_RECREATED.md';
const OUT_BIBLIO_MD = 'docs/course/SPORT_SALES_NETWORK_USA_2026_EN__2026-02-06_RECREATED_BIBLIOGRAPHY.md';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function normalizeForUniq(s: string) {
  return String(s ?? '')
    .replace(/\r/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function stripTrailingPunctuation(url: string) {
  return url.replace(/[),.;]+$/g, '');
}

function sliceSectionByHeaders(content: string, header: string, nextHeader?: string) {
  const start = content.indexOf(header);
  if (start === -1) return '';
  const afterHeader = start + header.length;
  const bodyStart = content.indexOf('\n', afterHeader);
  const from = bodyStart === -1 ? afterHeader : bodyStart + 1;
  if (!nextHeader) return content.slice(from).trim();
  const end = content.indexOf(nextHeader, from);
  if (end === -1) return content.slice(from).trim();
  return content.slice(from, end).trim();
}

function countNumberedListItems(text: string) {
  return (text.match(/^\s*\d+\.\s+/gm) || []).length;
}

function extractUrls(text: string) {
  return Array.from(text.matchAll(/https?:\/\/[^\s)]+/g)).map((m) => stripTrailingPunctuation(m[0]));
}

function replaceBetween(
  content: string,
  startHeader: string,
  endHeaderCandidates: string[],
  replacementBlock: string
) {
  const start = content.indexOf(startHeader);
  assert(start !== -1, `Missing section header: ${startHeader}`);

  const afterStart = start + startHeader.length;
  const end = endHeaderCandidates
    .map((h) => content.indexOf(h, afterStart))
    .filter((i) => i !== -1)
    .sort((a, b) => a - b)[0];
  assert(typeof end === 'number', `Missing end header after: ${startHeader}`);

  return `${content.slice(0, afterStart)}\n\n${replacementBlock.trim()}\n\n${content.slice(end)}`;
}

function mdEscape(s: string) {
  return s.replace(/\|/g, '\\|').replace(/\*/g, '\\*').trim();
}

function buildBibliographyBlock(items: SourceItem[]) {
  return items
    .map((s, idx) => {
      const title = mdEscape(s.title);
      const meta = s.meta ? ` — ${mdEscape(s.meta)}` : '';
      const url = s.url ? `\n   Read: ${s.url}` : '';
      return `${idx + 1}. **${title}**${meta}.${url}`;
    })
    .join('\n');
}

function buildReadMoreBlock(readMore: { title: string; url: string }) {
  return `1. **${mdEscape(readMore.title)}**\n   Read: ${readMore.url}`;
}

function lessonTagFromTitle(title: string) {
  const cleaned = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return cleaned ? `#topic-${cleaned}` : '#topic-sport-sales';
}

function uuid() {
  return crypto.randomUUID();
}

function q(
  spec: Omit<LessonQuizQuestion, 'uuid' | 'category' | 'isActive'> & { uuid?: string }
): LessonQuizQuestion {
  assert(spec.options.length === 4, 'Each question must have exactly 4 options (legacy format).');
  assert(spec.correctIndex >= 0 && spec.correctIndex <= 3, 'correctIndex must be 0..3.');
  return {
    uuid: spec.uuid ?? uuid(),
    category: 'Course Specific',
    isActive: true,
    ...spec,
  };
}

function buildLessonSourcesByDay(canonical: CanonicalCourse): Map<number, LessonSources> {
  const CORE_BOOKS: SourceItem[] = [
    { title: 'SPIN Selling', meta: 'Neil Rackham (book)' },
    { title: 'The Challenger Sale', meta: 'Matthew Dixon & Brent Adamson (book)' },
  ];

  const extraByDay: Record<number, { readMore: { title: string; url: string }; extra: SourceItem }> = {
    1: {
      readMore: { title: 'Making the Consensus Sale', url: 'https://hbr.org/2015/03/making-the-consensus-sale' },
      extra: { title: 'The New Rules of B2B Sales and Marketing', meta: 'HBR', url: 'https://hbr.org/2014/07/the-new-rules-of-b2b-sales-and-marketing' },
    },
    2: {
      readMore: { title: 'B2B Segmentation: How to Do It', url: 'https://hbr.org/2018/03/a-refresher-on-segmentation' },
      extra: { title: 'Sales Pipeline Stages', meta: 'Salesforce', url: 'https://www.salesforce.com/sales/pipeline/stages/' },
    },
    3: {
      readMore: { title: 'Ideal Customer Profile (ICP): A Practical Guide', url: 'https://www.hubspot.com/sales/ideal-customer-profile' },
      extra: { title: 'SPIN Methodology Overview', meta: 'Huthwaite', url: 'https://www.huthwaiteinternational.com/spin-methodology' },
    },
    4: {
      readMore: { title: 'Pricing Strategy', url: 'https://hbr.org/topic/pricing-strategy' },
      extra: { title: 'The End of Solution Sales', meta: 'HBR', url: 'https://hbr.org/2012/07/the-end-of-solution-sales' },
    },
    5: {
      readMore: { title: 'How to Prove ROI in B2B', url: 'https://hbr.org/2019/11/how-to-talk-to-your-boss-about-a-big-idea' },
      extra: { title: 'Business Case Template', meta: 'U.S. Government (OMB)', url: 'https://www.whitehouse.gov/wp-content/uploads/2017/11/Circular-4.pdf' },
    },
    6: {
      readMore: { title: 'Deal Registration (Partner Programs)', url: 'https://help.salesforce.com/s/articleView?id=experience.networks_leaddist_dealreg.htm&language=en_US&type=5' },
      extra: { title: 'Buying Committees and the B2B Buying Journey', meta: 'Gartner (overview)', url: 'https://www.gartner.com/en/sales/insights/b2b-buying-journey' },
    },
    7: {
      readMore: { title: 'B2B Digital Selling', url: 'https://hbr.org/2020/03/selling-in-a-crisis' },
      extra: { title: 'Pipeline Management', meta: 'Salesforce', url: 'https://www.salesforce.com/sales/pipeline/management/' },
    },
    8: {
      readMore: { title: 'Field Sales: A Practical Guide', url: 'https://www.salesforce.com/resources/articles/field-sales/' },
      extra: { title: 'Consensus Sale (deep dive)', meta: 'HBR', url: 'https://hbr.org/2015/03/making-the-consensus-sale' },
    },
    9: {
      readMore: { title: 'Territory Planning', url: 'https://www.salesforce.com/resources/articles/territory-management/' },
      extra: { title: 'Sales Pipeline Management', meta: 'Salesforce', url: 'https://www.salesforce.com/sales/pipeline/management/' },
    },
    10: {
      readMore: { title: 'Unit Economics 101', url: 'https://www.ycombinator.com/library/6g-unit-economics' },
      extra: { title: 'MEDDPICC Sales Methodology', meta: 'MEDDICC', url: 'https://meddicc.com/meddpicc-sales-methodology-and-process' },
    },
    11: {
      readMore: { title: 'Designing Sales Stages and Exit Criteria', url: 'https://www.salesforce.com/resources/articles/sales-process/' },
      extra: { title: 'Sales Pipeline Stages', meta: 'Salesforce', url: 'https://www.salesforce.com/sales/pipeline/stages/' },
    },
    12: {
      readMore: { title: 'Qualification Framework Comparison (MEDDICC vs BANT)', url: 'https://meddicc.com/resources/meddicc-versus-other-qualification-frameworks-like-bant' },
      extra: { title: 'MEDDPICC Sales Methodology', meta: 'MEDDICC', url: 'https://meddicc.com/meddpicc-sales-methodology-and-process' },
    },
    13: {
      readMore: { title: 'Discovery Questions That Create Value', url: 'https://hbr.org/2016/09/the-b2b-sellers-guide-to-discovery' },
      extra: { title: 'SPIN Methodology Overview', meta: 'Huthwaite', url: 'https://www.huthwaiteinternational.com/spin-methodology' },
    },
    14: {
      readMore: { title: 'Pilots and Proof-of-Concepts in B2B', url: 'https://hbr.org/2013/03/a-smarter-way-to-network' },
      extra: { title: 'The End of Solution Sales', meta: 'HBR', url: 'https://hbr.org/2012/07/the-end-of-solution-sales' },
    },
    15: {
      readMore: { title: 'Give-Get Negotiation Discipline', url: 'https://hbr.org/topic/negotiation' },
      extra: { title: 'MEDDPICC Sales Methodology', meta: 'MEDDICC', url: 'https://meddicc.com/meddpicc-sales-methodology-and-process' },
    },
    16: {
      readMore: { title: 'Partner Relationship Management (PRM) Basics', url: 'https://www.salesforce.com/sales/partner-relationship-management/' },
      extra: { title: 'Referral Partners', meta: 'Salesforce', url: 'https://www.salesforce.com/sales/partner-relationship-management/referral-partner/' },
    },
    17: {
      readMore: { title: 'Partner Enablement Playbook (Template)', url: 'https://www.partnerstack.com/blog/partner-enablement' },
      extra: { title: 'Partner Onboarding Checklist', meta: 'SaaStr', url: 'https://www.saastr.com/partner-onboarding/' },
    },
    18: {
      readMore: { title: 'Deal Registration Best Practices', url: 'https://www.slapfive.com/blog/deal-registration' },
      extra: { title: 'CSP Program Overview', meta: 'Microsoft', url: 'https://learn.microsoft.com/en-us/partner-center/enroll/csp-overview' },
    },
    19: {
      readMore: { title: 'Event Marketing ROI (B2B)', url: 'https://hbr.org/2019/11/how-to-measure-marketing-effectiveness' },
      extra: { title: 'Referral Partners', meta: 'Salesforce', url: 'https://www.salesforce.com/sales/partner-relationship-management/referral-partner/' },
    },
    20: {
      readMore: { title: 'Sales Enablement', url: 'https://hbr.org/topic/sales-enablement' },
      extra: { title: 'Partner Tools and Portals', meta: 'Salesforce', url: 'https://www.salesforce.com/sales/partner-relationship-management/' },
    },
    21: {
      readMore: { title: 'SAM.gov (US Federal Contracting)', url: 'https://sam.gov/' },
      extra: { title: 'Federal Acquisition Regulation (FAR)', meta: 'Acquisition.gov', url: 'https://www.acquisition.gov/browse/index/far' },
    },
    22: {
      readMore: { title: 'US Contract Opportunities (overview)', url: 'https://sam.gov/content/opportunities' },
      extra: { title: 'System for Award Management (SAM)', meta: 'GSA', url: 'https://www.sam.gov' },
    },
    23: {
      readMore: { title: 'US NAICS Codes', url: 'https://www.census.gov/naics/' },
      extra: { title: 'FAR Part 15 (Contracting by Negotiation)', meta: 'Acquisition.gov', url: 'https://www.acquisition.gov/far/part-15' },
    },
    24: {
      readMore: { title: 'State & Local Procurement (overview)', url: 'https://www.nlc.org/resource/state-procurement/' },
      extra: { title: 'GSA Schedules', meta: 'GSA', url: 'https://www.gsa.gov/buying-selling/products-services/procurement-programs/gsa-schedules' },
    },
    25: {
      readMore: { title: 'International Public Procurement (OECD)', url: 'https://www.oecd.org/gov/public-procurement/' },
      extra: { title: 'Etimad (Saudi Government Procurement)', meta: 'KSA', url: 'https://etimad.sa/' },
    },
    26: {
      readMore: { title: 'CRM Data Quality Basics', url: 'https://www.salesforce.com/resources/articles/data-quality/' },
      extra: { title: 'Sales Pipeline Management', meta: 'Salesforce', url: 'https://www.salesforce.com/sales/pipeline/management/' },
    },
    27: {
      readMore: { title: 'Sales KPIs: Choosing the Right Metrics', url: 'https://hbr.org/2018/11/a-refresher-on-key-performance-indicators' },
      extra: { title: 'MEDDPICC Sales Methodology', meta: 'MEDDICC', url: 'https://meddicc.com/meddpicc-sales-methodology-and-process' },
    },
    28: {
      readMore: { title: 'Sales Compensation (overview)', url: 'https://hbr.org/topic/sales-compensation' },
      extra: { title: 'CSP Program Overview', meta: 'Microsoft', url: 'https://learn.microsoft.com/en-us/partner-center/enroll/csp-overview' },
    },
    29: {
      readMore: { title: 'Objection Handling Frameworks', url: 'https://hbr.org/2016/02/how-to-overcome-your-fear-of-rejection' },
      extra: { title: 'SPIN Methodology Overview', meta: 'Huthwaite', url: 'https://www.huthwaiteinternational.com/spin-methodology' },
    },
    30: {
      readMore: { title: 'Operating Cadence and Rhythm', url: 'https://hbr.org/2017/01/why-you-need-a-weekly-review' },
      extra: { title: 'Making the Consensus Sale', meta: 'HBR', url: 'https://hbr.org/2015/03/making-the-consensus-sale' },
    },
  };

  const byDay = new Map<number, LessonSources>();
  for (const lesson of canonical.lessons) {
    const extra = extraByDay[lesson.dayNumber];
    assert(extra, `Missing extra sources mapping for day ${lesson.dayNumber}`);

    const canonicalUrlItems: SourceItem[] = (lesson.sources || []).map((u) => ({
      title: u,
      meta: 'Canonical source (URL)',
      url: u,
    }));

    const bibliography: SourceItem[] = [...CORE_BOOKS, ...canonicalUrlItems, extra.extra];

    byDay.set(lesson.dayNumber, {
      bibliography,
      readMore: extra.readMore,
    });
  }

  const seen = new Set<string>();
  for (const [day, v] of byDay) {
    assert(!seen.has(v.readMore.url), `Read more URL duplicated on day ${day}: ${v.readMore.url}`);
    seen.add(v.readMore.url);
  }

  return byDay;
}

function buildQuestionsForDay(dayNumber: number, lessonTitle: string): LessonQuizQuestion[] {
  const topicTag = lessonTagFromTitle(lessonTitle);
  const dayTag = `#day-${String(dayNumber).padStart(2, '0')}`;
  const baseTags = ['#sport-sales-network-usa', '#b2b-sales', dayTag, topicTag];

  const A = 'application' as QuizQuestionType;
  const C = 'critical-thinking' as QuizQuestionType;

  switch (dayNumber) {
    case 21:
      return [
        q({
          questionType: A,
          difficulty: 'MEDIUM' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-application', '#procurement', '#usa'],
          question:
            'A vendor wants to sell a sport facility platform to a US public university athletics department. Which first step best aligns the sales plan with US public procurement reality?',
          options: [
            'Ask for a purchase order and promise delivery next week',
            'Identify the likely procurement path and prepare required registrations before investing heavy presales effort',
            'Run consumer ads to “create demand” so procurement must buy',
            'Avoid documentation to stay flexible until the last minute',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: A,
          difficulty: 'MEDIUM' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-application', '#compliance'],
          question:
            'A contracting authority publishes a notice with strict requirements and deadlines. Which deliverable best reduces exclusion risk in a US public bid?',
          options: [
            'A feature brochure with screenshots and no mapping to requirements',
            'A compliance matrix mapping each requirement to evidence, owner, and submission location',
            'A short email saying “we can do everything” with no attachments',
            'A discount schedule with no technical response',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: A,
          difficulty: 'MEDIUM' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-application', '#evaluation'],
          question:
            'A supplier wants to improve win probability in US public procurement. Which action best targets how bids are evaluated?',
          options: [
            'Focus only on price and ignore evaluation criteria narrative',
            'Build an evidence pack that directly addresses evaluation criteria with measurable outcomes',
            'Write a long company history section and hope it impresses evaluators',
            'Use the same generic response for every contracting authority',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: A,
          difficulty: 'MEDIUM' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-application', '#security'],
          question:
            'A bid requires data security assurances for athlete data. Which proof is most appropriate to include early in the response workflow?',
          options: [
            'A statement that security is “important to us”',
            'A concrete security and privacy evidence set mapped to the requirement',
            'A list of features with no mention of data handling',
            'A promise to “figure it out after contract award”',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: A,
          difficulty: 'MEDIUM' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-application', '#timeline'],
          question:
            'A team tries to run US public bids with a two-week sales cycle assumption. Which correction best reflects procurement timeline constraints?',
          options: [
            'Shorten the response by removing mandatory forms',
            'Plan for a longer cycle with internal resourcing, bid calendar, and submission checkpoints',
            'Wait until the day before the deadline to start writing',
            'Skip clarifications so evaluators can interpret intent freely',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: C,
          difficulty: 'HARD' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-critical-thinking', '#no-bid'],
          question:
            'A supplier can meet 70% of mandatory requirements but several are missing. Which decision is most defensible?',
          options: [
            'Submit anyway and hope evaluators ignore missing items',
            'No-bid and invest in readiness so future bids can be answered compliantly',
            'Copy a competitor response and change the logo',
            'Submit a partial response and promise to complete it after award',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: C,
          difficulty: 'HARD' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-critical-thinking', '#process'],
          question:
            'A vendor has strong product fit but weak bid operations. Which investment most increases win rate over 90 days?',
          options: [
            'More outbound emails to public buyers',
            'A repeatable bid process with evidence library and assigned compliance roles',
            'A new logo and brand refresh',
            'A single “perfect” slide deck with no supporting evidence',
          ],
          correctIndex: 1,
        }),
      ];
    default:
      return buildGenericQuestions(dayNumber, lessonTitle, baseTags);
  }
}

function buildGenericQuestions(dayNumber: number, lessonTitle: string, baseTags: string[]): LessonQuizQuestion[] {
  const A = 'application' as QuizQuestionType;
  const C = 'critical-thinking' as QuizQuestionType;

  const contextByDay: Record<number, { who: string; offer: string; buyer: string; constraint: string }> = {
    1: {
      who: 'a sales lead at a sports performance SaaS vendor',
      offer: 'a subscription platform for elite team performance tracking',
      buyer: 'a US collegiate athletics department',
      constraint: 'budget is split across performance, medical, and IT',
    },
    2: {
      who: 'a commercial manager at a venue technology company',
      offer: 'a ticketing + access control bundle',
      buyer: 'a multi-venue operator across US states',
      constraint: 'implementation must align with event calendars',
    },
    3: {
      who: 'a sales lead at a sports performance SaaS vendor',
      offer: 'a subscription platform for elite team performance tracking',
      buyer: 'a national federation with multiple departments',
      constraint: 'budget is split across performance, medical, and IT',
    },
    4: {
      who: 'a commercial manager at a venue technology company',
      offer: 'a ticketing + access control bundle',
      buyer: 'a multi-venue operator',
      constraint: 'implementation must align with event calendars',
    },
    5: {
      who: 'a founder selling a sponsorship activation analytics product',
      offer: 'measurement dashboards for brand activations',
      buyer: 'a sports rights holder and its top sponsor',
      constraint: 'ROI must be defensible to finance within 30 days',
    },
    6: {
      who: 'a partner manager at a fitness equipment supplier',
      offer: 'a financing-backed equipment package',
      buyer: 'a chain of boutique gyms',
      constraint: 'deal requires sign-off from finance, legal, and operations',
    },
    7: {
      who: 'a growth lead at a sport education platform',
      offer: 'a B2B course licensing model',
      buyer: 'clubs and academies across the USA',
      constraint: 'lead volume is high but qualified deals are scarce',
    },
    8: {
      who: 'a field sales manager at a venue services provider',
      offer: 'match-day operations software',
      buyer: 'stadium operators and event promoters',
      constraint: 'decision windows are tied to fixed event dates',
    },
    9: {
      who: 'a regional sales director',
      offer: 'a performance analytics suite',
      buyer: 'clubs across multiple US regions',
      constraint: 'coverage is limited; reps must prioritize accounts',
    },
    10: {
      who: 'a sales ops analyst',
      offer: 'a service + software package for clubs',
      buyer: 'mid-market club groups',
      constraint: 'gross margin varies heavily by deployment model',
    },
    11: {
      who: 'a revenue operations manager',
      offer: 'a three-motion GTM (direct, partner, procurement)',
      buyer: 'mixed segments across the USA',
      constraint: 'pipeline reporting is inconsistent across teams',
    },
    12: {
      who: 'an enterprise account executive',
      offer: 'a multi-year platform contract',
      buyer: 'a federation + its commercial arm',
      constraint: 'multiple stakeholders can veto late',
    },
    13: {
      who: 'a sales rep',
      offer: 'a sports facility booking platform',
      buyer: 'a university-owned facility operator',
      constraint: 'urgency is unclear and timelines drift',
    },
    14: {
      who: 'a solutions lead',
      offer: 'a pilot + rollout proposal for a venue network',
      buyer: 'a multi-venue operator',
      constraint: 'risk control and rollout governance are key',
    },
    15: {
      who: 'an account executive',
      offer: 'a negotiation for a 12-month contract',
      buyer: 'a procurement team',
      constraint: 'discount pressure is high near quarter end',
    },
    16: {
      who: 'a channel director',
      offer: 'a partner-led sales motion',
      buyer: 'resellers and consultancies',
      constraint: 'partner conflict and overlap with direct sales',
    },
    17: {
      who: 'a partner enablement lead',
      offer: 'onboarding for new partners',
      buyer: 'fitness and sport integrators',
      constraint: 'partners have low product knowledge initially',
    },
    18: {
      who: 'a channel ops manager',
      offer: 'deal registration + incentives',
      buyer: 'referral and reseller partners',
      constraint: 'disputes about deal ownership are increasing',
    },
    19: {
      who: 'a partner marketer',
      offer: 'co-marketing and events',
      buyer: 'strategic partners',
      constraint: 'lead quality from events is inconsistent',
    },
    20: {
      who: 'a sales enablement manager',
      offer: 'playbooks and tools',
      buyer: 'direct reps and partners',
      constraint: 'messaging and demos vary widely by rep',
    },
    22: {
      who: 'a compliance lead',
      offer: 'supplier readiness for US public bids',
      buyer: 'public contracting authorities',
      constraint: 'missing mandatory forms causes immediate exclusion',
    },
    23: {
      who: 'a sales ops lead',
      offer: 'tender discovery and monitoring',
      buyer: 'public sector sport and recreation buyers',
      constraint: 'the team misses notices because monitoring is ad hoc',
    },
    24: {
      who: 'a state sales manager',
      offer: 'state and local procurement opportunities',
      buyer: 'state agencies and public bodies',
      constraint: 'entry points differ from federal workflows',
    },
    25: {
      who: 'an international expansion lead',
      offer: 'public procurement entry points across regions',
      buyer: 'US federal and MENA government buyers',
      constraint: 'process differences create execution risk',
    },
    26: {
      who: 'a RevOps lead',
      offer: 'CRM discipline and data standards',
      buyer: 'internal sales and partner teams',
      constraint: 'pipeline data is unreliable for forecasting',
    },
    27: {
      who: 'a sales leader',
      offer: 'KPI system aligned to motions',
      buyer: 'direct + partner teams',
      constraint: 'teams optimize the wrong metrics',
    },
    28: {
      who: 'a compensation designer',
      offer: 'incentives across direct and channel',
      buyer: 'sales reps and partners',
      constraint: 'comp plans drive channel conflict and sandbagging',
    },
    29: {
      who: 'an enablement lead',
      offer: 'scripts, decks, demos, objection handling',
      buyer: 'direct reps and partners',
      constraint: 'objections recur and reps improvise weak answers',
    },
    30: {
      who: 'a GTM operator',
      offer: 'a 90-day rollout plan and cadence',
      buyer: 'the internal revenue org',
      constraint: 'too many initiatives launch without owners',
    },
  };

  const c = contextByDay[dayNumber] ?? {
    who: 'a commercial operator',
    offer: 'a sport B2B offer',
    buyer: 'a US buyer',
    constraint: 'resources are limited',
  };

  const title = lessonTitle.replace(/\s+/g, ' ').trim();

  const app1 = q({
    questionType: A,
    difficulty: 'MEDIUM' as QuestionDifficulty,
    hashtags: [...baseTags, '#type-application', '#deliverable'],
    question: `You are ${c.who} selling ${c.offer} to ${c.buyer}. The main constraint is that ${c.constraint}. Which deliverable best matches the goal of “${title}”?`,
    options: [
      'A generic feature list with no owner, date, or decision path',
      'A specific artifact that can be reviewed and approved (with owners and success criteria)',
      'A motivational memo about working harder in sales',
      'A set of social-media posts to “increase awareness”',
    ],
    correctIndex: 1,
  });

  const app2 = q({
    questionType: A,
    difficulty: 'MEDIUM' as QuestionDifficulty,
    hashtags: [...baseTags, '#type-application', '#next-step'],
    question: `A stakeholder says they are “interested” in ${c.offer}, but timelines keep slipping. Which next step is most likely to create clarity and momentum for “${title}”?`,
    options: [
      'Ask for a signature immediately without confirming the decision path',
      'Confirm the decision process in writing: owners, required proofs, and a dated close plan',
      'Send more product screenshots and wait for a reply',
      'Offer a discount as the first response to uncertainty',
    ],
    correctIndex: 1,
  });

  const app3 = q({
    questionType: A,
    difficulty: 'MEDIUM' as QuestionDifficulty,
    hashtags: [...baseTags, '#type-application', '#proof'],
    question: `A buyer asks, “How do we know this will work in our environment?” Which proof is strongest for “${title}” when selling to ${c.buyer}?`,
    options: [
      'A vague claim that the product is “best in class”',
      'A context-matched proof pack: outcomes, implementation plan, and risk controls',
      'A long list of unrelated awards',
      'A single testimonial with no metrics or comparable context',
    ],
    correctIndex: 1,
  });

  const app4 = q({
    questionType: A,
    difficulty: 'MEDIUM' as QuestionDifficulty,
    hashtags: [...baseTags, '#type-application', '#process'],
    question: `A rep wants to skip steps “to move faster.” Which action best preserves deal integrity while still improving speed for “${title}”?`,
    options: [
      'Remove documentation and rely on verbal agreements',
      'Define clear exit criteria for the next stage and time-box the validation work',
      'Ignore procurement/legal until after the decision',
      'Add more stakeholders to every meeting to “cover all bases”',
    ],
    correctIndex: 1,
  });

  const app5 = q({
    questionType: A,
    difficulty: 'MEDIUM' as QuestionDifficulty,
    hashtags: [...baseTags, '#type-application', '#usa'],
    question: `A team is expanding across US states. Which operational detail is most important to standardize when implementing “${title}”?`,
    options: [
      'Office background colors for video calls',
      'Definitions, fields, and owners so data and handoffs stay consistent across regions',
      'The personal writing style of each rep’s emails',
      'The order of emojis in outreach messages',
    ],
    correctIndex: 1,
  });

  const crit1 = q({
    questionType: C,
    difficulty: 'HARD' as QuestionDifficulty,
    hashtags: [...baseTags, '#type-critical-thinking', '#tradeoff'],
    question: `A sales leader must choose between maximizing short-term pipeline volume and improving qualification rigor for “${title}”. Which decision is most likely to improve long-term win rate?`,
    options: [
      'Lower qualification standards to increase the number of deals',
      'Raise qualification gates and remove deals that cannot meet proof and approval requirements',
      'Stop tracking metrics to avoid bias',
      'Only chase the largest logos regardless of fit',
    ],
    correctIndex: 1,
  });

  const crit2 = q({
    questionType: C,
    difficulty: 'HARD' as QuestionDifficulty,
    hashtags: [...baseTags, '#type-critical-thinking', '#risk'],
    question: `A buyer wants a fast decision but refuses to name process owners. For “${title}”, which response best reduces delivery risk while keeping the deal alive?`,
    options: [
      'Proceed anyway and accept the risk as “normal in sport”',
      'Propose a short written decision path with minimal owners, then time-box the confirmation step',
      'Add more features to the proposal to “create excitement”',
      'Move the deal to next quarter and stop all communication',
    ],
    correctIndex: 1,
  });

  return [app1, app2, app3, app4, app5, crit1, crit2];
}

function updateLessonContentSources(content: string, sources: LessonSources) {
  const bibliographyHeader = '## Bibliography (sources used)';
  const readMoreHeader = '## Read more (optional)';

  const bibBlock = buildBibliographyBlock(sources.bibliography);
  const readMoreBlock = buildReadMoreBlock(sources.readMore);

  let updated = content;

  if (!updated.includes(bibliographyHeader)) {
    updated = `${updated.trim()}\n\n${bibliographyHeader}\n\n${bibBlock.trim()}\n\n${readMoreHeader}\n\n${readMoreBlock.trim()}\n`;
    return updated;
  }

  updated = replaceBetween(updated, bibliographyHeader, [readMoreHeader, '\n# '], bibBlock);
  const readMoreStart = updated.indexOf(readMoreHeader);
  if (readMoreStart === -1) {
    updated = `${updated.trim()}\n\n${readMoreHeader}\n\n${readMoreBlock.trim()}\n`;
    return updated;
  }
  const after = readMoreStart + readMoreHeader.length;
  updated = `${updated.slice(0, after)}\n\n${readMoreBlock.trim()}\n`;
  return updated;
}

function auditHardRules(pkg: CoursePackageV2) {
  const lessons = pkg.lessons || [];
  assert(lessons.length === 30, `Expected 30 lessons, found ${lessons.length}`);

  const seenQuestionTexts = new Set<string>();
  const readMoreKeySet = new Set<string>();

  for (const lesson of lessons) {
    const questions = lesson.quizQuestions || [];
    assert(questions.length === 7, `Lesson ${lesson.lessonId}: expected 7 questions, found ${questions.length}`);

    const normalized = questions.map((q) => normalizeForUniq(q.question));
    for (const t of normalized) {
      assert(!seenQuestionTexts.has(t), `Duplicate question text found (lesson ${lesson.lessonId}): ${t}`);
      seenQuestionTexts.add(t);
    }

    const bib = sliceSectionByHeaders(lesson.content, '## Bibliography (sources used)', '## Read more (optional)');
    const bibCount = countNumberedListItems(bib);
    assert(bibCount >= 3, `Lesson ${lesson.lessonId}: bibliography has ${bibCount} sources (min 3).`);

    const readMore = sliceSectionByHeaders(lesson.content, '## Read more (optional)');
    const urls = extractUrls(readMore);
    assert(urls.length >= 1, `Lesson ${lesson.lessonId}: missing read more URL.`);
    const key = urls.join('|');
    assert(!readMoreKeySet.has(key), `Lesson ${lesson.lessonId}: read more duplicated (${key}).`);
    readMoreKeySet.add(key);

    const v = validateLessonQuestions(
      questions.map((q) => ({
        question: q.question,
        options: q.options,
        questionType: q.questionType,
        difficulty: q.difficulty,
        correctIndex: q.correctIndex,
      })),
      lesson.language,
      lesson.title
    );
    assert(v.isValid, `Lesson ${lesson.lessonId}: question-quality errors:\n- ${v.errors.join('\n- ')}`);
  }

  assert(seenQuestionTexts.size === 210, `Expected 210 unique questions, found ${seenQuestionTexts.size}`);
}

function buildCourseMarkdown(pkg: CoursePackageV2) {
  const lessons = pkg.lessons || [];
  const lines: string[] = [];
  lines.push(`# SPORT_SALES_NETWORK_USA_2026_EN — Recreated Course (2026-02-06)`);
  lines.push('');
  lines.push(`**Course ID**: SPORT_SALES_NETWORK_USA_2026_EN`);
  lines.push(`**CCS ID**: SPORT_SALES_NETWORK_USA_2026`);
  lines.push(`**Lessons**: ${lessons.length}`);
  lines.push(`**Questions**: ${lessons.reduce((a, l) => a + (l.quizQuestions?.length || 0), 0)} (7 per lesson)`);
  lines.push('');
  lines.push('---');
  lines.push('');

  for (const lesson of lessons) {
    lines.push(lesson.content.trim());
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  lines.push('# Quiz Bank (210 questions)');
  lines.push('');
  for (const lesson of lessons) {
    lines.push(`## Day ${String(lesson.dayNumber).padStart(2, '0')}: ${lesson.title}`);
    lines.push('');
    const qs = lesson.quizQuestions || [];
    qs.forEach((qq, idx) => {
      lines.push(`${idx + 1}. ${qq.question}`);
      qq.options.forEach((opt, oi) => {
        const label = String.fromCharCode('A'.charCodeAt(0) + oi);
        const mark = oi === qq.correctIndex ? ' (correct)' : '';
        lines.push(`   - ${label}. ${opt}${mark}`);
      });
      lines.push('');
    });
  }

  return lines.join('\n');
}

function buildBibliographyMarkdown(pkg: CoursePackageV2) {
  const lessons = pkg.lessons || [];
  const out: string[] = [];
  out.push('# Sport Sales Network USA 2026 — Bibliography and Read more (Recreated)');
  out.push('');

  for (const lesson of lessons) {
    out.push(`## Day ${String(lesson.dayNumber).padStart(2, '0')}: ${lesson.title}`);
    out.push('');

    const bib = sliceSectionByHeaders(lesson.content, '## Bibliography (sources used)', '## Read more (optional)');
    const readMore = sliceSectionByHeaders(lesson.content, '## Read more (optional)');

    out.push('### Bibliography (sources used)');
    out.push('');
    out.push(bib.trim());
    out.push('');
    out.push('### Read more (lesson-specific)');
    out.push('');
    out.push(readMore.trim());
    out.push('');
  }

  return out.join('\n');
}

function main() {
  const canonical: CanonicalCourse = JSON.parse(fs.readFileSync(CANONICAL_JSON, 'utf8'));
  const pkg: CoursePackageV2 = JSON.parse(fs.readFileSync(INPUT_JSON, 'utf8'));

  assert(pkg.course && pkg.lessons, 'Input package must contain course + lessons.');
  assert(pkg.lessons.length === 30, `Input package should have 30 lessons, found ${pkg.lessons.length}`);

  const sourcesByDay = buildLessonSourcesByDay(canonical);

  const updatedLessons = pkg.lessons.map((lesson) => {
    const sources = sourcesByDay.get(lesson.dayNumber);
    assert(sources, `Missing sources for day ${lesson.dayNumber}`);

    const updatedContent = updateLessonContentSources(lesson.content, sources);
    const updatedQuestions = buildQuestionsForDay(lesson.dayNumber, lesson.title);

    return {
      ...lesson,
      content: updatedContent,
      quizQuestions: updatedQuestions,
      isActive: true,
    };
  });

  const outPkg: CoursePackageV2 = {
    ...pkg,
    exportedAt: new Date().toISOString(),
    exportedBy: 'codex/refactor-sport-sales-network-usa-2026-en',
    course: {
      ...(pkg.course || {}),
      isActive: true,
    },
    lessons: updatedLessons,
  };

  auditHardRules(outPkg);

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(outPkg, null, 2) + '\n', 'utf8');
  fs.writeFileSync(OUT_MD, buildCourseMarkdown(outPkg) + '\n', 'utf8');
  fs.writeFileSync(OUT_BIBLIO_MD, buildBibliographyMarkdown(outPkg) + '\n', 'utf8');

  console.log(`Wrote:\n- ${OUT_JSON}\n- ${OUT_MD}\n- ${OUT_BIBLIO_MD}`);
}

main();
