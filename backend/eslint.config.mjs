import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

/** @type {import('eslint').Linter.Config[]} */
export default defineConfig([
  {
    ignores: ['dist/', 'node_modules/', '*.min.js', 'build/', "eslint.config.mjs", "__test__/*.test.js"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: { 
      globals: {
        // ...globals.browser,
        ...globals.node  // Add Node.js globals (including process)
      },
      sourceType: 'commonjs',
    },
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
]);
