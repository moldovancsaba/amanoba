'use client';

/**
 * QUIZZZ Game Page
 * 
 * Why: Trivia quiz game testing knowledge with gamification rewards
 * What: Simplified quiz game that integrates with session API and awards points/XP
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
}

// Why: Sample questions for MVP - in production these would come from database
const SAMPLE_QUESTIONS: Question[] = [
  {
    question: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctIndex: 2,
  },
  {
    question: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctIndex: 1,
  },
  {
    question: 'What is 7 × 8?',
    options: ['54', '56', '63', '72'],
    correctIndex: 1,
  },
  {
    question: 'Who painted the Mona Lisa?',
    options: ['Michelangelo', 'Leonardo da Vinci', 'Raphael', 'Donatello'],
    correctIndex: 1,
  },
  {
    question: 'What is the largest ocean on Earth?',
    options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
    correctIndex: 3,
  },
];

export default function QuizzzGame() {
  const router = useRouter();
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'finished'>('ready');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [rewards, setRewards] = useState<any>(null);

  // Why: Start game session when player clicks play
  const startGame = async () => {
    try {
      // TODO: Replace with actual player/game IDs from auth and database
      const mockPlayerId = '507f1f77bcf86cd799439011';
      const mockGameId = '507f1f77bcf86cd799439012';
      const mockBrandId = '507f1f77bcf86cd799439013';

      const response = await fetch('/api/game-sessions/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: mockPlayerId,
          gameId: mockGameId,
          brandId: mockBrandId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSessionId(data.sessionId);
        setGameState('playing');
        setStartTime(Date.now());
      }
    } catch (error) {
      console.error('Failed to start game session:', error);
      // Continue anyway for demo purposes
      setGameState('playing');
      setStartTime(Date.now());
    }
  };

  // Why: Handle answer selection and provide immediate feedback
  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return; // Already answered

    setSelectedAnswer(index);
    setShowFeedback(true);

    if (index === SAMPLE_QUESTIONS[currentQuestion].correctIndex) {
      setScore(score + 1);
    }

    // Why: Auto-advance to next question after feedback
    setTimeout(() => {
      if (currentQuestion < SAMPLE_QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        finishGame();
      }
    }, 1500);
  };

  // Why: Complete game session and award rewards
  const finishGame = async () => {
    setGameState('finished');
    const duration = Math.floor((Date.now() - startTime) / 1000);
    const accuracy = Math.round((score / SAMPLE_QUESTIONS.length) * 100);

    if (sessionId) {
      try {
        const response = await fetch('/api/game-sessions/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            score: score * 100, // 100 points per correct answer
            isWin: score >= 3, // Need 3/5 correct to win
            duration,
            accuracy,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setRewards(data.rewards);
        }
      } catch (error) {
        console.error('Failed to complete session:', error);
      }
    }
  };

  // Why: Render appropriate screen based on game state
  if (gameState === 'ready') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
          <div className="text-center">
            <div className="text-6xl mb-4">🧠</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">QUIZZZ</h1>
            <p className="text-xl text-gray-600 mb-8">
              Test your knowledge with {SAMPLE_QUESTIONS.length} rapid-fire questions!
            </p>

            <div className="bg-indigo-50 rounded-lg p-6 mb-8">
              <h3 className="font-bold text-gray-900 mb-4">How to Play:</h3>
              <ul className="text-left text-gray-700 space-y-2">
                <li>• Answer all {SAMPLE_QUESTIONS.length} questions</li>
                <li>• Get 3 or more correct to win</li>
                <li>• Faster completion = bonus points</li>
                <li>• Earn XP and unlock achievements!</li>
              </ul>
            </div>

            <button
              onClick={startGame}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-12 py-4 rounded-xl font-bold text-xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg"
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
    const question = SAMPLE_QUESTIONS[currentQuestion];
    const progress = ((currentQuestion + 1) / SAMPLE_QUESTIONS.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
        {/* Progress bar */}
        <div className="max-w-4xl mx-auto mb-4">
          <div className="bg-white/20 rounded-full h-3 overflow-hidden">
            <div
              className="bg-white h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-white text-center mt-2 font-bold">
            Question {currentQuestion + 1} of {SAMPLE_QUESTIONS.length} • Score: {score}
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
              {selectedAnswer === question.correctIndex ? (
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
  const isWin = score >= 3;
  const accuracy = Math.round((score / SAMPLE_QUESTIONS.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <div className="text-center">
          <div className="text-6xl mb-4">{isWin ? '🏆' : '💪'}</div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {isWin ? 'You Won!' : 'Good Try!'}
          </h2>

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-3xl font-bold text-indigo-600">{score}/{SAMPLE_QUESTIONS.length}</div>
                <div className="text-gray-600">Correct</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">{accuracy}%</div>
                <div className="text-gray-600">Accuracy</div>
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
                setCurrentQuestion(0);
                setScore(0);
                setSelectedAnswer(null);
                setShowFeedback(false);
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
