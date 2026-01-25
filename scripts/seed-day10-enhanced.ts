/**
 * Seed Day 10 Enhanced Quiz Questions
 * 
 * Purpose: Enhance Day 10 quizzes from 5 to 7 questions across all 10 languages
 * Why: Part of Quiz Quality Enhancement - Phase 1, Day 10
 * 
 * Lesson Topic: Energy Management (when to work, when to rest, recovery rituals)
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
const DAY_NUMBER = 10;
const LANGUAGES = ['HU', 'EN', 'TR', 'BG', 'PL', 'VI', 'ID', 'AR', 'PT', 'HI'];

/**
 * Day 10 Enhanced Questions - All Languages
 * Topic: Energy Management
 * Structure: 7 questions per language
 * Q1-Q3: Keep (Recall - foundational concepts)
 * Q4: Rewritten (Application - from definition to purpose)
 * Q5: Keep (Application - scenario-based)
 * Q6: New (Application - practical implementation)
 * Q7: New (Critical Thinking - systems integration)
 */
const DAY10_QUESTIONS: Record<string, Array<{
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: QuestionDifficulty;
  category: string;
  questionType: QuestionType;
  hashtags: string[];
}>> = {
  EN: [
    // Q1: Ultradian rhythm (RECALL - Keep)
    {
      question: "According to the lesson, what is the ultradian rhythm?",
      options: [
        "Daily sleep-wake cycle",
        "Brain supports ~90 minutes of focus, then needs 20-30 min recovery",
        "Weekly energy pattern",
        "Monthly productivity cycle"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Energy Management",
      questionType: QuestionType.RECALL,
      hashtags: ["#energy-management", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q2: Peak hours identification (RECALL - Keep)
    {
      question: "According to the lesson, how should you identify your peak energy hours?",
      options: [
        "Ask your manager",
        "Journal for one week: energy level by hour (1-10 scale), identify 3-4 time blocks with highest energy",
        "Work the same hours every day",
        "Follow your team's schedule"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Energy Management",
      questionType: QuestionType.RECALL,
      hashtags: ["#energy-management", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q3: Recovery rituals (RECALL - Keep)
    {
      question: "According to the lesson, what is a micro-break ritual?",
      options: [
        "20-30 minute break",
        "5 minute break: walk, breathe, drink water",
        "Full day off",
        "Weekend recovery"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Energy Management",
      questionType: QuestionType.RECALL,
      hashtags: ["#energy-management", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q4: Why energy management matters (APPLICATION - Rewritten from definition)
    {
      question: "Why is conscious energy management important according to the lesson?",
      options: [
        "It allows you to work longer hours",
        "Working during peak hours = 3x more output than low-energy times, prevents burnout, improves creativity and decision-making",
        "It eliminates the need for breaks",
        "It only applies to morning people"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Energy Management",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#energy-management", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q5: Peak hours application (APPLICATION - Keep)
    {
      question: "According to the lesson, what should you schedule during peak energy hours?",
      options: [
        "Routine tasks and meetings",
        "Deep work - your most important, creative work",
        "Email and administration",
        "Lunch and breaks"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Energy Management",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#energy-management", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q6: Implementing recovery rituals (APPLICATION - New)
    {
      question: "A person works continuously from 9am to 6pm with no breaks, experiences afternoon fatigue, and struggles with evening work. According to the lesson, what should they do?",
      options: [
        "Work harder to push through",
        "Implement micro-breaks (5 min) and macro-breaks (20-30 min), schedule them throughout the day",
        "Skip lunch to save time",
        "Work longer hours to compensate"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Energy Management",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#energy-management", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q7: Energy management system (CRITICAL THINKING - New)
    {
      question: "A manager has identified peak hours (9-11am, 2-4pm) but still schedules meetings during these times and does deep work in low-energy periods. According to the lesson's framework, what does this indicate?",
      options: [
        "Optimal energy management",
        "Ineffective energy management - peak hours should be protected for deep work, meetings should be scheduled during low-energy periods",
        "Energy patterns don't matter",
        "Meetings are more important than deep work"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Energy Management",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#energy-management", "#advanced", "#critical-thinking", "#en", "#all-languages"]
    }
  ],
  // Hungarian translations
  HU: [
    {
      question: "A lecke szerint mi az ultradian ritmus?",
      options: [
        "Napi alvás-ébrenlét ciklus",
        "Az agy körülbelül 90 perces fókuszt támogat, majd 20-30 perces pihenésre van szüksége",
        "Heti energia minta",
        "Havi produktivitás ciklus"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Energy Management",
      questionType: QuestionType.RECALL,
      hashtags: ["#energy-management", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint hogyan azonosítod a csúcsenergia óráidat?",
      options: [
        "Kérdezd meg a menedzsert",
        "Naplózz egy héten: energiaszint óránként (1-10 skála), azonosíts 3-4 időszakot a legmagasabb energiával",
        "Dolgozz ugyanazokban az órákban minden nap",
        "Kövesd a csapat ütemezését"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Energy Management",
      questionType: QuestionType.RECALL,
      hashtags: ["#energy-management", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint mi a mikropihenő ritual?",
      options: [
        "20-30 perces szünet",
        "5 perces szünet: sétálás, légzés, víz ivás",
        "Teljes nap szabadság",
        "Hétvégi helyreállítás"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Energy Management",
      questionType: QuestionType.RECALL,
      hashtags: ["#energy-management", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "Miért fontos a tudatos energia menedzselés a lecke szerint?",
      options: [
        "Lehetővé teszi, hogy hosszabb ideig dolgozz",
        "Csúcsidőben dolgozva = 3x több teljesítmény, mint alacsony energiájú időszakokban, megelőzi a kiégést, javítja a kreativitást és döntéshozatalt",
        "Kiküszöböli a szünetek szükségességét",
        "Csak reggeli emberekre vonatkozik"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Energy Management",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#energy-management", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint mit kell ütemezni a csúcsenergia órákban?",
      options: [
        "Rutinfeladatok és megbeszélések",
        "Mély munka - a legfontosabb, legkreatívabb munkád",
        "Email és adminisztráció",
        "Ebéd és szünetek"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Energy Management",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#energy-management", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy személy folyamatosan dolgozik 9-től 18-ig szünet nélkül, délutáni fáradtságot tapasztal, és esti munkával küzd. A lecke szerint mit kellene tennie?",
      options: [
        "Keményebben dolgozni, hogy átküzdje magát",
        "Mikropihenőket (5 perc) és makropihenőket (20-30 perc) bevezetni, napközben ütemezni őket",
        "Kihagyni az ebédet, hogy időt spóroljon",
        "Hosszabb ideig dolgozni kompenzációként"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Energy Management",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#energy-management", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy menedzser azonosította a csúcsidőket (9-11, 14-16), de még mindig megbeszéléseket ütemez ezekre az időpontokra, és mély munkát végez alacsony energiájú időszakokban. A lecke keretrendszere szerint mit jelez ez?",
      options: [
        "Optimal energia menedzselés",
        "Ineffektív energia menedzselés - a csúcsidőket védni kell a mély munkához, a megbeszéléseket alacsony energiájú időszakokban kell ütemezni",
        "Az energia minták nem számítanak",
        "A megbeszélések fontosabbak, mint a mély munka"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Energy Management",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#energy-management", "#advanced", "#critical-thinking", "#hu", "#all-languages"]
    }
  ],
  // Turkish (TR) - Professional translations
  TR: [
    {
      question: "Derse göre ultradian ritim nedir?",
      options: [
        "Günlük uyku-uyanıklık döngüsü",
        "Beyin yaklaşık 90 dakika odak destekler, sonra 20-30 dakika toparlanmaya ihtiyaç duyar",
        "Haftalık enerji modeli",
        "Aylık verimlilik döngüsü"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Energy Management",
      questionType: QuestionType.RECALL,
      hashtags: ["#energy-management", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre zirve enerji saatlerinizi nasıl belirlersiniz?",
      options: [
        "Yöneticinize sorun",
        "Bir hafta boyunca günlük tutun: saat başına enerji seviyesi (1-10 ölçeği), en yüksek enerjiye sahip 3-4 zaman bloğunu belirleyin",
        "Her gün aynı saatlerde çalışın",
        "Takımınızın programını takip edin"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Energy Management",
      questionType: QuestionType.RECALL,
      hashtags: ["#energy-management", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre mikro mola ritüeli nedir?",
      options: [
        "20-30 dakikalık mola",
        "5 dakikalık mola: yürüyüş, nefes alma, su içme",
        "Tam gün izin",
        "Hafta sonu toparlanma"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Energy Management",
      questionType: QuestionType.RECALL,
      hashtags: ["#energy-management", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre bilinçli enerji yönetimi neden önemlidir?",
      options: [
        "Daha uzun saatler çalışmanıza olanak tanır",
        "Zirve saatlerde çalışma = düşük enerjili zamanlardan 3x daha fazla çıktı, tükenmişliği önler, yaratıcılığı ve karar vermeyi iyileştirir",
        "Molaların gerekliliğini ortadan kaldırır",
        "Sadece sabah insanlarına uygulanır"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Energy Management",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#energy-management", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre zirve enerji saatlerinde ne planlamalısınız?",
      options: [
        "Rutin görevler ve toplantılar",
        "Derin çalışma - en önemli, yaratıcı işiniz",
        "E-posta ve idari işler",
        "Öğle yemeği ve molalar"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Energy Management",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#energy-management", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir kişi 09:00-18:00 arası mola vermeden sürekli çalışıyor, öğleden sonra yorgunluk yaşıyor ve akşam işiyle mücadele ediyor. Derse göre ne yapmalı?",
      options: [
        "Daha sert çalışarak zorlamak",
        "Mikro molaları (5 dk) ve makro molaları (20-30 dk) uygulamak, gün boyunca planlamak",
        "Zaman kazanmak için öğle yemeğini atlamak",
        "Telafi etmek için daha uzun saatler çalışmak"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Energy Management",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#energy-management", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir yönetici zirve saatleri belirlemiş (09-11, 14-16) ancak yine de bu saatlerde toplantılar planlıyor ve düşük enerjili dönemlerde derin çalışma yapıyor. Dersin çerçevesine göre bu neyi gösterir?",
      options: [
        "Optimal enerji yönetimi",
        "Etkisiz enerji yönetimi - zirve saatler derin çalışma için korunmalı, toplantılar düşük enerjili dönemlerde planlanmalı",
        "Enerji modelleri önemli değil",
        "Toplantılar derin çalışmadan daha önemli"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Energy Management",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#energy-management", "#advanced", "#critical-thinking", "#tr", "#all-languages"]
    }
  ],
  // Bulgarian (BG) - Professional translations
  BG: [
    {
      question: "Според урока, какво е ултрадианният ритъм?",
      options: [
        "Дневен цикъл на сън-будност",
        "Мозъкът поддържа ~90 минути фокус, след това се нуждае от 20-30 мин възстановяване",
        "Седмичен енергиен модел",
        "Месечен цикъл на продуктивност"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Energy Management",
      questionType: QuestionType.RECALL,
      hashtags: ["#energy-management", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, как да идентифицирате вашите пикови енергийни часове?",
      options: [
        "Попитайте вашия мениджър",
        "Дневник за една седмица: енергийно ниво по час (скала 1-10), идентифицирайте 3-4 времеви блока с най-висока енергия",
        "Работете същите часове всеки ден",
        "Следвайте графика на вашия екип"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Energy Management",
      questionType: QuestionType.RECALL,
      hashtags: ["#energy-management", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, какво е ритуал за микро почивка?",
      options: [
        "20-30 минутна почивка",
        "5 минутна почивка: разходка, дишане, пиене на вода",
        "Пълен ден свободен",
        "Седмично възстановяване"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Energy Management",
      questionType: QuestionType.RECALL,
      hashtags: ["#energy-management", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Защо съзнателното управление на енергията е важно според урока?",
      options: [
        "Позволява ви да работите по-дълги часове",
        "Работа по време на пикови часове = 3x повече продукция от времена с ниска енергия, предотвратява изгаряне, подобрява креативността и вземането на решения",
        "Елиминира необходимостта от почивки",
        "Прилага се само за сутрешни хора"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Energy Management",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#energy-management", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, какво трябва да планирате по време на пиковите енергийни часове?",
      options: [
        "Рутинни задачи и срещи",
        "Дълбока работа - вашата най-важна, креативна работа",
        "Имейл и администрация",
        "Обяд и почивки"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Energy Management",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#energy-management", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Човек работи непрекъснато от 9:00 до 18:00 без почивки, изпитва следобедна умора и се бори с вечерна работа. Според урока, какво трябва да направи?",
      options: [
        "Работи по-усърдно, за да премине",
        "Прилага микро почивки (5 мин) и макро почивки (20-30 мин), планира ги през деня",
        "Пропуска обяд, за да спести време",
        "Работи по-дълги часове за компенсация"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Energy Management",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#energy-management", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Мениджър е идентифицирал пикови часове (9-11, 14-16), но все още планира срещи по това време и прави дълбока работа в периоди с ниска енергия. Според рамката на урока, какво показва това?",
      options: [
        "Оптимално управление на енергията",
        "Неефективно управление на енергията - пиковите часове трябва да бъдат защитени за дълбока работа, срещите трябва да се планират в периоди с ниска енергия",
        "Енергийните модели нямат значение",
        "Срещите са по-важни от дълбоката работа"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Energy Management",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#energy-management", "#advanced", "#critical-thinking", "#bg", "#all-languages"]
    }
  ],
  // Polish (PL) - Professional translations
  PL: [
    {
      question: "Według lekcji, czym jest rytm ultradianny?",
      options: [
        "Codzienny cykl sen-czuwanie",
        "Mózg wspiera ~90 minut skupienia, potem potrzebuje 20-30 min regeneracji",
        "Tygodniowy wzorzec energii",
        "Miesięczny cykl produktywności"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Energy Management",
      questionType: QuestionType.RECALL,
      hashtags: ["#energy-management", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, jak zidentyfikować swoje szczytowe godziny energii?",
      options: [
        "Zapytaj swojego menedżera",
        "Prowadź dziennik przez tydzień: poziom energii co godzinę (skala 1-10), zidentyfikuj 3-4 bloki czasowe z najwyższą energią",
        "Pracuj w tych samych godzinach każdego dnia",
        "Podążaj za harmonogramem swojego zespołu"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Energy Management",
      questionType: QuestionType.RECALL,
      hashtags: ["#energy-management", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, czym jest rytuał mikro-przerwy?",
      options: [
        "20-30 minutowa przerwa",
        "5 minutowa przerwa: spacer, oddychanie, picie wody",
        "Cały dzień wolny",
        "Tygodniowa regeneracja"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Energy Management",
      questionType: QuestionType.RECALL,
      hashtags: ["#energy-management", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Dlaczego świadome zarządzanie energią jest ważne według lekcji?",
      options: [
        "Pozwala pracować dłużej",
        "Praca w godzinach szczytowych = 3x więcej wyników niż w czasach niskiej energii, zapobiega wypaleniu, poprawia kreatywność i podejmowanie decyzji",
        "Eliminuje potrzebę przerw",
        "Dotyczy tylko porannych osób"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Energy Management",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#energy-management", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, co powinieneś zaplanować w godzinach szczytowej energii?",
      options: [
        "Zadania rutynowe i spotkania",
        "Głęboką pracę - twoją najważniejszą, kreatywną pracę",
        "Email i administrację",
        "Obiad i przerwy"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Energy Management",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#energy-management", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Osoba pracuje nieprzerwanie od 9:00 do 18:00 bez przerw, doświadcza popołudniowego zmęczenia i ma trudności z wieczorną pracą. Według lekcji, co powinna zrobić?",
      options: [
        "Pracować ciężej, aby przejść przez to",
        "Wprowadzić mikro-przerwy (5 min) i makro-przerwy (20-30 min), zaplanować je w ciągu dnia",
        "Pominąć obiad, aby zaoszczędzić czas",
        "Pracować dłużej w ramach rekompensaty"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Energy Management",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#energy-management", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Menedżer zidentyfikował godziny szczytowe (9-11, 14-16), ale nadal planuje spotkania w tych godzinach i wykonuje głęboką pracę w okresach niskiej energii. Według ram lekcji, co to wskazuje?",
      options: [
        "Optymalne zarządzanie energią",
        "Nieskuteczne zarządzanie energią - godziny szczytowe powinny być chronione dla głębokiej pracy, spotkania powinny być planowane w okresach niskiej energii",
        "Wzorce energii nie mają znaczenia",
        "Spotkania są ważniejsze niż głęboka praca"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Energy Management",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#energy-management", "#advanced", "#critical-thinking", "#pl", "#all-languages"]
    }
  ],
  // Vietnamese (VI) - Professional translations
  VI: [
    {
      question: "Theo bài học, nhịp điệu ultradian là gì?",
      options: [
        "Chu kỳ ngủ-thức hàng ngày",
        "Não hỗ trợ ~90 phút tập trung, sau đó cần 20-30 phút phục hồi",
        "Mô hình năng lượng hàng tuần",
        "Chu kỳ năng suất hàng tháng"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#energy-management", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, làm thế nào để xác định giờ năng lượng cao điểm của bạn?",
      options: [
        "Hỏi người quản lý của bạn",
        "Ghi nhật ký trong một tuần: mức năng lượng theo giờ (thang điểm 1-10), xác định 3-4 khung thời gian có năng lượng cao nhất",
        "Làm việc cùng giờ mỗi ngày",
        "Theo lịch trình của nhóm bạn"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#energy-management", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, nghi thức nghỉ ngơi nhỏ là gì?",
      options: [
        "Nghỉ 20-30 phút",
        "Nghỉ 5 phút: đi bộ, thở, uống nước",
        "Nghỉ cả ngày",
        "Phục hồi cuối tuần"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#energy-management", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Tại sao quản lý năng lượng có ý thức lại quan trọng theo bài học?",
      options: [
        "Cho phép bạn làm việc nhiều giờ hơn",
        "Làm việc trong giờ cao điểm = sản lượng gấp 3 lần so với thời gian năng lượng thấp, ngăn ngừa kiệt sức, cải thiện sáng tạo và ra quyết định",
        "Loại bỏ nhu cầu nghỉ ngơi",
        "Chỉ áp dụng cho người buổi sáng"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#energy-management", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, bạn nên lên lịch gì trong giờ năng lượng cao điểm?",
      options: [
        "Nhiệm vụ thường lệ và cuộc họp",
        "Công việc sâu - công việc quan trọng, sáng tạo nhất của bạn",
        "Email và quản trị",
        "Bữa trưa và nghỉ ngơi"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#energy-management", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Một người làm việc liên tục từ 9:00 đến 18:00 không nghỉ, trải qua mệt mỏi buổi chiều và gặp khó khăn với công việc buổi tối. Theo bài học, họ nên làm gì?",
      options: [
        "Làm việc chăm chỉ hơn để vượt qua",
        "Thực hiện nghỉ ngơi nhỏ (5 phút) và nghỉ ngơi lớn (20-30 phút), lên lịch chúng trong suốt ngày",
        "Bỏ bữa trưa để tiết kiệm thời gian",
        "Làm việc nhiều giờ hơn để bù đắp"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#energy-management", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Một người quản lý đã xác định giờ cao điểm (9-11, 14-16) nhưng vẫn lên lịch cuộc họp trong những giờ này và thực hiện công việc sâu trong thời kỳ năng lượng thấp. Theo khung của bài học, điều này cho thấy gì?",
      options: [
        "Quản lý năng lượng tối ưu",
        "Quản lý năng lượng không hiệu quả - giờ cao điểm nên được bảo vệ cho công việc sâu, cuộc họp nên được lên lịch trong thời kỳ năng lượng thấp",
        "Mô hình năng lượng không quan trọng",
        "Cuộc họp quan trọng hơn công việc sâu"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#energy-management", "#advanced", "#critical-thinking", "#vi", "#all-languages"]
    }
  ],
  // Indonesian (ID) - Professional translations
  ID: [
    {
      question: "Menurut pelajaran, apa itu ritme ultradian?",
      options: [
        "Siklus tidur-bangun harian",
        "Otak mendukung ~90 menit fokus, kemudian membutuhkan 20-30 menit pemulihan",
        "Pola energi mingguan",
        "Siklus produktivitas bulanan"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#energy-management", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, bagaimana Anda mengidentifikasi jam energi puncak Anda?",
      options: [
        "Tanyakan manajer Anda",
        "Jurnal selama satu minggu: tingkat energi per jam (skala 1-10), identifikasi 3-4 blok waktu dengan energi tertinggi",
        "Bekerja pada jam yang sama setiap hari",
        "Ikuti jadwal tim Anda"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#energy-management", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, apa itu ritual istirahat mikro?",
      options: [
        "Istirahat 20-30 menit",
        "Istirahat 5 menit: berjalan, bernapas, minum air",
        "Hari libur penuh",
        "Pemulihan mingguan"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#energy-management", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Mengapa manajemen energi yang sadar penting menurut pelajaran?",
      options: [
        "Memungkinkan Anda bekerja lebih lama",
        "Bekerja selama jam puncak = 3x lebih banyak output daripada waktu energi rendah, mencegah kelelahan, meningkatkan kreativitas dan pengambilan keputusan",
        "Menghilangkan kebutuhan istirahat",
        "Hanya berlaku untuk orang pagi"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#energy-management", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, apa yang harus Anda jadwalkan selama jam energi puncak?",
      options: [
        "Tugas rutin dan rapat",
        "Kerja mendalam - pekerjaan paling penting dan kreatif Anda",
        "Email dan administrasi",
        "Makan siang dan istirahat"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#energy-management", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Seseorang bekerja terus-menerus dari 9:00 hingga 18:00 tanpa istirahat, mengalami kelelahan sore hari, dan kesulitan dengan pekerjaan malam. Menurut pelajaran, apa yang harus mereka lakukan?",
      options: [
        "Bekerja lebih keras untuk melewatinya",
        "Menerapkan istirahat mikro (5 menit) dan istirahat makro (20-30 menit), menjadwalkannya sepanjang hari",
        "Melewatkan makan siang untuk menghemat waktu",
        "Bekerja lebih lama untuk kompensasi"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#energy-management", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Seorang manajer telah mengidentifikasi jam puncak (9-11, 14-16) tetapi masih menjadwalkan rapat selama jam-jam ini dan melakukan kerja mendalam dalam periode energi rendah. Menurut kerangka pelajaran, apa yang ditunjukkan ini?",
      options: [
        "Manajemen energi optimal",
        "Manajemen energi yang tidak efektif - jam puncak harus dilindungi untuk kerja mendalam, rapat harus dijadwalkan selama periode energi rendah",
        "Pola energi tidak penting",
        "Rapat lebih penting daripada kerja mendalam"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#energy-management", "#advanced", "#critical-thinking", "#id", "#all-languages"]
    }
  ],
  // Arabic (AR) - Professional translations (RTL)
  AR: [
    {
      question: "وفقًا للدرس، ما هو الإيقاع فوق اليومي؟",
      options: [
        "دورة النوم-اليقظة اليومية",
        "يدعم الدماغ ~90 دقيقة من التركيز، ثم يحتاج إلى 20-30 دقيقة للتعافي",
        "نمط الطاقة الأسبوعي",
        "دورة الإنتاجية الشهرية"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#energy-management", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، كيف تحدد ساعات طاقتك القصوى؟",
      options: [
        "اسأل مديرك",
        "سجل لمدة أسبوع: مستوى الطاقة كل ساعة (مقياس 1-10)، حدد 3-4 كتل زمنية بأعلى طاقة",
        "اعمل في نفس الساعات كل يوم",
        "اتبع جدول فريقك"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#energy-management", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، ما هو طقس الاستراحة الصغيرة؟",
      options: [
        "استراحة 20-30 دقيقة",
        "استراحة 5 دقائق: المشي، التنفس، شرب الماء",
        "يوم إجازة كامل",
        "الاستعادة الأسبوعية"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#energy-management", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "لماذا إدارة الطاقة الواعية مهمة وفقًا للدرس؟",
      options: [
        "يسمح لك بالعمل لساعات أطول",
        "العمل خلال ساعات الذروة = 3x إنتاج أكثر من أوقات الطاقة المنخفضة، يمنع الإرهاق، يحسن الإبداع واتخاذ القرارات",
        "يلغي الحاجة للاستراحات",
        "ينطبق فقط على الأشخاص الصباحيين"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#energy-management", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، ماذا يجب أن تخطط خلال ساعات الطاقة القصوى؟",
      options: [
        "المهام الروتينية والاجتماعات",
        "العمل العميق - عملك الأكثر أهمية وإبداعًا",
        "البريد الإلكتروني والإدارة",
        "الغداء والاستراحات"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#energy-management", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "شخص يعمل باستمرار من 9:00 إلى 18:00 دون استراحة، يعاني من التعب بعد الظهر، ويواجه صعوبة في العمل المسائي. وفقًا للدرس، ماذا يجب أن يفعل؟",
      options: [
        "العمل بجدية أكبر للتغلب على ذلك",
        "تطبيق استراحات صغيرة (5 دقائق) واستراحات كبيرة (20-30 دقيقة)، جدولتها طوال اليوم",
        "تخطي الغداء لتوفير الوقت",
        "العمل لساعات أطول للتعويض"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#energy-management", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "مدير حدد ساعات الذروة (9-11، 14-16) لكنه لا يزال يجدول الاجتماعات خلال هذه الساعات ويقوم بعمل عميق في فترات الطاقة المنخفضة. وفقًا لإطار الدرس، ماذا يشير هذا؟",
      options: [
        "إدارة طاقة مثلى",
        "إدارة طاقة غير فعالة - يجب حماية ساعات الذروة للعمل العميق، يجب جدولة الاجتماعات خلال فترات الطاقة المنخفضة",
        "أنماط الطاقة لا تهم",
        "الاجتماعات أكثر أهمية من العمل العميق"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#energy-management", "#advanced", "#critical-thinking", "#ar", "#all-languages"]
    }
  ],
  // Portuguese (PT) - Professional translations (Brazilian)
  PT: [
    {
      question: "De acordo com a lição, o que é o ritmo ultradiano?",
      options: [
        "Ciclo diário de sono-vigília",
        "O cérebro suporta ~90 minutos de foco, depois precisa de 20-30 min de recuperação",
        "Padrão de energia semanal",
        "Ciclo de produtividade mensal"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#energy-management", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, como você identifica suas horas de energia de pico?",
      options: [
        "Pergunte ao seu gerente",
        "Mantenha um diário por uma semana: nível de energia por hora (escala 1-10), identifique 3-4 blocos de tempo com maior energia",
        "Trabalhe nos mesmos horários todos os dias",
        "Siga o cronograma da sua equipe"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#energy-management", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, o que é um ritual de micro-pausa?",
      options: [
        "Pausa de 20-30 minutos",
        "Pausa de 5 minutos: caminhar, respirar, beber água",
        "Dia inteiro de folga",
        "Recuperação semanal"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#energy-management", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "Por que o gerenciamento consciente de energia é importante de acordo com a lição?",
      options: [
        "Permite trabalhar mais horas",
        "Trabalhar durante horas de pico = 3x mais produção do que tempos de baixa energia, previne esgotamento, melhora criatividade e tomada de decisão",
        "Elimina a necessidade de pausas",
        "Aplica-se apenas a pessoas matinais"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#energy-management", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, o que você deve agendar durante as horas de energia de pico?",
      options: [
        "Tarefas rotineiras e reuniões",
        "Trabalho profundo - seu trabalho mais importante e criativo",
        "Email e administração",
        "Almoço e pausas"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#energy-management", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Uma pessoa trabalha continuamente das 9:00 às 18:00 sem pausas, experimenta fadiga à tarde e luta com trabalho noturno. De acordo com a lição, o que ela deve fazer?",
      options: [
        "Trabalhar mais para superar",
        "Implementar micro-pausas (5 min) e macro-pausas (20-30 min), agendá-las ao longo do dia",
        "Pular o almoço para economizar tempo",
        "Trabalhar mais horas para compensar"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#energy-management", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Um gerente identificou horas de pico (9-11, 14-16) mas ainda agenda reuniões durante essas horas e faz trabalho profundo em períodos de baixa energia. De acordo com a estrutura da lição, o que isso indica?",
      options: [
        "Gerenciamento de energia ideal",
        "Gerenciamento de energia ineficaz - horas de pico devem ser protegidas para trabalho profundo, reuniões devem ser agendadas em períodos de baixa energia",
        "Padrões de energia não importam",
        "Reuniões são mais importantes que trabalho profundo"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#energy-management", "#advanced", "#critical-thinking", "#pt", "#all-languages"]
    }
  ],
  // Hindi (HI) - Professional translations
  HI: [
    {
      question: "पाठ के अनुसार, अल्ट्राडियन लय क्या है?",
      options: [
        "दैनिक नींद-जागृति चक्र",
        "मस्तिष्क ~90 मिनट का ध्यान केंद्रित करता है, फिर 20-30 मिनट की वसूली की आवश्यकता होती है",
        "साप्ताहिक ऊर्जा पैटर्न",
        "मासिक उत्पादकता चक्र"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#energy-management", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, आप अपने शिखर ऊर्जा घंटों की पहचान कैसे करते हैं?",
      options: [
        "अपने प्रबंधक से पूछें",
        "एक सप्ताह के लिए पत्रिका रखें: प्रति घंटा ऊर्जा स्तर (1-10 पैमाने), सबसे अधिक ऊर्जा के साथ 3-4 समय खंडों की पहचान करें",
        "हर दिन एक ही घंटे काम करें",
        "अपने टीम के कार्यक्रम का पालन करें"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#energy-management", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, माइक्रो-ब्रेक अनुष्ठान क्या है?",
      options: [
        "20-30 मिनट का ब्रेक",
        "5 मिनट का ब्रेक: चलना, सांस लेना, पानी पीना",
        "पूरा दिन छुट्टी",
        "साप्ताहिक वसूली"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#energy-management", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार सचेत ऊर्जा प्रबंधन क्यों महत्वपूर्ण है?",
      options: [
        "यह आपको अधिक घंटे काम करने की अनुमति देता है",
        "शिखर घंटों में काम करना = कम ऊर्जा समय की तुलना में 3x अधिक आउटपुट, जलन को रोकता है, रचनात्मकता और निर्णय लेने में सुधार करता है",
        "ब्रेक की आवश्यकता को समाप्त करता है",
        "केवल सुबह के लोगों पर लागू होता है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#energy-management", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, आपको शिखर ऊर्जा घंटों के दौरान क्या निर्धारित करना चाहिए?",
      options: [
        "नियमित कार्य और बैठकें",
        "गहरा कार्य - आपका सबसे महत्वपूर्ण, रचनात्मक कार्य",
        "ईमेल और प्रशासन",
        "दोपहर का भोजन और ब्रेक"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#energy-management", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक व्यक्ति 9:00 से 18:00 तक बिना ब्रेक के लगातार काम करता है, दोपहर की थकान का अनुभव करता है, और शाम के काम के साथ संघर्ष करता है। पाठ के अनुसार, उन्हें क्या करना चाहिए?",
      options: [
        "इसे पार करने के लिए कठिन काम करना",
        "माइक्रो-ब्रेक (5 मिनट) और मैक्रो-ब्रेक (20-30 मिनट) लागू करना, दिन भर उन्हें निर्धारित करना",
        "समय बचाने के लिए दोपहर का भोजन छोड़ना",
        "क्षतिपूर्ति के लिए अधिक घंटे काम करना"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#energy-management", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक प्रबंधक ने शिखर घंटों की पहचान की है (9-11, 14-16) लेकिन अभी भी इन घंटों के दौरान बैठकें निर्धारित करता है और कम ऊर्जा अवधि में गहरा कार्य करता है। पाठ के ढांचे के अनुसार, यह क्या दर्शाता है?",
      options: [
        "इष्टतम ऊर्जा प्रबंधन",
        "अप्रभावी ऊर्जा प्रबंधन - शिखर घंटों को गहरे कार्य के लिए संरक्षित किया जाना चाहिए, बैठकें कम ऊर्जा अवधि के दौरान निर्धारित की जानी चाहिए",
        "ऊर्जा पैटर्न मायने नहीं रखते",
        "बैठकें गहरे कार्य से अधिक महत्वपूर्ण हैं"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#energy-management", "#advanced", "#critical-thinking", "#hi", "#all-languages"]
    }
  ]
};

async function seedDay10Enhanced() {
  try {
    await connectDB();
    console.log('🌱 SEEDING DAY 10 ENHANCED QUIZ QUESTIONS\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    let totalQuestions = 0;
    let totalUpdated = 0;
    let totalCreated = 0;

    for (const lang of LANGUAGES) {
      const courseId = `${COURSE_ID_BASE}_${lang}`;
      const lessonId = `${COURSE_ID_BASE}_${lang}_DAY_10`;

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
      const questions = DAY10_QUESTIONS[lang];
      
      if (!questions || questions.length === 0) {
        console.error(`   ❌ ERROR: No questions defined for ${lang}! Questions MUST be in course language.`);
        throw new Error(`Missing translations for ${lang} - Day 10 questions must be in course language, not English fallback`);
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
    console.log(`\n✅ DAY 10 ENHANCEMENT COMPLETE!\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedDay10Enhanced();
