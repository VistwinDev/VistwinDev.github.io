---
repo: visustwin-extensions
github_url: https://github.com/metaarchetech/visustwin-extensions
branch: master
latest_commit: b17c668
latest_commit_msg: "docs: full README coverage for all 17 extensions + PDF builder update"
latest_commit_date: 2026-04-15
status: idle
device_target: NVIDIA Omniverse Kit UI（不共用 DNA）
stack: NVIDIA Omniverse Kit SDK 110.0 · Python · USD Composer · omni.ui
open_prs: []
updated: 2026-04-18
---

# Omniverse-Extensions

**Digital Twin Extension Suite for NVIDIA Omniverse。**17 個 Kit 插件，專為建築數位孿生應用打造，涵蓋環境模擬、IoT 數據串接、展示控制、AI 安全偵測等功能。

Built on NVIDIA Kit SDK 110.0 / Omniverse USD Composer。插件分組：環境分析家族（AIR / SUN / WATER & HEALTH）遵循 **scene + report pair** 模式（互動 3D scene 插件 + 獨立彈出 report 插件）。

## 最新進度

`b17c668` — docs: full README coverage for all 17 extensions + PDF builder update（2026-04-15）

目前 idle，上次更動是文件補齊。Kit UI 不共用 VisTwin DNA design system。

## 已知 TODO

- 評估 Kit SDK 升版計畫（110.0 → 後續版本）
- 與展間掃描 HUD 系統的整合評估（AI 安全偵測 extension）

## 關鍵決策

- **不共用 DNA**：Omniverse Kit UI 走 omni.ui 框架，與 Web 端 DNA design system 分離
- **Kit SDK 110.0**：目前鎖定此版本，升版需評估 breaking changes

## 連結

- GitHub：[VisTwin/visustwin-extensions](https://github.com/metaarchetech/visustwin-extensions)
- 本機路徑：`D:/Visustwin/visustwin-extensions`
- NVIDIA Omniverse Kit SDK 文件：[developer.nvidia.com/omniverse/kit](https://developer.nvidia.com/omniverse/kit)

## 返回

- [[02 技術/Visustwin/README|VisTwin]]
