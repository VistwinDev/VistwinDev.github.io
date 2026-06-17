---
title: F-Ipad
org: VistwinProject
repo: VistwinProject/F-Ipad
url: https://github.com/VistwinProject/F-Ipad
visibility: private
language: JavaScript
default_branch: main
zone: "F"
group: 寶鋪知行案
status: active
size_kb: 37
last_push: 2026-06-04
synced: 2026-06-18
tags: [github, repo-mirror, vistwinproject]
---

# F-Ipad

> 寶鋪知行案 F區的NFC互動web 觸控平板

- **Repo**：[VistwinProject/F-Ipad](https://github.com/VistwinProject/F-Ipad) · `private` · JavaScript · branch `main` · 37 KB
- **展區 / group**：F · 寶鋪知行案
- **狀態**：🟢 active
- **最近 push**：2026-06-04 · open issues 0

## 用途

F 區平板互動端（iPad Safari web，非原生）。觀眾放家電 → 知識圖譜逐一亮起串接到中央 AI 大腦，全串完播完成動畫。port 5175，三端共用 WS 8787。

## 最近 commits

| date | author | message |
|---|---|---|
| 2026-06-04 | frncs | feat(beams): align flow cadence to SYNC-SPEC §8 (2.2s) |
| 2026-06-02 | changchen0913 | 新增 啟動.bat：雙擊一鍵安裝套件、啟動伺服器、開啟瀏覽器 |
| 2026-06-01 | changchen0913 | 新增 README:架構、啟動、session 同步協定與專案結構 |
| 2026-06-01 | changchen0913 | F 區平板「AI 大腦控制塔」首版:NFC 知識圖譜 + 歡迎頁 + session 同步 |

## README 摘錄

````md
# F-Ipad — AI 大腦控制塔(平板端)

寶鋪數位孿生展示 **F 區** 的平板互動介面。觀眾將實體家電裝置放上 NFC 感應區,平板上的知識圖譜便逐一亮起、連結到中央「AI 大腦」,全部串上後播放全屋串聯的完成動畫。

此 app 是 F 區三端同步顯示的其中一端,三端共用同一台 Python WebSocket server:

| 端       | Port | 角色                       |
| -------- | ---- | -------------------------- |
| 桌面投影 | 5173 | 主視覺投影                 |
| 牆面投影 | 5174 | 牆面場景                   |
| **平板** | 5175 | **本專案** — 觀眾互動 / 操作 |
| WS server | 8787 | 接 NFC reader 的那台 PC    |

> 這是一個跑在 iPad Safari 上的網頁,不是原生 App。

## 技術棧
````

## 關聯
- [[01 專案/寶鋪 showcase/zones/F-AI大腦控制塔]]
- [[04 Github/README|← 04 Github 索引]]

---
_由 `scripts/sync-github-repos.mjs` 於 2026-06-18 生成。重跑可刷新。_
