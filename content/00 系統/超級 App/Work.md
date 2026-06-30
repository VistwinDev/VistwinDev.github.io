---
title: Work 區 — 工作型超級 app(待 Work 端填)
type: framework-zone
app: work
created: 2026-07-01
updated: 2026-07-01
tags: [system, 超級app, work]
---

# Work 區 — 工作型超級 app

> 工作型 · Windows · 另一台機器。框架見 [[README|超級 App 總體架構]];記憶命名空間 `記憶/work/`。
> 這份由 **Work 端(Windows)那邊的 agent 來填**;Manager 不替它寫內容,只先把框架位置開好。

## 角色

**工作 / 執行型**節點 —— 開發、跑工具、執行實作。跟 Manager 共用同一套骨幹(CLI + n8n + vault + cockpit)與治理,差別在**角色與它要做的工作**。

## 改名理由(`dev` → `Work`)

原本叫 `dev-windows`(開發型)。但**每個節點都自帶 Claude CLI = 都能自我開發**,所以「dev」不再是區分點。正名成 **Work**:它是「做工 / 執行」的節點,而不是「唯一會寫程式的那台」。

## 與框架的接點

- **共用**:vault(真相)+ [[原則|治理原則]] + 共用骨幹。
- **只寫自己區**:`記憶/work/`(決策 / 情節)+ 本檔 `超級 App/Work.md`;`frontmatter app: work`;不碰 `manager/`。
- **上線步驟**:見 [[README#同步模型(Work / Research 如何接進來)|README 同步模型]]。

## 待補(由 Work 端填)

- 它具體是什麼 app · 平台 / 技術棧細節
- 它自己的 GitHub repos
- 與 Manager 的接點:共用同一個 bridge?各自獨立、只共享 vault + 原則?
- 它跑哪些 n8n 流程 / 模組

## Related
- [[README|超級 App 總體架構]] · [[Manager]] · [[Research]]
