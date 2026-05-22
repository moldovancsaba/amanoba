/**
 * Certification Final Exam Page
 * - Fetches entitlement + pool availability
 * - Allows start -> answer flow one question at a time
 * - On completion, submits and shows score/pass/fail
 */
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useSession } from 'next-auth/react';
import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Group,
  Loader,
  Paper,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconCircleCheck,
  IconRefresh,
  IconRosetteDiscountCheck,
  IconShieldCheck,
  IconX,
} from '@tabler/icons-react';

interface EntitlementResp {
  certificationEnabled: boolean;
  certificationAvailable: boolean;
  entitlementOwned: boolean;
  entitlementRequired?: boolean;
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
  sw: {
    loadingCourse: 'Inapakia kozi...',
    signInToEnroll: 'Tafadhali ingia ili kufikia mtihani wa cheti.',
    finalExamTitle: 'Mtihani wa Mwisho wa Cheti',
    certificationUnavailable: 'Cheti haipatikani',
    certificationPoolMessage: 'Ukubwa wa kundi: {{poolCount}}. Cheti imezimwa hadi kundi liwe na maswali angalau 50.',
    backToCourse: 'Rudi kwenye kozi',
    certificationAccess: 'Pata ufikiaji wa cheti',
    certificationPriceLine: 'Bei: {{price}} | Pointi: {{points}}',
    redeemPoints: 'Badilisha pointi',
    startExam: 'Anza mtihani',
    question: 'Swali',
    discardAttempt: 'Ondoa jaribio',
    passed: 'Amepita',
    notPassed: 'Hajapita',
    score: 'Alama',
    refreshStatus: 'Onyesha hali upya',
    backToCourseButton: 'Rudi kwenye kozi',
    examDescription: 'Una ufikiaji. Mtihani ni kikao kimoja, maswali 50 nasibu. Kuondoka kunafuta maendeleo.',
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
  const _locale = useLocale();
  const { data: session, status } = useSession();

  const [courseLanguage, setCourseLanguage] = useState<string>('en');
  const [entitlement, setEntitlement] = useState<EntitlementResp | null>(null);
  const [loadingEnt, setLoadingEnt] = useState(true);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [question, setQuestion] = useState<QuestionPayload | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ score?: number; passed?: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadEntitlement = useCallback(async () => {
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
  }, [courseId]);

  useEffect(() => {
    if (status === 'authenticated') {
      void loadEntitlement();
    }
  }, [loadEntitlement, status]);

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
      <Box bg="ink.9" mih="100vh" py="xl" dir={courseLanguage === 'ar' ? 'rtl' : 'ltr'}>
        <Container size="sm">
          <Card padding="xl" withBorder>
            <Group gap="sm">
              <Loader size="sm" color="amanoba" />
              <Text fw={700}>{getFinalExamText('loadingCourse', courseLanguage)}</Text>
            </Group>
          </Card>
        </Container>
      </Box>
    );
  }

  if (!session) {
    return (
      <Box bg="ink.9" mih="100vh" py="xl" dir={courseLanguage === 'ar' ? 'rtl' : 'ltr'}>
        <Container size="sm">
          <Card padding="xl" withBorder>
            <Stack gap="md">
              <Alert color="yellow" icon={<IconShieldCheck size={18} />}>
                {getFinalExamText('signInToEnroll', courseLanguage)}
              </Alert>
              <Button
                color="amanoba"
                onClick={() => router.push(`/${courseLanguage}/auth/signin?callbackUrl=${encodeURIComponent(`/${courseLanguage}/courses/${courseId}/final-exam`)}`)}
              >
                Sign in
              </Button>
            </Stack>
          </Card>
        </Container>
      </Box>
    );
  }

  const ent = entitlement;
  const unavailable = !ent?.certificationEnabled || !ent?.certificationAvailable;
  const entitlementRequired = ent?.entitlementRequired ?? true;
  const canStart = !unavailable && (!entitlementRequired || Boolean(ent?.entitlementOwned));
  const questionProgress = question
    ? Math.min(100, ((question.index + 1) / Math.max(question.total, 1)) * 100)
    : 0;

  return (
    <Box bg="ink.9" mih="100vh" dir={courseLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <Paper component="header" bg="ink.8" radius={0} withBorder>
        <Container size="md" py={{ base: 'md', sm: 'lg' }}>
          <Group justify="space-between" gap="md">
            <Group gap="sm">
              <ThemeIcon color="amanoba" variant="light" radius="xl">
                <IconShieldCheck size={20} />
              </ThemeIcon>
              <Title order={1} size="h2" c="white">
                {getFinalExamText('finalExamTitle', courseLanguage)}
              </Title>
            </Group>
            <Button
              variant="subtle"
              color="gray"
              leftSection={<IconArrowLeft size={18} />}
              onClick={() => router.push(`/${courseLanguage}/courses/${courseId}`)}
            >
              {getFinalExamText('backToCourse', courseLanguage)}
            </Button>
          </Group>
        </Container>
      </Paper>

      <Container component="main" size="md" py={{ base: 'lg', sm: 'xl' }}>
        <Stack gap="lg">

      {error && (
            <Alert color="red" icon={<IconAlertTriangle size={18} />} radius="md">
              {error}
            </Alert>
      )}

      {unavailable && (
            <Card bg="ink.8" padding="xl" withBorder>
              <Stack gap="md">
                <Title order={2} size="h3" c="white">{getFinalExamText('certificationUnavailable', courseLanguage)}</Title>
                <Text c="gray.3">
            {getFinalExamText('certificationPoolMessage', courseLanguage, { poolCount: ent?.poolCount ?? 0 })}
                </Text>
                <Button
                  variant="outline"
                  color="gray"
                  leftSection={<IconArrowLeft size={18} />}
            onClick={() => router.push(`/${courseLanguage}/courses/${courseId}`)}
          >
            {getFinalExamText('backToCourse', courseLanguage)}
                </Button>
              </Stack>
            </Card>
      )}

      {!unavailable && entitlementRequired && !ent?.entitlementOwned && (
            <Card bg="ink.8" padding="xl" withBorder>
              <Stack gap="md">
                <Title order={2} size="h3" c="white">{getFinalExamText('certificationAccess', courseLanguage)}</Title>
                <Text c="gray.3">
            {getFinalExamText('certificationPriceLine', courseLanguage, {
              price: ent?.priceMoney ? `${ent.priceMoney.amount} ${ent.priceMoney.currency}` : 'Not set',
              points: String(ent?.pricePoints ?? 'N/A'),
            })}
                </Text>
                <Group gap="sm">
            {ent?.pricePoints ? (
                    <Button
                      loading={submitting}
                onClick={redeemPoints}
                      color="amanoba"
                      leftSection={<IconRosetteDiscountCheck size={18} />}
              >
                {getFinalExamText('redeemPoints', courseLanguage)}
                    </Button>
            ) : null}
                </Group>
              </Stack>
            </Card>
      )}

      {canStart && !question && !result && (
            <Card padding="xl" withBorder>
              <Stack gap="md">
                <Text c="dimmed">{getFinalExamText('examDescription', courseLanguage)}</Text>
                <Button
                  loading={submitting}
            onClick={startExam}
                  color="amanoba"
                  leftSection={<IconShieldCheck size={18} />}
          >
            {getFinalExamText('startExam', courseLanguage)}
                </Button>
              </Stack>
            </Card>
      )}

      {question && (
            <Card bg="ink.8" padding="xl" withBorder>
              <Stack gap="lg">
                <Stack gap="xs">
                  <Group justify="space-between" gap="md">
                    <Badge color="amanoba" variant="light">
                      {getFinalExamText('question', courseLanguage)} {question.index + 1} / {question.total}
                    </Badge>
                    <Button variant="subtle" color="red" onClick={discard}>
                      {getFinalExamText('discardAttempt', courseLanguage)}
                    </Button>
                  </Group>
                  <Progress value={questionProgress} color="amanoba" radius="xl" />
                </Stack>
                <Text c="white" size="lg" fw={700} lh={1.5}>{question.question}</Text>
                <Stack gap="sm">
            {question.options.map((opt, idx) => (
                    <Button
                key={idx}
                      loading={submitting}
                onClick={() => answer(idx)}
                      variant="default"
                      justify="flex-start"
                      fullWidth
                      mih={52}
                      styles={{
                        label: {
                          whiteSpace: 'normal',
                          textAlign: courseLanguage === 'ar' ? 'right' : 'left',
                          width: '100%',
                          lineHeight: 1.45,
                        },
                      }}
              >
                {opt}
                    </Button>
            ))}
                </Stack>
              </Stack>
            </Card>
      )}

      {result && (
            <Card padding="xl" withBorder maw={520} mx="auto">
              <Stack gap="md" align="center">
                <ThemeIcon color={result.passed ? 'green' : 'red'} variant="light" size={72} radius="xl">
              {result.passed ? (
                    <IconCircleCheck size={40} />
              ) : (
                    <IconX size={40} />
              )}
                </ThemeIcon>
                <Title order={2} ta="center">
              {result.passed ? getFinalExamText('passed', courseLanguage) : getFinalExamText('notPassed', courseLanguage)}
                </Title>
                <Text size="3rem" fw={800} lh={1}>
              {result.score}%
                </Text>
                <Text c="dimmed">{getFinalExamText('score', courseLanguage)}</Text>
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm" w="100%">
                  <Button
                onClick={() => {
                  setResult(null);
                  loadEntitlement();
                }}
                    color="amanoba"
                    leftSection={<IconRefresh size={18} />}
              >
                {getFinalExamText('refreshStatus', courseLanguage)}
                  </Button>
                  <Button
                onClick={() => router.push(`/${courseLanguage}/courses/${courseId}`)}
                    variant="default"
              >
                {getFinalExamText('backToCourseButton', courseLanguage)}
                  </Button>
                </SimpleGrid>
              </Stack>
            </Card>
      )}
        </Stack>
      </Container>
    </Box>
  );
}
