/**
 * Seed Productivity 2026 Course - Lesson 13 (Day 13)
 * 
 * Day 13: Decision-Making Frameworks - Rapid decision, decision matrix, avoiding analysis paralysis
 * 
 * Creates lesson 13 for all 10 languages with PREMIUM quality content
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
// LESSON 13: Decision-Making Frameworks
// ============================================================================

const LESSON_13: Record<string, {
  title: string;
  content: string;
  emailSubject: string;
  emailBody: string;
}> = {
  hu: {
    title: 'Döntéshozatali Keretek: Gyors döntés, döntési mátrix, az elemzési bénultság elkerülése',
    content: `<h1>Döntéshozatali Keretek: Gyors döntés, döntési mátrix, az elemzési bénultság elkerülése</h1>
<p><em>Egy rossz döntés jobban teljesít, mint a végtelenség alatt meghozott döntés.</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
<li>Megérteni, miért vezethet az elemzési túlzás a termékenyedési csapdához.</li>
<li>A döntési mátrix módszer alkalmazása fontosságú és kockázat alapján.</li>
<li>Gyors döntéshozatali szabályok meghatározása kisebb és közepesen fontos kérdésekhez.</li>
<li>Az érzelmi tényezők felismerése a döntésekben és azok szabályzása.</li>
<li>Az "elég jó" (good enough) koncepció alkalmazása a halogatás csökkentésére.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
<li><strong>Elemzési bénultság</strong>: A túl sok információ és lehetőség halogatáshoz vezet. A legtöbb döntés nem igényel tökéletes információt.</li>
<li><strong>Idő drágább, mint a tökéletesség</strong>: Az egy hétig tartó elemzéshez képest, a gyors döntés után egy nap alatt korrigálni sokkal olcsóbb (ha szükséges).</li>
<li><strong>Termelékenység vs. Tökéletesség</strong>: A 80%-os megoldás ma jobban teljesít, mint a 100%-os megoldás soha.</li>
<li><strong>Döntési fáradtság</strong>: Minden döntés kognitív erőforrást fogyaszt. Szabályok és keretek csökkentik az erőfeszítést.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>1. Elemzési Bénultság (Analysis Paralysis)</h3>
<ul>
<li>Az agyunk nem szeret bizonytalanságot. Ezért folyamatosan további információt keres.</li>
<li>Az információ azonban csökkenő hozamokkal működik: az első 5 információ 80% értékű, a következő 10 pedig csak 15% új értéket ad.</li>
<li><strong>Megoldás</strong>: Határozz meg egy "információ határt" - ha túl vagy rajta, döntsd el.</li>
</ul>
<h3>2. A Döntési Mátrix</h3>
<ul>
<li>Egy egyszerű eszköz a lehetőségek összehasonlítására.</li>
<li><strong>Lépés 1</strong>: Sorok = lehetőségek (A, B, C). Oszlopok = kritériumok (költség, minőség, időigény).</li>
<li><strong>Lépés 2</strong>: Súlyozd a kritériumokat (az egyik 40%, másik 30%, stb.).</li>
<li><strong>Lépés 3</strong>: Minden lehetőséget értékelj minden kritériumban (1-5 skálán).</li>
<li><strong>Lépés 4</strong>: Szorozd meg az értékeket a súlyozással, és összesen kiszámítva nyer a legmagasabb sorszám.</li>
</ul>
<h3>3. Gyors Döntési Szabályok</h3>
<ul>
<li>Az összes döntés nem egyenlő. Határozz meg három kategóriát:
<ul>
<li><strong>Kicsi</strong> (megfordítható, <1 óra elemzés): Döntsd el azonnal, javítsd később szükség esetén.</li>
<li><strong>Közepesen fontos</strong> (félig megfordítható, 1 óra-2 óra elemzés): Egyetlen döntési mátrix, döntés.</li>
<li><strong>Nagy</strong> (nehezen megfordítható, 4+ óra elemzés): Döntési mátrix + tanács + alvással)</li>
</ul>
</li>
</ul>
<h3>4. Az Érzelmi Tényezők</h3>
<ul>
<li>A döntések soha nem 100% racionálisak. Az érzelmek befolyásolják a választást.</li>
<li><strong>Stratégia</strong>: Helyezd az érzelmi ítéleted egy (1-10 skálán). Ha az érzelmi ítélet az "információs" döntéseddel ellentétes, add neki időt, hogy intuitív információ kiderüljön.</li>
<li><strong>Kivétel</strong>: Ha az érzelmi ítéleted az "információs" döntéseddel azonos, erősítsd meg azt.</li>
</ul>
<h3>5. Az "Elég Jó" Koncepció</h3>
<ul>
<li>Az "optimális" gyakran az ellenségünk a szükséges helyett.</li>
<li>Az legtöbb termék/megoldás "elég jó" a funkcionális szintjén, de az érzelmi szintjén való fejlődés végtelenül költséges.</li>
<li><strong>Szabály</strong>: Az első 80% elég. A maradék 20% nemcsak 5x-szer drágabb, de a visszatérésed már nem így magas.</li>
</ul>
<hr />
<h2>Gyakorlati feladat (60 perc)</h2>
<ol>
<li><strong>Halogatott döntés azonosítása</strong>: Válassz egy döntést, amelyet 1+ hete halogatott. Írj le 3-4 lehetőséget.</li>
<li><strong>Döntési mátrix létrehozása</strong>: 3-4 kritérium, 1-2 súlyozás. Értékeld az opciókat.</li>
<li><strong>Kategorizálás</strong>: A döntés: kicsi, közepesen fontos vagy nagy? Mi történne, ha rossz?</li>
<li><strong>Érzelmi ítélet</strong>: Írd le az érzelmi válaszodat a legjobb opcióra. Hogyan kapcsolódik az információs döntéshez?</li>
<li><strong>Megkötés</strong>: Csináld meg az 80%-os döntést ma (az 100% mellett halogatás helyett).</li>
</ol>
<hr />
<h2>Önellenőrzés</h2>
<ul>
<li>✅ Tudom, mi az elemzési bénultság és hogyan működik.</li>
<li>✅ Tudom, hogyan kell egy döntési mátrixot kitölteni.</li>
<li>✅ Három döntési kategóriám van, és tudom, mennyit elemzek minden típushoz.</li>
<li>✅ Tudom, hogyan kell az érzelmi faktorokat az információs döntésembe integrálni.</li>
<li>✅ Tudom a különbséget az "elég jó" és az "optimális" között.</li>
<li>✅ Csináltam egy döntést az 80% szinten ma.</li>
</ul>`,
    emailSubject: 'Termelékenység 2026 – 13. nap: Döntéshozatali Keretek',
    emailBody: `<h1>Termelékenység 2026 – 13. nap</h1>
<h2>Döntéshozatali Keretek: Gyors döntés, döntési mátrix, az elemzési bénultság elkerülése</h2>
<p><em>Egy rossz döntés jobban teljesít, mint a végtelenség alatt meghozott döntés.</em></p>
<p>Ma azt tanulod meg, hogyan kell az elemzési csapdákat elkerülni és быстро döntéseket hozni az információ alapján. Az elemzési bénultság a termelékenység legnagyobb ellenségeinek egyike: túl sok lehetőség, túl sok információ, így soha nem döntünk.</p>
<p><strong>A megoldás</strong>: Döntési mátrix, gyors szabályok, és az "elég jó" koncepció.</p>
<p><a href="{{APP_URL}}/hu/courses/${COURSE_ID_BASE}_HU/day/13">Nyisd meg a leckét →</a></p>`
  },
  en: {
    title: 'Decision-Making Frameworks: Rapid Decisions, Decision Matrix, Avoiding Analysis Paralysis',
    content: `<h1>Decision-Making Frameworks: Rapid Decisions, Decision Matrix, Avoiding Analysis Paralysis</h1>
<p><em>A bad decision today beats a perfect decision never.</em></p>
<hr />
<h2>Learning Objectives</h2>
<ul>
<li>Understand why analysis overload creates productivity traps.</li>
<li>Apply the decision matrix method based on importance and risk.</li>
<li>Define rapid decision rules for minor and medium-importance questions.</li>
<li>Recognize emotional factors in decisions and regulate them.</li>
<li>Apply the "good enough" concept to reduce procrastination.</li>
</ul>
<hr />
<h2>Why This Matters</h2>
<ul>
<li><strong>Analysis Paralysis</strong>: Too much information and options lead to procrastination. Most decisions don't require perfect information.</li>
<li><strong>Time is More Expensive Than Perfection</strong>: Compared to analyzing for a week, making a quick decision and correcting in a day (if needed) is much cheaper.</li>
<li><strong>Productivity vs. Perfection</strong>: An 80% solution today outperforms a 100% solution never.</li>
<li><strong>Decision Fatigue</strong>: Every decision consumes cognitive resources. Rules and frameworks reduce effort.</li>
</ul>
<hr />
<h2>Deep Dive</h2>
<h3>1. Analysis Paralysis</h3>
<ul>
<li>Our brain dislikes uncertainty. So it continuously seeks more information.</li>
<li>Information follows diminishing returns: the first 5 pieces of info are 80% valuable, the next 10 add only 15% new value.</li>
<li><strong>Solution</strong>: Define an "information boundary"—when you cross it, decide.</li>
</ul>
<h3>2. The Decision Matrix</h3>
<ul>
<li>A simple tool to compare options.</li>
<li><strong>Step 1</strong>: Rows = options (A, B, C). Columns = criteria (cost, quality, time).</li>
<li><strong>Step 2</strong>: Weight the criteria (one is 40%, another 30%, etc.).</li>
<li><strong>Step 3</strong>: Score each option on each criterion (1-5 scale).</li>
<li><strong>Step 4</strong>: Multiply scores by weights, sum them—the highest total wins.</li>
</ul>
<h3>3. Rapid Decision Rules</h3>
<ul>
<li>Not all decisions are equal. Define three categories:
<ul>
<li><strong>Small</strong> (reversible, <1 hour analysis): Decide immediately, fix later if needed.</li>
<li><strong>Medium</strong> (half-reversible, 1-2 hours analysis): One decision matrix, decide.</li>
<li><strong>Large</strong> (hard to reverse, 4+ hours analysis): Decision matrix + counsel + sleep on it.</li>
</ul>
</li>
</ul>
<h3>4. Emotional Factors</h3>
<ul>
<li>Decisions are never 100% rational. Emotions influence choice.</li>
<li><strong>Strategy</strong>: Rate your emotional judgment on a 1-10 scale. If it conflicts with your "information" decision, give it time—intuition may be detecting information you haven't articulated.</li>
<li><strong>Exception</strong>: If your emotional judgment aligns with your information decision, validate it.</li>
</ul>
<h3>5. The "Good Enough" Concept</h3>
<ul>
<li>"Optimal" is often the enemy of "necessary."</li>
<li>Most products/solutions are "good enough" functionally, but emotional/perfection refinement is infinitely expensive.</li>
<li><strong>Rule</strong>: First 80% is sufficient. The remaining 20% is not just 5x more expensive—your ROI is already declining.</li>
</ul>
<hr />
<h2>Practical Exercise (60 minutes)</h2>
<ol>
<li><strong>Identify a Postponed Decision</strong>: Choose a decision you've delayed 1+ weeks. List 3-4 options.</li>
<li><strong>Build a Decision Matrix</strong>: 3-4 criteria, 1-2 weightings. Score each option.</li>
<li><strong>Categorize It</strong>: Is this small, medium, or large? What happens if you choose wrong?</li>
<li><strong>Emotional Judgment</strong>: Write your emotional response to the top option. How does it align with your information decision?</li>
<li><strong>Make the 80% Call</strong>: Make the "good enough" decision today (instead of chasing 100% forever).</li>
</ol>
<hr />
<h2>Self-Check</h2>
<ul>
<li>✅ I understand analysis paralysis and how it works.</li>
<li>✅ I know how to build and fill a decision matrix.</li>
<li>✅ I have three decision categories and know how much analysis each gets.</li>
<li>✅ I know how to integrate emotional factors with my information decision.</li>
<li>✅ I understand the difference between "good enough" and "optimal."</li>
<li>✅ I made an 80% decision today.</li>
</ul>`,
    emailSubject: 'Productivity 2026 – Day 13: Decision-Making Frameworks',
    emailBody: `<h1>Productivity 2026 – Day 13</h1>
<h2>Decision-Making Frameworks: Rapid Decisions, Decision Matrix, Avoiding Analysis Paralysis</h2>
<p><em>A bad decision today beats a perfect decision never.</em></p>
<p>Today you'll learn to escape analysis traps and make informed decisions quickly. Analysis paralysis is one of productivity's greatest enemies: too many options, too much information, so you never decide.</p>
<p><strong>The solution</strong>: Decision matrix, rapid rules, and the "good enough" concept.</p>
<p><a href="{{APP_URL}}/en/courses/${COURSE_ID_BASE}_EN/day/13">Open the lesson →</a></p>`
  },
  tr: {
    title: 'Karar Verme Çerçeveleri: Hızlı Kararlar, Karar Matrisi, Analiz Felçini Önlemek',
    content: `<h1>Karar Verme Çerçeveleri: Hızlı Kararlar, Karar Matrisi, Analiz Felçini Önlemek</h1>
<p><em>Hiç alınmayan mükemmel karardan daha iyi, bugün alınan kötü bir karar.</em></p>
<hr />
<h2>Öğrenme Hedefleri</h2>
<ul>
<li>Analiz aşırısının neden üretkenlik tuzaklarını yarattığını anlayın.</li>
<li>Karar matrisi yöntemini önem ve risk temelinde uygulayın.</li>
<li>Küçük ve orta ölçüde önemli sorular için hızlı karar kurallarını tanımlayın.</li>
<li>Kararılardaki duygusal faktörleri tanıyın ve düzenleyin.</li>
<li>Ertelemeyi azaltmak için "yeterince iyi" konseptini uygulayın.</li>
</ul>
<hr />
<h2>Neden Önemli</h2>
<ul>
<li><strong>Analiz Felçi</strong>: Çok fazla bilgi ve seçenek ertelemeye yol açar. Çoğu karar mükemmel bilgi gerektirmez.</li>
<li><strong>Zaman Mükemmellikten Daha Pahalıdır</strong>: Bir haftadan daha fazla analiz yapmaya kıyasla, hızlı bir karar almak ve gerekirse bir gün içinde düzeltmek çok daha ucuzdur.</li>
<li><strong>Üretkenlik vs. Mükemmellik</strong>: Bugün %80 çözüm, asla alınmayan %100 çözümden daha iyi performans gösterir.</li>
<li><strong>Karar Yorgunluğu</strong>: Her karar bilişsel kaynakları tüketir. Kurallar ve çerçeveler çabayı azaltır.</li>
</ul>
<hr />
<h2>Derinlemesine İnceleme</h2>
<h3>1. Analiz Felçi</h3>
<ul>
<li>Beynimiz belirsizliği sevmez. Bu yüzden sürekli daha fazla bilgi arar.</li>
<li>Bilgi azalan getiri izler: ilk 5 bilgi parçası %80 değerlidir, sonraki 10 sadece %15 yeni değer ekler.</li>
<li><strong>Çözüm</strong>: Bir "bilgi sınırı" belirleyin—onu aştığınızda karar verin.</li>
</ul>
<h3>2. Karar Matrisi</h3>
<ul>
<li>Seçenekleri karşılaştırmak için basit bir araç.</li>
<li><strong>Adım 1</strong>: Satırlar = seçenekler (A, B, C). Sütunlar = kriterler (maliyet, kalite, zaman).</li>
<li><strong>Adım 2</strong>: Kriterleri ağırlıklandırın (biri %40, diğeri %30, vb.).</li>
<li><strong>Adım 3</strong>: Her seçeneği her kriterinde değerlendirin (1-5 ölçeğinde).</li>
<li><strong>Adım 4</strong>: Puanları ağırlıklarla çarpın, toplayın—en yüksek toplam kazanır.</li>
</ul>
<h3>3. Hızlı Karar Kuralları</h3>
<ul>
<li>Tüm kararlar eşit değildir. Üç kategoriyi tanımlayın:
<ul>
<li><strong>Küçük</strong> (tersine çevrilebilir, <1 saat analiz): Hemen karar verin, gerekirse sonra düzeltin.</li>
<li><strong>Orta</strong> (yarı tersine çevrilebilir, 1-2 saat analiz): Bir karar matrisi, karar verin.</li>
<li><strong>Büyük</strong> (tersine çevrilmesi zor, 4+ saat analiz): Karar matrisi + danışma + uyku.</li>
</ul>
</li>
</ul>
<h3>4. Duygusal Faktörler</h3>
<ul>
<li>Kararlar asla %100 rasyoneldir. Duygular seçimi etkiler.</li>
<li><strong>Strateji</strong>: Duygusal hükümü 1-10 ölçeğinde değerlendirin. "Bilgisel" kararınızla çelişirse, zamanınızı verin—sezgi fark etmediğiniz bilgiyi algılıyor olabilir.</li>
<li><strong>İstisna</strong>: Duygusal hükümü "bilgisel" kararınızla uyumlu ise, doğrulayın.</li>
</ul>
<h3>5. "Yeterince İyi" Konsepti</h3>
<ul>
<li>"Optimal" genellikle "gerekli"nin düşmanıdır.</li>
<li>Çoğu ürün/çözüm işlevsel düzeyde "yeterince iyidir", ancak duygusal/mükemmellik iyileştirmesi sonsuz pahalıdır.</li>
<li><strong>Kural</strong>: İlk %80 yeterlidir. Kalan %20 sadece 5x daha pahalı değildir—ROI'niz zaten düşüyordur.</li>
</ul>
<hr />
<h2>Pratik Egzersiz (60 dakika)</h2>
<ol>
<li><strong>Ertelenmiş Kararı Tanımla</strong>: 1+ haftadır ertelediğiniz bir kararı seçin. 3-4 seçenek listeleyin.</li>
<li><strong>Karar Matrisi Oluştur</strong>: 3-4 kriterin, 1-2 ağırlıklandırma. Her seçeneği puanlandırın.</li>
<li><strong>Kategorize Et</strong>: Bu küçük, orta mı, büyük? Yanlış seçersem ne olur?</li>
<li><strong>Duygusal Hüküm</strong>: En iyi seçeneğe duygusal tepkinizi yazın. "Bilgisel" kararınızla nasıl uyumlu?</li>
<li><strong>%80 Kararı Ver</strong>: Bugün "yeterince iyi" kararı ver (sonsuza dek %100 için değil).</li>
</ol>
<hr />
<h2>Kendi Kendine Kontrol</h2>
<ul>
<li>✅ Analiz felçini ve nasıl çalıştığını anlıyorum.</li>
<li>✅ Karar matrisi nasıl oluşturulur ve doldurulur biliyorum.</li>
<li>✅ Üç karar kategorim var ve her tür için ne kadar analiz yapılacağını biliyorum.</li>
<li>✅ Duygusal faktörleri "bilgisel" kararımla nasıl entegre edeceğimi biliyorum.</li>
<li>✅ "Yeterince iyi" ve "optimal" arasındaki farkı anlıyorum.</li>
<li>✅ Bugün %80 kararı verdim.</li>
</ul>`,
    emailSubject: 'Verimlilik 2026 – 13. Gün: Karar Verme Çerçeveleri',
    emailBody: `<h1>Verimlilik 2026 – 13. Gün</h1>
<h2>Karar Verme Çerçeveleri: Hızlı Kararlar, Karar Matrisi, Analiz Felçini Önlemek</h2>
<p><em>Hiç alınmayan mükemmel karardan daha iyi, bugün alınan kötü bir karar.</em></p>
<p>Bugün analiz tuzaklarından kaçmayı ve hızla bilgilendirilmiş kararları almayı öğreneceksiniz. Analiz felçi üretkenliğin en büyük düşmanlarından biridir: çok fazla seçenek, çok fazla bilgi, bu nedenle asla karar veremezsiniz.</p>
<p><strong>Çözüm</strong>: Karar matrisi, hızlı kurallar ve "yeterince iyi" konsepti.</p>
<p><a href="{{APP_URL}}/tr/courses/${COURSE_ID_BASE}_TR/day/13">Dersi aç →</a></p>`
  },
  bg: {
    title: 'Рамки за вземане на решения: Бързи решения, матрица на решения, избягване на анализната парализа',
    content: `<h1>Рамки за вземане на решения: Бързи решения, матрица на решения, избягване на анализната парализа</h1>
<p><em>Лошо решение днес е по-добре от идеално решение, което никога не е взето.</em></p>
<hr />
<h2>Учебни цели</h2>
<ul>
<li>Разберете защо анализната претоварка създава капани на производителност.</li>
<li>Приложете метода на матрица на решения на основата на важност и риск.</li>
<li>Дефинирайте правилата за бързо решение за малки и средно важни въпроси.</li>
<li>Познайте емоционалните фактори в решенията и ги регулирайте.</li>
<li>Приложете концепцията "достатъчно добре", за да намалите отлагането.</li>
</ul>
<hr />
<h2>Защо е важно</h2>
<ul>
<li><strong>Анализна парализа</strong>: Твърде много информация и опции водят до отлагане. Повечето решения не изискват идеална информация.</li>
<li><strong>Времето е по-скъпо от съвършенството</strong>: В сравнение с анализиране за седмица, вземането на бързо решение и коригирането в един ден (ако е необходимо) е много по-евтино.</li>
<li><strong>Производителност спрямо съвършенство</strong>: 80%-ното решение днес превъзхожда 100%-ното решение никога.</li>
<li><strong>Умора при вземане на решения</strong>: Всяко решение потребява когнитивни ресурси. Правилата и рамките намаляват усилието.</li>
</ul>
<hr />
<h2>Дълбоко потапяне</h2>
<h3>1. Анализна парализа</h3>
<ul>
<li>Нашият мозък не харесва неопределеност. Затова постоянно търси повече информация.</li>
<li>Информацията следва намаляващите поправки: първите 5 броя информация са 80% ценни, следващите 10 добавят само 15% нова стойност.</li>
<li><strong>Решение</strong>: Дефинирайте "информационна граница"—когато я пресичате, вземете решение.</li>
</ul>
<h3>2. Матрица на решение</h3>
<ul>
<li>Прост инструмент за сравняване на опции.</li>
<li><strong>Стъпка 1</strong>: Редове = опции (A, B, C). Колони = критерии (цена, качество, време).</li>
<li><strong>Стъпка 2</strong>: Претеглете критериите (един е 40%, друг 30% и т.н.).</li>
<li><strong>Стъпка 3</strong>: Оценете всяка опция за всеки критерий (1-5 скала).</li>
<li><strong>Стъпка 4</strong>: Умножете оценките по тежести, сумирайте ги—най-високата сума печели.</li>
</ul>
<h3>3. Правила за бързо решение</h3>
<ul>
<li>Не всички решения са равни. Дефинирайте три категории:
<ul>
<li><strong>Малки</strong> (обратимо, <1 час анализ): Вземете решение веднага, коригирайте по-късно, ако е необходимо.</li>
<li><strong>Средно</strong> (полу-обратимо, 1-2 часа анализ): Една матрица на решение, вземете решение.</li>
<li><strong>Голямо</strong> (трудно обратимо, 4+ часа анализ): Матрица на решение + съвет + спане.</li>
</ul>
</li>
</ul>
<h3>4. Емоционални фактори</h3>
<ul>
<li>Решенията никога не са 100% рационални. Емоциите влияят на избора.</li>
<li><strong>Стратегия</strong>: Оценете емоционалното си съждение по скала 1-10. Ако противоречи на "информационното" ви решение, отделете му време—интуиция може да открива информация, която не сте артикулирали.</li>
<li><strong>Изключение</strong>: Ако емоционалното ви съждение съвпада с "информационното" ви решение, валидирайте го.</li>
</ul>
<h3>5. "Достатъчно добре" концепция</h3>
<ul>
<li>"Оптимално" е често врагът на "необходимо".</li>
<li>Повечето продукти/решения са "достатъчно добри" функционално, но емоционалното/съвършен-ство подобрение е безкрайно скъпо.</li>
<li><strong>Правило</strong>: Първи 80% е достатъчен. Останалите 20% не е само 5x по-скъпо—твоята ROI вече намалява.</li>
</ul>
<hr />
<h2>Практическо упражнение (60 минути)</h2>
<ol>
<li><strong>Определете отложено решение</strong>: Изберете решение, което сте отлагали 1+ седмици. Избройте 3-4 опции.</li>
<li><strong>Изградете матрица на решение</strong>: 3-4 критерия, 1-2 претегляне. Оценете всяка опция.</li>
<li><strong>Категоризирайте го</strong>: Това малко, средно или голямо? Какво се случва, ако изберете грешно?</li>
<li><strong>Емоционално съждение</strong>: Напишете емоционалната си реакция към най-добрата опция. Как се подравнява с "информационното" ви решение?</li>
<li><strong>Направете 80%-ното решение</strong>: Вземете решението "достатъчно добре" днес (вместо да преследвате 100% завинаги).</li>
</ol>
<hr />
<h2>Собственна проверка</h2>
<ul>
<li>✅ Разбирам анализната парализа и как работи.</li>
<li>✅ Знам как да построя и запълня матрица на решение.</li>
<li>✅ Имам три категории решения и знам колко анализ получава всеки тип.</li>
<li>✅ Знам как да интегрирам емоционални фактори с моето "информационно" решение.</li>
<li>✅ Разбирам разликата между "достатъчно добре" и "оптимално".</li>
<li>✅ Направих 80%-ното решение днес.</li>
</ul>`,
    emailSubject: 'Производителност 2026 – 13. Ден: Рамки за вземане на решения',
    emailBody: `<h1>Производителност 2026 – 13. Ден</h1>
<h2>Рамки за вземане на решения: Бързи решения, матрица на решения, избягване на анализната парализа</h2>
<p><em>Лошо решение днес е по-добре от идеално решение, което никога не е взето.</em></p>
<p>Днес ще научите как да избегнете анализни капани и да вземете бързо информирани решения. Анализната парализа е един от най-големите врагове на производителността: твърде много опции, твърде много информация, така че никога не решавате.</p>
<p><strong>Решение</strong>: Матрица на решение, бързи правила и "достатъчно добре" концепция.</p>
<p><a href="{{APP_URL}}/bg/courses/${COURSE_ID_BASE}_BG/day/13">Отворете урока →</a></p>`
  },
  pl: {
    title: 'Ramy Podejmowania Decyzji: Szybkie decyzje, macierz decyzji, unikanie paraliżu analizy',
    content: `<h1>Ramy Podejmowania Decyzji: Szybkie decyzje, macierz decyzji, unikanie paraliżu analizy</h1>
<p><em>Zła decyzja dzisiaj jest lepsza niż idealna decyzja nigdy nie podjęta.</em></p>
<hr />
<h2>Cele edukacyjne</h2>
<ul>
<li>Rozumieć, dlaczego nadmierna analiza tworzy pułapki produktywności.</li>
<li>Stosować metodę macierzy decyzji opartą na znaczeniu i ryzyku.</li>
<li>Zdefiniować szybkie reguły decyzji dla małych i średnio ważnych pytań.</li>
<li>Rozpoznać czynniki emocjonalne w decyzjach i je regulować.</li>
<li>Zastosować koncepcję "wystarczająco dobry", aby zmniejszyć prokrastynację.</li>
</ul>
<hr />
<h2>Dlaczego jest to ważne</h2>
<ul>
<li><strong>Paraliż Analizy</strong>: Zbyt dużo informacji i opcji prowadzi do prokrastynacji. Większość decyzji nie wymaga idealnych informacji.</li>
<li><strong>Czas jest droższy niż doskonałość</strong>: W porównaniu z analizowaniem przez tydzień, podjęcie szybkiej decyzji i jej poprawienie w ciągu dnia (jeśli to konieczne) jest znacznie tańsze.</li>
<li><strong>Produktywność vs. doskonałość</strong>: 80%-owe rozwiązanie dzisiaj przewyższa 100%-owe rozwiązanie nigdy.</li>
<li><strong>Zmęczenie decyzją</strong>: Każda decyzja zużywa zasoby poznawcze. Zasady i ramy zmniejszają wysiłek.</li>
</ul>
<hr />
<h2>Głębokie zanurzenie</h2>
<h3>1. Paraliż Analizy</h3>
<ul>
<li>Nasz mózg nie lubi niepewności. Dlatego stale szuka więcej informacji.</li>
<li>Informacja ma malejące zwroty: pierwsze 5 sztuk informacji jest warth 80%, następne 10 dodaje tylko 15% nowej wartości.</li>
<li><strong>Rozwiązanie</strong>: Zdefiniuj "granicę informacji"—kiedy ją przekroczysz, podejmij decyzję.</li>
</ul>
<h3>2. Macierz Decyzji</h3>
<ul>
<li>Proste narzędzie do porównywania opcji.</li>
<li><strong>Krok 1</strong>: Wiersze = opcje (A, B, C). Kolumny = kryteria (koszt, jakość, czas).</li>
<li><strong>Krok 2</strong>: Ważyć kryteria (jeden to 40%, drugi 30%, itd.).</li>
<li><strong>Krok 3</strong>: Ocenić każdą opcję na każdym kryterium (skala 1-5).</li>
<li><strong>Krok 4</strong>: Pomnóż oceny przez wagi, zsumuj je—najwyższe wyniki wygrywają.</li>
</ul>
<h3>3. Szybkie Reguły Decyzji</h3>
<ul>
<li>Nie wszystkie decyzje są równe. Zdefiniuj trzy kategorie:
<ul>
<li><strong>Małe</strong> (odwracalne, <1 godzina analizy): Podejmij decyzję natychmiast, napraw później, jeśli to konieczne.</li>
<li><strong>Średnie</strong> (pół-odwracalne, 1-2 godziny analizy): Jedna macierz decyzji, podejmij decyzję.</li>
<li><strong>Duże</strong> (trudne do odwrócenia, 4+ godziny analizy): Macierz decyzji + rada + sen na tym.</li>
</ul>
</li>
</ul>
<h3>4. Czynniki Emocjonalne</h3>
<ul>
<li>Decyzje nigdy nie są w 100% racjonalne. Emocje wpływają na wybór.</li>
<li><strong>Strategia</strong>: Ocenić swoją emocjonalną ocenę na skali 1-10. Jeśli jest w konflikcie z twoją "informacyjną" decyzją, daj jej czas—intuicja może wykrywać informacje, które nie sformułowałeś.</li>
<li><strong>Wyjątek</strong>: Jeśli twoja emocjonalna ocena pokrywa się z twoją "informacyjną" decyzją, ją zwaliduj.</li>
</ul>
<h3>5. Koncepcja "Wystarczająco Dobry"</h3>
<ul>
<li>"Optymalny" jest często wrogiem "koniecznego".</li>
<li>Większość produktów/rozwiązań jest "wystarczająco dobra" funkcjonalnie, ale emocjonalne/doskonałościowe ulepszenia są nieskończenie drogie.</li>
<li><strong>Reguła</strong>: Pierwsze 80% jest wystarczające. Pozostałe 20% nie jest tylko 5x droższe—twój zwrot z inwestycji już maleje.</li>
</ul>
<hr />
<h2>Ćwiczenie praktyczne (60 minut)</h2>
<ol>
<li><strong>Zidentyfikuj odłożoną decyzję</strong>: Wybierz decyzję, którą odkładałeś 1+ tygodnie. Wymień 3-4 opcje.</li>
<li><strong>Zbuduj macierz decyzji</strong>: 3-4 kryteria, 1-2 ważenia. Oceń każdą opcję.</li>
<li><strong>Kategoryzuj to</strong>: Czy to małe, średnie czy duże? Co się stanie, jeśli wybrałeś źle?</li>
<li><strong>Emocjonalna Ocena</strong>: Napisz swoją emocjonalną reakcję na najlepszą opcję. Jak się wystawia w stosunku do twojej "informacyjnej" decyzji?</li>
<li><strong>Wykonaj decyzję 80%</strong>: Podejmij decyzję "wystarczająco dobrą" dzisiaj (zamiast gonić 100% na zawsze).</li>
</ol>
<hr />
<h2>Samosprawdzenie</h2>
<ul>
<li>✅ Rozumiem paraliż analizy i jak to działa.</li>
<li>✅ Wiem, jak zbudować i wypełnić macierz decyzji.</li>
<li>✅ Mam trzy kategorie decyzji i wiem, ile analizy każdy typ otrzymuje.</li>
<li>✅ Wiem, jak zintegrować czynniki emocjonalne z moją "informacyjną" decyzją.</li>
<li>✅ Rozumiem różnicę między "wystarczająco dobry" a "optymalny".</li>
<li>✅ Podjąłem decyzję 80% dzisiaj.</li>
</ul>`,
    emailSubject: 'Produktywność 2026 – 13. Dzień: Ramy Podejmowania Decyzji',
    emailBody: `<h1>Produktywność 2026 – 13. Dzień</h1>
<h2>Ramy Podejmowania Decyzji: Szybkie decyzje, macierz decyzji, unikanie paraliżu analizy</h2>
<p><em>Zła decyzja dzisiaj jest lepsza niż idealna decyzja nigdy nie podjęta.</em></p>
<p>Dzisiaj nauczysz się unikać pułapek analitycznych i szybko podejmować świadome decyzje. Paraliż analizy jest jednym z największych wrogów produktywności: zbyt wiele opcji, zbyt wiele informacji, więc nigdy nie decydujesz.</p>
<p><strong>Rozwiązanie</strong>: Macierz decyzji, szybkie reguły i koncepcja "wystarczająco dobry".</p>
<p><a href="{{APP_URL}}/pl/courses/${COURSE_ID_BASE}_PL/day/13">Otwórz lekcję →</a></p>`
  },
  vi: {
    title: 'Khung Quy Trình Ra Quyết Định: Quyết Định Nhanh, Ma Trận Quyết Định, Tránh Tê Liệt Phân Tích',
    content: `<h1>Khung Quy Trình Ra Quyết Định: Quyết Định Nhanh, Ma Trận Quyết Định, Tránh Tê Liệt Phân Tích</h1>
<p><em>Một quyết định tồi hôm nay tốt hơn một quyết định hoàn hảo không bao giờ được đưa ra.</em></p>
<hr />
<h2>Mục tiêu học tập</h2>
<ul>
<li>Hiểu tại sao phân tích quá tải tạo ra những cái bẫy về năng suất.</li>
<li>Áp dụng phương pháp ma trận quyết định dựa trên tầm quan trọng và rủi ro.</li>
<li>Xác định các quy tắc quyết định nhanh cho các câu hỏi nhỏ và trung bình.</li>
<li>Nhận biết các yếu tố cảm xúc trong các quyết định và điều chỉnh chúng.</li>
<li>Áp dụng khái niệm "đủ tốt" để giảm bớt sự trì hoãn.</li>
</ul>
<hr />
<h2>Tại sao điều này lại quan trọng</h2>
<ul>
<li><strong>Tê Liệt Phân Tích</strong>: Quá nhiều thông tin và tùy chọn dẫn đến sự trì hoãn. Hầu hết các quyết định không cần thông tin hoàn hảo.</li>
<li><strong>Thời Gian Đắt Hơn So Với Hoàn Hảo</strong>: So với phân tích trong một tuần, đưa ra quyết định nhanh chóng và sửa chữa trong một ngày (nếu cần) rẻ hơn nhiều.</li>
<li><strong>Năng Suất vs. Hoàn Hảo</strong>: Giải pháp 80% hôm nay vượt trội hơn giải pháp 100% không bao giờ.</li>
<li><strong>Mệt Mỏi Quyết Định</strong>: Mỗi quyết định tiêu tốn tài nguyên nhận thức. Các quy tắc và khung giảm nỗ lực.</li>
</ul>
<hr />
<h2>Lặn sâu</h2>
<h3>1. Tê Liệt Phân Tích</h3>
<ul>
<li>Bộ não chúng ta không thích sự không chắc chắn. Vì vậy nó liên tục tìm kiếm thêm thông tin.</li>
<li>Thông tin tuân theo lợi nhuận giảm dần: 5 mẩu tin đầu tiên có giá trị 80%, 10 mẩu tiếp theo chỉ thêm 15% giá trị mới.</li>
<li><strong>Giải pháp</strong>: Xác định một "ranh giới thông tin"—khi bạn vượt qua nó, hãy quyết định.</li>
</ul>
<h3>2. Ma Trận Quyết Định</h3>
<ul>
<li>Một công cụ đơn giản để so sánh các tùy chọn.</li>
<li><strong>Bước 1</strong>: Hàng = tùy chọn (A, B, C). Cột = tiêu chí (chi phí, chất lượng, thời gian).</li>
<li><strong>Bước 2</strong>: Cân nặng tiêu chí (cái nọ 40%, cái kia 30%, v.v.).</li>
<li><strong>Bước 3</strong>: Đánh giá mỗi tùy chọn trên mỗi tiêu chí (thang 1-5).</li>
<li><strong>Bước 4</strong>: Nhân điểm số với trọng số, cộng lại—tổng cao nhất thắng.</li>
</ul>
<h3>3. Quy Tắc Quyết Định Nhanh</h3>
<ul>
<li>Không phải tất cả các quyết định đều bằng nhau. Xác định ba loại:
<ul>
<li><strong>Nhỏ</strong> (có thể đảo lại, <1 giờ phân tích): Quyết định ngay lập tức, sửa chữa sau nếu cần.</li>
<li><strong>Trung bình</strong> (nửa có thể đảo lại, 1-2 giờ phân tích): Một ma trận quyết định, quyết định.</li>
<li><strong>Lớn</strong> (khó đảo lại, 4+ giờ phân tích): Ma trận quyết định + tư vấn + ngủ.</li>
</ul>
</li>
</ul>
<h3>4. Các Yếu Tố Cảm Xúc</h3>
<ul>
<li>Các quyết định không bao giờ hoàn toàn hợp lý. Cảm xúc ảnh hưởng đến sự lựa chọn.</li>
<li><strong>Chiến lược</strong>: Đánh giá sự phán xét cảm xúc của bạn trên thang điểm 1-10. Nếu nó xung đột với quyết định "thông tin" của bạn, hãy dành thời gian cho nó—trực giác có thể đang phát hiện thông tin bạn chưa nêu rõ.</li>
<li><strong>Ngoại lệ</strong>: Nếu sự phán xét cảm xúc của bạn phù hợp với quyết định "thông tin" của bạn, hãy xác nhận nó.</li>
</ul>
<h3>5. Khái Niệm "Đủ Tốt"</h3>
<ul>
<li>"Tối ưu" thường là kẻ thù của "cần thiết".</li>
<li>Hầu hết các sản phẩm/giải pháp đều "đủ tốt" ở mức chức năng, nhưng cải tiến cảm xúc/hoàn hảo là vô cùng đắt đo.</li>
<li><strong>Quy tắc</strong>: 80% đầu tiên là đủ. 20% còn lại không chỉ đắt gấp 5 lần—lợi nhuận đầu tư của bạn đã giảm.</li>
</ul>
<hr />
<h2>Bài tập thực hành (60 phút)</h2>
<ol>
<li><strong>Xác định quyết định bị hoãn lại</strong>: Chọn một quyết định bạn đã trì hoãn 1+ tuần. Liệt kê 3-4 tùy chọn.</li>
<li><strong>Xây dựng ma trận quyết định</strong>: 3-4 tiêu chí, 1-2 cân nặng. Đánh giá từng tùy chọn.</li>
<li><strong>Phân loại nó</strong>: Cái này nhỏ, trung bình hay lớn? Điều gì sẽ xảy ra nếu bạn chọn sai?</li>
<li><strong>Phán Xét Cảm Xúc</strong>: Viết phản ứng cảm xúc của bạn đối với tùy chọn tốt nhất. Nó liên kết như thế nào với quyết định "thông tin" của bạn?</li>
<li><strong>Đưa Ra Quyết Định 80%</strong>: Đưa ra quyết định "đủ tốt" hôm nay (thay vì theo đuổi 100% mãi mãi).</li>
</ol>
<hr />
<h2>Tự kiểm tra</h2>
<ul>
<li>✅ Tôi hiểu tê liệt phân tích và nó hoạt động như thế nào.</li>
<li>✅ Tôi biết cách xây dựng và điền ma trận quyết định.</li>
<li>✅ Tôi có ba loại quyết định và biết bao nhiêu phân tích mỗi loại nhận được.</li>
<li>✅ Tôi biết cách tích hợp các yếu tố cảm xúc với quyết định "thông tin" của tôi.</li>
<li>✅ Tôi hiểu sự khác biệt giữa "đủ tốt" và "tối ưu".</li>
<li>✅ Tôi đã đưa ra quyết định 80% hôm nay.</li>
</ul>`,
    emailSubject: 'Năng suất 2026 – Ngày 13: Khung Quy Trình Ra Quyết Định',
    emailBody: `<h1>Năng suất 2026 – Ngày 13</h1>
<h2>Khung Quy Trình Ra Quyết Định: Quyết Định Nhanh, Ma Trận Quyết Định, Tránh Tê Liệt Phân Tích</h2>
<p><em>Một quyết định tồi hôm nay tốt hơn một quyết định hoàn hảo không bao giờ được đưa ra.</em></p>
<p>Hôm nay bạn sẽ học cách thoát khỏi bẫy phân tích và đưa ra quyết định được thông báo nhanh chóng. Tê liệt phân tích là một trong những kẻ thù lớn nhất của năng suất: quá nhiều tùy chọn, quá nhiều thông tin, vì vậy bạn không bao giờ quyết định.</p>
<p><strong>Giải pháp</strong>: Ma trận quyết định, quy tắc nhanh và khái niệm "đủ tốt".</p>
<p><a href="{{APP_URL}}/vi/courses/${COURSE_ID_BASE}_VI/day/13">Mở bài học →</a></p>`
  },
  id: {
    title: 'Kerangka Pengambilan Keputusan: Keputusan Cepat, Matriks Keputusan, Menghindari Kelumpuhan Analisis',
    content: `<h1>Kerangka Pengambilan Keputusan: Keputusan Cepat, Matriks Keputusan, Menghindari Kelumpuhan Analisis</h1>
<p><em>Keputusan buruk hari ini lebih baik daripada keputusan sempurna yang tidak pernah diambil.</em></p>
<hr />
<h2>Tujuan Pembelajaran</h2>
<ul>
<li>Memahami mengapa kelebihan beban analisis menciptakan jebakan produktivitas.</li>
<li>Menerapkan metode matriks keputusan berdasarkan kepentingan dan risiko.</li>
<li>Tentukan aturan keputusan cepat untuk pertanyaan kecil dan sedang penting.</li>
<li>Kenali faktor emosional dalam keputusan dan mengaturnya.</li>
<li>Terapkan konsep "cukup baik" untuk mengurangi penundaan.</li>
</ul>
<hr />
<h2>Mengapa Ini Penting</h2>
<ul>
<li><strong>Kelumpuhan Analisis</strong>: Terlalu banyak informasi dan opsi mengarah pada penundaan. Sebagian besar keputusan tidak memerlukan informasi yang sempurna.</li>
<li><strong>Waktu Lebih Mahal Dari Kesempurnaan</strong>: Dibandingkan dengan menganalisis selama seminggu, membuat keputusan cepat dan memperbaikinya dalam sehari (jika perlu) jauh lebih murah.</li>
<li><strong>Produktivitas vs. Kesempurnaan</strong>: Solusi 80% hari ini mengungguli solusi 100% tidak pernah.</li>
<li><strong>Kelelahan Keputusan</strong>: Setiap keputusan mengkonsumsi sumber daya kognitif. Aturan dan kerangka mengurangi upaya.</li>
</ul>
<hr />
<h2>Penyelaman Mendalam</h2>
<h3>1. Kelumpuhan Analisis</h3>
<ul>
<li>Otak kami tidak menyukai ketidakpastian. Jadi terus mencari informasi lebih lanjut.</li>
<li>Informasi mengikuti pengembalian yang semakin berkurang: 5 potongan informasi pertama berharga 80%, 10 berikutnya hanya menambah 15% nilai baru.</li>
<li><strong>Solusi</strong>: Tentukan "batas informasi"—ketika Anda melewatinya, putuskan.</li>
</ul>
<h3>2. Matriks Keputusan</h3>
<ul>
<li>Alat sederhana untuk membandingkan opsi.</li>
<li><strong>Langkah 1</strong>: Baris = opsi (A, B, C). Kolom = kriteria (biaya, kualitas, waktu).</li>
<li><strong>Langkah 2</strong>: Bobot kriteria (satu 40%, yang lain 30%, dll.).</li>
<li><strong>Langkah 3</strong>: Nilai setiap opsi pada setiap kriteria (skala 1-5).</li>
<li><strong>Langkah 4</strong>: Kalikan skor dengan bobot, jumlahkan—total tertinggi menang.</li>
</ul>
<h3>3. Aturan Keputusan Cepat</h3>
<ul>
<li>Tidak semua keputusan sama. Tentukan tiga kategori:
<ul>
<li><strong>Kecil</strong> (dapat dibalik, <1 jam analisis): Putuskan segera, perbaiki nanti jika perlu.</li>
<li><strong>Sedang</strong> (setengah dapat dibalik, 1-2 jam analisis): Satu matriks keputusan, putuskan.</li>
<li><strong>Besar</strong> (sulit dibalik, 4+ jam analisis): Matriks keputusan + konsultasi + tidur.</li>
</ul>
</li>
</ul>
<h3>4. Faktor Emosional</h3>
<ul>
<li>Keputusan tidak pernah 100% rasional. Emosi mempengaruhi pilihan.</li>
<li><strong>Strategi</strong>: Nilai penilaian emosional Anda pada skala 1-10. Jika bertentangan dengan keputusan "informasi" Anda, beri waktu—intuisi mungkin mendeteksi informasi yang belum Anda artikulasikan.</li>
<li><strong>Pengecualian</strong>: Jika penilaian emosional Anda selaras dengan keputusan "informasi" Anda, validasikan.</li>
</ul>
<h3>5. Konsep "Cukup Baik"</h3>
<ul>
<li>"Optimal" sering kali adalah musuh "diperlukan".</li>
<li>Sebagian besar produk/solusi "cukup baik" secara fungsional, tetapi peningkatan emosional/kesempurnaan sangat mahal.</li>
<li><strong>Aturan</strong>: 80% pertama sudah cukup. 20% sisanya tidak hanya 5x lebih mahal—ROI Anda sudah menurun.</li>
</ul>
<hr />
<h2>Latihan Praktis (60 menit)</h2>
<ol>
<li><strong>Identifikasi Keputusan yang Ditunda</strong>: Pilih keputusan yang Anda tunda 1+ minggu. Daftarkan 3-4 opsi.</li>
<li><strong>Bangun Matriks Keputusan</strong>: 3-4 kriteria, 1-2 pembobotan. Nilai setiap opsi.</li>
<li><strong>Kategorikan</strong>: Apakah ini kecil, sedang, atau besar? Apa yang terjadi jika Anda memilih dengan salah?</li>
<li><strong>Penilaian Emosional</strong>: Tulis respons emosional Anda terhadap opsi terbaik. Bagaimana selarasnya dengan keputusan "informasi" Anda?</li>
<li><strong>Buat Keputusan 80%</strong>: Buat keputusan "cukup baik" hari ini (bukan mengejar 100% selamanya).</li>
</ol>
<hr />
<h2>Pemeriksaan Diri</h2>
<ul>
<li>✅ Saya memahami kelumpuhan analisis dan cara kerjanya.</li>
<li>✅ Saya tahu cara membangun dan mengisi matriks keputusan.</li>
<li>✅ Saya memiliki tiga kategori keputusan dan tahu berapa banyak analisis yang didapatkan setiap tipe.</li>
<li>✅ Saya tahu cara mengintegrasikan faktor emosional dengan keputusan "informasi" saya.</li>
<li>✅ Saya memahami perbedaan antara "cukup baik" dan "optimal".</li>
<li>✅ Saya membuat keputusan 80% hari ini.</li>
</ul>`,
    emailSubject: 'Produktivitas 2026 – Hari 13: Kerangka Pengambilan Keputusan',
    emailBody: `<h1>Produktivitas 2026 – Hari 13</h1>
<h2>Kerangka Pengambilan Keputusan: Keputusan Cepat, Matriks Keputusan, Menghindari Kelumpuhan Analisis</h2>
<p><em>Keputusan buruk hari ini lebih baik daripada keputusan sempurna yang tidak pernah diambil.</em></p>
<p>Hari ini Anda akan belajar menghindari jebakan analitik dan membuat keputusan berdasarkan informasi dengan cepat. Kelumpuhan analisis adalah salah satu musuh terbesar produktivitas: terlalu banyak opsi, terlalu banyak informasi, jadi Anda tidak pernah memutuskan.</p>
<p><strong>Solusi</strong>: Matriks keputusan, aturan cepat, dan konsep "cukup baik".</p>
<p><a href="{{APP_URL}}/id/courses/${COURSE_ID_BASE}_ID/day/13">Buka pelajaran →</a></p>`
  },
  ar: {
    title: 'أطر اتخاذ القرار: القرارات السريعة، مصفوفة القرار، تجنب شلل التحليل',
    content: `<h1>أطر اتخاذ القرار: القرارات السريعة، مصفوفة القرار، تجنب شلل التحليل</h1>
<p><em>قرار سيء اليوم أفضل من قرار مثالي لم يتم اتخاذه أبداً.</em></p>
<hr />
<h2>أهداف التعلم</h2>
<ul>
<li>فهم سبب أدى الإفراط في التحليل إلى مصائد الإنتاجية.</li>
<li>تطبيق طريقة مصفوفة القرار بناءً على الأهمية والمخاطر.</li>
<li>تحديد قواعد القرار السريع للأسئلة الصغيرة والمتوسطة الأهمية.</li>
<li>التعرف على العوامل العاطفية في القرارات وتنظيمها.</li>
<li>تطبيق مفهوم "جيد بما فيه الكفاية" لتقليل التأجيل.</li>
</ul>
<hr />
<h2>لماذا هذا مهم</h2>
<ul>
<li><strong>شلل التحليل</strong>: الكثير من المعلومات والخيارات تؤدي إلى التأجيل. معظم القرارات لا تتطلب معلومات مثالية.</li>
<li><strong>الوقت أغلى من الكمال</strong>: مقارنة بتحليل لمدة أسبوع، اتخاذ قرار سريع وتصحيحه في يوم واحد (إذا لزم الأمر) أرخص بكثير.</li>
<li><strong>الإنتاجية مقابل الكمال</strong>: حل بنسبة 80% اليوم يتفوق على حل بنسبة 100% أبداً.</li>
<li><strong>إرهاق القرار</strong>: كل قرار يستهلك الموارد المعرفية. تقلل القواعد والأطر الجهد.</li>
</ul>
<hr />
<h2>الغوص العميق</h2>
<h3>1. شلل التحليل</h3>
<ul>
<li>دماغنا لا يحب عدم اليقين. لذلك يبحث باستمرار عن المزيد من المعلومات.</li>
<li>المعلومات تتبع العوائد المتناقصة: أول 5 قطع معلومات بقيمة 80%، و 10 قطع التالية فقط تضيف 15% من القيمة الجديدة.</li>
<li><strong>الحل</strong>: حدد "حد المعلومات"—عندما تعبرها، تقرر.</li>
</ul>
<h3>2. مصفوفة القرار</h3>
<ul>
<li>أداة بسيطة لمقارنة الخيارات.</li>
<li><strong>الخطوة 1</strong>: الصفوف = الخيارات (A, B, C). الأعمدة = المعايير (التكلفة والجودة والوقت).</li>
<li><strong>الخطوة 2</strong>: وزن المعايير (واحد 40%، وآخر 30%، إلخ).</li>
<li><strong>الخطوة 3</strong>: درجة كل خيار على كل معيار (مقياس 1-5).</li>
<li><strong>الخطوة 4</strong>: اضرب الدرجات في الأوزان، أضفها—المجموع الأعلى يفوز.</li>
</ul>
<h3>3. قواعد القرار السريع</h3>
<ul>
<li>ليس كل القرارات متساوية. حدد ثلاث فئات:
<ul>
<li><strong>صغير</strong> (قابل للعكس، <1 ساعة تحليل): قرر على الفور، أصلح لاحقاً إذا لزم الأمر.</li>
<li><strong>متوسط</strong> (نصف قابل للعكس، 1-2 ساعة تحليل): مصفوفة قرار واحدة، قرر.</li>
<li><strong>كبير</strong> (يصعب عكسه، 4+ ساعات تحليل): مصفوفة قرار + استشارة + نوم.</li>
</ul>
</li>
</ul>
<h3>4. العوامل العاطفية</h3>
<ul>
<li>القرارات ليست أبداً 100% منطقية. تؤثر العواطف على الاختيار.</li>
<li><strong>الإستراتيجية</strong>: قيّم حكمك العاطفي على مقياس 1-10. إذا تعارض مع قرار "المعلومات" الخاص بك، أعطه وقتاً—قد تكتشف الحدس معلومات لم تصرح بها.</li>
<li><strong>الاستثناء</strong>: إذا تطابق الحكم العاطفي الخاص بك مع قرار "المعلومات" الخاص بك، فتحقق منه.</li>
</ul>
<h3>5. مفهوم "جيد بما فيه الكفاية"</h3>
<ul>
<li>"الأمثل" غالباً ما يكون عدو "الضروري".</li>
<li>معظم المنتجات/الحلول "جيدة بما فيه الكفاية" وظيفياً، لكن تحسينات عاطفية/كاملة غير مكلفة.</li>
<li><strong>القاعدة</strong>: أول 80% كافٍ. الـ 20% المتبقية ليست مكلفة 5 مرات فقط—عائد استثمارك بالفعل في الانخفاض.</li>
</ul>
<hr />
<h2>تمرين عملي (60 دقيقة)</h2>
<ol>
<li><strong>تحديد قرار مؤجل</strong>: اختر قراراً أرجأته لمدة 1+ أسبوع. اذكر 3-4 خيارات.</li>
<li><strong>بناء مصفوفة القرار</strong>: 3-4 معايير، 1-2 وزن. درجة كل خيار.</li>
<li><strong>تصنيفها</strong>: هل هذا صغير أم متوسط أم كبير؟ ماذا يحدث إذا اخترت خطأ?</li>
<li><strong>الحكم العاطفي</strong>: اكتب ردك العاطفي على الخيار الأفضل. كيف يتوافق مع قرار "المعلومات" الخاص بك?</li>
<li><strong>اتخذ قرار 80%</strong>: اتخذ قرار "جيد بما فيه الكفاية" اليوم (بدلاً من السعي وراء 100% إلى الأبد).</li>
</ol>
<hr />
<h2>الفحص الذاتي</h2>
<ul>
<li>✅ أفهم شلل التحليل وكيف يعمل.</li>
<li>✅ أعرف كيفية بناء ومحء مصفوفة القرار.</li>
<li>✅ لدي ثلاث فئات قرار وأعرف مقدار التحليل الذي يحصل عليه كل نوع.</li>
<li>✅ أعرف كيفية دمج العوامل العاطفية مع قرار "المعلومات" الخاص بي.</li>
<li>✅ أفهم الفرق بين "جيد بما فيه الكفاية" و "الأمثل".</li>
<li>✅ اتخذت قرار 80% اليوم.</li>
</ul>`,
    emailSubject: 'الإنتاجية 2026 – اليوم 13: أطر اتخاذ القرار',
    emailBody: `<h1>الإنتاجية 2026 – اليوم 13</h1>
<h2>أطر اتخاذ القرار: القرارات السريعة، مصفوفة القرار، تجنب شلل التحليل</h2>
<p><em>قرار سيء اليوم أفضل من قرار مثالي لم يتم اتخاذه أبداً.</em></p>
<p>اليوم ستتعلم كيفية تجنب مصائد التحليل واتخاذ قرارات مستنيرة بسرعة. شلل التحليل هو أحد أعظم أعداء الإنتاجية: الكثير من الخيارات، والكثير من المعلومات، لذلك لا تقرر أبداً.</p>
<p><strong>الحل</strong>: مصفوفة القرار والقواعس السريعة ومفهوم "جيد بما فيه الكفاية".</p>
<p><a href="{{APP_URL}}/ar/courses/${COURSE_ID_BASE}_AR/day/13">افتح الدرس →</a></p>`
  },
  pt: {
    title: 'Estruturas de Tomada de Decisão: Decisões Rápidas, Matriz de Decisão, Evitando Paralisia de Análise',
    content: `<h1>Estruturas de Tomada de Decisão: Decisões Rápidas, Matriz de Decisão, Evitando Paralisia de Análise</h1>
<p><em>Uma decisão ruim hoje é melhor que uma decisão perfeita nunca tomada.</em></p>
<hr />
<h2>Objetivos de Aprendizado</h2>
<ul>
<li>Entender por que a sobrecarga de análise cria armadilhas de produtividade.</li>
<li>Aplicar o método de matriz de decisão com base em importância e risco.</li>
<li>Definir regras de decisão rápida para questões de pequena e média importância.</li>
<li>Reconhecer fatores emocionais em decisões e regulá-los.</li>
<li>Aplicar o conceito "bom o suficiente" para reduzir a procrastinação.</li>
</ul>
<hr />
<h2>Por que isso é importante</h2>
<ul>
<li><strong>Paralisia de Análise</strong>: Muita informação e opções levam à procrastinação. A maioria das decisões não requer informações perfeitas.</li>
<li><strong>Tempo é Mais Caro que a Perfeição</strong>: Comparado a analisar por uma semana, tomar uma decisão rápida e corrigi-la em um dia (se necessário) é muito mais barato.</li>
<li><strong>Produtividade vs. Perfeição</strong>: Uma solução 80% hoje supera uma solução 100% nunca.</li>
<li><strong>Fadiga de Decisão</strong>: Cada decisão consome recursos cognitivos. Regras e estruturas reduzem o esforço.</li>
</ul>
<hr />
<h2>Mergulho Profundo</h2>
<h3>1. Paralisia de Análise</h3>
<ul>
<li>Nosso cérebro não gosta de incerteza. Então ele continuamente busca mais informações.</li>
<li>A informação segue retornos decrescentes: as primeiras 5 informações valem 80%, as próximas 10 adicionam apenas 15% de novo valor.</li>
<li><strong>Solução</strong>: Defina um "limite de informação"—quando você ultrapassá-lo, decida.</li>
</ul>
<h3>2. Matriz de Decisão</h3>
<ul>
<li>Uma ferramenta simples para comparar opções.</li>
<li><strong>Passo 1</strong>: Linhas = opções (A, B, C). Colunas = critérios (custo, qualidade, tempo).</li>
<li><strong>Passo 2</strong>: Pese os critérios (um 40%, outro 30%, etc.).</li>
<li><strong>Passo 3</strong>: Avalie cada opção em cada critério (escala 1-5).</li>
<li><strong>Passo 4</strong>: Multiplique os escores pelos pesos, some-os—o total mais alto vence.</li>
</ul>
<h3>3. Regras de Decisão Rápida</h3>
<ul>
<li>Nem todas as decisões são iguais. Defina três categorias:
<ul>
<li><strong>Pequena</strong> (reversível, <1 hora análise): Decida imediatamente, corrija depois se necessário.</li>
<li><strong>Média</strong> (meio reversível, 1-2 horas análise): Uma matriz de decisão, decida.</li>
<li><strong>Grande</strong> (difícil reverter, 4+ horas análise): Matriz de decisão + conselho + durma.</li>
</ul>
</li>
</ul>
<h3>4. Fatores Emocionais</h3>
<ul>
<li>As decisões nunca são 100% racionais. As emoções influenciam a escolha.</li>
<li><strong>Estratégia</strong>: Avalie seu julgamento emocional em uma escala 1-10. Se ele conflitar com sua decisão "informada", dê-lhe tempo—a intuição pode estar detectando informações que você não articulou.</li>
<li><strong>Exceção</strong>: Se seu julgamento emocional se alinhar com sua decisão "informada", valide-a.</li>
</ul>
<h3>5. Conceito "Bom o Suficiente"</h3>
<ul>
<li>"Ótimo" geralmente é o inimigo do "necessário".</li>
<li>A maioria dos produtos/soluções é "bom o suficiente" funcionalmente, mas melhorias emocionais/perfeitas são infinitamente caras.</li>
<li><strong>Regra</strong>: Os primeiros 80% são suficientes. Os 20% restantes não são apenas 5x mais caros—seu retorno já está diminuindo.</li>
</ul>
<hr />
<h2>Exercício Prático (60 minutos)</h2>
<ol>
<li><strong>Identifique uma Decisão Adiada</strong>: Escolha uma decisão que você adiou 1+ semanas. Liste 3-4 opções.</li>
<li><strong>Construa uma Matriz de Decisão</strong>: 3-4 critérios, 1-2 pesos. Avalie cada opção.</li>
<li><strong>Categorize</strong>: Isto é pequeno, médio ou grande? O que acontece se você escolher errado?</li>
<li><strong>Julgamento Emocional</strong>: Escreva sua resposta emocional à melhor opção. Como ela se alinha com sua decisão "informada"?</li>
<li><strong>Tome a Decisão 80%</strong>: Tome a decisão "bom o suficiente" hoje (em vez de perseguir 100% para sempre).</li>
</ol>
<hr />
<h2>Autoavaliação</h2>
<ul>
<li>✅ Entendo a paralisia de análise e como funciona.</li>
<li>✅ Sei como construir e preencher uma matriz de decisão.</li>
<li>✅ Tenho três categorias de decisão e sei quanto cada tipo recebe de análise.</li>
<li>✅ Sei como integrar fatores emocionais com minha decisão "informada".</li>
<li>✅ Entendo a diferença entre "bom o suficiente" e "ótimo".</li>
<li>✅ Tomei uma decisão 80% hoje.</li>
</ul>`,
    emailSubject: 'Produtividade 2026 – Dia 13: Estruturas de Tomada de Decisão',
    emailBody: `<h1>Produtividade 2026 – Dia 13</h1>
<h2>Estruturas de Tomada de Decisão: Decisões Rápidas, Matriz de Decisão, Evitando Paralisia de Análise</h2>
<p><em>Uma decisão ruim hoje é melhor que uma decisão perfeita nunca tomada.</em></p>
<p>Hoje você aprenderá a escapar de armadilhas analíticas e tomar decisões informadas rapidamente. A paralisia de análise é um dos maiores inimigos da produtividade: muitas opções, muita informação, então você nunca decide.</p>
<p><strong>A solução</strong>: Matriz de decisão, regras rápidas e o conceito "bom o suficiente".</p>
<p><a href="{{APP_URL}}/pt/courses/${COURSE_ID_BASE}_PT/day/13">Abra a lição →</a></p>`
  },
  hi: {
    title: 'निर्णय लेने की रूपरेखा: तेजी से निर्णय, निर्णय मैट्रिक्स, विश्लेषण पक्षाघात से बचें',
    content: `<h1>निर्णय लेने की रूपरेखा: तेजी से निर्णय, निर्णय मैट्रिक्स, विश्लेषण पक्षाघात से बचें</h1>
<p><em>आज का खराब निर्णय कभी नहीं लिया गया आदर्श निर्णय से बेहतर है।</em></p>
<hr />
<h2>सीखने के उद्देश्य</h2>
<ul>
<li>समझें कि विश्लेषण अधिभार उत्पादकता में फंसे क्यों बनाता है।</li>
<li>महत्व और जोखिम के आधार पर निर्णय मैट्रिक्स विधि लागू करें।</li>
<li>छोटे और मध्यम महत्व के प्रश्नों के लिए तेजी से निर्णय नियम परिभाषित करें।</li>
<li>निर्णयों में भावनात्मक कारकों को पहचानें और उन्हें नियंत्रित करें।</li>
<li>विलंब को कम करने के लिए "पर्याप्त अच्छा" अवधारणा लागू करें।</li>
</ul>
<hr />
<h2>यह महत्वपूर्ण क्यों है</h2>
<ul>
<li><strong>विश्लेषण पक्षाघात</strong>: बहुत अधिक जानकारी और विकल्प विलंब की ओर ले जाते हैं। अधिकांश निर्णयों को आदर्श जानकारी की आवश्यकता नहीं है।</li>
<li><strong>समय पूर्णता से अधिक महंगा है</strong>: एक सप्ताह के विश्लेषण की तुलना में, तेजी से निर्णय लेना और एक दिन में सुधार करना (यदि आवश्यक हो) बहुत सस्ता है।</li>
<li><strong>उत्पादकता बनाम पूर्णता</strong>: आज का 80% समाधान कभी नहीं लिया गया 100% समाधान को मात देता है।</li>
<li><strong>निर्णय थकान</strong>: प्रत्येक निर्णय संज्ञानात्मक संसाधनों का उपभोग करता है। नियम और ढांचे प्रयास को कम करते हैं।</li>
</ul>
<hr />
<h2>गहरी गोताखोरी</h2>
<h3>1. विश्लेषण पक्षाघात</h3>
<ul>
<li>हमारा दिमाग अनिश्चितता पसंद नहीं करता। तो यह लगातार अधिक जानकारी चाहता है।</li>
<li>जानकारी घटती हुई रिटर्न का पालन करती है: पहली 5 जानकारी 80% मूल्यवान है, अगली 10 केवल 15% नया मूल्य जोड़ते हैं।</li>
<li><strong>समाधान</strong>: एक "सूचना सीमा" परिभाषित करें—जब आप इसे पार करते हैं, तो निर्णय लें।</li>
</ul>
<h3>2. निर्णय मैट्रिक्स</h3>
<ul>
<li>विकल्पों की तुलना करने के लिए एक सरल उपकरण।</li>
<li><strong>चरण 1</strong>: पंक्तियां = विकल्प (A, B, C)। कॉलम = मानदंड (लागत, गुणवत्ता, समय)।</li>
<li><strong>चरण 2</strong>: मानदंड को तौलें (एक 40%, दूसरा 30%, आदि)।</li>
<li><strong>चरण 3</strong>: प्रत्येक मानदंड पर प्रत्येक विकल्प का मूल्यांकन करें (1-5 पैमाने पर)।</li>
<li><strong>चरण 4</strong>: स्कोर को वजन से गुणा करें, जोड़ें—सबसे अधिक जीतता है।</li>
</ul>
<h3>3. तेजी से निर्णय नियम</h3>
<ul>
<li>सभी निर्णय बराबर नहीं हैं। तीन श्रेणियां परिभाषित करें:
<ul>
<li><strong>छोटा</strong> (उलट किया जा सकता है, <1 घंटा विश्लेषण): तुरंत निर्णय लें, बाद में ठीक करें यदि आवश्यक हो।</li>
<li><strong>मध्यम</strong> (आधा उलट सकते हैं, 1-2 घंटा विश्लेषण): एक निर्णय मैट्रिक्स, निर्णय लें।</li>
<li><strong>बड़ा</strong> (उलट करना कठिन, 4+ घंटा विश्लेषण): निर्णय मैट्रिक्स + सलाह + सो।</li>
</ul>
</li>
</ul>
<h3>4. भावनात्मक कारक</h3>
<ul>
<li>निर्णय कभी 100% तर्कसंगत नहीं होते हैं। भावनाएं पसंद को प्रभावित करती हैं।</li>
<li><strong>रणनीति</strong>: अपने भावनात्मक निर्णय को 1-10 पैमाने पर रेट करें। यदि यह आपके "सूचना" निर्णय से टकराता है, तो इसे समय दें—अंतर्ज्ञान उन जानकारी का पता लगा सकता है जिन्हें आपने स्पष्ट नहीं किया है।</li>
<li><strong>अपवाद</strong>: यदि आपका भावनात्मक निर्णय आपके "सूचना" निर्णय के साथ संरेखित है, तो इसे मान्य करें।</li>
</ul>
<h3>5. "पर्याप्त अच्छा" अवधारणा</h3>
<ul>
<li>"इष्टतम" अक्सर "आवश्यक" का दुश्मन होता है।</li>
<li>अधिकांश उत्पाद/समाधान कार्यात्मक रूप से "पर्याप्त अच्छे" हैं, लेकिन भावनात्मक/पूर्णता सुधार अनंत रूप से महंगे हैं।</li>
<li><strong>नियम</strong>: पहले 80% पर्याप्त हैं। शेष 20% न केवल 5 गुना अधिक महंगा है—आपका निवेश पर रिटर्न पहले से ही घट रहा है।</li>
</ul>
<hr />
<h2>व्यावहारिक व्यायाम (60 मिनट)</h2>
<ol>
<li><strong>स्थगित निर्णय की पहचान करें</strong>: ऐसा निर्णय चुनें जिसे आपने 1+ सप्ताह के लिए स्थगित किया है। 3-4 विकल्प सूचीबद्ध करें।</li>
<li><strong>निर्णय मैट्रिक्स बनाएं</strong>: 3-4 मानदंड, 1-2 भार। प्रत्येक विकल्प का मूल्यांकन करें।</li>
<li><strong>इसे वर्गीकृत करें</strong>: क्या यह छोटा, मध्यम या बड़ा है? अगर आप गलत चुनें तो क्या होगा?</li>
<li><strong>भावनात्मक निर्णय</strong>: सर्वोत्तम विकल्प के लिए अपनी भावनात्मक प्रतिक्रिया लिखें। यह आपके "सूचना" निर्णय के साथ कैसे जुड़ता है?</li>
<li><strong>80% निर्णय लें</strong>: आज "पर्याप्त अच्छा" निर्णय लें (हमेशा के लिए 100% का पीछा करने के बजाय)।</li>
</ol>
<hr />
<h2>आत्म-जांच</h2>
<ul>
<li>✅ मैं विश्लेषण पक्षाघात को समझता हूं और यह कैसे काम करता है।</li>
<li>✅ मैं जानता हूं कि निर्णय मैट्रिक्स कैसे बनाया और भरा जाए।</li>
<li>✅ मेरे पास तीन निर्णय श्रेणियां हैं और मैं जानता हूं कि प्रत्येक प्रकार को कितना विश्लेषण मिलता है।</li>
<li>✅ मैं जानता हूं कि भावनात्मक कारकों को अपने "सूचना" निर्णय के साथ कैसे एकीकृत करना है।</li>
<li>✅ मैं "पर्याप्त अच्छा" और "इष्टतम" के बीच अंतर को समझता हूं।</li>
<li>✅ मैंने आज 80% निर्णय लिया।</li>
</ul>`,
    emailSubject: 'उत्पादकता 2026 – दिन 13: निर्णय लेने की रूपरेखा',
    emailBody: `<h1>उत्पादकता 2026 – दिन 13</h1>
<h2>निर्णय लेने की रूपरेखा: तेजी से निर्णय, निर्णय मैट्रिक्स, विश्लेषण पक्षाघात से बचें</h2>
<p><em>आज का खराब निर्णय कभी नहीं लिया गया आदर्श निर्णय से बेहतर है।</em></p>
<p>आज आप विश्लेषण पर्स से बचना और तेजी से सूचित निर्णय लेना सीखेंगे। विश्लेषण पक्षाघात उत्पादकता के सबसे बड़े दुश्मनों में से एक है: बहुत सारे विकल्प, बहुत सारी जानकारी, इसलिए आप कभी निर्णय नहीं लेते हैं।</li>
<p><strong>समाधान</strong>: निर्णय मैट्रिक्स, तेजी से नियम, और "पर्याप्त अच्छा" अवधारणा।</p>
<p><a href="{{APP_URL}}/hi/courses/${COURSE_ID_BASE}_HI/day/13">पाठ खोलें →</a></p>`
  }
};

// QUIZ 13 - High quality quiz questions with proper 4 options
const QUIZ_13: Record<string, any[]> = {
  hu: [
    {
      q: 'Mi az "elemzési bénultság"?',
      opts: ['Túl gyors döntéshozatal', 'Túl sok információ és opció miatt nem döntenek', 'Az első option választása', 'Csak oktatott emberek számára'],
      correct: 1
    },
    {
      q: 'Hány óra szükséges az elemzéshez egy "nagy" döntéshez?',
      opts: ['Kevesebb mint 1 óra', '1-2 óra', '4+ óra', 'Nincs különbség'],
      correct: 2
    },
    {
      q: 'Mit jelent a "80-20" szabály a döntéshozatalban?',
      opts: ['A termékenység 80%-a 20%-ból jön', 'Az első 80% jó, a maradék 20% végtelen drága', 'Mindig várd meg 80 nap analízist', 'A döntések 80%-a hibás'],
      correct: 1
    },
    {
      q: 'Mely kategóriában dönthetsz azonnal azonnali javítást megengedve?',
      opts: ['Nagy döntések', 'Közepesen fontos döntések', 'Kis döntések', 'Soha nem szabad azonnal dönteni'],
      correct: 2
    },
    {
      q: 'Mit kell tenni, ha az érzelmi hükmed az informált döntéseddel ellentétes?',
      opts: ['Feledj az érzelmedről', 'Kövesd csak az érzelmedet', 'Adj időt az intuitiónak, lehet információt detektál', 'Fordítsd meg a döntést'],
      correct: 2
    }
  ],
  en: [
    {
      q: 'What is "analysis paralysis"?',
      opts: ['Deciding too quickly', 'Too much information and options prevent deciding', 'Choosing the first option', 'Only for educated people'],
      correct: 1
    },
    {
      q: 'How many hours to analyze a "large" decision?',
      opts: ['Less than 1 hour', '1-2 hours', '4+ hours', 'No difference'],
      correct: 2
    },
    {
      q: 'What does the "80-20 rule" mean in decision-making?',
      opts: ['80% of productivity comes from 20%', 'First 80% is good, remaining 20% is infinitely expensive', 'Always wait 80 days to analyze', '80% of decisions are wrong'],
      correct: 1
    },
    {
      q: 'In which category can you decide immediately, allowing fixes later?',
      opts: ['Large decisions', 'Medium decisions', 'Small decisions', 'Never decide immediately'],
      correct: 2
    },
    {
      q: 'What to do if your emotional judgment conflicts with your informed decision?',
      opts: ['Forget your emotion', 'Follow only your emotion', 'Give time to intuition—it may be detecting information', 'Reverse the decision'],
      correct: 2
    }
  ],
  tr: [
    {
      q: 'Analiz felçi nedir?',
      opts: ['Çok hızlı karar verme', 'Çok fazla bilgi ve seçenek kararı engelle', 'İlk seçeneği seçme', 'Sadece eğitimli insanlar için'],
      correct: 1
    },
    {
      q: '"Büyük" bir karar için kaç saat analiz yapılır?',
      opts: ['1 saatten az', '1-2 saat', '4+ saat', 'Fark yok'],
      correct: 2
    },
    {
      q: 'Karar vermede "80-20 kuralı" ne anlama gelir?',
      opts: ['Verimlilik %80si %20den gelir', 'İlk %80 iyidir, kalan %20 sonsuz derecede pahalıdır', 'Her zaman 80 gün analizini bekle', 'Kararların %80si yanlıştır'],
      correct: 1
    },
    {
      q: 'Hangi kategoride derhal karar verebilir ve sonra düzeltmeye izin verirsin?',
      opts: ['Büyük kararlar', 'Orta kararlar', 'Küçük kararlar', 'Hiçbir zaman hemen karar verme'],
      correct: 2
    },
    {
      q: 'Duygusal yargın bilgilendirilmiş karar ile çelişirse ne yapmalısın?',
      opts: ['Duygunu unut', 'Sadece duygunu takip et', 'Sezgiye zaman ver—bilgi tespit ediyor olabilir', 'Kararı ters çevir'],
      correct: 2
    }
  ],
  bg: [
    {
      q: 'Какво е "анализна парализа"?',
      opts: ['Прекалено бързо вземане на решение', 'Твърде много информация и опции запъчиват решение', 'Избор на първата опция', 'Само за образовани хора'],
      correct: 1
    },
    {
      q: 'Колко часа за анализ на "голямо" решение?',
      opts: ['По-малко от 1 час', '1-2 часа', '4+ часа', 'Няма разлика'],
      correct: 2
    },
    {
      q: 'Какво означава "80-20 правило" при вземане на решения?',
      opts: ['80% на производителност идва от 20%', 'Първи 80% е добро, останалите 20% е безкрайно скъпо', 'Винаги чакай 80 дни анализ', '80% на решенията са грешни'],
      correct: 1
    },
    {
      q: 'В каква категория можеш веднага вземане решение, позволявайки по-късна корекция?',
      opts: ['Голями решения', 'Средни решения', 'Малки решения', 'Никога не вземай решение веднага'],
      correct: 2
    },
    {
      q: 'Какво да направиш, ако твоя емоционален преценка се противопоставя на информационната?',
      opts: ['Забрави емоцията', 'Следвай само емоцията', 'Отдели време на интуицията—тя може детектира информация', 'Обърни решението'],
      correct: 2
    }
  ],
  pl: [
    {
      q: 'Czym jest "paraliż analizy"?',
      opts: ['Zbyt szybkie podejmowanie decyzji', 'Zbyt dużo informacji i opcji uniemożliwia decyzje', 'Wybór pierwszej opcji', 'Tylko dla wykształconych ludzi'],
      correct: 1
    },
    {
      q: 'Ile godzin analizy na "dużą" decyzję?',
      opts: ['Mniej niż 1 godzina', '1-2 godziny', '4+ godziny', 'Brak różnicy'],
      correct: 2
    },
    {
      q: 'Co oznacza "reguła 80-20" w podejmowaniu decyzji?',
      opts: ['80% produktywności pochodzi z 20%', 'Pierwsze 80% jest dobre, pozostałe 20% jest nieskończenie drogie', 'Zawsze czekaj 80 dni na analizę', '80% decyzji jest błędnych'],
      correct: 1
    },
    {
      q: 'W którą kategorię możesz natychmiast podjąć decyzję, pozwalając na poprawę?',
      opts: ['Duże decyzje', 'Średnie decyzje', 'Małe decyzje', 'Nigdy nie podejmuj decyzji natychmiast'],
      correct: 2
    },
    {
      q: 'Co zrobić, jeśli twój osąd emocjonalny jest w konflikcie z informacyjną decyzją?',
      opts: ['Zapomnij emocję', 'Śledź tylko emocję', 'Daj czas intuicji—może detektować informacje', 'Odwróć decyzję'],
      correct: 2
    }
  ],
  vi: [
    {
      q: 'Tê liệt phân tích là gì?',
      opts: ['Quyết định quá nhanh', 'Quá nhiều thông tin và tùy chọn ngăn không quyết định', 'Chọn tùy chọn đầu tiên', 'Chỉ dành cho người có giáo dục'],
      correct: 1
    },
    {
      q: 'Bao nhiêu giờ phân tích cho một quyết định "lớn"?',
      opts: ['Dưới 1 giờ', '1-2 giờ', '4+ giờ', 'Không có sự khác biệt'],
      correct: 2
    },
    {
      q: '"Quy tắc 80-20" có nghĩa là gì trong quyết định?',
      opts: ['80% năng suất đến từ 20%', '80% đầu tiên tốt, 20% còn lại vô cùng đắt', 'Luôn chờ 80 ngày phân tích', '80% quyết định là sai'],
      correct: 1
    },
    {
      q: 'Trong danh mục nào bạn có thể quyết định ngay lập tức, cho phép sửa chữa sau này?',
      opts: ['Quyết định lớn', 'Quyết định trung bình', 'Quyết định nhỏ', 'Không bao giờ quyết định ngay lập tức'],
      correct: 2
    },
    {
      q: 'Phải làm gì nếu phán xét cảm xúc của bạn xung đột với quyết định được thông báo?',
      opts: ['Quên cảm xúc', 'Chỉ theo dõi cảm xúc', 'Cho thời gian cho trực giác—nó có thể phát hiện thông tin', 'Đảo ngược quyết định'],
      correct: 2
    }
  ],
  id: [
    {
      q: 'Apa itu "kelumpuhan analisis"?',
      opts: ['Keputusan terlalu cepat', 'Terlalu banyak informasi dan opsi mencegah keputusan', 'Memilih opsi pertama', 'Hanya untuk orang berpendidikan'],
      correct: 1
    },
    {
      q: 'Berapa jam analisis untuk keputusan "besar"?',
      opts: ['Kurang dari 1 jam', '1-2 jam', '4+ jam', 'Tidak ada perbedaan'],
      correct: 2
    },
    {
      q: 'Apa arti "aturan 80-20" dalam pengambilan keputusan?',
      opts: ['80% produktivitas berasal dari 20%', '80% pertama bagus, 20% sisanya sangat mahal', 'Selalu tunggu analisis 80 hari', '80% keputusan salah'],
      correct: 1
    },
    {
      q: 'Dalam kategori apa Anda dapat memutuskan segera, memungkinkan perbaikan nanti?',
      opts: ['Keputusan besar', 'Keputusan sedang', 'Keputusan kecil', 'Tidak pernah memutuskan segera'],
      correct: 2
    },
    {
      q: 'Apa yang harus dilakukan jika penilaian emosional Anda bertentangan dengan keputusan berdasarkan informasi?',
      opts: ['Lupakan emosi', 'Ikuti hanya emosi', 'Berikan waktu untuk intuisi—mungkin mendeteksi informasi', 'Balik keputusan'],
      correct: 2
    }
  ],
  ar: [
    {
      q: 'ما هي "شلل التحليل"؟',
      opts: ['اتخاذ قرار سريع جداً', 'الكثير من المعلومات والخيارات تمنع اتخاذ القرار', 'اختيار الخيار الأول', 'فقط للأشخاص المتعلمين'],
      correct: 1
    },
    {
      q: 'كم ساعة تحليل لقرار "كبير"؟',
      opts: ['أقل من ساعة واحدة', '1-2 ساعة', '4+ ساعات', 'لا فرق'],
      correct: 2
    },
    {
      q: 'ماذا تعني "قاعدة 80-20" في اتخاذ القرار؟',
      opts: ['80% من الإنتاجية تأتي من 20%', '80% الأول جيد، 20% المتبقي مكلف بشكل لا نهائي', 'انتظر دائماً تحليل 80 يوماً', '80% من القرارات خاطئة'],
      correct: 1
    },
    {
      q: 'في أي فئة يمكنك أن تقرر على الفور، مما يسمح بالإصلاح لاحقاً؟',
      opts: ['قرارات كبيرة', 'قرارات متوسطة', 'قرارات صغيرة', 'لا تقرر أبداً على الفور'],
      correct: 2
    },
    {
      q: 'ماذا تفعل إذا كان حكمك العاطفي يتعارض مع القرار المستنير؟',
      opts: ['انسى العاطفة', 'اتبع العاطفة فقط', 'أعط الوقت للحدس—قد يكتشف معلومات', 'عكس القرار'],
      correct: 2
    }
  ],
  pt: [
    {
      q: 'O que é "paralisia de análise"?',
      opts: ['Decidir muito rápido', 'Muita informação e opções impedem a decisão', 'Escolher a primeira opção', 'Apenas para pessoas educadas'],
      correct: 1
    },
    {
      q: 'Quantas horas de análise para uma decisão "grande"?',
      opts: ['Menos de 1 hora', '1-2 horas', '4+ horas', 'Sem diferença'],
      correct: 2
    },
    {
      q: 'O que significa a "regra 80-20" na tomada de decisão?',
      opts: ['80% da produtividade vem de 20%', '80% primeiro é bom, 20% restante é infinitamente caro', 'Sempre espere 80 dias de análise', '80% das decisões estão erradas'],
      correct: 1
    },
    {
      q: 'Em qual categoria você pode decidir imediatamente, permitindo correções depois?',
      opts: ['Decisões grandes', 'Decisões médias', 'Decisões pequenas', 'Nunca decida imediatamente'],
      correct: 2
    },
    {
      q: 'O que fazer se seu julgamento emocional entra em conflito com a decisão informada?',
      opts: ['Esqueça a emoção', 'Siga apenas a emoção', 'Dê tempo à intuição—ela pode estar detectando informações', 'Reverta a decisão'],
      correct: 2
    }
  ],
  hi: [
    {
      q: 'विश्लेषण पक्षाघात क्या है?',
      opts: ['बहुत तेजी से निर्णय लेना', 'बहुत अधिक जानकारी और विकल्प निर्णय को रोकते हैं', 'पहला विकल्प चुनना', 'केवल शिक्षित लोगों के लिए'],
      correct: 1
    },
    {
      q: '"बड़े" निर्णय के लिए कितने घंटे विश्लेषण?',
      opts: ['1 घंटे से कम', '1-2 घंटे', '4+ घंटे', 'कोई अंतर नहीं'],
      correct: 2
    },
    {
      q: 'निर्णय लेने में "80-20 नियम" का क्या मतलब है?',
      opts: ['80% उत्पादकता 20% से आती है', 'पहले 80% अच्छे हैं, शेष 20% अनंत रूप से महंगे हैं', 'हमेशा 80 दिन विश्लेषण की प्रतीक्षा करें', '80% निर्णय गलत हैं'],
      correct: 1
    },
    {
      q: 'किस श्रेणी में आप तुरंत निर्णय ले सकते हैं, बाद में सुधार की अनुमति दे सकते हैं?',
      opts: ['बड़े निर्णय', 'मध्यम निर्णय', 'छोटे निर्णय', 'कभी तुरंत निर्णय न लें'],
      correct: 2
    },
    {
      q: 'अगर आपका भावनात्मक निर्णय सूचित निर्णय से संघर्ष करे तो क्या करें?',
      opts: ['भावनाओं को भूल जाएं', 'केवल भावनाओं का पालन करें', 'अंतर्ज्ञान को समय दें—यह जानकारी का पता लगा सकता है', 'निर्णय को उलट दें'],
      correct: 2
    }
  ]
};

async function seedDay13() {
  await connectDB();
  console.log('🌱 Day 13: Decision-Making Frameworks – Seeding with premium multilingual content...\n');

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
          lessonId: `${COURSE_ID_BASE}_${lang.toUpperCase()}_DAY_13`
        });
        if (existingLesson) {
          // Delete existing quiz for this lesson before recreating
          await QuizQuestion.deleteMany({ lessonId: existingLesson.lessonId });
          await Lesson.deleteOne({ _id: existingLesson._id });
        }

        const dayData = LESSON_13[lang];
        const lesson = new Lesson({
          lessonId: `${COURSE_ID_BASE}_${lang.toUpperCase()}_DAY_13`,
          courseId: course._id,
          dayNumber: 13,
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
        const quizData = QUIZ_13[lang] || QUIZ_13['en'];
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
  console.log(`✅ Day 13 Complete:`);
  console.log(`   Languages Seeded: ${successCount}/10`);
  if (failureCount > 0) console.log(`   Failures: ${failureCount}`);
  console.log(`   Total Quiz Questions: ${successCount * 5}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  process.exit(failureCount > 0 ? 1 : 0);
}

seedDay13().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
