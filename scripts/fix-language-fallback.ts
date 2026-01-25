/**
 * Fix Language Fallback Logic
 * 
 * Purpose: Remove English fallback logic from all seed scripts
 * Why: Questions MUST be in course language, not English fallback
 */

import * as fs from 'fs';
import * as path from 'path';

const scriptsDir = path.join(process.cwd(), 'scripts');
const seedFiles = fs.readdirSync(scriptsDir)
  .filter(f => f.startsWith('seed-day') && f.includes('enhanced') && f.endsWith('.ts'));

console.log(`🔧 Fixing language fallback logic in ${seedFiles.length} files...\n`);

let fixed = 0;

for (const file of seedFiles) {
  const filePath = path.join(scriptsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;

  const dayNum = file.match(/seed-day(\d+)/)?.[1];
  const dayVar = `DAY${dayNum}_QUESTIONS`;

  // Pattern 1: Remove fallback in question retrieval (all variations)
  const fallbackPatterns = [
    new RegExp(`const questions = ${dayVar}\\[lang\\] \\|\\| ${dayVar}\\['EN'\\]; \\/\\/ Fallback to EN if not translated`, 'g'),
    new RegExp(`const questions = ${dayVar}\\[lang\\] \\|\\| ${dayVar}\\['EN'\\];`, 'g'),
  ];

  for (const pattern of fallbackPatterns) {
    if (pattern.test(content)) {
      content = content.replace(pattern, `const questions = ${dayVar}[lang];`);
      modified = true;
    }
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
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Fixed: ${file}`);
    fixed++;
  }
}

console.log(`\n✅ Fixed ${fixed} files\n`);
