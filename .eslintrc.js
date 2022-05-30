module.exports = {
  env: {
    es6: false,
    node: true
  },
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 8
  },
  rules: {
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],

    semi: ["error", "always"]
  }
};
