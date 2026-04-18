[[Ontology]]

---
tags: [ontology, semantor, visustwin, architecture]
created: 2026-04-17
updated: 2026-04-17
---

# 🧠 Semantor 的 Ontology 角色

> Vault 既有筆記 [[Semantor 設計概念]] 把 Semantor 定位為 VisusTwin 的「**語意操作節點**」。本篇接上去:Semantor 與 Ontology 是什麼分工、誰依賴誰、訊號怎麼流。

---

## 🎭 一句話定位

- **Ontology** 是**字典**:定義「有哪些類別、長什麼樣、怎麼識別」(T-Box)
- **Semantor** 是**讀者**:接收原始訊號、**查字典**、決定「這是什麼、與誰有關、要觸發什麼」

字典不動手,讀者不定義詞。

---

## 📜 對照原筆記 [[Semantor 設計概念]]

原筆記的三層架構:

| 層級 | 角色 | 功能 |
|---|---|---|
| 感知層 | Sensor / Captor | 提供原始感知資料 |
| **語意層** | **Semantor** | 資料對齊、語意建構、實體關聯 |
| 比對 / 治理層 | Matcher / Governor | 語意推理、異常偵測、工作流觸發 |

本 Ontology 專案補上**每一層都依賴**的底層:

```
         +----------------------------------+
         |  Ontology (T-Box + URN 規則)     |  ← visustwin_ontology 套件
         +----------------------------------+
                   ↑ 所有層都 import
                   |
  +-------+     +-------------+     +----------------+
  | 感知  | --> | Semantor    | --> | Matcher /       |
  | 層    |     | 語意層      |     | Governor        |
  +-------+     +-------------+     +----------------+
  MQTT / YOLO    辨識是什麼        觸發安全告警 /
  影像 / OSC     歸屬哪個 entity   展示流程
                 轉 URN            資料治理
```

---

## 🔁 訊號流範例:安全視覺警告

照原筆記「施工現場相機擷取 → Semantor 發現一人未穿反光背心」的案例,在 VisusTwin 樣品屋改寫成「工作區域閒人誤入」:

### Step 1 — 感知層

`visustwin-vision` + YOLO 偵測到畫面中有人物,給出:

```json
{
  "camera_id": "cam-007",
  "detections": [
    { "bbox": [120, 300, 240, 620], "class": "person", "confidence": 0.92 }
  ],
  "ts": "2026-04-17T14:23:45+08:00"
}
```

這時候還沒語意,只是 pixel coordinates + class label。

### Step 2 — Semantor 查字典

Semantor 收到 detection,查 ontology:

1. `cam-007` 的 URN 是什麼?
   → `urn:visustwin:site-a:tower-1:showroom:lr:sensor:cam-007`
2. 它位於哪個 Space?
   → 查 `Sensor.located_in_urn` → `urn:visustwin:...:room:LR`(客廳)
3. `LR` 的屬性?
   → Room.room_type = "LivingRoom",Room.tags 沒有 "staff-only"
4. YOLO 的 "person" class 要對應什麼 ontology?
   → (若未來有 Person 類別) `visustwin:Person`;目前沒有 → 原樣透傳

語意化後的事件:

```json
{
  "event_type": "human_detected",
  "observed_at_urn": "urn:visustwin:...:room:LR",
  "observed_at_display": "客廳",
  "sensor_urn": "urn:visustwin:...:sensor:cam-007",
  "ts": "2026-04-17T14:23:45+08:00",
  "confidence": 0.92
}
```

### Step 3 — Matcher / Governor

拿 Semantor 輸出的語意事件 + 時間 (凌晨 3 點) → 政策:

- 展示時段(9:00–18:00) × 客廳有人 = **正常**,記錄訪客流量
- 非展示時段 × 客廳有人 = **異常**,發告警

所有規則都**以 URN 為主鍵**查政策表,不再碰像素座標。

---

## 📦 Semantor 依賴 Ontology 的程式介面

當階段 2 實作 `visustwin_ontology` 套件後,Semantor(或任何語意層服務)典型用法:

```python
from visustwin_ontology import URN, load_catalog
from visustwin_ontology.spatial import Room
from visustwin_ontology.device import Sensor

catalog = load_catalog()   # 讀 welltek SQLite + USD scan,合成記憶體 index

def semanticize(raw_detection: dict) -> dict:
    sensor_urn = raw_detection["camera_id_to_urn"]
    sensor: Sensor = catalog.get(sensor_urn)
    room: Room | None = catalog.get(sensor.located_in_urn) if sensor.located_in_urn else None
    return {
        "event_type": detect_event_type(raw_detection),
        "observed_at_urn": str(room.urn) if room else None,
        "observed_at_display": room.display_name if room else None,
        "sensor_urn": str(sensor_urn),
        "ts": raw_detection["ts"],
        "confidence": max(d["confidence"] for d in raw_detection["detections"]),
    }
```

- Ontology 提供類別定義 + URN 解析
- Semantor 提供查詢 + 語意包裝邏輯
- **Ontology 不知道 Semantor 存在**(反向依賴被禁止,避免循環)

---

## 📐 職責邊界(哪些事不該 Semantor 做)

| 該做 | 不該做 |
|---|---|
| URN 解析 | URN 定義(交 ontology) |
| 把 sensor_id 對應到 Space | 決定 Space 有哪些欄位(交 ontology) |
| 判斷事件類型 (motion / door / etc.) | 儲存事件長期資料(交 time-series DB) |
| 生成給治理層的語意事件 | 執行告警動作(交 Governor) |
| 多 sensor 聚合(「整個客廳的佔用率」) | 決定 Space 的物理關係(交 ontology 的 adjacent 欄位) |

**判斷原則**:「這個事要多快變?」
- 秒級變 → Semantor(runtime 邏輯)
- 天/週級變 → Governor(政策檔)
- 月/年級變 → Ontology(T-Box)

---

## 🔮 未來:Semantor 與 LLM

Vault 另有 [[Foundation Model Distillation Ontology Mapping]] 談到用 LLM 做 ontology mapping。Semantor 未來可加一層 **LLM fallback**:

- 當傳入事件不在現有 ontology 類別中(例如 YOLO 偵測到新類型物件)
- 呼叫 LLM:「這個 label 在 VisusTwin ontology 下最接近哪個類別?」
- 結果寫入 review queue,由人審核後補進 T-Box

Semantor 扮演**ontology 演進的 feedback loop**。但這是 v2+ 的事,v1 不急。

---

## 📝 相關連結

- [[Semantor 設計概念]] — 原始 Semantor 定位
- [[01 T-Box vs A-Box]] — Semantor 管的是 A-Box 的身份查找
- [[02 Identity 與 URN 設計]] — Semantor 依賴的身份系統
- [[05 VisusTwin T-Box v1 類別清單]] — Semantor 會查的類別
- [[Foundation Model Distillation Ontology Mapping]] — 未來 LLM 擴充
