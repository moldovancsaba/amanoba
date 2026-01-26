/**
 * Content-Based Question Generator
 * 
 * Purpose: Generate questions by analyzing actual lesson content
 * This avoids generic templates and creates context-rich, content-specific questions
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
  
  const mainTopics: string[] = [];
  h2Matches.forEach(match => {
    const text = match.replace(/<[^>]+>/g, '').trim();
    if (text && text.length < 100 && text.length > 5) {
      mainTopics.push(text);
    }
  });
  h3Matches.forEach(match => {
    const text = match.replace(/<[^>]+>/g, '').trim();
    if (text && text.length < 100 && text.length > 5 && !mainTopics.includes(text)) {
      mainTopics.push(text);
    }
  });
  
  // If no headings found, use title as main topic
  if (mainTopics.length === 0 && titleClean) {
    mainTopics.push(titleClean);
  }
  
  // Extract words from title as key terms if content is sparse
  const titleWords = titleClean.split(/[\s,;:–—\-]+/).filter(w => w.length > 3 && w.length < 30);
  
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

/**
 * Language-specific question templates
 */
interface LanguageTemplates {
  criticalThinking: {
    question: (concept: string, goal: string) => string;
    options: (concept: string) => [string, string, string, string];
  };
  application: {
    practice: (practice: string) => string;
    keyTerm: (keyTerm: string) => string;
    options: {
      practice: [string, string, string, string];
      keyTerm: [string, string, string, string];
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
  
  // Russian templates
  if (lang === 'ru') {
    return {
      criticalThinking: {
        question: (concept, goal) => `Как концепция "${concept}...", упомянутая в уроке, влияет на достижение ваших ${goal}?`,
        options: (concept) => [
          `Как подробно описано в уроке, ${concept}... повышает эффективность и снижает риски`,
          'Нет значительного влияния',
          'Имеет значение только теоретически',
          'Только опциональный элемент'
        ]
      },
      application: {
        practice: (practice) => `Как бы вы внедрили практику "${practice}...", описанную в уроке, в своей работе?`,
        keyTerm: (keyTerm) => `Как бы вы использовали концепцию "${keyTerm}" так, как описано в уроке, на практике?`,
        options: {
          practice: [
            'Я следую методу, описанному в уроке, шаг за шагом, документирую результаты и совершенствую процесс',
            'Я пробую все сразу',
            'Я только читаю, не применяю',
            'Я жду, пока другие это сделают'
          ],
          keyTerm: [
            'Я следую шагам, подробно описанным в уроке, тестирую результаты и документирую свой опыт',
            'Я понимаю это только теоретически',
            'Я не применяю это',
            'Я жду дальнейших инструкций'
          ]
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
            `Как подробно описано в уроке, ${keyTerm} играет ключевую роль в оптимизации процессов и достижении целей`,
            'Только периферийная информация без значительной роли',
            'Только теоретическая концепция без практического применения',
            'Не упоминается в уроке'
          ],
          topic: (topic) => [
            `Конкретная информация, методы и примеры, связанные с ${topic.toLowerCase()}, как подробно описано в уроке`,
            'Только общая информация',
            'Только теоретические знания',
            'Нет конкретного содержания'
          ],
          fallback: [
            'Конкретные шаги и лучшие практики, упомянутые и подробно описанные в уроке',
            'Только общие принципы',
            'Только теоретические знания',
            'Нет конкретной методологии'
          ]
        }
      }
    };
  }
  
  // Turkish templates
  if (lang === 'tr') {
    return {
      criticalThinking: {
        question: (concept, goal) => `Ders içinde bahsedilen "${concept}..." kavramı ${goal} hedeflerinize ulaşmayı nasıl etkiler?`,
        options: (concept) => [
          `Ders içinde detaylı olarak açıklandığı gibi, ${concept}... etkinliği artırır ve riski azaltır`,
          'Önemli bir etkisi yok',
          'Sadece teorik olarak önemli',
          'Sadece isteğe bağlı bir öğe'
        ]
      },
      application: {
        practice: (practice) => `Ders içinde açıklanan "${practice}..." uygulamasını kendi işinizde nasıl uygularsınız?`,
        keyTerm: (keyTerm) => `"${keyTerm}" kavramını ders içinde açıklandığı gibi pratikte nasıl kullanırsınız?`,
        options: {
          practice: [
            'Ders içinde açıklanan yöntemi adım adım takip ederim, sonuçları belgelerim ve süreci iyileştiririm',
            'Her şeyi aynı anda denerim',
            'Sadece okurum, uygulamıyorum',
            'Başkalarının yapmasını beklerim'
          ],
          keyTerm: [
            'Ders içinde detaylı olarak açıklanan adımları takip ederim, sonuçları test ederim ve deneyimlerimi belgelerim',
            'Sadece teorik olarak anlıyorum',
            'Uygulamıyorum',
            'Daha fazla talimat bekliyorum'
          ]
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
    return {
      criticalThinking: {
        question: (concept, goal) => `Как концепцията "${concept}...", спомената в урока, влияе върху постигането на вашите ${goal}?`,
        options: (concept) => [
          `Както е описано подробно в урока, ${concept}... увеличава ефективността и намалява риска`,
          'Няма значително въздействие',
          'Има значение само теоретично',
          'Само опционален елемент'
        ]
      },
      application: {
        practice: (practice) => `Как бихте приложили практиката "${practice}...", описана в урока, в собствената си работа?`,
        keyTerm: (keyTerm) => `Как бихте използвали концепцията "${keyTerm}" както е описано в урока на практика?`,
        options: {
          practice: [
            'Следвам метода, описан в урока стъпка по стъпка, документирам резултатите и усъвършенствам процеса',
            'Опитвам всичко наведнъж',
            'Само чета, не прилагам',
            'Чакам другите да го направят'
          ],
          keyTerm: [
            'Следвам стъпките, описани подробно в урока, тествам резултатите и документирам опита си',
            'Разбирам го само теоретично',
            'Не го прилагам',
            'Чакам допълнителни инструкции'
          ]
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
    return {
      criticalThinking: {
        question: (concept, goal) => `Jak koncepcja "${concept}...", wspomniana w lekcji, wpływa na osiągnięcie twoich ${goal}?`,
        options: (concept) => [
          `Jak szczegółowo opisano w lekcji, ${concept}... zwiększa skuteczność i zmniejsza ryzyko`,
          'Brak znaczącego wpływu',
          'Ma znaczenie tylko teoretycznie',
          'Tylko opcjonalny element'
        ]
      },
      application: {
        practice: (practice) => `Jak wdrożyłbyś praktykę "${practice}...", opisaną w lekcji, w swojej pracy?`,
        keyTerm: (keyTerm) => `Jak wykorzystałbyś koncepcję "${keyTerm}" zgodnie z opisem w lekcji w praktyce?`,
        options: {
          practice: [
            'Krok po kroku podążam za metodą opisaną w lekcji, dokumentuję wyniki i udoskonalam proces',
            'Próbuję wszystkiego naraz',
            'Tylko czytam, nie stosuję',
            'Czekam, aż inni to zrobią'
          ],
          keyTerm: [
            'Podążam za krokami szczegółowo opisanymi w lekcji, testuję wyniki i dokumentuję swoje doświadczenia',
            'Rozumiem to tylko teoretycznie',
            'Nie stosuję tego',
            'Czekam na dalsze instrukcje'
          ]
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
    return {
      criticalThinking: {
        question: (concept, goal) => `Khái niệm "${concept}..." được đề cập trong bài học ảnh hưởng như thế nào đến việc đạt được ${goal} của bạn?`,
        options: (concept) => [
          `Như đã mô tả chi tiết trong bài học, ${concept}... tăng hiệu quả và giảm rủi ro`,
          'Không có tác động đáng kể',
          'Chỉ quan trọng về mặt lý thuyết',
          'Chỉ là yếu tố tùy chọn'
        ]
      },
      application: {
        practice: (practice) => `Bạn sẽ triển khai thực hành "${practice}..." được mô tả trong bài học như thế nào trong công việc của mình?`,
        keyTerm: (keyTerm) => `Bạn sẽ sử dụng khái niệm "${keyTerm}" như được mô tả trong bài học như thế nào trong thực tế?`,
        options: {
          practice: [
            'Tôi làm theo phương pháp được mô tả trong bài học từng bước, ghi lại kết quả và tinh chỉnh quy trình',
            'Tôi thử mọi thứ cùng một lúc',
            'Tôi chỉ đọc, không áp dụng',
            'Tôi chờ người khác làm điều đó'
          ],
          keyTerm: [
            'Tôi làm theo các bước được mô tả chi tiết trong bài học, kiểm tra kết quả và ghi lại kinh nghiệm của mình',
            'Tôi chỉ hiểu nó về mặt lý thuyết',
            'Tôi không áp dụng nó',
            'Tôi chờ hướng dẫn thêm'
          ]
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
    return {
      criticalThinking: {
        question: (concept, goal) => `Bagaimana konsep "${concept}..." yang disebutkan dalam pelajaran mempengaruhi pencapaian ${goal} Anda?`,
        options: (concept) => [
          `Seperti yang dijelaskan secara detail dalam pelajaran, ${concept}... meningkatkan efektivitas dan mengurangi risiko`,
          'Tidak ada dampak signifikan',
          'Hanya penting secara teoritis',
          'Hanya elemen opsional'
        ]
      },
      application: {
        practice: (practice) => `Bagaimana Anda akan mengimplementasikan praktik "${practice}..." yang dijelaskan dalam pelajaran dalam pekerjaan Anda sendiri?`,
        keyTerm: (keyTerm) => `Bagaimana Anda akan menggunakan konsep "${keyTerm}" seperti yang dijelaskan dalam pelajaran dalam praktik?`,
        options: {
          practice: [
            'Saya mengikuti metode yang dijelaskan dalam pelajaran langkah demi langkah, mendokumentasikan hasil, dan menyempurnakan proses',
            'Saya mencoba semuanya sekaligus',
            'Saya hanya membaca, tidak menerapkan',
            'Saya menunggu orang lain melakukannya'
          ],
          keyTerm: [
            'Saya mengikuti langkah-langkah yang dijelaskan secara detail dalam pelajaran, menguji hasil, dan mendokumentasikan pengalaman saya',
            'Saya hanya memahaminya secara teoritis',
            'Saya tidak menerapkannya',
            'Saya menunggu instruksi lebih lanjut'
          ]
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
    return {
      criticalThinking: {
        question: (concept, goal) => `Como o conceito "${concept}...", mencionado na lição, impacta o alcance de seus ${goal}?`,
        options: (concept) => [
          `Como descrito em detalhes na lição, ${concept}... aumenta a eficácia e reduz os riscos`,
          'Sem impacto significativo',
          'Importa apenas teoricamente',
          'Apenas um elemento opcional'
        ]
      },
      application: {
        practice: (practice) => `Como você implementaria a prática "${practice}...", descrita na lição, em seu próprio trabalho?`,
        keyTerm: (keyTerm) => `Como você usaria o conceito "${keyTerm}" conforme descrito na lição na prática?`,
        options: {
          practice: [
            'Sigo o método descrito na lição passo a passo, documento os resultados e refino o processo',
            'Tento tudo de uma vez',
            'Apenas leio, não aplico',
            'Espero que outros façam'
          ],
          keyTerm: [
            'Sigo as etapas descritas em detalhes na lição, testo os resultados e documento minhas experiências',
            'Apenas entendo teoricamente',
            'Não aplico',
            'Espero por mais instruções'
          ]
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
    return {
      criticalThinking: {
        question: (concept, goal) => `पाठ में उल्लिखित अवधारणा "${concept}..." आपके ${goal} प्राप्त करने को कैसे प्रभावित करती है?`,
        options: (concept) => [
          `जैसा कि पाठ में विस्तार से वर्णित है, ${concept}... प्रभावशीलता बढ़ाता है और जोखिम कम करता है`,
          'कोई महत्वपूर्ण प्रभाव नहीं',
          'केवल सैद्धांतिक रूप से मायने रखता है',
          'केवल एक वैकल्पिक तत्व'
        ]
      },
      application: {
        practice: (practice) => `आप पाठ में वर्णित अभ्यास "${practice}..." को अपने काम में कैसे लागू करेंगे?`,
        keyTerm: (keyTerm) => `आप पाठ में वर्णित तरीके से अवधारणा "${keyTerm}" का व्यवहार में कैसे उपयोग करेंगे?`,
        options: {
          practice: [
            'मैं पाठ में वर्णित विधि का चरणबद्ध तरीके से पालन करता हूं, परिणामों को दस्तावेजीकृत करता हूं, और प्रक्रिया को परिष्कृत करता हूं',
            'मैं एक साथ सब कुछ आजमाता हूं',
            'मैं केवल पढ़ता हूं, लागू नहीं करता',
            'मैं दूसरों के करने की प्रतीक्षा करता हूं'
          ],
          keyTerm: [
            'मैं पाठ में विस्तार से वर्णित चरणों का पालन करता हूं, परिणामों का परीक्षण करता हूं, और अपने अनुभवों को दस्तावेजीकृत करता हूं',
            'मैं इसे केवल सैद्धांतिक रूप से समझता हूं',
            'मैं इसे लागू नहीं करता',
            'मैं आगे के निर्देशों की प्रतीक्षा करता हूं'
          ]
        }
      },
      recall: {
        keyTerm: (keyTerm, titleParam?: string) => {
          const lessonTitle = titleParam || title;
          if (keyTerm.length > 15) {
            return `${keyTerm} "${lessonTitle}" पाठ में क्या भूमिका निभाता है?`;
          }
          return `पाठ में चर्चा किए गए ${lessonTitle} के संदर्भ में ${keyTerm} कितना महत्वपूर्ण है?`;
        },
        topic: (topic) => `"${topic}" अनुभाग में पाठ में क्या शामिल है?`,
        fallback: (title) => `कौन सा तत्व "${title}" पाठ में विस्तार से वर्णित पद्धति का हिस्सा है?`,
        options: {
          keyTerm: (keyTerm) => [
            `जैसा कि पाठ में विस्तार से वर्णित है, ${keyTerm} प्रक्रियाओं को अनुकूलित करने और लक्ष्यों को प्राप्त करने में महत्वपूर्ण भूमिका निभाता है`,
            'केवल परिधीय जानकारी, कोई महत्वपूर्ण भूमिका नहीं',
            'केवल एक सैद्धांतिक अवधारणा, कोई व्यावहारिक अनुप्रयोग नहीं',
            'पाठ में उल्लेख नहीं किया गया'
          ],
          topic: (topic) => [
            `पाठ में विस्तार से वर्णित ${topic.toLowerCase()} से संबंधित विशिष्ट जानकारी, विधियां और उदाहरण`,
            'केवल सामान्य जानकारी',
            'केवल सैद्धांतिक ज्ञान',
            'कोई विशिष्ट सामग्री नहीं'
          ],
          fallback: [
            'पाठ में उल्लिखित और विस्तार से वर्णित विशिष्ट चरण और सर्वोत्तम प्रथाएं',
            'केवल सामान्य सिद्धांत',
            'केवल सैद्धांतिक ज्ञान',
            'कोई विशिष्ट पद्धति नहीं'
          ]
        }
      }
    };
  }
  
  // Hungarian templates (existing)
  if (lang === 'hu') {
    return {
      criticalThinking: {
        question: (concept, goal) =>
          `Egy "${title}" témájú helyzetben hogyan befolyásolja a(z) "${concept.substring(0, 50)}..." a ${goal} elérését, és melyik kockázat a legvalószínűbb rossz alkalmazás esetén?`,
        options: (concept) => [
          `${concept.substring(0, 30)}... helyes alkalmazása javítja a minőséget/pontosságot, és csökkenti a hibákból eredő kockázatot`,
          'Nincs jelentős hatás',
          'Csak elméleti szinten számít',
          'Csak opcionális elem'
        ]
      },
      application: {
        practice: (practice) =>
          `A "${title}" témában szereplő "${practice.substring(0, 40)}..." lépést hogyan vezetnéd be a saját folyamatodba (konkrét lépések + ellenőrzés)?`,
        keyTerm: (keyTerm) =>
          `Hogyan alkalmaznád a "${keyTerm}" koncepciót a(z) "${title}" témájú feladatban úgy, hogy a kimenet mérhető és ellenőrizhető legyen?`,
        options: {
          practice: [
            'Lépésről lépésre bevezetem, előtte/utána mérőpontokat állítok be, dokumentálom az eredményt, és iterálok a hibák alapján',
            'Egyszerre mindent átállítok, majd nem ellenőrzöm, mi romlott el',
            'Csak elolvasom, de nem építem be a folyamatomba',
            'Megvárom, hogy valaki más készítsen helyettem megoldást'
          ],
          keyTerm: [
            'Konkrét ellenőrzőlistát készítek, implementálom egy kis scope-on, tesztelem a hatást, majd kiterjesztem a teljes scope-ra',
            'Csak definícióként kezelem, ezért nem derül ki, működik-e a gyakorlatban',
            'Kihagyom az implementációt, mert túl időigényesnek tűnik',
            'Végrehajtom, de nem mérek és nem dokumentálok semmit'
          ]
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
  return {
    criticalThinking: {
      question: (concept, goal) =>
        `In a "${title}" scenario, how would applying "${concept.substring(0, 50)}..." change your ability to achieve ${goal}, and what is the most likely risk if you implement it incorrectly?`,
      options: (concept) => [
        `${concept.substring(0, 30)}... applied correctly improves outcome quality and reduces risk; applied poorly it increases errors and downstream rework`,
        'No significant impact',
        'Only matters theoretically',
        'Only an optional element'
      ]
    },
    application: {
      practice: (practice) =>
        `In your own workflow, how would you implement the "${practice.substring(0, 40)}..." step from "${title}" (specific steps + a way to verify it worked)?`,
      keyTerm: (keyTerm) =>
        `How would you apply the "${keyTerm}" concept to a "${title}" task so the outcome is measurable and verifiable?`,
      options: {
        practice: [
          'I implement it step by step, define before/after checks, document results, and iterate based on what fails',
          'I change everything at once and skip verification',
          'I only read about it but never integrate it into my process',
          'I wait for someone else to produce the solution'
        ],
        keyTerm: [
          'I create a checklist, apply it to a small scope first, measure the impact, then roll it out to the full scope',
          'I keep it as a definition and never validate it in practice',
          'I skip implementation because it seems time-consuming',
          'I implement it but do not measure or document anything'
        ]
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
  needed: number
): ContentBasedQuestion[] {
  const questions: ContentBasedQuestion[] = [];
  
  // Extract key concepts
  const { mainTopics, keyTerms, examples, practices, concepts } = extractKeyConcepts(content, title);
  
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
  const addQuestion = (q: ContentBasedQuestion) => {
    const normalized = q.question.trim().toLowerCase();
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    questions.push(q);
    return true;
  };

  const goal = titleLower.includes('geo') ? 'GEO' : (language === 'hu' ? 'célok' : 'goals');
  const criticalSources = [
    ...concepts,
    ...mainTopics,
    ...keyTerms,
    title,
  ].filter(Boolean);

  // Generate CRITICAL_THINKING
  for (let i = 0; i < targetCritical; i++) {
    const source = criticalSources[i] || title;
    const concept = String(source).replace(/\s+/g, ' ').trim().substring(0, 80);
    const questionText = templates.criticalThinking.question(concept, goal);
    addQuestion({
      question: questionText.length < 40 ? `${questionText} (${title})` : questionText,
      options: templates.criticalThinking.options(concept.substring(0, 40)),
      correctIndex: 0,
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

  let appIndex = 0;
  while (questions.length < targetCritical + targetApplication && appIndex < appSources.length * 3) {
    const source = appSources[appIndex % appSources.length];
    const raw = String(source.value).replace(/\s+/g, ' ').trim();
    const snippet = raw.substring(0, source.kind === 'practice' ? 60 : 80);
    const questionText =
      source.kind === 'practice'
        ? templates.application.practice(snippet)
        : templates.application.keyTerm(snippet);

    addQuestion({
      question: questionText.length < 40 ? `${questionText} (${title})` : questionText,
      options: source.kind === 'practice' ? templates.application.options.practice : templates.application.options.keyTerm,
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific',
      questionType: QuizQuestionType.APPLICATION,
      hashtags: getHashtags(QuizQuestionType.APPLICATION, QuestionDifficulty.MEDIUM),
    });
    appIndex++;
  }

  return questions.slice(0, needed);
}
