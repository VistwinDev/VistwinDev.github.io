---
type: principle
name: n8n-deploy
updated: 2026-07-01
---

# n8n 部署:一個共用 n8n(Docker),只共用編排

- **一個共用 n8n 實例(Docker)= 唯一的編排控制面**,全家族(manager Mac + dev Win)共用,
  所有 workflow 模組都在裡面(web-optimize-loop / sensor-loop / PM 自動化…)。
- **只共用「編排」,不共用「執行」**:重活在各機器本機的 Daemon / agent / GPU / vault,
  n8n 只 HTTP 下指令。正因 n8n 不做重活,才能是單一共用實例。
- **跑在 dev(Windows)這台**:build loop / Daemon / GPU / Claude CLI 都在這,
  n8n→Daemon = localhost 最順;Mac manager 走網路連同一個 n8n。
- 代價:跨機 Daemon 要對區網可達(非純 localhost);此機關機則 Mac 端流程也停。
- **走 Docker 不走 `npx`**(官方推薦、避開 Windows 原生模組坑、開機自啟 / env 乾淨)。
  本機現況(2026-07-01):有 winget + 虛擬化,但 Docker 尚未安裝。
- **時序**:n8n 不急著起——它編排的 Daemon 還沒建。先做 Daemon(執行層),再裝 Docker 起 n8n。

詳:`E_forge/n8n/README.md` §0。相關 [[01-pillars]] [[08-constraints]]。
