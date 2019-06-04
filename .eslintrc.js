module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': 'error',
    'no-debugger': 'error'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
