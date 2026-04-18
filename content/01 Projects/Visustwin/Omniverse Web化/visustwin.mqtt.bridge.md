# visustwin.mqtt.bridge — Extension 細節卡

> **Tier: T2** — 已被取代 — welltek-twin 已完整實作 MQTT IoT dashboard，Kit 端退役

## 功能與 UI 結構

Welltek IoT 數據橋接器。連接 welltek-twin Node.js WS 服務器（`ws://localhost:3001`），接收 JSON 格式設備數據（plug/env/ac/hrv 四種類型），計算 Wellness Index，透過 Carb Event Bus 廣播給其他插件使用。UI 是一個連線狀態面板，顯示各設備最新讀數。

## 程式檔案清單

| 檔案 | 職責 |
|---|---|
| `extension.py` | IExt lifecycle + 事件廣播 |
| `ws_client.py` | WelltekWsClient（WebSocket 背景執行緒） |
| `mqtt_client.py` | 設備數據解析 + Wellness Index 計算 |
| `ui_window.py` | 連線狀態 + 設備讀數 UI |

## 關鍵程式碼片段

```python
# ws_client.py — WebSocket 背景執行緒（唯一核心邏輯）
class WelltekWsClient:
    def start(self) -> bool:
        self._thread = threading.Thread(target=self._run, daemon=True)
        self._thread.start()
        return True

    def _run(self):
        import websocket as ws_lib
        def on_open(ws):
            ws.send(json.dumps({"type": "register", "name": "Omniverse"}))
        ws_lib.WebSocketApp(self._url, on_message=self._on_msg).run_forever()

    def _on_msg(self, ws, msg):
        data = json.loads(msg)
        self._on_message_cb(data)
```

```python
# extension.py — 廣播到 Carb Event Bus
EVENT_MQTT_MSG = carb.events.type_from_string("visustwin.mqtt.message")
EVENT_WELLNESS = carb.events.type_from_string("visustwin.wellness.update")

def _on_ws_message(self, data: dict):
    self._event_stream.push(EVENT_MQTT_MSG, payload=data)
    if data.get("type") == "wellness_update":
        self._event_stream.push(EVENT_WELLNESS, payload=data)
```

## Kit 依賴逐項

| 依賴 | 用途 | Web 可替換？ |
|---|---|---|
| `websocket-client` (via pipapi) | WS 客戶端 | ✅ 瀏覽器原生 WebSocket |
| `carb.events` | 廣播 MQTT 事件 | ✅ CustomEvent / Zustand |
| `omni.kit.app` | Event stream 取得 | ✅ 不需要（直接回調） |
| `omni.ui` | 狀態 UI | ✅ React |
| `carb.settings` | broker_host/port 設定 | ✅ env vars |
| threading | 背景 WS 執行緒 | ✅ 瀏覽器 WebSocket 本身非同步 |

## Web 替代方案

**這個 extension 是所有插件中 web 化最自然的**——它本身就是 WebSocket client：

```typescript
// web 版 MqttBridge.ts — 直接用瀏覽器 WebSocket
const ws = new WebSocket("ws://localhost:3001")
ws.onopen = () => ws.send(JSON.stringify({ type: "register", name: "WebApp" }))
ws.onmessage = (e) => {
  const data = JSON.parse(e.data)
  zoneStore.getState().updateFromMqtt(data)
  // 廣播到 React state，取代 Carb Event Bus
}
```

實際上 **welltek-twin 的 web frontend 已經完整實作了這個邏輯**（welltek-twin/src）。

**結論**：此 extension 在 web 化後等於 **已被 welltek-twin web frontend 取代**，不需要額外開發。

## 整併候選

- **直接被 welltek-twin React frontend 取代**
- Kit 端仍需保留此 extension（供 light.compass / exhibition.board 等讀 MQTT 數據）
- Web 端：welltek-twin 的 `useWebSocket` hook 即為完整替代

## 難度 / 工作量

| 項目 | 評估 |
|---|---|
| **Web 化難度** | **Easy**（已被現有 web 資產取代） |
| **工作量** | **0**（welltek-twin 已做完） |
| **建議** | Kit 端保留 extension 做為其他 Kit 插件的 MQTT event hub；Web 端用 welltek-twin |
| **注意** | 若 welltek-twin 要移植 MQTT 事件到其他 web module，抽出 `useMqttBridge` hook 即可 |

---
← [[../Omniverse Web化 評估|主評估文件]]


← [[../MOC|Visustwin MOC]]
