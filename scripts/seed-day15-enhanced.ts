/**
 * Seed Day 15 Enhanced Quiz Questions
 * 
 * Purpose: Enhance Day 15 quizzes from 5 to 7 questions across all 10 languages
 * Why: Part of Quiz Quality Enhancement - Phase 1, Day 15
 * 
 * Lesson Topic: Teamwork and Synergy (roles, responsibility, coordination)
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
const DAY_NUMBER = 15;
const LANGUAGES = ['HU', 'EN', 'TR', 'BG', 'PL', 'VI', 'ID', 'AR', 'PT', 'HI'];

/**
 * Day 15 Enhanced Questions - All Languages
 * Topic: Teamwork and Synergy
 * Structure: 7 questions per language
 * Q1-Q3: Keep (Recall - foundational concepts)
 * Q4: Rewritten (Application - from definition to purpose)
 * Q5: Keep (Application - scenario-based)
 * Q6: New (Application - practical implementation)
 * Q7: New (Critical Thinking - systems integration)
 */
const DAY15_QUESTIONS: Record<string, Array<{
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: QuestionDifficulty;
  category: string;
  questionType: QuestionType;
  hashtags: string[];
}>> = {
  EN: [
    // Q1: Synergy definition (RECALL)
    {
      question: "According to the lesson, what is 'synergy' in teamwork?",
      options: [
        "Working alone",
        "The combined effect is greater than the sum of individual efforts",
        "Dividing work equally",
        "Having the same skills"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Teamwork",
      questionType: QuestionType.RECALL,
      hashtags: ["#teamwork", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q2: Role clarity importance (RECALL)
    {
      question: "According to the lesson, why is role clarity important in teams?",
      options: [
        "It eliminates communication",
        "It prevents overlap, reduces confusion, and ensures accountability",
        "It makes teams smaller",
        "It only applies to large teams"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Teamwork",
      questionType: QuestionType.RECALL,
      hashtags: ["#teamwork", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q3: Coordination methods (RECALL)
    {
      question: "According to the lesson, what is essential for effective team coordination?",
      options: [
        "Working in isolation",
        "Clear communication, shared goals, and regular check-ins",
        "Having no deadlines",
        "Avoiding collaboration"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Teamwork",
      questionType: QuestionType.RECALL,
      hashtags: ["#teamwork", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q4: Why teamwork matters (APPLICATION - Rewritten)
    {
      question: "Why is effective teamwork important according to the lesson?",
      options: [
        "It eliminates individual work",
        "It creates synergy (greater results than sum of parts), leverages diverse strengths, and accelerates progress through coordination",
        "It only applies to large projects",
        "It requires no structure"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Teamwork",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#teamwork", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q5: Role conflict scenario (APPLICATION - Keep)
    {
      question: "A team has overlapping responsibilities causing confusion and missed deadlines. According to the lesson, what is likely missing?",
      options: [
        "More team members",
        "Clear role definitions and responsibility assignments",
        "Less communication",
        "Individual work only"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Teamwork",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#teamwork", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q6: Building effective team (APPLICATION - New)
    {
      question: "You need to form a team for a 3-month project. According to the lesson, what should you establish?",
      options: [
        "Just assign tasks randomly",
        "Clear roles for each member, defined responsibilities, communication protocols, and regular coordination checkpoints",
        "Only roles",
        "Only communication"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Teamwork",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#teamwork", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q7: Team dysfunction analysis (CRITICAL THINKING - New)
    {
      question: "A team consistently misses deadlines, has unclear ownership, and members blame each other. According to the lesson's framework, what is the core issue?",
      options: [
        "Not enough team members",
        "Lack of teamwork fundamentals - missing role clarity, responsibility definitions, and coordination systems that create synergy and accountability",
        "Too much communication",
        "Teams are unnecessary"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Teamwork",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#teamwork", "#advanced", "#critical-thinking", "#en", "#all-languages"]
    }
  ],
  // Hungarian (HU) - Professional translations
  HU: [
    {
      question: "A lecke szerint mi a 'szinergia' a csapatmunkában?",
      options: [
        "Egyedül dolgozni",
        "A kombinált hatás nagyobb, mint az egyéni erőfeszítések összege",
        "A munka egyenlő elosztása",
        "Ugyanazok a készségek"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Csapatmunka",
      questionType: QuestionType.RECALL,
      hashtags: ["#teamwork", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint miért fontos a szerep egyértelműsége a csapatokban?",
      options: [
        "Kiküszöböli a kommunikációt",
        "Megelőzi az átfedést, csökkenti a zavart, és biztosítja az elszámoltathatóságot",
        "Kisebbé teszi a csapatokat",
        "Csak nagy csapatokra vonatkozik"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Csapatmunka",
      questionType: QuestionType.RECALL,
      hashtags: ["#teamwork", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint mi elengedhetetlen a hatékony csapatkoordinációhoz?",
      options: [
        "Elszigetelten dolgozni",
        "Világos kommunikáció, közös célok és rendszeres ellenőrzések",
        "Nincs határidő",
        "A kollaboráció elkerülése"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Csapatmunka",
      questionType: QuestionType.RECALL,
      hashtags: ["#teamwork", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "Miért fontos a hatékony csapatmunka a lecke szerint?",
      options: [
        "Kiküszöböli az egyéni munkát",
        "Szinergiát teremt (nagyobb eredmények, mint a részek összege), kihasználja a különböző erősségeket, és felgyorsítja a haladást a koordináción keresztül",
        "Csak nagy projektekre vonatkozik",
        "Nem igényel struktúrát"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Csapatmunka",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#teamwork", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy csapatnak átfedő felelősségei vannak, ami zavart és lemaradó határidőket okoz. A lecke szerint mi hiányzik valószínűleg?",
      options: [
        "Több csapattag",
        "Világos szerepdefiníciók és felelősségi kiosztások",
        "Kevesebb kommunikáció",
        "Csak egyéni munka"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Csapatmunka",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#teamwork", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy 3 hónapos projekthez csapatot kell alakítanod. A lecke szerint mit kellene létrehozni?",
      options: [
        "Csak véletlenszerűen oszd ki a feladatokat",
        "Világos szerepek minden tag számára, meghatározott felelősségek, kommunikációs protokollok és rendszeres koordinációs ellenőrzési pontok",
        "Csak szerepek",
        "Csak kommunikáció"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Csapatmunka",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#teamwork", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy csapat következetesen lemarad a határidőkről, nincs egyértelmű tulajdonjog, és a tagok egymást hibáztatják. A lecke keretrendszere szerint mi a fő probléma?",
      options: [
        "Nincs elég csapattag",
        "Hiányoznak a csapatmunka alapjai - hiányzik a szerep egyértelműség, felelősségi definíciók és koordinációs rendszerek, amelyek szinergiát és elszámoltathatóságot teremtenek",
        "Túl sok kommunikáció",
        "A csapatok feleslegesek"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Csapatmunka",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#teamwork", "#advanced", "#critical-thinking", "#hu", "#all-languages"]
    }
  ],
  // Turkish (TR) - Professional translations
  TR: [
    {
      question: "Derse göre takım çalışmasında 'sinerji' nedir?",
      options: [
        "Yalnız çalışmak",
        "Birleşik etki, bireysel çabaların toplamından daha büyüktür",
        "İşi eşit bölmek",
        "Aynı becerilere sahip olmak"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Takım Çalışması",
      questionType: QuestionType.RECALL,
      hashtags: ["#teamwork", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre takımlarda rol netliği neden önemlidir?",
      options: [
        "İletişimi ortadan kaldırır",
        "Örtüşmeyi önler, karışıklığı azaltır ve sorumluluğu sağlar",
        "Takımları küçültür",
        "Sadece büyük takımlara uygulanır"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Takım Çalışması",
      questionType: QuestionType.RECALL,
      hashtags: ["#teamwork", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre etkili takım koordinasyonu için ne gereklidir?",
      options: [
        "İzole çalışmak",
        "Net iletişim, ortak hedefler ve düzenli kontroller",
        "Son tarih olmaması",
        "İşbirliğinden kaçınmak"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Takım Çalışması",
      questionType: QuestionType.RECALL,
      hashtags: ["#teamwork", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre etkili takım çalışması neden önemlidir?",
      options: [
        "Bireysel çalışmayı ortadan kaldırır",
        "Sinerji yaratır (parçaların toplamından daha büyük sonuçlar), çeşitli güçlü yönleri kullanır ve koordinasyon yoluyla ilerlemeyi hızlandırır",
        "Sadece büyük projelere uygulanır",
        "Yapı gerektirmez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Takım Çalışması",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#teamwork", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir takımın örtüşen sorumlulukları var, bu da karışıklığa ve kaçırılan son tarihlere neden oluyor. Derse göre muhtemelen ne eksik?",
      options: [
        "Daha fazla takım üyesi",
        "Net rol tanımları ve sorumluluk atamaları",
        "Daha az iletişim",
        "Sadece bireysel çalışma"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Takım Çalışması",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#teamwork", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "3 aylık bir proje için takım kurmanız gerekiyor. Derse göre ne kurmalısınız?",
      options: [
        "Sadece görevleri rastgele atayın",
        "Her üye için net roller, tanımlı sorumluluklar, iletişim protokolleri ve düzenli koordinasyon kontrol noktaları",
        "Sadece roller",
        "Sadece iletişim"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Takım Çalışması",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#teamwork", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir takım tutarlı olarak son tarihleri kaçırıyor, belirsiz sahiplik var ve üyeler birbirini suçluyor. Dersin çerçevesine göre temel sorun nedir?",
      options: [
        "Yeterli takım üyesi yok",
        "Takım çalışması temellerinin eksikliği - sinerji ve sorumluluk yaratan rol netliği, sorumluluk tanımları ve koordinasyon sistemleri eksik",
        "Çok fazla iletişim",
        "Takımlar gereksiz"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Takım Çalışması",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#teamwork", "#advanced", "#critical-thinking", "#tr", "#all-languages"]
    }
  ],
  // Bulgarian (BG) - Professional translations
  BG: [
    {
      question: "Според урока, какво е 'синергия' в работата в екип?",
      options: [
        "Работа в изолация",
        "Комбинираният ефект е по-голям от сумата на индивидуалните усилия",
        "Разделяне на работата поравно",
        "Имане на същите умения"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Работа в Екип",
      questionType: QuestionType.RECALL,
      hashtags: ["#teamwork", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, защо яснотата на ролите е важна в екипите?",
      options: [
        "Елиминира комуникацията",
        "Предотвратява припокриване, намалява объркването и осигурява отговорност",
        "Прави екипите по-малки",
        "Прилага се само за големи екипи"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Работа в Екип",
      questionType: QuestionType.RECALL,
      hashtags: ["#teamwork", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, какво е от съществено значение за ефективна координация на екипа?",
      options: [
        "Работа в изолация",
        "Ясна комуникация, споделени цели и редовни проверки",
        "Липса на крайни срокове",
        "Избягване на сътрудничество"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Работа в Екип",
      questionType: QuestionType.RECALL,
      hashtags: ["#teamwork", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Защо ефективната работа в екип е важна според урока?",
      options: [
        "Елиминира индивидуалната работа",
        "Създава синергия (по-големи резултати от сумата на частите), използва различни силни страни и ускорява напредъка чрез координация",
        "Прилага се само за големи проекти",
        "Не изисква структура"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Работа в Екип",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#teamwork", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Един екип има припокриващи се отговорности, причиняващи объркване и пропуснати крайни срокове. Според урока, какво вероятно липсва?",
      options: [
        "Повече членове на екипа",
        "Ясни дефиниции на роли и назначения на отговорности",
        "По-малко комуникация",
        "Само индивидуална работа"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Работа в Екип",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#teamwork", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Трябва да формирате екип за 3-месечен проект. Според урока, какво трябва да установите?",
      options: [
        "Просто назначете задачи произволно",
        "Ясни роли за всеки член, определени отговорности, комуникационни протоколи и редовни координационни контролни точки",
        "Само роли",
        "Само комуникация"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Работа в Екип",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#teamwork", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Един екип последователно пропуска крайни срокове, има неясно собственост и членовете се обвиняват взаимно. Според рамката на урока, какъв е основният проблем?",
      options: [
        "Няма достатъчно членове на екипа",
        "Липса на основи на работата в екип - липсва яснота на роли, дефиниции на отговорности и координационни системи, които създават синергия и отговорност",
        "Твърде много комуникация",
        "Екипите са ненужни"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Работа в Екип",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#teamwork", "#advanced", "#critical-thinking", "#bg", "#all-languages"]
    }
  ],
  // Polish (PL) - Professional translations
  PL: [
    {
      question: "Według lekcji, czym jest 'synergia' w pracy zespołowej?",
      options: [
        "Praca w samotności",
        "Połączony efekt jest większy niż suma indywidualnych wysiłków",
        "Równy podział pracy",
        "Posiadanie tych samych umiejętności"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Praca Zespołowa",
      questionType: QuestionType.RECALL,
      hashtags: ["#teamwork", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, dlaczego jasność ról jest ważna w zespołach?",
      options: [
        "Eliminuje komunikację",
        "Zapobiega nakładaniu się, zmniejsza zamieszanie i zapewnia odpowiedzialność",
        "Czyni zespoły mniejszymi",
        "Dotyczy tylko dużych zespołów"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Praca Zespołowa",
      questionType: QuestionType.RECALL,
      hashtags: ["#teamwork", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, co jest niezbędne do skutecznej koordynacji zespołu?",
      options: [
        "Praca w izolacji",
        "Jasna komunikacja, wspólne cele i regularne kontrole",
        "Brak terminów",
        "Unikanie współpracy"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Praca Zespołowa",
      questionType: QuestionType.RECALL,
      hashtags: ["#teamwork", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Dlaczego skuteczna praca zespołowa jest ważna według lekcji?",
      options: [
        "Eliminuje pracę indywidualną",
        "Tworzy synergię (większe wyniki niż suma części), wykorzystuje różnorodne mocne strony i przyspiesza postęp poprzez koordynację",
        "Dotyczy tylko dużych projektów",
        "Nie wymaga struktury"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Praca Zespołowa",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#teamwork", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Zespół ma nakładające się odpowiedzialności, powodując zamieszanie i przegapione terminy. Według lekcji, czego prawdopodobnie brakuje?",
      options: [
        "Więcej członków zespołu",
        "Jasne definicje ról i przydziały odpowiedzialności",
        "Mniej komunikacji",
        "Tylko praca indywidualna"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Praca Zespołowa",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#teamwork", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Musisz utworzyć zespół dla 3-miesięcznego projektu. Według lekcji, co powinieneś ustanowić?",
      options: [
        "Po prostu przypisz zadania losowo",
        "Jasne role dla każdego członka, zdefiniowane odpowiedzialności, protokoły komunikacyjne i regularne punkty kontrolne koordynacji",
        "Tylko role",
        "Tylko komunikacja"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Praca Zespołowa",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#teamwork", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Zespół konsekwentnie przegapia terminy, ma niejasną własność i członkowie obwiniają się nawzajem. Według ram lekcji, jaki jest główny problem?",
      options: [
        "Niewystarczająca liczba członków zespołu",
        "Brak podstaw pracy zespołowej - brakuje jasności ról, definicji odpowiedzialności i systemów koordynacji, które tworzą synergię i odpowiedzialność",
        "Zbyt dużo komunikacji",
        "Zespoły są niepotrzebne"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Praca Zespołowa",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#teamwork", "#advanced", "#critical-thinking", "#pl", "#all-languages"]
    }
  ],
  // Vietnamese (VI) - Professional translations
  VI: [
    {
      question: "Theo bài học, 'hiệu năng' trong làm việc nhóm là gì?",
      options: [
        "Làm việc một mình",
        "Hiệu ứng kết hợp lớn hơn tổng các nỗ lực cá nhân",
        "Chia công việc đều",
        "Có cùng kỹ năng"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Làm Việc Nhóm",
      questionType: QuestionType.RECALL,
      hashtags: ["#teamwork", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, tại sao rõ ràng vai trò quan trọng trong các đội?",
      options: [
        "Nó loại bỏ giao tiếp",
        "Nó ngăn chặn chồng chéo, giảm nhầm lẫn và đảm bảo trách nhiệm giải trình",
        "Nó làm cho các đội nhỏ hơn",
        "Nó chỉ áp dụng cho các đội lớn"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Làm Việc Nhóm",
      questionType: QuestionType.RECALL,
      hashtags: ["#teamwork", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, điều gì cần thiết cho phối hợp đội hiệu quả?",
      options: [
        "Làm việc cô lập",
        "Giao tiếp rõ ràng, mục tiêu chung và kiểm tra thường xuyên",
        "Không có thời hạn",
        "Tránh hợp tác"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Làm Việc Nhóm",
      questionType: QuestionType.RECALL,
      hashtags: ["#teamwork", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Tại sao làm việc nhóm hiệu quả quan trọng theo bài học?",
      options: [
        "Nó loại bỏ công việc cá nhân",
        "Nó tạo hiệu năng (kết quả lớn hơn tổng các phần), tận dụng các điểm mạnh đa dạng và tăng tốc tiến trình thông qua phối hợp",
        "Nó chỉ áp dụng cho các dự án lớn",
        "Nó không yêu cầu cấu trúc"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Làm Việc Nhóm",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#teamwork", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Một đội có trách nhiệm chồng chéo gây nhầm lẫn và bỏ lỡ thời hạn. Theo bài học, điều gì có thể đang thiếu?",
      options: [
        "Nhiều thành viên đội hơn",
        "Định nghĩa vai trò rõ ràng và phân công trách nhiệm",
        "Ít giao tiếp hơn",
        "Chỉ công việc cá nhân"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Làm Việc Nhóm",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#teamwork", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Bạn cần thành lập một đội cho dự án 3 tháng. Theo bài học, bạn nên thiết lập gì?",
      options: [
        "Chỉ giao nhiệm vụ ngẫu nhiên",
        "Vai trò rõ ràng cho mỗi thành viên, trách nhiệm được xác định, giao thức giao tiếp và các điểm kiểm tra phối hợp thường xuyên",
        "Chỉ vai trò",
        "Chỉ giao tiếp"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Làm Việc Nhóm",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#teamwork", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Một đội liên tục bỏ lỡ thời hạn, có quyền sở hữu không rõ ràng và các thành viên đổ lỗi cho nhau. Theo khung của bài học, vấn đề cốt lõi là gì?",
      options: [
        "Không đủ thành viên đội",
        "Thiếu các nguyên tắc cơ bản làm việc nhóm - thiếu rõ ràng vai trò, định nghĩa trách nhiệm và hệ thống phối hợp tạo hiệu năng và trách nhiệm giải trình",
        "Quá nhiều giao tiếp",
        "Các đội là không cần thiết"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Làm Việc Nhóm",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#teamwork", "#advanced", "#critical-thinking", "#vi", "#all-languages"]
    }
  ],
  // Indonesian (ID) - Professional translations
  ID: [
    {
      question: "Menurut pelajaran, apa itu 'sinergi' dalam kerja tim?",
      options: [
        "Bekerja sendiri",
        "Efek gabungan lebih besar dari jumlah upaya individu",
        "Membagi pekerjaan secara merata",
        "Memiliki keterampilan yang sama"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Kerja Tim",
      questionType: QuestionType.RECALL,
      hashtags: ["#teamwork", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, mengapa kejelasan peran penting dalam tim?",
      options: [
        "Ini menghilangkan komunikasi",
        "Ini mencegah tumpang tindih, mengurangi kebingungan, dan memastikan akuntabilitas",
        "Ini membuat tim lebih kecil",
        "Ini hanya berlaku untuk tim besar"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Kerja Tim",
      questionType: QuestionType.RECALL,
      hashtags: ["#teamwork", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, apa yang penting untuk koordinasi tim yang efektif?",
      options: [
        "Bekerja dalam isolasi",
        "Komunikasi yang jelas, tujuan bersama, dan pemeriksaan rutin",
        "Tidak ada tenggat waktu",
        "Menghindari kolaborasi"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Kerja Tim",
      questionType: QuestionType.RECALL,
      hashtags: ["#teamwork", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Mengapa kerja tim yang efektif penting menurut pelajaran?",
      options: [
        "Ini menghilangkan kerja individu",
        "Ini menciptakan sinergi (hasil yang lebih besar dari jumlah bagian), memanfaatkan kekuatan yang beragam, dan mempercepat kemajuan melalui koordinasi",
        "Ini hanya berlaku untuk proyek besar",
        "Ini tidak memerlukan struktur"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Kerja Tim",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#teamwork", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Sebuah tim memiliki tanggung jawab yang tumpang tindih menyebabkan kebingungan dan tenggat waktu terlewat. Menurut pelajaran, apa yang mungkin kurang?",
      options: [
        "Lebih banyak anggota tim",
        "Definisi peran yang jelas dan penugasan tanggung jawab",
        "Lebih sedikit komunikasi",
        "Hanya kerja individu"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Kerja Tim",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#teamwork", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Anda perlu membentuk tim untuk proyek 3 bulan. Menurut pelajaran, apa yang harus Anda tetapkan?",
      options: [
        "Hanya tetapkan tugas secara acak",
        "Peran yang jelas untuk setiap anggota, tanggung jawab yang ditentukan, protokol komunikasi, dan titik pemeriksaan koordinasi rutin",
        "Hanya peran",
        "Hanya komunikasi"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Kerja Tim",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#teamwork", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Sebuah tim secara konsisten melewatkan tenggat waktu, memiliki kepemilikan yang tidak jelas, dan anggota saling menyalahkan. Menurut kerangka pelajaran, apa masalah intinya?",
      options: [
        "Tidak cukup anggota tim",
        "Kurangnya dasar kerja tim - kurang kejelasan peran, definisi tanggung jawab, dan sistem koordinasi yang menciptakan sinergi dan akuntabilitas",
        "Terlalu banyak komunikasi",
        "Tim tidak perlu"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Kerja Tim",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#teamwork", "#advanced", "#critical-thinking", "#id", "#all-languages"]
    }
  ],
  // Arabic (AR) - Professional translations (RTL)
  AR: [
    {
      question: "وفقًا للدرس، ما هو 'التآزر' في العمل الجماعي؟",
      options: [
        "العمل بمفرده",
        "التأثير المشترك أكبر من مجموع الجهود الفردية",
        "تقسيم العمل بالتساوي",
        "امتلاك نفس المهارات"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "العمل الجماعي",
      questionType: QuestionType.RECALL,
      hashtags: ["#teamwork", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، لماذا وضوح الأدوار مهم في الفرق؟",
      options: [
        "إنه يلغي التواصل",
        "يمنع التداخل، يقلل الارتباك، ويضمن المساءلة",
        "يجعل الفرق أصغر",
        "ينطبق فقط على الفرق الكبيرة"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "العمل الجماعي",
      questionType: QuestionType.RECALL,
      hashtags: ["#teamwork", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، ما هو ضروري للتنسيق الفعال للفريق؟",
      options: [
        "العمل في عزلة",
        "تواصل واضح، أهداف مشتركة، وفحوصات منتظمة",
        "لا توجد مواعيد نهائية",
        "تجنب التعاون"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "العمل الجماعي",
      questionType: QuestionType.RECALL,
      hashtags: ["#teamwork", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "لماذا العمل الجماعي الفعال مهم وفقًا للدرس؟",
      options: [
        "إنه يلغي العمل الفردي",
        "يخلق التآزر (نتائج أكبر من مجموع الأجزاء)، يستفيد من نقاط القوة المتنوعة، ويسرع التقدم من خلال التنسيق",
        "ينطبق فقط على المشاريع الكبيرة",
        "لا يتطلب هيكلًا"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "العمل الجماعي",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#teamwork", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "فريق لديه مسؤوليات متداخلة تسبب الارتباك والمواعيد النهائية الضائعة. وفقًا للدرس، ما الذي ربما كان مفقودًا؟",
      options: [
        "المزيد من أعضاء الفريق",
        "تعريفات الأدوار الواضحة وتكليفات المسؤولية",
        "أقل تواصلًا",
        "العمل الفردي فقط"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "العمل الجماعي",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#teamwork", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "تحتاج إلى تشكيل فريق لمشروع مدته 3 أشهر. وفقًا للدرس، ماذا يجب أن تنشئ؟",
      options: [
        "فقط عيّن المهام بشكل عشوائي",
        "أدوار واضحة لكل عضو، مسؤوليات محددة، بروتوكولات التواصل، ونقاط فحص تنسيق منتظمة",
        "فقط الأدوار",
        "فقط التواصل"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "العمل الجماعي",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#teamwork", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "فريق يفوّت باستمرار المواعيد النهائية، لديه ملكية غير واضحة، والأعضاء يلومون بعضهم البعض. وفقًا لإطار الدرس، ما هي المشكلة الأساسية؟",
      options: [
        "لا يوجد أعضاء فريق كافٍ",
        "نقص أساسيات العمل الجماعي - نقص وضوح الأدوار، تعريفات المسؤولية، وأنظمة التنسيق التي تخلق التآزر والمساءلة",
        "الكثير من التواصل",
        "الفرق غير ضرورية"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "العمل الجماعي",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#teamwork", "#advanced", "#critical-thinking", "#ar", "#all-languages"]
    }
  ],
  // Portuguese (PT) - Professional translations (Brazilian)
  PT: [
    {
      question: "De acordo com a lição, o que é 'sinergia' no trabalho em equipe?",
      options: [
        "Trabalhar sozinho",
        "O efeito combinado é maior que a soma dos esforços individuais",
        "Dividir o trabalho igualmente",
        "Ter as mesmas habilidades"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Trabalho em Equipe",
      questionType: QuestionType.RECALL,
      hashtags: ["#teamwork", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, por que a clareza de papéis é importante nas equipes?",
      options: [
        "Ela elimina a comunicação",
        "Ela previne sobreposição, reduz confusão e garante responsabilização",
        "Ela torna as equipes menores",
        "Aplica-se apenas a equipes grandes"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Trabalho em Equipe",
      questionType: QuestionType.RECALL,
      hashtags: ["#teamwork", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, o que é essencial para coordenação eficaz da equipe?",
      options: [
        "Trabalhar isoladamente",
        "Comunicação clara, objetivos compartilhados e verificações regulares",
        "Não ter prazos",
        "Evitar colaboração"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Trabalho em Equipe",
      questionType: QuestionType.RECALL,
      hashtags: ["#teamwork", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "Por que o trabalho em equipe eficaz é importante de acordo com a lição?",
      options: [
        "Elimina o trabalho individual",
        "Cria sinergia (resultados maiores que a soma das partes), aproveita pontos fortes diversos e acelera o progresso através da coordenação",
        "Aplica-se apenas a projetos grandes",
        "Não requer estrutura"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Trabalho em Equipe",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#teamwork", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Uma equipe tem responsabilidades sobrepostas causando confusão e prazos perdidos. De acordo com a lição, o que provavelmente está faltando?",
      options: [
        "Mais membros da equipe",
        "Definições claras de papéis e atribuições de responsabilidade",
        "Menos comunicação",
        "Apenas trabalho individual"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Trabalho em Equipe",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#teamwork", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Você precisa formar uma equipe para um projeto de 3 meses. De acordo com a lição, o que você deve estabelecer?",
      options: [
        "Apenas atribua tarefas aleatoriamente",
        "Papéis claros para cada membro, responsabilidades definidas, protocolos de comunicação e pontos de verificação de coordenação regulares",
        "Apenas papéis",
        "Apenas comunicação"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Trabalho em Equipe",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#teamwork", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Uma equipe consistentemente perde prazos, tem propriedade pouco clara e membros se culpam mutuamente. De acordo com a estrutura da lição, qual é o problema central?",
      options: [
        "Não há membros suficientes da equipe",
        "Falta de fundamentos do trabalho em equipe - falta clareza de papéis, definições de responsabilidade e sistemas de coordenação que criam sinergia e responsabilização",
        "Muita comunicação",
        "Equipes são desnecessárias"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Trabalho em Equipe",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#teamwork", "#advanced", "#critical-thinking", "#pt", "#all-languages"]
    }
  ],
  // Hindi (HI) - Professional translations
  HI: [
    {
      question: "पाठ के अनुसार, टीमवर्क में 'तालमेल' क्या है?",
      options: [
        "अकेले काम करना",
        "संयुक्त प्रभाव व्यक्तिगत प्रयासों के योग से अधिक है",
        "काम को समान रूप से बांटना",
        "समान कौशल होना"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "टीमवर्क",
      questionType: QuestionType.RECALL,
      hashtags: ["#teamwork", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, टीमों में भूमिका स्पष्टता क्यों महत्वपूर्ण है?",
      options: [
        "यह संचार को समाप्त करती है",
        "यह ओवरलैप को रोकती है, भ्रम को कम करती है, और जवाबदेही सुनिश्चित करती है",
        "यह टीमों को छोटा बनाती है",
        "यह केवल बड़ी टीमों पर लागू होती है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "टीमवर्क",
      questionType: QuestionType.RECALL,
      hashtags: ["#teamwork", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, प्रभावी टीम समन्वय के लिए क्या आवश्यक है?",
      options: [
        "अलगाव में काम करना",
        "स्पष्ट संचार, साझा लक्ष्य, और नियमित जांच",
        "कोई समय सीमा नहीं",
        "सहयोग से बचना"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "टीमवर्क",
      questionType: QuestionType.RECALL,
      hashtags: ["#teamwork", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार प्रभावी टीमवर्क क्यों महत्वपूर्ण है?",
      options: [
        "यह व्यक्तिगत काम को समाप्त करता है",
        "यह तालमेल बनाता है (भागों के योग से अधिक परिणाम), विविध ताकतों का लाभ उठाता है, और समन्वय के माध्यम से प्रगति को तेज करता है",
        "यह केवल बड़ी परियोजनाओं पर लागू होता है",
        "इसके लिए संरचना की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "टीमवर्क",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#teamwork", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक टीम में ओवरलैपिंग जिम्मेदारियां हैं जो भ्रम और चूकी हुई समय सीमाएं पैदा करती हैं। पाठ के अनुसार, क्या संभवतः गायब है?",
      options: [
        "अधिक टीम सदस्य",
        "स्पष्ट भूमिका परिभाषाएं और जिम्मेदारी असाइनमेंट",
        "कम संचार",
        "केवल व्यक्तिगत काम"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "टीमवर्क",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#teamwork", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "आपको 3 महीने की परियोजना के लिए एक टीम बनानी है। पाठ के अनुसार, आपको क्या स्थापित करना चाहिए?",
      options: [
        "बस कार्यों को यादृच्छिक रूप से असाइन करें",
        "प्रत्येक सदस्य के लिए स्पष्ट भूमिकाएं, परिभाषित जिम्मेदारियां, संचार प्रोटोकॉल, और नियमित समन्वय चेकपॉइंट",
        "केवल भूमिकाएं",
        "केवल संचार"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "टीमवर्क",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#teamwork", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक टीम लगातार समय सीमाएं खो देती है, अस्पष्ट स्वामित्व है, और सदस्य एक दूसरे को दोष देते हैं। पाठ के ढांचे के अनुसार, मुख्य समस्या क्या है?",
      options: [
        "पर्याप्त टीम सदस्य नहीं हैं",
        "टीमवर्क मूल सिद्धांतों की कमी - भूमिका स्पष्टता, जिम्मेदारी परिभाषाएं, और समन्वय प्रणालियां जो तालमेल और जवाबदेही बनाती हैं गायब हैं",
        "बहुत अधिक संचार",
        "टीमें अनावश्यक हैं"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "टीमवर्क",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#teamwork", "#advanced", "#critical-thinking", "#hi", "#all-languages"]
    }
  ]
};

async function seedDay15Enhanced() {
  try {
    await connectDB();
    console.log('🌱 SEEDING DAY 15 ENHANCED QUIZ QUESTIONS\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    let totalQuestions = 0;
    let totalUpdated = 0;
    let totalCreated = 0;

    for (const lang of LANGUAGES) {
      const courseId = `${COURSE_ID_BASE}_${lang}`;
      const lessonId = `${COURSE_ID_BASE}_${lang}_DAY_15`;

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
      const questions = DAY15_QUESTIONS[lang] || DAY15_QUESTIONS['EN']; // Fallback to EN if not translated
      
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
    console.log(`\n✅ DAY 15 ENHANCEMENT COMPLETE!\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedDay15Enhanced();
