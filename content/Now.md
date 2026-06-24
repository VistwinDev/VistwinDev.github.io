# Now — 當前焦點

_最後更新: 2026-06-25 (daily 節奏再次重啟，回補 W26)_

## 本週焦點(Sprint [[02 技術/Visustwin/sprints/2026-W26/README|2026-W26]])

> W21 後又斷 4 週(W22–W25 無 daily，健檢顯示節奏斷 35 天)。本週起補回 daily/weekly，由 [[00 系統/技能/daily-weekly-journal/SKILL|daily-weekly-journal]] skill 維持。

### 戰略主線(雙軌平行,見 [[00 系統/Entity_Map|Entity Map]])
- **主線 A Physical AI** — ROS2 + KUKA + NVIDIA Isaac + Omniverse(lab 端執行)
- **主線 B BIM + Digital Twin** — 與 A 同級,非支線

### 客戶端(非主線)
- 寶舖 — 6/8 已交付;showcase 6/22–6/24 持續迭代(build-status / 交接速覽 / 各展間頁),透過設計公司外包

### vault / infra(本週)
- Entity normalization → [[00 系統/Entity_Map|Entity Map]] canonical baseline
- [[00 系統/技能/vault-publish-pipeline/SKILL|vault-publish-pipeline]] skill — publishing 全鏈盤清
- daily/weekly 節奏重建

## 進行中
- daily/weekly 自動化 — scheduled task(cron)待 Dispatch 端派出
- Repos 大整理 — 見 [[98 資料/Repos_State/2026-05-25_inventory|2026-05-25 inventory]]（🔴 6, 🟡 5, 🟢 1, 🔵 4）

## 等待 / blocked
- **publishing 鏈 [2] 段**:`DASHBOARD_PAT` 未設,自動 sync-to-quartz 不動,手動 rsync 代跑(見 [[00 系統/技能/vault-publish-pipeline/SKILL|vault-publish-pipeline]])
- **GitHub org rename** `metaarchetech` → `vistwin-tech`(Entity Map 行動項,本週內)

## 近期要啟動
- daily/weekly 兩個 cron scheduled task 交 Dispatch 派出
- GitHub org + vault 資料夾 rename(同一波處理)

## 今日 daily log
- [[02 技術/Visustwin/sprints/2026-W26/2026-06-25|2026-06-25]]
