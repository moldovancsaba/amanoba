import { defineConfig, globalIgnores } from 'eslint/config';
import nextConfig from 'eslint-config-next';
import tseslint from 'typescript-eslint';

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
  // Apply minimal rules to config file so Next’s calculateConfigForFile(eslint.config.mjs) sees the plugin (file must not be globally ignored)
  {
    files: ['eslint.config.mjs'],
    languageOptions: { globals: { defineConfig: 'readonly', globalIgnores: 'readonly' } },
    rules: { '@typescript-eslint/no-unused-vars': 'off', '@typescript-eslint/no-require-imports': 'off' },
  },
  ...nextConfig,
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
  // Scripts and public: disable strict rules so one-off scripts don't block build
  {
    files: ['scripts/**/*.ts', 'scripts/**/*.js', 'public/**/*.js'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
]);
