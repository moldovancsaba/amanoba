/**
 * Course Discussion (forums) component
 *
 * What: Lists course discussion posts and allows reply (threaded). Auth required to post.
 * Why: Community Phase 1 — course/lesson discussion per TASKLIST.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import {
  ActionIcon,
  Alert,
  Button,
  Card,
  Divider,
  Group,
  Paper,
  Skeleton,
  Stack,
  Text,
  Textarea,
  ThemeIcon,
  Title,
  Tooltip,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconMessageCircle, IconSend, IconTrash, IconFlag } from '@tabler/icons-react';
import ContentVoteWidget from '@/components/ContentVoteWidget';

interface Post {
  _id: string;
  body: string;
  authorId?: string | null;
  authorDisplayName: string;
  createdAt: string;
  hiddenByAdmin?: boolean;
  replies?: Array<{ _id: string; body: string; authorId?: string | null; authorDisplayName: string; createdAt: string }>;
}

interface CourseDiscussionProps {
  courseId: string;
  lessonId?: string;
  title?: string;
  placeholder?: string;
  replyLabel?: string;
  signInToPost?: string;
  emptyMessage?: string;
  loadingText?: string;
}

export default function CourseDiscussion({
  courseId,
  lessonId,
  title = 'Discussion',
  placeholder = 'Ask a question or share a thought...',
  replyLabel = 'Reply',
  signInToPost = 'Sign in to post',
  emptyMessage = 'No posts yet. Be the first to start the discussion.',
  loadingText = 'Loading...',
}: CourseDiscussionProps) {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBody, setNewBody] = useState('');
  const [replyBody, setReplyBody] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const url = lessonId
        ? `/api/courses/${encodeURIComponent(courseId)}/discussion?lessonId=${encodeURIComponent(lessonId)}`
        : `/api/courses/${encodeURIComponent(courseId)}/discussion`;
      const res = await fetch(url, { cache: 'no-store' });
      const data = await res.json();
      if (data.success && Array.isArray(data.posts)) {
        setPosts(data.posts);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [courseId, lessonId]);

  useEffect(() => {
    void fetchPosts();
  }, [fetchPosts]);

  const handleSubmit = async (parentPostId?: string) => {
    if (!session?.user) return;
    const body = parentPostId ? (replyBody[parentPostId] ?? '').trim() : newBody.trim();
    if (!body) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/courses/${encodeURIComponent(courseId)}/discussion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body, lessonId: lessonId || undefined, parentPostId: parentPostId || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        if (parentPostId) {
          setReplyBody((prev) => ({ ...prev, [parentPostId]: '' }));
          setReplyingTo(null);
        } else {
          setNewBody('');
        }
        await fetchPosts();
      } else {
        notifications.show({
          color: 'red',
          title: 'Post failed',
          message: data.error || 'Failed to post',
        });
      }
    } catch (e) {
      console.error(e);
      notifications.show({
        color: 'red',
        title: 'Post failed',
        message: 'Failed to post',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!session?.user) return;
    try {
      const res = await fetch(`/api/courses/${encodeURIComponent(courseId)}/discussion/${postId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) await fetchPosts();
      else {
        notifications.show({
          color: 'red',
          title: 'Delete failed',
          message: data.error || 'Failed to delete',
        });
      }
    } catch (e) {
      console.error(e);
      notifications.show({
        color: 'red',
        title: 'Delete failed',
        message: 'Failed to delete',
      });
    }
  };

  const confirmDelete = (postId: string) => {
    modals.openConfirmModal({
      title: 'Delete post',
      children: <Text size="sm">Delete this post?</Text>,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => void handleDelete(postId),
    });
  };

  const handleReport = (postId: string) => {
    modals.openConfirmModal({
      title: 'Report post',
      children: <Text size="sm">Report this post to moderators?</Text>,
      labels: { confirm: 'Report', cancel: 'Cancel' },
      confirmProps: { color: 'orange' },
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/courses/${encodeURIComponent(courseId)}/discussion/${postId}/report`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}),
          });
          notifications.show(
            res.ok
              ? { color: 'green', message: 'Reported. Thank you.' }
              : { color: 'red', message: 'Could not submit report.' }
          );
        } catch {
          notifications.show({ color: 'red', message: 'Could not submit report.' });
        }
      },
    });
  };

  const isAdmin = (session?.user as { role?: string } | undefined)?.role === 'admin';
  const playerId = (session?.user as { id?: string; playerId?: string } | undefined)?.playerId || (session?.user as { id?: string } | undefined)?.id;

  return (
    <Card padding="xl" radius="md" withBorder>
      <Stack gap="lg">
        <Group gap="sm">
          <ThemeIcon color="amanoba" variant="light" radius="md">
            <IconMessageCircle size={20} />
          </ThemeIcon>
          <Title order={2} size="h3">{title}</Title>
        </Group>

        {session?.user && (
          <Stack gap="sm">
            <Textarea
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              label={placeholder}
              rows={3}
              autosize
              minRows={3}
              maxRows={8}
            />
            <Button
              onClick={() => handleSubmit()}
              disabled={!newBody.trim() || submitting}
              loading={submitting && !replyingTo}
              color="amanoba"
              leftSection={<IconSend size={16} />}
            >
              Post
            </Button>
          </Stack>
        )}

        {!session?.user && (
          <Alert color="gray" radius="md">{signInToPost}</Alert>
        )}

        {loading ? (
          <Stack gap="sm">
            <Skeleton height={92} radius="md" />
            <Skeleton height={92} radius="md" />
            <Text c="dimmed" size="sm">{loadingText}</Text>
          </Stack>
        ) : posts.length === 0 ? (
          <Text c="dimmed">{emptyMessage}</Text>
        ) : (
          <Stack gap="md">
            {posts.map((post) => (
              <Paper key={post._id} p="md" radius="md" withBorder>
                <Stack gap="sm">
                  <Group align="flex-start" justify="space-between" gap="sm" wrap="nowrap">
                    <Stack gap={2} miw={0} flex={1}>
                      <Text fw={600} size="sm">{post.authorDisplayName}</Text>
                      <Text c="dimmed" size="xs">
                        {new Date(post.createdAt).toLocaleDateString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                      </Text>
                      <Text className="whitespace-pre-wrap break-words">{post.body}</Text>
                      <ContentVoteWidget
                        targetType="discussion_post"
                        targetId={post._id}
                        playerId={playerId ?? null}
                        label=""
                        mt="xs"
                      />
                    </Stack>
                    <Group gap={4} wrap="nowrap">
                      {playerId && String(post.authorId) !== String(playerId) && (
                        <Tooltip label="Report">
                          <ActionIcon
                            color="orange"
                            variant="subtle"
                            onClick={() => handleReport(post._id)}
                            aria-label="Report post"
                          >
                            <IconFlag size={16} />
                          </ActionIcon>
                        </Tooltip>
                      )}
                      {(playerId && (String(post.authorId) === String(playerId)) || isAdmin) && (
                        <Tooltip label="Delete">
                          <ActionIcon
                            color="red"
                            variant="subtle"
                            onClick={() => confirmDelete(post._id)}
                            aria-label="Delete post"
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Tooltip>
                      )}
                    </Group>
                  </Group>
                  {session?.user && (
                    <>
                      {replyingTo === post._id ? (
                        <Paper p="sm" radius="md" withBorder>
                          <Stack gap="sm">
                            <Textarea
                              value={replyBody[post._id] ?? ''}
                              onChange={(e) => setReplyBody((prev) => ({ ...prev, [post._id]: e.target.value }))}
                              label={placeholder}
                              rows={2}
                              autosize
                              minRows={2}
                              maxRows={6}
                            />
                            <Group gap="xs">
                              <Button
                                onClick={() => handleSubmit(post._id)}
                                disabled={!(replyBody[post._id] ?? '').trim() || submitting}
                                loading={submitting && replyingTo === post._id}
                                color="amanoba"
                                size="xs"
                              >
                                {replyLabel}
                              </Button>
                              <Button
                                onClick={() => { setReplyingTo(null); setReplyBody((prev) => ({ ...prev, [post._id]: '' })); }}
                                variant="default"
                                size="xs"
                              >
                                Cancel
                              </Button>
                            </Group>
                          </Stack>
                        </Paper>
                      ) : (
                        <Button
                          onClick={() => setReplyingTo(post._id)}
                          variant="subtle"
                          color="amanoba"
                          size="xs"
                        >
                          {replyLabel}
                        </Button>
                      )}
                    </>
                  )}

                  {Array.isArray(post.replies) && post.replies.length > 0 && (
                    <Stack gap="sm">
                      <Divider />
                      {post.replies.map((r) => (
                        <Paper key={r._id} p="sm" radius="md" withBorder>
                          <Text fw={600} size="sm">{r.authorDisplayName}</Text>
                          <Text c="dimmed" size="xs">{new Date(r.createdAt).toLocaleDateString(undefined, { dateStyle: 'short', timeStyle: 'short' })}</Text>
                          <Text size="sm" mt={4} className="whitespace-pre-wrap break-words">{r.body}</Text>
                        </Paper>
                      ))}
                    </Stack>
                  )}
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Stack>
    </Card>
  );
}
