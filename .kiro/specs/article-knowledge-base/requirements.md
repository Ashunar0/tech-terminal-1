# Requirements Document

## Introduction

Tech Terminal は、プログラミングスクールのメンター向け技術記事管理 Web アプリケーションです。Qiita・Zenn・ブログなどの技術記事を URL ブックマークとして一元管理し、メンター間でナレッジを共有・蓄積することを目的としています。

**背景・課題**:
- 有用な技術記事が Slack、スプレッドシートなど複数箇所に散在
- 時間が経つと忘れ去られ、技術ノウハウが蓄積されない
- 同じ記事を何度も探す非効率が発生

**MVP スコープ**: 認証なしのシンプルな CRUD アプリケーション（OGP 自動取得含む）

---

## Requirements

### Requirement 1: 記事登録

**Objective:** As a メンター, I want 技術記事を URL で登録できる, so that ナレッジを一元管理できる

#### Acceptance Criteria

1. When ユーザーが「記事追加」ボタンをクリックする, the Tech Terminal shall 記事登録フォームを表示する
2. When ユーザーが URL を入力する, the Tech Terminal shall OGP 情報（タイトル・サムネイル）を自動取得してフォームに反映する
3. The Tech Terminal shall 自動取得されたタイトルをユーザーが編集できる
4. When ユーザーが必須項目（URL、タイトル、コース、投稿者名）を入力して送信する, the Tech Terminal shall 記事を Firestore に保存する
5. When 記事が正常に保存される, the Tech Terminal shall 記事一覧画面に遷移し、新規記事を表示する
6. If 必須項目が未入力の状態で送信しようとする, the Tech Terminal shall バリデーションエラーを表示し、送信を阻止する
7. If URL の形式が不正な場合, the Tech Terminal shall URL 形式エラーを表示する
8. The Tech Terminal shall 以下の入力フィールドを提供する:
   - URL（必須）
   - タイトル（必須、OGP から自動取得 + 手動編集可能）
   - コース選択（必須、Python / Web / GameApp / Other）
   - タグ（任意、複数入力可能）
   - メモ（任意）
   - 投稿者名（必須）

---

### Requirement 2: OGP 情報取得

**Objective:** As a メンター, I want URL を入力するだけでタイトルとサムネイルを取得したい, so that 記事登録の手間を省ける

#### Acceptance Criteria

1. When ユーザーが URL を入力フィールドに入力する, the Tech Terminal shall サーバーサイドで OGP メタデータを取得する
2. The Tech Terminal shall 以下の OGP 情報を取得する:
   - og:title（タイトル）
   - og:image（サムネイル画像 URL）
   - og:description（説明、任意）
3. When OGP 取得に成功する, the Tech Terminal shall タイトルフィールドを自動入力し、サムネイルプレビューを表示する
4. If OGP 取得に失敗した場合（タイムアウト、CORS、メタデータなし）, the Tech Terminal shall エラーを表示せず、ユーザーに手動入力を促す
5. While OGP を取得中, the Tech Terminal shall ローディングインジケーターを表示する
6. The Tech Terminal shall OGP 取得は Route Handler（API Route）経由で行い、CORS 制約を回避する

---

### Requirement 3: 記事一覧表示

**Objective:** As a メンター, I want 登録された記事を一覧で確認できる, so that 必要な記事を素早く見つけられる

#### Acceptance Criteria

1. When ユーザーがトップページにアクセスする, the Tech Terminal shall 登録済み記事の一覧をカード形式で表示する
2. The Tech Terminal shall 各記事カードに以下の情報を表示する:
   - サムネイル画像（OGP 画像、なければプレースホルダー）
   - タイトル（リンク付き）
   - コース
   - タグ一覧
   - 投稿者名
   - 登録日時
3. The Tech Terminal shall 記事を登録日時の降順（新しい順）で表示する
4. When ユーザーが記事カードをクリックする, the Tech Terminal shall 元の記事 URL を新しいタブで開く
5. While 記事が 0 件の場合, the Tech Terminal shall 「記事がありません」のメッセージと記事追加への誘導を表示する
6. If サムネイル画像の読み込みに失敗した場合, the Tech Terminal shall デフォルトのプレースホルダー画像を表示する

---

### Requirement 4: 記事フィルタリング

**Objective:** As a メンター, I want コースやタグで記事を絞り込みたい, so that 関連する記事だけを効率的に閲覧できる

#### Acceptance Criteria

1. The Tech Terminal shall コース選択フィルター（全て / Python / Web / GameApp / Other）を提供する
2. When ユーザーがコースフィルターを選択する, the Tech Terminal shall 選択されたコースの記事のみを表示する
3. The Tech Terminal shall 登録済みタグのフィルター選択を提供する
4. When ユーザーがタグフィルターを選択する, the Tech Terminal shall 選択されたタグを含む記事のみを表示する
5. When コースとタグの両方が選択されている, the Tech Terminal shall 両方の条件を満たす記事のみを表示する（AND 条件）
6. When フィルター条件に一致する記事が 0 件の場合, the Tech Terminal shall 「条件に一致する記事がありません」と表示する

---

### Requirement 5: 記事検索

**Objective:** As a メンター, I want キーワードで記事を検索したい, so that 特定の記事を素早く見つけられる

#### Acceptance Criteria

1. The Tech Terminal shall 検索バーを記事一覧の上部に表示する
2. When ユーザーが検索キーワードを入力する, the Tech Terminal shall タイトルまたはタグに部分一致する記事を表示する
3. The Tech Terminal shall 検索とフィルターを併用できる
4. When 検索結果が 0 件の場合, the Tech Terminal shall 「検索結果がありません」と表示する
5. When 検索キーワードをクリアする, the Tech Terminal shall 全記事を表示する

---

### Requirement 6: 記事編集・削除

**Objective:** As a メンター, I want 登録済み記事を編集・削除したい, so that 情報を最新に保てる

#### Acceptance Criteria

1. The Tech Terminal shall 各記事カードに編集ボタンと削除ボタンを表示する
2. When ユーザーが編集ボタンをクリックする, the Tech Terminal shall 記事編集フォームを表示する
3. When 編集フォームで URL を変更する, the Tech Terminal shall OGP 情報を再取得してタイトル・サムネイルを更新できる
4. When ユーザーが編集内容を保存する, the Tech Terminal shall Firestore のデータを更新し、一覧を再表示する
5. When ユーザーが削除ボタンをクリックする, the Tech Terminal shall 削除確認ダイアログを表示する
6. When ユーザーが削除を確認する, the Tech Terminal shall 記事を Firestore から削除し、一覧から除去する
7. If 削除がキャンセルされた場合, the Tech Terminal shall 何も変更せずダイアログを閉じる

---

### Requirement 7: データ永続化

**Objective:** As a システム, I want データを Firebase Firestore に保存したい, so that データが永続化され、複数ユーザー間で共有できる

#### Acceptance Criteria

1. The Tech Terminal shall Firebase Firestore を使用して記事データを永続化する
2. The Tech Terminal shall 以下のデータ構造で記事を保存する:
   - id: string（自動生成）
   - url: string
   - title: string
   - thumbnailUrl: string | null（OGP 画像 URL）
   - course: "python" | "web" | "gameapp" | "other"
   - tags: string[]
   - memo: string
   - author: string
   - createdAt: Timestamp
   - updatedAt: Timestamp
3. When 記事が更新される, the Tech Terminal shall updatedAt を現在時刻に更新する
4. If Firestore への接続に失敗した場合, the Tech Terminal shall エラーメッセージを表示する

---

### Requirement 8: レスポンシブ UI

**Objective:** As a メンター, I want PC とモバイルの両方で使いたい, so that 場所を選ばずアクセスできる

#### Acceptance Criteria

1. The Tech Terminal shall PC（1024px 以上）でカード形式のグリッドレイアウトを表示する
2. The Tech Terminal shall モバイル（768px 未満）でシングルカラムレイアウトを表示する
3. The Tech Terminal shall タッチデバイスでも操作可能な UI を提供する
4. The Tech Terminal shall ダークモードに対応する

---

## Future Enhancements (MVP 後)

以下の機能は MVP スコープ外とし、将来の拡張候補とする:

- [ ] Firebase Auth による認証
- [ ] いいね/おすすめ度機能
- [ ] 学習パス（記事を順番に並べてカリキュラム化）
- [ ] Slack 連携（Slack で共有された URL を自動登録）

---

## Technical Constraints

- **フロントエンド**: Next.js 16 App Router
- **バックエンド**: Next.js Route Handlers
- **データベース**: Firebase Firestore
- **スタイリング**: Tailwind CSS v4
- **デプロイ**: Vercel
- **認証**: なし（MVP）
- **OGP 取得**: サーバーサイド（Route Handler）で実行し CORS を回避
