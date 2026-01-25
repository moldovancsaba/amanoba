/**
 * Seed Day 8 Enhanced Quiz Questions
 * 
 * Purpose: Enhance Day 8 quizzes from 5 to 7 questions across all 10 languages
 * Why: Part of Quiz Quality Enhancement - Phase 1, Day 8
 * 
 * Lesson Topic: Context Switching Cost (attention residue, batching, deep work blocks)
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
const DAY_NUMBER = 8;
const LANGUAGES = ['HU', 'EN', 'TR', 'BG', 'PL', 'VI', 'ID', 'AR', 'PT', 'HI'];

/**
 * Day 8 Enhanced Questions - All Languages
 * Topic: Context Switching Cost (attention residue, batching, deep work blocks)
 * Structure: 7 questions per language
 * Q1-Q3: Keep (Recall - foundational concepts)
 * Q4: Rewritten (Application - from definition to purpose)
 * Q5: Keep (Application - scenario-based)
 * Q6: New (Application - practical implementation)
 * Q7: New (Critical Thinking - systems integration)
 */
const DAY8_QUESTIONS: Record<string, Array<{
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: QuestionDifficulty;
  category: string;
  questionType: QuestionType;
  hashtags: string[];
}>> = {
  EN: [
    // Q1: Attention residue refocus time (RECALL - Keep)
    {
      question: "According to the lesson, how long does it typically take to fully refocus on a new task after context switching?",
      options: [
        "2-5 minutes",
        "10-25 minutes",
        "30-45 minutes",
        "1-2 hours"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Context Switching",
      questionType: QuestionType.RECALL,
      hashtags: ["#context-switching", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q2: What is attention residue (RECALL - Keep)
    {
      question: "According to the lesson, what does 'attention residue' mean?",
      options: [
        "Instant focus switching success",
        "Parts of your brain remain on the previous task",
        "Completing long tasks successfully",
        "Reading emails"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Context Switching",
      questionType: QuestionType.RECALL,
      hashtags: ["#context-switching", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q3: Deep work block duration (RECALL - Keep)
    {
      question: "According to the lesson, what is the optimal duration for a deep work block?",
      options: [
        "15-30 minutes",
        "45-60 minutes",
        "90-120 minutes",
        "150+ minutes"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Context Switching",
      questionType: QuestionType.RECALL,
      hashtags: ["#context-switching", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q4: Why batching matters (APPLICATION - Rewritten from definition)
    {
      question: "Why is batching similar tasks together important according to the lesson?",
      options: [
        "It allows you to work longer hours",
        "It reduces context switches, maintains focus, and minimizes attention residue",
        "It makes tasks easier to complete",
        "It only applies to email management"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Context Switching",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#context-switching", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q5: Daily context switch target (APPLICATION - Keep)
    {
      question: "According to the lesson, what is the daily ideal target for context switches?",
      options: [
        "10-15",
        "5-10",
        "1-4",
        "As many as needed while staying productive"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Context Switching",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#context-switching", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q6: Implementing batching (APPLICATION - New)
    {
      question: "A person switches between email, coding, meetings, and phone calls throughout the day, experiencing low productivity. According to the lesson, what should they do?",
      options: [
        "Work faster to compensate",
        "Batch similar tasks together (e.g., all emails in one block, all coding in another) to minimize context switches",
        "Take more breaks",
        "Work longer hours"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Context Switching",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#context-switching", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q7: Context switching cost analysis (CRITICAL THINKING - New)
    {
      question: "A manager has 8 context switches per day, experiences constant attention residue, and has no deep work blocks. According to the lesson's framework, what does this pattern suggest about their productivity?",
      options: [
        "Optimal productivity management",
        "Significant productivity loss - excessive context switching prevents deep work and causes attention residue throughout the day",
        "Efficient multitasking",
        "Good time management"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Context Switching",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#context-switching", "#advanced", "#critical-thinking", "#en", "#all-languages"]
    }
  ],
  // Hungarian translations
  HU: [
    {
      question: "A lecke szerint mennyi időt vesz igénybe tipikusan teljesen újra fókuszálni egy új feladatra kontextusváltás után?",
      options: [
        "2-5 perc",
        "10-25 perc",
        "30-45 perc",
        "1-2 óra"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Kontextusváltás",
      questionType: QuestionType.RECALL,
      hashtags: ["#context-switching", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint mit jelent a 'figyelmi maradványa'?",
      options: [
        "Azonnali fókuszváltási siker",
        "Az agy részei az előző feladaton maradnak",
        "Hosszú feladatok sikeres befejezése",
        "Email olvasás"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Kontextusváltás",
      questionType: QuestionType.RECALL,
      hashtags: ["#context-switching", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint mi a mély munkablokk optimális időtartama?",
      options: [
        "15-30 perc",
        "45-60 perc",
        "90-120 perc",
        "150+ perc"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Kontextusváltás",
      questionType: QuestionType.RECALL,
      hashtags: ["#context-switching", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "Miért fontos a hasonló feladatok kötegelt feldolgozása a lecke szerint?",
      options: [
        "Lehetővé teszi, hogy hosszabb ideig dolgozz",
        "Csökkenti a kontextusváltásokat, fenntartja a fókuszt, és minimalizálja a figyelmi maradványt",
        "Könnyebbé teszi a feladatok befejezését",
        "Csak az email kezelésre vonatkozik"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Kontextusváltás",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#context-switching", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint mi a napi ideális cél a kontextusváltásokra?",
      options: [
        "10-15",
        "5-10",
        "1-4",
        "Annyi, amennyi szükséges, miközben produktív maradsz"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Kontextusváltás",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#context-switching", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy személy napközben vált email, kódolás, meetingek és telefonhívások között, alacsony produktivitást tapasztal. A lecke szerint mit kellene tennie?",
      options: [
        "Gyorsabban dolgozni a kompenzációért",
        "Hasonló feladatokat együtt kötegelni (pl. minden email egy blokkban, minden kódolás egy másikban) a kontextusváltások minimalizálásához",
        "Több szünetet tartani",
        "Hosszabb ideig dolgozni"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Kontextusváltás",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#context-switching", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy menedzsernek naponta 8 kontextusváltása van, folyamatos figyelmi maradványt tapasztal, és nincsenek mély munkablokkjai. A lecke keretrendszere szerint mit sugall ez a minta a termelékenységükről?",
      options: [
        "Optimális termelékenység kezelés",
        "Jelentős termelékenységi veszteség - a túlzott kontextusváltás megakadályozza a mély munkát és napközben figyelmi maradványt okoz",
        "Hatékony multitasking",
        "Jó időgazdálkodás"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Kontextusváltás",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#context-switching", "#advanced", "#critical-thinking", "#hu", "#all-languages"]
    }
  ],
  // Turkish (TR) - Professional translations
  TR: [
    {
      question: "Derse göre konteks değiştirdikten sonra yeni bir göreve tam olarak odaklanmak genellikle ne kadar sürer?",
      options: [
        "2-5 dakika",
        "10-25 dakika",
        "30-45 dakika",
        "1-2 saat"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Konteks Değiştirme",
      questionType: QuestionType.RECALL,
      hashtags: ["#context-switching", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre 'dikkat kalıntısı' ne anlama gelir?",
      options: [
        "Anında odak değiştirme başarısı",
        "Beyninizin bir kısmı önceki görevde kalır",
        "Uzun görevleri başarıyla tamamlama",
        "E-posta okuma"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Konteks Değiştirme",
      questionType: QuestionType.RECALL,
      hashtags: ["#context-switching", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre derin çalışma bloğu için optimal süre nedir?",
      options: [
        "15-30 dakika",
        "45-60 dakika",
        "90-120 dakika",
        "150+ dakika"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Konteks Değiştirme",
      questionType: QuestionType.RECALL,
      hashtags: ["#context-switching", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre benzer görevleri birlikte toplu işleme neden önemlidir?",
      options: [
        "Daha uzun saatler çalışmanıza olanak tanır",
        "Konteks değişimlerini azaltır, odağı korur ve dikkat kalıntısını en aza indirir",
        "Görevleri tamamlamayı kolaylaştırır",
        "Sadece e-posta yönetimine uygulanır"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Konteks Değiştirme",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#context-switching", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre konteks değişimleri için günlük ideal hedef nedir?",
      options: [
        "10-15",
        "5-10",
        "1-4",
        "Verimli kalırken gerektiği kadar"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Konteks Değiştirme",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#context-switching", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir kişi gün boyunca e-posta, kodlama, toplantılar ve telefon görüşmeleri arasında geçiş yapıyor ve düşük verimlilik yaşıyor. Derse göre ne yapmalı?",
      options: [
        "Telafi etmek için daha hızlı çalışmak",
        "Konteks değişimlerini en aza indirmek için benzer görevleri birlikte toplu işlemek (örn. tüm e-postalar bir blokta, tüm kodlama başka bir blokta)",
        "Daha fazla mola almak",
        "Daha uzun saatler çalışmak"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Konteks Değiştirme",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#context-switching", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir yöneticinin günde 8 konteks değişimi var, sürekli dikkat kalıntısı yaşıyor ve derin çalışma blokları yok. Dersin çerçevesine göre bu model onların verimliliği hakkında neyi gösterir?",
      options: [
        "Optimal verimlilik yönetimi",
        "Önemli verimlilik kaybı - aşırı konteks değişimi derin çalışmayı engeller ve gün boyunca dikkat kalıntısına neden olur",
        "Verimli çoklu görev",
        "İyi zaman yönetimi"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Konteks Değiştirme",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#context-switching", "#advanced", "#critical-thinking", "#tr", "#all-languages"]
    }
  ],
  // Bulgarian (BG) - Professional translations
  BG: [
    {
      question: "Според урока, колко време отнема типично пълното повторно фокусиране върху нова задача след превключване на контекст?",
      options: [
        "2-5 минути",
        "10-25 минути",
        "30-45 минути",
        "1-2 часа"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Превключване на контекст",
      questionType: QuestionType.RECALL,
      hashtags: ["#context-switching", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, какво означава 'остатък от внимание'?",
      options: [
        "Моментален успех при превключване на фокуса",
        "Части от мозъка ви остават на предишната задача",
        "Успешно завършване на дълги задачи",
        "Четене на имейли"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Превключване на контекст",
      questionType: QuestionType.RECALL,
      hashtags: ["#context-switching", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, каква е оптималната продължителност на блок за дълбока работа?",
      options: [
        "15-30 минути",
        "45-60 минути",
        "90-120 минути",
        "150+ минути"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Превключване на контекст",
      questionType: QuestionType.RECALL,
      hashtags: ["#context-switching", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Защо е важно групирането на подобни задачи заедно според урока?",
      options: [
        "Позволява ви да работите по-дълги часове",
        "Намалява превключванията на контекст, поддържа фокуса и минимизира остатъка от внимание",
        "Прави задачите по-лесни за завършване",
        "Прилага се само за управление на имейл"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Превключване на контекст",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#context-switching", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, какъв е дневният идеален целеви брой превключвания на контекст?",
      options: [
        "10-15",
        "5-10",
        "1-4",
        "Колкото е необходимо, докато оставате продуктивни"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Превключване на контекст",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#context-switching", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Човек превключва между имейл, кодиране, срещи и телефонни обаждания през деня, изпитвайки ниска продуктивност. Според урока, какво трябва да направи?",
      options: [
        "Работи по-бързо за компенсация",
        "Групира подобни задачи заедно (напр. всички имейли в един блок, всичко кодиране в друг) за минимизиране на превключванията на контекст",
        "Прави повече почивки",
        "Работи по-дълги часове"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Превключване на контекст",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#context-switching", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Мениджърът има 8 превключвания на контекст на ден, изпитва постоянен остатък от внимание и няма блокове за дълбока работа. Според рамката на урока, какво предполага този модел за тяхната продуктивност?",
      options: [
        "Оптимално управление на продуктивността",
        "Значителна загуба на продуктивност - прекомерното превключване на контекст предотвратява дълбоката работа и причинява остатък от внимание през целия ден",
        "Ефективна многозадачност",
        "Добро управление на времето"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Превключване на контекст",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#context-switching", "#advanced", "#critical-thinking", "#bg", "#all-languages"]
    }
  ],
  // Polish (PL) - Professional translations
  PL: [
    {
      question: "Według lekcji, ile czasu zazwyczaj zajmuje pełne ponowne skupienie się na nowym zadaniu po przełączeniu kontekstu?",
      options: [
        "2-5 minut",
        "10-25 minut",
        "30-45 minut",
        "1-2 godziny"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Przełączanie kontekstu",
      questionType: QuestionType.RECALL,
      hashtags: ["#context-switching", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, co oznacza 'reszta uwagi'?",
      options: [
        "Natychmiastowy sukces przełączania skupienia",
        "Części mózgu pozostają przy poprzednim zadaniu",
        "Udane ukończenie długich zadań",
        "Czytanie e-maili"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Przełączanie kontekstu",
      questionType: QuestionType.RECALL,
      hashtags: ["#context-switching", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, jaki jest optymalny czas trwania bloku głębokiej pracy?",
      options: [
        "15-30 minut",
        "45-60 minut",
        "90-120 minut",
        "150+ minut"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Przełączanie kontekstu",
      questionType: QuestionType.RECALL,
      hashtags: ["#context-switching", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Dlaczego grupowanie podobnych zadań razem jest ważne według lekcji?",
      options: [
        "Pozwala pracować dłużej",
        "Zmniejsza przełączania kontekstu, utrzymuje skupienie i minimalizuje resztę uwagi",
        "Ułatwia ukończenie zadań",
        "Dotyczy tylko zarządzania e-mailem"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Przełączanie kontekstu",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#context-switching", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, jaki jest dzienny idealny cel dla przełączeń kontekstu?",
      options: [
        "10-15",
        "5-10",
        "1-4",
        "Tyle, ile potrzeba, pozostając produktywnym"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Przełączanie kontekstu",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#context-switching", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Osoba przełącza się między e-mailem, kodowaniem, spotkaniami i rozmowami telefonicznymi w ciągu dnia, doświadczając niskiej produktywności. Według lekcji, co powinna zrobić?",
      options: [
        "Pracować szybciej, aby zrekompensować",
        "Grupować podobne zadania razem (np. wszystkie e-maile w jednym bloku, całe kodowanie w innym), aby zminimalizować przełączania kontekstu",
        "Robić więcej przerw",
        "Pracować dłużej"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Przełączanie kontekstu",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#context-switching", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Menedżer ma 8 przełączeń kontekstu dziennie, doświadcza ciągłej reszty uwagi i nie ma bloków głębokiej pracy. Według ram lekcji, co sugeruje ten wzorzec o ich produktywności?",
      options: [
        "Optymalne zarządzanie produktywnością",
        "Znaczna utrata produktywności - nadmierne przełączanie kontekstu uniemożliwia głęboką pracę i powoduje resztę uwagi przez cały dzień",
        "Skuteczna wielozadaniowość",
        "Dobre zarządzanie czasem"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Przełączanie kontekstu",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#context-switching", "#advanced", "#critical-thinking", "#pl", "#all-languages"]
    }
  ],
  // Vietnamese (VI) - Professional translations
  VI: [
    {
      question: "Theo bài học, thường mất bao lâu để hoàn toàn tập trung lại vào một nhiệm vụ mới sau khi chuyển đổi ngữ cảnh?",
      options: [
        "2-5 phút",
        "10-25 phút",
        "30-45 phút",
        "1-2 giờ"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Chuyển đổi ngữ cảnh",
      questionType: QuestionType.RECALL,
      hashtags: ["#context-switching", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, 'phần dư chú ý' có nghĩa là gì?",
      options: [
        "Thành công chuyển đổi tập trung ngay lập tức",
        "Các bộ phận của não vẫn ở nhiệm vụ trước đó",
        "Hoàn thành thành công các nhiệm vụ dài",
        "Đọc email"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Chuyển đổi ngữ cảnh",
      questionType: QuestionType.RECALL,
      hashtags: ["#context-switching", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, thời lượng tối ưu cho khối công việc sâu là bao nhiêu?",
      options: [
        "15-30 phút",
        "45-60 phút",
        "90-120 phút",
        "150+ phút"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Chuyển đổi ngữ cảnh",
      questionType: QuestionType.RECALL,
      hashtags: ["#context-switching", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Tại sao việc nhóm các nhiệm vụ tương tự lại với nhau lại quan trọng theo bài học?",
      options: [
        "Cho phép bạn làm việc nhiều giờ hơn",
        "Giảm chuyển đổi ngữ cảnh, duy trì tập trung và giảm thiểu phần dư chú ý",
        "Làm cho nhiệm vụ dễ hoàn thành hơn",
        "Chỉ áp dụng cho quản lý email"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Chuyển đổi ngữ cảnh",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#context-switching", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, mục tiêu lý tưởng hàng ngày cho chuyển đổi ngữ cảnh là gì?",
      options: [
        "10-15",
        "5-10",
        "1-4",
        "Nhiều như cần thiết trong khi vẫn năng suất"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Chuyển đổi ngữ cảnh",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#context-switching", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Một người chuyển đổi giữa email, lập trình, cuộc họp và cuộc gọi điện thoại trong suốt ngày, trải qua năng suất thấp. Theo bài học, họ nên làm gì?",
      options: [
        "Làm việc nhanh hơn để bù đắp",
        "Nhóm các nhiệm vụ tương tự lại với nhau (ví dụ: tất cả email trong một khối, tất cả lập trình trong khối khác) để giảm thiểu chuyển đổi ngữ cảnh",
        "Nghỉ giải lao nhiều hơn",
        "Làm việc nhiều giờ hơn"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Chuyển đổi ngữ cảnh",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#context-switching", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Một người quản lý có 8 lần chuyển đổi ngữ cảnh mỗi ngày, trải qua phần dư chú ý liên tục và không có khối công việc sâu. Theo khung của bài học, mô hình này cho thấy điều gì về năng suất của họ?",
      options: [
        "Quản lý năng suất tối ưu",
        "Mất năng suất đáng kể - chuyển đổi ngữ cảnh quá mức ngăn cản công việc sâu và gây ra phần dư chú ý suốt cả ngày",
        "Đa nhiệm hiệu quả",
        "Quản lý thời gian tốt"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Chuyển đổi ngữ cảnh",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#context-switching", "#advanced", "#critical-thinking", "#vi", "#all-languages"]
    }
  ],
  // Indonesian (ID) - Professional translations
  ID: [
    {
      question: "Menurut pelajaran, berapa lama biasanya diperlukan untuk sepenuhnya fokus kembali pada tugas baru setelah pergantian konteks?",
      options: [
        "2-5 menit",
        "10-25 menit",
        "30-45 menit",
        "1-2 jam"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Pergantian Konteks",
      questionType: QuestionType.RECALL,
      hashtags: ["#context-switching", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, apa artinya 'sisa perhatian'?",
      options: [
        "Keberhasilan pengalihan fokus instan",
        "Bagian otak tetap pada tugas sebelumnya",
        "Menyelesaikan tugas panjang dengan sukses",
        "Membaca email"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Pergantian Konteks",
      questionType: QuestionType.RECALL,
      hashtags: ["#context-switching", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, berapa durasi optimal untuk blok kerja mendalam?",
      options: [
        "15-30 menit",
        "45-60 menit",
        "90-120 menit",
        "150+ menit"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Pergantian Konteks",
      questionType: QuestionType.RECALL,
      hashtags: ["#context-switching", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Mengapa mengelompokkan tugas serupa bersama-sama penting menurut pelajaran?",
      options: [
        "Memungkinkan Anda bekerja lebih lama",
        "Mengurangi pergantian konteks, mempertahankan fokus, dan meminimalkan sisa perhatian",
        "Membuat tugas lebih mudah diselesaikan",
        "Hanya berlaku untuk manajemen email"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Pergantian Konteks",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#context-switching", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, apa target ideal harian untuk pergantian konteks?",
      options: [
        "10-15",
        "5-10",
        "1-4",
        "Sebanyak yang diperlukan sambil tetap produktif"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Pergantian Konteks",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#context-switching", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Seseorang beralih antara email, coding, rapat, dan panggilan telepon sepanjang hari, mengalami produktivitas rendah. Menurut pelajaran, apa yang harus mereka lakukan?",
      options: [
        "Bekerja lebih cepat untuk mengkompensasi",
        "Kelompokkan tugas serupa bersama-sama (mis. semua email dalam satu blok, semua coding di blok lain) untuk meminimalkan pergantian konteks",
        "Istirahat lebih banyak",
        "Bekerja lebih lama"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Pergantian Konteks",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#context-switching", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Seorang manajer memiliki 8 pergantian konteks per hari, mengalami sisa perhatian konstan, dan tidak memiliki blok kerja mendalam. Menurut kerangka pelajaran, apa yang ditunjukkan pola ini tentang produktivitas mereka?",
      options: [
        "Manajemen produktivitas optimal",
        "Kehilangan produktivitas signifikan - pergantian konteks yang berlebihan mencegah kerja mendalam dan menyebabkan sisa perhatian sepanjang hari",
        "Multitasking yang efisien",
        "Manajemen waktu yang baik"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Pergantian Konteks",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#context-switching", "#advanced", "#critical-thinking", "#id", "#all-languages"]
    }
  ],
  // Arabic (AR) - Professional translations (RTL)
  AR: [
    {
      question: "وفقًا للدرس، كم من الوقت يستغرق عادةً إعادة التركيز بالكامل على مهمة جديدة بعد تبديل السياق؟",
      options: [
        "2-5 دقائق",
        "10-25 دقيقة",
        "30-45 دقيقة",
        "1-2 ساعة"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "تبديل السياق",
      questionType: QuestionType.RECALL,
      hashtags: ["#context-switching", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، ماذا تعني 'بقايا الانتباه'؟",
      options: [
        "نجاح فوري في تبديل التركيز",
        "أجزاء من دماغك تبقى على المهمة السابقة",
        "إكمال المهام الطويلة بنجاح",
        "قراءة البريد الإلكتروني"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "تبديل السياق",
      questionType: QuestionType.RECALL,
      hashtags: ["#context-switching", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، ما هي المدة المثلى لكتلة العمل العميق؟",
      options: [
        "15-30 دقيقة",
        "45-60 دقيقة",
        "90-120 دقيقة",
        "150+ دقيقة"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "تبديل السياق",
      questionType: QuestionType.RECALL,
      hashtags: ["#context-switching", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "لماذا من المهم تجميع المهام المتشابهة معًا وفقًا للدرس؟",
      options: [
        "يسمح لك بالعمل لساعات أطول",
        "يقلل من تبديلات السياق، يحافظ على التركيز، ويقلل من بقايا الانتباه",
        "يجعل المهام أسهل في الإكمال",
        "ينطبق فقط على إدارة البريد الإلكتروني"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "تبديل السياق",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#context-switching", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، ما هو الهدف المثالي اليومي لتبديلات السياق؟",
      options: [
        "10-15",
        "5-10",
        "1-4",
        "بقدر ما هو ضروري مع البقاء منتجًا"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "تبديل السياق",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#context-switching", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "شخص ينتقل بين البريد الإلكتروني والبرمجة والاجتماعات والمكالمات الهاتفية طوال اليوم، ويعاني من إنتاجية منخفضة. وفقًا للدرس، ماذا يجب أن يفعل؟",
      options: [
        "العمل بشكل أسرع للتعويض",
        "تجميع المهام المتشابهة معًا (مثلًا، كل البريد الإلكتروني في كتلة واحدة، كل البرمجة في كتلة أخرى) لتقليل تبديلات السياق",
        "أخذ المزيد من الاستراحات",
        "العمل لساعات أطول"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "تبديل السياق",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#context-switching", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "لدى مدير 8 تبديلات سياق يوميًا، ويعاني من بقايا انتباه مستمرة، وليس لديه كتل عمل عميق. وفقًا لإطار الدرس، ماذا يوحي هذا النمط حول إنتاجيتهم؟",
      options: [
        "إدارة إنتاجية مثلى",
        "فقدان إنتاجية كبير - تبديل السياق المفرط يمنع العمل العميق ويسبب بقايا الانتباه طوال اليوم",
        "تعدد المهام بكفاءة",
        "إدارة وقت جيدة"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "تبديل السياق",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#context-switching", "#advanced", "#critical-thinking", "#ar", "#all-languages"]
    }
  ],
  // Portuguese (PT) - Professional translations (Brazilian)
  PT: [
    {
      question: "De acordo com a lição, quanto tempo normalmente leva para se reconcentrar completamente em uma nova tarefa após mudança de contexto?",
      options: [
        "2-5 minutos",
        "10-25 minutos",
        "30-45 minutos",
        "1-2 horas"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Mudança de Contexto",
      questionType: QuestionType.RECALL,
      hashtags: ["#context-switching", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, o que significa 'resíduo de atenção'?",
      options: [
        "Sucesso instantâneo na mudança de foco",
        "Partes do cérebro permanecem na tarefa anterior",
        "Conclusão bem-sucedida de tarefas longas",
        "Ler e-mails"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Mudança de Contexto",
      questionType: QuestionType.RECALL,
      hashtags: ["#context-switching", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, qual é a duração ideal para um bloco de trabalho profundo?",
      options: [
        "15-30 minutos",
        "45-60 minutos",
        "90-120 minutos",
        "150+ minutos"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "Mudança de Contexto",
      questionType: QuestionType.RECALL,
      hashtags: ["#context-switching", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "Por que agrupar tarefas semelhantes é importante de acordo com a lição?",
      options: [
        "Permite trabalhar mais horas",
        "Reduz mudanças de contexto, mantém o foco e minimiza o resíduo de atenção",
        "Torna as tarefas mais fáceis de completar",
        "Aplica-se apenas ao gerenciamento de e-mail"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Mudança de Contexto",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#context-switching", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, qual é a meta ideal diária para mudanças de contexto?",
      options: [
        "10-15",
        "5-10",
        "1-4",
        "Quantas forem necessárias mantendo-se produtivo"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Mudança de Contexto",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#context-switching", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Uma pessoa alterna entre e-mail, codificação, reuniões e chamadas telefônicas ao longo do dia, experimentando baixa produtividade. De acordo com a lição, o que ela deve fazer?",
      options: [
        "Trabalhar mais rápido para compensar",
        "Agrupar tarefas semelhantes (ex: todos os e-mails em um bloco, toda a codificação em outro) para minimizar mudanças de contexto",
        "Fazer mais pausas",
        "Trabalhar mais horas"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Mudança de Contexto",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#context-switching", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Um gerente tem 8 mudanças de contexto por dia, experimenta resíduo de atenção constante e não tem blocos de trabalho profundo. De acordo com a estrutura da lição, o que esse padrão sugere sobre sua produtividade?",
      options: [
        "Gestão ideal de produtividade",
        "Perda significativa de produtividade - mudanças excessivas de contexto impedem trabalho profundo e causam resíduo de atenção durante todo o dia",
        "Multitarefa eficiente",
        "Boa gestão de tempo"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Mudança de Contexto",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#context-switching", "#advanced", "#critical-thinking", "#pt", "#all-languages"]
    }
  ],
  // Hindi (HI) - Professional translations
  HI: [
    {
      question: "पाठ के अनुसार, संदर्भ स्विच करने के बाद एक नए कार्य पर पूरी तरह से फिर से ध्यान केंद्रित करने में आमतौर पर कितना समय लगता है?",
      options: [
        "2-5 मिनट",
        "10-25 मिनट",
        "30-45 मिनट",
        "1-2 घंटे"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "संदर्भ स्विचिंग",
      questionType: QuestionType.RECALL,
      hashtags: ["#context-switching", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, 'ध्यान अवशेष' का क्या अर्थ है?",
      options: [
        "तत्काल फोकस स्विचिंग सफलता",
        "मस्तिष्क के कुछ हिस्से पिछले कार्य पर बने रहते हैं",
        "लंबे कार्यों को सफलतापूर्वक पूरा करना",
        "ईमेल पढ़ना"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "संदर्भ स्विचिंग",
      questionType: QuestionType.RECALL,
      hashtags: ["#context-switching", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, गहरे कार्य ब्लॉक के लिए इष्टतम अवधि क्या है?",
      options: [
        "15-30 मिनट",
        "45-60 मिनट",
        "90-120 मिनट",
        "150+ मिनट"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.EASY,
      category: "संदर्भ स्विचिंग",
      questionType: QuestionType.RECALL,
      hashtags: ["#context-switching", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार समान कार्यों को एक साथ बैच करना क्यों महत्वपूर्ण है?",
      options: [
        "यह आपको अधिक घंटे काम करने की अनुमति देता है",
        "यह संदर्भ स्विच को कम करता है, फोकस बनाए रखता है, और ध्यान अवशेष को कम करता है",
        "यह कार्यों को पूरा करना आसान बनाता है",
        "यह केवल ईमेल प्रबंधन पर लागू होता है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "संदर्भ स्विचिंग",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#context-switching", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, संदर्भ स्विच के लिए दैनिक आदर्श लक्ष्य क्या है?",
      options: [
        "10-15",
        "5-10",
        "1-4",
        "उत्पादक बने रहते हुए जितनी आवश्यकता हो"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "संदर्भ स्विचिंग",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#context-switching", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक व्यक्ति दिन भर ईमेल, कोडिंग, बैठकों और फोन कॉल के बीच स्विच करता है, कम उत्पादकता का अनुभव करता है। पाठ के अनुसार, उन्हें क्या करना चाहिए?",
      options: [
        "क्षतिपूर्ति के लिए तेजी से काम करना",
        "संदर्भ स्विच को कम करने के लिए समान कार्यों को एक साथ बैच करना (उदा. सभी ईमेल एक ब्लॉक में, सभी कोडिंग दूसरे में)",
        "अधिक ब्रेक लेना",
        "अधिक घंटे काम करना"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "संदर्भ स्विचिंग",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#context-switching", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक प्रबंधक का प्रति दिन 8 संदर्भ स्विच है, निरंतर ध्यान अवशेष का अनुभव करता है, और उसके पास गहरे कार्य ब्लॉक नहीं हैं। पाठ के ढांचे के अनुसार, यह पैटर्न उनकी उत्पादकता के बारे में क्या सुझाव देता है?",
      options: [
        "इष्टतम उत्पादकता प्रबंधन",
        "उत्पादकता में महत्वपूर्ण हानि - अत्यधिक संदर्भ स्विचिंग गहरे कार्य को रोकता है और पूरे दिन ध्यान अवशेष का कारण बनता है",
        "कुशल मल्टीटास्किंग",
        "अच्छा समय प्रबंधन"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "संदर्भ स्विचिंग",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#context-switching", "#advanced", "#critical-thinking", "#hi", "#all-languages"]
    }
  ]
};

async function seedDay8Enhanced() {
  try {
    await connectDB();
    console.log('🌱 SEEDING DAY 8 ENHANCED QUIZ QUESTIONS\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    let totalQuestions = 0;
    let totalUpdated = 0;
    let totalCreated = 0;

    for (const lang of LANGUAGES) {
      const courseId = `${COURSE_ID_BASE}_${lang}`;
      const lessonId = `${COURSE_ID_BASE}_${lang}_DAY_08`;

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
      const questions = DAY8_QUESTIONS[lang] || DAY8_QUESTIONS['EN']; // Fallback to EN if not translated
      
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
    console.log(`\n✅ DAY 8 ENHANCEMENT COMPLETE!\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedDay8Enhanced();
