---
title: 04 Github — repo 鏡像索引
created: 2026-06-18
last_updated: 2026-06-18
tags: [moc, github, repo-mirror, private]
---

# 04 Github — VisTwin org repo 鏡像

> 兩個 GitHub org 的 repo 在 vault 內的鏡像。由 `scripts/sync-github-repos.mjs` 生成，重跑刷新。
> 🔒 含私有客戶 repo，**不發佈公開站**（sync-to-quartz.yml 已 `--exclude`）。
> org 邊界定義見 [[00 系統/Entity_Map]]。舊 `metaarchetech` user 帳號 repo 見 [[00 系統/GitHub Overview]]（legacy）。

- **VistwinProject** — 客戶/商務 org（寶鋪知行案交付，全私有）
- **VistwinDev** — 工程 org（vault + 對外站）

## 全 repo（依 push 時間）

| Org | Repo | 區 | Vis | Lang | 狀態 | 最近 push |
|---|---|---|---|---|---|---|
| VistwinProject | [[04 Github/VistwinProject/A-Touchdesigner\|A-Touchdesigner]] | A | private | Python | 🟢 active | 2026-06-10 |
| VistwinProject | [[04 Github/VistwinProject/B-TV\|B-TV]] | B | private | JavaScript | 🟢 active | 2026-06-10 |
| VistwinProject | [[04 Github/VistwinProject/B-Table\|B-Table]] | B | private | JavaScript | 🟢 active | 2026-06-10 |
| VistwinProject | [[04 Github/VistwinProject/F-wall\|F-wall]] | F | private | JavaScript | 🟢 active | 2026-06-10 |
| VistwinProject | [[04 Github/VistwinProject/F-table\|F-table]] | F | private | JavaScript | 🟢 active | 2026-06-10 |
| VistwinProject | [[04 Github/VistwinProject/F-Ipad\|F-Ipad]] | F | private | JavaScript | 🟢 active | 2026-06-04 |
| VistwinProject | [[04 Github/VistwinProject/G-Escape-from-Crisis\|G-Escape-from-Crisis]] | G | private | TypeScript | 🟢 active | 2026-06-01 |
| VistwinProject | [[04 Github/VistwinProject/BF-NFC-abandoned\|BF-NFC-abandoned]] | B/F | private | JavaScript | ⚪ 廢案 | 2026-05-27 |
| VistwinDev | [[04 Github/VistwinDev/vistwin-vault\|vistwin-vault]] | — | private | JavaScript | 🟢 active | 2026-06-17 |
| VistwinDev | [[04 Github/VistwinDev/VistwinDev.github.io\|VistwinDev.github.io]] | — | public | TypeScript | 🟢 active | 2026-06-17 |

共 10 repo · 同步於 2026-06-18。

## 關聯

- [[01 專案/寶鋪 showcase/build-status]] — 寶鋪各區實作進度（zone → repo 對照）
- [[00 系統/Entity_Map]] — org 邊界正典
- [[00 系統/GitHub Overview]] — legacy metaarchetech user 帳號 repo
