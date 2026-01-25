/**
 * Fix Quiz Categories
 * 
 * Purpose: Fix all category values to use English enum values instead of translated ones
 * Why: QuizQuestion model only accepts English enum values
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { glob } from 'glob';

// Category mapping: any value -> valid English enum
const categoryMap: Record<string, string> = {
  // English variations
  'Productivity': 'Productivity Foundations',
  'Productivity Foundations': 'Productivity Foundations',
  'Time Management': 'Time, Energy, Attention',
  'Time, Energy, Attention': 'Time, Energy, Attention',
  'Goals': 'Goal Hierarchy',
  'Goal Setting': 'Goal Hierarchy',
  'Goal Hierarchy': 'Goal Hierarchy',
  'Habits': 'Habits vs Systems',
  'Habits vs Systems': 'Habits vs Systems',
  'Measurement': 'Measurement & Metrics',
  'Measurement & Metrics': 'Measurement & Metrics',
  'Capture': 'Capture & GTD',
  'Capture & GTD': 'Capture & GTD',
  'Context Switching': 'Context Switching',
  'Delegation': 'Delegation',
  'Energy': 'Energy Management',
  'Energy Management': 'Energy Management',
  'Teamwork': 'Team Dynamics',
  'Team Dynamics': 'Team Dynamics',
  'Accountability': 'Personal Development',
  'Accountability Structures': 'Personal Development',
  
  // More language variations
  'Csapatmunka': 'Team Dynamics',
  'Takım Çalışması': 'Team Dynamics',
  'Работа в Екип': 'Team Dynamics',
  'Praca Zespołowa': 'Team Dynamics',
  'Làm Việc Nhóm': 'Team Dynamics',
  'Kerja Tim': 'Team Dynamics',
  'العمل الجماعي': 'Team Dynamics',
  'Trabalho em Equipe': 'Team Dynamics',
  'टीमवर्क': 'Team Dynamics',
  'Values': 'Personal Development',
  'Personal Development': 'Personal Development',
  'Community': 'Team Dynamics',
  'Commitment': 'Personal Development',
  'Integration': 'Integration & Synthesis',
  'Integration & Synthesis': 'Integration & Synthesis',
  'Continuous Improvement': 'Continuous Improvement',
  'Decision Making': 'Decision Making',
  'Decision-Making': 'Decision Making',
  'Productivity Master': 'Productivity Foundations',
  'Planning': 'Goal Hierarchy',
  'Advanced Strategies': 'Advanced Strategies',
  'Workplace Application': 'Workplace Application',
  'Digital Tools': 'Digital Tools',
  'Communication': 'Communication',
  'Stress Management': 'Stress Management',
  'Learning Systems': 'Learning Systems',
  
  // Hungarian
  'Termelékenység': 'Productivity Foundations',
  'Termelékenység alapok': 'Productivity Foundations',
  'Idő, energia, figyelem': 'Time, Energy, Attention',
  'Célkitűzés': 'Goal Hierarchy',
  'Célok': 'Goal Hierarchy',
  'Szokások és rendszerek': 'Habits vs Systems',
  'Mérés': 'Measurement & Metrics',
  'Rögzítés': 'Capture & GTD',
  'Kontextus váltás': 'Context Switching',
  'Kontextusváltás': 'Context Switching',
  'Delegálás': 'Delegation',
  'Energia kezelés': 'Energy Management',
  'Fejlett stratégiák': 'Advanced Strategies',
  'Integráció': 'Integration & Synthesis',
  'Munkahelyi alkalmazás': 'Workplace Application',
  'Csapatmunka': 'Team Dynamics',
  'Digitális eszközök': 'Digital Tools',
  'Kommunikáció': 'Communication',
  'Stressz kezelés': 'Stress Management',
  'Tanulási rendszerek': 'Learning Systems',
  'Személyes fejlesztés': 'Personal Development',
  'Döntéshozatal': 'Decision Making',
  'Folyamatos fejlesztés': 'Continuous Improvement',
  'Termelékenységi Mester': 'Productivity Foundations',
  'Elkötelezettség': 'Personal Development',
  'Komunitas': 'Team Dynamics',
  'Értékek': 'Personal Development',
  'Tervezés': 'Goal Hierarchy',
  'Felelősségvállalás': 'Personal Development',
  
  // Turkish
  'Verimlilik': 'Productivity Foundations',
  'Verimlilik Ustası': 'Productivity Foundations',
  'Bağlam Değiştirme': 'Context Switching',
  'Hedef Belirleme': 'Goal Hierarchy',
  'Planlama': 'Goal Hierarchy',
  'Ölçüm': 'Measurement & Metrics',
  'Entegrasyon': 'Integration & Synthesis',
  'Taahhüt': 'Personal Development',
  
  // Bulgarian
  'Майстор на Производителността': 'Productivity Foundations',
  'Интеграция': 'Integration & Synthesis',
  'Ангажиране': 'Personal Development',
  
  // Polish
  'Mistrz Produktywności': 'Productivity Foundations',
  'Integracja': 'Integration & Synthesis',
  'Zaangażowanie': 'Personal Development',
  
  // Vietnamese
  'Bậc Thầy Năng Suất': 'Productivity Foundations',
  'Tích Hợp': 'Integration & Synthesis',
  'Cam Kết': 'Personal Development',
  
  // Indonesian
  'Master Produktivitas': 'Productivity Foundations',
  'Integrasi': 'Integration & Synthesis',
  'Komitmen': 'Personal Development',
  
  // Arabic
  'سيد الإنتاجية': 'Productivity Foundations',
  'التكامل': 'Integration & Synthesis',
  'الالتزام': 'Personal Development',
  
  // Portuguese
  'Mestre de Produtividade': 'Productivity Foundations',
  'Integração': 'Integration & Synthesis',
  'Compromisso': 'Personal Development',
  
  // Hindi
  'उत्पादकता का मास्टर': 'Productivity Foundations',
  'एकीकरण': 'Integration & Synthesis',
  'प्रतिबद्धता': 'Personal Development',
  
  // Add more language mappings as needed
};

const scriptsDir = resolve(process.cwd(), 'scripts');

async function fixCategories() {
  console.log('🔧 Fixing quiz categories in all seed scripts...\n');

  // Find all seed-day*-enhanced.ts files
  const files = await glob('seed-day*-enhanced.ts', { cwd: scriptsDir });
  
  console.log(`📋 Found ${files.length} files to process\n`);

  let totalFixed = 0;

  for (const filename of files) {
    const filePath = resolve(scriptsDir, filename);
    
    try {
      let content = readFileSync(filePath, 'utf-8');
      let modified = false;
      let fileFixed = 0;

      // Find and replace all category values
      for (const [translated, english] of Object.entries(categoryMap)) {
        // Match category: "translated" or category: 'translated'
        const patterns = [
          new RegExp(`category:\\s*["']${translated.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'g'),
          new RegExp(`category:\\s*["']${translated.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'g'),
        ];

        for (const pattern of patterns) {
          if (pattern.test(content)) {
            content = content.replace(pattern, `category: "${english}"`);
            modified = true;
            fileFixed++;
          }
        }
      }

      if (modified) {
        writeFileSync(filePath, content, 'utf-8');
        console.log(`   ✅ Fixed ${fileFixed} categories in ${filename}`);
        totalFixed += fileFixed;
      } else {
        console.log(`   ⚠️  No changes needed: ${filename}`);
      }
    } catch (error) {
      console.error(`   ❌ Error fixing ${filename}:`, error);
    }
  }

  console.log(`\n✅ Fixed ${totalFixed} category values across ${files.length} files`);
}

fixCategories().catch(console.error);
