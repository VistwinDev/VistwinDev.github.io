---
tags: [meta, claude, skills, changelog]
created: 2026-05-19
updated: 2026-05-20
---

# 📜 Claude Skills Changelog

> 手動維護。每次新增 / 修改 / 棄用 skill 時補一行。

## 2026-05-19 — Behavior layer hardening (Round 1 + Round 2 一鼓作氣)
- 新建 vault root CLAUDE.md (entry point)
- SKILL.md 加 §12 §13 §14 §15 §16 §17 §18
- 新建 _task-prompt-prefix.md
- 新建 01 專案/Physical_AI/README.md (主線 A)
- 寶舖 / ontology doc 加 2026-05-19 reframe annotation
- 全部對齊 canonical Entity_Map (2026-05-20) 「雙軌平行同級」框架

## 2026-05-20

- **new** `daily-weekly-journal` (audience: lab, status: active) — 每日/每週把真實工作落進既有 sprint 系統（不另開 `02 Daily/`）讓 Quartz 看到節奏 skill。同建 `02 產品/Visustwin/sprints/2026-W21/` + 週 README + 首篇 `2026-05-20` daily（節奏自 W18 後斷 3 週重啟），並刷 `Now.md`。沿用既有 `Daily Standup` / `Weekly Review` 模板，不建新模板。

- **new** `vault-publish-pipeline` (audience: lab, status: active) — vault → GitHub → Quartz → Pages 全鏈狀態查 / 手動觸發 / 斷點診斷 skill。建檔時 sync-to-quartz 段為 DISABLED stub（DASHBOARD_PAT 未設），改手動代跑。

## 2026-05-19

- **init** — 建立 skill 系統最小起點：`05 技能/`、`SKILL_TEMPLATE.md`、`_index.md`、`_changelog.md`。
- **new** `dev-state-overview` (audience: lab, status: active) — 跨機開發狀態總覽 skill。
- **infra** 建立 `06 機台/` + `_fleet-index.md` + `register-machine.ps1` / `heartbeat.ps1` 多機 heartbeat 機制。
- **new** `working-with-frncs` (audience: lab, status: active) — 與 Frncs 共事核心行為準則 meta-skill。
- **借 founder-os** SKILL_TEMPLATE 加 Goal-backward verification + Lessons section；建 `_learnings.md`、`_anthropic-plugins-map.md`、`00 系統/Workflows/complex-task-flow.md`。
