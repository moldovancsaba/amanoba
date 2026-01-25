/**
 * COMPREHENSIVE LANGUAGE AUDIT
 * 
 * Purpose: Verify ALL seed scripts have ALL 10 languages with 7 questions each
 * Why: Critical requirement - questions MUST be in course language
 */

import * as fs from 'fs';
import * as path from 'path';

const LANGUAGES = ['HU', 'EN', 'TR', 'BG', 'PL', 'VI', 'ID', 'AR', 'PT', 'HI'];
const REQUIRED_DAYS = 30;
const REQUIRED_QUESTIONS_PER_LANG = 7;

interface LanguageStatus {
  exists: boolean;
  questionCount: number;
  isEmpty: boolean;
}

interface DayStatus {
  day: number;
  fileExists: boolean;
  fileName?: string;
  languages: { [lang: string]: LanguageStatus };
  errors: string[];
  warnings: string[];
}

function countQuestionsInBlock(block: string): number {
  // Count "question:" occurrences in the block
  return (block.match(/question:/g) || []).length;
}

function extractLanguageBlock(content: string, lang: string): string | null {
  // Find the language block: LANG: [ ... ]
  const langPattern = new RegExp(`${lang}:\\s*\\[([\\s\\S]*?)\\](?=\\s*[,}])`, 'm');
  const match = content.match(langPattern);
  return match ? match[1] : null;
}

function auditDay(day: number): DayStatus {
  const fileName = `seed-day${day}-enhanced.ts`;
  const filePath = path.join(process.cwd(), 'scripts', fileName);
  const fileExists = fs.existsSync(filePath);

  const status: DayStatus = {
    day,
    fileExists,
    fileName: fileExists ? fileName : undefined,
    languages: {},
    errors: [],
    warnings: [],
  };

  if (!fileExists) {
    status.errors.push('File does not exist');
    return status;
  }

  const content = fs.readFileSync(filePath, 'utf-8');

  // Check for English fallback logic
  if (content.includes('|| DAY') && content.includes("['EN']")) {
    status.errors.push('Contains English fallback logic (|| DAY*_QUESTIONS[\'EN\'])');
  }

  // Check each language
  for (const lang of LANGUAGES) {
    const langStatus: LanguageStatus = {
      exists: false,
      questionCount: 0,
      isEmpty: false,
    };

    // Check if language key exists
    const langKeyPattern = new RegExp(`${lang}:\\s*\\[`, 'm');
    if (langKeyPattern.test(content)) {
      langStatus.exists = true;

      // Extract the language block
      const block = extractLanguageBlock(content, lang);
      if (block) {
        // Check if empty
        const trimmedBlock = block.trim();
        if (trimmedBlock === '' || trimmedBlock.match(/^\/\/.*$/)) {
          langStatus.isEmpty = true;
          status.errors.push(`${lang}: Empty array`);
        } else {
          // Count questions
          langStatus.questionCount = countQuestionsInBlock(block);
          if (langStatus.questionCount === 0) {
            langStatus.isEmpty = true;
            status.errors.push(`${lang}: No questions found`);
          } else if (langStatus.questionCount < REQUIRED_QUESTIONS_PER_LANG) {
            status.warnings.push(`${lang}: Only ${langStatus.questionCount} questions (expected ${REQUIRED_QUESTIONS_PER_LANG})`);
          }
        }
      } else {
        status.errors.push(`${lang}: Block extraction failed`);
      }
    } else {
      status.errors.push(`${lang}: Missing language key`);
    }

    status.languages[lang] = langStatus;
  }

  return status;
}

function main() {
  console.log('🔍 COMPREHENSIVE LANGUAGE AUDIT\n');
  console.log('═══════════════════════════════════════════════════════════════\n');
  console.log(`Checking Days 1-${REQUIRED_DAYS} for all ${LANGUAGES.length} languages\n`);

  const allStatuses: DayStatus[] = [];
  let totalErrors = 0;
  let totalWarnings = 0;
  const daysWithIssues: number[] = [];
  const daysMissing: number[] = [];

  for (let day = 1; day <= REQUIRED_DAYS; day++) {
    const status = auditDay(day);
    allStatuses.push(status);

    if (!status.fileExists) {
      daysMissing.push(day);
      totalErrors++;
    } else if (status.errors.length > 0 || status.warnings.length > 0) {
      daysWithIssues.push(day);
      totalErrors += status.errors.length;
      totalWarnings += status.warnings.length;
    }
  }

  // Report
  console.log('📊 AUDIT RESULTS:\n');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Show missing files
  if (daysMissing.length > 0) {
    console.log(`❌ MISSING FILES (${daysMissing.length}):\n`);
    for (const day of daysMissing) {
      console.log(`   Day ${day}: seed-day${day}-enhanced.ts`);
    }
    console.log('');
  }

  // Show days with issues
  if (daysWithIssues.length > 0) {
    console.log(`⚠️  DAYS WITH ISSUES (${daysWithIssues.length}):\n`);
    for (const day of daysWithIssues) {
      const status = allStatuses[day - 1];
      console.log(`   Day ${day} (${status.fileName}):`);
      
      if (status.errors.length > 0) {
        console.log(`      ❌ ERRORS:`);
        status.errors.forEach(err => console.log(`         - ${err}`));
      }
      
      if (status.warnings.length > 0) {
        console.log(`      ⚠️  WARNINGS:`);
        status.warnings.forEach(warn => console.log(`         - ${warn}`));
      }

      // Show language status summary
      const missingLangs = LANGUAGES.filter(l => !status.languages[l]?.exists);
      const emptyLangs = LANGUAGES.filter(l => status.languages[l]?.isEmpty);
      const incompleteLangs = LANGUAGES.filter(l => {
        const lang = status.languages[l];
        return lang?.exists && !lang.isEmpty && lang.questionCount < REQUIRED_QUESTIONS_PER_LANG;
      });

      if (missingLangs.length > 0) {
        console.log(`      Missing languages: ${missingLangs.join(', ')}`);
      }
      if (emptyLangs.length > 0) {
        console.log(`      Empty languages: ${emptyLangs.join(', ')}`);
      }
      if (incompleteLangs.length > 0) {
        console.log(`      Incomplete languages: ${incompleteLangs.map(l => 
          `${l}(${status.languages[l].questionCount})`
        ).join(', ')}`);
      }

      console.log('');
    }
  }

  // Summary
  console.log('\n═══════════════════════════════════════════════════════════════\n');
  console.log(`📈 SUMMARY:\n`);
  console.log(`   Total days checked: ${REQUIRED_DAYS}`);
  console.log(`   Files existing: ${allStatuses.filter(s => s.fileExists).length}`);
  console.log(`   Files missing: ${daysMissing.length} ${daysMissing.length > 0 ? `(${daysMissing.join(', ')})` : ''}`);
  console.log(`   Days with issues: ${daysWithIssues.length} ${daysWithIssues.length > 0 ? `(${daysWithIssues.join(', ')})` : ''}`);
  console.log(`   Total errors: ${totalErrors}`);
  console.log(`   Total warnings: ${totalWarnings}`);

  // Language completeness check
  console.log(`\n🌍 LANGUAGE COMPLETENESS:\n`);
  for (const lang of LANGUAGES) {
    const completeDays = allStatuses.filter(s => 
      s.fileExists && 
      s.languages[lang]?.exists && 
      !s.languages[lang]?.isEmpty && 
      s.languages[lang]?.questionCount >= REQUIRED_QUESTIONS_PER_LANG
    ).length;
    const missingDays = allStatuses.filter(s => 
      !s.fileExists || !s.languages[lang]?.exists || s.languages[lang]?.isEmpty
    ).length;
    console.log(`   ${lang}: ${completeDays}/${REQUIRED_DAYS} days complete ${missingDays > 0 ? `(${missingDays} missing/incomplete)` : '✅'}`);
  }

  if (totalErrors === 0 && daysMissing.length === 0 && totalWarnings === 0) {
    console.log(`\n✅ ALL SEED SCRIPTS ARE COMPLETE WITH ALL LANGUAGES!\n`);
    process.exit(0);
  } else {
    console.log(`\n❌ ISSUES FOUND - Fix required before seeding!\n`);
    process.exit(1);
  }
}

main();
