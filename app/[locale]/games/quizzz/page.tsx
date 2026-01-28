'use client';

/**
 * QUIZZZ Game Page
 * 
 * Why: Trivia quiz game testing knowledge with gamification rewards
 * What: Simplified quiz game that integrates with session API and awards points/XP
 */

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LocaleLink } from '@/components/LocaleLink';

type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';

interface Question {
  id: string;
  question: string;
  options: string[];
  difficulty: string;
  category: string;
}

interface QuestionWithAnswer extends Question {
  correctIndex: number;
}

interface DifficultyConfig {
  timePerQuestion: number; // seconds
  questionCount: number;
  minCorrect: number; // to win
  pointsMultiplier: number;
  requiredLevel: number;
  isPremium: boolean;
}

// Why: Difficulty configurations for balanced progression
const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  EASY: {
    timePerQuestion: 15,
    questionCount: 5,
    minCorrect: 3,
    pointsMultiplier: 1,
    requiredLevel: 1,
    isPremium: false,
  },
  MEDIUM: {
    timePerQuestion: 12,
    questionCount: 8,
    minCorrect: 5,
    pointsMultiplier: 1.5,
    requiredLevel: 1,
    isPremium: false,
  },
  HARD: {
    timePerQuestion: 10,
    questionCount: 10,
    minCorrect: 7,
    pointsMultiplier: 2,
    requiredLevel: 5,
    isPremium: false,
  },
  EXPERT: {
    timePerQuestion: 8,
    questionCount: 15,
    minCorrect: 12,
    pointsMultiplier: 3,
    requiredLevel: 10,
    isPremium: true,
  },
};

// Why: Question count per difficulty level
const QUESTION_COUNTS: Record<Difficulty, number> = {
  EASY: 10,
  MEDIUM: 10,
  HARD: 10,
  EXPERT: 15,
};

// Why: Removed hardcoded questions - now fetched from database via API
// See: GET /api/games/quizzz/questions
// OLD: const ALL_QUESTIONS = [...] (40 hardcoded questions)
// NEW: Questions fetched dynamically from MongoDB with intelligent selection

export default function QuizzzGame() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'finished'>('ready');
  const [difficulty, setDifficulty] = useState<Difficulty>('MEDIUM');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionsWithAnswers, setQuestionsWithAnswers] = useState<QuestionWithAnswer[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [correctQuestionIds, setCorrectQuestionIds] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [rewards, setRewards] = useState<{
    xp: number;
    points: number;
  } | null>(null);
  const [progression, setProgression] = useState<{
    levelsGained: number;
    newLevel: number;
    newTitle?: string;
  } | null>(null);
  const [achievements, setAchievements] = useState<Array<{
    name: string;
    tier: string;
    rewards: { points: number; xp: number };
  }>>([]);
  const [completedChallenges, setCompletedChallenges] = useState<Array<{
    title: string;
    rewardsEarned: { points: number; xp: number };
  }>>([]);
  const [playerLevel, setPlayerLevel] = useState(1);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);

  // Why: Fetch questions from database API with intelligent selection
  const fetchQuestions = async (diff: Difficulty): Promise<{ questions: Question[], answers: QuestionWithAnswer[] } | null> => {
    setIsLoadingQuestions(true);
    setFetchError(null);

    try {
      const count = QUESTION_COUNTS[diff];
      
      // Generate unique runId for this game (for variance and debugging)
      const runId = (globalThis.crypto?.randomUUID?.() || `${Date.now()}_${Math.random()}`).toString();

      // Why: Track ALL seen questions for this difficulty, not just last game
      // Reset only when pool is exhausted to ensure no repeats until all questions seen
      const seenKey = `quizzz:seenIds:${diff}`;
      const seenIdsRaw = sessionStorage.getItem(seenKey);
      let seenIds: string[] = seenIdsRaw ? JSON.parse(seenIdsRaw) : [];
      const excludeParam = seenIds.slice(0, 200).join(','); // Limit to 200 for URL safety
      
      // Why: NO CACHING + exclude + runId
      const url = `/api/games/quizzz/questions?difficulty=${diff}&count=${count}&runId=${encodeURIComponent(runId)}${excludeParam ? `&exclude=${encodeURIComponent(excludeParam)}` : ''}&t=${Date.now()}`;

      const response = await fetch(
        url,
        {
          cache: 'no-store', // Prevent Next.js caching
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch questions: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.ok || !data.data?.questions) {
        throw new Error('Invalid response format');
      }

      const apiQuestions: Question[] = data.data.questions;

      // Why: Accumulate ALL seen question IDs for this difficulty
      // If we got fewer questions than requested, pool is exhausted - reset the seen list
      try {
        const seenKey = `quizzz:seenIds:${diff}`;
        const newIds = apiQuestions.map(q => q.id);
        
        // Why: If API returned fewer questions than requested, we've exhausted the pool
        // Reset seen list so questions can repeat on next game
        if (apiQuestions.length < count) {
          if (process.env.NODE_ENV === 'development') console.log(`⚠️ Pool exhausted for ${diff} - got ${apiQuestions.length}/${count} questions. Resetting seen list.`);
          sessionStorage.setItem(seenKey, JSON.stringify(newIds));
        } else {
          // Why: Add new questions to accumulated seen list
          const updated = [...new Set([...seenIds, ...newIds])];
          sessionStorage.setItem(seenKey, JSON.stringify(updated));
          if (process.env.NODE_ENV === 'development') console.log(`✅ Tracking ${updated.length} total seen questions for ${diff}`);
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') console.warn('Failed to update seen questions:', err);
      }

      // Why: Fetch correct answers separately (security: not in main response)
      const answersResponse = await fetch(
        `/api/games/quizzz/questions/answers?ids=${apiQuestions.map(q => q.id).join(',')}&t=${Date.now()}`,
        {
          cache: 'no-store', // Prevent Next.js caching
        }
      );
      
      let questionsWithAnswers: QuestionWithAnswer[];
      
      if (answersResponse.ok) {
        const answersData = await answersResponse.json();
        questionsWithAnswers = apiQuestions.map((q, idx) => ({
          ...q,
          correctIndex: answersData.data.answers[idx].correctIndex,
        }));
      } else {
        // Why: Fallback - generate random correct answers (for development)
        if (process.env.NODE_ENV === 'development') console.warn('Could not fetch answers, using random fallback');
        questionsWithAnswers = apiQuestions.map(q => ({
          ...q,
          correctIndex: Math.floor(Math.random() * 4),
        }));
      }

      // Why: NO CACHING - This ensures fresh random questions every game
      setIsLoadingQuestions(false);
      return { questions: apiQuestions, answers: questionsWithAnswers };

    } catch (error) {
      console.error('🚨 API FETCH FAILED - Questions could not be loaded from database:', error);
      setIsLoadingQuestions(false);
      
      // Log the exact error details for debugging
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      
      setFetchError(`Failed to load questions from database: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
      
      // FALLBACK REMOVED - We need to fix the API, not hide the problem
      /*try {
        // Why: Emergency fallback questions (only if API completely fails)
        const fallbackPool: Record<Difficulty, QuestionWithAnswer[]> = {
          EASY: [
            { id: 'e1', question: 'What is 2 + 2?', options: ['3','4','5','6'], correctIndex: 1, difficulty: 'EASY', category: 'Math' },
            { id: 'e2', question: 'What color is the sky on a clear day?', options: ['Green','Blue','Red','Yellow'], correctIndex: 1, difficulty: 'EASY', category: 'General Knowledge' },
            { id: 'e3', question: 'How many days are in a week?', options: ['5','6','7','8'], correctIndex: 2, difficulty: 'EASY', category: 'General Knowledge' },
            { id: 'e4', question: 'Which animal says "meow"?', options: ['Dog','Cat','Cow','Bird'], correctIndex: 1, difficulty: 'EASY', category: 'General Knowledge' },
            { id: 'e5', question: 'What is the capital of France?', options: ['London','Berlin','Paris','Madrid'], correctIndex: 2, difficulty: 'EASY', category: 'Geography' },
            { id: 'e6', question: 'What is 5 × 3?', options: ['12','15','18','20'], correctIndex: 1, difficulty: 'EASY', category: 'Math' },
            { id: 'e7', question: 'What is 10 ÷ 2?', options: ['3','4','5','6'], correctIndex: 2, difficulty: 'EASY', category: 'Math' },
            { id: 'e8', question: 'How many sides does a triangle have?', options: ['2','3','4','5'], correctIndex: 1, difficulty: 'EASY', category: 'Math' },
            { id: 'e9', question: 'What is 100 - 50?', options: ['40','45','50','55'], correctIndex: 2, difficulty: 'EASY', category: 'Math' },
            { id: 'e10', question: 'What is half of 20?', options: ['5','8','10','15'], correctIndex: 2, difficulty: 'EASY', category: 'Math' },
          ],
          MEDIUM: [
            { id: 'm1', question: 'What is 7 × 8?', options: ['54','56','63','72'], correctIndex: 1, difficulty: 'MEDIUM', category: 'Math' },
            { id: 'm2', question: 'Who painted the Mona Lisa?', options: ['Michelangelo','Leonardo da Vinci','Raphael','Donatello'], correctIndex: 1, difficulty: 'MEDIUM', category: 'Arts & Literature' },
            { id: 'm3', question: 'Largest ocean on Earth?', options: ['Atlantic','Indian','Arctic','Pacific'], correctIndex: 3, difficulty: 'MEDIUM', category: 'Geography' },
            { id: 'm4', question: 'Chemical symbol for gold?', options: ['Go','Gd','Au','Ag'], correctIndex: 2, difficulty: 'MEDIUM', category: 'Science' },
            { id: 'm5', question: 'Square root of 64?', options: ['6','7','8','9'], correctIndex: 2, difficulty: 'MEDIUM', category: 'Math' },
            { id: 'm6', question: 'What is 15% of 200?', options: ['20','25','30','35'], correctIndex: 2, difficulty: 'MEDIUM', category: 'Math' },
            { id: 'm7', question: 'Who wrote 1984?', options: ['Aldous Huxley','George Orwell','Ray Bradbury','Kurt Vonnegut'], correctIndex: 1, difficulty: 'MEDIUM', category: 'Arts & Literature' },
            { id: 'm8', question: 'What is the capital of Australia?', options: ['Sydney','Melbourne','Canberra','Brisbane'], correctIndex: 2, difficulty: 'MEDIUM', category: 'Geography' },
            { id: 'm9', question: 'How many bones in human body?', options: ['186','206','226','246'], correctIndex: 1, difficulty: 'MEDIUM', category: 'Science' },
            { id: 'm10', question: 'Who founded Microsoft?', options: ['Steve Jobs','Bill Gates','Mark Zuckerberg','Larry Page'], correctIndex: 1, difficulty: 'MEDIUM', category: 'Technology' },
          ],
          HARD: [
            { id: 'h1', question: 'What is the speed of light (approx)?', options: ['299,792 km/s','300,000 km/s','299,792,458 m/s','Both A and C'], correctIndex: 3, difficulty: 'HARD', category: 'Science' },
            { id: 'h2', question: 'Atomic number 79 element?', options: ['Silver','Gold','Platinum','Mercury'], correctIndex: 1, difficulty: 'HARD', category: 'Science' },
            { id: 'h3', question: 'Year Declaration of Independence signed?', options: ['1774','1775','1776','1777'], correctIndex: 2, difficulty: 'HARD', category: 'History' },
            { id: 'h4', question: 'Capital of Kazakhstan?', options: ['Almaty','Astana (Nur-Sultan)','Bishkek','Tashkent'], correctIndex: 1, difficulty: 'HARD', category: 'Geography' },
            { id: 'h5', question: 'Thus Spoke Zarathustra author?', options: ['Kant','Hegel','Nietzsche','Schopenhauer'], correctIndex: 2, difficulty: 'HARD', category: 'Arts & Literature' },
            { id: 'h6', question: 'Who discovered penicillin?', options: ['Louis Pasteur','Alexander Fleming','Marie Curie','Jonas Salk'], correctIndex: 1, difficulty: 'HARD', category: 'Science' },
            { id: 'h7', question: 'What is the pH of pure water?', options: ['6','7','8','Depends'], correctIndex: 1, difficulty: 'HARD', category: 'Science' },
            { id: 'h8', question: 'Who was last Tsar of Russia?', options: ['Alexander III','Nicholas II','Peter the Great','Ivan'], correctIndex: 1, difficulty: 'HARD', category: 'History' },
            { id: 'h9', question: 'Deepest point in ocean?', options: ['Puerto Rico Trench','Java Trench','Mariana Trench','Philippine Trench'], correctIndex: 2, difficulty: 'HARD', category: 'Geography' },
            { id: 'h10', question: 'What is smallest prime?', options: ['0','1','2','3'], correctIndex: 2, difficulty: 'HARD', category: 'Math' },
            { id: 'h11', question: 'What does SQL stand for?', options: ['Structured Query Language','Standard Query Language','Structured Question Language','Standard Question Language'], correctIndex: 0, difficulty: 'HARD', category: 'Technology' },
            { id: 'h12', question: 'Who invented WWW?', options: ['Bill Gates','Tim Berners-Lee','Steve Jobs','Vint Cerf'], correctIndex: 1, difficulty: 'HARD', category: 'Technology' },
            { id: 'h13', question: 'First iPhone year?', options: ['2005','2006','2007','2008'], correctIndex: 2, difficulty: 'HARD', category: 'Technology' },
            { id: 'h14', question: 'Who wrote The Odyssey?', options: ['Virgil','Homer','Ovid','Sophocles'], correctIndex: 1, difficulty: 'HARD', category: 'Arts & Literature' },
            { id: 'h15', question: 'Which composer became deaf?', options: ['Mozart','Bach','Beethoven','Chopin'], correctIndex: 2, difficulty: 'HARD', category: 'Arts & Literature' },
          ],
          EXPERT: [
            { id: 'x1', question: 'Planck\'s constant (approx)?', options: ['6.626 × 10⁻³⁴ J⋅s','1.616 × 10⁻³⁵ m','1.055 × 10⁻³⁴ J⋅s','9.109 × 10⁻³¹ kg'], correctIndex: 0, difficulty: 'EXPERT', category: 'Science' },
            { id: 'x2', question: 'Theorem relating primes to complex analysis?', options: ['Fermat\'s Last Theorem','Riemann Hypothesis','Gödel\'s Incompleteness','Prime Number Theorem'], correctIndex: 3, difficulty: 'EXPERT', category: 'Math' },
            { id: 'x3', question: 'Half-life of Carbon-14?', options: ['5,730 years','10,000 years','1,200 years','50,000 years'], correctIndex: 0, difficulty: 'EXPERT', category: 'Science' },
            { id: 'x4', question: 'Who proved Four Color Theorem?', options: ['Appel & Haken','Wiles','Perelman','Tao'], correctIndex: 0, difficulty: 'EXPERT', category: 'Math' },
            { id: 'x5', question: 'Avogadro constant?', options: ['6.022 × 10²³','6.626 × 10⁻³⁴','1.616 × 10⁻³⁵','8.314 J/(mol·K)'], correctIndex: 0, difficulty: 'EXPERT', category: 'Science' },
            { id: 'x6', question: 'Schwarzschild radius formula?', options: ['2GM/c²','GM/c²','GM/2c²','G²M/c²'], correctIndex: 0, difficulty: 'EXPERT', category: 'Math' },
            { id: 'x7', question: 'Euler\'s identity?', options: ['e^(iπ) + 1 = 0','e^(iπ) = -1','Both A and B','e^π = -1'], correctIndex: 2, difficulty: 'EXPERT', category: 'Math' },
            { id: 'x8', question: 'Kolmogorov complexity measures?', options: ['Time','Space','Description length','Entropy'], correctIndex: 2, difficulty: 'EXPERT', category: 'Math' },
            { id: 'x9', question: 'Prime Number Theorem relates to?', options: ['Fermat','Riemann','Gödel','Prime distribution'], correctIndex: 3, difficulty: 'EXPERT', category: 'Math' },
            { id: 'x10', question: 'Integral of 1/x?', options: ['x²/2','ln|x| + C','1/x²','e^x + C'], correctIndex: 1, difficulty: 'EXPERT', category: 'Math' },
            { id: 'x11', question: 'Helicase function in DNA?', options: ['Joins','Copies','Unwinds','Seals'], correctIndex: 2, difficulty: 'EXPERT', category: 'Science' },
            { id: 'x12', question: 'Photon is force carrier for?', options: ['Gravity','Electromagnetism','Strong','Weak'], correctIndex: 1, difficulty: 'EXPERT', category: 'Science' },
            { id: 'x13', question: 'Byzantine Empire capital?', options: ['Athens','Constantinople','Rome','Alexandria'], correctIndex: 1, difficulty: 'EXPERT', category: 'History' },
            { id: 'x14', question: 'Treaty ending WWI?', options: ['Versailles','Paris','Vienna','Westphalia'], correctIndex: 0, difficulty: 'EXPERT', category: 'History' },
            { id: 'x15', question: 'First Holy Roman Emperor?', options: ['Otto I','Charlemagne','Frederick I','Henry II'], correctIndex: 1, difficulty: 'EXPERT', category: 'History' },
            { id: 'x16', question: 'Haskell paradigm?', options: ['OOP','Procedural','Functional','Logic'], correctIndex: 2, difficulty: 'EXPERT', category: 'Technology' },
            { id: 'x17', question: 'QuickSort avg complexity?', options: ['O(n)','O(n log n)','O(n²)','O(log n)'], correctIndex: 1, difficulty: 'EXPERT', category: 'Technology' },
            { id: 'x18', question: 'ACID in databases means?', options: ['Atomicity, Consistency, Isolation, Durability','Availability, Consistency, Integrity, Durability','Atomicity, Centralization, Isolation, Data','Availability, Coordination, Integrity, Distribution'], correctIndex: 0, difficulty: 'EXPERT', category: 'Technology' },
            { id: 'x19', question: 'Who created Linux?', options: ['Richard Stallman','Linus Torvalds','Dennis Ritchie','Ken Thompson'], correctIndex: 1, difficulty: 'EXPERT', category: 'Technology' },
            { id: 'x20', question: 'Language of Divine Comedy?', options: ['Latin','Italian','Greek','French'], correctIndex: 1, difficulty: 'EXPERT', category: 'Arts & Literature' },
          ],
        };

        const targetCount = QUESTION_COUNTS[diff];
        const pool = fallbackPool[diff];
        
        // Why: NEVER REPEAT - Only use available unique questions
        const availableCount = Math.min(pool.length, targetCount);
        
        // Why: Shuffle THEN slice to get random selection without duplicates
        const shuffledPool = [...pool];
        for (let i = shuffledPool.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledPool[i], shuffledPool[j]] = [shuffledPool[j], shuffledPool[i]];
        }
        
        const answers = shuffledPool.slice(0, availableCount);
        for (let i = answers.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [answers[i], answers[j]] = [answers[j], answers[i]];
        }
        
        // Why: Keep the same IDs so answer validation works correctly
        const apiQuestions: Question[] = answers.map(({ correctIndex, ...rest }) => ({ ...rest }));

      */
    }
  };

  // Why: Timer effect for countdown per question
  useEffect(() => {
    if (gameState !== 'playing' || selectedAnswer !== null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time's up - auto select wrong answer
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, selectedAnswer, timeLeft]);

  // Why: Handle time up scenario
  const handleTimeUp = () => {
    setShowFeedback(true);
    // Auto-advance after showing time's up feedback
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setTimeLeft(DIFFICULTY_CONFIGS[difficulty].timePerQuestion);
      } else {
        finishGame();
      }
    }, 1500);
  };

  // Why: Start game session when player clicks play
  const startGame = async () => {
    if (!session?.user) {
      console.error('Cannot start game without authentication');
      router.push('/auth/signin');
      return;
    }

    // Why: Fetch questions from database
    const result = await fetchQuestions(difficulty);
    
    if (!result) {
      setFetchError('Could not load questions. Please try again.');
      return;
    }

    const { questions: apiQuestions, answers } = result;
    setQuestions(apiQuestions);
    setQuestionsWithAnswers(answers);
    setCorrectQuestionIds([]);
    setTimeLeft(DIFFICULTY_CONFIGS[difficulty].timePerQuestion);
    setGameState('playing');
    setStartTime(Date.now());

    // Why: Start backend session to track progress and award rewards
    try {
      const playerId = (session.user as { id: string }).id;
      if (process.env.NODE_ENV === 'development') console.log('Starting game session...', { playerId, gameId: 'quizzz', difficulty });

      const response = await fetch('/api/game-sessions/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId,
          gameId: 'quizzz',
          difficulty,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSessionId(data.sessionId);
        if (process.env.NODE_ENV === 'development') console.log('✅ Game session started:', data.sessionId);
      } else {
        const errorText = await response.text();
        console.error('❌ Failed to start game session:', response.status, errorText);
        console.error('This means game results will NOT be recorded!');
      }
    } catch (error) {
      console.error('❌ Failed to start game session:', error);
      console.error('This means game results will NOT be recorded!');
    }
  };

  // Why: Handle answer selection and provide immediate feedback
  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return; // Already answered

    setSelectedAnswer(index);
    setShowFeedback(true);

    const currentQ = questionsWithAnswers[currentQuestion];
    if (index === currentQ.correctIndex) {
      setScore(score + 1);
      // Why: Track correctly answered question IDs for API tracking
      setCorrectQuestionIds(prev => [...prev, questions[currentQuestion].id]);
    }

    // Why: Auto-advance to next question after feedback
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setTimeLeft(DIFFICULTY_CONFIGS[difficulty].timePerQuestion);
      } else {
        finishGame();
      }
    }, 1500);
  };

  // Why: Complete game session and award rewards
  const finishGame = async () => {
    setGameState('finished');
    const duration = Math.floor((Date.now() - startTime) / 1000);
    const accuracy = Math.round((score / questions.length) * 100);
    const config = DIFFICULTY_CONFIGS[difficulty];
    const isWin = score >= config.minCorrect;

    // Why: Track question statistics (showCount already incremented on fetch)
    // Now increment correctCount for correctly answered questions
    try {
      await fetch('/api/games/quizzz/questions/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionIds: questions.map(q => q.id),
          correctAnswers: correctQuestionIds,
        }),
      });
      if (process.env.NODE_ENV === 'development') console.log(`Tracked ${correctQuestionIds.length}/${questions.length} correct answers`);
    } catch (error) {
      console.error('Failed to track question stats:', error);
    }

    // Why: Complete backend session and award real rewards
    if (!sessionId) {
      console.error('❌ CRITICAL: No session ID found - session start must have failed!');
      console.error('Game played but NOT RECORDED: score=' + score + ', isWin=' + isWin);
      console.error('This means: NO points, NO XP, NO challenge progress, NO leaderboard');
      // Don't return - at least show the game ended, even without rewards
    }

    if (sessionId) {
      try {
        setIsCompleting(true);
        const finalScore = Math.round(score * 100 * config.pointsMultiplier);
        if (process.env.NODE_ENV === 'development') console.log('Completing session...', { sessionId, score, finalScore, isWin, duration, accuracy });
        
        const response = await fetch('/api/game-sessions/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            score: finalScore,
            isWin,
            duration,
            accuracy,
          }),
        });

        if (process.env.NODE_ENV === 'development') console.log('📡 Complete API response status:', response.status, response.statusText);

        if (response.ok) {
          const data = await response.json();
          if (process.env.NODE_ENV === 'development') console.log('✅ Game session completed with rewards:', data);
          setRewards(data.rewards);
          setProgression(data.progression);
          setAchievements(data.achievements?.achievements || []);

          // Fetch updated challenges to reflect progress immediately
          try {
            const playerId = (session?.user as { id: string })?.id;
            if (playerId) {
              const challengesRes = await fetch(`/api/challenges?playerId=${playerId}&t=${Date.now()}`, { cache: 'no-store' });
              if (challengesRes.ok) {
                const ch = await challengesRes.json();
                const completed = (ch.challenges || []).filter((c: any) => c.isCompleted).map((c: any) => ({
                  title: c.name,
                  rewardsEarned: { points: c.rewards?.points || 0, xp: c.rewards?.xp || 0 },
                }));
                setCompletedChallenges(completed);
              }
            }
          } catch (e) {
            if (process.env.NODE_ENV === 'development') console.warn('Failed to refresh challenges after completion', e);
          }
        } else {
          const errorText = await response.text();
          console.error('❌ Failed to complete game session:', response.status, errorText);
          console.error('Request payload was:', { sessionId, score: finalScore, isWin, duration, accuracy });
        }
      } catch (error) {
        console.error('❌ Exception completing session:', error);
      } finally {
        setIsCompleting(false);
      }
      }
  };

  // Why: Redirect to sign-in if not authenticated
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  // Why: Show error if question loading failed
  if (fetchError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Questions</h2>
          <p className="text-gray-600 mb-6">{fetchError}</p>
          <button
            onClick={() => {
              setFetchError(null);
              setGameState('ready');
            }}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push('/games')}
            className="mt-3 block w-full text-gray-700 hover:text-gray-900"
          >
            ← Back to Games
          </button>
        </div>
      </div>
    );
  }

  // Why: Render appropriate screen based on game state
  if (gameState === 'ready') {
    const config = DIFFICULTY_CONFIGS[difficulty];
    const canPlayDifficulty = !config.isPremium || isPremium;

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
          <div className="text-center">
            <div className="text-6xl mb-4">🧠</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">QUIZZZ</h1>
            <p className="text-xl text-gray-600 mb-8">
              Test your knowledge with rapid-fire trivia questions!
            </p>

            {/* Difficulty Selection */}
            <div className="mb-8">
              <h3 className="font-bold text-gray-900 mb-4">Select Difficulty:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(['EASY', 'MEDIUM', 'HARD', 'EXPERT'] as Difficulty[]).map(diff => {
                  const diffConfig = DIFFICULTY_CONFIGS[diff];
                  const isLocked = diffConfig.isPremium && !isPremium;
                  const isSelected = difficulty === diff;

                  return (
                    <button
                      key={diff}
                      onClick={() => !isLocked && setDifficulty(diff)}
                      disabled={isLocked}
                      className={`
                        p-4 rounded-xl font-bold transition-all transform hover:scale-105
                        ${isSelected
                          ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                        ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      {isLocked && '🔒 '}
                      {diff}
                      <div className="text-xs mt-1 opacity-80">
                        {diffConfig.questionCount}Q • {diffConfig.timePerQuestion}s
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-indigo-50 rounded-lg p-6 mb-8">
              <h3 className="font-bold text-gray-900 mb-4">How to Play:</h3>
              <ul className="text-left text-gray-700 space-y-2">
                <li>• Answer {config.questionCount} questions</li>
                <li>• Get {config.minCorrect} or more correct to win</li>
                <li>• {config.timePerQuestion} seconds per question</li>
                <li>• {config.pointsMultiplier}x points multiplier</li>
                <li>• Earn XP and unlock achievements!</li>
              </ul>
            </div>

            <button
              onClick={startGame}
              disabled={!canPlayDifficulty || isLoadingQuestions}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-12 py-4 rounded-xl font-bold text-xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingQuestions ? 'Loading Questions...' : 'Start Game 🚀'}
            </button>

            <button
              onClick={() => router.push('/games')}
              className="mt-4 text-gray-600 hover:text-gray-900 transition-colors block w-full"
            >
              ← Back to Games
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    if (questions.length === 0) return null;
    
    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const timePercent = (timeLeft / DIFFICULTY_CONFIGS[difficulty].timePerQuestion) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
        {/* Timer and Progress */}
        <div className="max-w-4xl mx-auto mb-4 space-y-2">
          {/* Timer Bar */}
          <div className="bg-white/20 rounded-full h-4 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                timeLeft <= 3 ? 'bg-red-500' : timeLeft <= 5 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${timePercent}%` }}
            />
          </div>
          <div className="flex justify-between text-white font-bold">
            <span>⏱️ {timeLeft}s</span>
            <span className="text-center">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span>Score: {score}</span>
          </div>
          {/* Progress bar */}
          <div className="bg-white/20 rounded-full h-2 overflow-hidden">
            <div
              className="bg-white h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {question.question}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(() => {
              // Why: Determine correct answer index from answers fetched separately
              const correctIndex = questionsWithAnswers.find(q => q.id === question.id)?.correctIndex ?? -1;
              return question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === correctIndex;
                const showResult = showFeedback && isSelected;

              let buttonClass = 'bg-gray-100 hover:bg-gray-200 text-gray-900';
              if (showResult && isCorrect) {
                buttonClass = 'bg-green-500 text-white';
              } else if (showResult && !isCorrect) {
                buttonClass = 'bg-red-500 text-white';
              } else if (isSelected) {
                buttonClass = 'bg-indigo-200 text-gray-900';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                  className={`
                    ${buttonClass}
                    p-6 rounded-xl font-medium text-lg text-left
                    transition-all transform hover:scale-105
                    disabled:cursor-not-allowed
                  `}
                >
                  {option}
                  {showResult && isCorrect && ' ✓'}
                  {showResult && isSelected && !isCorrect && ' ✗'}
                </button>
              );
            });
            })()}
          </div>

          {showFeedback && (
            <div className="mt-6 text-center">
              {timeLeft === 0 ? (
                <div className="text-2xl text-orange-600 font-bold">
                  Time&apos;s Up! ⏰
                </div>
              ) : (() => {
                  const correctIndex = questionsWithAnswers.find(q => q.id === question.id)?.correctIndex ?? -1;
                  return selectedAnswer === correctIndex;
                })() ? (
                <div className="text-2xl text-green-600 font-bold animate-bounce">
                  Correct! 🎉
                </div>
              ) : (
                <div className="text-2xl text-red-600 font-bold">
                  Incorrect 😔
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Finished state
  const config = DIFFICULTY_CONFIGS[difficulty];
  const isWin = score >= config.minCorrect;
  const accuracy = Math.round((score / questions.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <div className="text-center">
          <div className="text-6xl mb-4">{isWin ? '🏆' : '💪'}</div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {isWin ? 'You Won!' : 'Good Try!'}
          </h2>

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-3xl font-bold text-indigo-600">{score}/{questions.length}</div>
                <div className="text-gray-600">Correct</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">{accuracy}%</div>
                <div className="text-gray-600">Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-pink-600">{difficulty}</div>
                <div className="text-gray-600">Difficulty</div>
              </div>
            </div>
          </div>

          {/* Rewards & Progress Section (always visible) */}
          <div className="space-y-4 mb-6">
            {/* Main Rewards */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4 text-xl flex items-center gap-2">
                💰 Rewards Earned
                {isCompleting && <span className="text-sm text-gray-500">Calculating…</span>}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-indigo-600">
                    {rewards ? `+${rewards.points || 0}` : '—'}
                  </div>
                  <div className="text-gray-600">💎 Points</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {rewards ? `+${rewards.xp || 0}` : '—'}
                  </div>
                  <div className="text-gray-600">⭐ XP</div>
                </div>
              </div>
            </div>

            {/* Level Up */}
            {progression && progression.levelsGained > 0 && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
                <div className="text-center">
                  <div className="text-5xl mb-2">🎉</div>
                  <h3 className="font-bold text-green-700 text-2xl mb-2">
                    Level Up!
                  </h3>
                  <div className="text-lg text-gray-700">
                    You're now <span className="font-bold text-green-600">Level {progression.newLevel}</span>
                    {progression.newTitle && (
                      <div className="mt-1 text-sm">
                        New Title: <span className="font-bold text-purple-600">{progression.newTitle}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Achievements */}
            {achievements.length > 0 && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-4 text-xl flex items-center gap-2">
                  🏆 Achievements Unlocked!
                </h3>
                <div className="space-y-3">
                  {achievements.map((ach, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-gray-900">{ach.name}</div>
                        <div className="text-sm text-gray-600">
                          {ach.tier} • +{ach.rewards.points}pts • +{ach.rewards.xp}xp
                        </div>
                      </div>
                      <div className="text-3xl">🏅</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Newly Completed Daily Challenges */}
            {completedChallenges.length > 0 && (
              <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-4 text-xl flex items-center gap-2">
                  🎯 Daily Challenges Completed
                </h3>
                <div className="space-y-2">
                  {completedChallenges.map((c, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-4 flex justify-between items-center">
                      <div className="font-bold text-gray-900">{c.title}</div>
                      <div className="text-sm text-gray-600">+{c.rewardsEarned.points}pts • +{c.rewardsEarned.xp}xp</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Streak Bonus */}
            {rewards && (rewards as any).streakBonus && (rewards as any).streakBonus > 0 && (
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 text-center">
                <div className="font-bold text-orange-700">
                  🔥 Streak Bonus: +{Math.round((rewards as any).streakBonus * 100)}% rewards!
                </div>
              </div>
            )}

            {/* Daily Challenges CTA */}
            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-4 text-center">
              <div className="text-sm text-gray-700">
                🎯 View <LocaleLink href="/challenges" className="font-bold text-teal-600 hover:underline">Daily Challenges</LocaleLink> to track progress.
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                setGameState('ready');
                setQuestions([]);
                setCurrentQuestion(0);
                setScore(0);
                setSelectedAnswer(null);
                setShowFeedback(false);
                setTimeLeft(0);
                setSessionId(null);
                setRewards(null);
                setProgression(null);
                setAchievements([]);
                setCompletedChallenges([]);
              }}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              Play Again
            </button>
            <button
              onClick={() => router.push('/games')}
              className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all"
            >
              Back to Games
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
