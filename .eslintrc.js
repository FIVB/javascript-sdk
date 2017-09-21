module.exports = {
  root: true,
  globals: { 'fetch': false, 'Headers': false },
  extends: 'airbnb-base',
  rules: {
    'semi': ['error', 'never'],
    'space-before-function-paren': ['error', 'always'],
    'no-void': 0,
  },
}
