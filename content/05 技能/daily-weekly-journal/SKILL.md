---
name: daily-weekly-journal
description: 每日 / 每週把真實工作落進 vault 既有 sprint 系統（不另開資料夾），讓 Quartz 站點看得到節奏。當使用者說 daily / weekly / 週報 / 今日總結，或 scheduled task 觸發時用。
keywords: daily, weekly, journal, 週報, 日報, 今日總結, retro, sprint, standup, 沒有體現, 上次多久
audience: lab
status: active
created: 2026-05-20
lastUsed: 2026-05-20
confidential: false
revisionTrigger: sprint 資料夾位置遷移 / 改用 Obsidian Daily Notes plugin / vault 從 VisTwin rename 為 vistwin / 模板大改
lastReview: 2026-05-20
---

# Daily / Weekly Journal

## 🇹🇼 中文摘要

**是什麼**：把每天 / 每週真實發生的工作，落進 vault **既有的 sprint 系統**
（`02 產品/Visustwin/sprints/`），讓 Obsidian + Quartz 站點看得到開發節
奏。重點：**驅動既有設施，不另開 `02 Daily/` 之類新資料夾**——vault 已有
scrum 慣例（`sprints/README.md`）+ 兩個現成模板，過去 3 週沒人寫不是缺工
具，是缺「自動把真實活動寫進去」這一步。

**何時用**：使用者說 daily / weekly / 週報 / 今日總結 / 「上次都多久了」；
或 scheduled task 每日 22:00、週末觸發。

**核心步驟**：算 ISO 週 → 確認 / 建 sprint 資料夾 → 從 git + skill changelog
+ Entity Map + 各 repo 抓真實活動 → 套既有模板寫進去 → 同步刷新 `Now.md`。

**VisTwin 對位**：主線雙軌（Physical AI / BIM+DT）+ 寶舖 6/6 deliverable 的
進度要在 daily/weekly 看得到；節奏斷掉 = 看不到 6 個月後的進展（§7）。

## When to use

- 使用者說：「daily」「daily journal」「今日總結」「週報」「weekly review」
  「每天/週報的效果沒體現」「上次寫是多久前」。
- Scheduled task 觸發（cron，見最後一節）。
- 開工發現 `Now.md` 或最後一篇 daily 已過時 > 3 天 → 主動提議補。

## 既有設施（不要重造）

| 項 | 既有位置 | 動作 |
|---|---|---|
| Daily 模板 | `00 系統/Templates/Daily Standup.md` | **沿用**，不建新 Daily_Template |
| Weekly 模板 | `00 系統/Templates/Weekly Review.md` | **沿用**，不建新 Weekly_Template |
| Sprint 慣例 | `02 產品/Visustwin/sprints/README.md` | 依此 ISO 週命名 |
| Daily 落點 | `02 產品/Visustwin/sprints/2026-W{NN}/YYYY-MM-DD.md` | 寫這裡 |
| Weekly 落點 | `02 產品/Visustwin/sprints/2026-W{NN}/retro.md` 或 `Weekly Review · YYYY-MM-DD.md` 同資料夾 | 寫這裡 |
| 週索引 | 同 sprint 資料夾 `README.md` | 維護該週概覽 |
| 站點曝光 | Quartz 自動吃 vault content；`Now.md` 是 live 焦點頁 | daily 寫完同步刷 `Now.md` |

> **不要**新增 top-level `02 Daily/`：`02` 已是 `02 產品`，會撞號且是另
> 開戰場（working-with-frncs §2 / §6）。Obsidian Daily Notes plugin 目前**沒
> 開**（只有 obsidian-git）；模板的 `{{date}}` 不會自動填，由本 skill 填。

## Pre-flight

1. 確認在 vault root（`D:\Visustwin\obsidian` 或 worktree）。不在則停。
2. 讀 [[working-with-frncs/SKILL|working-with-frncs]] §0–§11（特別 §2 不開戰場、
   §8 事實先於擔憂、§7 真實價值＝進度）。
3. 讀 `02 產品/Visustwin/sprints/README.md` 確認 scrum 慣例沒變。
4. 算今天 ISO 週與星期：`date -d "<today>" "+%G-W%V %a"`。
5. 找最後一篇 daily（`sprints/` 下最新 `YYYY-MM-DD.md`）→ 算斷了幾天，
   作為事實陳述報給使用者（**不列風險、不說教**，§8）。

## Steps — Daily（每日，落「今天剛結束」視角）

1. ISO 週 → sprint 資料夾 `02 產品/Visustwin/sprints/2026-W{NN}/`；
   不存在就建，並建 / 補該資料夾 `README.md`（週概覽，見模板片段）。
2. **抓真實活動**（有什麼抓什麼，沒有就誠實留空，不要編）：
   - 本機 + 其他 repo：`git log --since="<today> 00:00" --pretty='%h %s'`
     （**過濾掉** `vault backup:` 這種 Obsidian Git 自動 commit，那不是工作）
   - `05 技能/_changelog.md` 今天那段（新 / 改 skill）
   - `00 系統/Entity_Map.md` 的 `last_updated`（今天有訪談 / 決議？）
   - 跨機狀態可借 [[../dev-state-overview/SKILL|dev-state-overview]]
   - 使用者口述的加註（若有）
3. 套 `00 系統/Templates/Daily Standup.md` 結構寫
   `2026-W{NN}/YYYY-MM-DD.md`：frontmatter `created` + `tags:
   [sprint/2026-W{NN}, daily-log, ...]`；標題 `# YYYY-MM-DD(Wkd)`；
   完成項 / 在做 / 阻礙 / 明日 / 跨 repo commit 表 / 心情能量（留給使用者填）。
4. 同步刷 `Now.md`：更新「最後更新」時間 + 本週焦點 sprint 連結 +
   進行中 / blocked（從 daily 滾上來）。**Now.md 過時是站點看不到節奏的主因**。
5. 不 commit / push（vault 由 Obsidian Git 自動 backup；除非使用者要）。

## Steps — Weekly（每週，從該週 daily 滾上來）

1. ISO 週的 sprint 資料夾；收集該週所有 `YYYY-MM-DD.md`。
2. 套 `00 系統/Templates/Weekly Review.md` 寫 `Weekly Review ·
   YYYY-MM-DD.md`（或 `retro.md`）到同資料夾。
3. 分軌彙整：**主線 A Physical AI** / **主線 B BIM+DT** / 客戶端（寶舖
   6/6） / 知識。milestone、pivot、carry-forward、下週重點。
4. `git log --oneline --since="7 days ago" | wc -l` 填 vault 增量表。
5. 刷 `Now.md` 切到下週焦點；更新 sprint 資料夾 `README.md`。

## Edge cases

- **今天只有 `vault backup:` commit**：那是自動備份不是工作。去 skill
  changelog / Entity_Map / 對話本身找真實產出；真的沒有就如實寫「無 code
  產出，本日為 X」，不要灌水。
- **斷了多天（如建檔時斷 3 週）**：不補寫過去每一天。寫今天這篇 +
  在週 README / Now.md 用一兩句陳述「W19–W20 無 daily」**作為事實**，
  不寫成檢討或風險清單（§8）。
- **跨 sprint 邊界大事**（如 visionbase 進駐）：sprints/README 已明示這
  正常，不要為對齊邊界硬切。
- **命名仍是 VisTwin**：vault / GitHub org rename 是 Entity_Map 另
  列的本週行動項，**不在本 skill 範圍**。新寫的內容用 VisTwin 命名，但
  不順手去改既有歷史檔的 VisTwin 連結（§2）。
- **使用者喊累 / 「好多事」**：daily 砍到只剩「完成項 + 明日 1 件」，
  不要塞滿模板（§5）。

## 週 README 最小片段

```markdown
---
created: YYYY-MM-DD
tags: [scrum, sprint/2026-W{NN}]
---
# Sprint 2026-W{NN}（YYYY-MM-DD ~ YYYY-MM-DD）

## 本週主線
- 主線 A Physical AI：
- 主線 B BIM+DT：
- 客戶端（寶舖 6/6）：

## Daily logs
- [[YYYY-MM-DD]]

## 返回
- [[Now]] · [[02 產品/VisTwin/sprints/README|sprints]]
```

## 整合 scheduled task（Dispatch 端用 scheduled-tasks MCP 派）

| 名稱 | cron | prompt |
|---|---|---|
| `daily-journal-22h` | `0 22 * * *` | 「執行 daily-weekly-journal skill 的 Daily 段，抓今日真實活動寫進當週 sprint 資料夾並刷 Now.md」 |
| `weekly-journal-sun-21h` | `0 21 * * 0` | 「執行 daily-weekly-journal skill 的 Weekly 段，從本週 daily 滾出 Weekly Review」 |

> cron 時間對齊 sprints/README「daily 晚上 22:00 / weekly 週末」慣例。
> scheduled task 只是觸發器，真正邏輯全在本 SKILL.md。

## Goal-backward verification

> 標記完成前必跑。任一條沒驗證到 → 不算完成。

1. 重讀目標：使用者的痛是「daily/週報沒體現在 obsidian+Quartz」。
2. 順產出對回去：今天 daily 檔真的存在於 `sprints/2026-W{NN}/` 且內容是
   **真實 git/changelog/Entity_Map 抓的**，不是模板空殼；`Now.md` 時間戳
   已更新；週 README 連得到該 daily。
3. 端到端 demo：能指出檔案路徑 + Quartz 會吃到（vault content 內）。
4. 換機 / 重跑會爆在哪：scheduled task 未派時要靠人喊；vault rename 後
   sprint 路徑要跟著改（已列 revisionTrigger）。
5. self-check 標 P0/P1/P2。

## Lessons（用過後補）

- 2026-05-20 — 建立。事實基底：`sprints/README.md` scrum 慣例、現成
  `Daily Standup` / `Weekly Review` 模板、最後 daily 為 2026-04-29（斷
  3 週 W19–W20 全空）、Obsidian 僅 obsidian-git 無 Daily Notes plugin。
  決策：驅動既有 sprint 系統而非另開 `02 Daily/`（§2 §6）；使用者 plan
  原列 `02 Daily/` 路徑已自帶「依 vault 慣例」讓步。

## Related

- [[../_index|Claude Skills Index]]
- [[../_changelog|Changelog]]
- [[../working-with-frncs/SKILL|working-with-frncs]] — 行為準則（§2/§7/§8）
- [[../dev-state-overview/SKILL|dev-state-overview]] — 跨機 git 活動來源
- [[../../02 產品/VisTwin/sprints/README|sprints scrum 慣例]]
- [[../../00 系統/Templates/Daily Standup|Daily Standup 模板]]
- [[../../00 系統/Templates/Weekly Review|Weekly Review 模板]]
