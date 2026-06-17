---
title: BF-NFC-abandoned
org: VistwinProject
repo: VistwinProject/BF-NFC-abandoned
url: https://github.com/VistwinProject/BF-NFC-abandoned
visibility: private
language: JavaScript
default_branch: main
zone: "B/F"
group: 寶鋪知行案
status: abandoned
size_kb: 50630
last_push: 2026-05-27
synced: 2026-06-18
tags: [github, repo-mirror, vistwinproject]
---

# BF-NFC-abandoned

> (廢案)寶鋪知行案 B區、F區的NFC互動web 

- **Repo**：[VistwinProject/BF-NFC-abandoned](https://github.com/VistwinProject/BF-NFC-abandoned) · `private` · JavaScript · branch `main` · 50630 KB
- **展區 / group**：B/F · 寶鋪知行案
- **狀態**：⚪ 廢案
- **最近 push**：2026-05-27 · open issues 0

## 用途

⚪ 廢案。B/F 區早期 NFC 互動 web 單一 monorepo（即舊規格裡的 B-F-NFC）。已拆成 B-TV / B-Table / F-wall / F-table / F-Ipad 獨立 repo 取代。保留供考古。

## 最近 commits

| date | author | message |
|---|---|---|
| 2026-05-27 | frncs | feat: initial commit — NFC web control UI |

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
- [[01 專案/寶鋪 showcase/build-status]]
- [[04 Github/README|← 04 Github 索引]]

---
_由 `scripts/sync-github-repos.mjs` 於 2026-06-18 生成。重跑可刷新。_
