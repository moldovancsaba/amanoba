/**
 * Seed Day 25 Enhanced Quiz Questions
 * 
 * Purpose: Enhance Day 25 quizzes from 5 to 7 questions across all 10 languages
 * Why: Part of Quiz Quality Enhancement - Phase 1, Day 25
 * 
 * Lesson Topic: Skill Development (higher levels, new competencies)
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
const DAY_NUMBER = 25;
const LANGUAGES = ['HU', 'EN', 'TR', 'BG', 'PL', 'VI', 'ID', 'AR', 'PT', 'HI'];

/**
 * Day 25 Enhanced Questions - All Languages
 * Topic: Skill Development
 * Structure: 7 questions per language
 * Q1-Q3: Recall (foundational concepts)
 * Q4: Application (why skill development matters)
 * Q5: Application (scenario-based)
 * Q6: Application (practical implementation)
 * Q7: Critical Thinking (systems integration)
 */
const DAY25_QUESTIONS: Record<string, Array<{
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: QuestionDifficulty;
  category: string;
  questionType: QuestionType;
  hashtags: string[];
}>> = {
  EN: [
    // Q1: Skill development definition (RECALL)
    {
      question: "According to the lesson, what is skill development?",
      options: [
        "Only learning new tools",
        "The process of improving core competencies, building expertise, and advancing to higher levels of capability",
        "Only for students",
        "It's not relevant to productivity"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Skill Development",
      questionType: QuestionType.RECALL,
      hashtags: ["#skill-development", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q2: Competency building (RECALL)
    {
      question: "According to the lesson, how should core competencies be developed?",
      options: [
        "Only through reading",
        "Through deliberate practice, continuous learning, application in real situations, and systematic improvement",
        "Only through courses",
        "No structure needed"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Skill Development",
      questionType: QuestionType.RECALL,
      hashtags: ["#skill-development", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q3: Expertise growth (RECALL)
    {
      question: "According to the lesson, what is essential for building expertise?",
      options: [
        "Only natural talent",
        "Consistent practice, feedback, learning from experience, and progressive skill building",
        "Only formal education",
        "It requires no effort"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Skill Development",
      questionType: QuestionType.RECALL,
      hashtags: ["#skill-development", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q4: Why skill development matters (APPLICATION)
    {
      question: "Why is skill development important for productivity according to the lesson?",
      options: [
        "It eliminates all work",
        "It increases capability, enables higher-level work, improves efficiency, and creates competitive advantage through expertise",
        "It only applies to certain jobs",
        "It requires no investment"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Skill Development",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#skill-development", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q5: Skill building scenario (APPLICATION)
    {
      question: "You want to develop a new competency. According to the lesson, what should you do?",
      options: [
        "Only read about it",
        "Create a learning plan, practice deliberately, seek feedback, apply in real situations, and track progress systematically",
        "Only take one course",
        "Only practice occasionally"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Skill Development",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#skill-development", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q6: Building skill development system (APPLICATION)
    {
      question: "You want to systematically develop your skills. According to the lesson, what should you establish?",
      options: [
        "Just learn randomly",
        "A learning plan with goals, deliberate practice routines, feedback mechanisms, application opportunities, and progress tracking",
        "Only practice",
        "Only courses"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Skill Development",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#skill-development", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q7: Skill stagnation analysis (CRITICAL THINKING)
    {
      question: "A person has the same skill level for years, productivity plateaus, and can't take on higher-level work. According to the lesson's framework, what is the core issue?",
      options: [
        "Not enough work",
        "Lack of skill development - missing deliberate practice, learning systems, feedback mechanisms, and progressive skill building that enable capability growth",
        "Too much learning",
        "Skill development is unnecessary"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Skill Development",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#skill-development", "#advanced", "#critical-thinking", "#en", "#all-languages"]
    }
  ],
  // Hungarian (HU) - Professional translations
  HU: [
    {
      question: "A lecke szerint mi a készségfejlesztés?",
      options: [
        "Csak új eszközök tanulása",
        "A folyamat, amely javítja az alapvető kompetenciákat, építi a szakértelem, és magasabb szintű képességekre lép",
        "Csak diákoknak",
        "Nem releváns a termelékenységhez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Készségfejlesztés",
      questionType: QuestionType.RECALL,
      hashtags: ["#skill-development", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint hogyan kellene fejleszteni az alapvető kompetenciákat?",
      options: [
        "Csak olvasással",
        "Szándékos gyakorláson, folyamatos tanuláson, valós helyzetekben való alkalmazáson, és szisztematikus javításon keresztül",
        "Csak kurzusokon",
        "Nincs szükség struktúrára"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Készségfejlesztés",
      questionType: QuestionType.RECALL,
      hashtags: ["#skill-development", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint mi elengedhetetlen a szakértelem építéséhez?",
      options: [
        "Csak természetes tehetség",
        "Konzisztens gyakorlás, visszajelzés, tapasztalatból való tanulás, és progresszív készségépítés",
        "Csak formális oktatás",
        "Nem igényel erőfeszítést"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Készségfejlesztés",
      questionType: QuestionType.RECALL,
      hashtags: ["#skill-development", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "Miért fontos a készségfejlesztés a termelékenységhez a lecke szerint?",
      options: [
        "Kiküszöböli az összes munkát",
        "Növeli a képességet, lehetővé teszi a magasabb szintű munkát, javítja a hatékonyságot, és versenyelőnyt teremt a szakértelem révén",
        "Csak bizonyos munkákra vonatkozik",
        "Nem igényel befektetést"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Készségfejlesztés",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#skill-development", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Fejleszteni szeretnéd egy új kompetenciát. A lecke szerint mit kellene tenned?",
      options: [
        "Csak olvass róla",
        "Hozz létre egy tanulási tervet, gyakorolj szándékosan, keress visszajelzést, alkalmazd valós helyzetekben, és kövesd nyomon a haladást szisztematikusan",
        "Csak végy fel egy kurzust",
        "Csak gyakorolj alkalmanként"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Készségfejlesztés",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#skill-development", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Szisztematikusan szeretnéd fejleszteni a készségeidet. A lecke szerint mit kellene létrehozni?",
      options: [
        "Csak tanulj véletlenszerűen",
        "Egy tanulási terv célokkal, szándékos gyakorlási rutinokkal, visszajelzési mechanizmusokkal, alkalmazási lehetőségekkel, és haladás követéssel",
        "Csak gyakorlás",
        "Csak kurzusok"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Készségfejlesztés",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#skill-development", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy személy évekig ugyanazon a készségszinten van, a termelékenység stagnál, és nem tud magasabb szintű munkát vállalni. A lecke keretrendszere szerint mi a fő probléma?",
      options: [
        "Nincs elég munka",
        "Hiányzik a készségfejlesztés - hiányoznak a szándékos gyakorlás, tanulási rendszerek, visszajelzési mechanizmusok, és progresszív készségépítés, amelyek lehetővé teszik a képesség növekedést",
        "Túl sok tanulás",
        "A készségfejlesztés felesleges"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Készségfejlesztés",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#skill-development", "#advanced", "#critical-thinking", "#hu", "#all-languages"]
    }
  ],
  // Turkish (TR) - Professional translations
  TR: [
    {
      question: "Derse göre beceri geliştirme nedir?",
      options: [
        "Sadece yeni araçlar öğrenmek",
        "Temel yetkinlikleri geliştirme, uzmanlık oluşturma ve daha yüksek yetenek seviyelerine ilerleme süreci",
        "Sadece öğrenciler için",
        "Verimlilikle ilgili değil"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Beceri Geliştirme",
      questionType: QuestionType.RECALL,
      hashtags: ["#skill-development", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre temel yetkinlikler nasıl geliştirilmelidir?",
      options: [
        "Sadece okumayla",
        "Kasıtlı pratik, sürekli öğrenme, gerçek durumlarda uygulama ve sistematik iyileştirme yoluyla",
        "Sadece kurslarla",
        "Yapı gerekmez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Beceri Geliştirme",
      questionType: QuestionType.RECALL,
      hashtags: ["#skill-development", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre uzmanlık oluşturmak için ne gereklidir?",
      options: [
        "Sadece doğal yetenek",
        "Tutarlı pratik, geri bildirim, deneyimden öğrenme ve ilerici beceri oluşturma",
        "Sadece resmi eğitim",
        "Çaba gerektirmez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Beceri Geliştirme",
      questionType: QuestionType.RECALL,
      hashtags: ["#skill-development", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre beceri geliştirme verimlilik için neden önemlidir?",
      options: [
        "Tüm işi ortadan kaldırır",
        "Yeteneği artırır, daha yüksek seviyeli işe izin verir, verimliliği iyileştirir ve uzmanlık yoluyla rekabet avantajı yaratır",
        "Sadece belirli işlere uygulanır",
        "Yatırım gerektirmez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Beceri Geliştirme",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#skill-development", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Yeni bir yetkinlik geliştirmek istiyorsun. Derse göre ne yapmalısın?",
      options: [
        "Sadece oku",
        "Bir öğrenme planı oluştur, kasıtlı pratik yap, geri bildirim iste, gerçek durumlarda uygula ve ilerlemeyi sistematik olarak takip et",
        "Sadece bir kurs al",
        "Sadece ara sıra pratik yap"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Beceri Geliştirme",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#skill-development", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Becerilerini sistematik olarak geliştirmek istiyorsun. Derse göre ne kurmalısın?",
      options: [
        "Sadece rastgele öğren",
        "Hedeflerle bir öğrenme planı, kasıtlı pratik rutinleri, geri bildirim mekanizmaları, uygulama fırsatları ve ilerleme takibi",
        "Sadece pratik",
        "Sadece kurslar"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Beceri Geliştirme",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#skill-development", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir kişi yıllarca aynı beceri seviyesinde, verimlilik durgunlaşıyor ve daha yüksek seviyeli iş üstlenemiyor. Derse göre temel sorun nedir?",
      options: [
        "Yeterli iş yok",
        "Beceri geliştirme eksikliği - yetenek büyümesini sağlayan kasıtlı pratik, öğrenme sistemleri, geri bildirim mekanizmaları ve ilerici beceri oluşturma eksik",
        "Çok fazla öğrenme",
        "Beceri geliştirme gereksiz"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Beceri Geliştirme",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#skill-development", "#advanced", "#critical-thinking", "#tr", "#all-languages"]
    }
  ],
  // Bulgarian (BG) - Professional translations
  BG: [
    {
      question: "Според урока, какво е развитие на умения?",
      options: [
        "Само учене на нови инструменти",
        "Процесът на подобряване на основни компетентности, изграждане на експертиза и напредване към по-високи нива на способност",
        "Само за студенти",
        "Не е релевантно за производителност"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Развитие на Умения",
      questionType: QuestionType.RECALL,
      hashtags: ["#skill-development", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, как трябва да се развиват основни компетентности?",
      options: [
        "Само чрез четене",
        "Чрез целенасочена практика, непрекъснато обучение, прилагане в реални ситуации и систематично подобрение",
        "Само чрез курсове",
        "Няма нужда от структура"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Развитие на Умения",
      questionType: QuestionType.RECALL,
      hashtags: ["#skill-development", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, какво е необходимо за изграждане на експертиза?",
      options: [
        "Само природен талант",
        "Последователна практика, обратна връзка, учене от опит и прогресивно изграждане на умения",
        "Само формално образование",
        "Не изисква усилие"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Развитие на Умения",
      questionType: QuestionType.RECALL,
      hashtags: ["#skill-development", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Защо развитието на умения е важно за производителността според урока?",
      options: [
        "Премахва цялата работа",
        "Увеличава способността, позволява работа на по-високо ниво, подобрява ефективността и създава конкурентно предимство чрез експертиза",
        "Прилага се само за определени работи",
        "Не изисква инвестиция"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Развитие на Умения",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#skill-development", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Искаш да развиеш нова компетентност. Според урока, какво трябва да направиш?",
      options: [
        "Само прочети за нея",
        "Създай план за обучение, практикувай целенасочено, търси обратна връзка, прилагай в реални ситуации и следвай напредъка систематично",
        "Само запиши един курс",
        "Само практикувай от време на време"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Развитие на Умения",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#skill-development", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Искаш систематично да развиваш уменията си. Според урока, какво трябва да установиш?",
      options: [
        "Просто учи на случаен принцип",
        "План за обучение с цели, целенасочени практикуващи рутини, механизми за обратна връзка, възможности за прилагане и проследяване на напредъка",
        "Само практика",
        "Само курсове"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Развитие на Умения",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#skill-development", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Човек има същото ниво на умения години наред, производителността стагнира и не може да поеме работа на по-високо ниво. Според рамката на урока, какъв е основният проблем?",
      options: [
        "Няма достатъчно работа",
        "Липса на развитие на умения - липсват целенасочена практика, системи за обучение, механизми за обратна връзка и прогресивно изграждане на умения, които позволяват растеж на способността",
        "Твърде много обучение",
        "Развитието на умения е ненужно"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Развитие на Умения",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#skill-development", "#advanced", "#critical-thinking", "#bg", "#all-languages"]
    }
  ],
  // Polish (PL) - Professional translations
  PL: [
    {
      question: "Według lekcji, czym jest rozwój umiejętności?",
      options: [
        "Tylko uczenie się nowych narzędzi",
        "Proces poprawy podstawowych kompetencji, budowania ekspertyzy i postępu na wyższe poziomy zdolności",
        "Tylko dla studentów",
        "Nie jest istotny dla produktywności"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Rozwój Umiejętności",
      questionType: QuestionType.RECALL,
      hashtags: ["#skill-development", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, jak powinny być rozwijane podstawowe kompetencje?",
      options: [
        "Tylko przez czytanie",
        "Przez celową praktykę, ciągłe uczenie się, zastosowanie w rzeczywistych sytuacjach i systematyczną poprawę",
        "Tylko przez kursy",
        "Struktura nie jest potrzebna"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Rozwój Umiejętności",
      questionType: QuestionType.RECALL,
      hashtags: ["#skill-development", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, co jest niezbędne do budowania ekspertyzy?",
      options: [
        "Tylko naturalny talent",
        "Konsekwentna praktyka, feedback, uczenie się z doświadczenia i postępowe budowanie umiejętności",
        "Tylko formalna edukacja",
        "Nie wymaga wysiłku"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Rozwój Umiejętności",
      questionType: QuestionType.RECALL,
      hashtags: ["#skill-development", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Dlaczego rozwój umiejętności jest ważny dla produktywności według lekcji?",
      options: [
        "Eliminuje całą pracę",
        "Zwiększa zdolność, umożliwia pracę na wyższym poziomie, poprawia wydajność i tworzy przewagę konkurencyjną poprzez ekspertyzę",
        "Stosuje się tylko do określonych prac",
        "Nie wymaga inwestycji"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Rozwój Umiejętności",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#skill-development", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Chcesz rozwinąć nową kompetencję. Według lekcji, co powinieneś zrobić?",
      options: [
        "Tylko przeczytaj o tym",
        "Stwórz plan uczenia się, ćwicz celowo, szukaj feedbacku, stosuj w rzeczywistych sytuacjach i systematycznie śledź postęp",
        "Tylko weź jeden kurs",
        "Tylko ćwicz okazjonalnie"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Rozwój Umiejętności",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#skill-development", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Chcesz systematycznie rozwijać swoje umiejętności. Według lekcji, co powinieneś ustanowić?",
      options: [
        "Po prostu ucz się losowo",
        "Plan uczenia się z celami, celowe rutyny praktyczne, mechanizmy feedbacku, możliwości zastosowania i śledzenie postępu",
        "Tylko praktyka",
        "Tylko kursy"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Rozwój Umiejętności",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#skill-development", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Osoba ma ten sam poziom umiejętności przez lata, produktywność stagnuje i nie może podjąć pracy na wyższym poziomie. Według ram lekcji, jaki jest główny problem?",
      options: [
        "Nie ma wystarczającej pracy",
        "Brak rozwoju umiejętności - brakuje celowej praktyki, systemów uczenia się, mechanizmów feedbacku i postępowego budowania umiejętności, które umożliwiają wzrost zdolności",
        "Zbyt dużo uczenia się",
        "Rozwój umiejętności jest niepotrzebny"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Rozwój Umiejętności",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#skill-development", "#advanced", "#critical-thinking", "#pl", "#all-languages"]
    }
  ],
  // Vietnamese (VI) - Professional translations
  VI: [
    {
      question: "Theo bài học, phát triển kỹ năng là gì?",
      options: [
        "Chỉ học các công cụ mới",
        "Quá trình cải thiện năng lực cốt lõi, xây dựng chuyên môn, và tiến tới các cấp độ khả năng cao hơn",
        "Chỉ dành cho sinh viên",
        "Không liên quan đến năng suất"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Phát Triển Kỹ Năng",
      questionType: QuestionType.RECALL,
      hashtags: ["#skill-development", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, năng lực cốt lõi nên được phát triển như thế nào?",
      options: [
        "Chỉ qua đọc",
        "Thông qua thực hành có chủ ý, học tập liên tục, áp dụng trong tình huống thực tế, và cải thiện có hệ thống",
        "Chỉ qua các khóa học",
        "Không cần cấu trúc"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Phát Triển Kỹ Năng",
      questionType: QuestionType.RECALL,
      hashtags: ["#skill-development", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, điều gì cần thiết để xây dựng chuyên môn?",
      options: [
        "Chỉ tài năng tự nhiên",
        "Thực hành nhất quán, phản hồi, học từ kinh nghiệm, và xây dựng kỹ năng tiến bộ",
        "Chỉ giáo dục chính quy",
        "Không yêu cầu nỗ lực"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Phát Triển Kỹ Năng",
      questionType: QuestionType.RECALL,
      hashtags: ["#skill-development", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Tại sao phát triển kỹ năng quan trọng cho năng suất theo bài học?",
      options: [
        "Nó loại bỏ tất cả công việc",
        "Nó tăng khả năng, cho phép công việc cấp độ cao hơn, cải thiện hiệu quả, và tạo lợi thế cạnh tranh thông qua chuyên môn",
        "Nó chỉ áp dụng cho một số công việc",
        "Nó không yêu cầu đầu tư"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Phát Triển Kỹ Năng",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#skill-development", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Bạn muốn phát triển một năng lực mới. Theo bài học, bạn nên làm gì?",
      options: [
        "Chỉ đọc về nó",
        "Tạo kế hoạch học tập, thực hành có chủ ý, tìm phản hồi, áp dụng trong tình huống thực tế, và theo dõi tiến độ có hệ thống",
        "Chỉ tham gia một khóa học",
        "Chỉ thực hành thỉnh thoảng"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Phát Triển Kỹ Năng",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#skill-development", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Bạn muốn phát triển kỹ năng của mình một cách có hệ thống. Theo bài học, bạn nên thiết lập gì?",
      options: [
        "Chỉ học ngẫu nhiên",
        "Một kế hoạch học tập với mục tiêu, thói quen thực hành có chủ ý, cơ chế phản hồi, cơ hội áp dụng, và theo dõi tiến độ",
        "Chỉ thực hành",
        "Chỉ các khóa học"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Phát Triển Kỹ Năng",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#skill-development", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Một người có cùng mức kỹ năng trong nhiều năm, năng suất đình trệ, và không thể đảm nhận công việc cấp độ cao hơn. Theo khung của bài học, vấn đề cốt lõi là gì?",
      options: [
        "Không đủ công việc",
        "Thiếu phát triển kỹ năng - thiếu thực hành có chủ ý, hệ thống học tập, cơ chế phản hồi, và xây dựng kỹ năng tiến bộ cho phép tăng trưởng khả năng",
        "Quá nhiều học tập",
        "Phát triển kỹ năng là không cần thiết"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Phát Triển Kỹ Năng",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#skill-development", "#advanced", "#critical-thinking", "#vi", "#all-languages"]
    }
  ],
  // Indonesian (ID) - Professional translations
  ID: [
    {
      question: "Menurut pelajaran, apa itu pengembangan keterampilan?",
      options: [
        "Hanya mempelajari alat baru",
        "Proses meningkatkan kompetensi inti, membangun keahlian, dan maju ke tingkat kemampuan yang lebih tinggi",
        "Hanya untuk siswa",
        "Tidak relevan dengan produktivitas"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Pengembangan Keterampilan",
      questionType: QuestionType.RECALL,
      hashtags: ["#skill-development", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, bagaimana kompetensi inti harus dikembangkan?",
      options: [
        "Hanya melalui membaca",
        "Melalui latihan yang disengaja, pembelajaran berkelanjutan, penerapan dalam situasi nyata, dan peningkatan sistematis",
        "Hanya melalui kursus",
        "Tidak perlu struktur"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Pengembangan Keterampilan",
      questionType: QuestionType.RECALL,
      hashtags: ["#skill-development", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, apa yang penting untuk membangun keahlian?",
      options: [
        "Hanya bakat alami",
        "Praktik yang konsisten, umpan balik, belajar dari pengalaman, dan membangun keterampilan progresif",
        "Hanya pendidikan formal",
        "Tidak memerlukan upaya"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Pengembangan Keterampilan",
      questionType: QuestionType.RECALL,
      hashtags: ["#skill-development", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Mengapa pengembangan keterampilan penting untuk produktivitas menurut pelajaran?",
      options: [
        "Menghilangkan semua pekerjaan",
        "Meningkatkan kemampuan, memungkinkan pekerjaan tingkat yang lebih tinggi, meningkatkan efisiensi, dan menciptakan keunggulan kompetitif melalui keahlian",
        "Hanya berlaku untuk pekerjaan tertentu",
        "Tidak memerlukan investasi"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Pengembangan Keterampilan",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#skill-development", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Anda ingin mengembangkan kompetensi baru. Menurut pelajaran, apa yang harus Anda lakukan?",
      options: [
        "Hanya baca tentang itu",
        "Buat rencana pembelajaran, praktikkan dengan sengaja, cari umpan balik, terapkan dalam situasi nyata, dan lacak kemajuan secara sistematis",
        "Hanya ambil satu kursus",
        "Hanya praktik sesekali"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Pengembangan Keterampilan",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#skill-development", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Anda ingin mengembangkan keterampilan Anda secara sistematis. Menurut pelajaran, apa yang harus Anda tetapkan?",
      options: [
        "Hanya belajar secara acak",
        "Rencana pembelajaran dengan tujuan, rutinitas praktik yang disengaja, mekanisme umpan balik, peluang penerapan, dan pelacakan kemajuan",
        "Hanya praktik",
        "Hanya kursus"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Pengembangan Keterampilan",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#skill-development", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Seseorang memiliki tingkat keterampilan yang sama selama bertahun-tahun, produktivitas stagnan, dan tidak dapat mengambil pekerjaan tingkat yang lebih tinggi. Menurut kerangka pelajaran, apa masalah intinya?",
      options: [
        "Tidak ada cukup pekerjaan",
        "Kurangnya pengembangan keterampilan - kurang latihan yang disengaja, sistem pembelajaran, mekanisme umpan balik, dan membangun keterampilan progresif yang memungkinkan pertumbuhan kemampuan",
        "Terlalu banyak pembelajaran",
        "Pengembangan keterampilan tidak perlu"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Pengembangan Keterampilan",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#skill-development", "#advanced", "#critical-thinking", "#id", "#all-languages"]
    }
  ],
  // Arabic (AR) - Professional translations (RTL)
  AR: [
    {
      question: "وفقًا للدرس، ما هو تطوير المهارات?",
      options: [
        "فقط تعلم أدوات جديدة",
        "عملية تحسين الكفاءات الأساسية، بناء الخبرة، والتقدم إلى مستويات أعلى من القدرة",
        "فقط للطلاب",
        "ليس ذا صلة بالإنتاجية"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "تطوير المهارات",
      questionType: QuestionType.RECALL,
      hashtags: ["#skill-development", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، كيف يجب تطوير الكفاءات الأساسية?",
      options: [
        "فقط من خلال القراءة",
        "من خلال الممارسة المتعمدة، التعلم المستمر، التطبيق في المواقف الحقيقية، والتحسين المنهجي",
        "فقط من خلال الدورات",
        "لا حاجة للهيكل"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "تطوير المهارات",
      questionType: QuestionType.RECALL,
      hashtags: ["#skill-development", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، ما هو ضروري لبناء الخبرة?",
      options: [
        "فقط الموهبة الطبيعية",
        "الممارسة المتسقة، التغذية الراجعة، التعلم من التجربة، وبناء المهارات التدريجية",
        "فقط التعليم الرسمي",
        "لا يتطلب جهدًا"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "تطوير المهارات",
      questionType: QuestionType.RECALL,
      hashtags: ["#skill-development", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "لماذا تطوير المهارات مهم للإنتاجية وفقًا للدرس?",
      options: [
        "إنه يلغي كل العمل",
        "يزيد القدرة، يمكن من العمل على مستوى أعلى، يحسن الكفاءة، ويخلق ميزة تنافسية من خلال الخبرة",
        "ينطبق فقط على وظائف معينة",
        "لا يتطلب استثمارًا"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "تطوير المهارات",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#skill-development", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "تريد تطوير كفاءة جديدة. وفقًا للدرس، ماذا يجب أن تفعل?",
      options: [
        "فقط اقرأ عنها",
        "أنشئ خطة تعلم، مارس بعناية، اطلب التغذية الراجعة، طبق في المواقف الحقيقية، وتتبع التقدم بشكل منهجي",
        "فقط خذ دورة واحدة",
        "فقط مارس من حين لآخر"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "تطوير المهارات",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#skill-development", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "تريد تطوير مهاراتك بشكل منهجي. وفقًا للدرس، ماذا يجب أن تنشئ?",
      options: [
        "فقط تعلم عشوائيًا",
        "خطة تعلم مع أهداف، روتينات ممارسة متعمدة، آليات التغذية الراجعة، فرص التطبيق، وتتبع التقدم",
        "فقط الممارسة",
        "فقط الدورات"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "تطوير المهارات",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#skill-development", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "شخص لديه نفس مستوى المهارة لسنوات، والإنتاجية راكدة، ولا يمكنه تولي عمل على مستوى أعلى. وفقًا لإطار الدرس، ما هي المشكلة الأساسية?",
      options: [
        "لا يوجد عمل كافٍ",
        "نقص تطوير المهارات - نقص الممارسة المتعمدة، أنظمة التعلم، آليات التغذية الراجعة، وبناء المهارات التدريجية التي تمكن من نمو القدرة",
        "الكثير من التعلم",
        "تطوير المهارات غير ضروري"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "تطوير المهارات",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#skill-development", "#advanced", "#critical-thinking", "#ar", "#all-languages"]
    }
  ],
  // Portuguese (PT) - Professional translations (Brazilian)
  PT: [
    {
      question: "De acordo com a lição, o que é desenvolvimento de habilidades?",
      options: [
        "Apenas aprender novas ferramentas",
        "O processo de melhorar competências principais, construir expertise e avançar para níveis mais altos de capacidade",
        "Apenas para estudantes",
        "Não é relevante para produtividade"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Desenvolvimento de Habilidades",
      questionType: QuestionType.RECALL,
      hashtags: ["#skill-development", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, como as competências principais devem ser desenvolvidas?",
      options: [
        "Apenas através da leitura",
        "Através de prática deliberada, aprendizado contínuo, aplicação em situações reais e melhoria sistemática",
        "Apenas através de cursos",
        "Estrutura não é necessária"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Desenvolvimento de Habilidades",
      questionType: QuestionType.RECALL,
      hashtags: ["#skill-development", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, o que é essencial para construir expertise?",
      options: [
        "Apenas talento natural",
        "Prática consistente, feedback, aprendizado com experiência e construção progressiva de habilidades",
        "Apenas educação formal",
        "Não requer esforço"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Desenvolvimento de Habilidades",
      questionType: QuestionType.RECALL,
      hashtags: ["#skill-development", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "Por que desenvolvimento de habilidades é importante para produtividade de acordo com a lição?",
      options: [
        "Elimina todo o trabalho",
        "Aumenta a capacidade, permite trabalho de nível mais alto, melhora a eficiência e cria vantagem competitiva através da expertise",
        "Aplica-se apenas a certos trabalhos",
        "Não requer investimento"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Desenvolvimento de Habilidades",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#skill-development", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Você quer desenvolver uma nova competência. De acordo com a lição, o que você deve fazer?",
      options: [
        "Apenas leia sobre isso",
        "Crie um plano de aprendizado, pratique deliberadamente, busque feedback, aplique em situações reais e acompanhe o progresso sistematicamente",
        "Apenas faça um curso",
        "Apenas pratique ocasionalmente"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Desenvolvimento de Habilidades",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#skill-development", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Você quer desenvolver suas habilidades sistematicamente. De acordo com a lição, o que você deve estabelecer?",
      options: [
        "Apenas aprenda aleatoriamente",
        "Um plano de aprendizado com objetivos, rotinas de prática deliberada, mecanismos de feedback, oportunidades de aplicação e acompanhamento de progresso",
        "Apenas prática",
        "Apenas cursos"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Desenvolvimento de Habilidades",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#skill-development", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Uma pessoa tem o mesmo nível de habilidade por anos, a produtividade estagna e não pode assumir trabalho de nível mais alto. De acordo com a estrutura da lição, qual é o problema central?",
      options: [
        "Não há trabalho suficiente",
        "Falta de desenvolvimento de habilidades - falta prática deliberada, sistemas de aprendizado, mecanismos de feedback e construção progressiva de habilidades que permitem crescimento de capacidade",
        "Muito aprendizado",
        "Desenvolvimento de habilidades é desnecessário"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Desenvolvimento de Habilidades",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#skill-development", "#advanced", "#critical-thinking", "#pt", "#all-languages"]
    }
  ],
  // Hindi (HI) - Professional translations
  HI: [
    {
      question: "पाठ के अनुसार, कौशल विकास क्या है?",
      options: [
        "केवल नए उपकरण सीखना",
        "मूल क्षमताओं में सुधार, विशेषज्ञता बनाने, और क्षमता के उच्च स्तरों पर आगे बढ़ने की प्रक्रिया",
        "केवल छात्रों के लिए",
        "यह उत्पादकता के लिए प्रासंगिक नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "कौशल विकास",
      questionType: QuestionType.RECALL,
      hashtags: ["#skill-development", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, मूल क्षमताओं को कैसे विकसित किया जाना चाहिए?",
      options: [
        "केवल पढ़ने के माध्यम से",
        "जानबूझकर अभ्यास, निरंतर सीखने, वास्तविक स्थितियों में अनुप्रयोग, और व्यवस्थित सुधार के माध्यम से",
        "केवल पाठ्यक्रमों के माध्यम से",
        "संरचना की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "कौशल विकास",
      questionType: QuestionType.RECALL,
      hashtags: ["#skill-development", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, विशेषज्ञता बनाने के लिए क्या आवश्यक है?",
      options: [
        "केवल प्राकृतिक प्रतिभा",
        "निरंतर अभ्यास, प्रतिक्रिया, अनुभव से सीखना, और प्रगतिशील कौशल निर्माण",
        "केवल औपचारिक शिक्षा",
        "इसके लिए प्रयास की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "कौशल विकास",
      questionType: QuestionType.RECALL,
      hashtags: ["#skill-development", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार उत्पादकता के लिए कौशल विकास क्यों महत्वपूर्ण है?",
      options: [
        "यह सभी काम को समाप्त करता है",
        "यह क्षमता बढ़ाता है, उच्च-स्तरीय काम सक्षम करता है, दक्षता में सुधार करता है, और विशेषज्ञता के माध्यम से प्रतिस्पर्धात्मक लाभ बनाता है",
        "यह केवल कुछ नौकरियों पर लागू होता है",
        "इसके लिए निवेश की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "कौशल विकास",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#skill-development", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "आप एक नई क्षमता विकसित करना चाहते हैं। पाठ के अनुसार, आपको क्या करना चाहिए?",
      options: [
        "बस इसके बारे में पढ़ें",
        "एक सीखने की योजना बनाएं, जानबूझकर अभ्यास करें, प्रतिक्रिया मांगें, वास्तविक स्थितियों में लागू करें, और प्रगति को व्यवस्थित रूप से ट्रैक करें",
        "बस एक पाठ्यक्रम लें",
        "बस कभी-कभी अभ्यास करें"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "कौशल विकास",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#skill-development", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "आप अपने कौशल को व्यवस्थित रूप से विकसित करना चाहते हैं। पाठ के अनुसार, आपको क्या स्थापित करना चाहिए?",
      options: [
        "बस यादृच्छिक रूप से सीखें",
        "लक्ष्यों के साथ एक सीखने की योजना, जानबूझकर अभ्यास दिनचर्या, प्रतिक्रिया तंत्र, अनुप्रयोग अवसर, और प्रगति ट्रैकिंग",
        "केवल अभ्यास",
        "केवल पाठ्यक्रम"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "कौशल विकास",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#skill-development", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक व्यक्ति के पास वर्षों तक समान कौशल स्तर है, उत्पादकता स्थिर हो जाती है, और उच्च-स्तरीय काम नहीं ले सकता है। पाठ के ढांचे के अनुसार, मुख्य समस्या क्या है?",
      options: [
        "पर्याप्त काम नहीं है",
        "कौशल विकास की कमी - जानबूझकर अभ्यास, सीखने की प्रणाली, प्रतिक्रिया तंत्र, और प्रगतिशील कौशल निर्माण गायब हैं जो क्षमता वृद्धि सक्षम करते हैं",
        "बहुत अधिक सीखना",
        "कौशल विकास अनावश्यक है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "कौशल विकास",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#skill-development", "#advanced", "#critical-thinking", "#hi", "#all-languages"]
    }
  ]
};

async function seedDay25Enhanced() {
  try {
    await connectDB();
    console.log('🌱 SEEDING DAY 25 ENHANCED QUIZ QUESTIONS\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    let totalQuestions = 0;
    let totalUpdated = 0;
    let totalCreated = 0;

    for (const lang of LANGUAGES) {
      const courseId = `${COURSE_ID_BASE}_${lang}`;
      const lessonId = `${COURSE_ID_BASE}_${lang}_DAY_25`;

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
      const questions = DAY25_QUESTIONS[lang];
      
      if (!questions || questions.length === 0) {
        console.error(`   ❌ ERROR: No questions defined for ${lang}! Questions MUST be in course language.`);
        throw new Error(`Missing translations for ${lang} - Day 25 questions must be in course language, not English fallback`);
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
    console.log(`\n✅ DAY 25 ENHANCEMENT COMPLETE!\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedDay25Enhanced();
