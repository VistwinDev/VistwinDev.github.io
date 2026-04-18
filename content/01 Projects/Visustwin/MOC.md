# Visustwin · 專案總覽 (MOC)

最後更新：2026-04-18

---

## ① Status Board

| 🟢 Doing | 🟡 Todo | ⚫ Blocked |
|---|---|---|
| WebController `feature/dna-port-v2` — 階層重排 + 120 週期 scrubber + 3 sequence tabs + 6 sub-cards + 寶舖 pill | Demo mode（WebController / welltek）for Vercel | 寶舖八大安全系統第 7、8 項（等業主確認） |
| welltek-twin `feature/dna-port-v2` — section tabs auto-cycle + 24 units auto-flip + ambient motion | Vercel deploy strategy（showcase 直接上；WebController / welltek 先 demo mode） | |
| metaarchetech-site `feature/dna-port` — 現代化 full-bleed + glass drawer（進行中） | 展間掃描 HUD 系統 5 個關鍵決策 | |
| Quartz PR #3 review → merge | rename metaarchetech → VisTwin（demo 後執行） | |
| | WebController pill 命名（`{ BAOPU }` vs `{ VISTWIN }`）| |
| | `@vistwin/ui` 共用 primitives 套件抽離（demo 後）| |

---

## ② Active Repos

| Repo | Branch | Latest Commit | Open PR | 裝置目標 |
|---|---|---|---|---|
| [[Repos/visustwin-showcase\|visustwin-showcase]] | `main` | `517116f` feat: motion gallery — 5 interactive patterns (2026-04-18) | — | 桌機瀏覽器 |
| [[Repos/WebController\|WebController]] | `feature/dna-port-v2` | `f7ac865` refine: scale back hero text proportion + watermark (2026-04-18) | — | iPad 橫向 Pro 2732×2048 / Air 2360×1640 |
| [[Repos/welltek-twin\|welltek-twin]] | `feature/dna-port-v2` | `849aa30` feat: auto-cycle section tabs with stable layout (2026-04-18) | — | 壁掛 / desktop ≥1920px |
| [[Repos/metaarchetech-site\|metaarchetech-site]] | `feature/dna-port` | `aec5cf4` fix: correct explorer selector (2026-04-18) | [PR #3](https://github.com/metaarchetech/metaarchetech.github.io/pull/3) | Web responsive |
| [[Repos/visustwin-vision\|visustwin-vision]] | *(no git)* | — | — | GPU workstation (Python 3.10+) |
| [[Repos/Omniverse-Extensions\|Omniverse-Extensions]] | `master` | `b17c668` docs: full README coverage for all 17 extensions (2026-04-15) | — | Omniverse Kit UI |

---

## ③ Decision Queue

- [ ] WebController pill label：`{ BAOPU }` vs `{ VISTWIN }`（目前顯示 `{ BAOPU }`）
- [ ] 寶舖八大安全系統第 7、8 項（等業主確認）
- [ ] Quartz PR #3 merge 時機（full-bleed + glass drawer 穩定後）
- [ ] 展間掃描 HUD 系統 — 時程確認
- [ ] 展間掃描 HUD 系統 — RealSense 型號選型
- [ ] 展間掃描 HUD 系統 — TouchDesigner 分工
- [ ] 展間掃描 HUD 系統 — scope cut 方案
- [ ] 展間掃描 HUD 系統 — 骨架偵測方案（YOLO11 pose vs 其他）
- [ ] Vercel private deploy 策略（showcase 直接上 / WebController + welltek 先 demo mode）
- [ ] rename metaarchetech → VisTwin（demo 後執行，影響所有 repo remote 名稱）

---

## ④ This Sprint

[[Sprints/2026-04-18 Sprint]]

---

## ⑤ Backlog

詳細 backlog → [[Backlog]]


← [[01 Projects MOC]]
