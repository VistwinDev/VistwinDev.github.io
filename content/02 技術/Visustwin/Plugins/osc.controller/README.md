---
tags: [VisTwin, omniverse, extension, osc, control]
created: 2026-04-14
ext_id: visustwin.osc.controller
version: 0.1.0
category: Data Connection
---

# VisTwin OSC Controller

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

## Web化 評估 / 技術細節

> **Tier: T2** — 已被取代 — WebController（React + OSC Bridge）已完整實作所有控制路由，Kit 端退役

### 功能與 UI 結構

OSC UDP 接收器與場景控制分發器。監聽 UDP port 8001，接收 OSC 指令並對應到 USD Scene 動作：攝影機飛行、房間可見性切換、日夜照明 blend、Timeline 播放、120 年生命週期 scrubber、攝影機序列巡遊。UI 是一個連線狀態面板顯示最後收到的 OSC 訊息。

### 程式檔案清單

| 檔案 | 職責 |
|---|---|
| `extension.py` | IExt lifecycle + OSC 分發邏輯 + USD 動作 |
| `osc_server.py` | UDP OSC 伺服器（背景執行緒） |
| `camera_fly.py` | 攝影機飛行實作（與 camera.travel 邏輯相同） |
| `ui_window.py` | 連線狀態 UI |

### 關鍵程式碼片段

```python
# extension.py — OSC 指令分發（完整路由表）
def _dispatch(self, address: str, args):
    if address == "/test":
        camera_fly_to(DEFAULT_TEST_CAM)
    elif address.startswith("/camera/"):
        cam_name = address.split("/", 2)[-1]
        camera_fly_to(f"/World/Cameras/{cam_name}")
    elif address.startswith("/scene/room/"):
        room = address.split("/")[-1]
        asyncio.run_coroutine_threadsafe(
            self._set_room_visibility(room), event_loop)
    elif address == "/lighting/blend":
        value = float(args[0])
        asyncio.run_coroutine_threadsafe(
            self._set_lighting_blend(value), event_loop)
    elif address == "/sequence/lifecycle":
        value = float(args[0])
        asyncio.run_coroutine_threadsafe(
            self._set_lifecycle(value), event_loop)
```

```python
# _set_lighting_blend — 日夜照明控制（操作 USD Stage /World/Lighting）
async def _set_lighting_blend(self, value: float):
    lighting = stage.GetPrimAtPath("/World/Lighting")
    night_t = value / 100.0
    for p in lighting.GetChildren():
        img = UsdGeom.Imageable(p)
        if p.GetName() == "DayLights":
            img.MakeVisible() if night_t < 1 else img.MakeInvisible()
        elif p.GetName() == "NightLights":
            img.MakeVisible() if night_t > 0 else img.MakeInvisible()
```

### Kit 依賴逐項

| 依賴 | 用途 | Web 可替換？ |
|---|---|---|
| `python-osc` (OSC server) | UDP 接收器 | ✅ WebController Node.js 已實作 |
| `omni.usd` + `pxr.UsdGeom.Imageable` | Room visibility toggle | ❌ Kit USD 操作 |
| `omni.timeline` | Timeline play/stop | ❌ Kit-only |
| `omni.usd` + `UsdShade` | Lighting blend | ❌ Kit USD 操作 |
| `camera_fly.py` | 攝影機飛行 | ❌ Kit USD 操作 |
| `carb.settings` / `carb.events` | 狀態廣播 | ✅ WebSocket |
| `omni.ui` | 狀態 UI | ✅ React |

### Web 替代方案

**此 extension 的控制端已被 WebController 完全取代**：

WebController（React + Vite）→ Node.js bridge → OSC UDP → `osc.controller` 在 Kit 執行 USD 動作

```
WebController UI ──WebSocket──▶ bridge.js ──OSC/UDP──▶ visustwin.osc.controller ──▶ USD Stage
```

**結論**：
- **控制前端（Web）**：WebController 已做
- **執行後端（Kit）**：osc.controller extension 保留
- **直接新增的 web 指令**：只需在 WebController 加新按鈕，不需要改 Kit 端

Web 化後 osc.controller 的職責變成：**Kit 端 RPC server**，不再需要 UI window。

### 整併候選

- 與 **visustwin.camera.travel** 有相同的 camera_fly 邏輯（兩個地方都實作了）
- 建議：合併 camera_fly 為共用模組，osc.controller 只保留 dispatch 邏輯
- Web 端：WebController 是唯一前端，不需要 web 版 OSC controller

### 難度 / 工作量

| 項目 | 評估 |
|---|---|
| **Web 化難度** | **Easy**（已被 WebController 取代） |
| **工作量** | **0**（新指令只需加 WebController 按鈕） |
| **Kit 端角色** | 保留為 OSC → USD 動作執行器（headless，去掉 UI window） |
| **camera_fly 重複** | 需與 camera.travel 合併為共用模組（S 工作量） |

---

← [[02 技術/Visustwin/Plugins/README|VisTwin Plugins]]
