# visustwin.wind.analysis — Extension 細節卡

> **Tier: T1** — 合併 → WindSimModule（windtunnel 的 report side，同一 CFD 資料流）

## 功能與 UI 結構

風場分析報告與行人舒適度評估。依賴 visustwin.warp.windtunnel 的求解器，生成 5 張 matplotlib 圖表（風速圖、放大倍率圖、舒適度地圖、壓力地圖、向量場），並進行 Davenport / ISO 行人舒適度標準評估（1-7 級）。提供可設定的求解器參數、建築配置，彈出獨立 ReportWindow。與 solar.report 架構完全對稱。

## 程式檔案清單

| 檔案 | 職責 |
|---|---|
| `extension.py` | IExt lifecycle + Dashboard 協議 |
| `engine.py` | 報告引擎（呼叫 windtunnel solver，計算舒適度） |
| `report_window.py` | 彈出報告視窗（matplotlib 圖表嵌入） |

## 關鍵程式碼片段

```python
# engine.py — 呼叫 windtunnel solver
from visustwin.warp.windtunnel.solver import (
    compute_streamlines, sample_velocity_grid, sample_velocity_section, load_preset
)

def generate_wind_report(preset: str, wind_dir: float, config: dict) -> dict:
    buildings = load_preset(preset)
    # 取得 2D 速度場格點（用於圖表）
    grid_u, grid_v = sample_velocity_grid(
        buildings, wind_dir,
        turbulence=config["turbulence"],
        resolution=config["grid_resolution"]
    )
    # 計算行人舒適度
    speed_map = np.sqrt(grid_u**2 + grid_v**2)
    comfort = assess_pedestrian_comfort(speed_map, reference_speed=config["v_ref"])
    return {"speed_map": speed_map, "comfort_map": comfort, ...}
```

```python
# engine.py — Davenport 行人舒適度評估
def assess_pedestrian_comfort(speed_map: np.ndarray, reference_speed: float) -> np.ndarray:
    """ISO 4354 / Davenport 行人舒適度分類（1-7 級）"""
    speed_ratio = speed_map / reference_speed
    comfort = np.ones_like(speed_map, dtype=int)
    comfort[speed_ratio > 0.3] = 2  # 可接受（散步）
    comfort[speed_ratio > 0.5] = 3  # 邊緣（停留）
    comfort[speed_ratio > 0.7] = 4  # 不舒適（短期）
    comfort[speed_ratio > 1.0] = 5  # 很不舒適
    comfort[speed_ratio > 1.3] = 6  # 危險
    comfort[speed_ratio > 1.6] = 7  # 非常危險
    return comfort
```

## Kit 依賴逐項

| 依賴 | 用途 | Web 可替換？ |
|---|---|---|
| `visustwin.warp.windtunnel` | 求解器依賴 | ✅ 共用 TS wind solver |
| `matplotlib` | 5 張圖表 | ✅ Plotly / Recharts / D3 |
| `numpy` | 速度場格點計算 | ✅ 純 TS 陣列計算 |
| `omni.ui` | 報告彈出視窗 | ✅ React modal |
| `omni.usd` | 建築配置同步 | ⚠️ 可改用 JSON config |
| Python `json`, `csv` | 匯出 | ✅ 瀏覽器 Blob |

## Web 替代方案

**與 solar.report 完全對稱**——engine.py 的計算邏輯可全部移植 TypeScript：

```typescript
// windReport.ts
import { sampleVelocityGrid } from '@/lib/windSolver'

function assessPedestrianComfort(speedMap: number[][], vRef: number): number[][] {
  return speedMap.map(row =>
    row.map(speed => {
      const ratio = speed / vRef
      if (ratio > 1.6) return 7  // 非常危險
      if (ratio > 1.3) return 6
      // ...
      return 1
    })
  )
}
```

**圖表建議**：
- 速度圖（heatmap）→ D3 + canvas 或 Plotly heatmap
- 向量場 → D3 vector field 或 Plotly quiver
- 舒適度地圖 → 色階 heatmap（Plotly 最方便）

**行人舒適度邏輯**：純數學，約 50 LoC TypeScript。

## 整併候選

- 與 **visustwin.warp.windtunnel** 是 scene/report pair → 整合為 `WindAnalysisModule`
- 與 **visustwin.solar.report** 架構完全對稱 → 共用 `ReportContainer` React component
- 在 web 端：`EnvAnalysisModule > 風場` 頁籤包含 scene 設定 + 報告兩個 view

## 難度 / 工作量

| 項目 | 評估 |
|---|---|
| **Web 化難度** | **Easy**（依賴可移植的 wind solver） |
| **工作量** | **M** |
| **預估 LoC** | ~1500（TS comfort 計算 + React 報告 UI + Plotly 圖表） |
| **主要風險** | 速度場格點的 heatmap 渲染效能（大解析度時需 canvas） |
| **快速路徑** | 先做 comfort 評估表格 + 2 張核心圖；完整 5 張圖之後補 |

---
← [[../Omniverse Web化 評估|主評估文件]]


← [[01 Projects/Visustwin/MOC|Visustwin MOC]]
