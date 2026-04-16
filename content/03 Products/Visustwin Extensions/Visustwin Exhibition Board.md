---
tags: [visustwin, omniverse, extension, presentation, viewport]
created: 2026-04-14
ext_id: visustwin.exhibition.board
version: 0.1.0
category: Presentation
---

# Visustwin Exhibition Board

> 第二螢幕展覽看板 — 嵌入式 Viewport + Welltek 即時數據

提供獨立 OS 視窗，內嵌 Omniverse Viewport 與即時裝置數據，適合展場第二螢幕。

## Features

- 獨立 OS 視窗（脫離 Omniverse 主視窗，出現在工作列）
- 內嵌即時 3D Viewport
- 顯示 [[Visustwin MQTT Bridge]] 即時裝置數據
- 自動前景顯示（Windows API `user32.dll`）

## Window Lifecycle

```
_open_window() → _async_show()
  ├── window.visible = True
  ├── wait 8 frames
  ├── window.move_to_new_os_window()
  ├── wait 5 frames
  └── _bring_to_front() → user32.dll FindWindowW / SetForegroundWindow
```

## Dependencies

`omni.kit.uiapp`, `omni.kit.viewport.window`, `omni.kit.widget.viewport`, `omni.kit.viewport.utility`, `omni.usd`

---

← [[Visustwin Extensions MOC]]
