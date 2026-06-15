---
tags: [meta, claude, ai, memory]
created: 2026-04-11
updated: 2026-04-11
---

> ⚡ **最小工作流原則 (2026-04-11 重整)**
> - **單一真相來源:** Obsidian vault (本地) + Git (GitHub 同步)
> - **外部輸入:** 只保留 Gmail 和 Google Calendar,不用 Notion
> - **時間軸分工:** `gcal = 有時間的事`,`vault = 沒時間的事`,單向同步 gcal → vault
> - **甘特圖:** 用 Obsidian 原生 Mermaid `gantt` block,不裝第三方 plugin
> - **被動設計:** 維護精力盡量低,讓排程 agent 負責推進,而不是使用者自己記得

# 🧠 Claude Memory

> 這份檔案是 Claude 的跨對話記憶。每次新對話開始時,Claude 應主動讀取這份檔案,以維持跨 session 的上下文連貫性。
>
> **Claude:如果你正在讀這份檔案,請依照下方內容調整你對使用者的認知與互動方式。**

## 👤 使用者 (Frncs)

- **慣用語言:** 繁體中文(台灣)
- **時區:** Asia/Taipei
- **稱呼偏好:** Frncs

## 🛠 工作環境

- **第二大腦:** Obsidian vault「MetaArche」,採 PARA + 編號資料夾結構
- **筆記慣例:**
    - YAML frontmatter 含 `tags`、`created`、`updated`
    - 日期一律 ISO 格式 `YYYY-MM-DD`
    - 中英文之間用空格
    - 狀態用 tag 表示 (`#todo` `#doing` `#done` `#blocked`)
    - 主題資料夾都有 `XXX MOC.md` 作為索引
- **Git 同步:** ✅ 已設定 — remote `github.com/metaarchetech/metaarchetech-vault`,master 分支
    - `.claude/` (Cowork 工具設定) 已被 gitignore,不進 repo
    - 排程 agent 每晚自動 commit + push,使用者不需手動操作

## 🔗 已連接的工具

- **GitHub** — vault 同步
- **本機檔案** — Obsidian vault

## 📝 相關連結

- [[Vault Home]]
- [[Workflow]]
- [[Projects Dashboard]]

---

*最後更新:2026-04-11 by Claude*
