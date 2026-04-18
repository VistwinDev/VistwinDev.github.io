# visustwin.dev.repl — Extension 細節卡

> **Tier: T1** — 合併 → ConsoleModule（web 端改走 Kit WS Bridge 取代 file IPC；從 Impossible 重新分類為 Medium）

## 功能與 UI 結構

Claude ↔ Kit 檔案式 REPL。監聽 `_repl/cmd.py` 的 mtime 變化（每 30 幀輪詢），偵測到新指令後在 Kit Python context 執行，並將 stdout/stderr 輸出寫入 `_repl/result.txt`。這讓 Claude（外部）可以在 Kit 內部執行任意 Python 程式碼，存取完整的 `omni.*`、`carb.*`、`pxr.*` API。

## 程式檔案清單

| 檔案 | 職責 |
|---|---|
| `extension.py` | 完整實作（mtime polling + exec + UI 輸出） |

## 關鍵程式碼片段

```python
# extension.py — 核心 IPC 機制
POLL_EVERY_N_FRAMES = 30
_REPL = pathlib.Path(__file__).resolve().parents[6] / "_repl"
CMD_FILE    = _REPL / "cmd.py"
RESULT_FILE = _REPL / "result.txt"

def _on_update(self, event):
    self._frame_count += 1
    if self._frame_count % POLL_EVERY_N_FRAMES != 0:
        return
    try:
        mtime = CMD_FILE.stat().st_mtime
        if mtime != self._last_mtime:
            self._last_mtime = mtime
            self._execute_cmd()
    except FileNotFoundError:
        pass

def _execute_cmd(self):
    code = CMD_FILE.read_text(encoding="utf-8")
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf), contextlib.redirect_stderr(buf):
        exec(compile(code, str(CMD_FILE), "exec"), {"__name__": "__repl__"})
    RESULT_FILE.write_text(buf.getvalue())
```

## Kit 依賴逐項

| 依賴 | 用途 | Web 可替換？ |
|---|---|---|
| `omni.kit.app.get_update_event_stream()` | 每幀回調（輪詢 mtime） | ❌ Kit frame loop |
| Kit Python context（全域 `omni.*`） | exec 內可用 omni | ❌ Kit-only |
| 檔案系統 IPC（`_repl/` 資料夾） | Claude 與 Kit 通訊 | ⚠️ 可改 HTTP/WebSocket |
| `omni.ui` | 狀態顯示（OK/ERROR/EXEC） | ✅ React |

## Web 替代方案

**此 extension 是開發工具，不建議 port 到 production web app。**

若要在 web 端保留類似能力：
- **WebSocket RPC endpoint**：Kit 端開一個 WS server，接收 `{ code: "..." }` 訊息，在 Kit context 執行後回傳結果
- 等效功能：`visustwin.osc.controller` + WebController 的 BridgeSocket 模式
- 或改為 Claude Code CLI 直接操作 file IPC（目前做法），不需要 web 化

**結論**：此 extension 在 web 化後應保留為 **Kit-side dev tool**，不進入 production web app scope。

## 整併候選

- 無 production 整併候選
- Kit 端可與 `osc.controller` 共用「接收外部指令執行 Kit 操作」的框架

## 難度 / 工作量

| 項目 | 評估 |
|---|---|
| **Web 化難度** | **Impossible**（依賴 Kit Python exec context） |
| **工作量** | N/A（不建議 port） |
| **建議** | 保留在 Kit 端，作為開發基礎建設 |
| **替代路徑** | 若需 web 端遠端執行：加 WebSocket RPC server（M 工作量） |

> **決策點**：是否要把 `_repl` IPC 升級為 WebSocket RPC，讓 Claude API 可以從 cloud agent 直接操作 Kit？

---
← [[../Omniverse Web化 評估|主評估文件]]
