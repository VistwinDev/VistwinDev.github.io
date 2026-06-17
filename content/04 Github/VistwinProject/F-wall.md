---
title: F-wall
org: VistwinProject
repo: VistwinProject/F-wall
url: https://github.com/VistwinProject/F-wall
visibility: private
language: JavaScript
default_branch: main
zone: "F"
group: 寶鋪知行案
status: active
size_kb: 36
last_push: 2026-06-10
synced: 2026-06-18
tags: [github, repo-mirror, vistwinproject]
---

# F-wall

> 寶鋪知行案 F區的NFC互動web 牆面投影

- **Repo**：[VistwinProject/F-wall](https://github.com/VistwinProject/F-wall) · `private` · JavaScript · branch `main` · 36 KB
- **展區 / group**：F · 寶鋪知行案
- **狀態**：🟢 active
- **最近 push**：2026-06-10 · open issues 0

## 用途

F 區「AI 大腦控制塔」牆面投影。NFC 刷家電 → 牆面節點亮起、彗星沿電路板流向中央 AI 中樞。純 SVG 1920×1080，只收不送。port 5174。

## 最近 commits

| date | author | message |
|---|---|---|
| 2026-06-10 | VistwinProject | 新風機改回正常(青色)狀態並更新資訊；新增可攜版啟動腳本 |
| 2026-06-04 | frncs | feat(beams): glowing dash-sweep + neon line, align to desktop, nudge sound |
| 2026-06-01 | VistwinProject | Add README (專案說明、啟動、資料流、佈線規則) |
| 2026-06-01 | VistwinProject | Initial commit: F-zone wall projection (寶鋪 showcase AI 大腦控制塔) |

## README 摘錄

````md
# F-wall — 寶鋪 showcase F 區「AI 大腦控制塔」牆面投影

NFC 卡片放上桌面讀卡機 → 牆面對應的家電節點亮起，一道彗星沿電路板走線流向中央 AI 中樞。
此專案只負責**牆面投影畫面**，資料權威源在桌面端，牆面**只收不送**。

完整規格見 `寶鋪 showcase/zones/F-AI大腦控制塔.md` 與 `vibenfc/SYNC-SPEC.md`。

---

## 技術棧

- **Vite 5** + **React 18** + **framer-motion 11**
- 純 **SVG** 場景（viewBox 1920×1080，16:9 投影面）
- 開發 / 預覽固定 port **5174**（`strictPort`，投影機 kiosk 指向此 URL，被佔用直接報錯不 fallback）

## 啟動
````

## 關聯
- [[01 專案/寶鋪 showcase/zones/F-AI大腦控制塔]]
- [[04 Github/README|← 04 Github 索引]]

---
_由 `scripts/sync-github-repos.mjs` 於 2026-06-18 生成。重跑可刷新。_
