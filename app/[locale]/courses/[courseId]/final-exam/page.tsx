/**
 * Certification Final Exam Page (MVP)
 * - Fetches entitlement + pool availability
 * - Allows start -> answer flow one question at a time
 * - On completion, submits and shows score/pass/fail
 */
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useSession } from 'next-auth/react';
import { Loader2, ShieldCheck, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface EntitlementResp {
  certificationEnabled: boolean;
  certificationAvailable: boolean;
  entitlementOwned: boolean;
  premiumIncludesCertification: boolean;
  priceMoney?: { amount: number; currency: string } | null;
  pricePoints?: number | null;
  poolCount: number;
}

interface QuestionPayload {
  questionId: string;
  question: string;
  options: string[];
  index: number;
  total: number;
}

// Static translations for final exam page - keyed by COURSE LANGUAGE
const finalExamTranslations: Record<string, Record<string, string>> = {
  ar: {
    loadingCourse: 'جارٍ تحميل الدورة...',
    signInToEnroll: 'يرجى تسجيل الدخول للوصول إلى امتحان الشهادة.',
    finalExamTitle: 'امتحان الشهادة النهائي',
    certificationUnavailable: 'الشهادة غير متاحة',
    certificationPoolMessage: 'حجم مجموعة الأسئلة: {{poolCount}}. الشهادة معطلة حتى تحتوي المجموعة على 50 سؤالًا على الأقل.',
    backToCourse: 'العودة إلى الدورة',
    certificationAccess: 'احصل على الوصول إلى الشهادة',
    certificationPriceLine: 'السعر: {{price}} | النقاط: {{points}}',
    redeemPoints: 'استبدال النقاط',
    startExam: 'بدء الامتحان',
    question: 'سؤال',
    discardAttempt: 'إلغاء المحاولة',
    passed: 'نجح',
    notPassed: 'لم ينجح',
    score: 'النتيجة',
    refreshStatus: 'تحديث الحالة',
    backToCourseButton: 'العودة إلى الدورة',
    examDescription: 'لديك وصول. الامتحان جلسة واحدة، 50 سؤالًا عشوائيًا. المغادرة تلغي التقدم.',
  },
  hu: {
    loadingCourse: 'Kurzus betöltése...',
    signInToEnroll: 'Kérjük, jelentkezz be a tanúsítványos vizsgához való hozzáféréshez.',
    finalExamTitle: 'Végső tanúsítványos vizsga',
    certificationUnavailable: 'A tanúsítvány nem elérhető',
    certificationPoolMessage: 'Kérdéskészlet mérete: {{poolCount}}. A tanúsítvány le van tiltva, amíg a készletnek legalább 50 kérdése nincs.',
    backToCourse: 'Vissza a kurzusra',
    certificationAccess: 'Tanúsítvány hozzáférés beszerzése',
    certificationPriceLine: 'Ár: {{price}} | Pontok: {{points}}',
    redeemPoints: 'Pontok beváltása',
    startExam: 'Vizsga indítása',
    question: 'Kérdés',
    discardAttempt: 'Kísérlet elvetése',
    passed: 'Sikeres',
    notPassed: 'Sikertelen',
    score: 'Eredmény',
    refreshStatus: 'Állapot frissítése',
    backToCourseButton: 'Vissza a kurzusra',
    examDescription: 'Van hozzáférésed. A vizsga egy ülés, 50 véletlenszerű kérdés. A kilépés elveti a haladást.',
  },
  en: {
    loadingCourse: 'Loading course...',
    signInToEnroll: 'Please sign in to access the certification exam.',
    finalExamTitle: 'Final Certification Exam',
    certificationUnavailable: 'Certification unavailable',
    certificationPoolMessage: 'Pool size: {{poolCount}}. Certification is disabled until the pool has at least 50 questions.',
    backToCourse: 'Back to course',
    certificationAccess: 'Get certification access',
    certificationPriceLine: 'Price: {{price}} | Points: {{points}}',
    redeemPoints: 'Redeem points',
    startExam: 'Start exam',
    question: 'Question',
    discardAttempt: 'Discard attempt',
    passed: 'Passed',
    notPassed: 'Not passed',
    score: 'Score',
    refreshStatus: 'Refresh status',
    backToCourseButton: 'Back to course',
    examDescription: 'You have access. The exam is one sitting, 50 randomized questions. Leaving discards progress.',
  },
  ru: {
    loadingCourse: 'Загрузка курса...',
    signInToEnroll: 'Пожалуйста, войдите, чтобы получить доступ к экзамену на сертификацию.',
    finalExamTitle: 'Финальный экзамен на сертификацию',
    certificationUnavailable: 'Сертификация недоступна',
    certificationPoolMessage: 'Размер пула вопросов: {{poolCount}}. Сертификация отключена, пока в пуле не будет хотя бы 50 вопросов.',
    backToCourse: 'Назад к курсу',
    certificationAccess: 'Получить доступ к сертификации',
    certificationPriceLine: 'Цена: {{price}} | Баллы: {{points}}',
    redeemPoints: 'Потратить баллы',
    startExam: 'Начать экзамен',
    question: 'Вопрос',
    discardAttempt: 'Отменить попытку',
    passed: 'Пройдено',
    notPassed: 'Не пройдено',
    score: 'Результат',
    refreshStatus: 'Обновить статус',
    backToCourseButton: 'Назад к курсу',
    examDescription: 'У вас есть доступ. Экзамен - одна сессия, 50 случайных вопросов. Выход отменяет прогресс.',
  },
  pt: {
    loadingCourse: 'Carregando curso...',
    signInToEnroll: 'Por favor, faça login para acessar o exame de certificação.',
    finalExamTitle: 'Exame Final de Certificação',
    certificationUnavailable: 'Certificação indisponível',
    certificationPoolMessage: 'Tamanho do pool: {{poolCount}}. A certificação está desabilitada até que o pool tenha pelo menos 50 perguntas.',
    backToCourse: 'Voltar ao curso',
    certificationAccess: 'Obter acesso à certificação',
    certificationPriceLine: 'Preço: {{price}} | Pontos: {{points}}',
    redeemPoints: 'Resgatar pontos',
    startExam: 'Iniciar exame',
    question: 'Pergunta',
    discardAttempt: 'Descartar tentativa',
    passed: 'Aprovado',
    notPassed: 'Reprovado',
    score: 'Pontuação',
    refreshStatus: 'Atualizar status',
    backToCourseButton: 'Voltar ao curso',
    examDescription: 'Você tem acesso. O exame é uma sessão, 50 perguntas aleatórias. Sair descarta o progresso.',
  },
  vi: {
    loadingCourse: 'Đang tải khóa học...',
    signInToEnroll: 'Vui lòng đăng nhập để truy cập bài kiểm tra chứng chỉ.',
    finalExamTitle: 'Bài Kiểm Tra Chứng Chỉ Cuối Cùng',
    certificationUnavailable: 'Chứng chỉ không khả dụng',
    certificationPoolMessage: 'Kích thước nhóm: {{poolCount}}. Chứng chỉ bị vô hiệu hóa cho đến khi nhóm có ít nhất 50 câu hỏi.',
    backToCourse: 'Quay lại khóa học',
    certificationAccess: 'Lấy quyền truy cập chứng chỉ',
    certificationPriceLine: 'Giá: {{price}} | Điểm: {{points}}',
    redeemPoints: 'Đổi điểm',
    startExam: 'Bắt đầu bài kiểm tra',
    question: 'Câu hỏi',
    discardAttempt: 'Hủy bỏ thử',
    passed: 'Đã vượt qua',
    notPassed: 'Không vượt qua',
    score: 'Điểm số',
    refreshStatus: 'Làm mới trạng thái',
    backToCourseButton: 'Quay lại khóa học',
    examDescription: 'Bạn có quyền truy cập. Bài kiểm tra là một phiên, 50 câu hỏi ngẫu nhiên. Rời đi sẽ hủy tiến trình.',
  },
  id: {
    loadingCourse: 'Memuat kursus...',
    signInToEnroll: 'Silakan masuk untuk mengakses ujian sertifikasi.',
    finalExamTitle: 'Ujian Sertifikasi Final',
    certificationUnavailable: 'Sertifikasi tidak tersedia',
    certificationPoolMessage: 'Ukuran pool: {{poolCount}}. Sertifikasi dinonaktifkan sampai pool memiliki setidaknya 50 pertanyaan.',
    backToCourse: 'Kembali ke kursus',
    certificationAccess: 'Dapatkan akses sertifikasi',
    certificationPriceLine: 'Harga: {{price}} | Poin: {{points}}',
    redeemPoints: 'Tukar poin',
    startExam: 'Mulai ujian',
    question: 'Pertanyaan',
    discardAttempt: 'Buang percobaan',
    passed: 'Lulus',
    notPassed: 'Tidak lulus',
    score: 'Skor',
    refreshStatus: 'Segarkan status',
    backToCourseButton: 'Kembali ke kursus',
    examDescription: 'Anda memiliki akses. Ujian adalah satu sesi, 50 pertanyaan acak. Keluar membatalkan kemajuan.',
  },
  hi: {
    loadingCourse: 'पाठ्यक्रम लोड हो रहा है...',
    signInToEnroll: 'कृपया प्रमाणपत्र परीक्षा तक पहुंचने के लिए साइन इन करें।',
    finalExamTitle: 'अंतिम प्रमाणपत्र परीक्षा',
    certificationUnavailable: 'प्रमाणपत्र उपलब्ध नहीं',
    certificationPoolMessage: 'पूल आकार: {{poolCount}}. प्रमाणपत्र तब तक अक्षम है जब तक पूल में कम से कम 50 प्रश्न न हों।',
    backToCourse: 'पाठ्यक्रम पर वापस जाएँ',
    certificationAccess: 'प्रमाणपत्र पहुंच प्राप्त करें',
    certificationPriceLine: 'मूल्य: {{price}} | अंक: {{points}}',
    redeemPoints: 'अंक भुनाएं',
    startExam: 'परीक्षा शुरू करें',
    question: 'प्रश्न',
    discardAttempt: 'प्रयास छोड़ें',
    passed: 'पास',
    notPassed: 'फेल',
    score: 'स्कोर',
    refreshStatus: 'स्थिति ताज़ा करें',
    backToCourseButton: 'पाठ्यक्रम पर वापस जाएँ',
    examDescription: 'आपके पास पहुंच है। परीक्षा एक सत्र है, 50 यादृच्छिक प्रश्न। छोड़ने से प्रगति रद्द हो जाती है।',
  },
  tr: {
    loadingCourse: 'Kurs yükleniyor...',
    signInToEnroll: 'Lütfen sertifika sınavına erişmek için giriş yapın.',
    finalExamTitle: 'Final Sertifikasyon Sınavı',
    certificationUnavailable: 'Sertifika kullanılamıyor',
    certificationPoolMessage: 'Havuz boyutu: {{poolCount}}. Sertifika, havuzda en az 50 soru olana kadar devre dışıdır.',
    backToCourse: 'Kursa dön',
    certificationAccess: 'Sertifika erişimi al',
    certificationPriceLine: 'Fiyat: {{price}} | Puan: {{points}}',
    redeemPoints: 'Puan kullan',
    startExam: 'Sınavı başlat',
    question: 'Soru',
    discardAttempt: 'Denemeyi iptal et',
    passed: 'Geçti',
    notPassed: 'Geçmedi',
    score: 'Skor',
    refreshStatus: 'Durumu yenile',
    backToCourseButton: 'Kursa dön',
    examDescription: 'Erişiminiz var. Sınav bir oturum, 50 rastgele soru. Çıkmak ilerlemeyi iptal eder.',
  },
  bg: {
    loadingCourse: 'Зареждане на курса...',
    signInToEnroll: 'Моля, влезте, за да получите достъп до сертификационния изпит.',
    finalExamTitle: 'Финален сертификационен изпит',
    certificationUnavailable: 'Сертификацията не е налична',
    certificationPoolMessage: 'Размер на банката с въпроси: {{poolCount}}. Сертификацията е изключена, докато банката няма поне 50 въпроса.',
    backToCourse: 'Назад към курса',
    certificationAccess: 'Получете достъп до сертификация',
    certificationPriceLine: 'Цена: {{price}} | Точки: {{points}}',
    redeemPoints: 'Осребри точки',
    startExam: 'Започнете изпит',
    question: 'Въпрос',
    discardAttempt: 'Отхвърли опит',
    passed: 'Премина',
    notPassed: 'Не премина',
    score: 'Резултат',
    refreshStatus: 'Обновете статус',
    backToCourseButton: 'Назад към курса',
    examDescription: 'Имате достъп. Изпитът е една сесия, 50 произволни въпроса. Напускането отменя напредъка.',
  },
  pl: {
    loadingCourse: 'Ładowanie kursu...',
    signInToEnroll: 'Zaloguj się, aby uzyskać dostęp do egzaminu certyfikacyjnego.',
    finalExamTitle: 'Końcowy egzamin certyfikacyjny',
    certificationUnavailable: 'Certyfikacja niedostępna',
    certificationPoolMessage: 'Wielkość puli pytań: {{poolCount}}. Certyfikacja jest wyłączona, dopóki pula nie ma co najmniej 50 pytań.',
    backToCourse: 'Wróć do kursu',
    certificationAccess: 'Uzyskaj dostęp do certyfikacji',
    certificationPriceLine: 'Cena: {{price}} | Punkty: {{points}}',
    redeemPoints: 'Wymień punkty',
    startExam: 'Rozpocznij egzamin',
    question: 'Pytanie',
    discardAttempt: 'Odrzuć próbę',
    passed: 'Zdany',
    notPassed: 'Niezaliczony',
    score: 'Wynik',
    refreshStatus: 'Odśwież status',
    backToCourseButton: 'Wróć do kursu',
    examDescription: 'Masz dostęp. Egzamin to jedna sesja, 50 losowych pytań. Opuszczenie anuluje postęp.',
  },
};

// Helper to get translation by course language
const getFinalExamText = (key: string, courseLang: string, params?: Record<string, string | number>): string => {
  const lang = courseLang || 'en';
  const translations = finalExamTranslations[lang] || finalExamTranslations.en;
  let text = translations[key] || finalExamTranslations.en[key] || key;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{{${k}}}`, String(v));
    });
  }
  return text;
};

export default function FinalExamPage() {
  const params = useParams<{ courseId: string; locale: string }>();
  const courseId = params.courseId;
  const router = useRouter();
  const locale = useLocale();
  const { data: session, status } = useSession();

  const [courseLanguage, setCourseLanguage] = useState<string>('en');
  const [entitlement, setEntitlement] = useState<EntitlementResp | null>(null);
  const [loadingEnt, setLoadingEnt] = useState(true);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [question, setQuestion] = useState<QuestionPayload | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ score?: number; passed?: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      loadEntitlement();
    }
  }, [status]);

  const loadEntitlement = async () => {
    setLoadingEnt(true);
    setError(null);
    try {
      // First fetch the course to get language
      const courseRes = await fetch(`/api/courses/${courseId}`, { cache: 'no-store' });
      const courseData = await courseRes.json();
      if (courseData.success && courseData.course?.language) {
        setCourseLanguage(courseData.course.language);
      }

      // Then fetch entitlement
      const res = await fetch(`/api/certification/entitlement?courseId=${courseId}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to load');
      setEntitlement(data.data);
      // Trust architecture: Card links guarantee URL locale = course language
      // No redirect or courseLanguage extraction needed
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoadingEnt(false);
    }
  };

  const redeemPoints = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/certification/entitlement/redeem-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Redeem failed');
      await loadEntitlement();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSubmitting(false);
    }
  };

  const startExam = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/certification/final-exam/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Start failed');
      setAttemptId(data.data.attemptId);
      setQuestion(data.data.question);
      setResult(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSubmitting(false);
    }
  };

  const answer = async (selectedIndex: number) => {
    if (!attemptId || !question) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/certification/final-exam/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId,
          questionId: question.questionId,
          selectedIndex,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Answer failed');

      if (data.data.completed) {
        // Submit to finalize
        const submitRes = await fetch('/api/certification/final-exam/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ attemptId }),
        });
        const submitData = await submitRes.json();
        if (!submitRes.ok || !submitData.success) throw new Error(submitData.error || 'Submit failed');
        setResult({ score: submitData.data.scorePercentInteger, passed: submitData.data.passed });
        setQuestion(null);
      } else {
        setQuestion(data.data.nextQuestion);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSubmitting(false);
    }
  };

  const discard = async () => {
    if (!attemptId) return;
    await fetch('/api/certification/final-exam/discard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attemptId, reason: 'user_exit' }),
    });
    setAttemptId(null);
    setQuestion(null);
    setResult(null);
  };

  if (status === 'loading' || loadingEnt) {
    return (
      <div className="flex items-center justify-center h-80 text-white" dir={courseLanguage === 'ar' ? 'rtl' : 'ltr'}>
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> {getFinalExamText('loadingCourse', courseLanguage)}
      </div>
    );
  }

  if (!session) {
    return (
      <div className="p-6 text-white" dir={courseLanguage === 'ar' ? 'rtl' : 'ltr'}>
        <p>{getFinalExamText('signInToEnroll', courseLanguage)}</p>
      </div>
    );
  }

  const ent = entitlement;
  const unavailable = !ent?.certificationEnabled || !ent?.certificationAvailable;
  const canStart = ent?.entitlementOwned && !unavailable;

  return (
    <div className="max-w-3xl mx-auto p-6 text-white space-y-6" dir={courseLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-3">
        <ShieldCheck className="w-6 h-6 text-amber-400" />
        <h1 className="text-2xl font-bold">{getFinalExamText('finalExamTitle', courseLanguage)}</h1>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 text-red-200 px-4 py-3 rounded">
          <AlertTriangle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {unavailable && (
        <div className="bg-gray-800 border border-gray-700 rounded p-4">
          <p className="text-lg font-semibold">{getFinalExamText('certificationUnavailable', courseLanguage)}</p>
          <p className="text-gray-300 mt-1">
            {getFinalExamText('certificationPoolMessage', courseLanguage, { poolCount: ent?.poolCount ?? 0 })}
          </p>
          <button
            className="mt-3 text-sm text-indigo-300 underline"
            onClick={() => router.push(`/${courseLanguage}/courses/${courseId}`)}
          >
            {getFinalExamText('backToCourse', courseLanguage)}
          </button>
        </div>
      )}

      {!unavailable && !ent?.entitlementOwned && (
        <div className="bg-gray-800 border border-gray-700 rounded p-4 space-y-3">
          <p className="font-semibold">{getFinalExamText('certificationAccess', courseLanguage)}</p>
          <p className="text-gray-300">
            {getFinalExamText('certificationPriceLine', courseLanguage, {
              price: ent?.priceMoney ? `${ent.priceMoney.amount} ${ent.priceMoney.currency}` : 'Not set',
              points: String(ent?.pricePoints ?? 'N/A'),
            })}
          </p>
          <div className="flex gap-2">
            {ent?.pricePoints ? (
              <button
                disabled={submitting}
                onClick={redeemPoints}
                className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
              >
                {getFinalExamText('redeemPoints', courseLanguage)}
              </button>
            ) : null}
            <button
              disabled
              className="px-4 py-2 rounded bg-gray-700 text-gray-400 cursor-not-allowed"
            >
              Pay (disabled in MVP)
            </button>
          </div>
        </div>
      )}

      {!unavailable && ent?.entitlementOwned && !question && !result && (
        <div className="space-y-3">
          <p>{getFinalExamText('examDescription', courseLanguage)}</p>
          <button
            disabled={submitting}
            onClick={startExam}
            className="px-5 py-2 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50"
          >
            {getFinalExamText('startExam', courseLanguage)}
          </button>
        </div>
      )}

      {question && (
        <div className="bg-gray-800 border border-gray-700 rounded p-4 space-y-4">
          <div className="flex justify-between text-sm text-gray-300">
            <span>
              {getFinalExamText('question', courseLanguage)} {question.index + 1} / {question.total}
            </span>
            <button onClick={discard} className="text-red-300 hover:text-red-200">
              {getFinalExamText('discardAttempt', courseLanguage)}
            </button>
          </div>
          <p className="text-lg font-semibold">{question.question}</p>
          <div className="space-y-2">
            {question.options.map((opt, idx) => (
              <button
                key={idx}
                disabled={submitting}
                onClick={() => answer(idx)}
                className={`w-full ${courseLanguage === 'ar' ? 'text-right' : 'text-left'} px-4 py-3 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {result && (
        <div className="bg-gray-800 border border-gray-700 rounded p-4 space-y-2">
          <div className="flex items-center gap-2 text-xl font-semibold">
            {result.passed ? (
              <CheckCircle className="w-6 h-6 text-green-400" />
            ) : (
              <XCircle className="w-6 h-6 text-red-400" />
            )}
            <span>{result.passed ? getFinalExamText('passed', courseLanguage) : getFinalExamText('notPassed', courseLanguage)}</span>
          </div>
          <p className="text-gray-200">{getFinalExamText('score', courseLanguage)}: {result.score}%</p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setResult(null);
                loadEntitlement();
              }}
              className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500"
            >
              {getFinalExamText('refreshStatus', courseLanguage)}
            </button>
            <button
              onClick={() => router.push(`/${courseLanguage}/courses/${courseId}`)}
              className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
            >
              {getFinalExamText('backToCourseButton', courseLanguage)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
