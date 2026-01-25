/**
 * Seed Day 27 Enhanced Quiz Questions
 * 
 * Purpose: Enhance Day 27 quizzes from 5 to 7 questions across all 10 languages
 * Why: Part of Quiz Quality Enhancement - Phase 1, Day 27
 * 
 * Lesson Topic: Habits and Rituals (daily routines, long-term action)
 * 
 * Structure:
 * - 7 questions per language
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
const DAY_NUMBER = 27;
const LANGUAGES = ['HU', 'EN', 'TR', 'BG', 'PL', 'VI', 'ID', 'AR', 'PT', 'HI'];

/**
 * Day 27 Enhanced Questions - All Languages
 * Topic: Habits and Rituals
 * Structure: 7 questions per language
 * Q1-Q3: Recall (foundational concepts)
 * Q4: Application (why habits matter)
 * Q5: Application (scenario-based)
 * Q6: Application (practical implementation)
 * Q7: Critical Thinking (systems integration)
 */
const DAY27_QUESTIONS: Record<string, Array<{
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: QuestionDifficulty;
  category: string;
  questionType: QuestionType;
  hashtags: string[];
}>> = {
  EN: [
    // Q1: Habit definition (RECALL)
    {
      question: "According to the lesson, what are productive habits?",
      options: [
        "Only daily routines",
        "Repeated behaviors that compound over time, creating automatic actions that support productivity goals",
        "Only morning routines",
        "No structure needed"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Habits vs Systems",
      questionType: QuestionType.RECALL,
      hashtags: ["#habits", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q2: Ritual benefit (RECALL)
    {
      question: "According to the lesson, why are rituals important?",
      options: [
        "They're not important",
        "They create structure, reduce decision fatigue, and establish consistent patterns that support productivity",
        "They only apply to certain people",
        "It requires no effort"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Rituals",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q3: Habit formation (RECALL)
    {
      question: "According to the lesson, how do habits compound over time?",
      options: [
        "They don't compound",
        "Small daily actions accumulate, creating significant long-term results through consistent repetition",
        "Only through large actions",
        "No structure needed"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Habits vs Systems",
      questionType: QuestionType.RECALL,
      hashtags: ["#habits", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q4: Why habits matter (APPLICATION)
    {
      question: "Why are habits and rituals important for productivity according to the lesson?",
      options: [
        "They eliminate all decisions",
        "They create automatic productive behaviors, reduce decision fatigue, establish consistent patterns, and compound results over time",
        "They only apply to certain jobs",
        "They require no investment"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Habits vs Systems",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#habits", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q5: Building habits scenario (APPLICATION)
    {
      question: "You want to build a productive habit. According to the lesson, what should you do?",
      options: [
        "Only plan it once",
        "Start small, create a trigger, practice consistently, track progress, and reinforce the behavior until it becomes automatic",
        "Only do it when motivated",
        "Only practice occasionally"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Habits vs Systems",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#habits", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q6: Building habit system (APPLICATION)
    {
      question: "You want to establish productive habits and rituals. According to the lesson, what should you create?",
      options: [
        "Just random routines",
        "Daily rituals with clear triggers, small consistent actions, tracking systems, and reinforcement mechanisms that build automatic productive behaviors",
        "Only morning routines",
        "Only evening routines"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Habits vs Systems",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#habits", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q7: Habit inconsistency analysis (CRITICAL THINKING)
    {
      question: "A person tries to build habits but gives up quickly, productivity remains inconsistent, and no long-term patterns form. According to the lesson's framework, what is the core issue?",
      options: [
        "Not enough motivation",
        "Lack of habit systems - missing small consistent actions, clear triggers, tracking, and reinforcement that create automatic behaviors that compound over time",
        "Too many habits",
        "Habits are unnecessary"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Habits vs Systems",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#habits", "#advanced", "#critical-thinking", "#en", "#all-languages"]
    }
  ],
  // Hungarian (HU) - Professional translations
  HU: [
    {
      question: "A lecke szerint mik a produktív szokások?",
      options: [
        "Csak napi rutinok",
        "Ismétlődő viselkedések, amelyek idővel kumulálódnak, automatikus cselekedeteket hoznak létre, amelyek támogatják a termelékenységi célokat",
        "Csak reggeli rutinok",
        "Nincs szükség struktúrára"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Szokások",
      questionType: QuestionType.RECALL,
      hashtags: ["#habits", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint miért fontosak a rituálék?",
      options: [
        "Nem fontosak",
        "Struktúrát hoznak létre, csökkentik a döntési fáradtságot, és konzisztens mintákat hoznak létre, amelyek támogatják a termelékenységet",
        "Csak bizonyos emberekre vonatkoznak",
        "Nem igényelnek erőfeszítést"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Rituálék",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint hogyan kumulálódnak a szokások idővel?",
      options: [
        "Nem kumulálódnak",
        "Kis napi cselekedetek felhalmozódnak, jelentős hosszú távú eredményeket hoznak létre konzisztens ismétlésen keresztül",
        "Csak nagy cselekedeteken keresztül",
        "Nincs szükség struktúrára"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Szokások",
      questionType: QuestionType.RECALL,
      hashtags: ["#habits", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "Miért fontosak a szokások és a rituálék a termelékenységhez a lecke szerint?",
      options: [
        "Kiküszöbölik az összes döntést",
        "Automatikus produktív viselkedéseket hoznak létre, csökkentik a döntési fáradtságot, konzisztens mintákat hoznak létre, és idővel kumulálódnak az eredmények",
        "Csak bizonyos munkákra vonatkoznak",
        "Nem igényelnek befektetést"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Szokások",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#habits", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Létre szeretnél hozni egy produktív szokást. A lecke szerint mit kellene tenned?",
      options: [
        "Csak tervezd meg egyszer",
        "Kezdj kicsiben, hozz létre egy triggert, gyakorolj konzisztensen, kövesd nyomon a haladást, és erősítsd a viselkedést, amíg automatikussá nem válik",
        "Csak akkor csináld, amikor motivált vagy",
        "Csak gyakorolj alkalmanként"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Szokások",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#habits", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Létre szeretnél hozni produktív szokásokat és rituálékat. A lecke szerint mit kellene létrehozni?",
      options: [
        "Csak véletlenszerű rutinok",
        "Napi rituálék világos triggerekkel, kis konzisztens cselekedetekkel, követési rendszerekkel, és megerősítési mechanizmusokkal, amelyek automatikus produktív viselkedéseket építenek",
        "Csak reggeli rutinok",
        "Csak esti rutinok"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Szokások",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#habits", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy személy próbál szokásokat építeni, de gyorsan feladja, a termelékenység inkonzisztens marad, és nem alakulnak ki hosszú távú minták. A lecke keretrendszere szerint mi a fő probléma?",
      options: [
        "Nincs elég motiváció",
        "Hiányzik a szokásrendszer - hiányoznak a kis konzisztens cselekedetek, világos triggerek, követés, és megerősítés, amelyek automatikus viselkedéseket hoznak létre, amelyek idővel kumulálódnak",
        "Túl sok szokás",
        "A szokások feleslegesek"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Szokások",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#habits", "#advanced", "#critical-thinking", "#hu", "#all-languages"]
    }
  ],
  // Turkish (TR) - Professional translations
  TR: [
    {
      question: "Derse göre üretken alışkanlıklar nelerdir?",
      options: [
        "Sadece günlük rutinler",
        "Zamanla biriken, üretkenlik hedeflerini destekleyen otomatik eylemler yaratan tekrarlanan davranışlar",
        "Sadece sabah rutinleri",
        "Yapı gerekmez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Alışkanlıklar",
      questionType: QuestionType.RECALL,
      hashtags: ["#habits", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre ritüeller neden önemlidir?",
      options: [
        "Önemli değiller",
        "Yapı oluşturur, karar yorgunluğunu azaltır ve verimliliği destekleyen tutarlı kalıplar oluşturur",
        "Sadece belirli insanlara uygulanır",
        "Çaba gerektirmez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Ritüeller",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre alışkanlıklar zamanla nasıl birikir?",
      options: [
        "Birikmezler",
        "Küçük günlük eylemler birikir, tutarlı tekrarlama yoluyla önemli uzun vadeli sonuçlar yaratır",
        "Sadece büyük eylemlerle",
        "Yapı gerekmez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Alışkanlıklar",
      questionType: QuestionType.RECALL,
      hashtags: ["#habits", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre alışkanlıklar ve ritüeller verimlilik için neden önemlidir?",
      options: [
        "Tüm kararları ortadan kaldırırlar",
        "Otomatik üretken davranışlar yaratırlar, karar yorgunluğunu azaltırlar, tutarlı kalıplar oluştururlar ve zamanla sonuçları biriktirirler",
        "Sadece belirli işlere uygulanırlar",
        "Yatırım gerektirmezler"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Alışkanlıklar",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#habits", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Üretken bir alışkanlık oluşturmak istiyorsun. Derse göre ne yapmalısın?",
      options: [
        "Sadece bir kez planla",
        "Küçük başla, bir tetikleyici oluştur, tutarlı pratik yap, ilerlemeyi takip et ve davranışı otomatik hale gelene kadar pekiştir",
        "Sadece motive olduğunda yap",
        "Sadece ara sıra pratik yap"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Alışkanlıklar",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#habits", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Üretken alışkanlıklar ve ritüeller oluşturmak istiyorsun. Derse göre ne kurmalısın?",
      options: [
        "Sadece rastgele rutinler",
        "Net tetikleyicilerle günlük ritüeller, küçük tutarlı eylemler, takip sistemleri ve otomatik üretken davranışlar oluşturan pekiştirme mekanizmaları",
        "Sadece sabah rutinleri",
        "Sadece akşam rutinleri"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Alışkanlıklar",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#habits", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir kişi alışkanlık oluşturmaya çalışıyor ama hızla vazgeçiyor, verimlilik tutarsız kalıyor ve uzun vadeli kalıplar oluşmuyor. Derse göre temel sorun nedir?",
      options: [
        "Yeterli motivasyon yok",
        "Alışkanlık sistemleri eksikliği - zamanla biriken otomatik davranışlar yaratan küçük tutarlı eylemler, net tetikleyiciler, takip ve pekiştirme eksik",
        "Çok fazla alışkanlık",
        "Alışkanlıklar gereksiz"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Alışkanlıklar",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#habits", "#advanced", "#critical-thinking", "#tr", "#all-languages"]
    }
  ],
  // Bulgarian (BG) - Professional translations
  BG: [
    {
      question: "Според урока, какво са продуктивните навици?",
      options: [
        "Само дневни рутини",
        "Повтарящи се поведения, които се натрупват с течение на времето, създавайки автоматични действия, които подкрепят целите за производителност",
        "Само сутрешни рутини",
        "Няма нужда от структура"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Навици",
      questionType: QuestionType.RECALL,
      hashtags: ["#habits", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, защо ритуалите са важни?",
      options: [
        "Не са важни",
        "Създават структура, намаляват умората от решения и установяват последователни модели, които подкрепят производителността",
        "Прилагат се само за определени хора",
        "Не изискват усилие"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Ритуали",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, как навиците се натрупват с течение на времето?",
      options: [
        "Не се натрупват",
        "Малки дневни действия се натрупват, създавайки значителни дългосрочни резултати чрез последователно повторение",
        "Само чрез големи действия",
        "Няма нужда от структура"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Навици",
      questionType: QuestionType.RECALL,
      hashtags: ["#habits", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Защо навиците и ритуалите са важни за производителността според урока?",
      options: [
        "Премахват всички решения",
        "Създават автоматични продуктивни поведения, намаляват умората от решения, установяват последователни модели и натрупват резултати с течение на времето",
        "Прилагат се само за определени работи",
        "Не изискват инвестиция"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Навици",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#habits", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Искаш да изградиш продуктивна навика. Според урока, какво трябва да направиш?",
      options: [
        "Само планирай веднъж",
        "Започни малко, създай тригер, практикувай последователно, следвай напредъка и укрепвай поведението, докато стане автоматично",
        "Само го прави, когато си мотивиран",
        "Само практикувай от време на време"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Навици",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#habits", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Искаш да установиш продуктивни навици и ритуали. Според урока, какво трябва да създадеш?",
      options: [
        "Просто случайни рутини",
        "Дневни ритуали с ясни тригери, малки последователни действия, системи за проследяване и механизми за укрепване, които изграждат автоматични продуктивни поведения",
        "Само сутрешни рутини",
        "Само вечерни рутини"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Навици",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#habits", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Човек се опитва да изгради навици, но се отказва бързо, производителността остава непоследователна и не се формират дългосрочни модели. Според рамката на урока, какъв е основният проблем?",
      options: [
        "Няма достатъчна мотивация",
        "Липса на системи за навици - липсват малки последователни действия, ясни тригери, проследяване и укрепване, които създават автоматични поведения, които се натрупват с течение на времето",
        "Твърде много навици",
        "Навиците са ненужни"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Навици",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#habits", "#advanced", "#critical-thinking", "#bg", "#all-languages"]
    }
  ],
  // Polish (PL) - Professional translations
  PL: [
    {
      question: "Według lekcji, czym są produktywne nawyki?",
      options: [
        "Tylko codzienne rutyny",
        "Powtarzające się zachowania, które narastają z czasem, tworząc automatyczne działania wspierające cele produktywności",
        "Tylko poranne rutyny",
        "Struktura nie jest potrzebna"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Nawyki",
      questionType: QuestionType.RECALL,
      hashtags: ["#habits", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, dlaczego rytuały są ważne?",
      options: [
        "Nie są ważne",
        "Tworzą strukturę, zmniejszają zmęczenie decyzyjne i ustanawiają spójne wzorce wspierające produktywność",
        "Stosują się tylko do określonych ludzi",
        "Nie wymagają wysiłku"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Rytuały",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, jak nawyki narastają z czasem?",
      options: [
        "Nie narastają",
        "Małe codzienne działania się kumulują, tworząc znaczące długoterminowe rezultaty poprzez konsekwentne powtarzanie",
        "Tylko przez duże działania",
        "Struktura nie jest potrzebna"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Nawyki",
      questionType: QuestionType.RECALL,
      hashtags: ["#habits", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Dlaczego nawyki i rytuały są ważne dla produktywności według lekcji?",
      options: [
        "Eliminują wszystkie decyzje",
        "Tworzą automatyczne produktywne zachowania, zmniejszają zmęczenie decyzyjne, ustanawiają spójne wzorce i kumulują rezultaty z czasem",
        "Stosują się tylko do określonych prac",
        "Nie wymagają inwestycji"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Nawyki",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#habits", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Chcesz zbudować produktywny nawyk. Według lekcji, co powinieneś zrobić?",
      options: [
        "Tylko zaplanuj raz",
        "Zacznij mało, stwórz wyzwalacz, ćwicz konsekwentnie, śledź postęp i wzmacniaj zachowanie, aż stanie się automatyczne",
        "Tylko rób to, gdy jesteś zmotywowany",
        "Tylko ćwicz okazjonalnie"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Nawyki",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#habits", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Chcesz ustanowić produktywne nawyki i rytuały. Według lekcji, co powinieneś stworzyć?",
      options: [
        "Po prostu losowe rutyny",
        "Codzienne rytuały z jasnymi wyzwalaczami, małymi konsekwentnymi działaniami, systemami śledzenia i mechanizmami wzmacniania, które budują automatyczne produktywne zachowania",
        "Tylko poranne rutyny",
        "Tylko wieczorne rutyny"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Nawyki",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#habits", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Osoba próbuje budować nawyki, ale szybko się poddaje, produktywność pozostaje niespójna i nie formują się długoterminowe wzorce. Według ram lekcji, jaki jest główny problem?",
      options: [
        "Nie ma wystarczającej motywacji",
        "Brak systemów nawyków - brakuje małych konsekwentnych działań, jasnych wyzwalaczy, śledzenia i wzmacniania, które tworzą automatyczne zachowania narastające z czasem",
        "Zbyt dużo nawyków",
        "Nawyki są niepotrzebne"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Nawyki",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#habits", "#advanced", "#critical-thinking", "#pl", "#all-languages"]
    }
  ],
  // Vietnamese (VI) - Professional translations
  VI: [
    {
      question: "Theo bài học, thói quen năng suất là gì?",
      options: [
        "Chỉ thói quen hàng ngày",
        "Hành vi lặp lại tích lũy theo thời gian, tạo ra các hành động tự động hỗ trợ mục tiêu năng suất",
        "Chỉ thói quen buổi sáng",
        "Không cần cấu trúc"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Thói Quen",
      questionType: QuestionType.RECALL,
      hashtags: ["#habits", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, tại sao nghi thức quan trọng?",
      options: [
        "Chúng không quan trọng",
        "Chúng tạo cấu trúc, giảm mệt mỏi quyết định, và thiết lập các mẫu nhất quán hỗ trợ năng suất",
        "Chúng chỉ áp dụng cho một số người",
        "Chúng không yêu cầu nỗ lực"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Nghi Thức",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, thói quen tích lũy theo thời gian như thế nào?",
      options: [
        "Chúng không tích lũy",
        "Các hành động nhỏ hàng ngày tích lũy, tạo ra kết quả dài hạn đáng kể thông qua lặp lại nhất quán",
        "Chỉ thông qua các hành động lớn",
        "Không cần cấu trúc"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Thói Quen",
      questionType: QuestionType.RECALL,
      hashtags: ["#habits", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Tại sao thói quen và nghi thức quan trọng cho năng suất theo bài học?",
      options: [
        "Chúng loại bỏ tất cả quyết định",
        "Chúng tạo ra hành vi năng suất tự động, giảm mệt mỏi quyết định, thiết lập các mẫu nhất quán, và tích lũy kết quả theo thời gian",
        "Chúng chỉ áp dụng cho một số công việc",
        "Chúng không yêu cầu đầu tư"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Thói Quen",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#habits", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Bạn muốn xây dựng một thói quen năng suất. Theo bài học, bạn nên làm gì?",
      options: [
        "Chỉ lập kế hoạch một lần",
        "Bắt đầu nhỏ, tạo trigger, thực hành nhất quán, theo dõi tiến độ, và củng cố hành vi cho đến khi nó trở thành tự động",
        "Chỉ làm khi có động lực",
        "Chỉ thực hành thỉnh thoảng"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Thói Quen",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#habits", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Bạn muốn thiết lập thói quen và nghi thức năng suất. Theo bài học, bạn nên tạo gì?",
      options: [
        "Chỉ các thói quen ngẫu nhiên",
        "Nghi thức hàng ngày với trigger rõ ràng, hành động nhỏ nhất quán, hệ thống theo dõi, và cơ chế củng cố xây dựng hành vi năng suất tự động",
        "Chỉ thói quen buổi sáng",
        "Chỉ thói quen buổi tối"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Thói Quen",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#habits", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Một người cố gắng xây dựng thói quen nhưng nhanh chóng từ bỏ, năng suất vẫn không nhất quán, và không có mẫu dài hạn hình thành. Theo khung của bài học, vấn đề cốt lõi là gì?",
      options: [
        "Không đủ động lực",
        "Thiếu hệ thống thói quen - thiếu hành động nhỏ nhất quán, trigger rõ ràng, theo dõi, và củng cố tạo ra hành vi tự động tích lũy theo thời gian",
        "Quá nhiều thói quen",
        "Thói quen là không cần thiết"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Thói Quen",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#habits", "#advanced", "#critical-thinking", "#vi", "#all-languages"]
    }
  ],
  // Indonesian (ID) - Professional translations
  ID: [
    {
      question: "Menurut pelajaran, apa itu kebiasaan produktif?",
      options: [
        "Hanya rutinitas harian",
        "Perilaku berulang yang berkembang seiring waktu, menciptakan tindakan otomatis yang mendukung tujuan produktivitas",
        "Hanya rutinitas pagi",
        "Tidak perlu struktur"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Kebiasaan",
      questionType: QuestionType.RECALL,
      hashtags: ["#habits", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, mengapa ritual penting?",
      options: [
        "Tidak penting",
        "Menciptakan struktur, mengurangi kelelahan keputusan, dan menetapkan pola konsisten yang mendukung produktivitas",
        "Hanya berlaku untuk orang tertentu",
        "Tidak memerlukan upaya"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Ritual",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, bagaimana kebiasaan berkembang seiring waktu?",
      options: [
        "Tidak berkembang",
        "Tindakan harian kecil menumpuk, menciptakan hasil jangka panjang yang signifikan melalui pengulangan konsisten",
        "Hanya melalui tindakan besar",
        "Tidak perlu struktur"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Kebiasaan",
      questionType: QuestionType.RECALL,
      hashtags: ["#habits", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Mengapa kebiasaan dan ritual penting untuk produktivitas menurut pelajaran?",
      options: [
        "Mereka menghilangkan semua keputusan",
        "Mereka menciptakan perilaku produktif otomatis, mengurangi kelelahan keputusan, menetapkan pola konsisten, dan mengumpulkan hasil seiring waktu",
        "Mereka hanya berlaku untuk pekerjaan tertentu",
        "Mereka tidak memerlukan investasi"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Kebiasaan",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#habits", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Anda ingin membangun kebiasaan produktif. Menurut pelajaran, apa yang harus Anda lakukan?",
      options: [
        "Hanya rencanakan sekali",
        "Mulai kecil, buat pemicu, praktikkan secara konsisten, lacak kemajuan, dan perkuat perilaku sampai menjadi otomatis",
        "Hanya lakukan saat termotivasi",
        "Hanya praktik sesekali"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Kebiasaan",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#habits", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Anda ingin menetapkan kebiasaan dan ritual produktif. Menurut pelajaran, apa yang harus Anda buat?",
      options: [
        "Hanya rutinitas acak",
        "Ritual harian dengan pemicu jelas, tindakan kecil konsisten, sistem pelacakan, dan mekanisme penguatan yang membangun perilaku produktif otomatis",
        "Hanya rutinitas pagi",
        "Hanya rutinitas malam"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Kebiasaan",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#habits", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Seseorang mencoba membangun kebiasaan tetapi cepat menyerah, produktivitas tetap tidak konsisten, dan tidak ada pola jangka panjang yang terbentuk. Menurut kerangka pelajaran, apa masalah intinya?",
      options: [
        "Tidak ada motivasi yang cukup",
        "Kurangnya sistem kebiasaan - kurang tindakan kecil konsisten, pemicu jelas, pelacakan, dan penguatan yang menciptakan perilaku otomatis yang berkembang seiring waktu",
        "Terlalu banyak kebiasaan",
        "Kebiasaan tidak perlu"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Kebiasaan",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#habits", "#advanced", "#critical-thinking", "#id", "#all-languages"]
    }
  ],
  // Arabic (AR) - Professional translations (RTL)
  AR: [
    {
      question: "وفقًا للدرس، ما هي العادات المنتجة?",
      options: [
        "فقط الروتين اليومي",
        "سلوكيات متكررة تتراكم بمرور الوقت، مما يخلق إجراءات تلقائية تدعم أهداف الإنتاجية",
        "فقط روتين الصباح",
        "لا حاجة للهيكل"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "العادات",
      questionType: QuestionType.RECALL,
      hashtags: ["#habits", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، لماذا الطقوس مهمة?",
      options: [
        "ليست مهمة",
        "إنها تخلق الهيكل، وتقلل من إجهاد القرار، وتؤسس أنماطًا متسقة تدعم الإنتاجية",
        "تنطبق فقط على أشخاص معينين",
        "لا تتطلب جهدًا"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "الطقوس",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، كيف تتراكم العادات بمرور الوقت?",
      options: [
        "لا تتراكم",
        "الإجراءات اليومية الصغيرة تتراكم، مما يخلق نتائج طويلة الأجل كبيرة من خلال التكرار المتسق",
        "فقط من خلال الإجراءات الكبيرة",
        "لا حاجة للهيكل"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "العادات",
      questionType: QuestionType.RECALL,
      hashtags: ["#habits", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "لماذا العادات والطقوس مهمة للإنتاجية وفقًا للدرس?",
      options: [
        "إنها تلغي جميع القرارات",
        "إنها تخلق سلوكيات منتجة تلقائية، تقلل من إجهاد القرار، تؤسس أنماطًا متسقة، وتتراكم النتائج بمرور الوقت",
        "تنطبق فقط على وظائف معينة",
        "لا تتطلب استثمارًا"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "العادات",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#habits", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "تريد بناء عادة منتجة. وفقًا للدرس، ماذا يجب أن تفعل?",
      options: [
        "فقط خطط مرة واحدة",
        "ابدأ صغيرًا، أنشئ محفزًا، مارس باستمرار، تتبع التقدم، وعزز السلوك حتى يصبح تلقائيًا",
        "فقط افعل ذلك عندما تكون متحمسًا",
        "فقط مارس من حين لآخر"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "العادات",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#habits", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "تريد إنشاء عادات وطقوس منتجة. وفقًا للدرس، ماذا يجب أن تنشئ?",
      options: [
        "فقط روتين عشوائي",
        "طقوس يومية مع محفزات واضحة، إجراءات صغيرة متسقة، أنظمة تتبع، وآليات تعزيز تبني سلوكيات منتجة تلقائية",
        "فقط روتين الصباح",
        "فقط روتين المساء"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "العادات",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#habits", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "شخص يحاول بناء عادات لكنه يستسلم بسرعة، والإنتاجية تبقى غير متسقة، ولا تتشكل أنماط طويلة الأجل. وفقًا لإطار الدرس، ما هي المشكلة الأساسية?",
      options: [
        "لا يوجد دافع كافٍ",
        "نقص أنظمة العادات - نقص الإجراءات الصغيرة المتسقة، والمحفزات الواضحة، والتتبع، والتعزيز التي تخلق سلوكيات تلقائية تتراكم بمرور الوقت",
        "الكثير من العادات",
        "العادات غير ضرورية"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "العادات",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#habits", "#advanced", "#critical-thinking", "#ar", "#all-languages"]
    }
  ],
  // Portuguese (PT) - Professional translations (Brazilian)
  PT: [
    {
      question: "De acordo com a lição, o que são hábitos produtivos?",
      options: [
        "Apenas rotinas diárias",
        "Comportamentos repetidos que se compõem ao longo do tempo, criando ações automáticas que apoiam objetivos de produtividade",
        "Apenas rotinas matinais",
        "Estrutura não é necessária"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Hábitos",
      questionType: QuestionType.RECALL,
      hashtags: ["#habits", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, por que rituais são importantes?",
      options: [
        "Não são importantes",
        "Criam estrutura, reduzem fadiga de decisão e estabelecem padrões consistentes que apoiam produtividade",
        "Aplicam-se apenas a certas pessoas",
        "Não requerem esforço"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Rituais",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, como os hábitos se compõem ao longo do tempo?",
      options: [
        "Não se compõem",
        "Pequenas ações diárias se acumulam, criando resultados significativos de longo prazo através de repetição consistente",
        "Apenas através de grandes ações",
        "Estrutura não é necessária"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Hábitos",
      questionType: QuestionType.RECALL,
      hashtags: ["#habits", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "Por que hábitos e rituais são importantes para produtividade de acordo com a lição?",
      options: [
        "Eliminam todas as decisões",
        "Criam comportamentos produtivos automáticos, reduzem fadiga de decisão, estabelecem padrões consistentes e compõem resultados ao longo do tempo",
        "Aplicam-se apenas a certos trabalhos",
        "Não requerem investimento"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Hábitos",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#habits", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Você quer construir um hábito produtivo. De acordo com a lição, o que você deve fazer?",
      options: [
        "Apenas planeje uma vez",
        "Comece pequeno, crie um gatilho, pratique consistentemente, acompanhe o progresso e reforce o comportamento até se tornar automático",
        "Apenas faça quando motivado",
        "Apenas pratique ocasionalmente"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Hábitos",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#habits", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Você quer estabelecer hábitos e rituais produtivos. De acordo com a lição, o que você deve criar?",
      options: [
        "Apenas rotinas aleatórias",
        "Rituais diários com gatilhos claros, pequenas ações consistentes, sistemas de acompanhamento e mecanismos de reforço que constroem comportamentos produtivos automáticos",
        "Apenas rotinas matinais",
        "Apenas rotinas noturnas"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Hábitos",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#habits", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Uma pessoa tenta construir hábitos mas desiste rapidamente, a produtividade permanece inconsistente e nenhum padrão de longo prazo se forma. De acordo com a estrutura da lição, qual é o problema central?",
      options: [
        "Não há motivação suficiente",
        "Falta de sistemas de hábitos - falta ações pequenas consistentes, gatilhos claros, acompanhamento e reforço que criam comportamentos automáticos que se compõem ao longo do tempo",
        "Muitos hábitos",
        "Hábitos são desnecessários"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Hábitos",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#habits", "#advanced", "#critical-thinking", "#pt", "#all-languages"]
    }
  ],
  // Hindi (HI) - Professional translations
  HI: [
    {
      question: "पाठ के अनुसार, उत्पादक आदतें क्या हैं?",
      options: [
        "केवल दैनिक दिनचर्या",
        "दोहराए जाने वाले व्यवहार जो समय के साथ जमा होते हैं, स्वचालित कार्य बनाते हैं जो उत्पादकता लक्ष्यों का समर्थन करते हैं",
        "केवल सुबह की दिनचर्या",
        "संरचना की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "आदतें",
      questionType: QuestionType.RECALL,
      hashtags: ["#habits", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, अनुष्ठान क्यों महत्वपूर्ण हैं?",
      options: [
        "वे महत्वपूर्ण नहीं हैं",
        "वे संरचना बनाते हैं, निर्णय थकान को कम करते हैं, और सुसंगत पैटर्न स्थापित करते हैं जो उत्पादकता का समर्थन करते हैं",
        "वे केवल कुछ लोगों पर लागू होते हैं",
        "उन्हें प्रयास की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "अनुष्ठान",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, आदतें समय के साथ कैसे जमा होती हैं?",
      options: [
        "वे जमा नहीं होतीं",
        "छोटे दैनिक कार्य जमा होते हैं, निरंतर पुनरावृत्ति के माध्यम से महत्वपूर्ण दीर्घकालिक परिणाम बनाते हैं",
        "केवल बड़े कार्यों के माध्यम से",
        "संरचना की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "आदतें",
      questionType: QuestionType.RECALL,
      hashtags: ["#habits", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार उत्पादकता के लिए आदतें और अनुष्ठान क्यों महत्वपूर्ण हैं?",
      options: [
        "वे सभी निर्णयों को समाप्त करते हैं",
        "वे स्वचालित उत्पादक व्यवहार बनाते हैं, निर्णय थकान को कम करते हैं, सुसंगत पैटर्न स्थापित करते हैं, और समय के साथ परिणाम जमा करते हैं",
        "वे केवल कुछ नौकरियों पर लागू होते हैं",
        "उन्हें निवेश की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "आदतें",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#habits", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "आप एक उत्पादक आदत बनाना चाहते हैं। पाठ के अनुसार, आपको क्या करना चाहिए?",
      options: [
        "बस एक बार योजना बनाएं",
        "छोटी शुरुआत करें, एक ट्रिगर बनाएं, निरंतर अभ्यास करें, प्रगति को ट्रैक करें, और व्यवहार को तब तक मजबूत करें जब तक यह स्वचालित न हो जाए",
        "बस इसे तब करें जब प्रेरित हों",
        "बस कभी-कभी अभ्यास करें"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "आदतें",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#habits", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "आप उत्पादक आदतें और अनुष्ठान स्थापित करना चाहते हैं। पाठ के अनुसार, आपको क्या बनाना चाहिए?",
      options: [
        "बस यादृच्छिक दिनचर्या",
        "स्पष्ट ट्रिगर के साथ दैनिक अनुष्ठान, छोटे सुसंगत कार्य, ट्रैकिंग प्रणाली, और मजबूती तंत्र जो स्वचालित उत्पादक व्यवहार बनाते हैं",
        "केवल सुबह की दिनचर्या",
        "केवल शाम की दिनचर्या"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "आदतें",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#habits", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक व्यक्ति आदतें बनाने की कोशिश करता है लेकिन जल्दी हार मान लेता है, उत्पादकता असंगत रहती है, और कोई दीर्घकालिक पैटर्न नहीं बनता है। पाठ के ढांचे के अनुसार, मुख्य समस्या क्या है?",
      options: [
        "पर्याप्त प्रेरणा नहीं है",
        "आदत प्रणालियों की कमी - छोटे सुसंगत कार्य, स्पष्ट ट्रिगर, ट्रैकिंग, और मजबूती गायब हैं जो स्वचालित व्यवहार बनाते हैं जो समय के साथ जमा होते हैं",
        "बहुत अधिक आदतें",
        "आदतें अनावश्यक हैं"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "आदतें",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#habits", "#advanced", "#critical-thinking", "#hi", "#all-languages"]
    }
  ]
};

async function seedDay27Enhanced() {
  try {
    await connectDB();
    console.log('🌱 SEEDING DAY 27 ENHANCED QUIZ QUESTIONS\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    let totalQuestions = 0;
    let totalUpdated = 0;
    let totalCreated = 0;

    for (const lang of LANGUAGES) {
      const courseId = `${COURSE_ID_BASE}_${lang}`;
      const lessonId = `${COURSE_ID_BASE}_${lang}_DAY_27`;

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

      // Get questions for this language - MUST be in course language, NO fallback
      const questions = DAY27_QUESTIONS[lang];
      
      if (!questions || questions.length === 0) {
        console.error(`   ❌ ERROR: No questions defined for ${lang}! Questions MUST be in course language.`);
        throw new Error(`Missing translations for ${lang} - Day 27 questions must be in course language, not English fallback`);
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
    console.log(`\n✅ DAY 27 ENHANCEMENT COMPLETE!\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedDay27Enhanced();
