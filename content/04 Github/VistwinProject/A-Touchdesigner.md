---
title: A-Touchdesigner
org: VistwinProject
repo: VistwinProject/A-Touchdesigner
url: https://github.com/VistwinProject/A-Touchdesigner
visibility: private
language: Python
default_branch: main
zone: "A"
group: 寶鋪知行案
status: active
size_kb: 136048
last_push: 2026-06-10
synced: 2026-06-18
tags: [github, repo-mirror, vistwinproject]
---

# A-Touchdesigner

> 寶鋪知行案 A區 數據之門 touchdesigner + yolo

- **Repo**：[VistwinProject/A-Touchdesigner](https://github.com/VistwinProject/A-Touchdesigner) · `private` · Python · branch `main` · 136048 KB
- **展區 / group**：A · 寶鋪知行案
- **狀態**：🟢 active
- **最近 push**：2026-06-10 · open issues 0

## 用途

A 區「數據之門」— RealSense 偵測現場觀眾（人數/年齡/性別/身高）驅動 TouchDesigner 視覺。雙 pipeline：純 TD（SCRFD+genderage onnx）/ Python+OSC（YOLOv8-pose+DeepFace）。

## 最近 commits

| date | author | message |
|---|---|---|
| 2026-06-10 | changchen0913 | Merge branch 'main' of https://github.com/VistwinProject/A-Touchdesigner |
| 2026-06-10 | changchen0913 | Initial commit: 數據之門 TD 專案 |
| 2026-05-27 | changchen0913 | Add full project source, both pipelines, and unified README |
| 2026-05-27 | changchen0913 | Initial commit: TouchDesigner project + YOLO model |

## README 摘錄

````md
# 數據之門 (A 區)

寶鋪知行案 A 區互動裝置。透過 Intel RealSense 偵測現場觀眾，輸出人數、年齡、性別、身高等資料，驅動 TouchDesigner 視覺。

---

## 一、兩條獨立 Pipeline

這 repo 同時提供兩種解法，**擇一**使用即可。兩條都跑也可以，但 OSC port / RealSense 資源會打架。

```
              ┌────────────────────────────────────────────┐
              │  Pipeline A  ─ 純 TouchDesigner            │
              │  RealSense → TDYolo v2 → Script TOP        │
              │              (face_analyzer.py:             │
              │               SCRFD + genderage onnx)       │
````

## 關聯
- [[01 專案/寶鋪 showcase/zones/A-數據之門]]
- [[04 Github/README|← 04 Github 索引]]

---
_由 `scripts/sync-github-repos.mjs` 於 2026-06-18 生成。重跑可刷新。_
