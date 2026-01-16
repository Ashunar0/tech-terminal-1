# Project Structure

## Organization Philosophy

Next.js App Router の規約に従った構成。`src/` ディレクトリ内にアプリケーションコードを配置し、ルートディレクトリには設定ファイルのみを置く。

## Directory Patterns

### App Router (`/src/app/`)
**Location**: `/src/app/`
**Purpose**: ページ、レイアウト、ルーティング
**Example**: `page.tsx`, `layout.tsx`, `globals.css`

### Public Assets (`/public/`)
**Location**: `/public/`
**Purpose**: 静的アセット（画像、フォント、favicon）
**Example**: `/public/next.svg`, `/public/vercel.svg`

### Components（推奨構成）
**Location**: `/src/components/`
**Purpose**: 再利用可能な UI コンポーネント
**Example**: `Button.tsx`, `Card.tsx`

### Features（推奨構成）
**Location**: `/src/features/`
**Purpose**: 機能単位でまとめたコード（コンポーネント、hooks、utils）
**Example**: `/src/features/auth/`, `/src/features/dashboard/`

## Naming Conventions

- **Files**: kebab-case または PascalCase（コンポーネント）
- **Components**: PascalCase（`MyComponent.tsx`）
- **Hooks**: camelCase with `use` prefix（`useAuth.ts`）
- **Utilities**: camelCase（`formatDate.ts`）

## Import Organization

```typescript
// 1. External packages
import { useState } from 'react'
import Image from 'next/image'

// 2. Internal modules (absolute)
import { Button } from '@/components/Button'

// 3. Relative imports
import { localUtil } from './utils'

// 4. Styles
import './styles.css'
```

**Path Aliases**:
- `@/*`: Maps to `./src/*`

## Code Organization Principles

- **Colocation**: 関連するファイルは近くに配置
- **Server Components First**: デフォルトで Server Component、必要時のみ `'use client'`
- **Feature-based**: 機能単位でのコード整理を推奨
- **Single Responsibility**: 1ファイル1責務

---
_Document patterns, not file trees. New files following patterns shouldn't require updates_
