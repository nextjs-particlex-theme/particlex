import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default tseslint.config({
  extends: [
    eslint.configs.recommended,
    ...compat.extends('next/core-web-vitals'),
    ...tseslint.configs.recommended,
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
      project: true,
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
    '@typescript-eslint/no-require-imports': 'off',
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