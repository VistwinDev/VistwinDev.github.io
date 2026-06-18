---
created: 2026-04-29
tags: [project/visionbase, product/visionbase-monitor, sprint/2026-W18]
---

# visionbase-monitor

Visionbase 區網裝置監控網站。2026-04-29 進駐當日從 0 搭起,Phase 0 → Phase 1C 一路推到「真實掃描 + 分類過濾」。

## 基本資訊

| 項目 | 值 |
|---|---|
| Repo | [metaarchetech/visionbase-monitor](https://github.com/metaarchetech/visionbase-monitor) (private) |
| 本機路徑 | `C:\Visustwin\visionbase-monitor` |
| 開發 URL | `http://localhost:3000`(本機 `192.168.0.220:3000`) |
| 監控對象 | `192.168.0.0/24`(visionbase 學校網路) |

## 技術棧

| 層 | 選用 | 備註 |
|---|---|---|
| Framework | Next.js 16(App Router) | |
| 樣式 | Tailwind v4 | `@theme inline` + `--c-*` CSS variables |
| 前端 | React 19 + Framer Motion 12 | |
| Design System | 直接複用 `visustwin-showcase` | GlassCard / StatusPill / 字型(Space Grotesk + JetBrains Mono + Pixelify Sans + Chiron Hei HK) |
| 後端 | Next.js API route → PowerShell 掃描 | `app/api/scan` |
| 快取 | 結果 cache 60 秒 | 避免每次 request 都重新掃 |
| 前端輪詢 | 30 秒 | 配 60 秒 server cache 不會浪費 |

## 路由

| Path | 內容 |
|---|---|
| `/` | 自動 redirect 至 `/network` |
| `/network` | 區網裝置監控 — GlassCard 卡片網格 + HUD 統計列 + SegmentedToggle 過濾 |
| `/vision` | 攝影機 + YOLO 視覺分析(目前仍為 placeholder) |
| `/api/scan` | 真實掃描(Phase 1A 之後接 PowerShell) |

## 今日進度(2026-04-29)

| Phase | Commit | 內容 |
|---|---|---|
| Phase 0 | `3b29d01` | scaffold:Next.js 16 骨架 + 設計系統移植 + mock JSON |
| Phase 1A + 1B | `a289cd0` | 接 PowerShell 真實掃描 + 列出 34 台裝置 |
| Phase 1C | `da84276` | ownership / category 分類 + HUD 統計列 + SegmentedToggle 過濾 |

掃描資料來源:`C:\Visustwin\network-scan\scan.ps1` + `enrich.ps1` → `devices.json`,visionbase-monitor 自己的 cache 在 `.cache/scan.json`。

## 下一步候選

- **vision/YOLO 攝影機頁** — 接 RTSP(等取得 ACTi / Tapo 帳密)→ YOLOv8 物件偵測,串成 MJPEG。Python 端骨架在 `python-vision/`(FastAPI 已 hello world)
- **KUKA 監控頁** — 等 KRC 接上區網之後做,介面接 EKI / KUKAVARPROXY。介面骨架可先 mock。詳見 [[01 專案/visionbase/kuka-control-feasibility|kuka-control-feasibility]]
- **歷史趨勢** — 把每次 scan 落到 NAS 或 SQLite,做 device 上下線時序圖
- **視覺細節微調** — 卡片 hover 光暈 / SegmentedToggle 動畫節奏 / HUD 數字字體節奏

## 已知問題 / 待澄清

- ACTi 攝影機 11 台 RTSP 帳密未取得 → vision 頁卡住
- 部份裝置 vendor 僅靠 OUI 判定(Bambu Lab 是猜的),需現場確認
- 0.91 / 0.92 / 0.93 / 0.94 四台 Jantek Windows 用途不明 — 可能是 ACTi NVR 之類

## 返回

- [[01 專案/visionbase/README|Visionbase]]
- [[02 技術/VisTwin/sprints/2026-W18/2026-04-29|2026-04-29 daily log]]
