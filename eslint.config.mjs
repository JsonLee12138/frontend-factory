import js from '@eslint/js';
import airbnb from 'eslint-config-airbnb';
import importPlugin from 'eslint-plugin-import';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import typescript from '@typescript-eslint/eslint-plugin';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['**/dist/**', '**/node_modules/**'] },
  js.configs.recommended,
  {
    rules: {
      ...airbnb.rules,
    },
  },
  {
    files: ['*.ts', '*.tsx'],
    languageOptions: {
      parser: typescriptParser,
    },
    plugins: {
      '@typescript-eslint': typescript,
    },
    rules: {
      // TypeScript-specific rules can go here
    },
  },
  {
    plugins: {
      import: importPlugin,
      'unused-imports': unusedImportsPlugin,
      prettier: prettierPlugin,
      '@typescript-eslint': typescriptPlugin,
    },
    languageOptions: {
      ecmaVersion: 2021, // 对应 `es6: true`
      sourceType: 'module', // 如果你使用 ES 模块
      parser: typescriptParser,
      globals: {
        ...globals.browser,
        ...globals.node,
        // 这里配置环境特定的全局变量
        window: 'readonly', // 对应 `browser: true`
        process: 'readonly', // 对应 `node: true`
        jest: 'readonly', // 对应 `jest: true`
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'prettier/prettier': 'error',
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
        },
      ],
    },
    ignores: ['**/dist/**', '**/node_modules/**'],
  },
);
