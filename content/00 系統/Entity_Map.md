---
title: Entity Map
last_updated: 2026-06-18
status: canonical
---

# Entity Map — Francis Xu 旗下所有實體與關係

> 本檔由 entity normalization 訪談（2026-05-20，含 10 題主訪談 + 5 題釐清追問）整合而成，作為日後所有筆記、agent prompt、合約文字的標準命名與邊界。

## 個人 / 法人代表

**Francis Xu** — 法定名稱與所有對外操作名，所有合約、商標、公司登記、學校合作皆以此名為準。其他舊有身分名稱不在此 Entity Map 體系內提及。

## 主公司：VisTwin Technology

- **公司登記**：已登記，有統編
- **產品**：VisTwin（公司名與產品名同源）
- **GitHub orgs**：
  - `VistwinDev`（工程 org，2026-05-24 建立）— vault、extensions、showcase 等工程 repo 主場
  - `VistwinProject`（客戶/商務 org，2026-05-24 建立）— 客戶交付 / 商務專案（寶鋪知行案 8 repo 在此）
  - 舊 `metaarchetech` user account 暫保留，repos 逐個遷
  - 📁 全 repo 鏡像清單見 vault 內 `04 Github/`（不公開，`scripts/sync-github-repos.mjs` 生成）；寶鋪各區對照見 vault 內 `01 專案/寶鋪 showcase/build-status`（🔒 不公開）
- **商標**：**先暫緩**，等募資 / 收入到位再決定；同步監看是否有第三方搶註動作
- **戰略主線（雙軌平行）**：
  1. **Physical AI** — ROS2 + KUKA 大型機械手臂 + NVIDIA Isaac + Omniverse
  2. **BIM + Digital Twin** — 與 Physical AI 同等級主線，不是支線

## 上一波公司：metaarchetech

- **處置狀態**：已解散 / 清算完成
- **Legacy artifacts 處置（2026-05-25 update）**：
  - GitHub user account `metaarchetech` **保留**、舊 repos 逐個遷往 `VistwinDev`（或 archive）
  - Obsidian vault 採「新建副本 + 舊 vault frozen」策略而非 rename：
    - 新：`D:\VisTwin\vistwin-vault\` → `VistwinDev/vistwin-vault`
    - 舊：`D:\Visustwin\obsidian\` → `metaarchetech/metaarchetech-vault`（frozen，不再改動）
- 訪談後不應再以「上一家公司」之名混用於文件與 agent prompt；如出現一律以 `VistwinDev`、`VistwinProject` 或 `VisTwin Technology` 替代

## 合作關係：實踐大學 / VisionBase lab

- **正式名義（明確不收斂為單一主身分）**：業師 / 兼任講師 + 子計畫主持人 + MOU 合作單位 + 非正式（lab 進出）
  - **決議**：保留四種身分混用，**視場合切換**；不對外宣告任何單一主身分
  - 對外簽約 / paper / 介紹文時，依該情境選用最具效力者
- **研究員**：實踐大學 staff，薪水由學校支付
- **研究員開發費補貼（三軌並存）**：
  - 私人轉帳給研究員個人
  - 透過 VisTwin Technology 開薪
  - 透過實踐大學經費走帳
  - **決議**：維持現狀（目前金額小不急），等金額成長到關鍵門檻再做合規盤點
- **IP 歸屬**：理論共有，待真有產出再議
- **邊界**：VisionBase 不是 VisTwin 子公司，是大學旗下實驗室

## 客戶/專案：寶舖

- **簽約方**：透過設計公司外包（VisTwin / Francis 不直接與寶舖簽）
- **角色**：跨平台商業整合 showcase（UE / Web / TouchDesigner），重要但非核心
- **6/6 deliverable** 仍要交付
- **邊界**：寶舖 = 客戶端 showcase，**非主線**

## 戰略主線（5–10 年）

### 主線 A：Physical AI

- **技術棧**：ROS2 + KUKA 大型機械手臂 + NVIDIA Isaac + Omniverse
- **執行端**：實踐大學 / VisionBase lab
- **歸屬模式（雙軌）**：學術產出 → 學校；商業化 → VisTwin Technology

### 主線 B：BIM + Digital Twin

- **與 Physical AI 同等級**，不是養現金流的支線
- **建築業限定範圍**：只做 BIM + digital twin，**不做傳統建築業整合 / 設計類工作**
- **Welltek**：**明確放棄**
- 寶舖 showcase 屬於此主線的市場端落地之一

## 邊界規則（避免未來 agent 或筆記搞混）

- 「VisTwin」/「公司」 → VisTwin Technology（已登記，有統編）
- 「VistwinDev」 → 工程 GitHub org（2026-05-24 建立）— 主要 active repos 從這裡長
- 「VistwinProject」 → 客戶/商務 GitHub org（2026-05-24 建立）
- 「metaarchetech」 → **legacy GitHub user account**，repos 逐個遷
- 「實驗室」/「lab」 → VisionBase @ 實踐大學（**非** VisTwin 子公司）
- 「研究員」 → 實踐大學 staff（**非** VisTwin 員工）
- 「寶舖」 → 客戶端 showcase（透過設計公司外包），**非主線**，6/6 deliverable 仍交付
- 「Welltek」 → **明確放棄**，不再出現於 roadmap 與資源分配
- 「建築方向」 → 限定 **BIM + digital twin**（主線 B），不做傳統建築業整合 / 設計
- 「Physical AI」/「Robotic」 → 主線 A，lab 端執行、雙軌歸屬
- 「主線」 → 雙軌：Physical AI（A）+ BIM/DT（B），兩者平行同級

## 行動項（追問釐清後固定）

1. **GitHub org 遷移**（進行中）：
   - 2026-05-24 建立 `VistwinDev`（工程 org）+ `VistwinProject`（客戶/商務 org）兩個並行 org（替代原計畫單一 `vistwin-tech`）
   - 2026-05-25 vault repo `VistwinDev/vistwin-vault` 已建立 + push 完成
   - 舊 `metaarchetech` user account 跟 repos 暫**保留不動**（不 rename / 不 archive）— 之後逐個從 metaarchetech 遷往 VistwinDev（visustwin-extensions / showcase / vision 等）
2. **Obsidian vault 遷移**（2026-05-25 完成）：
   - 新 vault `D:\VisTwin\vistwin-vault\` 建立（含中文化資料夾 + brand 清洗）
   - 舊 vault `D:\Visustwin\obsidian\` 保留為 **frozen legacy snapshot**，不再新增改動
3. **商標監看**：暫不申請，但設定 reminder 每季檢查一次是否有第三方搶註動作；募資 / 月收入過門檻時即啟動申請
4. **稅務 / 合規盤點**：暫不動；當研究員費用月支出超過約定門檻（自訂）或請會計師時觸發
5. **roadmap 文件更新**：把「主線雙軌（Physical AI + BIM/DT）」明確寫進 roadmap / pitch，不再以「Physical AI + 養現金流支線」描述
6. **逐個 repo 遷 VistwinDev**：visustwin-extensions / visustwin-showcase / visustwin-vision 等從 `metaarchetech` 遷往 `VistwinDev`（或 archive，看 active 程度）。Quartz site (`metaarchetech.github.io`) 在新 org 重新架（決議：不修舊 sync workflow）

## 訪談摘要（決議來源）

- 10 題主訪談 + 5 題釐清追問均完成
- 沒有遺留未決項；所有「待釐清」已轉為「決議 + 行動項」
- 此版本為 canonical baseline，後續任何實體 / 關係變動須更新此檔 `last_updated`
