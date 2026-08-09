/**
 * Localized strings for certificate image and verification
 * Used by certificate image APIs (profile and slug) for locale-aware labels
 */

export type CertificateLocale = 'en' | 'hu' | 'ar' | 'ru' | 'pt' | 'vi' | 'id' | 'hi' | 'tr' | 'bg' | 'pl' | 'sw' | 'es' | 'zh' | 'fr' | 'bn' | 'ur';

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
  sw: {
    title: 'Cheti cha Kukamilisha',
    certifyThat: 'Hii inathibitisha kuwa',
    hasCompleted: 'amemaliza kwa mafanikio kozi',
    finalExamScore: 'Matokeo ya Mtihani wa Mwisho',
    revoked: 'Cheti kimebatilishwa',
  },
  es: {
    title: 'Certificado de Finalización',
    certifyThat: 'Esto certifica que',
    hasCompleted: 'ha completado exitosamente el curso',
    finalExamScore: 'Puntuación del examen final',
    revoked: 'Certificado revocado',
  },
  zh: {
    title: '完成证书',
    certifyThat: '特此证明',
    hasCompleted: '已成功完成课程',
    finalExamScore: '期末考试成绩',
    revoked: '证书已撤销',
  },
  fr: {
    title: 'Certificat d\'achèvement',
    certifyThat: 'Ceci certifie que',
    hasCompleted: 'a complété avec succès le cours',
    finalExamScore: 'Note de l\'examen final',
    revoked: 'Certificat révoqué',
  },
  bn: {
    title: 'সমাপ্তি সনদপত্র',
    certifyThat: 'এই প্রত্যয়ন করা হয় যে',
    hasCompleted: 'সফলভাবে কোর্স সম্পন্ন করেছেন',
    finalExamScore: 'চূড়ান্ত পরীক্ষার স্কোর',
    revoked: 'সনদপত্র বাতিল করা হয়েছে',
  },
  ur: {
    title: 'تکمیل کی سند',
    certifyThat: 'یہ تصدیق کی جاتی ہے کہ',
    hasCompleted: 'نے کامیابی سے کورس مکمل کیا',
    finalExamScore: 'حتمی امتحان کا اسکور',
    revoked: 'سند منسوخ کر دی گئی',
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
