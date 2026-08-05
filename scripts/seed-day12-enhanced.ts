/**
 * Seed Day 12 Enhanced Quiz Questions
 * 
 * Purpose: Enhance Day 12 quizzes from 5 to 7 questions across all 10 languages
 * Why: Part of Quiz Quality Enhancement - Phase 1, Day 12
 * 
 * Lesson Topic: Accountability Structures (public goals, accountability partners, tracking)
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
const DAY_NUMBER = 12;
const LANGUAGES = ['HU', 'EN', 'TR', 'BG', 'PL', 'VI', 'ID', 'AR', 'PT', 'HI'];

/**
 * Day 12 Enhanced Questions - All Languages
 * Topic: Accountability Structures
 * Structure: 7 questions per language
 * Q1-Q3: Keep (Recall - foundational concepts)
 * Q4: Rewritten (Application - from definition to purpose)
 * Q5: Keep (Application - scenario-based)
 * Q6: New (Application - practical implementation)
 * Q7: New (Critical Thinking - systems integration)
 */
const DAY12_QUESTIONS: Record<string, Array<{
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: QuestionDifficulty;
  category: string;
  questionType: QuestionType;
  hashtags: string[];
}>> = {
  EN: [
    // Q1: Public goals achievement rate (RECALL - Keep)
    {
      question: "According to the lesson, what percentage of publicly stated goals are achieved?",
      options: [
        "25%",
        "65%",
        "45%",
        "85%"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Personal Development",
      questionType: QuestionType.RECALL,
      hashtags: ["#accountability", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q2: Accountability partner benefit (RECALL - Keep)
    {
      question: "According to the lesson, what is the main benefit of an accountability partnership?",
      options: [
        "None",
        "Increases motivation and persistence",
        "Reduces effort",
        "It's unnecessary"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Personal Development",
      questionType: QuestionType.RECALL,
      hashtags: ["#accountability", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q3: Review frequency (RECALL - Keep)
    {
      question: "According to the lesson, how often should your accountability partner review your progress?",
      options: [
        "Monthly",
        "Weekly",
        "Daily",
        "Yearly"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Personal Development",
      questionType: QuestionType.RECALL,
      hashtags: ["#accountability", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q4: Why accountability structures matter (APPLICATION - Rewritten)
    {
      question: "Why are accountability structures important according to the lesson?",
      options: [
        "They eliminate the need for goals",
        "They increase goal achievement rates (65% for public goals), create commitment through transparency, enable early problem detection, and reduce procrastination",
        "They only apply to large teams",
        "They require no effort"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Personal Development",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#accountability", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q5: Missed milestone handling (APPLICATION - Keep)
    {
      question: "According to the lesson, what should you do if you miss a milestone?",
      options: [
        "Abandon the goal",
        "Do a retrospective and adjust the plan",
        "Choose a completely different goal",
        "Do nothing"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Personal Development",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#accountability", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q6: Setting up accountability system (APPLICATION - New)
    {
      question: "You want to set up an accountability system for a 6-week goal. According to the lesson, what should you include?",
      options: [
        "Just set the goal",
        "A public goal statement with date and reason, weekly milestones, an accountability partner for weekly check-ins, and a tracking system with concrete metrics",
        "Only an accountability partner",
        "Only a tracking system"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Personal Development",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#accountability", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q7: Accountability system failure analysis (CRITICAL THINKING - New)
    {
      question: "A person sets goals but consistently misses milestones, leading to frustration and goal abandonment. According to the lesson's framework, what is likely missing?",
      options: [
        "Not enough goals",
        "Lack of accountability structures - missing public commitment, accountability partner, or tracking system that creates transparency and early problem detection",
        "The goals are too easy",
        "Accountability is unnecessary"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Personal Development",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#accountability", "#advanced", "#critical-thinking", "#en", "#all-languages"]
    }
  ],
  // Hungarian (HU) - Professional translations
  HU: [
    {
      question: "A lecke szerint a nyilvánosan közölt célok hány százaléka valósul meg?",
      options: [
        "25%",
        "65%",
        "45%",
        "85%"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#accountability", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint mi az elszámoltathatósági partner fő előnye?",
      options: [
        "Nincs",
        "Növeli a motivációt és kitartást",
        "Csökkenti az erőfeszítést",
        "Felesleges"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#accountability", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint az elszámoltathatósági partnered milyen gyakran kellene áttekintenie a haladásodat?",
      options: [
        "Havonta",
        "Hetente",
        "Naponta",
        "Évente"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#accountability", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "Miért fontosak az elszámoltathatósági struktúrák a lecke szerint?",
      options: [
        "Kiküszöbölik a célok szükségességét",
        "Növelik a célkitűzések teljesítési arányát (65% nyilvános céloknál), elkötelezettséget teremtenek az átláthatóságon keresztül, lehetővé teszik a korai problémafelismerést, és csökkentik a halogatást",
        "Csak nagy csapatokra vonatkoznak",
        "Nem igényelnek erőfeszítést"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#accountability", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint mit kell tenni, ha nem éred el a mérföldkövet?",
      options: [
        "Feladd a célt",
        "Retrospektív és módosított terv",
        "Teljesen más célt válassz",
        "Semmi nem kell tenni"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#accountability", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy 6 hetes célhoz szeretnél elszámoltathatósági rendszert létrehozni. A lecke szerint mit kellene tartalmaznia?",
      options: [
        "Csak állítsd be a célt",
        "Egy nyilvános célkitűzési nyilatkozat dátummal és okkal, heti mérföldkövekkel, egy elszámoltathatósági partnerrel heti ellenőrzésekre, és egy nyomon követési rendszerrel konkrét mérőszámokkal",
        "Csak egy elszámoltathatósági partner",
        "Csak egy nyomon követési rendszer"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#accountability", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy személy célokat tűz ki, de következetesen elmulasztja a mérföldköveket, ami frusztrációhoz és célfeladáshoz vezet. A lecke keretrendszere szerint mi hiányzik valószínűleg?",
      options: [
        "Nincs elég cél",
        "Hiányoznak az elszámoltathatósági struktúrák - hiányzik a nyilvános elkötelezettség, elszámoltathatósági partner, vagy nyomon követési rendszer, amely átláthatóságot és korai problémafelismerést teremt",
        "A célok túl könnyűek",
        "Az elszámoltathatóság felesleges"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#accountability", "#advanced", "#critical-thinking", "#hu", "#all-languages"]
    }
  ],
  // Turkish (TR) - Professional translations
  TR: [
    {
      question: "Derse göre halka açık olarak belirtilen hedeflerin yüzde kaçı başarılı olur?",
      options: [
        "%25",
        "%65",
        "%45",
        "%85"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#accountability", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre bir hesap verebilirlik ortaklığının ana faydası nedir?",
      options: [
        "Yok",
        "Motivasyonu ve azmi artırır",
        "Çabayı azaltır",
        "Gereksizdir"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#accountability", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre hesap verebilirlik ortağınız ilerlemenizi ne sıklıkta gözden geçirmelidir?",
      options: [
        "Aylık",
        "Haftalık",
        "Günlük",
        "Yıllık"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#accountability", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre hesap verebilirlik yapıları neden önemlidir?",
      options: [
        "Hedef ihtiyacını ortadan kaldırırlar",
        "Hedef başarı oranlarını artırırlar (%65 halka açık hedefler için), şeffaflık yoluyla taahhüt yaratırlar, erken sorun tespitini mümkün kılarlar ve ertelemeyi azaltırlar",
        "Sadece büyük takımlara uygulanırlar",
        "Çaba gerektirmezler"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#accountability", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre bir kilometer taşını kaçırırsanız ne yapmalısınız?",
      options: [
        "Hedefi terk et",
        "Retrospektif yap ve planı ayarla",
        "Tamamen farklı bir hedef seç",
        "Hiçbir şey yapma"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#accountability", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "6 haftalık bir hedef için hesap verebilirlik sistemi kurmak istiyorsunuz. Derse göre ne içermelidir?",
      options: [
        "Sadece hedefi belirle",
        "Tarih ve nedenle halka açık bir hedef beyanı, haftalık kilometer taşları, haftalık kontroller için bir hesap verebilirlik ortağı ve somut metriklerle bir takip sistemi",
        "Sadece bir hesap verebilirlik ortağı",
        "Sadece bir takip sistemi"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#accountability", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir kişi hedefler belirliyor ancak tutarlı olarak kilometer taşlarını kaçırıyor, bu da hayal kırıklığına ve hedef terkine yol açıyor. Dersin çerçevesine göre muhtemelen ne eksik?",
      options: [
        "Yeterli hedef yok",
        "Hesap verebilirlik yapılarının eksikliği - şeffaflık ve erken sorun tespiti yaratan halka açık taahhüt, hesap verebilirlik ortağı veya takip sistemi eksik",
        "Hedefler çok kolay",
        "Hesap verebilirlik gereksiz"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#accountability", "#advanced", "#critical-thinking", "#tr", "#all-languages"]
    }
  ],
  // Bulgarian (BG) - Professional translations
  BG: [
    {
      question: "Според урока, какъв процент от публично заявени цели се постигат?",
      options: [
        "25%",
        "65%",
        "45%",
        "85%"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#accountability", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, какво е основното предимство на партньорството на отчетност?",
      options: [
        "Нито един",
        "Увеличава мотивацията и упоритост",
        "Намалява усилието",
        "Това е ненужно"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#accountability", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, колко често трябва партньорът на отчетност да преглежда напредъка?",
      options: [
        "Месечно",
        "Седмично",
        "Дневно",
        "Годишно"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#accountability", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Защо структурите на отчетност са важни според урока?",
      options: [
        "Елиминират необходимостта от цели",
        "Увеличават нивата на постигане на цели (65% за публични цели), създават ангажираност чрез прозрачност, позволяват ранно откриване на проблеми и намаляват отлагането",
        "Прилагат се само за големи екипи",
        "Не изискват усилие"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#accountability", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, какво трябва да направите, ако пропуснете веха?",
      options: [
        "Напустете целта",
        "Направете ретроспектива и коригирайте плана",
        "Изберете напълно различна цел",
        "Не правете нищо"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#accountability", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Искате да установите система за отчетност за 6-седмична цел. Според урока, какво трябва да включите?",
      options: [
        "Просто определете целта",
        "Публично изявление за цел с дата и причина, седмични вехи, партньор по отчетност за седмични проверки и система за проследяване с конкретни метрики",
        "Само партньор по отчетност",
        "Само система за проследяване"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#accountability", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Човек определя цели, но последователно пропуска вехи, водещи до фрустрация и изоставяне на цели. Според рамката на урока, какво вероятно липсва?",
      options: [
        "Няма достатъчно цели",
        "Липса на структури на отчетност - липсва публично ангажиране, партньор по отчетност или система за проследяване, която създава прозрачност и ранно откриване на проблеми",
        "Целите са твърде лесни",
        "Отчетността е ненужна"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#accountability", "#advanced", "#critical-thinking", "#bg", "#all-languages"]
    }
  ],
  // Polish (PL) - Professional translations
  PL: [
    {
      question: "Według lekcji, jaki procent publicznie podanych celów zostaje osiągnięty?",
      options: [
        "25%",
        "65%",
        "45%",
        "85%"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#accountability", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, jaka jest główna korzyść z partnerstwa odpowiedzialności?",
      options: [
        "Brak",
        "Zwiększa motywację i wytrwałość",
        "Zmniejsza wysiłek",
        "To niepotrzebne"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#accountability", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, jak często partner odpowiedzialności powinien przeglądać postępy?",
      options: [
        "Miesięcznie",
        "Tygodniowo",
        "Dziennie",
        "Rocznie"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#accountability", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Dlaczego struktury odpowiedzialności są ważne według lekcji?",
      options: [
        "Eliminują potrzebę celów",
        "Zwiększają wskaźniki osiągania celów (65% dla celów publicznych), tworzą zaangażowanie poprzez przejrzystość, umożliwiają wczesne wykrywanie problemów i zmniejszają prokrastynację",
        "Stosują się tylko do dużych zespołów",
        "Nie wymagają wysiłku"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#accountability", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, co powinieneś zrobić, jeśli pominiesz kamień milowy?",
      options: [
        "Porzuć cel",
        "Zrób retrospektywę i dostosuj plan",
        "Wybierz zupełnie inny cel",
        "Nic nie rób"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#accountability", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Chcesz ustawić system odpowiedzialności dla 6-tygodniowego celu. Według lekcji, co powinieneś uwzględnić?",
      options: [
        "Po prostu ustaw cel",
        "Publiczne oświadczenie o celu z datą i powodem, tygodniowe kamienie milowe, partner odpowiedzialności do tygodniowych kontroli i system śledzenia z konkretnymi metrykami",
        "Tylko partner odpowiedzialności",
        "Tylko system śledzenia"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#accountability", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Osoba ustala cele, ale konsekwentnie pomija kamienie milowe, prowadząc do frustracji i porzucenia celów. Według ram lekcji, czego prawdopodobnie brakuje?",
      options: [
        "Niewystarczająca liczba celów",
        "Brak struktur odpowiedzialności - brakuje publicznego zaangażowania, partnera odpowiedzialności lub systemu śledzenia, który tworzy przejrzystość i wczesne wykrywanie problemów",
        "Cele są zbyt łatwe",
        "Odpowiedzialność jest niepotrzebna"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#accountability", "#advanced", "#critical-thinking", "#pl", "#all-languages"]
    }
  ],
  // Vietnamese (VI) - Professional translations
  VI: [
    {
      question: "Theo bài học, bao nhiêu phần trăm các mục tiêu được công bố công khai được đạt được?",
      options: [
        "25%",
        "65%",
        "45%",
        "85%"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#accountability", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, lợi ích chính của quan hệ đối tác trách nhiệm giải trình là gì?",
      options: [
        "Không",
        "Tăng động lực và sự kiên trì",
        "Giảm nỗ lực",
        "Nó không cần thiết"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#accountability", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, đối tác trách nhiệm giải trình của bạn nên xem xét tiến độ thường xuyên bao nhiêu?",
      options: [
        "Hàng tháng",
        "Hàng tuần",
        "Hàng ngày",
        "Hàng năm"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#accountability", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Tại sao cấu trúc trách nhiệm giải trình quan trọng theo bài học?",
      options: [
        "Chúng loại bỏ nhu cầu về mục tiêu",
        "Chúng tăng tỷ lệ đạt mục tiêu (65% cho mục tiêu công khai), tạo cam kết thông qua minh bạch, cho phép phát hiện vấn đề sớm và giảm sự trì hoãn",
        "Chúng chỉ áp dụng cho các đội lớn",
        "Chúng không yêu cầu nỗ lực"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#accountability", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, bạn nên làm gì nếu bỏ lỡ một mốc?",
      options: [
        "Từ bỏ mục tiêu",
        "Thực hiện kiểm tra lại và điều chỉnh kế hoạch",
        "Chọn mục tiêu hoàn toàn khác",
        "Không làm gì"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#accountability", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Bạn muốn thiết lập hệ thống trách nhiệm giải trình cho mục tiêu 6 tuần. Theo bài học, bạn nên bao gồm những gì?",
      options: [
        "Chỉ đặt mục tiêu",
        "Tuyên bố mục tiêu công khai với ngày và lý do, các mốc hàng tuần, đối tác trách nhiệm giải trình cho các cuộc kiểm tra hàng tuần, và hệ thống theo dõi với các số liệu cụ thể",
        "Chỉ một đối tác trách nhiệm giải trình",
        "Chỉ một hệ thống theo dõi"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#accountability", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Một người đặt mục tiêu nhưng liên tục bỏ lỡ các mốc, dẫn đến thất vọng và từ bỏ mục tiêu. Theo khung của bài học, điều gì có thể đang thiếu?",
      options: [
        "Không đủ mục tiêu",
        "Thiếu cấu trúc trách nhiệm giải trình - thiếu cam kết công khai, đối tác trách nhiệm giải trình, hoặc hệ thống theo dõi tạo minh bạch và phát hiện vấn đề sớm",
        "Mục tiêu quá dễ",
        "Trách nhiệm giải trình là không cần thiết"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#accountability", "#advanced", "#critical-thinking", "#vi", "#all-languages"]
    }
  ],
  // Indonesian (ID) - Professional translations
  ID: [
    {
      question: "Menurut pelajaran, berapa persentase tujuan yang diumumkan secara publik yang dicapai?",
      options: [
        "25%",
        "65%",
        "45%",
        "85%"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#accountability", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, apa manfaat utama dari kemitraan akuntabilitas?",
      options: [
        "Tidak ada",
        "Meningkatkan motivasi dan ketekunan",
        "Mengurangi upaya",
        "Itu tidak perlu"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#accountability", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, seberapa sering mitra akuntabilitas Anda harus meninjau kemajuan?",
      options: [
        "Bulanan",
        "Mingguan",
        "Harian",
        "Tahunan"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#accountability", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Mengapa struktur akuntabilitas penting menurut pelajaran?",
      options: [
        "Mereka menghilangkan kebutuhan akan tujuan",
        "Mereka meningkatkan tingkat pencapaian tujuan (65% untuk tujuan publik), menciptakan komitmen melalui transparansi, memungkinkan deteksi masalah dini dan mengurangi penundaan",
        "Mereka hanya berlaku untuk tim besar",
        "Mereka tidak memerlukan upaya"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#accountability", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, apa yang harus Anda lakukan jika melewatkan tonggak?",
      options: [
        "Tinggalkan tujuan",
        "Lakukan retrospektif dan sesuaikan rencana",
        "Pilih tujuan yang sama sekali berbeda",
        "Tidak melakukan apa pun"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#accountability", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Anda ingin mengatur sistem akuntabilitas untuk tujuan 6 minggu. Menurut pelajaran, apa yang harus Anda sertakan?",
      options: [
        "Hanya tetapkan tujuan",
        "Pernyataan tujuan publik dengan tanggal dan alasan, tonggak mingguan, mitra akuntabilitas untuk pemeriksaan mingguan, dan sistem pelacakan dengan metrik konkret",
        "Hanya mitra akuntabilitas",
        "Hanya sistem pelacakan"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#accountability", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Seseorang menetapkan tujuan tetapi secara konsisten melewatkan tonggak, menyebabkan frustrasi dan penelantaran tujuan. Menurut kerangka pelajaran, apa yang mungkin kurang?",
      options: [
        "Tidak cukup tujuan",
        "Kurangnya struktur akuntabilitas - kurang komitmen publik, mitra akuntabilitas, atau sistem pelacakan yang menciptakan transparansi dan deteksi masalah dini",
        "Tujuan terlalu mudah",
        "Akuntabilitas tidak perlu"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#accountability", "#advanced", "#critical-thinking", "#id", "#all-languages"]
    }
  ],
  // Arabic (AR) - Professional translations (RTL)
  AR: [
    {
      question: "وفقًا للدرس، ما نسبة الأهداف المعلنة علنًا التي تم تحقيقها?",
      options: [
        "25%",
        "65%",
        "45%",
        "85%"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#accountability", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، ما هي الفائدة الرئيسية لشراكة المساءلة?",
      options: [
        "لا شيء",
        "تزيد الدافع والمثابرة",
        "تقلل الجهد",
        "غير ضروري"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#accountability", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، كم مرة يجب على شريك المساءلة الخاص بك أن يراجع التقدم?",
      options: [
        "شهريًا",
        "أسبوعيًا",
        "يوميًا",
        "سنويًا"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#accountability", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "لماذا هياكل المساءلة مهمة وفقًا للدرس?",
      options: [
        "إنها تلغي الحاجة للأهداف",
        "تزيد معدلات تحقيق الأهداف (65% للأهداف العامة)، تخلق الالتزام من خلال الشفافية، تمكن من الكشف المبكر عن المشاكل وتقلل التسويف",
        "تنطبق فقط على الفرق الكبيرة",
        "لا تتطلب جهد"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#accountability", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، ماذا يجب أن تفعل إذا فاتتك معلم?",
      options: [
        "تخلى عن الهدف",
        "قم بعمل استعراض وتعديل الخطة",
        "اختر هدفاً مختلفاً تماماً",
        "لا تفعل شيئا"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#accountability", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "تريد إعداد نظام مساءلة لهدف مدته 6 أسابيع. وفقًا للدرس، ماذا يجب أن تتضمن?",
      options: [
        "فقط حدد الهدف",
        "بيان هدف عام مع التاريخ والسبب، معالم أسبوعية، شريك مساءلة للفحوصات الأسبوعية، ونظام تتبع مع مقاييس ملموسة",
        "فقط شريك مساءلة",
        "فقط نظام تتبع"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#accountability", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "شخص يحدد أهدافًا لكنه يفوّت باستمرار المعالم، مما يؤدي إلى الإحباط والتخلي عن الهدف. وفقًا لإطار الدرس، ما الذي ربما كان مفقودًا?",
      options: [
        "لا توجد أهداف كافية",
        "نقص هياكل المساءلة - نقص الالتزام العام، شريك المساءلة، أو نظام التتبع الذي يخلق الشفافية والكشف المبكر عن المشاكل",
        "الأهداف سهلة جدًا",
        "المساءلة غير ضرورية"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#accountability", "#advanced", "#critical-thinking", "#ar", "#all-languages"]
    }
  ],
  // Portuguese (PT) - Professional translations (Brazilian)
  PT: [
    {
      question: "De acordo com a lição, que porcentagem de objetivos comunicados publicamente é alcançada?",
      options: [
        "25%",
        "65%",
        "45%",
        "85%"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#accountability", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, qual é o principal benefício de uma parceria de responsabilidade?",
      options: [
        "Nenhum",
        "Aumenta motivação e perseverança",
        "Reduz o esforço",
        "É desnecessário"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#accountability", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, com que frequência seu parceiro de responsabilidade deve revisar o progresso?",
      options: [
        "Mensalmente",
        "Semanalmente",
        "Diariamente",
        "Anualmente"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#accountability", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "Por que estruturas de responsabilização são importantes de acordo com a lição?",
      options: [
        "Eliminam a necessidade de objetivos",
        "Aumentam as taxas de realização de objetivos (65% para objetivos públicos), criam comprometimento através da transparência, permitem detecção precoce de problemas e reduzem a procrastinação",
        "Aplicam-se apenas a equipes grandes",
        "Não requerem esforço"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#accountability", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, o que você deve fazer se perder um marco?",
      options: [
        "Abandone o objetivo",
        "Faça uma retrospectiva e ajuste o plano",
        "Escolha um objetivo completamente diferente",
        "Não faça nada"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#accountability", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Você quer configurar um sistema de responsabilização para um objetivo de 6 semanas. De acordo com a lição, o que você deve incluir?",
      options: [
        "Apenas defina o objetivo",
        "Uma declaração de objetivo público com data e razão, marcos semanais, um parceiro de responsabilização para verificações semanais e um sistema de rastreamento com métricas concretas",
        "Apenas um parceiro de responsabilização",
        "Apenas um sistema de rastreamento"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#accountability", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Uma pessoa define objetivos, mas consistentemente perde marcos, levando a frustração e abandono de objetivos. De acordo com a estrutura da lição, o que provavelmente está faltando?",
      options: [
        "Não há objetivos suficientes",
        "Falta de estruturas de responsabilização - falta comprometimento público, parceiro de responsabilização ou sistema de rastreamento que cria transparência e detecção precoce de problemas",
        "Os objetivos são muito fáceis",
        "Responsabilização é desnecessária"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#accountability", "#advanced", "#critical-thinking", "#pt", "#all-languages"]
    }
  ],
  // Hindi (HI) - Professional translations
  HI: [
    {
      question: "पाठ के अनुसार, सार्वजनिक रूप से संचार किए गए लक्ष्यों का कितना प्रतिशत प्राप्त होता है?",
      options: [
        "25%",
        "65%",
        "45%",
        "85%"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#accountability", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, जवाबदेही साझेदारी का मुख्य लाभ क्या है?",
      options: [
        "कोई नहीं",
        "प्रेरणा और दृढ़ता बढ़ाता है",
        "प्रयास कम करता है",
        "यह अनावश्यक है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#accountability", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, आपके जवाबदेही भागीदार को प्रगति की समीक्षा कितनी बार करनी चाहिए?",
      options: [
        "मासिक",
        "साप्ताहिक",
        "दैनिक",
        "वार्षिक"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#accountability", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार जवाबदेही संरचनाएं क्यों महत्वपूर्ण हैं?",
      options: [
        "वे लक्ष्यों की आवश्यकता को समाप्त करती हैं",
        "वे लक्ष्य प्राप्ति दरों को बढ़ाती हैं (सार्वजनिक लक्ष्यों के लिए 65%), पारदर्शिता के माध्यम से प्रतिबद्धता बनाती हैं, शीघ्र समस्या का पता लगाने में सक्षम बनाती हैं और टालमटोल को कम करती हैं",
        "वे केवल बड़ी टीमों पर लागू होती हैं",
        "उन्हें प्रयास की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#accountability", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, यदि आप एक मील का पत्थर खो दें तो आपको क्या करना चाहिए?",
      options: [
        "लक्ष्य को त्यागें",
        "एक पूर्वदृष्टि करें और योजना को समायोजित करें",
        "एक पूरी तरह से अलग लक्ष्य चुनें",
        "कुछ मत करो"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#accountability", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "आप 6 सप्ताह के लक्ष्य के लिए जवाबदेही प्रणाली स्थापित करना चाहते हैं। पाठ के अनुसार, आपको क्या शामिल करना चाहिए?",
      options: [
        "बस लक्ष्य निर्धारित करें",
        "तारीख और कारण के साथ एक सार्वजनिक लक्ष्य वक्तव्य, साप्ताहिक मील के पत्थर, साप्ताहिक जांच के लिए एक जवाबदेही भागीदार, और ठोस मेट्रिक्स के साथ एक ट्रैकिंग सिस्टम",
        "केवल एक जवाबदेही भागीदार",
        "केवल एक ट्रैकिंग सिस्टम"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#accountability", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक व्यक्ति लक्ष्य निर्धारित करता है लेकिन लगातार मील के पत्थर खो देता है, जिससे निराशा और लक्ष्य परित्याग होता है। पाठ के ढांचे के अनुसार, क्या संभवतः गायब है?",
      options: [
        "पर्याप्त लक्ष्य नहीं हैं",
        "जवाबदेही संरचनाओं की कमी - पारदर्शिता और शीघ्र समस्या का पता लगाने वाला सार्वजनिक प्रतिबद्धता, जवाबदेही भागीदार, या ट्रैकिंग सिस्टम गायब",
        "लक्ष्य बहुत आसान हैं",
        "जवाबदेही अनावश्यक है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#accountability", "#advanced", "#critical-thinking", "#hi", "#all-languages"]
    }
  ]
};

async function seedDay12Enhanced() {
  try {
    await connectDB();
    console.log('🌱 SEEDING DAY 12 ENHANCED QUIZ QUESTIONS\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    let totalQuestions = 0;
    let totalUpdated = 0;
    let totalCreated = 0;

    for (const lang of LANGUAGES) {
      const courseId = `${COURSE_ID_BASE}_${lang}`;
      const lessonId = `${COURSE_ID_BASE}_${lang}_DAY_12`;

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
      const questions = DAY12_QUESTIONS[lang];
      
      if (!questions || questions.length === 0) {
        console.error(`   ❌ ERROR: No questions defined for ${lang}! Questions MUST be in course language.`);
        throw new Error(`Missing translations for ${lang} - Day 12 questions must be in course language, not English fallback`);
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
    console.log(`\n✅ DAY 12 ENHANCEMENT COMPLETE!\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedDay12Enhanced();
