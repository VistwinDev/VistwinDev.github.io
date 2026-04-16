---
tags: [visustwin, omniverse, extension, presentation, camera]
created: 2026-04-14
ext_id: visustwin.camera.travel
version: 0.1.0
category: Presentation
---

# Visustwin Camera Travel

> 攝影機飛行控制面板 — 點擊即滑順飛往指定攝影機

自動掃描場景中所有 `UsdGeom.Camera`，一鍵 Hermite 平滑飛行。

## Features

- 自動掃描 USD Stage 所有 Camera prim
- 下拉選單即時切換目標
- Hermite smoothstep fly（90 frames ~1.5s @ 60fps）+ Quaternion Slerp
- 自動建立預設攝影機（場景 < 4 cameras 時）
- 公開 `_fly_to()` API 供其他插件呼叫

## Default Cameras

| Camera | Position | Rotation |
|--------|----------|----------|
| Camera_Lobby | (0, 600, 180) | (75, 0, 180) |
| Camera_Living | (600, 0, 180) | (80, 0, 90) |
| Camera_Kitchen | (-600, 0, 180) | (80, 0, -90) |
| Camera_Master | (0, 0, 500) | (35, 0, 0) |

## Public API

```python
from visustwin.camera.travel.extension import _fly_to
_fly_to("/World/Cameras/Camera_Lobby", duration_frames=90, on_done=callback)
```

[[Visustwin OSC Controller]] 的 `/camera/<name>` 即是呼叫此 API。

## Dependencies

`omni.usd`, `omni.kit.uiapp`

---

← [[Visustwin Extensions MOC]]
