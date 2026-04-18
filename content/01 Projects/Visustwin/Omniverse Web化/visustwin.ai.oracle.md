# visustwin.ai.oracle — Extension 細節卡

## 功能與 UI 結構

AI 建築顧問。使用 Anthropic Claude Haiku 4.5（或 Ollama 本地模型）搭配 Tool Use，以自然語言回答 BIM 品質、碳足跡、EEWH 認證等問題。UI 是一個 Siri 風格動態球（ai_orb.py）+ 聊天對話欄（ui_window.py）。Tool registry 把其他 12 個插件包裝成 LLM 可呼叫的工具。

## 程式檔案清單

| 檔案 | 職責 |
|---|---|
| `extension.py` | IExt lifecycle + Dashboard 協議 |
| `ui_window.py` | OracleWindow（omni.ui chat interface） |
| `ai_orb.py` | 動態球動畫（omni.ui canvas） |
| `chat_engine.py` | 對話管理、stream 解析 |
| `llm_provider.py` | Anthropic / Ollama provider 抽象 |
| `tool_registry.py` | 40+ tool 定義 + executor |

## 關鍵程式碼片段

```python
# tool_registry.py — 典型 tool executor（呼叫其他 extension _INSTANCE）
def _find_ext_instance(ext_name: str):
    for suffix in (".extension", ""):
        mod = sys.modules.get(ext_name + suffix)
        if mod is not None:
            inst = mod.__dict__.get("_INSTANCE")
            if inst is not None:
                return inst
    return None

def tool_scan_bim_stage(**_) -> Dict[str, Any]:
    from visustwin.bim.inspector.scanner import scan_stage
    from visustwin.bim.inspector.collision import detect_collisions
    stage = omni.usd.get_context().get_stage()
    scan = scan_stage(stage)
    collisions = detect_collisions(scan)
    return {"total_prims": scan.total, "pass": scan.green, ...}
```

```python
# extension.py — Dashboard 協議
class OracleExtension(omni.ext.IExt):
    def on_startup(self, ext_id: str):
        if not is_anthropic_available():
            install_anthropic_sdk()   # omni.kit.pipapi auto-install
        self._ui = OracleWindow(needs_restart=needs_restart)
        self._menu_entry = omni.kit.ui.get_editor_menu().add_item(
            "Window/Visustwin AI Oracle", self._on_menu_click, toggle=True)
```

## Kit 依賴逐項

| 依賴 | 用途 | Web 可替換？ |
|---|---|---|
| `omni.ext.IExt` | Extension lifecycle | ✅ React component |
| `omni.kit.uiapp` / `omni.ui` | Chat UI window | ✅ React |
| `omni.kit.pipapi` | Auto-install anthropic SDK | ✅ npm install |
| `omni.usd.get_context().get_stage()` | Tool 呼叫需讀 USD | ⚠️ 需 REST API |
| `carb.settings` | API key / model 設定 | ✅ localStorage / env var |
| `sys.modules[ext_name]._INSTANCE` | 跨 ext 工具呼叫 | ⚠️ 需 REST endpoint |
| `omni.kit.ui.get_editor_menu()` | 選單項目 | ✅ React nav |

## Web 替代方案

- **Chat UI**: React + Framer Motion（已有 DNA 動畫元件）
- **LLM provider**: 直接用 Anthropic SDK（browser/Node），已有 `@anthropic-ai/sdk`
- **Tool calls**: 每個工具改為 REST/WebSocket call → Kit 端或 Python microservice
- **AI Orb 動畫**: Framer Motion `useAnimation` + CSS radial gradient
- **設定管理**: localStorage 或 Next.js env vars

## 整併候選

- 與 **visustwin.bim.inspector**、**visustwin.esg.tracker** 高度耦合（直接呼叫其掃描函式）
- Web 化後 oracle 的工具呼叫全部變成 API calls，可以整合到任何 feature module
- 建議獨立成 `AIOraclePanel` component，放在 layout 右側 drawer

## 難度 / 工作量

| 項目 | 評估 |
|---|---|
| **Web 化難度** | **Medium** |
| **工作量** | **M** |
| **預估 LoC** | ~1200（React UI + Claude API hook + tool dispatcher） |
| **主要風險** | tool_registry 的 40+ 工具需逐一改為 REST calls |
| **快速路徑** | 先只移植 Chat UI，tool executor 透過 WebSocket 轉送給 Kit 執行 |

---
← [[../Omniverse Web化 評估|主評估文件]]
