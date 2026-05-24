'use client';

/**
 * Memory Card Matching Game Component
 *
 * Interactive card-flipping game with full gamification integration.
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
  Badge,
  Button,
  Card,
  Group,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {
  IconBolt,
  IconClock,
  IconPlayerPause,
  IconPlayerPlay,
  IconRefresh,
  IconTarget,
  IconTrophy,
} from '@tabler/icons-react';
import { GameBoardCard } from '@/app/components/patterns/GameBoardCard';
import { MetricCard } from '@/app/components/patterns/MetricCard';
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
  onGameComplete?: (score: number, stats: Record<string, unknown>) => void;
}

export default function MemoryGame({
  playerId,
  isPremium,
  onGameComplete,
}: MemoryGameProps) {
  const router = useRouter();
  const locale = useLocale();

  const [difficulty, setDifficulty] = useState<MemoryDifficulty>('MEDIUM');
  const [config, setConfig] = useState<MemoryGameConfig>(getDifficultyConfig('MEDIUM'));
  const [gameState, setGameState] = useState<MemoryGameState | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [rewards, setRewards] = useState<{ points: number; xp: number; streakBonus?: number } | null>(null);
  const [completedChallenges, setCompletedChallenges] = useState<
    Array<{ title: string; rewardsEarned: { points: number; xp: number } }>
  >([]);
  const [isCompleting, setIsCompleting] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const flipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startNewGame = useCallback(async () => {
    const newConfig = getDifficultyConfig(difficulty);
    setConfig(newConfig);
    const initialState = initializeGame(newConfig);
    setGameState(initialState);
    setGameStarted(true);

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

  const shouldRunTimer = Boolean(gameState && gameStarted && !gameState.isPaused && !gameState.isComplete);

  useEffect(() => {
    if (!shouldRunTimer) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setGameState((prev) => {
        if (!prev) return prev;
        const newTime = prev.timeElapsed + 1;

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
  }, [shouldRunTimer, config.timeLimit]);

  const handleCardClick = useCallback(
    (cardId: string) => {
      if (!gameState) return;

      const newState = flipCard(gameState, cardId);
      if (!newState) return;

      setGameState(newState);

      if (newState.flippedCards.length === 2) {
        if (flipTimeoutRef.current) {
          clearTimeout(flipTimeoutRef.current);
        }

        flipTimeoutRef.current = setTimeout(() => {
          setGameState((prev) => {
            if (!prev) return prev;
            const checkedState = checkMatch(prev);

            if (checkedState.moves > prev.moves && checkedState.flippedCards.length === 2) {
              setTimeout(() => {
                setGameState((current) => (current ? resetFlippedCards(current) : current));
              }, 800);
            }

            return checkedState;
          });
        }, 600);
      }
    },
    [gameState]
  );

  const handleTogglePause = useCallback(() => {
    if (!gameState) return;
    setGameState(togglePause(gameState));
  }, [gameState]);

  useEffect(() => {
    if (!gameState || !gameState.isComplete || !sessionId) return;

    const completeSession = async () => {
      const finalScore = calculateScore(gameState, config);
      const stats = getGameStats(gameState, config);
      const isWin = gameState.matchedPairs === gameState.totalPairs;

      try {
        setIsCompleting(true);
        const response = await fetch('/api/game-sessions/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            score: finalScore,
            isWin,
            duration: gameState.timeElapsed,
            moves: gameState.moves,
            accuracy: stats.accuracy,
            metadata: stats,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setRewards(data.rewards);
          onGameComplete?.(finalScore, data);
          try {
            const chRes = await fetch(`/api/challenges?playerId=${playerId}&t=${Date.now()}`, {
              cache: 'no-store',
            });
            if (chRes.ok) {
              const ch = await chRes.json();
              const completed = (ch.challenges || [])
                .filter((c: { isCompleted?: boolean }) => c.isCompleted)
                .map((c: { name?: string; rewards?: { points?: number; xp?: number } }) => ({
                  title: c.name,
                  rewardsEarned: { points: c.rewards?.points || 0, xp: c.rewards?.xp || 0 },
                }));
              setCompletedChallenges(completed);
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
    };

    void completeSession();
  }, [gameState?.isComplete, sessionId, gameState, config, onGameComplete, playerId]);

  const handleRestart = useCallback(() => {
    setGameState(null);
    setGameStarted(false);
    setSessionId(null);
    setRewards(null);
    setCompletedChallenges([]);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (flipTimeoutRef.current) {
      clearTimeout(flipTimeoutRef.current);
    }
  }, []);

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
      <Stack align="center" justify="center" mih={500} gap="lg">
        <Title order={2} ta="center">
          Memory Match
        </Title>
        <Text c="dimmed" ta="center" maw={420}>
          Find matching pairs of cards by flipping them over. Complete all pairs before time runs out!
        </Text>

        <Stack gap="md" w="100%" maw={360}>
          <Stack gap="xs">
            <Text size="sm" fw={600}>
              Difficulty
            </Text>
            <SimpleGrid cols={4}>
              {(['EASY', 'MEDIUM', 'HARD', 'EXPERT'] as MemoryDifficulty[]).map((diff) => (
                <Button
                  key={diff}
                  variant={difficulty === diff ? 'filled' : 'light'}
                  color={difficulty === diff ? 'amanoba' : 'gray'}
                  size="sm"
                  onClick={() => setDifficulty(diff)}
                  disabled={diff === 'EXPERT' && !isPremium}
                >
                  {diff === 'EXPERT' && !isPremium ? '🔒 ' : ''}
                  {diff}
                </Button>
              ))}
            </SimpleGrid>
            {!isPremium ? (
              <Text size="xs" c="dimmed">
                Expert mode requires Premium
              </Text>
            ) : null}
          </Stack>

          <Button onClick={startNewGame} size="lg" leftSection={<IconPlayerPlay size={18} />} fullWidth>
            Start Game
          </Button>
        </Stack>
      </Stack>
    );
  }

  const timeRemaining = config.timeLimit - gameState.timeElapsed;
  const gridCols = config.gridSize.cols;
  const timeLabel = `${Math.floor(timeRemaining / 60)}:${(timeRemaining % 60).toString().padStart(2, '0')}`;
  const elapsedLabel = `${Math.floor(gameState.timeElapsed / 60)}:${(gameState.timeElapsed % 60).toString().padStart(2, '0')}`;
  const finalScore = calculateScore(gameState, config);
  const isVictory = gameState.matchedPairs === gameState.totalPairs;

  return (
    <Stack gap="lg" pb="md">
      <SimpleGrid cols={{ base: 2, md: 4 }}>
        <MetricCard
          icon={<IconClock size={22} />}
          value={timeLabel}
          label="Time"
          color="blue"
        />
        <MetricCard
          icon={<IconBolt size={22} />}
          value={gameState.moves}
          label="Moves"
          color="yellow"
        />
        <MetricCard
          icon={<IconTarget size={22} />}
          value={`${gameState.matchedPairs} / ${gameState.totalPairs}`}
          label="Pairs"
          color="green"
        />
        <MetricCard
          icon={<IconTrophy size={22} />}
          value={finalScore}
          label="Score"
          color="amanoba"
        />
      </SimpleGrid>

      <Group justify="center" gap="sm">
        <Button
          onClick={handleTogglePause}
          variant="default"
          disabled={gameState.isComplete}
          leftSection={
            gameState.isPaused ? <IconPlayerPlay size={16} /> : <IconPlayerPause size={16} />
          }
        >
          {gameState.isPaused ? 'Resume' : 'Pause'}
        </Button>
        <Button onClick={handleRestart} variant="default" leftSection={<IconRefresh size={16} />}>
          Restart
        </Button>
      </Group>

      <SimpleGrid cols={gridCols} spacing="sm" maw={960} mx="auto" w="100%">
        {gameState.cards.map((card) => {
          const revealed = card.isFlipped || card.isMatched;
          const disabled =
            gameState.isPaused ||
            gameState.isComplete ||
            card.isFlipped ||
            card.isMatched ||
            gameState.flippedCards.length >= 2;

          return (
            <GameBoardCard
              key={card.id}
              face={revealed ? card.value : '?'}
              revealed={revealed}
              matched={card.isMatched}
              disabled={disabled}
              onPress={() => handleCardClick(card.id)}
            />
          );
        })}
      </SimpleGrid>

      <Modal
        opened={gameState.isComplete}
        onClose={() => {}}
        withCloseButton={false}
        closeOnClickOutside={false}
        closeOnEscape={false}
        centered
        title={null}
      >
        <Stack gap="md">
          <Stack align="center" gap="xs">
            <IconTrophy size={48} color="var(--mantine-color-amanoba-5)" />
            <Title order={2}>{isVictory ? 'Victory!' : 'Time Up!'}</Title>
            <Text c="dimmed" ta="center">
              {isVictory
                ? 'You found all the pairs!'
                : `You found ${gameState.matchedPairs} of ${gameState.totalPairs} pairs`}
            </Text>
          </Stack>

          <Stack gap="xs">
            <Group justify="space-between">
              <Text>Final Score</Text>
              <Text fw={700}>{finalScore}</Text>
            </Group>
            <Group justify="space-between">
              <Text>Moves</Text>
              <Text fw={700}>{gameState.moves}</Text>
            </Group>
            <Group justify="space-between">
              <Text>Time</Text>
              <Text fw={700}>{elapsedLabel}</Text>
            </Group>
          </Stack>

          <Card withBorder bg="amanoba.0">
            <Stack gap="xs">
              <Group justify="space-between">
                <Text fw={700}>Rewards</Text>
                {isCompleting ? (
                  <Badge variant="light" color="gray">
                    Calculating…
                  </Badge>
                ) : null}
              </Group>
              <Group justify="space-between">
                <Text size="sm">XP</Text>
                <Text fw={700}>{rewards ? `+${rewards.xp || 0}` : '—'}</Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Points</Text>
                <Text fw={700}>{rewards ? `+${rewards.points || 0}` : '—'}</Text>
              </Group>
              {rewards?.streakBonus && rewards.streakBonus > 0 ? (
                <Text size="sm" c="dimmed">
                  Streak bonus: +{Math.round(rewards.streakBonus * 100)}%
                </Text>
              ) : null}
            </Stack>
          </Card>

          {completedChallenges.length > 0 ? (
            <Card withBorder bg="green.0">
              <Stack gap="xs">
                <Text fw={700}>Daily Challenges Completed</Text>
                {completedChallenges.map((challenge, idx) => (
                  <Group key={idx} justify="space-between" gap="md" wrap="nowrap">
                    <Text size="sm">• {challenge.title}</Text>
                    <Text size="sm">
                      +{challenge.rewardsEarned.points}pts • +{challenge.rewardsEarned.xp}xp
                    </Text>
                  </Group>
                ))}
              </Stack>
            </Card>
          ) : null}

          <Stack gap="xs">
            <Button onClick={handleRestart} fullWidth>
              Play Again
            </Button>
            <Button
              onClick={() => router.push(`/${locale}/dashboard`)}
              variant="default"
              fullWidth
            >
              Back to Dashboard
            </Button>
          </Stack>
        </Stack>
      </Modal>
    </Stack>
  );
}
