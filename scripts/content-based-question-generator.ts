/**
 * Content-Based Question Generator
 * 
 * Purpose: Generate questions by analyzing actual lesson content
 * This avoids generic templates and creates context-rich, content-specific questions
 */

import { QuestionDifficulty, QuizQuestionType } from '../app/lib/models';

export interface ContentBasedQuestion {
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: QuestionDifficulty;
  category: string;
  questionType: QuizQuestionType;
  hashtags: string[];
}

/**
 * Extract key concepts from lesson content
 */
function extractKeyConcepts(content: string, title: string): {
  mainTopics: string[];
  keyTerms: string[];
  examples: string[];
  practices: string[];
  concepts: string[];
} {
  // Remove HTML tags
  const cleanContent = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const contentLower = cleanContent.toLowerCase();
  const titleClean = title.replace(/<[^>]+>/g, '').trim();
  
  // Extract headings (h2, h3)
  const h2Matches = content.match(/<h2[^>]*>(.*?)<\/h2>/gi) || [];
  const h3Matches = content.match(/<h3[^>]*>(.*?)<\/h3>/gi) || [];
  
  const mainTopics: string[] = [];
  h2Matches.forEach(match => {
    const text = match.replace(/<[^>]+>/g, '').trim();
    if (text && text.length < 100 && text.length > 5) {
      mainTopics.push(text);
    }
  });
  h3Matches.forEach(match => {
    const text = match.replace(/<[^>]+>/g, '').trim();
    if (text && text.length < 100 && text.length > 5 && !mainTopics.includes(text)) {
      mainTopics.push(text);
    }
  });
  
  // If no headings found, use title as main topic
  if (mainTopics.length === 0 && titleClean) {
    mainTopics.push(titleClean);
  }
  
  // Extract words from title as key terms if content is sparse
  const titleWords = titleClean.split(/[\s,;:–—\-]+/).filter(w => w.length > 3 && w.length < 30);
  
  // Extract key terms (bold, strong, or emphasized text)
  const keyTerms: string[] = [];
  const boldMatches = content.match(/<(strong|b|em)[^>]*>(.*?)<\/(strong|b|em)>/gi) || [];
  boldMatches.forEach(match => {
    const text = match.replace(/<[^>]+>/g, '').trim();
    // Filter out invalid terms: too short (< 4 chars), fragments, or common word fragments
    const commonFragments = ['mestere', 'ra', 're', 'ban', 'ben', 'bol', 'ből', 'val', 'vel', 'the', 'a', 'an', 'az', 'egy'];
    if (text && text.length >= 4 && text.length < 50 && !commonFragments.includes(text.toLowerCase())) {
      // Check if it's a meaningful word (has at least one vowel or is a known term)
      const hasVowel = /[aeiouáéíóúöüőűаеиоуыэюя]/i.test(text);
      if (hasVowel || text.length > 6) {
        keyTerms.push(text);
      }
    }
  });
  
  // If sparse, add title words as key terms (but filter out fragments)
  if (keyTerms.length < 5 && titleWords.length > 0) {
    const commonFragments = ['mestere', 'ra', 're', 'ban', 'ben', 'bol', 'ből', 'val', 'vel', 'the', 'a', 'an', 'az', 'egy', 'és', 'and', 'или', 've', 'и'];
    titleWords.slice(0, 10).forEach(word => {
      const wordLower = word.toLowerCase();
      if (word.length >= 4 && !commonFragments.includes(wordLower) && !keyTerms.includes(word)) {
        keyTerms.push(word);
      }
    });
  }
  
  // Extract key phrases from content (sentences with important words)
  if (keyTerms.length < 5 && cleanContent.length > 50) {
    const sentences = cleanContent.split(/[.!?]\s+/).filter(s => s.length > 20 && s.length < 150);
    sentences.slice(0, 5).forEach(sentence => {
      const words = sentence.split(/\s+/).filter(w => w.length > 4 && w.length < 20);
      if (words.length > 0) {
        const phrase = words.slice(0, 3).join(' ');
        if (phrase.length > 5 && phrase.length < 40 && !keyTerms.includes(phrase)) {
          keyTerms.push(phrase);
        }
      }
    });
  }
  
  // Extract examples (✅/❌ sections, code blocks, or specific patterns)
  const examples: string[] = [];
  const examplePatterns = [
    /✅[^❌]*?([^❌]{20,200})/gi,
    /<code[^>]*>(.*?)<\/code>/gi,
    /példa[:\s]+([^\.]{20,200})/gi, // Hungarian
    /example[:\s]+([^\.]{20,200})/gi, // English
    /пример[:\s]+([^\.]{20,200})/gi, // Russian
    /örnek[:\s]+([^\.]{20,200})/gi, // Turkish
    /пример[:\s]+([^\.]{20,200})/gi, // Bulgarian
    /przykład[:\s]+([^\.]{20,200})/gi, // Polish
    /ví dụ[:\s]+([^\.]{20,200})/gi, // Vietnamese
    /contoh[:\s]+([^\.]{20,200})/gi, // Indonesian
    /exemplo[:\s]+([^\.]{20,200})/gi, // Portuguese
    /उदाहरण[:\s]+([^\.]{20,200})/gi // Hindi
  ];
  
  examplePatterns.forEach(pattern => {
    const matches = content.match(pattern) || [];
    matches.forEach(match => {
      const text = match.replace(/<[^>]+>/g, '').trim();
      if (text.length > 20 && text.length < 300) {
        examples.push(text);
      }
    });
  });
  
  // Extract practices/exercises
  const practices: string[] = [];
  const practicePatterns = [
    /gyakorlat[:\s]+([^\.]{20,200})/gi, // Hungarian
    /practice[:\s]+([^\.]{20,200})/gi, // English
    /exercise[:\s]+([^\.]{20,200})/gi, // English
    /практика[:\s]+([^\.]{20,200})/gi, // Russian
    /uygulama[:\s]+([^\.]{20,200})/gi, // Turkish
    /практика[:\s]+([^\.]{20,200})/gi, // Bulgarian
    /praktyka[:\s]+([^\.]{20,200})/gi, // Polish
    /thực hành[:\s]+([^\.]{20,200})/gi, // Vietnamese
    /latihan[:\s]+([^\.]{20,200})/gi, // Indonesian
    /prática[:\s]+([^\.]{20,200})/gi, // Portuguese
    /अभ्यास[:\s]+([^\.]{20,200})/gi, // Hindi
    /<ol[^>]*>(.*?)<\/ol>/gi
  ];
  
  practicePatterns.forEach(pattern => {
    const matches = content.match(pattern) || [];
    matches.forEach(match => {
      const text = match.replace(/<[^>]+>/g, '').trim();
      if (text.length > 20 && text.length < 500) {
        practices.push(text);
      }
    });
  });
  
  // Extract important concepts (sentences with key indicators)
  const concepts: string[] = [];
  const conceptIndicators = [
    /fontos[:\s]+([^\.]{20,200})/gi, // Hungarian
    /important[:\s]+([^\.]{20,200})/gi, // English
    /kritikus[:\s]+([^\.]{20,200})/gi, // Hungarian
    /critical[:\s]+([^\.]{20,200})/gi, // English
    /важно[:\s]+([^\.]{20,200})/gi, // Russian
    /критично[:\s]+([^\.]{20,200})/gi, // Russian
    /önemli[:\s]+([^\.]{20,200})/gi, // Turkish
    /важно[:\s]+([^\.]{20,200})/gi, // Bulgarian
    /ważne[:\s]+([^\.]{20,200})/gi, // Polish
    /quan trọng[:\s]+([^\.]{20,200})/gi, // Vietnamese
    /penting[:\s]+([^\.]{20,200})/gi, // Indonesian
    /importante[:\s]+([^\.]{20,200})/gi, // Portuguese
    /महत्वपूर्ण[:\s]+([^\.]{20,200})/gi // Hindi
  ];
  
  conceptIndicators.forEach(pattern => {
    const matches = content.match(pattern) || [];
    matches.forEach(match => {
      const text = match.replace(/<[^>]+>/g, '').trim();
      if (text.length > 20 && text.length < 200) {
        concepts.push(text);
      }
    });
  });
  
  // If still sparse, use content sentences as concepts
  if (concepts.length < 3 && cleanContent.length > 100) {
    const sentences = cleanContent.split(/[.!?]\s+/).filter(s => s.length > 30 && s.length < 200);
    sentences.slice(0, 3).forEach(sentence => {
      if (!concepts.includes(sentence)) {
        concepts.push(sentence);
      }
    });
  }
  
  // Ensure we always have at least the title as a concept
  if (concepts.length === 0 && titleClean) {
    concepts.push(titleClean);
  }
  
  return {
    mainTopics: mainTopics.slice(0, 5),
    keyTerms: Array.from(new Set(keyTerms)).slice(0, 15), // Increased from 10
    examples: examples.slice(0, 5),
    practices: practices.slice(0, 3),
    concepts: concepts.slice(0, 5)
  };
}

function containsAll(haystackLower: string, needles: string[]) {
  return needles.every(n => haystackLower.includes(n));
}

function generateProductivity2026QuestionsEN(day: number, title: string, cleanContentLower: string, courseId: string): ContentBasedQuestion[] {
  const questions: ContentBasedQuestion[] = [];

  const normalizedCourseId = String(courseId || '').toLowerCase();
  const baseTags = [`#day${day}`, '#en', ...(normalizedCourseId ? [`#course-${normalizedCourseId}`] : []), '#productivity'];

  const tags = (type: QuizQuestionType, diff: QuestionDifficulty) => [
    ...baseTags,
    diff === QuestionDifficulty.HARD ? '#advanced' : '#intermediate',
    type === QuizQuestionType.APPLICATION ? '#application' : '#critical-thinking',
  ];

  const push = (q: Omit<ContentBasedQuestion, 'category' | 'hashtags'> & { category?: string; hashtags?: string[] }) => {
    questions.push({
      category: q.category || 'Course Specific',
      hashtags: q.hashtags || tags(q.questionType, q.difficulty),
      ...q,
    });
  };

  // NOTE: We intentionally avoid “as described in the lesson” and avoid throwaway options.
  // All questions are standalone; all options are detailed (validator requires >=25 chars).

  switch (day) {
    case 1: {
      // Anchor terms from lesson: output, outcome, constraints, productivity = outcome / constraints
      push({
        question:
          'In the output vs outcome model, which option best describes an outcome (result) rather than output (activity volume)?',
        options: [
          'A client’s critical issue is resolved and satisfaction increases, even if you sent fewer emails.',
          'You sent 80 emails and attended 6 meetings, so you were busy all day.',
          'You updated five spreadsheets and reorganized folders, but nothing changed for the customer.',
          'You opened your task app 30 times and added many new items to the list.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Productivity is defined here as outcome divided by constraints. Which decision increases productivity if your time is fixed but attention is limited?',
        options: [
          'Do one high-impact task to completion in a protected focus block, then handle messages in a separate batch.',
          'Increase activity volume by multitasking so more tasks are “touched” during the same hours.',
          'Add more status updates and meetings to feel in control, even if execution time shrinks.',
          'Keep switching between tasks whenever a notification arrives to stay responsive.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'You have the same goal but different days feel harder. Which option is the most accurate “constraints” diagnosis in this course’s definition?',
        options: [
          'Constraints include time, energy, attention, and resources; when one drops, the same work produces less outcome.',
          'Constraints are only the number of hours on your calendar; energy and attention do not affect results.',
          'Constraints are mainly motivation; if you want it enough, limits do not matter.',
          'Constraints are irrelevant; productivity is purely the number of tasks completed.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'A teammate brags about “100 emails sent today.” Which question best reframes the discussion from output to outcome?',
        options: [
          'What changed for the customer or project because of those emails, and how will we measure that change?',
          'How can we send even more emails tomorrow to prove we are working hard?',
          'Which email client did you use, and can we automate sending more messages?',
          'How many hours did you spend typing, regardless of whether anything improved?',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Which personal definition best matches the course’s productivity framing (outcome relative to constraints)?',
        options: [
          'Productivity is creating measurable outcomes while managing time, energy, attention, and resources sustainably.',
          'Productivity is staying busy and completing many small tasks to feel progress every day.',
          'Productivity is working long hours so nobody questions your commitment.',
          'Productivity is responding instantly to messages so you look available at all times.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Why can higher output sometimes reduce productivity in the outcome/constraints definition, even if you feel “productive”?',
        options: [
          'Because output can consume constraints (time/energy/attention) without increasing outcomes, so the denominator grows while the numerator does not.',
          'Because more activity always guarantees better outcomes, so productivity always goes up with output.',
          'Because outcomes are random and cannot be influenced, so only output matters for improvement.',
          'Because measuring outcomes is impossible, so productivity must be defined only by activity volume.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      push({
        question:
          'A manager demands “more activity” (more meetings, more updates) to prove progress. What is the most likely failure mode under the outcome/constraints definition?',
        options: [
          'Constraints get consumed by coordination overhead, reducing deep execution time and lowering real outcomes.',
          'Constraints improve automatically because meetings create energy and focus by default for everyone.',
          'Outcomes become guaranteed because activity volume itself is the same as delivering results.',
          'Attention and energy increase with more status reporting, so outcomes always accelerate.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });
      break;
    }

    case 2: {
      // Time, energy, attention; time blocking; buffer; deep work rules
      push({
        question:
          'In “time, energy, attention”, which schedule best respects constraints by placing deep work in a peak energy window and batching shallow work?',
        options: [
          '90–120 minutes of deep work in the morning, email/messages in two short batches, and 20–30% buffer time for surprises.',
          'Email and chat open all day with deep work “whenever there is time”, no buffer for interruptions.',
          'Back-to-back meetings all morning, then attempt deep work late afternoon when energy is lowest.',
          'Switch between deep work and notifications every 5 minutes to stay responsive and “connected”.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'You plan an 8-hour day with 8 hours of scheduled tasks. According to the course, what is the most practical fix?',
        options: [
          'Add 20–30% buffer time, because a calendar with zero slack converts small surprises into stress and missed outcomes.',
          'Keep it fully packed; a zero-buffer schedule forces discipline and always produces better results.',
          'Add more meetings so every hour has an owner and nothing is “wasted” on execution time.',
          'Work later at night to compensate, even if energy and attention quality drop significantly.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Which deep work rule best matches the attention constraint logic in the course?',
        options: [
          'During deep work: no email, no phone, no chats; interruptions are prevented by design, not willpower.',
          'During deep work: keep chat open so you can respond quickly without losing focus.',
          'During deep work: multitask across two projects to reduce boredom and maintain momentum.',
          'During deep work: accept meetings as they come and “return to focus” instantly afterward.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Your energy is high from 9–11 AM and low from 3–5 PM. Which choice is aligned with managing energy as a constraint?',
        options: [
          'Put creative/strategic work in 9–11 AM and schedule routine/admin tasks for 3–5 PM.',
          'Put the hardest creative work in 3–5 PM because difficulty builds character regardless of outcomes.',
          'Schedule random work whenever it appears, because energy patterns are not predictable or usable.',
          'Add a meeting-heavy block at 9–11 AM so the best hours are used for coordination, not execution.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Why does the course treat attention as a primary constraint (not a minor detail) when planning a day?',
        options: [
          'Because frequent interruptions impose refocus costs and reduce the quality and speed of outcomes, even if hours worked stay constant.',
          'Because attention is unlimited if you have enough motivation, so planning for it is unnecessary.',
          'Because attention only matters for reading, not for problem-solving or creative output.',
          'Because attention is automatically restored the moment you switch tasks, so interruptions are free.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      push({
        question:
          'If you ignore energy management and schedule deep work in low-energy windows, what is the most likely long-term outcome?',
        options: [
          'You will compensate with longer hours, but outcome quality drops and burnout risk rises because constraints are mismanaged.',
          'You will always outperform peak-hour work, because difficulty increases creativity and accuracy automatically.',
          'You will remove the need for breaks, because low energy is solved by more caffeine and willpower.',
          'You will make faster decisions, because fatigue reduces thinking and therefore reduces time spent.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      push({
        question:
          'You have two hours before a deadline and constant incoming messages. Which action best preserves attention while still staying responsive?',
        options: [
          'Set a short “response window” after the deep work block and communicate it, so the two hours stay interruption-free.',
          'Answer every message immediately to reduce anxiety, even if it breaks focus and lowers the outcome quality.',
          'Keep switching tasks to show availability, because responsiveness is the same as productivity.',
          'Schedule a meeting during the two hours so alignment improves while execution happens later somehow.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });
      break;
    }

    case 3: {
      // Goal hierarchy: vision → outcomes → projects → next actions
      push({
        question:
          'In the “goal hierarchy”, which mapping correctly connects vision → outcome → project → next action?',
        options: [
          'Vision: become a lead developer; Outcome: ship a feature by Q2; Project: redesign onboarding; Next action: schedule a kickoff and write the first draft.',
          'Vision: answer emails faster; Outcome: attend more meetings; Project: read productivity tips; Next action: add more tasks to the backlog.',
          'Vision: do many tasks; Outcome: feel busy; Project: keep calendar full; Next action: reply instantly to every message.',
          'Vision: avoid stress; Outcome: never decide; Project: infinite research; Next action: postpone choosing until you feel certain.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'You have a project plan but nothing moves forward. Which missing element is the most likely root cause in the hierarchy?',
        options: [
          'Next actions: concrete steps for today/tomorrow that turn planning into execution.',
          'More vision statements: rewriting the vision weekly until it feels inspiring enough.',
          'More tools: switching task apps so the plan looks cleaner.',
          'More meetings: adding coordination to replace direct action.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Which option is an outcome (measurable change) rather than a project (body of work) in the hierarchy?',
        options: [
          'Increase customer satisfaction by 15% by end of Q2, measured by support survey scores.',
          'Redesign the onboarding flow over the next month with multiple stakeholder reviews.',
          'Write meeting notes and share them after every sync to keep everyone informed.',
          'Create a new folder structure in the drive so documentation looks organized.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'You keep starting new projects whenever you feel stuck. Which hierarchy-based correction is most aligned with the course?',
        options: [
          'Reconnect projects to outcomes, then define next actions for the current project instead of switching to a new one.',
          'Add more projects to increase options, because more parallel work guarantees faster outcomes.',
          'Rewrite the vision every day, because execution should wait until the vision is perfect.',
          'Avoid measuring outcomes, because measurement creates pressure and reduces creativity.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Why does the course insist that each level feeds the next (vision → outcomes → projects → next actions)?',
        options: [
          'Because without next actions, progress stalls; without outcomes, progress is unmeasurable; without vision, effort loses direction.',
          'Because hierarchy makes work slower by adding bureaucracy, which is the main goal of productivity systems.',
          'Because outcomes are less important than projects; finishing projects is the same as achieving results.',
          'Because next actions should be avoided; real productivity comes from long-term thinking only.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      push({
        question:
          'If a team runs many projects without defining measurable outcomes, what is the most likely failure pattern?',
        options: [
          'High activity and frequent updates, but unclear progress because nobody can prove whether the intended change actually happened.',
          'Lower activity but guaranteed results, because projects automatically create outcomes regardless of measurement.',
          'Better prioritization, because lacking outcomes prevents conflict between competing goals.',
          'Less need for next actions, because planning itself completes the work.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      push({
        question:
          'You wrote an inspiring vision but your week is still chaotic. What is the most course-aligned “next action” step to fix execution?',
        options: [
          'Pick one outcome for the next 6–12 months, then define a project and write the first concrete next action for today.',
          'Rewrite the vision again until it feels perfect, then wait for motivation to appear before acting.',
          'Start three new projects so you have options, then decide later which one feels best.',
          'Avoid defining outcomes because measurement creates pressure and reduces creativity.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });
      break;
    }

    case 4: {
      // Habits vs systems: input → process → output; scalability; documentation
      push({
        question:
          'In “habits vs systems”, which example is a system (scales and can be documented) rather than only a personal habit?',
        options: [
          'An email processing workflow: inbox rules, two daily processing windows, and a documented decision rule for every message.',
          'Remembering to check email “sometime today” and hoping nothing important is missed.',
          'Trying to be disciplined by working harder when motivation is high, without changing the process.',
          'Willing yourself to avoid distractions without changing notifications or environment.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'A process needs to work for 10 people, not just 1. According to the course, what should you build?',
        options: [
          'A system with clear inputs/outputs, steps, and documentation so execution is consistent across people.',
          'A personal habit and hope everyone copies your style informally over time.',
          'A motivational slogan to increase willpower so the process “sticks” automatically.',
          'A rule that only the most disciplined person can perform the process to maintain quality.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Which option best describes why systems “scale” better than habits in this course?',
        options: [
          'Systems reduce dependence on daily motivation and allow repeatable execution through structure and documentation.',
          'Systems guarantee success without maintenance, so you never need to review or improve them.',
          'Habits cannot exist in teams, so systems are the only way people can work together.',
          'Systems are only about buying tools; habits are about behavior and therefore less important.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'You want to convert “remember to do X” into a system. Which design is closest to input → process → output?',
        options: [
          'Input: incoming requests; Process: triage daily + schedule; Output: prioritized tasks with owners and due dates.',
          'Input: stress; Process: work harder; Output: hope the problem disappears over time.',
          'Input: ideas; Process: keep them in your head; Output: occasional random action when remembered.',
          'Input: emails; Process: check constantly; Output: more activity but no clear completion rule.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'What is the main risk of relying only on habits for team productivity, according to the course’s systems framing?',
        options: [
          'Execution becomes person-dependent; when the “habit owner” is absent, quality and consistency collapse.',
          'Habits automatically transfer to others, so the team becomes more consistent without any documentation.',
          'Habits reduce the need for communication, so coordination becomes unnecessary.',
          'Habits make outcomes measurable by default, so metrics are no longer needed.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      push({
        question:
          'A system takes time to design. Why is it still higher leverage than “trying harder” as a habit strategy?',
        options: [
          'Because a good system reduces decision load and makes correct behavior the default, producing consistent outcomes over time.',
          'Because system design eliminates the need for review and improvement once written down.',
          'Because systems only work when motivation is high, so they are equivalent to habits in practice.',
          'Because habits are always harmful and should never be used for any personal change.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      push({
        question:
          'You want to scale a weekly review to a team. Which change turns it into a system rather than a personal habit?',
        options: [
          'Create a documented template (metrics + questions), set a recurring time, and assign owners so it runs consistently without relying on one person.',
          'Tell everyone to “remember to review weekly” and hope it becomes part of the culture naturally.',
          'Wait until the team feels motivated and then do reviews only when energy is high.',
          'Make weekly review optional with no shared metrics so everyone can interpret progress differently.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });
      break;
    }

    case 5: {
      // Measurement: throughput, focus blocks, carryover; weekly review
      push({
        question:
          'In the weekly review metrics, what does throughput measure in this course (as opposed to “being busy”)?',
        options: [
          'Completed important outcomes/tasks finished, not just activity volume or time spent.',
          'Total number of emails sent and meetings attended, regardless of whether outcomes changed.',
          'Hours worked in the week, regardless of output quality or results achieved.',
          'How many tasks were started, even if none were finished by the end of the week.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'You had high focus blocks but low throughput. Which interpretation is most consistent with the course metrics?',
        options: [
          'You may be focusing on the wrong tasks or not defining outcomes clearly; deep work is happening, but not on high-impact deliverables.',
          'Deep work always guarantees throughput, so the metrics must be wrong and should be ignored.',
          'Throughput is irrelevant; only focus time matters because outcomes are subjective.',
          'You should add more meetings to increase throughput because coordination creates finished outcomes.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Carryover is high for three weeks in a row. Which change best matches the course’s interpretation of carryover?',
        options: [
          'Reduce weekly scope and improve prioritization so planned tasks match real capacity and constraints.',
          'Add more tasks to “push harder”, because carryover means you are not planning enough work.',
          'Stop tracking carryover, because metrics create stress and therefore reduce productivity.',
          'Increase task granularity into micro-steps so the list looks fuller and more active.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Which weekly review sequence best reflects the course’s 30-minute review method?',
        options: [
          'Review completed outcomes (throughput), count deep work blocks, count carryover, reflect briefly, then adjust next week’s plan.',
          'Skim your calendar quickly, then create a longer to-do list to ensure nothing is forgotten.',
          'Focus only on feelings about the week, then keep the same plan without making any rule changes.',
          'Count tasks started and messages answered, then schedule more meetings to create accountability.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Why are these metrics (throughput, focus blocks, carryover) a stronger feedback loop than “I feel productive”?',
        options: [
          'They create objective signals of outcomes and constraints, so you can change one rule at a time and verify improvement.',
          'They remove the need for planning because once you have metrics, the system runs itself automatically.',
          'They guarantee high performance even if you never review or reflect on the numbers.',
          'They measure motivation directly, which is the only reliable driver of productivity.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      push({
        question:
          'A team increases throughput by closing easy tasks while ignoring hard outcomes. What is the most likely downside of that strategy?',
        options: [
          'The metric gets gamed: activity rises but meaningful outcomes lag, so real productivity and customer impact do not improve.',
          'The strategy cannot work because easy tasks are impossible to complete in practice.',
          'Focus blocks will automatically increase because easy tasks require deep work by definition.',
          'Carryover will always go to zero because closing any tasks eliminates overplanning.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      push({
        question:
          'You can improve only one metric next week. Which choice best matches the course’s “change one rule, then measure” approach?',
        options: [
          'Increase focus blocks by scheduling one protected 90–120 minute deep work block daily, then compare throughput and carryover.',
          'Change five tools and routines at once so improvements happen faster even if you cannot attribute the cause.',
          'Stop tracking metrics for a week to reduce stress, then assume performance improved if you feel better.',
          'Increase meeting frequency so progress is visible, then assume outcomes improved without measuring.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });
      break;
    }

    case 6: {
      // Capture: inboxes, triggers list, capture habits
      push({
        question:
          'In the capture system, what is the purpose of having a single reliable “inbox” for incoming items before processing?',
        options: [
          'To prevent loss and reduce mental load by ensuring everything lands in one trusted place before decisions are made.',
          'To avoid deciding at all; the inbox replaces planning and automatically completes tasks for you.',
          'To increase urgency by keeping items scattered across apps so you feel constant pressure to act.',
          'To make capture harder so only the most important items survive by being remembered.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Which example best fits a “triggers list” used for capture habits?',
        options: [
          'After every meeting, immediately capture action items in your inbox before starting the next task.',
          'Whenever you feel anxious, start a new project so you feel productive again.',
          'If something seems important, try to remember it and write it down later when you have time.',
          'Check email continuously so nothing can surprise you and you never miss a message.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'You have three inboxes (email, notes, chat) and none is ever empty. Which change aligns with the course’s capture rule?',
        options: [
          'Set a daily processing time to empty inboxes and apply a decision rule for every item (delete, archive, reply, delegate, schedule).',
          'Add a fourth inbox to distribute load so each app looks less crowded day to day.',
          'Stop capturing items to reduce inbox clutter; only keep tasks you can finish immediately.',
          'Process inboxes only when you feel motivated, because consistency is less important than mood.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'A capture habit becomes reliable when it is triggered automatically. Which design best supports that?',
        options: [
          'Choose one trigger (e.g., after calls) and always capture next steps immediately into the same inbox until it becomes automatic.',
          'Rely on memory and capture only when you remember, so you practice flexibility and resilience.',
          'Capture only big items; small items can be held in your head to train focus.',
          'Capture in different places each time to keep the process “fresh” and interesting.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'What is the main failure mode if you capture everything but never process the inboxes on schedule?',
        options: [
          'The system becomes a dumping ground, trust collapses, and you revert to memory-based work with higher stress and missed outcomes.',
          'The system still works perfectly because capture alone is enough to produce results without decisions.',
          'The system improves automatically over time because unprocessed items become less important.',
          'The system eliminates the need for prioritization, because all items are equally urgent by default.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      push({
        question:
          'Why does a capture system improve productivity under the outcome/constraints framing from Day 1?',
        options: [
          'Because it reduces attention waste (constraint) and prevents loss, allowing more focused execution that produces measurable outcomes.',
          'Because it increases output volume by creating more tasks, which automatically improves productivity.',
          'Because it eliminates the need for deep work by turning all work into quick inbox processing.',
          'Because it replaces outcomes with activity tracking, so results no longer need to be measured.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      push({
        question:
          'You captured action items after a meeting but forgot them until next week. Which change most directly fixes this within the capture system?',
        options: [
          'Add a daily inbox-processing block where each item becomes a scheduled next action, delegated task, or explicitly dropped.',
          'Capture more items into more places so the chance of remembering at least one location is higher.',
          'Stop capturing after meetings so you can stay present; memory is more reliable than systems.',
          'Only capture when the task feels urgent; non-urgent tasks do not need a system.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });
      break;
    }

    case 7: {
      // Daily/Weekly system: morning ritual, daily huddle, weekly review
      push({
        question:
          'In a daily/weekly system, what is the primary purpose of a short daily huddle (5–10 minutes)?',
        options: [
          'To choose today’s priority outcomes and align the day’s blocks, not to add more tasks or hold long discussions.',
          'To debate every open topic until consensus is perfect, even if execution time disappears.',
          'To track who is working the hardest by counting messages and visible activity.',
          'To replace weekly review, because daily planning makes reflection unnecessary.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Which morning ritual best supports the course’s system approach to execution?',
        options: [
          'Review priorities, schedule at least one deep work block, and decide what will be ignored today to protect outcomes.',
          'Start by checking notifications and email so you can react quickly to anything new.',
          'Open multiple projects and pick whichever feels easiest in the moment to build momentum.',
          'Hold a meeting first thing so everyone is immediately busy and visible.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'You finish the week with high carryover again. Which weekly system adjustment is most aligned with the course?',
        options: [
          'Reduce scope, improve prioritization, and schedule focus blocks earlier while protecting buffer time.',
          'Add more tasks to the plan to force higher throughput by sheer volume.',
          'Stop measuring carryover and focus only on how productive the week felt emotionally.',
          'Schedule more meetings to create pressure instead of changing the execution system.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Which choice best integrates time blocking and weekly review into one coherent system?',
        options: [
          'Use weekly review to choose outcomes, then block deep work windows and batch shallow work so the plan matches constraints.',
          'Block every hour with meetings so the calendar is full and nothing unexpected can occur.',
          'Avoid blocking time; flexibility is more important than protecting deep work or outcomes.',
          'Plan only in your head; writing schedules reduces creativity and therefore reduces outcomes.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Why does the course treat a weekly review as essential rather than optional in a productivity system?',
        options: [
          'Because without a feedback loop you cannot see what worked, correct the system, or improve outcomes over time.',
          'Because weekly review increases activity volume, which is the main definition of productivity in this course.',
          'Because weekly review eliminates the need for daily planning and execution once done once.',
          'Because weekly review replaces the need for prioritization; every task becomes equally important.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      push({
        question:
          'If a team runs daily huddles but never clarifies outcomes or next actions, what will most likely happen?',
        options: [
          'Coordination time increases, but execution remains unclear, so activity rises while outcomes stagnate.',
          'Outcomes accelerate automatically because daily meetings always produce completed work.',
          'Deep work time increases because huddles reduce interruptions by default.',
          'Carryover becomes irrelevant because talking about tasks completes them.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      push({
        question:
          'A daily plan looks good on paper but fails by noon due to surprises. Which adjustment best matches the course’s system design?',
        options: [
          'Add buffer time and define an explicit re-planning moment (e.g., midday), so the system adapts without destroying deep work blocks.',
          'Remove buffer time to force discipline; surprises should be handled by working faster, not by planning slack.',
          'Add more tasks in the morning so you can “make up” for interruptions later in the day.',
          'Schedule meetings during deep work windows so surprises are discussed instead of executed.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });
      break;
    }

    case 8: {
      // Context switching cost: attention residue, batching, deep work blocks
      push({
        question:
          'In context switching cost, which change best reduces attention residue and protects deep work?',
        options: [
          'Batch similar tasks (email/messages) into fixed windows and keep a 90–120 minute deep work block interruption-free.',
          'Keep notifications on so you can respond instantly and “stay in flow” across multiple tasks.',
          'Work on three projects at once to increase variety and prevent boredom from deep focus.',
          'Schedule meetings between every task so you never have to refocus for long periods.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'You switch between tasks 20+ times per day and feel exhausted. Which measurement would best validate the problem using the course approach?',
        options: [
          'Log the number of context switches and compare focus blocks completed before and after batching changes.',
          'Count how many messages you answered; more messages answered means less switching cost.',
          'Track only hours worked; switching cannot affect outcomes if time stays constant.',
          'Measure number of browser tabs open; more tabs means better multitasking ability.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Which deep work block rule is most aligned with preventing context switching cost?',
        options: [
          'Define “no email, no chat, no phone” rules and remove triggers so interruptions cannot happen during the block.',
          'Promise yourself you will not get distracted, while keeping all notifications visible.',
          'Switch tasks whenever a new idea appears, so you capture creativity immediately.',
          'Use deep work time primarily for meetings so alignment is maintained continuously.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'If you add more tools but keep switching contexts constantly, what is the most likely result?',
        options: [
          'Tool changes won’t fix the core constraint; attention residue still reduces outcome quality and throughput.',
          'Tools eliminate attention residue automatically, so context switching becomes free and harmless.',
          'More tools guarantee deeper focus because complexity forces the brain to concentrate.',
          'Context switching improves deep work because frequent novelty trains sustained attention.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      push({
        question:
          'Why is batching considered a high-leverage tactic in the course’s focus economics?',
        options: [
          'Because it reduces refocus costs, decision fatigue, and fragmentation, allowing more deep work and higher-quality outcomes.',
          'Because batching increases the number of tasks started, which is the best measure of productivity.',
          'Because batching makes work more exciting, so motivation replaces the need for planning.',
          'Because batching removes the need for prioritization, since all tasks can be done in any order equally well.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      // Ensure minimum application count (add one more application)
      push({
        question:
          'Your calendar has deep work blocks, but you keep breaking them for “quick replies”. What is the best system-level fix?',
        options: [
          'Create a communication policy: two reply windows per day and an escalation rule, so deep work blocks stay protected.',
          'Keep blocks flexible; if you break them often, it means deep work is unrealistic and should be removed.',
          'Add more deep work blocks and hope that a larger quantity compensates for frequent interruptions.',
          'Turn deep work into chat time so you can progress while staying responsive to everyone.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'You feel “busy” all day but produce little. In the context switching lesson, what is the most likely root cause?',
        options: [
          'Frequent context switches create attention residue, so deep work never reaches enough uninterrupted time to produce outcomes.',
          'Your task list is too short; adding more tasks will increase throughput automatically.',
          'Your email response speed is too slow; responding instantly would create better outcomes by itself.',
          'Your calendar has too much deep work; replacing it with meetings increases clarity and therefore results.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });
      break;
    }

    case 9: {
      // Delegation vs elimination
      push({
        question:
          'In “delegation vs elimination”, which task is the best candidate to eliminate (drop) rather than delegate?',
        options: [
          'A weekly report nobody uses and that does not change any decisions or outcomes.',
          'Customer support triage that must happen daily to prevent churn and revenue loss.',
          'A repeatable data entry task that can be done reliably by someone else with instructions.',
          'Formatting a document that still must be produced, but could be handled by another team member.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Which delegation brief best protects outcome quality while giving autonomy (as recommended in the course)?',
        options: [
          'Define expected output, deadline, success criteria, check-in points, and constraints; allow the delegate to choose the method.',
          'Tell them “just handle it” with no criteria, then judge the result harshly at the end.',
          'Micromanage every step daily so the delegate cannot make independent decisions.',
          'Delegate only the easiest parts so you keep all meaningful work and still stay overloaded.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'The elimination test in the course is: “What value is lost if this is not done?” Which conclusion fits the method?',
        options: [
          'If the honest answer is “very little”, eliminate it and reinvest time into higher-outcome work.',
          'If the answer is unclear, keep it forever because uncertainty means it must be important.',
          'If it feels uncomfortable to stop, keep doing it; discomfort is evidence of high value.',
          'If it takes time, it must be valuable; time cost is proof of importance.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'A leader delegates strategic decisions to save time. According to the course framing, why is this risky?',
        options: [
          'Some decisions are non-delegable; delegating them can reduce outcome quality and create rework that costs more time than it saves.',
          'Strategic decisions are always easy to delegate because they do not affect real outcomes.',
          'Delegation automatically improves decision quality because the delegate has more information by default.',
          'Strategic decisions are only about speed, so outcome quality is irrelevant when delegating.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      push({
        question:
          'If you delegate low-value tasks without eliminating any, what is the likely second-order effect?',
        options: [
          'You may still carry too much coordination overhead; eliminating truly unnecessary tasks often yields higher leverage than delegating everything.',
          'Coordination overhead always drops to zero because delegation removes communication needs completely.',
          'Delegation guarantees that all tasks become high value, so elimination is never necessary.',
          'Delegation replaces prioritization, because once delegated, tasks no longer matter to outcomes.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      // Extra application to ensure >=5
      push({
        question:
          'You keep doing “quick fixes” yourself because delegating feels slower. What is the best course-aligned adjustment?',
        options: [
          'Invest once in a clear delegation process and documentation so future repeats cost less than repeated solo fixes.',
          'Keep doing everything yourself; delegation is always slower and never pays back.',
          'Delegate without context to save time; unclear expectations are fine because speed is the priority.',
          'Eliminate all tasks, including critical customer work, because any work is a productivity problem.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'You delegated a task but got a poor result. Which fix is most aligned with the course’s delegation guidance?',
        options: [
          'Clarify expected output, success criteria, and check-in points, then give autonomy on method while providing feedback early.',
          'Take back all delegation permanently; one failure proves delegation never works.',
          'Add more meetings to discuss the task repeatedly instead of improving the delegation brief.',
          'Remove all constraints and deadlines so the delegate can work indefinitely without accountability.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });
      break;
    }

    case 10: {
      // Energy management: peak hours, recovery rituals, boundaries
      push({
        question:
          'In energy management, which plan best matches “peak hours for deep work, low-energy for routine work, and scheduled recovery”?',
        options: [
          'Schedule creative work in peak energy windows, routine tasks in low energy, and include micro/macro breaks as planned recovery.',
          'Schedule the hardest tasks after long meetings, because fatigue forces you to work faster and be more decisive.',
          'Work continuously without breaks to build stamina; recovery reduces productivity and should be avoided.',
          'Shift deep work to late night every day even if sleep quality drops and decision quality declines.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Which boundary is most aligned with sustainable output (not burnout sprint) in the course?',
        options: [
          'Protect sleep and set a stop time; do not trade recovery for more hours when quality is dropping.',
          'Extend the workday whenever possible; more hours always produce proportionally more outcomes.',
          'Remove lunch breaks so you can stay in “work mode” and avoid losing momentum.',
          'Use caffeine to replace breaks; recovery rituals are unnecessary if you push hard enough.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'You notice mood swings and irritability after days of nonstop work. What is the most course-aligned first response?',
        options: [
          'Adjust pace and add intentional recovery (breaks, boundaries, sleep) to restore energy and protect decision quality.',
          'Increase workload to build resilience; fatigue is a sign you should push harder.',
          'Ignore signals; energy is irrelevant as long as you are still doing many tasks.',
          'Add more meetings for accountability; meetings automatically restore energy and motivation.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Why does energy management improve productivity under the outcome/constraints definition, even if total hours stay the same?',
        options: [
          'Because higher energy increases the quality and speed of outcomes per hour, so the same time yields more meaningful results.',
          'Because energy is unrelated to attention and decision quality, so it cannot change outcomes.',
          'Because energy management is mainly about comfort, which reduces ambition and therefore reduces outcomes.',
          'Because energy management increases activity volume automatically, so it improves productivity by definition.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      push({
        question:
          'If a team rewards only long hours (not outcomes), what is the likely impact on sustainable productivity?',
        options: [
          'Burnout risk rises, decision quality drops, and outcomes per constraint decline because recovery is punished instead of designed.',
          'Outcomes improve automatically because long hours guarantee high-quality work regardless of fatigue.',
          'Focus blocks increase because tired brains always concentrate better to compensate.',
          'Carryover disappears because long hours eliminate planning errors without changing systems.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      // Extra application
      push({
        question:
          'Which practice best turns energy insights into an actionable weekly plan?',
        options: [
          'Track energy for a week, identify peak windows, and deliberately schedule deep work and recovery around those windows.',
          'Ignore patterns and schedule tasks randomly so you can “stay flexible” and avoid planning overhead.',
          'Schedule only meetings in the morning; execution can happen later whenever there is time left.',
          'Work until exhausted each day to discover limits; planning energy is less effective than testing failure.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'You consistently crash mid-afternoon. Which adjustment best matches the course’s recovery rituals idea?',
        options: [
          'Schedule a 20–30 minute macro break (walk, lunch, reset) and move demanding work to a peak window instead of pushing through fatigue.',
          'Add more high-stakes decisions into the crash window to train willpower and resilience.',
          'Remove breaks entirely so the body adapts; recovery is a sign of weakness in productivity.',
          'Replace deep work with constant messaging during the crash so you never notice low energy.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });
      break;
    }

    case 11: {
      // Goal Setting & OKRs (refined lesson)
      push({
        question:
          'You set an “Objective” but your week stays chaotic. Which choice best matches a strong OKR structure that guides daily decisions?',
        options: [
          'One Objective plus 2–4 measurable Key Results with a deadline, then weekly check-ins tied to those metrics.',
          'A motivational Objective with no numbers, so you can interpret progress however you feel that week.',
          'A long list of projects with no Key Results, because finishing projects is the same as outcomes.',
          'A promise to “work harder” and respond faster, because activity volume proves progress.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Which Key Result is the best example of a measurable criterion (not a vague intention) for an OKR?',
        options: [
          'Increase onboarding completion rate from 60% to 80% by June 30, measured weekly.',
          'Improve onboarding so users feel happier and the product seems nicer.',
          'Be more productive and get more done without specifying what changes.',
          'Try to focus more and hope it leads to better results later.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'You have an OKR, but execution stalls. What is the most course-aligned next action step for the next 7 days?',
        options: [
          'Break the Objective into weekly next actions, schedule them, and remove activities that do not move Key Results.',
          'Add more meetings to discuss the OKR so alignment improves, then execute later.',
          'Rewrite the Objective until it sounds inspiring enough; execution will follow naturally.',
          'Start multiple unrelated projects to increase the chance that something improves a Key Result accidentally.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'You can measure only one thing weekly to keep the OKR honest. Which metric choice best matches the lesson’s “criteria/threshold” idea?',
        options: [
          'A Key Result number (e.g., completion %, revenue, satisfaction) that directly represents the intended outcome.',
          'Number of emails sent, because communication volume correlates with success.',
          'Hours worked, because time spent is the fairest performance signal.',
          'Number of meetings attended, because attendance shows commitment.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Why does an OKR framework reduce “busy work” under the course’s outcome/constraints definition?',
        options: [
          'Because it ties work to measurable outcomes, making it easier to drop activities that consume constraints without moving results.',
          'Because it increases the number of tasks tracked, which automatically improves productivity.',
          'Because it replaces execution; once goals exist, outcomes happen automatically.',
          'Because it makes meetings more frequent, which ensures constant progress visibility.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      push({
        question:
          'What is the most likely failure mode if you implement OKRs without clear Key Results and thresholds?',
        options: [
          'Progress becomes unprovable, so activity gets mistaken for outcomes and the system can be gamed.',
          'Outcomes become guaranteed because goals exist, even without measurement.',
          'Constraints stop mattering because goal-setting increases energy and attention automatically.',
          'Decision fatigue disappears entirely because OKRs eliminate uncertainty by definition.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      // Extra application to ensure >=5
      push({
        question:
          'Your Key Results are not moving. Which action best matches the lesson’s “mini-review: keep/change/drop” step?',
        options: [
          'Audit last week’s activities, drop what didn’t move KRs, and replace with one specific next action tied to the metric.',
          'Increase workload and add more tasks so progress becomes inevitable by volume.',
          'Stop measuring for a while so you can reduce stress and hope progress returns.',
          'Change the Objective name to something more ambitious so the team feels motivated again.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });
      break;
    }

    case 12: {
      // Accountability structures
      push({
        question:
          'In accountability structures, which setup creates the clearest feedback loop without adding heavy overhead?',
        options: [
          'A simple weekly check-in with a visible metric (throughput or carryover) and a specific next-week commitment.',
          'A vague promise to “try harder” with no metric and no scheduled review point.',
          'Random updates whenever someone remembers, without a consistent cadence or measurement.',
          'A complex dashboard with many metrics that nobody reviews or acts on consistently.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'You want accountability without micromanagement. Which rule best matches the course approach?',
        options: [
          'Track outcomes with agreed metrics and cadence; focus on results and system adjustments, not constant surveillance.',
          'Require hourly status reports so activity is visible, even if it breaks deep work blocks.',
          'Measure only time online; outcomes are too hard to define and should be avoided.',
          'Use public shame as the main mechanism; fear is the most reliable productivity system.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Which check-in question best enforces outcome thinking (not output) in an accountability partner call?',
        options: [
          'What measurable outcome did you complete, and what rule will you change next week based on the metric?',
          'How many messages did you send, and how busy did you feel during the week?',
          'Did you work long hours, and did you respond quickly to every request?',
          'How many tasks did you start, even if none were finished by the end of the week?',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Why can accountability improve productivity even when it does not add new tools or extra hours?',
        options: [
          'Because it creates a feedback loop and commitment pressure that increases follow-through on high-outcome tasks.',
          'Because it increases activity volume automatically; accountability is the same as doing more tasks.',
          'Because it eliminates the need for weekly review; once accountable, reflection is unnecessary.',
          'Because accountability replaces planning; you can improvise every day as long as you report later.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      push({
        question:
          'What is a common failure mode when accountability is designed around activity instead of outcomes?',
        options: [
          'People game visibility (messages, meetings) while outcomes stagnate, so productivity metrics stop reflecting real progress.',
          'People stop working completely, because activity-based tracking removes all motivation instantly.',
          'Deep work blocks become longer automatically because more activity means more focus time by default.',
          'Carryover always decreases because activity creates completion even without prioritization.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      // Extra application
      push({
        question:
          'You miss goals repeatedly. Which accountability change is most likely to help, according to the course’s systems framing?',
        options: [
          'Add a consistent cadence (weekly review + check-in) and make commitments smaller and measurable to match constraints.',
          'Increase goal size dramatically to create pressure; bigger promises always create better follow-through.',
          'Remove measurement so failure is less visible; less visibility reduces stress and improves results.',
          'Switch accountability partners weekly so you never get used to the routine or feel bored.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Your team wants accountability but hates meetings. Which option best keeps accountability while protecting focus blocks?',
        options: [
          'Use an async weekly scorecard (throughput/focus blocks/carryover) plus a short scheduled check-in only when metrics signal issues.',
          'Add daily long status meetings so activity is visible, even if deep work is constantly interrupted.',
          'Stop tracking outcomes and rely on trust alone; accountability systems are unnecessary if people are good.',
          'Track only how many messages people send, because messaging volume correlates directly with outcomes.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });
      break;
    }

    case 13: {
      // Decision-making frameworks: analysis paralysis, decision matrix, categories, 80% rule
      push({
        question:
          'In decision-making frameworks, which situation is best handled with a decision matrix (not endless research)?',
        options: [
          'A medium-to-high impact choice with multiple criteria (cost, quality, time) where comparing options objectively reduces procrastination.',
          'A trivial reversible choice where you can decide immediately and fix later if needed.',
          'A choice where you already know the answer and only need to act, not compare options.',
          'A choice with only one viable option where scoring adds no new information.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'You delay a decision for weeks because you want perfect information. What course-aligned rule breaks analysis paralysis?',
        options: [
          'Set an information boundary (time limit or minimum data), make the 80% decision, then iterate after implementation.',
          'Keep researching until uncertainty is zero, because reversing decisions later is always more expensive.',
          'Ask more people for opinions until everyone agrees; consensus is the same as correctness.',
          'Avoid deciding by starting a new project; action can replace decision-making entirely.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Which decision category rule best reduces decision fatigue in the course’s approach?',
        options: [
          'Small reversible decisions get minimal analysis; medium decisions use a simple matrix; large decisions add counsel and time.',
          'All decisions require deep analysis, because small errors accumulate into major failures over time.',
          'Only large decisions should be made; small decisions should be postponed to avoid mistakes.',
          'Decisions should depend on mood; when you feel confident, decide quickly, otherwise delay indefinitely.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'Why is “time is more expensive than perfection” a productivity statement in the course’s framing?',
        options: [
          'Because long analysis consumes constraints and delays outcomes; a fast decision plus iteration often yields better results sooner.',
          'Because perfection is always easy, so you should delay decisions until you can be perfect with no cost.',
          'Because outcomes do not matter; only the act of deciding quickly is important.',
          'Because analysis always produces better decisions, regardless of time cost or missed opportunities.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      push({
        question:
          'What is a likely failure mode if a team applies the 80% rule to high-risk irreversible decisions without safeguards?',
        options: [
          'They may move fast but create costly rework; the rule must be paired with decision categories and risk checks for large decisions.',
          'They will automatically make perfect decisions because speed guarantees accuracy under uncertainty.',
          'They will eliminate decision fatigue entirely, so risk management becomes unnecessary.',
          'They will never need stakeholder input again because iteration replaces alignment on outcomes.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      // Extra application
      push({
        question:
          'You have 3 tool options. Which decision matrix setup is most aligned with the course example method?',
        options: [
          'Define criteria (cost, time saved, quality), weight them, score each option 1–5, multiply, sum, and pick the highest total.',
          'Pick the option with the best marketing; the matrix is unnecessary when branding is strong.',
          'Choose randomly; experimenting is always better than evaluating because evaluation is wasted time.',
          'Only compare one criterion (price) because multi-criteria decisions are too complex to evaluate.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          'You’re stuck choosing between two “good” options. What course-aligned question best forces clarity before you decide?',
        options: [
          'Which outcome matters most, what constraint is binding, and what criterion will we use to judge the decision in one week?',
          'Which option feels safest emotionally right now, even if it delays the outcome for another month?',
          'Which option creates the most activity and meetings, because visibility is the main success signal?',
          'Which option avoids any downside at all, because decisions should have zero risk to be acceptable?',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });
      break;
    }

    default: {
      // Days 14–30: use a safe generic pattern grounded in the refined lesson template.
      // We still keep questions concrete, scenario-based, and aligned with steps/metrics/mistakes.
      const topic = title;

      push({
        question:
          `You are applying "${topic}" this week. Which next step most directly turns intent into an outcome instead of extra activity?`,
        options: [
          'Pick one real scenario, apply the checklist, define a success metric/criterion, and review results at week’s end.',
          'Add more meetings and messages so progress is visible, then assume the outcome improved.',
          'Start multiple unrelated tasks to stay busy and increase the feeling of productivity.',
          'Delay action until the plan is perfect, because execution without certainty risks mistakes.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          `Which option is the best example of a measurable metric/criterion for "${topic}" (so you can prove progress)?`,
        options: [
          'A specific number tracked weekly (e.g., decision latency, cycle time, time saved) with a threshold for success.',
          'A general intention like “be better at this”, without numbers or a deadline.',
          'A count of messages sent, regardless of whether outcomes improved.',
          'A feeling-based check (“did it feel productive?”) with no measurable signal.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          `In a "Good vs Bad" comparison for "${topic}", which option is closest to a “Good” implementation?`,
        options: [
          'Clear outcomes, explicit owners/criteria, and fewer distractions so execution produces measurable results.',
          'More activity (more meetings/updates) without decisions, owners, or measurable progress.',
          'More tools and dashboards without changing the process or defining success criteria.',
          'More urgency and overtime without adjusting constraints or simplifying the system.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          `Which mistake is most likely to break "${topic}" in practice, according to the course’s systems framing?`,
        options: [
          'Optimizing visible activity instead of outcomes, so constraints get consumed without measurable progress.',
          'Defining one clear metric and reviewing it weekly to adjust one rule at a time.',
          'Reducing context switching and protecting focus blocks so outcomes can be produced.',
          'Creating a short checklist and documenting it so the process is repeatable.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          `You want "${topic}" to work for a team, not just one person. Which change best makes it a scalable system?`,
        options: [
          'Document the checklist, define owners and success criteria, and run a lightweight cadence (review + adjustment).',
          'Rely on individual willpower and hope everyone copies the best performer’s habits.',
          'Make the process optional with no shared metrics so nobody feels pressured by measurement.',
          'Increase coordination time so everyone stays busy and visible, even if execution time drops.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.MEDIUM,
        questionType: QuizQuestionType.APPLICATION,
      });

      push({
        question:
          `What is the biggest risk if you implement "${topic}" incorrectly by adding more activity without changing outcomes?`,
        options: [
          'Constraints get consumed (time/energy/attention) while outcomes stagnate, so productivity drops even if work feels intense.',
          'Outcomes improve automatically because activity volume guarantees results in complex systems.',
          'Measurement becomes unnecessary because visible effort is a sufficient success signal.',
          'Decision quality improves because fatigue forces faster thinking and fewer debates.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });

      push({
        question:
          `When "${topic}" fails, which diagnosis is most aligned with the course’s outcome/constraints definition?`,
        options: [
          'The system lacks clear criteria/metrics or protected execution time, so outcomes cannot be reliably produced and proven.',
          'People are not working long enough hours, so adding overtime is the main fix regardless of constraints.',
          'The team needs more tools, because tools replace the need for clear definitions and checklists.',
          'The best fix is to stop reviewing results, because reflection slows execution.',
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.HARD,
        questionType: QuizQuestionType.CRITICAL_THINKING,
      });
      break;
    }
  }

  // If lesson content is extremely sparse, prefer not to invent; but for days 1–13 EN we already have seeded content.
  // We still keep this guard for safety.
  if (cleanContentLower.trim().length < 200 && day !== 1) {
    return [];
  }

  // De-duplicate questions by normalized text and return a slightly larger pool.
  const seen = new Set<string>();
  const uniq: ContentBasedQuestion[] = [];
  for (const q of questions) {
    const key = q.question.trim().toLowerCase().replace(/\s+/g, ' ');
    if (seen.has(key)) continue;
    seen.add(key);
    uniq.push(q);
  }

  return uniq;
}

function generateGeoIntroLessonQuestionsEN(
  day: number,
  title: string,
  cleanContentLower: string,
  courseId: string
): ContentBasedQuestion[] {
  // Goal: minimum 7 total -> prefer 5 application + 2 critical-thinking, no recall.
  // Generate a slightly larger pool so strict QC can reject weak options without dropping below 7.
  const questions: ContentBasedQuestion[] = [];

  const normalizedCourseId = String(courseId || '').toLowerCase();
  const baseTags = [`#day${day}`, '#en', '#all-languages', ...(normalizedCourseId ? [`#course-${normalizedCourseId}`] : [])];
  const topicTags: string[] = [];
  if (courseId.includes('GEO')) topicTags.push('#geo');
  if (courseId.includes('SHOPIFY')) topicTags.push('#shopify');

  const tags = (type: QuizQuestionType, diff: QuestionDifficulty) => [
    ...baseTags,
    ...topicTags,
    diff === QuestionDifficulty.HARD ? '#advanced' : '#intermediate',
    type === QuizQuestionType.APPLICATION ? '#application' : '#critical-thinking',
  ];

  // Application 1: KPI mapping
  questions.push({
    question:
      `You run the same GEO prompt about your store 3 times and get different store recommendations each time. Which KPI from "${title}" is failing?`,
    options: [
      'Consistency (the result should be repeatable across runs)',
      'Citation (whether the answer links to your domain)',
      'Inclusion (whether your brand/product appears at least once)',
      'SEO ranking (position in the 10 blue links)',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    category: 'Course Specific',
    questionType: QuizQuestionType.APPLICATION,
    hashtags: tags(QuizQuestionType.APPLICATION, QuestionDifficulty.MEDIUM),
  });

  // Application 2: citation vs inclusion
  questions.push({
    question:
      `An AI answer mentions your product name but does not link to your site. Which GEO outcome from "${title}" are you missing?`,
    options: [
      'Citation (the answer should link to your domain)',
      'Inclusion (your brand/product should appear at all)',
      'Consistency (the answer should repeat across runs)',
      'Conversion (the user must buy immediately)',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    category: 'Course Specific',
    questionType: QuizQuestionType.APPLICATION,
    hashtags: tags(QuizQuestionType.APPLICATION, QuestionDifficulty.MEDIUM),
  });

  // Application 3: data accuracy risk tool/asset
  questions.push({
    question:
      'When developing a GEO strategy for a Shopify store, which asset is the highest risk if it is wrong or inconsistent because it can cause AI answers to misquote price, stock, or shipping?',
    options: [
      'Your product data (identifiers like GTIN + accurate price/stock/shipping info)',
      'Your homepage hero headline (brand positioning text; low risk for factual misquotes)',
      'Your brand logo file (visual identity; does not control factual pricing/stock/shipping)',
      'Your social media bio (helps discovery, but rarely the source for transactional facts)',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    category: 'Course Specific',
    questionType: QuizQuestionType.APPLICATION,
    hashtags: tags(QuizQuestionType.APPLICATION, QuestionDifficulty.MEDIUM),
  });

  // Application 4: good vs poor signals
  questions.push({
    question:
      `You want AI answers to safely quote your store. Which change best matches the “Good vs Poor” examples in "${title}"?`,
    options: [
      'Add missing identifiers (e.g., GTIN) and keep price/stock/shipping transparent and consistent',
      'Hide shipping details until checkout to increase conversion',
      'Use dynamic/duplicate product URLs for the same item to “A/B test” AI visibility',
      'Remove returns information so the page is shorter',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    category: 'Course Specific',
    questionType: QuizQuestionType.APPLICATION,
    hashtags: tags(QuizQuestionType.APPLICATION, QuestionDifficulty.MEDIUM),
  });

  // Application 5: prompt table discipline
  questions.push({
    question:
      `You write 5 GEO prompts and track them in a table. Which column is essential to include so you can evaluate inclusion/citation/consistency for each prompt?`,
    options: [
      'Expected outcome (what you expect to see: inclusion, citation, consistency)',
      'Emoji rating (how fun the prompt feels)',
      'Word count of the prompt only',
      'Competitor names only (does not let you evaluate inclusion/citation/consistency outcomes)',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    category: 'Course Specific',
    questionType: QuizQuestionType.APPLICATION,
    hashtags: tags(QuizQuestionType.APPLICATION, QuestionDifficulty.MEDIUM),
  });

  // Critical thinking 1: GEO vs SEO risk
  questions.push({
    question:
      `A team optimizes only for SEO rankings (the “10 blue links”) and ignores GEO signals. What is the most likely GEO failure described in "${title}"?`,
    options: [
      'The store may not be included or cited in AI answers even if it ranks well in search',
      'The store cannot be crawled by search engines at all',
      'The store automatically becomes premium-only',
      'The store will always be cited by AI answers',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.HARD,
    category: 'Course Specific',
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: tags(QuizQuestionType.CRITICAL_THINKING, QuestionDifficulty.HARD),
  });

  // Critical thinking 2: dynamic URLs downside
  questions.push({
    question:
      'Why can dynamic or duplicate URLs hurt GEO results, even if the on-page content looks correct to humans?',
    options: [
      'They make it harder to fetch and safely quote a single “canonical” source, reducing citation and consistency',
      'They increase citations because there are more URLs to choose from',
      'They guarantee conversion because users see more variants of the page',
      'They replace the need for identifiers like GTIN',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.HARD,
    category: 'Course Specific',
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: tags(QuizQuestionType.CRITICAL_THINKING, QuestionDifficulty.HARD),
  });

  // Extra application variants (pool padding)
  questions.push({
    question:
      'An AI answer links to your domain but quotes an outdated shipping promise. Which improvement from the lesson most directly reduces this risk?',
    options: [
      'Make shipping and returns information explicit, consistent, and easy to fetch on stable URLs',
      'Increase the number of blog posts about your brand story',
      'Add more lifestyle images without any accompanying text',
      'Remove prices from product pages to avoid confusion',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    category: 'Course Specific',
    questionType: QuizQuestionType.APPLICATION,
    hashtags: tags(QuizQuestionType.APPLICATION, QuestionDifficulty.MEDIUM),
  });

  questions.push({
    question:
      'Your store appears in AI answers, but it is never the top recommendation and is rarely linked. Which outcome should you prioritize measuring first to diagnose the issue?',
    options: [
      'Citation (whether answers link to your domain and cite you as a source)',
      'Emoji sentiment (whether the answer feels friendly)',
      'Checkout conversion rate (whether users immediately purchase)',
      'Page speed only (regardless of content quality)',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    category: 'Course Specific',
    questionType: QuizQuestionType.APPLICATION,
    hashtags: tags(QuizQuestionType.APPLICATION, QuestionDifficulty.MEDIUM),
  });

  return questions;
}

function generateProductivityLesson1QuestionsPL(
  day: number,
  title: string,
  courseId: string
): ContentBasedQuestion[] {
  const questions: ContentBasedQuestion[] = [];

  const normalizedCourseId = String(courseId || '').toLowerCase();
  const baseTags = [`#day${day}`, '#pl', '#all-languages', ...(normalizedCourseId ? [`#course-${normalizedCourseId}`] : [])];
  const topicTags = ['#productivity'];

  const tags = (type: QuizQuestionType, diff: QuestionDifficulty) => [
    ...baseTags,
    ...topicTags,
    diff === QuestionDifficulty.HARD ? '#advanced' : '#intermediate',
    type === QuizQuestionType.APPLICATION ? '#application' : '#critical-thinking',
  ];

  // Application 1: output vs outcome classification
  questions.push({
    question:
      'Które zdanie jest przykładem “rezultatu” (efektu), a nie “wyniku” (samej aktywności) w kontekście produktywności?',
    options: [
      '„Zamknąłem(-am) projekt na czas i klient zaakceptował rezultat bez poprawek, bo problem został rozwiązany.”',
      '„Wysłałem(-am) dziś 80 e‑maili i miałem(-am) 7 godzin spotkań, więc byłem(-am) bardzo zajęty(-a).”',
      '„Napisałem(-am) 15 notatek ze spotkań, ale nie podjęliśmy żadnej decyzji ani nie ruszyliśmy zadania.”',
      '„Zrobiłem(-am) 25 zadań z listy, ale najważniejszy problem klienta nadal nie jest rozwiązany.”',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    category: 'Course Specific',
    questionType: QuizQuestionType.APPLICATION,
    hashtags: tags(QuizQuestionType.APPLICATION, QuestionDifficulty.MEDIUM),
  });

  // Application 2: productivity formula thinking
  questions.push({
    question:
      'Produktywność = rezultat / ograniczenia. Która decyzja najbardziej zwiększa produktywność przy stałym czasie pracy?',
    options: [
      'Skupiam się na jednym kluczowym problemie klienta i doprowadzam go do zakończenia, zamiast mnożyć drobne aktywności.',
      'Dodaję kolejne spotkania statusowe, żeby “być na bieżąco”, nawet jeśli nie ma decyzji do podjęcia.',
      'Zwiększam liczbę wysyłanych wiadomości, bez mierzenia, czy coś realnie się zmieniło po drugiej stronie.',
      'Rozbijam pracę na jak najwięcej mikro‑zadań, aby wyglądało, że “dużo zrobiłem(-am)”.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    category: 'Course Specific',
    questionType: QuizQuestionType.APPLICATION,
    hashtags: tags(QuizQuestionType.APPLICATION, QuestionDifficulty.MEDIUM),
  });

  // Application 3: constraint identification (energy)
  questions.push({
    question:
      'Masz 8 godzin pracy, ale po południu spada Ci jakość decyzji i skupienia. Które “ograniczenie” powinieneś/powinnaś zoptymalizować w pierwszej kolejności?',
    options: [
      'Energię: zaplanować trudne zadania na czas największej świeżości i ograniczyć wyczerpujące aktywności.',
      'Zasoby: kupić nowe narzędzie, nawet jeśli problemem jest zmęczenie i brak regeneracji.',
      'Czas: wydłużyć dzień pracy, mimo że spadek energii obniża jakość rezultatu.',
      'Wynik: zwiększyć liczbę wykonanych czynności, aby “nadgonić”, bez poprawy energii.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    category: 'Course Specific',
    questionType: QuizQuestionType.APPLICATION,
    hashtags: tags(QuizQuestionType.APPLICATION, QuestionDifficulty.MEDIUM),
  });

  // Application 4: attention constraint and distractors
  questions.push({
    question:
      'Próbujesz pracować nad ważnym zadaniem, ale co kilka minut wracasz do czatu i powiadomień. Jaki krok jest najbardziej sensowny przy ograniczeniu uwagi?',
    options: [
      'Wyłączam powiadomienia i rezerwuję blok skupienia, bo produktywność zależy od rezultatu w ramach mojej uwagi.',
      'Zostawiam powiadomienia włączone, ale obiecuję sobie “będę silniejszy(-a)” i jakoś to wytrzymam.',
      'Dodaję więcej drobnych zadań równolegle, żeby nie czuć frustracji z jednego trudnego tematu.',
      'Zwiększam liczbę spotkań, bo wtedy “ktoś mnie poprowadzi” i nie muszę się skupiać.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    category: 'Course Specific',
    questionType: QuizQuestionType.APPLICATION,
    hashtags: tags(QuizQuestionType.APPLICATION, QuestionDifficulty.MEDIUM),
  });

  // Application 5: personal definition
  questions.push({
    question:
      'Która definicja produktywności jest najbardziej spójna (rezultat względem ograniczeń, a nie objętość działań)?',
    options: [
      'Produktywność to dostarczanie mierzalnych rezultatów przy świadomym zarządzaniu czasem, energią, uwagą i zasobami.',
      'Produktywność to robienie jak największej liczby rzeczy dziennie, aby “zawsze być zajętym”.',
      'Produktywność to wyłącznie liczba godzin przepracowanych w tygodniu, niezależnie od efektu.',
      'Produktywność to szybkie odpowiadanie na wiadomości, nawet jeśli nie przybliża to do celu.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    category: 'Course Specific',
    questionType: QuizQuestionType.APPLICATION,
    hashtags: tags(QuizQuestionType.APPLICATION, QuestionDifficulty.MEDIUM),
  });

  // Critical thinking 1: high output, low outcome
  questions.push({
    question:
      'Dlaczego “wysoki wynik” (dużo aktywności) może obniżać produktywność, mimo że czujesz, że pracujesz ciężko?',
    options: [
      'Bo aktywność zużywa ograniczenia (czas/energia/uwaga), a bez przełożenia na rezultat mianownik rośnie, a licznik nie.',
      'Bo każda aktywność automatycznie zamienia się w rezultat, więc to zawsze poprawia produktywność.',
      'Bo jedyną miarą produktywności jest liczba zadań odhaczonych na liście, niezależnie od celu.',
      'Bo rezultaty są losowe i nie da się nimi zarządzać, więc jedyne co pozostaje to zwiększać wynik.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.HARD,
    category: 'Course Specific',
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: tags(QuizQuestionType.CRITICAL_THINKING, QuestionDifficulty.HARD),
  });

  // Critical thinking 2: constraint tradeoff
  questions.push({
    question:
      'Zespół naciska na więcej spotkań “żeby kontrolować postęp”. Jakie jest największe ryzyko dla produktywności przy definicji: rezultat / ograniczenia?',
    options: [
      'Spotkania mogą zwiększyć “wynik” (aktywność), ale zabrać ograniczenia i obniżyć realny rezultat w kluczowych zadaniach.',
      'Spotkania zawsze zwiększają rezultat, bo sama synchronizacja jest równoznaczna z wykonaniem pracy.',
      'Spotkania nie wpływają na ograniczenia czasu i uwagi, więc nie mają kosztu dla produktywności.',
      'Spotkania automatycznie podnoszą energię zespołu, więc im więcej tym lepiej dla rezultatów.',
    ],
    correctIndex: 0,
    difficulty: QuestionDifficulty.HARD,
    category: 'Course Specific',
    questionType: QuizQuestionType.CRITICAL_THINKING,
    hashtags: tags(QuizQuestionType.CRITICAL_THINKING, QuestionDifficulty.HARD),
  });

  return questions;
}

/**
 * Language-specific question templates
 */
interface LanguageTemplates {
  criticalThinking: {
    question: (concept: string, goal: string) => string;
    options: (concept: string) => [string, string, string, string];
  };
  application: {
    practice: (practice: string) => string;
    keyTerm: (keyTerm: string) => string;
    options: {
      practice: [string, string, string, string];
      keyTerm: [string, string, string, string];
    };
  };
  recall: {
    keyTerm: (keyTerm: string, title?: string) => string;
    topic: (topic: string) => string;
    fallback: (title: string) => string;
    options: {
      keyTerm: (keyTerm: string) => [string, string, string, string];
      topic: (topic: string) => [string, string, string, string];
      fallback: [string, string, string, string];
    };
  };
}

function getLanguageTemplates(language: string, title: string): LanguageTemplates {
  const lang = language.toLowerCase();
  
  // Russian templates
  if (lang === 'ru') {
    return {
      criticalThinking: {
        question: (concept, goal) =>
          `Руководитель принимает решение по принципу: «${concept}». Какой эффект наиболее вероятен для достижения ${goal}, и какой типичный риск возникает при неправильной интерпретации или измерении?`,
        options: (concept) => [
          'Фокус усиливает результативность, потому что оптимизирует выход (output) под ограничения; риск: оптимизация «не той метрики» даёт видимость прогресса без результата (outcome).',
          'Достаточно увеличить количество задач, потому что больше действий = больше результата; риск: растёт активность и шум, но падает качество и ценность для клиента.',
          'Ограничения (время/энергия/внимание) не важны, если «стараться сильнее»; риск: перегрузка, ошибки и выгорание ухудшают итоговый outcome.',
          'Главное — скорость; качество можно исправить потом; риск: переделки и возвраты съедают throughput и ломают доверие.',
        ]
      },
      application: {
        practice: (practice) =>
          `Вы внедряете новую практику: «${practice}». Какой план внедрения даст измеримый выход и быструю обратную связь?`,
        keyTerm: (keyTerm) =>
          `В проекте нужно перевести «${keyTerm}» в действия. Какой подход делает выход измеримым и проверяемым?`,
        options: {
          practice: [
            'Внедряю по шагам: задаю критерии/метрики, делаю пилот на малом объёме, фиксирую результат и корректирую один rule за раз.',
            'Меняю всё сразу без метрик и без контрольных точек, а потом «угадываю», что сработало.',
            'Оставляю как есть и надеюсь, что проблема решится сама, без измерения и контроля.',
            'Делаю формально, но не проверяю эффект (нет до/после), поэтому качество результата неизвестно.',
          ],
          keyTerm: [
            'Определяю «готово» (критерий), выбираю одну метрику, применяю на одном кейсе и расширяю только после подтверждения эффекта.',
            'Использую термин как лозунг, но без чек‑листа и измерения — поэтому выход не проверяем и не повторяем.',
            'Пытаюсь сделать «идеально», откладывая запуск; риск: потеря throughput и накопление carryover.',
            'Выполняю действия, но без владельца/срока/порогов — результат расплывается и не влияет на outcome.',
          ]
        }
      },
      recall: {
        keyTerm: (keyTerm, titleParam?: string) => {
          const lessonTitle = titleParam || title;
          if (keyTerm.length > 15) {
            return `Какую роль играет ${keyTerm} в уроке "${lessonTitle}"?`;
          }
          return `Насколько важен ${keyTerm} в контексте ${lessonTitle}, как обсуждается в уроке?`;
        },
        topic: (topic) => `Что содержит раздел "${topic}" в уроке?`,
        fallback: (title) => `Какой элемент является частью методологии, подробно описанной в уроке "${title}"?`,
        options: {
          keyTerm: (keyTerm) => [
            `Как подробно описано в уроке, ${keyTerm} играет ключевую роль в оптимизации процессов и достижении целей`,
            'Только периферийная информация без значительной роли',
            'Только теоретическая концепция без практического применения',
            'Не упоминается в уроке'
          ],
          topic: (topic) => [
            `Конкретная информация, методы и примеры, связанные с ${topic.toLowerCase()}, как подробно описано в уроке`,
            'Только общая информация',
            'Только теоретические знания',
            'Нет конкретного содержания'
          ],
          fallback: [
            'Конкретные шаги и лучшие практики, упомянутые и подробно описанные в уроке',
            'Только общие принципы',
            'Только теоретические знания',
            'Нет конкретной методологии'
          ]
        }
      }
    };
  }
  
  // Turkish templates
  if (lang === 'tr') {
    return {
      criticalThinking: {
        question: (concept, goal) =>
          `Bir lider şu ilkeye göre karar veriyor: “${concept}”. ${goal} hedefine ulaşmada en olası etki nedir ve yanlış yorumlanır/yanlış ölçülürse tipik risk hangisidir?`,
        options: (concept) => [
          'Doğru odak, kısıtlar altında en yüksek etkili çıktıyı artırır; risk: yanlış metriğe optimize olup “görünür output” üretmek.',
          'Daha çok iş yapmak otomatik olarak daha çok sonuç getirir; risk: aktivite artar ama kalite ve müşteri değeri düşer.',
          'Kısıtlar (zaman/enerji/dikkat) önemli değildir; risk: aşırı yüklenme, hata ve tükenmişlik sonucu bozar.',
          'Önce hız, kalite sonra; risk: yeniden iş (rework) artar, throughput düşer ve güven kaybı olur.',
        ]
      },
      application: {
        practice: (practice) =>
          `Yeni bir uygulamayı devreye alıyorsunuz: “${practice}”. Hangi plan ölçülebilir çıktı ve hızlı geri bildirim sağlar?`,
        keyTerm: (keyTerm) =>
          `Bir projede “${keyTerm}” kavramını aksiyona dönüştürmeniz gerekiyor. Hangi yaklaşım çıktıyı ölçülebilir ve doğrulanabilir yapar?`,
        options: {
          practice: [
            'Adım adım uygularım: kriter/metrik belirlerim, küçük kapsamda pilot yaparım, sonucu kaydederim ve tek tek kural değiştiririm.',
            'Her şeyi aynı anda değiştiririm; ölçüm ve kontrol noktası olmadan “neyin işe yaradığını” bilemem.',
            'Uygulamayı başlatırım ama “önce/sonra” ölçümü yapmam; böylece etkisi belirsiz kalır.',
            'Sadece okuyup geçerim; çalışma sistemine entegre etmediğim için davranış ve sonuç değişmez.',
          ],
          keyTerm: [
            '“Bitti” kriteri yazarım, bir metrik seçerim, tek bir örnekte uygular ve etkiyi doğruladıktan sonra genişletirim.',
            'Kavramı slogan gibi kullanırım; checklist ve ölçüm olmadığı için doğrulanabilir çıktı üretmem.',
            'Mükemmel olsun diye sürekli ertelerim; sonuç: throughput düşer ve carryover artar.',
            'Yaparım ama sahip/süre/küçük eşikler tanımlamam; bu yüzden sonuç dağılır ve outcome’a bağlanmaz.',
          ]
        }
      },
      recall: {
        keyTerm: (keyTerm, titleParam?: string) => {
          const lessonTitle = titleParam || title;
          if (keyTerm.length > 15) {
            return `${keyTerm} "${lessonTitle}" dersinde nasıl bir rol oynar?`;
          }
          return `Ders içinde tartışıldığı gibi ${keyTerm} ${lessonTitle} bağlamında ne kadar önemlidir?`;
        },
        topic: (topic) => `"${topic}" bölümü ders içinde ne içerir?`,
        fallback: (title) => `"${title}" ders içinde detaylı olarak açıklanan metodolojinin hangi öğesi bir parçasıdır?`,
        options: {
          keyTerm: (keyTerm) => [
            `Ders içinde detaylı olarak açıklandığı gibi, ${keyTerm} süreçlerin optimize edilmesinde ve hedeflere ulaşmada kritik bir rol oynar`,
            'Sadece önemsiz bilgi, önemli bir rolü yok',
            'Sadece teorik bir kavram, pratik uygulaması yok',
            'Ders içinde bahsedilmiyor'
          ],
          topic: (topic) => [
            `Ders içinde detaylı olarak açıklandığı gibi ${topic.toLowerCase()} ile ilgili spesifik bilgi, yöntemler ve örnekler`,
            'Sadece genel bilgi',
            'Sadece teorik bilgi',
            'Spesifik içerik yok'
          ],
          fallback: [
            'Ders içinde bahsedilen ve detaylı olarak açıklanan spesifik adımlar ve en iyi uygulamalar',
            'Sadece genel ilkeler',
            'Sadece teorik bilgi',
            'Spesifik metodoloji yok'
          ]
        }
      }
    };
  }
  
  // Bulgarian templates
  if (lang === 'bg') {
    return {
      criticalThinking: {
        question: (concept, goal) =>
          `Лидер взема решения по принцип: „${concept}“. Какъв е най-вероятният ефект за постигане на ${goal} и кой е типичният риск при грешно тълкуване или грешно измерване?`,
        options: (concept) => [
          'Фокусът увеличава резултата, защото оптимизира изпълнението спрямо ограниченията; риск: оптимизираш грешна метрика и получаваш „видима активност“ без реален резултат.',
          'Повече дейности автоматично означава по-добър резултат; риск: расте шумът и спадат качеството и стойността за клиента.',
          'Ограниченията (време/енергия/внимание) не са важни; риск: претоварване, грешки и бърнаут влошават резултатите.',
          'Скоростта е най-важна, качеството „после“; риск: повече преработка и по-малко завършени важни резултати.',
        ]
      },
      application: {
        practice: (practice) =>
          `Въвеждате нова практика: „${practice}“. Кой план дава измерим изход и бърза обратна връзка?`,
        keyTerm: (keyTerm) =>
          `В проект трябва да превърнете „${keyTerm}“ в действия. Кой подход прави изхода измерим и проверим?`,
        options: {
          practice: [
            'Въвеждам стъпка по стъпка: дефинирам критерии/метрики, правя пилот с малък обхват, измервам преди/след и коригирам по една промяна.',
            'Променям всичко наведнъж без метрики и контролни точки и после гадая какво е сработило.',
            'Започвам, но не измервам ефекта (няма преди/след), така че качеството на резултата е неизвестно.',
            'Прехвърлям отговорността без ясни критерии и проверка, което води до хаос и лошо предаване между хора/екипи.',
          ],
          keyTerm: [
            'Описвам „готово“ (критерий), избирам една метрика, прилагам в един кейс и разширявам само след потвърден ефект.',
            'Използвам термина като лозунг без чеклист и измерване — резултатът не е проверим и не е повторяем.',
            'Отлагам, докато стане „перфектно“; това забавя завършването и увеличава прехвърлените задачи.',
            'Действам без собственик/срок/праг и затова резултатът не води до проверима промяна.',
          ]
        }
      },
      recall: {
        keyTerm: (keyTerm, titleParam?: string) => {
          const lessonTitle = titleParam || title;
          if (keyTerm.length > 15) {
            return `Каква роля играе ${keyTerm} в урока "${lessonTitle}"?`;
          }
          return `Колко важен е ${keyTerm} в контекста на ${lessonTitle}, както се обсъжда в урока?`;
        },
        topic: (topic) => `Какво съдържа разделът "${topic}" в урока?`,
        fallback: (title) => `Кой елемент е част от методологията, описана подробно в урока "${title}"?`,
        options: {
          keyTerm: (keyTerm) => [
            `Както е подробно описано в урока, ${keyTerm} играе ключова роля в оптимизирането на процесите и постигането на целите`,
            'Само периферна информация без значителна роля',
            'Само теоретична концепция без практическо приложение',
            'Не се споменава в урока'
          ],
          topic: (topic) => [
            `Конкретна информация, методи и примери, свързани с ${topic.toLowerCase()}, както е описано подробно в урока`,
            'Само обща информация',
            'Само теоретични знания',
            'Няма конкретно съдържание'
          ],
          fallback: [
            'Конкретните стъпки и най-добри практики, споменати и описани подробно в урока',
            'Само общи принципи',
            'Само теоретични знания',
            'Няма конкретна методология'
          ]
        }
      }
    };
  }
  
  // Polish templates
  if (lang === 'pl') {
    return {
      criticalThinking: {
        question: (concept, goal) =>
          `Lider podejmuje decyzje według zasady: „${concept}”. Jaki efekt jest najbardziej prawdopodobny dla osiągnięcia ${goal} i jakie typowe ryzyko pojawia się przy błędnej interpretacji lub pomiarze?`,
        options: (concept) => [
          'Dobry fokus zwiększa wynik, bo optymalizuje output pod ograniczenia; ryzyko: optymalizacja złej metryki daje „busy output” bez realnego outcome.',
          'Wystarczy robić więcej zadań, bo aktywność = rezultat; ryzyko: rośnie hałas, spada jakość i wartość dla klienta.',
          'Ograniczenia (czas/energia/uwaga) są nieważne; ryzyko: przeciążenie, błędy i wypalenie obniżają outcome.',
          'Najważniejsza jest szybkość, jakość poprawimy później; ryzyko: rework i zwroty zjadają throughput.',
        ]
      },
      application: {
        practice: (practice) =>
          `Wdrażasz nową praktykę: „${practice}”. Który plan wdrożenia daje mierzalny output i szybką informację zwrotną?`,
        keyTerm: (keyTerm) =>
          `W projekcie musisz przełożyć „${keyTerm}” na działania. Które podejście czyni output mierzalnym i weryfikowalnym?`,
        options: {
          practice: [
            'Wdrażam krok po kroku: definiuję kryteria/metryki, robię pilota na małym zakresie, mierzę przed/po i zmieniam po jednej regule.',
            'Zmieniam wszystko naraz bez metryk i punktów kontrolnych, a potem zgaduję, co zadziałało.',
            'Startuję, ale bez pomiaru efektu (brak przed/po), więc nie wiem, czy wynik jest lepszy.',
            'Przerzucam odpowiedzialność bez definicji „done”, co zwiększa chaos i słabe handoff-y.',
          ],
          keyTerm: [
            'Piszę kryterium „done”, wybieram jedną metrykę, stosuję na jednym case i rozszerzam dopiero po potwierdzonym efekcie.',
            'Używam pojęcia jak hasła bez checklisty i pomiaru — output nie jest weryfikowalny ani powtarzalny.',
            'Odkładam wdrożenie, aż będzie „idealnie”; throughput spada i rośnie carryover.',
            'Działam bez właściciela/terminu/progu, więc rezultat nie przekłada się na outcome.',
          ]
        }
      },
      recall: {
        keyTerm: (keyTerm, titleParam?: string) => {
          const lessonTitle = titleParam || title;
          if (keyTerm.length > 15) {
            return `Jaką rolę odgrywa ${keyTerm} w lekcji "${lessonTitle}"?`;
          }
          return `Jak ważny jest ${keyTerm} w kontekście ${lessonTitle}, jak omówiono w lekcji?`;
        },
        topic: (topic) => `Co zawiera sekcja "${topic}" w lekcji?`,
        fallback: (title) => `Który element jest częścią metodologii szczegółowo opisanej w lekcji "${title}"?`,
        options: {
          keyTerm: (keyTerm) => [
            `Jak szczegółowo opisano w lekcji, ${keyTerm} odgrywa kluczową rolę w optymalizacji procesów i osiąganiu celów`,
            'Tylko peryferyjne informacje bez znaczącej roli',
            'Tylko teoretyczna koncepcja bez praktycznego zastosowania',
            'Nie wspomniano w lekcji'
          ],
          topic: (topic) => [
            `Konkretne informacje, metody i przykłady związane z ${topic.toLowerCase()}, jak szczegółowo opisano w lekcji`,
            'Tylko ogólne informacje',
            'Tylko wiedza teoretyczna',
            'Brak konkretnej treści'
          ],
          fallback: [
            'Konkretne kroki i najlepsze praktyki wspomniane i szczegółowo opisane w lekcji',
            'Tylko ogólne zasady',
            'Tylko wiedza teoretyczna',
            'Brak konkretnej metodologii'
          ]
        }
      }
    };
  }
  
  // Vietnamese templates
  if (lang === 'vi') {
    return {
      criticalThinking: {
        question: (concept, goal) =>
          `Một lãnh đạo ra quyết định theo nguyên tắc: “${concept}”. Tác động nào có khả năng nhất để đạt ${goal}, và rủi ro điển hình nào xảy ra nếu hiểu sai hoặc đo sai?`,
        options: (concept) => [
          'Tập trung đúng giúp tăng kết quả vì tối ưu output dưới các giới hạn; rủi ro: tối ưu sai metric tạo “output bận rộn” nhưng không cải thiện outcome.',
          'Chỉ cần làm nhiều việc hơn vì hoạt động = kết quả; rủi ro: tăng nhiễu, giảm chất lượng và giá trị cho khách hàng.',
          'Bỏ qua giới hạn (thời gian/năng lượng/chú ý) vì “cố gắng là đủ”; rủi ro: quá tải, sai sót và kiệt sức làm outcome xấu đi.',
          'Ưu tiên tốc độ, chất lượng sửa sau; rủi ro: rework tăng và throughput giảm.',
        ]
      },
      application: {
        practice: (practice) =>
          `Bạn triển khai một thực hành mới: “${practice}”. Kế hoạch nào tạo output đo được và phản hồi nhanh?`,
        keyTerm: (keyTerm) =>
          `Trong một dự án, bạn cần biến “${keyTerm}” thành hành động. Cách tiếp cận nào làm output đo được và kiểm chứng được?`,
        options: {
          practice: [
            'Triển khai từng bước: đặt tiêu chí/metric, chạy pilot nhỏ, đo trước/sau, ghi lại kết quả và chỉnh một rule mỗi lần.',
            'Đổi tất cả cùng lúc, không có metric hay điểm kiểm tra, rồi đoán thứ gì đã hiệu quả.',
            'Bắt đầu nhưng không đo tác động (không có trước/sau), nên không biết chất lượng kết quả.',
            'Làm cho có nhưng không có owner/thời hạn/ngưỡng, nên không gắn được với outcome.',
          ],
          keyTerm: [
            'Viết tiêu chí “done”, chọn một metric, áp dụng cho một case và mở rộng chỉ sau khi xác nhận tác động.',
            'Dùng khái niệm như khẩu hiệu nhưng không có checklist/đo lường — output không kiểm chứng và không lặp lại được.',
            'Trì hoãn cho đến khi “hoàn hảo”; throughput giảm và carryover tăng.',
            'Hành động nhưng không đo và không ghi lại, nên không biết có cải thiện hay không.',
          ]
        }
      },
      recall: {
        keyTerm: (keyTerm, titleParam?: string) => {
          const lessonTitle = titleParam || title;
          if (keyTerm.length > 15) {
            return `${keyTerm} đóng vai trò gì trong bài học "${lessonTitle}"?`;
          }
          return `${keyTerm} quan trọng như thế nào trong ngữ cảnh của ${lessonTitle} như được thảo luận trong bài học?`;
        },
        topic: (topic) => `Phần "${topic}" chứa gì trong bài học?`,
        fallback: (title) => `Yếu tố nào là một phần của phương pháp được mô tả chi tiết trong bài học "${title}"?`,
        options: {
          keyTerm: (keyTerm) => [
            `Như đã mô tả chi tiết trong bài học, ${keyTerm} đóng vai trò quan trọng trong việc tối ưu hóa quy trình và đạt được mục tiêu`,
            'Chỉ là thông tin ngoại vi không có vai trò quan trọng',
            'Chỉ là một khái niệm lý thuyết không có ứng dụng thực tế',
            'Không được đề cập trong bài học'
          ],
          topic: (topic) => [
            `Thông tin, phương pháp và ví dụ cụ thể liên quan đến ${topic.toLowerCase()} như đã mô tả chi tiết trong bài học`,
            'Chỉ là thông tin chung',
            'Chỉ là kiến thức lý thuyết',
            'Không có nội dung cụ thể'
          ],
          fallback: [
            'Các bước cụ thể và thực hành tốt nhất được đề cập và mô tả chi tiết trong bài học',
            'Chỉ là các nguyên tắc chung',
            'Chỉ là kiến thức lý thuyết',
            'Không có phương pháp cụ thể'
          ]
        }
      }
    };
  }
  
  // Indonesian templates
  if (lang === 'id') {
    return {
      criticalThinking: {
        question: (concept, goal) =>
          `Seorang pemimpin mengambil keputusan dengan prinsip: “${concept}”. Dampak apa yang paling mungkin untuk mencapai ${goal}, dan risiko tipikal apa yang muncul jika salah menafsirkan atau salah mengukur?`,
        options: (concept) => [
          'Fokus yang benar meningkatkan hasil karena mengoptimalkan output di bawah batasan; risiko: mengoptimalkan metrik yang salah menghasilkan “output sibuk” tanpa outcome.',
          'Cukup menambah aktivitas karena aktivitas = hasil; risiko: noise naik, kualitas dan nilai untuk pelanggan turun.',
          'Mengabaikan batasan (waktu/energi/perhatian) karena “usaha saja cukup”; risiko: overload, error, dan burnout merusak outcome.',
          'Kecepatan nomor satu, kualitas belakangan; risiko: rework meningkat dan throughput turun.',
        ]
      },
      application: {
        practice: (practice) =>
          `Anda menerapkan praktik baru: “${practice}”. Rencana mana yang menghasilkan output terukur dan umpan balik cepat?`,
        keyTerm: (keyTerm) =>
          `Dalam proyek, Anda harus mengubah “${keyTerm}” menjadi tindakan. Pendekatan mana yang membuat output terukur dan dapat diverifikasi?`,
        options: {
          practice: [
            'Saya menerapkan bertahap: tetapkan kriteria/metrik, pilot kecil, ukur sebelum/sesudah, dokumentasikan hasil, dan ubah satu rule per iterasi.',
            'Saya mengubah semuanya sekaligus tanpa metrik dan checkpoint, lalu menebak apa yang berhasil.',
            'Saya mulai tetapi tidak mengukur dampak (tanpa sebelum/sesudah), jadi kualitas hasil tidak jelas.',
            'Saya menjalankan tanpa owner/target/ambang, sehingga output tidak terhubung ke outcome.',
          ],
          keyTerm: [
            'Saya menulis kriteria “done”, memilih satu metrik, menerapkan pada satu kasus, lalu memperluas setelah efek terkonfirmasi.',
            'Saya memakai istilah sebagai slogan tanpa checklist/ukur — output tidak bisa diverifikasi dan tidak repeatable.',
            'Saya menunda sampai “sempurna”; throughput turun dan carryover naik.',
            'Saya bertindak tetapi tidak mengukur dan tidak mendokumentasikan, jadi tidak tahu apakah ada perbaikan.',
          ]
        }
      },
      recall: {
        keyTerm: (keyTerm, titleParam?: string) => {
          const lessonTitle = titleParam || title;
          if (keyTerm.length > 15) {
            return `Apa peran ${keyTerm} dalam pelajaran "${lessonTitle}"?`;
          }
          return `Seberapa penting ${keyTerm} dalam konteks ${lessonTitle} seperti yang dibahas dalam pelajaran?`;
        },
        topic: (topic) => `Apa yang terkandung dalam bagian "${topic}" dalam pelajaran?`,
        fallback: (title) => `Elemen mana yang merupakan bagian dari metodologi yang dijelaskan secara detail dalam pelajaran "${title}"?`,
        options: {
          keyTerm: (keyTerm) => [
            `Seperti yang dijelaskan secara detail dalam pelajaran, ${keyTerm} memainkan peran penting dalam mengoptimalkan proses dan mencapai tujuan`,
            'Hanya informasi periferal tanpa peran signifikan',
            'Hanya konsep teoretis tanpa aplikasi praktis',
            'Tidak disebutkan dalam pelajaran'
          ],
          topic: (topic) => [
            `Informasi, metode, dan contoh spesifik terkait ${topic.toLowerCase()} seperti yang dijelaskan secara detail dalam pelajaran`,
            'Hanya informasi umum',
            'Hanya pengetahuan teoretis',
            'Tidak ada konten spesifik'
          ],
          fallback: [
            'Langkah-langkah spesifik dan praktik terbaik yang disebutkan dan dijelaskan secara detail dalam pelajaran',
            'Hanya prinsip umum',
            'Hanya pengetahuan teoretis',
            'Tidak ada metodologi spesifik'
          ]
        }
      }
    };
  }
  
  // Portuguese templates
  if (lang === 'pt') {
    return {
      criticalThinking: {
        question: (concept, goal) =>
          `Um líder decide com base no princípio: “${concept}”. Qual é o efeito mais provável para atingir ${goal}, e qual risco típico surge se isso for mal interpretado ou mal medido?`,
        options: (concept) => [
          'O foco correto aumenta o resultado porque otimiza o output sob restrições; risco: otimizar a métrica errada gera “output ocupado” sem melhorar o outcome.',
          'Basta fazer mais tarefas porque atividade = resultado; risco: aumenta o ruído e cai a qualidade/valor para o cliente.',
          'Ignorar restrições (tempo/energia/atenção) porque “força de vontade resolve”; risco: sobrecarga, erros e burnout pioram o outcome.',
          'Velocidade acima de tudo e qualidade depois; risco: rework cresce e o throughput cai.',
        ]
      },
      application: {
        practice: (practice) =>
          `Você vai implementar uma nova prática: “${practice}”. Qual plano produz output mensurável e feedback rápido?`,
        keyTerm: (keyTerm) =>
          `Em um projeto, você precisa transformar “${keyTerm}” em ações. Qual abordagem torna o output mensurável e verificável?`,
        options: {
          practice: [
            'Implemento por etapas: defino critérios/métricas, faço um piloto pequeno, meço antes/depois, documento o resultado e ajusto uma regra por vez.',
            'Mudo tudo de uma vez sem métricas nem checkpoints e depois tento adivinhar o que funcionou.',
            'Começo, mas sem medir o impacto (sem antes/depois), então a qualidade do resultado fica desconhecida.',
            'Executo sem dono/prazo/limiares, e o output não se conecta ao outcome.',
          ],
          keyTerm: [
            'Escrevo o critério de “done”, escolho uma métrica, aplico em um caso e amplio só depois de confirmar o efeito.',
            'Uso o termo como slogan sem checklist/medição — o output não é verificável nem repetível.',
            'Adio até ficar “perfeito”; o throughput cai e o carryover aumenta.',
            'Faço ações, mas não meço nem registro, então não sei se houve melhoria.',
          ]
        }
      },
      recall: {
        keyTerm: (keyTerm, titleParam?: string) => {
          const lessonTitle = titleParam || title;
          if (keyTerm.length > 15) {
            return `Qual papel ${keyTerm} desempenha na lição "${lessonTitle}"?`;
          }
          return `Quão importante é ${keyTerm} no contexto de ${lessonTitle}, conforme discutido na lição?`;
        },
        topic: (topic) => `O que a seção "${topic}" contém na lição?`,
        fallback: (title) => `Qual elemento faz parte da metodologia descrita em detalhes na lição "${title}"?`,
        options: {
          keyTerm: (keyTerm) => [
            `Conforme descrito em detalhes na lição, ${keyTerm} desempenha um papel crucial na otimização de processos e no alcance de objetivos`,
            'Apenas informações periféricas sem papel significativo',
            'Apenas um conceito teórico sem aplicação prática',
            'Não mencionado na lição'
          ],
          topic: (topic) => [
            `Informações, métodos e exemplos específicos relacionados a ${topic.toLowerCase()} conforme descrito em detalhes na lição`,
            'Apenas informações gerais',
            'Apenas conhecimento teórico',
            'Nenhum conteúdo específico'
          ],
          fallback: [
            'As etapas específicas e melhores práticas mencionadas e descritas em detalhes na lição',
            'Apenas princípios gerais',
            'Apenas conhecimento teórico',
            'Nenhuma metodologia específica'
          ]
        }
      }
    };
  }
  
  // Hindi templates
  if (lang === 'hi') {
    return {
      criticalThinking: {
        question: (concept, goal) =>
          `एक लीडर इस सिद्धांत पर निर्णय लेता है: “${concept}”. ${goal} हासिल करने में सबसे संभावित प्रभाव क्या है, और गलत अर्थ/गलत माप होने पर सामान्य जोखिम क्या होगा?`,
        options: (concept) => [
          'सही फोकस सीमाओं के भीतर output को बेहतर बनाता है; जोखिम: गलत metric पर optimize करके “busy output” बनना, outcome नहीं।',
          'बस अधिक काम करना ही पर्याप्त है क्योंकि activity = result; जोखिम: शोर बढ़ता है और गुणवत्ता/ग्राहक‑मूल्य घटता है।',
          'सीमाएँ (समय/ऊर्जा/ध्यान) महत्वपूर्ण नहीं; जोखिम: overload, गलतियाँ और burnout outcome बिगाड़ते हैं।',
          'पहले गति, गुणवत्ता बाद में; जोखिम: rework बढ़ता है और throughput गिरता है।',
        ]
      },
      application: {
        practice: (practice) =>
          `आप एक नई प्रैक्टिस लागू कर रहे हैं: “${practice}”. कौन सा प्लान मापने योग्य output और तेज़ feedback देता है?`,
        keyTerm: (keyTerm) =>
          `एक प्रोजेक्ट में आपको “${keyTerm}” को actions में बदलना है। कौन सा तरीका output को measurable और verifiable बनाता है?`,
        options: {
          practice: [
            'मैं चरण‑दर‑चरण लागू करता हूँ: criteria/metrics तय करता हूँ, छोटा pilot करता हूँ, before/after मापता हूँ, परिणाम लिखता हूँ और एक‑एक rule बदलता हूँ।',
            'मैं सब कुछ एक साथ बदल देता हूँ बिना metrics/checkpoints के, फिर अंदाज़ा लगाता हूँ कि क्या काम किया।',
            'मैं शुरू तो करता हूँ, पर impact नहीं मापता (before/after नहीं), इसलिए गुणवत्ता पता नहीं चलती।',
            'मैं बिना owner/deadline/threshold के कर देता हूँ, इसलिए output outcome से नहीं जुड़ता।',
          ],
          keyTerm: [
            'मैं “done” criteria लिखता हूँ, एक metric चुनता हूँ, एक case पर लागू करता हूँ और प्रभाव पुष्टि होने पर ही scale करता हूँ।',
            'मैं term को slogan की तरह उपयोग करता हूँ; checklist/measurement नहीं होने से output verify नहीं होता।',
            'मैं “perfect” होने तक टालता हूँ; throughput गिरता है और carryover बढ़ता है।',
            'मैं actions करता हूँ पर measure/document नहीं करता, इसलिए improvement अज्ञात रहता है।',
          ]
        }
      },
      recall: {
        keyTerm: (keyTerm, titleParam?: string) => {
          const lessonTitle = titleParam || title;
          if (keyTerm.length > 15) {
            return `${keyTerm} "${lessonTitle}" पाठ में क्या भूमिका निभाता है?`;
          }
          return `पाठ में चर्चा किए गए ${lessonTitle} के संदर्भ में ${keyTerm} कितना महत्वपूर्ण है?`;
        },
        topic: (topic) => `"${topic}" अनुभाग में पाठ में क्या शामिल है?`,
        fallback: (title) => `कौन सा तत्व "${title}" पाठ में विस्तार से वर्णित पद्धति का हिस्सा है?`,
        options: {
          keyTerm: (keyTerm) => [
            `जैसा कि पाठ में विस्तार से वर्णित है, ${keyTerm} प्रक्रियाओं को अनुकूलित करने और लक्ष्यों को प्राप्त करने में महत्वपूर्ण भूमिका निभाता है`,
            'केवल परिधीय जानकारी, कोई महत्वपूर्ण भूमिका नहीं',
            'केवल एक सैद्धांतिक अवधारणा, कोई व्यावहारिक अनुप्रयोग नहीं',
            'पाठ में उल्लेख नहीं किया गया'
          ],
          topic: (topic) => [
            `पाठ में विस्तार से वर्णित ${topic.toLowerCase()} से संबंधित विशिष्ट जानकारी, विधियां और उदाहरण`,
            'केवल सामान्य जानकारी',
            'केवल सैद्धांतिक ज्ञान',
            'कोई विशिष्ट सामग्री नहीं'
          ],
          fallback: [
            'पाठ में उल्लिखित और विस्तार से वर्णित विशिष्ट चरण और सर्वोत्तम प्रथाएं',
            'केवल सामान्य सिद्धांत',
            'केवल सैद्धांतिक ज्ञान',
            'कोई विशिष्ट पद्धति नहीं'
          ]
        }
      }
    };
  }
  
  // Hungarian templates (existing)
  if (lang === 'hu') {
    return {
      criticalThinking: {
        question: (concept, goal) => {
          const phrase = String(concept || '')
            .replace(/\s+/g, ' ')
            .trim()
            .split(/\s+/)
            .slice(0, 12)
            .join(' ');
          return `Egy vezető a következő elv szerint dönt: „${phrase}”. Melyik hatás a legvalószínűbb a ${goal} elérésében, és mi a tipikus kockázat, ha ezt rosszul értelmezik vagy rosszul mérik?`;
        },
        options: (concept) => [
          `A fókusz növelheti az eredményességet, mert a korlátok mellett a legnagyobb hatású kimenetre koncentrál; kockázat: rossz mérőszámra optimalizálva „látszat‑output” készül.`,
          `Az output automatikusan egyenlő az eredménnyel, ezért elég több feladatot lezárni; kockázat: nő az aktivitás, de romlik az ügyfélérték és a minőség.`,
          `A korlátok (idő/energia/figyelem) figyelmen kívül hagyhatók, mert a termelékenység csak akaraterő kérdése; kockázat: túlterhelés, hibák és kiégés.`,
          `A sebesség maximalizálása a legfontosabb, a minőség majd „később” javítható; kockázat: utómunka, újranyitások és bizalomvesztés alakul ki.`,
        ]
      },
      application: {
        practice: (practice) =>
          `Egy új gyakorlatot vezetsz be: „${practice.substring(0, 60)}”. Melyik bevezetési terv biztosít mérhető kimenetet és gyors visszacsatolást?`,
        keyTerm: (keyTerm) =>
          `Egy projektben a „${keyTerm}” fogalmat kell működésbe fordítanod. Melyik megközelítés teszi a kimenetet mérhetővé és ellenőrizhetővé?`,
        options: {
          practice: [
            'Lépésről lépésre bevezetem, előtte/utána mérőpontokat állítok be, dokumentálom az eredményt, és iterálok a hibák alapján',
            'Egyszerre mindent átállítok, majd nem ellenőrzöm, mi romlott el',
            'Csak elolvasom, de nem építem be a folyamatomba',
            'Megvárom, hogy valaki más készítsen helyettem megoldást'
          ],
          keyTerm: [
            'Konkrét ellenőrzőlistát készítek, implementálom egy kis scope-on, tesztelem a hatást, majd kiterjesztem a teljes scope-ra',
            'Csak definícióként kezelem, ezért nem derül ki, működik-e a gyakorlatban',
            'Kihagyom az implementációt, mert túl időigényesnek tűnik',
            'Végrehajtom, de nem mérek és nem dokumentálok semmit'
          ]
        }
      },
      recall: {
        keyTerm: (keyTerm, titleParam?: string) => {
          const lessonTitle = titleParam || title;
          // Create content-specific question, not template
          if (keyTerm.length > 15) {
            return `A "${lessonTitle}" leckében milyen szerepet játszik a ${keyTerm}?`;
          }
          return `A leckében említett ${keyTerm} milyen fontosságú eleme a ${lessonTitle} témakörnek?`;
        },
        topic: (topic) => `Mit tartalmaz a "${topic}" rész a leckében?`,
        fallback: (title) => `Melyik elem szerepel a "${title}" leckében részletesen leírt módszertanban?`,
        options: {
          keyTerm: (keyTerm) => [
            `A leckében részletesen leírt módon, a ${keyTerm} kulcsfontosságú szerepet játszik a folyamatok optimalizálásában és a célok elérésében`,
            'Csak mellékes információ, nincs jelentős szerepe',
            'Csak elméleti fogalom, nincs gyakorlati alkalmazása',
            'Nem szerepel a leckében'
          ],
          topic: (topic) => [
            `A leckében részletesen leírt, ${topic.toLowerCase()}-ra vonatkozó specifikus információ, módszerek és példák`,
            'Csak általános információ',
            'Csak elméleti tudás',
            'Nincs konkrét tartalom'
          ],
          fallback: [
            'A leckében konkrétan említett, részletesen leírt lépések és best practice-ek',
            'Csak általános elvek',
            'Csak elméleti ismeretek',
            'Nincs konkrét módszertan'
          ]
        }
      }
    };
  }
  
  // Default to English templates
  return {
    criticalThinking: {
      question: (concept, goal) =>
        `In a "${title}" scenario, how would applying "${concept.substring(0, 50)}..." change your ability to achieve ${goal}, and what is the most likely risk if you implement it incorrectly?`,
      options: (concept) => [
        `${concept.substring(0, 30)}... applied correctly improves outcome quality and reduces risk; applied poorly it increases errors and downstream rework`,
        'No significant impact',
        'Only matters theoretically',
        'Only an optional element'
      ]
    },
    application: {
      practice: (practice) =>
        `In your own workflow, how would you implement the "${practice.substring(0, 40)}..." step from "${title}" (specific steps + a way to verify it worked)?`,
      keyTerm: (keyTerm) =>
        `How would you apply the "${keyTerm}" concept to a "${title}" task so the outcome is measurable and verifiable?`,
      options: {
        practice: [
          'I implement it step by step, define before/after checks, document results, and iterate based on what fails',
          'I change everything at once and skip verification',
          'I only read about it but never integrate it into my process',
          'I wait for someone else to produce the solution'
        ],
        keyTerm: [
          'I create a checklist, apply it to a small scope first, measure the impact, then roll it out to the full scope',
          'I keep it as a definition and never validate it in practice',
          'I skip implementation because it seems time-consuming',
          'I implement it but do not measure or document anything'
        ]
      }
    },
      recall: {
        keyTerm: (keyTerm, titleParam?: string) => {
          const lessonTitle = titleParam || title;
          // Create content-specific question, not template
          if (keyTerm.length > 15) {
            return `In the "${lessonTitle}" lesson, what role does ${keyTerm} play?`;
          }
          return `How important is ${keyTerm} in the context of ${lessonTitle} as discussed in the lesson?`;
        },
        topic: (topic) => `What does the "${topic}" section contain in the lesson?`,
        fallback: (title) => `Which element is part of the methodology described in detail in the "${title}" lesson?`,
        options: {
          keyTerm: (keyTerm) => [
            `As described in detail in the lesson, ${keyTerm} plays a crucial role in optimizing processes and achieving goals`,
            'Only peripheral information with no significant role',
            'Only a theoretical concept with no practical application',
            'Not mentioned in the lesson'
          ],
        topic: (topic) => [
          `Specific information, methods, and examples related to ${topic.toLowerCase()} as described in detail in the lesson`,
          'Only general information',
          'Only theoretical knowledge',
          'No specific content'
        ],
        fallback: [
          'The specific steps and best practices mentioned and described in detail in the lesson',
          'Only general principles',
          'Only theoretical knowledge',
          'No specific methodology'
        ]
      }
    }
  };
}

/**
 * Generate content-based questions from lesson content
 */
export function generateContentBasedQuestions(
  day: number,
  title: string,
  content: string,
  language: string,
  courseId: string,
  existingQuestions: any[],
  needed: number
): ContentBasedQuestion[] {
  const questions: ContentBasedQuestion[] = [];

  const sanitizeSnippet = (input: string) =>
    String(input || '')
      .replace(/[✅✔️☑️]/g, '')
      .replace(/\.\.\./g, '')
      .replace(/^[\s•\-\u2022\d]+[.)-]?\s*/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  const scriptProfile = (() => {
    const lang = String(language || '').toLowerCase();
    if (lang === 'bg' || lang === 'ru') return { name: 'cyrillic', re: /[\u0400-\u04FF]/g, minRatio: 0.25 };
    if (lang === 'ar') return { name: 'arabic', re: /[\u0600-\u06FF]/g, minRatio: 0.25 };
    if (lang === 'hi') return { name: 'devanagari', re: /[\u0900-\u097F]/g, minRatio: 0.25 };
    return null;
  })();

  const scriptRatio = (s: string, scriptRe: RegExp) => {
    const text = String(s || '');
    const letters = text.match(/\p{L}/gu) || [];
    if (letters.length === 0) return 0;
    const scriptLetters = text.match(scriptRe) || [];
    return scriptLetters.length / letters.length;
  };

  const preferLanguageMatchedSnippets = (values: string[]) => {
    if (!scriptProfile) return values;
    const filtered = values.filter(v => scriptRatio(v, scriptProfile.re) >= scriptProfile.minRatio);
    return filtered.length ? filtered : values;
  };
  
  // Extract key concepts
  const extracted = extractKeyConcepts(content, title);
  const mainTopics = preferLanguageMatchedSnippets(extracted.mainTopics || []);
  const keyTerms = preferLanguageMatchedSnippets(extracted.keyTerms || []);
  const examples = preferLanguageMatchedSnippets(extracted.examples || []);
  const practices = preferLanguageMatchedSnippets(extracted.practices || []);
  const concepts = preferLanguageMatchedSnippets(extracted.concepts || []);
  
  // Clean content for analysis
  const cleanContent = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const contentLower = cleanContent.toLowerCase();
  const titleLower = title.toLowerCase();

  // Special-case: GEO intro lessons (EN) with inclusion/citation/consistency and GEO vs SEO framing.
  // This produces fully-standalone questions with concrete, educational options (no “as described in the lesson” phrasing).
  if (
    language.toLowerCase() === 'en' &&
    (courseId.includes('GEO') || contentLower.includes('geo')) &&
    containsAll(contentLower, ['inclusion', 'citation', 'consistency']) &&
    (contentLower.includes('geo vs seo') || (contentLower.includes('geo') && contentLower.includes('seo')))
  ) {
    const geoIntro = generateGeoIntroLessonQuestionsEN(day, title, contentLower, courseId);
    return geoIntro.slice(0, needed);
  }

  // Special-case: Productivity 2026 (EN) — day-specific question sets grounded in lesson content + CCS concepts.
  // The generic EN templates are intentionally NOT used here because they contain disallowed patterns under strict QC.
  if (
    language.toLowerCase() === 'en' &&
    courseId.includes('PRODUCTIVITY_2026') &&
    day >= 1 &&
    day <= 30
  ) {
    const pool = generateProductivity2026QuestionsEN(day, title, contentLower, courseId);
    // Return a larger pool so strict QC can reject some while still leaving >=7 valid.
    return pool.slice(0, Math.max(needed, 12));
  }

  // Special-case: Productivity 2026 Day 1 (PL) — output vs outcome vs constraints.
  if (
    language.toLowerCase() === 'pl' &&
    courseId.includes('PRODUCTIVITY_2026') &&
    day === 1 &&
    (contentLower.includes('wynik') && contentLower.includes('rezultat') && contentLower.includes('ogranicze'))
  ) {
    const qs = generateProductivityLesson1QuestionsPL(day, title, courseId);
    // Return a slightly larger pool so callers can select valid questions after strict QC.
    return qs.slice(0, Math.max(needed, 9));
  }

  // Get language-specific templates (pass title for context)
  const templates = getLanguageTemplates(language, title);

  // Generate hashtags helper
  const getHashtags = (qType: QuizQuestionType, diff: QuestionDifficulty) => {
    const normalizedCourseId = String(courseId || '').toLowerCase();
    const tags = [
      `#day${day}`,
      `#${language}`,
      '#all-languages',
      ...(normalizedCourseId ? [`#course-${normalizedCourseId}`] : []),
    ];
    if (courseId.includes('GEO')) tags.push('#geo');
    if (courseId.includes('SHOPIFY')) tags.push('#shopify');
    if (courseId.includes('PRODUCTIVITY')) tags.push('#productivity');
    if (courseId.includes('SALES')) tags.push('#sales');
    if (courseId.includes('AI')) tags.push('#ai');
    if (diff === QuestionDifficulty.EASY) tags.push('#beginner');
    else if (diff === QuestionDifficulty.MEDIUM) tags.push('#intermediate');
    else if (diff === QuestionDifficulty.HARD) tags.push('#advanced');
    if (qType === QuizQuestionType.RECALL) tags.push('#recall');
    else if (qType === QuizQuestionType.APPLICATION) tags.push('#application');
    else if (qType === QuizQuestionType.CRITICAL_THINKING) tags.push('#critical-thinking');
    return tags;
  };

  // HARD RULE: 0 RECALL. Target mix for 7 questions: 5 APPLICATION + 2 CRITICAL_THINKING.
  // For other `needed` values: reserve ~30% for CRITICAL_THINKING (min 1 if needed >= 3), rest APPLICATION.
  const targetCritical =
    needed >= 7 ? 2 : Math.max(needed >= 3 ? 1 : 0, Math.round(needed * 0.3));
  const targetApplication = Math.max(0, needed - targetCritical);

  const seen = new Set<string>();
  const addQuestion = (q: ContentBasedQuestion) => {
    const normalized = q.question.trim().toLowerCase();
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    questions.push(q);
    return true;
  };

  const goalLabel = (() => {
    const lang = String(language || '').toLowerCase();
    if (titleLower.includes('geo')) return 'GEO';
    const map: Record<string, string> = {
      en: 'goals',
      hu: 'célok',
      tr: 'hedefler',
      bg: 'цели',
      pl: 'cele',
      vi: 'mục tiêu',
      id: 'tujuan',
      pt: 'metas',
      ar: 'الأهداف',
      hi: 'लक्ष्य',
      ru: 'цели',
    };
    return map[lang] || 'goals';
  })();
  const criticalSources = [
    ...concepts,
    ...mainTopics,
    ...keyTerms,
    title,
  ].filter(Boolean);

  // Generate CRITICAL_THINKING
  for (let i = 0; i < targetCritical; i++) {
    const source = criticalSources[i] || title;
    const concept = sanitizeSnippet(String(source)).substring(0, 80);
    const questionText = templates.criticalThinking.question(concept, goalLabel);
    addQuestion({
      question: questionText,
      options: templates.criticalThinking.options(concept.substring(0, 40)),
      correctIndex: 0,
      difficulty: QuestionDifficulty.HARD,
      category: 'Course Specific',
      questionType: QuizQuestionType.CRITICAL_THINKING,
      hashtags: getHashtags(QuizQuestionType.CRITICAL_THINKING, QuestionDifficulty.HARD),
    });
  }

  // Generate APPLICATION (prefer practices/examples, then key terms/topics/title)
  const appSources: Array<{ kind: 'practice' | 'keyTerm'; value: string }> = [];
  practices.forEach(p => appSources.push({ kind: 'practice', value: p }));
  examples.forEach(e => appSources.push({ kind: 'practice', value: e }));
  keyTerms.forEach(k => appSources.push({ kind: 'keyTerm', value: k }));
  mainTopics.forEach(t => appSources.push({ kind: 'keyTerm', value: t }));
  concepts.forEach(c => appSources.push({ kind: 'keyTerm', value: c }));
  appSources.push({ kind: 'keyTerm', value: title });

  let appIndex = 0;
  while (questions.length < targetCritical + targetApplication && appIndex < appSources.length * 3) {
    const source = appSources[appIndex % appSources.length];
    const raw = sanitizeSnippet(String(source.value));
    const snippet = raw.substring(0, source.kind === 'practice' ? 60 : 80);
    const questionText =
      source.kind === 'practice'
        ? templates.application.practice(snippet)
        : templates.application.keyTerm(snippet);

    addQuestion({
      question: questionText,
      options: source.kind === 'practice' ? templates.application.options.practice : templates.application.options.keyTerm,
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific',
      questionType: QuizQuestionType.APPLICATION,
      hashtags: getHashtags(QuizQuestionType.APPLICATION, QuestionDifficulty.MEDIUM),
    });
    appIndex++;
  }

  return questions.slice(0, needed);
}
