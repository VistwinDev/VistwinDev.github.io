---
type: principle
name: rubric
updated: 2026-06-30
---

# visual-ux rubric(第一個領域,來源 = VisTwin Design System)

loop 的評分依據。四層,前層 hard-fail 就短路:

- **C 靜態檢查**(C1–C16,秒級,純程式):綠 ≤5% · 兩灰階家族 · 禁漸層 · 圓角 ≤2xl · 標題無 emoji · reduced-motion · anti-FOUC …
- **L Lighthouse/a11y**(L1–L6):a11y=1.00 · 對比 AA · CLS ≤0.05。
- **B 瀏覽器互動**(B1–B9,Claude in Chrome):CTA 首屏可見 · 無 console error · hover/主題切換正常 · 鍵盤可操作。
- **J Critic 否決**(J1–J7,防過度設計):第二強調色 · 為改而改 · 可用性退步 · 雙語鎖版破壞。

36 條每條標 hard/soft + 可量法。詳:`E_forge/core/rubric/visual-ux.md`
新領域(omniverse-scene / sensor-stream / edge-compute)另開 `rubric/<domain>.md`。
