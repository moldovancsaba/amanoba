/**
 * Seed Day 4 Enhanced Quiz Questions
 * 
 * Purpose: Enhance Day 4 quizzes from 5 to 7 questions across all 10 languages
 * Why: Part of Quiz Quality Enhancement - Phase 1, Day 4
 * 
 * Lesson Topic: Habits vs systems: why systems scale better
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
const DAY_NUMBER = 4;
const LANGUAGES = ['HU', 'EN', 'TR', 'BG', 'PL', 'VI', 'ID', 'AR', 'PT', 'HI'];

/**
 * Day 4 Enhanced Questions - All Languages
 * Topic: Habits vs systems
 * Structure: 7 questions per language
 * Q1-Q3: Keep (Recall - foundational concepts)
 * Q4: Rewritten (Application - from definition to purpose)
 * Q5: Keep (Application - scenario-based)
 * Q6: New (Application - practical implementation)
 * Q7: New (Critical Thinking - systems integration)
 */
const DAY4_QUESTIONS: Record<string, Array<{
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: QuestionDifficulty;
  category: string;
  questionType: QuestionType;
  hashtags: string[];
}>> = {
  EN: [
    // Q1: Definition of habits (RECALL - Keep)
    {
      question: "According to the lesson, what are habits?",
      options: [
        "Structured processes that create output from input",
        "Automatic behavior patterns developed through repetition",
        "Documented workflows for teams",
        "Complex systems with multiple steps"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Habits & Systems",
      questionType: QuestionType.RECALL,
      hashtags: ["#habits", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q2: Definition of systems (RECALL - Keep)
    {
      question: "According to the lesson, what are systems?",
      options: [
        "Individual behavior patterns",
        "Automatic routines that require no thought",
        "Structured processes that create output from input",
        "Personal preferences and choices"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Habits & Systems",
      questionType: QuestionType.RECALL,
      hashtags: ["#systems", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q3: Key difference - scalability (RECALL - Keep)
    {
      question: "What is the key difference between habits and systems according to the lesson?",
      options: [
        "Habits are better than systems",
        "Systems scale and work with others, while habits depend only on you",
        "Habits require documentation, systems don't",
        "There is no meaningful difference"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Habits & Systems",
      questionType: QuestionType.RECALL,
      hashtags: ["#habits", "#systems", "#intermediate", "#recall", "#en", "#all-languages"]
    },
    // Q4: Why systems scale better (APPLICATION - Rewritten from definition)
    {
      question: "Why do systems scale better than habits according to the lesson?",
      options: [
        "Because they require less initial setup time",
        "Because they work with others, can be documented, and don't depend solely on individual motivation",
        "Because they are easier to change",
        "Because they require no maintenance"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Systems",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#systems", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q5: When to use systems (APPLICATION - Keep)
    {
      question: "According to the lesson, when should you use a system instead of a habit?",
      options: [
        "For all personal behaviors",
        "For processes that work with others or need to be documented",
        "Only for complex tasks",
        "Never - habits are always better"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Habits & Systems",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#systems", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q6: Converting habit to system (APPLICATION - New)
    {
      question: "A manager currently relies on memory to check email daily. According to the lesson, what would be a system-based approach?",
      options: [
        "Set a reminder to check email",
        "Create inbox rules, block processing time in calendar, document decision rules, and create a guide others can use",
        "Check email randomly throughout the day",
        "Only check email when feeling motivated"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Systems",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#systems", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q7: Systems thinking in organizations (CRITICAL THINKING - New)
    {
      question: "A team relies on one person's habit to complete a critical process. When that person is unavailable, the process breaks down. According to the lesson's framework, what does this demonstrate?",
      options: [
        "Optimal productivity management",
        "A failure to convert habits into scalable systems that work independently of individuals",
        "Good individual accountability",
        "Efficient habit formation"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Systems",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#systems", "#advanced", "#critical-thinking", "#en", "#all-languages"]
    }
  ],
  // Hungarian translations
  HU: [
    {
      question: "A lecke szerint mik a szokások?",
      options: [
        "Strukturált folyamatok, amelyek bemenetből kimenetet hoznak létre",
        "Automatikus viselkedésminták, amelyeket ismétlés után alakítasz ki",
        "Dokumentált munkafolyamatok csapatoknak",
        "Összetett rendszerek több lépéssel"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Szokások és rendszerek",
      questionType: QuestionType.RECALL,
      hashtags: ["#habits", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint mik a rendszerek?",
      options: [
        "Egyéni viselkedésminták",
        "Automatikus rutinok, amelyek nem igényelnek gondolkodást",
        "Strukturált folyamatok, amelyek bemenetből kimenetet hoznak létre",
        "Személyes preferenciák és választások"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Szokások és rendszerek",
      questionType: QuestionType.RECALL,
      hashtags: ["#systems", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "Mi a fő különbség a szokások és a rendszerek között a lecke szerint?",
      options: [
        "A szokások jobbak, mint a rendszerek",
        "A rendszerek skálázódnak és másokkal is működnek, míg a szokások csak rajtad múlnak",
        "A szokások dokumentálást igényelnek, a rendszerek nem",
        "Nincs jelentős különbség"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Szokások és rendszerek",
      questionType: QuestionType.RECALL,
      hashtags: ["#habits", "#systems", "#intermediate", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "Miért skálázódnak jobban a rendszerek, mint a szokások a lecke szerint?",
      options: [
        "Mert kevesebb kezdeti beállítási időt igényelnek",
        "Mert másokkal is működnek, dokumentálhatók, és nem függnek kizárólag az egyéni motivációtól",
        "Mert könnyebben változtathatók",
        "Mert nem igényelnek karbantartást"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Rendszerek",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#systems", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint mikor kellene rendszert használni szokás helyett?",
      options: [
        "Minden személyes viselkedéshez",
        "Olyan folyamatokhoz, amelyek másokkal is működnek vagy dokumentálni kell",
        "Csak összetett feladatokhoz",
        "Soha - a szokások mindig jobbak"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Szokások és rendszerek",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#systems", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy menedzser jelenleg a memóriára támaszkodik, hogy naponta ellenőrizze az e-mailt. A lecke szerint mi lenne egy rendszer alapú megközelítés?",
      options: [
        "Emlékeztető beállítása az e-mail ellenőrzéséhez",
        "Inbox szabályok létrehozása, feldolgozási idő blokkolása a naptárban, döntési szabályok dokumentálása, és útmutató készítése, amelyet mások is használhatnak",
        "Véletlenszerűen ellenőrizni az e-mailt a nap folyamán",
        "Csak akkor ellenőrizni az e-mailt, amikor motivált vagy"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Rendszerek",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#systems", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy csapat egy személy szokására támaszkodik egy kritikus folyamat elvégzéséhez. Amikor az a személy nem elérhető, a folyamat összeomlik. A lecke keretrendszere szerint mit mutat ez?",
      options: [
        "Optimális termelékenység kezelés",
        "Kudarc a szokások skálázható rendszerekké alakításában, amelyek az egyének függetlenül működnek",
        "Jó egyéni felelősség",
        "Hatékony szokás kialakítás"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Rendszerek",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#systems", "#advanced", "#critical-thinking", "#hu", "#all-languages"]
    }
  ],
  // Turkish (TR) - Professional translations
  TR: [
    {
      question: "Derse göre alışkanlıklar nedir?",
      options: [
        "Girdiden çıktı oluşturan yapılandırılmış süreçler",
        "Tekrarlama yoluyla geliştirdiğiniz otomatik davranış kalıpları",
        "Ekipler için belgelenmiş iş akışları",
        "Birden fazla adımlı karmaşık sistemler"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Alışkanlıklar ve Sistemler",
      questionType: QuestionType.RECALL,
      hashtags: ["#habits", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre sistemler nedir?",
      options: [
        "Bireysel davranış kalıpları",
        "Düşünce gerektirmeyen otomatik rutinler",
        "Girdiden çıktı oluşturan yapılandırılmış süreçler",
        "Kişisel tercihler ve seçimler"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Alışkanlıklar ve Sistemler",
      questionType: QuestionType.RECALL,
      hashtags: ["#systems", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre alışkanlıklar ve sistemler arasındaki temel fark nedir?",
      options: [
        "Alışkanlıklar sistemlerden daha iyidir",
        "Sistemler ölçeklenir ve başkalarıyla çalışır, alışkanlıklar sadece size bağlıdır",
        "Alışkanlıklar belgelendirme gerektirir, sistemler gerektirmez",
        "Anlamlı bir fark yoktur"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Alışkanlıklar ve Sistemler",
      questionType: QuestionType.RECALL,
      hashtags: ["#habits", "#systems", "#intermediate", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre sistemler neden alışkanlıklardan daha iyi ölçeklenir?",
      options: [
        "Çünkü daha az başlangıç kurulum zamanı gerektirirler",
        "Çünkü başkalarıyla çalışırlar, belgelenebilirler ve yalnızca bireysel motivasyona bağlı değildirler",
        "Çünkü değiştirmesi daha kolaydır",
        "Çünkü bakım gerektirmezler"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Sistemler",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#systems", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre ne zaman alışkanlık yerine sistem kullanmalısınız?",
      options: [
        "Tüm kişisel davranışlar için",
        "Başkalarıyla çalışan veya belgelenmesi gereken süreçler için",
        "Sadece karmaşık görevler için",
        "Asla - alışkanlıklar her zaman daha iyidir"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Alışkanlıklar ve Sistemler",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#systems", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir yönetici şu anda e-postayı günlük olarak kontrol etmek için hafızaya güveniyor. Derse göre sistem tabanlı bir yaklaşım ne olurdu?",
      options: [
        "E-posta kontrolü için bir hatırlatıcı ayarlamak",
        "Gelen kutusu kuralları oluşturmak, takvimde işleme zamanını bloke etmek, karar kurallarını belgelemek ve başkalarının da kullanabileceği bir rehber oluşturmak",
        "Gün boyunca rastgele e-posta kontrol etmek",
        "Sadece motive olduğunuzda e-posta kontrol etmek"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Sistemler",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#systems", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir ekip kritik bir süreci tamamlamak için bir kişinin alışkanlığına güveniyor. O kişi müsait olmadığında süreç bozuluyor. Dersin çerçevesine göre bu neyi gösterir?",
      options: [
        "Optimal verimlilik yönetimi",
        "Alışkanlıkları bireylerden bağımsız çalışan ölçeklenebilir sistemlere dönüştürmede başarısızlık",
        "İyi bireysel sorumluluk",
        "Verimli alışkanlık oluşturma"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Sistemler",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#systems", "#advanced", "#critical-thinking", "#tr", "#all-languages"]
    }
  ],
  // Bulgarian (BG) - Professional translations
  BG: [
    {
      question: "Според урока, какво са навиците?",
      options: [
        "Структурирани процеси, които създават изход от вход",
        "Автоматични модели на поведение, развити чрез повторение",
        "Документирани работни процеси за екипи",
        "Сложни системи с множество стъпки"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Навици и системи",
      questionType: QuestionType.RECALL,
      hashtags: ["#habits", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, какво са системите?",
      options: [
        "Индивидуални модели на поведение",
        "Автоматични рутини, които не изискват мислене",
        "Структурирани процеси, които създават изход от вход",
        "Лични предпочитания и избори"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Навици и системи",
      questionType: QuestionType.RECALL,
      hashtags: ["#systems", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Каква е ключовата разлика между навиците и системите според урока?",
      options: [
        "Навиците са по-добри от системите",
        "Системите се мащабират и работят с други, докато навиците зависят само от вас",
        "Навиците изискват документация, системите не",
        "Няма значителна разлика"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Навици и системи",
      questionType: QuestionType.RECALL,
      hashtags: ["#habits", "#systems", "#intermediate", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Защо системите се мащабират по-добре от навиците според урока?",
      options: [
        "Защото изискват по-малко начално време за настройка",
        "Защото работят с други, могат да бъдат документирани и не зависят изключително от индивидуалната мотивация",
        "Защото са по-лесни за промяна",
        "Защото не изискват поддръжка"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Системи",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#systems", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, кога трябва да използвате система вместо навик?",
      options: [
        "За всички лични поведения",
        "За процеси, които работят с други или трябва да бъдат документирани",
        "Само за сложни задачи",
        "Никога - навиците винаги са по-добри"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Навици и системи",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#systems", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Мениджърът в момента разчита на паметта си, за да проверява имейла ежедневно. Според урока, какъв би бил подходът, базиран на система?",
      options: [
        "Настройване на напомняне за проверка на имейла",
        "Създаване на правила за входяща кутия, блокиране на време за обработка в календара, документиране на правила за вземане на решения и създаване на ръководство, което другите също могат да използват",
        "Случайна проверка на имейла през деня",
        "Проверка на имейла само когато се чувствате мотивирани"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Системи",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#systems", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Екипът разчита на навика на един човек да завърши критичен процес. Когато този човек не е наличен, процесът се срива. Според рамката на урока, какво демонстрира това?",
      options: [
        "Оптимално управление на продуктивността",
        "Неуспех в превръщането на навици в мащабируеми системи, които работят независимо от индивидите",
        "Добра индивидуална отговорност",
        "Ефективно формиране на навици"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Системи",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#systems", "#advanced", "#critical-thinking", "#bg", "#all-languages"]
    }
  ],
  // Polish (PL) - Professional translations
  PL: [
    {
      question: "Według lekcji, czym są nawyki?",
      options: [
        "Strukturyzowane procesy tworzące wynik z wejścia",
        "Automatyczne wzorce zachowań rozwijane poprzez powtarzanie",
        "Udokumentowane przepływy pracy dla zespołów",
        "Złożone systemy z wieloma krokami"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Nawyki i systemy",
      questionType: QuestionType.RECALL,
      hashtags: ["#habits", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, czym są systemy?",
      options: [
        "Indywidualne wzorce zachowań",
        "Automatyczne rutyny nie wymagające myślenia",
        "Strukturyzowane procesy tworzące wynik z wejścia",
        "Preferencje i wybory osobiste"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Nawyki i systemy",
      questionType: QuestionType.RECALL,
      hashtags: ["#systems", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Jaka jest kluczowa różnica między nawykami a systemami według lekcji?",
      options: [
        "Nawyki są lepsze niż systemy",
        "Systemy się skalują i działają z innymi, podczas gdy nawyki zależą tylko od ciebie",
        "Nawyki wymagają dokumentacji, systemy nie",
        "Nie ma znaczącej różnicy"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Nawyki i systemy",
      questionType: QuestionType.RECALL,
      hashtags: ["#habits", "#systems", "#intermediate", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Dlaczego systemy skalują się lepiej niż nawyki według lekcji?",
      options: [
        "Ponieważ wymagają mniej początkowego czasu konfiguracji",
        "Ponieważ działają z innymi, mogą być udokumentowane i nie zależą wyłącznie od indywidualnej motywacji",
        "Ponieważ są łatwiejsze do zmiany",
        "Ponieważ nie wymagają konserwacji"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Systemy",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#systems", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, kiedy powinieneś używać systemu zamiast nawyku?",
      options: [
        "Dla wszystkich zachowań osobistych",
        "Dla procesów, które działają z innymi lub muszą być udokumentowane",
        "Tylko dla złożonych zadań",
        "Nigdy - nawyki są zawsze lepsze"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Nawyki i systemy",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#systems", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Menedżer obecnie polega na pamięci, aby codziennie sprawdzać e-mail. Według lekcji, jakie byłoby podejście oparte na systemie?",
      options: [
        "Ustawienie przypomnienia o sprawdzaniu e-maila",
        "Utworzenie reguł skrzynki odbiorczej, zablokowanie czasu przetwarzania w kalendarzu, udokumentowanie reguł decyzyjnych i utworzenie przewodnika, który inni również mogą używać",
        "Losowe sprawdzanie e-maila w ciągu dnia",
        "Sprawdzanie e-maila tylko wtedy, gdy czujesz się zmotywowany"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Systemy",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#systems", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Zespół polega na nawyku jednej osoby, aby ukończyć krytyczny proces. Gdy ta osoba jest niedostępna, proces się załamuje. Według ram lekcji, co to demonstruje?",
      options: [
        "Optymalne zarządzanie produktywnością",
        "Niepowodzenie w przekształceniu nawyków w skalowalne systemy, które działają niezależnie od jednostek",
        "Dobra indywidualna odpowiedzialność",
        "Skuteczne formowanie nawyków"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Systemy",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#systems", "#advanced", "#critical-thinking", "#pl", "#all-languages"]
    }
  ],
  // Vietnamese (VI) - Professional translations
  VI: [
    {
      question: "Theo bài học, thói quen là gì?",
      options: [
        "Các quy trình có cấu trúc tạo ra kết quả từ đầu vào",
        "Các mẫu hành vi tự động được phát triển thông qua lặp lại",
        "Quy trình làm việc được tài liệu hóa cho nhóm",
        "Hệ thống phức tạp với nhiều bước"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Thói quen và Hệ thống",
      questionType: QuestionType.RECALL,
      hashtags: ["#habits", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, hệ thống là gì?",
      options: [
        "Các mẫu hành vi cá nhân",
        "Thói quen tự động không cần suy nghĩ",
        "Các quy trình có cấu trúc tạo ra kết quả từ đầu vào",
        "Sở thích và lựa chọn cá nhân"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Thói quen và Hệ thống",
      questionType: QuestionType.RECALL,
      hashtags: ["#systems", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Sự khác biệt chính giữa thói quen và hệ thống theo bài học là gì?",
      options: [
        "Thói quen tốt hơn hệ thống",
        "Hệ thống có thể mở rộng và hoạt động với người khác, trong khi thói quen chỉ phụ thuộc vào bạn",
        "Thói quen cần tài liệu, hệ thống thì không",
        "Không có sự khác biệt có ý nghĩa"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Thói quen và Hệ thống",
      questionType: QuestionType.RECALL,
      hashtags: ["#habits", "#systems", "#intermediate", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Tại sao hệ thống mở rộng tốt hơn thói quen theo bài học?",
      options: [
        "Vì chúng yêu cầu ít thời gian thiết lập ban đầu hơn",
        "Vì chúng hoạt động với người khác, có thể được tài liệu hóa và không phụ thuộc hoàn toàn vào động lực cá nhân",
        "Vì chúng dễ thay đổi hơn",
        "Vì chúng không cần bảo trì"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Hệ thống",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#systems", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, khi nào bạn nên sử dụng hệ thống thay vì thói quen?",
      options: [
        "Cho tất cả các hành vi cá nhân",
        "Cho các quy trình hoạt động với người khác hoặc cần được tài liệu hóa",
        "Chỉ cho các nhiệm vụ phức tạp",
        "Không bao giờ - thói quen luôn tốt hơn"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Thói quen và Hệ thống",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#systems", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Một người quản lý hiện đang dựa vào trí nhớ để kiểm tra email hàng ngày. Theo bài học, cách tiếp cận dựa trên hệ thống sẽ là gì?",
      options: [
        "Đặt lời nhắc để kiểm tra email",
        "Tạo quy tắc hộp thư đến, chặn thời gian xử lý trong lịch, tài liệu hóa quy tắc quyết định và tạo hướng dẫn mà người khác cũng có thể sử dụng",
        "Kiểm tra email ngẫu nhiên trong ngày",
        "Chỉ kiểm tra email khi cảm thấy có động lực"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Hệ thống",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#systems", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Một nhóm dựa vào thói quen của một người để hoàn thành một quy trình quan trọng. Khi người đó không có mặt, quy trình bị hỏng. Theo khung của bài học, điều này thể hiện điều gì?",
      options: [
        "Quản lý năng suất tối ưu",
        "Thất bại trong việc chuyển đổi thói quen thành hệ thống có thể mở rộng hoạt động độc lập với các cá nhân",
        "Trách nhiệm cá nhân tốt",
        "Hình thành thói quen hiệu quả"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Hệ thống",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#systems", "#advanced", "#critical-thinking", "#vi", "#all-languages"]
    }
  ],
  // Indonesian (ID) - Professional translations
  ID: [
    {
      question: "Menurut pelajaran, apa itu kebiasaan?",
      options: [
        "Proses terstruktur yang menciptakan output dari input",
        "Pola perilaku otomatis yang dikembangkan melalui pengulangan",
        "Alur kerja yang didokumentasikan untuk tim",
        "Sistem kompleks dengan banyak langkah"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Kebiasaan dan Sistem",
      questionType: QuestionType.RECALL,
      hashtags: ["#habits", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, apa itu sistem?",
      options: [
        "Pola perilaku individu",
        "Rutinitas otomatis yang tidak memerlukan pemikiran",
        "Proses terstruktur yang menciptakan output dari input",
        "Preferensi dan pilihan pribadi"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Kebiasaan dan Sistem",
      questionType: QuestionType.RECALL,
      hashtags: ["#systems", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Apa perbedaan utama antara kebiasaan dan sistem menurut pelajaran?",
      options: [
        "Kebiasaan lebih baik daripada sistem",
        "Sistem dapat diskalakan dan bekerja dengan orang lain, sementara kebiasaan hanya bergantung pada Anda",
        "Kebiasaan memerlukan dokumentasi, sistem tidak",
        "Tidak ada perbedaan yang berarti"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Kebiasaan dan Sistem",
      questionType: QuestionType.RECALL,
      hashtags: ["#habits", "#systems", "#intermediate", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Mengapa sistem lebih baik diskalakan daripada kebiasaan menurut pelajaran?",
      options: [
        "Karena memerlukan lebih sedikit waktu setup awal",
        "Karena bekerja dengan orang lain, dapat didokumentasikan, dan tidak bergantung semata-mata pada motivasi individu",
        "Karena lebih mudah diubah",
        "Karena tidak memerlukan pemeliharaan"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Sistem",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#systems", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, kapan Anda harus menggunakan sistem daripada kebiasaan?",
      options: [
        "Untuk semua perilaku pribadi",
        "Untuk proses yang bekerja dengan orang lain atau perlu didokumentasikan",
        "Hanya untuk tugas kompleks",
        "Tidak pernah - kebiasaan selalu lebih baik"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Kebiasaan dan Sistem",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#systems", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Seorang manajer saat ini mengandalkan ingatan untuk memeriksa email setiap hari. Menurut pelajaran, apa yang akan menjadi pendekatan berbasis sistem?",
      options: [
        "Mengatur pengingat untuk memeriksa email",
        "Membuat aturan kotak masuk, memblokir waktu pemrosesan di kalender, mendokumentasikan aturan keputusan, dan membuat panduan yang dapat digunakan orang lain juga",
        "Memeriksa email secara acak sepanjang hari",
        "Hanya memeriksa email saat merasa termotivasi"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Sistem",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#systems", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Sebuah tim mengandalkan kebiasaan satu orang untuk menyelesaikan proses kritis. Ketika orang itu tidak tersedia, prosesnya rusak. Menurut kerangka pelajaran, apa yang ditunjukkan ini?",
      options: [
        "Manajemen produktivitas yang optimal",
        "Kegagalan dalam mengubah kebiasaan menjadi sistem yang dapat diskalakan yang bekerja secara independen dari individu",
        "Akuntabilitas individu yang baik",
        "Pembentukan kebiasaan yang efisien"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Sistem",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#systems", "#advanced", "#critical-thinking", "#id", "#all-languages"]
    }
  ],
  // Arabic (AR) - Professional translations (RTL)
  AR: [
    {
      question: "وفقًا للدرس، ما هي العادات؟",
      options: [
        "العمليات المنظمة التي تخلق مخرجات من المدخلات",
        "أنماط السلوك التلقائية التي تتطور من خلال التكرار",
        "سير العمل الموثق للفرق",
        "أنظمة معقدة بخطوات متعددة"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "العادات والأنظمة",
      questionType: QuestionType.RECALL,
      hashtags: ["#habits", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، ما هي الأنظمة؟",
      options: [
        "أنماط السلوك الفردية",
        "الروتينات التلقائية التي لا تتطلب تفكيرًا",
        "العمليات المنظمة التي تخلق مخرجات من المدخلات",
        "التفضيلات والخيارات الشخصية"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "العادات والأنظمة",
      questionType: QuestionType.RECALL,
      hashtags: ["#systems", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "ما هو الفرق الرئيسي بين العادات والأنظمة وفقًا للدرس؟",
      options: [
        "العادات أفضل من الأنظمة",
        "الأنظمة قابلة للتوسع وتعمل مع الآخرين، بينما العادات تعتمد فقط عليك",
        "العادات تتطلب توثيقًا، الأنظمة لا",
        "لا يوجد فرق ذو مغزى"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "العادات والأنظمة",
      questionType: QuestionType.RECALL,
      hashtags: ["#habits", "#systems", "#intermediate", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "لماذا تتوسع الأنظمة بشكل أفضل من العادات وفقًا للدرس؟",
      options: [
        "لأنها تتطلب وقت إعداد أولي أقل",
        "لأنها تعمل مع الآخرين، يمكن توثيقها، ولا تعتمد فقط على الدافع الفردي",
        "لأنها أسهل في التغيير",
        "لأنها لا تتطلب صيانة"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "الأنظمة",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#systems", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، متى يجب أن تستخدم نظامًا بدلاً من عادة؟",
      options: [
        "لجميع السلوكيات الشخصية",
        "للعمليات التي تعمل مع الآخرين أو تحتاج إلى توثيق",
        "فقط للمهام المعقدة",
        "أبدًا - العادات دائمًا أفضل"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "العادات والأنظمة",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#systems", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "يعتمد المدير حاليًا على الذاكرة للتحقق من البريد الإلكتروني يوميًا. وفقًا للدرس، ما الذي سيكون نهجًا قائمًا على النظام؟",
      options: [
        "تعيين تذكير للتحقق من البريد الإلكتروني",
        "إنشاء قواعد صندوق الوارد، حظر وقت المعالجة في التقويم، توثيق قواعد القرار، وإنشاء دليل يمكن للآخرين استخدامه أيضًا",
        "التحقق من البريد الإلكتروني بشكل عشوائي طوال اليوم",
        "التحقق من البريد الإلكتروني فقط عند الشعور بالتحفيز"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "الأنظمة",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#systems", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "يعتمد الفريق على عادة شخص واحد لإكمال عملية حرجة. عندما يكون ذلك الشخص غير متاح، تنهار العملية. وفقًا لإطار الدرس، ماذا يوضح هذا؟",
      options: [
        "إدارة الإنتاجية المثلى",
        "فشل في تحويل العادات إلى أنظمة قابلة للتوسع تعمل بشكل مستقل عن الأفراد",
        "المساءلة الفردية الجيدة",
        "تشكيل العادات بكفاءة"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "الأنظمة",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#systems", "#advanced", "#critical-thinking", "#ar", "#all-languages"]
    }
  ],
  // Portuguese (PT) - Professional translations (Brazilian)
  PT: [
    {
      question: "De acordo com a lição, o que são hábitos?",
      options: [
        "Processos estruturados que criam saída a partir de entrada",
        "Padrões de comportamento automáticos desenvolvidos através de repetição",
        "Fluxos de trabalho documentados para equipes",
        "Sistemas complexos com múltiplas etapas"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Hábitos e Sistemas",
      questionType: QuestionType.RECALL,
      hashtags: ["#habits", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, o que são sistemas?",
      options: [
        "Padrões de comportamento individuais",
        "Rotinas automáticas que não requerem pensamento",
        "Processos estruturados que criam saída a partir de entrada",
        "Preferências e escolhas pessoais"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Hábitos e Sistemas",
      questionType: QuestionType.RECALL,
      hashtags: ["#systems", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "Qual é a principal diferença entre hábitos e sistemas de acordo com a lição?",
      options: [
        "Hábitos são melhores que sistemas",
        "Sistemas escalam e funcionam com outros, enquanto hábitos dependem apenas de você",
        "Hábitos requerem documentação, sistemas não",
        "Não há diferença significativa"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Hábitos e Sistemas",
      questionType: QuestionType.RECALL,
      hashtags: ["#habits", "#systems", "#intermediate", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "Por que os sistemas escalam melhor que os hábitos de acordo com a lição?",
      options: [
        "Porque requerem menos tempo de configuração inicial",
        "Porque funcionam com outros, podem ser documentados e não dependem apenas da motivação individual",
        "Porque são mais fáceis de mudar",
        "Porque não requerem manutenção"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Sistemas",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#systems", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, quando você deve usar um sistema em vez de um hábito?",
      options: [
        "Para todos os comportamentos pessoais",
        "Para processos que funcionam com outros ou precisam ser documentados",
        "Apenas para tarefas complexas",
        "Nunca - hábitos são sempre melhores"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Hábitos e Sistemas",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#systems", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Um gerente atualmente depende da memória para verificar e-mail diariamente. De acordo com a lição, qual seria uma abordagem baseada em sistema?",
      options: [
        "Configurar um lembrete para verificar e-mail",
        "Criar regras de caixa de entrada, bloquear tempo de processamento no calendário, documentar regras de decisão e criar um guia que outros também possam usar",
        "Verificar e-mail aleatoriamente ao longo do dia",
        "Verificar e-mail apenas quando se sentir motivado"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Sistemas",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#systems", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Uma equipe depende do hábito de uma pessoa para completar um processo crítico. Quando essa pessoa não está disponível, o processo quebra. De acordo com a estrutura da lição, o que isso demonstra?",
      options: [
        "Gestão ideal de produtividade",
        "Falha em converter hábitos em sistemas escaláveis que funcionam independentemente de indivíduos",
        "Boa responsabilidade individual",
        "Formação eficiente de hábitos"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Sistemas",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#systems", "#advanced", "#critical-thinking", "#pt", "#all-languages"]
    }
  ],
  // Hindi (HI) - Professional translations
  HI: [
    {
      question: "पाठ के अनुसार, आदतें क्या हैं?",
      options: [
        "संरचित प्रक्रियाएं जो इनपुट से आउटपुट बनाती हैं",
        "स्वचालित व्यवहार पैटर्न जो दोहराव के माध्यम से विकसित होते हैं",
        "टीमों के लिए प्रलेखित वर्कफ़्लो",
        "कई चरणों के साथ जटिल प्रणालियां"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "आदतें और प्रणालियां",
      questionType: QuestionType.RECALL,
      hashtags: ["#habits", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, प्रणालियां क्या हैं?",
      options: [
        "व्यक्तिगत व्यवहार पैटर्न",
        "स्वचालित दिनचर्या जिन्हें सोच की आवश्यकता नहीं होती",
        "संरचित प्रक्रियाएं जो इनपुट से आउटपुट बनाती हैं",
        "व्यक्तिगत प्राथमिकताएं और विकल्प"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "आदतें और प्रणालियां",
      questionType: QuestionType.RECALL,
      hashtags: ["#systems", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार आदतों और प्रणालियों के बीच मुख्य अंतर क्या है?",
      options: [
        "आदतें प्रणालियों से बेहतर हैं",
        "प्रणालियां स्केल करती हैं और दूसरों के साथ काम करती हैं, जबकि आदतें केवल आप पर निर्भर करती हैं",
        "आदतों को प्रलेखन की आवश्यकता होती है, प्रणालियों को नहीं",
        "कोई महत्वपूर्ण अंतर नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "आदतें और प्रणालियां",
      questionType: QuestionType.RECALL,
      hashtags: ["#habits", "#systems", "#intermediate", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार प्रणालियां आदतों से बेहतर क्यों स्केल करती हैं?",
      options: [
        "क्योंकि उन्हें कम प्रारंभिक सेटअप समय की आवश्यकता होती है",
        "क्योंकि वे दूसरों के साथ काम करती हैं, प्रलेखित की जा सकती हैं, और केवल व्यक्तिगत प्रेरणा पर निर्भर नहीं करतीं",
        "क्योंकि वे बदलने में आसान हैं",
        "क्योंकि उन्हें रखरखाव की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "प्रणालियां",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#systems", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, आपको आदत के बजाय प्रणाली का उपयोग कब करना चाहिए?",
      options: [
        "सभी व्यक्तिगत व्यवहारों के लिए",
        "उन प्रक्रियाओं के लिए जो दूसरों के साथ काम करती हैं या प्रलेखित करने की आवश्यकता होती है",
        "केवल जटिल कार्यों के लिए",
        "कभी नहीं - आदतें हमेशा बेहतर होती हैं"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "आदतें और प्रणालियां",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#systems", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक प्रबंधक वर्तमान में दैनिक रूप से ईमेल जांचने के लिए स्मृति पर निर्भर है। पाठ के अनुसार, एक प्रणाली-आधारित दृष्टिकोण क्या होगा?",
      options: [
        "ईमेल जांचने के लिए एक अनुस्मारक सेट करना",
        "इनबॉक्स नियम बनाना, कैलेंडर में प्रसंस्करण समय ब्लॉक करना, निर्णय नियमों को प्रलेखित करना, और एक गाइड बनाना जिसे दूसरे भी उपयोग कर सकें",
        "दिन भर में यादृच्छिक रूप से ईमेल जांचना",
        "केवल तब ईमेल जांचना जब प्रेरित महसूस करें"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "प्रणालियां",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#systems", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक टीम एक महत्वपूर्ण प्रक्रिया को पूरा करने के लिए एक व्यक्ति की आदत पर निर्भर करती है। जब वह व्यक्ति उपलब्ध नहीं होता है, तो प्रक्रिया टूट जाती है। पाठ के ढांचे के अनुसार, यह क्या प्रदर्शित करता है?",
      options: [
        "इष्टतम उत्पादकता प्रबंधन",
        "आदतों को स्केलेबल प्रणालियों में बदलने में विफलता जो व्यक्तियों से स्वतंत्र रूप से काम करती हैं",
        "अच्छी व्यक्तिगत जवाबदेही",
        "कुशल आदत निर्माण"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "प्रणालियां",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#systems", "#advanced", "#critical-thinking", "#hi", "#all-languages"]
    }
  ]
};

async function seedDay4Enhanced() {
  try {
    await connectDB();
    console.log('🌱 SEEDING DAY 4 ENHANCED QUIZ QUESTIONS\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    let totalQuestions = 0;
    let totalUpdated = 0;
    let totalCreated = 0;

    for (const lang of LANGUAGES) {
      const courseId = `${COURSE_ID_BASE}_${lang}`;
      const lessonId = `${COURSE_ID_BASE}_${lang}_DAY_04`;

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
      const questions = DAY4_QUESTIONS[lang] || DAY4_QUESTIONS['EN']; // Fallback to EN if not translated
      
      if (!questions || questions.length === 0) {
        console.log(`   ⚠️  No questions defined for ${lang}, using English as fallback`);
        continue;
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
    console.log(`\n✅ DAY 4 ENHANCEMENT COMPLETE!\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedDay4Enhanced();
