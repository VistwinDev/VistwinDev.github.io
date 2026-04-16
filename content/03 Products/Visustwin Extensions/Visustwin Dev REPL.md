---
tags: [visustwin, omniverse, extension, devtools, repl, claude]
created: 2026-04-14
ext_id: visustwin.dev.repl
version: 0.1.0
category: Dev Tools
---

# Visustwin Dev REPL

> Claude Code ↔ Kit 檔案式 Python REPL

監視 `_repl/cmd.py` 的檔案修改，在 Kit Python 環境內即時執行，結果寫回 `_repl/result.txt`。

## Workflow

```
Claude Code                         Omniverse Kit
    │                                    │
    │ 1. Write Python to cmd.py          │
    │ ─────────────────────────────▶     │
    │                                    │ 2. Detect mtime
    │                                    │ 3. exec(code)
    │ 5. Read result.txt                 │ 4. Capture output
    │ ◀─────────────────────────────     │    → result.txt
```

## IPC Files

| File | Writer | Reader |
|------|--------|--------|
| `_repl/cmd.py` | Claude Code | Kit |
| `_repl/result.txt` | Kit | Claude Code |

## Settings

| Path | Type | Default |
|------|------|---------|
| `/visustwin/repl/dir` | string | `""` (auto: 往上 6 層找 `_repl/`) |

## Execution

- 每 30 frames 輪詢 mtime（~0.5s）
- `exec(compile(code, ...), {"__name__": "__repl__"})`
- 完整 Kit Python context (`omni.usd`, `pxr`, `carb`)
- stdout/stderr 完整捕捉

## Dependencies

`omni.kit.uiapp` (optional)

---

← [[Visustwin Extensions MOC]]
