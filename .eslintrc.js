module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // disallows any space followed by the ( of arguments.
    'space-before-function-paren': ['error',
      {
        "anonymous": "always",
        "named": "never",
        "asyncArrow": "ignore"
      }
    ],
    // tabbed indentation
    'indent': ['error', 'tab'
    ],
    // enforce variables to be declared either together or separately in functions
    'one-var': 0,
    // allow tabs
    'no-tabs': 'off'
  },
  "globals": {},
}