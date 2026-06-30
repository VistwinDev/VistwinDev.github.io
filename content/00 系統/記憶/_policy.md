---
title: 記憶架構與儲存政策(含雙 app 區分)
type: memory-policy
app: shared
updated: 2026-06-30
tags: [system, memory, policy]
---

# 記憶架構與儲存政策

## 區分規則(2026-07-01 起,從平台分→角色分)
- 三個角色區:**manager**(經理 / macOS)、**work**(工作 / Windows,原 `dev-windows`)、**research**(研究 / 待定)。框架正典見 [[README|超級 App]]。
- **共用但區分**:同一個 vault,靠「命名空間資料夾 + frontmatter `app:` 欄」分。
- 每個記憶檔 frontmatter **必含** `app: manager | work | research | shared`。
- GitHub:manager = `vistwin-app` / `vistwin-automation`;work / research 用它們自己的 repos —— **別混**。

## 衝突預防(分區寫入 — 強制)
> Obsidian Git 每 5 分自動 commit / pull / push,且兩個 app 可能同時動 vault → 寫同一塊會撞。
- **一檔一主題,寫進獨立檔**;不去共編別人正在動的忙碌檔(如 `Now.md`、`_控管/*`)。
- **各 app 只寫自己的命名空間**:manager / work / research 互不碰對方資料夾 → 永不互撞。`共用/` 是唯一共寫區,改前留意。
- **讓自動 sync 收尾**:大批寫入前先確認沒有別處未提交的變更;寫完**交給 Obsidian Git 自動 commit,agent 不要自己在 vault 跑 git**(免得跟外掛打架)。
- 寧可**多檔小批**,不要單檔大改(縮小衝突面)。

## 資料夾(命名空間)
```
00 系統/記憶/
  _index.md  _policy.md
  共用/          ← app: shared(原則 / 設計 / 架構,三區都吃)
  manager/    決策/   情節/
  work/       決策/   情節/   ← 原 dev-windows
  research/   決策/   情節/
```
> 框架地圖在隔壁 `00 系統/超級 App/`(README + Manager/Work/Research);此處是累積的記憶日記。

## 三層 × 大小上限(每個 namespace 各自算)
| 層 | 位置 | 角色 | 上限 |
|---|---|---|---|
| 核心 | `_index.md` | 現在為真 + 指針,開場載入 | ≤ 8 KB |
| 語意 | `*/決策/*.md` | 蒸餾後的決策 / 原則 | 每檔 ≤ 12 KB · 每 app ≤ 600 KB |
| 情節 | `*/情節/*.md` | 討論摘要 / 逐字稿 | 每檔 ≤ 1 MB · 每 app ≤ 30 MB |

## 蒸餾規則(經驗如何累積)
1. 重要 session 結束 → 寫 `<app>/情節/<日期>_<主題>.md`。
2. 從情節萃取決策 → `<app>/決策/`(或跨 app → `共用/`);先比對同主題,**合併不新增**。
3. 更新 `_index.md` 現況,刪過時。情節超上限 → 最舊封存到 `99 封存/`。

## 捕獲來源(誠實:覆蓋率 = 捕獲率)
- ✅ Claude Code session 逐字稿(本機磁碟,可自動 ingest)
- ⚠ claude.ai / 手機 / 其他:靠手動貼入或匯出

## agent 用法
開場載入 `_index`(核心)+ 對應 app 命名空間;需要細節再檢索 `決策/`、`情節/`。
對應 bridge `/memory?app=` 端點 + 駕駛艙「記憶」模組(待建)。
