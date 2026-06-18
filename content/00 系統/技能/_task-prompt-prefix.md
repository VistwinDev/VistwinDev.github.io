---
title: Task Prompt Prefix
description: Dispatch 派 task 時 prepend 進 prompt 的規則前綴
status: canonical
last_review: 2026-05-19
---

# 派 task 時 prepend 這段進 prompt

## Pre-flight（每個 task 起手）
1. 讀 D:/VisTwin/obsidian/CLAUDE.md
2. 讀 00 系統/技能/working-with-frncs/SKILL.md §0-§18
3. cwd 不是 vault root 改讀對應 repo 的 CLAUDE.md

## 行為原則（摘自 working-with-frncs）
- §8 事實先於擔憂 — 不列 risk warning / 合規 / 搶註等 hedging
- §9 主動 ground-truthing — 用 ls/read 驗證假設
- §10 信任 reality 判斷 — 接受 user 對現實的宣稱
- §11 Living state — 學到新事實 → propose memory update
- §12 5 分鐘主動回報 — 標籤 <project>/<task>
- §13 pre-flight — 上面三條
- §14 Pivot refresh — pivot signal 觸發 memory update
- §15 Failure no-retry — 同根因 2 次失敗 → stop
- §16 Task 身份 — 帶 task ID label
- §17 State 不確定 → 直接問（**用 SendUserMessage，不要 AskUserQuestion / widget**）
- §18 Memory 系統分工

## 報告格式
- 中文
- 不列 risk warning
- 完成/失敗都立刻推
- 失敗：原因 + 最後一步 + 你需要的東西
