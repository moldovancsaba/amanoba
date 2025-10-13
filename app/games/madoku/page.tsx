'use client';

/**
 * Madoku Game Page
 * Complete Sudoku implementation with premium features
 * Version: 2.1.0
 */

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Lock, Play, RotateCcw, Lightbulb, Check, X, Clock, Trophy, Zap } from 'lucide-react';
import Link from 'next/link';
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

export default function MadokuGame() {
  let session = null;
  let status = 'loading';
  
  try {
    const sessionData = useSession();
    session = sessionData.data;
    status = sessionData.status;
  } catch (error) {
    // Handle SSR/build time when session provider might not be available
    console.log('Session not available during build');
  }
  
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  
  // Game state
  const [difficulty, setDifficulty] = useState<SudokuDifficulty>('medium');
  const [gameStarted, setGameStarted] = useState(false);
  const [puzzle, setPuzzle] = useState<SudokuGrid | null>(null);
  const [solution, setSolution] = useState<SudokuGrid | null>(null);
  const [initialPuzzle, setInitialPuzzle] = useState<SudokuGrid | null>(null);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [hintsUsed, setHintsUsed] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  // Premium check
  const isPremium = (session?.user as any)?.isPremium || false;
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
  const startNewGame = () => {
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
    if (!session) return;
    
    try {
      await fetch('/api/game-sessions/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: (session.user as any).playerId,
          gameId: 'madoku',
          won,
          score: won ? Math.max(1000 - timer - (hintsUsed * 50), 100) : 0,
          metadata: {
            difficulty,
            time: timer,
            hintsUsed,
            completion: puzzle ? getCompletionPercentage(puzzle) : 0,
          },
        }),
      });
    } catch (error) {
      console.error('Failed to complete game:', error);
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
  
  // Premium gate
  if (!isPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-full font-bold mb-6">
            <Lock className="w-5 h-5" />
            PREMIUM ONLY
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-4">🎯 Madoku</h1>
          <p className="text-2xl text-white/90 mb-8">Premium Sudoku Experience</p>
          
          <div className="bg-white/20 rounded-2xl p-6 mb-8">
            <p className="text-white/90 text-lg leading-relaxed mb-4">
              <strong className="text-white">Madoku features:</strong>
            </p>
            
            <ul className="text-white/90 text-left space-y-2 max-w-md mx-auto">
              <li className="flex items-center gap-2"><Check className="w-5 h-5" /> 4 difficulty levels</li>
              <li className="flex items-center gap-2"><Check className="w-5 h-5" /> Unlimited hints</li>
              <li className="flex items-center gap-2"><Check className="w-5 h-5" /> Real-time validation</li>
              <li className="flex items-center gap-2"><Check className="w-5 h-5" /> Best time tracking</li>
              <li className="flex items-center gap-2"><Check className="w-5 h-5" /> Premium achievements</li>
            </ul>
          </div>
          
          <div className="space-x-4">
            <Link href="/games" className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              Back to Games
            </Link>
            
            <button onClick={() => alert('Premium subscription coming soon!')} className="inline-block bg-yellow-400 text-black px-8 py-3 rounded-full font-semibold hover:bg-yellow-300 transition-colors">
              Upgrade to Premium
            </button>
          </div>
        </div>
      </div>
    );
  }
  
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
            
            <h1 className="text-5xl font-bold text-white mb-4">🎯 Madoku</h1>
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
          
          <button onClick={startNewGame} className="w-full bg-white text-indigo-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
            <Play className="w-6 h-6" />
            Start Game
          </button>
          
          <Link href="/games" className="block text-center text-white/80 hover:text-white mt-4 transition-colors">
            Back to Games
          </Link>
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
            🎯 Madoku <span className="text-sm font-normal bg-white/20 px-3 py-1 rounded-full capitalize">{difficulty}</span>
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
          
          <Link href="/games" className="bg-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors backdrop-blur-lg flex items-center justify-center gap-2">
            Back
          </Link>
        </div>
        
        {isComplete && (
          <div className="bg-green-500 text-white rounded-2xl p-6 text-center animate-bounce-in">
            <Trophy className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Puzzle Complete!</h2>
            <p className="text-xl mb-4">Time: {formatTime(timer)}</p>
            <p className="text-lg">Hints used: {hintsUsed}</p>
          </div>
        )}
      </div>
    </div>
  );
}
