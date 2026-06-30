---
type: principle
name: pillars
updated: 2026-06-30
---

# 四支柱

| 層 | 角色 | 不做什麼 |
|---|---|---|
| **Windows** | 基質/宿主(本機 Omniverse/sensor/GPU/edge/檔案) | 不放邏輯 |
| **n8n** | 強制迴圈 + 排程 + 推送 + 高風險 gate | 不放 agent 思考 |
| **Claude** | 大腦:① loop 內 Designer/Critic ② 檢索/對話 agent | 不存狀態 |
| **vault** | 經驗/準則/狀況的記憶 | 不是文件堆,是帶結果標籤的決策史 |

邏輯只在核心 **Daemon**(Node/TS 常駐)。Daemon 掛了重啟就從 vault 接回最佳狀態(記憶體無狀態)。
唯一對外網路 = 呼叫 Claude;其餘全 localhost。
