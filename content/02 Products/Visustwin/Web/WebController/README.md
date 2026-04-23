---
repo: visustwin-webcontroller
github_url: https://github.com/metaarchetech/visustwin-webcontroller
branch: feature/dna-port-v2
latest_commit: f7ac865
latest_commit_msg: "refine: scale back hero text proportion, add watermark background fill"
latest_commit_date: 2026-04-18
status: doing
device_target: iPad 橫向（Pro 2732×2048 / Air 2360×1640），touch-first
stack: React + Vite · Node.js bridge · OSC/UDP · WebSocket
open_prs: []
updated: 2026-04-18
---

# WebController

OTA 120 年建築生命週期 Archviz 控制器。透過 iPad 瀏覽器遠端操控 Unreal Engine 及 Omniverse Kit 場景，核心是 OSC 訊號控制。

架構：`iPad/Browser ──WSS──▶ Bridge (Node.js, port 9000) ──OSC/UDP──▶ Unreal Engine / Omniverse Kit`。外部資訊（環境數據、系統狀態）以 ambient 方式呈現，不搶主角操控區域。

## 最新進度

`feature/dna-port-v2` — 今日（2026-04-18）主要推進：

- `a1bf453` — 階層重排 + 120 週期 scrubber + 3 sequence tabs + 6 sub-experience cards + 寶舖 pill
- `f7ac865` — hero text 比例調整 + watermark 背景填色（當日最新）

`master` 最新：`f21e618` — Tune 3D preview tones and enlarge panel chevrons for iPad（2026-04-18）

## 已知 TODO

- Demo mode（隱藏 OSC 依賴，Vercel 展示用）
- 寶舖語彙映射到三個 sequence tab 的 sub-cards（規劃 / 設計 / 施工 / 竣工 / 維養）
- `feature/dna-port-v2` merge 回 `master`

## 關鍵決策

- **pill label**：目前顯示 `{ BAOPU }`，待決策 `{ BAOPU }` vs `{ VISTWIN }`（進入決策隊列）
- **裝置目標**：iPad 橫向為主，touch-first，OSC 控制是核心，外部資訊 ambient 呈現
- **Vercel**：先做 demo mode 再部署（不直接上）

## 連結

- GitHub：[metaarchetech/visustwin-webcontroller](https://github.com/metaarchetech/visustwin-webcontroller)
- Dev client：`https://localhost:5173`（`npm run dev` in client/）
- Dev bridge：`node bridge.js`（port 9000）

## 返回

- [[02 Products/Visustwin/README|Visustwin]]
