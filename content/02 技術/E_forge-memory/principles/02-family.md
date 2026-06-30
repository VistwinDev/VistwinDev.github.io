---
type: principle
name: family
updated: 2026-06-30
---

# 兩版超級 App 家族

同一個三段式外殼(Agent 大腦 / n8n 迴圈 / Vault 資料·記憶)的兩端:

- **manager 型 · Mac**(`vault_pm` / vistwin-pm)— PM / 工作日誌核心,另有自己從對話+vault 累積的記憶庫。
- **dev 型 · Win**(`E_forge`)— build-loop 核心,本記憶區屬於它。

共用地基原則:**MD = 唯一真相、opt-in frontmatter、非破壞性 yaml-AST 寫回、可攜 config + .env、Git = 歷史**。
唯一結構差異:manager 主要「讀寫 vault」;dev 額外多一個會跑 build-loop 的 **Daemon**。
外殼、寫回引擎、設計系統、git-as-history 全共用。
