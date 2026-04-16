---
tags: [visustwin, omniverse, extension, simulation, wind]
created: 2026-04-14
ext_id: visustwin.warp.windtunnel
version: 0.1.0
category: Environment Simulation
---

# Visustwin Wind Tunnel

> 建築群風場 Sandbox — 位勢流解析解 + curl noise 視覺化

提供互動式風場模擬環境，使用位勢流解析解搭配 curl noise 擾流，在 USD Stage 中即時渲染流線與建築物。

## Features

**使用者面**
- 可調建築物數量、位置、尺寸、旋轉角度
- 風向（0-360°）與擾流強度連續調整
- 多種色彩視覺化模式（Velocity / Pressure / Vorticity / Direction）
- 建築顏色預設（White / Silver / Gray / Charcoal / Dark / Ice）
- 建築透明度 35%，禁用陰影投射以提升效能

**開發者面**
- 位勢流解析解（渦旋 + 源匯法 + Karman 渦漩）
- `solver.py` 可被 [[Visustwin Wind Analysis]] 匯入
- USD BasisCurves 流線渲染

## Solver — Exported API

```python
from visustwin.warp.windtunnel.solver import (
    compute_streamlines,
    sample_velocity_grid,
    sample_velocity_section,
    DEFAULT_BUILDINGS,
    colorize, COLOR_MODES,
)
```

## USD Prim Structure

```
/World/WindTunnel/
├── Building_0        ← UsdGeom.Cube (transparent)
├── Building_1
└── Streamlines       ← UsdGeom.BasisCurves
```

## Dependencies

`omni.warp.core`, `omni.usd`, `omni.kit.uiapp`

---

← [[Visustwin Extensions MOC]]
