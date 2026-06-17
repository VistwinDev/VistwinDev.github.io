---
title: F-table
org: VistwinProject
repo: VistwinProject/F-table
url: https://github.com/VistwinProject/F-table
visibility: private
language: JavaScript
default_branch: main
zone: "F"
group: 寶鋪知行案
status: active
size_kb: 50676
last_push: 2026-06-10
synced: 2026-06-18
tags: [github, repo-mirror, vistwinproject]
---

# F-table

> 寶鋪知行案 F區的NFC互動web 桌面投影

- **Repo**：[VistwinProject/F-table](https://github.com/VistwinProject/F-table) · `private` · JavaScript · branch `main` · 50676 KB
- **展區 / group**：F · 寶鋪知行案
- **狀態**：🟢 active
- **最近 push**：2026-06-10 · open issues 0

## 用途

F 區桌面投影主視覺，NFC 主控端（ACR122U → Node nfc-pcsc → WS 8787）。register 6 F-zone 家電卡 + 資訊面板輪替。port 5173。

## 最近 commits

| date | author | message |
|---|---|---|
| 2026-06-10 | frncs | feat(infopanel): rotate active appliances + slide transition, slower pacing |
| 2026-06-04 | frncs | feat(beams): legible info panel, simplified connected state, tuned sweep |
| 2026-06-04 | frncs | feat: register 6 F-zone cards, fix cardinal-beam bloom, full appliance data, lar |
| 2026-06-02 | frncs | chore: add one-click launcher scripts (setup / start / stop) |
| 2026-06-01 | frncs | feat: full F-table desktop showcase build |

## README 摘錄

````md
# NFC Web Control

展場互動系統：ACR122U → Node.js WebSocket → React 前端

---

## 架構

```
ACR122U (USB NFC Reader)
  └─ Windows PC/SC Driver
       └─ server/index.js  (Node.js + nfc-pcsc)
            └─ WebSocket ws://localhost:8787
                 └─ web/  (Vite + React)
                      └─ 投影 / 螢幕顯示
```
````

## 關聯
- [[01 專案/寶鋪 showcase/zones/F-AI大腦控制塔]]
- [[04 Github/README|← 04 Github 索引]]

---
_由 `scripts/sync-github-repos.mjs` 於 2026-06-18 生成。重跑可刷新。_
