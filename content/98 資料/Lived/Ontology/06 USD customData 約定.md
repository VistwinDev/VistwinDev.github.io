[[Ontology]]

---
tags: [ontology, usd, omniverse, customdata, VisTwin]
created: 2026-04-17
updated: 2026-04-17
---

# 🎞 USD customData 約定

> VisTwin 選擇 **不自訂 USD IsA API schema**(太重),改用 USD 原生的 `customData` dict 機制在 prim 上標註 ontology 身份與類別。本篇是寫入 / 讀取規則。

---

## 🎯 為什麼用 customData 不用 IsA schema

見 [[04 Canonical Format 選型]] E 節。簡短理由:

- IsA schema 要 C++ 或 Python 套件發布 + `usdGenSchema` build
- 改 schema 要重 build、重發布
- 第一版 ontology 還會變,不該鎖進 build system
- `customData` 是 USD 原生機制,任何工具都看得到、所有人都可寫

穩定後升級到 IsA schema 的入口保留 —— 結構設計完全相容。

---

## 🔑 三個保留鍵

每個需要 ontology 標註的 prim 必填三個 `customData` 鍵:

| Key | 型別 | 範例 | 語意 |
|---|---|---|---|
| `visustwin:urn` | string | `"urn:visustwin:site-a:tower-1:showroom:mbr:room:MBR"` | 全域身份 |
| `visustwin:class` | string | `"Room"` | Ontology 類別名 (T-Box class) |
| `visustwin:tags` | token[] | `["master", "hero-pov"]` | 自由標籤,可選 |

**命名空間**:所有鍵都以 `visustwin:` 開頭,避免與其他工具 customData 衝突(USD 原生用 `sceneSettings:` 等)。

---

## 📄 .usda 範例

```usd
def Xform "Room_MBR" (
    customData = {
        string "VisTwin:urn" = "urn:visustwin:site-a:tower-1:showroom:mbr:room:MBR"
        string "VisTwin:class" = "Room"
        token[] "VisTwin:tags" = ["master", "hero-pov"]
    }
)
{
    # ... 幾何與子 prim
}
```

---

## 🐍 Python API

### 寫入

```python
from pxr import Usd

def tag_prim(prim: Usd.Prim, urn: str, class_name: str, tags: list[str] | None = None):
    """把 ontology 身份寫入 prim 的 customData。"""
    prim.SetCustomDataByKey("VisTwin:urn", urn)
    prim.SetCustomDataByKey("VisTwin:class", class_name)
    if tags:
        prim.SetCustomDataByKey("VisTwin:tags", tags)
```

### 讀取

```python
def read_ontology_tag(prim: Usd.Prim) -> dict | None:
    """回傳 ontology 三元組,若 prim 未標註回傳 None。"""
    cd = prim.GetCustomData()
    urn = cd.get("VisTwin:urn")
    cls = cd.get("VisTwin:class")
    if not urn or not cls:
        return None
    return {
        "urn": urn,
        "class": cls,
        "tags": list(cd.get("VisTwin:tags", [])),
    }
```

### 場景掃描

```python
def scan_ontology(stage: Usd.Stage) -> list[dict]:
    """掃描 stage 所有標註的 prim,回傳 ontology entries。"""
    results = []
    for prim in stage.Traverse():
        tag = read_ontology_tag(prim)
        if tag:
            tag["prim_path"] = str(prim.GetPath())
            results.append(tag)
    return results
```

---

## 🔁 Pydantic ↔ USD 往返

理想使用方式 — 從 USD 讀回 Pydantic 物件(資料完整性依賴 welltek / metadata store):

```python
from visustwin_ontology.spatial import Room
from visustwin_ontology.usd_bridge import load_entity_from_prim

prim = stage.GetPrimAtPath("/World/SampleHome_A/F2/Room_MBR")
room: Room | None = load_entity_from_prim(prim, expected_class=Room)
# Pydantic runtime 驗證自動啟動
```

`load_entity_from_prim` 內部流程:
1. 讀 `customData` 拿 `urn`, `class`
2. 驗 `class` 是不是預期類型
3. URN 解析 → 抽出 site / building / unit / room slug
4. 查 `customData` 其他 `visustwin:*` key → 填 Pydantic 欄位
5. 呼叫 `Model.model_validate({...})` 返回實例

寫回時反向:

```python
from visustwin_ontology.usd_bridge import save_entity_to_prim

save_entity_to_prim(prim, room)
# 把 room 所有欄位 → customData keys (VisTwin:* 命名空間)
```

---

## 📦 延伸 customData 鍵(選配)

除了三個必填鍵,類別特有欄位可直接寫 customData,key 一樣 `visustwin:` 開頭:

```usd
def Xform "Room_MBR" (
    customData = {
        string "VisTwin:urn" = "urn:visustwin:site-a:tower-1:showroom:mbr:room:MBR"
        string "VisTwin:class" = "Room"
        string "VisTwin:room_type" = "MasterBedroom"
        float "VisTwin:area" = 16.5
        string "VisTwin:display_name" = "主臥"
        string[] "VisTwin:adjacent_room_urns" = [
            "urn:visustwin:site-a:tower-1:showroom:bath:room:BATH",
        ]
    }
)
```

**取捨**:
- 寫越多 → USD 場景越自給自足,任何人拿去都知道語意
- 寫太多 → 資料重複,USD 外的系統改動後 USD 會陳舊
- **建議**:只寫「導覽 / 展示 runtime 需要的關鍵欄位」,其他走 URN 查 catalog

---

## 🏷 與 Sdf Layer 的關係

USD 場景通常分層(base.usda + overrides.usda)。`customData` 會層層疊加(dict merge)。建議:

- **Ontology tag (urn/class)** 放 **base layer**(穩定)
- **展示態 tag (hero-pov, featured)** 放 **展示 override layer**(可換)
- **Runtime 狀態(亮度、溫度)** **不要寫 customData** — 走 MQTT / OSC

---

## 🔍 驗證

在 `visustwin_ontology.usd_bridge` 提供 CLI:

```bash
python -m visustwin_ontology.usd_bridge scan /path/to/scene.usda
```

輸出:

```
✓ /World/Site_A                  Site    urn:visustwin:site-a:...:site:site-a
✓ /World/Site_A/Tower_1          Building urn:visustwin:site-a:tower-1:...
✗ /World/Site_A/Tower_1/F2       (missing VisTwin:class)
✓ /World/.../Room_MBR            Room    urn:visustwin:...:room:MBR

2 valid / 1 incomplete / 0 invalid
```

---

## 🚧 已知限制

- customData 沒有原生驗證 — 依賴 Pydantic runtime validation
- 搜尋大場景的 `customData` 要走 `Usd.Stage.Traverse()`,大型 stage 慢 — 考慮建索引
- customData 不參與 USD 的 composition arc 繼承規則(不會自動 propagate),要自己處理

---

## 📝 相關連結

- [[02 Identity 與 URN 設計]] — URN 寫入 USD 的入口
- [[05 VisTwin T-Box v1 類別清單]] — 哪些類別會被標註
- [[Extensions]] — Omniverse extension 如何掃 customData
- USD customData 官方文件: https://openusd.org/release/glossary.html#customdata
