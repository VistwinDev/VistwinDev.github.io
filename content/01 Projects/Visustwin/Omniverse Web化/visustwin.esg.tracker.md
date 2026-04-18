# visustwin.esg.tracker — Extension 細節卡

## 功能與 UI 結構

ESG 碳足跡計算器與認證評核。掃描 USD Stage 中的材質名稱，比對內建碳排放資料庫（ICE Database v3 / 台灣 ABRI），計算各構件體積 × 密度 × 碳排因子的具現化碳量。提供 EEWH / LEED 認證門檻評分。可生成 CSV / PDF 報告，視覺化碳熱圖（USD displayColor）。

## 程式檔案清單

| 檔案 | 職責 |
|---|---|
| `extension.py` | IExt lifecycle + Dashboard 協議 |
| `ui_window.py` | 碳足跡 UI（omni.ui）+ 熱圖控制 |
| `carbon.py` | 碳排計算引擎 + 材質資料庫 |
| `certification.py` | EEWH / LEED 門檻評分 |
| `esg_report.py` | CSV / PDF 報告生成 |

## 關鍵程式碼片段

```python
# carbon.py — 材質碳排資料庫（ICE Database v3 / ABRI）
@dataclass
class MaterialCarbon:
    keyword: str
    density: float    # kg/m3
    factor: float     # kgCO2eq per kg

_BUILTIN_DB = [
    MaterialCarbon("concrete", 2400, 0.12),
    MaterialCarbon("steel",    7850, 1.46),
    MaterialCarbon("rebar",    7850, 1.40),
    MaterialCarbon("brick",    1800, 0.24),
    MaterialCarbon("glass",    2500, 0.85),
    # ... 50+ 種材質
]

def calc_embodied_carbon(volume_m3: float, material_keyword: str) -> float:
    mat = _lookup(material_keyword)  # fuzzy keyword match
    return volume_m3 * mat.density * mat.factor  # kgCO2eq
```

```python
# carbon.py — USD Stage 掃描（讀取材質 + 幾何體積）
from pxr import Usd, UsdGeom, UsdShade, Gf
for prim in stage.Traverse():
    if prim.IsA(UsdGeom.Mesh):
        material, _ = UsdShade.MaterialBindingAPI(prim).ComputeBoundMaterial()
        mat_name = material.GetPath().name if material else ""
        bbox = UsdGeom.BBoxCache(...).ComputeWorldBound(prim)
        volume = bbox.GetVolume()  # 近似體積（cm^3 → m^3）
```

## Kit 依賴逐項

| 依賴 | 用途 | Web 可替換？ |
|---|---|---|
| `pxr.UsdGeom.Mesh` | 幾何體積計算 | ⚠️ 需 Kit bridge / glTF |
| `pxr.UsdShade.MaterialBindingAPI` | 材質名稱讀取 | ⚠️ 需 Kit bridge / glTF |
| `UsdGeom.BBoxCache` | 體積近似計算 | ⚠️ 需 Kit bridge |
| `omni.ui` | 結果表格 + 熱圖控制 | ✅ React Table / Recharts |
| `displayColor primvar 寫入` | 3D 碳熱圖視覺化 | ❌ 需保留在 Kit viewport |
| Python `csv` / `fpdf` | 報告輸出 | ✅ Papa Parse / jsPDF |
| 內建材質 DB（純資料） | 碳排因子查詢 | ✅ JSON file |

## Web 替代方案

**計算邏輯（carbon.py 整個）可直接移植到 TypeScript**：
```typescript
const MATERIAL_DB: MaterialCarbon[] = [
  { keyword: "concrete", density: 2400, factor: 0.12 },
  { keyword: "steel",    density: 7850, factor: 1.46 },
  // ...
]
function calcEmbodiedCarbon(volumeM3: number, materialKeyword: string): number {
  const mat = fuzzyLookup(MATERIAL_DB, materialKeyword)
  return volumeM3 * mat.density * mat.factor
}
```

**USD 掃描部分**：Kit 端保留 scanner，透過 WebSocket 暴露 JSON：
```json
[{"path": "/World/Structure/Column_01", "material": "concrete", "volume_m3": 0.85}]
```

**視覺化**：
- 表格 → `@tanstack/react-table`
- 碳熱圖（棒狀圖）→ Recharts BarChart + 顏色映射
- 3D 熱圖標記 → 保留在 Kit 或 Three.js instancedMesh

## 整併候選

- 與 **visustwin.bim.inspector** 強度重疊：都掃描 USD 材質
- 與 **visustwin.moisture.health** 共用材質資料庫概念
- 建議合併成 `BIMSustainabilityModule` → 頁籤：`BIM 檢查 | 碳足跡 | EEWH 認證`

## 難度 / 工作量

| 項目 | 評估 |
|---|---|
| **Web 化難度** | **Medium** |
| **工作量** | **M** |
| **預估 LoC** | ~1800（TS carbon engine + React UI + PDF 匯出） |
| **主要風險** | USD 材質 + 體積掃描需 Kit bridge |
| **快速路徑** | 先用 Kit WebSocket API 暴露掃描結果，web 顯示計算；純 TS 版本之後移植 |

---
← [[../Omniverse Web化 評估|主評估文件]]
