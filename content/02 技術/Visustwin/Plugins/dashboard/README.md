---
tags: [VisTwin, omniverse, extension, management]
created: 2026-04-14
ext_id: visustwin.dashboard
version: 0.1.0
category: Management
---

# VisTwin Dashboard

> 插件總覽與即時開關面板

Dashboard 是 VisTwin 插件套件的管理中心，啟動後自動列出所有已安裝的 VisTwin 插件，提供即時 ON/OFF 切換與 UI 面板開關。同時提供共用設計系統 (`theme.py`)。

## Features

**使用者面**
- 自動掃描並列出所有 `visustwin.*` 插件
- 按類別分組：Environment Simulation / Data Connection / Safety & Monitoring / Presentation / Dev Tools
- ON/OFF 按鈕即時啟用/停用；VIEW 按鈕切換 UI 面板
- 即時狀態指示燈（綠色 = 啟用）
- 底部統計：已載入 / 已啟用的插件數量

**開發者面**
- 提供共用設計系統 `theme.py`，統一視覺風格
- 定義 Dashboard Integration Protocol（`_INSTANCE` + `_open_window()` + `_window`）
- 訂閱 extension enable/disable 事件，UI 自動重建
- 啟動時可自動開啟指定 USD Stage

## Settings

| Path | Type | Default | Description |
|------|------|---------|-------------|
| `/visustwin/startup/stage_path` | string | `""` | 啟動時自動開啟的 USD Stage 路徑 |

## Design System (`theme.py`)

品牌色 `C_ACCENT = #1E7A4A` (綠色，唯一彩色)

| Token | Value | Description |
|-------|-------|-------------|
| `BG_WIN` | `#F8F8F8` | 視窗底色 |
| `BG_HEADER` | `#1A1A1A` | 標題列 |
| `C_PRIMARY` | `#1A1A1A` | 主要文字 |
| `C_SECONDARY` | `#666666` | 次要文字 |
| `C_ERROR` | `#CC3333` | 錯誤狀態 |
| `FONT_TITLE` | 18px | 主標題 |
| `FONT_BODY` | 14px | 內文 |

Helpers: `build_header()`, `build_section_title()`, `btn_primary()`, `btn_secondary()`, `btn_toggle()`

每個插件 import 失敗時使用內建 fallback 值，確保獨立運作。

## Key Architecture

- `DashboardExtension` — 主 IExt 類別
- 透過 `sys.modules` + `_INSTANCE` + `_CLASS_MAP` 查找執行中的插件
- Extension state change → `_schedule_rebuild()` → async UI rebuild

## Dependencies

`omni.kit.uiapp`

---

## Web化 評估 / 技術細節

> **Tier: T0** — 核心保留 — App Shell 基礎，優先 port

### 功能與 UI 結構

Extension 總覽與開關面板。顯示全部 17 個 VisTwin 插件（依分類分組），可即時 enable/disable。同時是 **共用設計系統（theme.py）** 的提供者。Extension 啟動時自動開啟，並透過 `omni.kit.app.get_extension_manager()` 監聽插件狀態變化以重繪 UI。

**分類結構**：AIR / SUN / WATER & HEALTH / ELEMENTS CORE / DATA CONNECTION / SAFETY & MONITORING / SUSTAINABILITY / AI INTELLIGENCE / PRESENTATION / DEV TOOLS

### 程式檔案清單

| 檔案 | 職責 |
|---|---|
| `extension.py` | DashboardExtension + 完整 UI 建構 + 分類資料 |
| `theme.py` | 設計系統 v2（顏色、字型、間距、元件建構器） |

### 關鍵程式碼片段

```python
# extension.py — 找運行中的 extension _INSTANCE
def _find_ext_instance(name: str):
    cls_name = _CLASS_MAP.get(name)
    for suffix in (".extension", ""):
        mod = sys.modules.get(name + suffix)
        if mod is not None:
            inst = mod.__dict__.get("_INSTANCE")
            if inst is not None and type(inst).__name__ == cls_name:
                return inst
    return None

# 按鈕 toggle：呼叫 extension manager 的 enable/disable
def _make_toggle(eid, cur):
    def _fn():
        ext_manager.set_extension_enabled_immediate(eid, not cur)
        self._schedule_rebuild()
    return _fn
```

```python
# theme.py — 設計系統常數（web 化時直接對應到 CSS variables）
BG_WIN     = 0xFFF8F8F8   # #F8F8F8
BG_HEADER  = 0xFF1A1A1A   # #1A1A1A
C_ACCENT   = 0xFF1E7A4A   # #1E7A4A  ← 主綠
FONT_TITLE = 18; FONT_H2 = 15; FONT_BODY = 14; FONT_LABEL = 13; FONT_CAPTION = 11
SP_S = 8; SP_M = 12; SP_L = 16; SP_XL = 20; MARGIN = 16; RADIUS = 6
```

### Kit 依賴逐項

| 依賴 | 用途 | Web 可替換？ |
|---|---|---|
| `omni.kit.app.get_extension_manager()` | 讀取插件清單、enable/disable | ❌ Kit-only API |
| `omni.kit.app.get_app().next_update_async()` | 非同步啟動流程 | ✅ useEffect |
| `omni.usd.get_context().open_stage()` | 自動開啟 USD Stage | ❌ Kit-only |
| `carb.settings` | 讀取 stage path 設定 | ✅ localStorage / env |
| `omni.ui.Window` / `ScrollingFrame` | Dashboard 視窗 | ✅ React sidebar |
| `theme.py` 整個模組 | 設計系統 | ✅ CSS Variables / Tailwind |

### Web 替代方案

- **Dashboard panel** → React 左側 `Sidebar` component，顯示 feature modules 開關
- **Extension on/off** → Web app 中改為 React state / URL routing（頁面路由切換各 module）
- **theme.py** → 直接對應成 Tailwind CSS variables 或 `globals.css`：
  ```css
  --c-bg: #F8F8F8;
  --c-header: #1A1A1A;
  --c-accent: #1E7A4A;
  ```
- **Auto-open USD stage** → Web 端改為 WebSocket 通知 Kit 開啟指定場景

### 整併候選

- Dashboard 在 web 化後不再是一個「feature module」，而是 **App Shell / Navigation**
- 分類結構可直接對應到 web app 的 **路由結構** 或 **Sidebar 分組**
- theme.py 的常數可以直接成為 web 端設計 token 的基礎

### 難度 / 工作量

| 項目 | 評估 |
|---|---|
| **Web 化難度** | **Easy**（UI 邏輯直覺，無 GPU/USD 依賴） |
| **工作量** | **S** |
| **預估 LoC** | ~500（React Sidebar + feature toggle + theme 移植） |
| **主要風險** | Kit extension manager API 沒有 web 等價，需改設計（routing 取代 enable/disable） |
| **快速路徑** | theme.py 先轉成 CSS token，再做 React Sidebar 骨架 |

> **注意**：theme.py 是整個 extension family 的設計基石，web 化時第一步應先移植此模組

---

← [[02 技術/Visustwin/Plugins/README|VisTwin Plugins]]
