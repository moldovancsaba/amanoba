/**
 * Seed Day 1 Enhanced Quiz Questions
 * 
 * Purpose: Enhance Day 1 quizzes from 5 to 7 questions across all 10 languages
 * Why: Part of Quiz Quality Enhancement - Phase 1, Day 1
 * 
 * Structure:
 * - 7 questions per language (5 existing + 1 rewritten + 2 new)
 * - All questions have UUIDs, hashtags, questionType
 * - Cognitive mix: 60% recall, 30% application, 10% critical thinking
 * 
 * Languages: HU, EN, TR, BG, PL, VI, ID, AR, PT, HI (10 total)
 * Total questions: 70 (7 × 10)
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { randomUUID } from 'crypto';

config({ path: resolve(process.cwd(), '.env.local') });

import { default as connectDB } from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion, QuestionDifficulty, QuestionType } from '../app/lib/models';

const COURSE_ID_BASE = 'PRODUCTIVITY_2026';
const DAY_NUMBER = 1;
const LANGUAGES = ['HU', 'EN', 'TR', 'BG', 'PL', 'VI', 'ID', 'AR', 'PT', 'HI'];

/**
 * Day 1 Enhanced Questions - All Languages
 * Structure: 7 questions per language
 * Q1-Q3: Keep (Recall)
 * Q4: Rewritten (Application - was definition)
 * Q5: Keep (Application)
 * Q6: New (Application)
 * Q7: New (Critical Thinking)
 */
const DAY1_QUESTIONS: Record<string, Array<{
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: QuestionDifficulty;
  category: string;
  questionType: QuestionType;
  hashtags: string[];
}>> = {
  EN: [
    // Q1: Definition of Productivity (RECALL - Keep)
    {
      question: "What is productivity in its simplest sense?",
      options: [
        "More work in less time",
        "Less work in more time",
        "Being exhausted after work",
        "Not having to work"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#productivity", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q2: What is NOT a productivity obstacle (RECALL - Keep)
    {
      question: "Which of the following is NOT a productivity obstacle?",
      options: [
        "Constantly checking emails",
        "Taking regular breaks",
        "Switching between multiple tasks",
        "Unclear priorities"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#productivity", "#intermediate", "#recall", "#en", "#all-languages"]
    },
    // Q3: Context switching reduction (RECALL - Keep)
    {
      question: "Which method helps reduce the cost of context switching?",
      options: [
        "Working on multiple projects simultaneously",
        "Batching similar tasks together",
        "Checking email frequently",
        "Responding to messages immediately"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Context Switching",
      questionType: QuestionType.RECALL,
      hashtags: ["#context-switching", "#intermediate", "#recall", "#en", "#all-languages"]
    },
    // Q4: OKR purpose (APPLICATION - Rewritten)
    {
      question: "Why is the OKR (Objectives and Key Results) framework useful for setting productivity goals?",
      options: [
        "Because it doesn't require time for evaluation",
        "Because it distinguishes between clear objectives and measurable results",
        "Because it reduces employee accountability",
        "Because it prevents all productivity problems"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Goal Hierarchy",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q5: What if you don't reach daily goal (APPLICATION - Keep)
    {
      question: "What should you do if you don't reach your daily goal?",
      options: [
        "Nothing - the goal isn't important",
        "Immediately abandon the project",
        "Review what went wrong and adjust your plan",
        "Take on more work the next day"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Goal Hierarchy",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#planning", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q6: How to measure productivity improvement (APPLICATION - New)
    {
      question: "How can you measurably track your productivity improvement over the first week?",
      options: [
        "Create a weekly activity log and compare it to your previous week",
        "Feel whether you think you're more productive or not",
        "Think about ideas but don't measure concrete data",
        "Ask someone to evaluate your work but don't look at the numbers"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Measurement & Metrics",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#measurement", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q7: Individual productivity and organizational performance (CRITICAL THINKING - New)
    {
      question: "How do individual productivity habits relate to organizational performance?",
      options: [
        "There's no direct relationship - individuals are independent of the organization",
        "Only leaders' productivity matters at the organizational level",
        "Individual employees' productivity compounds to create organizational effectiveness",
        "Productivity is only a theoretical concept and not measurable in practice"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#productivity", "#advanced", "#critical-thinking", "#en", "#all-languages"]
    }
  ],
  // Hungarian translations
  HU: [
    {
      question: "Mi az a termelékenység a legegyszerűbb értelemben?",
      options: [
        "Több munka kevesebb idő alatt",
        "Kevesebb munka több idő alatt",
        "Kimerült lenni a munka után",
        "Nem kell dolgozni"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#productivity", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "Melyik az alábbiak közül NEM termelékenységi hátrány?",
      options: [
        "Kitöltés e-mailekben",
        "Rendszeres szünetek",
        "Számos feladat között váltás",
        "Meghatározatlan prioritások"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#productivity", "#intermediate", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "Melyik módszer segít a kontextusváltás költségének csökkentésében?",
      options: [
        "Több egyidejű projekt",
        "Feladatok kötegelt feldolgozása",
        "Gyakori e-mail ellenőrzés",
        "Azonnal válaszolni üzenetekre"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Context Switching",
      questionType: QuestionType.RECALL,
      hashtags: ["#context-switching", "#intermediate", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "Miért hasznos az OKR (Objektív és Kulcseredmény) keretrendszer a termelékenységi célok kitűzésében?",
      options: [
        "Mivel nem igényel időt az értékeléshez",
        "Mivel világos célok és mérhető eredmények között különbséget tesz",
        "Mivel csökkenti az alkalmazottak felelősségét",
        "Mivel megelőzi az összes termelékenységi problémát"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Goal Hierarchy",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Mit kell tenni, ha nem éred el a napi célodat?",
      options: [
        "Semmit - a cél nem fontos",
        "Azonnal feladd a projektet",
        "Nézd meg, mi volt az oka, és igazítsd meg a terved",
        "Több munka vállalj a következő napon"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Goal Hierarchy",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#planning", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Hogyan tudod mérhető módon követni a termelékenységi javulásod az első hét alatt?",
      options: [
        "Készítsd el a heti tevékenységek naplóját és hasonlítsd össze az előző heteddel",
        "Érezd meg magadban, hogy jobbnak vagy-e termékeny vagy sem",
        "Gondolkozz az ötleteken, de ne mérj konkrét adatokat",
        "Kérj meg valakit, hogy értékelje a munkádat, de ne nézd meg a számokat"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Measurement & Metrics",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#measurement", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Hogyan kapcsolódnak az egyéni termelékenységi szokások a szervezeti teljesítményhez?",
      options: [
        "Nincs közvetlen kapcsolat - az egyén független a szervezettől",
        "Csak a vezetők termelékenysége számít a szervezet szintjén",
        "Az egyes alkalmazottak termelékenysége csomagban összeadódik a szervezeti hatékonysághoz",
        "A termelékenység csak elméleti koncepció, gyakorlatban nem mérhető"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#productivity", "#advanced", "#critical-thinking", "#hu", "#all-languages"]
    }
  ],
  // Turkish (TR) - Professional translations
  TR: [
    {
      question: "Verimliliğin en basit anlamı nedir?",
      options: [
        "Daha az zamanda daha fazla iş",
        "Daha fazla zamanda daha az iş",
        "İşten sonra yorgun olmak",
        "Çalışmak zorunda olmamak"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#productivity", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Aşağıdakilerden hangisi verimlilik engeli DEĞİLDİR?",
      options: [
        "Sürekli e-posta kontrol etmek",
        "Düzenli molalar vermek",
        "Birden fazla görev arasında geçiş yapmak",
        "Belirsiz öncelikler"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#productivity", "#intermediate", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Hangi yöntem bağlam değiştirme maliyetini azaltmaya yardımcı olur?",
      options: [
        "Aynı anda birden fazla proje üzerinde çalışmak",
        "Benzer görevleri gruplandırmak",
        "E-postayı sık sık kontrol etmek",
        "Mesajlara hemen yanıt vermek"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Context Switching",
      questionType: QuestionType.RECALL,
      hashtags: ["#context-switching", "#intermediate", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "OKR (Hedefler ve Anahtar Sonuçlar) çerçevesi neden verimlilik hedefleri belirlemede yararlıdır?",
      options: [
        "Çünkü değerlendirme için zaman gerektirmez",
        "Çünkü net hedefler ile ölçülebilir sonuçlar arasında ayrım yapar",
        "Çünkü çalışanların sorumluluğunu azaltır",
        "Çünkü tüm verimlilik sorunlarını önler"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Goal Hierarchy",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Günlük hedefinize ulaşamazsanız ne yapmalısınız?",
      options: [
        "Hiçbir şey - hedef önemli değil",
        "Hemen projeyi terk edin",
        "Neyin yanlış gittiğini gözden geçirin ve planınızı ayarlayın",
        "Ertesi gün daha fazla iş üstlenin"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Goal Hierarchy",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#planning", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "İlk hafta boyunca verimlilik iyileşmenizi nasıl ölçülebilir şekilde takip edebilirsiniz?",
      options: [
        "Haftalık aktivite günlüğü oluşturun ve önceki haftanızla karşılaştırın",
        "Kendinizi daha verimli olup olmadığınızı hissedin",
        "Fikirler hakkında düşünün ama somut veriler ölçmeyin",
        "Birinden işinizi değerlendirmesini isteyin ama sayılara bakmayın"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Measurement & Metrics",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#measurement", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bireysel verimlilik alışkanlıkları kurumsal performansla nasıl ilişkilidir?",
      options: [
        "Doğrudan bir ilişki yoktur - bireyler kurumdan bağımsızdır",
        "Sadece liderlerin verimliliği kurumsal düzeyde önemlidir",
        "Bireysel çalışanların verimliliği kurumsal etkinliği oluşturmak için birikir",
        "Verimlilik sadece teorik bir kavramdır ve pratikte ölçülemez"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#productivity", "#advanced", "#critical-thinking", "#tr", "#all-languages"]
    }
  ],
  // Bulgarian (BG) - Professional translations
  BG: [
    {
      question: "Какво е продуктивността в най-простия смисъл?",
      options: [
        "Повече работа за по-малко време",
        "По-малко работа за повече време",
        "Да бъдеш изтощен след работа",
        "Да не трябва да работиш"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#productivity", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Кое от следните НЕ е пречка за продуктивност?",
      options: [
        "Постоянна проверка на имейли",
        "Правилни почивки",
        "Превключване между множество задачи",
        "Неясни приоритети"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#productivity", "#intermediate", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Кой метод помага за намаляване на разходите от превключване на контекст?",
      options: [
        "Работа по множество проекти едновременно",
        "Групиране на подобни задачи",
        "Честа проверка на имейл",
        "Незабавно отговаряне на съобщения"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Context Switching",
      questionType: QuestionType.RECALL,
      hashtags: ["#context-switching", "#intermediate", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Защо рамката OKR (Цели и Ключови Резултати) е полезна за определяне на цели за продуктивност?",
      options: [
        "Защото не изисква време за оценка",
        "Защото прави разлика между ясни цели и измерими резултати",
        "Защото намалява отговорността на служителите",
        "Защото предотвратява всички проблеми с продуктивността"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Goal Hierarchy",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Какво трябва да направите, ако не постигнете дневната си цел?",
      options: [
        "Нищо - целта не е важна",
        "Веднага изоставете проекта",
        "Прегледайте какво се обърка и коригирайте плана си",
        "Поемете повече работа на следващия ден"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Goal Hierarchy",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#planning", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Как можете измеримо да проследявате подобрението на продуктивността си през първата седмица?",
      options: [
        "Създайте седмичен дневник на дейностите и го сравнете с предишната си седмица",
        "Почувствайте дали смятате, че сте по-продуктивни или не",
        "Мислете за идеи, но не измервайте конкретни данни",
        "Помолете някой да оцени работата ви, но не гледайте числата"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Measurement & Metrics",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#measurement", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Как се свързват индивидуалните навици за продуктивност с организационната производителност?",
      options: [
        "Няма пряка връзка - индивидите са независими от организацията",
        "Само продуктивността на лидерите има значение на организационно ниво",
        "Продуктивността на отделните служители се натрупва, за да създаде организационна ефективност",
        "Продуктивността е само теоретична концепция и не може да се измери на практика"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#productivity", "#advanced", "#critical-thinking", "#bg", "#all-languages"]
    }
  ],
  // Polish (PL) - Professional translations
  PL: [
    {
      question: "Czym jest produktywność w najprostszym sensie?",
      options: [
        "Więcej pracy w krótszym czasie",
        "Mniej pracy w dłuższym czasie",
        "Bycie wyczerpanym po pracy",
        "Nie musieć pracować"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#productivity", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Które z poniższych NIE jest przeszkodą w produktywności?",
      options: [
        "Ciągłe sprawdzanie e-maili",
        "Regularne przerwy",
        "Przełączanie się między wieloma zadaniami",
        "Niejasne priorytety"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#productivity", "#intermediate", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Która metoda pomaga zmniejszyć koszt przełączania kontekstu?",
      options: [
        "Praca nad wieloma projektami jednocześnie",
        "Grupowanie podobnych zadań",
        "Częste sprawdzanie e-maili",
        "Natychmiastowe odpowiadanie na wiadomości"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Context Switching",
      questionType: QuestionType.RECALL,
      hashtags: ["#context-switching", "#intermediate", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Dlaczego framework OKR (Cele i Kluczowe Wyniki) jest przydatny w wyznaczaniu celów produktywności?",
      options: [
        "Ponieważ nie wymaga czasu na ocenę",
        "Ponieważ rozróżnia jasne cele i mierzalne wyniki",
        "Ponieważ zmniejsza odpowiedzialność pracowników",
        "Ponieważ zapobiega wszystkim problemom z produktywnością"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Goal Hierarchy",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Co powinieneś zrobić, jeśli nie osiągniesz dziennego celu?",
      options: [
        "Nic - cel nie jest ważny",
        "Natychmiast porzuć projekt",
        "Przejrzyj, co poszło nie tak i dostosuj plan",
        "Podejmij więcej pracy następnego dnia"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Goal Hierarchy",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#planning", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Jak możesz mierzalnie śledzić poprawę swojej produktywności w pierwszym tygodniu?",
      options: [
        "Stwórz tygodniowy dziennik aktywności i porównaj go z poprzednim tygodniem",
        "Poczuj, czy myślisz, że jesteś bardziej produktywny, czy nie",
        "Myśl o pomysłach, ale nie mierz konkretnych danych",
        "Poproś kogoś o ocenę swojej pracy, ale nie patrz na liczby"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Measurement & Metrics",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#measurement", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Jak nawyki indywidualnej produktywności odnoszą się do wydajności organizacyjnej?",
      options: [
        "Nie ma bezpośredniego związku - jednostki są niezależne od organizacji",
        "Tylko produktywność liderów ma znaczenie na poziomie organizacyjnym",
        "Produktywność poszczególnych pracowników sumuje się, tworząc efektywność organizacyjną",
        "Produktywność to tylko teoretyczna koncepcja i nie można jej zmierzyć w praktyce"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#productivity", "#advanced", "#critical-thinking", "#pl", "#all-languages"]
    }
  ],
  // Vietnamese (VI) - Professional translations
  VI: [
    {
      question: "Năng suất là gì theo nghĩa đơn giản nhất?",
      options: [
        "Làm nhiều việc hơn trong thời gian ngắn hơn",
        "Làm ít việc hơn trong thời gian dài hơn",
        "Cảm thấy kiệt sức sau khi làm việc",
        "Không phải làm việc"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#productivity", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Điều nào sau đây KHÔNG phải là trở ngại cho năng suất?",
      options: [
        "Liên tục kiểm tra email",
        "Nghỉ giải lao thường xuyên",
        "Chuyển đổi giữa nhiều nhiệm vụ",
        "Ưu tiên không rõ ràng"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#productivity", "#intermediate", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Phương pháp nào giúp giảm chi phí chuyển đổi ngữ cảnh?",
      options: [
        "Làm việc trên nhiều dự án đồng thời",
        "Nhóm các nhiệm vụ tương tự lại với nhau",
        "Kiểm tra email thường xuyên",
        "Trả lời tin nhắn ngay lập tức"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Context Switching",
      questionType: QuestionType.RECALL,
      hashtags: ["#context-switching", "#intermediate", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Tại sao khung OKR (Mục tiêu và Kết quả then chốt) hữu ích trong việc đặt mục tiêu năng suất?",
      options: [
        "Vì nó không yêu cầu thời gian để đánh giá",
        "Vì nó phân biệt giữa mục tiêu rõ ràng và kết quả có thể đo lường",
        "Vì nó giảm trách nhiệm của nhân viên",
        "Vì nó ngăn chặn tất cả các vấn đề về năng suất"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Goal Hierarchy",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Bạn nên làm gì nếu không đạt được mục tiêu hàng ngày?",
      options: [
        "Không làm gì - mục tiêu không quan trọng",
        "Ngay lập tức từ bỏ dự án",
        "Xem xét điều gì đã sai và điều chỉnh kế hoạch của bạn",
        "Nhận thêm công việc vào ngày hôm sau"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Goal Hierarchy",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#planning", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Làm thế nào bạn có thể theo dõi một cách đo lường được sự cải thiện năng suất của mình trong tuần đầu tiên?",
      options: [
        "Tạo nhật ký hoạt động hàng tuần và so sánh với tuần trước của bạn",
        "Cảm nhận xem bạn có nghĩ mình năng suất hơn hay không",
        "Suy nghĩ về ý tưởng nhưng không đo lường dữ liệu cụ thể",
        "Nhờ ai đó đánh giá công việc của bạn nhưng đừng xem các con số"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Measurement & Metrics",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#measurement", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Thói quen năng suất cá nhân liên quan đến hiệu suất tổ chức như thế nào?",
      options: [
        "Không có mối quan hệ trực tiếp - cá nhân độc lập với tổ chức",
        "Chỉ năng suất của lãnh đạo mới quan trọng ở cấp độ tổ chức",
        "Năng suất của từng nhân viên cộng dồn để tạo ra hiệu quả tổ chức",
        "Năng suất chỉ là khái niệm lý thuyết và không thể đo lường trong thực tế"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#productivity", "#advanced", "#critical-thinking", "#vi", "#all-languages"]
    }
  ],
  // Indonesian (ID) - Professional translations
  ID: [
    {
      question: "Apa itu produktivitas dalam arti paling sederhana?",
      options: [
        "Lebih banyak pekerjaan dalam waktu lebih singkat",
        "Lebih sedikit pekerjaan dalam waktu lebih lama",
        "Merasa lelah setelah bekerja",
        "Tidak harus bekerja"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#productivity", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Manakah dari berikut ini yang BUKAN hambatan produktivitas?",
      options: [
        "Terus-menerus memeriksa email",
        "Mengambil istirahat teratur",
        "Beralih di antara banyak tugas",
        "Prioritas yang tidak jelas"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#productivity", "#intermediate", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Metode mana yang membantu mengurangi biaya pergantian konteks?",
      options: [
        "Bekerja pada beberapa proyek secara bersamaan",
        "Mengelompokkan tugas serupa bersama",
        "Memeriksa email secara sering",
        "Menanggapi pesan segera"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Context Switching",
      questionType: QuestionType.RECALL,
      hashtags: ["#context-switching", "#intermediate", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Mengapa kerangka OKR (Tujuan dan Hasil Utama) berguna dalam menetapkan tujuan produktivitas?",
      options: [
        "Karena tidak memerlukan waktu untuk evaluasi",
        "Karena membedakan antara tujuan yang jelas dan hasil yang dapat diukur",
        "Karena mengurangi akuntabilitas karyawan",
        "Karena mencegah semua masalah produktivitas"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Goal Hierarchy",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Apa yang harus Anda lakukan jika tidak mencapai tujuan harian Anda?",
      options: [
        "Tidak ada - tujuan tidak penting",
        "Segera tinggalkan proyek",
        "Tinjau apa yang salah dan sesuaikan rencana Anda",
        "Ambil lebih banyak pekerjaan keesokan harinya"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Goal Hierarchy",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#planning", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Bagaimana Anda dapat melacak peningkatan produktivitas Anda secara terukur selama minggu pertama?",
      options: [
        "Buat log aktivitas mingguan dan bandingkan dengan minggu sebelumnya",
        "Rasakan apakah Anda pikir Anda lebih produktif atau tidak",
        "Pikirkan tentang ide tetapi jangan ukur data konkret",
        "Minta seseorang mengevaluasi pekerjaan Anda tetapi jangan lihat angkanya"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Measurement & Metrics",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#measurement", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Bagaimana kebiasaan produktivitas individu berhubungan dengan kinerja organisasi?",
      options: [
        "Tidak ada hubungan langsung - individu independen dari organisasi",
        "Hanya produktivitas pemimpin yang penting di tingkat organisasi",
        "Produktivitas karyawan individu bertambah untuk menciptakan efektivitas organisasi",
        "Produktivitas hanyalah konsep teoretis dan tidak dapat diukur dalam praktik"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#productivity", "#advanced", "#critical-thinking", "#id", "#all-languages"]
    }
  ],
  // Arabic (AR) - Professional translations (RTL)
  AR: [
    {
      question: "ما هي الإنتاجية بأبسط معانيها؟",
      options: [
        "المزيد من العمل في وقت أقل",
        "أقل عمل في وقت أطول",
        "الشعور بالإرهاق بعد العمل",
        "عدم الحاجة إلى العمل"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#productivity", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "أي مما يلي ليس عائقًا للإنتاجية؟",
      options: [
        "التحقق المستمر من البريد الإلكتروني",
        "أخذ فترات راحة منتظمة",
        "التبديل بين مهام متعددة",
        "الأولويات غير الواضحة"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#productivity", "#intermediate", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "ما هي الطريقة التي تساعد في تقليل تكلفة تبديل السياق؟",
      options: [
        "العمل على مشاريع متعددة في وقت واحد",
        "تجميع المهام المتشابهة معًا",
        "التحقق من البريد الإلكتروني بشكل متكرر",
        "الرد على الرسائل فورًا"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Context Switching",
      questionType: QuestionType.RECALL,
      hashtags: ["#context-switching", "#intermediate", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "لماذا يعتبر إطار OKR (الأهداف والنتائج الرئيسية) مفيدًا في تحديد أهداف الإنتاجية؟",
      options: [
        "لأنه لا يتطلب وقتًا للتقييم",
        "لأنه يميز بين الأهداف الواضحة والنتائج القابلة للقياس",
        "لأنه يقلل من مسؤولية الموظفين",
        "لأنه يمنع جميع مشاكل الإنتاجية"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Goal Hierarchy",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "ماذا يجب أن تفعل إذا لم تحقق هدفك اليومي؟",
      options: [
        "لا شيء - الهدف غير مهم",
        "التخلي عن المشروع فورًا",
        "راجع ما حدث بشكل خاطئ وعدّل خطتك",
        "تحمل المزيد من العمل في اليوم التالي"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Goal Hierarchy",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#planning", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "كيف يمكنك تتبع تحسن إنتاجيتك بشكل قابل للقياس خلال الأسبوع الأول؟",
      options: [
        "أنشئ سجل أنشطة أسبوعي وقارنه بأسبوعك السابق",
        "اشعر بما إذا كنت تعتقد أنك أكثر إنتاجية أم لا",
        "فكر في الأفكار ولكن لا تقيس البيانات الملموسة",
        "اطلب من شخص ما تقييم عملك ولكن لا تنظر إلى الأرقام"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Measurement & Metrics",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#measurement", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "كيف ترتبط عادات الإنتاجية الفردية بأداء المنظمة؟",
      options: [
        "لا توجد علاقة مباشرة - الأفراد مستقلون عن المنظمة",
        "فقط إنتاجية القادة مهمة على المستوى التنظيمي",
        "إنتاجية الموظفين الأفراد تتراكم لإنشاء فعالية تنظيمية",
        "الإنتاجية هي مجرد مفهوم نظري ولا يمكن قياسها في الممارسة"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#productivity", "#advanced", "#critical-thinking", "#ar", "#all-languages"]
    }
  ],
  // Portuguese (PT) - Professional translations (Brazilian)
  PT: [
    {
      question: "O que é produtividade em seu sentido mais simples?",
      options: [
        "Mais trabalho em menos tempo",
        "Menos trabalho em mais tempo",
        "Estar exausto após o trabalho",
        "Não ter que trabalhar"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#productivity", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "Qual das seguintes opções NÃO é um obstáculo à produtividade?",
      options: [
        "Verificar e-mails constantemente",
        "Fazer pausas regulares",
        "Alternar entre múltiplas tarefas",
        "Prioridades indefinidas"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#productivity", "#intermediate", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "Qual método ajuda a reduzir o custo da troca de contexto?",
      options: [
        "Trabalhar em vários projetos simultaneamente",
        "Agrupar tarefas semelhantes",
        "Verificar e-mail com frequência",
        "Responder mensagens imediatamente"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Context Switching",
      questionType: QuestionType.RECALL,
      hashtags: ["#context-switching", "#intermediate", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "Por que a estrutura OKR (Objetivos e Resultados-Chave) é útil para definir metas de produtividade?",
      options: [
        "Porque não requer tempo para avaliação",
        "Porque distingue entre objetivos claros e resultados mensuráveis",
        "Porque reduz a responsabilidade dos funcionários",
        "Porque previne todos os problemas de produtividade"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Goal Hierarchy",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "O que você deve fazer se não atingir sua meta diária?",
      options: [
        "Nada - a meta não é importante",
        "Abandonar o projeto imediatamente",
        "Revisar o que deu errado e ajustar seu plano",
        "Assumir mais trabalho no dia seguinte"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Goal Hierarchy",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#planning", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Como você pode rastrear de forma mensurável a melhoria da sua produtividade na primeira semana?",
      options: [
        "Criar um registro de atividades semanal e compará-lo com sua semana anterior",
        "Sentir se você acha que está mais produtivo ou não",
        "Pensar em ideias, mas não medir dados concretos",
        "Pedir a alguém para avaliar seu trabalho, mas não olhar os números"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Measurement & Metrics",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#measurement", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Como os hábitos de produtividade individual se relacionam com o desempenho organizacional?",
      options: [
        "Não há relação direta - os indivíduos são independentes da organização",
        "Apenas a produtividade dos líderes importa no nível organizacional",
        "A produtividade dos funcionários individuais se acumula para criar eficácia organizacional",
        "A produtividade é apenas um conceito teórico e não pode ser medida na prática"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#productivity", "#advanced", "#critical-thinking", "#pt", "#all-languages"]
    }
  ],
  // Hindi (HI) - Professional translations
  HI: [
    {
      question: "सबसे सरल अर्थ में उत्पादकता क्या है?",
      options: [
        "कम समय में अधिक काम",
        "अधिक समय में कम काम",
        "काम के बाद थकान महसूस करना",
        "काम नहीं करना पड़ना"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#productivity", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "निम्नलिखित में से कौन सा उत्पादकता की बाधा नहीं है?",
      options: [
        "लगातार ईमेल जांचना",
        "नियमित ब्रेक लेना",
        "कई कार्यों के बीच स्विच करना",
        "अस्पष्ट प्राथमिकताएं"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Productivity Foundations",
      questionType: QuestionType.RECALL,
      hashtags: ["#productivity", "#intermediate", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "कौन सी विधि संदर्भ स्विचिंग की लागत को कम करने में मदद करती है?",
      options: [
        "एक साथ कई परियोजनाओं पर काम करना",
        "समान कार्यों को एक साथ समूहीकृत करना",
        "अक्सर ईमेल जांचना",
        "तुरंत संदेशों का जवाब देना"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Context Switching",
      questionType: QuestionType.RECALL,
      hashtags: ["#context-switching", "#intermediate", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "OKR (उद्देश्य और प्रमुख परिणाम) ढांचा उत्पादकता लक्ष्य निर्धारित करने में क्यों उपयोगी है?",
      options: [
        "क्योंकि इसे मूल्यांकन के लिए समय की आवश्यकता नहीं है",
        "क्योंकि यह स्पष्ट उद्देश्यों और मापने योग्य परिणामों के बीच अंतर करता है",
        "क्योंकि यह कर्मचारियों की जवाबदेही को कम करता है",
        "क्योंकि यह सभी उत्पादकता समस्याओं को रोकता है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Goal Hierarchy",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goal-setting", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "यदि आप अपने दैनिक लक्ष्य को प्राप्त नहीं करते हैं तो आपको क्या करना चाहिए?",
      options: [
        "कुछ नहीं - लक्ष्य महत्वपूर्ण नहीं है",
        "तुरंत परियोजना छोड़ दें",
        "समीक्षा करें कि क्या गलत हुआ और अपनी योजना समायोजित करें",
        "अगले दिन अधिक काम लें"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Goal Hierarchy",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#planning", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "आप पहले सप्ताह के दौरान अपने उत्पादकता सुधार को मापने योग्य तरीके से कैसे ट्रैक कर सकते हैं?",
      options: [
        "एक साप्ताहिक गतिविधि लॉग बनाएं और इसे अपने पिछले सप्ताह से तुलना करें",
        "महसूस करें कि आप सोचते हैं कि आप अधिक उत्पादक हैं या नहीं",
        "विचारों के बारे में सोचें लेकिन ठोस डेटा मापें नहीं",
        "किसी से अपने काम का मूल्यांकन करने के लिए कहें लेकिन संख्याओं को न देखें"
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Measurement & Metrics",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#measurement", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "व्यक्तिगत उत्पादकता की आदतें संगठनात्मक प्रदर्शन से कैसे संबंधित हैं?",
      options: [
        "कोई प्रत्यक्ष संबंध नहीं है - व्यक्ति संगठन से स्वतंत्र हैं",
        "केवल नेताओं की उत्पादकता संगठनात्मक स्तर पर मायने रखती है",
        "व्यक्तिगत कर्मचारियों की उत्पादकता संगठनात्मक प्रभावशीलता बनाने के लिए जमा होती है",
        "उत्पादकता केवल एक सैद्धांतिक अवधारणा है और व्यवहार में मापी नहीं जा सकती"
      ],
      correctIndex: 2,
      difficulty: QuestionDifficulty.HARD,
      category: "Productivity Foundations",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#productivity", "#advanced", "#critical-thinking", "#hi", "#all-languages"]
    }
  ]
};

async function seedDay1Enhanced() {
  try {
    await connectDB();
    console.log('🌱 SEEDING DAY 1 ENHANCED QUIZ QUESTIONS\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    let totalQuestions = 0;
    let totalUpdated = 0;
    let totalCreated = 0;

    for (const lang of LANGUAGES) {
      const courseId = `${COURSE_ID_BASE}_${lang}`;
      const lessonId = `${COURSE_ID_BASE}_${lang}_DAY_01`;

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
      const questions = DAY1_QUESTIONS[lang];
      
      if (!questions || questions.length === 0) {
        console.error(`   ❌ ERROR: No questions defined for ${lang}! Questions MUST be in course language.`);
        throw new Error(`Missing translations for ${lang} - Day 1 questions must be in course language, not English fallback`);
      }

      console.log(`   📝 Seeding ${questions.length} questions...`);

      // Process each question
      for (let i = 0; i < questions.length; i++) {
        const qData = questions[i];
        
        // Generate UUID if not exists
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
    console.log(`\n✅ DAY 1 ENHANCEMENT COMPLETE!\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedDay1Enhanced();
