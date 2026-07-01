'use client';

/**
 * Admin Certificate Template Library (#10)
 *
 * Create / list / delete reusable certificate designs. Access enforced server-side.
 * Assign a template to a course or the global default by its key (designTemplateId).
 */

import { useCallback, useEffect, useState } from 'react';
import {
  Badge, Button, Card, ColorInput, Container, Group, Select, Stack, Text, TextInput, Textarea, Title,
} from '@mantine/core';

interface Template {
  _id: string;
  key: string;
  name: string;
  baseLayout: 'default' | 'minimal';
  themeColors?: { accent?: string; primary?: string; secondary?: string };
  backgroundUrl?: string;
  description?: string;
}

export default function AdminCertificateTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [key, setKey] = useState('');
  const [name, setName] = useState('');
  const [baseLayout, setBaseLayout] = useState<'default' | 'minimal'>('default');
  const [accent, setAccent] = useState('');
  const [primary, setPrimary] = useState('');
  const [secondary, setSecondary] = useState('');
  const [description, setDescription] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/certificate-templates', { cache: 'no-store' });
      if (!res.ok) throw new Error(`Failed to load (${res.status})`);
      const data = await res.json();
      setTemplates(data.templates || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const create = async () => {
    setSaving(true);
    setError(null);
    try {
      const themeColors: Record<string, string> = {};
      if (accent) themeColors.accent = accent;
      if (primary) themeColors.primary = primary;
      if (secondary) themeColors.secondary = secondary;
      const res = await fetch('/api/admin/certificate-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key, name, baseLayout,
          themeColors: Object.keys(themeColors).length ? themeColors : undefined,
          description: description || undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Failed to create (${res.status})`);
      }
      setKey(''); setName(''); setAccent(''); setPrimary(''); setSecondary(''); setDescription('');
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    await fetch(`/api/admin/certificate-templates/${id}`, { method: 'DELETE' });
    await load();
  };

  const canCreate = /^[a-z0-9][a-z0-9_-]{1,63}$/.test(key) && name.trim();

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <Title order={1}>Certificate templates</Title>
        <Text c="dimmed" size="sm">Assign a template to a course or the global default using its <b>key</b>.</Text>
        {error && <Text c="red">{error}</Text>}

        <Card withBorder padding="lg" radius="md">
          <Stack gap="sm">
            <Title order={3} size="h4">New template</Title>
            <Group grow>
              <TextInput label="Key (slug)" placeholder="e.g. gold-2026" value={key} onChange={(e) => setKey(e.currentTarget.value.toLowerCase())} required />
              <TextInput label="Name" value={name} onChange={(e) => setName(e.currentTarget.value)} required />
            </Group>
            <Select label="Base layout" value={baseLayout} onChange={(v) => setBaseLayout((v as 'default' | 'minimal') || 'default')}
              data={[{ value: 'default', label: 'Default (ornate)' }, { value: 'minimal', label: 'Minimal' }]} />
            <Group grow>
              <ColorInput label="Accent" format="hex" value={accent} onChange={setAccent} />
              <ColorInput label="Primary (bg)" format="hex" value={primary} onChange={setPrimary} />
              <ColorInput label="Secondary (bg)" format="hex" value={secondary} onChange={setSecondary} />
            </Group>
            <Textarea label="Description" value={description} onChange={(e) => setDescription(e.currentTarget.value)} autosize minRows={2} />
            <Group justify="flex-end">
              <Button onClick={create} loading={saving} disabled={!canCreate}>Create</Button>
            </Group>
          </Stack>
        </Card>

        <Title order={3} size="h4">Library</Title>
        {loading ? (
          <Text c="dimmed">Loading…</Text>
        ) : templates.length === 0 ? (
          <Text c="dimmed">No templates yet.</Text>
        ) : (
          <Stack gap="xs">
            {templates.map((t) => (
              <Card key={t._id} withBorder padding="sm" radius="md">
                <Group justify="space-between" wrap="nowrap">
                  <div style={{ minWidth: 0 }}>
                    <Group gap="xs">
                      <Text fw={600} truncate>{t.name}</Text>
                      <Badge size="sm" variant="light">{t.key}</Badge>
                      <Badge size="sm" variant="outline">{t.baseLayout}</Badge>
                    </Group>
                    <Group gap={6} mt={6}>
                      {(['accent', 'primary', 'secondary'] as const).map((c) => t.themeColors?.[c] ? (
                        <span key={c} title={`${c}: ${t.themeColors[c]}`} style={{ width: 18, height: 18, borderRadius: 4, background: t.themeColors[c], border: '1px solid var(--mantine-color-gray-4)', display: 'inline-block' }} />
                      ) : null)}
                      {t.description && <Text size="xs" c="dimmed">{t.description}</Text>}
                    </Group>
                  </div>
                  <Button size="xs" variant="light" color="red" onClick={() => remove(t._id)}>Delete</Button>
                </Group>
              </Card>
            ))}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
