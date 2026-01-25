/**
 * Seed Day 20 Enhanced Quiz Questions
 * 
 * Purpose: Enhance Day 20 quizzes from 5 to 7 questions across all 10 languages
 * Why: Part of Quiz Quality Enhancement - Phase 1, Day 20
 * 
 * Lesson Topic: Personal Life Productivity (home organization, personal projects)
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
const DAY_NUMBER = 20;
const LANGUAGES = ['HU', 'EN', 'TR', 'BG', 'PL', 'VI', 'ID', 'AR', 'PT', 'HI'];

/**
 * Day 20 Enhanced Questions - All Languages
 * Topic: Personal Life Productivity
 * Structure: 7 questions per language
 * Q1-Q3: Keep (Recall - foundational concepts)
 * Q4: Rewritten (Application - from definition to purpose)
 * Q5: Keep (Application - scenario-based)
 * Q6: New (Application - practical implementation)
 * Q7: New (Critical Thinking - systems integration)
 */
const DAY20_QUESTIONS: Record<string, Array<{
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: QuestionDifficulty;
  category: string;
  questionType: QuestionType;
  hashtags: string[];
}>> = {
  EN: [
    // Q1: Personal productivity definition (RECALL)
    {
      question: "According to the lesson, what is personal life productivity?",
      options: [
        "Only work tasks",
        "Extending productivity principles to all areas of life, including home organization and personal projects",
        "Only home tasks",
        "No organization needed"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Personal Productivity",
      questionType: QuestionType.RECALL,
      hashtags: ["#personal-productivity", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q2: Home organization importance (RECALL)
    {
      question: "According to the lesson, why is home organization important?",
      options: [
        "It's not important",
        "It reduces time waste, creates clarity, and enables focus on meaningful activities",
        "It only applies to large homes",
        "It requires no effort"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Home Organization",
      questionType: QuestionType.RECALL,
      hashtags: ["#home-organization", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q3: Personal projects management (RECALL)
    {
      question: "According to the lesson, how should personal projects be managed?",
      options: [
        "No structure needed",
        "With clear goals, timelines, and productivity systems similar to work projects",
        "Only when urgent",
        "Avoid all projects"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Personal Projects",
      questionType: QuestionType.RECALL,
      hashtags: ["#personal-projects", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q4: Why personal productivity matters (APPLICATION - Rewritten)
    {
      question: "Why is extending productivity to personal life important according to the lesson?",
      options: [
        "It eliminates all personal time",
        "It creates efficiency across all life areas, reduces time waste, enables personal project completion, and maintains work-life balance through organization",
        "It only applies to certain people",
        "It requires no planning"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Personal Productivity",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#personal-productivity", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q5: Home chaos scenario (APPLICATION - Keep)
    {
      question: "A person's home is disorganized, leading to wasted time searching for items and stress. According to the lesson, what is likely missing?",
      options: [
        "More items",
        "Home organization systems, clear storage, and productivity principles applied to personal space",
        "Less organization",
        "No structure needed"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Home Organization",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#home-organization", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q6: Building personal productivity system (APPLICATION - New)
    {
      question: "You want to improve productivity in your personal life. According to the lesson, what should you establish?",
      options: [
        "Just work harder",
        "Home organization systems, personal project management with goals and timelines, and productivity principles extended to all life areas",
        "Only organization",
        "Only project management"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Personal Productivity",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#personal-productivity", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q7: Personal productivity failure analysis (CRITICAL THINKING - New)
    {
      question: "A person is productive at work but personal projects never get completed and home life feels chaotic. According to the lesson's framework, what is the core issue?",
      options: [
        "Not enough work productivity",
        "Lack of personal life productivity - missing organization systems, personal project management, and productivity principles extended to all life areas",
        "Too much personal productivity",
        "Personal productivity is unnecessary"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Personal Productivity",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#personal-productivity", "#advanced", "#critical-thinking", "#en", "#all-languages"]
    }
  ],
  // Hungarian (HU) - Professional translations
  HU: [
    {
      question: "A lecke szerint mi a magánéleti termelékenység?",
      options: [
        "Csak munkafeladatok",
        "A termelékenységi elvek kiterjesztése az élet minden területére, beleértve az otthoni szervezést és a személyes projekteket",
        "Csak otthoni feladatok",
        "Nincs szükség szervezésre"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Magánéleti Termelékenység",
      questionType: QuestionType.RECALL,
      hashtags: ["#personal-productivity", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint miért fontos az otthoni szervezés?",
      options: [
        "Nem fontos",
        "Csökkenti az időpazarlást, egyértelműséget teremt, és lehetővé teszi a jelentős tevékenységekre való összpontosítást",
        "Csak nagy otthonokra vonatkozik",
        "Nem igényel erőfeszítést"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Otthoni Szervezés",
      questionType: QuestionType.RECALL,
      hashtags: ["#home-organization", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint hogyan kell kezelni a személyes projekteket?",
      options: [
        "Nincs szükség struktúrára",
        "Világos célokkal, időkeretekkel és termelékenységi rendszerekkel, hasonlóan a munkaprojektekhez",
        "Csak sürgős esetben",
        "Kerülni kell az összes projektet"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Személyes Projektek",
      questionType: QuestionType.RECALL,
      hashtags: ["#personal-projects", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "Miért fontos a termelékenység kiterjesztése a magánéletre a lecke szerint?",
      options: [
        "Kiküszöböli az összes személyes időt",
        "Hatékonyságot teremt az élet minden területén, csökkenti az időpazarlást, lehetővé teszi a személyes projektek befejezését, és fenntartja a munka-élet egyensúlyt a szervezésen keresztül",
        "Csak bizonyos emberekre vonatkozik",
        "Nem igényel tervezést"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Magánéleti Termelékenység",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#personal-productivity", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy személy otthona rendezetlen, ami időpazarláshoz vezet a tárgyak keresésében és stresszhez. A lecke szerint mi hiányzik valószínűleg?",
      options: [
        "Több tárgy",
        "Otthoni szervezési rendszerek, világos tárolás, és termelékenységi elvek alkalmazása a személyes térre",
        "Kevesebb szervezés",
        "Nincs szükség struktúrára"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Otthoni Szervezés",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#home-organization", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Javítani szeretnéd a termelékenységedet a magánéletedben. A lecke szerint mit kellene létrehozni?",
      options: [
        "Csak dolgozz keményebben",
        "Otthoni szervezési rendszerek, személyes projektmenedzsment célokkal és időkeretekkel, és termelékenységi elvek kiterjesztése az élet minden területére",
        "Csak szervezés",
        "Csak projektmenedzsment"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Magánéleti Termelékenység",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#personal-productivity", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy személy produktív a munkában, de a személyes projektek soha nem készülnek el, és az otthoni élet kaotikusnak tűnik. A lecke keretrendszere szerint mi a fő probléma?",
      options: [
        "Nincs elég munkatermelékenység",
        "Hiányzik a magánéleti termelékenység - hiányoznak a szervezési rendszerek, személyes projektmenedzsment, és termelékenységi elvek kiterjesztése az élet minden területére",
        "Túl sok magánéleti termelékenység",
        "A magánéleti termelékenység felesleges"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Magánéleti Termelékenység",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#personal-productivity", "#advanced", "#critical-thinking", "#hu", "#all-languages"]
    }
  ],
  // Turkish (TR) - Professional translations
  TR: [
    {
      question: "Derse göre kişisel yaşam verimliliği nedir?",
      options: [
        "Sadece iş görevleri",
        "Verimlilik ilkelerini ev organizasyonu ve kişisel projeler dahil olmak üzere yaşamın tüm alanlarına genişletmek",
        "Sadece ev görevleri",
        "Organizasyon gerekmez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Kişisel Verimlilik",
      questionType: QuestionType.RECALL,
      hashtags: ["#personal-productivity", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre ev organizasyonu neden önemlidir?",
      options: [
        "Önemli değil",
        "Zaman kaybını azaltır, netlik yaratır ve anlamlı aktivitelere odaklanmayı sağlar",
        "Sadece büyük evlere uygulanır",
        "Çaba gerektirmez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Ev Organizasyonu",
      questionType: QuestionType.RECALL,
      hashtags: ["#home-organization", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre kişisel projeler nasıl yönetilmelidir?",
      options: [
        "Yapı gerekmez",
        "İş projelerine benzer şekilde net hedefler, zaman çizelgeleri ve verimlilik sistemleri ile",
        "Sadece acil olduğunda",
        "Tüm projelerden kaçının"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Kişisel Projeler",
      questionType: QuestionType.RECALL,
      hashtags: ["#personal-projects", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre verimliliği kişisel yaşama genişletmek neden önemlidir?",
      options: [
        "Tüm kişisel zamanı ortadan kaldırır",
        "Yaşamın tüm alanlarında verimlilik yaratır, zaman kaybını azaltır, kişisel proje tamamlamayı sağlar ve organizasyon yoluyla iş-yaşam dengesini korur",
        "Sadece belirli kişilere uygulanır",
        "Planlama gerektirmez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Kişisel Verimlilik",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#personal-productivity", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir kişinin evi düzensiz, bu da eşyaları aramada zaman kaybına ve strese yol açıyor. Derse göre muhtemelen ne eksik?",
      options: [
        "Daha fazla eşya",
        "Ev organizasyon sistemleri, net depolama ve kişisel alana uygulanan verimlilik ilkeleri",
        "Daha az organizasyon",
        "Yapı gerekmez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Ev Organizasyonu",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#home-organization", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Kişisel yaşamınızdaki verimliliği artırmak istiyorsunuz. Derse göre ne kurmalısınız?",
      options: [
        "Sadece daha sıkı çalışın",
        "Ev organizasyon sistemleri, hedefler ve zaman çizelgeleri ile kişisel proje yönetimi ve tüm yaşam alanlarına genişletilmiş verimlilik ilkeleri",
        "Sadece organizasyon",
        "Sadece proje yönetimi"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Kişisel Verimlilik",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#personal-productivity", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir kişi işte verimli ama kişisel projeler hiç tamamlanmıyor ve ev yaşamı kaotik görünüyor. Dersin çerçevesine göre temel sorun nedir?",
      options: [
        "Yeterli iş verimliliği yok",
        "Kişisel yaşam verimliliği eksikliği - organizasyon sistemleri, kişisel proje yönetimi ve tüm yaşam alanlarına genişletilmiş verimlilik ilkeleri eksik",
        "Çok fazla kişisel verimlilik",
        "Kişisel verimlilik gereksiz"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Kişisel Verimlilik",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#personal-productivity", "#advanced", "#critical-thinking", "#tr", "#all-languages"]
    }
  ],
  // Bulgarian (BG) - Professional translations
  BG: [
    {
      question: "Според урока, какво е производителността на личния живот?",
      options: [
        "Само работни задачи",
        "Разширяване на принципите за производителност към всички области на живота, включително организация на дома и лични проекти",
        "Само домашни задачи",
        "Не е нужна организация"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Лична Производителност",
      questionType: QuestionType.RECALL,
      hashtags: ["#personal-productivity", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, защо организацията на дома е важна?",
      options: [
        "Не е важна",
        "Намалява загубата на време, създава яснота и позволява фокус върху значими дейности",
        "Прилага се само за големи домове",
        "Не изисква усилие"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Организация на Дома",
      questionType: QuestionType.RECALL,
      hashtags: ["#home-organization", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, как трябва да се управляват личните проекти?",
      options: [
        "Не е нужна структура",
        "С ясни цели, времеви графи и системи за производителност, подобни на работните проекти",
        "Само когато са спешни",
        "Избягване на всички проекти"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Лични Проекти",
      questionType: QuestionType.RECALL,
      hashtags: ["#personal-projects", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Защо разширяването на производителността към личния живот е важно според урока?",
      options: [
        "Елиминира цялото лично време",
        "Създава ефективност във всички области на живота, намалява загубата на време, позволява завършване на лични проекти и поддържа баланс работа-живот чрез организация",
        "Прилага се само за определени хора",
        "Не изисква планиране"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Лична Производителност",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#personal-productivity", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Домът на човек е неорганизиран, водещ до загуба на време при търсене на предмети и стрес. Според урока, какво вероятно липсва?",
      options: [
        "Повече предмети",
        "Системи за организация на дома, ясно съхранение и принципи за производителност, приложени към личното пространство",
        "По-малко организация",
        "Не е нужна структура"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Организация на Дома",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#home-organization", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Искате да подобрите производителността в личния си живот. Според урока, какво трябва да установите?",
      options: [
        "Просто работете по-усърдно",
        "Системи за организация на дома, управление на лични проекти с цели и времеви графи, и принципи за производителност, разширени към всички области на живота",
        "Само организация",
        "Само управление на проекти"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Лична Производителност",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#personal-productivity", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Човек е продуктивен в работата, но личните проекти никога не се завършват и домашният живот изглежда хаотичен. Според рамката на урока, какъв е основният проблем?",
      options: [
        "Няма достатъчно работна производителност",
        "Липса на производителност на личния живот - липсват системи за организация, управление на лични проекти и принципи за производителност, разширени към всички области на живота",
        "Твърде много лична производителност",
        "Производителността на личния живот е ненужна"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Лична Производителност",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#personal-productivity", "#advanced", "#critical-thinking", "#bg", "#all-languages"]
    }
  ],
  // Polish (PL) - Professional translations
  PL: [
    {
      question: "Według lekcji, czym jest produktywność życia osobistego?",
      options: [
        "Tylko zadania zawodowe",
        "Rozszerzanie zasad produktywności na wszystkie obszary życia, w tym organizację domu i projekty osobiste",
        "Tylko zadania domowe",
        "Organizacja nie jest potrzebna"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Produktywność Osobista",
      questionType: QuestionType.RECALL,
      hashtags: ["#personal-productivity", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, dlaczego organizacja domu jest ważna?",
      options: [
        "Nie jest ważna",
        "Zmniejsza marnowanie czasu, tworzy jasność i umożliwia skupienie na znaczących aktywnościach",
        "Dotyczy tylko dużych domów",
        "Nie wymaga wysiłku"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Organizacja Domu",
      questionType: QuestionType.RECALL,
      hashtags: ["#home-organization", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, jak powinny być zarządzane projekty osobiste?",
      options: [
        "Struktura nie jest potrzebna",
        "Z jasnymi celami, harmonogramami i systemami produktywności podobnymi do projektów zawodowych",
        "Tylko gdy są pilne",
        "Unikać wszystkich projektów"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Projekty Osobiste",
      questionType: QuestionType.RECALL,
      hashtags: ["#personal-projects", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Dlaczego rozszerzanie produktywności na życie osobiste jest ważne według lekcji?",
      options: [
        "Eliminuje cały czas osobisty",
        "Tworzy efektywność we wszystkich obszarach życia, zmniejsza marnowanie czasu, umożliwia ukończenie projektów osobistych i utrzymuje równowagę praca-życie poprzez organizację",
        "Dotyczy tylko niektórych ludzi",
        "Nie wymaga planowania"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Produktywność Osobista",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#personal-productivity", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Dom osoby jest nieuporządkowany, prowadząc do marnowania czasu na szukanie przedmiotów i stresu. Według lekcji, czego prawdopodobnie brakuje?",
      options: [
        "Więcej przedmiotów",
        "Systemy organizacji domu, jasne przechowywanie i zasady produktywności zastosowane do przestrzeni osobistej",
        "Mniej organizacji",
        "Struktura nie jest potrzebna"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Organizacja Domu",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#home-organization", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Chcesz poprawić produktywność w swoim życiu osobistym. Według lekcji, co powinieneś ustanowić?",
      options: [
        "Po prostu pracuj ciężej",
        "Systemy organizacji domu, zarządzanie projektami osobistymi z celami i harmonogramami, oraz zasady produktywności rozszerzone na wszystkie obszary życia",
        "Tylko organizacja",
        "Tylko zarządzanie projektami"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Produktywność Osobista",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#personal-productivity", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Osoba jest produktywna w pracy, ale projekty osobiste nigdy nie są ukończone, a życie domowe wydaje się chaotyczne. Według ram lekcji, jaki jest główny problem?",
      options: [
        "Niewystarczająca produktywność w pracy",
        "Brak produktywności życia osobistego - brakuje systemów organizacji, zarządzania projektami osobistymi i zasad produktywności rozszerzonych na wszystkie obszary życia",
        "Zbyt dużo produktywności osobistej",
        "Produktywność osobista jest niepotrzebna"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Produktywność Osobista",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#personal-productivity", "#advanced", "#critical-thinking", "#pl", "#all-languages"]
    }
  ],
  // Vietnamese (VI) - Professional translations
  VI: [
    {
      question: "Theo bài học, năng suất cuộc sống cá nhân là gì?",
      options: [
        "Chỉ công việc",
        "Mở rộng nguyên tắc năng suất đến tất cả các lĩnh vực của cuộc sống, bao gồm tổ chức nhà và dự án cá nhân",
        "Chỉ công việc nhà",
        "Không cần tổ chức"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Năng Suất Cá Nhân",
      questionType: QuestionType.RECALL,
      hashtags: ["#personal-productivity", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, tại sao tổ chức nhà quan trọng?",
      options: [
        "Nó không quan trọng",
        "Nó giảm lãng phí thời gian, tạo sự rõ ràng, và cho phép tập trung vào các hoạt động có ý nghĩa",
        "Nó chỉ áp dụng cho nhà lớn",
        "Nó không yêu cầu nỗ lực"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Tổ Chức Nhà",
      questionType: QuestionType.RECALL,
      hashtags: ["#home-organization", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, dự án cá nhân nên được quản lý như thế nào?",
      options: [
        "Không cần cấu trúc",
        "Với mục tiêu rõ ràng, thời gian biểu, và hệ thống năng suất tương tự như dự án công việc",
        "Chỉ khi khẩn cấp",
        "Tránh tất cả dự án"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Dự Án Cá Nhân",
      questionType: QuestionType.RECALL,
      hashtags: ["#personal-projects", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Tại sao mở rộng năng suất đến cuộc sống cá nhân quan trọng theo bài học?",
      options: [
        "Nó loại bỏ tất cả thời gian cá nhân",
        "Nó tạo hiệu quả trên tất cả các lĩnh vực của cuộc sống, giảm lãng phí thời gian, cho phép hoàn thành dự án cá nhân, và duy trì cân bằng công việc-cuộc sống thông qua tổ chức",
        "Nó chỉ áp dụng cho một số người",
        "Nó không yêu cầu lập kế hoạch"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Năng Suất Cá Nhân",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#personal-productivity", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Nhà của một người không có tổ chức, dẫn đến lãng phí thời gian tìm kiếm đồ vật và căng thẳng. Theo bài học, điều gì có thể đang thiếu?",
      options: [
        "Nhiều đồ vật hơn",
        "Hệ thống tổ chức nhà, lưu trữ rõ ràng, và nguyên tắc năng suất áp dụng cho không gian cá nhân",
        "Ít tổ chức hơn",
        "Không cần cấu trúc"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Tổ Chức Nhà",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#home-organization", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Bạn muốn cải thiện năng suất trong cuộc sống cá nhân của mình. Theo bài học, bạn nên thiết lập gì?",
      options: [
        "Chỉ làm việc chăm chỉ hơn",
        "Hệ thống tổ chức nhà, quản lý dự án cá nhân với mục tiêu và thời gian biểu, và nguyên tắc năng suất mở rộng đến tất cả các lĩnh vực của cuộc sống",
        "Chỉ tổ chức",
        "Chỉ quản lý dự án"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Năng Suất Cá Nhân",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#personal-productivity", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Một người năng suất trong công việc nhưng dự án cá nhân không bao giờ hoàn thành và cuộc sống nhà có vẻ hỗn loạn. Theo khung của bài học, vấn đề cốt lõi là gì?",
      options: [
        "Không đủ năng suất công việc",
        "Thiếu năng suất cuộc sống cá nhân - thiếu hệ thống tổ chức, quản lý dự án cá nhân, và nguyên tắc năng suất mở rộng đến tất cả các lĩnh vực của cuộc sống",
        "Quá nhiều năng suất cá nhân",
        "Năng suất cá nhân là không cần thiết"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Năng Suất Cá Nhân",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#personal-productivity", "#advanced", "#critical-thinking", "#vi", "#all-languages"]
    }
  ],
  // Indonesian (ID) - Professional translations
  ID: [
    {
      question: "Menurut pelajaran, apa itu produktivitas kehidupan pribadi?",
      options: [
        "Hanya tugas kerja",
        "Memperluas prinsip produktivitas ke semua area kehidupan, termasuk organisasi rumah dan proyek pribadi",
        "Hanya tugas rumah",
        "Tidak perlu organisasi"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Produktivitas Pribadi",
      questionType: QuestionType.RECALL,
      hashtags: ["#personal-productivity", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, mengapa organisasi rumah penting?",
      options: [
        "Tidak penting",
        "Mengurangi pemborosan waktu, menciptakan kejelasan, dan memungkinkan fokus pada aktivitas yang bermakna",
        "Hanya berlaku untuk rumah besar",
        "Tidak memerlukan upaya"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Organisasi Rumah",
      questionType: QuestionType.RECALL,
      hashtags: ["#home-organization", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, bagaimana proyek pribadi harus dikelola?",
      options: [
        "Tidak perlu struktur",
        "Dengan tujuan yang jelas, timeline, dan sistem produktivitas mirip dengan proyek kerja",
        "Hanya saat mendesak",
        "Hindari semua proyek"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Proyek Pribadi",
      questionType: QuestionType.RECALL,
      hashtags: ["#personal-projects", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Mengapa memperluas produktivitas ke kehidupan pribadi penting menurut pelajaran?",
      options: [
        "Ini menghilangkan semua waktu pribadi",
        "Ini menciptakan efisiensi di semua area kehidupan, mengurangi pemborosan waktu, memungkinkan penyelesaian proyek pribadi, dan mempertahankan keseimbangan kerja-kehidupan melalui organisasi",
        "Ini hanya berlaku untuk orang tertentu",
        "Ini tidak memerlukan perencanaan"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Produktivitas Pribadi",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#personal-productivity", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Rumah seseorang tidak terorganisir, menyebabkan pemborosan waktu mencari barang dan stres. Menurut pelajaran, apa yang mungkin kurang?",
      options: [
        "Lebih banyak barang",
        "Sistem organisasi rumah, penyimpanan yang jelas, dan prinsip produktivitas diterapkan pada ruang pribadi",
        "Lebih sedikit organisasi",
        "Tidak perlu struktur"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Organisasi Rumah",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#home-organization", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Anda ingin meningkatkan produktivitas dalam kehidupan pribadi Anda. Menurut pelajaran, apa yang harus Anda tetapkan?",
      options: [
        "Hanya bekerja lebih keras",
        "Sistem organisasi rumah, manajemen proyek pribadi dengan tujuan dan timeline, dan prinsip produktivitas diperluas ke semua area kehidupan",
        "Hanya organisasi",
        "Hanya manajemen proyek"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Produktivitas Pribadi",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#personal-productivity", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Seseorang produktif di tempat kerja tetapi proyek pribadi tidak pernah selesai dan kehidupan rumah tampak kacau. Menurut kerangka pelajaran, apa masalah intinya?",
      options: [
        "Tidak cukup produktivitas kerja",
        "Kurangnya produktivitas kehidupan pribadi - kurang sistem organisasi, manajemen proyek pribadi, dan prinsip produktivitas diperluas ke semua area kehidupan",
        "Terlalu banyak produktivitas pribadi",
        "Produktivitas pribadi tidak perlu"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Produktivitas Pribadi",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#personal-productivity", "#advanced", "#critical-thinking", "#id", "#all-languages"]
    }
  ],
  // Arabic (AR) - Professional translations (RTL)
  AR: [
    {
      question: "وفقًا للدرس، ما هي إنتاجية الحياة الشخصية?",
      options: [
        "فقط مهام العمل",
        "توسيع مبادئ الإنتاجية إلى جميع مجالات الحياة، بما في ذلك تنظيم المنزل والمشاريع الشخصية",
        "فقط المهام المنزلية",
        "لا حاجة للتنظيم"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "الإنتاجية الشخصية",
      questionType: QuestionType.RECALL,
      hashtags: ["#personal-productivity", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، لماذا تنظيم المنزل مهم?",
      options: [
        "ليس مهمًا",
        "يقلل إهدار الوقت، يخلق الوضوح، ويمكن من التركيز على الأنشطة ذات المعنى",
        "ينطبق فقط على المنازل الكبيرة",
        "لا يتطلب جهد"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "تنظيم المنزل",
      questionType: QuestionType.RECALL,
      hashtags: ["#home-organization", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، كيف يجب إدارة المشاريع الشخصية?",
      options: [
        "لا حاجة للهيكل",
        "مع أهداف واضحة، الجداول الزمنية، وأنظمة الإنتاجية مشابهة لمشاريع العمل",
        "فقط عند الضرورة",
        "تجنب جميع المشاريع"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "المشاريع الشخصية",
      questionType: QuestionType.RECALL,
      hashtags: ["#personal-projects", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "لماذا توسيع الإنتاجية إلى الحياة الشخصية مهم وفقًا للدرس?",
      options: [
        "إنه يلغي كل الوقت الشخصي",
        "إنه يخلق الكفاءة في جميع مجالات الحياة، يقلل إهدار الوقت، يمكّن من إكمال المشاريع الشخصية، ويحافظ على التوازن بين العمل والحياة من خلال التنظيم",
        "ينطبق فقط على أشخاص معينين",
        "لا يتطلب تخطيطًا"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "الإنتاجية الشخصية",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#personal-productivity", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "منزل شخص غير منظم، مما يؤدي إلى إهدار الوقت في البحث عن العناصر والإجهاد. وفقًا للدرس، ما الذي ربما كان مفقودًا?",
      options: [
        "المزيد من العناصر",
        "أنظمة تنظيم المنزل، التخزين الواضح، ومبادئ الإنتاجية المطبقة على المساحة الشخصية",
        "أقل تنظيمًا",
        "لا حاجة للهيكل"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "تنظيم المنزل",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#home-organization", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "تريد تحسين الإنتاجية في حياتك الشخصية. وفقًا للدرس، ماذا يجب أن تنشئ?",
      options: [
        "فقط اعمل بجدية أكبر",
        "أنظمة تنظيم المنزل، إدارة المشاريع الشخصية مع الأهداف والجداول الزمنية، ومبادئ الإنتاجية الموسعة إلى جميع مجالات الحياة",
        "فقط التنظيم",
        "فقط إدارة المشاريع"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "الإنتاجية الشخصية",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#personal-productivity", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "شخص منتج في العمل لكن المشاريع الشخصية لا تكتمل أبدًا والحياة المنزلية تبدو فوضوية. وفقًا لإطار الدرس، ما هي المشكلة الأساسية?",
      options: [
        "لا يوجد إنتاجية عمل كافية",
        "نقص إنتاجية الحياة الشخصية - نقص أنظمة التنظيم، إدارة المشاريع الشخصية، ومبادئ الإنتاجية الموسعة إلى جميع مجالات الحياة",
        "الكثير من الإنتاجية الشخصية",
        "الإنتاجية الشخصية غير ضرورية"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "الإنتاجية الشخصية",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#personal-productivity", "#advanced", "#critical-thinking", "#ar", "#all-languages"]
    }
  ],
  // Portuguese (PT) - Professional translations (Brazilian)
  PT: [
    {
      question: "De acordo com a lição, o que é produtividade da vida pessoal?",
      options: [
        "Apenas tarefas de trabalho",
        "Estender princípios de produtividade para todas as áreas da vida, incluindo organização do lar e projetos pessoais",
        "Apenas tarefas domésticas",
        "Organização não é necessária"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Produtividade Pessoal",
      questionType: QuestionType.RECALL,
      hashtags: ["#personal-productivity", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, por que a organização do lar é importante?",
      options: [
        "Não é importante",
        "Reduz desperdício de tempo, cria clareza e permite foco em atividades significativas",
        "Aplica-se apenas a casas grandes",
        "Não requer esforço"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Organização do Lar",
      questionType: QuestionType.RECALL,
      hashtags: ["#home-organization", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, como os projetos pessoais devem ser gerenciados?",
      options: [
        "Estrutura não é necessária",
        "Com objetivos claros, cronogramas e sistemas de produtividade semelhantes a projetos de trabalho",
        "Apenas quando urgentes",
        "Evitar todos os projetos"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Projetos Pessoais",
      questionType: QuestionType.RECALL,
      hashtags: ["#personal-projects", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "Por que estender produtividade para a vida pessoal é importante de acordo com a lição?",
      options: [
        "Elimina todo o tempo pessoal",
        "Cria eficiência em todas as áreas da vida, reduz desperdício de tempo, permite conclusão de projetos pessoais e mantém equilíbrio trabalho-vida através da organização",
        "Aplica-se apenas a certas pessoas",
        "Não requer planejamento"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Produtividade Pessoal",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#personal-productivity", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "A casa de uma pessoa está desorganizada, levando a desperdício de tempo procurando itens e estresse. De acordo com a lição, o que provavelmente está faltando?",
      options: [
        "Mais itens",
        "Sistemas de organização do lar, armazenamento claro e princípios de produtividade aplicados ao espaço pessoal",
        "Menos organização",
        "Estrutura não é necessária"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Organização do Lar",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#home-organization", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Você quer melhorar a produtividade em sua vida pessoal. De acordo com a lição, o que você deve estabelecer?",
      options: [
        "Apenas trabalhe mais",
        "Sistemas de organização do lar, gerenciamento de projetos pessoais com objetivos e cronogramas, e princípios de produtividade estendidos para todas as áreas da vida",
        "Apenas organização",
        "Apenas gerenciamento de projetos"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Produtividade Pessoal",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#personal-productivity", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Uma pessoa é produtiva no trabalho, mas projetos pessoais nunca são concluídos e a vida doméstica parece caótica. De acordo com a estrutura da lição, qual é o problema central?",
      options: [
        "Não há produtividade no trabalho suficiente",
        "Falta de produtividade da vida pessoal - faltam sistemas de organização, gerenciamento de projetos pessoais e princípios de produtividade estendidos para todas as áreas da vida",
        "Muita produtividade pessoal",
        "Produtividade pessoal é desnecessária"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Produtividade Pessoal",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#personal-productivity", "#advanced", "#critical-thinking", "#pt", "#all-languages"]
    }
  ],
  // Hindi (HI) - Professional translations
  HI: [
    {
      question: "पाठ के अनुसार, व्यक्तिगत जीवन उत्पादकता क्या है?",
      options: [
        "केवल काम के कार्य",
        "घर संगठन और व्यक्तिगत परियोजनाओं सहित जीवन के सभी क्षेत्रों में उत्पादकता सिद्धांतों का विस्तार",
        "केवल घरेलू कार्य",
        "संगठन की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "व्यक्तिगत उत्पादकता",
      questionType: QuestionType.RECALL,
      hashtags: ["#personal-productivity", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, घर संगठन क्यों महत्वपूर्ण है?",
      options: [
        "यह महत्वपूर्ण नहीं है",
        "यह समय की बर्बादी कम करता है, स्पष्टता बनाता है, और सार्थक गतिविधियों पर ध्यान केंद्रित करने में सक्षम बनाता है",
        "यह केवल बड़े घरों पर लागू होता है",
        "इसके लिए प्रयास की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "घर संगठन",
      questionType: QuestionType.RECALL,
      hashtags: ["#home-organization", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, व्यक्तिगत परियोजनाओं का प्रबंधन कैसे किया जाना चाहिए?",
      options: [
        "संरचना की आवश्यकता नहीं है",
        "स्पष्ट लक्ष्यों, समयसीमा, और काम की परियोजनाओं के समान उत्पादकता प्रणालियों के साथ",
        "केवल जब जरूरी हो",
        "सभी परियोजनाओं से बचें"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "व्यक्तिगत परियोजनाएं",
      questionType: QuestionType.RECALL,
      hashtags: ["#personal-projects", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार व्यक्तिगत जीवन में उत्पादकता का विस्तार क्यों महत्वपूर्ण है?",
      options: [
        "यह सभी व्यक्तिगत समय को समाप्त करता है",
        "यह जीवन के सभी क्षेत्रों में दक्षता बनाता है, समय की बर्बादी कम करता है, व्यक्तिगत परियोजना पूर्णता सक्षम करता है, और संगठन के माध्यम से कार्य-जीवन संतुलन बनाए रखता है",
        "यह केवल कुछ लोगों पर लागू होता है",
        "इसके लिए योजना की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "व्यक्तिगत उत्पादकता",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#personal-productivity", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक व्यक्ति का घर अव्यवस्थित है, जिससे वस्तुओं की खोज में समय की बर्बादी और तनाव होता है। पाठ के अनुसार, क्या संभवतः गायब है?",
      options: [
        "अधिक वस्तुएं",
        "घर संगठन प्रणालियां, स्पष्ट भंडारण, और व्यक्तिगत स्थान पर लागू उत्पादकता सिद्धांत",
        "कम संगठन",
        "संरचना की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "घर संगठन",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#home-organization", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "आप अपने व्यक्तिगत जीवन में उत्पादकता में सुधार करना चाहते हैं। पाठ के अनुसार, आपको क्या स्थापित करना चाहिए?",
      options: [
        "बस कठिन काम करें",
        "घर संगठन प्रणालियां, लक्ष्यों और समयसीमा के साथ व्यक्तिगत परियोजना प्रबंधन, और जीवन के सभी क्षेत्रों में विस्तारित उत्पादकता सिद्धांत",
        "केवल संगठन",
        "केवल परियोजना प्रबंधन"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "व्यक्तिगत उत्पादकता",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#personal-productivity", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक व्यक्ति काम में उत्पादक है लेकिन व्यक्तिगत परियोजनाएं कभी पूरी नहीं होतीं और घरेलू जीवन अव्यवस्थित लगता है। पाठ के ढांचे के अनुसार, मुख्य समस्या क्या है?",
      options: [
        "पर्याप्त काम की उत्पादकता नहीं है",
        "व्यक्तिगत जीवन उत्पादकता की कमी - संगठन प्रणालियां, व्यक्तिगत परियोजना प्रबंधन, और जीवन के सभी क्षेत्रों में विस्तारित उत्पादकता सिद्धांत गायब हैं",
        "बहुत अधिक व्यक्तिगत उत्पादकता",
        "व्यक्तिगत उत्पादकता अनावश्यक है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "व्यक्तिगत उत्पादकता",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#personal-productivity", "#advanced", "#critical-thinking", "#hi", "#all-languages"]
    }
  ]
};

async function seedDay20Enhanced() {
  try {
    await connectDB();
    console.log('🌱 SEEDING DAY 20 ENHANCED QUIZ QUESTIONS\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    let totalQuestions = 0;
    let totalUpdated = 0;
    let totalCreated = 0;

    for (const lang of LANGUAGES) {
      const courseId = `${COURSE_ID_BASE}_${lang}`;
      const lessonId = `${COURSE_ID_BASE}_${lang}_DAY_20`;

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
      const questions = DAY20_QUESTIONS[lang];
      
      if (!questions || questions.length === 0) {
        console.error(`   ❌ ERROR: No questions defined for ${lang}! Questions MUST be in course language.`);
        throw new Error(`Missing translations for ${lang} - Day 20 questions must be in course language, not English fallback`);
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
    console.log(`\n✅ DAY 20 ENHANCEMENT COMPLETE!\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedDay20Enhanced();
