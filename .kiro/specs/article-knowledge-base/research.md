# Research & Design Decisions

## Summary
- **Feature**: article-knowledge-base
- **Discovery Scope**: New Feature（グリーンフィールド CRUD + OGP 取得）
- **Key Findings**:
  - Firebase Client SDK は `'use client'` ディレクティブが必要、サーバーサイドは Admin SDK を使用
  - OGP パースには `open-graph-scraper` が最適（TypeScript サポート、活発なメンテナンス）
  - Next.js 16 では外部画像に `remotePatterns` が必須、動的ドメインは `unoptimized` か img タグを検討

## Research Log

### Firebase Firestore と Next.js App Router の統合
- **Context**: MVP でのデータ永続化に Firebase Firestore を使用する設計
- **Sources Consulted**:
  - [Firebase Codelabs - Next.js Integration](https://firebase.google.com/codelabs/firebase-nextjs)
  - [Using Firestore with Next.js - MakerKit](https://makerkit.dev/blog/tutorials/firestore-nextjs)
- **Findings**:
  - Firebase Client SDK（v9+）はブラウザ API に依存、Server Components では直接使用不可
  - クライアント側の CRUD 操作は `'use client'` コンポーネントで実行
  - Route Handlers でのサーバーサイド操作には Firebase Admin SDK を使用可能
  - 環境変数は `NEXT_PUBLIC_` プレフィックス（クライアント用）と通常変数（Admin SDK 用）を分離
- **Implications**:
  - MVP では Client SDK + `'use client'` で十分（リアルタイム更新不要）
  - 将来的に SSR や Admin 操作が必要な場合は Admin SDK を追加

### OGP メタタグのパース
- **Context**: URL からタイトル・サムネイルを自動取得する機能
- **Sources Consulted**:
  - [open-graph-scraper - npm](https://www.npmjs.com/package/open-graph-scraper)
  - [open-graph-scraper - GitHub](https://github.com/jshemas/openGraphScraper)
- **Findings**:
  - `open-graph-scraper` が最も人気（週間 30万+ DL）、TypeScript 宣言付き
  - Fetch API ベースで Node.js 環境で動作
  - og:title, og:image, og:description を標準サポート
  - タイムアウト設定、カスタムヘッダー対応
  - ブラウザでは使用不可（サーバーサイド専用）
- **Implications**:
  - Route Handler で OGP 取得 API を実装（CORS 回避）
  - クライアントから API を呼び出し、結果をフォームに反映

### Next.js 16 外部画像の取り扱い
- **Context**: OGP 画像（様々なドメイン）を next/image で表示
- **Sources Consulted**:
  - [Next.js Image Component](https://nextjs.org/docs/app/api-reference/components/image)
  - [remotePatterns Configuration](https://nextjs.org/docs/messages/next-image-unconfigured-host)
- **Findings**:
  - Next.js 16 では `remotePatterns` が必須（セキュリティ強化）
  - ワイルドカード `*` はホスト名に使用不可
  - 動的なドメイン（OGP 画像）への対応策:
    1. `unoptimized` プロパティで最適化をスキップ
    2. 標準 `<img>` タグを使用
    3. 画像プロキシサーバーを用意（MVP では過剰）
- **Implications**:
  - MVP では `unoptimized` または `<img>` タグを使用
  - 既知のドメイン（Qiita, Zenn 等）のみ remotePatterns に追加する選択肢もあり

## Architecture Pattern Evaluation

| Option | Description | Strengths | Risks / Limitations | Notes |
|--------|-------------|-----------|---------------------|-------|
| Feature-based | `/src/features/articles/` に関連コードを集約 | 高凝集、スケーラブル | 小規模 MVP には過剰 | Steering の推奨構成 |
| Flat App Router | `/src/app/` 直下に全コード配置 | シンプル、迅速な開発 | 成長時にリファクタ必要 | MVP 向け |
| Hybrid | App Router + 共有コンポーネント分離 | バランス良い | 若干の複雑さ | **採用** |

**選択**: Hybrid アプローチ
- `/src/app/` - ページ、Route Handlers
- `/src/components/` - 再利用可能 UI
- `/src/lib/` - Firebase 設定、型定義、ユーティリティ

## Design Decisions

### Decision: Firebase クライアントアーキテクチャ
- **Context**: MVP での Firebase Firestore 統合方法
- **Alternatives Considered**:
  1. Client SDK のみ（`'use client'` コンポーネント）
  2. Admin SDK のみ（Route Handlers 経由）
  3. 両方併用
- **Selected Approach**: Client SDK のみ
- **Rationale**: MVP では認証なし、シンプルな CRUD のみ。クライアント直接アクセスで十分
- **Trade-offs**: サーバーサイドバリデーションなし、将来的にセキュリティルール強化が必要
- **Follow-up**: Firestore Security Rules の設定、将来の認証追加時に再評価

### Decision: OGP 取得の実装方式
- **Context**: ブラウザから外部 URL の OGP を取得する必要がある
- **Alternatives Considered**:
  1. クライアントサイドで直接 fetch（CORS でブロック）
  2. Route Handler で open-graph-scraper を使用
  3. 外部 API サービス（Microlink 等）
- **Selected Approach**: Route Handler + open-graph-scraper
- **Rationale**: CORS 回避、外部依存なし、コスト無料
- **Trade-offs**: サーバーリソース使用、レスポンス時間は外部サイトに依存
- **Follow-up**: タイムアウト設定、エラーハンドリング

### Decision: 外部画像の表示方式
- **Context**: 様々なドメインの OGP 画像を表示
- **Alternatives Considered**:
  1. `next/image` + `unoptimized`
  2. 標準 `<img>` タグ
  3. 主要ドメインのみ remotePatterns 設定
- **Selected Approach**: 標準 `<img>` タグ + 主要ドメイン remotePatterns
- **Rationale**: 柔軟性とパフォーマンスのバランス
- **Trade-offs**: 一部画像で最適化されない
- **Follow-up**: Qiita, Zenn, dev.to 等の主要ドメインを remotePatterns に追加検討

## Risks & Mitigations
- **OGP 取得失敗** — フォールバックで手動入力を促す、エラーを表示しない
- **Firestore セキュリティ** — MVP 後に Security Rules 強化、認証追加
- **画像読み込みエラー** — プレースホルダー画像でフォールバック
- **検索パフォーマンス** — MVP では全件取得 + クライアントフィルタ、将来的に Firestore クエリ最適化

## References
- [Firebase Codelabs - Next.js](https://firebase.google.com/codelabs/firebase-nextjs) — 公式統合ガイド
- [open-graph-scraper](https://github.com/jshemas/openGraphScraper) — OGP パースライブラリ
- [Next.js Image Component](https://nextjs.org/docs/app/api-reference/components/image) — 画像最適化設定
- [Firestore with Next.js](https://makerkit.dev/blog/tutorials/firestore-nextjs) — 実装パターン
