---
tags: [visustwin, omniverse, extension, osc, control]
created: 2026-04-14
ext_id: visustwin.osc.controller
version: 0.1.0
category: Data Connection
---

# Visustwin OSC Controller

> OSC UDP 接收器 — 外部觸控面板控制 USD 場景

監聽 UDP OSC 訊息（iPad TouchOSC / 手機 App），映射到 Omniverse 場景操作。

## Supported OSC Addresses

| Address | Args | Action |
|---------|------|--------|
| `/test` | — | 飛往測試攝影機 |
| `/camera/<name>` | — | 飛往 `/World/Cameras/<name>` |
| `/scene/room/<name>` | — | 顯示指定 Room，隱藏其他 |
| `/lighting/day` | — | 日間預設 (blend=0) |
| `/lighting/night` | — | 夜間預設 (blend=100) |
| `/lighting/blend` | float 0-100 | 日夜連續混合 |
| `/anim/play` | — | 播放時間軸 |
| `/anim/stop` | — | 停止時間軸 |
| `/sequence/lifecycle` | float 0-100 | 120 年生命週期 |
| `/sequence/bim` | — | BIM 巡迴序列 |
| `/sequence/dataflow` | — | Dataflow 視覺化序列 |

## Settings

| Path | Type | Default |
|------|------|---------|
| `/visustwin/osc/port` | int | `8001` |
| `/visustwin/osc/enabled` | bool | `true` |
| `/visustwin/osc/test_camera_path` | string | `/World/Cameras/Camera_01` |

## USD Stage Expectations

- Rooms: `/World/Rooms/<name>`
- Lighting: `/World/Lighting/DayLights` + `NightLights` (displayOpacity blend)
- Sequences: `/World/Cameras/Seq_bim_01`, `Seq_dataflow_01`, ...

## Threading

```
UDP (bg thread) → _on_osc_message() → asyncio.run_coroutine_threadsafe() → Kit main thread
```

## Dependencies

`omni.kit.uiapp` (OSC parser is built-in, no external packages)

---

← [[Visustwin Extensions MOC]]
