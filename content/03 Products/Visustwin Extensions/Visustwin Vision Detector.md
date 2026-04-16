---
tags: [visustwin, omniverse, extension, ai, yolo, safety]
created: 2026-04-14
ext_id: visustwin.vision.detector
version: 0.1.0
category: Safety & Monitoring
---

# Visustwin Vision Detector

> AI 安全偵測 Overlay — 串接 YOLO 即時影像分析伺服器

連接 visustwin-vision YOLO 伺服器，接收即時偵測結果與安全告警，在 Viewport 中顯示 overlay。

## Settings

| Path | Type | Default |
|------|------|---------|
| `/visustwin/vision/server_host` | string | `localhost` |
| `/visustwin/vision/server_port` | int | `8765` |
| `/visustwin/vision/enabled` | bool | `true` |

## Message Types

- **`hello`** — 連線建立：cameras + analyzers 清單
- **`detection_frame`** — 每幀偵測結果：camera_id + detections (class, confidence, bbox)
- **`alert`** — 安全告警：alert_id, severity, category, message
- **`heartbeat`** — 心跳確認

## Event Bus

| Event | Payload |
|-------|---------|
| `visustwin.vision.detection` | `{camera_id, count, raw}` |
| `visustwin.vision.alert` | `{alert_id, severity, category, camera_id, message}` |

## Data Flow

```
YOLO server (:8765) → VisionWsClient (bg thread) → event bus + UI update
```

## Dependencies

`omni.kit.uiapp`, `omni.kit.pipapi` (auto-install `websocket-client`)

**Related**: visustwin-vision (YOLO detection backend)

---

← [[Visustwin Extensions MOC]]
