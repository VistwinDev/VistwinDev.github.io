---
tags: [moc, home]
created: 2026-04-11
updated: 2026-04-19
---

# 🏠 MetaArche Vault Home

> Product-centric 工作 vault。以產品與客戶專案為主軸，知識與歷史資料分層支援。

## 🎯 當前焦點

- [[Now]] — 本週焦點、waiting/blocked、近期要啟動

## 🚀 Products（自家產品）

- [[02 Products/Visustwin/README|Visustwin]] — Omniverse 外掛、BIM/ESG 工具鏈、Web 化
- [[02 Products/Design-System/README|Design System]] — DNA 設計系統
- [[02 Products/Metaarchetech-site/README|Metaarchetech Site]]

## 📌 Projects（客戶向專案）

- [[01 Projects/寶鋪 showcase/README|寶鋪 showcase]]
- [[01 Projects/寶鋪 showcase/welltek/README|welltek]]

## 📚 Knowledge（常態知識）

- [[04 Knowledge/Lived/README|Knowledge / Lived]] — Ontology、Gaussian Splatting、Omniverse、XR、AI frameworks

## 🗄 Legacy（時點歸檔）

- [[99 Archive/2025/README|Legacy / 2025]] — 2025 年度以前的專案、資源、archive

## 🧩 Claude Skills

- [[05 Claude Skills/_index|Claude Skills Index]] — skill 系統索引（每個 skill 一資料夾，內含 SKILL.md）
- [[05 Claude Skills/working-with-frncs/SKILL|working-with-frncs]] — 跟 Frncs 共事的核心行為準則
- [[05 Claude Skills/dev-state-overview/SKILL|dev-state-overview]] — 跨機開發狀態總覽（GitHub / git / ports / 車隊）
- [[05 Claude Skills/vault-publish-pipeline/SKILL|vault-publish-pipeline]] — vault → GitHub → Quartz → Pages 全鏈狀態與斷點診斷
- [[05 Claude Skills/research-orchestrator/SKILL|research-orchestrator]] — lead-agent + subagent 平行研究編排
- [[05 Claude Skills/pr-review-expert/SKILL|pr-review-expert]] — PR/MR 結構化 code review
- [[05 Claude Skills/spec-driven-workflow/SKILL|spec-driven-workflow]] — spec-first 開發流程
- [[05 Claude Skills/rag-architect/SKILL|rag-architect]] — RAG pipeline 設計與優化

## 🖥 Machines

- [[06 Machines/_fleet-index|Fleet Index]] — 車隊內所有機器（家機 / lab / 學校），heartbeat 每天更新

## 📐 結構說明

```
00 Meta/       vault 本身的設定、首頁、工作流程
Now.md         當前焦點（本週／近期）
Products/      自家產品（長期維護）
Projects/      客戶向專案
Knowledge/     常態可重用知識（Lived = 活躍使用中）
Legacy/        時點歸檔（YYYY/ 下分 knowledge/resources/archive）
Images/        圖片附件
Inbox/         暫存待整理
```

本 vault 採 **product-centric** 組織（非 PARA）：
長期維護的產品（Products/）與當期專案（Projects/）是第一層骨架；
知識依「還在活躍使用」(Lived) 或「已時點化」(Legacy/YYYY/) 分層。

## ✏️ 命名規則

- 檔名：中英文之間用空格，避免底線與全形標點
- 狀態：用 tag → `#todo` `#doing` `#done` `#blocked`
- 日期：ISO 格式 `YYYY-MM-DD`
- 主題資料夾用 `README.md` 作為索引（取代舊的 `XXX MOC.md`）
