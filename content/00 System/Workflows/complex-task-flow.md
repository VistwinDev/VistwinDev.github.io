---
tags: [system, workflow, claude]
created: 2026-05-19
updated: 2026-05-19
---

# 🔁 Complex Task Flow

> 借自 founder-os。**範圍不明 / 多方案 / 大改動**時才走這流程；
> 小改動直接做（見 [[working-with-frncs/SKILL|working-with-frncs]] §1「該動了立刻停討論」）。

## 決策：要不要走完整流程？

| 情況 | 流程 |
|---|---|
| Bug 有明確重現、小 UI 調整、定義清楚的功能 | **直接做** → self-check → 回報 |
| 「該用 X 還 Y？」、大重構、影響面不明 | **Research → Plan → Approve → Implement** |

## 完整流程（僅大改動）

1. **Research** — 先查不寫 code。輸出一份 plan（方案 / 取捨 / 風險），停。
2. **Approve** — 使用者看 plan，approve 或要求修。**沒 approve 不寫 code。**
3. **Implement** — 照已批准 plan 做。
4. **Goal-backward verify** — 見 SKILL_TEMPLATE 同名 section，逐條對回驗收。

## Story Sizing（防品質衰退，借自 founder-os）

- 一個任務 = 一個 context window 內可完成
- 改檔 ≤ 3–5 個；要讀 >2000 行才懂 → 拆
- 不確定範圍 → 往小拆
- 拆法：Schema → Backend → Frontend → Integration

## Related

- [[../../05 Claude Skills/working-with-frncs/SKILL|working-with-frncs]]
- [[../../05 Claude Skills/_learnings|Skill Learnings]]
- [[../index|00 System]]
