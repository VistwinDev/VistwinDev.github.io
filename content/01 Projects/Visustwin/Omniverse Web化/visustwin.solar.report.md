# visustwin.solar.report — Extension 細節卡

## 功能與 UI 結構

太陽熱能分析報告。依賴 visustwin.solar.heatmap 的計算引擎，提供可設定的報告生成：選擇預設（small/medium/large）、模式（LIVE/DAILY）、玻璃率、樓層高度、地面網格解析度，生成 5 張 matplotlib 圖表（地面熱輻射圖、陰影小時數、舒適度地圖、各戶得熱 3D、方位角分析），以及 JSON summary + CSV 匯出。彈出獨立 ReportWindow。

## 程式檔案清單

| 檔案 | 職責 |
|---|---|
| `extension.py` | IExt lifecycle + Dashboard 協議 |
| `engine.py` | 報告引擎（呼叫 solar.heatmap 計算，生成數據） |
| `report_window.py` | 彈出報告視窗（matplotlib 圖表嵌入 omni.ui） |

## 關鍵程式碼片段

```python
# report_window.py — matplotlib 圖表嵌入 omni.ui（Kit-specific）
import matplotlib
matplotlib.use("Agg")  # 離屏渲染
import matplotlib.pyplot as plt

class SolarReportWindow(ui.Window):
    def _generate_charts(self):
        fig, axes = plt.subplots(2, 3, figsize=(18, 10))
        # Chart 1: 地面熱輻射圖
        ax0 = axes[0, 0]
        ax0.imshow(ground_grid, cmap="YlOrRd", origin="lower")
        # ... 5 張圖
        fig.savefig(self._report_path / "report.png", dpi=150)
        # 嵌入 omni.ui Image widget 顯示
```

```python
# engine.py — 呼叫 solar.heatmap 模組
from visustwin.solar.heatmap.gain_calculator import calc_facade_gain
from visustwin.solar.heatmap.demo_preset import load_preset

def generate_report_data(preset: str, mode: str, config: dict) -> dict:
    buildings = load_preset(preset)
    results = []
    for hour in range(24) if mode == "DAILY" else [config["current_hour"]]:
        sun_pos = get_sun_position(hour_override=hour)
        for bldg in buildings:
            for floor in range(config["floor_count"]):
                for orient in ["NE", "SE", "SW", "NW"]:
                    gain = calc_facade_gain(...)
                    results.append(...)
    return summarize(results)
```

## Kit 依賴逐項

| 依賴 | 用途 | Web 可替換？ |
|---|---|---|
| `visustwin.solar.heatmap` | 計算引擎依賴（同模組） | ✅ 共用 TS 計算模組 |
| `matplotlib` (via pipapi) | 圖表生成（離屏渲染） | ✅ Plotly / Recharts / Observable Plot |
| `omni.ui` | 報告彈出視窗 + 圖表嵌入 | ✅ React modal + chart libs |
| `omni.kit.app` | 非同步任務 | ✅ async/await |
| Python `json`, `csv` | 匯出格式 | ✅ 瀏覽器 Blob download |
| `omni.usd` | 部分：讀取場景設定 | ⚠️ 需 config API |

## Web 替代方案

**此 extension 幾乎完全不依賴 Kit runtime**（只依賴 solar.heatmap 的純計算邏輯）：

```typescript
// SolarReport.tsx — 完整 web 版
import { calcDailyGain } from '@/lib/solarGain'
import { BarChart, LineChart, HeatmapChart } from 'recharts'
// 或 import Plotly from 'plotly.js'

function SolarReportPanel({ preset, mode, config }) {
  const data = useMemo(() => generateReportData(preset, mode, config), [preset, mode, config])
  return (
    <div>
      <GroundIrradianceChart data={data.groundGrid} />
      <ShadowHoursChart data={data.shadowHours} />
      <ComfortMapChart data={data.comfortMap} />
      <UnitGain3DChart data={data.unitGains} />
      <OrientationProfileChart data={data.orientationProfile} />
      <DownloadButtons onCSV={exportCSV} onJSON={exportJSON} />
    </div>
  )
}
```

**推薦圖表庫**：
- 簡單快速：Recharts（與現有 showcase/welltek-twin 一致）
- 高階/互動：Plotly.js
- 地面網格熱圖：D3 + canvas

## 整併候選

- 與 **visustwin.solar.heatmap** 是 scene/report pair，在 web 端應整合為同一個 `SolarAnalysis` feature 的兩個 view（scene 設定 + 報告輸出）
- 與 **visustwin.wind.analysis** 架構完全相同（report_window + engine 模式），可共用 ReportContainer 元件

## 難度 / 工作量

| 項目 | 評估 |
|---|---|
| **Web 化難度** | **Easy** |
| **工作量** | **M** |
| **預估 LoC** | ~1500（React 報告 UI + 5 種圖表 + CSV/JSON 匯出） |
| **主要風險** | 5 張圖表的 layout 設計（matplotlib vs Recharts 視覺差異） |
| **快速路徑** | 先用 Recharts 做 3 張核心圖表，其餘之後補 |

---
← [[../Omniverse Web化 評估|主評估文件]]
