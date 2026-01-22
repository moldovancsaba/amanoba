/**
 * Certificate Configurations
 *
 * What: Central list of selectable certificate options
 * Why: Admin selectors need stable IDs with localized labels
 */

export type CertificateLocale = 'hu' | 'en' | 'ru';

export const certificateTemplates = [
  {
    id: 'modernMinimal_v1',
    label: {
      en: 'Modern Minimal (Dark)',
      hu: 'Modern minimal (sötét)',
      ru: 'Современный минимализм (тёмный)',
    },
    background: '#0B0F1A',
    accent: '#FAB908',
    text: '#FFFFFF',
    muted: '#9CA3AF',
  },
  {
    id: 'greenBlueAccent_v1',
    label: {
      en: 'Green/Blue Accent',
      hu: 'Zöld/kék kiemelés',
      ru: 'Зелёно‑синий акцент',
    },
    background: '#0D1B1E',
    accent: '#2DD4BF',
    text: '#FFFFFF',
    muted: '#94A3B8',
  },
] as const;

export const certificateCredentials = [
  {
    id: 'AAP',
    label: {
      en: 'Amanoba Certified Professional',
      hu: 'Amanoba Tanúsított Profi',
      ru: 'Сертифицированный профессионал Amanoba',
    },
    shortLabel: 'AAP',
  },
  {
    id: 'AAE',
    label: {
      en: 'Amanoba‑Accredited Expert',
      hu: 'Amanoba akkreditált szakértő',
      ru: 'Аккредитованный эксперт Amanoba',
    },
    shortLabel: 'AAE',
  },
  {
    id: 'AVS',
    label: {
      en: 'Amanoba Verified Specialist',
      hu: 'Amanoba hitelesített szakértő',
      ru: 'Проверенный специалист Amanoba',
    },
    shortLabel: 'AVS',
  },
] as const;

export const certificateCompletionPhrases = [
  {
    id: 'completed_final_assessment',
    label: {
      en: 'Successfully completed the final assessment',
      hu: 'Sikeresen teljesítette a záró értékelést',
      ru: 'Успешно прошёл(ла) итоговую оценку',
    },
  },
  {
    id: 'passed_all_requirements',
    label: {
      en: 'Passed all course requirements',
      hu: 'Teljesítette a kurzus összes követelményét',
      ru: 'Выполнил(а) все требования курса',
    },
  },
  {
    id: 'completed_verified_results',
    label: {
      en: 'Completed the program with verified results',
      hu: 'Hitelesített eredményekkel teljesítette a programot',
      ru: 'Завершил(а) программу с подтверждёнными результатами',
    },
  },
] as const;

export const certificateAwardedPhrases = [
  {
    id: 'awarded_verified_mastery',
    label: {
      en: 'Awarded in recognition of verified mastery and successful completion of the Amanoba learning program.',
      hu: 'A tanúsítvány a bizonyított jártasság és az Amanoba tanulási program sikeres teljesítése elismeréseként kerül kiadásra.',
      ru: 'Награждается в признание подтверждённого мастерства и успешного завершения обучающей программы Amanoba.',
    },
  },
] as const;

export const certificateBullets = [
  {
    id: 'delivered_consistent_results',
    label: {
      en: 'Delivered consistent, structured results',
      hu: 'Következetes, strukturált eredményeket ért el',
      ru: 'Показал(а) стабильные и структурированные результаты',
    },
  },
  {
    id: 'completed_practical_projects',
    label: {
      en: 'Completed practical assignments and exercises',
      hu: 'Gyakorlati feladatokat és gyakorlatokat teljesített',
      ru: 'Выполнил(а) практические задания и упражнения',
    },
  },
  {
    id: 'applied_best_practices',
    label: {
      en: 'Applied Amanoba best practices',
      hu: 'Alkalmazta az Amanoba legjobb gyakorlatait',
      ru: 'Применил(а) лучшие практики Amanoba',
    },
  },
] as const;

export const certificateDefaults = {
  templateId: certificateTemplates[0].id,
  credentialId: certificateCredentials[0].id,
  completionPhraseId: certificateCompletionPhrases[0].id,
  awardedPhraseId: certificateAwardedPhrases[0].id,
  deliverableBulletIds: [] as string[],
  locale: 'en' as CertificateLocale,
};
