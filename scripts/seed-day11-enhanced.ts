/**
 * Seed Day 11 Enhanced Quiz Questions
 * 
 * Purpose: Enhance Day 11 quizzes from 5 to 7 questions across all 10 languages
 * Why: Part of Quiz Quality Enhancement - Phase 1, Day 11
 * 
 * Lesson Topic: Goal Setting & OKRs (SMART goals, OKR framework)
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
const DAY_NUMBER = 11;
const LANGUAGES = ['HU', 'EN', 'TR', 'BG', 'PL', 'VI', 'ID', 'AR', 'PT', 'HI'];

/**
 * Day 11 Enhanced Questions - All Languages
 * Topic: Goal Setting & OKRs
 * Structure: 7 questions per language
 * Q1-Q3: Keep (Recall - foundational concepts)
 * Q4: Rewritten (Application - from definition to purpose)
 * Q5: Keep (Application - scenario-based)
 * Q6: New (Application - practical implementation)
 * Q7: New (Critical Thinking - systems integration)
 */
const DAY11_QUESTIONS: Record<string, Array<{
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: QuestionDifficulty;
  category: string;
  questionType: QuestionType;
  hashtags: string[];
}>> = {
  EN: [
    // Q1: SMART - S meaning (RECALL - Keep)
    {
      question: "According to the lesson, what does S mean in SMART?",
      options: [
        "Strong",
        "Simple",
        "Specific",
        "Strategic"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Goal Setting",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q2: OKR meaning (RECALL - Keep)
    {
      question: "According to the lesson, what does OKR stand for?",
      options: [
        "Operations and Key Reports",
        "Objectives and Key Results",
        "Organization and Key Roles",
        "Overall and Key Responsibilities"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Goal Setting",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q3: OKR structure levels (RECALL - Keep)
    {
      question: "According to the lesson, how many levels are in OKR structure?",
      options: [
        "1 level",
        "2 levels",
        "3 levels",
        "4 levels"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Goal Setting",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q4: Why SMART goals matter (APPLICATION - Rewritten from definition)
    {
      question: "Why are SMART goals important according to the lesson?",
      options: [
        "They are shorter to write",
        "They provide direction, create motivation, and enable measurement of success",
        "They eliminate the need for planning",
        "They only apply to long-term goals"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Goal Setting",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q5: Ideal goal period (APPLICATION - Keep)
    {
      question: "According to the lesson, what is the ideal goal period?",
      options: [
        "1 month",
        "3 months",
        "6 months",
        "1 year"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Goal Setting",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q6: Breaking goals into tasks (APPLICATION - New)
    {
      question: "A person sets a 3-month goal to increase sales by 30% but doesn't know where to start. According to the lesson, what should they do?",
      options: [
        "Wait for inspiration",
        "Break the goal into weekly/daily tasks, track progress, and adjust course as needed",
        "Set a longer deadline",
        "Focus only on the final outcome"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Goal Setting",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q7: OKR vs SMART integration (CRITICAL THINKING - New)
    {
      question: "A manager wants to set goals for their team. They understand SMART goals and OKRs separately but aren't sure how they work together. According to the lesson's framework, what is the relationship?",
      options: [
        "Use only SMART or only OKR, not both",
        "OKRs provide the structure (Objectives and Key Results), while SMART criteria ensure each component is well-defined and measurable",
        "SMART is for individuals, OKR is for teams",
        "They are completely unrelated frameworks"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Goal Setting",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#goal-setting", "#advanced", "#critical-thinking", "#en", "#all-languages"]
    }
  ],
  // Hungarian translations
  HU: [
    {
      question: "A lecke szerint mit jelent az S a SMART-ban?",
      options: [
        "Strong",
        "Simple",
        "Specific",
        "Strategic"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Célkitűzés",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint mit jelent az OKR?",
      options: [
        "Operations and Key Reports",
        "Objectives and Key Results",
        "Organization and Key Roles",
        "Overall and Key Responsibilities"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Célkitűzés",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint hány szintű az OKR szerkezet?",
      options: [
        "1 szint",
        "2 szint",
        "3 szint",
        "4 szint"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Célkitűzés",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "Miért fontosak a SMART célok a lecke szerint?",
      options: [
        "Rövidebbek írni",
        "Irányt adnak, motivációt teremtenek, és lehetővé teszik a siker mérését",
        "Kiküszöbölik a tervezés szükségességét",
        "Csak hosszú távú célokra vonatkoznak"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Célkitűzés",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint mi az ideális célperiódus?",
      options: [
        "1 hónap",
        "3 hónap",
        "6 hónap",
        "1 év"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Célkitűzés",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy személy 3 hónapos célt tűz ki, hogy 30%-kal növelje az eladásokat, de nem tudja, hol kezdje. A lecke szerint mit kellene tennie?",
      options: [
        "Várjon az inspirációra",
        "Bontsa fel a célt heti/napi feladatokra, kövesse nyomon a haladást, és igazítsa az útvonalat szükség szerint",
        "Állítson be hosszabb határidőt",
        "Csak a végeredményre koncentráljon"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Célkitűzés",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy menedzser célokat szeretne kitűzni a csapatának. Érti a SMART célokat és az OKR-eket külön-külön, de nem biztos abban, hogyan működnek együtt. A lecke keretrendszere szerint mi a kapcsolat?",
      options: [
        "Használjon csak SMART-ot vagy csak OKR-t, ne mindkettőt",
        "Az OKR-ek biztosítják a szerkezetet (Célok és Kulcseredmények), míg a SMART kritériumok biztosítják, hogy minden komponens jól definiált és mérhető legyen",
        "A SMART egyéni, az OKR csapatoknak szól",
        "Teljesen kapcsolatlan keretrendszerek"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Célkitűzés",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#goal-setting", "#advanced", "#critical-thinking", "#hu", "#all-languages"]
    }
  ],
  // Turkish (TR) - Professional translations
  TR: [
    {
      question: "Derse göre SMART'ta S ne anlama gelir?",
      options: [
        "Strong",
        "Simple",
        "Specific",
        "Strategic"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Hedef Belirleme",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre OKR ne anlama gelir?",
      options: [
        "Operations and Key Reports",
        "Objectives and Key Results",
        "Organization and Key Roles",
        "Overall and Key Responsibilities"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Hedef Belirleme",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre OKR yapısında kaç seviye var?",
      options: [
        "1 seviye",
        "2 seviye",
        "3 seviye",
        "4 seviye"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Hedef Belirleme",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre SMART hedefler neden önemlidir?",
      options: [
        "Yazmak daha kısadır",
        "Yön sağlarlar, motivasyon yaratırlar ve başarının ölçülmesini mümkün kılarlar",
        "Planlama ihtiyacını ortadan kaldırırlar",
        "Sadece uzun vadeli hedeflere uygulanırlar"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Hedef Belirleme",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre ideal hedef süresi nedir?",
      options: [
        "1 ay",
        "3 ay",
        "6 ay",
        "1 yıl"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Hedef Belirleme",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir kişi satışları %30 artırmak için 3 aylık bir hedef belirliyor ancak nereden başlayacağını bilmiyor. Derse göre ne yapmalı?",
      options: [
        "İlham beklemek",
        "Hedefi haftalık/günlük görevlere bölmek, ilerlemeyi takip etmek ve gerektiğinde rotayı ayarlamak",
        "Daha uzun bir son tarih belirlemek",
        "Sadece nihai sonuca odaklanmak"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Hedef Belirleme",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir yönetici ekibi için hedefler belirlemek istiyor. SMART hedefleri ve OKR'leri ayrı ayrı anlıyor ancak birlikte nasıl çalıştıklarından emin değil. Dersin çerçevesine göre ilişki nedir?",
      options: [
        "Sadece SMART veya sadece OKR kullanın, ikisini birden değil",
        "OKR'ler yapıyı sağlar (Hedefler ve Anahtar Sonuçlar), SMART kriterleri ise her bileşenin iyi tanımlanmış ve ölçülebilir olmasını sağlar",
        "SMART bireysel içindir, OKR ekipler içindir",
        "Tamamen ilgisiz çerçevelerdir"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Hedef Belirleme",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#goal-setting", "#advanced", "#critical-thinking", "#tr", "#all-languages"]
    }
  ],
  // Bulgarian (BG) - Professional translations
  BG: [
    {
      question: "Според урока, какво означава S в SMART?",
      options: [
        "Strong",
        "Simple",
        "Specific",
        "Strategic"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Определяне на цели",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, какво означава OKR?",
      options: [
        "Operations and Key Reports",
        "Objectives and Key Results",
        "Organization and Key Roles",
        "Overall and Key Responsibilities"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Определяне на цели",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, колко нива има OKR структурата?",
      options: [
        "1 ниво",
        "2 нива",
        "3 нива",
        "4 нива"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Определяне на цели",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Защо SMART целите са важни според урока?",
      options: [
        "По-кратки са за писане",
        "Осигуряват посока, създават мотивация и позволяват измерване на успеха",
        "Елиминират необходимостта от планиране",
        "Прилагат се само за дългосрочни цели"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Определяне на цели",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, какъв е идеалният период на целта?",
      options: [
        "1 месец",
        "3 месеца",
        "6 месеца",
        "1 година"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Определяне на цели",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Човек поставя 3-месечна цел да увеличи продажбите с 30%, но не знае откъде да започне. Според урока, какво трябва да направи?",
      options: [
        "Да чака вдъхновение",
        "Да разбие целта на седмични/дневни задачи, да проследи напредъка и да коригира курса при нужда",
        "Да определи по-дълъг срок",
        "Да се фокусира само върху крайния резултат"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Определяне на цели",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Мениджър иска да определи цели за своя екип. Разбира SMART целите и OKR отделно, но не е сигурен как работят заедно. Според рамката на урока, каква е връзката?",
      options: [
        "Използвайте само SMART или само OKR, не и двете",
        "OKR осигуряват структурата (Цели и Ключови Резултати), докато SMART критериите гарантират, че всеки компонент е добре дефиниран и измерим",
        "SMART е за индивиди, OKR е за екипи",
        "Те са напълно несвързани рамки"
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
      question: "Według lekcji, co oznacza S w SMART?",
      options: [
        "Strong",
        "Simple",
        "Specific",
        "Strategic"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Ustalanie Celów",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, co oznacza OKR?",
      options: [
        "Operations and Key Reports",
        "Objectives and Key Results",
        "Organization and Key Roles",
        "Overall and Key Responsibilities"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Ustalanie Celów",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, ile poziomów ma struktura OKR?",
      options: [
        "1 poziom",
        "2 poziomy",
        "3 poziomy",
        "4 poziomy"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Ustalanie Celów",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Dlaczego cele SMART są ważne według lekcji?",
      options: [
        "Są krótsze do napisania",
        "Zapewniają kierunek, tworzą motywację i umożliwiają pomiar sukcesu",
        "Eliminują potrzebę planowania",
        "Stosują się tylko do celów długoterminowych"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Ustalanie Celów",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, jaki jest idealny okres celu?",
      options: [
        "1 miesiąc",
        "3 miesiące",
        "6 miesięcy",
        "1 rok"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Ustalanie Celów",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Osoba ustala 3-miesięczny cel zwiększenia sprzedaży o 30%, ale nie wie, od czego zacząć. Według lekcji, co powinna zrobić?",
      options: [
        "Czekać na inspirację",
        "Podzielić cel na zadania tygodniowe/dzienne, śledzić postępy i korygować kurs w razie potrzeby",
        "Ustawić dłuższy termin",
        "Skupić się tylko na końcowym wyniku"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Ustalanie Celów",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Menedżer chce ustalić cele dla swojego zespołu. Rozumie cele SMART i OKR osobno, ale nie jest pewien, jak działają razem. Według ram lekcji, jaki jest związek?",
      options: [
        "Użyj tylko SMART lub tylko OKR, nie obu",
        "OKR zapewniają strukturę (Cele i Kluczowe Wyniki), podczas gdy kryteria SMART zapewniają, że każdy komponent jest dobrze zdefiniowany i mierzalny",
        "SMART jest dla jednostek, OKR jest dla zespołów",
        "Są to całkowicie niezwiązane ramy"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Ustalanie Celów",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#goal-setting", "#advanced", "#critical-thinking", "#pl", "#all-languages"]
    }
  ],
  // Vietnamese (VI) - Professional translations
  VI: [
    {
      question: "Theo bài học, S trong SMART có nghĩa là gì?",
      options: [
        "Strong",
        "Simple",
        "Specific",
        "Strategic"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Đặt Mục Tiêu",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, OKR viết tắt của gì?",
      options: [
        "Operations and Key Reports",
        "Objectives and Key Results",
        "Organization and Key Roles",
        "Overall and Key Responsibilities"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Đặt Mục Tiêu",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, có bao nhiêu cấp độ trong cấu trúc OKR?",
      options: [
        "1 cấp độ",
        "2 cấp độ",
        "3 cấp độ",
        "4 cấp độ"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Đặt Mục Tiêu",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Tại sao mục tiêu SMART quan trọng theo bài học?",
      options: [
        "Ngắn gọn hơn để viết",
        "Cung cấp hướng dẫn, tạo động lực và cho phép đo lường thành công",
        "Loại bỏ nhu cầu lập kế hoạch",
        "Chỉ áp dụng cho mục tiêu dài hạn"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Đặt Mục Tiêu",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, khoảng thời gian lý tưởng cho mục tiêu là gì?",
      options: [
        "1 tháng",
        "3 tháng",
        "6 tháng",
        "1 năm"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Đặt Mục Tiêu",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Một người đặt mục tiêu 3 tháng để tăng doanh số 30% nhưng không biết bắt đầu từ đâu. Theo bài học, họ nên làm gì?",
      options: [
        "Chờ cảm hứng",
        "Chia mục tiêu thành nhiệm vụ hàng tuần/hàng ngày, theo dõi tiến độ và điều chỉnh hướng khi cần",
        "Đặt thời hạn dài hơn",
        "Chỉ tập trung vào kết quả cuối cùng"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Đặt Mục Tiêu",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Một người quản lý muốn đặt mục tiêu cho nhóm của họ. Họ hiểu mục tiêu SMART và OKR riêng biệt nhưng không chắc chúng hoạt động cùng nhau như thế nào. Theo khung của bài học, mối quan hệ là gì?",
      options: [
        "Chỉ sử dụng SMART hoặc chỉ OKR, không phải cả hai",
        "OKR cung cấp cấu trúc (Mục tiêu và Kết quả then chốt), trong khi tiêu chí SMART đảm bảo mỗi thành phần được xác định rõ ràng và có thể đo lường",
        "SMART dành cho cá nhân, OKR dành cho nhóm",
        "Chúng là các khung hoàn toàn không liên quan"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Đặt Mục Tiêu",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#goal-setting", "#advanced", "#critical-thinking", "#vi", "#all-languages"]
    }
  ],
  // Indonesian (ID) - Professional translations
  ID: [
    {
      question: "Menurut pelajaran, apa yang berarti S dalam SMART?",
      options: [
        "Strong",
        "Simple",
        "Specific",
        "Strategic"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Penetapan Tujuan",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, apa singkatan OKR?",
      options: [
        "Operations and Key Reports",
        "Objectives and Key Results",
        "Organization and Key Roles",
        "Overall and Key Responsibilities"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Penetapan Tujuan",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, berapa banyak tingkat dalam struktur OKR?",
      options: [
        "1 tingkat",
        "2 tingkat",
        "3 tingkat",
        "4 tingkat"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Penetapan Tujuan",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Mengapa tujuan SMART penting menurut pelajaran?",
      options: [
        "Lebih pendek untuk ditulis",
        "Menyediakan arah, menciptakan motivasi, dan memungkinkan pengukuran kesuksesan",
        "Menghilangkan kebutuhan perencanaan",
        "Hanya berlaku untuk tujuan jangka panjang"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Penetapan Tujuan",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, berapa periode tujuan ideal?",
      options: [
        "1 bulan",
        "3 bulan",
        "6 bulan",
        "1 tahun"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Penetapan Tujuan",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Seseorang menetapkan tujuan 3 bulan untuk meningkatkan penjualan 30% tetapi tidak tahu harus mulai dari mana. Menurut pelajaran, apa yang harus mereka lakukan?",
      options: [
        "Menunggu inspirasi",
        "Memecah tujuan menjadi tugas mingguan/harian, melacak kemajuan, dan menyesuaikan arah sesuai kebutuhan",
        "Menetapkan tenggat waktu yang lebih lama",
        "Hanya fokus pada hasil akhir"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Penetapan Tujuan",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Seorang manajer ingin menetapkan tujuan untuk tim mereka. Mereka memahami tujuan SMART dan OKR secara terpisah tetapi tidak yakin bagaimana mereka bekerja bersama. Menurut kerangka pelajaran, apa hubungannya?",
      options: [
        "Gunakan hanya SMART atau hanya OKR, bukan keduanya",
        "OKR menyediakan struktur (Tujuan dan Hasil Utama), sementara kriteria SMART memastikan setiap komponen didefinisikan dengan baik dan dapat diukur",
        "SMART untuk individu, OKR untuk tim",
        "Mereka adalah kerangka yang sama sekali tidak terkait"
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
      question: "وفقًا للدرس، ماذا يعني S في SMART؟",
      options: [
        "Strong",
        "Simple",
        "Specific",
        "Strategic"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "تحديد الأهداف",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، ماذا تعني OKR؟",
      options: [
        "Operations and Key Reports",
        "Objectives and Key Results",
        "Organization and Key Roles",
        "Overall and Key Responsibilities"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "تحديد الأهداف",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، كم عدد المستويات في هيكل OKR؟",
      options: [
        "مستوى واحد",
        "مستويان",
        "3 مستويات",
        "4 مستويات"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "تحديد الأهداف",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "لماذا الأهداف الذكية مهمة وفقًا للدرس؟",
      options: [
        "أقصر في الكتابة",
        "توفر الاتجاه، تخلق الدافع، وتسمح بقياس النجاح",
        "تلغي الحاجة للتخطيط",
        "تنطبق فقط على الأهداف طويلة المدى"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "تحديد الأهداف",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، ما هي فترة الهدف المثالية؟",
      options: [
        "شهر واحد",
        "3 أشهر",
        "6 أشهر",
        "سنة واحدة"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "تحديد الأهداف",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "شخص يحدد هدفًا لمدة 3 أشهر لزيادة المبيعات بنسبة 30% لكنه لا يعرف من أين يبدأ. وفقًا للدرس، ماذا يجب أن يفعل؟",
      options: [
        "انتظار الإلهام",
        "تقسيم الهدف إلى مهام أسبوعية/يومية، تتبع التقدم، وتعديل المسار حسب الحاجة",
        "تعيين موعد نهائي أطول",
        "التركيز فقط على النتيجة النهائية"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "تحديد الأهداف",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "مدير يريد تحديد أهداف لفريقه. يفهم أهداف SMART و OKR بشكل منفصل لكنه غير متأكد من كيفية عملهما معًا. وفقًا لإطار الدرس، ما هي العلاقة؟",
      options: [
        "استخدم فقط SMART أو فقط OKR، وليس كلاهما",
        "OKR توفر الهيكل (الأهداف والنتائج الرئيسية)، بينما معايير SMART تضمن أن كل مكون محدد جيدًا وقابل للقياس",
        "SMART للأفراد، OKR للفرق",
        "هما أطر غير مرتبطة تمامًا"
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
      question: "De acordo com a lição, o que significa S em SMART?",
      options: [
        "Strong",
        "Simple",
        "Specific",
        "Strategic"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Definição de Metas",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, o que significa OKR?",
      options: [
        "Operations and Key Reports",
        "Objectives and Key Results",
        "Organization and Key Roles",
        "Overall and Key Responsibilities"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Definição de Metas",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, quantos níveis existem na estrutura OKR?",
      options: [
        "1 nível",
        "2 níveis",
        "3 níveis",
        "4 níveis"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Definição de Metas",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "Por que metas SMART são importantes de acordo com a lição?",
      options: [
        "São mais curtas para escrever",
        "Fornecem direção, criam motivação e permitem medir o sucesso",
        "Eliminam a necessidade de planejamento",
        "Aplicam-se apenas a metas de longo prazo"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Definição de Metas",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, qual é o período de objetivo ideal?",
      options: [
        "1 mês",
        "3 meses",
        "6 meses",
        "1 ano"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Definição de Metas",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Uma pessoa define uma meta de 3 meses para aumentar as vendas em 30%, mas não sabe por onde começar. De acordo com a lição, o que ela deve fazer?",
      options: [
        "Esperar por inspiração",
        "Dividir a meta em tarefas semanais/diárias, acompanhar o progresso e ajustar o curso conforme necessário",
        "Definir um prazo mais longo",
        "Focar apenas no resultado final"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Definição de Metas",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Um gerente quer definir metas para sua equipe. Ele entende metas SMART e OKRs separadamente, mas não tem certeza de como funcionam juntos. De acordo com a estrutura da lição, qual é o relacionamento?",
      options: [
        "Use apenas SMART ou apenas OKR, não ambos",
        "OKRs fornecem a estrutura (Objetivos e Resultados-Chave), enquanto os critérios SMART garantem que cada componente seja bem definido e mensurável",
        "SMART é para indivíduos, OKR é para equipes",
        "Eles são estruturas completamente não relacionadas"
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
      question: "पाठ के अनुसार, SMART में S का अर्थ क्या है?",
      options: [
        "Strong",
        "Simple",
        "Specific",
        "Strategic"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "लक्ष्य निर्धारण",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, OKR का अर्थ क्या है?",
      options: [
        "Operations and Key Reports",
        "Objectives and Key Results",
        "Organization and Key Roles",
        "Overall and Key Responsibilities"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "लक्ष्य निर्धारण",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, OKR संरचना में कितने स्तर हैं?",
      options: [
        "1 स्तर",
        "2 स्तर",
        "3 स्तर",
        "4 स्तर"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "लक्ष्य निर्धारण",
      questionType: QuestionType.RECALL,
      hashtags: ["#goal-setting", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार SMART लक्ष्य महत्वपूर्ण क्यों हैं?",
      options: [
        "लिखने में छोटे हैं",
        "दिशा प्रदान करते हैं, प्रेरणा बनाते हैं, और सफलता को मापने में सक्षम बनाते हैं",
        "योजना की आवश्यकता को समाप्त करते हैं",
        "केवल दीर्घकालिक लक्ष्यों पर लागू होते हैं"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "लक्ष्य निर्धारण",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, आदर्श लक्ष्य अवधि क्या है?",
      options: [
        "1 महीना",
        "3 महीने",
        "6 महीने",
        "1 वर्ष"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "लक्ष्य निर्धारण",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक व्यक्ति बिक्री में 30% वृद्धि के लिए 3 महीने का लक्ष्य निर्धारित करता है लेकिन नहीं जानता कि कहाँ से शुरू करें। पाठ के अनुसार, उन्हें क्या करना चाहिए?",
      options: [
        "प्रेरणा की प्रतीक्षा करना",
        "लक्ष्य को साप्ताहिक/दैनिक कार्यों में विभाजित करना, प्रगति को ट्रैक करना, और आवश्यकतानुसार पाठ्यक्रम को समायोजित करना",
        "एक लंबी समय सीमा निर्धारित करना",
        "केवल अंतिम परिणाम पर ध्यान केंद्रित करना"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "लक्ष्य निर्धारण",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक प्रबंधक अपनी टीम के लिए लक्ष्य निर्धारित करना चाहता है। वे SMART लक्ष्यों और OKR को अलग-अलग समझते हैं लेकिन निश्चित नहीं हैं कि वे एक साथ कैसे काम करते हैं। पाठ के ढांचे के अनुसार, संबंध क्या है?",
      options: [
        "केवल SMART या केवल OKR का उपयोग करें, दोनों नहीं",
        "OKR संरचना प्रदान करते हैं (उद्देश्य और प्रमुख परिणाम), जबकि SMART मानदंड यह सुनिश्चित करते हैं कि प्रत्येक घटक अच्छी तरह से परिभाषित और मापने योग्य हो",
        "SMART व्यक्तियों के लिए है, OKR टीमों के लिए है",
        "वे पूरी तरह से असंबंधित ढांचे हैं"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "लक्ष्य निर्धारण",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#goal-setting", "#advanced", "#critical-thinking", "#hi", "#all-languages"]
    }
  ]
};

async function seedDay11Enhanced() {
  try {
    await connectDB();
    console.log('🌱 SEEDING DAY 11 ENHANCED QUIZ QUESTIONS\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    let totalQuestions = 0;
    let totalUpdated = 0;
    let totalCreated = 0;

    for (const lang of LANGUAGES) {
      const courseId = `${COURSE_ID_BASE}_${lang}`;
      const lessonId = `${COURSE_ID_BASE}_${lang}_DAY_11`;

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
      const questions = DAY11_QUESTIONS[lang] || DAY11_QUESTIONS['EN']; // Fallback to EN if not translated
      
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
    console.log(`\n✅ DAY 11 ENHANCEMENT COMPLETE!\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedDay11Enhanced();
