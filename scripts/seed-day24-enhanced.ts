/**
 * Seed Day 24 Enhanced Quiz Questions
 * 
 * Purpose: Enhance Day 24 quizzes from 5 to 7 questions across all 10 languages
 * Why: Part of Quiz Quality Enhancement - Phase 1, Day 24
 * 
 * Lesson Topic: Filtering and Priorities (what to ignore, what matters)
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
const DAY_NUMBER = 24;
const LANGUAGES = ['HU', 'EN', 'TR', 'BG', 'PL', 'VI', 'ID', 'AR', 'PT', 'HI'];

/**
 * Day 24 Enhanced Questions - All Languages
 * Topic: Filtering and Priorities
 * Structure: 7 questions per language
 * Q1-Q3: Recall (foundational concepts)
 * Q4: Application (why filtering matters)
 * Q5: Application (scenario-based)
 * Q6: Application (practical implementation)
 * Q7: Critical Thinking (systems integration)
 */
const DAY24_QUESTIONS: Record<string, Array<{
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: QuestionDifficulty;
  category: string;
  questionType: QuestionType;
  hashtags: string[];
}>> = {
  EN: [
    // Q1: Saying no benefit (RECALL)
    {
      question: "According to the lesson, why is learning to say 'no' important?",
      options: [
        "It's not important",
        "It protects your time and energy, allows focus on priorities, and prevents overcommitment",
        "It only applies to certain situations",
        "It requires no practice"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Priorities",
      questionType: QuestionType.RECALL,
      hashtags: ["#priorities", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q2: Filtering definition (RECALL)
    {
      question: "According to the lesson, what is filtering in productivity?",
      options: [
        "Only blocking distractions",
        "The process of identifying what to ignore, what matters, and focusing resources on high-value activities",
        "Only saying no",
        "No structure needed"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Filtering",
      questionType: QuestionType.RECALL,
      hashtags: ["#filtering", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q3: Priority setting (RECALL)
    {
      question: "According to the lesson, how should priorities be determined?",
      options: [
        "Randomly",
        "Based on alignment with goals, impact on outcomes, and importance to long-term success",
        "Only by urgency",
        "No criteria needed"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Priorities",
      questionType: QuestionType.RECALL,
      hashtags: ["#priorities", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q4: Why filtering matters (APPLICATION)
    {
      question: "Why are filtering and priorities important for productivity according to the lesson?",
      options: [
        "They eliminate all options",
        "They protect time and energy, enable focus on high-value work, prevent overcommitment, and ensure resources go to what truly matters",
        "They only apply to certain jobs",
        "They require no effort"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Priorities",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#priorities", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q5: Saying no scenario (APPLICATION)
    {
      question: "You receive multiple requests that don't align with your priorities. According to the lesson, what should you do?",
      options: [
        "Accept all of them",
        "Say no politely, explain your priorities, and redirect to what matters",
        "Only accept urgent ones",
        "Ignore all requests"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Priorities",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#priorities", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q6: Building filter system (APPLICATION)
    {
      question: "You want to improve your ability to filter and prioritize. According to the lesson, what should you establish?",
      options: [
        "Just accept everything",
        "Clear criteria for what matters, boundaries for saying no, a system for evaluating requests, and regular priority reviews",
        "Only boundaries",
        "Only criteria"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Priorities",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#priorities", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q7: Overcommitment analysis (CRITICAL THINKING)
    {
      question: "A person says yes to everything, feels overwhelmed, and can't focus on important work. According to the lesson's framework, what is the core issue?",
      options: [
        "Not enough opportunities",
        "Lack of filtering and priorities - missing criteria for what matters, boundaries for saying no, and focus systems that protect time and energy",
        "Too much free time",
        "Filtering is unnecessary"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Priorities",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#priorities", "#advanced", "#critical-thinking", "#en", "#all-languages"]
    }
  ],
  // Hungarian (HU) - Professional translations
  HU: [
    {
      question: "A lecke szerint miért fontos megtanulni a 'nem' mondást?",
      options: [
        "Nem fontos",
        "Védi az idődet és energiádat, lehetővé teszi a prioritásokra való összpontosítást, és megelőzi a túlkötelezettséget",
        "Csak bizonyos helyzetekre vonatkozik",
        "Nem igényel gyakorlást"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Prioritások",
      questionType: QuestionType.RECALL,
      hashtags: ["#priorities", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint mi a szűrés a termelékenységben?",
      options: [
        "Csak a zavarások blokkolása",
        "A folyamat, amely azonosítja, mit kell figyelmen kívül hagyni, mi számít, és az erőforrások magas értékű tevékenységekre való összpontosítását",
        "Csak nemet mondani",
        "Nincs szükség struktúrára"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Szűrés",
      questionType: QuestionType.RECALL,
      hashtags: ["#filtering", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint hogyan kellene meghatározni a prioritásokat?",
      options: [
        "Véletlenszerűen",
        "A célokkal való összhang, az eredményekre gyakorolt hatás, és a hosszú távú sikerhez való fontosság alapján",
        "Csak sürgősség szerint",
        "Nincs szükség kritériumokra"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Prioritások",
      questionType: QuestionType.RECALL,
      hashtags: ["#priorities", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "Miért fontosak a szűrés és a prioritások a termelékenységhez a lecke szerint?",
      options: [
        "Kiküszöbölik az összes opciót",
        "Védik az időt és energiát, lehetővé teszik a magas értékű munkára való összpontosítást, megelőzik a túlkötelezettséget, és biztosítják, hogy az erőforrások a valóban fontosakra menjenek",
        "Csak bizonyos munkákra vonatkoznak",
        "Nem igényelnek erőfeszítést"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Prioritások",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#priorities", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Több kérést kapsz, amelyek nem igazodnak a prioritásaidhoz. A lecke szerint mit kellene tenned?",
      options: [
        "Fogadd el mindet",
        "Mondj nemet udvariasan, magyarázd el a prioritásaidat, és irányítsd át, ami számít",
        "Csak a sürgőseket fogadd el",
        "Hagyd figyelmen kívül az összes kérést"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Prioritások",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#priorities", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Javítani szeretnéd a szűrési és prioritizálási képességedet. A lecke szerint mit kellene létrehozni?",
      options: [
        "Csak fogadj el mindent",
        "Tiszta kritériumok arról, mi számít, határok a nemet mondáshoz, egy rendszer a kérések értékeléséhez, és rendszeres prioritás áttekintések",
        "Csak határok",
        "Csak kritériumok"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Prioritások",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#priorities", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy személy mindenre igent mond, túlterheltnek érzi magát, és nem tud a fontos munkára összpontosítani. A lecke keretrendszere szerint mi a fő probléma?",
      options: [
        "Nincs elég lehetőség",
        "Hiányzik a szűrés és a prioritások - hiányoznak a kritériumok arról, mi számít, határok a nemet mondáshoz, és fókusz rendszerek, amelyek védik az időt és energiát",
        "Túl sok szabadidő",
        "A szűrés felesleges"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Prioritások",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#priorities", "#advanced", "#critical-thinking", "#hu", "#all-languages"]
    }
  ],
  // Turkish (TR) - Professional translations
  TR: [
    {
      question: "Derse göre 'hayır' demeyi öğrenmek neden önemlidir?",
      options: [
        "Önemli değil",
        "Zamanını ve enerjini korur, önceliklere odaklanmaya izin verir ve aşırı taahhütü önler",
        "Sadece belirli durumlara uygulanır",
        "Pratik gerektirmez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Öncelikler",
      questionType: QuestionType.RECALL,
      hashtags: ["#priorities", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre verimlilikte filtreleme nedir?",
      options: [
        "Sadece dikkat dağıtıcıları engellemek",
        "Neyi görmezden geleceğini, neyin önemli olduğunu belirleme ve kaynakları yüksek değerli faaliyetlere odaklama süreci",
        "Sadece hayır demek",
        "Yapı gerekmez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Filtreleme",
      questionType: QuestionType.RECALL,
      hashtags: ["#filtering", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre öncelikler nasıl belirlenmelidir?",
      options: [
        "Rastgele",
        "Hedeflerle uyum, sonuçlara etki ve uzun vadeli başarıya önem temelinde",
        "Sadece aciliyetle",
        "Kriter gerekmez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Öncelikler",
      questionType: QuestionType.RECALL,
      hashtags: ["#priorities", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre filtreleme ve öncelikler verimlilik için neden önemlidir?",
      options: [
        "Tüm seçenekleri ortadan kaldırırlar",
        "Zamanı ve enerjiyi korurlar, yüksek değerli işe odaklanmayı sağlarlar, aşırı taahhütü önlerler ve kaynakların gerçekten önemli olana gitmesini sağlarlar",
        "Sadece belirli işlere uygulanırlar",
        "Çaba gerektirmezler"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Öncelikler",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#priorities", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Önceliklerinle uyumlu olmayan birden fazla istek alıyorsun. Derse göre ne yapmalısın?",
      options: [
        "Hepsini kabul et",
        "Nazikçe hayır de, önceliklerini açıkla ve önemli olana yönlendir",
        "Sadece acil olanları kabul et",
        "Tüm istekleri görmezden gel"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Öncelikler",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#priorities", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Filtreleme ve önceliklendirme yeteneğini geliştirmek istiyorsun. Derse göre ne kurmalısın?",
      options: [
        "Sadece her şeyi kabul et",
        "Ne önemli olduğuna dair net kriterler, hayır demek için sınırlar, istekleri değerlendirmek için bir sistem ve düzenli öncelik incelemeleri",
        "Sadece sınırlar",
        "Sadece kriterler"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Öncelikler",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#priorities", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir kişi her şeye evet diyor, bunalmış hissediyor ve önemli işe odaklanamıyor. Derse göre temel sorun nedir?",
      options: [
        "Yeterli fırsat yok",
        "Filtreleme ve öncelik eksikliği - ne önemli olduğuna dair kriterler, hayır demek için sınırlar ve zamanı ve enerjiyi koruyan odak sistemleri eksik",
        "Çok fazla boş zaman",
        "Filtreleme gereksiz"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Öncelikler",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#priorities", "#advanced", "#critical-thinking", "#tr", "#all-languages"]
    }
  ],
  // Bulgarian (BG) - Professional translations
  BG: [
    {
      question: "Според урока, защо е важно да се научиш да казваш 'не'?",
      options: [
        "Не е важно",
        "Защитава времето и енергията ти, позволява фокус върху приоритетите и предотвратява прекомерно ангажиране",
        "Прилага се само за определени ситуации",
        "Не изисква практика"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Приоритети",
      questionType: QuestionType.RECALL,
      hashtags: ["#priorities", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, какво е филтрирането в производителността?",
      options: [
        "Само блокиране на разсейвания",
        "Процесът на идентифициране на какво да игнорираш, какво е важно и фокусиране на ресурсите върху дейности с висока стойност",
        "Само да кажеш не",
        "Няма нужда от структура"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Филтриране",
      questionType: QuestionType.RECALL,
      hashtags: ["#filtering", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, как трябва да се определят приоритетите?",
      options: [
        "На случаен принцип",
        "Въз основа на съответствие с целите, въздействие върху резултатите и важност за дългосрочен успех",
        "Само по спешност",
        "Критерии не са необходими"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Приоритети",
      questionType: QuestionType.RECALL,
      hashtags: ["#priorities", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Защо филтрирането и приоритетите са важни за производителността според урока?",
      options: [
        "Премахват всички опции",
        "Защитават времето и енергията, позволяват фокус върху работа с висока стойност, предотвратяват прекомерно ангажиране и осигуряват, че ресурсите отиват към това, което наистина е важно",
        "Прилагат се само за определени работи",
        "Не изискват усилие"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Приоритети",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#priorities", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Получаваш множество заявки, които не съответстват на приоритетите ти. Според урока, какво трябва да направиш?",
      options: [
        "Приеми всички",
        "Кажи не учтиво, обясни приоритетите си и пренасочи към това, което е важно",
        "Приеми само спешните",
        "Игнорирай всички заявки"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Приоритети",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#priorities", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Искаш да подобриш способността си за филтриране и приоритизиране. Според урока, какво трябва да установиш?",
      options: [
        "Просто приеми всичко",
        "Ясни критерии за това, което е важно, граници за казване на не, система за оценяване на заявки и редовни прегледи на приоритети",
        "Само граници",
        "Само критерии"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Приоритети",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#priorities", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Човек казва да на всичко, чувства се претоварен и не може да се фокусира върху важна работа. Според рамката на урока, какъв е основният проблем?",
      options: [
        "Няма достатъчно възможности",
        "Липса на филтриране и приоритети - липсват критерии за това, което е важно, граници за казване на не и системи за фокус, които защитават времето и енергията",
        "Твърде много свободно време",
        "Филтрирането е ненужно"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Приоритети",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#priorities", "#advanced", "#critical-thinking", "#bg", "#all-languages"]
    }
  ],
  // Polish (PL) - Professional translations
  PL: [
    {
      question: "Według lekcji, dlaczego uczenie się mówienia 'nie' jest ważne?",
      options: [
        "Nie jest ważne",
        "Chroni twój czas i energię, pozwala skupić się na priorytetach i zapobiega nadmiernemu zaangażowaniu",
        "Stosuje się tylko do określonych sytuacji",
        "Nie wymaga praktyki"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Priorytety",
      questionType: QuestionType.RECALL,
      hashtags: ["#priorities", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, czym jest filtrowanie w produktywności?",
      options: [
        "Tylko blokowanie rozpraszaczy",
        "Proces identyfikowania, co zignorować, co jest ważne i skupiania zasobów na działaniach o wysokiej wartości",
        "Tylko mówienie nie",
        "Struktura nie jest potrzebna"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Filtrowanie",
      questionType: QuestionType.RECALL,
      hashtags: ["#filtering", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, jak powinny być określane priorytety?",
      options: [
        "Losowo",
        "Na podstawie zgodności z celami, wpływu na wyniki i ważności dla długoterminowego sukcesu",
        "Tylko pilnością",
        "Kryteria nie są potrzebne"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Priorytety",
      questionType: QuestionType.RECALL,
      hashtags: ["#priorities", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Dlaczego filtrowanie i priorytety są ważne dla produktywności według lekcji?",
      options: [
        "Eliminują wszystkie opcje",
        "Chronią czas i energię, umożliwiają skupienie się na pracy o wysokiej wartości, zapobiegają nadmiernemu zaangażowaniu i zapewniają, że zasoby idą do tego, co naprawdę ma znaczenie",
        "Stosują się tylko do określonych prac",
        "Nie wymagają wysiłku"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Priorytety",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#priorities", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Otrzymujesz wiele próśb, które nie są zgodne z twoimi priorytetami. Według lekcji, co powinieneś zrobić?",
      options: [
        "Zaakceptuj wszystkie",
        "Powiedz nie grzecznie, wyjaśnij swoje priorytety i przekieruj na to, co ma znaczenie",
        "Zaakceptuj tylko pilne",
        "Zignoruj wszystkie prośby"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Priorytety",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#priorities", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Chcesz poprawić swoją zdolność do filtrowania i priorytetyzacji. Według lekcji, co powinieneś ustanowić?",
      options: [
        "Po prostu zaakceptuj wszystko",
        "Jasne kryteria dla tego, co ma znaczenie, granice dla mówienia nie, system oceniania próśb i regularne przeglądy priorytetów",
        "Tylko granice",
        "Tylko kryteria"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Priorytety",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#priorities", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Osoba mówi tak na wszystko, czuje się przytłoczona i nie może skupić się na ważnej pracy. Według ram lekcji, jaki jest główny problem?",
      options: [
        "Nie ma wystarczającej liczby możliwości",
        "Brak filtrowania i priorytetów - brakuje kryteriów dla tego, co ma znaczenie, granic dla mówienia nie i systemów skupienia, które chronią czas i energię",
        "Zbyt dużo wolnego czasu",
        "Filtrowanie jest niepotrzebne"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Priorytety",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#priorities", "#advanced", "#critical-thinking", "#pl", "#all-languages"]
    }
  ],
  // Vietnamese (VI) - Professional translations
  VI: [
    {
      question: "Theo bài học, tại sao học nói 'không' quan trọng?",
      options: [
        "Nó không quan trọng",
        "Nó bảo vệ thời gian và năng lượng của bạn, cho phép tập trung vào ưu tiên, và ngăn chặn cam kết quá mức",
        "Nó chỉ áp dụng cho một số tình huống",
        "Nó không yêu cầu thực hành"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Ưu Tiên",
      questionType: QuestionType.RECALL,
      hashtags: ["#priorities", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, lọc lựa trong năng suất là gì?",
      options: [
        "Chỉ chặn phiền nhiễu",
        "Quá trình xác định điều cần bỏ qua, điều quan trọng, và tập trung tài nguyên vào các hoạt động có giá trị cao",
        "Chỉ nói không",
        "Không cần cấu trúc"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Lọc Lựa",
      questionType: QuestionType.RECALL,
      hashtags: ["#filtering", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, ưu tiên nên được xác định như thế nào?",
      options: [
        "Ngẫu nhiên",
        "Dựa trên sự phù hợp với mục tiêu, tác động đến kết quả, và tầm quan trọng đối với thành công dài hạn",
        "Chỉ theo mức độ khẩn cấp",
        "Không cần tiêu chí"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Ưu Tiên",
      questionType: QuestionType.RECALL,
      hashtags: ["#priorities", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Tại sao lọc lựa và ưu tiên quan trọng cho năng suất theo bài học?",
      options: [
        "Chúng loại bỏ tất cả các tùy chọn",
        "Chúng bảo vệ thời gian và năng lượng, cho phép tập trung vào công việc có giá trị cao, ngăn chặn cam kết quá mức, và đảm bảo tài nguyên đi đến những gì thực sự quan trọng",
        "Chúng chỉ áp dụng cho một số công việc",
        "Chúng không yêu cầu nỗ lực"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Ưu Tiên",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#priorities", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Bạn nhận được nhiều yêu cầu không phù hợp với ưu tiên của mình. Theo bài học, bạn nên làm gì?",
      options: [
        "Chấp nhận tất cả",
        "Nói không một cách lịch sự, giải thích ưu tiên của bạn, và chuyển hướng đến những gì quan trọng",
        "Chỉ chấp nhận những yêu cầu khẩn cấp",
        "Bỏ qua tất cả các yêu cầu"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Ưu Tiên",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#priorities", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Bạn muốn cải thiện khả năng lọc lựa và ưu tiên của mình. Theo bài học, bạn nên thiết lập gì?",
      options: [
        "Chỉ chấp nhận mọi thứ",
        "Tiêu chí rõ ràng cho những gì quan trọng, ranh giới cho việc nói không, một hệ thống để đánh giá yêu cầu, và đánh giá ưu tiên thường xuyên",
        "Chỉ ranh giới",
        "Chỉ tiêu chí"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Ưu Tiên",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#priorities", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Một người nói có với mọi thứ, cảm thấy quá tải, và không thể tập trung vào công việc quan trọng. Theo khung của bài học, vấn đề cốt lõi là gì?",
      options: [
        "Không đủ cơ hội",
        "Thiếu lọc lựa và ưu tiên - thiếu tiêu chí cho những gì quan trọng, ranh giới cho việc nói không, và hệ thống tập trung bảo vệ thời gian và năng lượng",
        "Quá nhiều thời gian rảnh",
        "Lọc lựa là không cần thiết"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Ưu Tiên",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#priorities", "#advanced", "#critical-thinking", "#vi", "#all-languages"]
    }
  ],
  // Indonesian (ID) - Professional translations
  ID: [
    {
      question: "Menurut pelajaran, mengapa belajar mengatakan 'tidak' penting?",
      options: [
        "Tidak penting",
        "Melindungi waktu dan energi Anda, memungkinkan fokus pada prioritas, dan mencegah komitmen berlebihan",
        "Hanya berlaku untuk situasi tertentu",
        "Tidak memerlukan latihan"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Prioritas",
      questionType: QuestionType.RECALL,
      hashtags: ["#priorities", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, apa itu penyaringan dalam produktivitas?",
      options: [
        "Hanya memblokir gangguan",
        "Proses mengidentifikasi apa yang diabaikan, apa yang penting, dan memfokuskan sumber daya pada aktivitas bernilai tinggi",
        "Hanya mengatakan tidak",
        "Tidak perlu struktur"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Penyaringan",
      questionType: QuestionType.RECALL,
      hashtags: ["#filtering", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, bagaimana prioritas harus ditentukan?",
      options: [
        "Secara acak",
        "Berdasarkan keselarasan dengan tujuan, dampak pada hasil, dan pentingnya untuk kesuksesan jangka panjang",
        "Hanya berdasarkan urgensi",
        "Tidak perlu kriteria"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Prioritas",
      questionType: QuestionType.RECALL,
      hashtags: ["#priorities", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Mengapa penyaringan dan prioritas penting untuk produktivitas menurut pelajaran?",
      options: [
        "Mereka menghilangkan semua opsi",
        "Mereka melindungi waktu dan energi, memungkinkan fokus pada pekerjaan bernilai tinggi, mencegah komitmen berlebihan, dan memastikan sumber daya pergi ke apa yang benar-benar penting",
        "Mereka hanya berlaku untuk pekerjaan tertentu",
        "Mereka tidak memerlukan upaya"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Prioritas",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#priorities", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Anda menerima banyak permintaan yang tidak selaras dengan prioritas Anda. Menurut pelajaran, apa yang harus Anda lakukan?",
      options: [
        "Terima semuanya",
        "Katakan tidak dengan sopan, jelaskan prioritas Anda, dan alihkan ke apa yang penting",
        "Hanya terima yang mendesak",
        "Abaikan semua permintaan"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Prioritas",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#priorities", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Anda ingin meningkatkan kemampuan Anda untuk menyaring dan memprioritaskan. Menurut pelajaran, apa yang harus Anda tetapkan?",
      options: [
        "Hanya terima semuanya",
        "Kriteria jelas untuk apa yang penting, batasan untuk mengatakan tidak, sistem untuk mengevaluasi permintaan, dan tinjauan prioritas rutin",
        "Hanya batasan",
        "Hanya kriteria"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Prioritas",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#priorities", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Seseorang mengatakan ya untuk semuanya, merasa kewalahan, dan tidak bisa fokus pada pekerjaan penting. Menurut kerangka pelajaran, apa masalah intinya?",
      options: [
        "Tidak ada cukup peluang",
        "Kurangnya penyaringan dan prioritas - kurang kriteria untuk apa yang penting, batasan untuk mengatakan tidak, dan sistem fokus yang melindungi waktu dan energi",
        "Terlalu banyak waktu luang",
        "Penyaringan tidak perlu"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Prioritas",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#priorities", "#advanced", "#critical-thinking", "#id", "#all-languages"]
    }
  ],
  // Arabic (AR) - Professional translations (RTL)
  AR: [
    {
      question: "وفقًا للدرس، لماذا تعلم قول 'لا' مهم?",
      options: [
        "ليس مهمًا",
        "يحمي وقتك وطاقتك، يسمح بالتركيز على الأولويات، ويمنع الالتزام المفرط",
        "ينطبق فقط على حالات معينة",
        "لا يتطلب ممارسة"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "الأولويات",
      questionType: QuestionType.RECALL,
      hashtags: ["#priorities", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، ما هي التصفية في الإنتاجية?",
      options: [
        "فقط حظر المشتتات",
        "عملية تحديد ما يجب تجاهله، ما يهم، وتركيز الموارد على الأنشطة عالية القيمة",
        "فقط قول لا",
        "لا حاجة للهيكل"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "التصفية",
      questionType: QuestionType.RECALL,
      hashtags: ["#filtering", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، كيف يجب تحديد الأولويات?",
      options: [
        "عشوائيًا",
        "على أساس التوافق مع الأهداف، التأثير على النتائج، والأهمية للنجاح طويل الأجل",
        "فقط حسب الإلحاح",
        "لا حاجة للمعايير"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "الأولويات",
      questionType: QuestionType.RECALL,
      hashtags: ["#priorities", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "لماذا التصفية والأولويات مهمة للإنتاجية وفقًا للدرس?",
      options: [
        "إنها تلغي جميع الخيارات",
        "إنها تحمي الوقت والطاقة، تمكن من التركيز على العمل عالي القيمة، تمنع الالتزام المفرط، وتضمن أن الموارد تذهب إلى ما يهم حقًا",
        "تنطبق فقط على وظائف معينة",
        "لا تتطلب جهدًا"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "الأولويات",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#priorities", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "تتلقى طلبات متعددة لا تتماشى مع أولوياتك. وفقًا للدرس، ماذا يجب أن تفعل?",
      options: [
        "اقبلها جميعًا",
        "قل لا بأدب، اشرح أولوياتك، وأعد التوجيه إلى ما يهم",
        "اقبل فقط العاجلة",
        "تجاهل جميع الطلبات"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "الأولويات",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#priorities", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "تريد تحسين قدرتك على التصفية والترتيب حسب الأولوية. وفقًا للدرس، ماذا يجب أن تنشئ?",
      options: [
        "فقط اقبل كل شيء",
        "معايير واضحة لما يهم، حدود لقول لا، نظام لتقييم الطلبات، ومراجعات أولوية منتظمة",
        "فقط الحدود",
        "فقط المعايير"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "الأولويات",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#priorities", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "شخص يقول نعم لكل شيء، يشعر بالإرهاق، ولا يمكنه التركيز على العمل المهم. وفقًا لإطار الدرس، ما هي المشكلة الأساسية?",
      options: [
        "لا توجد فرص كافية",
        "نقص التصفية والأولويات - نقص المعايير لما يهم، حدود لقول لا، وأنظمة التركيز التي تحمي الوقت والطاقة",
        "الكثير من الوقت الحر",
        "التصفية غير ضرورية"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "الأولويات",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#priorities", "#advanced", "#critical-thinking", "#ar", "#all-languages"]
    }
  ],
  // Portuguese (PT) - Professional translations (Brazilian)
  PT: [
    {
      question: "De acordo com a lição, por que aprender a dizer 'não' é importante?",
      options: [
        "Não é importante",
        "Protege seu tempo e energia, permite foco em prioridades e previne comprometimento excessivo",
        "Aplica-se apenas a certas situações",
        "Não requer prática"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Prioridades",
      questionType: QuestionType.RECALL,
      hashtags: ["#priorities", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, o que é filtragem em produtividade?",
      options: [
        "Apenas bloquear distrações",
        "O processo de identificar o que ignorar, o que importa e focar recursos em atividades de alto valor",
        "Apenas dizer não",
        "Estrutura não é necessária"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Filtragem",
      questionType: QuestionType.RECALL,
      hashtags: ["#filtering", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, como as prioridades devem ser determinadas?",
      options: [
        "Aleatoriamente",
        "Com base no alinhamento com objetivos, impacto nos resultados e importância para o sucesso de longo prazo",
        "Apenas por urgência",
        "Critérios não são necessários"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Prioridades",
      questionType: QuestionType.RECALL,
      hashtags: ["#priorities", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "Por que filtragem e prioridades são importantes para produtividade de acordo com a lição?",
      options: [
        "Eliminam todas as opções",
        "Protegem tempo e energia, permitem foco em trabalho de alto valor, previnem comprometimento excessivo e garantem que recursos vão para o que realmente importa",
        "Aplicam-se apenas a certos trabalhos",
        "Não requerem esforço"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Prioridades",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#priorities", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Você recebe múltiplas solicitações que não se alinham com suas prioridades. De acordo com a lição, o que você deve fazer?",
      options: [
        "Aceite todas",
        "Diga não educadamente, explique suas prioridades e redirecione para o que importa",
        "Aceite apenas as urgentes",
        "Ignore todas as solicitações"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Prioridades",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#priorities", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Você quer melhorar sua capacidade de filtrar e priorizar. De acordo com a lição, o que você deve estabelecer?",
      options: [
        "Apenas aceite tudo",
        "Critérios claros para o que importa, limites para dizer não, um sistema para avaliar solicitações e revisões regulares de prioridades",
        "Apenas limites",
        "Apenas critérios"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Prioridades",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#priorities", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Uma pessoa diz sim para tudo, se sente sobrecarregada e não consegue focar em trabalho importante. De acordo com a estrutura da lição, qual é o problema central?",
      options: [
        "Não há oportunidades suficientes",
        "Falta de filtragem e prioridades - faltam critérios para o que importa, limites para dizer não e sistemas de foco que protegem tempo e energia",
        "Muito tempo livre",
        "Filtragem é desnecessária"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Prioridades",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#priorities", "#advanced", "#critical-thinking", "#pt", "#all-languages"]
    }
  ],
  // Hindi (HI) - Professional translations
  HI: [
    {
      question: "पाठ के अनुसार, 'नहीं' कहना सीखना क्यों महत्वपूर्ण है?",
      options: [
        "यह महत्वपूर्ण नहीं है",
        "यह आपके समय और ऊर्जा की रक्षा करता है, प्राथमिकताओं पर ध्यान केंद्रित करने की अनुमति देता है, और अत्यधिक प्रतिबद्धता को रोकता है",
        "यह केवल कुछ स्थितियों पर लागू होता है",
        "इसके लिए अभ्यास की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "प्राथमिकताएं",
      questionType: QuestionType.RECALL,
      hashtags: ["#priorities", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, उत्पादकता में फ़िल्टरिंग क्या है?",
      options: [
        "केवल विकर्षणों को अवरुद्ध करना",
        "यह पहचानने की प्रक्रिया है कि क्या अनदेखा करना है, क्या महत्वपूर्ण है, और उच्च मूल्य वाली गतिविधियों पर संसाधनों को केंद्रित करना",
        "केवल नहीं कहना",
        "संरचना की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "फ़िल्टरिंग",
      questionType: QuestionType.RECALL,
      hashtags: ["#filtering", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, प्राथमिकताओं को कैसे निर्धारित किया जाना चाहिए?",
      options: [
        "यादृच्छिक रूप से",
        "लक्ष्यों के साथ संरेखण, परिणामों पर प्रभाव, और दीर्घकालिक सफलता के लिए महत्व के आधार पर",
        "केवल तात्कालिकता से",
        "मानदंड की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "प्राथमिकताएं",
      questionType: QuestionType.RECALL,
      hashtags: ["#priorities", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार उत्पादकता के लिए फ़िल्टरिंग और प्राथमिकताएं क्यों महत्वपूर्ण हैं?",
      options: [
        "वे सभी विकल्पों को समाप्त करते हैं",
        "वे समय और ऊर्जा की रक्षा करते हैं, उच्च मूल्य वाले काम पर ध्यान केंद्रित करने में सक्षम बनाते हैं, अत्यधिक प्रतिबद्धता को रोकते हैं, और सुनिश्चित करते हैं कि संसाधन वास्तव में महत्वपूर्ण चीजों पर जाएं",
        "वे केवल कुछ नौकरियों पर लागू होते हैं",
        "उन्हें प्रयास की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "प्राथमिकताएं",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#priorities", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "आपको कई अनुरोध मिलते हैं जो आपकी प्राथमिकताओं के साथ संरेखित नहीं होते हैं। पाठ के अनुसार, आपको क्या करना चाहिए?",
      options: [
        "सभी को स्वीकार करें",
        "विनम्रता से नहीं कहें, अपनी प्राथमिकताओं को समझाएं, और महत्वपूर्ण चीजों पर पुनर्निर्देशित करें",
        "केवल जरूरी को स्वीकार करें",
        "सभी अनुरोधों को अनदेखा करें"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "प्राथमिकताएं",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#priorities", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "आप अपनी फ़िल्टरिंग और प्राथमिकता देने की क्षमता में सुधार करना चाहते हैं। पाठ के अनुसार, आपको क्या स्थापित करना चाहिए?",
      options: [
        "बस सब कुछ स्वीकार करें",
        "महत्वपूर्ण चीजों के लिए स्पष्ट मानदंड, नहीं कहने के लिए सीमाएं, अनुरोधों का मूल्यांकन करने के लिए एक प्रणाली, और नियमित प्राथमिकता समीक्षा",
        "केवल सीमाएं",
        "केवल मानदंड"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "प्राथमिकताएं",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#priorities", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक व्यक्ति हर चीज के लिए हाँ कहता है, अभिभूत महसूस करता है, और महत्वपूर्ण काम पर ध्यान केंद्रित नहीं कर सकता है। पाठ के ढांचे के अनुसार, मुख्य समस्या क्या है?",
      options: [
        "पर्याप्त अवसर नहीं हैं",
        "फ़िल्टरिंग और प्राथमिकताओं की कमी - महत्वपूर्ण चीजों के लिए मानदंड, नहीं कहने के लिए सीमाएं, और फोकस प्रणाली गायब हैं जो समय और ऊर्जा की रक्षा करती हैं",
        "बहुत अधिक खाली समय",
        "फ़िल्टरिंग अनावश्यक है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "प्राथमिकताएं",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#priorities", "#advanced", "#critical-thinking", "#hi", "#all-languages"]
    }
  ]
};

async function seedDay24Enhanced() {
  try {
    await connectDB();
    console.log('🌱 SEEDING DAY 24 ENHANCED QUIZ QUESTIONS\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    let totalQuestions = 0;
    let totalUpdated = 0;
    let totalCreated = 0;

    for (const lang of LANGUAGES) {
      const courseId = `${COURSE_ID_BASE}_${lang}`;
      const lessonId = `${COURSE_ID_BASE}_${lang}_DAY_24`;

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
      const questions = DAY24_QUESTIONS[lang];
      
      if (!questions || questions.length === 0) {
        console.error(`   ❌ ERROR: No questions defined for ${lang}! Questions MUST be in course language.`);
        throw new Error(`Missing translations for ${lang} - Day 24 questions must be in course language, not English fallback`);
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
    console.log(`\n✅ DAY 24 ENHANCEMENT COMPLETE!\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedDay24Enhanced();
