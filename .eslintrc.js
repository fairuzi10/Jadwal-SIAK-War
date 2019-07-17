module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/recommended',
    '@vue/standard'
  ],
  rules: {
    'no-console': 'error',
    'no-debugger': 'error',
    'prefer-template': 'warn'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
