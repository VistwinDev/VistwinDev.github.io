---
created: 2026-04-29
tags: [scrum, meta]
---

# Sprints — Scrum 工作節奏

metaarchetech 的輕量 scrum 慣例。設計目標:**節奏穩定 + 寫的東西夠少 + 跟 vibe coding 不打架**。

## 約定

| 項 | 值 |
|---|---|
| Sprint 長度 | **2 週**(可調,但不要超過 3 週) |
| Sprint 起點 | 週一(ISO 週次邊界) |
| 命名 | `2026-W{ISO週次}/` 為 sprint 資料夾 |
| daily log 命名 | `YYYY-MM-DD.md`(放在 sprint 資料夾內) |
| daily 寫作時間 | **晚上 22:00**(配合實際工作節奏 — 一天結束時 review 而非早上預測) |
| Weekly Review | 週末跑一次(週日晚 / 週一早皆可) |

## 一個 Sprint 的標準目錄

```
sprints/
├── README.md                    ← 本檔
├── 2026-W18/                    ← 一個 sprint
│   ├── README.md                ← (可選)sprint 概覽
│   ├── planning.md              ← Sprint Planning(W18 第一天寫)
│   ├── 2026-04-29.md            ← Daily log(W18 第三天)
│   ├── 2026-04-30.md            ← Daily log
│   ├── ...
│   └── retro.md                 ← Sprint Retro(W18 最後一天寫)
└── 2026-04-18.md                ← (歷史 flat 檔,W16 之前的舊格式)
```

## 模板位置

統一放在 [[00 System/Templates|00 System/Templates/]]:

- [[00 System/Templates/Daily Standup|Daily Standup]] — 每日 22:00 寫
- [[00 System/Templates/Sprint Planning|Sprint Planning]] — Sprint 第一天寫
- [[00 System/Templates/Sprint Retro|Sprint Retro]] — Sprint 最後一天寫
- [[00 System/Templates/Weekly Review|Weekly Review]] — 週末寫(獨立於 sprint 邊界)

> Obsidian 的 Templates 設定可以指到 `00 System/Templates`,然後用快捷鍵插入,變數 `{{date}}` `{{title}}` 自動填。若還沒設定,在 Obsidian:Settings → Core plugins → Templates → Template folder location = `00 System/Templates`。

## Sprint 跟外部的對應

| 外部系統 | 對應方式 |
|---|---|
| GitHub milestone | 一個 sprint 對應一個 milestone(若有開) |
| [[02 Products/Visustwin/Backlog]] | sprint planning 從 backlog 認領 items 進來 |
| `decisions/` | sprint 中的非平凡決策另外寫進 [[02 Products/Visustwin/decisions]] |
| 跨 repo commit | daily log 底部的 commit 摘要表格集中紀錄,retro 時可彙整 |

## 不需要硬性遵守的東西

- **每天都寫**:出差 / 大日子可跳,但不要連跳 3 天以上
- **planning / retro 都寫滿**:首要是「寫」,格式不重要
- **跟 sprint 邊界對齊各種事情**:visionbase 進駐這種大事跨 sprint 邊界很正常

## 為什麼晚上寫 daily,不寫早上 standup?

傳統 scrum daily standup 是早上「我打算做什麼」。對 vibe coding + solo / 小團隊更合適的是**晚上 review 真實發生了什麼**:
- 早上計畫 ≠ 實際發生(LLM session 經常岔出去)
- 晚上 22:00 是「今天工作收尾」自然停損點,趁腦袋還記得寫
- 用「昨天完成 / 今天要做 / 阻礙」三段式的 standup 模板,但放在當日「今天結束」的視角下,語意是「today=今天剛結束 / tomorrow=明天的計畫」

## 為什麼用 ISO 週次?

- 跨年不亂(`2026-W01` ≠ `2025-W53`)
- 對得上 Linear / GitHub 等工具的 ISO 週
- 命令行算得到:`date -d "2026-04-29" "+%G-W%V"` → `2026-W18`

## 返回

- [[Now]]
- [[02 Products/Visustwin/README|Visustwin]]
- [[index|首頁]]
