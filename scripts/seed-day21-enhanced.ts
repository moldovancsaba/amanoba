/**
 * Seed Day 21 Enhanced Quiz Questions
 * 
 * Purpose: Enhance Day 21 quizzes from 5 to 7 questions across all 10 languages
 * Why: Part of Quiz Quality Enhancement - Phase 1, Day 21
 * 
 * Lesson Topic: Community and Network (relationships, learning with others)
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
const DAY_NUMBER = 21;
const LANGUAGES = ['HU', 'EN', 'TR', 'BG', 'PL', 'VI', 'ID', 'AR', 'PT', 'HI'];

/**
 * Day 21 Enhanced Questions - All Languages
 * Topic: Community and Network
 * Structure: 7 questions per language
 * Q1-Q3: Keep (Recall - foundational concepts)
 * Q4: Rewritten (Application - from definition to purpose)
 * Q5: Keep (Application - scenario-based)
 * Q6: New (Application - practical implementation)
 * Q7: New (Critical Thinking - systems integration)
 */
const DAY21_QUESTIONS: Record<string, Array<{
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: QuestionDifficulty;
  category: string;
  questionType: QuestionType;
  hashtags: string[];
}>> = {
  EN: [
    // Q1: Community definition (RECALL)
    {
      question: "According to the lesson, what is a productive community?",
      options: [
        "Only online groups",
        "A network of relationships that supports learning, accountability, and shared productivity goals",
        "Only work colleagues",
        "No structure needed"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Team Dynamics",
      questionType: QuestionType.RECALL,
      hashtags: ["#community", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q2: Learning with others benefit (RECALL)
    {
      question: "According to the lesson, why is learning with others valuable?",
      options: [
        "It's not valuable",
        "It accelerates learning, provides diverse perspectives, and creates accountability",
        "It only applies to certain topics",
        "It requires no effort"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Learning",
      questionType: QuestionType.RECALL,
      hashtags: ["#learning", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q3: Network building (RECALL)
    {
      question: "According to the lesson, how should productive networks be built?",
      options: [
        "No structure needed",
        "Through intentional relationship building, shared goals, and mutual support for productivity",
        "Only online",
        "Avoid all networks"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Network",
      questionType: QuestionType.RECALL,
      hashtags: ["#network", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q4: Why community matters (APPLICATION - Rewritten)
    {
      question: "Why are community and networks important for productivity according to the lesson?",
      options: [
        "They eliminate individual work",
        "They accelerate learning through shared knowledge, provide accountability, create support systems, and enable collaboration for productivity goals",
        "They only apply to certain people",
        "They require no effort"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Team Dynamics",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#community", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q5: Isolation scenario (APPLICATION - Keep)
    {
      question: "A person works alone with no community support, leading to slower learning and lack of accountability. According to the lesson, what is likely missing?",
      options: [
        "More individual work",
        "A productive community and network with relationships, shared learning, and mutual support",
        "Less community",
        "No structure needed"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Team Dynamics",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#community", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q6: Building productive community (APPLICATION - New)
    {
      question: "You want to build a productive community around your goals. According to the lesson, what should you establish?",
      options: [
        "Just work alone",
        "Intentional relationships, shared learning opportunities, accountability partnerships, and mutual support systems for productivity",
        "Only relationships",
        "Only learning"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Team Dynamics",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#community", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q7: Isolation analysis (CRITICAL THINKING - New)
    {
      question: "A professional consistently works in isolation, learns slowly, and lacks accountability, leading to limited progress. According to the lesson's framework, what is the core issue?",
      options: [
        "Not enough individual work",
        "Lack of community and network - missing relationships, shared learning, and support systems that accelerate learning and create accountability for productivity",
        "Too much community",
        "Community is unnecessary"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Team Dynamics",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#community", "#advanced", "#critical-thinking", "#en", "#all-languages"]
    }
  ],
  // Hungarian (HU) - Professional translations
  HU: [
    {
      question: "A lecke szerint mi a produktív közösség?",
      options: [
        "Csak online csoportok",
        "Egy kapcsolati hálózat, amely támogatja a tanulást, az elszámoltathatóságot és a közös termelékenységi célokat",
        "Csak munkatársak",
        "Nincs szükség struktúrára"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Közösség",
      questionType: QuestionType.RECALL,
      hashtags: ["#community", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint miért értékes másokkal tanulni?",
      options: [
        "Nem értékes",
        "Felgyorsítja a tanulást, különböző perspektívákat nyújt, és elszámoltathatóságot teremt",
        "Csak bizonyos témákra vonatkozik",
        "Nem igényel erőfeszítést"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Tanulás",
      questionType: QuestionType.RECALL,
      hashtags: ["#learning", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint hogyan kell építeni produktív hálózatokat?",
      options: [
        "Nincs szükség struktúrára",
        "Szándékos kapcsolatépítésen, közös célokon és kölcsönös termelékenységi támogatáson keresztül",
        "Csak online",
        "Kerülni kell az összes hálózatot"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Hálózat",
      questionType: QuestionType.RECALL,
      hashtags: ["#network", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "Miért fontosak a közösség és a hálózatok a termelékenységhez a lecke szerint?",
      options: [
        "Kiküszöbölik az egyéni munkát",
        "Felgyorsítják a tanulást a megosztott tudáson keresztül, elszámoltathatóságot biztosítanak, támogatási rendszereket hoznak létre, és lehetővé teszik az együttműködést a termelékenységi célokért",
        "Csak bizonyos emberekre vonatkoznak",
        "Nem igényelnek erőfeszítést"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Közösség",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#community", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy személy egyedül dolgozik közösségi támogatás nélkül, ami lassabb tanuláshoz és elszámoltathatóság hiányához vezet. A lecke szerint mi hiányzik valószínűleg?",
      options: [
        "Több egyéni munka",
        "Egy produktív közösség és hálózat kapcsolatokkal, megosztott tanulással és kölcsönös támogatással",
        "Kevesebb közösség",
        "Nincs szükség struktúrára"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Közösség",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#community", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Létre szeretnél hozni egy produktív közösséget a céljaid körül. A lecke szerint mit kellene létrehozni?",
      options: [
        "Csak dolgozz egyedül",
        "Szándékos kapcsolatok, megosztott tanulási lehetőségek, elszámoltathatósági partnerek, és kölcsönös támogatási rendszerek a termelékenységhez",
        "Csak kapcsolatok",
        "Csak tanulás"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Közösség",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#community", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy szakember következetesen egyedül dolgozik, lassan tanul, és hiányzik az elszámoltathatóság, ami korlátozott haladáshoz vezet. A lecke keretrendszere szerint mi a fő probléma?",
      options: [
        "Nincs elég egyéni munka",
        "Hiányzik a közösség és a hálózat - hiányoznak a kapcsolatok, megosztott tanulás, és támogatási rendszerek, amelyek felgyorsítják a tanulást és elszámoltathatóságot teremtenek a termelékenységhez",
        "Túl sok közösség",
        "A közösség felesleges"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Közösség",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#community", "#advanced", "#critical-thinking", "#hu", "#all-languages"]
    }
  ],
  // Turkish (TR) - Professional translations
  TR: [
    {
      question: "Derse göre üretken bir topluluk nedir?",
      options: [
        "Sadece çevrimiçi gruplar",
        "Öğrenmeyi, sorumluluğu ve paylaşılan verimlilik hedeflerini destekleyen bir ilişki ağı",
        "Sadece iş arkadaşları",
        "Yapı gerekmez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Topluluk",
      questionType: QuestionType.RECALL,
      hashtags: ["#community", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre başkalarıyla öğrenmek neden değerlidir?",
      options: [
        "Değerli değil",
        "Öğrenmeyi hızlandırır, çeşitli perspektifler sağlar ve sorumluluk yaratır",
        "Sadece belirli konulara uygulanır",
        "Çaba gerektirmez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Öğrenme",
      questionType: QuestionType.RECALL,
      hashtags: ["#learning", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre üretken ağlar nasıl kurulmalıdır?",
      options: [
        "Yapı gerekmez",
        "Kasıtlı ilişki kurma, ortak hedefler ve verimlilik için karşılıklı destek yoluyla",
        "Sadece çevrimiçi",
        "Tüm ağlardan kaçının"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Ağ",
      questionType: QuestionType.RECALL,
      hashtags: ["#network", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre topluluk ve ağlar verimlilik için neden önemlidir?",
      options: [
        "Bireysel çalışmayı ortadan kaldırır",
        "Paylaşılan bilgi yoluyla öğrenmeyi hızlandırır, sorumluluk sağlar, destek sistemleri oluşturur ve verimlilik hedefleri için işbirliğini sağlar",
        "Sadece belirli kişilere uygulanır",
        "Çaba gerektirmez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Topluluk",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#community", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir kişi topluluk desteği olmadan yalnız çalışıyor, bu da daha yavaş öğrenmeye ve sorumluluk eksikliğine yol açıyor. Derse göre muhtemelen ne eksik?",
      options: [
        "Daha fazla bireysel çalışma",
        "İlişkiler, paylaşılan öğrenme ve karşılıklı destek ile üretken bir topluluk ve ağ",
        "Daha az topluluk",
        "Yapı gerekmez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Topluluk",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#community", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Hedefleriniz etrafında üretken bir topluluk oluşturmak istiyorsunuz. Derse göre ne kurmalısınız?",
      options: [
        "Sadece yalnız çalışın",
        "Kasıtlı ilişkiler, paylaşılan öğrenme fırsatları, sorumluluk ortaklıkları ve verimlilik için karşılıklı destek sistemleri",
        "Sadece ilişkiler",
        "Sadece öğrenme"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Topluluk",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#community", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir profesyonel tutarlı olarak izolasyonda çalışıyor, yavaş öğreniyor ve sorumluluk eksikliği var, bu da sınırlı ilerlemeye yol açıyor. Dersin çerçevesine göre temel sorun nedir?",
      options: [
        "Yeterli bireysel çalışma yok",
        "Topluluk ve ağ eksikliği - öğrenmeyi hızlandıran ve verimlilik için sorumluluk yaratan ilişkiler, paylaşılan öğrenme ve destek sistemleri eksik",
        "Çok fazla topluluk",
        "Topluluk gereksiz"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Topluluk",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#community", "#advanced", "#critical-thinking", "#tr", "#all-languages"]
    }
  ],
  // Bulgarian (BG) - Professional translations
  BG: [
    {
      question: "Според урока, какво е продуктивна общност?",
      options: [
        "Само онлайн групи",
        "Мрежа от отношения, която подкрепя учене, отговорност и споделени цели за производителност",
        "Само колеги от работа",
        "Не е нужна структура"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Общност",
      questionType: QuestionType.RECALL,
      hashtags: ["#community", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, защо ученето с други е ценно?",
      options: [
        "Не е ценно",
        "Ускорява ученето, предоставя различни перспективи и създава отговорност",
        "Прилага се само за определени теми",
        "Не изисква усилие"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Учене",
      questionType: QuestionType.RECALL,
      hashtags: ["#learning", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, как трябва да се изграждат продуктивни мрежи?",
      options: [
        "Не е нужна структура",
        "Чрез преднамерено изграждане на отношения, споделени цели и взаимна подкрепа за производителност",
        "Само онлайн",
        "Избягване на всички мрежи"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Мрежа",
      questionType: QuestionType.RECALL,
      hashtags: ["#network", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Защо общността и мрежите са важни за производителността според урока?",
      options: [
        "Елиминират индивидуалната работа",
        "Ускоряват ученето чрез споделени знания, осигуряват отговорност, създават поддържащи системи и позволяват сътрудничество за цели за производителност",
        "Прилагат се само за определени хора",
        "Не изискват усилие"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Общност",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#community", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Човек работи сам без общностна подкрепа, водещо до по-бавно учене и липса на отговорност. Според урока, какво вероятно липсва?",
      options: [
        "Повече индивидуална работа",
        "Продуктивна общност и мрежа с отношения, споделено учене и взаимна подкрепа",
        "По-малко общност",
        "Не е нужна структура"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Общност",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#community", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Искате да изградите продуктивна общност около целите си. Според урока, какво трябва да установите?",
      options: [
        "Просто работете сам",
        "Преднамерени отношения, споделени възможности за учене, партньорства за отговорност и взаимни поддържащи системи за производителност",
        "Само отношения",
        "Само учене"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Общност",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#community", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Професионалист последователно работи в изолация, учи бавно и липсва отговорност, водещо до ограничен напредък. Според рамката на урока, какъв е основният проблем?",
      options: [
        "Няма достатъчно индивидуална работа",
        "Липса на общност и мрежа - липсват отношения, споделено учене и поддържащи системи, които ускоряват ученето и създават отговорност за производителност",
        "Твърде много общност",
        "Общността е ненужна"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Общност",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#community", "#advanced", "#critical-thinking", "#bg", "#all-languages"]
    }
  ],
  // Polish (PL) - Professional translations
  PL: [
    {
      question: "Według lekcji, czym jest produktywna społeczność?",
      options: [
        "Tylko grupy online",
        "Sieć relacji, która wspiera uczenie się, odpowiedzialność i wspólne cele produktywności",
        "Tylko koledzy z pracy",
        "Struktura nie jest potrzebna"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Społeczność",
      questionType: QuestionType.RECALL,
      hashtags: ["#community", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, dlaczego uczenie się z innymi jest cenne?",
      options: [
        "Nie jest cenne",
        "Przyspiesza uczenie się, zapewnia różnorodne perspektywy i tworzy odpowiedzialność",
        "Dotyczy tylko niektórych tematów",
        "Nie wymaga wysiłku"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Uczenie Się",
      questionType: QuestionType.RECALL,
      hashtags: ["#learning", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, jak powinny być budowane produktywne sieci?",
      options: [
        "Struktura nie jest potrzebna",
        "Poprzez celowe budowanie relacji, wspólne cele i wzajemne wsparcie dla produktywności",
        "Tylko online",
        "Unikać wszystkich sieci"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Sieć",
      questionType: QuestionType.RECALL,
      hashtags: ["#network", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Dlaczego społeczność i sieci są ważne dla produktywności według lekcji?",
      options: [
        "Eliminują pracę indywidualną",
        "Przyspieszają uczenie się poprzez dzieloną wiedzę, zapewniają odpowiedzialność, tworzą systemy wsparcia i umożliwiają współpracę dla celów produktywności",
        "Dotyczy tylko niektórych ludzi",
        "Nie wymaga wysiłku"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Społeczność",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#community", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Osoba pracuje samotnie bez wsparcia społeczności, prowadząc do wolniejszego uczenia się i braku odpowiedzialności. Według lekcji, czego prawdopodobnie brakuje?",
      options: [
        "Więcej pracy indywidualnej",
        "Produktywna społeczność i sieć z relacjami, dzielonym uczeniem się i wzajemnym wsparciem",
        "Mniej społeczności",
        "Struktura nie jest potrzebna"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Społeczność",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#community", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Chcesz zbudować produktywną społeczność wokół swoich celów. Według lekcji, co powinieneś ustanowić?",
      options: [
        "Po prostu pracuj sam",
        "Celowe relacje, wspólne możliwości uczenia się, partnerstwa odpowiedzialności i wzajemne systemy wsparcia dla produktywności",
        "Tylko relacje",
        "Tylko uczenie się"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Społeczność",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#community", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Profesjonalista konsekwentnie pracuje w izolacji, uczy się powoli i brakuje odpowiedzialności, prowadząc do ograniczonego postępu. Według ram lekcji, jaki jest główny problem?",
      options: [
        "Niewystarczająca praca indywidualna",
        "Brak społeczności i sieci - brakuje relacji, dzielonego uczenia się i systemów wsparcia, które przyspieszają uczenie się i tworzą odpowiedzialność za produktywność",
        "Zbyt dużo społeczności",
        "Społeczność jest niepotrzebna"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Społeczność",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#community", "#advanced", "#critical-thinking", "#pl", "#all-languages"]
    }
  ],
  // Vietnamese (VI) - Professional translations
  VI: [
    {
      question: "Theo bài học, cộng đồng năng suất là gì?",
      options: [
        "Chỉ các nhóm trực tuyến",
        "Một mạng lưới các mối quan hệ hỗ trợ học tập, trách nhiệm giải trình, và các mục tiêu năng suất chung",
        "Chỉ đồng nghiệp",
        "Không cần cấu trúc"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Cộng Đồng",
      questionType: QuestionType.RECALL,
      hashtags: ["#community", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, tại sao học với người khác có giá trị?",
      options: [
        "Nó không có giá trị",
        "Nó tăng tốc học tập, cung cấp các quan điểm đa dạng, và tạo trách nhiệm giải trình",
        "Nó chỉ áp dụng cho một số chủ đề",
        "Nó không yêu cầu nỗ lực"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Học Tập",
      questionType: QuestionType.RECALL,
      hashtags: ["#learning", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, mạng lưới năng suất nên được xây dựng như thế nào?",
      options: [
        "Không cần cấu trúc",
        "Thông qua xây dựng mối quan hệ có chủ ý, mục tiêu chung, và hỗ trợ lẫn nhau cho năng suất",
        "Chỉ trực tuyến",
        "Tránh tất cả mạng lưới"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Mạng Lưới",
      questionType: QuestionType.RECALL,
      hashtags: ["#network", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Tại sao cộng đồng và mạng lưới quan trọng cho năng suất theo bài học?",
      options: [
        "Chúng loại bỏ công việc cá nhân",
        "Chúng tăng tốc học tập thông qua kiến thức chia sẻ, cung cấp trách nhiệm giải trình, tạo hệ thống hỗ trợ, và cho phép hợp tác cho các mục tiêu năng suất",
        "Chúng chỉ áp dụng cho một số người",
        "Chúng không yêu cầu nỗ lực"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Cộng Đồng",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#community", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Một người làm việc một mình không có hỗ trợ cộng đồng, dẫn đến học tập chậm hơn và thiếu trách nhiệm giải trình. Theo bài học, điều gì có thể đang thiếu?",
      options: [
        "Nhiều công việc cá nhân hơn",
        "Một cộng đồng và mạng lưới năng suất với các mối quan hệ, học tập chia sẻ, và hỗ trợ lẫn nhau",
        "Ít cộng đồng hơn",
        "Không cần cấu trúc"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Cộng Đồng",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#community", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Bạn muốn xây dựng một cộng đồng năng suất xung quanh mục tiêu của mình. Theo bài học, bạn nên thiết lập gì?",
      options: [
        "Chỉ làm việc một mình",
        "Các mối quan hệ có chủ ý, cơ hội học tập chia sẻ, đối tác trách nhiệm giải trình, và hệ thống hỗ trợ lẫn nhau cho năng suất",
        "Chỉ các mối quan hệ",
        "Chỉ học tập"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Cộng Đồng",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#community", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Một chuyên gia liên tục làm việc trong cô lập, học chậm, và thiếu trách nhiệm giải trình, dẫn đến tiến trình hạn chế. Theo khung của bài học, vấn đề cốt lõi là gì?",
      options: [
        "Không đủ công việc cá nhân",
        "Thiếu cộng đồng và mạng lưới - thiếu các mối quan hệ, học tập chia sẻ, và hệ thống hỗ trợ tăng tốc học tập và tạo trách nhiệm giải trình cho năng suất",
        "Quá nhiều cộng đồng",
        "Cộng đồng là không cần thiết"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Cộng Đồng",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#community", "#advanced", "#critical-thinking", "#vi", "#all-languages"]
    }
  ],
  // Indonesian (ID) - Professional translations
  ID: [
    {
      question: "Menurut pelajaran, apa itu komunitas produktif?",
      options: [
        "Hanya grup online",
        "Jaringan hubungan yang mendukung pembelajaran, akuntabilitas, dan tujuan produktivitas bersama",
        "Hanya rekan kerja",
        "Tidak perlu struktur"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Team Dynamics",
      questionType: QuestionType.RECALL,
      hashtags: ["#community", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, mengapa belajar dengan orang lain berharga?",
      options: [
        "Tidak berharga",
        "Mempercepat pembelajaran, menyediakan perspektif beragam, dan menciptakan akuntabilitas",
        "Hanya berlaku untuk topik tertentu",
        "Tidak memerlukan upaya"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Pembelajaran",
      questionType: QuestionType.RECALL,
      hashtags: ["#learning", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, bagaimana jaringan produktif harus dibangun?",
      options: [
        "Tidak perlu struktur",
        "Melalui pembangunan hubungan yang disengaja, tujuan bersama, dan dukungan timbal balik untuk produktivitas",
        "Hanya online",
        "Hindari semua jaringan"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Jaringan",
      questionType: QuestionType.RECALL,
      hashtags: ["#network", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Mengapa komunitas dan jaringan penting untuk produktivitas menurut pelajaran?",
      options: [
        "Mereka menghilangkan kerja individu",
        "Mereka mempercepat pembelajaran melalui pengetahuan bersama, menyediakan akuntabilitas, menciptakan sistem dukungan, dan memungkinkan kolaborasi untuk tujuan produktivitas",
        "Mereka hanya berlaku untuk orang tertentu",
        "Mereka tidak memerlukan upaya"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Team Dynamics",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#community", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Seseorang bekerja sendiri tanpa dukungan komunitas, menyebabkan pembelajaran lebih lambat dan kurangnya akuntabilitas. Menurut pelajaran, apa yang mungkin kurang?",
      options: [
        "Lebih banyak kerja individu",
        "Komunitas dan jaringan produktif dengan hubungan, pembelajaran bersama, dan dukungan timbal balik",
        "Lebih sedikit komunitas",
        "Tidak perlu struktur"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Team Dynamics",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#community", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Anda ingin membangun komunitas produktif di sekitar tujuan Anda. Menurut pelajaran, apa yang harus Anda tetapkan?",
      options: [
        "Hanya bekerja sendiri",
        "Hubungan yang disengaja, peluang pembelajaran bersama, kemitraan akuntabilitas, dan sistem dukungan timbal balik untuk produktivitas",
        "Hanya hubungan",
        "Hanya pembelajaran"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Team Dynamics",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#community", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Seorang profesional secara konsisten bekerja sendiri, belajar lambat, dan kurang akuntabilitas, menyebabkan kemajuan terbatas. Menurut kerangka pelajaran, apa masalah intinya?",
      options: [
        "Tidak cukup kerja individu",
        "Kurangnya komunitas dan jaringan - kurang hubungan, pembelajaran bersama, dan sistem dukungan yang mempercepat pembelajaran dan menciptakan akuntabilitas untuk produktivitas",
        "Terlalu banyak komunitas",
        "Komunitas tidak perlu"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Team Dynamics",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#community", "#advanced", "#critical-thinking", "#id", "#all-languages"]
    }
  ],
  // Arabic (AR) - Professional translations (RTL)
  AR: [
    {
      question: "وفقًا للدرس، ما هي المجتمع المنتج?",
      options: [
        "فقط المجموعات عبر الإنترنت",
        "شبكة من العلاقات التي تدعم التعلم والمساءلة وأهداف الإنتاجية المشتركة",
        "فقط زملاء العمل",
        "لا حاجة للهيكل"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "المجتمع",
      questionType: QuestionType.RECALL,
      hashtags: ["#community", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، لماذا التعلم مع الآخرين قيم?",
      options: [
        "ليس قيمًا",
        "يسرع التعلم، يوفر وجهات نظر متنوعة، ويخلق المساءلة",
        "ينطبق فقط على مواضيع معينة",
        "لا يتطلب جهدًا"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "التعلم",
      questionType: QuestionType.RECALL,
      hashtags: ["#learning", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، كيف يجب بناء الشبكات المنتجة?",
      options: [
        "لا حاجة للهيكل",
        "من خلال بناء العلاقات المتعمدة، الأهداف المشتركة، والدعم المتبادل للإنتاجية",
        "فقط عبر الإنترنت",
        "تجنب جميع الشبكات"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "الشبكة",
      questionType: QuestionType.RECALL,
      hashtags: ["#network", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "لماذا المجتمع والشبكات مهمة للإنتاجية وفقًا للدرس?",
      options: [
        "إنها تلغي العمل الفردي",
        "إنها تسرع التعلم من خلال المعرفة المشتركة، توفر المساءلة، تخلق أنظمة الدعم، وتمكن التعاون لأهداف الإنتاجية",
        "تنطبق فقط على أشخاص معينين",
        "لا تتطلب جهدًا"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "المجتمع",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#community", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "شخص يعمل بمفرده دون دعم المجتمع، مما يؤدي إلى تعلم أبطأ ونقص المساءلة. وفقًا للدرس، ما الذي ربما كان مفقودًا?",
      options: [
        "المزيد من العمل الفردي",
        "مجتمع وشبكة منتجة مع العلاقات، التعلم المشترك، والدعم المتبادل",
        "أقل مجتمع",
        "لا حاجة للهيكل"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "المجتمع",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#community", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "تريد بناء مجتمع منتج حول أهدافك. وفقًا للدرس، ماذا يجب أن تنشئ?",
      options: [
        "فقط اعمل بمفردك",
        "العلاقات المتعمدة، فرص التعلم المشترك، شراكات المساءلة، وأنظمة الدعم المتبادل للإنتاجية",
        "فقط العلاقات",
        "فقط التعلم"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "المجتمع",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#community", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "محترف يعمل باستمرار بمفرده، يتعلم ببطء، ويفتقر إلى المساءلة، مما يؤدي إلى تقدم محدود. وفقًا لإطار الدرس، ما هي المشكلة الأساسية?",
      options: [
        "لا يوجد عمل فردي كافٍ",
        "نقص المجتمع والشبكة - نقص العلاقات، التعلم المشترك، وأنظمة الدعم التي تسرع التعلم وتخلق المساءلة للإنتاجية",
        "الكثير من المجتمع",
        "المجتمع غير ضروري"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "المجتمع",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#community", "#advanced", "#critical-thinking", "#ar", "#all-languages"]
    }
  ],
  // Portuguese (PT) - Professional translations (Brazilian)
  PT: [
    {
      question: "De acordo com a lição, o que é uma comunidade produtiva?",
      options: [
        "Apenas grupos online",
        "Uma rede de relacionamentos que apoia aprendizado, responsabilidade e objetivos de produtividade compartilhados",
        "Apenas colegas de trabalho",
        "Estrutura não é necessária"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Comunidade",
      questionType: QuestionType.RECALL,
      hashtags: ["#community", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, por que aprender com outros é valioso?",
      options: [
        "Não é valioso",
        "Acelera o aprendizado, fornece perspectivas diversas e cria responsabilidade",
        "Aplica-se apenas a certos tópicos",
        "Não requer esforço"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Aprendizado",
      questionType: QuestionType.RECALL,
      hashtags: ["#learning", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, como as redes produtivas devem ser construídas?",
      options: [
        "Estrutura não é necessária",
        "Através de construção intencional de relacionamentos, objetivos compartilhados e suporte mútuo para produtividade",
        "Apenas online",
        "Evitar todas as redes"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Rede",
      questionType: QuestionType.RECALL,
      hashtags: ["#network", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "Por que comunidade e redes são importantes para produtividade de acordo com a lição?",
      options: [
        "Eles eliminam trabalho individual",
        "Eles aceleram o aprendizado através de conhecimento compartilhado, fornecem responsabilidade, criam sistemas de suporte e permitem colaboração para objetivos de produtividade",
        "Aplicam-se apenas a certas pessoas",
        "Não requerem esforço"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Comunidade",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#community", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Uma pessoa trabalha sozinha sem suporte da comunidade, levando a aprendizado mais lento e falta de responsabilidade. De acordo com a lição, o que provavelmente está faltando?",
      options: [
        "Mais trabalho individual",
        "Uma comunidade e rede produtiva com relacionamentos, aprendizado compartilhado e suporte mútuo",
        "Menos comunidade",
        "Estrutura não é necessária"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Comunidade",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#community", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Você quer construir uma comunidade produtiva em torno de seus objetivos. De acordo com a lição, o que você deve estabelecer?",
      options: [
        "Apenas trabalhe sozinho",
        "Relacionamentos intencionais, oportunidades de aprendizado compartilhado, parcerias de responsabilidade e sistemas de suporte mútuo para produtividade",
        "Apenas relacionamentos",
        "Apenas aprendizado"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Comunidade",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#community", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Um profissional consistentemente trabalha isolado, aprende lentamente e falta responsabilidade, levando a progresso limitado. De acordo com a estrutura da lição, qual é o problema central?",
      options: [
        "Não há trabalho individual suficiente",
        "Falta de comunidade e rede - faltam relacionamentos, aprendizado compartilhado e sistemas de suporte que aceleram o aprendizado e criam responsabilidade para produtividade",
        "Muita comunidade",
        "Comunidade é desnecessária"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Comunidade",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#community", "#advanced", "#critical-thinking", "#pt", "#all-languages"]
    }
  ],
  // Hindi (HI) - Professional translations
  HI: [
    {
      question: "पाठ के अनुसार, उत्पादक समुदाय क्या है?",
      options: [
        "केवल ऑनलाइन समूह",
        "संबंधों का एक नेटवर्क जो सीखने, जवाबदेही, और साझा उत्पादकता लक्ष्यों का समर्थन करता है",
        "केवल काम के सहकर्मी",
        "संरचना की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "समुदाय",
      questionType: QuestionType.RECALL,
      hashtags: ["#community", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, दूसरों के साथ सीखना क्यों मूल्यवान है?",
      options: [
        "यह मूल्यवान नहीं है",
        "यह सीखने को तेज करता है, विविध दृष्टिकोण प्रदान करता है, और जवाबदेही बनाता है",
        "यह केवल कुछ विषयों पर लागू होता है",
        "इसके लिए प्रयास की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "सीखना",
      questionType: QuestionType.RECALL,
      hashtags: ["#learning", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, उत्पादक नेटवर्क कैसे बनाए जाने चाहिए?",
      options: [
        "संरचना की आवश्यकता नहीं है",
        "जानबूझकर संबंध निर्माण, साझा लक्ष्य, और उत्पादकता के लिए पारस्परिक समर्थन के माध्यम से",
        "केवल ऑनलाइन",
        "सभी नेटवर्क से बचें"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "नेटवर्क",
      questionType: QuestionType.RECALL,
      hashtags: ["#network", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार उत्पादकता के लिए समुदाय और नेटवर्क क्यों महत्वपूर्ण हैं?",
      options: [
        "वे व्यक्तिगत काम को समाप्त करते हैं",
        "वे साझा ज्ञान के माध्यम से सीखने को तेज करते हैं, जवाबदेही प्रदान करते हैं, समर्थन प्रणाली बनाते हैं, और उत्पादकता लक्ष्यों के लिए सहयोग सक्षम करते हैं",
        "वे केवल कुछ लोगों पर लागू होते हैं",
        "उन्हें प्रयास की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "समुदाय",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#community", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक व्यक्ति बिना समुदाय समर्थन के अकेले काम करता है, जिससे धीमी सीख और जवाबदेही की कमी होती है। पाठ के अनुसार, क्या संभवतः गायब है?",
      options: [
        "अधिक व्यक्तिगत काम",
        "संबंधों, साझा सीख, और पारस्परिक समर्थन के साथ एक उत्पादक समुदाय और नेटवर्क",
        "कम समुदाय",
        "संरचना की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "समुदाय",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#community", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "आप अपने लक्ष्यों के आसपास एक उत्पादक समुदाय बनाना चाहते हैं। पाठ के अनुसार, आपको क्या स्थापित करना चाहिए?",
      options: [
        "बस अकेले काम करें",
        "जानबूझकर संबंध, साझा सीखने के अवसर, जवाबदेही साझेदारी, और उत्पादकता के लिए पारस्परिक समर्थन प्रणाली",
        "केवल संबंध",
        "केवल सीखना"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "समुदाय",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#community", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक पेशेवर लगातार अकेले काम करता है, धीरे-धीरे सीखता है, और जवाबदेही की कमी है, जिससे सीमित प्रगति होती है। पाठ के ढांचे के अनुसार, मुख्य समस्या क्या है?",
      options: [
        "पर्याप्त व्यक्तिगत काम नहीं है",
        "समुदाय और नेटवर्क की कमी - संबंध, साझा सीख, और समर्थन प्रणाली गायब हैं जो सीखने को तेज करती हैं और उत्पादकता के लिए जवाबदेही बनाती हैं",
        "बहुत अधिक समुदाय",
        "समुदाय अनावश्यक है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "समुदाय",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#community", "#advanced", "#critical-thinking", "#hi", "#all-languages"]
    }
  ]
};

async function seedDay21Enhanced() {
  try {
    await connectDB();
    console.log('🌱 SEEDING DAY 21 ENHANCED QUIZ QUESTIONS\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    let totalQuestions = 0;
    let totalUpdated = 0;
    let totalCreated = 0;

    for (const lang of LANGUAGES) {
      const courseId = `${COURSE_ID_BASE}_${lang}`;
      const lessonId = `${COURSE_ID_BASE}_${lang}_DAY_21`;

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
      const questions = DAY21_QUESTIONS[lang];
      
      if (!questions || questions.length === 0) {
        console.error(`   ❌ ERROR: No questions defined for ${lang}! Questions MUST be in course language.`);
        throw new Error(`Missing translations for ${lang} - Day 21 questions must be in course language, not English fallback`);
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
    console.log(`\n✅ DAY 21 ENHANCEMENT COMPLETE!\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedDay21Enhanced();
