---
type: principle
name: mcp
updated: 2026-07-01
---

# MCP 框架(全 CLI / HTTP,零 GUI)

MCP = JSON-RPC over **stdio / HTTP(首選)/ WebSocket**(SSE 已棄用)。純 CLI 可調用。

**E_forge 的設計:自己開一個 MCP server 當控制脊椎。**
- 用 **TS `@modelcontextprotocol/sdk` + HTTP transport** 寫 E_forge MCP server,暴露工具:
  `recall_experience` · `read_rubric` · `read_status` · `dispatch_run` · `list_agents` ·
  `stream_agent` · `write_memory`。
- **浮動 ChatDock = Claude Code session**,用 `--mcp-config` 接 E_forge MCP server(+ n8n)。
- **worker = headless**,同樣 `--mcp-config` 帶同一套工具,各自 worktree。
- **n8n** 用其 REST API 包成 MCP 工具 → CLI 就能設計/優化 n8n 工作流。

CLI 機制速記:
- 接 server:`claude mcp add <name> -- <cmd>`(stdio)/ `--transport http <url>`;或寫 `.mcp.json`。
- 自寫 server:TS `@modelcontextprotocol/sdk` / Python `mcp`;`npx @modelcontextprotocol/inspector` 測。
- 把 Claude Code 自己當 server:`claude mcp serve`。

文件:code.claude.com/docs/en/mcp · /headless · /agent-sdk/overview。相關 [[07-autonomy-dispatch]]。
