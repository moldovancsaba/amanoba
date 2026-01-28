'use client';

/**
 * Sudoku Game Page
 * Complete Sudoku implementation with premium features
 * Version: 2.1.0
 */

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Play, RotateCcw, Lightbulb, X, Clock, Trophy, Zap } from 'lucide-react';
import { LocaleLink } from '@/components/LocaleLink';
import { useRouter } from 'next/navigation';
import {
  type SudokuGrid,
  type SudokuDifficulty,
  generatePuzzle,
  cloneGrid,
  validatePuzzle,
  getHint,
  isPuzzleComplete,
  getCompletionPercentage,
} from '@/app/lib/games/sudoku-engine';

export default function SudokuGame() {
  let session = null;
  let status = 'loading';
  
  try {
    const sessionData = useSession();
    session = sessionData.data;
    status = sessionData.status;
  } catch (error) {
    // Handle SSR/build time when session provider might not be available
    if (process.env.NODE_ENV === 'development') console.log('Session not available during build');
  }
  
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  
  // Game state
  const [difficulty, setDifficulty] = useState<SudokuDifficulty>('medium');
  const [ghostMode, setGhostMode] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [puzzle, setPuzzle] = useState<SudokuGrid | null>(null);
  const [solution, setSolution] = useState<SudokuGrid | null>(null);
  const [initialPuzzle, setInitialPuzzle] = useState<SudokuGrid | null>(null);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [hintsUsed, setHintsUsed] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [rewards, setRewards] = useState<{ points: number; xp: number; streakBonus?: number } | null>(null);
  const [completedChallenges, setCompletedChallenges] = useState<Array<{ title: string; rewardsEarned: { points: number; xp: number } }>>([]);
  const [isCompleting, setIsCompleting] = useState(false);
  
  // Premium check
  const isPremium = (session?.user as Record<string, unknown>)?.isPremium as boolean || false;
  const maxFreeHints = 3;
  
  // Client-side mounting check
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Timer effect
  useEffect(() => {
    if (!gameStarted || isComplete) return;
    
    const interval = setInterval(() => {
      setTimer(t => t + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [gameStarted, isComplete]);
  
  // Start new game
  const startNewGame = async () => {
    const { puzzle: newPuzzle, solution: newSolution } = generatePuzzle(difficulty);
    setPuzzle(cloneGrid(newPuzzle));
    setSolution(newSolution);
    setInitialPuzzle(cloneGrid(newPuzzle));
    setGameStarted(true);
    setSelectedCell(null);
    setErrors(new Set());
    setHintsUsed(0);
    setTimer(0);
    setIsComplete(false);
    
    // Why: Start game session for rewards tracking
    if (session) {
      try {
        const response = await fetch('/api/game-sessions/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            playerId: session.user.id,
            gameId: 'sudoku',
            difficulty: difficulty.toUpperCase(),
          }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setSessionId(data.sessionId);
        }
      } catch (error) {
        console.error('Failed to start game session:', error);
      }
    }
  };
  
  // Handle cell changes
  const handleCellChange = (row: number, col: number, value: number | null) => {
    if (!puzzle || !initialPuzzle || isComplete) return;
    if (initialPuzzle[row][col] !== null) return;
    
    const newPuzzle = cloneGrid(puzzle);
    newPuzzle[row][col] = value;
    setPuzzle(newPuzzle);
    
    const validation = validatePuzzle(newPuzzle);
    const newErrors = new Set<string>();
    validation.errors.forEach(error => {
      newErrors.add(`${error.row}-${error.col}`);
    });
    setErrors(newErrors);
    
    if (isPuzzleComplete(newPuzzle)) {
      setIsComplete(true);
      completeGame(true);
    }
  };
  
  // Use hint
  const useHint = () => {
    if (!puzzle || !solution || isComplete) return;
    
    if (!isPremium && hintsUsed >= maxFreeHints) {
      alert(`Free players get ${maxFreeHints} hints per game. Upgrade to Premium for unlimited hints!`);
      return;
    }
    
    const hint = getHint(puzzle, solution);
    if (hint) {
      const newPuzzle = cloneGrid(puzzle);
      newPuzzle[hint.row][hint.col] = hint.value;
      setPuzzle(newPuzzle);
      setHintsUsed(h => h + 1);
      setSelectedCell([hint.row, hint.col]);
      
      const validation = validatePuzzle(newPuzzle);
      const newErrors = new Set<string>();
      validation.errors.forEach(error => {
        newErrors.add(`${error.row}-${error.col}`);
      });
      setErrors(newErrors);
    }
  };
  
  // Complete game
  const completeGame = async (won: boolean) => {
    if (!session || !sessionId) return;
    
    try {
      setIsCompleting(true);
      // Why: Calculate score based on time and hints penalty
      const finalScore = won ? Math.max(1000 - timer - (hintsUsed * 50), 100) : 0;
      
      const res = await fetch('/api/game-sessions/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          score: finalScore,
          isWin: won,
          outcome: won ? 'win' : 'loss',
          duration: timer,
          hintsUsed,
          difficulty: difficulty.toUpperCase(),
          metadata: {
            difficulty,
            completion: puzzle ? getCompletionPercentage(puzzle) : 0,
            ghost: ghostMode,
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
      console.error('Failed to complete game:', error);
    } finally {
      setIsCompleting(false);
    }
  };
  
  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Ensure client-side only
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }
  
  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center">
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
  
  // Premium notice (no blocking for non-premium users)
  // Free users get limited hints; premium users get unlimited hints and extras.
  
  // Difficulty selection
  if (!gameStarted || !puzzle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-full font-bold mb-4">
              <Zap className="w-5 h-5" />
              PREMIUM
            </div>
            
            <h1 className="text-5xl font-bold text-white mb-4">🔢 Sudoku</h1>
            <p className="text-xl text-white/90">Choose your difficulty level</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {(['easy', 'medium', 'hard', 'expert'] as SudokuDifficulty[]).map(level => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`p-6 rounded-2xl transition-all ${
                  difficulty === level
                    ? 'bg-white text-indigo-600 shadow-lg scale-105'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <div className="text-2xl font-bold mb-2 capitalize">{level}</div>
                <div className="text-sm opacity-80">
                  {level === 'easy' && '~38% empty'}
                  {level === 'medium' && '~55% empty'}
                  {level === 'hard' && '~64% empty'}
                  {level === 'expert' && '~71% empty'}
                </div>
              </button>
            ))}
          </div>
          
          {/* Ghost/Practice mode toggle */}
          <label className="flex items-center gap-3 mb-4 text-white/90">
            <input type="checkbox" checked={ghostMode} onChange={(e) => setGhostMode(e.target.checked)} />
            <span>Practice (Ghost) mode — no XP/points, just practice</span>
          </label>
          <button onClick={startNewGame} className="w-full bg-white text-indigo-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
            <Play className="w-6 h-6" />
            Start Game
          </button>
          
          <LocaleLink href="/games" className="block text-center text-white/80 hover:text-white mt-4 transition-colors">
            Back to Games
          </LocaleLink>
        </div>
      </div>
    );
  }
  
  // Game board
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            🔢 Sudoku <span className="text-sm font-normal bg-white/20 px-3 py-1 rounded-full capitalize">{difficulty}</span>
          </h1>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white">
              <Clock className="w-5 h-5" />
              <span className="font-mono text-lg">{formatTime(timer)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-white">
              <Lightbulb className="w-5 h-5" />
              <span className="font-mono text-lg">{hintsUsed} {!isPremium && `/ ${maxFreeHints}`}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 mb-4 shadow-2xl">
          <div className="grid grid-cols-9 gap-0 border-4 border-gray-800 mx-auto" style={{ width: 'fit-content' }}>
            {puzzle.map((row, rowIdx) =>
              row.map((cell, colIdx) => {
                const isGiven = initialPuzzle && initialPuzzle[rowIdx][colIdx] !== null;
                const isSelected = selectedCell?.[0] === rowIdx && selectedCell?.[1] === colIdx;
                const hasError = errors.has(`${rowIdx}-${colIdx}`);
                const isThickRight = (colIdx + 1) % 3 === 0 && colIdx < 8;
                const isThickBottom = (rowIdx + 1) % 3 === 0 && rowIdx < 8;
                
                return (
                  <div
                    key={`${rowIdx}-${colIdx}`}
                    onClick={() => !isGiven && setSelectedCell([rowIdx, colIdx])}
                    className={`w-12 h-12 flex items-center justify-center text-xl font-bold cursor-pointer transition-colors border border-gray-300 ${
                      isThickRight ? 'border-r-4 border-r-gray-800' : ''
                    } ${
                      isThickBottom ? 'border-b-4 border-b-gray-800' : ''
                    } ${
                      isGiven ? 'bg-gray-100 text-gray-900' :
                      isSelected ? 'bg-indigo-100' :
                      hasError ? 'bg-red-100 text-red-600' :
                      cell ? 'bg-white text-indigo-600' :
                      'bg-white hover:bg-gray-50'
                    }`}
                  >
                    {cell || ''}
                  </div>
                );
              })
            )}
          </div>
          
          {selectedCell && !isComplete && (
            <div className="mt-6 flex justify-center gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button key={num} onClick={() => handleCellChange(selectedCell[0], selectedCell[1], num)} className="w-12 h-12 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors">
                  {num}
                </button>
              ))}
              <button onClick={() => handleCellChange(selectedCell[0], selectedCell[1], null)} className="w-12 h-12 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition-colors">
                <X className="w-6 h-6 mx-auto" />
              </button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <button onClick={useHint} disabled={isComplete || (!isPremium && hintsUsed >= maxFreeHints)} className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            <Lightbulb className="w-5 h-5" /> Get Hint
          </button>
          
          <button onClick={startNewGame} className="bg-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors backdrop-blur-lg flex items-center justify-center gap-2">
            <RotateCcw className="w-5 h-5" /> New Game
          </button>
          
          <LocaleLink href="/games" className="bg-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors backdrop-blur-lg flex items-center justify-center gap-2">
            Back
          </LocaleLink>
        </div>
        
        {isComplete && (
          <div className="bg-white rounded-2xl p-6 text-center shadow-2xl">
            <div className="text-6xl mb-2">🏆</div>
            <h2 className="text-3xl font-bold mb-2 text-gray-900">Puzzle Complete!</h2>
            <p className="text-lg text-gray-700 mb-4">Time: {formatTime(timer)} • Hints: {hintsUsed}</p>

            {/* Rewards */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-4">
              <div className="font-bold text-gray-900 mb-2 text-xl">Rewards {isCompleting && <span className="text-sm text-gray-500">Calculating…</span>}</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3">
                  <div className="text-2xl font-bold text-purple-600">{rewards ? `+${rewards.xp || 0}` : '—'}</div>
                  <div className="text-sm text-gray-600">XP</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-2xl font-bold text-indigo-600">{rewards ? `+${rewards.points || 0}` : '—'}</div>
                  <div className="text-sm text-gray-600">Points</div>
                </div>
              </div>
              {rewards?.streakBonus && rewards.streakBonus > 0 && (
                <div className="mt-2 text-orange-700 font-medium">🔥 Streak Bonus: +{Math.round(rewards.streakBonus * 100)}%</div>
              )}
            </div>

            {/* Daily challenges */}
            {completedChallenges.length > 0 && (
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-4 mb-4">
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
          </div>
        )}
      </div>
    </div>
  );
}
