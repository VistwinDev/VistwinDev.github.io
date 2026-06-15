---
title: VisTwin Physical AI 章節 v0 草稿
date: 2026-04-29
status: draft
target: 並進 BP v5 第 X 章（建議落於 v4 §T 之後、§1 Design 之前，作為 §T+1 補章）
length: ~2,100 中文字
---

> **2026-05-19 重新對位**：USD ontology 為**雙軌共用層** — 主線 A (Physical AI world model) + 主線 B (BIM/DT 空間表示)。不獨佔任一條。

# 從數位孿生到行動迴圈 — VisTwin 在 Physical AI 時代的座標

*From Digital Twin to Building Intelligence Loop — VisTwin's Coordinate in the Physical AI Era*

## 為什麼現在開這一章

BP v4 已將 VisTwin 完整定位為「Omniverse 之上、以 BIM 為錨的建築空間運算平台」。這個敘事在資料與設計兩端均已自洽 — 19 個 Kit extension 涵蓋 sense（感測匯流）、analyze（環境模擬）、predict（AI 推論），透過同一條 USD 場景圖累積為可被空間理解的證據鏈。

但 v4 的 §T.2 與 §T.3 兩處刻意保留了一個未展開的窗口：Isaac Sim / Isaac Lab 被歸於「Future Potential」，並以「製造業 / 汽車業使用方式」的對照解釋我們為何暫不主打。當 NVIDIA 將 Cosmos / Isaac / Omniverse 三層棧整合定義為 **Physical AI for the world** — 即「能感測物理世界、能在物理世界中行動」的智能體系 — 我們所立基的平台已具備建築領域的 Physical AI 基礎。VisTwin 若繼續以「Future Potential」標註而不指明接點，將錯失 NVIDIA 主敘事中最具戰略張力的對位機會。

本章作為 v4 之補章，主旨在於：把這個被刻意低調的窗口說清楚 — VisTwin 不是要轉型為機器人公司，而是把既有商業模型自然延伸為**建築環境的 Physical AI 部署商**。

## 從 digital twin 到 building intelligence loop

v4 的 sense → analyze → predict 鏈條已建立，唯獨第四個環節 — **act（物理執行）** — 被歸於營運端的 BMS 控制流程，並未納入平台敘事。

Physical AI 的定義恰恰是這個閉環：sensor 感知物理狀態，AI 形成判斷，**動作執行回到物理世界**，再重新被 sensor 觀察。對建築而言，這意味著:

- 感知（已就位）：bridge.ws、vision AI、env.moisture、env.pollution
- 推論（已就位）：ai.oracle、warp.windtunnel、預測模型
- 執行（待補）：機電控制、立面動態元件、機械停車、物流送餐機器人、巡檢無人機

當第四環節納入同一條 USD 場景圖、同一套 BIM ontology，建築不再是「被觀察的物件」，而是「會反應的物件」 — 這就是 building intelligence loop。VisTwin 在這個座標上的定位是清楚的：**Physical AI for the built environment（建築環境的 Physical AI）**。

這個敘事與 v4 不衝突，而是把 v4 的 sense + reason 鏈條補完為 sense + reason + act 的閉環。

## 為什麼這件事適合 VisTwin 做

從 v4 的資產盤點延伸，VisTwin 在這個窗口具備四項條件:

**一、現有 ext 已是 Physical AI 三環節中的兩環。**bridge.ws、vision、env.moisture、env.pollution 是 sense 端；ai.oracle、warp、預測模組是 reason 端。要構築完整迴圈，缺的是 act 端的工程接口 — 這比從零開始建一套平台的代價低數量級。

**二、BIM→USD ontology 是這個迴圈的數位語言。**Physical AI 的關鍵難題不是單一機器人能否動，而是**機器人、感測器、空間、人員之間如何共享一個語意一致的世界模型**。VisTwin 的閉源 ontology + 開放介面（吃 IFC / 吐 USD）正是為這個語意層而設計 — 對任何想在建築裡部署 Physical AI 的客戶，這層 ontology 是無法繞過的接口。這也是 v4 §T.4 所述「同業壁壘」在 Physical AI 議題上的延伸座標。

**三、VisionBase 團隊裡有極稀缺的 hard skill。**工設背景 B 同學曾以 KUKA × Grasshopper 控制過真實機械手臂 — 這是學術 lab 與多數 BIM 廠都沒有的經驗。Physical AI 的部署不能只靠軟體模擬，最後一哩路是真實硬體的 calibration、安裝與 commissioning。我們在這條最後一哩路上，已經有了起點。

**四、寶舖建設的 anchor case 提供真實 testbed。**寶舖五基地 pipeline + 全台首個 WELL 白金住宅開發案 + 老董明確要求差異化定位 — 在這個組合裡導入單一 Physical AI 子系統作為試點，比任何 demo 場域都更接近真實商業條件。

## 在 NVIDIA Physical AI 棧的座標

NVIDIA 公開的三層棧分工:

- **Cosmos** — world foundation model，提供物理世界的情境理解
- **Isaac** — robot simulation & learning，訓練行動體
- **Omniverse** — USD scene graph，物理場景的協作骨幹

VisTwin 在這個棧裡的座標非常清楚：**我們不爭做 Cosmos，不爭做 Isaac，我們做 vertical specialist** — 站在 Omniverse 之上，把建築領域所需的 sense / reason / act 包裝為 Kit extension 與 deployment 服務，讓建築業主、開發商、營運商不需要直接面對 NVIDIA 的研究級平台，就能取得 Physical AI 能力。

這個定位的重要性在於：它使 VisTwin 與 NVIDIA 之間是**互補關係而非競爭關係**。當 NVIDIA 在尋找 Physical AI 的 vertical 落地案例時，建築業是少數產值龐大、卻還沒有專屬部署商的領域 — 這正是 v4 §T.3a「同平台不同定位」邏輯在商務面的延伸。

## 與競爭對手的差異

| 類別 | 代表廠商 | 邊界 |
|---|---|---|
| Mobile robot | Boston Dynamics / Figure / Tesla Optimus | 行動體本身，不擁有空間語意 |
| BIM 設計工具 | Bentley / Autodesk | 設計階段，不延伸至 act 端 |
| BMS / 控制 | Honeywell / Siemens / Johnson Controls | 控制點位，不擁有 USD 場景骨幹 |
| 空間運算平台 | Matterport / OpenSpace | 視覺化為主，無 AI + 物理執行迴圈 |
| **VisTwin** | — | **建築 domain × ontology × FDE × NVIDIA 對位** |

簡言之：**沒有任何一家現行公司同時擁有「建築特化 ontology + Omniverse 對位 + FDE 通路 + 真實機器人經驗」這四個座標**。這是 VisTwin 在 Physical AI 議題上獨有的位置，也是現階段競爭對手難以同時補齊的組合。

## FDE 模型如何疊加 Physical AI 階段

VisTwin 商業模型走 FDE 路線（Forward Deployed Engineer，高觸點、單案高值、不走 SaaS、靠 deployment 變現）。Physical AI 的疊加方式如下:

- **原 FDE deployment** = BIM → USD 接入 + 4 柱 + 2 底所需 ext 配置 + 客戶現場 commissioning。
- **Physical AI-enabled deployment** = 在原 FDE 之上，再加入 sense+act loop 的工程整合（含硬體選型、控制接口、安全 fallback、場域 commissioning）。

新 deployment tier 的單案價合理增幅落在 **30-50%** 區間 — 因其工程複雜度、硬體 capex、commissioning 工時皆為原 deployment 之外的疊加成本，但所累積的 ontology profile 與 deployment know-how 將同時強化下一案的議價能力。

從 profile 累積角度看，每一個 Physical AI deployment 都在補強三類資產：**Taiwan 建築 Physical AI profile（在地法規 + 機電生態的整合 know-how）**、**WELL profile（健康建築場域中的 act 端應用）**、**商辦 profile（多租戶場域中的服務型 Physical AI）**。這三類 profile 的累積本身就是不可被 SaaS 競品複製的護城河。

## 戰略 milestone（以條件為界，非以日期為界）

> **待決定 #1（見下文開放問題）**：第一個 sense+act loop 的具體場景需先擇一定錨。

- **M1 — 第一個閉環**。VisionBase × KUKA × 寶舖試點，scope 不超過單一子系統。完成標準 = 在真實建築中實現一次完整 sense→reason→act→sense 迴圈。
- **M2 — 進入 deployment 包**。當 M1 在現場穩定運行三個月以上，將該 loop 標準化進寶舖案的 deployment 配置，成為差異化賣點。
- **M3 — 第二客戶複製**。當 M2 在第二個非寶舖客戶成功複製，「Physical AI-enabled deployment」可獨立成為 VisTwin 的產品 tier。
- **M4 — NVIDIA 對位**。當 M3 累積至少三個獨立案例與可發表的量化成果，主動對 NVIDIA 提出 vertical case study，啟動 co-marketing / 戰略夥伴對話。

每一階段以條件而非時間進入下一階段；條件未達則維持原階段，避免投資人簡報節奏壓垮工程節奏。

## 風險面

**硬體 capex 不可低估。**Physical AI 的 act 端涉及機器人、執行器、安全感測器、整合控制器等硬體配置，capex 結構與純軟體 deployment 截然不同。M1 必須以最小 scope 驗證單一閉環，避免在尚未獲得收入閉環前先承擔硬體庫存風險。

**Scope explosion 是最大工程風險。**從 sense 升級到 act，每多一個自由度，commissioning、安全驗證、保險責任的複雜度都是指數成長。寶舖試點必須以「可以做到但選不做」的方式收斂 scope — 寧可第一案做得保守，也不要在第一案就承諾完整智慧大樓。

**NVIDIA 平台依賴是雙面刃。**與 Omniverse 的深度綁定既是壁壘也是風險：若 NVIDIA 改變授權條件、開源策略或產品方向，VisTwin 必須在 ontology 與 USD 介面層保留可遷移性。閉源 ontology + 開放介面策略，本質上就是針對這個風險而設計的對沖。

---

## 維護筆記

### 從 BP v4 對齊的點

- v4 §T.2「Future Potential」段（Isaac Sim / Lab）— 本章將其從 future 提升為 explicit roadmap，但維持 v4「非當前主打」的克制語氣
- v4 §T.3a「同平台不同定位」邏輯 — 延伸至 Physical AI 議題上同樣的差異化論述（不是機器人廠、不是儀表板廠、是建築 Physical AI 部署商）
- v4 §T.3 表格之「Isaac Sim → Future Potential」一列 — 本章對應為 M1-M4 條件式路徑
- v4 §T.4「同業壁壘 / Moat」— 本章補入「建築特化 Physical AI vertical」為新壁壘維度
- v4 §I.1 bridge.ws + §II.2 視覺 AI + §II.3 預測 AI — 本章定位為 Physical AI 三環節中的 sense + reason 已就位部分
- v4 §3 Operate 整章 — 本章的 act 端落點與 §3.1 設備能源、§3.4 welltek 案例構成自然延伸
- v4 §T.4「商務面：為何押寶 Omniverse」— 本章「在 NVIDIA Physical AI 棧的座標」一節為其商業敘事補集

### 新增的點

- Physical AI 三環節（sense / reason / act）的明確定義與 v4 對位
- building intelligence loop 概念
- VisionBase 工設 B 的 KUKA × Grasshopper 經驗作為團隊資產正式入稿
- FDE 模型疊加 Physical AI 階段的單案加值區間（30-50%）
- 三類 profile 累積（Taiwan 建築 Physical AI / WELL / 商辦）作為 deployment-driven moat
- M1-M4 條件式戰略路徑（非時程式）
- 競品對位矩陣中加入 mobile robot 廠商與空間運算平台兩列
- 三大風險（hardware capex / scope explosion / NVIDIA 平台依賴）的明確命名

### 開放問題（5 項，先決定才能補完整章）

> 草稿中以「待決定 #N」標註之處，皆對應以下問題。

1. **M1 第一個 sense+act loop 的具體場景** — 候選包含：立面動態遮陽（單純、視覺化強）、機械停車（既有產業鏈成熟）、訪客動線引導（服務型機器人）、空調分區精控（與 §3.1 直接接軌）、巡檢無人機（與 §3.2 結露黴菌偵測接軌）。是否擇一定錨於 M1？這個選擇會反向決定本章硬體 capex 段落的具體數字與寶舖試點對話的 framing。

2. **KUKA 在寶舖試點的部署形態** — 是真實機械手臂落地（戲劇性高、commissioning 複雜）、還是先以 Isaac Sim 訓練後改用較小規模執行器（風險低、敘事弱）？這個選擇影響「VisionBase 真實機器人經驗」這個資產在投資人敘事中的可信度。

3. **Physical AI deployment 的定價邏輯** — 30-50% 加值區間是否需設下限（建議：M1-M2 階段不低於 +35%，M3 後可依 profile 累積下調至 +30%）？是否需與既有 FDE 報價方式拆分為兩條 SKU（標準 deployment / Physical AI-enabled deployment）？

4. **NVIDIA 對位的時機與條件** — M4 是「主動對接」還是「等對方出現」？接觸對象是 Omniverse BD、AEC vertical lead、還是 NVentures（NVIDIA corporate VC）？是先有 case study published 再接觸，還是 M2 階段就以「proposed vertical case study」名義先建立關係？

5. **與寶舖老董的 framing** — 是用「差異化升級」（全台第一個建築 Physical AI 落地）的高調包裝，承擔升級期望？還是「不增加開發風險」（明確承諾 M1 scope 收斂於單一子系統，且不影響主案交期）的承諾型 framing？這個選擇將直接影響 M1 是否能在寶舖落地。

---

*VisTwin Physical AI 補章 — v0 草稿 — 2026-04-29*
