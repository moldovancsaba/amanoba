/**
 * Seed Day 17 Enhanced Quiz Questions
 * 
 * Purpose: Enhance Day 17 quizzes from 5 to 7 questions across all 10 languages
 * Why: Part of Quiz Quality Enhancement - Phase 1, Day 17
 * 
 * Lesson Topic: Sustaining Motivation (tracking progress, celebrating wins)
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
const DAY_NUMBER = 17;
const LANGUAGES = ['HU', 'EN', 'TR', 'BG', 'PL', 'VI', 'ID', 'AR', 'PT', 'HI'];

/**
 * Day 17 Enhanced Questions - All Languages
 * Topic: Sustaining Motivation
 * Structure: 7 questions per language
 * Q1-Q3: Keep (Recall - foundational concepts)
 * Q4: Rewritten (Application - from definition to purpose)
 * Q5: Keep (Application - scenario-based)
 * Q6: New (Application - practical implementation)
 * Q7: New (Critical Thinking - systems integration)
 */
const DAY17_QUESTIONS: Record<string, Array<{
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: QuestionDifficulty;
  category: string;
  questionType: QuestionType;
  hashtags: string[];
}>> = {
  EN: [
    // Q1: Progress tracking importance (RECALL)
    {
      question: "According to the lesson, why is tracking progress important for motivation?",
      options: [
        "It eliminates the need for goals",
        "It provides visible evidence of advancement, reinforces commitment, and maintains momentum",
        "It only applies to short-term goals",
        "It requires no effort"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#motivation", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q2: Celebrating wins benefit (RECALL)
    {
      question: "According to the lesson, what is the benefit of celebrating wins?",
      options: [
        "It wastes time",
        "It reinforces positive behavior, maintains motivation, and creates momentum for continued effort",
        "It only applies to large achievements",
        "It's unnecessary"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#motivation", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q3: Long-term motivation methods (RECALL)
    {
      question: "According to the lesson, what helps sustain motivation over the long term?",
      options: [
        "Ignoring progress",
        "Regular progress tracking, celebrating milestones, and maintaining connection to purpose",
        "Working without breaks",
        "Avoiding reflection"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#motivation", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q4: Why motivation sustainability matters (APPLICATION - Rewritten)
    {
      question: "Why is sustaining motivation important according to the lesson?",
      options: [
        "It eliminates the need for effort",
        "It maintains effort and energy over time, prevents abandonment, enables long-term goal achievement, and creates positive reinforcement cycles",
        "It only applies to certain goals",
        "It requires no structure"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#motivation", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q5: Motivation decline scenario (APPLICATION - Keep)
    {
      question: "A person starts a goal with enthusiasm but loses motivation after a few weeks. According to the lesson, what is likely missing?",
      options: [
        "More goals",
        "Progress tracking, milestone celebrations, and connection to purpose",
        "Less effort",
        "No structure needed"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#motivation", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q6: Building motivation system (APPLICATION - New)
    {
      question: "You want to maintain motivation for a 6-month project. According to the lesson, what should you establish?",
      options: [
        "Just work harder",
        "Regular progress tracking, milestone celebrations, purpose reminders, and reflection on wins to maintain momentum",
        "Only tracking",
        "Only celebrations"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#motivation", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q7: Motivation system failure analysis (CRITICAL THINKING - New)
    {
      question: "A person consistently starts goals with high motivation but abandons them after initial enthusiasm fades. According to the lesson's framework, what is the core issue?",
      options: [
        "Not enough goals",
        "Lack of motivation sustainability practices - missing progress tracking, milestone celebrations, and purpose connection that maintain momentum beyond initial enthusiasm",
        "Too much motivation",
        "Motivation is unnecessary"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#motivation", "#advanced", "#critical-thinking", "#en", "#all-languages"]
    }
  ],
  // Hungarian (HU) - Professional translations
  HU: [
    {
      question: "A lecke szerint miért fontos a haladás nyomon követése a motivációhoz?",
      options: [
        "Kiküszöböli a célok szükségességét",
        "Látható bizonyítékot nyújt az előrehaladásról, megerősíti az elkötelezettséget, és fenntartja a lendületet",
        "Csak rövid távú célokra vonatkozik",
        "Nem igényel erőfeszítést"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#motivation", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint mi a győzelmek ünneplésének előnye?",
      options: [
        "Időpazarlás",
        "Megerősíti a pozitív viselkedést, fenntartja a motivációt, és lendületet teremt a folytatott erőfeszítéshez",
        "Csak nagy eredményekre vonatkozik",
        "Felesleges"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#motivation", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint mi segít fenntartani a motivációt hosszú távon?",
      options: [
        "A haladás figyelmen kívül hagyása",
        "Rendszeres haladáskövetés, mérföldkövek ünneplése és a célhoz való kapcsolódás fenntartása",
        "Szünetek nélküli munka",
        "A reflexió elkerülése"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#motivation", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "Miért fontos a motiváció fenntartása a lecke szerint?",
      options: [
        "Kiküszöböli az erőfeszítés szükségességét",
        "Fenntartja az erőfeszítést és az energiát az idő múlásával, megelőzi a feladást, lehetővé teszi a hosszú távú célok elérését, és pozitív megerősítési ciklusokat teremt",
        "Csak bizonyos célokra vonatkozik",
        "Nem igényel struktúrát"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#motivation", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy személy lelkesedéssel kezd egy célt, de néhány hét után elveszíti a motivációt. A lecke szerint mi hiányzik valószínűleg?",
      options: [
        "Több cél",
        "Haladáskövetés, mérföldkövek ünneplése és a célhoz való kapcsolódás",
        "Kevesebb erőfeszítés",
        "Nincs szükség struktúrára"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#motivation", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Fenntartani szeretnéd a motivációt egy 6 hónapos projekthez. A lecke szerint mit kellene létrehozni?",
      options: [
        "Csak dolgozz keményebben",
        "Rendszeres haladáskövetés, mérföldkövek ünneplése, célra emlékeztetők, és a győzelmekről való reflexió a lendület fenntartásához",
        "Csak követés",
        "Csak ünneplés"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#motivation", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy személy következetesen magas motivációval kezd célokat, de elhagyja őket, miután a kezdeti lelkesedés elhalványul. A lecke keretrendszere szerint mi a fő probléma?",
      options: [
        "Nincs elég cél",
        "Hiányoznak a motiváció fenntartási gyakorlatok - hiányzik a haladáskövetés, mérföldkövek ünneplése és a célhoz való kapcsolódás, amelyek a kezdeti lelkesedésen túl is fenntartják a lendületet",
        "Túl sok motiváció",
        "A motiváció felesleges"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#motivation", "#advanced", "#critical-thinking", "#hu", "#all-languages"]
    }
  ],
  // Turkish (TR) - Professional translations
  TR: [
    {
      question: "Derse göre motivasyon için ilerleme takibi neden önemlidir?",
      options: [
        "Hedef ihtiyacını ortadan kaldırır",
        "İlerlemenin görünür kanıtını sağlar, taahhüdü güçlendirir ve momentumu korur",
        "Sadece kısa vadeli hedeflere uygulanır",
        "Çaba gerektirmez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#motivation", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre kazançları kutlamanın faydası nedir?",
      options: [
        "Zaman kaybıdır",
        "Pozitif davranışı güçlendirir, motivasyonu korur ve sürekli çaba için momentum yaratır",
        "Sadece büyük başarılara uygulanır",
        "Gereksizdir"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#motivation", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre uzun vadede motivasyonu sürdürmeye ne yardımcı olur?",
      options: [
        "İlerlemeyi görmezden gelmek",
        "Düzenli ilerleme takibi, kilometre taşlarını kutlama ve amaca bağlantıyı koruma",
        "Mola vermeden çalışmak",
        "Yansıtmaktan kaçınmak"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#motivation", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre motivasyonu sürdürmek neden önemlidir?",
      options: [
        "Çaba ihtiyacını ortadan kaldırır",
        "Zamanla çabayı ve enerjiyi korur, terk etmeyi önler, uzun vadeli hedef başarısını sağlar ve pozitif pekiştirme döngüleri yaratır",
        "Sadece belirli hedeflere uygulanır",
        "Yapı gerektirmez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#motivation", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir kişi hevesle bir hedefe başlar ancak birkaç hafta sonra motivasyonunu kaybeder. Derse göre muhtemelen ne eksik?",
      options: [
        "Daha fazla hedef",
        "İlerleme takibi, kilometre taşlarını kutlama ve amaca bağlantı",
        "Daha az çaba",
        "Yapı gerekmez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#motivation", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "6 aylık bir proje için motivasyonu korumak istiyorsunuz. Derse göre ne kurmalısınız?",
      options: [
        "Sadece daha sıkı çalışın",
        "Düzenli ilerleme takibi, kilometre taşlarını kutlama, amaç hatırlatıcıları ve momentumu korumak için kazançlar üzerine yansıtma",
        "Sadece takip",
        "Sadece kutlamalar"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#motivation", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir kişi tutarlı olarak yüksek motivasyonla hedeflere başlar ancak ilk heves geçtikten sonra onları terk eder. Dersin çerçevesine göre temel sorun nedir?",
      options: [
        "Yeterli hedef yok",
        "Motivasyon sürdürme uygulamalarının eksikliği - ilk hevesin ötesinde momentumu koruyan ilerleme takibi, kilometre taşlarını kutlama ve amaç bağlantısı eksik",
        "Çok fazla motivasyon",
        "Motivasyon gereksiz"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#motivation", "#advanced", "#critical-thinking", "#tr", "#all-languages"]
    }
  ],
  // Bulgarian (BG) - Professional translations
  BG: [
    {
      question: "Според урока, защо проследяването на напредъка е важно за мотивацията?",
      options: [
        "Елиминира необходимостта от цели",
        "Осигурява видимо доказателство за напредък, подсилва ангажираността и поддържа инерцията",
        "Прилага се само за краткосрочни цели",
        "Не изисква усилие"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#motivation", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, каква е ползата от отпразнуването на победи?",
      options: [
        "Губи време",
        "Подсилва позитивното поведение, поддържа мотивацията и създава инерция за продължително усилие",
        "Прилага се само за големи постижения",
        "Не е необходимо"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#motivation", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, какво помага за поддържане на мотивацията в дългосрочен план?",
      options: [
        "Игнориране на напредъка",
        "Редовно проследяване на напредъка, отпразнуване на вехи и поддържане на връзка с целта",
        "Работа без почивки",
        "Избягване на размисъл"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#motivation", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Защо поддържането на мотивацията е важно според урока?",
      options: [
        "Елиминира необходимостта от усилие",
        "Поддържа усилието и енергията с течение на времето, предотвратява изоставяне, позволява постигане на дългосрочни цели и създава цикли на позитивно подсилване",
        "Прилага се само за определени цели",
        "Не изисква структура"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#motivation", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Човек започва цел с ентусиазъм, но губи мотивация след няколко седмици. Според урока, какво вероятно липсва?",
      options: [
        "Повече цели",
        "Проследяване на напредъка, отпразнуване на вехи и връзка с целта",
        "По-малко усилие",
        "Не е нужна структура"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#motivation", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Искате да поддържате мотивация за 6-месечен проект. Според урока, какво трябва да установите?",
      options: [
        "Просто работете по-усърдно",
        "Редовно проследяване на напредъка, отпразнуване на вехи, напомняния за целта и размисъл върху победите за поддържане на инерцията",
        "Само проследяване",
        "Само отпразнувания"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#motivation", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Човек последователно започва цели с висока мотивация, но ги изоставя след като първоначалният ентусиазъм избледнее. Според рамката на урока, какъв е основният проблем?",
      options: [
        "Няма достатъчно цели",
        "Липса на практики за поддържане на мотивацията - липсват проследяване на напредъка, отпразнуване на вехи и връзка с целта, които поддържат инерцията отвъд първоначалния ентусиазъм",
        "Твърде много мотивация",
        "Мотивацията е ненужна"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#motivation", "#advanced", "#critical-thinking", "#bg", "#all-languages"]
    }
  ],
  // Polish (PL) - Professional translations
  PL: [
    {
      question: "Według lekcji, dlaczego śledzenie postępu jest ważne dla motywacji?",
      options: [
        "Eliminuje potrzebę celów",
        "Zapewnia widoczny dowód postępu, wzmacnia zaangażowanie i utrzymuje pęd",
        "Dotyczy tylko celów krótkoterminowych",
        "Nie wymaga wysiłku"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#motivation", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, jaka jest korzyść z celebrowania zwycięstw?",
      options: [
        "Marnuje czas",
        "Wzmacnia pozytywne zachowanie, utrzymuje motywację i tworzy pęd do dalszego wysiłku",
        "Dotyczy tylko dużych osiągnięć",
        "Jest niepotrzebne"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#motivation", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, co pomaga utrzymać motywację w długim okresie?",
      options: [
        "Ignorowanie postępu",
        "Regularne śledzenie postępu, celebrowanie kamieni milowych i utrzymanie połączenia z celem",
        "Praca bez przerw",
        "Unikanie refleksji"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#motivation", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Dlaczego utrzymywanie motywacji jest ważne według lekcji?",
      options: [
        "Eliminuje potrzebę wysiłku",
        "Utrzymuje wysiłek i energię w czasie, zapobiega porzuceniu, umożliwia osiąganie długoterminowych celów i tworzy cykle pozytywnego wzmocnienia",
        "Dotyczy tylko niektórych celów",
        "Nie wymaga struktury"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#motivation", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Osoba zaczyna cel z entuzjazmem, ale traci motywację po kilku tygodniach. Według lekcji, czego prawdopodobnie brakuje?",
      options: [
        "Więcej celów",
        "Śledzenie postępu, celebrowanie kamieni milowych i połączenie z celem",
        "Mniej wysiłku",
        "Nie jest potrzebna struktura"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#motivation", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Chcesz utrzymać motywację dla 6-miesięcznego projektu. Według lekcji, co powinieneś ustanowić?",
      options: [
        "Po prostu pracuj ciężej",
        "Regularne śledzenie postępu, celebrowanie kamieni milowych, przypomnienia o celu i refleksja nad zwycięstwami, aby utrzymać pęd",
        "Tylko śledzenie",
        "Tylko celebracje"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#motivation", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Osoba konsekwentnie zaczyna cele z wysoką motywacją, ale porzuca je po zaniknięciu początkowego entuzjazmu. Według ram lekcji, jaki jest główny problem?",
      options: [
        "Niewystarczająca liczba celów",
        "Brak praktyk utrzymywania motywacji - brakuje śledzenia postępu, celebrowania kamieni milowych i połączenia z celem, które utrzymują pęd poza początkowym entuzjazmem",
        "Zbyt dużo motywacji",
        "Motywacja jest niepotrzebna"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#motivation", "#advanced", "#critical-thinking", "#pl", "#all-languages"]
    }
  ],
  // Vietnamese (VI) - Professional translations
  VI: [
    {
      question: "Theo bài học, tại sao theo dõi tiến độ quan trọng đối với động lực?",
      options: [
        "Nó loại bỏ nhu cầu về mục tiêu",
        "Nó cung cấp bằng chứng rõ ràng về tiến bộ, củng cố cam kết và duy trì động lực",
        "Nó chỉ áp dụng cho mục tiêu ngắn hạn",
        "Nó không yêu cầu nỗ lực"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#motivation", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, lợi ích của việc ăn mừng chiến thắng là gì?",
      options: [
        "Nó lãng phí thời gian",
        "Nó củng cố hành vi tích cực, duy trì động lực và tạo động lực cho nỗ lực tiếp tục",
        "Nó chỉ áp dụng cho thành tựu lớn",
        "Nó không cần thiết"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#motivation", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, điều gì giúp duy trì động lực trong dài hạn?",
      options: [
        "Bỏ qua tiến độ",
        "Theo dõi tiến độ thường xuyên, ăn mừng các mốc và duy trì kết nối với mục đích",
        "Làm việc không nghỉ",
        "Tránh suy ngẫm"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#motivation", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Tại sao duy trì động lực quan trọng theo bài học?",
      options: [
        "Nó loại bỏ nhu cầu về nỗ lực",
        "Nó duy trì nỗ lực và năng lượng theo thời gian, ngăn chặn từ bỏ, cho phép đạt được mục tiêu dài hạn và tạo chu kỳ củng cố tích cực",
        "Nó chỉ áp dụng cho một số mục tiêu",
        "Nó không yêu cầu cấu trúc"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#motivation", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Một người bắt đầu một mục tiêu với nhiệt tình nhưng mất động lực sau vài tuần. Theo bài học, điều gì có thể đang thiếu?",
      options: [
        "Nhiều mục tiêu hơn",
        "Theo dõi tiến độ, ăn mừng các mốc và kết nối với mục đích",
        "Ít nỗ lực hơn",
        "Không cần cấu trúc"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#motivation", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Bạn muốn duy trì động lực cho một dự án 6 tháng. Theo bài học, bạn nên thiết lập gì?",
      options: [
        "Chỉ làm việc chăm chỉ hơn",
        "Theo dõi tiến độ thường xuyên, ăn mừng các mốc, nhắc nhở về mục đích và suy ngẫm về các chiến thắng để duy trì động lực",
        "Chỉ theo dõi",
        "Chỉ ăn mừng"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#motivation", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Một người liên tục bắt đầu mục tiêu với động lực cao nhưng từ bỏ chúng sau khi sự nhiệt tình ban đầu phai nhạt. Theo khung của bài học, vấn đề cốt lõi là gì?",
      options: [
        "Không đủ mục tiêu",
        "Thiếu các thực hành duy trì động lực - thiếu theo dõi tiến độ, ăn mừng các mốc và kết nối mục đích duy trì động lực vượt quá sự nhiệt tình ban đầu",
        "Quá nhiều động lực",
        "Động lực là không cần thiết"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#motivation", "#advanced", "#critical-thinking", "#vi", "#all-languages"]
    }
  ],
  // Indonesian (ID) - Professional translations
  ID: [
    {
      question: "Menurut pelajaran, mengapa melacak kemajuan penting untuk motivasi?",
      options: [
        "Ini menghilangkan kebutuhan akan tujuan",
        "Ini memberikan bukti nyata dari kemajuan, memperkuat komitmen, dan mempertahankan momentum",
        "Ini hanya berlaku untuk tujuan jangka pendek",
        "Ini tidak memerlukan upaya"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#motivation", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, apa manfaat merayakan kemenangan?",
      options: [
        "Ini membuang waktu",
        "Ini memperkuat perilaku positif, mempertahankan motivasi, dan menciptakan momentum untuk upaya berkelanjutan",
        "Ini hanya berlaku untuk pencapaian besar",
        "Ini tidak perlu"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#motivation", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, apa yang membantu mempertahankan motivasi dalam jangka panjang?",
      options: [
        "Mengabaikan kemajuan",
        "Pelacakan kemajuan rutin, merayakan tonggak, dan mempertahankan koneksi dengan tujuan",
        "Bekerja tanpa istirahat",
        "Menghindari refleksi"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#motivation", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Mengapa mempertahankan motivasi penting menurut pelajaran?",
      options: [
        "Ini menghilangkan kebutuhan akan upaya",
        "Ini mempertahankan upaya dan energi dari waktu ke waktu, mencegah penelantaran, memungkinkan pencapaian tujuan jangka panjang, dan menciptakan siklus penguatan positif",
        "Ini hanya berlaku untuk tujuan tertentu",
        "Ini tidak memerlukan struktur"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#motivation", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Seseorang memulai tujuan dengan antusiasme tetapi kehilangan motivasi setelah beberapa minggu. Menurut pelajaran, apa yang mungkin kurang?",
      options: [
        "Lebih banyak tujuan",
        "Pelacakan kemajuan, perayaan tonggak, dan koneksi dengan tujuan",
        "Lebih sedikit upaya",
        "Tidak perlu struktur"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#motivation", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Anda ingin mempertahankan motivasi untuk proyek 6 bulan. Menurut pelajaran, apa yang harus Anda tetapkan?",
      options: [
        "Hanya bekerja lebih keras",
        "Pelacakan kemajuan rutin, perayaan tonggak, pengingat tujuan, dan refleksi tentang kemenangan untuk mempertahankan momentum",
        "Hanya pelacakan",
        "Hanya perayaan"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#motivation", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Seseorang secara konsisten memulai tujuan dengan motivasi tinggi tetapi menelantarkannya setelah antusiasme awal memudar. Menurut kerangka pelajaran, apa masalah intinya?",
      options: [
        "Tidak cukup tujuan",
        "Kurangnya praktik mempertahankan motivasi - kurang pelacakan kemajuan, perayaan tonggak, dan koneksi tujuan yang mempertahankan momentum di luar antusiasme awal",
        "Terlalu banyak motivasi",
        "Motivasi tidak perlu"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#motivation", "#advanced", "#critical-thinking", "#id", "#all-languages"]
    }
  ],
  // Arabic (AR) - Professional translations (RTL)
  AR: [
    {
      question: "وفقًا للدرس، لماذا تتبع التقدم مهم للدافع?",
      options: [
        "إنه يلغي الحاجة للأهداف",
        "يوفر دليلاً مرئياً على التقدم، يعزز الالتزام، ويحافظ على الزخم",
        "ينطبق فقط على الأهداف قصيرة الأجل",
        "لا يتطلب جهد"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#motivation", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، ما فائدة الاحتفال بالانتصارات?",
      options: [
        "إنه يضيع الوقت",
        "يعزز السلوك الإيجابي، يحافظ على الدافع، ويخلق زخمًا للجهد المستمر",
        "ينطبق فقط على الإنجازات الكبيرة",
        "إنه غير ضروري"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#motivation", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، ما الذي يساعد في الحفاظ على الدافع على المدى الطويل?",
      options: [
        "تجاهل التقدم",
        "تتبع التقدم المنتظم، الاحتفال بالمعالم، والحفاظ على الاتصال بالهدف",
        "العمل دون استراحات",
        "تجنب التأمل"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#motivation", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "لماذا الحفاظ على الدافع مهم وفقًا للدرس?",
      options: [
        "إنه يلغي الحاجة للجهد",
        "يحافظ على الجهد والطاقة بمرور الوقت، يمنع التخلي، يمكّن من تحقيق الأهداف طويلة الأجل، ويخلق دورات تعزيز إيجابية",
        "ينطبق فقط على أهداف معينة",
        "لا يتطلب هيكلًا"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#motivation", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "شخص يبدأ هدفًا بحماس لكنه يفقد الدافع بعد بضعة أسابيع. وفقًا للدرس، ما الذي ربما كان مفقودًا?",
      options: [
        "المزيد من الأهداف",
        "تتبع التقدم، الاحتفال بالمعالم، والاتصال بالهدف",
        "أقل جهد",
        "لا حاجة للهيكل"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#motivation", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "تريد الحفاظ على الدافع لمشروع مدته 6 أشهر. وفقًا للدرس، ماذا يجب أن تنشئ?",
      options: [
        "فقط اعمل بجدية أكبر",
        "تتبع التقدم المنتظم، الاحتفال بالمعالم، تذكيرات الهدف، والتأمل في الانتصارات للحفاظ على الزخم",
        "فقط التتبع",
        "فقط الاحتفالات"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#motivation", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "شخص يبدأ باستمرار أهدافًا بدافع عالٍ لكنه يتخلى عنها بعد أن يتلاشى الحماس الأولي. وفقًا لإطار الدرس، ما هي المشكلة الأساسية?",
      options: [
        "لا توجد أهداف كافية",
        "نقص ممارسات الحفاظ على الدافع - نقص تتبع التقدم، الاحتفال بالمعالم، واتصال الهدف الذي يحافظ على الزخم بعد الحماس الأولي",
        "الكثير من الدافع",
        "الدافع غير ضروري"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#motivation", "#advanced", "#critical-thinking", "#ar", "#all-languages"]
    }
  ],
  // Portuguese (PT) - Professional translations (Brazilian)
  PT: [
    {
      question: "De acordo com a lição, por que rastrear o progresso é importante para a motivação?",
      options: [
        "Elimina a necessidade de objetivos",
        "Fornece evidência visível de avanço, reforça o comprometimento e mantém o momentum",
        "Aplica-se apenas a objetivos de curto prazo",
        "Não requer esforço"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#motivation", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, qual é o benefício de celebrar vitórias?",
      options: [
        "Desperdiça tempo",
        "Reforça comportamento positivo, mantém motivação e cria momentum para esforço contínuo",
        "Aplica-se apenas a grandes conquistas",
        "É desnecessário"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#motivation", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, o que ajuda a sustentar motivação a longo prazo?",
      options: [
        "Ignorar o progresso",
        "Rastreamento regular de progresso, celebração de marcos e manutenção de conexão com o propósito",
        "Trabalhar sem pausas",
        "Evitar reflexão"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#motivation", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "Por que sustentar motivação é importante de acordo com a lição?",
      options: [
        "Elimina a necessidade de esforço",
        "Mantém esforço e energia ao longo do tempo, previne abandono, permite realização de objetivos de longo prazo e cria ciclos de reforço positivo",
        "Aplica-se apenas a certos objetivos",
        "Não requer estrutura"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#motivation", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Uma pessoa começa um objetivo com entusiasmo, mas perde motivação após algumas semanas. De acordo com a lição, o que provavelmente está faltando?",
      options: [
        "Mais objetivos",
        "Rastreamento de progresso, celebração de marcos e conexão com propósito",
        "Menos esforço",
        "Não é necessária estrutura"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#motivation", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Você quer manter motivação para um projeto de 6 meses. De acordo com a lição, o que você deve estabelecer?",
      options: [
        "Apenas trabalhe mais",
        "Rastreamento regular de progresso, celebração de marcos, lembretes de propósito e reflexão sobre vitórias para manter momentum",
        "Apenas rastreamento",
        "Apenas celebrações"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#motivation", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Uma pessoa consistentemente começa objetivos com alta motivação, mas os abandona após o entusiasmo inicial desaparecer. De acordo com a estrutura da lição, qual é o problema central?",
      options: [
        "Não há objetivos suficientes",
        "Falta de práticas de sustentação de motivação - falta rastreamento de progresso, celebração de marcos e conexão com propósito que mantêm momentum além do entusiasmo inicial",
        "Muita motivação",
        "Motivação é desnecessária"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#motivation", "#advanced", "#critical-thinking", "#pt", "#all-languages"]
    }
  ],
  // Hindi (HI) - Professional translations
  HI: [
    {
      question: "पाठ के अनुसार, प्रेरणा के लिए प्रगति को ट्रैक करना क्यों महत्वपूर्ण है?",
      options: [
        "यह लक्ष्यों की आवश्यकता को समाप्त करता है",
        "यह प्रगति का दृश्य प्रमाण प्रदान करता है, प्रतिबद्धता को मजबूत करता है, और गति बनाए रखता है",
        "यह केवल अल्पकालिक लक्ष्यों पर लागू होता है",
        "इसके लिए प्रयास की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#motivation", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, जीत का जश्न मनाने का लाभ क्या है?",
      options: [
        "यह समय बर्बाद करता है",
        "यह सकारात्मक व्यवहार को मजबूत करता है, प्रेरणा बनाए रखता है, और निरंतर प्रयास के लिए गति बनाता है",
        "यह केवल बड़ी उपलब्धियों पर लागू होता है",
        "यह अनावश्यक है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#motivation", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, दीर्घकाल में प्रेरणा बनाए रखने में क्या मदद करता है?",
      options: [
        "प्रगति को अनदेखा करना",
        "नियमित प्रगति ट्रैकिंग, मील के पत्थर का जश्न मनाना, और उद्देश्य से कनेक्शन बनाए रखना",
        "ब्रेक के बिना काम करना",
        "प्रतिबिंब से बचना"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#motivation", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार प्रेरणा बनाए रखना क्यों महत्वपूर्ण है?",
      options: [
        "यह प्रयास की आवश्यकता को समाप्त करता है",
        "यह समय के साथ प्रयास और ऊर्जा बनाए रखता है, परित्याग को रोकता है, दीर्घकालिक लक्ष्य प्राप्ति को सक्षम बनाता है, और सकारात्मक सुदृढीकरण चक्र बनाता है",
        "यह केवल कुछ लक्ष्यों पर लागू होता है",
        "इसके लिए संरचना की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#motivation", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक व्यक्ति उत्साह के साथ एक लक्ष्य शुरू करता है लेकिन कुछ हफ्तों बाद प्रेरणा खो देता है। पाठ के अनुसार, क्या संभवतः गायब है?",
      options: [
        "अधिक लक्ष्य",
        "प्रगति ट्रैकिंग, मील के पत्थर का जश्न मनाना, और उद्देश्य से कनेक्शन",
        "कम प्रयास",
        "संरचना की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#motivation", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "आप 6 महीने की परियोजना के लिए प्रेरणा बनाए रखना चाहते हैं। पाठ के अनुसार, आपको क्या स्थापित करना चाहिए?",
      options: [
        "बस कठिन काम करें",
        "नियमित प्रगति ट्रैकिंग, मील के पत्थर का जश्न मनाना, उद्देश्य अनुस्मारक, और गति बनाए रखने के लिए जीत पर प्रतिबिंब",
        "केवल ट्रैकिंग",
        "केवल जश्न"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#motivation", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक व्यक्ति लगातार उच्च प्रेरणा के साथ लक्ष्य शुरू करता है लेकिन प्रारंभिक उत्साह फीका होने के बाद उन्हें छोड़ देता है। पाठ के ढांचे के अनुसार, मुख्य समस्या क्या है?",
      options: [
        "पर्याप्त लक्ष्य नहीं हैं",
        "प्रेरणा बनाए रखने की प्रथाओं की कमी - प्रगति ट्रैकिंग, मील के पत्थर का जश्न मनाना, और उद्देश्य कनेक्शन जो प्रारंभिक उत्साह से परे गति बनाए रखते हैं गायब हैं",
        "बहुत अधिक प्रेरणा",
        "प्रेरणा अनावश्यक है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#motivation", "#advanced", "#critical-thinking", "#hi", "#all-languages"]
    }
  ]
};

async function seedDay17Enhanced() {
  try {
    await connectDB();
    console.log('🌱 SEEDING DAY 17 ENHANCED QUIZ QUESTIONS\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    let totalQuestions = 0;
    let totalUpdated = 0;
    let totalCreated = 0;

    for (const lang of LANGUAGES) {
      const courseId = `${COURSE_ID_BASE}_${lang}`;
      const lessonId = `${COURSE_ID_BASE}_${lang}_DAY_17`;

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
      const questions = DAY17_QUESTIONS[lang];
      
      if (!questions || questions.length === 0) {
        console.error(`   ❌ ERROR: No questions defined for ${lang}! Questions MUST be in course language.`);
        throw new Error(`Missing translations for ${lang} - Day 17 questions must be in course language, not English fallback`);
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
    console.log(`\n✅ DAY 17 ENHANCEMENT COMPLETE!\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedDay17Enhanced();
