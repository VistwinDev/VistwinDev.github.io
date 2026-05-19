---
name: dev-state-overview
description: 跨機開發狀態總覽 — GitHub / 本機 git / listening ports / 車隊其他機器。當使用者問 dev state, overview, status, 現況, 哪台機, ahead behind, branch 在哪, fleet 狀態時用。
keywords: dev state, branch, 哪台機, 換機器, git status, fleet, ahead behind, port
audience: lab
status: active
created: 2026-05-19
lastUsed: 2026-05-19
confidential: false
---

# Dev State Overview

## When to use

- 「現在開發狀態如何？」
- 「我在哪個 branch、哪台機？」
- 「換機器後想知道目前進度 / 哪些 repo 還沒 push」
- 開工前想一眼看清 GitHub vs 本機 vs 車隊的差異

## Pre-flight

- 確認 `~/Visustwin/` 存在（家機應為 junction → `D:\Visustwin`）。
  PowerShell: `Test-Path ~/Visustwin`；不存在則提示使用者先建 junction，不要硬跑。
- `gh` 已安裝。未登入時 GitHub 區塊改標 `gh not authenticated`，其餘照常。

## Steps

1. **GitHub 狀態**：`gh repo list metaarchetech --limit 50`
   （取 repo 名、visibility、最近 push 時間）。
2. **本機 git**：對 `~/Visustwin/*` 每個含 `.git` 的資料夾跑：
   - `git status --porcelain`（判斷 dirty/clean）
   - `git log -1 --format='%h %s (%cr)'`
   - `git branch --show-current`
   - `git rev-list --count HEAD..@{u}` → 落後 upstream 幾個 commit
   - `git rev-list --count @{u}..HEAD` → 領先 upstream 幾個 commit
3. **Listening ports**：列出常用埠是否在聽（3000–3010、8765、8766）。
   `Get-NetTCPConnection -State Listen` 過濾這些埠。
4. **相關 process**：列 visustwin 相關的 python / node process
   （`Get-Process python,node` 後比對 cmdline / 路徑含 visustwin）。
5. **Vault 同步**：對 `D:\Visustwin\obsidian` 比對本地 HEAD 與 `origin/master` hash，
   標示 vault 是否落後 / 領先。
6. **車隊**：讀 `06 Machines/*.md` 的 frontmatter，列每台機器
   `role` + `last_check_in`。
7. **組成報告**，三段 markdown：
   - `## GitHub` — repo 清單 + 最近 push
   - `## 本機 (<hostname>)` — 每 repo：branch / dirty / ahead / behind / 最後 commit
   - `## Fleet` — 其他機器 last_check_in

## Edge cases

- **gh 未登入**：GitHub 區塊標 `⚠️ gh not authenticated — skipped`，不中斷其餘步驟。
- **repo dirty**：該列標 `🔴 dirty (<n> files)`；clean 標 `✅ clean`。
- **無 upstream**（`@{u}` 解析失敗）：ahead/behind 標 `—`，附註 `no upstream`。
- **其他機器 7+ 天沒 check-in**：在 Fleet 段標 `⚠️ stale (<n>d)`。
- **`~/Visustwin` 不存在**：停在 Pre-flight，提示建 junction，不臆測路徑。

## Related

- [[../_index|Claude Skills Index]]
- [[../../06 Machines/_fleet-index|Fleet Index]]
- [[../_changelog|Changelog]]
