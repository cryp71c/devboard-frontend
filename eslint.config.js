import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // dist: build output. crc32c_wasm.js: wasm-bindgen-generated glue code,
  // not hand-written — not ours to lint.
  globalIgnores(['dist', 'src/wasm/crc32c/crc32c_wasm.js']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // argsIgnorePattern covers the react-markdown `components` override
      // convention of destructuring `node` out of props specifically so it
      // doesn't get spread onto the DOM element (see BlogDetail.jsx,
      // HTBWriteupDetail.jsx) — the "unused" var there is load-bearing.
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^node$' }],
    },
  },
])
