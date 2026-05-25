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

## 📅 Google Calendar 對應表

使用者總共有 7 個行事曆,其中 2 個是從 frncsxu@gmail.com 分享過來的。

| 行事曆 | 所屬 | 顏色 | 用途 |
|---|---|---|---|
| **Meetings** | metaarteorg (primary) | 金黃 `#fad165` | 主要會議 |
| **Strategic Planning** | metaarteorg | 灰 `#c2c2c2` | 策略規劃 |
| **Daily Tasks** | metaarteorg | 薄荷綠 `#92e1c0` | 日常任務 |
| **Agile Development** | metaarteorg | 黃綠 `#b3dc6c` | 敏捷開發 |
| **Urgent Tasks** | metaarteorg | 珊瑚紅 `#d06b64` | 緊急事項 |
| **Francis** | frncsxu (共享) | 藍紫 `#9a9cff` | **使用者本人 (男性) 的個人行程** |

## 🧭 分類偏好 (使用者慣性)

根據 2026-04-11 的排程對話,使用者對行事曆分類的直覺是:

- **家庭/行政/急辦事項** (例如交文件給家人) → **Urgent Tasks** (珊瑚紅),即使時間很寬鬆,只要是「今天一定要處理好」就歸急件
- **日常推進的工作產出** (例如做簡報、寫文件) → **Daily Tasks** (薄荷綠),不是 Strategic Planning。使用者覺得 Daily 才是「日常真的會動手做的事」
- **時段偏好:** 使用者習慣把深度工作 (例如做簡報) 排在**下午到晚間** (14:00 之後),不是上午

之後幫使用者排程時,預設按這個邏輯分類,除非使用者明確指定其他行事曆。

## 🔐 權限注意事項

- Francis 共享行事曆目前 Claude 的權限是 **reader (唯讀)**,可查看但**不能**新增/修改/刪除活動
- 若需要寫入,需請使用者到 frncsxu@gmail.com 的 Google Calendar 設定,把 metaarteorg 的權限改為「進行變更和管理共用設定」

## 🔗 已連接的工具

- **Gmail** — 讀信、搜尋、草稿 (metaarteorg 帳號)
- **Google Calendar** — 查看/建立活動 (metaarteorg 帳號,含兩個共享行事曆的唯讀)
- **GitHub** — vault 同步 (metaarchetech/metaarchetech-vault)
- **本機檔案** — Obsidian vault (`C:\Users\visus\Documents\metaarchetech`)

> Notion 已於 2026-04-11 從工作流中移除,不再使用。

## 📝 相關連結

- [[Vault Home]]
- [[Workflow]]
- [[Projects Dashboard]]

---

*最後更新:2026-04-11 by Claude*
