import { Center, Loader, Stack, Text } from '@mantine/core';

export default function Loading() {
  return (
    <Center mih="70vh">
      <Stack align="center" gap="md">
        <Loader />
        <Text size="lg">Loading...</Text>
      </Stack>
    </Center>
  );
}
