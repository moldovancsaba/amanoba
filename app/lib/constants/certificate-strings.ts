/**
 * Localized strings for certificate image and verification
 * Used by certificate image APIs (profile and slug) for locale-aware labels
 */

export type CertificateLocale = 'en' | 'hu' | 'ar' | 'ru' | 'pt' | 'vi' | 'id' | 'hi' | 'tr' | 'bg' | 'pl';

export interface CertificateStrings {
  title: string;
  certifyThat: string;
  hasCompleted: string;
  finalExamScore: string;
  revoked: string;
}

const certificateStrings: Record<CertificateLocale, CertificateStrings> = {
  en: {
    title: 'Certificate of Completion',
    certifyThat: 'This is to certify that',
    hasCompleted: 'has successfully completed the course',
    finalExamScore: 'Final Exam Score',
    revoked: 'Certificate revoked',
  },
  hu: {
    title: 'Teljesítési oklevél',
    certifyThat: 'Ezennel igazoljuk, hogy',
    hasCompleted: 'sikeresen elvégezte a képzést',
    finalExamScore: 'Záróvizsga eredménye',
    revoked: 'Az oklevél visszavonva',
  },
  ar: {
    title: 'شهادة إتمام',
    certifyThat: 'هذا لتأكيد أن',
    hasCompleted: 'أتم الدورة بنجاح',
    finalExamScore: 'نتيجة الامتحان النهائي',
    revoked: 'تم إلغاء الشهادة',
  },
  ru: {
    title: 'Сертификат о прохождении',
    certifyThat: 'Настоящим подтверждается, что',
    hasCompleted: 'успешно завершил(а) курс',
    finalExamScore: 'Результат итогового экзамена',
    revoked: 'Сертификат аннулирован',
  },
  pt: {
    title: 'Certificado de Conclusão',
    certifyThat: 'Este certificado atesta que',
    hasCompleted: 'concluiu com sucesso o curso',
    finalExamScore: 'Nota do exame final',
    revoked: 'Certificado revogado',
  },
  vi: {
    title: 'Chứng chỉ hoàn thành',
    certifyThat: 'Xác nhận rằng',
    hasCompleted: 'đã hoàn thành thành công khóa học',
    finalExamScore: 'Điểm thi cuối khóa',
    revoked: 'Chứng chỉ đã bị thu hồi',
  },
  id: {
    title: 'Sertifikat Penyelesaian',
    certifyThat: 'Dengan ini menerangkan bahwa',
    hasCompleted: 'telah menyelesaikan kursus dengan sukses',
    finalExamScore: 'Nilai ujian akhir',
    revoked: 'Sertifikat dicabut',
  },
  hi: {
    title: 'पूर्णता प्रमाणपत्र',
    certifyThat: 'यह प्रमाणित किया जाता है कि',
    hasCompleted: 'ने पाठ्यक्रम सफलतापूर्वक पूरा किया',
    finalExamScore: 'अंतिम परीक्षा अंक',
    revoked: 'प्रमाणपत्र रद्द',
  },
  tr: {
    title: 'Tamamlanma Sertifikası',
    certifyThat: 'Bu belge, aşağıdaki kişinin',
    hasCompleted: 'kursu başarıyla tamamladığını doğrular',
    finalExamScore: 'Final sınav puanı',
    revoked: 'Sertifika iptal edildi',
  },
  bg: {
    title: 'Свидетелство за завършване',
    certifyThat: 'Настоящото удостоверява, че',
    hasCompleted: 'е завършил успешно курса',
    finalExamScore: 'Резултат от финалния изпит',
    revoked: 'Свидетелството е отменено',
  },
  pl: {
    title: 'Certyfikat ukończenia',
    certifyThat: 'Niniejszym potwierdza się, że',
    hasCompleted: 'ukończył(a) pomyślnie kurs',
    finalExamScore: 'Wynik egzaminu końcowego',
    revoked: 'Certyfikat unieważniony',
  },
};

const DEFAULT_LOCALE: CertificateLocale = 'en';
const _SUPPORTED_LOCALES = new Set<CertificateLocale>(Object.keys(certificateStrings) as CertificateLocale[]);

export function getCertificateStrings(locale: string): CertificateStrings {
  const normalized = locale?.toLowerCase().slice(0, 2) as CertificateLocale;
  return certificateStrings[normalized] ?? certificateStrings[DEFAULT_LOCALE];
}

export function formatCertificateDate(date: Date, locale: string): string {
  const normalized = locale?.toLowerCase().slice(0, 2) || 'en';
  try {
    return date.toLocaleDateString(normalized === 'en' ? 'en-US' : normalized, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}
