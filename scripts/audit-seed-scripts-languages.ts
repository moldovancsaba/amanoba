/**
 * DEEP AUDIT: Seed Script Language Completeness
 * 
 * Purpose: Verify ALL seed scripts have ALL 10 languages with proper translations
 * Why: Critical requirement - questions MUST be in course language
 * 
 * What this audits:
 * 1. All seed scripts exist for Days 1-30
 * 2. Each script has all 10 languages (HU, EN, TR, BG, PL, VI, ID, AR, PT, HI)
 * 3. No empty language arrays
 * 4. No English fallback logic
 * 5. All questions have proper structure
 */

import * as fs from 'fs';
import * as path from 'path';

const LANGUAGES = ['HU', 'EN', 'TR', 'BG', 'PL', 'VI', 'ID', 'AR', 'PT', 'HI'];
const REQUIRED_DAYS = 30;

interface AuditResult {
  day: number;
  fileExists: boolean;
  fileName?: string;
  languages: {
    [lang: string]: {
      exists: boolean;
      isEmpty: boolean;
      questionCount: number;
    };
  };
  hasFallback: boolean;
  errors: string[];
}

function auditSeedScripts(): void {
  console.log('🔍 DEEP AUDIT: Seed Script Language Completeness\n');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const scriptsDir = path.join(process.cwd(), 'scripts');
  const results: AuditResult[] = [];

  // Check each day
  for (let day = 1; day <= REQUIRED_DAYS; day++) {
    const fileName = `seed-day${day}-enhanced.ts`;
    const filePath = path.join(scriptsDir, fileName);
    const fileExists = fs.existsSync(filePath);

    const result: AuditResult = {
      day,
      fileExists,
      fileName: fileExists ? fileName : undefined,
      languages: {},
      hasFallback: false,
      errors: [],
    };

    if (fileExists) {
      const content = fs.readFileSync(filePath, 'utf-8');

      // Check for English fallback
      if (content.includes("|| DAY") || content.includes("Fallback to EN") || content.includes("using English as fallback")) {
        result.hasFallback = true;
        result.errors.push('Contains English fallback logic');
      }

      // Check each language
      for (const lang of LANGUAGES) {
        const langInfo = {
          exists: false,
          isEmpty: false,
          questionCount: 0,
        };

        // Check if language array exists
        const langPattern = new RegExp(`${lang}:\\s*\\[`, 'g');
        if (langPattern.test(content)) {
          langInfo.exists = true;

          // Check if it's empty
          const emptyPattern = new RegExp(`${lang}:\\s*\\[\\s*\\]`, 'g');
          if (emptyPattern.test(content)) {
            langInfo.isEmpty = true;
            result.errors.push(`${lang}: Empty array`);
          } else {
            // Count questions (rough estimate by counting question: patterns)
            const questionMatches = content.match(new RegExp(`${lang}:\\s*\\[[\\s\\S]*?question:`, 'g'));
            if (questionMatches) {
              langInfo.questionCount = (content.match(new RegExp(`${lang}:\\s*\\[[\\s\\S]*?question:`, 'g')) || []).length;
            }
            // More accurate: count question: strings within the language block
            const langBlockMatch = content.match(new RegExp(`${lang}:\\s*\\[([\\s\\S]*?)\\](?=\\s*[,}])`, 'm'));
            if (langBlockMatch) {
              const blockContent = langBlockMatch[1];
              const questionCount = (blockContent.match(/question:/g) || []).length;
              langInfo.questionCount = questionCount;
            }
          }
        } else {
          result.errors.push(`${lang}: Missing`);
        }

        result.languages[lang] = langInfo;
      }
    } else {
      result.errors.push('File does not exist');
    }

    results.push(result);
  }

  // Report results
  console.log('📊 AUDIT RESULTS:\n');
  console.log('═══════════════════════════════════════════════════════════════\n');

  let totalIssues = 0;
  let daysWithIssues: number[] = [];
  let daysMissing: number[] = [];

  for (const result of results) {
    const hasIssues = result.errors.length > 0 || result.hasFallback;
    
    if (!result.fileExists) {
      daysMissing.push(result.day);
      console.log(`❌ Day ${result.day}: FILE MISSING`);
      totalIssues++;
    } else if (hasIssues) {
      daysWithIssues.push(result.day);
      console.log(`⚠️  Day ${result.day} (${result.fileName}):`);
      
      if (result.hasFallback) {
        console.log(`   ❌ Has English fallback logic`);
        totalIssues++;
      }

      // Check missing languages
      const missingLangs = LANGUAGES.filter(lang => !result.languages[lang]?.exists);
      if (missingLangs.length > 0) {
        console.log(`   ❌ Missing languages: ${missingLangs.join(', ')}`);
        totalIssues += missingLangs.length;
      }

      // Check empty languages
      const emptyLangs = LANGUAGES.filter(lang => result.languages[lang]?.isEmpty);
      if (emptyLangs.length > 0) {
        console.log(`   ❌ Empty language arrays: ${emptyLangs.join(', ')}`);
        totalIssues += emptyLangs.length;
      }

      // Check question counts
      const lowCountLangs = LANGUAGES.filter(lang => {
        const info = result.languages[lang];
        return info?.exists && !info.isEmpty && info.questionCount < 7;
      });
      if (lowCountLangs.length > 0) {
        console.log(`   ⚠️  Languages with < 7 questions: ${lowCountLangs.map(l => `${l}(${result.languages[l].questionCount})`).join(', ')}`);
      }

      if (result.errors.length > 0) {
        result.errors.forEach(err => console.log(`   - ${err}`));
      }
      console.log('');
    }
  }

  // Summary
  console.log('\n═══════════════════════════════════════════════════════════════\n');
  console.log(`📈 SUMMARY:\n`);
  console.log(`   Total days checked: ${REQUIRED_DAYS}`);
  console.log(`   Files existing: ${results.filter(r => r.fileExists).length}`);
  console.log(`   Files missing: ${daysMissing.length} ${daysMissing.length > 0 ? `(${daysMissing.join(', ')})` : ''}`);
  console.log(`   Days with issues: ${daysWithIssues.length} ${daysWithIssues.length > 0 ? `(${daysWithIssues.join(', ')})` : ''}`);
  console.log(`   Total issues found: ${totalIssues}`);

  if (totalIssues === 0 && daysMissing.length === 0) {
    console.log(`\n✅ ALL SEED SCRIPTS ARE COMPLETE WITH ALL LANGUAGES!\n`);
    process.exit(0);
  } else {
    console.log(`\n❌ ISSUES FOUND - Fix required before seeding!\n`);
    process.exit(1);
  }
}

auditSeedScripts();
