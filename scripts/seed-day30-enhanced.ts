/**
 * Seed Day 30 Enhanced Quiz Questions
 * 
 * Purpose: Enhance Day 30 quizzes from 5 to 7 questions across all 10 languages
 * Why: Part of Quiz Quality Enhancement - Phase 1, Day 30
 * 
 * Lesson Topic: The Productivity Master (comprehensive integration, commitment)
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
const DAY_NUMBER = 30;
const LANGUAGES = ['HU', 'EN', 'TR', 'BG', 'PL', 'VI', 'ID', 'AR', 'PT', 'HI'];

/**
 * Day 30 Enhanced Questions - All Languages
 * Topic: The Productivity Master
 * Structure: 7 questions per language
 * Q1-Q3: Recall (foundational concepts)
 * Q4: Application (why integration matters)
 * Q5: Application (scenario-based)
 * Q6: Application (practical implementation)
 * Q7: Critical Thinking (systems integration)
 */
const DAY30_QUESTIONS: Record<string, Array<{
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: QuestionDifficulty;
  category: string;
  questionType: QuestionType;
  hashtags: string[];
}>> = {
  EN: [
    // Q1: Productivity master definition (RECALL)
    {
      question: "According to the lesson, what is a productivity master?",
      options: [
        "Someone who never makes mistakes",
        "Someone who integrates all productivity systems, maintains long-term commitment, and continuously evolves their approach",
        "Only for experts",
        "No structure needed"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#productivity-master", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q2: Comprehensive integration (RECALL)
    {
      question: "According to the lesson, what is comprehensive integration?",
      options: [
        "Only using one system",
        "Connecting all productivity systems (time, energy, attention, goals, habits) into a unified, coherent approach",
        "Only using tools",
        "No structure needed"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Integration & Synthesis",
      questionType: QuestionType.RECALL,
      hashtags: ["#integration", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q3: Long-term commitment (RECALL)
    {
      question: "According to the lesson, why is long-term commitment important for productivity mastery?",
      options: [
        "It's not important",
        "It enables sustained practice, system refinement, and continuous growth over years",
        "It only applies to certain people",
        "It requires no effort"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Personal Development",
      questionType: QuestionType.RECALL,
      hashtags: ["#commitment", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q4: Why mastery matters (APPLICATION)
    {
      question: "Why is becoming a productivity master important according to the lesson?",
      options: [
        "It eliminates all work",
        "It enables comprehensive integration of all systems, sustained commitment, continuous improvement, and long-term fulfillment",
        "It only applies to certain jobs",
        "It requires no planning"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#productivity-master", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q5: Integration scenario (APPLICATION)
    {
      question: "You want to become a productivity master. According to the lesson, what should you do?",
      options: [
        "Just work randomly",
        "Integrate all productivity systems (time, energy, attention, goals, habits), maintain long-term commitment, continuously improve, and reflect on progress",
        "Only use one system",
        "Only set goals"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Integration & Synthesis",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#integration", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q6: Building mastery (APPLICATION)
    {
      question: "You want to maintain productivity mastery over the long term. According to the lesson, what should you establish?",
      options: [
        "Just work randomly",
        "Comprehensive integration of all systems, sustained commitment to practice, continuous improvement through feedback, and regular reflection on progress",
        "Only integration",
        "Only commitment"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Personal Development",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#commitment", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q7: Fragmentation problem solving (CRITICAL THINKING)
    {
      question: "A person has many productivity tools and systems but they don't work together, commitment wavers, and progress is inconsistent. According to the lesson's framework, what is the core issue?",
      options: [
        "Not enough tools",
        "Lack of comprehensive integration and sustained commitment - missing unified approach, long-term practice, and continuous improvement that create mastery",
        "Too much integration",
        "Mastery is unnecessary"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#productivity-master", "#advanced", "#critical-thinking", "#en", "#all-languages"]
    }
  ],
  // Hungarian (HU) - Professional translations
  HU: [
    {
      question: "A lecke szerint mi a termelékenységi mester?",
      options: [
        "Valaki, aki soha nem hibázik",
        "Valaki, aki integrálja az összes termelékenységi rendszert, fenntartja a hosszú távú elkötelezettséget, és folyamatosan fejleszti a megközelítését",
        "Csak szakértőknek",
        "Nincs szükség struktúrára"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#productivity-master", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint mi az átfogó integráció?",
      options: [
        "Csak egy rendszer használata",
        "Az összes termelékenységi rendszer (idő, energia, figyelem, célok, szokások) összekapcsolása egy egységes, koherens megközelítésbe",
        "Csak eszközök használata",
        "Nincs szükség struktúrára"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Integration & Synthesis",
      questionType: QuestionType.RECALL,
      hashtags: ["#integration", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint miért fontos a hosszú távú elkötelezettség a termelékenységi mesteri szinthez?",
      options: [
        "Nem fontos",
        "Lehetővé teszi a fenntartható gyakorlást, rendszerfinomítást, és folyamatos növekedést évekig",
        "Csak bizonyos emberekre vonatkozik",
        "Nem igényel erőfeszítést"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Personal Development",
      questionType: QuestionType.RECALL,
      hashtags: ["#commitment", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "Miért fontos a termelékenységi mesterré válás a lecke szerint?",
      options: [
        "Kiküszöböli az összes munkát",
        "Lehetővé teszi az összes rendszer átfogó integrációját, fenntartható elkötelezettséget, folyamatos fejlesztést, és hosszú távú elégedettséget",
        "Csak bizonyos munkákra vonatkozik",
        "Nem igényel tervezést"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#productivity-master", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Termelékenységi mesterré szeretnél válni. A lecke szerint mit kellene tenned?",
      options: [
        "Csak dolgozz véletlenszerűen",
        "Integrálj minden termelékenységi rendszert (idő, energia, figyelem, célok, szokások), fenntartsd a hosszú távú elkötelezettséget, folyamatosan fejleszd, és gondolkodj a haladáson",
        "Csak egy rendszert használj",
        "Csak állíts be célokat"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Integration & Synthesis",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#integration", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Hosszú távon szeretnéd fenntartani a termelékenységi mesteri szintet. A lecke szerint mit kellene létrehozni?",
      options: [
        "Csak dolgozz véletlenszerűen",
        "Az összes rendszer átfogó integrációja, fenntartható elkötelezettség a gyakorláshoz, folyamatos fejlesztés visszajelzésen keresztül, és rendszeres elmélkedés a haladáson",
        "Csak integráció",
        "Csak elkötelezettség"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Personal Development",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#commitment", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy személynek sok termelékenységi eszköze és rendszere van, de nem működnek együtt, az elkötelezettség ingadozik, és a haladás következetlen. A lecke keretrendszere szerint mi a fő probléma?",
      options: [
        "Nincs elég eszköz",
        "Hiányzik az átfogó integráció és a fenntartható elkötelezettség - hiányzik az egységes megközelítés, hosszú távú gyakorlás, és folyamatos fejlesztés, amely mesteri szintet hoz létre",
        "Túl sok integráció",
        "A mesteri szint felesleges"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#productivity-master", "#advanced", "#critical-thinking", "#hu", "#all-languages"]
    }
  ],
  // Turkish (TR) - Professional translations
  TR: [
    {
      question: "Derse göre verimlilik ustası nedir?",
      options: [
        "Asla hata yapmayan biri",
        "Tüm verimlilik sistemlerini entegre eden, uzun vadeli taahhüdü sürdüren ve yaklaşımını sürekli geliştiren biri",
        "Sadece uzmanlar için",
        "Yapıya gerek yok"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#productivity-master", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre kapsamlı entegrasyon nedir?",
      options: [
        "Sadece bir sistem kullanmak",
        "Tüm verimlilik sistemlerini (zaman, enerji, dikkat, hedefler, alışkanlıklar) birleşik, tutarlı bir yaklaşıma bağlamak",
        "Sadece araçlar kullanmak",
        "Yapıya gerek yok"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Integration & Synthesis",
      questionType: QuestionType.RECALL,
      hashtags: ["#integration", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre uzun vadeli taahhüt neden verimlilik ustalığı için önemlidir?",
      options: [
        "Önemli değil",
        "Sürdürülebilir pratik, sistem iyileştirme ve yıllar boyunca sürekli büyümeyi sağlar",
        "Sadece belirli insanlar için geçerli",
        "Çaba gerektirmez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Personal Development",
      questionType: QuestionType.RECALL,
      hashtags: ["#commitment", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre verimlilik ustası olmak neden önemlidir?",
      options: [
        "Tüm işi ortadan kaldırır",
        "Tüm sistemlerin kapsamlı entegrasyonunu, sürdürülebilir taahhüdü, sürekli iyileştirmeyi ve uzun vadeli memnuniyeti sağlar",
        "Sadece belirli işler için geçerli",
        "Planlama gerektirmez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#productivity-master", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Verimlilik ustası olmak istiyorsunuz. Derse göre ne yapmalısınız?",
      options: [
        "Sadece rastgele çalış",
        "Tüm verimlilik sistemlerini (zaman, enerji, dikkat, hedefler, alışkanlıklar) entegre et, uzun vadeli taahhüdü sürdür, sürekli geliştir ve ilerlemeyi yansıt",
        "Sadece bir sistem kullan",
        "Sadece hedefler belirle"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Integration & Synthesis",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#integration", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Verimlilik ustalığını uzun vadede sürdürmek istiyorsunuz. Derse göre ne kurmalısınız?",
      options: [
        "Sadece rastgele çalış",
        "Tüm sistemlerin kapsamlı entegrasyonu, pratik için sürdürülebilir taahhüt, geri bildirim yoluyla sürekli iyileştirme ve ilerleme üzerine düzenli yansıtma",
        "Sadece entegrasyon",
        "Sadece taahhüt"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Personal Development",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#commitment", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir kişinin birçok verimlilik aracı ve sistemi var ancak birlikte çalışmıyorlar, taahhüt dalgalanıyor ve ilerleme tutarsız. Dersin çerçevesine göre temel sorun nedir?",
      options: [
        "Yeterli araç yok",
        "Kapsamlı entegrasyon ve sürdürülebilir taahhüt eksikliği - ustalık yaratan birleşik yaklaşım, uzun vadeli pratik ve sürekli iyileştirme eksik",
        "Çok fazla entegrasyon",
        "Ustalık gereksiz"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#productivity-master", "#advanced", "#critical-thinking", "#tr", "#all-languages"]
    }
  ],
  // Bulgarian (BG) - Professional translations
  BG: [
    {
      question: "Според урока какво е майстор на производителността?",
      options: [
        "Някой, който никога не прави грешки",
        "Някой, който интегрира всички системи за производителност, поддържа дългосрочно ангажиране и непрекъснато развива подхода си",
        "Само за експерти",
        "Няма нужда от структура"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#productivity-master", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока какво е цялостна интеграция?",
      options: [
        "Използване само на една система",
        "Свързване на всички системи за производителност (време, енергия, внимание, цели, навици) в единен, последователен подход",
        "Използване само на инструменти",
        "Няма нужда от структура"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Integration & Synthesis",
      questionType: QuestionType.RECALL,
      hashtags: ["#integration", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока защо е важно дългосрочното ангажиране за майсторство в производителността?",
      options: [
        "Не е важно",
        "Позволява устойчива практика, усъвършенстване на системата и непрекъснат растеж през годините",
        "Прилага се само за определени хора",
        "Не изисква усилие"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Personal Development",
      questionType: QuestionType.RECALL,
      hashtags: ["#commitment", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Защо е важно да станеш майстор на производителността според урока?",
      options: [
        "Елиминира цялата работа",
        "Позволява цялостна интеграция на всички системи, устойчиво ангажиране, непрекъснато подобрение и дългосрочно удовлетворение",
        "Прилага се само за определени работи",
        "Не изисква планиране"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#productivity-master", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Искаш да станеш майстор на производителността. Според урока какво трябва да направиш?",
      options: [
        "Просто работи на случаен принцип",
        "Интегрирай всички системи за производителност (време, енергия, внимание, цели, навици), поддържай дългосрочно ангажиране, непрекъснато подобрявай и размишлявай върху напредъка",
        "Използвай само една система",
        "Само определяй цели"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Integration & Synthesis",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#integration", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Искаш да поддържаш майсторство в производителността дългосрочно. Според урока какво трябва да установиш?",
      options: [
        "Просто работи на случаен принцип",
        "Цялостна интеграция на всички системи, устойчиво ангажиране за практика, непрекъснато подобрение чрез обратна връзка и редовно размишление върху напредъка",
        "Само интеграция",
        "Само ангажиране"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Personal Development",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#commitment", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Един човек има много инструменти и системи за производителност, но те не работят заедно, ангажирането се колебае и напредъкът е непоследователен. Според рамката на урока какъв е основният проблем?",
      options: [
        "Няма достатъчно инструменти",
        "Липса на цялостна интеграция и устойчиво ангажиране - липсва единен подход, дългосрочна практика и непрекъснато подобрение, които създават майсторство",
        "Твърде много интеграция",
        "Майсторството е ненужно"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#productivity-master", "#advanced", "#critical-thinking", "#bg", "#all-languages"]
    }
  ],
  // Polish (PL) - Professional translations
  PL: [
    {
      question: "Według lekcji kim jest mistrz produktywności?",
      options: [
        "Ktoś, kto nigdy nie popełnia błędów",
        "Ktoś, kto integruje wszystkie systemy produktywności, utrzymuje długoterminowe zaangażowanie i ciągle rozwija swoje podejście",
        "Tylko dla ekspertów",
        "Nie potrzeba struktury"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#productivity-master", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji czym jest kompleksowa integracja?",
      options: [
        "Używanie tylko jednego systemu",
        "Łączenie wszystkich systemów produktywności (czas, energia, uwaga, cele, nawyki) w jednolite, spójne podejście",
        "Używanie tylko narzędzi",
        "Nie potrzeba struktury"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Integration & Synthesis",
      questionType: QuestionType.RECALL,
      hashtags: ["#integration", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji dlaczego długoterminowe zaangażowanie jest ważne dla mistrzostwa produktywności?",
      options: [
        "Nie jest ważne",
        "Umożliwia trwałą praktykę, doskonalenie systemu i ciągły rozwój przez lata",
        "Dotyczy tylko określonych osób",
        "Nie wymaga wysiłku"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Personal Development",
      questionType: QuestionType.RECALL,
      hashtags: ["#commitment", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji dlaczego zostanie mistrzem produktywności jest ważne?",
      options: [
        "Eliminuje całą pracę",
        "Umożliwia kompleksową integrację wszystkich systemów, trwałe zaangażowanie, ciągłe doskonalenie i długoterminowe spełnienie",
        "Dotyczy tylko określonych prac",
        "Nie wymaga planowania"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#productivity-master", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Chcesz zostać mistrzem produktywności. Według lekcji co powinieneś zrobić?",
      options: [
        "Po prostu pracuj losowo",
        "Zintegruj wszystkie systemy produktywności (czas, energia, uwaga, cele, nawyki), utrzymuj długoterminowe zaangażowanie, ciągle doskonal i refleksyjnie myśl o postępie",
        "Używaj tylko jednego systemu",
        "Tylko wyznaczaj cele"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Integration & Synthesis",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#integration", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Chcesz utrzymać mistrzostwo produktywności długoterminowo. Według lekcji co powinieneś ustanowić?",
      options: [
        "Po prostu pracuj losowo",
        "Kompleksowa integracja wszystkich systemów, trwałe zaangażowanie w praktykę, ciągłe doskonalenie poprzez informacje zwrotne i regularna refleksja nad postępem",
        "Tylko integracja",
        "Tylko zaangażowanie"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Personal Development",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#commitment", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Osoba ma wiele narzędzi i systemów produktywności, ale nie działają razem, zaangażowanie się waha, a postęp jest niespójny. Według ram lekcji jaki jest główny problem?",
      options: [
        "Niewystarczająca liczba narzędzi",
        "Brak kompleksowej integracji i trwałego zaangażowania - brakuje jednolitego podejścia, długoterminowej praktyki i ciągłego doskonalenia, które tworzą mistrzostwo",
        "Zbyt dużo integracji",
        "Mistrzostwo jest niepotrzebne"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#productivity-master", "#advanced", "#critical-thinking", "#pl", "#all-languages"]
    }
  ],
  // Vietnamese (VI) - Professional translations
  VI: [
    {
      question: "Theo bài học, bậc thầy năng suất là gì?",
      options: [
        "Người không bao giờ mắc lỗi",
        "Người tích hợp tất cả các hệ thống năng suất, duy trì cam kết dài hạn, và liên tục phát triển cách tiếp cận của họ",
        "Chỉ dành cho chuyên gia",
        "Không cần cấu trúc"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#productivity-master", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, tích hợp toàn diện là gì?",
      options: [
        "Chỉ sử dụng một hệ thống",
        "Kết nối tất cả các hệ thống năng suất (thời gian, năng lượng, sự chú ý, mục tiêu, thói quen) thành một cách tiếp cận thống nhất, mạch lạc",
        "Chỉ sử dụng công cụ",
        "Không cần cấu trúc"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Integration & Synthesis",
      questionType: QuestionType.RECALL,
      hashtags: ["#integration", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, tại sao cam kết dài hạn quan trọng đối với bậc thầy năng suất?",
      options: [
        "Không quan trọng",
        "Cho phép thực hành bền vững, tinh chỉnh hệ thống, và tăng trưởng liên tục qua nhiều năm",
        "Chỉ áp dụng cho một số người nhất định",
        "Không cần nỗ lực"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Personal Development",
      questionType: QuestionType.RECALL,
      hashtags: ["#commitment", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Tại sao trở thành bậc thầy năng suất quan trọng theo bài học?",
      options: [
        "Loại bỏ tất cả công việc",
        "Cho phép tích hợp toàn diện tất cả các hệ thống, cam kết bền vững, cải thiện liên tục, và thỏa mãn dài hạn",
        "Chỉ áp dụng cho một số công việc nhất định",
        "Không cần lập kế hoạch"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#productivity-master", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Bạn muốn trở thành bậc thầy năng suất. Theo bài học, bạn nên làm gì?",
      options: [
        "Chỉ làm việc ngẫu nhiên",
        "Tích hợp tất cả các hệ thống năng suất (thời gian, năng lượng, sự chú ý, mục tiêu, thói quen), duy trì cam kết dài hạn, liên tục cải thiện, và suy ngẫm về tiến trình",
        "Chỉ sử dụng một hệ thống",
        "Chỉ đặt mục tiêu"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Integration & Synthesis",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#integration", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Bạn muốn duy trì bậc thầy năng suất trong dài hạn. Theo bài học, bạn nên thiết lập gì?",
      options: [
        "Chỉ làm việc ngẫu nhiên",
        "Tích hợp toàn diện tất cả các hệ thống, cam kết bền vững để thực hành, cải thiện liên tục thông qua phản hồi, và suy ngẫm thường xuyên về tiến trình",
        "Chỉ tích hợp",
        "Chỉ cam kết"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Personal Development",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#commitment", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Một người có nhiều công cụ và hệ thống năng suất nhưng chúng không hoạt động cùng nhau, cam kết dao động, và tiến trình không nhất quán. Theo khung của bài học, vấn đề cốt lõi là gì?",
      options: [
        "Không đủ công cụ",
        "Thiếu tích hợp toàn diện và cam kết bền vững - thiếu cách tiếp cận thống nhất, thực hành dài hạn, và cải thiện liên tục tạo ra bậc thầy",
        "Quá nhiều tích hợp",
        "Bậc thầy là không cần thiết"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#productivity-master", "#advanced", "#critical-thinking", "#vi", "#all-languages"]
    }
  ],
  // Indonesian (ID) - Professional translations
  ID: [
    {
      question: "Menurut pelajaran, apa itu master produktivitas?",
      options: [
        "Seseorang yang tidak pernah membuat kesalahan",
        "Seseorang yang mengintegrasikan semua sistem produktivitas, mempertahankan komitmen jangka panjang, dan terus mengembangkan pendekatan mereka",
        "Hanya untuk ahli",
        "Tidak perlu struktur"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#productivity-master", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, apa itu integrasi komprehensif?",
      options: [
        "Hanya menggunakan satu sistem",
        "Menghubungkan semua sistem produktivitas (waktu, energi, perhatian, tujuan, kebiasaan) menjadi pendekatan yang terpadu dan koheren",
        "Hanya menggunakan alat",
        "Tidak perlu struktur"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Integration & Synthesis",
      questionType: QuestionType.RECALL,
      hashtags: ["#integration", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, mengapa komitmen jangka panjang penting untuk penguasaan produktivitas?",
      options: [
        "Tidak penting",
        "Memungkinkan praktik berkelanjutan, penyempurnaan sistem, dan pertumbuhan berkelanjutan selama bertahun-tahun",
        "Hanya berlaku untuk orang tertentu",
        "Tidak memerlukan usaha"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Personal Development",
      questionType: QuestionType.RECALL,
      hashtags: ["#commitment", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Mengapa menjadi master produktivitas penting menurut pelajaran?",
      options: [
        "Menghilangkan semua pekerjaan",
        "Memungkinkan integrasi komprehensif semua sistem, komitmen berkelanjutan, perbaikan berkelanjutan, dan pemenuhan jangka panjang",
        "Hanya berlaku untuk pekerjaan tertentu",
        "Tidak memerlukan perencanaan"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#productivity-master", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Anda ingin menjadi master produktivitas. Menurut pelajaran, apa yang harus Anda lakukan?",
      options: [
        "Hanya bekerja secara acak",
        "Integrasikan semua sistem produktivitas (waktu, energi, perhatian, tujuan, kebiasaan), pertahankan komitmen jangka panjang, terus tingkatkan, dan renungkan kemajuan",
        "Hanya gunakan satu sistem",
        "Hanya tetapkan tujuan"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Integration & Synthesis",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#integration", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Anda ingin mempertahankan penguasaan produktivitas dalam jangka panjang. Menurut pelajaran, apa yang harus Anda dirikan?",
      options: [
        "Hanya bekerja secara acak",
        "Integrasi komprehensif semua sistem, komitmen berkelanjutan untuk praktik, perbaikan berkelanjutan melalui umpan balik, dan refleksi teratur tentang kemajuan",
        "Hanya integrasi",
        "Hanya komitmen"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Personal Development",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#commitment", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Seseorang memiliki banyak alat dan sistem produktivitas tetapi tidak bekerja bersama, komitmen berfluktuasi, dan kemajuan tidak konsisten. Menurut kerangka pelajaran, apa masalah intinya?",
      options: [
        "Tidak cukup alat",
        "Kurangnya integrasi komprehensif dan komitmen berkelanjutan - kehilangan pendekatan terpadu, praktik jangka panjang, dan perbaikan berkelanjutan yang menciptakan penguasaan",
        "Terlalu banyak integrasi",
        "Penguasaan tidak perlu"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#productivity-master", "#advanced", "#critical-thinking", "#id", "#all-languages"]
    }
  ],
  // Arabic (AR) - Professional translations
  AR: [
    {
      question: "وفقًا للدرس، ما هو سيد الإنتاجية؟",
      options: [
        "شخص لا يرتكب أخطاء أبدًا",
        "شخص يدمج جميع أنظمة الإنتاجية، يحافظ على الالتزام طويل الأجل، ويطور باستمرار نهجه",
        "للخبراء فقط",
        "لا حاجة للهيكل"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#productivity-master", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، ما هو التكامل الشامل؟",
      options: [
        "استخدام نظام واحد فقط",
        "ربط جميع أنظمة الإنتاجية (الوقت، الطاقة، الانتباه، الأهداف، العادات) في نهج موحد ومتماسك",
        "استخدام الأدوات فقط",
        "لا حاجة للهيكل"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Integration & Synthesis",
      questionType: QuestionType.RECALL,
      hashtags: ["#integration", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، لماذا الالتزام طويل الأجل مهم لإتقان الإنتاجية؟",
      options: [
        "ليس مهمًا",
        "يسمح بالممارسة المستدامة وتحسين النظام والنمو المستمر على مر السنين",
        "ينطبق فقط على أشخاص معينين",
        "لا يتطلب جهدًا"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Personal Development",
      questionType: QuestionType.RECALL,
      hashtags: ["#commitment", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "لماذا أن تصبح سيد الإنتاجية مهم وفقًا للدرس؟",
      options: [
        "يقضي على كل العمل",
        "يسمح بالتكامل الشامل لجميع الأنظمة، الالتزام المستدام، التحسين المستمر، والوفاء طويل الأجل",
        "ينطبق فقط على وظائف معينة",
        "لا يتطلب تخطيطًا"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#productivity-master", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "تريد أن تصبح سيد الإنتاجية. وفقًا للدرس، ماذا يجب أن تفعل؟",
      options: [
        "فقط اعمل بشكل عشوائي",
        "ادمج جميع أنظمة الإنتاجية (الوقت، الطاقة، الانتباه، الأهداف، العادات)، حافظ على الالتزام طويل الأجل، حسّن باستمرار، وفكر في التقدم",
        "استخدم نظامًا واحدًا فقط",
        "فقط حدد الأهداف"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Integration & Synthesis",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#integration", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "تريد الحفاظ على إتقان الإنتاجية على المدى الطويل. وفقًا للدرس، ما الذي يجب أن تنشئه؟",
      options: [
        "فقط اعمل بشكل عشوائي",
        "التكامل الشامل لجميع الأنظمة، الالتزام المستدام للممارسة، التحسين المستمر من خلال التغذية الراجعة، والتفكير المنتظم في التقدم",
        "فقط التكامل",
        "فقط الالتزام"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Personal Development",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#commitment", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "شخص لديه العديد من أدوات وأنظمة الإنتاجية لكنها لا تعمل معًا، الالتزام يتذبذب، والتقدم غير متسق. وفقًا لإطار الدرس، ما هي المشكلة الأساسية؟",
      options: [
        "لا توجد أدوات كافية",
        "نقص التكامل الشامل والالتزام المستدام - فقدان النهج الموحد، الممارسة طويلة الأجل، والتحسين المستمر الذي يخلق الإتقان",
        "الكثير من التكامل",
        "الإتقان غير ضروري"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#productivity-master", "#advanced", "#critical-thinking", "#ar", "#all-languages"]
    }
  ],
  // Portuguese (PT) - Professional translations
  PT: [
    {
      question: "De acordo com a lição, o que é um mestre de produtividade?",
      options: [
        "Alguém que nunca comete erros",
        "Alguém que integra todos os sistemas de produtividade, mantém compromisso de longo prazo e evolui continuamente sua abordagem",
        "Apenas para especialistas",
        "Não precisa de estrutura"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#productivity-master", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, o que é integração abrangente?",
      options: [
        "Usar apenas um sistema",
        "Conectar todos os sistemas de produtividade (tempo, energia, atenção, metas, hábitos) em uma abordagem unificada e coerente",
        "Usar apenas ferramentas",
        "Não precisa de estrutura"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Integration & Synthesis",
      questionType: QuestionType.RECALL,
      hashtags: ["#integration", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, por que o compromisso de longo prazo é importante para o domínio da produtividade?",
      options: [
        "Não é importante",
        "Permite prática sustentada, refinamento do sistema e crescimento contínuo ao longo dos anos",
        "Aplica-se apenas a pessoas específicas",
        "Não requer esforço"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Personal Development",
      questionType: QuestionType.RECALL,
      hashtags: ["#commitment", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "Por que se tornar um mestre de produtividade é importante de acordo com a lição?",
      options: [
        "Elimina todo o trabalho",
        "Permite integração abrangente de todos os sistemas, compromisso sustentado, melhoria contínua e realização de longo prazo",
        "Aplica-se apenas a trabalhos específicos",
        "Não requer planejamento"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#productivity-master", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Você quer se tornar um mestre de produtividade. De acordo com a lição, o que você deve fazer?",
      options: [
        "Apenas trabalhe aleatoriamente",
        "Integre todos os sistemas de produtividade (tempo, energia, atenção, metas, hábitos), mantenha compromisso de longo prazo, melhore continuamente e reflita sobre o progresso",
        "Use apenas um sistema",
        "Apenas defina metas"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Integration & Synthesis",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#integration", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Você quer manter o domínio da produtividade a longo prazo. De acordo com a lição, o que você deve estabelecer?",
      options: [
        "Apenas trabalhe aleatoriamente",
        "Integração abrangente de todos os sistemas, compromisso sustentado para prática, melhoria contínua através de feedback e reflexão regular sobre o progresso",
        "Apenas integração",
        "Apenas compromisso"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Personal Development",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#commitment", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Uma pessoa tem muitas ferramentas e sistemas de produtividade, mas eles não funcionam juntos, o compromisso oscila e o progresso é inconsistente. De acordo com a estrutura da lição, qual é o problema central?",
      options: [
        "Não há ferramentas suficientes",
        "Falta de integração abrangente e compromisso sustentado - falta abordagem unificada, prática de longo prazo e melhoria contínua que criam domínio",
        "Muita integração",
        "Domínio é desnecessário"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#productivity-master", "#advanced", "#critical-thinking", "#pt", "#all-languages"]
    }
  ],
  // Hindi (HI) - Professional translations
  HI: [
    {
      question: "पाठ के अनुसार, उत्पादकता का मास्टर क्या है?",
      options: [
        "कोई व्यक्ति जो कभी गलती नहीं करता",
        "कोई व्यक्ति जो सभी उत्पादकता सिस्टम को एकीकृत करता है, दीर्घकालिक प्रतिबद्धता बनाए रखता है, और लगातार अपने दृष्टिकोण को विकसित करता है",
        "केवल विशेषज्ञों के लिए",
        "संरचना की आवश्यकता नहीं"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#productivity-master", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, व्यापक एकीकरण क्या है?",
      options: [
        "केवल एक सिस्टम का उपयोग करना",
        "सभी उत्पादकता सिस्टम (समय, ऊर्जा, ध्यान, लक्ष्य, आदतें) को एक एकीकृत, सुसंगत दृष्टिकोण में जोड़ना",
        "केवल उपकरणों का उपयोग करना",
        "संरचना की आवश्यकता नहीं"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Integration & Synthesis",
      questionType: QuestionType.RECALL,
      hashtags: ["#integration", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, उत्पादकता में महारत के लिए दीर्घकालिक प्रतिबद्धता क्यों महत्वपूर्ण है?",
      options: [
        "महत्वपूर्ण नहीं है",
        "यह स्थायी अभ्यास, सिस्टम परिष्करण, और वर्षों तक निरंतर वृद्धि को सक्षम बनाता है",
        "केवल विशिष्ट लोगों पर लागू होता है",
        "कोई प्रयास की आवश्यकता नहीं"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Personal Development",
      questionType: QuestionType.RECALL,
      hashtags: ["#commitment", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार उत्पादकता का मास्टर बनना क्यों महत्वपूर्ण है?",
      options: [
        "सभी काम को समाप्त करता है",
        "यह सभी सिस्टम के व्यापक एकीकरण, स्थायी प्रतिबद्धता, निरंतर सुधार, और दीर्घकालिक पूर्ति को सक्षम बनाता है",
        "केवल विशिष्ट नौकरियों पर लागू होता है",
        "योजना की आवश्यकता नहीं"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#productivity-master", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "आप उत्पादकता का मास्टर बनना चाहते हैं। पाठ के अनुसार, आपको क्या करना चाहिए?",
      options: [
        "बस यादृच्छिक रूप से काम करें",
        "सभी उत्पादकता सिस्टम (समय, ऊर्जा, ध्यान, लक्ष्य, आदतें) को एकीकृत करें, दीर्घकालिक प्रतिबद्धता बनाए रखें, लगातार सुधार करें, और प्रगति पर विचार करें",
        "केवल एक सिस्टम का उपयोग करें",
        "केवल लक्ष्य निर्धारित करें"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Integration & Synthesis",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#integration", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "आप दीर्घकाल में उत्पादकता में महारत बनाए रखना चाहते हैं। पाठ के अनुसार, आपको क्या स्थापित करना चाहिए?",
      options: [
        "बस यादृच्छिक रूप से काम करें",
        "सभी सिस्टम का व्यापक एकीकरण, अभ्यास के लिए स्थायी प्रतिबद्धता, फीडबैक के माध्यम से निरंतर सुधार, और प्रगति पर नियमित चिंतन",
        "केवल एकीकरण",
        "केवल प्रतिबद्धता"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Personal Development",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#commitment", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "किसी व्यक्ति के पास कई उत्पादकता उपकरण और सिस्टम हैं लेकिन वे एक साथ काम नहीं करते, प्रतिबद्धता में उतार-चढ़ाव होता है, और प्रगति असंगत है। पाठ के ढांचे के अनुसार, मुख्य समस्या क्या है?",
      options: [
        "पर्याप्त उपकरण नहीं हैं",
        "व्यापक एकीकरण और स्थायी प्रतिबद्धता की कमी - एकीकृत दृष्टिकोण, दीर्घकालिक अभ्यास, और निरंतर सुधार की कमी जो महारत बनाता है",
        "बहुत अधिक एकीकरण",
        "महारत अनावश्यक है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#productivity-master", "#advanced", "#critical-thinking", "#hi", "#all-languages"]
    }
  ]
};

async function seedDay30Enhanced() {
  try {
    await connectDB();
    console.log('🌱 SEEDING DAY 30 ENHANCED QUIZ QUESTIONS\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    let totalQuestions = 0;
    let totalUpdated = 0;
    let totalCreated = 0;

    for (const lang of LANGUAGES) {
      const courseId = `${COURSE_ID_BASE}_${lang}`;
      const lessonId = `${COURSE_ID_BASE}_${lang}_DAY_30`;

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
      const questions = DAY30_QUESTIONS[lang];
      
      if (!questions || questions.length === 0) {
        console.error(`   ❌ ERROR: No questions defined for ${lang}! Questions MUST be in course language.`);
        throw new Error(`Missing translations for ${lang} - Day 30 questions must be in course language, not English fallback`);
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
    console.log(`\n✅ DAY 30 ENHANCEMENT COMPLETE!\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedDay30Enhanced();
