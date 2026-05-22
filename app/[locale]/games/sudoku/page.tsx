'use client';

/**
 * Sudoku Game Page
 * Complete Sudoku implementation with premium features
 * Version: 2.1.0
 */

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Badge,
  Button,
  Card,
  Center,
  Checkbox,
  Container,
  Grid,
  Group,
  Loader,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconBolt, IconClock, IconPlayerPlay, IconRefresh, IconX, IconBulb } from '@tabler/icons-react';
import { LocaleLink } from '@/components/LocaleLink';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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
  } catch (_error) {
    // Handle SSR/build time when session provider might not be available
  }
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const signInUrl = `/auth/signin?callbackUrl=${encodeURIComponent(
    `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ''}`
  )}`;
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
      <Center mih="100vh">
        <Loader />
      </Center>
    );
  }
  
  // Loading state
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
  
  // Premium notice (no blocking for non-premium users)
  // Free users get limited hints; premium users get unlimited hints and extras.
  
  // Difficulty selection
  if (!gameStarted || !puzzle) {
    return (
      <Container size="sm" py="xl">
        <Card withBorder p="xl">
          <Stack gap="xl">
          <Stack align="center" gap="sm">
            <Badge leftSection={<IconBolt size={14} />}>
              PREMIUM
            </Badge>
            <Title order={1}>🔢 Sudoku</Title>
            <Text c="dimmed">Choose your difficulty level</Text>
          </Stack>

          <SimpleGrid cols={{ base: 1, md: 2 }}>
            {(['easy', 'medium', 'hard', 'expert'] as SudokuDifficulty[]).map(level => (
              <Button
                key={level}
                onClick={() => setDifficulty(level)}
                variant={difficulty === level ? 'filled' : 'default'}
                size="lg"
                h="auto"
                py="lg"
              >
                <Stack gap={2} align="center">
                <Text fw={700} tt="capitalize">{level}</Text>
                <Text size="sm">
                  {level === 'easy' && '~38% empty'}
                  {level === 'medium' && '~55% empty'}
                  {level === 'hard' && '~64% empty'}
                  {level === 'expert' && '~71% empty'}
                </Text>
                </Stack>
              </Button>
            ))}
          </SimpleGrid>

          <Checkbox
            checked={ghostMode}
            onChange={(event) => setGhostMode(event.currentTarget.checked)}
            label="Practice (Ghost) mode - no XP/points, just practice"
          />
          <Button fullWidth onClick={startNewGame} leftSection={<IconPlayerPlay size={22} />} size="lg">
            Start Game
          </Button>
          <Button component={LocaleLink} href="/games" variant="default" fullWidth>
            Back to Games
          </Button>
          </Stack>
        </Card>
      </Container>
    );
  }
  
  // Game board
  return (
    <Container size="md" py="xl">
      <Stack gap="md">
        <Card withBorder>
          <Group justify="space-between">
          <Group>
            <Title order={1}>🔢 Sudoku</Title>
            <Badge tt="capitalize">{difficulty}</Badge>
          </Group>

          <Group>
            <Group gap="xs">
              <IconClock size={18} />
              <Text ff="monospace">{formatTime(timer)}</Text>
            </Group>
            <Group gap="xs">
              <IconBulb size={18} />
              <Text ff="monospace">{hintsUsed} {!isPremium && `/ ${maxFreeHints}`}</Text>
            </Group>
          </Group>
          </Group>
        </Card>

        <Card withBorder p="lg">
          <SimpleGrid cols={9} spacing={0} w="fit-content" mx="auto">
            {puzzle.map((row, rowIdx) =>
              row.map((cell, colIdx) => {
                const isGiven = initialPuzzle && initialPuzzle[rowIdx][colIdx] !== null;
                const isSelected = selectedCell?.[0] === rowIdx && selectedCell?.[1] === colIdx;
                const hasError = errors.has(`${rowIdx}-${colIdx}`);
                
                return (
                  <Button
                    key={`${rowIdx}-${colIdx}`}
                    onClick={() => !isGiven && setSelectedCell([rowIdx, colIdx])}
                    variant={isSelected ? 'filled' : isGiven ? 'light' : 'default'}
                    color={hasError ? 'red' : isSelected ? 'yellow' : 'dark'}
                    size="compact-md"
                    w={48}
                    h={48}
                    p={0}
                    disabled={Boolean(isGiven)}
                  >
                    {cell || ''}
                  </Button>
                );
              })
            )}
          </SimpleGrid>

          {selectedCell && !isComplete && (
            <Group justify="center" mt="lg">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <Button key={num} onClick={() => handleCellChange(selectedCell[0], selectedCell[1], num)} w={48} h={48} p={0}>
                  {num}
                </Button>
              ))}
              <Button onClick={() => handleCellChange(selectedCell[0], selectedCell[1], null)} w={48} h={48} p={0} variant="default">
                <IconX size={22} />
              </Button>
            </Group>
          )}
        </Card>

        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
          <Button fullWidth onClick={useHint} disabled={isComplete || (!isPremium && hintsUsed >= maxFreeHints)} leftSection={<IconBulb size={18} />}>
            Get Hint
          </Button>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
          <Button fullWidth onClick={startNewGame} variant="default" leftSection={<IconRefresh size={18} />}>
            New Game
          </Button>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
          <Button component={LocaleLink} href="/games" fullWidth variant="default">
            Back
          </Button>
          </Grid.Col>
        </Grid>
        
        {isComplete && (
          <Card withBorder ta="center">
            <Text size="xl">🏆</Text>
            <Title order={2}>Puzzle Complete!</Title>
            <Text c="dimmed">Time: {formatTime(timer)} - Hints: {hintsUsed}</Text>

            {/* Rewards */}
            <Card withBorder mt="md">
              <Title order={3}>Rewards {isCompleting ? <Text span size="sm" c="dimmed">Calculating...</Text> : null}</Title>
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <Card withBorder>
                  <Text size="xl" fw={700}>{rewards ? `+${rewards.xp || 0}` : '-'}</Text>
                  <Text c="dimmed">XP</Text>
                </Card>
                <Card withBorder>
                  <Text size="xl" fw={700}>{rewards ? `+${rewards.points || 0}` : '-'}</Text>
                  <Text c="dimmed">Points</Text>
                </Card>
              </SimpleGrid>
              {rewards?.streakBonus && rewards.streakBonus > 0 && (
                <Text mt="sm" fw={600}>🔥 Streak Bonus: +{Math.round(rewards.streakBonus * 100)}%</Text>
              )}
            </Card>

            {/* Daily challenges */}
            {completedChallenges.length > 0 && (
              <Card withBorder mt="md">
                <Title order={3}>Daily Challenges Completed</Title>
                <Stack gap="xs">
                  {completedChallenges.map((c, idx) => (
                    <Group key={idx} justify="space-between">
                      <Text>{c.title}</Text>
                      <Text>+{c.rewardsEarned.points}pts - +{c.rewardsEarned.xp}xp</Text>
                    </Group>
                  ))}
                </Stack>
              </Card>
            )}
          </Card>
        )}
      </Stack>
    </Container>
  );
}
