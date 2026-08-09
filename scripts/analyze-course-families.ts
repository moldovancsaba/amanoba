import connectDB from '../app/lib/mongodb';
import { Course, CCS } from '../app/lib/models';

(async () => {
  await connectDB();

  console.log('='.repeat(70));
  console.log('Course Family Analysis');
  console.log('='.repeat(70));

  // Get all courses
  const courses = await Course.find({}).select('courseId name language ccsId metadata prerequisiteCourseIds courseVariant').lean();
  
  console.log(`\nTotal Courses: ${courses.length}\n`);

  // Group by CCS
  const byCCS = courses.reduce((acc, course) => {
    const ccs = course.ccsId || 'NO_CCS';
    if (!acc[ccs]) acc[ccs] = [];
    acc[ccs].push(course);
    return acc;
  }, {} as Record<string, any[]>);

  // Analyze each CCS
  for (const [ccsId, coursesInFamily] of Object.entries(byCCS)) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`CCS: ${ccsId}`);
    console.log(`Courses: ${coursesInFamily.length}`);
    console.log(`${'='.repeat(70)}`);

    // Group by language
    const byLanguage = coursesInFamily.reduce((acc, course) => {
      const lang = course.language || 'unknown';
      if (!acc[lang]) acc[lang] = [];
      acc[lang].push(course);
      return acc;
    }, {} as Record<string, any[]>);

    // Show structure
    for (const [lang, coursesInLang] of Object.entries(byLanguage)) {
      console.log(`\n  Language: ${lang}`);
      
      for (const course of coursesInLang) {
        console.log(`    • ${course.courseId}`);
        console.log(`      Name: ${course.name}`);
        console.log(`      Variant: ${course.courseVariant || 'none'}`);
        console.log(`      Difficulty: ${course.metadata?.difficulty || 'none'}`);
        console.log(`      Prerequisites: ${course.prerequisiteCourseIds?.length || 0}`);
      }
    }

    // Identify potential levels
    console.log(`\n  Potential Level Structure:`);
    
    const levelIndicators = coursesInFamily.map(c => {
      const idLower = c.courseId.toLowerCase();
      let levelHint = 'unknown';
      
      if (idLower.includes('1day') || idLower.includes('dummies')) levelHint = 'Level 1 (Beginner)';
      else if (idLower.includes('3day') || idLower.includes('essentials')) levelHint = 'Level 2 (Intermediate)';
      else if (idLower.includes('7day') || idLower.includes('intermediate')) levelHint = 'Level 2 (Intermediate)';
      else if (idLower.includes('30day') || idLower.includes('advanced')) levelHint = 'Level 3 (Advanced)';
      else if (c.metadata?.difficulty === 'beginner') levelHint = 'Level 1 (Beginner)';
      else if (c.metadata?.difficulty === 'intermediate') levelHint = 'Level 2 (Intermediate)';
      else if (c.metadata?.difficulty === 'advanced') levelHint = 'Level 3 (Advanced)';
      
      return { courseId: c.courseId, level: levelHint, lang: c.language };
    });

    // Group by level hint
    const byLevel = levelIndicators.reduce((acc, item) => {
      if (!acc[item.level]) acc[item.level] = [];
      acc[item.level].push(item);
      return acc;
    }, {} as Record<string, any[]>);

    for (const [level, courses] of Object.entries(byLevel)) {
      console.log(`    ${level}:`);
      for (const c of courses) {
        console.log(`      - ${c.courseId} (${c.lang})`);
      }
    }
  }

  console.log(`\n${'='.repeat(70)}`);
  console.log('Analysis Complete');
  console.log(`${'='.repeat(70)}\n`);

  process.exit(0);
})();
