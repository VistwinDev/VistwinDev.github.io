---
title: Work 超級 app(工作型 · VisTwin Work)· 命名空間入口
type: memory-core
app: work
updated: 2026-07-01
tags: [system, memory, work]
---

# work · 工作型超級 app(VisTwin Work)

> Windows 上的「工作 / 執行型」超級 app,專案碼 `D:\VisTwin\vistwin-work`。
> 框架定位見 [[Work|超級 App/Work]]。此資料夾是它的記憶命名空間(現在為真 + 指針)。

## 現在為真(2026-07-01)
- **VisTwin Work** = Work 節點的超級 app。命題:用架構治 agent 兩弱點(**要催促 → n8n 強制迴圈**;**記憶差 → vault 經驗庫**)。
- **已跑**:
  - **bridge = 核心 Daemon** `localhost:7042`(`server.mjs`,Node 無依賴):`/dispatch /adopt /rollback /notify /status`;`/dispatch` = rubric **Tier C 自我檢核**。
  - **cockpit** = Next.js 16 + Tailwind 4,**Tauri 包成原生 `.exe`**(桌面 icon = VisTwin Vist.);三架構側欄 + **每頁浮動對話 ChatDock**。
  - **對話** = `claude -p`(訂閱 CLI,`CLAUDE_CODE_OAUTH_TOKEN` 已設;實測會用注入的準則+狀況回真答案)。
  - **rubric** = 從 [[02 技術/Design-System/README|Design System]] 萃取 36 條(C/L/B/J 四層)。
- **n8n**:本節點**自己跑一個**(Docker,待裝),與 Manager 各自獨立、只共享 vault。(修正先前「共用一個 n8n」→ 改為框架的「每區各自跑」。)
- **記憶**:本 work 命名空間(此處);舊區 `02 技術/E_forge-memory/` 待退役、內容已蒸餾搬入。

## 指針
- 架構決策 → [[2026-07-01_vistwin-work-架構]]
- 本次建置情節 → [[2026-07-01_vistwin-work-建置]]
- 框架 → [[Work]] · [[README|超級 App]] · [[原則]]

## 寫入規則(衝突預防)
- 只放 `work/決策|情節/`,frontmatter `app: work`。**不寫 `manager/`**;跨節點原則才放 `共用/`。
- **agent 不在 vault 跑 git**(Obsidian Git 自動 commit);多檔小批。
- VisTwin Work 用自己的 repos(待補),勿與 Manager 的 `vistwin-app`/`vistwin-automation` 混。
