/**
 * Seed Day 5 Enhanced Quiz Questions
 * 
 * Purpose: Enhance Day 5 quizzes from 5 to 7 questions across all 10 languages
 * Why: Part of Quiz Quality Enhancement - Phase 1, Day 5
 * 
 * Lesson Topic: Measurement: simple weekly review metrics (throughput, focus blocks, carryover)
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
const DAY_NUMBER = 5;
const LANGUAGES = ['HU', 'EN', 'TR', 'BG', 'PL', 'VI', 'ID', 'AR', 'PT', 'HI'];

/**
 * Day 5 Enhanced Questions - All Languages
 * Topic: Measurement (throughput, focus blocks, carryover)
 * Structure: 7 questions per language
 * Q1-Q3: Keep (Recall - foundational concepts)
 * Q4: Rewritten (Application - from definition to purpose)
 * Q5: Keep (Application - scenario-based)
 * Q6: New (Application - practical implementation)
 * Q7: New (Critical Thinking - systems integration)
 */
const DAY5_QUESTIONS: Record<string, Array<{
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: QuestionDifficulty;
  category: string;
  questionType: QuestionType;
  hashtags: string[];
}>> = {
  EN: [
    // Q1: What is throughput (RECALL - Keep)
    {
      question: "According to the lesson, what is throughput?",
      options: [
        "Number of activities",
        "Number of completed important tasks",
        "Number of meetings",
        "Number of emails"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Measurement",
      questionType: QuestionType.RECALL,
      hashtags: ["#measurement", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q2: How many metrics (RECALL - Keep)
    {
      question: "How many key metrics does the lesson recommend for weekly review?",
      options: [
        "1",
        "2",
        "3",
        "4"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Measurement",
      questionType: QuestionType.RECALL,
      hashtags: ["#measurement", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q3: What is carryover (RECALL - Keep)
    {
      question: "According to the lesson, what is carryover?",
      options: [
        "Number of completed tasks",
        "Number of tasks remaining from last week",
        "Number of deep work blocks",
        "Number of meetings"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Measurement",
      questionType: QuestionType.RECALL,
      hashtags: ["#measurement", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q4: Why weekly review matters (APPLICATION - Rewritten from definition)
    {
      question: "Why is weekly review with these three metrics important according to the lesson?",
      options: [
        "It takes less time than daily reviews",
        "It provides objective data to identify improvement areas, not just feelings",
        "It replaces the need for daily planning",
        "It only measures activities, not outcomes"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Measurement",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#measurement", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q5: Low carryover meaning (APPLICATION - Keep)
    {
      question: "According to the lesson, what does low carryover indicate?",
      options: [
        "Bad planning",
        "Good planning",
        "Too much work",
        "Little work"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Measurement",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#measurement", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q6: Using metrics to improve (APPLICATION - New)
    {
      question: "A person's weekly review shows 6 focus blocks (target: 8) and high carryover (5 tasks). According to the lesson, what should they focus on improving?",
      options: [
        "Increase throughput by working longer hours",
        "Block more time for deep work and reduce overplanning to lower carryover",
        "Ignore the metrics and trust feelings",
        "Only measure throughput, ignore other metrics"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Measurement",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#measurement", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q7: Integrating all three metrics (CRITICAL THINKING - New)
    {
      question: "A manager has high throughput (10 tasks) but also high carryover (6 tasks) and only 3 focus blocks. According to the lesson's framework, what does this pattern suggest about their productivity?",
      options: [
        "Optimal productivity - all metrics are high",
        "A productivity trap - completing tasks but with poor planning and insufficient deep work quality",
        "Good time management",
        "Efficient multitasking"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Measurement",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#measurement", "#advanced", "#critical-thinking", "#en", "#all-languages"]
    }
  ],
  // Hungarian translations
  HU: [
    {
      question: "A lecke szerint mi a throughput?",
      options: [
        "A tevékenységek száma",
        "A befejezett fontos feladatok száma",
        "A meetingek száma",
        "Az email-ek száma"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Mérés",
      questionType: QuestionType.RECALL,
      hashtags: ["#measurement", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "Hány kulcsmetrikát ajánl a lecke a heti áttekintéshez?",
      options: [
        "1",
        "2",
        "3",
        "4"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Mérés",
      questionType: QuestionType.RECALL,
      hashtags: ["#measurement", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint mi a carryover?",
      options: [
        "A befejezett feladatok száma",
        "A múlt hétről maradt feladatok száma",
        "A deep work blokkok száma",
        "A meetingek száma"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Mérés",
      questionType: QuestionType.RECALL,
      hashtags: ["#measurement", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "Miért fontos a heti áttekintés ezzel a három metrikával a lecke szerint?",
      options: [
        "Kevesebb időt vesz igénybe, mint a napi áttekintések",
        "Objektív adatokat nyújt a javítási területek azonosításához, nem csak érzéseket",
        "Felváltja a napi tervezés szükségességét",
        "Csak tevékenységeket mér, nem eredményeket"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Mérés",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#measurement", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint mit jelez az alacsony carryover?",
      options: [
        "Rossz tervezés",
        "Jó tervezés",
        "Túl sok munka",
        "Kevés munka"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Mérés",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#measurement", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy személy heti áttekintése 6 fókusz blokkot mutat (cél: 8) és magas carryover-t (5 feladat). A lecke szerint mire kellene fókuszálniuk a javításban?",
      options: [
        "A throughput növelése hosszabb munkaidővel",
        "Több idő blokkolása deep work-hoz és a túltervezés csökkentése a carryover csökkentéséhez",
        "A metrikák figyelmen kívül hagyása és az érzések megbízása",
        "Csak a throughput mérése, más metrikák figyelmen kívül hagyása"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Mérés",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#measurement", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy menedzsernek magas a throughput-ja (10 feladat), de magas a carryover-je is (6 feladat) és csak 3 fókusz blokkja van. A lecke keretrendszere szerint mit sugall ez a minta a termelékenységükről?",
      options: [
        "Optimális termelékenység - minden metrika magas",
        "Termelékenységi csapda - feladatok befejezése, de rossz tervezéssel és elégtelen deep work minőséggel",
        "Jó időgazdálkodás",
        "Hatékony multitasking"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Mérés",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#measurement", "#advanced", "#critical-thinking", "#hu", "#all-languages"]
    }
  ],
  // Turkish (TR) - Professional translations
  TR: [
    {
      question: "Derse göre throughput nedir?",
      options: [
        "Aktivite sayısı",
        "Tamamlanan önemli görevlerin sayısı",
        "Toplantı sayısı",
        "E-posta sayısı"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Ölçüm",
      questionType: QuestionType.RECALL,
      hashtags: ["#measurement", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Ders haftalık incelemede kaç metrik önerir?",
      options: [
        "1",
        "2",
        "3",
        "4"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Ölçüm",
      questionType: QuestionType.RECALL,
      hashtags: ["#measurement", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre carryover nedir?",
      options: [
        "Tamamlanan görevlerin sayısı",
        "Geçen haftadan kalan görevlerin sayısı",
        "Deep work bloklarının sayısı",
        "Toplantı sayısı"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Ölçüm",
      questionType: QuestionType.RECALL,
      hashtags: ["#measurement", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre bu üç metrikle haftalık inceleme neden önemlidir?",
      options: [
        "Günlük incelemelerden daha az zaman alır",
        "Sadece duygular değil, iyileştirme alanlarını belirlemek için nesnel veriler sağlar",
        "Günlük planlamaya olan ihtiyacı değiştirir",
        "Sadece aktiviteleri ölçer, sonuçları değil"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Ölçüm",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#measurement", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre düşük carryover ne gösterir?",
      options: [
        "Kötü planlama",
        "İyi planlama",
        "Çok fazla iş",
        "Az iş"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Ölçüm",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#measurement", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir kişinin haftalık incelemesi 6 odak bloğu (hedef: 8) ve yüksek carryover (5 görev) gösteriyor. Derse göre neyi iyileştirmeye odaklanmalılar?",
      options: [
        "Daha uzun saatler çalışarak throughput'u artırmak",
        "Derin çalışma için daha fazla zaman bloke etmek ve carryover'ı düşürmek için aşırı planlamayı azaltmak",
        "Metrikleri görmezden gelmek ve duygulara güvenmek",
        "Sadece throughput'u ölçmek, diğer metrikleri görmezden gelmek"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Ölçüm",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#measurement", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir yöneticinin yüksek throughput'u (10 görev) var ama aynı zamanda yüksek carryover'ı (6 görev) ve sadece 3 odak bloğu var. Dersin çerçevesine göre bu model onların verimliliği hakkında neyi gösterir?",
      options: [
        "Optimal verimlilik - tüm metrikler yüksek",
        "Bir verimlilik tuzağı - görevleri tamamlıyorlar ama kötü planlama ve yetersiz derin çalışma kalitesi ile",
        "İyi zaman yönetimi",
        "Verimli çoklu görev"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Ölçüm",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#measurement", "#advanced", "#critical-thinking", "#tr", "#all-languages"]
    }
  ],
  // Bulgarian (BG) - Professional translations
  BG: [
    {
      question: "Според урока, какво е throughput?",
      options: [
        "Броят на дейностите",
        "Броят на завършените важни задачи",
        "Броят на срещите",
        "Броят на имейлите"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Измерване",
      questionType: QuestionType.RECALL,
      hashtags: ["#measurement", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Колко ключови метрики препоръчва урокът за седмичен преглед?",
      options: [
        "1",
        "2",
        "3",
        "4"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Измерване",
      questionType: QuestionType.RECALL,
      hashtags: ["#measurement", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, какво е carryover?",
      options: [
        "Броят на завършените задачи",
        "Броят на задачите, останали от миналата седмица",
        "Броят на блоковете за дълбока работа",
        "Броят на срещите"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Измерване",
      questionType: QuestionType.RECALL,
      hashtags: ["#measurement", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Защо е важен седмичният преглед с тези три метрики според урока?",
      options: [
        "Отнема по-малко време от дневните прегледи",
        "Предоставя обективни данни за идентифициране на области за подобрение, не само чувства",
        "Заменя необходимостта от дневно планиране",
        "Измерва само дейности, не резултати"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Измерване",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#measurement", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, какво показва ниското carryover?",
      options: [
        "Лошо планиране",
        "Добро планиране",
        "Твърде много работа",
        "Малко работа"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Измерване",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#measurement", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Седмичният преглед на човек показва 6 блока за фокус (цел: 8) и високо carryover (5 задачи). Според урока, върху какво трябва да се съсредоточат за подобрение?",
      options: [
        "Увеличаване на throughput чрез по-дълго работно време",
        "Блокиране на повече време за дълбока работа и намаляване на свръхпланирането за намаляване на carryover",
        "Игнориране на метриките и доверяване на чувствата",
        "Измерване само на throughput, игнориране на другите метрики"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Измерване",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#measurement", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Мениджърът има висок throughput (10 задачи), но също така високо carryover (6 задачи) и само 3 блока за фокус. Според рамката на урока, какво предполага този модел за тяхната продуктивност?",
      options: [
        "Оптимална продуктивност - всички метрики са високи",
        "Капан на продуктивността - завършване на задачи, но с лошо планиране и недостатъчно качество на дълбоката работа",
        "Добро управление на времето",
        "Ефективна многозадачност"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Измерване",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#measurement", "#advanced", "#critical-thinking", "#bg", "#all-languages"]
    }
  ],
  // Polish (PL) - Professional translations
  PL: [
    {
      question: "Według lekcji, czym jest throughput?",
      options: [
        "Liczba aktywności",
        "Liczba ukończonych ważnych zadań",
        "Liczba spotkań",
        "Liczba e-maili"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Pomiar",
      questionType: QuestionType.RECALL,
      hashtags: ["#measurement", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Ile kluczowych metryk zaleca lekcja do cotygodniowego przeglądu?",
      options: [
        "1",
        "2",
        "3",
        "4"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Pomiar",
      questionType: QuestionType.RECALL,
      hashtags: ["#measurement", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, czym jest carryover?",
      options: [
        "Liczba ukończonych zadań",
        "Liczba zadań pozostałych z zeszłego tygodnia",
        "Liczba bloków głębokiej pracy",
        "Liczba spotkań"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Pomiar",
      questionType: QuestionType.RECALL,
      hashtags: ["#measurement", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Dlaczego cotygodniowy przegląd z tymi trzema metrykami jest ważny według lekcji?",
      options: [
        "Zajmuje mniej czasu niż codzienne przeglądy",
        "Zapewnia obiektywne dane do identyfikacji obszarów poprawy, nie tylko uczucia",
        "Zastępuje potrzebę codziennego planowania",
        "Mierzy tylko aktywności, nie wyniki"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Pomiar",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#measurement", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, co oznacza niski carryover?",
      options: [
        "Złe planowanie",
        "Dobre planowanie",
        "Zbyt dużo pracy",
        "Mało pracy"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Pomiar",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#measurement", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Cotygodniowy przegląd osoby pokazuje 6 bloków skupienia (cel: 8) i wysoki carryover (5 zadań). Według lekcji, na czym powinni się skupić w poprawie?",
      options: [
        "Zwiększenie throughput poprzez dłuższe godziny pracy",
        "Zablokowanie więcej czasu na głęboką pracę i zmniejszenie nadmiernego planowania, aby obniżyć carryover",
        "Ignorowanie metryk i poleganie na uczuciach",
        "Mierzenie tylko throughput, ignorowanie innych metryk"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Pomiar",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#measurement", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Menedżer ma wysoki throughput (10 zadań), ale także wysoki carryover (6 zadań) i tylko 3 bloki skupienia. Według ram lekcji, co sugeruje ten wzorzec o ich produktywności?",
      options: [
        "Optymalna produktywność - wszystkie metryki są wysokie",
        "Pułapka produktywności - ukończenie zadań, ale ze złym planowaniem i niewystarczającą jakością głębokiej pracy",
        "Dobre zarządzanie czasem",
        "Skuteczna wielozadaniowość"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Pomiar",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#measurement", "#advanced", "#critical-thinking", "#pl", "#all-languages"]
    }
  ],
  // Vietnamese (VI) - Professional translations
  VI: [
    {
      question: "Theo bài học, throughput là gì?",
      options: [
        "Số lượng hoạt động",
        "Số lượng nhiệm vụ quan trọng đã hoàn thành",
        "Số lượng cuộc họp",
        "Số lượng email"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Đo lường",
      questionType: QuestionType.RECALL,
      hashtags: ["#measurement", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Bài học khuyến nghị bao nhiêu chỉ số chính cho đánh giá hàng tuần?",
      options: [
        "1",
        "2",
        "3",
        "4"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Đo lường",
      questionType: QuestionType.RECALL,
      hashtags: ["#measurement", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, carryover là gì?",
      options: [
        "Số lượng nhiệm vụ đã hoàn thành",
        "Số lượng nhiệm vụ còn lại từ tuần trước",
        "Số lượng khối công việc sâu",
        "Số lượng cuộc họp"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Đo lường",
      questionType: QuestionType.RECALL,
      hashtags: ["#measurement", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Tại sao đánh giá hàng tuần với ba chỉ số này quan trọng theo bài học?",
      options: [
        "Nó mất ít thời gian hơn đánh giá hàng ngày",
        "Nó cung cấp dữ liệu khách quan để xác định các lĩnh vực cải thiện, không chỉ cảm xúc",
        "Nó thay thế nhu cầu lập kế hoạch hàng ngày",
        "Nó chỉ đo lường hoạt động, không phải kết quả"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Đo lường",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#measurement", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, carryover thấp cho thấy điều gì?",
      options: [
        "Lập kế hoạch kém",
        "Lập kế hoạch tốt",
        "Quá nhiều công việc",
        "Ít công việc"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Đo lường",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#measurement", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Đánh giá hàng tuần của một người cho thấy 6 khối tập trung (mục tiêu: 8) và carryover cao (5 nhiệm vụ). Theo bài học, họ nên tập trung vào việc cải thiện điều gì?",
      options: [
        "Tăng throughput bằng cách làm việc nhiều giờ hơn",
        "Chặn thêm thời gian cho công việc sâu và giảm lập kế hoạch quá mức để giảm carryover",
        "Bỏ qua các chỉ số và tin tưởng vào cảm xúc",
        "Chỉ đo lường throughput, bỏ qua các chỉ số khác"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Đo lường",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#measurement", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Một người quản lý có throughput cao (10 nhiệm vụ) nhưng cũng có carryover cao (6 nhiệm vụ) và chỉ có 3 khối tập trung. Theo khung của bài học, mô hình này cho thấy điều gì về năng suất của họ?",
      options: [
        "Năng suất tối ưu - tất cả các chỉ số đều cao",
        "Bẫy năng suất - hoàn thành nhiệm vụ nhưng với kế hoạch kém và chất lượng công việc sâu không đủ",
        "Quản lý thời gian tốt",
        "Đa nhiệm hiệu quả"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Đo lường",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#measurement", "#advanced", "#critical-thinking", "#vi", "#all-languages"]
    }
  ],
  // Indonesian (ID) - Professional translations
  ID: [
    {
      question: "Menurut pelajaran, apa itu throughput?",
      options: [
        "Jumlah aktivitas",
        "Jumlah tugas penting yang diselesaikan",
        "Jumlah rapat",
        "Jumlah email"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Pengukuran",
      questionType: QuestionType.RECALL,
      hashtags: ["#measurement", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Berapa banyak metrik kunci yang direkomendasikan pelajaran untuk tinjauan mingguan?",
      options: [
        "1",
        "2",
        "3",
        "4"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Pengukuran",
      questionType: QuestionType.RECALL,
      hashtags: ["#measurement", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, apa itu carryover?",
      options: [
        "Jumlah tugas yang diselesaikan",
        "Jumlah tugas yang tersisa dari minggu lalu",
        "Jumlah blok kerja mendalam",
        "Jumlah rapat"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Pengukuran",
      questionType: QuestionType.RECALL,
      hashtags: ["#measurement", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Mengapa tinjauan mingguan dengan tiga metrik ini penting menurut pelajaran?",
      options: [
        "Memakan waktu lebih sedikit daripada tinjauan harian",
        "Memberikan data objektif untuk mengidentifikasi area peningkatan, bukan hanya perasaan",
        "Menggantikan kebutuhan perencanaan harian",
        "Hanya mengukur aktivitas, bukan hasil"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Pengukuran",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#measurement", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, apa artinya carryover rendah?",
      options: [
        "Perencanaan buruk",
        "Perencanaan baik",
        "Terlalu banyak pekerjaan",
        "Sedikit pekerjaan"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Pengukuran",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#measurement", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Tinjauan mingguan seseorang menunjukkan 6 blok fokus (target: 8) dan carryover tinggi (5 tugas). Menurut pelajaran, apa yang harus mereka fokuskan untuk diperbaiki?",
      options: [
        "Meningkatkan throughput dengan bekerja lebih lama",
        "Memblokir lebih banyak waktu untuk kerja mendalam dan mengurangi perencanaan berlebihan untuk menurunkan carryover",
        "Mengabaikan metrik dan mempercayai perasaan",
        "Hanya mengukur throughput, mengabaikan metrik lain"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Pengukuran",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#measurement", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Seorang manajer memiliki throughput tinggi (10 tugas) tetapi juga carryover tinggi (6 tugas) dan hanya 3 blok fokus. Menurut kerangka pelajaran, apa yang ditunjukkan pola ini tentang produktivitas mereka?",
      options: [
        "Produktivitas optimal - semua metrik tinggi",
        "Jebakan produktivitas - menyelesaikan tugas tetapi dengan perencanaan yang buruk dan kualitas kerja mendalam yang tidak memadai",
        "Manajemen waktu yang baik",
        "Multitasking yang efisien"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Pengukuran",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#measurement", "#advanced", "#critical-thinking", "#id", "#all-languages"]
    }
  ],
  // Arabic (AR) - Professional translations (RTL)
  AR: [
    {
      question: "وفقًا للدرس، ما هو الإنتاجية؟",
      options: [
        "عدد الأنشطة",
        "عدد المهام المهمة المكتملة",
        "عدد الاجتماعات",
        "عدد رسائل البريد الإلكتروني"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "القياس",
      questionType: QuestionType.RECALL,
      hashtags: ["#measurement", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "كم مقياسًا رئيسيًا يوصي الدرس به للمراجعة الأسبوعية؟",
      options: [
        "1",
        "2",
        "3",
        "4"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "القياس",
      questionType: QuestionType.RECALL,
      hashtags: ["#measurement", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، ما هو التحويل؟",
      options: [
        "عدد المهام المكتملة",
        "عدد المهام المتبقية من الأسبوع الماضي",
        "عدد كتل العمل العميق",
        "عدد الاجتماعات"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "القياس",
      questionType: QuestionType.RECALL,
      hashtags: ["#measurement", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "لماذا المراجعة الأسبوعية بهذه المقاييس الثلاثة مهمة وفقًا للدرس؟",
      options: [
        "تستغرق وقتًا أقل من المراجعات اليومية",
        "توفر بيانات موضوعية لتحديد مجالات التحسين، وليس فقط المشاعر",
        "تحل محل الحاجة إلى التخطيط اليومي",
        "تقيس فقط الأنشطة، وليس النتائج"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "القياس",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#measurement", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، ماذا يعني التحويل المنخفض؟",
      options: [
        "تخطيط سيء",
        "تخطيط جيد",
        "الكثير من العمل",
        "قليل من العمل"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "القياس",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#measurement", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "تظهر مراجعة أسبوعية لشخص 6 كتل تركيز (الهدف: 8) وتحويل عالي (5 مهام). وفقًا للدرس، على ماذا يجب أن يركزوا للتحسين؟",
      options: [
        "زيادة الإنتاجية من خلال العمل لساعات أطول",
        "حظر المزيد من الوقت للعمل العميق وتقليل التخطيط المفرط لخفض التحويل",
        "تجاهل المقاييس والثقة في المشاعر",
        "قياس الإنتاجية فقط، تجاهل المقاييس الأخرى"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "القياس",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#measurement", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "لدى مدير إنتاجية عالية (10 مهام) ولكن أيضًا تحويل عالي (6 مهام) و 3 كتل تركيز فقط. وفقًا لإطار الدرس، ماذا يوحي هذا النمط حول إنتاجيتهم؟",
      options: [
        "إنتاجية مثلى - جميع المقاييس عالية",
        "فخ الإنتاجية - إكمال المهام ولكن مع تخطيط سيء وجودة عمل عميق غير كافية",
        "إدارة وقت جيدة",
        "تعدد المهام بكفاءة"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "القياس",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#measurement", "#advanced", "#critical-thinking", "#ar", "#all-languages"]
    }
  ],
  // Portuguese (PT) - Professional translations (Brazilian)
  PT: [
    {
      question: "De acordo com a lição, o que é throughput?",
      options: [
        "Número de atividades",
        "Número de tarefas importantes concluídas",
        "Número de reuniões",
        "Número de e-mails"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Medição",
      questionType: QuestionType.RECALL,
      hashtags: ["#measurement", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "Quantas métricas-chave a lição recomenda para revisão semanal?",
      options: [
        "1",
        "2",
        "3",
        "4"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Medição",
      questionType: QuestionType.RECALL,
      hashtags: ["#measurement", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, o que é carryover?",
      options: [
        "Número de tarefas concluídas",
        "Número de tarefas restantes da semana passada",
        "Número de blocos de trabalho profundo",
        "Número de reuniões"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Medição",
      questionType: QuestionType.RECALL,
      hashtags: ["#measurement", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "Por que a revisão semanal com essas três métricas é importante de acordo com a lição?",
      options: [
        "Leva menos tempo do que revisões diárias",
        "Fornece dados objetivos para identificar áreas de melhoria, não apenas sentimentos",
        "Substitui a necessidade de planejamento diário",
        "Mede apenas atividades, não resultados"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Medição",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#measurement", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, o que significa carryover baixo?",
      options: [
        "Planejamento ruim",
        "Bom planejamento",
        "Muito trabalho",
        "Pouco trabalho"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Medição",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#measurement", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "A revisão semanal de uma pessoa mostra 6 blocos de foco (meta: 8) e carryover alto (5 tarefas). De acordo com a lição, em que devem se concentrar para melhorar?",
      options: [
        "Aumentar throughput trabalhando mais horas",
        "Bloquear mais tempo para trabalho profundo e reduzir superplanejamento para diminuir carryover",
        "Ignorar as métricas e confiar em sentimentos",
        "Medir apenas throughput, ignorar outras métricas"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Medição",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#measurement", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Um gerente tem throughput alto (10 tarefas), mas também carryover alto (6 tarefas) e apenas 3 blocos de foco. De acordo com a estrutura da lição, o que esse padrão sugere sobre sua produtividade?",
      options: [
        "Produtividade ideal - todas as métricas são altas",
        "Armadilha de produtividade - completando tarefas, mas com planejamento ruim e qualidade de trabalho profundo insuficiente",
        "Boa gestão de tempo",
        "Multitarefa eficiente"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Medição",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#measurement", "#advanced", "#critical-thinking", "#pt", "#all-languages"]
    }
  ],
  // Hindi (HI) - Professional translations
  HI: [
    {
      question: "पाठ के अनुसार, throughput क्या है?",
      options: [
        "गतिविधियों की संख्या",
        "पूर्ण किए गए महत्वपूर्ण कार्यों की संख्या",
        "बैठकों की संख्या",
        "ईमेल की संख्या"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "मापन",
      questionType: QuestionType.RECALL,
      hashtags: ["#measurement", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ साप्ताहिक समीक्षा के लिए कितने मुख्य मेट्रिक्स की सिफारिश करता है?",
      options: [
        "1",
        "2",
        "3",
        "4"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "मापन",
      questionType: QuestionType.RECALL,
      hashtags: ["#measurement", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, carryover क्या है?",
      options: [
        "पूर्ण किए गए कार्यों की संख्या",
        "पिछले सप्ताह से बचे कार्यों की संख्या",
        "गहरे कार्य ब्लॉक की संख्या",
        "बैठकों की संख्या"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "मापन",
      questionType: QuestionType.RECALL,
      hashtags: ["#measurement", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार इन तीन मेट्रिक्स के साथ साप्ताहिक समीक्षा क्यों महत्वपूर्ण है?",
      options: [
        "यह दैनिक समीक्षाओं से कम समय लेती है",
        "यह सुधार के क्षेत्रों की पहचान करने के लिए वस्तुनिष्ठ डेटा प्रदान करती है, न कि केवल भावनाएं",
        "यह दैनिक योजना की आवश्यकता को प्रतिस्थापित करती है",
        "यह केवल गतिविधियों को मापती है, परिणामों को नहीं"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "मापन",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#measurement", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, कम carryover का क्या मतलब है?",
      options: [
        "खराब योजना",
        "अच्छी योजना",
        "बहुत अधिक काम",
        "कम काम"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "मापन",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#measurement", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक व्यक्ति की साप्ताहिक समीक्षा 6 फोकस ब्लॉक (लक्ष्य: 8) और उच्च carryover (5 कार्य) दिखाती है। पाठ के अनुसार, उन्हें सुधार पर क्या ध्यान केंद्रित करना चाहिए?",
      options: [
        "अधिक घंटे काम करके throughput बढ़ाना",
        "गहरे कार्य के लिए अधिक समय ब्लॉक करना और carryover को कम करने के लिए अति-योजना को कम करना",
        "मेट्रिक्स को नजरअंदाज करना और भावनाओं पर भरोसा करना",
        "केवल throughput को मापना, अन्य मेट्रिक्स को नजरअंदाज करना"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "मापन",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#measurement", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक प्रबंधक का उच्च throughput (10 कार्य) है लेकिन उच्च carryover (6 कार्य) भी है और केवल 3 फोकस ब्लॉक हैं। पाठ के ढांचे के अनुसार, यह पैटर्न उनकी उत्पादकता के बारे में क्या सुझाव देता है?",
      options: [
        "इष्टतम उत्पादकता - सभी मेट्रिक्स उच्च हैं",
        "उत्पादकता जाल - कार्यों को पूरा करना लेकिन खराब योजना और अपर्याप्त गहरे कार्य की गुणवत्ता के साथ",
        "अच्छा समय प्रबंधन",
        "कुशल मल्टीटास्किंग"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "मापन",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#measurement", "#advanced", "#critical-thinking", "#hi", "#all-languages"]
    }
  ]
};

async function seedDay5Enhanced() {
  try {
    await connectDB();
    console.log('🌱 SEEDING DAY 5 ENHANCED QUIZ QUESTIONS\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    let totalQuestions = 0;
    let totalUpdated = 0;
    let totalCreated = 0;

    for (const lang of LANGUAGES) {
      const courseId = `${COURSE_ID_BASE}_${lang}`;
      const lessonId = `${COURSE_ID_BASE}_${lang}_DAY_05`;

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
      const questions = DAY5_QUESTIONS[lang] || DAY5_QUESTIONS['EN']; // Fallback to EN if not translated
      
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
    console.log(`\n✅ DAY 5 ENHANCEMENT COMPLETE!\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedDay5Enhanced();
