/**
 * Seed Productivity 2026 Course - Lesson 12 (Day 12)
 * 
 * Day 12: Accountability Structures - Systems that keep you on track
 * 
 * Creates lesson 12 for all 10 languages
 * Languages: Hungarian (hu), English (en), Turkish (tr), Bulgarian (bg), Polish (pl),
 *            Vietnamese (vi), Indonesian (id), Arabic (ar), Brazilian Portuguese (pt), Hindi (hi)
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import { default as connectDB } from '../app/lib/mongodb';
import { Brand, Course, Lesson, QuizQuestion, QuestionDifficulty } from '../app/lib/models';

const COURSE_ID_BASE = 'PRODUCTIVITY_2026';
const LANGUAGE_PAIRS = [
  ['hu', 'en'],
  ['tr', 'bg'],
  ['pl', 'vi'],
  ['id', 'ar'],
  ['pt', 'hi']
];

// ============================================================================
// LESSON 12: Accountability Structures
// ============================================================================

const LESSON_12: Record<string, {
  title: string;
  content: string;
  emailSubject: string;
  emailBody: string;
}> = {
  hu: {
    title: 'Elszámoltathatósági Struktúrák: Rendszerek, amelyek pályán tartanak',
    content: `<h1>Elszámoltathatósági Struktúrák: Rendszerek, amelyek pályán tartanak</h1>
<p><em>A nyilvánosság az erő. Az elszámoltathatóság az eredmény.</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
<li>Megérteni, hogyan működik az elszámoltathatóság a termelékenységben.</li>
<li>Nyilvános célkitűzéseket és mérföldköveket definiálni.</li>
<li>Elszámoltathatósági partnerek kiválasztása és rendszer kialakítása.</li>
<li>Nyomon követési rendszerek létrehozása a haladás mérésére.</li>
<li>Sikertelen mérföldkövek kezelése konstruktívan.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
<li><strong>Nyilvánosság ereje</strong>: A nyilvánosan kommunikált célok 65%-kal valószínűbb, hogy megvalósulnak.</li>
<li><strong>Tudatos elfogadás</strong>: Amikor tudod, hogy mások figyelik a haladást, jobban kitartasz.</li>
<li><strong>Szisztematikus hibajavítás</strong>: Elszámoltatható rendszerek azonosítják a problémákat korai szakaszban.</li>
<li><strong>Kitartás növelése</strong>: Az elszámoltathatóság csökkenti a halogatást és a feladatelhagyást.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>1. Nyilvános Célkitűzések</h3>
<ul>
<li>Írj le egy célkitűzést egyértelműen és megosztd legalább egy emberrel.</li>
<li>Oszd meg a végdátumot és a mérföldköveket.</li>
<li>A kutatások szerint a nyilvánosan közölt célok 65%-kal nagyobb eséllyel teljesülnek.</li>
<li><strong>Technika</strong>: Írj egy 1-2 mondatos nyilatkozatot: "Én [CÉL] teljesítök [DÁTUMIG], mert [OK]."</li>
</ul>
<h3>2. Elszámoltathatósági Partnerek</h3>
<ul>
<li>Válassz egy vagy több személyt, aki rendszeresen megkérdez az előrehaladásodról.</li>
<li>A partner lehet barát, mentor, vagy egy strukturált csoport.</li>
<li><strong>Mit kérdezzen</strong>: "Megvalósítottad az erre a hétre kitűzött mérföldköveket?"</li>
<li><strong>Gyakoriság</strong>: Hetente legalább egyszer.</li>
</ul>
<h3>3. Nyomon Követési Rendszer</h3>
<ul>
<li>Készíts egy táblázatot a mérföldkövekhez és a dátumokhoz.</li>
<li>Napi vagy heti frissítés: Milyen % a befejezés?</li>
<li>Eszközök: Spreadsheet, projektkezelő, vagy papír jegyzet.</li>
<li><strong>Mit kell követni</strong>: Konkrét, mérhető feltételek (pl. "3 fejezet befejezve", nem "általában tanulok").</li>
</ul>
<h3>4. A Szegély Nélküli Hibás Mérföldkővet Kezelni</h3>
<ul>
<li>Ha egy mérföldkövet nem teljesítesz, ne adjad fel a célt.</li>
<li>Kérdezz meg: "Mi volt az oka? Volt-e előre nem látható esemény?"</li>
<li>Végezz egy gyors 15 perces retrospektív: tanulság, módosított tervek, új próbálkozás.</li>
<li><strong>Fő szabály</strong>: Soha ne hagyd el a célt; csak módosítsd a tervet.</li>
</ul>
<h3>5. Csoportos Elszámoltathatóság</h3>
<ul>
<li>Csoportos bejelentkezések: Több személy közös céllal.</li>
<li>Közös megbeszélések hetente: ki érte el a mérföldkövet, ki nem, és miért.</li>
<li><strong>Dinamika</strong>: A csoport nyomása és támogatása erős motiváció.</li>
</ul>
<hr />
<h2>Gyakorlati feladat (45 perc)</h2>
<ol>
<li><strong>Célkitűzés</strong>: Válassz egy 4-8 hetes célt (amit egy nagy termékenységi célt szeretnél elérni).</li>
<li><strong>Mérföldkövek</strong>: Szétbontod heti vagy kétheti mérföldkövekre (konkrét, mérhető).</li>
<li><strong>Partner kiválasztása</strong>: Kérd meg egy barátot vagy mentort, hogy legyen az elszámoltathatósági partnered.</li>
<li><strong>Nyilatkozat megírása</strong>: "Én [CÉL] teljesítök [DÁTUMIG], mert [OK]."</li>
<li><strong>Nyomon követési táblázat</strong>: Hozz létre egy egyszerű táblázatot a heti előrehaladás rögzítésére.</li>
<li><strong>Megosztás</strong>: Küldj egy üzenetet a partnernek, hogy tudassa az elszámoltathatósági kapcsolat kezdetét.</li>
</ol>
<hr />
<h2>Önellenőrzés</h2>
<ul>
<li>✅ Van egy egyértelmű, 4-8 hetes célt az elszámoltathatóságra kiválasztva.</li>
<li>✅ A célt konkrét, heti/kétheti mérföldkövekre szétbontottam.</li>
<li>✅ Van egy elszámoltathatósági partnerem.</li>
<li>✅ Megírtam a célt egy egyszerű nyilatkozatban.</li>
<li>✅ Van egy nyomon követési rendszerem (táblázat vagy alkalmazás).</li>
<li>✅ Az elszámoltathatósági partnered tudatni lett az elszámoltathatósági terv kezdetéről.</li>
</ul>`,
    emailSubject: 'Termelékenység 2026 – 12. nap: Elszámoltathatósági Struktúrák',
    emailBody: `<h1>Termelékenység 2026 – 12. nap</h1>
<h2>Elszámoltathatósági Struktúrák: Rendszerek, amelyek pályán tartanak</h2>
<p><em>A nyilvánosság az erő. Az elszámoltathatóság az eredmény.</em></p>
<p>Ma azt tanulod meg, hogyan kell olyan rendszereket építeni, amelyek biztosítják a célodat. Az elszámoltathatóság nem arról szól, hogy valakinek beszámolsz, hanem arról, hogy szándékodat nyilvánosan kifejezed, és szisztematikusan nyomon követed az előrehaladást.</p>
<p><strong>Az igazság</strong>: A nyilvánosan kommunikált célok 65%-kal valószínűbb, hogy megvalósulnak.</p>
<p><strong>Ma megtanulsz</strong>: Nyilvános célkitűzéseket, partnerségeket és nyomon követési rendszereket.</p>
<p><a href="{{APP_URL}}/hu/courses/${COURSE_ID_BASE}_HU/day/12">Nyisd meg a leckét →</a></p>`
  },
  en: {
    title: 'Accountability Structures: Systems That Keep You on Track',
    content: `<h1>Accountability Structures: Systems That Keep You on Track</h1>
<p><em>Transparency is power. Accountability is results.</em></p>
<hr />
<h2>Learning Objectives</h2>
<ul>
<li>Understand how accountability works in productivity.</li>
<li>Define public goals and milestones.</li>
<li>Select accountability partners and build systems.</li>
<li>Create tracking systems to measure progress.</li>
<li>Handle missed milestones constructively.</li>
</ul>
<hr />
<h2>Why This Matters</h2>
<ul>
<li><strong>Power of Transparency</strong>: Publicly communicated goals are 65% more likely to be achieved.</li>
<li><strong>Conscious Commitment</strong>: When you know others are watching, you stay committed.</li>
<li><strong>Systematic Correction</strong>: Accountable systems catch problems early.</li>
<li><strong>Persistence Boost</strong>: Accountability reduces procrastination and task abandonment.</li>
</ul>
<hr />
<h2>Deep Dive</h2>
<h3>1. Public Goal Setting</h3>
<ul>
<li>Write a goal clearly and share it with at least one person.</li>
<li>Include the end date and milestones.</li>
<li>Research: Publicly stated goals are 65% more likely to be achieved.</li>
<li><strong>Technique</strong>: Write a 1-2 sentence statement: "I will achieve [GOAL] by [DATE] because [REASON]."</li>
</ul>
<h3>2. Accountability Partners</h3>
<ul>
<li>Choose one or more people who will regularly ask about your progress.</li>
<li>Partner can be a friend, mentor, or structured group.</li>
<li><strong>Their Question</strong>: "Did you achieve this week's milestones?"</li>
<li><strong>Frequency</strong>: At least once per week.</li>
</ul>
<h3>3. Tracking System</h3>
<ul>
<li>Create a table with milestones and dates.</li>
<li>Update daily or weekly: What's the % completion?</li>
<li>Tools: Spreadsheet, project manager, or paper journal.</li>
<li><strong>Track specifically</strong>: Concrete metrics (e.g., "3 chapters completed," not "I'm making progress").</li>
</ul>
<h3>4. Handling Missed Milestones</h3>
<ul>
<li>If you miss a milestone, don't abandon the goal.</li>
<li>Ask: "What caused it? Was there an unforeseen event?"</li>
<li>Do a quick 15-minute retrospective: lesson, adjusted plan, retry.</li>
<li><strong>Key Rule</strong>: Never drop the goal; only adjust the plan.</li>
</ul>
<h3>5. Group Accountability</h3>
<ul>
<li>Group check-ins: Multiple people with shared goals.</li>
<li>Weekly meeting: Who hit milestones, who didn't, and why.</li>
<li><strong>Dynamic</strong>: Group pressure and support create strong motivation.</li>
</ul>
<hr />
<h2>Practical Exercise (45 minutes)</h2>
<ol>
<li><strong>Set a Goal</strong>: Choose a 4-8 week goal (something a major productivity goal you want to achieve).</li>
<li><strong>Milestones</strong>: Break it into weekly or bi-weekly milestones (concrete, measurable).</li>
<li><strong>Choose a Partner</strong>: Ask a friend or mentor to be your accountability partner.</li>
<li><strong>Write a Statement</strong>: "I will achieve [GOAL] by [DATE] because [REASON]."</li>
<li><strong>Create Tracking Table</strong>: Make a simple table to track weekly progress.</li>
<li><strong>Share</strong>: Send a message to your partner to initiate the accountability relationship.</li>
</ol>
<hr />
<h2>Self-Check</h2>
<ul>
<li>✅ I have a clear 4-8 week goal for accountability.</li>
<li>✅ I've broken it into weekly/bi-weekly milestones.</li>
<li>✅ I have an accountability partner.</li>
<li>✅ I've written my goal in a simple statement.</li>
<li>✅ I have a tracking system (table or app).</li>
<li>✅ My accountability partner knows about the plan.</li>
</ul>`,
    emailSubject: 'Productivity 2026 – Day 12: Accountability Structures',
    emailBody: `<h1>Productivity 2026 – Day 12</h1>
<h2>Accountability Structures: Systems That Keep You on Track</h2>
<p><em>Transparency is power. Accountability is results.</em></p>
<p>Today you'll learn how to build systems that ensure you hit your goals. Accountability isn't about reporting to someone—it's about publicly stating your intent and systematically tracking progress.</p>
<p><strong>The fact</strong>: Publicly communicated goals are 65% more likely to be achieved.</p>
<p><strong>Today's focus</strong>: Public commitments, partnerships, and tracking systems.</p>
<p><a href="{{APP_URL}}/en/courses/${COURSE_ID_BASE}_EN/day/12">Open the lesson →</a></p>`
  },
  tr: {
    title: 'Muhasebeleştirme Yapıları: Sizi Piste Tutacak Sistemler',
    content: `<h1>Muhasebeleştirme Yapıları: Sizi Piste Tutacak Sistemler</h1>
<p><em>Şeffaflık güçtür. Muhasebeleştirme sonuçtur.</em></p>
<hr />
<h2>Öğrenme Hedefleri</h2>
<ul>
<li>Verimlikte muhasebeleştirmenin nasıl çalıştığını anlamak.</li>
<li>Herkese açık hedefler ve kilometre taşları tanımlamak.</li>
<li>Muhasebeleştirme ortakları seçmek ve sistemler kurmak.</li>
<li>İlerlemeyi ölçmek için izleme sistemleri yaratmak.</li>
<li>Kaçırılan kilometre taşlarını yapıcı bir şekilde yönetmek.</li>
</ul>
<hr />
<h2>Neden Önemli</h2>
<ul>
<li><strong>Şeffaflığın Gücü</strong>: Herkese açık olarak belirtilen hedefler %65 daha fazla başarılı olur.</li>
<li><strong>Bilinçli Taahhüt</strong>: Başkaları izliyorsa, daha fazla bağlanırsın.</li>
<li><strong>Sistematik Düzeltme</strong>: Muhasebeleştirme sistemleri sorunları erken yakalar.</li>
<li><strong>Azim Artışı</strong>: Muhasebeleştirme ertelemeyi ve görev terk etmeyi azaltır.</li>
</ul>
<hr />
<h2>Derinlemesine Inceleme</h2>
<h3>1. Halka Açık Hedef Belirleme</h3>
<ul>
<li>Bir hedefi açıkça yazın ve en az bir kişiyle paylaşın.</li>
<li>Bitiş tarihini ve kilometre taşlarını ekleyin.</li>
<li>Araştırma: Herkese açık olarak belirtilen hedefler %65 daha başarılı olur.</li>
<li><strong>Teknik</strong>: "Ben [HEDEF] [TARİH]'e kadar başaracağım çünkü [NEDEN]" yazın.</li>
</ul>
<h3>2. Muhasebeleştirme Ortakları</h3>
<ul>
<li>İlerlemeniz hakkında düzenli olarak soracak bir veya birden fazla kişi seçin.</li>
<li>Ortak bir arkadaş, mentor veya yapılandırılmış grup olabilir.</li>
<li><strong>Onların Sorusu</strong>: "Bu haftanın kilometre taşlarına ulaştı mı?"</li>
<li><strong>Sıklık</strong>: Haftada en az bir kez.</li>
</ul>
<h3>3. İzleme Sistemi</h3>
<ul>
<li>Kilometre taşları ve tarihlerle bir tablo oluşturun.</li>
<li>Günlük veya haftalık olarak güncelleyin: Tamamlanma yüzdesi nedir?</li>
<li>Araçlar: Elektronik tablo, proje yöneticisi veya kağıt günlüğü.</li>
<li><strong>Spesifik olarak takip edin</strong>: Somut metrikler (örneğin, "3 bölüm tamamlandı", "ilerleme yapıyorum" değil).</li>
</ul>
<h3>4. Kaçırılan Kilometre Taşlarını Yönetmek</h3>
<ul>
<li>Bir kilometre taşını kaçırırsanız, hedefi terk etmeyin.</li>
<li>Sorun: "Sebebi ne? Öngörülemeyen bir olay mı vardı?"</li>
<li>Hızlı bir 15 dakikalık geriye doğru inceleme yapın: ders, düzeltilmiş plan, yeniden deneme.</li>
<li><strong>Ana Kural</strong>: Hedefi asla bırakmayın; sadece planı ayarlayın.</li>
</ul>
<h3>5. Grup Muhasebeleştirmesi</h3>
<ul>
<li>Grup kontrolleri: Paylaşılan hedefleri olan birden fazla kişi.</li>
<li>Haftalık toplantı: Kimler kilometre taşlarına ulaştı, kimler hayır ve neden.</li>
<li><strong>Dinamik</strong>: Grup baskısı ve desteği güçlü motivasyon yaratır.</li>
</ul>
<hr />
<h2>Pratik Egzersiz (45 dakika)</h2>
<ol>
<li><strong>Hedef Belirleyin</strong>: 4-8 haftalık bir hedef seçin (başarmak istediğiniz büyük bir verimlilik hedefi).</li>
<li><strong>Kilometre Taşları</strong>: Haftalık veya iki haftalık kilometre taşlarına bölün (somut, ölçülebilir).</li>
<li><strong>Bir Ortak Seçin</strong>: Bir arkadaş veya mentordan muhasebeleştirme ortağınız olmasını isteyin.</li>
<li><strong>Bir İfade Yazın</strong>: "Ben [HEDEF] [TARİH]'e kadar başaracağım çünkü [NEDEN]."</li>
<li><strong>İzleme Tablosu Oluşturun</strong>: Haftalık ilerlemeyi izlemek için basit bir tablo yapın.</li>
<li><strong>Paylaşın</strong>: Ortağınıza muhasebeleştirme ilişkisini başlatmak için bir mesaj gönderin.</li>
</ol>
<hr />
<h2>Kendi Kendine Kontrol</h2>
<ul>
<li>✅ Muhasebeleştirme için açık bir 4-8 haftalık hedefim var.</li>
<li>✅ Bunu haftalık/iki haftalık kilometre taşlarına ayırdım.</li>
<li>✅ Bir muhasebeleştirme ortağım var.</li>
<li>✅ Hedefimi basit bir ifadede yazdım.</li>
<li>✅ Bir izleme sistemim var (tablo veya uygulama).</li>
<li>✅ Muhasebeleştirme ortağım plan hakkında biliyor.</li>
</ul>`,
    emailSubject: 'Verimlilik 2026 – 12. Gün: Muhasebeleştirme Yapıları',
    emailBody: `<h1>Verimlilik 2026 – 12. Gün</h1>
<h2>Muhasebeleştirme Yapıları: Sizi Piste Tutacak Sistemler</h2>
<p><em>Şeffaflık güçtür. Muhasebeleştirme sonuçtur.</em></p>
<p>Bugün, hedeflerinize ulaşmanızı sağlayan sistemler kurmayı öğreneceksiniz. Muhasebeleştirme, birilerine rapor vermekle ilgili değil, niyetinizi herkese açık olarak belirtmek ve ilerlemeyi sistematik olarak izlemek hakkında.</p>
<p><strong>Gerçek</strong>: Herkese açık olarak belirtilen hedefler %65 daha başarılı olur.</p>
<p><strong>Bugünün odağı</strong>: Halka açık taahhütler, ortaklıklar ve izleme sistemleri.</p>
<p><a href="{{APP_URL}}/tr/courses/${COURSE_ID_BASE}_TR/day/12">Dersi aç →</a></p>`
  },
  bg: {
    title: 'Структури на отчетност: Системи, които ви държат на пътя',
    content: `<h1>Структури на отчетност: Системи, които ви държат на пътя</h1>
<p><em>Прозрачност е сила. Отчетност е резултат.</em></p>
<hr />
<h2>Учебни цели</h2>
<ul>
<li>Разберете как работи отчетността в производителност.</li>
<li>Дефинирайте публични цели и веха.</li>
<li>Изберете партньори на отчетност и изградете системи.</li>
<li>Създайте системи за проследяване на напредъка.</li>
<li>Управлявайте пропуснати вехи конструктивно.</li>
</ul>
<hr />
<h2>Защо е важно</h2>
<ul>
<li><strong>Сила на прозрачност</strong>: Публично заявени цели са 65% по-вероятни да бъдат постигнати.</li>
<li><strong>Съзнателен ангажимент</strong>: Когато знаеш, че други те наблюдават, оставаш вътре.</li>
<li><strong>Систематична корекция</strong>: Системи на отчетност хващат проблемите рано.</li>
<li><strong>Увеличение на упоритост</strong>: Отчетност намалява отлагането и напускането на задачи.</li>
</ul>
<hr />
<h2>Дълбоко потапяне</h2>
<h3>1. Публично определяне на целите</h3>
<ul>
<li>Напишете цел ясно и поделете я с поне един човек.</li>
<li>Включете крайната дата и вехите.</li>
<li>Изследване: Публично заявени цели са 65% по-вероятни да бъдат постигнати.</li>
<li><strong>Техника</strong>: Напишете 1-2 изречение: "Ще постигна [ЦЕЛ] до [ДАТА] защото [ПРИЧИНА]."</li>
</ul>
<h3>2. Партньори на отчетност</h3>
<ul>
<li>Изберете един или повече хора, които редовно ще пытат за вашия напредък.</li>
<li>Партньорът може да бъде приятел, наставник или структурирана група.</li>
<li><strong>Техният въпрос</strong>: "Постигна ли вехите на тази седмица?"</li>
<li><strong>Честота</strong>: Поне веднъж седмично.</li>
</ul>
<h3>3. Система за проследяване</h3>
<ul>
<li>Създайте таблица със вехи и дати.</li>
<li>Обновявайте ежедневно или седмично: Какъв е % на завършеност?</li>
<li>Инструменти: Електронна таблица, мениджър на проект или хартиен дневник.</li>
<li><strong>Проследяване конкретно</strong>: Конкретни метрики (напр. "3 глави завършени", не "правя напредък").</li>
</ul>
<h3>4. Управление на пропуснатите вехи</h3>
<ul>
<li>Ако пропуснете веха, не напускайте целта.</li>
<li>Попитайте: "Какво я причи? Имаше ли непредвидено събитие?"</li>
<li>Направете бърза 15-минутна ретроспектива: урок, преустроен план, повторение.</li>
<li><strong>Ключово правило</strong>: Никога не напускайте целта; само преустройте плана.</li>
</ul>
<h3>5. Групова отчетност</h3>
<ul>
<li>Групови контролни пункти: Множество хора със споделени цели.</li>
<li>Седмично събрание: Кой достигна вехите, кой не и защо.</li>
<li><strong>Динамика</strong>: Групов натиск и поддържка създават силна мотивация.</li>
</ul>
<hr />
<h2>Практическо упражнение (45 минути)</h2>
<ol>
<li><strong>Задайте цел</strong>: Изберете 4-8 седмична цел (нещо голямо, което искате да достигнете).</li>
<li><strong>Вехи</strong>: Разбийте я на седмични или двуседмични вехи (конкретни, измерими).</li>
<li><strong>Изберете партньор</strong>: Попросете приятел или наставник да бъде ваш партньор на отчетност.</li>
<li><strong>Напишете изречение</strong>: "Ще постигна [ЦЕЛ] до [ДАТА] защото [ПРИЧИНА]."</li>
<li><strong>Създайте таблица за проследяване</strong>: Направете проста таблица за проследяване на седмичния напредък.</li>
<li><strong>Поделете</strong>: Изпратете съобщение на партньора, за да начина отношението на отчетност.</li>
</ol>
<hr />
<h2>Собственна проверка</h2>
<ul>
<li>✅ Имам ясна 4-8 седмична цел за отчетност.</li>
<li>✅ Я разбих на седмични/двуседмични вехи.</li>
<li>✅ Имам партньор на отчетност.</li>
<li>✅ Написал съм целта си в просто изречение.</li>
<li>✅ Имам система за проследяване (таблица или приложение).</li>
<li>✅ Моят партньор на отчетност знае за плана.</li>
</ul>`,
    emailSubject: 'Производителност 2026 – 12. Ден: Структури на отчетност',
    emailBody: `<h1>Производителност 2026 – 12. Ден</h1>
<h2>Структури на отчетност: Системи, които ви държат на пътя</h2>
<p><em>Прозрачност е сила. Отчетност е резултат.</em></p>
<p>Днес ще научите как да изградите системи, които гарантират, че постигате целите си. Отчетността не е за докладване на някого - това е за публично заявяване на намерението си и систематично проследяване на напредъка.</p>
<p><strong>Фактът</strong>: Публично заявени цели са 65% по-вероятни да бъдат постигнати.</p>
<p><strong>Днешния фокус</strong>: Публични ангажименти, партньорства и системи за проследяване.</p>
<p><a href="{{APP_URL}}/bg/courses/${COURSE_ID_BASE}_BG/day/12">Отворете урока →</a></p>`
  },
  pl: {
    title: 'Struktury Odpowiedzialności: Systemy Utrzymujące Cię na Torze',
    content: `<h1>Struktury Odpowiedzialności: Systemy Utrzymujące Cię na Torze</h1>
<p><em>Przejrzystość to siła. Odpowiedzialność to rezultat.</em></p>
<hr />
<h2>Cele edukacyjne</h2>
<ul>
<li>Zrozumieć, jak działa odpowiedzialność w produktywności.</li>
<li>Zdefiniować publiczne cele i kamienie milowe.</li>
<li>Wybierać partnerów odpowiedzialności i budować systemy.</li>
<li>Tworzyć systemy śledzenia do pomiaru postępu.</li>
<li>Konstruktywnie radzić sobie z brakami kamieni milowych.</li>
</ul>
<hr />
<h2>Dlaczego jest to ważne</h2>
<ul>
<li><strong>Siła przejrzystości</strong>: Publicznie podane cele są 65% bardziej prawdopodobne do osiągnięcia.</li>
<li><strong>Świadoma zobowiązania</strong>: Gdy wiesz, że inni obserwują, pozostajesz zaangażowany.</li>
<li><strong>Systematyczna korekta</strong>: Systemy odpowiedzialności chwytają problemy wcześnie.</li>
<li><strong>Wzrost wytrwałości</strong>: Odpowiedzialność zmniejsza odkładanie i porzucanie zadań.</li>
</ul>
<hr />
<h2>Głębokie zanurzenie</h2>
<h3>1. Publiczne ustalanie celów</h3>
<ul>
<li>Napisz cel wyraźnie i podziel się nim z co najmniej jedną osobą.</li>
<li>Dołącz datę końcową i kamienie milowe.</li>
<li>Badania: Publicznie podane cele są 65% bardziej prawdopodobne do osiągnięcia.</li>
<li><strong>Technika</strong>: Napisz zdanie 1-2: "Osiągnę [CEL] do [DATY] ponieważ [POWÓD]."</li>
</ul>
<h3>2. Partnerzy odpowiedzialności</h3>
<ul>
<li>Wybierz jedną lub więcej osób, które będą regularnie pytać o Twój postęp.</li>
<li>Partner może być przyjacielem, mentorem lub strukturalną grupą.</li>
<li><strong>Ich pytanie</strong>: "Czy osiągnąłeś kamienie milowe z tego tygodnia?"</li>
<li><strong>Częstotliwość</strong>: Przynajmniej raz na tydzień.</li>
</ul>
<h3>3. System śledzenia</h3>
<ul>
<li>Utwórz tabelę z kamieniami milowymi i datami.</li>
<li>Aktualizuj codziennie lub tygodniowo: Jaki jest procent ukończenia?</li>
<li>Narzędzia: Arkusz kalkulacyjny, menedżer projektów lub papierowy dziennik.</li>
<li><strong>Śledź konkretnie</strong>: Konkretne metryki (np. "3 rozdziały ukończone", nie "postęp").</li>
</ul>
<h3>4. Radzenie sobie z brakami kamieni milowych</h3>
<ul>
<li>Jeśli pominiesz kamień milowy, nie porzucaj celu.</li>
<li>Zapytaj: "Co go spowodowało? Było nieprewidziane zdarzenie?"</li>
<li>Zrób szybką 15-minutową retrospektywę: lekcja, zmodyfikowany plan, ponowienie.</li>
<li><strong>Kluczowa zasada</strong>: Nigdy nie porzucaj celu; tylko dostosuj plan.</li>
</ul>
<h3>5. Grupowa odpowiedzialność</h3>
<ul>
<li>Grupa kontroli: Wiele osób ze wspólnymi celami.</li>
<li>Cotygodniowe spotkanie: Kto osiągnął kamienie milowe, kto nie i dlaczego.</li>
<li><strong>Dynamika</strong>: Presja grupy i wsparcie tworzą silną motywację.</li>
</ul>
<hr />
<h2>Ćwiczenie praktyczne (45 minut)</h2>
<ol>
<li><strong>Ustal cel</strong>: Wybierz cel 4-8 tygodniowy (coś dużego, co chcesz osiągnąć).</li>
<li><strong>Kamienie milowe</strong>: Rozbij go na tygodniowe lub dwutygodniowe kamienie milowe (konkretne, mierzalne).</li>
<li><strong>Wybierz partnera</strong>: Poproś przyjaciela lub mentora, aby był Twoim partnerem odpowiedzialności.</li>
<li><strong>Napisz oświadczenie</strong>: "Osiągnę [CEL] do [DATY] ponieważ [POWÓD]."</li>
<li><strong>Utwórz tabelę śledzenia</strong>: Zrób prostą tabelę do śledzenia tygodniowego postępu.</li>
<li><strong>Podziel się</strong>: Wyślij wiadomość do swojego partnera, aby rozpocząć relację odpowiedzialności.</li>
</ol>
<hr />
<h2>Samosprawdzenie</h2>
<ul>
<li>✅ Mam wyraźny cel 4-8 tygodniowy dla odpowiedzialności.</li>
<li>✅ Rozbiłem go na tygodniowe/dwutygodniowe kamienie milowe.</li>
<li>✅ Mam partnera odpowiedzialności.</li>
<li>✅ Napisałem swój cel w prostym oświadczeniu.</li>
<li>✅ Mam system śledzenia (tabela lub aplikacja).</li>
<li>✅ Mój partner odpowiedzialności zna plan.</li>
</ul>`,
    emailSubject: 'Produktywność 2026 – 12. Dzień: Struktury Odpowiedzialności',
    emailBody: `<h1>Produktywność 2026 – 12. Dzień</h1>
<h2>Struktury Odpowiedzialności: Systemy Utrzymujące Cię na Torze</h2>
<p><em>Przejrzystość to siła. Odpowiedzialność to rezultat.</em></p>
<p>Dzisiaj nauczysz się budować systemy, które zapewniają osiągnięcie celów. Odpowiedzialność to nie raportowanie komuś - to publiczne wyrażenie zamiaru i systematyczne śledzenie postępu.</p>
<p><strong>Fakt</strong>: Publicznie podane cele są 65% bardziej prawdopodobne do osiągnięcia.</p>
<p><strong>Dzisiejszy fokus</strong>: Publiczne zobowiązania, partnerstwa i systemy śledzenia.</p>
<p><a href="{{APP_URL}}/pl/courses/${COURSE_ID_BASE}_PL/day/12">Otwórz lekcję →</a></p>`
  },
  vi: {
    title: 'Cấu trúc Trách nhiệm: Các Hệ thống Giữ bạn trên Đường',
    content: `<h1>Cấu trúc Trách nhiệm: Các Hệ thống Giữ bạn trên Đường</h1>
<p><em>Tính minh bạch là sức mạnh. Trách nhiệm là kết quả.</em></p>
<hr />
<h2>Mục tiêu học tập</h2>
<ul>
<li>Hiểu cách trách nhiệm hoạt động trong năng suất.</li>
<li>Xác định các mục tiêu công khai và các mốc quan trọng.</li>
<li>Chọn các đối tác trách nhiệm và xây dựng các hệ thống.</li>
<li>Tạo các hệ thống theo dõi để đo lường tiến độ.</li>
<li>Xử lý các mốc bị bỏ lỡ một cách xây dựng.</li>
</ul>
<hr />
<h2>Tại sao điều này lại quan trọng</h2>
<ul>
<li><strong>Sức mạnh của tính minh bạch</strong>: Các mục tiêu được công bố công khai có xác suất 65% cao hơn để được thực hiện.</li>
<li><strong>Cam kết có ý thức</strong>: Khi biết rằng những người khác đang xem, bạn sẽ gắn bó hơn.</li>
<li><strong>Điều chỉnh hệ thống</strong>: Các hệ thống trách nhiệm bắt được các vấn đề sớm.</li>
<li><strong>Tăng cầu thị</li>
<li><strong>Sự kiên trì tăng</strong>: Trách nhiệm giảm bớt sự trì hoãn và từ bỏ nhiệm vụ.</li>
</ul>
<hr />
<h2>Lặn sâu</h2>
<h3>1. Đặt mục tiêu công khai</h3>
<ul>
<li>Viết một mục tiêu rõ ràng và chia sẻ nó với ít nhất một người.</li>
<li>Bao gồm ngày kết thúc và các mốc quan trọng.</li>
<li>Nghiên cứu: Các mục tiêu được công bố công khai có xác suất 65% cao hơn để được thực hiện.</li>
<li><strong>Kỹ thuật</strong>: Viết 1-2 câu: "Tôi sẽ đạt [MỤC TIÊU] vào [NGÀY] vì [LÝ DO]."</li>
</ul>
<h3>2. Những người bạn là người chịu trách nhiệm</h3>
<ul>
<li>Chọn một hoặc nhiều người sẽ thường xuyên hỏi về tiến độ của bạn.</li>
<li>Đối tác có thể là bạn, cố vấn hoặc nhóm có cấu trúc.</li>
<li><strong>Câu hỏi của họ</strong>: "Bạn đã đạt được các mốc của tuần này chưa?"</li>
<li><strong>Tần suất</strong>: Ít nhất một lần mỗi tuần.</li>
</ul>
<h3>3. Hệ thống theo dõi</h3>
<ul>
<li>Tạo bảng với các mốc và ngày tháng.</li>
<li>Cập nhật hàng ngày hoặc hàng tuần: Phần trăm hoàn thành là bao nhiêu?</li>
<li>Công cụ: Bảng tính, trình quản lý dự án hoặc nhật ký giấy.</li>
<li><strong>Theo dõi cụ thể</strong>: Các chỉ số cụ thể (ví dụ: "3 chương hoàn thành", không phải "tiến độ").</li>
</ul>
<h3>4. Xử lý các mốc bị bỏ lỡ</h3>
<ul>
<li>Nếu bạn bỏ lỡ một mốc, đừng từ bỏ mục tiêu.</li>
<li>Hỏi: "Nguyên nhân là gì? Có sự kiện không dự đoán được không?"</li>
<li>Thực hiện một bài kiểm tra lại 15 phút nhanh: bài học, kế hoạch được điều chỉnh, thử lại.</li>
<li><strong>Quy tắc chính</strong>: Không bao giờ bỏ cuộc; chỉ điều chỉnh kế hoạch.</li>
</ul>
<h3>5. Trách nhiệm nhóm</h3>
<ul>
<li>Kiểm tra nhóm: Nhiều người có các mục tiêu chung.</li>
<li>Cuộc họp hàng tuần: Ai đạt được các mốc, ai không và tại sao.</li>
<li><strong>Động lực</strong>: Áp lực nhóm và hỗ trợ tạo ra động lực mạnh.</li>
</ul>
<hr />
<h2>Bài tập thực hành (45 phút)</h2>
<ol>
<li><strong>Đặt mục tiêu</strong>: Chọn mục tiêu 4-8 tuần (thứ gì đó bạn muốn đạt được).</li>
<li><strong>Các mốc</strong>: Chia nó thành các mốc hàng tuần hoặc hai tuần (cụ thể, có thể đo lường).</li>
<li><strong>Chọn một đối tác</strong>: Yêu cầu một người bạn hoặc cố vấn trở thành đối tác trách nhiệm của bạn.</li>
<li><strong>Viết tuyên bố</strong>: "Tôi sẽ đạt [MỤC TIÊU] vào [NGÀY] vì [LÝ DO]."</li>
<li><strong>Tạo bảng theo dõi</strong>: Tạo một bảng đơn giản để theo dõi tiến độ hàng tuần.</li>
<li><strong>Chia sẻ</strong>: Gửi tin nhắn cho đối tác của bạn để bắt đầu mối quan hệ trách nhiệm.</li>
</ol>
<hr />
<h2>Tự kiểm tra</h2>
<ul>
<li>✅ Tôi có một mục tiêu 4-8 tuần rõ ràng cho trách nhiệm.</li>
<li>✅ Tôi đã chia nó thành các mốc hàng tuần/hai tuần.</li>
<li>✅ Tôi có một đối tác trách nhiệm.</li>
<li>✅ Tôi đã viết mục tiêu của mình trong một tuyên bố đơn giản.</li>
<li>✅ Tôi có một hệ thống theo dõi (bảng hoặc ứng dụng).</li>
<li>✅ Đối tác trách nhiệm của tôi biết về kế hoạch.</li>
</ul>`,
    emailSubject: 'Năng suất 2026 – Ngày 12: Cấu trúc Trách nhiệm',
    emailBody: `<h1>Năng suất 2026 – Ngày 12</h1>
<h2>Cấu trúc Trách nhiệm: Các Hệ thống Giữ bạn trên Đường</h2>
<p><em>Tính minh bạch là sức mạnh. Trách nhiệm là kết quả.</em></p>
<p>Hôm nay bạn sẽ học cách xây dựng các hệ thống đảm bảo bạn đạt được mục tiêu. Trách nhiệm không phải là báo cáo cho ai đó - nó là công bố công khai ý định của bạn và theo dõi tiến độ một cách có hệ thống.</p>
<p><strong>Sự thật</strong>: Các mục tiêu được công bố công khai có xác suất 65% cao hơn để được thực hiện.</p>
<p><strong>Tiêu điểm hôm nay</strong>: Cam kết công khai, quan hệ đối tác và hệ thống theo dõi.</p>
<p><a href="{{APP_URL}}/vi/courses/${COURSE_ID_BASE}_VI/day/12">Mở bài học →</a></p>`
  },
  id: {
    title: 'Struktur Akuntabilitas: Sistem yang Membuat Anda Tetap di Jalur',
    content: `<h1>Struktur Akuntabilitas: Sistem yang Membuat Anda Tetap di Jalur</h1>
<p><em>Transparansi adalah kekuatan. Akuntabilitas adalah hasil.</em></p>
<hr />
<h2>Tujuan Pembelajaran</h2>
<ul>
<li>Memahami bagaimana akuntabilitas bekerja dalam produktivitas.</li>
<li>Tentukan tujuan publik dan tonggak penting.</li>
<li>Pilih mitra akuntabilitas dan bangun sistem.</li>
<li>Buat sistem pelacakan untuk mengukur kemajuan.</li>
<li>Tangani tonggak yang terlewat secara konstruktif.</li>
</ul>
<hr />
<h2>Mengapa Ini Penting</h2>
<ul>
<li><strong>Kekuatan Transparansi</strong>: Tujuan yang diumumkan secara publik 65% lebih mungkin untuk dicapai.</li>
<li><strong>Komitmen Sadar</strong>: Ketika Anda tahu orang lain memantau, Anda tetap berkomitmen.</li>
<li><strong>Koreksi Sistematis</strong>: Sistem akuntabilitas menangkap masalah lebih awal.</li>
<li><strong>Peningkatan Ketekunan</strong>: Akuntabilitas mengurangi penundaan dan penolakan tugas.</li>
</ul>
<hr />
<h2>Penyelaman Mendalam</h2>
<h3>1. Penetapan Tujuan Publik</h3>
<ul>
<li>Tulis tujuan dengan jelas dan bagikan dengan setidaknya satu orang.</li>
<li>Sertakan tanggal akhir dan tonggak penting.</li>
<li>Penelitian: Tujuan yang diumumkan secara publik 65% lebih mungkin untuk dicapai.</li>
<li><strong>Teknik</strong>: Tulis pernyataan 1-2 kalimat: "Saya akan mencapai [TUJUAN] pada [TANGGAL] karena [ALASAN]."</li>
</ul>
<h3>2. Mitra Akuntabilitas</h3>
<ul>
<li>Pilih satu atau lebih orang yang akan secara teratur menanyakan tentang kemajuan Anda.</li>
<li>Mitra dapat berupa teman, mentor, atau kelompok terstruktur.</li>
<li><strong>Pertanyaan Mereka</strong>: "Apakah Anda mencapai tonggak penting minggu ini?"</li>
<li><strong>Frekuensi</strong>: Setidaknya sekali seminggu.</li>
</ul>
<h3>3. Sistem Pelacakan</h3>
<ul>
<li>Buat tabel dengan tonggak penting dan tanggal.</li>
<li>Perbarui setiap hari atau setiap minggu: Berapa % penyelesaian?</li>
<li>Alat: Spreadsheet, manajer proyek, atau jurnal kertas.</li>
<li><strong>Lacak secara spesifik</strong>: Metrik konkret (misalnya, "3 bab selesai", bukan "membuat kemajuan").</li>
</ul>
<h3>4. Menangani Tonggak yang Terlewat</h3>
<ul>
<li>Jika Anda melewatkan tonggak penting, jangan tinggalkan tujuan.</li>
<li>Tanya: "Apa penyebabnya? Apakah ada peristiwa yang tidak terduga?"</li>
<li>Lakukan retrospektif cepat 15 menit: pelajaran, rencana yang disesuaikan, coba lagi.</li>
<li><strong>Aturan Kunci</strong>: Jangan pernah meninggalkan tujuan; hanya sesuaikan rencana.</li>
</ul>
<h3>5. Akuntabilitas Kelompok</h3>
<ul>
<li>Check-in kelompok: Beberapa orang dengan tujuan bersama.</li>
<li>Pertemuan mingguan: Siapa yang mencapai tonggak penting, siapa yang tidak, dan mengapa.</li>
<li><strong>Dinamika</strong>: Tekanan kelompok dan dukungan menciptakan motivasi yang kuat.</li>
</ul>
<hr />
<h2>Latihan Praktis (45 menit)</h2>
<ol>
<li><strong>Tetapkan Tujuan</strong>: Pilih tujuan 4-8 minggu (sesuatu yang ingin Anda capai).</li>
<li><strong>Tonggak Penting</strong>: Pecahkan menjadi tonggak penting mingguan atau dua mingguan (konkret, terukur).</li>
<li><strong>Pilih Mitra</strong>: Mintalah teman atau mentor untuk menjadi mitra akuntabilitas Anda.</li>
<li><strong>Tulis Pernyataan</strong>: "Saya akan mencapai [TUJUAN] pada [TANGGAL] karena [ALASAN]."</li>
<li><strong>Buat Tabel Pelacakan</strong>: Buat tabel sederhana untuk melacak kemajuan mingguan.</li>
<li><strong>Bagikan</strong>: Kirim pesan ke mitra Anda untuk memulai hubungan akuntabilitas.</li>
</ol>
<hr />
<h2>Pemeriksaan Diri</h2>
<ul>
<li>✅ Saya memiliki tujuan 4-8 minggu yang jelas untuk akuntabilitas.</li>
<li>✅ Saya telah memecahnya menjadi tonggak penting mingguan/dua mingguan.</li>
<li>✅ Saya memiliki mitra akuntabilitas.</li>
<li>✅ Saya telah menulis tujuan saya dalam pernyataan sederhana.</li>
<li>✅ Saya memiliki sistem pelacakan (tabel atau aplikasi).</li>
<li>✅ Mitra akuntabilitas saya tahu tentang rencana ini.</li>
</ul>`,
    emailSubject: 'Produktivitas 2026 – Hari 12: Struktur Akuntabilitas',
    emailBody: `<h1>Produktivitas 2026 – Hari 12</h1>
<h2>Struktur Akuntabilitas: Sistem yang Membuat Anda Tetap di Jalur</h2>
<p><em>Transparansi adalah kekuatan. Akuntabilitas adalah hasil.</em></p>
<p>Hari ini Anda akan belajar membangun sistem yang memastikan Anda mencapai tujuan. Akuntabilitas bukan tentang melaporkan kepada seseorang - ini tentang menyatakan niat Anda secara publik dan melacak kemajuan secara sistematis.</p>
<p><strong>Faktanya</strong>: Tujuan yang diumumkan secara publik 65% lebih mungkin untuk dicapai.</p>
<p><strong>Fokus hari ini</strong>: Komitmen publik, kemitraan, dan sistem pelacakan.</p>
<p><a href="{{APP_URL}}/id/courses/${COURSE_ID_BASE}_ID/day/12">Buka pelajaran →</a></p>`
  },
  ar: {
    title: 'هياكل المساءلة: الأنظمة التي تبقيك على المسار الصحيح',
    content: `<h1>هياكل المساءلة: الأنظمة التي تبقيك على المسار الصحيح</h1>
<p><em>الشفافية هي القوة. المساءلة هي النتيجة.</em></p>
<hr />
<h2>أهداف التعلم</h2>
<ul>
<li>فهم كيف تعمل المساءلة في الإنتاجية.</li>
<li>تحديد الأهداف والمعالم العامة.</li>
<li>اختر شركاء المساءلة وبناء الأنظمة.</li>
<li>إنشاء أنظمة التتبع لقياس التقدم.</li>
<li>التعامل مع المعالم المفقودة بشكل بنّاء.</li>
</ul>
<hr />
<h2>لماذا هذا مهم</h2>
<ul>
<li><strong>قوة الشفافية</strong>: الأهداف المعلنة علنًا هي 65% أكثر احتمالاً للإنجاز.</li>
<li><strong>الالتزام الواعي</strong>: عندما تعرف أن الآخرين يراقبون، تبقى ملتزمًا.</li>
<li><strong>التصحيح المنهجي</strong>: أنظمة المساءلة تحتفظ بالمشاكل مبكرًا.</li>
<li><strong>زيادة المثابرة</strong>: تقلل المساءلة التأجيل والتخلي عن المهام.</li>
</ul>
<hr />
<h2>الغوص العميق</h2>
<h3>1. تحديد الأهداف العامة</h3>
<ul>
<li>اكتب الهدف بوضوح وشاركه مع شخص واحد على الأقل.</li>
<li>أضف التاريخ النهائي والمعالم.</li>
<li>البحث: الأهداف المعلنة علنًا هي 65% أكثر احتمالاً للإنجاز.</li>
<li><strong>التقنية</strong>: اكتب بيان 1-2 جملة: "سأحقق [الهدف] بحلول [التاريخ] لأن [السبب]."</li>
</ul>
<h3>2. شركاء المساءلة</h3>
<ul>
<li>اختر شخصًا أو أكثر سيسأل بانتظام عن تقدمك.</li>
<li>يمكن أن يكون الشريك صديقًا أو مستشارًا أو مجموعة منظمة.</li>
<li><strong>سؤالهم</strong>: "هل حققت معالم هذا الأسبوع؟"</li>
<li><strong>التكرار</strong>: مرة واحدة على الأقل في الأسبوع.</li>
</ul>
<h3>3. نظام التتبع</h3>
<ul>
<li>أنشئ جدولاً يحتوي على المعالم والتواريخ.</li>
<li>قم بالتحديث يوميًا أو أسبوعيًا: كم نسبة الإكمال؟</li>
<li>الأدوات: جدول بيانات أو مدير مشروع أو دفتر ملاحظات ورقي.</li>
<li><strong>تتبع محددة</strong>: مقاييس ملموسة (على سبيل المثال، "3 فصول مكتملة" وليس "تحرز تقدماً").</li>
</ul>
<h3>4. التعامل مع المعالم المفقودة</h3>
<ul>
<li>إذا فاتتك معلم، فلا تتخلى عن الهدف.</li>
<li>اسأل: "ما السبب؟ هل كان هناك حدث غير متوقع؟"</li>
<li>قم بعمل مراجعة سريعة لمدة 15 دقيقة: الدرس والخطة المعدلة والإعادة.</li>
<li><strong>القاعدة الرئيسية</strong>: لا تتخلى أبداً عن الهدف؛ فقط قم بتعديل الخطة.</li>
</ul>
<h3>5. المساءلة الجماعية</h3>
<ul>
<li>تسجيلات الدخول الجماعية: أشخاص متعددون بأهداف مشتركة.</li>
<li>اجتماع أسبوعي: من حقق المعالم، من لم يحقق وليس.</li>
<li><strong>الديناميكية</strong>: ضغط المجموعة والدعم يخلق دافعاً قوياً.</li>
</ul>
<hr />
<h2>تمرين عملي (45 دقيقة)</h2>
<ol>
<li><strong>حدد هدفاً</strong>: اختر هدفاً لمدة 4-8 أسابيع (شيء تريد تحقيقه).</li>
<li><strong>المعالم</strong>: قسمه إلى معالم أسبوعية أو ثنائية الأسبوع (محددة وقابلة للقياس).</li>
<li><strong>اختر شريكاً</strong>: اطلب من صديق أو مستشار أن يكون شريكك في المساءلة.</li>
<li><strong>اكتب بيان</strong>: "سأحقق [الهدف] بحلول [التاريخ] لأن [السبب]."</li>
<li><strong>أنشئ جدول التتبع</strong>: أنشئ جدولاً بسيطاً لتتبع التقدم الأسبوعي.</li>
<li><strong>شارك</strong>: أرسل رسالة إلى شريكك لبدء علاقة المساءلة.</li>
</ol>
<hr />
<h2>الفحص الذاتي</h2>
<ul>
<li>✅ لدي هدف واضح لمدة 4-8 أسابيع للمساءلة.</li>
<li>✅ لقد قسمته إلى معالم أسبوعية / ثنائية الأسبوع.</li>
<li>✅ لدي شريك المساءلة.</li>
<li>✅ لقد كتبت هدفي في بيان بسيط.</li>
<li>✅ لدي نظام تتبع (جدول أو تطبيق).</li>
<li>✅ شريك المساءلة الخاص بي يعرف عن الخطة.</li>
</ul>`,
    emailSubject: 'الإنتاجية 2026 – اليوم 12: هياكل المساءلة',
    emailBody: `<h1>الإنتاجية 2026 – اليوم 12</h1>
<h2>هياكل المساءلة: الأنظمة التي تبقيك على المسار الصحيح</h2>
<p><em>الشفافية هي القوة. المساءلة هي النتيجة.</em></p>
<p>اليوم ستتعلم كيفية بناء أنظمة تضمن تحقيقك لأهدافك. المساءلة ليست عن الإبلاغ عن شخص ما - بل تعلن علناً عن نيتك وتتبع التقدم بشكل منهجي.</p>
<p><strong>الحقيقة</strong>: الأهداف المعلنة علنًا هي 65% أكثر احتمالاً للإنجاز.</p>
<p><strong>تركيز اليوم</strong>: الالتزامات العامة والشراكات وأنظمة التتبع.</p>
<p><a href="{{APP_URL}}/ar/courses/${COURSE_ID_BASE}_AR/day/12">افتح الدرس →</a></p>`
  },
  pt: {
    title: 'Estruturas de Responsabilidade: Sistemas que o Mantêm na Pista',
    content: `<h1>Estruturas de Responsabilidade: Sistemas que o Mantêm na Pista</h1>
<p><em>Transparência é poder. Responsabilidade é resultado.</em></p>
<hr />
<h2>Objetivos de Aprendizado</h2>
<ul>
<li>Entender como a responsabilidade funciona na produtividade.</li>
<li>Definir objetivos públicos e marcos.</li>
<li>Selecione parceiros de responsabilidade e construa sistemas.</li>
<li>Criar sistemas de rastreamento para medir o progresso.</li>
<li>Lidar com marcos perdidos de forma construtiva.</li>
</ul>
<hr />
<h2>Por que isso é importante</h2>
<ul>
<li><strong>Poder da Transparência</strong>: Objetivos comunicados publicamente têm 65% mais probabilidade de serem alcançados.</li>
<li><strong>Compromisso Consciente</strong>: Quando você sabe que outros estão observando, você se mantém comprometido.</li>
<li><strong>Correção Sistemática</strong>: Os sistemas de responsabilidade capturam problemas no início.</li>
<li><strong>Aumento da Perseverança</strong>: A responsabilidade reduz o adiamento e o abandono de tarefas.</li>
</ul>
<hr />
<h2>Mergulho Profundo</h2>
<h3>1. Definição de Objetivos Públicos</h3>
<ul>
<li>Escreva um objetivo claramente e compartilhe com pelo menos uma pessoa.</li>
<li>Inclua a data final e marcos.</li>
<li>Pesquisa: Objetivos comunicados publicamente têm 65% mais probabilidade de serem alcançados.</li>
<li><strong>Técnica</strong>: Escreva uma declaração de 1-2 frases: "Vou alcançar [OBJETIVO] até [DATA] porque [RAZÃO]."</li>
</ul>
<h3>2. Parceiros de Responsabilidade</h3>
<ul>
<li>Escolha uma ou mais pessoas que perguntarão regularmente sobre seu progresso.</li>
<li>O parceiro pode ser um amigo, mentor ou grupo estruturado.</li>
<li><strong>Sua Pergunta</strong>: "Você atingiu os marcos desta semana?"</li>
<li><strong>Frequência</strong>: Pelo menos uma vez por semana.</li>
</ul>
<h3>3. Sistema de Rastreamento</h3>
<ul>
<li>Crie uma tabela com marcos e datas.</li>
<li>Atualize diariamente ou semanalmente: Qual é a % de conclusão?</li>
<li>Ferramentas: Planilha, gerenciador de projetos ou diário em papel.</li>
<li><strong>Rastreie especificamente</strong>: Métricas concretas (por exemplo, "3 capítulos concluídos", não "estou fazendo progresso").</li>
</ul>
<h3>4. Lidando com Marcos Perdidos</h3>
<ul>
<li>Se você perder um marco, não abandone o objetivo.</li>
<li>Pergunte: "O que causou isso? Houve um evento imprevisto?"</li>
<li>Faça uma retrospectiva rápida de 15 minutos: lição, plano ajustado, tente novamente.</li>
<li><strong>Regra Principal</strong>: Nunca abandone o objetivo; apenas ajuste o plano.</li>
</ul>
<h3>5. Responsabilidade em Grupo</h3>
<ul>
<li>Check-ins de grupo: Várias pessoas com objetivos compartilhados.</li>
<li>Reunião semanal: Quem atingiu marcos, quem não, e por quê.</li>
<li><strong>Dinâmica</strong>: Pressão e apoio de grupo criam forte motivação.</li>
</ul>
<hr />
<h2>Exercício Prático (45 minutos)</h2>
<ol>
<li><strong>Defina um Objetivo</strong>: Escolha um objetivo de 4-8 semanas (algo que você quer alcançar).</li>
<li><strong>Marcos</strong>: Divida em marcos semanais ou quinzenais (concretos, mensuráveis).</li>
<li><strong>Escolha um Parceiro</strong>: Peça a um amigo ou mentor para ser seu parceiro de responsabilidade.</li>
<li><strong>Escreva uma Declaração</strong>: "Vou alcançar [OBJETIVO] até [DATA] porque [RAZÃO]."</li>
<li><strong>Crie Tabela de Rastreamento</strong>: Faça uma tabela simples para rastrear o progresso semanal.</li>
<li><strong>Compartilhe</strong>: Envie uma mensagem ao seu parceiro para iniciar o relacionamento de responsabilidade.</li>
</ol>
<hr />
<h2>Autoavaliação</h2>
<ul>
<li>✅ Tenho um objetivo claro de 4-8 semanas para responsabilidade.</li>
<li>✅ Dividi em marcos semanais/quinzenais.</li>
<li>✅ Tenho um parceiro de responsabilidade.</li>
<li>✅ Escrevi meu objetivo em uma declaração simples.</li>
<li>✅ Tenho um sistema de rastreamento (tabela ou aplicativo).</li>
<li>✅ Meu parceiro de responsabilidade conhece o plano.</li>
</ul>`,
    emailSubject: 'Produtividade 2026 – Dia 12: Estruturas de Responsabilidade',
    emailBody: `<h1>Produtividade 2026 – Dia 12</h1>
<h2>Estruturas de Responsabilidade: Sistemas que o Mantêm na Pista</h2>
<p><em>Transparência é poder. Responsabilidade é resultado.</em></p>
<p>Hoje você aprenderá como construir sistemas que garantem que você alcance seus objetivos. Responsabilidade não é sobre relatar a alguém - é sobre declarar publicamente sua intenção e rastrear o progresso sistematicamente.</p>
<p><strong>O fato</strong>: Objetivos comunicados publicamente têm 65% mais probabilidade de serem alcançados.</p>
<p><strong>Foco de hoje</strong>: Compromissos públicos, parcerias e sistemas de rastreamento.</p>
<p><a href="{{APP_URL}}/pt/courses/${COURSE_ID_BASE}_PT/day/12">Abra a lição →</a></p>`
  },
  hi: {
    title: 'जवाबदेही संरचनाएं: सिस्टम जो आपको ट्रैक पर रखते हैं',
    content: `<h1>जवाबदेही संरचनाएं: सिस्टम जो आपको ट्रैक पर रखते हैं</h1>
<p><em>पारदर्शिता शक्ति है। जवाबदेही परिणाम है।</em></p>
<hr />
<h2>सीखने के उद्देश्य</h2>
<ul>
<li>समझें कि जवाबदेही उत्पादकता में कैसे काम करती है।</li>
<li>सार्वजनिक लक्ष्य और मील के पत्थर को परिभाषित करें।</li>
<li>जवाबदेही भागीदारों को चुनें और सिस्टम बनाएं।</li>
<li>प्रगति को मापने के लिए ट्रैकिंग सिस्टम बनाएं।</li>
<li>खोए हुए मील के पत्थर को रचनात्मक रूप से संभालें।</li>
</ul>
<hr />
<h2>यह महत्वपूर्ण क्यों है</h2>
<ul>
<li><strong>पारदर्शिता की शक्ति</strong>: सार्वजनिक रूप से संचार किए गए लक्ष्य 65% अधिक संभावना से प्राप्त होते हैं।</li>
<li><strong>सचेत प्रतिबद्धता</strong>: जब आप जानते हैं कि दूसरे देख रहे हैं, तो आप प्रतिबद्ध रहते हैं।</li>
<li><strong>व्यवस्थित सुधार</strong>: जवाबदेही प्रणाली समस्याओं को जल्दी पकड़ते हैं।</li>
<li><strong>दृढ़ता में वृद्धि</strong>: जवाबदेही विलंब और कार्य त्याग को कम करती है।</li>
</ul>
<hr />
<h2>गहरी गोताखोरी</h2>
<h3>1. सार्वजनिक लक्ष्य निर्धारण</h3>
<ul>
<li>एक लक्ष्य स्पष्ट रूप से लिखें और कम से कम एक व्यक्ति के साथ साझा करें।</li>
<li>अंतिम तिथि और मील के पत्थर शामिल करें।</li>
<li>अनुसंधान: सार्वजनिक रूप से संचार किए गए लक्ष्य 65% अधिक संभावना से प्राप्त होते हैं।</li>
<li><strong>तकनीक</strong>: 1-2 वाक्य की कथन लिखें: "मैं [लक्ष्य] को [तारीख] तक प्राप्त करूंगा क्योंकि [कारण]।"</li>
</ul>
<h3>2. जवाबदेही भागीदार</h3>
<ul>
<li>एक या अधिक लोगों को चुनें जो नियमित रूप से आपकी प्रगति के बारे में पूछेंगे।</li>
<li>भागीदार एक दोस्त, सलाहकार या संरचित समूह हो सकता है।</li>
<li><strong>उनका प्रश्न</strong>: "क्या आपने इस हफ्ते के मील के पत्थर को प्राप्त किया?"</li>
<li><strong>आवृत्ति</strong>: कम से कम सप्ताह में एक बार।</li>
</ul>
<h3>3. ट्रैकिंग सिस्टम</h3>
<ul>
<li>मील के पत्थर और तारीखों के साथ एक तालिका बनाएं।</li>
<li>दैनिक या साप्ताहिक अपडेट करें: समापन का% क्या है?</li>
<li>उपकरण: स्प्रेडशीट, प्रोजेक्ट मैनेजर, या कागज की डायरी।</li>
<li><strong>विशिष्ट रूप से ट्रैक करें</strong>: ठोस मेट्रिक्स (उदाहरण के लिए, "3 अध्याय पूर्ण", "प्रगति" नहीं)।</li>
</ul>
<h3>4. खोए हुए मील के पत्थर को संभालना</h3>
<ul>
<li>यदि आप एक मील का पत्थर खो दें, तो लक्ष्य को त्यागें नहीं।</li>
<li>पूछें: "इसका कारण क्या था? क्या कोई अप्रत्याशित घटना थी?"</li>
<li>एक त्वरित 15-मिनट की पूर्वदृष्टि करें: पाठ, समायोजित योजना, फिर से प्रयास करें।</li>
<li><strong>मुख्य नियम</strong>: कभी भी लक्ष्य को त्यागें नहीं; बस योजना को समायोजित करें।</li>
</ul>
<h3>5. समूह जवाबदेही</h3>
<ul>
<li>समूह चेक-इन: साझा लक्ष्यों के साथ कई लोग।</li>
<li>साप्ताहिक बैठक: कौन मील के पत्थर तक पहुँचे, कौन नहीं, और क्यों।</li>
<li><strong>गतिशीलता</strong>: समूह का दबाव और समर्थन मजबूत प्रेरणा बनाता है।</li>
</ul>
<hr />
<h2>व्यावहारिक व्यायाम (45 मिनट)</h2>
<ol>
<li><strong>लक्ष्य निर्धारण करें</strong>: 4-8 सप्ताह का लक्ष्य चुनें (कुछ आप हासिल करना चाहते हैं)।</li>
<li><strong>मील के पत्थर</strong>: साप्ताहिक या पाक्षिक मील के पत्थर में विभाजित करें (ठोस, मापने योग्य)।</li>
<li><strong>एक भागीदार चुनें</strong>: किसी दोस्त या सलाहकार से आपके जवाबदेही भागीदार बनने के लिए कहें।</li>
<li><strong>एक विवरण लिखें</strong>: "मैं [लक्ष्य] को [तारीख] तक प्राप्त करूंगा क्योंकि [कारण]।"</li>
<li><strong>ट्रैकिंग टेबल बनाएं</strong>: साप्ताहिक प्रगति को ट्रैक करने के लिए एक सरल तालिका बनाएं।</li>
<li><strong>साझा करें</strong>: जवाबदेही संबंध शुरू करने के लिए अपने भागीदार को एक संदेश भेजें।</li>
</ol>
<hr />
<h2>आत्म-जांच</h2>
<ul>
<li>✅ मेरे पास जवाबदेही के लिए एक स्पष्ट 4-8 सप्ताह का लक्ष्य है।</li>
<li>✅ मैंने इसे साप्ताहिक/पाक्षिक मील के पत्थर में विभाजित किया है।</li>
<li>✅ मेरा एक जवाबदेही भागीदार है।</li>
<li>✅ मैंने अपने लक्ष्य को एक सरल कथन में लिखा है।</li>
<li>✅ मेरे पास एक ट्रैकिंग सिस्टम है (तालिका या ऐप)।</li>
<li>✅ मेरा जवाबदेही भागीदार योजना के बारे में जानता है।</li>
</ul>`,
    emailSubject: 'उत्पादकता 2026 – दिन 12: जवाबदेही संरचनाएं',
    emailBody: `<h1>उत्पादकता 2026 – दिन 12</h1>
<h2>जवाबदेही संरचनाएं: सिस्टम जो आपको ट्रैक पर रखते हैं</h2>
<p><em>पारदर्शिता शक्ति है। जवाबदेही परिणाम है।</em></p>
<p>आज आप ऐसे सिस्टम बनाना सीखेंगे जो सुनिश्चित करते हैं कि आप अपने लक्ष्यों को हासिल करते हैं। जवाबदेही किसी को रिपोर्ट करने के बारे में नहीं है - यह अपने इरादे को सार्वजनिक रूप से घोषित करने और प्रगति को व्यवस्थित रूप से ट्रैक करने के बारे में है।</p>
<p><strong>तथ्य</strong>: सार्वजनिक रूप से संचार किए गए लक्ष्य 65% अधिक संभावना से प्राप्त होते हैं।</p>
<p><strong>आज का ध्यान</strong>: सार्वजनिक प्रतिबद्धताएं, साझेदारी और ट्रैकिंग सिस्टम।</p>
<p><a href="{{APP_URL}}/hi/courses/${COURSE_ID_BASE}_HI/day/12">पाठ खोलें →</a></p>`
  }
};

// QUIZ 12 - All 4 options, proper structure
const QUIZ_12: Record<string, any[]> = {
  hu: [
    {
      q: 'Mekkora a valószínűsége, hogy nyilvánosan közölt célok teljesülnek?',
      opts: ['25%-kal', '65%-kal', '45%-kal', '85%-kal'],
      correct: 1
    },
    {
      q: 'Mi a fő előnye az elszámoltathatósági partnershipnek?',
      opts: ['Semmilyen előnye', 'Fokozza a motivációt és a kitartást', 'Csökkenti az erőfeszítést', 'Felesleges kapcsolat'],
      correct: 1
    },
    {
      q: 'Milyen gyakran kell az elszámoltathatósági partnered felülvizsgálnia az előrehaladást?',
      opts: ['Havonta', 'Hetente', 'Napi szinten', 'Évente'],
      correct: 1
    },
    {
      q: 'Mit kell tenni, ha nem éred el a mérföldkövet?',
      opts: ['Feladd a célt', 'Retrospektív és módosított terv', 'Teljesen más célt válassz', 'Semmi nem kell tenni'],
      correct: 1
    },
    {
      q: 'Mi az a nyomon követési rendszer legfontosabb eleme?',
      opts: ['Színesség', 'Konkrét, mérhető feltételek', 'Hosszú írások', 'Személyes naptár'],
      correct: 1
    }
  ],
  en: [
    {
      q: 'What percentage of publicly stated goals are achieved?',
      opts: ['25%', '65%', '45%', '85%'],
      correct: 1
    },
    {
      q: 'What is the main benefit of an accountability partnership?',
      opts: ['None', 'It increases motivation and persistence', 'It decreases effort', 'It is unnecessary'],
      correct: 1
    },
    {
      q: 'How often should your accountability partner review your progress?',
      opts: ['Monthly', 'Weekly', 'Daily', 'Yearly'],
      correct: 1
    },
    {
      q: 'What should you do if you miss a milestone?',
      opts: ['Abandon the goal', 'Do a retrospective and adjust the plan', 'Choose a completely different goal', 'Do nothing'],
      correct: 1
    },
    {
      q: 'What is the most important element of a tracking system?',
      opts: ['Colors', 'Concrete, measurable conditions', 'Long writings', 'Personal calendar'],
      correct: 1
    }
  ],
  tr: [
    {
      q: 'Halka açık olarak belirtilen hedeflerin kaçı başarılı olur?',
      opts: ['%25', '%65', '%45', '%85'],
      correct: 1
    },
    {
      q: 'Bir muhasebeleştirme ortaklığının ana faydası nedir?',
      opts: ['Yok', 'Motivasyonu ve azmi artırır', 'Çabayı azaltır', 'Gereksizdir'],
      correct: 1
    },
    {
      q: 'Muhasebeleştirme ortağınız ilerlemenizi ne sıklıkta gözden geçirmelidir?',
      opts: ['Aylık', 'Haftalık', 'Günlük', 'Yıllık'],
      correct: 1
    },
    {
      q: 'Bir kilometre taşını kaçırırsanız ne yapmalısınız?',
      opts: ['Hedefi terk et', 'Retrospektif yap ve planı ayarla', 'Tamamen farklı bir hedef seç', 'Hiçbir şey yapma'],
      correct: 1
    },
    {
      q: 'Bir izleme sisteminin en önemli unsuru nedir?',
      opts: ['Renkler', 'Somut, ölçülebilir koşullar', 'Uzun yazılar', 'Kişisel takvim'],
      correct: 1
    }
  ],
  bg: [
    {
      q: 'Какъв процент от публично заявени цели се постигат?',
      opts: ['25%', '65%', '45%', '85%'],
      correct: 1
    },
    {
      q: 'Какво е основното предимство на партньорството на отчетност?',
      opts: ['Нито един', 'Увеличава мотивацията и упоритост', 'Намалява усилието', 'Това е ненужно'],
      correct: 1
    },
    {
      q: 'Колко често трябва партньорът на отчетност да преглежда напредъка?',
      opts: ['Месечно', 'Седмично', 'Дневно', 'Годишно'],
      correct: 1
    },
    {
      q: 'Какво трябва да направите, ако пропуснете веха?',
      opts: ['Напустете целта', 'Направете ретроспектива и коригирайте плана', 'Изберете напълно различна цел', 'Не правете нищо'],
      correct: 1
    },
    {
      q: 'Кой е най-важният елемент на система за проследяване?',
      opts: ['Цветове', 'Конкретни, измерими условия', 'Дълги писания', 'Личен календар'],
      correct: 1
    }
  ],
  pl: [
    {
      q: 'Jaki procent publicznie podanych celów zostaje osiągnięty?',
      opts: ['25%', '65%', '45%', '85%'],
      correct: 1
    },
    {
      q: 'Jaka jest główna korzyść z partnerstwa odpowiedzialności?',
      opts: ['Brak', 'Zwiększa motywację i wytrwałość', 'Zmniejsza wysiłek', 'To niepotrzebne'],
      correct: 1
    },
    {
      q: 'Jak często partner odpowiedzialności powinien przegląda postępy?',
      opts: ['Miesięcznie', 'Tygodniowo', 'Dziennie', 'Rocznie'],
      correct: 1
    },
    {
      q: 'Co powinieneś zrobić, jeśli pominiesz kamień milowy?',
      opts: ['Porzuć cel', 'Zrób retrospektywę i dostosuj plan', 'Wybierz zupełnie inny cel', 'Nic nie rób'],
      correct: 1
    },
    {
      q: 'Jaki jest najważniejszy element systemu śledzenia?',
      opts: ['Kolory', 'Konkretne, mierzalne warunki', 'Długie pisania', 'Osobisty kalendarz'],
      correct: 1
    }
  ],
  vi: [
    {
      q: 'Bao nhiêu phần trăm các mục tiêu được công bố công khai được đạt được?',
      opts: ['25%', '65%', '45%', '85%'],
      correct: 1
    },
    {
      q: 'Lợi ích chính của quan hệ đối tác trách nhiệm là gì?',
      opts: ['Không', 'Tăng động lực và sự kiên trì', 'Giảm nỗ lực', 'Nó không cần thiết'],
      correct: 1
    },
    {
      q: 'Đối tác trách nhiệm của bạn nên xem xét tiến độ thường xuyên bao nhiêu?',
      opts: ['Hàng tháng', 'Hàng tuần', 'Hàng ngày', 'Hàng năm'],
      correct: 1
    },
    {
      q: 'Bạn nên làm gì nếu bỏ lỡ một mốc?',
      opts: ['Từ bỏ mục tiêu', 'Thực hiện kiểm tra lại và điều chỉnh kế hoạch', 'Chọn mục tiêu hoàn toàn khác', 'Không làm gì'],
      correct: 1
    },
    {
      q: 'Phần tử quan trọng nhất của hệ thống theo dõi là gì?',
      opts: ['Màu sắc', 'Điều kiện cụ thể, có thể đo lường', 'Viết dài', 'Lịch cá nhân'],
      correct: 1
    }
  ],
  id: [
    {
      q: 'Berapa persentase tujuan yang diumumkan secara publik yang dicapai?',
      opts: ['25%', '65%', '45%', '85%'],
      correct: 1
    },
    {
      q: 'Apa manfaat utama dari kemitraan akuntabilitas?',
      opts: ['Tidak ada', 'Meningkatkan motivasi dan ketekunan', 'Mengurangi upaya', 'Itu tidak perlu'],
      correct: 1
    },
    {
      q: 'Seberapa sering mitra akuntabilitas Anda harus meninjau kemajuan?',
      opts: ['Bulanan', 'Mingguan', 'Harian', 'Tahunan'],
      correct: 1
    },
    {
      q: 'Apa yang harus Anda lakukan jika melewatkan tonggak?',
      opts: ['Tinggalkan tujuan', 'Lakukan retrospektif dan sesuaikan rencana', 'Pilih tujuan yang sama sekali berbeda', 'Tidak melakukan apa pun'],
      correct: 1
    },
    {
      q: 'Apa elemen terpenting dari sistem pelacakan?',
      opts: ['Warna', 'Kondisi konkret, terukur', 'Tulisan panjang', 'Kalender pribadi'],
      correct: 1
    }
  ],
  ar: [
    {
      q: 'ما نسبة الأهداف المعلنة علنًا التي تم تحقيقها؟',
      opts: ['25%', '65%', '45%', '85%'],
      correct: 1
    },
    {
      q: 'ما هي الفائدة الرئيسية لشراكة المساءلة؟',
      opts: ['لا شيء', 'تزيد الدافع والمثابرة', 'تقلل الجهد', 'غير ضروري'],
      correct: 1
    },
    {
      q: 'كم مرة يجب على شريك المساءلة الخاص بك أن يراجع التقدم؟',
      opts: ['شهريًا', 'أسبوعيًا', 'يوميًا', 'سنويًا'],
      correct: 1
    },
    {
      q: 'ماذا يجب أن تفعل إذا فاتتك معلم؟',
      opts: ['تخلى عن الهدف', 'قم بعمل استعراض وتعديل الخطة', 'اختر هدفاً مختلفاً تماماً', 'لا تفعل شيئا'],
      correct: 1
    },
    {
      q: 'ما أهم عنصر في نظام التتبع؟',
      opts: ['الألوان', 'شروط ملموسة وقابلة للقياس', 'كتابات طويلة', 'تقويم شخصي'],
      correct: 1
    }
  ],
  pt: [
    {
      q: 'Que porcentagem de objetivos comunicados publicamente é alcançada?',
      opts: ['25%', '65%', '45%', '85%'],
      correct: 1
    },
    {
      q: 'Qual é o principal benefício de uma parceria de responsabilidade?',
      opts: ['Nenhum', 'Aumenta motivação e perseverança', 'Reduz o esforço', 'É desnecessário'],
      correct: 1
    },
    {
      q: 'Com que frequência seu parceiro de responsabilidade deve revisar o progresso?',
      opts: ['Mensalmente', 'Semanalmente', 'Diariamente', 'Anualmente'],
      correct: 1
    },
    {
      q: 'O que você deve fazer se perder um marco?',
      opts: ['Abandone o objetivo', 'Faça uma retrospectiva e ajuste o plano', 'Escolha um objetivo completamente diferente', 'Não faça nada'],
      correct: 1
    },
    {
      q: 'Qual é o elemento mais importante de um sistema de rastreamento?',
      opts: ['Cores', 'Condições concretas, mensuráveis', 'Escritos longos', 'Calendário pessoal'],
      correct: 1
    }
  ],
  hi: [
    {
      q: 'सार्वजनिक रूप से संचार किए गए लक्ष्यों का कितना प्रतिशत प्राप्त होता है?',
      opts: ['25%', '65%', '45%', '85%'],
      correct: 1
    },
    {
      q: 'जवाबदेही साझेदारी का मुख्य लाभ क्या है?',
      opts: ['कोई नहीं', 'प्रेरणा और दृढ़ता बढ़ाता है', 'प्रयास कम करता है', 'यह अनावश्यक है'],
      correct: 1
    },
    {
      q: 'आपके जवाबदेही भागीदार को प्रगति की समीक्षा कितनी बार करनी चाहिए?',
      opts: ['मासिक', 'साप्ताहिक', 'दैनिक', 'वार्षिक'],
      correct: 1
    },
    {
      q: 'यदि आप एक मील का पत्थर खो दें तो आपको क्या करना चाहिए?',
      opts: ['लक्ष्य को त्यागें', 'एक पूर्वदृष्टि करें और योजना को समायोजित करें', 'एक पूरी तरह से अलग लक्ष्य चुनें', 'कुछ मत करो'],
      correct: 1
    },
    {
      q: 'ट्रैकिंग सिस्टम का सबसे महत्वपूर्ण तत्व क्या है?',
      opts: ['रंग', 'ठोस, मापने योग्य स्थितियां', 'लंबी लिखिखिन', 'व्यक्तिगत कैलेंडर'],
      correct: 1
    }
  ]
};

async function seedDay12() {
  await connectDB();
  console.log('🌱 Day 12: Accountability Structures – Seeding with quality multilingual content...\n');

  let successCount = 0;
  let failureCount = 0;

  for (const [lang1, lang2] of LANGUAGE_PAIRS) {
    console.log(`🌍 Batch: ${lang1.toUpperCase()} + ${lang2.toUpperCase()}`);

    for (const lang of [lang1, lang2]) {
      try {
        const course = await Course.findOne({ courseId: `${COURSE_ID_BASE}_${lang.toUpperCase()}` });
        if (!course) {
          console.log(`  ⚠️  ${lang.toUpperCase()}: Course not found`);
          continue;
        }

        // Check if lesson already exists (avoid duplicates)
        const existingLesson = await Lesson.findOne({
          lessonId: `${COURSE_ID_BASE}_${lang.toUpperCase()}_DAY_12`
        });
        if (existingLesson) {
          // Delete existing quiz for this lesson before recreating
          await QuizQuestion.deleteMany({ lessonId: existingLesson.lessonId });
          await Lesson.deleteOne({ _id: existingLesson._id });
        }

        const dayData = LESSON_12[lang];
        const lesson = new Lesson({
          lessonId: `${COURSE_ID_BASE}_${lang.toUpperCase()}_DAY_12`,
          courseId: course._id,
          dayNumber: 12,
          title: dayData.title,
          content: dayData.content,
          emailSubject: dayData.emailSubject,
          emailBody: dayData.emailBody.replace(
            /\{\{APP_URL\}\}/g,
            process.env.NEXTAUTH_URL || 'https://www.amanoba.com'
          )
        });

        await lesson.save();

        // Create quiz questions for this lesson
        const quizData = QUIZ_12[lang] || QUIZ_12['en']; // Fallback to English if lang not found
        for (const qData of quizData) {
          const q = new QuizQuestion({
            lessonId: lesson.lessonId,
            question: qData.q,
            options: qData.opts,
            correctIndex: qData.correct,
            difficulty: QuestionDifficulty.MEDIUM,
            category: 'Course Specific',
            isCourseSpecific: true,
            metadata: {
              createdAt: new Date(),
              updatedAt: new Date()
            }
          });
          await q.save();
        }

        console.log(`  ✅ ${lang.toUpperCase()}: Lesson created + 5 quiz questions`);
        successCount++;
      } catch (error) {
        console.error(`  ❌ ${lang.toUpperCase()}: ${error.message}`);
        failureCount++;
      }
    }
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✅ Day 12 Complete:`);
  console.log(`   Languages Seeded: ${successCount}/10`);
  if (failureCount > 0) console.log(`   Failures: ${failureCount}`);
  console.log(`   Total Quiz Questions: ${successCount * 5}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  process.exit(failureCount > 0 ? 1 : 0);
}

seedDay12().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
