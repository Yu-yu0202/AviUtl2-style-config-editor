# AviUtl2 Style Config Editor

AviUtl2のstyle.confファイルを編集するためのTauriアプリケーションです。

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

## 技術スタック

- Frontend: Next.js + React + TypeScript + Material-UI
- Backend: Tauri (Rust)
- Build: Tauri CLI
