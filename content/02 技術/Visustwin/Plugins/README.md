---
tags: [moc, products, VisTwin, omniverse]
created: 2026-04-14
version: 0.1.0
---

# VisTwin Extensions

> Digital Twin Extension Suite for NVIDIA Omniverse
> Built on Kit SDK 110.0 / USD Composer | by VisTwin

VisTwin 是一組為 NVIDIA Omniverse Kit 開發的插件集合，專為建築數位孿生應用打造。涵蓋環境模擬、IoT 數據串接、展示控制、AI 安全偵測等功能。

📄 **完整 PDF**: [[Visustwin_Extensions_Documentation.pdf]]

---

## Extension Map

### Environment Simulation
| Extension | Description | Deps |
|-----------|-------------|------|
| [[VisTwin Wind Tunnel]] | 建築群位勢流風場模擬，可調建築/風向/擾流 | `omni.warp.core` |
| [[VisTwin Wind Analysis]] | 風場分析與行人舒適度評估，自動產出圖表報告 | imports Wind Tunnel solver |
| [[VisTwin Light Compass]] | 太陽軌跡弧 + 36 方向照度玫瑰圖，接 MQTT 感測器即時數據 | subscribes MQTT events |

### Data Connection
| Extension | Description | Deps |
|-----------|-------------|------|
| [[VisTwin MQTT Bridge]] | IoT 夥伴 IoT 裝置數據橋接，WebSocket 接入 | `websocket-client` (auto) |
| [[VisTwin OSC Controller]] | OSC UDP 接收器，外部觸控面板控制 USD 場景 | (none) |

### Safety & Monitoring
| Extension | Description | Deps |
|-----------|-------------|------|
| [[VisTwin Vision Detector]] | AI 安全偵測 overlay，串接 YOLO 即時影像分析 | `websocket-client` (auto) |

### Presentation
| Extension | Description | Deps |
|-----------|-------------|------|
| [[VisTwin Exhibition Board]] | 第二螢幕展覽看板，獨立 OS 視窗 + Viewport | viewport extensions |
| [[VisTwin Camera Travel]] | 攝影機飛行控制面板，一鍵平滑飛往指定攝影機 | `omni.usd` |

### Dev Tools
| Extension | Description | Deps |
|-----------|-------------|------|
| [[VisTwin Dev REPL]] | Claude Code ↔ Kit 檔案式 Python REPL | (none) |

### Management
| Extension | Description | Deps |
|-----------|-------------|------|
| [[VisTwin Dashboard]] | 插件總覽與即時開關面板 + 共用 Design System | `omni.kit.uiapp` |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  visustwin.dashboard                     │
│            (Extension Management Hub)                    │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐           │
│  │ON / OFF│ │ON / OFF│ │ON / OFF│ │ON / OFF│  ...      │
│  └────────┘ └────────┘ └────────┘ └────────┘           │
└─────────────────────────────────────────────────────────┘
       │               │              │
       ▼               ▼              ▼
 ┌──────────┐  ┌──────────────┐ ┌──────────────┐
 │   MQTT   │─▶│Light Compass │ │ Wind Tunnel  │
 │  Bridge  │  │ (subscriber) │ │  (solver)    │
 └──────────┘  └──────────────┘ └──────┬───────┘
       │                               │ imports
       │ carb event bus                ▼
       │                        ┌──────────────┐
       ▼                        │Wind Analysis  │
 ┌──────────┐                   └──────────────┘
 │Exhibition│
 │  Board   │
 └──────────┘

 ┌──────────┐  ┌──────────────┐ ┌──────────────┐
 │   OSC    │  │   Vision     │ │   Dev REPL   │
 │Controller│  │  Detector    │ │ (Claude↔Kit) │
 └──────────┘  └──────────────┘ └──────────────┘
      │               │               │
  UDP:8001        WS:8765       _repl/cmd.py
```

---

## Event Bus Communication

插件間透過 Carbonite (carb) event bus 通訊：

| Event | Source | Payload |
|-------|--------|---------|
| `visustwin.mqtt.message` | MQTT Bridge | `{topic, unit, payload, raw}` |
| `visustwin.osc.message` | OSC Controller | `{address, args}` |
| `visustwin.vision.detection` | Vision Detector | `{camera_id, count, raw}` |
| `visustwin.vision.alert` | Vision Detector | `{alert_id, severity, category, camera_id, message}` |

---

## Dashboard Integration Protocol

所有插件必須提供：
1. **`_INSTANCE`** — module-level instance reference
2. **`_open_window()`** — Dashboard VIEW button calls this
3. **`_window`** — property with `.visible` attribute

---

## Shared Design System

定義於 `visustwin.dashboard.theme`，品牌色 `#1E7A4A` (綠)，見 [[VisTwin Dashboard]] 的 Design System 章節。

---

## 返回

- [[03 Products MOC]] → [[Vault Home]]
