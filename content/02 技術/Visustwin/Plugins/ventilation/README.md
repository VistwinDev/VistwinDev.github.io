---
created: 2026-04-29
tags: [product/VisTwin, plugin/ventilation, sprint/2026-W18]
---

# VisTwin Ventilation

新風 / 冷氣進氣口粒子流場可視化。AIR 系列第三個 ext(在 [[02 技術/VisTwin/Plugins/warp.windtunnel/README|warp.windtunnel]]、[[02 技術/VisTwin/Plugins/wind.analysis/README|wind.analysis]] 之後)。

## 基本資訊

| 項目 | 值 |
|---|---|
| Module name | `visustwin.ventilation` |
| Title | VisTwin Ventilation |
| Version | `0.1.0` |
| Repo | [visustwin-extensions](https://github.com/metaarchetech/visustwin-extensions) commit [`08e0b61`](https://github.com/metaarchetech/visustwin-extensions/commit/08e0b61) |
| Push 時間 | 2026-04-29 21:22 |
| Source 路徑 | `C:\Visustwin\kit-app-template\source\extensions\visustwin.ventilation\` |
| Mirror 路徑 | `C:\Visustwin\visustwin-extensions\exts\visustwin.ventilation\` |

## 用途

模擬冷氣 / 新風出風口噴出氣流的視覺軌跡,做為室內舒適度的 agent display。**不是真 CFD**,是 windtunnel 風格的 precomputed streamline + agent 表現。

## 物理模型

- **盒子**:5 面(4 牆 + 地板),頂部開放(粒子超過頂面 → 視為逃逸 → recycle)
- **進氣口**:平面 quad prim,附 `visustwin:inlet:normal` 法向量屬性
- **粒子初速度**:沿法向量 + 重力下沉
- **碰撞**:AABB 反射 ×0.55 阻尼(4 牆 + 地板)
- **路徑長度**:每顆粒子有 TTL(預設 180 frames ≈ 3 秒),到期 recycle 回隨機進氣口

## Tracer 行為(commit 08e0b61 的 magic)

借鏡 `warp.windtunnel` 的 streamline pattern:**只算一次曲線,per-frame 滑頭**,不做 per-frame 物理。

- **Cohesion zone**:laminar-only 前 ~28 步,讓 jet 保持 cone 形狀直到房間中段
- **Spatial curl modulation**:0.05× cohesion 區 → 0.20× 中段 → `wall_curl_boost×` 牆壁附近(粒子在接觸前就轉彎)
- **Wall avoidance + per-seed random ±swirl**:不同粒子轉彎方向不同(避免群體一致彎)
- **Damped reflection**:真接觸到牆才反射(入射 ≈ 反射)
- **6 walls closed**:4 側 + 地板 + 天花板(`scene.py` 看不到天花板,但 tracer 把 `z=z_max` 當作實心)

## 視覺呈現

3 個 prim:
- `/Streamlines` — BasisCurves,完整曲線集,**靜態**(set 一次)
- `/Trails` — ring-buffer 軌跡,**逐 frame 更新**
- `/Heads` — Points,粒子頭,**逐 frame 更新**

顏色 gradient:**藍 → 黃 → 紅** 沿 streamline arc-length。靜態線一次設好,動態 head/trail 依 phase fraction 滑移。

## UI 操作流程

1. **SPAWN BOX** — 設定 W×D×H 後生成盒子
2. **+ TOP CENTER ↓** 等預設按鈕 — 加進氣口(5 種預設方位)
3. **RUN** — 啟動粒子模擬
4. 調整 Particles / Trail / Gravity / Damping / Path TTL 即時生效

## 主要檔案

| File | 行為 |
|---|---|
| `extension.py`(22.3 KB) | UI panel + Dashboard discovery 接口 |
| `particles.py`(24.9 KB) | 粒子狀態陣列 + ring-buffer + 顏色 |
| `tracer.py`(14.9 KB) | 曲線生成(curl noise + cohesion + wall avoidance) |
| `scene.py`(9.8 KB) | USD 盒子 + inlet quad prim 建立 |

## 整合點

### 進氣口 prim 屬性(程式化建立用)

每個 inlet prim 應有:
- `visustwin:inlet:center` (Float3) — 中心點 cm
- `visustwin:inlet:normal` (Float3) — 法向量(air 噴出方向)
- `visustwin:inlet:speed` (Float) — 初速度 cm/s
- `visustwin:inlet:size` (Float2) — 平面 W×H cm

`scene.add_inlet()` 會自動寫入這些屬性。

### Dashboard 註冊

已在 `visustwin.dashboard.extension` 的 4 個 registry 註冊:
- `_DESCRIPTIONS["visustwin.ventilation"] = "新風粒子流場 · 5 面盒子 + 法向量進氣口 + 重力下沉"`
- `_NAMES_EN["visustwin.ventilation"] = "VENTILATION"`
- `_CLASS_MAP["visustwin.ventilation"] = "VentilationExtension"`
- `_CATEGORIES` 中放在 `"AIR — 空氣"` 分類下

## 已知限制

- 無真 CFD(位勢流 / NS),純 kinematic 粒子 + 反射
- 沒有出風口模型(粒子靠 TTL 與頂部逃逸 recycle)
- 預設 5 種進氣口位置;任意位置請改 `_on_add_preset_inlet` 或用 `visustwin.dev.repl` 直接呼叫 `scene.add_inlet`

## 跟 visionbase 的關係

[[01 專案/visionbase|visionbase]] 實驗室未來若要做室內舒適度 / 通風驗證的展示,這個 ext 是首選的 agent display(不需 CFD 算力,視覺有說服力)。

## 返回

- [[02 技術/VisTwin/Plugins/README|Plugins]]
- [[02 技術/VisTwin/README|VisTwin]]
