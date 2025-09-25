import { defineConfig, globalIgnores } from "eslint/config"
import path from "node:path"
import { fileURLToPath } from "node:url"
import js from "@eslint/js"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default defineConfig([
  {
    extends: compat.extends("next/core-web-vitals", "next/typescript"),

    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "react/no-unescaped-entities": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
    },
  },
  globalIgnores([
    "node_modules",
    "dist",
    "build",
    "out",
    ".next",
    "coverage",
    "public",
    "next-env.d.ts",
    "prisma/generated",
    "prisma/migrations",
    "scripts",
    "husky",
    ".husky",
    "commitlint.config.js",
    "tailwind.config.cjs",
    "postcss.config.cjs",
    "eslint.config.mjs",
    "babel.config.cjs",
    "webpack.config.cjs",
    "metro.config.js",
    "jest.config.cjs",
    "vite.config.ts",
  ]),
])
