# Web化 架構選項比較

> 三套完整方案，各有不同的整合範圍、開發量和長期維護成本

---

## 前提假設（共同）

- Kit 端永遠保留做為 **RTX 渲染 + USD 資料服務器**（3D 視覺化品質不犧牲）
- Web 端負責：**UI 控制、計算邏輯展示、報告輸出、非 GPU 運算**
- 通訊協議共同基線：WebSocket / REST（Kit ↔ Web bridge）

---

## 方案 A：整合進 visustwin-showcase

### 概念
在現有的 Next.js showcase repo 中新增分析功能 routes，擴展為全功能 app。

```
visustwin-showcase/
├── app/
│   ├── page.tsx           （現有 DNA 展示首頁）
│   ├── env-analysis/      ← 新增 EnvAnalysisModule
│   │   ├── solar/
│   │   ├── wind/
│   │   └── comfort/
│   ├── bim/               ← 新增 BIMSustainabilityModule
│   ├── ai-oracle/         ← 新增 AIOracleModule
│   ├── safety/            ← 新增 SafetyModule
│   └── connections/       ← 新增 DataConnectionModule
├── components/
│   ├── glass-card/        （現有 GlassCard DNA）
│   └── analysis/          ← 新增分析元件
└── lib/
    ├── solarGain.ts       ← 新增
    ├── windSolver.ts      ← 新增
    └── kitBridge.ts       ← 新增 Kit WebSocket bridge
```

### Pros
- ✅ 零 repo 開銷，直接擴展現有代碼庫
- ✅ 共用已建立的 DNA（GlassCard、Framer Motion、Tailwind）
- ✅ 已有 Next.js 15 + React 19 + TypeScript strict 環境
- ✅ OSC bridge（WebController node bridge.js）已可用
- ✅ MQTT（welltek-twin server）已可用
- ✅ 對客戶展示：一個 URL 涵蓋所有功能

### Cons
- ❌ showcase 原本定位是「行銷展示 + DNA 原型」，加入重型分析工具會混合職責
- ❌ bundle size 大幅增長（matplotlib 替代、Three.js、D3 全部進去）
- ❌ URL 架構需要規劃（`/` = marketing vs `/env-analysis` = tool）
- ❌ Lighthouse / SEO 分數可能受影響

### 工作量
| 項目 | 估計 |
|---|---|
| Route 架構調整 | S |
| EnvAnalysisModule | L |
| BIMSustainabilityModule | M |
| AIOracleModule | M |
| SafetyModule | M |
| Kit Bridge WS server | M |
| **總計** | **XL（3-4 個月）** |

### 適合情境
- 想要單一 URL 展示給業主看
- Team 只有一個人維護前端
- 近期沒有 public-facing marketing 需求

---

## 方案 B：新 repo visustwin-studio（推薦）

### 概念
建立全新的 `visustwin-studio` repo，專門負責「操作 / 分析 / 工程工具」，與 showcase（行銷）分開。

```
visustwin-studio/               ← 新 repo
├── app/
│   ├── layout.tsx             （Sidebar + TopNav App Shell）
│   ├── dashboard/             （module 清單 + 狀態概覽）
│   ├── env-analysis/
│   ├── bim/
│   ├── ai-oracle/
│   ├── safety/
│   └── connections/
├── components/
│   ├── sidebar/
│   └── modules/
├── lib/
│   ├── solarGain.ts
│   ├── windSolver.ts
│   ├── kitBridge.ts          （Kit WebSocket client）
│   └── zoneStore.ts          （Zustand）
└── package.json              （@vistwin/ui 引用，當套件抽出後）
```

### Kit Bridge 架構

```
visustwin-studio ──WS──▶ kitBridge.ts ──▶ Kit WebSocket Server
                                              │
                                              ├── scan_bim_stage()
                                              ├── calc_solar_gain()
                                              ├── get_zone_data()
                                              └── fly_to_camera()
```

Kit 端需新增一個 **WebSocket RPC server extension**（`visustwin.ws.bridge`），暴露所有 Kit 功能為 JSON RPC endpoint。

### Pros
- ✅ 職責分離：showcase = 行銷，studio = 工具
- ✅ 可獨立部署（localhost:3010 或 intranet）
- ✅ 技術棧自由（可選更適合 data app 的 UI 框架，如 shadcn/ui）
- ✅ 可以用 Next.js 14 app router 的 server actions 做 Kit RPC
- ✅ 未來 `@vistwin/ui` 套件抽出後，兩個 repo 都可引用

### Cons
- ❌ 新 repo，需設置 CI/CD、環境變數、部署管線
- ❌ 需要額外維護成本
- ❌ 需要新建 Kit WS Bridge extension

### 工作量
| 項目 | 估計 |
|---|---|
| Repo 設置 + App Shell | S |
| Kit WS Bridge extension | M |
| EnvAnalysisModule | L |
| BIMSustainabilityModule | M |
| AIOracleModule | M |
| SafetyModule | M |
| **總計** | **XL（3-4 個月）** |

### 適合情境
- 想要清晰的產品定位（showcase vs studio）
- 預計這個工具未來會給工程師 / 業主長期使用
- 有計劃抽出 `@vistwin/ui` 套件

---

## 方案 C：分散式 Islands（微服務/最小化侵入）

### 概念
不開新 repo，也不大改 showcase，而是把各功能**整合進現有 web 資產**，每個功能對應最相關的 repo：

| 功能 | 整合到哪裡 |
|---|---|
| 環境分析（風場/日照/舒適） | 新增到 `welltek-twin`（已有環境監控） |
| BIM + ESG | 新增到 `visustwin-showcase`（已有建築展示） |
| AI Oracle | 新增到 `visustwin-showcase`（聊天 drawer） |
| 攝影機控制 + OSC | `WebController`（已做了） |
| Vision Safety | 新增到 `welltek-twin` 或獨立 `visustwin-safety` |
| 連線狀態 | `welltek-twin` 的 connections tab |

### Pros
- ✅ 最低新代碼量（每個功能加在最相關的現有 repo）
- ✅ 零新 repo 管理成本
- ✅ 可以 incremental 推進（一次做一個功能）

### Cons
- ❌ 分散在多個 repo，使用者體驗破碎
- ❌ 無統一 URL，每個工具要去不同地方找
- ❌ 共用邏輯（solarGain、windSolver）會重複實作或需要 npm package
- ❌ 難以向業主展示「完整平台」
- ❌ 長期維護複雜度高

### 工作量
| 項目 | 估計 |
|---|---|
| 各功能分散整合 | M × 6 |
| 共用邏輯複製或 npm 包 | M |
| **總計** | **L（2-3 個月，但碎片化）** |

### 適合情境
- 沒有資源做統一 app
- 各功能需要獨立部署到不同設備（welltek 壁掛、WebController iPad）
- 快速 demo 用，不考慮長期維護

---

## 方案比較矩陣

| 指標 | 方案 A（extend showcase） | 方案 B（visustwin-studio）| 方案 C（islands） |
|---|:---:|:---:|:---:|
| 統一 UX | ✅ | ✅ | ❌ |
| 職責清晰 | ⚠️ | ✅ | ✅ |
| 開發速度（初期）| ✅ | ⚠️ | ✅ |
| 長期維護 | ⚠️ | ✅ | ❌ |
| 業主展示效果 | ✅ | ✅ | ❌ |
| Repo 管理成本 | ✅ | ⚠️ | ✅ |
| DNA 共用 | ✅ | ⚠️（需設置）| ⚠️（各自設置）|
| 未來 @vistwin/ui | ✅（受益最多）| ✅ | ⚠️（各自引用）|
| **綜合評分** | **3.5/5** | **4/5** | **2.5/5** |

---

## Kit 端保留架構（共同）

無論選哪個方案，Kit 端都需要新增 **WebSocket Bridge**：

```
visustwin.ws.bridge（新 extension）
├── WebSocket server（ws://localhost:9001）
├── RPC dispatcher
│   ├── bim.scan() → scanner.py
│   ├── solar.gain(params) → gain_calculator.py
│   ├── wind.solve(params) → solver.py
│   ├── zone.get_all() → zone_registry.py
│   ├── camera.fly_to(path) → camera_fly.py
│   ├── scene.set_room(name) → osc_controller actions
│   └── lighting.blend(value) → osc_controller actions
└── Event streamer（push to web）
    ├── visustwin.mqtt.message → web
    ├── visustwin.vision.detection → web
    └── visustwin.elements.zone_updated → web
```

---

## 推薦

**短期（0-3 個月）**：採用 **方案 A**，在 showcase 加一個 `/studio` route group，快速迭代。

**中期（3-12 個月）**：當功能穩定後，**分拆為方案 B**（把 `/studio` 系列提取到獨立 repo），showcase 回歸純行銷用途。

**方案 C** 只在以下情況考慮：資源極度有限 + 不需要統一展示 + 各設備部署需求差異大。

---

## 待決策點

1. **Kit WS Bridge extension** 是否現在就啟動？（影響其他所有方案的可行性）
2. **RTX 畫面** 要不要做 WebRTC streaming？（exhibition.board 的 web 化前提）
3. **短期用方案 A 還是直接方案 B**？（取決於是否有即時展示需求）
4. **`@vistwin/ui` 套件**何時抽出？（影響多 repo DNA 共用成本）

---
← [[../Omniverse Web化 評估|主評估文件]] | [[Web化 整併提案|整併提案]]
