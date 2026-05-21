/**
 * Create New Course Page
 * 
 * What: Form to create a new flexible course
 * Why: Allows admins to create courses with basic metadata
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  Code,
  Group,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Stepper,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconArrowLeft, IconBook, IconCertificate, IconChecklist, IconDeviceFloppy, IconSettings } from '@tabler/icons-react';
import { getStripeMinimum, getFormattedMinimum, meetsStripeMinimum } from '@/app/lib/utils/stripe-minimums';
import { COURSE_LANGUAGE_OPTIONS } from '@/app/lib/constants/course-languages';

export default function NewCoursePage() {
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    courseId: '',
    name: '',
    description: '',
    language: 'hu',
    ccsId: '',
    thumbnail: '',
    durationDays: 1,
    requiresPremium: false,
    priceAmount: 2999,
    priceCurrency: 'usd',
    completionPoints: 1000,
    lessonPoints: 50,
    perfectCourseBonus: 500,
    completionXP: 500,
    lessonXP: 25,
  });

  useEffect(() => {
    const ccsId = searchParams.get('ccsId');
    const language = searchParams.get('language');
    if (!ccsId && !language) return;
    setFormData((prev) => ({
      ...prev,
      ccsId: ccsId ? ccsId.trim().toUpperCase().replace(/\s+/g, '_') : prev.ccsId,
      language: language ? language.trim() : prev.language,
    }));
  }, [searchParams]);

  const suggestedCourseId =
    formData.ccsId && formData.language
      ? `${formData.ccsId.trim().toUpperCase().replace(/\s+/g, '_')}_${String(formData.language).toUpperCase().replace(/[^A-Z0-9]/g, '_')}`
      : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          ccsId: formData.ccsId ? formData.ccsId.trim().toUpperCase().replace(/\s+/g, '_') : undefined,
          price: formData.requiresPremium ? {
            amount: formData.priceAmount,
            currency: formData.priceCurrency,
          } : undefined,
          pointsConfig: {
            completionPoints: formData.completionPoints,
            lessonPoints: formData.lessonPoints,
            perfectCourseBonus: formData.perfectCourseBonus,
          },
          xpConfig: {
            completionXP: formData.completionXP,
            lessonXP: formData.lessonXP,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to course editor to add lessons
        router.push(`/${locale}/admin/courses/${data.course.courseId}`);
      } else {
        notifications.show({
          color: 'red',
          title: 'Failed to create course',
          message: data.error || 'Failed to create course',
        });
      }
    } catch (error) {
      console.error('Failed to create course:', error);
      notifications.show({
        color: 'red',
        title: 'Failed to create course',
        message: 'Failed to create course',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack gap="lg">
      <Group gap="md">
        <Button
          component="a"
          href={`/${locale}/admin/courses`}
          variant="default"
          leftSection={<IconArrowLeft size={18} />}
        >
          Back
        </Button>
        <Stack gap={2}>
          <Title order={1} c="white">Create New Course</Title>
          <Text c="gray.4">Set up basic course information</Text>
        </Stack>
      </Group>

      <Card padding="lg">
        <Stack gap="md">
          <Stack gap={4}>
            <Title order={2} size="h3">Course creation path</Title>
            <Text c="dimmed">
              Create the course shell first, then add lessons, set the course-level quiz policy, configure certificates, and publish only after the checklist is clean.
            </Text>
          </Stack>
          <Stepper active={0} allowNextStepsSelect={false}>
            <Stepper.Step icon={<IconSettings size={18} />} label="Basics" description="This page" />
            <Stepper.Step icon={<IconBook size={18} />} label="Lessons" description="1 to unlimited" />
            <Stepper.Step icon={<IconChecklist size={18} />} label="Quiz policy" description="Course-level rules" />
            <Stepper.Step icon={<IconCertificate size={18} />} label="Certificate" description="Optional gate" />
          </Stepper>
          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
            <Alert color="yellow" variant="light" title="Lesson count">
              <Text size="sm">Minimum is 1 lesson. There is no maximum; the course can grow as lessons are added.</Text>
            </Alert>
            <Alert color="gray" variant="light" title="Short versions">
              <Text size="sm">Create the full course first, then use the editor short-course tools to select lessons for a focused version.</Text>
            </Alert>
            <Alert color="gray" variant="light" title="Certificates">
              <Text size="sm">Certificates are configured after the course exists, when final exam pool and gates can be verified.</Text>
            </Alert>
          </SimpleGrid>
        </Stack>
      </Card>

      <Card padding="lg" withBorder>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack gap="xl">
            <Stack gap="md">
              <Title order={2} size="h3">Basic Information</Title>
              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                <TextInput
                  label="Course ID"
                  withAsterisk
                  required
                  value={formData.courseId}
                  onChange={(e) => setFormData({ ...formData, courseId: e.currentTarget.value })}
                  placeholder="e.g., ENTREPRENEURSHIP_101"
                  description="Unique identifier (uppercase, underscores)"
                />
                {suggestedCourseId && (
                  <Group gap="xs" align="center">
                    <Text size="xs" c="dimmed">Suggested:</Text>
                    <Code>{suggestedCourseId}</Code>
                    <Button
                      type="button"
                      onClick={() => setFormData({ ...formData, courseId: suggestedCourseId })}
                      size="xs"
                      color="amanoba"
                    >
                      Use
                    </Button>
                  </Group>
                )}

                <Select
                  label="Language"
                  withAsterisk
                  value={formData.language}
                  onChange={(value) => setFormData({ ...formData, language: value || 'hu' })}
                  data={COURSE_LANGUAGE_OPTIONS.map((option) => ({ value: option.code, label: option.label }))}
                />

                <TextInput
                  label="Course Family (CCS ID)"
                  value={formData.ccsId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ccsId: e.currentTarget.value,
                    })
                  }
                  placeholder="e.g., PRODUCTIVITY_2026"
                  description="Optional. Link language variants to one course family."
                />

                <NumberInput
                  label="Planned Lesson Count"
                  min={1}
                  step={1}
                  value={formData.durationDays}
                  onChange={(value) => setFormData({ ...formData, durationDays: Math.max(1, Math.floor(Number(value) || 1)) })}
                  description="Start with 1 or any planned length. The course can grow as you add lessons."
                />

                <TextInput
                  label="Course Name"
                  withAsterisk
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.currentTarget.value })}
                  placeholder="e.g., Entrepreneurship 101"
                />

                <Textarea
                  label="Description"
                  withAsterisk
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.currentTarget.value })}
                  placeholder="Course description..."
                  rows={4}
                />

                <TextInput
                  label="Thumbnail URL"
                  type="url"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.currentTarget.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </SimpleGrid>

              <Checkbox
                checked={formData.requiresPremium}
                onChange={(e) => setFormData({ ...formData, requiresPremium: e.currentTarget.checked })}
                label="Requires Premium"
              />

              {formData.requiresPremium && (
                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                  <NumberInput
                      label="Price (in smallest unit)"
                      min={getStripeMinimum(formData.priceCurrency)}
                    step={1}
                      value={formData.priceAmount}
                    onChange={(value) => setFormData({ ...formData, priceAmount: Number(value) || 0 })}
                      placeholder="2999"
                    error={!meetsStripeMinimum(formData.priceAmount, formData.priceCurrency) ? `Minimum for ${formData.priceCurrency.toUpperCase()} is ${getFormattedMinimum(formData.priceCurrency)}` : undefined}
                    description={meetsStripeMinimum(formData.priceAmount, formData.priceCurrency) ? `Minimum: ${getFormattedMinimum(formData.priceCurrency)}` : undefined}
                    />
                  <Select
                    label="Currency"
                      value={formData.priceCurrency}
                    onChange={(value) => {
                        const newCurrency = value || 'usd';
                        const currentAmount = formData.priceAmount;
                        const minimum = getStripeMinimum(newCurrency);
                        const newAmount = currentAmount < minimum ? minimum : currentAmount;
                        setFormData({ 
                          ...formData, 
                          priceCurrency: newCurrency,
                          priceAmount: newAmount,
                        });
                      }}
                    data={[
                      { value: 'usd', label: 'USD ($) - Min: $0.50' },
                      { value: 'eur', label: 'EUR (€) - Min: €0.50' },
                      { value: 'huf', label: 'HUF (Ft) - Min: 175 Ft' },
                      { value: 'gbp', label: 'GBP (£) - Min: £0.30' },
                    ]}
                    description={`Minimum: ${getFormattedMinimum(formData.priceCurrency)}`}
                  />
                </SimpleGrid>
              )}
            </Stack>

            <Stack gap="md">
              <Title order={2} size="h3">Points & XP Configuration</Title>
              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                <NumberInput
                  label="Completion Points"
                  value={formData.completionPoints}
                  onChange={(value) => setFormData({ ...formData, completionPoints: Number(value) || 0 })}
                />
                <NumberInput
                  label="Points per Lesson"
                  value={formData.lessonPoints}
                  onChange={(value) => setFormData({ ...formData, lessonPoints: Number(value) || 0 })}
                />
                <NumberInput
                  label="Perfect Course Bonus"
                  value={formData.perfectCourseBonus}
                  onChange={(value) => setFormData({ ...formData, perfectCourseBonus: Number(value) || 0 })}
                />
                <NumberInput
                  label="Completion XP"
                  value={formData.completionXP}
                  onChange={(value) => setFormData({ ...formData, completionXP: Number(value) || 0 })}
                />
                <NumberInput
                  label="XP per Lesson"
                  value={formData.lessonXP}
                  onChange={(value) => setFormData({ ...formData, lessonXP: Number(value) || 0 })}
                />
              </SimpleGrid>
            </Stack>

            <Group justify="flex-end">
              <Button component="a" href={`/${locale}/admin/courses`} variant="default">
                Cancel
              </Button>
              <Button type="submit" loading={loading} color="amanoba" leftSection={<IconDeviceFloppy size={18} />}>
                {loading ? 'Creating...' : 'Create Course'}
              </Button>
            </Group>
          </Stack>
        </Box>
      </Card>
    </Stack>
  );
}
