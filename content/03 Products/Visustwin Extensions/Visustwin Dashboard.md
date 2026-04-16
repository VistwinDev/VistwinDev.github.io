---
tags: [visustwin, omniverse, extension, management]
created: 2026-04-14
ext_id: visustwin.dashboard
version: 0.1.0
category: Management
---

# Visustwin Dashboard

> 插件總覽與即時開關面板

Dashboard 是 Visustwin 插件套件的管理中心，啟動後自動列出所有已安裝的 Visustwin 插件，提供即時 ON/OFF 切換與 UI 面板開關。同時提供共用設計系統 (`theme.py`)。

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

← [[Visustwin Extensions MOC]]
