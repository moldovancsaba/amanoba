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
  const [rewards, setRewards] = useState<{ xp: number; points: number } | null>(null);
  const [playerLevel, setPlayerLevel] = useState(1);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Why: Fetch questions from database API with intelligent selection
  const fetchQuestions = async (diff: Difficulty): Promise<{ questions: Question[], answers: QuestionWithAnswer[] } | null> => {
    setIsLoadingQuestions(true);
    setFetchError(null);

    try {
      const count = QUESTION_COUNTS[diff];
      
      // Why: Check sessionStorage cache first
      const cacheKey = `quizzz_questions_${diff}_${count}`;
      const cached = sessionStorage.getItem(cacheKey);
      
      if (cached) {
        const { questions, answers, timestamp } = JSON.parse(cached);
        // Why: Cache valid for 5 minutes to reduce API calls
        if (Date.now() - timestamp < 5 * 60 * 1000) {
          console.log('Using cached questions for', diff);
          setIsLoadingQuestions(false);
          return { questions, answers };
        }
      }

      // Why: Fetch questions from API
      const response = await fetch(
        `/api/games/quizzz/questions?difficulty=${diff}&count=${count}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch questions: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.ok || !data.data?.questions) {
        throw new Error('Invalid response format');
      }

      const apiQuestions: Question[] = data.data.questions;

      // Why: Fetch correct answers separately (security: not in main response)
      // For now, we'll fetch from a separate endpoint or embed encrypted
      // Temporary: Fetch full question data including correctIndex
      const answersResponse = await fetch(
        `/api/games/quizzz/questions/answers?ids=${apiQuestions.map(q => q.id).join(',')}`
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
        console.warn('Could not fetch answers, using random fallback');
        questionsWithAnswers = apiQuestions.map(q => ({
          ...q,
          correctIndex: Math.floor(Math.random() * 4),
        }));
      }

      // Why: Cache for 5 minutes
      sessionStorage.setItem(
        cacheKey,
        JSON.stringify({
          questions: apiQuestions,
          answers: questionsWithAnswers,
          timestamp: Date.now(),
        })
      );

      setIsLoadingQuestions(false);
      return { questions: apiQuestions, answers: questionsWithAnswers };

    } catch (error) {
      console.error('Error fetching questions:', error);
      // Fallback: use a built-in minimal question set so the game is always playable
      try {
        const fallbackPool: Record<Difficulty, QuestionWithAnswer[]> = {
          EASY: [
            { id: 'e1', question: 'What is 2 + 2?', options: ['3','4','5','6'], correctIndex: 1, difficulty: 'EASY', category: 'Math' },
            { id: 'e2', question: 'What color is the sky on a clear day?', options: ['Green','Blue','Red','Yellow'], correctIndex: 1, difficulty: 'EASY', category: 'General Knowledge' },
            { id: 'e3', question: 'How many days are in a week?', options: ['5','6','7','8'], correctIndex: 2, difficulty: 'EASY', category: 'General Knowledge' },
            { id: 'e4', question: 'Which animal says "meow"?', options: ['Dog','Cat','Cow','Bird'], correctIndex: 1, difficulty: 'EASY', category: 'General Knowledge' },
            { id: 'e5', question: 'What is the capital of France?', options: ['London','Berlin','Paris','Madrid'], correctIndex: 2, difficulty: 'EASY', category: 'Geography' },
          ],
          MEDIUM: [
            { id: 'm1', question: 'What is 7 × 8?', options: ['54','56','63','72'], correctIndex: 1, difficulty: 'MEDIUM', category: 'Math' },
            { id: 'm2', question: 'Who painted the Mona Lisa?', options: ['Michelangelo','Leonardo da Vinci','Raphael','Donatello'], correctIndex: 1, difficulty: 'MEDIUM', category: 'Arts & Literature' },
            { id: 'm3', question: 'Largest ocean on Earth?', options: ['Atlantic','Indian','Arctic','Pacific'], correctIndex: 3, difficulty: 'MEDIUM', category: 'Geography' },
            { id: 'm4', question: 'Chemical symbol for gold?', options: ['Go','Gd','Au','Ag'], correctIndex: 2, difficulty: 'MEDIUM', category: 'Science' },
            { id: 'm5', question: 'Square root of 64?', options: ['6','7','8','9'], correctIndex: 2, difficulty: 'MEDIUM', category: 'Math' },
          ],
          HARD: [
            { id: 'h1', question: 'What is the speed of light (approx)?', options: ['299,792 km/s','300,000 km/s','299,792,458 m/s','Both A and C'], correctIndex: 3, difficulty: 'HARD', category: 'Science' },
            { id: 'h2', question: 'Atomic number 79 element?', options: ['Silver','Gold','Platinum','Mercury'], correctIndex: 1, difficulty: 'HARD', category: 'Science' },
            { id: 'h3', question: 'Year Declaration of Independence signed?', options: ['1774','1775','1776','1777'], correctIndex: 2, difficulty: 'HARD', category: 'History' },
            { id: 'h4', question: 'Capital of Kazakhstan?', options: ['Almaty','Astana (Nur-Sultan)','Bishkek','Tashkent'], correctIndex: 1, difficulty: 'HARD', category: 'Geography' },
            { id: 'h5', question: 'Thus Spoke Zarathustra author?', options: ['Kant','Hegel','Nietzsche','Schopenhauer'], correctIndex: 2, difficulty: 'HARD', category: 'Arts & Literature' },
          ],
          EXPERT: [
            { id: 'x1', question: 'Planck\'s constant (approx)?', options: ['6.626 × 10⁻³⁴ J⋅s','1.616 × 10⁻³⁵ m','1.055 × 10⁻³⁴ J⋅s','9.109 × 10⁻³¹ kg'], correctIndex: 0, difficulty: 'EXPERT', category: 'Science' },
            { id: 'x2', question: 'Theorem relating primes to complex analysis?', options: ['Fermat\'s Last Theorem','Riemann Hypothesis','Gödel\'s Incompleteness','Prime Number Theorem'], correctIndex: 3, difficulty: 'EXPERT', category: 'Math' },
            { id: 'x3', question: 'Half-life of Carbon-14?', options: ['5,730 years','10,000 years','1,200 years','50,000 years'], correctIndex: 0, difficulty: 'EXPERT', category: 'Science' },
            { id: 'x4', question: 'Who proved Four Color Theorem?', options: ['Appel & Haken','Wiles','Perelman','Tao'], correctIndex: 0, difficulty: 'EXPERT', category: 'Math' },
            { id: 'x5', question: 'Avogadro constant?', options: ['6.022 × 10²³','6.626 × 10⁻³⁴','1.616 × 10⁻³⁵','8.314 J/(mol·K)'], correctIndex: 0, difficulty: 'EXPERT', category: 'Science' },
          ],
        };

        const targetCount = QUESTION_COUNTS[diff];
        const pool = fallbackPool[diff];
        const repeated: QuestionWithAnswer[] = [];
        while (repeated.length < targetCount) {
          repeated.push(...pool);
        }
        const answers = repeated.slice(0, targetCount);
        // Why: Keep the same IDs so answer validation works correctly
        const apiQuestions: Question[] = answers.map(({ correctIndex, ...rest }) => ({ ...rest }));

        const cacheKey = `quizzz_questions_${diff}_${targetCount}`;
        sessionStorage.setItem(
          cacheKey,
          JSON.stringify({ questions: apiQuestions, answers, timestamp: Date.now() })
        );

        setIsLoadingQuestions(false);
        return { questions: apiQuestions, answers };
      } catch (fallbackError) {
        setFetchError(error instanceof Error ? error.message : 'Failed to load questions');
        setIsLoadingQuestions(false);
        return null;
      }
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
      const playerId = (session.user as any).id;

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
        console.log('Game session started:', data.sessionId);
      } else {
        console.error('Failed to start game session');
      }
    } catch (error) {
      console.error('Failed to start game session:', error);
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
      console.log(`Tracked ${correctQuestionIds.length}/${questions.length} correct answers`);
    } catch (error) {
      console.error('Failed to track question stats:', error);
    }

    // Why: Complete backend session and award real rewards
    if (!sessionId) {
      console.error('No session ID found');
      return;
    }

    try {
      const response = await fetch('/api/game-sessions/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          score: Math.round(score * 100 * config.pointsMultiplier),
          isWin,
          duration,
          accuracy,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setRewards(data.rewards);
        console.log('Game session completed with rewards:', data.rewards);
      } else {
        console.error('Failed to complete game session');
      }
    } catch (error) {
      console.error('Failed to complete session:', error);
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

              let buttonClass = 'bg-gray-100 hover:bg-gray-200';
              if (showResult && isCorrect) {
                buttonClass = 'bg-green-500 text-white';
              } else if (showResult && !isCorrect) {
                buttonClass = 'bg-red-500 text-white';
              } else if (isSelected) {
                buttonClass = 'bg-indigo-200';
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
                  Time's Up! ⏰
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

          {rewards && (
            <div className="bg-indigo-50 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Rewards Earned!</h3>
              <div className="space-y-2 text-lg">
                <div>⭐ +{rewards.xp || 0} XP</div>
                <div>💎 +{rewards.points || 0} Points</div>
                {rewards.levelsGained > 0 && (
                  <div className="text-green-600 font-bold">
                    🎉 Level Up! (+{rewards.levelsGained})
                  </div>
                )}
              </div>
            </div>
          )}

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
