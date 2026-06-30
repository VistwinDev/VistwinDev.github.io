---
type: principle
name: loop-contract
updated: 2026-06-30
---

# Evaluation Contract(領域無關核心)

任何「可驗證來源」實作五函式 + 一條經驗,核心引擎就能對它跑迴圈,不需知道它是什麼:
`propose / apply(隔離) / measure(分層) / gate(硬門檻) / rollback / toExperience`。

鐵則:
- 每輪只改一件事(可歸因)。
- 永遠保留歷史最佳;**交付歷史最佳版,不是最後一版**(最後常是過度設計版)。
- 失敗/被否決的輪次照樣 emit 經驗(高價值負面訊號)。
- 對抗式 **Critic**(預設拒絕,改動要說服它)防過度設計。
- 分層評估省成本:Tier C 靜態 → L lighthouse → B 瀏覽器互動 → J 評審否決,前層 fail 就短路。
- 無人化 = 機器硬門檻取代人類 gate;只有「沒信心」或「動高風險區」才打擾人;永遠可回滾。

詳:`E_forge/core/contract.md`
