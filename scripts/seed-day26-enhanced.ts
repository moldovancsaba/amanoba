/**
 * Seed Day 26 Enhanced Quiz Questions
 * 
 * Purpose: Enhance Day 26 quizzes from 5 to 7 questions across all 10 languages
 * Why: Part of Quiz Quality Enhancement - Phase 1, Day 26
 * 
 * Lesson Topic: Mentoring and Teaching (sharing knowledge, helping others)
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
const DAY_NUMBER = 26;
const LANGUAGES = ['HU', 'EN', 'TR', 'BG', 'PL', 'VI', 'ID', 'AR', 'PT', 'HI'];

/**
 * Day 26 Enhanced Questions - All Languages
 * Topic: Mentoring and Teaching
 * Structure: 7 questions per language
 * Q1-Q3: Recall (foundational concepts)
 * Q4: Application (why mentoring matters)
 * Q5: Application (scenario-based)
 * Q6: Application (practical implementation)
 * Q7: Critical Thinking (systems integration)
 */
const DAY26_QUESTIONS: Record<string, Array<{
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: QuestionDifficulty;
  category: string;
  questionType: QuestionType;
  hashtags: string[];
}>> = {
  EN: [
    // Q1: Teaching benefit (RECALL)
    {
      question: "According to the lesson, why does teaching others accelerate your own learning?",
      options: [
        "It doesn't help",
        "It forces you to clarify understanding, identify gaps, and reinforce knowledge through explanation",
        "It only applies to teachers",
        "It requires no effort"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Teaching",
      questionType: QuestionType.RECALL,
      hashtags: ["#teaching", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q2: Mentoring definition (RECALL)
    {
      question: "According to the lesson, what is mentoring?",
      options: [
        "Only formal training",
        "Sharing knowledge, providing guidance, and supporting others' growth through experience and expertise",
        "Only for experts",
        "No structure needed"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Mentoring",
      questionType: QuestionType.RECALL,
      hashtags: ["#mentoring", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q3: Knowledge sharing (RECALL)
    {
      question: "According to the lesson, how does knowledge sharing benefit productivity?",
      options: [
        "It doesn't benefit",
        "It creates learning opportunities, builds stronger teams, and accelerates collective progress",
        "It only applies to large teams",
        "It requires no planning"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Teaching",
      questionType: QuestionType.RECALL,
      hashtags: ["#teaching", "#beginner", "#recall", "#en", "#all-languages"]
    },
    // Q4: Why mentoring matters (APPLICATION)
    {
      question: "Why are mentoring and teaching important for productivity according to the lesson?",
      options: [
        "They eliminate all learning",
        "They accelerate your own learning, strengthen team capabilities, create knowledge networks, and build stronger collaborative systems",
        "They only apply to certain jobs",
        "They require no investment"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Mentoring",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#mentoring", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q5: Mentoring scenario (APPLICATION)
    {
      question: "You want to help a colleague learn a skill you've mastered. According to the lesson, what should you do?",
      options: [
        "Only give them resources",
        "Share your knowledge, provide guidance, create learning opportunities, and support their practice with feedback",
        "Only tell them to learn it",
        "Only demonstrate once"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Mentoring",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#mentoring", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q6: Building mentoring system (APPLICATION)
    {
      question: "You want to integrate mentoring into your productivity practice. According to the lesson, what should you establish?",
      options: [
        "Just teach randomly",
        "Regular knowledge sharing opportunities, mentoring relationships, teaching moments, and feedback systems that accelerate learning for all",
        "Only formal training",
        "Only occasional help"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Mentoring",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#mentoring", "#intermediate", "#application", "#en", "#all-languages"]
    },
    // Q7: Learning isolation analysis (CRITICAL THINKING)
    {
      question: "A person learns alone, never shares knowledge, and team capabilities remain limited. According to the lesson's framework, what is the core issue?",
      options: [
        "Not enough individual learning",
        "Lack of mentoring and teaching - missing knowledge sharing, guidance systems, and collaborative learning that accelerate both individual and collective growth",
        "Too much teaching",
        "Mentoring is unnecessary"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Mentoring",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#mentoring", "#advanced", "#critical-thinking", "#en", "#all-languages"]
    }
  ],
  // Hungarian (HU) - Professional translations
  HU: [
    {
      question: "A lecke szerint miért gyorsítja fel a saját tanulásodat, ha másokat tanítasz?",
      options: [
        "Nem segít",
        "Kényszerít, hogy tisztázd a megértést, azonosítsd a hiányosságokat, és megerősítsd a tudást magyarázaton keresztül",
        "Csak tanárokra vonatkozik",
        "Nem igényel erőfeszítést"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Tanítás",
      questionType: QuestionType.RECALL,
      hashtags: ["#teaching", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint mi a mentorálás?",
      options: [
        "Csak formális képzés",
        "Tudás megosztása, útmutatás nyújtása, és mások növekedésének támogatása tapasztalat és szakértelem révén",
        "Csak szakértőknek",
        "Nincs szükség struktúrára"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Mentorálás",
      questionType: QuestionType.RECALL,
      hashtags: ["#mentoring", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "A lecke szerint hogyan előnyös a tudásmegosztás a termelékenységhez?",
      options: [
        "Nem előnyös",
        "Tanulási lehetőségeket teremt, erősebb csapatokat épít, és felgyorsítja a kollektív haladást",
        "Csak nagy csapatokra vonatkozik",
        "Nem igényel tervezést"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Tanítás",
      questionType: QuestionType.RECALL,
      hashtags: ["#teaching", "#beginner", "#recall", "#hu", "#all-languages"]
    },
    {
      question: "Miért fontosak a mentorálás és a tanítás a termelékenységhez a lecke szerint?",
      options: [
        "Kiküszöbölik az összes tanulást",
        "Felgyorsítják a saját tanulásodat, megerősítik a csapat képességeit, tudáshálózatokat hoznak létre, és erősebb együttműködési rendszereket építenek",
        "Csak bizonyos munkákra vonatkoznak",
        "Nem igényelnek befektetést"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Mentorálás",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#mentoring", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Segíteni szeretnél egy kollégának megtanulni egy készséget, amit te elsajátítottál. A lecke szerint mit kellene tenned?",
      options: [
        "Csak adj neki forrásokat",
        "Oszd meg a tudásodat, nyújts útmutatást, hozz létre tanulási lehetőségeket, és támogasd a gyakorlását visszajelzéssel",
        "Csak mondd meg neki, hogy tanulja meg",
        "Csak mutass be egyszer"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Mentorálás",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#mentoring", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Integrálni szeretnéd a mentorálást a termelékenységi gyakorlatodba. A lecke szerint mit kellene létrehozni?",
      options: [
        "Csak taníts véletlenszerűen",
        "Rendszeres tudásmegosztási lehetőségek, mentorálási kapcsolatok, tanítási pillanatok, és visszajelzési rendszerek, amelyek felgyorsítják a tanulást mindenkinek",
        "Csak formális képzés",
        "Csak alkalmi segítség"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Mentorálás",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#mentoring", "#intermediate", "#application", "#hu", "#all-languages"]
    },
    {
      question: "Egy személy egyedül tanul, soha nem oszt meg tudást, és a csapat képességei korlátozottak maradnak. A lecke keretrendszere szerint mi a fő probléma?",
      options: [
        "Nincs elég egyéni tanulás",
        "Hiányzik a mentorálás és a tanítás - hiányoznak a tudásmegosztás, útmutatási rendszerek, és együttműködő tanulás, amelyek felgyorsítják az egyéni és kollektív növekedést",
        "Túl sok tanítás",
        "A mentorálás felesleges"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Mentorálás",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#mentoring", "#advanced", "#critical-thinking", "#hu", "#all-languages"]
    }
  ],
  // Turkish (TR) - Professional translations
  TR: [
    {
      question: "Derse göre başkalarına öğretmek neden kendi öğrenmenizi hızlandırır?",
      options: [
        "Yardımcı olmaz",
        "Anlayışı netleştirmeye, boşlukları belirlemeye ve açıklama yoluyla bilgiyi pekiştirmeye zorlar",
        "Sadece öğretmenlere uygulanır",
        "Çaba gerektirmez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Öğretim",
      questionType: QuestionType.RECALL,
      hashtags: ["#teaching", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre mentorluk nedir?",
      options: [
        "Sadece resmi eğitim",
        "Bilgi paylaşma, rehberlik sağlama ve deneyim ve uzmanlık yoluyla başkalarının büyümesini destekleme",
        "Sadece uzmanlar için",
        "Yapı gerekmez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Mentorluk",
      questionType: QuestionType.RECALL,
      hashtags: ["#mentoring", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre bilgi paylaşımı verimliliğe nasıl fayda sağlar?",
      options: [
        "Fayda sağlamaz",
        "Öğrenme fırsatları yaratır, daha güçlü ekipler oluşturur ve kolektif ilerlemeyi hızlandırır",
        "Sadece büyük ekiplere uygulanır",
        "Planlama gerektirmez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Öğretim",
      questionType: QuestionType.RECALL,
      hashtags: ["#teaching", "#beginner", "#recall", "#tr", "#all-languages"]
    },
    {
      question: "Derse göre mentorluk ve öğretim verimlilik için neden önemlidir?",
      options: [
        "Tüm öğrenmeyi ortadan kaldırırlar",
        "Kendi öğrenmenizi hızlandırırlar, ekip yeteneklerini güçlendirirler, bilgi ağları oluştururlar ve daha güçlü işbirlikçi sistemler kurarlar",
        "Sadece belirli işlere uygulanırlar",
        "Yatırım gerektirmezler"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Mentorluk",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#mentoring", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir meslektaşının öğrendiğin bir beceriyi öğrenmesine yardımcı olmak istiyorsun. Derse göre ne yapmalısın?",
      options: [
        "Sadece kaynak ver",
        "Bilgini paylaş, rehberlik sağla, öğrenme fırsatları yarat ve geri bildirimle pratiklerini destekle",
        "Sadece öğrenmesini söyle",
        "Sadece bir kez göster"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Mentorluk",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#mentoring", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Mentorluğu verimlilik pratiğine entegre etmek istiyorsun. Derse göre ne kurmalısın?",
      options: [
        "Sadece rastgele öğret",
        "Düzenli bilgi paylaşım fırsatları, mentorluk ilişkileri, öğretim anları ve herkesin öğrenmesini hızlandıran geri bildirim sistemleri",
        "Sadece resmi eğitim",
        "Sadece ara sıra yardım"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Mentorluk",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#mentoring", "#intermediate", "#application", "#tr", "#all-languages"]
    },
    {
      question: "Bir kişi yalnız öğreniyor, asla bilgi paylaşmıyor ve ekip yetenekleri sınırlı kalıyor. Derse göre temel sorun nedir?",
      options: [
        "Yeterli bireysel öğrenme yok",
        "Mentorluk ve öğretim eksikliği - hem bireysel hem de kolektif büyümeyi hızlandıran bilgi paylaşımı, rehberlik sistemleri ve işbirlikçi öğrenme eksik",
        "Çok fazla öğretim",
        "Mentorluk gereksiz"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Mentorluk",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#mentoring", "#advanced", "#critical-thinking", "#tr", "#all-languages"]
    }
  ],
  // Bulgarian (BG) - Professional translations
  BG: [
    {
      question: "Според урока, защо преподаване на други ускорява твоето собствено учене?",
      options: [
        "Не помага",
        "Принуждава те да изясниш разбирането, да идентифицираш пропуските и да укрепиш знанието чрез обяснение",
        "Прилага се само за учители",
        "Не изисква усилие"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Преподаване",
      questionType: QuestionType.RECALL,
      hashtags: ["#teaching", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, какво е менториране?",
      options: [
        "Само формално обучение",
        "Споделяне на знания, предоставяне на насоки и подкрепа на растежа на другите чрез опит и експертиза",
        "Само за експерти",
        "Няма нужда от структура"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Менториране",
      questionType: QuestionType.RECALL,
      hashtags: ["#mentoring", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Според урока, как споделянето на знания помага на производителността?",
      options: [
        "Не помага",
        "Създава възможности за учене, изгражда по-силни екипи и ускорява колективния напредък",
        "Прилага се само за големи екипи",
        "Не изисква планиране"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Преподаване",
      questionType: QuestionType.RECALL,
      hashtags: ["#teaching", "#beginner", "#recall", "#bg", "#all-languages"]
    },
    {
      question: "Защо менторирането и преподаването са важни за производителността според урока?",
      options: [
        "Премахват цялото учене",
        "Ускоряват твоето собствено учене, укрепват способностите на екипа, създават мрежи от знания и изграждат по-силни сътруднически системи",
        "Прилагат се само за определени работи",
        "Не изискват инвестиция"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Менториране",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#mentoring", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Искаш да помогнеш на колега да научи умение, което ти си усвоил. Според урока, какво трябва да направиш?",
      options: [
        "Само дай ресурси",
        "Сподели знанията си, предостави насоки, създай възможности за учене и подкрепи практиката му с обратна връзка",
        "Само кажи му да го научи",
        "Само демонстрирай веднъж"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Менториране",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#mentoring", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Искаш да интегрираш менториране в практиката си за производителност. Според урока, какво трябва да установиш?",
      options: [
        "Просто преподавай на случаен принцип",
        "Редовни възможности за споделяне на знания, менторски взаимоотношения, моменти на преподаване и системи за обратна връзка, които ускоряват ученето за всички",
        "Само формално обучение",
        "Само случайна помощ"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Менториране",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#mentoring", "#intermediate", "#application", "#bg", "#all-languages"]
    },
    {
      question: "Човек учи сам, никога не споделя знания и способностите на екипа остават ограничени. Според рамката на урока, какъв е основният проблем?",
      options: [
        "Няма достатъчно индивидуално учене",
        "Липса на менториране и преподаване - липсват споделяне на знания, системи за насоки и сътрудническо учене, които ускоряват както индивидуалния, така и колективния растеж",
        "Твърде много преподаване",
        "Менторирането е ненужно"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Менториране",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#mentoring", "#advanced", "#critical-thinking", "#bg", "#all-languages"]
    }
  ],
  // Polish (PL) - Professional translations
  PL: [
    {
      question: "Według lekcji, dlaczego uczenie innych przyspiesza twoją własną naukę?",
      options: [
        "Nie pomaga",
        "Wymusza wyjaśnienie zrozumienia, identyfikację luk i wzmocnienie wiedzy poprzez wyjaśnienie",
        "Stosuje się tylko do nauczycieli",
        "Nie wymaga wysiłku"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Nauczanie",
      questionType: QuestionType.RECALL,
      hashtags: ["#teaching", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, czym jest mentorstwo?",
      options: [
        "Tylko formalne szkolenie",
        "Dzielenie wiedzą, zapewnianie wskazówek i wspieranie wzrostu innych poprzez doświadczenie i ekspertyzę",
        "Tylko dla ekspertów",
        "Struktura nie jest potrzebna"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Mentorstwo",
      questionType: QuestionType.RECALL,
      hashtags: ["#mentoring", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Według lekcji, jak dzielenie się wiedzą przynosi korzyści produktywności?",
      options: [
        "Nie przynosi korzyści",
        "Tworzy możliwości uczenia się, buduje silniejsze zespoły i przyspiesza kolektywny postęp",
        "Stosuje się tylko do dużych zespołów",
        "Nie wymaga planowania"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Nauczanie",
      questionType: QuestionType.RECALL,
      hashtags: ["#teaching", "#beginner", "#recall", "#pl", "#all-languages"]
    },
    {
      question: "Dlaczego mentorstwo i nauczanie są ważne dla produktywności według lekcji?",
      options: [
        "Eliminują całe uczenie się",
        "Przyspieszają twoją własną naukę, wzmacniają zdolności zespołu, tworzą sieci wiedzy i budują silniejsze systemy współpracy",
        "Stosują się tylko do określonych prac",
        "Nie wymagają inwestycji"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Mentorstwo",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#mentoring", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Chcesz pomóc koledze nauczyć się umiejętności, którą opanowałeś. Według lekcji, co powinieneś zrobić?",
      options: [
        "Tylko daj zasoby",
        "Podziel się wiedzą, zapewnij wskazówki, stwórz możliwości uczenia się i wspieraj ich praktykę z feedbackiem",
        "Tylko powiedz im, żeby się nauczyli",
        "Tylko zademonstruj raz"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Mentorstwo",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#mentoring", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Chcesz zintegrować mentorstwo ze swoją praktyką produktywności. Według lekcji, co powinieneś ustanowić?",
      options: [
        "Po prostu ucz losowo",
        "Regularne możliwości dzielenia się wiedzą, relacje mentorskie, momenty nauczania i systemy feedbacku, które przyspieszają uczenie się dla wszystkich",
        "Tylko formalne szkolenie",
        "Tylko okazjonalna pomoc"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Mentorstwo",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#mentoring", "#intermediate", "#application", "#pl", "#all-languages"]
    },
    {
      question: "Osoba uczy się sama, nigdy nie dzieli się wiedzą, a zdolności zespołu pozostają ograniczone. Według ram lekcji, jaki jest główny problem?",
      options: [
        "Nie ma wystarczającej indywidualnej nauki",
        "Brak mentorstwa i nauczania - brakuje dzielenia się wiedzą, systemów wskazówek i współpracy w nauce, które przyspieszają zarówno indywidualny, jak i kolektywny wzrost",
        "Zbyt dużo nauczania",
        "Mentorstwo jest niepotrzebne"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Mentorstwo",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#mentoring", "#advanced", "#critical-thinking", "#pl", "#all-languages"]
    }
  ],
  // Vietnamese (VI) - Professional translations
  VI: [
    {
      question: "Theo bài học, tại sao dạy cho người khác tăng tốc độ học tập của bạn?",
      options: [
        "Nó không giúp",
        "Nó buộc bạn phải làm rõ hiểu biết, xác định khoảng trống, và củng cố kiến thức thông qua giải thích",
        "Nó chỉ áp dụng cho giáo viên",
        "Nó không yêu cầu nỗ lực"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Giảng Dạy",
      questionType: QuestionType.RECALL,
      hashtags: ["#teaching", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, cố vấn là gì?",
      options: [
        "Chỉ đào tạo chính thức",
        "Chia sẻ kiến thức, cung cấp hướng dẫn, và hỗ trợ sự phát triển của người khác thông qua kinh nghiệm và chuyên môn",
        "Chỉ dành cho chuyên gia",
        "Không cần cấu trúc"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Cố Vấn",
      questionType: QuestionType.RECALL,
      hashtags: ["#mentoring", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Theo bài học, chia sẻ kiến thức có lợi cho năng suất như thế nào?",
      options: [
        "Nó không có lợi",
        "Nó tạo cơ hội học tập, xây dựng các nhóm mạnh hơn, và tăng tốc tiến trình tập thể",
        "Nó chỉ áp dụng cho các nhóm lớn",
        "Nó không yêu cầu lập kế hoạch"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Giảng Dạy",
      questionType: QuestionType.RECALL,
      hashtags: ["#teaching", "#beginner", "#recall", "#vi", "#all-languages"]
    },
    {
      question: "Tại sao cố vấn và giảng dạy quan trọng cho năng suất theo bài học?",
      options: [
        "Chúng loại bỏ tất cả việc học",
        "Chúng tăng tốc độ học tập của bạn, tăng cường khả năng của nhóm, tạo mạng lưới kiến thức, và xây dựng hệ thống hợp tác mạnh hơn",
        "Chúng chỉ áp dụng cho một số công việc",
        "Chúng không yêu cầu đầu tư"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Cố Vấn",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#mentoring", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Bạn muốn giúp một đồng nghiệp học một kỹ năng mà bạn đã thành thạo. Theo bài học, bạn nên làm gì?",
      options: [
        "Chỉ cung cấp tài nguyên",
        "Chia sẻ kiến thức của bạn, cung cấp hướng dẫn, tạo cơ hội học tập, và hỗ trợ thực hành của họ với phản hồi",
        "Chỉ nói với họ để học nó",
        "Chỉ trình diễn một lần"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Cố Vấn",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#mentoring", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Bạn muốn tích hợp cố vấn vào thực hành năng suất của mình. Theo bài học, bạn nên thiết lập gì?",
      options: [
        "Chỉ dạy ngẫu nhiên",
        "Cơ hội chia sẻ kiến thức thường xuyên, mối quan hệ cố vấn, khoảnh khắc giảng dạy, và hệ thống phản hồi tăng tốc học tập cho tất cả",
        "Chỉ đào tạo chính thức",
        "Chỉ giúp đỡ thỉnh thoảng"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Cố Vấn",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#mentoring", "#intermediate", "#application", "#vi", "#all-languages"]
    },
    {
      question: "Một người học một mình, không bao giờ chia sẻ kiến thức, và khả năng của nhóm vẫn bị hạn chế. Theo khung của bài học, vấn đề cốt lõi là gì?",
      options: [
        "Không đủ học tập cá nhân",
        "Thiếu cố vấn và giảng dạy - thiếu chia sẻ kiến thức, hệ thống hướng dẫn, và học tập hợp tác tăng tốc cả tăng trưởng cá nhân và tập thể",
        "Quá nhiều giảng dạy",
        "Cố vấn là không cần thiết"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Cố Vấn",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#mentoring", "#advanced", "#critical-thinking", "#vi", "#all-languages"]
    }
  ],
  // Indonesian (ID) - Professional translations
  ID: [
    {
      question: "Menurut pelajaran, mengapa mengajar orang lain mempercepat pembelajaran Anda sendiri?",
      options: [
        "Tidak membantu",
        "Memaksa Anda untuk memperjelas pemahaman, mengidentifikasi celah, dan memperkuat pengetahuan melalui penjelasan",
        "Hanya berlaku untuk guru",
        "Tidak memerlukan upaya"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Pengajaran",
      questionType: QuestionType.RECALL,
      hashtags: ["#teaching", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, apa itu mentoring?",
      options: [
        "Hanya pelatihan formal",
        "Berbagi pengetahuan, memberikan bimbingan, dan mendukung pertumbuhan orang lain melalui pengalaman dan keahlian",
        "Hanya untuk ahli",
        "Tidak perlu struktur"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Mentoring",
      questionType: QuestionType.RECALL,
      hashtags: ["#mentoring", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Menurut pelajaran, bagaimana berbagi pengetahuan menguntungkan produktivitas?",
      options: [
        "Tidak menguntungkan",
        "Menciptakan peluang belajar, membangun tim yang lebih kuat, dan mempercepat kemajuan kolektif",
        "Hanya berlaku untuk tim besar",
        "Tidak memerlukan perencanaan"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Pengajaran",
      questionType: QuestionType.RECALL,
      hashtags: ["#teaching", "#beginner", "#recall", "#id", "#all-languages"]
    },
    {
      question: "Mengapa mentoring dan pengajaran penting untuk produktivitas menurut pelajaran?",
      options: [
        "Mereka menghilangkan semua pembelajaran",
        "Mereka mempercepat pembelajaran Anda sendiri, memperkuat kemampuan tim, menciptakan jaringan pengetahuan, dan membangun sistem kolaboratif yang lebih kuat",
        "Mereka hanya berlaku untuk pekerjaan tertentu",
        "Mereka tidak memerlukan investasi"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Mentoring",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#mentoring", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Anda ingin membantu rekan mempelajari keterampilan yang telah Anda kuasai. Menurut pelajaran, apa yang harus Anda lakukan?",
      options: [
        "Hanya berikan sumber daya",
        "Bagikan pengetahuan Anda, berikan bimbingan, ciptakan peluang belajar, dan dukung praktik mereka dengan umpan balik",
        "Hanya katakan kepada mereka untuk mempelajarinya",
        "Hanya demonstrasikan sekali"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Mentoring",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#mentoring", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Anda ingin mengintegrasikan mentoring ke dalam praktik produktivitas Anda. Menurut pelajaran, apa yang harus Anda tetapkan?",
      options: [
        "Hanya ajarkan secara acak",
        "Peluang berbagi pengetahuan rutin, hubungan mentoring, momen pengajaran, dan sistem umpan balik yang mempercepat pembelajaran untuk semua",
        "Hanya pelatihan formal",
        "Hanya bantuan sesekali"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Mentoring",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#mentoring", "#intermediate", "#application", "#id", "#all-languages"]
    },
    {
      question: "Seseorang belajar sendiri, tidak pernah berbagi pengetahuan, dan kemampuan tim tetap terbatas. Menurut kerangka pelajaran, apa masalah intinya?",
      options: [
        "Tidak ada pembelajaran individu yang cukup",
        "Kurangnya mentoring dan pengajaran - kurang berbagi pengetahuan, sistem bimbingan, dan pembelajaran kolaboratif yang mempercepat pertumbuhan individu dan kolektif",
        "Terlalu banyak pengajaran",
        "Mentoring tidak perlu"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Mentoring",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#mentoring", "#advanced", "#critical-thinking", "#id", "#all-languages"]
    }
  ],
  // Arabic (AR) - Professional translations (RTL)
  AR: [
    {
      question: "وفقًا للدرس، لماذا تعليم الآخرين يسرع من تعلمك الخاص?",
      options: [
        "لا يساعد",
        "يجبرك على توضيح الفهم، وتحديد الثغرات، وتعزيز المعرفة من خلال الشرح",
        "ينطبق فقط على المعلمين",
        "لا يتطلب جهدًا"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "التدريس",
      questionType: QuestionType.RECALL,
      hashtags: ["#teaching", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، ما هو الإرشاد?",
      options: [
        "فقط التدريب الرسمي",
        "مشاركة المعرفة، وتوفير التوجيه، ودعم نمو الآخرين من خلال الخبرة والخبرة",
        "فقط للخبراء",
        "لا حاجة للهيكل"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "الإرشاد",
      questionType: QuestionType.RECALL,
      hashtags: ["#mentoring", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "وفقًا للدرس، كيف تفيد مشاركة المعرفة الإنتاجية?",
      options: [
        "لا تفيد",
        "إنها تخلق فرص التعلم، وتبني فرقًا أقوى، وتسريع التقدم الجماعي",
        "تنطبق فقط على الفرق الكبيرة",
        "لا تتطلب تخطيطًا"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "التدريس",
      questionType: QuestionType.RECALL,
      hashtags: ["#teaching", "#beginner", "#recall", "#ar", "#all-languages"]
    },
    {
      question: "لماذا الإرشاد والتدريس مهمان للإنتاجية وفقًا للدرس?",
      options: [
        "إنهما يلغيان كل التعلم",
        "إنهما يسرعان من تعلمك الخاص، ويقويان قدرات الفريق، ويخلقان شبكات المعرفة، ويبنيان أنظمة تعاونية أقوى",
        "ينطبقان فقط على وظائف معينة",
        "لا يتطلبان استثمارًا"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "الإرشاد",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#mentoring", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "تريد مساعدة زميل على تعلم مهارة أتقنتها. وفقًا للدرس، ماذا يجب أن تفعل?",
      options: [
        "فقط أعط الموارد",
        "شارك معرفتك، ووفر التوجيه، وخلق فرص التعلم، ودعم ممارستهم بالتغذية الراجعة",
        "فقط أخبرهم بتعلمها",
        "فقط أظهر مرة واحدة"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "الإرشاد",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#mentoring", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "تريد دمج الإرشاد في ممارسة الإنتاجية لديك. وفقًا للدرس، ماذا يجب أن تنشئ?",
      options: [
        "فقط علم عشوائيًا",
        "فرص مشاركة المعرفة المنتظمة، علاقات الإرشاد، لحظات التدريس، وأنظمة التغذية الراجعة التي تسرع التعلم للجميع",
        "فقط التدريب الرسمي",
        "فقط المساعدة العرضية"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "الإرشاد",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#mentoring", "#intermediate", "#application", "#ar", "#all-languages"]
    },
    {
      question: "شخص يتعلم بمفرده، لا يشارك المعرفة أبدًا، وقدرات الفريق تبقى محدودة. وفقًا لإطار الدرس، ما هي المشكلة الأساسية?",
      options: [
        "لا يوجد تعلم فردي كافٍ",
        "نقص الإرشاد والتدريس - نقص مشاركة المعرفة، وأنظمة التوجيه، والتعلم التعاوني الذي يسرع النمو الفردي والجماعي",
        "الكثير من التدريس",
        "الإرشاد غير ضروري"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "الإرشاد",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#mentoring", "#advanced", "#critical-thinking", "#ar", "#all-languages"]
    }
  ],
  // Portuguese (PT) - Professional translations (Brazilian)
  PT: [
    {
      question: "De acordo com a lição, por que ensinar aos outros acelera seu próprio aprendizado?",
      options: [
        "Não ajuda",
        "Força você a esclarecer o entendimento, identificar lacunas e reforçar o conhecimento através da explicação",
        "Aplica-se apenas a professores",
        "Não requer esforço"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Ensino",
      questionType: QuestionType.RECALL,
      hashtags: ["#teaching", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, o que é mentoria?",
      options: [
        "Apenas treinamento formal",
        "Compartilhar conhecimento, fornecer orientação e apoiar o crescimento de outros através de experiência e expertise",
        "Apenas para especialistas",
        "Estrutura não é necessária"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Mentoria",
      questionType: QuestionType.RECALL,
      hashtags: ["#mentoring", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "De acordo com a lição, como o compartilhamento de conhecimento beneficia a produtividade?",
      options: [
        "Não beneficia",
        "Cria oportunidades de aprendizado, constrói equipes mais fortes e acelera o progresso coletivo",
        "Aplica-se apenas a grandes equipes",
        "Não requer planejamento"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "Ensino",
      questionType: QuestionType.RECALL,
      hashtags: ["#teaching", "#beginner", "#recall", "#pt", "#all-languages"]
    },
    {
      question: "Por que mentoria e ensino são importantes para produtividade de acordo com a lição?",
      options: [
        "Eliminam todo o aprendizado",
        "Aceleram seu próprio aprendizado, fortalecem as capacidades da equipe, criam redes de conhecimento e constroem sistemas colaborativos mais fortes",
        "Aplicam-se apenas a certos trabalhos",
        "Não requerem investimento"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Mentoria",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#mentoring", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Você quer ajudar um colega a aprender uma habilidade que você dominou. De acordo com a lição, o que você deve fazer?",
      options: [
        "Apenas dê recursos",
        "Compartilhe seu conhecimento, forneça orientação, crie oportunidades de aprendizado e apoie a prática deles com feedback",
        "Apenas diga para aprenderem",
        "Apenas demonstre uma vez"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Mentoria",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#mentoring", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Você quer integrar mentoria em sua prática de produtividade. De acordo com a lição, o que você deve estabelecer?",
      options: [
        "Apenas ensine aleatoriamente",
        "Oportunidades regulares de compartilhamento de conhecimento, relacionamentos de mentoria, momentos de ensino e sistemas de feedback que aceleram o aprendizado para todos",
        "Apenas treinamento formal",
        "Apenas ajuda ocasional"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "Mentoria",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#mentoring", "#intermediate", "#application", "#pt", "#all-languages"]
    },
    {
      question: "Uma pessoa aprende sozinha, nunca compartilha conhecimento e as capacidades da equipe permanecem limitadas. De acordo com a estrutura da lição, qual é o problema central?",
      options: [
        "Não há aprendizado individual suficiente",
        "Falta de mentoria e ensino - falta compartilhamento de conhecimento, sistemas de orientação e aprendizado colaborativo que aceleram tanto o crescimento individual quanto coletivo",
        "Muito ensino",
        "Mentoria é desnecessária"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "Mentoria",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#mentoring", "#advanced", "#critical-thinking", "#pt", "#all-languages"]
    }
  ],
  // Hindi (HI) - Professional translations
  HI: [
    {
      question: "पाठ के अनुसार, दूसरों को सिखाना आपके अपने सीखने को क्यों तेज करता है?",
      options: [
        "यह मदद नहीं करता",
        "यह आपको समझ को स्पष्ट करने, अंतराल की पहचान करने, और स्पष्टीकरण के माध्यम से ज्ञान को मजबूत करने के लिए मजबूर करता है",
        "यह केवल शिक्षकों पर लागू होता है",
        "इसके लिए प्रयास की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "शिक्षण",
      questionType: QuestionType.RECALL,
      hashtags: ["#teaching", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, मेंटोरिंग क्या है?",
      options: [
        "केवल औपचारिक प्रशिक्षण",
        "ज्ञान साझा करना, मार्गदर्शन प्रदान करना, और अनुभव और विशेषज्ञता के माध्यम से दूसरों के विकास का समर्थन करना",
        "केवल विशेषज्ञों के लिए",
        "संरचना की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "मेंटोरिंग",
      questionType: QuestionType.RECALL,
      hashtags: ["#mentoring", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार, ज्ञान साझा करना उत्पादकता को कैसे लाभ पहुंचाता है?",
      options: [
        "यह लाभ नहीं पहुंचाता",
        "यह सीखने के अवसर बनाता है, मजबूत टीमें बनाता है, और सामूहिक प्रगति को तेज करता है",
        "यह केवल बड़ी टीमों पर लागू होता है",
        "इसके लिए योजना की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.EASY,
      category: "शिक्षण",
      questionType: QuestionType.RECALL,
      hashtags: ["#teaching", "#beginner", "#recall", "#hi", "#all-languages"]
    },
    {
      question: "पाठ के अनुसार उत्पादकता के लिए मेंटोरिंग और शिक्षण क्यों महत्वपूर्ण हैं?",
      options: [
        "वे सभी सीखने को समाप्त करते हैं",
        "वे आपके अपने सीखने को तेज करते हैं, टीम की क्षमताओं को मजबूत करते हैं, ज्ञान नेटवर्क बनाते हैं, और मजबूत सहयोगी प्रणाली बनाते हैं",
        "वे केवल कुछ नौकरियों पर लागू होते हैं",
        "उन्हें निवेश की आवश्यकता नहीं है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "मेंटोरिंग",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#mentoring", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "आप एक सहकर्मी को एक कौशल सीखने में मदद करना चाहते हैं जिसे आपने महारत हासिल की है। पाठ के अनुसार, आपको क्या करना चाहिए?",
      options: [
        "बस संसाधन दें",
        "अपना ज्ञान साझा करें, मार्गदर्शन प्रदान करें, सीखने के अवसर बनाएं, और प्रतिक्रिया के साथ उनके अभ्यास का समर्थन करें",
        "बस उन्हें इसे सीखने के लिए कहें",
        "बस एक बार प्रदर्शन करें"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "मेंटोरिंग",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#mentoring", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "आप अपनी उत्पादकता अभ्यास में मेंटोरिंग को एकीकृत करना चाहते हैं। पाठ के अनुसार, आपको क्या स्थापित करना चाहिए?",
      options: [
        "बस यादृच्छिक रूप से सिखाएं",
        "नियमित ज्ञान साझा करने के अवसर, मेंटोरिंग संबंध, शिक्षण क्षण, और प्रतिक्रिया प्रणाली जो सभी के लिए सीखने को तेज करती है",
        "केवल औपचारिक प्रशिक्षण",
        "केवल कभी-कभी मदद"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.MEDIUM,
      category: "मेंटोरिंग",
      questionType: QuestionType.APPLICATION,
      hashtags: ["#mentoring", "#intermediate", "#application", "#hi", "#all-languages"]
    },
    {
      question: "एक व्यक्ति अकेले सीखता है, कभी ज्ञान साझा नहीं करता है, और टीम की क्षमताएं सीमित रहती हैं। पाठ के ढांचे के अनुसार, मुख्य समस्या क्या है?",
      options: [
        "पर्याप्त व्यक्तिगत सीखना नहीं है",
        "मेंटोरिंग और शिक्षण की कमी - ज्ञान साझा करने, मार्गदर्शन प्रणाली, और सहयोगी सीखने की कमी जो व्यक्तिगत और सामूहिक विकास दोनों को तेज करती है",
        "बहुत अधिक शिक्षण",
        "मेंटोरिंग अनावश्यक है"
      ],
      correctIndex: 1,
      difficulty: QuestionDifficulty.HARD,
      category: "मेंटोरिंग",
      questionType: QuestionType.CRITICAL_THINKING,
      hashtags: ["#mentoring", "#advanced", "#critical-thinking", "#hi", "#all-languages"]
    }
  ]
};

async function seedDay26Enhanced() {
  try {
    await connectDB();
    console.log('🌱 SEEDING DAY 26 ENHANCED QUIZ QUESTIONS\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    let totalQuestions = 0;
    let totalUpdated = 0;
    let totalCreated = 0;

    for (const lang of LANGUAGES) {
      const courseId = `${COURSE_ID_BASE}_${lang}`;
      const lessonId = `${COURSE_ID_BASE}_${lang}_DAY_26`;

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
      const questions = DAY26_QUESTIONS[lang];
      
      if (!questions || questions.length === 0) {
        console.error(`   ❌ ERROR: No questions defined for ${lang}! Questions MUST be in course language.`);
        throw new Error(`Missing translations for ${lang} - Day 26 questions must be in course language, not English fallback`);
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
    console.log(`\n✅ DAY 26 ENHANCEMENT COMPLETE!\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedDay26Enhanced();
