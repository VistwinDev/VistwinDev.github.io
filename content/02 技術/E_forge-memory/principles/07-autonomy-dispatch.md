---
type: principle
name: autonomy-dispatch
updated: 2026-06-30
---

# 自主器官:對話派工 + 多 agent 監控

「對話 Console」= 浮動 ChatDock(每頁都在,設計系統 §9 pill),雙模式:
- **問(ask)**:唯讀檢索,讀 vault/run/經驗回答,不動檔案。
- **派(dispatch)**:Daemon 起 headless worker(各自獨立 git worktree)真的幹活,事件即時回 UI fleet 監控。

關鍵事實(2026-07-01 查證 Claude Code 官方):
- **訂閱制 CLI 子行程繞開 API per-token 計費**;真正限制只在**速率/並發**,不是錢。
- **fleet 監控要用 TS Agent SDK,不是 `claude -p --output-format stream-json`**:
  stream-json **只吐文字 token + 系統事件,不吐 tool_use/tool_result,也不吐 thinking**。
  要「看每個 agent 即時思考 + 正在調什麼工具」→ 用 `@anthropic-ai/claude-agent-sdk`
  (結構化 message stream,正好對上 Node Daemon);備援讀 `.claude/sessions/` JSONL。
- headless `claude -p` 預設 `--bare`,**不繼承專案 `.mcp.json`**,要 `--mcp-config <file/json>`
  明確帶工具集(可複現)。配 `--allowedTools` / `--permission-mode acceptEdits`。
- 並發**沒有內建編排**,要自己管子行程池 + `--resume <id>` / `--continue`。
- **守門紅線**:agent **不可無監督改自己的 Daemon / gate / rubric / 本記憶區隔離規則**——
  不能讓它拆自己的煞車。改這些 = 高風險區,強制人工 gate。

問與派必須明確分開,否則問一句就跑去改 code。見 [[09-mcp]]。
