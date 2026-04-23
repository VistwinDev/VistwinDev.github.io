---
tags: [moc, ontology, visustwin, knowledge-graph]
created: 2026-04-17
updated: 2026-04-17
---

# 🧭 Ontology MOC

> VisusTwin 數位孿生平台的 **語意骨架** 知識庫。
> 目標:讓跨項目 (ArchVizExplorer / WebController / kit-app-template / welltek-twin) 的「房間」「設備」「樣品屋特色」指向**同一個東西**,而不是各自為政。

---

## 🎯 閱讀順序

這套筆記從「產業全景」走到「VisusTwin 具體決策」,建議第一次讀按順序看完。熟了以後可以當工具書,挑需要的章節跳讀。

1. [[00 產業現況 與 生態圖譜]] — 誰用 IFC / Brick / DTDL,為什麼,適不適合我們
2. [[01 T-Box vs A-Box]] — 描述邏輯兩個基本層,和為什麼工業界 95% 只做 T-Box
3. [[02 Identity 與 URN 設計]] — 三套 ID 併存的痛,URN 格式怎麼定
4. [[03 對齊既有標準]] — BOT / Brick / SOSA / IFC / ifcOWL / DTDL / SAREF 細節
5. [[04 Canonical Format 選型]] — LinkML / Pydantic / JSON Schema / OWL,為什麼 VisusTwin 選 Pydantic
6. [[05 VisusTwin T-Box v1 類別清單]] — 最終落地的類別階層與欄位
7. [[06 USD customData 約定]] — Ontology 如何在 Omniverse 場景裡存活
8. [[07 Semantor 的 Ontology 角色]] — 對接 [[Semantor 設計概念]]:誰負責什麼

---

## 🔑 一頁總結 (TL;DR)

如果懶得讀,記住這五條決策就夠用:

| # | 決策 | 理由 |
|---|---|---|
| 1 | Canonical = **Pydantic** | 團隊 Python-heavy,JSON Schema 一行匯出 |
| 2 | 標準對齊用 **結構借鏡**,不繼承 | 保留橋梁不綁外部生存 |
| 3 | **URN** 做核心 `urn:visustwin:{site}:{building}:{unit}:{room}:{type}:{id}` | 跨 USD / MQTT / SQL 統一身份 |
| 4 | **T-Box Only**,不做 A-Box triple store | 95% 工業界這樣做 |
| 5 | USD 先用 **customData dict**,不做 IsA schema | 降成本,穩定後再升級 |

---

## 🛠 進入實作 (階段 2)

知識筆記穩定後,實作落地在 `D:\Visustwin\ontology\`(尚未建立),結構參見 [[05 VisusTwin T-Box v1 類別清單]] 最後一節。

---

## 📝 相關連結

- [[Semantor 設計概念]] — VisusTwin 自創詞「語意操作節點」,Ontology 是它的底層字典
- [[VisusTwin]] — 平台總覽
- [[Omniverse]] — USD / Kit 框架
- [[Omniverse x Revit 2026]] — 建築資料來源 (涉及 IFC)
- [[Foundation Model Distillation Ontology Mapping]] — 與 LLM / 知識圖譜關聯的短筆記

---

*本 MOC 初版 2026-04-17,隨後續討論持續更新。*
