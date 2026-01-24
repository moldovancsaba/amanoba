/**
 * Seed Productivity 2026 Course - Lesson 6 (Day 6)
 * 
 * Day 6: Capture: inboxes, triggers list, capture habits
 * 
 * Creates lesson 6 for all 10 languages in 2-language batches
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

// Lesson 6 Content: Capture: inboxes, triggers list, capture habits
const LESSON_6: Record<string, {
  title: string;
  content: string;
  emailSubject: string;
  emailBody: string;
}> = {
  hu: {
    title: 'Rögzítés: inboxok, trigger lista, rögzítési szokások',
    content: `<h1>Rögzítés: inboxok, trigger lista, rögzítési szokások</h1>
<p><em>Az első lépés a GTD-ben: mindent rögzíts, semmit ne felejts el</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
<li>Megérteni a rögzítés fontosságát: ha nincs rögzítve, nincs kezelve.</li>
<li>Létrehozni egy megbízható inbox rendszert.</li>
<li>Kialakítani rögzítési szokásokat, amelyek automatikussá válnak.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
<li><strong>Inboxok</strong>: Minden bejövő információ egy helyre kerüljön (email, feladatok, jegyzetek, eszmék).</li>
<li><strong>Trigger lista</strong>: Egy lista, amely segít emlékezni, mit kell rögzíteni (meetingek után, telefon után, stb.).</li>
<li><strong>Rögzítési szokások</strong>: Automatikus viselkedés, hogy minden fontos információ rögzítve legyen.</li>
<li>Ha nincs rögzítve, elveszik. Ha elveszik, nem lehet kezelni.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Inboxok</h3>
<p><strong>Definíció</strong>: Egy hely, ahol minden bejövő információ összegyűlik, mielőtt feldolgoznád. Például: email inbox, fizikai inbox, jegyzet app, feladatlista.</p>
<p><strong>Szabály</strong>: Minden inboxot naponta legalább egyszer üríts ki. Üres inbox = tiszta fej.</p>
<p><strong>Példa</strong>: Email inbox, fizikai postaláda, jegyzet app (Notion, Evernote), feladatlista (Todoist, Asana).</p>

<h3>Trigger lista</h3>
<p><strong>Definíció</strong>: Egy lista, amely emlékeztet, mikor és mit kell rögzíteni. Például: "Meeting után: action items rögzítése", "Telefon után: következő lépések rögzítése".</p>
<p><strong>Használat</strong>: Tartsd kéznél, és használd, amikor valami eszedbe jut, amit rögzíteni kellene.</p>

<h3>Rögzítési szokások</h3>
<p><strong>Definíció</strong>: Automatikus viselkedés, hogy minden fontos információ rögzítve legyen. Például: "Meeting után azonnal rögzítem az action itemeket", "Telefon után azonnal rögzítem a következő lépéseket."</p>
<p><strong>Kialakítás</strong>: Ismételd, amíg automatikussá nem válik. Kezdj egyszerűen: egy trigger, egy inbox.</p>
<hr />
<h2>Gyakorlati feladat (20-25 perc) — Rögzítési rendszer létrehozása</h2>
<ol>
<li><strong>Inboxok azonosítása</strong>: Írd le, milyen inboxjaid vannak (email, fizikai, jegyzet app, stb.).</li>
<li><strong>Trigger lista létrehozása</strong>: Írd le 5-10 helyzetet, amikor rögzíteni kell (meeting után, telefon után, olvasás közben, stb.).</li>
<li><strong>Rögzítési szokás kialakítása</strong>: Válassz egy triggert, és alakíts ki rá egy szokást. Például: "Meeting után azonnal rögzítem az action itemeket az inboxomba."</li>
<li><strong>Gyakorlás</strong>: Egy hétig gyakorold a rögzítést minden trigger után, és dokumentáld a tapasztalataidat.</li>
</ol>
<hr />
<h2>Önellenőrzés</h2>
<ul>
<li>✅ Van egy megbízható inbox rendszered.</li>
<li>✅ Van egy trigger listád, amely emlékeztet, mikor rögzíteni kell.</li>
<li>✅ Van legalább egy rögzítési szokásod, amely automatikussá vált.</li>
<li>✅ Minden fontos információ rögzítve van, nem veszik el.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
<li>David Allen: "Getting Things Done" — a rögzítésről és az inboxokról</li>
<li>Tiago Forte: "Building a Second Brain" — a jegyzet rendszerekről</li>
</ul>`,
    emailSubject: 'Termelékenység 2026 – 6. nap: Rögzítés',
    emailBody: `<h1>Termelékenység 2026 – 6. nap</h1>
<h2>Rögzítés: inboxok, trigger lista, rögzítési szokások</h2>
<p>Ma megtanulod, hogyan rögzíts minden fontos információt, hogy semmi ne vesszen el.</p>
<p><a href="{{APP_URL}}/hu/courses/${COURSE_ID_BASE}_HU/day/6">Nyisd meg a leckét →</a></p>`
  },
  en: {
    title: 'Capture: inboxes, triggers list, capture habits',
    content: `<h1>Capture: inboxes, triggers list, capture habits</h1>
<p><em>Step one in GTD: capture everything, forget nothing</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Understand the importance of capture: if it's not captured, it's not managed.</li>
<li>Create a reliable inbox system.</li>
<li>Develop capture habits that become automatic.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li><strong>Inboxes</strong>: All incoming information goes to one place (email, tasks, notes, ideas).</li>
<li><strong>Triggers list</strong>: A list that helps you remember what to capture (after meetings, after calls, etc.).</li>
<li><strong>Capture habits</strong>: Automatic behavior to ensure all important information is captured.</li>
<li>If it's not captured, it's lost. If it's lost, it can't be managed.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Inboxes</h3>
<p><strong>Definition</strong>: A place where all incoming information collects before you process it. For example: email inbox, physical inbox, note app, task list.</p>
<p><strong>Rule</strong>: Empty every inbox at least once daily. Empty inbox = clear mind.</p>
<p><strong>Example</strong>: Email inbox, physical mailbox, note app (Notion, Evernote), task list (Todoist, Asana).</p>

<h3>Triggers List</h3>
<p><strong>Definition</strong>: A list that reminds you when and what to capture. For example: "After meeting: capture action items", "After call: capture next steps".</p>
<p><strong>Usage</strong>: Keep it handy and use it when something comes to mind that should be captured.</p>

<h3>Capture Habits</h3>
<p><strong>Definition</strong>: Automatic behavior to ensure all important information is captured. For example: "After meeting, I immediately capture action items", "After call, I immediately capture next steps."</p>
<p><strong>Development</strong>: Repeat until it becomes automatic. Start simple: one trigger, one inbox.</p>
<hr />
<h2>Practical exercise (20-25 min) — Creating a capture system</h2>
<ol>
<li><strong>Identify inboxes</strong>: Write down what inboxes you have (email, physical, note app, etc.).</li>
<li><strong>Create triggers list</strong>: Write down 5-10 situations when you need to capture (after meeting, after call, while reading, etc.).</li>
<li><strong>Develop capture habit</strong>: Choose one trigger and develop a habit for it. For example: "After meeting, I immediately capture action items in my inbox."</li>
<li><strong>Practice</strong>: Practice capturing after every trigger for a week, and document your experiences.</li>
</ol>
<hr />
<h2>Self-check</h2>
<ul>
<li>✅ You have a reliable inbox system.</li>
<li>✅ You have a triggers list that reminds you when to capture.</li>
<li>✅ You have at least one capture habit that has become automatic.</li>
<li>✅ All important information is captured, nothing is lost.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>David Allen: "Getting Things Done" — about capture and inboxes</li>
<li>Tiago Forte: "Building a Second Brain" — about note systems</li>
</ul>`,
    emailSubject: 'Productivity 2026 – Day 6: Capture',
    emailBody: `<h1>Productivity 2026 – Day 6</h1>
<h2>Capture: inboxes, triggers list, capture habits</h2>
<p>Today you'll learn how to capture all important information so nothing gets lost.</p>
<p><a href="{{APP_URL}}/en/courses/${COURSE_ID_BASE}_EN/day/6">Open the lesson →</a></p>`
  },
  tr: {
    title: 'Yakalama: gelen kutuları, tetikleyici listesi, yakalama alışkanlıkları',
    content: `<h1>Yakalama: gelen kutuları, tetikleyici listesi, yakalama alışkanlıkları</h1>
<p><em>GTD'de ilk adım: her şeyi yakala, hiçbir şeyi unutma</em></p>
<hr />
<h2>Öğrenme hedefi</h2>
<ul>
<li>Yakalamanın önemini anlamak: yakalanmazsa, yönetilmez.</li>
<li>Güvenilir bir gelen kutusu sistemi oluşturmak.</li>
<li>Otomatik hale gelen yakalama alışkanlıkları geliştirmek.</li>
</ul>
<hr />
<h2>Neden önemli</h2>
<ul>
<li><strong>Gelen kutuları</strong>: Tüm gelen bilgiler bir yere gider (e-posta, görevler, notlar, fikirler).</li>
<li><strong>Tetikleyici listesi</strong>: Ne zaman ne yakalamanız gerektiğini hatırlatan bir liste (toplantılardan sonra, aramalardan sonra, vb.).</li>
<li><strong>Yakalama alışkanlıkları</strong>: Tüm önemli bilgilerin yakalandığından emin olmak için otomatik davranış.</li>
<li>Yakalanmazsa kaybolur. Kaybolursa yönetilemez.</li>
</ul>
<hr />
<h2>Açıklama</h2>
<h3>Gelen Kutuları</h3>
<p><strong>Tanım</strong>: İşlemeden önce tüm gelen bilgilerin toplandığı bir yer. Örneğin: e-posta gelen kutusu, fiziksel gelen kutusu, not uygulaması, görev listesi.</p>
<p><strong>Kural</strong>: Her gelen kutuyu günde en az bir kez boşaltın. Boş gelen kutusu = temiz zihin.</p>
<p><strong>Örnek</strong>: E-posta gelen kutusu, fiziksel posta kutusu, not uygulaması (Notion, Evernote), görev listesi (Todoist, Asana).</p>

<h3>Tetikleyici Listesi</h3>
<p><strong>Tanım</strong>: Ne zaman ve ne yakalamanız gerektiğini hatırlatan bir liste. Örneğin: "Toplantıdan sonra: aksiyon öğelerini yakala", "Aramadan sonra: sonraki adımları yakala".</p>
<p><strong>Kullanım</strong>: El altında tutun ve yakalanması gereken bir şey aklınıza geldiğinde kullanın.</p>

<h3>Yakalama Alışkanlıkları</h3>
<p><strong>Tanım</strong>: Tüm önemli bilgilerin yakalandığından emin olmak için otomatik davranış. Örneğin: "Toplantıdan sonra hemen aksiyon öğelerini yakalıyorum", "Aramadan sonra hemen sonraki adımları yakalıyorum."</p>
<p><strong>Geliştirme</strong>: Otomatik hale gelene kadar tekrarlayın. Basit başlayın: bir tetikleyici, bir gelen kutusu.</p>
<hr />
<h2>Pratik alıştırma (20-25 dakika) — Yakalama sistemi oluşturma</h2>
<ol>
<li><strong>Gelen kutularını belirleme</strong>: Hangi gelen kutularınız olduğunu yazın (e-posta, fiziksel, not uygulaması, vb.).</li>
<li><strong>Tetikleyici listesi oluşturma</strong>: Yakalamanız gereken 5-10 durumu yazın (toplantıdan sonra, aramadan sonra, okurken, vb.).</li>
<li><strong>Yakalama alışkanlığı geliştirme</strong>: Bir tetikleyici seçin ve bunun için bir alışkanlık geliştirin. Örneğin: "Toplantıdan sonra hemen aksiyon öğelerini gelen kutuma yakalıyorum."</li>
<li><strong>Uygulama</strong>: Bir hafta boyunca her tetikleyiciden sonra yakalamayı uygulayın ve deneyimlerinizi belgeleyin.</li>
</ol>
<hr />
<h2>Kendi kendini kontrol</h2>
<ul>
<li>✅ Güvenilir bir gelen kutusu sisteminiz var.</li>
<li>✅ Ne zaman yakalamanız gerektiğini hatırlatan bir tetikleyici listeniz var.</li>
<li>✅ Otomatik hale gelen en az bir yakalama alışkanlığınız var.</li>
<li>✅ Tüm önemli bilgiler yakalanmış, hiçbir şey kaybolmamış.</li>
</ul>
<hr />
<h2>İsteğe bağlı derinleştirme</h2>
<ul>
<li>David Allen: "Getting Things Done" — yakalama ve gelen kutuları hakkında</li>
<li>Tiago Forte: "Building a Second Brain" — not sistemleri hakkında</li>
</ul>`,
    emailSubject: 'Verimlilik 2026 – 6. Gün: Yakalama',
    emailBody: `<h1>Verimlilik 2026 – 6. Gün</h1>
<h2>Yakalama: gelen kutuları, tetikleyici listesi, yakalama alışkanlıkları</h2>
<p>Bugün tüm önemli bilgileri nasıl yakalayacağınızı öğreneceksiniz, böylece hiçbir şey kaybolmaz.</p>
<p><a href="{{APP_URL}}/tr/courses/${COURSE_ID_BASE}_TR/day/6">Dersi aç →</a></p>`
  },
  bg: {
    title: 'Улавяне: входящи кутии, списък с тригери, навици за улавяне',
    content: `<h1>Улавяне: входящи кутии, списък с тригери, навици за улавяне</h1>
<p><em>Стъпка едно в GTD: улови всичко, не забравяй нищо</em></p>
<hr />
<h2>Учебна цел</h2>
<ul>
<li>Да разберете важността на улавянето: ако не е уловено, не се управлява.</li>
<li>Да създадете надеждна система за входящи кутии.</li>
<li>Да развиете навици за улавяне, които стават автоматични.</li>
</ul>
<hr />
<h2>Защо е важно</h2>
<ul>
<li><strong>Входящи кутии</strong>: Цялата входяща информация отива на едно място (имейл, задачи, бележки, идеи).</li>
<li><strong>Списък с тригери</strong>: Списък, който ви помага да запомните какво да уловите (след срещи, след обаждания и т.н.).</li>
<li><strong>Навици за улавяне</strong>: Автоматично поведение, за да се гарантира, че цялата важна информация е уловена.</li>
<li>Ако не е уловено, е изгубено. Ако е изгубено, не може да се управлява.</li>
</ul>
<hr />
<h2>Обяснение</h2>
<h3>Входящи кутии</h3>
<p><strong>Дефиниция</strong>: Място, където цялата входяща информация се събира, преди да я обработите. Например: имейл входяща кутия, физическа входяща кутия, приложение за бележки, списък със задачи.</p>
<p><strong>Правило</strong>: Изпразнете всяка входяща кутия поне веднъж дневно. Празна входяща кутия = ясен ум.</p>
<p><strong>Пример</strong>: Имейл входяща кутия, физическа пощенска кутия, приложение за бележки (Notion, Evernote), списък със задачи (Todoist, Asana).</p>

<h3>Списък с тригери</h3>
<p><strong>Дефиниция</strong>: Списък, който ви напомня кога и какво да уловите. Например: "След среща: уловете елементи за действие", "След обаждане: уловете следващите стъпки".</p>
<p><strong>Използване</strong>: Дръжте го под ръка и го използвайте, когато нещо ви хрумне, което трябва да бъде уловено.</p>

<h3>Навици за улавяне</h3>
<p><strong>Дефиниция</strong>: Автоматично поведение, за да се гарантира, че цялата важна информация е уловена. Например: "След среща веднага улавям елементите за действие", "След обаждане веднага улавям следващите стъпки."</p>
<p><strong>Развитие</strong>: Повтаряйте, докато не стане автоматично. Започнете просто: един тригер, една входяща кутия.</p>
<hr />
<h2>Практическо упражнение (20-25 мин) — Създаване на система за улавяне</h2>
<ol>
<li><strong>Идентифициране на входящи кутии</strong>: Напишете какви входящи кутии имате (имейл, физическа, приложение за бележки и т.н.).</li>
<li><strong>Създаване на списък с тригери</strong>: Напишете 5-10 ситуации, когато трябва да уловите (след среща, след обаждане, докато четете и т.н.).</li>
<li><strong>Развиване на навик за улавяне</strong>: Изберете един тригер и развийте навик за него. Например: "След среща веднага улавям елементите за действие във входящата си кутия."</li>
<li><strong>Практикуване</strong>: Практикувайте улавяне след всеки тригер за една седмица и документирайте опита си.</li>
</ol>
<hr />
<h2>Самопроверка</h2>
<ul>
<li>✅ Имате надеждна система за входящи кутии.</li>
<li>✅ Имате списък с тригери, който ви напомня кога да уловите.</li>
<li>✅ Имате поне един навик за улавяне, който е станал автоматичен.</li>
<li>✅ Цялата важна информация е уловена, нищо не е изгубено.</li>
</ul>
<hr />
<h2>Опционално задълбочаване</h2>
<ul>
<li>Дейвид Алън: "Getting Things Done" — за улавяне и входящи кутии</li>
<li>Tiago Forte: "Building a Second Brain" — за системи за бележки</li>
</ul>`,
    emailSubject: 'Продуктивност 2026 – Ден 6: Улавяне',
    emailBody: `<h1>Продуктивност 2026 – Ден 6</h1>
<h2>Улавяне: входящи кутии, списък с тригери, навици за улавяне</h2>
<p>Днес ще научите как да уловите цялата важна информация, за да не се изгуби нищо.</p>
<p><a href="{{APP_URL}}/bg/courses/${COURSE_ID_BASE}_BG/day/6">Отворете урока →</a></p>`
  },
  pl: {
    title: 'Przechwytywanie: skrzynki odbiorcze, lista wyzwalaczy, nawyki przechwytywania',
    content: `<h1>Przechwytywanie: skrzynki odbiorcze, lista wyzwalaczy, nawyki przechwytywania</h1>
<p><em>Krok pierwszy w GTD: przechwytuj wszystko, nie zapominaj niczego</em></p>
<hr />
<h2>Cel uczenia się</h2>
<ul>
<li>Zrozumieć znaczenie przechwytywania: jeśli nie jest przechwycone, nie jest zarządzane.</li>
<li>Stworzyć niezawodny system skrzynek odbiorczych.</li>
<li>Rozwinąć nawyki przechwytywania, które stają się automatyczne.</li>
</ul>
<hr />
<h2>Dlaczego to ważne</h2>
<ul>
<li><strong>Skrzynki odbiorcze</strong>: Wszystkie przychodzące informacje trafiają w jedno miejsce (e-mail, zadania, notatki, pomysły).</li>
<li><strong>Lista wyzwalaczy</strong>: Lista, która pomaga pamiętać, co przechwycić (po spotkaniach, po rozmowach itp.).</li>
<li><strong>Nawyki przechwytywania</strong>: Automatyczne zachowanie, aby zapewnić przechwycenie wszystkich ważnych informacji.</li>
<li>Jeśli nie jest przechwycone, jest utracone. Jeśli jest utracone, nie może być zarządzane.</li>
</ul>
<hr />
<h2>Wyjaśnienie</h2>
<h3>Skrzynki odbiorcze</h3>
<p><strong>Definicja</strong>: Miejsce, gdzie wszystkie przychodzące informacje zbierają się, zanim je przetworzysz. Na przykład: skrzynka e-mail, fizyczna skrzynka, aplikacja do notatek, lista zadań.</p>
<p><strong>Zasada</strong>: Opróżniaj każdą skrzynkę odbiorczą przynajmniej raz dziennie. Pusta skrzynka = czysty umysł.</p>
<p><strong>Przykład</strong>: Skrzynka e-mail, fizyczna skrzynka pocztowa, aplikacja do notatek (Notion, Evernote), lista zadań (Todoist, Asana).</p>

<h3>Lista wyzwalaczy</h3>
<p><strong>Definicja</strong>: Lista, która przypomina, kiedy i co przechwycić. Na przykład: "Po spotkaniu: przechwytuj elementy akcji", "Po rozmowie: przechwytuj następne kroki".</p>
<p><strong>Użycie</strong>: Trzymaj ją pod ręką i używaj, gdy coś przyjdzie ci do głowy, co powinno być przechwycone.</p>

<h3>Nawyki przechwytywania</h3>
<p><strong>Definicja</strong>: Automatyczne zachowanie, aby zapewnić przechwycenie wszystkich ważnych informacji. Na przykład: "Po spotkaniu natychmiast przechwytuję elementy akcji", "Po rozmowie natychmiast przechwytuję następne kroki."</p>
<p><strong>Rozwój</strong>: Powtarzaj, aż stanie się automatyczne. Zacznij prosto: jeden wyzwalacz, jedna skrzynka.</p>
<hr />
<h2>Praktyczne ćwiczenie (20-25 min) — Tworzenie systemu przechwytywania</h2>
<ol>
<li><strong>Identyfikacja skrzynek</strong>: Zapisz, jakie skrzynki odbiorcze masz (e-mail, fizyczna, aplikacja do notatek itp.).</li>
<li><strong>Tworzenie listy wyzwalaczy</strong>: Zapisz 5-10 sytuacji, kiedy musisz przechwycić (po spotkaniu, po rozmowie, podczas czytania itp.).</li>
<li><strong>Rozwijanie nawyku przechwytywania</strong>: Wybierz jeden wyzwalacz i rozwijaj nawyk dla niego. Na przykład: "Po spotkaniu natychmiast przechwytuję elementy akcji w mojej skrzynce."</li>
<li><strong>Praktyka</strong>: Ćwicz przechwytywanie po każdym wyzwalaczu przez tydzień i dokumentuj swoje doświadczenia.</li>
</ol>
<hr />
<h2>Samosprawdzenie</h2>
<ul>
<li>✅ Masz niezawodny system skrzynek odbiorczych.</li>
<li>✅ Masz listę wyzwalaczy, która przypomina, kiedy przechwycić.</li>
<li>✅ Masz przynajmniej jeden nawyk przechwytywania, który stał się automatyczny.</li>
<li>✅ Wszystkie ważne informacje są przechwycone, nic nie jest utracone.</li>
</ul>
<hr />
<h2>Opcjonalne pogłębienie</h2>
<ul>
<li>David Allen: "Getting Things Done" — o przechwytywaniu i skrzynkach odbiorczych</li>
<li>Tiago Forte: "Building a Second Brain" — o systemach notatek</li>
</ul>`,
    emailSubject: 'Produktywność 2026 – Dzień 6: Przechwytywanie',
    emailBody: `<h1>Produktywność 2026 – Dzień 6</h1>
<h2>Przechwytywanie: skrzynki odbiorcze, lista wyzwalaczy, nawyki przechwytywania</h2>
<p>Dzisiaj nauczysz się, jak przechwytywać wszystkie ważne informacje, aby nic nie zostało utracone.</p>
<p><a href="{{APP_URL}}/pl/courses/${COURSE_ID_BASE}_PL/day/6">Otwórz lekcję →</a></p>`
  },
  vi: {
    title: 'Thu thập: hộp thư đến, danh sách kích hoạt, thói quen thu thập',
    content: `<h1>Thu thập: hộp thư đến, danh sách kích hoạt, thói quen thu thập</h1>
<p><em>Bước một trong GTD: thu thập mọi thứ, không quên gì</em></p>
<hr />
<h2>Mục tiêu học tập</h2>
<ul>
<li>Hiểu tầm quan trọng của việc thu thập: nếu không được thu thập, không được quản lý.</li>
<li>Tạo hệ thống hộp thư đến đáng tin cậy.</li>
<li>Phát triển thói quen thu thập trở nên tự động.</li>
</ul>
<hr />
<h2>Tại sao quan trọng</h2>
<ul>
<li><strong>Hộp thư đến</strong>: Tất cả thông tin đến đi vào một nơi (email, nhiệm vụ, ghi chú, ý tưởng).</li>
<li><strong>Danh sách kích hoạt</strong>: Danh sách giúp bạn nhớ khi nào cần thu thập (sau cuộc họp, sau cuộc gọi, v.v.).</li>
<li><strong>Thói quen thu thập</strong>: Hành vi tự động để đảm bảo tất cả thông tin quan trọng được thu thập.</li>
<li>Nếu không được thu thập, nó bị mất. Nếu bị mất, không thể quản lý.</li>
</ul>
<hr />
<h2>Giải thích</h2>
<h3>Hộp thư đến</h3>
<p><strong>Định nghĩa</strong>: Nơi tất cả thông tin đến được thu thập trước khi bạn xử lý. Ví dụ: hộp thư email, hộp thư vật lý, ứng dụng ghi chú, danh sách nhiệm vụ.</p>
<p><strong>Quy tắc</strong>: Làm trống mỗi hộp thư đến ít nhất một lần mỗi ngày. Hộp thư trống = tâm trí rõ ràng.</p>
<p><strong>Ví dụ</strong>: Hộp thư email, hộp thư vật lý, ứng dụng ghi chú (Notion, Evernote), danh sách nhiệm vụ (Todoist, Asana).</p>

<h3>Danh sách kích hoạt</h3>
<p><strong>Định nghĩa</strong>: Danh sách nhắc nhở bạn khi nào và cần thu thập gì. Ví dụ: "Sau cuộc họp: thu thập các mục hành động", "Sau cuộc gọi: thu thập các bước tiếp theo".</p>
<p><strong>Cách sử dụng</strong>: Giữ nó trong tầm tay và sử dụng khi có điều gì đó xuất hiện trong đầu cần được thu thập.</p>

<h3>Thói quen thu thập</h3>
<p><strong>Định nghĩa</strong>: Hành vi tự động để đảm bảo tất cả thông tin quan trọng được thu thập. Ví dụ: "Sau cuộc họp, tôi ngay lập tức thu thập các mục hành động", "Sau cuộc gọi, tôi ngay lập tức thu thập các bước tiếp theo."</p>
<p><strong>Phát triển</strong>: Lặp lại cho đến khi trở nên tự động. Bắt đầu đơn giản: một kích hoạt, một hộp thư đến.</p>
<hr />
<h2>Bài tập thực hành (20-25 phút) — Tạo hệ thống thu thập</h2>
<ol>
<li><strong>Xác định hộp thư đến</strong>: Viết ra những hộp thư đến bạn có (email, vật lý, ứng dụng ghi chú, v.v.).</li>
<li><strong>Tạo danh sách kích hoạt</strong>: Viết ra 5-10 tình huống khi bạn cần thu thập (sau cuộc họp, sau cuộc gọi, khi đọc, v.v.).</li>
<li><strong>Phát triển thói quen thu thập</strong>: Chọn một kích hoạt và phát triển thói quen cho nó. Ví dụ: "Sau cuộc họp, tôi ngay lập tức thu thập các mục hành động vào hộp thư đến của tôi."</li>
<li><strong>Thực hành</strong>: Thực hành thu thập sau mỗi kích hoạt trong một tuần và ghi chép kinh nghiệm của bạn.</li>
</ol>
<hr />
<h2>Tự kiểm tra</h2>
<ul>
<li>✅ Bạn có hệ thống hộp thư đến đáng tin cậy.</li>
<li>✅ Bạn có danh sách kích hoạt nhắc nhở bạn khi nào cần thu thập.</li>
<li>✅ Bạn có ít nhất một thói quen thu thập đã trở nên tự động.</li>
<li>✅ Tất cả thông tin quan trọng được thu thập, không có gì bị mất.</li>
</ul>
<hr />
<h2>Đào sâu tùy chọn</h2>
<ul>
<li>David Allen: "Getting Things Done" — về thu thập và hộp thư đến</li>
<li>Tiago Forte: "Building a Second Brain" — về hệ thống ghi chú</li>
</ul>`,
    emailSubject: 'Năng suất 2026 – Ngày 6: Thu thập',
    emailBody: `<h1>Năng suất 2026 – Ngày 6</h1>
<h2>Thu thập: hộp thư đến, danh sách kích hoạt, thói quen thu thập</h2>
<p>Hôm nay bạn sẽ học cách thu thập tất cả thông tin quan trọng để không có gì bị mất.</p>
<p><a href="{{APP_URL}}/vi/courses/${COURSE_ID_BASE}_VI/day/6">Mở bài học →</a></p>`
  },
  id: {
    title: 'Penangkapan: kotak masuk, daftar pemicu, kebiasaan penangkapan',
    content: `<h1>Penangkapan: kotak masuk, daftar pemicu, kebiasaan penangkapan</h1>
<p><em>Langkah satu dalam GTD: tangkap semuanya, jangan lupa apa pun</em></p>
<hr />
<h2>Tujuan pembelajaran</h2>
<ul>
<li>Memahami pentingnya penangkapan: jika tidak ditangkap, tidak dikelola.</li>
<li>Membuat sistem kotak masuk yang andal.</li>
<li>Mengembangkan kebiasaan penangkapan yang menjadi otomatis.</li>
</ul>
<hr />
<h2>Mengapa penting</h2>
<ul>
<li><strong>Kotak masuk</strong>: Semua informasi yang masuk pergi ke satu tempat (email, tugas, catatan, ide).</li>
<li><strong>Daftar pemicu</strong>: Daftar yang membantu Anda mengingat kapan harus menangkap (setelah rapat, setelah panggilan, dll.).</li>
<li><strong>Kebiasaan penangkapan</strong>: Perilaku otomatis untuk memastikan semua informasi penting ditangkap.</li>
<li>Jika tidak ditangkap, hilang. Jika hilang, tidak dapat dikelola.</li>
</ul>
<hr />
<h2>Penjelasan</h2>
<h3>Kotak Masuk</h3>
<p><strong>Definisi</strong>: Tempat di mana semua informasi yang masuk dikumpulkan sebelum Anda memprosesnya. Misalnya: kotak masuk email, kotak masuk fisik, aplikasi catatan, daftar tugas.</p>
<p><strong>Aturan</strong>: Kosongkan setiap kotak masuk setidaknya sekali sehari. Kotak masuk kosong = pikiran jernih.</p>
<p><strong>Contoh</strong>: Kotak masuk email, kotak surat fisik, aplikasi catatan (Notion, Evernote), daftar tugas (Todoist, Asana).</p>

<h3>Daftar Pemicu</h3>
<p><strong>Definisi</strong>: Daftar yang mengingatkan Anda kapan dan apa yang harus ditangkap. Misalnya: "Setelah rapat: tangkap item tindakan", "Setelah panggilan: tangkap langkah selanjutnya".</p>
<p><strong>Penggunaan</strong>: Simpan di dekat dan gunakan ketika sesuatu muncul di pikiran yang harus ditangkap.</p>

<h3>Kebiasaan Penangkapan</h3>
<p><strong>Definisi</strong>: Perilaku otomatis untuk memastikan semua informasi penting ditangkap. Misalnya: "Setelah rapat, saya segera menangkap item tindakan", "Setelah panggilan, saya segera menangkap langkah selanjutnya."</p>
<p><strong>Pengembangan</strong>: Ulangi sampai menjadi otomatis. Mulai sederhana: satu pemicu, satu kotak masuk.</p>
<hr />
<h2>Latihan praktis (20-25 menit) — Membuat sistem penangkapan</h2>
<ol>
<li><strong>Mengidentifikasi kotak masuk</strong>: Tuliskan kotak masuk apa yang Anda miliki (email, fisik, aplikasi catatan, dll.).</li>
<li><strong>Membuat daftar pemicu</strong>: Tuliskan 5-10 situasi ketika Anda perlu menangkap (setelah rapat, setelah panggilan, saat membaca, dll.).</li>
<li><strong>Mengembangkan kebiasaan penangkapan</strong>: Pilih satu pemicu dan kembangkan kebiasaan untuk itu. Misalnya: "Setelah rapat, saya segera menangkap item tindakan di kotak masuk saya."</li>
<li><strong>Berlatih</strong>: Berlatih menangkap setelah setiap pemicu selama seminggu dan dokumentasikan pengalaman Anda.</li>
</ol>
<hr />
<h2>Pemeriksaan diri</h2>
<ul>
<li>✅ Anda memiliki sistem kotak masuk yang andal.</li>
<li>✅ Anda memiliki daftar pemicu yang mengingatkan Anda kapan harus menangkap.</li>
<li>✅ Anda memiliki setidaknya satu kebiasaan penangkapan yang telah menjadi otomatis.</li>
<li>✅ Semua informasi penting ditangkap, tidak ada yang hilang.</li>
</ul>
<hr />
<h2>Pendalaman opsional</h2>
<ul>
<li>David Allen: "Getting Things Done" — tentang penangkapan dan kotak masuk</li>
<li>Tiago Forte: "Building a Second Brain" — tentang sistem catatan</li>
</ul>`,
    emailSubject: 'Produktivitas 2026 – Hari 6: Penangkapan',
    emailBody: `<h1>Produktivitas 2026 – Hari 6</h1>
<h2>Penangkapan: kotak masuk, daftar pemicu, kebiasaan penangkapan</h2>
<p>Hari ini Anda akan mempelajari cara menangkap semua informasi penting agar tidak ada yang hilang.</p>
<p><a href="{{APP_URL}}/id/courses/${COURSE_ID_BASE}_ID/day/6">Buka pelajaran →</a></p>`
  },
  ar: {
    title: 'التقاط: صناديق الوارد، قائمة المحفزات، عادات التقاط',
    content: `<h1>التقاط: صناديق الوارد، قائمة المحفزات، عادات التقاط</h1>
<p><em>الخطوة الأولى في GTD: التقط كل شيء، لا تنس شيئًا</em></p>
<hr />
<h2>هدف التعلم</h2>
<ul>
<li>فهم أهمية التقاط: إذا لم يتم التقاطه، لا يتم إدارته.</li>
<li>إنشاء نظام صناديق وارد موثوق.</li>
<li>تطوير عادات التقاط تصبح تلقائية.</li>
</ul>
<hr />
<h2>لماذا يهم</h2>
<ul>
<li><strong>صناديق الوارد</strong>: جميع المعلومات الواردة تذهب إلى مكان واحد (البريد الإلكتروني، المهام، الملاحظات، الأفكار).</li>
<li><strong>قائمة المحفزات</strong>: قائمة تساعدك على تذكر متى تلتقط (بعد الاجتماعات، بعد المكالمات، إلخ).</li>
<li><strong>عادات التقاط</strong>: سلوك تلقائي لضمان التقاط جميع المعلومات المهمة.</li>
<li>إذا لم يتم التقاطه، فُقد. إذا فُقد، لا يمكن إدارته.</li>
</ul>
<hr />
<h2>شرح</h2>
<h3>صناديق الوارد</h3>
<p><strong>التعريف</strong>: مكان حيث تتراكم جميع المعلومات الواردة قبل معالجتها. على سبيل المثال: صندوق بريد إلكتروني، صندوق وارد فعلي، تطبيق ملاحظات، قائمة مهام.</p>
<p><strong>القاعدة</strong>: أفرغ كل صندوق وارد مرة واحدة على الأقل يوميًا. صندوق وارد فارغ = عقل واضح.</p>
<p><strong>مثال</strong>: صندوق بريد إلكتروني، صندوق بريد فعلي، تطبيق ملاحظات (Notion, Evernote)، قائمة مهام (Todoist, Asana).</p>

<h3>قائمة المحفزات</h3>
<p><strong>التعريف</strong>: قائمة تذكرك متى وماذا تلتقط. على سبيل المثال: "بعد الاجتماع: التقط عناصر الإجراءات", "بعد المكالمة: التقط الخطوات التالية".</p>
<p><strong>الاستخدام</strong>: احتفظ بها في متناول اليد واستخدمها عندما يخطر ببالك شيء يجب التقاطه.</p>

<h3>عادات التقاط</h3>
<p><strong>التعريف</strong>: سلوك تلقائي لضمان التقاط جميع المعلومات المهمة. على سبيل المثال: "بعد الاجتماع، ألتقط على الفور عناصر الإجراءات", "بعد المكالمة، ألتقط على الفور الخطوات التالية."</p>
<p><strong>التطوير</strong>: كرر حتى يصبح تلقائيًا. ابدأ ببساطة: محفز واحد، صندوق وارد واحد.</p>
<hr />
<h2>تمرين عملي (20-25 دقيقة) — إنشاء نظام التقاط</h2>
<ol>
<li><strong>تحديد صناديق الوارد</strong>: اكتب صناديق الوارد التي لديك (البريد الإلكتروني، الفعلي، تطبيق الملاحظات، إلخ).</li>
<li><strong>إنشاء قائمة محفزات</strong>: اكتب 5-10 مواقف عندما تحتاج إلى التقاط (بعد الاجتماع، بعد المكالمة، أثناء القراءة، إلخ).</li>
<li><strong>تطوير عادة التقاط</strong>: اختر محفزًا واحدًا وطور عادة له. على سبيل المثال: "بعد الاجتماع، ألتقط على الفور عناصر الإجراءات في صندوق الوارد الخاص بي."</li>
<li><strong>الممارسة</strong>: مارس التقاط بعد كل محفز لمدة أسبوع ووثق تجاربك.</li>
</ol>
<hr />
<h2>الفحص الذاتي</h2>
<ul>
<li>✅ لديك نظام صناديق وارد موثوق.</li>
<li>✅ لديك قائمة محفزات تذكرك متى تلتقط.</li>
<li>✅ لديك عادة التقاط واحدة على الأقل أصبحت تلقائية.</li>
<li>✅ جميع المعلومات المهمة يتم التقاطها، لا شيء مفقود.</li>
</ul>
<hr />
<h2>تعميق اختياري</h2>
<ul>
<li>David Allen: "Getting Things Done" — حول التقاط وصناديق الوارد</li>
<li>Tiago Forte: "Building a Second Brain" — حول أنظمة الملاحظات</li>
</ul>`,
    emailSubject: 'الإنتاجية 2026 – اليوم 6: التقاط',
    emailBody: `<h1>الإنتاجية 2026 – اليوم 6</h1>
<h2>التقاط: صناديق الوارد، قائمة المحفزات، عادات التقاط</h2>
<p>اليوم سوف تتعلم كيفية التقاط جميع المعلومات المهمة حتى لا يفقد شيء.</p>
<p><a href="{{APP_URL}}/ar/courses/${COURSE_ID_BASE}_AR/day/6">افتح الدرس →</a></p>`
  },
  pt: {
    title: 'Captura: caixas de entrada, lista de gatilhos, hábitos de captura',
    content: `<h1>Captura: caixas de entrada, lista de gatilhos, hábitos de captura</h1>
<p><em>Passo um no GTD: capture tudo, não esqueça nada</em></p>
<hr />
<h2>Objetivo de aprendizagem</h2>
<ul>
<li>Entender a importância da captura: se não é capturado, não é gerenciado.</li>
<li>Criar um sistema confiável de caixas de entrada.</li>
<li>Desenvolver hábitos de captura que se tornam automáticos.</li>
</ul>
<hr />
<h2>Por que importa</h2>
<ul>
<li><strong>Caixas de entrada</strong>: Toda informação recebida vai para um lugar (e-mail, tarefas, notas, ideias).</li>
<li><strong>Lista de gatilhos</strong>: Uma lista que ajuda você a lembrar o que capturar (após reuniões, após chamadas, etc.).</li>
<li><strong>Hábitos de captura</strong>: Comportamento automático para garantir que todas as informações importantes sejam capturadas.</li>
<li>Se não é capturado, está perdido. Se está perdido, não pode ser gerenciado.</li>
</ul>
<hr />
<h2>Explicação</h2>
<h3>Caixas de Entrada</h3>
<p><strong>Definição</strong>: Um lugar onde todas as informações recebidas se acumulam antes de você processá-las. Por exemplo: caixa de entrada de e-mail, caixa de entrada física, aplicativo de notas, lista de tarefas.</p>
<p><strong>Regra</strong>: Esvazie cada caixa de entrada pelo menos uma vez por dia. Caixa de entrada vazia = mente clara.</p>
<p><strong>Exemplo</strong>: Caixa de entrada de e-mail, caixa de correio física, aplicativo de notas (Notion, Evernote), lista de tarefas (Todoist, Asana).</p>

<h3>Lista de Gatilhos</h3>
<p><strong>Definição</strong>: Uma lista que lembra você quando e o que capturar. Por exemplo: "Após reunião: capture itens de ação", "Após chamada: capture próximos passos".</p>
<p><strong>Uso</strong>: Mantenha à mão e use quando algo vier à mente que deve ser capturado.</p>

<h3>Hábitos de Captura</h3>
<p><strong>Definição</strong>: Comportamento automático para garantir que todas as informações importantes sejam capturadas. Por exemplo: "Após reunião, capturo imediatamente itens de ação", "Após chamada, capturo imediatamente próximos passos."</p>
<p><strong>Desenvolvimento</strong>: Repita até se tornar automático. Comece simples: um gatilho, uma caixa de entrada.</p>
<hr />
<h2>Exercício prático (20-25 min) — Criando um sistema de captura</h2>
<ol>
<li><strong>Identificar caixas de entrada</strong>: Anote quais caixas de entrada você tem (e-mail, física, aplicativo de notas, etc.).</li>
<li><strong>Criar lista de gatilhos</strong>: Anote 5-10 situações quando você precisa capturar (após reunião, após chamada, durante leitura, etc.).</li>
<li><strong>Desenvolver hábito de captura</strong>: Escolha um gatilho e desenvolva um hábito para ele. Por exemplo: "Após reunião, capturo imediatamente itens de ação na minha caixa de entrada."</li>
<li><strong>Praticar</strong>: Pratique captura após cada gatilho por uma semana e documente suas experiências.</li>
</ol>
<hr />
<h2>Auto-verificação</h2>
<ul>
<li>✅ Você tem um sistema confiável de caixas de entrada.</li>
<li>✅ Você tem uma lista de gatilhos que lembra quando capturar.</li>
<li>✅ Você tem pelo menos um hábito de captura que se tornou automático.</li>
<li>✅ Todas as informações importantes são capturadas, nada é perdido.</li>
</ul>
<hr />
<h2>Aprofundamento opcional</h2>
<ul>
<li>David Allen: "Getting Things Done" — sobre captura e caixas de entrada</li>
<li>Tiago Forte: "Building a Second Brain" — sobre sistemas de notas</li>
</ul>`,
    emailSubject: 'Produtividade 2026 – Dia 6: Captura',
    emailBody: `<h1>Produtividade 2026 – Dia 6</h1>
<h2>Captura: caixas de entrada, lista de gatilhos, hábitos de captura</h2>
<p>Hoje você aprenderá como capturar todas as informações importantes para que nada seja perdido.</p>
<p><a href="{{APP_URL}}/pt/courses/${COURSE_ID_BASE}_PT/day/6">Abrir a lição →</a></p>`
  },
  hi: {
    title: 'कैप्चर: इनबॉक्स, ट्रिगर सूची, कैप्चर आदतें',
    content: `<h1>कैप्चर: इनबॉक्स, ट्रिगर सूची, कैप्चर आदतें</h1>
<p><em>GTD में पहला कदम: सब कुछ कैप्चर करें, कुछ भी न भूलें</em></p>
<hr />
<h2>सीखने का लक्ष्य</h2>
<ul>
<li>कैप्चर के महत्व को समझना: यदि कैप्चर नहीं किया गया, तो प्रबंधित नहीं किया गया।</li>
<li>एक विश्वसनीय इनबॉक्स सिस्टम बनाना।</li>
<li>कैप्चर आदतें विकसित करना जो स्वचालित हो जाती हैं।</li>
</ul>
<hr />
<h2>क्यों महत्वपूर्ण है</h2>
<ul>
<li><strong>इनबॉक्स</strong>: सभी आने वाली जानकारी एक स्थान पर जाती है (ईमेल, कार्य, नोट्स, विचार)।</li>
<li><strong>ट्रिगर सूची</strong>: एक सूची जो आपको याद दिलाती है कि कब कैप्चर करना है (मीटिंग के बाद, कॉल के बाद, आदि)।</li>
<li><strong>कैप्चर आदतें</strong>: स्वचालित व्यवहार यह सुनिश्चित करने के लिए कि सभी महत्वपूर्ण जानकारी कैप्चर हो।</li>
<li>यदि कैप्चर नहीं किया गया, तो खो गया। यदि खो गया, तो प्रबंधित नहीं किया जा सकता।</li>
</ul>
<hr />
<h2>व्याख्या</h2>
<h3>इनबॉक्स</h3>
<p><strong>परिभाषा</strong>: एक स्थान जहां आपके द्वारा प्रसंस्करण से पहले सभी आने वाली जानकारी एकत्र होती है। उदाहरण: ईमेल इनबॉक्स, भौतिक इनबॉक्स, नोट ऐप, कार्य सूची।</p>
<p><strong>नियम</strong>: प्रत्येक इनबॉक्स को दिन में कम से कम एक बार खाली करें। खाली इनबॉक्स = स्पष्ट मन।</p>
<p><strong>उदाहरण</strong>: ईमेल इनबॉक्स, भौतिक मेलबॉक्स, नोट ऐप (Notion, Evernote), कार्य सूची (Todoist, Asana)।</p>

<h3>ट्रिगर सूची</h3>
<p><strong>परिभाषा</strong>: एक सूची जो आपको याद दिलाती है कि कब और क्या कैप्चर करना है। उदाहरण: "मीटिंग के बाद: एक्शन आइटम कैप्चर करें", "कॉल के बाद: अगले कदम कैप्चर करें"।</p>
<p><strong>उपयोग</strong>: इसे हाथ में रखें और उपयोग करें जब कुछ दिमाग में आए जिसे कैप्चर करना चाहिए।</p>

<h3>कैप्चर आदतें</h3>
<p><strong>परिभाषा</strong>: स्वचालित व्यवहार यह सुनिश्चित करने के लिए कि सभी महत्वपूर्ण जानकारी कैप्चर हो। उदाहरण: "मीटिंग के बाद, मैं तुरंत एक्शन आइटम कैप्चर करता हूं", "कॉल के बाद, मैं तुरंत अगले कदम कैप्चर करता हूं।"</p>
<p><strong>विकास</strong>: स्वचालित होने तक दोहराएं। सरल शुरुआत करें: एक ट्रिगर, एक इनबॉक्स।</p>
<hr />
<h2>व्यावहारिक अभ्यास (20-25 मिनट) — कैप्चर सिस्टम बनाना</h2>
<ol>
<li><strong>इनबॉक्स की पहचान</strong>: लिखें कि आपके पास कौन से इनबॉक्स हैं (ईमेल, भौतिक, नोट ऐप, आदि)।</li>
<li><strong>ट्रिगर सूची बनाना</strong>: 5-10 स्थितियां लिखें जब आपको कैप्चर करने की आवश्यकता है (मीटिंग के बाद, कॉल के बाद, पढ़ते समय, आदि)।</li>
<li><strong>कैप्चर आदत विकसित करना</strong>: एक ट्रिगर चुनें और इसके लिए एक आदत विकसित करें। उदाहरण: "मीटिंग के बाद, मैं तुरंत अपने इनबॉक्स में एक्शन आइटम कैप्चर करता हूं।"</li>
<li><strong>अभ्यास</strong>: एक सप्ताह के लिए हर ट्रिगर के बाद कैप्चर करने का अभ्यास करें और अपने अनुभवों को दस्तावेज करें।</li>
</ol>
<hr />
<h2>स्व-जांच</h2>
<ul>
<li>✅ आपके पास एक विश्वसनीय इनबॉक्स सिस्टम है।</li>
<li>✅ आपके पास एक ट्रिगर सूची है जो आपको याद दिलाती है कि कब कैप्चर करना है।</li>
<li>✅ आपके पास कम से कम एक कैप्चर आदत है जो स्वचालित हो गई है।</li>
<li>✅ सभी महत्वपूर्ण जानकारी कैप्चर हो गई है, कुछ भी खो नहीं गया है।</li>
</ul>
<hr />
<h2>वैकल्पिक गहराई</h2>
<ul>
<li>David Allen: "Getting Things Done" — कैप्चर और इनबॉक्स के बारे में</li>
<li>Tiago Forte: "Building a Second Brain" — नोट सिस्टम के बारे में</li>
</ul>`,
    emailSubject: 'उत्पादकता 2026 – दिन 6: कैप्चर',
    emailBody: `<h1>उत्पादकता 2026 – दिन 6</h1>
<h2>कैप्चर: इनबॉक्स, ट्रिगर सूची, कैप्चर आदतें</h2>
<p>आज आप सीखेंगे कि सभी महत्वपूर्ण जानकारी को कैसे कैप्चर करें ताकि कुछ भी खो न जाए।</p>
<p><a href="{{APP_URL}}/hi/courses/${COURSE_ID_BASE}_HI/day/6">पाठ खोलें →</a></p>`
  }
};

// Quiz 6 Questions
const QUIZ_6: Record<string, Array<{
  question: string;
  options: string[];
  correctIndex: number;
}>> = {
  hu: [
    {
      question: 'Mi az inbox?',
      options: [
        'Egy hely, ahol minden bejövő információ összegyűlik',
        'Egy email cím',
        'Egy feladatlista',
        'Egy naptár'
      ],
      correctIndex: 0
    },
    {
      question: 'Milyen gyakran kell üríteni az inboxokat?',
      options: [
        'Hetente egyszer',
        'Havonta egyszer',
        'Naponta legalább egyszer',
        'Soha'
      ],
      correctIndex: 2
    },
    {
      question: 'Mi a trigger lista?',
      options: [
        'Egy lista, amely emlékeztet, mikor rögzíteni kell',
        'Egy email lista',
        'Egy feladatlista',
        'Egy naptár'
      ],
      correctIndex: 0
    },
    {
      question: 'Mi történik, ha valami nincs rögzítve?',
      options: [
        'Automatikusan kezelve van',
        'Elveszik',
        'Automatikusan törlődik',
        'Semmi'
      ],
      correctIndex: 1
    },
    {
      question: 'Hogyan alakítasz ki rögzítési szokást?',
      options: [
        'Egyszer használod',
        'Ismétled, amíg automatikussá nem válik',
        'Soha nem használod',
        'Csak hétvégén használod'
      ],
      correctIndex: 1
    }
  ],
  en: [
    {
      question: 'What is an inbox?',
      options: [
        'A place where all incoming information collects',
        'An email address',
        'A task list',
        'A calendar'
      ],
      correctIndex: 0
    },
    {
      question: 'How often should you empty inboxes?',
      options: [
        'Once a week',
        'Once a month',
        'At least once daily',
        'Never'
      ],
      correctIndex: 2
    },
    {
      question: 'What is a triggers list?',
      options: [
        'A list that reminds you when to capture',
        'An email list',
        'A task list',
        'A calendar'
      ],
      correctIndex: 0
    },
    {
      question: 'What happens if something is not captured?',
      options: [
        'It\'s automatically managed',
        'It\'s lost',
        'It\'s automatically deleted',
        'Nothing'
      ],
      correctIndex: 1
    },
    {
      question: 'How do you develop a capture habit?',
      options: [
        'Use it once',
        'Repeat until it becomes automatic',
        'Never use it',
        'Only use it on weekends'
      ],
      correctIndex: 1
    }
  ],
  tr: [
    {
      question: 'Gelen kutusu nedir?',
      options: [
        'Tüm gelen bilgilerin toplandığı bir yer',
        'Bir e-posta adresi',
        'Bir görev listesi',
        'Bir takvim'
      ],
      correctIndex: 0
    },
    {
      question: 'Gelen kutularını ne sıklıkla boşaltmalısınız?',
      options: [
        'Haftada bir',
        'Ayda bir',
        'Günde en az bir kez',
        'Asla'
      ],
      correctIndex: 2
    },
    {
      question: 'Tetikleyici listesi nedir?',
      options: [
        'Ne zaman yakalamanız gerektiğini hatırlatan bir liste',
        'Bir e-posta listesi',
        'Bir görev listesi',
        'Bir takvim'
      ],
      correctIndex: 0
    },
    {
      question: 'Bir şey yakalanmazsa ne olur?',
      options: [
        'Otomatik olarak yönetilir',
        'Kaybolur',
        'Otomatik olarak silinir',
        'Hiçbir şey'
      ],
      correctIndex: 1
    },
    {
      question: 'Yakalama alışkanlığı nasıl geliştirilir?',
      options: [
        'Bir kez kullanın',
        'Otomatik hale gelene kadar tekrarlayın',
        'Asla kullanmayın',
        'Sadece hafta sonları kullanın'
      ],
      correctIndex: 1
    }
  ],
  bg: [
    {
      question: 'Какво е входяща кутия?',
      options: [
        'Място, където се събира цялата входяща информация',
        'Имейл адрес',
        'Списък със задачи',
        'Календар'
      ],
      correctIndex: 0
    },
    {
      question: 'Колко често трябва да изпразвате входящите кутии?',
      options: [
        'Веднъж седмично',
        'Веднъж месечно',
        'Поне веднъж дневно',
        'Никога'
      ],
      correctIndex: 2
    },
    {
      question: 'Какво е списък с тригери?',
      options: [
        'Списък, който ви напомня кога да уловите',
        'Имейл списък',
        'Списък със задачи',
        'Календар'
      ],
      correctIndex: 0
    },
    {
      question: 'Какво се случва, ако нещо не е уловено?',
      options: [
        'Автоматично се управлява',
        'Изгубва се',
        'Автоматично се изтрива',
        'Нищо'
      ],
      correctIndex: 1
    },
    {
      question: 'Как развивате навик за улавяне?',
      options: [
        'Използвайте го веднъж',
        'Повтаряйте, докато не стане автоматично',
        'Никога не го използвайте',
        'Използвайте го само през уикенда'
      ],
      correctIndex: 1
    }
  ],
  pl: [
    {
      question: 'Czym jest skrzynka odbiorcza?',
      options: [
        'Miejsce, gdzie zbierają się wszystkie przychodzące informacje',
        'Adres e-mail',
        'Lista zadań',
        'Kalendarz'
      ],
      correctIndex: 0
    },
    {
      question: 'Jak często powinieneś opróżniać skrzynki odbiorcze?',
      options: [
        'Raz w tygodniu',
        'Raz w miesiącu',
        'Przynajmniej raz dziennie',
        'Nigdy'
      ],
      correctIndex: 2
    },
    {
      question: 'Czym jest lista wyzwalaczy?',
      options: [
        'Lista, która przypomina, kiedy przechwycić',
        'Lista e-mail',
        'Lista zadań',
        'Kalendarz'
      ],
      correctIndex: 0
    },
    {
      question: 'Co się dzieje, jeśli coś nie jest przechwycone?',
      options: [
        'Jest automatycznie zarządzane',
        'Jest utracone',
        'Jest automatycznie usunięte',
        'Nic'
      ],
      correctIndex: 1
    },
    {
      question: 'Jak rozwijasz nawyk przechwytywania?',
      options: [
        'Użyj go raz',
        'Powtarzaj, aż stanie się automatyczne',
        'Nigdy nie używaj',
        'Używaj tylko w weekendy'
      ],
      correctIndex: 1
    }
  ],
  vi: [
    {
      question: 'Hộp thư đến là gì?',
      options: [
        'Nơi tất cả thông tin đến được thu thập',
        'Địa chỉ email',
        'Danh sách nhiệm vụ',
        'Lịch'
      ],
      correctIndex: 0
    },
    {
      question: 'Bạn nên làm trống hộp thư đến bao lâu một lần?',
      options: [
        'Một lần một tuần',
        'Một lần một tháng',
        'Ít nhất một lần mỗi ngày',
        'Không bao giờ'
      ],
      correctIndex: 2
    },
    {
      question: 'Danh sách kích hoạt là gì?',
      options: [
        'Danh sách nhắc nhở bạn khi nào cần thu thập',
        'Danh sách email',
        'Danh sách nhiệm vụ',
        'Lịch'
      ],
      correctIndex: 0
    },
    {
      question: 'Điều gì xảy ra nếu một cái gì đó không được thu thập?',
      options: [
        'Nó được quản lý tự động',
        'Nó bị mất',
        'Nó bị xóa tự động',
        'Không có gì'
      ],
      correctIndex: 1
    },
    {
      question: 'Làm thế nào để phát triển thói quen thu thập?',
      options: [
        'Sử dụng nó một lần',
        'Lặp lại cho đến khi trở nên tự động',
        'Không bao giờ sử dụng',
        'Chỉ sử dụng vào cuối tuần'
      ],
      correctIndex: 1
    }
  ],
  id: [
    {
      question: 'Apa itu kotak masuk?',
      options: [
        'Tempat di mana semua informasi yang masuk dikumpulkan',
        'Alamat email',
        'Daftar tugas',
        'Kalender'
      ],
      correctIndex: 0
    },
    {
      question: 'Seberapa sering Anda harus mengosongkan kotak masuk?',
      options: [
        'Sekali seminggu',
        'Sekali sebulan',
        'Setidaknya sekali sehari',
        'Tidak pernah'
      ],
      correctIndex: 2
    },
    {
      question: 'Apa itu daftar pemicu?',
      options: [
        'Daftar yang mengingatkan Anda kapan harus menangkap',
        'Daftar email',
        'Daftar tugas',
        'Kalender'
      ],
      correctIndex: 0
    },
    {
      question: 'Apa yang terjadi jika sesuatu tidak ditangkap?',
      options: [
        'Dikelola secara otomatis',
        'Hilang',
        'Dihapus secara otomatis',
        'Tidak ada'
      ],
      correctIndex: 1
    },
    {
      question: 'Bagaimana Anda mengembangkan kebiasaan penangkapan?',
      options: [
        'Gunakan sekali',
        'Ulangi sampai menjadi otomatis',
        'Jangan pernah gunakan',
        'Hanya gunakan di akhir pekan'
      ],
      correctIndex: 1
    }
  ],
  ar: [
    {
      question: 'ما هو صندوق الوارد؟',
      options: [
        'مكان حيث تتراكم جميع المعلومات الواردة',
        'عنوان بريد إلكتروني',
        'قائمة مهام',
        'تقويم'
      ],
      correctIndex: 0
    },
    {
      question: 'كم مرة يجب أن تفرغ صناديق الوارد؟',
      options: [
        'مرة واحدة في الأسبوع',
        'مرة واحدة في الشهر',
        'مرة واحدة على الأقل يوميًا',
        'أبدًا'
      ],
      correctIndex: 2
    },
    {
      question: 'ما هي قائمة المحفزات؟',
      options: [
        'قائمة تذكرك متى تلتقط',
        'قائمة بريد إلكتروني',
        'قائمة مهام',
        'تقويم'
      ],
      correctIndex: 0
    },
    {
      question: 'ماذا يحدث إذا لم يتم التقاط شيء؟',
      options: [
        'يتم إدارته تلقائيًا',
        'يفقد',
        'يتم حذفه تلقائيًا',
        'لا شيء'
      ],
      correctIndex: 1
    },
    {
      question: 'كيف تطور عادة التقاط؟',
      options: [
        'استخدمها مرة واحدة',
        'كرر حتى تصبح تلقائية',
        'لا تستخدمها أبدًا',
        'استخدمها فقط في عطلة نهاية الأسبوع'
      ],
      correctIndex: 1
    }
  ],
  pt: [
    {
      question: 'O que é uma caixa de entrada?',
      options: [
        'Um lugar onde todas as informações recebidas se acumulam',
        'Um endereço de e-mail',
        'Uma lista de tarefas',
        'Um calendário'
      ],
      correctIndex: 0
    },
    {
      question: 'Com que frequência você deve esvaziar as caixas de entrada?',
      options: [
        'Uma vez por semana',
        'Uma vez por mês',
        'Pelo menos uma vez por dia',
        'Nunca'
      ],
      correctIndex: 2
    },
    {
      question: 'O que é uma lista de gatilhos?',
      options: [
        'Uma lista que lembra quando capturar',
        'Uma lista de e-mail',
        'Uma lista de tarefas',
        'Um calendário'
      ],
      correctIndex: 0
    },
    {
      question: 'O que acontece se algo não for capturado?',
      options: [
        'É gerenciado automaticamente',
        'Está perdido',
        'É excluído automaticamente',
        'Nada'
      ],
      correctIndex: 1
    },
    {
      question: 'Como você desenvolve um hábito de captura?',
      options: [
        'Use uma vez',
        'Repita até se tornar automático',
        'Nunca use',
        'Use apenas nos fins de semana'
      ],
      correctIndex: 1
    }
  ],
  hi: [
    {
      question: 'इनबॉक्स क्या है?',
      options: [
        'एक स्थान जहां सभी आने वाली जानकारी एकत्र होती है',
        'एक ईमेल पता',
        'एक कार्य सूची',
        'एक कैलेंडर'
      ],
      correctIndex: 0
    },
    {
      question: 'आपको इनबॉक्स को कितनी बार खाली करना चाहिए?',
      options: [
        'सप्ताह में एक बार',
        'महीने में एक बार',
        'दिन में कम से कम एक बार',
        'कभी नहीं'
      ],
      correctIndex: 2
    },
    {
      question: 'ट्रिगर सूची क्या है?',
      options: [
        'एक सूची जो आपको याद दिलाती है कि कब कैप्चर करना है',
        'एक ईमेल सूची',
        'एक कार्य सूची',
        'एक कैलेंडर'
      ],
      correctIndex: 0
    },
    {
      question: 'यदि कुछ कैप्चर नहीं किया गया तो क्या होता है?',
      options: [
        'यह स्वचालित रूप से प्रबंधित होता है',
        'यह खो जाता है',
        'यह स्वचालित रूप से हटा दिया जाता है',
        'कुछ नहीं'
      ],
      correctIndex: 1
    },
    {
      question: 'आप कैप्चर आदत कैसे विकसित करते हैं?',
      options: [
        'इसे एक बार उपयोग करें',
        'स्वचालित होने तक दोहराएं',
        'कभी उपयोग न करें',
        'केवल सप्ताहांत में उपयोग करें'
      ],
      correctIndex: 1
    }
  ]
};

// Seed lesson 6 for specific languages
async function seedLesson6ForLanguages(
  languages: string[],
  brand: any,
  appUrl: string
) {
  for (const lang of languages) {
    const courseId = `${COURSE_ID_BASE}_${lang.toUpperCase()}`;
    const course = await Course.findOne({ courseId });
    
    if (!course) {
      console.log(`⚠️  Course ${courseId} not found, skipping...`);
      continue;
    }

    const lessonContent = LESSON_6[lang];
    const quizQuestions = QUIZ_6[lang];

    if (!lessonContent || !quizQuestions) {
      console.log(`⚠️  Content not ready for ${lang}, skipping...`);
      continue;
    }

    const lessonId = `${courseId}_DAY_06`;

    // Create/update lesson
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId,
          courseId: course._id,
          dayNumber: 6,
          language: lang,
          isActive: true,
          title: lessonContent.title,
          content: lessonContent.content,
          emailSubject: lessonContent.emailSubject.replace(/\{\{APP_URL\}\}/g, appUrl),
          emailBody: lessonContent.emailBody.replace(/\{\{APP_URL\}\}/g, appUrl),
          quizConfig: {
            enabled: true,
            successThreshold: 70,
            questionCount: 5,
            poolSize: 5,
            required: true
          },
          pointsReward: 50,
          xpReward: 25,
          metadata: {
            estimatedMinutes: 25,
            difficulty: 'medium'
          }
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`  ✅ Lesson 6 for ${lang} created/updated`);

    // Create quiz questions
    for (const q of quizQuestions) {
      await QuizQuestion.findOneAndUpdate(
        {
          lessonId: lesson.lessonId,
          question: q.question
        },
        {
          $set: {
            question: q.question,
            options: q.options,
            correctIndex: q.correctIndex,
            difficulty: QuestionDifficulty.MEDIUM,
            category: 'Capture & GTD',
            lessonId: lesson.lessonId,
            courseId: course._id,
            isCourseSpecific: true,
            isActive: true,
            showCount: 0,
            correctCount: 0,
            metadata: {
              createdAt: new Date(),
              updatedAt: new Date()
            }
          }
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    console.log(`  ✅ Quiz 6 (${quizQuestions.length} questions) for ${lang} created/updated`);
  }
}

// Main seed function
async function seed() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI not set');
  }
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.amanoba.com';

  await connectDB();
  console.log('✅ Connected to MongoDB\n');

  // Get brand
  let brand = await Brand.findOne({ slug: 'amanoba' });
  if (!brand) {
    console.log('⚠️  Brand not found, creating...');
    brand = await Brand.create({
      name: 'Amanoba',
      slug: 'amanoba',
      displayName: 'Amanoba',
      description: 'Unified Learning Platform',
      logo: '/AMANOBA.png',
      themeColors: { primary: '#FAB908', secondary: '#2D2D2D', accent: '#FAB908' },
      allowedDomains: ['amanoba.com', 'www.amanoba.com', 'localhost'],
      supportedLanguages: ['hu', 'en', 'tr', 'bg', 'pl', 'vi', 'id', 'ar', 'pt', 'hi'],
      defaultLanguage: 'hu',
      isActive: true
    });
  }

  console.log('📚 Processing Lesson 6 (Day 6: Capture)...\n');
  
  // Process in batches of 2 languages
  for (const [pairIndex, pair] of LANGUAGE_PAIRS.entries()) {
    console.log(`  Batch ${pairIndex + 1}/5: ${pair.join(', ')}`);
    await seedLesson6ForLanguages(pair, brand, appUrl);
    console.log(`  ✅ Batch ${pairIndex + 1} completed\n`);
  }
  
  console.log('✅ Lesson 6 completed for all languages!');
  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
