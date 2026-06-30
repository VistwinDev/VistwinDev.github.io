---
title: Work 區 — VisTwin Work 工作型超級 app(現況總結)
type: framework-zone
app: work
created: 2026-07-01
updated: 2026-07-01
tags: [system, 超級app, work, vistwin-work]
---

# Work 區 — VisTwin Work

> 工作型 · Windows · 這台機器。框架見 [[README|超級 App 總體架構]];累積見 [[_about|work 記憶]] · [[2026-07-01_vistwin-work-架構]]。
> 這份是 **Work 端現況快照**(會隨開發更新);專案碼 `D:\VisTwin\vistwin-work`。

## 身分

**VisTwin Work** = 工作 / 執行型節點的超級 app。跟 Manager 同一套共用骨幹(CLI + n8n + vault + cockpit + bridge)與治理,差別在角色:**它是把東西「做出來 / 跑起來 / 自我優化」的那台**。
核心命題:用架構治 agent 兩弱點 —— **要催促 → n8n 強制迴圈(自主器官)**;**記憶差 → vault 經驗庫(記憶器官)**。飛輪 = 迴圈驅動動作 → 記憶讓動作更聰明 → 動作再產出記憶 → 複利自主。

## 現況總覽(running / built)

- **cockpit** = Next.js 16 + Tailwind 4,**Tauri 包成原生 `.exe`**(`vistwin-work.exe`,5.7MB,桌面 icon = VisTwin Vist.;啟動器 `launch.ps1` 乾淨開啟防 ChunkLoadError)。載入本機 `:3939`。
- **bridge = 核心 Daemon** `:7042`(`engine/server.mjs`)跑著:`/dispatch /adopt /rollback /notify /status`。
- **對話** = 每頁浮動 ChatDock → `/api/chat` spawn `claude -p`(訂閱 CLI),開機注入準則+狀況,實測回真答案。
- **n8n**:本節點自己跑(Docker,**待裝**)。

## 元件

### cockpit(`VisTwin Work/ui`,Next.js + Tauri)
- **三架構側欄**(對齊家族三段式):**Agent 大腦**(對話 / 準則 / 提案 / 工具MCP)· **n8n 迴圈**(執行 / 編排 / 審查)· **Vault**(目標 / 經驗 / 焦點)+ 駕駛艙 + 觀測/設定。導覽按「開發者做什麼」排,n8n 連線=設定、工作流本身=一級門(編排頁 iframe 內嵌 n8n)。
- **浮動 ChatDock**(`components/ChatDock.tsx`):每頁都在的對話窗,送/收實測通過。
- 套 [[02 技術/Design-System/README|VisTwin Design System]](zinc + 單一 signal 綠 ≤5% · HUD mono · 無 emoji · .display/live-dot)。
- **Tauri 殼**(`ui/src-tauri`,Rust):`run()` 先 `ensure_server()`(起 `next start -p 3939`)再開原生窗;icon 從 Vist. 標誌生成;產物 `vistwin-work.exe` + NSIS。跨平台 Win+Linux 同一套(Mac 走 Swift)。

### bridge = Daemon(`engine/server.mjs`,Node 無依賴)
- HTTP `:7042`。實作 n8n 契約:`/dispatch`(跑一輪 = Tier C 自我檢核,回 `{score,gate,measure,diffRef}`)· `/adopt`(存 `_best`)· `/rollback` · `/notify` · `/status` · `/health`。
- Tier C 檢核抽成 `engine/lib/tierc.mjs`(純量測,Daemon+CLI 共用)。
- 紀錄暫寫本地 `engine/runs/`(待接 vault `記憶/work/`)。

### 引擎 = Claude CLI
- 對話 `/api/chat`:`claude -p --output-format json`,注入 `principles + status`(開機簡報),`CLAUDE_CODE_OAUTH_TOKEN`(訂閱)。
- 未來 worker / fleet 監控:用 **TS Agent SDK**(stream-json 不吐 tool/thinking,要 SDK 才有結構化即時事件)。

### rubric(評分準則 = loop 的 measure)
- 從設計系統萃取 **36 條** C/L/B/J 四層(C 靜態 16 條已實作子集 / L Lighthouse / B Chrome 互動 / J Critic 否決)。前層 hard-fail 短路。

### n8n(待裝)
- 本節點自己一個 Docker。模組 = sub-workflow,初始型 `web-optimize-loop`(建站 / 改站兩情境,`VisTwin Work/n8n/web-optimize-loop.template.json`),呼叫 Daemon 契約端點。

## 治理實作(對齊 [[原則]])

- 提案 → 採納 → 套用:`gate()` 硬門檻;交付歷史最佳版(非最後版);對抗 Critic 防過度設計。
- 風險分層 + 永遠可回滾(`/rollback`、git 快照)。守門紅線:agent 不可無監督改自己的 Daemon/gate/rubric/記憶隔離。
- 寫 vault:只動自己命名空間、不跑 git、小檔。

## 進行中 / 下一步

- **Daemon 加 propose→apply 層**:用 `claude -p` 真的提改動+套用(隔離 worktree)→ 完整自我優化迴圈(要指定白老鼠目標)。
- **執行 / 活動頁接 Daemon**:即時看 dispatch/分數/gate + fleet 監控(Agent SDK)。
- **裝本機 n8n(Docker)** → 連 Daemon,跑 `web-optimize-loop`。
- 記憶讀取路徑從舊區 `02 技術/E_forge-memory/` 切到 `記憶/work/`。
- VisTwin Work 自己的 GitHub repos(待建)。

## Repos
- **`VistwinDev/vistwin-work`**(private,2026-07-01 建)— 整個 Work 超級 app(core/ui/engine/n8n)。
- 勿與 Manager 的 `vistwin-app`/`vistwin-automation` 混。

## 踩過的雷(精選)

- **rebuild 時舊 `next start` 還跑著 → ChunkLoadError**(舊 HTML 抓不到新 chunk):啟動器改「每次乾淨重啟最新 build」。
- **Edge `--app` 工作列 icon 仍是 Edge** → 改 Tauri 原生殼才有自己的 icon。
- **headless `claude` 不繼承互動登入** → `claude setup-token` 產生訂閱 token、設 `CLAUDE_CODE_OAUTH_TOKEN`(用 `[Environment]::SetEnvironmentVariable` 避免 setx 截斷)。
- **harness/sandbox 環境** spawn 的 claude 拿不到憑證 → 真機驗證要在使用者 session 的 app 內。
- Tauri Win 編譯依賴衝突:`cookie` vs `time 0.3.52` → 釘 `time = 0.3.51`。

## Related
- [[README|超級 App 總體架構]] · [[Manager]] · [[Research]] · [[原則]] · [[_about|work 記憶]]
