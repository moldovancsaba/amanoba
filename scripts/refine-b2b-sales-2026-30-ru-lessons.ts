/**
 * Refine B2B Sales 2026 (RU) lessons (quality lift to >=70, strict-quiz ready)
 *
 * Strategy:
 * - No canonical JSON exists for this course family under docs/canonical/.
 * - Use title-based categories + strong RU templates to add:
 *   definitions, steps, good-vs-bad example, checklist, and metrics/criteria.
 *
 * Safety:
 * - Dry-run by default (no DB writes).
 * - On apply: creates per-lesson backups under scripts/lesson-backups/B2B_SALES_2026_30_RU/.
 * - Restore via scripts/restore-lesson-from-backup.ts
 *
 * Usage:
 * - Dry-run:
 *   npx tsx --env-file=.env.local scripts/refine-b2b-sales-2026-30-ru-lessons.ts --from-day 1 --to-day 30
 * - Apply:
 *   npx tsx --env-file=.env.local scripts/refine-b2b-sales-2026-30-ru-lessons.ts --from-day 1 --to-day 30 --apply
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Course, Lesson } from '../app/lib/models';
import { assessLessonQuality } from './lesson-quality';
import { validateLessonRecordLanguageIntegrity } from './language-integrity';

function getArgValue(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

const COURSE_ID = getArgValue('--course') || 'B2B_SALES_2026_30_RU';
const FROM_DAY = Number(getArgValue('--from-day') || '1');
const TO_DAY = Number(getArgValue('--to-day') || '30');
const APPLY = process.argv.includes('--apply');
const OUT_DIR = getArgValue('--out-dir') || join(process.cwd(), 'scripts', 'reports');
const BACKUP_DIR = getArgValue('--backup-dir') || join(process.cwd(), 'scripts', 'lesson-backups');

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function stripHtml(input: string) {
  return String(input || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function escapeHtml(s: string) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function ul(items: string[]) {
  return `<ul>\n${items.map((i) => `  <li>${escapeHtml(i)}</li>`).join('\n')}\n</ul>\n`;
}

function ol(items: string[]) {
  return `<ol>\n${items.map((i) => `  <li>${escapeHtml(i)}</li>`).join('\n')}\n</ol>\n`;
}

type Category =
  | 'qualification'
  | 'dmu'
  | 'roi'
  | 'negotiation'
  | 'pipeline'
  | 'trust'
  | 'crm'
  | 'proposal_pricing'
  | 'procurement_security'
  | 'objections'
  | 'closing'
  | 'ai_ops'
  | 'general';

function categorize(title: string): Category {
  const t = String(title || '').toLowerCase();
  if (/(mql|sql|квалиф|meddpicc|ворот)/i.test(title)) return 'qualification';
  if (/(dmu|влияет|персона|роли)/i.test(title)) return 'dmu';
  if (/(roi|бюджет|бизнес‑кейс|бизнес-кейс|окупаем)/i.test(title)) return 'roi';
  if (/(переговор|цена|скидк|торг)/i.test(t)) return 'negotiation';
  if (/(воронк|гигиен|метрик|триггер|квартал|планир)/i.test(t)) return 'pipeline';
  if (/(референс|кейс|довер)/i.test(t)) return 'trust';
  if (/(crm|pipedrive|hubspot|интеграц|поток данных)/i.test(title)) return 'crm';
  if (/(предложен|ценообраз|пакет|ценност)/i.test(t)) return 'proposal_pricing';
  if (/(закуп|юрист|безопас)/i.test(t)) return 'procurement_security';
  if (/(возраж)/i.test(t)) return 'objections';
  if (/(закрыти|следующий шаг|обязательств|решение)/i.test(t)) return 'closing';
  if (/(ии|ai)/i.test(t)) return 'ai_ops';
  return 'general';
}

function whyFor(category: Category, title: string) {
  const base = `Сегодня вы строите практику: не “знать”, а делать. Тема: ${title}.`;
  const map: Record<Category, string> = {
    qualification: `${base} Быстрая квалификация защищает время и делает прогноз честнее.`,
    dmu: `${base} Сделки выигрываются не “у одного человека”, а через карту влияния и согласование решения.`,
    roi: `${base} ROI‑логика превращает интерес в бюджет: клиент должен видеть эффект и риск.`,
    negotiation: `${base} Переговоры — это управление критериями и риском, а не борьба за скидку.`,
    pipeline: `${base} Гигиена воронки и метрики уменьшают сюрпризы и ускоряют цикл.`,
    trust: `${base} Доверие продаёт быстрее обещаний: доказательства и референсы снижают риск решения.`,
    crm: `${base} CRM и данные — это память системы: без них масштабировать продажи невозможно.`,
    proposal_pricing: `${base} Предложение и упаковка цены делают решение простым и управляемым.`,
    procurement_security: `${base} В больших сделках скорость решают закупки/юристы/безопасность — подготовка экономит недели.`,
    objections: `${base} Возражения — это риск решения. Ваша задача: уточнить, доказать, перевести в шаг.`,
    closing: `${base} Закрытие — это согласование решения и плана действий с владельцами и датами.`,
    ai_ops: `${base} ИИ ускоряет подготовку и дисциплину, но только при чётких входах и проверках.`,
    general: `${base} Фокус: ясность, следующий шаг и измеримость результата.`,
  };
  return map[category];
}

function definitionsFor(category: Category) {
  const common = [
    { term: 'ICP', def: 'Идеальный профиль клиента: у кого проблема “болит”, есть ценность и путь к решению.' },
    { term: 'Next step', def: 'Следующий шаг с владельцем и датой. Без него прогресса нет.' },
    { term: 'Критерий успеха', def: 'Проверяемое условие “готово/не готово” (а не “кажется хорошо”).' },
  ];

  const byCat: Record<Category, Array<{ term: string; def: string }>> = {
    qualification: [
      { term: 'MQL', def: 'Сигнал интереса. Ещё не значит, что есть задача, бюджет и доступ к решению.' },
      { term: 'SQL', def: 'Сигнал, что есть реальная задача и есть путь к сделке (роль/сроки/процесс).' },
      { term: 'Красный флаг', def: 'Фактор, при котором сделку лучше закрыть быстро (не ваш ICP, нет проблемы, нет доступа).' },
    ],
    dmu: [
      { term: 'DMU', def: 'Decision Making Unit: группа людей, влияющих на выбор, бюджет и риск.' },
      { term: 'Champion', def: 'Внутренний сторонник, который двигает решение и помогает пройти процесс.' },
      { term: 'Критерии решения', def: 'То, по чему будут сравнивать варианты: риск, сроки, интеграции, безопасность, цена.' },
    ],
    roi: [
      { term: 'ROI', def: 'Окупаемость: (выгода − затраты) / затраты, в разумном горизонте.' },
      { term: 'Бизнес‑кейс', def: 'Связка: проблема → эффект → выгода → затраты → риски → план внедрения.' },
      { term: 'Гипотеза эффекта', def: 'Чёткое допущение, которое можно проверить после внедрения.' },
    ],
    negotiation: [
      { term: 'Объективные критерии', def: 'Внешние ориентиры: рынок, SLA, риски, стоимость владения, сроки.' },
      { term: 'Нижняя граница', def: 'Минимальные условия сделки без ущерба для результата и сервиса.' },
      { term: 'Торговля объёмом', def: 'Снижение цены только в обмен на изменение объёма/риска/сроков.' },
    ],
    pipeline: [
      { term: 'Стадия', def: 'Состояние сделки с проверяемыми условиями перехода.' },
      { term: 'Просроченный шаг', def: 'Следующий шаг без даты или с датой в прошлом — сигнал риска.' },
      { term: 'Триггер', def: 'Событие, которое требует действия (ответ клиента, новая информация, задержка).' },
    ],
    trust: [
      { term: 'Референс', def: 'Контакт/кейс, который подтверждает, что вы уже решали похожую задачу.' },
      { term: 'Доказательство', def: 'Факт/кейс/метрика/демо, который снижает риск решения.' },
      { term: 'Путь доверия', def: 'Последовательность: контекст → доказательство → маленькое обязательство → решение.' },
    ],
    crm: [
      { term: 'CRM', def: 'Система, где фиксируются контакты, сделки, шаги и данные для прогнозирования.' },
      { term: 'Источник истины', def: 'Единственное место, где данные считаются “правильными” для процесса.' },
      { term: 'Интеграция', def: 'Автоматический поток данных без ручного копирования (меньше ошибок).' },
    ],
    proposal_pricing: [
      { term: 'Коммерческое предложение', def: 'Документ, который делает решение простым: результат, план, риски, шаг.' },
      { term: 'Пакет', def: 'Упаковка объёма: минимум/стандарт/премиум — чтобы упростить выбор.' },
      { term: 'Риск', def: 'Что может пойти не так и как вы это снижаете (план, SLA, границы).' },
    ],
    procurement_security: [
      { term: 'Пакет доверия', def: 'Набор документов и ответов: безопасность, SLA, условия, DPA (если нужно).' },
      { term: 'Владелец', def: 'Кто отвечает за ответ/документ и в какой срок.' },
      { term: 'Срок ответа', def: 'SLA на юридические/безопасностные вопросы, иначе сделка зависает.' },
    ],
    objections: [
      { term: 'Возражение', def: 'Сигнал риска или непонимания, который надо уточнить и перевести в следующий шаг.' },
      { term: 'Уточняющий вопрос', def: 'Вопрос, который меняет ответ и выявляет реальный риск.' },
      { term: 'Доказательство', def: 'Кейс/демо/данные, которые отвечают на риск лучше обещаний.' },
    ],
    closing: [
      { term: 'План закрытия', def: 'Шаги, владельцы и даты: что нужно для решения и кто это делает.' },
      { term: 'Ложное согласие', def: '“Да” без действий: нет владельца, даты, следующего шага.' },
      { term: 'Письмо‑резюме', def: 'Фиксация решения, условий и шагов — снижает потери и недопонимание.' },
    ],
    ai_ops: [
      { term: 'Входные данные', def: 'Что нужно, чтобы ИИ помог (контекст, цель, ограничения, формат).' },
      { term: 'Проверка', def: 'Шаг, где вы подтверждаете факты/цифры и убираете “уверенные фантазии”.' },
      { term: 'Шаблон', def: 'Заготовка для повторяемых задач (письмо, резюме встречи, предложение).' },
    ],
    general: [],
  };

  const merged = [...common, ...byCat[category]];
  return merged.slice(0, 8).map((d) => `${d.term}: ${d.def}`);
}

function stepsFor(category: Category) {
  const common = [
    'Определите результат дня: что будет “готово” и как вы это проверите.',
    'Выберите 1 реальную сделку/лид и примените шаги ниже.',
    'Зафиксируйте следующий шаг с владельцем и датой.',
  ];

  const byCat: Record<Category, string[]> = {
    qualification: [
      'Сформулируйте 3 условия, при которых лид становится SQL (роль, задача, срок/процесс).',
      'Запишите 5 красных флагов для быстрого отказа.',
      'Сделайте 3 вопроса для отсечения (да/нет, без длинных разговоров).',
      'Примените к 10 лидам: SQL / nurture / закрыть.',
    ],
    dmu: [
      'Составьте карту DMU: кто инициирует, кто пользуется, кто платит, кто блокирует.',
      'Определите “champion”: кто выиграет от результата и готов двигать процесс.',
      'Соберите критерии решения и риски (безопасность, сроки, интеграции, цена).',
      'Назначьте следующий шаг: кого ещё нужно подключить и когда.',
    ],
    roi: [
      'Соберите 3 цифры клиента (объём, стоимость проблемы, частота) и 3 допущения.',
      'Сформулируйте гипотезу эффекта и как её измерить через 30/60/90 дней.',
      'Запишите затраты: лицензия/внедрение/обучение/риски.',
      'Сделайте 1‑страничный бизнес‑кейс и согласуйте, что считать успехом.',
    ],
    negotiation: [
      'Определите 3 объективных критерия: риск, сроки, объём, SLA, стоимость владения.',
      'Запишите нижнюю границу: что нельзя отдавать без изменения объёма/условий.',
      'Подготовьте 3 “обмена” без скидки: меньший объём, иной пакет, другой срок оплаты.',
      'Закрепите следующий шаг: что нужно, чтобы финализировать условия.',
    ],
    pipeline: [
      'Опишите стадии воронки и условия перехода (проверяемые, не “почувствовали”).',
      'Проверьте 10 сделок: есть ли следующий шаг и дата; исправьте просрочки.',
      'Выберите 3 метрики (например: SQL, конверсия стадий, время в стадии).',
      'Задайте триггеры: когда эскалировать, когда закрывать, когда реактировать.',
    ],
    trust: [
      'Соберите 3 доказательства: кейс, цифры, демо, письмо‑резюме.',
      'Сделайте “путь доверия” на 2 недели: доказательство → маленькое обязательство → шаг.',
      'Подготовьте 1 референс‑историю: контекст → проблема → решение → результат.',
      'Выберите одну сделку и примените: что показать и когда.',
    ],
    crm: [
      'Определите минимум полей лида/сделки (роль, стадия, следующий шаг, дата, источник).',
      'Опишите поток данных: откуда → куда → кто отвечает за качество.',
      'Найдите 10 ошибок/дыр в данных и выберите 1 правило исправления.',
      'Настройте ежедневную рутину 10 минут: просрочки, ответы, обновление стадий.',
    ],
    proposal_pricing: [
      'Соберите структуру 1 страницы: проблема → эффект → результат → план → риски → шаг.',
      'Сделайте 3 пакета (минимум/стандарт/премиум) с границами объёма.',
      'Привяжите цену к результату: что покупатель получает и как это измерить.',
      'В конце: следующий шаг и срок ответа.',
    ],
    procurement_security: [
      'Составьте 10 типовых вопросов (юристы/безопасность/закупки) и владельцев ответов.',
      'Соберите пакет документов (SLA, безопасность, условия; при необходимости DPA).',
      'Задайте SLA на ответы (например: 48 часов) и канал эскалации.',
      'Примените к одной сделке: отправьте пакет заранее.',
    ],
    objections: [
      'Запишите 5 возражений “словами клиента”.',
      'Для каждого: 2 уточняющих вопроса + 1 доказательство (кейс/демо/данные).',
      'Сделайте карточку: риск → ответ → доказательство → шаг.',
      'Отрепетируйте диалог на 6 реплик: вопрос → уточнение → ответ → шаг.',
    ],
    closing: [
      'Составьте план закрытия: шаги, владельцы, даты, критерии успеха.',
      'Определите 3 признака ложного согласия и как проверять действиями.',
      'Сделайте письмо‑резюме: решение → условия → шаги → даты → владельцы.',
      'Отправьте резюме и назначьте следующий шаг.',
    ],
    ai_ops: [
      'Соберите вход: контекст клиента, цель встречи, гипотезы, ограничения.',
      'Попросите ИИ: план встречи + 10 вопросов + черновик письма‑резюме.',
      'Проверьте факты и уберите неподтверждённые утверждения.',
      'Сохраните как шаблон для команды и повторите на следующей сделке.',
    ],
    general: [
      'Выберите 1 сделку и опишите: проблема, риск, критерий успеха.',
      'Определите 3 следующих шага и зафиксируйте владельцев.',
      'Выберите 1 метрику, которую будете улучшать неделю.',
    ],
  };

  return [...common, ...byCat[category]].slice(0, 8);
}

function exampleFor(category: Category) {
  const byCat: Record<Category, { good: string; bad: string }> = {
    qualification: {
      good: 'Вы быстро определили, что у лида есть задача, роль и процесс, и перевели в SQL с конкретным шагом.',
      bad: 'Вы держите “интересный лид” без критериев и тратите время на бесконечные переписки.',
    },
    dmu: {
      good: 'У вас есть карта влияния, вы подключили финансы/безопасность заранее и согласовали критерии решения.',
      bad: 'Вы общаетесь только с одним контактом и узнаёте про блокера за день до решения.',
    },
    roi: {
      good: 'Вы согласовали гипотезу эффекта, метрики и допущения, и ROI стал частью решения, а не “таблицей ради таблицы”.',
      bad: 'Вы показываете ROI без исходных данных и допущений — клиент не доверяет цифрам.',
    },
    negotiation: {
      good: 'Вы обсуждаете критерии и “обмен” (объём/сроки/пакет) и фиксируете условия письменно.',
      bad: 'Вы сразу отдаёте скидку без изменения объёма и теряете маржу и уверенность.',
    },
    pipeline: {
      good: 'В каждой сделке есть следующий шаг и дата, а метрики показывают узкое место в стадии.',
      bad: 'Сделки висят без следующего шага, прогноз строится на надежде.',
    },
    trust: {
      good: 'Вы показываете релевантный кейс и подтверждаете обещания доказательствами и референсом.',
      bad: 'Вы говорите “мы лучшие”, но не можете показать ни кейса, ни метрики, ни демо.',
    },
    crm: {
      good: 'Данные в CRM чистые, следующий шаг обязателен, а интеграции убрали ручной ввод.',
      bad: 'CRM заполнена частично, статусы не обновляются, отчёты не соответствуют реальности.',
    },
    proposal_pricing: {
      good: 'Предложение на 1 страницу: результат, план, риски, шаг. Пакеты упрощают выбор.',
      bad: 'Предложение — длинный текст без результата и критериев, решение откладывается.',
    },
    procurement_security: {
      good: 'Вы отправили пакет доверия заранее, вопросы закупок закрыты быстро по SLA.',
      bad: 'Вы начинаете собирать документы после запроса юристов — сделка стоит неделями.',
    },
    objections: {
      good: 'Вы уточняете риск, даёте доказательство и переводите в следующий шаг (демо/пилот/референс).',
      bad: 'Вы спорите с возражением и давите, не выяснив, что именно пугает клиента.',
    },
    closing: {
      good: 'Решение подтверждено действиями: владельцы, даты, следующий шаг и письмо‑резюме.',
      bad: 'Клиент говорит “да”, но нет действий и дат — и сделка “растворяется”.',
    },
    ai_ops: {
      good: 'ИИ подготовил план и вопросы, вы проверили факты и сохранили шаблон для повторения.',
      bad: 'ИИ сгенерировал “красивые” фразы, но вы не проверили факты и отправили неверное резюме.',
    },
    general: {
      good: 'Вы выбрали одну метрику и один следующий шаг и реально изменили поведение на неделю.',
      bad: 'Вы “узнали” новую технику, но не применили к конкретной сделке.',
    },
  };
  return byCat[category];
}

function checklistFor(category: Category) {
  const common = [
    'Есть результат дня (что будет “готово”).',
    'Есть критерий успеха (как проверить).',
    'Есть следующий шаг с владельцем и датой.',
  ];
  const extra: Record<Category, string[]> = {
    qualification: ['SQL критерии записаны (да/нет).', 'Есть список красных флагов.', 'Есть статусы и “что делать дальше”.'],
    dmu: ['Есть карта DMU.', 'Определён champion.', 'Критерии решения согласованы.'],
    roi: ['Есть исходные данные и допущения.', 'Есть метрики эффекта.', 'Есть план проверки 30/60/90.'],
    negotiation: ['Есть нижняя граница.', 'Есть 3 “обмена” без скидки.', 'Условия зафиксированы письменно.'],
    pipeline: ['Стадии определены через условия.', 'Нет сделок без следующего шага.', 'Триггеры и метрики заданы.'],
    trust: ['Есть кейс/референс.', 'Есть доказательство по ключевому риску.', 'Есть план “путь доверия”.'],
    crm: ['Определён минимум полей.', 'Есть схема потока данных.', 'Есть ежедневная рутина 10 минут.'],
    proposal_pricing: ['Шаблон 1 страницы готов.', 'Есть пакеты с границами.', 'Цена связана с результатом.'],
    procurement_security: ['Список вопросов готов.', 'Документы собраны.', 'SLA на ответы задан.'],
    objections: ['Есть карта возражений.', 'Есть уточняющие вопросы.', 'Каждое возражение заканчивается шагом.'],
    closing: ['Есть план закрытия.', 'Есть письмо‑резюме.', 'Решение проверено действиями.'],
    ai_ops: ['Входные данные собраны.', 'Проверка фактов выполнена.', 'Шаблон сохранён.'],
    general: [],
  };
  return [...common, ...(extra[category] || [])].slice(0, 7);
}

function metricsFor(category: Category) {
  const common = [
    'Время: 20–30 минут на упражнение.',
    'Критерий: следующий шаг записан (владелец + дата).',
    'Критерий: “готово” проверяемо (без общих слов).',
  ];
  const extra: Record<Category, string[]> = {
    qualification: ['Метрическая цель: доля SQL среди контактов (по вашим критериям).', 'Метрическая цель: скорость квалификации (время до решения SQL/не SQL).'],
    dmu: ['Метрическая цель: подключение ключевых ролей до финальной стадии.', 'Критерий: критерии решения зафиксированы письменно.'],
    roi: ['Критерий: бизнес‑кейс на 1 страницу с допущениями.', 'Метрическая цель: согласованная метрика эффекта (до/после).'],
    negotiation: ['Критерий: “обмен” вместо скидки (объём/срок/пакет).', 'Метрическая цель: доля сделок без необоснованной скидки.'],
    pipeline: ['Метрическая цель: время в стадии (медиана) снижается.', 'Критерий: 0 сделок без следующего шага.'],
    trust: ['Критерий: есть 1 релевантный кейс/референс на ключевой риск.', 'Метрическая цель: сокращение цикла за счёт доказательств.'],
    crm: ['Критерий: минимум полей заполнен для 10 сделок.', 'Метрическая цель: снижение дублей/пустых полей.'],
    proposal_pricing: ['Критерий: предложение “решаемо” (результат+план+риски+шаг).', 'Метрическая цель: скорость согласования следующего шага.'],
    procurement_security: ['Критерий: пакет доверия готов и отправляется заранее.', 'Метрическая цель: сокращение задержек из‑за юристов/безопасности.'],
    objections: ['Критерий: у каждого возражения есть вопрос+доказательство+шаг.', 'Метрическая цель: конверсия после обработки ключевого возражения.'],
    closing: ['Критерий: план закрытия с владельцами и датами.', 'Метрическая цель: доля “ложных согласий” снижается.'],
    ai_ops: ['Критерий: шаблон письма‑резюме/плана встречи создан.', 'Метрическая цель: время подготовки к встрече снижается без потери качества.'],
    general: [],
  };
  return [...common, ...(extra[category] || [])].slice(0, 7);
}

function buildLessonHtml(params: { day: number; title: string }) {
  const { day, title } = params;
  const cat = categorize(title);
  const why = whyFor(cat, title);
  const defs = definitionsFor(cat);
  const steps = stepsFor(cat);
  const ex = exampleFor(cat);
  const checklist = checklistFor(cat);
  const metrics = metricsFor(cat);

  return (
    `<h1>${escapeHtml(`B2B‑продажи 2026 — День ${day}`)}</h1>\n` +
    `<h2>${escapeHtml(title)}</h2>\n` +
    `<p><strong>Зачем это нужно:</strong> ${escapeHtml(why)}</p>\n` +
    `<h2>Ключевые определения</h2>\n` +
    ul(defs) +
    `<h2>Пошаговый план (применить сегодня)</h2>\n` +
    ol(steps) +
    `<h2>Пример (хорошо vs плохо)</h2>\n` +
    `<p><strong>✅ Хорошо:</strong> ${escapeHtml(ex.good)}</p>\n` +
    `<p><strong>❌ Плохо:</strong> ${escapeHtml(ex.bad)}</p>\n` +
    `<h2>Чек‑лист</h2>\n` +
    ul(checklist) +
    `<h2>Метрики / критерии</h2>\n` +
    ul(metrics) +
    `<h2>Типовые ошибки и исправления</h2>\n` +
    ul([
      'Ошибка: “занятость” вместо прогресса. Исправление: фиксируйте следующий шаг и критерий успеха.',
      'Ошибка: решения без доказательств. Исправление: добавьте кейс/демо/метрику под ключевой риск.',
      'Ошибка: нет владельца и даты. Исправление: каждый шаг — владелец + дата + что считать “готово”.',
    ])
  );
}

async function main() {
  await connectDB();

  const course = await Course.findOne({ courseId: COURSE_ID, isActive: true }).lean();
  if (!course) throw new Error(`Course not found: ${COURSE_ID}`);
  if (String(course.language || '').toLowerCase() !== 'ru') {
    throw new Error(`Course language is not RU for ${COURSE_ID} (found: ${course.language})`);
  }

  const lessons = await Lesson.find({ courseId: course._id, isActive: true })
    .sort({ dayNumber: 1, displayOrder: 1, createdAt: 1, _id: 1 })
    .select({ _id: 1, lessonId: 1, dayNumber: 1, title: 1, content: 1, emailSubject: 1, emailBody: 1, createdAt: 1 })
    .lean();

  // Deduplicate by dayNumber (keep oldest record per day)
  const byDay = new Map<number, any>();
  for (const lesson of lessons) {
    const existing = byDay.get(lesson.dayNumber);
    if (!existing) {
      byDay.set(lesson.dayNumber, lesson);
      continue;
    }
    const a = existing.createdAt ? new Date(existing.createdAt).getTime() : 0;
    const b = lesson.createdAt ? new Date(lesson.createdAt).getTime() : 0;
    if (b < a) byDay.set(lesson.dayNumber, lesson);
  }

  const stamp = isoStamp();
  mkdirSync(OUT_DIR, { recursive: true });

  const planRows: any[] = [];
  const applyResults: any[] = [];

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.amanoba.com';

  for (let day = FROM_DAY; day <= TO_DAY; day++) {
    const lesson = byDay.get(day);
    if (!lesson) {
      planRows.push({ day, action: 'SKIP_NO_LESSON', reason: 'Missing lesson in DB for that day' });
      continue;
    }

    const oldContent = String(lesson.content || '');
    const oldTitle = String(lesson.title || '');
    const oldScore = assessLessonQuality({ title: oldTitle, content: oldContent, language: 'ru' });
    const oldIntegrity = validateLessonRecordLanguageIntegrity({
      language: 'ru',
      content: oldContent,
      emailSubject: lesson.emailSubject || null,
      emailBody: lesson.emailBody || null,
    });

    const forceRefine = !oldIntegrity.ok;
    if (oldScore.score >= 70 && !forceRefine) {
      planRows.push({
        day,
        lessonId: lesson.lessonId,
        title: oldTitle,
        action: 'SKIP_ALREADY_OK',
        quality: { old: oldScore, next: oldScore },
        lengths: { oldChars: stripHtml(oldContent).length, nextChars: stripHtml(oldContent).length },
        applyEligible: true,
      });
      continue;
    }

    const nextTitle = String(oldTitle || `B2B‑продажи 2026 — День ${day}`).trim();
    const nextContent = buildLessonHtml({ day, title: nextTitle });
    const nextScore = assessLessonQuality({ title: nextTitle, content: nextContent, language: 'ru' });

    const emailSubject = `B2B‑продажи 2026 — День ${day}: ${nextTitle}`;
    const emailBody =
      `<h1>B2B‑продажи 2026 — День ${day}</h1>\n` +
      `<h2>${escapeHtml(nextTitle)}</h2>\n` +
      `<p>${escapeHtml(whyFor(categorize(nextTitle), nextTitle))}</p>\n` +
      `<p><a href=\"${appUrl}/ru/courses/${COURSE_ID}/day/${day}\">Открыть урок →</a></p>`;

    const integrity = validateLessonRecordLanguageIntegrity({
      language: 'ru',
      content: nextContent,
      emailSubject,
      emailBody,
    });

    planRows.push({
      day,
      lessonId: lesson.lessonId,
      title: nextTitle,
      action: 'REFINE',
      quality: { old: oldScore, next: nextScore },
      lengths: { oldChars: stripHtml(oldContent).length, nextChars: stripHtml(nextContent).length },
      applyEligible: nextScore.score >= 70 && integrity.ok,
      languageIntegrity: integrity,
    });

    if (!APPLY) continue;
    if (!integrity.ok) {
      throw new Error(
        `Language integrity failed for ${COURSE_ID} day ${day} (${lesson.lessonId}): ${integrity.errors[0] || 'unknown'}`
      );
    }
    if (nextScore.score < 70) {
      throw new Error(`Refined lesson score is still below 70 for ${COURSE_ID} day ${day} (${lesson.lessonId})`);
    }

    const courseFolder = join(BACKUP_DIR, COURSE_ID);
    mkdirSync(courseFolder, { recursive: true });
    const backupPath = join(courseFolder, `${lesson.lessonId}__${stamp}.json`);
    writeFileSync(
      backupPath,
      JSON.stringify(
        {
          backedUpAt: new Date().toISOString(),
          courseId: COURSE_ID,
          lessonId: lesson.lessonId,
          dayNumber: lesson.dayNumber,
          title: oldTitle,
          content: oldContent,
          emailSubject: lesson.emailSubject || null,
          emailBody: lesson.emailBody || null,
        },
        null,
        2
      )
    );

    const update = await Lesson.updateOne(
      { _id: lesson._id },
      {
        $set: {
          title: nextTitle,
          content: nextContent,
          emailSubject,
          emailBody,
          'metadata.updatedAt': new Date(),
        },
      }
    );

    applyResults.push({
      day,
      lessonId: lesson.lessonId,
      backupPath,
      matched: update.matchedCount,
      modified: update.modifiedCount,
      newScore: nextScore.score,
    });
  }

  const reportPath = join(OUT_DIR, `lesson-refine-preview__${COURSE_ID}__${stamp}.json`);
  writeFileSync(
    reportPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        courseId: COURSE_ID,
        fromDay: FROM_DAY,
        toDay: TO_DAY,
        apply: APPLY,
        totals: {
          considered: planRows.length,
          eligible70: planRows.filter((r) => r.applyEligible).length,
          below70: planRows.filter((r) => !r.applyEligible).length,
          applied: applyResults.length,
        },
        planRows,
        applyResults,
      },
      null,
      2
    )
  );

  console.log('✅ Lesson refinement preview complete');
  console.log(`- Apply mode: ${APPLY ? 'YES (DB writes + backups)' : 'NO (dry-run only)'}`);
  console.log(`- Report: ${reportPath}`);
  if (APPLY) console.log(`- Backups: ${join(BACKUP_DIR, COURSE_ID)}`);
  if (APPLY) console.log(`- Applied lessons: ${applyResults.length}`);

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

