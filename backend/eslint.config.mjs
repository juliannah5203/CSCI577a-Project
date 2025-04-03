import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
  {languageOptions: { 
    globals: {
      // ...globals.browser,
      ...globals.node  // Add Node.js globals (including process)
    },
    // Allow CommonJS module syntax
    sourceType: 'commonjs'
  },},
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {ignores: ['dist/', 'node_modules/', '*.min.js', 'build/', "eslint.config.mjs"],},
];