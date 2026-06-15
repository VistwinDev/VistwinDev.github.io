---
name: <skill-name>
description: <一行描述>
keywords: <comma, separated, list>
audience: lab            # company / lab / public
status: active           # active / experimental / deprecated
created: 2026-05-19
lastUsed: 2026-05-19
confidential: false
---

# <Skill Name>

## When to use

<什麼情境會觸發這個 skill；使用者可能會怎麼問>

## Pre-flight

<執行前要確認的前提，例如某路徑存在、某工具已登入>

## Steps

1. <第一步>
2. <第二步>
3. <...>

## Edge cases

- <例外情況一 + 怎麼處理>
- <例外情況二 + 怎麼處理>

## Goal-backward verification

> 標記完成前必跑（借自 founder-os）。任一條沒驗證到 → 不算完成。

1. 重讀原始目標 / 驗收條件
2. 順著實際產出（檔案 / 指令 / 輸出）逐條對回去
3. 能不能端到端 demo 一次給使用者看？
4. production / 換機 / 重跑會在哪裡爆？
5. 寫完 self-check 標 P0 / P1 / P2

## Lessons (用過後補)

> 每次真的用過這 skill，補一行：日期 — 踩到什麼 / 怎麼改。累積到 [[_learnings]]。

- <2026-MM-DD — lesson>

## Related

- [[_index]]
- [[_changelog]]
