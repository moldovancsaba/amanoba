'use client';

/**
 * WHACKPOP Game Page
 * 
 * Why: Fast-paced clicking game testing reflexes with gamification rewards
 * What: Whack-a-mole style game integrated with session API
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Alert,
  Button,
  Card,
  Center,
  Container,
  Grid,
  Group,
  Loader,
  List,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';

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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const signInUrl = `/auth/signin?callbackUrl=${encodeURIComponent(
    `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ''}`
  )}`;
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'finished'>('ready');
  const [difficulty, setDifficulty] = useState<Difficulty>('MEDIUM');
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targets, setTargets] = useState<Target[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [rewards, setRewards] = useState<{ xp: number; points: number; streakBonus?: number } | null>(null);
  const [completedChallenges, setCompletedChallenges] = useState<Array<{ title: string; rewardsEarned: { points: number; xp: number } }>>([]);
  const [isCompleting, setIsCompleting] = useState(false);
  const [_playerLevel, _setPlayerLevel] = useState(1);
  const [isPremium, _setIsPremium] = useState(false);
  const [emojis, setEmojis] = useState<string[]>([]);
  const [isLoadingEmojis, setIsLoadingEmojis] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const finishGameRef = useRef<() => void>(() => {});

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
          finishGameRef.current();
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
        setIsCompleting(true);
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
          // Fetch updated challenges
          try {
            const playerId = (session?.user as { id?: string })?.id;
            if (playerId) {
              const chRes = await fetch(`/api/challenges?playerId=${playerId}&t=${Date.now()}`, { cache: 'no-store' });
              if (chRes.ok) {
                const ch = await chRes.json();
                const completed = (ch.challenges || []).filter((c: { isCompleted?: boolean }) => c.isCompleted).map((c: { name?: string; rewards?: { points?: number; xp?: number } }) => ({
                  title: c.name,
                  rewardsEarned: { points: c.rewards?.points || 0, xp: c.rewards?.xp || 0 },
                }));
                setCompletedChallenges(completed);
              }
            }
          } catch {
            // Challenges refresh failed (non-critical)
          }
        }
      } catch (error) {
        console.error('Failed to complete session:', error);
      } finally {
        setIsCompleting(false);
      }
    }
  };

  finishGameRef.current = () => {
    void finishGame();
  };

  // Why: Show loading while fetching emojis
  if (isLoadingEmojis) {
    return (
      <Center mih="100vh">
        <Stack align="center">
          <Loader />
          <Text>Loading emojis...</Text>
        </Stack>
      </Center>
    );
  }

  // Why: Show error if emoji loading failed
  if (fetchError) {
    return (
      <Container size="xs" py="xl">
        <Card withBorder>
          <Stack align="center">
          <Text size="xl">❌</Text>
          <Title order={2}>Error Loading Game</Title>
          <Alert color="red">{fetchError}</Alert>
          <Button onClick={() => window.location.reload()} fullWidth>
            Reload Page
          </Button>
          <Button onClick={() => router.push('/games')} variant="default" fullWidth>
            Back to Games
          </Button>
          </Stack>
        </Card>
      </Container>
    );
  }

  // Auth check
  if (status === 'loading') {
    return (
      <Center mih="100vh">
        <Loader />
      </Center>
    );
  }

  if (!session) {
    router.push(signInUrl);
    return null;
  }

  // Ready screen
  if (gameState === 'ready') {
    const config = DIFFICULTY_CONFIGS[difficulty];
    const canPlayDifficulty = !config.isPremium || isPremium;

    return (
      <Container size="sm" py="xl">
        <Card withBorder p="xl">
          <Stack gap="xl" align="stretch">
            <Stack align="center" gap="sm">
            <Text size="xl">🎯</Text>
            <Title order={1}>WHACKPOP</Title>
            <Text c="dimmed">
              Click the targets as fast as you can!
            </Text>
            </Stack>

            {/* Difficulty Selection */}
            <Stack gap="sm">
              <Title order={3}>Select Difficulty:</Title>
              <SimpleGrid cols={{ base: 2, md: 4 }}>
                {(['EASY', 'MEDIUM', 'HARD', 'EXPERT'] as Difficulty[]).map(diff => {
                  const diffConfig = DIFFICULTY_CONFIGS[diff];
                  const isLocked = diffConfig.isPremium && !isPremium;
                  const isSelected = difficulty === diff;

                  return (
                    <Button
                      key={diff}
                      onClick={() => !isLocked && setDifficulty(diff)}
                      disabled={isLocked}
                      variant={isSelected ? 'filled' : 'default'}
                      h="auto"
                      py="md"
                    >
                      <Stack gap={2} align="center">
                      <Text fw={700}>{isLocked ? '🔒 ' : ''}{diff}</Text>
                      <Text size="xs">
                        {diffConfig.duration}s • {diffConfig.hitsToWin} hits
                      </Text>
                      </Stack>
                    </Button>
                  );
                })}
              </SimpleGrid>
            </Stack>

            <Card withBorder>
              <Title order={3}>How to Play:</Title>
              <List spacing="xs" mt="sm">
                <List.Item>Click targets before they disappear</List.Item>
                <List.Item>{config.duration} seconds gameplay</List.Item>
                <List.Item>+{config.pointsPerHit} points per hit</List.Item>
                <List.Item>Targets last {config.targetLifetime}ms</List.Item>
                <List.Item>Get {config.hitsToWin}+ hits to win</List.Item>
              </List>
            </Card>

            <Button
              onClick={startGame}
              disabled={!canPlayDifficulty}
              size="lg"
            >
              Start Game
            </Button>

            <Button
              onClick={() => router.push('/games')}
              variant="default"
            >
              Back to Games
            </Button>
          </Stack>
        </Card>
      </Container>
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
      <Container size="sm" py="xl">
        <Card withBorder p="xl">
          <Stack align="center" gap="xl">
            {/* Win/Loss Indicator */}
            <Text size="xl">
              {isWin ? '🏆' : '💪'}
            </Text>
            <Title order={1}>
              {isWin ? 'Victory!' : 'Good Try!'}
            </Title>
            <Text c="dimmed" ta="center">
              {isWin 
                ? `You reached ${hits} hits! Amazing reflexes! 🎯`
                : `You got ${hits}/${config.hitsToWin} hits. Keep practicing!`
              }
            </Text>

            {/* Stats Grid */}
            <Card withBorder w="100%">
              <Title order={3}>Game Stats</Title>
              <SimpleGrid cols={{ base: 2, md: 4 }} mt="md">
                {[
                  ['Final Score', finalScore],
                  ['Hits', hits],
                  ['Accuracy', `${accuracy}%`],
                  ['Difficulty', difficulty],
                ].map(([label, value]) => (
                  <Card key={label} withBorder>
                    <Text size="xl" fw={700}>{value}</Text>
                    <Text size="sm" c="dimmed">{label}</Text>
                  </Card>
                ))}
              </SimpleGrid>
            </Card>

            {/* Rewards & Challenges (always visible) */}
            <Card withBorder w="100%">
              <Title order={3}>🎁 Rewards Earned {isCompleting ? <Text span size="sm" c="dimmed">Calculating...</Text> : null}</Title>
              <Stack mt="md">
                <Group justify="space-between">
                  <Text fw={500}>Experience Points</Text>
                  <Text fw={700}>{rewards ? `+${rewards.xp || 0} XP` : '-'}</Text>
                </Group>
                <Group justify="space-between">
                  <Text fw={500}>Points</Text>
                  <Text fw={700}>{rewards ? `+${rewards.points || 0}` : '-'}</Text>
                </Group>
                {rewards?.streakBonus && rewards.streakBonus > 0 && (
                  <Alert color="orange">
                    🔥 Streak Bonus: +{Math.round(rewards.streakBonus * 100)}%
                  </Alert>
                )}
                {completedChallenges.length > 0 && (
                  <Alert color="green" title="🎯 Daily Challenges Completed">
                    {completedChallenges.map((c, idx) => (
                      <Group key={idx} justify="space-between">
                        <Text size="sm">{c.title}</Text>
                        <Text size="sm">+{c.rewardsEarned.points}pts - +{c.rewardsEarned.xp}xp</Text>
                      </Group>
                    ))}
                  </Alert>
                )}
              </Stack>
            </Card>

            {/* Action Buttons */}
            <Grid w="100%">
              <Grid.Col span={{ base: 12, md: 6 }}>
              <Button
                fullWidth
                onClick={() => {
                  setGameState('ready');
                  setRewards(null);
                }}
              >
                Play Again
              </Button>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
              <Button
                fullWidth
                onClick={() => router.push('/games')}
                variant="default"
              >
                Back to Games
              </Button>
              </Grid.Col>
            </Grid>

            {/* Dashboard Link */}
            <Button
              onClick={() => router.push('/dashboard')}
              variant="subtle"
            >
              View Dashboard
            </Button>
          </Stack>
        </Card>
      </Container>
    );
  }

  // Playing screen
  if (gameState === 'playing') {
    return (
      <Container size="md" py="xl">
        {/* Game header */}
        <Stack gap="xl">
          <Card withBorder>
            <Group justify="space-between">
            <Title order={2}>⏱️ {timeLeft}s</Title>
            <Title order={2}>
              Score: {score}
            </Title>
            <Text c="dimmed">
              Hits: {hits} • Misses: {misses}
            </Text>
            </Group>
          </Card>

        {/* Game grid */}
          <Card withBorder onClick={handleMiss}>
          <SimpleGrid cols={3}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((position) => {
              const target = targets.find((t) => t.position === position);
              
              return (
                <Button
                  key={position}
                  variant="default"
                  h={160}
                  onClick={(e) => {
                    if (target) {
                      e.stopPropagation();
                      handleHit(target.id);
                    }
                  }}
                >
                  {target && (
                    <Text size="xl">
                      {target.emoji}
                    </Text>
                  )}
                </Button>
              );
            })}
          </SimpleGrid>
          </Card>

        {/* Instructions */}
        <Text ta="center" fw={600}>
          Click the targets quickly! Difficulty: {difficulty} 🎯
        </Text>
        </Stack>
      </Container>
    );
  }

  return null;
}
