/**
 * Seed Day 28 Enhanced Quiz Questions
 * 
 * Purpose: Enhance Day 28 quizzes from 5 to 7 questions across all 10 languages
 * Why: Part of Quiz Quality Enhancement - Phase 1, Day 28
 * 
 * Lesson Topic: Values and Goals (life purpose, long-term vision)
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
const DAY_NUMBER = 28;
const LANGUAGES = ['HU', 'EN', 'TR', 'BG', 'PL', 'VI', 'ID', 'AR', 'PT', 'HI'];

/**
 * Day 28 Enhanced Questions - All Languages
 * Topic: Values and Goals
 * Structure: 7 questions per language
 * Q1-Q3: Recall (foundational concepts)
 * Q4: Application (why values matter)
 * Q5: Application (scenario-based)
 * Q6: Application (practical implementation)
 * Q7: Critical Thinking (systems integration)
 */
const DAY28_QUESTIONS: Record<string, Array<{
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: QuestionDifficulty;
  category: string;
  questionType: QuestionType;
  hashtags: string[];
}>> = {
  EN: [
    // Q1: Values definition (RECALL)
    {
      question: "According to the lesson, what are personal values?",
      options: [
        "Only financial goals",
        "Core principles and beliefs that guide decisions and define what matters most in life",
        "Only career goals",
        "No structure needed"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Personal Development",
      questionType: QuestionType.RECALL,
      hashtags: ["#values", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q2: Long-term vision (RECALL)
    {
      question: "According to the lesson, what is a long-term vision?",
      options: [
        "Only yearly goals",
        "A clear picture of desired future outcomes that guides decisions and provides direction over years",
        "Only monthly plans",
        "It's not relevant"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Goal Hierarchy",
      questionType: QuestionType.RECALL,
      hashtags: ["#goals", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q3: Alignment importance (RECALL)
    {
      question: "According to the lesson, why is aligning productivity with values important?",
      options: [
        "It's not important",
        "It ensures work serves meaningful purpose, creates sustainable motivation, and leads to fulfillment",
        "It only applies to certain people",
        "It requires no effort"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Personal Development",
      questionType: QuestionType.RECALL,
      hashtags: ["#values", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q4: Why values matter (APPLICATION)
    {
      question: "Why are values and goals important for productivity according to the lesson?",
      options: [
        "They eliminate all work",
        "They provide direction, create sustainable motivation, ensure work serves meaningful purpose, and enable long-term fulfillment",
        "They only apply to certain jobs",
        "They require no planning"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Personal Development",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#values", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q5: Goal setting scenario (APPLICATION)
    {
      question: "You want to set meaningful long-term goals. According to the lesson, what should you do?",
      options: [
        "Only set financial targets",
        "Clarify your values, create a vision aligned with those values, set goals that serve that vision, and ensure daily actions support long-term purpose",
        "Only set short-term goals",
        "Only set career goals"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Goal Hierarchy",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goals", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q6: Building value system (APPLICATION)
    {
      question: "You want to align productivity with your life values. According to the lesson, what should you establish?",
      options: [
        "Just work randomly",
        "Clear personal values, a long-term vision aligned with those values, goals that serve the vision, and daily actions that support meaningful purpose",
        "Only values",
        "Only goals"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Personal Development",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#values", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q7: Misalignment analysis (CRITICAL THINKING)
    {
      question: "A person is productive but feels unfulfilled, work lacks meaning, and motivation declines over time. According to the lesson's framework, what is the core issue?",
      options: [
        "Not enough productivity",
        "Lack of values alignment - missing connection between work and personal values, long-term vision, and meaningful purpose that creates sustainable motivation",
        "Too much purpose",
        "Values alignment is unnecessary"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Personal Development",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#values", "#advanced", "#critical-thinking", "#en", "#all-languages"]
    }
  ],
  // Hungarian (HU) - Professional translations
  HU: [
    {
      question: "A lecke szerint mik a személyes értékek?",
      options: [
        "Csak pénzügyi célok",
        "Alapvető elvek és hiedelmek, amelyek irányítják a döntéseket és meghatározzák, mi számít a legfontosabb az életben",
        "Csak karriercélok",
        "Nincs szükség struktúrára"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Personal Development",
      questionType: QuestionType.RECALL,
      hashtags: ["#values", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint mi a hosszú távú jövőkép?",
      options: [
        "Csak éves célok",
        "Egy világos kép a kívánt jövőbeli eredményekről, amely irányítja a döntéseket és irányt ad évekig",
        "Csak havi tervek",
        "Nem releváns"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Goal Hierarchy",
      questionType: QuestionType.RECALL,
      hashtags: ["#goals", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint miért fontos a termelékenység értékekhez való igazítása?",
      options: [
        "Nem fontos",
        "Biztosítja, hogy a munka értelmes célt szolgáljon, fenntartható motivációt hozzon létre, és elégedettséghez vezessen",
        "Csak bizonyos emberekre vonatkozik",
        "Nem igényel erőfeszítést"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Personal Development",
      questionType: QuestionType.RECALL,
      hashtags: ["#values", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "Miért fontosak az értékek és a célok a termelékenységhez a lecke szerint?",
      options: [
        "Kiküszöbölik az összes munkát",
        "Irányt adnak, fenntartható motivációt hoznak létre, biztosítják, hogy a munka értelmes célt szolgáljon, és lehetővé teszik a hosszú távú elégedettséget",
        "Csak bizonyos munkákra vonatkoznak",
        "Nem igényelnek tervezést"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Personal Development",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#values", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Létre szeretnél hozni értelmes hosszú távú célokat. A lecke szerint mit kellene tenned?",
      options: [
        "Csak állíts be pénzügyi célokat",
        "Tisztázd az értékeidet, hozz létre egy jövőképet, amely ezekhez az értékekhez igazodik, állíts be célokat, amelyek ezt a jövőképet szolgálják, és biztosítsd, hogy a napi cselekedetek támogassák a hosszú távú célt",
        "Csak állíts be rövid távú célokat",
        "Csak állíts be karriercélokat"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Goal Hierarchy",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goals", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Igazítani szeretnéd a termelékenységet az élet értékeidhez. A lecke szerint mit kellene létrehozni?",
      options: [
        "Csak dolgozz véletlenszerűen",
        "Tiszta személyes értékek, egy hosszú távú jövőkép, amely ezekhez az értékekhez igazodik, célok, amelyek a jövőképet szolgálják, és napi cselekedetek, amelyek támogatják az értelmes célt",
        "Csak értékek",
        "Csak célok"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Personal Development",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#values", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy személy termelékeny, de nem érzi magát elégedettnek, a munkának hiányzik az értelme, és a motiváció idővel csökken. A lecke keretrendszere szerint mi a fő probléma?",
      options: [
        "Nincs elég termelékenység",
        "Hiányzik az értékek igazodása - hiányzik a kapcsolat a munka és a személyes értékek, hosszú távú jövőkép, és értelmes cél között, amely fenntartható motivációt hoz létre",
        "Túl sok cél",
        "Az értékek igazodása felesleges"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Personal Development",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#values", "#advanced", "#critical-thinking", "#hu", "#all-languages"]
    }
  ],
  // Turkish (TR) - Professional translations
  TR: [
    {
      question: "Derse göre kişisel değerler nelerdir?",
      options: [
        "Sadece finansal hedefler",
        "Kararları yönlendiren ve hayatta en önemli olanı tanımlayan temel ilkeler ve inançlar",
        "Sadece kariyer hedefleri",
        "Yapı gerekmez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Değerler",
      questionType: QuestionType.RECALL,
      hashtags: ["#values", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre uzun vadeli vizyon nedir?",
      options: [
        "Sadece yıllık hedefler",
        "Yıllar boyunca kararları yönlendiren ve yön sağlayan istenen gelecek sonuçlarının net bir resmi",
        "Sadece aylık planlar",
        "İlgili değil"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Hedefler",
      questionType: QuestionType.RECALL,
      hashtags: ["#goals", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre verimliliği değerlerle uyumlu hale getirmek neden önemlidir?",
      options: [
        "Önemli değil",
        "İşin anlamlı bir amaç hizmet etmesini sağlar, sürdürülebilir motivasyon yaratır ve memnuniyete yol açar",
        "Sadece belirli insanlara uygulanır",
        "Çaba gerektirmez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Değerler",
      questionType: QuestionType.RECALL,
      hashtags: ["#values", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre değerler ve hedefler verimlilik için neden önemlidir?",
      options: [
        "Tüm işi ortadan kaldırırlar",
        "Yön sağlarlar, sürdürülebilir motivasyon yaratırlar, işin anlamlı bir amaç hizmet etmesini sağlarlar ve uzun vadeli memnuniyeti mümkün kılarlar",
        "Sadece belirli işlere uygulanırlar",
        "Planlama gerektirmezler"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Değerler",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#values", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Anlamlı uzun vadeli hedefler belirlemek istiyorsun. Derse göre ne yapmalısın?",
      options: [
        "Sadece finansal hedefler belirle",
        "Değerlerini netleştir, bu değerlerle uyumlu bir vizyon oluştur, o vizyona hizmet eden hedefler belirle ve günlük eylemlerin uzun vadeli amacı desteklemesini sağla",
        "Sadece kısa vadeli hedefler belirle",
        "Sadece kariyer hedefleri belirle"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Hedefler",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goals", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Verimliliği hayat değerlerinle uyumlu hale getirmek istiyorsun. Derse göre ne kurmalısın?",
      options: [
        "Sadece rastgele çalış",
        "Net kişisel değerler, bu değerlerle uyumlu uzun vadeli vizyon, vizyona hizmet eden hedefler ve anlamlı amacı destekleyen günlük eylemler",
        "Sadece değerler",
        "Sadece hedefler"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Değerler",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#values", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir kişi üretken ama memnun hissetmiyor, iş anlamdan yoksun ve motivasyon zamanla azalıyor. Derse göre temel sorun nedir?",
      options: [
        "Yeterli verimlilik yok",
        "Değer uyumu eksikliği - iş ve kişisel değerler, uzun vadeli vizyon ve sürdürülebilir motivasyon yaratan anlamlı amaç arasındaki bağlantı eksik",
        "Çok fazla amaç",
        "Değer uyumu gereksiz"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Değerler",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#values", "#advanced", "#critical-thinking", "#tr", "#all-languages"]
    }
  ],
  // Bulgarian (BG) - Professional translations
  BG: [
    {
      question: "Според урока, какво са личните ценности?",
      options: [
        "Само финансови цели",
        "Основни принципи и убеждения, които ръководят решенията и определят какво е най-важното в живота",
        "Само кариерни цели",
        "Няма нужда от структура"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Ценности",
      questionType: QuestionType.RECALL,
      hashtags: ["#values", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, какво е дългосрочна визия?",
      options: [
        "Само годишни цели",
        "Ясна картина на желаните бъдещи резултати, която ръководи решенията и осигурява посока в продължение на години",
        "Само месечни планове",
        "Не е релевантна"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Цели",
      questionType: QuestionType.RECALL,
      hashtags: ["#goals", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, защо е важно да се подравни производителността със ценностите?",
      options: [
        "Не е важно",
        "Осигурява, че работата служи на смислена цел, създава устойчива мотивация и води до удовлетворение",
        "Прилага се само за определени хора",
        "Не изисква усилие"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Ценности",
      questionType: QuestionType.RECALL,
      hashtags: ["#values", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Защо ценностите и целите са важни за производителността според урока?",
      options: [
        "Премахват цялата работа",
        "Осигуряват посока, създават устойчива мотивация, гарантират, че работата служи на смислена цел, и позволяват дългосрочно удовлетворение",
        "Прилагат се само за определени работи",
        "Не изискват планиране"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Ценности",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#values", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Искаш да определиш смислени дългосрочни цели. Според урока, какво трябва да направиш?",
      options: [
        "Само определи финансови цели",
        "Изясни ценностите си, създай визия, съответстваща на тези ценности, определи цели, които служат на тази визия, и осигури, че дневните действия подкрепят дългосрочната цел",
        "Само определи краткосрочни цели",
        "Само определи кариерни цели"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Цели",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goals", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Искаш да подравниш производителността с ценностите на живота си. Според урока, какво трябва да установиш?",
      options: [
        "Просто работи на случаен принцип",
        "Ясни лични ценности, дългосрочна визия, съответстваща на тези ценности, цели, които служат на визията, и дневни действия, които подкрепят смислена цел",
        "Само ценности",
        "Само цели"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Ценности",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#values", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Човек е производителен, но се чувства неудовлетворен, работата липсва на смисъл, и мотивацията намалява с времето. Според рамката на урока, какъв е основният проблем?",
      options: [
        "Няма достатъчна производителност",
        "Липса на съответствие на ценностите - липсва връзката между работата и личните ценности, дългосрочната визия и смислената цел, която създава устойчива мотивация",
        "Твърде много цел",
        "Съответствието на ценностите е ненужно"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Ценности",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#values", "#advanced", "#critical-thinking", "#bg", "#all-languages"]
    }
  ],
  // Polish (PL) - Professional translations
  PL: [
    {
      question: "Według lekcji, czym są wartości osobiste?",
      options: [
        "Tylko cele finansowe",
        "Podstawowe zasady i przekonania, które kierują decyzjami i definiują to, co najważniejsze w życiu",
        "Tylko cele kariery",
        "Struktura nie jest potrzebna"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Wartości",
      questionType: QuestionType.RECALL,
      hashtags: ["#values", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, czym jest wizja długoterminowa?",
      options: [
        "Tylko cele roczne",
        "Jasny obraz pożądanych przyszłych wyników, który kieruje decyzjami i zapewnia kierunek przez lata",
        "Tylko plany miesięczne",
        "Nie jest istotna"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Cele",
      questionType: QuestionType.RECALL,
      hashtags: ["#goals", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, dlaczego wyrównanie produktywności z wartościami jest ważne?",
      options: [
        "Nie jest ważne",
        "Zapewnia, że praca służy znaczącemu celowi, tworzy zrównoważoną motywację i prowadzi do spełnienia",
        "Stosuje się tylko do określonych ludzi",
        "Nie wymaga wysiłku"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Wartości",
      questionType: QuestionType.RECALL,
      hashtags: ["#values", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Dlaczego wartości i cele są ważne dla produktywności według lekcji?",
      options: [
        "Eliminują całą pracę",
        "Zapewniają kierunek, tworzą zrównoważoną motywację, zapewniają, że praca służy znaczącemu celowi i umożliwiają długoterminowe spełnienie",
        "Stosują się tylko do określonych prac",
        "Nie wymagają planowania"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Wartości",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#values", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Chcesz wyznaczyć znaczące długoterminowe cele. Według lekcji, co powinieneś zrobić?",
      options: [
        "Tylko wyznacz cele finansowe",
        "Wyjaśnij swoje wartości, stwórz wizję zgodną z tymi wartościami, wyznacz cele służące tej wizji i zapewnij, że codzienne działania wspierają długoterminowy cel",
        "Tylko wyznacz krótkoterminowe cele",
        "Tylko wyznacz cele kariery"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Cele",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goals", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Chcesz wyrównać produktywność z wartościami swojego życia. Według lekcji, co powinieneś ustanowić?",
      options: [
        "Po prostu pracuj losowo",
        "Jasne wartości osobiste, długoterminowa wizja zgodna z tymi wartościami, cele służące wizji i codzienne działania wspierające znaczący cel",
        "Tylko wartości",
        "Tylko cele"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Wartości",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#values", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Osoba jest produktywna, ale czuje się niespełniona, pracy brakuje znaczenia, a motywacja z czasem spada. Według ram lekcji, jaki jest główny problem?",
      options: [
        "Nie ma wystarczającej produktywności",
        "Brak wyrównania wartości - brakuje połączenia między pracą a wartościami osobistymi, wizją długoterminową i znaczącym celem, który tworzy zrównoważoną motywację",
        "Zbyt dużo celu",
        "Wyrównanie wartości jest niepotrzebne"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Wartości",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#values", "#advanced", "#critical-thinking", "#pl", "#all-languages"]
    }
  ],
  // Vietnamese (VI) - Professional translations
  VI: [
    {
      question: "Theo bài học, giá trị cá nhân là gì?",
      options: [
        "Chỉ mục tiêu tài chính",
        "Nguyên tắc và niềm tin cốt lõi hướng dẫn quyết định và xác định điều quan trọng nhất trong cuộc sống",
        "Chỉ mục tiêu sự nghiệp",
        "Không cần cấu trúc"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Giá Trị",
      questionType: QuestionType.RECALL,
      hashtags: ["#values", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, tầm nhìn dài hạn là gì?",
      options: [
        "Chỉ mục tiêu hàng năm",
        "Một bức tranh rõ ràng về kết quả tương lai mong muốn hướng dẫn quyết định và cung cấp hướng đi trong nhiều năm",
        "Chỉ kế hoạch hàng tháng",
        "Nó không liên quan"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Mục Tiêu",
      questionType: QuestionType.RECALL,
      hashtags: ["#goals", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, tại sao phối hợp năng suất với giá trị quan trọng?",
      options: [
        "Nó không quan trọng",
        "Nó đảm bảo công việc phục vụ mục đích có ý nghĩa, tạo động lực bền vững, và dẫn đến sự thỏa mãn",
        "Nó chỉ áp dụng cho một số người",
        "Nó không yêu cầu nỗ lực"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Giá Trị",
      questionType: QuestionType.RECALL,
      hashtags: ["#values", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Tại sao giá trị và mục tiêu quan trọng cho năng suất theo bài học?",
      options: [
        "Chúng loại bỏ tất cả công việc",
        "Chúng cung cấp hướng đi, tạo động lực bền vững, đảm bảo công việc phục vụ mục đích có ý nghĩa, và cho phép sự thỏa mãn dài hạn",
        "Chúng chỉ áp dụng cho một số công việc",
        "Chúng không yêu cầu lập kế hoạch"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Giá Trị",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#values", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Bạn muốn đặt mục tiêu dài hạn có ý nghĩa. Theo bài học, bạn nên làm gì?",
      options: [
        "Chỉ đặt mục tiêu tài chính",
        "Làm rõ giá trị của bạn, tạo tầm nhìn phù hợp với những giá trị đó, đặt mục tiêu phục vụ tầm nhìn đó, và đảm bảo hành động hàng ngày hỗ trợ mục đích dài hạn",
        "Chỉ đặt mục tiêu ngắn hạn",
        "Chỉ đặt mục tiêu sự nghiệp"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Mục Tiêu",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goals", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Bạn muốn phối hợp năng suất với giá trị cuộc sống của mình. Theo bài học, bạn nên thiết lập gì?",
      options: [
        "Chỉ làm việc ngẫu nhiên",
        "Giá trị cá nhân rõ ràng, tầm nhìn dài hạn phù hợp với những giá trị đó, mục tiêu phục vụ tầm nhìn, và hành động hàng ngày hỗ trợ mục đích có ý nghĩa",
        "Chỉ giá trị",
        "Chỉ mục tiêu"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Giá Trị",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#values", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Một người năng suất nhưng cảm thấy không thỏa mãn, công việc thiếu ý nghĩa, và động lực giảm theo thời gian. Theo khung của bài học, vấn đề cốt lõi là gì?",
      options: [
        "Không đủ năng suất",
        "Thiếu phối hợp giá trị - thiếu kết nối giữa công việc và giá trị cá nhân, tầm nhìn dài hạn, và mục đích có ý nghĩa tạo động lực bền vững",
        "Quá nhiều mục đích",
        "Phối hợp giá trị là không cần thiết"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Giá Trị",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#values", "#advanced", "#critical-thinking", "#vi", "#all-languages"]
    }
  ],
  // Indonesian (ID) - Professional translations
  ID: [
    {
      question: "Menurut pelajaran, apa itu nilai pribadi?",
      options: [
        "Hanya tujuan keuangan",
        "Prinsip dan keyakinan inti yang memandu keputusan dan mendefinisikan apa yang paling penting dalam hidup",
        "Hanya tujuan karier",
        "Tidak perlu struktur"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Nilai",
      questionType: QuestionType.RECALL,
      hashtags: ["#values", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, apa itu visi jangka panjang?",
      options: [
        "Hanya tujuan tahunan",
        "Gambaran jelas tentang hasil masa depan yang diinginkan yang memandu keputusan dan memberikan arah selama bertahun-tahun",
        "Hanya rencana bulanan",
        "Tidak relevan"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Tujuan",
      questionType: QuestionType.RECALL,
      hashtags: ["#goals", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, mengapa menyelaraskan produktivitas dengan nilai penting?",
      options: [
        "Tidak penting",
        "Memastikan pekerjaan melayani tujuan yang bermakna, menciptakan motivasi berkelanjutan, dan mengarah pada pemenuhan",
        "Hanya berlaku untuk orang tertentu",
        "Tidak memerlukan upaya"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Nilai",
      questionType: QuestionType.RECALL,
      hashtags: ["#values", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Mengapa nilai dan tujuan penting untuk produktivitas menurut pelajaran?",
      options: [
        "Mereka menghilangkan semua pekerjaan",
        "Mereka memberikan arah, menciptakan motivasi berkelanjutan, memastikan pekerjaan melayani tujuan yang bermakna, dan memungkinkan pemenuhan jangka panjang",
        "Mereka hanya berlaku untuk pekerjaan tertentu",
        "Mereka tidak memerlukan perencanaan"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Nilai",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#values", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Anda ingin menetapkan tujuan jangka panjang yang bermakna. Menurut pelajaran, apa yang harus Anda lakukan?",
      options: [
        "Hanya tetapkan tujuan keuangan",
        "Perjelas nilai Anda, buat visi selaras dengan nilai-nilai tersebut, tetapkan tujuan yang melayani visi tersebut, dan pastikan tindakan harian mendukung tujuan jangka panjang",
        "Hanya tetapkan tujuan jangka pendek",
        "Hanya tetapkan tujuan karier"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Tujuan",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goals", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Anda ingin menyelaraskan produktivitas dengan nilai hidup Anda. Menurut pelajaran, apa yang harus Anda tetapkan?",
      options: [
        "Hanya bekerja secara acak",
        "Nilai pribadi yang jelas, visi jangka panjang selaras dengan nilai-nilai tersebut, tujuan yang melayani visi, dan tindakan harian yang mendukung tujuan bermakna",
        "Hanya nilai",
        "Hanya tujuan"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Nilai",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#values", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Seseorang produktif tetapi merasa tidak terpenuhi, pekerjaan kurang bermakna, dan motivasi menurun seiring waktu. Menurut kerangka pelajaran, apa masalah intinya?",
      options: [
        "Tidak ada produktivitas yang cukup",
        "Kurangnya penyelarasan nilai - kurang koneksi antara pekerjaan dan nilai pribadi, visi jangka panjang, dan tujuan bermakna yang menciptakan motivasi berkelanjutan",
        "Terlalu banyak tujuan",
        "Penyelarasan nilai tidak perlu"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Nilai",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#values", "#advanced", "#critical-thinking", "#id", "#all-languages"]
    }
  ],
  // Arabic (AR) - Professional translations (RTL)
  AR: [
    {
      question: "وفقًا للدرس، ما هي القيم الشخصية?",
      options: [
        "فقط الأهداف المالية",
        "المبادئ والمعتقدات الأساسية التي توجه القرارات وتحدد ما يهم أكثر في الحياة",
        "فقط أهداف المهنة",
        "لا حاجة للهيكل"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "القيم",
      questionType: QuestionType.RECALL,
      hashtags: ["#values", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، ما هي الرؤية طويلة الأجل?",
      options: [
        "فقط الأهداف السنوية",
        "صورة واضحة للنتائج المستقبلية المرغوبة التي توجه القرارات وتوفر الاتجاه على مدى سنوات",
        "فقط الخطط الشهرية",
        "ليست ذات صلة"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "الأهداف",
      questionType: QuestionType.RECALL,
      hashtags: ["#goals", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، لماذا محاذاة الإنتاجية مع القيم مهمة?",
      options: [
        "ليست مهمة",
        "تضمن أن العمل يخدم غرضًا ذا معنى، وتخلق دافعًا مستدامًا، وتؤدي إلى الإنجاز",
        "تنطبق فقط على أشخاص معينين",
        "لا تتطلب جهدًا"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "القيم",
      questionType: QuestionType.RECALL,
      hashtags: ["#values", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "لماذا القيم والأهداف مهمة للإنتاجية وفقًا للدرس?",
      options: [
        "إنها تلغي كل العمل",
        "إنها توفر الاتجاه، وتخلق دافعًا مستدامًا، وتضمن أن العمل يخدم غرضًا ذا معنى، وتمكن من الإنجاز طويل الأجل",
        "تنطبق فقط على وظائف معينة",
        "لا تتطلب تخطيطًا"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "القيم",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#values", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "تريد تحديد أهداف طويلة الأجل ذات معنى. وفقًا للدرس، ماذا يجب أن تفعل?",
      options: [
        "فقط حدد الأهداف المالية",
        "وضح قيمك، وخلق رؤية تتماشى مع تلك القيم، وحدد أهدافًا تخدم تلك الرؤية، وتأكد من أن الإجراءات اليومية تدعم الغرض طويل الأجل",
        "فقط حدد الأهداف قصيرة الأجل",
        "فقط حدد أهداف المهنة"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "الأهداف",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goals", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "تريد محاذاة الإنتاجية مع قيم حياتك. وفقًا للدرس، ماذا يجب أن تنشئ?",
      options: [
        "فقط اعمل عشوائيًا",
        "قيم شخصية واضحة، رؤية طويلة الأجل تتماشى مع تلك القيم، أهداف تخدم الرؤية، وإجراءات يومية تدعم الغرض ذا المعنى",
        "فقط القيم",
        "فقط الأهداف"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "القيم",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#values", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "شخص منتج لكنه يشعر بعدم الإنجاز، والعمل يفتقر إلى المعنى، والدافع يتناقص بمرور الوقت. وفقًا لإطار الدرس، ما هي المشكلة الأساسية?",
      options: [
        "لا يوجد إنتاجية كافية",
        "نقص محاذاة القيم - نقص الاتصال بين العمل والقيم الشخصية، والرؤية طويلة الأجل، والغرض ذا المعنى الذي يخلق دافعًا مستدامًا",
        "الكثير من الغرض",
        "محاذاة القيم غير ضرورية"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "القيم",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#values", "#advanced", "#critical-thinking", "#ar", "#all-languages"]
    }
  ],
  // Portuguese (PT) - Professional translations (Brazilian)
  PT: [
    {
      question: "De acordo com a lição, o que são valores pessoais?",
      options: [
        "Apenas objetivos financeiros",
        "Princípios e crenças fundamentais que orientam decisões e definem o que mais importa na vida",
        "Apenas objetivos de carreira",
        "Estrutura não é necessária"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Valores",
      questionType: QuestionType.RECALL,
      hashtags: ["#values", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, o que é uma visão de longo prazo?",
      options: [
        "Apenas objetivos anuais",
        "Uma imagem clara dos resultados futuros desejados que orienta decisões e fornece direção ao longo dos anos",
        "Apenas planos mensais",
        "Não é relevante"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Objetivos",
      questionType: QuestionType.RECALL,
      hashtags: ["#goals", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, por que alinhar produtividade com valores é importante?",
      options: [
        "Não é importante",
        "Garante que o trabalho sirva a um propósito significativo, cria motivação sustentável e leva à realização",
        "Aplica-se apenas a certas pessoas",
        "Não requer esforço"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Valores",
      questionType: QuestionType.RECALL,
      hashtags: ["#values", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "Por que valores e objetivos são importantes para produtividade de acordo com a lição?",
      options: [
        "Eliminam todo o trabalho",
        "Fornecem direção, criam motivação sustentável, garantem que o trabalho sirva a um propósito significativo e permitem realização de longo prazo",
        "Aplicam-se apenas a certos trabalhos",
        "Não requerem planejamento"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Valores",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#values", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Você quer definir objetivos de longo prazo significativos. De acordo com a lição, o que você deve fazer?",
      options: [
        "Apenas defina objetivos financeiros",
        "Clarifique seus valores, crie uma visão alinhada com esses valores, defina objetivos que sirvam a essa visão e garanta que ações diárias apoiem o propósito de longo prazo",
        "Apenas defina objetivos de curto prazo",
        "Apenas defina objetivos de carreira"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Objetivos",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goals", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Você quer alinhar produtividade com os valores da sua vida. De acordo com a lição, o que você deve estabelecer?",
      options: [
        "Apenas trabalhe aleatoriamente",
        "Valores pessoais claros, uma visão de longo prazo alinhada com esses valores, objetivos que sirvam à visão e ações diárias que apoiem propósito significativo",
        "Apenas valores",
        "Apenas objetivos"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Valores",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#values", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Uma pessoa é produtiva mas se sente não realizada, o trabalho carece de significado e a motivação declina ao longo do tempo. De acordo com a estrutura da lição, qual é o problema central?",
      options: [
        "Não há produtividade suficiente",
        "Falta de alinhamento de valores - falta conexão entre trabalho e valores pessoais, visão de longo prazo e propósito significativo que cria motivação sustentável",
        "Muito propósito",
        "Alinhamento de valores é desnecessário"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Valores",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#values", "#advanced", "#critical-thinking", "#pt", "#all-languages"]
    }
  ],
  // Hindi (HI) - Professional translations
  HI: [
    {
      question: "पाठ के अनुसार, व्यक्तिगत मूल्य क्या हैं?",
      options: [
        "केवल वित्तीय लक्ष्य",
        "मूल सिद्धांत और विश्वास जो निर्णयों का मार्गदर्शन करते हैं और जीवन में सबसे महत्वपूर्ण चीज को परिभाषित करते हैं",
        "केवल करियर लक्ष्य",
        "संरचना की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "मूल्य",
      questionType: QuestionType.RECALL,
      hashtags: ["#values", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, दीर्घकालीन दृष्टि क्या है?",
      options: [
        "केवल वार्षिक लक्ष्य",
        "वांछित भविष्य के परिणामों की एक स्पष्ट तस्वीर जो निर्णयों का मार्गदर्शन करती है और वर्षों तक दिशा प्रदान करती है",
        "केवल मासिक योजनाएं",
        "यह प्रासंगिक नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "लक्ष्य",
      questionType: QuestionType.RECALL,
      hashtags: ["#goals", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, उत्पादकता को मूल्यों के साथ संरेखित करना क्यों महत्वपूर्ण है?",
      options: [
        "यह महत्वपूर्ण नहीं है",
        "यह सुनिश्चित करता है कि काम सार्थक उद्देश्य की सेवा करता है, स्थायी प्रेरणा बनाता है, और पूर्ति की ओर ले जाता है",
        "यह केवल कुछ लोगों पर लागू होता है",
        "इसके लिए प्रयास की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "मूल्य",
      questionType: QuestionType.RECALL,
      hashtags: ["#values", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार उत्पादकता के लिए मूल्य और लक्ष्य क्यों महत्वपूर्ण हैं?",
      options: [
        "वे सभी काम को समाप्त करते हैं",
        "वे दिशा प्रदान करते हैं, स्थायी प्रेरणा बनाते हैं, सुनिश्चित करते हैं कि काम सार्थक उद्देश्य की सेवा करता है, और दीर्घकालिक पूर्ति सक्षम करते हैं",
        "वे केवल कुछ नौकरियों पर लागू होते हैं",
        "उन्हें योजना की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "मूल्य",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#values", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "आप सार्थक दीर्घकालीन लक्ष्य निर्धारित करना चाहते हैं। पाठ के अनुसार, आपको क्या करना चाहिए?",
      options: [
        "बस वित्तीय लक्ष्य निर्धारित करें",
        "अपने मूल्यों को स्पष्ट करें, उन मूल्यों के साथ संरेखित एक दृष्टि बनाएं, उस दृष्टि की सेवा करने वाले लक्ष्य निर्धारित करें, और सुनिश्चित करें कि दैनिक कार्य दीर्घकालिक उद्देश्य का समर्थन करते हैं",
        "बस अल्पकालिक लक्ष्य निर्धारित करें",
        "बस करियर लक्ष्य निर्धारित करें"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "लक्ष्य",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#goals", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "आप अपने जीवन के मूल्यों के साथ उत्पादकता को संरेखित करना चाहते हैं। पाठ के अनुसार, आपको क्या स्थापित करना चाहिए?",
      options: [
        "बस यादृच्छिक रूप से काम करें",
        "स्पष्ट व्यक्तिगत मूल्य, उन मूल्यों के साथ संरेखित दीर्घकालीन दृष्टि, दृष्टि की सेवा करने वाले लक्ष्य, और सार्थक उद्देश्य का समर्थन करने वाले दैनिक कार्य",
        "केवल मूल्य",
        "केवल लक्ष्य"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "मूल्य",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#values", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक व्यक्ति उत्पादक है लेकिन असंतुष्ट महसूस करता है, काम में अर्थ की कमी है, और प्रेरणा समय के साथ कम हो जाती है। पाठ के ढांचे के अनुसार, मुख्य समस्या क्या है?",
      options: [
        "पर्याप्त उत्पादकता नहीं है",
        "मूल्य संरेखण की कमी - काम और व्यक्तिगत मूल्यों, दीर्घकालीन दृष्टि, और सार्थक उद्देश्य के बीच कनेक्शन गायब है जो स्थायी प्रेरणा बनाता है",
        "बहुत अधिक उद्देश्य",
        "मूल्य संरेखण अनावश्यक है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "मूल्य",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#values", "#advanced", "#critical-thinking", "#hi", "#all-languages"]
    }
  ]
};

async function seedDay28Enhanced() {
  try {
    await connectDB();
    console.log('🌱 SEEDING DAY 28 ENHANCED QUIZ QUESTIONS\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    let totalQuestions = 0;
    let totalUpdated = 0;
    let totalCreated = 0;

    for (const lang of LANGUAGES) {
      const courseId = `${COURSE_ID_BASE}_${lang}`;
      const lessonId = `${COURSE_ID_BASE}_${lang}_DAY_28`;

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
      const questions = DAY28_QUESTIONS[lang];
      
      if (!questions || questions.length === 0) {
        console.error(`   ❌ ERROR: No questions defined for ${lang}! Questions MUST be in course language.`);
        throw new Error(`Missing translations for ${lang} - Day 28 questions must be in course language, not English fallback`);
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
    console.log(`\n✅ DAY 28 ENHANCEMENT COMPLETE!\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedDay28Enhanced();
