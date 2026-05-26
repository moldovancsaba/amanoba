import { readFileSync } from 'node:fs';
import { defineConfig, globalIgnores } from 'eslint/config';
import { createGdsConfig, resolveAllowedImports } from '@doneisbetter/gds-eslint-config';
import nextConfig from 'eslint-config-next';
import tseslint from 'typescript-eslint';

const manifest = JSON.parse(readFileSync(new URL('./gds-adoption.json', import.meta.url), 'utf8'));
const gdsPluginConfig = createGdsConfig({ allowedImports: resolveAllowedImports(manifest) })[0];

export default defineConfig([
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'node_modules/**',
    '.state/**',
    'next-env.d.ts',
    '*.config.js',
    '*.config.ts',
  ]),
  {
    files: ['eslint.config.mjs'],
    languageOptions: { globals: { defineConfig: 'readonly', globalIgnores: 'readonly' } },
    rules: { '@typescript-eslint/no-unused-vars': 'off', '@typescript-eslint/no-require-imports': 'off' },
  },
  ...nextConfig,
  {
    files: ['app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}'],
    ignores: [
      'app/lib/constants/**',
      'app/lib/ui/**',
      'app/components/patterns/gds/**',
    ],
    plugins: gdsPluginConfig.plugins,
    rules: {
      ...gdsPluginConfig.rules,
      'gds/no-raw-design-values': 'warn',
    },
  },
  {
    files: ['app/lib/email/**/*.{ts,tsx}'],
    plugins: gdsPluginConfig.plugins,
    rules: {
      'gds/no-raw-design-values': 'off',
      'gds/no-forbidden-ui-imports': 'off',
    },
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-require-imports': 'error',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/static-components': 'off',
      'react-hooks/use-memo': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/incompatible-library': 'off',
      'react-hooks/globals': 'off',
      'react-hooks/error-boundaries': 'off',
      'react-hooks/set-state-in-render': 'off',
      'react-hooks/unsupported-syntax': 'off',
      'react-hooks/config': 'off',
      'react-hooks/gating': 'off',
    },
  },
  {
    files: ['scripts/**/*.{ts,js,mjs,cjs}', 'public/**/*.js'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
]);
