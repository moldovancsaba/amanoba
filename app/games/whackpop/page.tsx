'use client';

/**
 * WHACKPOP Game Page
 * 
 * Why: Fast-paced clicking game testing reflexes with gamification rewards
 * What: Whack-a-mole style game integrated with session API
 */

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Target {
  id: number;
  position: number;
  emoji: string;
}

// Why: Various emojis for targets to make game more engaging
const TARGET_EMOJIS = ['🐹', '🐰', '🐭', '🐻', '🐼', '🐨', '🦊', '🦝'];

export default function WhackPopGame() {
  const router = useRouter();
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'finished'>('ready');
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targets, setTargets] = useState<Target[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [rewards, setRewards] = useState<any>(null);
  const [difficulty, setDifficulty] = useState(1);

  // Why: Start game session
  const startGame = async () => {
    try {
      const mockPlayerId = '507f1f77bcf86cd799439011';
      const mockGameId = '507f1f77bcf86cd799439014'; // Different game ID for WHACKPOP
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
      }
    } catch (error) {
      console.error('Failed to start game session:', error);
    }

    setGameState('playing');
    setTimeLeft(30);
    setScore(0);
    setHits(0);
    setMisses(0);
    setTargets([]);
  };

  // Why: Spawn targets randomly during gameplay
  const spawnTarget = useCallback(() => {
    const id = Date.now();
    const position = Math.floor(Math.random() * 9); // 9 positions (3x3 grid)
    const emoji = TARGET_EMOJIS[Math.floor(Math.random() * TARGET_EMOJIS.length)];
    
    setTargets((prev) => {
      // Why: Limit to 3 targets at once to avoid overwhelming player
      if (prev.length >= 3) return prev;
      return [...prev, { id, position, emoji }];
    });

    // Why: Remove target after 1 second if not clicked
    setTimeout(() => {
      setTargets((prev) => prev.filter((t) => t.id !== id));
    }, 1000);
  }, []);

  // Why: Game timer countdown
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          finishGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Why: Spawn targets at increasing frequency
  useEffect(() => {
    if (gameState !== 'playing') return;

    // Why: Spawn faster as game progresses
    const baseInterval = 1000;
    const speedIncrease = Math.min(400, score * 20);
    const spawnInterval = Math.max(400, baseInterval - speedIncrease);

    const spawner = setInterval(spawnTarget, spawnInterval);
    return () => clearInterval(spawner);
  }, [gameState, score, spawnTarget]);

  // Why: Handle target hit
  const handleHit = (targetId: number) => {
    setTargets((prev) => prev.filter((t) => t.id !== targetId));
    setHits((prev) => prev + 1);
    setScore((prev) => prev + 10);
  };

  // Why: Handle miss (clicking empty space)
  const handleMiss = () => {
    setMisses((prev) => prev + 1);
    setScore((prev) => Math.max(0, prev - 2)); // Small penalty
  };

  // Why: Complete game session
  const finishGame = async () => {
    setGameState('finished');

    if (sessionId) {
      try {
        const accuracy = hits + misses > 0 ? Math.round((hits / (hits + misses)) * 100) : 0;
        const response = await fetch('/api/game-sessions/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            score,
            isWin: hits >= 20, // Need 20 hits to win
            duration: 30,
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

  // Ready screen
  if (gameState === 'ready') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
          <div className="text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">WHACKPOP</h1>
            <p className="text-xl text-gray-600 mb-8">
              Click the targets as fast as you can!
            </p>

            <div className="bg-orange-50 rounded-lg p-6 mb-8">
              <h3 className="font-bold text-gray-900 mb-4">How to Play:</h3>
              <ul className="text-left text-gray-700 space-y-2">
                <li>• Click targets before they disappear</li>
                <li>• 30 seconds to get the highest score</li>
                <li>• +10 points per hit</li>
                <li>• Misses cost -2 points</li>
                <li>• Get 20+ hits to win!</li>
              </ul>
            </div>

            <button
              onClick={startGame}
              className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-12 py-4 rounded-xl font-bold text-xl hover:from-orange-700 hover:to-red-700 transform hover:scale-105 transition-all shadow-lg"
            >
              Start Game 🚀
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

  // Playing screen
  if (gameState === 'playing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 p-4">
        {/* Game header */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 flex justify-between items-center">
            <div className="text-2xl font-bold text-gray-900">
              ⏱️ {timeLeft}s
            </div>
            <div className="text-2xl font-bold text-orange-600">
              Score: {score}
            </div>
            <div className="text-sm text-gray-600">
              Hits: {hits} • Misses: {misses}
            </div>
          </div>
        </div>

        {/* Game grid */}
        <div className="max-w-4xl mx-auto">
          <div 
            className="grid grid-cols-3 gap-4 bg-white/20 backdrop-blur-sm rounded-2xl p-6"
            onClick={handleMiss}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((position) => {
              const target = targets.find((t) => t.position === position);
              
              return (
                <div
                  key={position}
                  className="aspect-square bg-white/40 rounded-xl flex items-center justify-center relative overflow-hidden hover:bg-white/50 transition-all cursor-pointer"
                  onClick={(e) => {
                    if (target) {
                      e.stopPropagation();
                      handleHit(target.id);
                    }
                  }}
                >
                  {target && (
                    <div className="text-6xl animate-bounce">
                      {target.emoji}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Instructions */}
        <div className="max-w-4xl mx-auto mt-6 text-center text-white text-lg font-medium">
          Click the targets! Game gets faster as you score more 🎯
        </div>
      </div>
    );
  }

  // Finished screen
  const isWin = hits >= 20;
  const accuracy = hits + misses > 0 ? Math.round((hits / (hits + misses)) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <div className="text-center">
          <div className="text-6xl mb-4">{isWin ? '🏆' : '💪'}</div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {isWin ? 'Excellent!' : 'Good Try!'}
          </h2>

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-3xl font-bold text-orange-600">{score}</div>
                <div className="text-gray-600">Score</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600">{hits}</div>
                <div className="text-gray-600">Hits</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-pink-600">{accuracy}%</div>
                <div className="text-gray-600">Accuracy</div>
              </div>
            </div>
          </div>

          {rewards && (
            <div className="bg-orange-50 rounded-xl p-6 mb-6">
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
              onClick={startGame}
              className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-xl font-bold hover:from-orange-700 hover:to-red-700 transition-all"
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
