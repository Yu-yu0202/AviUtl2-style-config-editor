# AviUtl2 style.conf Editor

AviUtl2のstyle.confファイルを編集するためのアプリケーションです。
<img width="1202" height="832" alt="image" src="https://github.com/user-attachments/assets/82581f3a-6817-4a95-97b5-33643d5acf40" />
<img width="1202" height="832" alt="image" src="https://github.com/user-attachments/assets/c37217e2-47d0-460a-bd70-eda3702cf944" />



## 開発環境のセットアップ

### 必要な環境
- Node.js (v18以上,動作確認済み:v22.14.0)
- Rust (最新版)
- pnpm

### 依存関係のインストール
```bash
pnpm install
```

### 開発サーバーの起動
```bash
pnpm tauri:dev
```

### ビルド
```bash
pnpm tauri:build
```

## 機能

- AviUtl2のstyle.confファイルの読み込み
- フォント、色、レイアウト、フォーマット設定の編集
- 設定ファイルの保存
- 直感的なGUIインターフェース

## 使用方法

1. アプリケーションを起動
2. "設定ファイルを選択"ボタンでstyle.confファイルを選択
3. 各種設定を編集
4. "設定を保存"ボタンで変更を保存

## 開発ワークフロー

### Conventional Commits

このプロジェクトでは[Conventional Commits](https://www.conventionalcommits.org/)を使用しています。

#### コミットメッセージの形式
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### 主なタイプ
- `feat`: 新機能の追加
- `fix`: バグ修正
- `docs`: ドキュメントの変更
- `style`: コードスタイルの変更
- `refactor`: リファクタリング
- `test`: テストの追加・修正
- `chore`: その他の変更

#### 対話的なコミット
```bash
pnpm commit
```

#### 手動でのコミット
```bash
git commit -m "feat: add new feature"
git commit -m "fix: fix bug"
git commit -m "docs: update README"
git commit -m "style: format code"
git commit -m "refactor: improve code structure"
git commit -m "test: add unit tests"
git commit -m "chore: update dependencies"
```

### コード品質

- **ESLint**: コードの品質チェック
- **Prettier**: コードフォーマット
- **Husky**: Gitフック
- **lint-staged**: ステージされたファイルの自動lint

## 技術スタック

- Frontend: Next.js + React + TypeScript + Material-UI
- Backend: Tauri (Rust)
- Build: Tauri CLI
- Code Quality: ESLint, Prettier, Husky, lint-staged
