/**
 * Seed B2B Sales 2026 Russian (first 2 lessons)
 *
 * Creates a new course B2B_SALES_2026_30_RU based on the EN course,
 * and inserts Russian lessons + quizzes for days 1–2.
 */
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import {
  Brand,
  Course,
  Lesson,
  QuizQuestion,
  QuestionDifficulty,
} from '../app/lib/models';

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI missing');
  await mongoose.connect(uri);
  console.log('✅ Connected');
}

const COURSE_ID = 'B2B_SALES_2026_30_RU';
const SOURCE_COURSE = 'B2B_SALES_2026_30_EN';

type LessonSeed = {
  day: number;
  title: string;
  content: string;
  emailSubject: string;
  emailBody: string;
  quiz: Array<{ q: string; options: [string, string, string, string]; correct: number }>;
};

const lessonsRu: LessonSeed[] = [
  {
    day: 1,
    title: 'Что такое B2B и чем он отличается от B2C',
    content: `
## Цель дня
- Понять специфику B2B, роли в DMU, почему сделки длиннее и рискованнее.

## Ключевое
- B2B = высокий чек, несколько стейкхолдеров, юридические риски, длительные циклы.
- DMU: инициатор, пользователь, экономический ЛПР, тех‑эксперт, юрист/безопасность.
- ICP vs Buyer Persona: кто наша идеальная компания и кто внутри принимает решение.
- Каналы: контент/вебинары, холодные письма, рекомендации, партнёрки, тендеры.
- Метрики воронки: MQL → SQL → встреча → предложение → win.

## Примеры
- SaaS для логистики: DMU = операционный директор, IT, финдир, безопасность; цикл 60–120 дней.
- Интегратор 1С: пилот за 2 недели, но договор после юр. проверки на 12 мес.

## Практика
1) Опишите DMU для вашего сегмента.  
2) Выпишите 3 рисковых последствия для клиента при ошибочной покупке.

## Домашнее задание
- Сформируйте ICP (отрасль, размер, триггеры смены поставщика, KPI).
- Подготовьте 3 версии value statement: 1 строка, 30 сек, 2 мин.

## Ресурсы
- Что такое B2B продажи и каналы (imot.io, 2025)  
- Почему B2B сделки длинные (Snob, 2026)
`,
    emailSubject: '[День 1] B2B против B2C: ключевые отличия',
    emailBody: 'Сегодня разбираем, чем B2B-сделки отличаются от B2C и кто входит в DMU. В конце — практика и ICP.',
    quiz: [
      { q: 'Почему цикл B2B длиннее?', options: ['Много стейкхолдеров и согласований', 'Импульсные покупки', 'Низкий чек', 'Отсутствие рисков'], correct: 0 },
      { q: 'Кто отвечает за юридические риски в DMU?', options: ['Юрист/комплаенс', 'Пользователь', 'Маркетолог', 'HR'], correct: 0 },
      { q: 'Что такое ICP?', options: ['Идеальный профиль компании-клиента', 'Скрипт звонка', 'Коммерческое предложение', 'План контента'], correct: 0 },
      { q: 'Цена ошибки в B2B…', options: ['Выше и влияет на карьеру ЛПР', 'Неважна', 'Ниже, чем в B2C', 'Всегда одинаковая'], correct: 0 },
      { q: 'Лучший канал быстрого прогрева без продаж?', options: ['Вебинары/контент', 'Баннеры в ТЦ', 'POS-материалы', 'Радио'], correct: 0 },
      { q: 'MQL → SQL означает…', options: ['Лид передан из маркетинга в продажи', 'Сделка закрыта', 'Цена упала', 'Лид потерян'], correct: 0 },
      { q: 'Кто чаще инициирует закупку?', options: ['Пользователь/операционный лидер', 'Юрист', 'Бухгалтер', 'HR'], correct: 0 },
      { q: 'Что НЕ верно для B2B?', options: ['Решение принимает один человек', 'Длинные циклы', 'Много согласований', 'Важна репутация'], correct: 0 },
      { q: 'Что повышает шанс встречи?', options: ['Указание конкретного триггера клиента', 'Шаблонный спам', 'Общие фразы', 'Мемы'], correct: 0 },
      { q: 'Главная ошибка новичков?', options: ['Давление “купите завтра”, как в B2C', 'Работа с рисками', 'DMU map', 'Расчёт ROI'], correct: 0 },
    ],
  },
  {
    day: 2,
    title: 'Цикл сделки и квалификация через SPIN',
    content: `
## Цель дня
- Понимать 7 этапов сделки и квалифицировать потребность вопросами SPIN.

## Ключевое
- Этапы: лид → контакт → встреча → диагностика → решение → согласования → контракт/внедрение.
- Где умирают сделки: нет DMU map, нет next step, нет бизнес-кейса.
- SPIN: Situation, Problem, Implication, Need-Payoff. Каждый ответ — повод для next step.
- Быстрый бизнес-кейс: проблема → деньги → ROI/срок окупаемости → риски → следующий шаг.
- Recap письма и MoM фиксируют договорённости и дату следующего действия.

## Примеры SPIN
- S: “Как сейчас считаете TCO для подрядчиков?”  
- P: “Что происходит, если расчёт задерживается?”  
- I: “Задержка = поздний бюджет и потеря квартальных скидок?”  
- N: “Если автоматизировать TCO, сможете закрывать квартал на 5 дней раньше — полезно?”

## Практика
1) Напишите по 3 вопроса каждого типа SPIN под ваш продукт.  
2) Отметьте, на каком шаге цикла у вас чаще всего стопор и что туда добавить.

## Домашнее задание
- Проведите диагностическую встречу по SPIN (или смоделируйте) и зафиксируйте next step.
- Напишите короткий бизнес-кейс: проблема, деньги, срок окупаемости, риски.

## Ресурсы
- SPIN-кратко (simpleone.ru)  
- Как сокращать цикл сделки в B2B (contact-center.ru)
`,
    emailSubject: '[День 2] Цикл сделки + SPIN',
    emailBody: 'Разбираем 7 этапов сделки и технику SPIN, чтобы каждый контакт вел к следующему шагу.',
    quiz: [
      { q: 'Главная цель диагностики?', options: ['Понять проблему и её стоимость', 'Сразу торговаться', 'Показать презентацию', 'Собрать email'], correct: 0 },
      { q: 'Что делает “извлекающий” вопрос?', options: ['Показывает последствия проблемы', 'Собирает факты', 'Закрывает сделку', 'Делает комплимент'], correct: 0 },
      { q: 'Где чаще всего ломается сделка?', options: ['Между решением и согласованиями', 'На холодном звонке', 'После оплаты', 'На доставке'], correct: 0 },
      { q: 'Что должно быть после каждой встречи?', options: ['Протокол + следующий шаг с датой', 'Ничего', 'Только “спасибо” письмо', 'Новый прайс'], correct: 0 },
      { q: 'Как сократить цикл?', options: ['Убрать неизвестных из DMU и работать с ЛПР', 'Больше скидок', 'Отложить demo', 'Игнорировать юристов'], correct: 0 },
      { q: 'Что фиксировать в MoM?', options: ['Роли DMU, риски, agreed next step', 'Погоду', 'Курсы валют', 'Цвет галстука'], correct: 0 },
      { q: 'Какая ошибка в SPIN?', options: ['“Вам нравится наш бренд?”', '“Кто утверждает бюджет?”', '“Что будет, если внедрение задержится?”', '“Кто отвечает за ИБ?”'], correct: 0 },
      { q: 'Что ускоряет согласования?', options: ['Шаблон договора и риски заранее', 'Молчание', 'Только скидка', 'Игнор юристов'], correct: 0 },
      { q: 'Чем Need-Payoff отличается?', options: ['Связывает решение с выгодой клиента', 'Собирает статистику', 'Просит рекомендацию', 'Уточняет бюджет'], correct: 0 },
      { q: 'Зачем считать бизнес-кейс?', options: ['Показать ROI и снизить риск для ЛПР', 'Для красоты', 'Чтобы увеличить цену', 'Чтобы заполнить CRM'], correct: 0 },
    ],
  },
];

async function upsertCourse() {
  const source = await Course.findOne({ courseId: SOURCE_COURSE });
  const fallbackBrand = source
    ? null
    : await Brand.findOne({ slug: 'amanoba' }) || await Brand.findOne({});
  if (!source && !fallbackBrand) throw new Error('No brand found to create course');

  let course = await Course.findOne({ courseId: COURSE_ID });
  if (course) {
    console.log('✅ Course already exists, updating name/description');
    course.name = 'B2B Sales 2026 — 30 дней (RU)';
    course.description = '30-дневная программа по B2B продажам: DMU, SPIN, цикл сделки, ROI и работа с рисками.';
    course.language = 'ru';
    await course.save();
    return course;
  }

  course = await Course.create({
    courseId: COURSE_ID,
    name: 'B2B Sales 2026 — 30 дней (RU)',
    description: '30-дневная программа по B2B продажам: DMU, SPIN, цикл сделки, ROI и работа с рисками.',
    language: 'ru',
    thumbnail: source?.thumbnail,
    durationDays: source?.durationDays ?? 30,
    isActive: true,
    requiresPremium: source?.requiresPremium ?? false,
    price: source?.price ?? { amount: 0, currency: 'USD' },
    brandId: source?.brandId ?? fallbackBrand!._id,
    pointsConfig: source?.pointsConfig ?? { completionPoints: 300, lessonPoints: 25, perfectCourseBonus: 200 },
    xpConfig: source?.xpConfig ?? { completionXP: 300, lessonXP: 25 },
    metadata: {
      ...source?.metadata,
      locale: 'ru',
      parentCourseId: SOURCE_COURSE,
    },
  });

  console.log('✅ Created course', course.courseId);
  return course;
}

async function upsertLessons(courseId: mongoose.Types.ObjectId) {
  for (const lesson of lessonsRu) {
    const lessonId = `${COURSE_ID}_DAY_${lesson.day}`;
    const existing = await Lesson.findOne({ lessonId });
    const sourceCourse = await Course.findOne({ courseId: SOURCE_COURSE });
    const baseSource = sourceCourse
      ? await Lesson.findOne({ courseId: sourceCourse._id, dayNumber: lesson.day })
      : null;
    const pointsReward = baseSource?.pointsReward ?? 25;
    const xpReward = baseSource?.xpReward ?? 25;
    const quizConfig = baseSource?.quizConfig ?? { enabled: true, successThreshold: 70, questionCount: 5, poolSize: 10, required: true };

    const data = {
      lessonId,
      courseId,
      dayNumber: lesson.day,
      language: 'ru',
      title: lesson.title,
      content: lesson.content.trim(),
      emailSubject: lesson.emailSubject,
      emailBody: lesson.emailBody,
      quizConfig,
      pointsReward,
      xpReward,
      isActive: true,
      displayOrder: lesson.day,
      metadata: {
        estimatedMinutes: 20,
        tags: ['b2b', 'sales', 'ru'],
      },
    };

    if (existing) {
      await Lesson.updateOne({ lessonId }, data);
      console.log(`🔁 Updated lesson ${lessonId}`);
    } else {
      await Lesson.create(data);
      console.log(`✅ Created lesson ${lessonId}`);
    }
  }
}

async function upsertQuizQuestions(courseId: mongoose.Types.ObjectId) {
  for (const lesson of lessonsRu) {
    const lessonDoc = await Lesson.findOne({ lessonId: `${COURSE_ID}_DAY_${lesson.day}` });
    if (!lessonDoc) throw new Error(`Lesson not found for day ${lesson.day}`);

    // Remove old course-specific questions for this lesson
    await QuizQuestion.deleteMany({ lessonId: lessonDoc._id.toString(), isCourseSpecific: true });

    const questions = lesson.quiz.map((q) => ({
      question: q.q,
      options: q.options,
      correctIndex: q.correct,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific',
      showCount: 0,
      correctCount: 0,
      isActive: true,
      lessonId: lessonDoc._id.toString(),
      courseId,
      isCourseSpecific: true,
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }));

    await QuizQuestion.insertMany(questions);
    console.log(`✅ Inserted ${questions.length} quiz questions for day ${lesson.day}`);
  }
}

async function main() {
  await connectDB();
  const course = await upsertCourse();
  await upsertLessons(course._id);
  await upsertQuizQuestions(course._id);
  console.log('🎉 Done');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
