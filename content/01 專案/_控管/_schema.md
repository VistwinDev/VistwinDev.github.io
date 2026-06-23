---
created: 2026-06-24
tags: [pm, schema, meta]
---

# 專案控管區 — Schema 契約

> 這個資料夾 = **dashboard 的資料源(嚴格區)**。每個 `.md` = 一個控管物件。
> 內容/知識照舊放各專案資料夾,這裡只放「控管欄位」+ `ref` 連回內容。
> 由 vistwin-pm dashboard 讀取與編輯,也可手改或請 AI 改。

## 欄位

| 欄位 | 必填 | 說明 |
|---|---|---|
| `pm` | ✅ | 固定 `true`(opt-in) |
| `type` | ✅ | `project` / `task` / `milestone` |
| `title` |  | 顯示名(省略用檔名) |
| `status` | ✅ | `todo` / `in-progress` / `blocked` / `done` |
| `owner` |  | 主責一人 |
| `assignees` |  | 參與者 `[名字, 名字]` |
| `priority` |  | `P0`–`P3` |
| `start` / `end` |  | 起訖 `YYYY-MM-DD`(甘特圖) |
| `due` |  | milestone / 到期日 |
| `depends_on` |  | 前置項 `["[[X]]"]` |
| `progress` |  | 0–100 |
| `budget` / `spent` |  | 預算 / 已支出(數字) |
| `parent` |  | 父項 `"[[X]]"`(巢狀) |
| `ref` |  | 連回內容筆記 `["[[...]]"]` |
| `area` / `sprint` / `tags` |  | 分類 |

健檢會檢查:父項存在、依賴存在且不衝突、子項預算不超額、無循環、task 有起訖。
