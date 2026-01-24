/**
 * Seed Productivity 2026 Course - Lesson 5 (Day 5)
 * 
 * Day 5: Measurement: simple weekly review metrics (throughput, focus blocks, carryover)
 * 
 * Creates lesson 5 for all 10 languages in 2-language batches
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

// Lesson 5 Content: Measurement: simple weekly review metrics
const LESSON_5: Record<string, {
  title: string;
  content: string;
  emailSubject: string;
  emailBody: string;
}> = {
  hu: {
    title: 'Mérés: egyszerű heti áttekintési metrikák (throughput, fókusz blokkok, carryover)',
    content: `<h1>Mérés: egyszerű heti áttekintési metrikák</h1>
<p><em>Mit nem mérsz, azt nem tudod javítani</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
<li>Megérteni a három kulcsmetrikát: throughput, fókusz blokkok, carryover.</li>
<li>Létrehozni egy heti áttekintési rutint ezekkel a metrikákkal.</li>
<li>Azonosítani, hol lehet javítani a termelékenységeden.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
<li><strong>Throughput</strong>: Hány fontos feladatot fejeztél be egy héten? Ez a valódi termelékenységed.</li>
<li><strong>Fókusz blokkok</strong>: Hány deep work blokkot tartottál? Ez a minőségi munkád.</li>
<li><strong>Carryover</strong>: Hány feladat maradt a múlt hétről? Ez a tervezési pontosságod.</li>
<li>Ezek a metrikák objektív képet adnak, nem csak érzéseket.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>A három kulcsmetrika</h3>
<p><strong>1. Throughput (Átvitel)</strong>: A befejezett fontos feladatok száma hetente. Nem a tevékenységek száma, hanem a befejezett eredmények.</p>
<p><strong>2. Fókusz blokkok</strong>: Hány 90-120 perces deep work blokkot tartottál? Ez a minőségi, koncentrált munkád.</p>
<p><strong>3. Carryover (Átvitel)</strong>: Hány feladat maradt a múlt hétről? Alacsony carryover = jó tervezés, magas carryover = túltervezés.</p>

<h3>Hogyan mérjük</h3>
<p><strong>Heti áttekintés (30 perc)</strong>:
<ul>
<li>Áttekintés: Mit fejeztél be? (throughput)</li>
<li>Fókusz: Hány deep work blokkot tartottál? (fókusz blokkok)</li>
<li>Carryover: Mit halasztottál el? (carryover)</li>
<li>Reflexió: Mi működött? Mi nem?</li>
<li>Terv: Mit tervezel a következő héten?</li>
</ul>
</p>

<h3>Gyakorlati példa</h3>
<p><strong>Hét 1</strong>:
<ul>
<li>Throughput: 8 fontos feladat befejezve</li>
<li>Fókusz blokkok: 6 blokk (cél: 8)</li>
<li>Carryover: 3 feladat (cél: <2)</li>
</ul>
</p>
<p><strong>Reflexió</strong>: Túl sok meeting, kevés deep work idő. Következő héten: több idő blokkolása, kevesebb meeting.</p>
<hr />
<h2>Gyakorlati feladat (25-30 perc) — Első heti áttekintés</h2>
<ol>
<li><strong>Throughput számolás</strong>: Írd le, hány fontos feladatot fejeztél be ezen a héten. (Fontos = kimenet, nem csak tevékenység.)</li>
<li><strong>Fókusz blokkok számolás</strong>: Írd le, hány deep work blokkot tartottál (90-120 perc, megszakítás nélkül).</li>
<li><strong>Carryover számolás</strong>: Írd le, hány feladat maradt a múlt hétről.</li>
<li><strong>Reflexió</strong>: Mi működött jól? Mi nem? Miért?</li>
<li><strong>Terv</strong>: Mit változtatsz a következő héten? Milyen konkrét lépéseket teszel?</li>
</ol>
<hr />
<h2>Önellenőrzés</h2>
<ul>
<li>✅ Ismered a három kulcsmetrikát: throughput, fókusz blokkok, carryover.</li>
<li>✅ Van egy heti áttekintési rutinod ezekkel a metrikákkal.</li>
<li>✅ Tudod, hol lehet javítani a termelékenységeden.</li>
<li>✅ A mérés objektív, nem csak érzésalapú.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
<li>David Allen: "Getting Things Done" — a heti áttekintésről</li>
<li>Cal Newport: "Deep Work" — a fókusz blokkok méréséről</li>
<li>Eliyahu Goldratt: "The Goal" — a throughput méréséről</li>
</ul>`,
    emailSubject: 'Termelékenység 2026 – 5. nap: Mérés',
    emailBody: `<h1>Termelékenység 2026 – 5. nap</h1>
<h2>Mérés: egyszerű heti áttekintési metrikák</h2>
<p>Ma megtanulod, hogyan mérj a termelékenységedet objektív metrikákkal, és hogyan használod ezeket a heti áttekintésben.</p>
<p><a href="{{APP_URL}}/hu/courses/${COURSE_ID_BASE}_HU/day/5">Nyisd meg a leckét →</a></p>`
  },
  en: {
    title: 'Measurement: simple weekly review metrics (throughput, focus blocks, carryover)',
    content: `<h1>Measurement: simple weekly review metrics</h1>
<p><em>What you don't measure, you can't improve</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Understand the three key metrics: throughput, focus blocks, carryover.</li>
<li>Create a weekly review routine with these metrics.</li>
<li>Identify where you can improve your productivity.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li><strong>Throughput</strong>: How many important tasks did you complete in a week? This is your real productivity.</li>
<li><strong>Focus blocks</strong>: How many deep work blocks did you hold? This is your quality work.</li>
<li><strong>Carryover</strong>: How many tasks remained from last week? This is your planning accuracy.</li>
<li>These metrics give objective picture, not just feelings.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>The three key metrics</h3>
<p><strong>1. Throughput</strong>: Number of completed important tasks per week. Not activity count, but completed outcomes.</p>
<p><strong>2. Focus blocks</strong>: How many 90-120 minute deep work blocks did you hold? This is your quality, focused work.</p>
<p><strong>3. Carryover</strong>: How many tasks remained from last week? Low carryover = good planning, high carryover = overplanning.</p>

<h3>How to measure</h3>
<p><strong>Weekly review (30 min)</strong>:
<ul>
<li>Review: What did you complete? (throughput)</li>
<li>Focus: How many deep work blocks did you hold? (focus blocks)</li>
<li>Carryover: What did you postpone? (carryover)</li>
<li>Reflection: What worked? What didn't?</li>
<li>Plan: What do you plan for next week?</li>
</ul>
</p>

<h3>Practical Example</h3>
<p><strong>Week 1</strong>:
<ul>
<li>Throughput: 8 important tasks completed</li>
<li>Focus blocks: 6 blocks (target: 8)</li>
<li>Carryover: 3 tasks (target: <2)</li>
</ul>
</p>
<p><strong>Reflection</strong>: Too many meetings, not enough deep work time. Next week: more time blocking, fewer meetings.</p>
<hr />
<h2>Practical exercise (25-30 min) — First weekly review</h2>
<ol>
<li><strong>Throughput count</strong>: Write down how many important tasks you completed this week. (Important = outcome, not just activity.)</li>
<li><strong>Focus blocks count</strong>: Write down how many deep work blocks you held (90-120 min, uninterrupted).</li>
<li><strong>Carryover count</strong>: Write down how many tasks remained from last week.</li>
<li><strong>Reflection</strong>: What worked well? What didn't? Why?</li>
<li><strong>Plan</strong>: What will you change next week? What concrete steps will you take?</li>
</ol>
<hr />
<h2>Self-check</h2>
<ul>
<li>✅ You know the three key metrics: throughput, focus blocks, carryover.</li>
<li>✅ You have a weekly review routine with these metrics.</li>
<li>✅ You know where you can improve your productivity.</li>
<li>✅ Measurement is objective, not just feeling-based.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>David Allen: "Getting Things Done" — about weekly review</li>
<li>Cal Newport: "Deep Work" — about measuring focus blocks</li>
<li>Eliyahu Goldratt: "The Goal" — about measuring throughput</li>
</ul>`,
    emailSubject: 'Productivity 2026 – Day 5: Measurement',
    emailBody: `<h1>Productivity 2026 – Day 5</h1>
<h2>Measurement: simple weekly review metrics</h2>
<p>Today you'll learn how to measure your productivity with objective metrics and use them in weekly review.</p>
<p><a href="{{APP_URL}}/en/courses/${COURSE_ID_BASE}_EN/day/5">Open the lesson →</a></p>`
  },
  tr: {
    title: 'Ölçüm: basit haftalık inceleme metrikleri (throughput, odak blokları, carryover)',
    content: `<h1>Ölçüm: basit haftalık inceleme metrikleri</h1>
<p><em>Ölçmediğiniz şeyi iyileştiremezsiniz</em></p>
<hr />
<h2>Öğrenme hedefi</h2>
<ul>
<li>Üç temel metriği anlamak: throughput, odak blokları, carryover.</li>
<li>Bu metriklerle haftalık bir inceleme rutini oluşturmak.</li>
<li>Verimliliğinizi nerede iyileştirebileceğinizi belirlemek.</li>
</ul>
<hr />
<h2>Neden önemli</h2>
<ul>
<li><strong>Throughput</strong>: Bir haftada kaç önemli görevi tamamladınız? Bu gerçek verimliliğinizdir.</li>
<li><strong>Odak blokları</strong>: Kaç deep work bloğu tuttunuz? Bu kaliteli işinizdir.</li>
<li><strong>Carryover</strong>: Geçen haftadan kaç görev kaldı? Bu planlama doğruluğunuzdur.</li>
<li>Bu metrikler objektif bir resim verir, sadece duygular değil.</li>
</ul>
<hr />
<h2>Açıklama</h2>
<h3>Üç temel metrik</h3>
<p><strong>1. Throughput</strong>: Haftada tamamlanan önemli görevlerin sayısı. Aktivite sayısı değil, tamamlanan sonuçlar.</p>
<p><strong>2. Odak blokları</strong>: Kaç 90-120 dakikalık deep work bloğu tuttunuz? Bu kaliteli, odaklı işinizdir.</p>
<p><strong>3. Carryover</strong>: Geçen haftadan kaç görev kaldı? Düşük carryover = iyi planlama, yüksek carryover = aşırı planlama.</p>

<h3>Nasıl ölçülür</h3>
<p><strong>Haftalık inceleme (30 dakika)</strong>:
<ul>
<li>İnceleme: Ne tamamladınız? (throughput)</li>
<li>Odak: Kaç deep work bloğu tuttunuz? (odak blokları)</li>
<li>Carryover: Ne ertelediniz? (carryover)</li>
<li>Yansıma: Ne işe yaradı? Ne yaramadı?</li>
<li>Plan: Gelecek hafta için ne planlıyorsunuz?</li>
</ul>
</p>

<h3>Pratik Örnek</h3>
<p><strong>Hafta 1</strong>:
<ul>
<li>Throughput: 8 önemli görev tamamlandı</li>
<li>Odak blokları: 6 blok (hedef: 8)</li>
<li>Carryover: 3 görev (hedef: <2)</li>
</ul>
</p>
<p><strong>Yansıma</strong>: Çok fazla toplantı, yeterli deep work zamanı yok. Gelecek hafta: daha fazla zaman bloklama, daha az toplantı.</p>
<hr />
<h2>Pratik alıştırma (25-30 dakika) — İlk haftalık inceleme</h2>
<ol>
<li><strong>Throughput sayımı</strong>: Bu hafta kaç önemli görevi tamamladığınızı yazın. (Önemli = sonuç, sadece aktivite değil.)</li>
<li><strong>Odak blokları sayımı</strong>: Kaç deep work bloğu tuttuğunuzu yazın (90-120 dakika, kesintisiz).</li>
<li><strong>Carryover sayımı</strong>: Geçen haftadan kaç görevin kaldığını yazın.</li>
<li><strong>Yansıma</strong>: Ne iyi çalıştı? Ne çalışmadı? Neden?</li>
<li><strong>Plan</strong>: Gelecek hafta ne değiştireceksiniz? Hangi somut adımları atacaksınız?</li>
</ol>
<hr />
<h2>Kendi kendini kontrol</h2>
<ul>
<li>✅ Üç temel metriği biliyorsunuz: throughput, odak blokları, carryover.</li>
<li>✅ Bu metriklerle haftalık bir inceleme rutininiz var.</li>
<li>✅ Verimliliğinizi nerede iyileştirebileceğinizi biliyorsunuz.</li>
<li>✅ Ölçüm objektif, sadece duygu tabanlı değil.</li>
</ul>
<hr />
<h2>İsteğe bağlı derinleştirme</h2>
<ul>
<li>David Allen: "Getting Things Done" — haftalık inceleme hakkında</li>
<li>Cal Newport: "Deep Work" — odak bloklarını ölçme hakkında</li>
<li>Eliyahu Goldratt: "The Goal" — throughput ölçme hakkında</li>
</ul>`,
    emailSubject: 'Verimlilik 2026 – 5. Gün: Ölçüm',
    emailBody: `<h1>Verimlilik 2026 – 5. Gün</h1>
<h2>Ölçüm: basit haftalık inceleme metrikleri</h2>
<p>Bugün verimliliğinizi objektif metriklerle nasıl ölçeceğinizi ve bunları haftalık incelemede nasıl kullanacağınızı öğreneceksiniz.</p>
<p><a href="{{APP_URL}}/tr/courses/${COURSE_ID_BASE}_TR/day/5">Dersi aç →</a></p>`
  },
  bg: {
    title: 'Измерване: прости метрики за седмичен преглед (throughput, блокове за фокус, carryover)',
    content: `<h1>Измерване: прости метрики за седмичен преглед</h1>
<p><em>Това, което не измервате, не можете да подобрите</em></p>
<hr />
<h2>Учебна цел</h2>
<ul>
<li>Да разберете трите ключови метрики: throughput, блокове за фокус, carryover.</li>
<li>Да създадете седмична рутина за преглед с тези метрики.</li>
<li>Да идентифицирате къде можете да подобрите продуктивността си.</li>
</ul>
<hr />
<h2>Защо е важно</h2>
<ul>
<li><strong>Throughput</strong>: Колко важни задачи завършихте за една седмица? Това е реалната ви продуктивност.</li>
<li><strong>Блокове за фокус</strong>: Колко блока за дълбока работа проведохте? Това е качествената ви работа.</li>
<li><strong>Carryover</strong>: Колко задачи останаха от миналата седмица? Това е точността на вашето планиране.</li>
<li>Тези метрики дават обективна картина, не само чувства.</li>
</ul>
<hr />
<h2>Обяснение</h2>
<h3>Трите ключови метрики</h3>
<p><strong>1. Throughput</strong>: Броят на завършените важни задачи на седмица. Не броят на дейностите, а завършените резултати.</p>
<p><strong>2. Блокове за фокус</strong>: Колко 90-120 минутни блока за дълбока работа проведохте? Това е качествената, фокусирана ви работа.</p>
<p><strong>3. Carryover</strong>: Колко задачи останаха от миналата седмица? Ниско carryover = добро планиране, високо carryover = надпланиране.</p>

<h3>Как да измерваме</h3>
<p><strong>Седмичен преглед (30 мин)</strong>:
<ul>
<li>Преглед: Какво завършихте? (throughput)</li>
<li>Фокус: Колко блока за дълбока работа проведохте? (блокове за фокус)</li>
<li>Carryover: Какво отложихте? (carryover)</li>
<li>Размишление: Какво проработи? Какво не?</li>
<li>План: Какво планирате за следващата седмица?</li>
</ul>
</p>

<h3>Практически пример</h3>
<p><strong>Седмица 1</strong>:
<ul>
<li>Throughput: 8 важни задачи завършени</li>
<li>Блокове за фокус: 6 блока (цел: 8)</li>
<li>Carryover: 3 задачи (цел: <2)</li>
</ul>
</p>
<p><strong>Размишление</strong>: Твърде много срещи, недостатъчно време за дълбока работа. Следваща седмица: повече блокиране на време, по-малко срещи.</p>
<hr />
<h2>Практическо упражнение (25-30 мин) — Първи седмичен преглед</h2>
<ol>
<li><strong>Броене на throughput</strong>: Напишете колко важни задачи завършихте тази седмица. (Важно = резултат, не само дейност.)</li>
<li><strong>Броене на блокове за фокус</strong>: Напишете колко блока за дълбока работа проведохте (90-120 мин, без прекъсване).</li>
<li><strong>Броене на carryover</strong>: Напишете колко задачи останаха от миналата седмица.</li>
<li><strong>Размишление</strong>: Какво проработи добре? Какво не? Защо?</li>
<li><strong>План</strong>: Какво ще промените следващата седмица? Какви конкретни стъпки ще предприемете?</li>
</ol>
<hr />
<h2>Самопроверка</h2>
<ul>
<li>✅ Знаете трите ключови метрики: throughput, блокове за фокус, carryover.</li>
<li>✅ Имате седмична рутина за преглед с тези метрики.</li>
<li>✅ Знаете къде можете да подобрите продуктивността си.</li>
<li>✅ Измерването е обективно, не само базирано на чувства.</li>
</ul>
<hr />
<h2>Опционално задълбочаване</h2>
<ul>
<li>Дейвид Алън: "Getting Things Done" — за седмичен преглед</li>
<li>Кал Нюпорт: "Deep Work" — за измерване на блокове за фокус</li>
<li>Елияху Голдрат: "The Goal" — за измерване на throughput</li>
</ul>`,
    emailSubject: 'Продуктивност 2026 – Ден 5: Измерване',
    emailBody: `<h1>Продуктивност 2026 – Ден 5</h1>
<h2>Измерване: прости метрики за седмичен преглед</h2>
<p>Днес ще научите как да измервате продуктивността си с обективни метрики и как да ги използвате в седмичен преглед.</p>
<p><a href="{{APP_URL}}/bg/courses/${COURSE_ID_BASE}_BG/day/5">Отворете урока →</a></p>`
  },
  pl: {
    title: 'Pomiar: proste metryki cotygodniowego przeglądu (throughput, bloki skupienia, carryover)',
    content: `<h1>Pomiar: proste metryki cotygodniowego przeglądu</h1>
<p><em>Czego nie mierzysz, tego nie możesz poprawić</em></p>
<hr />
<h2>Cel uczenia się</h2>
<ul>
<li>Zrozumieć trzy kluczowe metryki: throughput, bloki skupienia, carryover.</li>
<li>Stworzyć cotygodniową rutynę przeglądu z tymi metrykami.</li>
<li>Zidentyfikować, gdzie możesz poprawić swoją produktywność.</li>
</ul>
<hr />
<h2>Dlaczego to ważne</h2>
<ul>
<li><strong>Throughput</strong>: Ile ważnych zadań ukończyłeś w tygodniu? To jest twoja prawdziwa produktywność.</li>
<li><strong>Bloki skupienia</strong>: Ile bloków głębokiej pracy przeprowadziłeś? To jest twoja jakościowa praca.</li>
<li><strong>Carryover</strong>: Ile zadań pozostało z zeszłego tygodnia? To jest dokładność twojego planowania.</li>
<li>Te metryki dają obiektywny obraz, nie tylko uczucia.</li>
</ul>
<hr />
<h2>Wyjaśnienie</h2>
<h3>Trzy kluczowe metryki</h3>
<p><strong>1. Throughput</strong>: Liczba ukończonych ważnych zadań na tydzień. Nie liczba aktywności, ale ukończone rezultaty.</p>
<p><strong>2. Bloki skupienia</strong>: Ile 90-120 minutowych bloków głębokiej pracy przeprowadziłeś? To jest twoja jakościowa, skupiona praca.</p>
<p><strong>3. Carryover</strong>: Ile zadań pozostało z zeszłego tygodnia? Niski carryover = dobre planowanie, wysoki carryover = nadplanowanie.</p>

<h3>Jak mierzyć</h3>
<p><strong>Cotygodniowy przegląd (30 min)</strong>:
<ul>
<li>Przegląd: Co ukończyłeś? (throughput)</li>
<li>Skupienie: Ile bloków głębokiej pracy przeprowadziłeś? (bloki skupienia)</li>
<li>Carryover: Co odłożyłeś? (carryover)</li>
<li>Refleksja: Co zadziałało? Co nie?</li>
<li>Plan: Co planujesz na następny tydzień?</li>
</ul>
</p>

<h3>Praktyczny przykład</h3>
<p><strong>Tydzień 1</strong>:
<ul>
<li>Throughput: 8 ważnych zadań ukończonych</li>
<li>Bloki skupienia: 6 bloków (cel: 8)</li>
<li>Carryover: 3 zadania (cel: <2)</li>
</ul>
</p>
<p><strong>Refleksja</strong>: Zbyt wiele spotkań, za mało czasu na głęboką pracę. Następny tydzień: więcej blokowania czasu, mniej spotkań.</p>
<hr />
<h2>Praktyczne ćwiczenie (25-30 min) — Pierwszy cotygodniowy przegląd</h2>
<ol>
<li><strong>Liczenie throughput</strong>: Zapisz, ile ważnych zadań ukończyłeś w tym tygodniu. (Ważne = rezultat, nie tylko aktywność.)</li>
<li><strong>Liczenie bloków skupienia</strong>: Zapisz, ile bloków głębokiej pracy przeprowadziłeś (90-120 min, bez przerw).</li>
<li><strong>Liczenie carryover</strong>: Zapisz, ile zadań pozostało z zeszłego tygodnia.</li>
<li><strong>Refleksja</strong>: Co zadziałało dobrze? Co nie? Dlaczego?</li>
<li><strong>Plan</strong>: Co zmienisz w następnym tygodniu? Jakie konkretne kroki podejmiesz?</li>
</ol>
<hr />
<h2>Samosprawdzenie</h2>
<ul>
<li>✅ Znasz trzy kluczowe metryki: throughput, bloki skupienia, carryover.</li>
<li>✅ Masz cotygodniową rutynę przeglądu z tymi metrykami.</li>
<li>✅ Wiesz, gdzie możesz poprawić swoją produktywność.</li>
<li>✅ Pomiar jest obiektywny, nie tylko oparty na uczuciach.</li>
</ul>
<hr />
<h2>Opcjonalne pogłębienie</h2>
<ul>
<li>David Allen: "Getting Things Done" — o cotygodniowym przeglądzie</li>
<li>Cal Newport: "Deep Work" — o mierzeniu bloków skupienia</li>
<li>Eliyahu Goldratt: "The Goal" — o mierzeniu throughput</li>
</ul>`,
    emailSubject: 'Produktywność 2026 – Dzień 5: Pomiar',
    emailBody: `<h1>Produktywność 2026 – Dzień 5</h1>
<h2>Pomiar: proste metryki cotygodniowego przeglądu</h2>
<p>Dzisiaj nauczysz się, jak mierzyć swoją produktywność obiektywnymi metrykami i używać ich w cotygodniowym przeglądzie.</p>
<p><a href="{{APP_URL}}/pl/courses/${COURSE_ID_BASE}_PL/day/5">Otwórz lekcję →</a></p>`
  },
  vi: {
    title: 'Đo lường: các chỉ số đánh giá hàng tuần đơn giản (throughput, khối tập trung, carryover)',
    content: `<h1>Đo lường: các chỉ số đánh giá hàng tuần đơn giản</h1>
<p><em>Những gì bạn không đo lường, bạn không thể cải thiện</em></p>
<hr />
<h2>Mục tiêu học tập</h2>
<ul>
<li>Hiểu ba chỉ số chính: throughput, khối tập trung, carryover.</li>
<li>Tạo thói quen đánh giá hàng tuần với các chỉ số này.</li>
<li>Xác định nơi bạn có thể cải thiện năng suất của mình.</li>
</ul>
<hr />
<h2>Tại sao quan trọng</h2>
<ul>
<li><strong>Throughput</strong>: Bạn đã hoàn thành bao nhiêu nhiệm vụ quan trọng trong một tuần? Đây là năng suất thực tế của bạn.</li>
<li><strong>Khối tập trung</strong>: Bạn đã thực hiện bao nhiêu khối công việc sâu? Đây là công việc chất lượng của bạn.</li>
<li><strong>Carryover</strong>: Còn lại bao nhiêu nhiệm vụ từ tuần trước? Đây là độ chính xác lập kế hoạch của bạn.</li>
<li>Các chỉ số này cung cấp bức tranh khách quan, không chỉ cảm giác.</li>
</ul>
<hr />
<h2>Giải thích</h2>
<h3>Ba chỉ số chính</h3>
<p><strong>1. Throughput</strong>: Số lượng nhiệm vụ quan trọng đã hoàn thành mỗi tuần. Không phải số lượng hoạt động, mà là kết quả đã hoàn thành.</p>
<p><strong>2. Khối tập trung</strong>: Bạn đã thực hiện bao nhiêu khối công việc sâu 90-120 phút? Đây là công việc chất lượng, tập trung của bạn.</p>
<p><strong>3. Carryover</strong>: Còn lại bao nhiêu nhiệm vụ từ tuần trước? Carryover thấp = lập kế hoạch tốt, carryover cao = lập kế hoạch quá mức.</p>

<h3>Cách đo lường</h3>
<p><strong>Đánh giá hàng tuần (30 phút)</strong>:
<ul>
<li>Đánh giá: Bạn đã hoàn thành gì? (throughput)</li>
<li>Tập trung: Bạn đã thực hiện bao nhiêu khối công việc sâu? (khối tập trung)</li>
<li>Carryover: Bạn đã hoãn lại gì? (carryover)</li>
<li>Phản ánh: Điều gì hiệu quả? Điều gì không?</li>
<li>Kế hoạch: Bạn dự định gì cho tuần tới?</li>
</ul>
</p>

<h3>Ví dụ thực tế</h3>
<p><strong>Tuần 1</strong>:
<ul>
<li>Throughput: 8 nhiệm vụ quan trọng đã hoàn thành</li>
<li>Khối tập trung: 6 khối (mục tiêu: 8)</li>
<li>Carryover: 3 nhiệm vụ (mục tiêu: <2)</li>
</ul>
</p>
<p><strong>Phản ánh</strong>: Quá nhiều cuộc họp, không đủ thời gian cho công việc sâu. Tuần tới: chặn nhiều thời gian hơn, ít cuộc họp hơn.</p>
<hr />
<h2>Bài tập thực hành (25-30 phút) — Đánh giá hàng tuần đầu tiên</h2>
<ol>
<li><strong>Đếm throughput</strong>: Viết ra bao nhiêu nhiệm vụ quan trọng bạn đã hoàn thành trong tuần này. (Quan trọng = kết quả, không chỉ hoạt động.)</li>
<li><strong>Đếm khối tập trung</strong>: Viết ra bao nhiêu khối công việc sâu bạn đã thực hiện (90-120 phút, không gián đoạn).</li>
<li><strong>Đếm carryover</strong>: Viết ra bao nhiêu nhiệm vụ còn lại từ tuần trước.</li>
<li><strong>Phản ánh</strong>: Điều gì hoạt động tốt? Điều gì không? Tại sao?</li>
<li><strong>Kế hoạch</strong>: Bạn sẽ thay đổi gì vào tuần tới? Bạn sẽ thực hiện những bước cụ thể nào?</li>
</ol>
<hr />
<h2>Tự kiểm tra</h2>
<ul>
<li>✅ Bạn biết ba chỉ số chính: throughput, khối tập trung, carryover.</li>
<li>✅ Bạn có thói quen đánh giá hàng tuần với các chỉ số này.</li>
<li>✅ Bạn biết nơi bạn có thể cải thiện năng suất của mình.</li>
<li>✅ Đo lường là khách quan, không chỉ dựa trên cảm giác.</li>
</ul>
<hr />
<h2>Đào sâu tùy chọn</h2>
<ul>
<li>David Allen: "Getting Things Done" — về đánh giá hàng tuần</li>
<li>Cal Newport: "Deep Work" — về đo lường khối tập trung</li>
<li>Eliyahu Goldratt: "The Goal" — về đo lường throughput</li>
</ul>`,
    emailSubject: 'Năng suất 2026 – Ngày 5: Đo lường',
    emailBody: `<h1>Năng suất 2026 – Ngày 5</h1>
<h2>Đo lường: các chỉ số đánh giá hàng tuần đơn giản</h2>
<p>Hôm nay bạn sẽ học cách đo lường năng suất của mình bằng các chỉ số khách quan và sử dụng chúng trong đánh giá hàng tuần.</p>
<p><a href="{{APP_URL}}/vi/courses/${COURSE_ID_BASE}_VI/day/5">Mở bài học →</a></p>`
  },
  id: {
    title: 'Pengukuran: metrik tinjauan mingguan sederhana (throughput, blok fokus, carryover)',
    content: `<h1>Pengukuran: metrik tinjauan mingguan sederhana</h1>
<p><em>Apa yang tidak Anda ukur, tidak dapat Anda tingkatkan</em></p>
<hr />
<h2>Tujuan pembelajaran</h2>
<ul>
<li>Memahami tiga metrik kunci: throughput, blok fokus, carryover.</li>
<li>Membuat rutinitas tinjauan mingguan dengan metrik-metrik ini.</li>
<li>Mengidentifikasi di mana Anda dapat meningkatkan produktivitas Anda.</li>
</ul>
<hr />
<h2>Mengapa penting</h2>
<ul>
<li><strong>Throughput</strong>: Berapa banyak tugas penting yang Anda selesaikan dalam seminggu? Ini adalah produktivitas nyata Anda.</li>
<li><strong>Blok fokus</strong>: Berapa banyak blok kerja mendalam yang Anda lakukan? Ini adalah pekerjaan berkualitas Anda.</li>
<li><strong>Carryover</strong>: Berapa banyak tugas yang tersisa dari minggu lalu? Ini adalah akurasi perencanaan Anda.</li>
<li>Metrik-metrik ini memberikan gambaran objektif, bukan hanya perasaan.</li>
</ul>
<hr />
<h2>Penjelasan</h2>
<h3>Tiga metrik kunci</h3>
<p><strong>1. Throughput</strong>: Jumlah tugas penting yang diselesaikan per minggu. Bukan jumlah aktivitas, tetapi hasil yang diselesaikan.</p>
<p><strong>2. Blok fokus</strong>: Berapa banyak blok kerja mendalam 90-120 menit yang Anda lakukan? Ini adalah pekerjaan berkualitas, terfokus Anda.</p>
<p><strong>3. Carryover</strong>: Berapa banyak tugas yang tersisa dari minggu lalu? Carryover rendah = perencanaan baik, carryover tinggi = perencanaan berlebihan.</p>

<h3>Bagaimana mengukur</h3>
<p><strong>Tinjauan mingguan (30 menit)</strong>:
<ul>
<li>Tinjauan: Apa yang Anda selesaikan? (throughput)</li>
<li>Fokus: Berapa banyak blok kerja mendalam yang Anda lakukan? (blok fokus)</li>
<li>Carryover: Apa yang Anda tunda? (carryover)</li>
<li>Refleksi: Apa yang berhasil? Apa yang tidak?</li>
<li>Rencana: Apa yang Anda rencanakan untuk minggu depan?</li>
</ul>
</p>

<h3>Contoh Praktis</h3>
<p><strong>Minggu 1</strong>:
<ul>
<li>Throughput: 8 tugas penting diselesaikan</li>
<li>Blok fokus: 6 blok (target: 8)</li>
<li>Carryover: 3 tugas (target: <2)</li>
</ul>
</p>
<p><strong>Refleksi</strong>: Terlalu banyak rapat, tidak cukup waktu kerja mendalam. Minggu depan: lebih banyak pemblokiran waktu, lebih sedikit rapat.</p>
<hr />
<h2>Latihan praktis (25-30 menit) — Tinjauan mingguan pertama</h2>
<ol>
<li><strong>Penghitungan throughput</strong>: Tuliskan berapa banyak tugas penting yang Anda selesaikan minggu ini. (Penting = hasil, bukan hanya aktivitas.)</li>
<li><strong>Penghitungan blok fokus</strong>: Tuliskan berapa banyak blok kerja mendalam yang Anda lakukan (90-120 menit, tanpa gangguan).</li>
<li><strong>Penghitungan carryover</strong>: Tuliskan berapa banyak tugas yang tersisa dari minggu lalu.</li>
<li><strong>Refleksi</strong>: Apa yang berhasil dengan baik? Apa yang tidak? Mengapa?</li>
<li><strong>Rencana</strong>: Apa yang akan Anda ubah minggu depan? Langkah konkret apa yang akan Anda ambil?</li>
</ol>
<hr />
<h2>Pemeriksaan diri</h2>
<ul>
<li>✅ Anda mengetahui tiga metrik kunci: throughput, blok fokus, carryover.</li>
<li>✅ Anda memiliki rutinitas tinjauan mingguan dengan metrik-metrik ini.</li>
<li>✅ Anda tahu di mana Anda dapat meningkatkan produktivitas Anda.</li>
<li>✅ Pengukuran objektif, bukan hanya berbasis perasaan.</li>
</ul>
<hr />
<h2>Pendalaman opsional</h2>
<ul>
<li>David Allen: "Getting Things Done" — tentang tinjauan mingguan</li>
<li>Cal Newport: "Deep Work" — tentang mengukur blok fokus</li>
<li>Eliyahu Goldratt: "The Goal" — tentang mengukur throughput</li>
</ul>`,
    emailSubject: 'Produktivitas 2026 – Hari 5: Pengukuran',
    emailBody: `<h1>Produktivitas 2026 – Hari 5</h1>
<h2>Pengukuran: metrik tinjauan mingguan sederhana</h2>
<p>Hari ini Anda akan mempelajari cara mengukur produktivitas Anda dengan metrik objektif dan menggunakannya dalam tinjauan mingguan.</p>
<p><a href="{{APP_URL}}/id/courses/${COURSE_ID_BASE}_ID/day/5">Buka pelajaran →</a></p>`
  },
  ar: {
    title: 'القياس: مقاييس المراجعة الأسبوعية البسيطة (الإنتاجية، كتل التركيز، التحويل)',
    content: `<h1>القياس: مقاييس المراجعة الأسبوعية البسيطة</h1>
<p><em>ما لا تقيسه، لا يمكنك تحسينه</em></p>
<hr />
<h2>هدف التعلم</h2>
<ul>
<li>فهم المقاييس الثلاثة الرئيسية: الإنتاجية، كتل التركيز، التحويل.</li>
<li>إنشاء روتين مراجعة أسبوعي بهذه المقاييس.</li>
<li>تحديد المكان الذي يمكنك فيه تحسين إنتاجيتك.</li>
</ul>
<hr />
<h2>لماذا يهم</h2>
<ul>
<li><strong>الإنتاجية</strong>: كم مهمة مهمة أكملتها في أسبوع؟ هذه هي إنتاجيتك الحقيقية.</li>
<li><strong>كتل التركيز</strong>: كم كتلة عمل عميق قمت بها؟ هذا هو عملك عالي الجودة.</li>
<li><strong>التحويل</strong>: كم مهمة بقيت من الأسبوع الماضي؟ هذا هو دقة تخطيطك.</li>
<li>هذه المقاييس تعطي صورة موضوعية، وليس فقط المشاعر.</li>
</ul>
<hr />
<h2>شرح</h2>
<h3>المقاييس الثلاثة الرئيسية</h3>
<p><strong>1. الإنتاجية</strong>: عدد المهام المهمة المكتملة أسبوعيًا. ليس عدد الأنشطة، بل النتائج المكتملة.</p>
<p><strong>2. كتل التركيز</strong>: كم كتلة عمل عميق 90-120 دقيقة قمت بها؟ هذا هو عملك عالي الجودة والمركز.</p>
<p><strong>3. التحويل</strong>: كم مهمة بقيت من الأسبوع الماضي؟ تحويل منخفض = تخطيط جيد، تحويل عالي = تخطيط مفرط.</p>

<h3>كيفية القياس</h3>
<p><strong>المراجعة الأسبوعية (30 دقيقة)</strong>:
<ul>
<li>المراجعة: ماذا أكملت؟ (الإنتاجية)</li>
<li>التركيز: كم كتلة عمل عميق قمت بها؟ (كتل التركيز)</li>
<li>التحويل: ماذا أجلت؟ (التحويل)</li>
<li>التفكير: ما الذي نجح؟ ما الذي لم ينجح؟</li>
<li>الخطة: ماذا تخطط للأسبوع القادم؟</li>
</ul>
</p>

<h3>مثال عملي</h3>
<p><strong>الأسبوع 1</strong>:
<ul>
<li>الإنتاجية: 8 مهام مهمة مكتملة</li>
<li>كتل التركيز: 6 كتل (الهدف: 8)</li>
<li>التحويل: 3 مهام (الهدف: <2)</li>
</ul>
</p>
<p><strong>التفكير</strong>: اجتماعات كثيرة جدًا، وقت عمل عميق غير كافٍ. الأسبوع القادم: المزيد من حظر الوقت، اجتماعات أقل.</p>
<hr />
<h2>تمرين عملي (25-30 دقيقة) — المراجعة الأسبوعية الأولى</h2>
<ol>
<li><strong>عد الإنتاجية</strong>: اكتب كم مهمة مهمة أكملتها هذا الأسبوع. (مهم = نتيجة، وليس فقط نشاط.)</li>
<li><strong>عد كتل التركيز</strong>: اكتب كم كتلة عمل عميق قمت بها (90-120 دقيقة، بدون انقطاع).</li>
<li><strong>عد التحويل</strong>: اكتب كم مهمة بقيت من الأسبوع الماضي.</li>
<li><strong>التفكير</strong>: ما الذي عمل بشكل جيد؟ ما الذي لم يعمل؟ لماذا؟</li>
<li><strong>الخطة</strong>: ماذا ستغير الأسبوع القادم؟ ما الخطوات الملموسة التي ستتخذها؟</li>
</ol>
<hr />
<h2>الفحص الذاتي</h2>
<ul>
<li>✅ تعرف المقاييس الثلاثة الرئيسية: الإنتاجية، كتل التركيز، التحويل.</li>
<li>✅ لديك روتين مراجعة أسبوعي بهذه المقاييس.</li>
<li>✅ تعرف المكان الذي يمكنك فيه تحسين إنتاجيتك.</li>
<li>✅ القياس موضوعي، وليس فقط قائم على المشاعر.</li>
</ul>
<hr />
<h2>تعميق اختياري</h2>
<ul>
<li>David Allen: "Getting Things Done" — حول المراجعة الأسبوعية</li>
<li>Cal Newport: "Deep Work" — حول قياس كتل التركيز</li>
<li>Eliyahu Goldratt: "The Goal" — حول قياس الإنتاجية</li>
</ul>`,
    emailSubject: 'الإنتاجية 2026 – اليوم 5: القياس',
    emailBody: `<h1>الإنتاجية 2026 – اليوم 5</h1>
<h2>القياس: مقاييس المراجعة الأسبوعية البسيطة</h2>
<p>اليوم سوف تتعلم كيفية قياس إنتاجيتك بمقاييس موضوعية واستخدامها في المراجعة الأسبوعية.</p>
<p><a href="{{APP_URL}}/ar/courses/${COURSE_ID_BASE}_AR/day/5">افتح الدرس →</a></p>`
  },
  pt: {
    title: 'Medição: métricas simples de revisão semanal (throughput, blocos de foco, carryover)',
    content: `<h1>Medição: métricas simples de revisão semanal</h1>
<p><em>O que você não mede, não pode melhorar</em></p>
<hr />
<h2>Objetivo de aprendizagem</h2>
<ul>
<li>Entender as três métricas-chave: throughput, blocos de foco, carryover.</li>
<li>Criar uma rotina de revisão semanal com essas métricas.</li>
<li>Identificar onde você pode melhorar sua produtividade.</li>
</ul>
<hr />
<h2>Por que importa</h2>
<ul>
<li><strong>Throughput</strong>: Quantas tarefas importantes você completou em uma semana? Esta é sua produtividade real.</li>
<li><strong>Blocos de foco</strong>: Quantos blocos de trabalho profundo você realizou? Este é seu trabalho de qualidade.</li>
<li><strong>Carryover</strong>: Quantas tarefas restaram da semana passada? Esta é a precisão do seu planejamento.</li>
<li>Essas métricas dão uma imagem objetiva, não apenas sentimentos.</li>
</ul>
<hr />
<h2>Explicação</h2>
<h3>As três métricas-chave</h3>
<p><strong>1. Throughput</strong>: Número de tarefas importantes concluídas por semana. Não a contagem de atividades, mas os resultados concluídos.</p>
<p><strong>2. Blocos de foco</strong>: Quantos blocos de trabalho profundo de 90-120 minutos você realizou? Este é seu trabalho de qualidade e focado.</p>
<p><strong>3. Carryover</strong>: Quantas tarefas restaram da semana passada? Carryover baixo = bom planejamento, carryover alto = excesso de planejamento.</p>

<h3>Como medir</h3>
<p><strong>Revisão semanal (30 min)</strong>:
<ul>
<li>Revisão: O que você completou? (throughput)</li>
<li>Foco: Quantos blocos de trabalho profundo você realizou? (blocos de foco)</li>
<li>Carryover: O que você adiou? (carryover)</li>
<li>Reflexão: O que funcionou? O que não funcionou?</li>
<li>Plano: O que você planeja para a próxima semana?</li>
</ul>
</p>

<h3>Exemplo Prático</h3>
<p><strong>Semana 1</strong>:
<ul>
<li>Throughput: 8 tarefas importantes concluídas</li>
<li>Blocos de foco: 6 blocos (meta: 8)</li>
<li>Carryover: 3 tarefas (meta: <2)</li>
</ul>
</p>
<p><strong>Reflexão</strong>: Muitas reuniões, tempo insuficiente para trabalho profundo. Próxima semana: mais bloqueio de tempo, menos reuniões.</p>
<hr />
<h2>Exercício prático (25-30 min) — Primeira revisão semanal</h2>
<ol>
<li><strong>Contagem de throughput</strong>: Anote quantas tarefas importantes você completou esta semana. (Importante = resultado, não apenas atividade.)</li>
<li><strong>Contagem de blocos de foco</strong>: Anote quantos blocos de trabalho profundo você realizou (90-120 min, sem interrupções).</li>
<li><strong>Contagem de carryover</strong>: Anote quantas tarefas restaram da semana passada.</li>
<li><strong>Reflexão</strong>: O que funcionou bem? O que não funcionou? Por quê?</li>
<li><strong>Plano</strong>: O que você mudará na próxima semana? Quais passos concretos você tomará?</li>
</ol>
<hr />
<h2>Auto-verificação</h2>
<ul>
<li>✅ Você conhece as três métricas-chave: throughput, blocos de foco, carryover.</li>
<li>✅ Você tem uma rotina de revisão semanal com essas métricas.</li>
<li>✅ Você sabe onde pode melhorar sua produtividade.</li>
<li>✅ A medição é objetiva, não apenas baseada em sentimentos.</li>
</ul>
<hr />
<h2>Aprofundamento opcional</h2>
<ul>
<li>David Allen: "Getting Things Done" — sobre revisão semanal</li>
<li>Cal Newport: "Deep Work" — sobre medir blocos de foco</li>
<li>Eliyahu Goldratt: "The Goal" — sobre medir throughput</li>
</ul>`,
    emailSubject: 'Produtividade 2026 – Dia 5: Medição',
    emailBody: `<h1>Produtividade 2026 – Dia 5</h1>
<h2>Medição: métricas simples de revisão semanal</h2>
<p>Hoje você aprenderá como medir sua produtividade com métricas objetivas e usá-las na revisão semanal.</p>
<p><a href="{{APP_URL}}/pt/courses/${COURSE_ID_BASE}_PT/day/5">Abrir a lição →</a></p>`
  },
  hi: {
    title: 'माप: सरल साप्ताहिक समीक्षा मेट्रिक्स (throughput, फोकस ब्लॉक, carryover)',
    content: `<h1>माप: सरल साप्ताहिक समीक्षा मेट्रिक्स</h1>
<p><em>जिसे आप मापते नहीं, उसे आप सुधार नहीं सकते</em></p>
<hr />
<h2>सीखने का लक्ष्य</h2>
<ul>
<li>तीन मुख्य मेट्रिक्स को समझना: throughput, फोकस ब्लॉक, carryover।</li>
<li>इन मेट्रिक्स के साथ एक साप्ताहिक समीक्षा दिनचर्या बनाना।</li>
<li>पहचानना कि आप अपनी उत्पादकता कहां सुधार सकते हैं।</li>
</ul>
<hr />
<h2>क्यों महत्वपूर्ण है</h2>
<ul>
<li><strong>Throughput</strong>: आपने एक सप्ताह में कितने महत्वपूर्ण कार्य पूरे किए? यह आपकी वास्तविक उत्पादकता है।</li>
<li><strong>फोकस ब्लॉक</strong>: आपने कितने गहरे कार्य ब्लॉक किए? यह आपका गुणवत्तापूर्ण कार्य है।</li>
<li><strong>Carryover</strong>: पिछले सप्ताह से कितने कार्य बचे? यह आपकी योजना सटीकता है।</li>
<li>ये मेट्रिक्स वस्तुनिष्ठ तस्वीर देते हैं, न कि केवल भावनाएं।</li>
</ul>
<hr />
<h2>व्याख्या</h2>
<h3>तीन मुख्य मेट्रिक्स</h3>
<p><strong>1. Throughput</strong>: प्रति सप्ताह पूर्ण किए गए महत्वपूर्ण कार्यों की संख्या। गतिविधि गिनती नहीं, बल्कि पूर्ण परिणाम।</p>
<p><strong>2. फोकस ब्लॉक</strong>: आपने कितने 90-120 मिनट के गहरे कार्य ब्लॉक किए? यह आपका गुणवत्तापूर्ण, केंद्रित कार्य है।</p>
<p><strong>3. Carryover</strong>: पिछले सप्ताह से कितने कार्य बचे? कम carryover = अच्छी योजना, उच्च carryover = अत्यधिक योजना।</p>

<h3>कैसे मापें</h3>
<p><strong>साप्ताहिक समीक्षा (30 मिनट)</strong>:
<ul>
<li>समीक्षा: आपने क्या पूर्ण किया? (throughput)</li>
<li>फोकस: आपने कितने गहरे कार्य ब्लॉक किए? (फोकस ब्लॉक)</li>
<li>Carryover: आपने क्या स्थगित किया? (carryover)</li>
<li>प्रतिबिंब: क्या काम किया? क्या नहीं?</li>
<li>योजना: आप अगले सप्ताह के लिए क्या योजना बनाते हैं?</li>
</ul>
</p>

<h3>व्यावहारिक उदाहरण</h3>
<p><strong>सप्ताह 1</strong>:
<ul>
<li>Throughput: 8 महत्वपूर्ण कार्य पूर्ण</li>
<li>फोकस ब्लॉक: 6 ब्लॉक (लक्ष्य: 8)</li>
<li>Carryover: 3 कार्य (लक्ष्य: <2)</li>
</ul>
</p>
<p><strong>प्रतिबिंब</strong>: बहुत अधिक बैठकें, गहरे कार्य के लिए अपर्याप्त समय। अगले सप्ताह: अधिक समय ब्लॉकिंग, कम बैठकें।</p>
<hr />
<h2>व्यावहारिक अभ्यास (25-30 मिनट) — पहली साप्ताहिक समीक्षा</h2>
<ol>
<li><strong>Throughput गिनती</strong>: लिखें कि आपने इस सप्ताह कितने महत्वपूर्ण कार्य पूरे किए। (महत्वपूर्ण = परिणाम, न कि केवल गतिविधि।)</li>
<li><strong>फोकस ब्लॉक गिनती</strong>: लिखें कि आपने कितने गहरे कार्य ब्लॉक किए (90-120 मिनट, बिना रुकावट)।</li>
<li><strong>Carryover गिनती</strong>: लिखें कि पिछले सप्ताह से कितने कार्य बचे।</li>
<li><strong>प्रतिबिंब</strong>: क्या अच्छा काम किया? क्या नहीं? क्यों?</li>
<li><strong>योजना</strong>: आप अगले सप्ताह क्या बदलेंगे? आप कौन से ठोस कदम उठाएंगे?</li>
</ol>
<hr />
<h2>स्व-जांच</h2>
<ul>
<li>✅ आप तीन मुख्य मेट्रिक्स जानते हैं: throughput, फोकस ब्लॉक, carryover।</li>
<li>✅ आपके पास इन मेट्रिक्स के साथ एक साप्ताहिक समीक्षा दिनचर्या है।</li>
<li>✅ आप जानते हैं कि आप अपनी उत्पादकता कहां सुधार सकते हैं।</li>
<li>✅ माप वस्तुनिष्ठ है, न कि केवल भावना-आधारित।</li>
</ul>
<hr />
<h2>वैकल्पिक गहराई</h2>
<ul>
<li>David Allen: "Getting Things Done" — साप्ताहिक समीक्षा के बारे में</li>
<li>Cal Newport: "Deep Work" — फोकस ब्लॉक मापने के बारे में</li>
<li>Eliyahu Goldratt: "The Goal" — throughput मापने के बारे में</li>
</ul>`,
    emailSubject: 'उत्पादकता 2026 – दिन 5: माप',
    emailBody: `<h1>उत्पादकता 2026 – दिन 5</h1>
<h2>माप: सरल साप्ताहिक समीक्षा मेट्रिक्स</h2>
<p>आज आप सीखेंगे कि वस्तुनिष्ठ मेट्रिक्स के साथ अपनी उत्पादकता कैसे मापें और उन्हें साप्ताहिक समीक्षा में उपयोग करें।</p>
<p><a href="{{APP_URL}}/hi/courses/${COURSE_ID_BASE}_HI/day/5">पाठ खोलें →</a></p>`
  }
};

// Quiz 5 Questions
const QUIZ_5: Record<string, Array<{
  question: string;
  options: string[];
  correctIndex: number;
}>> = {
  hu: [
    {
      question: 'Mi a throughput?',
      options: [
        'A tevékenységek száma',
        'A befejezett fontos feladatok száma',
        'A meetingek száma',
        'Az email-ek száma'
      ],
      correctIndex: 1
    },
    {
      question: 'Hány metrikát használunk a heti áttekintésben?',
      options: [
        '1',
        '2',
        '3',
        '4'
      ],
      correctIndex: 2
    },
    {
      question: 'Mi a carryover?',
      options: [
        'A befejezett feladatok száma',
        'A múlt hétről maradt feladatok száma',
        'A deep work blokkok száma',
        'A meetingek száma'
      ],
      correctIndex: 1
    },
    {
      question: 'Mi a fókusz blokk ideális hossza?',
      options: [
        '30 perc',
        '60 perc',
        '90-120 perc',
        '4 óra'
      ],
      correctIndex: 2
    },
    {
      question: 'Mit jelent az alacsony carryover?',
      options: [
        'Rossz tervezés',
        'Jó tervezés',
        'Túl sok munka',
        'Kevés munka'
      ],
      correctIndex: 1
    }
  ],
  en: [
    {
      question: 'What is throughput?',
      options: [
        'Number of activities',
        'Number of completed important tasks',
        'Number of meetings',
        'Number of emails'
      ],
      correctIndex: 1
    },
    {
      question: 'How many metrics do we use in weekly review?',
      options: [
        '1',
        '2',
        '3',
        '4'
      ],
      correctIndex: 2
    },
    {
      question: 'What is carryover?',
      options: [
        'Number of completed tasks',
        'Number of tasks remaining from last week',
        'Number of deep work blocks',
        'Number of meetings'
      ],
      correctIndex: 1
    },
    {
      question: 'What is the ideal length of a focus block?',
      options: [
        '30 minutes',
        '60 minutes',
        '90-120 minutes',
        '4 hours'
      ],
      correctIndex: 2
    },
    {
      question: 'What does low carryover mean?',
      options: [
        'Bad planning',
        'Good planning',
        'Too much work',
        'Little work'
      ],
      correctIndex: 1
    }
  ],
  tr: [
    {
      question: 'Throughput nedir?',
      options: [
        'Aktivite sayısı',
        'Tamamlanan önemli görevlerin sayısı',
        'Toplantı sayısı',
        'E-posta sayısı'
      ],
      correctIndex: 1
    },
    {
      question: 'Haftalık incelemede kaç metrik kullanıyoruz?',
      options: [
        '1',
        '2',
        '3',
        '4'
      ],
      correctIndex: 2
    },
    {
      question: 'Carryover nedir?',
      options: [
        'Tamamlanan görevlerin sayısı',
        'Geçen haftadan kalan görevlerin sayısı',
        'Deep work bloklarının sayısı',
        'Toplantı sayısı'
      ],
      correctIndex: 1
    },
    {
      question: 'Odak bloğunun ideal uzunluğu nedir?',
      options: [
        '30 dakika',
        '60 dakika',
        '90-120 dakika',
        '4 saat'
      ],
      correctIndex: 2
    },
    {
      question: 'Düşük carryover ne anlama gelir?',
      options: [
        'Kötü planlama',
        'İyi planlama',
        'Çok fazla iş',
        'Az iş'
      ],
      correctIndex: 1
    }
  ],
  bg: [
    {
      question: 'Какво е throughput?',
      options: [
        'Броят на дейностите',
        'Броят на завършените важни задачи',
        'Броят на срещите',
        'Броят на имейлите'
      ],
      correctIndex: 1
    },
    {
      question: 'Колко метрики използваме в седмичен преглед?',
      options: [
        '1',
        '2',
        '3',
        '4'
      ],
      correctIndex: 2
    },
    {
      question: 'Какво е carryover?',
      options: [
        'Броят на завършените задачи',
        'Броят на задачите, останали от миналата седмица',
        'Броят на блоковете за дълбока работа',
        'Броят на срещите'
      ],
      correctIndex: 1
    },
    {
      question: 'Каква е идеалната дължина на блок за фокус?',
      options: [
        '30 минути',
        '60 минути',
        '90-120 минути',
        '4 часа'
      ],
      correctIndex: 2
    },
    {
      question: 'Какво означава ниско carryover?',
      options: [
        'Лошо планиране',
        'Добро планиране',
        'Твърде много работа',
        'Малко работа'
      ],
      correctIndex: 1
    }
  ],
  pl: [
    {
      question: 'Czym jest throughput?',
      options: [
        'Liczba aktywności',
        'Liczba ukończonych ważnych zadań',
        'Liczba spotkań',
        'Liczba e-maili'
      ],
      correctIndex: 1
    },
    {
      question: 'Ile metryk używamy w cotygodniowym przeglądzie?',
      options: [
        '1',
        '2',
        '3',
        '4'
      ],
      correctIndex: 2
    },
    {
      question: 'Czym jest carryover?',
      options: [
        'Liczba ukończonych zadań',
        'Liczba zadań pozostałych z zeszłego tygodnia',
        'Liczba bloków głębokiej pracy',
        'Liczba spotkań'
      ],
      correctIndex: 1
    },
    {
      question: 'Jaka jest idealna długość bloku skupienia?',
      options: [
        '30 minut',
        '60 minut',
        '90-120 minut',
        '4 godziny'
      ],
      correctIndex: 2
    },
    {
      question: 'Co oznacza niski carryover?',
      options: [
        'Złe planowanie',
        'Dobre planowanie',
        'Zbyt dużo pracy',
        'Mało pracy'
      ],
      correctIndex: 1
    }
  ],
  vi: [
    {
      question: 'Throughput là gì?',
      options: [
        'Số lượng hoạt động',
        'Số lượng nhiệm vụ quan trọng đã hoàn thành',
        'Số lượng cuộc họp',
        'Số lượng email'
      ],
      correctIndex: 1
    },
    {
      question: 'Chúng ta sử dụng bao nhiêu chỉ số trong đánh giá hàng tuần?',
      options: [
        '1',
        '2',
        '3',
        '4'
      ],
      correctIndex: 2
    },
    {
      question: 'Carryover là gì?',
      options: [
        'Số lượng nhiệm vụ đã hoàn thành',
        'Số lượng nhiệm vụ còn lại từ tuần trước',
        'Số lượng khối công việc sâu',
        'Số lượng cuộc họp'
      ],
      correctIndex: 1
    },
    {
      question: 'Độ dài lý tưởng của khối tập trung là bao nhiêu?',
      options: [
        '30 phút',
        '60 phút',
        '90-120 phút',
        '4 giờ'
      ],
      correctIndex: 2
    },
    {
      question: 'Carryover thấp có nghĩa là gì?',
      options: [
        'Lập kế hoạch kém',
        'Lập kế hoạch tốt',
        'Quá nhiều công việc',
        'Ít công việc'
      ],
      correctIndex: 1
    }
  ],
  id: [
    {
      question: 'Apa itu throughput?',
      options: [
        'Jumlah aktivitas',
        'Jumlah tugas penting yang diselesaikan',
        'Jumlah rapat',
        'Jumlah email'
      ],
      correctIndex: 1
    },
    {
      question: 'Berapa banyak metrik yang kita gunakan dalam tinjauan mingguan?',
      options: [
        '1',
        '2',
        '3',
        '4'
      ],
      correctIndex: 2
    },
    {
      question: 'Apa itu carryover?',
      options: [
        'Jumlah tugas yang diselesaikan',
        'Jumlah tugas yang tersisa dari minggu lalu',
        'Jumlah blok kerja mendalam',
        'Jumlah rapat'
      ],
      correctIndex: 1
    },
    {
      question: 'Berapa panjang ideal blok fokus?',
      options: [
        '30 menit',
        '60 menit',
        '90-120 menit',
        '4 jam'
      ],
      correctIndex: 2
    },
    {
      question: 'Apa artinya carryover rendah?',
      options: [
        'Perencanaan buruk',
        'Perencanaan baik',
        'Terlalu banyak pekerjaan',
        'Sedikit pekerjaan'
      ],
      correctIndex: 1
    }
  ],
  ar: [
    {
      question: 'ما هو الإنتاجية؟',
      options: [
        'عدد الأنشطة',
        'عدد المهام المهمة المكتملة',
        'عدد الاجتماعات',
        'عدد رسائل البريد الإلكتروني'
      ],
      correctIndex: 1
    },
    {
      question: 'كم مقياسًا نستخدم في المراجعة الأسبوعية؟',
      options: [
        '1',
        '2',
        '3',
        '4'
      ],
      correctIndex: 2
    },
    {
      question: 'ما هو التحويل؟',
      options: [
        'عدد المهام المكتملة',
        'عدد المهام المتبقية من الأسبوع الماضي',
        'عدد كتل العمل العميق',
        'عدد الاجتماعات'
      ],
      correctIndex: 1
    },
    {
      question: 'ما هو الطول المثالي لكتلة التركيز؟',
      options: [
        '30 دقيقة',
        '60 دقيقة',
        '90-120 دقيقة',
        '4 ساعات'
      ],
      correctIndex: 2
    },
    {
      question: 'ماذا يعني التحويل المنخفض؟',
      options: [
        'تخطيط سيء',
        'تخطيط جيد',
        'الكثير من العمل',
        'قليل من العمل'
      ],
      correctIndex: 1
    }
  ],
  pt: [
    {
      question: 'O que é throughput?',
      options: [
        'Número de atividades',
        'Número de tarefas importantes concluídas',
        'Número de reuniões',
        'Número de e-mails'
      ],
      correctIndex: 1
    },
    {
      question: 'Quantas métricas usamos na revisão semanal?',
      options: [
        '1',
        '2',
        '3',
        '4'
      ],
      correctIndex: 2
    },
    {
      question: 'O que é carryover?',
      options: [
        'Número de tarefas concluídas',
        'Número de tarefas restantes da semana passada',
        'Número de blocos de trabalho profundo',
        'Número de reuniões'
      ],
      correctIndex: 1
    },
    {
      question: 'Qual é o comprimento ideal de um bloco de foco?',
      options: [
        '30 minutos',
        '60 minutos',
        '90-120 minutos',
        '4 horas'
      ],
      correctIndex: 2
    },
    {
      question: 'O que significa carryover baixo?',
      options: [
        'Planejamento ruim',
        'Bom planejamento',
        'Muito trabalho',
        'Pouco trabalho'
      ],
      correctIndex: 1
    }
  ],
  hi: [
    {
      question: 'Throughput क्या है?',
      options: [
        'गतिविधियों की संख्या',
        'पूर्ण किए गए महत्वपूर्ण कार्यों की संख्या',
        'बैठकों की संख्या',
        'ईमेल की संख्या'
      ],
      correctIndex: 1
    },
    {
      question: 'हम साप्ताहिक समीक्षा में कितने मेट्रिक्स का उपयोग करते हैं?',
      options: [
        '1',
        '2',
        '3',
        '4'
      ],
      correctIndex: 2
    },
    {
      question: 'Carryover क्या है?',
      options: [
        'पूर्ण किए गए कार्यों की संख्या',
        'पिछले सप्ताह से बचे कार्यों की संख्या',
        'गहरे कार्य ब्लॉक की संख्या',
        'बैठकों की संख्या'
      ],
      correctIndex: 1
    },
    {
      question: 'फोकस ब्लॉक की आदर्श लंबाई क्या है?',
      options: [
        '30 मिनट',
        '60 मिनट',
        '90-120 मिनट',
        '4 घंटे'
      ],
      correctIndex: 2
    },
    {
      question: 'कम carryover का क्या मतलब है?',
      options: [
        'खराब योजना',
        'अच्छी योजना',
        'बहुत अधिक काम',
        'कम काम'
      ],
      correctIndex: 1
    }
  ]
};

// Seed lesson 5 for specific languages
async function seedLesson5ForLanguages(
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

    const lessonContent = LESSON_5[lang];
    const quizQuestions = QUIZ_5[lang];

    if (!lessonContent || !quizQuestions) {
      console.log(`⚠️  Content not ready for ${lang}, skipping...`);
      continue;
    }

    const lessonId = `${courseId}_DAY_05`;

    // Create/update lesson
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId,
          courseId: course._id,
          dayNumber: 5,
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

    console.log(`  ✅ Lesson 5 for ${lang} created/updated`);

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
            category: 'Measurement & Metrics',
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
    console.log(`  ✅ Quiz 5 (${quizQuestions.length} questions) for ${lang} created/updated`);
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

  console.log('📚 Processing Lesson 5 (Day 5: Measurement)...\n');
  
  // Process in batches of 2 languages
  for (const [pairIndex, pair] of LANGUAGE_PAIRS.entries()) {
    console.log(`  Batch ${pairIndex + 1}/5: ${pair.join(', ')}`);
    await seedLesson5ForLanguages(pair, brand, appUrl);
    console.log(`  ✅ Batch ${pairIndex + 1} completed\n`);
  }
  
  console.log('✅ Lesson 5 completed for all languages!');
  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
