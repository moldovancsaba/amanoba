/**
 * Comprehensive Category Fix
 * 
 * Purpose: Fix ALL invalid categories by mapping to valid English enum values
 * Why: QuizQuestion model only accepts specific English enum values
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { glob } from 'glob';

// Valid category enum values from quiz-question.ts
const VALID_CATEGORIES = [
  'Science',
  'History',
  'Geography',
  'Math',
  'Technology',
  'Arts & Literature',
  'Sports',
  'General Knowledge',
  'Course Specific',
  'Productivity Foundations',
  'Time, Energy, Attention',
  'Goal Hierarchy',
  'Habits vs Systems',
  'Measurement & Metrics',
  'Capture & GTD',
  'Context Switching',
  'Delegation',
  'Energy Management',
  'Advanced Strategies',
  'Integration & Synthesis',
  'Workplace Application',
  'Team Dynamics',
  'Digital Tools',
  'Communication',
  'Stress Management',
  'Learning Systems',
  'Personal Development',
  'Decision Making',
  'Continuous Improvement',
];

// Category mapping: invalid -> valid
const categoryMap: Record<string, string> = {
  // Common invalid values
  'Attention Management': 'Time, Energy, Attention',
  'Productivity Systems': 'Productivity Foundations',
  
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
  'Enerji Yönetimi': 'Energy Management',
  
  // Bulgarian
  'Продуктивност': 'Productivity Foundations',
  'Определяне на цели': 'Goal Hierarchy',
  'Планиране': 'Goal Hierarchy',
  'Измерване': 'Measurement & Metrics',
  'Превключване на контекст': 'Context Switching',
  'Основи на производителността': 'Productivity Foundations',
  'Управление на енергията': 'Energy Management',
  'Управление на вниманието': 'Time, Energy, Attention',
  'Управление на времето': 'Time, Energy, Attention',
  'Системи за производителност': 'Productivity Foundations',
  
  // Polish
  'Produktywność': 'Productivity Foundations',
  'Przełączanie kontekstu': 'Context Switching',
  'Wyznaczanie celów': 'Goal Hierarchy',
  'Planowanie': 'Goal Hierarchy',
  'Pomiar': 'Measurement & Metrics',
  'Zarządzanie energią': 'Energy Management',
  
  // Vietnamese
  'Năng suất': 'Productivity Foundations',
  'Thiết lập mục tiêu': 'Goal Hierarchy',
  'Lập kế hoạch': 'Goal Hierarchy',
  'Đo lường': 'Measurement & Metrics',
  'Chuyển đổi ngữ cảnh': 'Context Switching',
  'Đặt mục tiêu': 'Goal Hierarchy',
  'Quản lý sự chú ý': 'Time, Energy, Attention',
  
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
  'Gestão de Atenção': 'Time, Energy, Attention',
  
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
const seedFiles = glob.sync('seed-day*-enhanced.ts', { cwd: scriptsDir });

console.log('🔧 COMPREHENSIVE CATEGORY FIX\n');
console.log('═══════════════════════════════════════════════════════════════\n');
console.log(`📋 Found ${seedFiles.length} seed scripts\n`);

let totalFixed = 0;
const invalidCategories = new Set<string>();

for (const filename of seedFiles) {
  const filePath = resolve(scriptsDir, filename);
  let content = readFileSync(filePath, 'utf-8');
  let modified = false;
  let fileFixed = 0;

  // Find all category assignments
  const categoryPattern = /category:\s*["']([^"']+)["']/g;
  let match;
  
  while ((match = categoryPattern.exec(content)) !== null) {
    const category = match[1];
    
    // Check if it's a valid category
    if (!VALID_CATEGORIES.includes(category)) {
      invalidCategories.add(category);
      
      // Try to find a mapping
      const mapped = categoryMap[category];
      if (mapped) {
        // Replace with mapped value
        content = content.replace(
          new RegExp(`category:\\s*["']${category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'g'),
          `category: "${mapped}"`
        );
        fileFixed++;
        modified = true;
      } else {
        // Default to Productivity Foundations if no mapping found
        console.log(`⚠️  ${filename}: Unknown category "${category}" - defaulting to "Productivity Foundations"`);
        content = content.replace(
          new RegExp(`category:\\s*["']${category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'g'),
          'category: "Productivity Foundations"'
        );
        fileFixed++;
        modified = true;
      }
    }
  }

  if (modified) {
    writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ ${filename}: Fixed ${fileFixed} categories`);
    totalFixed += fileFixed;
  }
}

console.log(`\n${'═'.repeat(60)}`);
console.log(`📊 SUMMARY`);
console.log(`${'═'.repeat(60)}\n`);
console.log(`✅ Total categories fixed: ${totalFixed}`);
console.log(`📝 Files processed: ${seedFiles.length}`);

if (invalidCategories.size > 0) {
  console.log(`\n⚠️  Invalid categories found (all fixed):`);
  Array.from(invalidCategories).sort().forEach(cat => {
    console.log(`   - "${cat}"`);
  });
}
