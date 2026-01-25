/**
 * Seed Day 3 Enhanced Quiz Questions
 * 
 * Purpose: Enhance Day 3 quizzes from 5 to 7 questions across all 10 languages
 * Why: Part of Quiz Quality Enhancement - Phase 1, Day 3
 * 
 * Lesson Topic: Goal hierarchy: vision → outcomes → projects → next actions
 * 
 * Structure:
 * - 7 questions per language (5 existing + 1 rewritten + 2 new)
 * - All questions have UUIDs, hashtags, questionType
 * - Cognitive mix: 60% recall, 30% application, 10% critical thinking
 * 
 * Languages: HU, EN, TR, BG, PL, VI, ID, AR, PT, HI (10 total)
 * Total questions: 70 (7 × 10 languages)
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { randomUUID } from 'crypto';

config({ path: resolve(process.cwd(), '.env.local') });

import { default as connectDB } from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion, QuestionDifficulty, QuestionType } from '../app/lib/models';

const COURSE_ID_BASE = 'PRODUCTIVITY_2026';
const DAY_NUMBER = 3;
const LANGUAGES = ['HU', 'EN', 'TR', 'BG', 'PL', 'VI', 'ID', 'AR', 'PT', 'HI'];

/**
 * Day 3 Enhanced Questions - All Languages
 * Topic: Goal hierarchy (vision → outcomes → projects → next actions)
 * Structure: 7 questions per language
 * Q1-Q3: Keep (Recall - foundational concepts)
 * Q4: Rewritten (Application - from definition to purpose)
 * Q5: Keep (Application - scenario-based)
 * Q6: New (Application - practical implementation)
 * Q7: New (Critical Thinking - systems integration)
 */
const DAY3_QUESTIONS: Record<string, Array<{
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: QuestionDifficulty;
  category: string;
  questionType: QuestionType;
  hashtags: string[];
}>> = {
  EN: [
    // Q1: Four levels of goal hierarchy (RECALL - Keep)
    {
      question: "According to the lesson, what are the four levels of goal hierarchy?",
      options: [
        "Goals, tasks, deadlines, priorities",
        "Vision, outcomes, projects, next actions",
        "Strategy, tactics, execution, review",
        "Long-term, medium-term, short-term, daily"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Goal Hierarchy",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q2: Vision timeframe (RECALL - Keep)
    {
      question: "What is the typical timeframe for a vision according to the lesson?",
      options: [
        "1-2 years",
        "3-5 years",
        "6-12 months",
        "1-3 months"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Goal Hierarchy",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q3: Outcomes timeframe (RECALL - Keep)
    {
      question: "What is the typical timeframe for outcomes according to the lesson?",
      options: [
        "1-2 years",
        "3-5 years",
        "6-12 months",
        "1-3 months"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Goal Hierarchy",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q4: Why next actions matter (APPLICATION - Rewritten from definition)
    {
      question: "Why are next actions critical in the goal hierarchy system?",
      options: [
        "They are optional and can be skipped",
        "Without next actions, there is no progress - each level feeds the next",
        "They are only needed for long-term goals",
        "They replace the need for projects"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Goal Hierarchy",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q5: Common mistake - projects without vision (APPLICATION - Keep)
    {
      question: "What is a common mistake mentioned in the lesson regarding goal hierarchy?",
      options: [
        "Having too many next actions",
        "Projects without vision - doing work but not knowing why",
        "Setting outcomes that are too specific",
        "Having a vision that is too detailed"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Goal Hierarchy",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q6: Breaking down vision to next actions (APPLICATION - New)
    {
      question: "A person has a vision to 'become a lead developer' but struggles to make progress. According to the lesson's framework, what should they do first?",
      options: [
        "Start coding immediately without planning",
        "Define measurable outcomes (6-12 months) that lead to the vision, then create projects, then identify next actions",
        "Focus only on the vision and wait for opportunities",
        "Skip outcomes and go straight to projects"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Goal Hierarchy",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q7: Integrating all four levels (CRITICAL THINKING - New)
    {
      question: "A manager has a clear vision and well-defined outcomes, but their projects lack next actions. According to the lesson, what does this scenario demonstrate about their productivity?",
      options: [
        "Optimal goal hierarchy implementation",
        "A breakdown in the hierarchy - planning without action means no progress",
        "Efficient strategic thinking",
        "Good long-term planning"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Goal Hierarchy",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#goal-setting", "#advanced", "#critical-thinking", "#en", "#all-languages"]
    }
  ],
  // Hungarian translations
  HU: [
    {
      question: "A lecke szerint mik a célhierarchia négy szintje?",
      options: [
        "Célok, feladatok, határidők, prioritások",
        "Vízió, eredmények, projektek, következő lépések",
        "Stratégia, taktika, végrehajtás, értékelés",
        "Hosszú távú, középtávú, rövid távú, napi"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Goal Hierarchy",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "Mi a vízió tipikus időkerete a lecke szerint?",
      options: [
        "1-2 év",
        "3-5 év",
        "6-12 hónap",
        "1-3 hónap"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Goal Hierarchy",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "Mi az eredmények tipikus időkerete a lecke szerint?",
      options: [
        "1-2 év",
        "3-5 év",
        "6-12 hónap",
        "1-3 hónap"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Goal Hierarchy",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "Miért kritikusak a következő lépések a célhierarchia rendszerében?",
      options: [
        "Opcionálisak és kihagyhatók",
        "Következő lépések nélkül nincs haladás - minden szint a következőt táplálja",
        "Csak hosszú távú célokhoz szükségesek",
        "Felváltják a projektek szükségességét"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Goal Hierarchy",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Mi a gyakori hiba, amelyet a lecke említ a célhierarchiával kapcsolatban?",
      options: [
        "Túl sok következő lépés",
        "Vízió nélküli projektek - dolgozol, de nem tudod, miért",
        "Túl specifikus eredmények kitűzése",
        "Túl részletes vízió"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Goal Hierarchy",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy személy víziója, hogy 'vezető fejlesztő legyen', de nehezen halad előre. A lecke keretrendszere szerint mit kellene először tennie?",
      options: [
        "Azonnal kezdjen el kódolni tervezés nélkül",
        "Határozzon meg mérhető eredményeket (6-12 hónap), amelyek a vízióhoz vezetnek, majd hozzon létre projekteket, majd azonosítsa a következő lépéseket",
        "Csak a vízióra koncentráljon és várjon lehetőségekre",
        "Hagyja ki az eredményeket és menjen egyenesen a projektekhez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Goal Hierarchy",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy menedzsernek van egy tiszta víziója és jól meghatározott eredményei, de a projekteiknek nincsenek következő lépései. A lecke szerint mit mutat ez a forgatókönyv a termelékenységükről?",
      options: [
        "Optimális célhierarchia megvalósítás",
        "A hierarchia összeomlása - tervezés cselekvés nélkül azt jelenti, hogy nincs haladás",
        "Hatékony stratégiai gondolkodás",
        "Jó hosszú távú tervezés"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Goal Hierarchy",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#goal-setting", "#advanced", "#critical-thinking", "#hu", "#all-languages"]
    }
  ],
  // Turkish (TR) - Professional translations
  TR: [
    {
      question: "Derse göre hedef hiyerarşisinin dört seviyesi nedir?",
      options: [
        "Hedefler, görevler, son tarihler, öncelikler",
        "Vizyon, sonuçlar, projeler, sonraki adımlar",
        "Strateji, taktik, uygulama, gözden geçirme",
        "Uzun vadeli, orta vadeli, kısa vadeli, günlük"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Goal Hierarchy",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre bir vizyon için tipik zaman çerçevesi nedir?",
      options: [
        "1-2 yıl",
        "3-5 yıl",
        "6-12 ay",
        "1-3 ay"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Goal Hierarchy",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre sonuçlar için tipik zaman çerçevesi nedir?",
      options: [
        "1-2 yıl",
        "3-5 yıl",
        "6-12 ay",
        "1-3 ay"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Goal Hierarchy",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Sonraki adımlar neden hedef hiyerarşisi sisteminde kritiktir?",
      options: [
        "İsteğe bağlıdırlar ve atlanabilirler",
        "Sonraki adımlar olmadan ilerleme yoktur - her seviye bir sonrakini besler",
        "Sadece uzun vadeli hedefler için gereklidirler",
        "Projelerin ihtiyacını değiştirirler"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Goal Hierarchy",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Dersin bahsettiği hedef hiyerarşisiyle ilgili yaygın bir hata nedir?",
      options: [
        "Çok fazla sonraki adım",
        "Vizyonsuz projeler - çalışıyorsunuz ama nedenini bilmiyorsunuz",
        "Çok spesifik sonuçlar belirlemek",
        "Çok detaylı bir vizyona sahip olmak"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Goal Hierarchy",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir kişinin 'lider geliştirici olmak' vizyonu var ama ilerleme kaydetmekte zorlanıyor. Dersin çerçevesine göre önce ne yapmalı?",
      options: [
        "Planlama yapmadan hemen kodlamaya başlamalı",
        "Vizyona götüren ölçülebilir sonuçlar (6-12 ay) tanımlamalı, sonra projeler oluşturmalı, sonra sonraki adımları belirlemeli",
        "Sadece vizyona odaklanmalı ve fırsatları beklemeli",
        "Sonuçları atlamalı ve doğrudan projelere gitmeli"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Goal Hierarchy",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir yöneticinin net bir vizyonu ve iyi tanımlanmış sonuçları var, ancak projelerinin sonraki adımları yok. Derse göre bu senaryo onların verimliliği hakkında neyi gösterir?",
      options: [
        "Optimal hedef hiyerarşisi uygulaması",
        "Hiyerarşide bir çöküş - eylemsiz planlama ilerleme olmadığı anlamına gelir",
        "Verimli stratejik düşünme",
        "İyi uzun vadeli planlama"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Goal Hierarchy",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#goal-setting", "#advanced", "#critical-thinking", "#tr", "#all-languages"]
    }
  ],
  // Bulgarian (BG) - Professional translations
  BG: [
    {
      question: "Според урока, какви са четирите нива на йерархията на целите?",
      options: [
        "Цели, задачи, крайни срокове, приоритети",
        "Визия, резултати, проекти, следващи стъпки",
        "Стратегия, тактика, изпълнение, преглед",
        "Дългосрочно, средносрочно, краткосрочно, дневно"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Определяне на цели",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Какъв е типичният времеви период за визия според урока?",
      options: [
        "1-2 години",
        "3-5 години",
        "6-12 месеца",
        "1-3 месеца"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Определяне на цели",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Какъв е типичният времеви период за резултати според урока?",
      options: [
        "1-2 години",
        "3-5 години",
        "6-12 месеца",
        "1-3 месеца"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Определяне на цели",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Защо следващите стъпки са критични в системата за йерархия на целите?",
      options: [
        "Те са опционални и могат да бъдат пропуснати",
        "Без следващи стъпки няма напредък - всяко ниво храни следващото",
        "Те са необходими само за дългосрочни цели",
        "Те заменят необходимостта от проекти"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Определяне на цели",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Каква е често срещана грешка, спомената в урока относно йерархията на целите?",
      options: [
        "Да имате твърде много следващи стъпки",
        "Проекти без визия - работа, но без да знаете защо",
        "Определяне на резултати, които са твърде специфични",
        "Да имате визия, която е твърде детайлна"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Определяне на цели",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Човек има визия да 'стане водещ разработчик', но се бори да напредва. Според рамката на урока, какво трябва да направи първо?",
      options: [
        "Започне да кодира веднага без планиране",
        "Дефинира измерими резултати (6-12 месеца), които водят към визията, след това създаде проекти, след това идентифицира следващите стъпки",
        "Фокусира се само върху визията и чака възможности",
        "Пропусне резултатите и отиде директно към проектите"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Определяне на цели",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Мениджърът има ясна визия и добре дефинирани резултати, но проектите им нямат следващи стъпки. Според урока, какво демонстрира този сценарий за тяхната продуктивност?",
      options: [
        "Оптимална реализация на йерархията на целите",
        "Срив в йерархията - планиране без действие означава липса на напредък",
        "Ефективно стратегическо мислене",
        "Добро дългосрочно планиране"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Определяне на цели",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#goal-setting", "#advanced", "#critical-thinking", "#bg", "#all-languages"]
    }
  ],
  // Polish (PL) - Professional translations
  PL: [
    {
      question: "Według lekcji, jakie są cztery poziomy hierarchii celów?",
      options: [
        "Cele, zadania, terminy, priorytety",
        "Wizja, wyniki, projekty, następne kroki",
        "Strategia, taktyka, wykonanie, przegląd",
        "Długoterminowe, średnioterminowe, krótkoterminowe, dzienne"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Wyznaczanie celów",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Jaki jest typowy okres czasowy dla wizji według lekcji?",
      options: [
        "1-2 lata",
        "3-5 lat",
        "6-12 miesięcy",
        "1-3 miesiące"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Wyznaczanie celów",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Jaki jest typowy okres czasowy dla wyników według lekcji?",
      options: [
        "1-2 lata",
        "3-5 lat",
        "6-12 miesięcy",
        "1-3 miesiące"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Wyznaczanie celów",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Dlaczego następne kroki są kluczowe w systemie hierarchii celów?",
      options: [
        "Są opcjonalne i można je pominąć",
        "Bez następnych kroków nie ma postępu - każdy poziom karmi następny",
        "Są potrzebne tylko do celów długoterminowych",
        "Zastępują potrzebę projektów"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Wyznaczanie celów",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Jaki jest powszechny błąd wymieniony w lekcji dotyczący hierarchii celów?",
      options: [
        "Mieć zbyt wiele następnych kroków",
        "Projekty bez wizji - robisz, ale nie wiesz dlaczego",
        "Ustawianie wyników, które są zbyt szczegółowe",
        "Mieć wizję, która jest zbyt szczegółowa"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Wyznaczanie celów",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Osoba ma wizję 'zostać liderem deweloperem', ale ma trudności z postępem. Według ram lekcji, co powinna zrobić najpierw?",
      options: [
        "Zacząć kodować natychmiast bez planowania",
        "Zdefiniować mierzalne wyniki (6-12 miesięcy), które prowadzą do wizji, następnie utworzyć projekty, następnie zidentyfikować następne kroki",
        "Skoncentrować się tylko na wizji i czekać na możliwości",
        "Pominąć wyniki i przejść bezpośrednio do projektów"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Wyznaczanie celów",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Menedżer ma jasną wizję i dobrze zdefiniowane wyniki, ale ich projekty nie mają następnych kroków. Według lekcji, co demonstruje ten scenariusz o ich produktywności?",
      options: [
        "Optymalna implementacja hierarchii celów",
        "Załamanie w hierarchii - planowanie bez działania oznacza brak postępu",
        "Skuteczne myślenie strategiczne",
        "Dobre długoterminowe planowanie"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Wyznaczanie celów",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#goal-setting", "#advanced", "#critical-thinking", "#pl", "#all-languages"]
    }
  ],
  // Vietnamese (VI) - Professional translations
  VI: [
    {
      question: "Theo bài học, bốn cấp độ của hệ thống phân cấp mục tiêu là gì?",
      options: [
        "Mục tiêu, nhiệm vụ, thời hạn, ưu tiên",
        "Tầm nhìn, kết quả, dự án, hành động tiếp theo",
        "Chiến lược, chiến thuật, thực hiện, đánh giá",
        "Dài hạn, trung hạn, ngắn hạn, hàng ngày"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Thiết lập mục tiêu",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Khung thời gian điển hình cho tầm nhìn theo bài học là gì?",
      options: [
        "1-2 năm",
        "3-5 năm",
        "6-12 tháng",
        "1-3 tháng"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Thiết lập mục tiêu",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Khung thời gian điển hình cho kết quả theo bài học là gì?",
      options: [
        "1-2 năm",
        "3-5 năm",
        "6-12 tháng",
        "1-3 tháng"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Thiết lập mục tiêu",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Tại sao các hành động tiếp theo quan trọng trong hệ thống phân cấp mục tiêu?",
      options: [
        "Chúng là tùy chọn và có thể bỏ qua",
        "Không có hành động tiếp theo, không có tiến bộ - mỗi cấp độ nuôi dưỡng cấp độ tiếp theo",
        "Chúng chỉ cần thiết cho mục tiêu dài hạn",
        "Chúng thay thế nhu cầu về dự án"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Thiết lập mục tiêu",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Lỗi phổ biến được đề cập trong bài học về hệ thống phân cấp mục tiêu là gì?",
      options: [
        "Có quá nhiều hành động tiếp theo",
        "Dự án không có tầm nhìn - làm việc nhưng không biết tại sao",
        "Đặt kết quả quá cụ thể",
        "Có tầm nhìn quá chi tiết"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Thiết lập mục tiêu",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Một người có tầm nhìn 'trở thành nhà phát triển hàng đầu' nhưng gặp khó khăn trong việc tiến bộ. Theo khung của bài học, họ nên làm gì trước?",
      options: [
        "Bắt đầu lập trình ngay lập tức mà không lập kế hoạch",
        "Xác định kết quả có thể đo lường (6-12 tháng) dẫn đến tầm nhìn, sau đó tạo dự án, sau đó xác định hành động tiếp theo",
        "Chỉ tập trung vào tầm nhìn và chờ đợi cơ hội",
        "Bỏ qua kết quả và đi thẳng đến dự án"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Thiết lập mục tiêu",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Một người quản lý có tầm nhìn rõ ràng và kết quả được xác định rõ, nhưng các dự án của họ thiếu hành động tiếp theo. Theo bài học, kịch bản này thể hiện điều gì về năng suất của họ?",
      options: [
        "Triển khai hệ thống phân cấp mục tiêu tối ưu",
        "Sự cố trong hệ thống phân cấp - lập kế hoạch mà không hành động có nghĩa là không có tiến bộ",
        "Suy nghĩ chiến lược hiệu quả",
        "Lập kế hoạch dài hạn tốt"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Thiết lập mục tiêu",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#goal-setting", "#advanced", "#critical-thinking", "#vi", "#all-languages"]
    }
  ],
  // Indonesian (ID) - Professional translations
  ID: [
    {
      question: "Menurut pelajaran, apa empat tingkat hierarki tujuan?",
      options: [
        "Tujuan, tugas, tenggat waktu, prioritas",
        "Visi, hasil, proyek, tindakan berikutnya",
        "Strategi, taktik, eksekusi, tinjauan",
        "Jangka panjang, jangka menengah, jangka pendek, harian"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Penetapan Tujuan",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Berapa kerangka waktu tipikal untuk visi menurut pelajaran?",
      options: [
        "1-2 tahun",
        "3-5 tahun",
        "6-12 bulan",
        "1-3 bulan"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Penetapan Tujuan",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Berapa kerangka waktu tipikal untuk hasil menurut pelajaran?",
      options: [
        "1-2 tahun",
        "3-5 tahun",
        "6-12 bulan",
        "1-3 bulan"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Penetapan Tujuan",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Mengapa tindakan berikutnya penting dalam sistem hierarki tujuan?",
      options: [
        "Mereka opsional dan dapat dilewati",
        "Tanpa tindakan berikutnya, tidak ada kemajuan - setiap tingkat memberi makan tingkat berikutnya",
        "Mereka hanya diperlukan untuk tujuan jangka panjang",
        "Mereka menggantikan kebutuhan akan proyek"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Penetapan Tujuan",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Apa kesalahan umum yang disebutkan dalam pelajaran tentang hierarki tujuan?",
      options: [
        "Memiliki terlalu banyak tindakan berikutnya",
        "Proyek tanpa visi - bekerja tetapi tidak tahu mengapa",
        "Menetapkan hasil yang terlalu spesifik",
        "Memiliki visi yang terlalu detail"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Penetapan Tujuan",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Seseorang memiliki visi untuk 'menjadi pengembang utama' tetapi kesulitan membuat kemajuan. Menurut kerangka pelajaran, apa yang harus mereka lakukan terlebih dahulu?",
      options: [
        "Mulai coding segera tanpa perencanaan",
        "Tentukan hasil yang dapat diukur (6-12 bulan) yang mengarah ke visi, kemudian buat proyek, kemudian identifikasi tindakan berikutnya",
        "Fokus hanya pada visi dan menunggu peluang",
        "Lewati hasil dan langsung ke proyek"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Penetapan Tujuan",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Seorang manajer memiliki visi yang jelas dan hasil yang terdefinisi dengan baik, tetapi proyek mereka tidak memiliki tindakan berikutnya. Menurut pelajaran, apa yang ditunjukkan skenario ini tentang produktivitas mereka?",
      options: [
        "Implementasi hierarki tujuan yang optimal",
        "Kegagalan dalam hierarki - perencanaan tanpa tindakan berarti tidak ada kemajuan",
        "Berpikir strategis yang efisien",
        "Perencanaan jangka panjang yang baik"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Penetapan Tujuan",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#goal-setting", "#advanced", "#critical-thinking", "#id", "#all-languages"]
    }
  ],
  // Arabic (AR) - Professional translations (RTL)
  AR: [
    {
      question: "وفقًا للدرس، ما هي المستويات الأربعة لتسلسل الهدف؟",
      options: [
        "الأهداف والمهام والمواعيد النهائية والأولويات",
        "الرؤية والنتائج والمشاريع والإجراءات التالية",
        "الاستراتيجية والتكتيكات والتنفيذ والمراجعة",
        "طويلة الأجل ومتوسطة الأجل وقصيرة الأجل ويومية"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "تحديد الأهداف",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "ما هو الإطار الزمني النموذجي للرؤية وفقًا للدرس؟",
      options: [
        "1-2 سنة",
        "3-5 سنوات",
        "6-12 شهرًا",
        "1-3 أشهر"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "تحديد الأهداف",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "ما هو الإطار الزمني النموذجي للنتائج وفقًا للدرس؟",
      options: [
        "1-2 سنة",
        "3-5 سنوات",
        "6-12 شهرًا",
        "1-3 أشهر"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "تحديد الأهداف",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "لماذا الإجراءات التالية مهمة في نظام تسلسل الهدف؟",
      options: [
        "إنها اختيارية ويمكن تخطيها",
        "بدون الإجراءات التالية، لا يوجد تقدم - كل مستوى يغذي المستوى التالي",
        "إنها مطلوبة فقط للأهداف طويلة الأجل",
        "إنها تحل محل الحاجة إلى المشاريع"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "تحديد الأهداف",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "ما هو الخطأ الشائع المذكور في الدرس فيما يتعلق بتسلسل الهدف؟",
      options: [
        "وجود الكثير من الإجراءات التالية",
        "مشاريع بدون رؤية - تعمل ولكن لا تعرف لماذا",
        "تحديد نتائج محددة للغاية",
        "وجود رؤية مفصلة للغاية"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "تحديد الأهداف",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "شخص لديه رؤية لـ 'أن يصبح مطورًا رئيسيًا' لكنه يواجه صعوبة في إحراز تقدم. وفقًا لإطار الدرس، ماذا يجب أن يفعل أولاً؟",
      options: [
        "بدء البرمجة فورًا دون تخطيط",
        "تحديد نتائج قابلة للقياس (6-12 شهرًا) تؤدي إلى الرؤية، ثم إنشاء المشاريع، ثم تحديد الإجراءات التالية",
        "التركيز فقط على الرؤية وانتظار الفرص",
        "تخطي النتائج والذهاب مباشرة إلى المشاريع"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "تحديد الأهداف",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "لدى مدير رؤية واضحة ونتائج محددة جيدًا، لكن مشاريعهم تفتقر إلى الإجراءات التالية. وفقًا للدرس، ماذا يوضح هذا السيناريو حول إنتاجيتهم؟",
      options: [
        "تنفيذ تسلسل الهدف الأمثل",
        "انهيار في التسلسل - التخطيط دون إجراء يعني عدم وجود تقدم",
        "التفكير الاستراتيجي الفعال",
        "التخطيط طويل الأجل الجيد"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "تحديد الأهداف",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#goal-setting", "#advanced", "#critical-thinking", "#ar", "#all-languages"]
    }
  ],
  // Portuguese (PT) - Professional translations (Brazilian)
  PT: [
    {
      question: "De acordo com a lição, quais são os quatro níveis da hierarquia de metas?",
      options: [
        "Metas, tarefas, prazos, prioridades",
        "Visão, resultados, projetos, próximas ações",
        "Estratégia, táticas, execução, revisão",
        "Longo prazo, médio prazo, curto prazo, diário"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Definição de Metas",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "Qual é o período típico para uma visão de acordo com a lição?",
      options: [
        "1-2 anos",
        "3-5 anos",
        "6-12 meses",
        "1-3 meses"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Definição de Metas",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "Qual é o período típico para resultados de acordo com a lição?",
      options: [
        "1-2 anos",
        "3-5 anos",
        "6-12 meses",
        "1-3 meses"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Definição de Metas",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "Por que as próximas ações são críticas no sistema de hierarquia de metas?",
      options: [
        "Elas são opcionais e podem ser ignoradas",
        "Sem próximas ações, não há progresso - cada nível alimenta o próximo",
        "Elas são necessárias apenas para metas de longo prazo",
        "Elas substituem a necessidade de projetos"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Definição de Metas",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Qual é um erro comum mencionado na lição sobre hierarquia de metas?",
      options: [
        "Ter muitas próximas ações",
        "Projetos sem visão - trabalhando mas não sabendo por quê",
        "Definir resultados muito específicos",
        "Ter uma visão muito detalhada"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Definição de Metas",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Uma pessoa tem uma visão de 'tornar-se desenvolvedor líder', mas tem dificuldade em progredir. De acordo com a estrutura da lição, o que ela deve fazer primeiro?",
      options: [
        "Começar a codificar imediatamente sem planejamento",
        "Definir resultados mensuráveis (6-12 meses) que levam à visão, depois criar projetos, depois identificar próximas ações",
        "Focar apenas na visão e esperar oportunidades",
        "Pular resultados e ir direto para projetos"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Definição de Metas",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Um gerente tem uma visão clara e resultados bem definidos, mas seus projetos não têm próximas ações. De acordo com a lição, o que este cenário demonstra sobre sua produtividade?",
      options: [
        "Implementação ideal da hierarquia de metas",
        "Uma quebra na hierarquia - planejamento sem ação significa nenhum progresso",
        "Pensamento estratégico eficiente",
        "Bom planejamento de longo prazo"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Definição de Metas",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#goal-setting", "#advanced", "#critical-thinking", "#pt", "#all-languages"]
    }
  ],
  // Hindi (HI) - Professional translations
  HI: [
    {
      question: "पाठ के अनुसार, लक्ष्य पदानुक्रम के चार स्तर क्या हैं?",
      options: [
        "लक्ष्य, कार्य, समय सीमा, प्राथमिकताएं",
        "दृष्टि, परिणाम, परियोजनाएं, अगले कदम",
        "रणनीति, रणनीति, निष्पादन, समीक्षा",
        "दीर्घकालिक, मध्यम अवधि, अल्पकालिक, दैनिक"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "लक्ष्य निर्धारण",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार दृष्टि के लिए विशिष्ट समय सीमा क्या है?",
      options: [
        "1-2 वर्ष",
        "3-5 वर्ष",
        "6-12 महीने",
        "1-3 महीने"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "लक्ष्य निर्धारण",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार परिणामों के लिए विशिष्ट समय सीमा क्या है?",
      options: [
        "1-2 वर्ष",
        "3-5 वर्ष",
        "6-12 महीने",
        "1-3 महीने"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "लक्ष्य निर्धारण",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "लक्ष्य पदानुक्रम प्रणाली में अगले कदम क्यों महत्वपूर्ण हैं?",
      options: [
        "वे वैकल्पिक हैं और छोड़े जा सकते हैं",
        "अगले कदमों के बिना, कोई प्रगति नहीं है - प्रत्येक स्तर अगले को खिलाता है",
        "वे केवल दीर्घकालिक लक्ष्यों के लिए आवश्यक हैं",
        "वे परियोजनाओं की आवश्यकता को प्रतिस्थापित करते हैं"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "लक्ष्य निर्धारण",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "पाठ में लक्ष्य पदानुक्रम के संबंध में उल्लिखित एक सामान्य त्रुटि क्या है?",
      options: [
        "बहुत सारे अगले कदम होना",
        "दृष्टि के बिना परियोजनाएं - काम करना लेकिन यह नहीं जानना कि क्यों",
        "बहुत विशिष्ट परिणाम निर्धारित करना",
        "बहुत विस्तृत दृष्टि होना"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "लक्ष्य निर्धारण",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक व्यक्ति की दृष्टि 'एक प्रमुख डेवलपर बनने' की है लेकिन प्रगति करने में कठिनाई हो रही है। पाठ के ढांचे के अनुसार, उन्हें पहले क्या करना चाहिए?",
      options: [
        "योजना के बिना तुरंत कोडिंग शुरू करें",
        "मापने योग्य परिणाम (6-12 महीने) परिभाषित करें जो दृष्टि की ओर ले जाते हैं, फिर परियोजनाएं बनाएं, फिर अगले कदमों की पहचान करें",
        "केवल दृष्टि पर ध्यान केंद्रित करें और अवसरों की प्रतीक्षा करें",
        "परिणामों को छोड़ें और सीधे परियोजनाओं पर जाएं"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "लक्ष्य निर्धारण",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक प्रबंधक के पास एक स्पष्ट दृष्टि और अच्छी तरह से परिभाषित परिणाम हैं, लेकिन उनकी परियोजनाओं में अगले कदमों की कमी है। पाठ के अनुसार, यह परिदृश्य उनकी उत्पादकता के बारे में क्या प्रदर्शित करता है?",
      options: [
        "लक्ष्य पदानुक्रम का इष्टतम कार्यान्वयन",
        "पदानुक्रम में टूटना - कार्रवाई के बिना योजना का मतलब कोई प्रगति नहीं है",
        "कुशल रणनीतिक सोच",
        "अच्छी दीर्घकालिक योजना"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "लक्ष्य निर्धारण",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#goal-setting", "#advanced", "#critical-thinking", "#hi", "#all-languages"]
    }
  ]
};

async function seedDay3Enhanced() {
  try {
    await connectDB();
    console.log('🌱 SEEDING DAY 3 ENHANCED QUIZ QUESTIONS\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    let totalQuestions = 0;
    let totalUpdated = 0;
    let totalCreated = 0;

    for (const lang of LANGUAGES) {
      const courseId = `${COURSE_ID_BASE}_${lang}`;
      const lessonId = `${COURSE_ID_BASE}_${lang}_DAY_03`;

      console.log(`\n🌍 Processing: ${lang} (${courseId})`);

      // Find course
      const course = await Course.findOne({ courseId }).lean();
      if (!course) {
        console.log(`   ⚠️  Course not found, skipping...`);
        continue;
      }

      // Find lesson
      const lesson = await Lesson.findOne({ lessonId }).lean();
      if (!lesson) {
        console.log(`   ⚠️  Lesson not found, skipping...`);
        continue;
      }

      console.log(`   ✅ Lesson found: "${lesson.title}"`);

      // Get questions for this language
      const questions = DAY3_QUESTIONS[lang];
      
      if (!questions || questions.length === 0) {
        console.error(`   ❌ ERROR: No questions defined for ${lang}! Questions MUST be in course language.`);
        throw new Error(`Missing translations for ${lang} - Day 3 questions must be in course language, not English fallback`);
      }

      console.log(`   📝 Seeding ${questions.length} questions...`);

      // Process each question
      for (let i = 0; i < questions.length; i++) {
        const qData = questions[i];
        
        // Generate UUID
        const uuid = randomUUID();

        // Check if question already exists (by question text)
        const existing = await QuizQuestion.findOne({
          lessonId,
          question: qData.question,
          isCourseSpecific: true,
        });

        if (existing) {
          // Update existing question
          existing.options = qData.options;
          existing.correctIndex = qData.correctIndex;
          existing.difficulty = qData.difficulty;
          existing.category = qData.category;
          existing.questionType = qData.questionType;
          existing.hashtags = qData.hashtags;
          existing.uuid = uuid;
          existing.metadata.auditedAt = new Date();
          existing.metadata.auditedBy = 'AI-Developer';
          existing.metadata.updatedAt = new Date();
          
          await existing.save();
          totalUpdated++;
          console.log(`      ✅ Q${i + 1}: Updated`);
        } else {
          // Create new question
          const question = new QuizQuestion({
            uuid,
            lessonId,
            courseId: new (require('mongoose')).Types.ObjectId(course._id.toString()),
            question: qData.question,
            options: qData.options,
            correctIndex: qData.correctIndex,
            difficulty: qData.difficulty,
            category: qData.category,
            isCourseSpecific: true,
            questionType: qData.questionType,
            hashtags: qData.hashtags,
            isActive: true,
            showCount: 0,
            correctCount: 0,
            metadata: {
              createdAt: new Date(),
              updatedAt: new Date(),
              auditedAt: new Date(),
              auditedBy: 'AI-Developer',
            },
          });

          await question.save();
          totalCreated++;
          console.log(`      ✅ Q${i + 1}: Created`);
        }
        totalQuestions++;
      }

      console.log(`   ✅ ${lang}: ${questions.length} questions processed`);
    }

    console.log(`\n${'═'.repeat(60)}\n`);
    console.log(`📊 SUMMARY:\n`);
    console.log(`   Languages processed: ${LANGUAGES.length}`);
    console.log(`   Total questions: ${totalQuestions}`);
    console.log(`   Questions created: ${totalCreated}`);
    console.log(`   Questions updated: ${totalUpdated}`);
    console.log(`\n✅ DAY 3 ENHANCEMENT COMPLETE!\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedDay3Enhanced();
