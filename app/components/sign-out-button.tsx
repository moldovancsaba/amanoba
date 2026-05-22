/**
 * Sign Out Button Component
 * 
 * What: Client-side button to sign out users
 * Why: Allow authenticated users to log out from any page
 */

'use client';

import { Button } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';
import { signOut } from 'next-auth/react';

type SignOutButtonProps = {
  label?: string;
  callbackUrl?: string;
};

export default function SignOutButton({ label = 'Sign Out', callbackUrl = '/' }: SignOutButtonProps) {
  return (
    <Button
      onClick={() => signOut({ callbackUrl })}
      variant="subtle"
      color="red"
      leftSection={<IconLogout size={18} />}
    >
      {label}
    </Button>
  );
}
