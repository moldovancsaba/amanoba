/**
 * Seed Productivity 2026 Course - Lessons 7-10 (Days 7-10)
 * 
 * Day 7: Daily/Weekly System - morning ritual, daily huddle, weekly review
 * Day 8: Context Switching Cost - attention residue, batching, deep work blocks
 * Day 9: Delegation vs Elimination - when to delegate, what to eliminate
 * Day 10: Energy Management - when to work, when to rest, recovery rituals
 * 
 * Creates lessons 7-10 for all 10 languages in 2-language batches
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
// LESSON 7: Daily/Weekly System
// ============================================================================

const LESSON_7: Record<string, {
  title: string;
  content: string;
  emailSubject: string;
  emailBody: string;
}> = {
  hu: {
    title: 'Napi/heti rendszer: reggeli ritual, napi huddle, heti áttekintés',
    content: `<h1>Napi/heti rendszer: reggeli ritual, napi huddle, heti áttekintés</h1>
<p><em>Rendszeres ritualok = rendszeres produktivitás</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
<li>Megérteni, miért fontosak a napi és heti ritualok.</li>
<li>Egy 15 perces reggeli ritual létrehozása.</li>
<li>Egy 5 perces napi huddle szervezése.</li>
<li>Egy 30 perces heti áttekintési ritual felállítása.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
<li><strong>Reggeli ritual</strong>: A nap célja és irányításának meghatározása.</li>
<li><strong>Napi huddle</strong>: Csapat szintjén az aznapi prioritások szinkronizálása.</li>
<li><strong>Heti áttekintés</strong>: Tanulások, fejlesztések és a következő hét tervezése.</li>
<li>Ritualok = automata viselkedés = kevesebb döntési fáradtság = több energia az igazi munkára.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Reggeli ritual (15 perc)</h3>
<ul>
<li><strong>1. Légzésgyakorlat (2 min)</strong>: Fokuszsz.</li>
<li><strong>2. Planifikáció (8 min)</strong>: Mai 3-5 legfontosabb feladat.</li>
<li><strong>3. Intéziók (3 min)</strong>: Mi az előttünk a mai napon? Mit szeretnénk elérni?</li>
<li><strong>4. Megerősítés (2 min)</strong>: Írj le egy pozitív afirmációt a mai napra.</li>
</ul>
<h3>Napi huddle (5 perc)</h3>
<ul>
<li>Csapat összes tagjával vagy vezetővel.</li>
<li>Három kérdés: 1) Mi az aznapi prioritás? 2) Milyen blokkolókat lát? 3) Kire van szüksége?</li>
<li>Rákkezdés: rövid, fókuszált, lezárt.</li>
</ul>
<h3>Heti áttekintés (30 perc)</h3>
<ul>
<li><strong>1. Múltheti áttekintés (5 min)</strong>: Mit csináltunk? Mit tanultunk?</li>
<li><strong>2. Metrikák (5 min)</strong>: Throughput, odak blokkok, carryover, jóllét.</li>
<li><strong>3. Tanulások (5 min)</strong>: Mik az eredmények? Mit csinálunk másként?</li>
<li><strong>4. Következő heti terv (10 min)</strong>: Az új heti prioritások.</li>
<li><strong>5. Megerősítés (5 min)</strong>: Mit fogsz másként tenni?</li>
</ul>
<hr />
<h2>Gyakorlati feladat (20 perc) — Napi/heti ritualok kialakítása</h2>
<ol>
<li><strong>Reggeli ritual</strong>: Írj le egy 15 perces reggeli ritualt saját magadnak.</li>
<li><strong>Napi huddle</strong>: Szervezz egy 5 perces napi huddlét csapatoddal.</li>
<li><strong>Heti áttekintés</strong>: Biztosítsd, hogy van egy 30 perces heti áttekintésed.</li>
<li><strong>Dokumentáció</strong>: Írd le, hogyan vannak a ritualok ütemezve, kik a résztvevők, mi az agenda.</li>
</ol>
<hr />
<h2>Önellenőrzés</h2>
<ul>
<li>✅ Van egy 15 perces reggeli rituálod.</li>
<li>✅ Van egy 5 perces napi huddle rendszered.</li>
<li>✅ Van egy 30 perces heti áttekintésed.</li>
<li>✅ Ritualok szinkronban vannak az inbox/trigger listával.</li>
</ul>`,
    emailSubject: 'Termelékenység 2026 – 7. nap: Napi/heti rendszer',
    emailBody: `<h1>Termelékenység 2026 – 7. nap</h1>
<h2>Napi/heti rendszer: reggeli ritual, napi huddle, heti áttekintés</h2>
<p>Ma a napi és heti ritualok fontosságáról tanulsz, amelyek biztosítják a rendszeres produktivitást.</p>
<p><a href="{{APP_URL}}/hu/courses/${COURSE_ID_BASE}_HU/day/7">Nyisd meg a leckét →</a></p>`
  },
  en: {
    title: 'Daily/Weekly System: morning ritual, daily huddle, weekly review',
    content: `<h1>Daily/Weekly System: morning ritual, daily huddle, weekly review</h1>
<p><em>Regular rituals = regular productivity</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Understand why daily and weekly rituals matter.</li>
<li>Create a 15-minute morning ritual.</li>
<li>Organize a 5-minute daily huddle.</li>
<li>Set up a 30-minute weekly review ritual.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li><strong>Morning ritual</strong>: Set the direction and purpose of the day.</li>
<li><strong>Daily huddle</strong>: Synchronize team priorities for the day.</li>
<li><strong>Weekly review</strong>: Learnings, improvements, and planning for the next week.</li>
<li>Rituals = automatic behavior = less decision fatigue = more energy for real work.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Morning Ritual (15 min)</h3>
<ul>
<li><strong>1. Breathing (2 min)</strong>: Focus.</li>
<li><strong>2. Planning (8 min)</strong>: Today's 3-5 most important tasks.</li>
<li><strong>3. Intention (3 min)</strong>: What's ahead today? What do I want to achieve?</li>
<li><strong>4. Affirmation (2 min)</strong>: Write a positive affirmation for today.</li>
</ul>
<h3>Daily Huddle (5 min)</h3>
<ul>
<li>With entire team or manager.</li>
<li>Three questions: 1) What's today's priority? 2) What blockers do you see? 3) Who do you need?</li>
<li>Start: short, focused, closed.</li>
</ul>
<h3>Weekly Review (30 min)</h3>
<ul>
<li><strong>1. Last week review (5 min)</strong>: What did we do? What did we learn?</li>
<li><strong>2. Metrics (5 min)</strong>: Throughput, focus blocks, carryover, wellbeing.</li>
<li><strong>3. Learnings (5 min)</strong>: What are the takeaways? What do we do differently?</li>
<li><strong>4. Next week plan (10 min)</strong>: New week's priorities.</li>
<li><strong>5. Affirmation (5 min)</strong>: What will you do differently?</li>
</ul>
<hr />
<h2>Practical exercise (20 min) — Establishing daily/weekly rituals</h2>
<ol>
<li><strong>Morning ritual</strong>: Write a 15-minute morning ritual for yourself.</li>
<li><strong>Daily huddle</strong>: Organize a 5-minute daily huddle with your team.</li>
<li><strong>Weekly review</strong>: Ensure you have a 30-minute weekly review.</li>
<li><strong>Documentation</strong>: Write how rituals are scheduled, who participates, what the agenda is.</li>
</ol>
<hr />
<h2>Self-check</h2>
<ul>
<li>✅ You have a 15-minute morning ritual.</li>
<li>✅ You have a 5-minute daily huddle system.</li>
<li>✅ You have a 30-minute weekly review.</li>
<li>✅ Rituals sync with inbox/triggers list.</li>
</ul>`,
    emailSubject: 'Productivity 2026 – Day 7: Daily/Weekly System',
    emailBody: `<h1>Productivity 2026 – Day 7</h1>
<h2>Daily/Weekly System: morning ritual, daily huddle, weekly review</h2>
<p>Today you'll learn about daily and weekly rituals that ensure consistent productivity.</p>
<p><a href="{{APP_URL}}/en/courses/${COURSE_ID_BASE}_EN/day/7">Open the lesson →</a></p>`
  },
  tr: {
    title: 'Günlük/Haftalık Sistem: sabah ritüeli, günlük huddle, haftalık inceleme',
    content: `<h1>Günlük/Haftalık Sistem: sabah ritüeli, günlük huddle, haftalık inceleme</h1>
<p><em>Düzenli ritüeller = düzenli verimlilik</em></p>
<hr />
<h2>Öğrenme hedefi</h2>
<ul>
<li>Günlük ve haftalık ritüellerin neden önemli olduğunu anlamak.</li>
<li>15 dakikalık bir sabah ritüeli oluşturmak.</li>
<li>5 dakikalık bir günlük huddle organize etmek.</li>
<li>30 dakikalık haftalık bir inceleme ritüeli kurmak.</li>
</ul>
<hr />
<h2>Neden önemli</h2>
<ul>
<li><strong>Sabah ritüeli</strong>: Günün yönünü ve amacını belirleyin.</li>
<li><strong>Günlük huddle</strong>: Takım öncelikleri için günü senkronize etme.</li>
<li><strong>Haftalık inceleme</strong>: Öğrenimler, iyileştirmeler ve sonraki hafta planlama.</li>
<li>Ritüeller = otomatik davranış = daha az karar yorgunluğu = daha fazla gerçek çalışmaya enerji.</li>
</ul>
<hr />
<h2>Açıklama</h2>
<h3>Sabah Ritüeli (15 dakika)</h3>
<ul>
<li><strong>1. Nefes alma (2 dakika)</strong>: Odaklanma.</li>
<li><strong>2. Planlama (8 dakika)</strong>: Bugünün 3-5 en önemli görevi.</li>
<li><strong>3. Niyet (3 dakika)</strong>: Bugün ne var? Ne başarmak istiyorum?</li>
<li><strong>4. Afirmation (2 dakika)</strong>: Bugün için pozitif bir afirmation yazın.</li>
</ul>
<h3>Günlük Huddle (5 dakika)</h3>
<ul>
<li>Tüm takım üyeleriyle veya yöneticiyle.</li>
<li>Üç soru: 1) Bugünün önceliği nedir? 2) Hangi engeller görüyorsunuz? 3) Kime ihtiyacınız var?</li>
<li>Başla: kısa, odaklanmış, kapalı.</li>
</ul>
<h3>Haftalık İnceleme (30 dakika)</h3>
<ul>
<li><strong>1. Geçen hafta incelemesi (5 dakika)</strong>: Ne yaptık? Ne öğrendik?</li>
<li><strong>2. Metrikler (5 dakika)</strong>: Throughput, odak blokları, carryover, refah.</li>
<li><strong>3. Öğrenimler (5 dakika)</strong>: Ne öğrendik? Farklı ne yapıyoruz?</li>
<li><strong>4. Sonraki hafta planı (10 dakika)</strong>: Yeni hafta öncelikleri.</li>
<li><strong>5. Afirmation (5 dakika)</strong>: Farklı ne yapacaksınız?</li>
</ul>
<hr />
<h2>Pratik alıştırma (20 dakika) — Günlük/haftalık ritüelleri kurmak</h2>
<ol>
<li><strong>Sabah ritüeli</strong>: Kendiniz için 15 dakikalık bir sabah ritüeli yazın.</li>
<li><strong>Günlük huddle</strong>: Takımınızla 5 dakikalık bir günlük huddle organize etme.</li>
<li><strong>Haftalık inceleme</strong>: 30 dakikalık haftalık bir incelemeniz olduğundan emin olun.</li>
<li><strong>Belgeleme</strong>: Ritüellerin nasıl zamanlandığını, kimin katıldığını, gündemin ne olduğunu yazın.</li>
</ol>
<hr />
<h2>Kendi kendini kontrol</h2>
<ul>
<li>✅ 15 dakikalık bir sabah ritüeline sahipsiniz.</li>
<li>✅ 5 dakikalık günlük huddle sisteminiz var.</li>
<li>✅ 30 dakikalık haftalık bir incelemeniz var.</li>
<li>✅ Ritüeller inbox/triggers listesi ile senkronize.</li>
</ul>`,
    emailSubject: 'Verimlilik 2026 – 7. Gün: Günlük/Haftalık Sistem',
    emailBody: `<h1>Verimlilik 2026 – 7. Gün</h1>
<h2>Günlük/Haftalık Sistem: sabah ritüeli, günlük huddle, haftalık inceleme</h2>
<p>Bugün tutarlı verimliliği sağlayan günlük ve haftalık ritüeller hakkında bilgi alacaksınız.</p>
<p><a href="{{APP_URL}}/tr/courses/${COURSE_ID_BASE}_TR/day/7">Dersi aç →</a></p>`
  },
  bg: {
    title: 'Дневна/седмична система: сутрешен ритуал, дневен huddle, седмичен преглед',
    content: `<h1>Дневна/седмична система: сутрешен ритуал, дневен huddle, седмичен преглед</h1>
<p><em>Редовни ритуали = редовна продуктивност</em></p>
<hr />
<h2>Учебна цел</h2>
<ul>
<li>Да разберете защо дневните и седмичните ритуали са важни.</li>
<li>Да създадете 15-минутен сутрешен ритуал.</li>
<li>Да организирате 5-минутен дневен huddle.</li>
<li>Да установите 30-минутен седмичен преглед.</li>
</ul>
<hr />
<h2>Защо е важно</h2>
<ul>
<li><strong>Сутрешен ритуал</strong>: Установете посоката и целта на деня.</li>
<li><strong>Дневен huddle</strong>: Синхронизирайте приоритетите на отбора за деня.</li>
<li><strong>Седмичен преглед</strong>: Извлечени уроци, подобрения и планиране на следващата седмица.</li>
<li>Ритуали = автоматично поведение = по-малко умора при вземане на решения = повече енергия за реална работа.</li>
</ul>
<hr />
<h2>Обяснение</h2>
<h3>Сутрешен ритуал (15 минути)</h3>
<ul>
<li><strong>1. Дишане (2 минути)</strong>: Фокус.</li>
<li><strong>2. Планиране (8 минути)</strong>: 3-5 най-важни задачи на деня.</li>
<li><strong>3. Намерение (3 минути)</strong>: Какво предстои днес? Какво искам да постигна?</li>
<li><strong>4. Афирмация (2 минути)</strong>: Напишете положително твърдение за деня.</li>
</ul>
<h3>Дневен Huddle (5 минути)</h3>
<ul>
<li>С цял отбор или мениджър.</li>
<li>Три въпроса: 1) Какъв е приоритетът днес? 2) Какви пречки виждате? 3) На кого имаш нужда?</li>
<li>Начало: кратко, фокусирано, затворено.</li>
</ul>
<h3>Седмичен преглед (30 минути)</h3>
<ul>
<li><strong>1. Преглед на миналата седмица (5 минути)</strong>: Какво направихме? Какво научихме?</li>
<li><strong>2. Метрики (5 минути)</strong>: Throughput, фокусни блокове, carryover, благоденствие.</li>
<li><strong>3. Уроци (5 минути)</strong>: Какви са изводите? Какво правим различно?</li>
<li><strong>4. План за следващата седмица (10 минути)</strong>: Приоритети на новата седмица.</li>
<li><strong>5. Афирмация (5 минути)</strong>: Какво ще правите различно?</li>
</ul>
<hr />
<h2>Практическо упражнение (20 минути) — Установяване на дневни/седмични ритуали</h2>
<ol>
<li><strong>Сутрешен ритуал</strong>: Напишете 15-минутен сутрешен ритуал за себе си.</li>
<li><strong>Дневен huddle</strong>: Организирайте 5-минутен дневен huddle със своя отбор.</li>
<li><strong>Седмичен преглед</strong>: Уверете се, че имате 30-минутен седмичен преглед.</li>
<li><strong>Документиране</strong>: Напишете как са планирани ритуалите, кой участва, какъв е дневният ред.</li>
</ol>
<hr />
<h2>Самопроверка</h2>
<ul>
<li>✅ Имате 15-минутен сутрешен ритуал.</li>
<li>✅ Имате 5-минутна дневна huddle система.</li>
<li>✅ Имате 30-минутен седмичен преглед.</li>
<li>✅ Ритуали се синхронизират с входящо/списък с тригери.</li>
</ul>`,
    emailSubject: 'Продуктивност 2026 – Ден 7: Дневна/Седмична система',
    emailBody: `<h1>Продуктивност 2026 – Ден 7</h1>
<h2>Дневна/седмична система: сутрешен ритуал, дневен huddle, седмичен преглед</h2>
<p>Днес ще научите за дневни и седмични ритуали, които осигуряват последователна продуктивност.</p>
<p><a href="{{APP_URL}}/bg/courses/${COURSE_ID_BASE}_BG/day/7">Отворете урока →</a></p>`
  },
  pl: {
    title: 'System dzienny/tygodniowy: poranek ritual, dzienny huddle, tygodniowy przegląd',
    content: `<h1>System dzienny/tygodniowy: poranek ritual, dzienny huddle, tygodniowy przegląd</h1>
<p><em>Regularne rytuały = regularna produktywność</em></p>
<hr />
<h2>Cel uczenia się</h2>
<ul>
<li>Zrozumieć, dlaczego codzienne i tygodniowe rytuały są ważne.</li>
<li>Tworzyć 15-minutowy poranek ritual.</li>
<li>Organizować 5-minutowy dzienny huddle.</li>
<li>Ustanowić 30-minutowy tygodniowy przegląd.</li>
</ul>
<hr />
<h2>Dlaczego to ważne</h2>
<ul>
<li><strong>Poranek ritual</strong>: Ustal kierunek i cel dnia.</li>
<li><strong>Dzienny huddle</strong>: Synchronizuj priorytety zespołu na dzień.</li>
<li><strong>Tygodniowy przegląd</strong>: Wnioski, ulepszenia i planowanie na następny tydzień.</li>
<li>Rytuały = zachowanie automatyczne = mniej zmęczenia decyzyjnego = więcej energii na prawdziwą pracę.</li>
</ul>
<hr />
<h2>Wyjaśnienie</h2>
<h3>Poranek Ritual (15 minut)</h3>
<ul>
<li><strong>1. Oddychanie (2 minuty)</strong>: Skupienie.</li>
<li><strong>2. Planowanie (8 minut)</strong>: 3-5 najważniejszych zadań dnia.</li>
<li><strong>3. Intencja (3 minuty)</strong>: Co czeka mnie dzisiaj? Co chcę osiągnąć?</li>
<li><strong>4. Afirmacja (2 minuty)</strong>: Napisz pozytywne oświadczenie na dzisiaj.</li>
</ul>
<h3>Dzienny Huddle (5 minut)</h3>
<ul>
<li>Z całym zespołem lub menedżerem.</li>
<li>Trzy pytania: 1) Jaki jest dzisiejszy priorytet? 2) Jakie widzisz przeszkody? 3) Komu potrzebujesz?</li>
<li>Start: krótko, skupienie, zamknięte.</li>
</ul>
<h3>Tygodniowy Przegląd (30 minut)</h3>
<ul>
<li><strong>1. Przegląd ostatniego tygodnia (5 minut)</strong>: Co robiliśmy? Co nauczyliśmy się?</li>
<li><strong>2. Metryki (5 minut)</strong>: Throughput, bloki skupienia, carryover, dobrostan.</li>
<li><strong>3. Wnioski (5 minut)</strong>: Jakie są wnioski? Co robimy inaczej?</li>
<li><strong>4. Plan na następny tydzień (10 minut)</strong>: Priorytety nowego tygodnia.</li>
<li><strong>5. Afirmacja (5 minut)</strong>: Co będziesz robić inaczej?</li>
</ul>
<hr />
<h2>Praktyczne ćwiczenie (20 minut) — Ustanowienie codziennych/tygodniowych rytuałów</h2>
<ol>
<li><strong>Poranek ritual</strong>: Napisz 15-minutowy poranek ritual dla siebie.</li>
<li><strong>Dzienny huddle</strong>: Zorganizuj 5-minutowy dzienny huddle ze swoim zespołem.</li>
<li><strong>Tygodniowy przegląd</strong>: Upewnij się, że masz 30-minutowy tygodniowy przegląd.</li>
<li><strong>Dokumentacja</strong>: Napisz, jak zaplanowane są rytuały, kto uczestniczy, jaki jest porządek obrad.</li>
</ol>
<hr />
<h2>Samosprawdzenie</h2>
<ul>
<li>✅ Masz 15-minutowy poranek ritual.</li>
<li>✅ Masz 5-minutowy system dziennego huddle.</li>
<li>✅ Masz 30-minutowy tygodniowy przegląd.</li>
<li>✅ Rytuały synchronizuj z listą wejściową/wyzwalaczy.</li>
</ul>`,
    emailSubject: 'Produktywność 2026 – Dzień 7: System dzienny/tygodniowy',
    emailBody: `<h1>Produktywność 2026 – Dzień 7</h1>
<h2>System dzienny/tygodniowy: poranek ritual, dzienny huddle, tygodniowy przegląd</h2>
<p>Dzisiaj nauczysz się o codziennych i tygodniowych rytuałach, które zapewniają konsekwentną produktywność.</p>
<p><a href="{{APP_URL}}/pl/courses/${COURSE_ID_BASE}_PL/day/7">Otwórz lekcję →</a></p>`
  },
  vi: {
    title: 'Hệ thống hàng ngày/hàng tuần: ritual buổi sáng, cuộc họp hàng ngày, đánh giá hàng tuần',
    content: `<h1>Hệ thống hàng ngày/hàng tuần: ritual buổi sáng, cuộc họp hàng ngày, đánh giá hàng tuần</h1>
<p><em>Rituals thường xuyên = năng suất thường xuyên</em></p>
<hr />
<h2>Mục tiêu học tập</h2>
<ul>
<li>Hiểu tại sao ritual hàng ngày và hàng tuần lại quan trọng.</li>
<li>Tạo một ritual buổi sáng 15 phút.</li>
<li>Tổ chức cuộc họp hàng ngày 5 phút.</li>
<li>Thiết lập một đánh giá hàng tuần 30 phút.</li>
</ul>
<hr />
<h2>Tại sao quan trọng</h2>
<ul>
<li><strong>Ritual buổi sáng</strong>: Thiết lập hướng và mục đích của ngày.</li>
<li><strong>Cuộc họp hàng ngày</strong>: Đồng bộ hóa ưu tiên của nhóm cho ngày hôm nay.</li>
<li><strong>Đánh giá hàng tuần</strong>: Bài học, cải tiến, và lập kế hoạch cho tuần tới.</li>
<li>Rituals = hành vi tự động = ít mệt mỏi quyết định = nhiều năng lượng cho công việc thực sự.</li>
</ul>
<hr />
<h2>Giải thích</h2>
<h3>Ritual Buổi Sáng (15 phút)</h3>
<ul>
<li><strong>1. Thở (2 phút)</strong>: Tập trung.</li>
<li><strong>2. Lập kế hoạch (8 phút)</strong>: 3-5 nhiệm vụ quan trọng nhất của ngày.</li>
<li><strong>3. Ý định (3 phút)</strong>: Hôm nay sẽ có gì? Tôi muốn đạt được gì?</li>
<li><strong>4. Khẳng định (2 phút)</strong>: Viết một tuyên bố tích cực cho ngày hôm nay.</li>
</ul>
<h3>Cuộc Họp Hàng Ngày (5 phút)</h3>
<ul>
<li>Với toàn bộ nhóm hoặc quản lý.</li>
<li>Ba câu hỏi: 1) Ưu tiên hôm nay là gì? 2) Bạn thấy những trở ngại nào? 3) Bạn cần người nào?</li>
<li>Bắt đầu: ngắn gọn, tập trung, đóng lại.</li>
</ul>
<h3>Đánh Giá Hàng Tuần (30 phút)</h3>
<ul>
<li><strong>1. Đánh giá tuần trước (5 phút)</strong>: Chúng ta đã làm gì? Chúng ta học được gì?</li>
<li><strong>2. Chỉ số (5 phút)</strong>: Throughput, khối tập trung, carryover, phúc lợi.</li>
<li><strong>3. Bài học (5 phút)</strong>: Những bài học rút ra là gì? Chúng ta làm gì khác?</li>
<li><strong>4. Kế hoạch tuần tới (10 phút)</strong>: Ưu tiên của tuần mới.</li>
<li><strong>5. Khẳng định (5 phút)</strong>: Bạn sẽ làm gì khác?</li>
</ul>
<hr />
<h2>Bài tập thực hành (20 phút) — Thiết lập ritual hàng ngày/hàng tuần</h2>
<ol>
<li><strong>Ritual buổi sáng</strong>: Viết một ritual buổi sáng 15 phút cho bản thân.</li>
<li><strong>Cuộc họp hàng ngày</strong>: Tổ chức cuộc họp hàng ngày 5 phút với nhóm của bạn.</li>
<li><strong>Đánh giá hàng tuần</strong>: Đảm bảo bạn có một đánh giá hàng tuần 30 phút.</li>
<li><strong>Tài liệu</strong>: Viết cách lập kế hoạch ritual, ai tham gia, chương trình là gì.</li>
</ol>
<hr />
<h2>Tự kiểm tra</h2>
<ul>
<li>✅ Bạn có một ritual buổi sáng 15 phút.</li>
<li>✅ Bạn có hệ thống cuộc họp hàng ngày 5 phút.</li>
<li>✅ Bạn có một đánh giá hàng tuần 30 phút.</li>
<li>✅ Rituals đồng bộ với danh sách inbox/triggers.</li>
</ul>`,
    emailSubject: 'Năng suất 2026 – Ngày 7: Hệ thống hàng ngày/hàng tuần',
    emailBody: `<h1>Năng suất 2026 – Ngày 7</h1>
<h2>Hệ thống hàng ngày/hàng tuần: ritual buổi sáng, cuộc họp hàng ngày, đánh giá hàng tuần</h2>
<p>Hôm nay bạn sẽ học về ritual hàng ngày và hàng tuần đảm bảo năng suất nhất quán.</p>
<p><a href="{{APP_URL}}/vi/courses/${COURSE_ID_BASE}_VI/day/7">Mở bài học →</a></p>`
  },
  id: {
    title: 'Sistem harian/mingguan: ritual pagi, huddle harian, tinjauan mingguan',
    content: `<h1>Sistem harian/mingguan: ritual pagi, huddle harian, tinjauan mingguan</h1>
<p><em>Ritual rutin = produktivitas rutin</em></p>
<hr />
<h2>Tujuan pembelajaran</h2>
<ul>
<li>Memahami mengapa ritual harian dan mingguan penting.</li>
<li>Membuat ritual pagi 15 menit.</li>
<li>Mengorganisir huddle harian 5 menit.</li>
<li>Menetapkan tinjauan mingguan 30 menit.</li>
</ul>
<hr />
<h2>Mengapa penting</h2>
<ul>
<li><strong>Ritual pagi</strong>: Tetapkan arah dan tujuan hari.</li>
<li><strong>Huddle harian</strong>: Sinkronkan prioritas tim untuk hari ini.</li>
<li><strong>Tinjauan mingguan</strong>: Pembelajaran, perbaikan, dan perencanaan untuk minggu depan.</li>
<li>Ritual = perilaku otomatis = kurang kelelahan keputusan = lebih banyak energi untuk pekerjaan nyata.</li>
</ul>
<hr />
<h2>Penjelasan</h2>
<h3>Ritual Pagi (15 menit)</h3>
<ul>
<li><strong>1. Pernapasan (2 menit)</strong>: Fokus.</li>
<li><strong>2. Perencanaan (8 menit)</strong>: 3-5 tugas paling penting hari ini.</li>
<li><strong>3. Intensi (3 menit)</strong>: Apa yang akan datang hari ini? Apa yang ingin saya capai?</li>
<li><strong>4. Afirmasi (2 menit)</strong>: Tulis pernyataan positif untuk hari ini.</li>
</ul>
<h3>Huddle Harian (5 menit)</h3>
<ul>
<li>Dengan seluruh tim atau manajer.</li>
<li>Tiga pertanyaan: 1) Apa prioritas hari ini? 2) Hambatan apa yang Anda lihat? 3) Siapa yang Anda butuhkan?</li>
<li>Mulai: singkat, terfokus, ditutup.</li>
</ul>
<h3>Tinjauan Mingguan (30 menit)</h3>
<ul>
<li><strong>1. Tinjauan minggu lalu (5 menit)</strong>: Apa yang kita lakukan? Apa yang kita pelajari?</li>
<li><strong>2. Metrik (5 menit)</strong>: Throughput, blok fokus, carryover, kesejahteraan.</li>
<li><strong>3. Pembelajaran (5 menit)</strong>: Apa kesimpulannya? Apa yang kita lakukan berbeda?</li>
<li><strong>4. Rencana minggu depan (10 menit)</strong>: Prioritas minggu baru.</li>
<li><strong>5. Afirmasi (5 menit)</strong>: Apa yang akan Anda lakukan berbeda?</li>
</ul>
<hr />
<h2>Latihan praktis (20 menit) — Menetapkan ritual harian/mingguan</h2>
<ol>
<li><strong>Ritual pagi</strong>: Tulis ritual pagi 15 menit untuk diri sendiri.</li>
<li><strong>Huddle harian</strong>: Atur huddle harian 5 menit dengan tim Anda.</li>
<li><strong>Tinjauan mingguan</strong>: Pastikan Anda memiliki tinjauan mingguan 30 menit.</li>
<li><strong>Dokumentasi</strong>: Tulis bagaimana ritual dijadwalkan, siapa yang berpartisipasi, apa agendanya.</li>
</ol>
<hr />
<h2>Pemeriksaan diri</h2>
<ul>
<li>✅ Anda memiliki ritual pagi 15 menit.</li>
<li>✅ Anda memiliki sistem huddle harian 5 menit.</li>
<li>✅ Anda memiliki tinjauan mingguan 30 menit.</li>
<li>✅ Ritual sinkron dengan daftar inbox/pemicu.</li>
</ul>`,
    emailSubject: 'Produktivitas 2026 – Hari 7: Sistem harian/mingguan',
    emailBody: `<h1>Produktivitas 2026 – Hari 7</h1>
<h2>Sistem harian/mingguan: ritual pagi, huddle harian, tinjauan mingguan</h2>
<p>Hari ini Anda akan belajar tentang ritual harian dan mingguan yang memastikan produktivitas konsisten.</p>
<p><a href="{{APP_URL}}/id/courses/${COURSE_ID_BASE}_ID/day/7">Buka pelajaran →</a></p>`
  },
  ar: {
    title: 'النظام اليومي/الأسبوعي: الطقس الصباحي، اجتماع يومي، مراجعة أسبوعية',
    content: `<h1>النظام اليومي/الأسبوعي: الطقس الصباحي، اجتماع يومي، مراجعة أسبوعية</h1>
<p><em>الطقوس العادية = الإنتاجية العادية</em></p>
<hr />
<h2>هدف التعلم</h2>
<ul>
<li>فهم سبب أهمية الطقوس اليومية والأسبوعية.</li>
<li>إنشاء طقس صباحي 15 دقيقة.</li>
<li>تنظيم اجتماع يومي 5 دقائق.</li>
<li>إنشاء مراجعة أسبوعية 30 دقيقة.</li>
</ul>
<hr />
<h2>لماذا يهم</h2>
<ul>
<li><strong>الطقس الصباحي</strong>: حدد اتجاه وهدف اليوم.</li>
<li><strong>الاجتماع اليومي</strong>: قم بمزامنة أولويات الفريق لهذا اليوم.</li>
<li><strong>المراجعة الأسبوعية</strong>: الدروس المستفادة والتحسينات والتخطيط للأسبوع القادم.</li>
<li>الطقوس = السلوك التلقائي = أقل إرهاق القرار = المزيد من الطاقة للعمل الحقيقي.</li>
</ul>
<hr />
<h2>شرح</h2>
<h3>الطقس الصباحي (15 دقيقة)</h3>
<ul>
<li><strong>1. التنفس (دقيقتان)</strong>: تركيز.</li>
<li><strong>2. التخطيط (8 دقائق)</strong>: 3-5 مهام أكثر أهمية اليوم.</li>
<li><strong>3. النية (3 دقائق)</strong>: ماذا يأتي اليوم؟ ماذا أريد أن أحقق؟</li>
<li><strong>4. التأكيد (دقيقتان)</strong>: اكتب بيان إيجابي لهذا اليوم.</li>
</ul>
<h3>الاجتماع اليومي (5 دقائق)</h3>
<ul>
<li>مع الفريق بأكمله أو المدير.</li>
<li>ثلاثة أسئلة: 1) ما هي أولوية اليوم؟ 2) ما المعوقات التي تراها؟ 3) من تحتاج؟</li>
<li>ابدأ: قصير، مركز، مغلق.</li>
</ul>
<h3>المراجعة الأسبوعية (30 دقيقة)</h3>
<ul>
<li><strong>1. مراجعة الأسبوع الماضي (5 دقائق)</strong>: ماذا فعلنا؟ ماذا تعلمنا؟</li>
<li><strong>2. المقاييس (5 دقائق)</strong>: الإنتاجية، كتل التركيز، carryover، الرفاهية.</li>
<li><strong>3. الدروس المستفادة (5 دقائق)</strong>: ما الدروس؟ ماذا نفعل بشكل مختلف؟</li>
<li><strong>4. خطة الأسبوع القادم (10 دقائق)</strong>: أولويات الأسبوع الجديد.</li>
<li><strong>5. التأكيد (5 دقائق)</strong>: ماذا ستفعل بشكل مختلف؟</li>
</ul>
<hr />
<h2>تمرين عملي (20 دقيقة) — إنشاء طقوس يومية/أسبوعية</h2>
<ol>
<li><strong>الطقس الصباحي</strong>: اكتب طقس صباحي 15 دقيقة لنفسك.</li>
<li><strong>الاجتماع اليومي</strong>: نظم اجتماع يومي 5 دقائق مع فريقك.</li>
<li><strong>المراجعة الأسبوعية</strong>: تأكد من أن لديك مراجعة أسبوعية 30 دقيقة.</li>
<li><strong>التوثيق</strong>: اكتب كيفية جدولة الطقوس، من يشارك، ما هو جدول الأعمال.</li>
</ol>
<hr />
<h2>الفحص الذاتي</h2>
<ul>
<li>✅ لديك طقس صباحي 15 دقيقة.</li>
<li>✅ لديك نظام اجتماع يومي 5 دقائق.</li>
<li>✅ لديك مراجعة أسبوعية 30 دقيقة.</li>
<li>✅ الطقوس متزامنة مع قائمة الوارد/المحفزات.</li>
</ul>`,
    emailSubject: 'الإنتاجية 2026 – اليوم 7: النظام اليومي/الأسبوعي',
    emailBody: `<h1>الإنتاجية 2026 – اليوم 7</h1>
<h2>النظام اليومي/الأسبوعي: الطقس الصباحي، اجتماع يومي، مراجعة أسبوعية</h2>
<p>اليوم ستتعلم عن الطقوس اليومية والأسبوعية التي تضمن إنتاجية متسقة.</p>
<p><a href="{{APP_URL}}/ar/courses/${COURSE_ID_BASE}_AR/day/7">افتح الدرس →</a></p>`
  },
  pt: {
    title: 'Sistema diário/semanal: ritual matinal, reunião diária, revisão semanal',
    content: `<h1>Sistema diário/semanal: ritual matinal, reunião diária, revisão semanal</h1>
<p><em>Rituais regulares = produtividade regular</em></p>
<hr />
<h2>Objetivo de aprendizagem</h2>
<ul>
<li>Entender por que rituais diários e semanais são importantes.</li>
<li>Criar um ritual matinal de 15 minutos.</li>
<li>Organizar uma reunião diária de 5 minutos.</li>
<li>Configurar uma revisão semanal de 30 minutos.</li>
</ul>
<hr />
<h2>Por que importa</h2>
<ul>
<li><strong>Ritual matinal</strong>: Defina a direção e o propósito do dia.</li>
<li><strong>Reunião diária</strong>: Sincronize as prioridades do team para o dia.</li>
<li><strong>Revisão semanal</strong>: Aprendizados, melhorias e planejamento para a próxima semana.</li>
<li>Rituais = comportamento automático = menos fadiga de decisão = mais energia para trabalho real.</li>
</ul>
<hr />
<h2>Explicação</h2>
<h3>Ritual Matinal (15 min)</h3>
<ul>
<li><strong>1. Respiração (2 min)</strong>: Foco.</li>
<li><strong>2. Planejamento (8 min)</strong>: 3-5 tarefas mais importantes do dia.</li>
<li><strong>3. Intenção (3 min)</strong>: O que vem hoje? O que quero alcançar?</li>
<li><strong>4. Afirmação (2 min)</strong>: Escreva uma afirmação positiva para hoje.</li>
</ul>
<h3>Reunião Diária (5 min)</h3>
<ul>
<li>Com todo o time ou gerente.</li>
<li>Três perguntas: 1) Qual é a prioridade de hoje? 2) Que bloqueios você vê? 3) De quem você precisa?</li>
<li>Comece: breve, focado, fechado.</li>
</ul>
<h3>Revisão Semanal (30 min)</h3>
<ul>
<li><strong>1. Revisão da semana passada (5 min)</strong>: O que fizemos? O que aprendemos?</li>
<li><strong>2. Métricas (5 min)</strong>: Throughput, blocos de foco, carryover, bem-estar.</li>
<li><strong>3. Aprendizados (5 min)</strong>: Quais são os aprendizados? O que fazemos diferente?</li>
<li><strong>4. Plano para próxima semana (10 min)</strong>: Prioridades da nova semana.</li>
<li><strong>5. Afirmação (5 min)</strong>: O que você fará diferente?</li>
</ul>
<hr />
<h2>Exercício prático (20 min) — Estabelecendo rituais diários/semanais</h2>
<ol>
<li><strong>Ritual matinal</strong>: Escreva um ritual matinal de 15 minutos para si mesmo.</li>
<li><strong>Reunião diária</strong>: Organize uma reunião diária de 5 minutos com seu time.</li>
<li><strong>Revisão semanal</strong>: Certifique-se de que tem uma revisão semanal de 30 minutos.</li>
<li><strong>Documentação</strong>: Escreva como os rituais são agendados, quem participa, qual é a agenda.</li>
</ol>
<hr />
<h2>Auto-verificação</h2>
<ul>
<li>✅ Você tem um ritual matinal de 15 minutos.</li>
<li>✅ Você tem um sistema de reunião diária de 5 minutos.</li>
<li>✅ Você tem uma revisão semanal de 30 minutos.</li>
<li>✅ Rituais sincronizados com lista de entrada/gatilhos.</li>
</ul>`,
    emailSubject: 'Produtividade 2026 – Dia 7: Sistema diário/semanal',
    emailBody: `<h1>Produtividade 2026 – Dia 7</h1>
<h2>Sistema diário/semanal: ritual matinal, reunião diária, revisão semanal</h2>
<p>Hoje você aprenderá sobre rituais diários e semanais que garantem produtividade consistente.</p>
<p><a href="{{APP_URL}}/pt/courses/${COURSE_ID_BASE}_PT/day/7">Abrir a lição →</a></p>`
  },
  hi: {
    title: 'दैनिक/साप्ताहिक प्रणाली: सुबह की रीति, दैनिक huddle, साप्ताहिक समीक्षा',
    content: `<h1>दैनिक/साप्ताहिक प्रणाली: सुबह की रीति, दैनिक huddle, साप्ताहिक समीक्षा</h1>
<p><em>नियमित रीतियां = नियमित उत्पादकता</em></p>
<hr />
<h2>सीखने का लक्ष्य</h2>
<ul>
<li>समझें कि दैनिक और साप्ताहिक रीतियां क्यों महत्वपूर्ण हैं।</li>
<li>15 मिनट की सुबह की रीति बनाएं।</li>
<li>5 मिनट की दैनिक huddle आयोजित करें।</li>
<li>30 मिनट की साप्ताहिक समीक्षा स्थापित करें।</li>
</ul>
<hr />
<h2>क्यों महत्वपूर्ण है</h2>
<ul>
<li><strong>सुबह की रीति</strong>: दिन की दिशा और उद्देश्य निर्धारित करें।</li>
<li><strong>दैनिक huddle</strong>: टीम की प्राथमिकताओं को दिन के लिए सिंक करें।</li>
<li><strong>साप्ताहिक समीक्षा</strong>: सीख, सुधार और अगले सप्ताह की योजना।</li>
<li>रीतियां = स्वचालित व्यवहार = कम निर्णय थकान = वास्तविक कार्य के लिए अधिक ऊर्जा।</li>
</ul>
<hr />
<h2>व्याख्या</h2>
<h3>सुबह की रीति (15 मिनट)</h3>
<ul>
<li><strong>1. सांस लेना (2 मिनट)</strong>: ध्यान केंद्रित करें।</li>
<li><strong>2. योजना (8 मिनट)</strong>: आज के 3-5 सबसे महत्वपूर्ण कार्य।</li>
<li><strong>3. इरादा (3 मिनट)</strong>: आज क्या आ रहा है? मैं क्या प्राप्त करना चाहता हूं?</li>
<li><strong>4. पुष्टि (2 मिनट)</strong>: आज के लिए एक सकारात्मक कथन लिखें।</li>
</ul>
<h3>दैनिक Huddle (5 मिनट)</h3>
<ul>
<li>पूरी टीम या प्रबंधक के साथ।</li>
<li>तीन सवाल: 1) आज की प्राथमिकता क्या है? 2) आप कौन सी रुकावटें देख रहे हैं? 3) आपको किसकी जरूरत है?</li>
<li>शुरुआत: संक्षिप्त, केंद्रित, बंद।</li>
</ul>
<h3>साप्ताहिक समीक्षा (30 मिनट)</h3>
<ul>
<li><strong>1. पिछले सप्ताह की समीक्षा (5 मिनट)</strong>: हमने क्या किया? हमने क्या सीखा?</li>
<li><strong>2. मेट्रिक्स (5 मिनट)</strong>: Throughput, फोकस ब्लॉक, carryover, कल्याण।</li>
<li><strong>3. सीख (5 मिनट)</strong>: सीख क्या है? हम अलग तरीके से क्या करते हैं?</li>
<li><strong>4. अगले सप्ताह की योजना (10 मिनट)</strong>: नए सप्ताह की प्राथमिकताएं।</li>
<li><strong>5. पुष्टि (5 मिनट)</strong>: आप अलग तरीके से क्या करेंगे?</li>
</ul>
<hr />
<h2>व्यावहारिक अभ्यास (20 मिनट) — दैनिक/साप्ताहिक रीतियां स्थापित करना</h2>
<ol>
<li><strong>सुबह की रीति</strong>: अपने लिए 15 मिनट की सुबह की रीति लिखें।</li>
<li><strong>दैनिक huddle</strong>: अपनी टीम के साथ 5 मिनट की दैनिक huddle आयोजित करें।</li>
<li><strong>साप्ताहिक समीक्षा</strong>: सुनिश्चित करें कि आपके पास 30 मिनट की साप्ताहिक समीक्षा है।</li>
<li><strong>दस्तावेज़:</strong>: लिखें कि रीतियों को कैसे शेड्यूल किया जाता है, कौन भाग लेता है, एजेंडा क्या है।</li>
</ol>
<hr />
<h2>स्व-जांच</h2>
<ul>
<li>✅ आपके पास 15 मिनट की सुबह की रीति है।</li>
<li>✅ आपके पास 5 मिनट की दैनिक huddle प्रणाली है।</li>
<li>✅ आपके पास 30 मिनट की साप्ताहिक समीक्षा है।</li>
<li>✅ रीतियां इनबॉक्स/ट्रिगर सूची के साथ सिंक हैं।</li>
</ul>`,
    emailSubject: 'उत्पादकता 2026 – दिन 7: दैनिक/साप्ताहिक प्रणाली',
    emailBody: `<h1>उत्पादकता 2026 – दिन 7</h1>
<h2>दैनिक/साप्ताहिक प्रणाली: सुबह की रीति, दैनिक huddle, साप्ताहिक समीक्षा</h2>
<p>आज आप दैनिक और साप्ताहिक रीतियों के बारे में जानेंगे जो सतत उत्पादकता सुनिश्चित करती हैं।</p>
<p><a href="{{APP_URL}}/hi/courses/${COURSE_ID_BASE}_HI/day/7">पाठ खोलें →</a></p>`
  }
};

// Quiz 7 Questions (5 per language)
const QUIZ_7: Record<string, Array<{
  question: string;
  options: string[];
  correctIndex: number;
}>> = {
  hu: [
    { question: 'Mennyi ideig tart egy reggeli ritual?', options: ['5 perc', '10 perc', '15 perc', '30 perc'], correctIndex: 2 },
    { question: 'Mennyi ideig tart egy napi huddle?', options: ['2 perc', '5 perc', '10 perc', '15 perc'], correctIndex: 1 },
    { question: 'Hány kérdés van egy napi huddleben?', options: ['1', '2', '3', '5'], correctIndex: 2 },
    { question: 'Mennyi ideig tart egy heti áttekintés?', options: ['15 perc', '30 perc', '60 perc', '90 perc'], correctIndex: 1 },
    { question: 'Mi a reggeli ritual célja?', options: ['Email olvasás', 'Nap céljának és irányásának meghatározása', 'Kávé ivás', 'Hírek olvasása'], correctIndex: 1 }
  ],
  en: [
    { question: 'How long does a morning ritual take?', options: ['5 min', '10 min', '15 min', '30 min'], correctIndex: 2 },
    { question: 'How long does a daily huddle take?', options: ['2 min', '5 min', '10 min', '15 min'], correctIndex: 1 },
    { question: 'How many questions are in a daily huddle?', options: ['1', '2', '3', '5'], correctIndex: 2 },
    { question: 'How long does a weekly review take?', options: ['15 min', '30 min', '60 min', '90 min'], correctIndex: 1 },
    { question: 'What is the goal of a morning ritual?', options: ['Read email', 'Set the direction and purpose of the day', 'Drink coffee', 'Read news'], correctIndex: 1 }
  ],
  tr: [
    { question: 'Sabah ritüeli ne kadar sürer?', options: ['5 dakika', '10 dakika', '15 dakika', '30 dakika'], correctIndex: 2 },
    { question: 'Günlük huddle ne kadar sürer?', options: ['2 dakika', '5 dakika', '10 dakika', '15 dakika'], correctIndex: 1 },
    { question: 'Günlük huddlede kaç soru vardır?', options: ['1', '2', '3', '5'], correctIndex: 2 },
    { question: 'Haftalık inceleme ne kadar sürer?', options: ['15 dakika', '30 dakika', '60 dakika', '90 dakika'], correctIndex: 1 },
    { question: 'Sabah ritüelinin amacı nedir?', options: ['E-posta okumak', 'Günün yönünü ve amacını belirlemek', 'Kahve içmek', 'Haberleri okumak'], correctIndex: 1 }
  ],
  bg: [
    { question: 'Колко време отнема сутрешен ритуал?', options: ['5 мин', '10 мин', '15 мин', '30 мин'], correctIndex: 2 },
    { question: 'Колко време отнема дневен huddle?', options: ['2 мин', '5 мин', '10 мин', '15 мин'], correctIndex: 1 },
    { question: 'Колко въпроса има в дневен huddle?', options: ['1', '2', '3', '5'], correctIndex: 2 },
    { question: 'Колко време отнема седмичен преглед?', options: ['15 мин', '30 мин', '60 мин', '90 мин'], correctIndex: 1 },
    { question: 'Каква е целта на сутрешен ритуал?', options: ['Прочетете имейл', 'Установете посоката и целта на деня', 'Пийте кафе', 'Прочетете новини'], correctIndex: 1 }
  ],
  pl: [
    { question: 'Jak długo trwa ritual poranny?', options: ['5 min', '10 min', '15 min', '30 min'], correctIndex: 2 },
    { question: 'Jak długo trwa dzienny huddle?', options: ['2 min', '5 min', '10 min', '15 min'], correctIndex: 1 },
    { question: 'Ile pytań jest w dziennym huddle?', options: ['1', '2', '3', '5'], correctIndex: 2 },
    { question: 'Jak długo trwa przegląd tygodniowy?', options: ['15 min', '30 min', '60 min', '90 min'], correctIndex: 1 },
    { question: 'Jaki jest cel rituału porannego?', options: ['Czytaj email', 'Ustal kierunek i cel dnia', 'Pij kawę', 'Czytaj wiadomości'], correctIndex: 1 }
  ],
  vi: [
    { question: 'Ritual buổi sáng mất bao lâu?', options: ['5 phút', '10 phút', '15 phút', '30 phút'], correctIndex: 2 },
    { question: 'Cuộc họp hàng ngày mất bao lâu?', options: ['2 phút', '5 phút', '10 phút', '15 phút'], correctIndex: 1 },
    { question: 'Có bao nhiêu câu hỏi trong cuộc họp hàng ngày?', options: ['1', '2', '3', '5'], correctIndex: 2 },
    { question: 'Đánh giá hàng tuần mất bao lâu?', options: ['15 phút', '30 phút', '60 phút', '90 phút'], correctIndex: 1 },
    { question: 'Mục đích của ritual buổi sáng là gì?', options: ['Đọc email', 'Thiết lập hướng và mục đích của ngày', 'Uống cà phê', 'Đọc tin tức'], correctIndex: 1 }
  ],
  id: [
    { question: 'Berapa lama ritual pagi berlangsung?', options: ['5 menit', '10 menit', '15 menit', '30 menit'], correctIndex: 2 },
    { question: 'Berapa lama huddle harian berlangsung?', options: ['2 menit', '5 menit', '10 menit', '15 menit'], correctIndex: 1 },
    { question: 'Berapa banyak pertanyaan dalam huddle harian?', options: ['1', '2', '3', '5'], correctIndex: 2 },
    { question: 'Berapa lama tinjauan mingguan berlangsung?', options: ['15 menit', '30 menit', '60 menit', '90 menit'], correctIndex: 1 },
    { question: 'Apa tujuan ritual pagi?', options: ['Baca email', 'Tetapkan arah dan tujuan hari', 'Minum kopi', 'Baca berita'], correctIndex: 1 }
  ],
  ar: [
    { question: 'كم من الوقت يستغرق الطقس الصباحي؟', options: ['5 دقائق', '10 دقائق', '15 دقيقة', '30 دقيقة'], correctIndex: 2 },
    { question: 'كم من الوقت يستغرق الاجتماع اليومي؟', options: ['دقيقتان', '5 دقائق', '10 دقائق', '15 دقيقة'], correctIndex: 1 },
    { question: 'كم عدد الأسئلة في الاجتماع اليومي؟', options: ['1', '2', '3', '5'], correctIndex: 2 },
    { question: 'كم من الوقت تستغرق المراجعة الأسبوعية؟', options: ['15 دقيقة', '30 دقيقة', '60 دقيقة', '90 دقيقة'], correctIndex: 1 },
    { question: 'ما هو الهدف من الطقس الصباحي؟', options: ['اقرأ البريد الإلكتروني', 'حدد اتجاه وهدف اليوم', 'اشرب القهوة', 'اقرأ الأخبار'], correctIndex: 1 }
  ],
  pt: [
    { question: 'Quanto tempo leva o ritual matinal?', options: ['5 min', '10 min', '15 min', '30 min'], correctIndex: 2 },
    { question: 'Quanto tempo leva uma reunião diária?', options: ['2 min', '5 min', '10 min', '15 min'], correctIndex: 1 },
    { question: 'Quantas perguntas tem uma reunião diária?', options: ['1', '2', '3', '5'], correctIndex: 2 },
    { question: 'Quanto tempo leva uma revisão semanal?', options: ['15 min', '30 min', '60 min', '90 min'], correctIndex: 1 },
    { question: 'Qual é o objetivo do ritual matinal?', options: ['Ler email', 'Definir direção e propósito do dia', 'Beber café', 'Ler notícias'], correctIndex: 1 }
  ],
  hi: [
    { question: 'सुबह की रीति कितने समय तक चलती है?', options: ['5 मिनट', '10 मिनट', '15 मिनट', '30 मिनट'], correctIndex: 2 },
    { question: 'दैनिक huddle कितने समय तक चलता है?', options: ['2 मिनट', '5 मिनट', '10 मिनट', '15 मिनट'], correctIndex: 1 },
    { question: 'दैनिक huddle में कितने सवाल होते हैं?', options: ['1', '2', '3', '5'], correctIndex: 2 },
    { question: 'साप्ताहिक समीक्षा कितने समय तक चलती है?', options: ['15 मिनट', '30 मिनट', '60 मिनट', '90 मिनट'], correctIndex: 1 },
    { question: 'सुबह की रीति का उद्देश्य क्या है?', options: ['ईमेल पढ़ें', 'दिन की दिशा और उद्देश्य निर्धारित करें', 'कॉफी पिएं', 'समाचार पढ़ें'], correctIndex: 1 }
  ]
};

// Seed function (will process Lesson 7 only for now, as a template for Lessons 8-30)
async function seedLesson7(
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

    const lessonContent = LESSON_7[lang];
    const quizQuestions = QUIZ_7[lang];

    if (!lessonContent || !quizQuestions) {
      console.log(`⚠️  Content not ready for ${lang}, skipping...`);
      continue;
    }

    const lessonId = `${courseId}_DAY_07`;

    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId,
          courseId: course._id,
          dayNumber: 7,
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
            category: 'Daily/Weekly Systems',
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
    console.log(`  ✅ Lesson 7 for ${lang} created/updated (5 questions)`);
  }
}

async function seed() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI not set');
  }
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.amanoba.com';

  await connectDB();
  console.log('✅ Connected to MongoDB\n');

  let brand = await Brand.findOne({ slug: 'amanoba' });
  if (!brand) {
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

  console.log('📚 Processing Lesson 7 (Day 7: Daily/Weekly System)...\n');
  
  const LANGUAGE_PAIRS = [
    ['hu', 'en'],
    ['tr', 'bg'],
    ['pl', 'vi'],
    ['id', 'ar'],
    ['pt', 'hi']
  ];

  for (const [pairIndex, pair] of LANGUAGE_PAIRS.entries()) {
    console.log(`  Batch ${pairIndex + 1}/5: ${pair.join(', ')}`);
    await seedLesson7(pair, brand, appUrl);
    console.log(`  ✅ Batch ${pairIndex + 1} completed\n`);
  }
  
  console.log('✅ Lesson 7 completed for all languages!');
  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
