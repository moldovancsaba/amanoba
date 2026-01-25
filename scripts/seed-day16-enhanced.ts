/**
 * Seed Day 16 Enhanced Quiz Questions
 * 
 * Purpose: Enhance Day 16 quizzes from 5 to 7 questions across all 10 languages
 * Why: Part of Quiz Quality Enhancement - Phase 1, Day 16
 * 
 * Lesson Topic: Stress Management and Fatigue (recovery, work-life balance)
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
const DAY_NUMBER = 16;
const LANGUAGES = ['HU', 'EN', 'TR', 'BG', 'PL', 'VI', 'ID', 'AR', 'PT', 'HI'];

/**
 * Day 16 Enhanced Questions - All Languages
 * Topic: Stress Management and Fatigue
 * Structure: 7 questions per language
 * Q1-Q3: Keep (Recall - foundational concepts)
 * Q4: Rewritten (Application - from definition to purpose)
 * Q5: Keep (Application - scenario-based)
 * Q6: New (Application - practical implementation)
 * Q7: New (Critical Thinking - systems integration)
 */
const DAY16_QUESTIONS: Record<string, Array<{
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: QuestionDifficulty;
  category: string;
  questionType: QuestionType;
  hashtags: string[];
}>> = {
  EN: [
    // Q1: Stress management basics (RECALL)
    {
      question: "According to the lesson, what is the key to stress management?",
      options: [
        "Recovery and boundaries",
        "More work",
        "No attention needed",
        "Never rest"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Stress Management",
      questionType: QuestionType.RECALL,
      hashtags: ["#stress-management", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q2: Work-life balance importance (RECALL)
    {
      question: "According to the lesson, why is work-life balance important?",
      options: [
        "It eliminates work",
        "It prevents burnout, maintains energy, and ensures sustainable productivity",
        "It only applies to certain jobs",
        "It requires no effort"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Stress Management",
      questionType: QuestionType.RECALL,
      hashtags: ["#stress-management", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q3: Recovery methods (RECALL)
    {
      question: "According to the lesson, what is essential for recovery from fatigue?",
      options: [
        "Working harder",
        "Rest, boundaries, and intentional recovery activities",
        "Ignoring fatigue",
        "No breaks needed"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Stress Management",
      questionType: QuestionType.RECALL,
      hashtags: ["#stress-management", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q4: Why stress management matters (APPLICATION - Rewritten)
    {
      question: "Why is stress management important according to the lesson?",
      options: [
        "It eliminates all stress",
        "It prevents burnout, maintains sustainable energy, protects health boundaries, and ensures long-term productivity",
        "It only applies to high-stress jobs",
        "It requires no planning"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Stress Management",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#stress-management", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q5: Burnout prevention scenario (APPLICATION - Keep)
    {
      question: "A person works 12-hour days consistently, feels exhausted, and productivity is declining. According to the lesson, what is likely missing?",
      options: [
        "More work hours",
        "Recovery time, work-life boundaries, and stress management practices",
        "Less sleep",
        "No breaks"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Stress Management",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#stress-management", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q6: Creating recovery plan (APPLICATION - New)
    {
      question: "You want to prevent burnout and maintain energy. According to the lesson, what should you establish?",
      options: [
        "Work more hours",
        "Regular recovery periods, clear work-life boundaries, stress management routines, and health-protective limits",
        "Only work boundaries",
        "Only recovery periods"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Stress Management",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#stress-management", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q7: Chronic stress analysis (CRITICAL THINKING - New)
    {
      question: "A professional consistently experiences fatigue, declining performance, and health issues despite working long hours. According to the lesson's framework, what is the core issue?",
      options: [
        "Not enough work",
        "Lack of stress management - missing recovery practices, work-life boundaries, and health-protective limits that prevent burnout and maintain sustainable energy",
        "Too much rest",
        "Stress management is unnecessary"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Stress Management",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#stress-management", "#advanced", "#critical-thinking", "#en", "#all-languages"]
    }
  ],
  // Hungarian (HU) - Professional translations
  HU: [
    {
      question: "A lecke szerint mi a stresszkezelés kulcsa?",
      options: [
        "Regeneráció és határok",
        "Több munka",
        "Nem kell figyelem",
        "Soha ne pihenj"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Stresszkezelés",
      questionType: QuestionType.RECALL,
      hashtags: ["#stress-management", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint miért fontos a munka-élet egyensúly?",
      options: [
        "Kiküszöböli a munkát",
        "Megelőzi a kiégést, fenntartja az energiát, és biztosítja a fenntartható termelékenységet",
        "Csak bizonyos munkákra vonatkozik",
        "Nem igényel erőfeszítést"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Stresszkezelés",
      questionType: QuestionType.RECALL,
      hashtags: ["#stress-management", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint mi elengedhetetlen a fáradtságból való regenerációhoz?",
      options: [
        "Keményebb munka",
        "Pihenés, határok és szándékos regenerációs tevékenységek",
        "A fáradtság figyelmen kívül hagyása",
        "Nincs szükség szünetekre"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Stresszkezelés",
      questionType: QuestionType.RECALL,
      hashtags: ["#stress-management", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "Miért fontos a stresszkezelés a lecke szerint?",
      options: [
        "Kiküszöböli az összes stresszt",
        "Megelőzi a kiégést, fenntartja a fenntartható energiát, védi az egészségi határokat, és biztosítja a hosszú távú termelékenységet",
        "Csak nagy stresszű munkákra vonatkozik",
        "Nem igényel tervezést"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Stresszkezelés",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#stress-management", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy személy következetesen 12 órás napokat dolgozik, kimerültnek érzi magát, és a termelékenység csökken. A lecke szerint mi hiányzik valószínűleg?",
      options: [
        "Több munkaóra",
        "Regenerációs idő, munka-élet határok és stresszkezelési gyakorlatok",
        "Kevesebb alvás",
        "Nincs szünet"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Stresszkezelés",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#stress-management", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Meg szeretnéd előzni a kiégést és fenntartani az energiát. A lecke szerint mit kellene létrehozni?",
      options: [
        "Több munkaóra",
        "Rendszeres regenerációs időszakok, világos munka-élet határok, stresszkezelési rutinok és egészségvédő korlátok",
        "Csak munkahatárok",
        "Csak regenerációs időszakok"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Stresszkezelés",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#stress-management", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy szakember következetesen fáradtságot, csökkenő teljesítményt és egészségügyi problémákat tapasztal annak ellenére, hogy hosszú órákat dolgozik. A lecke keretrendszere szerint mi a fő probléma?",
      options: [
        "Nincs elég munka",
        "Hiányzik a stresszkezelés - hiányoznak a regenerációs gyakorlatok, munka-élet határok és egészségvédő korlátok, amelyek megelőzik a kiégést és fenntartják a fenntartható energiát",
        "Túl sok pihenés",
        "A stresszkezelés felesleges"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Stresszkezelés",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#stress-management", "#advanced", "#critical-thinking", "#hu", "#all-languages"]
    }
  ],
  // Turkish (TR) - Professional translations
  TR: [
    {
      question: "Derse göre stres yönetiminin anahtarı nedir?",
      options: [
        "Kurtarma ve sınırlar",
        "Daha fazla iş",
        "Dikkat gerekmez",
        "Asla dinlenme"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Stres Yönetimi",
      questionType: QuestionType.RECALL,
      hashtags: ["#stress-management", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre iş-yaşam dengesi neden önemlidir?",
      options: [
        "İşi ortadan kaldırır",
        "Tükenmişliği önler, enerjiyi korur ve sürdürülebilir verimliliği sağlar",
        "Sadece belirli işlere uygulanır",
        "Çaba gerektirmez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Stres Yönetimi",
      questionType: QuestionType.RECALL,
      hashtags: ["#stress-management", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre yorgunluktan kurtulmak için ne gereklidir?",
      options: [
        "Daha sıkı çalışmak",
        "Dinlenme, sınırlar ve kasıtlı kurtarma aktiviteleri",
        "Yorgunluğu görmezden gelmek",
        "Mola gerekmez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Stres Yönetimi",
      questionType: QuestionType.RECALL,
      hashtags: ["#stress-management", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre stres yönetimi neden önemlidir?",
      options: [
        "Tüm stresi ortadan kaldırır",
        "Tükenmişliği önler, sürdürülebilir enerjiyi korur, sağlık sınırlarını korur ve uzun vadeli verimliliği sağlar",
        "Sadece yüksek stresli işlere uygulanır",
        "Planlama gerektirmez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Stres Yönetimi",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#stress-management", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir kişi tutarlı olarak 12 saatlik günler çalışıyor, yorgun hissediyor ve verimlilik düşüyor. Derse göre muhtemelen ne eksik?",
      options: [
        "Daha fazla çalışma saati",
        "Kurtarma zamanı, iş-yaşam sınırları ve stres yönetimi uygulamaları",
        "Daha az uyku",
        "Mola yok"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Stres Yönetimi",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#stress-management", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Tükenmişliği önlemek ve enerjiyi korumak istiyorsunuz. Derse göre ne kurmalısınız?",
      options: [
        "Daha fazla çalışma saati",
        "Düzenli kurtarma dönemleri, net iş-yaşam sınırları, stres yönetimi rutinleri ve sağlık koruyucu limitler",
        "Sadece iş sınırları",
        "Sadece kurtarma dönemleri"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Stres Yönetimi",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#stress-management", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir profesyonel, uzun saatler çalışmasına rağmen tutarlı olarak yorgunluk, düşen performans ve sağlık sorunları yaşıyor. Dersin çerçevesine göre temel sorun nedir?",
      options: [
        "Yeterli iş yok",
        "Stres yönetimi eksikliği - tükenmişliği önleyen ve sürdürülebilir enerjiyi koruyan kurtarma uygulamaları, iş-yaşam sınırları ve sağlık koruyucu limitler eksik",
        "Çok fazla dinlenme",
        "Stres yönetimi gereksiz"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Stres Yönetimi",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#stress-management", "#advanced", "#critical-thinking", "#tr", "#all-languages"]
    }
  ],
  // Bulgarian (BG) - Professional translations
  BG: [
    {
      question: "Според урока, какъв е ключът към управлението на стреса?",
      options: [
        "Възстановяване и граници",
        "Повече работа",
        "Не се нуждае от внимание",
        "Никога не почивай"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Управление на стреса",
      questionType: QuestionType.RECALL,
      hashtags: ["#stress-management", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, защо балансът работа-живот е важен?",
      options: [
        "Елиминира работата",
        "Предотвратява изгаряне, поддържа енергия и осигурява устойчива производителност",
        "Прилага се само за определени работи",
        "Не изисква усилие"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Управление на стреса",
      questionType: QuestionType.RECALL,
      hashtags: ["#stress-management", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, какво е от съществено значение за възстановяване от умора?",
      options: [
        "По-усърдна работа",
        "Почивка, граници и преднамерени възстановителни дейности",
        "Игнориране на умората",
        "Не са нужни почивки"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Управление на стреса",
      questionType: QuestionType.RECALL,
      hashtags: ["#stress-management", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Защо управлението на стреса е важно според урока?",
      options: [
        "Елиминира целия стрес",
        "Предотвратява изгаряне, поддържа устойчива енергия, защитава здравословните граници и осигурява дългосрочна производителност",
        "Прилага се само за високо стресови работи",
        "Не изисква планиране"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Управление на стреса",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#stress-management", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Човек последователно работи 12-часови дни, чувства се изтощен и производителността намалява. Според урока, какво вероятно липсва?",
      options: [
        "Повече работни часове",
        "Време за възстановяване, граници работа-живот и практики за управление на стреса",
        "По-малко сън",
        "Няма почивки"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Управление на стреса",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#stress-management", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Искате да предотвратите изгаряне и да поддържате енергия. Според урока, какво трябва да установите?",
      options: [
        "Повече работни часове",
        "Редовни периоди на възстановяване, ясни граници работа-живот, рутини за управление на стреса и здравословни защитни граници",
        "Само работни граници",
        "Само периоди на възстановяване"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Управление на стреса",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#stress-management", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Професионалист последователно изпитва умора, намаляваща производителност и здравословни проблеми въпреки дългите работни часове. Според рамката на урока, какъв е основният проблем?",
      options: [
        "Няма достатъчно работа",
        "Липса на управление на стреса - липсват практики за възстановяване, граници работа-живот и здравословни защитни граници, които предотвратяват изгаряне и поддържат устойчива енергия",
        "Твърде много почивка",
        "Управлението на стреса е ненужно"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Управление на стреса",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#stress-management", "#advanced", "#critical-thinking", "#bg", "#all-languages"]
    }
  ],
  // Polish (PL) - Professional translations
  PL: [
    {
      question: "Według lekcji, jaki jest klucz do zarządzania stresem?",
      options: [
        "Odzyskiwanie i granice",
        "Więcej pracy",
        "Nie wymaga uwagi",
        "Nigdy nie odpoczywaj"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Zarządzanie Stresem",
      questionType: QuestionType.RECALL,
      hashtags: ["#stress-management", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, dlaczego równowaga praca-życie jest ważna?",
      options: [
        "Eliminuje pracę",
        "Zapobiega wypaleniu, utrzymuje energię i zapewnia zrównoważoną produktywność",
        "Dotyczy tylko niektórych zawodów",
        "Nie wymaga wysiłku"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Zarządzanie Stresem",
      questionType: QuestionType.RECALL,
      hashtags: ["#stress-management", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, co jest niezbędne do regeneracji po zmęczeniu?",
      options: [
        "Cięższa praca",
        "Odpoczynek, granice i celowe działania regeneracyjne",
        "Ignorowanie zmęczenia",
        "Nie są potrzebne przerwy"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Zarządzanie Stresem",
      questionType: QuestionType.RECALL,
      hashtags: ["#stress-management", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Dlaczego zarządzanie stresem jest ważne według lekcji?",
      options: [
        "Eliminuje cały stres",
        "Zapobiega wypaleniu, utrzymuje zrównoważoną energię, chroni granice zdrowotne i zapewnia długoterminową produktywność",
        "Dotyczy tylko zawodów o wysokim stresie",
        "Nie wymaga planowania"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Zarządzanie Stresem",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#stress-management", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Osoba konsekwentnie pracuje 12-godzinne dni, czuje się wyczerpana i produktywność spada. Według lekcji, czego prawdopodobnie brakuje?",
      options: [
        "Więcej godzin pracy",
        "Czas regeneracji, granice praca-życie i praktyki zarządzania stresem",
        "Mniej snu",
        "Brak przerw"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Zarządzanie Stresem",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#stress-management", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Chcesz zapobiec wypaleniu i utrzymać energię. Według lekcji, co powinieneś ustanowić?",
      options: [
        "Więcej godzin pracy",
        "Regularne okresy regeneracji, jasne granice praca-życie, rutyny zarządzania stresem i granice ochrony zdrowia",
        "Tylko granice pracy",
        "Tylko okresy regeneracji"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Zarządzanie Stresem",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#stress-management", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Profesjonalista konsekwentnie doświadcza zmęczenia, spadku wydajności i problemów zdrowotnych pomimo długich godzin pracy. Według ram lekcji, jaki jest główny problem?",
      options: [
        "Niewystarczająca praca",
        "Brak zarządzania stresem - brakuje praktyk regeneracyjnych, granic praca-życie i granic ochrony zdrowia, które zapobiegają wypaleniu i utrzymują zrównoważoną energię",
        "Zbyt dużo odpoczynku",
        "Zarządzanie stresem jest niepotrzebne"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Zarządzanie Stresem",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#stress-management", "#advanced", "#critical-thinking", "#pl", "#all-languages"]
    }
  ],
  // Vietnamese (VI) - Professional translations
  VI: [
    {
      question: "Theo bài học, chìa khóa của quản lý căng thẳng là gì?",
      options: [
        "Phục hồi và ranh giới",
        "Làm việc nhiều hơn",
        "Không cần chú ý",
        "Không bao giờ nghỉ ngơi"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Quản Lý Căng Thẳng",
      questionType: QuestionType.RECALL,
      hashtags: ["#stress-management", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, tại sao cân bằng công việc-cuộc sống quan trọng?",
      options: [
        "Nó loại bỏ công việc",
        "Nó ngăn chặn kiệt sức, duy trì năng lượng và đảm bảo năng suất bền vững",
        "Nó chỉ áp dụng cho một số công việc",
        "Nó không yêu cầu nỗ lực"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Quản Lý Căng Thẳng",
      questionType: QuestionType.RECALL,
      hashtags: ["#stress-management", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, điều gì cần thiết cho phục hồi từ mệt mỏi?",
      options: [
        "Làm việc chăm chỉ hơn",
        "Nghỉ ngơi, ranh giới và các hoạt động phục hồi có chủ ý",
        "Bỏ qua mệt mỏi",
        "Không cần nghỉ giải lao"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Quản Lý Căng Thẳng",
      questionType: QuestionType.RECALL,
      hashtags: ["#stress-management", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Tại sao quản lý căng thẳng quan trọng theo bài học?",
      options: [
        "Nó loại bỏ tất cả căng thẳng",
        "Nó ngăn chặn kiệt sức, duy trì năng lượng bền vững, bảo vệ ranh giới sức khỏe và đảm bảo năng suất dài hạn",
        "Nó chỉ áp dụng cho các công việc căng thẳng cao",
        "Nó không yêu cầu lập kế hoạch"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Quản Lý Căng Thẳng",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#stress-management", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Một người liên tục làm việc 12 giờ mỗi ngày, cảm thấy kiệt sức và năng suất giảm. Theo bài học, điều gì có thể đang thiếu?",
      options: [
        "Nhiều giờ làm việc hơn",
        "Thời gian phục hồi, ranh giới công việc-cuộc sống và các thực hành quản lý căng thẳng",
        "Ít ngủ hơn",
        "Không có nghỉ giải lao"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Quản Lý Căng Thẳng",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#stress-management", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Bạn muốn ngăn chặn kiệt sức và duy trì năng lượng. Theo bài học, bạn nên thiết lập gì?",
      options: [
        "Nhiều giờ làm việc hơn",
        "Các khoảng thời gian phục hồi thường xuyên, ranh giới công việc-cuộc sống rõ ràng, thói quen quản lý căng thẳng và giới hạn bảo vệ sức khỏe",
        "Chỉ ranh giới công việc",
        "Chỉ các khoảng thời gian phục hồi"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Quản Lý Căng Thẳng",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#stress-management", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Một chuyên gia liên tục trải qua mệt mỏi, hiệu suất giảm và các vấn đề sức khỏe mặc dù làm việc nhiều giờ. Theo khung của bài học, vấn đề cốt lõi là gì?",
      options: [
        "Không đủ công việc",
        "Thiếu quản lý căng thẳng - thiếu các thực hành phục hồi, ranh giới công việc-cuộc sống và giới hạn bảo vệ sức khỏe ngăn chặn kiệt sức và duy trì năng lượng bền vững",
        "Quá nhiều nghỉ ngơi",
        "Quản lý căng thẳng là không cần thiết"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Quản Lý Căng Thẳng",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#stress-management", "#advanced", "#critical-thinking", "#vi", "#all-languages"]
    }
  ],
  // Indonesian (ID) - Professional translations
  ID: [
    {
      question: "Menurut pelajaran, apa kunci manajemen stres?",
      options: [
        "Pemulihan dan batas",
        "Lebih banyak pekerjaan",
        "Tidak perlu perhatian",
        "Jangan pernah istirahat"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Manajemen Stres",
      questionType: QuestionType.RECALL,
      hashtags: ["#stress-management", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, mengapa keseimbangan kerja-kehidupan penting?",
      options: [
        "Ini menghilangkan pekerjaan",
        "Ini mencegah kelelahan, mempertahankan energi, dan memastikan produktivitas berkelanjutan",
        "Ini hanya berlaku untuk pekerjaan tertentu",
        "Ini tidak memerlukan upaya"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Manajemen Stres",
      questionType: QuestionType.RECALL,
      hashtags: ["#stress-management", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, apa yang penting untuk pemulihan dari kelelahan?",
      options: [
        "Bekerja lebih keras",
        "Istirahat, batas, dan aktivitas pemulihan yang disengaja",
        "Mengabaikan kelelahan",
        "Tidak perlu istirahat"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Manajemen Stres",
      questionType: QuestionType.RECALL,
      hashtags: ["#stress-management", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Mengapa manajemen stres penting menurut pelajaran?",
      options: [
        "Ini menghilangkan semua stres",
        "Ini mencegah kelelahan, mempertahankan energi berkelanjutan, melindungi batas kesehatan, dan memastikan produktivitas jangka panjang",
        "Ini hanya berlaku untuk pekerjaan bertekanan tinggi",
        "Ini tidak memerlukan perencanaan"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Manajemen Stres",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#stress-management", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Seseorang secara konsisten bekerja 12 jam sehari, merasa lelah, dan produktivitas menurun. Menurut pelajaran, apa yang mungkin kurang?",
      options: [
        "Lebih banyak jam kerja",
        "Waktu pemulihan, batas kerja-kehidupan, dan praktik manajemen stres",
        "Kurang tidur",
        "Tidak ada istirahat"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Manajemen Stres",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#stress-management", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Anda ingin mencegah kelelahan dan mempertahankan energi. Menurut pelajaran, apa yang harus Anda tetapkan?",
      options: [
        "Lebih banyak jam kerja",
        "Periode pemulihan teratur, batas kerja-kehidupan yang jelas, rutinitas manajemen stres, dan batas perlindungan kesehatan",
        "Hanya batas kerja",
        "Hanya periode pemulihan"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Manajemen Stres",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#stress-management", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Seorang profesional secara konsisten mengalami kelelahan, penurunan kinerja, dan masalah kesehatan meskipun bekerja berjam-jam. Menurut kerangka pelajaran, apa masalah intinya?",
      options: [
        "Tidak cukup pekerjaan",
        "Kurangnya manajemen stres - kurang praktik pemulihan, batas kerja-kehidupan, dan batas perlindungan kesehatan yang mencegah kelelahan dan mempertahankan energi berkelanjutan",
        "Terlalu banyak istirahat",
        "Manajemen stres tidak perlu"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Manajemen Stres",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#stress-management", "#advanced", "#critical-thinking", "#id", "#all-languages"]
    }
  ],
  // Arabic (AR) - Professional translations (RTL)
  AR: [
    {
      question: "وفقًا للدرس، ما هو مفتاح إدارة الإجهاد?",
      options: [
        "الاستعادة والحدود",
        "المزيد من العمل",
        "لا حاجة للانتباه",
        "لا تسترح أبدًا"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "إدارة الإجهاد",
      questionType: QuestionType.RECALL,
      hashtags: ["#stress-management", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، لماذا توازن العمل والحياة مهم?",
      options: [
        "إنه يلغي العمل",
        "يمنع الإرهاق، يحافظ على الطاقة، ويضمن الإنتاجية المستدامة",
        "ينطبق فقط على وظائف معينة",
        "لا يتطلب جهد"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "إدارة الإجهاد",
      questionType: QuestionType.RECALL,
      hashtags: ["#stress-management", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، ما هو ضروري للاستعادة من الإرهاق?",
      options: [
        "العمل بجدية أكبر",
        "الراحة والحدود والأنشطة الاستعادة المتعمدة",
        "تجاهل الإرهاق",
        "لا حاجة للاستراحات"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "إدارة الإجهاد",
      questionType: QuestionType.RECALL,
      hashtags: ["#stress-management", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "لماذا إدارة الإجهاد مهمة وفقًا للدرس?",
      options: [
        "إنها تلغي كل الإجهاد",
        "تمنع الإرهاق، تحافظ على الطاقة المستدامة، تحمي حدود الصحة، وتضمن الإنتاجية طويلة الأجل",
        "تنطبق فقط على الوظائف عالية الإجهاد",
        "لا تتطلب تخطيطًا"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "إدارة الإجهاد",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#stress-management", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "شخص يعمل باستمرار 12 ساعة يوميًا، يشعر بالإرهاق، والإنتاجية تتراجع. وفقًا للدرس، ما الذي ربما كان مفقودًا?",
      options: [
        "المزيد من ساعات العمل",
        "وقت الاستعادة، حدود العمل-الحياة، وممارسات إدارة الإجهاد",
        "قلة النوم",
        "لا توجد استراحات"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "إدارة الإجهاد",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#stress-management", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "تريد منع الإرهاق والحفاظ على الطاقة. وفقًا للدرس، ماذا يجب أن تنشئ?",
      options: [
        "المزيد من ساعات العمل",
        "فترات الاستعادة المنتظمة، حدود العمل-الحياة الواضحة، روتينات إدارة الإجهاد، وحدود حماية الصحة",
        "فقط حدود العمل",
        "فقط فترات الاستعادة"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "إدارة الإجهاد",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#stress-management", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "محترف يعاني باستمرار من الإرهاق، انخفاض الأداء، ومشاكل صحية رغم العمل لساعات طويلة. وفقًا لإطار الدرس، ما هي المشكلة الأساسية?",
      options: [
        "لا يوجد عمل كافٍ",
        "نقص إدارة الإجهاد - ممارسات الاستعادة، حدود العمل-الحياة، وحدود حماية الصحة التي تمنع الإرهاق وتحافظ على الطاقة المستدامة مفقودة",
        "الكثير من الراحة",
        "إدارة الإجهاد غير ضرورية"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "إدارة الإجهاد",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#stress-management", "#advanced", "#critical-thinking", "#ar", "#all-languages"]
    }
  ],
  // Portuguese (PT) - Professional translations (Brazilian)
  PT: [
    {
      question: "De acordo com a lição, qual é a chave para o gerenciamento de estresse?",
      options: [
        "Recuperação e limites",
        "Mais trabalho",
        "Não precisa de atenção",
        "Nunca descanse"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Gerenciamento de Estresse",
      questionType: QuestionType.RECALL,
      hashtags: ["#stress-management", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, por que o equilíbrio trabalho-vida é importante?",
      options: [
        "Elimina o trabalho",
        "Previne esgotamento, mantém energia e garante produtividade sustentável",
        "Aplica-se apenas a certos trabalhos",
        "Não requer esforço"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Gerenciamento de Estresse",
      questionType: QuestionType.RECALL,
      hashtags: ["#stress-management", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, o que é essencial para recuperação da fadiga?",
      options: [
        "Trabalhar mais",
        "Descanso, limites e atividades de recuperação intencionais",
        "Ignorar a fadiga",
        "Não são necessárias pausas"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Gerenciamento de Estresse",
      questionType: QuestionType.RECALL,
      hashtags: ["#stress-management", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "Por que o gerenciamento de estresse é importante de acordo com a lição?",
      options: [
        "Elimina todo o estresse",
        "Previne esgotamento, mantém energia sustentável, protege limites de saúde e garante produtividade de longo prazo",
        "Aplica-se apenas a trabalhos de alto estresse",
        "Não requer planejamento"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Gerenciamento de Estresse",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#stress-management", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Uma pessoa trabalha consistentemente 12 horas por dia, sente-se exausta e a produtividade está diminuindo. De acordo com a lição, o que provavelmente está faltando?",
      options: [
        "Mais horas de trabalho",
        "Tempo de recuperação, limites trabalho-vida e práticas de gerenciamento de estresse",
        "Menos sono",
        "Sem pausas"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Gerenciamento de Estresse",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#stress-management", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Você quer prevenir esgotamento e manter energia. De acordo com a lição, o que você deve estabelecer?",
      options: [
        "Mais horas de trabalho",
        "Períodos regulares de recuperação, limites claros trabalho-vida, rotinas de gerenciamento de estresse e limites de proteção à saúde",
        "Apenas limites de trabalho",
        "Apenas períodos de recuperação"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Gerenciamento de Estresse",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#stress-management", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Um profissional consistentemente experimenta fadiga, declínio de desempenho e problemas de saúde apesar de trabalhar longas horas. De acordo com a estrutura da lição, qual é o problema central?",
      options: [
        "Não há trabalho suficiente",
        "Falta de gerenciamento de estresse - práticas de recuperação, limites trabalho-vida e limites de proteção à saúde que previnem esgotamento e mantêm energia sustentável estão faltando",
        "Muito descanso",
        "Gerenciamento de estresse é desnecessário"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Gerenciamento de Estresse",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#stress-management", "#advanced", "#critical-thinking", "#pt", "#all-languages"]
    }
  ],
  // Hindi (HI) - Professional translations
  HI: [
    {
      question: "पाठ के अनुसार, तनाव प्रबंधन की कुंजी क्या है?",
      options: [
        "पुनर्प्राप्ति और सीमाएं",
        "अधिक काम",
        "ध्यान की आवश्यकता नहीं",
        "कभी आराम न करें"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "तनाव प्रबंधन",
      questionType: QuestionType.RECALL,
      hashtags: ["#stress-management", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, कार्य-जीवन संतुलन क्यों महत्वपूर्ण है?",
      options: [
        "यह काम को समाप्त करता है",
        "यह बर्नआउट को रोकता है, ऊर्जा बनाए रखता है, और स्थायी उत्पादकता सुनिश्चित करता है",
        "यह केवल कुछ नौकरियों पर लागू होता है",
        "इसके लिए प्रयास की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "तनाव प्रबंधन",
      questionType: QuestionType.RECALL,
      hashtags: ["#stress-management", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, थकान से पुनर्प्राप्ति के लिए क्या आवश्यक है?",
      options: [
        "कठिन काम करना",
        "आराम, सीमाएं, और जानबूझकर पुनर्प्राप्ति गतिविधियां",
        "थकान को नजरअंदाज करना",
        "ब्रेक की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "तनाव प्रबंधन",
      questionType: QuestionType.RECALL,
      hashtags: ["#stress-management", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार तनाव प्रबंधन क्यों महत्वपूर्ण है?",
      options: [
        "यह सभी तनाव को समाप्त करता है",
        "यह बर्नआउट को रोकता है, स्थायी ऊर्जा बनाए रखता है, स्वास्थ्य सीमाओं की रक्षा करता है, और दीर्घकालिक उत्पादकता सुनिश्चित करता है",
        "यह केवल उच्च-तनाव वाली नौकरियों पर लागू होता है",
        "इसके लिए योजना की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "तनाव प्रबंधन",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#stress-management", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक व्यक्ति लगातार 12 घंटे प्रतिदिन काम करता है, थका हुआ महसूस करता है, और उत्पादकता घट रही है। पाठ के अनुसार, क्या संभवतः गायब है?",
      options: [
        "अधिक काम के घंटे",
        "पुनर्प्राप्ति समय, कार्य-जीवन सीमाएं, और तनाव प्रबंधन प्रथाएं",
        "कम नींद",
        "कोई ब्रेक नहीं"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "तनाव प्रबंधन",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#stress-management", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "आप बर्नआउट को रोकना और ऊर्जा बनाए रखना चाहते हैं। पाठ के अनुसार, आपको क्या स्थापित करना चाहिए?",
      options: [
        "अधिक काम के घंटे",
        "नियमित पुनर्प्राप्ति अवधि, स्पष्ट कार्य-जीवन सीमाएं, तनाव प्रबंधन दिनचर्या, और स्वास्थ्य-सुरक्षात्मक सीमाएं",
        "केवल कार्य सीमाएं",
        "केवल पुनर्प्राप्ति अवधि"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "तनाव प्रबंधन",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#stress-management", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक पेशेवर लगातार थकान, प्रदर्शन में गिरावट, और स्वास्थ्य समस्याओं का अनुभव करता है भले ही लंबे घंटे काम करता है। पाठ के ढांचे के अनुसार, मुख्य समस्या क्या है?",
      options: [
        "पर्याप्त काम नहीं है",
        "तनाव प्रबंधन की कमी - पुनर्प्राप्ति प्रथाएं, कार्य-जीवन सीमाएं, और स्वास्थ्य-सुरक्षात्मक सीमाएं जो बर्नआउट को रोकती हैं और स्थायी ऊर्जा बनाए रखती हैं गायब हैं",
        "बहुत अधिक आराम",
        "तनाव प्रबंधन अनावश्यक है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "तनाव प्रबंधन",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#stress-management", "#advanced", "#critical-thinking", "#hi", "#all-languages"]
    }
  ]
};

async function seedDay16Enhanced() {
  try {
    await connectDB();
    console.log('🌱 SEEDING DAY 16 ENHANCED QUIZ QUESTIONS\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    let totalQuestions = 0;
    let totalUpdated = 0;
    let totalCreated = 0;

    for (const lang of LANGUAGES) {
      const courseId = `${COURSE_ID_BASE}_${lang}`;
      const lessonId = `${COURSE_ID_BASE}_${lang}_DAY_16`;

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
      const questions = DAY16_QUESTIONS[lang];
      
      if (!questions || questions.length === 0) {
        console.error(`   ❌ ERROR: No questions defined for ${lang}! Questions MUST be in course language.`);
        throw new Error(`Missing translations for ${lang} - Day 16 questions must be in course language, not English fallback`);
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
    console.log(`\n✅ DAY 16 ENHANCEMENT COMPLETE!\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedDay16Enhanced();
