/**
 * Vitest config for smoke and unit tests.
 * API route tests use node environment; no jsdom required.
 */
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    include: ['__tests__/**/*.test.ts', '__tests__/**/*.test.tsx'],
    globals: true,
  },
});
