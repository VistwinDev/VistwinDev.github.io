---
title: Manager 區 — VisTwin 駕駛艙(現況總結)
type: framework-zone
app: manager
created: 2026-07-01
updated: 2026-07-01
tags: [system, 超級app, manager, 駕駛艙]
---

# Manager 區 — VisTwin 駕駛艙

> 經理型 · macOS · 這台機器。框架見 [[README|超級 App 總體架構]];累積決策見 [[2026-06-30_駕駛艙建置]]。
> 這份是**完整現況快照**(會隨開發更新);決策的精煉版在記憶。

## 身分

把 **n8n(編排)+ Claude agent(大腦,經 bridge 跑 CLI)+ vault(真相)** 收進一個原生 macOS 殼。對使用者只有「一個 app」:在裡面查專案、審核准、看監控、跟大腦對話,**對話就能改 vault / 改頁面 / 管 n8n**。

## 現況總覽(running)

- 原生 app 已裝 `/Applications/VisTwin.app`(ad-hoc 簽章、自動安裝)。
- bridge 跑在 `:8787`(launchd,常駐)。
- n8n 跑在 `:5678`(Docker),workflow 已分資料夾(駕駛艙頁面 / 維護 / Agent)。
- 6+ web 模組頁 + 全頁浮動對話 widget 都上線。

## 元件

### 原生殼(`vistwin-app`,SwiftUI)
- **模組註冊表驅動側邊欄**:`NavigationSplitView`(`.balanced`),內容來自 bridge `/modules`(`modules.json`)→ **加/減/改模組免重編 Swift**,重開 app 即生效。
- **WebPane(WKWebView)**:載入遮罩、`runOpenPanelWith`(讓 `<input type=file>` 能選檔)、`createWebViewWith`(`target=_blank` 留在 app 內)、**持久 cookie 儲存**(n8n 登一次、~10 年免再登)。
- `build.sh`:`swiftc` → `.app` + icon + ad-hoc codesign + 自動裝到 `/Applications` + `xattr -cr` + `lsregister`。

### host-bridge(`bridge.mjs`,Node 無依賴)
- 位置 `~/Library/Application Support/vistwin-automation/`(TCC 安全、讀得到 vault)。launchd 常駐。
- `runClaude(prompt, sessionId, opts)`:`claude -p --output-format json`,支援 `--resume` / `--add-dir` / `--permission-mode`。`sh()` 補 PATH `/usr/local/bin`(launchd 下找得到 docker/git/python3)。
- **讀端點**:`/modules` `/widget.js` `/memory` `/now` `/projects` `/approvals` `/activity` `/probe-fs`。
- **寫入層**:`parseFM` / `writeFM`(只動 frontmatter、保留 body、house-style 序列化、原子寫入)+ `/project/{update,create,delete}`(token-gate、路徑守門、欄位驗證、依賴級聯)。
- **`/ask`**:grounded 前言(繁中 · 無 emoji · 注入專案索引 · 動作協定 `op:update/create/delete/dev` · 不確定先追問 · 附加檔案走 `--add-dir UPLOAD_DIR`)。
- **dev-action 引擎**:`devApply`(export 快照 → CLI bypass 只改目標產生器 → `git` scope 守門 → 重生成 + JSON 驗 → 部署 → curl 冒煙測 → **失敗自動 rollback**)+ `devAudit`(→ `~/Library/Logs/vistwin-dev-audit.jsonl`)。
- `/upload`(base64、40MB)、OPTIONS preflight CORS。

### Web 模組(n8n webhook → HTML,inline `vistwin.css` + `widget.js`)
- **home**(駕駛艙)· **projects-view**(Notion 式可編輯、雙向寫回 `01 專案/_控管/*.md`、寫入前小確認、看板)· **approvals-view** · **now** · **activity** · **agent-chat** · **memory**。
- 模組清單在 `modules.json`(資料驅動)。n8n 編輯器本身也升為模組「流程 (n8n)」。

### 浮動對話 widget(`widget.js`,自我注入)
- 每頁都有的小型對話窗;能改專案 + 跑 dev-action。
- IME 安全 Enter(組字中不誤送)、可追問、附加檔案(`label[for]` + `runOpenPanel`)、動作區塊 → 確認卡 → 套用。

### 設計系統(`web/vistwin.css`)
- zinc 中性 + 單一 signal 綠 `#76B900`(≤5% 視野)· HUD mono · 無 emoji · 跟隨系統明暗(`prefers-color-scheme` + `[data-theme]`)。對齊 [[02 技術/Design-System/README|Design System]]。

### n8n
- Docker 容器 `n8n`;workflow 由 `_gen_*.py` → JSON → `import:workflow`。
- 內容:維護 dispatcher(逐項核准表單)· 可控 agent loop · agent monitor · 7 個駕駛艙頁。
- 已用原生資料夾分類;Public API 已啟用(待建 API key 做對話管 n8n)。

## 治理實作

- 提案 → 核准 → 套用:`/project/*` 與 `/dev/apply` 都走「確認卡」;dev-action 有快照 + 驗證 + rollback + audit(已驗證會抓錯回滾)。
- token-gate 寫入路由;讀路由開放;路徑穿越守門。
- git(Obsidian Git 自動 commit)= 還原網。

## 進行中 / 下一步

- **對話管 n8n**(本 session 設計完):新增 `op:n8n` 動作類別 + `/n8n/apply` 端點 + n8n API key + 四層風險閘(讀 / 可逆 / 結構編輯走 harness / 破壞)。Slice 1 = API key + 讀 + 可逆操作(啟用/停用/改名/tag/移資料夾)。
- 記憶接進 `/ask` 前言(開場載入對應 namespace)。
- LINE outbound 通知 + 唯讀監控。
- bridge 包成本機 MCP → Claude Desktop 用嘴控。

## Repos

- **`VistwinDev/vistwin-manager`(monorepo)** —— `app/`(SwiftUI 殼)+ `host-bridge/` + `workflows/` + `web/` + `modules.json`。2026-07-01 由 `vistwin-app` + `vistwin-automation` 合成(殼/內臟解耦改用資料夾分,而非分倉)。
  - 本機資料夾仍名 `vistwin-automation`(保 bridge `REPO_ROOT` 預設不動);遠端改名待 org owner 執行。

## 踩過的雷(精選,全表見 [[2026-06-30_駕駛艙建置]])

- n8n SQLite **別從主機在容器運行中改**(WAL/shm 不同步 → IOERR)→ 要改先停容器(備份 → 停 → 寫 → 起)。
- n8n 等待表單用「該次執行快照」渲染 → 改 `customCss` 只對新執行生效。
- WKWebView `.ignoresSafeArea()` 會畫到側邊欄底下 → 拿掉。
- token 注入頁面的 `.json` 要 gitignore。
- n8n 資料夾**樹狀瀏覽 UI** 要免費「registered community」金鑰(註冊才解);資料夾資料本身可直接用,tag 則完全免授權。

## Related
- [[README|超級 App 總體架構]] · [[Work]] · [[Research]] · [[原則]] · [[複製化路線]]
