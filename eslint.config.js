import { defineConfig } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import Prettier from 'eslint-plugin-prettier/recommended'
import ts from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

export default defineConfig([
  { files: ['**/*.{js,mjs,ts,vue}'] },
  {
    files: ['**/*.{js,mjs,ts,vue}'],
    languageOptions: { globals: globals.browser }
  },
  {
    files: ['**/*.{js,mjs,ts,vue}'],
    plugins: { js },
    extends: ['js/recommended']
  },
  tseslint.configs.recommended,
  pluginVue.configs['flat/essential'],
  {
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: tseslint.parser } }
  },
  {
    files: ['**/*.ts', '**/*.tsx'], // 针对 TypeScript 文件
    languageOptions: {
      parser: tsParser // 使用 TypeScript 解析器
    },
    plugins: {
      '@typescript-eslint': ts // 启用 @typescript-eslint 插件
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/ban-ts-comment': 'off'
    }
  },
  Prettier //注意必须放最后，不然eslint的默认配置会给prettier的规则覆盖掉
])
