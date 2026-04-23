---
title: Vault 重構遷移執行報告
date: 2026-04-19
branch: feat/vault-restructure
tag: pre-vault-restructure-2026-04-19
---

# Vault 重構遷移 — 執行報告

## 執行結果摘要

PARA (`01 Projects / 02 Areas / 03 Products / 04 Resources / 05 Archive`) 已拆解整併為
Product-centric 結構（`Products / Projects / Company / Knowledge / Legacy / Inbox / 00 Meta`）。

| 類別 | 數量 |
|---|---|
| 搬移 | 75+ 檔 |
| 合併（Q1 B：plugin intro + spec → README.md） | 9 個 plugin |
| 刪除（PPTX — Q4 C） | 2 檔（OTA120_v7/v8.pptx） |
| 刪除（obsolete PARA MOC） | 7 檔 |
| 新建 | 2 檔（`Now.md`, 本報告） |

## 核心決策套用紀錄

- **Q1 B** — 9 個 plugin（dashboard, warp.windtunnel, vision.detector, wind.analysis, dev.repl, camera.travel, exhibition.board, mqtt.bridge, osc.controller）的「簡介 README」+「spec」已合併成單一 `README.md`。格式：頂部 YAML frontmatter + 簡介 + `Features/Settings` 等 → `---` 分隔 → `## Web化 評估 / 技術細節` + 原 spec 內容（`##` 降級為 `###`）。
- **Q2 B** — `visustwin.light.compass.md` + `Visustwin Light Compass.md` 整組搬 `Legacy/2025/light.compass/`（未合併，保留兩檔原貌）。
- **Q3 B** — `welltek-twin.md` → `Projects/welltek/README.md`；`visustwin-vision.md` → `Products/Visustwin/Plugins/visustwin-vision/README.md`。
- **Q4 C** — `OTA120_v7.pptx`、`OTA120_v8.pptx` `git rm` 刪除。PDF 版保留於 `Projects/寶鋪 showcase/deliverables/`。
- **Q5 B** — 04 Resources 全數檔案 `git log` 最後修改日皆為 2026-04-18（單一大批次提交），在 2026-01-19 cutoff 之內 → **全部進 `Knowledge/Lived/`**，按主題分成 Ontology / Ontology-Engineering / Omniverse / Gaussian-Splatting / AI-Frameworks / XR / Github 子資料夾。

## Commit 記錄

| # | Commit | 說明 |
|---|---|---|
| 0 | tag `pre-vault-restructure-2026-04-19` on `6ff40eb` | 回復點 |
| 1 | `a22c4d6` | scaffold target directories |
| 2 | `6ee973d` | move 03 Products to Products/ with plugin README merge |
| 3 | `7f2a138` | move 01 Projects to Projects/ and Products/ |
| 4 | (step 4 in step-5 commit batch) | - |
| 5 | `e0d4d37`（含 04 Resources split） | split 04 Resources + move 05 Archive |
| 6 | `66afdc4` | remove empty 02 Areas |
| 8 | (this commit) | add Now.md + execution report |

分支：`feat/vault-restructure`（尚未 push）

## Broken wikilink 清單（**未自動修**，留給使用者決定）

### 1. 路徑型 `[[01 Projects/Visustwin/MOC|Visustwin MOC]]` — 18 處

目標已搬到 `Products/Visustwin/README.md`。建議全域取代為
`[[Products/Visustwin/README|Visustwin]]`（或 Obsidian 短連結 `[[README]]` 若不衝突，但因 README.md 太多，建議用絕對路徑）。

- `Projects/welltek/README.md:51`
- `Products/Metaarchetech-site/README.md:55`
- `Legacy/2025/light.compass/visustwin.light.compass.md:103`
- `Products/Visustwin/sprints/2026-04-18.md:63`
- `Products/Visustwin/Web/visustwin-showcase/README.md:47`
- `Products/Visustwin/Web/WebController/README.md:50`
- `Products/Visustwin/Backlog.md:52`
- `Products/Visustwin/Plugins/_repo-notes.md:45`
- `Products/Visustwin/Plugins/bim.inspector/README.md:112`
- `Products/Visustwin/Plugins/ai.oracle/README.md:93`
- `Products/Visustwin/Plugins/elements.core/README.md:100`
- `Products/Visustwin/Plugins/sunlight.studio/README.md:113`
- `Products/Visustwin/Plugins/solar.heatmap/README.md:119`
- `Products/Visustwin/Plugins/solar.report/README.md:114`
- `Products/Visustwin/Plugins/moisture.health/README.md:104`
- `Products/Visustwin/Plugins/visustwin-vision/README.md:45`
- `Products/Visustwin/Plugins/esg.tracker/README.md:111`

### 2. 路徑型 `[[01 Projects/OTA120/MOC|OTA120 MOC]]` — 2 處

目標已搬到 `Projects/寶鋪 showcase/README.md`。

- `Projects/寶鋪 showcase/寶舖品牌概念對照表.md:181`
- `Projects/寶鋪 showcase/deliverables/OTA120_v6_draft.md:268`

### 3. 相對路徑 `[[../Omniverse Web化 評估|主評估文件]]` — 12 處

目標已搬到 `Products/Visustwin/decisions/Omniverse-Web化-評估.md`。

- `Legacy/2025/light.compass/visustwin.light.compass.md:100`
- `Products/Visustwin/decisions/Web化-Massing-Pipeline.md:277`（附帶 `[[Web化 整併提案|整併提案]]` 也需檢查）
- `Products/Visustwin/decisions/Web化-整併提案.md:391`
- `Products/Visustwin/decisions/Web化-架構選項.md:239`
- `Products/Visustwin/Plugins/bim.inspector/README.md:109`
- `Products/Visustwin/Plugins/ai.oracle/README.md:90`
- `Products/Visustwin/Plugins/elements.core/README.md:97`
- `Products/Visustwin/Plugins/esg.tracker/README.md:108`
- `Products/Visustwin/Plugins/moisture.health/README.md:101`
- `Products/Visustwin/Plugins/solar.heatmap/README.md:116`
- `Products/Visustwin/Plugins/solar.report/README.md:111`
- `Products/Visustwin/Plugins/sunlight.studio/README.md:110`

### 4. `[[01 Projects MOC]]` / `[[02 Areas MOC]]` / `[[03 Products MOC]]` / `[[04 Resources MOC]]` / `[[05 Archive MOC]]` — 全部已刪除（obsolete PARA nav）

建議取代為新 MOC（若需要）或直接移除這些反向連結。

- `index.md:12-16`（5 條一起）
- `00 Meta/Vault Home.md:12-16`（5 條一起；此檔需全面改寫）
- `00 Meta/dashboards/Projects Dashboard.md:83`（指向已刪除的 `01 Projects MOC`）
- `Products/Design-System/README.md:1097`（指向已刪除的 `04 Resources MOC`）
- `Projects/寶鋪 showcase/README.md:27,30`（2 條指向已刪除的 `01 Projects MOC`）
- `Products/Visustwin/README.md:59`（指向已刪除的 `01 Projects MOC`；應取代為 `[[Vault Home]]` 或新的頂層 MOC）
- `Legacy/2025/archive/VisusTwin/VisusTwin.md:13`
- `Legacy/2025/archive/2025 Scrum/In-Development Projects.md:3`

### 5. `[[Technology Stack MOC]]` — 已刪除；8 處反向連結

- `00 Meta/Vault Home.md:20`
- `Knowledge/Lived/XR/README.md:1`
- `Knowledge/Lived/Gaussian-Splatting/README.md:1`
- `Knowledge/Lived/Model Context Protocol.md:2`
- `Knowledge/Lived/AI-Frameworks/README.md:1`
- `Knowledge/Lived/Omniverse/README.md:2`
- `Knowledge/Lived/Ontology-Engineering/README.md:67`
- `Knowledge/Lived/Ontology-Engineering/Ontology 工程堆疊.md:260`
- `Knowledge/Lived/Ontology-Engineering/The Palantir Ontology System.md:188`

### 6. `[[Visustwin Extensions MOC]]` — 目標已改名為 `Products/Visustwin/Plugins/README.md`

- `Legacy/2025/light.compass/Visustwin Light Compass.md:50`（此檔在 Legacy，按現狀保留）

短連結 `[[Visustwin Extensions MOC]]` 在 Obsidian 短連結模式下會無法解析。若要讓 Legacy 連結還可追溯，建議在 Plugins/README.md 頂部加 alias frontmatter：
```yaml
aliases: [Visustwin Extensions MOC]
```

### 7. 短連結仍可能有效（未逐項驗證）

- `[[Vault Home]]` — 目標仍存在 `00 Meta/Vault Home.md`，Obsidian 短連結可解析。
- `[[Projects Dashboard]]` — 目標已搬到 `00 Meta/dashboards/`，Obsidian 短連結仍可解析（檔名未變）。
- `[[Claude Memory]]` / `[[Workflow]]` / `[[Tasks]]` — 全部仍在 `00 Meta/`，短連結可解析。

## 待使用者裁示的後續事項

1. **Vault Home.md** 內容完全過時（指向五個已刪除的 PARA MOC）。建議重寫為新結構索引，或直接刪掉改用 `index.md` + `Now.md`。
2. **index.md**（Quartz 入口）同樣指向已刪除的 5 個 PARA MOC，需重寫。
3. 18 個 plugin 的 `← [[01 Projects/Visustwin/MOC|...]]` backlinks 可用腳本批次取代（建議使用者手動執行，以免誤改）。
4. **Quartz build** 未執行。`quartz.config.ts` 可能需依新結構更新 `folderColors` 等設定。
5. **`.obsidian/workspace.json`** 可能保留舊 tab 路徑，重開 Obsidian 即可清空。
6. `00 Meta/dashboards/Projects Dashboard.md` 是否仍在用？若否可刪；若仍用需更新內容。
7. `Products/Visustwin/README.md`（原 Visustwin MOC）的標題行 `# Visustwin MOC` 建議改為 `# Visustwin` 以配合新定位（不再是 PARA MOC，而是產品頁）。
8. 這份 migration-plan + execution-report 檔本身的歸宿（`00 Meta/`？或移至 `Legacy/2026/` 歸檔？）。

## 未做的動作（符合指示）

- **未 push**：所有 commit 只在本地 `feat/vault-restructure` 分支。
- **未自動修 wikilink**：清單整理完整但不改原檔（除合併 plugin README 時已把內部重複 backlink 統一為新路徑 `[[Products/Visustwin/Plugins/README|Visustwin Plugins]]`）。
- **未跑 Quartz build**：未執行 `npx quartz build`。

## 回復方式

若整個遷移要放棄：
```
git checkout master
git branch -D feat/vault-restructure
git tag -d pre-vault-restructure-2026-04-19
```

若要回到遷移前狀態但保留分支：
```
git reset --hard pre-vault-restructure-2026-04-19
```
