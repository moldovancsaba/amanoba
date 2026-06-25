/**
 * Seed: Entering the GCC Market — B2B Introduction (EN)
 *
 * Creates a 3-day free/public course with practical lessons, student tasks,
 * useful external sources, bibliography, and course-specific quiz questions.
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { randomUUID } from 'crypto';
import mongoose from 'mongoose';

config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

import connectDB from '../app/lib/mongodb';
import { Brand, Course, Lesson, QuizQuestion } from '../app/lib/models';

const COURSE_ID = 'GCC_MARKET_ENTRY_2026_EN';
const THUMBNAIL = 'https://i.ibb.co/rR7wGWrG/gcc-market-entry-hero-2026-en.png';

type QuestionSeed = {
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: 'MEDIUM' | 'HARD';
  questionType: 'application' | 'critical-thinking';
  explanation: string;
};

type LessonSeed = {
  lessonId: string;
  dayNumber: number;
  title: string;
  content: string;
  emailSubject: string;
  questions: QuestionSeed[];
};

function sourceLine(title: string, url: string, note: string) {
  return `- [${title}](${url}) - ${note}`;
}

function bibliographyLine(label: string, url: string) {
  return `- ${label}. Available at: ${url}`;
}

const SOURCES = {
  gccAcademy: {
    title: 'UK Department for Business and Trade: Gateway GCC Business Academy',
    url: 'https://www.business.gov.uk/business-academy/gateway_gcc/',
  },
  saudiMarketEntry: {
    title: 'International Trade Administration: Saudi Arabia Market Entry Strategy',
    url: 'https://www.trade.gov/country-commercial-guides/saudi-arabia-market-entry-strategy',
  },
  saudiSelling: {
    title: 'International Trade Administration: Saudi Arabia Selling Factors and Techniques',
    url: 'https://www.trade.gov/country-commercial-guides/saudi-arabia-selling-factors-and-techniques',
  },
  uaeMarketEntry: {
    title: 'International Trade Administration: UAE Market Entry Strategy',
    url: 'https://www.trade.gov/country-commercial-guides/united-arab-emirates-market-entry-strategy',
  },
  uaeImport: {
    title: 'International Trade Administration: UAE Import Requirements and Documentation',
    url: 'https://www.trade.gov/country-commercial-guides/united-arab-emirates-import-requirements-and-documentation',
  },
  uaeMoet: {
    title: 'UAE Ministry of Economy and Tourism: Establishing Businesses',
    url: 'https://www.moet.gov.ae/en/establishing-companies',
  },
  qatarMarketEntry: {
    title: 'International Trade Administration: Qatar Market Entry Strategy',
    url: 'https://www.trade.gov/country-commercial-guides/qatar-market-entry-strategy',
  },
  qatarSelling: {
    title: 'International Trade Administration: Qatar Selling Factors and Techniques',
    url: 'https://www.trade.gov/country-commercial-guides/qatar-selling-factors-and-techniques',
  },
  qatarChallenges: {
    title: 'International Trade Administration: Qatar Market Challenges',
    url: 'https://www.trade.gov/country-commercial-guides/qatar-market-challenges',
  },
  edcCulture: {
    title: 'Export Development Canada: Cultural etiquette tips for the GCC',
    url: 'https://www.edc.ca/en/guide/edc-cultural-etiquette-tips-gcc.html',
  },
  saudiRhq: {
    title: 'Guideline for Regional Headquarters in KSA',
    url: 'https://catalyzesaudi.sa/RHQ/wp-content/uploads/2024/08/Guideline-for-Regional-Headquarters-in-KSA-English.pdf',
  },
};

function lesson1Content() {
  return `# GCC market entry: choosing the right first beachhead

## Why this matters
The Gulf Cooperation Council (GCC) is not one single market. It is a regional bloc made up of Bahrain, Kuwait, Oman, Qatar, Saudi Arabia, and the United Arab Emirates. These markets share language, religion, regional trade links, family business influence, and relationship-based business norms, but they differ sharply in procurement rules, sector priorities, company setup options, speed of decision-making, and buyer expectations.

For a B2B product or service company, the first strategic mistake is treating "the GCC" as a generic territory. A better entry thesis names a beachhead country, buyer segment, channel path, proof requirement, and compliance gate. In practice, many companies compare the UAE as a regional commercial hub, Saudi Arabia as the largest transformation and public-sector opportunity, and Qatar as a relationship-driven market with concentrated decision networks. Bahrain, Kuwait, and Oman can also be strong choices when the buyer segment, partner ecosystem, or regulatory fit is more attractive.

## The entry thesis
Your first output is not a pitch deck. It is a market-entry thesis:

1. **Where will we start?** Choose one primary country and one secondary country instead of spreading effort across all six GCC states.
2. **Who is the economic buyer?** Identify whether the sale is to a government entity, semi-government organization, family group, enterprise, distributor, bank, telco, energy company, healthcare group, construction player, or professional-services buyer.
3. **What local proof matters?** Buyers may ask for regional references, Arabic or bilingual materials, local support, implementation partners, security/compliance evidence, and proof that your company will stay in the region after the first deal.
4. **Which channel opens trust fastest?** Options include direct sales, local agent, distributor, system integrator, joint venture, free-zone entity, mainland/onshore entity, or regional headquarters strategy.
5. **What is the first measurable commitment?** For B2B, this is often a discovery workshop, paid pilot, proof of concept, local partner MoU, government tender qualification, or anchor-customer reference.

## How the main markets differ for a B2B entrant
The UAE is often attractive for regional operations because of its open market economy, free zones, logistics, international workforce, and business setup options. It is not automatically the best selling market for every product, but it can be a strong base for regional coverage, events, partner meetings, and customer support.

Saudi Arabia requires special attention because of its scale, Vision 2030 transformation programs, localization expectations, and public-sector procurement rules. If government or government-linked business is central to your model, the Saudi regional headquarters (RHQ) rules and local operating expectations must be reviewed early with qualified advisors.

Qatar is smaller but can be commercially strong when the product aligns with government priorities, energy, infrastructure, sports, education, healthcare, logistics, or digital modernization. Decision networks can be concentrated, reputation matters, and a patient relationship-building approach is usually more effective than a purely transactional campaign.

## Good vs poor market-entry thinking
**Good:** "We will start with UAE as an operating hub and Saudi as our first enterprise sales target. We will validate demand with system integrator partners, build Arabic executive materials, map licensing needs, and run three paid pilots before hiring a local team."

**Poor:** "The GCC has money, so we will hire a salesperson, attend one event, send English decks to everyone, and expect regional deals within one quarter."

## Example entry thesis
Example: a cybersecurity SaaS company may choose Saudi Arabia as the first revenue market because the target buyers are government-linked enterprises with urgent compliance needs, while using the UAE for events, partner meetings, and regional support hiring. The first proof target could be two paid pilots with named security success criteria and a local implementation partner.

## Success criteria
By the end of this lesson, you should have a one-page GCC entry thesis that includes country priority, target buyer, channel route, proof requirement, compliance unknowns, and a 90-day validation plan.

## Student tasks
1. Choose one primary GCC country and one backup country for your B2B product or service. Write why each country is strategically attractive and what would make you reject it.
2. Build an ideal customer profile with sector, buyer role, budget owner, procurement path, implementation risk, and required local proof.
3. Write a 90-day validation plan with five buyer interviews, three partner interviews, one compliance consultation, and one pilot offer.

## Useful external sources
${sourceLine(SOURCES.gccAcademy.title, SOURCES.gccAcademy.url, 'Use this for a regional overview of business culture, legal frameworks, payments, risk, and IP topics across the GCC.')}
${sourceLine(SOURCES.saudiMarketEntry.title, SOURCES.saudiMarketEntry.url, 'Use this for Saudi market-entry considerations, market conditions, and public-sector context.')}
${sourceLine(SOURCES.uaeMarketEntry.title, SOURCES.uaeMarketEntry.url, 'Use this for UAE market-entry options and exporter considerations.')}
${sourceLine(SOURCES.qatarMarketEntry.title, SOURCES.qatarMarketEntry.url, 'Use this for Qatar market-entry strategy and practical entry considerations.')}

## Bibliography
${bibliographyLine(SOURCES.gccAcademy.title, SOURCES.gccAcademy.url)}
${bibliographyLine(SOURCES.saudiMarketEntry.title, SOURCES.saudiMarketEntry.url)}
${bibliographyLine(SOURCES.uaeMarketEntry.title, SOURCES.uaeMarketEntry.url)}
${bibliographyLine(SOURCES.qatarMarketEntry.title, SOURCES.qatarMarketEntry.url)}
`;
}

function lesson2Content() {
  return `# Business culture and negotiation in the GCC

## Why this matters
GCC negotiation often starts before the formal negotiation. Trust, reputation, introductions, patience, and seniority can matter as much as the written proposal. A B2B seller who treats the region as a purely transactional market may misread silence, indirect feedback, hospitality, meeting changes, or requests for local presence.

This does not mean every buyer behaves the same way. Multinational companies, government entities, family groups, start-ups, banks, energy companies, and technology buyers may all operate differently. Still, several cultural patterns are common enough that a market entrant should prepare for them.

## Core cultural characteristics
**Relationship before transaction.** A warm introduction can change the quality of access. Buyers often want to know whether you are serious, stable, respectful, and capable of supporting the region after signing.

**Hierarchy and senior sponsorship.** Senior decision makers may not join every meeting, but their view can shape the deal. A junior team may evaluate the product while senior leaders decide whether the relationship and risk profile are acceptable.

**Indirect communication and face-saving.** A polite "we will study it" may mean interest, delay, internal disagreement, or rejection. Pressing too aggressively for a yes/no can damage trust. The better move is to confirm next steps, decision criteria, and timing respectfully.

**Hospitality and protocol.** Time spent in greetings, coffee, meals, or general conversation is not wasted time. It is part of trust-building. Dress, punctuality, titles, respect for prayer time, and Ramadan awareness matter.

**Price is not the only negotiation variable.** GCC buyers may negotiate on implementation commitment, local support, exclusivity, payment terms, warranties, training, Arabic materials, reference visits, data/security, local partner role, and executive access.

## How business owners often negotiate
Owners and senior leaders in the region may negotiate from a relationship-and-risk perspective. They may test whether you are patient, whether your senior team will show up, whether you respect local norms, and whether your company can adapt. They may also push hard on price or concessions after trust has been established. Do not confuse hospitality with a closed deal.

In family-owned groups, reputation and long-term relationship can be decisive. In government-linked organizations, process, prequalification, budget cycle, localization, and procurement rules may matter more than personal enthusiasm. In enterprise technology or services sales, security, implementation capability, support response time, and regional references can outweigh product features.

## Negotiation checklist
1. Secure a warm introduction where possible.
2. Bring a senior representative to important first or closing meetings.
3. Prepare a short executive story before a detailed technical deck.
4. Ask about decision process, budget owner, procurement route, and local proof requirements.
5. Translate value into the buyer's strategic agenda: efficiency, national transformation, localization, service quality, risk reduction, or revenue growth.
6. Avoid public disagreement or pressure tactics.
7. Confirm next steps in writing without sounding distrustful.
8. Treat silence as a signal to diagnose, not as permission to spam follow-ups.

## Good vs poor negotiation behavior
**Good:** "We understand local support is a concern. Let us propose a pilot with a named regional implementation partner, Arabic user materials, and a support SLA. If the pilot meets these three criteria, we can discuss a wider rollout."

**Poor:** "This is our global standard contract. We do not localize support, we cannot visit again this quarter, and the discount expires Friday."

## Example negotiation move
Example: if a buyer asks for a lower price, do not answer with price alone. Clarify whether the real concern is budget, implementation risk, payment terms, local support, or executive confidence. Then trade concessions against scope, pilot size, contract length, reference rights, or support commitments.

## Student tasks
1. Rewrite your standard sales pitch into a GCC executive conversation: trust, local commitment, strategic value, and risk reduction first; product detail second.
2. Create a negotiation map with decision maker, influencer, technical evaluator, procurement owner, legal/compliance owner, and potential local partner.
3. Write five respectful follow-up questions that clarify timing, decision criteria, and objections without forcing a public yes/no.

## Useful external sources
${sourceLine(SOURCES.edcCulture.title, SOURCES.edcCulture.url, 'Use this for practical etiquette guidance around trust, relationships, meeting style, and cultural expectations in the GCC.')}
${sourceLine(SOURCES.saudiSelling.title, SOURCES.saudiSelling.url, 'Use this for Saudi selling factors and techniques, especially when planning B2B sales motions.')}
${sourceLine(SOURCES.uaeMarketEntry.title, SOURCES.uaeMarketEntry.url, 'Use this to compare UAE entry and selling considerations with the negotiation route.')}
${sourceLine(SOURCES.qatarSelling.title, SOURCES.qatarSelling.url, 'Use this for Qatar selling techniques and buyer-facing considerations.')}

## Bibliography
${bibliographyLine(SOURCES.edcCulture.title, SOURCES.edcCulture.url)}
${bibliographyLine(SOURCES.saudiSelling.title, SOURCES.saudiSelling.url)}
${bibliographyLine(SOURCES.uaeMarketEntry.title, SOURCES.uaeMarketEntry.url)}
${bibliographyLine(SOURCES.qatarSelling.title, SOURCES.qatarSelling.url)}
`;
}

function lesson3Content() {
  return `# Requirements for entering with a B2B product or service

## Why this matters
Market entry becomes expensive when legal setup, licensing, tax, hiring, data, import, procurement, localization, or partner requirements are discovered after sales conversations begin. This lesson does not replace legal, tax, or regulatory advice. It gives you a practical checklist for preparing a B2B entry plan and knowing where expert review is needed.

## The operating model decision
Choose the lightest credible operating model that matches your sales motion:

1. **Export or remote delivery:** useful for early validation, but may be weak when buyers need local invoicing, support, or procurement eligibility.
2. **Local agent or distributor:** can accelerate trust and access, but requires careful commercial terms, territory rights, anti-bribery controls, and performance obligations.
3. **System integrator or implementation partner:** often valuable for B2B technology, industrial solutions, and services requiring local delivery.
4. **Free-zone entity:** may suit regional operations, professional services, technology, or holding/support functions depending on activity and market.
5. **Mainland/onshore entity:** may be required or preferred for some local trading, government, hiring, contracting, or regulated activities.
6. **Saudi RHQ strategy:** relevant when the business depends on Saudi public-sector or government-linked opportunities and regional management presence.

## Key definitions
**Permitted activity** means the legal activity your local license allows you to perform. If you sell software, consulting, equipment, training, or managed services, the activity must match the real offer.

**Procurement eligibility** means the buyer is allowed to buy from you under its internal, public-sector, or regulated-sector rules.

**Local proof** means evidence that reduces buyer risk in the region: references, local support, implementation capacity, Arabic materials, compliance documents, or partner capability.

## Example operating model
Example: a B2B analytics company could start with remote discovery and a regional system-integrator partner, then move to a UAE free-zone entity for regional operations if pilots convert. If Saudi public-sector tenders become central, the company would separately evaluate Saudi local-presence and RHQ implications with legal and tax advisors.

## Key requirements to check
**Commercial license and permitted activity.** Your legal activity must match what you sell. In the UAE, business setup starts with identifying the activity, legal structure, trade name, approvals, and licensing route.

**Import and product compliance.** If your B2B product is physical, check customs documentation, standards, labeling, certification, warranty, and distributor obligations. For software or services, check data hosting, cybersecurity, AI/data rules, sector licensing, and government procurement requirements.

**Tax and invoicing.** Review VAT, corporate tax, withholding, permanent establishment risk, transfer pricing, local invoicing needs, and payment collection. Use local advisors before committing to a structure.

**Localization and support.** Buyers may expect Arabic materials, local references, regional support hours, onsite training, local account management, and implementation partners.

**Procurement and tender readiness.** Government and large enterprise sales may require vendor registration, prequalification, local bank guarantees, security clearance, local content commitments, or RHQ/local-presence evidence.

**Partner governance.** A partner is not a shortcut around strategy. Define lead ownership, margin, exclusivity, reporting, compliance, non-circumvention, customer data, implementation responsibility, and termination rules.

## A 90-day B2B entry plan
**Weeks 1-2:** Select country priority, buyer ICP, partner hypothesis, and compliance unknowns. Hold legal/tax/regulatory calls.

**Weeks 3-5:** Interview buyers and partners. Test whether your value proposition matches local priorities and procurement reality.

**Weeks 6-8:** Build localized sales assets: executive deck, Arabic one-pager if relevant, implementation plan, support model, security/compliance pack, and pilot offer.

**Weeks 9-12:** Run partner validation and pilot negotiation. Decide whether to continue remote, appoint a partner, set up locally, or pause.

## Go/no-go criteria
Proceed when you have a named buyer segment, qualified pipeline, a feasible license/partner path, realistic support model, and a first pilot economics case. Pause when the only evidence is conference enthusiasm, vague partner promises, or "the region has budget."

## Student tasks
1. Build a market-entry requirements checklist for your company: license, activity, partner, tax, import/product rules, data/security, support, procurement, and local proof.
2. Draft a partner scorecard with access, credibility, sector fit, delivery capability, compliance posture, commercial terms, and conflict risk.
3. Create a 90-day go/no-go dashboard with five metrics: qualified buyer meetings, partner validation, compliance blockers, pilot economics, and executive sponsor quality.

## Useful external sources
${sourceLine(SOURCES.uaeMoet.title, SOURCES.uaeMoet.url, 'Use this for UAE company establishment steps such as business activity, legal structure, trade name, approvals, and licensing.')}
${sourceLine(SOURCES.uaeImport.title, SOURCES.uaeImport.url, 'Use this for UAE import and trade-license requirements when the offer includes physical goods.')}
${sourceLine(SOURCES.saudiRhq.title, SOURCES.saudiRhq.url, 'Use this when Saudi public-sector or regional-headquarters strategy may affect your operating model.')}
${sourceLine(SOURCES.qatarChallenges.title, SOURCES.qatarChallenges.url, 'Use this to identify Qatar market challenges and entry barriers that require planning.')}

## Bibliography
${bibliographyLine(SOURCES.uaeMoet.title, SOURCES.uaeMoet.url)}
${bibliographyLine(SOURCES.uaeImport.title, SOURCES.uaeImport.url)}
${bibliographyLine(SOURCES.saudiRhq.title, SOURCES.saudiRhq.url)}
${bibliographyLine(SOURCES.qatarChallenges.title, SOURCES.qatarChallenges.url)}
`;
}

const lessons: LessonSeed[] = [
  {
    lessonId: `${COURSE_ID}_DAY_01`,
    dayNumber: 1,
    title: 'GCC market map and entry thesis',
    content: lesson1Content(),
    emailSubject: 'Day 1: Build your GCC market-entry thesis',
    questions: [
      {
        question: 'A B2B software company wants to “enter the GCC” and immediately hire one salesperson to cover all six countries. What is the best first correction?',
        options: [
          'Select a primary beachhead country, define the buyer segment and proof requirements, then validate with buyers and partners before scaling region-wide.',
          'Keep all six countries equally prioritized so the salesperson can discover demand opportunistically without narrowing the focus.',
          'Start with a large event sponsorship because visibility matters more than country selection or buyer qualification.',
          'Translate the website into Arabic first and delay buyer interviews until a local entity is fully registered.',
        ],
        correctIndex: 0,
        difficulty: 'MEDIUM',
        questionType: 'application',
        explanation: 'The course teaches a focused entry thesis before broad execution.',
      },
      {
        question: 'A company chooses the UAE as a base but expects that choice alone to prove demand in Saudi Arabia and Qatar. What is the key strategic risk?',
        options: [
          'An operating hub can help regional coordination, but buyer needs, procurement rules, and local proof still differ by country.',
          'The UAE base automatically qualifies the company for every government and enterprise tender across the region.',
          'Saudi Arabia and Qatar can be ignored until the company has operated in Dubai for at least five years.',
          'Regional demand is determined only by office location, not by buyer segment, channel, or compliance fit.',
        ],
        correctIndex: 0,
        difficulty: 'HARD',
        questionType: 'critical-thinking',
        explanation: 'A hub strategy is not a substitute for country-specific validation.',
      },
      {
        question: 'An industrial services firm has no regional references. Which validation action is most useful before opening a local office?',
        options: [
          'Run structured buyer and partner interviews to identify proof requirements, procurement path, and a realistic paid-pilot offer.',
          'Hire a receptionist and rent office space first because physical presence always creates buyer trust.',
          'Offer a deep discount to any first customer without checking whether the customer can become a credible reference.',
          'Avoid local partner conversations because partners only matter after a full legal entity is created.',
        ],
        correctIndex: 0,
        difficulty: 'MEDIUM',
        questionType: 'application',
        explanation: 'Validation should clarify proof, channel, and pilot economics before fixed cost.',
      },
      {
        question: 'A team says the market is attractive because “the region has budget.” What is missing from this reasoning?',
        options: [
          'A specific economic buyer, pain point, procurement route, compliance path, and reason the offer beats local or incumbent alternatives.',
          'A larger generic slide about GDP growth, because budget size alone is enough to prove sales readiness.',
          'A list of every GCC country capital city, because geography is the main missing sales variable.',
          'A commitment to visit only trade shows, because direct customer discovery may bias the team.',
        ],
        correctIndex: 0,
        difficulty: 'HARD',
        questionType: 'critical-thinking',
        explanation: 'Market attractiveness must be converted into buyer-specific evidence.',
      },
      {
        question: 'A B2B services company wants to choose between direct sales, distributor, and implementation partner. What should drive the decision?',
        options: [
          'Buyer access, delivery complexity, trust requirements, compliance exposure, margin structure, and post-sale support needs.',
          'The route that has the lowest upfront cost, even if it weakens delivery and customer ownership.',
          'The route preferred by the first person who offers an introduction, regardless of sector fit or capability.',
          'The route used in the company’s home market because sales channels should stay identical globally.',
        ],
        correctIndex: 0,
        difficulty: 'MEDIUM',
        questionType: 'application',
        explanation: 'Channel choice must match the buyer journey and operating requirements.',
      },
      {
        question: 'A start-up receives enthusiastic comments at a conference but no named buyer, procurement path, or pilot budget. What is the best interpretation?',
        options: [
          'The interest is useful but not enough for entry; the team needs qualified discovery, decision criteria, and a pilot economics case.',
          'The comments prove product-market fit and justify immediate incorporation in three GCC countries.',
          'The team should stop all validation because conference feedback is more reliable than customer interviews.',
          'The company should grant exclusivity to the first local contact who praised the product.',
        ],
        correctIndex: 0,
        difficulty: 'MEDIUM',
        questionType: 'application',
        explanation: 'Signals must be qualified before commitment.',
      },
      {
        question: 'A company wants to sell to Saudi government-linked buyers. Which issue should be reviewed early in the entry thesis?',
        options: [
          'Local presence, procurement eligibility, regional headquarters implications, partner role, and Saudi-specific compliance requirements.',
          'Only the color palette of the marketing deck, because public-sector buying is mostly branding-driven.',
          'Whether UAE free-zone setup removes all Saudi procurement and localization questions.',
          'Whether a remote-only contract can avoid every local tax, licensing, and support consideration.',
        ],
        correctIndex: 0,
        difficulty: 'HARD',
        questionType: 'critical-thinking',
        explanation: 'Saudi public-sector and government-linked sales require early local-presence and procurement review.',
      },
    ],
  },
  {
    lessonId: `${COURSE_ID}_DAY_02`,
    dayNumber: 2,
    title: 'Culture, trust, and negotiation with GCC business owners',
    content: lesson2Content(),
    emailSubject: 'Day 2: Negotiate with trust and cultural intelligence',
    questions: [
      {
        question: 'A founder opens a first GCC buyer meeting by rushing through a 40-slide technical deck before greetings or context. What should change?',
        options: [
          'Start with relationship, respect, strategic relevance, and a concise executive story before moving into technical proof.',
          'Keep the technical deck first because personal rapport is unrelated to serious B2B decision-making.',
          'Skip introductions and ask for budget immediately so the buyer sees strong commercial discipline.',
          'Avoid senior participation because hierarchy rarely influences trust or decision quality.',
        ],
        correctIndex: 0,
        difficulty: 'MEDIUM',
        questionType: 'application',
        explanation: 'Trust and context usually need to precede detailed selling.',
      },
      {
        question: 'A buyer politely says the team will “study the proposal” and then becomes quiet. What is the best follow-up behavior?',
        options: [
          'Respectfully confirm decision criteria, next step, timeline, and any missing proof without forcing a public yes/no.',
          'Send daily pressure emails until the buyer gives a direct answer.',
          'Assume the deal is won because polite language always signals approval.',
          'Publicly challenge the buyer’s delay to show confidence and urgency.',
        ],
        correctIndex: 0,
        difficulty: 'MEDIUM',
        questionType: 'application',
        explanation: 'Indirect communication should be clarified respectfully.',
      },
      {
        question: 'A regional partner asks for exclusivity after one introductory meeting. What is the most professional response?',
        options: [
          'Ask for evidence of sector access, delivery capability, compliance standards, pipeline plan, and measurable performance before discussing exclusivity.',
          'Grant exclusivity quickly because any local partner is better than no local partner.',
          'Reject all partners because direct foreign sales always create more trust than local relationships.',
          'Offer exclusivity only if the partner agrees to remove procurement and compliance clauses from contracts.',
        ],
        correctIndex: 0,
        difficulty: 'HARD',
        questionType: 'critical-thinking',
        explanation: 'Exclusivity requires governance and proof, not just access promises.',
      },
      {
        question: 'A business owner negotiates hard on price after several warm meetings and meals. What does this most likely mean for the seller?',
        options: [
          'Hospitality and relationship-building do not remove commercial discipline; the seller should negotiate value, scope, support, and terms carefully.',
          'The buyer was dishonest because warm hospitality should prevent any price negotiation.',
          'The seller should accept every concession because relationship always matters more than margin.',
          'The deal is automatically lost because serious buyers never negotiate after trust is built.',
        ],
        correctIndex: 0,
        difficulty: 'HARD',
        questionType: 'critical-thinking',
        explanation: 'Warm relationship and tough negotiation can coexist.',
      },
      {
        question: 'A sales team wants to use the same aggressive deadline tactic it uses in its home market. What is the main GCC-specific risk?',
        options: [
          'Pressure tactics can damage trust, create loss of face, and reduce willingness to sponsor the seller internally.',
          'Deadline tactics always work better in relationship-led markets because buyers prefer public pressure.',
          'The only risk is that the discount may be too small, not that the relationship is harmed.',
          'There is no risk because negotiation culture is identical across all B2B markets.',
        ],
        correctIndex: 0,
        difficulty: 'MEDIUM',
        questionType: 'application',
        explanation: 'High-pressure behavior can undermine trust and sponsorship.',
      },
      {
        question: 'A technical evaluator likes the product but says senior leadership is not yet comfortable. What should the seller address?',
        options: [
          'Executive trust, strategic fit, local commitment, implementation risk, and proof that the company can support the region.',
          'Only the feature backlog, because senior leadership comfort is irrelevant if the technical team approves.',
          'Only the discount level, because leadership concerns always mean the price is too high.',
          'The evaluator’s competence, because a strong evaluator should be able to approve without leadership.',
        ],
        correctIndex: 0,
        difficulty: 'MEDIUM',
        questionType: 'application',
        explanation: 'Senior leadership may evaluate risk and relationship beyond product fit.',
      },
      {
        question: 'A company wants to improve GCC follow-up after meetings. Which follow-up is strongest?',
        options: [
          'A respectful summary of agreed needs, open questions, decision criteria, proposed next step, and support material tailored to the buyer.',
          'A generic global brochure and a one-line message asking whether the contract is signed.',
          'A public social-media tag thanking the buyer for a private commercial discussion.',
          'A message saying the offer expires immediately unless the buyer answers before the weekend.',
        ],
        correctIndex: 0,
        difficulty: 'MEDIUM',
        questionType: 'application',
        explanation: 'Good follow-up clarifies the process and preserves trust.',
      },
    ],
  },
  {
    lessonId: `${COURSE_ID}_DAY_03`,
    dayNumber: 3,
    title: 'Legal, partner, and go-to-market requirements',
    content: lesson3Content(),
    emailSubject: 'Day 3: Build the GCC entry requirements checklist',
    questions: [
      {
        question: 'A company begins selling a B2B product before checking whether its activity is licensed correctly in the target country. What is the main risk?',
        options: [
          'The sales motion may create contracting, invoicing, import, regulatory, or procurement problems that delay or block deals.',
          'There is no practical risk because licenses can always be corrected after the first customer signs.',
          'The only risk is marketing quality; licensing does not affect B2B sales or delivery.',
          'The company can avoid all local requirements by describing the product as a consulting service.',
        ],
        correctIndex: 0,
        difficulty: 'MEDIUM',
        questionType: 'application',
        explanation: 'Licensing and permitted activity should match the commercial model.',
      },
      {
        question: 'A foreign technology company is deciding between remote delivery, partner-led sales, free-zone setup, and onshore setup. What should guide the decision?',
        options: [
          'Target buyer, procurement route, support expectations, tax/invoicing needs, data/security obligations, and delivery model.',
          'Whichever option is fastest to register, even if it cannot support the buyer’s procurement or delivery needs.',
          'The option recommended by a single introducer who has not reviewed the product or customer segment.',
          'The structure used in another region, because entity strategy should be identical globally.',
        ],
        correctIndex: 0,
        difficulty: 'HARD',
        questionType: 'critical-thinking',
        explanation: 'Operating model must fit the sales and delivery reality.',
      },
      {
        question: 'A distributor offers access to several enterprise buyers but wants broad territory rights. What should be in the partner scorecard?',
        options: [
          'Sector access, credibility, delivery capability, compliance posture, commercial terms, reporting, conflict risk, and termination rules.',
          'Only the number of contacts in the distributor’s phone because access is the only partner capability that matters.',
          'Only the distributor’s requested margin, because governance and delivery can be solved after signing.',
          'Only whether the distributor speaks English, because language skill proves procurement capability.',
        ],
        correctIndex: 0,
        difficulty: 'MEDIUM',
        questionType: 'application',
        explanation: 'Partner selection must evaluate capability and governance, not just access.',
      },
      {
        question: 'A B2B SaaS company wants to sell into regulated sectors in the GCC. Which preparation is most important before a pilot?',
        options: [
          'Prepare a security, data, hosting, support, implementation, and compliance pack that answers local buyer and sector concerns.',
          'Prepare only a product-feature comparison because regulated buyers rarely ask about data or implementation risk.',
          'Avoid written security information so the buyer must rely on verbal reassurance.',
          'Offer a free pilot with no success criteria because pilots should be informal and easy to start.',
        ],
        correctIndex: 0,
        difficulty: 'MEDIUM',
        questionType: 'application',
        explanation: 'Regulated B2B buyers need risk and implementation evidence.',
      },
      {
        question: 'A company expects a local partner to handle every compliance, tax, support, and procurement issue without internal ownership. What is wrong with this plan?',
        options: [
          'A partner can support entry, but the company still owns strategy, compliance oversight, customer promises, and delivery quality.',
          'The plan is ideal because local partners legally absorb every responsibility for foreign suppliers.',
          'The only missing item is a higher commission rate, because more margin guarantees partner performance.',
          'The company should avoid all documentation so the partner has maximum flexibility.',
        ],
        correctIndex: 0,
        difficulty: 'HARD',
        questionType: 'critical-thinking',
        explanation: 'Partner-led entry still requires company governance and accountability.',
      },
      {
        question: 'A physical B2B product company wants to ship into the UAE. Which issue should be checked early?',
        options: [
          'Trade license, import documentation, customs, product standards, labeling, warranty, and the role of any free-zone or mainland entity.',
          'Only social-media demand, because import and documentation can be solved after goods arrive.',
          'Only whether the product has sold in Europe, because that automatically satisfies all GCC requirements.',
          'Only office rent, because an office address removes customs and product-compliance questions.',
        ],
        correctIndex: 0,
        difficulty: 'MEDIUM',
        questionType: 'application',
        explanation: 'Physical products require import and standards planning before shipment.',
      },
      {
        question: 'A 90-day GCC entry dashboard shows many meetings but no qualified buyer, partner validation, compliance answer, or pilot economics. What should leadership decide?',
        options: [
          'Pause or narrow the entry plan until evidence improves, because meeting volume alone does not justify expansion cost.',
          'Expand immediately because any meeting activity proves the market wants the product.',
          'Open entities in all six GCC states to create urgency and force demand to appear.',
          'Grant exclusive rights to the most enthusiastic contact to reduce internal workload.',
        ],
        correctIndex: 0,
        difficulty: 'HARD',
        questionType: 'critical-thinking',
        explanation: 'Go/no-go should be based on qualified evidence, not activity volume.',
      },
    ],
  },
];

async function main() {
  await connectDB();
  const brand = await Brand.findOne({ slug: 'amanoba' });
  if (!brand) throw new Error('Brand "amanoba" not found.');

  const course = await Course.findOneAndUpdate(
    { courseId: COURSE_ID },
    {
      $set: {
        courseId: COURSE_ID,
        name: 'Entering the GCC Market: B2B Introduction',
        description:
          'A practical three-day introduction for companies planning to enter GCC markets with B2B products or services. Covers market selection, cultural characteristics, negotiation behavior, local proof, partners, and key setup requirements.',
        language: 'en',
        thumbnail: THUMBNAIL,
        durationDays: 3,
        isActive: true,
        isDraft: false,
        requiresPremium: false,
        price: { amount: 0, currency: 'USD' },
        brandId: brand._id,
        pointsConfig: {
          completionPoints: 300,
          lessonPoints: 50,
          perfectCourseBonus: 150,
        },
        xpConfig: {
          completionXP: 150,
          lessonXP: 25,
        },
        metadata: {
          category: 'International Business',
          difficulty: 'beginner',
          estimatedHours: 3,
          tags: ['gcc', 'market-entry', 'b2b', 'negotiation', 'middle-east', 'international-business'],
          instructor: 'Amanoba Business Faculty',
          audience: 'B2B founders, exporters, sales leaders, partnership managers, and service companies evaluating GCC expansion.',
          updatedBy: 'seed-gcc-market-entry-2026-en',
        },
        discussionEnabled: false,
        leaderboardEnabled: false,
        studyGroupsEnabled: false,
        ccsId: COURSE_ID,
        lessonQuizPolicy: {
          enabled: true,
          required: true,
          questionCount: 5,
          shownAnswerCount: 3,
          successThreshold: 70,
        },
        quizMaxWrongAllowed: undefined,
        defaultLessonQuizQuestionCount: 5,
        certification: {
          enabled: true,
          certQuestionCount: 15,
          passThresholdPercent: 70,
          requireAllLessonsCompleted: true,
          requireAllQuizzesPassed: true,
          premiumIncludesCertification: true,
          templateId: 'default_v1',
          credentialTitleId: 'gcc_market_entry_b2b_intro',
        },
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true, omitUndefined: true }
  );

  await QuizQuestion.deleteMany({ courseId: course._id, isCourseSpecific: true });

  let lessonCount = 0;
  let questionCount = 0;
  for (const lesson of lessons) {
    await Lesson.findOneAndUpdate(
      { lessonId: lesson.lessonId },
      {
        $set: {
          lessonId: lesson.lessonId,
          courseId: course._id,
          dayNumber: lesson.dayNumber,
          language: 'en',
          title: lesson.title,
          content: lesson.content,
          emailSubject: lesson.emailSubject,
          emailBody: lesson.content,
          quizConfig: {
            enabled: true,
            successThreshold: 70,
            questionCount: 5,
            poolSize: lesson.questions.length,
            required: true,
          },
          unlockConditions: {
            requirePreviousLesson: lesson.dayNumber > 1,
            requireCourseStart: true,
          },
          pointsReward: 50,
          xpReward: 25,
          isActive: true,
          displayOrder: lesson.dayNumber,
          metadata: {
            estimatedMinutes: 45,
            difficulty: 'medium',
            tags: ['gcc', 'market-entry', 'b2b'],
            generatedBy: 'seed-gcc-market-entry-2026-en',
          },
          translations: new Map(),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    lessonCount++;

    await QuizQuestion.insertMany(
      lesson.questions.map((question, index) => ({
        uuid: randomUUID(),
        lessonId: lesson.lessonId,
        courseId: course._id,
        question: question.question,
        explanation: question.explanation,
        options: question.options,
        correctIndex: question.correctIndex,
        difficulty: question.difficulty,
        category: 'Course Specific',
        isCourseSpecific: true,
        questionType: question.questionType,
        hashtags: [
          '#gcc',
          '#market-entry',
          '#b2b',
          '#en',
          `#day${lesson.dayNumber}`,
          question.questionType === 'application' ? '#application' : '#critical-thinking',
        ],
        isActive: true,
        displayOrder: index + 1,
        showCount: 0,
        correctCount: 0,
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'seed-gcc-market-entry-2026-en',
        },
      }))
    );
    questionCount += lesson.questions.length;
  }

  console.log(`Seeded ${COURSE_ID}`);
  console.log(`Course: ${course.name}`);
  console.log(`Lessons: ${lessonCount}`);
  console.log(`Questions: ${questionCount}`);
  console.log(`Thumbnail: ${THUMBNAIL}`);
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  mongoose.disconnect().catch(() => undefined);
  process.exit(1);
});
