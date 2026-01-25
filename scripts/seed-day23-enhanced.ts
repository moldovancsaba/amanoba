/**
 * Seed Day 23 Enhanced Quiz Questions
 * 
 * Purpose: Enhance Day 23 quizzes from 5 to 7 questions across all 10 languages
 * Why: Part of Quiz Quality Enhancement - Phase 1, Day 23
 * 
 * Lesson Topic: Creativity and Innovation (rethinking, experimentation)
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
const DAY_NUMBER = 23;
const LANGUAGES = ['HU', 'EN', 'TR', 'BG', 'PL', 'VI', 'ID', 'AR', 'PT', 'HI'];

/**
 * Day 23 Enhanced Questions - All Languages
 * Topic: Creativity and Innovation
 * Structure: 7 questions per language
 * Q1-Q3: Recall (foundational concepts)
 * Q4: Application (why creativity matters)
 * Q5: Application (scenario-based)
 * Q6: Application (practical implementation)
 * Q7: Critical Thinking (systems integration)
 */
const DAY23_QUESTIONS: Record<string, Array<{
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: QuestionDifficulty;
  category: string;
  questionType: QuestionType;
  hashtags: string[];
}>> = {
  EN: [
    // Q1: Creativity definition (RECALL)
    {
      question: "According to the lesson, what is creativity in the context of productivity?",
      options: [
        "Only artistic expression",
        "The ability to rethink approaches, find new solutions, and break patterns that limit productivity",
        "Only for creative professionals",
        "It's not relevant to productivity"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Creativity",
      questionType: QuestionType.RECALL,
      hashtags: ["#creativity", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q2: Experimentation benefit (RECALL)
    {
      question: "According to the lesson, why is experimentation important?",
      options: [
        "It's not important",
        "It allows testing new approaches, discovering better methods, and avoiding stagnation",
        "It only applies to research",
        "It requires no effort"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Innovation",
      questionType: QuestionType.RECALL,
      hashtags: ["#innovation", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q3: Rethinking approaches (RECALL)
    {
      question: "According to the lesson, what does 'rethinking' mean in productivity?",
      options: [
        "Forgetting everything",
        "Questioning existing methods, challenging assumptions, and exploring alternative approaches",
        "Only changing tools",
        "No structure needed"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Creativity",
      questionType: QuestionType.RECALL,
      hashtags: ["#creativity", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q4: Why creativity matters (APPLICATION)
    {
      question: "Why are creativity and innovation important for productivity according to the lesson?",
      options: [
        "They eliminate all structure",
        "They enable finding better solutions, breaking limiting patterns, adapting to change, and discovering more efficient approaches",
        "They only apply to certain jobs",
        "They require no planning"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Creativity",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#creativity", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q5: Problem-solving scenario (APPLICATION)
    {
      question: "You face a recurring productivity challenge. According to the lesson, what should you do?",
      options: [
        "Accept it as normal",
        "Rethink the approach, experiment with new methods, and challenge assumptions about the current process",
        "Only work harder",
        "Ignore the challenge"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Creativity",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#creativity", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q6: Building creative process (APPLICATION)
    {
      question: "You want to integrate creativity into your work. According to the lesson, what should you establish?",
      options: [
        "Just work randomly",
        "Regular experimentation time, questioning of assumptions, openness to new approaches, and a process for testing and refining ideas",
        "Only artistic activities",
        "Only brainstorming sessions"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Creativity",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#creativity", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q7: Stagnation analysis (CRITICAL THINKING)
    {
      question: "A person follows the same methods for years, productivity plateaus, and no improvements are found. According to the lesson's framework, what is the core issue?",
      options: [
        "Not enough routine",
        "Lack of creativity and innovation - missing experimentation, rethinking approaches, and challenging assumptions that enable breakthrough solutions",
        "Too much creativity",
        "Creativity is unnecessary"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Creativity",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#creativity", "#advanced", "#critical-thinking", "#en", "#all-languages"]
    }
  ],
  // Hungarian (HU) - Professional translations
  HU: [
    {
      question: "A lecke szerint mi a kreativitás a termelékenység kontextusában?",
      options: [
        "Csak művészi kifejezés",
        "A képesség újragondolni a megközelítéseket, új megoldásokat találni, és megtörni a termelékenységet korlátozó mintákat",
        "Csak kreatív szakembereknek",
        "Nem releváns a termelékenységhez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Kreativitás",
      questionType: QuestionType.RECALL,
      hashtags: ["#creativity", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint miért fontos a kísérletezés?",
      options: [
        "Nem fontos",
        "Lehetővé teszi az új megközelítések tesztelését, jobb módszerek felfedezését, és a stagnálás elkerülését",
        "Csak kutatásra vonatkozik",
        "Nem igényel erőfeszítést"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Innováció",
      questionType: QuestionType.RECALL,
      hashtags: ["#innovation", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint mit jelent az 'újragondolás' a termelékenységben?",
      options: [
        "Minden elfelejtése",
        "Megkérdőjelezni a meglévő módszereket, kihívni a feltételezéseket, és alternatív megközelítéseket felfedezni",
        "Csak eszközök változtatása",
        "Nincs szükség struktúrára"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Kreativitás",
      questionType: QuestionType.RECALL,
      hashtags: ["#creativity", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "Miért fontosak a kreativitás és az innováció a termelékenységhez a lecke szerint?",
      options: [
        "Kiküszöbölik az összes struktúrát",
        "Lehetővé teszik a jobb megoldások megtalálását, a korlátozó minták megtörését, az alkalmazkodást a változáshoz, és hatékonyabb megközelítések felfedezését",
        "Csak bizonyos munkákra vonatkoznak",
        "Nem igényelnek tervezést"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Kreativitás",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#creativity", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Ismétlődő termelékenységi kihívással szembesülsz. A lecke szerint mit kellene tenned?",
      options: [
        "Fogadd el normálként",
        "Újragondold a megközelítést, kísérletezz új módszerekkel, és kérdőjelezd meg a jelenlegi folyamatról szóló feltételezéseket",
        "Csak dolgozz keményebben",
        "Hagyd figyelmen kívül a kihívást"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Kreativitás",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#creativity", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Integrálni szeretnéd a kreativitást a munkádba. A lecke szerint mit kellene létrehozni?",
      options: [
        "Csak dolgozz véletlenszerűen",
        "Rendszeres kísérletezési idő, feltételezések megkérdőjelezése, nyitottság az új megközelítésekre, és egy folyamat az ötletek tesztelésére és finomítására",
        "Csak művészi tevékenységek",
        "Csak brainstorming ülések"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Kreativitás",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#creativity", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy személy évekig ugyanazokat a módszereket követi, a termelékenység stagnál, és nem találhatók javítások. A lecke keretrendszere szerint mi a fő probléma?",
      options: [
        "Nincs elég rutin",
        "Hiányzik a kreativitás és az innováció - hiányoznak a kísérletezés, megközelítések újragondolása, és feltételezések kihívása, amelyek áttörő megoldásokat tesznek lehetővé",
        "Túl sok kreativitás",
        "A kreativitás felesleges"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Kreativitás",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#creativity", "#advanced", "#critical-thinking", "#hu", "#all-languages"]
    }
  ],
  // Turkish (TR) - Professional translations
  TR: [
    {
      question: "Derse göre verimlilik bağlamında yaratıcılık nedir?",
      options: [
        "Sadece sanatsal ifade",
        "Yaklaşımları yeniden düşünme, yeni çözümler bulma ve verimliliği sınırlayan kalıpları kırma yeteneği",
        "Sadece yaratıcı profesyoneller için",
        "Verimlilikle ilgili değil"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Yaratıcılık",
      questionType: QuestionType.RECALL,
      hashtags: ["#creativity", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre deney yapmak neden önemlidir?",
      options: [
        "Önemli değil",
        "Yeni yaklaşımları test etmeye, daha iyi yöntemler keşfetmeye ve durgunluktan kaçınmaya izin verir",
        "Sadece araştırmaya uygulanır",
        "Çaba gerektirmez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Yenilik",
      questionType: QuestionType.RECALL,
      hashtags: ["#innovation", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre verimlilikte 'yeniden düşünme' ne anlama gelir?",
      options: [
        "Her şeyi unutmak",
        "Mevcut yöntemleri sorgulamak, varsayımları sorgulamak ve alternatif yaklaşımları keşfetmek",
        "Sadece araçları değiştirmek",
        "Yapı gerekmez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Yaratıcılık",
      questionType: QuestionType.RECALL,
      hashtags: ["#creativity", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre yaratıcılık ve yenilik verimlilik için neden önemlidir?",
      options: [
        "Tüm yapıyı ortadan kaldırırlar",
        "Daha iyi çözümler bulmayı, sınırlayıcı kalıpları kırmayı, değişime uyum sağlamayı ve daha verimli yaklaşımlar keşfetmeyi sağlarlar",
        "Sadece belirli işlere uygulanırlar",
        "Planlama gerektirmezler"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Yaratıcılık",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#creativity", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Tekrarlayan bir verimlilik zorluğuyla karşılaşıyorsun. Derse göre ne yapmalısın?",
      options: [
        "Bunu normal olarak kabul et",
        "Yaklaşımı yeniden düşün, yeni yöntemlerle dene ve mevcut süreç hakkındaki varsayımları sorgula",
        "Sadece daha çok çalış",
        "Zorluğu görmezden gel"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Yaratıcılık",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#creativity", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Yaratıcılığı işine entegre etmek istiyorsun. Derse göre ne kurmalısın?",
      options: [
        "Sadece rastgele çalış",
        "Düzenli deney zamanı, varsayımların sorgulanması, yeni yaklaşımlara açıklık ve fikirleri test etme ve iyileştirme süreci",
        "Sadece sanatsal aktiviteler",
        "Sadece beyin fırtınası oturumları"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Yaratıcılık",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#creativity", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir kişi yıllarca aynı yöntemleri takip ediyor, verimlilik durgunlaşıyor ve hiçbir iyileştirme bulunamıyor. Derse göre temel sorun nedir?",
      options: [
        "Yeterli rutin yok",
        "Yaratıcılık ve yenilik eksikliği - atılım çözümlerini mümkün kılan deney, yaklaşımları yeniden düşünme ve varsayımları sorgulama eksik",
        "Çok fazla yaratıcılık",
        "Yaratıcılık gereksiz"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Yaratıcılık",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#creativity", "#advanced", "#critical-thinking", "#tr", "#all-languages"]
    }
  ],
  // Bulgarian (BG) - Professional translations
  BG: [
    {
      question: "Според урока, какво е креативността в контекста на производителност?",
      options: [
        "Само художествен израз",
        "Способността да преосмисляш подходите, да намираш нови решения и да разбиваш модели, които ограничават производителността",
        "Само за креативни професионалисти",
        "Не е релевантна за производителност"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Креативност",
      questionType: QuestionType.RECALL,
      hashtags: ["#creativity", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, защо експериментирането е важно?",
      options: [
        "Не е важно",
        "Позволява тестване на нови подходи, откриване на по-добри методи и избягване на застой",
        "Прилага се само за изследвания",
        "Не изисква усилие"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Иновация",
      questionType: QuestionType.RECALL,
      hashtags: ["#innovation", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, какво означава 'преосмисляне' в производителността?",
      options: [
        "Забравяне на всичко",
        "Подлагане на съмнение на съществуващите методи, предизвикване на предположения и изследване на алтернативни подходи",
        "Само промяна на инструменти",
        "Няма нужда от структура"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Креативност",
      questionType: QuestionType.RECALL,
      hashtags: ["#creativity", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Защо креативността и иновацията са важни за производителността според урока?",
      options: [
        "Премахват цялата структура",
        "Позволяват намиране на по-добри решения, разбиване на ограничаващи модели, адаптиране към промяна и откриване на по-ефективни подходи",
        "Прилагат се само за определени работи",
        "Не изискват планиране"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Креативност",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#creativity", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Сблъскваш се с повтарящо се предизвикателство за производителност. Според урока, какво трябва да направиш?",
      options: [
        "Приеми го като нормално",
        "Преосмисли подхода, експериментирай с нови методи и предизвикай предположенията за текущия процес",
        "Само работи по-усърдно",
        "Игнорирай предизвикателството"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Креативност",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#creativity", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Искаш да интегрираш креативност в работата си. Според урока, какво трябва да установиш?",
      options: [
        "Просто работи на случаен принцип",
        "Редовно време за експериментиране, подлагане на съмнение на предположения, отвореност към нови подходи и процес за тестване и усъвършенстване на идеи",
        "Само художествени дейности",
        "Само сесии за мозъчна атака"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Креативност",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#creativity", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Човек следва същите методи години наред, производителността стагнира и не се намират подобрения. Според рамката на урока, какъв е основният проблем?",
      options: [
        "Няма достатъчно рутина",
        "Липса на креативност и иновация - липсват експериментиране, преосмисляне на подходи и предизвикване на предположения, които позволяват пробивни решения",
        "Твърде много креативност",
        "Креативността е ненужна"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Креативност",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#creativity", "#advanced", "#critical-thinking", "#bg", "#all-languages"]
    }
  ],
  // Polish (PL) - Professional translations
  PL: [
    {
      question: "Według lekcji, czym jest kreatywność w kontekście produktywności?",
      options: [
        "Tylko ekspresja artystyczna",
        "Zdolność do przemyślenia podejść, znalezienia nowych rozwiązań i przełamania wzorców ograniczających produktywność",
        "Tylko dla profesjonalistów kreatywnych",
        "Nie jest istotna dla produktywności"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Kreatywność",
      questionType: QuestionType.RECALL,
      hashtags: ["#creativity", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, dlaczego eksperymentowanie jest ważne?",
      options: [
        "Nie jest ważne",
        "Pozwala testować nowe podejścia, odkrywać lepsze metody i unikać stagnacji",
        "Stosuje się tylko do badań",
        "Nie wymaga wysiłku"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Innowacja",
      questionType: QuestionType.RECALL,
      hashtags: ["#innovation", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, co oznacza 'przemyślenie' w produktywności?",
      options: [
        "Zapomnienie wszystkiego",
        "Kwestionowanie istniejących metod, podważanie założeń i odkrywanie alternatywnych podejść",
        "Tylko zmiana narzędzi",
        "Struktura nie jest potrzebna"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Kreatywność",
      questionType: QuestionType.RECALL,
      hashtags: ["#creativity", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Dlaczego kreatywność i innowacja są ważne dla produktywności według lekcji?",
      options: [
        "Eliminują całą strukturę",
        "Umożliwiają znalezienie lepszych rozwiązań, przełamanie ograniczających wzorców, adaptację do zmian i odkrycie bardziej efektywnych podejść",
        "Stosują się tylko do określonych prac",
        "Nie wymagają planowania"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Kreatywność",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#creativity", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Stoisz przed powtarzającym się wyzwaniem produktywności. Według lekcji, co powinieneś zrobić?",
      options: [
        "Zaakceptuj to jako normalne",
        "Przemyśl podejście, eksperymentuj z nowymi metodami i kwestionuj założenia dotyczące obecnego procesu",
        "Tylko pracuj ciężej",
        "Zignoruj wyzwanie"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Kreatywność",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#creativity", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Chcesz zintegrować kreatywność ze swoją pracą. Według lekcji, co powinieneś ustanowić?",
      options: [
        "Po prostu pracuj losowo",
        "Regularny czas na eksperymenty, kwestionowanie założeń, otwartość na nowe podejścia i proces testowania i udoskonalania pomysłów",
        "Tylko działania artystyczne",
        "Tylko sesje burzy mózgów"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Kreatywność",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#creativity", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Osoba stosuje te same metody przez lata, produktywność stagnuje i nie znajduje się żadnych ulepszeń. Według ram lekcji, jaki jest główny problem?",
      options: [
        "Nie ma wystarczającej rutyny",
        "Brak kreatywności i innowacji - brakuje eksperymentowania, przemyślenia podejść i podważania założeń, które umożliwiają przełomowe rozwiązania",
        "Zbyt dużo kreatywności",
        "Kreatywność jest niepotrzebna"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Kreatywność",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#creativity", "#advanced", "#critical-thinking", "#pl", "#all-languages"]
    }
  ],
  // Vietnamese (VI) - Professional translations
  VI: [
    {
      question: "Theo bài học, sáng tạo trong bối cảnh năng suất là gì?",
      options: [
        "Chỉ biểu hiện nghệ thuật",
        "Khả năng tái suy nghĩ các cách tiếp cận, tìm giải pháp mới, và phá vỡ các mẫu hạn chế năng suất",
        "Chỉ dành cho các chuyên gia sáng tạo",
        "Không liên quan đến năng suất"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Sáng Tạo",
      questionType: QuestionType.RECALL,
      hashtags: ["#creativity", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, tại sao thí nghiệm quan trọng?",
      options: [
        "Nó không quan trọng",
        "Nó cho phép thử nghiệm các cách tiếp cận mới, khám phá phương pháp tốt hơn, và tránh trì trệ",
        "Nó chỉ áp dụng cho nghiên cứu",
        "Nó không yêu cầu nỗ lực"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Đổi Mới",
      questionType: QuestionType.RECALL,
      hashtags: ["#innovation", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, 'tái suy nghĩ' trong năng suất có nghĩa là gì?",
      options: [
        "Quên tất cả",
        "Đặt câu hỏi về các phương pháp hiện có, thách thức các giả định, và khám phá các cách tiếp cận thay thế",
        "Chỉ thay đổi công cụ",
        "Không cần cấu trúc"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Sáng Tạo",
      questionType: QuestionType.RECALL,
      hashtags: ["#creativity", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Tại sao sáng tạo và đổi mới quan trọng cho năng suất theo bài học?",
      options: [
        "Chúng loại bỏ tất cả cấu trúc",
        "Chúng cho phép tìm giải pháp tốt hơn, phá vỡ các mẫu hạn chế, thích ứng với thay đổi, và khám phá các cách tiếp cận hiệu quả hơn",
        "Chúng chỉ áp dụng cho một số công việc",
        "Chúng không yêu cầu lập kế hoạch"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Sáng Tạo",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#creativity", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Bạn đối mặt với một thách thức năng suất lặp lại. Theo bài học, bạn nên làm gì?",
      options: [
        "Chấp nhận nó như bình thường",
        "Tái suy nghĩ cách tiếp cận, thí nghiệm với phương pháp mới, và thách thức các giả định về quy trình hiện tại",
        "Chỉ làm việc chăm chỉ hơn",
        "Bỏ qua thách thức"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Sáng Tạo",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#creativity", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Bạn muốn tích hợp sáng tạo vào công việc của mình. Theo bài học, bạn nên thiết lập gì?",
      options: [
        "Chỉ làm việc ngẫu nhiên",
        "Thời gian thí nghiệm thường xuyên, đặt câu hỏi về giả định, cởi mở với cách tiếp cận mới, và quy trình để thử nghiệm và tinh chỉnh ý tưởng",
        "Chỉ các hoạt động nghệ thuật",
        "Chỉ các phiên động não"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Sáng Tạo",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#creativity", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Một người theo cùng các phương pháp trong nhiều năm, năng suất đình trệ, và không tìm thấy cải thiện. Theo khung của bài học, vấn đề cốt lõi là gì?",
      options: [
        "Không đủ thói quen",
        "Thiếu sáng tạo và đổi mới - thiếu thí nghiệm, tái suy nghĩ cách tiếp cận, và thách thức giả định cho phép giải pháp đột phá",
        "Quá nhiều sáng tạo",
        "Sáng tạo là không cần thiết"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Sáng Tạo",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#creativity", "#advanced", "#critical-thinking", "#vi", "#all-languages"]
    }
  ],
  // Indonesian (ID) - Professional translations
  ID: [
    {
      question: "Menurut pelajaran, apa itu kreativitas dalam konteks produktivitas?",
      options: [
        "Hanya ekspresi artistik",
        "Kemampuan untuk memikirkan kembali pendekatan, menemukan solusi baru, dan memecahkan pola yang membatasi produktivitas",
        "Hanya untuk profesional kreatif",
        "Tidak relevan dengan produktivitas"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Kreativitas",
      questionType: QuestionType.RECALL,
      hashtags: ["#creativity", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, mengapa eksperimen penting?",
      options: [
        "Tidak penting",
        "Memungkinkan pengujian pendekatan baru, menemukan metode yang lebih baik, dan menghindari stagnasi",
        "Hanya berlaku untuk penelitian",
        "Tidak memerlukan upaya"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Inovasi",
      questionType: QuestionType.RECALL,
      hashtags: ["#innovation", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, apa arti 'pemikiran ulang' dalam produktivitas?",
      options: [
        "Melupakan segalanya",
        "Mempertanyakan metode yang ada, menantang asumsi, dan mengeksplorasi pendekatan alternatif",
        "Hanya mengubah alat",
        "Tidak perlu struktur"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Kreativitas",
      questionType: QuestionType.RECALL,
      hashtags: ["#creativity", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Mengapa kreativitas dan inovasi penting untuk produktivitas menurut pelajaran?",
      options: [
        "Mereka menghilangkan semua struktur",
        "Mereka memungkinkan menemukan solusi yang lebih baik, memecahkan pola yang membatasi, beradaptasi dengan perubahan, dan menemukan pendekatan yang lebih efisien",
        "Mereka hanya berlaku untuk pekerjaan tertentu",
        "Mereka tidak memerlukan perencanaan"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Kreativitas",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#creativity", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Anda menghadapi tantangan produktivitas yang berulang. Menurut pelajaran, apa yang harus Anda lakukan?",
      options: [
        "Terima sebagai normal",
        "Pikirkan kembali pendekatan, bereksperimen dengan metode baru, dan tantang asumsi tentang proses saat ini",
        "Hanya bekerja lebih keras",
        "Abaikan tantangan"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Kreativitas",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#creativity", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Anda ingin mengintegrasikan kreativitas ke dalam pekerjaan Anda. Menurut pelajaran, apa yang harus Anda tetapkan?",
      options: [
        "Hanya bekerja secara acak",
        "Waktu eksperimen rutin, mempertanyakan asumsi, keterbukaan terhadap pendekatan baru, dan proses untuk menguji dan menyempurnakan ide",
        "Hanya aktivitas artistik",
        "Hanya sesi brainstorming"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Kreativitas",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#creativity", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Seseorang mengikuti metode yang sama selama bertahun-tahun, produktivitas stagnan, dan tidak ada perbaikan yang ditemukan. Menurut kerangka pelajaran, apa masalah intinya?",
      options: [
        "Tidak ada rutinitas yang cukup",
        "Kurangnya kreativitas dan inovasi - kurang eksperimen, pemikiran ulang pendekatan, dan menantang asumsi yang memungkinkan solusi terobosan",
        "Terlalu banyak kreativitas",
        "Kreativitas tidak perlu"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Kreativitas",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#creativity", "#advanced", "#critical-thinking", "#id", "#all-languages"]
    }
  ],
  // Arabic (AR) - Professional translations (RTL)
  AR: [
    {
      question: "وفقًا للدرس، ما هي الإبداع في سياق الإنتاجية?",
      options: [
        "فقط التعبير الفني",
        "القدرة على إعادة التفكير في الأساليب، والعثور على حلول جديدة، وكسر الأنماط التي تحد من الإنتاجية",
        "فقط للمهنيين المبدعين",
        "ليست ذات صلة بالإنتاجية"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "الإبداع",
      questionType: QuestionType.RECALL,
      hashtags: ["#creativity", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، لماذا التجريب مهم?",
      options: [
        "ليس مهمًا",
        "يسمح باختبار أساليب جديدة، واكتشاف طرق أفضل، وتجنب الركود",
        "ينطبق فقط على البحث",
        "لا يتطلب جهدًا"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "الابتكار",
      questionType: QuestionType.RECALL,
      hashtags: ["#innovation", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، ماذا يعني 'إعادة التفكير' في الإنتاجية?",
      options: [
        "نسيان كل شيء",
        "التشكيك في الأساليب الموجودة، وتحدي الافتراضات، واستكشاف أساليب بديلة",
        "فقط تغيير الأدوات",
        "لا حاجة للهيكل"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "الإبداع",
      questionType: QuestionType.RECALL,
      hashtags: ["#creativity", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "لماذا الإبداع والابتكار مهمان للإنتاجية وفقًا للدرس?",
      options: [
        "إنهما يلغيان كل الهيكل",
        "إنهما يمكّنان من العثور على حلول أفضل، وكسر الأنماط المحدودة، والتكيف مع التغيير، واكتشاف أساليب أكثر كفاءة",
        "ينطبقان فقط على وظائف معينة",
        "لا يتطلبان تخطيطًا"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "الإبداع",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#creativity", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "تواجه تحدي إنتاجية متكرر. وفقًا للدرس، ماذا يجب أن تفعل?",
      options: [
        "اقبله كعادي",
        "أعد التفكير في النهج، وجرب أساليب جديدة، وتحدى الافتراضات حول العملية الحالية",
        "فقط اعمل بجدية أكبر",
        "تجاهل التحدي"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "الإبداع",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#creativity", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "تريد دمج الإبداع في عملك. وفقًا للدرس، ماذا يجب أن تنشئ?",
      options: [
        "فقط اعمل عشوائيًا",
        "وقت تجريبي منتظم، والتشكيك في الافتراضات، والانفتاح على الأساليب الجديدة، وعملية لاختبار وتحسين الأفكار",
        "فقط الأنشطة الفنية",
        "فقط جلسات العصف الذهني"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "الإبداع",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#creativity", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "شخص يتبع نفس الأساليب لسنوات، والإنتاجية راكدة، ولا يتم العثور على تحسينات. وفقًا لإطار الدرس، ما هي المشكلة الأساسية?",
      options: [
        "لا يوجد روتين كافٍ",
        "نقص الإبداع والابتكار - نقص التجريب، وإعادة التفكير في الأساليب، وتحدي الافتراضات التي تمكن من حلول اختراقية",
        "الكثير من الإبداع",
        "الإبداع غير ضروري"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "الإبداع",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#creativity", "#advanced", "#critical-thinking", "#ar", "#all-languages"]
    }
  ],
  // Portuguese (PT) - Professional translations (Brazilian)
  PT: [
    {
      question: "De acordo com a lição, o que é criatividade no contexto de produtividade?",
      options: [
        "Apenas expressão artística",
        "A capacidade de repensar abordagens, encontrar novas soluções e quebrar padrões que limitam a produtividade",
        "Apenas para profissionais criativos",
        "Não é relevante para produtividade"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Criatividade",
      questionType: QuestionType.RECALL,
      hashtags: ["#creativity", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, por que a experimentação é importante?",
      options: [
        "Não é importante",
        "Permite testar novas abordagens, descobrir métodos melhores e evitar estagnação",
        "Aplica-se apenas a pesquisas",
        "Não requer esforço"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Inovação",
      questionType: QuestionType.RECALL,
      hashtags: ["#innovation", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, o que significa 'repensar' em produtividade?",
      options: [
        "Esquecer tudo",
        "Questionar métodos existentes, desafiar suposições e explorar abordagens alternativas",
        "Apenas mudar ferramentas",
        "Estrutura não é necessária"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Criatividade",
      questionType: QuestionType.RECALL,
      hashtags: ["#creativity", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "Por que criatividade e inovação são importantes para produtividade de acordo com a lição?",
      options: [
        "Eliminam toda a estrutura",
        "Permitem encontrar melhores soluções, quebrar padrões limitantes, adaptar-se à mudança e descobrir abordagens mais eficientes",
        "Aplicam-se apenas a certos trabalhos",
        "Não requerem planejamento"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Criatividade",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#creativity", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Você enfrenta um desafio de produtividade recorrente. De acordo com a lição, o que você deve fazer?",
      options: [
        "Aceite como normal",
        "Repense a abordagem, experimente com novos métodos e desafie suposições sobre o processo atual",
        "Apenas trabalhe mais",
        "Ignore o desafio"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Criatividade",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#creativity", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Você quer integrar criatividade ao seu trabalho. De acordo com a lição, o que você deve estabelecer?",
      options: [
        "Apenas trabalhe aleatoriamente",
        "Tempo regular de experimentação, questionamento de suposições, abertura a novas abordagens e um processo para testar e refinar ideias",
        "Apenas atividades artísticas",
        "Apenas sessões de brainstorming"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Criatividade",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#creativity", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Uma pessoa segue os mesmos métodos por anos, a produtividade estagna e nenhuma melhoria é encontrada. De acordo com a estrutura da lição, qual é o problema central?",
      options: [
        "Não há rotina suficiente",
        "Falta de criatividade e inovação - falta experimentação, repensar abordagens e desafiar suposições que permitem soluções inovadoras",
        "Muita criatividade",
        "Criatividade é desnecessária"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Criatividade",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#creativity", "#advanced", "#critical-thinking", "#pt", "#all-languages"]
    }
  ],
  // Hindi (HI) - Professional translations
  HI: [
    {
      question: "पाठ के अनुसार, उत्पादकता के संदर्भ में रचनात्मकता क्या है?",
      options: [
        "केवल कलात्मक अभिव्यक्ति",
        "दृष्टिकोणों को पुनर्विचार करने, नए समाधान खोजने, और उत्पादकता को सीमित करने वाले पैटर्न को तोड़ने की क्षमता",
        "केवल रचनात्मक पेशेवरों के लिए",
        "यह उत्पादकता के लिए प्रासंगिक नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "रचनात्मकता",
      questionType: QuestionType.RECALL,
      hashtags: ["#creativity", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, प्रयोग क्यों महत्वपूर्ण है?",
      options: [
        "यह महत्वपूर्ण नहीं है",
        "यह नए दृष्टिकोणों का परीक्षण करने, बेहतर तरीके खोजने, और स्थिरता से बचने की अनुमति देता है",
        "यह केवल अनुसंधान पर लागू होता है",
        "इसके लिए प्रयास की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "नवाचार",
      questionType: QuestionType.RECALL,
      hashtags: ["#innovation", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, उत्पादकता में 'पुनर्विचार' का क्या अर्थ है?",
      options: [
        "सब कुछ भूल जाना",
        "मौजूदा तरीकों पर सवाल उठाना, धारणाओं को चुनौती देना, और वैकल्पिक दृष्टिकोणों की खोज करना",
        "केवल उपकरण बदलना",
        "संरचना की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "रचनात्मकता",
      questionType: QuestionType.RECALL,
      hashtags: ["#creativity", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार उत्पादकता के लिए रचनात्मकता और नवाचार क्यों महत्वपूर्ण हैं?",
      options: [
        "वे सभी संरचना को समाप्त करते हैं",
        "वे बेहतर समाधान खोजने, सीमित पैटर्न को तोड़ने, परिवर्तन के अनुकूल होने, और अधिक कुशल दृष्टिकोणों की खोज करने में सक्षम बनाते हैं",
        "वे केवल कुछ नौकरियों पर लागू होते हैं",
        "उन्हें योजना की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "रचनात्मकता",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#creativity", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "आप एक आवर्ती उत्पादकता चुनौती का सामना करते हैं। पाठ के अनुसार, आपको क्या करना चाहिए?",
      options: [
        "इसे सामान्य के रूप में स्वीकार करें",
        "दृष्टिकोण को पुनर्विचार करें, नए तरीकों के साथ प्रयोग करें, और वर्तमान प्रक्रिया के बारे में धारणाओं को चुनौती दें",
        "बस कठिन काम करें",
        "चुनौती को अनदेखा करें"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "रचनात्मकता",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#creativity", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "आप अपने काम में रचनात्मकता को एकीकृत करना चाहते हैं। पाठ के अनुसार, आपको क्या स्थापित करना चाहिए?",
      options: [
        "बस यादृच्छिक रूप से काम करें",
        "नियमित प्रयोग समय, धारणाओं पर सवाल, नए दृष्टिकोणों के लिए खुलापन, और विचारों का परीक्षण और परिष्कृत करने के लिए एक प्रक्रिया",
        "केवल कलात्मक गतिविधियां",
        "केवल ब्रेनस्टॉर्मिंग सत्र"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "रचनात्मकता",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#creativity", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक व्यक्ति वर्षों तक समान तरीकों का पालन करता है, उत्पादकता स्थिर हो जाती है, और कोई सुधार नहीं मिलता है। पाठ के ढांचे के अनुसार, मुख्य समस्या क्या है?",
      options: [
        "पर्याप्त दिनचर्या नहीं है",
        "रचनात्मकता और नवाचार की कमी - प्रयोग, दृष्टिकोणों को पुनर्विचार करने, और धारणाओं को चुनौती देने की कमी जो सफलता समाधान सक्षम करती है",
        "बहुत अधिक रचनात्मकता",
        "रचनात्मकता अनावश्यक है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "रचनात्मकता",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#creativity", "#advanced", "#critical-thinking", "#hi", "#all-languages"]
    }
  ]
};

async function seedDay23Enhanced() {
  try {
    await connectDB();
    console.log('🌱 SEEDING DAY 23 ENHANCED QUIZ QUESTIONS\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    let totalQuestions = 0;
    let totalUpdated = 0;
    let totalCreated = 0;

    for (const lang of LANGUAGES) {
      const courseId = `${COURSE_ID_BASE}_${lang}`;
      const lessonId = `${COURSE_ID_BASE}_${lang}_DAY_23`;

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
      const questions = DAY23_QUESTIONS[lang];
      
      if (!questions || questions.length === 0) {
        console.error(`   ❌ ERROR: No questions defined for ${lang}! Questions MUST be in course language.`);
        throw new Error(`Missing translations for ${lang} - Day 23 questions must be in course language, not English fallback`);
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
    console.log(`\n✅ DAY 23 ENHANCEMENT COMPLETE!\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedDay23Enhanced();
