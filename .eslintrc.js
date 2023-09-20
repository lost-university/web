module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
  ],
  plugins: ['@typescript-eslint'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    'vuejs-accessibility/anchor-has-content': 'off',
    'max-len': ['error', { "code": 120 }]
  }
};
