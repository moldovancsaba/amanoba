/**
 * Seed Productivity 2026 Course - Lesson 3 (Day 3)
 * 
 * Day 3: Goal hierarchy: vision → outcomes → projects → next actions
 * 
 * Creates lesson 3 for all 10 languages in 2-language batches
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

// Lesson 3 Content: Goal hierarchy: vision → outcomes → projects → next actions
const LESSON_3: Record<string, {
  title: string;
  content: string;
  emailSubject: string;
  emailBody: string;
}> = {
  hu: {
    title: 'Célhierarchia: vízió → eredmények → projektek → következő lépések',
    content: `<h1>Célhierarchia: vízió → eredmények → projektek → következő lépések</h1>
<p><em>A termelékenység alapja: tiszta célstruktúra</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
<li>Megérteni a célhierarchia négy szintjét: vízió, eredmények, projektek, következő lépések.</li>
<li>Létrehozni egy személyes célhierarchiát.</li>
<li>Megtanulni, hogyan alakítsunk át nagy célokat konkrét, cselekvésre kész lépésekké.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
<li><strong>Vízió</strong>: A hosszú távú irány (3-5 év). Miért csinálod, amit csinálsz?</li>
<li><strong>Eredmények</strong>: A mérhető változások (6-12 hónap). Mit szeretnél elérni?</li>
<li><strong>Projektek</strong>: A konkrét munkák (1-3 hónap). Milyen projektek vezetnek az eredményekhez?</li>
<li><strong>Következő lépések</strong>: A konkrét cselekvések (ma, holnap). Mit kell most tenned?</li>
<li>Minden szint a következő szintet táplálja. Nincs következő lépés = nincs haladás.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>A négy szint</h3>
<p><strong>1. Vízió (3-5 év)</strong>: A nagy kép. Például: "Vezető fejlesztő vagyok, aki skálázható termékeket épít."</p>
<p><strong>2. Eredmények (6-12 hónap)</strong>: Mérhető változások. Például: "Q2 végére 3 új ügyfél, 20% növekvő bevétel."</p>
<p><strong>3> Projektek (1-3 hónap)</strong>: Konkrét munkák. Például: "Új onboarding folyamat kialakítása", "Marketing kampány indítása."</p>
<p><strong>4. Következő lépések (ma, holnap)</strong>: Konkrét cselekvések. Például: "Email írása az onboarding folyamatról", "Meeting meghívása a marketing csapattal."</p>

<h3>Hogyan működik együtt</h3>
<p>A vízió adja az irányt. Az eredmények definiálják, mit mérünk. A projektek a munkát. A következő lépések a cselekvést.</p>
<p><strong>Példa</strong>:
<ul>
<li>Vízió: "Vezető fejlesztő vagyok"</li>
<li>Eredmény: "Q2 végére 3 új ügyfél"</li>
<li>Projekt: "Új onboarding folyamat"</li>
<li>Következő lépés: "Email írása az onboarding folyamatról" (ma)</li>
</ul>
</p>

<h3>Gyakori hibák</h3>
<ul>
<li><strong>Vízió nélküli projektek</strong>: Csinálod, de nem tudod, miért.</li>
<li><strong>Eredmények nélküli projektek</strong>: Dolgozol, de nem mérhető a haladás.</li>
<li><strong>Következő lépések nélküli projektek</strong>: Tervezel, de nem cselekszel.</li>
</ul>
<hr />
<h2>Gyakorlati feladat (25-30 perc) — Személyes célhierarchia</h2>
<ol>
<li><strong>Vízió (3-5 év)</strong>: Írd le 2-3 mondatban: "3-5 év múlva hol akarok lenni? Mit akarok elérni?"</li>
<li><strong>Eredmények (6-12 hónap)</strong>: Válassz 2-3 mérhető eredményt, amelyek a vízióhoz vezetnek. Minden eredményhez írd le, hogyan mérheted meg.</li>
<li><strong>Projektek (1-3 hónap)</strong>: Minden eredményhez írd le 2-3 projektet, amelyek az eredményhez vezetnek.</li>
<li><strong>Következő lépések (ma, holnap)</strong>: Minden projekthez írd le 2-3 konkrét lépést, amelyeket most tehetsz.</li>
</ol>
<hr />
<h2>Önellenőrzés</h2>
<ul>
<li>✅ Van egy víziód (3-5 év).</li>
<li>✅ Van 2-3 mérhető eredményed (6-12 hónap).</li>
<li>✅ Minden eredményhez van 2-3 projekted (1-3 hónap).</li>
<li>✅ Minden projekthez van 2-3 következő lépésed (ma, holnap).</li>
<li>✅ A hierarchia logikusan összekapcsolódik: vízió → eredmények → projektek → lépések.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
<li>David Allen: "Getting Things Done" — a következő lépések fontosságáról</li>
<li>Jim Collins: "Good to Great" — a vízió és a célokról</li>
<li>John Doerr: "Measure What Matters" — OKR-ekről (Objectives and Key Results)</li>
</ul>`,
    emailSubject: 'Termelékenység 2026 – 3. nap: Célhierarchia',
    emailBody: `<h1>Termelékenység 2026 – 3. nap</h1>
<h2>Célhierarchia: vízió → eredmények → projektek → következő lépések</h2>
<p>Ma megtanulod, hogyan építs fel egy tiszta célstruktúrát, amely a víziótól a konkrét lépésekig vezet.</p>
<p><a href="{{APP_URL}}/hu/courses/${COURSE_ID_BASE}_HU/day/3">Nyisd meg a leckét →</a></p>`
  },
  en: {
    title: 'Goal hierarchy: vision → outcomes → projects → next actions',
    content: `<h1>Goal hierarchy: vision → outcomes → projects → next actions</h1>
<p><em>The foundation of productivity: clear goal structure</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Understand the four levels of goal hierarchy: vision, outcomes, projects, next actions.</li>
<li>Create a personal goal hierarchy.</li>
<li>Learn how to break down big goals into concrete, actionable steps.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li><strong>Vision</strong>: The long-term direction (3-5 years). Why do you do what you do?</li>
<li><strong>Outcomes</strong>: The measurable changes (6-12 months). What do you want to achieve?</li>
<li><strong>Projects</strong>: The concrete work (1-3 months). What projects lead to outcomes?</li>
<li><strong>Next actions</strong>: The concrete actions (today, tomorrow). What do you need to do now?</li>
<li>Each level feeds the next. No next actions = no progress.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>The four levels</h3>
<p><strong>1. Vision (3-5 years)</strong>: The big picture. For example: "I'm a lead developer who builds scalable products."</p>
<p><strong>2. Outcomes (6-12 months)</strong>: Measurable changes. For example: "By end of Q2: 3 new clients, 20% revenue growth."</p>
<p><strong>3. Projects (1-3 months)</strong>: Concrete work. For example: "Design new onboarding process", "Launch marketing campaign."</p>
<p><strong>4. Next actions (today, tomorrow)</strong>: Concrete actions. For example: "Write email about onboarding process", "Schedule meeting with marketing team."</p>

<h3>How they work together</h3>
<p>Vision provides direction. Outcomes define what we measure. Projects are the work. Next actions are the doing.</p>
<p><strong>Example</strong>:
<ul>
<li>Vision: "I'm a lead developer"</li>
<li>Outcome: "By end of Q2: 3 new clients"</li>
<li>Project: "New onboarding process"</li>
<li>Next action: "Write email about onboarding process" (today)</li>
</ul>
</p>

<h3>Common mistakes</h3>
<ul>
<li><strong>Projects without vision</strong>: You're doing, but don't know why.</li>
<li><strong>Projects without outcomes</strong>: You're working, but progress isn't measurable.</li>
<li><strong>Projects without next actions</strong>: You're planning, but not acting.</li>
</ul>
<hr />
<h2>Practical exercise (25-30 min) — Personal goal hierarchy</h2>
<ol>
<li><strong>Vision (3-5 years)</strong>: Write in 2-3 sentences: "Where do I want to be in 3-5 years? What do I want to achieve?"</li>
<li><strong>Outcomes (6-12 months)</strong>: Choose 2-3 measurable outcomes that lead to vision. For each outcome, write how you'll measure it.</li>
<li><strong>Projects (1-3 months)</strong>: For each outcome, write 2-3 projects that lead to the outcome.</li>
<li><strong>Next actions (today, tomorrow)</strong>: For each project, write 2-3 concrete steps you can take now.</li>
</ol>
<hr />
<h2>Self-check</h2>
<ul>
<li>✅ You have a vision (3-5 years).</li>
<li>✅ You have 2-3 measurable outcomes (6-12 months).</li>
<li>✅ For each outcome, you have 2-3 projects (1-3 months).</li>
<li>✅ For each project, you have 2-3 next actions (today, tomorrow).</li>
<li>✅ The hierarchy logically connects: vision → outcomes → projects → actions.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>David Allen: "Getting Things Done" — about the importance of next actions</li>
<li>Jim Collins: "Good to Great" — about vision and goals</li>
<li>John Doerr: "Measure What Matters" — about OKRs (Objectives and Key Results)</li>
</ul>`,
    emailSubject: 'Productivity 2026 – Day 3: Goal hierarchy',
    emailBody: `<h1>Productivity 2026 – Day 3</h1>
<h2>Goal hierarchy: vision → outcomes → projects → next actions</h2>
<p>Today you'll learn how to build a clear goal structure that leads from vision to concrete steps.</p>
<p><a href="{{APP_URL}}/en/courses/${COURSE_ID_BASE}_EN/day/3">Open the lesson →</a></p>`
  },
  tr: {
    title: 'Hedef hiyerarşisi: vizyon → sonuçlar → projeler → sonraki adımlar',
    content: `<h1>Hedef hiyerarşisi: vizyon → sonuçlar → projeler → sonraki adımlar</h1>
<p><em>Verimliliğin temeli: net hedef yapısı</em></p>
<hr />
<h2>Öğrenme hedefi</h2>
<ul>
<li>Hedef hiyerarşisinin dört seviyesini anlamak: vizyon, sonuçlar, projeler, sonraki adımlar.</li>
<li>Kişisel bir hedef hiyerarşisi oluşturmak.</li>
<li>Büyük hedefleri somut, uygulanabilir adımlara nasıl ayıracağını öğrenmek.</li>
</ul>
<hr />
<h2>Neden önemli</h2>
<ul>
<li><strong>Vizyon</strong>: Uzun vadeli yön (3-5 yıl). Neden yaptığınızı yapıyorsunuz?</li>
<li><strong>Sonuçlar</strong>: Ölçülebilir değişiklikler (6-12 ay). Ne elde etmek istiyorsunuz?</li>
<li><strong>Projeler</strong>: Somut işler (1-3 ay). Hangi projeler sonuçlara yol açar?</li>
<li><strong>Sonraki adımlar</strong>: Somut eylemler (bugün, yarın). Şimdi ne yapmanız gerekiyor?</li>
<li>Her seviye bir sonrakini besler. Sonraki adım yok = ilerleme yok.</li>
</ul>
<hr />
<h2>Açıklama</h2>
<h3>Dört seviye</h3>
<p><strong>1. Vizyon (3-5 yıl)</strong>: Büyük resim. Örneğin: "Ölçeklenebilir ürünler inşa eden bir lider geliştiriciyim."</p>
<p><strong>2. Sonuçlar (6-12 ay)</strong>: Ölçülebilir değişiklikler. Örneğin: "Q2 sonuna kadar: 3 yeni müşteri, %20 gelir artışı."</p>
<p><strong>3. Projeler (1-3 ay)</strong>: Somut işler. Örneğin: "Yeni onboarding süreci tasarlama", "Pazarlama kampanyası başlatma."</p>
<p><strong>4. Sonraki adımlar (bugün, yarın)</strong>: Somut eylemler. Örneğin: "Onboarding süreci hakkında e-posta yazma", "Pazarlama ekibiyle toplantı planlama."</p>

<h3>Nasıl birlikte çalışırlar</h3>
<p>Vizyon yön sağlar. Sonuçlar ne ölçtüğümüzü tanımlar. Projeler iştir. Sonraki adımlar yapmaktır.</p>
<p><strong>Örnek</strong>:
<ul>
<li>Vizyon: "Lider geliştiriciyim"</li>
<li>Sonuç: "Q2 sonuna kadar: 3 yeni müşteri"</li>
<li>Proje: "Yeni onboarding süreci"</li>
<li>Sonraki adım: "Onboarding süreci hakkında e-posta yazma" (bugün)</li>
</ul>
</p>

<h3>Yaygın hatalar</h3>
<ul>
<li><strong>Vizyonsuz projeler</strong>: Yapıyorsunuz ama nedenini bilmiyorsunuz.</li>
<li><strong>Sonuçsuz projeler</strong>: Çalışıyorsunuz ama ilerleme ölçülebilir değil.</li>
<li><strong>Sonraki adımsız projeler</strong>: Planlıyorsunuz ama harekete geçmiyorsunuz.</li>
</ul>
<hr />
<h2>Pratik alıştırma (25-30 dakika) — Kişisel hedef hiyerarşisi</h2>
<ol>
<li><strong>Vizyon (3-5 yıl)</strong>: 2-3 cümlede yazın: "3-5 yıl içinde nerede olmak istiyorum? Ne elde etmek istiyorum?"</li>
<li><strong>Sonuçlar (6-12 ay)</strong>: Vizyona götüren 2-3 ölçülebilir sonuç seçin. Her sonuç için nasıl ölçeceğinizi yazın.</li>
<li><strong>Projeler (1-3 ay)</strong>: Her sonuç için sonuca götüren 2-3 proje yazın.</li>
<li><strong>Sonraki adımlar (bugün, yarın)</strong>: Her proje için şimdi yapabileceğiniz 2-3 somut adım yazın.</li>
</ol>
<hr />
<h2>Kendi kendini kontrol</h2>
<ul>
<li>✅ Bir vizyonunuz var (3-5 yıl).</li>
<li>✅ 2-3 ölçülebilir sonucunuz var (6-12 ay).</li>
<li>✅ Her sonuç için 2-3 projeniz var (1-3 ay).</li>
<li>✅ Her proje için 2-3 sonraki adımınız var (bugün, yarın).</li>
<li>✅ Hiyerarşi mantıksal olarak bağlanır: vizyon → sonuçlar → projeler → adımlar.</li>
</ul>
<hr />
<h2>İsteğe bağlı derinleştirme</h2>
<ul>
<li>David Allen: "Getting Things Done" — sonraki adımların önemi hakkında</li>
<li>Jim Collins: "Good to Great" — vizyon ve hedefler hakkında</li>
<li>John Doerr: "Measure What Matters" — OKR'ler hakkında (Objectives and Key Results)</li>
</ul>`,
    emailSubject: 'Verimlilik 2026 – 3. Gün: Hedef hiyerarşisi',
    emailBody: `<h1>Verimlilik 2026 – 3. Gün</h1>
<h2>Hedef hiyerarşisi: vizyon → sonuçlar → projeler → sonraki adımlar</h2>
<p>Bugün vizyondan somut adımlara giden net bir hedef yapısı nasıl oluşturulacağını öğreneceksiniz.</p>
<p><a href="{{APP_URL}}/tr/courses/${COURSE_ID_BASE}_TR/day/3">Dersi aç →</a></p>`
  },
  bg: {
    title: 'Йерархия на целите: визия → резултати → проекти → следващи стъпки',
    content: `<h1>Йерархия на целите: визия → резултати → проекти → следващи стъпки</h1>
<p><em>Основата на продуктивността: ясна структура на целите</em></p>
<hr />
<h2>Учебна цел</h2>
<ul>
<li>Да разберете четирите нива на йерархията на целите: визия, резултати, проекти, следващи стъпки.</li>
<li>Да създадете лична йерархия на целите.</li>
<li>Да научите как да разбиете големи цели на конкретни, изпълними стъпки.</li>
</ul>
<hr />
<h2>Защо е важно</h2>
<ul>
<li><strong>Визия</strong>: Дългосрочната посока (3-5 години). Защо правите това, което правите?</li>
<li><strong>Резултати</strong>: Измеримите промени (6-12 месеца). Какво искате да постигнете?</li>
<li><strong>Проекти</strong>: Конкретната работа (1-3 месеца). Кои проекти водят до резултати?</li>
<li><strong>Следващи стъпки</strong>: Конкретните действия (днес, утре). Какво трябва да направите сега?</li>
<li>Всяко ниво храни следващото. Няма следващи стъпки = няма напредък.</li>
</ul>
<hr />
<h2>Обяснение</h2>
<h3>Четирите нива</h3>
<p><strong>1. Визия (3-5 години)</strong>: Голямата картина. Например: "Аз съм водещ разработчик, който изгражда мащабируеми продукти."</p>
<p><strong>2. Резултати (6-12 месеца)</strong>: Измерими промени. Например: "До края на Q2: 3 нови клиента, 20% растеж на приходите."</p>
<p><strong>3. Проекти (1-3 месеца)</strong>: Конкретна работа. Например: "Проектиране на нов процес на включване", "Стартиране на маркетингова кампания."</p>
<p><strong>4. Следващи стъпки (днес, утре)</strong>: Конкретни действия. Например: "Писане на имейл за процеса на включване", "Планиране на среща с маркетинговия екип."</p>

<h3>Как работят заедно</h3>
<p>Визията предоставя посока. Резултатите определят какво измерваме. Проектите са работата. Следващите стъпки са правенето.</p>
<p><strong>Пример</strong>:
<ul>
<li>Визия: "Аз съм водещ разработчик"</li>
<li>Резултат: "До края на Q2: 3 нови клиента"</li>
<li>Проект: "Нов процес на включване"</li>
<li>Следваща стъпка: "Писане на имейл за процеса на включване" (днес)</li>
</ul>
</p>

<h3>Често срещани грешки</h3>
<ul>
<li><strong>Проекти без визия</strong>: Правите, но не знаете защо.</li>
<li><strong>Проекти без резултати</strong>: Работите, но напредъкът не е измерим.</li>
<li><strong>Проекти без следващи стъпки</strong>: Планирате, но не действате.</li>
</ul>
<hr />
<h2>Практическо упражнение (25-30 мин) — Лична йерархия на целите</h2>
<ol>
<li><strong>Визия (3-5 години)</strong>: Напишете с 2-3 изречения: "Къде искам да бъда след 3-5 години? Какво искам да постигна?"</li>
<li><strong>Резултати (6-12 месеца)</strong>: Изберете 2-3 измерими резултата, които водят до визията. За всеки резултат напишете как ще го измерите.</li>
<li><strong>Проекти (1-3 месеца)</strong>: За всеки резултат напишете 2-3 проекта, които водят до резултата.</li>
<li><strong>Следващи стъпки (днес, утре)</strong>: За всеки проект напишете 2-3 конкретни стъпки, които можете да направите сега.</li>
</ol>
<hr />
<h2>Самопроверка</h2>
<ul>
<li>✅ Имате визия (3-5 години).</li>
<li>✅ Имате 2-3 измерими резултата (6-12 месеца).</li>
<li>✅ За всеки резултат имате 2-3 проекта (1-3 месеца).</li>
<li>✅ За всеки проект имате 2-3 следващи стъпки (днес, утре).</li>
<li>✅ Йерархията логически се свързва: визия → резултати → проекти → стъпки.</li>
</ul>
<hr />
<h2>Опционално задълбочаване</h2>
<ul>
<li>Дейвид Алън: "Getting Things Done" — за важността на следващите стъпки</li>
<li>Джим Колинс: "Good to Great" — за визия и цели</li>
<li>Джон Дор: "Measure What Matters" — за OKR (Objectives and Key Results)</li>
</ul>`,
    emailSubject: 'Продуктивност 2026 – Ден 3: Йерархия на целите',
    emailBody: `<h1>Продуктивност 2026 – Ден 3</h1>
<h2>Йерархия на целите: визия → резултати → проекти → следващи стъпки</h2>
<p>Днес ще научите как да изградите ясна структура на целите, която води от визията до конкретни стъпки.</p>
<p><a href="{{APP_URL}}/bg/courses/${COURSE_ID_BASE}_BG/day/3">Отворете урока →</a></p>`
  },
  pl: {
    title: 'Hierarchia celów: wizja → rezultaty → projekty → następne kroki',
    content: `<h1>Hierarchia celów: wizja → rezultaty → projekty → następne kroki</h1>
<p><em>Podstawa produktywności: jasna struktura celów</em></p>
<hr />
<h2>Cel uczenia się</h2>
<ul>
<li>Zrozumieć cztery poziomy hierarchii celów: wizja, rezultaty, projekty, następne kroki.</li>
<li>Stworzyć osobistą hierarchię celów.</li>
<li>Nauczyć się, jak rozbić duże cele na konkretne, wykonalne kroki.</li>
</ul>
<hr />
<h2>Dlaczego to ważne</h2>
<ul>
<li><strong>Wizja</strong>: Długoterminowy kierunek (3-5 lat). Dlaczego robisz to, co robisz?</li>
<li><strong>Rezultaty</strong>: Mierzalne zmiany (6-12 miesięcy). Co chcesz osiągnąć?</li>
<li><strong>Projekty</strong>: Konkretna praca (1-3 miesiące). Jakie projekty prowadzą do rezultatów?</li>
<li><strong>Następne kroki</strong>: Konkretne działania (dzisiaj, jutro). Co musisz zrobić teraz?</li>
<li>Każdy poziom zasila następny. Brak następnych kroków = brak postępu.</li>
</ul>
<hr />
<h2>Wyjaśnienie</h2>
<h3>Cztery poziomy</h3>
<p><strong>1. Wizja (3-5 lat)</strong>: Duży obraz. Na przykład: "Jestem liderem deweloperem, który buduje skalowalne produkty."</p>
<p><strong>2. Rezultaty (6-12 miesięcy)</strong>: Mierzalne zmiany. Na przykład: "Do końca Q2: 3 nowych klientów, 20% wzrost przychodów."</p>
<p><strong>3. Projekty (1-3 miesiące)</strong>: Konkretna praca. Na przykład: "Zaprojektowanie nowego procesu onboardingu", "Uruchomienie kampanii marketingowej."</p>
<p><strong>4. Następne kroki (dzisiaj, jutro)</strong>: Konkretne działania. Na przykład: "Napisanie e-maila o procesie onboardingu", "Zaplanowanie spotkania z zespołem marketingowym."</p>

<h3>Jak działają razem</h3>
<p>Wizja zapewnia kierunek. Rezultaty definiują, co mierzymy. Projekty to praca. Następne kroki to działanie.</p>
<p><strong>Przykład</strong>:
<ul>
<li>Wizja: "Jestem liderem deweloperem"</li>
<li>Rezultat: "Do końca Q2: 3 nowych klientów"</li>
<li>Projekt: "Nowy proces onboardingu"</li>
<li>Następny krok: "Napisanie e-maila o procesie onboardingu" (dzisiaj)</li>
</ul>
</p>

<h3>Typowe błędy</h3>
<ul>
<li><strong>Projekty bez wizji</strong>: Robisz, ale nie wiesz dlaczego.</li>
<li><strong>Projekty bez rezultatów</strong>: Pracujesz, ale postęp nie jest mierzalny.</li>
<li><strong>Projekty bez następnych kroków</strong>: Planujesz, ale nie działasz.</li>
</ul>
<hr />
<h2>Praktyczne ćwiczenie (25-30 min) — Osobista hierarchia celów</h2>
<ol>
<li><strong>Wizja (3-5 lat)</strong>: Napisz w 2-3 zdaniach: "Gdzie chcę być za 3-5 lat? Co chcę osiągnąć?"</li>
<li><strong>Rezultaty (6-12 miesięcy)</strong>: Wybierz 2-3 mierzalne rezultaty, które prowadzą do wizji. Dla każdego rezultatu napisz, jak go zmierzysz.</li>
<li><strong>Projekty (1-3 miesiące)</strong>: Dla każdego rezultatu napisz 2-3 projekty, które prowadzą do rezultatu.</li>
<li><strong>Następne kroki (dzisiaj, jutro)</strong>: Dla każdego projektu napisz 2-3 konkretne kroki, które możesz podjąć teraz.</li>
</ol>
<hr />
<h2>Samosprawdzenie</h2>
<ul>
<li>✅ Masz wizję (3-5 lat).</li>
<li>✅ Masz 2-3 mierzalne rezultaty (6-12 miesięcy).</li>
<li>✅ Dla każdego rezultatu masz 2-3 projekty (1-3 miesiące).</li>
<li>✅ Dla każdego projektu masz 2-3 następne kroki (dzisiaj, jutro).</li>
<li>✅ Hierarchia logicznie się łączy: wizja → rezultaty → projekty → kroki.</li>
</ul>
<hr />
<h2>Opcjonalne pogłębienie</h2>
<ul>
<li>David Allen: "Getting Things Done" — o znaczeniu następnych kroków</li>
<li>Jim Collins: "Good to Great" — o wizji i celach</li>
<li>John Doerr: "Measure What Matters" — o OKR (Objectives and Key Results)</li>
</ul>`,
    emailSubject: 'Produktywność 2026 – Dzień 3: Hierarchia celów',
    emailBody: `<h1>Produktywność 2026 – Dzień 3</h1>
<h2>Hierarchia celów: wizja → rezultaty → projekty → następne kroki</h2>
<p>Dzisiaj nauczysz się, jak zbudować jasną strukturę celów, która prowadzi od wizji do konkretnych kroków.</p>
<p><a href="{{APP_URL}}/pl/courses/${COURSE_ID_BASE}_PL/day/3">Otwórz lekcję →</a></p>`
  },
  vi: {
    title: 'Phân cấp mục tiêu: tầm nhìn → kết quả → dự án → hành động tiếp theo',
    content: `<h1>Phân cấp mục tiêu: tầm nhìn → kết quả → dự án → hành động tiếp theo</h1>
<p><em>Nền tảng của năng suất: cấu trúc mục tiêu rõ ràng</em></p>
<hr />
<h2>Mục tiêu học tập</h2>
<ul>
<li>Hiểu bốn cấp độ của phân cấp mục tiêu: tầm nhìn, kết quả, dự án, hành động tiếp theo.</li>
<li>Tạo phân cấp mục tiêu cá nhân.</li>
<li>Học cách chia nhỏ mục tiêu lớn thành các bước cụ thể, có thể thực hiện được.</li>
</ul>
<hr />
<h2>Tại sao quan trọng</h2>
<ul>
<li><strong>Tầm nhìn</strong>: Hướng dài hạn (3-5 năm). Tại sao bạn làm những gì bạn làm?</li>
<li><strong>Kết quả</strong>: Những thay đổi có thể đo lường (6-12 tháng). Bạn muốn đạt được gì?</li>
<li><strong>Dự án</strong>: Công việc cụ thể (1-3 tháng). Những dự án nào dẫn đến kết quả?</li>
<li><strong>Hành động tiếp theo</strong>: Các hành động cụ thể (hôm nay, ngày mai). Bạn cần làm gì bây giờ?</li>
<li>Mỗi cấp độ nuôi dưỡng cấp độ tiếp theo. Không có hành động tiếp theo = không có tiến bộ.</li>
</ul>
<hr />
<h2>Giải thích</h2>
<h3>Bốn cấp độ</h3>
<p><strong>1. Tầm nhìn (3-5 năm)</strong>: Bức tranh lớn. Ví dụ: "Tôi là nhà phát triển hàng đầu xây dựng các sản phẩm có thể mở rộng."</p>
<p><strong>2. Kết quả (6-12 tháng)</strong>: Những thay đổi có thể đo lường. Ví dụ: "Đến cuối Q2: 3 khách hàng mới, tăng doanh thu 20%."</p>
<p><strong>3. Dự án (1-3 tháng)</strong>: Công việc cụ thể. Ví dụ: "Thiết kế quy trình onboarding mới", "Khởi động chiến dịch marketing."</p>
<p><strong>4. Hành động tiếp theo (hôm nay, ngày mai)</strong>: Các hành động cụ thể. Ví dụ: "Viết email về quy trình onboarding", "Lên lịch họp với nhóm marketing."</p>

<h3>Cách chúng hoạt động cùng nhau</h3>
<p>Tầm nhìn cung cấp hướng. Kết quả xác định những gì chúng ta đo lường. Dự án là công việc. Hành động tiếp theo là việc làm.</p>
<p><strong>Ví dụ</strong>:
<ul>
<li>Tầm nhìn: "Tôi là nhà phát triển hàng đầu"</li>
<li>Kết quả: "Đến cuối Q2: 3 khách hàng mới"</li>
<li>Dự án: "Quy trình onboarding mới"</li>
<li>Hành động tiếp theo: "Viết email về quy trình onboarding" (hôm nay)</li>
</ul>
</p>

<h3>Lỗi thường gặp</h3>
<ul>
<li><strong>Dự án không có tầm nhìn</strong>: Bạn đang làm, nhưng không biết tại sao.</li>
<li><strong>Dự án không có kết quả</strong>: Bạn đang làm việc, nhưng tiến bộ không thể đo lường.</li>
<li><strong>Dự án không có hành động tiếp theo</strong>: Bạn đang lập kế hoạch, nhưng không hành động.</li>
</ul>
<hr />
<h2>Bài tập thực hành (25-30 phút) — Phân cấp mục tiêu cá nhân</h2>
<ol>
<li><strong>Tầm nhìn (3-5 năm)</strong>: Viết trong 2-3 câu: "Tôi muốn ở đâu trong 3-5 năm? Tôi muốn đạt được gì?"</li>
<li><strong>Kết quả (6-12 tháng)</strong>: Chọn 2-3 kết quả có thể đo lường dẫn đến tầm nhìn. Đối với mỗi kết quả, viết cách bạn sẽ đo lường nó.</li>
<li><strong>Dự án (1-3 tháng)</strong>: Đối với mỗi kết quả, viết 2-3 dự án dẫn đến kết quả.</li>
<li><strong>Hành động tiếp theo (hôm nay, ngày mai)</strong>: Đối với mỗi dự án, viết 2-3 bước cụ thể bạn có thể thực hiện ngay bây giờ.</li>
</ol>
<hr />
<h2>Tự kiểm tra</h2>
<ul>
<li>✅ Bạn có tầm nhìn (3-5 năm).</li>
<li>✅ Bạn có 2-3 kết quả có thể đo lường (6-12 tháng).</li>
<li>✅ Đối với mỗi kết quả, bạn có 2-3 dự án (1-3 tháng).</li>
<li>✅ Đối với mỗi dự án, bạn có 2-3 hành động tiếp theo (hôm nay, ngày mai).</li>
<li>✅ Phân cấp kết nối logic: tầm nhìn → kết quả → dự án → hành động.</li>
</ul>
<hr />
<h2>Đào sâu tùy chọn</h2>
<ul>
<li>David Allen: "Getting Things Done" — về tầm quan trọng của hành động tiếp theo</li>
<li>Jim Collins: "Good to Great" — về tầm nhìn và mục tiêu</li>
<li>John Doerr: "Measure What Matters" — về OKR (Objectives and Key Results)</li>
</ul>`,
    emailSubject: 'Năng suất 2026 – Ngày 3: Phân cấp mục tiêu',
    emailBody: `<h1>Năng suất 2026 – Ngày 3</h1>
<h2>Phân cấp mục tiêu: tầm nhìn → kết quả → dự án → hành động tiếp theo</h2>
<p>Hôm nay bạn sẽ học cách xây dựng cấu trúc mục tiêu rõ ràng dẫn từ tầm nhìn đến các bước cụ thể.</p>
<p><a href="{{APP_URL}}/vi/courses/${COURSE_ID_BASE}_VI/day/3">Mở bài học →</a></p>`
  },
  id: {
    title: 'Hierarki tujuan: visi → hasil → proyek → tindakan selanjutnya',
    content: `<h1>Hierarki tujuan: visi → hasil → proyek → tindakan selanjutnya</h1>
<p><em>Dasar produktivitas: struktur tujuan yang jelas</em></p>
<hr />
<h2>Tujuan pembelajaran</h2>
<ul>
<li>Memahami empat tingkat hierarki tujuan: visi, hasil, proyek, tindakan selanjutnya.</li>
<li>Membuat hierarki tujuan pribadi.</li>
<li>Belajar cara memecah tujuan besar menjadi langkah-langkah konkret yang dapat ditindaklanjuti.</li>
</ul>
<hr />
<h2>Mengapa penting</h2>
<ul>
<li><strong>Visi</strong>: Arah jangka panjang (3-5 tahun). Mengapa Anda melakukan apa yang Anda lakukan?</li>
<li><strong>Hasil</strong>: Perubahan yang dapat diukur (6-12 bulan). Apa yang ingin Anda capai?</li>
<li><strong>Proyek</strong>: Pekerjaan konkret (1-3 bulan). Proyek apa yang mengarah pada hasil?</li>
<li><strong>Tindakan selanjutnya</strong>: Tindakan konkret (hari ini, besok). Apa yang perlu Anda lakukan sekarang?</li>
<li>Setiap tingkat memberi makan tingkat berikutnya. Tidak ada tindakan selanjutnya = tidak ada kemajuan.</li>
</ul>
<hr />
<h2>Penjelasan</h2>
<h3>Empat tingkat</h3>
<p><strong>1. Visi (3-5 tahun)</strong>: Gambaran besar. Misalnya: "Saya adalah pengembang utama yang membangun produk yang dapat diskalakan."</p>
<p><strong>2. Hasil (6-12 bulan)</strong>: Perubahan yang dapat diukur. Misalnya: "Pada akhir Q2: 3 klien baru, pertumbuhan pendapatan 20%."</p>
<p><strong>3. Proyek (1-3 bulan)</strong>: Pekerjaan konkret. Misalnya: "Merancang proses onboarding baru", "Meluncurkan kampanye pemasaran."</p>
<p><strong>4. Tindakan selanjutnya (hari ini, besok)</strong>: Tindakan konkret. Misalnya: "Menulis email tentang proses onboarding", "Menjadwalkan pertemuan dengan tim pemasaran."</p>

<h3>Bagaimana mereka bekerja bersama</h3>
<p>Visi memberikan arah. Hasil mendefinisikan apa yang kita ukur. Proyek adalah pekerjaan. Tindakan selanjutnya adalah melakukan.</p>
<p><strong>Contoh</strong>:
<ul>
<li>Visi: "Saya adalah pengembang utama"</li>
<li>Hasil: "Pada akhir Q2: 3 klien baru"</li>
<li>Proyek: "Proses onboarding baru"</li>
<li>Tindakan selanjutnya: "Menulis email tentang proses onboarding" (hari ini)</li>
</ul>
</p>

<h3>Kesalahan umum</h3>
<ul>
<li><strong>Proyek tanpa visi</strong>: Anda melakukan, tetapi tidak tahu mengapa.</li>
<li><strong>Proyek tanpa hasil</strong>: Anda bekerja, tetapi kemajuan tidak dapat diukur.</li>
<li><strong>Proyek tanpa tindakan selanjutnya</strong>: Anda merencanakan, tetapi tidak bertindak.</li>
</ul>
<hr />
<h2>Latihan praktis (25-30 menit) — Hierarki tujuan pribadi</h2>
<ol>
<li><strong>Visi (3-5 tahun)</strong>: Tulis dalam 2-3 kalimat: "Di mana saya ingin berada dalam 3-5 tahun? Apa yang ingin saya capai?"</li>
<li><strong>Hasil (6-12 bulan)</strong>: Pilih 2-3 hasil yang dapat diukur yang mengarah pada visi. Untuk setiap hasil, tulis bagaimana Anda akan mengukurnya.</li>
<li><strong>Proyek (1-3 bulan)</strong>: Untuk setiap hasil, tulis 2-3 proyek yang mengarah pada hasil.</li>
<li><strong>Tindakan selanjutnya (hari ini, besok)</strong>: Untuk setiap proyek, tulis 2-3 langkah konkret yang dapat Anda ambil sekarang.</li>
</ol>
<hr />
<h2>Pemeriksaan diri</h2>
<ul>
<li>✅ Anda memiliki visi (3-5 tahun).</li>
<li>✅ Anda memiliki 2-3 hasil yang dapat diukur (6-12 bulan).</li>
<li>✅ Untuk setiap hasil, Anda memiliki 2-3 proyek (1-3 bulan).</li>
<li>✅ Untuk setiap proyek, Anda memiliki 2-3 tindakan selanjutnya (hari ini, besok).</li>
<li>✅ Hierarki terhubung secara logis: visi → hasil → proyek → tindakan.</li>
</ul>
<hr />
<h2>Pendalaman opsional</h2>
<ul>
<li>David Allen: "Getting Things Done" — tentang pentingnya tindakan selanjutnya</li>
<li>Jim Collins: "Good to Great" — tentang visi dan tujuan</li>
<li>John Doerr: "Measure What Matters" — tentang OKR (Objectives and Key Results)</li>
</ul>`,
    emailSubject: 'Produktivitas 2026 – Hari 3: Hierarki tujuan',
    emailBody: `<h1>Produktivitas 2026 – Hari 3</h1>
<h2>Hierarki tujuan: visi → hasil → proyek → tindakan selanjutnya</h2>
<p>Hari ini Anda akan mempelajari cara membangun struktur tujuan yang jelas yang mengarah dari visi ke langkah-langkah konkret.</p>
<p><a href="{{APP_URL}}/id/courses/${COURSE_ID_BASE}_ID/day/3">Buka pelajaran →</a></p>`
  },
  ar: {
    title: 'تسلسل الهدف: الرؤية → النتائج → المشاريع → الإجراءات التالية',
    content: `<h1>تسلسل الهدف: الرؤية → النتائج → المشاريع → الإجراءات التالية</h1>
<p><em>أساس الإنتاجية: هيكل هدف واضح</em></p>
<hr />
<h2>هدف التعلم</h2>
<ul>
<li>فهم المستويات الأربعة لتسلسل الهدف: الرؤية، النتائج، المشاريع، الإجراءات التالية.</li>
<li>إنشاء تسلسل هدف شخصي.</li>
<li>تعلم كيفية تقسيم الأهداف الكبيرة إلى خطوات ملموسة وقابلة للتنفيذ.</li>
</ul>
<hr />
<h2>لماذا يهم</h2>
<ul>
<li><strong>الرؤية</strong>: الاتجاه طويل الأمد (3-5 سنوات). لماذا تفعل ما تفعله؟</li>
<li><strong>النتائج</strong>: التغييرات القابلة للقياس (6-12 شهرًا). ماذا تريد أن تحقق؟</li>
<li><strong>المشاريع</strong>: العمل الملموس (1-3 أشهر). ما المشاريع التي تؤدي إلى النتائج؟</li>
<li><strong>الإجراءات التالية</strong>: الإجراءات الملموسة (اليوم، غدًا). ماذا تحتاج أن تفعل الآن؟</li>
<li>كل مستوى يغذي التالي. لا توجد إجراءات تالية = لا يوجد تقدم.</li>
</ul>
<hr />
<h2>شرح</h2>
<h3>المستويات الأربعة</h3>
<p><strong>1. الرؤية (3-5 سنوات)</strong>: الصورة الكبيرة. على سبيل المثال: "أنا مطور رئيسي يبني منتجات قابلة للتوسع."</p>
<p><strong>2. النتائج (6-12 شهرًا)</strong>: تغييرات قابلة للقياس. على سبيل المثال: "بحلول نهاية Q2: 3 عملاء جدد، نمو الإيرادات 20%."</p>
<p><strong>3. المشاريع (1-3 أشهر)</strong>: عمل ملموس. على سبيل المثال: "تصميم عملية إدماج جديدة", "إطلاق حملة تسويقية."</p>
<p><strong>4. الإجراءات التالية (اليوم، غدًا)</strong>: إجراءات ملموسة. على سبيل المثال: "كتابة بريد إلكتروني حول عملية الإدماج", "جدولة اجتماع مع فريق التسويق."</p>

<h3>كيف يعملون معًا</h3>
<p>الرؤية توفر الاتجاه. النتائج تحدد ما نقيسه. المشاريع هي العمل. الإجراءات التالية هي الفعل.</p>
<p><strong>مثال</strong>:
<ul>
<li>الرؤية: "أنا مطور رئيسي"</li>
<li>النتيجة: "بحلول نهاية Q2: 3 عملاء جدد"</li>
<li>المشروع: "عملية إدماج جديدة"</li>
<li>الإجراء التالي: "كتابة بريد إلكتروني حول عملية الإدماج" (اليوم)</li>
</ul>
</p>

<h3>الأخطاء الشائعة</h3>
<ul>
<li><strong>مشاريع بدون رؤية</strong>: أنت تفعل، لكن لا تعرف لماذا.</li>
<li><strong>مشاريع بدون نتائج</strong>: أنت تعمل، لكن التقدم غير قابل للقياس.</li>
<li><strong>مشاريع بدون إجراءات تالية</strong>: أنت تخطط، لكن لا تتصرف.</li>
</ul>
<hr />
<h2>تمرين عملي (25-30 دقيقة) — تسلسل الهدف الشخصي</h2>
<ol>
<li><strong>الرؤية (3-5 سنوات)</strong>: اكتب في 2-3 جمل: "أين أريد أن أكون في 3-5 سنوات؟ ماذا أريد أن أحقق؟"</li>
<li><strong>النتائج (6-12 شهرًا)</strong>: اختر 2-3 نتائج قابلة للقياس تؤدي إلى الرؤية. لكل نتيجة، اكتب كيف ستقيسها.</li>
<li><strong>المشاريع (1-3 أشهر)</strong>: لكل نتيجة، اكتب 2-3 مشاريع تؤدي إلى النتيجة.</li>
<li><strong>الإجراءات التالية (اليوم، غدًا)</strong>: لكل مشروع، اكتب 2-3 خطوات ملموسة يمكنك اتخاذها الآن.</li>
</ol>
<hr />
<h2>الفحص الذاتي</h2>
<ul>
<li>✅ لديك رؤية (3-5 سنوات).</li>
<li>✅ لديك 2-3 نتائج قابلة للقياس (6-12 شهرًا).</li>
<li>✅ لكل نتيجة، لديك 2-3 مشاريع (1-3 أشهر).</li>
<li>✅ لكل مشروع، لديك 2-3 إجراءات تالية (اليوم، غدًا).</li>
<li>✅ التسلسل متصل منطقيًا: الرؤية → النتائج → المشاريع → الإجراءات.</li>
</ul>
<hr />
<h2>تعميق اختياري</h2>
<ul>
<li>David Allen: "Getting Things Done" — حول أهمية الإجراءات التالية</li>
<li>Jim Collins: "Good to Great" — حول الرؤية والأهداف</li>
<li>John Doerr: "Measure What Matters" — حول OKR (Objectives and Key Results)</li>
</ul>`,
    emailSubject: 'الإنتاجية 2026 – اليوم 3: تسلسل الهدف',
    emailBody: `<h1>الإنتاجية 2026 – اليوم 3</h1>
<h2>تسلسل الهدف: الرؤية → النتائج → المشاريع → الإجراءات التالية</h2>
<p>اليوم سوف تتعلم كيفية بناء هيكل هدف واضح يؤدي من الرؤية إلى خطوات ملموسة.</p>
<p><a href="{{APP_URL}}/ar/courses/${COURSE_ID_BASE}_AR/day/3">افتح الدرس →</a></p>`
  },
  pt: {
    title: 'Hierarquia de objetivos: visão → resultados → projetos → próximas ações',
    content: `<h1>Hierarquia de objetivos: visão → resultados → projetos → próximas ações</h1>
<p><em>A base da produtividade: estrutura clara de objetivos</em></p>
<hr />
<h2>Objetivo de aprendizagem</h2>
<ul>
<li>Entender os quatro níveis da hierarquia de objetivos: visão, resultados, projetos, próximas ações.</li>
<li>Criar uma hierarquia de objetivos pessoal.</li>
<li>Aprender como dividir grandes objetivos em passos concretos e acionáveis.</li>
</ul>
<hr />
<h2>Por que importa</h2>
<ul>
<li><strong>Visão</strong>: A direção de longo prazo (3-5 anos). Por que você faz o que faz?</li>
<li><strong>Resultados</strong>: As mudanças mensuráveis (6-12 meses). O que você quer alcançar?</li>
<li><strong>Projetos</strong>: O trabalho concreto (1-3 meses). Quais projetos levam aos resultados?</li>
<li><strong>Próximas ações</strong>: As ações concretas (hoje, amanhã). O que você precisa fazer agora?</li>
<li>Cada nível alimenta o próximo. Sem próximas ações = sem progresso.</li>
</ul>
<hr />
<h2>Explicação</h2>
<h3>Os quatro níveis</h3>
<p><strong>1. Visão (3-5 anos)</strong>: O quadro geral. Por exemplo: "Sou um desenvolvedor líder que constrói produtos escaláveis."</p>
<p><strong>2. Resultados (6-12 meses)</strong>: Mudanças mensuráveis. Por exemplo: "Até o final do Q2: 3 novos clientes, crescimento de receita de 20%."</p>
<p><strong>3. Projetos (1-3 meses)</strong>: Trabalho concreto. Por exemplo: "Projetar novo processo de onboarding", "Lançar campanha de marketing."</p>
<p><strong>4. Próximas ações (hoje, amanhã)</strong>: Ações concretas. Por exemplo: "Escrever e-mail sobre processo de onboarding", "Agendar reunião com equipe de marketing."</p>

<h3>Como funcionam juntos</h3>
<p>A visão fornece direção. Os resultados definem o que medimos. Os projetos são o trabalho. As próximas ações são o fazer.</p>
<p><strong>Exemplo</strong>:
<ul>
<li>Visão: "Sou um desenvolvedor líder"</li>
<li>Resultado: "Até o final do Q2: 3 novos clientes"</li>
<li>Projeto: "Novo processo de onboarding"</li>
<li>Próxima ação: "Escrever e-mail sobre processo de onboarding" (hoje)</li>
</ul>
</p>

<h3>Erros comuns</h3>
<ul>
<li><strong>Projetos sem visão</strong>: Você está fazendo, mas não sabe por quê.</li>
<li><strong>Projetos sem resultados</strong>: Você está trabalhando, mas o progresso não é mensurável.</li>
<li><strong>Projetos sem próximas ações</strong>: Você está planejando, mas não está agindo.</li>
</ul>
<hr />
<h2>Exercício prático (25-30 min) — Hierarquia de objetivos pessoal</h2>
<ol>
<li><strong>Visão (3-5 anos)</strong>: Escreva em 2-3 frases: "Onde quero estar em 3-5 anos? O que quero alcançar?"</li>
<li><strong>Resultados (6-12 meses)</strong>: Escolha 2-3 resultados mensuráveis que levam à visão. Para cada resultado, escreva como você o medirá.</li>
<li><strong>Projetos (1-3 meses)</strong>: Para cada resultado, escreva 2-3 projetos que levam ao resultado.</li>
<li><strong>Próximas ações (hoje, amanhã)</strong>: Para cada projeto, escreva 2-3 passos concretos que você pode tomar agora.</li>
</ol>
<hr />
<h2>Auto-verificação</h2>
<ul>
<li>✅ Você tem uma visão (3-5 anos).</li>
<li>✅ Você tem 2-3 resultados mensuráveis (6-12 meses).</li>
<li>✅ Para cada resultado, você tem 2-3 projetos (1-3 meses).</li>
<li>✅ Para cada projeto, você tem 2-3 próximas ações (hoje, amanhã).</li>
<li>✅ A hierarquia se conecta logicamente: visão → resultados → projetos → ações.</li>
</ul>
<hr />
<h2>Aprofundamento opcional</h2>
<ul>
<li>David Allen: "Getting Things Done" — sobre a importância das próximas ações</li>
<li>Jim Collins: "Good to Great" — sobre visão e objetivos</li>
<li>John Doerr: "Measure What Matters" — sobre OKRs (Objectives and Key Results)</li>
</ul>`,
    emailSubject: 'Produtividade 2026 – Dia 3: Hierarquia de objetivos',
    emailBody: `<h1>Produtividade 2026 – Dia 3</h1>
<h2>Hierarquia de objetivos: visão → resultados → projetos → próximas ações</h2>
<p>Hoje você aprenderá como construir uma estrutura clara de objetivos que leva da visão a passos concretos.</p>
<p><a href="{{APP_URL}}/pt/courses/${COURSE_ID_BASE}_PT/day/3">Abrir a lição →</a></p>`
  },
  hi: {
    title: 'लक्ष्य पदानुक्रम: दृष्टि → परिणाम → परियोजनाएं → अगले कार्य',
    content: `<h1>लक्ष्य पदानुक्रम: दृष्टि → परिणाम → परियोजनाएं → अगले कार्य</h1>
<p><em>उत्पादकता की नींव: स्पष्ट लक्ष्य संरचना</em></p>
<hr />
<h2>सीखने का लक्ष्य</h2>
<ul>
<li>लक्ष्य पदानुक्रम के चार स्तरों को समझना: दृष्टि, परिणाम, परियोजनाएं, अगले कार्य।</li>
<li>एक व्यक्तिगत लक्ष्य पदानुक्रम बनाना।</li>
<li>बड़े लक्ष्यों को ठोस, कार्रवाई योग्य कदमों में कैसे तोड़ना है, यह सीखना।</li>
</ul>
<hr />
<h2>क्यों महत्वपूर्ण है</h2>
<ul>
<li><strong>दृष्टि</strong>: दीर्घकालिक दिशा (3-5 वर्ष)। आप जो करते हैं वह क्यों करते हैं?</li>
<li><strong>परिणाम</strong>: मापने योग्य परिवर्तन (6-12 महीने)। आप क्या हासिल करना चाहते हैं?</li>
<li><strong>परियोजनाएं</strong>: ठोस कार्य (1-3 महीने)। कौन सी परियोजनाएं परिणामों की ओर ले जाती हैं?</li>
<li><strong>अगले कार्य</strong>: ठोस कार्य (आज, कल)। आपको अभी क्या करने की आवश्यकता है?</li>
<li>प्रत्येक स्तर अगले को पोषण देता है। कोई अगला कार्य नहीं = कोई प्रगति नहीं।</li>
</ul>
<hr />
<h2>व्याख्या</h2>
<h3>चार स्तर</h3>
<p><strong>1. दृष्टि (3-5 वर्ष)</strong>: बड़ी तस्वीर। उदाहरण: "मैं एक प्रमुख डेवलपर हूं जो स्केलेबल उत्पाद बनाता है।"</p>
<p><strong>2. परिणाम (6-12 महीने)</strong>: मापने योग्य परिवर्तन। उदाहरण: "Q2 के अंत तक: 3 नए ग्राहक, 20% राजस्व वृद्धि।"</p>
<p><strong>3. परियोजनाएं (1-3 महीने)</strong>: ठोस कार्य। उदाहरण: "नई ऑनबोर्डिंग प्रक्रिया डिजाइन करना", "मार्केटिंग अभियान लॉन्च करना।"</p>
<p><strong>4. अगले कार्य (आज, कल)</strong>: ठोस कार्य। उदाहरण: "ऑनबोर्डिंग प्रक्रिया के बारे में ईमेल लिखना", "मार्केटिंग टीम के साथ बैठक निर्धारित करना।"</p>

<h3>वे एक साथ कैसे काम करते हैं</h3>
<p>दृष्टि दिशा प्रदान करती है। परिणाम परिभाषित करते हैं कि हम क्या मापते हैं। परियोजनाएं कार्य हैं। अगले कार्य करना है।</p>
<p><strong>उदाहरण</strong>:
<ul>
<li>दृष्टि: "मैं एक प्रमुख डेवलपर हूं"</li>
<li>परिणाम: "Q2 के अंत तक: 3 नए ग्राहक"</li>
<li>परियोजना: "नई ऑनबोर्डिंग प्रक्रिया"</li>
<li>अगला कार्य: "ऑनबोर्डिंग प्रक्रिया के बारे में ईमेल लिखना" (आज)</li>
</ul>
</p>

<h3>सामान्य गलतियां</h3>
<ul>
<li><strong>दृष्टि के बिना परियोजनाएं</strong>: आप कर रहे हैं, लेकिन नहीं जानते क्यों।</li>
<li><strong>परिणामों के बिना परियोजनाएं</strong>: आप काम कर रहे हैं, लेकिन प्रगति मापने योग्य नहीं है।</li>
<li><strong>अगले कार्यों के बिना परियोजनाएं</strong>: आप योजना बना रहे हैं, लेकिन कार्रवाई नहीं कर रहे।</li>
</ul>
<hr />
<h2>व्यावहारिक अभ्यास (25-30 मिनट) — व्यक्तिगत लक्ष्य पदानुक्रम</h2>
<ol>
<li><strong>दृष्टि (3-5 वर्ष)</strong>: 2-3 वाक्यों में लिखें: "मैं 3-5 वर्षों में कहां होना चाहता हूं? मैं क्या हासिल करना चाहता हूं?"</li>
<li><strong>परिणाम (6-12 महीने)</strong>: 2-3 मापने योग्य परिणाम चुनें जो दृष्टि की ओर ले जाते हैं। प्रत्येक परिणाम के लिए, लिखें कि आप इसे कैसे मापेंगे।</li>
<li><strong>परियोजनाएं (1-3 महीने)</strong>: प्रत्येक परिणाम के लिए, 2-3 परियोजनाएं लिखें जो परिणाम की ओर ले जाती हैं।</li>
<li><strong>अगले कार्य (आज, कल)</strong>: प्रत्येक परियोजना के लिए, 2-3 ठोस कदम लिखें जो आप अभी उठा सकते हैं।</li>
</ol>
<hr />
<h2>स्व-जांच</h2>
<ul>
<li>✅ आपके पास एक दृष्टि है (3-5 वर्ष)।</li>
<li>✅ आपके पास 2-3 मापने योग्य परिणाम हैं (6-12 महीने)।</li>
<li>✅ प्रत्येक परिणाम के लिए, आपके पास 2-3 परियोजनाएं हैं (1-3 महीने)।</li>
<li>✅ प्रत्येक परियोजना के लिए, आपके पास 2-3 अगले कार्य हैं (आज, कल)।</li>
<li>✅ पदानुक्रम तार्किक रूप से जुड़ता है: दृष्टि → परिणाम → परियोजनाएं → कार्य।</li>
</ul>
<hr />
<h2>वैकल्पिक गहराई</h2>
<ul>
<li>David Allen: "Getting Things Done" — अगले कार्यों के महत्व के बारे में</li>
<li>Jim Collins: "Good to Great" — दृष्टि और लक्ष्यों के बारे में</li>
<li>John Doerr: "Measure What Matters" — OKR के बारे में (Objectives and Key Results)</li>
</ul>`,
    emailSubject: 'उत्पादकता 2026 – दिन 3: लक्ष्य पदानुक्रम',
    emailBody: `<h1>उत्पादकता 2026 – दिन 3</h1>
<h2>लक्ष्य पदानुक्रम: दृष्टि → परिणाम → परियोजनाएं → अगले कार्य</h2>
<p>आज आप सीखेंगे कि दृष्टि से ठोस कदमों तक जाने वाली स्पष्ट लक्ष्य संरचना कैसे बनाई जाए।</p>
<p><a href="{{APP_URL}}/hi/courses/${COURSE_ID_BASE}_HI/day/3">पाठ खोलें →</a></p>`
  }
};

// Quiz 3 Questions
const QUIZ_3: Record<string, Array<{
  question: string;
  options: string[];
  correctIndex: number;
}>> = {
  hu: [
    {
      question: 'Hány szintje van a célhierarchiának?',
      options: [
        '2',
        '3',
        '4',
        '5'
      ],
      correctIndex: 2
    },
    {
      question: 'Melyik a legmagasabb szint a célhierarchiában?',
      options: [
        'Következő lépések',
        'Projektek',
        'Eredmények',
        'Vízió'
      ],
      correctIndex: 3
    },
    {
      question: 'Milyen időtávra szól a vízió?',
      options: [
        '1-2 év',
        '3-5 év',
        '6-12 hónap',
        '1-3 hónap'
      ],
      correctIndex: 1
    },
    {
      question: 'Mi a következő lépés definíciója?',
      options: [
        'Egy nagy projekt',
        'Egy mérhető eredmény',
        'Egy konkrét, cselekvésre kész lépés (ma, holnap)',
        'Egy hosszú távú cél'
      ],
      correctIndex: 2
    },
    {
      question: 'Mi a gyakori hiba, ha projekteket csinálsz vízió nélkül?',
      options: [
        'Túl lassan haladsz',
        'Nem tudod, miért csinálod',
        'Túl gyorsan haladsz',
        'Nincs hiba'
      ],
      correctIndex: 1
    }
  ],
  en: [
    {
      question: 'How many levels does the goal hierarchy have?',
      options: [
        '2',
        '3',
        '4',
        '5'
      ],
      correctIndex: 2
    },
    {
      question: 'Which is the highest level in the goal hierarchy?',
      options: [
        'Next actions',
        'Projects',
        'Outcomes',
        'Vision'
      ],
      correctIndex: 3
    },
    {
      question: 'What time frame does vision cover?',
      options: [
        '1-2 years',
        '3-5 years',
        '6-12 months',
        '1-3 months'
      ],
      correctIndex: 1
    },
    {
      question: 'What is the definition of a next action?',
      options: [
        'A big project',
        'A measurable outcome',
        'A concrete, actionable step (today, tomorrow)',
        'A long-term goal'
      ],
      correctIndex: 2
    },
    {
      question: 'What is the common mistake when doing projects without vision?',
      options: [
        'You progress too slowly',
        'You don\'t know why you\'re doing it',
        'You progress too quickly',
        'There\'s no mistake'
      ],
      correctIndex: 1
    }
  ],
  tr: [
    {
      question: 'Hedef hiyerarşisinin kaç seviyesi vardır?',
      options: [
        '2',
        '3',
        '4',
        '5'
      ],
      correctIndex: 2
    },
    {
      question: 'Hedef hiyerarşisinde en yüksek seviye hangisidir?',
      options: [
        'Sonraki adımlar',
        'Projeler',
        'Sonuçlar',
        'Vizyon'
      ],
      correctIndex: 3
    },
    {
      question: 'Vizyon hangi zaman dilimini kapsar?',
      options: [
        '1-2 yıl',
        '3-5 yıl',
        '6-12 ay',
        '1-3 ay'
      ],
      correctIndex: 1
    },
    {
      question: 'Sonraki adımın tanımı nedir?',
      options: [
        'Büyük bir proje',
        'Ölçülebilir bir sonuç',
        'Somut, uygulanabilir bir adım (bugün, yarın)',
        'Uzun vadeli bir hedef'
      ],
      correctIndex: 2
    },
    {
      question: 'Vizyonsuz projeler yaparken yaygın hata nedir?',
      options: [
        'Çok yavaş ilerliyorsunuz',
        'Neden yaptığınızı bilmiyorsunuz',
        'Çok hızlı ilerliyorsunuz',
        'Hata yok'
      ],
      correctIndex: 1
    }
  ],
  bg: [
    {
      question: 'Колко нива има йерархията на целите?',
      options: [
        '2',
        '3',
        '4',
        '5'
      ],
      correctIndex: 2
    },
    {
      question: 'Кое е най-високото ниво в йерархията на целите?',
      options: [
        'Следващи стъпки',
        'Проекти',
        'Резултати',
        'Визия'
      ],
      correctIndex: 3
    },
    {
      question: 'Какъв период от време покрива визията?',
      options: [
        '1-2 години',
        '3-5 години',
        '6-12 месеца',
        '1-3 месеца'
      ],
      correctIndex: 1
    },
    {
      question: 'Какво е определението за следваща стъпка?',
      options: [
        'Голям проект',
        'Измерим резултат',
        'Конкретна, изпълнима стъпка (днес, утре)',
        'Дългосрочна цел'
      ],
      correctIndex: 2
    },
    {
      question: 'Каква е често срещаната грешка при правене на проекти без визия?',
      options: [
        'Напредвате твърде бавно',
        'Не знаете защо го правите',
        'Напредвате твърде бързо',
        'Няма грешка'
      ],
      correctIndex: 1
    }
  ],
  pl: [
    {
      question: 'Ile poziomów ma hierarchia celów?',
      options: [
        '2',
        '3',
        '4',
        '5'
      ],
      correctIndex: 2
    },
    {
      question: 'Który jest najwyższym poziomem w hierarchii celów?',
      options: [
        'Następne kroki',
        'Projekty',
        'Rezultaty',
        'Wizja'
      ],
      correctIndex: 3
    },
    {
      question: 'Jaki okres czasu obejmuje wizja?',
      options: [
        '1-2 lata',
        '3-5 lat',
        '6-12 miesięcy',
        '1-3 miesiące'
      ],
      correctIndex: 1
    },
    {
      question: 'Jaka jest definicja następnego kroku?',
      options: [
        'Duży projekt',
        'Mierzalny rezultat',
        'Konkretny, wykonalny krok (dzisiaj, jutro)',
        'Długoterminowy cel'
      ],
      correctIndex: 2
    },
    {
      question: 'Jaki jest typowy błąd przy robieniu projektów bez wizji?',
      options: [
        'Postępujesz zbyt wolno',
        'Nie wiesz dlaczego to robisz',
        'Postępujesz zbyt szybko',
        'Nie ma błędu'
      ],
      correctIndex: 1
    }
  ],
  vi: [
    {
      question: 'Phân cấp mục tiêu có bao nhiêu cấp độ?',
      options: [
        '2',
        '3',
        '4',
        '5'
      ],
      correctIndex: 2
    },
    {
      question: 'Cấp độ cao nhất trong phân cấp mục tiêu là gì?',
      options: [
        'Hành động tiếp theo',
        'Dự án',
        'Kết quả',
        'Tầm nhìn'
      ],
      correctIndex: 3
    },
    {
      question: 'Tầm nhìn bao gồm khung thời gian nào?',
      options: [
        '1-2 năm',
        '3-5 năm',
        '6-12 tháng',
        '1-3 tháng'
      ],
      correctIndex: 1
    },
    {
      question: 'Định nghĩa của hành động tiếp theo là gì?',
      options: [
        'Một dự án lớn',
        'Một kết quả có thể đo lường',
        'Một bước cụ thể, có thể thực hiện (hôm nay, ngày mai)',
        'Một mục tiêu dài hạn'
      ],
      correctIndex: 2
    },
    {
      question: 'Lỗi thường gặp khi làm dự án không có tầm nhìn là gì?',
      options: [
        'Bạn tiến bộ quá chậm',
        'Bạn không biết tại sao bạn làm điều đó',
        'Bạn tiến bộ quá nhanh',
        'Không có lỗi'
      ],
      correctIndex: 1
    }
  ],
  id: [
    {
      question: 'Berapa banyak tingkat yang dimiliki hierarki tujuan?',
      options: [
        '2',
        '3',
        '4',
        '5'
      ],
      correctIndex: 2
    },
    {
      question: 'Mana yang merupakan tingkat tertinggi dalam hierarki tujuan?',
      options: [
        'Tindakan selanjutnya',
        'Proyek',
        'Hasil',
        'Visi'
      ],
      correctIndex: 3
    },
    {
      question: 'Rentang waktu apa yang dicakup oleh visi?',
      options: [
        '1-2 tahun',
        '3-5 tahun',
        '6-12 bulan',
        '1-3 bulan'
      ],
      correctIndex: 1
    },
    {
      question: 'Apa definisi tindakan selanjutnya?',
      options: [
        'Proyek besar',
        'Hasil yang dapat diukur',
        'Langkah konkret yang dapat ditindaklanjuti (hari ini, besok)',
        'Tujuan jangka panjang'
      ],
      correctIndex: 2
    },
    {
      question: 'Apa kesalahan umum saat melakukan proyek tanpa visi?',
      options: [
        'Anda maju terlalu lambat',
        'Anda tidak tahu mengapa Anda melakukannya',
        'Anda maju terlalu cepat',
        'Tidak ada kesalahan'
      ],
      correctIndex: 1
    }
  ],
  ar: [
    {
      question: 'كم مستوى في تسلسل الهدف؟',
      options: [
        '2',
        '3',
        '4',
        '5'
      ],
      correctIndex: 2
    },
    {
      question: 'ما هو أعلى مستوى في تسلسل الهدف؟',
      options: [
        'الإجراءات التالية',
        'المشاريع',
        'النتائج',
        'الرؤية'
      ],
      correctIndex: 3
    },
    {
      question: 'ما الإطار الزمني الذي تغطيه الرؤية؟',
      options: [
        '1-2 سنة',
        '3-5 سنوات',
        '6-12 شهرًا',
        '1-3 أشهر'
      ],
      correctIndex: 1
    },
    {
      question: 'ما تعريف الإجراء التالي؟',
      options: [
        'مشروع كبير',
        'نتيجة قابلة للقياس',
        'خطوة ملموسة وقابلة للتنفيذ (اليوم، غدًا)',
        'هدف طويل الأمد'
      ],
      correctIndex: 2
    },
    {
      question: 'ما الخطأ الشائع عند القيام بمشاريع بدون رؤية؟',
      options: [
        'تتقدم ببطء شديد',
        'لا تعرف لماذا تفعل ذلك',
        'تتقدم بسرعة شديدة',
        'لا يوجد خطأ'
      ],
      correctIndex: 1
    }
  ],
  pt: [
    {
      question: 'Quantos níveis tem a hierarquia de objetivos?',
      options: [
        '2',
        '3',
        '4',
        '5'
      ],
      correctIndex: 2
    },
    {
      question: 'Qual é o nível mais alto na hierarquia de objetivos?',
      options: [
        'Próximas ações',
        'Projetos',
        'Resultados',
        'Visão'
      ],
      correctIndex: 3
    },
    {
      question: 'Que período de tempo a visão cobre?',
      options: [
        '1-2 anos',
        '3-5 anos',
        '6-12 meses',
        '1-3 meses'
      ],
      correctIndex: 1
    },
    {
      question: 'Qual é a definição de uma próxima ação?',
      options: [
        'Um grande projeto',
        'Um resultado mensurável',
        'Um passo concreto e acionável (hoje, amanhã)',
        'Um objetivo de longo prazo'
      ],
      correctIndex: 2
    },
    {
      question: 'Qual é o erro comum ao fazer projetos sem visão?',
      options: [
        'Você progride muito devagar',
        'Você não sabe por que está fazendo isso',
        'Você progride muito rápido',
        'Não há erro'
      ],
      correctIndex: 1
    }
  ],
  hi: [
    {
      question: 'लक्ष्य पदानुक्रम के कितने स्तर हैं?',
      options: [
        '2',
        '3',
        '4',
        '5'
      ],
      correctIndex: 2
    },
    {
      question: 'लक्ष्य पदानुक्रम में सबसे ऊंचा स्तर कौन सा है?',
      options: [
        'अगले कार्य',
        'परियोजनाएं',
        'परिणाम',
        'दृष्टि'
      ],
      correctIndex: 3
    },
    {
      question: 'दृष्टि किस समय सीमा को कवर करती है?',
      options: [
        '1-2 वर्ष',
        '3-5 वर्ष',
        '6-12 महीने',
        '1-3 महीने'
      ],
      correctIndex: 1
    },
    {
      question: 'अगले कार्य की परिभाषा क्या है?',
      options: [
        'एक बड़ी परियोजना',
        'एक मापने योग्य परिणाम',
        'एक ठोस, कार्रवाई योग्य कदम (आज, कल)',
        'एक दीर्घकालिक लक्ष्य'
      ],
      correctIndex: 2
    },
    {
      question: 'दृष्टि के बिना परियोजनाएं करते समय सामान्य गलती क्या है?',
      options: [
        'आप बहुत धीरे-धीरे आगे बढ़ते हैं',
        'आप नहीं जानते कि आप ऐसा क्यों कर रहे हैं',
        'आप बहुत तेजी से आगे बढ़ते हैं',
        'कोई गलती नहीं है'
      ],
      correctIndex: 1
    }
  ]
};

// Seed lesson 3 for specific languages
async function seedLesson3ForLanguages(
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

    const lessonContent = LESSON_3[lang];
    const quizQuestions = QUIZ_3[lang];

    if (!lessonContent || !quizQuestions) {
      console.log(`⚠️  Content not ready for ${lang}, skipping...`);
      continue;
    }

    const lessonId = `${courseId}_DAY_03`;

    // Create/update lesson
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId,
          courseId: course._id,
          dayNumber: 3,
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

    console.log(`  ✅ Lesson 3 for ${lang} created/updated`);

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
            category: 'Goal Hierarchy',
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
    console.log(`  ✅ Quiz 3 (${quizQuestions.length} questions) for ${lang} created/updated`);
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

  console.log('📚 Processing Lesson 3 (Day 3: Goal hierarchy)...\n');
  
  // Process in batches of 2 languages
  for (const [pairIndex, pair] of LANGUAGE_PAIRS.entries()) {
    console.log(`  Batch ${pairIndex + 1}/5: ${pair.join(', ')}`);
    await seedLesson3ForLanguages(pair, brand, appUrl);
    console.log(`  ✅ Batch ${pairIndex + 1} completed\n`);
  }
  
  console.log('✅ Lesson 3 completed for all languages!');
  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
