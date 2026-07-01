'use client';

/**
 * Push opt-in control (#20)
 *
 * Renders nothing unless the browser supports push AND a VAPID public key is
 * configured. Lets a signed-in learner enable/disable browser push. The service
 * worker (public/service-worker.js) already renders incoming 'push' events.
 */

import { useEffect, useState } from 'react';
import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String: string): BufferSource {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const buffer = new ArrayBuffer(raw.length);
  const output = new Uint8Array(buffer);
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
  return output;
}

export default function PushOptIn() {
  const [supported, setSupported] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const ok =
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window &&
      !!VAPID_PUBLIC_KEY;
    setSupported(ok);
    if (!ok) return;
    navigator.serviceWorker.ready
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => setSubscribed(!!sub))
      .catch(() => {});
  }, []);

  if (!supported) return null;

  const enable = async () => {
    setBusy(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        notifications.show({ color: 'orange', message: 'Notification permission denied.' });
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY as string),
      });
      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub),
      });
      if (!res.ok) throw new Error('subscribe failed');
      setSubscribed(true);
      notifications.show({ color: 'green', message: 'Push notifications enabled.' });
    } catch {
      notifications.show({ color: 'red', message: 'Could not enable push notifications.' });
    } finally {
      setBusy(false);
    }
  };

  const disable = async () => {
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch('/api/push/subscribe', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setSubscribed(false);
      notifications.show({ color: 'gray', message: 'Push notifications disabled.' });
    } catch {
      notifications.show({ color: 'red', message: 'Could not disable push notifications.' });
    } finally {
      setBusy(false);
    }
  };

  return subscribed ? (
    <Button variant="light" color="gray" size="xs" loading={busy} onClick={disable}>
      Disable push
    </Button>
  ) : (
    <Button variant="light" size="xs" loading={busy} onClick={enable}>
      Enable push
    </Button>
  );
}
