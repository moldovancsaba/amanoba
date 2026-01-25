/**
 * Seed Day 2 Enhanced Quiz Questions
 * 
 * Purpose: Enhance Day 2 quizzes from 5 to 7 questions across all 10 languages
 * Why: Part of Quiz Quality Enhancement - Phase 1, Day 2
 * 
 * Lesson Topic: Time, energy, attention: what you manage in practice
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
const DAY_NUMBER = 2;
const LANGUAGES = ['HU', 'EN', 'TR', 'BG', 'PL', 'VI', 'ID', 'AR', 'PT', 'HI'];

/**
 * Day 2 Enhanced Questions - All Languages
 * Topic: Time, energy, attention management
 * Structure: 7 questions per language
 * Q1-Q3: Keep (Recall - foundational concepts)
 * Q4: Rewritten (Application - from definition to purpose)
 * Q5: Keep (Application - scenario-based)
 * Q6: New (Application - practical implementation)
 * Q7: New (Critical Thinking - systems integration)
 */
const DAY2_QUESTIONS: Record<string, Array<{
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: QuestionDifficulty;
  category: string;
  questionType: QuestionType;
  hashtags: string[];
}>> = {
  EN: [
    // Q1: What are the three pillars of productivity (RECALL - Keep)
    {
      question: "According to the lesson, what are the three pillars of productivity?",
      options: [
        "Time, money, and skills",
        "Time, energy, and attention",
        "Planning, execution, and review",
        "Goals, tasks, and deadlines"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#productivity", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q2: Energy levels (RECALL - Keep)
    {
      question: "What are the three energy levels mentioned in the lesson?",
      options: [
        "High, medium, low",
        "Morning, afternoon, evening",
        "Physical, mental, emotional",
        "Peak, average, minimal"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Energy Management",
      questionType: QuestionType.RECALL,
      hashtags: ["#energy-management", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q3: Deep work block duration (RECALL - Keep)
    {
      question: "How long should deep work blocks typically be?",
      options: [
        "30-45 minutes",
        "60-90 minutes",
        "90-120 minutes",
        "2-3 hours"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Attention Management",
      questionType: QuestionType.RECALL,
      hashtags: ["#attention-management", "#intermediate", "#recall", "#en", "#all-languages"]
    },
    // Q4: Why buffer time matters (APPLICATION - Rewritten from definition)
    {
      question: "Why is buffer time (20-30%) important in daily scheduling?",
      options: [
        "It allows you to work less hours",
        "It prevents stress from overpacked calendars and handles unexpected events",
        "It makes meetings shorter",
        "It reduces the need for planning"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Time, Energy, Attention",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#time-management", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q5: Scheduling peak energy tasks (APPLICATION - Keep)
    {
      question: "According to the lesson, when should you schedule your most challenging tasks?",
      options: [
        "During low energy periods to build resilience",
        "During peak energy periods for maximum effectiveness",
        "Randomly throughout the day",
        "Only in the morning"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Energy Management",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#energy-management", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q6: Attention restoration time (APPLICATION - New)
    {
      question: "After an interruption, how long does it typically take to restore your attention according to the lesson?",
      options: [
        "5-10 minutes",
        "15-20 minutes",
        "30-45 minutes",
        "1 hour"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Attention Management",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#attention-management", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q7: Integrating all three resources (CRITICAL THINKING - New)
    {
      question: "A manager schedules a strategic planning session during their low-energy period, checks email during deep work blocks, and has no buffer time. What does this scenario demonstrate?",
      options: [
        "Optimal resource management",
        "A failure to integrate time, energy, and attention management effectively",
        "Efficient multitasking",
        "Good time blocking practices"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Systems",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#productivity", "#advanced", "#critical-thinking", "#en", "#all-languages"]
    }
  ],
  // Hungarian translations
  HU: [
    {
      question: "A lecke szerint mik a termelékenység három pillére?",
      options: [
        "Idő, pénz és készségek",
        "Idő, energia és figyelem",
        "Tervezés, végrehajtás és értékelés",
        "Célok, feladatok és határidők"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#productivity", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "Melyek a leckében említett három energia szint?",
      options: [
        "Magas, közepes, alacsony",
        "Reggel, délután, este",
        "Fizikai, mentális, érzelmi",
        "Csúcs, átlagos, minimális"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Energy Management",
      questionType: QuestionType.RECALL,
      hashtags: ["#energy-management", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "Mennyi ideig kellene tartania a deep work blokkoknak?",
      options: [
        "30-45 perc",
        "60-90 perc",
        "90-120 perc",
        "2-3 óra"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Figyelem kezelés",
      questionType: QuestionType.RECALL,
      hashtags: ["#attention-management", "#intermediate", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "Miért fontos a buffer idő (20-30%) a napi ütemezésben?",
      options: [
        "Lehetővé teszi, hogy kevesebb órát dolgozz",
        "Megelőzi a túlzsúfolt naptárakból eredő stresszt és kezeli a váratlan eseményeket",
        "Rövidebbé teszi a meetingeket",
        "Csökkenti a tervezés szükségességét"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Idő kezelés",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#time-management", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint mikor kellene ütemezned a legnehezebb feladatokat?",
      options: [
        "Alacsony energia időszakokban a reziliencia építéséhez",
        "Csúcs energia időszakokban a maximális hatékonyságért",
        "Véletlenszerűen a nap folyamán",
        "Csak reggel"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Energy Management",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#energy-management", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy megszakítás után mennyi időt vesz igénybe a figyelem visszaállítása a lecke szerint?",
      options: [
        "5-10 perc",
        "15-20 perc",
        "30-45 perc",
        "1 óra"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Figyelem kezelés",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#attention-management", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy menedzser stratégiai tervezési munkamenetet ütemez alacsony energia időszakban, e-mailt ellenőriz deep work blokkok alatt, és nincs buffer ideje. Mit mutat ez a forgatókönyv?",
      options: [
        "Optimális erőforrás kezelés",
        "Az idő, energia és figyelem kezelésének hatékony integrálásának hiánya",
        "Hatékony multitasking",
        "Jó időblokkolási gyakorlatok"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Termelékenységi rendszerek",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#productivity", "#advanced", "#critical-thinking", "#hu", "#all-languages"]
    }
  ],
  // Turkish (TR) - Professional translations
  TR: [
    {
      question: "Derse göre verimliliğin üç temel direği nedir?",
      options: [
        "Zaman, para ve beceriler",
        "Zaman, enerji ve dikkat",
        "Planlama, uygulama ve değerlendirme",
        "Hedefler, görevler ve son tarihler"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Verimlilik Temelleri",
      questionType: QuestionType.RECALL,
      hashtags: ["#productivity", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derste bahsedilen üç enerji seviyesi nedir?",
      options: [
        "Yüksek, orta, düşük",
        "Sabah, öğleden sonra, akşam",
        "Fiziksel, zihinsel, duygusal",
        "Zirve, ortalama, minimal"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Enerji Yönetimi",
      questionType: QuestionType.RECALL,
      hashtags: ["#energy-management", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derin çalışma blokları genellikle ne kadar sürmelidir?",
      options: [
        "30-45 dakika",
        "60-90 dakika",
        "90-120 dakika",
        "2-3 saat"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Dikkat Yönetimi",
      questionType: QuestionType.RECALL,
      hashtags: ["#attention-management", "#intermediate", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Günlük programlamada buffer zamanı (yüzde 20-30) neden önemlidir?",
      options: [
        "Daha az saat çalışmanıza olanak tanır",
        "Aşırı dolu takvimlerden kaynaklanan stresi önler ve beklenmedik olayları yönetir",
        "Toplantıları kısaltır",
        "Planlama ihtiyacını azaltır"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Zaman Yönetimi",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#time-management", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre en zorlu görevlerinizi ne zaman planlamalısınız?",
      options: [
        "Dayanıklılık oluşturmak için düşük enerji dönemlerinde",
        "Maksimum etkinlik için zirve enerji dönemlerinde",
        "Gün boyunca rastgele",
        "Sadece sabah"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Enerji Yönetimi",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#energy-management", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir kesintiden sonra, derse göre dikkatinizi geri kazanmak genellikle ne kadar sürer?",
      options: [
        "5-10 dakika",
        "15-20 dakika",
        "30-45 dakika",
        "1 saat"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Dikkat Yönetimi",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#attention-management", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir yönetici düşük enerji döneminde stratejik planlama oturumu planlar, derin çalışma blokları sırasında e-postayı kontrol eder ve buffer zamanı yoktur. Bu senaryo neyi gösterir?",
      options: [
        "Optimal kaynak yönetimi",
        "Zaman, enerji ve dikkat yönetiminin etkili bir şekilde entegre edilmemesi",
        "Verimli çoklu görev",
        "İyi zaman bloklama uygulamaları"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Verimlilik Sistemleri",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#productivity", "#advanced", "#critical-thinking", "#tr", "#all-languages"]
    }
  ],
  // Bulgarian (BG) - Professional translations
  BG: [
    {
      question: "Според урока, какви са трите стълба на производителността?",
      options: [
        "Време, пари и умения",
        "Време, енергия и внимание",
        "Планиране, изпълнение и преглед",
        "Цели, задачи и крайни срокове"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Основи на производителността",
      questionType: QuestionType.RECALL,
      hashtags: ["#productivity", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Какви са трите нива на енергия, споменати в урока?",
      options: [
        "Високо, средно, ниско",
        "Сутрин, следобед, вечер",
        "Физическо, умствено, емоционално",
        "Пиково, средно, минимално"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Управление на енергията",
      questionType: QuestionType.RECALL,
      hashtags: ["#energy-management", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Колко дълго трябва да продължават блоковете за дълбока работа?",
      options: [
        "30-45 минути",
        "60-90 минути",
        "90-120 минути",
        "2-3 часа"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Управление на вниманието",
      questionType: QuestionType.RECALL,
      hashtags: ["#attention-management", "#intermediate", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Защо е важен буферното време (20-30%) в дневното планиране?",
      options: [
        "Позволява ви да работите по-малко часове",
        "Предотвратява стреса от претъпкани календари и управлява неочаквани събития",
        "Скращава срещите",
        "Намалява необходимостта от планиране"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Управление на времето",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#time-management", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, кога трябва да планирате най-трудните си задачи?",
      options: [
        "По време на ниски енергийни периоди за изграждане на устойчивост",
        "По време на пикови енергийни периоди за максимална ефективност",
        "Случайно през деня",
        "Само сутрин"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Управление на енергията",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#energy-management", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "След прекъсване, колко време отнема възстановяването на вниманието според урока?",
      options: [
        "5-10 минути",
        "15-20 минути",
        "30-45 минути",
        "1 час"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Управление на вниманието",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#attention-management", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Мениджърът планира стратегическа сесия по време на ниския си енергиен период, проверява имейл по време на блоковете за дълбока работа и няма буферно време. Какво демонстрира този сценарий?",
      options: [
        "Оптимално управление на ресурсите",
        "Неуспех в ефективното интегриране на управлението на време, енергия и внимание",
        "Ефективна многозадачност",
        "Добри практики за блокиране на времето"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Системи за производителност",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#productivity", "#advanced", "#critical-thinking", "#bg", "#all-languages"]
    }
  ],
  // Polish (PL) - Professional translations
  PL: [
    {
      question: "Według lekcji, jakie są trzy filary produktywności?",
      options: [
        "Czas, pieniądze i umiejętności",
        "Czas, energia i uwaga",
        "Planowanie, wykonanie i przegląd",
        "Cele, zadania i terminy"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Podstawy produktywności",
      questionType: QuestionType.RECALL,
      hashtags: ["#productivity", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Jakie są trzy poziomy energii wymienione w lekcji?",
      options: [
        "Wysoki, średni, niski",
        "Rano, popołudnie, wieczór",
        "Fizyczny, mentalny, emocjonalny",
        "Szczytowy, przeciętny, minimalny"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Zarządzanie energią",
      questionType: QuestionType.RECALL,
      hashtags: ["#energy-management", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Jak długo powinny trwać bloki głębokiej pracy?",
      options: [
        "30-45 minut",
        "60-90 minut",
        "90-120 minut",
        "2-3 godziny"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Zarządzanie uwagą",
      questionType: QuestionType.RECALL,
      hashtags: ["#attention-management", "#intermediate", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Dlaczego czas buforowy (20-30%) jest ważny w codziennym planowaniu?",
      options: [
        "Pozwala pracować mniej godzin",
        "Zapobiega stresowi z przepełnionych kalendarzy i obsługuje nieoczekiwane zdarzenia",
        "Skraca spotkania",
        "Zmniejsza potrzebę planowania"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Zarządzanie czasem",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#time-management", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, kiedy powinieneś zaplanować swoje najtrudniejsze zadania?",
      options: [
        "Podczas okresów niskiej energii, aby budować odporność",
        "Podczas okresów szczytowej energii dla maksymalnej skuteczności",
        "Losowo w ciągu dnia",
        "Tylko rano"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Zarządzanie energią",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#energy-management", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Po przerwaniu, ile czasu zajmuje przywrócenie uwagi według lekcji?",
      options: [
        "5-10 minut",
        "15-20 minut",
        "30-45 minut",
        "1 godzinę"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Zarządzanie uwagą",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#attention-management", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Menedżer planuje sesję strategiczną podczas okresu niskiej energii, sprawdza e-mail podczas bloków głębokiej pracy i nie ma czasu buforowego. Co demonstruje ten scenariusz?",
      options: [
        "Optymalne zarządzanie zasobami",
        "Niepowodzenie w skutecznym integrowaniu zarządzania czasem, energią i uwagą",
        "Skuteczna wielozadaniowość",
        "Dobre praktyki blokowania czasu"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Systemy produktywności",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#productivity", "#advanced", "#critical-thinking", "#pl", "#all-languages"]
    }
  ],
  // Vietnamese (VI) - Professional translations
  VI: [
    {
      question: "Theo bài học, ba trụ cột của năng suất là gì?",
      options: [
        "Thời gian, tiền bạc và kỹ năng",
        "Thời gian, năng lượng và sự chú ý",
        "Lập kế hoạch, thực hiện và đánh giá",
        "Mục tiêu, nhiệm vụ và thời hạn"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Nền tảng năng suất",
      questionType: QuestionType.RECALL,
      hashtags: ["#productivity", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Ba mức năng lượng được đề cập trong bài học là gì?",
      options: [
        "Cao, trung bình, thấp",
        "Sáng, chiều, tối",
        "Thể chất, tinh thần, cảm xúc",
        "Đỉnh, trung bình, tối thiểu"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Quản lý năng lượng",
      questionType: QuestionType.RECALL,
      hashtags: ["#energy-management", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Các khối công việc sâu thường nên kéo dài bao lâu?",
      options: [
        "30-45 phút",
        "60-90 phút",
        "90-120 phút",
        "2-3 giờ"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Quản lý sự chú ý",
      questionType: QuestionType.RECALL,
      hashtags: ["#attention-management", "#intermediate", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Tại sao thời gian đệm (20-30%) quan trọng trong lập lịch hàng ngày?",
      options: [
        "Nó cho phép bạn làm việc ít giờ hơn",
        "Nó ngăn ngừa căng thẳng từ lịch quá tải và xử lý các sự kiện bất ngờ",
        "Nó làm cho các cuộc họp ngắn hơn",
        "Nó giảm nhu cầu lập kế hoạch"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Quản lý thời gian",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#time-management", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, khi nào bạn nên lên lịch các nhiệm vụ khó khăn nhất của mình?",
      options: [
        "Trong thời kỳ năng lượng thấp để xây dựng khả năng phục hồi",
        "Trong thời kỳ năng lượng đỉnh để đạt hiệu quả tối đa",
        "Ngẫu nhiên trong ngày",
        "Chỉ vào buổi sáng"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Quản lý năng lượng",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#energy-management", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Sau một gián đoạn, thường mất bao lâu để khôi phục sự chú ý của bạn theo bài học?",
      options: [
        "5-10 phút",
        "15-20 phút",
        "30-45 phút",
        "1 giờ"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Quản lý sự chú ý",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#attention-management", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Một người quản lý lên lịch một phiên lập kế hoạch chiến lược trong thời kỳ năng lượng thấp, kiểm tra email trong các khối công việc sâu và không có thời gian đệm. Kịch bản này thể hiện điều gì?",
      options: [
        "Quản lý tài nguyên tối ưu",
        "Thất bại trong việc tích hợp hiệu quả quản lý thời gian, năng lượng và sự chú ý",
        "Đa nhiệm hiệu quả",
        "Thực hành chặn thời gian tốt"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Hệ thống năng suất",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#productivity", "#advanced", "#critical-thinking", "#vi", "#all-languages"]
    }
  ],
  // Indonesian (ID) - Professional translations
  ID: [
    {
      question: "Menurut pelajaran, apa tiga pilar produktivitas?",
      options: [
        "Waktu, uang, dan keterampilan",
        "Waktu, energi, dan perhatian",
        "Perencanaan, eksekusi, dan tinjauan",
        "Tujuan, tugas, dan tenggat waktu"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Dasar Produktivitas",
      questionType: QuestionType.RECALL,
      hashtags: ["#productivity", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Apa tiga tingkat energi yang disebutkan dalam pelajaran?",
      options: [
        "Tinggi, sedang, rendah",
        "Pagi, siang, malam",
        "Fisik, mental, emosional",
        "Puncak, rata-rata, minimal"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Manajemen Energi",
      questionType: QuestionType.RECALL,
      hashtags: ["#energy-management", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Berapa lama blok kerja mendalam biasanya harus berlangsung?",
      options: [
        "30-45 menit",
        "60-90 menit",
        "90-120 menit",
        "2-3 jam"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Manajemen Perhatian",
      questionType: QuestionType.RECALL,
      hashtags: ["#attention-management", "#intermediate", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Mengapa waktu buffer (20-30%) penting dalam penjadwalan harian?",
      options: [
        "Memungkinkan Anda bekerja lebih sedikit jam",
        "Mencegah stres dari kalender yang terlalu penuh dan menangani peristiwa tak terduga",
        "Memperpendek rapat",
        "Mengurangi kebutuhan perencanaan"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Manajemen Waktu",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#time-management", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, kapan Anda harus menjadwalkan tugas paling menantang?",
      options: [
        "Selama periode energi rendah untuk membangun ketahanan",
        "Selama periode energi puncak untuk efektivitas maksimal",
        "Secara acak sepanjang hari",
        "Hanya di pagi hari"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Manajemen Energi",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#energy-management", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Setelah gangguan, berapa lama biasanya diperlukan untuk memulihkan perhatian Anda menurut pelajaran?",
      options: [
        "5-10 menit",
        "15-20 menit",
        "30-45 menit",
        "1 jam"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Manajemen Perhatian",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#attention-management", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Seorang manajer menjadwalkan sesi perencanaan strategis selama periode energi rendah mereka, memeriksa email selama blok kerja mendalam, dan tidak memiliki waktu buffer. Apa yang ditunjukkan skenario ini?",
      options: [
        "Manajemen sumber daya yang optimal",
        "Kegagalan dalam mengintegrasikan manajemen waktu, energi, dan perhatian secara efektif",
        "Multitasking yang efisien",
        "Praktik pemblokiran waktu yang baik"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Sistem Produktivitas",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#productivity", "#advanced", "#critical-thinking", "#id", "#all-languages"]
    }
  ],
  // Arabic (AR) - Professional translations (RTL)
  AR: [
    {
      question: "وفقًا للدرس، ما هي الركائز الثلاث للإنتاجية؟",
      options: [
        "الوقت والمال والمهارات",
        "الوقت والطاقة والانتباه",
        "التخطيط والتنفيذ والمراجعة",
        "الأهداف والمهام والمواعيد النهائية"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "أساسيات الإنتاجية",
      questionType: QuestionType.RECALL,
      hashtags: ["#productivity", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "ما هي مستويات الطاقة الثلاثة المذكورة في الدرس؟",
      options: [
        "عالية ومتوسطة ومنخفضة",
        "صباح وظهر ومساء",
        "جسدية وعقلية وعاطفية",
        "ذروة ومتوسطة ودنيا"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "إدارة الطاقة",
      questionType: QuestionType.RECALL,
      hashtags: ["#energy-management", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "كم يجب أن تستمر كتل العمل العميق عادة؟",
      options: [
        "30-45 دقيقة",
        "60-90 دقيقة",
        "90-120 دقيقة",
        "2-3 ساعات"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "إدارة الانتباه",
      questionType: QuestionType.RECALL,
      hashtags: ["#attention-management", "#intermediate", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "لماذا الوقت الاحتياطي (20-30%) مهم في الجدولة اليومية؟",
      options: [
        "يسمح لك بالعمل لساعات أقل",
        "يمنع التوتر من التقويمات المزدحمة ويتعامل مع الأحداث غير المتوقعة",
        "يقصر الاجتماعات",
        "يقلل من الحاجة إلى التخطيط"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "إدارة الوقت",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#time-management", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، متى يجب أن تخطط لأصعب مهامك؟",
      options: [
        "خلال فترات الطاقة المنخفضة لبناء المرونة",
        "خلال فترات الطاقة الذروة للفعالية القصوى",
        "بشكل عشوائي طوال اليوم",
        "فقط في الصباح"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "إدارة الطاقة",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#energy-management", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "بعد المقاطعة، كم من الوقت يستغرق عادة استعادة انتباهك وفقًا للدرس؟",
      options: [
        "5-10 دقائق",
        "15-20 دقيقة",
        "30-45 دقيقة",
        "ساعة واحدة"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "إدارة الانتباه",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#attention-management", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "يدير مدير جلسة تخطيط استراتيجي خلال فترة طاقته المنخفضة، ويفحص البريد الإلكتروني أثناء كتل العمل العميق، وليس لديه وقت احتياطي. ماذا يوضح هذا السيناريو؟",
      options: [
        "إدارة الموارد المثلى",
        "فشل في دمج إدارة الوقت والطاقة والانتباه بشكل فعال",
        "تعدد المهام بكفاءة",
        "ممارسات جيدة لحظر الوقت"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "أنظمة الإنتاجية",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#productivity", "#advanced", "#critical-thinking", "#ar", "#all-languages"]
    }
  ],
  // Portuguese (PT) - Professional translations (Brazilian)
  PT: [
    {
      question: "De acordo com a lição, quais são os três pilares da produtividade?",
      options: [
        "Tempo, dinheiro e habilidades",
        "Tempo, energia e atenção",
        "Planejamento, execução e revisão",
        "Metas, tarefas e prazos"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Fundamentos de Produtividade",
      questionType: QuestionType.RECALL,
      hashtags: ["#productivity", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "Quais são os três níveis de energia mencionados na lição?",
      options: [
        "Alto, médio, baixo",
        "Manhã, tarde, noite",
        "Físico, mental, emocional",
        "Pico, médio, mínimo"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Gestão de Energia",
      questionType: QuestionType.RECALL,
      hashtags: ["#energy-management", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "Quanto tempo os blocos de trabalho profundo devem durar normalmente?",
      options: [
        "30-45 minutos",
        "60-90 minutos",
        "90-120 minutos",
        "2-3 horas"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Gestão de Atenção",
      questionType: QuestionType.RECALL,
      hashtags: ["#attention-management", "#intermediate", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "Por que o tempo de buffer (20-30%) é importante no agendamento diário?",
      options: [
        "Permite trabalhar menos horas",
        "Previne o estresse de calendários superlotados e lida com eventos inesperados",
        "Encurta as reuniões",
        "Reduz a necessidade de planejamento"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Gestão de Tempo",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#time-management", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, quando você deve agendar suas tarefas mais desafiadoras?",
      options: [
        "Durante períodos de baixa energia para construir resiliência",
        "Durante períodos de energia de pico para máxima eficácia",
        "Aleatoriamente ao longo do dia",
        "Apenas de manhã"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Gestão de Energia",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#energy-management", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Após uma interrupção, quanto tempo normalmente leva para restaurar sua atenção de acordo com a lição?",
      options: [
        "5-10 minutos",
        "15-20 minutos",
        "30-45 minutos",
        "1 hora"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Gestão de Atenção",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#attention-management", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Um gerente agenda uma sessão de planejamento estratégico durante seu período de baixa energia, verifica e-mail durante blocos de trabalho profundo e não tem tempo de buffer. O que este cenário demonstra?",
      options: [
        "Gestão ideal de recursos",
        "Falha em integrar efetivamente a gestão de tempo, energia e atenção",
        "Multitarefa eficiente",
        "Boas práticas de bloqueio de tempo"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Sistemas de Produtividade",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#productivity", "#advanced", "#critical-thinking", "#pt", "#all-languages"]
    }
  ],
  // Hindi (HI) - Professional translations
  HI: [
    {
      question: "पाठ के अनुसार, उत्पादकता के तीन स्तंभ क्या हैं?",
      options: [
        "समय, पैसा और कौशल",
        "समय, ऊर्जा और ध्यान",
        "योजना, निष्पादन और समीक्षा",
        "लक्ष्य, कार्य और समय सीमा"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "उत्पादकता की नींव",
      questionType: QuestionType.RECALL,
      hashtags: ["#productivity", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ में उल्लिखित तीन ऊर्जा स्तर क्या हैं?",
      options: [
        "उच्च, मध्यम, निम्न",
        "सुबह, दोपहर, शाम",
        "शारीरिक, मानसिक, भावनात्मक",
        "चरम, औसत, न्यूनतम"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "ऊर्जा प्रबंधन",
      questionType: QuestionType.RECALL,
      hashtags: ["#energy-management", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "गहन कार्य ब्लॉक आमतौर पर कितने समय तक चलने चाहिए?",
      options: [
        "30-45 मिनट",
        "60-90 मिनट",
        "90-120 मिनट",
        "2-3 घंटे"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "ध्यान प्रबंधन",
      questionType: QuestionType.RECALL,
      hashtags: ["#attention-management", "#intermediate", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "दैनिक अनुसूची में बफर समय (20-30%) क्यों महत्वपूर्ण है?",
      options: [
        "यह आपको कम घंटे काम करने की अनुमति देता है",
        "यह भीड़-भाड़ वाले कैलेंडर से तनाव को रोकता है और अप्रत्याशित घटनाओं को संभालता है",
        "यह बैठकों को छोटा करता है",
        "यह योजना की आवश्यकता को कम करता है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "समय प्रबंधन",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#time-management", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, आपको अपने सबसे चुनौतीपूर्ण कार्यों को कब निर्धारित करना चाहिए?",
      options: [
        "लचीलापन बनाने के लिए कम ऊर्जा अवधि के दौरान",
        "अधिकतम प्रभावशीलता के लिए चरम ऊर्जा अवधि के दौरान",
        "दिन भर में यादृच्छिक रूप से",
        "केवल सुबह"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "ऊर्जा प्रबंधन",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#energy-management", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक व्यवधान के बाद, पाठ के अनुसार आपके ध्यान को बहाल करने में आमतौर पर कितना समय लगता है?",
      options: [
        "5-10 मिनट",
        "15-20 मिनट",
        "30-45 मिनट",
        "1 घंटा"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "ध्यान प्रबंधन",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#attention-management", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक प्रबंधक अपनी कम ऊर्जा अवधि के दौरान एक रणनीतिक योजना सत्र निर्धारित करता है, गहन कार्य ब्लॉक के दौरान ईमेल जांचता है, और उसके पास बफर समय नहीं है। यह परिदृश्य क्या प्रदर्शित करता है?",
      options: [
        "इष्टतम संसाधन प्रबंधन",
        "समय, ऊर्जा और ध्यान प्रबंधन को प्रभावी ढंग से एकीकृत करने में विफलता",
        "कुशल मल्टीटास्किंग",
        "समय ब्लॉकिंग की अच्छी प्रथाएं"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "उत्पादकता प्रणाली",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#productivity", "#advanced", "#critical-thinking", "#hi", "#all-languages"]
    }
  ]
};

async function seedDay2Enhanced() {
  try {
    await connectDB();
    console.log('🌱 SEEDING DAY 2 ENHANCED QUIZ QUESTIONS\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    let totalQuestions = 0;
    let totalUpdated = 0;
    let totalCreated = 0;

    for (const lang of LANGUAGES) {
      const courseId = `${COURSE_ID_BASE}_${lang}`;
      const lessonId = `${COURSE_ID_BASE}_${lang}_DAY_02`;

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
      const questions = DAY2_QUESTIONS[lang];
      
      if (!questions || questions.length === 0) {
        console.error(`   ❌ ERROR: No questions defined for ${lang}! Questions MUST be in course language.`);
        throw new Error(`Missing translations for ${lang} - Day 2 questions must be in course language, not English fallback`);
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
    console.log(`\n✅ DAY 2 ENHANCEMENT COMPLETE!\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedDay2Enhanced();
