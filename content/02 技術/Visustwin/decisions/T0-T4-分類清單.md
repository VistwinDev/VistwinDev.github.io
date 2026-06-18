# Omniverse Web化 分類清單

> 誠實狀態審核。依實際 LoC、git 歷史、TODO/FIXME 密度、stub 標記、功能完整度重新分類。
> 
> 分類日期：2026-04-19  
> 審核方式：靜態分析（git log + wc -l + grep + 讀主要 .py 檔）

---

## T0 — 重點保留、獨立、優先 port

> 核心功能、成熟實作、使用者反覆使用、獨立模組身份清楚。

| Extension | LoC | 最後 commit | 狀態 | 歸類理由 |
|---|---|---|---|---|
| `visustwin.dashboard` | 661 | 2026-04-15 | 成熟，7 commits | Hub 入口，orchestrates 全部 ext；Design System + category 系統完整 |
| `visustwin.warp.windtunnel` | 2785 | 2026-04-15 | 成熟，9 commits（最多） | CFD solver（numpy RK4）、流線動畫、6000 粒子；solver.py 可直接移植 TS |
| `visustwin.solar.heatmap` | 2410 | 2026-04-15 | 成熟，2 commits | 每戶太陽得熱計算；gain_calculator.py 純 math，零依賴，可直接移植 |
| `visustwin.sunlight.studio` | 1334 | 2026-04-15 | 成熟，2 commits | NOAA 太陽算法 + 場景 DirectionalLight 控制；sun_calculator.py 純 math |
| `visustwin.bim.inspector` | 2227 | 2026-04-15 | 成熟，2 commits | USD Stage 掃描 + AABB 碰撞 + LOD 估算 + CSV 報告；邏輯完整 |
| `visustwin.vision.detector` | 998 | 2026-04-15 | 程式碼完整，待硬體設定 | WebSocket 接 visustwin-vision YOLO；程式已實作，等攝影機和模型下載 |

**Phase 1 優先：dashboard → warp.windtunnel → solar.heatmap**（三個最有展示價值）

---

## T1 — 合併

> 工作流與 T0 相連、資料共用、UI 骨架相似，web 端以 merged module 呈現。

| Extension | LoC | 合併目標 | 歸類理由 |
|---|---|---|---|
| `visustwin.wind.analysis` | 1455 | **WindSimModule** | windtunnel 的 report side；同一個 CFD 資料流，UI 骨架幾乎鏡像 windtunnel |
| `visustwin.solar.report` | 1533 | **SolarAnalysisModule** | docstring 直接說「Mirror of visustwin.wind.analysis for the solar side」；依賴 solar.heatmap |
| `visustwin.esg.tracker` | 1439 | **BIMReviewModule** | 讀取 BIM 材質 tag 計算碳排；bim.inspector 是唯一資料來源 |
| `visustwin.ai.oracle` | 1853 | **ConsoleModule** | AI 問答 + BIM tool registry；dev.repl 是同一個 console 操作面的另一半 |
| `visustwin.dev.repl` | 321 | **ConsoleModule** | file IPC REPL，web 端改走 Kit WS Bridge；與 oracle 共用 console 輸出 UI |
| `visustwin.camera.travel` | 498 | **PresentationModule** | 攝影機飛行動畫；與 exhibition.board 共用「展示場景」工作流 |
| `visustwin.exhibition.board` | 1168 | **PresentationModule** | 第二螢幕看板 + RTX viewport embed；ui_window.py 有 `_draw_placeholder()` 但主結構完整 |

**合併後模組一覽：**

```
WindSimModule       = warp.windtunnel (T0) + wind.analysis (T1)
SolarAnalysisModule = solar.heatmap (T0) + sunlight.studio (T0) + solar.report (T1)
BIMReviewModule     = bim.inspector (T0) + esg.tracker (T1)
ConsoleModule       = ai.oracle (T1) + dev.repl (T1)
PresentationModule  = camera.travel (T1) + exhibition.board (T1)
```

---

## T2 — 已被取代

> 現有 web 資產已做掉 Kit 端等同功能。Kit 端直接標退役，不 port。

| Extension | LoC | 取代資產 | 退役理由 |
|---|---|---|---|
| `visustwin.mqtt.bridge` | 935 | **welltek-twin** (`/D:/Visustwin/welltek-twin`) | welltek-twin 是完整 MQTT IoT dashboard（React+MQTT.js+WebSocket）；Kit 端不再需要自己橋 MQTT |
| `visustwin.osc.controller` | 930 | **WebController** (`/D:/Visustwin/WebController`) | WebController = React + Bridge (Node.js WS→OSC)，已完整實作所有控制路由（攝影機/場景/光照/序列）；Kit 端改走 Kit Bridge WebSocket |

**行動項目（Phase 0 清理）：**
- 在兩個 ext 的 `extension.toml` 加 `[deprecation]` 標記
- Kit `apps/` 啟動 cfg 移除這兩個 ext 的載入

---

## T3 — 刪除

> 功能被其他 ext 涵蓋、或邏輯重複、無獨立存在價值。Port 時直接跳過。

| Extension | LoC | 刪除理由 |
|---|---|---|
| `visustwin.light.compass` | 761 | **太陽方位舊插件**。`compass/solar.py` 完整複製 `sunlight.studio/sun_calculator.py` 的 NOAA 算法（連變數名稱都一樣）。功能是在 USD scene 放 3D 羅盤裝飾 + 36 方向照度射線 — 這些由 `sunlight.studio`（太陽位置/場景光）和 `solar.heatmap`（方位照度分析）完全涵蓋。沒有任何下游 ext 依賴它。 |

**行動項目（Phase 0 清理）：**
- 從 `visustwin-extensions/exts/` 目錄刪除
- 移除 kit-app-template apps cfg 引用
- 若 `sunlight.studio/sun_calculator.py` 缺少任何計算請補齊（但目前 `sun_calculator.py` 更完整）

---

## T4 — 次要 / 方向性 stub

> 只開發一部分、代表一個方向但沒實質完成。誠實列出，port 放最後或永久封存。

| Extension | LoC | 最後 commit | 狀態 | 說明 |
|---|---|---|---|---|
| `visustwin.moisture.health` | 632 | 2026-04-15 | **明確 skeleton** | docstring 寫 `Phase 1 (skeleton)`；PMV/PPD calculator 有實作，材質資料庫有實作，但 Risk Map tab 是 placeholder（`# RISK MAP tab (placeholder)`）；未來功能列在 docstring 的 `Future:` 段。可用的是 comfort 計算；zone risk 功能是空的。 |
| `visustwin.elements.core` | 412 | 2026-04-15 | 基礎建設但未整合 | ZoneRegistry singleton + carb event bus；設計供 sunlight/wind/moisture 共用，但實際上只有 `moisture.health` 依賴它，而 `moisture.health` 是 T4。Web 端由 Zustand store 取代，此 ext 沒有獨立 port 價值。 |

**行動項目：**
- moisture.health：若 comfort 計算值獨立價值，可抽出 PMV/PPD 函數進 SolarAnalysisModule 的熱舒適分頁（不需 port 整個 ext）
- elements.core：直接廢棄；ZoneRegistry 概念在 web 端由 `zoneStore.ts` 重新實作

---

## 分類總結

```
T0 獨立保留  (6)  → dashboard / warp.windtunnel / solar.heatmap /
                     sunlight.studio / bim.inspector / vision.detector
T1 合併模組  (7)  → wind.analysis / solar.report / esg.tracker /
                     ai.oracle / dev.repl / camera.travel / exhibition.board
T2 退役      (2)  → mqtt.bridge / osc.controller
T3 刪除      (1)  → light.compass
T4 存封      (2)  → moisture.health / elements.core
─────────────────
合計        (18)
```

**18 Kit ext → 7 Web Feature Modules（Phase 0 清理後）**

```
1. Dashboard           (from T0: dashboard)
2. WindSimModule       (from T0: windtunnel + T1: wind.analysis)
3. SolarAnalysisModule (from T0: solar.heatmap + sunlight.studio + T1: solar.report)
4. BIMReviewModule     (from T0: bim.inspector + T1: esg.tracker)
5. ConsoleModule       (from T1: ai.oracle + dev.repl)
6. PresentationModule  (from T1: camera.travel + exhibition.board)
7. SafetyMonitor       (from T0: vision.detector)
```

---

← [[Omniverse Web化 評估]]  
← [[Omniverse Web化/Web化 整併提案]]
