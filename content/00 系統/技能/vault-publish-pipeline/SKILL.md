---
name: vault-publish-pipeline
description: vault → GitHub → Quartz → Pages 全鏈狀態查、手動觸發、驗證 deploy、斷點診斷。當 site index 沒更新、自動同步失靈、要驗證最新 vault 改動是否 live 時用。
keywords: publish, sync, quartz, pages, deploy, sync-to-quartz, DASHBOARD_PAT, site 沒更新, 同步失靈, rsync
audience: lab
status: active
created: 2026-05-20
lastUsed: 2026-05-20
confidential: false
revisionTrigger: sync workflow 改名 / repo 遷移到新 org / Quartz 大版升級 / DASHBOARD_PAT 設定方式改變
lastReview: 2026-05-20
---

# Vault Publish Pipeline

## When to use

- 「我剛改的東西上站了嗎？」要驗證最新 vault 改動是否 live。
- 「site 怎麼沒更新 / index 還是舊的」要找斷在哪一段。
- 自動同步失靈，要手動把 vault 推上 Quartz 站。
- 開工前想確認整條 publishing 鏈是通的還是某段卡住。

## Pipeline 全貌

```
[1] Obsidian vault (本機)
      D:\VisTwin\obsidian  (家機；~/VisTwin 為 junction → D:\VisTwin)
      └─ Obsidian Git plugin 自動 commit："vault backup: <timestamp>"
            │  push (remote URL 內嵌 github_pat)
            ▼
[2] VisTwin/metaarchetech-vault  (branch: master)
      └─ sync-to-quartz.yml          ◀── ⚠️ 目前是 DISABLED stub（見下）
            │  rsync vault/ → site/content/  (--delete + excludes)
            │  需要 secret: DASHBOARD_PAT（目前未設）
            ▼
[3] VisTwin/metaarchetech.github.io  (default branch: v4)
      └─ deploy.yml （健康，push v4 觸發）
            │  npm ci → npx quartz build → build-search-index.mjs
            │  → upload-pages-artifact → deploy-pages
            ▼
[4] GitHub Pages（has_pages: true）
```

**已知斷點：[2] 這段斷了。** `sync-to-quartz.yml` 與 `update-dashboard.yml`
兩支都在 2026-05-02 被改成 stub 停用，根因相同：repo 沒設 `DASHBOARD_PAT`
secret，`actions/checkout` 拿到空 token → `Input required and not supplied: token`。
原始 workflow 內容保存在 vault repo git commit `046027e`。
目前 [2] 由**手動 rsync + push** 代替（site repo 近期 commit 訊息
`content: sync vault → site (full mirror)`）。[3][4] 自動段健康，
最近成功 deploy 2026-05-19T17:34Z。

## Pre-flight

- 確認在 vault root：`D:\Visustwin\obsidian`（或 junction `~/Visustwin/obsidian`）。
  不在則停，不要臆測路徑。
- 確認 vault remote 是 `metaarchetech/metaarchetech-vault`：
  `git -C "D:\Visustwin\obsidian" remote -v`。
- `gh` 已登入；未登入則 GitHub 區塊標 `gh not authenticated`，本機段照跑。
- Site repo 為 `metaarchetech/metaarchetech.github.io`，default branch `v4`
  （從 `sync-to-quartz.yml` 的 checkout step 抓得）。

## Steps — 狀態查（全鏈）

1. **[1] 本機 vault**：
   - `git -C "D:\Visustwin\obsidian" status --porcelain`（dirty/clean）
   - `git -C "D:\Visustwin\obsidian" log -1 --format='%h %s (%cr)'`
   - 對 `origin/master`：`git rev-list --count origin/master..HEAD`（領先＝還沒 push）
2. **Obsidian Git 有沒有在跑**：看最後一筆 commit 時間是不是「vault backup:」
   且夠近；太舊代表 plugin 沒跑（家機 Obsidian 沒開／plugin 停）。
3. **[2] vault repo 最新 commit**：
   `gh api repos/metaarchetech/metaarchetech-vault/commits/master --jq '.commit.committer.date,.commit.message'`
4. **[2] sync workflow 狀態**：
   - `gh workflow list --repo metaarchetech/metaarchetech-vault`
     —— 名稱含 `(disabled)` 即仍停用。
   - `gh run list --workflow=sync-to-quartz.yml --repo metaarchetech/metaarchetech-vault --limit 3`
   - `gh secret list --repo metaarchetech/metaarchetech-vault`
     —— **沒有 `DASHBOARD_PAT` 就代表自動段不可能通**，必走手動。
5. **[3] site repo HEAD vs vault content**：
   - `gh api repos/metaarchetech/metaarchetech.github.io/commits/v4 --jq '.commit.committer.date,.commit.message'`
   - 比對時間：site 最新 `content: sync` commit 應晚於 vault 你要驗的那筆。
6. **[4] Pages deployment**：
   `gh api repos/metaarchetech/metaarchetech.github.io/deployments --jq '.[0] | {sha,environment,created_at}'`
   再 `gh run list --workflow=deploy.yml --repo metaarchetech/metaarchetech.github.io --limit 3`
   看 build 是否 success。

## Steps — 手動觸發（自動段斷掉時的正規做法）

> 目前 `DASHBOARD_PAT` 未設，自動段不會動，所以這就是現行主路徑。

1. 確認 vault 已 commit & push 到 `metaarchetech-vault` master。
2. 本機 clone / 更新 site repo（若尚無本機副本，clone v4 branch）。
3. rsync vault → `site/content/`，excludes 與保護見下節（**用強化版規則**，
   不要用 046027e 原版，原版會把 `.claude`、site-only 檔掃掉）。
4. 在 site 副本 `npm ci && npx quartz build` —— **build 失敗就停，不要 push
   壞的 content**。
5. `git add content/ && git commit -m "content: sync vault $(date -u +%Y-%m-%dT%H:%MZ)" && git push`
   到 v4 → 觸發 site `deploy.yml`。
6. 若日後 `DASHBOARD_PAT` 設好且 workflow 復原：改用
   `gh workflow run sync-to-quartz.yml --repo metaarchetech/metaarchetech-vault`。

## Steps — 驗證 deploy

1. 等 site `deploy.yml` run 變 success（Step 6 of 狀態查）。
2. 抓站點 index 內容，確認含本次關鍵字（用本次改動裡可辨識的字串）。
3. 若內容是舊的但 deploy success → 多半是 [2] 沒把改動帶進 `content/`
   （回去查 rsync 是否被 exclude 規則擋掉、或 site-only 檔覆蓋）。
4. 站點若有 cache → URL 加 `?v=<timestamp>` cache buster 再看一次。

## Steps — 斷點診斷（哪一段壞了）

| 症狀 | 斷在 | 查法 |
|---|---|---|
| vault 沒新 commit | [1] Obsidian Git plugin 沒跑 | 家機 Obsidian 是否開著／plugin 狀態 |
| commit 在本機沒上 GitHub | [1]→[2] push | `git rev-list --count origin/master..HEAD`；remote token 失效 |
| vault repo 有新 commit，site 沒動 | [2] sync 段 | workflow 仍 disabled／`DASHBOARD_PAT` 未設 → 走手動觸發 |
| 手動 rsync 後 site 缺檔 | [2] exclude 規則 | 對照下節 exclude 清單，確認沒誤殺 |
| site v4 有新 commit，Pages 沒更新 | [3]→[4] | `gh run list --workflow=deploy.yml ...` 看 build fail（npm ci / quartz build / search-index） |
| 全綠但 index 仍舊 | content 內容本身 stale | `index.md` 是否真有改；Quartz emitter 是否漏該頁 |

## rsync exclude / 保護清單（強化版）

vault → `site/content/` 用 `rsync -av --delete`，**必須**帶這些
`--exclude`（在 046027e 原版基礎上補強）：

- 原版已有：`.git` `.github` `.gitignore` `.obsidian` `.dashboard-fingerprint`
  `private` `templates` `00 系統/Templates`
- **新增（內嵌 git repo / 工具目錄）**：`.claude` `.trash`
- **新增（site-only，vault root 不存在，`--delete` 會誤殺）**：
  `graph.md` `Images` `.gitkeep`

> 已核實 vault root 無 `graph.md` / `Images/` / `.gitkeep`，三者僅存在於
> site `content/`（Quartz 端維護）；不 exclude 會被 `--delete` 清掉。

## Edge cases

- **`DASHBOARD_PAT` 未設**（現況）：自動段不可能通，直接走手動觸發，
  不要嘗試 `gh workflow run` 期待它會動。
- **workflow 名稱含 `(disabled)`**：仍是 stub，`gh workflow run` 只會 echo
  一行訊息，不執行同步。
- **site default branch 是 `v4` 不是 master**：所有 site repo 操作指定 `v4`。
- **vault remote URL 內嵌 token**：`git remote -v` 會印出 `github_pat_...`；
  輸出貼給人看時要遮，不要原樣回報。
- **build fail 仍 push**：禁止。手動段一定先 `npx quartz build` 過了才 commit。

## Goal-backward verification

> 標記完成前必跑。任一條沒驗證到 → 不算完成。

1. 重讀目標：使用者要驗的那筆 vault 改動，到底 live 了沒？
2. 順產出對回去：vault commit → vault repo → site `content/` → deploy run
   success → 站點 index 真的含該關鍵字。每一跳都有實際輸出佐證。
3. 能不能端到端 demo：抓站點 URL 內容給使用者看到關鍵字。
4. 換機 / 重跑會爆在哪：手動段依賴本機有 site repo 副本 + node；
   `DASHBOARD_PAT` 一天沒設，自動段一天不會自己好。
5. self-check 標 P0/P1/P2。

## Lessons（用過後補）

- 2026-05-20 — 建立。事實基底：vault repo workflow 檔 + git commit `046027e`
  原版、`gh secret list`（空）、site repo `deploy.yml`、Pages deployments、
  vault root `ls`。建檔時 [2] 段為手動代跑狀態。

## Related

- [[../_index|Claude Skills Index]]
- [[../_changelog|Changelog]]
- [[../dev-state-overview/SKILL|dev-state-overview]] — 跨機 git / vault 同步總覽
