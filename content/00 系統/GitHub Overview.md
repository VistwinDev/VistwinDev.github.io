---
created: 2026-05-02
updated: 2026-05-05
tags: [meta, github, infrastructure]
---

# GitHub Overview

> ⚠️ **Legacy（org 遷移前）**：本頁是舊 `metaarchetech` user 帳號 repo 全圖。當前 org（VistwinProject / VistwinDev）的 repo 鏡像見 vault 內 `04 Github/`；org 邊界見 [[Entity_Map]]。此頁僅供考古。

> Hub for everything `metaarchetech` 持有的 GitHub repo + 必要的上游 fork。  
> 讓 Obsidian 內就能看到全貌、跳到對應筆記。  
> 帳號 `metaarchetech` 是 **User**(不是 organization),12 個 owned repo:2 public + 10 private。

---

## Repo 全圖(以 push 時間排序)

| # | Repo | Visibility | Status | 用途 | 最近 push |
|---|---|---|---|---|---|
| 1 | [metaarchetech-vault](https://github.com/metaarchetech/metaarchetech-vault) | private | active | Obsidian vault(本檔所在) | 2026-05-04 |
| 2 | [metaarchetech.github.io](https://github.com/metaarchetech/metaarchetech.github.io) | **public** | held | Quartz 公開站(branch `v4`) | 2026-05-03 |
| 3 | [visustwin-extensions](https://github.com/metaarchetech/visustwin-extensions) | private | **active** | Omniverse Kit Python ext mirror(21 plugins) | 2026-05-01 |
| 4 | [vistwin-plugins-web](https://github.com/metaarchetech/vistwin-plugins-web) | private | **active** | VisTwin plugin Web demo / Studio Shell | 2026-05-01 |
| 5 | [visustwin-showcase](https://github.com/metaarchetech/visustwin-showcase) | private | **active** | 設計系統展示 lab(GlassCard / motion gallery) | 2026-05-01 |
| 6 | [visionbase-monitor](https://github.com/metaarchetech/visionbase-monitor) | private | **active** | Visionbase 區網監控站(Next.js + PowerShell) | 2026-04-29 |
| 7 | [vistwin-kiosk](https://github.com/metaarchetech/vistwin-kiosk) | private | held | Kiosk dashboard framework(分析期) | 2026-04-25 |
| 8 | [visustwin-vision](https://github.com/metaarchetech/visustwin-vision) | private | held | AI 安全監控:YOLO + WebSocket + MJPEG streaming | 2026-04-23 |
| 9 | [vistwinsite](https://github.com/metaarchetech/vistwinsite) | **public** | held | VisTwin 站點(Web) | 2026-04-22 |
| 10 | [visustwin-webcontroller](https://github.com/metaarchetech/visustwin-webcontroller) | private | held | Web controller(舊架構) | 2026-04-22 |
| 11 | [visustwin-welltek-twin](https://github.com/metaarchetech/visustwin-welltek-twin) | private | held | Welltek 客戶 twin(專案分支) | 2026-04-22 |
| 12 | [outside-the-frame](https://github.com/metaarchetech/outside-the-frame) | private | held | (用途待補) | 2026-04-13 |
| — | [NVIDIA-Omniverse/kit-app-template](https://github.com/NVIDIA-Omniverse/kit-app-template) | public | upstream | Kit 110 上游樣板,本地開發基底 | (上游 c98fc5c) |

**Active = 本機有 clone 在 `C:\Visustwin\` + 在當前 sprint 有 commit。**  
**Held = 持有但暫停,本機無 clone(或路徑不在 `C:\Visustwin\`),近期沒 commit。**

---

## A. Active(本地 + 遠端,當前 sprint 有 commit)

### 1. metaarchetech-vault — 本 vault
- **路徑**:`C:\Visustwin\metaarchetech-vault\`
- **分支**:`master`
- **最新 commit**:[`0804b02`](https://github.com/metaarchetech/metaarchetech-vault/commit/0804b02) `vault backup: 2026-05-04 18:34:48`(obsidian-git auto)
- **手動 commit**:[`0d4a4a0`](https://github.com/metaarchetech/metaarchetech-vault/commit/0d4a4a0) disable failing sync-to-quartz workflow
- **棧**:Obsidian + obsidian-git auto backup(每 5 分鐘)
- **入口**:[[index|🏠 vault home]] · [[Now]] · [[02 技術/Visustwin/README|VisTwin]]
- **關係**:所有 repo 的「外部腦」。產品筆記、Sprint、code review、研究 dump 全在這。
- **CI 狀態**:`update-dashboard.yml` 與 `sync-to-quartz.yml` 兩支 workflow **目前 disabled**(`DASHBOARD_PAT` secret 未設,checkout token 為空)。詳見底部「維護指引」。

### 2. visustwin-extensions — Omniverse Kit Python plugin mirror
- **路徑**:`C:\Visustwin\visustwin-extensions\`(`exts/visustwin.*` 21 個 plugin)
- **分支**:`master`
- **最新 commit**:[`748791c`](https://github.com/metaarchetech/visustwin-extensions/commit/748791c) `feat: add ventilation.report + visustwin.fonts; report readability + CJK font support`
- **棧**:Python 3.12(Kit 內建)、omni.usd / omni.ui、matplotlib、Warp(粒子)、stb_truetype 字型
- **入口**:[[02 技術/Visustwin/Plugins/README|Plugins MOC]] · [[02 技術/Visustwin/Plugins/code-review-2026-04-30|code review 2026-04-30]]
- **關係**:由 `kit-app-template` 載入(`source/extensions/` 跟此 repo 內容鏡射)。這 repo 只是 push-mirror,Kit 從 `kit-app-template/source/extensions` 載入。
- **重要 plugin 群**:AIR(warp.windtunnel / wind.analysis / ventilation / **ventilation.report**)/ SUN(sunlight.studio / solar.heatmap / solar.report)/ WATER & HEALTH(moisture.health)/ DATA(mqtt.bridge / osc.controller)/ SAFETY(vision.detector / bim.inspector)/ ESG / AI / Presentation / Dev / **fonts**(CJK)。

### 3. vistwin-plugins-web — VisTwin plugin Web demo / Studio Shell
- **路徑**:`C:\Visustwin\visustwin-plugins-web\`
- **分支**:`main`
- **最新 commit**:[`a08c0fb`](https://github.com/metaarchetech/vistwin-plugins-web/commit/a08c0fb) `chore: initial commit`
- **棧**:Next.js 16 / React 19 / Tailwind v4 / Framer Motion 12 / Phosphor icons
- **入口**:[[02 技術/Design-System/showcase-ui-inventory|showcase UI inventory]] · [[02 技術/Design-System/frontend-stack-matrix|frontend stack matrix]]
- **關係**:從 `visustwin-showcase` 抽出來的 plugin demo + Studio Shell 部分。21 個 plugin 各一頁。
- **拆分理由**:`showcase` 變回純設計 lab,`plugins-web` 專做 plugin 對外簡報用。

### 4. visustwin-showcase — 設計系統展示 lab
- **路徑**:`C:\Visustwin\visustwin-showcase\`
- **分支**:`main`
- **最新 commit**:[`4a04f9b`](https://github.com/metaarchetech/visustwin-showcase/commit/4a04f9b) `refactor: extract plugins to visustwin-plugins-web; become pure design lab`
- **棧**:Next.js 16 / React 19 / Tailwind v4(@theme inline)/ Framer Motion 12 / GlassCard primitive
- **入口**:[[02 技術/Design-System/showcase-ui-inventory|UI inventory]] · [[02 技術/Design-System/frontend-stack-matrix|stack matrix]] · [[02 技術/Design-System/README|Design-System MOC]]
- **關係**:`/lab` 是 800 行 design testbed(Foundations / Cards / Pills / Controls / Layout / Motion / Status / Gallery)。`plugins-web` 從這裡抽出來。
- **獨立 features**:theme switcher / accent picker / density toggles / sticky TOC / cursor-tracked accent halo。

### 5. visionbase-monitor — Visionbase 區網監控
- **路徑**:`C:\Visustwin\visionbase-monitor\`
- **分支**:`main`
- **最新 commit**:[`5528661`](https://github.com/metaarchetech/visionbase-monitor/commit/5528661) `chore: gitignore dev server log files`
- **棧**:Next.js 16 / React 19 / Tailwind v4 / PowerShell parallel runspaces / macvendors API
- **入口**:[[01 專案/visionbase/visionbase-monitor|monitor 專案頁]] · [[01 專案/visionbase/network-inventory|network inventory]] · [[01 專案/visionbase/kuka-control-feasibility|KUKA recon]] · [[01 專案/visionbase/README|visionbase MOC]]
- **關係**:Visionbase 客戶現場(192.168.0.0/24)區網監控站,跑在現場機器上。`/network` 路由顯示即時掃描結果,卡片依 ownership × category 著色。
- **掃描來源**:`scripts/scan-network.ps1`(ping sweep + ARP + TCP probe + vendor lookup)→ `/api/scan` → React。

---

## B. Held(持有但暫停;本機無 clone 或近期未動)

### 6. metaarchetech.github.io
- **Visibility**:public · branch `v4`
- **用途**:Quartz 站(用 vault → site sync)
- **狀態**:遠端有,本地無 clone。原本由 `sync-to-quartz.yml` workflow 從 vault 自動 sync,目前 workflow disabled(同一個 PAT 問題)。
- **再啟用條件**:設 `DASHBOARD_PAT` 跨 repo 權限 → 還原 workflow yml。

### 7. vistwin-kiosk
- **Visibility**:private · branch `master` · 8 KB
- **用途**:VisTwin kiosk dashboard framework — analysis phase
- **狀態**:很小(8 KB)、最後 push 2026-04-25。看起來是規劃期的骨架。

### 8. visustwin-vision
- **Visibility**:private · branch `main` · 66 KB
- **用途**:AI safety monitoring — YOLO + WebSocket + MJPEG streaming server for VisTwin
- **狀態**:跟 `visustwin.vision.detector` plugin(在 `visustwin-extensions`)互補:此 repo 是後端 streaming server,plugin 是 Kit 端 viewer。
- **關係**:[[02 技術/Visustwin/Plugins/README|Plugins MOC]] 中 vision.detector 的 server side。

### 9. vistwinsite
- **Visibility**:**public** · branch `master`
- **用途**:VisTwin 站點(舊架構推測)
- **狀態**:1.3 MB,公開但近期(自 2026-04-22)沒動。可能是早期入口頁。

### 10. visustwin-webcontroller
- **Visibility**:private · branch `master` · 124 KB
- **用途**:Web controller(舊架構)
- **狀態**:看起來是舊版 Web 控制端,被 `vistwin-plugins-web` / `visustwin-showcase` 取代後停用。

### 11. visustwin-welltek-twin
- **Visibility**:private · branch `master` · 234 KB
- **用途**:Welltek 客戶 twin(專案分支)
- **狀態**:客製分支,專案結束後停用?需確認。

### 12. outside-the-frame
- **Visibility**:private · branch `main` · 199 KB
- **用途**:**待補**(repo 沒 description)
- **狀態**:最早(2026-04-13),性質不明。

---

## C. 上游 Fork — 未在 VisTwin 帳號下,但本地深度開發

### NVIDIA-Omniverse/kit-app-template
- **路徑**:`C:\Visustwin\kit-app-template\`
- **遠端**:`https://github.com/NVIDIA-Omniverse/kit-app-template.git`
- **分支**:`main`
- **最新上游 commit**:[`c98fc5c`](https://github.com/NVIDIA-Omniverse/kit-app-template/commit/c98fc5c) `Merge pull request #147 from NVIDIA-Omniverse/110.1.0`
- **本地修改**:`.gitignore` 排除 `/source/`,所有 VisTwin.* plugins 開發都在 `source/extensions/`,push 到 `visustwin-extensions` mirror 而非 fork。
- **關係**:Kit 110.1 的 reference template。`my_company.my_usd_composer.kit` 在這裡 → 載 `visustwin-extensions` 的內容。

---

## D. 當前 Sprint commits(2026-04-29 ~ 今日)

### visustwin-showcase
| Commit | Date | Subject |
|---|---|---|
| [`4a04f9b`](https://github.com/metaarchetech/visustwin-showcase/commit/4a04f9b) | 2026-05-01 | refactor: extract plugins to visustwin-plugins-web; become pure design lab |

### vistwin-plugins-web
| Commit | Date | Subject |
|---|---|---|
| [`a08c0fb`](https://github.com/metaarchetech/vistwin-plugins-web/commit/a08c0fb) | 2026-05-01 | chore: initial commit |

### visionbase-monitor
| Commit | Date | Subject |
|---|---|---|
| [`5528661`](https://github.com/metaarchetech/visionbase-monitor/commit/5528661) | 2026-04-29 | chore: gitignore dev server log files |
| [`da84276`](https://github.com/metaarchetech/visionbase-monitor/commit/da84276) | 2026-04-29 | feat: classify devices by ownership and category |
| [`a289cd0`](https://github.com/metaarchetech/visionbase-monitor/commit/a289cd0) | 2026-04-29 | feat: render real network scan in /network (phase 1A+1B) |
| [`3b29d01`](https://github.com/metaarchetech/visionbase-monitor/commit/3b29d01) | 2026-04-29 | chore: scaffold visionbase-monitor (phase 0) |

### visustwin-extensions
| Commit | Date | Subject |
|---|---|---|
| [`748791c`](https://github.com/metaarchetech/visustwin-extensions/commit/748791c) | 2026-05-01 | feat: add ventilation.report + visustwin.fonts; report readability + CJK font support |
| [`08e0b61`](https://github.com/metaarchetech/visustwin-extensions/commit/08e0b61) | 2026-04-29 | feat(ventilation): new extension + matplotlib auto-install for reports |

### metaarchetech-vault
| Commit | Date | Subject |
|---|---|---|
| [`0804b02`](https://github.com/metaarchetech/metaarchetech-vault/commit/0804b02) | 2026-05-04 | vault backup: 2026-05-04 18:34:48 |
| [`0c500c3`](https://github.com/metaarchetech/metaarchetech-vault/commit/0c500c3) | 2026-05-03 | vault backup: 2026-05-03 23:01:46 |
| [`12ef93d`](https://github.com/metaarchetech/metaarchetech-vault/commit/12ef93d) | 2026-05-03 | vault backup: 2026-05-03 22:56:36 |
| [`0d4a4a0`](https://github.com/metaarchetech/metaarchetech-vault/commit/0d4a4a0) | 2026-05-02 | chore: disable failing sync-to-quartz workflow |
| [`ba8e0e3`](https://github.com/metaarchetech/metaarchetech-vault/commit/ba8e0e3) | 2026-05-02 | chore: disable failing 'Update GitHub Dashboard' workflow |
| [`8c9e6c8`](https://github.com/metaarchetech/metaarchetech-vault/commit/8c9e6c8) | 2026-05-01 | cleanup: remove test file |
| [`aaa3d7e`](https://github.com/metaarchetech/metaarchetech-vault/commit/aaa3d7e) | 2026-05-01 | test: verify ruleset disabled |
| [`046027e`](https://github.com/metaarchetech/metaarchetech-vault/commit/046027e) | 2026-05-01 | feat: auto-updating GitHub dashboard + vault→Quartz sync |
| `…` | 2026-04-29 ~ 05-01 | obsidian-git auto backups(7 個) |

### kit-app-template
無新 commit(沿用上游 110.1.0)。

---

## E. 跨 vault 連結

### 設計系統 / 前端
- [[02 技術/Design-System/showcase-ui-inventory]] — showcase + plugins-web 的元件清單(741 行)
- [[02 技術/Design-System/frontend-stack-matrix]] — 前端棧 matrix
- [[02 技術/Design-System/README|Design-System MOC]]

### VisTwin 產品
- [[02 技術/Visustwin/README|VisTwin 產品頁]]
- [[02 技術/Visustwin/Plugins/README|Plugins MOC]]
- [[02 技術/Visustwin/Plugins/code-review-2026-04-30]] — 26-file audit(3 High / 9 Medium / ~30 Low)
- [[02 技術/Visustwin/Plugins/ventilation.report/architecture-research]] — 換氣分析架構研究

### Visionbase(客戶)
- [[01 專案/visionbase/README|visionbase MOC]]
- [[01 專案/visionbase/visionbase-monitor]] — 監控站專案頁
- [[01 專案/visionbase/network-inventory]] — 區網盤點
- [[01 專案/visionbase/kuka-control-feasibility]] — KUKA robot recon

### 工作流程
- [[Now]] — 本週焦點
- [[index|vault home]]

---

## F. 維護指引

### 此頁的更新頻率
**手動更新**(等 GitHub Actions 修好再切回自動)。

### 自動化現況
| Workflow | 檔案 | 狀態 | 失敗原因 |
|---|---|---|---|
| Update GitHub Dashboard | `.github/workflows/update-dashboard.yml` | **disabled**(只剩 `workflow_dispatch`) | `secrets.DASHBOARD_PAT` 未設 → `actions/checkout@v4` 收到空 token,5 秒就 fail |
| Sync vault to Quartz site | `.github/workflows/sync-to-quartz.yml` | **disabled** | 同上,且需要跨 repo 權限到 `metaarchetech.github.io` |

### 如何手動更新此頁
1. 對 5 個 active repo 各執行 `git fetch origin --quiet && git pull`
2. 對 12 個 owned repo,用 GitHub API 抓 push 時間:
   ```bash
   curl -H "Authorization: Bearer $TOKEN" \
     'https://api.github.com/user/repos?per_page=100&affiliation=owner&visibility=all&sort=pushed'
   ```
3. 編輯本頁:
   - 表格的「最近 push」欄
   - 各 active repo「最新 commit」連結
   - 「D. 當前 Sprint commits」表格

### 如何重啟 auto-update workflow
1. 在 GitHub → Settings → Developer settings → Personal access tokens → Fine-grained 產一個 PAT
   - Resource owner:`metaarchetech`
   - Repo access:`metaarchetech-vault` + `metaarchetech.github.io`(sync-to-quartz 也需要)
   - Permissions:Contents: **Read and write**, Metadata: **Read**
2. `metaarchetech-vault` → Settings → Secrets and variables → Actions → New secret `DASHBOARD_PAT`,貼上 token
3. `git revert ba8e0e3 0d4a4a0`(還原當初的 disable 兩個 commit),push
4. 在 Actions 頁手動 dispatch 一次驗證

### Push 規約
- 此 vault:**obsidian-git 自動每 5 分鐘 commit + push**(不需手動)
- 其他 repo:手動 commit + push
- `visustwin-extensions` 是從 `kit-app-template/source/extensions/` 用 `cp` 同步過去;不是 git submodule

---

_本頁建立於 [[2026-05-02]],最近更新 [[2026-05-05]]。_
