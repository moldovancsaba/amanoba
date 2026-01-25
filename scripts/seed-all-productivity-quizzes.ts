/**
 * Seed All Productivity 2026 Quizzes
 * 
 * Purpose: Seed all 30 days of quizzes for Productivity 2026 course
 * Why: Complete seeding after fixing reverted files
 * 
 * This script runs all day seed scripts sequentially
 */

import { execSync } from 'child_process';
import { resolve } from 'path';

const scriptsDir = resolve(process.cwd(), 'scripts');

const dayScripts = [
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
  'seed-day12-enhanced.ts',
  'seed-day13-enhanced.ts',
  'seed-day14-enhanced.ts',
  'seed-day15-enhanced.ts',
  'seed-day16-enhanced.ts',
  'seed-day17-enhanced.ts',
  'seed-day18-enhanced.ts',
  'seed-day19-enhanced.ts',
  'seed-day20-enhanced.ts',
  'seed-day21-enhanced.ts',
  'seed-day22-enhanced.ts',
  'seed-day23-enhanced.ts',
  'seed-day24-enhanced.ts',
  'seed-day25-enhanced.ts',
  'seed-day26-enhanced.ts',
  'seed-day27-enhanced.ts',
  'seed-day28-enhanced.ts',
  'seed-day29-enhanced.ts',
  'seed-day30-enhanced.ts',
];

console.log('🌱 SEEDING ALL PRODUCTIVITY 2026 QUIZZES\n');
console.log('═══════════════════════════════════════════════════════════════\n');
console.log(`📋 Total scripts to run: ${dayScripts.length}\n`);

let successCount = 0;
let errorCount = 0;
const errors: Array<{ script: string; error: string }> = [];

for (let i = 0; i < dayScripts.length; i++) {
  const script = dayScripts[i];
  const dayNum = i + 1;
  
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`📅 Day ${dayNum}/${dayScripts.length}: ${script}`);
  console.log(`${'─'.repeat(60)}`);

  try {
    const scriptPath = resolve(scriptsDir, script);
    execSync(`npx tsx --env-file=.env.local "${scriptPath}"`, {
      stdio: 'inherit',
      cwd: process.cwd(),
    });
    successCount++;
    console.log(`✅ Day ${dayNum} completed successfully`);
  } catch (error) {
    errorCount++;
    const errorMsg = error instanceof Error ? error.message : String(error);
    errors.push({ script, error: errorMsg });
    console.error(`❌ Day ${dayNum} failed: ${errorMsg}`);
    console.log(`⚠️  Continuing with next day...`);
  }
}

console.log(`\n\n${'═'.repeat(60)}`);
console.log(`📊 SEEDING SUMMARY`);
console.log(`${'═'.repeat(60)}\n`);
console.log(`✅ Successful: ${successCount}/${dayScripts.length}`);
console.log(`❌ Failed: ${errorCount}/${dayScripts.length}`);

if (errors.length > 0) {
  console.log(`\n❌ Errors:\n`);
  errors.forEach(({ script, error }) => {
    console.log(`   ${script}: ${error}`);
  });
}

if (errorCount === 0) {
  console.log(`\n🎉 All quizzes seeded successfully!`);
  process.exit(0);
} else {
  console.log(`\n⚠️  Some quizzes failed to seed. Please review errors above.`);
  process.exit(1);
}
