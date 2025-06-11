import { FlatCompat } from '@eslint/eslintrc'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  {
    //MEMO: 時間短縮のため追加
    ignores: ['node_modules', '.next', 'out', 'dist', '*.config.js'],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  // Prettierとの統合
  ...compat.extends('prettier'),
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
]

export default eslintConfig
