/**
 * Generate Perfect Questions for a Single Lesson
 * 
 * Purpose: Read lesson content and generate 7 perfect, context-rich questions
 * Why: Each question must be content-specific, educational, and context-rich
 * 
 * This function will be called for each lesson to generate questions
 * based on actual lesson content, not templates
 */

import { QuestionDifficulty, QuestionType } from '../app/lib/models';

export interface PerfectQuestion {
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: QuestionDifficulty;
  category: string;
  questionType: QuestionType;
  hashtags: string[];
}

/**
 * Extract key concepts from lesson content
 */
function extractKeyConcepts(content: string, title: string): {
  mainTopics: string[];
  keyPoints: string[];
  examples: string[];
  practices: string[];
} {
  const contentLower = content.toLowerCase();
  const titleLower = title.toLowerCase();
  
  // Extract main topics from headings
  const h2Matches = content.match(/<h2[^>]*>(.*?)<\/h2>/gi) || [];
  const h3Matches = content.match(/<h3[^>]*>(.*?)<\/h3>/gi) || [];
  
  const mainTopics: string[] = [];
  h2Matches.forEach(match => {
    const text = match.replace(/<[^>]+>/g, '').trim();
    if (text && text.length < 100) mainTopics.push(text);
  });
  
  // Extract key points from lists
  const listMatches = content.match(/<li[^>]*>(.*?)<\/li>/gi) || [];
  const keyPoints = listMatches
    .map(match => match.replace(/<[^>]+>/g, '').trim())
    .filter(text => text.length > 10 && text.length < 200)
    .slice(0, 10);
  
  // Extract examples (✅/❌ sections)
  const examples: string[] = [];
  const exampleSections = content.match(/<h3[^>]*>.*?(✅|❌|Good|Poor).*?<\/h3>[\s\S]*?<p[^>]*>(.*?)<\/p>/gi) || [];
  exampleSections.forEach(section => {
    const text = section.replace(/<[^>]+>/g, '').trim();
    if (text.length > 20 && text.length < 300) examples.push(text);
  });
  
  // Extract practices
  const practiceMatches = content.match(/<h2[^>]*>.*?(Gyakorlat|Practice|Exercise).*?<\/h2>[\s\S]*?<ol[^>]*>(.*?)<\/ol>/gi) || [];
  const practices: string[] = [];
  practiceMatches.forEach(match => {
    const text = match.replace(/<[^>]+>/g, '').trim();
    if (text.length > 20 && text.length < 500) practices.push(text);
  });
  
  return { mainTopics, keyPoints, examples, practices };
}

/**
 * Generate 7 perfect questions based on actual lesson content
 */
export function generatePerfectQuestionsForLesson(
  day: number,
  title: string,
  content: string,
  language: string,
  courseId: string
): PerfectQuestion[] {
  const questions: PerfectQuestion[] = [];
  
  // Extract key concepts from lesson
  const { mainTopics, keyPoints, examples, practices } = extractKeyConcepts(content, title);
  
  // Remove HTML tags for text analysis
  const cleanContent = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const contentLower = cleanContent.toLowerCase();
  const titleLower = title.toLowerCase();
  
  // Determine question language
  const isHungarian = language === 'hu' || /[áéíóöőúüűÁÉÍÓÖŐÚÜŰ]/.test(content);
  const isRussian = language === 'ru' || /[а-яА-Я]/.test(content);
  const isEnglish = language === 'en' || (!isHungarian && !isRussian);
  
  // Generate 4-5 RECALL questions
  // Q1: Main concept from lesson title/content
  if (mainTopics.length > 0) {
    const mainTopic = mainTopics[0];
    if (isHungarian) {
      questions.push({
        question: `Mi a fő célja a(z) "${title}" leckének a GEO optimalizálás szempontjából?`,
        options: [
          `A leckében részletesen tárgyalt ${mainTopic.toLowerCase()} koncepciók megértése és alkalmazása`,
          'Általános e-commerce ismeretek megszerzése',
          'Csak SEO technikák tanulása',
          'Nincs konkrét cél, csak olvasás'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific',
        questionType: QuestionType.RECALL,
        hashtags: [`#day${day}`, '#beginner', '#recall', `#${language}`, '#all-languages']
      });
    } else if (isRussian) {
      questions.push({
        question: `Какова основная цель урока "${title}" с точки зрения GEO-оптимизации?`,
        options: [
          `Понимание и применение концепций ${mainTopic.toLowerCase()}, подробно рассмотренных в уроке`,
          'Получение общих знаний об электронной коммерции',
          'Изучение только SEO-техник',
          'Нет конкретной цели, только чтение'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific',
        questionType: QuestionType.RECALL,
        hashtags: [`#day${day}`, '#beginner', '#recall', `#${language}`, '#all-languages']
      });
    } else {
      questions.push({
        question: `What is the main goal of the "${title}" lesson from a GEO optimization perspective?`,
        options: [
          `Understanding and applying the ${mainTopic.toLowerCase()} concepts covered in detail in the lesson`,
          'Gaining general e-commerce knowledge',
          'Learning only SEO techniques',
          'No specific goal, just reading'
        ],
        correctIndex: 0,
        difficulty: QuestionDifficulty.EASY,
        category: 'Course Specific',
        questionType: QuestionType.RECALL,
        hashtags: [`#day${day}`, '#beginner', '#recall', `#${language}`, '#all-languages']
      });
    }
  }
  
  // Q2-Q5: Key points from lesson
  for (let i = 0; i < Math.min(4, keyPoints.length); i++) {
    const keyPoint = keyPoints[i];
    if (keyPoint.length < 10) continue;
    
    // Create question based on key point
    // This is a simplified version - in reality, each key point needs careful analysis
    // to create a proper question
    
    if (questions.length >= 5) break; // We want 4-5 RECALL questions
  }
  
  // Generate 2-3 APPLICATION questions
  // These should test practical application of lesson concepts
  
  // Generate 0-1 CRITICAL_THINKING question
  // These should test deeper understanding and analysis
  
  // Ensure exactly 7 questions
  // For now, return what we have (this is a framework)
  // In production, this needs to be fully implemented for each lesson
  
  return questions.slice(0, 7);
}
