/**
 * Seed Day 9 Enhanced Quiz Questions
 * 
 * Purpose: Enhance Day 9 quizzes from 5 to 7 questions across all 10 languages
 * Why: Part of Quiz Quality Enhancement - Phase 1, Day 9
 * 
 * Lesson Topic: Delegation vs Elimination (when to delegate, what to eliminate)
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
const DAY_NUMBER = 9;
const LANGUAGES = ['HU', 'EN', 'TR', 'BG', 'PL', 'VI', 'ID', 'AR', 'PT', 'HI'];

/**
 * Day 9 Enhanced Questions - All Languages
 * Topic: Delegation vs Elimination
 * Structure: 7 questions per language
 * Q1-Q3: Keep (Recall - foundational concepts)
 * Q4: Rewritten (Application - from definition to purpose)
 * Q5: Keep (Application - scenario-based)
 * Q6: New (Application - practical implementation)
 * Q7: New (Critical Thinking - systems integration)
 */
const DAY9_QUESTIONS: Record<string, Array<{
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: QuestionDifficulty;
  category: string;
  questionType: QuestionType;
  hashtags: string[];
}>> = {
  EN: [
    // Q1: Difference between delegation and elimination (RECALL - Keep)
    {
      question: "According to the lesson, what is the main difference between delegation and elimination?",
      options: [
        "No difference",
        "Delegation: assign to others; Elimination: drop the task",
        "Delegation: drop task; Elimination: assign to others",
        "Only elimination is needed"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Delegation & Elimination",
      questionType: QuestionType.RECALL,
      hashtags: ["#delegation", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q2: Which tasks can be delegated (RECALL - Keep)
    {
      question: "According to the lesson, which tasks can be delegated?",
      options: [
        "Only decisions",
        "Strategy",
        "Routine tasks, research, technical support",
        "Mentoring"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Delegation & Elimination",
      questionType: QuestionType.RECALL,
      hashtags: ["#delegation", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q3: How to identify eliminable tasks (RECALL - Keep)
    {
      question: "According to the lesson, how do you identify an eliminable task?",
      options: [
        "It takes a lot of time",
        "Important and high priority",
        "If skipped, there is no or minimal loss",
        "Only managers do it"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Delegation & Elimination",
      questionType: QuestionType.RECALL,
      hashtags: ["#elimination", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q4: Why delegation matters (APPLICATION - Rewritten from definition)
    {
      question: "Why is effective delegation important according to the lesson?",
      options: [
        "It reduces your workload immediately",
        "It frees your time for high-value work, develops team capability, and creates more value overall",
        "It only applies to routine tasks",
        "It eliminates the need for quality control"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Delegation & Elimination",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#delegation", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q5: Non-delegable tasks (APPLICATION - Keep)
    {
      question: "According to the lesson, what are non-delegable tasks?",
      options: [
        "Routine tasks",
        "Decisions, strategic thinking, high-risk interactions",
        "Email filtering",
        "Planning"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Delegation & Elimination",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#delegation", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q6: Applying delegation criteria (APPLICATION - New)
    {
      question: "A manager spends 10 hours weekly on email filtering and calendar management while strategic planning suffers. According to the lesson, what should they do?",
      options: [
        "Work faster on both",
        "Delegate email filtering and calendar management to free time for strategic planning",
        "Eliminate strategic planning",
        "Work longer hours"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Delegation & Elimination",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#delegation", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q7: Delegation vs elimination decision (CRITICAL THINKING - New)
    {
      question: "A manager has low-value tasks consuming 20 hours weekly but struggles to decide between delegation and elimination. According to the lesson's framework, what should guide this decision?",
      options: [
        "Always delegate, never eliminate",
        "If the task provides value to someone else, delegate; if it provides no value to anyone, eliminate",
        "Always eliminate to save costs",
        "Keep all tasks to maintain control"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Delegation & Elimination",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#delegation", "#elimination", "#advanced", "#critical-thinking", "#en", "#all-languages"]
    }
  ],
  // Hungarian translations
  HU: [
    {
      question: "A lecke szerint mi a fő különbség a delegálás és a kiiktatás között?",
      options: [
        "Nincs különbség",
        "Delegálás: másoknak adni; Kiiktatás: a feladat elhagyása",
        "Delegálás: feladat elhagyása; Kiiktatás: másoknak adni",
        "Csak a kiiktatás szükséges"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Delegálás és Kiiktatás",
      questionType: QuestionType.RECALL,
      hashtags: ["#delegation", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint mely feladatok delegálhatók?",
      options: [
        "Csak döntések",
        "Stratégia",
        "Rutinfeladatok, kutatás, technikai támogatás",
        "Mentorálás"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Delegálás és Kiiktatás",
      questionType: QuestionType.RECALL,
      hashtags: ["#delegation", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint hogyan azonosítasz egy kiiktatható feladatot?",
      options: [
        "Sok időt vesz igénybe",
        "Fontos és magas prioritás",
        "Ha kihagyod, nincs vagy minimális veszteség",
        "Csak menedzserek csinálják"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Delegálás és Kiiktatás",
      questionType: QuestionType.RECALL,
      hashtags: ["#elimination", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "Miért fontos a hatékony delegálás a lecke szerint?",
      options: [
        "Azonnal csökkenti a munkaterhelésed",
        "Felszabadítja az idődet a magas értékű munkához, fejleszti a csapat képességét, és összességében több értéket teremt",
        "Csak rutinfeladatokra vonatkozik",
        "Kiküszöböli a minőségellenőrzés szükségességét"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Delegálás és Kiiktatás",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#delegation", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint mik a nem delegálható feladatok?",
      options: [
        "Rutinfeladatok",
        "Döntések, stratégiai gondolkodás, magas kockázatú interakciók",
        "Email szűrés",
        "Tervezés"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Delegálás és Kiiktatás",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#delegation", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy menedzser hetente 10 órát tölt email szűréssel és naptár kezeléssel, miközben a stratégiai tervezés szenved. A lecke szerint mit kellene tennie?",
      options: [
        "Gyorsabban dolgozni mindkettőn",
        "Delegálni az email szűrést és naptár kezelést, hogy időt szabadítson fel a stratégiai tervezéshez",
        "Kiküszöbölni a stratégiai tervezést",
        "Hosszabb ideig dolgozni"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Delegálás és Kiiktatás",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#delegation", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy menedzsernek vannak alacsony értékű feladatai, amelyek hetente 20 órát igényelnek, de nehezen dönt a delegálás és a kiiktatás között. A lecke keretrendszere szerint mi kellene, hogy irányítsa ezt a döntést?",
      options: [
        "Mindig delegálj, soha ne iktasd ki",
        "Ha a feladat értéket nyújt másnak, delegáld; ha senkinek sem nyújt értéket, iktasd ki",
        "Mindig iktasd ki a költségek megtakarítása érdekében",
        "Tartsd meg az összes feladatot a kontroll fenntartása érdekében"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Delegálás és Kiiktatás",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#delegation", "#elimination", "#advanced", "#critical-thinking", "#hu", "#all-languages"]
    }
  ],
  // Turkish (TR) - Professional translations
  TR: [
    {
      question: "Derse göre delegasyon ve eliminasyon arasındaki temel fark nedir?",
      options: [
        "Fark yok",
        "Delegasyon: başkalarına atamak; Eliminasyon: görevi bırakmak",
        "Delegasyon: görevi bırakmak; Eliminasyon: başkalarına atamak",
        "Sadece eliminasyon gereklidir"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Delegasyon ve Eliminasyon",
      questionType: QuestionType.RECALL,
      hashtags: ["#delegation", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre hangi görevler delege edilebilir?",
      options: [
        "Sadece kararlar",
        "Strateji",
        "Rutin görevler, araştırma, teknik destek",
        "Mentorluk"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Delegasyon ve Eliminasyon",
      questionType: QuestionType.RECALL,
      hashtags: ["#delegation", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre eliminasyon yapılabilir bir görevi nasıl tanımlarsınız?",
      options: [
        "Çok zaman alır",
        "Önemli ve yüksek öncelik",
        "Atlanırsa hiçbir veya minimal kayıp vardır",
        "Sadece yöneticiler yapar"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Delegasyon ve Eliminasyon",
      questionType: QuestionType.RECALL,
      hashtags: ["#elimination", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre etkili delegasyon neden önemlidir?",
      options: [
        "İş yükünüzü hemen azaltır",
        "Zamanınızı yüksek değerli iş için serbest bırakır, takım yeteneğini geliştirir ve genel olarak daha fazla değer yaratır",
        "Sadece rutin görevlere uygulanır",
        "Kalite kontrolü ihtiyacını ortadan kaldırır"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Delegasyon ve Eliminasyon",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#delegation", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre delege edilemeyen görevler nelerdir?",
      options: [
        "Rutin görevler",
        "Kararlar, stratejik düşünce, yüksek riskli etkileşimler",
        "E-posta filtreleme",
        "Planlama"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Delegasyon ve Eliminasyon",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#delegation", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir yönetici haftada 10 saatini e-posta filtreleme ve takvim yönetimine harcıyor, stratejik planlama zarar görüyor. Derse göre ne yapmalı?",
      options: [
        "Her ikisinde de daha hızlı çalışmak",
        "E-posta filtreleme ve takvim yönetimini delege ederek stratejik planlama için zaman açmak",
        "Stratejik planlamayı ortadan kaldırmak",
        "Daha uzun saatler çalışmak"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Delegasyon ve Eliminasyon",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#delegation", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir yöneticinin haftada 20 saat tüketen düşük değerli görevleri var ancak delegasyon ve eliminasyon arasında karar vermekte zorlanıyor. Dersin çerçevesine göre bu kararı ne yönlendirmelidir?",
      options: [
        "Her zaman delege et, asla ortadan kaldırma",
        "Görev başkasına değer sağlıyorsa delege et; hiç kimseye değer sağlamıyorsa ortadan kaldır",
        "Maliyetleri tasarruf etmek için her zaman ortadan kaldır",
        "Kontrolü korumak için tüm görevleri tut"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Delegasyon ve Eliminasyon",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#delegation", "#elimination", "#advanced", "#critical-thinking", "#tr", "#all-languages"]
    }
  ],
  // Bulgarian (BG) - Professional translations
  BG: [
    {
      question: "Според урока, каква е основната разлика между делегирането и премахването?",
      options: [
        "Няма разлика",
        "Делегиране: възлагане на други; Премахване: изоставяне на задачата",
        "Делегиране: изоставяне на задачата; Премахване: възлагане на други",
        "Само премахването е необходимо"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Делегиране и Премахване",
      questionType: QuestionType.RECALL,
      hashtags: ["#delegation", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, кои задачи могат да бъдат делегирани?",
      options: [
        "Само решения",
        "Стратегия",
        "Рутинни задачи, изследване, техническа поддръжка",
        "Менторство"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Делегиране и Премахване",
      questionType: QuestionType.RECALL,
      hashtags: ["#delegation", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, как идентифицирате задача, която може да бъде премахната?",
      options: [
        "Отнема много време",
        "Важна и висок приоритет",
        "Ако се пропусне, няма или минимална загуба",
        "Само мениджъри го правят"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Делегиране и Премахване",
      questionType: QuestionType.RECALL,
      hashtags: ["#elimination", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Защо е важно ефективното делегиране според урока?",
      options: [
        "Веднага намалява работното ви натоварване",
        "Освобождава времето ви за работа с висока стойност, развива способностите на екипа и създава повече стойност общо",
        "Прилага се само за рутинни задачи",
        "Елиминира необходимостта от контрол на качеството"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Делегиране и Премахване",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#delegation", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, какви са неделегируемите задачи?",
      options: [
        "Рутинни задачи",
        "Решения, стратегическо мислене, високорискови взаимодействия",
        "Филтриране на имейли",
        "Планиране"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Делегиране и Премахване",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#delegation", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Мениджър прекарва 10 часа седмично за филтриране на имейли и управление на календар, докато стратегическото планиране страда. Според урока, какво трябва да направи?",
      options: [
        "Работи по-бързо и на двете",
        "Делегира филтрирането на имейли и управлението на календар, за да освободи време за стратегическо планиране",
        "Елиминира стратегическото планиране",
        "Работи по-дълги часове"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Делегиране и Премахване",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#delegation", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Мениджър има задачи с ниска стойност, които консумират 20 часа седмично, но се бори да реши между делегиране и премахване. Според рамката на урока, какво трябва да насочва това решение?",
      options: [
        "Винаги делегирай, никога не премахвай",
        "Ако задачата осигурява стойност на някой друг, делегирай; ако не осигурява стойност на никого, премахни",
        "Винаги премахвай, за да спестиш разходи",
        "Запази всички задачи, за да запазиш контрол"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Делегиране и Премахване",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#delegation", "#elimination", "#advanced", "#critical-thinking", "#bg", "#all-languages"]
    }
  ],
  // Polish (PL) - Professional translations
  PL: [
    {
      question: "Według lekcji, jaka jest główna różnica między delegowaniem a eliminacją?",
      options: [
        "Brak różnicy",
        "Delegowanie: przekazanie innym; Eliminacja: porzucenie zadania",
        "Delegowanie: porzucenie zadania; Eliminacja: przekazanie innym",
        "Tylko eliminacja jest konieczna"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Delegowanie i Eliminacja",
      questionType: QuestionType.RECALL,
      hashtags: ["#delegation", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, które zadania można delegować?",
      options: [
        "Tylko decyzje",
        "Strategia",
        "Zadania rutynowe, badania, wsparcie techniczne",
        "Mentoring"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Delegowanie i Eliminacja",
      questionType: QuestionType.RECALL,
      hashtags: ["#delegation", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, jak identyfikujesz zadanie do wyeliminowania?",
      options: [
        "Zajmuje dużo czasu",
        "Ważne i wysoki priorytet",
        "Jeśli go pominąć, brak lub minimalna strata",
        "Tylko menedżerowie to robią"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Delegowanie i Eliminacja",
      questionType: QuestionType.RECALL,
      hashtags: ["#elimination", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Dlaczego skuteczne delegowanie jest ważne według lekcji?",
      options: [
        "Natychmiast zmniejsza obciążenie pracą",
        "Uwalnia czas na pracę o wysokiej wartości, rozwija zdolności zespołu i tworzy więcej wartości ogółem",
        "Dotyczy tylko zadań rutynowych",
        "Eliminuje potrzebę kontroli jakości"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Delegowanie i Eliminacja",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#delegation", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, jakie są zadania niedelegowalne?",
      options: [
        "Zadania rutynowe",
        "Decyzje, myślenie strategiczne, interakcje wysokiego ryzyka",
        "Filtrowanie e-maili",
        "Planowanie"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Delegowanie i Eliminacja",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#delegation", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Menedżer spędza 10 godzin tygodniowo na filtrowaniu e-maili i zarządzaniu kalendarzem, podczas gdy planowanie strategiczne cierpi. Według lekcji, co powinien zrobić?",
      options: [
        "Pracować szybciej nad obydwoma",
        "Delegować filtrowanie e-maili i zarządzanie kalendarzem, aby uwolnić czas na planowanie strategiczne",
        "Wyeliminować planowanie strategiczne",
        "Pracować dłużej"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Delegowanie i Eliminacja",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#delegation", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Menedżer ma zadania o niskiej wartości, które konsumują 20 godzin tygodniowo, ale ma trudności z decyzją między delegowaniem a eliminacją. Według ram lekcji, co powinno kierować tą decyzją?",
      options: [
        "Zawsze deleguj, nigdy nie eliminuj",
        "Jeśli zadanie zapewnia wartość komuś innemu, deleguj; jeśli nie zapewnia wartości nikomu, wyeliminuj",
        "Zawsze eliminuj, aby zaoszczędzić koszty",
        "Zachowaj wszystkie zadania, aby zachować kontrolę"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Delegowanie i Eliminacja",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#delegation", "#elimination", "#advanced", "#critical-thinking", "#pl", "#all-languages"]
    }
  ],
  // Vietnamese (VI) - Professional translations
  VI: [
    {
      question: "Theo bài học, sự khác biệt chính giữa phân công và loại bỏ là gì?",
      options: [
        "Không có khác biệt",
        "Phân công: giao cho người khác; Loại bỏ: bỏ nhiệm vụ",
        "Phân công: bỏ nhiệm vụ; Loại bỏ: giao cho người khác",
        "Chỉ loại bỏ là cần thiết"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Phân công và Loại bỏ",
      questionType: QuestionType.RECALL,
      hashtags: ["#delegation", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, những nhiệm vụ nào có thể được phân công?",
      options: [
        "Chỉ quyết định",
        "Chiến lược",
        "Nhiệm vụ thường lệ, nghiên cứu, hỗ trợ kỹ thuật",
        "Cố vấn"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Phân công và Loại bỏ",
      questionType: QuestionType.RECALL,
      hashtags: ["#delegation", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, bạn xác định một nhiệm vụ có thể loại bỏ như thế nào?",
      options: [
        "Mất nhiều thời gian",
        "Quan trọng và ưu tiên cao",
        "Nếu bỏ qua, không có hoặc mất rất ít",
        "Chỉ các nhà quản lý làm"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Phân công và Loại bỏ",
      questionType: QuestionType.RECALL,
      hashtags: ["#elimination", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Tại sao phân công hiệu quả lại quan trọng theo bài học?",
      options: [
        "Nó giảm ngay khối lượng công việc của bạn",
        "Nó giải phóng thời gian của bạn cho công việc có giá trị cao, phát triển khả năng của nhóm và tạo ra nhiều giá trị hơn tổng thể",
        "Nó chỉ áp dụng cho nhiệm vụ thường lệ",
        "Nó loại bỏ nhu cầu kiểm soát chất lượng"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Phân công và Loại bỏ",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#delegation", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, những nhiệm vụ nào không thể phân công?",
      options: [
        "Nhiệm vụ thường lệ",
        "Quyết định, tư duy chiến lược, tương tác rủi ro cao",
        "Lọc email",
        "Lập kế hoạch"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Phân công và Loại bỏ",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#delegation", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Một người quản lý dành 10 giờ mỗi tuần cho việc lọc email và quản lý lịch trong khi lập kế hoạch chiến lược bị ảnh hưởng. Theo bài học, họ nên làm gì?",
      options: [
        "Làm việc nhanh hơn trên cả hai",
        "Phân công lọc email và quản lý lịch để giải phóng thời gian cho lập kế hoạch chiến lược",
        "Loại bỏ lập kế hoạch chiến lược",
        "Làm việc nhiều giờ hơn"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Phân công và Loại bỏ",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#delegation", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Một người quản lý có các nhiệm vụ giá trị thấp tiêu tốn 20 giờ mỗi tuần nhưng gặp khó khăn khi quyết định giữa phân công và loại bỏ. Theo khung của bài học, điều gì nên hướng dẫn quyết định này?",
      options: [
        "Luôn phân công, không bao giờ loại bỏ",
        "Nếu nhiệm vụ cung cấp giá trị cho người khác, phân công; nếu không cung cấp giá trị cho ai, loại bỏ",
        "Luôn loại bỏ để tiết kiệm chi phí",
        "Giữ tất cả nhiệm vụ để duy trì kiểm soát"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Phân công và Loại bỏ",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#delegation", "#elimination", "#advanced", "#critical-thinking", "#vi", "#all-languages"]
    }
  ],
  // Indonesian (ID) - Professional translations
  ID: [
    {
      question: "Menurut pelajaran, apa perbedaan utama antara delegasi dan eliminasi?",
      options: [
        "Tidak ada perbedaan",
        "Delegasi: serahkan ke orang lain; Eliminasi: tinggalkan tugas",
        "Delegasi: tinggalkan tugas; Eliminasi: serahkan ke orang lain",
        "Hanya eliminasi yang diperlukan"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Delegasi dan Eliminasi",
      questionType: QuestionType.RECALL,
      hashtags: ["#delegation", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, tugas mana yang dapat didelegasikan?",
      options: [
        "Hanya keputusan",
        "Strategi",
        "Tugas rutin, penelitian, dukungan teknis",
        "Mentoring"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Delegasi dan Eliminasi",
      questionType: QuestionType.RECALL,
      hashtags: ["#delegation", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, bagaimana Anda mengidentifikasi tugas yang dapat dieliminasi?",
      options: [
        "Memakan banyak waktu",
        "Penting dan prioritas tinggi",
        "Jika diabaikan, tidak ada atau kerugian minimal",
        "Hanya manajer yang melakukannya"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Delegasi dan Eliminasi",
      questionType: QuestionType.RECALL,
      hashtags: ["#elimination", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Mengapa delegasi yang efektif penting menurut pelajaran?",
      options: [
        "Ini segera mengurangi beban kerja Anda",
        "Ini membebaskan waktu Anda untuk pekerjaan bernilai tinggi, mengembangkan kemampuan tim, dan menciptakan lebih banyak nilai secara keseluruhan",
        "Ini hanya berlaku untuk tugas rutin",
        "Ini menghilangkan kebutuhan kontrol kualitas"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Delegasi dan Eliminasi",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#delegation", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, apa tugas yang tidak dapat didelegasikan?",
      options: [
        "Tugas rutin",
        "Keputusan, pemikiran strategis, interaksi berisiko tinggi",
        "Penyaringan email",
        "Perencanaan"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Delegasi dan Eliminasi",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#delegation", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Seorang manajer menghabiskan 10 jam per minggu untuk penyaringan email dan manajemen kalender sementara perencanaan strategis menderita. Menurut pelajaran, apa yang harus mereka lakukan?",
      options: [
        "Bekerja lebih cepat pada keduanya",
        "Delegasikan penyaringan email dan manajemen kalender untuk membebaskan waktu untuk perencanaan strategis",
        "Eliminasi perencanaan strategis",
        "Bekerja lebih lama"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Delegasi dan Eliminasi",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#delegation", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Seorang manajer memiliki tugas bernilai rendah yang mengonsumsi 20 jam per minggu tetapi kesulitan memutuskan antara delegasi dan eliminasi. Menurut kerangka pelajaran, apa yang harus memandu keputusan ini?",
      options: [
        "Selalu delegasikan, jangan pernah eliminasi",
        "Jika tugas memberikan nilai kepada orang lain, delegasikan; jika tidak memberikan nilai kepada siapa pun, eliminasi",
        "Selalu eliminasi untuk menghemat biaya",
        "Pertahankan semua tugas untuk mempertahankan kontrol"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Delegasi dan Eliminasi",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#delegation", "#elimination", "#advanced", "#critical-thinking", "#id", "#all-languages"]
    }
  ],
  // Arabic (AR) - Professional translations (RTL)
  AR: [
    {
      question: "وفقًا للدرس، ما الفرق الرئيسي بين التفويض والحذف؟",
      options: [
        "لا فرق",
        "التفويض: إسناد للآخرين؛ الحذف: ترك المهمة",
        "التفويض: ترك المهمة؛ الحذف: إسناد للآخرين",
        "فقط الحذف مطلوب"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "التفويض والحذف",
      questionType: QuestionType.RECALL,
      hashtags: ["#delegation", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، ما المهام التي يمكن تفويضها؟",
      options: [
        "فقط القرارات",
        "الاستراتيجية",
        "المهام الروتينية والبحث والدعم الفني",
        "التوجيه"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "التفويض والحذف",
      questionType: QuestionType.RECALL,
      hashtags: ["#delegation", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، كيف تحدد مهمة يمكن حذفها؟",
      options: [
        "تستغرق وقتاً طويلاً",
        "مهمة وأولوية عالية",
        "إذا تم تخطيها لا توجد أو خسارة بسيطة",
        "فقط المديرون يفعلونها"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "التفويض والحذف",
      questionType: QuestionType.RECALL,
      hashtags: ["#elimination", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "لماذا التفويض الفعال مهم وفقًا للدرس؟",
      options: [
        "يقلل عبء العمل فورًا",
        "يحرر وقتك للعمل عالي القيمة، يطور قدرة الفريق، ويخلق المزيد من القيمة بشكل عام",
        "ينطبق فقط على المهام الروتينية",
        "يلغي الحاجة لمراقبة الجودة"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "التفويض والحذف",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#delegation", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، ما المهام التي لا يمكن تفويضها؟",
      options: [
        "مهام روتينية",
        "قرارات وتفكير استراتيجي وتفاعلات عالية المخاطر",
        "تصفية البريد الإلكتروني",
        "التخطيط"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "التفويض والحذف",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#delegation", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "يقضي مدير 10 ساعات أسبوعيًا في تصفية البريد الإلكتروني وإدارة التقويم بينما يعاني التخطيط الاستراتيجي. وفقًا للدرس، ماذا يجب أن يفعل؟",
      options: [
        "العمل بشكل أسرع على كليهما",
        "تفويض تصفية البريد الإلكتروني وإدارة التقويم لتحرير الوقت للتخطيط الاستراتيجي",
        "حذف التخطيط الاستراتيجي",
        "العمل لساعات أطول"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "التفويض والحذف",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#delegation", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "لدى مدير مهام منخفضة القيمة تستهلك 20 ساعة أسبوعيًا لكنه يكافح للقرار بين التفويض والحذف. وفقًا لإطار الدرس، ماذا يجب أن يوجه هذا القرار؟",
      options: [
        "فوض دائمًا، لا تحذف أبدًا",
        "إذا كانت المهمة توفر قيمة لشخص آخر، فوض؛ إذا لم توفر قيمة لأي شخص، احذف",
        "احذف دائمًا لتوفير التكاليف",
        "احتفظ بجميع المهام للحفاظ على السيطرة"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "التفويض والحذف",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#delegation", "#elimination", "#advanced", "#critical-thinking", "#ar", "#all-languages"]
    }
  ],
  // Portuguese (PT) - Professional translations (Brazilian)
  PT: [
    {
      question: "De acordo com a lição, qual é a principal diferença entre delegação e eliminação?",
      options: [
        "Nenhuma diferença",
        "Delegação: repassar para outros; Eliminação: abandonar a tarefa",
        "Delegação: abandonar tarefa; Eliminação: repassar para outros",
        "Apenas eliminação é necessária"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Delegação e Eliminação",
      questionType: QuestionType.RECALL,
      hashtags: ["#delegation", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, quais tarefas podem ser delegadas?",
      options: [
        "Apenas decisões",
        "Estratégia",
        "Tarefas rotineiras, pesquisa, suporte técnico",
        "Mentorado"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Delegação e Eliminação",
      questionType: QuestionType.RECALL,
      hashtags: ["#delegation", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, como você identifica uma tarefa que pode ser eliminada?",
      options: [
        "Consome muito tempo",
        "Importante e alta prioridade",
        "Se ignorada, há pouca ou nenhuma perda",
        "Apenas gerentes fazem"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Delegação e Eliminação",
      questionType: QuestionType.RECALL,
      hashtags: ["#elimination", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "Por que a delegação eficaz é importante de acordo com a lição?",
      options: [
        "Reduz imediatamente sua carga de trabalho",
        "Libera seu tempo para trabalho de alto valor, desenvolve a capacidade da equipe e cria mais valor no geral",
        "Aplica-se apenas a tarefas rotineiras",
        "Elimina a necessidade de controle de qualidade"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Delegação e Eliminação",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#delegation", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, quais são tarefas não delegáveis?",
      options: [
        "Tarefas rotineiras",
        "Decisões, pensamento estratégico, interações de alto risco",
        "Filtragem de email",
        "Planejamento"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Delegação e Eliminação",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#delegation", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Um gerente gasta 10 horas por semana filtrando e-mails e gerenciando calendário enquanto o planejamento estratégico sofre. De acordo com a lição, o que ele deve fazer?",
      options: [
        "Trabalhar mais rápido em ambos",
        "Delegar filtragem de e-mails e gerenciamento de calendário para liberar tempo para planejamento estratégico",
        "Eliminar planejamento estratégico",
        "Trabalhar mais horas"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Delegação e Eliminação",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#delegation", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Um gerente tem tarefas de baixo valor que consomem 20 horas por semana, mas luta para decidir entre delegação e eliminação. De acordo com a estrutura da lição, o que deve orientar essa decisão?",
      options: [
        "Sempre delegue, nunca elimine",
        "Se a tarefa fornece valor para outra pessoa, delegue; se não fornece valor para ninguém, elimine",
        "Sempre elimine para economizar custos",
        "Mantenha todas as tarefas para manter o controle"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Delegação e Eliminação",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#delegation", "#elimination", "#advanced", "#critical-thinking", "#pt", "#all-languages"]
    }
  ],
  // Hindi (HI) - Professional translations
  HI: [
    {
      question: "पाठ के अनुसार, प्रतिनिधिमंडन और उन्मूलन के बीच मुख्य अंतर क्या है?",
      options: [
        "कोई अंतर नहीं",
        "प्रतिनिधिमंडन: दूसरों को सौंपें; उन्मूलन: कार्य छोड़ दें",
        "प्रतिनिधिमंडन: कार्य छोड़ दें; उन्मूलन: दूसरों को सौंपें",
        "केवल उन्मूलन आवश्यक है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "प्रतिनिधिमंडन और उन्मूलन",
      questionType: QuestionType.RECALL,
      hashtags: ["#delegation", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, कौन से कार्य प्रतिनिधि किए जा सकते हैं?",
      options: [
        "केवल निर्णय",
        "रणनीति",
        "नियमित कार्य, अनुसंधान, तकनीकी समर्थन",
        "सलाह"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "प्रतिनिधिमंडन और उन्मूलन",
      questionType: QuestionType.RECALL,
      hashtags: ["#delegation", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, आप एक उन्मूलन योग्य कार्य की पहचान कैसे करते हैं?",
      options: [
        "यह बहुत समय लेता है",
        "महत्वपूर्ण और उच्च प्राथमिकता",
        "यदि छोड़ दिया जाए, तो कोई या न्यूनतम नुकसान होता है",
        "केवल प्रबंधक करते हैं"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "प्रतिनिधिमंडन और उन्मूलन",
      questionType: QuestionType.RECALL,
      hashtags: ["#elimination", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार प्रभावी प्रतिनिधिमंडन क्यों महत्वपूर्ण है?",
      options: [
        "यह तुरंत आपके कार्यभार को कम करता है",
        "यह आपके समय को उच्च मूल्य वाले कार्य के लिए मुक्त करता है, टीम की क्षमता विकसित करता है, और कुल मिलाकर अधिक मूल्य बनाता है",
        "यह केवल नियमित कार्यों पर लागू होता है",
        "यह गुणवत्ता नियंत्रण की आवश्यकता को समाप्त करता है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "प्रतिनिधिमंडन और उन्मूलन",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#delegation", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, गैर-प्रतिनिधि योग्य कार्य क्या हैं?",
      options: [
        "नियमित कार्य",
        "निर्णय, रणनीतिक सोच, उच्च जोखिम वाली बातचीत",
        "ईमेल फ़िल्टरिंग",
        "योजना"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "प्रतिनिधिमंडन और उन्मूलन",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#delegation", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक प्रबंधक साप्ताहिक 10 घंटे ईमेल फ़िल्टरिंग और कैलेंडर प्रबंधन में बिताता है जबकि रणनीतिक योजना प्रभावित होती है। पाठ के अनुसार, उन्हें क्या करना चाहिए?",
      options: [
        "दोनों पर तेजी से काम करना",
        "रणनीतिक योजना के लिए समय मुक्त करने के लिए ईमेल फ़िल्टरिंग और कैलेंडर प्रबंधन को प्रतिनिधि करना",
        "रणनीतिक योजना को समाप्त करना",
        "अधिक घंटे काम करना"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "प्रतिनिधिमंडन और उन्मूलन",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#delegation", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक प्रबंधक के पास कम मूल्य वाले कार्य हैं जो साप्ताहिक 20 घंटे खपत करते हैं लेकिन प्रतिनिधिमंडन और उन्मूलन के बीच निर्णय लेने में संघर्ष करता है। पाठ के ढांचे के अनुसार, इस निर्णय को क्या निर्देशित करना चाहिए?",
      options: [
        "हमेशा प्रतिनिधि करें, कभी समाप्त न करें",
        "यदि कार्य किसी और को मूल्य प्रदान करता है, तो प्रतिनिधि करें; यदि यह किसी को मूल्य प्रदान नहीं करता है, तो समाप्त करें",
        "लागत बचाने के लिए हमेशा समाप्त करें",
        "नियंत्रण बनाए रखने के लिए सभी कार्य रखें"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "प्रतिनिधिमंडन और उन्मूलन",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#delegation", "#elimination", "#advanced", "#critical-thinking", "#hi", "#all-languages"]
    }
  ]
};

async function seedDay9Enhanced() {
  try {
    await connectDB();
    console.log('🌱 SEEDING DAY 9 ENHANCED QUIZ QUESTIONS\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    let totalQuestions = 0;
    let totalUpdated = 0;
    let totalCreated = 0;

    for (const lang of LANGUAGES) {
      const courseId = `${COURSE_ID_BASE}_${lang}`;
      const lessonId = `${COURSE_ID_BASE}_${lang}_DAY_09`;

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
      const questions = DAY9_QUESTIONS[lang] || DAY9_QUESTIONS['EN']; // Fallback to EN if not translated
      
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
    console.log(`\n✅ DAY 9 ENHANCEMENT COMPLETE!\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedDay9Enhanced();
