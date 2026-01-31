/**
 * Content-Based Question Generator
 *
 * Purpose: Generate questions by analyzing actual lesson content.
 * This avoids generic templates and creates context-rich, content-specific questions.
 *
 * Gold-standard (see docs/QUIZ_QUALITY_PIPELINE_PLAYBOOK.md): every question must be
 * standalone, grounded in the lesson, scenario-based, ask for a concrete deliverable/outcome,
 * and use concrete educational distractors (plausible domain mistakes, no generic filler).
 */

import { QuestionDifficulty, QuizQuestionType } from '../app/lib/models';

export interface ContentBasedQuestion {
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: QuestionDifficulty;
  category: string;
  questionType: QuizQuestionType;
  hashtags: string[];
}

function stableHash32(input: string) {
  // FNV-1a 32-bit
  let hash = 0x811c9dc5;
  const s = String(input || '');
  for (let i = 0; i < s.length; i++) {
    hash ^= s.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function pickUniqueFromPool(seed: string, pool: string[], count: number): string[] {
  const cleanPool = pool.map(s => String(s || '').trim()).filter(Boolean);
  if (count <= 0) return [];
  if (cleanPool.length <= count) return cleanPool.slice(0, count);

  const picked: string[] = [];
  const used = new Set<number>();
  let idx = stableHash32(seed) % cleanPool.length;
  // Use an odd step derived from seed to walk the pool deterministically.
  let step = (stableHash32(seed + '::step') % cleanPool.length) | 1;
  if (step % 2 === 0) step += 1;
  for (let guard = 0; guard < cleanPool.length * 3 && picked.length < count; guard++) {
    if (!used.has(idx)) {
      used.add(idx);
      picked.push(cleanPool[idx]);
    }
    idx = (idx + step) % cleanPool.length;
  }
  // Fallback (should rarely happen)
  for (let i = 0; i < cleanPool.length && picked.length < count; i++) {
    if (!used.has(i)) picked.push(cleanPool[i]);
  }
  return picked.slice(0, count);
}

function shuffleWithSeed<T>(items: T[], seed: string): T[] {
  const arr = items.slice();
  let state = stableHash32(seed) || 1;
  const rand = () => {
    // xorshift32
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0xffffffff;
  };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function normalizeOptionText(text: string) {
  return String(text || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function optionSignature(options: Array<string>) {
  return options.map(normalizeOptionText).sort().join('||');
}

function buildVariedOptions(params: {
  correct: string;
  distractorPool: string[];
  seed: string;
}): { options: [string, string, string, string]; correctIndex: 0 | 1 | 2 | 3 } {
  const distractors = pickUniqueFromPool(params.seed, params.distractorPool, 3);
  const base = [params.correct, ...distractors].map(s => String(s || '').trim()).filter(Boolean);
  const padded = base.length >= 4 ? base.slice(0, 4) : [...base, ...Array.from({ length: 4 - base.length }).map(() => params.correct)];
  return {
    // Important: keep correct answer at index 0; we shuffle later in the generator.
    options: [padded[0], padded[1], padded[2], padded[3]],
    correctIndex: 0,
  };
}

function shuffleOptionsWithCorrectIndex(params: {
  correct: string;
  options: [string, string, string, string];
  seed: string;
}): { options: [string, string, string, string]; correctIndex: 0 | 1 | 2 | 3 } {
  const base = params.options.map(s => String(s || '').trim());
  const correct = String(params.correct || '').trim();
  const shuffled = shuffleWithSeed(base, params.seed);
  const idx = Math.max(0, shuffled.findIndex(o => o === correct));
  return { options: [shuffled[0], shuffled[1], shuffled[2], shuffled[3]], correctIndex: idx as 0 | 1 | 2 | 3 };
}

function generateGeoShopify30Day7QuestionsEN(day: number, title: string, courseId: string): ContentBasedQuestion[] {
  const normalizedCourseId = String(courseId || '').toLowerCase();
  const baseTags = [`#day${day}`, '#en', ...(normalizedCourseId ? [`#course-${normalizedCourseId}`] : []), '#geo', '#shopify'];
  const tags = (type: QuizQuestionType, diff: QuestionDifficulty) => [
    ...baseTags,
    diff === QuestionDifficulty.HARD ? '#advanced' : '#intermediate',
    type === QuizQuestionType.APPLICATION ? '#application' : '#critical-thinking',
  ];

  const make = (p: {
    question: string;
    correct: string;
    distractors: [string, string, string];
    difficulty: QuestionDifficulty;
    questionType: QuizQuestionType;
    seed: string;
  }): ContentBasedQuestion => {
    const optionsRaw: [string, string, string, string] = [p.correct, ...p.distractors];
    const shuffled = shuffleOptionsWithCorrectIndex({ correct: p.correct, options: optionsRaw, seed: p.seed });
    return {
      question: p.question,
      options: shuffled.options,
      correctIndex: shuffled.correctIndex,
      difficulty: p.difficulty,
      category: 'Course Specific',
      questionType: p.questionType,
      hashtags: tags(p.questionType, p.difficulty),
    };
  };

  return [
    make({
      question:
        'You audit a Shopify store and notice two products are titled “Runner Pro” with no distinguishing attributes. What change most improves clarity for shoppers and AI systems?',
      correct:
        'Add the minimum distinguishing attributes into the title (e.g., model + gender/use-case + key material), so products are not ambiguous.',
      distractors: [
        'Keep titles short and move all distinguishing attributes to the bottom of the description to avoid clutter.',
        'Use vague marketing titles (“Best Runner Ever”) because they are easier to remember than attributes.',
        'Rely on product images only; titles do not matter for structured understanding or recommendations.',
      ],
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      seed: `${courseId}::day7::title-clarity`,
    }),
    make({
      question:
        'A product has variants labeled “Blue / Size M / Pack of 2” as a single option value. What is the best fix for variant clarity?',
      correct:
        'Split attributes into separate option dimensions (e.g., Color, Size, Pack size) so each variant is consistent and unambiguous.',
      distractors: [
        'Add more mixed strings per option value so every detail is visible in one place.',
        'Remove variants entirely and force customers to choose via the description text.',
        'Keep the mixed label but shorten it; mixing attributes is fine as long as the text is shorter.',
      ],
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      seed: `${courseId}::day7::variant-structure`,
    }),
    make({
      question:
        'While auditing identifiers, you find SKUs missing for many variants. What is the most measurable next step to reduce future duplication and tracking errors?',
      correct:
        'Define SKU coverage as a metric and fill SKUs for every variant, prioritizing best-selling products first until coverage reaches 100%.',
      distractors: [
        'Fill SKUs only for new products going forward; past variants can remain blank without impact.',
        'Use the same SKU for all variants to keep the catalog simpler and reduce maintenance.',
        'Skip SKUs and rely on product titles as identifiers; titles are unique enough for operations.',
      ],
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      seed: `${courseId}::day7::sku-coverage`,
    }),
    make({
      question:
        'You want to measure “description usefulness” for a product audit. Which criterion is most aligned with a measurable check?',
      correct:
        'Verify the first 3–5 lines contain key specs and decision info (materials, dimensions, compatibility, constraints) rather than only marketing copy.',
      distractors: [
        'Count total words and ensure the description is long enough; longer always means more useful.',
        'Ensure the description includes at least three adjectives; vivid language is the best proxy for usefulness.',
        'Place policies and shipping information first; product specs can be omitted to keep it short.',
      ],
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      seed: `${courseId}::day7::description-top`,
    }),
    make({
      question:
        'During an audit you see GTIN is missing. Which action best balances correctness and practicality?',
      correct:
        'Fill GTIN where it genuinely exists for the product/variant, and track GTIN coverage separately from SKU coverage.',
      distractors: [
        'Generate random GTIN values so every variant has a number and looks complete.',
        'Copy one GTIN across all variants because the product is “basically the same”.',
        'Ignore GTIN entirely because it has no impact on any downstream commerce system.',
      ],
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      seed: `${courseId}::day7::gtin`,
    }),
    make({
      question:
        'A team optimizes product data by increasing the number of edited fields per day, but customer confusion and returns rise. What is the most likely failure mode?',
      correct:
        'They optimized “busy output” (activity) instead of clarity metrics (ambiguity reduction, SKU/GTIN coverage, variant consistency).',
      distractors: [
        'Editing more fields always improves outcomes; the returns increase must be unrelated to data quality.',
        'More edits mean better SEO, so customer confusion is expected and cannot be reduced by data changes.',
        'The only real issue is speed; if edits were faster, clarity would automatically improve.',
      ],
      difficulty: QuestionDifficulty.HARD,
      questionType: QuizQuestionType.CRITICAL_THINKING,
      seed: `${courseId}::day7::busy-output`,
    }),
    make({
      question:
        'You run a product data audit, but you never compute SKU/GTIN coverage or count ambiguous titles. What is the typical consequence?',
      correct:
        'You can’t verify improvement, so fixes drift into subjective edits and the same issues reappear across the catalog.',
      distractors: [
        'Metrics are unnecessary because the team can “feel” whether product data is clean after editing.',
        'Not measuring reduces bias, so the audit becomes more accurate and consistent over time.',
        'Skipping metrics speeds up work and guarantees outcomes because the team touches more items per day.',
      ],
      difficulty: QuestionDifficulty.HARD,
      questionType: QuizQuestionType.CRITICAL_THINKING,
      seed: `${courseId}::day7::no-metrics`,
    }),
    make({
      question:
        'You want fast feedback from a catalog audit. Which plan best creates a tight loop of measure → fix → verify?',
      correct:
        'Audit 10 products, compute coverage/ambiguity counts, fix the top recurring issue type, then re-check the same sample after the change.',
      distractors: [
        'Audit all products first without metrics, then fix everything at once and assume the changes worked.',
        'Fix one product fully and never look for recurring patterns, because every product is unique.',
        'Only update descriptions (marketing copy) and skip variants and identifiers to avoid operational work.',
      ],
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      seed: `${courseId}::day7::feedback-loop`,
    }),
    make({
      question:
        'A product title includes key attributes, but the variant labels are inconsistent and unclear. What is the most likely impact on recommendations and fulfillment?',
      correct:
        'Recommendations may be wrong and fulfillment errors rise because the purchasable options are ambiguous and hard to match to what the customer expects.',
      distractors: [
        'Titles alone fully determine recommendations and fulfillment, so variant clarity does not matter.',
        'Variant clarity only affects design aesthetics; operations and recommendations remain accurate.',
        'Inconsistent variants improve discovery because the store shows more unique strings to search systems.',
      ],
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      seed: `${courseId}::day7::variant-impact`,
    }),
  ];
}

function generateGeoShopify30Day2QuestionsEN(day: number, title: string, courseId: string): ContentBasedQuestion[] {
  const normalizedCourseId = String(courseId || '').toLowerCase();
  const baseTags = [`#day${day}`, '#en', ...(normalizedCourseId ? [`#course-${normalizedCourseId}`] : []), '#geo', '#shopify'];
  const tags = (type: QuizQuestionType, diff: QuestionDifficulty) => [
    ...baseTags,
    diff === QuestionDifficulty.HARD ? '#advanced' : '#intermediate',
    type === QuizQuestionType.APPLICATION ? '#application' : '#critical-thinking',
  ];

  const make = (p: {
    question: string;
    correct: string;
    distractors: [string, string, string];
    difficulty: QuestionDifficulty;
    questionType: QuizQuestionType;
    seed: string;
  }): ContentBasedQuestion => {
    const optionsRaw: [string, string, string, string] = [p.correct, ...p.distractors];
    const shuffled = shuffleOptionsWithCorrectIndex({ correct: p.correct, options: optionsRaw, seed: p.seed });
    return {
      question: p.question,
      options: shuffled.options,
      correctIndex: shuffled.correctIndex,
      difficulty: p.difficulty,
      category: 'Course Specific',
      questionType: p.questionType,
      hashtags: tags(p.questionType, p.difficulty),
    };
  };

  return [
    make({
      question:
        'On a Shopify product page, which element is the most GEO-first (helps AI answers summarize correctly) rather than SEO-first?',
      correct:
        'Accurate, plainly rendered product facts (price, stock, SKU/GTIN) visible near the top of the page.',
      distractors: [
        'Tuning meta title length and keyword density for the HTML head tags only.',
        'Adding more backlinks from unrelated sites to increase domain authority.',
        'Writing a long blog-style paragraph before showing the product facts and options.',
      ],
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      seed: `${courseId}::day2::geo-first-facts`,
    }),
    make({
      question:
        'A merchant has strong SEO (speed, canonical tags, internal links) but AI answers still omit key product info. What is the most likely missing GEO-first piece?',
      correct:
        'A short, answer-ready summary block (answer capsule) plus verifiable product facts and policies that can be quoted.',
      distractors: [
        'More long-form content on the homepage; product pages do not matter for generative answers.',
        'More keyword repetition in meta descriptions; facts and policies are optional for AI answers.',
        'Removing all structured data; AI systems only use plain text and ignore machine-readable signals.',
      ],
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      seed: `${courseId}::day2::answer-capsule`,
    }),
    make({
      question:
        'You create a 10-point GEO checklist for a product detail page. Which check is the clearest “verifiable policy” item?',
      correct:
        'Shipping and returns policy is easy to find, specific (time/conditions), and linked from the product page with a stable URL.',
      distractors: [
        'A vague claim like “fast shipping” with no timeframe, conditions, or policy page.',
        'A policy hidden in an image or PDF that changes URL frequently and is hard to quote.',
        'Only a discount banner; no policy details because it “hurts conversions”.',
      ],
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      seed: `${courseId}::day2::policy-verifiable`,
    }),
    make({
      question:
        'During a GEO audit, you find product facts exist but are scattered and inconsistent across variants. What is the best fix to improve quotability?',
      correct:
        'Make facts consistent per variant (IDs, price, stock) and present them clearly in one place near the purchase decision area.',
      distractors: [
        'Move facts deeper into long marketing copy so they are “discoverable” for humans who read everything.',
        'Replace all facts with lifestyle storytelling; AI can infer price and stock from context.',
        'Hide identifiers because they look technical; only brand adjectives should remain visible.',
      ],
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      seed: `${courseId}::day2::variant-consistency`,
    }),
    make({
      question:
        'Which item is most SEO-first (classic SEO) rather than GEO-first on Shopify?',
      correct:
        'Meta title/description tuning and internal link structure for crawling and ranking signals.',
      distractors: [
        'Displaying SKU/GTIN and stock status clearly so AI can quote product facts.',
        'Adding an answer capsule with the key product facts near the top of the page.',
        'Linking shipping/returns policies with stable URLs so claims are verifiable.',
      ],
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      seed: `${courseId}::day2::seo-first`,
    }),
    make({
      question:
        'A team says: “GEO is ranking, so we should chase keywords harder.” What is the most accurate correction?',
      correct:
        'GEO is primarily about clarity and quotability of facts/policies so AI can summarize correctly; it complements SEO but is not the same as ranking.',
      distractors: [
        'GEO replaces SEO entirely; rankings do not matter if you have an answer capsule.',
        'GEO is only about backlinks; product facts and policies do not affect AI answers.',
        'GEO is just page speed; if the site is fast, AI will always quote the right details.',
      ],
      difficulty: QuestionDifficulty.HARD,
      questionType: QuizQuestionType.CRITICAL_THINKING,
      seed: `${courseId}::day2::geo-not-ranking`,
    }),
    make({
      question:
        'You build a GEO checklist but never apply it to a real product page or mark “OK vs missing”. What typically happens?',
      correct:
        'It becomes documentation without feedback; gaps persist because there is no concrete audit loop to turn checks into fixes.',
      distractors: [
        'The checklist still guarantees improvement because writing it changes outcomes automatically.',
        'Applying the checklist is unnecessary; once created, AI systems will “figure it out”.',
        'Marking OK vs missing is optional because subjective judgment is more reliable than checks.',
      ],
      difficulty: QuestionDifficulty.HARD,
      questionType: QuizQuestionType.CRITICAL_THINKING,
      seed: `${courseId}::day2::checklist-without-application`,
    }),
    make({
      question:
        'When comparing SEO-first vs GEO-first work, what is the most useful way to think about them?',
      correct:
        'SEO-first improves discovery and ranking signals; GEO-first improves the clarity, completeness, and quotability of product facts and policies for AI answers.',
      distractors: [
        'SEO-first is only for blogs and GEO-first is only for homepages; product pages are unaffected.',
        'SEO-first and GEO-first are identical; you should do only one checklist to cover both.',
        'GEO-first is only about adding more text; facts and identifiers are secondary.',
      ],
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      seed: `${courseId}::day2::complement`,
    }),
  ];
}

function generateGeoShopify30Day3QuestionsEN(day: number, title: string, courseId: string): ContentBasedQuestion[] {
  const normalizedCourseId = String(courseId || '').toLowerCase();
  const baseTags = [`#day${day}`, '#en', ...(normalizedCourseId ? [`#course-${normalizedCourseId}`] : []), '#geo', '#shopify'];
  const tags = (type: QuizQuestionType, diff: QuestionDifficulty) => [
    ...baseTags,
    diff === QuestionDifficulty.HARD ? '#advanced' : '#intermediate',
    type === QuizQuestionType.APPLICATION ? '#application' : '#critical-thinking',
  ];

  const make = (p: {
    question: string;
    correct: string;
    distractors: [string, string, string];
    difficulty: QuestionDifficulty;
    questionType: QuizQuestionType;
    seed: string;
  }): ContentBasedQuestion => {
    const optionsRaw: [string, string, string, string] = [p.correct, ...p.distractors];
    const shuffled = shuffleOptionsWithCorrectIndex({ correct: p.correct, options: optionsRaw, seed: p.seed });
    return {
      question: p.question,
      options: shuffled.options,
      correctIndex: shuffled.correctIndex,
      difficulty: p.difficulty,
      category: 'Course Specific',
      questionType: p.questionType,
      hashtags: tags(p.questionType, p.difficulty),
    };
  };

  return [
    make({
      question:
        'A shopper asks a generative system: “Which running shoes are best for flat feet under $120?” According to the new buying journey, what happens before they click a store?',
      correct:
        'They often see an AI summary/recommendation first, then click later with clearer intent based on the summarized facts.',
      distractors: [
        'They always see a classic search results list first and only then get AI help after purchase.',
        'They must click a store before any summary exists; AI cannot recommend without opening product pages.',
        'They skip summaries entirely and decide only from ad copy in the first result.',
      ],
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      seed: `${courseId}::day3::new-journey`,
    }),
    make({
      question:
        'You add an “answer capsule” at the top of a Shopify product page. Which capsule content is most aligned with the lesson?',
      correct:
        'Who it is for / who it is not for, pros/cons, price and stock status, plus a clear link to shipping/returns policy.',
      distractors: [
        'A long brand story paragraph and a newsletter signup; price and policy can stay lower on the page.',
        'Only a list of SEO keywords and internal links; shoppers can infer policies elsewhere.',
        'A gallery of lifestyle images with no text; AI prefers images over facts.',
      ],
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      seed: `${courseId}::day3::capsule-contents`,
    }),
    make({
      question:
        'Why does the lesson warn that short answers can magnify wrong price/stock/policy information?',
      correct:
        'Because AI summaries may quote a few key facts; if those facts are wrong or missing, the user’s decision is misled at high leverage.',
      distractors: [
        'Because longer pages automatically rank better, so short answers reduce SEO rankings no matter what.',
        'Because policies never affect buying decisions; only images matter in generative answers.',
        'Because AI systems refuse to show any product unless the description is extremely long.',
      ],
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      seed: `${courseId}::day3::magnify`,
    }),
    make({
      question:
        'You are mapping AI touchpoints for your store. Which set best matches the lesson’s examples of touchpoint questions?',
      correct:
        'Sizing, shipping, returns, best-for use cases, and alternatives/comparisons.',
      distractors: [
        'Company history, investor deck, employee bios, office location, and press mentions.',
        'Only discount codes and slogans; informational questions do not appear in AI journeys.',
        'Random trivia about the category; shoppers do not ask practical questions.',
      ],
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      seed: `${courseId}::day3::touchpoints`,
    }),
    make({
      question:
        'A product page has long unstructured copy and missing policy links. In the new journey, what is the most likely outcome?',
      correct:
        'AI summaries struggle to quote verifiable details, so the store is less likely to be included or the summary may omit crucial info.',
      distractors: [
        'The page always performs better because long text guarantees clear recommendations.',
        'Policy links reduce trust, so hiding them increases inclusion in AI answers.',
        'Unstructured copy has no downside because AI ignores product pages and uses only ads.',
      ],
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      seed: `${courseId}::day3::poor-page`,
    }),
    make({
      question:
        'A team says: “We’ll focus on ranking first; answer capsules can wait.” Under the new journey, what is the key risk of this plan?',
      correct:
        'Users may form a decision from an AI summary before clicking; without clear, quotable facts/policies, you lose attention even if you rank well.',
      distractors: [
        'Answer capsules reduce SEO so much that rankings collapse immediately; never add them.',
        'AI summaries only appear after checkout, so delaying capsules has no effect on discovery or intent.',
        'GEO is only about backlinks; page structure and policies do not affect summaries.',
      ],
      difficulty: QuestionDifficulty.HARD,
      questionType: QuizQuestionType.CRITICAL_THINKING,
      seed: `${courseId}::day3::risk-delay`,
    }),
    make({
      question:
        'You draft an answer capsule but it omits “who it’s not for” and downsides. What is the most likely downside in AI-driven recommendations?',
      correct:
        'The summary becomes one-sided, increasing mismatched purchases and returns because constraints and trade-offs are not made explicit.',
      distractors: [
        'Omitting downsides always increases trust; trade-offs should never be mentioned.',
        'AI systems prefer only positive claims; including constraints prevents the product from being shown.',
        'Who-not-for details only matter for SEO keywords and do not affect buying decisions.',
      ],
      difficulty: QuestionDifficulty.HARD,
      questionType: QuizQuestionType.CRITICAL_THINKING,
      seed: `${courseId}::day3::who-not-for`,
    }),
  ];
}

function generateGeoShopify30Day4QuestionsEN(day: number, title: string, courseId: string): ContentBasedQuestion[] {
  const normalizedCourseId = String(courseId || '').toLowerCase();
  const baseTags = [`#day${day}`, '#en', ...(normalizedCourseId ? [`#course-${normalizedCourseId}`] : []), '#geo', '#shopify'];
  const tags = (type: QuizQuestionType, diff: QuestionDifficulty) => [
    ...baseTags,
    diff === QuestionDifficulty.HARD ? '#advanced' : '#intermediate',
    type === QuizQuestionType.APPLICATION ? '#application' : '#critical-thinking',
  ];

  const make = (p: {
    question: string;
    correct: string;
    distractors: [string, string, string];
    difficulty: QuestionDifficulty;
    questionType: QuizQuestionType;
    seed: string;
  }): ContentBasedQuestion => {
    const optionsRaw: [string, string, string, string] = [p.correct, ...p.distractors];
    const shuffled = shuffleOptionsWithCorrectIndex({ correct: p.correct, options: optionsRaw, seed: p.seed });
    return {
      question: p.question,
      options: shuffled.options,
      correctIndex: shuffled.correctIndex,
      difficulty: p.difficulty,
      category: 'Course Specific',
      questionType: p.questionType,
      hashtags: tags(p.questionType, p.difficulty),
    };
  };

  return [
    make({
      question:
        'A customer sees an AI answer recommending your product and asks for a quick summary. In this lesson, what is the primary goal of “sell in chat”?',
      correct:
        'Influence the choice with a clear, accurate summary (who it’s for, trade-offs, facts), while the transaction/checkout happens on your site.',
      distractors: [
        'Complete payment inside the AI chat; the storefront checkout is secondary.',
        'Avoid mentioning facts like price/stock/policies because they reduce conversions.',
        'Use only hype (“best product!”) because AI surfaces rank enthusiasm above clarity.',
      ],
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      seed: `${courseId}::day4::goal`,
    }),
    make({
      question:
        'Which statement best distinguishes “influence” from “transaction” in an AI-driven buying flow?',
      correct:
        'Influence happens in summaries/comparisons that sway intent; transaction happens at storefront checkout where price/stock/policies must be correct.',
      distractors: [
        'Influence is only SEO metadata; transaction is only backlinks and page speed.',
        'Influence is the payment step; transaction is the recommendation step.',
        'Influence and transaction are the same; accuracy is optional as long as messaging is persuasive.',
      ],
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      seed: `${courseId}::day4::distinguish`,
    }),
    make({
      question:
        'You draft a 3–4 line “sell in chat” snippet for one product. Which version best matches the lesson’s “good” example structure?',
      correct:
        'Ideal for [who], not for [who not]; price [x], in stock; shipping 3–5 days; free returns 30 days (or your real policy).',
      distractors: [
        'Best product ever! Everyone loves it. Buy now. Limited time only.',
        'High-quality and stylish. Great for everyone. Shipping details available somewhere on the site.',
        'We have amazing customer service. Prices vary. Returns depend on many factors.',
      ],
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      seed: `${courseId}::day4::snippet`,
    }),
    make({
      question:
        'Why does the lesson say wrong price/stock/shipping in an AI answer hurts conversion and support?',
      correct:
        'Because it sets incorrect expectations; users arrive with mismatched intent and create failed checkouts, extra tickets, and trust loss.',
      distractors: [
        'Because policy accuracy only affects SEO rankings, not customer decisions or support volume.',
        'Because users never read summaries; only the checkout page affects expectations.',
        'Because inaccurate details increase curiosity and therefore always boost conversions.',
      ],
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      seed: `${courseId}::day4::wrong-info`,
    }),
    make({
      question:
        'You need to write 5 statements/policies that an AI must quote correctly. Which list is most aligned with the lesson?',
      correct:
        'Price, stock status, shipping timeframe/conditions, returns rules, and warranty terms (as applicable).',
      distractors: [
        'Brand mission, founder story, office location, and fun facts; policies are not important.',
        'Only discount codes and slogans; stock and returns can be handled later by support.',
        'Competitor gossip and marketing adjectives; accuracy of policy details is optional.',
      ],
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      seed: `${courseId}::day4::five-statements`,
    }),
    make({
      question:
        'A team tries to “sell in chat” but omits who-not-for and trade-offs to stay positive. What is the most likely consequence?',
      correct:
        'More mismatched buyers and returns because constraints are hidden; support load rises and trust drops when reality differs from the summary.',
      distractors: [
        'Fewer returns because positive messaging always attracts the right customers automatically.',
        'Higher rankings because AI systems reward one-sided claims with no caveats.',
        'It only changes tone, not outcomes, because buyers decide exclusively at checkout and ignore summaries.',
      ],
      difficulty: QuestionDifficulty.HARD,
      questionType: QuizQuestionType.CRITICAL_THINKING,
      seed: `${courseId}::day4::omit-tradeoffs`,
    }),
    make({
      question:
        'The lesson notes merchant programs can depend on region/eligibility. What is the best implication for snippets and policies?',
      correct:
        'Avoid absolute claims; make eligibility and regional constraints explicit and link to a stable policy/terms page that can be verified.',
      distractors: [
        'Always claim universal availability; constraints confuse buyers and reduce conversion.',
        'Never mention policies; the AI will infer eligibility correctly without explicit terms.',
        'Use different claims for each chat without documentation so it feels personalized.',
      ],
      difficulty: QuestionDifficulty.HARD,
      questionType: QuizQuestionType.CRITICAL_THINKING,
      seed: `${courseId}::day4::eligibility`,
    }),
  ];
}

function generateGeoShopify30Day5QuestionsEN(day: number, title: string, courseId: string): ContentBasedQuestion[] {
  const normalizedCourseId = String(courseId || '').toLowerCase();
  const baseTags = [`#day${day}`, '#en', ...(normalizedCourseId ? [`#course-${normalizedCourseId}`] : []), '#geo', '#shopify'];
  const tags = (type: QuizQuestionType, diff: QuestionDifficulty) => [
    ...baseTags,
    diff === QuestionDifficulty.HARD ? '#advanced' : '#intermediate',
    type === QuizQuestionType.APPLICATION ? '#application' : '#critical-thinking',
  ];

  const make = (p: {
    question: string;
    correct: string;
    distractors: [string, string, string];
    difficulty: QuestionDifficulty;
    questionType: QuizQuestionType;
    seed: string;
  }): ContentBasedQuestion => {
    const optionsRaw: [string, string, string, string] = [p.correct, ...p.distractors];
    const shuffled = shuffleOptionsWithCorrectIndex({ correct: p.correct, options: optionsRaw, seed: p.seed });
    return {
      question: p.question,
      options: shuffled.options,
      correctIndex: shuffled.correctIndex,
      difficulty: p.difficulty,
      category: 'Course Specific',
      questionType: p.questionType,
      hashtags: tags(p.questionType, p.difficulty),
    };
  };

  return [
    make({
      question:
        'You compare ChatGPT, Copilot, and Google AI surfaces for shopping. What is the best “platform map” deliverable from this lesson?',
      correct:
        'A 1-page summary listing each platform’s requirements, region/program constraints, and concrete actions (data, policy, URL/schema) for your store.',
      distractors: [
        'A long blog post about AI history; platform requirements do not affect shopping surfaces.',
        'A single SEO checklist; the three platforms behave identically so one list is enough.',
        'A list of competitor ads; platform constraints can be ignored if you spend more on marketing.',
      ],
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      seed: `${courseId}::day5::deliverable`,
    }),
    make({
      question:
        'A merchant program is available only in certain regions. What is the most practical implication for your rollout plan?',
      correct:
        'Treat eligibility as a constraint: map region/program status per platform and prioritize the platform you are closest to meeting in your region.',
      distractors: [
        'Assume all platforms work in all regions; ignore constraints and focus only on brand messaging.',
        'Pick platforms based only on personal preference; region rules do not affect access.',
        'Delay all work until every platform is available everywhere; otherwise it is not worth improving data.',
      ],
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      seed: `${courseId}::day5::region`,
    }),
    make({
      question:
        'Which set best matches the lesson’s “keys” for the three platforms?',
      correct:
        'ChatGPT: accurate data + quotability; Copilot: feed quality + policy clarity; Google AI: product data + schema + policy.',
      distractors: [
        'All three: only backlinks and meta keywords; product facts and policies are optional.',
        'ChatGPT: only images; Copilot: only reviews; Google AI: only slogans; data fields do not matter.',
        'ChatGPT: speed only; Copilot: speed only; Google AI: speed only; the rest is irrelevant.',
      ],
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      seed: `${courseId}::day5::keys`,
    }),
    make({
      question:
        'Your store shows conflicting prices across surfaces (PDP vs feed vs summary). According to the lesson’s example, what is the best fix?',
      correct:
        'Make price/stock/policy uniform and consistent everywhere, with a stable feed and clean schema so summaries quote the same facts.',
      distractors: [
        'Keep conflicts; different prices per surface increase conversions by letting AI pick the cheapest.',
        'Hide prices and stock entirely; facts confuse AI answers so it is better to be vague.',
        'Only update the homepage meta tags; price conflicts on product pages do not affect shopping surfaces.',
      ],
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      seed: `${courseId}::day5::conflicts`,
    }),
    make({
      question:
        'You choose one platform and write three concrete tasks for it. Which task list best matches the lesson’s examples?',
      correct:
        'Run a GTIN/SKU check, refresh a clear policy block/link, and add an answer capsule to the product page.',
      distractors: [
        'Rewrite your brand slogan, change your logo colors, and add more emojis to product titles.',
        'Delete structured data, remove policies from pages, and hide identifiers to keep pages “clean”.',
        'Focus only on backlinks and ignore product data fields, because feeds are never used in shopping answers.',
      ],
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      seed: `${courseId}::day5::three-tasks`,
    }),
    make({
      question:
        'A team tries to “optimize for one platform” by using different prices/policies per surface. What is the most likely failure mode?',
      correct:
        'Inconsistent facts reduce trust and quotability; AI answers may cite conflicting details, increasing support load and hurting conversion.',
      distractors: [
        'Inconsistency increases personalization and always improves outcomes; accuracy is secondary.',
        'Different policies per platform are invisible to users, so there is no risk of confusion.',
        'Only SEO rankings are affected; customer support and conversions are unrelated to policy accuracy.',
      ],
      difficulty: QuestionDifficulty.HARD,
      questionType: QuizQuestionType.CRITICAL_THINKING,
      seed: `${courseId}::day5::inconsistent`,
    }),
    make({
      question:
        'Why does the lesson emphasize “content expectations differ” across platforms?',
      correct:
        'Because some surfaces rely heavily on structured data/schema, others on feed quality or policy clarity; you must meet the right expectations to be included accurately.',
      distractors: [
        'Because content never matters; only advertising budgets determine whether you show up.',
        'Because platforms require completely different products; your catalog cannot be reused.',
        'Because structured data is forbidden; plain text only is allowed everywhere.',
      ],
      difficulty: QuestionDifficulty.HARD,
      questionType: QuizQuestionType.CRITICAL_THINKING,
      seed: `${courseId}::day5::expectations`,
    }),
  ];
}

function generateGeoShopify30Day6QuestionsEN(day: number, title: string, courseId: string): ContentBasedQuestion[] {
  const normalizedCourseId = String(courseId || '').toLowerCase();
  const baseTags = [`#day${day}`, '#en', ...(normalizedCourseId ? [`#course-${normalizedCourseId}`] : []), '#geo', '#shopify'];
  const tags = (type: QuizQuestionType, diff: QuestionDifficulty) => [
    ...baseTags,
    diff === QuestionDifficulty.HARD ? '#advanced' : '#intermediate',
    type === QuizQuestionType.APPLICATION ? '#application' : '#critical-thinking',
  ];

  const make = (p: {
    question: string;
    correct: string;
    distractors: [string, string, string];
    difficulty: QuestionDifficulty;
    questionType: QuizQuestionType;
    seed: string;
  }): ContentBasedQuestion => {
    const optionsRaw: [string, string, string, string] = [p.correct, ...p.distractors];
    const shuffled = shuffleOptionsWithCorrectIndex({ correct: p.correct, options: optionsRaw, seed: p.seed });
    return {
      question: p.question,
      options: shuffled.options,
      correctIndex: shuffled.correctIndex,
      difficulty: p.difficulty,
      category: 'Course Specific',
      questionType: p.questionType,
      hashtags: tags(p.questionType, p.difficulty),
    };
  };

  return [
    make({
      question:
        'You want to measure GEO progress over time. What is the best definition of a “prompt set” from this lesson?',
      correct:
        'A 30–50 question test set across categories (best, vs, alternatives, policy, sizing/shipping) used repeatedly to check inclusion/citation/coverage/consistency.',
      distractors: [
        'A single generic question you ask once; if the answer looks good, the work is done.',
        'A list of marketing slogans; measurement is unnecessary if the copy sounds persuasive.',
        'Only a single “best product” query; comparisons, policies, and sizing are irrelevant.',
      ],
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      seed: `${courseId}::day6::prompt-set`,
    }),
    make({
      question:
        'Which set best matches the GEO KPIs the lesson suggests tracking weekly?',
      correct:
        'Inclusion, citation, coverage, and consistency (tracked weekly on your prompt set).',
      distractors: [
        'Only total word count of product descriptions and number of blog posts published.',
        'Only backlinks and domain authority; inclusion and citation do not matter for GEO.',
        'Only average order value; GEO cannot be measured directly.',
      ],
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      seed: `${courseId}::day6::geo-kpis`,
    }),
    make({
      question:
        'You also need commercial impact KPIs. Which list matches the lesson?',
      correct:
        'AI referral traffic, conversion, add-to-cart rate, and returns (alongside GEO KPIs).',
      distractors: [
        'Logo recognition, brand “vibes”, and number of adjectives in the answer capsule.',
        'Only inventory count; conversion and returns are unrelated to AI summaries.',
        'Only time on site; add-to-cart and returns are not measurable outcomes.',
      ],
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      seed: `${courseId}::day6::commercial-kpis`,
    }),
    make({
      question:
        'You build the prompt table. Which column set best matches the guided exercise structure?',
      correct:
        'Prompt | Type (best/vs/policy) | Expected inclusion/citation | Notes (and later: results).',
      distractors: [
        'Prompt | Emoji score | Brand adjectives | “Feels premium” rating.',
        'Prompt | Meta keywords | Backlink target | Generic confidence score only.',
        'Prompt | Product photos | Social likes | Founder story rating.',
      ],
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      seed: `${courseId}::day6::table`,
    }),
    make({
      question:
        'A team has only 5 generic questions and no metrics. According to the lesson’s examples, what is the most likely problem?',
      correct:
        'They cannot detect improvement or regressions; the set is too small and unstructured to measure inclusion/citation and drive iteration.',
      distractors: [
        'Five questions are always enough; adding categories and metrics only slows execution.',
        'Metrics are harmful because they reduce creativity; GEO cannot be improved systematically.',
        'Generic questions are better than specific ones because they cover every product equally well.',
      ],
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      seed: `${courseId}::day6::poor-example`,
    }),
    make({
      question:
        'A team tracks conversion but not inclusion/citation/consistency. What is the typical failure mode?',
      correct:
        'They won’t know whether changes affect AI answers (visibility/accuracy), so commercial swings are hard to attribute and the iteration loop breaks.',
      distractors: [
        'Commercial KPIs automatically imply inclusion and citation, so GEO KPIs are redundant.',
        'Inclusion and citation are subjective, so tracking them always produces worse outcomes.',
        'Tracking fewer metrics always improves decision quality because there is less data.',
      ],
      difficulty: QuestionDifficulty.HARD,
      questionType: QuizQuestionType.CRITICAL_THINKING,
      seed: `${courseId}::day6::missing-geo-kpis`,
    }),
    make({
      question:
        'You expand the prompt set to 30–50 and add A/B/C priorities. Why is prioritization important?',
      correct:
        'It focuses measurement and fixes on the highest-value queries first (best/vs/policy) so progress is visible and actionable week to week.',
      distractors: [
        'Prioritization is only cosmetic; all prompts are equally important and should be handled randomly.',
        'Priorities should follow personal preference only; commercial value and risk do not matter.',
        'Prioritization replaces measurement; once A/B/C is set, you can stop tracking KPIs.',
      ],
      difficulty: QuestionDifficulty.HARD,
      questionType: QuizQuestionType.CRITICAL_THINKING,
      seed: `${courseId}::day6::priorities`,
    }),
  ];
}

function generateGeoShopify30Day8QuestionsEN(day: number, title: string, courseId: string): ContentBasedQuestion[] {
  const normalizedCourseId = String(courseId || '').toLowerCase();
  const baseTags = [`#day${day}`, '#en', ...(normalizedCourseId ? [`#course-${normalizedCourseId}`] : []), '#geo', '#shopify'];
  const tags = (type: QuizQuestionType, diff: QuestionDifficulty) => [
    ...baseTags,
    diff === QuestionDifficulty.HARD ? '#advanced' : '#intermediate',
    type === QuizQuestionType.APPLICATION ? '#application' : '#critical-thinking',
  ];

  const make = (p: {
    question: string;
    correct: string;
    distractors: [string, string, string];
    difficulty: QuestionDifficulty;
    questionType: QuizQuestionType;
    seed: string;
  }): ContentBasedQuestion => {
    const optionsRaw: [string, string, string, string] = [p.correct, ...p.distractors];
    const shuffled = shuffleOptionsWithCorrectIndex({ correct: p.correct, options: optionsRaw, seed: p.seed });
    return {
      question: p.question,
      options: shuffled.options,
      correctIndex: shuffled.correctIndex,
      difficulty: p.difficulty,
      category: 'Course Specific',
      questionType: p.questionType,
      hashtags: tags(p.questionType, p.difficulty),
    };
  };

  return [
    make({
      question:
        'You audit a product offer and want “offer truth” between feed and PDP. Which set of fields must match most directly according to the lesson?',
      correct:
        'Price, stock/availability, policy links (shipping/returns), and identifiers (SKU per variant; GTIN where available).',
      distractors: [
        'Only marketing adjectives and lifestyle images; factual fields can differ without consequences.',
        'Only meta title/description and backlinks; offers do not need consistent facts across surfaces.',
        'Only the homepage content; product-level fields do not affect shopping surfaces.',
      ],
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      seed: `${courseId}::day8::fields`,
    }),
    make({
      question:
        'You find feed price differs from PDP price for several products. What is the most likely operational consequence?',
      correct:
        'Users see conflicting facts, which reduces trust and can trigger failed checkouts and extra support tickets when expectations don’t match.',
      distractors: [
        'Conflicts are beneficial because different prices per surface increase conversion automatically.',
        'Price conflicts only affect blog SEO, not offer eligibility or customer decisions.',
        'The mismatch is harmless because AI systems never quote price from feeds or pages.',
      ],
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      seed: `${courseId}::day8::price-mismatch`,
    }),
    make({
      question:
        'Which metric definition best matches “mismatch rate” for a feed vs PDP audit?',
      correct:
        'Mismatches divided by (products audited × fields checked), so you can track improvement over time.',
      distractors: [
        'Total number of products in your catalog; bigger catalogs always have worse offer truth.',
        'Average word count of descriptions; longer descriptions imply fewer mismatches.',
        'Number of edits made per day; more edits guarantees fewer mismatches.',
      ],
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      seed: `${courseId}::day8::mismatch-rate`,
    }),
    make({
      question:
        'During an audit, which is the best “critical mismatch” to prioritize fixing first?',
      correct:
        'A broken shipping/returns policy link or a wrong price/stock status that directly misleads the buying decision.',
      distractors: [
        'A minor wording difference in the brand story; policies can be fixed later by support.',
        'A missing emoji in the product title; identifiers and stock can stay inconsistent.',
        'A different font size between feed and PDP; factual mismatches are less important than design.',
      ],
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      seed: `${courseId}::day8::critical`,
    }),
    make({
      question:
        'You audit 5 products and record mismatches but never re-check after a fix. What is the main problem with this workflow?',
      correct:
        'You can’t verify the mismatch was actually eliminated; regressions persist because there is no measure → fix → verify loop.',
      distractors: [
        'Verification is unnecessary; once you edit anything, feeds and pages automatically sync perfectly.',
        'Re-checking reduces speed and therefore makes outcomes worse; it is better to keep changing quickly.',
        'Fixing is optional because mismatches do not affect policy accuracy or customer trust.',
      ],
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      seed: `${courseId}::day8::verify`,
    }),
    make({
      question:
        'A team tracks mismatch rate but does not track “critical mismatch count” (price/stock/policy links). What is the risk?',
      correct:
        'They may reduce minor discrepancies while leaving high-impact errors that still break trust and conversion.',
      distractors: [
        'Critical mismatches are less important than minor text differences; buyers do not notice price or stock.',
        'Tracking more than one metric always creates worse outcomes, so only mismatch rate should exist.',
        'Critical mismatches will always be caught by SEO tools, so separate tracking is redundant.',
      ],
      difficulty: QuestionDifficulty.HARD,
      questionType: QuizQuestionType.CRITICAL_THINKING,
      seed: `${courseId}::day8::critical-count`,
    }),
    make({
      question:
        'Why does the lesson emphasize keeping identifiers (SKU/GTIN) consistent across feed and PDP?',
      correct:
        'Because identifiers support accurate matching across variants and systems; inconsistencies create duplicates and incorrect summaries or fulfillment errors.',
      distractors: [
        'Identifiers are purely cosmetic; inconsistencies improve discoverability by adding more unique strings.',
        'Identifiers should be hidden everywhere; technical fields reduce inclusion in shopping surfaces.',
        'Identifiers matter only for blogs, not for product offers or merchant programs.',
      ],
      difficulty: QuestionDifficulty.HARD,
      questionType: QuizQuestionType.CRITICAL_THINKING,
      seed: `${courseId}::day8::identifiers`,
    }),
  ];
}

function generateGeoShopify30Day9QuestionsEN(day: number, title: string, courseId: string): ContentBasedQuestion[] {
  const normalizedCourseId = String(courseId || '').toLowerCase();
  const baseTags = [`#day${day}`, '#en', ...(normalizedCourseId ? [`#course-${normalizedCourseId}`] : []), '#geo', '#shopify'];
  const tags = (type: QuizQuestionType, diff: QuestionDifficulty) => [
    ...baseTags,
    diff === QuestionDifficulty.HARD ? '#advanced' : '#intermediate',
    type === QuizQuestionType.APPLICATION ? '#application' : '#critical-thinking',
  ];

  const make = (p: {
    question: string;
    correct: string;
    distractors: [string, string, string];
    difficulty: QuestionDifficulty;
    questionType: QuizQuestionType;
    seed: string;
  }): ContentBasedQuestion => {
    const optionsRaw: [string, string, string, string] = [p.correct, ...p.distractors];
    const shuffled = shuffleOptionsWithCorrectIndex({ correct: p.correct, options: optionsRaw, seed: p.seed });
    return {
      question: p.question,
      options: shuffled.options,
      correctIndex: shuffled.correctIndex,
      difficulty: p.difficulty,
      category: 'Course Specific',
      questionType: p.questionType,
      hashtags: tags(p.questionType, p.difficulty),
    };
  };

  return [
    make({
      question:
        'You are auditing identifiers for 10 variants. Which SKU rule is most aligned with the lesson?',
      correct:
        'Each purchasable variant should have a non-empty SKU and SKUs must be unique (no reuse across colors/sizes/packs).',
      distractors: [
        'Use one SKU for the entire product to keep reporting simple; variants do not need unique identifiers.',
        'Leave SKUs blank for now and rely on the product title as the identifier across systems.',
        'Reuse the same SKU for similar colors so inventory looks cleaner; uniqueness is optional.',
      ],
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      seed: `${courseId}::day9::sku-rule`,
    }),
    make({
      question:
        'A catalog shows duplicate SKUs across different variants. What is the most likely downstream failure mode?',
      correct:
        'Variants get merged or mis-matched in feeds/analytics/fulfillment, leading to wrong recommendations and operational errors.',
      distractors: [
        'Duplicate SKUs improve disambiguation because systems prefer fewer unique values.',
        'Duplicates only affect visual design; feeds and operations ignore SKU entirely.',
        'Duplicate SKUs only hurt blog SEO; product recommendations are unaffected.',
      ],
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      seed: `${courseId}::day9::dup-sku`,
    }),
    make({
      question:
        'Which approach best matches the lesson’s stance on GTIN?',
      correct:
        'Use GTIN only when you genuinely have it for the item; never invent or copy GTINs across unrelated variants.',
      distractors: [
        'Generate placeholder GTINs so every variant has a number and looks “complete”.',
        'Copy the same GTIN across all variants because the product is “basically the same”.',
        'Avoid GTIN everywhere; identifiers reduce inclusion in shopping surfaces.',
      ],
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      seed: `${courseId}::day9::gtin-rule`,
    }),
    make({
      question:
        'A brand field is inconsistent (“RunPro” vs “Run Pro” vs blank). What is the best fix according to the lesson’s intent?',
      correct:
        'Make brand present and consistent across the catalog using one normalized format so systems can disambiguate reliably.',
      distractors: [
        'Randomize brand formatting to make listings look unique; consistency is a low priority.',
        'Remove brand everywhere; the product title alone is enough for matching.',
        'Keep it inconsistent; AI systems always infer brand correctly from images.',
      ],
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      seed: `${courseId}::day9::brand`,
    }),
    make({
      question:
        'A variant label reads “42 blue or black?” What is the best correction for variant clarity?',
      correct:
        'Split attributes into clean option dimensions (Color, Size) with single-attribute values, avoiding mixed strings.',
      distractors: [
        'Make the label longer by adding more attributes into the same value so nothing is missed.',
        'Remove variant options and describe choices only in the long description text.',
        'Use ambiguous labels; shoppers can decide after checkout and support can clarify later.',
      ],
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      seed: `${courseId}::day9::variant-clarity`,
    }),
    make({
      question:
        'You track SKU coverage but not SKU uniqueness (duplicate count). What is the risk?',
      correct:
        'You might fill SKUs but still have duplicates that merge variants and break matching; coverage can look good while quality stays poor.',
      distractors: [
        'Uniqueness does not matter once coverage is 100%; duplicates are harmless.',
        'Duplicate counts are subjective so they can’t be measured; only coverage is real.',
        'Uniqueness only affects page speed; matching and recommendations are unrelated.',
      ],
      difficulty: QuestionDifficulty.HARD,
      questionType: QuizQuestionType.CRITICAL_THINKING,
      seed: `${courseId}::day9::coverage-vs-unique`,
    }),
    make({
      question:
        'Why does the lesson emphasize disambiguation (clean IDs + clean variants) for feeds and AI answers?',
      correct:
        'Because identifiers and consistent variants let systems match the correct offer; without them, summaries and recommendations can refer to the wrong item.',
      distractors: [
        'Because disambiguation is only a branding exercise; systems do not use identifiers for matching.',
        'Because IDs mainly improve aesthetics; recommendations depend only on marketing copy.',
        'Because fewer identifiers always reduce confusion; removing SKUs and GTINs is the safest approach.',
      ],
      difficulty: QuestionDifficulty.HARD,
      questionType: QuizQuestionType.CRITICAL_THINKING,
      seed: `${courseId}::day9::disambiguation`,
    }),
  ];
}

/**
 * Extract key concepts from lesson content
 */
function extractKeyConcepts(content: string, title: string): {
  mainTopics: string[];
  keyTerms: string[];
  examples: string[];
  practices: string[];
  concepts: string[];
} {
  // Remove HTML tags
  const cleanContent = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const contentLower = cleanContent.toLowerCase();
  const titleClean = title.replace(/<[^>]+>/g, '').trim();
  
  // Extract headings (h2, h3)
  const h2Matches = content.match(/<h2[^>]*>(.*?)<\/h2>/gi) || [];
  const h3Matches = content.match(/<h3[^>]*>(.*?)<\/h3>/gi) || [];

  const normalizeHeading = (s: string) =>
    s
      .replace(/<[^>]+>/g, '')
      .trim()
      .toLowerCase()
      .replace(/[\u2018\u2019\u201C\u201D]/g, "'")
      .replace(/[^a-z0-9\u00C0-\u024F\u0400-\u04FF\u0600-\u06FF\u0900-\u097F\u0100-\u017F\s-]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  // Avoid heading “scaffolding” that produces generic, ungrounded questions (Examples, Practice, Self-check, etc.)
  const ignoredHeadings = new Set<string>([
    // EN
    'what you will learn today',
    "what you'll learn today",
    'what youll learn today',
    'learning goal',
    'what youll learn',
    'what you will learn',
    'why it matters',
    'definitions',
    'success criteria',
    'metrics',
    'explanation',
    'key idea',
    'examples',
    'example',
    'practice',
    'guided exercise',
    'independent exercise',
    'self-check',
    'self check',
    'optional deep dive',
    'if you want to go deeper',
    // HU
    'tanulási cél',
    'miért számít',
    'példa',
    'példák',
    'gyakorlat',
    'önellenőrzés',
    // PL
    'cel nauki',
    'dlaczego to ważne',
    'przykład',
    'przykłady',
    // PT
    'objetivo de aprendizagem',
    'por que isso importa',
    'exemplo',
    'exemplos',
    // VI
    'mục tiêu học tập',
    'tại sao điều này quan trọng',
    'ví dụ',
    // ID
    'tujuan belajar',
    'mengapa ini penting',
    'contoh',
    // RU/BG
    'пример',
    'примери',
    // AR
    'الأهداف',
    'لماذا يهم',
    'مثال',
    // HI
    'लक्ष्य',
    'क्यों महत्वपूर्ण है',
    'उदाहरण',
  ]);

  const mainTopics: string[] = [];
  h2Matches.forEach(match => {
    const text = match.replace(/<[^>]+>/g, '').trim();
    const norm = normalizeHeading(text);
    if (ignoredHeadings.has(norm)) return;
    if (text && text.length < 100 && text.length > 5) {
      mainTopics.push(text);
    }
  });
  h3Matches.forEach(match => {
    const text = match.replace(/<[^>]+>/g, '').trim();
    const norm = normalizeHeading(text);
    if (ignoredHeadings.has(norm)) return;
    if (text && text.length < 100 && text.length > 5 && !mainTopics.includes(text)) {
      mainTopics.push(text);
    }
  });
  
  // If no headings found, use title as main topic
  if (mainTopics.length === 0 && titleClean) {
    mainTopics.push(titleClean);
  }
  
  // Extract words from title as key terms if content is sparse
  const titleWordsRaw = titleClean.split(/[\s,;:–—\-]+/).filter(w => w.length > 3 && w.length < 30);
  const enStop = new Set(['what', 'with', 'from', 'your', 'into', 'when', 'then', 'this', 'that', 'will', 'have', 'you', 'they']);
  const titleWords =
    String(contentLower || '').length >= 0 && /[a-z]/i.test(titleClean)
      ? titleWordsRaw.filter(w => !enStop.has(w.toLowerCase()))
      : titleWordsRaw;
  
  // Extract key terms (bold, strong, or emphasized text)
  const keyTerms: string[] = [];
  const boldMatches = content.match(/<(strong|b|em)[^>]*>(.*?)<\/(strong|b|em)>/gi) || [];
  boldMatches.forEach(match => {
    const text = match.replace(/<[^>]+>/g, '').trim();
    // Filter out invalid terms: too short (< 4 chars), fragments, or common word fragments
    const commonFragments = ['mestere', 'ra', 're', 'ban', 'ben', 'bol', 'ből', 'val', 'vel', 'the', 'a', 'an', 'az', 'egy'];
    if (text && text.length >= 4 && text.length < 50 && !commonFragments.includes(text.toLowerCase())) {
      // Check if it's a meaningful word (has at least one vowel or is a known term)
      const hasVowel = /[aeiouáéíóúöüőűаеиоуыэюя]/i.test(text);
      if (hasVowel || text.length > 6) {
        keyTerms.push(text);
      }
    }
  });
  
  // If sparse, add title words as key terms (but filter out fragments)
  if (keyTerms.length < 5 && titleWords.length > 0) {
    const commonFragments = ['mestere', 'ra', 're', 'ban', 'ben', 'bol', 'ből', 'val', 'vel', 'the', 'a', 'an', 'az', 'egy', 'és', 'and', 'или', 've', 'и'];
    titleWords.slice(0, 10).forEach(word => {
      const wordLower = word.toLowerCase();
      if (word.length >= 4 && !commonFragments.includes(wordLower) && !keyTerms.includes(word)) {
        keyTerms.push(word);
      }
    });
  }
  
  // Extract key phrases from content (sentences with important words)
  if (keyTerms.length < 5 && cleanContent.length > 50) {
    const sentences = cleanContent.split(/[.!?]\s+/).filter(s => s.length > 20 && s.length < 150);
    sentences.slice(0, 5).forEach(sentence => {
      const words = sentence.split(/\s+/).filter(w => w.length > 4 && w.length < 20);
      if (words.length > 0) {
        const phrase = words.slice(0, 3).join(' ');
        if (phrase.length > 5 && phrase.length < 40 && !keyTerms.includes(phrase)) {
          keyTerms.push(phrase);
        }
      }
    });
  }
  
  // Extract examples (✅/❌ sections, code blocks, or specific patterns)
  const examples: string[] = [];
  const examplePatterns = [
    /✅[^❌]*?([^❌]{20,200})/gi,
    /<code[^>]*>(.*?)<\/code>/gi,
    /példa[:\s]+([^\.]{20,200})/gi, // Hungarian
    /example[:\s]+([^\.]{20,200})/gi, // English
    /пример[:\s]+([^\.]{20,200})/gi, // Russian
    /örnek[:\s]+([^\.]{20,200})/gi, // Turkish
    /пример[:\s]+([^\.]{20,200})/gi, // Bulgarian
    /przykład[:\s]+([^\.]{20,200})/gi, // Polish
    /ví dụ[:\s]+([^\.]{20,200})/gi, // Vietnamese
    /contoh[:\s]+([^\.]{20,200})/gi, // Indonesian
    /exemplo[:\s]+([^\.]{20,200})/gi, // Portuguese
    /उदाहरण[:\s]+([^\.]{20,200})/gi // Hindi
  ];
  
  examplePatterns.forEach(pattern => {
    const matches = content.match(pattern) || [];
    matches.forEach(match => {
      const text = match.replace(/<[^>]+>/g, '').trim();
      if (text.length > 20 && text.length < 300) {
        examples.push(text);
      }
    });
  });
  
  // Extract practices/exercises
  const practices: string[] = [];
  const practicePatterns = [
    /gyakorlat[:\s]+([^\.]{20,200})/gi, // Hungarian
    /practice[:\s]+([^\.]{20,200})/gi, // English
    /exercise[:\s]+([^\.]{20,200})/gi, // English
    /практика[:\s]+([^\.]{20,200})/gi, // Russian
    /uygulama[:\s]+([^\.]{20,200})/gi, // Turkish
    /практика[:\s]+([^\.]{20,200})/gi, // Bulgarian
    /praktyka[:\s]+([^\.]{20,200})/gi, // Polish
    /thực hành[:\s]+([^\.]{20,200})/gi, // Vietnamese
    /latihan[:\s]+([^\.]{20,200})/gi, // Indonesian
    /prática[:\s]+([^\.]{20,200})/gi, // Portuguese
    /अभ्यास[:\s]+([^\.]{20,200})/gi, // Hindi
    /<ol[^>]*>(.*?)<\/ol>/gi
  ];
  
  practicePatterns.forEach(pattern => {
    const matches = content.match(pattern) || [];
    matches.forEach(match => {
      const text = match.replace(/<[^>]+>/g, '').trim();
      if (text.length > 20 && text.length < 500) {
        practices.push(text);
      }
    });
  });
  
  // Extract important concepts (sentences with key indicators)
  const concepts: string[] = [];
  const conceptIndicators = [
    /fontos[:\s]+([^\.]{20,200})/gi, // Hungarian
    /important[:\s]+([^\.]{20,200})/gi, // English
    /kritikus[:\s]+([^\.]{20,200})/gi, // Hungarian
    /critical[:\s]+([^\.]{20,200})/gi, // English
    /важно[:\s]+([^\.]{20,200})/gi, // Russian
    /критично[:\s]+([^\.]{20,200})/gi, // Russian
    /önemli[:\s]+([^\.]{20,200})/gi, // Turkish
    /важно[:\s]+([^\.]{20,200})/gi, // Bulgarian
    /ważne[:\s]+([^\.]{20,200})/gi, // Polish
    /quan trọng[:\s]+([^\.]{20,200})/gi, // Vietnamese
    /penting[:\s]+([^\.]{20,200})/gi, // Indonesian
    /importante[:\s]+([^\.]{20,200})/gi, // Portuguese
    /महत्वपूर्ण[:\s]+([^\.]{20,200})/gi // Hindi
  ];
  
  conceptIndicators.forEach(pattern => {
    const matches = content.match(pattern) || [];
    matches.forEach(match => {
      const text = match.replace(/<[^>]+>/g, '').trim();
      if (text.length > 20 && text.length < 200) {
        concepts.push(text);
      }
    });
  });
  
  // If still sparse, use content sentences as concepts
  if (concepts.length < 3 && cleanContent.length > 100) {
    const sentences = cleanContent.split(/[.!?]\s+/).filter(s => s.length > 30 && s.length < 200);
    sentences.slice(0, 3).forEach(sentence => {
      if (!concepts.includes(sentence)) {
        concepts.push(sentence);
      }
    });
  }
  
  // Ensure we always have at least the title as a concept
  if (concepts.length === 0 && titleClean) {
    concepts.push(titleClean);
  }
  
  return {
    mainTopics: mainTopics.slice(0, 5),
    keyTerms: Array.from(new Set(keyTerms)).slice(0, 15), // Increased from 10
    examples: examples.slice(0, 5),
    practices: practices.slice(0, 3),
    concepts: concepts.slice(0, 5)
  };
}

function containsAll(haystackLower: string, needles: string[]) {
  return needles.every(n => haystackLower.includes(n));
}

function generateProductivity2026QuestionsEN(day: number, title: string, cleanContentLower: string, courseId: string): ContentBasedQuestion[] {
  const questions: ContentBasedQuestion[] = [];

  const normalizedCourseId = String(courseId || '').toLowerCase();
  const baseTags = [`#day${day}`, '#en', ...(normalizedCourseId ? [`#course-${normalizedCourseId}`] : []), '#productivity'];

  const tags = (type: QuizQuestionType, diff: QuestionDifficulty) => [
    ...baseTags,
    diff === QuestionDifficulty.HARD ? '#advanced' : '#intermediate',
    type === QuizQuestionType.APPLICATION ? '#application' : '#critical-thinking',
  ];

  const push = (q: Omit<ContentBasedQuestion, 'category' | 'hashtags'> & { category?: string; hashtags?: string[] }) => {
    // Shuffle options deterministically so the correctIndex isn't always 0.
    const opts = Array.isArray((q as any).options) ? ((q as any).options as [string, string, string, string]) : undefined;
    const correct = opts ? String(opts[q.correctIndex] || '').trim() : '';
    const seed = `${courseId}::en::day${day}::${q.question}`;
    const shuffled = opts && correct ? shuffleOptionsWithCorrectIndex({ correct, options: opts, seed }) : null;

    questions.push({
      category: q.category || 'Course Specific',
      hashtags: q.hashtags || tags(q.questionType, q.difficulty),
      ...q,
      ...(shuffled ? { options: shuffled.options, correctIndex: shuffled.correctIndex } : null),
    });
  };

  // NOTE: We intentionally avoid “as described in the lesson” and avoid throwaway options.
  // All questions are standalone; all options are detailed (validator requires >=25 chars).

  switch (day) {
    case 1: {
      // Anchor terms from lesson: output, outcome, constraints, productivity = outcome / constraints
      push({
        question:
          'In the output vs outcome model, which option best describes an outcome (result) rather than output (activity volume)?',
        options: [
          'A client’s critical issue is resolved and satisfaction increases, even if you sent fewer emails.',
          'You sent 80 emails and attended 6 meetings, so you were busy all day.',
          'You updated five spreadsheets and reorganized folders, but nothing changed for the customer.',
          'You opened your task app 30 times and added many new items to the list.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Productivity is defined here as outcome divided by constraints. Which decision increases productivity if your time is fixed but attention is limited?',
        options: [
          'Do one high-impact task to completion in a protected focus block, then handle messages in a separate batch.',
          'Increase activity volume by multitasking so more tasks are “touched” during the same hours.',
          'Add more status updates and meetings to feel in control, even if execution time shrinks.',
          'Keep switching between tasks whenever a notification arrives to stay responsive.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'You have the same goal but different days feel harder. Which option is the most accurate “constraints” diagnosis in this definition?',
        options: [
          'Constraints include time, energy, attention, and resources; when one drops, the same work produces less outcome.',
          'Constraints are only the number of hours on your calendar; energy and attention do not affect results.',
          'Constraints are mainly motivation; if you want it enough, limits do not matter.',
          'Constraints are irrelevant; productivity is purely the number of tasks completed.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'A teammate brags about “100 emails sent today.” Which question best reframes the discussion from output to outcome?',
        options: [
          'What changed for the customer or project because of those emails, and how will we measure that change?',
          'How can we send even more emails tomorrow to prove we are working hard?',
          'Which email client did you use, and can we automate sending more messages?',
          'How many hours did you spend typing, regardless of whether anything improved?',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Which personal definition best matches the productivity framing (outcome relative to constraints)?',
        options: [
          'Productivity is creating measurable outcomes while managing time, energy, attention, and resources sustainably.',
          'Productivity is staying busy and completing many small tasks to feel progress every day.',
          'Productivity is working long hours so nobody questions your commitment.',
          'Productivity is responding instantly to messages so you look available at all times.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Why can higher output sometimes reduce productivity in the outcome/constraints definition, even if you feel “productive”?',
        options: [
          'Because output can consume constraints (time/energy/attention) without increasing outcomes, so the denominator grows while the numerator does not.',
          'Because more activity always guarantees better outcomes, so productivity always goes up with output.',
          'Because outcomes are random and cannot be influenced, so only output matters for improvement.',
          'Because measuring outcomes is impossible, so productivity must be defined only by activity volume.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      push({
        question:
          'A manager demands “more activity” (more meetings, more updates) to prove progress. What is the most likely failure mode under the outcome/constraints definition?',
        options: [
          'Constraints get consumed by coordination overhead, reducing deep execution time and lowering real outcomes.',
          'Constraints improve automatically because meetings create energy and focus by default for everyone.',
          'Outcomes become guaranteed because activity volume itself is the same as delivering results.',
          'Attention and energy increase with more status reporting, so outcomes always accelerate.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });
      break;
    }

    case 2: {
      // Time, energy, attention; time blocking; buffer; deep work rules
      push({
        question:
          'In “time, energy, attention”, which schedule best respects constraints by placing deep work in a peak energy window and batching shallow work?',
        options: [
          '90–120 minutes of deep work in the morning, email/messages in two short batches, and 20–30% buffer time for surprises.',
          'Email and chat open all day with deep work “whenever there is time”, no buffer for interruptions.',
          'Back-to-back meetings all morning, then attempt deep work late afternoon when energy is lowest.',
          'Switch between deep work and notifications every 5 minutes to stay responsive and “connected”.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'You plan an 8-hour day with 8 hours of scheduled tasks. What is the most practical fix?',
        options: [
          'Add 20–30% buffer time, because a calendar with zero slack converts small surprises into stress and missed outcomes.',
          'Keep it fully packed; a zero-buffer schedule forces discipline and always produces better results.',
          'Add more meetings so every hour has an owner and nothing is “wasted” on execution time.',
          'Work later at night to compensate, even if energy and attention quality drop significantly.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Which deep work rule best matches attention-as-a-constraint planning (protecting focus to improve outcomes)?',
        options: [
          'During deep work: no email, no phone, no chats; interruptions are prevented by design, not willpower.',
          'During deep work: keep chat open so you can respond quickly without losing focus.',
          'During deep work: multitask across two projects to reduce boredom and maintain momentum.',
          'During deep work: accept meetings as they come and “return to focus” instantly afterward.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Your energy is high from 9–11 AM and low from 3–5 PM. Which choice is aligned with managing energy as a constraint?',
        options: [
          'Put creative/strategic work in 9–11 AM and schedule routine/admin tasks for 3–5 PM.',
          'Put the hardest creative work in 3–5 PM because difficulty builds character regardless of outcomes.',
          'Schedule random work whenever it appears, because energy patterns are not predictable or usable.',
          'Add a meeting-heavy block at 9–11 AM so the best hours are used for coordination, not execution.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Why is attention treated as a primary constraint (not a minor detail) when planning a day?',
        options: [
          'Because frequent interruptions impose refocus costs and reduce the quality and speed of outcomes, even if hours worked stay constant.',
          'Because attention is unlimited if you have enough motivation, so planning for it is unnecessary.',
          'Because attention only matters for reading, not for problem-solving or creative output.',
          'Because attention is automatically restored the moment you switch tasks, so interruptions are free.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      push({
        question:
          'If you ignore energy management and schedule deep work in low-energy windows, what is the most likely long-term outcome?',
        options: [
          'You will compensate with longer hours, but outcome quality drops and burnout risk rises because constraints are mismanaged.',
          'You will always outperform peak-hour work, because difficulty increases creativity and accuracy automatically.',
          'You will remove the need for breaks, because low energy is solved by more caffeine and willpower.',
          'You will make faster decisions, because fatigue reduces thinking and therefore reduces time spent.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      push({
        question:
          'You have two hours before a deadline and constant incoming messages. Which action best preserves attention while still staying responsive?',
        options: [
          'Set a short “response window” after the deep work block and communicate it, so the two hours stay interruption-free.',
          'Answer every message immediately to reduce anxiety, even if it breaks focus and lowers the outcome quality.',
          'Keep switching tasks to show availability, because responsiveness is the same as productivity.',
          'Schedule a meeting during the two hours so alignment improves while execution happens later somehow.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });
      break;
    }

    case 3: {
      // Goal hierarchy: vision → outcomes → projects → next actions
      push({
        question:
          'In the “goal hierarchy”, which mapping correctly connects vision → outcome → project → next action?',
        options: [
          'Vision: become a lead developer; Outcome: ship a feature by Q2; Project: redesign onboarding; Next action: schedule a kickoff and write the first draft.',
          'Vision: answer emails faster; Outcome: attend more meetings; Project: read productivity tips; Next action: add more tasks to the backlog.',
          'Vision: do many tasks; Outcome: feel busy; Project: keep calendar full; Next action: reply instantly to every message.',
          'Vision: avoid stress; Outcome: never decide; Project: infinite research; Next action: postpone choosing until you feel certain.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'You have a project plan but nothing moves forward. Which missing element is the most likely root cause in the hierarchy?',
        options: [
          'Next actions: concrete steps for today/tomorrow that turn planning into execution.',
          'More vision statements: rewriting the vision weekly until it feels inspiring enough.',
          'More tools: switching task apps so the plan looks cleaner.',
          'More meetings: adding coordination to replace direct action.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Which option is an outcome (measurable change) rather than a project (body of work) in the hierarchy?',
        options: [
          'Increase customer satisfaction by 15% by end of Q2, measured by support survey scores.',
          'Redesign the onboarding flow over the next month with multiple stakeholder reviews.',
          'Write meeting notes and share them after every sync to keep everyone informed.',
          'Create a new folder structure in the drive so documentation looks organized.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'You keep starting new projects whenever you feel stuck. Which hierarchy-based correction is most aligned with the hierarchy model?',
        options: [
          'Reconnect projects to outcomes, then define next actions for the current project instead of switching to a new one.',
          'Add more projects to increase options, because more parallel work guarantees faster outcomes.',
          'Rewrite the vision every day, because execution should wait until the vision is perfect.',
          'Avoid measuring outcomes, because measurement creates pressure and reduces creativity.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Why should each level feed the next (vision → outcomes → projects → next actions) instead of skipping levels?',
        options: [
          'Because without next actions, progress stalls; without outcomes, progress is unmeasurable; without vision, effort loses direction.',
          'Because hierarchy makes work slower by adding bureaucracy, which is the main goal of productivity systems.',
          'Because outcomes are less important than projects; finishing projects is the same as achieving results.',
          'Because next actions should be avoided; real productivity comes from long-term thinking only.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      push({
        question:
          'If a team runs many projects without defining measurable outcomes, what is the most likely failure pattern?',
        options: [
          'High activity and frequent updates, but unclear progress because nobody can prove whether the intended change actually happened.',
          'Lower activity but guaranteed results, because projects automatically create outcomes regardless of measurement.',
          'Better prioritization, because lacking outcomes prevents conflict between competing goals.',
          'Less need for next actions, because planning itself completes the work.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      push({
        question:
          'You wrote an inspiring vision but your week is still chaotic. What is the most model-aligned “next action” step to fix execution?',
        options: [
          'Pick one outcome for the next 6–12 months, then define a project and write the first concrete next action for today.',
          'Rewrite the vision again until it feels perfect, then wait for motivation to appear before acting.',
          'Start three new projects so you have options, then decide later which one feels best.',
          'Avoid defining outcomes because measurement creates pressure and reduces creativity.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });
      break;
    }

    case 4: {
      // Habits vs systems: input → process → output; scalability; documentation
      push({
        question:
          'In “habits vs systems”, which example is a system (scales and can be documented) rather than only a personal habit?',
        options: [
          'An email processing workflow: inbox rules, two daily processing windows, and a documented decision rule for every message.',
          'Remembering to check email “sometime today” and hoping nothing important is missed.',
          'Trying to be disciplined by working harder when motivation is high, without changing the process.',
          'Willing yourself to avoid distractions without changing notifications or environment.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'A process needs to work for 10 people, not just 1. what should you build?',
        options: [
          'A system with clear inputs/outputs, steps, and documentation so execution is consistent across people.',
          'A personal habit and hope everyone copies your style informally over time.',
          'A motivational slogan to increase willpower so the process “sticks” automatically.',
          'A rule that only the most disciplined person can perform the process to maintain quality.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Which option best describes why systems “scale” better than habits when you need consistent execution across people?',
        options: [
          'Systems reduce dependence on daily motivation and allow repeatable execution through structure and documentation.',
          'Systems guarantee success without maintenance, so you never need to review or improve them.',
          'Habits cannot exist in teams, so systems are the only way people can work together.',
          'Systems are only about buying tools; habits are about behavior and therefore less important.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'You want to convert “remember to do X” into a system. Which design is closest to input → process → output?',
        options: [
          'Input: incoming requests; Process: triage daily + schedule; Output: prioritized tasks with owners and due dates.',
          'Input: stress; Process: work harder; Output: hope the problem disappears over time.',
          'Input: ideas; Process: keep them in your head; Output: occasional random action when remembered.',
          'Input: emails; Process: check constantly; Output: more activity but no clear completion rule.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'What is the main risk of relying only on habits for team productivity, according to the systems framing?',
        options: [
          'Execution becomes person-dependent; when the “habit owner” is absent, quality and consistency collapse.',
          'Habits automatically transfer to others, so the team becomes more consistent without any documentation.',
          'Habits reduce the need for communication, so coordination becomes unnecessary.',
          'Habits make outcomes measurable by default, so metrics are no longer needed.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      push({
        question:
          'A system takes time to design. Why is it still higher leverage than “trying harder” as a habit strategy?',
        options: [
          'Because a good system reduces decision load and makes correct behavior the default, producing consistent outcomes over time.',
          'Because system design eliminates the need for review and improvement once written down.',
          'Because systems only work when motivation is high, so they are equivalent to habits in practice.',
          'Because habits are always harmful and should never be used for any personal change.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      push({
        question:
          'You want to scale a weekly review to a team. Which change turns it into a system rather than a personal habit?',
        options: [
          'Create a documented template (metrics + questions), set a recurring time, and assign owners so it runs consistently without relying on one person.',
          'Tell everyone to “remember to review weekly” and hope it becomes part of the culture naturally.',
          'Wait until the team feels motivated and then do reviews only when energy is high.',
          'Make weekly review optional with no shared metrics so everyone can interpret progress differently.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });
      break;
    }

    case 5: {
      // Measurement: throughput, focus blocks, carryover; weekly review
      push({
        question:
          'In weekly review metrics, what does throughput measure (as opposed to “being busy”)?',
        options: [
          'Completed important outcomes/tasks finished, not just activity volume or time spent.',
          'Total number of emails sent and meetings attended, regardless of whether outcomes changed.',
          'Hours worked in the week, regardless of output quality or results achieved.',
          'How many tasks were started, even if none were finished by the end of the week.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'You had high focus blocks but low throughput. Which interpretation is most consistent with the metrics?',
        options: [
          'You may be focusing on the wrong tasks or not defining outcomes clearly; deep work is happening, but not on high-impact deliverables.',
          'Deep work always guarantees throughput, so the metrics must be wrong and should be ignored.',
          'Throughput is irrelevant; only focus time matters because outcomes are subjective.',
          'You should add more meetings to increase throughput because coordination creates finished outcomes.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Carryover is high for three weeks in a row. Which change best matches the interpretation of carryover?',
        options: [
          'Reduce weekly scope and improve prioritization so planned tasks match real capacity and constraints.',
          'Add more tasks to “push harder”, because carryover means you are not planning enough work.',
          'Stop tracking carryover, because metrics create stress and therefore reduce productivity.',
          'Increase task granularity into micro-steps so the list looks fuller and more active.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Which weekly review sequence best reflects the 30-minute review method?',
        options: [
          'Review completed outcomes (throughput), count deep work blocks, count carryover, reflect briefly, then adjust next week’s plan.',
          'Skim your calendar quickly, then create a longer to-do list to ensure nothing is forgotten.',
          'Focus only on feelings about the week, then keep the same plan without making any rule changes.',
          'Count tasks started and messages answered, then schedule more meetings to create accountability.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Why are these metrics (throughput, focus blocks, carryover) a stronger feedback loop than “I feel productive”?',
        options: [
          'They create objective signals of outcomes and constraints, so you can change one rule at a time and verify improvement.',
          'They remove the need for planning because once you have metrics, the system runs itself automatically.',
          'They guarantee high performance even if you never review or reflect on the numbers.',
          'They measure motivation directly, which is the only reliable driver of productivity.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      push({
        question:
          'A team increases throughput by closing easy tasks while ignoring hard outcomes. What is the most likely downside of that strategy?',
        options: [
          'The metric gets gamed: activity rises but meaningful outcomes lag, so real productivity and customer impact do not improve.',
          'The strategy cannot work because easy tasks are impossible to complete in practice.',
          'Focus blocks will automatically increase because easy tasks require deep work by definition.',
          'Carryover will always go to zero because closing any tasks eliminates overplanning.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      push({
        question:
          'You can improve only one metric next week. Which choice best matches the “change one rule, then measure” approach?',
        options: [
          'Increase focus blocks by scheduling one protected 90–120 minute deep work block daily, then compare throughput and carryover.',
          'Change five tools and routines at once so improvements happen faster even if you cannot attribute the cause.',
          'Stop tracking metrics for a week to reduce stress, then assume performance improved if you feel better.',
          'Increase meeting frequency so progress is visible, then assume outcomes improved without measuring.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });
      break;
    }

    case 6: {
      // Capture: inboxes, triggers list, capture habits
      push({
        question:
          'In the capture system, what is the purpose of having a single reliable “inbox” for incoming items before processing?',
        options: [
          'To prevent loss and reduce mental load by ensuring everything lands in one trusted place before decisions are made.',
          'To avoid deciding at all; the inbox replaces planning and automatically completes tasks for you.',
          'To increase urgency by keeping items scattered across apps so you feel constant pressure to act.',
          'To make capture harder so only the most important items survive by being remembered.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Which example best fits a “triggers list” used for capture habits?',
        options: [
          'After every meeting, immediately capture action items in your inbox before starting the next task.',
          'Whenever you feel anxious, start a new project so you feel productive again.',
          'If something seems important, try to remember it and write it down later when you have time.',
          'Check email continuously so nothing can surprise you and you never miss a message.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'You have three inboxes (email, notes, chat) and none is ever empty. Which change aligns with the capture rule?',
        options: [
          'Set a daily processing time to empty inboxes and apply a decision rule for every item (delete, archive, reply, delegate, schedule).',
          'Add a fourth inbox to distribute load so each app looks less crowded day to day.',
          'Stop capturing items to reduce inbox clutter; only keep tasks you can finish immediately.',
          'Process inboxes only when you feel motivated, because consistency is less important than mood.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'A capture habit becomes reliable when it is triggered automatically. Which design best supports that?',
        options: [
          'Choose one trigger (e.g., after calls) and always capture next steps immediately into the same inbox until it becomes automatic.',
          'Rely on memory and capture only when you remember, so you practice flexibility and resilience.',
          'Capture only big items; small items can be held in your head to train focus.',
          'Capture in different places each time to keep the process “fresh” and interesting.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'What is the main failure mode if you capture everything but never process the inboxes on schedule?',
        options: [
          'The system becomes a dumping ground, trust collapses, and you revert to memory-based work with higher stress and missed outcomes.',
          'The system still works perfectly because capture alone is enough to produce results without decisions.',
          'The system improves automatically over time because unprocessed items become less important.',
          'The system eliminates the need for prioritization, because all items are equally urgent by default.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      push({
        question:
          'Why does a capture system improve productivity under the outcome/constraints framing from Day 1?',
        options: [
          'Because it reduces attention waste (constraint) and prevents loss, allowing more focused execution that produces measurable outcomes.',
          'Because it increases output volume by creating more tasks, which automatically improves productivity.',
          'Because it eliminates the need for deep work by turning all work into quick inbox processing.',
          'Because it replaces outcomes with activity tracking, so results no longer need to be measured.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      push({
        question:
          'You captured action items after a meeting but forgot them until next week. Which change most directly fixes this within the capture system?',
        options: [
          'Add a daily inbox-processing block where each item becomes a scheduled next action, delegated task, or explicitly dropped.',
          'Capture more items into more places so the chance of remembering at least one location is higher.',
          'Stop capturing after meetings so you can stay present; memory is more reliable than systems.',
          'Only capture when the task feels urgent; non-urgent tasks do not need a system.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });
      break;
    }

    case 7: {
      // Daily/Weekly system: morning ritual, daily huddle, weekly review
      push({
        question:
          'In a daily/weekly system, what is the primary purpose of a short daily huddle (5–10 minutes)?',
        options: [
          'To choose today’s priority outcomes and align the day’s blocks, not to add more tasks or hold long discussions.',
          'To debate every open topic until consensus is perfect, even if execution time disappears.',
          'To track who is working the hardest by counting messages and visible activity.',
          'To replace weekly review, because daily planning makes reflection unnecessary.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Which morning ritual best supports the system approach to execution?',
        options: [
          'Review priorities, schedule at least one deep work block, and decide what will be ignored today to protect outcomes.',
          'Start by checking notifications and email so you can react quickly to anything new.',
          'Open multiple projects and pick whichever feels easiest in the moment to build momentum.',
          'Hold a meeting first thing so everyone is immediately busy and visible.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'You finish the week with high carryover again. Which weekly system adjustment is most aligned with the system approach?',
        options: [
          'Reduce scope, improve prioritization, and schedule focus blocks earlier while protecting buffer time.',
          'Add more tasks to the plan to force higher throughput by sheer volume.',
          'Stop measuring carryover and focus only on how productive the week felt emotionally.',
          'Schedule more meetings to create pressure instead of changing the execution system.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Which choice best integrates time blocking and weekly review into one coherent system?',
        options: [
          'Use weekly review to choose outcomes, then block deep work windows and batch shallow work so the plan matches constraints.',
          'Block every hour with meetings so the calendar is full and nothing unexpected can occur.',
          'Avoid blocking time; flexibility is more important than protecting deep work or outcomes.',
          'Plan only in your head; writing schedules reduces creativity and therefore reduces outcomes.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Why is a weekly review essential rather than optional in a productivity system?',
        options: [
          'Because without a feedback loop you cannot see what worked, correct the system, or improve outcomes over time.',
          'Because weekly review increases activity volume, which is the main definition of productivity.',
          'Because weekly review eliminates the need for daily planning and execution once done once.',
          'Because weekly review replaces the need for prioritization; every task becomes equally important.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      push({
        question:
          'If a team runs daily huddles but never clarifies outcomes or next actions, what will most likely happen?',
        options: [
          'Coordination time increases, but execution remains unclear, so activity rises while outcomes stagnate.',
          'Outcomes accelerate automatically because daily meetings always produce completed work.',
          'Deep work time increases because huddles reduce interruptions by default.',
          'Carryover becomes irrelevant because talking about tasks completes them.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      push({
        question:
          'A daily plan looks good on paper but fails by noon due to surprises. Which adjustment best matches the system design?',
        options: [
          'Add buffer time and define an explicit re-planning moment (e.g., midday), so the system adapts without destroying deep work blocks.',
          'Remove buffer time to force discipline; surprises should be handled by working faster, not by planning slack.',
          'Add more tasks in the morning so you can “make up” for interruptions later in the day.',
          'Schedule meetings during deep work windows so surprises are discussed instead of executed.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });
      break;
    }

    case 8: {
      // Context switching cost: attention residue, batching, deep work blocks
      push({
        question:
          'In context switching cost, which change best reduces attention residue and protects deep work?',
        options: [
          'Batch similar tasks (email/messages) into fixed windows and keep a 90–120 minute deep work block interruption-free.',
          'Keep notifications on so you can respond instantly and “stay in flow” across multiple tasks.',
          'Work on three projects at once to increase variety and prevent boredom from deep focus.',
          'Schedule meetings between every task so you never have to refocus for long periods.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'You switch between tasks 20+ times per day and feel exhausted. Which measurement would best validate the problem using a measurement-first approach?',
        options: [
          'Log the number of context switches and compare focus blocks completed before and after batching changes.',
          'Count how many messages you answered; more messages answered means less switching cost.',
          'Track only hours worked; switching cannot affect outcomes if time stays constant.',
          'Measure number of browser tabs open; more tabs means better multitasking ability.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Which deep work block rule is most aligned with preventing context switching cost?',
        options: [
          'Define “no email, no chat, no phone” rules and remove triggers so interruptions cannot happen during the block.',
          'Promise yourself you will not get distracted, while keeping all notifications visible.',
          'Switch tasks whenever a new idea appears, so you capture creativity immediately.',
          'Use deep work time primarily for meetings so alignment is maintained continuously.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'If you add more tools but keep switching contexts constantly, what is the most likely result?',
        options: [
          'Tool changes won’t fix the core constraint; attention residue still reduces outcome quality and throughput.',
          'Tools eliminate attention residue automatically, so context switching becomes free and harmless.',
          'More tools guarantee deeper focus because complexity forces the brain to concentrate.',
          'Context switching improves deep work because frequent novelty trains sustained attention.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      push({
        question:
          'Why is batching considered a high-leverage tactic in the focus economics?',
        options: [
          'Because it reduces refocus costs, decision fatigue, and fragmentation, allowing more deep work and higher-quality outcomes.',
          'Because batching increases the number of tasks started, which is the best measure of productivity.',
          'Because batching makes work more exciting, so motivation replaces the need for planning.',
          'Because batching removes the need for prioritization, since all tasks can be done in any order equally well.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      // Ensure minimum application count (add one more application)
      push({
        question:
          'Your calendar has deep work blocks, but you keep breaking them for “quick replies”. What is the best system-level fix?',
        options: [
          'Create a communication policy: two reply windows per day and an escalation rule, so deep work blocks stay protected.',
          'Keep blocks flexible; if you break them often, it means deep work is unrealistic and should be removed.',
          'Add more deep work blocks and hope that a larger quantity compensates for frequent interruptions.',
          'Turn deep work into chat time so you can progress while staying responsive to everyone.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'You feel “busy” all day but produce little. In the context switching lesson, what is the most likely root cause?',
        options: [
          'Frequent context switches create attention residue, so deep work never reaches enough uninterrupted time to produce outcomes.',
          'Your task list is too short; adding more tasks will increase throughput automatically.',
          'Your email response speed is too slow; responding instantly would create better outcomes by itself.',
          'Your calendar has too much deep work; replacing it with meetings increases clarity and therefore results.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });
      break;
    }

    case 9: {
      // Delegation vs elimination
      push({
        question:
          'In “delegation vs elimination”, which task is the best candidate to eliminate (drop) rather than delegate?',
        options: [
          'A weekly report nobody uses and that does not change any decisions or outcomes.',
          'Customer support triage that must happen daily to prevent churn and revenue loss.',
          'A repeatable data entry task that can be done reliably by someone else with instructions.',
          'Formatting a document that still must be produced, but could be handled by another team member.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Which delegation brief best protects outcome quality while giving autonomy?',
        options: [
          'Define expected output, deadline, success criteria, check-in points, and constraints; allow the delegate to choose the method.',
          'Tell them “just handle it” with no criteria, then judge the result harshly at the end.',
          'Micromanage every step daily so the delegate cannot make independent decisions.',
          'Delegate only the easiest parts so you keep all meaningful work and still stay overloaded.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'The elimination test is: “What value is lost if this is not done?” Which conclusion fits the method?',
        options: [
          'If the honest answer is “very little”, eliminate it and reinvest time into higher-outcome work.',
          'If the answer is unclear, keep it forever because uncertainty means it must be important.',
          'If it feels uncomfortable to stop, keep doing it; discomfort is evidence of high value.',
          'If it takes time, it must be valuable; time cost is proof of importance.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'A leader delegates strategic decisions to save time. framing, why is this risky?',
        options: [
          'Some decisions are non-delegable; delegating them can reduce outcome quality and create rework that costs more time than it saves.',
          'Strategic decisions are always easy to delegate because they do not affect real outcomes.',
          'Delegation automatically improves decision quality because the delegate has more information by default.',
          'Strategic decisions are only about speed, so outcome quality is irrelevant when delegating.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      push({
        question:
          'If you delegate low-value tasks without eliminating any, what is the likely second-order effect?',
        options: [
          'You may still carry too much coordination overhead; eliminating truly unnecessary tasks often yields higher leverage than delegating everything.',
          'Coordination overhead always drops to zero because delegation removes communication needs completely.',
          'Delegation guarantees that all tasks become high value, so elimination is never necessary.',
          'Delegation replaces prioritization, because once delegated, tasks no longer matter to outcomes.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      // Extra application to ensure >=5
      push({
        question:
          'You keep doing “quick fixes” yourself because delegating feels slower. What is the best system-aligned adjustment?',
        options: [
          'Invest once in a clear delegation process and documentation so future repeats cost less than repeated solo fixes.',
          'Keep doing everything yourself; delegation is always slower and never pays back.',
          'Delegate without context to save time; unclear expectations are fine because speed is the priority.',
          'Eliminate all tasks, including critical customer work, because any work is a productivity problem.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'You delegated a task but got a poor result. Which fix is most aligned with the delegation guidance?',
        options: [
          'Clarify expected output, success criteria, and check-in points, then give autonomy on method while providing feedback early.',
          'Take back all delegation permanently; one failure proves delegation never works.',
          'Add more meetings to discuss the task repeatedly instead of improving the delegation brief.',
          'Remove all constraints and deadlines so the delegate can work indefinitely without accountability.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });
      break;
    }

    case 10: {
      // Energy management: peak hours, recovery rituals, boundaries
      push({
        question:
          'In energy management, which plan best matches “peak hours for deep work, low-energy for routine work, and scheduled recovery”?',
        options: [
          'Schedule creative work in peak energy windows, routine tasks in low energy, and include micro/macro breaks as planned recovery.',
          'Schedule the hardest tasks after long meetings, because fatigue forces you to work faster and be more decisive.',
          'Work continuously without breaks to build stamina; recovery reduces productivity and should be avoided.',
          'Shift deep work to late night every day even if sleep quality drops and decision quality declines.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Which boundary is most aligned with sustainable output (not a burnout sprint)?',
        options: [
          'Protect sleep and set a stop time; do not trade recovery for more hours when quality is dropping.',
          'Extend the workday whenever possible; more hours always produce proportionally more outcomes.',
          'Remove lunch breaks so you can stay in “work mode” and avoid losing momentum.',
          'Use caffeine to replace breaks; recovery rituals are unnecessary if you push hard enough.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'You notice mood swings and irritability after days of nonstop work. What is the most system-aligned first response?',
        options: [
          'Adjust pace and add intentional recovery (breaks, boundaries, sleep) to restore energy and protect decision quality.',
          'Increase workload to build resilience; fatigue is a sign you should push harder.',
          'Ignore signals; energy is irrelevant as long as you are still doing many tasks.',
          'Add more meetings for accountability; meetings automatically restore energy and motivation.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Why does energy management improve productivity under the outcome/constraints definition, even if total hours stay the same?',
        options: [
          'Because higher energy increases the quality and speed of outcomes per hour, so the same time yields more meaningful results.',
          'Because energy is unrelated to attention and decision quality, so it cannot change outcomes.',
          'Because energy management is mainly about comfort, which reduces ambition and therefore reduces outcomes.',
          'Because energy management increases activity volume automatically, so it improves productivity by definition.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      push({
        question:
          'If a team rewards only long hours (not outcomes), what is the likely impact on sustainable productivity?',
        options: [
          'Burnout risk rises, decision quality drops, and outcomes per constraint decline because recovery is punished instead of designed.',
          'Outcomes improve automatically because long hours guarantee high-quality work regardless of fatigue.',
          'Focus blocks increase because tired brains always concentrate better to compensate.',
          'Carryover disappears because long hours eliminate planning errors without changing systems.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      // Extra application
      push({
        question:
          'Which practice best turns energy insights into an actionable weekly plan?',
        options: [
          'Track energy for a week, identify peak windows, and deliberately schedule deep work and recovery around those windows.',
          'Ignore patterns and schedule tasks randomly so you can “stay flexible” and avoid planning overhead.',
          'Schedule only meetings in the morning; execution can happen later whenever there is time left.',
          'Work until exhausted each day to discover limits; planning energy is less effective than testing failure.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'You consistently crash mid-afternoon. Which adjustment best matches the recovery rituals idea?',
        options: [
          'Schedule a 20–30 minute macro break (walk, lunch, reset) and move demanding work to a peak window instead of pushing through fatigue.',
          'Add more high-stakes decisions into the crash window to train willpower and resilience.',
          'Remove breaks entirely so the body adapts; recovery is a sign of weakness in productivity.',
          'Replace deep work with constant messaging during the crash so you never notice low energy.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });
      break;
    }

    case 11: {
      // Goal Setting & OKRs (refined lesson)
      push({
        question:
          'You set an “Objective” but your week stays chaotic. Which choice best matches a strong OKR structure that guides daily decisions?',
        options: [
          'One Objective plus 2–4 measurable Key Results with a deadline, then weekly check-ins tied to those metrics.',
          'A motivational Objective with no numbers, so you can interpret progress however you feel that week.',
          'A long list of projects with no Key Results, because finishing projects is the same as outcomes.',
          'A promise to “work harder” and respond faster, because activity volume proves progress.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Which Key Result is the best example of a measurable criterion (not a vague intention) for an OKR?',
        options: [
          'Increase onboarding completion rate from 60% to 80% by June 30, measured weekly.',
          'Improve onboarding so users feel happier and the product seems nicer.',
          'Be more productive and get more done without specifying what changes.',
          'Try to focus more and hope it leads to better results later.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'You have an OKR, but execution stalls. What is the most system-aligned next action step for the next 7 days?',
        options: [
          'Break the Objective into weekly next actions, schedule them, and remove activities that do not move Key Results.',
          'Add more meetings to discuss the OKR so alignment improves, then execute later.',
          'Rewrite the Objective until it sounds inspiring enough; execution will follow naturally.',
          'Start multiple unrelated projects to increase the chance that something improves a Key Result accidentally.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'You can measure only one thing weekly to keep the OKR honest. Which metric choice best matches the lesson’s “criteria/threshold” idea?',
        options: [
          'A Key Result number (e.g., completion %, revenue, satisfaction) that directly represents the intended outcome.',
          'Number of emails sent, because communication volume correlates with success.',
          'Hours worked, because time spent is the fairest performance signal.',
          'Number of meetings attended, because attendance shows commitment.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Why does an OKR framework reduce “busy work” under the outcome/constraints definition?',
        options: [
          'Because it ties work to measurable outcomes, making it easier to drop activities that consume constraints without moving results.',
          'Because it increases the number of tasks tracked, which automatically improves productivity.',
          'Because it replaces execution; once goals exist, outcomes happen automatically.',
          'Because it makes meetings more frequent, which ensures constant progress visibility.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      push({
        question:
          'What is the most likely failure mode if you implement OKRs without clear Key Results and thresholds?',
        options: [
          'Progress becomes unprovable, so activity gets mistaken for outcomes and the system can be gamed.',
          'Outcomes become guaranteed because goals exist, even without measurement.',
          'Constraints stop mattering because goal-setting increases energy and attention automatically.',
          'Decision fatigue disappears entirely because OKRs eliminate uncertainty by definition.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      // Extra application to ensure >=5
      push({
        question:
          'Your Key Results are not moving. Which action best matches the lesson’s “mini-review: keep/change/drop” step?',
        options: [
          'Audit last week’s activities, drop what didn’t move KRs, and replace with one specific next action tied to the metric.',
          'Increase workload and add more tasks so progress becomes inevitable by volume.',
          'Stop measuring for a while so you can reduce stress and hope progress returns.',
          'Change the Objective name to something more ambitious so the team feels motivated again.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });
      break;
    }

    case 12: {
      // Accountability structures
      push({
        question:
          'In accountability structures, which setup creates the clearest feedback loop without adding heavy overhead?',
        options: [
          'A simple weekly check-in with a visible metric (throughput or carryover) and a specific next-week commitment.',
          'A vague promise to “try harder” with no metric and no scheduled review point.',
          'Random updates whenever someone remembers, without a consistent cadence or measurement.',
          'A complex dashboard with many metrics that nobody reviews or acts on consistently.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'You want accountability without micromanagement. Which rule best matches the approach?',
        options: [
          'Track outcomes with agreed metrics and cadence; focus on results and system adjustments, not constant surveillance.',
          'Require hourly status reports so activity is visible, even if it breaks deep work blocks.',
          'Measure only time online; outcomes are too hard to define and should be avoided.',
          'Use public shame as the main mechanism; fear is the most reliable productivity system.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Which check-in question best enforces outcome thinking (not output) in an accountability partner call?',
        options: [
          'What measurable outcome did you complete, and what rule will you change next week based on the metric?',
          'How many messages did you send, and how busy did you feel during the week?',
          'Did you work long hours, and did you respond quickly to every request?',
          'How many tasks did you start, even if none were finished by the end of the week?',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Why can accountability improve productivity even when it does not add new tools or extra hours?',
        options: [
          'Because it creates a feedback loop and commitment pressure that increases follow-through on high-outcome tasks.',
          'Because it increases activity volume automatically; accountability is the same as doing more tasks.',
          'Because it eliminates the need for weekly review; once accountable, reflection is unnecessary.',
          'Because accountability replaces planning; you can improvise every day as long as you report later.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      push({
        question:
          'What is a common failure mode when accountability is designed around activity instead of outcomes?',
        options: [
          'People game visibility (messages, meetings) while outcomes stagnate, so productivity metrics stop reflecting real progress.',
          'People stop working completely, because activity-based tracking removes all motivation instantly.',
          'Deep work blocks become longer automatically because more activity means more focus time by default.',
          'Carryover always decreases because activity creates completion even without prioritization.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      // Extra application
      push({
        question:
          'You miss goals repeatedly. Which accountability change is most likely to help, according to the systems framing?',
        options: [
          'Add a consistent cadence (weekly review + check-in) and make commitments smaller and measurable to match constraints.',
          'Increase goal size dramatically to create pressure; bigger promises always create better follow-through.',
          'Remove measurement so failure is less visible; less visibility reduces stress and improves results.',
          'Switch accountability partners weekly so you never get used to the routine or feel bored.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Your team wants accountability but hates meetings. Which option best keeps accountability while protecting focus blocks?',
        options: [
          'Use an async weekly scorecard (throughput/focus blocks/carryover) plus a short scheduled check-in only when metrics signal issues.',
          'Add daily long status meetings so activity is visible, even if deep work is constantly interrupted.',
          'Stop tracking outcomes and rely on trust alone; accountability systems are unnecessary if people are good.',
          'Track only how many messages people send, because messaging volume correlates directly with outcomes.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });
      break;
    }

    case 13: {
      // Decision-making frameworks: analysis paralysis, decision matrix, categories, 80% rule
      push({
        question:
          'In decision-making frameworks, which situation is best handled with a decision matrix (not endless research)?',
        options: [
          'A medium-to-high impact choice with multiple criteria (cost, quality, time) where comparing options objectively reduces procrastination.',
          'A trivial reversible choice where you can decide immediately and fix later if needed.',
          'A choice where you already know the answer and only need to act, not compare options.',
          'A choice with only one viable option where scoring adds no new information.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'You delay a decision for weeks because you want perfect information. What system-aligned rule breaks analysis paralysis?',
        options: [
          'Set an information boundary (time limit or minimum data), make the 80% decision, then iterate after implementation.',
          'Keep researching until uncertainty is zero, because reversing decisions later is always more expensive.',
          'Ask more people for opinions until everyone agrees; consensus is the same as correctness.',
          'Avoid deciding by starting a new project; action can replace decision-making entirely.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Which decision category rule best reduces decision fatigue in the approach?',
        options: [
          'Small reversible decisions get minimal analysis; medium decisions use a simple matrix; large decisions add counsel and time.',
          'All decisions require deep analysis, because small errors accumulate into major failures over time.',
          'Only large decisions should be made; small decisions should be postponed to avoid mistakes.',
          'Decisions should depend on mood; when you feel confident, decide quickly, otherwise delay indefinitely.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Why is “time is more expensive than perfection” a productivity statement in the framing?',
        options: [
          'Because long analysis consumes constraints and delays outcomes; a fast decision plus iteration often yields better results sooner.',
          'Because perfection is always easy, so you should delay decisions until you can be perfect with no cost.',
          'Because outcomes do not matter; only the act of deciding quickly is important.',
          'Because analysis always produces better decisions, regardless of time cost or missed opportunities.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      push({
        question:
          'What is a likely failure mode if a team applies the 80% rule to high-risk irreversible decisions without safeguards?',
        options: [
          'They may move fast but create costly rework; the rule must be paired with decision categories and risk checks for large decisions.',
          'They will automatically make perfect decisions because speed guarantees accuracy under uncertainty.',
          'They will eliminate decision fatigue entirely, so risk management becomes unnecessary.',
          'They will never need stakeholder input again because iteration replaces alignment on outcomes.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      // Extra application
      push({
        question:
          'You have 3 tool options. Which decision matrix setup is most aligned with the example method?',
        options: [
          'Define criteria (cost, time saved, quality), weight them, score each option 1–5, multiply, sum, and pick the highest total.',
          'Pick the option with the best marketing; the matrix is unnecessary when branding is strong.',
          'Choose randomly; experimenting is always better than evaluating because evaluation is wasted time.',
          'Only compare one criterion (price) because multi-criteria decisions are too complex to evaluate.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'You’re stuck choosing between two “good” options. What system-aligned question best forces clarity before you decide?',
        options: [
          'Which outcome matters most, what constraint is binding, and what criterion will we use to judge the decision in one week?',
          'Which option feels safest emotionally right now, even if it delays the outcome for another month?',
          'Which option creates the most activity and meetings, because visibility is the main success signal?',
          'Which option avoids any downside at all, because decisions should have zero risk to be acceptable?',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });
      break;
    }

    default: {
      // Days 14–30: use a safe generic pattern grounded in the refined lesson template.
      // We still keep questions concrete, scenario-based, and aligned with steps/metrics/mistakes.
      const topic = title;

      push({
        question:
          `You are applying "${topic}" this week. Which next step most directly turns intent into an outcome instead of extra activity?`,
        options: [
          'Pick one real scenario, apply the checklist, define a success metric/criterion, and review results at week’s end.',
          'Add more meetings and messages so progress is visible, then assume the outcome improved.',
          'Start multiple unrelated tasks to stay busy and increase the feeling of productivity.',
          'Delay action until the plan is perfect, because execution without certainty risks mistakes.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          `Which option is the best example of a measurable metric/criterion for "${topic}" (so you can prove progress)?`,
        options: [
          'A specific number tracked weekly (e.g., decision latency, cycle time, time saved) with a threshold for success.',
          'A general intention like “be better at this”, without numbers or a deadline.',
          'A count of messages sent, regardless of whether outcomes improved.',
          'A feeling-based check (“did it feel productive?”) with no measurable signal.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          `In a "Good vs Bad" comparison for "${topic}", which option is closest to a “Good” implementation?`,
        options: [
          'Clear outcomes, explicit owners/criteria, and fewer distractions so execution produces measurable results.',
          'More activity (more meetings/updates) without decisions, owners, or measurable progress.',
          'More tools and dashboards without changing the process or defining success criteria.',
          'More urgency and overtime without adjusting constraints or simplifying the system.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          `Which mistake is most likely to break "${topic}" in practice, according to the systems framing?`,
        options: [
          'Optimizing visible activity instead of outcomes, so constraints get consumed without measurable progress.',
          'Defining one clear metric and reviewing it weekly to adjust one rule at a time.',
          'Reducing context switching and protecting focus blocks so outcomes can be produced.',
          'Creating a short checklist and documenting it so the process is repeatable.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          `You want "${topic}" to work for a team, not just one person. Which change best makes it a scalable system?`,
        options: [
          'Document the checklist, define owners and success criteria, and run a lightweight cadence (review + adjustment).',
          'Rely on individual willpower and hope everyone copies the best performer’s habits.',
          'Make the process optional with no shared metrics so nobody feels pressured by measurement.',
          'Increase coordination time so everyone stays busy and visible, even if execution time drops.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          `What is the biggest risk if you implement "${topic}" incorrectly by adding more activity without changing outcomes?`,
        options: [
          'Constraints get consumed (time/energy/attention) while outcomes stagnate, so productivity drops even if work feels intense.',
          'Outcomes improve automatically because activity volume guarantees results in complex systems.',
          'Measurement becomes unnecessary because visible effort is a sufficient success signal.',
          'Decision quality improves because fatigue forces faster thinking and fewer debates.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      push({
        question:
          `When "${topic}" fails, which diagnosis is most aligned with the outcome/constraints definition?`,
        options: [
          'The system lacks clear criteria/metrics or protected execution time, so outcomes cannot be reliably produced and proven.',
          'People are not working long enough hours, so adding overtime is the main fix regardless of constraints.',
          'The team needs more tools, because tools replace the need for clear definitions and checklists.',
          'The best fix is to stop reviewing results, because reflection slows execution.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });
      break;
    }
  }

  // If lesson content is extremely sparse, prefer not to invent; but for days 1–13 EN we already have seeded content.
  // We still keep this guard for safety.
  if (cleanContentLower.trim().length < 200 && day !== 1) {
    return [];
  }

  // De-duplicate questions by normalized text and return a slightly larger pool.
  const seen = new Set<string>();
  const uniq: ContentBasedQuestion[] = [];
  for (const q of questions) {
    const key = q.question.trim().toLowerCase().replace(/\s+/g, ' ');
    if (seen.has(key)) continue;
    seen.add(key);
    uniq.push(q);
  }

  return uniq;
}

function generateGeoIntroLessonQuestionsEN(
  day: number,
  title: string,
  cleanContentLower: string,
  courseId: string
): ContentBasedQuestion[] {
  // Goal: minimum 7 total -> prefer 5 application + 2 critical-thinking, no recall.
  // Generate a slightly larger pool so strict QC can reject weak options without dropping below 7.
  const questions: ContentBasedQuestion[] = [];

  const normalizedCourseId = String(courseId || '').toLowerCase();
  const baseTags = [`#day${day}`, '#en', '#all-languages', ...(normalizedCourseId ? [`#course-${normalizedCourseId}`] : [])];
  const topicTags: string[] = [];
  if (courseId.includes('GEO')) topicTags.push('#geo');
  if (courseId.includes('SHOPIFY')) topicTags.push('#shopify');

  const tags = (type: QuizQuestionType, diff: QuestionDifficulty) => [
    ...baseTags,
    ...topicTags,
    diff === QuestionDifficulty.HARD ? '#advanced' : '#intermediate',
    type === QuizQuestionType.APPLICATION ? '#application' : '#critical-thinking',
  ];

  // Application 1: KPI mapping
  questions.push({
    question:
      `You run the same GEO prompt about your store 3 times and get different store recommendations each time. Which KPI from "${title}" is failing?`,
    options: [
      'Consistency (the result should be repeatable across runs)',
      'Citation (whether the answer links to your domain)',
      'Inclusion (whether your brand/product appears at least once)',
      'SEO ranking (position in the 10 blue links)',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    category: 'Course Specific',
    questionType: QuizQuestionType.APPLICATION,
    hashtags: tags(QuizQuestionType.APPLICATION, QuestionDifficulty.MEDIUM),
  });

  // Application 2: citation vs inclusion
  questions.push({
    question:
      `An AI answer mentions your product name but does not link to your site. Which GEO outcome from "${title}" are you missing?`,
    options: [
      'Citation (the answer should link to your domain)',
      'Inclusion (your brand/product should appear at all)',
      'Consistency (the answer should repeat across runs)',
      'Conversion (the user must buy immediately)',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    category: 'Course Specific',
    questionType: QuizQuestionType.APPLICATION,
    hashtags: tags(QuizQuestionType.APPLICATION, QuestionDifficulty.MEDIUM),
  });

  // Application 3: data accuracy risk tool/asset
  questions.push({
    question:
      'When developing a GEO strategy for a Shopify store, which asset is the highest risk if it is wrong or inconsistent because it can cause AI answers to misquote price, stock, or shipping?',
    options: [
      'Your product data (identifiers like GTIN + accurate price/stock/shipping info)',
      'Your homepage hero headline (brand positioning text; low risk for factual misquotes)',
      'Your brand logo file (visual identity; does not control factual pricing/stock/shipping)',
      'Your social media bio (helps discovery, but rarely the source for transactional facts)',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    category: 'Course Specific',
    questionType: QuizQuestionType.APPLICATION,
    hashtags: tags(QuizQuestionType.APPLICATION, QuestionDifficulty.MEDIUM),
  });

  // Application 4: good vs poor signals
  questions.push({
    question:
      `You want AI answers to safely quote your store. Which change best matches the “Good vs Poor” examples in "${title}"?`,
    options: [
      'Add missing identifiers (e.g., GTIN) and keep price/stock/shipping transparent and consistent',
      'Hide shipping details until checkout to increase conversion',
      'Use dynamic/duplicate product URLs for the same item to “A/B test” AI visibility',
      'Remove returns information so the page is shorter',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    category: 'Course Specific',
    questionType: QuizQuestionType.APPLICATION,
    hashtags: tags(QuizQuestionType.APPLICATION, QuestionDifficulty.MEDIUM),
  });

  // Application 5: prompt table discipline
  questions.push({
    question:
      `You write 5 GEO prompts and track them in a table. Which column is essential to include so you can evaluate inclusion/citation/consistency for each prompt?`,
    options: [
      'Expected outcome (what you expect to see: inclusion, citation, consistency)',
      'Emoji rating (how fun the prompt feels)',
      'Word count of the prompt only',
      'Competitor names only (does not let you evaluate inclusion/citation/consistency outcomes)',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    category: 'Course Specific',
    questionType: QuizQuestionType.APPLICATION,
    hashtags: tags(QuizQuestionType.APPLICATION, QuestionDifficulty.MEDIUM),
  });

  // Critical thinking 1: GEO vs SEO risk
  questions.push({
    question:
      `A team optimizes only for SEO rankings (the “10 blue links”) and ignores GEO signals. What is the most likely GEO failure described in "${title}"?`,
    options: [
      'The store may not be included or cited in AI answers even if it ranks well in search',
      'The store cannot be crawled by search engines at all',
      'The store automatically becomes premium-only',
      'The store will always be cited by AI answers',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.HARD,
    category: 'Course Specific',
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: tags(QuizQuestionType.CRITICAL_THINKING, QuestionDifficulty.HARD),
  });

  // Critical thinking 2: dynamic URLs downside
  questions.push({
    question:
      'Why can dynamic or duplicate URLs hurt GEO results, even if the on-page content looks correct to humans?',
    options: [
      'They make it harder to fetch and safely quote a single “canonical” source, reducing citation and consistency',
      'They increase citations because there are more URLs to choose from',
      'They guarantee conversion because users see more variants of the page',
      'They replace the need for identifiers like GTIN',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.HARD,
    category: 'Course Specific',
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: tags(QuizQuestionType.CRITICAL_THINKING, QuestionDifficulty.HARD),
  });

  // Extra application variants (pool padding)
  questions.push({
    question:
      'An AI answer links to your domain but quotes an outdated shipping promise. Which improvement from the lesson most directly reduces this risk?',
    options: [
      'Make shipping and returns information explicit, consistent, and easy to fetch on stable URLs',
      'Increase the number of blog posts about your brand story',
      'Add more lifestyle images without any accompanying text',
      'Remove prices from product pages to avoid confusion',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    category: 'Course Specific',
    questionType: QuizQuestionType.APPLICATION,
    hashtags: tags(QuizQuestionType.APPLICATION, QuestionDifficulty.MEDIUM),
  });

  questions.push({
    question:
      'Your store appears in AI answers, but it is never the top recommendation and is rarely linked. Which outcome should you prioritize measuring first to diagnose the issue?',
    options: [
      'Citation (whether answers link to your domain and cite you as a source)',
      'Emoji sentiment (whether the answer feels friendly)',
      'Checkout conversion rate (whether users immediately purchase)',
      'Page speed only (regardless of content quality)',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    category: 'Course Specific',
    questionType: QuizQuestionType.APPLICATION,
    hashtags: tags(QuizQuestionType.APPLICATION, QuestionDifficulty.MEDIUM),
  });

  return questions;
}

function generateProductivityLesson1QuestionsPL(
  day: number,
  title: string,
  courseId: string
): ContentBasedQuestion[] {
  const questions: ContentBasedQuestion[] = [];

  const normalizedCourseId = String(courseId || '').toLowerCase();
  const baseTags = [`#day${day}`, '#pl', '#all-languages', ...(normalizedCourseId ? [`#course-${normalizedCourseId}`] : [])];
  const topicTags = ['#productivity'];

  const tags = (type: QuizQuestionType, diff: QuestionDifficulty) => [
    ...baseTags,
    ...topicTags,
    diff === QuestionDifficulty.HARD ? '#advanced' : '#intermediate',
    type === QuizQuestionType.APPLICATION ? '#application' : '#critical-thinking',
  ];

  // Application 1: output vs outcome classification
  questions.push({
    question:
      'Które zdanie jest przykładem “rezultatu” (efektu), a nie “wyniku” (samej aktywności) w kontekście produktywności?',
    options: [
      '„Zamknąłem(-am) projekt na czas i klient zaakceptował rezultat bez poprawek, bo problem został rozwiązany.”',
      '„Wysłałem(-am) dziś 80 e‑maili i miałem(-am) 7 godzin spotkań, więc byłem(-am) bardzo zajęty(-a).”',
      '„Napisałem(-am) 15 notatek ze spotkań, ale nie podjęliśmy żadnej decyzji ani nie ruszyliśmy zadania.”',
      '„Zrobiłem(-am) 25 zadań z listy, ale najważniejszy problem klienta nadal nie jest rozwiązany.”',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    category: 'Course Specific',
    questionType: QuizQuestionType.APPLICATION,
    hashtags: tags(QuizQuestionType.APPLICATION, QuestionDifficulty.MEDIUM),
  });

  // Application 2: productivity formula thinking
  questions.push({
    question:
      'Produktywność = rezultat / ograniczenia. Która decyzja najbardziej zwiększa produktywność przy stałym czasie pracy?',
    options: [
      'Skupiam się na jednym kluczowym problemie klienta i doprowadzam go do zakończenia, zamiast mnożyć drobne aktywności.',
      'Dodaję kolejne spotkania statusowe, żeby “być na bieżąco”, nawet jeśli nie ma decyzji do podjęcia.',
      'Zwiększam liczbę wysyłanych wiadomości, bez mierzenia, czy coś realnie się zmieniło po drugiej stronie.',
      'Rozbijam pracę na jak najwięcej mikro‑zadań, aby wyglądało, że “dużo zrobiłem(-am)”.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    category: 'Course Specific',
    questionType: QuizQuestionType.APPLICATION,
    hashtags: tags(QuizQuestionType.APPLICATION, QuestionDifficulty.MEDIUM),
  });

  // Application 3: constraint identification (energy)
  questions.push({
    question:
      'Masz 8 godzin pracy, ale po południu spada Ci jakość decyzji i skupienia. Które “ograniczenie” powinieneś/powinnaś zoptymalizować w pierwszej kolejności?',
    options: [
      'Energię: zaplanować trudne zadania na czas największej świeżości i ograniczyć wyczerpujące aktywności.',
      'Zasoby: kupić nowe narzędzie, nawet jeśli problemem jest zmęczenie i brak regeneracji.',
      'Czas: wydłużyć dzień pracy, mimo że spadek energii obniża jakość rezultatu.',
      'Wynik: zwiększyć liczbę wykonanych czynności, aby “nadgonić”, bez poprawy energii.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    category: 'Course Specific',
    questionType: QuizQuestionType.APPLICATION,
    hashtags: tags(QuizQuestionType.APPLICATION, QuestionDifficulty.MEDIUM),
  });

  // Application 4: attention constraint and distractors
  questions.push({
    question:
      'Próbujesz pracować nad ważnym zadaniem, ale co kilka minut wracasz do czatu i powiadomień. Jaki krok jest najbardziej sensowny przy ograniczeniu uwagi?',
    options: [
      'Wyłączam powiadomienia i rezerwuję blok skupienia, bo produktywność zależy od rezultatu w ramach mojej uwagi.',
      'Zostawiam powiadomienia włączone, ale obiecuję sobie “będę silniejszy(-a)” i jakoś to wytrzymam.',
      'Dodaję więcej drobnych zadań równolegle, żeby nie czuć frustracji z jednego trudnego tematu.',
      'Zwiększam liczbę spotkań, bo wtedy “ktoś mnie poprowadzi” i nie muszę się skupiać.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    category: 'Course Specific',
    questionType: QuizQuestionType.APPLICATION,
    hashtags: tags(QuizQuestionType.APPLICATION, QuestionDifficulty.MEDIUM),
  });

  // Application 5: personal definition
  questions.push({
    question:
      'Która definicja produktywności jest najbardziej spójna (rezultat względem ograniczeń, a nie objętość działań)?',
    options: [
      'Produktywność to dostarczanie mierzalnych rezultatów przy świadomym zarządzaniu czasem, energią, uwagą i zasobami.',
      'Produktywność to robienie jak największej liczby rzeczy dziennie, aby “zawsze być zajętym”.',
      'Produktywność to wyłącznie liczba godzin przepracowanych w tygodniu, niezależnie od efektu.',
      'Produktywność to szybkie odpowiadanie na wiadomości, nawet jeśli nie przybliża to do celu.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    category: 'Course Specific',
    questionType: QuizQuestionType.APPLICATION,
    hashtags: tags(QuizQuestionType.APPLICATION, QuestionDifficulty.MEDIUM),
  });

  // Critical thinking 1: high output, low outcome
  questions.push({
    question:
      'Dlaczego “wysoki wynik” (dużo aktywności) może obniżać produktywność, mimo że czujesz, że pracujesz ciężko?',
    options: [
      'Bo aktywność zużywa ograniczenia (czas/energia/uwaga), a bez przełożenia na rezultat mianownik rośnie, a licznik nie.',
      'Bo każda aktywność automatycznie zamienia się w rezultat, więc to zawsze poprawia produktywność.',
      'Bo jedyną miarą produktywności jest liczba zadań odhaczonych na liście, niezależnie od celu.',
      'Bo rezultaty są losowe i nie da się nimi zarządzać, więc jedyne co pozostaje to zwiększać wynik.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.HARD,
    category: 'Course Specific',
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: tags(QuizQuestionType.CRITICAL_THINKING, QuestionDifficulty.HARD),
  });

  // Critical thinking 2: constraint tradeoff
  questions.push({
    question:
      'Zespół naciska na więcej spotkań “żeby kontrolować postęp”. Jakie jest największe ryzyko dla produktywności przy definicji: rezultat / ograniczenia?',
    options: [
      'Spotkania mogą zwiększyć “wynik” (aktywność), ale zabrać ograniczenia i obniżyć realny rezultat w kluczowych zadaniach.',
      'Spotkania zawsze zwiększają rezultat, bo sama synchronizacja jest równoznaczna z wykonaniem pracy.',
      'Spotkania nie wpływają na ograniczenia czasu i uwagi, więc nie mają kosztu dla produktywności.',
      'Spotkania automatycznie podnoszą energię zespołu, więc im więcej tym lepiej dla rezultatów.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.HARD,
    category: 'Course Specific',
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: tags(QuizQuestionType.CRITICAL_THINKING, QuestionDifficulty.HARD),
  });

  return questions;
}

/**
 * Language-specific question templates
 */
// Some languages use variant pools; keep the type flexible while still enforcing 4 options.
// For generator logic, the first option is treated as the "correct" before shuffling.
type Options4 = [string, string, string, string];
type Options4OrFn = Options4 | ((input: string) => Options4);

interface LanguageTemplates {
  criticalThinking: {
    question: (concept: string, goal: string) => string;
    options: (concept: string) => Options4;
  };
  application: {
    practice: (practice: string) => string;
    keyTerm: (keyTerm: string) => string;
    options: {
      practice: Options4OrFn;
      keyTerm: Options4OrFn;
    };
  };
  recall: {
    keyTerm: (keyTerm: string, title?: string) => string;
    topic: (topic: string) => string;
    fallback: (title: string) => string;
    options: {
      keyTerm: (keyTerm: string) => [string, string, string, string];
      topic: (topic: string) => [string, string, string, string];
      fallback: [string, string, string, string];
    };
  };
}

function getLanguageTemplates(language: string, title: string): LanguageTemplates {
  const lang = language.toLowerCase();
  const titleSeed = String(title || '').trim();
  const topicHint = (() => {
    const cleaned = titleSeed.replace(/\s+/g, ' ').trim();
    if (!cleaned) return '';
    const parts = cleaned.split(/[—–-]/).map(s => s.trim()).filter(Boolean);
    return parts[0] || cleaned;
  })();
  const pickOne = <T,>(seed: string, pool: T[]): T => pool[stableHash32(seed) % pool.length];
  
  // Russian templates
  if (lang === 'ru') {
    return {
      criticalThinking: {
        question: (concept, goal) => {
          const variants = [
            `Руководитель принимает решение по принципу: «${concept}». Какой эффект наиболее вероятен для достижения ${goal}, и какой типичный риск возникает при неправильной интерпретации или измерении?`,
            `В теме «${topicHint}» команда опирается на принцип: «${concept}». Какой эффект это даёт для ${goal}, и какой риск возникает при плохом измерении?`,
            `Менеджер применяет принцип «${concept}» как правило. Какой эффект наиболее вероятен для ${goal}, и какой риск типичен при неправильной реализации?`,
          ];
          return pickOne(`${concept}::${goal}::${titleSeed}::ru::ctq`, variants);
        },
        options: (concept) => [
          'Фокус усиливает результат, потому что вы выбираете одну ключевую метрику и устраняете “шум” в действиях; риск: выбор неверной метрики даёт видимость прогресса без реального эффекта.',
          'Достаточно увеличить количество задач и звонков, потому что активность всегда равна результату; риск: растёт занятость, но падают качество, приоритизация и ценность для клиента.',
          'Ограничения времени, энергии и внимания не важны, если “стараться сильнее”; риск: перегрузка, ошибки и выгорание ухудшают итоговый результат.',
          'Главное — максимальная скорость любой ценой; риск: переделки, ошибки и потеря доверия съедают время и замедляют достижение цели.',
        ]
      },
      application: {
        practice: (practice) => {
          const p = String(practice || '').trim();
          const variants = [
            `Вы внедряете новую практику в продажах: «${p}». Какой план даст измеримый результат и быструю обратную связь?`,
            `В работе по теме «${topicHint}» вы запускаете практику: «${p}». Какой план делает эффект проверяемым (до/после) и управляемым?`,
            `Вы вводите «${p}» как правило команды. Какой план приводит к измеримому выходу и регулярной проверке?`,
          ];
          return pickOne(`${p}::${titleSeed}::ru::practice-q`, variants);
        },
        keyTerm: (keyTerm) => {
          const k = String(keyTerm || '').trim();
          const variants = [
            `В процессе продаж по теме «${topicHint}» нужно перевести «${k}» в действия. Какой подход делает выход измеримым и проверяемым?`,
            `В CRM-процессе вы хотите внедрить «${k}». Какой подход делает результат измеримым, а не «по ощущениям»?`,
            `Команда обсуждает «${k}», но нужен понятный выход. Какой подход делает его проверяемым и повторяемым?`,
          ];
          return pickOne(`${k}::${titleSeed}::ru::keyterm-q`, variants);
        },
        options: {
          practice: (seedText: string) => {
            const practiceCorrectVariants = [
              'Внедряю по шагам: фиксирую базовую точку, задаю критерий успеха, делаю пилот на малом объёме и сравниваю “до/после” перед расширением.',
              'Определяю владельца, критерий “готово” и одну метрику, запускаю пилот на небольшой выборке и меняю только одну переменную за итерацию.',
            ];
            const practiceDistractorPool = [
              'Меняю всё сразу без метрик и контрольных точек, а затем пытаюсь “угадать”, что сработало.',
              'Начинаю с максимального охвата (вся команда и все сделки), поэтому нет быстрой обратной связи и ясных причинно‑следственных связей.',
              'Делаю действия нерегулярно и без владельца, надеясь на эффект без измерения и контроля.',
              'Делаю формально, но не проверяю результат по “до/после”, поэтому нельзя доказать улучшение.',
              'Ставлю метрику, но не задаю правило решения (что делаем при X), поэтому измерение не приводит к изменениям.',
              'Меняю инструмент (таблица/CRM) вместо правил работы, поэтому выход остаётся неуправляемым и несопоставимым.',
              'Добавляю больше статусов и созвонов вместо улучшения процесса; в итоге растёт занятость, но не растёт результат.',
            ];
            const correct = pickOne(`${seedText}::${titleSeed}::ru::practice-c`, practiceCorrectVariants);
            const distractors = pickUniqueFromPool(`${seedText}::${titleSeed}::ru::practice-d`, practiceDistractorPool, 3);
            return [correct, distractors[0], distractors[1], distractors[2]] as Options4;
          },
          keyTerm: (seedText: string) => {
            const keyTermCorrectVariants = [
              'Определяю “готово” через конкретный артефакт/решение, выбираю одну метрику, тестирую на одном кейсе, фиксирую “до/после” и расширяю только после подтверждения эффекта.',
              'Перевожу термин в чек‑лист действий с владельцем и порогом успеха, провожу короткий пилот и проверяю эффект на той же выборке.',
            ];
            const keyTermDistractorPool = [
              'Использую термин как лозунг без чек‑листа и измерения, поэтому результат не проверяем и не повторяем.',
              'Выполняю действия без владельца, сроков и порогов успеха; результат расплывается и не влияет на итоговую цель.',
              'Откладываю запуск, пытаясь сделать “идеально”; риск: теряется темп, копятся незавершённые задачи и падает качество решения.',
              'Оптимизирую сразу много параметров, поэтому невозможно понять, что именно дало эффект.',
              'Считаю, что “больше активности” равно результату; итог — занятость растёт, а ценность для клиента не меняется.',
              'Делаю один раз, но не документирую шаги; процесс не повторяется и не масштабируется.',
              'Измеряю “занятость” вместо результата, поэтому можно улучшить метрику без улучшения исхода.',
            ];
            const correct = pickOne(`${seedText}::${titleSeed}::ru::keyterm-c`, keyTermCorrectVariants);
            const distractors = pickUniqueFromPool(`${seedText}::${titleSeed}::ru::keyterm-d`, keyTermDistractorPool, 3);
            return [correct, distractors[0], distractors[1], distractors[2]] as Options4;
          },
        }
      },
      recall: {
        keyTerm: (keyTerm, titleParam?: string) => {
          const lessonTitle = titleParam || title;
          if (keyTerm.length > 15) {
            return `Какую роль играет ${keyTerm} в уроке "${lessonTitle}"?`;
          }
          return `Насколько важен ${keyTerm} в контексте ${lessonTitle}, как обсуждается в уроке?`;
        },
        topic: (topic) => `Что содержит раздел "${topic}" в уроке?`,
        fallback: (title) => `Какой элемент является частью методологии, подробно описанной в уроке "${title}"?`,
        options: {
          keyTerm: (keyTerm) => [
            `${keyTerm} помогает принимать решения и измерять прогресс через критерии, метрики и конкретные шаги.`,
            `${keyTerm} относится только к “мотивирующим словам” и не влияет на практические действия.`,
            `${keyTerm} полезен лишь в теории и не предполагает проверяемого применения.`,
            `${keyTerm} не связан с решениями и не влияет на достижение целей.`,
          ],
          topic: (topic) => [
            `Практические методы, примеры и шаги, которые помогают применить “${topic}” и проверить результат.`,
            `Общие рассуждения без критериев успеха и без применимых шагов.`,
            `Только определения без примеров и без способов проверить применение.`,
            `Набор несвязанных фактов, которые не помогают принять решение.`,
          ],
          fallback: [
            'Конкретные шаги, критерии успеха и проверка результата через “до/после”.',
            'Общие принципы без метрик и без правил применения.',
            'Теория без практических сценариев и без проверки.',
            'Действия “на удачу” без структуры и без контроля результата.',
          ]
        }
      }
    };
  }
  
  // Turkish templates
  if (lang === 'tr') {
    const pickOne = <T,>(seed: string, pool: T[]): T => pool[stableHash32(seed) % pool.length];
    const pickThree = (seed: string, pool: string[]) => pickUniqueFromPool(seed, pool, 3);
    const safeTitle = String(title || '').trim().replace(/\"/g, "'");
    const titleHint = safeTitle ? ` (ders: "${safeTitle}")` : '';

    return {
      criticalThinking: {
        question: (concept, goal) => {
          const variants = [
            `Bir lider su ilkeye gore karar veriyor: “${concept}”${titleHint}. ${goal} hedefine ulasmada en olasi etki nedir ve yanlis yorumlanir/yanlis olculurse tipik risk hangisidir?`,
            `Bir ekip “${concept}” ilkesine gore oncelik veriyor${titleHint}. ${goal} hedefine ulasmada en olasi etki nedir ve kotu olcum/yanlis yorum riski hangisidir?`,
            `Bir yonetici “${concept}” ilkesini uyguluyor${titleHint}. ${goal} icin en olasi etki nedir ve tipik risk hangi durumda ortaya cikar?`,
            `Bu derste${titleHint} “${concept}” prensibiyle karar aliniyor. ${goal} icin en olasi etki nedir ve hangi risk yanlis olcumde ortaya cikar?`,
          ];
          return pickOne(`${concept}::${goal}::ctq`, variants);
        },
        options: (concept) => {
          const correctVariants = [
            'Dogru odak, kisitlar altinda en yuksek etkili ciktiyi artirir; risk: yanlis metrige optimize olup busy output uretmek.',
            'Dogru odak, sinirli kaynaklari en etkili ciktiya yonlendirir; risk: yanlis metrikle sahte ilerleme gormek.',
          ];
          const distractorPool = [
            'Daha cok is yapmak otomatik olarak daha cok sonuc getirir; risk: aktivite artar ama kalite ve musteri degeri duser.',
            'Kisitlar (zaman/enerji/dikkat) onemsizdir; risk: asiri yuklenme, hata ve tukenmislik sonucu bozar.',
            'Once hiz, kalite sonra; risk: rework artar, throughput duser ve guven kaybi olur.',
            'Her seyi ayni anda optimize etmek en iyisidir; risk: tek bir degisken olmadigi icin ogrenme cikmaz.',
            'Sadece cikti sayisini artirmak yeterlidir; risk: outcome yerine isaretler optimize edilir.',
          ];
          const correct = pickOne(`${concept}::ctc`, correctVariants);
          const distractors = pickThree(`${concept}::ctd`, distractorPool);
          return [correct, distractors[0], distractors[1], distractors[2]] as Options4;
        },
      },
      application: {
        practice: (practice) => {
          const variants = [
            `Yeni bir uygulamayi devreye aliyorsunuz: “${practice}”${titleHint}. Hangi plan olculebilir cikti ve hizli geri bildirim saglar?`,
            `Ekibinle yeni bir pratigi deniyorsun: “${practice}”${titleHint}. Hangi plan olculebilir sonuc ve hizli geri bildirim uretir?`,
            `Bir haftalik pilot baslatiyorsun: “${practice}”${titleHint}. Hangi plan olculebilir ciktiyi ve geri bildirim dongusunu saglar?`,
            `Bu derste${titleHint} “${practice}” pratigi icin pilot yapiyorsun. Hangi plan once/sonra olcumu ve hizli iterasyonu saglar?`,
          ];
          return pickOne(`${practice}::apq`, variants);
        },
        keyTerm: (keyTerm) => {
          const variants = [
            `Bir projede “${keyTerm}” kavramini aksiyona donusturmeniz gerekiyor${titleHint}. Hangi yaklasim ciktıyı olculebilir ve dogrulanabilir yapar?`,
            `Bu derste${titleHint} “${keyTerm}” kavramini uygulamaya ceviriyorsun. Hangi yaklasim basariyi test edilebilir hale getirir?`,
            `Takimin “${keyTerm}” icin somut deliverable cikarmasi gerekiyor${titleHint}. Hangi yaklasim outputu olculebilir yapar?`,
          ];
          return pickOne(`${keyTerm}::akq`, variants);
        },
        options: {
          practice: (practice: string) => {
            const correctVariants = [
              'Adim adim uygularim: kriter/metrik belirlerim, kucuk kapsamda pilot yaparim, once/sonra olcer ve tek bir degiskeni degistiririm.',
              'Kucuk scope ile pilot baslatirim, baslangic metrigi koyarim, haftalik review ile ayarlar ve etkisi kanitlaninca genisletirim.',
              'Bir owner atarim, basari esigi tanimlarim, ayni orneklemde once/sonra olcer ve sadece dogrulanan degisiklikleri yayarim.',
            ];
            const distractorPool = [
              'Her seyi ayni anda degistiririm; olcum ve kontrol noktasi olmadan neyin ise yaradigini bilemem.',
              'Uygulamayi baslatirim ama once/sonra olcumu yapmam; etkisi belirsiz kalir.',
              'Sadece okuyup gecerim; sisteme entegre etmedigim icin davranis ve sonuc degismez.',
              'Cok fazla hedef/metrik eklerim; tek bir degisken olmadigi icin ogrenme cikmaz.',
              'Bir kere denerim ama dokumante etmem; tekrar edilemez ve olculemez kalir.',
              'Owner ve esik tanimlamadan yayarim; sorumluluk dagilir ve sonuc outcome ile baglanmaz.',
            ];
            const correct = pickOne(`${practice}::apc`, correctVariants);
            const distractors = pickThree(`${practice}::apd`, distractorPool);
            return [correct, distractors[0], distractors[1], distractors[2]] as Options4;
          },
          keyTerm: (keyTerm: string) => {
            const correctVariants = [
              '“Bitti” kriteri yazarim, bir metrik secerim, tek bir ornekte uygular ve etkiyi dogruladiktan sonra genisletirim.',
              'Net kriter/olcum tanimlarim, kucuk bir deneme yaparim, once/sonra karsilastirir ve sonra yayarim.',
            ];
            const distractorPool = [
              'Kavrami slogan gibi kullanirim; checklist ve olcum olmadigi icin dogrulanabilir cikti uretmem.',
              'Mukemmel olsun diye surekli ertelerim; throughput duser ve carryover artar.',
              'Yaparim ama sahip/sure/basari esigi tanimlamam; sonuc dagilir ve outcomea baglanmaz.',
              'Sadece toplantida konusur, is akisina indirmem; bu yuzden sonuc uretmez.',
              'Cok fazla seyi ayni anda degistiririm; hangi adimin etki yaptigi anlasilmaz.',
            ];
            const correct = pickOne(`${keyTerm}::akc`, correctVariants);
            const distractors = pickThree(`${keyTerm}::akd`, distractorPool);
            return [correct, distractors[0], distractors[1], distractors[2]] as Options4;
          },
        }
      },
      recall: {
        keyTerm: (keyTerm, titleParam?: string) => {
          const lessonTitle = titleParam || title;
          if (keyTerm.length > 15) {
            return `${keyTerm} "${lessonTitle}" dersinde nasıl bir rol oynar?`;
          }
          return `Ders içinde tartışıldığı gibi ${keyTerm} ${lessonTitle} bağlamında ne kadar önemlidir?`;
        },
        topic: (topic) => `"${topic}" bölümü ders içinde ne içerir?`,
        fallback: (title) => `"${title}" ders içinde detaylı olarak açıklanan metodolojinin hangi öğesi bir parçasıdır?`,
        options: {
          keyTerm: (keyTerm) => [
            `Ders içinde detaylı olarak açıklandığı gibi, ${keyTerm} süreçlerin optimize edilmesinde ve hedeflere ulaşmada kritik bir rol oynar`,
            'Sadece önemsiz bilgi, önemli bir rolü yok',
            'Sadece teorik bir kavram, pratik uygulaması yok',
            'Ders içinde bahsedilmiyor'
          ],
          topic: (topic) => [
            `Ders içinde detaylı olarak açıklandığı gibi ${topic.toLowerCase()} ile ilgili spesifik bilgi, yöntemler ve örnekler`,
            'Sadece genel bilgi',
            'Sadece teorik bilgi',
            'Spesifik içerik yok'
          ],
          fallback: [
            'Ders içinde bahsedilen ve detaylı olarak açıklanan spesifik adımlar ve en iyi uygulamalar',
            'Sadece genel ilkeler',
            'Sadece teorik bilgi',
            'Spesifik metodoloji yok'
          ]
        }
      }
    };
  }
  
  // Bulgarian templates
  if (lang === 'bg') {
    const pickOne = <T,>(seed: string, pool: T[]): T => pool[stableHash32(seed) % pool.length];
    const pickThree = (seed: string, pool: string[]) => pickUniqueFromPool(seed, pool, 3);
    const safeTitle = String(title || '').trim().replace(/\"/g, "'");
    const titleHint = safeTitle ? ` (урок: "${safeTitle}")` : '';

    return {
      criticalThinking: {
        question: (concept, goal) => {
          const variants = [
            `Лидер взема решения по принцип: „${concept}“${titleHint}. Какъв е най-вероятният ефект за постигане на ${goal} и кой е типичният риск при грешно тълкуване/измерване?`,
            `Екип приоритизира по принцип: „${concept}“${titleHint}. Как това най-вероятно влияе на ${goal} и какъв риск се появява при лошо измерване?`,
            `Мениджър прилага „${concept}“ в ежедневната работа${titleHint}. Кой е най-вероятният ефект за ${goal} и в какво се крие типичният капан?`,
            `В урока${titleHint} прилагате „${concept}“. Какъв е най-вероятният ефект за ${goal} и какъв риск идва от грешна метрика?`,
          ];
          return pickOne(`${concept}::${goal}::bg-ctq`, variants);
        },
        options: (concept) => {
          const correctVariants = [
            'Добрият фокус насочва ограничените ресурси към най-важния резултат; риск: оптимизираш грешна метрика и получаваш „видима активност“ без реален ефект.',
            'Добрият фокус увеличава outcome, защото режеш шума и пазиш ограниченията; риск: избираш грешен показател и се самозалъгваш с „busy output“.',
          ];
          const distractorPool = [
            'Достатъчно е просто да правиш повече задачи; риск: активността расте, но качеството и стойността за клиента падат.',
            'Ограниченията (време/енергия/внимание) не са важни; риск: претоварване, грешки и бърнаут влошават резултатите.',
            'Скоростта е по-важна от качеството; риск: преработката изяжда throughput и доверието пада.',
            'Най-доброто е да оптимизираш всичко едновременно; риск: няма ясен сигнал кое работи и не учиш нищо.',
            'Ако всички са заети, значи имаме прогрес; риск: мериш шум вместо резултат.',
          ];
          const correct = pickOne(`${concept}::bg-ctc`, correctVariants);
          const distractors = pickThree(`${concept}::bg-ctd`, distractorPool);
          return [correct, distractors[0], distractors[1], distractors[2]] as Options4;
        },
      },
      application: {
        practice: (practice) => {
          const variants = [
            `Въвеждате нова практика: „${practice}“${titleHint}. Кой план дава измерим изход и бърза обратна връзка?`,
            `Пускате пилот за „${practice}“${titleHint}. Кой план прави резултата измерим и позволява бърза корекция?`,
            `Екипът тества „${practice}“ за 1 седмица${titleHint}. Кой подход дава проверим ефект (преди/след)?`,
            `В урока${titleHint} внедрявате „${practice}“. Кой план осигурява бърз feedback loop и измерим резултат?`,
          ];
          return pickOne(`${practice}::bg-apq`, variants);
        },
        keyTerm: (keyTerm) => {
          const variants = [
            `В проект трябва да превърнете „${keyTerm}“ в действия${titleHint}. Кой подход прави изхода измерим и проверим?`,
            `Трябва да приложите „${keyTerm}“ в реален кейс${titleHint}. Кой подход прави успеха проверим, а не „усещане“?`,
            `В урока${titleHint} „${keyTerm}“ трябва да стане deliverable. Кой подход гарантира проверимост?`,
          ];
          return pickOne(`${keyTerm}::bg-akq`, variants);
        },
        options: {
          practice: (practice: string) => {
            const correctVariants = [
              'Въвеждам стъпка по стъпка: дефинирам критерии/метрики, правя пилот с малък обхват, измервам преди/след и коригирам по една промяна.',
              'Започвам с малък пилот, слагам базова метрика, правя кратък review всяка седмица и разширявам само след доказан ефект.',
              'Назначавам owner, дефинирам праг за успех и измервам преди/след върху съпоставим пример, преди да скалирам.',
            ];
            const distractorPool = [
              'Променям всичко наведнъж без метрики и контролни точки и после гадая какво е сработило.',
              'Започвам, но не измервам ефекта (няма преди/след), така че качеството на резултата е неизвестно.',
              'Добавям твърде много метрики/цели наведнъж; без „една променлива“ не знам кое работи.',
              'Пускам без owner и без праг за успех; после спорим „дали е добре“ без доказателство.',
              'Правя го веднъж, но не документирам; не е повторяемо и не може да се подобрява.',
            ];
            const correct = pickOne(`${practice}::bg-apc`, correctVariants);
            const distractors = pickThree(`${practice}::bg-apd`, distractorPool);
            return [correct, distractors[0], distractors[1], distractors[2]] as Options4;
          },
          keyTerm: (keyTerm: string) => {
            const correctVariants = [
              'Описвам „готово“ (критерий), избирам една метрика, прилагам в един кейс и разширявам само след потвърден ефект.',
              'Дефинирам критерий и праг, тествам в един сценарий, измервам преди/след и разширявам при доказан резултат.',
            ];
            const distractorPool = [
              'Използвам термина като лозунг без чеклист и измерване — резултатът не е проверим и не е повторяем.',
              'Отлагам, докато стане „перфектно“; това забавя завършването и увеличава прехвърлените задачи.',
              'Действам без собственик/срок/праг и затова резултатът не води до проверима промяна.',
              'Говоря за него на срещи, но не го вкарвам в процеса; няма промяна в поведението и резултата.',
              'Пробвам много неща наведнъж; не мога да изолирам кое е дало ефект.',
            ];
            const correct = pickOne(`${keyTerm}::bg-akc`, correctVariants);
            const distractors = pickThree(`${keyTerm}::bg-akd`, distractorPool);
            return [correct, distractors[0], distractors[1], distractors[2]] as Options4;
          },
        }
      },
      recall: {
        keyTerm: (keyTerm, titleParam?: string) => {
          const lessonTitle = titleParam || title;
          if (keyTerm.length > 15) {
            return `Каква роля играе ${keyTerm} в урока "${lessonTitle}"?`;
          }
          return `Колко важен е ${keyTerm} в контекста на ${lessonTitle}, както се обсъжда в урока?`;
        },
        topic: (topic) => `Какво съдържа разделът "${topic}" в урока?`,
        fallback: (title) => `Кой елемент е част от методологията, описана подробно в урока "${title}"?`,
        options: {
          keyTerm: (keyTerm) => [
            `Както е подробно описано в урока, ${keyTerm} играе ключова роля в оптимизирането на процесите и постигането на целите`,
            'Само периферна информация без значителна роля',
            'Само теоретична концепция без практическо приложение',
            'Не се споменава в урока'
          ],
          topic: (topic) => [
            `Конкретна информация, методи и примери, свързани с ${topic.toLowerCase()}, както е описано подробно в урока`,
            'Само обща информация',
            'Само теоретични знания',
            'Няма конкретно съдържание'
          ],
          fallback: [
            'Конкретните стъпки и най-добри практики, споменати и описани подробно в урока',
            'Само общи принципи',
            'Само теоретични знания',
            'Няма конкретна методология'
          ]
        }
      }
    };
  }
  
  // Polish templates
  if (lang === 'pl') {
    const pickOne = <T,>(seed: string, pool: T[]): T => pool[stableHash32(seed) % pool.length];
    const pickThree = (seed: string, pool: string[]) => pickUniqueFromPool(seed, pool, 3);
    const safeTitle = String(title || '').trim().replace(/\"/g, "'");
    const titleHint = safeTitle ? ` (lekcja: "${safeTitle}")` : '';

    return {
      criticalThinking: {
        question: (concept, goal) => {
          const variants = [
            `Lider podejmuje decyzje według zasady: „${concept}”${titleHint}. Jaki efekt jest najbardziej prawdopodobny dla osiągnięcia ${goal} i jakie typowe ryzyko pojawia się przy błędnej interpretacji lub pomiarze?`,
            `Zespół priorytetyzuje zgodnie z „${concept}”${titleHint}. Co najbardziej pomaga w ${goal}, a gdzie pojawia się typowa pułapka, gdy źle mierzysz postęp?`,
            `Menedżer wdraża „${concept}” w praktyce${titleHint}. Jaki jest najbardziej prawdopodobny wpływ na ${goal} i jaki błąd pomiaru robi się najczęściej?`,
            `W lekcji${titleHint} stosujesz „${concept}”. Jaki efekt jest najbardziej prawdopodobny dla ${goal} i gdzie jest typowy błąd w metrykach?`,
          ];
          return pickOne(`${concept}::${goal}::pl-ctq`, variants);
        },
        options: (concept) => {
          const correctVariants = [
            'Dobry fokus zwiększa wynik, bo optymalizuje output pod ograniczenia; ryzyko: optymalizacja złej metryki daje „busy output” bez realnego outcome.',
            'Dobry fokus kieruje zasoby w stronę najważniejszego outcome; ryzyko: wybierasz zły wskaźnik i widzisz „postęp” tylko na papierze.',
          ];
          const distractorPool = [
            'Wystarczy robić więcej zadań, bo aktywność = rezultat; ryzyko: rośnie hałas, spada jakość i wartość dla klienta.',
            'Ograniczenia (czas/energia/uwaga) są nieważne; ryzyko: przeciążenie, błędy i wypalenie obniżają outcome.',
            'Najważniejsza jest szybkość, jakość poprawimy później; ryzyko: rework i zwroty zjadają throughput.',
            'Najlepiej optymalizować wszystko naraz; ryzyko: nie da się wyciągnąć wniosków, co działa.',
            'Jeśli wszyscy są zajęci, to znaczy że jest progres; ryzyko: mierzysz szum zamiast efektu.',
          ];
          const correct = pickOne(`${concept}::pl-ctc`, correctVariants);
          const distractors = pickThree(`${concept}::pl-ctd`, distractorPool);
          return [correct, distractors[0], distractors[1], distractors[2]] as Options4;
        },
      },
      application: {
        practice: (practice) => {
          const variants = [
            `Wdrażasz nową praktykę: „${practice}”${titleHint}. Który plan wdrożenia daje mierzalny output i szybką informację zwrotną?`,
            `Uruchamiasz pilotaż „${practice}” na tydzień${titleHint}. Który plan pozwala mierzyć efekt i szybko korygować?`,
            `Zespół testuje „${practice}” w małym zakresie${titleHint}. Który plan daje weryfikowalny wynik (przed/po)?`,
            `W lekcji${titleHint} testujesz „${practice}”. Który plan buduje szybki feedback loop i dowód efektu?`,
          ];
          return pickOne(`${practice}::pl-apq`, variants);
        },
        keyTerm: (keyTerm) => {
          const variants = [
            `W projekcie musisz przełożyć „${keyTerm}” na działania${titleHint}. Które podejście czyni output mierzalnym i weryfikowalnym?`,
            `Chcesz zastosować „${keyTerm}” w realnym case${titleHint}. Które podejście sprawia, że sukces jest sprawdzalny, a nie „na oko”?`,
            `W lekcji${titleHint} „${keyTerm}” ma stać się deliverable. Które podejście daje weryfikację?`,
          ];
          return pickOne(`${keyTerm}::pl-akq`, variants);
        },
        options: {
          practice: (practice: string) => {
            const correctVariants = [
              'Wdrażam krok po kroku: definiuję kryteria/metryki, robię pilota na małym zakresie, mierzę przed/po i zmieniam po jednej regule.',
              'Zaczynam od małego pilota, ustawiam metrykę bazową, robię krótki przegląd co tydzień i rozszerzam dopiero po potwierdzonym efekcie.',
              'Wyznaczam ownera, próg sukcesu i mierzę przed/po na porównywalnym przykładzie zanim zeskaluję.',
            ];
            const distractorPool = [
              'Zmieniam wszystko naraz bez metryk i punktów kontrolnych, a potem zgaduję, co zadziałało.',
              'Startuję, ale bez pomiaru efektu (brak przed/po), więc nie wiem, czy wynik jest lepszy.',
              'Dodaję zbyt wiele metryk/celów naraz; bez jednej zmiennej nie wiem, co działa.',
              'Wdrażam bez ownera i bez progu sukcesu; potem dyskusja jest „na wrażenia”.',
              'Robię to raz, ale nie dokumentuję; nie da się powtórzyć ani ulepszać.',
            ];
            const correct = pickOne(`${practice}::pl-apc`, correctVariants);
            const distractors = pickThree(`${practice}::pl-apd`, distractorPool);
            return [correct, distractors[0], distractors[1], distractors[2]] as Options4;
          },
          keyTerm: (keyTerm: string) => {
            const correctVariants = [
              'Piszę kryterium „done”, wybieram jedną metrykę, stosuję na jednym case i rozszerzam dopiero po potwierdzonym efekcie.',
              'Definiuję kryterium i próg, testuję na jednym scenariuszu, mierzę przed/po i dopiero potem rozszerzam.',
            ];
            const distractorPool = [
              'Używam pojęcia jak hasła bez checklisty i pomiaru — output nie jest weryfikowalny ani powtarzalny.',
              'Odkładam wdrożenie, aż będzie „idealnie”; throughput spada i rośnie carryover.',
              'Działam bez właściciela/terminu/progu, więc rezultat nie przekłada się na outcome.',
              'Mówię o tym na spotkaniach, ale nie wpinam w proces; nie ma zmiany zachowania ani efektu.',
              'Zmieniam dużo rzeczy naraz; nie umiem wskazać, co dało efekt.',
            ];
            const correct = pickOne(`${keyTerm}::pl-akc`, correctVariants);
            const distractors = pickThree(`${keyTerm}::pl-akd`, distractorPool);
            return [correct, distractors[0], distractors[1], distractors[2]] as Options4;
          },
        }
      },
      recall: {
        keyTerm: (keyTerm, titleParam?: string) => {
          const lessonTitle = titleParam || title;
          if (keyTerm.length > 15) {
            return `Jaką rolę odgrywa ${keyTerm} w lekcji "${lessonTitle}"?`;
          }
          return `Jak ważny jest ${keyTerm} w kontekście ${lessonTitle}, jak omówiono w lekcji?`;
        },
        topic: (topic) => `Co zawiera sekcja "${topic}" w lekcji?`,
        fallback: (title) => `Który element jest częścią metodologii szczegółowo opisanej w lekcji "${title}"?`,
        options: {
          keyTerm: (keyTerm) => [
            `Jak szczegółowo opisano w lekcji, ${keyTerm} odgrywa kluczową rolę w optymalizacji procesów i osiąganiu celów`,
            'Tylko peryferyjne informacje bez znaczącej roli',
            'Tylko teoretyczna koncepcja bez praktycznego zastosowania',
            'Nie wspomniano w lekcji'
          ],
          topic: (topic) => [
            `Konkretne informacje, metody i przykłady związane z ${topic.toLowerCase()}, jak szczegółowo opisano w lekcji`,
            'Tylko ogólne informacje',
            'Tylko wiedza teoretyczna',
            'Brak konkretnej treści'
          ],
          fallback: [
            'Konkretne kroki i najlepsze praktyki wspomniane i szczegółowo opisane w lekcji',
            'Tylko ogólne zasady',
            'Tylko wiedza teoretyczna',
            'Brak konkretnej metodologii'
          ]
        }
      }
    };
  }
  
  // Vietnamese templates
  if (lang === 'vi') {
    const pickOne = <T,>(seed: string, pool: T[]): T => pool[stableHash32(seed) % pool.length];
    const pickThree = (seed: string, pool: string[]) => pickUniqueFromPool(seed, pool, 3);
    const safeTitle = String(title || '').trim().replace(/\"/g, "'");
    const titleHint = safeTitle ? ` (bai hoc: "${safeTitle}")` : '';

    return {
      criticalThinking: {
        question: (concept, goal) => {
          const variants = [
            `Một lãnh đạo ra quyết định theo nguyên tắc: “${concept}”${titleHint}. Tác động nào có khả năng nhất để đạt ${goal}, và rủi ro điển hình nào xảy ra nếu hiểu sai hoặc đo sai?`,
            `Một nhóm ưu tiên theo “${concept}”${titleHint}. Điều gì có khả năng giúp nhất cho ${goal}, và bẫy thường gặp khi đo lường sai là gì?`,
            `Một quản lý áp dụng “${concept}” trong thực tế${titleHint}. Tác động có khả năng nhất lên ${goal} là gì, và rủi ro thường gặp khi diễn giải/đo sai?`,
          ];
          return pickOne(`${concept}::${goal}::vi-ctq`, variants);
        },
        options: (concept) => {
          const correctVariants = [
            'Tập trung đúng giúp tăng kết quả vì tối ưu output dưới các giới hạn; rủi ro: tối ưu sai metric tạo “output bận rộn” nhưng không cải thiện outcome.',
            'Tập trung đúng điều hướng nguồn lực vào outcome quan trọng; rủi ro: chọn sai chỉ số khiến “tiến bộ” chỉ là bề mặt.',
          ];
          const distractorPool = [
            'Chỉ cần làm nhiều việc hơn vì hoạt động = kết quả; rủi ro: tăng nhiễu, giảm chất lượng và giá trị cho khách hàng.',
            'Bỏ qua giới hạn (thời gian/năng lượng/chú ý) vì “cố gắng là đủ”; rủi ro: quá tải, sai sót và kiệt sức làm outcome xấu đi.',
            'Ưu tiên tốc độ, chất lượng sửa sau; rủi ro: rework tăng và throughput giảm.',
            'Tối ưu mọi thứ cùng lúc; rủi ro: không có tín hiệu rõ cái gì tạo ra cải thiện.',
            'Miễn ai cũng bận là ổn; rủi ro: đo sự bận rộn thay vì kết quả.',
          ];
          const correct = pickOne(`${concept}::vi-ctc`, correctVariants);
          const distractors = pickThree(`${concept}::vi-ctd`, distractorPool);
          return [correct, distractors[0], distractors[1], distractors[2]] as Options4;
        },
      },
      application: {
        practice: (practice) => {
          const variants = [
            `Bạn triển khai một thực hành mới: “${practice}”${titleHint}. Kế hoạch nào tạo output đo được và phản hồi nhanh?`,
            `Bạn chạy pilot “${practice}” trong 1 tuần${titleHint}. Kế hoạch nào cho phép đo trước/sau và điều chỉnh nhanh?`,
            `Nhóm thử “${practice}” ở scope nhỏ${titleHint}. Kế hoạch nào tạo feedback loop nhanh và chứng minh tác động?`,
          ];
          return pickOne(`${practice}::vi-apq`, variants);
        },
        keyTerm: (keyTerm) => {
          const variants = [
            `Trong một dự án, bạn cần biến “${keyTerm}” thành hành động${titleHint}. Cách tiếp cận nào làm output đo được và kiểm chứng được?`,
            `Bạn muốn áp dụng “${keyTerm}” vào case thật${titleHint}. Cách nào làm thành công “kiem chung duoc” thay vì cảm tính?`,
          ];
          return pickOne(`${keyTerm}::vi-akq`, variants);
        },
        options: {
          practice: (practice: string) => {
            const correctVariants = [
              'Triển khai từng bước: đặt tiêu chí/metric, chạy pilot nhỏ, đo trước/sau, ghi lại kết quả và chỉnh một rule mỗi lần.',
              'Bắt đầu scope nhỏ, đặt baseline metric, review hàng tuần và mở rộng chỉ khi tác động được chứng minh.',
              'Chỉ định owner, định nghĩa ngưỡng thành công, đo trước/sau trên mẫu tương đương rồi mới scale.',
            ];
            const distractorPool = [
              'Đổi tất cả cùng lúc, không có metric hay điểm kiểm tra, rồi đoán thứ gì đã hiệu quả.',
              'Bắt đầu nhưng không đo tác động (không có trước/sau), nên không biết chất lượng kết quả.',
              'Thêm quá nhiều mục tiêu/metric cùng lúc; không biết yếu tố nào tạo ra tác động.',
              'Triển khai không có owner và không có ngưỡng thành công; kết luận dựa vào cảm giác.',
              'Thử một lần nhưng không tài liệu hoá; khó lặp lại và cải tiến.',
            ];
            const correct = pickOne(`${practice}::vi-apc`, correctVariants);
            const distractors = pickThree(`${practice}::vi-apd`, distractorPool);
            return [correct, distractors[0], distractors[1], distractors[2]] as Options4;
          },
          keyTerm: (keyTerm: string) => {
            const correctVariants = [
              'Viết tiêu chí “done”, chọn một metric, áp dụng cho một case và mở rộng chỉ sau khi xác nhận tác động.',
              'Định nghĩa tiêu chí + ngưỡng, thử trên một kịch bản, đo trước/sau rồi mới mở rộng.',
            ];
            const distractorPool = [
              'Dùng khái niệm như khẩu hiệu nhưng không có checklist/đo lường — output không kiểm chứng và không lặp lại được.',
              'Trì hoãn cho đến khi “hoàn hảo”; throughput giảm và carryover tăng.',
              'Hành động nhưng không đo và không ghi lại, nên không biết có cải thiện hay không.',
              'Chỉ nói trong họp nhưng không đưa vào quy trình; không đổi hành vi nên không đổi kết quả.',
              'Đổi nhiều thứ cùng lúc; không thể biết bước nào tạo ra outcome.',
            ];
            const correct = pickOne(`${keyTerm}::vi-akc`, correctVariants);
            const distractors = pickThree(`${keyTerm}::vi-akd`, distractorPool);
            return [correct, distractors[0], distractors[1], distractors[2]] as Options4;
          },
        }
      },
      recall: {
        keyTerm: (keyTerm, titleParam?: string) => {
          const lessonTitle = titleParam || title;
          if (keyTerm.length > 15) {
            return `${keyTerm} đóng vai trò gì trong bài học "${lessonTitle}"?`;
          }
          return `${keyTerm} quan trọng như thế nào trong ngữ cảnh của ${lessonTitle} như được thảo luận trong bài học?`;
        },
        topic: (topic) => `Phần "${topic}" chứa gì trong bài học?`,
        fallback: (title) => `Yếu tố nào là một phần của phương pháp được mô tả chi tiết trong bài học "${title}"?`,
        options: {
          keyTerm: (keyTerm) => [
            `Như đã mô tả chi tiết trong bài học, ${keyTerm} đóng vai trò quan trọng trong việc tối ưu hóa quy trình và đạt được mục tiêu`,
            'Chỉ là thông tin ngoại vi không có vai trò quan trọng',
            'Chỉ là một khái niệm lý thuyết không có ứng dụng thực tế',
            'Không được đề cập trong bài học'
          ],
          topic: (topic) => [
            `Thông tin, phương pháp và ví dụ cụ thể liên quan đến ${topic.toLowerCase()} như đã mô tả chi tiết trong bài học`,
            'Chỉ là thông tin chung',
            'Chỉ là kiến thức lý thuyết',
            'Không có nội dung cụ thể'
          ],
          fallback: [
            'Các bước cụ thể và thực hành tốt nhất được đề cập và mô tả chi tiết trong bài học',
            'Chỉ là các nguyên tắc chung',
            'Chỉ là kiến thức lý thuyết',
            'Không có phương pháp cụ thể'
          ]
        }
      }
    };
  }
  
  // Indonesian templates
  if (lang === 'id') {
    const pickOne = <T,>(seed: string, pool: T[]): T => pool[stableHash32(seed) % pool.length];
    const pickThree = (seed: string, pool: string[]) => pickUniqueFromPool(seed, pool, 3);
    const safeTitle = String(title || '').trim().replace(/\"/g, "'");
    const titleHint = safeTitle ? ` (pelajaran: "${safeTitle}")` : '';

    return {
      criticalThinking: {
        question: (concept, goal) => {
          const variants = [
            `Seorang pemimpin mengambil keputusan dengan prinsip: “${concept}”${titleHint}. Dampak apa yang paling mungkin untuk mencapai ${goal}, dan risiko tipikal apa yang muncul jika salah menafsirkan atau salah mengukur?`,
            `Tim memprioritaskan berdasarkan “${concept}”${titleHint}. Apa dampak paling mungkin pada ${goal}, dan jebakan umum apa muncul saat metriknya keliru?`,
            `Manajer menerapkan “${concept}” dalam pekerjaan harian${titleHint}. Apa efek paling mungkin untuk ${goal} dan risiko khas jika pengukuran salah?`,
            `Dalam pelajaran${titleHint}, Anda menerapkan “${concept}”. Apa efek paling mungkin pada ${goal} dan risiko tipikal dari metrik yang salah?`,
          ];
          return pickOne(`${concept}::${goal}::id-ctq`, variants);
        },
        options: (concept) => {
          const correctVariants = [
            'Fokus yang benar meningkatkan hasil karena mengoptimalkan output di bawah batasan; risiko: mengoptimalkan metrik yang salah menghasilkan “output sibuk” tanpa outcome.',
            'Fokus yang benar mengarahkan sumber daya ke outcome paling penting; risiko: memilih metrik yang salah membuat progres terlihat tapi tidak nyata.',
          ];
          const distractorPool = [
            'Cukup menambah aktivitas karena aktivitas = hasil; risiko: noise naik, kualitas dan nilai untuk pelanggan turun.',
            'Mengabaikan batasan (waktu/energi/perhatian) karena “usaha saja cukup”; risiko: overload, error, dan burnout merusak outcome.',
            'Kecepatan nomor satu, kualitas belakangan; risiko: rework meningkat dan throughput turun.',
            'Optimalkan semuanya sekaligus; risiko: tidak ada sinyal jelas mana yang bekerja dan tidak ada pembelajaran.',
            'Yang penting semua orang sibuk; risiko: yang diukur adalah kesibukan, bukan hasil.',
          ];
          const correct = pickOne(`${concept}::id-ctc`, correctVariants);
          const distractors = pickThree(`${concept}::id-ctd`, distractorPool);
          return [correct, distractors[0], distractors[1], distractors[2]] as Options4;
        },
      },
      application: {
        practice: (practice) => {
          const variants = [
            `Anda menerapkan praktik baru: “${practice}”${titleHint}. Rencana mana yang menghasilkan output terukur dan umpan balik cepat?`,
            `Anda menjalankan pilot “${practice}” selama 1 minggu${titleHint}. Rencana mana yang membuat hasilnya terukur (sebelum/sesudah) dan mudah disesuaikan?`,
            `Tim mencoba “${practice}” dalam skala kecil${titleHint}. Pendekatan mana yang memberi feedback loop cepat dan bukti dampak?`,
            `Dalam pelajaran${titleHint}, Anda menjalankan “${practice}”. Pendekatan mana yang membuat efeknya bisa dibuktikan?`,
          ];
          return pickOne(`${practice}::id-apq`, variants);
        },
        keyTerm: (keyTerm) => {
          const variants = [
            `Dalam proyek, Anda harus mengubah “${keyTerm}” menjadi tindakan${titleHint}. Pendekatan mana yang membuat output terukur dan dapat diverifikasi?`,
            `Anda ingin menerapkan “${keyTerm}” pada kasus nyata${titleHint}. Pendekatan mana yang membuat suksesnya bisa diuji, bukan sekadar “rasa”?`,
            `Dalam pelajaran${titleHint}, “${keyTerm}” harus jadi deliverable. Pendekatan mana yang membuatnya verifiable?`,
          ];
          return pickOne(`${keyTerm}::id-akq`, variants);
        },
        options: {
          practice: (practice: string) => {
            const correctVariants = [
              'Saya menerapkan bertahap: tetapkan kriteria/metrik, pilot kecil, ukur sebelum/sesudah, dokumentasikan hasil, dan ubah satu rule per iterasi.',
              'Saya mulai dari scope kecil, pasang baseline metrik, review mingguan, dan perluas hanya setelah efek terbukti.',
              'Saya tetapkan owner dan ambang sukses, ukur sebelum/sesudah pada contoh yang sebanding, lalu skalakan yang terbukti.',
            ];
            const distractorPool = [
              'Saya mengubah semuanya sekaligus tanpa metrik dan checkpoint, lalu menebak apa yang berhasil.',
              'Saya mulai tetapi tidak mengukur dampak (tanpa sebelum/sesudah), jadi kualitas hasil tidak jelas.',
              'Saya menambahkan terlalu banyak metrik/tujuan sekaligus; tidak jelas apa yang memberi efek.',
              'Saya jalankan tanpa owner dan tanpa ambang sukses; akhirnya debatnya subjektif.',
              'Saya coba sekali tapi tidak dokumentasi; tidak repeatable dan sulit diperbaiki.',
            ];
            const correct = pickOne(`${practice}::id-apc`, correctVariants);
            const distractors = pickThree(`${practice}::id-apd`, distractorPool);
            return [correct, distractors[0], distractors[1], distractors[2]] as Options4;
          },
          keyTerm: (keyTerm: string) => {
            const correctVariants = [
              'Saya menulis kriteria “done”, memilih satu metrik, menerapkan pada satu kasus, lalu memperluas setelah efek terkonfirmasi.',
              'Saya definisikan kriteria dan ambang, uji pada satu skenario, ukur sebelum/sesudah, lalu baru perluas.',
            ];
            const distractorPool = [
              'Saya memakai istilah sebagai slogan tanpa checklist/ukur — output tidak bisa diverifikasi dan tidak repeatable.',
              'Saya menunda sampai “sempurna”; throughput turun dan carryover naik.',
              'Saya bertindak tanpa owner/target/ambang, sehingga hasilnya tidak bisa diuji.',
              'Saya hanya membahas di rapat tapi tidak memasukkan ke proses; tidak ada perubahan perilaku dan hasil.',
              'Saya mengubah banyak hal sekaligus; sulit tahu apa yang memperbaiki outcome.',
            ];
            const correct = pickOne(`${keyTerm}::id-akc`, correctVariants);
            const distractors = pickThree(`${keyTerm}::id-akd`, distractorPool);
            return [correct, distractors[0], distractors[1], distractors[2]] as Options4;
          },
        }
      },
      recall: {
        keyTerm: (keyTerm, titleParam?: string) => {
          const lessonTitle = titleParam || title;
          if (keyTerm.length > 15) {
            return `Apa peran ${keyTerm} dalam pelajaran "${lessonTitle}"?`;
          }
          return `Seberapa penting ${keyTerm} dalam konteks ${lessonTitle} seperti yang dibahas dalam pelajaran?`;
        },
        topic: (topic) => `Apa yang terkandung dalam bagian "${topic}" dalam pelajaran?`,
        fallback: (title) => `Elemen mana yang merupakan bagian dari metodologi yang dijelaskan secara detail dalam pelajaran "${title}"?`,
        options: {
          keyTerm: (keyTerm) => [
            `Seperti yang dijelaskan secara detail dalam pelajaran, ${keyTerm} memainkan peran penting dalam mengoptimalkan proses dan mencapai tujuan`,
            'Hanya informasi periferal tanpa peran signifikan',
            'Hanya konsep teoretis tanpa aplikasi praktis',
            'Tidak disebutkan dalam pelajaran'
          ],
          topic: (topic) => [
            `Informasi, metode, dan contoh spesifik terkait ${topic.toLowerCase()} seperti yang dijelaskan secara detail dalam pelajaran`,
            'Hanya informasi umum',
            'Hanya pengetahuan teoretis',
            'Tidak ada konten spesifik'
          ],
          fallback: [
            'Langkah-langkah spesifik dan praktik terbaik yang disebutkan dan dijelaskan secara detail dalam pelajaran',
            'Hanya prinsip umum',
            'Hanya pengetahuan teoretis',
            'Tidak ada metodologi spesifik'
          ]
        }
      }
    };
  }
  
  // Portuguese templates
  if (lang === 'pt') {
    const pickOne = <T,>(seed: string, pool: T[]): T => pool[stableHash32(seed) % pool.length];
    const pickThree = (seed: string, pool: string[]) => pickUniqueFromPool(seed, pool, 3);
    const safeTitle = String(title || '').trim().replace(/\"/g, "'");
    const titleHint = safeTitle ? ` (licao: "${safeTitle}")` : '';

    return {
      criticalThinking: {
        question: (concept, goal) => {
          const variants = [
            `Um líder decide com base no princípio: “${concept}”${titleHint}. Qual é o efeito mais provável para atingir ${goal}, e qual risco típico surge se isso for mal interpretado ou mal medido?`,
            `A equipe prioriza usando “${concept}”${titleHint}. O que mais ajuda em ${goal} e qual armadilha aparece quando a métrica está errada?`,
            `Um gestor aplica “${concept}” no dia a dia${titleHint}. Qual é o efeito mais provável em ${goal} e qual risco típico surge com medição fraca?`,
            `Na licao${titleHint}, voce aplica “${concept}”. Qual efeito e mais provavel em ${goal} e qual risco vem de medir mal?`,
          ];
          return pickOne(`${concept}::${goal}::pt-ctq`, variants);
        },
        options: (concept) => {
          const correctVariants = [
            'O foco correto aumenta o resultado porque otimiza o output sob restrições; risco: otimizar a métrica errada gera “output ocupado” sem melhorar o outcome.',
            'O foco correto direciona recursos para o outcome mais importante; risco: escolher a métrica errada cria progresso “visível” sem efeito real.',
          ];
          const distractorPool = [
            'Basta fazer mais tarefas porque atividade = resultado; risco: aumenta o ruído e cai a qualidade/valor para o cliente.',
            'Ignorar restrições (tempo/energia/atenção) porque “força de vontade resolve”; risco: sobrecarga, erros e burnout pioram o outcome.',
            'Velocidade acima de tudo e qualidade depois; risco: rework cresce e o throughput cai.',
            'O melhor é otimizar tudo ao mesmo tempo; risco: não há sinal claro do que funciona e não há aprendizagem.',
            'Se todos estão ocupados, então há progresso; risco: mede-se “correria” em vez de resultado.',
          ];
          const correct = pickOne(`${concept}::pt-ctc`, correctVariants);
          const distractors = pickThree(`${concept}::pt-ctd`, distractorPool);
          return [correct, distractors[0], distractors[1], distractors[2]] as Options4;
        },
      },
      application: {
        practice: (practice) => {
          const variants = [
            `Você vai implementar uma nova prática: “${practice}”${titleHint}. Qual plano produz output mensurável e feedback rápido?`,
            `Você inicia um piloto de “${practice}” por 1 semana${titleHint}. Qual plano mede o efeito (antes/depois) e permite ajustes rápidos?`,
            `A equipe testa “${practice}” em escopo pequeno${titleHint}. Qual abordagem cria um loop de feedback rápido e verificável?`,
            `Na licao${titleHint}, voce testa “${practice}”. Qual plano cria prova de efeito e ajuste rapido?`,
          ];
          return pickOne(`${practice}::pt-apq`, variants);
        },
        keyTerm: (keyTerm) => {
          const variants = [
            `Em um projeto, você precisa transformar “${keyTerm}” em ações${titleHint}. Qual abordagem torna o output mensurável e verificável?`,
            `Você quer aplicar “${keyTerm}” em um caso real${titleHint}. Qual abordagem torna o sucesso testável, e não “no feeling”?`,
            `Na licao${titleHint}, “${keyTerm}” precisa virar um deliverable. Qual abordagem deixa verificavel?`,
          ];
          return pickOne(`${keyTerm}::pt-akq`, variants);
        },
        options: {
          practice: (practice: string) => {
            const correctVariants = [
              'Implemento por etapas: defino critérios/métricas, faço um piloto pequeno, meço antes/depois, documento o resultado e ajusto uma regra por vez.',
              'Começo com escopo pequeno, defino metrica baseline, faço review semanal e amplio só com efeito comprovado.',
              'Defino owner e limiar de sucesso, meço antes/depois em um exemplo comparável e escalo apenas o que foi validado.',
            ];
            const distractorPool = [
              'Mudo tudo de uma vez sem métricas nem checkpoints e depois tento adivinhar o que funcionou.',
              'Começo, mas sem medir o impacto (sem antes/depois), então a qualidade do resultado fica desconhecida.',
              'Crio muitas metas/métricas ao mesmo tempo; não dá para saber o que causou o efeito.',
              'Executo sem owner e sem limiar de sucesso; vira discussão subjetiva.',
              'Testo uma vez, mas não documento; não é repetível nem dá para melhorar.',
            ];
            const correct = pickOne(`${practice}::pt-apc`, correctVariants);
            const distractors = pickThree(`${practice}::pt-apd`, distractorPool);
            return [correct, distractors[0], distractors[1], distractors[2]] as Options4;
          },
          keyTerm: (keyTerm: string) => {
            const correctVariants = [
              'Escrevo o critério de “done”, escolho uma métrica, aplico em um caso e amplio só depois de confirmar o efeito.',
              'Defino critério e limiar, testo em um cenário, meço antes/depois e só então amplio.',
            ];
            const distractorPool = [
              'Uso o termo como slogan sem checklist/medição — o output não é verificável nem repetível.',
              'Adio até ficar “perfeito”; o throughput cai e o carryover aumenta.',
              'Executo sem dono/prazo/limiar, então o resultado não é testável.',
              'Falo sobre isso em reuniões, mas não coloco no processo; não há mudança de comportamento nem de resultado.',
              'Mudo muitas coisas ao mesmo tempo; não consigo isolar o que melhorou o outcome.',
            ];
            const correct = pickOne(`${keyTerm}::pt-akc`, correctVariants);
            const distractors = pickThree(`${keyTerm}::pt-akd`, distractorPool);
            return [correct, distractors[0], distractors[1], distractors[2]] as Options4;
          },
        }
      },
      recall: {
        keyTerm: (keyTerm, titleParam?: string) => {
          const lessonTitle = titleParam || title;
          if (keyTerm.length > 15) {
            return `Qual papel ${keyTerm} desempenha na lição "${lessonTitle}"?`;
          }
          return `Quão importante é ${keyTerm} no contexto de ${lessonTitle}, conforme discutido na lição?`;
        },
        topic: (topic) => `O que a seção "${topic}" contém na lição?`,
        fallback: (title) => `Qual elemento faz parte da metodologia descrita em detalhes na lição "${title}"?`,
        options: {
          keyTerm: (keyTerm) => [
            `Conforme descrito em detalhes na lição, ${keyTerm} desempenha um papel crucial na otimização de processos e no alcance de objetivos`,
            'Apenas informações periféricas sem papel significativo',
            'Apenas um conceito teórico sem aplicação prática',
            'Não mencionado na lição'
          ],
          topic: (topic) => [
            `Informações, métodos e exemplos específicos relacionados a ${topic.toLowerCase()} conforme descrito em detalhes na lição`,
            'Apenas informações gerais',
            'Apenas conhecimento teórico',
            'Nenhum conteúdo específico'
          ],
          fallback: [
            'As etapas específicas e melhores práticas mencionadas e descritas em detalhes na lição',
            'Apenas princípios gerais',
            'Apenas conhecimento teórico',
            'Nenhuma metodologia específica'
          ]
        }
      }
    };
  }
  
  // Hindi templates
  if (lang === 'hi') {
    const pickOne = <T,>(seed: string, pool: T[]): T => pool[stableHash32(seed) % pool.length];
    const pickThree = (seed: string, pool: string[]) => pickUniqueFromPool(seed, pool, 3);
    const safeTitle = String(title || '').trim().replace(/\"/g, "'");
    const titleHint = safeTitle ? ` (पाठ: "${safeTitle}")` : '';

    return {
      criticalThinking: {
        question: (concept, goal) => {
          const variants = [
            `एक नेता इस सिद्धांत पर निर्णय लेता है: “${concept}”${titleHint}. ${goal} हासिल करने पर सबसे संभावित असर क्या होगा, और गलत लागू/गलत मापने पर कौन-सा सामान्य जोखिम होगा?`,
            `एक टीम “${concept}” के अनुसार प्राथमिकता तय करती है${titleHint}. ${goal} पर सबसे संभावित प्रभाव क्या है, और गलत मापन की आम भूल क्या है?`,
            `एक प्रबंधक “${concept}” लागू करता है${titleHint}. ${goal} के लिए सबसे संभावित लाभ क्या है, और किस बिंदु पर जोखिम बढ़ता है?`,
          ];
          return pickOne(`${concept}::${goal}::hi-ctq`, variants);
        },
        options: (concept) => {
          const correctVariants = [
            'सही फोकस मापने योग्य परिणाम बढ़ाता है; जोखिम: गलत मानदंड चुनने से प्रगति दिखती है, पर वास्तविक सुधार नहीं होता।',
            'सही फोकस सबसे महत्वपूर्ण परिणाम पर संसाधन लगाता है; जोखिम: गलत संकेतक चुनकर झूठी प्रगति दिखना।',
          ];
          const distractorPool = [
            'सिर्फ काम और गतिविधि बढ़ा देने से ही परिणाम मिलेंगे; जोखिम: शोर बढ़ता है और गुणवत्ता व मूल्य घटते हैं।',
            'समय/ऊर्जा/ध्यान जैसी सीमाएँ महत्व नहीं रखतीं; जोखिम: थकान और गलतियाँ परिणाम को नुकसान पहुँचाती हैं।',
            'केवल गति सबसे महत्वपूर्ण है और गुणवत्ता बाद में; जोखिम: दोबारा काम बढ़ता है और भरोसा घटता है।',
            'सब कुछ एक साथ ऑप्टिमाइज़ करो; जोखिम: क्या काम कर रहा है यह स्पष्ट नहीं होता।',
            'अगर सब व्यस्त हैं तो प्रगति है; जोखिम: परिणाम नहीं, सिर्फ व्यस्तता मापते हो।',
          ];
          const correct = pickOne(`${concept}::hi-ctc`, correctVariants);
          const distractors = pickThree(`${concept}::hi-ctd`, distractorPool);
          return [correct, distractors[0], distractors[1], distractors[2]] as Options4;
        },
      },
      application: {
        practice: (practice) => {
          const variants = [
            `आप एक नई प्रैक्टिस लागू कर रहे हैं: “${practice}”${titleHint}. कौन-सी योजना मापने योग्य परिणाम और तेज़ प्रतिक्रिया देगी?`,
            `आप “${practice}” का 1-सप्ताह का पायलट चला रहे हैं${titleHint}. कौन-सी योजना पहले/बाद में माप और तेज़ सुधार देती है?`,
            `टीम “${practice}” को छोटे दायरे में टेस्ट कर रही है${titleHint}. कौन-सी योजना त्वरित फीडबैक लूप और प्रमाणित असर देती है?`,
          ];
          return pickOne(`${practice}::hi-apq`, variants);
        },
        keyTerm: (keyTerm) => {
          const variants = [
            `आप “${keyTerm}” को ठोस कदमों में बदलना चाहते हैं${titleHint}. कौन-सा तरीका परिणाम को मापने योग्य और जाँचने योग्य बनाता है?`,
            `आप “${keyTerm}” को वास्तविक केस में लागू करना चाहते हैं${titleHint}. कौन-सा तरीका सफलता को परीक्षण-योग्य बनाता है?`,
          ];
          return pickOne(`${keyTerm}::hi-akq`, variants);
        },
        options: {
          practice: (practice: string) => {
            const correctVariants = [
              'मैं चरणबद्ध लागू करता हूँ: सफलता-मानदंड तय, छोटे दायरे में पायलट, पहले/बाद में माप, और हर बार एक बदलाव।',
              'मैं छोटे scope से शुरू करता हूँ, baseline मीट्रिक रखता हूँ, साप्ताहिक रिव्यू करता हूँ, और असर साबित होने पर ही विस्तार करता हूँ।',
              'मैं owner और सफलता-सीमा तय करता हूँ, समान केस पर पहले/बाद में मापता हूँ, और सिर्फ सत्यापित बदलाव स्केल करता हूँ।',
            ];
            const distractorPool = [
              'मैं सब कुछ एक साथ बदल देता हूँ, बिना माप और समीक्षा बिंदुओं के, फिर बाद में अनुमान लगाता हूँ कि क्या चला।',
              'मैं औपचारिक रूप से करता हूँ, पर पहले/बाद में तुलना नहीं करता, इसलिए सुधार साबित नहीं कर पाता।',
              'मैं बहुत सारे लक्ष्य/मीट्रिक एक साथ जोड़ देता हूँ; किससे असर हुआ पता नहीं चलता।',
              'मैं बिना owner और सफलता-सीमा के रोलआउट कर देता हूँ; नतीजा “फीलिंग” पर निर्भर हो जाता है।',
              'मैं एक बार करके छोड़ देता हूँ और डॉक्युमेंट नहीं करता; दोहराने और सुधारने लायक नहीं रहता।',
            ];
            const correct = pickOne(`${practice}::hi-apc`, correctVariants);
            const distractors = pickThree(`${practice}::hi-apd`, distractorPool);
            return [correct, distractors[0], distractors[1], distractors[2]] as Options4;
          },
          keyTerm: (keyTerm: string) => {
            const correctVariants = [
              'मैं “हो गया” का मानदंड लिखता हूँ, एक मीट्रिक चुनता हूँ, एक केस पर लागू करता हूँ, फिर असर साबित होने पर विस्तार करता हूँ।',
              'मैं स्पष्ट मानदंड और सीमा तय करता हूँ, एक केस पर टेस्ट करता हूँ, पहले/बाद में मापता हूँ, फिर विस्तार करता हूँ।',
            ];
            const distractorPool = [
              'मैं इसे नारे की तरह उपयोग करता हूँ; सूची और माप नहीं होने से परिणाम न सत्यापित होता है न दोहराने योग्य।',
              'मैं परफेक्ट होने तक टालता रहता हूँ; जोखिम: गति गिरती है और अधूरे काम जमा होते जाते हैं।',
              'मैं बिना जिम्मेदारी, समयसीमा और सफलता-सीमा के करता हूँ, इसलिए परिणाम लक्ष्य से नहीं जुड़ता।',
              'मैं मीटिंग में चर्चा करता हूँ पर प्रक्रिया में नहीं लाता; इसलिए व्यवहार और परिणाम नहीं बदलते।',
              'मैं कई चीजें एक साथ बदलता हूँ; कौन-सा कदम असरदार था पता नहीं चलता।',
            ];
            const correct = pickOne(`${keyTerm}::hi-akc`, correctVariants);
            const distractors = pickThree(`${keyTerm}::hi-akd`, distractorPool);
            return [correct, distractors[0], distractors[1], distractors[2]] as Options4;
          },
        }
      },
      recall: {
        keyTerm: (keyTerm, titleParam?: string) => {
          const lessonTitle = titleParam || title;
          if (keyTerm.length > 15) {
            return `“${lessonTitle}” विषय में ${keyTerm} की व्यावहारिक भूमिका क्या है?`;
          }
          return `“${lessonTitle}” विषय में ${keyTerm} निर्णय और माप को कैसे बेहतर बनाता है?`;
        },
        topic: (topic) => `“${topic}” को लागू करने के लिए कौन-सा तत्व सबसे ज़रूरी है?`,
        fallback: (title) => `“${title}” को मापने योग्य बनाने के लिए कौन-सा कदम सबसे सही है?`,
        options: {
          keyTerm: (keyTerm) => [
            `${keyTerm} को मानदंड, मीट्रिक और स्पष्ट कदमों से जोड़कर प्रगति को सत्यापित किया जा सकता है।`,
            `${keyTerm} केवल सामान्य सलाह है; इसे माप या कदमों की जरूरत नहीं, इसलिए परिणाम नहीं बदलते।`,
            `${keyTerm} सिर्फ सिद्धांत के लिए है और वास्तविक स्थितियों में इसका परीक्षण संभव नहीं।`,
            `${keyTerm} व्यस्तता बढ़ाता है, पर परिणाम साबित करने का तरीका नहीं देता।`,
          ],
          topic: (topic) => [
            `स्पष्ट कदम + सफलता-मानदंड + पहले/बाद में तुलना ताकि “${topic}” का असर साबित हो सके।`,
            'सामान्य बातें, बिना मानदंड और बिना माप के।',
            'परिभाषाएँ, पर उदाहरण और लागू करने योग्य कदम नहीं।',
            'सिर्फ गतिविधि-गिनती जो वास्तविक परिणाम से नहीं जुड़ती।',
          ],
          fallback: [
            'ठोस कदम, जिम्मेदारी, और मापने का तरीका (पहले/बाद) ताकि असर साबित हो।',
            'सिर्फ सिद्धांत, बिना लागू करने की योजना के।',
            'अनिश्चित प्रयास, बिना जाँच और बिना मानदंड के।',
            'ऐसा काम जो व्यस्तता बढ़ाए, पर परिणाम नहीं दिखाए।',
          ]
        }
      }
    };
  }

  // Arabic templates
  // Notes:
  // - Must avoid long Latin segments (Arabic script integrity check).
  // - Must NOT reference the lesson explicitly (e.g., "في الدرس" is disallowed by the validator).
  if (lang === 'ar') {
    const pickOne = <T,>(seed: string, pool: T[]): T => pool[stableHash32(seed) % pool.length];
    const pickThree = (seed: string, pool: string[]) => pickUniqueFromPool(seed, pool, 3);
    // Use title only as a deterministic seed to avoid repeating the exact same question across lessons.
    const titleSeed = String(title || '').trim();

    return {
      criticalThinking: {
        question: (concept, goal) => {
          const variants = [
            `يتخذ قائد قرارًا وفق مبدأ: «${concept}». ما الأثر الأكثر احتمالًا لتحقيق ${goal}، وما الخطر المعتاد إذا طُبّق أو قيس بطريقة خاطئة؟`,
            `يعتمد فريق مبدأ «${concept}» في الأولويات. ما الأثر الأرجح على ${goal}، وما الخطأ الشائع عند القياس؟`,
            `يطبّق مدير مبدأ «${concept}» عمليًا. ما التأثير الأرجح على ${goal}، وما المخاطرة المعتادة عند سوء الفهم أو سوء القياس؟`,
          ];
          return pickOne(`${concept}::${goal}::${titleSeed}::ar-ctq`, variants);
        },
        options: (concept) => {
          const correctVariants = [
            'يزداد الأثر لأن التركيز يوجّه الجهد نحو نتيجة قابلة للقياس؛ الخطر: اختيار معيار خاطئ يعطي شعورًا بالتقدم دون تحسن حقيقي.',
            'يرتفع الأثر عندما نركّز على نتيجة قابلة للقياس؛ الخطر: تحسين مؤشر خاطئ ينتج نشاطًا دون أثر.',
          ];
          const distractorPool = [
            'يكفي زيادة عدد المهام لأن النشاط يساوي النتيجة دائمًا؛ الخطر: ترتفع الضوضاء وتقل الجودة والقيمة الفعلية.',
            'القيود (الوقت/الطاقة/الانتباه) غير مهمة إذا بذلت جهدًا أكبر؛ الخطر: الإرهاق والأخطاء تقلل النتيجة النهائية.',
            'الأهم هو السرعة فقط ثم نصحح الجودة لاحقًا؛ الخطر: تزداد إعادة العمل ويضيع الوقت وتضعف الثقة.',
            'من الأفضل تحسين كل شيء في الوقت نفسه؛ الخطر: لا نعرف ما الذي سبّب التحسن ولا نتعلم.',
            'إذا كان الجميع مشغولًا فذلك يعني تقدمًا؛ الخطر: نقيس الانشغال بدل النتيجة.',
          ];
          const correct = pickOne(`${concept}::${titleSeed}::ar-ctc`, correctVariants);
          const distractors = pickThree(`${concept}::${titleSeed}::ar-ctd`, distractorPool);
          return [correct, distractors[0], distractors[1], distractors[2]] as Options4;
        },
      },
      application: {
        practice: (practice) => {
          const variants = [
            `ستطبق ممارسة جديدة: «${practice}». أي خطة تمنح نتيجة قابلة للقياس وتغذية راجعة سريعة؟`,
            `ستجرب «${practice}» لمدة أسبوع. أي خطة تجعل الأثر قابلاً للإثبات (قبل/بعد)؟`,
            `تريد إدخال «${practice}» ضمن العمل. أي خطة تصنع حلقة تغذية راجعة سريعة وقياسًا واضحًا؟`,
          ];
          return pickOne(`${practice}::${titleSeed}::ar-apq`, variants);
        },
        keyTerm: (keyTerm) => {
          const variants = [
            `تريد تحويل «${keyTerm}» إلى خطوات عملية. أي نهج يجعل النتيجة قابلة للتحقق والقياس؟`,
            `تريد تطبيق «${keyTerm}» في حالة واقعية. أي نهج يجعل النجاح قابلًا للاختبار لا مجرد انطباع؟`,
            `لديك مفهوم «${keyTerm}» وتحتاج إلى مخرجات واضحة. أي نهج يجعل المخرجات قابلة للقياس؟`,
          ];
          return pickOne(`${keyTerm}::${titleSeed}::ar-akq`, variants);
        },
        options: {
          practice: (practice: string) => {
            const correctVariants = [
              'أطبقها تدريجيًا: أعرّف معيار النجاح، أجرب على نطاق صغير، أقيس قبل/بعد، ثم أعدل خطوة واحدة في كل مرة.',
              'أبدأ بنطاق صغير مع مؤشر خط أساس، أراجع أسبوعيًا، وأوسع فقط بعد دليل واضح على الأثر.',
              'أحدد مسؤولًا وعتبة نجاح، أقيس قبل/بعد على مثال قابل للمقارنة، ثم أوسع ما ثبت نجاحه.',
            ];
            const distractorPool = [
              'أغير كل شيء دفعة واحدة دون قياس أو نقاط مراجعة، ثم أحاول تخمين ما الذي نجح لاحقًا.',
              'أطبقها شكليًا لكن دون مقارنة قبل/بعد، لذلك لا أستطيع إثبات أي تحسن.',
              'أضع أهدافًا ومؤشرات كثيرة دفعة واحدة؛ لا أعرف ما الذي صنع الفرق.',
              'أطبقها بلا مسؤول واضح ولا عتبة نجاح، فتتحول إلى آراء لا نتائج.',
              'أجرب مرة واحدة دون توثيق؛ لا يمكن تكرارها أو تحسينها.',
            ];
            const correct = pickOne(`${practice}::${titleSeed}::ar-apc`, correctVariants);
            const distractors = pickThree(`${practice}::${titleSeed}::ar-apd`, distractorPool);
            return [correct, distractors[0], distractors[1], distractors[2]] as Options4;
          },
          keyTerm: (keyTerm: string) => {
            const correctVariants = [
              'أحدد معيار "تم" وأختار مؤشرًا واحدًا، أطبقه على حالة واحدة ثم أوسع بعد تأكيد الأثر.',
              'أعرّف معيار النجاح وعتبة واضحة، أختبر على سيناريو واحد، أقيس قبل/بعد، ثم أوسع بعد تحقق النتيجة.',
            ];
            const distractorPool = [
              'أستخدم المصطلح كشعار دون قائمة تحقق أو قياس، فتظل النتيجة غير قابلة للتحقق أو التكرار.',
              'أؤجل التنفيذ حتى يصبح مثاليًا؛ يتباطأ التقدم وتتراكم مهام غير منجزة.',
              'أنفذ خطوات بلا مالك أو موعد أو عتبة نجاح، فتتشتت النتيجة ولا ترتبط بالهدف.',
              'أناقشه في الاجتماعات دون إدخاله في العملية؛ لا يتغير السلوك ولا النتيجة.',
              'أغير أشياء كثيرة في الوقت نفسه؛ لا أعرف أي خطوة حسّنت الأثر.',
            ];
            const correct = pickOne(`${keyTerm}::${titleSeed}::ar-akc`, correctVariants);
            const distractors = pickThree(`${keyTerm}::${titleSeed}::ar-akd`, distractorPool);
            return [correct, distractors[0], distractors[1], distractors[2]] as Options4;
          },
        },
      },
      recall: {
        keyTerm: (keyTerm, titleParam?: string) => {
          const lessonTitle = titleParam || title;
          if (keyTerm.length > 15) return `ما الدور العملي لـ ${keyTerm} ضمن موضوع: «${lessonTitle}»؟`;
          return `كيف يؤثر ${keyTerm} على اتخاذ القرار والقياس ضمن موضوع: «${lessonTitle}»؟`;
        },
        topic: (topic) => `ما الذي يميّز تطبيق «${topic}» بشكل قابل للقياس والتحقق؟`,
        fallback: (title) => `أي خيار يوضح تطبيقًا عمليًا قابلًا للقياس لموضوع: «${title}»؟`,
        options: {
          keyTerm: (keyTerm) => [
            `${keyTerm} يساعد على تحويل الهدف إلى معيار نجاح وخطوات قابلة للقياس والمتابعة.`,
            `${keyTerm} مجرد فكرة عامة لا تتطلب خطوات أو قياسًا، لذلك لا يغير النتيجة.`,
            `${keyTerm} مفيد نظريًا فقط ولا يمكن التحقق منه في الواقع العملي.`,
            `${keyTerm} يزيد النشاط فقط دون أي طريقة لإثبات تحسن النتيجة.`,
          ],
          topic: (topic) => [
            `أساليب وخطوات قابلة للتطبيق تساعد على استخدام «${topic}» مع مؤشر واضح لقياس التقدم.`,
            'معلومات عامة دون معايير نجاح أو طريقة لقياس الأثر.',
            'تعريفات فقط دون أمثلة أو خطوات قابلة للتنفيذ.',
            'مؤشرات نشاط (عدد الرسائل/الاجتماعات) دون ارتباط بنتيجة قابلة للقياس.',
          ],
          fallback: [
            'خطوات محددة مع معيار نجاح وقياس قبل/بعد للتحقق من الأثر.',
            'مبادئ عامة دون قياس أو مسؤوليات أو مراجعة.',
            'نظرية دون تطبيق عملي أو سيناريوهات واقعية.',
            'تنفيذ عشوائي دون متابعة أو إثبات للنتيجة.',
          ],
        },
      },
    };
  }
  
  // Hungarian templates (existing)
  if (lang === 'hu') {
    const practiceCorrectVariants = [
      'Lépésről lépésre vezetem be: baseline-t rögzítek, előtte/utána mérőpontokat állítok be, pilotot futtatok kis scope-on, dokumentálok, és egy változót módosítok egyszerre.',
      'Owner + „kész” kritérium + 1 metrika: kis pilotot futtatok, hetente review-zok, és csak validált hatás után terjesztem ki.',
    ];
    const practiceDistractorPool = [
      'Túl nagy scope-pal indulok (minden csapat/folyamat), így nincs gyors visszacsatolás és nem látszik, mi okozza az eredményt.',
      'Bevezetem, de nem definiálok előre metrikát és küszöböt; csak benyomás alapján döntünk, hogy „jobb lett-e”.',
      'Kijelölök metrikát, de nincs review időpont és nincs döntési szabály, ezért a mérés nem vezet változáshoz.',
      'Csak eszközt cserélünk (app/board), de a munkaszabályokat (WIP, definíciók, handoff) nem, így a kimenet nem lesz mérhető.',
      'Kiadom a csapatnak, de nem tisztázom a „done” kritériumot és a felelőst, ezért nő a rework és a félreértés.',
      'Pilot nélkül kiterítem mindenkire, majd egyszerre több szabályt változtatok, így nem tudjuk izolálni a hatást.',
      'Sok meetinget indítok a bevezetéshez, de nem védem a fókuszblokkokat, így romlik a végrehajtás és nő a carryover.',
      'Egyszer bevezetem, de nem írom le a lépéseket; így nem ismételhető és nem auditálható.',
      'A „busy outputot” mérem (aktivitás), ezért javulhat a mutató úgy, hogy az eredmény nem javul.',
    ];

    const keyTermCorrectVariants = [
      'Konkrét ellenőrzőlistát és „kész” kritériumot készítek, implementálom egy kis scope-on, mérek előtte/utána, majd csak validált hatás után terjesztem ki.',
      'A fogalmat kimenetté fordítom: 1 mérőszám + döntési szabály + pilot, és csak bizonyított hatás után skálázom.',
    ];
    const keyTermDistractorPool = [
      'Csak definícióként kezelem, így nem derül ki, működik-e a gyakorlatban, és nincs ellenőrizhető kimenet.',
      'Bevezetem, de nem rendelek hozzá metrikát/küszöböt és nincs owner — a kimenet nem lesz verifikálható.',
      'Túl sok mindent akarok egyszerre optimalizálni, ezért nincs egyetlen változó és nincs tiszta tanulság.',
      'Megcsinálom egyszer, de nincs dokumentáció és ismételhető lépéssor, ezért nem skálázható és nem auditálható.',
      'A fogalmat címkének használom, de nem bontom lépésekre és nem jelölök felelőst/határidőt, ezért elcsúszik a végrehajtás.',
      'Döntést hozok, de nem mérek és nem review-zok, így nem derül ki, hogy nőtt-e a throughput vagy csökkent-e a carryover.',
      'A gyorsaságot prioritizálom és a minőséget „későbbre” hagyom; a rework és újranyitás elviszi a kapacitást.',
      'A kimenetet aktivitással keverem, így a csapat „dolgozik”, de a valódi eredmény nem javul.',
      'Mindent dokumentálok, de nincs valódi végrehajtás; a papírmunka nő, az eredmény nem.',
    ];

    return {
      criticalThinking: {
        question: (concept, goal) => {
          const phrase = String(concept || '')
            .replace(/\s+/g, ' ')
            .trim()
            .split(/\s+/)
            .slice(0, 12)
            .join(' ');
          const variants = [
            `Egy vezető a következő elv szerint dönt: „${phrase}”. Melyik hatás a legvalószínűbb a ${goal} elérésében, és mi a tipikus kockázat, ha ezt rosszul értelmezik vagy rosszul mérik?`,
            `A „${topicHint}” témában egy csapat a „${phrase}” elvhez igazodik. Melyik hatás a legvalószínűbb a ${goal} elérésében, és mi a tipikus kockázat rossz mérésnél?`,
            `Egy menedzser a „${phrase}” elvet szabályként alkalmazza. Melyik hatás a legvalószínűbb a ${goal} elérésében, és mi a tipikus kockázat, ha rossz mérőszámra optimalizálnak?`,
          ];
          return pickOne(`${phrase}::${goal}::${titleSeed}::hu::ctq`, variants);
        },
        options: (concept) => [
          `A fókusz növelheti az eredményességet, mert a korlátok mellett a legnagyobb hatású kimenetre koncentrál; kockázat: rossz mérőszámra optimalizálva „látszat‑output” készül.`,
          `Az output automatikusan egyenlő az eredménnyel, ezért elég több feladatot lezárni; kockázat: nő az aktivitás, de romlik az ügyfélérték és a minőség.`,
          `A korlátok (idő/energia/figyelem) figyelmen kívül hagyhatók, mert a termelékenység csak akaraterő kérdése; kockázat: túlterhelés, hibák és kiégés.`,
          `A sebesség maximalizálása a legfontosabb, a minőség majd „később” javítható; kockázat: utómunka, újranyitások és bizalomvesztés alakul ki.`,
        ]
      },
      application: {
        practice: (practice) => {
          const p = String(practice || '').trim().substring(0, 60);
          const variants = [
            `Egy új gyakorlatot vezetsz be: „${p}”. Melyik bevezetési terv biztosít mérhető kimenetet és gyors visszacsatolást?`,
            `A „${topicHint}” témában új gyakorlatot próbálsz ki: „${p}”. Melyik bevezetési terv teszi a hatást ellenőrizhetővé (előtte/utána)?`,
            `Egy csapatban szabályként vezeted be: „${p}”. Melyik terv ad mérhető kimenetet és gyors iterációt?`,
          ];
          return pickOne(`${p}::${titleSeed}::hu::practice-q`, variants);
        },
        keyTerm: (keyTerm) => {
          const k = String(keyTerm || '').trim();
          const variants = [
            `Egy projektben a „${k}” fogalmat kell működésbe fordítanod. Melyik megközelítés teszi a kimenetet mérhetővé és ellenőrizhetővé?`,
            `A „${topicHint}” témában a „${k}” fogalmat akarod használni. Melyik megközelítés teszi a kimenetet tesztelhetővé, nem csak „érzésre” javulóvá?`,
            `Egy folyamatban a „${k}” csak címke, amíg nem lesz kimenet. Melyik megközelítés teszi ellenőrizhetővé és ismételhetővé?`,
          ];
          return pickOne(`${k}::${titleSeed}::hu::keyterm-q`, variants);
        },
        options: {
          practice: (seedText: string) => {
            const correct = pickOne(`${seedText}::${titleSeed}::hu::practice-c`, practiceCorrectVariants);
            const distractors = pickUniqueFromPool(`${seedText}::${titleSeed}::hu::practice-d`, practiceDistractorPool, 3);
            return [correct, distractors[0], distractors[1], distractors[2]] as Options4;
          },
          keyTerm: (seedText: string) => {
            const correct = pickOne(`${seedText}::${titleSeed}::hu::keyterm-c`, keyTermCorrectVariants);
            const distractors = pickUniqueFromPool(`${seedText}::${titleSeed}::hu::keyterm-d`, keyTermDistractorPool, 3);
            return [correct, distractors[0], distractors[1], distractors[2]] as Options4;
          },
        }
      },
      recall: {
        keyTerm: (keyTerm, titleParam?: string) => {
          const lessonTitle = titleParam || title;
          // Create content-specific question, not template
          if (keyTerm.length > 15) {
            return `A "${lessonTitle}" leckében milyen szerepet játszik a ${keyTerm}?`;
          }
          return `A leckében említett ${keyTerm} milyen fontosságú eleme a ${lessonTitle} témakörnek?`;
        },
        topic: (topic) => `Mit tartalmaz a "${topic}" rész a leckében?`,
        fallback: (title) => `Melyik elem szerepel a "${title}" leckében részletesen leírt módszertanban?`,
        options: {
          keyTerm: (keyTerm) => [
            `A leckében részletesen leírt módon, a ${keyTerm} kulcsfontosságú szerepet játszik a folyamatok optimalizálásában és a célok elérésében`,
            'Csak mellékes információ, nincs jelentős szerepe',
            'Csak elméleti fogalom, nincs gyakorlati alkalmazása',
            'Nem szerepel a leckében'
          ],
          topic: (topic) => [
            `A leckében részletesen leírt, ${topic.toLowerCase()}-ra vonatkozó specifikus információ, módszerek és példák`,
            'Csak általános információ',
            'Csak elméleti tudás',
            'Nincs konkrét tartalom'
          ],
          fallback: [
            'A leckében konkrétan említett, részletesen leírt lépések és best practice-ek',
            'Csak általános elvek',
            'Csak elméleti ismeretek',
            'Nincs konkrét módszertan'
          ]
        }
      }
    };
  }
  
  // Default to English templates
  const enPracticeCorrect =
    'I roll it out step by step: define a success threshold, run a small pilot, measure before/after, and change one variable at a time.';
  const enPracticeDistractors = [
    'I roll it out broadly without a baseline, then attribute outcomes to the change without evidence.',
    'I set a metric but do not define a decision rule or review cadence, so measurement never turns into improvement.',
    'I change the tool and the process at the same time, so I cannot tell what actually caused the outcome shift.',
    'I optimize for “activity” (more tasks touched) instead of a measurable outcome, so value and quality may drop.',
    'I skip constraints (time/attention/energy) and overcommit, creating carryover and quality decay.',
    'I add more meetings/status updates as the control mechanism, shrinking execution time and slowing throughput.',
  ];

  const enKeyTermCorrect =
    'I make it measurable: write a “done” criterion, pick one metric, apply it to a small scope, and expand only after verified impact.';
  const enKeyTermDistractors = [
    'I treat it as a slogan and never operationalize it into steps, owner, and a measurable threshold.',
    'I implement it once but do not document the steps, so it is not repeatable or auditable across the team.',
    'I optimize the wrong metric (busy output), which increases activity while customer value and quality fall.',
    'I move fast and postpone quality, which increases rework and re-opened tasks that consume capacity.',
    'I keep changing multiple variables at once, so results are noisy and learning is unclear.',
  ];

  const enCriticalCorrect =
    'Correctly applied, it focuses effort on high-impact outcomes under constraints; misapplied, it drives optimization to the wrong metric and produces “busy output”.';
  const enCriticalDistractors = [
    'It mainly increases activity volume (more tasks closed), which is enough on its own; the risk is only that people feel tired.',
    'Constraints can be ignored if the team has enough willpower; the risk is minimal because effort fixes everything.',
    'Speed is the primary goal and quality can be fixed later; the risk is low because rework is easy to absorb.',
    'It means documenting more, so results improve automatically; the risk is only extra paperwork.',
    'It pushes measurement but not execution, so it rarely affects outcomes; the risk is overthinking.',
  ];

  return {
    criticalThinking: {
      question: (concept, goal) =>
        `In a "${title}" scenario, how would applying "${concept.substring(0, 50)}" change your ability to achieve ${goal}, and what is the most likely risk if you implement it incorrectly?`,
      options: (seedText: string) =>
        buildVariedOptions({
          correct: enCriticalCorrect,
          distractorPool: enCriticalDistractors,
          seed: `en::critical::${seedText}`,
        }).options
    },
    application: {
      practice: (practice) =>
        `You want to implement this practice in your own workflow: "${practice.substring(0, 60)}". Which plan produces measurable output and fast feedback?`,
      keyTerm: (keyTerm) =>
        `You are working on "${title}". A teammate mentions "${keyTerm}" but you need it operational. Which approach makes the output measurable and verifiable?`,
      options: {
        practice: (seedText: string) =>
          buildVariedOptions({
            correct: enPracticeCorrect,
            distractorPool: enPracticeDistractors,
            seed: `en::practice::${seedText}`,
          }).options,
        keyTerm: (seedText: string) =>
          buildVariedOptions({
            correct: enKeyTermCorrect,
            distractorPool: enKeyTermDistractors,
            seed: `en::keyterm::${seedText}`,
          }).options,
      }
    },
      recall: {
        keyTerm: (keyTerm, titleParam?: string) => {
          const lessonTitle = titleParam || title;
          // Create content-specific question, not template
          if (keyTerm.length > 15) {
            return `In the "${lessonTitle}" lesson, what role does ${keyTerm} play?`;
          }
          return `How important is ${keyTerm} in the context of ${lessonTitle} as discussed in the lesson?`;
        },
        topic: (topic) => `What does the "${topic}" section contain in the lesson?`,
        fallback: (title) => `Which element is part of the methodology described in detail in the "${title}" lesson?`,
        options: {
          keyTerm: (keyTerm) => [
            `As described in detail in the lesson, ${keyTerm} plays a crucial role in optimizing processes and achieving goals`,
            'Only peripheral information with no significant role',
            'Only a theoretical concept with no practical application',
            'Not mentioned in the lesson'
          ],
        topic: (topic) => [
          `Specific information, methods, and examples related to ${topic.toLowerCase()} as described in detail in the lesson`,
          'Only general information',
          'Only theoretical knowledge',
          'No specific content'
        ],
        fallback: [
          'The specific steps and best practices mentioned and described in detail in the lesson',
          'Only general principles',
          'Only theoretical knowledge',
          'No specific methodology'
        ]
      }
    }
  };
}

/**
 * Generate content-based questions from lesson content
 */
export function generateContentBasedQuestions(
  day: number,
  title: string,
  content: string,
  language: string,
  courseId: string,
  existingQuestions: any[],
  needed: number,
  opts?: { seed?: string }
): ContentBasedQuestion[] {
  const questions: ContentBasedQuestion[] = [];
  const seedBase = String(opts?.seed || `${courseId}::${language}::${day}`);

  // Special-case: GEO Shopify (EN) Day 7 — needs concrete product-data audit scenarios.
  if (String(language || '').toLowerCase() === 'en' && String(courseId || '') === 'GEO_SHOPIFY_30_EN' && day === 7) {
    const pool = generateGeoShopify30Day7QuestionsEN(day, title, courseId);
    return pool.slice(0, Math.max(needed, 9));
  }
  // Special-case: GEO Shopify (EN) Day 2 — GEO-first vs SEO-first must be grounded.
  if (String(language || '').toLowerCase() === 'en' && String(courseId || '') === 'GEO_SHOPIFY_30_EN' && day === 2) {
    const pool = generateGeoShopify30Day2QuestionsEN(day, title, courseId);
    return pool.slice(0, Math.max(needed, 9));
  }
  // Special-case: GEO Shopify (EN) Day 3 — AI journey + answer capsule needs concrete scenarios.
  if (String(language || '').toLowerCase() === 'en' && String(courseId || '') === 'GEO_SHOPIFY_30_EN' && day === 3) {
    const pool = generateGeoShopify30Day3QuestionsEN(day, title, courseId);
    return pool.slice(0, Math.max(needed, 9));
  }
  // Special-case: GEO Shopify (EN) Day 4 — influence vs transaction must be concrete and policy-grounded.
  if (String(language || '').toLowerCase() === 'en' && String(courseId || '') === 'GEO_SHOPIFY_30_EN' && day === 4) {
    const pool = generateGeoShopify30Day4QuestionsEN(day, title, courseId);
    return pool.slice(0, Math.max(needed, 9));
  }
  // Special-case: GEO Shopify (EN) Day 5 — platform map must be grounded in constraints and requirements.
  if (String(language || '').toLowerCase() === 'en' && String(courseId || '') === 'GEO_SHOPIFY_30_EN' && day === 5) {
    const pool = generateGeoShopify30Day5QuestionsEN(day, title, courseId);
    return pool.slice(0, Math.max(needed, 9));
  }
  // Special-case: GEO Shopify (EN) Day 6 — prompt set + KPI logic must be concrete and measurable.
  if (String(language || '').toLowerCase() === 'en' && String(courseId || '') === 'GEO_SHOPIFY_30_EN' && day === 6) {
    const pool = generateGeoShopify30Day6QuestionsEN(day, title, courseId);
    return pool.slice(0, Math.max(needed, 9));
  }
  // Special-case: GEO Shopify (EN) Day 8 — offer truth (feed vs PDP) must be factual and measurable.
  if (String(language || '').toLowerCase() === 'en' && String(courseId || '') === 'GEO_SHOPIFY_30_EN' && day === 8) {
    const pool = generateGeoShopify30Day8QuestionsEN(day, title, courseId);
    return pool.slice(0, Math.max(needed, 9));
  }
  // Special-case: GEO Shopify (EN) Day 9 — identifiers must be concrete and operational.
  if (String(language || '').toLowerCase() === 'en' && String(courseId || '') === 'GEO_SHOPIFY_30_EN' && day === 9) {
    const pool = generateGeoShopify30Day9QuestionsEN(day, title, courseId);
    return pool.slice(0, Math.max(needed, 9));
  }

  const sanitizeSnippet = (input: string) =>
    String(input || '')
      .replace(/[✅✔️☑️]/g, '')
      .replace(/\.\.\./g, '')
      .replace(/^[\s•\-\u2022\d]+[.)-]?\s*/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  const scriptProfile = (() => {
    const lang = String(language || '').toLowerCase();
    if (lang === 'bg' || lang === 'ru') return { name: 'cyrillic', re: /[\u0400-\u04FF]/g, minRatio: 0.25 };
    if (lang === 'ar') return { name: 'arabic', re: /[\u0600-\u06FF]/g, minRatio: 0.25 };
    if (lang === 'hi') return { name: 'devanagari', re: /[\u0900-\u097F]/g, minRatio: 0.25 };
    return null;
  })();

  const scriptRatio = (s: string, scriptRe: RegExp) => {
    const text = String(s || '');
    const letters = text.match(/\p{L}/gu) || [];
    if (letters.length === 0) return 0;
    const scriptLetters = text.match(scriptRe) || [];
    return scriptLetters.length / letters.length;
  };

  const preferLanguageMatchedSnippets = (values: string[]) => {
    if (!scriptProfile) return values;
    const filtered = values.filter(v => scriptRatio(v, scriptProfile.re) >= scriptProfile.minRatio);
    return filtered.length ? filtered : values;
  };
  
  // Extract key concepts
  const extracted = extractKeyConcepts(content, title);
  const mainTopics = preferLanguageMatchedSnippets(extracted.mainTopics || []);
  const keyTerms = preferLanguageMatchedSnippets(extracted.keyTerms || []);
  const examples = preferLanguageMatchedSnippets(extracted.examples || []);
  const practices = preferLanguageMatchedSnippets(extracted.practices || []);
  const concepts = preferLanguageMatchedSnippets(extracted.concepts || []);
  
  // Clean content for analysis
  const cleanContent = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const contentLower = cleanContent.toLowerCase();
  const titleLower = title.toLowerCase();

  // Special-case: GEO intro lessons (EN) with inclusion/citation/consistency and GEO vs SEO framing.
  // This produces fully-standalone questions with concrete, educational options (no “as described in the lesson” phrasing).
  if (
    language.toLowerCase() === 'en' &&
    (courseId.includes('GEO') || contentLower.includes('geo')) &&
    containsAll(contentLower, ['inclusion', 'citation', 'consistency']) &&
    (contentLower.includes('geo vs seo') || (contentLower.includes('geo') && contentLower.includes('seo')))
  ) {
    const geoIntro = generateGeoIntroLessonQuestionsEN(day, title, contentLower, courseId);
    return geoIntro.slice(0, needed);
  }

  // Special-case: Productivity 2026 (EN) — day-specific question sets grounded in lesson content + CCS concepts.
  // The generic EN templates are intentionally NOT used here because they contain disallowed patterns under strict QC.
  if (
    language.toLowerCase() === 'en' &&
    courseId.includes('PRODUCTIVITY_2026') &&
    day >= 1 &&
    day <= 30
  ) {
    const pool = generateProductivity2026QuestionsEN(day, title, contentLower, courseId);
    // Return a larger pool so strict QC can reject some while still leaving >=7 valid.
    return pool.slice(0, Math.max(needed, 12));
  }

  // Special-case: Productivity 2026 Day 1 (PL) — output vs outcome vs constraints.
  if (
    language.toLowerCase() === 'pl' &&
    courseId.includes('PRODUCTIVITY_2026') &&
    day === 1 &&
    (contentLower.includes('wynik') && contentLower.includes('rezultat') && contentLower.includes('ogranicze'))
  ) {
    const qs = generateProductivityLesson1QuestionsPL(day, title, courseId);
    // Return a slightly larger pool so callers can select valid questions after strict QC.
    return qs.slice(0, Math.max(needed, 9));
  }

  // Get language-specific templates (pass title for context)
  const templates = getLanguageTemplates(language, title);

  // Generate hashtags helper
  const getHashtags = (qType: QuizQuestionType, diff: QuestionDifficulty) => {
    const normalizedCourseId = String(courseId || '').toLowerCase();
    const tags = [
      `#day${day}`,
      `#${language}`,
      '#all-languages',
      ...(normalizedCourseId ? [`#course-${normalizedCourseId}`] : []),
    ];
    if (courseId.includes('GEO')) tags.push('#geo');
    if (courseId.includes('SHOPIFY')) tags.push('#shopify');
    if (courseId.includes('PRODUCTIVITY')) tags.push('#productivity');
    if (courseId.includes('SALES')) tags.push('#sales');
    if (courseId.includes('AI')) tags.push('#ai');
    if (diff === QuestionDifficulty.EASY) tags.push('#beginner');
    else if (diff === QuestionDifficulty.MEDIUM) tags.push('#intermediate');
    else if (diff === QuestionDifficulty.HARD) tags.push('#advanced');
    if (qType === QuizQuestionType.RECALL) tags.push('#recall');
    else if (qType === QuizQuestionType.APPLICATION) tags.push('#application');
    else if (qType === QuizQuestionType.CRITICAL_THINKING) tags.push('#critical-thinking');
    return tags;
  };

  // HARD RULE: 0 RECALL. Target mix for 7 questions: 5 APPLICATION + 2 CRITICAL_THINKING.
  // For other `needed` values: reserve ~30% for CRITICAL_THINKING (min 1 if needed >= 3), rest APPLICATION.
  const targetCritical =
    needed >= 7 ? 2 : Math.max(needed >= 3 ? 1 : 0, Math.round(needed * 0.3));
  const targetApplication = Math.max(0, needed - targetCritical);

  const seen = new Set<string>();
  const seenOptionSigs = new Set<string>();
  const normalizeQuestionText = (text: string) =>
    String(text || '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');
  const existingSeen = new Set<string>(
    Array.isArray(existingQuestions)
      ? existingQuestions.map(q => normalizeQuestionText(q?.question)).filter(Boolean)
      : []
  );
  const existingOptionSigs = new Set<string>(
    Array.isArray(existingQuestions)
      ? existingQuestions
          .map(q => optionSignature(Array.isArray((q as any)?.options) ? (q as any).options : []))
          .filter(Boolean)
      : []
  );
  const addQuestion = (q: ContentBasedQuestion) => {
    const normalized = q.question.trim().toLowerCase();
    if (seen.has(normalized)) return false;
    if (existingSeen.has(normalized)) return false;
    const sig = optionSignature(Array.isArray(q.options) ? q.options : []);
    if (seenOptionSigs.has(sig)) return false;
    if (existingOptionSigs.has(sig)) return false;
    seen.add(normalized);
    seenOptionSigs.add(sig);
    questions.push(q);
    return true;
  };

  const goalLabel = (() => {
    const lang = String(language || '').toLowerCase();
    if (titleLower.includes('geo')) return 'GEO';
    const map: Record<string, string> = {
      en: 'goals',
      hu: 'célok',
      tr: 'hedefler',
      bg: 'цели',
      pl: 'cele',
      vi: 'mục tiêu',
      id: 'tujuan',
      pt: 'metas',
      ar: 'الأهداف',
      hi: 'लक्ष्य',
      ru: 'цели',
    };
    return map[lang] || 'goals';
  })();
  const criticalSources = [
    ...concepts,
    ...mainTopics,
    ...keyTerms,
    title,
  ].filter(Boolean);
  const criticalSourcesShuffled = shuffleWithSeed(criticalSources, `${seedBase}::critical-sources`);

  // Generate CRITICAL_THINKING
  for (let i = 0; i < targetCritical; i++) {
    const source = criticalSourcesShuffled[i] || title;
    const concept = sanitizeSnippet(String(source)).substring(0, 80);
    const questionText = templates.criticalThinking.question(concept, goalLabel);
    const criticalBaseOptionsRaw = templates.criticalThinking.options(concept.substring(0, 40));
    const criticalBaseOptions =
      typeof criticalBaseOptionsRaw === 'function' ? criticalBaseOptionsRaw(concept.substring(0, 40)) : criticalBaseOptionsRaw;
    const criticalCorrect = String(criticalBaseOptions[0] || '').trim();
    const criticalShuffled = shuffleWithSeed(
      criticalBaseOptions,
      `${courseId}::${language}::${day}::${questionText}::critical-options`
    );
    const criticalCorrectIndex = Math.max(
      0,
      criticalShuffled.findIndex(o => String(o || '').trim() === criticalCorrect)
    );
    addQuestion({
      question: questionText,
      options: [
        String(criticalShuffled[0] || ''),
        String(criticalShuffled[1] || ''),
        String(criticalShuffled[2] || ''),
        String(criticalShuffled[3] || ''),
      ] as any,
      correctIndex: (criticalCorrectIndex as 0 | 1 | 2 | 3),
      difficulty: QuestionDifficulty.HARD,
      category: 'Course Specific',
      questionType: QuizQuestionType.CRITICAL_THINKING,
      hashtags: getHashtags(QuizQuestionType.CRITICAL_THINKING, QuestionDifficulty.HARD),
    });
  }

  // Generate APPLICATION (prefer practices/examples, then key terms/topics/title)
  const appSources: Array<{ kind: 'practice' | 'keyTerm'; value: string }> = [];
  practices.forEach(p => appSources.push({ kind: 'practice', value: p }));
  examples.forEach(e => appSources.push({ kind: 'practice', value: e }));
  keyTerms.forEach(k => appSources.push({ kind: 'keyTerm', value: k }));
  mainTopics.forEach(t => appSources.push({ kind: 'keyTerm', value: t }));
  concepts.forEach(c => appSources.push({ kind: 'keyTerm', value: c }));
  appSources.push({ kind: 'keyTerm', value: title });
  const appSourcesShuffled = shuffleWithSeed(appSources, `${seedBase}::app-sources`);

  let appIndex = 0;
  while (questions.length < targetCritical + targetApplication && appIndex < appSourcesShuffled.length * 3) {
    const source = appSourcesShuffled[appIndex % appSourcesShuffled.length];
    const raw = sanitizeSnippet(String(source.value));
    const snippet = raw.substring(0, source.kind === 'practice' ? 60 : 80);
    const questionText =
      source.kind === 'practice'
        ? templates.application.practice(snippet)
        : templates.application.keyTerm(snippet);

    const baseOptionsRaw =
      source.kind === 'practice' ? templates.application.options.practice : templates.application.options.keyTerm;
    const baseOptions =
      typeof baseOptionsRaw === 'function' ? baseOptionsRaw(snippet) : baseOptionsRaw;
    const correct = String(baseOptions[0] || '').trim();
    const shuffled = shuffleWithSeed(baseOptions, `${courseId}::${language}::${day}::${questionText}::options`);
    const correctIndex = Math.max(0, shuffled.findIndex(o => String(o || '').trim() === correct));

    addQuestion({
      question: questionText,
      options: [String(shuffled[0] || ''), String(shuffled[1] || ''), String(shuffled[2] || ''), String(shuffled[3] || '')] as any,
      correctIndex: (correctIndex as 0 | 1 | 2 | 3),
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific',
      questionType: QuizQuestionType.APPLICATION,
      hashtags: getHashtags(QuizQuestionType.APPLICATION, QuestionDifficulty.MEDIUM),
    });
    appIndex++;
  }

  return questions.slice(0, needed);
}
