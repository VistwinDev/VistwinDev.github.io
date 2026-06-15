---
repo: visustwin-showcase
github_url: https://github.com/metaarchetech/visustwin-showcase
branch: main
latest_commit: 517116f
latest_commit_msg: "feat: motion gallery — 5 interactive patterns"
latest_commit_date: 2026-04-18
status: doing
device_target: 桌機瀏覽器
stack: Next.js 16 · React 19 · TypeScript strict · Tailwind v4 · Framer Motion 12 · Phosphor Icons · next-intl
open_prs: []
updated: 2026-04-18
---

# visustwin-showcase

建商展示用前端 app — 數位孿生 Dashboard，iOS app 質感，VisTwin Design System。

作為 VisTwin 平台的主展示介面，整合來自 WebController（OSC Bridge via WebSocket `ws://localhost:9000`）與 welltek-twin（MQTT Bridge via `ws://localhost:3001`）的即時資料。無後端時自動 fallback 至 mock 資料，可獨立展示。

## 最新進度

`517116f` — feat: motion gallery — 5 interactive patterns（2026-04-18）

今日在 `main` 上新增 motion gallery，包含 5 種互動動態模式。目前開發主線在 `main`，尚無 open PR。

## 已知 TODO

- Demo mode 評估（Vercel 上線前是否需要隔離 OSC/MQTT 依賴）
- Vercel deploy（showcase 計畫直接上，不做 demo mode 隔離）
- 與 `@vistwin/ui` 共用 primitives 套件整合（抽離時機：demo 後）

## 關鍵決策

- **Vercel deploy**：showcase 可直接部署，無需 demo mode（OSC/MQTT 有 mock fallback）
- **rename**：demo 後執行 VisTwin → VisTwin 全域 rename，影響此 repo 的 GitHub remote URL

## 連結

- GitHub：[VisTwin/visustwin-showcase](https://github.com/metaarchetech/visustwin-showcase)
- Dev：`http://localhost:3000`（`npm run dev`）
- OSC Bridge：`ws://localhost:9000`（需啟動 WebController bridge.js）
- MQTT Bridge：`ws://localhost:3001`（需啟動 welltek-twin server）

## 返回

- [[02 產品/VisTwin/README|VisTwin]]
