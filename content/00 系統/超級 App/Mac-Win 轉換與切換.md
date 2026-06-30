---
title: Mac↔Win 轉換與切換框架
type: framework
app: shared
created: 2026-07-01
updated: 2026-07-01
tags: [system, 超級app, framework, 跨平台, win]
---

# Mac↔Win 轉換與切換框架

> 框架如何從 Mac(Manager)轉到 Win(Work),以及兩機如何切換 / 溝通。
> **Win 端的 agent 讀這份**,照著把框架對接起來;「對接與溝通」的實作由 Win 端做,本檔定**契約 + 清單 + 接口**。框架全貌見 [[README]]。

## 核心決策(2026-07-01,Frncs 拍板)

1. **n8n 拓樸 = A:各機各跑自己的 n8n。** Win 在 Mac 關機時也能獨立運作。
2. **共用的是「template 庫」,不是運行實例。** 參數化 workflow 進 repo,各機 import → 套自己參數 → 進各自的 n8n DB。
3. **鐵則:n8n 的 SQLite DB 永不跨機共用**(不能 git-merge、兩機同寫 = IOERR)。跨機只同步「定義 / 模板」。

## 轉換的本質:共用「契約」,不是 Mac binary

大部分本來就跨平台,只有「原生殼」要換:

| 層 | 跨機方式 | Win 端要做 |
|---|---|---|
| **vault(真相)** | git | clone,零改 |
| **n8n template 庫** | git(repo 內 JSON / 產生器) | Docker 裝好、import、套參數 |
| **bridge** | Node(跨平台) | 改路徑 + 服務管理 + APP_DIR;邏輯照搬(見下方移植清單) |
| **web 模組頁**(home/projects/chat/now/approvals/activity/memory) | 本來就是 web | **零改**重用 |
| **modules.json / 設計 token / bridge API 契約** | 純資料/契約 | 共用,零改 |
| **原生殼**(SwiftUI) | ❌ Mac 限定 | 做 Win 薄殼(WebView2 / Electron)套同一批 web 模組 |
| **Claude CLI** | 各機一份 | 安裝 |

→ **轉到 Win = 搬 bridge + 裝 n8n/CLI + clone vault + 做薄殼套 web 模組。** 真正重寫的只有視窗外殼。

## bridge 移植清單(Node 跨平台,逐項對照)

| 項目 | Mac 現況 | Win 要改 |
|---|---|---|
| 路徑常數 | `VAULT` / `PM_DIR` / `MEM_DIR` / `UPLOAD_DIR`,`os.homedir()` | 換 Windows 路徑;凡 `path.join` / `os.homedir()` 的本來就可移植 |
| APP_DIR | `~/Library/Application Support/vistwin-automation/`(TCC 安全位) | `%APPDATA%\vistwin-automation\`;Win 無 TCC,位置限制小 |
| 服務常駐 | launchd plist + `launchctl kickstart` | Windows:Task Scheduler / NSSM / Windows Service |
| PATH 補丁 | `sh()` 補 `/usr/local/bin`(找 docker) | 換成 Win 的 docker / git / python 路徑 |
| 外部工具 | docker / git / python3 / curl / claude | 確認都在 Win PATH |
| 埠 | bridge `:8787` · n8n `:5678` | 相同 |
| token-gate / CORS / 寫入守門 | 照搬 | 零改(純邏輯) |

## n8n template 庫

- **位置**:`vistwin-manager` monorepo 的 `workflows/`(`_gen_*.py` 等)——**不放 vault**(程式/JSON 照規矩進 code repo)。
- **內容**:維護 dispatcher、可控 agent-loop、agent-monitor、各模組頁產生器,皆參數化。
- **各機流程**:import 模板 → 套參數(zone tag = manager/work/research、路徑、埠)→ 進自己的 n8n。各機可再加自己的專屬流程。
- **分區**:在共用庫上用資料夾 + zone tag 標記(Phase 1)。

## 切換 / 溝通層(Win 端實作,本檔定接口)

- **先期(不分區轉換):vault 當非同步匯流排。** 約定區 `00 系統/超級 App/_bus/`:一台丟訊息/任務檔,另一台下次 git pull 撿。零網路、最穩,沿用既有 git sync。
- **之後(要即時):** bridge↔bridge HTTP(需區網 / tunnel),或其中一顆 n8n 開 webhook 給對方觸發。
- **切換語意**:在哪台開殼都讀同一個 vault + 同一套契約;焦點以 [[Now]] 為準。

## 階段(先「不分區轉換」)

1. **Phase 0 — 平價轉換(不分區)**:Win clone vault → 裝 Docker+n8n(import 共用模板)→ 搬 bridge → 做薄殼套 web 模組 → 裝 CLI。**目標:Win 跑起一模一樣的框架,兩台都看得到全部。**
2. **Phase 1 — 分區**:n8n 加 zone tag、vault 分區寫入(規則見 [[_policy]])、各角色專屬模組。
3. **Phase 2 — 即時溝通**:bridge↔bridge / 共用 webhook。

## 待 Win 端填 / 實作

- Win 薄殼選型(WebView2 / Electron / 其他)+ 它怎麼讀 `/modules`。
- bridge 在 Win 的服務常駐方式(Task Scheduler / NSSM)。
- `_bus/` 訊息格式(誰寫、誰讀、欄位)——由 Work 端提案,寫進 [[Work]]。
- Win 自己的 repos。

## Related
- [[README|超級 App 總體架構]] · [[Manager]] · [[Work]] · [[_policy|記憶政策]]
