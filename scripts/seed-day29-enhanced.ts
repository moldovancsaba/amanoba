/**
 * Seed Day 29 Enhanced Quiz Questions
 * 
 * Purpose: Enhance Day 29 quizzes from 5 to 7 questions across all 10 languages
 * Why: Part of Quiz Quality Enhancement - Phase 1, Day 29
 * 
 * Lesson Topic: Continuous Improvement (learning, feedback, iteration)
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
const DAY_NUMBER = 29;
const LANGUAGES = ['HU', 'EN', 'TR', 'BG', 'PL', 'VI', 'ID', 'AR', 'PT', 'HI'];

/**
 * Day 29 Enhanced Questions - All Languages
 * Topic: Continuous Improvement
 * Structure: 7 questions per language
 * Q1-Q3: Recall (foundational concepts)
 * Q4: Application (why continuous improvement matters)
 * Q5: Application (scenario-based)
 * Q6: Application (practical implementation)
 * Q7: Critical Thinking (systems integration)
 */
const DAY29_QUESTIONS: Record<string, Array<{
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: QuestionDifficulty;
  category: string;
  questionType: QuestionType;
  hashtags: string[];
}>> = {
  EN: [
    // Q1: Continuous improvement definition (RECALL)
    {
      question: "According to the lesson, what is continuous improvement?",
      options: [
        "A one-time fix",
        "An ongoing process of learning from feedback, iterating on systems, and evolving productivity practices over time",
        "Only for beginners",
        "No structure needed"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Continuous Improvement",
      questionType: QuestionType.RECALL,
      hashtags: ["#continuous-improvement", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q2: Feedback loop steps (RECALL)
    {
      question: "According to the lesson, what are the steps in a feedback loop?",
      options: [
        "Just work randomly",
        "Act, measure results, analyze feedback, adjust approach, and iterate",
        "Only measure",
        "No structure needed"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Feedback",
      questionType: QuestionType.RECALL,
      hashtags: ["#feedback", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q3: Iteration importance (RECALL)
    {
      question: "According to the lesson, why is iteration important for productivity?",
      options: [
        "It's not important",
        "It allows systems to evolve, adapt to changing needs, and improve effectiveness over time",
        "It only applies to certain tasks",
        "It requires no effort"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Iteration",
      questionType: QuestionType.RECALL,
      hashtags: ["#iteration", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q4: Why continuous improvement matters (APPLICATION)
    {
      question: "Why is continuous improvement important for productivity according to the lesson?",
      options: [
        "It eliminates all work",
        "It ensures productivity systems evolve, adapt to changing needs, improve effectiveness over time, and prevent stagnation",
        "It only applies to certain jobs",
        "It requires no planning"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Continuous Improvement",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#continuous-improvement", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q5: Implementing feedback loop (APPLICATION)
    {
      question: "You want to improve your productivity system continuously. According to the lesson, what should you establish?",
      options: [
        "Just work randomly",
        "Regular feedback loops, measurement of results, analysis of what works and what doesn't, adjustments to approach, and iterative improvements",
        "Only measure once",
        "Only analyze"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Feedback",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#feedback", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q6: Learning from mistakes (APPLICATION)
    {
      question: "You notice a productivity system isn't working as expected. According to the lesson, what should you do?",
      options: [
        "Ignore it",
        "Analyze what went wrong, gather feedback, adjust the approach, and iterate to improve",
        "Only analyze",
        "Only adjust once"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Iteration",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#iteration", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q7: Stagnation problem solving (CRITICAL THINKING)
    {
      question: "A person's productivity system worked well initially but stopped improving, effectiveness declined, and they feel stuck. According to the lesson's framework, what is the core issue?",
      options: [
        "Not enough productivity",
        "Lack of continuous improvement - missing feedback loops, measurement, analysis, and iteration that enable systems to evolve and adapt",
        "Too much improvement",
        "Continuous improvement is unnecessary"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Continuous Improvement",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#continuous-improvement", "#advanced", "#critical-thinking", "#en", "#all-languages"]
    }
  ],
  // Hungarian (HU) - Professional translations
  HU: [
    {
      question: "A lecke szerint mi a folyamatos fejlesztés?",
      options: [
        "Egyszeri javítás",
        "Egy folyamatos folyamat, amely a visszajelzésekből tanul, iterál a rendszereken, és fejleszti a termelékenységi gyakorlatokat idővel",
        "Csak kezdőknek",
        "Nincs szükség struktúrára"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Folyamatos Fejlesztés",
      questionType: QuestionType.RECALL,
      hashtags: ["#continuous-improvement", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint mik a visszajelzési hurok lépései?",
      options: [
        "Csak dolgozz véletlenszerűen",
        "Cselekedj, mérj eredményeket, elemezd a visszajelzést, állítsd be a megközelítést, és iterálj",
        "Csak mérj",
        "Nincs szükség struktúrára"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Visszajelzés",
      questionType: QuestionType.RECALL,
      hashtags: ["#feedback", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint miért fontos az iteráció a termelékenységhez?",
      options: [
        "Nem fontos",
        "Lehetővé teszi, hogy a rendszerek fejlődjenek, alkalmazkodjanak a változó igényekhez, és idővel javítsák a hatékonyságot",
        "Csak bizonyos feladatokra vonatkozik",
        "Nem igényel erőfeszítést"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Iteráció",
      questionType: QuestionType.RECALL,
      hashtags: ["#iteration", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "Miért fontos a folyamatos fejlesztés a termelékenységhez a lecke szerint?",
      options: [
        "Kiküszöböli az összes munkát",
        "Biztosítja, hogy a termelékenységi rendszerek fejlődjenek, alkalmazkodjanak a változó igényekhez, idővel javítsák a hatékonyságot, és megelőzzék a stagnálást",
        "Csak bizonyos munkákra vonatkozik",
        "Nem igényel tervezést"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Folyamatos Fejlesztés",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#continuous-improvement", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Folyamatosan javítani szeretnéd a termelékenységi rendszeredet. A lecke szerint mit kellene létrehozni?",
      options: [
        "Csak dolgozz véletlenszerűen",
        "Rendszeres visszajelzési hurkok, eredmények mérése, elemzés arról, mi működik és mi nem, megközelítés beállítása, és iteratív javítások",
        "Csak mérj egyszer",
        "Csak elemezz"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Visszajelzés",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#feedback", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Észreveszed, hogy egy termelékenységi rendszer nem működik a várt módon. A lecke szerint mit kellene tenned?",
      options: [
        "Figyelmen kívül hagyd",
        "Elemezd, mi ment rosszul, gyűjts visszajelzést, állítsd be a megközelítést, és iterálj a javításhoz",
        "Csak elemezz",
        "Csak állíts be egyszer"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Iteráció",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#iteration", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy személy termelékenységi rendszere kezdetben jól működött, de nem fejlődött tovább, a hatékonyság csökkent, és úgy érzi, hogy elakadt. A lecke keretrendszere szerint mi a fő probléma?",
      options: [
        "Nincs elég termelékenység",
        "Hiányzik a folyamatos fejlesztés - hiányoznak a visszajelzési hurkok, mérés, elemzés, és iteráció, amelyek lehetővé teszik, hogy a rendszerek fejlődjenek és alkalmazkodjanak",
        "Túl sok fejlesztés",
        "A folyamatos fejlesztés felesleges"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Folyamatos Fejlesztés",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#continuous-improvement", "#advanced", "#critical-thinking", "#hu", "#all-languages"]
    }
  ],
  // Turkish (TR) - Professional translations
  TR: [
    {
      question: "Derse göre sürekli iyileştirme nedir?",
      options: [
        "Tek seferlik bir düzeltme",
        "Geri bildirimlerden öğrenme, sistemler üzerinde yineleme ve zamanla verimlilik uygulamalarını geliştirme süreci",
        "Sadece yeni başlayanlar için",
        "Yapıya gerek yok"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Sürekli İyileştirme",
      questionType: QuestionType.RECALL,
      hashtags: ["#continuous-improvement", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre geri bildirim döngüsünün adımları nelerdir?",
      options: [
        "Sadece rastgele çalış",
        "Harekete geç, sonuçları ölç, geri bildirimi analiz et, yaklaşımı ayarla ve yinele",
        "Sadece ölç",
        "Yapıya gerek yok"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Geri Bildirim",
      questionType: QuestionType.RECALL,
      hashtags: ["#feedback", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre yineleme neden verimlilik için önemlidir?",
      options: [
        "Önemli değil",
        "Sistemlerin gelişmesine, değişen ihtiyaçlara uyum sağlamasına ve zamanla etkinliği artırmasına olanak tanır",
        "Sadece belirli görevler için geçerli",
        "Çaba gerektirmez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Yineleme",
      questionType: QuestionType.RECALL,
      hashtags: ["#iteration", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre sürekli iyileştirme neden verimlilik için önemlidir?",
      options: [
        "Tüm işi ortadan kaldırır",
        "Verimlilik sistemlerinin gelişmesini, değişen ihtiyaçlara uyum sağlamasını, zamanla etkinliği artırmasını ve durgunluğu önlemesini sağlar",
        "Sadece belirli işler için geçerli",
        "Planlama gerektirmez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Sürekli İyileştirme",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#continuous-improvement", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Verimlilik sisteminizi sürekli iyileştirmek istiyorsunuz. Derse göre ne kurmalısınız?",
      options: [
        "Sadece rastgele çalış",
        "Düzenli geri bildirim döngüleri, sonuçların ölçülmesi, neyin işe yaradığının ve neyin yaramadığının analizi, yaklaşımın ayarlanması ve yinelemeli iyileştirmeler",
        "Sadece bir kez ölç",
        "Sadece analiz et"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Geri Bildirim",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#feedback", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir verimlilik sisteminin beklendiği gibi çalışmadığını fark ediyorsunuz. Derse göre ne yapmalısınız?",
      options: [
        "Görmezden gel",
        "Ne yanlış gittiğini analiz et, geri bildirim topla, yaklaşımı ayarla ve iyileştirmek için yinele",
        "Sadece analiz et",
        "Sadece bir kez ayarla"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Yineleme",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#iteration", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir kişinin verimlilik sistemi başlangıçta iyi çalıştı ancak gelişmeyi durdurdu, etkinlik azaldı ve kendini sıkışmış hissediyor. Dersin çerçevesine göre temel sorun nedir?",
      options: [
        "Yeterli verimlilik yok",
        "Sürekli iyileştirme eksikliği - sistemlerin gelişmesine ve uyum sağlamasına olanak tanıyan geri bildirim döngüleri, ölçüm, analiz ve yineleme eksik",
        "Çok fazla iyileştirme",
        "Sürekli iyileştirme gereksiz"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Sürekli İyileştirme",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#continuous-improvement", "#advanced", "#critical-thinking", "#tr", "#all-languages"]
    }
  ],
  // Bulgarian (BG) - Professional translations
  BG: [
    {
      question: "Според урока какво е непрекъснато подобрение?",
      options: [
        "Еднократна корекция",
        "Постоянен процес на учене от обратна връзка, итерация върху системи и развитие на практики за производителност с времето",
        "Само за начинаещи",
        "Няма нужда от структура"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Непрекъснато Подобрение",
      questionType: QuestionType.RECALL,
      hashtags: ["#continuous-improvement", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока какви са стъпките в цикъл на обратна връзка?",
      options: [
        "Просто работи на случаен принцип",
        "Действай, измервай резултати, анализирай обратната връзка, коригирай подхода и итерирай",
        "Само измервай",
        "Няма нужда от структура"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Обратна Връзка",
      questionType: QuestionType.RECALL,
      hashtags: ["#feedback", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока защо е важна итерацията за производителността?",
      options: [
        "Не е важна",
        "Позволява на системите да се развиват, да се адаптират към променящите се нужди и да подобряват ефективността с времето",
        "Прилага се само за определени задачи",
        "Не изисква усилие"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Итерация",
      questionType: QuestionType.RECALL,
      hashtags: ["#iteration", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Защо е важно непрекъснатото подобрение за производителността според урока?",
      options: [
        "Елиминира цялата работа",
        "Осигурява развитието на системите за производителност, адаптацията към променящите се нужди, подобряването на ефективността с времето и предотвратяването на застой",
        "Прилага се само за определени работи",
        "Не изисква планиране"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Непрекъснато Подобрение",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#continuous-improvement", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Искаш непрекъснато да подобряваш системата си за производителност. Според урока какво трябва да установиш?",
      options: [
        "Просто работи на случаен принцип",
        "Редовни цикли на обратна връзка, измерване на резултати, анализ на това какво работи и какво не, корекции на подхода и итеративни подобрения",
        "Измервай само веднъж",
        "Само анализирай"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Обратна Връзка",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#feedback", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Забелязваш, че системата за производителност не работи както се очаква. Според урока какво трябва да направиш?",
      options: [
        "Игнорирай я",
        "Анализирай какво се обърка, събери обратна връзка, коригирай подхода и итерирай за подобрение",
        "Само анализирай",
        "Коригирай само веднъж"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Итерация",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#iteration", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Системата за производителност на един човек първоначално работеше добре, но спря да се подобрява, ефективността намаля и той се чувства заседнал. Според рамката на урока какъв е основният проблем?",
      options: [
        "Няма достатъчна производителност",
        "Липса на непрекъснато подобрение - липсват цикли на обратна връзка, измерване, анализ и итерация, които позволяват на системите да се развиват и адаптират",
        "Твърде много подобрение",
        "Непрекъснатото подобрение е ненужно"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Непрекъснато Подобрение",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#continuous-improvement", "#advanced", "#critical-thinking", "#bg", "#all-languages"]
    }
  ],
  // Polish (PL) - Professional translations
  PL: [
    {
      question: "Według lekcji czym jest ciągłe doskonalenie?",
      options: [
        "Jednorazowa poprawka",
        "Ciągły proces uczenia się z informacji zwrotnej, iteracji systemów i rozwijania praktyk produktywności w czasie",
        "Tylko dla początkujących",
        "Nie potrzeba struktury"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Ciągłe Doskonalenie",
      questionType: QuestionType.RECALL,
      hashtags: ["#continuous-improvement", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji jakie są kroki w pętli informacji zwrotnej?",
      options: [
        "Po prostu pracuj losowo",
        "Działaj, mierz wyniki, analizuj informacje zwrotne, dostosuj podejście i iteruj",
        "Tylko mierz",
        "Nie potrzeba struktury"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Informacja Zwrotna",
      questionType: QuestionType.RECALL,
      hashtags: ["#feedback", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji dlaczego iteracja jest ważna dla produktywności?",
      options: [
        "Nie jest ważna",
        "Pozwala systemom ewoluować, dostosowywać się do zmieniających się potrzeb i poprawiać skuteczność w czasie",
        "Dotyczy tylko określonych zadań",
        "Nie wymaga wysiłku"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Iteracja",
      questionType: QuestionType.RECALL,
      hashtags: ["#iteration", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji dlaczego ciągłe doskonalenie jest ważne dla produktywności?",
      options: [
        "Eliminuje całą pracę",
        "Zapewnia ewolucję systemów produktywności, adaptację do zmieniających się potrzeb, poprawę skuteczności w czasie i zapobiega stagnacji",
        "Dotyczy tylko określonych prac",
        "Nie wymaga planowania"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Ciągłe Doskonalenie",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#continuous-improvement", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Chcesz ciągle doskonalić swój system produktywności. Według lekcji co powinieneś ustanowić?",
      options: [
        "Po prostu pracuj losowo",
        "Regularne pętle informacji zwrotnej, pomiar wyników, analiza tego co działa i co nie, dostosowania podejścia i iteracyjne ulepszenia",
        "Mierz tylko raz",
        "Tylko analizuj"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Informacja Zwrotna",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#feedback", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Zauważasz, że system produktywności nie działa zgodnie z oczekiwaniami. Według lekcji co powinieneś zrobić?",
      options: [
        "Zignoruj to",
        "Przeanalizuj co poszło nie tak, zbierz informacje zwrotne, dostosuj podejście i iteruj w celu poprawy",
        "Tylko analizuj",
        "Dostosuj tylko raz"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Iteracja",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#iteration", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "System produktywności danej osoby początkowo działał dobrze, ale przestał się poprawiać, skuteczność spadła i czuje się zablokowana. Według ram lekcji jaki jest główny problem?",
      options: [
        "Niewystarczająca produktywność",
        "Brak ciągłego doskonalenia - brakuje pętli informacji zwrotnej, pomiaru, analizy i iteracji, które umożliwiają systemom ewolucję i adaptację",
        "Zbyt dużo doskonalenia",
        "Ciągłe doskonalenie jest niepotrzebne"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Ciągłe Doskonalenie",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#continuous-improvement", "#advanced", "#critical-thinking", "#pl", "#all-languages"]
    }
  ],
  // Vietnamese (VI) - Professional translations
  VI: [
    {
      question: "Theo bài học, cải thiện liên tục là gì?",
      options: [
        "Một lần sửa chữa",
        "Một quá trình liên tục học hỏi từ phản hồi, lặp lại các hệ thống và phát triển các thực hành năng suất theo thời gian",
        "Chỉ dành cho người mới bắt đầu",
        "Không cần cấu trúc"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Cải Thiện Liên Tục",
      questionType: QuestionType.RECALL,
      hashtags: ["#continuous-improvement", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, các bước trong vòng lặp phản hồi là gì?",
      options: [
        "Chỉ làm việc ngẫu nhiên",
        "Hành động, đo lường kết quả, phân tích phản hồi, điều chỉnh cách tiếp cận và lặp lại",
        "Chỉ đo lường",
        "Không cần cấu trúc"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Phản Hồi",
      questionType: QuestionType.RECALL,
      hashtags: ["#feedback", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, tại sao lặp lại quan trọng đối với năng suất?",
      options: [
        "Không quan trọng",
        "Cho phép các hệ thống phát triển, thích ứng với nhu cầu thay đổi và cải thiện hiệu quả theo thời gian",
        "Chỉ áp dụng cho một số nhiệm vụ nhất định",
        "Không cần nỗ lực"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Lặp Lại",
      questionType: QuestionType.RECALL,
      hashtags: ["#iteration", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Tại sao cải thiện liên tục quan trọng đối với năng suất theo bài học?",
      options: [
        "Loại bỏ tất cả công việc",
        "Đảm bảo các hệ thống năng suất phát triển, thích ứng với nhu cầu thay đổi, cải thiện hiệu quả theo thời gian và ngăn chặn sự trì trệ",
        "Chỉ áp dụng cho một số công việc nhất định",
        "Không cần lập kế hoạch"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Cải Thiện Liên Tục",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#continuous-improvement", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Bạn muốn cải thiện liên tục hệ thống năng suất của mình. Theo bài học, bạn nên thiết lập gì?",
      options: [
        "Chỉ làm việc ngẫu nhiên",
        "Các vòng lặp phản hồi thường xuyên, đo lường kết quả, phân tích những gì hiệu quả và không hiệu quả, điều chỉnh cách tiếp cận và cải thiện lặp lại",
        "Chỉ đo lường một lần",
        "Chỉ phân tích"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Phản Hồi",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#feedback", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Bạn nhận thấy một hệ thống năng suất không hoạt động như mong đợi. Theo bài học, bạn nên làm gì?",
      options: [
        "Bỏ qua nó",
        "Phân tích những gì đã sai, thu thập phản hồi, điều chỉnh cách tiếp cận và lặp lại để cải thiện",
        "Chỉ phân tích",
        "Chỉ điều chỉnh một lần"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Lặp Lại",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#iteration", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Hệ thống năng suất của một người ban đầu hoạt động tốt nhưng ngừng cải thiện, hiệu quả giảm và họ cảm thấy bế tắc. Theo khung của bài học, vấn đề cốt lõi là gì?",
      options: [
        "Không đủ năng suất",
        "Thiếu cải thiện liên tục - thiếu các vòng lặp phản hồi, đo lường, phân tích và lặp lại cho phép các hệ thống phát triển và thích ứng",
        "Quá nhiều cải thiện",
        "Cải thiện liên tục là không cần thiết"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Cải Thiện Liên Tục",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#continuous-improvement", "#advanced", "#critical-thinking", "#vi", "#all-languages"]
    }
  ],
  // Indonesian (ID) - Professional translations
  ID: [
    {
      question: "Menurut pelajaran, apa itu perbaikan berkelanjutan?",
      options: [
        "Perbaikan satu kali",
        "Proses berkelanjutan belajar dari umpan balik, iterasi pada sistem, dan mengembangkan praktik produktivitas dari waktu ke waktu",
        "Hanya untuk pemula",
        "Tidak perlu struktur"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Perbaikan Berkelanjutan",
      questionType: QuestionType.RECALL,
      hashtags: ["#continuous-improvement", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, apa langkah-langkah dalam loop umpan balik?",
      options: [
        "Hanya bekerja secara acak",
        "Bertindak, mengukur hasil, menganalisis umpan balik, menyesuaikan pendekatan, dan mengulang",
        "Hanya mengukur",
        "Tidak perlu struktur"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Umpan Balik",
      questionType: QuestionType.RECALL,
      hashtags: ["#feedback", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, mengapa iterasi penting untuk produktivitas?",
      options: [
        "Tidak penting",
        "Memungkinkan sistem berkembang, beradaptasi dengan kebutuhan yang berubah, dan meningkatkan efektivitas dari waktu ke waktu",
        "Hanya berlaku untuk tugas tertentu",
        "Tidak memerlukan usaha"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Iterasi",
      questionType: QuestionType.RECALL,
      hashtags: ["#iteration", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Mengapa perbaikan berkelanjutan penting untuk produktivitas menurut pelajaran?",
      options: [
        "Menghilangkan semua pekerjaan",
        "Memastikan sistem produktivitas berkembang, beradaptasi dengan kebutuhan yang berubah, meningkatkan efektivitas dari waktu ke waktu, dan mencegah stagnasi",
        "Hanya berlaku untuk pekerjaan tertentu",
        "Tidak memerlukan perencanaan"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Perbaikan Berkelanjutan",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#continuous-improvement", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Anda ingin terus meningkatkan sistem produktivitas Anda. Menurut pelajaran, apa yang harus Anda dirikan?",
      options: [
        "Hanya bekerja secara acak",
        "Loop umpan balik reguler, pengukuran hasil, analisis apa yang bekerja dan tidak, penyesuaian pendekatan, dan perbaikan iteratif",
        "Hanya ukur sekali",
        "Hanya analisis"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Umpan Balik",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#feedback", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Anda memperhatikan sistem produktivitas tidak bekerja seperti yang diharapkan. Menurut pelajaran, apa yang harus Anda lakukan?",
      options: [
        "Abaikan",
        "Analisis apa yang salah, kumpulkan umpan balik, sesuaikan pendekatan, dan ulangi untuk meningkatkan",
        "Hanya analisis",
        "Hanya sesuaikan sekali"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Iterasi",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#iteration", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Sistem produktivitas seseorang awalnya bekerja dengan baik tetapi berhenti membaik, efektivitas menurun, dan mereka merasa terjebak. Menurut kerangka pelajaran, apa masalah intinya?",
      options: [
        "Tidak cukup produktivitas",
        "Kurangnya perbaikan berkelanjutan - kehilangan loop umpan balik, pengukuran, analisis, dan iterasi yang memungkinkan sistem berkembang dan beradaptasi",
        "Terlalu banyak perbaikan",
        "Perbaikan berkelanjutan tidak perlu"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Perbaikan Berkelanjutan",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#continuous-improvement", "#advanced", "#critical-thinking", "#id", "#all-languages"]
    }
  ],
  // Arabic (AR) - Professional translations
  AR: [
    {
      question: "وفقًا للدرس، ما هو التحسين المستمر؟",
      options: [
        "إصلاح لمرة واحدة",
        "عملية مستمرة للتعلم من التغذية الراجعة والتكرار على الأنظمة وتطوير ممارسات الإنتاجية بمرور الوقت",
        "للمبتدئين فقط",
        "لا حاجة للهيكل"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "التحسين المستمر",
      questionType: QuestionType.RECALL,
      hashtags: ["#continuous-improvement", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، ما هي خطوات حلقة التغذية الراجعة؟",
      options: [
        "فقط اعمل بشكل عشوائي",
        "تصرف، قس النتائج، حلل التغذية الراجعة، اضبط النهج وكرر",
        "فقط قس",
        "لا حاجة للهيكل"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "التغذية الراجعة",
      questionType: QuestionType.RECALL,
      hashtags: ["#feedback", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، لماذا التكرار مهم للإنتاجية؟",
      options: [
        "ليس مهمًا",
        "يسمح للأنظمة بالتطور والتكيف مع الاحتياجات المتغيرة وتحسين الفعالية بمرور الوقت",
        "ينطبق فقط على مهام معينة",
        "لا يتطلب جهدًا"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "التكرار",
      questionType: QuestionType.RECALL,
      hashtags: ["#iteration", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "لماذا التحسين المستمر مهم للإنتاجية وفقًا للدرس؟",
      options: [
        "يقضي على كل العمل",
        "يضمن تطور أنظمة الإنتاجية والتكيف مع الاحتياجات المتغيرة وتحسين الفعالية بمرور الوقت ومنع الركود",
        "ينطبق فقط على وظائف معينة",
        "لا يتطلب تخطيطًا"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "التحسين المستمر",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#continuous-improvement", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "تريد تحسين نظام إنتاجيتك باستمرار. وفقًا للدرس، ما الذي يجب أن تنشئه؟",
      options: [
        "فقط اعمل بشكل عشوائي",
        "حلقات تغذية راجعة منتظمة، قياس النتائج، تحليل ما يعمل وما لا يعمل، تعديل النهج وتحسينات متكررة",
        "فقط قس مرة واحدة",
        "فقط حلل"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "التغذية الراجعة",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#feedback", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "تلاحظ أن نظام إنتاجية لا يعمل كما هو متوقع. وفقًا للدرس، ماذا يجب أن تفعل؟",
      options: [
        "تجاهله",
        "حلل ما حدث خطأ، اجمع التغذية الراجعة، اضبط النهج وكرر للتحسين",
        "فقط حلل",
        "فقط اضبط مرة واحدة"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "التكرار",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#iteration", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "نظام إنتاجية شخص ما عمل بشكل جيد في البداية لكنه توقف عن التحسن، انخفضت الفعالية ويشعر بالحصار. وفقًا لإطار الدرس، ما هي المشكلة الأساسية؟",
      options: [
        "لا توجد إنتاجية كافية",
        "نقص التحسين المستمر - فقدان حلقات التغذية الراجعة والقياس والتحليل والتكرار التي تسمح للأنظمة بالتطور والتكيف",
        "الكثير من التحسين",
        "التحسين المستمر غير ضروري"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "التحسين المستمر",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#continuous-improvement", "#advanced", "#critical-thinking", "#ar", "#all-languages"]
    }
  ],
  // Portuguese (PT) - Professional translations
  PT: [
    {
      question: "De acordo com a lição, o que é melhoria contínua?",
      options: [
        "Uma correção única",
        "Um processo contínuo de aprendizado com feedback, iteração em sistemas e evolução das práticas de produtividade ao longo do tempo",
        "Apenas para iniciantes",
        "Não precisa de estrutura"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Melhoria Contínua",
      questionType: QuestionType.RECALL,
      hashtags: ["#continuous-improvement", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, quais são os passos em um ciclo de feedback?",
      options: [
        "Apenas trabalhe aleatoriamente",
        "Aja, meça resultados, analise feedback, ajuste a abordagem e itere",
        "Apenas meça",
        "Não precisa de estrutura"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Feedback",
      questionType: QuestionType.RECALL,
      hashtags: ["#feedback", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, por que a iteração é importante para produtividade?",
      options: [
        "Não é importante",
        "Permite que sistemas evoluam, se adaptem a necessidades em mudança e melhorem a eficácia ao longo do tempo",
        "Aplica-se apenas a tarefas específicas",
        "Não requer esforço"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Iteração",
      questionType: QuestionType.RECALL,
      hashtags: ["#iteration", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "Por que a melhoria contínua é importante para produtividade de acordo com a lição?",
      options: [
        "Elimina todo o trabalho",
        "Garante que sistemas de produtividade evoluam, se adaptem a necessidades em mudança, melhorem a eficácia ao longo do tempo e previnam estagnação",
        "Aplica-se apenas a trabalhos específicos",
        "Não requer planejamento"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Melhoria Contínua",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#continuous-improvement", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Você quer melhorar continuamente seu sistema de produtividade. De acordo com a lição, o que você deve estabelecer?",
      options: [
        "Apenas trabalhe aleatoriamente",
        "Ciclos de feedback regulares, medição de resultados, análise do que funciona e não funciona, ajustes na abordagem e melhorias iterativas",
        "Apenas meça uma vez",
        "Apenas analise"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Feedback",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#feedback", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Você percebe que um sistema de produtividade não está funcionando como esperado. De acordo com a lição, o que você deve fazer?",
      options: [
        "Ignore",
        "Analise o que deu errado, colete feedback, ajuste a abordagem e itere para melhorar",
        "Apenas analise",
        "Apenas ajuste uma vez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Iteração",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#iteration", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "O sistema de produtividade de uma pessoa funcionou bem inicialmente, mas parou de melhorar, a eficácia diminuiu e ela se sente presa. De acordo com a estrutura da lição, qual é o problema central?",
      options: [
        "Não há produtividade suficiente",
        "Falta de melhoria contínua - faltam ciclos de feedback, medição, análise e iteração que permitem que sistemas evoluam e se adaptem",
        "Muita melhoria",
        "Melhoria contínua é desnecessária"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Melhoria Contínua",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#continuous-improvement", "#advanced", "#critical-thinking", "#pt", "#all-languages"]
    }
  ],
  // Hindi (HI) - Professional translations
  HI: [
    {
      question: "पाठ के अनुसार, निरंतर सुधार क्या है?",
      options: [
        "एक बार की सुधार",
        "फीडबैक से सीखने, सिस्टम पर पुनरावृत्ति करने, और समय के साथ उत्पादकता प्रथाओं को विकसित करने की निरंतर प्रक्रिया",
        "केवल शुरुआती लोगों के लिए",
        "संरचना की आवश्यकता नहीं"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "निरंतर सुधार",
      questionType: QuestionType.RECALL,
      hashtags: ["#continuous-improvement", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, फीडबैक लूप में कदम क्या हैं?",
      options: [
        "बस यादृच्छिक रूप से काम करें",
        "कार्य करें, परिणाम मापें, फीडबैक का विश्लेषण करें, दृष्टिकोण समायोजित करें और पुनरावृत्ति करें",
        "केवल मापें",
        "संरचना की आवश्यकता नहीं"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "फीडबैक",
      questionType: QuestionType.RECALL,
      hashtags: ["#feedback", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, उत्पादकता के लिए पुनरावृत्ति क्यों महत्वपूर्ण है?",
      options: [
        "महत्वपूर्ण नहीं है",
        "यह सिस्टम को विकसित होने, बदलती जरूरतों के अनुकूल होने, और समय के साथ प्रभावशीलता में सुधार करने की अनुमति देता है",
        "केवल विशिष्ट कार्यों पर लागू होता है",
        "कोई प्रयास की आवश्यकता नहीं"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "पुनरावृत्ति",
      questionType: QuestionType.RECALL,
      hashtags: ["#iteration", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार उत्पादकता के लिए निरंतर सुधार क्यों महत्वपूर्ण है?",
      options: [
        "सभी काम को समाप्त करता है",
        "यह सुनिश्चित करता है कि उत्पादकता सिस्टम विकसित हों, बदलती जरूरतों के अनुकूल हों, समय के साथ प्रभावशीलता में सुधार करें, और ठहराव को रोकें",
        "केवल विशिष्ट नौकरियों पर लागू होता है",
        "योजना की आवश्यकता नहीं"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "निरंतर सुधार",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#continuous-improvement", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "आप अपने उत्पादकता सिस्टम को लगातार सुधारना चाहते हैं। पाठ के अनुसार, आपको क्या स्थापित करना चाहिए?",
      options: [
        "बस यादृच्छिक रूप से काम करें",
        "नियमित फीडबैक लूप, परिणामों का मापन, क्या काम करता है और क्या नहीं का विश्लेषण, दृष्टिकोण समायोजन, और पुनरावृत्ति सुधार",
        "केवल एक बार मापें",
        "केवल विश्लेषण करें"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "फीडबैक",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#feedback", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "आप देखते हैं कि एक उत्पादकता सिस्टम अपेक्षा के अनुसार काम नहीं कर रहा है। पाठ के अनुसार, आपको क्या करना चाहिए?",
      options: [
        "इसे अनदेखा करें",
        "विश्लेषण करें कि क्या गलत हुआ, फीडबैक एकत्र करें, दृष्टिकोण समायोजित करें और सुधार के लिए पुनरावृत्ति करें",
        "केवल विश्लेषण करें",
        "केवल एक बार समायोजित करें"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "पुनरावृत्ति",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#iteration", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "किसी व्यक्ति का उत्पादकता सिस्टम शुरू में अच्छी तरह से काम किया लेकिन सुधारना बंद कर दिया, प्रभावशीलता कम हो गई, और वे अटके हुए महसूस करते हैं। पाठ के ढांचे के अनुसार, मुख्य समस्या क्या है?",
      options: [
        "पर्याप्त उत्पादकता नहीं है",
        "निरंतर सुधार की कमी - फीडबैक लूप, मापन, विश्लेषण, और पुनरावृत्ति की कमी जो सिस्टम को विकसित और अनुकूल होने की अनुमति देती है",
        "बहुत अधिक सुधार",
        "निरंतर सुधार अनावश्यक है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "निरंतर सुधार",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#continuous-improvement", "#advanced", "#critical-thinking", "#hi", "#all-languages"]
    }
  ]
};

async function seedDay29Enhanced() {
  try {
    await connectDB();
    console.log('🌱 SEEDING DAY 29 ENHANCED QUIZ QUESTIONS\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    let totalQuestions = 0;
    let totalUpdated = 0;
    let totalCreated = 0;

    for (const lang of LANGUAGES) {
      const courseId = `${COURSE_ID_BASE}_${lang}`;
      const lessonId = `${COURSE_ID_BASE}_${lang}_DAY_29`;

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
      const questions = DAY29_QUESTIONS[lang];
      
      if (!questions || questions.length === 0) {
        console.error(`   ❌ ERROR: No questions defined for ${lang}! Questions MUST be in course language.`);
        throw new Error(`Missing translations for ${lang} - Day 29 questions must be in course language, not English fallback`);
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
    console.log(`\n✅ DAY 29 ENHANCEMENT COMPLETE!\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedDay29Enhanced();
