---
title: Omniverse Web化 評估
tags: [tech, decision, web化]
status: 評估
---

# Omniverse Web化 評估

> 評估日期：2026-04-19 | 評估者：Claude Sonnet 4.6（靜態分析）
> 
> 基於原始碼靜態分析（extension.toml + .py），未做 runtime 驗證。

---

## 執行摘要

**18 個 VisTwin Kit extension**，重新以實際狀態分為五類（T0–T4）：

| 分類 | 數量 | 說明 |
|---|:---:|---|
| **T0 — 核心保留** | 6 | 成熟功能、獨立身份、優先 port |
| **T1 — 合併模組** | 7 | 工作流相連，web 端合併為 5 個 Feature Module |
| **T2 — 已被取代** | 2 | welltek-twin / WebController 已做掉，Kit 端退役 |
| **T3 — 刪除** | 1 | `light.compass`：太陽方位舊插件，複製 sunlight.studio 算法，無獨立價值 |
| **T4 — 存封 stub** | 2 | `moisture.health`（skeleton）、`elements.core`（未整合基建）|

**整併後：18 Kit ext → 7 Web Feature Modules**

```
Dashboard · WindSimModule · SolarAnalysisModule · BIMReviewModule
ConsoleModule · PresentationModule · SafetyMonitor
```

**整併原則**（T0 層）：幾何來源上游整合進 Massing Pipeline；T1 層按工作流三條件合併（同工作流 + 共用資料來源 + 相似 UI 骨架同時成立）。

**關鍵發現**：
1. `warp.windtunnel` solver.py 用 **numpy（CPU）**，不是 Warp GPU——可直接移植 TypeScript RK4
2. `light.compass/solar.py` 完整複製 `sunlight.studio/sun_calculator.py`（太陽方位舊插件，T3 刪除）
3. `moisture.health` docstring 明寫 `Phase 1 (skeleton)`，risk map tab 是 placeholder（T4）
4. `mqtt.bridge` / `osc.controller` 已被 welltek-twin / WebController 取代（T2）

→ 詳細分類依據：[[Omniverse Web化 分類清單]]

---

## Extension 清單總表

| Extension | 功能摘要 | 技術依賴（非 web 部分）| Web 難度 | 工作量 | 整併去向 |
|---|---|---|:---:|:---:|---|
| [[Omniverse Web化/visustwin.ai.oracle\|ai.oracle]] | Claude LLM 建築顧問 + 工具編排 | _INSTANCE pattern 呼叫其他 ext | Medium | M | **T1** → ConsoleModule |
| [[Omniverse Web化/visustwin.bim.inspector\|bim.inspector]] | USD Stage BIM 完整度掃描 + 碰撞偵測 | pxr USD 遍歷 + displayColor 寫入 | Medium | M | **T0** 獨立（幾何簡化 → [[Omniverse Web化/Web化 Massing Pipeline\|Massing Pipeline]]） |
| [[Omniverse Web化/visustwin.camera.travel\|camera.travel]] | USD 攝影機 SLERP 飛行動畫 | UsdGeom.Camera + viewport API | Hard | S/M | **T1** → PresentationModule |
| [[Omniverse Web化/visustwin.dashboard\|dashboard]] | Extension 總覽 / 開關 + theme.py | omni.kit.app ExtensionManager | Easy | S | **T0** → App Shell |
| [[Omniverse Web化/visustwin.dev.repl\|dev.repl]] | File-based Python REPL（開發工具）| Kit Python exec context | Medium | S | **T1** → ConsoleModule（Kit WS Bridge 取代 file IPC） |
| [[Omniverse Web化/visustwin.elements.core\|elements.core]] | 跨插件 Zone 資料 singleton | carb.events pub-sub | Easy | — | **T4** 存封（web 端改 Zustand store，zone registry 幾乎未整合） |
| [[Omniverse Web化/visustwin.esg.tracker\|esg.tracker]] | 具現化碳足跡 + EEWH/LEED 認證 | pxr USD 材質掃描 + 體積計算 | Medium | M | **T1** → BIMReviewModule |
| [[Omniverse Web化/visustwin.exhibition.board\|exhibition.board]] | 第二螢幕展覽看板 + 嵌入 Viewport | omni.kit.viewport（RTX 渲染） | Hard | L | **T1** → PresentationModule（WebRTC） |
| [[Omniverse Web化/visustwin.light.compass\|light.compass]] | 36 方向照度玫瑰圖 + 太陽軌跡弧 | USD 3D prim 動畫 | — | — | **T3 刪除**（複製 sunlight.studio 太陽位置算法，3D 裝飾無獨立價值） |
| [[Omniverse Web化/visustwin.moisture.health\|moisture.health]] | PMV/PPD 熱舒適 + 材質濕度風險 | 無（純 Python math） | Easy | — | **T4** 存封（skeleton，risk map 是 placeholder，docstring 明寫 Phase 1） |
| [[Omniverse Web化/visustwin.mqtt.bridge\|mqtt.bridge]] | Welltek WebSocket → Carb event bus | websocket-client（非 Kit-specific）| Easy | **0** | **T2** ✅ welltek-twin 已取代，退役 |
| [[Omniverse Web化/visustwin.osc.controller\|osc.controller]] | OSC UDP → USD scene 動作分發 | pxr USD 操作 + omni.timeline | Easy | **0** | **T2** ✅ WebController 已取代，退役 |
| [[Omniverse Web化/visustwin.solar.heatmap\|solar.heatmap]] | 3 棟×N 層×4 戶太陽得熱計算 | carb.settings + USD scene 熱圖 | Easy/Med | M | **T0** 獨立（demo_preset → [[Omniverse Web化/Web化 Massing Pipeline\|Massing Pipeline]]） |
| [[Omniverse Web化/visustwin.solar.report\|solar.report]] | 5 張 matplotlib 圖表 + CSV/JSON 匯出 | matplotlib（非 Kit-specific）| Easy | M | **T1** → SolarAnalysisModule |
| [[Omniverse Web化/visustwin.sunlight.studio\|sunlight.studio]] | NOAA 太陽位置 + UsdLux 場景照明 | UsdLux.DistantLight + RTX | Medium | S | **T0** 獨立（提供太陽位置；sunlight 算法是唯一正確來源） |
| [[Omniverse Web化/visustwin.vision.detector\|vision.detector]] | YOLO WS client + Viewport 偵測 overlay | omni.ui overlay | Medium | M | **T0** → SafetyMonitor（程式碼完整，待攝影機設定） |
| [[Omniverse Web化/visustwin.warp.windtunnel\|warp.windtunnel]] | 位勢流風場（**numpy**）+ 3D 粒子 | USD BasisCurves + Warp dep | Medium | L | **T0** 獨立（PRESETS dict → [[Omniverse Web化/Web化 Massing Pipeline\|Massing Pipeline]]） |
| [[Omniverse Web化/visustwin.wind.analysis\|wind.analysis]] | 風場報告 + Davenport 舒適度評估 | 依賴 windtunnel solver | Easy | M | **T1** → WindSimModule |

---

## 五類分級（T0–T4）

> 完整分級依據、LoC、git 歷史、stub 標記見 [[Omniverse Web化 分類清單]]

```
T0 核心保留 (6)
  dashboard · warp.windtunnel · solar.heatmap · sunlight.studio
  bim.inspector · vision.detector

T1 合併 (7) → 5 個 Feature Module
  wind.analysis ─────────────▶ WindSimModule     (+ windtunnel T0)
  solar.report ──────────────▶ SolarAnalysisModule (+ heatmap+sunlight T0)
  esg.tracker ───────────────▶ BIMReviewModule   (+ bim.inspector T0)
  ai.oracle + dev.repl ──────▶ ConsoleModule
  camera.travel + exhibition ▶ PresentationModule

T2 退役 (2)
  mqtt.bridge ───────────────▶ ✅ welltek-twin 已做
  osc.controller ────────────▶ ✅ WebController 已做

T3 刪除 (1)
  light.compass ─────────────▶ 🗑 太陽方位舊插件，複製 sunlight.studio 算法

T4 存封 (2)
  moisture.health ───────────▶ 📦 Phase 1 skeleton，risk map 為 placeholder
  elements.core ─────────────▶ 📦 zone registry 未整合，web 端 Zustand 取代
```

## 整併矩陣

```
Kit Extensions (18)              Web 輸出
──────────────────────────────────────────────────────────────────

【Phase 0 清理 — 不帶進 web】
light.compass ──────────────────▶ 🗑 刪除（T3）
mqtt.bridge ────────────────────▶ 🔕 退役（T2，welltek-twin）
osc.controller ─────────────────▶ 🔕 退役（T2，WebController）
moisture.health ────────────────▶ 📦 存封（T4，skeleton）
elements.core ──────────────────▶ 📦 存封（T4，→ Zustand）

【Massing Pipeline 基礎層】
demo_preset.py (solar.heatmap) ┐
PRESETS dict (windtunnel)      ├──▶ Massing Pipeline
bim 幾何簡化 (bim.inspector)   ┘    (testPresetAdapter + bimAdapter)
                                    ↓ 統一 BuildingMass[] 給所有下游

【7 Web Feature Modules】
dashboard ──────────────────────▶ 1. Dashboard（App Shell + routing）
warp.windtunnel + wind.analysis ▶ 2. WindSimModule
solar.heatmap + sunlight.studio ┐
+ solar.report                  ├──▶ 3. SolarAnalysisModule
bim.inspector + esg.tracker ────▶ 4. BIMReviewModule
ai.oracle + dev.repl ───────────▶ 5. ConsoleModule（Kit WS Bridge）
camera.travel + exhibition.board▶ 6. PresentationModule（WebRTC opt.）
vision.detector ────────────────▶ 7. SafetyMonitor
```

---

## 架構建議

### Kit 端保留職責

```
Omniverse Kit（保留）
├── RTX 渲染 + USD Stage（唯一事實來源）
├── 場景控制執行器（USD 操作 / camera fly / lighting）
├── visustwin.ws.bridge（新 extension，暴露 WebSocket RPC API）
│   └── 接收 web 指令 → 轉發到 Kit Python 函式
└── 現有 extensions（降級為 headless 服務，可去除 omni.ui window）
```

### Web 端負責

```
Web（新 / 現有資產）
├── UI 控制（所有輸入 / 設定 / 參數調整）
├── 純計算邏輯（solar / wind / PMV / carbon，移植 TypeScript）
├── 報告輸出（圖表 / CSV / PDF，Recharts / Plotly / jsPDF）
├── IoT 數據顯示（MQTT / Vision WebSocket 直連）
└── AI 問答（Claude API 直連，tool calls 透過 ws.bridge）
```

### 現有 web 資產關係

| Web 資產 | 現有功能 | Web 化後新增 |
|---|---|---|
| `visustwin-showcase` | DNA 展示、Life cycle slider | AIOracleModule（drawer）、BIM 輕量版 |
| `WebController` | OSC 控制（攝影機/場景/照明）| 不需新增（已完整） |
| `welltek-twin` | MQTT IoT 數據展示 | DataConnectionModule status、moisture PMV 計算 |
| 新建 `visustwin-studio` | — | 主工具 app（方案 B）|

---

## 整備 Roadmap

### Phase 0（清理優先）：T2 退役 + T3 刪除 + T4 存封

| 任務 | 對象 | 行動 |
|---|---|---|
| T3 刪除 | `light.compass` | 從 `visustwin-extensions/exts/` 移除；確認 `sunlight.studio/sun_calculator.py` 已含所有計算 |
| T2 退役 | `mqtt.bridge` | 在 extension.toml 加 `[deprecation]`；kit apps cfg 移除載入 |
| T2 退役 | `osc.controller` | 同上；確認 WebController 完整覆蓋所有 OSC route |
| T4 存封 | `moisture.health` | 備份 `comfort.py`（PMV 計算）→ 抽出進 SolarAnalysisModule 熱舒適分頁 |
| T4 存封 | `elements.core` | 不 port，ZoneRegistry 概念改寫為 `zoneStore.ts` |

### Phase 1（0-4 週）：計算核心 + Massing Pipeline 基礎

目標：移植計算邏輯 + 建立 Massing Pipeline，消除 `demo_preset.py` / `PRESETS` 重複。

| 任務 | 工作量 | 輸出 |
|---|---|---|
| 移植 `demo_preset.py` → `testPresetAdapter.ts` | S | 統一 BuildingMass[]，消除重複 |
| 建立 `massingStore.ts`（Zustand）| S | 下游模組統一讀取點 |
| 移植 `sun_calculator.py` → `solarCalc.ts` | S | TypeScript NOAA 演算法，單元測試 |
| 移植 `gain_calculator.py` → `solarGain.ts` | S | 每戶太陽得熱計算 |
| 移植 `solver.py`（numpy flow）→ `windSolver.ts` | M | 位勢流求解器（RK4） |
| 移植 `comfort.py` → `pmvCalc.ts` | S | PMV/PPD 計算器 |
| 移植 `carbon.py` → `carbonCalc.ts` | S | 碳排計算 + 材質資料庫 JSON |
| 建立 `zoneStore.ts`（Zustand）| S | 跨 module zone 數據共享 |
| **合計** | **M** | 可獨立測試的計算核心 + Massing Pipeline |

### Phase 2（4-8 週）：獨立下游 Module UI 建構

目標：在選定架構上建立各下游模組（全部獨立，不合併）。

| 任務 | 工作量 | 輸出 |
|---|---|---|
| App Shell（Sidebar + routing）| S | 框架骨架 |
| Solar Heatmap module（讀 massingStore）| M | React UI + solarGain + Recharts |
| CFD WindTunnel module（讀 massingStore）| M | React UI + windSolver + 2D 風場圖 |
| PMV Comfort module（讀 zoneStore + MQTT）| S | React UI + pmvCalc + welltek WS |
| BIM Inspector module UI（read-only）| M | React table（無 Kit 連線時 demo 數據）|
| **合計** | **L** | 可展示的前端（靜態數據） |

### Phase 3（8-16 週）：Kit Bridge + 即時連線

目標：建立 Kit WS Bridge，讓 web 端真正連線到 Kit 執行場景操作。

| 任務 | 工作量 | 輸出 |
|---|---|---|
| `visustwin.ws.bridge` Kit extension | M | WebSocket RPC server |
| AIOracleModule（web 版 chat UI）| M | Claude API + tool calls via bridge |
| SafetyModule（Vision WS overlay）| M | Canvas bounding box overlay |
| PresentationModule（camera control）| S | 攝影機切換按鈕 |
| exhibition.board WebRTC（可選）| L | RTX 串流接收（需 NVIDIA Streaming SDK）|
| **合計** | **XL** | 完整 web 化平台 |

---

## 待決策點（需使用者拍板）

1. **架構選擇**：方案 A（extend showcase）vs 方案 B（visustwin-studio）vs 方案 C（islands）
   - 影響：repo 數量、部署策略、對外展示 URL
   
2. **RTX Viewport 策略**：exhibition.board 的 3D 視覺要用 WebRTC 串流 or 捨棄改 Three.js
   - 影響：畫質水準、NVIDIA Streaming SDK 費用/複雜度
   
3. **Kit WS Bridge 時程**：Phase 3 的 bridge 要在 Phase 1 就規劃 API，還是等 Phase 2 UI 穩定後再定
   - 影響：前端 mock 數據 vs 真實連線的開發節奏
   
4. **風場 3D 視覺化層次**：warp.windtunnel 的 web 版要做 Three.js 3D（L 工作量）或先 2D 俯視（S）
   - 影響：視覺衝擊力 vs 開發速度
   
5. **AI Oracle 工具呼叫範圍**：web 化後哪些 tool 透過 Kit bridge 執行，哪些純 client-side
   - 影響：需要 Kit 連線才能用 vs 離線可用
   
6. **visustwin.dev.repl 升級**：是否把 file IPC 升級為 WebSocket RPC（讓 Claude API cloud agent 可操作 Kit）
   - 影響：AI agent 自動化能力

---

## 子文件目錄（Omniverse Web化/ 資料夾）

### Extension 細節卡（18 份）

- [[Omniverse Web化/visustwin.ai.oracle|AI Oracle]] — LLM 工具編排，Medium，M
- [[Omniverse Web化/visustwin.bim.inspector|BIM Inspector]] — USD 掃描，Medium，M
- [[Omniverse Web化/visustwin.camera.travel|Camera Travel]] — USD 攝影機飛行，Hard，S
- [[Omniverse Web化/visustwin.dashboard|Dashboard]] — Extension 控制面板，Easy，S
- [[Omniverse Web化/visustwin.dev.repl|Dev REPL]] — Kit Python REPL，**Impossible**，—
- [[Omniverse Web化/visustwin.elements.core|Elements Core]] — Zone 資料 singleton，Easy，S
- [[Omniverse Web化/visustwin.esg.tracker|ESG Tracker]] — 碳足跡計算，Medium，M
- [[Omniverse Web化/visustwin.exhibition.board|Exhibition Board]] — RTX 第二螢幕，**Hard**，L
- [[Omniverse Web化/visustwin.light.compass|Light Compass]] — 照度玫瑰圖，Medium，S
- [[Omniverse Web化/visustwin.moisture.health|Moisture & Health]] — PMV 舒適度，Easy，S
- [[Omniverse Web化/visustwin.mqtt.bridge|MQTT Bridge]] — WS 橋接，Easy，**0**（已被取代）
- [[Omniverse Web化/visustwin.osc.controller|OSC Controller]] — UDP 場景控制，Easy，**0**（已被取代）
- [[Omniverse Web化/visustwin.solar.heatmap|Solar Heatmap]] — 每戶得熱，Easy/Med，M
- [[Omniverse Web化/visustwin.solar.report|Solar Report]] — matplotlib 報告，Easy，M
- [[Omniverse Web化/visustwin.sunlight.studio|Sunlight Studio]] — NOAA 太陽位置，Medium，S
- [[Omniverse Web化/visustwin.vision.detector|Vision Detector]] — YOLO WS client，Medium，M
- [[Omniverse Web化/visustwin.warp.windtunnel|Warp WindTunnel]] — numpy 風場，Medium，L
- [[Omniverse Web化/visustwin.wind.analysis|Wind Analysis]] — 風場報告，Easy，M

### 規劃文件（4 份）

- [[Omniverse Web化 分類清單]] — **T0-T4 五類分級**：LoC、git 歷史、stub 標記、歸類理由（本次新增）
- [[Omniverse Web化/Web化 整併提案|整併提案]] — T1 五個 Feature Module 合併提案（WindSim/Solar/BIM/Console/Presentation）
- [[Omniverse Web化/Web化 架構選項|架構選項]] — 方案 A/B/C 比較 + 推薦
- [[Omniverse Web化/Web化 Massing Pipeline|Massing Pipeline]] — 上游共用幾何層設計：adapter 介面、輸出 schema、下游消費方式
