/**
 * Weekly course content-fix autopilot.
 *
 * What: Pick the oldest modified course, audit it, and turn the findings into GitHub issues.
 * Why: Keep course content, quizzes, certification, and structural hygiene moving on a steady cadence.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/course-content-fix-autopilot.ts audit [--course-id COURSE_ID] [--apply|--dry-run]
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import { execFileSync } from 'child_process';
import mongoose from 'mongoose';

config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

import connectDB from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion } from '../app/lib/models';
import { assessLessonQuality } from './lesson-quality';
import { validateLessonRecordLanguageIntegrity } from './language-integrity';
import { validateQuestionQuality } from './question-quality-validator';
import { getChildSyncStatus } from '../app/lib/course-helpers';
import {
  generateCourseContentFixPlan,
  type CourseContentFixGroupInput,
} from '../app/lib/ai/course-automation';
import { resolveLocalLLMProvider } from '../app/lib/ai/local-llm';

type ProjectState = {
  projectId: string;
  statusFieldId: string;
  statusOptionId: string;
  doneOptionId: string;
};

type AuditGroup = CourseContentFixGroupInput & {
  issueTitle: string;
  issueSlug: string;
  bullets: string[];
};

type AuditBundle = {
  course: {
    courseId: string;
    name: string;
    language: string;
    updatedAt?: string;
    isActive: boolean;
    isDraft: boolean;
    durationDays: number;
    parentCourseId?: string | null;
    selectedLessonIds?: string[];
    certification?: Record<string, unknown> | null;
  };
  selectionReason: string;
  selectedAt: string;
  lessonCount: number;
  activeLessonCount: number;
  questionCount: number;
  groups: AuditGroup[];
};

function readArg(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

function hasFlag(flag: string): boolean {
  return process.argv.includes(flag);
}

function normalizeCourseId(value: string): string {
  return String(value || '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_]+/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_+|_+$/g, '');
}

function slugify(value: string): string {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function isoStamp(): string {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function usage(): never {
  console.error([
    'Usage:',
    '  audit   [--course-id COURSE_ID] [--apply|--dry-run] [--out DIR]',
    '',
    'Environment:',
    '  LLM_PROVIDER=ollama|openai (optional)',
    '  OLLAMA_BASE_URL / OLLAMA_MODEL for local AI (optional)',
    '  GH_TOKEN or gh auth token with repo + project scope',
    '  MONGODB_URI via .env.local',
  ].join('\n'));
  process.exit(1);
}

function resolveMode(): 'audit' {
  const raw = process.argv[2];
  if (raw === 'audit') return 'audit';
  usage();
}

function runGh(args: string[]): string {
  const out = execFileSync('gh', args, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 }).trim();
  return out;
}

function ghJson(args: string[]): any {
  const raw = runGh(args);
  return raw ? JSON.parse(raw) : null;
}

function ghGraphQL(query: string, variables: Record<string, string | number | boolean> = {}): any {
  const args = ['api', 'graphql', '-f', `query=${query}`];
  for (const [key, value] of Object.entries(variables)) {
    if (typeof value === 'number' || typeof value === 'boolean') {
      args.push('-F', `${key}=${value}`);
    } else {
      args.push('-f', `${key}=${value}`);
    }
  }
  return ghJson(args);
}

function getIssueUrlFromCreateOutput(raw: string): string {
  const trimmed = String(raw || '').trim();
  if (!trimmed) {
    throw new Error('Empty response from gh issue create');
  }
  return trimmed.split(/\s+/).at(-1) || trimmed;
}

function formatLessonQualityIssues(issues: string[]): string {
  return issues.length ? issues.join(', ') : 'none';
}

function issuePriorityLabel(priority: 'high' | 'medium' | 'low'): string {
  if (priority === 'high') return 'priority:p0';
  if (priority === 'medium') return 'priority:p1';
  return 'priority:p2';
}

function issueTitleForGroup(courseId: string, group: AuditGroup): string {
  return `Amanoba content fix: ${courseId} ${group.issueTitle}`;
}

function bodyForGroup(
  bundle: AuditBundle,
  group: AuditGroup,
  planGroup: { summary: string; nextActions: string[]; researchNotes: string[] },
  teacherPersona: string
) {
  const lines: string[] = [];
  lines.push(`# ${issueTitleForGroup(bundle.course.courseId, group)}`);
  lines.push('');
  lines.push('## Why this issue exists');
  lines.push(`The weekly local AI audit found problems in the oldest modified course, so we are turning them into an actionable fix list.`);
  lines.push('');
  lines.push('## Course snapshot');
  lines.push(`- Course: \`${bundle.course.courseId}\``);
  lines.push(`- Name: ${bundle.course.name}`);
  lines.push(`- Language: \`${bundle.course.language}\``);
  lines.push(`- Updated at: ${bundle.course.updatedAt || 'unknown'}`);
  lines.push(`- Selected because: ${bundle.selectionReason}`);
  lines.push(`- Lessons scanned: ${bundle.lessonCount} (active: ${bundle.activeLessonCount})`);
  lines.push(`- Questions scanned: ${bundle.questionCount}`);
  lines.push(`- AI reviewer persona: ${teacherPersona}`);
  lines.push('');
  lines.push('## Summary');
  lines.push(planGroup.summary);
  lines.push('');
  lines.push('## Findings');
  for (const bullet of group.bullets) {
    lines.push(`- [ ] ${bullet}`);
  }
  lines.push('');
  lines.push('## Next actions');
  for (const action of planGroup.nextActions) {
    lines.push(`- ${action}`);
  }
  if (planGroup.nextActions.length === 0) {
    lines.push('- Review each finding and apply the smallest safe fix.');
  }
  if (planGroup.researchNotes.length > 0) {
    lines.push('');
    lines.push('## Research notes');
    for (const note of planGroup.researchNotes) {
      lines.push(`- ${note}`);
    }
  }
  lines.push('');
  lines.push('## Acceptance checks');
  if (group.key === 'lesson-content') {
    lines.push('- [ ] Each listed lesson reads like a complete, practical course lesson.');
    lines.push('- [ ] Each listed lesson has a visible `Student tasks` section with concrete learner work.');
    lines.push('- [ ] Each listed lesson has useful external sources or further reading links.');
    lines.push('- [ ] Each listed lesson has a bibliography/references section for the sources used.');
    lines.push('- [ ] Language, examples, and metrics are consistent with the course locale.');
  } else if (group.key === 'quiz-quality') {
    lines.push('- [ ] Each listed lesson has at least 7 valid quiz questions.');
    lines.push('- [ ] No recall-heavy or duplicate questions remain.');
    lines.push('- [ ] Questions are final-exam portable: no day number, lesson number, lesson title, or "this lesson" references.');
    lines.push('- [ ] Wrong answers are plausible domain mistakes, not silly, generic, or unrelated distractors.');
  } else if (group.key === 'certification') {
    lines.push('- [ ] The certification pool contains enough active questions for the configured final exam.');
    lines.push('- [ ] Final exam and certificate settings are internally consistent.');
  } else {
    lines.push('- [ ] Course length matches the active lesson set.');
    lines.push('- [ ] Any child-course sync drift has been cleared.');
  }
  lines.push('');
  lines.push('## Automation note');
  lines.push('This issue is managed by the weekly course-content-fix autopilot and should move to `CONTENT fix` on Project 12.');
  return lines.join('\n');
}

function previewManifestPath(outDir: string, courseId: string, stamp: string): string {
  return join(outDir, `content-fix-preview__${normalizeCourseId(courseId)}__${stamp}.json`);
}

function previewArtifactPaths(outDir: string, courseId: string, stamp: string, group: AuditGroup) {
  const previewDir = join(outDir, 'preview', normalizeCourseId(courseId), stamp);
  const markdownPath = join(previewDir, `${group.issueSlug}.md`);
  const jsonPath = join(previewDir, `${group.issueSlug}.json`);
  return { previewDir, markdownPath, jsonPath };
}

function writePreviewArtifact(params: {
  outDir: string;
  stamp: string;
  reportPath: string;
  bundle: AuditBundle;
  group: AuditGroup;
  planGroup: { summary: string; nextActions: string[]; researchNotes: string[] };
  teacherPersona: string;
}) {
  const { outDir, stamp, reportPath, bundle, group, planGroup, teacherPersona } = params;
  const { previewDir, markdownPath, jsonPath } = previewArtifactPaths(outDir, bundle.course.courseId, stamp, group);
  mkdirSync(previewDir, { recursive: true });

  const body = bodyForGroup(bundle, group, planGroup, teacherPersona);
  const artifact = {
    generatedAt: new Date().toISOString(),
    courseId: bundle.course.courseId,
    courseName: bundle.course.name,
    selectionReason: bundle.selectionReason,
    reportPath,
    issue: {
      title: issueTitleForGroup(bundle.course.courseId, group),
      slug: group.issueSlug,
      priority: group.priority,
      labels: ['product:amanoba', 'type:bug', 'quality', issuePriorityLabel(group.priority)],
      projectStatus: 'CONTENT fix',
    },
    previewFiles: {
      markdown: markdownPath,
      json: jsonPath,
    },
    teacherPersona,
    summary: planGroup.summary,
    nextActions: planGroup.nextActions,
    researchNotes: planGroup.researchNotes,
    findings: group.bullets,
  };

  writeFileSync(markdownPath, `${body}\n`, 'utf8');
  writeFileSync(jsonPath, `${JSON.stringify({ ...artifact, issueBody: body }, null, 2)}\n`, 'utf8');

  return { markdownPath, jsonPath, body, artifact };
}

async function findOldestModifiedCourse(courseIdOverride?: string) {
  const courseFilter: Record<string, unknown> = courseIdOverride ? { courseId: normalizeCourseId(courseIdOverride) } : {};
  const courses = await Course.find(courseFilter)
    .sort({ updatedAt: 1, createdAt: 1, _id: 1 })
    .select(
      'courseId name language updatedAt createdAt isActive isDraft durationDays parentCourseId selectedLessonIds syncStatus lastSyncedAt certification'
    )
    .lean();

  if (!courses.length) {
    throw new Error(courseIdOverride ? `Course not found: ${courseIdOverride}` : 'No courses found');
  }

  const lessonCounts = await Lesson.aggregate([
    {
      $group: {
        _id: '$courseId',
        totalLessons: { $sum: 1 },
        activeLessons: {
          $sum: {
            $cond: [{ $eq: ['$isActive', false] }, 0, 1],
          },
        },
      },
    },
  ]);
  const lessonCountByCourseId = new Map<string, { totalLessons: number; activeLessons: number }>();
  for (const row of lessonCounts as Array<{ _id: unknown; totalLessons: number; activeLessons: number }>) {
    lessonCountByCourseId.set(String(row._id), {
      totalLessons: Number(row.totalLessons || 0),
      activeLessons: Number(row.activeLessons || 0),
    });
  }

  const hasLessons = (course: { _id?: unknown }) => {
    const counts = lessonCountByCourseId.get(String(course._id));
    return Boolean(counts && counts.totalLessons > 0);
  };

  const candidates = [
    courses.find((course) => course.isActive !== false && !course.isDraft && !course.parentCourseId && hasLessons(course)),
    courses.find((course) => course.isActive !== false && !course.isDraft && hasLessons(course)),
    courses.find((course) => hasLessons(course)),
    courses[0],
  ].filter(Boolean) as Array<(typeof courses)[number]>;

  const selected = candidates[0];
  const counts = lessonCountByCourseId.get(String(selected._id)) || { totalLessons: 0, activeLessons: 0 };

  return {
    selected,
    courseCount: courses.length,
    lessonCount: counts.totalLessons,
    activeLessonCount: counts.activeLessons,
    selectionReason: courseIdOverride
      ? `Requested by course override`
      : `Oldest modified course with lessons after sorting by updatedAt asc`,
  };
}

function dedupeLessonsByDay<T extends { dayNumber?: number; createdAt?: Date | string; _id?: unknown }>(lessons: T[]): T[] {
  const byDay = new Map<number, T>();
  for (const lesson of lessons) {
    const day = Number(lesson.dayNumber || 0);
    if (!day || day < 1) continue;
    const existing = byDay.get(day);
    if (!existing) {
      byDay.set(day, lesson);
      continue;
    }
    const existingTime = existing.createdAt ? new Date(existing.createdAt).getTime() : 0;
    const currentTime = lesson.createdAt ? new Date(lesson.createdAt).getTime() : 0;
    if (currentTime < existingTime) {
      byDay.set(day, lesson);
      continue;
    }
    if (currentTime === existingTime && String(lesson._id).localeCompare(String(existing._id)) < 0) {
      byDay.set(day, lesson);
    }
  }
  return Array.from(byDay.values()).sort((a, b) => Number(a.dayNumber || 0) - Number(b.dayNumber || 0));
}

function buildGroupInputs(params: {
  course: any;
  lessons: any[];
  lessonQuestionMap: Map<string, any[]>;
  activeLessonCount: number;
  childSyncStatus: Awaited<ReturnType<typeof getChildSyncStatus>> | null;
}): AuditGroup[] {
  const { course, lessons, lessonQuestionMap, childSyncStatus } = params;

  const lessonBullets: string[] = [];
  const quizBullets: string[] = [];
  const structureBullets: string[] = [];
  const certificationBullets: string[] = [];

  const questionTextCounts = new Map<string, number>();

  for (const lesson of lessons) {
    const quality = assessLessonQuality({
      title: String(lesson.title || ''),
      content: String(lesson.content || ''),
      language: String(course.language || lesson.language || 'en'),
    });

    const languageIntegrity = validateLessonRecordLanguageIntegrity({
      language: String(course.language || lesson.language || 'en'),
      content: String(lesson.content || ''),
      emailSubject: lesson.emailSubject || null,
      emailBody: lesson.emailBody || null,
    });

    if (quality.score < 70 || !languageIntegrity.ok) {
      lessonBullets.push(
        `Day ${lesson.dayNumber} (${String(lesson.title || 'Untitled lesson')}): score ${quality.score}/100, issues ${formatLessonQualityIssues(
          quality.issues
        )}${!languageIntegrity.ok ? `, language: ${String(languageIntegrity.errors?.[0] || 'failed')}` : ''}`
      );
    }

    const lessonQuestions = lessonQuestionMap.get(String(lesson.lessonId)) || [];
    const validQuestions: any[] = [];
    const invalidSamples: string[] = [];
    let applicationCount = 0;
    let recallCount = 0;

    for (const question of lessonQuestions) {
      const normalizedQuestion = String(question.question || '').trim().toLowerCase().replace(/\s+/g, ' ');
      questionTextCounts.set(normalizedQuestion, (questionTextCounts.get(normalizedQuestion) || 0) + 1);

      const validation = validateQuestionQuality(
        String(question.question || ''),
        Array.isArray(question.options) ? question.options : [],
        question.questionType || 'application',
        question.difficulty || 'MEDIUM',
        String(course.language || lesson.language || 'en'),
        String(lesson.title || ''),
        String(lesson.content || '')
      );
      if (validation.isValid) {
        validQuestions.push(question);
      } else if (invalidSamples.length < 3) {
        invalidSamples.push(validation.errors[0] || 'Unknown question quality error');
      }
      if (String(question.questionType || '').toLowerCase() === 'application') {
        applicationCount += 1;
      }
      if (String(question.questionType || '').toLowerCase() === 'recall') {
        recallCount += 1;
      }
    }

    if (validQuestions.length < 7 || invalidSamples.length > 0 || applicationCount < 5 || recallCount > 0) {
      const issueSummaryBits = [
        `valid ${validQuestions.length}/7`,
        invalidSamples.length ? `${invalidSamples.length} invalid sample(s)` : null,
        applicationCount < 5 ? `application ${applicationCount}/5` : null,
        recallCount > 0 ? `recall ${recallCount}` : null,
      ].filter(Boolean);

      quizBullets.push(
        `Day ${lesson.dayNumber} (${String(lesson.title || 'Untitled lesson')}): ${issueSummaryBits.join(', ')}${invalidSamples.length ? `; examples: ${invalidSamples.join(' | ')}` : ''}`
      );
    }
  }

  const duplicateDays = new Map<number, number>();
  for (const lesson of lessons) {
    const day = Number(lesson.dayNumber || 0);
    duplicateDays.set(day, (duplicateDays.get(day) || 0) + 1);
  }
  for (const [day, count] of duplicateDays.entries()) {
    if (count > 1) {
      structureBullets.push(`Day ${day} is duplicated ${count} times in the course lesson set.`);
    }
  }

  if (Number(course.durationDays || 0) !== params.activeLessonCount) {
    structureBullets.push(
      `durationDays is ${Number(course.durationDays || 0)} but the course currently has ${params.activeLessonCount} active lesson(s).`
    );
  }

  if (childSyncStatus && childSyncStatus.status === 'out_of_sync') {
    const missingCount = childSyncStatus.missingLessonIds?.length || 0;
    structureBullets.push(
      `Child course sync is out of sync${missingCount ? `; ${missingCount} selected parent lesson id(s) are missing` : ''}.`
    );
  }

  const certification = course.certification || {};
  if (certification.enabled) {
    const certCourseId = normalizeCourseId(String(certification.poolCourseId || course.courseId));
    const certQuestionCount = Number(certification.certQuestionCount || 50);
    certificationBullets.push(
      `Certification is enabled with pool \`${certCourseId}\` and target final-exam size ${certQuestionCount}.`
    );

    if (!certification.templateId) {
      certificationBullets.push('Certificate templateId is missing, so issuance cannot render a stable branded certificate.');
    }
    if (typeof certification.passThresholdPercent !== 'number') {
      certificationBullets.push('passThresholdPercent is not set explicitly.');
    }
  }

  const questionDuplicates = Array.from(questionTextCounts.entries()).filter(([, count]) => count > 1);
  if (questionDuplicates.length > 0) {
    quizBullets.push(`Duplicate question text detected in ${questionDuplicates.length} question group(s).`);
  }

  return [
    lessonBullets.length
      ? {
          key: 'lesson-content' as const,
          label: 'lesson content refresh',
          priority: 'high' as const,
          issueTitle: 'lesson content refresh',
          issueSlug: 'lesson-content-refresh',
          bullets: lessonBullets,
        }
      : null,
    quizBullets.length
      ? {
          key: 'quiz-quality' as const,
          label: 'quiz quality cleanup',
          priority: 'high' as const,
          issueTitle: 'quiz quality cleanup',
          issueSlug: 'quiz-quality-cleanup',
          bullets: quizBullets,
        }
      : null,
    certificationBullets.length
      ? {
          key: 'certification' as const,
          label: 'certification and final-exam audit',
          priority: 'medium' as const,
          issueTitle: 'certification and final-exam audit',
          issueSlug: 'certification-final-exam-audit',
          bullets: certificationBullets,
        }
      : null,
    structureBullets.length
      ? {
          key: 'structure' as const,
          label: 'structure and sync cleanup',
          priority: 'medium' as const,
          issueTitle: 'structure and sync cleanup',
          issueSlug: 'structure-sync-cleanup',
          bullets: structureBullets,
        }
      : null,
  ].filter(Boolean) as AuditGroup[];
}

async function ensureContentFixProjectState(): Promise<ProjectState> {
  const owner = process.env.MVP_PROJECT_OWNER || 'moldovancsaba';
  const projectNumber = Number(process.env.MVP_PROJECT_NUMBER || 12);

  const projectQuery = `
    query($owner: String!, $number: Int!) {
      user(login: $owner) {
        projectV2(number: $number) {
          id
          fields(first: 20) {
            nodes {
              ... on ProjectV2SingleSelectField {
                id
                name
                options { id name color description }
              }
            }
          }
        }
      }
    }
  `;
  const projectData = ghGraphQL(projectQuery, { owner, number: projectNumber });
  const project = projectData?.data?.user?.projectV2;
  if (!project) {
    throw new Error(`Unable to load Project ${projectNumber} for ${owner}`);
  }

  const statusField = (project.fields.nodes as Array<{ id: string; name: string; options: Array<{ id: string; name: string; color: string; description: string }> }>).find(
    (field) => field.name === 'Status'
  );
  if (!statusField) {
    throw new Error('Project 12 Status field not found');
  }

  const existingOption = statusField.options.find((option) => option.name === 'CONTENT fix');
  const doneOption = statusField.options.find((option) => option.name === 'Done');

  if (existingOption && doneOption) {
    return {
      projectId: project.id,
      statusFieldId: statusField.id,
      statusOptionId: existingOption.id,
      doneOptionId: doneOption.id,
    };
  }

  const updatedOptions = [
    ...statusField.options.map((option) => `{
      id: "${option.id}",
      name: "${String(option.name).replace(/"/g, '\\"')}",
      color: ${option.color},
      description: "${String(option.description || '').replace(/"/g, '\\"')}"
    }`),
    `{
      name: "CONTENT fix",
      color: RED,
      description: "Weekly AI-maintained course content fixes"
    }`,
  ].join(', ');

  const updateMutation = `
    mutation {
      updateProjectV2Field(input: { fieldId: "${statusField.id}", singleSelectOptions: [${updatedOptions}] }) {
        projectV2Field {
          ... on ProjectV2SingleSelectField {
            id
            options { id name color description }
          }
        }
      }
    }
  `;
  ghGraphQL(updateMutation);

  const refreshed = ghGraphQL(projectQuery, { owner, number: projectNumber });
  const refreshedProject = refreshed?.data?.user?.projectV2;
  const refreshedStatus = (refreshedProject.fields.nodes as Array<{ id: string; name: string; options: Array<{ id: string; name: string }> }>).find(
    (field) => field.name === 'Status'
  );
  const refreshedOption = refreshedStatus?.options.find((option) => option.name === 'CONTENT fix');
  const refreshedDoneOption = refreshedStatus?.options.find((option) => option.name === 'Done');
  if (!refreshedOption || !refreshedDoneOption) {
    throw new Error('Failed to create CONTENT fix status option on Project 12');
  }

  return {
    projectId: refreshedProject.id,
    statusFieldId: refreshedStatus!.id,
    statusOptionId: refreshedOption.id,
    doneOptionId: refreshedDoneOption.id,
  };
}

async function setProjectStatusForIssue(issueNumber: number, projectState: ProjectState, statusOptionId: string) {
  const owner = process.env.MVP_PROJECT_OWNER || 'moldovancsaba';
  const repo = process.env.MVP_REPO || 'mvp-factory-control';

  const issueQuery = `
    query($owner: String!, $repo: String!, $number: Int!) {
      repository(owner: $owner, name: $repo) {
        issue(number: $number) { id }
      }
    }
  `;
  const issueData = ghGraphQL(issueQuery, { owner, repo, number: issueNumber });
  const issueId = issueData?.data?.repository?.issue?.id;
  if (!issueId) {
    throw new Error(`Unable to resolve issue node id for #${issueNumber}`);
  }

  const addMutation = `
    mutation($projectId: ID!, $contentId: ID!) {
      addProjectV2ItemById(input: { projectId: $projectId, contentId: $contentId }) {
        item { id }
      }
    }
  `;
  const addResult = ghGraphQL(addMutation, {
    projectId: projectState.projectId,
    contentId: issueId,
  });
  const itemId = addResult?.data?.addProjectV2ItemById?.item?.id;
  if (!itemId) {
    throw new Error(`Unable to add issue #${issueNumber} to Project 12`);
  }

  const updateMutation = `
    mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $optionId: String!) {
      updateProjectV2ItemFieldValue(input: {
        projectId: $projectId,
        itemId: $itemId,
        fieldId: $fieldId,
        value: { singleSelectOptionId: $optionId }
      }) {
        projectV2Item { id }
      }
    }
  `;
  ghGraphQL(updateMutation, {
    projectId: projectState.projectId,
    itemId,
    fieldId: projectState.statusFieldId,
    optionId: statusOptionId,
  });

  return { itemId, statusOptionId };
}

function issueSearchResults(titleFragment: string) {
  const repo = process.env.MVP_REPO || 'mvp-factory-control';
  const owner = process.env.MVP_PROJECT_OWNER || 'moldovancsaba';
  const query = `repo:${owner}/${repo} in:title "${String(titleFragment).replace(/"/g, '\\"')}"`;
  const results = ghJson([
    'issue',
    'list',
    '--repo',
      `${owner}/${repo}`,
    '--state',
    'all',
    '--search',
    query,
    '--limit',
    '100',
    '--json',
    'number,title,state,url',
  ]) as Array<{ number: number; title: string; state: string; url: string }>;
  return results || [];
}

async function upsertIssue(params: {
  title: string;
  body: string;
  labels: string[];
  shouldBeOpen: boolean;
}): Promise<{ number: number; url: string; created: boolean }> {
  const repo = process.env.MVP_REPO || 'mvp-factory-control';
  const owner = process.env.MVP_PROJECT_OWNER || 'moldovancsaba';

  const matches = issueSearchResults(params.title).filter((issue) => issue.title === params.title);
  const existing = matches[0];

  const bodyFile = join(process.cwd(), 'docs', 'course-ai', 'content-fix', `${slugify(params.title)}.md`);
  mkdirSync(join(process.cwd(), 'docs', 'course-ai', 'content-fix'), { recursive: true });
  writeFileSync(bodyFile, `${params.body}\n`, 'utf8');

  const labelArgs = params.labels.flatMap((label) => ['--add-label', label]);

  if (existing) {
    runGh([
      'issue',
      'edit',
      String(existing.number),
      '--repo',
      `${owner}/${repo}`,
      '--body-file',
      bodyFile,
      ...labelArgs,
    ]);

    if (params.shouldBeOpen && existing.state === 'CLOSED') {
      runGh(['issue', 'reopen', String(existing.number), '--repo', `${owner}/${repo}`]);
    }
    if (!params.shouldBeOpen && existing.state === 'OPEN') {
      runGh(['issue', 'close', String(existing.number), '--repo', `${owner}/${repo}`]);
    }

    return { number: existing.number, url: existing.url, created: false };
  }

  const createArgs = [
    'issue',
    'create',
    '--repo',
    `${owner}/${repo}`,
    '--title',
    params.title,
    '--body-file',
    bodyFile,
  ];
  for (const label of params.labels) {
    createArgs.push('--label', label);
  }
  const url = getIssueUrlFromCreateOutput(runGh(createArgs));
  const number = Number(url.split('/').pop());

  return { number, url, created: true };
}

async function runAudit(): Promise<void> {
  const courseOverride = readArg('--course-id');
  const apply = hasFlag('--apply');
  const dryRun = hasFlag('--dry-run') ? true : !apply;
  const outDir = readArg('--out') || join(process.cwd(), 'docs', 'course-ai', 'content-fix');
  mkdirSync(outDir, { recursive: true });

  if (apply && hasFlag('--dry-run')) {
    throw new Error('Use either --apply or --dry-run, not both.');
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is required. Set it in .env.local or in the runner environment before running course:ai:content-fix.');
  }

  await connectDB();
  const courseSelection = await findOldestModifiedCourse(courseOverride);
  const course = courseSelection.selected;

  const lessonsRaw = await Lesson.find({ courseId: course._id })
    .where('isActive')
    .ne(false)
    .sort({ dayNumber: 1, displayOrder: 1, createdAt: 1, _id: 1 })
    .lean();
  const lessons = dedupeLessonsByDay(lessonsRaw);

  const questions = await QuizQuestion.find({
    courseId: course._id,
    isCourseSpecific: true,
    isActive: true,
  })
    .sort({ lessonId: 1, displayOrder: 1, createdAt: 1, _id: 1 })
    .lean();
  const lessonQuestionMap = new Map<string, any[]>();
  for (const question of questions) {
    const key = String(question.lessonId || '');
    const bucket = lessonQuestionMap.get(key) || [];
    bucket.push(question);
    lessonQuestionMap.set(key, bucket);
  }

  const bundle: AuditBundle = {
    course: {
      courseId: String(course.courseId),
      name: String(course.name || ''),
      language: String(course.language || 'en'),
      updatedAt: course.updatedAt ? new Date(course.updatedAt).toISOString() : undefined,
      isActive: course.isActive !== false,
      isDraft: course.isDraft === true,
      durationDays: Number(course.durationDays || 0),
      parentCourseId: course.parentCourseId ? String(course.parentCourseId) : null,
      selectedLessonIds: Array.isArray(course.selectedLessonIds) ? course.selectedLessonIds.map(String) : undefined,
      certification: course.certification || null,
    },
    selectionReason: courseOverride
      ? `Explicit course override`
      : `Oldest modified course selected from ${courseSelection.courseCount} course(s) with at least one lesson`,
    selectedAt: new Date().toISOString(),
    lessonCount: lessons.length,
    activeLessonCount: courseSelection.activeLessonCount,
    questionCount: questions.length,
    groups: [],
  };

  const groupInputs = buildGroupInputs({
    course,
    lessons,
    lessonQuestionMap,
    activeLessonCount: courseSelection.activeLessonCount,
    childSyncStatus:
      course.parentCourseId && Array.isArray(course.selectedLessonIds) && course.selectedLessonIds.length > 0
        ? await getChildSyncStatus(course)
        : null,
  });

  bundle.groups = groupInputs;

  let plan:
    | Awaited<ReturnType<typeof generateCourseContentFixPlan>>
    | {
        generatedAt: string;
        provider: ReturnType<typeof resolveLocalLLMProvider>;
        courseId: string;
        courseName: string;
        teacherPersona: string;
        executiveSummary: string;
        groups: Array<{
          key: AuditGroup['key'];
          label: string;
          priority: 'high' | 'medium' | 'low';
          summary: string;
          nextActions: string[];
          researchNotes: string[];
        }>;
      };

  if (groupInputs.length) {
    try {
      plan = await generateCourseContentFixPlan(
        {
          course: {
            courseId: bundle.course.courseId,
            name: bundle.course.name,
            language: bundle.course.language,
            updatedAt: bundle.course.updatedAt,
          },
          selectionReason: bundle.selectionReason,
          groups: groupInputs.map((group) => ({
            key: group.key,
            label: group.label,
            priority: group.priority,
            bullets: group.bullets,
          })),
        },
        resolveLocalLLMProvider()
      );
    } catch (error) {
      console.warn(`Local AI summary failed; using deterministic fallback: ${String((error as Error).message || error)}`);
      plan = {
        generatedAt: new Date().toISOString(),
        provider: resolveLocalLLMProvider(),
        courseId: bundle.course.courseId,
        courseName: bundle.course.name,
        teacherPersona: 'A rigorous professor-practitioner focused on practical course quality.',
        executiveSummary: 'Fallback summary generated because the local model was unavailable.',
        groups: groupInputs.map((group) => ({
          key: group.key,
          label: group.label,
          priority: group.priority,
          summary: group.bullets[0] || 'Review the listed findings and apply the smallest safe fix.',
          nextActions: ['Review the listed findings and apply the smallest safe fix.'],
          researchNotes: [],
        })),
      };
    }
  } else {
    plan = {
      generatedAt: new Date().toISOString(),
      provider: resolveLocalLLMProvider(),
      courseId: bundle.course.courseId,
      courseName: bundle.course.name,
      teacherPersona: 'A rigorous professor-practitioner focused on practical course quality.',
      executiveSummary: 'No content-fix issues were found for the selected course.',
      groups: [],
    };
  }

  const report = {
    generatedAt: new Date().toISOString(),
    mode: 'weekly-content-fix',
    apply,
    dryRun,
    selection: bundle.selectionReason,
    provider: plan.provider,
    course: bundle.course,
    lessonCount: bundle.lessonCount,
    activeLessonCount: bundle.activeLessonCount,
    questionCount: bundle.questionCount,
    teacherPersona: plan.teacherPersona,
    executiveSummary: plan.executiveSummary,
    groups: plan.groups,
    rawGroups: groupInputs,
  };

  const stamp = isoStamp();
  const reportPath = join(outDir, `content-fix-audit__${normalizeCourseId(bundle.course.courseId)}__${stamp}.json`);
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(`✅ Audit report written to ${reportPath}`);
  console.log(`   Course: ${bundle.course.courseId}`);
  console.log(`   Lessons: ${bundle.lessonCount}`);
  console.log(`   Questions: ${bundle.questionCount}`);
  console.log(`   Groups: ${groupInputs.length}`);
  console.log(`   Mode: ${dryRun ? 'dry-run preview' : 'apply'}`);

  const canonicalGroups: AuditGroup[] = [
    {
      key: 'lesson-content',
      label: 'lesson content refresh',
      priority: 'high',
      issueTitle: 'lesson content refresh',
      issueSlug: 'lesson-content-refresh',
      bullets: [],
    },
    {
      key: 'quiz-quality',
      label: 'quiz quality cleanup',
      priority: 'high',
      issueTitle: 'quiz quality cleanup',
      issueSlug: 'quiz-quality-cleanup',
      bullets: [],
    },
    {
      key: 'certification',
      label: 'certification and final-exam audit',
      priority: 'medium',
      issueTitle: 'certification and final-exam audit',
      issueSlug: 'certification-final-exam-audit',
      bullets: [],
    },
    {
      key: 'structure',
      label: 'structure and sync cleanup',
      priority: 'medium',
      issueTitle: 'structure and sync cleanup',
      issueSlug: 'structure-sync-cleanup',
      bullets: [],
    },
  ];
  const previewArtifacts: Array<{
    groupKey: AuditGroup['key'];
    title: string;
    markdownPath: string;
    jsonPath: string;
  }> = [];

  if (!groupInputs.length) {
    console.log('✅ No content-fix issues found. Nothing to create.');
    if (dryRun) {
      const previewManifest = {
        generatedAt: new Date().toISOString(),
        mode: 'weekly-content-fix',
        dryRun: true,
        course: bundle.course,
        selection: bundle.selectionReason,
        reportPath,
        teacherPersona: plan.teacherPersona,
        executiveSummary: plan.executiveSummary,
        groups: [],
        artifacts: [],
      };
      const manifestPath = previewManifestPath(outDir, bundle.course.courseId, stamp);
      writeFileSync(manifestPath, `${JSON.stringify(previewManifest, null, 2)}\n`, 'utf8');
      console.log(`✅ Preview manifest written to ${manifestPath}`);
    }
    if (apply) {
      const projectState = await ensureContentFixProjectState();
      for (const canonicalGroup of canonicalGroups) {
        const title = issueTitleForGroup(bundle.course.courseId, canonicalGroup);
        const matches = issueSearchResults(title).filter((issue) => issue.title === title);
        const existing = matches[0];
        if (!existing || existing.state !== 'OPEN') {
          continue;
        }

        const resolutionBody = [
          `# ${title}`,
          '',
          '## Resolution',
          'The latest weekly audit no longer found issues in this area, so the issue is being closed.',
          '',
          '## Course snapshot',
          `- Course: \`${bundle.course.courseId}\``,
          `- Selected because: ${bundle.selectionReason}`,
          `- Audit report: ${reportPath}`,
          '',
          '## Automation note',
          'This issue is closed by the weekly course-content-fix autopilot.',
        ].join('\n');

        const bodyFile = join(process.cwd(), 'docs', 'course-ai', 'content-fix', `${slugify(title)}.md`);
        writeFileSync(bodyFile, `${resolutionBody}\n`, 'utf8');
        runGh(['issue', 'edit', String(existing.number), '--repo', `${process.env.MVP_PROJECT_OWNER || 'moldovancsaba'}/${process.env.MVP_REPO || 'mvp-factory-control'}`, '--body-file', bodyFile]);
        runGh(['issue', 'close', String(existing.number), '--repo', `${process.env.MVP_PROJECT_OWNER || 'moldovancsaba'}/${process.env.MVP_REPO || 'mvp-factory-control'}`]);
        await setProjectStatusForIssue(existing.number, projectState, projectState.doneOptionId);
        console.log(`- Closed resolved issue #${existing.number} ${title}`);
      }
    }
    return;
  }

  if (dryRun) {
    for (const group of groupInputs) {
      const planGroup =
        plan.groups.find((item) => item.key === group.key) ||
        ({
          summary: group.bullets[0] || 'Review the listed findings and apply the smallest safe fix.',
          nextActions: ['Review the listed findings and apply the smallest safe fix.'],
          researchNotes: [],
        } satisfies { summary: string; nextActions: string[]; researchNotes: string[] });
      const preview = writePreviewArtifact({
        outDir,
        stamp,
        reportPath,
        bundle,
        group,
        planGroup,
        teacherPersona: plan.teacherPersona,
      });
      previewArtifacts.push({
        groupKey: group.key,
        title: issueTitleForGroup(bundle.course.courseId, group),
        markdownPath: preview.markdownPath,
        jsonPath: preview.jsonPath,
      });
    }

    const previewManifest = {
      generatedAt: new Date().toISOString(),
      mode: 'weekly-content-fix',
      dryRun: true,
      course: bundle.course,
      selection: bundle.selectionReason,
      reportPath,
      teacherPersona: plan.teacherPersona,
      executiveSummary: plan.executiveSummary,
      groups: plan.groups,
      artifacts: previewArtifacts,
    };
    const manifestPath = previewManifestPath(outDir, bundle.course.courseId, stamp);
    writeFileSync(manifestPath, `${JSON.stringify(previewManifest, null, 2)}\n`, 'utf8');
    console.log('\nDry run preview written:');
    console.log(`- ${manifestPath}`);
    for (const artifact of previewArtifacts) {
      console.log(`- ${artifact.title}`);
      console.log(`  - ${artifact.markdownPath}`);
      console.log(`  - ${artifact.jsonPath}`);
    }
    return;
  }

  const projectState = await ensureContentFixProjectState();
  const groupByKey = new Map(groupInputs.map((group) => [group.key, group] as const));
  const createdIssues: Array<{ group: AuditGroup; issueNumber: number; issueUrl: string; created: boolean }> = [];

  for (const canonicalGroup of canonicalGroups) {
    const group = groupByKey.get(canonicalGroup.key);
    const title = issueTitleForGroup(bundle.course.courseId, canonicalGroup);
    const matches = issueSearchResults(title).filter((issue) => issue.title === title);
    const existing = matches[0];

    if (!group) {
      if (existing && existing.state === 'OPEN') {
        const resolutionBody = [
          `# ${title}`,
          '',
          '## Resolution',
          'The latest weekly audit no longer found issues in this area, so the issue is being closed.',
          '',
          '## Course snapshot',
          `- Course: \`${bundle.course.courseId}\``,
          `- Selected because: ${bundle.selectionReason}`,
          `- Audit report: ${reportPath}`,
          '',
          '## Automation note',
          'This issue is closed by the weekly course-content-fix autopilot.',
        ].join('\n');
        const bodyFile = join(process.cwd(), 'docs', 'course-ai', 'content-fix', `${slugify(title)}.md`);
        writeFileSync(bodyFile, `${resolutionBody}\n`, 'utf8');
        runGh(['issue', 'edit', String(existing.number), '--repo', `${process.env.MVP_PROJECT_OWNER || 'moldovancsaba'}/${process.env.MVP_REPO || 'mvp-factory-control'}`, '--body-file', bodyFile]);
        runGh(['issue', 'close', String(existing.number), '--repo', `${process.env.MVP_PROJECT_OWNER || 'moldovancsaba'}/${process.env.MVP_REPO || 'mvp-factory-control'}`]);
        await setProjectStatusForIssue(existing.number, projectState, projectState.doneOptionId);
        console.log(`- Closed resolved issue #${existing.number} ${title}`);
      }
      continue;
    }

    const planGroup =
      plan.groups.find((item) => item.key === group.key) ||
      ({
        summary: group.bullets[0] || 'Review the listed findings and apply the smallest safe fix.',
        nextActions: ['Review the listed findings and apply the smallest safe fix.'],
        researchNotes: [],
      } satisfies { summary: string; nextActions: string[]; researchNotes: string[] });

    const body = bodyForGroup(bundle, group, planGroup, plan.teacherPersona);
    const labels = ['product:amanoba', 'type:bug', 'quality', issuePriorityLabel(group.priority)];
    const issue = await upsertIssue({
      title,
      body,
      labels,
      shouldBeOpen: true,
    });
    await setProjectStatusForIssue(issue.number, projectState, projectState.statusOptionId);
    createdIssues.push({ group, issueNumber: issue.number, issueUrl: issue.url, created: issue.created });
  }

  console.log('\n✅ Content-fix issues synced to GitHub:');
  for (const item of createdIssues) {
    console.log(`- #${item.issueNumber} ${issueTitleForGroup(bundle.course.courseId, item.group)}${item.created ? ' (created)' : ' (updated)'}`);
  }
}

async function main() {
  const mode = resolveMode();
  try {
    if (mode === 'audit') {
      await runAudit();
      return;
    }
  } finally {
    await mongoose.disconnect().catch(() => undefined);
  }
}

main().catch((error) => {
  console.error('Course content-fix autopilot failed:', error);
  process.exit(1);
});
