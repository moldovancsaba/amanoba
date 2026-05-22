'use client';

/**
 * Madoku Game Page
 * Competitive number-picking strategy game against AI
 * Version: 1.0.0
 */

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Button,
  Card,
  Center,
  Checkbox,
  Container,
  Grid,
  Group,
  Loader,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconHome, IconRefresh } from '@tabler/icons-react';
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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const signInUrl = `/auth/signin?callbackUrl=${encodeURIComponent(
    `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ''}`
  )}`;
  
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
  
  // Handle game end
  const handleGameEnd = useCallback(async (finalState: MadokuGameState) => {
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
            const completed = (ch.challenges || []).filter((c: { isCompleted?: boolean }) => c.isCompleted).map((c: { name?: string; rewards?: { points?: number; xp?: number } }) => ({
              title: c.name,
              rewardsEarned: { points: c.rewards?.points || 0, xp: c.rewards?.xp || 0 },
            }));
            setCompletedChallenges(completed);
          }
        } catch (_e) {
          // Challenges refresh failed (non-critical)
        }
      }
    } catch (error) {
      console.error('Failed to complete session:', error);
    } finally {
      setIsCompleting(false);
    }
  }, [aiLevel, ghostMode, session, sessionId]);

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
  }, [aiLevel, gameState, handleGameEnd]);
  
  // Client-side only
  if (!isClient) {
    return (
      <Center mih="100vh">
        <Loader />
      </Center>
    );
  }
  
  // Loading
  if (status === 'loading') {
    return (
      <Center mih="100vh">
        <Loader />
      </Center>
    );
  }
  
  // Auth check
  if (!session) {
    if (typeof window !== 'undefined') {
      router.push(signInUrl);
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
      } catch (err) {
        console.error('Auto-match failed, falling back to Medium', err);
        setGhostMode(false);
        await startNewGame(2);
      }
    };

    return (
      <Container size="sm" py="xl">
        <Card withBorder p="xl">
          <Stack gap="xl">
          <Stack align="center" gap="sm">
            <Title order={1}>🎯 Madoku</Title>
            <Text c="dimmed">Competitive Number-Picking Strategy Game</Text>
            <Text size="sm" c="dimmed" ta="center">Pick numbers to build your score. Next player picks from your row/col.</Text>
          </Stack>
          
          <SimpleGrid cols={{ base: 1, md: 3 }}>
            <Button
              onClick={() => startNewGame(1)}
              variant="default"
              h="auto"
              py="lg"
            >
              <Stack align="center" gap={2}>
                <Text size="xl">🤖</Text>
                <Text fw={700}>Easy</Text>
                <Text size="sm">Greedy AI</Text>
              </Stack>
            </Button>
            
            <Button
              onClick={() => startNewGame(2)}
              variant="default"
              h="auto"
              py="lg"
            >
              <Stack align="center" gap={2}>
                <Text size="xl">🦾</Text>
                <Text fw={700}>Medium</Text>
                <Text size="sm">2-move lookahead</Text>
              </Stack>
            </Button>
            
            <Button
              onClick={() => startNewGame(3)}
              variant="default"
              h="auto"
              py="lg"
            >
              <Stack align="center" gap={2}>
                <Text size="xl">💡</Text>
                <Text fw={700}>Hard</Text>
                <Text size="sm">3+ move lookahead</Text>
              </Stack>
            </Button>
          </SimpleGrid>

          <Stack>
            <Checkbox
              checked={ghostMode}
              onChange={(event) => setGhostMode(event.currentTarget.checked)}
              label="🌶️ Ghost Chili Mode - random negative numbers (practice, no rewards)"
            />
            <Button
              onClick={onAutoMatch}
              fullWidth
            >
              🌙 Auto-Match (Rank-Based)
            </Button>
          </Stack>
          
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
  
  // Game board
  const selectableCells = gameState.allowedRowOrCol !== null && gameState.picking !== null
    ? getAvailableMoves(gameState.board, gameState.allowedRowOrCol, gameState.picking)
    : [];
  
  const selectableSet = new Set(selectableCells.map(c => `${c.row}-${c.col}`));
  
  return (
    <Container size="lg" py="xl">
      <Stack gap="md">
        {/* Header with scores */}
        <Card withBorder>
          <Group justify="space-between">
          <Group>
            <Text size="xl">👤</Text>
            <div>
              <Text size="xs" c="dimmed">{playerName}</Text>
              <Title order={2}>{gameState.p1Score}</Title>
            </div>
          </Group>
          
          <Stack gap={0} align="center">
            <Text size="sm">
              {gameState.gameEnded ? '🏁 Game Over' : gameState.currentPlayer === 0 ? '🟢 Your Turn' : '🔴 AI Turn'}
            </Text>
            <Text size="xs" c="dimmed">
              Turn {gameState.totalTurns} • {gameState.picking === 'row' ? 'Pick from Row' : 'Pick from Column'} {gameState.allowedRowOrCol !== null ? gameState.allowedRowOrCol + 1 : ''}
            </Text>
          </Stack>
          
          <Group>
            <div>
              <Text size="xs" c="dimmed" ta="right">{aiPersona?.name || 'AI'}</Text>
              <Title order={2} ta="right">{gameState.p2Score}</Title>
            </div>
            <Text size="xl">{aiPersona?.emoji || '🤖'}</Text>
          </Group>
          </Group>
        </Card>
        
        {/* Game board */}
        <Card withBorder p="lg">
          <SimpleGrid cols={9} spacing={0} w="fit-content" mx="auto">
            {gameState.board.map((row, rowIdx) =>
              row.map((cell, colIdx) => {
                const isSelectable = selectableSet.has(`${rowIdx}-${colIdx}`);
                const isEmpty = cell === null;
                
                return (
                  <Button
                    key={`${rowIdx}-${colIdx}`}
                    onClick={() => handleCellClick(rowIdx, colIdx)}
                    variant={isSelectable ? 'filled' : 'default'}
                    color={isSelectable ? 'green' : 'dark'}
                    w={48}
                    h={48}
                    p={0}
                    disabled={isEmpty || !isSelectable}
                  >
                    {cell || ''}
                  </Button>
                );
              })
            )}
          </SimpleGrid>
        </Card>
        
        {/* Action buttons */}
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
          <Button
            fullWidth
            onClick={() => {
              setGameState(null);
              setAiLevel(null);
              setAiPersona(null);
              setShowGameOver(false);
            }}
            variant="default"
            leftSection={<IconRefresh size={18} />}
          >
            New Game
          </Button>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 6 }}>
          <Button
            fullWidth
            onClick={() => router.push('/games')}
            variant="default"
            leftSection={<IconHome size={18} />}
          >
            Back to Games
          </Button>
          </Grid.Col>
        </Grid>
        
        {/* Game Over Dialog */}
        <Modal opened={showGameOver} onClose={() => setShowGameOver(false)} centered title="Game result">
              <Stack align="center">
              <Text size="xl">
                {gameState.winner === 0 ? '🏆' : gameState.winner === 1 ? '😞' : '🤝'}
              </Text>
              
              <Title order={2}>
                {gameState.winner === 0 ? 'You Win!' : gameState.winner === 1 ? 'AI Wins!' : "It's a Tie!"}
              </Title>
              
              <Card withBorder w="100%">
                <Group justify="space-between">
                  <Text fw={600}>{playerName}</Text>
                  <Text fw={700}>{gameState.p1Score}</Text>
                </Group>
                <Group justify="space-between">
                  <Text fw={600}>{aiPersona?.name || 'AI'}</Text>
                  <Text fw={700}>{gameState.p2Score}</Text>
                </Group>
              </Card>
              
              {/* Rewards */}
              <Card withBorder w="100%">
                <Text fw={700}>Rewards {isCompleting ? <Text span size="sm" c="dimmed">Calculating...</Text> : null}</Text>
                <Group justify="space-between"><Text>XP</Text><Text fw={700}>{rewards ? `+${rewards.xp || 0}` : '-'}</Text></Group>
                <Group justify="space-between"><Text>Points</Text><Text fw={700}>{rewards ? `+${rewards.points || 0}` : '-'}</Text></Group>
                {rewards?.streakBonus && rewards.streakBonus > 0 && (
                  <Text size="sm">🔥 Streak Bonus: +{Math.round(rewards.streakBonus * 100)}%</Text>
                )}
              </Card>
              
              {/* Daily challenges */}
              {completedChallenges.length > 0 && (
                <Card withBorder w="100%">
                  <Text fw={700}>Daily Challenges Completed</Text>
                  <Stack gap="xs">
                    {completedChallenges.map((c, idx) => (
                      <Group key={idx} justify="space-between">
                        <Text size="sm">{c.title}</Text>
                        <Text size="sm">+{c.rewardsEarned.points}pts - +{c.rewardsEarned.xp}xp</Text>
                      </Group>
                    ))}
                  </Stack>
                </Card>
              )}
              
              <Group grow w="100%">
                <Button
                  onClick={() => {
                    setGameState(null);
                    setAiLevel(null);
                    setAiPersona(null);
                    setShowGameOver(false);
                  }}
                >
                  Play Again
                </Button>
                
                <Button
                  onClick={() => router.push('/games')}
                  variant="default"
                >
                  Exit
                </Button>
              </Group>
              </Stack>
        </Modal>
      </Stack>
    </Container>
  );
}
