# visustwin.bim.inspector — Extension 細節卡

> **Tier: T0** — 核心保留 — 獨立模組，優先 port（幾何簡化邏輯 → Massing Pipeline）

## 功能與 UI 結構

BIM 完整度掃描器。遍歷 USD Stage，對每個 Mesh/Xform prim 評分（GREEN/YELLOW/RED），偵測 AABB 碰撞，估算 LOD 等級，生成 CSV/PDF 報告。UI 是一個帶有掃描結果表格、統計圖和碰撞清單的面板。設計採用 visustwin.dashboard.theme 共用主題。

## 程式檔案清單

| 檔案 | 職責 |
|---|---|
| `extension.py` | IExt lifecycle + Dashboard 協議 |
| `ui_window.py` | 掃描結果表格 UI（omni.ui） |
| `scanner.py` | USD Stage 遍歷 + PrimRecord 建立 |
| `collision.py` | AABB 碰撞偵測 |
| `colorizer.py` | USD Mesh 顏色標記（displayColor primvar） |
| `history.py` | 掃描歷史管理 |
| `report.py` | CSV 報告生成 |
| `scheduler.py` | 排程自動掃描 |

## 關鍵程式碼片段

```python
# scanner.py — USD Stage 遍歷
from pxr import Usd, UsdGeom, UsdShade, Gf

@dataclass
class PrimRecord:
    path: str
    prim_type: str
    display_name: str = ""
    material_path: str = ""
    classification: str = ""
    bbox_min: Tuple[float, float, float] = (0.0, 0.0, 0.0)
    bbox_max: Tuple[float, float, float] = (0.0, 0.0, 0.0)
    grade: Grade = Grade.RED   # GREEN / YELLOW / RED
    face_count: int = 0
    estimated_lod: LOD = LOD.LOD_100
```

```python
# colorizer.py — 在 USD Stage 上標記顏色（寫入 displayColor primvar）
def colorize_prims(records: List[PrimRecord], stage):
    for rec in records:
        prim = stage.GetPrimAtPath(rec.path)
        mesh = UsdGeom.Mesh(prim)
        color = GRADE_COLORS[rec.grade]  # (R, G, B) tuple
        mesh.CreateDisplayColorAttr().Set([Gf.Vec3f(*color)])
```

## Kit 依賴逐項

| 依賴 | 用途 | Web 可替換？ |
|---|---|---|
| `omni.usd` / `pxr.*` | Stage 遍歷、prim 操作 | ⚠️ 需 glTF/JSON bridge 或微服務 |
| `UsdGeom.Mesh` | face_count、AABB 計算 | ⚠️ 同上 |
| `UsdShade.Material` | 材質路徑讀取 | ⚠️ 同上 |
| `UsdGeom.Imageable` | displayColor primvar 寫入 | ❌ 視覺化必須保留在 Kit |
| `omni.ui` | 表格 + 圖表 UI | ✅ React Table / Recharts |
| `omni.kit.app` | 排程掃描（frame callback） | ✅ setInterval |
| Python csv | CSV 報告輸出 | ✅ Papa Parse / 純 TS |

## Web 替代方案

**方案 A（推薦）：混合架構**
- Scanner + Collision 邏輯保留在 Kit 端，透過 WebSocket 暴露為工具 API
- Web 端只負責「接收掃描結果 JSON + 渲染表格 + 下載報告」
- 3D 顏色標記保留在 Kit viewport（無法移至 web）

**方案 B：若有 glTF 模型**
- 使用 `@loaders.gl/gltf` 解析 glTF → 在 Three.js scene 中標記顏色
- 純 TypeScript 實現 scanner/collision 邏輯（約 800 LoC TS）
- 報告輸出 → `xlsx` / CSV download

**視覺化替代**：
- 表格 → `@tanstack/react-table`
- 統計 → Recharts BarChart
- 3D 標記 → Three.js `MeshStandardMaterial.color` 或 instancedMesh

## 整併候選（修正）

**BIM Inspector 本身保持獨立**（不合併入 ESG Tracker）。

**幾何簡化職責抽出 → Massing Pipeline**（`bim-adapter`）：
- `scanner.py` 的「USD prim → AABB bbox + 材質 tag」邏輯抽出成 `bimAdapter.ts`
- BIM Inspector 本身只保留：查詢 / 報告 / 碰撞 UI（viewer 角色）
- ESG Tracker 改從 `massingStore` 讀取材質 tag，不再自己掃 USD

```
bim.inspector/scanner.py
  ├── 幾何簡化邏輯  ──────────▶ Massing Pipeline / bim-adapter（抽出）
  └── 查詢/報告/碰撞 UI  ────▶ BIM Inspector module（保留）
```

與 **esg.tracker** 的關係：共用 `materialDatabase.ts`（共用資料，不共用 UI）

## 難度 / 工作量

| 項目 | 評估 |
|---|---|
| **Web 化難度** | **Medium** |
| **工作量** | **M** |
| **預估 LoC** | ~1500（React 表格 UI + TS scanner + WebSocket bridge） |
| **主要風險** | USD stage 遍歷在 web 端無直接替代（需 Kit bridge 或 glTF 解析） |
| **快速路徑** | Kit 端加 WebSocket endpoint 暴露掃描結果，Web 顯示只讀 |

---
← [[../Omniverse Web化 評估|主評估文件]]


← [[02 產品/VisTwin/README|VisTwin]]
