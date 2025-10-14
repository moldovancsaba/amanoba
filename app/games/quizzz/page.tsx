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
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: Difficulty;
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

// Why: Expanded question pool sorted by difficulty
const ALL_QUESTIONS: Question[] = [
  // Easy questions (10 total for better gameplay)
  { question: 'What is the capital of France?', options: ['London', 'Berlin', 'Paris', 'Madrid'], correctIndex: 2, difficulty: 'EASY' },
  { question: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correctIndex: 1, difficulty: 'EASY' },
  { question: 'What is 2 + 2?', options: ['3', '4', '5', '6'], correctIndex: 1, difficulty: 'EASY' },
  { question: 'What color is the sky on a clear day?', options: ['Green', 'Blue', 'Red', 'Yellow'], correctIndex: 1, difficulty: 'EASY' },
  { question: 'How many days are in a week?', options: ['5', '6', '7', '8'], correctIndex: 2, difficulty: 'EASY' },
  { question: 'What is 5 × 3?', options: ['12', '15', '18', '20'], correctIndex: 1, difficulty: 'EASY' },
  { question: 'Which animal says "meow"?', options: ['Dog', 'Cat', 'Cow', 'Bird'], correctIndex: 1, difficulty: 'EASY' },
  { question: 'How many legs does a spider have?', options: ['6', '8', '10', '12'], correctIndex: 1, difficulty: 'EASY' },
  { question: 'What comes after Monday?', options: ['Wednesday', 'Tuesday', 'Sunday', 'Friday'], correctIndex: 1, difficulty: 'EASY' },
  { question: 'What is the opposite of hot?', options: ['Warm', 'Cool', 'Cold', 'Freezing'], correctIndex: 2, difficulty: 'EASY' },
  
  // Medium questions
  { question: 'What is 7 × 8?', options: ['54', '56', '63', '72'], correctIndex: 1, difficulty: 'MEDIUM' },
  { question: 'Who painted the Mona Lisa?', options: ['Michelangelo', 'Leonardo da Vinci', 'Raphael', 'Donatello'], correctIndex: 1, difficulty: 'MEDIUM' },
  { question: 'What is the largest ocean on Earth?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correctIndex: 3, difficulty: 'MEDIUM' },
  { question: 'In which year did World War II end?', options: ['1943', '1944', '1945', '1946'], correctIndex: 2, difficulty: 'MEDIUM' },
  { question: 'What is the chemical symbol for gold?', options: ['Go', 'Gd', 'Au', 'Ag'], correctIndex: 2, difficulty: 'MEDIUM' },
  { question: 'Which country invented pizza?', options: ['France', 'Italy', 'Greece', 'Spain'], correctIndex: 1, difficulty: 'MEDIUM' },
  { question: 'What is the square root of 64?', options: ['6', '7', '8', '9'], correctIndex: 2, difficulty: 'MEDIUM' },
  { question: 'Who wrote "Romeo and Juliet"?', options: ['Charles Dickens', 'William Shakespeare', 'Mark Twain', 'Jane Austen'], correctIndex: 1, difficulty: 'MEDIUM' },
  
  // Hard questions
  { question: 'What is the speed of light in vacuum?', options: ['299,792 km/s', '300,000 km/s', '299,792,458 m/s', 'Both A and C'], correctIndex: 3, difficulty: 'HARD' },
  { question: 'Which element has atomic number 79?', options: ['Silver', 'Gold', 'Platinum', 'Mercury'], correctIndex: 1, difficulty: 'HARD' },
  { question: 'In what year was the Declaration of Independence signed?', options: ['1774', '1775', '1776', '1777'], correctIndex: 2, difficulty: 'HARD' },
  { question: 'What is the capital of Kazakhstan?', options: ['Almaty', 'Astana (Nur-Sultan)', 'Bishkek', 'Tashkent'], correctIndex: 1, difficulty: 'HARD' },
  { question: 'Which philosopher wrote "Thus Spoke Zarathustra"?', options: ['Kant', 'Hegel', 'Nietzsche', 'Schopenhauer'], correctIndex: 2, difficulty: 'HARD' },
  { question: 'What is the Fibonacci sequence starting number?', options: ['0', '1', 'Both 0 and 1', '2'], correctIndex: 2, difficulty: 'HARD' },
  { question: 'Which hormone regulates blood sugar?', options: ['Adrenaline', 'Insulin', 'Cortisol', 'Thyroxine'], correctIndex: 1, difficulty: 'HARD' },
  { question: 'What is the pH of pure water?', options: ['6', '7', '8', 'Depends on temperature'], correctIndex: 1, difficulty: 'HARD' },
  { question: 'Who discovered penicillin?', options: ['Louis Pasteur', 'Alexander Fleming', 'Marie Curie', 'Jonas Salk'], correctIndex: 1, difficulty: 'HARD' },
  { question: 'What is the smallest prime number?', options: ['0', '1', '2', '3'], correctIndex: 2, difficulty: 'HARD' },
  
  // Expert questions
  { question: 'What is Planck\'s constant (approximate)?', options: ['6.626 × 10⁻³⁴ J⋅s', '1.616 × 10⁻³⁵ m', '1.055 × 10⁻³⁴ J⋅s', '9.109 × 10⁻³¹ kg'], correctIndex: 0, difficulty: 'EXPERT' },
  { question: 'Which theorem relates prime numbers to complex analysis?', options: ['Fermat\'s Last Theorem', 'Riemann Hypothesis', 'Gödel\'s Incompleteness', 'Prime Number Theorem'], correctIndex: 3, difficulty: 'EXPERT' },
  { question: 'What is the half-life of Carbon-14?', options: ['5,730 years', '10,000 years', '1,200 years', '50,000 years'], correctIndex: 0, difficulty: 'EXPERT' },
  { question: 'Who proved the Four Color Theorem?', options: ['Appel & Haken', 'Wiles', 'Perelman', 'Tao'], correctIndex: 0, difficulty: 'EXPERT' },
  { question: 'What is the Avogadro constant?', options: ['6.022 × 10²³', '6.626 × 10⁻³⁴', '1.616 × 10⁻³⁵', '8.314 J/(mol·K)'], correctIndex: 0, difficulty: 'EXPERT' },
  { question: 'Which programming paradigm is Haskell based on?', options: ['Object-oriented', 'Procedural', 'Functional', 'Logic'], correctIndex: 2, difficulty: 'EXPERT' },
  { question: 'What is the Schwarzschild radius formula component?', options: ['2GM/c²', 'GM/c²', 'GM/2c²', 'G²M/c²'], correctIndex: 0, difficulty: 'EXPERT' },
  { question: 'Which enzyme unwinds DNA during replication?', options: ['Polymerase', 'Ligase', 'Helicase', 'Primase'], correctIndex: 2, difficulty: 'EXPERT' },
  { question: 'What is the time complexity of QuickSort (average)?', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], correctIndex: 1, difficulty: 'EXPERT' },
  { question: 'Which particle is the force carrier for electromagnetism?', options: ['Gluon', 'Photon', 'W Boson', 'Higgs Boson'], correctIndex: 1, difficulty: 'EXPERT' },
  { question: 'What is the Euler\'s identity?', options: ['e^(iπ) + 1 = 0', 'e^(iπ) = -1', 'Both A and B', 'e^π = -1'], correctIndex: 2, difficulty: 'EXPERT' },
  { question: 'Which language influenced JavaScript the most?', options: ['Java', 'C', 'Scheme', 'Python'], correctIndex: 2, difficulty: 'EXPERT' },
  { question: 'What is the standard model\'s force NOT explained by?', options: ['Electromagnetic', 'Weak', 'Strong', 'Gravitational'], correctIndex: 3, difficulty: 'EXPERT' },
  { question: 'Which theorem proves program correctness?', options: ['Church-Turing', 'Rice\'s Theorem', 'Hoare Logic', 'Halting Problem'], correctIndex: 2, difficulty: 'EXPERT' },
  { question: 'What is the Kolmogorov complexity measure?', options: ['Time', 'Space', 'Description length', 'Entropy'], correctIndex: 2, difficulty: 'EXPERT' },
];

export default function QuizzzGame() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'finished'>('ready');
  const [difficulty, setDifficulty] = useState<Difficulty>('MEDIUM');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [rewards, setRewards] = useState<any>(null);
  const [playerLevel, setPlayerLevel] = useState(1);
  const [isPremium, setIsPremium] = useState(false);

  // Why: Get questions for selected difficulty
  const selectQuestions = (diff: Difficulty): Question[] => {
    const config = DIFFICULTY_CONFIGS[diff];
    const diffQuestions = ALL_QUESTIONS.filter(q => q.difficulty === diff);
    const shuffled = [...diffQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, config.questionCount);
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
    const selectedQuestions = selectQuestions(difficulty);
    setQuestions(selectedQuestions);
    setTimeLeft(DIFFICULTY_CONFIGS[difficulty].timePerQuestion);
    setGameState('playing');
    setStartTime(Date.now());

    // Try to start backend session (optional - game works without it)
    if (session?.user) {
      try {
        const playerId = (session.user as any).playerId;

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
        }
      } catch (error) {
        console.error('Failed to start game session (continuing anyway):', error);
      }
    }
  };

  // Why: Handle answer selection and provide immediate feedback
  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return; // Already answered

    setSelectedAnswer(index);
    setShowFeedback(true);

    if (index === questions[currentQuestion].correctIndex) {
      setScore(score + 1);
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

    // Try to complete backend session (optional)
    if (sessionId && session?.user) {
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
        }
      } catch (error) {
        console.error('Failed to complete session (continuing anyway):', error);
        // Show mock rewards for testing
        setRewards({
          xp: score * 10,
          points: Math.round(score * 100 * config.pointsMultiplier),
          levelsGained: 0,
        });
      }
    } else {
      // Show mock rewards for testing when no session
      setRewards({
        xp: score * 10,
        points: Math.round(score * 100 * config.pointsMultiplier),
        levelsGained: 0,
      });
    }
  };

  // Auth check (relaxed for testing)
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  // Allow playing without auth for testing
  const isTestMode = !session;
  if (isTestMode) {
    console.log('Running in test mode without authentication');
  }

  // Why: Render appropriate screen based on game state
  if (gameState === 'ready') {
    const config = DIFFICULTY_CONFIGS[difficulty];
    const canPlayDifficulty = !config.isPremium || isPremium;

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        {isTestMode && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-6 py-3 rounded-full font-bold shadow-lg z-50 animate-pulse">
            🧪 TEST MODE - Playing without login
          </div>
        )}
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
              disabled={!canPlayDifficulty}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-12 py-4 rounded-xl font-bold text-xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Quiz 🚀
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
        {isTestMode && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-4 py-2 rounded-full font-bold shadow-lg z-50 text-sm">
            🧪 TEST MODE
          </div>
        )}
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
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === question.correctIndex;
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
            })}
          </div>

          {showFeedback && (
            <div className="mt-6 text-center">
              {timeLeft === 0 ? (
                <div className="text-2xl text-orange-600 font-bold">
                  Time's Up! ⏰
                </div>
              ) : selectedAnswer === question.correctIndex ? (
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
      {isTestMode && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-4 py-2 rounded-full font-bold shadow-lg z-50 text-sm">
          🧪 TEST MODE
        </div>
      )}
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
