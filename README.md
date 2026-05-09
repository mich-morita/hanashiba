# はなしば (HANASHIBA)

匿名のAI共感チャットサービス。
アドバイスも解決策も出さない。ただ、受け止める。

---

## 概要

「はなしば」は、感情の「反射」と「共感」に特化した匿名チャットサービスです。
AIはアドバイスを一切しません。ユーザーの言葉をそのまま受け止め、感情に名前をつけ、静かに問い返すだけです。

---

## 技術スタック

| 項目 | 技術 |
|------|------|
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript |
| スタイル | Tailwind CSS v4 |
| DB ORM | Prisma 7 |
| DB | PostgreSQL |
| AI | OpenAI GPT-4o-mini |
| デプロイ | Vercel |

---

## ディレクトリ構成

```
hanashiba/
├── src/
│   ├── app/
│   │   ├── layout.tsx                        # ルートレイアウト (Noto Sans JP)
│   │   ├── page.tsx                          # ステートマシン駆動のルートページ
│   │   ├── globals.css
│   │   ├── chat/[sessionId]/page.tsx         # 直接アクセス → / にリダイレクト
│   │   └── api/
│   │       ├── session/route.ts              # POST: セッション作成
│   │       ├── session/[sessionId]/route.ts  # DELETE: 即時削除
│   │       ├── chat/route.ts                 # POST: AI 応答
│   │       ├── cleanup/route.ts              # GET: Cron 自動削除
│   │       └── analytics/route.ts           # POST: return_visit 記録
│   ├── components/
│   │   ├── ui/Button.tsx
│   │   ├── chat/
│   │   │   ├── ChatWindow.tsx               # チャット画面全体
│   │   │   ├── MessageBubble.tsx            # 吹き出し
│   │   │   ├── MessageInput.tsx             # 入力欄
│   │   │   └── EndingScreen.tsx             # セッション終了画面
│   │   └── lp/Hero.tsx                      # LP (複数の「話しはじめる」ボタン)
│   ├── hooks/
│   │   └── useChat.ts                       # チャットステートマシン
│   ├── lib/
│   │   ├── prisma.ts                        # Prisma singleton (PrismaPg adapter)
│   │   ├── openai.ts                        # OpenAI client + システムプロンプト
│   │   ├── session.ts                       # セッション CRUD
│   │   └── analytics.ts                    # KPI イベント記録
│   └── types/index.ts                       # 共通型 (ChatState, AnalyticsEventType...)
├── prisma/schema.prisma                      # ChatSession / Message / AnalyticsEvent
├── prisma.config.ts                         # Prisma 7 設定
├── vercel.json                              # Cron ジョブ (毎時)
├── .env.example
└── README.md
```

---

## チャット UX ステートマシン

```
idle
 └─[話しはじめる]→ session_active
                     └─[最初のメッセージ送信]→ chatting
                                                └─[話し終える]→ ending (フェードアウト 700ms)
                                                                  └─ ended (感謝メッセージ)
                                                                      └─[もどる]→ idle
```

---

## セッション終了フロー

1. ユーザーが「話し終える」をクリック
2. チャット UI が 700ms でフェードアウト (`opacity-0`)
3. サーバーのセッション + メッセージを削除
4. 「話してくれてありがとう。また話したくなったら、いつでもここで待ってます。」が表示

---

## KPI トラッキング (MVP)

| イベント | 発火タイミング |
|---------|--------------|
| `session_start` | セッション作成時 (POST /api/session) |
| `first_message` | セッション内の最初のメッセージ送信時 |
| `session_end` | セッション削除時 (DELETE /api/session/[id]) |
| `return_visit` | localStorage で再訪問を検出した際 (クライアント起点) |
| `crisis_detected` | 危機キーワードを含むメッセージを受信した際 (POST /api/chat) |

主要KPI: **return_visit rate**

---

## AI ルール (厳格)

- アドバイス禁止
- 解決策提示禁止
- 原因分析禁止
- 判断・評価禁止
- 励まし禁止 (「頑張って」「大丈夫」等)
- 返答は 1〜3 文以内

OpenAI 障害時はソフトなフォールバックメッセージを表示し、セッションは維持します。

---

## ローカル開発

### 1. 環境変数を設定

```bash
cp .env.example .env.local
# DATABASE_URL / OPENAI_API_KEY / CRON_SECRET を記入
```

### 2. パッケージインストール

```bash
npm install
```

### 3. DB マイグレーション

```bash
npx prisma migrate dev --name init
```

### 4. 開発サーバー起動

```bash
npm run dev
```

http://localhost:3000 を開く。

---

## 環境変数一覧

| 変数名 | 説明 | 必須 |
|--------|------|------|
| `DATABASE_URL` | PostgreSQL 接続文字列 | ✅ |
| `OPENAI_API_KEY` | OpenAI API キー | ✅ |
| `CRON_SECRET` | Cron エンドポイント認証トークン | ✅ |

---

## API 仕様

### `POST /api/session`
新しいチャットセッションを作成。TTL は 24 時間。

**Response:** `{ sessionId: string, expiresAt: string }`

### `DELETE /api/session/[sessionId]`
セッションと全メッセージを即時削除 (Cascade)。

### `POST /api/chat`
メッセージ送信 + AI 応答。OpenAI 障害時はフォールバックメッセージを返す。

**Request:** `{ sessionId: string, content: string }`

### `GET /api/cleanup`
期限切れセッションを一括削除 (Vercel Cron 毎時実行)。

**Header:** `Authorization: Bearer {CRON_SECRET}`

### `POST /api/analytics`
クライアント起点の KPI イベントを記録 (`return_visit` のみ受付)。

---

## Vercel デプロイ

1. Vercel にリポジトリを連携
2. 環境変数を Vercel ダッシュボードに設定
3. `vercel.json` の Cron ジョブが自動有効化 (毎時 `/api/cleanup`)

---

## 危機対応

### 基本方針

通常時は「アドバイス禁止・受け止めと共感のみ」を維持します。

ただし、自傷・希死念慮・緊急性の高い表現が含まれる場合のみ、OpenAI API を呼ばずに固定の安全応答を返します。

### 動作

| 状態 | 挙動 |
|------|------|
| 通常 | OpenAI API → AI が共感応答を生成 |
| 危機表現を検知 | OpenAI API を呼ばずに固定安全応答を返す |

危機検知は `src/lib/safety.ts` のキーワードベースの判定で行います。  
検知対象キーワード例：死にたい、消えたい、自殺、自傷、リスカ、首を吊、飛び降り、もう生きていたくない、終わりにしたい など。

### 免責事項

**このアプリは医療・緊急対応サービスではありません。**  
緊急時・危機時は、地域の相談窓口や緊急窓口へつながる必要があります。

| 窓口 | 連絡先 |
|------|--------|
| いのちの電話 | 0120-783-556 |
| よりそいホットライン | 0120-279-338 |
| 救急・警察 | 119 / 110 |

---

## 今後の拡張ポイント

| 機能 | 実装方針 |
|------|---------|
| ストリーミング応答 | `openai.chat.completions.stream()` + ReadableStream |
| 危機検知 | システムプロンプトで自傷キーワードを検出、特別な応答を返す |
| レート制限 | `@upstash/ratelimit` + Vercel KV |
| E2E テスト | Playwright |
| 感情ログ | AI に感情ラベルを JSON で返させ AnalyticsEvent に保存 |
