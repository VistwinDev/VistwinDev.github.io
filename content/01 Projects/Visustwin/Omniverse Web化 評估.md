# Omniverse Web化 評估

> 評估日期：2026-04-19 | 評估者：Claude Sonnet 4.6（靜態分析）
> 
> 基於原始碼靜態分析（extension.toml + .py），未做 runtime 驗證。

---

## 執行摘要

**18 個 Visustwin Kit extension** 可分為三類：
- **Already Done（已被現有 web 資產取代）**：2 個（mqtt.bridge → welltek-twin，osc.controller → WebController）
- **Easy/Medium（純計算 / 純 UI，無 Kit runtime 依賴）**：9 個（可直接移植 TypeScript + React）
- **Hard（依賴 USD Stage 寫入 / RTX Viewport / GPU）**：7 個（需 Kit 保留或 WebRTC 橋接）

整併後：**整併只發生在上游（幾何來源）層**，下游模擬模組全部維持獨立。核心輸出為 1 個 Massing Pipeline 基礎層 + 13 個獨立下游 module。

**整併核心原則**（2026-04-19 更新）：
> 只在**上游共用幾何來源**那一層做整併（`demo_preset.py` + BIM 簡化 + geometry cache）；
> 下游 CFD / 熱力圖 / 日照 / PMV / 碳排 / BIM Inspector 各自**獨立**，原因：solver 本質不同、UI 需求不同、iterate 週期不同。

**最大驚喜發現**：
1. `visustwin.warp.windtunnel` 的 solver.py 使用 **numpy（CPU）**，不是 Warp GPU——風場計算可直接移植 TypeScript
2. 所有「純計算」模組（PMV、太陽位置、碳排、照射度）加起來約 **1500 LoC Python**，可在 1 週內全部移植 TypeScript
3. `visustwin.mqtt.bridge` 和 `visustwin.osc.controller` 幾乎**已被現有 web 資產完全取代**
4. `solar.heatmap/demo_preset.py` 和 `windtunnel/solver.py PRESETS` 重複定義相同建築配置（連原始碼都有 `!! KEEP IN SYNC !!` 警告）——這是 **Massing Pipeline 的明確需求**

---

## Extension 清單總表

| Extension | 功能摘要 | 技術依賴（非 web 部分）| Web 難度 | 工作量 | 整併去向 |
|---|---|---|:---:|:---:|---|
| [[Omniverse Web化/visustwin.ai.oracle\|ai.oracle]] | Claude LLM 建築顧問 + 工具編排 | _INSTANCE pattern 呼叫其他 ext | Medium | M | AIOracleModule |
| [[Omniverse Web化/visustwin.bim.inspector\|bim.inspector]] | USD Stage BIM 完整度掃描 + 碰撞偵測 | pxr USD 遍歷 + displayColor 寫入 | Medium | M | 獨立 module（幾何簡化 → [[Omniverse Web化/Web化 Massing Pipeline\|Massing Pipeline]]） |
| [[Omniverse Web化/visustwin.camera.travel\|camera.travel]] | USD 攝影機 SLERP 飛行動畫 | UsdGeom.Camera + viewport API | Hard | S/M | PresentationModule |
| [[Omniverse Web化/visustwin.dashboard\|dashboard]] | Extension 總覽 / 開關 + theme.py | omni.kit.app ExtensionManager | Easy | S | → App Shell |
| [[Omniverse Web化/visustwin.dev.repl\|dev.repl]] | File-based Python REPL（開發工具）| Kit Python exec context | Impossible | — | Kit-only（不移植） |
| [[Omniverse Web化/visustwin.elements.core\|elements.core]] | 跨插件 Zone 資料 singleton | carb.events pub-sub | Easy | S | → Zustand store lib |
| [[Omniverse Web化/visustwin.esg.tracker\|esg.tracker]] | 具現化碳足跡 + EEWH/LEED 認證 | pxr USD 材質掃描 + 體積計算 | Medium | M | 獨立 module（下游，吃 Massing Pipeline 材質 tag） |
| [[Omniverse Web化/visustwin.exhibition.board\|exhibition.board]] | 第二螢幕展覽看板 + 嵌入 Viewport | omni.kit.viewport（RTX 渲染） | Hard | L | PresentationModule（WebRTC） |
| [[Omniverse Web化/visustwin.light.compass\|light.compass]] | 36 方向照度玫瑰圖 + 太陽軌跡弧 | USD 3D prim 動畫 | Medium | S | 獨立 module（下游） |
| [[Omniverse Web化/visustwin.moisture.health\|moisture.health]] | PMV/PPD 熱舒適 + 材質濕度風險 | 無（純 Python math） | Easy | S | 獨立 module（下游） |
| [[Omniverse Web化/visustwin.mqtt.bridge\|mqtt.bridge]] | Welltek WebSocket → Carb event bus | websocket-client（非 Kit-specific）| Easy | **0** | ✅ welltek-twin 已取代 |
| [[Omniverse Web化/visustwin.osc.controller\|osc.controller]] | OSC UDP → USD scene 動作分發 | pxr USD 操作 + omni.timeline | Easy | **0** | ✅ WebController 已取代 |
| [[Omniverse Web化/visustwin.solar.heatmap\|solar.heatmap]] | 3 棟×N 層×4 戶太陽得熱計算 | carb.settings + USD scene 熱圖 | Easy/Med | M | 獨立 module（demo_preset → [[Omniverse Web化/Web化 Massing Pipeline\|Massing Pipeline]]） |
| [[Omniverse Web化/visustwin.solar.report\|solar.report]] | 5 張 matplotlib 圖表 + CSV/JSON 匯出 | matplotlib（非 Kit-specific）| Easy | M | 獨立 module（下游） |
| [[Omniverse Web化/visustwin.sunlight.studio\|sunlight.studio]] | NOAA 太陽位置 + UsdLux 場景照明 | UsdLux.DistantLight + RTX | Medium | S | 獨立 module（下游，提供太陽位置給其他模組） |
| [[Omniverse Web化/visustwin.vision.detector\|vision.detector]] | YOLO WS client + Viewport 偵測 overlay | omni.ui overlay | Medium | M | SafetyModule |
| [[Omniverse Web化/visustwin.warp.windtunnel\|warp.windtunnel]] | 位勢流風場（**numpy**）+ 3D 粒子 | USD BasisCurves + Warp dep | Medium | L | 獨立 module（PRESETS dict → [[Omniverse Web化/Web化 Massing Pipeline\|Massing Pipeline]]） |
| [[Omniverse Web化/visustwin.wind.analysis\|wind.analysis]] | 風場報告 + Davenport 舒適度評估 | 依賴 windtunnel solver | Easy | M | 獨立 module（下游） |

---

## 整併矩陣

> **核心原則：整併只發生在上游（幾何來源）；下游模擬模組全部獨立**

```
Kit Extensions (18)              Web 輸出
──────────────────────────────────────────────────────────────────

【上游整併 — Massing Pipeline 基礎層】
demo_preset.py (solar.heatmap) ┐
PRESETS dict (windtunnel)      ├──▶ Massing Pipeline
bim 幾何簡化 (bim.inspector)   ┘    (test-preset adapter + bim-adapter)
                                    ↓ 統一 BuildingMass[] 輸出給所有下游

【App Shell】
dashboard ──────────────────────▶ App Shell（路由 + 導覽）
theme.py ───────────────────────▶ (CSS Variables / Tailwind token)
elements.core ──────────────────▶ lib/zoneStore.ts（共用 state）

【下游獨立模組 — 全部保持獨立】
warp.windtunnel ────────────────▶ CFD WindTunnel（讀 massingStore）
wind.analysis ──────────────────▶ Wind Analysis（讀 massingStore）
solar.heatmap ──────────────────▶ Solar Heatmap（讀 massingStore）
solar.report ───────────────────▶ Solar Report（讀 massingStore）
sunlight.studio ────────────────▶ Sunlight Studio（提供太陽位置）
light.compass ──────────────────▶ Light Compass（讀 sunlight + MQTT）
moisture.health ────────────────▶ PMV Comfort（讀 zoneStore + MQTT）
bim.inspector ──────────────────▶ BIM Inspector（viewer，掃描→JSON）
esg.tracker ────────────────────▶ Carbon Tracker（讀 massingStore）
vision.detector ────────────────▶ Safety Monitor
ai.oracle ──────────────────────▶ AI Oracle（tool calls via bridge）
camera.travel ──────────────────▶ Camera Control
exhibition.board ───────────────▶ Exhibition Board（WebRTC）

【已被現有資產取代】
mqtt.bridge ────────────────────▶ ✅ welltek-twin（已做）
osc.controller ─────────────────▶ ✅ WebController（已做）

【不移植】
dev.repl ───────────────────────▶ Kit-only 開發工具
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

### 規劃文件（3 份）

- [[Omniverse Web化/Web化 整併提案|整併提案]] — Massing Pipeline + 獨立下游 module 結構（已修正）
- [[Omniverse Web化/Web化 架構選項|架構選項]] — 方案 A/B/C 比較 + 推薦
- [[Omniverse Web化/Web化 Massing Pipeline|Massing Pipeline]] — 上游共用幾何層設計：adapter 介面、輸出 schema、下游消費方式
