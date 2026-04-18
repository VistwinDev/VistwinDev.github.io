# visustwin.vision.detector — Extension 細節卡

> **Tier: T0** — 核心保留 — 程式碼完整，待攝影機設定後即可部署

## 功能與 UI 結構

AI 安全偵測視覺化。連接 visustwin-vision YOLO 伺服器（WebSocket `ws://localhost:8765`），接收即時偵測結果（camera_id、bounding boxes、class labels、confidence），在 Omniverse Viewport 上疊加偵測框與警報。透過 Carb Event Bus 廣播偵測事件給其他插件。

## 程式檔案清單

| 檔案 | 職責 |
|---|---|
| `extension.py` | IExt lifecycle + 事件廣播 + viewport overlay |
| `ws_client.py` | VisionWsClient（WebSocket 背景執行緒） |
| `ui_window.py` | 連線狀態 + 偵測統計 UI |

## 關鍵程式碼片段

```python
# ws_client.py — 與 mqtt.bridge 相同模式，不同 server
class VisionWsClient:
    def _run(self):
        import websocket as ws_lib
        def on_message(ws, msg):
            data = json.loads(msg)
            self._on_message_cb(data)
        ws_lib.WebSocketApp(
            f"ws://{self._host}:{self._port}",
            on_message=on_message
        ).run_forever()
```

```python
# extension.py — 接收偵測結果格式
# {
#   "camera_id": "CAM_001",
#   "timestamp": 1703123456.789,
#   "detections": [
#     {"class": "person", "confidence": 0.95, "bbox": [x1, y1, x2, y2]},
#     {"class": "hardhat_missing", "confidence": 0.87, "bbox": [...]}
#   ],
#   "alerts": [{"severity": "HIGH", "category": "PPE_VIOLATION"}]
# }

EVENT_DETECTION = carb.events.type_from_string("visustwin.vision.detection")
EVENT_ALERT     = carb.events.type_from_string("visustwin.vision.alert")

def _on_ws_message(self, data: dict):
    self._event_stream.push(EVENT_DETECTION, payload=data)
    if data.get("alerts"):
        for alert in data["alerts"]:
            self._event_stream.push(EVENT_ALERT, payload=alert)
```

## Kit 依賴逐項

| 依賴 | 用途 | Web 可替換？ |
|---|---|---|
| `websocket-client` (via pipapi) | WS 客戶端 | ✅ 瀏覽器原生 WebSocket |
| `carb.events` | 偵測事件廣播 | ✅ CustomEvent / Zustand |
| `omni.ui` | 偵測統計面板 | ✅ React |
| `omni.kit.app` | Event stream | ✅ 不需要 |
| Viewport overlay（bounding box） | 在 RTX viewport 上畫框 | ⚠️ 需 omni.kit.overlay 或改用 Canvas |
| `carb.settings` | server_host/port | ✅ env vars |

## Web 替代方案

**WebSocket 連線完全相同**——視覺化部分需要決策：

**方案 A：視訊串流 overlay（最完整）**
- visustwin-vision 提供 MJPEG 或 WebRTC 視訊串流
- Web 端：`<canvas>` overlay on `<video>` → 繪製 bounding box
```typescript
// 接收偵測結果，在 canvas 上繪框
ws.onmessage = (e) => {
  const { detections } = JSON.parse(e.data)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  detections.forEach(det => {
    const [x1, y1, x2, y2] = det.bbox
    ctx.strokeStyle = det.class.includes("missing") ? "#ff3333" : "#33ff33"
    ctx.strokeRect(x1, y1, x2 - x1, y2 - y1)
  })
}
```

**方案 B：純數據 Dashboard（不顯示視訊）**
- 只顯示偵測統計、警報歷史、設備狀態
- React table + alert badges，約 500 LoC

**已有服務**：`D:\Visustwin\visustwin-vision`（Python YOLO server）已完整實作，只需 web client。

## 整併候選

- 與 **visustwin.mqtt.bridge** 模式完全相同（WS client → Carb event broadcast）
- 建議整合進 `SafetyModule` → 頁籤：`偵測 Feed | 警報歷史 | 設備狀態`

## 難度 / 工作量

| 項目 | 評估 |
|---|---|
| **Web 化難度** | **Medium** |
| **工作量** | **M** |
| **預估 LoC** | ~1000（WS client + Canvas overlay + React dashboard） |
| **主要風險** | Viewport overlay 替換（Canvas over video vs RTX overlay 視覺效果差異） |
| **快速路徑** | 先做純數據 dashboard（B 方案），視訊 overlay 之後加 |

---
← [[../Omniverse Web化 評估|主評估文件]]
