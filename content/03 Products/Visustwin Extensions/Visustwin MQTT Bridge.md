---
tags: [visustwin, omniverse, extension, iot, mqtt, websocket]
created: 2026-04-14
ext_id: visustwin.mqtt.bridge
version: 0.1.0
category: Data Connection
---

# Visustwin MQTT Bridge

> Welltek IoT 裝置數據橋接 — WebSocket 即時接入

連接 welltek-twin WebSocket server，接收 IoT 裝置即時數據並透過 carb event bus 廣播至其他插件。

## Device Types

| Device | Key Fields | Summary |
|--------|-----------|---------|
| `plug` | power, current, voltage | `120W 0.5A 220V` |
| `env` | temperature, humidity, co2, illuminance | `25°C 60% CO2 450ppm` |
| `ac` | mode, set_temp, fan_speed | `AC cool 25°C fan=3` |
| `hrv` | fan_speed | `HRV fan=2` |

## Settings

| Path | Type | Default |
|------|------|---------|
| `/visustwin/mqtt/broker_host` | string | `localhost` |
| `/visustwin/mqtt/broker_port` | int | `3001` |
| `/visustwin/mqtt/enabled` | bool | `true` |

Runtime: `connected`, `last_topic`, `last_payload`

## Event Bus

**Publishes**: `visustwin.mqtt.message`

```python
{ "topic": "env", "unit": 1, "payload": "25°C 60%...", "raw": {...} }
```

**Subscribers**: [[Visustwin Light Compass]], [[Visustwin Exhibition Board]]

## Data Flow

```
welltek-twin (:3001) → WelltekWsClient (bg thread) → event bus → subscribers
```

## Dependencies

`omni.kit.uiapp`, `omni.kit.pipapi` (auto-install `websocket-client`)

---

← [[Visustwin Extensions MOC]]
