---
tags: [system, workflow, n8n, automation, design]
created: 2026-06-24
updated: 2026-06-24
status: design
---

# 🤖 n8n × vistwin-vault 自動化設計

> 本機（macOS）n8n 與本 vault 的串接設計。**此文件僅為設計藍圖**，三個 workflow 尚未實作。
> 實作順序：① → ②/③（②③ 需外部憑證，待決定）。
> 相關背景：那份「AI 自動化編排架構報告（n8n + 各單位訂閱）」。

## 環境前提（已就緒）

| 項目 | 值 |
|---|---|
| n8n 版本 | 2.27.4（npm 全域安裝） |
| n8n 編輯器 | http://localhost:5678 |
| n8n 資料/憑證 | `~/.n8n` |
| n8n 執行檔 | `/Users/code/.hermes/node/bin/n8n` |
| node（給 Execute Command 用） | ⚠️ 實作時用 `which node` 確認絕對路徑（本機曾見 `/Users/code/.hermes/node/bin/node` 與 `/Users/code/.local/bin/node` 兩處） |
| vault 路徑 | `/Users/code/Desktop/vistwin-vault` |
| vault git | master 分支，遠端 `VistwinDev/vistwin-vault` |

> n8n 的 **Execute Command** 節點不繼承登入 shell 的 PATH，所有 `node` / `git` 都要寫**絕對路徑**。

---

## ① 排程跑現有腳本 + 自動 commit ★建議先做

把 `scripts/` 內既有兩支腳本變每日全自動，產生 GitHub 儀表板並推上 git。
**純本機，不需任何外部憑證。**

### 節點流程
```
Schedule Trigger（每日 09:00）
  → Execute Command: <node> /Users/code/Desktop/vistwin-vault/scripts/sync-github-repos.mjs
  → Execute Command: <node> /Users/code/Desktop/vistwin-vault/scripts/build-github-dashboard.mjs
  → Execute Command: cd <vault> && git add -A && git commit -m "chore: n8n auto-sync $(date +%F)" && git push
  → IF（前面任一步 exitCode≠0）
       → Execute Command: append 錯誤訊息到 logs/n8n.log
```

### 實作備註
- 兩支 `.mjs` 若需 GitHub token，n8n 用 **Environment / Credentials** 注入，不要寫死在指令裡。
- `git commit` 在無變更時會回非 0；用 `git commit ... || true` 或先 `git diff --quiet` 判斷，避免誤判失敗。
- 與 Obsidian Git 外掛若同時開啟，注意**不要兩邊同時 push** → 建議擇一負責 push，或把 n8n 排程錯開 Obsidian 的 5 分鐘自動同步。
- 驗收：手動 trigger 一次 → 看 GitHub 儀表板筆記有更新 + 遠端有新 commit。

---

## ② 監看新筆記 → AI 處理　（需 Claude API key）

對應 vault 的 `status/draft → review` 流程。

### 節點流程
```
Local File Trigger（watch: 01 專案/**、02 技術/** 的 *.md，事件=add）
  → Read Binary/Text File（讀新檔內容）
  → IF（front-matter 含 status/draft 或缺摘要）
       → Anthropic / HTTP Request 節點：Claude 產 3 行摘要 + 抽 tag
       → Edit File：把摘要寫回 front-matter（或 append 到 index.md 的待審清單）
```

### 待決定
- **憑證**：Claude API key 由你親自在 n8n 介面填（建議用最新 `claude-opus-4-8` 或 `claude-sonnet-4-6`）。
- 寫回策略：改 front-matter ↔ 只在 index.md 列清單（避免動到原文）。
- 防迴圈：寫回動作會再觸發 File Trigger → 需用 flag（如 `ai/processed` tag）擋掉。

---

## ③ 各單位訂閱分發　（需外部管道憑證）

對應「n8n + 各單位訂閱」報告的核心。

### 節點流程
```
Schedule Trigger（每週一 08:00）  或  Webhook
  → 掃描 status/done 且本週更新的筆記
  → 依 project/* 或單位 tag 分組
  → Switch：每個單位 → 對應管道
       ├ Email（Gmail / SMTP）
       ├ Slack
       └ Notion
  → 寫一筆分發記錄到 logs/
```

### 待決定
- **先定義「單位 ↔ tag ↔ 管道」對照表**（這是整個 ③ 的前提）。
- 各管道憑證（Gmail OAuth / Slack token / Notion integration）由你親自在 n8n 填。

---

## 實作順序與狀態

| # | Workflow | 外部憑證 | 狀態 |
|---|---|---|---|
| ① | 排程跑腳本 + auto-commit | 無（GitHub token 可選） | ⬜ 待實作 |
| ② | 新筆記 AI 處理 | Claude API key | ⬜ 待設計細節 + 憑證 |
| ③ | 各單位訂閱分發 | Email/Slack/Notion | ⬜ 待定義對照表 + 憑證 |

## Related
- [[complex-task-flow]]
- [[../index|00 System]]
