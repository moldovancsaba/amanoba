/**
 * Seed Day 14 Enhanced Quiz Questions
 * 
 * Purpose: Enhance Day 14 quizzes from 5 to 7 questions across all 10 languages
 * Why: Part of Quiz Quality Enhancement - Phase 1, Day 14
 * 
 * Lesson Topic: Meeting Efficiency (agenda, time limits, decision log)
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
const DAY_NUMBER = 14;
const LANGUAGES = ['HU', 'EN', 'TR', 'BG', 'PL', 'VI', 'ID', 'AR', 'PT', 'HI'];

/**
 * Day 14 Enhanced Questions - All Languages
 * Topic: Meeting Efficiency
 * Structure: 7 questions per language
 * Q1-Q3: Keep (Recall - foundational concepts)
 * Q4: Rewritten (Application - from definition to purpose)
 * Q5: Keep (Application - scenario-based)
 * Q6: New (Application - practical implementation)
 * Q7: New (Critical Thinking - systems integration)
 */
const DAY14_QUESTIONS: Record<string, Array<{
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: QuestionDifficulty;
  category: string;
  questionType: QuestionType;
  hashtags: string[];
}>> = {
  EN: [
    // Q1: Meeting efficiency basics (RECALL)
    {
      question: "According to the lesson, what is most important in meeting efficiency?",
      options: [
        "Agenda and time limits",
        "Long conversations",
        "Many participants",
        "No preparation"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Meeting Efficiency",
      questionType: QuestionType.RECALL,
      hashtags: ["#meeting-efficiency", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q2: Decision log purpose (RECALL)
    {
      question: "According to the lesson, what is the primary purpose of a decision log in meetings?",
      options: [
        "To record all conversations",
        "To track decisions made, action items, and owners for accountability",
        "To replace the agenda",
        "To eliminate the need for follow-up"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Meeting Efficiency",
      questionType: QuestionType.RECALL,
      hashtags: ["#meeting-efficiency", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q3: Time limits benefit (RECALL)
    {
      question: "According to the lesson, why are time limits important for meeting efficiency?",
      options: [
        "They make meetings shorter",
        "They create focus, prevent scope creep, and ensure decisions are made within allocated time",
        "They eliminate the need for agendas",
        "They reduce the number of participants"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Meeting Efficiency",
      questionType: QuestionType.RECALL,
      hashtags: ["#meeting-efficiency", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q4: Why meeting efficiency matters (APPLICATION - Rewritten)
    {
      question: "Why is meeting efficiency important according to the lesson?",
      options: [
        "It eliminates all meetings",
        "It saves time, ensures decisions are made, creates accountability through decision logs, and prevents wasted collective time",
        "It only applies to large teams",
        "It requires no preparation"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Meeting Efficiency",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#meeting-efficiency", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q5: Agenda scenario (APPLICATION - Keep)
    {
      question: "A team meeting runs 30 minutes over time with no clear outcomes. According to the lesson, what was likely missing?",
      options: [
        "More participants",
        "A clear agenda with time limits and decision log",
        "Longer meeting time",
        "Fewer topics"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Meeting Efficiency",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#meeting-efficiency", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q6: Designing efficient meeting (APPLICATION - New)
    {
      question: "You need to plan a 1-hour team meeting to decide on a project approach. According to the lesson, what should you include?",
      options: [
        "Just show up and discuss",
        "A clear agenda with topics and time allocations, time limits for each section, and a decision log template to track outcomes",
        "Only an agenda",
        "Only time limits"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Meeting Efficiency",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#meeting-efficiency", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q7: Meeting culture impact (CRITICAL THINKING - New)
    {
      question: "A company has meetings that consistently run over time with no decisions made, leading to frustration and repeated discussions. According to the lesson's framework, what is the core issue?",
      options: [
        "Not enough meeting time",
        "Lack of meeting efficiency practices - missing agendas, time limits, and decision logs that create accountability and focus",
        "Too many participants",
        "Meetings are unnecessary"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Meeting Efficiency",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#meeting-efficiency", "#advanced", "#critical-thinking", "#en", "#all-languages"]
    }
  ],
  // Hungarian (HU) - Professional translations
  HU: [
    {
      question: "A lecke szerint mi a legfontosabb az értekezlet hatékonyságában?",
      options: [
        "Napirend és időkorlát",
        "Hosszú beszélgetések",
        "Túl sok résztvevő",
        "Nincs előkészítés"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Értekezlet Hatékonyság",
      questionType: QuestionType.RECALL,
      hashtags: ["#meeting-efficiency", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint mi a döntési jegyzőkönyv elsődleges célja az értekezleteken?",
      options: [
        "Az összes beszélgetés rögzítése",
        "A meghozott döntések, akciópontok és felelősök nyomon követése az elszámoltathatóságért",
        "A napirend helyettesítése",
        "A következő lépések szükségességének kiküszöbölése"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Értekezlet Hatékonyság",
      questionType: QuestionType.RECALL,
      hashtags: ["#meeting-efficiency", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint miért fontosak az időkorlátok az értekezlet hatékonyságához?",
      options: [
        "Rövidebbé teszik az értekezleteket",
        "Fókuszt teremtenek, megelőzik a hatálykiterjesztést, és biztosítják, hogy a döntések a kijelölt időn belül születnek",
        "Kiküszöbölik a napirend szükségességét",
        "Csökkentik a résztvevők számát"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Értekezlet Hatékonyság",
      questionType: QuestionType.RECALL,
      hashtags: ["#meeting-efficiency", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "Miért fontos az értekezlet hatékonysága a lecke szerint?",
      options: [
        "Kiküszöböli az összes értekezletet",
        "Időt takarít meg, biztosítja a döntések meghozatalát, elszámoltathatóságot teremt a döntési jegyzőkönyvön keresztül, és megelőzi a kollektív idő pazarlását",
        "Csak nagy csapatokra vonatkozik",
        "Nem igényel előkészítést"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Értekezlet Hatékonyság",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#meeting-efficiency", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy csapat értekezlet 30 percet csúszik, nincs egyértelmű eredmény. A lecke szerint mi hiányzott valószínűleg?",
      options: [
        "Több résztvevő",
        "Egy világos napirend időkorlátokkal és döntési jegyzőkönyvvel",
        "Hosszabb értekezleti idő",
        "Kevesebb téma"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Értekezlet Hatékonyság",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#meeting-efficiency", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy 1 órás csapat értekezletet kell tervezned egy projekt megközelítésének eldöntéséhez. A lecke szerint mit kellene tartalmaznia?",
      options: [
        "Csak jelenj meg és beszéljétek meg",
        "Egy világos napirend témákkal és időallokációkkal, időkorlátokkal minden szekcióhoz, és egy döntési jegyzőkönyv sablont az eredmények nyomon követéséhez",
        "Csak egy napirend",
        "Csak időkorlátok"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Értekezlet Hatékonyság",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#meeting-efficiency", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy vállalat értekezletei következetesen csúsznak, nincs döntés, ami frusztrációhoz és ismétlődő beszélgetésekhez vezet. A lecke keretrendszere szerint mi a fő probléma?",
      options: [
        "Nincs elég értekezleti idő",
        "Hiányoznak az értekezlet hatékonysági gyakorlatok - hiányzik a napirend, időkorlátok és döntési jegyzőkönyv, amely elszámoltathatóságot és fókuszt teremt",
        "Túl sok résztvevő",
        "Az értekezletek feleslegesek"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Értekezlet Hatékonyság",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#meeting-efficiency", "#advanced", "#critical-thinking", "#hu", "#all-languages"]
    }
  ],
  // Turkish (TR) - Professional translations
  TR: [
    {
      question: "Derse göre toplantı verimliliğinde en önemli olan nedir?",
      options: [
        "Gündem ve zaman sınırı",
        "Uzun konuşmalar",
        "Çok katılımcı",
        "Hazırlık yok"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Toplantı Verimliliği",
      questionType: QuestionType.RECALL,
      hashtags: ["#meeting-efficiency", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre toplantılarda karar günlüğünün birincil amacı nedir?",
      options: [
        "Tüm konuşmaları kaydetmek",
        "Alınan kararları, eylem maddelerini ve sahipleri sorumluluk için takip etmek",
        "Gündemi değiştirmek",
        "Takip ihtiyacını ortadan kaldırmak"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Toplantı Verimliliği",
      questionType: QuestionType.RECALL,
      hashtags: ["#meeting-efficiency", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre toplantı verimliliği için zaman sınırları neden önemlidir?",
      options: [
        "Toplantıları kısaltırlar",
        "Odak yaratırlar, kapsam kaymasını önlerler ve kararların ayrılan süre içinde alınmasını sağlarlar",
        "Gündem ihtiyacını ortadan kaldırırlar",
        "Katılımcı sayısını azaltırlar"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Toplantı Verimliliği",
      questionType: QuestionType.RECALL,
      hashtags: ["#meeting-efficiency", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre toplantı verimliliği neden önemlidir?",
      options: [
        "Tüm toplantıları ortadan kaldırır",
        "Zaman tasarrufu sağlar, kararların alınmasını sağlar, karar günlüğü aracılığıyla sorumluluk yaratır ve kolektif zaman israfını önler",
        "Sadece büyük takımlara uygulanır",
        "Hazırlık gerektirmez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Toplantı Verimliliği",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#meeting-efficiency", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir takım toplantısı 30 dakika gecikir ve net sonuç yok. Derse göre muhtemelen ne eksikti?",
      options: [
        "Daha fazla katılımcı",
        "Zaman sınırları ve karar günlüğü olan net bir gündem",
        "Daha uzun toplantı süresi",
        "Daha az konu"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Toplantı Verimliliği",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#meeting-efficiency", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir proje yaklaşımına karar vermek için 1 saatlik bir takım toplantısı planlamanız gerekiyor. Derse göre ne içermelidir?",
      options: [
        "Sadece gelip tartışmak",
        "Konular ve zaman tahsisleri olan net bir gündem, her bölüm için zaman sınırları ve sonuçları takip etmek için bir karar günlüğü şablonu",
        "Sadece bir gündem",
        "Sadece zaman sınırları"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Toplantı Verimliliği",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#meeting-efficiency", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir şirketin toplantıları sürekli zaman aşımına uğrar ve karar alınmaz, bu da hayal kırıklığına ve tekrarlanan tartışmalara yol açar. Dersin çerçevesine göre temel sorun nedir?",
      options: [
        "Yeterli toplantı süresi yok",
        "Toplantı verimliliği uygulamalarının eksikliği - sorumluluk ve odak yaratan gündem, zaman sınırları ve karar günlüğü eksik",
        "Çok fazla katılımcı",
        "Toplantılar gereksiz"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Toplantı Verimliliği",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#meeting-efficiency", "#advanced", "#critical-thinking", "#tr", "#all-languages"]
    }
  ],
  // Bulgarian (BG) - Professional translations
  BG: [
    {
      question: "Според урока, какво е най-важното в ефективност на срещите?",
      options: [
        "Дневен ред и времеви лимити",
        "Дълги разговори",
        "Много участници",
        "Без подготовка"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Ефективност на срещите",
      questionType: QuestionType.RECALL,
      hashtags: ["#meeting-efficiency", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, каква е основната цел на дневника на решенията в срещите?",
      options: [
        "Да записва всички разговори",
        "Да проследява взетите решения, акционни точки и собственици за отговорност",
        "Да замени дневния ред",
        "Да елиминира необходимостта от последващи действия"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Ефективност на срещите",
      questionType: QuestionType.RECALL,
      hashtags: ["#meeting-efficiency", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, защо времевите лимити са важни за ефективност на срещите?",
      options: [
        "Правят срещите по-кратки",
        "Създават фокус, предотвратяват разширяване на обхвата и осигуряват вземане на решения в рамките на разпределеното време",
        "Елиминират необходимостта от дневен ред",
        "Намаляват броя на участниците"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Ефективност на срещите",
      questionType: QuestionType.RECALL,
      hashtags: ["#meeting-efficiency", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Защо ефективността на срещите е важна според урока?",
      options: [
        "Елиминира всички срещи",
        "Спестява време, осигурява вземане на решения, създава отговорност чрез дневник на решенията и предотвратява изгубено колективно време",
        "Прилага се само за големи екипи",
        "Не изисква подготовка"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Ефективност на срещите",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#meeting-efficiency", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Екипна среща се забавя с 30 минути без ясни резултати. Според урока, какво вероятно липсваше?",
      options: [
        "Повече участници",
        "Ясен дневен ред с времеви лимити и дневник на решенията",
        "По-дълго време за среща",
        "По-малко теми"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Ефективност на срещите",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#meeting-efficiency", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Трябва да планирате 1-часова екипна среща за решаване на подход към проект. Според урока, какво трябва да включите?",
      options: [
        "Просто да се появите и да обсъдите",
        "Ясен дневен ред с теми и времеви разпределения, времеви лимити за всеки раздел и шаблон на дневник на решенията за проследяване на резултатите",
        "Само дневен ред",
        "Само времеви лимити"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Ефективност на срещите",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#meeting-efficiency", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Една компания има срещи, които постоянно се забавят без вземане на решения, водещи до фрустрация и повторени дискусии. Според рамката на урока, какъв е основният проблем?",
      options: [
        "Недостатъчно време за срещи",
        "Липса на практики за ефективност на срещите - липсват дневен ред, времеви лимити и дневник на решенията, които създават отговорност и фокус",
        "Твърде много участници",
        "Срещите са ненужни"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Ефективност на срещите",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#meeting-efficiency", "#advanced", "#critical-thinking", "#bg", "#all-languages"]
    }
  ],
  // Polish (PL) - Professional translations
  PL: [
    {
      question: "Według lekcji, co jest najważniejsze w wydajności spotkań?",
      options: [
        "Porządek obrad i limity czasu",
        "Długie rozmowy",
        "Wielu uczestników",
        "Brak przygotowań"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Wydajność Spotkań",
      questionType: QuestionType.RECALL,
      hashtags: ["#meeting-efficiency", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, jaki jest główny cel dziennika decyzji w spotkaniach?",
      options: [
        "Zapisywanie wszystkich rozmów",
        "Śledzenie podjętych decyzji, punktów akcji i właścicieli w celu odpowiedzialności",
        "Zastąpienie porządku obrad",
        "Eliminacja potrzeby działań następczych"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Wydajność Spotkań",
      questionType: QuestionType.RECALL,
      hashtags: ["#meeting-efficiency", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, dlaczego limity czasu są ważne dla wydajności spotkań?",
      options: [
        "Skracają spotkania",
        "Tworzą skupienie, zapobiegają rozszerzaniu zakresu i zapewniają podejmowanie decyzji w przydzielonym czasie",
        "Eliminują potrzebę porządku obrad",
        "Zmniejszają liczbę uczestników"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Wydajność Spotkań",
      questionType: QuestionType.RECALL,
      hashtags: ["#meeting-efficiency", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Dlaczego wydajność spotkań jest ważna według lekcji?",
      options: [
        "Eliminuje wszystkie spotkania",
        "Oszczędza czas, zapewnia podejmowanie decyzji, tworzy odpowiedzialność poprzez dziennik decyzji i zapobiega marnowaniu zbiorowego czasu",
        "Dotyczy tylko dużych zespołów",
        "Nie wymaga przygotowania"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Wydajność Spotkań",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#meeting-efficiency", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Spotkanie zespołu trwa 30 minut dłużej bez jasnych wyników. Według lekcji, czego prawdopodobnie brakowało?",
      options: [
        "Więcej uczestników",
        "Jasny porządek obrad z limitami czasu i dziennikiem decyzji",
        "Dłuższy czas spotkania",
        "Mniej tematów"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Wydajność Spotkań",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#meeting-efficiency", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Musisz zaplanować 1-godzinne spotkanie zespołu, aby zdecydować o podejściu do projektu. Według lekcji, co powinno zawierać?",
      options: [
        "Po prostu przyjść i omówić",
        "Jasny porządek obrad z tematami i przydziałami czasu, limity czasu dla każdej sekcji i szablon dziennika decyzji do śledzenia wyników",
        "Tylko porządek obrad",
        "Tylko limity czasu"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Wydajność Spotkań",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#meeting-efficiency", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Firma ma spotkania, które konsekwentnie się przedłużają bez podejmowania decyzji, prowadząc do frustracji i powtarzanych dyskusji. Według ram lekcji, jaki jest główny problem?",
      options: [
        "Niewystarczający czas na spotkania",
        "Brak praktyk wydajności spotkań - brakuje porządku obrad, limitów czasu i dziennika decyzji, które tworzą odpowiedzialność i skupienie",
        "Zbyt wielu uczestników",
        "Spotkania są niepotrzebne"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Wydajność Spotkań",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#meeting-efficiency", "#advanced", "#critical-thinking", "#pl", "#all-languages"]
    }
  ],
  // Vietnamese (VI) - Professional translations
  VI: [
    {
      question: "Theo bài học, điều gì quan trọng nhất trong hiệu quả cuộc họp?",
      options: [
        "Chương trình nghị sự và giới hạn thời gian",
        "Cuộc trò chuyện dài",
        "Nhiều người tham gia",
        "Không chuẩn bị"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Hiệu Quả Cuộc Họp",
      questionType: QuestionType.RECALL,
      hashtags: ["#meeting-efficiency", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, mục đích chính của nhật ký quyết định trong cuộc họp là gì?",
      options: [
        "Ghi lại tất cả cuộc trò chuyện",
        "Theo dõi các quyết định đã đưa ra, các mục hành động và chủ sở hữu để trách nhiệm giải trình",
        "Thay thế chương trình nghị sự",
        "Loại bỏ nhu cầu theo dõi"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Hiệu Quả Cuộc Họp",
      questionType: QuestionType.RECALL,
      hashtags: ["#meeting-efficiency", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, tại sao giới hạn thời gian quan trọng đối với hiệu quả cuộc họp?",
      options: [
        "Chúng làm cho cuộc họp ngắn hơn",
        "Chúng tạo tập trung, ngăn chặn mở rộng phạm vi và đảm bảo quyết định được đưa ra trong thời gian phân bổ",
        "Chúng loại bỏ nhu cầu chương trình nghị sự",
        "Chúng giảm số người tham gia"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Hiệu Quả Cuộc Họp",
      questionType: QuestionType.RECALL,
      hashtags: ["#meeting-efficiency", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Tại sao hiệu quả cuộc họp quan trọng theo bài học?",
      options: [
        "Nó loại bỏ tất cả các cuộc họp",
        "Nó tiết kiệm thời gian, đảm bảo quyết định được đưa ra, tạo trách nhiệm giải trình thông qua nhật ký quyết định và ngăn chặn lãng phí thời gian tập thể",
        "Nó chỉ áp dụng cho các nhóm lớn",
        "Nó không yêu cầu chuẩn bị"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Hiệu Quả Cuộc Họp",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#meeting-efficiency", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Một cuộc họp nhóm chạy quá 30 phút mà không có kết quả rõ ràng. Theo bài học, điều gì có thể đã thiếu?",
      options: [
        "Nhiều người tham gia hơn",
        "Một chương trình nghị sự rõ ràng với giới hạn thời gian và nhật ký quyết định",
        "Thời gian họp dài hơn",
        "Ít chủ đề hơn"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Hiệu Quả Cuộc Họp",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#meeting-efficiency", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Bạn cần lập kế hoạch một cuộc họp nhóm 1 giờ để quyết định cách tiếp cận dự án. Theo bài học, nó nên bao gồm những gì?",
      options: [
        "Chỉ xuất hiện và thảo luận",
        "Một chương trình nghị sự rõ ràng với các chủ đề và phân bổ thời gian, giới hạn thời gian cho mỗi phần và một mẫu nhật ký quyết định để theo dõi kết quả",
        "Chỉ một chương trình nghị sự",
        "Chỉ giới hạn thời gian"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Hiệu Quả Cuộc Họp",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#meeting-efficiency", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Một công ty có các cuộc họp liên tục chạy quá thời gian mà không có quyết định, dẫn đến thất vọng và thảo luận lặp lại. Theo khung của bài học, vấn đề cốt lõi là gì?",
      options: [
        "Không đủ thời gian họp",
        "Thiếu các thực hành hiệu quả cuộc họp - thiếu chương trình nghị sự, giới hạn thời gian và nhật ký quyết định tạo trách nhiệm giải trình và tập trung",
        "Quá nhiều người tham gia",
        "Các cuộc họp là không cần thiết"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Hiệu Quả Cuộc Họp",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#meeting-efficiency", "#advanced", "#critical-thinking", "#vi", "#all-languages"]
    }
  ],
  // Indonesian (ID) - Professional translations
  ID: [
    {
      question: "Menurut pelajaran, apa yang paling penting dalam efisiensi pertemuan?",
      options: [
        "Agenda dan batas waktu",
        "Percakapan panjang",
        "Banyak peserta",
        "Tidak ada persiapan"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Efisiensi Pertemuan",
      questionType: QuestionType.RECALL,
      hashtags: ["#meeting-efficiency", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, apa tujuan utama catatan keputusan dalam pertemuan?",
      options: [
        "Mencatat semua percakapan",
        "Melacak keputusan yang dibuat, item tindakan, dan pemilik untuk akuntabilitas",
        "Mengganti agenda",
        "Menghilangkan kebutuhan tindak lanjut"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Efisiensi Pertemuan",
      questionType: QuestionType.RECALL,
      hashtags: ["#meeting-efficiency", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, mengapa batas waktu penting untuk efisiensi pertemuan?",
      options: [
        "Mereka membuat pertemuan lebih pendek",
        "Mereka menciptakan fokus, mencegah perluasan ruang lingkup, dan memastikan keputusan dibuat dalam waktu yang dialokasikan",
        "Mereka menghilangkan kebutuhan agenda",
        "Mereka mengurangi jumlah peserta"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Efisiensi Pertemuan",
      questionType: QuestionType.RECALL,
      hashtags: ["#meeting-efficiency", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Mengapa efisiensi pertemuan penting menurut pelajaran?",
      options: [
        "Ini menghilangkan semua pertemuan",
        "Ini menghemat waktu, memastikan keputusan dibuat, menciptakan akuntabilitas melalui catatan keputusan, dan mencegah pemborosan waktu kolektif",
        "Ini hanya berlaku untuk tim besar",
        "Ini tidak memerlukan persiapan"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Efisiensi Pertemuan",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#meeting-efficiency", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Pertemuan tim berjalan 30 menit lebih lama tanpa hasil yang jelas. Menurut pelajaran, apa yang mungkin kurang?",
      options: [
        "Lebih banyak peserta",
        "Agenda yang jelas dengan batas waktu dan catatan keputusan",
        "Waktu pertemuan lebih lama",
        "Lebih sedikit topik"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Efisiensi Pertemuan",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#meeting-efficiency", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Anda perlu merencanakan pertemuan tim 1 jam untuk memutuskan pendekatan proyek. Menurut pelajaran, apa yang harus disertakan?",
      options: [
        "Hanya muncul dan diskusikan",
        "Agenda yang jelas dengan topik dan alokasi waktu, batas waktu untuk setiap bagian, dan template catatan keputusan untuk melacak hasil",
        "Hanya agenda",
        "Hanya batas waktu"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Efisiensi Pertemuan",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#meeting-efficiency", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Sebuah perusahaan memiliki pertemuan yang konsisten berjalan melebihi waktu tanpa keputusan dibuat, menyebabkan frustrasi dan diskusi berulang. Menurut kerangka pelajaran, apa masalah intinya?",
      options: [
        "Tidak cukup waktu pertemuan",
        "Kurangnya praktik efisiensi pertemuan - agenda, batas waktu, dan catatan keputusan yang menciptakan akuntabilitas dan fokus hilang",
        "Terlalu banyak peserta",
        "Pertemuan tidak perlu"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Efisiensi Pertemuan",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#meeting-efficiency", "#advanced", "#critical-thinking", "#id", "#all-languages"]
    }
  ],
  // Arabic (AR) - Professional translations (RTL)
  AR: [
    {
      question: "وفقًا للدرس، ما هو الأهم في كفاءة الاجتماعات؟",
      options: [
        "جدول الأعمال وحدود الوقت",
        "محادثات طويلة",
        "كثير من المشاركين",
        "لا يوجد تحضير"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "كفاءة الاجتماعات",
      questionType: QuestionType.RECALL,
      hashtags: ["#meeting-efficiency", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، ما هو الهدف الأساسي لسجل القرارات في الاجتماعات؟",
      options: [
        "تسجيل جميع المحادثات",
        "تتبع القرارات المتخذة وعناصر العمل والمالكين للمساءلة",
        "استبدال جدول الأعمال",
        "إلغاء الحاجة للمتابعة"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "كفاءة الاجتماعات",
      questionType: QuestionType.RECALL,
      hashtags: ["#meeting-efficiency", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، لماذا حدود الوقت مهمة لكفاءة الاجتماعات؟",
      options: [
        "تجعل الاجتماعات أقصر",
        "تخلق التركيز، تمنع توسيع النطاق، وتضمن اتخاذ القرارات في الوقت المخصص",
        "تلغي الحاجة لجدول الأعمال",
        "تقلل عدد المشاركين"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "كفاءة الاجتماعات",
      questionType: QuestionType.RECALL,
      hashtags: ["#meeting-efficiency", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "لماذا كفاءة الاجتماعات مهمة وفقًا للدرس؟",
      options: [
        "إنها تلغي جميع الاجتماعات",
        "توفر الوقت، تضمن اتخاذ القرارات، تخلق المساءلة من خلال سجل القرارات، وتمنع إهدار الوقت الجماعي",
        "تنطبق فقط على الفرق الكبيرة",
        "لا تتطلب تحضيرًا"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "كفاءة الاجتماعات",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#meeting-efficiency", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "اجتماع فريق يستمر 30 دقيقة إضافية دون نتائج واضحة. وفقًا للدرس، ما الذي ربما كان مفقودًا؟",
      options: [
        "المزيد من المشاركين",
        "جدول أعمال واضح مع حدود الوقت وسجل القرارات",
        "وقت اجتماع أطول",
        "مواضيع أقل"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "كفاءة الاجتماعات",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#meeting-efficiency", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "تحتاج إلى تخطيط اجتماع فريق لمدة ساعة واحدة لاتخاذ قرار بشأن نهج المشروع. وفقًا للدرس، ماذا يجب أن يتضمن؟",
      options: [
        "فقط الحضور والمناقشة",
        "جدول أعمال واضح مع المواضيع وتوزيعات الوقت، حدود الوقت لكل قسم، وقالب سجل قرارات لتتبع النتائج",
        "فقط جدول الأعمال",
        "فقط حدود الوقت"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "كفاءة الاجتماعات",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#meeting-efficiency", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "شركة لديها اجتماعات تتجاوز الوقت باستمرار دون اتخاذ قرارات، مما يؤدي إلى الإحباط والمناقشات المتكررة. وفقًا لإطار الدرس، ما هي المشكلة الأساسية؟",
      options: [
        "لا يوجد وقت اجتماع كافٍ",
        "نقص ممارسات كفاءة الاجتماعات - جدول الأعمال وحدود الوقت وسجل القرارات التي تخلق المساءلة والتركيز مفقودة",
        "الكثير من المشاركين",
        "الاجتماعات غير ضرورية"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "كفاءة الاجتماعات",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#meeting-efficiency", "#advanced", "#critical-thinking", "#ar", "#all-languages"]
    }
  ],
  // Portuguese (PT) - Professional translations (Brazilian)
  PT: [
    {
      question: "De acordo com a lição, o que é mais importante na eficiência de reuniões?",
      options: [
        "Agenda e limites de tempo",
        "Conversas longas",
        "Muitos participantes",
        "Sem preparação"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Eficiência de Reuniões",
      questionType: QuestionType.RECALL,
      hashtags: ["#meeting-efficiency", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, qual é o propósito principal de um registro de decisões em reuniões?",
      options: [
        "Registrar todas as conversas",
        "Rastrear decisões tomadas, itens de ação e responsáveis para prestação de contas",
        "Substituir a agenda",
        "Eliminar a necessidade de acompanhamento"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Eficiência de Reuniões",
      questionType: QuestionType.RECALL,
      hashtags: ["#meeting-efficiency", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, por que os limites de tempo são importantes para a eficiência de reuniões?",
      options: [
        "Eles tornam as reuniões mais curtas",
        "Criam foco, previnem expansão de escopo e garantem que decisões sejam tomadas no tempo alocado",
        "Eles eliminam a necessidade de agenda",
        "Eles reduzem o número de participantes"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Eficiência de Reuniões",
      questionType: QuestionType.RECALL,
      hashtags: ["#meeting-efficiency", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "Por que a eficiência de reuniões é importante de acordo com a lição?",
      options: [
        "Ela elimina todas as reuniões",
        "Economiza tempo, garante que decisões sejam tomadas, cria prestação de contas através do registro de decisões e previne desperdício de tempo coletivo",
        "Aplica-se apenas a equipes grandes",
        "Não requer preparação"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Eficiência de Reuniões",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#meeting-efficiency", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Uma reunião de equipe dura 30 minutos a mais sem resultados claros. De acordo com a lição, o que provavelmente estava faltando?",
      options: [
        "Mais participantes",
        "Uma agenda clara com limites de tempo e registro de decisões",
        "Tempo de reunião mais longo",
        "Menos tópicos"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Eficiência de Reuniões",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#meeting-efficiency", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Você precisa planejar uma reunião de equipe de 1 hora para decidir sobre uma abordagem de projeto. De acordo com a lição, o que deve incluir?",
      options: [
        "Apenas aparecer e discutir",
        "Uma agenda clara com tópicos e alocações de tempo, limites de tempo para cada seção e um modelo de registro de decisões para rastrear resultados",
        "Apenas uma agenda",
        "Apenas limites de tempo"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Eficiência de Reuniões",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#meeting-efficiency", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Uma empresa tem reuniões que consistentemente ultrapassam o tempo sem decisões tomadas, levando à frustração e discussões repetidas. De acordo com a estrutura da lição, qual é o problema central?",
      options: [
        "Não há tempo suficiente de reunião",
        "Falta de práticas de eficiência de reuniões - agenda, limites de tempo e registro de decisões que criam prestação de contas e foco estão faltando",
        "Muitos participantes",
        "Reuniões são desnecessárias"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Eficiência de Reuniões",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#meeting-efficiency", "#advanced", "#critical-thinking", "#pt", "#all-languages"]
    }
  ],
  // Hindi (HI) - Professional translations
  HI: [
    {
      question: "पाठ के अनुसार, बैठक दक्षता में सबसे महत्वपूर्ण क्या है?",
      options: [
        "एजेंडा और समय सीमा",
        "लंबी बातचीत",
        "कई प्रतिभागी",
        "कोई तैयारी नहीं"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "बैठक दक्षता",
      questionType: QuestionType.RECALL,
      hashtags: ["#meeting-efficiency", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, बैठकों में निर्णय लॉग का प्राथमिक उद्देश्य क्या है?",
      options: [
        "सभी बातचीत रिकॉर्ड करना",
        "लिए गए निर्णयों, कार्य आइटमों और जवाबदेही के लिए मालिकों को ट्रैक करना",
        "एजेंडा को प्रतिस्थापित करना",
        "फॉलो-अप की आवश्यकता को समाप्त करना"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "बैठक दक्षता",
      questionType: QuestionType.RECALL,
      hashtags: ["#meeting-efficiency", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, बैठक दक्षता के लिए समय सीमा क्यों महत्वपूर्ण हैं?",
      options: [
        "वे बैठकों को छोटा बनाते हैं",
        "वे फोकस बनाते हैं, स्कोप क्रीप को रोकते हैं, और सुनिश्चित करते हैं कि निर्णय आवंटित समय के भीतर लिए जाते हैं",
        "वे एजेंडा की आवश्यकता को समाप्त करते हैं",
        "वे प्रतिभागियों की संख्या कम करते हैं"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "बैठक दक्षता",
      questionType: QuestionType.RECALL,
      hashtags: ["#meeting-efficiency", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार बैठक दक्षता क्यों महत्वपूर्ण है?",
      options: [
        "यह सभी बैठकों को समाप्त करती है",
        "यह समय बचाती है, सुनिश्चित करती है कि निर्णय लिए जाते हैं, निर्णय लॉग के माध्यम से जवाबदेही बनाती है, और सामूहिक समय की बर्बादी को रोकती है",
        "यह केवल बड़ी टीमों पर लागू होती है",
        "इसके लिए तैयारी की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "बैठक दक्षता",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#meeting-efficiency", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक टीम बैठक 30 मिनट अधिक चलती है बिना स्पष्ट परिणामों के। पाठ के अनुसार, क्या संभवतः गायब था?",
      options: [
        "अधिक प्रतिभागी",
        "समय सीमा और निर्णय लॉग के साथ एक स्पष्ट एजेंडा",
        "लंबा बैठक समय",
        "कम विषय"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "बैठक दक्षता",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#meeting-efficiency", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "आपको एक परियोजना दृष्टिकोण पर निर्णय लेने के लिए 1 घंटे की टीम बैठक की योजना बनानी है। पाठ के अनुसार, इसमें क्या शामिल होना चाहिए?",
      options: [
        "बस दिखाई दें और चर्चा करें",
        "विषयों और समय आवंटन के साथ एक स्पष्ट एजेंडा, प्रत्येक अनुभाग के लिए समय सीमा, और परिणामों को ट्रैक करने के लिए एक निर्णय लॉग टेम्प्लेट",
        "केवल एक एजेंडा",
        "केवल समय सीमा"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "बैठक दक्षता",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#meeting-efficiency", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक कंपनी की बैठकें लगातार समय से अधिक चलती हैं बिना निर्णय लिए, जिससे निराशा और दोहराई गई चर्चाएं होती हैं। पाठ के ढांचे के अनुसार, मुख्य समस्या क्या है?",
      options: [
        "पर्याप्त बैठक समय नहीं है",
        "बैठक दक्षता प्रथाओं की कमी - एजेंडा, समय सीमा और निर्णय लॉग जो जवाबदेही और फोकस बनाते हैं गायब हैं",
        "बहुत अधिक प्रतिभागी",
        "बैठकें अनावश्यक हैं"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "बैठक दक्षता",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#meeting-efficiency", "#advanced", "#critical-thinking", "#hi", "#all-languages"]
    }
  ]
};

async function seedDay14Enhanced() {
  try {
    await connectDB();
    console.log('🌱 SEEDING DAY 14 ENHANCED QUIZ QUESTIONS\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    let totalQuestions = 0;
    let totalUpdated = 0;
    let totalCreated = 0;

    for (const lang of LANGUAGES) {
      const courseId = `${COURSE_ID_BASE}_${lang}`;
      const lessonId = `${COURSE_ID_BASE}_${lang}_DAY_14`;

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
      const questions = DAY14_QUESTIONS[lang] || DAY14_QUESTIONS['EN']; // Fallback to EN if not translated
      
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
    console.log(`\n✅ DAY 14 ENHANCEMENT COMPLETE!\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedDay14Enhanced();
