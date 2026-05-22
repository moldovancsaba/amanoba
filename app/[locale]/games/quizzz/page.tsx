'use client';

/**
 * QUIZZZ Game Page
 * 
 * Why: Trivia quiz game testing knowledge with gamification rewards
 * What: Simplified quiz game that integrates with session API and awards points/XP
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { LocaleLink } from '@/components/LocaleLink';
import {
  Alert,
  Button,
  Card,
  Center,
  Container,
  Group,
  List,
  Loader,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';

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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const signInUrl = `/auth/signin?callbackUrl=${encodeURIComponent(
    `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ''}`
  )}`;
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
  const [_playerLevel, _setPlayerLevel] = useState(1);
  const [isPremium, _setIsPremium] = useState(false);
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
      const seenIds: string[] = seenIdsRaw ? JSON.parse(seenIdsRaw) : [];
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
          sessionStorage.setItem(seenKey, JSON.stringify(newIds));
        } else {
          const updated = [...new Set([...seenIds, ...newIds])];
          sessionStorage.setItem(seenKey, JSON.stringify(updated));
        }
      } catch {
        // Failed to update seen questions (non-critical)
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
        // Fallback: generate random correct answers when answers API unavailable
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

  const finishGameRef = useRef<() => void>(() => {});

  // Why: Handle time up scenario
  const handleTimeUp = useCallback(() => {
    setShowFeedback(true);
    // Auto-advance after showing time's up feedback
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setTimeLeft(DIFFICULTY_CONFIGS[difficulty].timePerQuestion);
      } else {
        finishGameRef.current();
      }
    }, 1500);
  }, [currentQuestion, difficulty, questions.length]);

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
  }, [gameState, handleTimeUp, selectedAnswer, timeLeft]);

  // Why: Start game session when player clicks play
  const startGame = async () => {
    if (!session?.user) {
      console.error('Cannot start game without authentication');
      router.push(signInUrl);
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

        if (response.ok) {
          const data = await response.json();
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
                const completed = (ch.challenges || []).filter((c: { isCompleted?: boolean }) => c.isCompleted).map((c: { name?: string; rewards?: { points?: number; xp?: number } }) => ({
                  title: c.name,
                  rewardsEarned: { points: c.rewards?.points || 0, xp: c.rewards?.xp || 0 },
                }));
                setCompletedChallenges(completed);
              }
            }
          } catch {
            // Challenges refresh after completion failed (non-critical)
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

  finishGameRef.current = () => {
    void finishGame();
  };

  // Why: Redirect to sign-in if not authenticated
  if (status === 'loading') {
    return (
      <Center mih="100vh">
        <Loader />
      </Center>
    );
  }

  if (!session) {
    router.push(signInUrl);
    return null;
  }

  // Why: Show error if question loading failed
  if (fetchError) {
    return (
      <Container size="xs" py="xl">
        <Card withBorder>
          <Stack align="center">
          <Text size="xl">❌</Text>
          <Title order={2}>Error Loading Questions</Title>
          <Alert color="red">{fetchError}</Alert>
          <Button
            onClick={() => {
              setFetchError(null);
              setGameState('ready');
            }}
            fullWidth
          >
            Try Again
          </Button>
          <Button
            onClick={() => router.push('/games')}
            variant="default"
            fullWidth
          >
            Back to Games
          </Button>
          </Stack>
        </Card>
      </Container>
    );
  }

  // Why: Render appropriate screen based on game state
  if (gameState === 'ready') {
    const config = DIFFICULTY_CONFIGS[difficulty];
    const canPlayDifficulty = !config.isPremium || isPremium;

    return (
      <Container size="sm" py="xl">
        <Card withBorder p="xl">
          <Stack gap="xl">
          <Stack align="center" gap="sm">
            <Text size="xl">🧠</Text>
            <Title order={1}>QUIZZZ</Title>
            <Text c="dimmed" ta="center">
              Test your knowledge with rapid-fire trivia questions!
            </Text>
          </Stack>

            {/* Difficulty Selection */}
            <Stack gap="sm">
              <Title order={3}>Select Difficulty:</Title>
              <SimpleGrid cols={{ base: 2, md: 4 }}>
                {(['EASY', 'MEDIUM', 'HARD', 'EXPERT'] as Difficulty[]).map(diff => {
                  const diffConfig = DIFFICULTY_CONFIGS[diff];
                  const isLocked = diffConfig.isPremium && !isPremium;
                  const isSelected = difficulty === diff;

                  return (
                    <Button
                      key={diff}
                      onClick={() => !isLocked && setDifficulty(diff)}
                      disabled={isLocked}
                      variant={isSelected ? 'filled' : 'default'}
                      h="auto"
                      py="md"
                    >
                      <Stack gap={2} align="center">
                      <Text fw={700}>{isLocked ? '🔒 ' : ''}{diff}</Text>
                      <Text size="xs">
                        {diffConfig.questionCount}Q • {diffConfig.timePerQuestion}s
                      </Text>
                      </Stack>
                    </Button>
                  );
                })}
              </SimpleGrid>
            </Stack>

            <Card withBorder>
              <Title order={3}>How to Play:</Title>
              <List spacing="xs" mt="sm">
                <List.Item>Answer {config.questionCount} questions</List.Item>
                <List.Item>Get {config.minCorrect} or more correct to win</List.Item>
                <List.Item>{config.timePerQuestion} seconds per question</List.Item>
                <List.Item>{config.pointsMultiplier}x points multiplier</List.Item>
                <List.Item>Earn XP and unlock achievements</List.Item>
              </List>
            </Card>

            <Button
              onClick={startGame}
              disabled={!canPlayDifficulty || isLoadingQuestions}
              size="lg"
            >
              {isLoadingQuestions ? 'Loading Questions...' : 'Start Game'}
            </Button>

            <Button
              onClick={() => router.push('/games')}
              variant="default"
            >
              Back to Games
            </Button>
          </Stack>
        </Card>
      </Container>
    );
  }

  if (gameState === 'playing') {
    if (questions.length === 0) return null;
    
    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const timePercent = (timeLeft / DIFFICULTY_CONFIGS[difficulty].timePerQuestion) * 100;

    return (
      <Container size="md" py="xl">
        {/* Timer and Progress */}
        <Stack gap="md">
          {/* Timer Bar */}
          <Progress value={timePercent} color={timeLeft <= 3 ? 'red' : timeLeft <= 5 ? 'yellow' : 'green'} />
          <Group justify="space-between">
            <Text fw={700}>⏱️ {timeLeft}s</Text>
            <Text fw={700}>
              Question {currentQuestion + 1} of {questions.length}
            </Text>
            <Text fw={700}>Score: {score}</Text>
          </Group>
          {/* Progress bar */}
          <Progress value={progress} />
        </Stack>

        {/* Question card */}
        <Card withBorder p="xl" mt="md">
          <Title order={2} ta="center" mb="xl">
            {question.question}
          </Title>

          <SimpleGrid cols={{ base: 1, md: 2 }}>
            {(() => {
              // Why: Determine correct answer index from answers fetched separately
              const correctIndex = questionsWithAnswers.find(q => q.id === question.id)?.correctIndex ?? -1;
              return question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === correctIndex;
                const showResult = showFeedback && isSelected;

              let buttonColor = 'dark';
              let buttonVariant: 'default' | 'filled' | 'light' = 'default';
              if (showResult && isCorrect) {
                buttonColor = 'green';
                buttonVariant = 'filled';
              } else if (showResult && !isCorrect) {
                buttonColor = 'red';
                buttonVariant = 'filled';
              } else if (isSelected) {
                buttonColor = 'yellow';
                buttonVariant = 'light';
              }

              return (
                <Button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                  variant={buttonVariant}
                  color={buttonColor}
                  h="auto"
                  py="lg"
                  justify="flex-start"
                >
                  {option}
                  {showResult && isCorrect && ' ✓'}
                  {showResult && isSelected && !isCorrect && ' ✗'}
                </Button>
              );
            });
            })()}
          </SimpleGrid>

          {showFeedback && (
            <Text mt="lg" ta="center" size="xl" fw={700} c={timeLeft === 0 ? 'orange' : undefined}>
              {timeLeft === 0 ? (
                <>
                  Time&apos;s Up! ⏰
                </>
              ) : (() => {
                  const correctIndex = questionsWithAnswers.find(q => q.id === question.id)?.correctIndex ?? -1;
                  return selectedAnswer === correctIndex;
                })() ? (
                <>
                  Correct! 🎉
                </>
              ) : (
                <>
                  Incorrect 😔
                </>
              )}
            </Text>
          )}
        </Card>
      </Container>
    );
  }

  // Finished state
  const config = DIFFICULTY_CONFIGS[difficulty];
  const isWin = score >= config.minCorrect;
  const accuracy = Math.round((score / questions.length) * 100);

  return (
    <Container size="sm" py="xl">
      <Card withBorder p="xl">
        <Stack gap="xl" align="center">
          <Text size="xl">{isWin ? '🏆' : '💪'}</Text>
          <Title order={1}>
            {isWin ? 'You Won!' : 'Good Try!'}
          </Title>

          <SimpleGrid cols={3} w="100%">
            <Card withBorder><Text size="xl" fw={700}>{score}/{questions.length}</Text><Text c="dimmed">Correct</Text></Card>
            <Card withBorder><Text size="xl" fw={700}>{accuracy}%</Text><Text c="dimmed">Accuracy</Text></Card>
            <Card withBorder><Text size="xl" fw={700}>{difficulty}</Text><Text c="dimmed">Difficulty</Text></Card>
          </SimpleGrid>

          {/* Rewards & Progress Section (always visible) */}
          <Stack gap="md" w="100%">
            {/* Main Rewards */}
            <Card withBorder>
              <Title order={3}>
                💰 Rewards Earned
                {isCompleting ? <Text span size="sm" c="dimmed">Calculating...</Text> : null}
              </Title>
              <SimpleGrid cols={2} mt="md">
                <Card withBorder><Text size="xl" fw={700}>{rewards ? `+${rewards.points || 0}` : '-'}</Text><Text c="dimmed">💎 Points</Text></Card>
                <Card withBorder><Text size="xl" fw={700}>{rewards ? `+${rewards.xp || 0}` : '-'}</Text><Text c="dimmed">⭐ XP</Text></Card>
              </SimpleGrid>
            </Card>

            {/* Level Up */}
            {progression && progression.levelsGained > 0 && (
              <Card withBorder>
                <Stack align="center">
                  <Text size="xl">🎉</Text>
                  <Title order={3}>
                    Level Up!
                  </Title>
                  <Text>
                    You&apos;re now Level {progression.newLevel}
                    {progression.newTitle && (
                      <Text size="sm">New Title: {progression.newTitle}</Text>
                    )}
                  </Text>
                </Stack>
              </Card>
            )}

            {/* Achievements */}
            {achievements.length > 0 && (
              <Card withBorder>
                <Title order={3}>
                  🏆 Achievements Unlocked!
                </Title>
                <Stack mt="md">
                  {achievements.map((ach, idx) => (
                    <Group key={idx} justify="space-between">
                      <div>
                        <Text fw={700}>{ach.name}</Text>
                        <Text size="sm" c="dimmed">
                          {ach.tier} • +{ach.rewards.points}pts • +{ach.rewards.xp}xp
                        </Text>
                      </div>
                      <Text size="xl">🏅</Text>
                    </Group>
                  ))}
                </Stack>
              </Card>
            )}

            {/* Newly Completed Daily Challenges */}
            {completedChallenges.length > 0 && (
              <Card withBorder>
                <Title order={3}>
                  🎯 Daily Challenges Completed
                </Title>
                <Stack mt="md">
                  {completedChallenges.map((c, idx) => (
                    <Group key={idx} justify="space-between">
                      <Text fw={700}>{c.title}</Text>
                      <Text size="sm" c="dimmed">+{c.rewardsEarned.points}pts • +{c.rewardsEarned.xp}xp</Text>
                    </Group>
                  ))}
                </Stack>
              </Card>
            )}

            {/* Streak Bonus */}
            {(() => {
              const r = rewards as Record<string, unknown> | null | undefined;
              const streakBonus = r && typeof r.streakBonus === 'number' ? r.streakBonus : 0;
              return streakBonus > 0 && (
              <Alert color="orange">
                  🔥 Streak Bonus: +{Math.round(streakBonus * 100)}% rewards!
              </Alert>
            );
            })()}

            {/* Daily Challenges CTA */}
            <Alert color="green">
              🎯 View <Button component={LocaleLink} href="/challenges" variant="subtle" size="compact-sm">Daily Challenges</Button> to track progress.
            </Alert>
          </Stack>

          <Group grow w="100%">
            <Button
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
            >
              Play Again
            </Button>
            <Button
              onClick={() => router.push('/games')}
              variant="default"
            >
              Back to Games
            </Button>
          </Group>
        </Stack>
      </Card>
    </Container>
  );
}
