---
tags: [meta, fleet, machines, moc]
created: 2026-05-19
updated: 2026-05-19
---

# 🖥 Fleet Index

> 車隊內所有機器（家機 / lab / 學校）。每台機器由 `heartbeat.ps1` 每天更新自己的 `<hostname>.md`。
> 跨機路徑對齊：每台機器都用 `~/Visustwin` junction 指向各自的 VisTwin 根目錄。

## 所有機器

```dataview
TABLE
  role,
  os,
  last_check_in AS "Last Check-in",
  file.mtime AS "MD Updated"
FROM "06 Machines"
WHERE machine = true
SORT last_check_in DESC
```

> ⚠️ `last_check_in` 超過 7 天的機器視為離線 / 待確認。

## Scripts

- `scripts/register-machine.ps1` — 一次性，新機器加入車隊時跑
- `scripts/heartbeat.ps1` — 重複性，每天更新本機狀態
- `scripts/run-on-startup.bat` — 放進 Windows 啟動資料夾

## Related

- [[05 技能/_index|Claude Skills Index]]
- [[05 技能/dev-state-overview/SKILL|dev-state-overview]]
