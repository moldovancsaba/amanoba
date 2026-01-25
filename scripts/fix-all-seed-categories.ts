/**
 * Fix All Seed Script Categories
 * 
 * Purpose: Replace all translated category names with English enum values
 * Why: QuizQuestion model only accepts English enum values
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { glob } from 'glob';

// Category mapping: translated -> English enum
const categoryMap: Record<string, string> = {
  // Bulgarian
  'Продуктивност': 'Productivity Foundations',
  'Определяне на цели': 'Goal Hierarchy',
  'Планиране': 'Goal Hierarchy',
  'Измерване': 'Measurement & Metrics',
  'Превключване на контекст': 'Context Switching',
  
  // Hungarian
  'Termelékenységi rendszerek': 'Productivity Foundations',
  'Magánéleti Termelékenység': 'Personal Development',
  'Energia Menedzselés': 'Energy Management',
  'Figyelem kezelés': 'Time, Energy, Attention',
  'Idő kezelés': 'Time, Energy, Attention',
  
  // Turkish
  'Verimlilik Temelleri': 'Productivity Foundations',
  'Dikkat Yönetimi': 'Time, Energy, Attention',
  'Zaman Yönetimi': 'Time, Energy, Attention',
  'Verimlilik Sistemleri': 'Productivity Foundations',
  
  // Bulgarian
  'Основи на производителността': 'Productivity Foundations',
  'Управление на енергията': 'Energy Management',
  'Управление на вниманието': 'Time, Energy, Attention',
  'Управление на времето': 'Time, Energy, Attention',
  'Системи за производителност': 'Productivity Foundations',
  
  // Polish
  'Podstawy produktywności': 'Productivity Foundations',
  
  // Vietnamese
  'Quản lý sự chú ý': 'Time, Energy, Attention',
  
  // Portuguese
  'Gestão de Atenção': 'Time, Energy, Attention',
  
  // Polish
  'Produktywność': 'Productivity Foundations',
  'Przełączanie kontekstu': 'Context Switching',
  'Wyznaczanie celów': 'Goal Hierarchy',
  'Planowanie': 'Goal Hierarchy',
  'Pomiar': 'Measurement & Metrics',
  
  // Turkish
  'Verimlilik': 'Productivity Foundations',
  'Hedef Belirleme': 'Goal Hierarchy',
  'Planlama': 'Goal Hierarchy',
  'Ölçüm': 'Measurement & Metrics',
  'Enerji Yönetimi': 'Energy Management',
  
  // Vietnamese
  'Năng suất': 'Productivity Foundations',
  'Thiết lập mục tiêu': 'Goal Hierarchy',
  'Lập kế hoạch': 'Goal Hierarchy',
  'Đo lường': 'Measurement & Metrics',
  'Chuyển đổi ngữ cảnh': 'Context Switching',
  'Đặt mục tiêu': 'Goal Hierarchy',
  
  // Indonesian
  'Produktivitas': 'Productivity Foundations',
  'Penetapan Tujuan': 'Goal Hierarchy',
  'Perencanaan': 'Goal Hierarchy',
  'Pengukuran': 'Measurement & Metrics',
  'Pergantian Konteks': 'Context Switching',
  
  // Arabic
  'الإنتاجية': 'Productivity Foundations',
  'تحديد الأهداف': 'Goal Hierarchy',
  'التخطيط': 'Goal Hierarchy',
  'القياس': 'Measurement & Metrics',
  'تبديل السياق': 'Context Switching',
  
  // Portuguese
  'Produtividade': 'Productivity Foundations',
  'Definição de Metas': 'Goal Hierarchy',
  'Planejamento': 'Goal Hierarchy',
  'Medição': 'Measurement & Metrics',
  'Troca de Contexto': 'Context Switching',
  
  // Hindi
  'उत्पादकता': 'Productivity Foundations',
  'लक्ष्य निर्धारण': 'Goal Hierarchy',
  'योजना': 'Goal Hierarchy',
  'मापन': 'Measurement & Metrics',
  'संदर्भ स्विचिंग': 'Context Switching',
  
  // Russian
  'Продуктивность': 'Productivity Foundations',
  'Постановка целей': 'Goal Hierarchy',
  'Планирование': 'Goal Hierarchy',
  'Измерение': 'Measurement & Metrics',
};

const scriptsDir = resolve(process.cwd(), 'scripts');

// Find all seed-day*-enhanced.ts files
const seedFiles = glob.sync('seed-day*-enhanced.ts', { cwd: scriptsDir });

console.log('🔧 FIXING CATEGORIES IN ALL SEED SCRIPTS\n');
console.log('═══════════════════════════════════════════════════════════════\n');
console.log(`📋 Found ${seedFiles.length} seed scripts to fix\n`);

let totalFixed = 0;

for (const filename of seedFiles) {
  const filePath = resolve(scriptsDir, filename);
  let content = readFileSync(filePath, 'utf-8');
  let modified = false;
  let fileFixed = 0;

  // Replace each translated category with English enum
  for (const [translated, english] of Object.entries(categoryMap)) {
    const pattern = new RegExp(`category:\\s*["']${translated.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'g');
    const matches = content.match(pattern);
    if (matches) {
      content = content.replace(pattern, `category: "${english}"`);
      fileFixed += matches.length;
      modified = true;
    }
  }

  if (modified) {
    writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ ${filename}: Fixed ${fileFixed} categories`);
    totalFixed += fileFixed;
  } else {
    console.log(`⏭️  ${filename}: No categories to fix`);
  }
}

console.log(`\n${'═'.repeat(60)}`);
console.log(`📊 SUMMARY`);
console.log(`${'═'.repeat(60)}\n`);
console.log(`✅ Total categories fixed: ${totalFixed}`);
console.log(`📝 Files processed: ${seedFiles.length}`);
