---
created: 2026-04-29
tags: [product/VisTwin, plugin/light-compass]
---

# VisTwin Light Compass

方位照度視覺化:**太陽軌跡弧 + 36 方向照度玫瑰圖**,接 MQTT 即時感測器照度數據。

## 基本資訊

| 項目 | 值 |
|---|---|
| Module name | `visustwin.light.compass` |
| Title | VisTwin Light Compass |
| Version | `0.1.0` |
| Repo | [visustwin-extensions](https://github.com/metaarchetech/visustwin-extensions) — `exts/visustwin.light.compass/` |
| 在 [showcase plugin registry](https://github.com/metaarchetech/visustwin-showcase) 的分類 | T3(歸檔候選 — 功能由 `sunlight.studio` + `solar.heatmap` 共同覆蓋) |

> CLAUDE.md 中註記為「ARCHIVE」tier,但**仍存在於 GitHub mirror**,vault 把 README 放回來方便對照。

## 用途

在 USD Stage 中繪製太陽軌跡弧線與 36 方向照度玫瑰圖,接收 [[02 技術/Visustwin/Plugins/mqtt.bridge/README|mqtt.bridge]] 廣播的即時感測器照度(lux)。

## Features

### For Users
- 太陽軌跡弧線視覺化(基於緯度 / 經度 / 時間的天文計算)
- 36 方向照度玫瑰圖(compass rose)
- 即時接收 MQTT 感測器照度
- 顯示當前太陽方位角與仰角
- 啟動 / 停止 / 重新建立按鈕
- 夜間偵測(仰角 < 0 時提示)

### For Developers
- 天文太陽位置計算(`solar.py`)
- USD BasisCurves + Points 幾何建立(`animator.py`)
- 訂閱 `visustwin.mqtt.message` carb event(僅接收 `topic == "env"` 的 `illuminance`)
- Frame update 驅動的動畫

## USD Prim Structure

```
/World/LightCompass/
├── SunArc          ← 太陽軌跡弧 (BasisCurves)
├── SunMarker       ← 當前太陽位置標記
├── CompassRose/    ← 36 方向照度柱
│   ├── Dir_000
│   ├── Dir_010
│   └── ...
└── Labels/         ← 方位標籤 (N/S/E/W)
```

關閉插件或重新建立時自動清除 `/World/LightCompass`。

## Architecture

| Class / Function | File | Description |
|---|---|---|
| `LightCompassExtension` | `extension.py` | IExt 主類別,管理 lifecycle 與 MQTT 訂閱 |
| `LightCompassAnimator` | `animator.py` | 幾何建立與 frame-based 動畫 |
| `sun_position()` | `solar.py` | 計算當前太陽方位角與仰角 |
| `set_illuminance()` | `animator.py` | 更新照度值,調整玫瑰圖高度 |

## File Structure

```
visustwin.light.compass/
├── config/
│   └── extension.toml
└── VisTwin/
    └── light/
        └── compass/
            ├── __init__.py
            ├── extension.py      ← LightCompassExtension
            ├── animator.py       ← Compass rose + sun arc geometry
            └── solar.py          ← Solar position calculation
```

## Dependencies

- `omni.usd`
- `omni.kit.uiapp`
- 訂閱 [[02 技術/Visustwin/Plugins/mqtt.bridge/README|mqtt.bridge]] 的 events

## 跟 SUN 系列的關係

| Ext | 角色 | 跟 light.compass 重疊處 |
|---|---|---|
| [[02 技術/Visustwin/Plugins/sunlight.studio/README|sunlight.studio]] | 全域陽光控制(NOAA + 城市庫) | 太陽位置計算(已用 NOAA 取代) |
| [[02 技術/Visustwin/Plugins/solar.heatmap/README|solar.heatmap]] | 每戶得熱熱圖 | 跟玫瑰圖在概念上重疊 |
| [[02 技術/Visustwin/Plugins/solar.report/README|solar.report]] | matplotlib 報告 | 數值化呈現,跟玫瑰圖互補 |

→ 如果未來歸檔,可以把太陽軌跡弧的 utility 拉到 `sunlight.studio`,玫瑰圖獨立成「環境感測 viz」放別處。

## 返回

- [[02 技術/Visustwin/Plugins/README|Plugins]]
- [[02 技術/Visustwin/README|VisTwin]]
