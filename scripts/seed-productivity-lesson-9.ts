/**
 * Seed Productivity 2026 Course - Lesson 9 (Day 9)
 * 
 * Day 9: Delegation vs Elimination - when to delegate, what to eliminate
 * 
 * Creates lesson 9 for all 10 languages in 2-language batches
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
// LESSON 9: Delegation vs Elimination
// ============================================================================

const LESSON_9: Record<string, {
  title: string;
  content: string;
  emailSubject: string;
  emailBody: string;
}> = {
  hu: {
    title: 'Delegálás vs Kiiktatás: mikor delegálj, mit iktatj ki',
    content: `<h1>Delegálás vs Kiiktatás: mikor delegálj, mit iktatj ki</h1>
<p><em>Nem minden feladat marad veled. Néhány egyszerűen el kell hagyni.</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
<li>Megérteni a delegálás és kiiktatás közötti különbséget.</li>
<li>Tudni, hogy mely feladatok delegálhatók és melyek nem.</li>
<li>Azonosítani azokat a feladatokat, amelyeket el lehet hagyni.</li>
<li>Megfelelően delegálni anélkül, hogy veszteség lenne.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
<li><strong>Időköltség</strong>: Azok az alacsony érték feladatok, amelyek évente 50+ órát igényelnek.</li>
<li><strong>Mentális fáradtság</strong>: Folyamatos kis feladatokkal telik az agy kapacitása.</li>
<li><strong>Lehetőség költsége</strong>: Ezalatt nem végezhetsz magasabb értékű munkát.</li>
<li><strong>Csapat termelékenysége</strong>: Delegálás másokra potenciálja őket fejlődésre.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>1. Delegálás vs Kiiktatás</h3>
<ul>
<li><strong>Delegálás</strong>: Az a feladat továbbadása valaki másnak, aki jobban vagy olcsóbban tudja elvégezni.</li>
<li><strong>Kiiktatás</strong>: Az a feladat elhagyása, mert valójában nem szükséges.</li>
<li><strong>Szállítás a döntésigényes feladat</strong>: Először határozd meg, hogy mely feladatok alacsony érték.</li>
</ul>
<h3>2. Delegálható feladatok</h3>
<ul>
<li>Rutinfeladatok (e-mailek szűrése, naptár menedzselés).</li>
<li>Fordítások, adatbevitel, alap kutatás.</li>
<li>Technikai támogatás (nem az igazi munka).</li>
<li>Kreatív támogatás (helyesírás, formázás).</li>
<li><strong>Kritérium</strong>: Az egyén képes rá, és több értéket generál az Ön időt felszabadítva.</li>
</ul>
<h3>3. Nem delegálható feladatok</h3>
<ul>
<li>Döntések, amelyek csak Ön tud meghozni.</li>
<li>Magas kockázatú közvetítés (ügyfelekkel való beszélgetések, mentori munka).</li>
<li>Stratégiai gondolkodás és tervezés.</li>
<li><strong>Kitétel</strong>: Ezek továbbadása rosszabb eredményt ad.</li>
</ul>
<h3>4. Kiiktatandó feladatok</h3>
<ul>
<li><strong>Teszt</strong>: Milyen eredmény veszne el, ha nem csinálod meg?</li>
<li>Ha a válasz: "Semmi" vagy "Nagyon kevés", akkor kiiktatandó.</li>
<li><strong>Példák</strong>: Szükségtelen jelentések, alacsony KPI riport, helyesírás egy szövegben.</li>
</ul>
<h3>5. A delegálás módja</h3>
<ul>
<li>Világos utasítások: Mi az elvárás? Mikor kell kész lenni?</li>
<li>Autonómia: Az egyénnek szabadsága legyen a megoldásban.</li>
<li>Visszajelzés: Szabályos ellenőrzés, támogatás, tanulás.</li>
<li>Felelősség: Az egyén felel, de Ön továbbra is vezérlő.</li>
</ul>
<hr />
<h2>Gyakorlati feladat (30 perc) — Feladat audit: Delegálás és Kiiktatás</h2>
<ol>
<li><strong>Feladat lista</strong>: Írja fel az összes feladatát egy héten. Körülbelül 50-80 darab.</li>
<li><strong>Delegálható</strong>: Jelöljön meg minden delegálható feladatot (C és D kategória).</li>
<li><strong>Kiiktatandó</strong>: Jelöljön meg minden alacsony értékű feladatot, amely elhagyható.</li>
<li><strong>Terv</strong>: Azonosítsa a delegálási vagy kiiktatási lehetőséget az elkövetkezendő 30 napban.</li>
<li><strong>Cselekvés</strong>: Válasszon legalább 1 feladatot kiiktatni és 1 feladatot delegálni.</li>
</ol>
<hr />
<h2>Önellenőrzés</h2>
<ul>
<li>✅ Tudom, mely feladatok delegálhatók és melyek nem.</li>
<li>✅ Van egy lista az alacsony értékű feladatokról.</li>
<li>✅ Azonosítottam legalább 3 delegálható feladatot.</li>
<li>✅ Azonosítottam legalább 5 kiiktatható feladatot.</li>
<li>✅ Cselekvési terv van az első delegálásra/kiiktatásra.</li>
</ul>`,
    emailSubject: 'Termelékenység 2026 – 9. nap: Delegálás vs Kiiktatás',
    emailBody: `<h1>Termelékenység 2026 – 9. nap</h1>
<h2>Delegálás vs Kiiktatás: mikor delegálj, mit iktatj ki</h2>
<p><em>Nem minden feladat marad veled. Néhány egyszerűen el kell hagyni.</em></p>
<p>Ma azt tanulod meg, hogyan lehet felszabadítani az idodet azáltal, hogy megértesz a delegálás és kiiktatás közötti különbséget. Nem minden feladat marad az Ön körül - néhány delegálható másokra, néhány egyszerűen kiiktatható.</p>
<p><strong>A cél</strong>: Csökkentsd az alacsony értékű feladatokat legalább 40%-kal a következő 30 napban.</p>
<p><strong>Kvíz</strong>: Próbálj meg 5 kérdésre válaszolni.</p>
<p><a href="{{APP_URL}}/hu/courses/${COURSE_ID_BASE}_HU/day/9">Nyisd meg a leckét →</a></p>`
  },
  en: {
    title: 'Delegation vs Elimination: When to Delegate, What to Eliminate',
    content: `<h1>Delegation vs Elimination: When to Delegate, What to Eliminate</h1>
<p><em>Not every task stays with you. Some simply need to be eliminated.</em></p>
<hr />
<h2>Learning Objectives</h2>
<ul>
<li>Understand the difference between delegation and elimination.</li>
<li>Know which tasks can be delegated and which cannot.</li>
<li>Identify tasks that can be eliminated entirely.</li>
<li>Delegate properly without loss of quality or control.</li>
</ul>
<hr />
<h2>Why This Matters</h2>
<ul>
<li><strong>Time Cost</strong>: Low-value tasks that consume 50+ hours per year add up.</li>
<li><strong>Mental Load</strong>: Small continuous tasks consume brain capacity.</li>
<li><strong>Opportunity Cost</strong>: You can't do high-value work while handling these.</li>
<li><strong>Team Growth</strong>: Delegation develops others and builds capability.</li>
</ul>
<hr />
<h2>Deep Dive</h2>
<h3>1. Delegation vs Elimination</h3>
<ul>
<li><strong>Delegation</strong>: Pass a task to someone else who can do it better or cheaper.</li>
<li><strong>Elimination</strong>: Drop a task because it's not actually necessary.</li>
<li><strong>The Decision Point</strong>: First identify which tasks are low-value.</li>
</ul>
<h3>2. Delegable Tasks</h3>
<ul>
<li>Routine tasks (email filtering, calendar management).</li>
<li>Translations, data entry, basic research.</li>
<li>Technical support (not your core work).</li>
<li>Creative support (proofreading, formatting).</li>
<li><strong>Criterion</strong>: The person can do it, and you create more value by freeing your time.</li>
</ul>
<h3>3. Non-Delegable Tasks</h3>
<ul>
<li>Decisions only you can make.</li>
<li>High-stakes interactions (client conversations, mentoring).</li>
<li>Strategic thinking and planning.</li>
<li><strong>Exception</strong>: Delegating these results in worse outcomes.</li>
</ul>
<h3>4. Eliminable Tasks</h3>
<ul>
<li><strong>The Test</strong>: What value is lost if you don't do this?</li>
<li>If the answer is "Nothing" or "Very little", eliminate it.</li>
<li><strong>Examples</strong>: Unnecessary reports, low-KPI metrics, redundant reviews.</li>
</ul>
<h3>5. How to Delegate</h3>
<ul>
<li>Clear instructions: What's expected? When is it due?</li>
<li>Autonomy: Give them freedom in the solution.</li>
<li>Feedback: Regular check-ins, support, learning.</li>
<li>Accountability: They're responsible, but you remain in control.</li>
</ul>
<hr />
<h2>Practical Exercise (30 minutes) — Task Audit: Delegation & Elimination</h2>
<ol>
<li><strong>Task List</strong>: Write down all your tasks in one week. Roughly 50-80 items.</li>
<li><strong>Delegable</strong>: Mark every task that can be delegated (C and D category).</li>
<li><strong>Eliminable</strong>: Mark every low-value task that can be dropped.</li>
<li><strong>Plan</strong>: Identify 3 delegation or elimination opportunities for the next 30 days.</li>
<li><strong>Action</strong>: Pick at least 1 task to eliminate and 1 to delegate this week.</li>
</ol>
<hr />
<h2>Self-Check</h2>
<ul>
<li>✅ I know which tasks can be delegated and which cannot.</li>
<li>✅ I have a list of low-value tasks to consider.</li>
<li>✅ I identified at least 3 delegable tasks.</li>
<li>✅ I identified at least 5 eliminable tasks.</li>
<li>✅ I have an action plan for my first delegation/elimination.</li>
</ul>`,
    emailSubject: 'Productivity 2026 – Day 9: Delegation vs Elimination',
    emailBody: `<h1>Productivity 2026 – Day 9</h1>
<h2>Delegation vs Elimination: When to Delegate, What to Eliminate</h2>
<p><em>Not every task stays with you. Some simply need to be eliminated.</em></p>
<p>Today you'll learn how to free up your time by understanding the difference between delegation and elimination. Not every task should stay on your plate—some can be handed off, some should be dropped entirely.</p>
<p><strong>Goal</strong>: Reduce low-value tasks by at least 40% in the next 30 days.</p>
<p><strong>Quiz</strong>: Answer 5 questions to confirm your understanding.</p>
<p><a href="{{APP_URL}}/en/courses/${COURSE_ID_BASE}_EN/day/9">Open the lesson →</a></p>`
  },
  tr: {
    title: 'Delegasyon vs İlim: Ne Zaman Delege Et, Ne Silin',
    content: `<h1>Delegasyon vs İlim: Ne Zaman Delege Et, Ne Silin</h1>
<p><em>Her görev seninle kalır. Bazıları sadece ortadan kaldırılmalıdır.</em></p>
<hr />
<h2>Öğrenme Hedefleri</h2>
<ul>
<li>Delegasyon ve eleme arasındaki farkı anlayın.</li>
<li>Hangi görevlerin delege edilebileceğini ve hangilerinin olamayacağını bilin.</li>
<li>Tamamen ortadan kaldırılabilecek görevleri tanımlayın.</li>
<li>Kalite veya kontrol kaybı olmaksızın doğru şekilde delege edin.</li>
</ul>
<hr />
<h2>Neden Önemli</h2>
<ul>
<li><strong>Zaman Maliyeti</strong>: Yılda 50+ saat tüketen düşük değerli görevler birikmektedir.</li>
<li><strong>Zihinsel Yük</strong>: Küçük süregelen görevler beyin kapasitesini tüketir.</li>
<li><strong>Fırsat Maliyeti</strong>: Bunları yaparken yüksek değerli işler yapamazsınız.</li>
<li><strong>Ekip Büyümesi</strong>: Delegasyon başkalarını geliştirir ve yetenek oluşturur.</li>
</ul>
<hr />
<h2>Derinlemesine Analiz</h2>
<h3>1. Delegasyon vs Eleme</h3>
<ul>
<li><strong>Delegasyon</strong>: Bir görevi bunu daha iyi veya daha ucuz yapabilecek başka birine verin.</li>
<li><strong>Eleme</strong>: Aslında gerekli olmadığı için bir görevi bırakın.</li>
<li><strong>Karar Noktası</strong>: Önce hangi görevlerin düşük değerli olduğunu tanımlayın.</li>
</ul>
<h3>2. Delege Edilebilir Görevler</h3>
<ul>
<li>Rutin görevler (e-posta filtreleme, takvim yönetimi).</li>
<li>Çeviriler, veri girişi, temel araştırma.</li>
<li>Teknik destek (sizin temel işiniz değil).</li>
<li>Yaratıcı destek (düzeltme, biçimlendirme).</li>
<li><strong>Kriter</strong>: Kişi bunu yapabilir ve zamanınızı serbest bırakarak daha fazla değer yaratırsınız.</li>
</ul>
<h3>3. Delege Edilemeyen Görevler</h3>
<ul>
<li>Yalnızca siz verebileceğiniz kararlar.</li>
<li>Yüksek riskli etkileşimler (müşteri görüşmeleri, koçluk).</li>
<li>Stratejik düşünce ve planlama.</li>
<li><strong>İstisna</strong>: Bunları delege etmek daha kötü sonuçlar verir.</li>
</ul>
<h3>4. Elimine Edilebilir Görevler</h3>
<ul>
<li><strong>Test</strong>: Bunu yapmazsanız ne değer kaybedilir?</li>
<li>Cevap "Hiçbir şey" veya "Çok azsa", ortadan kaldırın.</li>
<li><strong>Örnekler</strong>: Gereksiz raporlar, düşük KPI metrikler, gereksiz incelemeler.</li>
</ul>
<h3>5. Delegasyon Nasıl Yapılır</h3>
<ul>
<li>Açık talimatlar: Neler bekleniyor? Ne zaman hazır olmalı?</li>
<li>Otonomi: Çözümde onlara özgürlük verin.</li>
<li>Geri bildirim: Düzenli kontroller, destek, öğrenme.</li>
<li>Hesap verebilirlik: Onlar sorumlu, ama siz kontrol altındasınız.</li>
</ul>
<hr />
<h2>Pratik Alıştırma (30 dakika) — Görev Denetimi: Delegasyon ve Eleme</h2>
<ol>
<li><strong>Görev Listesi</strong>: Bir haftadaki tüm görevlerinizi yazın. Kabaca 50-80 madde.</li>
<li><strong>Delege Edilebilir</strong>: Delege edilebilecek her görevi işaretleyin (C ve D kategorisi).</li>
<li><strong>Ortadan Kaldırılabilir</strong>: Bırakılabilecek her düşük değerli görevi işaretleyin.</li>
<li><strong>Plan</strong>: Sonraki 30 gün için 3 delegasyon veya eleme fırsatı tanımlayın.</li>
<li><strong>Eylem</strong>: Bu hafta ortadan kaldıracak en az 1 görevi ve delege edecek 1 görevi seçin.</li>
</ol>
<hr />
<h2>Kendi Kendinizi Kontrol Edin</h2>
<ul>
<li>✅ Hangi görevlerin delege edilebileceğini ve hangilerinin olamayacağını biliyorum.</li>
<li>✅ Dusün etmek için düşük değerli görevlerin bir listesine sahibim.</li>
<li>✅ En az 3 delege edilebilir görevi tanımladım.</li>
<li>✅ En az 5 ortadan kaldırılabilir görevi tanımladım.</li>
<li>✅ İlk delegasyon/eleme için bir eylem planım var.</li>
</ul>`,
    emailSubject: 'Verimlilik 2026 – 9. Gün: Delegasyon vs İlim',
    emailBody: `<h1>Verimlilik 2026 – 9. Gün</h1>
<h2>Delegasyon vs İlim: Ne Zaman Delege Et, Ne Silin</h2>
<p><em>Her görev seninle kalır. Bazıları sadece ortadan kaldırılmalıdır.</em></p>
<p>Bugün delegasyon ile eleme arasındaki farkı anlayarak zamanınızı nasıl serbest bırakacağınızı öğreneceksiniz. Her görev sizin omuzunuzda kalmalı değil—bazıları başkalarına verilebilir, bazıları tamamen bırakılmalıdır.</p>
<p><strong>Hedef</strong>: Düşük değerli görevleri sonraki 30 günde en az %40 oranında azaltın.</p>
<p><strong>Quiz</strong>: Anlayışınızı doğrulamak için 5 soruya cevap verin.</p>
<p><a href="{{APP_URL}}/tr/courses/${COURSE_ID_BASE}_TR/day/9">Dersi aç →</a></p>`
  },
  bg: {
    title: 'Делегиране срещу Премахване: Кога да делегирате, Какво да премахнете',
    content: `<h1>Делегиране срещу Премахване: Кога да делегирате, Какво да премахнете</h1>
<p><em>Не всяка задача остава при вас. Някои просто трябва да бъдат премахнати.</em></p>
<hr />
<h2>Учебни цели</h2>
<ul>
<li>Разберете разликата между делегирането и премахването.</li>
<li>Знайте кои задачи могат да бъдат делегирани и кои не могат.</li>
<li>Идентифицирайте задачи, които могат да бъдат напълно премахнати.</li>
<li>Делегирайте правилно без загуба на качество или контрол.</li>
</ul>
<hr />
<h2>Защо е важно</h2>
<ul>
<li><strong>Времева цена</strong>: Нискостойностни задачи, които отнемат 50+ часа на година.</li>
<li><strong>Психическа натовареност</strong>: Малки непрекъснати задачи консумират капацитета на мозъка.</li>
<li><strong>Цена на възможност</strong>: Не можете да правите висока стойност работа, докато правите това.</li>
<li><strong>Растеж на екипа</strong>: Делегирането развива други и изгражда способност.</li>
</ul>
<hr />
<h2>Дълбокия анализ</h2>
<h3>1. Делегиране срещу Премахване</h3>
<ul>
<li><strong>Делегиране</strong>: Предайте задача на някого друг, който може да я направи по-добре или по-евтино.</li>
<li><strong>Премахване</strong>: Оставете задача, защото тя всъщност не е необходима.</li>
<li><strong>Точка на решение</strong>: Първо идентифицирайте кои задачи имат ниска стойност.</li>
</ul>
<h3>2. Делегируеми задачи</h3>
<ul>
<li>Рутинни задачи (филтриране на е-пощи, управление на календар).</li>
<li>Преводи, въвеждане на данни, базова изследване.</li>
<li>Технически поддръжка (не вашата основна работа).</li>
<li>Творческа поддръжка (коректура, форматиране).</li>
<li><strong>Критерий</strong>: Лицето може да го направи и вие създавате повече стойност, освобождавайки времето си.</li>
</ul>
<h3>3. Неделегируеми задачи</h3>
<ul>
<li>Решения, които само вие можете да вземете.</li>
<li>Високорискови взаимодействия (разговори с клиенти, менторство).</li>
<li>Стратегическо мислене и планиране.</li>
<li><strong>Изключение</strong>: Делегирането на това води до по-лоши резултати.</li>
</ul>
<h3>4. Премахваеми задачи</h3>
<ul>
<li><strong>Тест</strong>: Каква стойност се губи, ако това не направите?</li>
<li>Ако отговорът е "Нищо" или "Много малко", премахнете го.</li>
<li><strong>Примери</strong>: Ненужни доклади, нискоKPI показатели, ненужни преглеждане.</li>
</ul>
<h3>5. Как да делегирате</h3>
<ul>
<li>Ясни инструкции: Какво се очаква? Кога трябва да е готово?</li>
<li>Автономия: Дайте им свобода в решението.</li>
<li>Обратна връзка: Редовни проверки, поддръжка, обучение.</li>
<li>Отговорност: Те са отговорни, но вие остават в контрол.</li>
</ul>
<hr />
<h2>Практическо упражнение (30 минути) — Аудит на задачи: Делегиране и премахване</h2>
<ol>
<li><strong>Списък на задачите</strong>: Напишете всички ваши задачи в една седмица. Приблизително 50-80 елемента.</li>
<li><strong>Делегируеми</strong>: Отбележете всяка задача, която може да бъде делегирана (категории C и D).</li>
<li><strong>Премахваеми</strong>: Отбележете всяка нискостойностна задача, която може да бъде премахната.</li>
<li><strong>План</strong>: Идентифицирайте 3 възможности за делегиране или премахване за следващите 30 дни.</li>
<li><strong>Действие</strong>: Изберете поне 1 задача за премахване и 1 за делегиране тази седмица.</li>
</ol>
<hr />
<h2>Самопроверка</h2>
<ul>
<li>✅ Знам кои задачи могат да бъдат делегирани и кои не могат.</li>
<li>✅ Имам списък на нискостойностни задачи за разглеждане.</li>
<li>✅ Идентифицирах най-малко 3 делегируеми задачи.</li>
<li>✅ Идентифицирах най-малко 5 премахваеми задачи.</li>
<li>✅ Имам план за действие за мое първо делегиране/премахване.</li>
</ul>`,
    emailSubject: 'Производителност 2026 – 9. Ден: Делегиране срещу Премахване',
    emailBody: `<h1>Производителност 2026 – 9. Ден</h1>
<h2>Делегиране срещу Премахване: Кога да делегирате, Какво да премахнете</h2>
<p><em>Не всяка задача остава при вас. Някои просто трябва да бъдат премахнати.</em></p>
<p>Днес ще научите как да освободите времето си, като разберете разликата между делегирането и премахването. Не всяка задача трябва да остане при вас—някои могат да бъдат раздадени, някои трябва да бъдат напълно оставени.</p>
<p><strong>Цел</strong>: Намалете нискостойностни задачи с най-малко 40% през следващите 30 дни.</p>
<p><strong>Quiz</strong>: Отговорете на 5 въпроса, за да потвърдите разбирането си.</p>
<p><a href="{{APP_URL}}/bg/courses/${COURSE_ID_BASE}_BG/day/9">Отворете урока →</a></p>`
  },
  pl: {
    title: 'Delegowanie vs Eliminacja: Kiedy Delegować, Co Wyeliminować',
    content: `<h1>Delegowanie vs Eliminacja: Kiedy Delegować, Co Wyeliminować</h1>
<p><em>Nie każde zadanie pozostaje przy Tobie. Niektóre po prostu muszą być wyeliminowane.</em></p>
<hr />
<h2>Cele edukacyjne</h2>
<ul>
<li>Zrozumieć różnicę między delegowaniem a eliminacją.</li>
<li>Wiedzieć, które zadania mogą być delegowane, a które nie.</li>
<li>Zidentyfikować zadania, które można całkowicie wyeliminować.</li>
<li>Delegować prawidłowo bez utraty jakości lub kontroli.</li>
</ul>
<hr />
<h2>Dlaczego jest to ważne</h2>
<ul>
<li><strong>Koszt czasu</strong>: Niskopriorytetowe zadania zużywające 50+ godzin rocznie się sumują.</li>
<li><strong>Obciążenie umysłowe</strong>: Małe ciągłe zadania konsumują pojemność mózgu.</li>
<li><strong>Koszt alternatywny</strong>: Nie możesz pracować na wysoką wartość, robiąc to.</li>
<li><strong>Wzrost zespołu</strong>: Delegowanie rozwija innych i buduje zdolności.</li>
</ul>
<hr />
<h2>Analiza dogłębna</h2>
<h3>1. Delegowanie vs Eliminacja</h3>
<ul>
<li><strong>Delegowanie</strong>: Przekaż zadanie komuś innemu, kto może to zrobić lepiej lub taniej.</li>
<li><strong>Eliminacja</strong>: Porzuć zadanie, ponieważ tak naprawdę nie jest konieczne.</li>
<li><strong>Punkt decyzji</strong>: Najpierw zidentyfikuj, które zadania są niskopriorytetowe.</li>
</ul>
<h3>2. Zadania do delegowania</h3>
<ul>
<li>Zadania rutynowe (filtrowanie e-maili, zarządzanie kalendarzem).</li>
<li>Tłumaczenia, wprowadzanie danych, badania podstawowe.</li>
<li>Wsparcie techniczne (nie Twoja praca podstawowa).</li>
<li>Wsparcie kreatywne (korekta, formatowanie).</li>
<li><strong>Kryterium</strong>: Osoba może to zrobić i tworzysz więcej wartości, oszczędzając swój czas.</li>
</ul>
<h3>3. Zadania niedelegowalne</h3>
<ul>
<li>Decyzje, które tylko Ty możesz podjąć.</li>
<li>Wysokoryzyczne interakcje (rozmowy z klientami, mentoring).</li>
<li>Myślenie strategiczne i planowanie.</li>
<li><strong>Wyjątek</strong>: Delegowanie tego prowadzi do gorszych wyników.</li>
</ul>
<h3>4. Zadania do wyeliminowania</h3>
<ul>
<li><strong>Test</strong>: Jaka wartość zostałaby utracona, gdybyś tego nie zrobił?</li>
<li>Jeśli odpowiedź to "Nic" lub "Bardzo mało", wyeliminuj to.</li>
<li><strong>Przykłady</strong>: Niepotrzebne raporty, niskieKPI metryki, zbędne przeglądy.</li>
</ul>
<h3>5. Jak delegować</h3>
<ul>
<li>Jasne instrukcje: Co się oczekuje? Kiedy powinno być gotowe?</li>
<li>Autonomia: Daj im wolność w rozwiązaniu.</li>
<li>Opinia zwrotna: Regularne kontrole, wsparcie, nauka.</li>
<li>Odpowiedzialność: Oni są odpowiedzialni, ale Ty pozostajesz w kontroli.</li>
</ul>
<hr />
<h2>Ćwiczenie praktyczne (30 minut) — Audyt zadań: Delegowanie i Eliminacja</h2>
<ol>
<li><strong>Lista zadań</strong>: Wypisz wszystkie swoje zadania w ciągu jednego tygodnia. Mniej więcej 50-80 pozycji.</li>
<li><strong>Możliwe do delegowania</strong>: Zaznacz każde zadanie, które można delegować (kategorie C i D).</li>
<li><strong>Do wyeliminowania</strong>: Zaznacz każde niskopriorytetowe zadanie, które można porzucić.</li>
<li><strong>Plan</strong>: Zidentyfikuj 3 możliwości delegowania lub eliminacji na kolejne 30 dni.</li>
<li><strong>Działanie</strong>: Wybierz przynajmniej 1 zadanie do wyeliminowania i 1 do delegowania w tym tygodniu.</li>
</ol>
<hr />
<h2>Samokontrola</h2>
<ul>
<li>✅ Wiem, które zadania można delegować, a które nie.</li>
<li>✅ Mam listę niskopriorytetowych zadań do rozważenia.</li>
<li>✅ Zidentyfikowałem co najmniej 3 zadania do delegowania.</li>
<li>✅ Zidentyfikowałem co najmniej 5 zadań do wyeliminowania.</li>
<li>✅ Mam plan działania dla swojego pierwszego delegowania/eliminacji.</li>
</ul>`,
    emailSubject: 'Produktywność 2026 – 9. Dzień: Delegowanie vs Eliminacja',
    emailBody: `<h1>Produktywność 2026 – 9. Dzień</h1>
<h2>Delegowanie vs Eliminacja: Kiedy Delegować, Co Wyeliminować</h2>
<p><em>Nie każde zadanie pozostaje przy Tobie. Niektóre po prostu muszą być wyeliminowane.</em></p>
<p>Dzisiaj nauczysz się, jak zwolnić swój czas, rozumiejąc różnicę między delegowaniem a eliminacją. Nie każde zadanie powinno pozostać na Twoich barkach—niektóre mogą być przekazane innym, niektóre powinny być całkowicie porzucone.</p>
<p><strong>Cel</strong>: Zmniejsz zadania niskopriorytetowe o co najmniej 40% w ciągu następnych 30 dni.</p>
<p><strong>Quiz</strong>: Odpowiedz na 5 pytań, aby potwierdzić swoją wiedzę.</p>
<p><a href="{{APP_URL}}/pl/courses/${COURSE_ID_BASE}_PL/day/9">Otwórz lekcję →</a></p>`
  },
  vi: {
    title: 'Phân công vs Loại bỏ: Khi nào phân công, Cái gì loại bỏ',
    content: `<h1>Phân công vs Loại bỏ: Khi nào phân công, Cái gì loại bỏ</h1>
<p><em>Không phải mọi nhiệm vụ đều ở lại với bạn. Một số cần phải loại bỏ.</em></p>
<hr />
<h2>Mục tiêu học tập</h2>
<ul>
<li>Hiểu sự khác biệt giữa phân công và loại bỏ.</li>
<li>Biết những nhiệm vụ nào có thể được phân công và những nhiệm vụ nào không.</li>
<li>Xác định những nhiệm vụ có thể được loại bỏ hoàn toàn.</li>
<li>Phân công một cách đúng đắn mà không mất đi chất lượng hoặc kiểm soát.</li>
</ul>
<hr />
<h2>Tại sao điều này lại quan trọng</h2>
<ul>
<li><strong>Chi phí thời gian</strong>: Các nhiệm vụ giá trị thấp tiêu tốn 50+ giờ mỗi năm.</li>
<li><strong>Tải về tâm thần</strong>: Các nhiệm vụ nhỏ liên tục tiêu thụ dung lượng não.</li>
<li><strong>Chi phí cơ hội</strong>: Bạn không thể làm công việc giá trị cao trong khi làm việc này.</li>
<li><strong>Tăng trưởng đội</strong>: Phân công phát triển những người khác và xây dựng khả năng.</li>
</ul>
<hr />
<h2>Phân tích sâu</h2>
<h3>1. Phân công vs Loại bỏ</h3>
<ul>
<li><strong>Phân công</strong>: Chuyển nhiệm vụ cho người khác có thể làm tốt hơn hoặc rẻ hơn.</li>
<li><strong>Loại bỏ</strong>: Bỏ nhiệm vụ vì nó thực sự không cần thiết.</li>
<li><strong>Điểm quyết định</strong>: Trước tiên xác định những nhiệm vụ nào có giá trị thấp.</li>
</ul>
<h3>2. Các nhiệm vụ có thể phân công</h3>
<ul>
<li>Các nhiệm vụ thường lệ (lọc email, quản lý lịch).</li>
<li>Dịch, nhập dữ liệu, nghiên cứu cơ bản.</li>
<li>Hỗ trợ kỹ thuật (không phải công việc cơ bản của bạn).</li>
<li>Hỗ trợ sáng tạo (hiệu đính, định dạng).</li>
<li><strong>Tiêu chí</strong>: Người đó có thể làm được và bạn tạo ra nhiều giá trị hơn bằng cách giải phóng thời gian của mình.</li>
</ul>
<h3>3. Các nhiệm vụ không thể phân công</h3>
<ul>
<li>Quyết định chỉ bạn có thể đưa ra.</li>
<li>Tương tác rủi ro cao (trò chuyện với khách hàng, cố vấn).</li>
<li>Tư duy chiến lược và lập kế hoạch.</li>
<li><strong>Ngoại lệ</strong>: Phân công những cái này dẫn đến kết quả tồi tệ hơn.</li>
</ul>
<h3>4. Các nhiệm vụ có thể loại bỏ</h3>
<ul>
<li><strong>Bài kiểm tra</strong>: Giá trị nào sẽ bị mất nếu bạn không làm điều này?</li>
<li>Nếu câu trả lời là "Không có gì" hoặc "Rất ít", loại bỏ nó.</li>
<li><strong>Ví dụ</strong>: Báo cáo không cần thiết, KPI thấp, đánh giá thừa.</li>
</ul>
<h3>5. Cách phân công</h3>
<ul>
<li>Hướng dẫn rõ ràng: Điều gì được mong đợi? Nó nên hoàn thành khi nào?</li>
<li>Tự chủ: Cho họ tự do trong giải pháp.</li>
<li>Phản hồi: Kiểm tra định kỳ, hỗ trợ, học tập.</li>
<li>Trách nhiệm: Họ chịu trách nhiệm, nhưng bạn vẫn kiểm soát.</li>
</ul>
<hr />
<h2>Bài tập thực tế (30 phút) — Kiểm tra nhiệm vụ: Phân công và Loại bỏ</h2>
<ol>
<li><strong>Danh sách nhiệm vụ</strong>: Viết ra tất cả các nhiệm vụ của bạn trong một tuần. Khoảng 50-80 mục.</li>
<li><strong>Có thể phân công</strong>: Đánh dấu mọi nhiệm vụ có thể được phân công (danh mục C và D).</li>
<li><strong>Có thể loại bỏ</strong>: Đánh dấu mọi nhiệm vụ giá trị thấp có thể được thả.</li>
<li><strong>Kế hoạch</strong>: Xác định 3 cơ hội phân công hoặc loại bỏ cho 30 ngày tới.</li>
<li><strong>Hành động</strong>: Chọn ít nhất 1 nhiệm vụ để loại bỏ và 1 để phân công tuần này.</li>
</ol>
<hr />
<h2>Kiểm tra bản thân</h2>
<ul>
<li>✅ Tôi biết những nhiệm vụ nào có thể được phân công và những nhiệm vụ nào không.</li>
<li>✅ Tôi có danh sách các nhiệm vụ giá trị thấp để xem xét.</li>
<li>✅ Tôi đã xác định ít nhất 3 nhiệm vụ có thể phân công.</li>
<li>✅ Tôi đã xác định ít nhất 5 nhiệm vụ có thể loại bỏ.</li>
<li>✅ Tôi có kế hoạch hành động cho phân công/loại bỏ đầu tiên của mình.</li>
</ul>`,
    emailSubject: 'Năng suất 2026 – Ngày 9: Phân công vs Loại bỏ',
    emailBody: `<h1>Năng suất 2026 – Ngày 9</h1>
<h2>Phân công vs Loại bỏ: Khi nào phân công, Cái gì loại bỏ</h2>
<p><em>Không phải mọi nhiệm vụ đều ở lại với bạn. Một số cần phải loại bỏ.</em></p>
<p>Hôm nay bạn sẽ tìm hiểu cách giải phóng thời gian của mình bằng cách hiểu sự khác biệt giữa phân công và loại bỏ. Không phải mọi nhiệm vụ đều nên ở lại với bạn—một số có thể được trao cho người khác, một số nên loại bỏ hoàn toàn.</p>
<p><strong>Mục tiêu</strong>: Giảm các nhiệm vụ giá trị thấp ít nhất 40% trong 30 ngày tới.</p>
<p><strong>Quiz</strong>: Trả lời 5 câu hỏi để xác nhận sự hiểu biết của bạn.</p>
<p><a href="{{APP_URL}}/vi/courses/${COURSE_ID_BASE}_VI/day/9">Mở bài học →</a></p>`
  },
  id: {
    title: 'Delegasi vs Eliminasi: Kapan Mendelegasikan, Apa yang Dieliminasi',
    content: `<h1>Delegasi vs Eliminasi: Kapan Mendelegasikan, Apa yang Dieliminasi</h1>
<p><em>Tidak setiap tugas tetap bersama Anda. Beberapa harus dieliminasi.</em></p>
<hr />
<h2>Tujuan Pembelajaran</h2>
<ul>
<li>Pahami perbedaan antara delegasi dan eliminasi.</li>
<li>Ketahui tugas mana yang dapat didelegasikan dan mana yang tidak.</li>
<li>Identifikasi tugas yang dapat dieliminasi sepenuhnya.</li>
<li>Delegasikan dengan benar tanpa kehilangan kualitas atau kontrol.</li>
</ul>
<hr />
<h2>Mengapa Ini Penting</h2>
<ul>
<li><strong>Biaya Waktu</strong>: Tugas bernilai rendah yang memakan 50+ jam per tahun.</li>
<li><strong>Beban Mental</strong>: Tugas kecil yang berkelanjutan mengonsumsi kapasitas otak.</li>
<li><strong>Biaya Kesempatan</strong>: Anda tidak dapat melakukan pekerjaan bernilai tinggi saat melakukan ini.</li>
<li><strong>Pertumbuhan Tim</strong>: Delegasi mengembangkan orang lain dan membangun kemampuan.</li>
</ul>
<hr />
<h2>Analisis Mendalam</h2>
<h3>1. Delegasi vs Eliminasi</h3>
<ul>
<li><strong>Delegasi</strong>: Serahkan tugas kepada orang lain yang dapat melakukannya lebih baik atau lebih murah.</li>
<li><strong>Eliminasi</strong>: Tinggalkan tugas karena sebenarnya tidak perlu.</li>
<li><strong>Titik Keputusan</strong>: Pertama identifikasi tugas mana yang bernilai rendah.</li>
</ul>
<h3>2. Tugas yang Dapat Didelegasikan</h3>
<ul>
<li>Tugas rutin (penyaringan email, manajemen kalender).</li>
<li>Terjemahan, entri data, penelitian dasar.</li>
<li>Dukungan teknis (bukan pekerjaan inti Anda).</li>
<li>Dukungan kreatif (proofreading, pemformatan).</li>
<li><strong>Kriteria</strong>: Orang dapat melakukannya dan Anda menciptakan nilai lebih dengan membebaskan waktu Anda.</li>
</ul>
<h3>3. Tugas yang Tidak Dapat Didelegasikan</h3>
<ul>
<li>Keputusan hanya Anda yang dapat buat.</li>
<li>Interaksi berisiko tinggi (percakapan pelanggan, mentoring).</li>
<li>Pemikiran strategis dan perencanaan.</li>
<li><strong>Pengecualian</strong>: Mendelegasikan ini menghasilkan hasil yang lebih buruk.</li>
</ul>
<h3>4. Tugas yang Dapat Dieliminasi</h3>
<ul>
<li><strong>Tes</strong>: Nilai apa yang hilang jika Anda tidak melakukan ini?</li>
<li>Jika jawabannya adalah "Tidak ada" atau "Sangat sedikit", eliminasi.</li>
<li><strong>Contoh</strong>: Laporan yang tidak perlu, KPI rendah, ulasan berlebihan.</li>
</ul>
<h3>5. Cara Mendelegasikan</h3>
<ul>
<li>Instruksi jelas: Apa yang diharapkan? Kapan harus selesai?</li>
<li>Otonomi: Beri mereka kebebasan dalam solusi.</li>
<li>Umpan balik: Pemeriksaan rutin, dukungan, pembelajaran.</li>
<li>Akuntabilitas: Mereka bertanggung jawab, tapi Anda tetap mengendalikan.</li>
</ul>
<hr />
<h2>Latihan Praktik (30 menit) — Audit Tugas: Delegasi dan Eliminasi</h2>
<ol>
<li><strong>Daftar Tugas</strong>: Tuliskan semua tugas Anda dalam seminggu. Sekitar 50-80 item.</li>
<li><strong>Dapat Didelegasikan</strong>: Tandai setiap tugas yang dapat didelegasikan (kategori C dan D).</li>
<li><strong>Dapat Dieliminasi</strong>: Tandai setiap tugas bernilai rendah yang dapat dijatuhkan.</li>
<li><strong>Rencana</strong>: Identifikasi 3 peluang delegasi atau eliminasi untuk 30 hari ke depan.</li>
<li><strong>Tindakan</strong>: Pilih setidaknya 1 tugas untuk dieliminasi dan 1 untuk didelegasikan minggu ini.</li>
</ol>
<hr />
<h2>Periksa Diri Sendiri</h2>
<ul>
<li>✅ Saya tahu tugas mana yang dapat didelegasikan dan mana yang tidak.</li>
<li>✅ Saya memiliki daftar tugas bernilai rendah untuk dipertimbangkan.</li>
<li>✅ Saya mengidentifikasi setidaknya 3 tugas yang dapat didelegasikan.</li>
<li>✅ Saya mengidentifikasi setidaknya 5 tugas yang dapat dieliminasi.</li>
<li>✅ Saya memiliki rencana tindakan untuk delegasi/eliminasi pertama saya.</li>
</ul>`,
    emailSubject: 'Produktivitas 2026 – Hari 9: Delegasi vs Eliminasi',
    emailBody: `<h1>Produktivitas 2026 – Hari 9</h1>
<h2>Delegasi vs Eliminasi: Kapan Mendelegasikan, Apa yang Dieliminasi</h2>
<p><em>Tidak setiap tugas tetap bersama Anda. Beberapa harus dieliminasi.</em></p>
<p>Hari ini Anda akan belajar cara membebaskan waktu Anda dengan memahami perbedaan antara delegasi dan eliminasi. Tidak setiap tugas harus tetap bersama Anda—beberapa dapat diberikan kepada orang lain, beberapa harus dieliminasi sepenuhnya.</p>
<p><strong>Tujuan</strong>: Kurangi tugas bernilai rendah minimal 40% dalam 30 hari ke depan.</p>
<p><strong>Quiz</strong>: Jawab 5 pertanyaan untuk mengkonfirmasi pemahaman Anda.</p>
<p><a href="{{APP_URL}}/id/courses/${COURSE_ID_BASE}_ID/day/9">Buka pelajaran →</a></p>`
  },
  ar: {
    title: 'التفويض مقابل الحذف: متى تفوض، ماذا تحذف',
    content: `<h1>التفويض مقابل الحذف: متى تفوض، ماذا تحذف</h1>
<p><em>ليس كل مهمة تبقى معك. البعض يجب أن يتم حذفه ببساطة.</em></p>
<hr />
<h2>أهداف التعلم</h2>
<ul>
<li>فهم الفرق بين التفويض والحذف.</li>
<li>معرفة المهام التي يمكن تفويضها وأيها لا يمكن.</li>
<li>حدد المهام التي يمكن حذفها بالكامل.</li>
<li>فوض بشكل صحيح دون فقدان الجودة أو السيطرة.</li>
</ul>
<hr />
<h2>لماذا هذا مهم</h2>
<ul>
<li><strong>تكلفة الوقت</strong>: المهام منخفضة القيمة التي تستهلك 50+ ساعة سنويًا.</li>
<li><strong>الحمل الذهني</strong>: المهام الصغيرة المستمرة تستهلك طاقة الدماغ.</li>
<li><strong>تكلفة الفرصة</strong>: لا يمكنك القيام بعمل ذو قيمة عالية أثناء القيام بهذا.</li>
<li><strong>نمو الفريق</strong>: يطور التفويض الآخرين ويبني القدرات.</li>
</ul>
<hr />
<h2>تحليل عميق</h2>
<h3>1. التفويض مقابل الحذف</h3>
<ul>
<li><strong>التفويض</strong>: مرر المهمة إلى شخص آخر يمكنه القيام بها بشكل أفضل أو أرخص.</li>
<li><strong>الحذف</strong>: أترك المهمة لأنها ليست ضرورية فعليًا.</li>
<li><strong>نقطة القرار</strong>: حدد أولاً المهام منخفضة القيمة.</li>
</ul>
<h3>2. المهام التي يمكن تفويضها</h3>
<ul>
<li>المهام الروتينية (تصفية البريد الإلكتروني، إدارة التقويم).</li>
<li>الترجمات، إدخال البيانات، البحث الأساسي.</li>
<li>الدعم الفني (ليس عملك الأساسي).</li>
<li>الدعم الإبداعي (التدقيق، التنسيق).</li>
<li><strong>المعيار</strong>: يمكن للشخص القيام به وتُنشئ قيمة أكثر بتحرير وقتك.</li>
</ul>
<h3>3. المهام التي لا يمكن تفويضها</h3>
<ul>
<li>القرارات التي فقط أنت يمكنك اتخاذها.</li>
<li>التفاعلات عالية المخاطر (محادثات العملاء والتوجيه).</li>
<li>التفكير الاستراتيجي والتخطيط.</li>
<li><strong>الاستثناء</strong>: تفويض هذه يؤدي إلى نتائج أسوأ.</li>
</ul>
<h3>4. المهام التي يمكن حذفها</h3>
<ul>
<li><strong>الاختبار</strong>: ما القيمة المفقودة إذا لم تفعل هذا؟</li>
<li>إذا كانت الإجابة "لا شيء" أو "القليل جداً"، احذفها.</li>
<li><strong>أمثلة</strong>: التقارير غير الضرورية، مقاييس KPI المنخفضة، المراجعات الزائدة.</li>
</ul>
<h3>5. كيفية التفويض</h3>
<ul>
<li>تعليمات واضحة: ما المتوقع؟ متى يجب أن ينتهي؟</li>
<li>الاستقلالية: أعطهم الحرية في الحل.</li>
<li>التغذية الراجعة: الفحوصات المنتظمة والدعم والتعلم.</li>
<li>المساءلة: هم مسؤولون لكن تبقى تحت السيطرة.</li>
</ul>
<hr />
<h2>التمرين العملي (30 دقيقة) — تدقيق المهام: التفويض والحذف</h2>
<ol>
<li><strong>قائمة المهام</strong>: اكتب جميع مهامك في أسبوع واحد. حوالي 50-80 عنصر.</li>
<li><strong>يمكن تفويضها</strong>: ضع علامة على كل مهمة يمكن تفويضها (الفئات C و D).</li>
<li><strong>يمكن حذفها</strong>: ضع علامة على كل مهمة منخفضة القيمة يمكن إسقاطها.</li>
<li><strong>الخطة</strong>: حدد 3 فرص للتفويض أو الحذف للـ 30 يوم القادم.</li>
<li><strong>الإجراء</strong>: اختر مهمة واحدة على الأقل لحذفها وواحدة لتفويضها هذا الأسبوع.</li>
</ol>
<hr />
<h2>فحص ذاتي</h2>
<ul>
<li>✅ أعرف أي المهام يمكن تفويضها وأيها لا.</li>
<li>✅ لدي قائمة بالمهام منخفضة القيمة للنظر فيها.</li>
<li>✅ حددت على الأقل 3 مهام يمكن تفويضها.</li>
<li>✅ حددت على الأقل 5 مهام يمكن حذفها.</li>
<li>✅ لدي خطة عمل لتفويضي/حذفي الأول.</li>
</ul>`,
    emailSubject: 'الإنتاجية 2026 – اليوم 9: التفويض مقابل الحذف',
    emailBody: `<h1>الإنتاجية 2026 – اليوم 9</h1>
<h2>التفويض مقابل الحذف: متى تفوض، ماذا تحذف</h2>
<p><em>ليس كل مهمة تبقى معك. البعض يجب أن يتم حذفه ببساطة.</em></p>
<p>اليوم ستتعلم كيفية تحرير وقتك من خلال فهم الفرق بين التفويض والحذف. ليس كل مهمة يجب أن تبقى معك—يمكن تمرير البعض للآخرين، والبعض يجب حذفه بالكامل.</p>
<p><strong>الهدف</strong>: قلل المهام منخفضة القيمة بما لا يقل عن 40% في الـ 30 يوم القادم.</p>
<p><strong>اختبار</strong>: أجب على 5 أسئلة لتأكيد فهمك.</p>
<p><a href="{{APP_URL}}/ar/courses/${COURSE_ID_BASE}_AR/day/9">افتح الدرس →</a></p>`
  },
  pt: {
    title: 'Delegação vs Eliminação: Quando Delegar, O Que Eliminar',
    content: `<h1>Delegação vs Eliminação: Quando Delegar, O Que Eliminar</h1>
<p><em>Nem toda tarefa fica com você. Algumas precisam ser eliminadas.</em></p>
<hr />
<h2>Objetivos de Aprendizado</h2>
<ul>
<li>Entender a diferença entre delegação e eliminação.</li>
<li>Saber quais tarefas podem ser delegadas e quais não.</li>
<li>Identificar tarefas que podem ser completamente eliminadas.</li>
<li>Delegar adequadamente sem perda de qualidade ou controle.</li>
</ul>
<hr />
<h2>Por que isso é importante</h2>
<ul>
<li><strong>Custo de Tempo</strong>: Tarefas de baixo valor que consomem 50+ horas por ano.</li>
<li><strong>Carga Mental</strong>: Pequenas tarefas contínuas consomem capacidade cerebral.</li>
<li><strong>Custo de Oportunidade</strong>: Você não consegue fazer trabalho de alto valor enquanto faz isso.</li>
<li><strong>Crescimento da Equipe</strong>: Delegação desenvolve outros e constrói capacidade.</li>
</ul>
<hr />
<h2>Análise Profunda</h2>
<h3>1. Delegação vs Eliminação</h3>
<ul>
<li><strong>Delegação</strong>: Passe a tarefa para outra pessoa que pode fazê-la melhor ou mais barato.</li>
<li><strong>Eliminação</strong>: Abandone a tarefa porque não é realmente necessária.</li>
<li><strong>Ponto de Decisão</strong>: Primeiro identifique quais tarefas são de baixo valor.</li>
</ul>
<h3>2. Tarefas Delegáveis</h3>
<ul>
<li>Tarefas rotineiras (filtragem de email, gerenciamento de calendário).</li>
<li>Traduções, entrada de dados, pesquisa básica.</li>
<li>Suporte técnico (não seu trabalho principal).</li>
<li>Suporte criativo (revisão, formatação).</li>
<li><strong>Critério</strong>: A pessoa pode fazer e você cria mais valor liberando seu tempo.</li>
</ul>
<h3>3. Tarefas Não Delegáveis</h3>
<ul>
<li>Decisões que apenas você pode tomar.</li>
<li>Interações de alto risco (conversas com clientes, mentoring).</li>
<li>Pensamento estratégico e planejamento.</li>
<li><strong>Exceção</strong>: Delegar isso resulta em piores resultados.</li>
</ul>
<h3>4. Tarefas Elimináveis</h3>
<ul>
<li><strong>O Teste</strong>: Qual valor seria perdido se você não fizesse isso?</li>
<li>Se a resposta é "Nada" ou "Muito pouco", elimine.</li>
<li><strong>Exemplos</strong>: Relatórios desnecessários, métricas KPI baixas, revisões redundantes.</li>
</ul>
<h3>5. Como Delegar</h3>
<ul>
<li>Instruções claras: O que é esperado? Quando deve estar pronto?</li>
<li>Autonomia: Dê-lhes liberdade na solução.</li>
<li>Feedback: Verificações regulares, suporte, aprendizado.</li>
<li>Responsabilidade: Eles são responsáveis, mas você permanece no controle.</li>
</ul>
<hr />
<h2>Exercício Prático (30 minutos) — Auditoria de Tarefas: Delegação e Eliminação</h2>
<ol>
<li><strong>Lista de Tarefas</strong>: Escreva todas as suas tarefas em uma semana. Cerca de 50-80 itens.</li>
<li><strong>Delegáveis</strong>: Marque todas as tarefas que podem ser delegadas (categorias C e D).</li>
<li><strong>Elimináveis</strong>: Marque todas as tarefas de baixo valor que podem ser descartadas.</li>
<li><strong>Plano</strong>: Identifique 3 oportunidades de delegação ou eliminação para os próximos 30 dias.</li>
<li><strong>Ação</strong>: Escolha pelo menos 1 tarefa para eliminar e 1 para delegar esta semana.</li>
</ol>
<hr />
<h2>Auto-Verificação</h2>
<ul>
<li>✅ Sei quais tarefas podem ser delegadas e quais não.</li>
<li>✅ Tenho uma lista de tarefas de baixo valor para considerar.</li>
<li>✅ Identifiquei pelo menos 3 tarefas delegáveis.</li>
<li>✅ Identifiquei pelo menos 5 tarefas elimináveis.</li>
<li>✅ Tenho um plano de ação para minha primeira delegação/eliminação.</li>
</ul>`,
    emailSubject: 'Produtividade 2026 – Dia 9: Delegação vs Eliminação',
    emailBody: `<h1>Produtividade 2026 – Dia 9</h1>
<h2>Delegação vs Eliminação: Quando Delegar, O Que Eliminar</h2>
<p><em>Nem toda tarefa fica com você. Algumas precisam ser eliminadas.</em></p>
<p>Hoje você aprenderá como liberar seu tempo entendendo a diferença entre delegação e eliminação. Nem toda tarefa deve permanecer com você—algumas podem ser repassadas para outros, algumas devem ser completamente eliminadas.</p>
<p><strong>Meta</strong>: Reduza tarefas de baixo valor em pelo menos 40% nos próximos 30 dias.</p>
<p><strong>Quiz</strong>: Responda 5 perguntas para confirmar sua compreensão.</p>
<p><a href="{{APP_URL}}/pt/courses/${COURSE_ID_BASE}_PT/day/9">Abra a lição →</a></p>`
  },
  hi: {
    title: 'प्रतिनिधिमंडन बनाम उन्मूलन: कब प्रतिनिधि करना है, क्या समाप्त करना है',
    content: `<h1>प्रतिनिधिमंडन बनाम उन्मूलन: कब प्रतिनिधि करना है, क्या समाप्त करना है</h1>
<p><em>हर कार्य आपके साथ नहीं रहता। कुछ को बस खत्म करना होगा।</em></p>
<hr />
<h2>सीखने के उद्देश्य</h2>
<ul>
<li>प्रतिनिधिमंडन और उन्मूलन के बीच अंतर को समझें।</li>
<li>जानें कि कौन से कार्य प्रतिनिधि किए जा सकते हैं और कौन से नहीं।</li>
<li>उन कार्यों की पहचान करें जो पूरी तरह से खत्म किए जा सकते हैं।</li>
<li>गुणवत्ता या नियंत्रण के नुकसान के बिना सही तरीके से प्रतिनिधि करें।</li>
</ul>
<hr />
<h2>यह महत्वपूर्ण क्यों है</h2>
<ul>
<li><strong>समय की लागत</strong>: कम मूल्य के कार्य जो प्रति वर्ष 50+ घंटे लेते हैं।</li>
<li><strong>मानसिक भार</strong>: छोटे निरंतर कार्य मस्तिष्क की क्षमता को खपत करते हैं।</li>
<li><strong>अवसर की लागत</strong>: आप यह करते समय उच्च मूल्य का काम नहीं कर सकते।</li>
<li><strong>टीम की वृद्धि</strong>: प्रतिनिधिमंडन दूसरों को विकसित करता है और क्षमता बनाता है।</li>
</ul>
<hr />
<h2>गहरा विश्लेषण</h2>
<h3>1. प्रतिनिधिमंडन बनाम उन्मूलन</h3>
<ul>
<li><strong>प्रतिनिधिमंडन</strong>: किसी और को कार्य सौंपें जो इसे बेहतर या सस्ता कर सकते हैं।</li>
<li><strong>उन्मूलन</strong>: कार्य को छोड़ दें क्योंकि यह वास्तव में आवश्यक नहीं है।</li>
<li><strong>निर्णय बिंदु</strong>: पहले पहचानें कि कौन से कार्य कम मूल्य के हैं।</li>
</ul>
<h3>2. प्रतिनिधि योग्य कार्य</h3>
<ul>
<li>नियमित कार्य (ईमेल फ़िल्टर, कैलेंडर प्रबंधन)।</li>
<li>अनुवाद, डेटा प्रविष्टि, बुनियादी अनुसंधान।</li>
<li>तकनीकी समर्थन (आपका मुख्य काम नहीं)।</li>
<li>रचनात्मक समर्थन (प्रूफ़रीडिंग, स्वरूपण)।</li>
<li><strong>मानदंड</strong>: व्यक्ति इसे कर सकता है और आप अपना समय मुक्त करके अधिक मूल्य बनाते हैं।</li>
</ul>
<h3>3. प्रतिनिधि न योग्य कार्य</h3>
<ul>
<li>निर्णय जो केवल आप ले सकते हैं।</li>
<li>उच्च जोखिम वाली बातचीत (ग्राहक वार्तालाप, सलाह)।</li>
<li>रणनीतिक सोच और योजना।</li>
<li><strong>अपवाद</strong>: इन्हें सौंपने से बदतर परिणाम निकलते हैं।</li>
</ul>
<h3>4. समाप्त योग्य कार्य</h3>
<ul>
<li><strong>परीक्षा</strong>: यदि आप यह नहीं करते हैं तो क्या मूल्य खो जाएगा?</li>
<li>यदि उत्तर "कुछ नहीं" या "बहुत कम" है तो खत्म करें।</li>
<li><strong>उदाहरण</strong>: अनावश्यक रिपोर्ट, कम KPI मेट्रिक्स, अनावश्यक समीक्षा।</li>
</ul>
<h3>5. प्रतिनिधि कैसे करें</h3>
<ul>
<li>स्पष्ट निर्देश: क्या अपेक्षित है? यह कब तैयार होना चाहिए?</li>
<li>स्वायत्तता: उन्हें समाधान में स्वतंत्रता दें।</li>
<li>प्रतिक्रिया: नियमित जांच, समर्थन, सीखना।</li>
<li>जवाबदेही: वे जिम्मेदार हैं, लेकिन आप नियंत्रण में हैं।</li>
</ul>
<hr />
<h2>व्यावहारिक व्यायाम (30 मिनट) — कार्य लेखा परीक्षा: प्रतिनिधिमंडन और उन्मूलन</h2>
<ol>
<li><strong>कार्य सूची</strong>: एक हफ्ते में सभी कार्यों को लिखें। लगभग 50-80 आइटम।</li>
<li><strong>प्रतिनिधि योग्य</strong>: हर कार्य को चिह्नित करें जो प्रतिनिधि किया जा सकता है (C और D श्रेणी)।</li>
<li><strong>खत्म योग्य</strong>: हर कम मूल्य के कार्य को चिह्नित करें जिसे छोड़ा जा सकता है।</li>
<li><strong>योजना</strong>: अगले 30 दिनों के लिए 3 प्रतिनिधिमंडन या उन्मूलन के अवसरों की पहचान करें।</li>
<li><strong>कार्रवाई</strong>: इस हफ्ते खत्म करने के लिए कम से कम 1 कार्य और प्रतिनिधि के लिए 1 चुनें।</li>
</ol>
<hr />
<h2>आत्म-जांच</h2>
<ul>
<li>✅ मैं जानता हूँ कि कौन से कार्य प्रतिनिधि किए जा सकते हैं और कौन से नहीं।</li>
<li>✅ मेरे पास विचार करने के लिए कम मूल्य के कार्यों की सूची है।</li>
<li>✅ मैंने कम से कम 3 प्रतिनिधि योग्य कार्यों की पहचान की है।</li>
<li>✅ मैंने कम से कम 5 खत्म योग्य कार्यों की पहचान की है।</li>
<li>✅ मेरे पास अपने पहले प्रतिनिधिमंडन/उन्मूलन के लिए एक कार्य योजना है।</li>
</ul>`,
    emailSubject: 'उत्पादकता 2026 – दिन 9: प्रतिनिधिमंडन बनाम उन्मूलन',
    emailBody: `<h1>उत्पादकता 2026 – दिन 9</h1>
<h2>प्रतिनिधिमंडन बनाम उन्मूलन: कब प्रतिनिधि करना है, क्या समाप्त करना है</h2>
<p><em>हर कार्य आपके साथ नहीं रहता। कुछ को बस खत्म करना होगा।</em></p>
<p>आज आप प्रतिनिधिमंडन और उन्मूलन के बीच अंतर को समझकर अपना समय कैसे मुक्त करें यह सीखेंगे। हर कार्य आपके साथ नहीं रहना चाहिए—कुछ को दूसरों को सौंपा जा सकता है, कुछ को पूरी तरह समाप्त किया जाना चाहिए।</li>
<p><strong>लक्ष्य</strong>: अगले 30 दिनों में कम मूल्य के कार्यों को कम से कम 40% कम करें।</p>
<p><strong>क्विज़</strong>: अपनी समझ की पुष्टि करने के लिए 5 प्रश्नों के उत्तर दें।</p>
<p><a href="{{APP_URL}}/hi/courses/${COURSE_ID_BASE}_HI/day/9">पाठ खोलें →</a></p>`
  }
};

// QUIZ QUESTIONS FOR LESSON 9
const QUIZ_9: Record<string, Array<{
  question: string;
  options: string[];
  correctIndex: number;
}>> = {
  hu: [
    {
      question: 'Mi a fő különbség a delegálás és a kiiktatás között?',
      options: ['Nincs különbség', 'Delegálás: másra adás; Kiiktatás: feladat elhagyása', 'Delegálás: feladat elhagyása; Kiiktatás: másra adás', 'Csak a kiiktatás szükséges'],
      correctIndex: 1
    },
    {
      question: 'Mely feladatok delegálhatók?',
      options: ['Csak döntések', 'Stratégia', 'Rutinfeladatok, kutatás, technikai támogatás', 'Mentori munka'],
      correctIndex: 2
    },
    {
      question: 'Hogyan lehet felismerni egy kiiktatható feladatot?',
      options: ['Nagyon sok időt vesz el', 'Fontos és magas prioritás', 'Ha kimarad, nincs vagy nagyon kevés veszteség', 'Csak vezetők végzik'],
      correctIndex: 2
    },
    {
      question: 'Mik a nem delegálható feladatok?',
      options: ['Rutin feladatok', 'Döntések, stratégiai gondolkodás, magas kockázatú interakciók', 'Email szűrés', 'Tervezés'],
      correctIndex: 1
    },
    {
      question: 'Melyik kritérium fontos a sikeres delegáláshoz?',
      options: ['Csak a végeredmény', 'Világos utasítás, autonómia, visszajelzés, felelősség', 'Csak a vezetőe feladata', 'Nincs szükség visszajelzésre'],
      correctIndex: 1
    }
  ],
  en: [
    {
      question: 'What is the main difference between delegation and elimination?',
      options: ['No difference', 'Delegation: assign to others; Elimination: drop the task', 'Delegation: drop task; Elimination: assign to others', 'Only elimination is needed'],
      correctIndex: 1
    },
    {
      question: 'Which tasks can be delegated?',
      options: ['Only decisions', 'Strategy', 'Routine tasks, research, technical support', 'Mentoring'],
      correctIndex: 2
    },
    {
      question: 'How do you identify an eliminable task?',
      options: ['It takes a lot of time', 'Important and high priority', 'If skipped, there is no or minimal loss', 'Only managers do it'],
      correctIndex: 2
    },
    {
      question: 'What are non-delegable tasks?',
      options: ['Routine tasks', 'Decisions, strategic thinking, high-risk interactions', 'Email filtering', 'Planning'],
      correctIndex: 1
    },
    {
      question: 'Which criterion is important for successful delegation?',
      options: ['Only the end result', 'Clear instructions, autonomy, feedback, accountability', 'Only manager responsibility', 'No need for feedback'],
      correctIndex: 1
    }
  ],
  tr: [
    {
      question: 'Delegasyon ile eliminasyon arasındaki temel fark nedir?',
      options: ['Fark yok', 'Delegasyon: başkasına vermek; Eliminasyon: görevi bırakmak', 'Delegasyon: görevi bırakmak; Eliminasyon: başkasına vermek', 'Sadece eliminasyon gerekli'],
      correctIndex: 1
    },
    {
      question: 'Hangi görevler delege edilebilir?',
      options: ['Sadece kararlar', 'Strateji', 'Rutin görevler, araştırma, teknik destek', 'Mentorluk'],
      correctIndex: 2
    },
    {
      question: 'Elimine edilebilir bir görevi nasıl tanırsınız?',
      options: ['Çok zaman alır', 'Önemli ve yüksek öncelik', 'Atlanırsa hiçbir veya minimal kayıp vardır', 'Sadece yöneticiler yapar'],
      correctIndex: 2
    },
    {
      question: 'Delege edilemeyen görevler nelerdir?',
      options: ['Rutin görevler', 'Kararlar, stratejik düşünce, yüksek riskli etkileşimler', 'E-posta filtreleme', 'Planlama'],
      correctIndex: 1
    },
    {
      question: 'Başarılı delegasyon için hangi kriter önemlidir?',
      options: ['Sadece son sonuç', 'Açık talimatlar, otonomi, geri bildirim, hesap verebilirlik', 'Sadece yönetici sorumluluğu', 'Geri bildirime gerek yok'],
      correctIndex: 1
    }
  ],
  bg: [
    {
      question: 'Каква е основната разлика между делегирането и премахването?',
      options: ['Няма разлика', 'Делегиране: препращане към други; Премахване: оставяне на задача', 'Делегиране: оставяне на задача; Премахване: препращане към други', 'Само премахването е необходимо'],
      correctIndex: 1
    },
    {
      question: 'Кои задачи могат да бъдат делегирани?',
      options: ['Само решения', 'Стратегия', 'Рутинни задачи, изследване, технически поддръжка', 'Менторство'],
      correctIndex: 2
    },
    {
      question: 'Как识别вате задача, която може да бъде премахната?',
      options: ['Отнема много време', 'Важна и висока приоритет', 'Ако се пропусне, няма или минимална загуба', 'Само мениджъри го правят'],
      correctIndex: 2
    },
    {
      question: 'Кои са неделегируемите задачи?',
      options: ['Рутинни задачи', 'Решения, стратегическо мислене, високорискови взаимодействия', 'Филтриране на имейли', 'Планиране'],
      correctIndex: 1
    },
    {
      question: 'Кой критерий е важен за успешното делегиране?',
      options: ['Само крайния резултат', 'Ясни инструкции, автономия, обратна връзка, отговорност', 'Само отговорност на мениджъра', 'Обратна връзка не е необходима'],
      correctIndex: 1
    }
  ],
  pl: [
    {
      question: 'Jaka jest główna różnica między delegowaniem a eliminacją?',
      options: ['Brak różnicy', 'Delegowanie: przekazanie innym; Eliminacja: porzucenie zadania', 'Delegowanie: porzucenie zadania; Eliminacja: przekazanie innym', 'Tylko eliminacja jest konieczna'],
      correctIndex: 1
    },
    {
      question: 'Które zadania można delegować?',
      options: ['Tylko decyzje', 'Strategia', 'Zadania rutynowe, badania, wsparcie techniczne', 'Mentoring'],
      correctIndex: 2
    },
    {
      question: 'Jak identyfikujesz zadanie do wyeliminowania?',
      options: ['Zajmuje dużo czasu', 'Ważne i wysoki priorytet', 'Jeśli go pominąć, brak lub minimalna strata', 'Tylko menedżerowie to robią'],
      correctIndex: 2
    },
    {
      question: 'Jakie są zadania niedelegowalne?',
      options: ['Zadania rutynowe', 'Decyzje, myślenie strategiczne, interakcje wysokiego ryzyka', 'Filtrowanie e-maili', 'Planowanie'],
      correctIndex: 1
    },
    {
      question: 'Który kryterium jest ważny do sukcesu delegowania?',
      options: ['Tylko wynik końcowy', 'Jasne instrukcje, autonomia, opinia zwrotna, odpowiedzialność', 'Tylko odpowiedzialność menedżera', 'Nie ma potrzeby opinii zwrotnej'],
      correctIndex: 1
    }
  ],
  vi: [
    {
      question: 'Sự khác biệt chính giữa phân công và loại bỏ là gì?',
      options: ['Không có khác biệt', 'Phân công: giao cho người khác; Loại bỏ: bỏ nhiệm vụ', 'Phân công: bỏ nhiệm vụ; Loại bỏ: giao cho người khác', 'Chỉ loại bỏ là cần thiết'],
      correctIndex: 1
    },
    {
      question: 'Những nhiệm vụ nào có thể được phân công?',
      options: ['Chỉ quyết định', 'Chiến lược', 'Nhiệm vụ thường lệ, nghiên cứu, hỗ trợ kỹ thuật', 'Cố vấn'],
      correctIndex: 2
    },
    {
      question: 'Bạn xác định một nhiệm vụ có thể loại bỏ như thế nào?',
      options: ['Mất nhiều thời gian', 'Quan trọng và ưu tiên cao', 'Nếu bỏ qua, không có hoặc mất rất ít', 'Chỉ các nhà quản lý làm'],
      correctIndex: 2
    },
    {
      question: 'Những nhiệm vụ nào không thể phân công?',
      options: ['Nhiệm vụ thường lệ', 'Quyết định, tư duy chiến lược, tương tác rủi ro cao', 'Lọc email', 'Lập kế hoạch'],
      correctIndex: 1
    },
    {
      question: 'Tiêu chí nào quan trọng cho phân công thành công?',
      options: ['Chỉ kết quả cuối cùng', 'Hướng dẫn rõ ràng, tự chủ, phản hồi, trách nhiệm', 'Chỉ trách nhiệm của người quản lý', 'Không cần phản hồi'],
      correctIndex: 1
    }
  ],
  id: [
    {
      question: 'Apa perbedaan utama antara delegasi dan eliminasi?',
      options: ['Tidak ada perbedaan', 'Delegasi: serahkan ke orang lain; Eliminasi: tinggalkan tugas', 'Delegasi: tinggalkan tugas; Eliminasi: serahkan ke orang lain', 'Hanya eliminasi yang diperlukan'],
      correctIndex: 1
    },
    {
      question: 'Tugas mana yang dapat didelegasikan?',
      options: ['Hanya keputusan', 'Strategi', 'Tugas rutin, penelitian, dukungan teknis', 'Mentoring'],
      correctIndex: 2
    },
    {
      question: 'Bagaimana Anda mengidentifikasi tugas yang dapat dieliminasi?',
      options: ['Memakan banyak waktu', 'Penting dan prioritas tinggi', 'Jika diabaikan, tidak ada atau kerugian minimal', 'Hanya manajer yang melakukannya'],
      correctIndex: 2
    },
    {
      question: 'Apa tugas yang tidak dapat didelegasikan?',
      options: ['Tugas rutin', 'Keputusan, pemikiran strategis, interaksi berisiko tinggi', 'Penyaringan email', 'Perencanaan'],
      correctIndex: 1
    },
    {
      question: 'Kriteria mana yang penting untuk delegasi yang berhasil?',
      options: ['Hanya hasil akhir', 'Instruksi jelas, otonomi, umpan balik, akuntabilitas', 'Hanya tanggung jawab manajer', 'Tidak perlu umpan balik'],
      correctIndex: 1
    }
  ],
  ar: [
    {
      question: 'ما الفرق الرئيسي بين التفويض والحذف؟',
      options: ['لا فرق', 'التفويض: تمرير للآخرين؛ الحذف: ترك المهمة', 'التفويض: ترك المهمة؛ الحذف: تمرير للآخرين', 'فقط الحذف مطلوب'],
      correctIndex: 1
    },
    {
      question: 'ما المهام التي يمكن تفويضها؟',
      options: ['فقط القرارات', 'الاستراتيجية', 'المهام الروتينية والبحث والدعم الفني', 'التوجيه'],
      correctIndex: 2
    },
    {
      question: 'كيف تحدد مهمة يمكن حذفها؟',
      options: ['تستغرق وقتاً طويلاً', 'مهمة وأولوية عالية', 'إذا تم تخطيها لا توجد أو خسارة بسيطة', 'فقط المديرون يفعلونها'],
      correctIndex: 2
    },
    {
      question: 'ما المهام التي لا يمكن تفويضها؟',
      options: ['مهام روتينية', 'قرارات وتفكير استراتيجي وتفاعلات عالية المخاطر', 'تصفية البريد الإلكتروني', 'التخطيط'],
      correctIndex: 1
    },
    {
      question: 'أي معيار مهم للتفويض الناجح؟',
      options: ['فقط النتيجة النهائية', 'تعليمات واضحة واستقلالية وردود فعل والمساءلة', 'فقط مسؤولية المدير', 'لا حاجة لردود الفعل'],
      correctIndex: 1
    }
  ],
  pt: [
    {
      question: 'Qual é a principal diferença entre delegação e eliminação?',
      options: ['Nenhuma diferença', 'Delegação: repassar para outros; Eliminação: abandonar a tarefa', 'Delegação: abandonar tarefa; Eliminação: repassar para outros', 'Apenas eliminação é necessária'],
      correctIndex: 1
    },
    {
      question: 'Quais tarefas podem ser delegadas?',
      options: ['Apenas decisões', 'Estratégia', 'Tarefas rotineiras, pesquisa, suporte técnico', 'Mentorado'],
      correctIndex: 2
    },
    {
      question: 'Como você identifica uma tarefa que pode ser eliminada?',
      options: ['Consome muito tempo', 'Importante e alta prioridade', 'Se ignorada, há pouca ou nenhuma perda', 'Apenas gerentes fazem'],
      correctIndex: 2
    },
    {
      question: 'Quais são tarefas não delegáveis?',
      options: ['Tarefas rotineiras', 'Decisões, pensamento estratégico, interações de alto risco', 'Filtragem de email', 'Planejamento'],
      correctIndex: 1
    },
    {
      question: 'Qual critério é importante para delegação bem-sucedida?',
      options: ['Apenas o resultado final', 'Instruções claras, autonomia, feedback, responsabilidade', 'Apenas responsabilidade do gerente', 'Sem necessidade de feedback'],
      correctIndex: 1
    }
  ],
  hi: [
    {
      question: 'प्रतिनिधिमंडन और उन्मूलन के बीच मुख्य अंतर क्या है?',
      options: ['कोई अंतर नहीं', 'प्रतिनिधिमंडन: दूसरों को सौंपें; उन्मूलन: कार्य छोड़ दें', 'प्रतिनिधिमंडन: कार्य छोड़ दें; उन्मूलन: दूसरों को सौंपें', 'केवल उन्मूलन आवश्यक है'],
      correctIndex: 1
    },
    {
      question: 'कौन से कार्य प्रतिनिधि किए जा सकते हैं?',
      options: ['केवल निर्णय', 'रणनीति', 'नियमित कार्य, अनुसंधान, तकनीकी समर्थन', 'सलाह'],
      correctIndex: 2
    },
    {
      question: 'आप समाप्त किए जाने वाले कार्य की पहचान कैसे करते हैं?',
      options: ['बहुत समय लगता है', 'महत्वपूर्ण और उच्च प्राथमिकता', 'यदि छोड़ा जाए तो कोई या न्यूनतम हानि', 'केवल प्रबंधक करते हैं'],
      correctIndex: 2
    },
    {
      question: 'गैर-प्रतिनिधि योग्य कार्य क्या हैं?',
      options: ['नियमित कार्य', 'निर्णय, रणनीतिक सोच, उच्च जोखिम वाली बातचीत', 'ईमेल फ़िल्टर', 'योजना'],
      correctIndex: 1
    },
    {
      question: 'सफल प्रतिनिधिमंडन के लिए कौन सी कसौटी महत्वपूर्ण है?',
      options: ['केवल अंतिम परिणाम', 'स्पष्ट निर्देश, स्वायत्तता, प्रतिक्रिया, जवाबदेही', 'केवल प्रबंधक की जिम्मेदारी', 'प्रतिक्रिया की आवश्यकता नहीं'],
      correctIndex: 1
    }
  ]
};

// ============================================================================
// SEED FUNCTION
// ============================================================================

async function seedLesson9() {
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
        const existingLesson = await Lesson.findOne({ lessonId: `${COURSE_ID_BASE}_${lang.toUpperCase()}_DAY_9` });
        
        let lesson;
        if (!existingLesson) {
          // Create lesson only if it doesn't exist
          lesson = new Lesson({
            lessonId: `${COURSE_ID_BASE}_${lang.toUpperCase()}_DAY_9`,
            courseId: course._id,
            dayNumber: 9,
            title: LESSON_9[lang].title,
            content: LESSON_9[lang].content,
            emailSubject: LESSON_9[lang].emailSubject,
            emailBody: LESSON_9[lang].emailBody.replace(/\{\{APP_URL\}\}/g, process.env.NEXTAUTH_URL || 'https://www.amanoba.com')
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
        const quizQuestions = QUIZ_9[lang];
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
  console.log(`\n✅ Lesson 9 (Day 9) seeded successfully!\n`);

  process.exit(0);
}

seedLesson9().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
