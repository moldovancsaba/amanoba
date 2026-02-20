'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js', {
          scope: '/',
        });
        void registration.update();
        if (!navigator.serviceWorker.controller) {
          const key = 'sw_controller_reload';
          const didReload = window.sessionStorage.getItem(key) === '1';
          if (!didReload) {
            window.sessionStorage.setItem(key, '1');
            navigator.serviceWorker.addEventListener('controllerchange', () => {
              window.location.reload();
            });
          }
        }
      } catch (error) {
        console.error('Service worker registration failed:', error);
      }
    };

    register();
  }, []);

  return null;
}
