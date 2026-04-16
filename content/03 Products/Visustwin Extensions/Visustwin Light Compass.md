---
tags: [visustwin, omniverse, extension, simulation, solar, illuminance]
created: 2026-04-14
ext_id: visustwin.light.compass
version: 0.1.0
category: Environment Simulation
---

# Visustwin Light Compass

> 方位照度視覺化 — 太陽軌跡弧 + 36 方向照度玫瑰圖

在 USD Stage 中繪製太陽軌跡弧線與 36 方向照度玫瑰圖，可接收 [[Visustwin MQTT Bridge]] 廣播的即時感測器照度（lux）數據。

## Features

- 太陽軌跡弧線（天文位置計算 `solar.py`）
- 36 方向照度玫瑰圖（compass rose）
- 即時 MQTT 照度數據接收
- 顯示太陽方位角與仰角
- 夜間偵測（仰角 < 0）
- 啟動/停止/重新建立控制

## MQTT Integration

訂閱 `visustwin.mqtt.message` event，僅接收 `topic == "env"` 的 `data.illuminance` 欄位。

## USD Prim Structure

```
/World/LightCompass/
├── SunArc          ← BasisCurves
├── SunMarker       ← 當前位置
├── CompassRose/    ← 36 方向照度柱
└── Labels/         ← N/S/E/W
```

## Key Modules

- `extension.py` — lifecycle + MQTT subscribe
- `animator.py` — compass rose + sun arc geometry
- `solar.py` — 天文太陽位置計算

## Dependencies

`omni.usd`, `omni.kit.uiapp` (subscribes [[Visustwin MQTT Bridge]] events)

---

← [[Visustwin Extensions MOC]]
