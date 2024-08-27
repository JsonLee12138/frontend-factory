import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import base from '../../eslint.config.mjs';
import reactPlugin from 'eslint-plugin-react';

export default tseslint.config({ ignores: ['dist'] }, base, {
  files: ['**/*.{js,jsx,ts,tsx}'], // 支持所有 JS/TS 文件类型
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true, // 添加对 JSX 的支持
    },
  },
  plugins: {
    react: reactPlugin,
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh,
  },
  rules: {
    ...reactHooks.configs.recommended.rules,
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/jsx-filename-extension': [
      1,
      { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    ],
    'react/prop-types': 'off',
    'react/prefer-stateless-function': 'off',
    'react/state-in-constructor': [2, 'never'],
    'react/no-access-state-in-setstate': 'error',
    'react/no-unused-state': 'warn',
    'react/sort-comp': [
      2,
      {
        order: [
          'static-variables',
          'static-methods',
          'lifecycle',
          'everything-else',
          'render',
        ],
      },
    ],
    'react-hooks/rules-of-hooks': 'error', // 检查 Hook 的规则
    'react-hooks/exhaustive-deps': 'warn', // 检查 effect 的依赖
    'react/no-direct-mutation-state': 'error',
  },
  settings: {
    react: {
      version: 'detect', // 自动检测 React 版本
    },
  },
});
