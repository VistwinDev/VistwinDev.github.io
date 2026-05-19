---
tags: [meta, claude, skills, moc]
created: 2026-05-19
updated: 2026-05-19
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
FROM "05 Claude Skills"
WHERE file.name = "SKILL"
SORT file.mtime DESC
```

## Related

- [[SKILL_TEMPLATE]] — 新 skill 模板
- [[_changelog]] — skill 變更紀錄
- [[06 Machines/_fleet-index|Fleet Index]] — 車隊機器狀態
