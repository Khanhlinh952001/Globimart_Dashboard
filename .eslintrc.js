const { resolve } = require('node:path');

const project = resolve(__dirname, 'tsconfig.json');

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  extends: [
    require.resolve('@vercel/style-guide/eslint/node'),
    require.resolve('@vercel/style-guide/eslint/typescript'),
    require.resolve('@vercel/style-guide/eslint/browser'),
    require.resolve('@vercel/style-guide/eslint/react'),
    require.resolve('@vercel/style-guide/eslint/next'),
  ],
  settings: {
    'import/resolver': {
      typescript: {
        project,
      },
    },
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 'off', // Tắt quy tắc này
    '@typescript-eslint/no-empty-interface': 'off', // Tắt quy tắc này
    '@typescript-eslint/no-shadow': 'off', // Tắt quy tắc này
    'import/newline-after-import': 'off', // Tắt quy tắc này
    'unicorn/filename-case': 'off', // Tắt quy tắc này
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Tắt quy tắc này
    '@typescript-eslint/dot-notation': 'off', // Tắt quy tắc này
    '@typescript-eslint/no-misused-promises': 'off', // Tắt quy tắc này
    '@typescript-eslint/no-non-null-assertion': 'off', // Tắt quy tắc này
    '@typescript-eslint/no-unnecessary-condition': 'off', // Tắt quy tắc này
    '@typescript-eslint/require-await': 'off', // Tắt quy tắc này
    '@typescript-eslint/prefer-nullish-coalescing': 'off', // Tắt quy tắc này
    '@typescript-eslint/restrict-template-expressions': 'off', // Tắt quy tắc này
    'import/no-default-export': 'off', // Tắt quy tắc này
    'import/no-extraneous-dependencies': 'off', // Tắt quy tắc này
    'no-nested-ternary': 'off', // Tắt quy tắc này
    'no-redeclare': 'off', // Tắt quy tắc này
    'react/jsx-fragments': 'off', // Tắt quy tắc này
    'react/prop-types': 'off', // Tắt quy tắc này
    '@next/next/no-img-element': 'off', // Tắt quy tắc này
    'no-console': 'off', // Tắt quy tắc này
    '@typescript-eslint/explicit-function-return-type': 'off', // Tắt quy tắc này
  },
  ignorePatterns: ['node_modules/', 'dist/', 'build/'], // Bỏ qua các thư mục này
};
