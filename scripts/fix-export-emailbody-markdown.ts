/**
 * One-off: Convert all lesson emailBody (and translation emailBody) from HTML to Markdown in a course export JSON file.
 * Usage: npx tsx scripts/fix-export-emailbody-markdown.ts <path-to-export.json>
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { contentToMarkdown } from '../app/lib/lesson-content';

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: npx tsx scripts/fix-export-emailbody-markdown.ts <path-to-export.json>');
  process.exit(1);
}

const absPath = resolve(process.cwd(), filePath);
let data: { lessons?: Array<{ emailBody?: string; translations?: Record<string, { emailBody?: string }> }> };

try {
  data = JSON.parse(readFileSync(absPath, 'utf-8'));
} catch (e) {
  console.error('Failed to read file:', absPath, e);
  process.exit(1);
}

if (!data.lessons || !Array.isArray(data.lessons)) {
  console.error('File has no lessons array.');
  process.exit(1);
}

let count = 0;
for (const lesson of data.lessons) {
  if (typeof lesson.emailBody === 'string') {
    lesson.emailBody = contentToMarkdown(lesson.emailBody);
    count++;
  }
  const tr = lesson.translations;
  if (tr && typeof tr === 'object') {
    for (const loc of Object.keys(tr)) {
      const t = tr[loc];
      if (t && typeof t === 'object' && typeof (t as { emailBody?: string }).emailBody === 'string') {
        (t as { emailBody: string }).emailBody = contentToMarkdown((t as { emailBody: string }).emailBody);
        count++;
      }
    }
  }
}

writeFileSync(absPath, JSON.stringify(data, null, 2), 'utf-8');
console.log(`Updated ${count} emailBody field(s) to Markdown. Written to ${absPath}`);
