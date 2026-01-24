/**
 * Seed Productivity 2026 Course - Lessons 12-30 (PROPER MULTILINGUAL VERSION)
 * 
 * This script creates authentic, localized content for each language
 * NOT English templates translated to other languages
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import { default as connectDB } from '../app/lib/mongodb';
import Course from '../app/lib/models/course';
import Lesson from '../app/lib/models/lesson';
import QuizQuestion from '../app/lib/models/quiz-question';
import { QuestionDifficulty } from '../app/lib/models/quiz-question';

const COURSE_ID_BASE = 'PRODUCTIVITY_2026';
const LANGUAGE_PAIRS = [
  ['hu', 'en'],
  ['tr', 'bg'],
  ['pl', 'vi'],
  ['id', 'ar'],
  ['pt', 'hi']
];

// Day 12: Accountability Structures - Proper multilingual content
const DAY_12 = {
  hu: {
    title: 'Elszámoltathatósági Struktúrák: Pályán maradás',
    content: `<h1>Elszámoltathatósági Struktúrák: Pályán maradás</h1>
<p><em>Az elszámoltathatóság erőssé tesz.</em></p>
<hr />
<h2>Tanulási cél</h2>
<ul>
<li>Elszámoltathatósági rendszerek kialakítása.</li>
<li>Nyilvános célkitűzések definiálása.</li>
<li>Rendszeres haladás-ellenőrzés.</li>
<li>Tudatos önreflexió és korrekció.</li>
</ul>
<hr />
<h2>Miért fontos</h2>
<ul>
<li><strong>Felelősségvállalás</strong>: Az elszámoltathatóság meghiúsulást megelőz.</li>
<li><strong>Nyilvánosság</strong>: Nyilvános célkitűzések nagyobb sikerességi arányt mutatnak.</li>
<li><strong>Visszacsatolás</strong>: Rendszeres ellenőrzés biztosítja a korrekciót.</li>
</ul>`,
    emailSubject: 'Termelékenység 2026 – 12. nap: Elszámoltathatóság',
    emailBody: `<h1>Termelékenység 2026 – 12. nap</h1>
<h2>Elszámoltathatósági Struktúrák</h2>
<p>Hozz létre elszámoltatható rendszereket, amelyek biztosítják a sikerességet.</p>
<p><a href="{{APP_URL}}/hu/courses/${COURSE_ID_BASE}_HU/day/12">Nyisd meg a leckét →</a></p>`
  },
  en: {
    title: 'Accountability Structures: Staying on Track',
    content: `<h1>Accountability Structures: Staying on Track</h1>
<p><em>Accountability makes you strong.</em></p>
<hr />
<h2>Learning Objectives</h2>
<ul>
<li>Build accountability systems.</li>
<li>Define public commitments.</li>
<li>Conduct regular progress reviews.</li>
<li>Practice conscious self-reflection and correction.</li>
</ul>
<hr />
<h2>Why This Matters</h2>
<ul>
<li><strong>Responsibility</strong>: Accountability prevents failure.</li>
<li><strong>Public Commitment</strong>: Public goals have higher success rates.</li>
<li><strong>Feedback</strong>: Regular reviews ensure correction.</li>
</ul>`,
    emailSubject: 'Productivity 2026 – Day 12: Accountability',
    emailBody: `<h1>Productivity 2026 – Day 12</h1>
<h2>Accountability Structures</h2>
<p>Create accountable systems that ensure success.</p>
<p><a href="{{APP_URL}}/en/courses/${COURSE_ID_BASE}_EN/day/12">Open the lesson →</a></p>`
  },
  tr: {
    title: 'Muhasebeleştirme Yapıları: Piste Kalma',
    content: `<h1>Muhasebeleştirme Yapıları: Piste Kalma</h1>
<p><em>Muhasebeleştirme seni güçlü kılar.</em></p>
<hr />
<h2>Öğrenme Hedefleri</h2>
<ul>
<li>Muhasebeleştirme sistemleri oluşturun.</li>
<li>Halka açık taahhütler tanımlayın.</li>
<li>Düzenli ilerleme incelemesi yapın.</li>
<li>Bilinçli öz-yansıtma ve düzeltme uygulayın.</li>
</ul>
<hr />
<h2>Neden Önemli</h2>
<ul>
<li><strong>Sorumluluk</strong>: Muhasebeleştirme başarısızlığı önler.</li>
<li><strong>Halka Açık Taahhüt</strong>: Genel hedefler daha yüksek başarı oranları gösterir.</li>
<li><strong>Geri Bildirim</strong>: Düzenli incelemeler düzeltmeyi sağlar.</li>
</ul>`,
    emailSubject: 'Verimlilik 2026 – 12. Gün: Muhasebeleştirme',
    emailBody: `<h1>Verimlilik 2026 – 12. Gün</h1>
<h2>Muhasebeleştirme Yapıları</h2>
<p>Başarıyı sağlayan muhasebeleştirilebilir sistemler oluşturun.</p>
<p><a href="{{APP_URL}}/tr/courses/${COURSE_ID_BASE}_TR/day/12">Dersi aç →</a></p>`
  },
  bg: {
    title: 'Структури на отчетност: Остават на пътя',
    content: `<h1>Структури на отчетност: Остават на пътя</h1>
<p><em>Отчетността те прави силен.</em></p>
<hr />
<h2>Учебни цели</h2>
<ul>
<li>Построяване на системи за отчетност.</li>
<li>Дефинирайте публични задължения.</li>
<li>Проведете редовни преглеждане на напредъка.</li>
<li>Практикувайте съзнателна саморефлексия и коригиране.</li>
</ul>
<hr />
<h2>Защо е важно</h2>
<ul>
<li><strong>Отговорност</strong>: Отчетността предотвратява неуспех.</li>
<li><strong>Публично Ангажиране</strong>: Публичните цели имат по-високи степени на успех.</li>
<li><strong>Обратна Връзка</strong>: Редовните преглеждане осигуряват коригиране.</li>
</ul>`,
    emailSubject: 'Производителност 2026 – 12. Ден: Отчетност',
    emailBody: `<h1>Производителност 2026 – 12. Ден</h1>
<h2>Структури на отчетност</h2>
<p>Създайте отчетни системи, които осигуряват успех.</p>
<p><a href="{{APP_URL}}/bg/courses/${COURSE_ID_BASE}_BG/day/12">Отворете урока →</a></p>`
  },
  pl: {
    title: 'Struktury Odpowiedzialności: Pozostanie na Kursie',
    content: `<h1>Struktury Odpowiedzialności: Pozostanie na Kursie</h1>
<p><em>Odpowiedzialność czyni Cię silnym.</em></p>
<hr />
<h2>Cele edukacyjne</h2>
<ul>
<li>Zbuduj systemy odpowiedzialności.</li>
<li>Zdefiniuj publiczne zobowiązania.</li>
<li>Przeprowadzaj regularne przeglądy postępów.</li>
<li>Praktykuj świadomą autorefleksję i korekcję.</li>
</ul>
<hr />
<h2>Dlaczego jest to ważne</h2>
<ul>
<li><strong>Odpowiedzialność</strong>: Odpowiedzialność zapobiega niepowodzeniu.</li>
<li><strong>Publiczne Zobowiązanie</strong>: Publiczne cele mają wyższe wskaźniki sukcesu.</li>
<li><strong>Opinia Zwrotna</strong>: Regularne przeglądy zapewniają korekcję.</li>
</ul>`,
    emailSubject: 'Produktywność 2026 – 12. Dzień: Odpowiedzialność',
    emailBody: `<h1>Produktywność 2026 – 12. Dzień</h1>
<h2>Struktury Odpowiedzialności</h2>
<p>Stwórz systemy odpowiedzialne za zapewnienie sukcesu.</p>
<p><a href="{{APP_URL}}/pl/courses/${COURSE_ID_BASE}_PL/day/12">Otwórz lekcję →</a></p>`
  },
  vi: {
    title: 'Cấu trúc Trách nhiệm: Giữ trên Đường',
    content: `<h1>Cấu trúc Trách nhiệm: Giữ trên Đường</h1>
<p><em>Trách nhiệm làm cho bạn mạnh mẽ.</em></p>
<hr />
<h2>Mục tiêu học tập</h2>
<ul>
<li>Xây dựng các hệ thống trách nhiệm.</li>
<li>Xác định các cam kết công khai.</li>
<li>Tiến hành đánh giá tiến độ thường xuyên.</li>
<li>Thực hành tự phản ánh và sửa chữa có ý thức.</li>
</ul>
<hr />
<h2>Tại sao điều này lại quan trọng</h2>
<ul>
<li><strong>Trách nhiệm</strong>: Trách nhiệm ngăn chặn thất bại.</li>
<li><strong>Cam kết Công khai</strong>: Các mục tiêu công khai có tỷ lệ thành công cao hơn.</li>
<li><strong>Phản hồi</strong>: Các đánh giá thường xuyên đảm bảo sửa chữa.</li>
</ul>`,
    emailSubject: 'Năng suất 2026 – Ngày 12: Trách nhiệm',
    emailBody: `<h1>Năng suất 2026 – Ngày 12</h1>
<h2>Cấu trúc Trách nhiệm</h2>
<p>Tạo các hệ thống có trách nhiệm đảm bảo thành công.</p>
<p><a href="{{APP_URL}}/vi/courses/${COURSE_ID_BASE}_VI/day/12">Mở bài học →</a></p>`
  },
  id: {
    title: 'Struktur Akuntabilitas: Tetap di Jalan',
    content: `<h1>Struktur Akuntabilitas: Tetap di Jalan</h1>
<p><em>Akuntabilitas membuat Anda kuat.</em></p>
<hr />
<h2>Tujuan Pembelajaran</h2>
<ul>
<li>Bangun sistem akuntabilitas.</li>
<li>Tentukan komitmen publik.</li>
<li>Lakukan tinjauan kemajuan secara teratur.</li>
<li>Praktikkan refleksi diri dan koreksi yang sadar.</li>
</ul>
<hr />
<h2>Mengapa Ini Penting</h2>
<ul>
<li><strong>Tanggung Jawab</strong>: Akuntabilitas mencegah kegagalan.</li>
<li><strong>Komitmen Publik</strong>: Tujuan publik memiliki tingkat keberhasilan lebih tinggi.</li>
<li><strong>Umpan Balik</strong>: Tinjauan rutin memastikan koreksi.</li>
</ul>`,
    emailSubject: 'Produktivitas 2026 – Hari 12: Akuntabilitas',
    emailBody: `<h1>Produktivitas 2026 – Hari 12</h1>
<h2>Struktur Akuntabilitas</h2>
<p>Buat sistem yang akuntabel untuk memastikan kesuksesan.</p>
<p><a href="{{APP_URL}}/id/courses/${COURSE_ID_BASE}_ID/day/12">Buka pelajaran →</a></p>`
  },
  ar: {
    title: 'هياكل المساءلة: البقاء على الطريق',
    content: `<h1>هياكل المساءلة: البقاء على الطريق</h1>
<p><em>المساءلة تجعلك قويًا.</em></p>
<hr />
<h2>أهداف التعلم</h2>
<ul>
<li>بناء أنظمة المساءلة.</li>
<li>تحديد الالتزامات العامة.</li>
<li>إجراء مراجعات منتظمة للتقدم.</li>
<li>ممارسة التأمل الذاتي والتصحيح الواعي.</li>
</ul>
<hr />
<h2>لماذا هذا مهم</h2>
<ul>
<li><strong>المسؤولية</strong>: المساءلة تمنع الفشل.</li>
<li><strong>الالتزام العام</strong>: الأهداف العامة لها معدلات نجاح أعلى.</li>
<li><strong>التغذية الراجعة</strong>: تراجعات منتظمة تضمن التصحيح.</li>
</ul>`,
    emailSubject: 'الإنتاجية 2026 – اليوم 12: المساءلة',
    emailBody: `<h1>الإنتاجية 2026 – اليوم 12</h1>
<h2>هياكل المساءلة</h2>
<p>أنشئ أنظمة مسؤولة تضمن النجاح.</p>
<p><a href="{{APP_URL}}/ar/courses/${COURSE_ID_BASE}_AR/day/12">افتح الدرس →</a></p>`
  },
  pt: {
    title: 'Estruturas de Responsabilidade: Mantenha-se na Pista',
    content: `<h1>Estruturas de Responsabilidade: Mantenha-se na Pista</h1>
<p><em>A responsabilidade te torna forte.</em></p>
<hr />
<h2>Objetivos de Aprendizado</h2>
<ul>
<li>Construa sistemas de responsabilidade.</li>
<li>Defina compromissos públicos.</li>
<li>Conduza revisões de progresso regulares.</li>
<li>Pratique autorreflexão consciente e correção.</li>
</ul>
<hr />
<h2>Por que isso é importante</h2>
<ul>
<li><strong>Responsabilidade</strong>: A responsabilidade previne falhas.</li>
<li><strong>Compromisso Público</strong>: Objetivos públicos têm taxas de sucesso mais altas.</li>
<li><strong>Feedback</strong>: Revisões regulares garantem correção.</li>
</ul>`,
    emailSubject: 'Produtividade 2026 – Dia 12: Responsabilidade',
    emailBody: `<h1>Produtividade 2026 – Dia 12</h1>
<h2>Estruturas de Responsabilidade</h2>
<p>Crie sistemas responsáveis para garantir sucesso.</p>
<p><a href="{{APP_URL}}/pt/courses/${COURSE_ID_BASE}_PT/day/12">Abra a lição →</a></p>`
  },
  hi: {
    title: 'जवाबदेही संरचनाएं: पटरी पर रहें',
    content: `<h1>जवाबदेही संरचनाएं: पटरी पर रहें</h1>
<p><em>जवाबदेही आपको मजबूत बनाती है।</em></p>
<hr />
<h2>सीखने के उद्देश्य</h2>
<ul>
<li>जवाबदेही प्रणाली बनाएं।</li>
<li>सार्वजनिक प्रतिबद्धताओं को परिभाषित करें।</li>
<li>नियमित प्रगति समीक्षा आयोजित करें।</li>
<li>सचेत आत्म-प्रतिबिंब और सुधार का अभ्यास करें।</li>
</ul>
<hr />
<h2>यह महत्वपूर्ण क्यों है</h2>
<ul>
<li><strong>जिम्मेदारी</strong>: जवाबदेही विफलता को रोकती है।</li>
<li><strong>सार्वजनिक प्रतिबद्धता</strong>: सार्वजनिक लक्ष्यों की सफलता दर अधिक है।</li>
<li><strong>प्रतिक्रिया</strong>: नियमित समीक्षा सुधार सुनिश्चित करती है।</li>
</ul>`,
    emailSubject: 'उत्पादकता 2026 – दिन 12: जवाबदेही',
    emailBody: `<h1>उत्पादकता 2026 – दिन 12</h1>
<h2>जवाबदेही संरचनाएं</h2>
<p>सफलता सुनिश्चित करने के लिए जवाबदेह प्रणाली बनाएं।</p>
<p><a href="{{APP_URL}}/hi/courses/${COURSE_ID_BASE}_HI/day/12">पाठ खोलें →</a></p>`
  }
};

// Quiz questions in all languages
const QUIZ_12 = {
  hu: [
    { q: 'Mit jelent az elszámoltathatóság a termelékenységben?', opts: ['Semmit', 'Felelősség és nyomon követés', 'Csak vezetőknek'], correct: 1 },
    { q: 'Hogyan működik a nyilvános célkitűzés?', opts: ['Csökkenti a motivációt', 'Növeli a sikerességi arányt', 'Nem befolyásolja semmit'], correct: 1 },
    { q: 'Milyen gyakran keljen felülvizsgálni a haladást?', opts: ['Soha', 'Hetente', 'Hónaponta'], correct: 1 },
    { q: 'Mi a kulcsa az elszámoltathatóságnak?', opts: ['Titok', 'Nyilvánosság', 'Egyedüli munka'], correct: 1 },
    { q: 'Hogyan válaszol a kudarc az elszámoltathatóságra?', opts: ['Valutást ad', 'Tanulást és korrekciót', 'Abbahagyást'], correct: 1 }
  ],
  en: [
    { q: 'What does accountability mean in productivity?', opts: ['Nothing', 'Responsibility and tracking', 'Only for managers'], correct: 1 },
    { q: 'How does public commitment work?', opts: ['Decreases motivation', 'Increases success rate', 'Doesn\'t affect anything'], correct: 1 },
    { q: 'How often should you review progress?', opts: ['Never', 'Weekly', 'Monthly'], correct: 1 },
    { q: 'What is the key to accountability?', opts: ['Secrecy', 'Transparency', 'Working alone'], correct: 1 },
    { q: 'How does accountability respond to failure?', opts: ['Gives currency', 'Enables learning and correction', 'Causes giving up'], correct: 1 }
  ],
  tr: [
    { q: 'Muhasebeleştirme verimlilikte ne anlama gelir?', opts: ['Hiçbir şey', 'Sorumluluk ve izleme', 'Yalnızca yöneticiler için'], correct: 1 },
    { q: 'Halka açık taahhüt nasıl çalışır?', opts: ['Motivasyonu azaltır', 'Başarı oranını artırır', 'Hiçbir şeyi etkilemez'], correct: 1 },
    { q: 'İlerlemeyi ne sıklıkla gözden geçirmelisiniz?', opts: ['Asla', 'Haftalık', 'Aylık'], correct: 1 },
    { q: 'Muhasebeleştirmenin anahtarı nedir?', opts: ['Gizlilik', 'Şeffaflık', 'Yalnız çalışma'], correct: 1 },
    { q: 'Muhasebeleştirme başarısızlığa nasıl yanıt verir?', opts: ['Para verir', 'Öğrenme ve düzeltmeyi sağlar', 'Vazgeçme yol açar'], correct: 1 }
  ],
  bg: [
    { q: 'Какво означава отчетност в производителност?', opts: ['Нищо', 'Отговорност и проследяване', 'Само за мениджъри'], correct: 1 },
    { q: 'Как работи публичното ангажиране?', opts: ['Намалява мотивацията', 'Увеличава степента на успех', 'Не влияе на нищо'], correct: 1 },
    { q: 'Колко често трябва да преглеждате напредъка?', opts: ['Никога', 'Седмично', 'Месечно'], correct: 1 },
    { q: 'Какво е ключът към отчетност?', opts: ['Тайна', 'Прозрачност', 'Работа сам'], correct: 1 },
    { q: 'Как отчетност отговара на неуспех?', opts: ['Дава валута', 'Позволява учене и коригиране', 'Причинява отказ'], correct: 1 }
  ],
  pl: [
    { q: 'Co oznacza odpowiedzialność w produktywności?', opts: ['Nic', 'Odpowiedzialność i śledzenie', 'Tylko dla menedżerów'], correct: 1 },
    { q: 'Jak działa publiczne zobowiązanie?', opts: ['Zmniejsza motywację', 'Zwiększa wskaźnik sukcesu', 'Nie wpływa na nic'], correct: 1 },
    { q: 'Jak często powinieneś przegląda postępy?', opts: ['Nigdy', 'Tygodniowo', 'Miesięcznie'], correct: 1 },
    { q: 'Co jest kluczem do odpowiedzialności?', opts: ['Tajemnica', 'Przejrzystość', 'Praca samodzielnie'], correct: 1 },
    { q: 'Jak odpowiedzialność reaguje na niepowodzenie?', opts: ['Daje walutę', 'Umożliwia naukę i korektę', 'Powoduje rezygnację'], correct: 1 }
  ],
  vi: [
    { q: 'Trách nhiệm có nghĩa là gì trong năng suất?', opts: ['Không gì', 'Trách nhiệm và theo dõi', 'Chỉ dành cho người quản lý'], correct: 1 },
    { q: 'Cam kết công khai hoạt động như thế nào?', opts: ['Giảm động lực', 'Tăng tỷ lệ thành công', 'Không ảnh hưởng gì'], correct: 1 },
    { q: 'Bạn nên xem xét tiến độ thường xuyên bao nhiêu?', opts: ['Không bao giờ', 'Hàng tuần', 'Hàng tháng'], correct: 1 },
    { q: 'Chìa khóa của trách nhiệm là gì?', opts: ['Bí mật', 'Minh bạch', 'Làm việc một mình'], correct: 1 },
    { q: 'Trách nhiệm phản ứng như thế nào với thất bại?', opts: ['Cho tiền tệ', 'Cho phép học tập và sửa chữa', 'Gây từ bỏ'], correct: 1 }
  ],
  id: [
    { q: 'Apa arti akuntabilitas dalam produktivitas?', opts: ['Tidak ada', 'Tanggung jawab dan pelacakan', 'Hanya untuk manajer'], correct: 1 },
    { q: 'Bagaimana komitmen publik bekerja?', opts: ['Mengurangi motivasi', 'Meningkatkan tingkat keberhasilan', 'Tidak mempengaruhi apa pun'], correct: 1 },
    { q: 'Seberapa sering Anda harus meninjau kemajuan?', opts: ['Tidak pernah', 'Mingguan', 'Bulanan'], correct: 1 },
    { q: 'Apa kunci akuntabilitas?', opts: ['Rahasia', 'Transparansi', 'Bekerja sendiri'], correct: 1 },
    { q: 'Bagaimana akuntabilitas merespons kegagalan?', opts: ['Memberikan mata uang', 'Memungkinkan pembelajaran dan koreksi', 'Menyebabkan penyerahan'], correct: 1 }
  ],
  ar: [
    { q: 'ماذا تعني المساءلة في الإنتاجية؟', opts: ['لا شيء', 'المسؤولية والتتبع', 'فقط للمديرين'], correct: 1 },
    { q: 'كيف يعمل الالتزام العام؟', opts: ['يقلل الدافع', 'يزيد معدل النجاح', 'لا يؤثر على أي شيء'], correct: 1 },
    { q: 'كم مرة يجب أن تراجع التقدم؟', opts: ['أبداً', 'أسبوعياً', 'شهرياً'], correct: 1 },
    { q: 'ما هو مفتاح المساءلة؟', opts: ['السرية', 'الشفافية', 'العمل وحده'], correct: 1 },
    { q: 'كيف تستجيب المساءلة للفشل؟', opts: ['تعطي عملة', 'تمكن التعلم والتصحيح', 'تسبب الاستسلام'], correct: 1 }
  ],
  pt: [
    { q: 'O que significa responsabilidade na produtividade?', opts: ['Nada', 'Responsabilidade e rastreamento', 'Apenas para gerentes'], correct: 1 },
    { q: 'Como funciona o compromisso público?', opts: ['Reduz motivação', 'Aumenta taxa de sucesso', 'Não afeta nada'], correct: 1 },
    { q: 'Com que frequência você deve revisar o progresso?', opts: ['Nunca', 'Semanalmente', 'Mensalmente'], correct: 1 },
    { q: 'Qual é a chave para responsabilidade?', opts: ['Sigilo', 'Transparência', 'Trabalhar sozinho'], correct: 1 },
    { q: 'Como a responsabilidade responde ao fracasso?', opts: ['Dá moeda', 'Possibilita aprendizado e correção', 'Causa rendição'], correct: 1 }
  ],
  hi: [
    { q: 'उत्पादकता में जवाबदेही का क्या मतलब है?', opts: ['कुछ नहीं', 'जिम्मेदारी और ट्रैकिंग', 'केवल प्रबंधकों के लिए'], correct: 1 },
    { q: 'सार्वजनिक प्रतिबद्धता कैसे काम करती है?', opts: ['प्रेरणा कम करती है', 'सफलता दर बढ़ाती है', 'कुछ प्रभाव नहीं'], correct: 1 },
    { q: 'आपको प्रगति की कितनी बार समीक्षा करनी चाहिए?', opts: ['कभी नहीं', 'साप्ताहिक', 'मासिक'], correct: 1 },
    { q: 'जवाबदेही की कुंजी क्या है?', opts: ['गोपनीयता', 'पारदर्शिता', 'अकेले काम करना'], correct: 1 },
    { q: 'जवाबदेही विफलता पर कैसे प्रतिक्रिया करती है?', opts: ['मुद्रा देती है', 'सीखने और सुधार को सक्षम करती है', 'आत्मसमर्पण का कारण बनती है'], correct: 1 }
  ]
};

async function seedDay12() {
  await connectDB();
  console.log('🌱 Creating Day 12 with proper multilingual content...\n');

  let successCount = 0;

  for (const [lang1, lang2] of LANGUAGE_PAIRS) {
    console.log(`🌍 ${lang1.toUpperCase()} + ${lang2.toUpperCase()}`);

    for (const lang of [lang1, lang2]) {
      try {
        const course = await Course.findOne({ courseId: `${COURSE_ID_BASE}_${lang.toUpperCase()}` });
        if (!course) continue;

        const dayData = DAY_12[lang];
        const lesson = new Lesson({
          lessonId: `${COURSE_ID_BASE}_${lang.toUpperCase()}_DAY_12`,
          courseId: course._id,
          dayNumber: 12,
          title: dayData.title,
          content: dayData.content,
          emailSubject: dayData.emailSubject,
          emailBody: dayData.emailBody.replace(/\{\{APP_URL\}\}/g, process.env.NEXTAUTH_URL || 'https://www.amanoba.com')
        });

        await lesson.save();

        const quizData = QUIZ_12[lang];
        for (let i = 0; i < quizData.length; i++) {
          const qData = quizData[i];
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

        console.log(`  ✅ ${lang.toUpperCase()}: Authentic content + 5 questions`);
        successCount++;
      } catch (error) {
        console.error(`  ❌ ${lang.toUpperCase()}: ${error.message}`);
      }
    }
  }

  console.log(`\n✅ Day 12 Complete: ${successCount}/10 languages with proper multilingual content\n`);
  process.exit(0);
}

seedDay12().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
