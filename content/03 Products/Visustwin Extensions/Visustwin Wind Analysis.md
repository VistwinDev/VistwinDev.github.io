---
tags: [visustwin, omniverse, extension, simulation, wind, analysis]
created: 2026-04-14
ext_id: visustwin.wind.analysis
version: 0.1.0
category: Environment Simulation
---

# Visustwin Wind Analysis

> 風場分析與行人舒適度評估 — 基於位勢流模型

匯入 [[Visustwin Wind Tunnel]] 的 solver 模組，在指定高度取樣風速場，計算行人舒適度指標並自動產出分析圖表報告。

## Features

- 一鍵產出 5 張圖表 + 統計數據（speed / amplification / comfort / pressure / vectors）
- 可調參數：風向、擾流、取樣高度、參考風速、網格解析度
- 進階：渦旋強度、噪聲尺度、垂直偏轉
- 自動同步 Wind Tunnel 建築配置
- 垂直截面分析（順風向 + 橫風向）
- 報告視窗可獨立彈出

## Parameters

| Parameter | Range | Default |
|-----------|-------|---------|
| Wind Dir | 0-360° | 45° |
| Turbulence | 0-0.50 | 0.15 |
| Sample Z | 50-500 cm | 150 cm |
| Ref Speed | 1-30 m/s | 10 m/s |
| Grid Res | 50-200 | 100 |

## Analysis Pipeline

1. Sync buildings (from USD or defaults)
2. Import solver from Wind Tunnel
3. Sample NxN velocity grid at z_height
4. Sample 2 vertical sections
5. Generate 5 charts + `summary.json`
6. Open ReportWindow

## Report Output

`output/wind_{dir}deg_{timestamp}/` containing: `speed_map.png`, `amplification_map.png`, `comfort_map.png`, `pressure_map.png`, `vector_field.png`, `summary.json`

## Dependencies

`visustwin.warp.windtunnel` (solver), `omni.usd`, `omni.kit.uiapp`

---

← [[Visustwin Extensions MOC]]
