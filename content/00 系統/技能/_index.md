---
title: "技能"
tags: [meta, claude, skills, moc]
created: 2026-05-19
updated: 2026-06-18
---

# 🧩 Claude Skills Index

> VisTwin skill 系統索引。每個 skill 一個資料夾，內含 `SKILL.md`。
> 安裝方式：`~/.claude/skills/<name>` junction → 指向本資料夾下對應 skill。

## 所有 Skills

```dataview
TABLE
  file.mtime AS "Last Edit",
  audience,
  status,
  description
FROM "00 系統/技能"
WHERE file.name = "SKILL"
SORT file.mtime DESC
```

## Related

- [[SKILL_TEMPLATE]] — 新 skill 模板
- [[_changelog]] — skill 變更紀錄
- [[99 封存/機台/_fleet-index|Fleet Index]] — 車隊機器狀態
