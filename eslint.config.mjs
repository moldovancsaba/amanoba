import { defineConfig, globalIgnores } from 'eslint/config';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import nextPlugin from '@next/eslint-plugin-next';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

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
    languageOptions: { globals: { defineConfig: 'readonly', globalIgnores: 'readonly', path: 'readonly', fileURLToPath: 'readonly', import: 'readonly', meta: 'readonly' } },
    rules: { '@typescript-eslint/no-unused-vars': 'off', '@typescript-eslint/no-require-imports': 'off' },
  },
  // Explicit Next plugin so Next.js build detects it (flat config)
  {
    plugins: {
      '@next/next': nextPlugin,
    },
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
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
      '@typescript-eslint/no-require-imports': 'warn',
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
