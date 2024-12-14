import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: false,
    jsx: true,
  },
  rules: {
    'no-console': 'warn',
    'ts/no-unused-expressions': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unicorn/consistent-function-scoping': 'off',
  },
}, { ignores: ['**/*.d.ts'] })
