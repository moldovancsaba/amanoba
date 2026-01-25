/**
 * Fix Reverted Quiz Files
 * 
 * Purpose: Restore strict language enforcement for Days 1-11, 14-15
 * Why: These files were reverted to use English fallback, need to fix
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const filesToFix = [
  'seed-day1-enhanced.ts',
  'seed-day2-enhanced.ts',
  'seed-day3-enhanced.ts',
  'seed-day4-enhanced.ts',
  'seed-day5-enhanced.ts',
  'seed-day6-enhanced.ts',
  'seed-day7-enhanced.ts',
  'seed-day8-enhanced.ts',
  'seed-day9-enhanced.ts',
  'seed-day10-enhanced.ts',
  'seed-day11-enhanced.ts',
  'seed-day14-enhanced.ts',
  'seed-day15-enhanced.ts',
];

const scriptsDir = resolve(process.cwd(), 'scripts');

console.log('🔧 Fixing reverted quiz files...\n');

let fixedCount = 0;

for (const filename of filesToFix) {
  const filePath = resolve(scriptsDir, filename);
  
  try {
    let content = readFileSync(filePath, 'utf-8');
    let modified = false;

    // Extract day number from filename
    const dayMatch = filename.match(/day(\d+)/);
    const dayNum = dayMatch ? dayMatch[1] : 'X';
    const dayVar = `DAY${dayNum}_QUESTIONS`;

    // Pattern 1: Remove fallback in question retrieval
    const fallbackPattern = new RegExp(
      `const questions = ${dayVar}\\[lang\\] \\|\\| ${dayVar}\\['EN'\\]; // Fallback to EN if not translated`,
      'g'
    );
    if (fallbackPattern.test(content)) {
      content = content.replace(
        fallbackPattern,
        `const questions = ${dayVar}[lang];`
      );
      modified = true;
    }

    // Pattern 2: Replace fallback warning with error (multiline)
    const multilinePattern = /if \(!questions \|\| questions\.length === 0\) \{[\s\S]*?console\.log\(`[^`]*No questions defined for \$\{lang\}[^`]*using English as fallback[^`]*`\);[\s\S]*?continue;[\s\S]*?\}/;
    if (multilinePattern.test(content)) {
      content = content.replace(
        multilinePattern,
        `if (!questions || questions.length === 0) {
        console.error(\`   ❌ ERROR: No questions defined for \${lang}! Questions MUST be in course language.\`);
        throw new Error(\`Missing translations for \${lang} - Day ${dayNum} questions must be in course language, not English fallback\`);
      }`
      );
      modified = true;
    }

    // Pattern 3: Replace single-line fallback warning
    const singleLinePattern = /console\.log\(`[^`]*No questions defined for \$\{lang\}[^`]*using English as fallback[^`]*`\);/;
    if (singleLinePattern.test(content)) {
      content = content.replace(
        singleLinePattern,
        `console.error(\`   ❌ ERROR: No questions defined for \${lang}! Questions MUST be in course language.\`);
        throw new Error(\`Missing translations for \${lang} - Day ${dayNum} questions must be in course language, not English fallback\`);`
      );
      modified = true;
    }

    // Pattern 4: Replace continue after fallback warning
    const continuePattern = /console\.log\(`[^`]*No questions defined for \$\{lang\}[^`]*using English as fallback[^`]*`\);\s*continue;/;
    if (continuePattern.test(content)) {
      content = content.replace(
        continuePattern,
        `console.error(\`   ❌ ERROR: No questions defined for \${lang}! Questions MUST be in course language.\`);
        throw new Error(\`Missing translations for \${lang} - Day ${dayNum} questions must be in course language, not English fallback\`);`
      );
      modified = true;
    }

    if (modified) {
      writeFileSync(filePath, content, 'utf-8');
      console.log(`   ✅ Fixed: ${filename}`);
      fixedCount++;
    } else {
      console.log(`   ⚠️  No changes needed: ${filename}`);
    }
  } catch (error) {
    console.error(`   ❌ Error fixing ${filename}:`, error);
  }
}

console.log(`\n✅ Fixed ${fixedCount} files`);
console.log(`📋 Total files processed: ${filesToFix.length}`);
