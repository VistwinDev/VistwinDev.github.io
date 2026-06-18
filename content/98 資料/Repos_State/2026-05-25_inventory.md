---
title: Local + Remote Repos Inventory
date: 2026-05-25
host: VisTwin (D:\VisTwin)
total_repos: 16
git_repos: 16
non_git_project_folders: 2
pat_scope_note: 當前 gh PAT 為 fine-grained，只看得到 metaarchetech-vault / metaarchetech.github.io / vistwinsite。其餘 8 個 VisTwin repo API 端 404（PAT 沒授權該 repo），本機 git fetch 用 cached 憑證也 403。Remote 欄位有些只能從 local cache 推。
---

# Repos Inventory — 2026-05-25

掃描範圍：`D:\Visustwin\*`（13 git repo + 5 非 git 資料夾）+ `D:\reference\*`（3 git repo）= 共 **16 git repo**。

對接戰略：[[../../Now|Now]] / [[../../00 系統/Entity_Map|Entity_Map]]。

---

## 1. 狀態總覽

| Repo | Branch | 預設 | Sync vs upstream | Dirty | Last commit | 標色 |
|---|---|---|---|---|---|---|
| ArchVizExplorer | master | — | no commits / no remote | 8 untracked | (空 repo) | 🟡 |
| kit-app-template | main | main ✅ | behind 3 | 2 mod + 16 untr | 10 wks ago | 🟡 |
| metaarchetech-site | v4 | v4 ✅ | **behind 3** | clean | 5 days ago | 🔴 |
| obsidian (vault) | master | master ✅ | behind 2 | clean | 5 days ago | 🟡 |
| outside-the-frame | main | main ✅ | up-to-date | 1 mod + 2 untr | 5 days ago | 🟡 |
| vistwin-kiosk | master | (unknown) | up-to-date | clean | 4 wks ago | 🔵 |
| visustwin-extensions | master | master ✅ | up-to-date | **25 untracked** | 3 wks ago | 🔴 |
| visustwin-showcase | main | main ✅ | up-to-date | 3 untracked | 3 wks ago | 🟡 |
| visustwin-vision | **feat/headless-server-mjpeg** | main ❌ | up-to-date (feat) | 2 mod + 1 untr | 4 wks ago | 🔴 |
| visustwin-website | master | master ✅ | up-to-date | 1 untracked | 5 wks ago | 🔵 |
| visustwin_yolo | master | master ✅ | up-to-date | clean | **1 year ago** | 🟢 |
| WebController | **claude/docs-bootstrap-all-repos** | master ❌ | up-to-date (feat) | clean | 4 wks ago | 🔴 |
| welltek-twin | **claude/docs-bootstrap-all-repos** | master ❌ | up-to-date (feat) | clean | 4 wks ago | 🔴 |
| anthropic-cookbook | main | main ✅ | up-to-date | clean | 5 days ago | 🔵 |
| claude-skills | main | main ✅ | up-to-date | clean | 5 days ago | 🔵 |
| founder-os | master | master ✅ | up-to-date | 8 untracked | 4 mo ago | 🟡 |

註：fetch 對 8 個 VisTwin repo 因 PAT 沒授權回 403，這些 repo 的 "up-to-date" 是依本機最後一次成功 fetch 的 cache 判斷，不是即時 truth。obsidian / metaarchetech-site / vistwinsite / NVIDIA kit-app-template / anthropic-cookbook / claude-skills / founder-os 是真即時。

---

## 2. 紅色清單（要立刻處理）

> 用 §4 戰略 anchor 排序：對「主線 A / B + 寶舖 6/6」最近的優先。

### R1. `visustwin-extensions` — 25 untracked，3 週沒 commit
- **事實**: master clean、與 origin 同步，但工作目錄有 25 個未追蹤檔案（含 `.claude/`、`MIRROR.md`、`NVIDIA_AI_Integration_Brief.md` 等）
- **意味**: NVIDIA Integration Brief / MIRROR 文檔等可能是研究產物，若是垃圾或本機 cache 要 gitignore；若是要 commit 的就 commit
- **動作**: `cd D:\Visustwin\visustwin-extensions && git status` 過一遍人工分類

### R2. `metaarchetech-site` — v4 落後 origin 3 個 commit
- **事實**: 本機 v4 落後 origin/v4 三個 commit；本機 clean
- **意味**: 站點對外公開倉，遠端有 dependabot 或別人推的更新還沒拉
- **遠端**: 2 個開 PR（dependabot：production-deps #6, ci-deps #5）
- **動作**: `git pull origin v4`，然後決定是否 merge dependabot PR

### R3. `obsidian` (vault) — master 落後 origin 2 個 commit
- **事實**: vault 本機落後 origin/master 2 個 commit
- **意味**: obsidian-git plugin 該自動 sync 但沒拉到（或是別台機器剛推的還沒輪到）
- **動作**: 若無衝突 `git pull --rebase`；若 vault-publish-pipeline skill 沒派 cron 也對得起來

### R4. `visustwin-vision` — 在 feature branch `feat/headless-server-mjpeg` 沒回 main
- **事實**: 在 feature branch、與其 origin 同步、有 2 個 src 修改（`app.py`, `demo.py`）+ 1 untracked
- **意味**: 4 週前開的 headless server + MJPEG 改造 PR 還沒收，src 還在改
- **動作**: 決定（a）收掉 merge 回 main、（b）繼續做、（c）廢掉。Memory 提到 yolo_next_steps 已完成 detector — 此 branch 也許是延伸

### R5. `WebController` — 在 `claude/docs-bootstrap-all-repos`，1 commit 沒 merge 回 master
- **事實**: 4 週前 Claude 推的 docs bootstrap PR，至今未 merge 回 master
- **動作**: 開 PR merge 進 master，或 abandon branch

### R6. `welltek-twin` — 同 R5
- **事實**: 同上 pattern，同一天 4 週前 Claude bootstrap docs PR 1 ahead
- **動作**: 與 R5 一起處理（同 branch 名 + 同 commit message pattern）

---

## 3. 黃色清單（注意但非緊急）

### Y1. `ArchVizExplorer` — Unreal 專案，無 commit 無 remote
- 8 個 untracked（`.claude/`、`.gitignore`、`*.uproject` 等）
- 純本機 Unreal 5 project，從來沒推過
- **動作**: 決定要不要建 GitHub repo + 第一次 commit；或標為本機-only

### Y2. `kit-app-template` — 上游 NVIDIA fork，落後 3 + 18 dirty
- 是 NVIDIA 官方 template fork，落後 main 3 commit（其中 v110.1.0 / v110.1.1 release）
- 18 個 dirty 是本機加的腳本（`create_explorer.py`, `diagnose_usd.py`, `fix_materials.py` 等）+ 改 `premake5.lua` / `repo.toml`
- 屬於[[../../01 專案/VisTwin/project_kit_web_architecture|kit-web architecture]]主舞台
- **動作**: 決定要不要 rebase 到 NVIDIA 110.1.1；本機腳本是否移到[[../../01 專案/VisTwin/project_kit_bridge|kit-bridge]] `_repl/` 之外的地方

### Y3. `outside-the-frame` — 1 mod + 2 untracked（瑣碎）
- `M .claude/launch.json`、`?? .claude/worktrees/`、`?? tsconfig.tsbuildinfo` — 都是 Claude / TS build artifact
- **動作**: gitignore 加進去就好

### Y4. `visustwin-showcase` — 3 untracked screenshots
- `screenshots/phase1a-console-initial.png` 等
- **動作**: commit 進 demo log 或 gitignore screenshots/

### Y5. `founder-os` — 8 untracked（本機 .claude/ 配置）
- reference clone，untracked 都是本機 `.claude/` 客製
- **動作**: 不動。Reference repo，本機客製不該 push 回上游

---

## 4. 綠色清單（可考慮 archive / 廢棄）

### G1. `visustwin_yolo` — 1 年沒動
- 2025-05-14 唯一 commit「初始化」，之後完全沒進度
- 已被 [[../../01 專案/VisTwin/yolo_next_steps|visustwin-vision + visustwin.vision.detector]] 取代
- **動作**: archive on GitHub（之後不打開），或本機資料夾 rename `_archive/`

---

## 5. 藍色清單（健康，不用動）

| Repo | 狀態 |
|---|---|
| `vistwin-kiosk` | 4 wks ago clean，master 對齊 |
| `visustwin-website` | 5 wks ago clean（1 untracked 是 .claude/worktrees/ 雜物） |
| `anthropic-cookbook` | reference，5 days ago 同步 |
| `claude-skills` | reference，5 days ago 同步 |

---

## 6. 非 git 但像 project 的資料夾

### `D:\Visustwin\deployments\baopu-v0.1` — **要注意**
- 18.1 MB
- 結構：`apps/ assets/ config/ extensions/ scripts/ stage/ manifest.toml README.md`
- **這是寶舖 6/6 deliverable 的 Omniverse Kit deployment artifact**
- 沒在版控，沒有遠端
- **動作**: 決定是否：（a）建獨立 repo `baopu-twin-deployment`、（b）併進 visustwin-extensions、（c）刻意保持本機-only deployment bundle

### `D:\Visustwin\Archviz` — 4.7 GB backup
- 內含 `archviz 260417 備份` 目錄 + 同名 zip
- 純檔案備份，不是 project
- **動作**: 確認是否還需要，可考慮搬到外接

### `D:\Visustwin\_repl` — Kit bridge IPC
- 1 個 `cmd.py`
- [[../../01 專案/VisTwin/project_kit_bridge|kit-bridge]] file IPC 落腳處
- 不需動，已記憶

### `D:\Visustwin\.claude` / `D:\Visustwin\_backups`
- Claude config / 空 backup — 都不用動

---

## 7. 細節（每 repo 完整資訊）

### `D:\Visustwin\ArchVizExplorer`
- Remote: 無
- Branch: master（無 commit）
- Sync: N/A
- Dirty: 8 untracked（含 `.claude/`、`.gitattributes`、`.gitignore`、`ArchVizExplorer.uproject`、`test.tosc` 等）
- Last commit: 無
- 預設 branch: 沒設
- 遠端狀態: 無 GitHub repo

### `D:\Visustwin\kit-app-template`
- Remote: `https://github.com/NVIDIA-Omniverse/kit-app-template.git`
- Branch: main（= 預設）
- Sync: behind 3
- Dirty: 2 modified（`premake5.lua`, `repo.toml`）+ 16 untracked（`create_explorer.py`, `diagnose_usd.py`, `fix_materials.py` 等本機腳本）
- Last commit: `2204ecb 2026-03-17 Removing .claude folder (#146)`（10 wks ago）
- 遠端: public、971 stars、archived=false、open_issues=29、最近 push 2026-05-08
- 上游缺的 3 個 commit：`f130d19 110.1.1`、`c98fc5c Merge #147`、`bb8243d 110.1.0`

### `D:\Visustwin\metaarchetech-site`
- Remote: `https://github.com/metaarchetech/metaarchetech.github.io.git`
- Branch: v4（= 預設）
- Sync: **behind 3**
- Dirty: clean（另有本機 `feature/dna-port` branch）
- Last commit: `d69a2ab 2026-05-20 ui: mobile AI ICON 改右下角`
- 遠端: public、archived=false、open_issues=2、最近 push 2026-05-24、預設 v4
- 開 PR: #6 dependabot production-deps、#5 dependabot ci-deps

### `D:\Visustwin\obsidian`（vault）
- Remote: `https://github.com/metaarchetech/metaarchetech-vault.git`（embedded PAT）
- Branch: master（= 預設）
- Sync: behind 2
- Dirty: clean
- Last commit: `d6c5b91 2026-05-20 docs(publishing): scrub VisTwin refs from VisionBase Setup Runbook`
- 遠端: **private**、archived=false、最近 push 2026-05-24

### `D:\Visustwin\outside-the-frame`
- Remote: `https://github.com/metaarchetech/outside-the-frame.git`
- Branch: main（= 預設）
- Sync: up-to-date（cache 判定，PAT 沒 access）
- Dirty: 1 mod（`.claude/launch.json`）+ 2 untracked（`.claude/worktrees/`, `tsconfig.tsbuildinfo`）
- Last commit: `d3b1651 2026-05-19 Default /wall-lab to 3D Depth (match showcase preference)`
- 遠端: PAT 沒授權，gh API 404

### `D:\Visustwin\vistwin-kiosk`
- Remote: `https://github.com/metaarchetech/vistwin-kiosk.git`
- Branch: master（預設不明 — symbolic-ref 沒設）
- Sync: up-to-date
- Dirty: clean
- Last commit: `2e45467 2026-04-25 chore: initial analysis report`
- 遠端: PAT 沒授權，gh API 404

### `D:\Visustwin\visustwin-extensions`
- Remote: `https://github.com/metaarchetech/visustwin-extensions.git`
- Branch: master（= 預設）
- Sync: up-to-date
- Dirty: **25 untracked**（含 `.claude/`, `MIRROR.md`, `NVIDIA_AI_Integration_Brief.md` 等）
- Last commit: `748791c 2026-05-01 feat: add ventilation.report + visustwin.fonts; report readability + CJK font support`
- 遠端: PAT 沒授權，gh API 404

### `D:\Visustwin\visustwin-showcase`
- Remote: `https://github.com/metaarchetech/visustwin-showcase.git`
- Branch: main（= 預設）
- Sync: up-to-date
- Dirty: 3 untracked（`screenshots/phase1a-*.png`）
- Last commit: `4a04f9b 2026-05-01 refactor: extract plugins to visustwin-plugins-web; become pure design lab`
- 遠端: PAT 沒授權，gh API 404

### `D:\Visustwin\visustwin-vision`
- Remote: `https://github.com/metaarchetech/visustwin-vision.git`
- Branch: **`feat/headless-server-mjpeg`**（預設 main）❌
- Sync: feat branch up-to-date
- Dirty: 2 mod（`src/visustwin_vision/app.py`, `src/visustwin_vision/demo.py`）+ 1 untracked（`.claude/`）
- Last commit: `60a8e79 2026-04-23 feat: headless server + MJPEG streaming for web-first vision`
- 遠端: PAT 沒授權，gh API 404

### `D:\Visustwin\visustwin-website`
- Remote: `https://github.com/metaarchetech/vistwinsite.git`
- Branch: master（= 預設）
- Sync: up-to-date
- Dirty: 1 untracked（`.claude/worktrees/`）
- Last commit: `74b1de6 2026-04-17 LocaleSuggest mobile back to top + LanguageSwitcher dropdown align fix`
- 遠端: **public**、archived=false、open_issues=1、最近 push 2026-04-22、開 PR #1 `claude/rebrand-audit` Rebrand audit: VisTwin → VisTwin

### `D:\Visustwin\visustwin_yolo`
- Remote: `https://github.com/metaarchetech/visustwin_yolo.git`
- Branch: master（= 預設）
- Sync: up-to-date
- Dirty: clean
- Last commit: `a2bc625 2025-05-14 初始化`（**1 year ago**）
- 遠端: PAT 沒授權，gh API 404

### `D:\Visustwin\WebController`
- Remote: `https://github.com/metaarchetech/visustwin-webcontroller.git`
- Branch: **`claude/docs-bootstrap-all-repos`**（預設 master）❌
- Sync: feat branch up-to-date；vs master: ahead 1
- Dirty: clean
- Last commit: `413bd29 2026-04-23 docs: extend CLAUDE.md into full agent bootstrap`
- 遠端: PAT 沒授權，gh API 404

### `D:\Visustwin\welltek-twin`
- Remote: `https://github.com/metaarchetech/visustwin-welltek-twin.git`
- Branch: **`claude/docs-bootstrap-all-repos`**（預設 master）❌
- Sync: feat branch up-to-date；vs master: ahead 1
- Dirty: clean
- Last commit: `5a116eb 2026-04-23 docs: add agent bootstrap CLAUDE.md`
- 遠端: PAT 沒授權，gh API 404

### `D:\reference\anthropic-cookbook`
- Remote: `https://github.com/anthropics/anthropic-cookbook.git`
- Branch: main（= 預設）
- Sync: up-to-date
- Dirty: clean
- Last commit: `1a4f78a 2026-05-19 Merge PR #640 rlm/private-sandbox-updates`
- 遠端: public、43,728 stars、open_issues=206

### `D:\reference\claude-skills`
- Remote: `https://github.com/alirezarezvani/claude-skills.git`
- Branch: main（= 預設）
- Sync: up-to-date
- Dirty: clean
- Last commit: `8aa9208 2026-05-19 Merge PR #701 from alirezarezvani/dev`
- 遠端: public、16,071 stars、open_issues=6

### `D:\reference\founder-os`
- Remote: `https://github.com/cloudrepo-io/founder-os.git`
- Branch: master（= 預設）
- Sync: up-to-date
- Dirty: 8 untracked（本機 `.claude/` 客製）
- Last commit: `a2e6670 2026-02-05 Highlight superpowers and add workflow hero image to README`（4 mo ago）
- 遠端: public、11 stars、open_issues=1

---

## 8. 數字總結

- 共 16 git repo + 1 deployment bundle（baopu-v0.1）
- 🔴 紅: 6（visustwin-extensions、metaarchetech-site、obsidian、visustwin-vision、WebController、welltek-twin）
- 🟡 黃: 5（ArchVizExplorer、kit-app-template、outside-the-frame、visustwin-showcase、founder-os）
- 🟢 綠（可 archive）: 1（visustwin_yolo）
- 🔵 藍: 4（vistwin-kiosk、visustwin-website、anthropic-cookbook、claude-skills）

