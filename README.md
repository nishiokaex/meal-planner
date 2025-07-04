# 献立スワイプアプリ

過去の料理履歴から最適な献立を提案し、フラッシュカード形式のUIで献立を決定できるアプリ

## 画面構成

- 献立履歴管理
- 献立提案
- 買い物リスト

## 献立提案画面

- ユーザーはTinderライクな決定UIで、提示されたカードを左右にスワイプして「決定/次」を判断します。
- OKボタンで献立決定します。

### レイアウト構造
- **単一カード表示**: 同時に表示するカードは1枚のみ
- **カード重ね**: 次のカードを背景に薄く表示（深度感を演出）
- **中央配置**: カードは画面中央に配置

### カードデザイン
- **カードサイズ**: モバイル画面の80-90%の幅、適切な高さ
- **角丸**: border-radius: 20px以上
- **影**: box-shadow で浮遊感を演出
- **コンテンツエリア**: 画像、タイトル、説明文を含む

### スワイプ機能
- **左スワイプ**: 拒否（×アイコン表示、赤色）
- **右スワイプ**: 承認（♡アイコン表示、緑色）
- **スワイプ閾値**: 画面幅の30%以上で決定
- **アニメーション**: カードが画面外に飛んでいく動作

### 視覚的フィードバック
- **ドラッグ中**: カードの傾きと透明度変化
- **判定表示**: スワイプ方向に応じたアイコンとカラー
- **決定時**: カードが勢いよく画面外へ移動
- **次カード表示**: 0.3秒のディレイ後に次のカードをフェードイン

### アニメーション仕様
- **ドラッグ中**: `transform: translateX() rotate()` を使用
- **決定時**: `transform: translateX(±150vw) rotate(±30deg)`
- **アニメーション時間**: 0.3-0.5秒
- **イージング**: cubic-bezier(0.25, 0.46, 0.45, 0.94)

### 基本操作
1. カードが表示される
2. ユーザーがスワイプ開始
3. ドラッグ中は視覚的フィードバック
4. 閾値を超えたら決定、未満なら復帰
5. 決定後は次のカードを表示

### 追加機能（オプション）
- **詳細表示**: タップで詳細情報を表示
- **自動進行**: 一定時間で自動スキップ

### 期待する動作
1. 滑らかで自然なスワイプ操作
2. 直感的な視覚フィードバック
3. 中毒性のある連続操作感
4. モバイル最適化された操作性
5. 判定結果の確実な記録
