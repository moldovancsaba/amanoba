/**
 * Seed Productivity 2026 Course - Lesson 2 (Day 2)
 * 
 * Day 2: Time, energy, attention: what you manage in practice
 * 
 * Creates lesson 2 for all 10 languages in 2-language batches:
 * - Batch 1: hu, en → seed
 * - Batch 2: tr, bg → seed
 * - Batch 3: pl, vi → seed
 * - Batch 4: id, ar → seed
 * - Batch 5: pt, hi → seed
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

// Lesson 2 Content: Time, energy, attention: what you manage in practice
const LESSON_2: Record<string, {
  title: string;
  content: string;
  emailSubject: string;
  emailBody: string;
}> = {
  hu: {
    title: 'Idő, energia, figyelem: amit a gyakorlatban kezelsz',
    content: `<h1>Idő, energia, figyelem: amit a gyakorlatban kezelsz</h1>
<p><em>A termelékenység három pillére: idő, energia, figyelem</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
<li>Megérteni, hogyan működik az idő, energia és figyelem együtt.</li>
<li>Azonosítani a saját idő-, energia- és figyelem-mintáidat.</li>
<li>Létrehozni egy napi ütemtervet, amely figyelembe veszi ezeket a korlátokat.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
<li><strong>Idő</strong>: Végességes erőforrás. Nem hozhatsz létre többet, csak jobban kezelheted.</li>
<li><strong>Energia</strong>: Változó erőforrás. Napközben változik, és különböző tevékenységek különböző szintű energiát igényelnek.</li>
<li><strong>Figyelem</strong>: A legértékesebb erőforrás. Könnyen elvész, nehezen helyreáll.</li>
<li>A három együttműködése határozza meg a valódi termelékenységedet.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Idő kezelése</h3>
<p><strong>Időblokkolás</strong>: Foglald le időt a naptáradban a fontos feladatokhoz. Ne csak reagálj, hanem tervezz.</p>
<p><strong>Időzítés</strong>: Azonosítsd, mikor vagy a leghatékonyabb. A legtöbb ember reggel 9-11 között és délután 2-4 között van csúcson.</p>
<p><strong>Buffer idő</strong>: Hagyj 20-30% buffer időt váratlan dolgokra. A túlzsúfolt naptár = stressz.</p>

<h3>Energia kezelése</h3>
<p><strong>Energia szintek</strong>: Azonosítsd a napod energiáit:
<ul>
<li><strong>Csúcs energia</strong> (magas): Nehéz, kreatív, stratégiai munkák</li>
<li><strong>Közepes energia</strong>: Meetingek, email, adminisztráció</li>
<li><strong>Alacsony energia</strong>: Rutin feladatok, olvasás, archiválás</li>
</ul>
</p>
<p><strong>Energia töltés</strong>: Azonosítsd, mi tölt fel (mozgás, rövid szünet, társas interakció) és mi merít (hosszú meetingek, multitasking).</p>

<h3>Figyelem kezelése</h3>
<p><strong>Deep work blokkok</strong>: Foglald le 90-120 perces blokkokat a mély munkához. Ebben az időben: nincs email, nincs telefon, nincs meeting.</p>
<p><strong>Figyelem visszaállítása</strong>: Minden megszakítás után 15-20 perc kell, hogy visszaállítsd a figyelmed. Minimalizáld a megszakításokat.</p>
<p><strong>Környezet tervezése</strong>: Teremts egy környezetet, amely támogatja a koncentrációt (csend, rendezett asztal, letiltott értesítések).</p>

<h3>Gyakorlati példa</h3>
<p><strong>Hibás megközelítés</strong>: "Ma 8 órát dolgozom, bármit is csinálok!"</p>
<p><strong>Helyes megközelítés</strong>:
<ul>
<li>9-11: Deep work blokk (stratégiai tervezés) - csúcs energia</li>
<li>11-12: Email, adminisztráció - közepes energia</li>
<li>12-13: Ebéd, pihenés - energia töltés</li>
<li>14-16: Deep work blokk (kreatív munka) - csúcs energia</li>
<li>16-17: Meetingek - közepes energia</li>
<li>17-18: Rutin feladatok, archiválás - alacsony energia</li>
</ul>
</p>
<hr />
<h2>Gyakorlati feladat (20-25 perc) — Napi energia és figyelem térkép</h2>
<ol>
<li><strong>Energia napló (1 hét)</strong>: Jegyezd le naponta 3 időpontban (reggel, délelőtt, délután) az energia szintedet (1-10 skála).</li>
<li><strong>Figyelem napló</strong>: Jegyezd le, hányszor szakadt meg a figyelmed naponta, és mi okozta (email, telefon, kolléga, stb.).</li>
<li><strong>Időzítés elemzés</strong>: Azonosítsd, mikor vagy a leghatékonyabb (melyik órákban, melyik napokon).</li>
<li><strong>Napi ütemterv tervezése</strong>: Hozz létre egy napi ütemtervet, amely:
<ul>
<li>Csúcs energiáidat a nehéz feladatokhoz használja</li>
<li>Deep work blokkokat tartalmaz (90-120 perc)</li>
<li>Buffer időt hagy (20-30%)</li>
<li>Energia töltő tevékenységeket tartalmaz</li>
</ul>
</li>
</ol>
<hr />
<h2>Önellenőrzés</h2>
<ul>
<li>✅ Megérted, hogyan működik együtt az idő, energia és figyelem.</li>
<li>✅ Azonosítottad a saját energia- és figyelem-mintáidat.</li>
<li>✅ Van egy napi ütemterved, amely figyelembe veszi ezeket a korlátokat.</li>
<li>✅ Tudod, hogy a cél a három erőforrás optimalizálása, nem csak az idő kezelése.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
<li>Cal Newport: "Deep Work" — a mély munkáról és a figyelem kezeléséről</li>
<li>Tony Schwartz: "The Energy Project" — az energia kezeléséről</li>
<li>Daniel Pink: "When" — a bioritmusokról és az optimális időzítésről</li>
</ul>`,
    emailSubject: 'Termelékenység 2026 – 2. nap: Idő, energia, figyelem',
    emailBody: `<h1>Termelékenység 2026 – 2. nap</h1>
<h2>Idő, energia, figyelem: amit a gyakorlatban kezelsz</h2>
<p>Ma megtanulod, hogyan működik együtt az idő, energia és figyelem, és hogyan tervezhetsz napi ütemtervet ezek figyelembevételével.</p>
<p><a href="{{APP_URL}}/hu/courses/${COURSE_ID_BASE}_HU/day/2">Nyisd meg a leckét →</a></p>`
  },
  en: {
    title: 'Time, energy, attention: what you manage in practice',
    content: `<h1>Time, energy, attention: what you manage in practice</h1>
<p><em>The three pillars of productivity: time, energy, attention</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Understand how time, energy, and attention work together.</li>
<li>Identify your personal time, energy, and attention patterns.</li>
<li>Create a daily schedule that accounts for these constraints.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li><strong>Time</strong>: Finite resource. You can't create more, only manage it better.</li>
<li><strong>Energy</strong>: Variable resource. Changes throughout the day, and different activities require different energy levels.</li>
<li><strong>Attention</strong>: Most valuable resource. Easily lost, hard to restore.</li>
<li>The interaction of all three determines your real productivity.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Managing Time</h3>
<p><strong>Time blocking</strong>: Block time in your calendar for important tasks. Don't just react, plan.</p>
<p><strong>Timing</strong>: Identify when you're most effective. Most people peak between 9-11 AM and 2-4 PM.</p>
<p><strong>Buffer time</strong>: Leave 20-30% buffer time for unexpected things. Overpacked calendar = stress.</p>

<h3>Managing Energy</h3>
<p><strong>Energy levels</strong>: Identify your day's energies:
<ul>
<li><strong>Peak energy</strong> (high): Hard, creative, strategic work</li>
<li><strong>Medium energy</strong>: Meetings, email, administration</li>
<li><strong>Low energy</strong>: Routine tasks, reading, archiving</li>
</ul>
</p>
<p><strong>Energy recharge</strong>: Identify what energizes you (movement, short break, social interaction) and what drains you (long meetings, multitasking).</p>

<h3>Managing Attention</h3>
<p><strong>Deep work blocks</strong>: Block 90-120 minute blocks for deep work. During this time: no email, no phone, no meetings.</p>
<p><strong>Attention restoration</strong>: After every interruption, it takes 15-20 minutes to restore your attention. Minimize interruptions.</p>
<p><strong>Environment design</strong>: Create an environment that supports concentration (quiet, tidy desk, notifications off).</p>

<h3>Practical Example</h3>
<p><strong>Wrong approach</strong>: "Today I'll work 8 hours, doing whatever!"</p>
<p><strong>Right approach</strong>:
<ul>
<li>9-11: Deep work block (strategic planning) - peak energy</li>
<li>11-12: Email, administration - medium energy</li>
<li>12-13: Lunch, rest - energy recharge</li>
<li>14-16: Deep work block (creative work) - peak energy</li>
<li>16-17: Meetings - medium energy</li>
<li>17-18: Routine tasks, archiving - low energy</li>
</ul>
</p>
<hr />
<h2>Practical exercise (20-25 min) — Daily energy and attention map</h2>
<ol>
<li><strong>Energy log (1 week)</strong>: Record your energy level (1-10 scale) at 3 times daily (morning, mid-day, afternoon) for a week.</li>
<li><strong>Attention log</strong>: Record how many times your attention was interrupted daily, and what caused it (email, phone, colleague, etc.).</li>
<li><strong>Timing analysis</strong>: Identify when you're most effective (which hours, which days).</li>
<li><strong>Daily schedule design</strong>: Create a daily schedule that:
<ul>
<li>Uses your peak energies for hard tasks</li>
<li>Includes deep work blocks (90-120 min)</li>
<li>Leaves buffer time (20-30%)</li>
<li>Includes energy-recharging activities</li>
</ul>
</li>
</ol>
<hr />
<h2>Self-check</h2>
<ul>
<li>✅ You understand how time, energy, and attention work together.</li>
<li>✅ You've identified your personal energy and attention patterns.</li>
<li>✅ You have a daily schedule that accounts for these constraints.</li>
<li>✅ You know the goal is optimizing all three resources, not just managing time.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>Cal Newport: "Deep Work" — about deep work and attention management</li>
<li>Tony Schwartz: "The Energy Project" — about energy management</li>
<li>Daniel Pink: "When" — about biorhythms and optimal timing</li>
</ul>`,
    emailSubject: 'Productivity 2026 – Day 2: Time, energy, attention',
    emailBody: `<h1>Productivity 2026 – Day 2</h1>
<h2>Time, energy, attention: what you manage in practice</h2>
<p>Today you'll learn how time, energy, and attention work together, and how to plan a daily schedule that accounts for these.</p>
<p><a href="{{APP_URL}}/en/courses/${COURSE_ID_BASE}_EN/day/2">Open the lesson →</a></p>`
  },
  tr: {
    title: 'Zaman, enerji, dikkat: pratikte yönettiğiniz şeyler',
    content: `<h1>Zaman, enerji, dikkat: pratikte yönettiğiniz şeyler</h1>
<p><em>Verimliliğin üç temel direği: zaman, enerji, dikkat</em></p>
<hr />
<h2>Öğrenme hedefi</h2>
<ul>
<li>Zaman, enerji ve dikkatin birlikte nasıl çalıştığını anlamak.</li>
<li>Kişisel zaman, enerji ve dikkat kalıplarınızı belirlemek.</li>
<li>Bu kısıtlamaları dikkate alan günlük bir program oluşturmak.</li>
</ul>
<hr />
<h2>Neden önemli</h2>
<ul>
<li><strong>Zaman</strong>: Sınırlı kaynak. Daha fazlasını yaratamazsınız, sadece daha iyi yönetebilirsiniz.</li>
<li><strong>Enerji</strong>: Değişken kaynak. Gün boyunca değişir ve farklı aktiviteler farklı enerji seviyeleri gerektirir.</li>
<li><strong>Dikkat</strong>: En değerli kaynak. Kolayca kaybolur, geri kazanması zordur.</li>
<li>Üçünün birlikte çalışması gerçek verimliliğinizi belirler.</li>
</ul>
<hr />
<h2>Açıklama</h2>
<h3>Zaman Yönetimi</h3>
<p><strong>Zaman bloklama</strong>: Önemli görevler için takviminizde zaman ayırın. Sadece tepki vermeyin, planlayın.</p>
<p><strong>Zamanlama</strong>: En etkili olduğunuz zamanı belirleyin. Çoğu insan sabah 9-11 ve öğleden sonra 2-4 arasında zirve yapar.</p>
<p><strong>Tampon zaman</strong>: Beklenmedik şeyler için %20-30 tampon zaman bırakın. Aşırı dolu takvim = stres.</p>

<h3>Enerji Yönetimi</h3>
<p><strong>Enerji seviyeleri</strong>: Gününüzün enerjilerini belirleyin:
<ul>
<li><strong>Zirve enerji</strong> (yüksek): Zor, yaratıcı, stratejik işler</li>
<li><strong>Orta enerji</strong>: Toplantılar, e-posta, idari işler</li>
<li><strong>Düşük enerji</strong>: Rutin görevler, okuma, arşivleme</li>
</ul>
</p>
<p><strong>Enerji şarjı</strong>: Sizi ne enerjilendirdiğini (hareket, kısa mola, sosyal etkileşim) ve neyin sizi tükettiğini (uzun toplantılar, çoklu görev) belirleyin.</p>

<h3>Dikkat Yönetimi</h3>
<p><strong>Derin çalışma blokları</strong>: Derin çalışma için 90-120 dakikalık bloklar ayırın. Bu süre boyunca: e-posta yok, telefon yok, toplantı yok.</p>
<p><strong>Dikkat geri kazanımı</strong>: Her kesintiden sonra dikkatinizi geri kazanmak 15-20 dakika sürer. Kesintileri minimize edin.</p>
<p><strong>Ortam tasarımı</strong>: Konsantrasyonu destekleyen bir ortam yaratın (sessizlik, düzenli masa, bildirimler kapalı).</p>

<h3>Pratik Örnek</h3>
<p><strong>Yanlış yaklaşım</strong>: "Bugün 8 saat çalışacağım, ne yaparsam yapayım!"</p>
<p><strong>Doğru yaklaşım</strong>:
<ul>
<li>9-11: Derin çalışma bloğu (stratejik planlama) - zirve enerji</li>
<li>11-12: E-posta, idari işler - orta enerji</li>
<li>12-13: Öğle yemeği, dinlenme - enerji şarjı</li>
<li>14-16: Derin çalışma bloğu (yaratıcı iş) - zirve enerji</li>
<li>16-17: Toplantılar - orta enerji</li>
<li>17-18: Rutin görevler, arşivleme - düşük enerji</li>
</ul>
</p>
<hr />
<h2>Pratik alıştırma (20-25 dakika) — Günlük enerji ve dikkat haritası</h2>
<ol>
<li><strong>Enerji günlüğü (1 hafta)</strong>: Bir hafta boyunca günde 3 kez (sabah, öğle, öğleden sonra) enerji seviyenizi (1-10 ölçeği) kaydedin.</li>
<li><strong>Dikkat günlüğü</strong>: Günlük dikkatinizin kaç kez kesildiğini ve neyin neden olduğunu (e-posta, telefon, meslektaş, vb.) kaydedin.</li>
<li><strong>Zamanlama analizi</strong>: En etkili olduğunuz zamanı belirleyin (hangi saatler, hangi günler).</li>
<li><strong>Günlük program tasarımı</strong>: Şunları içeren bir günlük program oluşturun:
<ul>
<li>Zor görevler için zirve enerjilerinizi kullanır</li>
<li>Derin çalışma blokları içerir (90-120 dakika)</li>
<li>Tampon zaman bırakır (%20-30)</li>
<li>Enerji şarj edici aktiviteler içerir</li>
</ul>
</li>
</ol>
<hr />
<h2>Kendi kendini kontrol</h2>
<ul>
<li>✅ Zaman, enerji ve dikkatin birlikte nasıl çalıştığını anlıyorsunuz.</li>
<li>✅ Kişisel enerji ve dikkat kalıplarınızı belirlediniz.</li>
<li>✅ Bu kısıtlamaları dikkate alan bir günlük programınız var.</li>
<li>✅ Hedefin sadece zamanı yönetmek değil, üç kaynağı da optimize etmek olduğunu biliyorsunuz.</li>
</ul>
<hr />
<h2>İsteğe bağlı derinleştirme</h2>
<ul>
<li>Cal Newport: "Deep Work" — derin çalışma ve dikkat yönetimi hakkında</li>
<li>Tony Schwartz: "The Energy Project" — enerji yönetimi hakkında</li>
<li>Daniel Pink: "When" — biyoritmler ve optimal zamanlama hakkında</li>
</ul>`,
    emailSubject: 'Verimlilik 2026 – 2. Gün: Zaman, enerji, dikkat',
    emailBody: `<h1>Verimlilik 2026 – 2. Gün</h1>
<h2>Zaman, enerji, dikkat: pratikte yönettiğiniz şeyler</h2>
<p>Bugün zaman, enerji ve dikkatin birlikte nasıl çalıştığını ve bunları dikkate alan bir günlük program nasıl planlanacağını öğreneceksiniz.</p>
<p><a href="{{APP_URL}}/tr/courses/${COURSE_ID_BASE}_TR/day/2">Dersi aç →</a></p>`
  },
  bg: {
    title: 'Време, енергия, внимание: какво управлявате на практика',
    content: `<h1>Време, енергия, внимание: какво управлявате на практика</h1>
<p><em>Трите стълба на продуктивността: време, енергия, внимание</em></p>
<hr />
<h2>Учебна цел</h2>
<ul>
<li>Да разберете как времето, енергията и вниманието работят заедно.</li>
<li>Да идентифицирате личните си модели на време, енергия и внимание.</li>
<li>Да създадете дневен график, който отчита тези ограничения.</li>
</ul>
<hr />
<h2>Защо е важно</h2>
<ul>
<li><strong>Време</strong>: Ограничен ресурс. Не можете да създадете повече, само да го управлявате по-добре.</li>
<li><strong>Енергия</strong>: Променлив ресурс. Променя се през деня и различните дейности изискват различни нива на енергия.</li>
<li><strong>Внимание</strong>: Най-ценният ресурс. Лесно се губи, трудно се възстановява.</li>
<li>Взаимодействието на трите определя реалната ви продуктивност.</li>
</ul>
<hr />
<h2>Обяснение</h2>
<h3>Управление на времето</h3>
<p><strong>Блокиране на време</strong>: Блокирайте време в календара си за важни задачи. Не просто реагирайте, планирайте.</p>
<p><strong>Време</strong>: Идентифицирайте кога сте най-ефективни. Повечето хора са на върха между 9-11 сутринта и 2-4 следобед.</p>
<p><strong>Буферно време</strong>: Оставете 20-30% буферно време за неочаквани неща. Препълнен календар = стрес.</p>

<h3>Управление на енергията</h3>
<p><strong>Нива на енергия</strong>: Идентифицирайте енергиите на деня си:
<ul>
<li><strong>Пикова енергия</strong> (висока): Трудна, творческа, стратегическа работа</li>
<li><strong>Средна енергия</strong>: Срещи, имейл, администрация</li>
<li><strong>Ниска енергия</strong>: Рутнинни задачи, четене, архивиране</li>
</ul>
</p>
<p><strong>Зареждане на енергия</strong>: Идентифицирайте какво ви зарежда (движение, кратка почивка, социално взаимодействие) и какво ви изтощава (дълги срещи, многозадачност).</p>

<h3>Управление на вниманието</h3>
<p><strong>Блокове за дълбока работа</strong>: Блокирайте 90-120 минутни блокове за дълбока работа. През това време: без имейл, без телефон, без срещи.</p>
<p><strong>Възстановяване на вниманието</strong>: След всяко прекъсване са необходими 15-20 минути, за да възстановите вниманието си. Минимизирайте прекъсванията.</p>
<p><strong>Дизайн на средата</strong>: Създайте среда, която подкрепя концентрацията (тишина, подреден бюро, изключени известия).</p>

<h3>Практически пример</h3>
<p><strong>Грешен подход</strong>: "Днес ще работя 8 часа, правейки каквото и да е!"</p>
<p><strong>Правилен подход</strong>:
<ul>
<li>9-11: Блок за дълбока работа (стратегическо планиране) - пикова енергия</li>
<li>11-12: Имейл, администрация - средна енергия</li>
<li>12-13: Обяд, почивка - зареждане на енергия</li>
<li>14-16: Блок за дълбока работа (творческа работа) - пикова енергия</li>
<li>16-17: Срещи - средна енергия</li>
<li>17-18: Рутнинни задачи, архивиране - ниска енергия</li>
</ul>
</p>
<hr />
<h2>Практическо упражнение (20-25 мин) — Дневна карта на енергия и внимание</h2>
<ol>
<li><strong>Дневник на енергията (1 седмица)</strong>: Записвайте нивото на енергията си (скала 1-10) 3 пъти дневно (сутрин, обяд, следобед) за една седмица.</li>
<li><strong>Дневник на вниманието</strong>: Записвайте колко пъти вниманието ви е прекъснато дневно и какво го е причинило (имейл, телефон, колега и т.н.).</li>
<li><strong>Анализ на времето</strong>: Идентифицирайте кога сте най-ефективни (кои часове, кои дни).</li>
<li><strong>Дизайн на дневен график</strong>: Създайте дневен график, който:
<ul>
<li>Използва пиковите ви енергии за трудни задачи</li>
<li>Включва блокове за дълбока работа (90-120 мин)</li>
<li>Оставя буферно време (20-30%)</li>
<li>Включва дейности за зареждане на енергия</li>
</ul>
</li>
</ol>
<hr />
<h2>Самопроверка</h2>
<ul>
<li>✅ Разбирате как времето, енергията и вниманието работят заедно.</li>
<li>✅ Идентифицирали сте личните си модели на енергия и внимание.</li>
<li>✅ Имате дневен график, който отчита тези ограничения.</li>
<li>✅ Знаете, че целта е оптимизиране на трите ресурса, а не само управление на времето.</li>
</ul>
<hr />
<h2>Опционално задълбочаване</h2>
<ul>
<li>Кал Нюпорт: "Deep Work" — за дълбока работа и управление на вниманието</li>
<li>Тони Шварц: "The Energy Project" — за управление на енергията</li>
<li>Даниел Пинк: "When" — за биоритми и оптимално време</li>
</ul>`,
    emailSubject: 'Продуктивност 2026 – Ден 2: Време, енергия, внимание',
    emailBody: `<h1>Продуктивност 2026 – Ден 2</h1>
<h2>Време, енергия, внимание: какво управлявате на практика</h2>
<p>Днес ще научите как времето, енергията и вниманието работят заедно и как да планирате дневен график, който отчита тези.</p>
<p><a href="{{APP_URL}}/bg/courses/${COURSE_ID_BASE}_BG/day/2">Отворете урока →</a></p>`
  },
  pl: {
    title: 'Czas, energia, uwaga: co zarządzasz w praktyce',
    content: `<h1>Czas, energia, uwaga: co zarządzasz w praktyce</h1>
<p><em>Trzy filary produktywności: czas, energia, uwaga</em></p>
<hr />
<h2>Cel uczenia się</h2>
<ul>
<li>Zrozumieć, jak czas, energia i uwaga działają razem.</li>
<li>Zidentyfikować swoje osobiste wzorce czasu, energii i uwagi.</li>
<li>Stworzyć codzienny harmonogram, który uwzględnia te ograniczenia.</li>
</ul>
<hr />
<h2>Dlaczego to ważne</h2>
<ul>
<li><strong>Czas</strong>: Ograniczony zasób. Nie możesz stworzyć więcej, tylko lepiej nim zarządzać.</li>
<li><strong>Energia</strong>: Zmienny zasób. Zmienia się w ciągu dnia, a różne aktywności wymagają różnych poziomów energii.</li>
<li><strong>Uwaga</strong>: Najcenniejszy zasób. Łatwo się traci, trudno przywrócić.</li>
<li>Współdziałanie wszystkich trzech określa twoją rzeczywistą produktywność.</li>
</ul>
<hr />
<h2>Wyjaśnienie</h2>
<h3>Zarządzanie czasem</h3>
<p><strong>Blokowanie czasu</strong>: Zablokuj czas w kalendarzu na ważne zadania. Nie tylko reaguj, planuj.</p>
<p><strong>Timing</strong>: Zidentyfikuj, kiedy jesteś najbardziej efektywny. Większość ludzi osiąga szczyt między 9-11 rano i 14-16 po południu.</p>
<p><strong>Czas buforowy</strong>: Zostaw 20-30% czasu buforowego na nieoczekiwane rzeczy. Przepełniony kalendarz = stres.</p>

<h3>Zarządzanie energią</h3>
<p><strong>Poziomy energii</strong>: Zidentyfikuj energie swojego dnia:
<ul>
<li><strong>Szczyt energii</strong> (wysoki): Trudna, kreatywna, strategiczna praca</li>
<li><strong>Średnia energia</strong>: Spotkania, e-mail, administracja</li>
<li><strong>Niska energia</strong>: Rutynowe zadania, czytanie, archiwizacja</li>
</ul>
</p>
<p><strong>Ładowanie energii</strong>: Zidentyfikuj, co cię energetyzuje (ruch, krótka przerwa, interakcja społeczna) i co cię wyczerpuje (długie spotkania, multitasking).</p>

<h3>Zarządzanie uwagą</h3>
<p><strong>Bloki głębokiej pracy</strong>: Zablokuj 90-120 minutowe bloki na głęboką pracę. W tym czasie: brak e-maila, brak telefonu, brak spotkań.</p>
<p><strong>Przywracanie uwagi</strong>: Po każdym przerwaniu potrzeba 15-20 minut, aby przywrócić uwagę. Minimalizuj przerwania.</p>
<p><strong>Projektowanie środowiska</strong>: Stwórz środowisko, które wspiera koncentrację (cisza, uporządkowane biurko, wyłączone powiadomienia).</p>

<h3>Praktyczny przykład</h3>
<p><strong>Złe podejście</strong>: "Dzisiaj będę pracować 8 godzin, robiąc cokolwiek!"</p>
<p><strong>Właściwe podejście</strong>:
<ul>
<li>9-11: Blok głębokiej pracy (planowanie strategiczne) - szczyt energii</li>
<li>11-12: E-mail, administracja - średnia energia</li>
<li>12-13: Lunch, odpoczynek - ładowanie energii</li>
<li>14-16: Blok głębokiej pracy (praca kreatywna) - szczyt energii</li>
<li>16-17: Spotkania - średnia energia</li>
<li>17-18: Rutynowe zadania, archiwizacja - niska energia</li>
</ul>
</p>
<hr />
<h2>Praktyczne ćwiczenie (20-25 min) — Mapa codziennej energii i uwagi</h2>
<ol>
<li><strong>Dziennik energii (1 tydzień)</strong>: Zapisz poziom energii (skala 1-10) 3 razy dziennie (rano, południe, popołudnie) przez tydzień.</li>
<li><strong>Dziennik uwagi</strong>: Zapisz, ile razy twoja uwaga była przerwana dziennie i co to spowodowało (e-mail, telefon, kolega itp.).</li>
<li><strong>Analiza czasu</strong>: Zidentyfikuj, kiedy jesteś najbardziej efektywny (które godziny, które dni).</li>
<li><strong>Projektowanie codziennego harmonogramu</strong>: Stwórz codzienny harmonogram, który:
<ul>
<li>Wykorzystuje twoje szczyty energii do trudnych zadań</li>
<li>Zawiera bloki głębokiej pracy (90-120 min)</li>
<li>Zostawia czas buforowy (20-30%)</li>
<li>Zawiera aktywności ładujące energię</li>
</ul>
</li>
</ol>
<hr />
<h2>Samosprawdzenie</h2>
<ul>
<li>✅ Rozumiesz, jak czas, energia i uwaga działają razem.</li>
<li>✅ Zidentyfikowałeś swoje osobiste wzorce energii i uwagi.</li>
<li>✅ Masz codzienny harmonogram, który uwzględnia te ograniczenia.</li>
<li>✅ Wiesz, że celem jest optymalizacja wszystkich trzech zasobów, a nie tylko zarządzanie czasem.</li>
</ul>
<hr />
<h2>Opcjonalne pogłębienie</h2>
<ul>
<li>Cal Newport: "Deep Work" — o głębokiej pracy i zarządzaniu uwagą</li>
<li>Tony Schwartz: "The Energy Project" — o zarządzaniu energią</li>
<li>Daniel Pink: "When" — o biorytmach i optymalnym czasie</li>
</ul>`,
    emailSubject: 'Produktywność 2026 – Dzień 2: Czas, energia, uwaga',
    emailBody: `<h1>Produktywność 2026 – Dzień 2</h1>
<h2>Czas, energia, uwaga: co zarządzasz w praktyce</h2>
<p>Dzisiaj nauczysz się, jak czas, energia i uwaga działają razem oraz jak planować codzienny harmonogram, który to uwzględnia.</p>
<p><a href="{{APP_URL}}/pl/courses/${COURSE_ID_BASE}_PL/day/2">Otwórz lekcję →</a></p>`
  },
  vi: {
    title: 'Thời gian, năng lượng, sự chú ý: những gì bạn quản lý trong thực tế',
    content: `<h1>Thời gian, năng lượng, sự chú ý: những gì bạn quản lý trong thực tế</h1>
<p><em>Ba trụ cột của năng suất: thời gian, năng lượng, sự chú ý</em></p>
<hr />
<h2>Mục tiêu học tập</h2>
<ul>
<li>Hiểu cách thời gian, năng lượng và sự chú ý hoạt động cùng nhau.</li>
<li>Xác định các mẫu thời gian, năng lượng và sự chú ý cá nhân của bạn.</li>
<li>Tạo lịch trình hàng ngày tính đến những hạn chế này.</li>
</ul>
<hr />
<h2>Tại sao quan trọng</h2>
<ul>
<li><strong>Thời gian</strong>: Nguồn lực hữu hạn. Bạn không thể tạo thêm, chỉ có thể quản lý tốt hơn.</li>
<li><strong>Năng lượng</strong>: Nguồn lực biến đổi. Thay đổi trong suốt ngày, và các hoạt động khác nhau yêu cầu mức năng lượng khác nhau.</li>
<li><strong>Sự chú ý</strong>: Nguồn lực quý giá nhất. Dễ mất, khó khôi phục.</li>
<li>Sự tương tác của cả ba xác định năng suất thực tế của bạn.</li>
</ul>
<hr />
<h2>Giải thích</h2>
<h3>Quản lý thời gian</h3>
<p><strong>Chặn thời gian</strong>: Chặn thời gian trong lịch của bạn cho các nhiệm vụ quan trọng. Đừng chỉ phản ứng, hãy lập kế hoạch.</p>
<p><strong>Thời điểm</strong>: Xác định khi nào bạn hiệu quả nhất. Hầu hết mọi người đạt đỉnh giữa 9-11 giờ sáng và 2-4 giờ chiều.</p>
<p><strong>Thời gian đệm</strong>: Để lại 20-30% thời gian đệm cho những điều bất ngờ. Lịch quá đầy = căng thẳng.</p>

<h3>Quản lý năng lượng</h3>
<p><strong>Mức năng lượng</strong>: Xác định năng lượng trong ngày của bạn:
<ul>
<li><strong>Năng lượng đỉnh</strong> (cao): Công việc khó, sáng tạo, chiến lược</li>
<li><strong>Năng lượng trung bình</strong>: Cuộc họp, email, hành chính</li>
<li><strong>Năng lượng thấp</strong>: Nhiệm vụ thường ngày, đọc, lưu trữ</li>
</ul>
</p>
<p><strong>Sạc năng lượng</strong>: Xác định điều gì nạp năng lượng cho bạn (vận động, nghỉ ngắn, tương tác xã hội) và điều gì làm cạn kiệt bạn (cuộc họp dài, đa nhiệm).</p>

<h3>Quản lý sự chú ý</h3>
<p><strong>Khối công việc sâu</strong>: Chặn các khối 90-120 phút cho công việc sâu. Trong thời gian này: không email, không điện thoại, không cuộc họp.</p>
<p><strong>Khôi phục sự chú ý</strong>: Sau mỗi gián đoạn, cần 15-20 phút để khôi phục sự chú ý của bạn. Giảm thiểu gián đoạn.</p>
<p><strong>Thiết kế môi trường</strong>: Tạo môi trường hỗ trợ sự tập trung (yên tĩnh, bàn làm việc gọn gàng, tắt thông báo).</p>

<h3>Ví dụ thực tế</h3>
<p><strong>Cách tiếp cận sai</strong>: "Hôm nay tôi sẽ làm việc 8 giờ, làm bất cứ điều gì!"</p>
<p><strong>Cách tiếp cận đúng</strong>:
<ul>
<li>9-11: Khối công việc sâu (lập kế hoạch chiến lược) - năng lượng đỉnh</li>
<li>11-12: Email, hành chính - năng lượng trung bình</li>
<li>12-13: Ăn trưa, nghỉ ngơi - sạc năng lượng</li>
<li>14-16: Khối công việc sâu (công việc sáng tạo) - năng lượng đỉnh</li>
<li>16-17: Cuộc họp - năng lượng trung bình</li>
<li>17-18: Nhiệm vụ thường ngày, lưu trữ - năng lượng thấp</li>
</ul>
</p>
<hr />
<h2>Bài tập thực hành (20-25 phút) — Bản đồ năng lượng và sự chú ý hàng ngày</h2>
<ol>
<li><strong>Nhật ký năng lượng (1 tuần)</strong>: Ghi lại mức năng lượng của bạn (thang điểm 1-10) 3 lần mỗi ngày (sáng, trưa, chiều) trong một tuần.</li>
<li><strong>Nhật ký sự chú ý</strong>: Ghi lại bao nhiêu lần sự chú ý của bạn bị gián đoạn mỗi ngày và điều gì gây ra (email, điện thoại, đồng nghiệp, v.v.).</li>
<li><strong>Phân tích thời điểm</strong>: Xác định khi nào bạn hiệu quả nhất (giờ nào, ngày nào).</li>
<li><strong>Thiết kế lịch trình hàng ngày</strong>: Tạo lịch trình hàng ngày:
<ul>
<li>Sử dụng năng lượng đỉnh của bạn cho các nhiệm vụ khó</li>
<li>Bao gồm các khối công việc sâu (90-120 phút)</li>
<li>Để lại thời gian đệm (20-30%)</li>
<li>Bao gồm các hoạt động sạc năng lượng</li>
</ul>
</li>
</ol>
<hr />
<h2>Tự kiểm tra</h2>
<ul>
<li>✅ Bạn hiểu cách thời gian, năng lượng và sự chú ý hoạt động cùng nhau.</li>
<li>✅ Bạn đã xác định các mẫu năng lượng và sự chú ý cá nhân của mình.</li>
<li>✅ Bạn có lịch trình hàng ngày tính đến những hạn chế này.</li>
<li>✅ Bạn biết mục tiêu là tối ưu hóa cả ba nguồn lực, không chỉ quản lý thời gian.</li>
</ul>
<hr />
<h2>Đào sâu tùy chọn</h2>
<ul>
<li>Cal Newport: "Deep Work" — về công việc sâu và quản lý sự chú ý</li>
<li>Tony Schwartz: "The Energy Project" — về quản lý năng lượng</li>
<li>Daniel Pink: "When" — về nhịp sinh học và thời điểm tối ưu</li>
</ul>`,
    emailSubject: 'Năng suất 2026 – Ngày 2: Thời gian, năng lượng, sự chú ý',
    emailBody: `<h1>Năng suất 2026 – Ngày 2</h1>
<h2>Thời gian, năng lượng, sự chú ý: những gì bạn quản lý trong thực tế</h2>
<p>Hôm nay bạn sẽ học cách thời gian, năng lượng và sự chú ý hoạt động cùng nhau, và cách lập kế hoạch lịch trình hàng ngày tính đến những điều này.</p>
<p><a href="{{APP_URL}}/vi/courses/${COURSE_ID_BASE}_VI/day/2">Mở bài học →</a></p>`
  },
  id: {
    title: 'Waktu, energi, perhatian: apa yang Anda kelola dalam praktik',
    content: `<h1>Waktu, energi, perhatian: apa yang Anda kelola dalam praktik</h1>
<p><em>Tiga pilar produktivitas: waktu, energi, perhatian</em></p>
<hr />
<h2>Tujuan pembelajaran</h2>
<ul>
<li>Memahami bagaimana waktu, energi, dan perhatian bekerja bersama.</li>
<li>Mengidentifikasi pola waktu, energi, dan perhatian pribadi Anda.</li>
<li>Membuat jadwal harian yang memperhitungkan batasan-batasan ini.</li>
</ul>
<hr />
<h2>Mengapa penting</h2>
<ul>
<li><strong>Waktu</strong>: Sumber daya terbatas. Anda tidak bisa membuat lebih banyak, hanya mengelolanya lebih baik.</li>
<li><strong>Energi</strong>: Sumber daya variabel. Berubah sepanjang hari, dan aktivitas berbeda memerlukan tingkat energi berbeda.</li>
<li><strong>Perhatian</strong>: Sumber daya paling berharga. Mudah hilang, sulit dipulihkan.</li>
<li>Interaksi ketiganya menentukan produktivitas nyata Anda.</li>
</ul>
<hr />
<h2>Penjelasan</h2>
<h3>Mengelola Waktu</h3>
<p><strong>Pemblokiran waktu</strong>: Blokir waktu di kalender Anda untuk tugas penting. Jangan hanya bereaksi, rencanakan.</p>
<p><strong>Waktu</strong>: Identifikasi kapan Anda paling efektif. Kebanyakan orang mencapai puncak antara 9-11 pagi dan 2-4 sore.</p>
<p><strong>Waktu penyangga</strong>: Sisakan 20-30% waktu penyangga untuk hal-hal tak terduga. Kalender terlalu penuh = stres.</p>

<h3>Mengelola Energi</h3>
<p><strong>Tingkat energi</strong>: Identifikasi energi hari Anda:
<ul>
<li><strong>Energi puncak</strong> (tinggi): Pekerjaan sulit, kreatif, strategis</li>
<li><strong>Energi sedang</strong>: Rapat, email, administrasi</li>
<li><strong>Energi rendah</strong>: Tugas rutin, membaca, pengarsipan</li>
</ul>
</p>
<p><strong>Pengisian energi</strong>: Identifikasi apa yang memberi energi (gerakan, istirahat singkat, interaksi sosial) dan apa yang menguras (rapat panjang, multitasking).</p>

<h3>Mengelola Perhatian</h3>
<p><strong>Blok kerja mendalam</strong>: Blokir blok 90-120 menit untuk kerja mendalam. Selama waktu ini: tidak ada email, tidak ada telepon, tidak ada rapat.</p>
<p><strong>Pemulihan perhatian</strong>: Setelah setiap gangguan, diperlukan 15-20 menit untuk memulihkan perhatian Anda. Minimalkan gangguan.</p>
<p><strong>Desain lingkungan</strong>: Ciptakan lingkungan yang mendukung konsentrasi (tenang, meja rapi, notifikasi mati).</p>

<h3>Contoh Praktis</h3>
<p><strong>Pendekatan salah</strong>: "Hari ini saya akan bekerja 8 jam, melakukan apa pun!"</p>
<p><strong>Pendekatan benar</strong>:
<ul>
<li>9-11: Blok kerja mendalam (perencanaan strategis) - energi puncak</li>
<li>11-12: Email, administrasi - energi sedang</li>
<li>12-13: Makan siang, istirahat - pengisian energi</li>
<li>14-16: Blok kerja mendalam (pekerjaan kreatif) - energi puncak</li>
<li>16-17: Rapat - energi sedang</li>
<li>17-18: Tugas rutin, pengarsipan - energi rendah</li>
</ul>
</p>
<hr />
<h2>Latihan praktis (20-25 menit) — Peta energi dan perhatian harian</h2>
<ol>
<li><strong>Log energi (1 minggu)</strong>: Catat tingkat energi Anda (skala 1-10) 3 kali sehari (pagi, siang, sore) selama seminggu.</li>
<li><strong>Log perhatian</strong>: Catat berapa kali perhatian Anda terganggu setiap hari dan apa yang menyebabkannya (email, telepon, kolega, dll.).</li>
<li><strong>Analisis waktu</strong>: Identifikasi kapan Anda paling efektif (jam berapa, hari apa).</li>
<li><strong>Desain jadwal harian</strong>: Buat jadwal harian yang:
<ul>
<li>Menggunakan energi puncak Anda untuk tugas sulit</li>
<li>Mencakup blok kerja mendalam (90-120 menit)</li>
<li>Menyisakan waktu penyangga (20-30%)</li>
<li>Mencakup aktivitas pengisian energi</li>
</ul>
</li>
</ol>
<hr />
<h2>Pemeriksaan diri</h2>
<ul>
<li>✅ Anda memahami bagaimana waktu, energi, dan perhatian bekerja bersama.</li>
<li>✅ Anda telah mengidentifikasi pola energi dan perhatian pribadi Anda.</li>
<li>✅ Anda memiliki jadwal harian yang memperhitungkan batasan-batasan ini.</li>
<li>✅ Anda tahu tujuannya adalah mengoptimalkan ketiga sumber daya, bukan hanya mengelola waktu.</li>
</ul>
<hr />
<h2>Pendalaman opsional</h2>
<ul>
<li>Cal Newport: "Deep Work" — tentang kerja mendalam dan manajemen perhatian</li>
<li>Tony Schwartz: "The Energy Project" — tentang manajemen energi</li>
<li>Daniel Pink: "When" — tentang bioritme dan waktu optimal</li>
</ul>`,
    emailSubject: 'Produktivitas 2026 – Hari 2: Waktu, energi, perhatian',
    emailBody: `<h1>Produktivitas 2026 – Hari 2</h1>
<h2>Waktu, energi, perhatian: apa yang Anda kelola dalam praktik</h2>
<p>Hari ini Anda akan mempelajari bagaimana waktu, energi, dan perhatian bekerja bersama, dan cara merencanakan jadwal harian yang memperhitungkan hal-hal ini.</p>
<p><a href="{{APP_URL}}/id/courses/${COURSE_ID_BASE}_ID/day/2">Buka pelajaran →</a></p>`
  },
  ar: {
    title: 'الوقت والطاقة والانتباه: ما تديره في الممارسة',
    content: `<h1>الوقت والطاقة والانتباه: ما تديره في الممارسة</h1>
<p><em>الأعمدة الثلاثة للإنتاجية: الوقت والطاقة والانتباه</em></p>
<hr />
<h2>هدف التعلم</h2>
<ul>
<li>فهم كيفية عمل الوقت والطاقة والانتباه معًا.</li>
<li>تحديد أنماط الوقت والطاقة والانتباه الشخصية الخاصة بك.</li>
<li>إنشاء جدول يومي يأخذ في الاعتبار هذه القيود.</li>
</ul>
<hr />
<h2>لماذا يهم</h2>
<ul>
<li><strong>الوقت</strong>: مورد محدود. لا يمكنك إنشاء المزيد، فقط إدارته بشكل أفضل.</li>
<li><strong>الطاقة</strong>: مورد متغير. يتغير على مدار اليوم، والأنشطة المختلفة تتطلب مستويات طاقة مختلفة.</li>
<li><strong>الانتباه</strong>: المورد الأكثر قيمة. يضيع بسهولة، يصعب استعادته.</li>
<li>تفاعل الثلاثة يحدد إنتاجيتك الحقيقية.</li>
</ul>
<hr />
<h2>شرح</h2>
<h3>إدارة الوقت</h3>
<p><strong>حظر الوقت</strong>: احظر الوقت في التقويم الخاص بك للمهام المهمة. لا تتفاعل فقط، خطط.</p>
<p><strong>التوقيت</strong>: حدد متى تكون أكثر فعالية. يصل معظم الناس إلى الذروة بين 9-11 صباحًا و 2-4 مساءً.</p>
<p><strong>وقت العازل</strong>: اترك 20-30% وقت عازل للأشياء غير المتوقعة. التقويم المزدحم = التوتر.</p>

<h3>إدارة الطاقة</h3>
<p><strong>مستويات الطاقة</strong>: حدد طاقات يومك:
<ul>
<li><strong>طاقة الذروة</strong> (عالية): العمل الصعب والإبداعي والاستراتيجي</li>
<li><strong>الطاقة المتوسطة</strong>: الاجتماعات والبريد الإلكتروني والإدارة</li>
<li><strong>الطاقة المنخفضة</strong>: المهام الروتينية والقراءة والأرشفة</li>
</ul>
</p>
<p><strong>شحن الطاقة</strong>: حدد ما ينشطك (الحركة، الاستراحة القصيرة، التفاعل الاجتماعي) وما يستنزفك (الاجتماعات الطويلة، تعدد المهام).</p>

<h3>إدارة الانتباه</h3>
<p><strong>كتل العمل العميق</strong>: احظر كتل 90-120 دقيقة للعمل العميق. خلال هذا الوقت: لا بريد إلكتروني، لا هاتف، لا اجتماعات.</p>
<p><strong>استعادة الانتباه</strong>: بعد كل انقطاع، يستغرق الأمر 15-20 دقيقة لاستعادة انتباهك. قلل الانقطاعات.</p>
<p><strong>تصميم البيئة</strong>: أنشئ بيئة تدعم التركيز (هادئة، مكتب منظم، إشعارات معطلة).</p>

<h3>مثال عملي</h3>
<p><strong>نهج خاطئ</strong>: "سأعمل اليوم 8 ساعات، أفعل أي شيء!"</p>
<p><strong>نهج صحيح</strong>:
<ul>
<li>9-11: كتلة عمل عميقة (التخطيط الاستراتيجي) - طاقة الذروة</li>
<li>11-12: البريد الإلكتروني والإدارة - الطاقة المتوسطة</li>
<li>12-13: الغداء والراحة - شحن الطاقة</li>
<li>14-16: كتلة عمل عميقة (العمل الإبداعي) - طاقة الذروة</li>
<li>16-17: الاجتماعات - الطاقة المتوسطة</li>
<li>17-18: المهام الروتينية والأرشفة - الطاقة المنخفضة</li>
</ul>
</p>
<hr />
<h2>تمرين عملي (20-25 دقيقة) — خريطة الطاقة والانتباه اليومية</h2>
<ol>
<li><strong>سجل الطاقة (أسبوع واحد)</strong>: سجل مستوى طاقتك (مقياس 1-10) 3 مرات يوميًا (صباحًا، ظهرًا، بعد الظهر) لمدة أسبوع.</li>
<li><strong>سجل الانتباه</strong>: سجل عدد مرات انقطاع انتباهك يوميًا وما الذي تسبب فيه (البريد الإلكتروني، الهاتف، الزميل، إلخ).</li>
<li><strong>تحليل التوقيت</strong>: حدد متى تكون أكثر فعالية (أي ساعات، أي أيام).</li>
<li><strong>تصميم الجدول اليومي</strong>: أنشئ جدولًا يوميًا:
<ul>
<li>يستخدم طاقات الذروة الخاصة بك للمهام الصعبة</li>
<li>يتضمن كتل عمل عميقة (90-120 دقيقة)</li>
<li>يترك وقت عازل (20-30%)</li>
<li>يتضمن أنشطة شحن الطاقة</li>
</ul>
</li>
</ol>
<hr />
<h2>الفحص الذاتي</h2>
<ul>
<li>✅ تفهم كيف يعمل الوقت والطاقة والانتباه معًا.</li>
<li>✅ حددت أنماط الطاقة والانتباه الشخصية الخاصة بك.</li>
<li>✅ لديك جدول يومي يأخذ في الاعتبار هذه القيود.</li>
<li>✅ تعرف أن الهدف هو تحسين الموارد الثلاثة، وليس فقط إدارة الوقت.</li>
</ul>
<hr />
<h2>تعميق اختياري</h2>
<ul>
<li>Cal Newport: "Deep Work" — حول العمل العميق وإدارة الانتباه</li>
<li>Tony Schwartz: "The Energy Project" — حول إدارة الطاقة</li>
<li>Daniel Pink: "When" — حول الإيقاعات الحيوية والتوقيت الأمثل</li>
</ul>`,
    emailSubject: 'الإنتاجية 2026 – اليوم 2: الوقت والطاقة والانتباه',
    emailBody: `<h1>الإنتاجية 2026 – اليوم 2</h1>
<h2>الوقت والطاقة والانتباه: ما تديره في الممارسة</h2>
<p>اليوم سوف تتعلم كيف يعمل الوقت والطاقة والانتباه معًا، وكيفية التخطيط لجدول يومي يأخذ في الاعتبار هذه.</p>
<p><a href="{{APP_URL}}/ar/courses/${COURSE_ID_BASE}_AR/day/2">افتح الدرس →</a></p>`
  },
  pt: {
    title: 'Tempo, energia, atenção: o que você gerencia na prática',
    content: `<h1>Tempo, energia, atenção: o que você gerencia na prática</h1>
<p><em>Os três pilares da produtividade: tempo, energia, atenção</em></p>
<hr />
<h2>Objetivo de aprendizagem</h2>
<ul>
<li>Entender como tempo, energia e atenção trabalham juntos.</li>
<li>Identificar seus padrões pessoais de tempo, energia e atenção.</li>
<li>Criar uma agenda diária que leve em conta essas restrições.</li>
</ul>
<hr />
<h2>Por que importa</h2>
<ul>
<li><strong>Tempo</strong>: Recurso finito. Você não pode criar mais, apenas gerenciar melhor.</li>
<li><strong>Energia</strong>: Recurso variável. Muda ao longo do dia, e diferentes atividades requerem diferentes níveis de energia.</li>
<li><strong>Atenção</strong>: Recurso mais valioso. Facilmente perdido, difícil de restaurar.</li>
<li>A interação dos três determina sua produtividade real.</li>
</ul>
<hr />
<h2>Explicação</h2>
<h3>Gerenciando o Tempo</h3>
<p><strong>Bloqueio de tempo</strong>: Bloqueie tempo em sua agenda para tarefas importantes. Não apenas reaja, planeje.</p>
<p><strong>Horário</strong>: Identifique quando você é mais eficaz. A maioria das pessoas atinge o pico entre 9-11h e 14-16h.</p>
<p><strong>Tempo de buffer</strong>: Deixe 20-30% de tempo de buffer para coisas inesperadas. Agenda lotada = estresse.</p>

<h3>Gerenciando a Energia</h3>
<p><strong>Níveis de energia</strong>: Identifique as energias do seu dia:
<ul>
<li><strong>Energia de pico</strong> (alta): Trabalho difícil, criativo, estratégico</li>
<li><strong>Energia média</strong>: Reuniões, e-mail, administração</li>
<li><strong>Energia baixa</strong>: Tarefas rotineiras, leitura, arquivamento</li>
</ul>
</p>
<p><strong>Recarga de energia</strong>: Identifique o que energiza você (movimento, pausa curta, interação social) e o que drena você (reuniões longas, multitarefa).</p>

<h3>Gerenciando a Atenção</h3>
<p><strong>Blocos de trabalho profundo</strong>: Bloqueie blocos de 90-120 minutos para trabalho profundo. Durante esse tempo: sem e-mail, sem telefone, sem reuniões.</p>
<p><strong>Restauração da atenção</strong>: Após cada interrupção, leva 15-20 minutos para restaurar sua atenção. Minimize interrupções.</p>
<p><strong>Design do ambiente</strong>: Crie um ambiente que apoie a concentração (silêncio, mesa organizada, notificações desativadas).</p>

<h3>Exemplo Prático</h3>
<p><strong>Abordagem errada</strong>: "Hoje vou trabalhar 8 horas, fazendo qualquer coisa!"</p>
<p><strong>Abordagem correta</strong>:
<ul>
<li>9-11: Bloco de trabalho profundo (planejamento estratégico) - energia de pico</li>
<li>11-12: E-mail, administração - energia média</li>
<li>12-13: Almoço, descanso - recarga de energia</li>
<li>14-16: Bloco de trabalho profundo (trabalho criativo) - energia de pico</li>
<li>16-17: Reuniões - energia média</li>
<li>17-18: Tarefas rotineiras, arquivamento - energia baixa</li>
</ul>
</p>
<hr />
<h2>Exercício prático (20-25 min) — Mapa de energia e atenção diária</h2>
<ol>
<li><strong>Registro de energia (1 semana)</strong>: Registre seu nível de energia (escala 1-10) 3 vezes ao dia (manhã, meio-dia, tarde) por uma semana.</li>
<li><strong>Registro de atenção</strong>: Registre quantas vezes sua atenção foi interrompida diariamente e o que causou (e-mail, telefone, colega, etc.).</li>
<li><strong>Análise de horário</strong>: Identifique quando você é mais eficaz (quais horas, quais dias).</li>
<li><strong>Design de agenda diária</strong>: Crie uma agenda diária que:
<ul>
<li>Use suas energias de pico para tarefas difíceis</li>
<li>Inclua blocos de trabalho profundo (90-120 min)</li>
<li>Deixe tempo de buffer (20-30%)</li>
<li>Inclua atividades de recarga de energia</li>
</ul>
</li>
</ol>
<hr />
<h2>Auto-verificação</h2>
<ul>
<li>✅ Você entende como tempo, energia e atenção trabalham juntos.</li>
<li>✅ Você identificou seus padrões pessoais de energia e atenção.</li>
<li>✅ Você tem uma agenda diária que leva em conta essas restrições.</li>
<li>✅ Você sabe que o objetivo é otimizar os três recursos, não apenas gerenciar o tempo.</li>
</ul>
<hr />
<h2>Aprofundamento opcional</h2>
<ul>
<li>Cal Newport: "Deep Work" — sobre trabalho profundo e gestão da atenção</li>
<li>Tony Schwartz: "The Energy Project" — sobre gestão de energia</li>
<li>Daniel Pink: "When" — sobre biorritmos e horário ideal</li>
</ul>`,
    emailSubject: 'Produtividade 2026 – Dia 2: Tempo, energia, atenção',
    emailBody: `<h1>Produtividade 2026 – Dia 2</h1>
<h2>Tempo, energia, atenção: o que você gerencia na prática</h2>
<p>Hoje você aprenderá como tempo, energia e atenção trabalham juntos, e como planejar uma agenda diária que leve em conta isso.</p>
<p><a href="{{APP_URL}}/pt/courses/${COURSE_ID_BASE}_PT/day/2">Abrir a lição →</a></p>`
  },
  hi: {
    title: 'समय, ऊर्जा, ध्यान: आप व्यवहार में क्या प्रबंधित करते हैं',
    content: `<h1>समय, ऊर्जा, ध्यान: आप व्यवहार में क्या प्रबंधित करते हैं</h1>
<p><em>उत्पादकता के तीन स्तंभ: समय, ऊर्जा, ध्यान</em></p>
<hr />
<h2>सीखने का लक्ष्य</h2>
<ul>
<li>समझना कि समय, ऊर्जा और ध्यान एक साथ कैसे काम करते हैं।</li>
<li>अपने व्यक्तिगत समय, ऊर्जा और ध्यान पैटर्न की पहचान करना।</li>
<li>एक दैनिक अनुसूची बनाना जो इन बाधाओं को ध्यान में रखती है।</li>
</ul>
<hr />
<h2>क्यों महत्वपूर्ण है</h2>
<ul>
<li><strong>समय</strong>: सीमित संसाधन। आप अधिक नहीं बना सकते, केवल बेहतर प्रबंधन कर सकते हैं।</li>
<li><strong>ऊर्जा</strong>: परिवर्तनशील संसाधन। दिन भर बदलता है, और विभिन्न गतिविधियों के लिए अलग-अलग ऊर्जा स्तर की आवश्यकता होती है।</li>
<li><strong>ध्यान</strong>: सबसे मूल्यवान संसाधन। आसानी से खो जाता है, बहाल करना मुश्किल।</li>
<li>तीनों की बातचीत आपकी वास्तविक उत्पादकता निर्धारित करती है।</li>
</ul>
<hr />
<h2>व्याख्या</h2>
<h3>समय प्रबंधन</h3>
<p><strong>समय ब्लॉकिंग</strong>: महत्वपूर्ण कार्यों के लिए अपने कैलेंडर में समय ब्लॉक करें। केवल प्रतिक्रिया न दें, योजना बनाएं।</p>
<p><strong>समय</strong>: पहचानें कि आप कब सबसे प्रभावी हैं। अधिकांश लोग सुबह 9-11 और दोपहर 2-4 के बीच चरम पर होते हैं।</p>
<p><strong>बफर समय</strong>: अप्रत्याशित चीजों के लिए 20-30% बफर समय छोड़ें। भरा हुआ कैलेंडर = तनाव।</p>

<h3>ऊर्जा प्रबंधन</h3>
<p><strong>ऊर्जा स्तर</strong>: अपने दिन की ऊर्जाओं की पहचान करें:
<ul>
<li><strong>चरम ऊर्जा</strong> (उच्च): कठिन, रचनात्मक, रणनीतिक कार्य</li>
<li><strong>मध्यम ऊर्जा</strong>: बैठकें, ईमेल, प्रशासन</li>
<li><strong>कम ऊर्जा</strong>: नियमित कार्य, पढ़ना, संग्रह</li>
</ul>
</p>
<p><strong>ऊर्जा रिचार्ज</strong>: पहचानें कि आपको क्या ऊर्जा देता है (गति, छोटा ब्रेक, सामाजिक बातचीत) और क्या आपको खाली करता है (लंबी बैठकें, मल्टीटास्किंग)।</p>

<h3>ध्यान प्रबंधन</h3>
<p><strong>गहरे कार्य ब्लॉक</strong>: गहरे कार्य के लिए 90-120 मिनट के ब्लॉक ब्लॉक करें। इस समय के दौरान: कोई ईमेल नहीं, कोई फोन नहीं, कोई बैठक नहीं।</p>
<p><strong>ध्यान बहाली</strong>: हर रुकावट के बाद, अपना ध्यान बहाल करने में 15-20 मिनट लगते हैं। रुकावटों को कम करें।</p>
<p><strong>पर्यावरण डिजाइन</strong>: एक ऐसा वातावरण बनाएं जो एकाग्रता का समर्थन करे (शांत, व्यवस्थित डेस्क, अधिसूचनाएं बंद)।</p>

<h3>व्यावहारिक उदाहरण</h3>
<p><strong>गलत दृष्टिकोण</strong>: "आज मैं 8 घंटे काम करूंगा, कुछ भी करूंगा!"</p>
<p><strong>सही दृष्टिकोण</strong>:
<ul>
<li>9-11: गहरे कार्य ब्लॉक (रणनीतिक योजना) - चरम ऊर्जा</li>
<li>11-12: ईमेल, प्रशासन - मध्यम ऊर्जा</li>
<li>12-13: दोपहर का भोजन, आराम - ऊर्जा रिचार्ज</li>
<li>14-16: गहरे कार्य ब्लॉक (रचनात्मक कार्य) - चरम ऊर्जा</li>
<li>16-17: बैठकें - मध्यम ऊर्जा</li>
<li>17-18: नियमित कार्य, संग्रह - कम ऊर्जा</li>
</ul>
</p>
<hr />
<h2>व्यावहारिक अभ्यास (20-25 मिनट) — दैनिक ऊर्जा और ध्यान मानचित्र</h2>
<ol>
<li><strong>ऊर्जा लॉग (1 सप्ताह)</strong>: एक सप्ताह के लिए दिन में 3 बार (सुबह, दोपहर, शाम) अपने ऊर्जा स्तर (1-10 पैमाना) रिकॉर्ड करें।</li>
<li><strong>ध्यान लॉग</strong>: रिकॉर्ड करें कि आपका ध्यान दैनिक कितनी बार बाधित हुआ और इसका कारण क्या था (ईमेल, फोन, सहकर्मी, आदि)।</li>
<li><strong>समय विश्लेषण</strong>: पहचानें कि आप कब सबसे प्रभावी हैं (कौन से घंटे, कौन से दिन)।</li>
<li><strong>दैनिक अनुसूची डिजाइन</strong>: एक दैनिक अनुसूची बनाएं जो:
<ul>
<li>कठिन कार्यों के लिए आपकी चरम ऊर्जाओं का उपयोग करती है</li>
<li>गहरे कार्य ब्लॉक शामिल करती है (90-120 मिनट)</li>
<li>बफर समय छोड़ती है (20-30%)</li>
<li>ऊर्जा रिचार्जिंग गतिविधियों को शामिल करती है</li>
</ul>
</li>
</ol>
<hr />
<h2>स्व-जांच</h2>
<ul>
<li>✅ आप समझते हैं कि समय, ऊर्जा और ध्यान एक साथ कैसे काम करते हैं।</li>
<li>✅ आपने अपने व्यक्तिगत ऊर्जा और ध्यान पैटर्न की पहचान की है।</li>
<li>✅ आपके पास एक दैनिक अनुसूची है जो इन बाधाओं को ध्यान में रखती है।</li>
<li>✅ आप जानते हैं कि लक्ष्य तीनों संसाधनों को अनुकूलित करना है, न कि केवल समय का प्रबंधन करना।</li>
</ul>
<hr />
<h2>वैकल्पिक गहराई</h2>
<ul>
<li>Cal Newport: "Deep Work" — गहरे कार्य और ध्यान प्रबंधन के बारे में</li>
<li>Tony Schwartz: "The Energy Project" — ऊर्जा प्रबंधन के बारे में</li>
<li>Daniel Pink: "When" — जैविक लय और इष्टतम समय के बारे में</li>
</ul>`,
    emailSubject: 'उत्पादकता 2026 – दिन 2: समय, ऊर्जा, ध्यान',
    emailBody: `<h1>उत्पादकता 2026 – दिन 2</h1>
<h2>समय, ऊर्जा, ध्यान: आप व्यवहार में क्या प्रबंधित करते हैं</h2>
<p>आज आप सीखेंगे कि समय, ऊर्जा और ध्यान एक साथ कैसे काम करते हैं, और इन्हें ध्यान में रखते हुए दैनिक अनुसूची कैसे बनाई जाए।</p>
<p><a href="{{APP_URL}}/hi/courses/${COURSE_ID_BASE}_HI/day/2">पाठ खोलें →</a></p>`
  }
};

// Quiz 2 Questions
const QUIZ_2: Record<string, Array<{
  question: string;
  options: string[];
  correctIndex: number;
}>> = {
  hu: [
    {
      question: 'Melyik NEM egy termelékenységi erőforrás?',
      options: [
        'Idő',
        'Energia',
        'Figyelem',
        'Pénz'
      ],
      correctIndex: 3
    },
    {
      question: 'Mikor érdemes a legnehezebb feladatokat elvégezni?',
      options: [
        'Alacsony energia szinten',
        'Csúcs energia szinten',
        'Mindegy, mikor',
        'Este, amikor mindenki alszik'
      ],
      correctIndex: 1
    },
    {
      question: 'Mennyi idő kell a figyelem visszaállításához egy megszakítás után?',
      options: [
        '5 perc',
        '15-20 perc',
        '1 óra',
        'Nincs szükség visszaállításra'
      ],
      correctIndex: 1
    },
    {
      question: 'Mennyi buffer időt érdemes hagyni a napi ütemtervben?',
      options: [
        '0%',
        '10%',
        '20-30%',
        '50%'
      ],
      correctIndex: 2
    },
    {
      question: 'Mi a deep work blokk ideális hossza?',
      options: [
        '30 perc',
        '60 perc',
        '90-120 perc',
        '4 óra'
      ],
      correctIndex: 2
    }
  ],
  en: [
    {
      question: 'Which is NOT a productivity resource?',
      options: [
        'Time',
        'Energy',
        'Attention',
        'Money'
      ],
      correctIndex: 3
    },
    {
      question: 'When should you do the hardest tasks?',
      options: [
        'At low energy level',
        'At peak energy level',
        'Doesn\'t matter when',
        'At night when everyone sleeps'
      ],
      correctIndex: 1
    },
    {
      question: 'How long does it take to restore attention after an interruption?',
      options: [
        '5 minutes',
        '15-20 minutes',
        '1 hour',
        'No restoration needed'
      ],
      correctIndex: 1
    },
    {
      question: 'How much buffer time should you leave in your daily schedule?',
      options: [
        '0%',
        '10%',
        '20-30%',
        '50%'
      ],
      correctIndex: 2
    },
    {
      question: 'What is the ideal length of a deep work block?',
      options: [
        '30 minutes',
        '60 minutes',
        '90-120 minutes',
        '4 hours'
      ],
      correctIndex: 2
    }
  ],
  tr: [
    {
      question: 'Aşağıdakilerden hangisi bir verimlilik kaynağı DEĞİLDİR?',
      options: [
        'Zaman',
        'Enerji',
        'Dikkat',
        'Para'
      ],
      correctIndex: 3
    },
    {
      question: 'En zor görevleri ne zaman yapmalısınız?',
      options: [
        'Düşük enerji seviyesinde',
        'Zirve enerji seviyesinde',
        'Ne zaman olduğu fark etmez',
        'Gece, herkes uyurken'
      ],
      correctIndex: 1
    },
    {
      question: 'Bir kesintiden sonra dikkati geri kazanmak ne kadar sürer?',
      options: [
        '5 dakika',
        '15-20 dakika',
        '1 saat',
        'Geri kazanmaya gerek yok'
      ],
      correctIndex: 1
    },
    {
      question: 'Günlük programınızda ne kadar tampon zaman bırakmalısınız?',
      options: [
        '%0',
        '%10',
        '%20-30',
        '%50'
      ],
      correctIndex: 2
    },
    {
      question: 'Derin çalışma bloğunun ideal uzunluğu nedir?',
      options: [
        '30 dakika',
        '60 dakika',
        '90-120 dakika',
        '4 saat'
      ],
      correctIndex: 2
    }
  ],
  bg: [
    {
      question: 'Кое от следните НЕ е ресурс за продуктивност?',
      options: [
        'Време',
        'Енергия',
        'Внимание',
        'Пари'
      ],
      correctIndex: 3
    },
    {
      question: 'Кога трябва да правите най-трудните задачи?',
      options: [
        'При ниско ниво на енергия',
        'При пиково ниво на енергия',
        'Няма значение кога',
        'През нощта, когато всички спят'
      ],
      correctIndex: 1
    },
    {
      question: 'Колко време отнема възстановяването на вниманието след прекъсване?',
      options: [
        '5 минути',
        '15-20 минути',
        '1 час',
        'Не е необходимо възстановяване'
      ],
      correctIndex: 1
    },
    {
      question: 'Колко буферно време трябва да оставите в дневния си график?',
      options: [
        '0%',
        '10%',
        '20-30%',
        '50%'
      ],
      correctIndex: 2
    },
    {
      question: 'Каква е идеалната дължина на блок за дълбока работа?',
      options: [
        '30 минути',
        '60 минути',
        '90-120 минути',
        '4 часа'
      ],
      correctIndex: 2
    }
  ],
  pl: [
    {
      question: 'Które z poniższych NIE jest zasobem produktywności?',
      options: [
        'Czas',
        'Energia',
        'Uwaga',
        'Pieniądze'
      ],
      correctIndex: 3
    },
    {
      question: 'Kiedy powinieneś wykonywać najtrudniejsze zadania?',
      options: [
        'Przy niskim poziomie energii',
        'Przy szczytowym poziomie energii',
        'Nie ma znaczenia kiedy',
        'W nocy, gdy wszyscy śpią'
      ],
      correctIndex: 1
    },
    {
      question: 'Ile czasu zajmuje przywrócenie uwagi po przerwaniu?',
      options: [
        '5 minut',
        '15-20 minut',
        '1 godzina',
        'Nie jest potrzebne przywrócenie'
      ],
      correctIndex: 1
    },
    {
      question: 'Ile czasu buforowego powinieneś zostawić w codziennym harmonogramie?',
      options: [
        '0%',
        '10%',
        '20-30%',
        '50%'
      ],
      correctIndex: 2
    },
    {
      question: 'Jaka jest idealna długość bloku głębokiej pracy?',
      options: [
        '30 minut',
        '60 minut',
        '90-120 minut',
        '4 godziny'
      ],
      correctIndex: 2
    }
  ],
  vi: [
    {
      question: 'Điều nào sau đây KHÔNG phải là nguồn lực năng suất?',
      options: [
        'Thời gian',
        'Năng lượng',
        'Sự chú ý',
        'Tiền bạc'
      ],
      correctIndex: 3
    },
    {
      question: 'Khi nào bạn nên thực hiện các nhiệm vụ khó nhất?',
      options: [
        'Ở mức năng lượng thấp',
        'Ở mức năng lượng đỉnh',
        'Không quan trọng khi nào',
        'Vào ban đêm khi mọi người ngủ'
      ],
      correctIndex: 1
    },
    {
      question: 'Mất bao lâu để khôi phục sự chú ý sau khi bị gián đoạn?',
      options: [
        '5 phút',
        '15-20 phút',
        '1 giờ',
        'Không cần khôi phục'
      ],
      correctIndex: 1
    },
    {
      question: 'Bạn nên để lại bao nhiêu thời gian đệm trong lịch trình hàng ngày?',
      options: [
        '0%',
        '10%',
        '20-30%',
        '50%'
      ],
      correctIndex: 2
    },
    {
      question: 'Độ dài lý tưởng của khối công việc sâu là bao nhiêu?',
      options: [
        '30 phút',
        '60 phút',
        '90-120 phút',
        '4 giờ'
      ],
      correctIndex: 2
    }
  ],
  id: [
    {
      question: 'Manakah yang BUKAN sumber daya produktivitas?',
      options: [
        'Waktu',
        'Energi',
        'Perhatian',
        'Uang'
      ],
      correctIndex: 3
    },
    {
      question: 'Kapan Anda harus melakukan tugas tersulit?',
      options: [
        'Pada tingkat energi rendah',
        'Pada tingkat energi puncak',
        'Tidak masalah kapan',
        'Malam hari ketika semua orang tidur'
      ],
      correctIndex: 1
    },
    {
      question: 'Berapa lama waktu yang dibutuhkan untuk memulihkan perhatian setelah gangguan?',
      options: [
        '5 menit',
        '15-20 menit',
        '1 jam',
        'Tidak perlu pemulihan'
      ],
      correctIndex: 1
    },
    {
      question: 'Berapa banyak waktu penyangga yang harus Anda sisakan dalam jadwal harian?',
      options: [
        '0%',
        '10%',
        '20-30%',
        '50%'
      ],
      correctIndex: 2
    },
    {
      question: 'Berapa panjang ideal blok kerja mendalam?',
      options: [
        '30 menit',
        '60 menit',
        '90-120 menit',
        '4 jam'
      ],
      correctIndex: 2
    }
  ],
  ar: [
    {
      question: 'أي مما يلي ليس موردًا للإنتاجية؟',
      options: [
        'الوقت',
        'الطاقة',
        'الانتباه',
        'المال'
      ],
      correctIndex: 3
    },
    {
      question: 'متى يجب أن تقوم بأصعب المهام؟',
      options: [
        'عند مستوى طاقة منخفض',
        'عند مستوى طاقة الذروة',
        'لا يهم متى',
        'في الليل عندما ينام الجميع'
      ],
      correctIndex: 1
    },
    {
      question: 'كم من الوقت يستغرق استعادة الانتباه بعد الانقطاع؟',
      options: [
        '5 دقائق',
        '15-20 دقيقة',
        '1 ساعة',
        'لا حاجة للاستعادة'
      ],
      correctIndex: 1
    },
    {
      question: 'كم من وقت العازل يجب أن تترك في جدولك اليومي؟',
      options: [
        '0%',
        '10%',
        '20-30%',
        '50%'
      ],
      correctIndex: 2
    },
    {
      question: 'ما هو الطول المثالي لكتلة العمل العميق؟',
      options: [
        '30 دقيقة',
        '60 دقيقة',
        '90-120 دقيقة',
        '4 ساعات'
      ],
      correctIndex: 2
    }
  ],
  pt: [
    {
      question: 'Qual NÃO é um recurso de produtividade?',
      options: [
        'Tempo',
        'Energia',
        'Atenção',
        'Dinheiro'
      ],
      correctIndex: 3
    },
    {
      question: 'Quando você deve fazer as tarefas mais difíceis?',
      options: [
        'Em nível de energia baixo',
        'Em nível de energia de pico',
        'Não importa quando',
        'À noite quando todos dormem'
      ],
      correctIndex: 1
    },
    {
      question: 'Quanto tempo leva para restaurar a atenção após uma interrupção?',
      options: [
        '5 minutos',
        '15-20 minutos',
        '1 hora',
        'Não é necessária restauração'
      ],
      correctIndex: 1
    },
    {
      question: 'Quanto tempo de buffer você deve deixar em sua agenda diária?',
      options: [
        '0%',
        '10%',
        '20-30%',
        '50%'
      ],
      correctIndex: 2
    },
    {
      question: 'Qual é o comprimento ideal de um bloco de trabalho profundo?',
      options: [
        '30 minutos',
        '60 minutos',
        '90-120 minutos',
        '4 horas'
      ],
      correctIndex: 2
    }
  ],
  hi: [
    {
      question: 'निम्नलिखित में से कौन सा उत्पादकता संसाधन नहीं है?',
      options: [
        'समय',
        'ऊर्जा',
        'ध्यान',
        'पैसा'
      ],
      correctIndex: 3
    },
    {
      question: 'आपको सबसे कठिन कार्य कब करने चाहिए?',
      options: [
        'कम ऊर्जा स्तर पर',
        'चरम ऊर्जा स्तर पर',
        'कब कोई फर्क नहीं पड़ता',
        'रात में जब सभी सो रहे हों'
      ],
      correctIndex: 1
    },
    {
      question: 'रुकावट के बाद ध्यान बहाल करने में कितना समय लगता है?',
      options: [
        '5 मिनट',
        '15-20 मिनट',
        '1 घंटा',
        'बहाली की आवश्यकता नहीं'
      ],
      correctIndex: 1
    },
    {
      question: 'आपको अपने दैनिक अनुसूची में कितना बफर समय छोड़ना चाहिए?',
      options: [
        '0%',
        '10%',
        '20-30%',
        '50%'
      ],
      correctIndex: 2
    },
    {
      question: 'गहरे कार्य ब्लॉक की आदर्श लंबाई क्या है?',
      options: [
        '30 मिनट',
        '60 मिनट',
        '90-120 मिनट',
        '4 घंटे'
      ],
      correctIndex: 2
    }
  ]
};

// Seed lesson 2 for specific languages
async function seedLesson2ForLanguages(
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

    const lessonContent = LESSON_2[lang];
    const quizQuestions = QUIZ_2[lang];

    if (!lessonContent || !quizQuestions) {
      console.log(`⚠️  Content not ready for ${lang}, skipping...`);
      continue;
    }

    const lessonId = `${courseId}_DAY_02`;

    // Create/update lesson
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId,
          courseId: course._id,
          dayNumber: 2,
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

    console.log(`  ✅ Lesson 2 for ${lang} created/updated`);

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
            category: 'Time, Energy, Attention',
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
    console.log(`  ✅ Quiz 2 (${quizQuestions.length} questions) for ${lang} created/updated`);
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

  console.log('📚 Processing Lesson 2 (Day 2: Time, energy, attention)...\n');
  
  // Process in batches of 2 languages
  for (const [pairIndex, pair] of LANGUAGE_PAIRS.entries()) {
    console.log(`  Batch ${pairIndex + 1}/5: ${pair.join(', ')}`);
    await seedLesson2ForLanguages(pair, brand, appUrl);
    console.log(`  ✅ Batch ${pairIndex + 1} completed\n`);
  }
  
  console.log('✅ Lesson 2 completed for all languages!');
  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
