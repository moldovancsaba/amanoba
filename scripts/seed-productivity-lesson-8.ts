/**
 * Seed Productivity 2026 Course - Lesson 8 (Day 8)
 * 
 * Day 8: Context Switching Cost - attention residue, batching, deep work blocks
 * 
 * Creates lesson 8 for all 10 languages in 2-language batches
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
// LESSON 8: Context Switching Cost
// ============================================================================

const LESSON_8: Record<string, {
  title: string;
  content: string;
  emailSubject: string;
  emailBody: string;
}> = {
  hu: {
    title: 'Kontextusváltás költsége: figyelmi maradványa, kötegelt feldolgozás, mély munkablokkok',
    content: `<h1>Kontextusváltás költsége: figyelmi maradványa, kötegelt feldolgozás, mély munkablokkok</h1>
<p><em>A többfeladatosság hazugság. A fokusz egy felső liga sportja.</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
<li>Megérteni, hogyan működik a figyelmi maradványa (attention residue) és miért olyan költséges.</li>
<li>Megtanulni, hogyan lehet kötegelt feldolgozást (batching) alkalmazni a kontextusváltás minimalizálásához.</li>
<li>Mély munkablokkok (deep work blocks) létrehozása a maximális produktivitáshoz.</li>
<li>Mérni a kontextusváltás valós költségét az Ön munkájára.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
<li><strong>Figyelmi maradványa</strong>: Amikor váltunk a feladatok között, 10-25 perc szükséges ahhoz, hogy teljesen refokuszáljunk.</li>
<li><strong>Termelékenység veszteség</strong>: Az egy nap során előforduló kontextusváltások akár 40%-os produktivitási veszteséget okozhatnak.</li>
<li><strong>Minőség romlik</strong>: A szétszórt figyelem azt jelenti, hogy a munka kevésbé gondosan készül el.</li>
<li><strong>Stressz nő</strong>: A kontextusváltás mentális terhelést hoz, amely a nap végén fáradtsághoz vezet.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>1. Figyelmi maradványa (Attention Residue)</h3>
<ul>
<li>Ha az egyik feladatról a másikra váltunk, az agynk részei még az előző feladaton maradnak.</li>
<li>Ez a "figyelmi maradványa".</li>
<li>Kutatások azt mutatják: 10-25 perc szükséges a teljes refokuszáláshoz.</li>
<li><strong>Megoldás</strong>: Minimalizáljuk a váltásokat.</li>
</ul>
<h3>2. Kötegelt feldolgozás (Batching)</h3>
<ul>
<li>Csoportosítsd az ugyanolyan típusú feladatokat.</li>
<li>Például: 9:00-9:30: E-mailek. 10:00-12:00: Mély munka. 14:00-14:30: Videók.</li>
<li><strong>Előnyei</strong>:
<ul>
<li>Kevesebb kontextusváltás = több mély munka.</li>
<li>A figyelem gyorsabban beáll, mert hasonló típusú munka.</li>
<li>Kevesebb döntés = kevesebb mentális fáradtság.</li>
</ul>
</li>
</ul>
<h3>3. Mély munkablokkok (Deep Work Blocks)</h3>
<ul>
<li>Szakaszold be a nap 1-3 olyan szegmensét, ahol 90-120 percen belül nincs zavaró tényező.</li>
<li>Nincsenek IM-ek, e-mailek, telefon, vagy internet böngészés.</li>
<li><strong>A végeredmény</strong>: 2 óra mély munka = 4-6 óra "normális" munka.</li>
</ul>
<h3>4. Mérés és nyomon követés</h3>
<ul>
<li>Napló: hányszor váltottál kontextust egy nap alatt?</li>
<li>Hatás: mennyire csökkent a termelékenységed?</li>
<li>Cél: max 3-4 kontextusváltás naponta (ideális: 1-2).</li>
</ul>
<hr />
<h2>Gyakorlati feladat (30 perc) — Mély munkanapod felépítése</h2>
<ol>
<li><strong>Audit</strong>: Ma számolja meg, hányszor váltott kontextust?</li>
<li><strong>Kötegelt feldolgozás csomag</strong>: Azonos típusú feladatokat csoportosítson egy 2-3 órás blokkba.</li>
<li><strong>Mély munka blokk</strong>: Válasszon egy 90-120 perces sávot holnapra, zavaróanyag nélkül (telefon ki, IM ki).</li>
<li><strong>Ütemezés</strong>: Szinkronizálja ezt az Ön napi és heti naptárával.</li>
<li><strong>Feljegyzés</strong>: Írja le a szabályokat a mély munka blokkhoz.</li>
</ol>
<hr />
<h2>Önellenőrzés</h2>
<ul>
<li>✅ Tudom, mi az figyelmi maradványa.</li>
<li>✅ Van egy kötegelt feldolgozási naptár a hét számára.</li>
<li>✅ Van egy 90-120 perces mély munka blokk naponta.</li>
<li>✅ Tudom, hányszor váltok kontextust egy nap alatt.</li>
<li>✅ Vannak szabályok a mély munka blokkokhoz (nincs IM, nincs telefon, nincs internet).</li>
</ul>`,
    emailSubject: 'Termelékenység 2026 – 8. nap: Kontextusváltás költsége',
    emailBody: `<h1>Termelékenység 2026 – 8. nap</h1>
<h2>Kontextusváltás költsége: figyelmi maradványa, kötegelt feldolgozás, mély munkablokkok</h2>
<p><em>A többfeladatosság hazugság. A fokusz egy felső liga sportja.</em></p>
<p>Ma azt tanulod meg, hogyan védd meg az idződ a kontextusváltás költségeitől. A figyelmi maradványa azt jelenti, hogy amikor váltasz, az agyed lassú visszatérést tapasztal. Ez a kutatásokon alapuló 10-25 perces veszteség minden váltásnál.</p>
<p><strong>A megoldás</strong>: Kötegelt feldolgozás és mély munkablokkok.</p>
<p><strong>Kvíz</strong>: Próbálj meg 5 kérdésre válaszolni, hogy megértsd az anyagot.</p>
<p><a href="{{APP_URL}}/hu/courses/${COURSE_ID_BASE}_HU/day/8">Nyisd meg a leckét →</a></p>`
  },
  en: {
    title: 'Context Switching Cost: Attention Residue, Batching, Deep Work Blocks',
    content: `<h1>Context Switching Cost: Attention Residue, Batching, Deep Work Blocks</h1>
<p><em>Multitasking is a lie. Focus is a pro sport.</em></p>
<hr />
<h2>Learning Objectives</h2>
<ul>
<li>Understand how attention residue works and why it's so costly.</li>
<li>Learn how to apply batching to minimize context switching.</li>
<li>Create deep work blocks for maximum productivity.</li>
<li>Measure the real cost of context switching on your work.</li>
</ul>
<hr />
<h2>Why This Matters</h2>
<ul>
<li><strong>Attention Residue</strong>: When you switch tasks, it takes 10-25 minutes to fully refocus on the new task.</li>
<li><strong>Productivity Loss</strong>: Context switches throughout a day can cause up to 40% productivity loss.</li>
<li><strong>Quality Suffers</strong>: Scattered attention means work is done less carefully.</li>
<li><strong>Stress Increases</strong>: Context switching creates cognitive load, leading to fatigue by day's end.</li>
</ul>
<hr />
<h2>Deep Dive</h2>
<h3>1. Attention Residue</h3>
<ul>
<li>When you switch from one task to another, parts of your brain stay on the previous task.</li>
<li>This is called "attention residue."</li>
<li>Research shows: 10-25 minutes needed for full refocus.</li>
<li><strong>The Fix</strong>: Minimize switches.</li>
</ul>
<h3>2. Batching</h3>
<ul>
<li>Group similar tasks together.</li>
<li>Example: 9:00-9:30 AM: Emails. 10:00 AM-12:00 PM: Deep work. 2:00-2:30 PM: Videos.</li>
<li><strong>Benefits</strong>:
<ul>
<li>Fewer context switches = more deep work.</li>
<li>Attention settles faster because similar type of work.</li>
<li>Fewer decisions = less mental fatigue.</li>
</ul>
</li>
</ul>
<h3>3. Deep Work Blocks</h3>
<ul>
<li>Block out 1-3 segments per day for 90-120 minutes with zero distractions.</li>
<li>No IMs, no emails, no phone, no browser.</li>
<li><strong>Result</strong>: 2 hours of deep work = 4-6 hours of "normal" work.</li>
</ul>
<h3>4. Measurement</h3>
<ul>
<li>Log: How many context switches did you make today?</li>
<li>Impact: How much did it reduce your productivity?</li>
<li>Target: Max 3-4 context switches per day (ideal: 1-2).</li>
</ul>
<hr />
<h2>Practical Exercise (30 minutes) — Building Your Deep Work Day</h2>
<ol>
<li><strong>Audit</strong>: Count how many times you switched context today.</li>
<li><strong>Batch Package</strong>: Group similar tasks into one 2-3 hour block.</li>
<li><strong>Deep Work Block</strong>: Schedule a 90-120 minute block tomorrow with zero distractions (phone off, IMs disabled).</li>
<li><strong>Calendar</strong>: Sync this with your daily and weekly schedule.</li>
<li><strong>Document</strong>: Write down the rules for your deep work block.</li>
</ol>
<hr />
<h2>Self-Check</h2>
<ul>
<li>✅ I understand what attention residue is.</li>
<li>✅ I have a batching schedule for the week.</li>
<li>✅ I have a 90-120 minute deep work block per day.</li>
<li>✅ I know how many times I context switch per day.</li>
<li>✅ I have rules for deep work blocks (no IM, no phone, no browser).</li>
</ul>`,
    emailSubject: 'Productivity 2026 – Day 8: Context Switching Cost',
    emailBody: `<h1>Productivity 2026 – Day 8</h1>
<h2>Context Switching Cost: Attention Residue, Batching, Deep Work Blocks</h2>
<p><em>Multitasking is a lie. Focus is a pro sport.</em></p>
<p>Today you'll learn how to protect your time from context switching costs. Attention residue means that when you switch, your brain has a slow reboot. This research-backed 10-25 minute loss happens at every switch.</p>
<p><strong>The solution</strong>: Batching and deep work blocks.</p>
<p><strong>Quiz</strong>: Answer 5 questions to confirm your understanding.</p>
<p><a href="{{APP_URL}}/en/courses/${COURSE_ID_BASE}_EN/day/8">Open the lesson →</a></p>`
  },
  tr: {
    title: 'Bağlam Değiştirme Maliyeti: Dikkat Artığı, Toplu İşleme, Derin Çalışma Blokları',
    content: `<h1>Bağlam Değiştirme Maliyeti: Dikkat Artığı, Toplu İşleme, Derin Çalışma Blokları</h1>
<p><em>Multitasking bir yalandır. Odaklanma bir profesyonel sportur.</em></p>
<hr />
<h2>Öğrenme Hedefleri</h2>
<ul>
<li>Dikkat artığının nasıl çalıştığını ve neden bu kadar maliyetli olduğunu anlayın.</li>
<li>Bağlam değiştirmeyi en aza indirmek için toplu işlemeyi nasıl uygulayacağınızı öğrenin.</li>
<li>Maksimum üretkenlik için derin çalışma blokları oluşturun.</li>
<li>Bağlam değiştirmenin işiniz üzerindeki gerçek maliyetini ölçün.</li>
</ul>
<hr />
<h2>Neden Önemli</h2>
<ul>
<li><strong>Dikkat Artığı</strong>: Görevler arasında geçiş yaptığınızda, yeni göreve tam olarak yeniden odaklanmak 10-25 dakika sürer.</li>
<li><strong>Üretkenlik Kaybı</strong>: Gün boyunca yapılan bağlam değişiklikleri %40'a kadar üretkenlik kaybına neden olabilir.</li>
<li><strong>Kalite Düşer</strong>: Dağılmış dikkat, işin daha az dikkatle yapılması anlamına gelir.</li>
<li><strong>Stres Artar</strong>: Bağlam değiştirme bilişsel yük oluşturur ve günün sonunda yorgunluğa yol açar.</li>
</ul>
<hr />
<h2>Derinlemesine Analiz</h2>
<h3>1. Dikkat Artığı</h3>
<ul>
<li>Bir görevden diğerine geçiş yaptığınızda, beyin kısımları önceki görevde kalır.</li>
<li>Buna "dikkat artığı" denir.</li>
<li>Araştırma gösteriyor: tam yeniden odaklanma için 10-25 dakika gerekli.</li>
<li><strong>Çözüm</strong>: Geçişleri en aza indirin.</li>
</ul>
<h3>2. Toplu İşleme</h3>
<ul>
<li>Benzer görevleri bir arada gruplandırın.</li>
<li>Örnek: 09:00-09:30 E-postalar. 10:00-12:00 Derin çalışma. 14:00-14:30 Videolar.</li>
<li><strong>Yararları</strong>:
<ul>
<li>Daha az bağlam geçişi = daha fazla derin çalışma.</li>
<li>Benzer tür iş olduğu için dikkat daha hızlı ayarlanır.</li>
<li>Daha az karar = daha az zihinsel yorgunluk.</li>
</ul>
</li>
</ul>
<h3>3. Derin Çalışma Blokları</h3>
<ul>
<li>Günde 1-3 segment için 90-120 dakika hiç dikkat dağıtıcı olmayacak şekilde ayırın.</li>
<li>IM yok, e-posta yok, telefon yok, tarayıcı yok.</li>
<li><strong>Sonuç</strong>: 2 saatlik derin çalışma = 4-6 saatlik "normal" çalışma.</li>
</ul>
<h3>4. Ölçüm</h3>
<ul>
<li>Kayıt: Bugün kaç kez bağlam değiştirdiniz?</li>
<li>Etki: Üretkenliğiniz ne kadar azaldı?</li>
<li>Hedef: Günde maksimum 3-4 bağlam değişimi (ideal: 1-2).</li>
</ul>
<hr />
<h2>Pratik Alıştırma (30 dakika) — Derin Çalışma Gününüzü Oluşturma</h2>
<ol>
<li><strong>Denetim</strong>: Bugün kaç kez bağlam değiştirdiniz sayın.</li>
<li><strong>Toplu Paket</strong>: Benzer görevleri bir 2-3 saatlik blokta gruplandırın.</li>
<li><strong>Derin Çalışma Bloku</strong>: Yarın sıfır dikkat dağıtıcı ile 90-120 dakikalık bir blok planlayın.</li>
<li><strong>Takvim</strong>: Bunu günlük ve haftalık takvimle senkronize edin.</li>
<li><strong>Belge</strong>: Derin çalışma bloğunuz için kuralları yazın.</li>
</ol>
<hr />
<h2>Kendi Kendinizi Kontrol Edin</h2>
<ul>
<li>✅ Dikkat artığının ne olduğunu anlıyorum.</li>
<li>✅ Hafta için bir toplu işleme programım var.</li>
<li>✅ Günde 90-120 dakikalık derin çalışma bloğum var.</li>
<li>✅ Günde kaç kez bağlam değiştirdiğimi biliyorum.</li>
<li>✅ Derin çalışma blokları için kurallarım var (IM yok, telefon yok, tarayıcı yok).</li>
</ul>`,
    emailSubject: 'Verimlilik 2026 – 8. Gün: Bağlam Değiştirme Maliyeti',
    emailBody: `<h1>Verimlilik 2026 – 8. Gün</h1>
<h2>Bağlam Değiştirme Maliyeti: Dikkat Artığı, Toplu İşleme, Derin Çalışma Blokları</h2>
<p><em>Multitasking bir yalandır. Odaklanma bir profesyonel sportur.</em></p>
<p>Bugün zamanınızı bağlam değiştirme maliyetlerinden nasıl koruyacağınızı öğreneceksiniz. Dikkat artığı, geçiş yaptığınızda beyin yeniden başlamanın yavaş olması anlamına gelir. Bu araştırmaya dayanan 10-25 dakikalık kayıp her geçişte meydana gelir.</p>
<p><strong>Çözüm</strong>: Toplu işleme ve derin çalışma blokları.</p>
<p><strong>Quiz</strong>: Malzemeyi anladığınızı doğrulamak için 5 soruya cevap verin.</p>
<p><a href="{{APP_URL}}/tr/courses/${COURSE_ID_BASE}_TR/day/8">Dersi aç →</a></p>`
  },
  bg: {
    title: 'Цена на сменяне на контекст: Остатък от внимание, Пакетна обработка, Блокове за дълбока работа',
    content: `<h1>Цена на сменяне на контекст: Остатък от внимание, Пакетна обработка, Блокове за дълбока работа</h1>
<p><em>Многозадачността е лъжа. Фокусът е професионален спорт.</em></p>
<hr />
<h2>Учебни цели</h2>
<ul>
<li>Разберете как работи остатъкът от внимание и защо е толкова скъп.</li>
<li>Научете как да прилагате пакетна обработка, за да минимизирате сменяне на контекст.</li>
<li>Създайте блокове за дълбока работа за максимална производителност.</li>
<li>Измерете реалната цена на сменяне на контекст за вашата работа.</li>
</ul>
<hr />
<h2>Защо е важно</h2>
<ul>
<li><strong>Остатък от внимание</strong>: Когато преминете между задачи, са необходими 10-25 минути, за да се фокусирате напълно на нова задача.</li>
<li><strong>Загуба на производителност</strong>: Сменянето на контекст през деня може да причини до 40% загуба на производителност.</li>
<li><strong>Качеството страда</strong>: Разпределено внимание означава, че работата се извършва по-малко внимателно.</li>
<li><strong>Стресът се увеличава</strong>: Сменяне на контекст създава когнитивна натовареност, което водо до умора до края на деня.</li>
</ul>
<hr />
<h2>Дълбокия анализ</h2>
<h3>1. Остатък от внимание</h3>
<ul>
<li>Когато преминете от една задача на друга, части на мозъка остават на предишната задача.</li>
<li>Това се нарича "остатък от внимание".</li>
<li>Изследванията показват: необходими са 10-25 минути за пълна преориентация.</li>
<li><strong>Решението</strong>: Минимизирайте сменянето.</li>
</ul>
<h3>2. Пакетна обработка</h3>
<ul>
<li>Групирайте подобни задачи заедно.</li>
<li>Пример: 09:00-09:30 Имейли. 10:00-12:00 Дълбока работа. 14:00-14:30 Видеа.</li>
<li><strong>Предимства</strong>:
<ul>
<li>По-малко сменяне на контекст = повече дълбока работа.</li>
<li>Вниманието се установява по-бързо, защото е подобен тип работа.</li>
<li>По-малко решения = по-малко умствена умора.</li>
</ul>
</li>
</ul>
<h3>3. Блокове за дълбока работа</h3>
<ul>
<li>Резервирайте 1-3 сегмента в ден за 90-120 минути без отвличане.</li>
<li>Няма IM-и, няма имейли, няма телефон, няма браузър.</li>
<li><strong>Резултат</strong>: 2 часа дълбока работа = 4-6 часа "нормална" работа.</li>
</ul>
<h3>4. Измерване</h3>
<ul>
<li>Дневник: Колко пъти промените контекст днес?</li>
<li>Въздействие: Колко намаля вашата производителност?</li>
<li>Цел: Максимум 3-4 смени на контекст на ден (идеално: 1-2).</li>
</ul>
<hr />
<h2>Практическо упражнение (30 минути) — Изграждане на деня си с дълбока работа</h2>
<ol>
<li><strong>Одит</strong>: Преброй колко пъти смени контекст днес.</li>
<li><strong>Пакетен пакет</strong>: Групирайте подобни задачи в един 2-3 часов блок.</li>
<li><strong>Блок за дълбока работа</strong>: Планирайте 90-120 минутен блок за утре с нулево отвличане.</li>
<li><strong>Календар</strong>: Синхронизирайте това с вашия дневен и седмичен график.</li>
<li><strong>Документ</strong>: Запишете правилата за блока си за дълбока работа.</li>
</ol>
<hr />
<h2>Самопроверка</h2>
<ul>
<li>✅ Разбирам какво е остатък от внимание.</li>
<li>✅ Имам график на пакетна обработка за седмицата.</li>
<li>✅ Имам 90-120 минутен блок за дълбока работа в ден.</li>
<li>✅ Знам колко пъти сменям контекст в ден.</li>
<li>✅ Имам правила за блокове за дълбока работа (няма IM, няма телефон, няма браузър).</li>
</ul>`,
    emailSubject: 'Производителност 2026 – 8. Ден: Цена на сменяне на контекст',
    emailBody: `<h1>Производителност 2026 – 8. Ден</h1>
<h2>Цена на сменяне на контекст: Остатък от внимание, Пакетна обработка, Блокове за дълбока работа</h2>
<p><em>Многозадачността е лъжа. Фокусът е професионален спорт.</em></p>
<p>Днес ще научите как да защитите времето си от разходите на сменяне на контекст. Остатъкът от внимание означава, че когато сменяте, мозъкът има забавен рестарт. Това основано на изследванията 10-25 минутно загубата се случва при всяка смяна.</p>
<p><strong>Решението</strong>: Пакетна обработка и блокове за дълбока работа.</p>
<p><strong>Quiz</strong>: Отговорете на 5 въпроса, за да потвърдите разбирането си.</p>
<p><a href="{{APP_URL}}/bg/courses/${COURSE_ID_BASE}_BG/day/8">Отворете урока →</a></p>`
  },
  pl: {
    title: 'Koszt przełączania kontekstu: Reszta uwagi, Przetwarzanie wsadowe, Bloki głębokiej pracy',
    content: `<h1>Koszt przełączania kontekstu: Reszta uwagi, Przetwarzanie wsadowe, Bloki głębokiej pracy</h1>
<p><em>Wielozadaniowość to kłamstwo. Skupienie to sport profesjonalny.</em></p>
<hr />
<h2>Cele edukacyjne</h2>
<ul>
<li>Zrozumieć, jak działa reszta uwagi i dlaczego jest tak kosztowna.</li>
<li>Nauczyć się, jak zastosować przetwarzanie wsadowe w celu zminimalizowania przełączania kontekstu.</li>
<li>Utwórz bloki głębokiej pracy dla maksymalnej produktywności.</li>
<li>Zmierz rzeczywisty koszt przełączania kontekstu dla Twojej pracy.</li>
</ul>
<hr />
<h2>Dlaczego jest to ważne</h2>
<ul>
<li><strong>Reszta uwagi</strong>: Gdy przełączasz między zadaniami, ponowne pełne skupienie na nowym zadaniu trwa 10-25 minut.</li>
<li><strong>Utrata produktywności</strong>: Przełączanie kontekstu w ciągu dnia może spowodować utratę produktywności do 40%.</li>
<li><strong>Pogarsza się jakość</strong>: Rozproszona uwaga oznacza, że praca jest wykonywana mniej starannie.</li>
<li><strong>Stres rośnie</strong>: Przełączanie kontekstu tworzy obciążenie poznawcze, prowadzące do zmęczenia na koniec dnia.</li>
</ul>
<hr />
<h2>Analiza dogłębna</h2>
<h3>1. Reszta uwagi</h3>
<ul>
<li>Gdy przełączasz się z jednego zadania na drugie, części mózgu pozostają w poprzednim zadaniu.</li>
<li>Nazywa się to "resztą uwagi".</li>
<li>Badania pokazują: do pełnego ponownego skupienia potrzeba 10-25 minut.</li>
<li><strong>Rozwiązanie</strong>: Zminimalizuj przełączenia.</li>
</ul>
<h3>2. Przetwarzanie wsadowe</h3>
<ul>
<li>Grupuj podobne zadania razem.</li>
<li>Przykład: 09:00-09:30 Wiadomości e-mail. 10:00-12:00 Głęboka praca. 14:00-14:30 Wideo.</li>
<li><strong>Korzyści</strong>:
<ul>
<li>Mniej przełączania kontekstu = więcej głębokiej pracy.</li>
<li>Uwaga ustala się szybciej ze względu na podobny typ pracy.</li>
<li>Mniej decyzji = mniej zmęczenia umysłowego.</li>
</ul>
</li>
</ul>
<h3>3. Bloki głębokiej pracy</h3>
<ul>
<li>Zarezerwuj 1-3 segmenty dziennie na 90-120 minut bez przeszkód.</li>
<li>Brak wiadomości błyskawicznych, brak e-maili, brak telefonu, brak przeglądarki.</li>
<li><strong>Wynik</strong>: 2 godziny głębokiej pracy = 4-6 godzin "normalnej" pracy.</li>
</ul>
<h3>4. Pomiary</h3>
<ul>
<li>Dziennik: Ile razy dzisiaj przełączyłeś kontekst?</li>
<li>Wpływ: O ile zmniejszyła się Twoja produktywność?</li>
<li>Cel: Maksymalnie 3-4 przełączenia kontekstu dziennie (ideał: 1-2).</li>
</ul>
<hr />
<h2>Ćwiczenie praktyczne (30 minut) — Budowanie dnia głębokiej pracy</h2>
<ol>
<li><strong>Audyt</strong>: Policz, ile razy przełączyłeś kontekst dzisiaj.</li>
<li><strong>Pakiet wsadowy</strong>: Zgrupuj podobne zadania w jeden blok 2-3 godzin.</li>
<li><strong>Blok głębokiej pracy</strong>: Zaplanuj blok 90-120 minut na jutro bez rozproszenia.</li>
<li><strong>Kalendarz</strong>: Zsynchronizuj to ze swoim harmonogramem dziennym i tygodniowym.</li>
<li><strong>Dokument</strong>: Napisz zasady dla bloku głębokiej pracy.</li>
</ol>
<hr />
<h2>Samokontrola</h2>
<ul>
<li>✅ Rozumiem, czym jest reszta uwagi.</li>
<li>✅ Mam harmonogram przetwarzania wsadowego na tydzień.</li>
<li>✅ Mam blok głębokiej pracy 90-120 minut dziennie.</li>
<li>✅ Wiem, ile razy przełączam kontekst dziennie.</li>
<li>✅ Mam zasady dla bloków głębokiej pracy (brak wiadomości błyskawicznych, brak telefonu, brak przeglądarki).</li>
</ul>`,
    emailSubject: 'Produktywność 2026 – 8. Dzień: Koszt przełączania kontekstu',
    emailBody: `<h1>Produktywność 2026 – 8. Dzień</h1>
<h2>Koszt przełączania kontekstu: Reszta uwagi, Przetwarzanie wsadowe, Bloki głębokiej pracy</h2>
<p><em>Wielozadaniowość to kłamstwo. Skupienie to sport profesjonalny.</em></p>
<p>Dzisiaj nauczysz się chronić swój czas przed kosztami przełączania kontekstu. Reszta uwagi oznacza, że gdy się przełączysz, mózg powoli się uruchamia ponownie. Ta badana naukowo strata 10-25 minut następuje przy każdej zmianie.</p>
<p><strong>Rozwiązanie</strong>: Przetwarzanie wsadowe i bloki głębokiej pracy.</p>
<p><strong>Quiz</strong>: Odpowiedz na 5 pytań, aby potwierdzić swoją wiedzę.</p>
<p><a href="{{APP_URL}}/pl/courses/${COURSE_ID_BASE}_PL/day/8">Otwórz lekcję →</a></p>`
  },
  vi: {
    title: 'Chi phí chuyển đổi ngữ cảnh: Phần dư chú ý, Xử lý theo lô, Khối công việc sâu',
    content: `<h1>Chi phí chuyển đổi ngữ cảnh: Phần dư chú ý, Xử lý theo lô, Khối công việc sâu</h1>
<p><em>Đa nhiệm là một lời nói dối. Tập trung là một môn thể thao chuyên nghiệp.</em></p>
<hr />
<h2>Mục tiêu học tập</h2>
<ul>
<li>Hiểu cách hoạt động của phần dư chú ý và tại sao nó lại tốn kém như vậy.</li>
<li>Tìm hiểu cách áp dụng xử lý theo lô để giảm thiểu chuyển đổi ngữ cảnh.</li>
<li>Tạo khối công việc sâu để có năng suất tối đa.</li>
<li>Đo lường chi phí thực tế của việc chuyển đổi ngữ cảnh đối với công việc của bạn.</li>
</ul>
<hr />
<h2>Tại sao điều này lại quan trọng</h2>
<ul>
<li><strong>Phần dư chú ý</strong>: Khi bạn chuyển đổi giữa các nhiệm vụ, cần 10-25 phút để tập trung hoàn toàn lại vào nhiệm vụ mới.</li>
<li><strong>Mất năng suất</strong>: Chuyển đổi ngữ cảnh trong cả ngày có thể gây mất đến 40% năng suất.</li>
<li><strong>Chất lượng giảm</strong>: Chú ý phân tán có nghĩa là công việc được thực hiện kém cẩn thận hơn.</li>
<li><strong>Stress tăng</strong>: Chuyển đổi ngữ cảnh tạo gánh nặng nhận thức, dẫn đến mệt mỏi vào cuối ngày.</li>
</ul>
<hr />
<h2>Phân tích sâu</h2>
<h3>1. Phần dư chú ý</h3>
<ul>
<li>Khi bạn chuyển từ nhiệm vụ này sang nhiệm vụ khác, các bộ phận não của bạn vẫn ở lại nhiệm vụ trước đó.</li>
<li>Đây được gọi là "phần dư chú ý".</li>
<li>Nghiên cứu cho thấy: cần 10-25 phút để tập trung lại hoàn toàn.</li>
<li><strong>Giải pháp</strong>: Giảm thiểu các chuyển đổi.</li>
</ul>
<h3>2. Xử lý theo lô</h3>
<ul>
<li>Nhóm các nhiệm vụ tương tự lại với nhau.</li>
<li>Ví dụ: 09:00-09:30 Email. 10:00-12:00 Công việc sâu. 14:00-14:30 Video.</li>
<li><strong>Lợi ích</strong>:
<ul>
<li>Ít chuyển đổi ngữ cảnh hơn = công việc sâu hơn.</li>
<li>Chú ý ổn định nhanh hơn vì loại công việc tương tự.</li>
<li>Ít quyết định hơn = ít mệt mỏi tinh thần.</li>
</ul>
</li>
</ul>
<h3>3. Khối công việc sâu</h3>
<ul>
<li>Dành 1-3 khối thời gian mỗi ngày trong 90-120 phút mà không có gián đoạn.</li>
<li>Không có tin nhắn tức thời, không có email, không có điện thoại, không có trình duyệt.</li>
<li><strong>Kết quả</strong>: 2 giờ công việc sâu = 4-6 giờ công việc "bình thường".</li>
</ul>
<h3>4. Phép đo</h3>
<ul>
<li>Nhật ký: Bạn chuyển đổi ngữ cảnh bao nhiêu lần hôm nay?</li>
<li>Tác động: Năng suất của bạn giảm bao nhiêu?</li>
<li>Mục tiêu: Tối đa 3-4 chuyển đổi ngữ cảnh mỗi ngày (lý tưởng: 1-2).</li>
</ul>
<hr />
<h2>Bài tập thực tế (30 phút) — Xây dựng ngày làm việc sâu của bạn</h2>
<ol>
<li><strong>Kiểm tra</strong>: Đếm bạn chuyển đổi ngữ cảnh bao nhiêu lần hôm nay.</li>
<li><strong>Gói lô</strong>: Nhóm các nhiệm vụ tương tự vào một khối 2-3 giờ.</li>
<li><strong>Khối công việc sâu</strong>: Lập kế hoạch khối 90-120 phút cho ngày mai mà không có bất kỳ gián đoạn nào.</li>
<li><strong>Lịch</strong>: Đồng bộ hóa điều này với lịch hàng ngày và hàng tuần của bạn.</li>
<li><strong>Tài liệu</strong>: Ghi lại các quy tắc cho khối công việc sâu của bạn.</li>
</ol>
<hr />
<h2>Kiểm tra bản thân</h2>
<ul>
<li>✅ Tôi hiểu phần dư chú ý là gì.</li>
<li>✅ Tôi có lịch xử lý theo lô cho tuần này.</li>
<li>✅ Tôi có khối công việc sâu 90-120 phút mỗi ngày.</li>
<li>✅ Tôi biết tôi chuyển đổi ngữ cảnh bao nhiêu lần mỗi ngày.</li>
<li>✅ Tôi có các quy tắc cho khối công việc sâu (không có tin nhắn tức thời, không có điện thoại, không có trình duyệt).</li>
</ul>`,
    emailSubject: 'Năng suất 2026 – Ngày 8: Chi phí chuyển đổi ngữ cảnh',
    emailBody: `<h1>Năng suất 2026 – Ngày 8</h1>
<h2>Chi phí chuyển đổi ngữ cảnh: Phần dư chú ý, Xử lý theo lô, Khối công việc sâu</h2>
<p><em>Đa nhiệm là một lời nói dối. Tập trung là một môn thể thao chuyên nghiệp.</em></p>
<p>Hôm nay bạn sẽ tìm hiểu cách bảo vệ thời gian của mình khỏi chi phí chuyển đổi ngữ cảnh. Phần dư chú ý có nghĩa là khi bạn chuyển đổi, não bộ khởi động lại từ từ. Mất mát 10-25 phút dựa trên nghiên cứu này xảy ra ở mỗi lần chuyển đổi.</p>
<p><strong>Giải pháp</strong>: Xử lý theo lô và khối công việc sâu.</p>
<p><strong>Quiz</strong>: Trả lời 5 câu hỏi để xác nhận sự hiểu biết của bạn.</p>
<p><a href="{{APP_URL}}/vi/courses/${COURSE_ID_BASE}_VI/day/8">Mở bài học →</a></p>`
  },
  id: {
    title: 'Biaya Pergantian Konteks: Sisa Perhatian, Pemrosesan Batch, Blok Kerja Mendalam',
    content: `<h1>Biaya Pergantian Konteks: Sisa Perhatian, Pemrosesan Batch, Blok Kerja Mendalam</h1>
<p><em>Multitasking adalah kebohongan. Fokus adalah olahraga profesional.</em></p>
<hr />
<h2>Tujuan Pembelajaran</h2>
<ul>
<li>Memahami bagaimana sisa perhatian bekerja dan mengapa sangat mahal.</li>
<li>Pelajari cara menerapkan pemrosesan batch untuk meminimalkan pergantian konteks.</li>
<li>Buat blok kerja mendalam untuk produktivitas maksimal.</li>
<li>Ukur biaya sebenarnya dari pergantian konteks pada pekerjaan Anda.</li>
</ul>
<hr />
<h2>Mengapa Ini Penting</h2>
<ul>
<li><strong>Sisa Perhatian</strong>: Saat Anda beralih di antara tugas, diperlukan 10-25 menit untuk sepenuhnya fokus kembali pada tugas baru.</li>
<li><strong>Kehilangan Produktivitas</strong>: Pergantian konteks sepanjang hari dapat menyebabkan kehilangan produktivitas hingga 40%.</li>
<li><strong>Kualitas Menurun</strong>: Perhatian yang tersebar berarti pekerjaan dilakukan dengan kurang hati-hati.</li>
<li><strong>Stres Meningkat</strong>: Pergantian konteks menciptakan beban kognitif, yang menyebabkan kelelahan di akhir hari.</li>
</ul>
<hr />
<h2>Analisis Mendalam</h2>
<h3>1. Sisa Perhatian</h3>
<ul>
<li>Saat Anda beralih dari satu tugas ke tugas lain, bagian otak Anda tetap berada pada tugas sebelumnya.</li>
<li>Ini disebut "sisa perhatian".</li>
<li>Penelitian menunjukkan: 10-25 menit diperlukan untuk fokus kembali sepenuhnya.</li>
<li><strong>Solusi</strong>: Minimalkan pergantian.</li>
</ul>
<h3>2. Pemrosesan Batch</h3>
<ul>
<li>Kelompokkan tugas serupa bersama-sama.</li>
<li>Contoh: 09:00-09:30 Email. 10:00-12:00 Kerja mendalam. 14:00-14:30 Video.</li>
<li><strong>Manfaat</strong>:
<ul>
<li>Lebih sedikit pergantian konteks = lebih banyak kerja mendalam.</li>
<li>Perhatian menetap lebih cepat karena jenis pekerjaan serupa.</li>
<li>Lebih sedikit keputusan = lebih sedikit kelelahan mental.</li>
</ul>
</li>
</ul>
<h3>3. Blok Kerja Mendalam</h3>
<ul>
<li>Blok 1-3 segmen per hari selama 90-120 menit tanpa gangguan.</li>
<li>Tidak ada IM, tidak ada email, tidak ada ponsel, tidak ada browser.</li>
<li><strong>Hasil</strong>: 2 jam kerja mendalam = 4-6 jam kerja "normal".</li>
</ul>
<h3>4. Pengukuran</h3>
<ul>
<li>Log: Berapa kali Anda mengganti konteks hari ini?</li>
<li>Dampak: Berapa banyak produktivitas Anda berkurang?</li>
<li>Target: Maksimal 3-4 pergantian konteks per hari (ideal: 1-2).</li>
</ul>
<hr />
<h2>Latihan Praktik (30 menit) — Membangun Hari Kerja Mendalam Anda</h2>
<ol>
<li><strong>Audit</strong>: Hitung berapa kali Anda mengganti konteks hari ini.</li>
<li><strong>Paket Batch</strong>: Kelompokkan tugas serupa ke dalam satu blok 2-3 jam.</li>
<li><strong>Blok Kerja Mendalam</strong>: Jadwalkan blok 90-120 menit untuk besok tanpa gangguan.</li>
<li><strong>Kalender</strong>: Sinkronkan ini dengan jadwal harian dan mingguan Anda.</li>
<li><strong>Dokumen</strong>: Tulis aturan untuk blok kerja mendalam Anda.</li>
</ol>
<hr />
<h2>Periksa Diri Sendiri</h2>
<ul>
<li>✅ Saya memahami apa itu sisa perhatian.</li>
<li>✅ Saya memiliki jadwal pemrosesan batch untuk minggu ini.</li>
<li>✅ Saya memiliki blok kerja mendalam 90-120 menit per hari.</li>
<li>✅ Saya tahu berapa kali saya mengganti konteks per hari.</li>
<li>✅ Saya memiliki aturan untuk blok kerja mendalam (tidak ada IM, tidak ada ponsel, tidak ada browser).</li>
</ul>`,
    emailSubject: 'Produktivitas 2026 – Hari 8: Biaya Pergantian Konteks',
    emailBody: `<h1>Produktivitas 2026 – Hari 8</h1>
<h2>Biaya Pergantian Konteks: Sisa Perhatian, Pemrosesan Batch, Blok Kerja Mendalam</h2>
<p><em>Multitasking adalah kebohongan. Fokus adalah olahraga profesional.</em></p>
<p>Hari ini Anda akan belajar bagaimana melindungi waktu Anda dari biaya pergantian konteks. Sisa perhatian berarti bahwa ketika Anda beralih, otak memiliki reboot yang lambat. Kerugian 10-25 menit berbasis penelitian ini terjadi di setiap pergantian.</p>
<p><strong>Solusinya</strong>: Pemrosesan batch dan blok kerja mendalam.</p>
<p><strong>Quiz</strong>: Jawab 5 pertanyaan untuk mengkonfirmasi pemahaman Anda.</p>
<p><a href="{{APP_URL}}/id/courses/${COURSE_ID_BASE}_ID/day/8">Buka pelajaran →</a></p>`
  },
  ar: {
    title: 'تكلفة تبديل السياق: بقايا الانتباه ومعالجة الدفعات وكتل العمل العميق',
    content: `<h1>تكلفة تبديل السياق: بقايا الانتباه ومعالجة الدفعات وكتل العمل العميق</h1>
<p><em>تعدد المهام كذبة. التركيز رياضة احترافية.</em></p>
<hr />
<h2>أهداف التعلم</h2>
<ul>
<li>فهم كيفية عمل بقايا الانتباه ولماذا تكون مكلفة جداً.</li>
<li>تعلم كيفية تطبيق معالجة الدفعات لتقليل تبديل السياق.</li>
<li>إنشاء كتل عمل عميقة للإنتاجية القصوى.</li>
<li>قياس التكلفة الحقيقية لتبديل السياق على عملك.</li>
</ul>
<hr />
<h2>لماذا هذا مهم</h2>
<ul>
<li><strong>بقايا الانتباه</strong>: عند التبديل بين المهام، يستغرق الأمر 10-25 دقيقة للتركيز بالكامل على المهمة الجديدة.</li>
<li><strong>فقدان الإنتاجية</strong>: يمكن لتبديلات السياق طوال اليوم أن تسبب فقداناً في الإنتاجية يصل إلى 40%.</li>
<li><strong>جودة أقل</strong>: الانتباه المشتت يعني إنجاز العمل بعناية أقل.</li>
<li><strong>زيادة الإجهاد</strong>: يخلق تبديل السياق عبء معرفي، مما يؤدي إلى التعب بنهاية اليوم.</li>
</ul>
<hr />
<h2>تحليل عميق</h2>
<h3>1. بقايا الانتباه</h3>
<ul>
<li>عند الانتقال من مهمة إلى أخرى، تبقى أجزاء من دماغك على المهمة السابقة.</li>
<li>يُسمى هذا "بقايا الانتباه".</li>
<li>تظهر الأبحاث: يلزم 10-25 دقيقة للتركيز بالكامل مرة أخرى.</li>
<li><strong>الحل</strong>: تقليل التبديلات.</li>
</ul>
<h3>2. معالجة الدفعات</h3>
<ul>
<li>اجمع المهام المتشابهة معاً.</li>
<li>مثال: 09:00-09:30 رسائل بريد إلكترونية. 10:00-12:00 عمل عميق. 14:00-14:30 فيديوهات.</li>
<li><strong>الفوائد</strong>:
<ul>
<li>تبديلات سياق أقل = عمل عميق أكثر.</li>
<li>يستقر الانتباه بسرعة أكبر لأن نوع العمل متشابه.</li>
<li>قرارات أقل = تعب عقلي أقل.</li>
</ul>
</li>
</ul>
<h3>3. كتل العمل العميق</h3>
<ul>
<li>احجز 1-3 قطاعات يومياً لمدة 90-120 دقيقة بدون انقطاع.</li>
<li>لا رسائل فورية، لا بريد إلكتروني، لا هاتف، لا متصفح.</li>
<li><strong>النتيجة</strong>: ساعتان من العمل العميق = 4-6 ساعات من العمل "العادي".</li>
</ul>
<h3>4. القياس</h3>
<ul>
<li>السجل: كم مرة بدلت السياق اليوم؟</li>
<li>التأثير: كم قلت إنتاجيتك؟</li>
<li>الهدف: أقصى 3-4 تبديلات سياق يومياً (الأمثل: 1-2).</li>
</ul>
<hr />
<h2>التمرين العملي (30 دقيقة) — بناء يوم عملك العميق</h2>
<ol>
<li><strong>التدقيق</strong>: احسب كم مرة بدلت السياق اليوم.</li>
<li><strong>حزمة دفعة</strong>: اجمع المهام المتشابهة في كتلة واحدة من 2-3 ساعات.</li>
<li><strong>كتلة عمل عميقة</strong>: جدول كتلة 90-120 دقيقة غداً بدون انقطاع.</li>
<li><strong>التقويم</strong>: نسّق هذا مع جدولك اليومي والأسبوعي.</li>
<li><strong>وثيقة</strong>: اكتب قواعد كتلة عملك العميقة.</li>
</ol>
<hr />
<h2>فحص ذاتي</h2>
<ul>
<li>✅ أفهم ما هي بقايا الانتباه.</li>
<li>✅ لدي جدول معالجة دفعات للأسبوع.</li>
<li>✅ لدي كتلة عمل عميقة 90-120 دقيقة يومياً.</li>
<li>✅ أعرف كم مرة أبدل السياق يومياً.</li>
<li>✅ لدي قواعد لكتل العمل العميق (لا رسائل فورية، لا هاتف، لا متصفح).</li>
</ul>`,
    emailSubject: 'الإنتاجية 2026 – اليوم 8: تكلفة تبديل السياق',
    emailBody: `<h1>الإنتاجية 2026 – اليوم 8</h1>
<h2>تكلفة تبديل السياق: بقايا الانتباه ومعالجة الدفعات وكتل العمل العميق</h2>
<p><em>تعدد المهام كذبة. التركيز رياضة احترافية.</em></p>
<p>اليوم ستتعلم كيفية حماية وقتك من تكاليف تبديل السياق. تعني بقايا الانتباه أنه عند التبديل، يكون لديك إعادة تشغيل بطيئة في الدماغ. يحدث هذا الفقدان بمدة 10-25 دقيقة القائم على البحث عند كل تبديل.</p>
<p><strong>الحل</strong>: معالجة الدفعات وكتل العمل العميق.</p>
<p><strong>اختبار</strong>: أجب على 5 أسئلة لتأكيد فهمك.</p>
<p><a href="{{APP_URL}}/ar/courses/${COURSE_ID_BASE}_AR/day/8">افتح الدرس →</a></p>`
  },
  pt: {
    title: 'Custo de Mudança de Contexto: Resíduo de Atenção, Processamento em Lote, Blocos de Trabalho Profundo',
    content: `<h1>Custo de Mudança de Contexto: Resíduo de Atenção, Processamento em Lote, Blocos de Trabalho Profundo</h1>
<p><em>Multitarefa é uma mentira. O foco é um esporte profissional.</em></p>
<hr />
<h2>Objetivos de Aprendizado</h2>
<ul>
<li>Entender como funciona o resíduo de atenção e por que é tão custoso.</li>
<li>Aprenda como aplicar o processamento em lote para minimizar a mudança de contexto.</li>
<li>Crie blocos de trabalho profundo para máxima produtividade.</li>
<li>Meça o custo real da mudança de contexto em seu trabalho.</li>
</ul>
<hr />
<h2>Por que isso é importante</h2>
<ul>
<li><strong>Resíduo de Atenção</strong>: Quando você muda entre tarefas, levam 10-25 minutos para se reconcentrar completamente na nova tarefa.</li>
<li><strong>Perda de Produtividade</strong>: Mudanças de contexto ao longo do dia podem causar até 40% de perda de produtividade.</li>
<li><strong>A Qualidade Sofre</strong>: Atenção dispersa significa que o trabalho é feito com menos cuidado.</li>
<li><strong>O Estresse Aumenta</strong>: Mudança de contexto cria carga cognitiva, levando a fadiga no final do dia.</li>
</ul>
<hr />
<h2>Análise Profunda</h2>
<h3>1. Resíduo de Atenção</h3>
<ul>
<li>Quando você muda de uma tarefa para outra, partes do seu cérebro permanecem na tarefa anterior.</li>
<li>Isso é chamado "resíduo de atenção".</li>
<li>A pesquisa mostra: 10-25 minutos necessários para refoco completo.</li>
<li><strong>A Solução</strong>: Minimize mudanças.</li>
</ul>
<h3>2. Processamento em Lote</h3>
<ul>
<li>Agrupe tarefas semelhantes juntas.</li>
<li>Exemplo: 09:00-09:30 Emails. 10:00-12:00 Trabalho profundo. 14:00-14:30 Vídeos.</li>
<li><strong>Benefícios</strong>:
<ul>
<li>Menos mudanças de contexto = mais trabalho profundo.</li>
<li>A atenção se estabiliza mais rápido porque o tipo de trabalho é semelhante.</li>
<li>Menos decisões = menos fadiga mental.</li>
</ul>
</li>
</ul>
<h3>3. Blocos de Trabalho Profundo</h3>
<ul>
<li>Reserve 1-3 segmentos por dia para 90-120 minutos sem distrações.</li>
<li>Sem IMs, sem emails, sem telefone, sem navegador.</li>
<li><strong>Resultado</strong>: 2 horas de trabalho profundo = 4-6 horas de trabalho "normal".</li>
</ul>
<h3>4. Medição</h3>
<ul>
<li>Log: Quantas vezes você mudou de contexto hoje?</li>
<li>Impacto: Quanto sua produtividade diminuiu?</li>
<li>Alvo: Máximo 3-4 mudanças de contexto por dia (ideal: 1-2).</li>
</ul>
<hr />
<h2>Exercício Prático (30 minutos) — Construindo Seu Dia de Trabalho Profundo</h2>
<ol>
<li><strong>Auditoria</strong>: Conte quantas vezes você mudou de contexto hoje.</li>
<li><strong>Pacote em Lote</strong>: Agrupe tarefas semelhantes em um bloco de 2-3 horas.</li>
<li><strong>Bloco de Trabalho Profundo</strong>: Agende um bloco de 90-120 minutos para amanhã sem distrações.</li>
<li><strong>Calendário</strong>: Sincronize isso com seu calendário diário e semanal.</li>
<li><strong>Documento</strong>: Escreva as regras para seu bloco de trabalho profundo.</li>
</ol>
<hr />
<h2>Auto-Verificação</h2>
<ul>
<li>✅ Entendo o que é resíduo de atenção.</li>
<li>✅ Tenho um cronograma de processamento em lote para a semana.</li>
<li>✅ Tenho um bloco de trabalho profundo de 90-120 minutos por dia.</li>
<li>✅ Sei quantas vezes mudo de contexto por dia.</li>
<li>✅ Tenho regras para blocos de trabalho profundo (sem IM, sem telefone, sem navegador).</li>
</ul>`,
    emailSubject: 'Produtividade 2026 – Dia 8: Custo de Mudança de Contexto',
    emailBody: `<h1>Produtividade 2026 – Dia 8</h1>
<h2>Custo de Mudança de Contexto: Resíduo de Atenção, Processamento em Lote, Blocos de Trabalho Profundo</h2>
<p><em>Multitarefa é uma mentira. O foco é um esporte profissional.</em></p>
<p>Hoje você aprenderá como proteger seu tempo dos custos de mudança de contexto. O resíduo de atenção significa que quando você muda, seu cérebro tem uma reinicialização lenta. Essa perda de 10-25 minutos baseada em pesquisa acontece a cada mudança.</p>
<p><strong>A solução</strong>: Processamento em lote e blocos de trabalho profundo.</p>
<p><strong>Quiz</strong>: Responda 5 perguntas para confirmar sua compreensão.</p>
<p><a href="{{APP_URL}}/pt/courses/${COURSE_ID_BASE}_PT/day/8">Abra a lição →</a></p>`
  },
  hi: {
    title: 'संदर्भ स्विचिंग की लागत: ध्यान अवशेष, बैच प्रोसेसिंग, गहरे कार्य ब्लॉक',
    content: `<h1>संदर्भ स्विचिंग की लागत: ध्यान अवशेष, बैच प्रोसेसिंग, गहरे कार्य ब्लॉक</h1>
<p><em>मल्टीटास्किंग एक झूठ है। ध्यान एक पेशेवर खेल है।</em></p>
<hr />
<h2>सीखने के उद्देश्य</h2>
<ul>
<li>समझें कि ध्यान अवशेष कैसे काम करता है और यह इतना महंगा क्यों है।</li>
<li>संदर्भ स्विचिंग को कम करने के लिए बैच प्रोसेसिंग कैसे लागू करें।</li>
<li>अधिकतम उत्पादकता के लिए गहरे कार्य ब्लॉक बनाएँ।</li>
<li>आपके काम पर संदर्भ स्विचिंग की वास्तविक लागत को मापें।</li>
</ul>
<hr />
<h2>यह महत्वपूर्ण क्यों है</h2>
<ul>
<li><strong>ध्यान अवशेष</strong>: जब आप कार्यों के बीच स्विच करते हैं, तो नए कार्य पर पूरी तरह से ध्यान केंद्रित करने में 10-25 मिनट का समय लगता है।</li>
<li><strong>उत्पादकता की हानि</strong>: पूरे दिन में संदर्भ स्विचिंग 40% तक उत्पादकता की हानि का कारण बन सकता है।</li>
<li><strong>गुणवत्ता बिगड़ती है</strong>: बिखरा हुआ ध्यान मतलब है कि काम कम सावधानी से किया जाता है।</li>
<li><strong>तनाव बढ़ता है</strong>: संदर्भ स्विचिंग संज्ञानात्मक बोझ पैदा करता है, जिससे दिन के अंत में थकान आती है।</li>
</ul>
<hr />
<h2>गहरा विश्लेषण</h2>
<h3>1. ध्यान अवशेष</h3>
<ul>
<li>जब आप एक कार्य से दूसरे कार्य में जाते हैं, तो आपके मस्तिष्क के कुछ हिस्से पिछले कार्य पर रहते हैं।</li>
<li>इसे "ध्यान अवशेष" कहा जाता है।</li>
<li>शोध दिखाता है: पूर्ण पुनः ध्यान केंद्रित करने के लिए 10-25 मिनट की आवश्यकता है।</li>
<li><strong>समाधान</strong>: स्विचिंग को कम करें।</li>
</ul>
<h3>2. बैच प्रोसेसिंग</h3>
<ul>
<li>समान कार्यों को एक साथ समूहित करें।</li>
<li>उदाहरण: 09:00-09:30 ईमेल। 10:00-12:00 गहरा काम। 14:00-14:30 वीडियो।</li>
<li><strong>लाभ</strong>:
<ul>
<li>कम संदर्भ स्विचिंग = अधिक गहरा काम।</li>
<li>ध्यान तेजी से स्थिर होता है क्योंकि काम का प्रकार समान है।</li>
<li>कम निर्णय = कम मानसिक थकान।</li>
</ul>
</li>
</ul>
<h3>3. गहरे कार्य ब्लॉक</h3>
<ul>
<li>प्रतिदिन 1-3 सेगमेंट को 90-120 मिनट के लिए बिना विचलन के ब्लॉक करें।</li>
<li>कोई IM नहीं, कोई ईमेल नहीं, कोई फोन नहीं, कोई ब्राउजर नहीं।</li>
<li><strong>परिणाम</strong>: 2 घंटे गहरा काम = 4-6 घंटे "सामान्य" काम।</li>
</ul>
<h3>4. मापन</h3>
<ul>
<li>लॉग: आज आपने कितनी बार संदर्भ स्विच किया?</li>
<li>प्रभाव: आपकी उत्पादकता कितनी कम हुई?</li>
<li>लक्ष्य: प्रति दिन अधिकतम 3-4 संदर्भ स्विच (आदर्श: 1-2)।</li>
</ul>
<hr />
<h2>व्यावहारिक व्यायाम (30 मिनट) — अपने गहरे कार्य दिन का निर्माण</h2>
<ol>
<li><strong>ऑडिट</strong>: आज आपने कितनी बार संदर्भ स्विच किया है यह गिनें।</li>
<li><strong>बैच पैकेज</strong>: समान कार्यों को एक 2-3 घंटे के ब्लॉक में समूहित करें।</li>
<li><strong>गहरे कार्य ब्लॉक</strong>: कल के लिए 90-120 मिनट का ब्लॉक बिना विचलन के शेड्यूल करें।</li>
<li><strong>कैलेंडर</strong>: इसे अपने दैनिक और साप्ताहिक कैलेंडर के साथ सिंक करें।</li>
<li><strong>दस्तावेज़</strong>: अपने गहरे कार्य ब्लॉक के नियम लिखें।</li>
</ol>
<hr />
<h2>आत्म-जांच</h2>
<ul>
<li>✅ मैं समझता हूँ कि ध्यान अवशेष क्या है।</li>
<li>✅ मेरे पास इस सप्ताह के लिए एक बैच प्रोसेसिंग शेड्यूल है।</li>
<li>✅ मेरे पास प्रति दिन 90-120 मिनट का गहरा कार्य ब्लॉक है।</li>
<li>✅ मैं जानता हूँ कि मैं प्रति दिन कितनी बार संदर्भ स्विच करता हूँ।</li>
<li>✅ मेरे पास गहरे कार्य ब्लॉक के लिए नियम हैं (कोई IM नहीं, कोई फोन नहीं, कोई ब्राउजर नहीं)।</li>
</ul>`,
    emailSubject: 'उत्पादकता 2026 – दिन 8: संदर्भ स्विचिंग की लागत',
    emailBody: `<h1>उत्पादकता 2026 – दिन 8</h1>
<h2>संदर्भ स्विचिंग की लागत: ध्यान अवशेष, बैच प्रोसेसिंग, गहरे कार्य ब्लॉक</h2>
<p><em>मल्टीटास्किंग एक झूठ है। ध्यान एक पेशेवर खेल है।</em></p>
<p>आज आप सीखेंगे कि अपने समय को संदर्भ स्विचिंग की लागत से कैसे बचाएँ। ध्यान अवशेष का अर्थ है कि जब आप स्विच करते हैं, तो आपके मस्तिष्क को धीमी रीबूट होती है। यह शोध-समर्थित 10-25 मिनट की हानि हर स्विच पर होती है।</p>
<p><strong>समाधान</strong>: बैच प्रोसेसिंग और गहरे कार्य ब्लॉक।</p>
<p><strong>क्विज़</strong>: अपनी समझ की पुष्टि करने के लिए 5 प्रश्नों के उत्तर दें।</p>
<p><a href="{{APP_URL}}/hi/courses/${COURSE_ID_BASE}_HI/day/8">पाठ खोलें →</a></p>`
  }
};

// QUIZ QUESTIONS FOR LESSON 8
const QUIZ_8: Record<string, Array<{
  question: string;
  options: string[];
  correctIndex: number;
}>> = {
  hu: [
    {
      question: 'Milyen hosszú időre van szükség, hogy teljesen refokuszálj egy új feladatra a kontextusváltás után?',
      options: ['2-5 perc', '10-25 perc', '30-45 perc', '1-2 óra'],
      correctIndex: 1
    },
    {
      question: 'Mit jelent a "figyelmi maradványa"?',
      options: ['Azonnali fókuszváltás sikeresen', 'Az agynk részei az előző feladaton maradnak', 'Hosszú munkák lezárása', 'E-mailek olvasása'],
      correctIndex: 1
    },
    {
      question: 'Mi az az előnyös mély munka blokk hossza?',
      options: ['15-30 perc', '45-60 perc', '90-120 perc', '150+ perc'],
      correctIndex: 2
    },
    {
      question: 'Hány kontextusváltás a napi ideális cél?',
      options: ['10-15', '5-10', '1-4', 'Akármennyi, amíg produktív maradok'],
      correctIndex: 2
    },
    {
      question: 'Mi a kötegelt feldolgozás alkalmazásának fő célja?',
      options: ['Több munkát végezni kevesebb idő alatt', 'Kontextusváltások csökkentése és fокusz megőrzése', 'Több szünetet venni', 'Gyorsabban készülni'],
      correctIndex: 1
    }
  ],
  en: [
    {
      question: 'How long does it typically take to fully refocus on a new task after context switching?',
      options: ['2-5 minutes', '10-25 minutes', '30-45 minutes', '1-2 hours'],
      correctIndex: 1
    },
    {
      question: 'What does "attention residue" mean?',
      options: ['Instant focus switching success', 'Parts of your brain remain on the previous task', 'Completing long tasks successfully', 'Reading emails'],
      correctIndex: 1
    },
    {
      question: 'What is the optimal duration for a deep work block?',
      options: ['15-30 minutes', '45-60 minutes', '90-120 minutes', '150+ minutes'],
      correctIndex: 2
    },
    {
      question: 'What is the daily ideal target for context switches?',
      options: ['10-15', '5-10', '1-4', 'As many as needed while staying productive'],
      correctIndex: 2
    },
    {
      question: 'What is the main goal of applying batching?',
      options: ['Do more work in less time', 'Reduce context switches and maintain focus', 'Take more breaks', 'Work faster'],
      correctIndex: 1
    }
  ],
  tr: [
    {
      question: 'Bağlam değiştirmenin ardından yeni bir göreve tam olarak odaklanmak tipik olarak ne kadar sürer?',
      options: ['2-5 dakika', '10-25 dakika', '30-45 dakika', '1-2 saat'],
      correctIndex: 1
    },
    {
      question: '"Dikkat artığı" ne anlama gelir?',
      options: ['Anlık fokus değişim başarısı', 'Beyininizin parçaları önceki görevde kalır', 'Uzun görevleri başarıyla tamamlama', 'E-post okuma'],
      correctIndex: 1
    },
    {
      question: 'Derin çalışma bloğu için en uygun süre nedir?',
      options: ['15-30 dakika', '45-60 dakika', '90-120 dakika', '150+ dakika'],
      correctIndex: 2
    },
    {
      question: 'Günlük bağlam değişimleri için ideal hedef nedir?',
      options: ['10-15', '5-10', '1-4', 'Verimli kaldıkça gerektiği kadar'],
      correctIndex: 2
    },
    {
      question: 'Toplu işlemeyi uygulamanın ana hedefi nedir?',
      options: ['Daha az zamanda daha fazla iş yapma', 'Bağlam değişimlerini azaltma ve odağı koruma', 'Daha fazla ara verme', 'Daha hızlı çalışma'],
      correctIndex: 1
    }
  ],
  bg: [
    {
      question: 'Колко време обикновено е необходимо за пълна преориентация на нова задача след сменяне на контекст?',
      options: ['2-5 минути', '10-25 минути', '30-45 минути', '1-2 часа'],
      correctIndex: 1
    },
    {
      question: 'Какво означава "остатък от внимание"?',
      options: ['Моментален успех при переключване на фокус', 'Части от мозъка остават на предишната задача', 'Успешно завършване на дълги задачи', 'Четене на имейли'],
      correctIndex: 1
    },
    {
      question: 'Какво е оптималното времетраене за блок дълбока работа?',
      options: ['15-30 минути', '45-60 минути', '90-120 минути', '150+ минути'],
      correctIndex: 2
    },
    {
      question: 'Какво е ежедневното идеално намерение за смени на контекст?',
      options: ['10-15', '5-10', '1-4', 'Колкото е необходимо, докато остана производителен'],
      correctIndex: 2
    },
    {
      question: 'Каква е основната цел на прилагането на пакетна обработка?',
      options: ['Направете повече работа за по-малко време', 'Намалете смени на контекст и поддържайте фокус', 'Вземете повече почивки', 'Работете по-бързо'],
      correctIndex: 1
    }
  ],
  pl: [
    {
      question: 'Jak długo trwa typowo pełne ponowne skupienie się na nowym zadaniu po przełączeniu kontekstu?',
      options: ['2-5 minut', '10-25 minut', '30-45 minut', '1-2 godziny'],
      correctIndex: 1
    },
    {
      question: 'Co oznacza "reszta uwagi"?',
      options: ['Natychmiastowy sukces przełączania fokusu', 'Części mózgu pozostają w poprzednim zadaniu', 'Pomyślne ukończenie długich zadań', 'Czytanie wiadomości e-mail'],
      correctIndex: 1
    },
    {
      question: 'Jaki jest optymalny czas trwania bloku głębokiej pracy?',
      options: ['15-30 minut', '45-60 minut', '90-120 minut', '150+ minut'],
      correctIndex: 2
    },
    {
      question: 'Jaki jest dzienny idealny cel przełączeń kontekstu?',
      options: ['10-15', '5-10', '1-4', 'Tyle ile trzeba, aby pozostać produktywnym'],
      correctIndex: 2
    },
    {
      question: 'Jaki jest główny cel stosowania przetwarzania wsadowego?',
      options: ['Zrobić więcej pracy w mniej czasu', 'Zmniejszyć przełączenia kontekstu i utrzymać fokus', 'Wziąć więcej przerw', 'Pracować szybciej'],
      correctIndex: 1
    }
  ],
  vi: [
    {
      question: 'Thường mất bao lâu để tập trung hoàn toàn vào một nhiệm vụ mới sau khi chuyển đổi ngữ cảnh?',
      options: ['2-5 phút', '10-25 phút', '30-45 phút', '1-2 giờ'],
      correctIndex: 1
    },
    {
      question: '"Phần dư chú ý" có nghĩa là gì?',
      options: ['Thành công chuyển đổi tức thì', 'Các bộ phận của não bạn vẫn ở lại nhiệm vụ trước đó', 'Hoàn thành thành công các nhiệm vụ dài', 'Đọc email'],
      correctIndex: 1
    },
    {
      question: 'Thời gian tối ưu cho một khối công việc sâu là bao lâu?',
      options: ['15-30 phút', '45-60 phút', '90-120 phút', '150+ phút'],
      correctIndex: 2
    },
    {
      question: 'Mục tiêu lý tưởng hàng ngày cho các chuyển đổi ngữ cảnh là gì?',
      options: ['10-15', '5-10', '1-4', 'Bao nhiêu cần thiết để giữ năng suất'],
      correctIndex: 2
    },
    {
      question: 'Mục tiêu chính của việc áp dụng xử lý theo lô là gì?',
      options: ['Làm nhiều công việc hơn trong ít thời gian hơn', 'Giảm thiểu các chuyển đổi ngữ cảnh và duy trì tập trung', 'Tạm dừng thêm', 'Làm việc nhanh hơn'],
      correctIndex: 1
    }
  ],
  id: [
    {
      question: 'Berapa lama biasanya diperlukan untuk sepenuhnya refokus pada tugas baru setelah pergantian konteks?',
      options: ['2-5 menit', '10-25 menit', '30-45 menit', '1-2 jam'],
      correctIndex: 1
    },
    {
      question: 'Apa yang dimaksud dengan "sisa perhatian"?',
      options: ['Kesuksesan pergantian fokus instan', 'Bagian dari otak Anda tetap pada tugas sebelumnya', 'Menyelesaikan tugas panjang dengan sukses', 'Membaca email'],
      correctIndex: 1
    },
    {
      question: 'Berapa durasi optimal untuk blok kerja mendalam?',
      options: ['15-30 menit', '45-60 menit', '90-120 menit', '150+ menit'],
      correctIndex: 2
    },
    {
      question: 'Apa target ideal harian untuk pergantian konteks?',
      options: ['10-15', '5-10', '1-4', 'Sebanyak yang diperlukan untuk tetap produktif'],
      correctIndex: 2
    },
    {
      question: 'Apa tujuan utama penerapan pemrosesan batch?',
      options: ['Lakukan lebih banyak pekerjaan dalam lebih sedikit waktu', 'Kurangi pergantian konteks dan pertahankan fokus', 'Ambil lebih banyak istirahat', 'Bekerja lebih cepat'],
      correctIndex: 1
    }
  ],
  ar: [
    {
      question: 'كم من الوقت عادة ما يستغرق للتركيز بالكامل على مهمة جديدة بعد تبديل السياق؟',
      options: ['2-5 دقائق', '10-25 دقيقة', '30-45 دقيقة', '1-2 ساعة'],
      correctIndex: 1
    },
    {
      question: 'ماذا يعني "بقايا الانتباه"؟',
      options: ['نجاح تبديل التركيز الفوري', 'أجزاء من دماغك تبقى على المهمة السابقة', 'إكمال المهام الطويلة بنجاح', 'قراءة الرسائل الإلكترونية'],
      correctIndex: 1
    },
    {
      question: 'ما هي المدة المثالية لكتلة العمل العميق؟',
      options: ['15-30 دقيقة', '45-60 دقيقة', '90-120 دقيقة', '150+ دقيقة'],
      correctIndex: 2
    },
    {
      question: 'ما هو الهدف اليومي المثالي لتبديلات السياق؟',
      options: ['10-15', '5-10', '1-4', 'ما هو مطلوب للبقاء منتجاً'],
      correctIndex: 2
    },
    {
      question: 'ما هو الهدف الرئيسي من تطبيق معالجة الدفعات؟',
      options: ['القيام بمزيد من العمل في وقت أقل', 'تقليل تبديلات السياق والحفاظ على التركيز', 'خذ فترات راحة أكثر', 'العمل بشكل أسرع'],
      correctIndex: 1
    }
  ],
  pt: [
    {
      question: 'Quanto tempo normalmente leva para se reconcentrar completamente em uma nova tarefa após mudança de contexto?',
      options: ['2-5 minutos', '10-25 minutos', '30-45 minutos', '1-2 horas'],
      correctIndex: 1
    },
    {
      question: 'O que significa "resíduo de atenção"?',
      options: ['Sucesso de mudança de foco instantânea', 'Partes do seu cérebro permanecem na tarefa anterior', 'Completar tarefas longas com sucesso', 'Ler emails'],
      correctIndex: 1
    },
    {
      question: 'Qual é a duração ideal para um bloco de trabalho profundo?',
      options: ['15-30 minutos', '45-60 minutos', '90-120 minutos', '150+ minutos'],
      correctIndex: 2
    },
    {
      question: 'Qual é a meta diária ideal para mudanças de contexto?',
      options: ['10-15', '5-10', '1-4', 'Conforme necessário para permanecer produtivo'],
      correctIndex: 2
    },
    {
      question: 'Qual é o objetivo principal da aplicação do processamento em lote?',
      options: ['Faça mais trabalho em menos tempo', 'Reduza mudanças de contexto e mantenha o foco', 'Faça mais pausas', 'Trabalhe mais rápido'],
      correctIndex: 1
    }
  ],
  hi: [
    {
      question: 'संदर्भ स्विचिंग के बाद नए कार्य पर पूरी तरह से ध्यान केंद्रित करने में आमतौर पर कितना समय लगता है?',
      options: ['2-5 मिनट', '10-25 मिनट', '30-45 मिनट', '1-2 घंटे'],
      correctIndex: 1
    },
    {
      question: '"ध्यान अवशेष" का क्या मतलब है?',
      options: ['तत्काल फोकस स्विचिंग सफलता', 'आपके मस्तिष्क के कुछ हिस्से पिछले कार्य पर रहते हैं', 'लंबे कार्यों को सफलतापूर्वक पूरा करना', 'ईमेल पढ़ना'],
      correctIndex: 1
    },
    {
      question: 'गहरे कार्य ब्लॉक के लिए आदर्श अवधि क्या है?',
      options: ['15-30 मिनट', '45-60 मिनट', '90-120 मिनट', '150+ मिनट'],
      correctIndex: 2
    },
    {
      question: 'संदर्भ स्विचिंग के लिए दैनिक आदर्श लक्ष्य क्या है?',
      options: ['10-15', '5-10', '1-4', 'उत्पादक रहने के लिए जितना आवश्यक हो'],
      correctIndex: 2
    },
    {
      question: 'बैच प्रोसेसिंग लागू करने का मुख्य उद्देश्य क्या है?',
      options: ['कम समय में अधिक काम करें', 'संदर्भ स्विचिंग को कम करें और ध्यान बनाए रखें', 'अधिक ब्रेक लें', 'तेजी से काम करें'],
      correctIndex: 1
    }
  ]
};

// ============================================================================
// SEED FUNCTION
// ============================================================================

async function seedLesson8() {
  await connectDB();
  console.log('✅ Connected to MongoDB\n');

  const totalCourses = 0;
  let totalLessons = 0;
  let totalQuizzes = 0;

  for (const [lang1, lang2] of LANGUAGE_PAIRS) {
    console.log(`\n🌍 Processing language pair: ${lang1.toUpperCase()} + ${lang2.toUpperCase()}`);
    
    for (const lang of [lang1, lang2]) {
      try {
        // Get course
        const course = await Course.findOne({ courseId: `${COURSE_ID_BASE}_${lang.toUpperCase()}` });
        if (!course) {
          console.error(`  ❌ Course not found for language: ${lang.toUpperCase()}`);
          continue;
        }

        // Check if lesson already exists
        const existingLesson = await Lesson.findOne({ lessonId: `${COURSE_ID_BASE}_${lang.toUpperCase()}_DAY_8` });
        
        let lesson;
        if (!existingLesson) {
          // Create lesson only if it doesn't exist
          lesson = new Lesson({
            lessonId: `${COURSE_ID_BASE}_${lang.toUpperCase()}_DAY_8`,
            courseId: course._id,
            dayNumber: 8,
            title: LESSON_8[lang].title,
            content: LESSON_8[lang].content,
            emailSubject: LESSON_8[lang].emailSubject,
            emailBody: LESSON_8[lang].emailBody.replace(/\{\{APP_URL\}\}/g, process.env.NEXTAUTH_URL || 'https://www.amanoba.com')
          });
          await lesson.save();
          totalLessons++;
          console.log(`  ✅ Created lesson for ${lang.toUpperCase()}`);
        } else {
          lesson = existingLesson;
          console.log(`  ℹ️  Lesson already exists for ${lang.toUpperCase()}, skipping lesson creation`);
        }

        // Delete existing quiz questions for this lesson
        const existingQuizCount = await QuizQuestion.deleteMany({ lessonId: lesson.lessonId });
        if (existingQuizCount.deletedCount > 0) {
          console.log(`  🗑️  Deleted ${existingQuizCount.deletedCount} existing quiz questions for ${lang.toUpperCase()}`);
        }

        // Create quiz questions
        const quizQuestions = QUIZ_8[lang];
        for (let i = 0; i < quizQuestions.length; i++) {
          const q = quizQuestions[i];
          const quizQuestion = new QuizQuestion({
            lessonId: lesson.lessonId,
            question: q.question,
            options: q.options,
            correctIndex: q.correctIndex,
            difficulty: QuestionDifficulty.MEDIUM,
            category: 'Course Specific',
            isCourseSpecific: true,
            metadata: {
              createdAt: new Date(),
              updatedAt: new Date()
            }
          });
          await quizQuestion.save();
          totalQuizzes++;
        }
        console.log(`  ✅ Created ${quizQuestions.length} quiz questions for ${lang.toUpperCase()}`);

      } catch (error) {
        console.error(`  ❌ Error processing language ${lang.toUpperCase()}:`, error);
      }
    }

    // Seed after each language pair is complete
    console.log(`\n✅ Language pair ${lang1.toUpperCase()} + ${lang2.toUpperCase()} seeded successfully\n`);
  }

  // Summary
  console.log(`\n📊 Summary:`);
  console.log(`   Total Lessons Created: ${totalLessons}`);
  console.log(`   Total Quiz Questions: ${totalQuizzes}`);
  console.log(`\n✅ Lesson 8 (Day 8) seeded successfully!\n`);

  process.exit(0);
}

seedLesson8().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
