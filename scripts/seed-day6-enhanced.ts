/**
 * Seed Day 6 Enhanced Quiz Questions
 * 
 * Purpose: Enhance Day 6 quizzes from 5 to 7 questions across all 10 languages
 * Why: Part of Quiz Quality Enhancement - Phase 1, Day 6
 * 
 * Lesson Topic: Capture: inboxes, triggers list, capture habits
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
const DAY_NUMBER = 6;
const LANGUAGES = ['HU', 'EN', 'TR', 'BG', 'PL', 'VI', 'ID', 'AR', 'PT', 'HI'];

/**
 * Day 6 Enhanced Questions - All Languages
 * Topic: Capture (inboxes, triggers list, capture habits)
 * Structure: 7 questions per language
 * Q1-Q3: Keep (Recall - foundational concepts)
 * Q4: Rewritten (Application - from definition to purpose)
 * Q5: Keep (Application - scenario-based)
 * Q6: New (Application - practical implementation)
 * Q7: New (Critical Thinking - systems integration)
 */
const DAY6_QUESTIONS: Record<string, Array<{
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: QuestionDifficulty;
  category: string;
  questionType: QuestionType;
  hashtags: string[];
}>> = {
  EN: [
    // Q1: What is inbox (RECALL - Keep)
    {
      question: "According to the lesson, what is an inbox?",
      options: [
        "A place where all incoming information collects",
        "An email address",
        "A task list",
        "A calendar"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Capture",
      questionType: QuestionType.RECALL,
      hashtags: ["#capture", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q2: How often empty inboxes (RECALL - Keep)
    {
      question: "According to the lesson, how often should you empty inboxes?",
      options: [
        "Once a week",
        "Once a month",
        "At least once daily",
        "Never"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Capture",
      questionType: QuestionType.RECALL,
      hashtags: ["#capture", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q3: What is triggers list (RECALL - Keep)
    {
      question: "According to the lesson, what is a triggers list?",
      options: [
        "A list that reminds you when to capture",
        "An email list",
        "A task list",
        "A calendar"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Capture",
      questionType: QuestionType.RECALL,
      hashtags: ["#capture", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q4: Why capture matters (APPLICATION - Rewritten from definition)
    {
      question: "Why is capturing information critical according to the lesson's principle?",
      options: [
        "It makes information automatically organized",
        "If it's not captured, it's lost - and if it's lost, it can't be managed",
        "It reduces the need for inboxes",
        "It only applies to email"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Capture",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#capture", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q5: How to develop capture habit (APPLICATION - Keep)
    {
      question: "According to the lesson, how do you develop a capture habit?",
      options: [
        "Use it once",
        "Repeat until it becomes automatic",
        "Never use it",
        "Only use it on weekends"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Capture",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#capture", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q6: Using triggers and inboxes together (APPLICATION - New)
    {
      question: "A person has multiple inboxes but forgets to capture action items after meetings. According to the lesson, what should they do?",
      options: [
        "Create more inboxes",
        "Use a triggers list to remind them to capture after meetings, and develop a capture habit",
        "Stop attending meetings",
        "Only capture on certain days"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Capture",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#capture", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q7: Capture system integration (CRITICAL THINKING - New)
    {
      question: "A manager has inboxes set up but information still gets lost because they don't consistently use triggers or develop capture habits. According to the lesson's framework, what does this demonstrate?",
      options: [
        "Optimal capture system implementation",
        "An incomplete capture system - having inboxes alone is insufficient without triggers and habits",
        "Good email management",
        "Efficient task organization"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Capture",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#capture", "#advanced", "#critical-thinking", "#en", "#all-languages"]
    }
  ],
  // Hungarian translations
  HU: [
    {
      question: "A lecke szerint mi az inbox?",
      options: [
        "Egy hely, ahol minden bejövő információ összegyűlik",
        "Egy email cím",
        "Egy feladatlista",
        "Egy naptár"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Rögzítés",
      questionType: QuestionType.RECALL,
      hashtags: ["#capture", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint milyen gyakran kell üríteni az inboxokat?",
      options: [
        "Hetente egyszer",
        "Havonta egyszer",
        "Naponta legalább egyszer",
        "Soha"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Rögzítés",
      questionType: QuestionType.RECALL,
      hashtags: ["#capture", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint mi a trigger lista?",
      options: [
        "Egy lista, amely emlékeztet, mikor rögzíteni kell",
        "Egy email lista",
        "Egy feladatlista",
        "Egy naptár"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Rögzítés",
      questionType: QuestionType.RECALL,
      hashtags: ["#capture", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "Miért kritikus az információk rögzítése a lecke elve szerint?",
      options: [
        "Automatikusan rendszerezi az információkat",
        "Ha nincs rögzítve, elveszik - és ha elveszik, nem lehet kezelni",
        "Csökkenti az inboxok szükségességét",
        "Csak az emailre vonatkozik"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Rögzítés",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#capture", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint hogyan alakítasz ki rögzítési szokást?",
      options: [
        "Egyszer használod",
        "Ismétled, amíg automatikussá nem válik",
        "Soha nem használod",
        "Csak hétvégén használod"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Rögzítés",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#capture", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy személynek több inboxja van, de elfelejti rögzíteni az action itemeket meetingek után. A lecke szerint mit kellene tennie?",
      options: [
        "Több inbox létrehozása",
        "Trigger lista használata, amely emlékezteti, hogy rögzítsen meetingek után, és rögzítési szokás kialakítása",
        "Meetingekre járás abbahagyása",
        "Csak bizonyos napokon rögzítés"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Rögzítés",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#capture", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy menedzsernek be van állítva az inboxok, de az információk még mindig elvesznek, mert nem következetesen használják a triggereket vagy nem alakítanak ki rögzítési szokásokat. A lecke keretrendszere szerint mit mutat ez?",
      options: [
        "Optimális rögzítési rendszer megvalósítás",
        "Hiányos rögzítési rendszer - az inboxok önmagukban elégtelenek triggerek és szokások nélkül",
        "Jó email kezelés",
        "Hatékony feladat szervezés"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Rögzítés",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#capture", "#advanced", "#critical-thinking", "#hu", "#all-languages"]
    }
  ],
  // Turkish (TR) - Professional translations
  TR: [
    {
      question: "Derse göre gelen kutusu nedir?",
      options: [
        "Tüm gelen bilgilerin toplandığı bir yer",
        "Bir e-posta adresi",
        "Bir görev listesi",
        "Bir takvim"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Yakalama",
      questionType: QuestionType.RECALL,
      hashtags: ["#capture", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre gelen kutularını ne sıklıkla boşaltmalısınız?",
      options: [
        "Haftada bir",
        "Ayda bir",
        "Günde en az bir kez",
        "Asla"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Yakalama",
      questionType: QuestionType.RECALL,
      hashtags: ["#capture", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre tetikleyici listesi nedir?",
      options: [
        "Ne zaman yakalamanız gerektiğini hatırlatan bir liste",
        "Bir e-posta listesi",
        "Bir görev listesi",
        "Bir takvim"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Yakalama",
      questionType: QuestionType.RECALL,
      hashtags: ["#capture", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Dersin ilkesine göre bilgi yakalama neden kritiktir?",
      options: [
        "Bilgileri otomatik olarak düzenler",
        "Yakalanmazsa kaybolur - ve kaybolursa yönetilemez",
        "Gelen kutularına olan ihtiyacı azaltır",
        "Sadece e-postaya uygulanır"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Yakalama",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#capture", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre yakalama alışkanlığı nasıl geliştirilir?",
      options: [
        "Bir kez kullanın",
        "Otomatik hale gelene kadar tekrarlayın",
        "Asla kullanmayın",
        "Sadece hafta sonları kullanın"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Yakalama",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#capture", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir kişinin birden fazla gelen kutusu var ama toplantılardan sonra aksiyon öğelerini yakalamayı unutuyor. Derse göre ne yapmalılar?",
      options: [
        "Daha fazla gelen kutusu oluşturmak",
        "Toplantılardan sonra yakalamayı hatırlatan bir tetikleyici listesi kullanmak ve yakalama alışkanlığı geliştirmek",
        "Toplantılara katılmayı bırakmak",
        "Sadece belirli günlerde yakalamak"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Yakalama",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#capture", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir yöneticinin gelen kutuları kurulmuş ama bilgiler hala kayboluyor çünkü tetikleyicileri tutarlı bir şekilde kullanmıyorlar veya yakalama alışkanlıkları geliştirmiyorlar. Dersin çerçevesine göre bu neyi gösterir?",
      options: [
        "Optimal yakalama sistemi uygulaması",
        "Eksik bir yakalama sistemi - tetikleyiciler ve alışkanlıklar olmadan sadece gelen kutuları yeterli değildir",
        "İyi e-posta yönetimi",
        "Verimli görev organizasyonu"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Yakalama",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#capture", "#advanced", "#critical-thinking", "#tr", "#all-languages"]
    }
  ],
  // Bulgarian (BG) - Professional translations
  BG: [
    {
      question: "Според урока, какво е входяща кутия?",
      options: [
        "Място, където се събира цялата входяща информация",
        "Имейл адрес",
        "Списък със задачи",
        "Календар"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Улавяне",
      questionType: QuestionType.RECALL,
      hashtags: ["#capture", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, колко често трябва да изпразвате входящите кутии?",
      options: [
        "Веднъж седмично",
        "Веднъж месечно",
        "Поне веднъж дневно",
        "Никога"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Улавяне",
      questionType: QuestionType.RECALL,
      hashtags: ["#capture", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, какво е списък с тригери?",
      options: [
        "Списък, който ви напомня кога да уловите",
        "Имейл списък",
        "Списък със задачи",
        "Календар"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Улавяне",
      questionType: QuestionType.RECALL,
      hashtags: ["#capture", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Защо улавянето на информация е критично според принципа на урока?",
      options: [
        "Автоматично организира информацията",
        "Ако не е уловена, изгубва се - и ако е изгубена, не може да се управлява",
        "Намалява необходимостта от входящи кутии",
        "Прилага се само за имейл"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Улавяне",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#capture", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, как развивате навик за улавяне?",
      options: [
        "Използвайте го веднъж",
        "Повтаряйте, докато не стане автоматично",
        "Никога не го използвайте",
        "Използвайте го само през уикенда"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Улавяне",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#capture", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Човек има множество входящи кутии, но забравя да улови елементи за действие след срещи. Според урока, какво трябва да направят?",
      options: [
        "Създаване на повече входящи кутии",
        "Използване на списък с тригери, който ги напомня да уловят след срещи, и развитие на навик за улавяне",
        "Спиране на посещаване на срещи",
        "Улавяне само в определени дни"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Улавяне",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#capture", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Мениджърът има настроени входящи кутии, но информацията все още се губи, защото не използват последователно тригери или не развиват навици за улавяне. Според рамката на урока, какво демонстрира това?",
      options: [
        "Оптимална реализация на система за улавяне",
        "Непълна система за улавяне - само входящите кутии са недостатъчни без тригери и навици",
        "Добро управление на имейл",
        "Ефективна организация на задачи"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Улавяне",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#capture", "#advanced", "#critical-thinking", "#bg", "#all-languages"]
    }
  ],
  // Polish (PL) - Professional translations
  PL: [
    {
      question: "Według lekcji, czym jest skrzynka odbiorcza?",
      options: [
        "Miejsce, gdzie zbierają się wszystkie przychodzące informacje",
        "Adres e-mail",
        "Lista zadań",
        "Kalendarz"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Przechwytywanie",
      questionType: QuestionType.RECALL,
      hashtags: ["#capture", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, jak często powinieneś opróżniać skrzynki odbiorcze?",
      options: [
        "Raz w tygodniu",
        "Raz w miesiącu",
        "Przynajmniej raz dziennie",
        "Nigdy"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Przechwytywanie",
      questionType: QuestionType.RECALL,
      hashtags: ["#capture", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, czym jest lista wyzwalaczy?",
      options: [
        "Lista, która przypomina, kiedy przechwycić",
        "Lista e-mail",
        "Lista zadań",
        "Kalendarz"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Przechwytywanie",
      questionType: QuestionType.RECALL,
      hashtags: ["#capture", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Dlaczego przechwytywanie informacji jest krytyczne według zasady lekcji?",
      options: [
        "Automatycznie organizuje informacje",
        "Jeśli nie jest przechwycone, jest utracone - i jeśli jest utracone, nie może być zarządzane",
        "Zmniejsza potrzebę skrzynek odbiorczych",
        "Dotyczy tylko e-maila"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Przechwytywanie",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#capture", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, jak rozwijasz nawyk przechwytywania?",
      options: [
        "Użyj go raz",
        "Powtarzaj, aż stanie się automatyczne",
        "Nigdy nie używaj",
        "Używaj tylko w weekendy"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Przechwytywanie",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#capture", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Osoba ma wiele skrzynek odbiorczych, ale zapomina przechwycić elementy działania po spotkaniach. Według lekcji, co powinni zrobić?",
      options: [
        "Utworzyć więcej skrzynek odbiorczych",
        "Użyć listy wyzwalaczy, która przypomina im o przechwytywaniu po spotkaniach, i rozwinąć nawyk przechwytywania",
        "Przestać uczestniczyć w spotkaniach",
        "Przechwytywać tylko w określone dni"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Przechwytywanie",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#capture", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Menedżer ma skonfigurowane skrzynki odbiorcze, ale informacje nadal się gubią, ponieważ nie używają konsekwentnie wyzwalaczy ani nie rozwijają nawyków przechwytywania. Według ram lekcji, co to demonstruje?",
      options: [
        "Optymalna implementacja systemu przechwytywania",
        "Niekompletny system przechwytywania - same skrzynki odbiorcze są niewystarczające bez wyzwalaczy i nawyków",
        "Dobre zarządzanie e-mailem",
        "Skuteczna organizacja zadań"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Przechwytywanie",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#capture", "#advanced", "#critical-thinking", "#pl", "#all-languages"]
    }
  ],
  // Vietnamese (VI) - Professional translations
  VI: [
    {
      question: "Theo bài học, hộp thư đến là gì?",
      options: [
        "Nơi tất cả thông tin đến được thu thập",
        "Địa chỉ email",
        "Danh sách nhiệm vụ",
        "Lịch"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Thu thập",
      questionType: QuestionType.RECALL,
      hashtags: ["#capture", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, bạn nên làm trống hộp thư đến bao lâu một lần?",
      options: [
        "Một lần một tuần",
        "Một lần một tháng",
        "Ít nhất một lần mỗi ngày",
        "Không bao giờ"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Thu thập",
      questionType: QuestionType.RECALL,
      hashtags: ["#capture", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, danh sách kích hoạt là gì?",
      options: [
        "Danh sách nhắc nhở bạn khi nào cần thu thập",
        "Danh sách email",
        "Danh sách nhiệm vụ",
        "Lịch"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Thu thập",
      questionType: QuestionType.RECALL,
      hashtags: ["#capture", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Tại sao việc thu thập thông tin là quan trọng theo nguyên tắc của bài học?",
      options: [
        "Nó tự động tổ chức thông tin",
        "Nếu không được thu thập, nó sẽ mất - và nếu mất, nó không thể được quản lý",
        "Nó giảm nhu cầu về hộp thư đến",
        "Nó chỉ áp dụng cho email"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Thu thập",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#capture", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, làm thế nào để phát triển thói quen thu thập?",
      options: [
        "Sử dụng nó một lần",
        "Lặp lại cho đến khi trở nên tự động",
        "Không bao giờ sử dụng",
        "Chỉ sử dụng vào cuối tuần"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Thu thập",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#capture", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Một người có nhiều hộp thư đến nhưng quên thu thập các mục hành động sau cuộc họp. Theo bài học, họ nên làm gì?",
      options: [
        "Tạo thêm hộp thư đến",
        "Sử dụng danh sách kích hoạt để nhắc nhở họ thu thập sau cuộc họp và phát triển thói quen thu thập",
        "Ngừng tham dự cuộc họp",
        "Chỉ thu thập vào những ngày nhất định"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Thu thập",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#capture", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Một người quản lý đã thiết lập hộp thư đến nhưng thông tin vẫn bị mất vì họ không sử dụng kích hoạt một cách nhất quán hoặc phát triển thói quen thu thập. Theo khung của bài học, điều này thể hiện điều gì?",
      options: [
        "Triển khai hệ thống thu thập tối ưu",
        "Hệ thống thu thập không hoàn chỉnh - chỉ có hộp thư đến là không đủ nếu không có kích hoạt và thói quen",
        "Quản lý email tốt",
        "Tổ chức nhiệm vụ hiệu quả"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Thu thập",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#capture", "#advanced", "#critical-thinking", "#vi", "#all-languages"]
    }
  ],
  // Indonesian (ID) - Professional translations
  ID: [
    {
      question: "Menurut pelajaran, apa itu kotak masuk?",
      options: [
        "Tempat di mana semua informasi yang masuk dikumpulkan",
        "Alamat email",
        "Daftar tugas",
        "Kalender"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Penangkapan",
      questionType: QuestionType.RECALL,
      hashtags: ["#capture", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, seberapa sering Anda harus mengosongkan kotak masuk?",
      options: [
        "Sekali seminggu",
        "Sekali sebulan",
        "Setidaknya sekali sehari",
        "Tidak pernah"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Penangkapan",
      questionType: QuestionType.RECALL,
      hashtags: ["#capture", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, apa itu daftar pemicu?",
      options: [
        "Daftar yang mengingatkan Anda kapan harus menangkap",
        "Daftar email",
        "Daftar tugas",
        "Kalender"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Penangkapan",
      questionType: QuestionType.RECALL,
      hashtags: ["#capture", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Mengapa menangkap informasi penting menurut prinsip pelajaran?",
      options: [
        "Ini secara otomatis mengatur informasi",
        "Jika tidak ditangkap, hilang - dan jika hilang, tidak dapat dikelola",
        "Ini mengurangi kebutuhan akan kotak masuk",
        "Ini hanya berlaku untuk email"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Penangkapan",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#capture", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, bagaimana Anda mengembangkan kebiasaan penangkapan?",
      options: [
        "Gunakan sekali",
        "Ulangi sampai menjadi otomatis",
        "Jangan pernah gunakan",
        "Hanya gunakan di akhir pekan"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Penangkapan",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#capture", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Seseorang memiliki beberapa kotak masuk tetapi lupa menangkap item tindakan setelah rapat. Menurut pelajaran, apa yang harus mereka lakukan?",
      options: [
        "Membuat lebih banyak kotak masuk",
        "Menggunakan daftar pemicu yang mengingatkan mereka untuk menangkap setelah rapat, dan mengembangkan kebiasaan penangkapan",
        "Berhenti menghadiri rapat",
        "Hanya menangkap pada hari tertentu"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Penangkapan",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#capture", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Seorang manajer memiliki kotak masuk yang disetel tetapi informasi masih hilang karena mereka tidak secara konsisten menggunakan pemicu atau mengembangkan kebiasaan penangkapan. Menurut kerangka pelajaran, apa yang ditunjukkan ini?",
      options: [
        "Implementasi sistem penangkapan yang optimal",
        "Sistem penangkapan yang tidak lengkap - hanya kotak masuk saja tidak cukup tanpa pemicu dan kebiasaan",
        "Manajemen email yang baik",
        "Organisasi tugas yang efisien"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Penangkapan",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#capture", "#advanced", "#critical-thinking", "#id", "#all-languages"]
    }
  ],
  // Arabic (AR) - Professional translations (RTL)
  AR: [
    {
      question: "وفقًا للدرس، ما هو صندوق الوارد؟",
      options: [
        "مكان حيث تتراكم جميع المعلومات الواردة",
        "عنوان بريد إلكتروني",
        "قائمة مهام",
        "تقويم"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "التقاط",
      questionType: QuestionType.RECALL,
      hashtags: ["#capture", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، كم مرة يجب أن تفرغ صناديق الوارد؟",
      options: [
        "مرة واحدة في الأسبوع",
        "مرة واحدة في الشهر",
        "مرة واحدة على الأقل يوميًا",
        "أبدًا"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "التقاط",
      questionType: QuestionType.RECALL,
      hashtags: ["#capture", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، ما هي قائمة المحفزات؟",
      options: [
        "قائمة تذكرك متى تلتقط",
        "قائمة بريد إلكتروني",
        "قائمة مهام",
        "تقويم"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "التقاط",
      questionType: QuestionType.RECALL,
      hashtags: ["#capture", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "لماذا التقاط المعلومات مهم وفقًا لمبدأ الدرس؟",
      options: [
        "ينظم المعلومات تلقائيًا",
        "إذا لم يتم التقاطها، تضيع - وإذا ضاعت، لا يمكن إدارتها",
        "يقلل من الحاجة إلى صناديق الوارد",
        "ينطبق فقط على البريد الإلكتروني"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "التقاط",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#capture", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، كيف تطور عادة التقاط؟",
      options: [
        "استخدمها مرة واحدة",
        "كرر حتى تصبح تلقائية",
        "لا تستخدمها أبدًا",
        "استخدمها فقط في عطلة نهاية الأسبوع"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "التقاط",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#capture", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "شخص لديه عدة صناديق وارد لكنه ينسى التقاط عناصر الإجراء بعد الاجتماعات. وفقًا للدرس، ماذا يجب أن يفعلوا؟",
      options: [
        "إنشاء المزيد من صناديق الوارد",
        "استخدام قائمة محفزات تذكرهم بالتقاط بعد الاجتماعات، وتطوير عادة التقاط",
        "التوقف عن حضور الاجتماعات",
        "التقاط فقط في أيام معينة"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "التقاط",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#capture", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "لدى مدير صناديق وارد معدة لكن المعلومات لا تزال تضيع لأنهم لا يستخدمون المحفزات بشكل متسق أو يطورون عادات التقاط. وفقًا لإطار الدرس، ماذا يوضح هذا؟",
      options: [
        "تنفيذ نظام التقاط مثالي",
        "نظام التقاط غير مكتمل - صناديق الوارد وحدها غير كافية بدون محفزات وعادات",
        "إدارة بريد إلكتروني جيدة",
        "تنظيم مهام فعال"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "التقاط",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#capture", "#advanced", "#critical-thinking", "#ar", "#all-languages"]
    }
  ],
  // Portuguese (PT) - Professional translations (Brazilian)
  PT: [
    {
      question: "De acordo com a lição, o que é uma caixa de entrada?",
      options: [
        "Um lugar onde todas as informações recebidas se acumulam",
        "Um endereço de e-mail",
        "Uma lista de tarefas",
        "Um calendário"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Captura",
      questionType: QuestionType.RECALL,
      hashtags: ["#capture", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, com que frequência você deve esvaziar as caixas de entrada?",
      options: [
        "Uma vez por semana",
        "Uma vez por mês",
        "Pelo menos uma vez por dia",
        "Nunca"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Captura",
      questionType: QuestionType.RECALL,
      hashtags: ["#capture", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, o que é uma lista de gatilhos?",
      options: [
        "Uma lista que lembra quando capturar",
        "Uma lista de e-mail",
        "Uma lista de tarefas",
        "Um calendário"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Captura",
      questionType: QuestionType.RECALL,
      hashtags: ["#capture", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "Por que capturar informações é crítico de acordo com o princípio da lição?",
      options: [
        "Organiza informações automaticamente",
        "Se não for capturado, está perdido - e se estiver perdido, não pode ser gerenciado",
        "Reduz a necessidade de caixas de entrada",
        "Aplica-se apenas ao e-mail"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Captura",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#capture", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, como você desenvolve um hábito de captura?",
      options: [
        "Use uma vez",
        "Repita até se tornar automático",
        "Nunca use",
        "Use apenas nos fins de semana"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Captura",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#capture", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Uma pessoa tem várias caixas de entrada, mas esquece de capturar itens de ação após reuniões. De acordo com a lição, o que devem fazer?",
      options: [
        "Criar mais caixas de entrada",
        "Usar uma lista de gatilhos que os lembra de capturar após reuniões e desenvolver um hábito de captura",
        "Parar de participar de reuniões",
        "Capturar apenas em dias específicos"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Captura",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#capture", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Um gerente tem caixas de entrada configuradas, mas as informações ainda se perdem porque não usam consistentemente gatilhos ou desenvolvem hábitos de captura. De acordo com a estrutura da lição, o que isso demonstra?",
      options: [
        "Implementação ideal do sistema de captura",
        "Um sistema de captura incompleto - apenas caixas de entrada são insuficientes sem gatilhos e hábitos",
        "Boa gestão de e-mail",
        "Organização eficiente de tarefas"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Captura",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#capture", "#advanced", "#critical-thinking", "#pt", "#all-languages"]
    }
  ],
  // Hindi (HI) - Professional translations
  HI: [
    {
      question: "पाठ के अनुसार, इनबॉक्स क्या है?",
      options: [
        "एक स्थान जहां सभी आने वाली जानकारी एकत्र होती है",
        "एक ईमेल पता",
        "एक कार्य सूची",
        "एक कैलेंडर"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "कैप्चर",
      questionType: QuestionType.RECALL,
      hashtags: ["#capture", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, आपको इनबॉक्स को कितनी बार खाली करना चाहिए?",
      options: [
        "सप्ताह में एक बार",
        "महीने में एक बार",
        "दिन में कम से कम एक बार",
        "कभी नहीं"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "कैप्चर",
      questionType: QuestionType.RECALL,
      hashtags: ["#capture", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, ट्रिगर सूची क्या है?",
      options: [
        "एक सूची जो आपको याद दिलाती है कि कब कैप्चर करना है",
        "एक ईमेल सूची",
        "एक कार्य सूची",
        "एक कैलेंडर"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "कैप्चर",
      questionType: QuestionType.RECALL,
      hashtags: ["#capture", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के सिद्धांत के अनुसार जानकारी कैप्चर करना क्यों महत्वपूर्ण है?",
      options: [
        "यह स्वचालित रूप से जानकारी को व्यवस्थित करता है",
        "यदि इसे कैप्चर नहीं किया जाता है, तो यह खो जाता है - और यदि खो जाता है, तो इसे प्रबंधित नहीं किया जा सकता",
        "यह इनबॉक्स की आवश्यकता को कम करता है",
        "यह केवल ईमेल पर लागू होता है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "कैप्चर",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#capture", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, आप कैप्चर आदत कैसे विकसित करते हैं?",
      options: [
        "इसे एक बार उपयोग करें",
        "स्वचालित होने तक दोहराएं",
        "कभी उपयोग न करें",
        "केवल सप्ताहांत में उपयोग करें"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "कैप्चर",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#capture", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक व्यक्ति के पास कई इनबॉक्स हैं लेकिन बैठकों के बाद कार्य आइटम कैप्चर करना भूल जाते हैं। पाठ के अनुसार, उन्हें क्या करना चाहिए?",
      options: [
        "अधिक इनबॉक्स बनाना",
        "ट्रिगर सूची का उपयोग करना जो उन्हें बैठकों के बाद कैप्चर करने की याद दिलाती है, और कैप्चर आदत विकसित करना",
        "बैठकों में भाग लेना बंद करना",
        "केवल निश्चित दिनों में कैप्चर करना"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "कैप्चर",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#capture", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक प्रबंधक के पास इनबॉक्स सेट हैं लेकिन जानकारी अभी भी खो जाती है क्योंकि वे लगातार ट्रिगर का उपयोग नहीं करते या कैप्चर आदतें विकसित नहीं करते। पाठ के ढांचे के अनुसार, यह क्या प्रदर्शित करता है?",
      options: [
        "इष्टतम कैप्चर प्रणाली कार्यान्वयन",
        "अधूरी कैप्चर प्रणाली - केवल इनबॉक्स ट्रिगर और आदतों के बिना अपर्याप्त हैं",
        "अच्छा ईमेल प्रबंधन",
        "कुशल कार्य संगठन"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "कैप्चर",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#capture", "#advanced", "#critical-thinking", "#hi", "#all-languages"]
    }
  ]
};

async function seedDay6Enhanced() {
  try {
    await connectDB();
    console.log('🌱 SEEDING DAY 6 ENHANCED QUIZ QUESTIONS\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    let totalQuestions = 0;
    let totalUpdated = 0;
    let totalCreated = 0;

    for (const lang of LANGUAGES) {
      const courseId = `${COURSE_ID_BASE}_${lang}`;
      const lessonId = `${COURSE_ID_BASE}_${lang}_DAY_06`;

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
      const questions = DAY6_QUESTIONS[lang] || DAY6_QUESTIONS['EN']; // Fallback to EN if not translated
      
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
    console.log(`\n✅ DAY 6 ENHANCEMENT COMPLETE!\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedDay6Enhanced();
