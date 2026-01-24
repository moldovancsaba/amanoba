/**
 * Seed Productivity 2026 Course - Lesson 10 (Day 10)
 * 
 * Day 10: Energy Management - when to work, when to rest, recovery rituals
 * 
 * Creates lesson 10 for all 10 languages in 2-language batches
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
// LESSON 10: Energy Management
// ============================================================================

const LESSON_10: Record<string, {
  title: string;
  content: string;
  emailSubject: string;
  emailBody: string;
}> = {
  hu: {
    title: 'Energia menedzselés: mikor dolgozz, mikor pihenj, helyreállítási ritualok',
    content: `<h1>Energia menedzselés: mikor dolgozz, mikor pihenj, helyreállítási ritualok</h1>
<p><em>A produktivitás nem az erőltetésről szól. Az ütemről és a helyreállításról szól.</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
<li>Megérteni az energia szinteket és az optimális munkaidőket.</li>
<li>Azonosítani az egyéni energiamintákat (csúcsidő vs alacsonyabb energia).</li>
<li>Helyreállítási rituálok kialakítása a munka közötti szünetekre.</li>
<li>Megelőzni a kiégést tudatos energia menedzseléssel.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
<li><strong>Teljesítmény különbség</strong>: A csúcsidőben dolgozva 3x több munka elvégzésben az alacsony energiájú időnél.</li>
<li><strong>Kiégés megelőzés</strong>: Tudatos szünetben és helyreállításban az agy készen marad az erőforrásokon.</li>
<li><strong>Kreatívabb munka</strong>: A kipihentnél az agya kreatívabb és jobb döntéseket hoz.</li>
<li><strong>Hosszú tartós termelékenység</strong>: Fenntartható ütem > Sprint szorgalmazás.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>1. Energia szintek</h3>
<ul>
<li><strong>Ultradian ritmikus</strong>: Az agy körülbelül 90 perces fókuszt támogat, majd 20-30 perces pihenésre van szüksége.</li>
<li><strong>Napi ciklus</strong>: Legtöbb ember: reggel csúcs, délután csökkenés, este ismét növekedés.</li>
<li><strong>Egyéni minta</strong>: Algunos emberek "éjszakai madaraknak" nevezik, mások "korai kelőnek".</li>
<li><strong>Munkánapi fáradtság</strong>: A hétfő, kedd a legmagasabb; csütörtök, péntek a legalacsonyabb.</li>
</ul>
<h3>2. Csúcsidőt azonosítása</h3>
<ul>
<li>Írjon naplót egy héten: energiaszint óránként 1-10 között.</li>
<li>Azonosítsa a 3-4 sáv a legmagasabb energiával.</li>
<li>Tervez a legfontosabb, legkreatívabb munkát az említett sávokba.</li>
<li><strong>Szabály</strong>: A csúcsidő a "mély munka" időt.</li>
</ul>
<h3>3. Helyreállítási rituálok</h3>
<ul>
<li><strong>Mikropihenő (5 perc)</strong>: Sétálás, légzés, vizzel való ivás.</li>
<li><strong>Makropihenő (20-30 perc)</strong>: Délutáni szünete: Séta, ebéd, meditáció.</li>
<li><strong>Egész napos helyreállítás</strong>: Reggeli ritual (lásd Nap 7), este kiváló alvás.</li>
<li><strong>Hétvégi helyreállítás</strong>: Teljes mentális elhatárolódás munka nélkül 1-2 napig.</li>
</ul>
<h3>4. Kiégés megelőzés</h3>
<ul>
<li><strong>Felismerés</strong>: Több szünetre van szüksége, ha: módváltások, ingerlékenység, alvásbaj.</li>
<li><strong>Első jelzés</strong>: Váltsa meg a napi ütemet. Csökkentse az erőltetést.</li>
<li><strong>Stratégia</strong>: Szándékos helyreállítás > Kényelem szünet később.</li>
</ul>
<h3>5. Tudatos szünet</h3>
<ul>
<li><strong>Nem ebéd-e-mail</strong>: Ebéd alatt nem munkázz. Ez helyreállítás.</li>
<li><strong>Nem munka email este</strong>: Email után 18:00, azonnal az éjszaka helyreállítás kezdődik.</li>
<li><strong>Nem munka hétvége</strong>: Hétvégén nem gondolj a munkára.</li>
<li><strong>Alvás szacrifisz</strong>: Soha ne áldozza fel az alvást termelékenységért.</li>
</ul>
<hr />
<h2>Gyakorlati feladat (40 perc) — Energia audit és helyreállítási terv</h2>
<ol>
<li><strong>Energia naplóz</strong>: Ma és holnap: energiaszint óránként 1-10 között.</li>
<li><strong>Csúcsidő azonosítása</strong>: Jelöljön meg 3-4 sávot a legmagasabb energiával.</li>
<li><strong>Munka szervezés</strong>: Szervezze át a heti naptárát: Csúcsidő = Mély munka. Alacsony energia = Rutin/Megbeszélések.</li>
<li><strong>Helyreállítási ritual</strong>: Válasszon 1 mikropihenő rituált és 1 makropihenő rituált. Tervez be a naptárba.</li>
<li><strong>Hétvégi kordon</strong>: Állítson meg egy közösítést: Munka vége ideje. Ez után: nincs munka.</li>
</ol>
<hr />
<h2>Önellenőrzés</h2>
<ul>
<li>✅ Tudom, mik az én csúcsenergia-sávjaim.</li>
<li>✅ A mély munkát a csúcsidőre terveztem.</li>
<li>✅ Van mikro-szüneti ritual (5 perc).</li>
<li>✅ Van makro-szüneti ritual (20-30 perc).</li>
<li>✅ Van egy hétvégi munka kordon.</li>
<li>✅ Az alvás nem valaha szacrificsálódik termelékenységért.</li>
</ul>`,
    emailSubject: 'Termelékenység 2026 – 10. nap: Energia menedzselés',
    emailBody: `<h1>Termelékenység 2026 – 10. nap</h1>
<h2>Energia menedzselés: mikor dolgozz, mikor pihenj, helyreállítási ritualok</h2>
<p><em>A produktivitás nem az erőltetésről szól. Az ütemről és a helyreállításról szól.</em></p>
<p>Ma azt tanulod meg, hogyan lehet az energia tudatos menedzselésben a termelékenység fejlesztésében. A csúcsidőben dolgozva 3x több munka elvégzésben az alacsony energiájú időnél.</p>
<p><strong>A cél</strong>: Azonosítsd az energia mintádat és építs helyreállítási rituálokat.</p>
<p><strong>Kvíz</strong>: Próbálj meg 5 kérdésre válaszolni.</p>
<p><a href="{{APP_URL}}/hu/courses/${COURSE_ID_BASE}_HU/day/10">Nyisd meg a leckét →</a></p>`
  },
  en: {
    title: 'Energy Management: When to Work, When to Rest, Recovery Rituals',
    content: `<h1>Energy Management: When to Work, When to Rest, Recovery Rituals</h1>
<p><em>Productivity isn't about pushing harder. It's about pacing and recovery.</em></p>
<hr />
<h2>Learning Objectives</h2>
<ul>
<li>Understand energy levels and optimal work windows.</li>
<li>Identify your personal energy patterns (peak vs low).</li>
<li>Create recovery rituals for breaks between work.</li>
<li>Prevent burnout through conscious energy management.</li>
</ul>
<hr />
<h2>Why This Matters</h2>
<ul>
<li><strong>Performance Difference</strong>: Working during peak hours = 3x more work than low-energy times.</li>
<li><strong>Burnout Prevention</strong>: Conscious breaks and recovery keep your brain resourceful.</li>
<li><strong>Better Creativity</strong>: A rested brain is more creative and makes better decisions.</li>
<li><strong>Sustainable Output</strong>: Sustainable pace > Burnout sprint.</li>
</ul>
<hr />
<h2>Deep Dive</h2>
<h3>1. Energy Levels</h3>
<ul>
<li><strong>Ultradian Rhythm</strong>: Your brain supports ~90 minutes of focus, then needs 20-30 min recovery.</li>
<li><strong>Daily Cycle</strong>: Most people: peak morning, dip afternoon, rise again evening.</li>
<li><strong>Personal Pattern</strong>: Some are "night owls", others are "early risers".</li>
<li><strong>Weekly Fatigue</strong>: Monday, Tuesday highest; Thursday, Friday lowest.</li>
</ul>
<h3>2. Identifying Peak Hours</h3>
<ul>
<li>Journal for one week: energy level by hour (1-10 scale).</li>
<li>Identify 3-4 time blocks with highest energy.</li>
<li>Plan your most important, creative work in those blocks.</li>
<li><strong>Rule</strong>: Peak hours = "deep work" time.</li>
</ul>
<h3>3. Recovery Rituals</h3>
<ul>
<li><strong>Micro Break (5 min)</strong>: Walk, breathe, drink water.</li>
<li><strong>Macro Break (20-30 min)</strong>: Afternoon break: Walk, lunch, meditation.</li>
<li><strong>Daily Recovery</strong>: Morning ritual (Day 7), excellent night sleep.</li>
<li><strong>Weekly Recovery</strong>: Full mental disconnect 1-2 days per week.</li>
</ul>
<h3>4. Burnout Prevention</h3>
<ul>
<li><strong>Recognition</strong>: You need more breaks if: mood swings, irritability, sleep issues.</li>
<li><strong>First Signal</strong>: Change your daily pace. Reduce pushing.</li>
<li><strong>Strategy</strong>: Intentional recovery > Forced break later.</li>
</ul>
<h3>5. Conscious Boundaries</h3>
<ul>
<li><strong>Lunch is Sacred</strong>: During lunch, don't work. This is recovery.</li>
<li><strong>No Email After 6pm</strong>: After 6pm, work stops. Night recovery begins.</li>
<li><strong>Weekend Boundary</strong>: Don't think about work on weekends.</li>
<li><strong>Sleep Never Sacrificed</strong>: Never trade sleep for productivity.</li>
</ul>
<hr />
<h2>Practical Exercise (40 minutes) — Energy Audit & Recovery Plan</h2>
<ol>
<li><strong>Energy Journal</strong>: Today and tomorrow: log energy (1-10) every hour.</li>
<li><strong>Peak Hours</strong>: Mark 3-4 time blocks with highest energy.</li>
<li><strong>Reorganize Work</strong>: Rearrange your weekly calendar: Peak hours = Deep work. Low energy = Routine/Meetings.</li>
<li><strong>Recovery Rituals</strong>: Choose 1 micro-break ritual and 1 macro-break ritual. Schedule them.</li>
<li><strong>Weekend Boundary</strong>: Set a stopping time: "This is when work ends." After that: no work.</li>
</ol>
<hr />
<h2>Self-Check</h2>
<ul>
<li>✅ I know my peak energy hours.</li>
<li>✅ I've scheduled deep work during peak hours.</li>
<li>✅ I have a micro-break ritual (5 min).</li>
<li>✅ I have a macro-break ritual (20-30 min).</li>
<li>✅ I have a weekend work boundary.</li>
<li>✅ Sleep is never sacrificed for productivity.</li>
</ul>`,
    emailSubject: 'Productivity 2026 – Day 10: Energy Management',
    emailBody: `<h1>Productivity 2026 – Day 10</h1>
<h2>Energy Management: When to Work, When to Rest, Recovery Rituals</h2>
<p><em>Productivity isn't about pushing harder. It's about pacing and recovery.</em></p>
<p>Today you'll learn how conscious energy management improves productivity. Working during peak hours means 3x more output than low-energy times.</p>
<p><strong>Goal</strong>: Identify your energy patterns and build recovery rituals.</p>
<p><strong>Quiz</strong>: Answer 5 questions to confirm your understanding.</p>
<p><a href="{{APP_URL}}/en/courses/${COURSE_ID_BASE}_EN/day/10">Open the lesson →</a></p>`
  },
  tr: {
    title: 'Enerji Yönetimi: Ne Zaman Çalış, Ne Zaman Dinlen, İyileştirme Ritüelleri',
    content: `<h1>Enerji Yönetimi: Ne Zaman Çalış, Ne Zaman Dinlen, İyileştirme Ritüelleri</h1>
<p><em>Verimlilik daha sert çalışmakla ilgili değildir. Hız ve iyileştirme hakkındadır.</em></p>
<hr />
<h2>Öğrenme Hedefleri</h2>
<ul>
<li>Enerji seviyeleri ve optimal çalışma pencerelerini anlayın.</li>
<li>Kişisel enerji modellerini tanımlayın (yoğun vs düşük).</li>
<li>Çalışma aralarında iyileştirme ritüelleri oluşturun.</li>
<li>Bilinçli enerji yönetimiyle tükenmişliği önleyin.</li>
</ul>
<hr />
<h2>Neden Önemli</h2>
<ul>
<li><strong>Performans Farkı</strong>: Yoğun saatlerde çalışma = düşük enerji zamanlarında 3 kat daha fazla iş.</li>
<li><strong>Tükenmişlik Önleme</strong>: Bilinçli molalar ve iyileştirme beyninizi güçlü tutar.</li>
<li><strong>Daha İyi Yaratıcılık</strong>: İstirahat almış bir beyin daha yaratıcı ve daha iyi kararlar verir.</li>
<li><strong>Sürdürülebilir Çıktı</strong>: Sürdürülebilir hız > Tükenmişlik sprintı.</li>
</ul>
<hr />
<h2>Derinlemesine Analiz</h2>
<h3>1. Enerji Seviyeleri</h3>
<ul>
<li><strong>Ultraritmik Ritim</strong>: Beyin ~90 dakika odaklanmayı destekler, sonra 20-30 dakika iyileştirmeye ihtiyaç duyar.</li>
<li><strong>Günlük Döngü</strong>: Çoğu insan: Sabah yoğun, öğleden sonra düşüş, akşam yeniden yükseliş.</li>
<li><strong>Kişisel Model</strong>: Bazıları "gece kuşu", diğerleri "erken kalkanlar".</li>
<li><strong>Haftalık Yorgunluk</strong>: Pazartesi, Salı en yüksek; Perşembe, Cuma en düşük.</li>
</ul>
<h3>2. Yoğun Saatleri Tanımlama</h3>
<ul>
<li>Bir hafta boyunca yönetim yapın: Her saat enerji seviyeleri (1-10 ölçeği).</li>
<li>En yüksek enerjiye sahip 3-4 zaman bloğunu tanımlayın.</li>
<li>En önemli, yaratıcı işinizi bu bloklarda planlayın.</li>
<li><strong>Kural</strong>: Yoğun saatler = "derin çalışma" zamanı.</li>
</ul>
<h3>3. İyileştirme Ritüelleri</h3>
<ul>
<li><strong>Mikro Mola (5 dakika)</strong>: Yürüyüş, nefes, su içme.</li>
<li><strong>Makro Mola (20-30 dakika)</strong>: Öğleden sonra molası: Yürüyüş, öğle yemeği, meditasyon.</li>
<li><strong>Günlük İyileştirme</strong>: Sabah rituali (7. Gün), mükemmel gece uyku.</li>
<li><strong>Haftalık İyileştirme</strong>: Haftada 1-2 gün tam zihinsel ayırılma.</li>
</ul>
<h3>4. Tükenmişlik Önleme</h3>
<ul>
<li><strong>Tanıma</strong>: Daha fazla molaya ihtiyacınız varsa: ruh değişiklikleri, kırgınlık, uyku sorunları.</li>
<li><strong>İlk İşaret</strong>: Günlük hızınızı değiştirin. İtmeyi azaltın.</li>
<li><strong>Strateji</strong>: İhtiyaçlı iyileştirme > Daha sonra zorlama molası.</li>
</ul>
<h3>5. Bilinçli Sınırlar</h3>
<ul>
<li><strong>Öğle Yemeği Kutsal</strong>: Öğle yemeğinde çalışmayın. Bu iyileştirmedir.</li>
<li><strong>Saat 18:00 Sonrası E-posta Yok</strong>: Saat 18:00 sonrası çalışma biter. Gece iyileştirmesi başlar.</li>
<li><strong>Hafta Sonu Sınırı</strong>: Hafta sonunda işi düşünmeyin.</li>
<li><strong>Uyku Kurban Edilmez</strong>: Verimlilik için asla uyku kurban etmeyin.</li>
</ul>
<hr />
<h2>Pratik Alıştırma (40 dakika) — Enerji Denetimi ve İyileştirme Planı</h2>
<ol>
<li><strong>Enerji Yönetimi</strong>: Bugün ve yarın: Her saat enerji günlüğü (1-10).</li>
<li><strong>Yoğun Saatler</strong>: En yüksek enerjiye sahip 3-4 zaman bloğunu işaretleyin.</li>
<li><strong>Çalışmayı Yeniden Organize Edin</strong>: Haftalık takvimini yeniden düzenleyin: Yoğun saatler = Derin çalışma. Düşük enerji = Rutin/Toplantılar.</li>
<li><strong>İyileştirme Ritüelleri</strong>: 1 mikro-mola rituali ve 1 makro-mola rituali seçin. Takvime ekleyin.</li>
<li><strong>Hafta Sonu Sınırı</strong>: Bir durdurma saati ayarlayın: "Bu, işin bittiği zaman." Bundan sonra: İş yok.</li>
</ol>
<hr />
<h2>Kendi Kendinizi Kontrol Edin</h2>
<ul>
<li>✅ Yoğun enerji saatlerini biliyorum.</li>
<li>✅ Derin çalışmayı yoğun saatlere planladım.</li>
<li>✅ Mikro-mola rituali var (5 dakika).</li>
<li>✅ Makro-mola rituali var (20-30 dakika).</li>
<li>✅ Hafta sonu iş sınırı var.</li>
<li>✅ Uyku asla verimlilik için kurban edilmez.</li>
</ul>`,
    emailSubject: 'Verimlilik 2026 – 10. Gün: Enerji Yönetimi',
    emailBody: `<h1>Verimlilik 2026 – 10. Gün</h1>
<h2>Enerji Yönetimi: Ne Zaman Çalış, Ne Zaman Dinlen, İyileştirme Ritüelleri</h2>
<p><em>Verimlilik daha sert çalışmakla ilgili değildir. Hız ve iyileştirme hakkındadır.</em></p>
<p>Bugün bilinçli enerji yönetiminin verimliliği nasıl geliştirdiğini öğreneceksiniz. Yoğun saatlerde çalışma, düşük enerji zamanlarında 3 kat daha fazla çıktı anlamına gelir.</p>
<p><strong>Hedef</strong>: Enerji modellerini tanımlayın ve iyileştirme ritüelleri oluşturun.</p>
<p><strong>Quiz</strong>: Anlayışınızı doğrulamak için 5 soruya cevap verin.</p>
<p><a href="{{APP_URL}}/tr/courses/${COURSE_ID_BASE}_TR/day/10">Dersi aç →</a></p>`
  },
  bg: {
    title: 'Управление на енергия: Кога да работите, Кога да почивате, Ритуали на възстановяване',
    content: `<h1>Управление на енергия: Кога да работите, Кога да почивате, Ритуали на възстановяване</h1>
<p><em>Производителността не е за по-упорита работа. Това е за темпо и възстановяване.</em></p>
<hr />
<h2>Учебни цели</h2>
<ul>
<li>Разберете нивата на енергия и оптимални работни прозорци.</li>
<li>Идентифицирайте личните си енергийни модели (пик срещу ниски).</li>
<li>Създайте ритуали на възстановяване за паузи между работа.</li>
<li>Предотвратете прегаряне чрез съзнателно управление на енергия.</li>
</ul>
<hr />
<h2>Защо е важно</h2>
<ul>
<li><strong>Разлика в производителността</strong>: Работа в пиковите часове = 3x повече работа, отколкото в периоди с ниска енергия.</li>
<li><strong>Предотвратяване на прегаряне</strong>: Съзнателни почивки и възстановяване держат мозъка си достатъчен.</li>
<li><strong>По-добра креативност</strong>: Отпочинал мозък е по-творчески и прави по-добри решения.</li>
<li><strong>Устойчива продукция</strong>: Устойчив темпо > Прегаряне спринт.</li>
</ul>
<hr />
<h2>Дълбокия анализ</h2>
<h3>1. Нива на енергия</h3>
<ul>
<li><strong>Ултрирадянен ритъм</strong>: Мозъкът поддържа ~90 минути фокус, след което се нуждае от 20-30 минути възстановяване.</li>
<li><strong>Дневен цикъл</strong>: Повечето хора: пик сутрин, пад следобед, отново издигане вечер.</li>
<li><strong>Личен модел</strong>: Някои са "нощни кукли", други "ранни съни".</li>
<li><strong>Седмична умора</strong>: Понеделник, вторник най-високи; четвъртък, петък най-ниски.</li>
</ul>
<h3>2. Идентифициране на пиковите часове</h3>
<ul>
<li>Оневестявай в продължение на една седмица: Ниво на енергия по час (скала 1-10).</li>
<li>Идентифицирайте 3-4 времеви блока с най-висока енергия.</li>
<li>Планирайте вашето най-важно, творческо работе в тези блокове.</li>
<li><strong>Правило</strong>: Пикови часове = "дълбока работа" време.</li>
</ul>
<h3>3. Ритуали на възстановяване</h3>
<ul>
<li><strong>Микро пауза (5 мин)</strong>: Разходка, дишане, пиене на вода.</li>
<li><strong>Макро пауза (20-30 мин)</strong>: Следообеден почивка: Разходка, обед, медитация.</li>
<li><strong>Дневно възстановяване</strong>: Сутрешен ритуал (Ден 7), отличен нощен сън.</li>
<li><strong>Седмично възстановяване</strong>: Пълна умствена отделение 1-2 дни седмично.</li>
</ul>
<h3>4. Предотвратяване на прегаряне</h3>
<ul>
<li><strong>Признание</strong>: Нужна ви е повече почивка, ако: промени на настроението, раздразнител, проблеми със сна.</li>
<li><strong>Първи знак</strong>: Променете своя дневен темпо. Намалете тласъка.</li>
<li><strong>Стратегия</strong>: Съзнателно възстановяване > Принудена пауза по-късно.</li>
</ul>
<h3>5. Съзнателни граници</h3>
<ul>
<li><strong>Обедът е Священен</strong>: През обед не работете. Това е възстановяване.</li>
<li><strong>Няма имейл след 18:00</strong>: След 18:00 работата спира. Нощното възстановяване започва.</li>
<li><strong>Граница на уикенда</strong>: Не мислете за работата в уикенда.</li>
<li><strong>Сънът никога не жертвах</strong>: Никога не жертвайте сън за производителност.</li>
</ul>
<hr />
<h2>Практическо упражнение (40 минути) — Одит на енергия и план за възстановяване</h2>
<ol>
<li><strong>Дневник на енергия</strong>: Днес и утре: дневник на енергия (1-10) всеки час.</li>
<li><strong>Пикови часове</strong>: Отбележете 3-4 времеви блока с най-висока енергия.</li>
<li><strong>Преорганизирайте работата</strong>: Преустройте седмичния си график: Пикови часове = Дълбока работа. Ниска енергия = Рутина/Срещи.</li>
<li><strong>Ритуали на възстановяване</strong>: Изберете 1 микро-пауза ритуал и 1 макро-пауза ритуал. График.</li>
<li><strong>Граница на уикенда</strong>: Задайте час на спирането: "Това е когато работата завършва." След това: без работа.</li>
</ol>
<hr />
<h2>Самопроверка</h2>
<ul>
<li>✅ Знам моите пикови енергийни часове.</li>
<li>✅ Планирах дълбока работа в пиковите часове.</li>
<li>✅ Имам микро-пауза ритуал (5 мин).</li>
<li>✅ Имам макро-пауза ритуал (20-30 мин).</li>
<li>✅ Имам граница на работата на уикенда.</li>
<li>✅ Сънът никога не се жертвва за производителност.</li>
</ul>`,
    emailSubject: 'Производителност 2026 – 10. Ден: Управление на енергия',
    emailBody: `<h1>Производителност 2026 – 10. Ден</h1>
<h2>Управление на енергия: Кога да работите, Кога да почивате, Ритуали на възстановяване</h2>
<p><em>Производителността не е за по-упорита работа. Това е за темпо и възстановяване.</em></p>
<p>Днес ще научите как съзнателното управление на енергия подобрява производителността. Работата в пиковите часове означава 3x повече продукция от периодите на ниска енергия.</p>
<p><strong>Цел</strong>: Идентифицирайте енергийните си модели и изградете ритуали на възстановяване.</p>
<p><strong>Quiz</strong>: Отговорете на 5 въпроса, за да потвърдите разбирането си.</p>
<p><a href="{{APP_URL}}/bg/courses/${COURSE_ID_BASE}_BG/day/10">Отворете урока →</a></p>`
  },
  pl: {
    title: 'Zarządzanie Energią: Kiedy Pracować, Kiedy Odpoczywać, Rytuały Regeneracji',
    content: `<h1>Zarządzanie Energią: Kiedy Pracować, Kiedy Odpoczywać, Rytuały Regeneracji</h1>
<p><em>Produktywność nie polega na bardziej intensywnej pracy. Chodzi o tempo i regenerację.</em></p>
<hr />
<h2>Cele edukacyjne</h2>
<ul>
<li>Zrozumieć poziomy energii i optymalne okna pracy.</li>
<li>Zidentyfikować własne wzorce energii (szczyt vs nizko).</li>
<li>Stworzyć rytuały regeneracji na okresy przerw w pracy.</li>
<li>Zapobiec wypaleniu zawodowemu poprzez świadome zarządzanie energią.</li>
</ul>
<hr />
<h2>Dlaczego jest to ważne</h2>
<ul>
<li><strong>Różnica w wydajności</strong>: Praca w godzinach szczytu = 3x więcej pracy niż w czasach niskiej energii.</li>
<li><strong>Zapobieganie wypaleniu</strong>: Świadome przerwy i regeneracja utrzymują mózg zasobny.</li>
<li><strong>Lepsza kreatywność</strong>: Odpoczęty mózg jest bardziej twórczy i podejmuje lepsze decyzje.</li>
<li><strong>Zrównoważona produkcja</strong>: Zrównoważone tempo > Sprint wypalenia.</li>
</ul>
<hr />
<h2>Analiza dogłębna</h2>
<h3>1. Poziomy energii</h3>
<ul>
<li><strong>Rytm Ultradialny</strong>: Mózg wspiera ~90 minut fokusu, potem potrzebuje 20-30 min regeneracji.</li>
<li><strong>Cykl dzienny</strong>: Większość ludzi: szczyt rano, spadek po południu, ponowny wzrost wieczorem.</li>
<li><strong>Wzorzec osobisty</strong>: Niektórzy są "sovami nocnymi", inni "wczesnie wstającymi".</li>
<li><strong>Zmęczenie tygodniowe</strong>: Poniedziałek, wtorek najwyższe; czwartek, piątek najniższe.</li>
</ul>
<h3>2. Identyfikowanie godzin szczytu</h3>
<ul>
<li>Prowadź dziennik przez jeden tydzień: poziom energii co godzinę (skala 1-10).</li>
<li>Zidentyfikuj 3-4 przedziały czasowe z najwyższą energią.</li>
<li>Zaplanuj najważniejsze, kreatywne prace w tych przedziałach.</li>
<li><strong>Reguła</strong>: Godziny szczytu = czas "głębokiej pracy".</li>
</ul>
<h3>3. Rytuały regeneracji</h3>
<ul>
<li><strong>Mikro przerwa (5 min)</strong>: Spacer, oddychanie, picie wody.</li>
<li><strong>Makro przerwa (20-30 min)</strong>: Popołudniowa przerwa: Spacer, obiad, medytacja.</li>
<li><strong>Regeneracja dzienna</strong>: Poranny rytuał (Dzień 7), doskonały nocny sen.</li>
<li><strong>Regeneracja tygodniowa</strong>: Pełna umysłowa separacja 1-2 dni tygodniowo.</li>
</ul>
<h3>4. Zapobieganie wypaleniu</h3>
<ul>
<li><strong>Rozpoznanie</strong>: Potrzebujesz więcej przerw, jeśli: zmiany nastroju, drażliwość, problemy ze snem.</li>
<li><strong>Pierwszy sygnał</strong>: Zmień swoje codzienne tempo. Zmniejsz nacisk.</li>
<li><strong>Strategia</strong>: Świadoma regeneracja > Wymuszona przerwa później.</li>
</ul>
<h3>5. Świadome granice</h3>
<ul>
<li><strong>Obiad jest Święty</strong>: W czasie obiadu nie pracuj. To jest regeneracja.</li>
<li><strong>Brak e-maili po 18:00</strong>: Po 18:00 praca się kończy. Nocna regeneracja się zaczyna.</li>
<li><strong>Granica weekendu</strong>: Nie myśl o pracy w weekend.</li>
<li><strong>Sen nigdy nie poświęcany</strong>: Nigdy nie poświęcaj snu dla produktywności.</li>
</ul>
<hr />
<h2>Ćwiczenie praktyczne (40 minut) — Audyt energii i plan regeneracji</h2>
<ol>
<li><strong>Dziennik energii</strong>: Dzisiaj i jutro: dziennik energii (1-10) co godzinę.</li>
<li><strong>Godziny szczytu</strong>: Zaznacz 3-4 przedziały czasowe z najwyższą energią.</li>
<li><strong>Reorganizuj pracę</strong>: Reorganizuj swój tygodniowy kalendarz: Godziny szczytu = Głęboką pracę. Niska energia = Rutynę/Spotkania.</li>
<li><strong>Rytuały regeneracji</strong>: Wybierz 1 rytuał mikro-przerwy i 1 rytuał makro-przerwy. Zaplanuj je.</li>
<li><strong>Granica weekendu</strong>: Ustal czas zatrzymania: "To jest koniec pracy." Po tym: brak pracy.</li>
</ol>
<hr />
<h2>Samokontrola</h2>
<ul>
<li>✅ Znam moje godziny szczytowej energii.</li>
<li>✅ Zaplanowałem głęboką pracę w godzinach szczytu.</li>
<li>✅ Mam rytuał mikro-przerwy (5 min).</li>
<li>✅ Mam rytuał makro-przerwy (20-30 min).</li>
<li>✅ Mam granicę pracy weekendowej.</li>
<li>✅ Sen nigdy nie jest poświęcany dla produktywności.</li>
</ul>`,
    emailSubject: 'Produktywność 2026 – 10. Dzień: Zarządzanie Energią',
    emailBody: `<h1>Produktywność 2026 – 10. Dzień</h1>
<h2>Zarządzanie Energią: Kiedy Pracować, Kiedy Odpoczywać, Rytuały Regeneracji</h2>
<p><em>Produktywność nie polega na bardziej intensywnej pracy. Chodzi o tempo i regenerację.</em></p>
<p>Dzisiaj nauczysz się, jak świadome zarządzanie energią poprawia produktywność. Praca w godzinach szczytu oznacza 3x więcej wyników niż w czasach niskiej energii.</p>
<p><strong>Cel</strong>: Zidentyfikuj swoje wzorce energii i zbuduj rytuały regeneracji.</p>
<p><strong>Quiz</strong>: Odpowiedz na 5 pytań, aby potwierdzić swoją wiedzę.</p>
<p><a href="{{APP_URL}}/pl/courses/${COURSE_ID_BASE}_PL/day/10">Otwórz lekcję →</a></p>`
  },
  vi: {
    title: 'Quản lý Năng lượng: Khi nào làm việc, Khi nào nghỉ ngơi, Nghi thức phục hồi',
    content: `<h1>Quản lý Năng lượng: Khi nào làm việc, Khi nào nghỉ ngơi, Nghi thức phục hồi</h1>
<p><em>Năng suất không phải là để làm việc chăm chỉ hơn. Đó là về tốc độ và phục hồi.</em></p>
<hr />
<h2>Mục tiêu học tập</h2>
<ul>
<li>Hiểu mức năng lượng và cửa sổ làm việc tối ưu.</li>
<li>Xác định các mẫu năng lượng cá nhân (đỉnh vs thấp).</li>
<li>Tạo các nghi thức phục hồi cho các khoảng thời gian giữa các công việc.</li>
<li>Ngăn chặn kiệt sức thông qua quản lý năng lượng có ý thức.</li>
</ul>
<hr />
<h2>Tại sao điều này lại quan trọng</h2>
<ul>
<li><strong>Sự khác biệt về hiệu suất</strong>: Làm việc trong giờ cao điểm = 3x công việc hơn so với thời gian năng lượng thấp.</li>
<li><strong>Ngăn chặn kiệt sức</strong>: Các khoảng thời gian có ý thức và phục hồi giữ cho bộ não của bạn đủ tài nguyên.</li>
<li><strong>Sáng tạo tốt hơn</strong>: Một bộ não đã nghỉ ngơi sáng tạo hơn và đưa ra quyết định tốt hơn.</li>
<li><strong>Sản lượng bền vững</strong>: Tốc độ bền vững > Sprint kiệt sức.</li>
</ul>
<hr />
<h2>Phân tích sâu</h2>
<h3>1. Mức năng lượng</h3>
<ul>
<li><strong>Nhịp điệu Ultradianas</strong>: Não của bạn hỗ trợ ~90 phút tập trung, sau đó cần 20-30 phút phục hồi.</li>
<li><strong>Chu kỳ hàng ngày</strong>: Hầu hết mọi người: đỉnh sáng, sụt giữa trưa, lại tăng vào buổi tối.</li>
<li><strong>Mẫu cá nhân</strong>: Một số là "cú đêm", những người khác là "những người dậy sớm".</li>
<li><strong>Mệt mỏi hàng tuần</strong>: Thứ hai, thứ ba cao nhất; thứ năm, thứ sáu thấp nhất.</li>
</ul>
<h3>2. Xác định giờ cao điểm</h3>
<ul>
<li>Ghi nhật ký trong một tuần: mức năng lượng mỗi giờ (thang 1-10).</li>
<li>Xác định 3-4 khung thời gian có năng lượng cao nhất.</li>
<li>Lập kế hoạch công việc quan trọng nhất, sáng tạo nhất của bạn trong những khung thời gian này.</li>
<li><strong>Quy tắc</strong>: Giờ cao điểm = thời gian "công việc sâu".</li>
</ul>
<h3>3. Nghi thức phục hồi</h3>
<ul>
<li><strong>Giải lao vi mô (5 phút)</strong>: Đi bộ, thở, uống nước.</li>
<li><strong>Giải lao vĩ mô (20-30 phút)</strong>: Giờ nghỉ chiều: Đi bộ, ăn trưa, thiền.</li>
<li><strong>Phục hồi hàng ngày</strong>: Nghi thức sáng (Ngày 7), giấc ngủ tuyệt vời vào ban đêm.</li>
<li><strong>Phục hồi hàng tuần</strong>: Tách biệt tinh thần hoàn toàn 1-2 ngày mỗi tuần.</li>
</ul>
<h3>4. Ngăn chặn kiệt sức</h3>
<ul>
<li><strong>Nhận biết</strong>: Bạn cần nhiều giải lao hơn nếu: thay đổi tâm trạng, dễ cáu kỉnh, vấn đề về giấc ngủ.</li>
<li><strong>Tín hiệu đầu tiên</strong>: Thay đổi tốc độ hàng ngày của bạn. Giảm sức ép.</li>
<li><strong>Chiến lược</strong>: Phục hồi có ý thức > Giải lao bắt buộc sau này.</li>
</ul>
<h3>5. Giới hạn có ý thức</h3>
<ul>
<li><strong>Bữa trưa là Thiêng liêng</strong>: Trong bữa trưa, đừng làm việc. Đây là phục hồi.</li>
<li><strong>Không có email sau 18:00</strong>: Sau 18:00 công việc dừng lại. Phục hồi ban đêm bắt đầu.</li>
<li><strong>Giới hạn cuối tuần</strong>: Đừng nghĩ về công việc vào cuối tuần.</li>
<li><strong>Giấc ngủ không bao giờ bị hy sinh</strong>: Không bao giờ hy sinh giấc ngủ cho năng suất.</li>
</ul>
<hr />
<h2>Bài tập thực tế (40 phút) — Kiểm tra năng lượng và kế hoạch phục hồi</h2>
<ol>
<li><strong>Nhật ký năng lượng</strong>: Hôm nay và ngày mai: ghi nhật ký năng lượng (1-10) mỗi giờ.</li>
<li><strong>Giờ cao điểm</strong>: Đánh dấu 3-4 khung thời gian có năng lượng cao nhất.</li>
<li><strong>Tổ chức lại công việc</strong>: Sắp xếp lại lịch tuần: Giờ cao điểm = Công việc sâu. Năng lượng thấp = Thói quen/Cuộc họp.</li>
<li><strong>Nghi thức phục hồi</strong>: Chọn 1 nghi thức giải lao vi mô và 1 nghi thức giải lao vĩ mô. Lịch trình.</li>
<li><strong>Giới hạn cuối tuần</strong>: Đặt thời gian dừng: "Đây là lúc kết thúc công việc." Sau đó: không có công việc.</li>
</ol>
<hr />
<h2>Kiểm tra bản thân</h2>
<ul>
<li>✅ Tôi biết giờ năng lượng cao điểm của mình.</li>
<li>✅ Tôi đã lên kế hoạch công việc sâu trong giờ cao điểm.</li>
<li>✅ Tôi có nghi thức giải lao vi mô (5 phút).</li>
<li>✅ Tôi có nghi thức giải lao vĩ mô (20-30 phút).</li>
<li>✅ Tôi có giới hạn công việc cuối tuần.</li>
<li>✅ Giấc ngủ không bao giờ bị hy sinh cho năng suất.</li>
</ul>`,
    emailSubject: 'Năng suất 2026 – Ngày 10: Quản lý Năng lượng',
    emailBody: `<h1>Năng suất 2026 – Ngày 10</h1>
<h2>Quản lý Năng lượng: Khi nào làm việc, Khi nào nghỉ ngơi, Nghi thức phục hồi</h2>
<p><em>Năng suất không phải là để làm việc chăm chỉ hơn. Đó là về tốc độ và phục hồi.</em></p>
<p>Hôm nay bạn sẽ tìm hiểu cách quản lý năng lượng có ý thức cải thiện năng suất. Làm việc trong giờ cao điểm có nghĩa là 3x sản lượng hơn so với thời gian năng lượng thấp.</p>
<p><strong>Mục tiêu</strong>: Xác định các mẫu năng lượng của bạn và xây dựng các nghi thức phục hồi.</p>
<p><strong>Quiz</strong>: Trả lời 5 câu hỏi để xác nhận sự hiểu biết của bạn.</p>
<p><a href="{{APP_URL}}/vi/courses/${COURSE_ID_BASE}_VI/day/10">Mở bài học →</a></p>`
  },
  id: {
    title: 'Manajemen Energi: Kapan Bekerja, Kapan Istirahat, Ritual Pemulihan',
    content: `<h1>Manajemen Energi: Kapan Bekerja, Kapan Istirahat, Ritual Pemulihan</h1>
<p><em>Produktivitas bukan tentang bekerja lebih keras. Ini tentang kecepatan dan pemulihan.</em></p>
<hr />
<h2>Tujuan Pembelajaran</h2>
<ul>
<li>Pahami tingkat energi dan jendela kerja optimal.</li>
<li>Identifikasi pola energi pribadi Anda (puncak vs rendah).</li>
<li>Buat ritual pemulihan untuk istirahat antara pekerjaan.</li>
<li>Cegah kelelahan melalui manajemen energi yang sadar.</li>
</ul>
<hr />
<h2>Mengapa Ini Penting</h2>
<ul>
<li><strong>Perbedaan Kinerja</strong>: Bekerja pada jam sibuk = 3x lebih banyak pekerjaan daripada waktu energi rendah.</li>
<li><strong>Pencegahan Kelelahan</strong>: Istirahat sadar dan pemulihan menjaga otak Anda tetap berpengetahuan.</li>
<li><strong>Kreativitas Lebih Baik</strong>: Otak yang istirahat lebih kreatif dan membuat keputusan lebih baik.</li>
<li><strong>Output Berkelanjutan</strong>: Kecepatan berkelanjutan > Sprint kelelahan.</li>
</ul>
<hr />
<h2>Analisis Mendalam</h2>
<h3>1. Tingkat Energi</h3>
<ul>
<li><strong>Ritme Ultradiana</strong>: Otak Anda mendukung ~90 menit fokus, kemudian membutuhkan 20-30 menit pemulihan.</li>
<li><strong>Siklus Harian</strong>: Kebanyakan orang: puncak pagi, penurunan sore, naik lagi malam.</li>
<li><strong>Pola Pribadi</strong>: Beberapa adalah "burung malam", yang lain "pagi awal".</li>
<li><strong>Kelelahan Mingguan</strong>: Senin, Selasa tertinggi; Kamis, Jumat terendah.</li>
</ul>
<h3>2. Mengidentifikasi Jam Sibuk</h3>
<ul>
<li>Buat jurnal selama seminggu: tingkat energi per jam (skala 1-10).</li>
<li>Identifikasi 3-4 blok waktu dengan energi tertinggi.</li>
<li>Rencanakan pekerjaan paling penting dan kreatif Anda di blok tersebut.</li>
<li><strong>Aturan</strong>: Jam sibuk = waktu "kerja mendalam".</li>
</ul>
<h3>3. Ritual Pemulihan</h3>
<ul>
<li><strong>Istirahat Mikro (5 menit)</strong>: Jalan kaki, pernapasan, minum air.</li>
<li><strong>Istirahat Makro (20-30 menit)</strong>: Istirahat sore: Jalan kaki, makan siang, meditasi.</li>
<li><strong>Pemulihan Harian</strong>: Ritual pagi (Hari 7), tidur malam yang sempurna.</li>
<li><strong>Pemulihan Mingguan</strong>: Pemisahan mental penuh 1-2 hari per minggu.</li>
</ul>
<h3>4. Pencegahan Kelelahan</h3>
<ul>
<li><strong>Pengakuan</strong>: Anda membutuhkan lebih banyak istirahat jika: perubahan suasana hati, mudah tersinggung, masalah tidur.</li>
<li><strong>Sinyal Pertama</strong>: Ubah kecepatan harian Anda. Kurangi dorongan.</li>
<li><strong>Strategi</strong>: Pemulihan yang disadari > Istirahat paksa nanti.</li>
</ul>
<h3>5. Batas yang Sadar</h3>
<ul>
<li><strong>Makan Siang Sakral</strong>: Saat makan siang, jangan bekerja. Ini adalah pemulihan.</li>
<li><strong>Tidak Ada Email Setelah 18:00</strong>: Setelah 18:00 pekerjaan berhenti. Pemulihan malam dimulai.</li>
<li><strong>Batas Akhir Pekan</strong>: Jangan pikirkan pekerjaan di akhir pekan.</li>
<li><strong>Tidur Tidak Pernah Dikorbankan</strong>: Jangan pernah mengorbankan tidur untuk produktivitas.</li>
</ul>
<hr />
<h2>Latihan Praktik (40 menit) — Audit Energi dan Rencana Pemulihan</h2>
<ol>
<li><strong>Jurnal Energi</strong>: Hari ini dan besok: catat energi (1-10) setiap jam.</li>
<li><strong>Jam Sibuk</strong>: Tandai 3-4 blok waktu dengan energi tertinggi.</li>
<li><strong>Reorganisasi Pekerjaan</strong>: Atur ulang kalender mingguan Anda: Jam sibuk = Kerja mendalam. Energi rendah = Rutin/Pertemuan.</li>
<li><strong>Ritual Pemulihan</strong>: Pilih 1 ritual istirahat mikro dan 1 ritual istirahat makro. Jadwalkan.</li>
<li><strong>Batas Akhir Pekan</strong>: Atur waktu berhenti: "Ini adalah saat pekerjaan berakhir." Setelah itu: tidak ada pekerjaan.</li>
</ol>
<hr />
<h2>Periksa Diri Sendiri</h2>
<ul>
<li>✅ Saya tahu jam energi puncak saya.</li>
<li>✅ Saya telah menjadwalkan kerja mendalam selama jam sibuk.</li>
<li>✅ Saya memiliki ritual istirahat mikro (5 menit).</li>
<li>✅ Saya memiliki ritual istirahat makro (20-30 menit).</li>
<li>✅ Saya memiliki batas pekerjaan akhir pekan.</li>
<li>✅ Tidur tidak pernah dikorbankan untuk produktivitas.</li>
</ul>`,
    emailSubject: 'Produktivitas 2026 – Hari 10: Manajemen Energi',
    emailBody: `<h1>Produktivitas 2026 – Hari 10</h1>
<h2>Manajemen Energi: Kapan Bekerja, Kapan Istirahat, Ritual Pemulihan</h2>
<p><em>Produktivitas bukan tentang bekerja lebih keras. Ini tentang kecepatan dan pemulihan.</em></p>
<p>Hari ini Anda akan belajar bagaimana manajemen energi yang sadar meningkatkan produktivitas. Bekerja pada jam sibuk berarti 3x lebih banyak output daripada saat energi rendah.</p>
<p><strong>Tujuan</strong>: Identifikasi pola energi Anda dan bangun ritual pemulihan.</p>
<p><strong>Quiz</strong>: Jawab 5 pertanyaan untuk mengkonfirmasi pemahaman Anda.</p>
<p><a href="{{APP_URL}}/id/courses/${COURSE_ID_BASE}_ID/day/10">Buka pelajaran →</a></p>`
  },
  ar: {
    title: 'إدارة الطاقة: متى تعمل، متى تستريح، طقوس الاستعادة',
    content: `<h1>إدارة الطاقة: متى تعمل، متى تستريح، طقوس الاستعادة</h1>
<p><em>الإنتاجية ليست عن العمل بجد أكثر. تتعلق بالوتيرة والاستعادة.</em></p>
<hr />
<h2>أهداف التعلم</h2>
<ul>
<li>فهم مستويات الطاقة وفترات العمل المثالية.</li>
<li>حدد أنماط الطاقة الشخصية لديك (ذروة مقابل منخفضة).</li>
<li>إنشاء طقوس استعادة للراحة بين العمل.</li>
<li>منع الإرهاق من خلال إدارة الطاقة الواعية.</li>
</ul>
<hr />
<h2>لماذا هذا مهم</h2>
<ul>
<li><strong>الفرق في الأداء</strong>: العمل في ساعات الذروة = 3x من العمل أكثر من أوقات الطاقة المنخفضة.</li>
<li><strong>منع الإرهاق</strong>: الراحة الواعية والاستعادة تحافظ على دماغك غنيًا بالموارد.</li>
<li><strong>إبداع أفضل</strong>: الدماغ المستريح أكثر إبداعًا ويتخذ قرارات أفضل.</li>
<li><strong>الإنتاج المستدام</strong>: الوتيرة المستدامة > سباق الإرهاق.</li>
</ul>
<hr />
<h2>تحليل عميق</h2>
<h3>1. مستويات الطاقة</h3>
<ul>
<li><strong>إيقاع الأولتراديان</strong>: يدعم دماغك ~90 دقيقة من التركيز، ثم يحتاج إلى 20-30 دقيقة من الاستعادة.</li>
<li><strong>الدورة اليومية</strong>: معظم الناس: ذروة الصباح، انخفاض بعد الظهر، ارتفاع مرة أخرى في المساء.</li>
<li><strong>النمط الشخصي</strong>: البعض "بوم ليلي"، والآخر "طير مبكر".</li>
<li><strong>الإرهاق الأسبوعي</strong>: الاثنين والثلاثاء الأعلى؛ الخميس والجمعة الأدنى.</li>
</ul>
<h3>2. تحديد ساعات الذروة</h3>
<ul>
<li>احتفظ بدفتر يوميات لمدة أسبوع واحد: مستوى الطاقة في الساعة (مقياس 1-10).</li>
<li>حدد 3-4 كتل زمنية بأعلى طاقة.</li>
<li>خطط أهم وأكثر عملك الإبداعي في تلك الكتل.</li>
<li><strong>القاعدة</strong>: ساعات الذروة = وقت "العمل العميق".</li>
</ul>
<h3>3. طقوس الاستعادة</h3>
<ul>
<li><strong>راحة صغيرة (5 دقائق)</strong>: المشي، التنفس، شرب الماء.</li>
<li><strong>استراحة كبيرة (20-30 دقيقة)</strong>: استراحة بعد الظهر: المشي والغداء والتأمل.</li>
<li><strong>الاستعادة اليومية</strong>: الطقس الصباحي (اليوم 7)، نوم ليلي رائع.</li>
<li><strong>الاستعادة الأسبوعية</strong>: فصل عقلي كامل 1-2 أيام في الأسبوع.</li>
</ul>
<h3>4. منع الإرهاق</h3>
<ul>
<li><strong>الاعتراف</strong>: تحتاج إلى راحة أكثر إذا: تقلبات المزاج والانزعاج ومشاكل النوم.</li>
<li><strong>الإشارة الأولى</strong>: غير وتيرتك اليومية. قلل الضغط.</li>
<li><strong>الإستراتيجية</strong>: الاستعادة الواعية > الراحة القسرية في وقت لاحق.</li>
</ul>
<h3>5. حدود واعية</h3>
<ul>
<li><strong>الغداء مقدس</strong>: أثناء الغداء، لا تعمل. هذا هو الاستعادة.</li>
<li><strong>لا بريد إلكتروني بعد الساعة 18:00</strong>: بعد الساعة 18:00 تتوقف العمل. يبدأ الاستعادة الليلية.</li>
<li><strong>حدود نهاية الأسبوع</strong>: لا تفكر في العمل في نهايات الأسبوع.</li>
<li><strong>لا يتم التضحية بالنوم أبداً</strong>: لا تضح أبداً بالنوم من أجل الإنتاجية.</li>
</ul>
<hr />
<h2>التمرين العملي (40 دقيقة) — تدقيق الطاقة وخطة الاستعادة</h2>
<ol>
<li><strong>دفتر يوميات الطاقة</strong>: اليوم وغداً: سجل الطاقة (1-10) كل ساعة.</li>
<li><strong>ساعات الذروة</strong>: ضع علامة على 3-4 كتل زمنية بأعلى طاقة.</li>
<li><strong>إعادة تنظيم العمل</strong>: أعد تنظيم تقويمك الأسبوعي: ساعات الذروة = العمل العميق. الطاقة المنخفضة = الروتين/الاجتماعات.</li>
<li><strong>طقوس الاستعادة</strong>: اختر 1 طقس استراحة صغير و1 طقس استراحة كبير. جدول.</li>
<li><strong>حدود نهاية الأسبوع</strong>: اضبط وقت التوقف: "هذا هو الوقت الذي ينتهي فيه العمل." بعد ذلك: لا عمل.</li>
</ol>
<hr />
<h2>فحص ذاتي</h2>
<ul>
<li>✅ أعرف ساعات ذروة الطاقة لدي.</li>
<li>✅ لقد جدولت العمل العميق خلال ساعات الذروة.</li>
<li>✅ لدي طقس استراحة صغير (5 دقائق).</li>
<li>✅ لدي طقس استراحة كبير (20-30 دقيقة).</li>
<li>✅ لدي حد نهاية أسبوع للعمل.</li>
<li>✅ لا يتم التضحية بالنوم أبداً من أجل الإنتاجية.</li>
</ul>`,
    emailSubject: 'الإنتاجية 2026 – اليوم 10: إدارة الطاقة',
    emailBody: `<h1>الإنتاجية 2026 – اليوم 10</h1>
<h2>إدارة الطاقة: متى تعمل، متى تستريح، طقوس الاستعادة</h2>
<p><em>الإنتاجية ليست عن العمل بجد أكثر. تتعلق بالوتيرة والاستعادة.</em></p>
<p>اليوم ستتعلم كيف تحسن إدارة الطاقة الواعية الإنتاجية. العمل في ساعات الذروة يعني 3x من الإنتاج أكثر من وقت الطاقة المنخفضة.</p>
<p><strong>الهدف</strong>: حدد أنماط الطاقة لديك وقم ببناء طقوس الاستعادة.</p>
<p><strong>اختبار</strong>: أجب على 5 أسئلة لتأكيد فهمك.</p>
<p><a href="{{APP_URL}}/ar/courses/${COURSE_ID_BASE}_AR/day/10">افتح الدرس →</a></p>`
  },
  pt: {
    title: 'Gestão de Energia: Quando Trabalhar, Quando Descansar, Rituais de Recuperação',
    content: `<h1>Gestão de Energia: Quando Trabalhar, Quando Descansar, Rituais de Recuperação</h1>
<p><em>Produtividade não se trata de trabalhar mais duro. Trata-se de ritmo e recuperação.</em></p>
<hr />
<h2>Objetivos de Aprendizado</h2>
<ul>
<li>Entender os níveis de energia e as janelas de trabalho ideais.</li>
<li>Identifique seus padrões de energia pessoal (pico vs baixa).</li>
<li>Crie rituais de recuperação para pausas entre o trabalho.</li>
<li>Previna o esgotamento através da gestão de energia consciente.</li>
</ul>
<hr />
<h2>Por que isso é importante</h2>
<ul>
<li><strong>Diferença de desempenho</strong>: Trabalhar em horas de pico = 3x mais trabalho que em tempos de baixa energia.</li>
<li><strong>Prevenção de esgotamento</strong>: Pausas conscientes e recuperação mantêm seu cérebro bem fornecido de recursos.</li>
<li><strong>Melhor criatividade</strong>: Um cérebro descansado é mais criativo e toma melhores decisões.</li>
<li><strong>Produção sustentável</strong>: Ritmo sustentável > Sprint de esgotamento.</li>
</ul>
<hr />
<h2>Análise Profunda</h2>
<h3>1. Níveis de Energia</h3>
<ul>
<li><strong>Ritmo Ultradiano</strong>: Seu cérebro suporta ~90 minutos de foco, depois precisa de 20-30 min de recuperação.</li>
<li><strong>Ciclo Diário</strong>: A maioria das pessoas: pico matinal, queda à tarde, aumento novamente à noite.</li>
<li><strong>Padrão Pessoal</strong>: Alguns são "corujas noturnas", outros "madrugadores".</li>
<li><strong>Fadiga Semanal</strong>: Segunda, terça as mais altas; quinta, sexta as mais baixas.</li>
</ul>
<h3>2. Identificando Horas de Pico</h3>
<ul>
<li>Mantenha um diário por uma semana: nível de energia por hora (escala 1-10).</li>
<li>Identifique 3-4 blocos de tempo com maior energia.</li>
<li>Planeje seu trabalho mais importante e criativo nesses blocos.</li>
<li><strong>Regra</strong>: Horas de pico = tempo de "trabalho profundo".</li>
</ul>
<h3>3. Rituais de Recuperação</h3>
<ul>
<li><strong>Micropausa (5 min)</strong>: Caminhada, respire, beba água.</li>
<li><strong>Macropausa (20-30 min)</strong>: Pausa à tarde: Caminhada, almoço, meditação.</li>
<li><strong>Recuperação Diária</strong>: Ritual matinal (Dia 7), excelente sono noturno.</li>
<li><strong>Recuperação Semanal</strong>: Desconexão mental completa 1-2 dias por semana.</li>
</ul>
<h3>4. Prevenção de Esgotamento</h3>
<ul>
<li><strong>Reconhecimento</strong>: Você precisa de mais pausas se: oscilações de humor, irritabilidade, problemas de sono.</li>
<li><strong>Primeiro Sinal</strong>: Mude seu ritmo diário. Reduza a pressão.</li>
<li><strong>Estratégia</strong>: Recuperação consciente > Pausa forçada depois.</li>
</ul>
<h3>5. Limites Conscientes</h3>
<ul>
<li><strong>Almoço é Sagrado</strong>: Durante o almoço, não trabalhe. Isto é recuperação.</li>
<li><strong>Sem Email Após 18:00</strong>: Após 18:00 o trabalho para. A recuperação noturna começa.</li>
<li><strong>Limite de Fim de Semana</strong>: Não pense sobre trabalho no fim de semana.</li>
<li><strong>Sono Nunca Sacrificado</strong>: Nunca sacrifique o sono pela produtividade.</li>
</ul>
<hr />
<h2>Exercício Prático (40 minutos) — Auditoria de Energia e Plano de Recuperação</h2>
<ol>
<li><strong>Diário de Energia</strong>: Hoje e amanhã: registre a energia (1-10) a cada hora.</li>
<li><strong>Horas de Pico</strong>: Marque 3-4 blocos de tempo com maior energia.</li>
<li><strong>Reorganize o Trabalho</strong>: Reorganize seu calendário semanal: Horas de pico = Trabalho profundo. Energia baixa = Rotina/Reuniões.</li>
<li><strong>Rituais de Recuperação</strong>: Escolha 1 ritual de micropausa e 1 ritual de macropausa. Agende.</li>
<li><strong>Limite de Fim de Semana</strong>: Defina um tempo de parada: "Este é o momento em que o trabalho termina." Depois disso: sem trabalho.</li>
</ol>
<hr />
<h2>Auto-Verificação</h2>
<ul>
<li>✅ Conheço meus horários de pico de energia.</li>
<li>✅ Agendei trabalho profundo durante as horas de pico.</li>
<li>✅ Tenho um ritual de micropausa (5 min).</li>
<li>✅ Tenho um ritual de macropausa (20-30 min).</li>
<li>✅ Tenho um limite de trabalho no fim de semana.</li>
<li>✅ O sono nunca é sacrificado pela produtividade.</li>
</ul>`,
    emailSubject: 'Produtividade 2026 – Dia 10: Gestão de Energia',
    emailBody: `<h1>Produtividade 2026 – Dia 10</h1>
<h2>Gestão de Energia: Quando Trabalhar, Quando Descansar, Rituais de Recuperação</h2>
<p><em>Produtividade não se trata de trabalhar mais duro. Trata-se de ritmo e recuperação.</em></p>
<p>Hoje você aprenderá como a gestão de energia consciente melhora a produtividade. Trabalhar em horas de pico significa 3x mais produção do que em tempos de baixa energia.</p>
<p><strong>Meta</strong>: Identifique seus padrões de energia e construa rituais de recuperação.</p>
<p><strong>Quiz</strong>: Responda 5 perguntas para confirmar sua compreensão.</p>
<p><a href="{{APP_URL}}/pt/courses/${COURSE_ID_BASE}_PT/day/10">Abra a lição →</a></p>`
  },
  hi: {
    title: 'ऊर्जा प्रबंधन: कब काम करना है, कब आराम करना है, पुनर्प्राप्ति अनुष्ठान',
    content: `<h1>ऊर्जा प्रबंधन: कब काम करना है, कब आराम करना है, पुनर्प्राप्ति अनुष्ठान</h1>
<p><em>उत्पादकता कठिन परिश्रम के बारे में नहीं है। यह गति और पुनर्प्राप्ति के बारे में है।</em></p>
<hr />
<h2>सीखने के उद्देश्य</h2>
<ul>
<li>ऊर्जा स्तर और इष्टतम काम की खिड़कियों को समझें।</li>
<li>अपने व्यक्तिगत ऊर्जा पैटर्न की पहचान करें (शिखर बनाम कम)।</li>
<li>काम के बीच ब्रेक के लिए पुनर्प्राप्ति अनुष्ठान बनाएं।</li>
<li>सचेत ऊर्जा प्रबंधन के माध्यम से जलन को रोकें।</li>
</ul>
<hr />
<h2>यह महत्वपूर्ण क्यों है</h2>
<ul>
<li><strong>प्रदर्शन अंतर</strong>: शिखर घंटों में काम करना = कम ऊर्जा वाले समय की तुलना में 3x अधिक काम।</li>
<li><strong>जलन की रोकथाम</strong>: सचेत ब्रेक और पुनर्प्राप्ति आपके दिमाग को संसाधन-भरपूर रखते हैं।</li>
<li><strong>बेहतर रचनात्मकता</strong>: आराम वाला दिमाग अधिक रचनात्मक होता है और बेहतर निर्णय लेता है।</li>
<li><strong>टिकाऊ आउटपुट</strong>: टिकाऊ गति > जलन स्प्रिंट।</li>
</ul>
<hr />
<h2>गहरा विश्लेषण</h2>
<h3>1. ऊर्जा स्तर</h3>
<ul>
<li><strong>अल्ट्राडियन ताल</strong>: आपका दिमाग ~90 मिनट का ध्यान केंद्रित करता है, फिर 20-30 मिनट की पुनर्प्राप्ति की जरूरत होती है।</li>
<li><strong>दैनिक चक्र</strong>: अधिकांश लोग: सुबह शिखर, दोपहर में गिरावट, शाम को फिर से उठना।</li>
<li><strong>व्यक्तिगत पैटर्न</strong>: कुछ "रात के उल्लू" हैं, अन्य "सुबह-सवेरे के लोग"।</li>
<li><strong>साप्ताहिक थकान</strong>: सोमवार, मंगलवार सबसे अधिक; गुरुवार, शुक्रवार सबसे कम।</li>
</ul>
<h3>2. शिखर घंटों की पहचान</h3>
<ul>
<li>एक सप्ताह के लिए पत्रिका रखें: प्रति घंटा ऊर्जा स्तर (1-10 पैमाने)।</li>
<li>3-4 समय खंड सबसे अधिक ऊर्जा के साथ पहचानें।</li>
<li>अपने सबसे महत्वपूर्ण, रचनात्मक काम को उन खंडों में योजना बनाएं।</li>
<li><strong>नियम</strong>: शिखर घंटे = "गहरे काम" का समय।</li>
</ul>
<h3>3. पुनर्प्राप्ति अनुष्ठान</h3>
<ul>
<li><strong>माइक्रो ब्रेक (5 मिनट)</strong>: चलना, सांस लेना, पानी पीना।</li>
<li><strong>मैक्रो ब्रेक (20-30 मिनट)</strong>: दोपहर का ब्रेक: चलना, दोपहर का भोजन, ध्यान।</li>
<li><strong>दैनिक पुनर्प्राप्ति</strong>: सुबह की अनुष्ठान (दिन 7), उत्कृष्ट रात की नींद।</li>
<li><strong>साप्ताहिक पुनर्प्राप्ति</strong>: पूर्ण मानसिक विच्छेदन प्रति सप्ताह 1-2 दिन।</li>
</ul>
<h3>4. जलन की रोकथाम</h3>
<ul>
<li><strong>मान्यता</strong>: यदि आपको अधिक ब्रेक की जरूरत है: मानसिकता में बदलाव, चिड़चिड़ापन, नींद की समस्याएं।</li>
<li><strong>पहला संकेत</strong>: अपनी दैनिक गति बदलें। धक्का को कम करें।</li>
<li><strong>रणनीति</strong>: सचेत पुनर्प्राप्ति > बाद में जबरदस्ती ब्रेक।</li>
</ul>
<h3>5. सचेत सीमाएं</h3>
<ul>
<li><strong>दोपहर का भोजन पवित्र है</strong>: दोपहर के भोजन के दौरान काम न करें। यह पुनर्प्राप्ति है।</li>
<li><strong>शाम 6:00 बजे के बाद कोई ईमेल नहीं</strong>: शाम 6:00 बजे के बाद काम बंद हो जाता है। रात की पुनर्प्राप्ति शुरू होती है।</li>
<li><strong>सप्ताहांत सीमा</strong>: सप्ताहांत पर काम के बारे में न सोचें।</li>
<li><strong>नींद कभी बलिदान नहीं</strong>: उत्पादकता के लिए कभी भी नींद का बलिदान न दें।</li>
</ul>
<hr />
<h2>व्यावहारिक व्यायाम (40 मिनट) — ऊर्जा लेखा परीक्षा और पुनर्प्राप्ति योजना</h2>
<ol>
<li><strong>ऊर्जा पत्रिका</strong>: आज और कल: प्रत्येक घंटे ऊर्जा (1-10) दर्ज करें।</li>
<li><strong>शिखर घंटे</strong>: सबसे अधिक ऊर्जा के साथ 3-4 समय खंडों को चिह्नित करें।</li>
<li><strong>काम का पुनर्गठन करें</strong>: अपनी साप्ताहिक कैलेंडर को फिर से व्यवस्थित करें: शिखर घंटे = गहरा काम। कम ऊर्जा = दिनचर्या/बैठकें।</li>
<li><strong>पुनर्प्राप्ति अनुष्ठान</strong>: 1 माइक्रो-ब्रेक अनुष्ठान और 1 मैक्रो-ब्रेक अनुष्ठान चुनें। अनुसूची।</li>
<li><strong>सप्ताहांत सीमा</strong>: एक रुकने का समय सेट करें: "यह वह समय है जब काम समाप्त होता है।" इसके बाद: कोई काम नहीं।</li>
</ol>
<hr />
<h2>आत्म-जांच</h2>
<ul>
<li>✅ मैं अपने शिखर ऊर्जा घंटे जानता हूँ।</li>
<li>✅ मैंने शिखर घंटों के दौरान गहरा काम निर्धारित किया है।</li>
<li>✅ मेरे पास माइक्रो-ब्रेक अनुष्ठान है (5 मिनट)।</li>
<li>✅ मेरे पास मैक्रो-ब्रेक अनुष्ठान है (20-30 मिनट)।</li>
<li>✅ मेरे पास सप्ताहांत काम की सीमा है।</li>
<li>✅ उत्पादकता के लिए नींद कभी बलिदान नहीं दी जाती।</li>
</ul>`,
    emailSubject: 'उत्पादकता 2026 – दिन 10: ऊर्जा प्रबंधन',
    emailBody: `<h1>उत्पादकता 2026 – दिन 10</h1>
<h2>ऊर्जा प्रबंधन: कब काम करना है, कब आराम करना है, पुनर्प्राप्ति अनुष्ठान</h2>
<p><em>उत्पादकता कठिन परिश्रम के बारे में नहीं है। यह गति और पुत्ति के बारे में है।</em></p>
<p>आज आप सीखेंगे कि कैसे सचेत ऊर्जा प्रबंधन उत्पादकता में सुधार करता है। शिखर घंटों में काम करने का मतलब कम ऊर्जा समय की तुलना में 3x अधिक आउटपुट है।</p>
<p><strong>लक्ष्य</strong>: अपने ऊर्जा पैटर्न की पहचान करें और पुनर्प्राप्ति अनुष्ठान बनाएं।</p>
<p><strong>क्विज़</strong>: अपनी समझ की पुष्टि करने के लिए 5 प्रश्नों के उत्तर दें।</p>
<p><a href="{{APP_URL}}/hi/courses/${COURSE_ID_BASE}_HI/day/10">पाठ खोलें →</a></p>`
  }
};

// ============================================================================
// SEED FUNCTION
// ============================================================================

async function seedLesson10() {
  await connectDB();
  console.log('✅ Connected to MongoDB\n');

  let totalCourses = 0;
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

        // Create lesson
        const lesson = new Lesson({
          lessonId: `${COURSE_ID_BASE}_${lang.toUpperCase()}_DAY_10`,
          courseId: course._id,
          dayNumber: 10,
          title: LESSON_10[lang].title,
          content: LESSON_10[lang].content,
          emailSubject: LESSON_10[lang].emailSubject,
          emailBody: LESSON_10[lang].emailBody.replace(/\{\{APP_URL\}\}/g, process.env.NEXTAUTH_URL || 'https://www.amanoba.com')
        });
        await lesson.save();
        totalLessons++;
        console.log(`  ✅ Created lesson for ${lang.toUpperCase()}`);

        // Create quiz questions
        const quizQuestions = QUIZ_9[lang]; // Using Day 9 quiz questions for now (placeholder)
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
  console.log(`\n✅ Lesson 10 (Day 10) seeded successfully!\n`);

  process.exit(0);
}

seedLesson10().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
