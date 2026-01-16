# Tech Terminal

プログラミングスクールのメンター向け技術記事ナレッジベース

![Tech Terminal](https://img.shields.io/badge/Next.js-16.1.2-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-12.8.0-orange?logo=firebase)

## 📖 概要

Tech Terminalは、プログラミングスクールのメンターが技術記事を共有・蓄積・検索するためのナレッジベースアプリケーションです。URLを入力するだけでOGP情報を自動取得し、記事を簡単に登録できます。

### 主な機能

- ✨ **記事管理**: 記事の追加・編集・削除
- 🔍 **検索機能**: タイトル・タグでの部分一致検索（300msデバウンス）
- 🏷️ **フィルタリング**: コース（Python/Web/GameApp/Other）とタグでの絞り込み
- 🖼️ **OGP自動取得**: URLを入力すると自動的にタイトルとサムネイルを取得
- 🌓 **ダークモード**: システム設定に応じた自動切り替え対応
- 📱 **レスポンシブデザイン**: PC・タブレット・モバイルに最適化

## 🛠️ 技術スタック

### フロントエンド
- **Next.js 16.1.2** (App Router) - React フレームワーク
- **React 19.2.3** - UIライブラリ
- **TypeScript 5.x** - 型安全な開発
- **Tailwind CSS v4** - ユーティリティファーストCSS
- **shadcn/ui** - 再利用可能なUIコンポーネント
- **next-themes** - ダークモード管理

### バックエンド・データベース
- **Firebase Firestore** - NoSQLデータベース
- **Next.js Route Handlers** - API エンドポイント

### その他
- **open-graph-scraper** - OGPメタデータ取得
- **date-fns** - 日付フォーマット
- **lucide-react** - アイコンライブラリ

## 🚀 セットアップ

### 前提条件

- Node.js 20.9.0 以上
- pnpm 10.x 以上
- Firebaseプロジェクト

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd tech-terminal
```

### 2. 依存関係のインストール

```bash
pnpm install
```

### 3. Firebase プロジェクトのセットアップ

1. [Firebase Console](https://console.firebase.google.com/) でプロジェクトを作成
2. Firestore Database を有効化（テストモードで開始）
3. プロジェクト設定から Firebase SDK スニペットを取得

### 4. 環境変数の設定

`.env.local.example` をコピーして `.env.local` を作成：

```bash
cp .env.local.example .env.local
```

`.env.local` に Firebase の設定情報を入力：

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 5. Firestore セキュリティルールの設定

Firebase Console で以下のセキュリティルールを設定：

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /articles/{articleId} {
      allow read, write: if true;  // MVP: 全公開
    }
  }
}
```

または、Firebase CLI を使用してデプロイ：

```bash
# Firebase CLI をインストール
npm install -g firebase-tools

# ログイン
firebase login

# Firestore を初期化
firebase init firestore

# セキュリティルールをデプロイ
firebase deploy --only firestore:rules
```

### 6. 開発サーバーの起動

```bash
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開く

## 📝 使い方

### 記事の追加

1. 右上の「記事を追加」ボタンをクリック
2. URLを入力（OGP情報が自動取得されます）
3. タイトル、コース、タグ、メモ、投稿者名を入力
4. 「追加」ボタンをクリック

### 記事の検索・フィルタリング

- **検索バー**: タイトルやタグで検索
- **コースフィルター**: Python / Web / GameApp / Other から選択
- **タグフィルター**: 記事に付けられたタグをクリックして絞り込み

### 記事の編集・削除

- 記事カードにホバーすると編集・削除ボタンが表示されます
- 編集ボタン（鉛筆アイコン）で記事を編集
- 削除ボタン（ゴミ箱アイコン）で削除確認ダイアログを表示

## 🏗️ プロジェクト構造

```
tech-terminal/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── ogp/
│   │   │       └── route.ts          # OGP取得API
│   │   ├── layout.tsx                # ルートレイアウト
│   │   ├── page.tsx                  # メインページ
│   │   └── globals.css               # グローバルスタイル
│   ├── components/
│   │   ├── ui/                       # shadcn/ui コンポーネント
│   │   ├── article-card.tsx          # 記事カード
│   │   ├── article-form.tsx          # 記事フォーム
│   │   ├── search-bar.tsx            # 検索バー
│   │   ├── filter-bar.tsx            # フィルターバー
│   │   ├── delete-dialog.tsx         # 削除確認ダイアログ
│   │   ├── empty-state.tsx           # 空状態表示
│   │   ├── loading-state.tsx         # ローディング表示
│   │   ├── theme-provider.tsx        # テーマプロバイダー
│   │   └── theme-toggle.tsx          # テーマ切り替えボタン
│   ├── services/
│   │   └── article-service.ts        # 記事CRUD操作
│   ├── types/
│   │   └── article.ts                # 型定義
│   └── lib/
│       ├── firebase.ts               # Firebase設定
│       └── utils.ts                  # ユーティリティ関数
├── firestore.rules                   # Firestoreセキュリティルール
├── .env.local.example                # 環境変数テンプレート
└── README.md
```

## 🔧 開発

### ビルド

```bash
pnpm build
```

### 型チェック

```bash
pnpm exec tsc --noEmit
```

### Lint

```bash
pnpm lint
```

## 🚢 デプロイ

### Vercel（推奨）

1. [Vercel](https://vercel.com/) にプロジェクトをインポート
2. 環境変数を設定（`.env.local` の内容）
3. デプロイ

### その他のプラットフォーム

Next.js のビルド出力を使用して、任意のNode.jsホスティングサービスにデプロイ可能です。

詳細は [Next.js デプロイメントドキュメント](https://nextjs.org/docs/app/building-your-application/deploying) を参照してください。

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🤝 貢献

貢献は大歓迎です！Issue や Pull Request をお気軽にお送りください。

---

Made with ❤️ by Tech Terminal Team
