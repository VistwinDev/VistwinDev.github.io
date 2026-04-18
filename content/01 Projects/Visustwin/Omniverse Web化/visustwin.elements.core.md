# visustwin.elements.core — Extension 細節卡

> **Tier: T4** — 存封 — ZoneRegistry 共享匯流排幾乎未被整合使用（只有 T4 的 moisture.health 依賴它）；web 端改 Zustand store

## 功能與 UI 結構

共用 Zone 資料匯流。作為 **singleton 資料服務**，讓 Air/Sun/Water 分析插件共享建築 Zone 模型（sunlight.studio 寫入日照數據、warp.windtunnel 寫入風速數據、moisture.health 讀取計算）。透過 Carb Event Bus 廣播 zone 更新事件。UI 是一個簡單的 Zone 瀏覽器（列出所有 zone 名稱和最新數據）。

## 程式檔案清單

| 檔案 | 職責 |
|---|---|
| `extension.py` | IExt lifecycle + 全域 registry 初始化 |
| `zone_registry.py` | ZoneRegistry singleton（CRUD + 事件廣播） |
| `zone_data.py` | ZoneData dataclass（id, bounds, solar, wind, moisture data） |
| `ui_window.py` | Zone 瀏覽器 UI（omni.ui） |

## 關鍵程式碼片段

```python
# zone_registry.py — singleton 共享資料服務
_EVENT_ZONE_UPDATED = carb.events.type_from_string("visustwin.elements.zone_updated")

class ZoneRegistry:
    def __init__(self):
        self._zones: Dict[str, ZoneData] = {}
        self._event_stream = omni.kit.app.get_app().get_message_bus_event_stream()

    def add_zone(self, zone: ZoneData) -> None:
        self._zones[zone.id] = zone
        self._emit_registry_changed()

    def notify_updated(self, zone_id: str, domain: str) -> None:
        """Sunlight/wind/moisture 寫入後呼叫，廣播更新事件"""
        self._event_stream.push(_EVENT_ZONE_UPDATED,
            payload={"zone_id": zone_id, "domain": domain})
```

```python
# 其他插件如何使用（例如 moisture.health）
from visustwin.elements.core.zone_registry import get_registry
registry = get_registry()
zone = registry.get_zone("unit_A1_floor3")
solar_gain = zone.solar_gain_w  # 從 sunlight.studio 寫入的值
wind_speed = zone.wind_speed_ms  # 從 warp.windtunnel 寫入的值
```

## Kit 依賴逐項

| 依賴 | 用途 | Web 可替換？ |
|---|---|---|
| `carb.events.type_from_string()` | 事件類型定義 | ✅ WebSocket 自定義事件類型 |
| `omni.kit.app.get_message_bus_event_stream()` | 跨插件廣播 | ✅ Zustand store 訂閱 / EventEmitter |
| `omni.usd` | Zone 座標來自 USD Stage prim bounds | ⚠️ 初始化時需從 USD 讀取 |
| `omni.ui` | Zone 瀏覽器 UI | ✅ React table |

## Web 替代方案

這個 extension 的核心是 **in-memory data store + pub-sub**，web 化非常自然：

```typescript
// Zustand store 替代 ZoneRegistry
interface ZoneData {
  id: string
  solarGainW?: number
  windSpeedMs?: number
  pmvIndex?: number
  moldRisk?: number
}

const useZoneStore = create<{
  zones: Map<string, ZoneData>
  updateZone: (id: string, data: Partial<ZoneData>) => void
}>()
```

- **事件廣播** → Zustand subscribe / React context / EventEmitter
- **Zone 初始化** → 從 Kit WebSocket 接收 zone 定義，或從 JSON/glTF 中讀取
- **UI** → React table with real-time updates

## 整併候選

- Elements Core 在 web 化後變成 **共享 state layer**（Zustand store），不是獨立 module
- 所有分析模組（Solar/Wind/Moisture）共用此 store，放在 `lib/zones.ts` 或 `stores/zoneStore.ts`

## 難度 / 工作量

| 項目 | 評估 |
|---|---|
| **Web 化難度** | **Easy** |
| **工作量** | **S** |
| **預估 LoC** | ~300（Zustand store + TypeScript interfaces） |
| **主要風險** | Zone 初始化資料來源（USD Stage bounds → 需 bridge） |
| **快速路徑** | 先用 JSON config 硬編碼 zone 定義，之後再從 Kit 同步 |

---
← [[../Omniverse Web化 評估|主評估文件]]
