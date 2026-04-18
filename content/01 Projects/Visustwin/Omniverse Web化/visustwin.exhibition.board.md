# visustwin.exhibition.board — Extension 細節卡

## 功能與 UI 結構

第二螢幕展覽看板。左側嵌入 Omniverse Viewport（RTX 渲染），右側顯示可切換的資訊面板（MQTT/OSC/WindTunnel/REPL 狀態）。具備「移動到獨立 OS 視窗」功能（使用 Windows `ctypes.windll.user32`），讓 Kit 主視窗與展覽看板可分開顯示在不同螢幕。

## 程式檔案清單

| 檔案 | 職責 |
|---|---|
| `extension.py` | IExt lifecycle + Dashboard 協議 |
| `ui_window.py` | 展覽看板 UI：左側 Viewport + 右側 Panel |

## 關鍵程式碼片段

```python
# ui_window.py — 嵌入 Omniverse Viewport（關鍵 Kit-only 依賴）
import omni.kit.viewport.window as vp_win
import omni.kit.widget.viewport as vp_widget

class ExhibitionBoardWindow(ui.Window):
    def _build_viewport_section(self):
        # 建立 Kit Viewport widget（渲染 RTX 畫面）
        self._viewport = vp_widget.ViewportWidget(...)
        # 設定攝影機
        self._viewport.camera_path = "/World/Cameras/Camera_Lobby"
```

```python
# ui_window.py — 移動到獨立 OS 視窗（Windows-only）
import ctypes
user32 = ctypes.windll.user32
hwnd = user32.FindWindowW(None, "Visustwin Exhibition Board")
if hwnd:
    user32.ShowWindow(hwnd, 9)   # SW_RESTORE
    user32.SetForegroundWindow(hwnd)
```

```python
# ui_window.py — 右側資訊面板設計
_PANELS = OrderedDict([
    ("MQTT",   _build_mqtt_panel),
    ("OSC",    _build_osc_panel),
    ("WIND",   _build_wind_panel),
    ("REPL",   _build_repl_panel),
])
# 按鈕切換 panel，讀取 carb.settings 狀態值
```

## Kit 依賴逐項

| 依賴 | 用途 | Web 可替換？ |
|---|---|---|
| `omni.kit.viewport.window` | 嵌入 RTX viewport | ❌ Kit-only（最關鍵依賴） |
| `omni.kit.widget.viewport` | Viewport widget | ❌ Kit-only |
| `omni.kit.viewport.utility` | 攝影機路徑設定 | ❌ Kit-only |
| `ctypes.windll.user32` | OS 視窗控制 | ❌ Windows-only，web 無等效 |
| `carb.settings` | 讀取各插件狀態 | ✅ WebSocket / REST |
| `omni.ui` | 整體 UI 框架 | ✅ React |

## Web 替代方案

展覽看板是所有 extension 中 **web 化最複雜的**，核心是 RTX viewport 渲染。

**方案 A：WebRTC 視訊串流（建議）**
- Kit 端：啟用 Omniverse Streaming（`omni.kit.livestream.webrtc`）
- Web 端：接收 WebRTC 串流，以 `<video>` 標籤顯示 RTX 畫面
- 右側 Panel → React component 接 MQTT WebSocket

**方案 B：Pixel Streaming（Omniverse Cloud）**
- Omniverse Cloud Streaming 方案
- 需 NVIDIA 帳號 + 雲端 GPU

**方案 C：Three.js 替代渲染（低保真）**
- 放棄 RTX 品質，用 Three.js WebGL 渲染模型
- 適合不需要光追的展示情境

**右側資訊 Panel** → React component，接 welltek-twin WebSocket（已實作）

## 整併候選

- 右側資訊面板的內容（MQTT/OSC 狀態）與 **welltek-twin** 高度重疊
- 攝影機選擇與 **visustwin.camera.travel** 重疊
- 整合方向：web 版 exhibition board = `PresentationModule` → 頁籤：`攝影機控制 | 展覽設定 | 連線狀態`

## 難度 / 工作量

| 項目 | 評估 |
|---|---|
| **Web 化難度** | **Hard**（RTX viewport 必須保留在 Kit） |
| **工作量** | **L**（WebRTC streaming 設置 + React UI） |
| **預估 LoC** | ~2000（WebRTC receiver + React panel + camera control） |
| **主要風險** | WebRTC streaming 需 NVIDIA Omniverse Streaming SDK，延遲與畫質需測試 |
| **快速路徑** | 先做 React 版右側 Panel（接 welltek-twin），左側暫用 iframe/video |

> **決策點**：RTX 畫面要用 WebRTC streaming 還是直接捨棄改用 Three.js？這是整個 web 化最大的架構決策之一。

---
← [[../Omniverse Web化 評估|主評估文件]]
