---
title: visustwin.solar.heatmap
tags: [tech, plugin, visustwin]
---

# visustwin.solar.heatmap — Extension 細節卡

> **Tier: T0** — 核心保留 — 獨立 Solar 模組，優先 port（demo_preset → Massing Pipeline）

## 功能與 UI 結構

每戶太陽得熱分析。模型為 3 棟 × 最多 30 層 × 每層 4 戶（NE/SE/SW/NW）。從 carb.settings 讀取 sunlight.studio 的太陽位置（或直接呼叫 sun_calculator.py），計算直射 + 散射 + 地面反射的照射度。提供 LIVE（瞬時 W）和 DAILY（積分 Wh）兩種模式，並在 USD Stage 建立 3D 顏色熱圖。

## 程式檔案清單

| 檔案 | 職責 |
|---|---|
| `extension.py` | IExt lifecycle + UI + 動畫 subscription |
| `ui_window.py` | 控制面板 + 數值列表 UI |
| `gain_calculator.py` | 直射/散射/地面反射照射度計算（純 Python math） |
| `unit_model.py` | Unit / UnitGainResult 資料結構 |
| `demo_preset.py` | 3 種規模預設（small/medium/large 三棟塔） |
| `scene_builder.py` | USD Stage 熱圖 prim 建立與更新 |

## 關鍵程式碼片段

```python
# gain_calculator.py — 直射 + 散射 + 地面反射（純數學）
DNI_CLEAR_SKY = 900.0  # W/m^2
DIFFUSE_HORIZ = 100.0
GROUND_ALBEDO = 0.2

def calc_facade_gain(elevation_deg, azimuth_deg, facade_azimuth_deg,
                     glass_ratio=0.6, facade_area_m2=1.0) -> float:
    """計算正面照射度 W"""
    inc_angle = compute_incidence_angle(elevation_deg, azimuth_deg, facade_azimuth_deg)
    # cos(入射角) × DNI + 散射分量 + 地面反射分量
    direct = DNI_CLEAR_SKY * math.cos(math.radians(inc_angle)) * glass_ratio
    diffuse = DIFFUSE_HORIZ * (1 + math.cos(math.radians(90))) / 2
    ground = DNI_CLEAR_SKY * math.sin(math.radians(elevation_deg)) * \
             GROUND_ALBEDO * (1 - math.cos(math.radians(90))) / 2
    return max(0, (direct + diffuse + ground) * facade_area_m2)
```

```python
# gain_calculator.py — 讀取 sunlight.studio 設定（透過 carb.settings 共享）
settings = carb.settings.get_settings()
lat   = settings.get_as_float("/VisTwin/sunlight/lat")   # 25.033
lon   = settings.get_as_float("/VisTwin/sunlight/lon")   # 121.565
hour  = settings.get_as_float("/VisTwin/sunlight/hour")  # 12.0
from visustwin.sunlight.studio.sun_calculator import sun_position
pos = sun_position(lat, lon, year, month, day, hour, tz_offset=8)
```

## Kit 依賴逐項

| 依賴 | 用途 | Web 可替換？ |
|---|---|---|
| `gain_calculator.py` | 照射度計算（純數學） | ✅ 直接移植 TypeScript |
| `unit_model.py` | 資料結構 | ✅ TypeScript interface |
| `demo_preset.py` | 建築預設配置 | ✅ JSON config |
| `carb.settings` | 讀取 sunlight.studio 太陽位置 | ✅ Zustand store 共享 |
| `scene_builder.py` + `omni.usd` | 3D 熱圖 prim 建立 | ❌ Kit USD 操作 |
| `omni.kit.app update stream` | 每幀動畫 | ✅ requestAnimationFrame |
| `omni.ui` | 控制面板 | ✅ React form + sliders |

## Web 替代方案

**計算核心（gain_calculator.py）完全可移植**：

```typescript
// solarGain.ts — TypeScript 移植
const DNI = 900, DIFFUSE = 100, ALBEDO = 0.2

function calcFacadeGain(
  elevDeg: number, azDeg: number, facadeAzDeg: number,
  glassRatio = 0.6, areaM2 = 1.0
): number {
  const incAngle = computeIncidenceAngle(elevDeg, azDeg, facadeAzDeg)
  const direct = DNI * Math.cos(incAngle * Math.PI / 180) * glassRatio
  const diffuse = DIFFUSE * 0.5
  const ground = DNI * Math.sin(elevDeg * Math.PI / 180) * ALBEDO * 0.5
  return Math.max(0, (direct + diffuse + ground) * areaM2)
}
```

**視覺化替代**：
- 每層每戶數值列表 → `@tanstack/react-table`
- 棒狀圖排名 → Recharts BarChart
- 樓層熱圖（色階方塊）→ CSS Grid + 顏色映射 (`d3-scale-chromatic`)
- 3D 場景熱圖 → 保留在 Kit，或 Three.js instancedMesh（若移至 web 渲染）

## 整併候選（修正）

**Solar Heatmap 保持獨立 module**，不合併進 EnvAnalysisModule tabs。

**`demo_preset.py` 抽出 → Massing Pipeline**（最重要的整併點）：
- 原本 `demo_preset.py` 與 `windtunnel/solver.py PRESETS` 重複定義相同建築配置
- 兩者都標注「KEEP IN SYNC」——這是 Massing Pipeline 需求的直接證據
- 抽出後：solar.heatmap 讀 `massingStore`，消除同步負擔

```
solar.heatmap/demo_preset.py  ──────▶ Massing Pipeline（抽出，消除重複）
solar.heatmap 計算 + UI        ──────▶ Solar Heatmap module（獨立保留）
```

- 與 **visustwin.solar.report** 是 scene/report pair，但在 web 中是兩個獨立路由（非合併 tabs）
- 與 **visustwin.sunlight.studio** 透過 `sunlightStore` 共用太陽位置（store 而非 tab 合併）

## 難度 / 工作量

| 項目 | 評估 |
|---|---|
| **Web 化難度** | **Easy**（計算邏輯），**Medium**（3D 視覺化） |
| **工作量** | **M** |
| **預估 LoC** | ~1200（TS 計算 + React 表格/圖表 + 樓層熱圖 UI） |
| **主要風險** | 3D 熱圖移至 web 需 Three.js（or 保留在 Kit viewport） |
| **快速路徑** | 先做 2D 表格 + 棒狀圖；3D 熱圖保留在 Kit |

---
← [[../Omniverse Web化 評估|主評估文件]]


← [[02 技術/VisTwin/README|VisTwin]]
