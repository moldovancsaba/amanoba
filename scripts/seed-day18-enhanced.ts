/**
 * Seed Day 18 Enhanced Quiz Questions
 * 
 * Purpose: Enhance Day 18 quizzes from 5 to 7 questions across all 10 languages
 * Why: Part of Quiz Quality Enhancement - Phase 1, Day 18
 * 
 * Lesson Topic: Crisis Management and Adaptability (adaptation, quick learning)
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
const DAY_NUMBER = 18;
const LANGUAGES = ['HU', 'EN', 'TR', 'BG', 'PL', 'VI', 'ID', 'AR', 'PT', 'HI'];

/**
 * Day 18 Enhanced Questions - All Languages
 * Topic: Crisis Management and Adaptability
 * Structure: 7 questions per language
 * Q1-Q3: Keep (Recall - foundational concepts)
 * Q4: Rewritten (Application - from definition to purpose)
 * Q5: Keep (Application - scenario-based)
 * Q6: New (Application - practical implementation)
 * Q7: New (Critical Thinking - systems integration)
 */
const DAY18_QUESTIONS: Record<string, Array<{
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: QuestionDifficulty;
  category: string;
  questionType: QuestionType;
  hashtags: string[];
}>> = {
  EN: [
    // Q1: Adaptability definition (RECALL)
    {
      question: "According to the lesson, what is adaptability in productivity?",
      options: [
        "Sticking to one plan",
        "The ability to adjust to unexpected changes, learn quickly, and maintain effectiveness",
        "Avoiding all changes",
        "Only for emergencies"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#adaptability", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q2: Quick learning importance (RECALL)
    {
      question: "According to the lesson, why is quick learning important in crisis management?",
      options: [
        "It's not important",
        "It enables rapid response, reduces downtime, and maintains productivity during unexpected challenges",
        "It only applies to certain situations",
        "It requires no effort"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#crisis-management", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q3: Adaptation methods (RECALL)
    {
      question: "According to the lesson, what is essential for effective adaptation?",
      options: [
        "Ignoring changes",
        "Flexible thinking, rapid learning, and systematic adjustment of plans",
        "Sticking to original plans",
        "Avoiding all adjustments"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#adaptability", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q4: Why adaptability matters (APPLICATION - Rewritten)
    {
      question: "Why is adaptability important according to the lesson?",
      options: [
        "It eliminates all challenges",
        "It enables response to unexpected changes, maintains productivity during crises, facilitates quick learning, and ensures continued progress despite disruptions",
        "It only applies to certain jobs",
        "It requires no planning"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#adaptability", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q5: Crisis response scenario (APPLICATION - Keep)
    {
      question: "An unexpected crisis disrupts a project timeline. According to the lesson, what should be done?",
      options: [
        "Abandon the project",
        "Assess the situation, adapt the plan quickly, learn what's needed, and adjust timelines while maintaining progress",
        "Ignore the crisis",
        "Wait for it to resolve"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#crisis-management", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q6: Building adaptability (APPLICATION - New)
    {
      question: "You want to improve your ability to handle unexpected challenges. According to the lesson, what should you develop?",
      options: [
        "Rigid plans only",
        "Flexible thinking patterns, rapid learning skills, systematic adaptation processes, and crisis response frameworks",
        "Only learning skills",
        "Only flexible thinking"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#adaptability", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q7: Rigidity analysis (CRITICAL THINKING - New)
    {
      question: "A team consistently fails when unexpected changes occur, leading to project delays and frustration. According to the lesson's framework, what is the core issue?",
      options: [
        "Not enough planning",
        "Lack of adaptability - missing flexible thinking, rapid learning capabilities, and adaptation processes that enable effective response to unexpected challenges",
        "Too much flexibility",
        "Adaptability is unnecessary"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#adaptability", "#advanced", "#critical-thinking", "#en", "#all-languages"]
    }
  ],
  // Hungarian (HU) - Professional translations
  HU: [
    {
      question: "A lecke szerint mi az alkalmazkodóképesség a termelékenységben?",
      options: [
        "Egy tervhez ragaszkodni",
        "A képesség váratlan változásokhoz való alkalmazkodásra, gyors tanulásra és a hatékonyság fenntartására",
        "Minden változás elkerülése",
        "Csak vészhelyzetekre"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#adaptability", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint miért fontos a gyors tanulás a kríziskezelésben?",
      options: [
        "Nem fontos",
        "Lehetővé teszi a gyors reagálást, csökkenti az állásidőt, és fenntartja a termelékenységet váratlan kihívások során",
        "Csak bizonyos helyzetekre vonatkozik",
        "Nem igényel erőfeszítést"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#crisis-management", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint mi elengedhetetlen a hatékony alkalmazkodáshoz?",
      options: [
        "A változások figyelmen kívül hagyása",
        "Rugalmas gondolkodás, gyors tanulás és a tervek szisztematikus módosítása",
        "Az eredeti tervekhez ragaszkodás",
        "Minden módosítás elkerülése"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#adaptability", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "Miért fontos az alkalmazkodóképesség a lecke szerint?",
      options: [
        "Kiküszöböli az összes kihívást",
        "Lehetővé teszi a váratlan változásokra való reagálást, fenntartja a termelékenységet krízisek során, elősegíti a gyors tanulást, és biztosítja a folyamatos haladást a zavarok ellenére",
        "Csak bizonyos munkákra vonatkozik",
        "Nem igényel tervezést"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#adaptability", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy váratlan krízis megzavarja egy projekt időkeretét. A lecke szerint mit kell tenni?",
      options: [
        "Feladni a projektet",
        "Értékelni a helyzetet, gyorsan alkalmazkodni a tervhez, megtanulni, amire szükség van, és módosítani az időkereteket a haladás fenntartása mellett",
        "Figyelmen kívül hagyni a krízist",
        "Várni, amíg megoldódik"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#crisis-management", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Javítani szeretnéd a képességedet a váratlan kihívások kezelésére. A lecke szerint mit kellene fejleszteni?",
      options: [
        "Csak merev terveket",
        "Rugalmas gondolkodási mintákat, gyors tanulási készségeket, szisztematikus alkalmazkodási folyamatokat és krízisválasz keretrendszereket",
        "Csak tanulási készségeket",
        "Csak rugalmas gondolkodást"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#adaptability", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy csapat következetesen kudarcot vall, amikor váratlan változások történnek, ami projekt késéseket és frusztrációt okoz. A lecke keretrendszere szerint mi a fő probléma?",
      options: [
        "Nincs elég tervezés",
        "Hiányzik az alkalmazkodóképesség - hiányzik a rugalmas gondolkodás, gyors tanulási képességek és alkalmazkodási folyamatok, amelyek lehetővé teszik a hatékony reagálást váratlan kihívásokra",
        "Túl sok rugalmasság",
        "Az alkalmazkodóképesség felesleges"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#adaptability", "#advanced", "#critical-thinking", "#hu", "#all-languages"]
    }
  ],
  // Turkish (TR) - Professional translations
  TR: [
    {
      question: "Derse göre verimlilikte uyarlanabilirlik nedir?",
      options: [
        "Bir plana bağlı kalmak",
        "Beklenmedik değişikliklere uyum sağlama, hızlı öğrenme ve etkinliği koruma yeteneği",
        "Tüm değişikliklerden kaçınmak",
        "Sadece acil durumlar için"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#adaptability", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre hızlı öğrenme neden kriz yönetiminde önemlidir?",
      options: [
        "Önemli değil",
        "Hızlı yanıt sağlar, kesinti süresini azaltır ve beklenmedik zorluklar sırasında verimliliği korur",
        "Sadece belirli durumlara uygulanır",
        "Çaba gerektirmez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#crisis-management", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre etkili uyarlanma için ne gereklidir?",
      options: [
        "Değişiklikleri görmezden gelmek",
        "Esnek düşünme, hızlı öğrenme ve planların sistematik ayarlanması",
        "Orijinal planlara bağlı kalmak",
        "Tüm ayarlamalardan kaçınmak"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#adaptability", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre uyarlanabilirlik neden önemlidir?",
      options: [
        "Tüm zorlukları ortadan kaldırır",
        "Beklenmedik değişikliklere yanıt vermeyi sağlar, krizler sırasında verimliliği korur, hızlı öğrenmeyi kolaylaştırır ve kesintilere rağmen sürekli ilerlemeyi sağlar",
        "Sadece belirli işlere uygulanır",
        "Planlama gerektirmez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#adaptability", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Beklenmedik bir kriz bir proje zaman çizelgesini bozar. Derse göre ne yapılmalı?",
      options: [
        "Projeyi terk et",
        "Durumu değerlendir, planı hızlıca uyarla, gerekeni öğren ve ilerlemeyi korurken zaman çizelgelerini ayarla",
        "Krizi görmezden gel",
        "Çözülmesini bekle"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#crisis-management", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Beklenmedik zorluklarla başa çıkma yeteneğinizi geliştirmek istiyorsunuz. Derse göre ne geliştirmelisiniz?",
      options: [
        "Sadece katı planlar",
        "Esnek düşünme kalıpları, hızlı öğrenme becerileri, sistematik uyarlama süreçleri ve kriz yanıt çerçeveleri",
        "Sadece öğrenme becerileri",
        "Sadece esnek düşünme"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#adaptability", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir takım beklenmedik değişiklikler olduğunda tutarlı olarak başarısız oluyor, bu da proje gecikmelerine ve hayal kırıklığına yol açıyor. Dersin çerçevesine göre temel sorun nedir?",
      options: [
        "Yeterli planlama yok",
        "Uyarlanabilirlik eksikliği - beklenmedik zorluklara etkili yanıt sağlayan esnek düşünme, hızlı öğrenme yetenekleri ve uyarlama süreçleri eksik",
        "Çok fazla esneklik",
        "Uyarlanabilirlik gereksiz"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#adaptability", "#advanced", "#critical-thinking", "#tr", "#all-languages"]
    }
  ],
  // Bulgarian (BG) - Professional translations
  BG: [
    {
      question: "Според урока, какво е адаптивността в производителността?",
      options: [
        "Държане на един план",
        "Способността да се адаптира към неочаквани промени, бързо учене и поддържане на ефективност",
        "Избягване на всички промени",
        "Само за спешни случаи"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#adaptability", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, защо бързото учене е важно в управлението на кризата?",
      options: [
        "Не е важно",
        "Позволява бърз отговор, намалява престоя и поддържа производителността по време на неочаквани предизвикателства",
        "Прилага се само за определени ситуации",
        "Не изисква усилие"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#crisis-management", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, какво е от съществено значение за ефективна адаптация?",
      options: [
        "Игнориране на промените",
        "Гъвкаво мислене, бързо учене и систематична корекция на плановете",
        "Държане на оригиналните планове",
        "Избягване на всички корекции"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#adaptability", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Защо адаптивността е важна според урока?",
      options: [
        "Елиминира всички предизвикателства",
        "Позволява отговор на неочаквани промени, поддържа производителността по време на кризи, улеснява бързото учене и осигурява продължителен напредък въпреки смущенията",
        "Прилага се само за определени работи",
        "Не изисква планиране"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#adaptability", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Неочаквана криза нарушава времевия график на проект. Според урока, какво трябва да се направи?",
      options: [
        "Да се изостави проектът",
        "Да се оцени ситуацията, да се адаптира планът бързо, да се научи необходимото и да се коригират времевите графици, като се поддържа напредък",
        "Да се игнорира кризата",
        "Да се изчака да се разреши"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#crisis-management", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Искате да подобрите способността си да се справяте с неочаквани предизвикателства. Според урока, какво трябва да развиете?",
      options: [
        "Само твърди планове",
        "Гъвкави мисловни модели, бързи умения за учене, систематични процеси на адаптация и рамки за реагиране на кризи",
        "Само умения за учене",
        "Само гъвкаво мислене"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#adaptability", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Екип последователно се проваля, когато настъпват неочаквани промени, водещи до забавяния на проекти и фрустрация. Според рамката на урока, какъв е основният проблем?",
      options: [
        "Няма достатъчно планиране",
        "Липса на адаптивност - липсват гъвкаво мислене, бързи способности за учене и процеси на адаптация, които позволяват ефективен отговор на неочаквани предизвикателства",
        "Твърде много гъвкавост",
        "Адаптивността е ненужна"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#adaptability", "#advanced", "#critical-thinking", "#bg", "#all-languages"]
    }
  ],
  // Polish (PL) - Professional translations
  PL: [
    {
      question: "Według lekcji, czym jest adaptacyjność w produktywności?",
      options: [
        "Trzymanie się jednego planu",
        "Zdolność do dostosowania się do nieoczekiwanych zmian, szybkiego uczenia się i utrzymania skuteczności",
        "Unikanie wszystkich zmian",
        "Tylko w nagłych wypadkach"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#adaptability", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, dlaczego szybkie uczenie się jest ważne w zarządzaniu kryzysowym?",
      options: [
        "Nie jest ważne",
        "Umożliwia szybką reakcję, zmniejsza przestoje i utrzymuje produktywność podczas nieoczekiwanych wyzwań",
        "Dotyczy tylko niektórych sytuacji",
        "Nie wymaga wysiłku"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#crisis-management", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, co jest niezbędne do skutecznej adaptacji?",
      options: [
        "Ignorowanie zmian",
        "Elastyczne myślenie, szybkie uczenie się i systematyczna korekta planów",
        "Trzymanie się oryginalnych planów",
        "Unikanie wszystkich korekt"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#adaptability", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Dlaczego adaptacyjność jest ważna według lekcji?",
      options: [
        "Eliminuje wszystkie wyzwania",
        "Umożliwia reagowanie na nieoczekiwane zmiany, utrzymuje produktywność podczas kryzysów, ułatwia szybkie uczenie się i zapewnia ciągły postęp pomimo zakłóceń",
        "Dotyczy tylko niektórych zawodów",
        "Nie wymaga planowania"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#adaptability", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Nieoczekiwany kryzys zakłóca harmonogram projektu. Według lekcji, co należy zrobić?",
      options: [
        "Porzucić projekt",
        "Ocenić sytuację, szybko dostosować plan, nauczyć się tego, co potrzebne, i dostosować harmonogramy, utrzymując postęp",
        "Zignorować kryzys",
        "Poczekać, aż się rozwiąże"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#crisis-management", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Chcesz poprawić swoją zdolność radzenia sobie z nieoczekiwanymi wyzwaniami. Według lekcji, co powinieneś rozwinąć?",
      options: [
        "Tylko sztywne plany",
        "Elastyczne wzorce myślowe, umiejętności szybkiego uczenia się, systematyczne procesy adaptacji i ramy reagowania na kryzys",
        "Tylko umiejętności uczenia się",
        "Tylko elastyczne myślenie"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#adaptability", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Zespół konsekwentnie zawodzi, gdy występują nieoczekiwane zmiany, prowadząc do opóźnień projektu i frustracji. Według ram lekcji, jaki jest główny problem?",
      options: [
        "Niewystarczające planowanie",
        "Brak adaptacyjności - brakuje elastycznego myślenia, szybkich umiejętności uczenia się i procesów adaptacji, które umożliwiają skuteczną reakcję na nieoczekiwane wyzwania",
        "Zbyt dużo elastyczności",
        "Adaptacyjność jest niepotrzebna"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#adaptability", "#advanced", "#critical-thinking", "#pl", "#all-languages"]
    }
  ],
  // Vietnamese (VI) - Professional translations
  VI: [
    {
      question: "Theo bài học, tính thích ứng trong năng suất là gì?",
      options: [
        "Bám vào một kế hoạch",
        "Khả năng điều chỉnh với những thay đổi bất ngờ, học nhanh và duy trì hiệu quả",
        "Tránh tất cả thay đổi",
        "Chỉ cho trường hợp khẩn cấp"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#adaptability", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, tại sao học nhanh quan trọng trong quản lý khủng hoảng?",
      options: [
        "Nó không quan trọng",
        "Nó cho phép phản ứng nhanh, giảm thời gian chết và duy trì năng suất trong các thách thức bất ngờ",
        "Nó chỉ áp dụng cho một số tình huống",
        "Nó không yêu cầu nỗ lực"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#crisis-management", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, điều gì cần thiết cho thích ứng hiệu quả?",
      options: [
        "Bỏ qua thay đổi",
        "Tư duy linh hoạt, học nhanh và điều chỉnh kế hoạch có hệ thống",
        "Bám vào kế hoạch ban đầu",
        "Tránh tất cả điều chỉnh"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#adaptability", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Tại sao tính thích ứng quan trọng theo bài học?",
      options: [
        "Nó loại bỏ tất cả thách thức",
        "Nó cho phép phản ứng với thay đổi bất ngờ, duy trì năng suất trong khủng hoảng, tạo điều kiện học nhanh và đảm bảo tiến trình tiếp tục bất chấp gián đoạn",
        "Nó chỉ áp dụng cho một số công việc",
        "Nó không yêu cầu lập kế hoạch"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#adaptability", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Một khủng hoảng bất ngờ làm gián đoạn thời gian biểu dự án. Theo bài học, nên làm gì?",
      options: [
        "Từ bỏ dự án",
        "Đánh giá tình huống, thích ứng kế hoạch nhanh chóng, học những gì cần thiết và điều chỉnh thời gian biểu trong khi duy trì tiến trình",
        "Bỏ qua khủng hoảng",
        "Đợi nó tự giải quyết"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#crisis-management", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Bạn muốn cải thiện khả năng xử lý thách thức bất ngờ. Theo bài học, bạn nên phát triển gì?",
      options: [
        "Chỉ kế hoạch cứng nhắc",
        "Mô hình tư duy linh hoạt, kỹ năng học nhanh, quy trình thích ứng có hệ thống và khung phản ứng khủng hoảng",
        "Chỉ kỹ năng học",
        "Chỉ tư duy linh hoạt"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#adaptability", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Một đội liên tục thất bại khi có thay đổi bất ngờ, dẫn đến trì hoãn dự án và thất vọng. Theo khung của bài học, vấn đề cốt lõi là gì?",
      options: [
        "Không đủ lập kế hoạch",
        "Thiếu tính thích ứng - thiếu tư duy linh hoạt, khả năng học nhanh và quy trình thích ứng cho phép phản ứng hiệu quả với thách thức bất ngờ",
        "Quá nhiều tính linh hoạt",
        "Tính thích ứng là không cần thiết"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#adaptability", "#advanced", "#critical-thinking", "#vi", "#all-languages"]
    }
  ],
  // Indonesian (ID) - Professional translations
  ID: [
    {
      question: "Menurut pelajaran, apa itu kemampuan beradaptasi dalam produktivitas?",
      options: [
        "Berpegang pada satu rencana",
        "Kemampuan untuk menyesuaikan diri dengan perubahan tak terduga, belajar cepat, dan mempertahankan efektivitas",
        "Menghindari semua perubahan",
        "Hanya untuk keadaan darurat"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#adaptability", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, mengapa pembelajaran cepat penting dalam manajemen krisis?",
      options: [
        "Tidak penting",
        "Memungkinkan respons cepat, mengurangi downtime, dan mempertahankan produktivitas selama tantangan tak terduga",
        "Hanya berlaku untuk situasi tertentu",
        "Tidak memerlukan upaya"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#crisis-management", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, apa yang penting untuk adaptasi yang efektif?",
      options: [
        "Mengabaikan perubahan",
        "Pemikiran fleksibel, pembelajaran cepat, dan penyesuaian rencana secara sistematis",
        "Berpegang pada rencana asli",
        "Menghindari semua penyesuaian"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#adaptability", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Mengapa kemampuan beradaptasi penting menurut pelajaran?",
      options: [
        "Ini menghilangkan semua tantangan",
        "Ini memungkinkan respons terhadap perubahan tak terduga, mempertahankan produktivitas selama krisis, memfasilitasi pembelajaran cepat, dan memastikan kemajuan berkelanjutan meskipun ada gangguan",
        "Ini hanya berlaku untuk pekerjaan tertentu",
        "Ini tidak memerlukan perencanaan"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#adaptability", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Krisis tak terduga mengganggu timeline proyek. Menurut pelajaran, apa yang harus dilakukan?",
      options: [
        "Tinggalkan proyek",
        "Nilai situasi, sesuaikan rencana dengan cepat, pelajari yang diperlukan, dan sesuaikan timeline sambil mempertahankan kemajuan",
        "Abaikan krisis",
        "Tunggu sampai terselesaikan"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#crisis-management", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Anda ingin meningkatkan kemampuan Anda menangani tantangan tak terduga. Menurut pelajaran, apa yang harus Anda kembangkan?",
      options: [
        "Hanya rencana kaku",
        "Pola pemikiran fleksibel, keterampilan pembelajaran cepat, proses adaptasi sistematis, dan kerangka respons krisis",
        "Hanya keterampilan pembelajaran",
        "Hanya pemikiran fleksibel"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#adaptability", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Tim secara konsisten gagal ketika perubahan tak terduga terjadi, menyebabkan penundaan proyek dan frustrasi. Menurut kerangka pelajaran, apa masalah intinya?",
      options: [
        "Tidak cukup perencanaan",
        "Kurangnya kemampuan beradaptasi - kurang pemikiran fleksibel, kemampuan pembelajaran cepat, dan proses adaptasi yang memungkinkan respons efektif terhadap tantangan tak terduga",
        "Terlalu banyak fleksibilitas",
        "Kemampuan beradaptasi tidak perlu"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#adaptability", "#advanced", "#critical-thinking", "#id", "#all-languages"]
    }
  ],
  // Arabic (AR) - Professional translations (RTL)
  AR: [
    {
      question: "وفقًا للدرس، ما هي القدرة على التكيف في الإنتاجية?",
      options: [
        "الالتزام بخطة واحدة",
        "القدرة على التكيف مع التغييرات غير المتوقعة، التعلم السريع، والحفاظ على الفعالية",
        "تجنب جميع التغييرات",
        "فقط لحالات الطوارئ"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#adaptability", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، لماذا التعلم السريع مهم في إدارة الأزمات?",
      options: [
        "ليس مهمًا",
        "يتيح الاستجابة السريعة، يقلل وقت التوقف، ويحافظ على الإنتاجية أثناء التحديات غير المتوقعة",
        "ينطبق فقط على حالات معينة",
        "لا يتطلب جهد"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#crisis-management", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، ما هو ضروري للتكيف الفعال?",
      options: [
        "تجاهل التغييرات",
        "التفكير المرن، التعلم السريع، والتعديل المنهجي للخطط",
        "الالتزام بالخطط الأصلية",
        "تجنب جميع التعديلات"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#adaptability", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "لماذا القدرة على التكيف مهمة وفقًا للدرس?",
      options: [
        "إنها تلغي جميع التحديات",
        "إنها تمكن من الاستجابة للتغييرات غير المتوقعة، تحافظ على الإنتاجية أثناء الأزمات، تسهل التعلم السريع، وتضمن التقدم المستمر رغم الاضطرابات",
        "تنطبق فقط على وظائف معينة",
        "لا تتطلب تخطيطًا"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#adaptability", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "أزمة غير متوقعة تعطل الجدول الزمني للمشروع. وفقًا للدرس، ماذا يجب أن يتم?",
      options: [
        "التخلي عن المشروع",
        "تقييم الوضع، التكيف مع الخطة بسرعة، تعلم ما هو مطلوب، وتعديل الجداول الزمنية مع الحفاظ على التقدم",
        "تجاهل الأزمة",
        "انتظار حلها"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#crisis-management", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "تريد تحسين قدرتك على التعامل مع التحديات غير المتوقعة. وفقًا للدرس، ماذا يجب أن تطور?",
      options: [
        "فقط خطط جامدة",
        "أنماط التفكير المرنة، مهارات التعلم السريع، عمليات التكيف المنهجية، وأطر الاستجابة للأزمات",
        "فقط مهارات التعلم",
        "فقط التفكير المرن"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#adaptability", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "فريق يفشل باستمرار عندما تحدث تغييرات غير متوقعة، مما يؤدي إلى تأخيرات المشروع والإحباط. وفقًا لإطار الدرس، ما هي المشكلة الأساسية?",
      options: [
        "لا يوجد تخطيط كافٍ",
        "نقص القدرة على التكيف - نقص التفكير المرن، قدرات التعلم السريع، وعمليات التكيف التي تمكن من الاستجابة الفعالة للتحديات غير المتوقعة",
        "الكثير من المرونة",
        "القدرة على التكيف غير ضرورية"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#adaptability", "#advanced", "#critical-thinking", "#ar", "#all-languages"]
    }
  ],
  // Portuguese (PT) - Professional translations (Brazilian)
  PT: [
    {
      question: "De acordo com a lição, o que é adaptabilidade na produtividade?",
      options: [
        "Aderir a um plano",
        "A capacidade de se ajustar a mudanças inesperadas, aprender rapidamente e manter a eficácia",
        "Evitar todas as mudanças",
        "Apenas para emergências"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#adaptability", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, por que o aprendizado rápido é importante no gerenciamento de crise?",
      options: [
        "Não é importante",
        "Permite resposta rápida, reduz tempo de inatividade e mantém produtividade durante desafios inesperados",
        "Aplica-se apenas a certas situações",
        "Não requer esforço"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#crisis-management", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, o que é essencial para adaptação eficaz?",
      options: [
        "Ignorar mudanças",
        "Pensamento flexível, aprendizado rápido e ajuste sistemático de planos",
        "Aderir aos planos originais",
        "Evitar todos os ajustes"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#adaptability", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "Por que adaptabilidade é importante de acordo com a lição?",
      options: [
        "Elimina todos os desafios",
        "Permite resposta a mudanças inesperadas, mantém produtividade durante crises, facilita aprendizado rápido e garante progresso contínuo apesar de interrupções",
        "Aplica-se apenas a certos trabalhos",
        "Não requer planejamento"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#adaptability", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Uma crise inesperada interrompe o cronograma de um projeto. De acordo com a lição, o que deve ser feito?",
      options: [
        "Abandonar o projeto",
        "Avaliar a situação, adaptar o plano rapidamente, aprender o necessário e ajustar cronogramas mantendo o progresso",
        "Ignorar a crise",
        "Esperar que se resolva"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#crisis-management", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Você quer melhorar sua capacidade de lidar com desafios inesperados. De acordo com a lição, o que você deve desenvolver?",
      options: [
        "Apenas planos rígidos",
        "Padrões de pensamento flexíveis, habilidades de aprendizado rápido, processos de adaptação sistemáticos e estruturas de resposta a crises",
        "Apenas habilidades de aprendizado",
        "Apenas pensamento flexível"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#adaptability", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Uma equipe consistentemente falha quando mudanças inesperadas ocorrem, levando a atrasos no projeto e frustração. De acordo com a estrutura da lição, qual é o problema central?",
      options: [
        "Não há planejamento suficiente",
        "Falta de adaptabilidade - falta pensamento flexível, capacidades de aprendizado rápido e processos de adaptação que permitem resposta eficaz a desafios inesperados",
        "Muita flexibilidade",
        "Adaptabilidade é desnecessária"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#adaptability", "#advanced", "#critical-thinking", "#pt", "#all-languages"]
    }
  ],
  // Hindi (HI) - Professional translations
  HI: [
    {
      question: "पाठ के अनुसार, उत्पादकता में अनुकूलनशीलता क्या है?",
      options: [
        "एक योजना से चिपके रहना",
        "अप्रत्याशित परिवर्तनों के अनुकूल होने, तेजी से सीखने और प्रभावशीलता बनाए रखने की क्षमता",
        "सभी परिवर्तनों से बचना",
        "केवल आपातकाल के लिए"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#adaptability", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, संकट प्रबंधन में तेजी से सीखना क्यों महत्वपूर्ण है?",
      options: [
        "यह महत्वपूर्ण नहीं है",
        "यह त्वरित प्रतिक्रिया सक्षम करता है, डाउनटाइम कम करता है, और अप्रत्याशित चुनौतियों के दौरान उत्पादकता बनाए रखता है",
        "यह केवल कुछ स्थितियों पर लागू होता है",
        "इसके लिए प्रयास की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#crisis-management", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, प्रभावी अनुकूलन के लिए क्या आवश्यक है?",
      options: [
        "परिवर्तनों को अनदेखा करना",
        "लचीला सोच, तेजी से सीखना, और योजनाओं का व्यवस्थित समायोजन",
        "मूल योजनाओं से चिपके रहना",
        "सभी समायोजन से बचना"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#adaptability", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार अनुकूलनशीलता क्यों महत्वपूर्ण है?",
      options: [
        "यह सभी चुनौतियों को समाप्त करता है",
        "यह अप्रत्याशित परिवर्तनों पर प्रतिक्रिया करने, संकट के दौरान उत्पादकता बनाए रखने, तेजी से सीखने को सुविधाजनक बनाने और व्यवधानों के बावजूद निरंतर प्रगति सुनिश्चित करने में सक्षम बनाता है",
        "यह केवल कुछ नौकरियों पर लागू होता है",
        "इसके लिए योजना की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#adaptability", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक अप्रत्याशित संकट एक परियोजना समयसीमा को बाधित करता है। पाठ के अनुसार, क्या करना चाहिए?",
      options: [
        "परियोजना को छोड़ दें",
        "स्थिति का आकलन करें, योजना को तुरंत अनुकूलित करें, आवश्यक सीखें, और प्रगति बनाए रखते हुए समयसीमा समायोजित करें",
        "संकट को अनदेखा करें",
        "इसके हल होने की प्रतीक्षा करें"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#crisis-management", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "आप अप्रत्याशित चुनौतियों से निपटने की अपनी क्षमता में सुधार करना चाहते हैं। पाठ के अनुसार, आपको क्या विकसित करना चाहिए?",
      options: [
        "केवल कठोर योजनाएं",
        "लचीला सोच पैटर्न, तेजी से सीखने के कौशल, व्यवस्थित अनुकूलन प्रक्रियाएं, और संकट प्रतिक्रिया ढांचे",
        "केवल सीखने के कौशल",
        "केवल लचीला सोच"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#adaptability", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक टीम लगातार विफल होती है जब अप्रत्याशित परिवर्तन होते हैं, जिससे परियोजना में देरी और निराशा होती है। पाठ के ढांचे के अनुसार, मुख्य समस्या क्या है?",
      options: [
        "पर्याप्त योजना नहीं है",
        "अनुकूलनशीलता की कमी - लचीला सोच, तेजी से सीखने की क्षमताएं, और अनुकूलन प्रक्रियाएं जो अप्रत्याशित चुनौतियों पर प्रभावी प्रतिक्रिया सक्षम करती हैं गायब हैं",
        "बहुत अधिक लचीलापन",
        "अनुकूलनशीलता अनावश्यक है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#adaptability", "#advanced", "#critical-thinking", "#hi", "#all-languages"]
    }
  ]
};

async function seedDay18Enhanced() {
  try {
    await connectDB();
    console.log('🌱 SEEDING DAY 18 ENHANCED QUIZ QUESTIONS\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    let totalQuestions = 0;
    let totalUpdated = 0;
    let totalCreated = 0;

    for (const lang of LANGUAGES) {
      const courseId = `${COURSE_ID_BASE}_${lang}`;
      const lessonId = `${COURSE_ID_BASE}_${lang}_DAY_18`;

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
      const questions = DAY18_QUESTIONS[lang];
      
      if (!questions || questions.length === 0) {
        console.error(`   ❌ ERROR: No questions defined for ${lang}! Questions MUST be in course language.`);
        throw new Error(`Missing translations for ${lang} - Day 18 questions must be in course language, not English fallback`);
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
    console.log(`\n✅ DAY 18 ENHANCEMENT COMPLETE!\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedDay18Enhanced();
