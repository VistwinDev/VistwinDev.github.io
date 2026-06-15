# Now — 當前焦點

_最後更新: 2026-05-20 (daily-weekly-journal skill 重啟節奏)_

## 本週焦點(Sprint [[02 產品/VisTwin/sprints/2026-W21|2026-W21]])

> W18 後斷 3 週(W19–W20 無 daily)。本週起 daily/weekly 由 [[05 技能/daily-weekly-journal/SKILL|daily-weekly-journal]] skill 維持。

### 戰略主線(雙軌平行,見 [[00 系統/Entity_Map|Entity Map]])
- **主線 A Physical AI** — ROS2 + KUKA + NVIDIA Isaac + Omniverse(lab 端執行)
- **主線 B BIM + Digital Twin** — 與 A 同級,非支線

### 客戶端(非主線)
- 寶舖 6/6 deliverable — 唯一 P0,透過設計公司外包

### vault / infra(本週)
- Entity normalization → [[00 系統/Entity_Map|Entity Map]] canonical baseline
- [[05 技能/vault-publish-pipeline/SKILL|vault-publish-pipeline]] skill — publishing 全鏈盤清
- daily/weekly 節奏重建

## 進行中
- daily/weekly 自動化 — scheduled task(cron)待 Dispatch 端派出
- Repos 大整理 — 見 [[04 知識/Repos_State/2026-05-25_inventory|2026-05-25 inventory]]（🔴 6, 🟡 5, 🟢 1, 🔵 4）

## 等待 / blocked
- **publishing 鏈 [2] 段**:`DASHBOARD_PAT` 未設,自動 sync-to-quartz 不動,手動 rsync 代跑(見 [[05 技能/vault-publish-pipeline/SKILL|vault-publish-pipeline]])
- **GitHub org rename** `metaarchetech` → `vistwin-tech`(Entity Map 行動項,本週內)

## 近期要啟動
- daily/weekly 兩個 cron scheduled task 交 Dispatch 派出
- GitHub org + vault 資料夾 rename(同一波處理)

## 今日 daily log
- [[02 產品/VisTwin/sprints/2026-W21/2026-05-20|2026-05-20]]
