module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb',
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: {
    es6: true,
    node: true,
    browser: true
  },
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'import/prefer-default-export': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.jsx', '.tsx'] }],
    'react/react-in-jsx-scope': 'off'
  },
  ignorePatterns: [
    'node_modules/',
    'dist/'
  ]
};
