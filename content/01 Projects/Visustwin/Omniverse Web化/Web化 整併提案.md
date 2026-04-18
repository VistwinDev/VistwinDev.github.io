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

## Module 3：下游模擬模組（全部獨立）

> ❗ 原提案的「EnvAnalysisModule 4 tabs」和「BIMSustainabilityModule 3 tabs」已撤回。
> 下游模擬模組各自保持獨立，透過共用的 massingStore / zoneStore 讀取幾何與 zone 數據。

### 下游模組清單（13 個，各自獨立部署）

| Module | 來自 Kit ext | 讀取來源 | 主要 UI |
|---|---|---|---|
| CFD WindTunnel | warp.windtunnel | massingStore | 2D/3D 流線圖 |
| Wind Analysis | wind.analysis | massingStore + CFD solver | Davenport 報告 |
| Solar Heatmap | solar.heatmap | massingStore + sunlightStore | 樓層熱圖 grid |
| Solar Report | solar.report | massingStore + sunlightStore | 5 種圖表 |
| Sunlight Studio | sunlight.studio | 無（提供太陽位置）| 日期/時間/城市控制 |
| Light Compass | light.compass | sunlightStore + MQTT | Polar 照度圖 |
| PMV Comfort | moisture.health | zoneStore + MQTT | 舒適度儀錶板 |
| BIM Inspector | bim.inspector | Kit WS bridge（USD 掃描）| 表格 + 碰撞清單 |
| Carbon Tracker | esg.tracker | massingStore（材質 tag）| 碳足跡 + 認證 |
| Safety Monitor | vision.detector | YOLO WS | Canvas overlay |
| AI Oracle | ai.oracle | 工具呼叫 via bridge | Chat drawer |
| Camera Control | camera.travel | Kit WS bridge | 攝影機按鈕 |
| Exhibition Board | exhibition.board | Kit WebRTC stream | 第二螢幕 |

### 共用 Stores（lib 層，非 module）

```
lib/
├── massingStore.ts    ← Massing Pipeline 輸出（BuildingMass[]）
├── zoneStore.ts       ← Zone 數據（原 elements.core ZoneRegistry）
└── sunlightStore.ts   ← 太陽位置（elevation/azimuth/intensity）
```

---

## Module 4：DataConnectionModule（資料連線）

### 對應 Kit extensions（2 個，但幾乎已被取代）
- `visustwin.mqtt.bridge` → **已被 welltek-twin web frontend 取代**
- `visustwin.osc.controller` → **已被 WebController 取代**

### 職責
Web 版只需要一個「連線狀態面板」——顯示 MQTT / OSC / Vision WS 的連線狀態。實際控制功能已在其他 web 資產中。

### ASCII Wireframe

```
╔══════════════════════════════════════════════════════╗
║ DATA CONNECTIONS                                     ║
╠══════════════════════════════════════════════════════╣
║  MQTT / welltek-twin      ●─────── ws://localhost:3001║
║  OSC / WebController      ●─────── OSC UDP :8001     ║
║  Vision YOLO              ●─────── ws://localhost:8765║
║  Kit IPC                  ●─────── ws://localhost:XXXX║
╚══════════════════════════════════════════════════════╝
```

### 整併前後
| 前（Kit）| 後（Web） |
|---|---|
| 2 個獨立 window | 1 個 status panel（非主要 module） |
| 各自 UI + 控制 | 純狀態顯示；控制留在 WebController/welltek-twin |

---

## Module 5：SafetyModule（安全監控）

### 對應 Kit extensions（1 個）
- `visustwin.vision.detector`

### 職責
AI 安全偵測的 web 版前端。連接 visustwin-vision YOLO WebSocket，顯示偵測 feed / 警報歷史 / 設備狀態。

### ASCII Wireframe

```
╔══════════════════════════════════════════════════════╗
║ ● 即時偵測  ● 警報歷史  ● 設備狀態                  ║
╠══════════════════════════════════════════════════════╣
║  [即時偵測 tab]                                      ║
║  ┌─────────────────────────────┐ ┌────────────────┐ ║
║  │                             │ │ CAM_001        │ ║
║  │   [視訊/Canvas overlay]     │ │ ● person: 3    │ ║
║  │   ┌──────┐ person           │ │ ● hardhat: 2   │ ║
║  │   └──────┘                  │ │ ⚠ MISSING: 1  │ ║
║  │   ┌────────────┐ no_hardhat │ └────────────────┘ ║
║  │   └────────────┘            │                    ║
║  └─────────────────────────────┘                    ║
╚══════════════════════════════════════════════════════╝
```

### 整併前後
| 前（Kit）| 後（Web） |
|---|---|
| 1 個 window（viewport overlay） | 1 個 module，3 個頁籤 |
| omni.ui overlay | Canvas + React |

---

## Module 6：AIOracleModule（AI 問答）

### 對應 Kit extensions（1 個）
- `visustwin.ai.oracle`

### 職責
建築 AI 顧問。Claude API + Tool Use，工具呼叫改為 REST endpoint 呼叫（透過 Next.js API routes 或直接從瀏覽器）。可作為全局浮動 drawer 或獨立頁面。

### ASCII Wireframe

```
╔════════════════════════════════╗
║  ◉  VISUSTWIN AI              ║
╠════════════════════════════════╣
║  [ai_orb 動態球 animation]    ║
╠════════════════════════════════╣
║  > 幫我分析這棟建築的碳足跡    ║
║                                ║
║  我已掃描 127 個構件...        ║
║  總具現化碳量：2,847 kgCO2eq  ║
║  其中鋼筋混凝土佔 68%         ║
╠════════════════════════════════╣
║  [輸入框]              [送出]  ║
╚════════════════════════════════╝
```

### 整併前後
| 前（Kit）| 後（Web） |
|---|---|
| 1 個 window（omni.ui） | 1 個 React component（drawer / 頁面） |
| tool_registry 呼叫 Kit _INSTANCE | 工具呼叫改為 HTTP/WS API |

---

## 整併總結（修正版）

| 分層 | 前（Kit）| 個數 | 後（Web）| 個數 |
|---|---|---|---|---|
| 基礎設施 | dashboard + elements.core | 2 | App Shell + lib stores | 1+3 |
| **上游幾何（整併）** | demo_preset + PRESETS + bim 簡化 | 散落 3 處 | **Massing Pipeline** | **1** |
| 下游模擬（獨立）| 環境分析家族 | 8 | 8 個獨立 module | 8 |
| 下游模擬（獨立）| BIM + ESG | 2 | 2 個獨立 module | 2 |
| 下游控制（獨立）| camera.travel + exhibition.board | 2 | 2 個獨立 module | 2 |
| 已取代 | mqtt.bridge + osc.controller | 2 | welltek-twin / WebController | 0 |
| 安全（獨立）| vision.detector | 1 | 1 個獨立 module | 1 |
| AI（獨立）| ai.oracle | 1 | 1 個獨立 module | 1 |
| 不移植 | dev.repl | 1 | Kit-only | 0 |
| **合計** | | **18** | | **16（+3 lib）** |

**真正被整併的只有一件事**：3 處重複的建築幾何配置 → 1 個 Massing Pipeline。

**視窗數量變化**：17+ 個獨立 Kit window → 16 個 Web route/module（+共用 lib）。
減少的 2 個來自「已被現有資產取代」（mqtt.bridge / osc.controller），不是來自 tab 合併。

---
← [[../Omniverse Web化 評估|主評估文件]] | [[Web化 架構選項|架構選項]]
