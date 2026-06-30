---
title: VisTwin Work 核心架構決策(蒸餾)
type: decision
app: work
created: 2026-07-01
updated: 2026-07-01
tags: [work, 決策, 架構, VisTwin Work]
---

# VisTwin Work 核心架構決策

> 從 2026-06-30~07-01 建置討論蒸餾。完整文件在 `D:\VisTwin\VisTwin Work\core\`。

## 命題
VisTwin Work 不是「網站優化工具」,是用架構治 agent 兩弱點:**①要催促 → n8n 強制迴圈(自主器官)**;**②記憶差 → vault 經驗庫(記憶器官)**。兩者咬合才成飛輪(有迴圈無記憶=瞎忙;有記憶無迴圈=不動)。VisTwin Work = harness,讓 agent 不必自己擅長驅動與記憶。

## 四支柱
Windows(基質)· n8n(編排,不放思考)· Claude(大腦:Designer/Critic + 檢索對話)· vault(記憶)。**邏輯只在 Daemon**;唯一對外網路=呼叫 Claude,其餘 localhost。

## Evaluation Contract(領域無關)
任何「可驗證來源」實作五函式 + 一條經驗:`propose / apply(隔離) / measure(分層) / gate(硬門檻) / rollback / toExperience`。鐵則:每輪只改一件事;**交付歷史最佳版**(非最後版);失敗也 emit 經驗;對抗 **Critic**(預設拒絕)防過度設計;分層評估 C→L→B→J 短路省成本;無人化=機器硬門檻取代人 gate,只有沒信心/動高風險才打擾人,永遠可回滾。

## rubric(measure 內容,visual-ux 領域)
從設計系統萃取 36 條,四層:**C 靜態**(綠≤5%/兩灰階/禁漸層/圓角≤2xl/標題無emoji…,已實作子集)· **L Lighthouse/a11y** · **B Chrome 互動** · **J Critic 否決**(第二強調色/為改而改/可用性退步/雙語鎖版)。新領域另開 `rubric/<domain>`。

## 導覽 IA
三架構分組保留(Agent 大腦 / n8n 迴圈 / Vault),葉子按「開發者做什麼」排、全 dev 原生。**MCP「工具」放 Agent 大腦下**(= agent 的手:搜尋/連 Revit·Rhino·n8n·vault·瀏覽器;連線端點在設定)。n8n 連線=設定,工作流本身=一級門(編排頁 iframe 內嵌 n8n 本尊)。

## 記憶規則
ExperienceRecord = **情境+決策+結果+判決**(缺一不可)。**依情境召回**且必須真的改變下一步動作。會遺忘(supersede/降權/蒸餾)。reference(規則,Critic 用)vs experience(試過什麼,Designer 用)。

## 自主派工 + fleet 監控
Console 雙模式:**問(唯讀)** / **派(spawn headless worker 真幹活)**,必須分開。**訂閱制 CLI 子行程繞 API 計費**,限制在速率/並發。**fleet 即時思考要用 TS Agent SDK**(`claude -p` 的 stream-json 不吐 tool_use/thinking)。守門紅線:agent 不可無監督改自己的 Daemon/gate/rubric/記憶隔離。

## MCP 框架(全 CLI/HTTP)
MCP = JSON-RPC over stdio/HTTP。VisTwin Work 自開一個 MCP server(TS SDK + HTTP)暴露 recall_experience/read_rubric/dispatch_run/list_agents/stream…;Console 與 worker 用 `--mcp-config` 帶工具(headless `claude -p` 預設 `--bare` 不繼承 `.mcp.json`)。`claude mcp serve` 可把 Claude 自己當 server。

## n8n 部署(修正)
**每個節點各自跑自己的 n8n(Docker),只透過 vault 整合** —— 對齊家族框架「每區都跑這套共用骨幹」(Manager 已在 Mac 跑自己的 n8n)。先前「一個共用 n8n」想法作廢。Work 這台自己一個 n8n Docker(待裝)。

## 現階段約束
先做框架+執行層(Daemon),**不改任何網站**;不過度設計(小核心+薄 adapter+記憶);≥2 個 adapter 前不寫平台層。
