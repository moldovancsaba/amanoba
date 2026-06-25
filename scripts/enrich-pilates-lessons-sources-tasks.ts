/**
 * Enrich Pilates lesson content with visible student tasks and source sections.
 *
 * Why: Professional courses need clear learner work plus useful external references.
 * This script is idempotent: it removes previously generated enrichment blocks before appending fresh ones.
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import mongoose from 'mongoose';

config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

import connectDB from '../app/lib/mongodb';
import { Course, Lesson } from '../app/lib/models';

type Source = {
  title: string;
  url: string;
  note: string;
  citation: string;
};

const COURSE_IDS = [
  'PROFESSIONAL_PILATES_TRAINER_2026_EN',
  'MASTERCLASS_PILATES_TRAINER_2026_EN',
];

const SOURCES = {
  pmaScope: {
    title: 'Pilates Method Alliance: Professional Guidelines and Scope of Practice',
    url: 'https://www.pilatesmethodalliance.org/pma-professional-guidelines',
    note: 'Use this to check professional boundaries, referral behavior, and ethical teaching language.',
    citation: 'Pilates Method Alliance. Professional Guidelines / Scope of Practice.',
  },
  pmaScopePdf: {
    title: 'National Pilates Certification Program: PMA Scope of Practice PDF',
    url: 'https://nationalpilatescertificationprogram.org/common/Uploaded%20files/PMA/About/Guidelines/PMA%20ScopeofPractice%2020190423%20V1.0.pdf',
    note: 'Useful for trainer boundaries: program design, recognizing safety limits, and referring to medical care when needed.',
    citation: 'National Pilates Certification Program. PMA Scope of Practice. 2019.',
  },
  acsmScreening: {
    title: 'ACSM Preparticipation Health Screening Guidelines',
    url: 'https://www.exerciseismedicine.org/assets/page_documents/ACSM%20Preparticipation%20Screening%20Guidelines.pdf',
    note: 'Use this when building intake questions, red-flag logic, and referral/clearance decisions.',
    citation: 'Riebe D, Franklin BA, Thompson PD, et al. Updating ACSM recommendations for exercise preparticipation health screening. Med Sci Sports Exerc. 2015.',
  },
  acsmActivity: {
    title: 'ACSM Physical Activity Guidelines',
    url: 'https://acsm.org/education-resources/trending-topics-resources/physical-activity-guidelines/',
    note: 'Use this as a baseline for adult strength, mobility, and general physical activity recommendations.',
    citation: 'American College of Sports Medicine. Physical Activity Guidelines.',
  },
  acsmResistance: {
    title: 'ACSM Resistance Training Position Stand update',
    url: 'https://pubmed.ncbi.nlm.nih.gov/41843416/',
    note: 'Use this to connect Pilates progression with evidence-informed resistance-training variables.',
    citation: 'American College of Sports Medicine. Resistance Training Position Stand update. PubMed record 41843416.',
  },
  pilatesCore: {
    title: 'Pilates and core muscle activation review',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10218154/',
    note: 'Use this for evidence-informed discussion of Pilates, core activation, and chronic low-back-pain populations.',
    citation: 'Pilates to Improve Core Muscle Activation in Chronic Low Back Pain. PMC10218154.',
  },
  coreStability: {
    title: 'Core stability exercise systematic review',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9340836/',
    note: 'Use this to compare Pilates-style trunk control with broader core-stability evidence.',
    citation: 'Systematic review of core stability exercises for nonspecific low back pain. PMC9340836.',
  },
  pilatesBackPain: {
    title: 'Pilates-based exercise and low back pain overview',
    url: 'https://pubmed.ncbi.nlm.nih.gov/35856344/',
    note: 'Use this when teaching back-pain cautions, expected benefits, and limits of trainer scope.',
    citation: 'Pilates-based exercise in the reduction of low back pain. PubMed record 35856344.',
  },
  acogPregnancy: {
    title: 'ACOG: Physical Activity and Exercise During Pregnancy and the Postpartum Period',
    url: 'https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2020/04/physical-activity-and-exercise-during-pregnancy-and-the-postpartum-period',
    note: 'Use this for pregnancy/postpartum modifications, warning signs, and medical-clearance thinking.',
    citation: 'ACOG Committee Opinion No. 804. Physical Activity and Exercise During Pregnancy and the Postpartum Period. 2020.',
  },
  acogPubMed: {
    title: 'ACOG Committee Opinion 804 PubMed record',
    url: 'https://pubmed.ncbi.nlm.nih.gov/32217980/',
    note: 'Use this as a quick bibliographic reference for pregnancy and postpartum exercise guidance.',
    citation: 'Physical Activity and Exercise During Pregnancy and the Postpartum Period. PubMed record 32217980.',
  },
  olderAdults: {
    title: 'ACSM: Exercise and Physical Activity for Older Adults',
    url: 'https://www.bewegenismedicijn.nl/files/downloads/acsm_position_stand_exercise_and_physical_activity_for_older_adults.pdf',
    note: 'Use this for older-adult programming, balance, strength, and functional independence considerations.',
    citation: 'ACSM Position Stand. Exercise and Physical Activity for Older Adults.',
  },
  nscaBook: {
    title: 'NSCA Essentials of Personal Training',
    url: 'https://books.google.com/books/about/NSCA_s_Essentials_of_Personal_Training.html?id=lMwizgEACAAJ',
    note: 'Use this as a professional reference for safe, goal-specific training program design.',
    citation: 'National Strength and Conditioning Association. NSCA Essentials of Personal Training.',
  },
  nasmCircle: {
    title: 'NASM: Personal trainer role within a circle of care',
    url: 'https://blog.nasm.org/personal-trainer-role-circle-of-care',
    note: 'Use this for referral networks, boundaries, and working alongside healthcare professionals.',
    citation: 'National Academy of Sports Medicine. CPT role within a circle of care.',
  },
} satisfies Record<string, Source>;

function includesAny(text: string, needles: string[]) {
  return needles.some((needle) => text.includes(needle));
}

function topicForLesson(title: string, content: string) {
  const text = `${title} ${content}`.toLowerCase();
  if (includesAny(text, ['scope', 'ethic', 'professional standard', 'method', 'principle'])) return 'scope';
  if (includesAny(text, ['history', 'method logic', 'evidence'])) return 'method';
  if (includesAny(text, ['anatomy', 'spine', 'pelvis', 'rib cage', 'shoulder', 'hip', 'foot'])) return 'anatomy';
  if (includesAny(text, ['breath', 'diaphragm', 'pressure', 'powerhouse', 'core'])) return 'breath';
  if (includesAny(text, ['screen', 'intake', 'red flag', 'baseline'])) return 'screening';
  if (includesAny(text, ['posture', 'alignment', 'dynamic control'])) return 'alignment';
  if (includesAny(text, ['motor learning', 'cue', 'feedback', 'demonstration'])) return 'cueing';
  if (includesAny(text, ['mat', 'pre-pilates', 'hundred', 'roll-up', 'spine stretch'])) return 'mat';
  if (includesAny(text, ['reformer', 'spring', 'carriage', 'footbar', 'straps'])) return 'reformer';
  if (includesAny(text, ['cadillac', 'push-through', 'roll-down bar'])) return 'cadillac';
  if (includesAny(text, ['chair', 'wunda', 'pedal'])) return 'chair';
  if (includesAny(text, ['barrel', 'spine corrector', 'arc'])) return 'barrel';
  if (includesAny(text, ['prop', 'small equipment', 'home adaptation', 'remote'])) return 'props';
  if (includesAny(text, ['older adult', 'desk worker', 'beginner', 'special population'])) return 'special-populations';
  if (includesAny(text, ['hypermobility', 'osteoporosis', 'back pain', 'referral', 'contraindication'])) return 'risk';
  if (includesAny(text, ['pregnancy', 'postpartum', 'pelvic floor'])) return 'pregnancy';
  if (includesAny(text, ['adaptation', 'load', 'recovery', 'progression'])) return 'programming';
  if (includesAny(text, ['private session', 'client journey', 'progress notes', 'outcome tracking', 'assessment'])) return 'assessment';
  if (includesAny(text, ['group class', 'level management', 'mixed levels', 'room management'])) return 'group';
  if (includesAny(text, ['hands-on', 'consent', 'tactile', 'communication'])) return 'consent';
  if (includesAny(text, ['practicum', 'observation', 'correction'])) return 'practicum';
  if (includesAny(text, ['business', 'trial class', 'pricing', 'offer', 'professional launch'])) return 'business';
  if (includesAny(text, ['online', 'hybrid', 'camera', 'asynchronous'])) return 'online';
  if (includesAny(text, ['exam readiness', 'certification', 'capstone', 'complete pilates session'])) return 'exam';
  return 'general';
}

function sourcesForTopic(topic: string): Source[] {
  const shared = [SOURCES.pmaScope, SOURCES.acsmScreening, SOURCES.acsmActivity];
  const map: Record<string, Source[]> = {
    scope: [SOURCES.pmaScope, SOURCES.pmaScopePdf, SOURCES.nasmCircle],
    method: [SOURCES.pmaScope, SOURCES.pilatesCore, SOURCES.acsmResistance],
    anatomy: [SOURCES.pilatesCore, SOURCES.coreStability, SOURCES.nscaBook],
    breath: [SOURCES.pilatesCore, SOURCES.coreStability, SOURCES.acsmScreening],
    screening: [SOURCES.acsmScreening, SOURCES.pmaScopePdf, SOURCES.nasmCircle],
    alignment: [SOURCES.pilatesCore, SOURCES.coreStability, SOURCES.nscaBook],
    cueing: [SOURCES.nscaBook, SOURCES.pmaScope, SOURCES.pilatesCore],
    mat: [SOURCES.pilatesCore, SOURCES.coreStability, SOURCES.acsmResistance],
    reformer: [SOURCES.pmaScope, SOURCES.acsmResistance, SOURCES.nscaBook],
    cadillac: [SOURCES.pmaScope, SOURCES.acsmResistance, SOURCES.nscaBook],
    chair: [SOURCES.pmaScope, SOURCES.acsmResistance, SOURCES.nscaBook],
    barrel: [SOURCES.pilatesCore, SOURCES.coreStability, SOURCES.pilatesBackPain],
    props: [SOURCES.pmaScope, SOURCES.acsmActivity, SOURCES.nscaBook],
    'special-populations': [SOURCES.olderAdults, SOURCES.acsmScreening, SOURCES.pmaScopePdf],
    risk: [SOURCES.pilatesBackPain, SOURCES.coreStability, SOURCES.acsmScreening],
    pregnancy: [SOURCES.acogPregnancy, SOURCES.acogPubMed, SOURCES.pmaScopePdf],
    programming: [SOURCES.acsmResistance, SOURCES.acsmActivity, SOURCES.nscaBook],
    assessment: [SOURCES.acsmScreening, SOURCES.nscaBook, SOURCES.pmaScopePdf],
    group: [SOURCES.nscaBook, SOURCES.acsmActivity, SOURCES.pmaScope],
    consent: [SOURCES.pmaScope, SOURCES.pmaScopePdf, SOURCES.nasmCircle],
    practicum: [SOURCES.pmaScope, SOURCES.nscaBook, SOURCES.pilatesCore],
    business: [SOURCES.pmaScope, SOURCES.nasmCircle, SOURCES.nscaBook],
    online: [SOURCES.pmaScope, SOURCES.acsmScreening, SOURCES.nscaBook],
    exam: [SOURCES.pmaScope, SOURCES.acsmScreening, SOURCES.acsmResistance],
    general: shared,
  };
  return map[topic] || shared;
}

function taskForTopic(topic: string) {
  const map: Record<string, string[]> = {
    scope: [
      'Write a one-paragraph teaching philosophy that states who you serve, what experience you want clients to have, and three professional boundaries you will not cross.',
      'Create a referral list with at least three local or online professional categories: physician, physical therapist, pelvic-health specialist, mental-health professional, or dietitian.',
      'Rewrite two alarming posture/pain phrases into neutral coaching language.',
    ],
    method: [
      'Map six Pilates principles to observable coaching behaviors you can see, hear, or measure in a session.',
      'Choose one classical exercise and write one modern evidence-informed modification for a beginner.',
      'Record a two-minute explanation of why control and precision matter more than repetition count alone.',
    ],
    anatomy: [
      'Build a one-page anatomy cue sheet for spine, pelvis, ribs, shoulders, hips, knees, and feet.',
      'Observe one simple movement and write three possible compensation chains without diagnosing pathology.',
      'Create one regression and one progression that preserve the same anatomical goal.',
    ],
    breath: [
      'Teach lateral rib breathing out loud for two minutes and write the exact words you used.',
      'Build a 10-minute breath-to-core warm-up with one regression for breath-holding or bearing down.',
      'Write three warning signs that would make you stop, regress, or refer out.',
    ],
    screening: [
      'Create a five-question intake form covering goals, exercise history, current symptoms, medical clearance, and preferred learning style.',
      'Write a 10-minute beginner warm-up that checks breath, pelvis awareness, shoulder organization, and comfort.',
      'Define three red flags that require referral or medical clearance before progression.',
    ],
    alignment: [
      'Choose one static posture observation and one dynamic movement observation; explain what each can and cannot tell you.',
      'Write a neutral-versus-imprint decision rule for beginner abdominal work.',
      'Create one cue that improves alignment without shaming the client.',
    ],
    cueing: [
      'Write one anatomical cue, one sensory cue, and one external-focus cue for the same exercise.',
      'Teach a movement using only one cue at a time and document which cue changed the client response best.',
      'Create a feedback plan: when to correct immediately, when to wait, and when to regress.',
    ],
    mat: [
      'Build a 30-minute mat class with three levels for each exercise: foundation, working level, and challenge.',
      'Add one contraindication or caution for each class block.',
      'Write the success criteria for progressing a beginner from prep work into a full exercise.',
    ],
    reformer: [
      'Write a 45-minute beginner reformer plan with setup notes for footbar, headrest, straps, and spring choices.',
      'For three exercises, explain how changing spring load changes the teaching goal.',
      'Create one safety checklist for carriage control and transitions.',
    ],
    cadillac: [
      'Create a short Cadillac sequence using one supported mobility exercise, one arm-spring exercise, and one leg-spring exercise.',
      'Write setup checks for bar path, spring direction, range limit, and client comfort.',
      'Define when assisted range should be reduced or stopped.',
    ],
    chair: [
      'Design a chair mini-sequence that trains pedal control, trunk organization, and balance confidence.',
      'Write two spring-setting options and explain who each option serves.',
      'Create one regression for a client who cannot control the pedal return.',
    ],
    barrel: [
      'Create a barrel or spine-corrector sequence with one extension, one lateral-flexion, and one supported abdominal option.',
      'Write the comfort and control criteria for stopping or reducing range.',
      'Add one alternative for a client who does not tolerate extension.',
    ],
    props: [
      'Turn one apparatus goal into a home version using a band, ball, wall, towel, or block.',
      'Explain what feedback the prop gives and what mistake it helps prevent.',
      'Write one safety note for remote or home practice.',
    ],
    'special-populations': [
      'Create a beginner-friendly plan for an older adult or desk worker with support options and clear exit choices.',
      'Write two balance progressions and two regressions that preserve confidence.',
      'Document what you would monitor before increasing challenge.',
    ],
    risk: [
      'Build a risk-aware programming note for hypermobility, osteoporosis, or back pain without diagnosing or treating.',
      'Write three referral triggers and three safe regression options.',
      'Create a symptom-monitoring script you can use before, during, and after class.',
    ],
    pregnancy: [
      'Create a pregnancy/postpartum screening checklist that includes medical guidance, pressure symptoms, fatigue, positioning, and warning signs.',
      'Write two core exercise regressions for pressure management.',
      'Identify when you would refer to a pelvic-health or medical professional.',
    ],
    programming: [
      'Write a four-week progression plan that changes only one variable at a time: range, resistance, tempo, volume, complexity, or balance demand.',
      'Define the success threshold for progression and the signs that require recovery or regression.',
      'Record how you will track load, symptoms, confidence, and performance.',
    ],
    assessment: [
      'Create a private-session note template with baseline, session focus, client response, homework, and next step.',
      'Choose three outcome measures that fit the client goal without pretending to diagnose.',
      'Write a follow-up question that checks transfer into daily life.',
    ],
    group: [
      'Build a group-class theme with a base version, one regression, and one progression for each main exercise.',
      'Write the room-management cues for transitions, equipment spacing, and mixed levels.',
      'Define what successful learning looks like for beginners and advanced clients in the same class.',
    ],
    consent: [
      'Write a consent script for tactile cueing that includes purpose, permission, a no-touch alternative, and a check-in.',
      'Create two non-touch alternatives for a common hands-on assist.',
      'Document how you will respect refusal without making the client explain themselves.',
    ],
    practicum: [
      'Teach a five-minute sequence and ask a peer to score demonstration clarity, observation, correction timing, and client comfort.',
      'Write one correction that is specific, brief, and tied to the exercise goal.',
      'Document whether the correction improved the next movement attempt.',
    ],
    business: [
      'Design a trial class that shows safety, teaching clarity, client-specific value, and a realistic next step.',
      'Write your cancellation, late-arrival, scope, and communication policies in plain language.',
      'Create one ethical package offer without guaranteed medical or transformation claims.',
    ],
    online: [
      'Create an online-session setup checklist for camera angle, space, props, emergency contact, and exercise selection.',
      'Rewrite one studio exercise so it can be safely observed on camera.',
      'Write a conservative progression rule for remote clients.',
    ],
    exam: [
      'Build a complete session plan from intake to warm-up, main sequence, regressions, cueing priorities, and closing homework.',
      'Create a certification-readiness checklist for theory, safety, apparatus setup, documentation, and scope boundaries.',
      'Record a five-minute teaching sample and evaluate it against your checklist.',
    ],
    general: [
      'Write the lesson concept in your own words in five sentences.',
      'Build one regression, one working version, and one progression connected to the same client goal.',
      'Document how you will know the student or client response was successful.',
    ],
  };
  return map[topic] || map.general;
}

function stripGeneratedSections(content: string) {
  const marker =
    /^##\s+(Practice assignment|Action lab|Field assignment|Student tasks|Useful external sources|Bibliography|Read more|Masterclass standard)\b/im;
  const match = marker.exec(content);
  if (!match || typeof match.index !== 'number') return content.trim();
  return content.slice(0, match.index).trim();
}

function buildStudentTasks(tasks: string[]) {
  return ['## Student tasks', ...tasks.map((task, index) => `${index + 1}. ${task}`)].join('\n');
}

function buildSourcesBlock(sources: Source[]) {
  return [
    '## Useful external sources',
    ...sources.map((source) => `- [${source.title}](${source.url}) - ${source.note}`),
  ].join('\n');
}

function buildBibliographyBlock(sources: Source[]) {
  return [
    '## Bibliography',
    ...sources.map((source) => `- ${source.citation} Available at: ${source.url}`),
  ].join('\n');
}

function buildMasterclassStandard(topic: string) {
  const topicLabel = topic.replace(/-/g, ' ');
  return [
    '## Masterclass standard',
    `By the end of this lesson, you should be able to teach the ${topicLabel} topic safely, explain the training reason behind your choices, adapt the work for a real person, and identify when the decision belongs outside Pilates trainer scope.`,
  ].join('\n');
}

function enrichContent(params: {
  courseId: string;
  title: string;
  content: string;
}) {
  const base = stripGeneratedSections(params.content || '');
  const topic = topicForLesson(params.title, params.content);
  const sources = sourcesForTopic(topic);
  const tasks = taskForTopic(topic);
  const sections = [
    base,
    buildStudentTasks(tasks),
    buildSourcesBlock(sources),
    buildBibliographyBlock(sources),
  ];
  if (params.courseId.includes('MASTERCLASS')) {
    sections.push(buildMasterclassStandard(topic));
  }
  return sections.filter(Boolean).join('\n\n').trim() + '\n';
}

async function main() {
  const apply = process.argv.includes('--apply');
  await connectDB();

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = join(process.cwd(), 'docs', 'course-ai', 'pilates-lesson-enrichment', stamp);
  mkdirSync(backupDir, { recursive: true });

  let changed = 0;
  for (const courseId of COURSE_IDS) {
    const course = await Course.findOne({ courseId });
    if (!course) {
      console.log(`Course not found: ${courseId}`);
      continue;
    }

    const lessons = await Lesson.find({ courseId: course._id, isActive: true }).sort({ dayNumber: 1, displayOrder: 1 });
    const backupPath = join(backupDir, `${courseId}.json`);
    writeFileSync(
      backupPath,
      JSON.stringify(
        {
          courseId,
          backedUpAt: new Date().toISOString(),
          lessons: lessons.map((lesson) => ({
            lessonId: lesson.lessonId,
            dayNumber: lesson.dayNumber,
            title: lesson.title,
            content: lesson.content,
            emailBody: lesson.emailBody,
          })),
        },
        null,
        2
      ) + '\n',
      'utf8'
    );

    for (const lesson of lessons) {
      const nextContent = enrichContent({
        courseId,
        title: String(lesson.title || ''),
        content: String(lesson.content || ''),
      });
      if (nextContent === String(lesson.content || '')) continue;
      changed++;
      if (apply) {
        lesson.content = nextContent;
        lesson.emailBody = nextContent;
        lesson.markModified('content');
        lesson.markModified('emailBody');
        await lesson.save();
      }
      console.log(`${apply ? 'Updated' : 'Would update'} ${courseId} day ${lesson.dayNumber}: ${lesson.title}`);
    }
  }

  console.log(`${apply ? 'Updated' : 'Previewed'} ${changed} lesson(s). Backup: ${backupDir}`);
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  mongoose.disconnect().catch(() => undefined);
  process.exit(1);
});
