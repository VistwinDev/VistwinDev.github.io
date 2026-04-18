# visustwin.camera.travel — Extension 細節卡

## 功能與 UI 結構

攝影機飛行控制面板。自動掃描 USD Stage 中所有 `UsdGeom.Camera` prim，提供下拉選單一鍵觸發平滑飛行動畫（SLERP 插值，90 幀 ≈ 1.5 秒）。若場景無攝影機，自動建立 4 個預設位置（Lobby/Living/Kitchen/Master）。

## 程式檔案清單

| 檔案 | 職責 |
|---|---|
| `extension.py` | IExt lifecycle + 飛行函式 + UI（全在一檔） |

## 關鍵程式碼片段

```python
# extension.py — SLERP 攝影機飛行核心
async def _fly_async(target_path: str, duration_frames: int, on_done=None):
    app = omni.kit.app.get_app()
    await app.next_update_async()
    stage = omni.usd.get_context().get_stage()
    # 讀取目標攝影機的 world transform
    xform = UsdGeom.Xformable(stage.GetPrimAtPath(target_path))
    target_mtx = xform.ComputeLocalToWorldTransform(Usd.TimeCode.Default())
    # SLERP 插值
    for frame in range(duration_frames):
        t = _smooth(frame / duration_frames)  # smoothstep
        pos = Gf.Lerp(t, cur_pos, tgt_pos)
        rot = Gf.Quatd.Slerp(cur_rot, tgt_rot, t)
        # 寫入 active viewport camera transform
        await app.next_update_async()
```

```python
# _DEFAULT_POSES — 預設攝影機位置（Z-up, cm units）
_DEFAULT_POSES = {
    "Camera_Lobby":   (Gf.Vec3d(   0,  600, 180), Gf.Vec3f(75, 0, 180)),
    "Camera_Living":  (Gf.Vec3d( 600,    0, 180), Gf.Vec3f(80, 0,  90)),
    "Camera_Kitchen": (Gf.Vec3d(-600,    0, 180), Gf.Vec3f(80, 0, -90)),
    "Camera_Master":  (Gf.Vec3d(   0,    0, 500), Gf.Vec3f(35, 0,   0)),
}
```

## Kit 依賴逐項

| 依賴 | 用途 | Web 可替換？ |
|---|---|---|
| `omni.usd.get_context()` | 讀取 USD Stage + 攝影機 prim | ❌ 直接依賴 Kit runtime |
| `UsdGeom.Camera` / `Xformable` | 攝影機位姿讀取 | ❌ Kit-only |
| `omni.kit.app.next_update_async()` | 每幀動畫循環 | ✅ requestAnimationFrame |
| `Gf.Quatd.Slerp` | 四元數插值 | ✅ Three.js Quaternion.slerp |
| `omni.kit.viewport.utility` | 設定 active viewport 攝影機 | ❌ Kit-only |
| `omni.ui` | ComboBox + Button UI | ✅ React Select + Button |

## Web 替代方案

**情境 A：Kit 保留做渲染服務器（推薦短期）**
- Web 端按鈕 → WebSocket/OSC 命令 → Kit 端 camera.travel 執行飛行
- WebController 已實作此路徑（`/camera/<name>` → OSC → Kit）
- **等於此 extension 的控制端已被 WebController 取代**

**情境 B：Web 端完整 3D 渲染（長期）**
- Three.js `PerspectiveCamera` + GSAP CameraAnimation
- `camera.position.lerp()` + `quaternion.slerp()` 實現相同飛行效果
- 約 300 LoC TypeScript

## 整併候選

- 與 **visustwin.osc.controller** 高度重疊：OSC `/camera/<name>` 指令已做同樣事
- 與 **visustwin.exhibition.board** 共用 camera 下拉（board 也有攝影機選擇）
- 建議合併成 `PresentationModule > CameraPanel` 頁籤

## 難度 / 工作量

| 項目 | 評估 |
|---|---|
| **Web 化難度** | **Hard**（直接操作 USD + Viewport camera） |
| **工作量** | **S**（若用 Kit 保留方案）/ **M**（若做 Three.js 版） |
| **預估 LoC** | ~300（Three.js camera animation） |
| **主要風險** | 飛行動畫的 USD camera 讀取無法在 web 執行 |
| **快速路徑** | WebController 已覆蓋此功能，Kit 端 ext 保留做執行者 |

---
← [[../Omniverse Web化 評估|主評估文件]]
