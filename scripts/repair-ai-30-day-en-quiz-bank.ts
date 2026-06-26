/**
 * Repair AI_30_DAY_EN quiz bank.
 *
 * Goal:
 * - Replace weak/generated quiz questions with standalone scenario questions.
 * - Keep every question usable in a final exam without day/lesson context.
 * - Use plausible, educational distractors instead of joke/filler answers.
 *
 * Usage:
 * - Dry-run: npx tsx --env-file=.env.local scripts/repair-ai-30-day-en-quiz-bank.ts
 * - Apply:   npx tsx --env-file=.env.local scripts/repair-ai-30-day-en-quiz-bank.ts --apply
 */

import { randomUUID } from 'crypto';
import { mkdirSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { config } from 'dotenv';
import mongoose from 'mongoose';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion, QuestionDifficulty, QuizQuestionType } from '../app/lib/models';
import { validateLessonQuestions } from './question-quality-validator';

const COURSE_ID = 'AI_30_DAY_EN';
const LANGUAGE = 'en';
const APPLY = process.argv.includes('--apply');

type Topic = {
  skill: string;
  work: string;
  artifact: string;
  check: string;
  risk: string;
  metric: string;
};

type AuthoredQuestion = {
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: QuestionDifficulty;
  questionType: QuizQuestionType;
  hashtags: string[];
};

const TOPICS: Record<number, Topic> = {
  1: {
    skill: 'safe AI use',
    work: 'drafting a customer reply with non-sensitive context',
    artifact: 'a use map with allowed tasks, prohibited tasks, and review rules',
    check: 'facts, tone, sensitive-data exposure, and human accountability',
    risk: 'shipping confident text that contains unsupported claims or private data',
    metric: 'zero sensitive data exposure and every factual claim verified before sending',
  },
  2: {
    skill: 'structured prompting',
    work: 'turning a vague request into a repeatable prompt',
    artifact: 'a prompt containing context, task, constraints, and success criteria',
    check: 'whether the output follows the requested format and satisfies the checklist',
    risk: 'getting a fluent but random answer because the request lacks constraints',
    metric: 'two separate runs meet the same output checklist',
  },
  3: {
    skill: 'iteration',
    work: 'improving a rough AI draft for an internal memo',
    artifact: 'a draft, critique, revision, and final verification note',
    check: 'which checklist items failed and whether the revision fixed them',
    risk: 'asking for vague rewrites until the output drifts away from the purpose',
    metric: 'the final version passes the written rubric within three revision cycles',
  },
  4: {
    skill: 'workflow decomposition',
    work: 'turning a complex writing task into manageable AI-assisted steps',
    artifact: 'a workflow with input contracts, output contracts, and a QA step',
    check: 'whether each step has a clear input, output, and failure rule',
    risk: 'using one oversized prompt that hides errors and produces inconsistent output',
    metric: 'the workflow can be rerun by another person with similar results',
  },
  5: {
    skill: 'AI quality assurance',
    work: 'reviewing AI-generated content before publishing',
    artifact: 'a QA checklist with red flags, guardrails, and escalation rules',
    check: 'facts, numbers, tone, policy fit, and uncertainty flags',
    risk: 'treating polished wording as proof of correctness',
    metric: 'no unsupported factual claims or policy-sensitive outputs ship without review',
  },
  6: {
    skill: 'prompt templates',
    work: 'standardizing repeated summaries, emails, and outlines',
    artifact: 'a small template library with placeholders and a QA block',
    check: 'whether placeholders are filled and the output follows the template rules',
    risk: 'copying an old prompt that contains hidden assumptions or missing variables',
    metric: 'editing time drops while output structure remains consistent',
  },
  7: {
    skill: 'role and boundary prompting',
    work: 'creating a specialized AI reviewer for team documents',
    artifact: 'a role prompt with priorities, constraints, and refusal-to-guess rules',
    check: 'whether the model asks for missing inputs instead of inventing details',
    risk: 'using a vague role that sounds expert but has no boundaries',
    metric: 'missing information is flagged instead of silently guessed',
  },
  8: {
    skill: 'fact verification',
    work: 'checking a factual AI summary before it reaches stakeholders',
    artifact: 'a claim table with sources, assumptions, and uncertain items',
    check: 'whether every factual claim has evidence or is marked unknown',
    risk: 'accepting invented citations or unsupported numbers',
    metric: 'unsupported-claim count falls to zero before publication',
  },
  9: {
    skill: 'actionable summarization',
    work: 'summarizing meeting notes for a project team',
    artifact: 'a summary with decisions, risks, open questions, and owner-based actions',
    check: 'whether actions include owner, next step, and due date where known',
    risk: 'compressing text while losing decisions and follow-up responsibilities',
    metric: 'readers can identify all next actions in under two minutes',
  },
  10: {
    skill: 'tone rewriting',
    work: 'rewriting a technical note for executives without changing meaning',
    artifact: 'a rewrite plus a meaning-diff check',
    check: 'whether facts, commitments, and constraints survived the rewrite',
    risk: 'changing the promise or adding new claims while improving style',
    metric: 'zero unintended changes in facts or commitments',
  },
  11: {
    skill: 'outlining and storyboarding',
    work: 'planning a brief or slide deck before drafting',
    artifact: 'a section outline with audience, purpose, examples, and acceptance criteria',
    check: 'whether each section has a clear job and proof point',
    risk: 'generating attractive headings with no logic or decision path',
    metric: 'drafting starts from a complete structure instead of a blank page',
  },
  12: {
    skill: 'research planning',
    work: 'using AI to plan research before answering a business question',
    artifact: 'clarifying questions, assumptions, source plan, and verification steps',
    check: 'whether uncertain claims are separated from confirmed evidence',
    risk: 'letting AI answer before the decision and evidence needs are clear',
    metric: 'key assumptions are tested before recommendations are made',
  },
  13: {
    skill: 'section-by-section drafting',
    work: 'building a long-form article or internal guide',
    artifact: 'section contracts, draft sections, examples, transitions, and final QA',
    check: 'whether every section serves the outline and includes an example',
    risk: 'creating a long fluent draft that repeats itself and misses required parts',
    metric: 'each section passes its contract before the full draft is assembled',
  },
  14: {
    skill: 'format transformation',
    work: 'turning narrative notes into a table or bullet brief',
    artifact: 'a transformed output plus a meaning-diff report',
    check: 'whether important facts were dropped, added, or changed',
    risk: 'making the format cleaner while losing a critical constraint',
    metric: 'meaning drift is zero and readability improves',
  },
  15: {
    skill: 'automation-ready prompting',
    work: 'preparing a prompt for repeated use in an automated workflow',
    artifact: 'numbered pseudo-steps with input validation and failure rules',
    check: 'whether the process can stop, ask, or escalate when inputs are incomplete',
    risk: 'automating a fragile prompt that depends on hidden context',
    metric: 'messy inputs trigger defined recovery behavior instead of bad output',
  },
  16: {
    skill: 'bounded brainstorming',
    work: 'generating options for a constrained business problem',
    artifact: 'an option list scored by impact, effort, and risk',
    check: 'whether ideas are filtered into concrete next actions',
    risk: 'creating a large idea list with no selection criteria',
    metric: 'at least two options have a scored rationale and next step',
  },
  17: {
    skill: 'decision support',
    work: 'choosing between competing operational options',
    artifact: 'a decision table with criteria, tradeoffs, assumptions, and conditions',
    check: 'whether the recommendation states when it would no longer hold',
    risk: 'using generic pros and cons that hide the real tradeoff',
    metric: 'the decision has a next test and documented assumptions',
  },
  18: {
    skill: 'small-data analysis',
    work: 'summarizing a simple spreadsheet with AI assistance',
    artifact: 'a table summary with formulas, units, assumptions, and sanity checks',
    check: 'whether row counts, units, formulas, and outliers are verified',
    risk: 'letting the model guess trends without transparent calculations',
    metric: 'calculations reconcile with the source table before conclusions are used',
  },
  19: {
    skill: 'persona adaptation',
    work: 'adapting the same message for two different stakeholder groups',
    artifact: 'two persona-specific versions plus a locked core-meaning note',
    check: 'whether both versions preserve the same facts and commitments',
    risk: 'over-personalizing until the message says different things to different people',
    metric: 'meaning diff shows no unintended factual changes',
  },
  20: {
    skill: 'structured feedback',
    work: 'collecting team review comments on an AI-assisted draft',
    artifact: 'a rubric, actionable feedback list, revision plan, and change log',
    check: 'whether each comment maps to a criterion and a concrete edit',
    risk: 'accepting vague approval or vague criticism that cannot improve the work',
    metric: 'revision cycles decrease and post-release issues are tracked',
  },
  21: {
    skill: 'FAQ and knowledge-base building',
    work: 'turning support questions into scoped knowledge-base answers',
    artifact: 'clustered questions, scoped answers, examples, and escalation rules',
    check: 'whether answers are grounded in real questions and policy boundaries',
    risk: 'inventing neat FAQs that do not reflect actual user problems',
    metric: 'repeat support questions decline after the article is published',
  },
  22: {
    skill: 'prompt A/B testing',
    work: 'comparing two prompt variants on repeated inputs',
    artifact: 'an evaluation set, score sheet, and adopted prompt version',
    check: 'whether both variants are tested on the same inputs with the same rubric',
    risk: 'picking the prompt that happened to look better on one run',
    metric: 'winner improves rubric score or reduces edit time on representative inputs',
  },
  23: {
    skill: 'rubric scoring',
    work: 'making AI output quality less subjective',
    artifact: 'a rubric with criteria, score levels, anchors, and revision guidance',
    check: 'whether reviewers can score the same output consistently',
    risk: 'calling an output good without defining what good means',
    metric: 'score agreement improves and low-scoring criteria guide revisions',
  },
  24: {
    skill: 'uncertainty handling',
    work: 'handling refusals, unknowns, and hallucinated claims safely',
    artifact: 'a response path for refusal, uncertainty, evidence gaps, and safe reframing',
    check: 'whether unsupported claims are removed or marked unknown',
    risk: 'pressuring the model to answer when it should ask or stop',
    metric: 'uncertain items are flagged and resolved before use',
  },
  25: {
    skill: 'privacy guardrails',
    work: 'using AI with customer or company information',
    artifact: 'a redaction checklist, allowed-data list, and escalation path',
    check: 'whether inputs contain unnecessary personal, contractual, or secret data',
    risk: 'pasting sensitive records into a prompt because they feel convenient',
    metric: 'only minimum sanitized data is used for the task',
  },
  26: {
    skill: 'table and CSV transformation',
    work: 'cleaning and reshaping a small operational table',
    artifact: 'a schema note, transformation instructions, output table, and validation line',
    check: 'whether columns, operations, row counts, and missing fields are explicit',
    risk: 'adding or deleting rows silently while changing table format',
    metric: 'row count and required fields reconcile before the output is accepted',
  },
  27: {
    skill: 'safe outreach drafting',
    work: 'creating a short business outreach sequence',
    artifact: 'messages with verified placeholders, truthful personalization, and CTAs',
    check: 'whether every personalized detail is verified and compliant',
    risk: 'inventing recipient facts to make the message feel personal',
    metric: 'messages pass truthfulness, length, tone, and compliance checks before sending',
  },
  28: {
    skill: 'slide and brief preparation',
    work: 'creating a concise presentation outline',
    artifact: 'a storyboard with one key message, bullets, proof, and notes per slide',
    check: 'whether each slide has one clear point and no fake statistics',
    risk: 'turning slides into dense documents with unsupported claims',
    metric: 'the audience can identify the recommendation and evidence quickly',
  },
  29: {
    skill: 'personal AI workflow design',
    work: 'making AI part of a daily work routine',
    artifact: 'templates, daily steps, metrics, and a weekly review cadence',
    check: 'whether the workflow is repeatable and improves from review data',
    risk: 'random prompting that never becomes a reusable system',
    metric: 'time saved, edit count, and error rate are reviewed weekly',
  },
  30: {
    skill: 'end-to-end AI workflow',
    work: 'shipping one real deliverable with AI assistance',
    artifact: 'a playbook with inputs, prompts, QA, guardrails, results, and improvements',
    check: 'whether the workflow can be reused and the final output has evidence',
    risk: 'treating the final deliverable as a one-off draft with no QA trail',
    metric: 'the workflow can be repeated next week with fewer edits and known safeguards',
  },
};

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function q(topic: Topic, index: number): AuthoredQuestion {
  const hashBase = topic.skill.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const base = [`#ai`, `#${hashBase}`, '#en'];

  const specs: AuthoredQuestion[] = [
    {
      question: `A team is using AI for ${topic.work}. They need a reliable result, not just a fluent draft. What should they do first?`,
      options: [
        `Define ${topic.artifact}, then use it to direct the model and review the result.`,
        `Ask for a polished answer immediately, because fluent wording is enough proof of quality for ${topic.skill}.`,
        `Choose the longest generated answer, because length usually proves the work is complete and accurate.`,
        `Remove constraints so the model can be more creative, then decide later whether the output fits.`,
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      hashtags: [...base, '#application', '#first-step'],
    },
    {
      question: `An AI output for ${topic.work} looks confident, but the team must prevent avoidable mistakes. Which review behavior is strongest?`,
      options: [
        `Check ${topic.check}, document any uncertainty, and revise before the output is used.`,
        `Approve the output if it sounds professional, because style is the main quality signal in ${topic.skill}.`,
        `Run the same prompt again and keep whichever answer is shorter, even if neither answer is checked.`,
        `Ask the model whether it is correct, then treat its self-confirmation as a final validation step.`,
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.HARD,
      questionType: QuizQuestionType.APPLICATION,
      hashtags: [...base, '#application', '#quality-assurance'],
    },
    {
      question: `A colleague wants to reuse AI for ${topic.work} next month. What artifact makes the process most repeatable?`,
      options: [
        `${topic.artifact} plus a short note explaining when and how to apply it.`,
        `A screenshot of the nicest answer, without the input, criteria, or review notes that produced it.`,
        `A vague reminder to use AI for the same general purpose whenever there is spare time.`,
        `A private chat history that only one person can interpret and no one else can verify.`,
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      hashtags: [...base, '#application', '#repeatability'],
    },
    {
      question: `A manager sees ${topic.risk} while using AI for ${topic.work}. Which correction addresses the real risk?`,
      options: [
        `Add explicit criteria, human review, and a verification step focused on ${topic.check}.`,
        `Increase the amount of generated text, because bigger answers usually contain fewer mistakes.`,
        `Lower the review standard for AI-assisted work, because the model already optimized the response.`,
        `Move faster by hiding uncertain parts from reviewers so the workflow feels smoother.`,
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.HARD,
      questionType: QuizQuestionType.CRITICAL_THINKING,
      hashtags: [...base, '#critical-thinking', '#risk'],
    },
    {
      question: `A team wants to know whether their ${topic.skill} workflow is improving. Which measurement is most useful?`,
      options: [
        `${topic.metric}, with results reviewed after real uses rather than assumed from one successful demo.`,
        `The number of prompts written, even if none of the outputs are checked or reused.`,
        `The emotional confidence of the person prompting, regardless of errors found after publication.`,
        `The visual length of the answer, because longer AI responses are normally more trustworthy.`,
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      hashtags: [...base, '#application', '#metrics'],
    },
    {
      question: `Two teams approach ${topic.work} differently: one uses criteria and review, the other relies on quick generation. What is the best comparison?`,
      options: [
        `The criteria-based team is more likely to catch ${topic.risk} and produce a reusable workflow.`,
        `The quick-generation team is safer because fewer instructions leave less room for misunderstanding.`,
        `Both approaches are equivalent as long as the output is grammatically correct and pleasant to read.`,
        `The fastest approach should always win because review creates more risk than unchecked output.`,
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.HARD,
      questionType: QuizQuestionType.CRITICAL_THINKING,
      hashtags: [...base, '#critical-thinking', '#tradeoff'],
    },
    {
      question: `A reviewer says the AI-assisted result for ${topic.work} is not ready. Which evidence would most directly show readiness?`,
      options: [
        `A completed check of ${topic.check}, plus the final changes made because of that check.`,
        `A statement that the model produced the answer quickly and did not display an error message.`,
        `A note that the output sounds similar to previous AI responses, even without source comparison.`,
        `A decision to skip review because the task feels familiar and the deadline is close.`,
      ],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      questionType: QuizQuestionType.APPLICATION,
      hashtags: [...base, '#application', '#readiness'],
    },
  ];

  return specs[index];
}

function buildQuestions(topic: Topic) {
  return Array.from({ length: 7 }, (_, index) => {
    const item = q(topic, index);
    const targetCorrectIndex = [0, 1, 2, 3, 1, 2, 3][index] as 0 | 1 | 2 | 3;
    if (targetCorrectIndex === 0) return item;

    const options = [...item.options] as [string, string, string, string];
    const correct = options[0];
    options[0] = options[targetCorrectIndex];
    options[targetCorrectIndex] = correct;
    return {
      ...item,
      options,
      correctIndex: targetCorrectIndex,
    };
  });
}

async function main() {
  await connectDB();

  const course = await Course.findOne({ courseId: COURSE_ID, isActive: true });
  if (!course) throw new Error(`Course not found: ${COURSE_ID}`);

  const lessons = await Lesson.find({ courseId: course._id, isActive: true })
    .sort({ dayNumber: 1, displayOrder: 1, createdAt: 1, _id: 1 })
    .select('_id lessonId dayNumber title content')
    .lean();

  const lessonsByDay = new Map<number, any>();
  for (const lesson of lessons) {
    if (!lessonsByDay.has(Number(lesson.dayNumber))) lessonsByDay.set(Number(lesson.dayNumber), lesson);
  }

  const stamp = isoStamp();
  const backupDir = join(process.cwd(), 'scripts', 'quiz-backups', COURSE_ID);
  mkdirSync(backupDir, { recursive: true });

  const report: any[] = [];
  let activeBefore = 0;
  let deactivated = 0;
  let inserted = 0;

  for (let day = 1; day <= 30; day += 1) {
    const lesson = lessonsByDay.get(day);
    const topic = TOPICS[day];
    if (!lesson) throw new Error(`Missing active lesson for ${COURSE_ID} day ${day}`);
    if (!topic) throw new Error(`Missing quiz topic for day ${day}`);

    const questions = buildQuestions(topic);
    const validation = validateLessonQuestions(
      questions.map((item) => ({
        question: item.question,
        options: item.options,
        questionType: item.questionType,
        difficulty: item.difficulty,
        correctIndex: item.correctIndex,
      })),
      LANGUAGE,
      String(lesson.title || ''),
      String(lesson.content || '')
    );
    if (!validation.isValid) {
      throw new Error(`Question validation failed for day ${day} (${lesson.lessonId}):\n- ${validation.errors.join('\n- ')}`);
    }

    const existing = await QuizQuestion.find({
      lessonId: lesson.lessonId,
      courseId: course._id,
      isCourseSpecific: true,
      isActive: true,
    })
      .sort({ 'metadata.createdAt': 1, _id: 1 })
      .lean();

    activeBefore += existing.length;
    const backupPath = join(backupDir, `${lesson.lessonId}__${stamp}.json`);

    report.push({
      day,
      lessonId: lesson.lessonId,
      title: lesson.title,
      existingActive: existing.length,
      replacementCount: questions.length,
      backupPath,
      warnings: validation.warnings,
    });

    if (!APPLY) continue;

    writeFileSync(
      backupPath,
      JSON.stringify(
        {
          backedUpAt: new Date().toISOString(),
          course: { courseId: COURSE_ID, name: course.name, language: course.language },
          lesson: { lessonId: lesson.lessonId, dayNumber: lesson.dayNumber, title: lesson.title },
          questionCount: existing.length,
          questions: existing.map((existingQuestion: any) => ({
            _id: String(existingQuestion._id),
            uuid: existingQuestion.uuid,
            questionType: existingQuestion.questionType,
            difficulty: existingQuestion.difficulty,
            question: existingQuestion.question,
            options: existingQuestion.options,
            correctIndex: existingQuestion.correctIndex,
            correctAnswer: existingQuestion.correctAnswer,
            wrongAnswers: existingQuestion.wrongAnswers,
            hashtags: existingQuestion.hashtags,
          })),
        },
        null,
        2
      )
    );

    if (existing.length > 0) {
      const update = await QuizQuestion.updateMany(
        { _id: { $in: existing.map((existingQuestion: any) => existingQuestion._id) } },
        {
          $set: {
            isActive: false,
            'metadata.updatedAt': new Date(),
            'metadata.auditedAt': new Date(),
            'metadata.auditedBy': 'repair-ai-30-day-en-quiz-bank',
          },
        }
      );
      deactivated += update.modifiedCount;
    }

    const now = new Date();
    const docs = questions.map((item, index) => ({
      uuid: randomUUID(),
      question: item.question,
      options: item.options,
      correctIndex: item.correctIndex,
      difficulty: item.difficulty,
      category: 'Course Specific',
      showCount: 0,
      correctCount: 0,
      isActive: true,
      lessonId: lesson.lessonId,
      courseId: course._id,
      relatedCourseIds: [],
      isCourseSpecific: true,
      questionType: item.questionType,
      hashtags: item.hashtags,
      metadata: {
        createdAt: now,
        updatedAt: now,
        createdBy: 'repair-ai-30-day-en-quiz-bank',
        auditedAt: now,
        auditedBy: 'repair-ai-30-day-en-quiz-bank',
      },
    }));
    const newDocs = await QuizQuestion.insertMany(docs);
    inserted += newDocs.length;
  }

  const reportDir = join(process.cwd(), 'scripts', 'reports');
  mkdirSync(reportDir, { recursive: true });
  const reportPath = join(reportDir, `repair-ai-30-day-en-quiz-bank__${stamp}.json`);
  writeFileSync(
    reportPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        courseId: COURSE_ID,
        apply: APPLY,
        activeBefore,
        deactivated,
        inserted,
        report,
      },
      null,
      2
    )
  );

  console.log('AI quiz repair complete');
  console.log(`- apply: ${APPLY ? 'yes' : 'no'}`);
  console.log(`- active before: ${activeBefore}`);
  console.log(`- deactivated: ${deactivated}`);
  console.log(`- inserted: ${inserted}`);
  console.log(`- report: ${reportPath}`);

  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
