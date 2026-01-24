/**
 * Seed Productivity 2026 Course - Lesson 4 (Day 4)
 * 
 * Day 4: Habits vs systems: why systems scale better
 * 
 * Creates lesson 4 for all 10 languages in 2-language batches
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

// Lesson 4 Content: Habits vs systems: why systems scale better
const LESSON_4: Record<string, {
  title: string;
  content: string;
  emailSubject: string;
  emailBody: string;
}> = {
  hu: {
    title: 'Szokások vs rendszerek: miért skálázódnak jobban a rendszerek',
    content: `<h1>Szokások vs rendszerek: miért skálázódnak jobban a rendszerek</h1>
<p><em>A termelékenység kulcsa: rendszerek, nem csak szokások</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
<li>Megérteni a különbséget szokások és rendszerek között.</li>
<li>Azonosítani, mikor szokás, mikor rendszer kell.</li>
<li>Létrehozni egy egyszerű rendszert, amely skálázódik.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
<li><strong>Szokások</strong>: Egyéni viselkedésminták. Jóak, de korlátozottak: csak akkor működnek, amikor te ott vagy.</li>
<li><strong>Rendszerek</strong>: Strukturált folyamatok, amelyek másokkal is működnek, skálázódnak, és kevésbé függnek a motivációtól.</li>
<li>A rendszerek skálázódnak: egy jó rendszer 1 emberrel és 10 emberrel is működik.</li>
<li>A szokások nem skálázódnak: csak rajtad múlnak.</li>
</ul>
<hr />
<h2>Magyarázat</h2>
<h3>Szokások</h3>
<p><strong>Definíció</strong>: Automatikus viselkedésminták, amelyeket ismétlés után alakítasz ki. Például: "Minden reggel 6-kor futok."</p>
<p><strong>Előnyök</strong>: Automatikusak, kevés döntést igényelnek, konzisztensek.</p>
<p><strong>Hátrányok</strong>: Csak rajtad múlnak, nem skálázódnak, nehezen változtathatók.</p>

<h3>Rendszerek</h3>
<p><strong>Definíció</strong>: Strukturált folyamatok, amelyek bemenetből kimenetet hoznak létre. Például: "Email feldolgozási rendszer: inbox → feldolgozás → archiválás."</p>
<p><strong>Előnyök</strong>: Skálázódnak, másokkal is működnek, kevésbé függnek a motivációtól, dokumentálhatók.</p>
<p><strong>Hátrányok</strong>: Kezdetben több időt igényelnek, struktúrát kell fenntartani.</p>

<h3>Mikor mit használj?</h3>
<ul>
<li><strong>Szokás</strong>: Egyéni, ismétlődő viselkedések (reggeli rutin, olvasás, mozgás).</li>
<li><strong>Rendszer</strong>: Folyamatok, amelyek másokkal is működnek, vagy amelyeket dokumentálni kell (email kezelés, projekt menedzsment, onboarding).</li>
</ul>

<h3>Gyakorlati példa</h3>
<p><strong>Szokás alapú megközelítés</strong>: "Emlékezz rá, hogy minden nap ellenőrizd az emailt!"</p>
<p><strong>Rendszer alapú megközelítés</strong>:
<ul>
<li>Inbox szabályok: automatikus címkézés, mappákba rendezés</li>
<li>Feldolgozási idő: 9-10, 14-15 (blokkolva a naptárban)</li>
<li>Feldolgozási szabály: minden emailre döntés (törlés, archiválás, válasz, delegálás)</li>
<li>Dokumentáció: "Email kezelési útmutató" (mások is használhatják)</li>
</ul>
</p>
<hr />
<h2>Gyakorlati feladat (20-25 perc) — Szokás vagy rendszer?</h2>
<ol>
<li><strong>Jelenlegi folyamatok listája</strong>: Írd le 5-10 folyamatot, amelyet naponta/héten használsz (email kezelés, meetingek, projekt menedzsment, stb.).</li>
<li><strong>Szokás vagy rendszer?</strong>: Minden folyamathoz döntsd el: szokás vagy rendszer? Miért?</li>
<li><strong>Rendszer tervezése</strong>: Válassz egy folyamatot, amely jelenleg szokás, és tervezz rá egy rendszert:
<ul>
<li>Mi a bemenet?</li>
<li>Mi a kimenet?</li>
<li>Milyen lépések vannak?</li>
<li>Hogyan dokumentálod?</li>
<li>Hogyan skálázódik?</li>
</ul>
</li>
<li><strong>Implementáció</strong>: Implementáld a rendszert egy hétig, és dokumentáld a tapasztalataidat.</li>
</ol>
<hr />
<h2>Önellenőrzés</h2>
<ul>
<li>✅ Megérted a különbséget szokások és rendszerek között.</li>
<li>✅ Tudod, mikor szokást, mikor rendszert használj.</li>
<li>✅ Van egy egyszerű rendszered, amely skálázódik.</li>
<li>✅ A rendszered dokumentálva van, így mások is használhatják.</li>
</ul>
<hr />
<h2>Opcionális mélyítés</h2>
<ul>
<li>James Clear: "Atomic Habits" — a szokásokról</li>
<li>Scott Adams: "How to Fail at Almost Everything" — a rendszerekről</li>
<li>Eliyahu Goldratt: "The Goal" — a rendszerek optimalizálásáról</li>
</ul>`,
    emailSubject: 'Termelékenység 2026 – 4. nap: Szokások vs rendszerek',
    emailBody: `<h1>Termelékenység 2026 – 4. nap</h1>
<h2>Szokások vs rendszerek: miért skálázódnak jobban a rendszerek</h2>
<p>Ma megtanulod a különbséget szokások és rendszerek között, és hogyan építs fel skálázható rendszereket.</p>
<p><a href="{{APP_URL}}/hu/courses/${COURSE_ID_BASE}_HU/day/4">Nyisd meg a leckét →</a></p>`
  },
  en: {
    title: 'Habits vs systems: why systems scale better',
    content: `<h1>Habits vs systems: why systems scale better</h1>
<p><em>The key to productivity: systems, not just habits</em></p>
<hr />
<h2>Learning goal</h2>
<ul>
<li>Understand the difference between habits and systems.</li>
<li>Identify when to use habits vs systems.</li>
<li>Create a simple system that scales.</li>
</ul>
<hr />
<h2>Why it matters</h2>
<ul>
<li><strong>Habits</strong>: Individual behavior patterns. They're good, but limited: only work when you're there.</li>
<li><strong>Systems</strong>: Structured processes that work with others, scale, and depend less on motivation.</li>
<li>Systems scale: a good system works with 1 person and 10 people.</li>
<li>Habits don't scale: they depend only on you.</li>
</ul>
<hr />
<h2>Explanation</h2>
<h3>Habits</h3>
<p><strong>Definition</strong>: Automatic behavior patterns you develop through repetition. For example: "I run every morning at 6 AM."</p>
<p><strong>Advantages</strong>: Automatic, require few decisions, consistent.</p>
<p><strong>Disadvantages</strong>: Depend only on you, don't scale, hard to change.</p>

<h3>Systems</h3>
<p><strong>Definition</strong>: Structured processes that create output from input. For example: "Email processing system: inbox → process → archive."</p>
<p><strong>Advantages</strong>: Scale, work with others, depend less on motivation, can be documented.</p>
<p><strong>Disadvantages</strong>: Require more time initially, need structure maintenance.</p>

<h3>When to use what?</h3>
<ul>
<li><strong>Habit</strong>: Individual, repeating behaviors (morning routine, reading, exercise).</li>
<li><strong>System</strong>: Processes that work with others, or need to be documented (email management, project management, onboarding).</li>
</ul>

<h3>Practical Example</h3>
<p><strong>Habit-based approach</strong>: "Remember to check email every day!"</p>
<p><strong>System-based approach</strong>:
<ul>
<li>Inbox rules: automatic labeling, sorting into folders</li>
<li>Processing time: 9-10 AM, 2-3 PM (blocked in calendar)</li>
<li>Processing rule: decision for every email (delete, archive, reply, delegate)</li>
<li>Documentation: "Email management guide" (others can use it too)</li>
</ul>
</p>
<hr />
<h2>Practical exercise (20-25 min) — Habit or system?</h2>
<ol>
<li><strong>Current processes list</strong>: Write down 5-10 processes you use daily/weekly (email management, meetings, project management, etc.).</li>
<li><strong>Habit or system?</strong>: For each process, decide: habit or system? Why?</li>
<li><strong>System design</strong>: Choose one process that's currently a habit, and design a system for it:
<ul>
<li>What's the input?</li>
<li>What's the output?</li>
<li>What are the steps?</li>
<li>How do you document it?</li>
<li>How does it scale?</li>
</ul>
</li>
<li><strong>Implementation</strong>: Implement the system for a week, and document your experiences.</li>
</ol>
<hr />
<h2>Self-check</h2>
<ul>
<li>✅ You understand the difference between habits and systems.</li>
<li>✅ You know when to use habits vs systems.</li>
<li>✅ You have a simple system that scales.</li>
<li>✅ Your system is documented, so others can use it too.</li>
</ul>
<hr />
<h2>Optional deepening</h2>
<ul>
<li>James Clear: "Atomic Habits" — about habits</li>
<li>Scott Adams: "How to Fail at Almost Everything" — about systems</li>
<li>Eliyahu Goldratt: "The Goal" — about system optimization</li>
</ul>`,
    emailSubject: 'Productivity 2026 – Day 4: Habits vs systems',
    emailBody: `<h1>Productivity 2026 – Day 4</h1>
<h2>Habits vs systems: why systems scale better</h2>
<p>Today you'll learn the difference between habits and systems, and how to build scalable systems.</p>
<p><a href="{{APP_URL}}/en/courses/${COURSE_ID_BASE}_EN/day/4">Open the lesson →</a></p>`
  },
  tr: {
    title: 'Alışkanlıklar vs sistemler: sistemler neden daha iyi ölçeklenir',
    content: `<h1>Alışkanlıklar vs sistemler: sistemler neden daha iyi ölçeklenir</h1>
<p><em>Verimliliğin anahtarı: sadece alışkanlıklar değil, sistemler</em></p>
<hr />
<h2>Öğrenme hedefi</h2>
<ul>
<li>Alışkanlıklar ve sistemler arasındaki farkı anlamak.</li>
<li>Ne zaman alışkanlık, ne zaman sistem kullanılacağını belirlemek.</li>
<li>Ölçeklenebilir basit bir sistem oluşturmak.</li>
</ul>
<hr />
<h2>Neden önemli</h2>
<ul>
<li><strong>Alışkanlıklar</strong>: Bireysel davranış kalıpları. İyidirler, ancak sınırlıdırlar: sadece siz oradayken çalışırlar.</li>
<li><strong>Sistemler</strong>: Başkalarıyla çalışan, ölçeklenen ve motivasyona daha az bağımlı yapılandırılmış süreçler.</li>
<li>Sistemler ölçeklenir: iyi bir sistem 1 kişiyle ve 10 kişiyle çalışır.</li>
<li>Alışkanlıklar ölçeklenmez: sadece size bağlıdırlar.</li>
</ul>
<hr />
<h2>Açıklama</h2>
<h3>Alışkanlıklar</h3>
<p><strong>Tanım</strong>: Tekrarlama yoluyla geliştirdiğiniz otomatik davranış kalıpları. Örneğin: "Her sabah 6'da koşuyorum."</p>
<p><strong>Avantajlar</strong>: Otomatik, az karar gerektirir, tutarlı.</p>
<p><strong>Dezavantajlar</strong>: Sadece size bağlı, ölçeklenmez, değiştirmesi zor.</p>

<h3>Sistemler</h3>
<p><strong>Tanım</strong>: Girdiden çıktı oluşturan yapılandırılmış süreçler. Örneğin: "E-posta işleme sistemi: gelen kutusu → işleme → arşivleme."</p>
<p><strong>Avantajlar</strong>: Ölçeklenir, başkalarıyla çalışır, motivasyona daha az bağımlı, belgelenebilir.</p>
<p><strong>Dezavantajlar</strong>: Başlangıçta daha fazla zaman gerektirir, yapı bakımı gerektirir.</p>

<h3>Ne zaman ne kullanılır?</h3>
<ul>
<li><strong>Alışkanlık</strong>: Bireysel, tekrarlayan davranışlar (sabah rutini, okuma, egzersiz).</li>
<li><strong>Sistem</strong>: Başkalarıyla çalışan veya belgelenmesi gereken süreçler (e-posta yönetimi, proje yönetimi, onboarding).</li>
</ul>

<h3>Pratik Örnek</h3>
<p><strong>Alışkanlık tabanlı yaklaşım</strong>: "Her gün e-postayı kontrol etmeyi hatırla!"</p>
<p><strong>Sistem tabanlı yaklaşım</strong>:
<ul>
<li>Gelen kutusu kuralları: otomatik etiketleme, klasörlere sıralama</li>
<li>İşleme zamanı: 9-10, 14-15 (takvimde bloklu)</li>
<li>İşleme kuralı: her e-posta için karar (sil, arşivle, yanıtla, devret)</li>
<li>Dokümantasyon: "E-posta yönetimi rehberi" (başkaları da kullanabilir)</li>
</ul>
</p>
<hr />
<h2>Pratik alıştırma (20-25 dakika) — Alışkanlık mı sistem mi?</h2>
<ol>
<li><strong>Mevcut süreçler listesi</strong>: Günlük/haftalık kullandığınız 5-10 süreci yazın (e-posta yönetimi, toplantılar, proje yönetimi, vb.).</li>
<li><strong>Alışkanlık mı sistem mi?</strong>: Her süreç için karar verin: alışkanlık mı sistem mi? Neden?</li>
<li><strong>Sistem tasarımı</strong>: Şu anda alışkanlık olan bir süreç seçin ve bunun için bir sistem tasarlayın:
<ul>
<li>Girdi nedir?</li>
<li>Çıktı nedir?</li>
<li>Adımlar nelerdir?</li>
<li>Nasıl belgelersiniz?</li>
<li>Nasıl ölçeklenir?</li>
</ul>
</li>
<li><strong>Uygulama</strong>: Sistemi bir hafta uygulayın ve deneyimlerinizi belgeleyin.</li>
</ol>
<hr />
<h2>Kendi kendini kontrol</h2>
<ul>
<li>✅ Alışkanlıklar ve sistemler arasındaki farkı anlıyorsunuz.</li>
<li>✅ Ne zaman alışkanlık, ne zaman sistem kullanılacağını biliyorsunuz.</li>
<li>✅ Ölçeklenebilir basit bir sisteminiz var.</li>
<li>✅ Sisteminiz belgelenmiş, böylece başkaları da kullanabilir.</li>
</ul>
<hr />
<h2>İsteğe bağlı derinleştirme</h2>
<ul>
<li>James Clear: "Atomic Habits" — alışkanlıklar hakkında</li>
<li>Scott Adams: "How to Fail at Almost Everything" — sistemler hakkında</li>
<li>Eliyahu Goldratt: "The Goal" — sistem optimizasyonu hakkında</li>
</ul>`,
    emailSubject: 'Verimlilik 2026 – 4. Gün: Alışkanlıklar vs sistemler',
    emailBody: `<h1>Verimlilik 2026 – 4. Gün</h1>
<h2>Alışkanlıklar vs sistemler: sistemler neden daha iyi ölçeklenir</h2>
<p>Bugün alışkanlıklar ve sistemler arasındaki farkı ve ölçeklenebilir sistemler nasıl oluşturulacağını öğreneceksiniz.</p>
<p><a href="{{APP_URL}}/tr/courses/${COURSE_ID_BASE}_TR/day/4">Dersi aç →</a></p>`
  },
  bg: {
    title: 'Навици срещу системи: защо системите се мащабират по-добре',
    content: `<h1>Навици срещу системи: защо системите се мащабират по-добре</h1>
<p><em>Ключът към продуктивността: системи, не само навици</em></p>
<hr />
<h2>Учебна цел</h2>
<ul>
<li>Да разберете разликата между навици и системи.</li>
<li>Да идентифицирате кога да използвате навици срещу системи.</li>
<li>Да създадете проста система, която се мащабира.</li>
</ul>
<hr />
<h2>Защо е важно</h2>
<ul>
<li><strong>Навици</strong>: Индивидуални модели на поведение. Добри са, но ограничени: работят само когато вие сте там.</li>
<li><strong>Системи</strong>: Структурирани процеси, които работят с други, се мащабират и зависят по-малко от мотивацията.</li>
<li>Системите се мащабират: добра система работи с 1 човек и с 10 души.</li>
<li>Навиците не се мащабират: зависят само от вас.</li>
</ul>
<hr />
<h2>Обяснение</h2>
<h3>Навици</h3>
<p><strong>Дефиниция</strong>: Автоматични модели на поведение, които развивате чрез повторение. Например: "Бягам всяка сутрин в 6 часа."</p>
<p><strong>Предимства</strong>: Автоматични, изискват малко решения, последователни.</p>
<p><strong>Недостатъци</strong>: Зависят само от вас, не се мащабират, трудно се променят.</p>

<h3>Системи</h3>
<p><strong>Дефиниция</strong>: Структурирани процеси, които създават изход от вход. Например: "Система за обработка на имейли: входяща кутия → обработка → архивиране."</p>
<p><strong>Предимства</strong>: Мащабират се, работят с други, зависят по-малко от мотивацията, могат да бъдат документирани.</p>
<p><strong>Недостатъци</strong>: Изискват повече време първоначално, нуждаят от поддръжка на структурата.</p>

<h3>Кога какво да използвате?</h3>
<ul>
<li><strong>Навик</strong>: Индивидуални, повтарящи се поведения (сутрешен рутин, четене, упражнение).</li>
<li><strong>Система</strong>: Процеси, които работят с други или трябва да бъдат документирани (управление на имейли, управление на проекти, onboarding).</li>
</ul>

<h3>Практически пример</h3>
<p><strong>Подход базиран на навик</strong>: "Помни да проверяваш имейла всеки ден!"</p>
<p><strong>Подход базиран на система</strong>:
<ul>
<li>Правила за входяща кутия: автоматично етикетиране, сортиране в папки</li>
<li>Време за обработка: 9-10, 14-15 (блокирано в календара)</li>
<li>Правило за обработка: решение за всеки имейл (изтриване, архивиране, отговор, делегиране)</li>
<li>Документация: "Ръководство за управление на имейли" (другите също могат да го използват)</li>
</ul>
</p>
<hr />
<h2>Практическо упражнение (20-25 мин) — Навик или система?</h2>
<ol>
<li><strong>Списък с текущи процеси</strong>: Напишете 5-10 процеса, които използвате дневно/седмично (управление на имейли, срещи, управление на проекти и т.н.).</li>
<li><strong>Навик или система?</strong>: За всеки процес решете: навик или система? Защо?</li>
<li><strong>Дизайн на система</strong>: Изберете един процес, който в момента е навик, и проектирайте система за него:
<ul>
<li>Какъв е входът?</li>
<li>Какъв е изходът?</li>
<li>Какви са стъпките?</li>
<li>Как го документирате?</li>
<li>Как се мащабира?</li>
</ul>
</li>
<li><strong>Имплементация</strong>: Имплементирайте системата за една седмица и документирайте опита си.</li>
</ol>
<hr />
<h2>Самопроверка</h2>
<ul>
<li>✅ Разбирате разликата между навици и системи.</li>
<li>✅ Знаете кога да използвате навици срещу системи.</li>
<li>✅ Имате проста система, която се мащабира.</li>
<li>✅ Вашата система е документирана, така че другите също могат да я използват.</li>
</ul>
<hr />
<h2>Опционално задълбочаване</h2>
<ul>
<li>James Clear: "Atomic Habits" — за навиците</li>
<li>Scott Adams: "How to Fail at Almost Everything" — за системите</li>
<li>Eliyahu Goldratt: "The Goal" — за оптимизация на системите</li>
</ul>`,
    emailSubject: 'Продуктивност 2026 – Ден 4: Навици срещу системи',
    emailBody: `<h1>Продуктивност 2026 – Ден 4</h1>
<h2>Навици срещу системи: защо системите се мащабират по-добре</h2>
<p>Днес ще научите разликата между навици и системи и как да изградите мащабируеми системи.</p>
<p><a href="{{APP_URL}}/bg/courses/${COURSE_ID_BASE}_BG/day/4">Отворете урока →</a></p>`
  },
  pl: {
    title: 'Nawyki vs systemy: dlaczego systemy lepiej się skalują',
    content: `<h1>Nawyki vs systemy: dlaczego systemy lepiej się skalują</h1>
<p><em>Klucz do produktywności: systemy, nie tylko nawyki</em></p>
<hr />
<h2>Cel uczenia się</h2>
<ul>
<li>Zrozumieć różnicę między nawykami a systemami.</li>
<li>Zidentyfikować, kiedy używać nawyków vs systemów.</li>
<li>Stworzyć prosty system, który się skaluje.</li>
</ul>
<hr />
<h2>Dlaczego to ważne</h2>
<ul>
<li><strong>Nawyki</strong>: Indywidualne wzorce zachowań. Są dobre, ale ograniczone: działają tylko gdy ty jesteś.</li>
<li><strong>Systemy</strong>: Strukturyzowane procesy, które działają z innymi, skalują się i zależą mniej od motywacji.</li>
<li>Systemy się skalują: dobry system działa z 1 osobą i z 10 osobami.</li>
<li>Nawyki się nie skalują: zależą tylko od ciebie.</li>
</ul>
<hr />
<h2>Wyjaśnienie</h2>
<h3>Nawyki</h3>
<p><strong>Definicja</strong>: Automatyczne wzorce zachowań, które rozwijasz przez powtarzanie. Na przykład: "Biegam każdego ranka o 6."</p>
<p><strong>Zalety</strong>: Automatyczne, wymagają mało decyzji, spójne.</p>
<p><strong>Wady</strong>: Zależą tylko od ciebie, nie skalują się, trudne do zmiany.</p>

<h3>Systemy</h3>
<p><strong>Definicja</strong>: Strukturyzowane procesy, które tworzą wynik z wejścia. Na przykład: "System przetwarzania e-maili: skrzynka → przetwarzanie → archiwizacja."</p>
<p><strong>Zalety</strong>: Skalują się, działają z innymi, zależą mniej od motywacji, mogą być dokumentowane.</p>
<p><strong>Wady</strong>: Wymagają więcej czasu początkowo, potrzebują utrzymania struktury.</p>

<h3>Kiedy używać czego?</h3>
<ul>
<li><strong>Nawyk</strong>: Indywidualne, powtarzające się zachowania (poranna rutyna, czytanie, ćwiczenia).</li>
<li><strong>System</strong>: Procesy, które działają z innymi lub muszą być dokumentowane (zarządzanie e-mailem, zarządzanie projektami, onboarding).</li>
</ul>

<h3>Praktyczny przykład</h3>
<p><strong>Podejście oparte na nawyku</strong>: "Pamiętaj, żeby codziennie sprawdzać e-mail!"</p>
<p><strong>Podejście oparte na systemie</strong>:
<ul>
<li>Reguły skrzynki: automatyczne etykietowanie, sortowanie do folderów</li>
<li>Czas przetwarzania: 9-10, 14-15 (zablokowane w kalendarzu)</li>
<li>Reguła przetwarzania: decyzja dla każdego e-maila (usuń, archiwizuj, odpowiedz, deleguj)</li>
<li>Dokumentacja: "Przewodnik zarządzania e-mailem" (inni też mogą użyć)</li>
</ul>
</p>
<hr />
<h2>Praktyczne ćwiczenie (20-25 min) — Nawyk czy system?</h2>
<ol>
<li><strong>Lista obecnych procesów</strong>: Zapisz 5-10 procesów, których używasz codziennie/tygodniowo (zarządzanie e-mailem, spotkania, zarządzanie projektami itp.).</li>
<li><strong>Nawyk czy system?</strong>: Dla każdego procesu zdecyduj: nawyk czy system? Dlaczego?</li>
<li><strong>Projektowanie systemu</strong>: Wybierz jeden proces, który jest obecnie nawykiem, i zaprojektuj dla niego system:
<ul>
<li>Jaki jest wejście?</li>
<li>Jaki jest wynik?</li>
<li>Jakie są kroki?</li>
<li>Jak to dokumentujesz?</li>
<li>Jak się skaluje?</li>
</ul>
</li>
<li><strong>Implementacja</strong>: Zaimplementuj system przez tydzień i udokumentuj swoje doświadczenia.</li>
</ol>
<hr />
<h2>Samosprawdzenie</h2>
<ul>
<li>✅ Rozumiesz różnicę między nawykami a systemami.</li>
<li>✅ Wiesz, kiedy używać nawyków vs systemów.</li>
<li>✅ Masz prosty system, który się skaluje.</li>
<li>✅ Twój system jest udokumentowany, więc inni też mogą go użyć.</li>
</ul>
<hr />
<h2>Opcjonalne pogłębienie</h2>
<ul>
<li>James Clear: "Atomic Habits" — o nawykach</li>
<li>Scott Adams: "How to Fail at Almost Everything" — o systemach</li>
<li>Eliyahu Goldratt: "The Goal" — o optymalizacji systemów</li>
</ul>`,
    emailSubject: 'Produktywność 2026 – Dzień 4: Nawyki vs systemy',
    emailBody: `<h1>Produktywność 2026 – Dzień 4</h1>
<h2>Nawyki vs systemy: dlaczego systemy lepiej się skalują</h2>
<p>Dzisiaj nauczysz się różnicy między nawykami a systemami oraz jak budować skalowalne systemy.</p>
<p><a href="{{APP_URL}}/pl/courses/${COURSE_ID_BASE}_PL/day/4">Otwórz lekcję →</a></p>`
  },
  vi: {
    title: 'Thói quen vs hệ thống: tại sao hệ thống mở rộng tốt hơn',
    content: `<h1>Thói quen vs hệ thống: tại sao hệ thống mở rộng tốt hơn</h1>
<p><em>Chìa khóa của năng suất: hệ thống, không chỉ thói quen</em></p>
<hr />
<h2>Mục tiêu học tập</h2>
<ul>
<li>Hiểu sự khác biệt giữa thói quen và hệ thống.</li>
<li>Xác định khi nào sử dụng thói quen vs hệ thống.</li>
<li>Tạo một hệ thống đơn giản có thể mở rộng.</li>
</ul>
<hr />
<h2>Tại sao quan trọng</h2>
<ul>
<li><strong>Thói quen</strong>: Mẫu hành vi cá nhân. Chúng tốt, nhưng hạn chế: chỉ hoạt động khi bạn có mặt.</li>
<li><strong>Hệ thống</strong>: Quy trình có cấu trúc hoạt động với người khác, mở rộng và ít phụ thuộc vào động lực.</li>
<li>Hệ thống mở rộng: một hệ thống tốt hoạt động với 1 người và 10 người.</li>
<li>Thói quen không mở rộng: chúng chỉ phụ thuộc vào bạn.</li>
</ul>
<hr />
<h2>Giải thích</h2>
<h3>Thói quen</h3>
<p><strong>Định nghĩa</strong>: Mẫu hành vi tự động bạn phát triển thông qua lặp lại. Ví dụ: "Tôi chạy mỗi sáng lúc 6 giờ."</p>
<p><strong>Ưu điểm</strong>: Tự động, yêu cầu ít quyết định, nhất quán.</p>
<p><strong>Nhược điểm</strong>: Chỉ phụ thuộc vào bạn, không mở rộng, khó thay đổi.</p>

<h3>Hệ thống</h3>
<p><strong>Định nghĩa</strong>: Quy trình có cấu trúc tạo đầu ra từ đầu vào. Ví dụ: "Hệ thống xử lý email: hộp thư đến → xử lý → lưu trữ."</p>
<p><strong>Ưu điểm</strong>: Mở rộng, hoạt động với người khác, ít phụ thuộc vào động lực, có thể được ghi chép.</p>
<p><strong>Nhược điểm</strong>: Yêu cầu nhiều thời gian ban đầu, cần bảo trì cấu trúc.</p>

<h3>Khi nào sử dụng cái gì?</h3>
<ul>
<li><strong>Thói quen</strong>: Hành vi cá nhân, lặp lại (thói quen buổi sáng, đọc sách, tập thể dục).</li>
<li><strong>Hệ thống</strong>: Quy trình hoạt động với người khác hoặc cần được ghi chép (quản lý email, quản lý dự án, onboarding).</li>
</ul>

<h3>Ví dụ thực tế</h3>
<p><strong>Cách tiếp cận dựa trên thói quen</strong>: "Nhớ kiểm tra email mỗi ngày!"</p>
<p><strong>Cách tiếp cận dựa trên hệ thống</strong>:
<ul>
<li>Quy tắc hộp thư đến: gắn nhãn tự động, sắp xếp vào thư mục</li>
<li>Thời gian xử lý: 9-10 giờ sáng, 14-15 giờ chiều (chặn trong lịch)</li>
<li>Quy tắc xử lý: quyết định cho mỗi email (xóa, lưu trữ, trả lời, ủy quyền)</li>
<li>Tài liệu: "Hướng dẫn quản lý email" (người khác cũng có thể sử dụng)</li>
</ul>
</p>
<hr />
<h2>Bài tập thực hành (20-25 phút) — Thói quen hay hệ thống?</h2>
<ol>
<li><strong>Danh sách quy trình hiện tại</strong>: Viết ra 5-10 quy trình bạn sử dụng hàng ngày/hàng tuần (quản lý email, cuộc họp, quản lý dự án, v.v.).</li>
<li><strong>Thói quen hay hệ thống?</strong>: Đối với mỗi quy trình, quyết định: thói quen hay hệ thống? Tại sao?</li>
<li><strong>Thiết kế hệ thống</strong>: Chọn một quy trình hiện là thói quen và thiết kế hệ thống cho nó:
<ul>
<li>Đầu vào là gì?</li>
<li>Đầu ra là gì?</li>
<li>Các bước là gì?</li>
<li>Bạn ghi chép nó như thế nào?</li>
<li>Nó mở rộng như thế nào?</li>
</ul>
</li>
<li><strong>Triển khai</strong>: Triển khai hệ thống trong một tuần và ghi chép kinh nghiệm của bạn.</li>
</ol>
<hr />
<h2>Tự kiểm tra</h2>
<ul>
<li>✅ Bạn hiểu sự khác biệt giữa thói quen và hệ thống.</li>
<li>✅ Bạn biết khi nào sử dụng thói quen vs hệ thống.</li>
<li>✅ Bạn có một hệ thống đơn giản có thể mở rộng.</li>
<li>✅ Hệ thống của bạn được ghi chép, vì vậy người khác cũng có thể sử dụng.</li>
</ul>
<hr />
<h2>Đào sâu tùy chọn</h2>
<ul>
<li>James Clear: "Atomic Habits" — về thói quen</li>
<li>Scott Adams: "How to Fail at Almost Everything" — về hệ thống</li>
<li>Eliyahu Goldratt: "The Goal" — về tối ưu hóa hệ thống</li>
</ul>`,
    emailSubject: 'Năng suất 2026 – Ngày 4: Thói quen vs hệ thống',
    emailBody: `<h1>Năng suất 2026 – Ngày 4</h1>
<h2>Thói quen vs hệ thống: tại sao hệ thống mở rộng tốt hơn</h2>
<p>Hôm nay bạn sẽ học sự khác biệt giữa thói quen và hệ thống, và cách xây dựng hệ thống có thể mở rộng.</p>
<p><a href="{{APP_URL}}/vi/courses/${COURSE_ID_BASE}_VI/day/4">Mở bài học →</a></p>`
  },
  id: {
    title: 'Kebiasaan vs sistem: mengapa sistem lebih baik dalam skala',
    content: `<h1>Kebiasaan vs sistem: mengapa sistem lebih baik dalam skala</h1>
<p><em>Kunci produktivitas: sistem, bukan hanya kebiasaan</em></p>
<hr />
<h2>Tujuan pembelajaran</h2>
<ul>
<li>Memahami perbedaan antara kebiasaan dan sistem.</li>
<li>Mengidentifikasi kapan menggunakan kebiasaan vs sistem.</li>
<li>Membuat sistem sederhana yang dapat diskalakan.</li>
</ul>
<hr />
<h2>Mengapa penting</h2>
<ul>
<li><strong>Kebiasaan</strong>: Pola perilaku individu. Mereka baik, tetapi terbatas: hanya bekerja ketika Anda ada.</li>
<li><strong>Sistem</strong>: Proses terstruktur yang bekerja dengan orang lain, dapat diskalakan, dan kurang bergantung pada motivasi.</li>
<li>Sistem dapat diskalakan: sistem yang baik bekerja dengan 1 orang dan 10 orang.</li>
<li>Kebiasaan tidak dapat diskalakan: mereka hanya bergantung pada Anda.</li>
</ul>
<hr />
<h2>Penjelasan</h2>
<h3>Kebiasaan</h3>
<p><strong>Definisi</strong>: Pola perilaku otomatis yang Anda kembangkan melalui pengulangan. Misalnya: "Saya lari setiap pagi jam 6."</p>
<p><strong>Keuntungan</strong>: Otomatis, memerlukan sedikit keputusan, konsisten.</p>
<p><strong>Kerugian</strong>: Hanya bergantung pada Anda, tidak dapat diskalakan, sulit diubah.</p>

<h3>Sistem</h3>
<p><strong>Definisi</strong>: Proses terstruktur yang menciptakan output dari input. Misalnya: "Sistem pemrosesan email: kotak masuk → pemrosesan → pengarsipan."</p>
<p><strong>Keuntungan</strong>: Dapat diskalakan, bekerja dengan orang lain, kurang bergantung pada motivasi, dapat didokumentasikan.</p>
<p><strong>Kerugian</strong>: Memerlukan lebih banyak waktu awalnya, perlu pemeliharaan struktur.</p>

<h3>Kapan menggunakan apa?</h3>
<ul>
<li><strong>Kebiasaan</strong>: Perilaku individu yang berulang (rutinitas pagi, membaca, olahraga).</li>
<li><strong>Sistem</strong>: Proses yang bekerja dengan orang lain atau perlu didokumentasikan (manajemen email, manajemen proyek, onboarding).</li>
</ul>

<h3>Contoh Praktis</h3>
<p><strong>Pendekatan berbasis kebiasaan</strong>: "Ingat untuk memeriksa email setiap hari!"</p>
<p><strong>Pendekatan berbasis sistem</strong>:
<ul>
<li>Aturan kotak masuk: pelabelan otomatis, pengurutan ke folder</li>
<li>Waktu pemrosesan: 9-10, 14-15 (diblokir di kalender)</li>
<li>Aturan pemrosesan: keputusan untuk setiap email (hapus, arsipkan, balas, delegasikan)</li>
<li>Dokumentasi: "Panduan manajemen email" (orang lain juga bisa menggunakannya)</li>
</ul>
</p>
<hr />
<h2>Latihan praktis (20-25 menit) — Kebiasaan atau sistem?</h2>
<ol>
<li><strong>Daftar proses saat ini</strong>: Tuliskan 5-10 proses yang Anda gunakan setiap hari/minggu (manajemen email, rapat, manajemen proyek, dll.).</li>
<li><strong>Kebiasaan atau sistem?</strong>: Untuk setiap proses, putuskan: kebiasaan atau sistem? Mengapa?</li>
<li><strong>Desain sistem</strong>: Pilih satu proses yang saat ini merupakan kebiasaan, dan desain sistem untuknya:
<ul>
<li>Apa inputnya?</li>
<li>Apa outputnya?</li>
<li>Apa langkah-langkahnya?</li>
<li>Bagaimana Anda mendokumentasikannya?</li>
<li>Bagaimana skalanya?</li>
</ul>
</li>
<li><strong>Implementasi</strong>: Implementasikan sistem selama seminggu dan dokumentasikan pengalaman Anda.</li>
</ol>
<hr />
<h2>Pemeriksaan diri</h2>
<ul>
<li>✅ Anda memahami perbedaan antara kebiasaan dan sistem.</li>
<li>✅ Anda tahu kapan menggunakan kebiasaan vs sistem.</li>
<li>✅ Anda memiliki sistem sederhana yang dapat diskalakan.</li>
<li>✅ Sistem Anda didokumentasikan, sehingga orang lain juga dapat menggunakannya.</li>
</ul>
<hr />
<h2>Pendalaman opsional</h2>
<ul>
<li>James Clear: "Atomic Habits" — tentang kebiasaan</li>
<li>Scott Adams: "How to Fail at Almost Everything" — tentang sistem</li>
<li>Eliyahu Goldratt: "The Goal" — tentang optimisasi sistem</li>
</ul>`,
    emailSubject: 'Produktivitas 2026 – Hari 4: Kebiasaan vs sistem',
    emailBody: `<h1>Produktivitas 2026 – Hari 4</h1>
<h2>Kebiasaan vs sistem: mengapa sistem lebih baik dalam skala</h2>
<p>Hari ini Anda akan mempelajari perbedaan antara kebiasaan dan sistem, dan cara membangun sistem yang dapat diskalakan.</p>
<p><a href="{{APP_URL}}/id/courses/${COURSE_ID_BASE}_ID/day/4">Buka pelajaran →</a></p>`
  },
  ar: {
    title: 'العادات مقابل الأنظمة: لماذا تتوسع الأنظمة بشكل أفضل',
    content: `<h1>العادات مقابل الأنظمة: لماذا تتوسع الأنظمة بشكل أفضل</h1>
<p><em>مفتاح الإنتاجية: الأنظمة، وليس فقط العادات</em></p>
<hr />
<h2>هدف التعلم</h2>
<ul>
<li>فهم الفرق بين العادات والأنظمة.</li>
<li>تحديد متى تستخدم العادات مقابل الأنظمة.</li>
<li>إنشاء نظام بسيط قابل للتوسع.</li>
</ul>
<hr />
<h2>لماذا يهم</h2>
<ul>
<li><strong>العادات</strong>: أنماط السلوك الفردية. إنها جيدة، لكنها محدودة: تعمل فقط عندما تكون أنت موجودًا.</li>
<li><strong>الأنظمة</strong>: العمليات المنظمة التي تعمل مع الآخرين، تتوسع، وتعتمد أقل على الدافع.</li>
<li>الأنظمة تتوسع: النظام الجيد يعمل مع شخص واحد و 10 أشخاص.</li>
<li>العادات لا تتوسع: تعتمد فقط عليك.</li>
</ul>
<hr />
<h2>شرح</h2>
<h3>العادات</h3>
<p><strong>التعريف</strong>: أنماط السلوك التلقائية التي تطورها من خلال التكرار. على سبيل المثال: "أركض كل صباح الساعة 6."</p>
<p><strong>المزايا</strong>: تلقائية، تتطلب قرارات قليلة، متسقة.</p>
<p><strong>العيوب</strong>: تعتمد فقط عليك، لا تتوسع، يصعب تغييرها.</p>

<h3>الأنظمة</h3>
<p><strong>التعريف</strong>: العمليات المنظمة التي تنشئ مخرجات من المدخلات. على سبيل المثال: "نظام معالجة البريد الإلكتروني: صندوق الوارد → المعالجة → الأرشفة."</p>
<p><strong>المزايا</strong>: تتوسع، تعمل مع الآخرين، تعتمد أقل على الدافع، يمكن توثيقها.</p>
<p><strong>العيوب</strong>: تتطلب المزيد من الوقت في البداية، تحتاج إلى صيانة الهيكل.</p>

<h3>متى تستخدم ماذا؟</h3>
<ul>
<li><strong>العادة</strong>: السلوكيات الفردية المتكررة (الروتين الصباحي، القراءة، التمرين).</li>
<li><strong>النظام</strong>: العمليات التي تعمل مع الآخرين أو تحتاج إلى توثيق (إدارة البريد الإلكتروني، إدارة المشاريع، onboarding).</li>
</ul>

<h3>مثال عملي</h3>
<p><strong>نهج قائم على العادة</strong>: "تذكر التحقق من البريد الإلكتروني كل يوم!"</p>
<p><strong>نهج قائم على النظام</strong>:
<ul>
<li>قواعد صندوق الوارد: وضع علامات تلقائية، الفرز إلى مجلدات</li>
<li>وقت المعالجة: 9-10، 14-15 (محظور في التقويم)</li>
<li>قاعدة المعالجة: قرار لكل بريد إلكتروني (حذف، أرشفة، رد، تفويض)</li>
<li>التوثيق: "دليل إدارة البريد الإلكتروني" (يمكن للآخرين استخدامه أيضًا)</li>
</ul>
</p>
<hr />
<h2>تمرين عملي (20-25 دقيقة) — عادة أم نظام؟</h2>
<ol>
<li><strong>قائمة العمليات الحالية</strong>: اكتب 5-10 عمليات تستخدمها يوميًا/أسبوعيًا (إدارة البريد الإلكتروني، الاجتماعات، إدارة المشاريع، إلخ.).</li>
<li><strong>عادة أم نظام؟</strong>: لكل عملية، قرر: عادة أم نظام؟ لماذا؟</li>
<li><strong>تصميم النظام</strong>: اختر عملية واحدة هي حاليًا عادة، وصمم نظامًا لها:
<ul>
<li>ما هو المدخل؟</li>
<li>ما هو المخرج؟</li>
<li>ما هي الخطوات؟</li>
<li>كيف توثقها؟</li>
<li>كيف تتوسع؟</li>
</ul>
</li>
<li><strong>التنفيذ</strong>: نفذ النظام لمدة أسبوع ووثق تجاربك.</li>
</ol>
<hr />
<h2>الفحص الذاتي</h2>
<ul>
<li>✅ تفهم الفرق بين العادات والأنظمة.</li>
<li>✅ تعرف متى تستخدم العادات مقابل الأنظمة.</li>
<li>✅ لديك نظام بسيط قابل للتوسع.</li>
<li>✅ نظامك موثق، حتى يتمكن الآخرون من استخدامه أيضًا.</li>
</ul>
<hr />
<h2>تعميق اختياري</h2>
<ul>
<li>James Clear: "Atomic Habits" — حول العادات</li>
<li>Scott Adams: "How to Fail at Almost Everything" — حول الأنظمة</li>
<li>Eliyahu Goldratt: "The Goal" — حول تحسين الأنظمة</li>
</ul>`,
    emailSubject: 'الإنتاجية 2026 – اليوم 4: العادات مقابل الأنظمة',
    emailBody: `<h1>الإنتاجية 2026 – اليوم 4</h1>
<h2>العادات مقابل الأنظمة: لماذا تتوسع الأنظمة بشكل أفضل</h2>
<p>اليوم سوف تتعلم الفرق بين العادات والأنظمة، وكيفية بناء أنظمة قابلة للتوسع.</p>
<p><a href="{{APP_URL}}/ar/courses/${COURSE_ID_BASE}_AR/day/4">افتح الدرس →</a></p>`
  },
  pt: {
    title: 'Hábitos vs sistemas: por que sistemas escalam melhor',
    content: `<h1>Hábitos vs sistemas: por que sistemas escalam melhor</h1>
<p><em>A chave da produtividade: sistemas, não apenas hábitos</em></p>
<hr />
<h2>Objetivo de aprendizagem</h2>
<ul>
<li>Entender a diferença entre hábitos e sistemas.</li>
<li>Identificar quando usar hábitos vs sistemas.</li>
<li>Criar um sistema simples que escala.</li>
</ul>
<hr />
<h2>Por que importa</h2>
<ul>
<li><strong>Hábitos</strong>: Padrões de comportamento individuais. São bons, mas limitados: só funcionam quando você está presente.</li>
<li><strong>Sistemas</strong>: Processos estruturados que funcionam com outros, escalam e dependem menos de motivação.</li>
<li>Sistemas escalam: um bom sistema funciona com 1 pessoa e 10 pessoas.</li>
<li>Hábitos não escalam: dependem apenas de você.</li>
</ul>
<hr />
<h2>Explicação</h2>
<h3>Hábitos</h3>
<p><strong>Definição</strong>: Padrões de comportamento automáticos que você desenvolve através da repetição. Por exemplo: "Corro toda manhã às 6h."</p>
<p><strong>Vantagens</strong>: Automáticos, requerem poucas decisões, consistentes.</p>
<p><strong>Desvantagens</strong>: Dependem apenas de você, não escalam, difíceis de mudar.</p>

<h3>Sistemas</h3>
<p><strong>Definição</strong>: Processos estruturados que criam saída a partir de entrada. Por exemplo: "Sistema de processamento de e-mail: caixa de entrada → processamento → arquivamento."</p>
<p><strong>Vantagens</strong>: Escalam, funcionam com outros, dependem menos de motivação, podem ser documentados.</p>
<p><strong>Desvantagens</strong>: Requerem mais tempo inicialmente, precisam de manutenção da estrutura.</p>

<h3>Quando usar o quê?</h3>
<ul>
<li><strong>Hábito</strong>: Comportamentos individuais repetitivos (rotina matinal, leitura, exercício).</li>
<li><strong>Sistema</strong>: Processos que funcionam com outros ou precisam ser documentados (gestão de e-mail, gestão de projetos, onboarding).</li>
</ul>

<h3>Exemplo Prático</h3>
<p><strong>Abordagem baseada em hábito</strong>: "Lembre-se de verificar o e-mail todos os dias!"</p>
<p><strong>Abordagem baseada em sistema</strong>:
<ul>
<li>Regras da caixa de entrada: rotulagem automática, classificação em pastas</li>
<li>Tempo de processamento: 9-10h, 14-15h (bloqueado no calendário)</li>
<li>Regra de processamento: decisão para cada e-mail (excluir, arquivar, responder, delegar)</li>
<li>Documentação: "Guia de gestão de e-mail" (outros também podem usar)</li>
</ul>
</p>
<hr />
<h2>Exercício prático (20-25 min) — Hábito ou sistema?</h2>
<ol>
<li><strong>Lista de processos atuais</strong>: Anote 5-10 processos que você usa diariamente/semanalmente (gestão de e-mail, reuniões, gestão de projetos, etc.).</li>
<li><strong>Hábito ou sistema?</strong>: Para cada processo, decida: hábito ou sistema? Por quê?</li>
<li><strong>Design do sistema</strong>: Escolha um processo que atualmente é um hábito e projete um sistema para ele:
<ul>
<li>Qual é a entrada?</li>
<li>Qual é a saída?</li>
<li>Quais são os passos?</li>
<li>Como você documenta?</li>
<li>Como escala?</li>
</ul>
</li>
<li><strong>Implementação</strong>: Implemente o sistema por uma semana e documente suas experiências.</li>
</ol>
<hr />
<h2>Auto-verificação</h2>
<ul>
<li>✅ Você entende a diferença entre hábitos e sistemas.</li>
<li>✅ Você sabe quando usar hábitos vs sistemas.</li>
<li>✅ Você tem um sistema simples que escala.</li>
<li>✅ Seu sistema está documentado, para que outros também possam usá-lo.</li>
</ul>
<hr />
<h2>Aprofundamento opcional</h2>
<ul>
<li>James Clear: "Atomic Habits" — sobre hábitos</li>
<li>Scott Adams: "How to Fail at Almost Everything" — sobre sistemas</li>
<li>Eliyahu Goldratt: "The Goal" — sobre otimização de sistemas</li>
</ul>`,
    emailSubject: 'Produtividade 2026 – Dia 4: Hábitos vs sistemas',
    emailBody: `<h1>Produtividade 2026 – Dia 4</h1>
<h2>Hábitos vs sistemas: por que sistemas escalam melhor</h2>
<p>Hoje você aprenderá a diferença entre hábitos e sistemas, e como construir sistemas escaláveis.</p>
<p><a href="{{APP_URL}}/pt/courses/${COURSE_ID_BASE}_PT/day/4">Abrir a lição →</a></p>`
  },
  hi: {
    title: 'आदतें बनाम सिस्टम: सिस्टम बेहतर क्यों स्केल करते हैं',
    content: `<h1>आदतें बनाम सिस्टम: सिस्टम बेहतर क्यों स्केल करते हैं</h1>
<p><em>उत्पादकता की कुंजी: सिस्टम, न कि केवल आदतें</em></p>
<hr />
<h2>सीखने का लक्ष्य</h2>
<ul>
<li>आदतों और सिस्टम के बीच अंतर को समझना।</li>
<li>पहचानना कि कब आदतें बनाम सिस्टम का उपयोग करना है।</li>
<li>एक सरल सिस्टम बनाना जो स्केल करता है।</li>
</ul>
<hr />
<h2>क्यों महत्वपूर्ण है</h2>
<ul>
<li><strong>आदतें</strong>: व्यक्तिगत व्यवहार पैटर्न। वे अच्छे हैं, लेकिन सीमित: केवल तभी काम करते हैं जब आप मौजूद होते हैं।</li>
<li><strong>सिस्टम</strong>: संरचित प्रक्रियाएं जो दूसरों के साथ काम करती हैं, स्केल करती हैं, और प्रेरणा पर कम निर्भर करती हैं।</li>
<li>सिस्टम स्केल करते हैं: एक अच्छा सिस्टम 1 व्यक्ति और 10 लोगों के साथ काम करता है।</li>
<li>आदतें स्केल नहीं करतीं: वे केवल आप पर निर्भर करती हैं।</li>
</ul>
<hr />
<h2>व्याख्या</h2>
<h3>आदतें</h3>
<p><strong>परिभाषा</strong>: स्वचालित व्यवहार पैटर्न जो आप पुनरावृत्ति के माध्यम से विकसित करते हैं। उदाहरण: "मैं हर सुबह 6 बजे दौड़ता हूं।"</p>
<p><strong>फायदे</strong>: स्वचालित, कम निर्णय की आवश्यकता, सुसंगत।</p>
<p><strong>नुकसान</strong>: केवल आप पर निर्भर, स्केल नहीं करते, बदलना मुश्किल।</p>

<h3>सिस्टम</h3>
<p><strong>परिभाषा</strong>: संरचित प्रक्रियाएं जो इनपुट से आउटपुट बनाती हैं। उदाहरण: "ईमेल प्रसंस्करण सिस्टम: इनबॉक्स → प्रसंस्करण → संग्रह।"</p>
<p><strong>फायदे</strong>: स्केल करते हैं, दूसरों के साथ काम करते हैं, प्रेरणा पर कम निर्भर, दस्तावेजीकरण योग्य।</p>
<p><strong>नुकसान</strong>: शुरुआत में अधिक समय की आवश्यकता, संरचना रखरखाव की आवश्यकता।</p>

<h3>कब क्या उपयोग करें?</h3>
<ul>
<li><strong>आदत</strong>: व्यक्तिगत, दोहराए जाने वाले व्यवहार (सुबह की दिनचर्या, पढ़ना, व्यायाम)।</li>
<li><strong>सिस्टम</strong>: प्रक्रियाएं जो दूसरों के साथ काम करती हैं या दस्तावेजीकरण की आवश्यकता होती है (ईमेल प्रबंधन, परियोजना प्रबंधन, onboarding)।</li>
</ul>

<h3>व्यावहारिक उदाहरण</h3>
<p><strong>आदत-आधारित दृष्टिकोण</strong>: "हर दिन ईमेल जांचना याद रखें!"</p>
<p><strong>सिस्टम-आधारित दृष्टिकोण</strong>:
<ul>
<li>इनबॉक्स नियम: स्वचालित लेबलिंग, फ़ोल्डर में क्रमबद्ध करना</li>
<li>प्रसंस्करण समय: 9-10, 14-15 (कैलेंडर में अवरुद्ध)</li>
<li>प्रसंस्करण नियम: प्रत्येक ईमेल के लिए निर्णय (हटाएं, संग्रह, उत्तर, प्रत्यायोजित करें)</li>
<li>दस्तावेजीकरण: "ईमेल प्रबंधन गाइड" (दूसरे भी उपयोग कर सकते हैं)</li>
</ul>
</p>
<hr />
<h2>व्यावहारिक अभ्यास (20-25 मिनट) — आदत या सिस्टम?</h2>
<ol>
<li><strong>वर्तमान प्रक्रियाओं की सूची</strong>: 5-10 प्रक्रियाएं लिखें जो आप दैनिक/साप्ताहिक उपयोग करते हैं (ईमेल प्रबंधन, बैठकें, परियोजना प्रबंधन, आदि)।</li>
<li><strong>आदत या सिस्टम?</strong>: प्रत्येक प्रक्रिया के लिए, निर्णय लें: आदत या सिस्टम? क्यों?</li>
<li><strong>सिस्टम डिजाइन</strong>: एक प्रक्रिया चुनें जो वर्तमान में आदत है, और इसके लिए एक सिस्टम डिजाइन करें:
<ul>
<li>इनपुट क्या है?</li>
<li>आउटपुट क्या है?</li>
<li>कदम क्या हैं?</li>
<li>आप इसे कैसे दस्तावेज करते हैं?</li>
<li>यह कैसे स्केल करता है?</li>
</ul>
</li>
<li><strong>कार्यान्वयन</strong>: सिस्टम को एक सप्ताह के लिए लागू करें और अपने अनुभवों को दस्तावेज करें।</li>
</ol>
<hr />
<h2>स्व-जांच</h2>
<ul>
<li>✅ आप आदतों और सिस्टम के बीच अंतर को समझते हैं।</li>
<li>✅ आप जानते हैं कि कब आदतें बनाम सिस्टम का उपयोग करना है।</li>
<li>✅ आपके पास एक सरल सिस्टम है जो स्केल करता है।</li>
<li>✅ आपका सिस्टम दस्तावेजीकृत है, ताकि दूसरे भी इसका उपयोग कर सकें।</li>
</ul>
<hr />
<h2>वैकल्पिक गहराई</h2>
<ul>
<li>James Clear: "Atomic Habits" — आदतों के बारे में</li>
<li>Scott Adams: "How to Fail at Almost Everything" — सिस्टम के बारे में</li>
<li>Eliyahu Goldratt: "The Goal" — सिस्टम अनुकूलन के बारे में</li>
</ul>`,
    emailSubject: 'उत्पादकता 2026 – दिन 4: आदतें बनाम सिस्टम',
    emailBody: `<h1>उत्पादकता 2026 – दिन 4</h1>
<h2>आदतें बनाम सिस्टम: सिस्टम बेहतर क्यों स्केल करते हैं</h2>
<p>आज आप आदतों और सिस्टम के बीच अंतर सीखेंगे, और स्केलेबल सिस्टम कैसे बनाएं।</p>
<p><a href="{{APP_URL}}/hi/courses/${COURSE_ID_BASE}_HI/day/4">पाठ खोलें →</a></p>`
  }
};

// Quiz 4 Questions
const QUIZ_4: Record<string, Array<{
  question: string;
  options: string[];
  correctIndex: number;
}>> = {
  hu: [
    {
      question: 'Mi a fő különbség szokások és rendszerek között?',
      options: [
        'Nincs különbség',
        'A szokások skálázódnak, a rendszerek nem',
        'A rendszerek skálázódnak, a szokások nem',
        'Mindkettő ugyanaz'
      ],
      correctIndex: 2
    },
    {
      question: 'Mikor érdemes rendszert használni szokás helyett?',
      options: [
        'Mindig',
        'Amikor másokkal is működnie kell',
        'Soha',
        'Csak hétvégén'
      ],
      correctIndex: 1
    },
    {
      question: 'Mi a rendszer definíciója?',
      options: [
        'Automatikus viselkedésminta',
        'Strukturált folyamat, amely bemenetből kimenetet hoz létre',
        'Egyéni rutin',
        'Motivációs technika'
      ],
      correctIndex: 1
    },
    {
      question: 'Miért skálázódnak jobban a rendszerek?',
      options: [
        'Mert gyorsabbak',
        'Mert másokkal is működnek, dokumentálhatók, kevésbé függnek a motivációtól',
        'Mert olcsóbbak',
        'Mert könnyebbek'
      ],
      correctIndex: 1
    },
    {
      question: 'Melyik NEM egy rendszer jellemzője?',
      options: [
        'Dokumentálható',
        'Skálázható',
        'Csak egy emberrel működik',
        'Strukturált folyamat'
      ],
      correctIndex: 2
    }
  ],
  en: [
    {
      question: 'What is the main difference between habits and systems?',
      options: [
        'No difference',
        'Habits scale, systems don\'t',
        'Systems scale, habits don\'t',
        'Both are the same'
      ],
      correctIndex: 2
    },
    {
      question: 'When should you use a system instead of a habit?',
      options: [
        'Always',
        'When it needs to work with others',
        'Never',
        'Only on weekends'
      ],
      correctIndex: 1
    },
    {
      question: 'What is the definition of a system?',
      options: [
        'Automatic behavior pattern',
        'Structured process that creates output from input',
        'Individual routine',
        'Motivation technique'
      ],
      correctIndex: 1
    },
    {
      question: 'Why do systems scale better?',
      options: [
        'Because they\'re faster',
        'Because they work with others, can be documented, depend less on motivation',
        'Because they\'re cheaper',
        'Because they\'re easier'
      ],
      correctIndex: 1
    },
    {
      question: 'Which is NOT a characteristic of a system?',
      options: [
        'Can be documented',
        'Scalable',
        'Works only with one person',
        'Structured process'
      ],
      correctIndex: 2
    }
  ],
  tr: [
    {
      question: 'Alışkanlıklar ve sistemler arasındaki ana fark nedir?',
      options: [
        'Fark yok',
        'Alışkanlıklar ölçeklenir, sistemler ölçeklenmez',
        'Sistemler ölçeklenir, alışkanlıklar ölçeklenmez',
        'İkisi de aynı'
      ],
      correctIndex: 2
    },
    {
      question: 'Alışkanlık yerine ne zaman sistem kullanmalısınız?',
      options: [
        'Her zaman',
        'Başkalarıyla çalışması gerektiğinde',
        'Asla',
        'Sadece hafta sonları'
      ],
      correctIndex: 1
    },
    {
      question: 'Sistemin tanımı nedir?',
      options: [
        'Otomatik davranış kalıbı',
        'Girdiden çıktı oluşturan yapılandırılmış süreç',
        'Bireysel rutin',
        'Motivasyon tekniği'
      ],
      correctIndex: 1
    },
    {
      question: 'Sistemler neden daha iyi ölçeklenir?',
      options: [
        'Çünkü daha hızlılar',
        'Çünkü başkalarıyla çalışırlar, belgelenebilirler, motivasyona daha az bağımlıdırlar',
        'Çünkü daha ucuzlar',
        'Çünkü daha kolaylar'
      ],
      correctIndex: 1
    },
    {
      question: 'Aşağıdakilerden hangisi bir sistem özelliği DEĞİLDİR?',
      options: [
        'Belgelenebilir',
        'Ölçeklenebilir',
        'Sadece bir kişiyle çalışır',
        'Yapılandırılmış süreç'
      ],
      correctIndex: 2
    }
  ],
  bg: [
    {
      question: 'Каква е основната разлика между навици и системи?',
      options: [
        'Няма разлика',
        'Навиците се мащабират, системите не',
        'Системите се мащабират, навиците не',
        'И двете са еднакви'
      ],
      correctIndex: 2
    },
    {
      question: 'Кога трябва да използвате система вместо навик?',
      options: [
        'Винаги',
        'Когато трябва да работи с други',
        'Никога',
        'Само през уикенда'
      ],
      correctIndex: 1
    },
    {
      question: 'Какво е определението за система?',
      options: [
        'Автоматичен модел на поведение',
        'Структуриран процес, който създава изход от вход',
        'Индивидуален рутин',
        'Техника за мотивация'
      ],
      correctIndex: 1
    },
    {
      question: 'Защо системите се мащабират по-добре?',
      options: [
        'Защото са по-бързи',
        'Защото работят с други, могат да бъдат документирани, зависят по-малко от мотивацията',
        'Защото са по-евтини',
        'Защото са по-лесни'
      ],
      correctIndex: 1
    },
    {
      question: 'Кое НЕ е характеристика на система?',
      options: [
        'Може да бъде документирана',
        'Мащабира се',
        'Работи само с един човек',
        'Структуриран процес'
      ],
      correctIndex: 2
    }
  ],
  pl: [
    {
      question: 'Jaka jest główna różnica między nawykami a systemami?',
      options: [
        'Brak różnicy',
        'Nawyki się skalują, systemy nie',
        'Systemy się skalują, nawyki nie',
        'Oba są takie same'
      ],
      correctIndex: 2
    },
    {
      question: 'Kiedy powinieneś używać systemu zamiast nawyku?',
      options: [
        'Zawsze',
        'Gdy musi działać z innymi',
        'Nigdy',
        'Tylko w weekendy'
      ],
      correctIndex: 1
    },
    {
      question: 'Jaka jest definicja systemu?',
      options: [
        'Automatyczny wzorzec zachowania',
        'Strukturyzowany proces, który tworzy wynik z wejścia',
        'Indywidualna rutyna',
        'Technika motywacyjna'
      ],
      correctIndex: 1
    },
    {
      question: 'Dlaczego systemy lepiej się skalują?',
      options: [
        'Ponieważ są szybsze',
        'Ponieważ działają z innymi, mogą być dokumentowane, zależą mniej od motywacji',
        'Ponieważ są tańsze',
        'Ponieważ są łatwiejsze'
      ],
      correctIndex: 1
    },
    {
      question: 'Która NIE jest cechą systemu?',
      options: [
        'Może być dokumentowany',
        'Skalowalny',
        'Działa tylko z jedną osobą',
        'Strukturyzowany proces'
      ],
      correctIndex: 2
    }
  ],
  vi: [
    {
      question: 'Sự khác biệt chính giữa thói quen và hệ thống là gì?',
      options: [
        'Không có sự khác biệt',
        'Thói quen mở rộng, hệ thống không',
        'Hệ thống mở rộng, thói quen không',
        'Cả hai đều giống nhau'
      ],
      correctIndex: 2
    },
    {
      question: 'Khi nào bạn nên sử dụng hệ thống thay vì thói quen?',
      options: [
        'Luôn luôn',
        'Khi nó cần hoạt động với người khác',
        'Không bao giờ',
        'Chỉ vào cuối tuần'
      ],
      correctIndex: 1
    },
    {
      question: 'Định nghĩa của hệ thống là gì?',
      options: [
        'Mẫu hành vi tự động',
        'Quy trình có cấu trúc tạo đầu ra từ đầu vào',
        'Thói quen cá nhân',
        'Kỹ thuật động lực'
      ],
      correctIndex: 1
    },
    {
      question: 'Tại sao hệ thống mở rộng tốt hơn?',
      options: [
        'Vì chúng nhanh hơn',
        'Vì chúng hoạt động với người khác, có thể được ghi chép, ít phụ thuộc vào động lực',
        'Vì chúng rẻ hơn',
        'Vì chúng dễ hơn'
      ],
      correctIndex: 1
    },
    {
      question: 'Điều nào KHÔNG phải là đặc điểm của hệ thống?',
      options: [
        'Có thể được ghi chép',
        'Có thể mở rộng',
        'Chỉ hoạt động với một người',
        'Quy trình có cấu trúc'
      ],
      correctIndex: 2
    }
  ],
  id: [
    {
      question: 'Apa perbedaan utama antara kebiasaan dan sistem?',
      options: [
        'Tidak ada perbedaan',
        'Kebiasaan dapat diskalakan, sistem tidak',
        'Sistem dapat diskalakan, kebiasaan tidak',
        'Keduanya sama'
      ],
      correctIndex: 2
    },
    {
      question: 'Kapan Anda harus menggunakan sistem daripada kebiasaan?',
      options: [
        'Selalu',
        'Ketika perlu bekerja dengan orang lain',
        'Tidak pernah',
        'Hanya di akhir pekan'
      ],
      correctIndex: 1
    },
    {
      question: 'Apa definisi sistem?',
      options: [
        'Pola perilaku otomatis',
        'Proses terstruktur yang menciptakan output dari input',
        'Rutinitas individu',
        'Teknik motivasi'
      ],
      correctIndex: 1
    },
    {
      question: 'Mengapa sistem lebih baik dalam skala?',
      options: [
        'Karena lebih cepat',
        'Karena bekerja dengan orang lain, dapat didokumentasikan, kurang bergantung pada motivasi',
        'Karena lebih murah',
        'Karena lebih mudah'
      ],
      correctIndex: 1
    },
    {
      question: 'Manakah yang BUKAN karakteristik sistem?',
      options: [
        'Dapat didokumentasikan',
        'Dapat diskalakan',
        'Hanya bekerja dengan satu orang',
        'Proses terstruktur'
      ],
      correctIndex: 2
    }
  ],
  ar: [
    {
      question: 'ما الفرق الرئيسي بين العادات والأنظمة؟',
      options: [
        'لا فرق',
        'العادات تتوسع، الأنظمة لا',
        'الأنظمة تتوسع، العادات لا',
        'كلاهما نفس الشيء'
      ],
      correctIndex: 2
    },
    {
      question: 'متى يجب أن تستخدم نظامًا بدلاً من عادة؟',
      options: [
        'دائمًا',
        'عندما يحتاج إلى العمل مع الآخرين',
        'أبدًا',
        'فقط في عطلة نهاية الأسبوع'
      ],
      correctIndex: 1
    },
    {
      question: 'ما تعريف النظام؟',
      options: [
        'نمط سلوك تلقائي',
        'عملية منظمة تنشئ مخرجات من المدخلات',
        'روتين فردي',
        'تقنية تحفيز'
      ],
      correctIndex: 1
    },
    {
      question: 'لماذا تتوسع الأنظمة بشكل أفضل؟',
      options: [
        'لأنها أسرع',
        'لأنها تعمل مع الآخرين، يمكن توثيقها، تعتمد أقل على الدافع',
        'لأنها أرخص',
        'لأنها أسهل'
      ],
      correctIndex: 1
    },
    {
      question: 'أي مما يلي ليس خاصية للنظام؟',
      options: [
        'يمكن توثيقه',
        'قابل للتوسع',
        'يعمل فقط مع شخص واحد',
        'عملية منظمة'
      ],
      correctIndex: 2
    }
  ],
  pt: [
    {
      question: 'Qual é a principal diferença entre hábitos e sistemas?',
      options: [
        'Nenhuma diferença',
        'Hábitos escalam, sistemas não',
        'Sistemas escalam, hábitos não',
        'Ambos são iguais'
      ],
      correctIndex: 2
    },
    {
      question: 'Quando você deve usar um sistema em vez de um hábito?',
      options: [
        'Sempre',
        'Quando precisa funcionar com outros',
        'Nunca',
        'Apenas nos fins de semana'
      ],
      correctIndex: 1
    },
    {
      question: 'Qual é a definição de um sistema?',
      options: [
        'Padrão de comportamento automático',
        'Processo estruturado que cria saída a partir de entrada',
        'Rotina individual',
        'Técnica de motivação'
      ],
      correctIndex: 1
    },
    {
      question: 'Por que sistemas escalam melhor?',
      options: [
        'Porque são mais rápidos',
        'Porque funcionam com outros, podem ser documentados, dependem menos de motivação',
        'Porque são mais baratos',
        'Porque são mais fáceis'
      ],
      correctIndex: 1
    },
    {
      question: 'Qual NÃO é uma característica de um sistema?',
      options: [
        'Pode ser documentado',
        'Escalável',
        'Funciona apenas com uma pessoa',
        'Processo estruturado'
      ],
      correctIndex: 2
    }
  ],
  hi: [
    {
      question: 'आदतों और सिस्टम के बीच मुख्य अंतर क्या है?',
      options: [
        'कोई अंतर नहीं',
        'आदतें स्केल करती हैं, सिस्टम नहीं',
        'सिस्टम स्केल करते हैं, आदतें नहीं',
        'दोनों समान हैं'
      ],
      correctIndex: 2
    },
    {
      question: 'आपको आदत के बजाय सिस्टम कब उपयोग करना चाहिए?',
      options: [
        'हमेशा',
        'जब इसे दूसरों के साथ काम करने की आवश्यकता हो',
        'कभी नहीं',
        'केवल सप्ताहांत में'
      ],
      correctIndex: 1
    },
    {
      question: 'सिस्टम की परिभाषा क्या है?',
      options: [
        'स्वचालित व्यवहार पैटर्न',
        'संरचित प्रक्रिया जो इनपुट से आउटपुट बनाती है',
        'व्यक्तिगत दिनचर्या',
        'प्रेरणा तकनीक'
      ],
      correctIndex: 1
    },
    {
      question: 'सिस्टम बेहतर क्यों स्केल करते हैं?',
      options: [
        'क्योंकि वे तेज़ हैं',
        'क्योंकि वे दूसरों के साथ काम करते हैं, दस्तावेजीकरण योग्य हैं, प्रेरणा पर कम निर्भर',
        'क्योंकि वे सस्ते हैं',
        'क्योंकि वे आसान हैं'
      ],
      correctIndex: 1
    },
    {
      question: 'निम्नलिखित में से कौन सा सिस्टम की विशेषता नहीं है?',
      options: [
        'दस्तावेजीकरण योग्य',
        'स्केलेबल',
        'केवल एक व्यक्ति के साथ काम करता है',
        'संरचित प्रक्रिया'
      ],
      correctIndex: 2
    }
  ]
};

// Seed lesson 4 for specific languages
async function seedLesson4ForLanguages(
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

    const lessonContent = LESSON_4[lang];
    const quizQuestions = QUIZ_4[lang];

    if (!lessonContent || !quizQuestions) {
      console.log(`⚠️  Content not ready for ${lang}, skipping...`);
      continue;
    }

    const lessonId = `${courseId}_DAY_04`;

    // Create/update lesson
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          lessonId,
          courseId: course._id,
          dayNumber: 4,
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

    console.log(`  ✅ Lesson 4 for ${lang} created/updated`);

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
            category: 'Habits vs Systems',
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
    console.log(`  ✅ Quiz 4 (${quizQuestions.length} questions) for ${lang} created/updated`);
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

  console.log('📚 Processing Lesson 4 (Day 4: Habits vs systems)...\n');
  
  // Process in batches of 2 languages
  for (const [pairIndex, pair] of LANGUAGE_PAIRS.entries()) {
    console.log(`  Batch ${pairIndex + 1}/5: ${pair.join(', ')}`);
    await seedLesson4ForLanguages(pair, brand, appUrl);
    console.log(`  ✅ Batch ${pairIndex + 1} completed\n`);
  }
  
  console.log('✅ Lesson 4 completed for all languages!');
  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
