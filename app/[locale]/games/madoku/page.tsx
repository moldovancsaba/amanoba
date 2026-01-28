'use client';

/**
 * Madoku Game Page
 * Competitive number-picking strategy game against AI
 * Version: 1.0.0
 */

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { RotateCcw, Home } from 'lucide-react';
import {
  type MadokuGameState,
  createInitialState,
  executeMove,
  isValidMove,
  getAvailableMoves,
} from '@/lib/games/madoku-engine';
import { findBestMove, getRandomAIPersona } from '@/lib/games/madoku-ai';

type AILevel = 1 | 2 | 3;

export default function MadokuGame() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Game setup
  const [aiLevel, setAiLevel] = useState<AILevel | null>(null);
  const [aiPersona, setAiPersona] = useState<{ name: string; emoji: string; color: string } | null>(null);
  const [ghostMode, setGhostMode] = useState(false);
  
  // Game state
  const [gameState, setGameState] = useState<MadokuGameState | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showGameOver, setShowGameOver] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [rewards, setRewards] = useState<{ points: number; xp: number; streakBonus?: number } | null>(null);
  const [completedChallenges, setCompletedChallenges] = useState<Array<{ title: string; rewardsEarned: { points: number; xp: number } }>>([]);
  const [isCompleting, setIsCompleting] = useState(false);
  
  // Player info
  const playerName = (session?.user as Record<string, unknown>)?.name as string || (session?.user as Record<string, unknown>)?.displayName as string || 'You';
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Start new game
  const startNewGame = async (level: AILevel) => {
    setAiLevel(level);
    setAiPersona(getRandomAIPersona(level));
    let newState = createInitialState();
    // Apply Ghost Mode transformation: randomly negate numbers to increase cognitive load ("Ghost Chili")
    if (ghostMode) {
      // Lazy import to avoid increasing initial bundle for non-ghost games
      const { applyGhost } = await import('@/lib/games/madoku-engine');
      newState = { ...newState, board: applyGhost(newState.board) };
    }
    setGameState(newState);
    setShowGameOver(false);
    
    // Start session for rewards
    if (session && !ghostMode) {
      try {
        const response = await fetch('/api/game-sessions/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            playerId: (session.user as Record<string, unknown>).id as string,
            gameId: 'madoku',
            difficulty: `AI_LEVEL_${level}`,
          }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setSessionId(data.sessionId);
        }
      } catch (error) {
        console.error('Failed to start session:', error);
      }
    }
  };
  
  // Handle player move
  const handleCellClick = (row: number, col: number) => {
    if (!gameState || gameState.gameEnded || gameState.currentPlayer !== 0) return;
    if (!isValidMove(gameState, row, col)) return;
    
    try {
      const newState = executeMove(gameState, row, col);
      setGameState(newState);
      
      if (newState.gameEnded) {
        handleGameEnd(newState);
      }
    } catch (error) {
      console.error('Invalid move:', error);
    }
  };
  
  // AI turn
  useEffect(() => {
    if (!gameState || !aiLevel || gameState.gameEnded) return;
    if (gameState.currentPlayer !== 1) return;
    if (gameState.allowedRowOrCol === null || gameState.picking === null) return;
    
    const timer = setTimeout(() => {
      try {
        const aiMove = findBestMove(
          gameState.board,
          gameState.allowedRowOrCol!,
          gameState.picking!,
          gameState.p2Score,
          gameState.p1Score,
          aiLevel
        );
        
        const newState = executeMove(gameState, aiMove.row, aiMove.col);
        setGameState(newState);
        
        if (newState.gameEnded) {
          handleGameEnd(newState);
        }
      } catch (error) {
        console.error('AI move failed:', error);
      }
    }, 800);
    
    return () => clearTimeout(timer);
  }, [gameState, aiLevel]);
  
  // Handle game end
  const handleGameEnd = async (finalState: MadokuGameState) => {
    setShowGameOver(true);
    
    if (!session || !sessionId || ghostMode) return;
    
    try {
      setIsCompleting(true);
      const won = finalState.winner === 0;
      const score = finalState.p1Score;
      
      const res = await fetch('/api/game-sessions/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          score,
          isWin: won,
          duration: finalState.totalTurns * 15, // Rough estimate
          outcome: won ? 'win' : (finalState.winner === null ? 'draw' : 'loss'),
          difficulty: `AI_LEVEL_${aiLevel}`,
          metadata: {
            ghost: ghostMode,
            aiLevel,
            p1Score: finalState.p1Score,
            p2Score: finalState.p2Score,
            totalTurns: finalState.totalTurns,
          },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setRewards(data.rewards);
        // Fetch updated challenges
        try {
          const playerId = (session.user as { id: string }).id;
          const chRes = await fetch(`/api/challenges?playerId=${playerId}&t=${Date.now()}`, { cache: 'no-store' });
          if (chRes.ok) {
            const ch = await chRes.json();
            const completed = (ch.challenges || []).filter((c: any) => c.isCompleted).map((c: any) => ({
              title: c.name,
              rewardsEarned: { points: c.rewards?.points || 0, xp: c.rewards?.xp || 0 },
            }));
            setCompletedChallenges(completed);
          }
        } catch (e) {
          if (process.env.NODE_ENV === 'development') console.warn('Challenges refresh failed', e);
        }
      }
    } catch (error) {
      console.error('Failed to complete session:', error);
    } finally {
      setIsCompleting(false);
    }
  };
  
  // Client-side only
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }
  
  // Loading
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }
  
  // Auth check
  if (!session) {
    if (typeof window !== 'undefined') {
      router.push('/auth/signin');
    }
    return null;
  }
  
  // Difficulty selection
  if (!gameState || !aiLevel) {
    const onAutoMatch = async () => {
      try {
        const res = await fetch(`/api/players/${(session!.user as Record<string, unknown>).id as string}/rank`);
        if (!res.ok) throw new Error('rank fetch failed');
        const data = await res.json();
        setGhostMode(data.recommended.isGhost);
        await startNewGame(data.recommended.aiLevel as AILevel);
      } catch (e) {
        console.error('Auto-match failed, falling back to Medium', e);
        setGhostMode(false);
        await startNewGame(2);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-4">🎯 Madoku</h1>
            <p className="text-xl text-white/90">Competitive Number-Picking Strategy Game</p>
            <p className="text-sm text-white/70 mt-2">Pick numbers to build your score. Next player picks from your row/col!</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => startNewGame(1)}
              className="p-6 rounded-2xl bg-green-500/20 hover:bg-green-500/30 border-2 border-green-500 text-white transition-all"
            >
              <div className="text-3xl mb-2">🤖</div>
              <div className="text-xl font-bold mb-2">Easy</div>
              <div className="text-sm opacity-80">Greedy AI</div>
            </button>
            
            <button
              onClick={() => startNewGame(2)}
              className="p-6 rounded-2xl bg-yellow-500/20 hover:bg-yellow-500/30 border-2 border-yellow-500 text-white transition-all"
            >
              <div className="text-3xl mb-2">🦾</div>
              <div className="text-xl font-bold mb-2">Medium</div>
              <div className="text-sm opacity-80">2-move lookahead</div>
            </button>
            
            <button
              onClick={() => startNewGame(3)}
              className="p-6 rounded-2xl bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500 text-white transition-all"
            >
              <div className="text-3xl mb-2">💡</div>
              <div className="text-xl font-bold mb-2">Hard</div>
              <div className="text-sm opacity-80">3+ move lookahead</div>
            </button>
          </div>

          <div className="mb-4">
            <label className="flex items-center justify-center gap-3 mb-2 text-white/90">
              <input type="checkbox" checked={ghostMode} onChange={(e) => setGhostMode(e.target.checked)} className="w-4 h-4" />
              <span>🌶️ Ghost Chili Mode — random negative numbers (practice, no rewards)</span>
            </label>
            <button
              onClick={onAutoMatch}
              className="w-full mt-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-colors"
            >
              🌙 Auto-Match (Rank-Based)
            </button>
          </div>
          
          <button
            onClick={() => router.push('/games')}
            className="w-full bg-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors"
          >
            Back to Games
          </button>
        </div>
      </div>
    );
  }
  
  // Game board
  const selectableCells = gameState.allowedRowOrCol !== null && gameState.picking !== null
    ? getAvailableMoves(gameState.board, gameState.allowedRowOrCol, gameState.picking)
    : [];
  
  const selectableSet = new Set(selectableCells.map(c => `${c.row}-${c.col}`));
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header with scores */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">👤</span>
            <div>
              <div className="text-xs text-white/70">{playerName}</div>
              <div className="text-3xl font-bold text-white">{gameState.p1Score}</div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-white/90 mb-1">
              {gameState.gameEnded ? '🏁 Game Over' : gameState.currentPlayer === 0 ? '🟢 Your Turn' : '🔴 AI Turn'}
            </div>
            <div className="text-xs text-white/70">
              Turn {gameState.totalTurns} • {gameState.picking === 'row' ? 'Pick from Row' : 'Pick from Column'} {gameState.allowedRowOrCol !== null ? gameState.allowedRowOrCol + 1 : ''}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-white/70">{aiPersona?.name || 'AI'}</div>
              <div className="text-3xl font-bold text-white">{gameState.p2Score}</div>
            </div>
            <span className="text-3xl">{aiPersona?.emoji || '🤖'}</span>
          </div>
        </div>
        
        {/* Game board */}
        <div className="bg-white rounded-2xl p-6 mb-4 shadow-2xl">
          <div className="grid grid-cols-9 gap-0 border-4 border-gray-800 mx-auto" style={{ width: 'fit-content' }}>
            {gameState.board.map((row, rowIdx) =>
              row.map((cell, colIdx) => {
                const isSelectable = selectableSet.has(`${rowIdx}-${colIdx}`);
                const isThickRight = (colIdx + 1) % 3 === 0 && colIdx < 8;
                const isThickBottom = (rowIdx + 1) % 3 === 0 && rowIdx < 8;
                const isEmpty = cell === null;
                
                return (
                  <div
                    key={`${rowIdx}-${colIdx}`}
                    onClick={() => handleCellClick(rowIdx, colIdx)}
                    className={`w-12 h-12 flex items-center justify-center text-xl font-bold transition-all border border-gray-300 ${
                      isThickRight ? 'border-r-4 border-r-gray-800' : ''
                    } ${
                      isThickBottom ? 'border-b-4 border-b-gray-800' : ''
                    } ${
                      isEmpty ? 'bg-gray-100' :
                      isSelectable ? 'bg-green-100 hover:bg-green-200 cursor-pointer hover:scale-110 shadow-lg' :
                      'bg-white text-gray-400'
                    }`}
                  >
                    {cell || ''}
                  </div>
                );
              })
            )}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => {
              setGameState(null);
              setAiLevel(null);
              setAiPersona(null);
              setShowGameOver(false);
            }}
            className="flex-1 bg-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" /> New Game
          </button>
          
          <button
            onClick={() => router.push('/games')}
            className="flex-1 bg-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" /> Back to Games
          </button>
        </div>
        
        {/* Game Over Dialog */}
        {showGameOver && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center animate-bounce-in">
              <div className="text-6xl mb-4">
                {gameState.winner === 0 ? '🏆' : gameState.winner === 1 ? '😞' : '🤝'}
              </div>
              
              <h2 className="text-3xl font-bold mb-2 text-gray-900">
                {gameState.winner === 0 ? 'You Win!' : gameState.winner === 1 ? 'AI Wins!' : "It's a Tie!"}
              </h2>
              
              <div className="bg-gray-100 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold">{playerName}</span>
                  <span className="text-2xl font-bold text-indigo-600">{gameState.p1Score}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">{aiPersona?.name || 'AI'}</span>
                  <span className="text-2xl font-bold text-purple-600">{gameState.p2Score}</span>
                </div>
              </div>
              
              {/* Rewards */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-4">
                <div className="font-bold text-gray-900 mb-2">
                  Rewards {isCompleting && <span className="text-sm text-gray-500">Calculating…</span>}
                </div>
                <div className="flex justify-between">
                  <span>XP</span>
                  <span className="font-bold text-purple-600">{rewards ? `+${rewards.xp || 0}` : '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Points</span>
                  <span className="font-bold text-indigo-600">{rewards ? `+${rewards.points || 0}` : '—'}</span>
                </div>
                {rewards?.streakBonus && rewards.streakBonus > 0 && (
                  <div className="text-sm text-orange-700 mt-2">🔥 Streak Bonus: +{Math.round(rewards.streakBonus * 100)}%</div>
                )}
              </div>
              
              {/* Daily challenges */}
              {completedChallenges.length > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-4 mb-4 text-left">
                  <div className="font-bold text-gray-900 mb-2">Daily Challenges Completed</div>
                  <div className="space-y-1 text-sm">
                    {completedChallenges.map((c, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>• {c.title}</span>
                        <span>+{c.rewardsEarned.points}pts • +{c.rewardsEarned.xp}xp</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setGameState(null);
                    setAiLevel(null);
                    setAiPersona(null);
                    setShowGameOver(false);
                  }}
                  className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Play Again
                </button>
                
                <button
                  onClick={() => router.push('/games')}
                  className="flex-1 bg-gray-200 text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  Exit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
