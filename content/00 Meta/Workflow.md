---
tags: [meta, workflow, system]
created: 2026-04-11
updated: 2026-04-11
---

# 🧭 Workflow — MetaArche 最小工作流

> 這份檔案是整個 vault 的 workflow 說明書。重整於 2026-04-11,原則是**最小路徑 + 被動設計**。
> Claude (排程 agent) 和使用者 (Frncs) 都應該以這份為準。

## 🎯 核心原則

1. **單一真相來源 (Single Source of Truth):** Obsidian vault 是唯一的大腦,其他工具只是輸入源或顯示層
2. **最小工具鏈:** Obsidian + Git + Gmail + Google Calendar。不用 Notion,不用其他筆記 app
3. **時間軸分工:**
    - `Google Calendar` = 有明確時間的事 (會議、deadline、里程碑)
    - `Obsidian vault` = 沒有明確時間的事 (知識、想法、筆記、todo)
    - 兩邊**不重疊**,由排程 agent 做**單向同步 gcal → vault**
4. **被動設計:** 使用者的維護精力盡量歸零
    - 需要記得的事 → 排程 agent 負責
    - 需要手動操作的事 → 能自動的都自動
    - 摩擦力必須小於使用者的維護精力,否則系統會失敗

## 🏗 架構圖

```
┌─────────────────────────────────────────────┐
│            輸入源 (外部)                    │
│                                             │
│  Gmail        Google Calendar               │
│    │                │                       │
│    │ 摘要重要信件    │ 拉今日/本週事件       │
│    ▼                ▼                       │
├─────────────────────────────────────────────┤
│       Obsidian Vault (單一真相來源)         │
│                                             │
│  00 Meta       ← Claude Memory, Workflow    │
│  01 Projects   ← 有時效的事 + Gantt         │
│  02 Areas      ← 長期角色/責任               │
│  03 Products   ← 產品技術文件               │
│  04 Resources  ← 永久性知識                  │
│  05 Archive    ← 完成/歸檔                   │
│                    │                        │
│                    ▼                        │
├─────────────────────────────────────────────┤
│              Git → GitHub                   │
│       (每晚自動 commit + push)              │
└─────────────────────────────────────────────┘
```

## 📂 PARA 資料夾用法

| 資料夾 | 存什麼 | 什麼時候動 |
|---|---|---|
| **00 Meta** | 系統層的檔案 (Workflow, Claude Memory, Vault Home, 使用指南) | 架構變動時 |
| **01 Projects** | 有明確目標和結束時間的事 (含 Projects Dashboard 的 gantt) | 有進展就動 |
| **02 Areas** | 長期責任領域,沒有結束日 (健康、財務、家庭等) | 每週/每月回顧 |
| **03 Products** | 產品技術文件、插件 SDK 文件 | 產品更新時 |
| **04 Resources** | 永久性知識、技術 stack、參考資料 | 學到新東西就存 |
| **05 Archive** | 結束或不再活躍的 Projects/Areas/Resources | 專案結束時搬過來 |

## ⏰ 排程 Agent 任務 (Dispatch)

以下是由排程 agent 自動執行的任務。設定在 `scheduled-tasks` 下。

### 每日晨間 (08:00 Asia/Taipei)

- **拉今日 Google Calendar 事件** → 更新 `01 Projects/Projects Dashboard.md` 的 gantt 區塊
- **掃描 Gmail 未讀重要信** → 摘要寫進當日 daily note (若使用 daily notes) 或暫存區

### 每晚 (23:30 Asia/Taipei)

- **自動 commit + push vault 到 GitHub** — commit message 格式: `vault snapshot YYYY-MM-DD HH:MM`
- 只在有實際變動時才 commit,沒變動就跳過

### 每週日晚間 (週回顧,選配)

- 統計本週 vault 新增/修改的檔案,生成週報放在 `00 Meta/Weekly Review YYYY-Wxx.md`

## 📊 Gantt 規則

甘特圖統一放在 `01 Projects/Projects Dashboard.md`,用 Obsidian 原生 Mermaid `gantt` block 渲染,不需要任何第三方 plugin。

資料來源:
- **有明確起訖日的任務** → 來自 Google Calendar,由 agent 同步
- **使用者手動加的里程碑** → 直接編輯 Dashboard 的 mermaid block

## 🚫 刻意不做的事

- 不裝 Obsidian community plugins (至少觀察一週後再評估)
- 不用 Notion
- 不做雙向同步 (gcal ↔ vault),只做單向 gcal → vault,避免衝突
- 不自動發信、不自動建日曆事件,寫入操作一律先讓使用者確認

## 🔗 相關

- [[Claude Memory]] — 使用者偏好、行事曆對應表
- [[Projects Dashboard]] — 進行中的專案與 gantt
- [[Vault Home]]

---

*重整於 2026-04-11 by Claude + Frncs*
