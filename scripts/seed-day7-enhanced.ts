/**
 * Seed Day 7 Enhanced Quiz Questions
 * 
 * Purpose: Enhance Day 7 quizzes from 5 to 7 questions across all 10 languages
 * Why: Part of Quiz Quality Enhancement - Phase 1, Day 7
 * 
 * Lesson Topic: Daily/Weekly System (morning ritual, daily huddle, weekly review)
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
const DAY_NUMBER = 7;
const LANGUAGES = ['HU', 'EN', 'TR', 'BG', 'PL', 'VI', 'ID', 'AR', 'PT', 'HI'];

/**
 * Day 7 Enhanced Questions - All Languages
 * Topic: Daily/Weekly System (morning ritual, daily huddle, weekly review)
 * Structure: 7 questions per language
 * Q1-Q4: Keep (Recall - foundational concepts)
 * Q5: Rewritten (Application - from definition to purpose)
 * Q6: New (Application - practical implementation)
 * Q7: New (Critical Thinking - systems integration)
 */
const DAY7_QUESTIONS: Record<string, Array<{
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: QuestionDifficulty;
  category: string;
  questionType: QuestionType;
  hashtags: string[];
}>> = {
  EN: [
    // Q1: Morning ritual duration (RECALL - Keep)
    {
      question: "According to the lesson, how long does a morning ritual take?",
      options: [
        "5 min",
        "10 min",
        "15 min",
        "30 min"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Daily/Weekly Systems",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q2: Daily huddle duration (RECALL - Keep)
    {
      question: "According to the lesson, how long does a daily huddle take?",
      options: [
        "2 min",
        "5 min",
        "10 min",
        "15 min"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Daily/Weekly Systems",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q3: Daily huddle questions count (RECALL - Keep)
    {
      question: "According to the lesson, how many questions are in a daily huddle?",
      options: [
        "1",
        "2",
        "3",
        "5"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Daily/Weekly Systems",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q4: Weekly review duration (RECALL - Keep)
    {
      question: "According to the lesson, how long does a weekly review take?",
      options: [
        "15 min",
        "30 min",
        "60 min",
        "90 min"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Daily/Weekly Systems",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q5: Why rituals matter (APPLICATION - Rewritten from definition)
    {
      question: "Why are daily and weekly rituals important according to the lesson?",
      options: [
        "They take less time than planning",
        "They create automatic behavior, reduce decision fatigue, and free up energy for real work",
        "They replace the need for inboxes",
        "They only work for teams"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Daily/Weekly Systems",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#rituals", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q6: Implementing rituals together (APPLICATION - New)
    {
      question: "A person has a morning ritual but struggles with weekly reviews. According to the lesson, what should they focus on?",
      options: [
        "Skip weekly reviews and only do morning rituals",
        "Set up a structured 30-minute weekly review ritual with clear steps (last week review, metrics, learnings, next week plan, affirmation)",
        "Make weekly reviews shorter",
        "Only do weekly reviews when feeling motivated"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Daily/Weekly Systems",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#rituals", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q7: Ritual system integration (CRITICAL THINKING - New)
    {
      question: "A team has morning rituals and weekly reviews, but lacks daily huddles. As a result, team priorities are misaligned and blockers go unnoticed. According to the lesson's framework, what does this demonstrate?",
      options: [
        "Optimal ritual system implementation",
        "An incomplete ritual system - all three components (morning ritual, daily huddle, weekly review) work together to ensure consistent productivity",
        "Good individual productivity",
        "Efficient meeting management"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Daily/Weekly Systems",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#rituals", "#advanced", "#critical-thinking", "#en", "#all-languages"]
    }
  ],
  // Hungarian translations
  HU: [
    {
      question: "A lecke szerint mennyi ideig tart egy reggeli ritual?",
      options: [
        "5 perc",
        "10 perc",
        "15 perc",
        "30 perc"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Napi/heti rendszerek",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint mennyi ideig tart egy napi huddle?",
      options: [
        "2 perc",
        "5 perc",
        "10 perc",
        "15 perc"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Napi/heti rendszerek",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint hány kérdés van egy napi huddleben?",
      options: [
        "1",
        "2",
        "3",
        "5"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Napi/heti rendszerek",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint mennyi ideig tart egy heti áttekintés?",
      options: [
        "15 perc",
        "30 perc",
        "60 perc",
        "90 perc"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Napi/heti rendszerek",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "Miért fontosak a napi és heti ritualok a lecke szerint?",
      options: [
        "Kevesebb időt vesznek igénybe, mint a tervezés",
        "Automatikus viselkedést hoznak létre, csökkentik a döntési fáradtságot, és felszabadítják az energiát az igazi munkára",
        "Felváltják az inboxok szükségességét",
        "Csak csapatoknak működnek"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Napi/heti rendszerek",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#rituals", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy személynek van reggeli ritualja, de nehezen megy a heti áttekintés. A lecke szerint mire kellene fókuszálnia?",
      options: [
        "Hagyja ki a heti áttekintéseket és csak reggeli ritualokat csináljon",
        "Állítson fel egy strukturált 30 perces heti áttekintési ritualt egyértelmű lépésekkel (múltheti áttekintés, metrikák, tanulások, következő heti terv, megerősítés)",
        "Rövidebbé tegye a heti áttekintéseket",
        "Csak akkor csináljon heti áttekintést, amikor motivált"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Napi/heti rendszerek",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#rituals", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy csapatnak van reggeli ritualja és heti áttekintése, de nincs napi huddle. Ennek eredményeként a csapat prioritásai nincsenek összehangolva és a blokkolók észrevétlenek maradnak. A lecke keretrendszere szerint mit mutat ez?",
      options: [
        "Optimális ritual rendszer megvalósítás",
        "Hiányos ritual rendszer - mindhárom komponens (reggeli ritual, napi huddle, heti áttekintés) együttműködik a rendszeres termelékenység biztosításához",
        "Jó egyéni termelékenység",
        "Hatékony meeting kezelés"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Napi/heti rendszerek",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#rituals", "#advanced", "#critical-thinking", "#hu", "#all-languages"]
    }
  ],
  // Turkish (TR) - Professional translations
  TR: [
    {
      question: "Derse göre sabah ritüeli ne kadar sürer?",
      options: [
        "5 dakika",
        "10 dakika",
        "15 dakika",
        "30 dakika"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Günlük/Haftalık Sistemler",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre günlük huddle ne kadar sürer?",
      options: [
        "2 dakika",
        "5 dakika",
        "10 dakika",
        "15 dakika"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Günlük/Haftalık Sistemler",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre günlük huddlede kaç soru vardır?",
      options: [
        "1",
        "2",
        "3",
        "5"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Günlük/Haftalık Sistemler",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre haftalık inceleme ne kadar sürer?",
      options: [
        "15 dakika",
        "30 dakika",
        "60 dakika",
        "90 dakika"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Günlük/Haftalık Sistemler",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre günlük ve haftalık ritüeller neden önemlidir?",
      options: [
        "Planlamadan daha az zaman alırlar",
        "Otomatik davranış oluştururlar, karar yorgunluğunu azaltırlar ve gerçek çalışma için enerjiyi serbest bırakırlar",
        "Gelen kutularına olan ihtiyacı değiştirirler",
        "Sadece ekipler için çalışırlar"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Günlük/Haftalık Sistemler",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#rituals", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir kişinin sabah ritüeli var ama haftalık incelemelerle mücadele ediyor. Derse göre neye odaklanmalılar?",
      options: [
        "Haftalık incelemeleri atlayın ve sadece sabah ritüellerini yapın",
        "Açık adımlarla yapılandırılmış bir 30 dakikalık haftalık inceleme ritüeli kurun (geçen hafta incelemesi, metrikler, öğrenimler, sonraki hafta planı, afirmation)",
        "Haftalık incelemeleri kısaltın",
        "Sadece motive olduğunuzda haftalık inceleme yapın"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Günlük/Haftalık Sistemler",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#rituals", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir ekibin sabah ritüelleri ve haftalık incelemeleri var, ancak günlük huddle'ları yok. Sonuç olarak, ekip öncelikleri yanlış hizalanmış ve engeller fark edilmemiş. Dersin çerçevesine göre bu neyi gösterir?",
      options: [
        "Optimal ritüel sistemi uygulaması",
        "Eksik bir ritüel sistemi - üç bileşenin tümü (sabah ritüeli, günlük huddle, haftalık inceleme) tutarlı verimliliği sağlamak için birlikte çalışır",
        "İyi bireysel verimlilik",
        "Verimli toplantı yönetimi"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Günlük/Haftalık Sistemler",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#rituals", "#advanced", "#critical-thinking", "#tr", "#all-languages"]
    }
  ],
  // Bulgarian (BG) - Professional translations
  BG: [
    {
      question: "Според урока, колко време отнема сутрешен ритуал?",
      options: [
        "5 мин",
        "10 мин",
        "15 мин",
        "30 мин"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Дневни/Седмични системи",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, колко време отнема дневен huddle?",
      options: [
        "2 мин",
        "5 мин",
        "10 мин",
        "15 мин"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Дневни/Седмични системи",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, колко въпроса има в дневен huddle?",
      options: [
        "1",
        "2",
        "3",
        "5"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Дневни/Седмични системи",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, колко време отнема седмичен преглед?",
      options: [
        "15 мин",
        "30 мин",
        "60 мин",
        "90 мин"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Дневни/Седмични системи",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Защо дневните и седмичните ритуали са важни според урока?",
      options: [
        "Отнемат по-малко време от планирането",
        "Създават автоматично поведение, намаляват умората при вземане на решения и освобождават енергия за реална работа",
        "Заменят необходимостта от входящи кутии",
        "Работят само за екипи"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Дневни/Седмични системи",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#rituals", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Човек има сутрешен ритуал, но се бори със седмични прегледи. Според урока, на какво трябва да се съсредоточат?",
      options: [
        "Пропуснете седмичните прегледи и правете само сутрешни ритуали",
        "Настройте структуриран 30-минутен седмичен преглед с ясни стъпки (преглед на миналата седмица, метрики, уроци, план за следващата седмица, афирмация)",
        "Скратете седмичните прегледи",
        "Правете седмични прегледи само когато се чувствате мотивирани"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Дневни/Седмични системи",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#rituals", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Екипът има сутрешни ритуали и седмични прегледи, но липсват дневни huddle. В резултат на това приоритетите на екипа са неправилно подравнени и пречките остават незабелязани. Според рамката на урока, какво демонстрира това?",
      options: [
        "Оптимална реализация на ритуална система",
        "Непълна ритуална система - и трите компонента (сутрешен ритуал, дневен huddle, седмичен преглед) работят заедно, за да осигурят последователна продуктивност",
        "Добра индивидуална продуктивност",
        "Ефективно управление на срещи"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Дневни/Седмични системи",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#rituals", "#advanced", "#critical-thinking", "#bg", "#all-languages"]
    }
  ],
  // Polish (PL) - Professional translations
  PL: [
    {
      question: "Według lekcji, jak długo trwa ritual poranny?",
      options: [
        "5 min",
        "10 min",
        "15 min",
        "30 min"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Systemy dzienne/tygodniowe",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, jak długo trwa dzienny huddle?",
      options: [
        "2 min",
        "5 min",
        "10 min",
        "15 min"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Systemy dzienne/tygodniowe",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, ile pytań jest w dziennym huddle?",
      options: [
        "1",
        "2",
        "3",
        "5"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Systemy dzienne/tygodniowe",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, jak długo trwa przegląd tygodniowy?",
      options: [
        "15 min",
        "30 min",
        "60 min",
        "90 min"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Systemy dzienne/tygodniowe",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Dlaczego codzienne i cotygodniowe rytuały są ważne według lekcji?",
      options: [
        "Zajmują mniej czasu niż planowanie",
        "Tworzą automatyczne zachowanie, zmniejszają zmęczenie decyzyjne i uwalniają energię na prawdziwą pracę",
        "Zastępują potrzebę skrzynek odbiorczych",
        "Działają tylko dla zespołów"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Systemy dzienne/tygodniowe",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#rituals", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Osoba ma poranny rytuał, ale ma trudności z przeglądami tygodniowymi. Według lekcji, na czym powinna się skupić?",
      options: [
        "Pomiń przeglądy tygodniowe i rób tylko poranne rytuały",
        "Ustaw strukturyzowany 30-minutowy cotygodniowy przegląd z jasnymi krokami (przegląd zeszłego tygodnia, metryki, wnioski, plan na następny tydzień, afirmacja)",
        "Skróć przeglądy tygodniowe",
        "Rób przeglądy tygodniowe tylko gdy czujesz się zmotywowany"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Systemy dzienne/tygodniowe",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#rituals", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Zespół ma poranne rytuały i przeglądy tygodniowe, ale brakuje codziennych huddle. W rezultacie priorytety zespołu są źle wyrównane, a blokery pozostają niezauważone. Według ram lekcji, co to demonstruje?",
      options: [
        "Optymalna implementacja systemu rytuałów",
        "Niekompletny system rytuałów - wszystkie trzy komponenty (poranny rytuał, dzienny huddle, przegląd tygodniowy) współpracują, aby zapewnić spójną produktywność",
        "Dobra indywidualna produktywność",
        "Skuteczne zarządzanie spotkaniami"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Systemy dzienne/tygodniowe",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#rituals", "#advanced", "#critical-thinking", "#pl", "#all-languages"]
    }
  ],
  // Vietnamese (VI) - Professional translations
  VI: [
    {
      question: "Theo bài học, ritual buổi sáng mất bao lâu?",
      options: [
        "5 phút",
        "10 phút",
        "15 phút",
        "30 phút"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Hệ thống Hàng ngày/Hàng tuần",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, cuộc họp hàng ngày mất bao lâu?",
      options: [
        "2 phút",
        "5 phút",
        "10 phút",
        "15 phút"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Hệ thống Hàng ngày/Hàng tuần",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, có bao nhiêu câu hỏi trong cuộc họp hàng ngày?",
      options: [
        "1",
        "2",
        "3",
        "5"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Hệ thống Hàng ngày/Hàng tuần",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, đánh giá hàng tuần mất bao lâu?",
      options: [
        "15 phút",
        "30 phút",
        "60 phút",
        "90 phút"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Hệ thống Hàng ngày/Hàng tuần",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Tại sao các ritual hàng ngày và hàng tuần quan trọng theo bài học?",
      options: [
        "Chúng mất ít thời gian hơn lập kế hoạch",
        "Chúng tạo ra hành vi tự động, giảm mệt mỏi quyết định và giải phóng năng lượng cho công việc thực sự",
        "Chúng thay thế nhu cầu về hộp thư đến",
        "Chúng chỉ hoạt động cho nhóm"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Hệ thống Hàng ngày/Hàng tuần",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#rituals", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Một người có ritual buổi sáng nhưng gặp khó khăn với đánh giá hàng tuần. Theo bài học, họ nên tập trung vào điều gì?",
      options: [
        "Bỏ qua đánh giá hàng tuần và chỉ làm ritual buổi sáng",
        "Thiết lập một ritual đánh giá hàng tuần 30 phút có cấu trúc với các bước rõ ràng (đánh giá tuần trước, chỉ số, bài học, kế hoạch tuần tới, khẳng định)",
        "Rút ngắn đánh giá hàng tuần",
        "Chỉ làm đánh giá hàng tuần khi cảm thấy có động lực"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Hệ thống Hàng ngày/Hàng tuần",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#rituals", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Một nhóm có ritual buổi sáng và đánh giá hàng tuần, nhưng thiếu cuộc họp hàng ngày. Kết quả là, ưu tiên của nhóm không được căn chỉnh và các chướng ngại vật không được chú ý. Theo khung của bài học, điều này thể hiện điều gì?",
      options: [
        "Triển khai hệ thống ritual tối ưu",
        "Hệ thống ritual không hoàn chỉnh - cả ba thành phần (ritual buổi sáng, cuộc họp hàng ngày, đánh giá hàng tuần) hoạt động cùng nhau để đảm bảo năng suất nhất quán",
        "Năng suất cá nhân tốt",
        "Quản lý cuộc họp hiệu quả"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Hệ thống Hàng ngày/Hàng tuần",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#rituals", "#advanced", "#critical-thinking", "#vi", "#all-languages"]
    }
  ],
  // Indonesian (ID) - Professional translations
  ID: [
    {
      question: "Menurut pelajaran, berapa lama ritual pagi berlangsung?",
      options: [
        "5 menit",
        "10 menit",
        "15 menit",
        "30 menit"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Sistem Harian/Mingguan",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, berapa lama huddle harian berlangsung?",
      options: [
        "2 menit",
        "5 menit",
        "10 menit",
        "15 menit"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Sistem Harian/Mingguan",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, berapa banyak pertanyaan dalam huddle harian?",
      options: [
        "1",
        "2",
        "3",
        "5"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Sistem Harian/Mingguan",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, berapa lama tinjauan mingguan berlangsung?",
      options: [
        "15 menit",
        "30 menit",
        "60 menit",
        "90 menit"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Sistem Harian/Mingguan",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Mengapa ritual harian dan mingguan penting menurut pelajaran?",
      options: [
        "Mereka memakan waktu lebih sedikit daripada perencanaan",
        "Mereka menciptakan perilaku otomatis, mengurangi kelelahan keputusan, dan membebaskan energi untuk pekerjaan nyata",
        "Mereka menggantikan kebutuhan akan kotak masuk",
        "Mereka hanya bekerja untuk tim"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Sistem Harian/Mingguan",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#rituals", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Seseorang memiliki ritual pagi tetapi kesulitan dengan tinjauan mingguan. Menurut pelajaran, apa yang harus mereka fokuskan?",
      options: [
        "Lewati tinjauan mingguan dan hanya lakukan ritual pagi",
        "Siapkan ritual tinjauan mingguan 30 menit yang terstruktur dengan langkah-langkah jelas (tinjauan minggu lalu, metrik, pembelajaran, rencana minggu depan, afirmasi)",
        "Persingkat tinjauan mingguan",
        "Hanya lakukan tinjauan mingguan saat merasa termotivasi"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Sistem Harian/Mingguan",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#rituals", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Sebuah tim memiliki ritual pagi dan tinjauan mingguan, tetapi tidak memiliki huddle harian. Akibatnya, prioritas tim tidak selaras dan penghalang tidak diperhatikan. Menurut kerangka pelajaran, apa yang ditunjukkan ini?",
      options: [
        "Implementasi sistem ritual yang optimal",
        "Sistem ritual yang tidak lengkap - ketiga komponen (ritual pagi, huddle harian, tinjauan mingguan) bekerja bersama untuk memastikan produktivitas yang konsisten",
        "Produktivitas individu yang baik",
        "Manajemen rapat yang efisien"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Sistem Harian/Mingguan",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#rituals", "#advanced", "#critical-thinking", "#id", "#all-languages"]
    }
  ],
  // Arabic (AR) - Professional translations (RTL)
  AR: [
    {
      question: "وفقًا للدرس، كم من الوقت يستغرق الطقس الصباحي؟",
      options: [
        "5 دقائق",
        "10 دقائق",
        "15 دقيقة",
        "30 دقيقة"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "الأنظمة اليومية/الأسبوعية",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، كم من الوقت يستغرق الاجتماع اليومي؟",
      options: [
        "دقيقتان",
        "5 دقائق",
        "10 دقائق",
        "15 دقيقة"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "الأنظمة اليومية/الأسبوعية",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، كم عدد الأسئلة في الاجتماع اليومي؟",
      options: [
        "1",
        "2",
        "3",
        "5"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "الأنظمة اليومية/الأسبوعية",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، كم من الوقت تستغرق المراجعة الأسبوعية؟",
      options: [
        "15 دقيقة",
        "30 دقيقة",
        "60 دقيقة",
        "90 دقيقة"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "الأنظمة اليومية/الأسبوعية",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "لماذا الطقوس اليومية والأسبوعية مهمة وفقًا للدرس؟",
      options: [
        "تستغرق وقتًا أقل من التخطيط",
        "تخلق سلوكًا تلقائيًا، وتقلل من إرهاق القرار، وتطلق الطاقة للعمل الحقيقي",
        "تحل محل الحاجة إلى صناديق الوارد",
        "تعمل فقط للفرق"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "الأنظمة اليومية/الأسبوعية",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#rituals", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "شخص لديه طقس صباحي لكنه يواجه صعوبة في المراجعات الأسبوعية. وفقًا للدرس، على ماذا يجب أن يركزوا؟",
      options: [
        "تخطي المراجعات الأسبوعية والقيام فقط بالطقوس الصباحية",
        "إعداد طقس مراجعة أسبوعي منظم لمدة 30 دقيقة بخطوات واضحة (مراجعة الأسبوع الماضي، المقاييس، التعلم، خطة الأسبوع القادم، التأكيد)",
        "تقصير المراجعات الأسبوعية",
        "القيام بالمراجعات الأسبوعية فقط عند الشعور بالتحفيز"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "الأنظمة اليومية/الأسبوعية",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#rituals", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "فريق لديه طقوس صباحية ومراجعات أسبوعية، لكنه يفتقر إلى الاجتماعات اليومية. نتيجة لذلك، أولويات الفريق غير محاذاة والعوائق تبقى غير ملحوظة. وفقًا لإطار الدرس، ماذا يوضح هذا؟",
      options: [
        "تنفيذ نظام طقوس مثالي",
        "نظام طقوس غير مكتمل - جميع المكونات الثلاثة (الطقس الصباحي، الاجتماع اليومي، المراجعة الأسبوعية) تعمل معًا لضمان إنتاجية متسقة",
        "إنتاجية فردية جيدة",
        "إدارة اجتماعات فعالة"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "الأنظمة اليومية/الأسبوعية",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#rituals", "#advanced", "#critical-thinking", "#ar", "#all-languages"]
    }
  ],
  // Portuguese (PT) - Professional translations (Brazilian)
  PT: [
    {
      question: "De acordo com a lição, quanto tempo leva o ritual matinal?",
      options: [
        "5 min",
        "10 min",
        "15 min",
        "30 min"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Sistemas Diários/Semanais",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, quanto tempo leva uma reunião diária?",
      options: [
        "2 min",
        "5 min",
        "10 min",
        "15 min"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Sistemas Diários/Semanais",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, quantas perguntas tem uma reunião diária?",
      options: [
        "1",
        "2",
        "3",
        "5"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Sistemas Diários/Semanais",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, quanto tempo leva uma revisão semanal?",
      options: [
        "15 min",
        "30 min",
        "60 min",
        "90 min"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Sistemas Diários/Semanais",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "Por que rituais diários e semanais são importantes de acordo com a lição?",
      options: [
        "Levam menos tempo do que o planejamento",
        "Criam comportamento automático, reduzem a fadiga de decisão e liberam energia para o trabalho real",
        "Substituem a necessidade de caixas de entrada",
        "Funcionam apenas para equipes"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Sistemas Diários/Semanais",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#rituals", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Uma pessoa tem um ritual matinal, mas tem dificuldade com revisões semanais. De acordo com a lição, em que devem se concentrar?",
      options: [
        "Pular revisões semanais e fazer apenas rituais matinais",
        "Configurar um ritual de revisão semanal estruturado de 30 minutos com etapas claras (revisão da semana passada, métricas, aprendizados, plano da próxima semana, afirmação)",
        "Encurtar revisões semanais",
        "Fazer revisões semanais apenas quando se sentir motivado"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Sistemas Diários/Semanais",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#rituals", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Uma equipe tem rituais matinais e revisões semanais, mas falta reuniões diárias. Como resultado, as prioridades da equipe estão desalinhadas e os bloqueadores passam despercebidos. De acordo com a estrutura da lição, o que isso demonstra?",
      options: [
        "Implementação ideal do sistema de rituais",
        "Um sistema de rituais incompleto - todos os três componentes (ritual matinal, reunião diária, revisão semanal) trabalham juntos para garantir produtividade consistente",
        "Boa produtividade individual",
        "Gestão eficiente de reuniões"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Sistemas Diários/Semanais",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#rituals", "#advanced", "#critical-thinking", "#pt", "#all-languages"]
    }
  ],
  // Hindi (HI) - Professional translations
  HI: [
    {
      question: "पाठ के अनुसार, सुबह की रीति कितने समय तक चलती है?",
      options: [
        "5 मिनट",
        "10 मिनट",
        "15 मिनट",
        "30 मिनट"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "दैनिक/साप्ताहिक प्रणालियां",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, दैनिक huddle कितने समय तक चलता है?",
      options: [
        "2 मिनट",
        "5 मिनट",
        "10 मिनट",
        "15 मिनट"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "दैनिक/साप्ताहिक प्रणालियां",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, दैनिक huddle में कितने सवाल होते हैं?",
      options: [
        "1",
        "2",
        "3",
        "5"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "दैनिक/साप्ताहिक प्रणालियां",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, साप्ताहिक समीक्षा कितने समय तक चलती है?",
      options: [
        "15 मिनट",
        "30 मिनट",
        "60 मिनट",
        "90 मिनट"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "दैनिक/साप्ताहिक प्रणालियां",
      questionType: QuestionType.RECALL,
      hashtags: ["#rituals", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार दैनिक और साप्ताहिक रीतियां क्यों महत्वपूर्ण हैं?",
      options: [
        "वे योजना से कम समय लेती हैं",
        "वे स्वचालित व्यवहार बनाती हैं, निर्णय थकान को कम करती हैं, और वास्तविक काम के लिए ऊर्जा मुक्त करती हैं",
        "वे इनबॉक्स की आवश्यकता को प्रतिस्थापित करती हैं",
        "वे केवल टीमों के लिए काम करती हैं"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "दैनिक/साप्ताहिक प्रणालियां",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#rituals", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक व्यक्ति की सुबह की रीति है लेकिन साप्ताहिक समीक्षाओं के साथ संघर्ष कर रहा है। पाठ के अनुसार, उन्हें किस पर ध्यान केंद्रित करना चाहिए?",
      options: [
        "साप्ताहिक समीक्षाओं को छोड़ें और केवल सुबह की रीतियां करें",
        "स्पष्ट चरणों के साथ एक संरचित 30-मिनट साप्ताहिक समीक्षा रीति स्थापित करें (पिछले सप्ताह की समीक्षा, मेट्रिक्स, सीख, अगले सप्ताह की योजना, पुष्टि)",
        "साप्ताहिक समीक्षाओं को छोटा करें",
        "केवल तब साप्ताहिक समीक्षा करें जब प्रेरित महसूस करें"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "दैनिक/साप्ताहिक प्रणालियां",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#rituals", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक टीम के पास सुबह की रीतियां और साप्ताहिक समीक्षाएं हैं, लेकिन दैनिक huddle की कमी है। परिणामस्वरूप, टीम की प्राथमिकताएं गलत तरीके से संरेखित हैं और ब्लॉकर्स अनदेखे रह जाते हैं। पाठ के ढांचे के अनुसार, यह क्या प्रदर्शित करता है?",
      options: [
        "इष्टतम रीति प्रणाली कार्यान्वयन",
        "अधूरी रीति प्रणाली - सभी तीन घटक (सुबह की रीति, दैनिक huddle, साप्ताहिक समीक्षा) सुसंगत उत्पादकता सुनिश्चित करने के लिए एक साथ काम करते हैं",
        "अच्छी व्यक्तिगत उत्पादकता",
        "कुशल बैठक प्रबंधन"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "दैनिक/साप्ताहिक प्रणालियां",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#rituals", "#advanced", "#critical-thinking", "#hi", "#all-languages"]
    }
  ]
};

async function seedDay7Enhanced() {
  try {
    await connectDB();
    console.log('🌱 SEEDING DAY 7 ENHANCED QUIZ QUESTIONS\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    let totalQuestions = 0;
    let totalUpdated = 0;
    let totalCreated = 0;

    for (const lang of LANGUAGES) {
      const courseId = `${COURSE_ID_BASE}_${lang}`;
      const lessonId = `${COURSE_ID_BASE}_${lang}_DAY_07`;

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
      const questions = DAY7_QUESTIONS[lang] || DAY7_QUESTIONS['EN']; // Fallback to EN if not translated
      
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
    console.log(`\n✅ DAY 7 ENHANCEMENT COMPLETE!\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedDay7Enhanced();
