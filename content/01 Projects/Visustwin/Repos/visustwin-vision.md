---
repo: visustwin-vision
github_url: ""
branch: ""
latest_commit: ""
latest_commit_msg: ""
latest_commit_date: ""
status: idle
device_target: GPU workstation（Python 3.10+, YOLO11m + pose）
stack: Python 3.10+ · YOLO11m · YOLO11m-pose · setuptools · pytest
open_prs: []
updated: 2026-04-18
---

# visustwin-vision

YOLO 新版主專案。展間掃描 HUD 系統的核心視覺感知模組，負責即時人員偵測（YOLO11m）與骨架姿態估算（YOLO11m-pose）。

本機路徑：`D:/Visustwin/visustwin-vision`。專案結構包含 `src/`、`models/`（yolo11m.pt、yolo11m-pose.pt）、`tests/`、`config/`，使用 `pyproject.toml` 管理。

> ⚠️ **尚未初始化為 git repo**，目前無 version control。

## 最新進度

目前 idle — 無 git 歷史可查。包含 `Vision.bat` / `Vision-Webcam.bat` 啟動腳本，以及 `GUITEST.PY` 測試介面。

## 已知 TODO

- 初始化 git repo（`git init` + 設定 `.gitignore` 排除 model weights / cache）
- 展間掃描 HUD 系統整合（RealSense 深度攝影機 + YOLO11 pose）
- 確認骨架偵測方案（YOLO11 pose vs MediaPipe vs OpenPose）

## 關鍵決策（待定）

- **git 初始化**：尚未執行，需先確認 `.gitignore`（.pt 模型檔案大，需 LFS 或排除）
- **展間掃描 HUD 系統 5 個關鍵決策**（見 [[../Backlog]]）：時程、RealSense 型號、TD 分工、scope cut、骨架方案

## 連結

- 本機路徑：`D:/Visustwin/visustwin-vision`
- 相關 legacy：`D:/Visustwin/visustwin_yolo`（舊版，`a2bc625` 初始化 2025-05-14）

## 返回

- [[01 Projects/Visustwin/MOC|Visustwin MOC]]
