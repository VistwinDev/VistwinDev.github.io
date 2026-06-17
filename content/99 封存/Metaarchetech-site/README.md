---
repo: metaarchetech.github.io
github_url: https://github.com/metaarchetech/metaarchetech.github.io
branch: feature/dna-port
latest_commit: aec5cf4
latest_commit_msg: "fix: correct explorer selector — top-level folders now 0.9rem/600"
latest_commit_date: 2026-04-18
status: doing
device_target: Web responsive（桌機 + 手機）
stack: Quartz v4 · TypeScript · SCSS · Obsidian Markdown
open_prs: [3]
updated: 2026-04-18
---

# metaarchetech-site

VisTwin 公開知識站，基於 Quartz v4 架設，部署於 GitHub Pages。Vault 內容（Obsidian Markdown）直接發布為可搜尋的靜態網站，支援 Graph View、全文搜尋（BM25）、CJK 中文分詞。

方向從「HUD 知識庫」轉往「現代化 full-bleed + glass drawer」，保留 Graph View（724KB bundle 可接受）。

## 最新進度

`feature/dna-port`（進行中，2026-04-18）：

- `aec5cf4` — fix: correct explorer selector（當日最新）
- `8ea7ba0` — feat: stronger typography + sidebar hierarchy
- `44fb4af` — feat: drawer toggle + glass transparency + interior hierarchy
- `16c3ed4` — fix: CJK tokenizer — BM25 now matches Chinese characters

`v4`（main branch）最新：`f03f1fd` — fix: strip stray leading --- breaking Quartz frontmatter parse（2026-04-16）

**PR #3 open**：[feat: DNA design system port + graph bundle 724KB → 124KB](https://github.com/metaarchetech/metaarchetech.github.io/pull/3)

## 已知 TODO

- 正確 lazy-load pixi.js（把 postscript.js 再降下來）
- PR #3 merge（等 full-bleed + glass drawer 功能穩定）
- Vercel / GitHub Pages deploy 流程確認

## 關鍵決策

- **Graph View 保留**：接受 724KB bundle（原本不卡，卡是 Chrome extension 問題）
- **方向調整**：從「HUD 知識庫」→「現代化 full-bleed + glass drawer」
- **PR #3 merge 時機**：等 full-bleed + glass drawer 穩定後

## 連結

- GitHub：[VisTwin/metaarchetech.github.io](https://github.com/metaarchetech/metaarchetech.github.io)
- PR #3：[feat: DNA design system port](https://github.com/metaarchetech/metaarchetech.github.io/pull/3)
- Dev：`http://localhost:8080`（`npx quartz build --serve`）
- 公開站：`https://metaarchetech.github.io`

## 返回

- [[02 技術/VisTwin/README|VisTwin]]
