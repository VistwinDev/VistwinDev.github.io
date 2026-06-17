---
title: B-Table
org: VistwinProject
repo: VistwinProject/B-Table
url: https://github.com/VistwinProject/B-Table
visibility: private
language: JavaScript
default_branch: main
zone: "B"
group: 寶鋪知行案
status: active
size_kb: 52
last_push: 2026-06-10
synced: 2026-06-18
tags: [github, repo-mirror, vistwinproject]
---

# B-Table

> 寶鋪知行案 B區的NFC互動web 桌面投影

- **Repo**：[VistwinProject/B-Table](https://github.com/VistwinProject/B-Table) · `private` · JavaScript · branch `main` · 52 KB
- **展區 / group**：B · 寶鋪知行案
- **狀態**：🟢 active
- **最近 push**：2026-06-10 · open issues 0

## 用途

B 區「感應光寓」桌面短焦投影。NFC 置卡引導（邀請卡→角色鑰匙圈→情境），5 角色情境。與 B-TV 共用 NFC server。

## 最近 commits

| date | author | message |
|---|---|---|
| 2026-06-10 | frncs | 一鍵啟動 啟動.bat(桌面 + 電視 + 共用 NFC server) |
| 2026-06-06 | frncs | 桌面投影改左右分割版面 + 角色痛點 + 真實 UID |
| 2026-06-02 | frncs | 加一鍵啟動 start.bat / stop.bat |
| 2026-06-02 | frncs | 加 B 區 NFC server (8788) + 鍵盤模擬改走 WS 中繼 + 記錄真實 UID |
| 2026-06-02 | frncs | 固定 B 區埠口避免與 F 區衝突 |

## README 摘錄

````md
# B-Table · 感應光寓 桌面感應投影

> 2026 寶鋪大安段策展 — **展區 B「感應光寓」** 的桌面短焦投影 App。

桌面往下投的 **NFC 放置提示介面**:引導訪客把「邀請卡 / 角色鑰匙圈」放到桌上的感應區,並在刷卡成功時給回饋。整個客廳的光 / 空氣 / 溫濕度 / 聲音情境切換與場景視覺由**牆上電視機(另一個 App)**呈現 — 本 repo 只負責桌面投影。

---

## 體驗流程

單一感應區,訪客依序刷卡,畫面在三個狀態間切換:

| 狀態 | 畫面 | 觸發 |
|---|---|---|
| **置卡 `place-card`** | 「把邀請卡放在這裡」+ 脈動感應環(待機吸引狀態) | 預設 / `reset` |
| **選角色 `place-character`** | 「放上角色鑰匙圈」 | 刷到邀請卡後 |
````

## 關聯
- [[01 專案/寶鋪 showcase/zones/B-感應光寓]]
- [[04 Github/README|← 04 Github 索引]]

---
_由 `scripts/sync-github-repos.mjs` 於 2026-06-18 生成。重跑可刷新。_
