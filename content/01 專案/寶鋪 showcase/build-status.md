---
title: 寶鋪 showcase · 實作進度（repo × 展區）
created: 2026-06-18
updated: 2026-06-18
tags: [OTA120, baopu, build-status, github, nfc]
related:
  - "[[01 專案/寶鋪 showcase/README]]"
  - "[[00 系統/Entity_Map]]"
---

# 寶鋪 showcase · 實作進度

> 各展區的**程式碼實作**現況。規格/分鏡見各 zone 筆記；本檔只追「repo 蓋到哪、剩什麼」。
> repo 鏡像（metadata + commits + README）見 vault 內 `04 Github/`（🔒 不公開）。
> 來源：VistwinProject org（客戶/商務，全私有），2026-06-18 盤點。

## ⚠️ 架構演進：monorepo → 拆分 repo

舊規格（zone 筆記，2026-05-30 寫）假設 B、F 區共用**單一 monorepo** `B-F-NFC`，以 route（`/f/table`、`/f/wall`、`/f/ipad`）分頁。**實際已改為一展面一 repo**：

| 舊（規格假設） | 新（實際 repo） |
|---|---|
| `B-F-NFC` 內 `/b/*` route | `B-TV`、`B-Table` 兩個獨立 repo |
| `B-F-NFC` 內 `/f/*` route | `F-wall`、`F-table`、`F-Ipad` 三個獨立 repo |
| — | 舊 `B-F-NFC` → 已改名 [BF-NFC-abandoned](https://github.com/VistwinProject/BF-NFC-abandoned)（⚪ 廢案，考古用） |

> 📌 **待校正**：[[01 專案/寶鋪 showcase/zones/F-AI大腦控制塔]]、[[01 專案/寶鋪 showcase/zones/B-感應光寓]] 內所有 `VistwinProject/B-F-NFC` 連結都指向已廢 repo，未重寫（避免一次動太多）。要校正再說。

## 展區 × 展面 × repo

| 區 | 展面 | repo | 技術 | commits | 最近 push | 狀態 |
|---|---|---|---|---|---|---|
| **A** 數據之門 | 視覺辨識 | [A-Touchdesigner](https://github.com/VistwinProject/A-Touchdesigner) | TouchDesigner + YOLO · Python | 4 | 06-10 | 🟢 雙 pipeline 完成 |
| **B** 感應光寓 | 牆面電視 | [B-TV](https://github.com/VistwinProject/B-TV) | React + three.js | 6 | 06-10 | 🟢 完成度高 |
| **B** 感應光寓 | 桌面投影 | [B-Table](https://github.com/VistwinProject/B-Table) | React + NFC | 6 | 06-10 | 🟢 完成 |
| **F** AI 大腦控制塔 | 牆面投影 | [F-wall](https://github.com/VistwinProject/F-wall) | React · 純 SVG | 4 | 06-10 | 🟢 完成 |
| **F** AI 大腦控制塔 | 桌面投影（主控） | [F-table](https://github.com/VistwinProject/F-table) | React · Node nfc-pcsc | 6 | 06-10 | 🟢 完成 |
| **F** AI 大腦控制塔 | 平板 | [F-Ipad](https://github.com/VistwinProject/F-Ipad) | React · WS | 4 | 06-04 | 🟡 稍早，應穩定 |
| **G** 逃出危機 | 觸控大電視 | [G-Escape-from-Crisis](https://github.com/VistwinProject/G-Escape-from-Crisis) | TypeScript · 純前端 | 2 | 06-01 | 🟡 程式完成，等內容 |
| ~~B/F~~ | ~~舊 monorepo~~ | [BF-NFC-abandoned](https://github.com/VistwinProject/BF-NFC-abandoned) | JS | 1 | 05-27 | ⚪ 廢案 |

開發者：**changchen0913**（A / B-TV / F-Ipad）+ **frncs**（B-Table / F-table / F-wall）。

## 各區現況

- **A 數據之門** — RealSense → 人數/年齡/性別/身高 → TD 視覺。repo 提供兩條 pipeline（純 TD onnx / Python+OSC），擇一跑。骨架完整。
- **B 感應光寓** — 牆面電視（bento 資料牆 + three.js 3D 房子，燈光隨情境）+ 桌面投影（NFC 置卡引導 5 角色）。兩端共用 NFC server（8788）。完成度高。
- **F AI 大腦控制塔** — 三端同步（桌投主控 5173 / 牆投 5174 / 平板 5175，共用 WS 8787 + ACR122U）。有 `SYNC-SPEC.md` 同步協定。最完整的多端系統。
- **G 逃出危機** — 七關 QTE + 影片 1:1 同步引擎 + 對位工具完成。**唯一明確列待辦的**（見下）。

## 跨區待辦

主要缺口集中在 **G 區內容** 與 **全區現場驗收**：

- ⏳ **G 正式影片 + 配樂**（現用測試片 + 合成暫代音樂；repo 內附對位工具 `?align`，正式影片到位三步補上）
- ⏳ **G 字幕 / 圈下小字文案**、每關動作「意義」定義
- ⏳ **G 法規用字**：官方文案「AI 運算最佳安全路徑」與消防法規（只能標火警位置、不能建議路徑）有張力，對外用字待定
- ⏳ **全區真機驗收**：觸控手感、本機影片、投影對齊、NFC reader 嵌桌方式
- ⏳ **F 區未決點**（見 [[01 專案/寶鋪 showcase/zones/F-AI大腦控制塔]] 末段）：iPad 知識圖譜規格、Welltek API 是否供料、預測性維護 mock vs 真實

## 工程紀律觀察

全 repo 都有 README + **一鍵啟動腳本**（`啟動.bat`/`start.bat`）+ **嚴格埠口分配**（B 占 5273-5274/8788、F 占 5173-5175/8787，`strictPort` 被占即報錯）→ 已在為「同展場同網域多機」做現場整合防呆。屬**收尾／等內容**階段，非開發早期。

## Related

- [[01 專案/寶鋪 showcase/README|寶舖 showcase MOC]]
- repo 鏡像：vault 內 `04 Github/`（🔒 不公開）
- zones：[[01 專案/寶鋪 showcase/zones/A-數據之門|A]] · [[01 專案/寶鋪 showcase/zones/B-感應光寓|B]] · [[01 專案/寶鋪 showcase/zones/F-AI大腦控制塔|F]]（G 待補 zone 筆記）
