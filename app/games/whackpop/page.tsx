'use client';

/**
 * WHACKPOP Game Page
 * 
 * Why: Fast-paced clicking game testing reflexes with gamification rewards
 * What: Whack-a-mole style game integrated with session API
 */

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';

interface Target {
  id: number;
  position: number;
  emoji: string;
}

interface DifficultyConfig {
  duration: number; // seconds
  targetLifetime: number; // ms
  maxTargets: number;
  spawnIntervalMin: number; // ms
  spawnIntervalMax: number; // ms
  hitsToWin: number;
  pointsPerHit: number;
  pointsMultiplier: number;
  requiredLevel: number;
  isPremium: boolean;
}

// Why: Difficulty configurations for progressive challenge
const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  EASY: {
    duration: 30,
    targetLifetime: 1500,
    maxTargets: 2,
    spawnIntervalMin: 800,
    spawnIntervalMax: 1200,
    hitsToWin: 15,
    pointsPerHit: 10,
    pointsMultiplier: 1,
    requiredLevel: 1,
    isPremium: false,
  },
  MEDIUM: {
    duration: 45,
    targetLifetime: 1200,
    maxTargets: 3,
    spawnIntervalMin: 600,
    spawnIntervalMax: 1000,
    hitsToWin: 30,
    pointsPerHit: 15,
    pointsMultiplier: 1.5,
    requiredLevel: 1,
    isPremium: false,
  },
  HARD: {
    duration: 60,
    targetLifetime: 1000,
    maxTargets: 4,
    spawnIntervalMin: 400,
    spawnIntervalMax: 800,
    hitsToWin: 50,
    pointsPerHit: 20,
    pointsMultiplier: 2,
    requiredLevel: 5,
    isPremium: false,
  },
  EXPERT: {
    duration: 60,
    targetLifetime: 800,
    maxTargets: 5,
    spawnIntervalMin: 300,
    spawnIntervalMax: 600,
    hitsToWin: 70,
    pointsPerHit: 30,
    pointsMultiplier: 3,
    requiredLevel: 10,
    isPremium: true,
  },
};

// Why: Removed hardcoded emojis - now fetched from database via API
// See: GET /api/games/whackpop/emojis  
// OLD: const TARGET_EMOJIS = [...] (8 hardcoded emojis)
// NEW: Emojis fetched dynamically from MongoDB

export default function WhackPopGame() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'finished'>('ready');
  const [difficulty, setDifficulty] = useState<Difficulty>('MEDIUM');
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targets, setTargets] = useState<Target[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [rewards, setRewards] = useState<{ xp: number; points: number } | null>(null);
  const [playerLevel, setPlayerLevel] = useState(1);
  const [isPremium, setIsPremium] = useState(false);
  const [emojis, setEmojis] = useState<string[]>([]);
  const [isLoadingEmojis, setIsLoadingEmojis] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Why: Fetch emojis from database on component mount
  useEffect(() => {
    const fetchEmojis = async () => {
      try {
        // Why: Check sessionStorage cache first
        const cached = sessionStorage.getItem('whackpop_emojis');
        
        if (cached) {
          const { emojis: cachedEmojis, timestamp } = JSON.parse(cached);
          // Why: Cache valid for 1 hour (emojis rarely change)
          if (Date.now() - timestamp < 60 * 60 * 1000) {
            console.log('Using cached emojis');
            setEmojis(cachedEmojis);
            setIsLoadingEmojis(false);
            return;
          }
        }

        // Why: Fetch from API
        const response = await fetch('/api/games/whackpop/emojis');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch emojis: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.ok || !data.data?.emojis) {
          throw new Error('Invalid response format');
        }

        const fetchedEmojis = data.data.emojis.map((e: { emoji: string }) => e.emoji);
        setEmojis(fetchedEmojis);

        // Why: Cache for 1 hour
        sessionStorage.setItem(
          'whackpop_emojis',
          JSON.stringify({
            emojis: fetchedEmojis,
            timestamp: Date.now(),
          })
        );

        setIsLoadingEmojis(false);
        console.log(`Loaded ${fetchedEmojis.length} emojis from database`);

      } catch (error) {
        console.error('Error fetching emojis:', error);
        // Why: Fallback to built-in emoji set if database is unavailable
        // This ensures the game is always playable
        try {
          const fallbackEmojis = [
            '🎯', '⚡', '🔥', '💥', '⭐', '🌟', '💫', '✨',
            '🎨', '🎭', '🎪', '🎬', '🎮', '🎲', '🎰', '🎸',
            '🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒',
            '⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱'
          ];
          
          console.log('Using fallback emoji set');
          setEmojis(fallbackEmojis);
          
          // Why: Cache fallback emojis
          sessionStorage.setItem(
            'whackpop_emojis',
            JSON.stringify({
              emojis: fallbackEmojis,
              timestamp: Date.now(),
            })
          );
          
          setIsLoadingEmojis(false);
        } catch (fallbackError) {
          console.error('Fallback emojis failed:', fallbackError);
          setFetchError(error instanceof Error ? error.message : 'Failed to load emojis');
          setIsLoadingEmojis(false);
        }
      }
    };

    fetchEmojis();
  }, []);

  // Why: Start game session
  const startGame = async () => {
    if (!session?.user) {
      console.error('No session found');
      return;
    }

    const config = DIFFICULTY_CONFIGS[difficulty];
    
    try {
      const playerId = (session.user as { id: string }).id;

      const response = await fetch('/api/game-sessions/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId,
          gameId: 'whackpop',
          difficulty,
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
    setTimeLeft(config.duration);
    setScore(0);
    setHits(0);
    setMisses(0);
    setTargets([]);
  };

  // Why: Spawn targets randomly during gameplay
  const spawnTarget = useCallback(() => {
    if (emojis.length === 0) return; // Why: Wait for emojis to load
    
    const config = DIFFICULTY_CONFIGS[difficulty];
    const id = Date.now();
    const position = Math.floor(Math.random() * 9); // 9 positions (3x3 grid)
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    setTargets((prev) => {
      // Why: Limit targets based on difficulty to avoid overwhelming player
      if (prev.length >= config.maxTargets) return prev;
      return [...prev, { id, position, emoji }];
    });

    // Why: Remove target based on difficulty lifetime if not clicked
    setTimeout(() => {
      setTargets((prev) => prev.filter((t) => t.id !== id));
      // Track missed targets
      setMisses((prev) => prev + 1);
    }, config.targetLifetime);
  }, [difficulty, emojis]);

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

  // Why: Spawn targets at difficulty-based frequency
  useEffect(() => {
    if (gameState !== 'playing') return;

    const config = DIFFICULTY_CONFIGS[difficulty];
    // Why: Random spawn interval within difficulty range for unpredictability
    const getRandomInterval = () => {
      const range = config.spawnIntervalMax - config.spawnIntervalMin;
      return config.spawnIntervalMin + Math.random() * range;
    };

    const scheduleNextSpawn = () => {
      const interval = getRandomInterval();
      return setTimeout(() => {
        spawnTarget();
        scheduleNextSpawn();
      }, interval);
    };

    const timeout = scheduleNextSpawn();
    return () => clearTimeout(timeout);
  }, [gameState, difficulty, spawnTarget, emojis]);

  // Why: Handle target hit
  const handleHit = (targetId: number) => {
    const config = DIFFICULTY_CONFIGS[difficulty];
    setTargets((prev) => prev.filter((t) => t.id !== targetId));
    setHits((prev) => prev + 1);
    setScore((prev) => prev + config.pointsPerHit);
  };

  // Why: Handle miss (clicking empty space)
  const handleMiss = () => {
    // No penalty for clicking empty space - only missed targets count
  };

  // Why: Complete game session
  const finishGame = async () => {
    setGameState('finished');
    const config = DIFFICULTY_CONFIGS[difficulty];

    if (sessionId) {
      try {
        const totalTargets = hits + misses;
        const accuracy = totalTargets > 0 ? Math.round((hits / totalTargets) * 100) : 0;
        const isWin = hits >= config.hitsToWin;
        const finalScore = Math.round(score * config.pointsMultiplier);
        
        const response = await fetch('/api/game-sessions/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            score: finalScore,
            isWin,
            outcome: isWin ? 'win' : 'loss',
            duration: config.duration,
            accuracy,
            difficulty,
            metadata: { hits, misses },
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

  // Why: Show loading while fetching emojis
  if (isLoadingEmojis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center">
        <div className="text-white text-2xl">Loading emojis...</div>
      </div>
    );
  }

  // Why: Show error if emoji loading failed
  if (fetchError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Game</h2>
          <p className="text-gray-600 mb-6">{fetchError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-xl font-bold hover:from-orange-700 hover:to-red-700 transition-all"
          >
            Reload Page
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

  // Auth check
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  // Ready screen
  if (gameState === 'ready') {
    const config = DIFFICULTY_CONFIGS[difficulty];
    const canPlayDifficulty = !config.isPremium || isPremium;

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
          <div className="text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">WHACKPOP</h1>
            <p className="text-xl text-gray-600 mb-8">
              Click the targets as fast as you can!
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
                          ? 'bg-gradient-to-br from-orange-600 to-red-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                        ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      {isLocked && '🔒 '}
                      {diff}
                      <div className="text-xs mt-1 opacity-80">
                        {diffConfig.duration}s • {diffConfig.hitsToWin} hits
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-6 mb-8">
              <h3 className="font-bold text-gray-900 mb-4">How to Play:</h3>
              <ul className="text-left text-gray-700 space-y-2">
                <li>• Click targets before they disappear</li>
                <li>• {config.duration} seconds gameplay</li>
                <li>• +{config.pointsPerHit} points per hit</li>
                <li>• Targets last {config.targetLifetime}ms</li>
                <li>• Get {config.hitsToWin}+ hits to win!</li>
              </ul>
            </div>

            <button
              onClick={startGame}
              disabled={!canPlayDifficulty}
              className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-12 py-4 rounded-xl font-bold text-xl hover:from-orange-700 hover:to-red-700 transform hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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

  // Finished screen
  if (gameState === 'finished') {
    const config = DIFFICULTY_CONFIGS[difficulty];
    const isWin = hits >= config.hitsToWin;
    const totalTargets = hits + misses;
    const accuracy = totalTargets > 0 ? Math.round((hits / totalTargets) * 100) : 0;
    const finalScore = Math.round(score * config.pointsMultiplier);

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
          <div className="text-center">
            {/* Win/Loss Indicator */}
            <div className="text-8xl mb-4 animate-bounce">
              {isWin ? '🏆' : '💪'}
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              {isWin ? 'Victory!' : 'Good Try!'}
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              {isWin 
                ? `You reached ${hits} hits! Amazing reflexes! 🎯`
                : `You got ${hits}/${config.hitsToWin} hits. Keep practicing!`
              }
            </p>

            {/* Stats Grid */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Game Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <div className="text-3xl font-bold text-orange-600">{finalScore}</div>
                  <div className="text-sm text-gray-600">Final Score</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-3xl font-bold text-green-600">{hits}</div>
                  <div className="text-sm text-gray-600">Hits</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-3xl font-bold text-blue-600">{accuracy}%</div>
                  <div className="text-sm text-gray-600">Accuracy</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-600">{difficulty}</div>
                  <div className="text-sm text-gray-600">Difficulty</div>
                </div>
              </div>
            </div>

            {/* Rewards Section */}
            {rewards && (
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 mb-6 border-2 border-orange-200">
                <h3 className="font-bold text-gray-900 mb-4 text-xl">🎁 Rewards Earned!</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-white rounded-lg p-3">
                    <span className="font-medium text-gray-700">Experience Points</span>
                    <span className="text-xl font-bold text-purple-600">+{rewards.xp || 0} XP</span>
                  </div>
                  <div className="flex items-center justify-between bg-white rounded-lg p-3">
                    <span className="font-medium text-gray-700">Points</span>
                    <span className="text-xl font-bold text-orange-600">+{rewards.points || 0} 💎</span>
                  </div>
                  {(rewards as any).levelsGained > 0 && (
                    <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg p-4 border-2 border-yellow-400">
                      <div className="text-2xl font-bold text-yellow-800 animate-pulse">
                        🎉 Level Up! +{(rewards as any).levelsGained} Level(s)!
                      </div>
                    </div>
                  )}
                  {(rewards as any).achievementsUnlocked?.length > 0 && (
                    <div className="bg-gradient-to-r from-green-100 to-green-200 rounded-lg p-4 border-2 border-green-400">
                      <div className="font-bold text-green-800 mb-2">🏅 New Achievements!</div>
                      {(rewards as any).achievementsUnlocked.map((achievement: any, idx: number) => (
                        <div key={idx} className="text-sm text-green-700">
                          • {achievement.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setGameState('ready');
                  setRewards(null);
                }}
                className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-orange-700 hover:to-red-700 transform hover:scale-105 transition-all shadow-lg"
              >
                🔄 Play Again
              </button>
              <button
                onClick={() => router.push('/games')}
                className="flex-1 bg-gray-200 text-gray-800 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-300 transition-all"
              >
                ← Back to Games
              </button>
            </div>
            
            {/* Dashboard Link */}
            <button
              onClick={() => router.push('/dashboard')}
              className="mt-4 text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              View Dashboard →
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
          Click the targets quickly! Difficulty: {difficulty} 🎯
        </div>
      </div>
    );
  }

  return null;
}
