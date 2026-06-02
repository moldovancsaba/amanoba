/**
 * Data Deletion Policy Page
 * Public page - no authentication required
 */


import {
  Anchor,
  Button,
  Container,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';

export default async function DataDeletionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <Container size="md" py="xl">
      <Paper withBorder p={{ base: 'lg', sm: 'xl' }} radius="md">
        <Stack gap="xl">
          <Stack gap="sm">
            <Title order={1}>Data Deletion Policy</Title>
            <Text size="sm" c="dimmed">Last Updated: January 13, 2025</Text>
          </Stack>

          <Stack component="section" gap="sm">
            <Title order={2}>Your Right to Delete Data</Title>
            <Text>
              At Amanoba, we respect your right to control your personal data. You can request the deletion
              of your account and all associated personal information at any time. This page explains how we
              handle data deletion requests and what data is removed.
            </Text>
          </Stack>

          <Stack component="section" gap="sm">
            <Title order={2}>What Data Will Be Deleted</Title>
            <Text>When you request account deletion, the following data will be permanently removed:</Text>
            <ul style={{ paddingLeft: "24px", margin: "8px 0", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li><strong>Account Information:</strong> Email address, display name, SSO identifier</li>
              <li><strong>Profile Data:</strong> Avatar, bio, preferences, settings</li>
              <li><strong>Game Progress:</strong> Scores, achievements, levels, streaks</li>
              <li><strong>Rewards:</strong> Points balance, unlocked rewards, redemption history</li>
              <li><strong>Social Data:</strong> Referral codes, friend connections, if applicable</li>
              <li><strong>Session History:</strong> Game play sessions and activity logs</li>
              <li><strong>Communications:</strong> Support tickets and correspondence</li>
            </ul>
          </Stack>

          <Stack component="section" gap="sm">
            <Title order={2}>What Data May Be Retained</Title>
            <Text>
              In accordance with legal and business requirements, we may retain certain information for a limited time:
            </Text>
            <ul style={{ paddingLeft: "24px", margin: "8px 0", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li><strong>Transaction Records:</strong> Payment history for premium subscriptions required for tax/accounting purposes</li>
              <li><strong>Legal Compliance:</strong> Data required to comply with legal obligations or resolve disputes</li>
              <li><strong>Security Logs:</strong> Anonymized security and fraud prevention data</li>
              <li><strong>Aggregated Analytics:</strong> Anonymized, non-identifiable usage statistics</li>
            </ul>
            <Text>Any retained data will be anonymized and cannot be used to identify you personally.</Text>
          </Stack>

          <Stack component="section" gap="md">
            <Title order={2}>How to Request Data Deletion</Title>
            <Paper withBorder p="md">
              <Stack gap="xs">
                <Title order={3} size="h4">Method 1: Email Request (Recommended)</Title>
                <Text>Send an email to:</Text>
                <Text size="lg" fw={700}>
                  <Anchor href="mailto:info@amanoba.com?subject=Data%20Deletion%20Request">
                    info@amanoba.com
                  </Anchor>
                </Text>
                <Text size="sm">Subject: &quot;Data Deletion Request&quot;</Text>
                <Text>Include in your email:</Text>
                <ul style={{ paddingLeft: "24px", margin: "4px 0", display: "flex", flexDirection: "column", gap: "4px" }}>
                  <li>Your registered email address</li>
                  <li>Your Amanoba username/display name</li>
                  <li>Confirmation that you want to permanently delete your account</li>
                </ul>
              </Stack>
            </Paper>

            <Paper withBorder p="md">
              <Stack gap="xs">
                <Title order={3} size="h4">Method 2: Revoke SSO Access</Title>
                <Text>
                  If you signed in using SSO, such as Google, Microsoft, or your organisation&apos;s provider,
                  you can revoke Amanoba&apos;s access in your provider account settings. That may trigger a
                  data-deletion request depending on the provider.
                </Text>
              </Stack>
            </Paper>
          </Stack>

          <Stack component="section" gap="sm">
            <Title order={2}>Data Deletion Timeline</Title>
            <Paper withBorder p="md">
              <Stack gap="md">
                {[
                  ['Immediate', 'Account Deactivation', 'Your account is immediately deactivated and you can no longer sign in.'],
                  ['1-7 Days', 'Grace Period', 'A 7-day grace period during which you can cancel your deletion request. Contact us at info@amanoba.com to restore your account during this period.'],
                  ['7-30 Days', 'Permanent Deletion', 'All personal data is permanently deleted from our active systems. Backups are purged within 30 days.'],
                  ['30+ Days', 'Complete Removal', 'All traces of your personal data are removed from our systems, including backups. Only anonymized analytics data may remain.'],
                ].map(([time, label, body]) => (
                  <Paper key={time} withBorder p="sm">
                    <Text fw={800} c="amanoba">{time}</Text>
                    <Text fw={700}>{label}</Text>
                    <Text c="dimmed" size="sm">{body}</Text>
                  </Paper>
                ))}
              </Stack>
            </Paper>
          </Stack>

          <Stack component="section" gap="sm">
            <Title order={2}>Important Notes</Title>
            <Paper withBorder p="md">
              <ul style={{ paddingLeft: "24px", margin: "8px 0", display: "flex", flexDirection: "column", gap: "12px" }}>
                <li><strong>Irreversible:</strong> Data deletion is permanent and cannot be undone after the 7-day grace period</li>
                <li><strong>New Account:</strong> If you sign up again, you will start fresh with no previous data</li>
                <li><strong>Premium Subscriptions:</strong> Active subscriptions will be cancelled, with no refunds for partial periods</li>
                <li><strong>Third-Party Data:</strong> Data shared with SSO or other third-party services must be managed through those platforms</li>
              </ul>
            </Paper>
          </Stack>

          <Stack component="section" gap="sm">
            <Title order={2}>Confirmation</Title>
            <Text>
              Once your data has been deleted, we will send a confirmation email to your registered email
              address, if still accessible. This confirms that your request has been processed and your data
              has been removed from our systems.
            </Text>
          </Stack>

          <Stack component="section" gap="sm">
            <Title order={2}>Questions or Concerns</Title>
            <Text>
              If you have any questions about our data deletion process or need assistance, please contact us:
            </Text>
            <Paper withBorder p="md">
              <Stack gap="xs">
                <Text><strong>Email:</strong> <Anchor href="mailto:info@amanoba.com">info@amanoba.com</Anchor></Text>
                <Text><strong>Response Time:</strong> We aim to respond to all deletion requests within 48 hours</Text>
                <Text><strong>Amanoba Gaming Platform</strong></Text>
              </Stack>
            </Paper>
          </Stack>

          <Stack component="section" gap="sm">
            <Title order={2}>Your Privacy Rights</Title>
            <Text>
              This Data Deletion Policy is part of our commitment to protecting your privacy. For more
              information about how we handle your data, please review our:
            </Text>
            <ul style={{ paddingLeft: "24px", margin: "8px 0", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li><Anchor href={`/${locale}/privacy`}>Privacy Policy</Anchor></li>
              <li><Anchor href={`/${locale}/terms`}>Terms of Service</Anchor></li>
            </ul>
          </Stack>

          <Divider />
          <Group justify="center">
            <Button component="a" href={`/${locale}`} variant="subtle" color="gray">Back to Home</Button>
            <Button component="a" href={`/${locale}/privacy`} variant="subtle" color="gray">Privacy Policy</Button>
            <Button component="a" href={`/${locale}/terms`} variant="subtle" color="gray">Terms of Service</Button>
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
}
