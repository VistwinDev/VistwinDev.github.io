---
title: VisionBase Publishing Stack — Setup Runbook
status: canonical
last_updated: 2026-05-20
audience: lab
keywords: visionbase, setup, runbook, quartz, fork, github pages, obsidian-git, cloudflare worker, fresh deploy
---

# VisionBase Publishing Stack — Setup Runbook

> 從零部署一套完整的 Obsidian → GitHub → Quartz → Pages publishing pipeline。
> 本檔列「動手做的順序」，並在尾端附「已知坑」清單預先避開常見地雷。

## 0. 命名約定（本文檔範例值，VisionBase 可改）

| 變數 | 範例 | 說明 |
|---|---|---|
| `<ORG>` | `visionbase` | GitHub org or user |
| `<VAULT_REPO>` | `visionbase-vault` | private repo for vault |
| `<SITE_REPO>` | `visionbase.github.io` | public Pages repo |
| `<SITE_URL>` | `https://visionbase.github.io/` | Pages URL |
| `<WORKER_NAME>` | `visionbase-ai` | Cloudflare Worker name |
| `<VAULT_PATH>` | `D:\VisionBase\vault\` | 本機 vault 路徑（依機器調） |

下面所有指令出現 `<X>` 換成你的實際值。

---

## Phase 0 — 前置

### 0.1 確認帳號 / 環境
- [ ] **GitHub 帳號**（個人 or org）有權建 repo + 設 Pages
- [ ] **Cloudflare 帳號**（可後補，phase 5）
- [ ] **Groq API 帳號**（取 API key，可後補）
- [ ] **本機環境**：
  - Node.js ≥ 22（`node -v` 驗）
  - npm ≥ 10.9.2
  - git
  - GitHub CLI `gh`（可選但 phase 1/2/4 會用）
  - Obsidian 桌面 app

### 0.2 規劃路徑
決定 vault 放在哪：`<VAULT_PATH>`。建議獨立分區（避免落在 `C:\Users\…` 系統碟），方便日後備份 / 跨機 junction。

---

## Phase 1 — 建 GitHub repos

### 1.1 建 vault repo（PRIVATE）
```powershell
gh repo create <ORG>/<VAULT_REPO> --private --description "VisionBase Obsidian vault"
```

或 web UI：New repository → owner=`<ORG>`、name=`<VAULT_REPO>`、Private、不要 README/.gitignore/license（之後本機 init 再 push）。

### 1.2 建 site repo（PUBLIC）
```powershell
gh repo create <ORG>/<SITE_REPO> --public --description "VisionBase published site (Quartz)"
```

> `<SITE_REPO>` 命名為 `<ORG>.github.io` 即可用 `https://<ORG>.github.io/` 做 root URL，不需要 path prefix。

### 1.3 發 PAT（fine-grained）
GitHub → Settings → Developer settings → Personal access tokens → Fine-grained → Generate new token：

| 項 | 設定 |
|---|---|
| Resource owner | `<ORG>`（個人帳號就選 user） |
| Expiration | 90 days（建 reminder） |
| Repository access | `<VAULT_REPO>` + `<SITE_REPO>` 兩個 |
| Repository permissions | **Contents: R/W**、**Workflows: R/W**、**Actions: R/W**、**Secrets: R/W**（後者讓 phase 2.3 能設 secret） |

**收好 PAT**：之後 vault remote URL 嵌它、`DASHBOARD_PAT` secret 用它。Phase 2.4 也會用。

> ⚠️ 常見地雷：若 PAT 只給 site repo Read，sync workflow 第 6 步 push 會失敗（403）。**Contents 一定要 R/W 兩 repo。**

### 1.4 啟用 Pages on site repo
```powershell
gh api repos/<ORG>/<SITE_REPO>/pages -X POST -f build_type=workflow
```
或 web UI：site repo → Settings → Pages → Build and deployment → Source: **GitHub Actions**。

> 注意：第一次設定時 branch 可能還沒有 `v4`，可以晚一點 phase 3 push 完再回來檢查 Pages 狀態。

---

## Phase 2 — 本機 vault + obsidian-git

### 2.1 建 vault 資料夾 + Obsidian
1. 開 Obsidian → Create new vault → 路徑 `<VAULT_PATH>`，名稱 `<ORG>`。
2. 第一次起手做最小設定：
   - Settings → Files & Links → 開 "Always update internal links"
   - Settings → Appearance → 選 dark / accent color
3. 建議的 vault 結構樣板（不含內容）：
   ```
   00 System/         (entity map / templates / 機器盤點)
   01 Projects/
   02 Products/
   03 Company/
   04 Knowledge/
   05 Claude Skills/  (lab 共用的 Claude skill 集合)
   06 Machines/
   99 Archive/
   CLAUDE.md          (VisionBase vault entry point)
   Now.md
   index.md
   ```

### 2.2 git init + 第一次 push
```powershell
cd <VAULT_PATH>
git init -b master
git config user.name "<ORG>"
git config user.email "<email>"

# 寫 .gitignore
@'
.obsidian/workspace.json
.obsidian/workspace-mobile.json
.obsidian/graph.json
.obsidian/cache
.trash/
.DS_Store
*.tmp

# Cowork / local tooling
.claude/
'@ | Set-Content -Encoding utf8 .gitignore

git add .
git commit -m "initial vault structure"

# 把 PAT 嵌進 remote URL（注意 oauth2: 前綴）
git remote add origin "https://oauth2:<PAT>@github.com/<ORG>/<VAULT_REPO>.git"
git push -u origin master
```

### 2.3 設 vault secret `DASHBOARD_PAT`
```powershell
$env:GH_TOKEN = "<PAT>"
gh secret set DASHBOARD_PAT --repo <ORG>/<VAULT_REPO> --body "<PAT>"
gh secret list --repo <ORG>/<VAULT_REPO>
```

> `DASHBOARD_PAT` 是 sync-to-quartz.yml 第 2 步 checkout site repo + 第 6 步 push 用的 token，**必須對 `<SITE_REPO>` 有 Contents:R/W**。

### 2.4 裝 Obsidian Git plugin
1. Obsidian → Settings → Community plugins → Turn on community plugins
2. Browse → 搜 "Git" by Vinzent → Install → Enable
3. Settings → Community plugins → Git → Options：
   ```
   Vault backup interval (minutes): 5
   Auto pull interval (minutes):    5
   Auto push interval (minutes):    5
   Commit message:                  vault: {{date}} {{hostname}}
   Pull updates on startup:         on
   Pull before push:                on
   Sync method:                     merge
   Disable push:                    off
   ```
4. Restart Obsidian → 確認狀態列有 git icon + 5 min 內看 GitHub 有新 commit。

### 2.5 驗證 phase 2
- [ ] `<ORG>/<VAULT_REPO>` 在 GitHub 看得到初始檔
- [ ] 隨便改個檔等 5 min → GitHub 多一筆 `vault: <date> <hostname>` commit
- [ ] `gh secret list --repo <ORG>/<VAULT_REPO>` 出現 `DASHBOARD_PAT`

---

## Phase 3 — Quartz site repo（fork + 客製化）

### 3.1 Fork Quartz upstream
有兩條路：

**A. Fork 上游再 rename**（推薦給「想拿 upstream 更新」的人）：
```powershell
gh repo fork jackyzha0/quartz --clone=false --org <ORG>
# Rename fork 為 <ORG>.github.io（GitHub 不支援 fork rename 為 user.github.io 自動 Pages，要手動）
gh api repos/<ORG>/quartz --method PATCH -f name=<SITE_REPO>
```

**B. 抄一份既有 Quartz 客製化版**（推薦給「已有 reference 部署、想直接 mirror」的人）：
```powershell
# 在任意工作區 clone reference repo
git clone --depth 1 --branch v4 <REFERENCE_QUARTZ_REPO_URL> visionbase-site
cd visionbase-site
# 換 remote 指向 VisionBase 的 site repo
git remote remove origin
git remote add origin "https://oauth2:<PAT>@github.com/<ORG>/<SITE_REPO>.git"
git push -u origin v4
```
> ⚠️ 抄既有 repo 會把 `.git` history 也帶過去。要乾淨 history：clone 後 `rm -rf .git && git init -b v4` 再 push。

### 3.2 客製化 `quartz.config.ts`
編輯 `<SITE_REPO>` 本機副本的 `quartz.config.ts`：

```ts
configuration: {
  pageTitle: "VisionBase",
  baseUrl: "<ORG>.github.io",
  analytics: { provider: "plausible" },          // 或 "google" / null
  ignorePatterns: ["private", "templates", ".obsidian"],
  defaultDateType: "modified",
  theme: {
    // 配色 / 字型按 VisionBase brand 改
    colors: {
      lightMode: { ... },                        // 你自己的 brand 配色
      darkMode:  { ... },
    },
    typography: { ... }
  }
}
```

### 3.3 客製化 `quartz.layout.ts`
```ts
afterBody: [
  Component.AiChat({
    workerUrl: "https://<WORKER_NAME>.<cf-subdomain>.workers.dev",
  }),
],
```

> phase 5 才會有真實 worker URL，**先留 placeholder**，phase 5 完再回頭改。

### 3.4 客製化元件（custom header / AiChat）
若 reference repo 內有客製 header 元件（如 `quartz/components/<CustomHeader>.tsx`）與對應 design tokens (`quartz/styles/_dna-tokens.scss` 之類)，內部多半會有硬編 brand 配色（hex code）—— 用 find+replace 換成 VisionBase brand color。

如果不要 reference repo 帶來的客製 header，可以：
- 換成標準 `Component.PageTitle()` —— 編輯 `quartz.layout.ts` 把客製 header component 換掉
- 或砍掉客製 header 元件整個檔

### 3.5 第一次 build 本機驗
```powershell
cd <visionbase-site 本機副本>
npm ci
npx quartz build
node scripts/build-search-index.mjs
# build 成功會有 ./public/ 出現
# 本機預覽：
node serve-local.cjs
# → http://localhost:8080
```

**任何 build error 在這裡解掉**，不要先 push 上去再炸 deploy。

### 3.6 Push site repo
```powershell
git add .
git commit -m "feat: VisionBase customization (theme, AI worker URL, brand)"
git push
```

### 3.7 驗證 phase 3
- [ ] `<ORG>/<SITE_REPO>` v4 branch 有 commit
- [ ] `gh run list --workflow="Deploy Quartz site to GitHub Pages" --repo <ORG>/<SITE_REPO>` 看 deploy.yml run 變 success
- [ ] `<SITE_URL>` 打開看到 Quartz 頁面（雖然 content/ 還空，至少有 index 框架）

---

## Phase 4 — Sync workflow（vault → site）

### 4.1 複製 sync-to-quartz.yml 到 vault repo
本機 `<VAULT_PATH>`：
```powershell
mkdir -p .github/workflows
```

新建 `.github/workflows/sync-to-quartz.yml`（若有 reference repo，可直接抄一份），確認 `repository:` 指向 VisionBase 的 site repo：

```yaml
- name: Checkout Quartz site
  uses: actions/checkout@v4
  with:
    repository: <ORG>/<SITE_REPO>           # ← 改這
    ref: v4
    token: ${{ secrets.DASHBOARD_PAT }}
    path: site
```

workflow 的完整邏輯：checkout vault → checkout site (用 `DASHBOARD_PAT`) → `rsync -av --delete vault/ site/content/` 帶 exclude 清單 → `setup-node 22` → `npm ci && npx quartz build` (build gate) → commit + push 到 site repo v4 branch。**build gate 用意**：rsync 完成後立刻 quartz build，build fail 整個 job fail，不會 push 壞 content 到 site repo。

### 4.2 確認 exclude 清單對得起 vault 結構
sync-to-quartz.yml 的 rsync exclude 清單建議：
```
.git .github .gitignore .obsidian .claude .trash .dashboard-fingerprint
private templates "00 System/Templates"
graph.md Images .gitkeep
```

前 9 個是 private / system 檔（不該到公開站）；後 3 個（`graph.md` / `Images` / `.gitkeep`）是 site repo 自維護的 site-only 檔（沒 exclude 會被 `--delete` 清掉）。

VisionBase vault 若有：
- 不想公開的資料夾 → 加進 exclude
- site repo content/ 自維護的 site-only 檔 → 加進 exclude

### 4.3 Commit + push
```powershell
cd <VAULT_PATH>
git add .github/
git commit -m "ci: add sync-to-quartz workflow"
git push
```

> **此 push 可能被 PAT scope 拒** —— 若你 phase 1.3 沒給 Workflows 權限，這步會 fail。
> 處理：補發 PAT、換掉 vault remote 內嵌、再 push。

### 4.4 第一次 workflow run
push 後自動跑 workflow：
```powershell
$env:GH_TOKEN = "<PAT>"
gh run list --workflow=sync-to-quartz.yml --repo <ORG>/<VAULT_REPO> --limit 3
gh run view <最新 run id> --repo <ORG>/<VAULT_REPO>
```
若失敗：
- 第 2 步 checkout site fail → `DASHBOARD_PAT` 對 site repo 沒 Contents:R/W
- 第 5 步 build fail → 通常是 vault content 含 Quartz 不接受的格式（CJK+emoji 檔名 + CustomOgImages → 已在 Architecture §6.4 disable 過）
- 第 6 步 push fail with 403 → `DASHBOARD_PAT` 只有 Read 沒 Write（**最常見地雷**）

### 4.5 手動觸發備援
```powershell
gh workflow run sync-to-quartz.yml --repo <ORG>/<VAULT_REPO>
```
等同手動跑一次同步。

### 4.6 驗證 phase 4
- [ ] vault 改個檔 push → sync-to-quartz.yml run success
- [ ] `<ORG>/<SITE_REPO>` v4 多一筆 `content: sync vault <timestamp>` commit
- [ ] deploy.yml 跟著跑 success
- [ ] `<SITE_URL>` 看得到 vault 內容

---

## Phase 5 — Cloudflare Worker（AI chat）

> 此 phase 可選 —— 不要 AI chat 就在 `quartz.layout.ts` 移除 `Component.AiChat({...})`，跳過此 phase。

### 5.1 取 Groq API key
- 註冊 https://console.groq.com/
- API Keys → Create new
- 收好 key

### 5.2 Wrangler 設定
```powershell
cd <visionbase-site 本機副本>/cloudflare-worker
npm i -g wrangler   # 全域 install
wrangler login      # 跳瀏覽器登入 Cloudflare
```

編輯 `wrangler.toml`：
```toml
name = "<WORKER_NAME>"
main = "index.js"
compatibility_date = "2024-01-01"
workers_dev = true
```

編輯 `vault-context.js`：把 BASE_VAULT_CONTEXT / RESEARCHER_MODE_CONTEXT / MANAGER_MODE_CONTEXT 三個 const 改成 VisionBase 自己的 system prompt（敘述 vault 結構、提醒 mode 行為）。

### 5.3 部署 worker
```powershell
npx wrangler deploy
npx wrangler secret put GROQ_API_KEY     # 貼上 phase 5.1 的 key
```

`wrangler deploy` 輸出會印 URL，類似 `https://<WORKER_NAME>.<cf-subdomain>.workers.dev`。

### 5.4 回 site repo 改 layout
編輯 `quartz.layout.ts`：
```ts
Component.AiChat({
  workerUrl: "https://<WORKER_NAME>.<cf-subdomain>.workers.dev",
}),
```

```powershell
git add quartz.layout.ts
git commit -m "feat: wire AiChat to <WORKER_NAME> worker"
git push
```

### 5.5 驗證 phase 5
- [ ] site 打開右下角浮動 FAB（聊天泡泡）
- [ ] 點開 panel 輸入「Hello」→ 有 stream 回應
- [ ] worker 端 `wrangler tail` 看請求進來 + 沒 error

---

## Phase 6 — Custom domain（可選）

只在你有自己的網域時做。

### 6.1 site repo 加 CNAME
```powershell
# 在 site repo content/ 加 CNAME（純文字一行 hostname，無 https://）
echo "kb.visionbase.com.tw" | Set-Content -Encoding utf8 content/CNAME
```
> 注意是放 `content/` 而非 repo root —— Quartz emitter 會把 `content/*` mirror 到 `public/`，這樣 deploy artifact 才會帶上 CNAME。`[bl 推測，待測]`

### 6.2 DNS 設定
**Apex domain**（`visionbase.com.tw`）：A record 指四個 GitHub Pages IP：
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**Subdomain**（`kb.visionbase.com.tw`）：CNAME → `<ORG>.github.io`

### 6.3 GitHub Pages 設定
site repo → Settings → Pages → Custom domain 填 `kb.visionbase.com.tw` → 等 DNS check → 勾 Enforce HTTPS。

### 6.4 改 `baseUrl`
```ts
// quartz.config.ts
baseUrl: "kb.visionbase.com.tw"
```
Push → rebuild → site live on custom domain.

---

## Phase 7 — Lab 移植 / 多人共用考量

> VisionBase 是 lab，可能不只一人寫。

### 7.1 多人同寫 vault
- obsidian-git plugin 預設 `syncMethod: merge` —— 兩人同 push 會自動 merge。
- 衝突解決：plugin UI 有 conflict resolver；也可命令列 `git mergetool`。
- **不建議**：所有人都用同一支 PAT remote。建議每人發自己的 fine-grained PAT。

### 7.2 Quartz site 維護者
- site repo 改 component / config 不像 vault 那樣每人都動 —— 設成「只有 1-2 個 maintainer」。
- 大改 push 前一定本機 `npx quartz build` 過。

### 7.3 跨機 sync vault
靠 obsidian-git auto pull/push 做跨機同步。**家機關機 + lab 機開機就會自動 sync**。但要小心：
- 兩台機同時改同一檔 → conflict
- VPN / 公司網路擋 GitHub → push 失敗 → 累積 commits → 重新連線一次 push 大量
- `.obsidian/workspace.json` 已 ignore（不同機 layout 不同），不會 conflict

---

## Phase 8 — End-to-end 驗證 checklist

跑完上面，全部過了才算 setup 完成：

- [ ] 本機 `<VAULT_PATH>` 改個 .md → 5 min 內 GitHub 有 `vault: ... <hostname>` commit
- [ ] vault repo push → sync-to-quartz.yml run success（檢 `gh run list`）
- [ ] site repo v4 有對應 `content: sync vault <timestamp>` commit
- [ ] deploy.yml run success
- [ ] `<SITE_URL>` 看得到該改動的內容
- [ ] DnaHeader / AiChat 渲染正確（若有客製化）
- [ ] AI chat 浮動 button → 對話成功（若 phase 5 做了）
- [ ] custom domain 解析 + HTTPS 綠鎖（若 phase 6 做了）

> 驗證原則參考 [[../../05 Claude Skills/vault-publish-pipeline/SKILL#Goal-backward verification]]：抓站點 URL 內容 grep 改動關鍵字，才算端到端。

---

## 已知坑

| 坑 | 預防 |
|---|---|
| PAT 缺 workflow scope → 改 `.github/workflows/*.yml` push 被拒 | phase 1.3 PAT 一定勾 Workflows R/W |
| `DASHBOARD_PAT` 對 site repo 只有 Read → sync 第 6 步 push 403 | phase 1.3 PAT 對 `<SITE_REPO>` 也要 Contents R/W |
| CustomOgImages emitter 遇 CJK+emoji 檔名 build fail | vault 若有 CJK+emoji 檔名，`quartz.config.ts` 把該 emitter 註解掉 |
| rsync `--delete` 把 site-only 檔（`graph.md` / `Images/` / `.gitkeep`）掃掉 | sync workflow exclude 清單加進這些檔案 |
| obsidian-git 跨機 auto-sync 導致改 workflow 被 merge 回舊版 | 改 workflow 限在單一機器、commit message 標 `chore(workflow)`、改完立刻看 `gh run list` |
| 多 worktree 隔離（若用 Claude Code）→ task 沒 commit 別 task 看不到 | 強制 pre-flight + 完成必 commit + push |

---

## 未確認 / 待補

`[?]`：

1. **VisionBase 帳號是 GitHub org 還是個人**：影響 `<ORG>` 填法、PAT 是 fine-grained 還是 classic、free org Actions 額度。
2. **VisionBase Cloudflare 帳號**：新發 or 共用既有帳號。
3. **Groq billing**：lab 出帳 or 個人帳。
4. **custom domain**：VisionBase 是否有 `visionbase.com.tw` 或子域、DNS 在哪、誰管。
5. **內容遷移**：VisionBase vault 起步是空白 or 從既有 vault 抄一部分。若抄，要先確認 lab vs 主公司邊界，避免帶不該公開的內容過來。
6. **brand 配色 / 字型**：phase 3.2 留 placeholder，等 VisionBase 真實 brand kit 來填。
