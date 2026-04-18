# visustwin.sunlight.studio — Extension 細節卡

> **Tier: T0** — 核心保留 — 獨立 Sunlight 模組，NOAA 算法唯一正確來源

## 功能與 UI 結構

全域陽光控制中樞。城市選擇（含台北等 N 座城市）、日期選擇、24 小時時間滑桿，實時計算真實太陽位置（NOAA 演算法），驅動 USD Stage 中 `/World/VisustwinSun` 的 `UsdLux.DistantLight` 方向與強度，控制整個場景的全域照明（Hydra/RTX 光追）。其他插件（solar.heatmap、light.compass）透過 carb.settings 讀取太陽位置。

## 程式檔案清單

| 檔案 | 職責 |
|---|---|
| `extension.py` | IExt lifecycle + Dashboard 協議 |
| `ui_window.py` | 城市/日期/時間控制 UI（omni.ui） |
| `sun_calculator.py` | NOAA 太陽位置算法（純 Python math） |
| `cities.py` | 城市資料庫（名稱/緯度/經度/時區） |
| `scene_light.py` | UsdLux.DistantLight 操作 |

## 關鍵程式碼片段

```python
# sun_calculator.py — NOAA 演算法（純 Python，可直接移植）
def sun_position(lat, lon, year, month, day, hour, tz_offset) -> SunPosition:
    doy = day_of_year(year, month, day)
    # Julian Day 轉換
    jd = julian_day(year, month, day)
    # 方程式修正 + 視時角計算
    eqt = equation_of_time(jd)
    declination = solar_declination(doy)
    hour_angle = local_hour_angle(lon, hour, tz_offset, eqt)
    # 高度角 + 方位角
    elevation = math.degrees(math.asin(
        math.sin(math.radians(lat)) * math.sin(math.radians(declination)) +
        math.cos(math.radians(lat)) * math.cos(math.radians(declination)) *
        math.cos(math.radians(hour_angle))
    ))
    return SunPosition(elevation=elevation, azimuth=azimuth, ...)
```

```python
# scene_light.py — 驅動 USD DistantLight（Kit-specific 核心）
from pxr import UsdLux, UsdGeom, Gf

def update_sun_light(stage, elevation_deg: float, azimuth_deg: float, intensity: float):
    sun = stage.GetPrimAtPath("/World/VisustwinSun")
    if not sun:
        sun = UsdLux.DistantLight.Define(stage, "/World/VisustwinSun")
    # 設定光線角度（USD Z-up 座標系轉換）
    xform = UsdGeom.Xformable(sun)
    rot_x = 90 - elevation_deg
    rot_z = -azimuth_deg + 90
    xform.AddRotateXYZOp().Set(Gf.Vec3f(rot_x, 0, rot_z))
    UsdLux.DistantLight(sun).GetIntensityAttr().Set(intensity * 50000)
```

## Kit 依賴逐項

| 依賴 | 用途 | Web 可替換？ |
|---|---|---|
| `sun_calculator.py` | NOAA 演算法（純數學） | ✅ 直接移植 TypeScript |
| `cities.py` | 城市資料庫（純資料） | ✅ JSON file |
| `scene_light.py` + `pxr.UsdLux` | 驅動 USD DistantLight | ❌ Kit/RTX only |
| `carb.settings` | 向其他插件廣播太陽位置 | ✅ Zustand store |
| `omni.ui` | 城市/日期/時間控制 UI | ✅ React sliders + selects |

## Web 替代方案

**sun_calculator.py 完全可移植**（純 NOAA 演算法，< 150 LoC）：

```typescript
// sunCalculator.ts
export interface SunPosition { elevation: number; azimuth: number; intensity: number }

export function sunPosition(lat: number, lon: number,
  year: number, month: number, day: number,
  hour: number, tzOffset: number): SunPosition {
  const doy = dayOfYear(year, month, day)
  const jd = julianDay(year, month, day)
  // ... NOAA 演算法移植
  return { elevation, azimuth, intensity }
}
```

**Web 端 UI**：
- 城市選擇 → React Select（或 Combobox）
- 日期 → `<input type="date">`
- 時間滑桿 → Radix UI Slider（已有 DNA）

**USD DistantLight**：
- Three.js 版：`DirectionalLight` + 方向向量計算（elevation/azimuth → xyz）
- Kit 版（RTX）：web 送設定 → Kit 端透過 carb.settings 更新，scene_light.py 執行

## 整併候選

- 是 solar 家族（solar.heatmap、solar.report、light.compass）的**數據根源**
- 在 web 中應成為 `useSunPosition` hook，供所有日照相關 module 共用
- 與 **solar.heatmap** 建議合併為 `SolarAnalysisModule > 時間設定頁籤`

## 難度 / 工作量

| 項目 | 評估 |
|---|---|
| **Web 化難度** | **Medium**（計算 Easy，USD 光線控制 Hard） |
| **工作量** | **S** |
| **預估 LoC** | ~600（TS 計算 + React UI + WebSocket 通知 Kit 更新光線） |
| **主要風險** | RTX 場景光線更新必須保留在 Kit；web 只能設定參數不能直接渲染 |
| **快速路徑** | 先做 web UI + TS 計算；透過 carb.settings bridge 更新 Kit 場景 |

---
← [[../Omniverse Web化 評估|主評估文件]]
