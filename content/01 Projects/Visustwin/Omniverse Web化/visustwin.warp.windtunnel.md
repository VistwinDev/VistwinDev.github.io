# visustwin.warp.windtunnel — Extension 細節卡

> **Tier: T0** — 核心保留 — 獨立 CFD 模組，優先 port（PRESETS → Massing Pipeline）

## 功能與 UI 結構

建築群 3D 風場 Sandbox。位勢流解析解（Potential Flow）+ curl noise 擾動，計算多棟建築之間的流線軌跡，以 1200–6000 個粒子 + 彩色流線 prim 在 USD Scene 中即時視覺化。支援建築尺寸/位置/風向/亂流強度等參數即時調整。提供 `sample_velocity_grid()` 和 `sample_velocity_section()` 接口供 wind.analysis 使用。

**重要發現**：solver.py 的實際實作使用 **numpy**（純 CPU），而非 `omni.warp.core` GPU 加速。Warp 依賴可能是歷史遺留或計畫中的升級。

## 程式檔案清單

| 檔案 | 職責 |
|---|---|
| `extension.py` | IExt lifecycle + UI controls + 動畫 loop |
| `solver.py` | 位勢流求解器 + 流線計算（**numpy**） |
| `animator.py` | USD Scene prim 建立與每幀位置更新 |
| `preview.py` | 獨立預覽腳本（無 Kit 依賴） |

## 關鍵程式碼片段

```python
# solver.py — 位勢流求解器核心（純 numpy，可移植！）
import numpy as np

PRESETS = {
    "medium": [
        {"name": "Tower_A", "cx": -1000, "cy": -120, "wx": 1500, "wy": 1200,
         "hz": 4800, "angle": 0},
        {"name": "Tower_B", "cx": -800, "cy": 1130, "wx": 1200, "wy": 1000,
         "hz": 4300, "angle": 8},
        {"name": "Tower_C", "cx": 1800, "cy": -1020, "wx": 1400, "wy": 1100,
         "hz": 4500, "angle": -5},
    ],
}

def compute_streamlines(buildings, wind_direction_deg, turbulence,
                        vortex_strength, noise_scale, n_streams=200):
    """位勢流求解 + curl noise → 流線端點列表"""
    # 設定初始流線起點（上風側均勻分布）
    starts = _init_starts(wind_direction_deg, n_streams)
    # 積分流線（4th-order Runge-Kutta）
    paths = [_integrate_path(p, buildings, wind_direction_deg,
                             turbulence, vortex_strength, noise_scale)
             for p in starts]
    return paths

def _velocity_at(pos, buildings, wind_dir, vortex_strength):
    """位勢流速度場 = 自由流 + 各建築渦流疊加"""
    vx, vy = math.cos(math.radians(wind_dir)), math.sin(math.radians(wind_dir))
    for bldg in buildings:
        vx_b, vy_b = _building_vortex(pos, bldg, vortex_strength)
        vx += vx_b; vy += vy_b
    return np.array([vx, vy])
```

```python
# animator.py — USD prim 更新（Kit-specific）
def update_streamline_prims(stage, paths, colorize_fn):
    for i, path in enumerate(paths):
        prim_path = f"/World/WindTunnel/Stream_{i:04d}"
        points_attr = UsdGeom.BasisCurves(
            stage.GetPrimAtPath(prim_path)
        ).GetPointsAttr()
        points_attr.Set(Vt.Vec3fArray([Gf.Vec3f(*p) for p in path]))
```

## Kit 依賴逐項

| 依賴 | 用途 | Web 可替換？ |
|---|---|---|
| `solver.py`（numpy） | 位勢流計算 | ✅ TypeScript 或 Python microservice |
| `omni.warp.core`（dependency） | GPU 加速（**實際未使用**） | ⚠️ 需要時用 WebGPU/WGSL |
| `UsdGeom.BasisCurves` | 流線 3D prim | ❌ Kit USD，web 用 Three.js lines |
| `UsdShade.Material` + `PrimvarReader` | 流線顏色 | ❌ Kit USD，web 用 Three.js material |
| `omni.kit.app update stream` | 每幀動畫 | ✅ requestAnimationFrame |
| `omni.ui` | 參數控制面板 | ✅ React sliders |

## Web 替代方案

**solver.py 可以兩種方式運行在 web 端**：

**方案 A：TypeScript 移植（推薦）**
```typescript
// windSolver.ts — 位勢流求解（RK4 積分）
function computeStreamlines(buildings: Building[], windDeg: number,
  turbulence: number, nStreams = 200): Vec3[][] {
  const starts = initStarts(windDeg, nStreams)
  return starts.map(start => integratePath(start, buildings, windDeg, turbulence))
}
```

**方案 B：Python microservice（保留 solver.py）**
- FastAPI endpoint：`POST /solve` → `{ buildings, windDeg, turbulence }` → 流線 JSON
- Web 端只負責渲染

**Three.js 流線渲染**：
```typescript
// 每條流線 = THREE.TubeGeometry 或 THREE.Line
const points = streamline.map(p => new THREE.Vector3(...p))
const curve = new THREE.CatmullRomCurve3(points)
const geometry = new THREE.TubeGeometry(curve, 30, 0.5, 8, false)
```

**顏色**：Three.js `vertexColors` + 速度幅值映射

## 整併候選（修正）

**CFD WindTunnel 保持獨立 module**，不合併進 EnvAnalysisModule tabs。

**PRESETS dict 抽出 → Massing Pipeline**（關鍵整併點）：
- `solver.py` 裡的 PRESETS dict 與 `solar.heatmap/demo_preset.py` 是**相同資料的重複**
- 原始碼已有 `!! KEEP IN SYNC WITH visustwin.solar.heatmap.demo_preset.py !!` 警告
- 抽出後：windtunnel solver 讀 `massingStore.buildings`，PRESETS dict 廢棄

```python
# 現在（重複）
solver.py: PRESETS = {"medium": [...]}      # ← 和 demo_preset.py 完全一樣
demo_preset.py: PRESETS = {"medium": [...]} # ← KEEP IN SYNC !!

# 抽出後
massingStore.ts: buildings = testPresetAdapter.generate("medium")
solver.ts: computeStreamlines(massingStore.buildings, windDir, ...)
```

- 與 **visustwin.wind.analysis** 是 scene/report pair，web 中是兩個獨立路由
- 與 **solar.heatmap** 關係：兩者不合併，透過共用 massingStore 解決同步問題

## 難度 / 工作量

| 項目 | 評估 |
|---|---|
| **Web 化難度** | **Medium**（solver 可移植，3D 視覺化需 Three.js） |
| **工作量** | **L** |
| **預估 LoC** | ~3000（TS solver + Three.js 流線渲染 + React UI + 動畫 loop） |
| **主要風險** | 3D 流線數量（1200-6000 條）在瀏覽器的效能（需 instancing / WGPU） |
| **快速路徑** | 先做 2D 俯視風場圖（Canvas + ctx.arc）；3D 版用 Three.js InstancedMesh |
| **Warp GPU 升級** | 若需要高保真 3D 風場，可用 WebGPU compute shader（長期） |

---
← [[../Omniverse Web化 評估|主評估文件]]


← [[../MOC|Visustwin MOC]]
