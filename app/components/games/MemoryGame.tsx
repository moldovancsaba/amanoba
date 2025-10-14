'use client';

/**
 * Memory Card Matching Game Component
 * 
 * Interactive card-flipping game with full gamification integration.
 * Features animations, sound effects, and responsive design.
 * 
 * Why this implementation:
 * - Client-only rendering for game state management
 * - Smooth animations using Tailwind and transitions
 * - Session integration for points, XP, achievements
 * - Responsive grid that adapts to screen size
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Play,
  Pause,
  RotateCcw,
  Trophy,
  Clock,
  Zap,
  Target,
} from 'lucide-react';
import {
  type MemoryDifficulty,
  type MemoryGameState,
  type MemoryGameConfig,
  getDifficultyConfig,
  initializeGame,
  flipCard,
  checkMatch,
  resetFlippedCards,
  calculateScore,
  updateTime,
  togglePause,
  getGameStats,
} from '@/lib/games/memory-engine';

interface MemoryGameProps {
  playerId: string;
  isPremium: boolean;
  onGameComplete?: (score: number, stats: any) => void;
}

export default function MemoryGame({
  playerId,
  isPremium,
  onGameComplete,
}: MemoryGameProps) {
  const router = useRouter();
  
  // Game configuration
  const [difficulty, setDifficulty] = useState<MemoryDifficulty>('MEDIUM');
  const [config, setConfig] = useState<MemoryGameConfig>(getDifficultyConfig('MEDIUM'));
  
  // Game state
  const [gameState, setGameState] = useState<MemoryGameState | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  // Timer
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Pending flip handling
  const flipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize game
  const startNewGame = useCallback(async () => {
    const newConfig = getDifficultyConfig(difficulty);
    setConfig(newConfig);
    const initialState = initializeGame(newConfig);
    setGameState(initialState);
    setGameStarted(true);
    
    // Start game session
    try {
      const response = await fetch('/api/game-sessions/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId,
          gameId: 'memory',
          difficulty,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setSessionId(data.sessionId);
      }
    } catch (error) {
      console.error('Failed to start session:', error);
    }
  }, [difficulty, playerId]);

  // Timer effect
  useEffect(() => {
    if (!gameState || !gameStarted || gameState.isPaused || gameState.isComplete) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    
    timerRef.current = setInterval(() => {
      setGameState(prev => {
        if (!prev) return prev;
        const newTime = prev.timeElapsed + 1;
        
        // Check for time limit
        if (newTime >= config.timeLimit) {
          clearInterval(timerRef.current!);
          return { ...prev, timeElapsed: config.timeLimit, isComplete: true };
        }
        
        return updateTime(prev, newTime);
      });
    }, 1000);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState?.isPaused, gameState?.isComplete, gameStarted, config.timeLimit]);

  // Handle card click
  const handleCardClick = useCallback((cardId: string) => {
    if (!gameState) return;
    
    const newState = flipCard(gameState, cardId);
    if (!newState) return;
    
    setGameState(newState);
    
    // Check for match after 2 cards flipped
    if (newState.flippedCards.length === 2) {
      // Clear any pending flip timeout
      if (flipTimeoutRef.current) {
        clearTimeout(flipTimeoutRef.current);
      }
      
      // Small delay to let user see both cards
      flipTimeoutRef.current = setTimeout(() => {
        setGameState(prev => {
          if (!prev) return prev;
          const checkedState = checkMatch(prev);
          
          // If no match, reset cards after another delay
          if (checkedState.moves > prev.moves && checkedState.flippedCards.length === 0) {
            // This means a move was made but no match
            setTimeout(() => {
              setGameState(current => current ? resetFlippedCards(current) : current);
            }, 800);
          }
          
          return checkedState;
        });
      }, 600);
    }
  }, [gameState]);

  // Handle pause/resume
  const handleTogglePause = useCallback(() => {
    if (!gameState) return;
    setGameState(togglePause(gameState));
  }, [gameState]);

  // Handle game completion
  useEffect(() => {
    if (!gameState || !gameState.isComplete || !sessionId) return;
    
    const completeSession = async () => {
      const finalScore = calculateScore(gameState, config);
      const stats = getGameStats(gameState, config);
      
      try {
        const response = await fetch('/api/game-sessions/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            score: finalScore,
            metrics: stats,
          }),
        });
        
        if (response.ok) {
          const data = await response.json();
          onGameComplete?.(finalScore, data);
        }
      } catch (error) {
        console.error('Failed to complete session:', error);
      }
    };
    
    completeSession();
  }, [gameState?.isComplete, sessionId, gameState, config, onGameComplete]);

  // Restart game
  const handleRestart = useCallback(() => {
    setGameState(null);
    setGameStarted(false);
    setSessionId(null);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (flipTimeoutRef.current) {
      clearTimeout(flipTimeoutRef.current);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (flipTimeoutRef.current) {
        clearTimeout(flipTimeoutRef.current);
      }
    };
  }, []);

  if (!gameStarted || !gameState) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-6">
        <h2 className="text-3xl font-bold text-center">Memory Match</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Find matching pairs of cards by flipping them over. Complete all pairs before time runs out!
        </p>
        
        <div className="space-y-4 w-full max-w-sm">
          <div className="space-y-2">
            <label className="text-sm font-medium">Difficulty</label>
            <div className="grid grid-cols-4 gap-2">
              {(['EASY', 'MEDIUM', 'HARD', 'EXPERT'] as MemoryDifficulty[]).map(diff => (
                <Button
                  key={diff}
                  variant={difficulty === diff ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDifficulty(diff)}
                  disabled={diff === 'EXPERT' && !isPremium}
                >
                  {diff === 'EXPERT' && !isPremium ? '🔒 ' : ''}{diff}
                </Button>
              ))}
            </div>
            {!isPremium && (
              <p className="text-xs text-muted-foreground">
                Expert mode requires Premium
              </p>
            )}
          </div>
          
          <Button onClick={startNewGame} size="lg" className="w-full">
            <Play className="mr-2 h-5 w-5" />
            Start Game
          </Button>
        </div>
      </div>
    );
  }

  const timeRemaining = config.timeLimit - gameState.timeElapsed;
  const gridCols = config.gridSize.cols;
  const gridRows = config.gridSize.rows;

  return (
    <div className="space-y-6 pb-8">
      {/* Game Stats Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">Time</p>
              <p className="text-lg font-bold">{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="text-xs text-muted-foreground">Moves</p>
              <p className="text-lg font-bold">{gameState.moves}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-xs text-muted-foreground">Pairs</p>
              <p className="text-lg font-bold">{gameState.matchedPairs} / {gameState.totalPairs}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-xs text-muted-foreground">Score</p>
              <p className="text-lg font-bold">{calculateScore(gameState, config)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Game Controls */}
      <div className="flex justify-center space-x-2">
        <Button
          onClick={handleTogglePause}
          variant="outline"
          disabled={gameState.isComplete}
        >
          {gameState.isPaused ? (
            <>
              <Play className="mr-2 h-4 w-4" />
              Resume
            </>
          ) : (
            <>
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </>
          )}
        </Button>
        
        <Button onClick={handleRestart} variant="outline">
          <RotateCcw className="mr-2 h-4 w-4" />
          Restart
        </Button>
      </div>

      {/* Card Grid */}
      <div
        className={`grid gap-3 mx-auto max-w-4xl`}
        style={{
          gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${gridRows}, minmax(0, 1fr))`,
        }}
      >
        {gameState.cards.map(card => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            disabled={
              gameState.isPaused ||
              gameState.isComplete ||
              card.isFlipped ||
              card.isMatched ||
              gameState.flippedCards.length >= 2
            }
            className={`
              aspect-square rounded-lg transition-all duration-300 transform
              ${card.isFlipped || card.isMatched
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white scale-100'
                : 'bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 hover:scale-105 active:scale-95'
              }
              ${card.isMatched ? 'opacity-50 cursor-not-allowed' : ''}
              disabled:cursor-not-allowed disabled:hover:scale-100
              shadow-md hover:shadow-lg
            `}
          >
            <div className="flex items-center justify-center h-full text-4xl md:text-5xl lg:text-6xl">
              {card.isFlipped || card.isMatched ? card.value : '?'}
            </div>
          </button>
        ))}
      </div>

      {/* Game Complete Overlay */}
      {gameState.isComplete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="p-8 max-w-md w-full space-y-6 animate-in zoom-in duration-300">
            <div className="text-center space-y-2">
              <Trophy className="h-16 w-16 text-yellow-500 mx-auto" />
              <h2 className="text-3xl font-bold">
                {gameState.matchedPairs === gameState.totalPairs ? 'Victory!' : 'Time Up!'}
              </h2>
              <p className="text-muted-foreground">
                {gameState.matchedPairs === gameState.totalPairs
                  ? 'You found all the pairs!'
                  : `You found ${gameState.matchedPairs} of ${gameState.totalPairs} pairs`
                }
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Final Score:</span>
                <span className="font-bold">{calculateScore(gameState, config)}</span>
              </div>
              <div className="flex justify-between">
                <span>Moves:</span>
                <span className="font-bold">{gameState.moves}</span>
              </div>
              <div className="flex justify-between">
                <span>Time:</span>
                <span className="font-bold">{Math.floor(gameState.timeElapsed / 60)}:{(gameState.timeElapsed % 60).toString().padStart(2, '0')}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button onClick={handleRestart} className="w-full">
                Play Again
              </Button>
              <Button onClick={() => router.push('/dashboard')} variant="outline" className="w-full">
                Back to Dashboard
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
