---
title: B-TV
org: VistwinProject
repo: VistwinProject/B-TV
url: https://github.com/VistwinProject/B-TV
visibility: private
language: JavaScript
default_branch: main
zone: "B"
group: 寶鋪知行案
status: active
size_kb: 1371
last_push: 2026-06-10
synced: 2026-06-18
tags: [github, repo-mirror, vistwinproject]
---

# B-TV

> 寶鋪知行案 B區的NFC互動web 牆面電視

- **Repo**：[VistwinProject/B-TV](https://github.com/VistwinProject/B-TV) · `private` · JavaScript · branch `main` · 1371 KB
- **展區 / group**：B · 寶鋪知行案
- **狀態**：🟢 active
- **最近 push**：2026-06-10 · open issues 0

## 用途

B 區「感應光寓」客廳牆面電視主顯示。bento 動態資料牆 + three.js 自動旋轉 3D 房子（燈光隨情境變化）。port 5274 / WS 8788。

## 最近 commits

| date | author | message |
|---|---|---|
| 2026-06-10 | changchen0913 | 啟動腳本整併到 b-livingroom;b-tv 只留機位設定工具 bat |
| 2026-06-06 | changchen0913 | B 區房子套真實樣品屋 + 畫廊級渲染 + 效能與進場動畫 |
| 2026-06-03 | changchen0913 | 情境牆改為 3 欄垂直捲軸:一次動一欄、整欄一起往上捲(對齊 GIF 秩序與方向性) |
| 2026-06-03 | changchen0913 | 情境牆:數字只在進場 count-up 一次到定位 + 卡片輪替(GIF 換卡) |
| 2026-06-02 | changchen0913 | 新增一鍵啟動腳本 start.bat / stop.bat / start-nfc.bat + RUN.md |

## README 摘錄

````md
# B 區 感應光寓 · TV 主顯示 (b-tv)

寶舖大安段策展 B 區「感應光寓」客廳的 **TV 主顯示**(Web kiosk)。跑前言 / 房屋即時資訊 / 角色解方動畫 / 結語,依官方分鏡(`b區分鏡.pdf`)展演。

- 規格來源:`zones/B-感應光寓.md`(vision_base_vault)
- 同棧:桌面投影 [`VistwinProject/B-Table`](https://github.com/VistwinProject/B-Table)、NFC server(vibenfc `server.py`,埠口改 8788)
- 技術:Vite + React 18 + framer-motion 11 + **three.js**

## 視覺風格:兩段式

- **待機 / 前言 / 等卡 / 選角色 / 結語** — 深色 teal 極簡風(`src/components/*`、`src/style.css`)。
- **情境展演(房屋即時資訊 + 5 情境解方)** — **bento 動態資料牆**(參考客戶提供的 kinetic dashboard GIF):飽和平塗色塊 + 巨大 Helvetica 數字 + count-up + SVG 圖表描繪。程式在 `src/bento/`。
  - 牆裡右上那格是 **three.js 的 3D 房子**(`src/bento/HouseCanvas.jsx`)— **自動旋轉**,燈光**隨每個情境(persona)+ 當前解方維度即時變化**(`src/bento/houseLighting.js`)。
  - 房子模型:放 `public/house.glb` 自動接上;沒有檔案時用程序化 placeholder(見 `public/README.md`)。
  - 全專案**只有這一格用 three.js**,其餘 bento tiles / 數字 / 圖表都是 DOM + SVG(文字最銳利)。
````

## 關聯
- [[01 專案/寶鋪 showcase/zones/B-感應光寓]]
- [[04 Github/README|← 04 Github 索引]]

---
_由 `scripts/sync-github-repos.mjs` 於 2026-06-18 生成。重跑可刷新。_
