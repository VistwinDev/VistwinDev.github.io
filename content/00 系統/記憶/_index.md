---
title: VisTwin 記憶 · 核心索引
type: memory-core
app: shared
updated: 2026-06-30
tags: [system, memory, core]
---

# VisTwin 記憶 · 核心索引

> 常駐記憶:只放「現在為真」+ 指針。架構與 app 區分規則見 [[_policy]]。**框架正典見 [[README|超級 App]]。**

## 三個角色區(務必區分,2026-07-01 從平台分→角色分)

| 代號 | 角色 · 平台 | 是什麼 | GitHub repos |
|---|---|---|---|
| **manager** | 經理型 · macOS | VisTwin 駕駛艙(專案 · 核准 · 監控 · 對話) | `VistwinDev/vistwin-app` · `VistwinDev/vistwin-automation` |
| **work** | 工作型 · Windows | 工作/執行型超級 app(原 `dev-windows`) | (它自己的 repos,待補) |
| **research** | 研究型 · 待定 | 文獻 / 實驗 / 主線 A·B 研究 | (待補) |
| **shared** | 共用 | 跨三者的原則 / 設計 / 架構 | 本 vault |

> 為何角色不平台:每個節點都自帶 Claude CLI = 都能自我開發,平台不再是區分點。

## manager 當前狀態(2026-07-01)
- 原生 SwiftUI 殼(模組註冊表驅動側邊欄)+ n8n 模組頁 + host bridge;已裝 /Applications、ad-hoc 簽章。
- 可編輯專案儀表板(雙向寫回 `01 專案/_控管`);設計系統 `web/vistwin.css`;n8n 流程已分資料夾。
- 完整現況見 [[Manager|超級 App/Manager]];決策見 [[2026-06-30_駕駛艙建置]]。

## 下一步(manager)
- LINE outbound 通知 + 唯讀監控 agent(低風險先做)
- bridge 包成本機 MCP → Claude Desktop 用嘴控
- 自我開發(先建護欄:分支 + 驗證 + watchdog rollback)

## 共用治理原則(濃縮,詳見 [[共用/原則]])
- 人 = 導演 · agent = 手 · vault(.md/git)= 真相 · app = 控制 + 審閱
