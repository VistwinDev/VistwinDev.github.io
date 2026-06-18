# visustwin.light.compass — Extension 細節卡

> **Tier: T3 — 刪除** — 太陽方位舊插件。compass/solar.py 完整複製 sunlight.studio/sun_calculator.py 算法；3D 羅盤裝飾無獨立 port 價值

## 功能與 UI 結構

方位照度視覺化。在 USD Stage 中建立 36 方向照度玫瑰圖（3D 弧形圖）和太陽軌跡弧線，顯示各方位的實際照度分佈。接收 Carb Event Bus 上的 `visustwin.mqtt.message` 事件，可疊加 Welltek 真實感測器照度數據。透過 frame subscription 進行即時動畫更新。

## 程式檔案清單

| 檔案 | 職責 |
|---|---|
| `extension.py` | IExt lifecycle + UI + 事件訂閱 |
| `solar.py` | 太陽方位角/仰角計算 + 照度模型 |
| `animator.py` | USD Scene 中的玫瑰圖 3D prim 動畫 |

## 關鍵程式碼片段

```python
# solar.py — 36 方向照度計算
def compute_illuminance_rose(
    elevation_deg: float,
    azimuth_deg: float,
    directions: int = 36
) -> List[float]:
    """計算各方位的照度值（lux），考慮直射 + 散射"""
    result = []
    for i in range(directions):
        dir_az = (360 / directions) * i
        # 計算該方向與太陽方位角的角度差
        angle_diff = abs(dir_az - azimuth_deg) % 360
        if angle_diff > 180: angle_diff = 360 - angle_diff
        # 修正因子：cos(仰角) × max(0, cos(方位差))
        illum = DNI * math.cos(math.radians(elevation_deg)) * \
                max(0, math.cos(math.radians(angle_diff)))
        result.append(illum)
    return result
```

```python
# animator.py — 在 USD Stage 建立 3D 玫瑰圖 prim
def update_rose_prims(stage, illuminance: List[float], max_lux: float):
    for i, lux in enumerate(illuminance):
        az = (360 / 36) * i
        height = (lux / max_lux) * MAX_HEIGHT_CM
        prim_path = f"/World/LightCompass/Rose_{i:02d}"
        # 更新 UsdGeom.Cube 的 height（scale Y）
        xform = UsdGeom.Xformable(stage.GetPrimAtPath(prim_path))
        # ... 更新 scaleOp
```

## Kit 依賴逐項

| 依賴 | 用途 | Web 可替換？ |
|---|---|---|
| `carb.events` + `visustwin.mqtt.message` | 接收 MQTT 即時照度 | ✅ WebSocket 訂閱 |
| `omni.usd` / `UsdGeom` | 3D 玫瑰圖 prim 建立與更新 | ⚠️ Three.js 替代 |
| `omni.kit.app.get_update_event_stream()` | 每幀動畫 | ✅ requestAnimationFrame |
| `omni.ui` | 控制面板 UI | ✅ React |
| `solar.py`（純數學） | 照度計算邏輯 | ✅ 直接移植 TypeScript |

## Web 替代方案

**solar.py 照度計算**：純數學，直接移植 TypeScript（< 100 LoC）。

**玫瑰圖視覺化有兩個層次**：
1. **2D 玫瑰圖**（較 easy）→ D3.js radial bar chart 或 Recharts RadarChart
2. **3D 玫瑰圖**（較 medium）→ Three.js instanced bar geometry

```typescript
// 2D 版本（推薦）— D3.js polar/radar chart
const roseData = illuminanceRose.map((lux, i) => ({
  direction: (360 / 36) * i,  // 0-350°
  lux
}))
// → Recharts RadarChart 或 D3 arc path
```

**MQTT 數據疊加**：
- welltek-twin 的 WebSocket 已提供 env 裝置（temp/humidity/CO2）
- 照度感測器若有接入：直接從 `ws://localhost:3001` 訂閱

## 整併候選

- 與 **visustwin.sunlight.studio** 強度耦合（共用太陽位置計算）
- 與 **visustwin.solar.heatmap** 同樣用太陽方位計算
- 建議整合進 `EnvAnalysisModule > 日照頁籤` 的子視圖

## 難度 / 工作量

| 項目 | 評估 |
|---|---|
| **Web 化難度** | **Medium**（計算 easy，3D 視覺化 medium） |
| **工作量** | **S** |
| **預估 LoC** | ~600（TS solar calc + React polar chart） |
| **主要風險** | 3D 玫瑰圖要求高時需 Three.js，低保真用 D3 polar 即可 |
| **快速路徑** | 先做 2D polar chart（D3/Recharts），3D 版本之後加入 |

---
← [[../Omniverse Web化 評估|主評估文件]]


← [[Products/VisTwin/README|VisTwin]]
