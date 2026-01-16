# Technology Stack

## Architecture

Next.js App Router を使用したモダンな React アプリケーション。Server Components をデフォルトとし、必要に応じて Client Components を使用する。

## Core Technologies

- **Language**: TypeScript 5.x (strict mode)
- **Framework**: Next.js 16.1.2 (App Router)
- **UI Library**: React 19.2.3
- **Runtime**: Node.js 20+

## Key Libraries

- **UI Components**: shadcn/ui (new-york style, CSS variables)
- **Icons**: lucide-react
- **Styling**: Tailwind CSS v4 (CSS-first configuration)
- **Utilities**: clsx, tailwind-merge, class-variance-authority
- **Fonts**: Geist Sans / Geist Mono (next/font/google)

## Development Standards

### Type Safety
- TypeScript strict mode 有効
- `any` 型の使用を避ける
- React コンポーネントには適切な Props 型を定義

### Code Quality
- ESLint 9 + eslint-config-next (core-web-vitals, typescript)
- Prettier 未導入（必要に応じて追加）

### Testing
- テストフレームワーク未導入（必要に応じて追加）

## Development Environment

### Required Tools
- Node.js 20+
- pnpm（推奨パッケージマネージャー）

### Common Commands
```bash
# Dev: pnpm dev
# Build: pnpm build
# Lint: pnpm lint
# Start: pnpm start
```

## Key Technical Decisions

- **App Router**: Pages Router ではなく App Router を採用（React Server Components 活用）
- **Tailwind CSS v4**: CSS-first configuration（`@import "tailwindcss"`）
- **CSS Variables**: ダークモード対応にネイティブ CSS 変数を使用
- **Path Alias**: `@/*` → `./src/*` マッピング

---
_Document standards and patterns, not every dependency_
