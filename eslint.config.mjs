import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default tseslint.config({
  extends: [
    eslint.configs.recommended,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
    ...compat.extends('next/core-web-vitals'),
    ...tseslint.configs.recommendedTypeChecked,
  ],
  ignores: ['node_modules/**', '.next/**', 'out/**'],
  plugins: {
    react
  },
  languageOptions: {
    globals: {
      process: true,
      global: true
    },
    parserOptions: {
      projectService: true,
      tsconfigRootDir: __dirname,
    },
  },
  rules: {
    'quotes': ['error', 'single'],
    'key-spacing': ['error', { 'beforeColon': false }],
    'semi': [2, 'never'],
    'block-spacing': 'error',
    'object-curly-spacing': ['error', 'always'],
    'indent': ['error', 2],
    '@typescript-eslint/consistent-type-imports': 'error',
    'no-redeclare': 'off',
    '@typescript-eslint/no-redeclare': 'error',
    '@typescript-eslint/no-unused-vars': ['error', {
      'args': 'all',
      'argsIgnorePattern': '^_',
      'caughtErrors': 'all',
      'caughtErrorsIgnorePattern': '^_',
      'destructuredArrayIgnorePattern': '^_',
      'varsIgnorePattern': '^_',
      'ignoreRestSiblings': true
    }]
  },
})