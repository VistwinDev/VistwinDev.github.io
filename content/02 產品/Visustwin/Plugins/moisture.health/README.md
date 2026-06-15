# visustwin.moisture.health — Extension 細節卡

> **Tier: T4** — 存封 — docstring 明寫「Phase 1 (skeleton)」，Risk Map tab 是 placeholder；PMV 計算抽出進 SolarAnalysisModule 即可

## 功能與 UI 結構

建築濕度健康分析與人體舒適度評估。實作 ISO 7730 簡化版 PMV/PPD 模型（基於溫度/濕度/氣流速），評估室內熱舒適等級。包含材質吸濕性資料庫（檢查結露和黴菌風險），讀取 elements.core Zone 資料取得各房間的陽光/風速輸入。

## 程式檔案清單

| 檔案 | 職責 |
|---|---|
| `extension.py` | IExt lifecycle + Dashboard 協議 |
| `ui_window.py` | 舒適度 UI（omni.ui）|
| `comfort.py` | PMV/PPD 計算器（ISO 7730 簡化版） |
| `material_db.py` | 材質吸濕性資料庫 |

## 關鍵程式碼片段

```python
# comfort.py — PMV/PPD 計算（純數學，ISO 7730 簡化版）
def simplified_pmv(temp_c: float, rh: float, air_velocity: float = 0.1) -> float:
    """clo=1.0（辦公穿著）, met=1.2（坐姿），基準 24°C"""
    t_dev   = temp_c - 24.0
    rh_dev  = (rh - 50.0) / 100.0
    air_term = -air_velocity * 3.0
    pmv = 0.3 * t_dev + 0.8 * rh_dev + air_term
    return round(max(-3.0, min(3.0, pmv)), 2)

def ppd_from_pmv(pmv: float) -> float:
    """Fanger's formula: PMV → 預期不滿意百分比"""
    ppd = 100.0 - 95.0 * math.exp(-0.03353 * pmv**4 - 0.2179 * pmv**2)
    return round(max(0.0, min(100.0, ppd)), 1)
```

```python
# 從 Zone Registry 讀取其他插件數據
from visustwin.elements.core.zone_registry import get_registry
registry = get_registry()
zone = registry.get_zone("unit_A1_floor3")
wind_speed_ms = zone.wind_speed_ms  # warp.windtunnel 寫入
solar_gain_w  = zone.solar_gain_w   # solar.heatmap 寫入
```

## Kit 依賴逐項

| 依賴 | 用途 | Web 可替換？ |
|---|---|---|
| `comfort.py` 整個模組 | PMV/PPD 計算（純 Python math） | ✅ 直接移植 TypeScript |
| `material_db.py` 整個模組 | 材質吸濕性查詢（純資料+邏輯） | ✅ JSON + TS function |
| `omni.usd` | Zone 座標 / 視覺化 | ⚠️ 初始化需 bridge |
| `elements.core ZoneRegistry` | 跨插件數據共享 | ✅ Zustand store |
| `omni.ui` | 舒適度 UI | ✅ React |
| `carb.events` | Zone 更新訂閱 | ✅ Zustand subscribe |

## Web 替代方案

**計算邏輯 100% 可移植**——整個 comfort.py 和 material_db.py 都是純數學：

```typescript
// comfort.ts
export function simplifiedPmv(tempC: number, rh: number, airVel = 0.1): number {
  const tDev = tempC - 24.0
  const rhDev = (rh - 50.0) / 100.0
  const airTerm = -airVel * 3.0
  return Math.max(-3, Math.min(3, 0.3 * tDev + 0.8 * rhDev + airTerm))
}

export function ppdFromPmv(pmv: number): number {
  return 100 - 95 * Math.exp(-0.03353 * pmv**4 - 0.2179 * pmv**2)
}
```

**UI 替代**：
- PMV 儀錶板 → Recharts GaugeChart 或自訂 SVG
- 材質風險表格 → `@tanstack/react-table`
- 舒適度熱圖（樓層視圖）→ CSS Grid + 顏色映射

**數據來源**：
- MQTT 真實 env 感測器 → 從 welltek-twin WS 接收 temp/humidity
- Zone 數據 → Zustand store（替代 ZoneRegistry）

## 整併候選

- 與 **visustwin.solar.heatmap** 共用太陽數據（Zone registry）
- 與 **visustwin.warp.windtunnel** 共用風速數據（Zone registry）
- 建議整合進 `EnvAnalysisModule > 健康舒適頁籤`
- 與 MQTT 感測器數據緊密關聯 → 可與 welltek-twin 的環境面板整合

## 難度 / 工作量

| 項目 | 評估 |
|---|---|
| **Web 化難度** | **Easy** |
| **工作量** | **S** |
| **預估 LoC** | ~800（TS 計算模組 + React UI + 圖表） |
| **主要風險** | Zone 初始化需要來自 Kit 的建築幾何資料 |
| **快速路徑** | 先接 welltek-twin MQTT 數據 → 即時計算 PMV（不需 USD） |

---
← [[../Omniverse Web化 評估|主評估文件]]


← [[02 產品/VisTwin/README|VisTwin]]
