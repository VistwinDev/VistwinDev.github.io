# Web化 整併提案

> **修正版（2026-04-19）**：整併只在**上游（幾何來源）**發生；下游模擬模組全部獨立。
> 
> 原版把 8 個環境分析 extension 合併成 1 個 EnvAnalysisModule（4 tabs）—— 此設計已撤回。

---

## 整併邏輯基礎（修正後）

**唯一的整併發生在幾何來源這一層**：

```
demo_preset.py (solar.heatmap)  ┐
PRESETS dict   (windtunnel)     ├──▶ Massing Pipeline  ←── 唯一真正整併的地方
bim 幾何簡化   (bim.inspector)  ┘

其他一切保持獨立。
```

**下游模擬模組不合併的理由**：
1. Solver 本質不同（流體 vs 熱插值 vs 輻射 vs 人體舒適度）— 合併等於萬能糊
2. UI 需求不同（CFD 要時間軸+向量層，熱力圖要 colormap legend，PMV 要儀錶板）
3. 各自 iterate 週期不同，模組間故障不應互相傳染

---

## Module 1：App Shell（原 dashboard）

### 對應 Kit extensions
- `visustwin.dashboard`（+ `theme.py`）

### 職責
Web app 的導覽框架、feature module on/off、全局設定。不是一個「功能」，是整個 web app 的骨架。

### ASCII Wireframe

```
╔══════════════════════════════════════════════════════╗
║  VISUSTWIN                           ● ● ●            ║  ← 頂部 nav bar
╠══════════╦═══════════════════════════════════════════╣
║          ║                                           ║
║ AIR      ║                                           ║
║ ● WindTunnel  ║         Main Panel                   ║
║ ● WindAnalysis║         (路由內容)                    ║
║          ║                                           ║
║ SUN      ║                                           ║
║ ● Solar  ║                                           ║
║ ● Sunlight    ║                                       ║
║          ║                                           ║
║ AI       ║                                           ║
║ ● Oracle ║                                           ║
║          ║                                           ║
║ SAFETY   ║                                           ║
║ ● Vision ║                                           ║
╚══════════╩═══════════════════════════════════════════╝
```

### 整併前後
| 前（Kit）| 後（Web） |
|---|---|
| 1 個 window（17 個 card） | Left sidebar + top nav + React Router |
| enable/disable extension | 路由 on/off toggle（或直接路由切換） |
| theme.py | CSS Variables / Tailwind token |

---

## Module 2：Massing Pipeline（上游幾何基礎層）⭐ 新增

### 職責
建立統一的建築量體輸出，讓所有下游模擬模組讀取同一份幾何數據。詳細設計見 [[Web化 Massing Pipeline]]。

### 對應 Kit 原始碼（整併進來的部分）
- `solar.heatmap/demo_preset.py`（SMALL/MEDIUM/LARGE 建築配置）
- `windtunnel/solver.py` 的 PRESETS dict（相同資料，`!! KEEP IN SYNC !!` 警告）
- `bim.inspector/scanner.py` 的幾何簡化邏輯（bim-adapter）

### ASCII Wireframe

```
╔══════════════════════════════════════════════════════╗
║ MASSING PIPELINE                                     ║
╠══════════════════════════════════════════════════════╣
║  Source: [● 測試量體] [● BIM 匯入] [○ 手動]          ║
╠══════════════════════════════════════════════════════╣
║  Preset: [SMALL 小宅] [● MEDIUM 住宅] [LARGE 高層]   ║
╠══════════════════════════════════════════════════════╣
║  Tower_A  cx:-1000  cy:-120  wx:1500  hz:4800  15F   ║
║  Tower_B  cx:-800   cy:1130  wx:1200  hz:4300  14F   ║
║  Tower_C  cx:1800   cy:-1020 wx:1400  hz:4500  15F   ║
╠══════════════════════════════════════════════════════╣
║  [更新量體]  ← 觸發所有下游模組重算                  ║
╚══════════════════════════════════════════════════════╝
```

### 整併說明
| 前（Kit）| 後（Web）|
|---|---|
| demo_preset.py（solar.heatmap 私有）| testPresetAdapter.ts（共用）|
| PRESETS dict（windtunnel 私有）| 消除重複，統一讀 massingStore |
| bim 幾何簡化（bim.inspector 內部）| bimAdapter.ts（可重用介面）|

---

## Module 3：下游模組合併（工作流判準）

> 判準：同時滿足 ① 同一個工作流連續執行、② 資料源相同或 A 的輸出即 B 的輸入、③ UI 骨架相似（同一種互動 pattern）

---

### 3a. WindSimModule（風模擬）

**合併：warp.windtunnel + wind.analysis**

**三條判準**：

| 判準 | 說明 |
|---|---|
| ① 同一工作流 | 設定建築/風向/擾流 → 跑求解器 → 看流線 3D → 看 Davenport 報告 → 匯出。用戶不會在「跑完 sim」之後去別處打開報告視窗 |
| ② 資料源 | `wind.analysis` 直接 import `windtunnel.solver` 的 `sample_velocity_grid()` / `sample_velocity_section()`，輸入就是上個步驟的輸出 |
| ③ UI 骨架 | 兩者都是「參數控制面板 → 模擬輸出視覺化」，互動 pattern 完全相同 |

**合併後 UI**：

```
╔══════════════════════════════════════════════════════╗
║ WIND SIM   [Setup] [Run] [3D Result] [Report] [Export]║  ← tabs
╠══════════════════════════════════════════════════════╣
║  [Setup tab]                  [Run tab]              ║
║  Preset: SMALL MEDIUM LARGE   Turbulence: ████ 0.3   ║
║  Wind Dir: ████ 270°          Vortex: ████ 1.2       ║
║  Bldg: ✓ Tower_A ✓ Tower_B   Noise Scale: ████ 0.4  ║
║  ────────────────────         ──────────────────      ║
║  [3D Result tab]              [Report tab]           ║
║  [Three.js 流線圖]            [Davenport 等級地圖]   ║
║  ← 風向 / 速度 / 透明度       [速度放大倍率圖]       ║
║                               [行人舒適度清單]       ║
║  [Export tab]                                        ║
║  [Download JSON] [Download CSV] [Download PNG]       ║
╚══════════════════════════════════════════════════════╝
```

**共用 state**：`windSimStore`（求解器參數 + 上次求解結果 velocityGrid + streamlines）

**Before → After**：2 個 Kit window（`warp.windtunnel` + `wind.analysis`）→ 1 個 WindSimModule

---

### 3b. SolarAnalysisModule（日照熱能分析）

**合併：sunlight.studio + solar.heatmap + solar.report + moisture.health + light.compass**

**三條判準**：

| 判準 | 說明 |
|---|---|
| ① 同一工作流 | 設定日期/城市/時間（sunlight）→ 看每戶得熱（heatmap）→ 看照度方位分佈（compass）→ 檢查熱舒適（PMV）→ 產報告（report）→ 匯出。整個「建築日照評估」工作流 |
| ② 資料源 | sunlight.studio 寫入 `carb.settings`；solar.heatmap、light.compass、moisture.health 全部從同一份設定讀太陽位置；solar.report 直接呼叫 solar.heatmap 的 `calc_facade_gain`；moisture.health 讀 zone 的 solar_gain_w（由 solar.heatmap 寫入）|
| ③ UI 骨架 | 全部都是「設定參數 → 視覺化結果 → 可匯出數據」的 dashboard-viewer pattern |

**合併後 UI**：

```
╔══════════════════════════════════════════════════════╗
║ SOLAR ANALYSIS  [設定] [得熱] [照度] [熱舒適] [報告] ║  ← tabs
╠══════════════════════════════════════════════════════╣
║  [設定 tab]                   [得熱 tab]             ║
║  城市: [台北 ▼]               [樓層熱圖 Grid]        ║
║  日期: 2026-06-21             NE  SE  SW  NW         ║
║  時間: ████──────── 12:00     F15 ▓▓▓▓ ████ ░░░░    ║
║  玻璃率: ████ 60%             [棒狀圖排名 Recharts]  ║
║  ──────────────────           ─────────────────────  ║
║  [照度 tab]                   [熱舒適 tab]           ║
║  [Polar Rose Chart D3]        PMV: -0.3  PPD: 7%    ║
║  36 方位照度分佈              ████ 舒適              ║
║  MQTT 疊加: CAM_ENV_01        Humidity Risk: Low     ║
║                               [各房間 PMV 表格]      ║
║  [報告 tab]                                          ║
║  [地面熱輻射圖] [陰影小時數] [每戶得熱 3D]           ║
║  [Download JSON/CSV/PDF]                             ║
╚══════════════════════════════════════════════════════╝
```

**共用 state**：`sunlightStore`（太陽位置） + `solarGainStore`（per-unit 得熱結果）

**注意**：moisture.health 有 MQTT 即時數據，UI 中的「熱舒適」tab 會同時顯示模擬值和真實感測器讀數。

**Before → After**：5 個 Kit window → 1 個 SolarAnalysisModule

---

### 3c. BIMReviewModule（BIM 審查）

**合併：bim.inspector + esg.tracker**

**三條判準**：

| 判準 | 說明 |
|---|---|
| ① 同一工作流 | BIM 品質掃描 → 材質分類 → 計算碳排 → EEWH/LEED 認證評分 → 生成永續報告。這是一條完整的「建築品質 + 永續性審查」流程，建築師不會分兩次做 |
| ② 資料源 | esg.tracker 的碳排計算需要讀取 bim.inspector 掃描出的材質 + 體積數據（`scan_stage()` 的輸出 → carbon 計算的輸入）。`bim-adapter` 提供的材質 tag 兩者都用 |
| ③ UI 骨架 | 都是「掃描結果 → 表格列表 → 匯出報告」的 viewer pattern。一個列構件品質，一個列碳排量，形式完全一致 |

**合併後 UI**：

```
╔══════════════════════════════════════════════════════╗
║ BIM REVIEW   [BIM 完整度] [碳足跡] [EEWH 認證] [匯出]║  ← tabs
╠══════════════════════════════════════════════════════╣
║  [BIM 完整度 tab]                                    ║
║  [掃描 → Kit WS bridge]  掃描中... / 127 prims       ║
║  ● GREEN: 89   ● YELLOW: 28   ● RED: 10  碰撞: 3    ║
║  ┌──────────────────────────────────────────────┐   ║
║  │ PATH              GRADE  MISSING    LOD       │   ║
║  │ /World/Struct/C1  🔴RED  material   LOD_100   │   ║
║  └──────────────────────────────────────────────┘   ║
║  ─────────────────────────────────────────────────   ║
║  [碳足跡 tab]                                        ║
║  Total: 2,847 kgCO2eq     鋼筋混凝土: 68%           ║
║  [棒狀圖：材質別碳排 Recharts]                       ║
║  ─────────────────────────────────────────────────   ║
║  [EEWH 認證 tab]                                     ║
║  門檻: 銅級 1,200 kgCO2/m² ── 現況: 987 ✓ 通過      ║
║  [匯出 tab]  [BIM CSV] [Carbon CSV] [EEWH PDF]       ║
╚══════════════════════════════════════════════════════╝
```

**共用 state**：一次掃描 → `bimScanStore`（PrimRecord[]）→ BIM tab 和 ESG tab 都讀這份

**Before → After**：2 個 Kit window → 1 個 BIMReviewModule

---

### 3d. ConsoleModule（開發/AI 控制台）

**合併：ai.oracle + dev.repl**

**三條判準**：

| 判準 | 說明 |
|---|---|
| ① 同一工作流 | Ask AI → AI 給建議要驗證 → 切到 Run Code 執行 Kit Python → 看結果 → 回 Ask AI。開發者和進階用戶在 debug / 探索 Kit 狀態時，這兩個模式是來回切換的 |
| ② 資料源 | 兩者都操作 Kit 內部狀態：Oracle 透過 tool_registry 呼叫 Kit 函式；dev.repl 直接執行 Kit Python。「問 AI → 拿到建議 → 用 REPL 驗證」是同一個 Kit state 的探索迴圈 |
| ③ UI 骨架 | 同樣的核心互動 pattern：文字輸入框、送出、輸出/歷史顯示。差別只是 Chat bubble style vs Code block style，骨架完全相同 |

**合併後 UI**：

```
╔════════════════════════════════════════════════╗
║  ◉  VISUSTWIN CONSOLE   [Ask AI] [Run Code]   ║  ← mode toggle
╠════════════════════════════════════════════════╣
║  [Ask AI mode]              [Run Code mode]   ║
║  ┌────────────────────┐     ┌───────────────┐ ║
║  │ [動態球 animation] │     │ cmd.py        │ ║
║  └────────────────────┘     │               │ ║
║                              │ stage = omni  │ ║
║  > 幫我分析碳足跡            │   .usd.get_  │ ║
║                              │   context()  │ ║
║  我已掃描 127 個構件...      │   .get_stage │ ║
║  總碳量：2,847 kgCO2eq      │ ()           │ ║
║                              └───────────────┘ ║
║                              ┌───────────────┐ ║
║                              │ result.txt    │ ║
║                              │ [OK] 0.03s    │ ║
║                              │ <Stage prim>  │ ║
║                              └───────────────┘ ║
╠════════════════════════════════════════════════╣
║  [輸入框 / code editor]          [送出 / Run]  ║
╚════════════════════════════════════════════════╝
```

**重要轉變**：`dev.repl` 原本標記為「Web 化 Impossible」（依賴 Kit file IPC）。
合併入 ConsoleModule 後，「Run Code」mode 改用 **Kit WS Bridge** 執行 Python（我們本來就要建這個），讓 dev.repl 從 Impossible **變成 Medium**。

**共用 state**：`consoleHistoryStore`（訊息/指令/結果歷史）、共用 keybindings（Enter 送出等）

**Before → After**：1 個 Kit window（oracle）+ 1 個 file IPC（repl）→ 1 個 ConsoleModule

---

### 3e. PresentationModule（展覽控制）

**合併：camera.travel + exhibition.board**

**三條判準**：

| 判準 | 說明 |
|---|---|
| ① 同一工作流 | 選攝影機 → 觸發飛行 → 看第二螢幕效果 → 調整。用戶在準備展覽/展示時，必然同時需要攝影機控制和第二螢幕 |
| ② 資料源 | exhibition.board 原本就有自己的攝影機選擇下拉（與 camera.travel 重複！）。兩者都從 USD Stage 讀取 `/World/Cameras/*` ，且都透過 Kit WS bridge 觸發 fly to |
| ③ UI 骨架 | 都是「控制面板 → 觸發 Kit 動作 → 即時看回饋」的 control panel pattern |

**合併後 UI**：

```
╔══════════════════════════════════════════════════════╗
║ PRESENTATION   [攝影機] [場景] [第二螢幕]            ║  ← tabs
╠══════════════════════════════════════════════════════╣
║  [攝影機 tab]                                        ║
║  [Lobby] [Living] [Kitchen] [Master]  ← camera btns  ║
║  [+ 自動巡遊序列]                                    ║
║  ─────────────────────────────────────────────────   ║
║  [場景 tab]                                          ║
║  照明: ████────────────── 0=日 / 100=夜              ║
║  房間: [Living ●] [Kitchen ●] [Master ●]             ║
║  ─────────────────────────────────────────────────   ║
║  [第二螢幕 tab]                                      ║
║  [WebRTC 串流預覽 / Three.js viewport]               ║
║  右側面板: [MQTT] [OSC] [系統狀態]                   ║
╚══════════════════════════════════════════════════════╝
```

**共用 state**：`presentationStore`（active camera path、lighting blend value、room visibility）

**額外效益**：消除 exhibition.board 裡重複的攝影機下拉選單（之前有兩個地方各自實作 camera list）

**Before → After**：2 個 Kit window → 1 個 PresentationModule

---

## Module 4：保持獨立的下游模組

下列模組**不滿足合併判準**（沒有工作流相近的配對），保持獨立。

| Module | 來自 Kit ext | 不合併原因 |
|---|---|---|
| SafetyMonitor | vision.detector | 沒有工作流相近的對象（YOLO 偵測是獨立情境）|

**DataConnectionStatus**（非功能 module，是 status panel）：
- `mqtt.bridge` → 已被 welltek-twin 取代
- `osc.controller` → 已被 WebController 取代
- Web 端只需一個連線狀態小面板（嵌在 App Shell 底部 statusbar）

---

## Module 5：共用 Lib Stores（非 module）

```
lib/
├── massingStore.ts    ← Massing Pipeline 輸出（BuildingMass[]）
├── zoneStore.ts       ← Zone 數據（原 elements.core ZoneRegistry）
├── sunlightStore.ts   ← 太陽位置（elevation/azimuth/intensity）
├── windSimStore.ts    ← WindSimModule 求解器狀態
├── solarGainStore.ts  ← SolarAnalysisModule 計算結果快取
├── bimScanStore.ts    ← BIMReviewModule 掃描結果
└── consoleHistoryStore.ts ← ConsoleModule 歷史紀錄
```

---

## 整併總結（最終版）

### 三層整併架構

```
Layer 0（基礎設施）：App Shell + lib stores（從 dashboard + elements.core）
Layer 1（幾何來源）：Massing Pipeline（從散落 3 處 → 統一）
Layer 2（工作流合併）：5 個合併模組（從 13 個 ext → 5 個 module）
Layer 3（獨立模組）：SafetyMonitor + DataConnectionStatus
```

### 數字

| 分組 | Kit ext（原）| Web module（後）| 合併比 |
|---|:---:|:---:|:---:|
| App Shell | dashboard | App Shell | — |
| Massing Pipeline（幾何基礎）| 散落 3 處 | 1 | — |
| WindSimModule | 2 ext | 1 | 2:1 |
| SolarAnalysisModule | 5 ext | 1 | 5:1 |
| BIMReviewModule | 2 ext | 1 | 2:1 |
| ConsoleModule | 2 ext | 1 | 2:1 |
| PresentationModule | 2 ext | 1 | 2:1 |
| SafetyMonitor | 1 ext | 1 | — |
| DataConnectionStatus（status only）| 2 ext（已取代）| 0 | — |
| dev.repl（原 Impossible）| 1 ext | → ConsoleModule | 解鎖 |
| lib stores | elements.core | 7 個 lib file | — |
| **合計** | **18 Kit ext** | **7 feature modules** | **18:7** |

### 最終模組數

**18 個 Kit extension → 7 個 Web Feature Module**（+ App Shell + Massing Pipeline 基礎層）

視窗減少原因分析：
- **已被現有資產取代**：-2（mqtt.bridge / osc.controller）
- **Massing Pipeline 整併**：-0（不算 window，是 lib 層）
- **工作流合併（本輪）**：-9（13 個獨立 module 合併成 5 個 module）

原本被標記為「Impossible（不移植）」的 dev.repl，**因為合入 ConsoleModule 而解鎖**：Run Code mode 透過 Kit WS Bridge 執行，不需要 file IPC。

---
← [[../Omniverse Web化 評估|主評估文件]] | [[Web化 架構選項|架構選項]]
