---
title: Publishing Stack — Quartz + GitHub + Obsidian Architecture
status: canonical
last_updated: 2026-05-20
audience: lab
keywords: quartz, github, pages, obsidian-git, sync-to-quartz, deploy.yml, cloudflare worker, ai chat, DASHBOARD_PAT
related:
  - "[[../../05 技能/vault-publish-pipeline/SKILL|vault-publish-pipeline]]"
  - "[[VisionBase_Setup_Runbook]]"
---

# Publishing Stack — 完整技術耦合文件

> 本檔是 vault → 站台 publishing pipeline 的 **架構正典**。
> 既有 [[../../05 技能/vault-publish-pipeline/SKILL|vault-publish-pipeline SKILL]]
> 是「操作 / 診斷 skill」（怎麼查、怎麼修），本檔是「為什麼這樣設計 + 各段細節」。
> 兩者互補，不重複。

每條都標：
- `[gt: <來源>]` = ground-truth，實讀檔案 / API 得到
- `[bl]` = baseline 推測 / 設計常識 / 未實讀的部分
- `[?]` = 未確認，待 Frncs 補

---

## 0. 系統全貌

```
┌──────────────────────────────────────────────────────────────┐
│  [1] Obsidian Vault（本機）                                  │
│      <VAULT_ROOT>  (e.g. D:\…\obsidian\ on Windows)          │
│      Plugin: obsidian-git v2.38.2                             │
│        • autoSaveInterval  = 5 min                            │
│        • autoPushInterval  = 5 min                            │
│        • autoPullInterval  = 5 min                            │
│        • pullBeforePush    = true                             │
│        • syncMethod        = merge                            │
│        • commitMessage     = "vault: {{date}} {{hostname}}"   │
│      Remote URL 內嵌 PAT (oauth2 形式)                        │
└──────────────────────────────────────────────────────────────┘
          │ git push (每 5 分鐘 auto)
          ▼
┌──────────────────────────────────────────────────────────────┐
│  [2] GitHub: VisTwin/metaarchetech-vault (PRIVATE)     │
│      Default branch: master                                  │
│      Workflows:                                              │
│        • sync-to-quartz.yml      (active)                    │
│        • update-dashboard.yml    (disabled stub)             │
│      Secret: DASHBOARD_PAT  (set 2026-05-19T21:10:55Z)       │
└──────────────────────────────────────────────────────────────┘
          │ on push to master → sync-to-quartz.yml
          │   1. checkout vault
          │   2. checkout site (with DASHBOARD_PAT)
          │   3. rsync vault/ → site/content/ (--delete + excludes)
          │   4. setup-node 22
          │   5. npm ci && npx quartz build   ← build gate
          │   6. git commit & push to v4
          ▼
┌──────────────────────────────────────────────────────────────┐
│  [3] GitHub: VisTwin/metaarchetech.github.io (PUBLIC)  │
│      Default branch: v4                                      │
│      Workflows:                                              │
│        • Deploy Quartz site to GitHub Pages (deploy.yml)     │
│        • Build and Test (ci.yaml)                            │
│        • Build/Deploy Preview                                │
│        • Docker build & push                                 │
│        • Dependabot                                          │
│      No repo-level secrets — uses GITHUB_TOKEN               │
└──────────────────────────────────────────────────────────────┘
          │ on push to v4 → deploy.yml
          │   1. checkout
          │   2. setup-node 22
          │   3. npm ci
          │   4. npx quartz build           → ./public/
          │   5. node scripts/build-search-index.mjs
          │      → ./public/search-chunks.json
          │   6. upload-pages-artifact (path: public)
          │   7. deploy-pages
          ▼
┌──────────────────────────────────────────────────────────────┐
│  [4] GitHub Pages                                            │
│      https://metaarchetech.github.io/                        │
│      build_type: workflow                                    │
│      source: branch v4 / path /                              │
│      cname: null（無自訂域名）                                │
│      https_enforced: true                                    │
└──────────────────────────────────────────────────────────────┘
          │ AiChat 元件 fetch
          ▼
┌──────────────────────────────────────────────────────────────┐
│  [5] Cloudflare Worker: metaarchetech-ai                     │
│      URL: metaarchetech-ai.metaarteorg.workers.dev           │
│      Stack: Wrangler + index.js + GROQ_API_KEY (worker secret)│
│      功能: RAG proxy (search-chunks.json + Groq LLM)         │
│      Rate limit: 20 req/min/IP（in-memory，cold start reset）│
└──────────────────────────────────────────────────────────────┘
```

> 全圖事實基底見每層 §1–§5。

---

## 1. [1] Obsidian Vault 本機端

### 1.1 路徑與磁碟佈局
- vault root: `<VAULT_ROOT>` `[gt: CLAUDE.md L3, working-with-frncs §13]`
- junction：`C:\Users\<user>\<vault-link>\` → `<VAULT_PARENT>`（家機）`[gt: vault-publish-pipeline SKILL L29]`

### 1.2 Obsidian core 設定
- `app.json`: `alwaysUpdateLinks=true`, `readableLineLength=false`, `showLineNumber=true` `[gt: .obsidian/app.json]`
- `appearance.json`: `accentColor=#ffffff`, enabled CSS snippet `graph-tag-pink` `[gt: .obsidian/appearance.json]`
- CSS snippet `graph-tag-pink.css`：把 graph view 的 tag node 染成 `#f472b6` `[gt: .obsidian/snippets/graph-tag-pink.css]`

### 1.3 Core plugins 開關（白名單摘要）
`[gt: .obsidian/core-plugins.json]`

| 開啟 | 關閉 |
|---|---|
| file-explorer, global-search, switcher, graph, backlink, canvas, outgoing-link, tag-pane, properties, page-preview, daily-notes, templates, note-composer, command-palette, editor-status, bookmarks, outline, word-count, file-recovery, sync, bases | footnotes, slash-command, markdown-importer, zk-prefixer, random-note, slides, audio-recorder, workspaces, publish, webviewer |

> 注意 `sync=true` 是 Obsidian Sync core plugin（付費服務）開關，目前沒實際走 Obsidian Sync —— 同步靠 obsidian-git plugin。`[bl 推測：歷史殘留設定，不影響]`

### 1.4 Community plugin（唯一一支）
`[gt: .obsidian/community-plugins.json, plugins/obsidian-git/manifest.json + data.json]`

- 名稱：**Git** by Vinzent  (`obsidian-git` v2.38.2)
- 設定（`data.json`）：
  ```json
  {
    "commitMessage": "vault: {{date}} {{hostname}}",
    "autoSaveInterval": 5,
    "autoPushInterval": 5,
    "autoPullInterval": 5,
    "autoPullOnBoot": true,
    "disablePush": false,
    "pullBeforePush": true,
    "disablePopups": false,
    "syncMethod": "merge"
  }
  ```
- 行為：每 5 分鐘 auto commit + push + pull，pull 先於 push，merge 而非 rebase。
- 為什麼選這個：跨平台（windows/mac/linux/iOS）、是社群事實標準、設定即文件。
  替代方案：手動 `git commit && push`（太累）、Obsidian Sync（付費 + 不通用）。`[bl]`

### 1.5 Vault folder 命名約定
`[gt: ls <VAULT_ROOT>]`

```
00 系統/        — Entity_Map / Templates / Workflows / Machines / Meta
01 專案/      — VisTwin 各專案（Physical AI / BIM / 寶舖 ...）
02 產品/
03 公司/       — VisTwin Technology 法人 / 商標 / 募資相關
04 知識/     — RAG / 技術筆記（本檔所在）
05 技能/ — 可觸發 skill 集合
06 機台/      — 機器盤點
99 封存/       — legacy 文件
CLAUDE.md         — vault entry point
Now.md            — 當下焦點
_changelog.md
index.md
logs/             — daily / weekly journal
scripts/
```

> 數字前綴 = 強制排序 + 語意分區，Quartz 端 Explorer 元件依字母序顯示自然就 work。`[bl 設計理由]`

### 1.6 `.gitignore`（vault root）
`[gt: <VAULT_ROOT>\.gitignore]`

```gitignore
.obsidian/workspace.json
.obsidian/workspace-mobile.json
.obsidian/graph.json
.obsidian/cache
.trash/
.DS_Store
*.tmp

# Cowork / local tooling
.claude/
```

要點：
- `.obsidian/workspace*.json` / `graph.json` / `cache` 不入庫 — 機器特定 state，commit 會 diff noise。
- `.claude/` 是 Claude Code 工作目錄（含 worktrees / sessions），完全本機 tooling，不上 GitHub。
- `.trash/` 是 Obsidian 刪檔暫存。

### 1.7 Git remote 設計
- remote URL 形式：`https://oauth2:<github_pat>@github.com/metaarchetech/metaarchetech-vault.git` `[gt: git remote -v]`
- git user.name / email：`metaarchetech` / `metaarchetech@gmail.com` `[gt: git config]`
- 為什麼 PAT 嵌 URL：obsidian-git plugin 不支援 credential helper 互動，PAT-in-URL 是它能 push 的方式。`[bl]`
- 已知坑（見 §6）：PAT 缺 workflow scope → 改 `.github/workflows/*.yml` 的 commit 會被 push 拒。

### 1.8 8-worktree 隔離
`[gt: 經驗事實，多次踩過]`

Claude Code 的 `.claude/worktrees/<zen-XXX>/` 每個是獨立 git worktree。**worktree 寫的檔，必須 commit + push 才會出現在主 vault**。
任何 task 跨 worktree 看不到對方 in-progress 改動 = by design。

---

## 2. [2] GitHub vault repo（metaarchetech-vault）

### 2.1 Repo 設定
`[gt: gh repo view metaarchetech/metaarchetech-vault]`

| 項 | 值 |
|---|---|
| visibility | PRIVATE |
| defaultBranchRef | master |
| isPrivate | true |
| hasIssuesEnabled | true |
| hasWikiEnabled | true |

### 2.2 Workflow `sync-to-quartz.yml`
`[gt: .github/workflows/sync-to-quartz.yml]`

**完整邏輯**：

```yaml
on:
  push:
    branches: [master]
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      1. checkout vault          → vault/
      2. checkout site repo      → site/  (ref: v4, token: DASHBOARD_PAT)
      3. rsync -av --delete vault/ site/content/ 帶 11 個 --exclude
      4. actions/setup-node@v4 (node 22)
      5. cd site && npm ci && npx quartz build   ← build gate
      6. cd site && git commit & push  (作者: github-actions[bot])
```

**rsync exclude 清單**：
```
.git .github .gitignore .obsidian .claude .trash .dashboard-fingerprint
private templates "00 系統/Templates"
graph.md Images .gitkeep
```

前 9 個：**private/system 檔案** — 不該到公開站。
後 3 個（`graph.md` / `Images` / `.gitkeep`）：**site-only 檔案** — vault root 不存在，沒 exclude 會被 `--delete` 清掉。

**Build gate 的目的**：rsync 完成後立刻 `npx quartz build`，build fail 整個 job fail，不會 push 壞 content 到 site repo。這比「先 push 再讓 site deploy 失敗」優越得多 —— 一個 fail 點就在 sync workflow，不會出現「site 半壞 content 已 live」。

### 2.3 Workflow `update-dashboard.yml`
`[gt: .github/workflows/update-dashboard.yml]`

目前是 **stub** —— 只 `echo` 一行訊息。註解寫明：2026-05-02 因 `DASHBOARD_PAT` secret 未設導致 5 秒 fail，被改為 stub。**現況**：`DASHBOARD_PAT` 已設（見 §2.4），但 dashboard 邏輯沒 restore；要恢復需從 git 歷史抓回原本 yml + 確認 PAT scope。

### 2.4 Secrets
`[gt: gh secret list --repo metaarchetech/metaarchetech-vault（用 NEW_PAT 才查得到）]`

| Secret | 設定時間 | 用途 |
|---|---|---|
| `DASHBOARD_PAT` | 2026-05-19T21:10:55Z | sync-to-quartz.yml 第 2 步 checkout site repo + 第 6 步 push 到 site repo |

> ⚠️ **vault-publish-pipeline SKILL 寫的「`DASHBOARD_PAT` 未設」已過期**，2026-05-19 已設好（見 §6.3 真實事件）。SKILL 該更新。

### 2.5 PAT scope 需求
- **vault remote 內嵌 PAT**：Contents:R/W on `metaarchetech-vault`。要改 `.github/workflows/*.yml` 還需 Workflows scope 否則 push 被拒。`[gt: reference_vault_pat_scopes.md memory + 多次實踐]`
- **`DASHBOARD_PAT`**：必須對 `metaarchetech.github.io` 有 Contents:R/W；只 R 會在第 6 步 push 失敗（§6.3 真實事件就是這個）。

---

## 3. [3] GitHub site repo（metaarchetech.github.io）

### 3.1 Repo 設定
`[gt: gh repo view metaarchetech/metaarchetech.github.io]`

| 項 | 值 |
|---|---|
| visibility | PUBLIC |
| defaultBranchRef | v4 |
| isPrivate | false |
| homepageUrl | （空） |

> default branch 是 `v4` 不是 `master` —— 這是 Quartz upstream 慣例（fork 自 `jackyzha0/quartz`，他們用 v4 表示 Quartz v4 大版本）。`[bl]`

### 3.2 Repo 結構
`[gt: ls D:\temp\site\]`

```
content/              — 鏡像 vault 內容（由 sync-to-quartz 寫入，禁手改）
quartz/               — Quartz 引擎（fork 自 jackyzha0/quartz）
  components/         — 客製 React 元件
  styles/             — 客製 SCSS
  plugins/            — Quartz plugin 系統（很少動）
  static/             — favicon 等
cloudflare-worker/    — AI chat backend（部署到 Cloudflare）
scripts/
  build-search-index.mjs — 切 chunk 給 AI 用
quartz.config.ts      — 主要設定（pageTitle、theme、plugins）
quartz.layout.ts      — 頁面 layout（components 怎麼擺）
package.json          — quartz v4.5.2 + 自訂依賴
serve-local.cjs       — 本機預覽
Dockerfile / cloudflare-worker  — 額外部署選項（未使用）
```

### 3.3 `quartz.config.ts` 客製化點位
`[gt: D:\temp\site\quartz.config.ts]`

```ts
pageTitle: "VisTwin"
baseUrl: "metaarchetech.github.io"
analytics: { provider: "plausible" }
ignorePatterns: ["private", "templates", ".obsidian"]
defaultDateType: "modified"

theme:
  fontOrigin: "googleFonts"
  typography:
    header: Space Grotesk (300/400/500/600/700)
    body:   Space Grotesk
    code:   JetBrains Mono
  colors:
    lightMode:
      light:        #fafafa
      lightgray:    #e4e4e7
      gray:         #a1a1aa
      darkgray:     #18181b
      dark:         #09090b
      secondary:    #5c9300         ← 深 NVIDIA green
      tertiary:     #76b900         ← NVIDIA brand green
      highlight:    rgba(118,185,0, 0.1)
      textHighlight: #76b90030
    darkMode:
      light:        #09090b
      lightgray:    #27272a
      gray:         #71717a
      darkgray:     #f4f4f5
      dark:         #fafafa
      secondary:    #76b900
      tertiary:     #9dd11f         ← 亮 NVIDIA green
      highlight:    rgba(118,185,0, 0.1)
      textHighlight: #76b90030
```

**Plugin pipeline**：
- transformers: FrontMatter, CreatedModifiedDate（優先順序：frontmatter > git > filesystem）, SyntaxHighlighting（github-light/github-dark, keepBackground=false）, ObsidianFlavoredMarkdown, GitHubFlavoredMarkdown, TableOfContents, CrawlLinks（shortest path）, Description, Latex（katex）
- filters: RemoveDrafts
- emitters: AliasRedirects, ComponentResources, ContentPage, FolderPage, TagPage, ContentIndex（含 sitemap + RSS）, Assets, Static, Favicon, NotFoundPage
- **`CustomOgImages` 已停用**：comment 寫 "emoji codepoint error with CJK+emoji filenames" —— vault 有 emoji + 中文檔名會 crash satori。

### 3.4 `quartz.layout.ts` 客製化
`[gt: D:\temp\site\quartz.layout.ts]`

- **`sharedPageComponents`**:
  - `header: [DnaHeader()]` ← 客製 pill header（hamburger + `{VISTWIN}` wordmark + search + last-update + live-dot + theme toggle）
  - `afterBody: [AiChat({ workerUrl: "https://metaarchetech-ai.metaarteorg.workers.dev" })]` ← 浮動 AI 助理
- **`defaultContentPageLayout`**：beforeBody 用 ConditionalRender 包 Breadcrumbs / ArticleTitle / ContentMeta / TagList / Graph，左欄是 Search + Explorer + GraphLink，右欄是 Graph（localGraph depth=2 + globalGraph depth=-1 同時顯示）+ DesktopOnly(TOC) + Backlinks。
- **`/graph` 路由特殊**：beforeBody 只渲染一個放大的 `Graph` 元件（depth=-1, scale=0.8, repelForce=0.6, focusOnHover=true, enableRadial=true）—— 是專屬的全圖頁。

### 3.5 客製化元件清單
`[gt: ls D:\temp\site\quartz\components\]`

**標準 Quartz 元件**（少數有改）：Backlinks, Body, Breadcrumbs, ContentMeta, Darkmode, Date, DesktopOnly, Explorer, Flex, Footer, Graph, Head, Header, MobileOnly, OverflowList, PageList, PageTitle, ReaderMode, RecentNotes, Search, Spacer, TableOfContents, TagList, renderPage, ConditionalRender, ArticleTitle, Comments

**完全自訂**：
- `DnaHeader.tsx` — 像 DNA / 醫療儀器風格的 pill-style 頂部 header。captured BUILD_TIME_ISO 在 module load 時，用 `data-timestamp` 屬性給 client script 渲染「N 分鐘前」。
- `AiChat.tsx` — 浮動 FAB + side panel，向 cloudflare worker 發 POST。
- `GraphLink.tsx` — 側欄到 /graph 全圖頁的入口連結 `[bl 推測，未細讀]`

### 3.6 客製化樣式
`[gt: ls D:\temp\site\quartz\styles\]`

```
_dna-tokens.scss   — 設計 token（顏色 / spacing / radius）
base.scss          — 全站基礎
callouts.scss      — Obsidian callout 樣式
custom.scss        — VisTwin 客製覆寫
syntax.scss        — code block
variables.scss     — Quartz 原生 variable hook
```

### 3.7 Workflow `deploy.yml`
`[gt: D:\temp\site\.github\workflows\deploy.yml]`

```yaml
on:
  push: { branches: [v4] }
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write   ← OIDC token，給 deploy-pages 用

concurrency: { group: "pages", cancel-in-progress: false }

jobs:
  build:
    runs-on: ubuntu-22.04
    steps:
      1. actions/checkout@v4    (fetch-depth: 0, 給 CreatedModifiedDate 的 git priority 用)
      2. actions/setup-node@v4  (node-version: 22)
      3. npm ci
      4. npx quartz build       → ./public/
      5. node scripts/build-search-index.mjs   → ./public/search-chunks.json
      6. actions/upload-pages-artifact@v3 (path: public)

  deploy:
    needs: build
    environment: { name: github-pages, url: <page_url> }
    runs-on: ubuntu-latest
    steps:
      7. actions/deploy-pages@v4
```

**為什麼 `fetch-depth: 0`**：CreatedModifiedDate transformer 優先用 `git` 推算建檔 / 改檔時間（先 frontmatter，再 git，再 filesystem）—— shallow clone 只有 1 commit 會讓 git 時間全部不準。`[bl 設計推理]`

**`concurrency: pages`**：同時只跑一個 Pages deploy，但 `cancel-in-progress: false` 保證進行中的不被砍，新的排隊。Pages 不能並行 deploy 是 GitHub 限制。

### 3.8 其他 site workflows（次要）
`[gt: gh workflow list]`

- `Build Preview Deployment` / `Upload Preview Deployment` — PR preview 流程 `[bl 未細讀，留 Quartz upstream 原樣]`
- `Build and Test` — CI test
- `Docker build & push image` — Dockerfile-based 容器化發布（未使用）
- `Dependabot Updates` — 自動 PR 升級依賴

### 3.9 Secrets
`[gt: gh secret list --repo metaarchetech/metaarchetech.github.io]`

**空** —— deploy.yml 只用 GitHub-issued `GITHUB_TOKEN`（自動注入）。
sync-to-quartz.yml 第 2 步從 vault repo 帶 `DASHBOARD_PAT` 進來 push（不是 site repo 的 secret）。

---

## 4. [4] GitHub Pages

### 4.1 Pages 設定
`[gt: gh api repos/.../pages]`

```json
{
  "status": "built",
  "cname": null,
  "custom_404": false,
  "html_url": "https://metaarchetech.github.io/",
  "build_type": "workflow",
  "source": { "branch": "v4", "path": "/" },
  "public": true,
  "https_enforced": true
}
```

- `build_type: workflow` —— 不是預設的 Jekyll，是讓 deploy.yml 自己 build + upload artifact。
- `cname: null` —— 沒設 custom domain，全程吃 `metaarchetech.github.io` 子域。

### 4.2 Custom domain（沒設）
- 沒有 `CNAME` 檔在 site repo root 或 content/。`[gt: ls 結果無 CNAME]`
- 沒有 DNS A/CNAME record 設定相關文件。`[bl 推測]`
- 要加 custom domain：repo root 放 `CNAME` 檔（純文字一行 hostname）+ DNS 設 `A` 指向 GitHub Pages 4 個 IP（或 `CNAME` 指 `<user>.github.io`）。

---

## 5. [5] Cloudflare Worker — `metaarchetech-ai`

### 5.1 Wrangler 設定
`[gt: D:\temp\site\cloudflare-worker\wrangler.toml]`

```toml
name = "metaarchetech-ai"
main = "index.js"
compatibility_date = "2024-01-01"
workers_dev = true
```

- **`workers_dev = true`**：自動分配 `metaarchetech-ai.<account-subdomain>.workers.dev` URL。
- 實際生產 URL：`https://metaarchetech-ai.metaarteorg.workers.dev`（在 quartz.layout.ts 寫死）`[gt]`
- 部署指令：`npx wrangler deploy`
- API key 設定：`npx wrangler secret put GROQ_API_KEY`

### 5.2 Worker 邏輯
`[gt: D:\temp\site\cloudflare-worker\index.js]`

- POST only，含 CORS handle
- 速率限制：每 IP 20 req/min（in-memory Map，cold start reset，**重啟即失效** —— 不是嚴格限制，只是攔暴量）
- 接收 `{ query, chunks, mode, model }`：
  - `chunks` 由前端 AiChat client 先用 flexsearch 在 `search-chunks.json` 找到相關片段一起送進來（前端 RAG）
  - `mode` 切 `BASE_VAULT_CONTEXT` / `RESEARCHER_MODE_CONTEXT` / `MANAGER_MODE_CONTEXT` 三套 system prompt
  - `model` 由前端傳 Groq model 名稱
- 用 `GROQ_API_KEY` 呼 Groq，stream 回前端

### 5.3 與 site 的耦合
- AiChat 元件硬編 worker URL —— 改 URL 要改 `quartz.layout.ts` + rebuild + redeploy site。
- `search-chunks.json` 由 `build-search-index.mjs` 在 site build 時生成 → 寫進 `public/` → 跟著 GitHub Pages 上線 → 前端 fetch 後做 RAG → 把相關 chunks 傳給 worker。
- worker 不存任何 vault 內容，只負責 Groq proxy + system prompt 選擇。

> 替代方案：把 chunks search 移到 worker 端、用 D1 / R2 存 embedding、用 OpenAI 嵌入 API 而非前端 flexsearch。目前選擇是「免費 tier 友善 + 完全 client-side RAG」。`[bl]`

---

## 6. 真實事件 / 已知坑（從 push debugging 學到）

### 6.1 vault `.git/config` PAT 缺 workflow scope
`[gt: reference_vault_pat_scopes.md memory]`

**症狀**：改 `.github/workflows/sync-to-quartz.yml` 後 commit + push 被 GitHub 拒，error 大意 `refusing to allow a personal access token to create or update workflow`.

**根因**：PAT 沒勾 `workflow` scope（fine-grained PAT 對應的是 `Workflows: R/W`）。

**處理**：
- 暫時做法：push 改 workflow 的 commit 換用另一個 PAT；或從 vault 把 workflow 改動先單獨 PR、用 web UI 直接 commit。
- 根治：把 vault 內嵌 PAT 換成有 `workflow` scope 的版本（建議用 NEW_PAT，已知有 workflow scope）。

### 6.2 sync workflow 半夜被 auto-backup 從 stub 改回完整版
`[gt: working-with-frncs / vault-publish-pipeline SKILL 紀錄]`

**症狀**：明明把 `sync-to-quartz.yml` 改成 stub，幾小時後又看到完整版 commit。

**根因**：obsidian-git 是「跨機 auto-sync」邏輯，不是「本機 → GitHub 單向」。
- 一台機改 stub → push
- 另一台機 boot 時 pull 到 stub
- 但若有「保留」的本機版本 + merge conflict → 可能 resolve 成完整版 → 再 push 回去

**處理**：改 workflow 一律從**單一機器 + 確認 pull 過 + commit message 標 `chore(workflow): ...`**，並馬上 check `gh run list` 跑通沒。

### 6.3 DASHBOARD_PAT 已設但對 site repo 無寫權（**現在進行式**）
`[gt: gh run view 26125899288，2026-05-19 21:18:09 log]`

**症狀**：sync-to-quartz.yml 第 6 步「Commit and push」失敗：
```
remote: Permission to VisTwin/metaarchetech.github.io.git denied to VisTwin.
fatal: unable to access ...: The requested URL returned error: 403
```
build 成功（rsync + npm ci + quartz build 都過），失敗在最後一步 push 到 v4。

**根因**：`DASHBOARD_PAT` secret 已設，但這顆 PAT 對 `metaarchetech.github.io` repo 只有 read，沒 write（或根本沒在該 repo 的 fine-grained 範圍內）。所以 checkout v4 成功（用 read 就行），push 失敗。

**處理**：
- 重新發 PAT，scope：`metaarchetech-vault` + `metaarchetech.github.io` 兩 repo 都 `Contents: R/W`、`Workflows: R/W`。
- `gh secret set DASHBOARD_PAT --repo metaarchetech/metaarchetech-vault --body <新PAT>`
- 觸發 `gh workflow run sync-to-quartz.yml --repo metaarchetech/metaarchetech-vault` 驗證。

> **這條取代 vault-publish-pipeline SKILL 裡「DASHBOARD_PAT 未設」的舊敘述。** SKILL 該同步更新。

### 6.4 CustomOgImages emitter 對 CJK+emoji 檔名爆掉
`[gt: quartz.config.ts L91 comment]`

**症狀**：vault 含 emoji + 中文檔名（如「🚀 寶舖計畫.md」）→ satori 渲染 og image 時 codepoint error → build fail。

**處理**：`Plugin.CustomOgImages()` 整個註解掉，犧牲 og image 自動產生（社交分享預覽會用預設）。

### 6.5 8-worktree 隔離造成「task 寫了但其他 task 看不到」
`[gt: 經驗事實 + working-with-frncs §13 強制 pre-flight 的由來]`

每個 Claude Code task 在 `.claude/worktrees/<zen-XXX>/` 跑 → 是獨立 worktree → 各自有自己的 working tree。**沒 commit 之前**，task A 改的檔在 task B 那邊不存在。

**處理**：
- 任何「給下游用的成果」必須 commit + push 完才算完成。
- 跨 task 接力：上游 task 結束前必 `git push`，下游 task 起手必 `git pull` + read。
- 主 vault `<VAULT_ROOT>` 與 worktrees 是同一個 `.git/`，但 working tree 是隔離的。

### 6.6 rsync `--delete` 把 site-only 檔掃掉（已修）
`[gt: sync-to-quartz.yml comment + vault-publish-pipeline SKILL §rsync exclude]`

**症狀**：rsync vault → site/content/ 加 `--delete` 會把 site 端維護但 vault 沒對應的檔（`graph.md`、`Images/`、`.gitkeep`）刪掉。

**處理**：在 exclude 清單加這三個（已在 §2.2）。

---

## 7. 各層耦合表

> 「動 X 要記得改 Y」備忘。

| 動作 | 連帶要改 |
|---|---|
| Vault 加新 root 資料夾 | 確認 sync-to-quartz.yml 的 exclude 清單不會誤殺；quartz.config.ts 的 `ignorePatterns` 視需要加（若該資料夾是 system 用） |
| Vault 改 `.gitignore` | obsidian-git 仍受其管轄；新 ignore 路徑也建議加 sync workflow exclude（兩道防線） |
| 升級 Quartz upstream | npm i + 跑本機 `npx quartz build` 驗 + 看 CustomOgImages 等被改的 plugin 有沒有 conflict |
| 換 NVIDIA green 配色 | quartz.config.ts 的 colors block + `_dna-tokens.scss` 的 token + 檢查 DnaHeader.tsx 的 inline `#76b900` 硬編寫 |
| 改 AI worker URL | quartz.layout.ts 的 `AiChat({ workerUrl })` + 重新 quartz build + push site repo |
| 加 system prompt mode | cloudflare-worker/vault-context.js 加 const + index.js 的 mode 分支 + AiChat 前端 UI |
| 加 custom domain | site repo root 加 `CNAME` 檔 + DNS A/CNAME + Pages 設定 verify + quartz.config.ts 的 `baseUrl` 換 |
| GitHub org rename（VisTwin → vistwin-tech） | vault remote URL、DASHBOARD_PAT scope（新 org）、sync-to-quartz.yml 第 2 步的 repository 路徑、site repo 名稱、quartz.config.ts 的 baseUrl、AiChat workerUrl（worker name 含 org 字串）、Plausible 站台名、Pages 重新 build |

> 第三方關注的：Plausible analytics、Groq API key 限額 / billing。`[?]` 沒查到實際帳號 / 額度。

---

## 8. 未確認 / 待 Frncs 補

`[?]` 為待補項：

1. **Plausible analytics 帳號 / 站台名**：quartz.config.ts 只寫 `provider: "plausible"`，沒設 `host` 或 `siteName`，Quartz 預設行為是 `script.outbound-links.tagged-events.js` 用 baseUrl 當 site name —— **未實測 dashboard 在哪、誰能看**。
2. **Cloudflare 帳號**：worker URL 是 `metaarteorg.workers.dev`（不是 `metaarchetech.workers.dev` 也不是 `vistwin.workers.dev`），代表 Cloudflare 帳號 username 是 `metaarteorg`。**這帳號 / billing 是誰的？** 跟 GitHub `metaarchetech` 帳號是否同人？
3. **Groq API key billing**：worker secret `GROQ_API_KEY` 是哪個 Groq 帳號發的、月用量限制多少。
4. **`update-dashboard.yml` 原本要做什麼**：commit `046027e` 之前的版本內容；目前只剩 stub，dashboard 沒在動。
5. **`pageTitleSuffix`、`locale: "en-US"`**：locale 雖寫 en-US 但 vault 內容大量中文，**未確認** Quartz 內部對 zh-TW 是否有更好支援（影響日期 format / RSS）。
6. **commit `046027e` 是否就是 sync workflow 原始版**：vault-publish-pipeline SKILL 提到此 commit，但我沒實際 checkout 該 commit 確認 yml 完全內容。
7. **`metaarchetech` GitHub org → `vistwin-tech` rename 時程**：Entity_Map 寫「本週內動手」（截止 2026-05-26）。**Rename 後**所有 §7 表的路徑都要批次改。
8. **OAuth2 vs `x-access-token` 內嵌 PAT 形式**：vault remote 用 `oauth2:<PAT>@` 形式，GitHub 也接受 `<user>:<PAT>@` 或 `x-access-token:<PAT>@`，**沒測哪個更穩**。

---

## 9. Related

- [[../../05 技能/vault-publish-pipeline/SKILL|vault-publish-pipeline]] — 操作 / 診斷 skill
- [[VisionBase_Setup_Runbook]] — 從零部署同樣系統到 VisionBase
- [[../../00 系統/Entity_Map|Entity_Map]] — 實體 / org / 主線雙軌邊界
- [[../../05 技能/working-with-frncs/SKILL|working-with-frncs]] — §13 pre-flight、§15 失敗 stop
