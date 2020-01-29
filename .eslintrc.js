module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  settings: {
    'import/resolver': {
      webpack: {
        config: '../webpack.renderer.base.js'
      }
    }
  },
  rules: {
    "arrow-parens": "off",
    "no-alert": "off",
    "react/jsx-props-no-spreading": "off",
    "import/no-extraneous-dependencies": "off",
    "no-restricted-syntax": "off",
    "react/jsx-filename-extension": "off",
    "react/jsx-one-expression-per-line": "off",
    "react/jsx-curly-brace-presence": ["error", { "props": "never", "children": "ignore" }],
    "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "no-console": "off",
  },
};
