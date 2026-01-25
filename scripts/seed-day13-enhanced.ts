/**
 * Seed Day 13 Enhanced Quiz Questions
 * 
 * Purpose: Enhance Day 13 quizzes from 5 to 7 questions across all 10 languages
 * Why: Part of Quiz Quality Enhancement - Phase 1, Day 13
 * 
 * Lesson Topic: Decision-Making Frameworks (rapid decisions, decision matrix, avoiding analysis paralysis)
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
const DAY_NUMBER = 13;
const LANGUAGES = ['HU', 'EN', 'TR', 'BG', 'PL', 'VI', 'ID', 'AR', 'PT', 'HI'];

/**
 * Day 13 Enhanced Questions - All Languages
 * Topic: Decision-Making Frameworks
 * Structure: 7 questions per language
 * Q1-Q3: Recall (foundational concepts)
 * Q4: Application (why frameworks matter)
 * Q5: Application (scenario-based)
 * Q6: Application (practical implementation)
 * Q7: Critical Thinking (systems integration)
 */
const DAY13_QUESTIONS: Record<string, Array<{
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: QuestionDifficulty;
  category: string;
  questionType: QuestionType;
  hashtags: string[];
}>> = {
  EN: [
    // Q1: Analysis paralysis definition (RECALL)
    {
      question: "According to the lesson, what is analysis paralysis?",
      options: [
        "Deciding too quickly",
        "Too much information and options prevent deciding, leading to procrastination",
        "Choosing the first option",
        "Only for educated people"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Decision Making",
      questionType: QuestionType.RECALL,
      hashtags: ["#decision-making", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q2: Decision matrix steps (RECALL)
    {
      question: "According to the lesson, what are the steps in a decision matrix?",
      options: [
        "Just choose randomly",
        "List options and criteria, weight criteria, score each option, multiply scores by weights and sum",
        "Only list options",
        "No structure needed"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Decision Matrix",
      questionType: QuestionType.RECALL,
      hashtags: ["#decision-matrix", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q3: Rapid decision categories (RECALL)
    {
      question: "According to the lesson, how many hours should you analyze a 'large' decision?",
      options: [
        "Less than 1 hour",
        "1-2 hours",
        "4+ hours",
        "No difference"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Decision Making",
      questionType: QuestionType.RECALL,
      hashtags: ["#decision-making", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q4: Why decision frameworks matter (APPLICATION)
    {
      question: "Why are decision-making frameworks important according to the lesson?",
      options: [
        "They eliminate all decisions",
        "They prevent analysis paralysis, reduce decision fatigue, enable faster progress with 'good enough' decisions, and help categorize decisions by importance",
        "They only apply to large teams",
        "They require no effort"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Decision Making",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#decision-making", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q5: Choosing decision approach (APPLICATION)
    {
      question: "You have a small, reversible decision that takes less than 1 hour to analyze. According to the lesson, what should you do?",
      options: [
        "Analyze for 4+ hours",
        "Decide immediately, fix later if needed",
        "Never decide",
        "Only use decision matrix"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Decision Making",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#decision-making", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q6: Setting up decision framework (APPLICATION)
    {
      question: "You want to improve your decision-making process. According to the lesson, what should you establish?",
      options: [
        "Just decide randomly",
        "Three decision categories (small, medium, large) with time limits, decision matrix for medium/large decisions, and 'good enough' principle (80% solution)",
        "Only decision matrix",
        "Only time limits"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Decision Making",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#decision-making", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q7: Analysis paralysis problem solving (CRITICAL THINKING)
    {
      question: "A person consistently delays decisions, seeking more information but never deciding, leading to missed opportunities. According to the lesson's framework, what is the core issue?",
      options: [
        "Not enough information",
        "Analysis paralysis - missing decision frameworks, time limits, and 'good enough' principle that prevent over-analysis and enable progress",
        "Too many decisions",
        "Decision frameworks are unnecessary"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Decision Making",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#decision-making", "#advanced", "#critical-thinking", "#en", "#all-languages"]
    }
  ],
  // Hungarian (HU) - Professional translations
  HU: [
    {
      question: "A lecke szerint mi az elemzési bénultság?",
      options: [
        "Túl gyors döntés",
        "Túl sok információ és lehetőség megakadályozza a döntést, halogatáshoz vezet",
        "Az első opció kiválasztása",
        "Csak művelt embereknek"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Decision Making",
      questionType: QuestionType.RECALL,
      hashtags: ["#decision-making", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint mik a döntési mátrix lépései?",
      options: [
        "Csak véletlenszerűen válassz",
        "Listázd az opciókat és kritériumokat, súlyozd a kritériumokat, értékeld minden opciót, szorozd meg az értékeket a súlyokkal és összegezd",
        "Csak listázd az opciókat",
        "Nincs szükség struktúrára"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Döntési Mátrix",
      questionType: QuestionType.RECALL,
      hashtags: ["#decision-matrix", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint hány órát kellene elemzened egy 'nagy' döntést?",
      options: [
        "Kevesebb mint 1 óra",
        "1-2 óra",
        "4+ óra",
        "Nincs különbség"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Decision Making",
      questionType: QuestionType.RECALL,
      hashtags: ["#decision-making", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "Miért fontosak a döntéshozatali keretek a lecke szerint?",
      options: [
        "Kiküszöbölik az összes döntést",
        "Megelőzik az elemzési bénultságot, csökkentik a döntési fáradtságot, lehetővé teszik a gyorsabb haladást 'elég jó' döntésekkel, és segítenek kategorizálni a döntéseket fontosság szerint",
        "Csak nagy csapatokra vonatkoznak",
        "Nem igényelnek erőfeszítést"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Decision Making",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#decision-making", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Van egy kicsi, megfordítható döntésed, amely kevesebb mint 1 órát vesz igénybe az elemzéshez. A lecke szerint mit kellene tenned?",
      options: [
        "Elemezz 4+ órát",
        "Dönts azonnal, javíts később ha szükséges",
        "Soha ne dönts",
        "Csak döntési mátrixot használj"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Decision Making",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#decision-making", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Javítani szeretnéd a döntéshozatali folyamatodat. A lecke szerint mit kellene létrehozni?",
      options: [
        "Csak dönts véletlenszerűen",
        "Három döntési kategória (kicsi, közepes, nagy) időkorlátokkal, döntési mátrix közepes/nagy döntésekhez, és 'elég jó' elv (80% megoldás)",
        "Csak döntési mátrix",
        "Csak időkorlátok"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Decision Making",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#decision-making", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy személy következetesen halogatja a döntéseket, több információt keres, de soha nem dönt, ami kihagyott lehetőségekhez vezet. A lecke keretrendszere szerint mi a fő probléma?",
      options: [
        "Nincs elég információ",
        "Elemzési bénultság - hiányoznak a döntési keretek, időkorlátok, és 'elég jó' elv, amelyek megelőzik a túlzott elemzést és lehetővé teszik a haladást",
        "Túl sok döntés",
        "A döntési keretek feleslegesek"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Decision Making",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#decision-making", "#advanced", "#critical-thinking", "#hu", "#all-languages"]
    }
  ],
  // Turkish (TR) - Professional translations
  TR: [
    {
      question: "Derse göre analiz felci nedir?",
      options: [
        "Çok hızlı karar vermek",
        "Çok fazla bilgi ve seçenek karar vermeyi engeller, ertelemeye yol açar",
        "İlk seçeneği seçmek",
        "Sadece eğitimli insanlar için"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Karar Verme",
      questionType: QuestionType.RECALL,
      hashtags: ["#decision-making", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre karar matrisinin adımları nelerdir?",
      options: [
        "Sadece rastgele seç",
        "Seçenekleri ve kriterleri listele, kriterleri ağırlıklandır, her seçeneği puanla, puanları ağırlıklarla çarp ve topla",
        "Sadece seçenekleri listele",
        "Yapı gerekmez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Karar Matrisi",
      questionType: QuestionType.RECALL,
      hashtags: ["#decision-matrix", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre 'büyük' bir kararı kaç saat analiz etmelisin?",
      options: [
        "1 saatten az",
        "1-2 saat",
        "4+ saat",
        "Fark yok"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Karar Verme",
      questionType: QuestionType.RECALL,
      hashtags: ["#decision-making", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre karar verme çerçeveleri neden önemlidir?",
      options: [
        "Tüm kararları ortadan kaldırırlar",
        "Analiz felcini önlerler, karar yorgunluğunu azaltırlar, 'yeterince iyi' kararlarla daha hızlı ilerlemeyi sağlarlar ve kararları öneme göre kategorize etmeye yardımcı olurlar",
        "Sadece büyük ekiplere uygulanır",
        "Çaba gerektirmezler"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Karar Verme",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#decision-making", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "1 saatten az analiz gerektiren küçük, geri alınabilir bir kararın var. Derse göre ne yapmalısın?",
      options: [
        "4+ saat analiz et",
        "Hemen karar ver, gerekirse sonra düzelt",
        "Asla karar verme",
        "Sadece karar matrisi kullan"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Karar Verme",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#decision-making", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Karar verme sürecini iyileştirmek istiyorsun. Derse göre ne kurmalısın?",
      options: [
        "Sadece rastgele karar ver",
        "Zaman sınırları olan üç karar kategorisi (küçük, orta, büyük), orta/büyük kararlar için karar matrisi ve 'yeterince iyi' ilkesi (%80 çözüm)",
        "Sadece karar matrisi",
        "Sadece zaman sınırları"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Karar Verme",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#decision-making", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir kişi sürekli kararları erteler, daha fazla bilgi arar ama asla karar vermez, bu da kaçırılan fırsatlara yol açar. Derse göre temel sorun nedir?",
      options: [
        "Yeterli bilgi yok",
        "Analiz felci - aşırı analizi önleyen ve ilerlemeyi sağlayan karar çerçeveleri, zaman sınırları ve 'yeterince iyi' ilkesi eksik",
        "Çok fazla karar",
        "Karar çerçeveleri gereksiz"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Karar Verme",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#decision-making", "#advanced", "#critical-thinking", "#tr", "#all-languages"]
    }
  ],
  // Bulgarian (BG) - Professional translations
  BG: [
    {
      question: "Според урока, какво е парализа на анализа?",
      options: [
        "Твърде бързо взимане на решение",
        "Твърде много информация и опции пречат на решението, водещи до отлагане",
        "Избиране на първата опция",
        "Само за образовани хора"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Взимане на Решения",
      questionType: QuestionType.RECALL,
      hashtags: ["#decision-making", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, какви са стъпките в матрицата за решения?",
      options: [
        "Просто избирай на случаен принцип",
        "Списък с опции и критерии, претегляне на критериите, оценяване на всяка опция, умножаване на оценките по теглата и сумиране",
        "Само списък с опции",
        "Няма нужда от структура"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Матрица за Решения",
      questionType: QuestionType.RECALL,
      hashtags: ["#decision-matrix", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, колко часа трябва да анализираш 'голямо' решение?",
      options: [
        "По-малко от 1 час",
        "1-2 часа",
        "4+ часа",
        "Няма разлика"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Взимане на Решения",
      questionType: QuestionType.RECALL,
      hashtags: ["#decision-making", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Защо рамките за взимане на решения са важни според урока?",
      options: [
        "Те премахват всички решения",
        "Те предотвратяват парализата на анализа, намаляват умората от решения, позволяват по-бърз напредък с 'достатъчно добри' решения и помагат да се категоризират решенията по важност",
        "Те се прилагат само за големи екипи",
        "Те не изискват усилие"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Взимане на Решения",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#decision-making", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Имаш малко, обратимо решение, което отнема по-малко от 1 час за анализ. Според урока, какво трябва да направиш?",
      options: [
        "Анализирай 4+ часа",
        "Реши веднага, поправи по-късно ако е необходимо",
        "Никога не решавай",
        "Използвай само матрица за решения"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Взимане на Решения",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#decision-making", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Искаш да подобриш процеса си за взимане на решения. Според урока, какво трябва да установиш?",
      options: [
        "Просто решавай на случаен принцип",
        "Три категории решения (малки, средни, големи) с времеви ограничения, матрица за решения за средни/големи решения и принцип 'достатъчно добро' (80% решение)",
        "Само матрица за решения",
        "Само времеви ограничения"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Взимане на Решения",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#decision-making", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Човек последователно отлага решения, търсейки повече информация, но никога не решава, водещо до пропуснати възможности. Според рамката на урока, какъв е основният проблем?",
      options: [
        "Няма достатъчно информация",
        "Парализа на анализа - липсват рамки за решения, времеви ограничения и принцип 'достатъчно добро', които предотвратяват свръханализа и позволяват напредък",
        "Твърде много решения",
        "Рамките за решения са ненужни"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Взимане на Решения",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#decision-making", "#advanced", "#critical-thinking", "#bg", "#all-languages"]
    }
  ],
  // Polish (PL) - Professional translations
  PL: [
    {
      question: "Według lekcji, czym jest paraliż analityczny?",
      options: [
        "Zbyt szybkie podejmowanie decyzji",
        "Zbyt dużo informacji i opcji uniemożliwia podjęcie decyzji, prowadząc do zwlekania",
        "Wybór pierwszej opcji",
        "Tylko dla wykształconych ludzi"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Podejmowanie Decyzji",
      questionType: QuestionType.RECALL,
      hashtags: ["#decision-making", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, jakie są kroki w macierzy decyzyjnej?",
      options: [
        "Po prostu wybierz losowo",
        "Lista opcji i kryteriów, ważenie kryteriów, ocena każdej opcji, pomnożenie wyników przez wagi i zsumowanie",
        "Tylko lista opcji",
        "Struktura nie jest potrzebna"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Macierz Decyzyjna",
      questionType: QuestionType.RECALL,
      hashtags: ["#decision-matrix", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, ile godzin powinieneś analizować 'dużą' decyzję?",
      options: [
        "Mniej niż 1 godzina",
        "1-2 godziny",
        "4+ godziny",
        "Brak różnicy"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Podejmowanie Decyzji",
      questionType: QuestionType.RECALL,
      hashtags: ["#decision-making", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Dlaczego ramy podejmowania decyzji są ważne według lekcji?",
      options: [
        "Eliminują wszystkie decyzje",
        "Zapobiegają paraliżowi analitycznemu, zmniejszają zmęczenie decyzyjne, umożliwiają szybszy postęp dzięki 'wystarczająco dobrym' decyzjom i pomagają kategoryzować decyzje według ważności",
        "Stosują się tylko do dużych zespołów",
        "Nie wymagają wysiłku"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Podejmowanie Decyzji",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#decision-making", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Masz małą, odwracalną decyzję, która wymaga mniej niż 1 godziny analizy. Według lekcji, co powinieneś zrobić?",
      options: [
        "Analizuj 4+ godziny",
        "Zdecyduj natychmiast, popraw później jeśli potrzeba",
        "Nigdy nie decyduj",
        "Używaj tylko macierzy decyzyjnej"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Podejmowanie Decyzji",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#decision-making", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Chcesz poprawić swój proces podejmowania decyzji. Według lekcji, co powinieneś ustanowić?",
      options: [
        "Po prostu decyduj losowo",
        "Trzy kategorie decyzji (małe, średnie, duże) z limitami czasu, macierz decyzyjna dla średnich/dużych decyzji i zasada 'wystarczająco dobre' (80% rozwiązanie)",
        "Tylko macierz decyzyjna",
        "Tylko limity czasu"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Podejmowanie Decyzji",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#decision-making", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Osoba konsekwentnie odkłada decyzje, szukając więcej informacji, ale nigdy nie decyduje, prowadząc do utraconych możliwości. Według ram lekcji, jaki jest główny problem?",
      options: [
        "Nie ma wystarczającej informacji",
        "Paraliż analityczny - brakuje ram decyzyjnych, limitów czasu i zasady 'wystarczająco dobre', które zapobiegają nadmiernej analizie i umożliwiają postęp",
        "Zbyt wiele decyzji",
        "Ramy decyzyjne są niepotrzebne"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Podejmowanie Decyzji",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#decision-making", "#advanced", "#critical-thinking", "#pl", "#all-languages"]
    }
  ],
  // Vietnamese (VI) - Professional translations
  VI: [
    {
      question: "Theo bài học, tê liệt phân tích là gì?",
      options: [
        "Quyết định quá nhanh",
        "Quá nhiều thông tin và lựa chọn ngăn cản quyết định, dẫn đến trì hoãn",
        "Chọn lựa chọn đầu tiên",
        "Chỉ dành cho người có học"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Ra Quyết Định",
      questionType: QuestionType.RECALL,
      hashtags: ["#decision-making", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, các bước trong ma trận quyết định là gì?",
      options: [
        "Chỉ chọn ngẫu nhiên",
        "Liệt kê các lựa chọn và tiêu chí, trọng số các tiêu chí, chấm điểm mỗi lựa chọn, nhân điểm với trọng số và tổng hợp",
        "Chỉ liệt kê các lựa chọn",
        "Không cần cấu trúc"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Ma Trận Quyết Định",
      questionType: QuestionType.RECALL,
      hashtags: ["#decision-matrix", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, bạn nên phân tích một quyết định 'lớn' trong bao nhiêu giờ?",
      options: [
        "Ít hơn 1 giờ",
        "1-2 giờ",
        "4+ giờ",
        "Không có sự khác biệt"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Ra Quyết Định",
      questionType: QuestionType.RECALL,
      hashtags: ["#decision-making", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Tại sao khung quyết định quan trọng theo bài học?",
      options: [
        "Chúng loại bỏ tất cả quyết định",
        "Chúng ngăn chặn tê liệt phân tích, giảm mệt mỏi quyết định, cho phép tiến bộ nhanh hơn với các quyết định 'đủ tốt', và giúp phân loại quyết định theo tầm quan trọng",
        "Chúng chỉ áp dụng cho các nhóm lớn",
        "Chúng không yêu cầu nỗ lực"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Ra Quyết Định",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#decision-making", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Bạn có một quyết định nhỏ, có thể đảo ngược mất ít hơn 1 giờ để phân tích. Theo bài học, bạn nên làm gì?",
      options: [
        "Phân tích 4+ giờ",
        "Quyết định ngay lập tức, sửa sau nếu cần",
        "Không bao giờ quyết định",
        "Chỉ sử dụng ma trận quyết định"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Ra Quyết Định",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#decision-making", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Bạn muốn cải thiện quy trình ra quyết định của mình. Theo bài học, bạn nên thiết lập gì?",
      options: [
        "Chỉ quyết định ngẫu nhiên",
        "Ba danh mục quyết định (nhỏ, trung bình, lớn) với giới hạn thời gian, ma trận quyết định cho quyết định trung bình/lớn, và nguyên tắc 'đủ tốt' (giải pháp 80%)",
        "Chỉ ma trận quyết định",
        "Chỉ giới hạn thời gian"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Ra Quyết Định",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#decision-making", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Một người liên tục trì hoãn quyết định, tìm kiếm thêm thông tin nhưng không bao giờ quyết định, dẫn đến cơ hội bị bỏ lỡ. Theo khung của bài học, vấn đề cốt lõi là gì?",
      options: [
        "Không đủ thông tin",
        "Tê liệt phân tích - thiếu khung quyết định, giới hạn thời gian, và nguyên tắc 'đủ tốt' ngăn chặn phân tích quá mức và cho phép tiến bộ",
        "Quá nhiều quyết định",
        "Khung quyết định là không cần thiết"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Ra Quyết Định",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#decision-making", "#advanced", "#critical-thinking", "#vi", "#all-languages"]
    }
  ],
  // Indonesian (ID) - Professional translations
  ID: [
    {
      question: "Menurut pelajaran, apa itu kelumpuhan analisis?",
      options: [
        "Memutuskan terlalu cepat",
        "Terlalu banyak informasi dan pilihan mencegah keputusan, menyebabkan penundaan",
        "Memilih opsi pertama",
        "Hanya untuk orang berpendidikan"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Pengambilan Keputusan",
      questionType: QuestionType.RECALL,
      hashtags: ["#decision-making", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, apa langkah-langkah dalam matriks keputusan?",
      options: [
        "Hanya pilih secara acak",
        "Daftar opsi dan kriteria, bobot kriteria, skor setiap opsi, kalikan skor dengan bobot dan jumlahkan",
        "Hanya daftar opsi",
        "Tidak perlu struktur"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Matriks Keputusan",
      questionType: QuestionType.RECALL,
      hashtags: ["#decision-matrix", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, berapa jam Anda harus menganalisis keputusan 'besar'?",
      options: [
        "Kurang dari 1 jam",
        "1-2 jam",
        "4+ jam",
        "Tidak ada perbedaan"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Pengambilan Keputusan",
      questionType: QuestionType.RECALL,
      hashtags: ["#decision-making", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Mengapa kerangka pengambilan keputusan penting menurut pelajaran?",
      options: [
        "Mereka menghilangkan semua keputusan",
        "Mereka mencegah kelumpuhan analisis, mengurangi kelelahan keputusan, memungkinkan kemajuan lebih cepat dengan keputusan 'cukup baik', dan membantu mengkategorikan keputusan berdasarkan pentingnya",
        "Mereka hanya berlaku untuk tim besar",
        "Mereka tidak memerlukan upaya"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Pengambilan Keputusan",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#decision-making", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Anda memiliki keputusan kecil, dapat dibalik yang membutuhkan kurang dari 1 jam untuk dianalisis. Menurut pelajaran, apa yang harus Anda lakukan?",
      options: [
        "Analisis 4+ jam",
        "Putuskan segera, perbaiki nanti jika perlu",
        "Jangan pernah memutuskan",
        "Hanya gunakan matriks keputusan"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Pengambilan Keputusan",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#decision-making", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Anda ingin meningkatkan proses pengambilan keputusan Anda. Menurut pelajaran, apa yang harus Anda tetapkan?",
      options: [
        "Hanya putuskan secara acak",
        "Tiga kategori keputusan (kecil, sedang, besar) dengan batas waktu, matriks keputusan untuk keputusan sedang/besar, dan prinsip 'cukup baik' (solusi 80%)",
        "Hanya matriks keputusan",
        "Hanya batas waktu"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Pengambilan Keputusan",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#decision-making", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Seseorang secara konsisten menunda keputusan, mencari lebih banyak informasi tetapi tidak pernah memutuskan, menyebabkan peluang terlewat. Menurut kerangka pelajaran, apa masalah intinya?",
      options: [
        "Tidak ada informasi yang cukup",
        "Kelumpuhan analisis - kurang kerangka keputusan, batas waktu, dan prinsip 'cukup baik' yang mencegah analisis berlebihan dan memungkinkan kemajuan",
        "Terlalu banyak keputusan",
        "Kerangka keputusan tidak perlu"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Pengambilan Keputusan",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#decision-making", "#advanced", "#critical-thinking", "#id", "#all-languages"]
    }
  ],
  // Arabic (AR) - Professional translations (RTL)
  AR: [
    {
      question: "وفقًا للدرس، ما هي شلل التحليل?",
      options: [
        "اتخاذ القرار بسرعة كبيرة",
        "الكثير من المعلومات والخيارات تمنع اتخاذ القرار، مما يؤدي إلى التأجيل",
        "اختيار الخيار الأول",
        "فقط للأشخاص المتعلمين"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "اتخاذ القرار",
      questionType: QuestionType.RECALL,
      hashtags: ["#decision-making", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، ما هي خطوات مصفوفة القرار?",
      options: [
        "فقط اختر عشوائيًا",
        "قائمة الخيارات والمعايير، وزن المعايير، تقييم كل خيار، ضرب النتائج بالأوزان والجمع",
        "فقط قائمة الخيارات",
        "لا حاجة للهيكل"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "مصفوفة القرار",
      questionType: QuestionType.RECALL,
      hashtags: ["#decision-matrix", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، كم ساعة يجب أن تحلل قرارًا 'كبيرًا'?",
      options: [
        "أقل من ساعة",
        "1-2 ساعة",
        "4+ ساعات",
        "لا فرق"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "اتخاذ القرار",
      questionType: QuestionType.RECALL,
      hashtags: ["#decision-making", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "لماذا أطر اتخاذ القرار مهمة وفقًا للدرس?",
      options: [
        "إنها تلغي جميع القرارات",
        "إنها تمنع شلل التحليل، تقلل من إجهاد القرار، تمكن من التقدم الأسرع بقرارات 'جيدة بما فيه الكفاية'، وتساعد في تصنيف القرارات حسب الأهمية",
        "تنطبق فقط على الفرق الكبيرة",
        "لا تتطلب جهدًا"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "اتخاذ القرار",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#decision-making", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "لديك قرار صغير قابل للعكس يستغرق أقل من ساعة للتحليل. وفقًا للدرس، ماذا يجب أن تفعل?",
      options: [
        "حلل 4+ ساعات",
        "قرر فورًا، صحح لاحقًا إذا لزم الأمر",
        "لا تقرر أبدًا",
        "استخدم فقط مصفوفة القرار"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "اتخاذ القرار",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#decision-making", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "تريد تحسين عملية اتخاذ القرار لديك. وفقًا للدرس، ماذا يجب أن تنشئ?",
      options: [
        "فقط قرر عشوائيًا",
        "ثلاث فئات قرار (صغيرة، متوسطة، كبيرة) مع حدود زمنية، مصفوفة قرار للقرارات المتوسطة/الكبيرة، ومبدأ 'جيد بما فيه الكفاية' (حل 80%)",
        "فقط مصفوفة القرار",
        "فقط الحدود الزمنية"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "اتخاذ القرار",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#decision-making", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "شخص يؤجل القرارات باستمرار، يبحث عن المزيد من المعلومات لكنه لا يقرر أبدًا، مما يؤدي إلى فرص ضائعة. وفقًا لإطار الدرس، ما هي المشكلة الأساسية?",
      options: [
        "لا توجد معلومات كافية",
        "شلل التحليل - نقص أطر القرار، الحدود الزمنية، ومبدأ 'جيد بما فيه الكفاية' التي تمنع التحليل المفرط وتمكن من التقدم",
        "الكثير من القرارات",
        "أطر القرار غير ضرورية"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "اتخاذ القرار",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#decision-making", "#advanced", "#critical-thinking", "#ar", "#all-languages"]
    }
  ],
  // Portuguese (PT) - Professional translations (Brazilian)
  PT: [
    {
      question: "De acordo com a lição, o que é paralisia por análise?",
      options: [
        "Decidir muito rapidamente",
        "Muita informação e opções impedem a decisão, levando à procrastinação",
        "Escolher a primeira opção",
        "Apenas para pessoas educadas"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Tomada de Decisão",
      questionType: QuestionType.RECALL,
      hashtags: ["#decision-making", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, quais são os passos em uma matriz de decisão?",
      options: [
        "Apenas escolha aleatoriamente",
        "Lista de opções e critérios, ponderar critérios, pontuar cada opção, multiplicar pontuações por pesos e somar",
        "Apenas lista de opções",
        "Estrutura não é necessária"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Matriz de Decisão",
      questionType: QuestionType.RECALL,
      hashtags: ["#decision-matrix", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, quantas horas você deve analisar uma decisão 'grande'?",
      options: [
        "Menos de 1 hora",
        "1-2 horas",
        "4+ horas",
        "Sem diferença"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Tomada de Decisão",
      questionType: QuestionType.RECALL,
      hashtags: ["#decision-making", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "Por que estruturas de tomada de decisão são importantes de acordo com a lição?",
      options: [
        "Eles eliminam todas as decisões",
        "Eles previnem paralisia por análise, reduzem fadiga de decisão, permitem progresso mais rápido com decisões 'boas o suficiente' e ajudam a categorizar decisões por importância",
        "Aplicam-se apenas a grandes equipes",
        "Não requerem esforço"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Tomada de Decisão",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#decision-making", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Você tem uma decisão pequena e reversível que leva menos de 1 hora para analisar. De acordo com a lição, o que você deve fazer?",
      options: [
        "Analise 4+ horas",
        "Decida imediatamente, corrija depois se necessário",
        "Nunca decida",
        "Use apenas matriz de decisão"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Tomada de Decisão",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#decision-making", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Você quer melhorar seu processo de tomada de decisão. De acordo com a lição, o que você deve estabelecer?",
      options: [
        "Apenas decida aleatoriamente",
        "Três categorias de decisão (pequena, média, grande) com limites de tempo, matriz de decisão para decisões médias/grandes e princípio 'bom o suficiente' (solução 80%)",
        "Apenas matriz de decisão",
        "Apenas limites de tempo"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Tomada de Decisão",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#decision-making", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Uma pessoa consistentemente adia decisões, buscando mais informações mas nunca decidindo, levando a oportunidades perdidas. De acordo com a estrutura da lição, qual é o problema central?",
      options: [
        "Não há informações suficientes",
        "Paralisia por análise - faltam estruturas de decisão, limites de tempo e princípio 'bom o suficiente' que previnem análise excessiva e permitem progresso",
        "Muitas decisões",
        "Estruturas de decisão são desnecessárias"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Tomada de Decisão",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#decision-making", "#advanced", "#critical-thinking", "#pt", "#all-languages"]
    }
  ],
  // Hindi (HI) - Professional translations
  HI: [
    {
      question: "पाठ के अनुसार, विश्लेषण पक्षाघात क्या है?",
      options: [
        "बहुत जल्दी निर्णय लेना",
        "बहुत अधिक जानकारी और विकल्प निर्णय लेने से रोकते हैं, जिससे टालमटोल होता है",
        "पहला विकल्प चुनना",
        "केवल शिक्षित लोगों के लिए"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "निर्णय लेना",
      questionType: QuestionType.RECALL,
      hashtags: ["#decision-making", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, निर्णय मैट्रिक्स में चरण क्या हैं?",
      options: [
        "बस यादृच्छिक रूप से चुनें",
        "विकल्पों और मानदंडों की सूची, मानदंडों को वजन देना, प्रत्येक विकल्प को स्कोर करना, स्कोर को वजन से गुणा करना और योग करना",
        "केवल विकल्पों की सूची",
        "संरचना की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "निर्णय मैट्रिक्स",
      questionType: QuestionType.RECALL,
      hashtags: ["#decision-matrix", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, आपको एक 'बड़े' निर्णय का विश्लेषण कितने घंटे करना चाहिए?",
      options: [
        "1 घंटे से कम",
        "1-2 घंटे",
        "4+ घंटे",
        "कोई अंतर नहीं"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "निर्णय लेना",
      questionType: QuestionType.RECALL,
      hashtags: ["#decision-making", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार निर्णय लेने के ढांचे क्यों महत्वपूर्ण हैं?",
      options: [
        "वे सभी निर्णयों को समाप्त करते हैं",
        "वे विश्लेषण पक्षाघात को रोकते हैं, निर्णय थकान को कम करते हैं, 'पर्याप्त अच्छे' निर्णयों के साथ तेजी से प्रगति सक्षम करते हैं, और महत्व के अनुसार निर्णयों को वर्गीकृत करने में मदद करते हैं",
        "वे केवल बड़ी टीमों पर लागू होते हैं",
        "उन्हें प्रयास की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "निर्णय लेना",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#decision-making", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "आपके पास एक छोटा, प्रतिवर्ती निर्णय है जिसका विश्लेषण करने में 1 घंटे से कम समय लगता है। पाठ के अनुसार, आपको क्या करना चाहिए?",
      options: [
        "4+ घंटे विश्लेषण करें",
        "तुरंत निर्णय लें, यदि आवश्यक हो तो बाद में सुधार करें",
        "कभी निर्णय न लें",
        "केवल निर्णय मैट्रिक्स का उपयोग करें"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "निर्णय लेना",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#decision-making", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "आप अपनी निर्णय लेने की प्रक्रिया में सुधार करना चाहते हैं। पाठ के अनुसार, आपको क्या स्थापित करना चाहिए?",
      options: [
        "बस यादृच्छिक रूप से निर्णय लें",
        "समय सीमा के साथ तीन निर्णय श्रेणियां (छोटी, मध्यम, बड़ी), मध्यम/बड़े निर्णयों के लिए निर्णय मैट्रिक्स, और 'पर्याप्त अच्छा' सिद्धांत (80% समाधान)",
        "केवल निर्णय मैट्रिक्स",
        "केवल समय सीमा"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "निर्णय लेना",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#decision-making", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक व्यक्ति लगातार निर्णयों को स्थगित करता है, अधिक जानकारी की तलाश करता है लेकिन कभी निर्णय नहीं लेता, जिससे अवसर खो जाते हैं। पाठ के ढांचे के अनुसार, मुख्य समस्या क्या है?",
      options: [
        "पर्याप्त जानकारी नहीं है",
        "विश्लेषण पक्षाघात - निर्णय ढांचे, समय सीमा, और 'पर्याप्त अच्छा' सिद्धांत गायब हैं जो अत्यधिक विश्लेषण को रोकते हैं और प्रगति सक्षम करते हैं",
        "बहुत अधिक निर्णय",
        "निर्णय ढांचे अनावश्यक हैं"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "निर्णय लेना",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#decision-making", "#advanced", "#critical-thinking", "#hi", "#all-languages"]
    }
  ]
};

async function seedDay13Enhanced() {
  try {
    await connectDB();
    console.log('🌱 SEEDING DAY 13 ENHANCED QUIZ QUESTIONS\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    let totalQuestions = 0;
    let totalUpdated = 0;
    let totalCreated = 0;

    for (const lang of LANGUAGES) {
      const courseId = `${COURSE_ID_BASE}_${lang}`;
      const lessonId = `${COURSE_ID_BASE}_${lang}_DAY_13`;

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
      const questions = DAY13_QUESTIONS[lang];
      
      if (!questions || questions.length === 0) {
        console.error(`   ❌ ERROR: No questions defined for ${lang}! Questions MUST be in course language.`);
        throw new Error(`Missing translations for ${lang} - Day 13 questions must be in course language, not English fallback`);
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
    console.log(`\n✅ DAY 13 ENHANCEMENT COMPLETE!\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedDay13Enhanced();
