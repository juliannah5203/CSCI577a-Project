import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
  {
    languageOptions: { 
      globals: {
        ...globals.browser,
        ...globals.node  // Add Node.js globals (including process)
      },
      // Allow CommonJS module syntax
      sourceType: 'commonjs'
    },
    rules: {
      // Disable rules that prevent CommonJS syntax
      'no-commonjs': 'off',
      'import/no-commonjs': 'off',
      'require-await': 'off',
      // Explicitly disable the TypeScript ESLint rule that's causing the error
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off'
    }
  },
  pluginJs.configs.recommended,
  // Customize TypeScript ESLint config to allow CommonJS
  ...tseslint.configs.recommended.map(config => ({
    ...config,
    rules: {
      ...config.rules,
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off'
    }
  })),
  pluginReact.configs.flat.recommended,
];