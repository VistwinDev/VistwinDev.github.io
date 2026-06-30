---
type: principle
name: autonomy-dispatch
updated: 2026-06-30
---

# 自主器官:對話派工 + 多 agent 監控

「對話 Console」雙模式:
- **問(ask)**:唯讀檢索,讀 vault/run/經驗回答,不動檔案。
- **派(dispatch)**:Daemon 起 headless **Claude Code 子行程**(`claude -p ... --output-format stream-json`)真的幹活,各自獨立 git worktree,stream 即時回 UI「執行/活動」做 fleet view 監控。

關鍵事實:
- **訂閱制 CLI 子行程繞開 API per-token 計費**;真正限制只在**速率/並發**,不是錢。
- **守門紅線**:agent **不可無監督改自己的 Daemon / gate / rubric / 本記憶區的隔離規則**——不能讓它拆自己的煞車。改這些 = 高風險區,強制人工 gate。
- Claude Code 本身已有多 agent + 監控原語(Agent/背景任務/任務板/Monitor),E_forge 用自己 UI 包它,不重造。

問與派必須明確分開,否則問一句就跑去改 code。
