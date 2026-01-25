/**
 * Seed Day 19 Enhanced Quiz Questions
 * 
 * Purpose: Enhance Day 19 quizzes from 5 to 7 questions across all 10 languages
 * Why: Part of Quiz Quality Enhancement - Phase 1, Day 19
 * 
 * Lesson Topic: Long-Term Planning (years ahead, strategy, evolution)
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
const DAY_NUMBER = 19;
const LANGUAGES = ['HU', 'EN', 'TR', 'BG', 'PL', 'VI', 'ID', 'AR', 'PT', 'HI'];

/**
 * Day 19 Enhanced Questions - All Languages
 * Topic: Long-Term Planning
 * Structure: 7 questions per language
 * Q1-Q3: Keep (Recall - foundational concepts)
 * Q4: Rewritten (Application - from definition to purpose)
 * Q5: Keep (Application - scenario-based)
 * Q6: New (Application - practical implementation)
 * Q7: New (Critical Thinking - systems integration)
 */
const DAY19_QUESTIONS: Record<string, Array<{
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: QuestionDifficulty;
  category: string;
  questionType: QuestionType;
  hashtags: string[];
}>> = {
  EN: [
    // Q1: Long-term planning definition (RECALL)
    {
      question: "According to the lesson, what is long-term planning?",
      options: [
        "Daily task lists",
        "Strategic thinking that extends years ahead, setting multi-year goals, and creating evolution paths",
        "Only monthly goals",
        "No planning needed"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Long-Term Planning",
      questionType: QuestionType.RECALL,
      hashtags: ["#long-term-planning", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q2: Strategy importance (RECALL)
    {
      question: "According to the lesson, why is strategy important in long-term planning?",
      options: [
        "It's not important",
        "It provides direction, aligns actions with goals, and enables systematic progress toward multi-year objectives",
        "It only applies to businesses",
        "It requires no thought"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Long-Term Planning",
      questionType: QuestionType.RECALL,
      hashtags: ["#long-term-planning", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q3: Evolution in planning (RECALL)
    {
      question: "According to the lesson, what does 'evolution' mean in long-term planning?",
      options: [
        "No changes",
        "Adapting plans over time, refining strategies, and adjusting goals as circumstances change",
        "Sticking to original plans",
        "Avoiding all adjustments"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Long-Term Planning",
      questionType: QuestionType.RECALL,
      hashtags: ["#long-term-planning", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q4: Why long-term planning matters (APPLICATION - Rewritten)
    {
      question: "Why is long-term planning important according to the lesson?",
      options: [
        "It eliminates daily work",
        "It enables progress toward yearly and multi-year goals, provides strategic direction, allows systematic evolution, and creates alignment between daily actions and long-term vision",
        "It only applies to certain people",
        "It requires no effort"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Long-Term Planning",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#long-term-planning", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q5: Strategic alignment scenario (APPLICATION - Keep)
    {
      question: "A person has daily tasks but no clear direction toward long-term goals. According to the lesson, what is likely missing?",
      options: [
        "More daily tasks",
        "Long-term planning with multi-year goals, strategic direction, and evolution framework",
        "Less planning",
        "No structure needed"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Long-Term Planning",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#long-term-planning", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q6: Creating long-term plan (APPLICATION - New)
    {
      question: "You want to create a 5-year plan for your career. According to the lesson, what should you include?",
      options: [
        "Just daily tasks",
        "Multi-year goals, strategic direction, evolution framework for adapting over time, and alignment between daily actions and long-term vision",
        "Only goals",
        "Only strategy"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Long-Term Planning",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#long-term-planning", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q7: Planning failure analysis (CRITICAL THINKING - New)
    {
      question: "A professional works hard daily but makes no progress toward meaningful long-term goals, leading to frustration. According to the lesson's framework, what is the core issue?",
      options: [
        "Not enough daily work",
        "Lack of long-term planning - missing multi-year goals, strategic direction, and evolution framework that align daily actions with long-term vision",
        "Too much planning",
        "Long-term planning is unnecessary"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Long-Term Planning",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#long-term-planning", "#advanced", "#critical-thinking", "#en", "#all-languages"]
    }
  ],
  // Hungarian (HU) - Professional translations
  HU: [
    {
      question: "A lecke szerint mi a hosszú távú tervezés?",
      options: [
        "Napi feladatlisták",
        "Stratégiai gondolkodás, amely évekre előre nyúlik, többéves célokat tűz ki, és evolúciós utakat hoz létre",
        "Csak havi célok",
        "Nincs szükség tervezésre"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Hosszú Távú Tervezés",
      questionType: QuestionType.RECALL,
      hashtags: ["#long-term-planning", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint miért fontos a stratégia a hosszú távú tervezésben?",
      options: [
        "Nem fontos",
        "Irányt ad, összehangolja a cselekedeteket a célokkal, és lehetővé teszi a szisztematikus haladást a többéves célok felé",
        "Csak vállalkozásokra vonatkozik",
        "Nem igényel gondolkodást"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Hosszú Távú Tervezés",
      questionType: QuestionType.RECALL,
      hashtags: ["#long-term-planning", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint mit jelent az 'evolúció' a hosszú távú tervezésben?",
      options: [
        "Nincs változás",
        "A tervek időbeli alkalmazkodása, stratégiák finomítása, és célok módosítása a körülmények változásával",
        "Az eredeti tervekhez ragaszkodás",
        "Minden módosítás elkerülése"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Hosszú Távú Tervezés",
      questionType: QuestionType.RECALL,
      hashtags: ["#long-term-planning", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "Miért fontos a hosszú távú tervezés a lecke szerint?",
      options: [
        "Kiküszöböli a napi munkát",
        "Lehetővé teszi a haladást az éves és többéves célok felé, stratégiai irányt ad, lehetővé teszi a szisztematikus evolúciót, és összehangolást teremt a napi cselekedetek és a hosszú távú vízió között",
        "Csak bizonyos emberekre vonatkozik",
        "Nem igényel erőfeszítést"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Hosszú Távú Tervezés",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#long-term-planning", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy személynek vannak napi feladatai, de nincs világos irány a hosszú távú célok felé. A lecke szerint mi hiányzik valószínűleg?",
      options: [
        "Több napi feladat",
        "Hosszú távú tervezés többéves célokkal, stratégiai iránnyal és evolúciós keretrendszerrel",
        "Kevesebb tervezés",
        "Nincs szükség struktúrára"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Hosszú Távú Tervezés",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#long-term-planning", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Létre szeretnél hozni egy 5 éves tervet a karrieredhez. A lecke szerint mit kellene tartalmaznia?",
      options: [
        "Csak napi feladatokat",
        "Többéves célokat, stratégiai irányt, evolúciós keretrendszert az időbeli alkalmazkodáshoz, és összehangolást a napi cselekedetek és a hosszú távú vízió között",
        "Csak célokat",
        "Csak stratégiát"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Hosszú Távú Tervezés",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#long-term-planning", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy szakember keményen dolgozik naponta, de nem halad a jelentős hosszú távú célok felé, ami frusztrációhoz vezet. A lecke keretrendszere szerint mi a fő probléma?",
      options: [
        "Nincs elég napi munka",
        "Hiányzik a hosszú távú tervezés - hiányoznak a többéves célok, stratégiai irány és evolúciós keretrendszer, amelyek összehangolják a napi cselekedeteket a hosszú távú vízióval",
        "Túl sok tervezés",
        "A hosszú távú tervezés felesleges"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Hosszú Távú Tervezés",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#long-term-planning", "#advanced", "#critical-thinking", "#hu", "#all-languages"]
    }
  ],
  // Turkish (TR) - Professional translations
  TR: [
    {
      question: "Derse göre uzun vadeli planlama nedir?",
      options: [
        "Günlük görev listeleri",
        "Yıllar öncesine uzanan stratejik düşünme, çok yıllı hedefler belirleme ve evrim yolları oluşturma",
        "Sadece aylık hedefler",
        "Planlama gerekmez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Uzun Vadeli Planlama",
      questionType: QuestionType.RECALL,
      hashtags: ["#long-term-planning", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre uzun vadeli planlamada strateji neden önemlidir?",
      options: [
        "Önemli değil",
        "Yön sağlar, eylemleri hedeflerle uyumlu hale getirir ve çok yıllı hedeflere doğru sistematik ilerlemeyi sağlar",
        "Sadece işletmelere uygulanır",
        "Düşünce gerektirmez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Uzun Vadeli Planlama",
      questionType: QuestionType.RECALL,
      hashtags: ["#long-term-planning", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre uzun vadeli planlamada 'evrim' ne anlama gelir?",
      options: [
        "Değişiklik yok",
        "Planları zamanla uyarlama, stratejileri iyileştirme ve koşullar değiştikçe hedefleri ayarlama",
        "Orijinal planlara bağlı kalmak",
        "Tüm ayarlamalardan kaçınmak"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Uzun Vadeli Planlama",
      questionType: QuestionType.RECALL,
      hashtags: ["#long-term-planning", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre uzun vadeli planlama neden önemlidir?",
      options: [
        "Günlük işi ortadan kaldırır",
        "Yıllık ve çok yıllı hedeflere doğru ilerlemeyi sağlar, stratejik yön sağlar, sistematik evrime izin verir ve günlük eylemler ile uzun vadeli vizyon arasında uyum yaratır",
        "Sadece belirli kişilere uygulanır",
        "Çaba gerektirmez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Uzun Vadeli Planlama",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#long-term-planning", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir kişinin günlük görevleri var ama uzun vadeli hedeflere doğru net bir yön yok. Derse göre muhtemelen ne eksik?",
      options: [
        "Daha fazla günlük görev",
        "Çok yıllı hedefler, stratejik yön ve evrim çerçevesi ile uzun vadeli planlama",
        "Daha az planlama",
        "Yapı gerekmez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Uzun Vadeli Planlama",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#long-term-planning", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Kariyeriniz için 5 yıllık bir plan oluşturmak istiyorsunuz. Derse göre ne içermeli?",
      options: [
        "Sadece günlük görevler",
        "Çok yıllı hedefler, stratejik yön, zamanla uyarlama için evrim çerçevesi ve günlük eylemler ile uzun vadeli vizyon arasında uyum",
        "Sadece hedefler",
        "Sadece strateji"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Uzun Vadeli Planlama",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#long-term-planning", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir profesyonel günlük olarak çok çalışıyor ancak anlamlı uzun vadeli hedeflere doğru ilerleme kaydetmiyor, bu da hayal kırıklığına yol açıyor. Dersin çerçevesine göre temel sorun nedir?",
      options: [
        "Yeterli günlük iş yok",
        "Uzun vadeli planlama eksikliği - günlük eylemleri uzun vadeli vizyonla uyumlu hale getiren çok yıllı hedefler, stratejik yön ve evrim çerçevesi eksik",
        "Çok fazla planlama",
        "Uzun vadeli planlama gereksiz"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Uzun Vadeli Planlama",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#long-term-planning", "#advanced", "#critical-thinking", "#tr", "#all-languages"]
    }
  ],
  // Bulgarian (BG) - Professional translations
  BG: [
    {
      question: "Според урока, какво е дългосрочното планиране?",
      options: [
        "Дневни списъци със задачи",
        "Стратегическо мислене, което се простира години напред, определяне на многогодишни цели и създаване на пътища за еволюция",
        "Само месечни цели",
        "Не е нужно планиране"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Дългосрочно Планиране",
      questionType: QuestionType.RECALL,
      hashtags: ["#long-term-planning", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, защо стратегията е важна в дългосрочното планиране?",
      options: [
        "Не е важна",
        "Осигурява посока, подравнява действията с целите и позволява систематичен напредък към многогодишни цели",
        "Прилага се само за бизнеси",
        "Не изисква мислене"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Дългосрочно Планиране",
      questionType: QuestionType.RECALL,
      hashtags: ["#long-term-planning", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, какво означава 'еволюция' в дългосрочното планиране?",
      options: [
        "Няма промени",
        "Адаптиране на плановете с течение на времето, усъвършенстване на стратегиите и коригиране на целите при промяна на обстоятелствата",
        "Държане на оригиналните планове",
        "Избягване на всички корекции"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Дългосрочно Планиране",
      questionType: QuestionType.RECALL,
      hashtags: ["#long-term-planning", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Защо дългосрочното планиране е важно според урока?",
      options: [
        "Елиминира дневната работа",
        "Позволява напредък към годишни и многогодишни цели, осигурява стратегическа посока, позволява систематична еволюция и създава подравняване между дневните действия и дългосрочната визия",
        "Прилага се само за определени хора",
        "Не изисква усилие"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Дългосрочно Планиране",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#long-term-planning", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Човек има дневни задачи, но няма ясна посока към дългосрочни цели. Според урока, какво вероятно липсва?",
      options: [
        "Повече дневни задачи",
        "Дългосрочно планиране с многогодишни цели, стратегическа посока и рамка за еволюция",
        "По-малко планиране",
        "Не е нужна структура"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Дългосрочно Планиране",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#long-term-planning", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Искате да създадете 5-годишен план за кариерата си. Според урока, какво трябва да включи?",
      options: [
        "Просто дневни задачи",
        "Многогодишни цели, стратегическа посока, рамка за еволюция за адаптиране с течение на времето и подравняване между дневните действия и дългосрочната визия",
        "Само цели",
        "Само стратегия"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Дългосрочно Планиране",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#long-term-planning", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Професионалист работи усърдно дневно, но не постига напредък към значими дългосрочни цели, водещи до фрустрация. Според рамката на урока, какъв е основният проблем?",
      options: [
        "Няма достатъчно дневна работа",
        "Липса на дългосрочно планиране - липсват многогодишни цели, стратегическа посока и рамка за еволюция, които подравняват дневните действия с дългосрочната визия",
        "Твърде много планиране",
        "Дългосрочното планиране е ненужно"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Дългосрочно Планиране",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#long-term-planning", "#advanced", "#critical-thinking", "#bg", "#all-languages"]
    }
  ],
  // Polish (PL) - Professional translations
  PL: [
    {
      question: "Według lekcji, czym jest planowanie długoterminowe?",
      options: [
        "Listy codziennych zadań",
        "Myślenie strategiczne, które rozciąga się na lata naprzód, wyznaczanie celów wieloletnich i tworzenie ścieżek ewolucji",
        "Tylko miesięczne cele",
        "Planowanie nie jest potrzebne"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Planowanie Długoterminowe",
      questionType: QuestionType.RECALL,
      hashtags: ["#long-term-planning", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, dlaczego strategia jest ważna w planowaniu długoterminowym?",
      options: [
        "Nie jest ważna",
        "Zapewnia kierunek, wyrównuje działania z celami i umożliwia systematyczny postęp w kierunku celów wieloletnich",
        "Dotyczy tylko firm",
        "Nie wymaga myślenia"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Planowanie Długoterminowe",
      questionType: QuestionType.RECALL,
      hashtags: ["#long-term-planning", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, co oznacza 'ewolucja' w planowaniu długoterminowym?",
      options: [
        "Brak zmian",
        "Dostosowywanie planów w czasie, doskonalenie strategii i korygowanie celów w miarę zmiany okoliczności",
        "Trzymanie się oryginalnych planów",
        "Unikanie wszystkich korekt"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Planowanie Długoterminowe",
      questionType: QuestionType.RECALL,
      hashtags: ["#long-term-planning", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Dlaczego planowanie długoterminowe jest ważne według lekcji?",
      options: [
        "Eliminuje codzienną pracę",
        "Umożliwia postęp w kierunku celów rocznych i wieloletnich, zapewnia kierunek strategiczny, pozwala na systematyczną ewolucję i tworzy wyrównanie między codziennymi działaniami a długoterminową wizją",
        "Dotyczy tylko niektórych ludzi",
        "Nie wymaga wysiłku"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Planowanie Długoterminowe",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#long-term-planning", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Osoba ma codzienne zadania, ale nie ma jasnego kierunku w stronę długoterminowych celów. Według lekcji, czego prawdopodobnie brakuje?",
      options: [
        "Więcej codziennych zadań",
        "Planowanie długoterminowe z celami wieloletnimi, kierunkiem strategicznym i ramami ewolucji",
        "Mniej planowania",
        "Nie jest potrzebna struktura"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Planowanie Długoterminowe",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#long-term-planning", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Chcesz stworzyć 5-letni plan dla swojej kariery. Według lekcji, co powinno zawierać?",
      options: [
        "Tylko codzienne zadania",
        "Cele wieloletnie, kierunek strategiczny, ramy ewolucji do adaptacji w czasie i wyrównanie między codziennymi działaniami a długoterminową wizją",
        "Tylko cele",
        "Tylko strategia"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Planowanie Długoterminowe",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#long-term-planning", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Profesjonalista ciężko pracuje codziennie, ale nie osiąga postępu w kierunku znaczących długoterminowych celów, prowadząc do frustracji. Według ram lekcji, jaki jest główny problem?",
      options: [
        "Niewystarczająca codzienna praca",
        "Brak planowania długoterminowego - brakuje celów wieloletnich, kierunku strategicznego i ram ewolucji, które wyrównują codzienne działania z długoterminową wizją",
        "Zbyt dużo planowania",
        "Planowanie długoterminowe jest niepotrzebne"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Planowanie Długoterminowe",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#long-term-planning", "#advanced", "#critical-thinking", "#pl", "#all-languages"]
    }
  ],
  // Vietnamese (VI) - Professional translations
  VI: [
    {
      question: "Theo bài học, lập kế hoạch dài hạn là gì?",
      options: [
        "Danh sách công việc hàng ngày",
        "Tư duy chiến lược mở rộng nhiều năm trước, đặt mục tiêu đa năm, và tạo đường tiến hóa",
        "Chỉ mục tiêu hàng tháng",
        "Không cần lập kế hoạch"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Lập Kế Hoạch Dài Hạn",
      questionType: QuestionType.RECALL,
      hashtags: ["#long-term-planning", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, tại sao chiến lược quan trọng trong lập kế hoạch dài hạn?",
      options: [
        "Nó không quan trọng",
        "Nó cung cấp hướng dẫn, căn chỉnh hành động với mục tiêu, và cho phép tiến trình có hệ thống hướng tới mục tiêu đa năm",
        "Nó chỉ áp dụng cho doanh nghiệp",
        "Nó không yêu cầu suy nghĩ"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Lập Kế Hoạch Dài Hạn",
      questionType: QuestionType.RECALL,
      hashtags: ["#long-term-planning", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, 'tiến hóa' có nghĩa là gì trong lập kế hoạch dài hạn?",
      options: [
        "Không có thay đổi",
        "Thích ứng kế hoạch theo thời gian, tinh chỉnh chiến lược, và điều chỉnh mục tiêu khi hoàn cảnh thay đổi",
        "Bám vào kế hoạch ban đầu",
        "Tránh tất cả điều chỉnh"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Lập Kế Hoạch Dài Hạn",
      questionType: QuestionType.RECALL,
      hashtags: ["#long-term-planning", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Tại sao lập kế hoạch dài hạn quan trọng theo bài học?",
      options: [
        "Nó loại bỏ công việc hàng ngày",
        "Nó cho phép tiến trình hướng tới mục tiêu hàng năm và đa năm, cung cấp hướng dẫn chiến lược, cho phép tiến hóa có hệ thống, và tạo sự căn chỉnh giữa hành động hàng ngày và tầm nhìn dài hạn",
        "Nó chỉ áp dụng cho một số người",
        "Nó không yêu cầu nỗ lực"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Lập Kế Hoạch Dài Hạn",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#long-term-planning", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Một người có công việc hàng ngày nhưng không có hướng dẫn rõ ràng hướng tới mục tiêu dài hạn. Theo bài học, điều gì có thể đang thiếu?",
      options: [
        "Nhiều công việc hàng ngày hơn",
        "Lập kế hoạch dài hạn với mục tiêu đa năm, hướng dẫn chiến lược, và khung tiến hóa",
        "Ít lập kế hoạch hơn",
        "Không cần cấu trúc"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Lập Kế Hoạch Dài Hạn",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#long-term-planning", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Bạn muốn tạo một kế hoạch 5 năm cho sự nghiệp của mình. Theo bài học, nó nên bao gồm những gì?",
      options: [
        "Chỉ công việc hàng ngày",
        "Mục tiêu đa năm, hướng dẫn chiến lược, khung tiến hóa để thích ứng theo thời gian, và sự căn chỉnh giữa hành động hàng ngày và tầm nhìn dài hạn",
        "Chỉ mục tiêu",
        "Chỉ chiến lược"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Lập Kế Hoạch Dài Hạn",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#long-term-planning", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Một chuyên gia làm việc chăm chỉ hàng ngày nhưng không đạt được tiến trình hướng tới mục tiêu dài hạn có ý nghĩa, dẫn đến thất vọng. Theo khung của bài học, vấn đề cốt lõi là gì?",
      options: [
        "Không đủ công việc hàng ngày",
        "Thiếu lập kế hoạch dài hạn - thiếu mục tiêu đa năm, hướng dẫn chiến lược, và khung tiến hóa căn chỉnh hành động hàng ngày với tầm nhìn dài hạn",
        "Quá nhiều lập kế hoạch",
        "Lập kế hoạch dài hạn là không cần thiết"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Lập Kế Hoạch Dài Hạn",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#long-term-planning", "#advanced", "#critical-thinking", "#vi", "#all-languages"]
    }
  ],
  // Indonesian (ID) - Professional translations
  ID: [
    {
      question: "Menurut pelajaran, apa itu perencanaan jangka panjang?",
      options: [
        "Daftar tugas harian",
        "Pemikiran strategis yang meluas bertahun-tahun ke depan, menetapkan tujuan multi-tahun, dan menciptakan jalur evolusi",
        "Hanya tujuan bulanan",
        "Tidak perlu perencanaan"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Perencanaan Jangka Panjang",
      questionType: QuestionType.RECALL,
      hashtags: ["#long-term-planning", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, mengapa strategi penting dalam perencanaan jangka panjang?",
      options: [
        "Tidak penting",
        "Memberikan arah, menyelaraskan tindakan dengan tujuan, dan memungkinkan kemajuan sistematis menuju tujuan multi-tahun",
        "Hanya berlaku untuk bisnis",
        "Tidak memerlukan pemikiran"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Perencanaan Jangka Panjang",
      questionType: QuestionType.RECALL,
      hashtags: ["#long-term-planning", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, apa arti 'evolusi' dalam perencanaan jangka panjang?",
      options: [
        "Tidak ada perubahan",
        "Mengadaptasi rencana dari waktu ke waktu, menyempurnakan strategi, dan menyesuaikan tujuan saat keadaan berubah",
        "Berpegang pada rencana asli",
        "Menghindari semua penyesuaian"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Perencanaan Jangka Panjang",
      questionType: QuestionType.RECALL,
      hashtags: ["#long-term-planning", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Mengapa perencanaan jangka panjang penting menurut pelajaran?",
      options: [
        "Ini menghilangkan pekerjaan harian",
        "Ini memungkinkan kemajuan menuju tujuan tahunan dan multi-tahun, memberikan arah strategis, memungkinkan evolusi sistematis, dan menciptakan keselarasan antara tindakan harian dan visi jangka panjang",
        "Ini hanya berlaku untuk orang tertentu",
        "Ini tidak memerlukan upaya"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Perencanaan Jangka Panjang",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#long-term-planning", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Seseorang memiliki tugas harian tetapi tidak ada arah yang jelas menuju tujuan jangka panjang. Menurut pelajaran, apa yang mungkin kurang?",
      options: [
        "Lebih banyak tugas harian",
        "Perencanaan jangka panjang dengan tujuan multi-tahun, arah strategis, dan kerangka evolusi",
        "Lebih sedikit perencanaan",
        "Tidak perlu struktur"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Perencanaan Jangka Panjang",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#long-term-planning", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Anda ingin membuat rencana 5 tahun untuk karier Anda. Menurut pelajaran, apa yang harus disertakan?",
      options: [
        "Hanya tugas harian",
        "Tujuan multi-tahun, arah strategis, kerangka evolusi untuk adaptasi dari waktu ke waktu, dan keselarasan antara tindakan harian dan visi jangka panjang",
        "Hanya tujuan",
        "Hanya strategi"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Perencanaan Jangka Panjang",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#long-term-planning", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Seorang profesional bekerja keras setiap hari tetapi tidak membuat kemajuan menuju tujuan jangka panjang yang bermakna, menyebabkan frustrasi. Menurut kerangka pelajaran, apa masalah intinya?",
      options: [
        "Tidak cukup pekerjaan harian",
        "Kurangnya perencanaan jangka panjang - kurang tujuan multi-tahun, arah strategis, dan kerangka evolusi yang menyelaraskan tindakan harian dengan visi jangka panjang",
        "Terlalu banyak perencanaan",
        "Perencanaan jangka panjang tidak perlu"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Perencanaan Jangka Panjang",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#long-term-planning", "#advanced", "#critical-thinking", "#id", "#all-languages"]
    }
  ],
  // Arabic (AR) - Professional translations (RTL)
  AR: [
    {
      question: "وفقًا للدرس، ما هو التخطيط طويل الأجل?",
      options: [
        "قوائم المهام اليومية",
        "التفكير الاستراتيجي الذي يمتد لسنوات قادمة، تحديد الأهداف متعددة السنوات، وإنشاء مسارات التطور",
        "فقط الأهداف الشهرية",
        "لا حاجة للتخطيط"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "التخطيط طويل الأجل",
      questionType: QuestionType.RECALL,
      hashtags: ["#long-term-planning", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، لماذا الاستراتيجية مهمة في التخطيط طويل الأجل?",
      options: [
        "ليست مهمة",
        "توفر الاتجاه، تحاذي الإجراءات مع الأهداف، وتمكن من التقدم المنهجي نحو الأهداف متعددة السنوات",
        "تنطبق فقط على الشركات",
        "لا تتطلب تفكيرًا"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "التخطيط طويل الأجل",
      questionType: QuestionType.RECALL,
      hashtags: ["#long-term-planning", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، ماذا يعني 'التطور' في التخطيط طويل الأجل?",
      options: [
        "لا توجد تغييرات",
        "تعديل الخطط بمرور الوقت، تحسين الاستراتيجيات، وتعديل الأهداف مع تغير الظروف",
        "الالتزام بالخطط الأصلية",
        "تجنب جميع التعديلات"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "التخطيط طويل الأجل",
      questionType: QuestionType.RECALL,
      hashtags: ["#long-term-planning", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "لماذا التخطيط طويل الأجل مهم وفقًا للدرس?",
      options: [
        "إنه يلغي العمل اليومي",
        "إنه يمكّن من التقدم نحو الأهداف السنوية ومتعددة السنوات، يوفر الاتجاه الاستراتيجي، يسمح بالتطور المنهجي، ويخلق المحاذاة بين الإجراءات اليومية والرؤية طويلة الأجل",
        "ينطبق فقط على أشخاص معينين",
        "لا يتطلب جهد"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "التخطيط طويل الأجل",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#long-term-planning", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "شخص لديه مهام يومية ولكن لا يوجد اتجاه واضح نحو الأهداف طويلة الأجل. وفقًا للدرس، ما الذي ربما كان مفقودًا?",
      options: [
        "المزيد من المهام اليومية",
        "التخطيط طويل الأجل مع الأهداف متعددة السنوات، الاتجاه الاستراتيجي، وإطار التطور",
        "أقل تخطيطًا",
        "لا حاجة للهيكل"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "التخطيط طويل الأجل",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#long-term-planning", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "تريد إنشاء خطة مدتها 5 سنوات لمسيرتك المهنية. وفقًا للدرس، ماذا يجب أن تتضمن?",
      options: [
        "فقط المهام اليومية",
        "أهداف متعددة السنوات، الاتجاه الاستراتيجي، إطار التطور للتكيف بمرور الوقت، والمحاذاة بين الإجراءات اليومية والرؤية طويلة الأجل",
        "فقط الأهداف",
        "فقط الاستراتيجية"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "التخطيط طويل الأجل",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#long-term-planning", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "محترف يعمل بجد يوميًا لكنه لا يحقق تقدمًا نحو أهداف طويلة الأجل ذات معنى، مما يؤدي إلى الإحباط. وفقًا لإطار الدرس، ما هي المشكلة الأساسية?",
      options: [
        "لا يوجد عمل يومي كافٍ",
        "نقص التخطيط طويل الأجل - نقص الأهداف متعددة السنوات، الاتجاه الاستراتيجي، وإطار التطور الذي يحاذي الإجراءات اليومية مع الرؤية طويلة الأجل",
        "الكثير من التخطيط",
        "التخطيط طويل الأجل غير ضروري"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "التخطيط طويل الأجل",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#long-term-planning", "#advanced", "#critical-thinking", "#ar", "#all-languages"]
    }
  ],
  // Portuguese (PT) - Professional translations (Brazilian)
  PT: [
    {
      question: "De acordo com a lição, o que é planejamento de longo prazo?",
      options: [
        "Listas de tarefas diárias",
        "Pensamento estratégico que se estende anos à frente, estabelecendo objetivos multienais e criando caminhos de evolução",
        "Apenas objetivos mensais",
        "Não é necessário planejamento"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Planejamento de Longo Prazo",
      questionType: QuestionType.RECALL,
      hashtags: ["#long-term-planning", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, por que a estratégia é importante no planejamento de longo prazo?",
      options: [
        "Não é importante",
        "Fornece direção, alinha ações com objetivos e permite progresso sistemático em direção a objetivos multienais",
        "Aplica-se apenas a empresas",
        "Não requer pensamento"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Planejamento de Longo Prazo",
      questionType: QuestionType.RECALL,
      hashtags: ["#long-term-planning", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, o que significa 'evolução' no planejamento de longo prazo?",
      options: [
        "Sem mudanças",
        "Adaptar planos ao longo do tempo, refinar estratégias e ajustar objetivos conforme as circunstâncias mudam",
        "Aderir aos planos originais",
        "Evitar todos os ajustes"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Planejamento de Longo Prazo",
      questionType: QuestionType.RECALL,
      hashtags: ["#long-term-planning", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "Por que o planejamento de longo prazo é importante de acordo com a lição?",
      options: [
        "Elimina o trabalho diário",
        "Permite progresso em direção a objetivos anuais e multienais, fornece direção estratégica, permite evolução sistemática e cria alinhamento entre ações diárias e visão de longo prazo",
        "Aplica-se apenas a certas pessoas",
        "Não requer esforço"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Planejamento de Longo Prazo",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#long-term-planning", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Uma pessoa tem tarefas diárias, mas não tem direção clara em direção a objetivos de longo prazo. De acordo com a lição, o que provavelmente está faltando?",
      options: [
        "Mais tarefas diárias",
        "Planejamento de longo prazo com objetivos multienais, direção estratégica e estrutura de evolução",
        "Menos planejamento",
        "Não é necessária estrutura"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Planejamento de Longo Prazo",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#long-term-planning", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Você quer criar um plano de 5 anos para sua carreira. De acordo com a lição, o que deve incluir?",
      options: [
        "Apenas tarefas diárias",
        "Objetivos multienais, direção estratégica, estrutura de evolução para adaptação ao longo do tempo e alinhamento entre ações diárias e visão de longo prazo",
        "Apenas objetivos",
        "Apenas estratégia"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Planejamento de Longo Prazo",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#long-term-planning", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Um profissional trabalha duro diariamente, mas não faz progresso em direção a objetivos de longo prazo significativos, levando à frustração. De acordo com a estrutura da lição, qual é o problema central?",
      options: [
        "Não há trabalho diário suficiente",
        "Falta de planejamento de longo prazo - faltam objetivos multienais, direção estratégica e estrutura de evolução que alinham ações diárias com visão de longo prazo",
        "Muito planejamento",
        "Planejamento de longo prazo é desnecessário"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Planejamento de Longo Prazo",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#long-term-planning", "#advanced", "#critical-thinking", "#pt", "#all-languages"]
    }
  ],
  // Hindi (HI) - Professional translations
  HI: [
    {
      question: "पाठ के अनुसार, दीर्घकालीन योजना क्या है?",
      options: [
        "दैनिक कार्य सूचियां",
        "रणनीतिक सोच जो वर्षों आगे तक फैली हुई है, बहु-वर्षीय लक्ष्य निर्धारित करना, और विकास पथ बनाना",
        "केवल मासिक लक्ष्य",
        "योजना की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "दीर्घकालीन योजना",
      questionType: QuestionType.RECALL,
      hashtags: ["#long-term-planning", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, दीर्घकालीन योजना में रणनीति क्यों महत्वपूर्ण है?",
      options: [
        "यह महत्वपूर्ण नहीं है",
        "यह दिशा प्रदान करती है, कार्यों को लक्ष्यों के साथ संरेखित करती है, और बहु-वर्षीय उद्देश्यों की ओर व्यवस्थित प्रगति सक्षम करती है",
        "यह केवल व्यवसायों पर लागू होती है",
        "इसके लिए सोच की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "दीर्घकालीन योजना",
      questionType: QuestionType.RECALL,
      hashtags: ["#long-term-planning", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, दीर्घकालीन योजना में 'विकास' का क्या अर्थ है?",
      options: [
        "कोई परिवर्तन नहीं",
        "समय के साथ योजनाओं को अनुकूलित करना, रणनीतियों को परिष्कृत करना, और परिस्थितियों के बदलने पर लक्ष्यों को समायोजित करना",
        "मूल योजनाओं से चिपके रहना",
        "सभी समायोजन से बचना"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "दीर्घकालीन योजना",
      questionType: QuestionType.RECALL,
      hashtags: ["#long-term-planning", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार दीर्घकालीन योजना क्यों महत्वपूर्ण है?",
      options: [
        "यह दैनिक काम को समाप्त करती है",
        "यह वार्षिक और बहु-वर्षीय लक्ष्यों की ओर प्रगति सक्षम करती है, रणनीतिक दिशा प्रदान करती है, व्यवस्थित विकास की अनुमति देती है, और दैनिक कार्यों और दीर्घकालीन दृष्टि के बीच संरेखण बनाती है",
        "यह केवल कुछ लोगों पर लागू होती है",
        "इसके लिए प्रयास की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "दीर्घकालीन योजना",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#long-term-planning", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक व्यक्ति के पास दैनिक कार्य हैं लेकिन दीर्घकालीन लक्ष्यों की ओर कोई स्पष्ट दिशा नहीं है। पाठ के अनुसार, क्या संभवतः गायब है?",
      options: [
        "अधिक दैनिक कार्य",
        "बहु-वर्षीय लक्ष्यों, रणनीतिक दिशा, और विकास ढांचे के साथ दीर्घकालीन योजना",
        "कम योजना",
        "संरचना की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "दीर्घकालीन योजना",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#long-term-planning", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "आप अपने करियर के लिए एक 5 वर्षीय योजना बनाना चाहते हैं। पाठ के अनुसार, इसमें क्या शामिल होना चाहिए?",
      options: [
        "केवल दैनिक कार्य",
        "बहु-वर्षीय लक्ष्य, रणनीतिक दिशा, समय के साथ अनुकूलन के लिए विकास ढांचा, और दैनिक कार्यों और दीर्घकालीन दृष्टि के बीच संरेखण",
        "केवल लक्ष्य",
        "केवल रणनीति"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "दीर्घकालीन योजना",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#long-term-planning", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक पेशेवर दैनिक कड़ी मेहनत करता है लेकिन सार्थक दीर्घकालीन लक्ष्यों की ओर कोई प्रगति नहीं करता, जिससे निराशा होती है। पाठ के ढांचे के अनुसार, मुख्य समस्या क्या है?",
      options: [
        "पर्याप्त दैनिक काम नहीं है",
        "दीर्घकालीन योजना की कमी - बहु-वर्षीय लक्ष्य, रणनीतिक दिशा, और विकास ढांचा जो दैनिक कार्यों को दीर्घकालीन दृष्टि के साथ संरेखित करता है गायब हैं",
        "बहुत अधिक योजना",
        "दीर्घकालीन योजना अनावश्यक है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "दीर्घकालीन योजना",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#long-term-planning", "#advanced", "#critical-thinking", "#hi", "#all-languages"]
    }
  ]
};

async function seedDay19Enhanced() {
  try {
    await connectDB();
    console.log('🌱 SEEDING DAY 19 ENHANCED QUIZ QUESTIONS\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    let totalQuestions = 0;
    let totalUpdated = 0;
    let totalCreated = 0;

    for (const lang of LANGUAGES) {
      const courseId = `${COURSE_ID_BASE}_${lang}`;
      const lessonId = `${COURSE_ID_BASE}_${lang}_DAY_19`;

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
      const questions = DAY19_QUESTIONS[lang];
      
      if (!questions || questions.length === 0) {
        console.error(`   ❌ ERROR: No questions defined for ${lang}! Questions MUST be in course language.`);
        throw new Error(`Missing translations for ${lang} - Day 19 questions must be in course language, not English fallback`);
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
    console.log(`\n✅ DAY 19 ENHANCEMENT COMPLETE!\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedDay19Enhanced();
