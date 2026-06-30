---
title: VisTwin 超級 App — 總體架構
type: framework
app: shared
created: 2026-07-01
updated: 2026-07-01
tags: [system, 超級app, framework, 架構]
---

# VisTwin 超級 App — 總體架構

> 框架正典。三區(Manager / Work / Research)共用同一套骨幹、治理、真相;各自實例化成一台機器上的超級 app。**新節點(如 Work-win)讀這份就能順著框架同步。**
> 這裡是「地圖/規格」(人寫、穩定);累積的決策與情節在 [[_index|記憶]](日記、會長大)。兩者互連、共用命名。

## 這是什麼

一套**自我開發型 AI 超級 app 框架**:把 **n8n(編排)+ Claude agent(大腦)+ vault(真相)** 收進一個原生殼。每台機器跑一個實例,**每台都自帶 Claude Code CLI** —— 所以每個節點都是「能自己改自己」的 app。

## 為什麼是「角色」不是「平台」

以前分 `manager-mac` / `dev-windows`(用平台分)。但每個節點都有 CLI = 一個完整 dev agent,**平台不再是區分點,角色才是**。所以正名成三個**角色區**:

| 區 | 角色 | 平台(目前) | GitHub | 記憶命名空間 | 框架檔 |
|---|---|---|---|---|---|
| **Manager** | 經理型 — 專案 / 核准 / 監控 / 對話;管 lab + 公司營運 | macOS(這台) | `VistwinDev/vistwin-app` · `vistwin-automation` | `記憶/manager/` | [[Manager]] |
| **Work** | 工作型 — 開發 / 執行;原 `dev` | Windows | (它自己的 repos,待補) | `記憶/work/` | [[Work]] |
| **Research** | 研究型 — 文獻 / 實驗 / 主線 A·B 研究 | 待定 | (待補) | `記憶/research/` | [[Research]] |

## 共用骨幹(每區都跑這套)

| 層 | 元件 | 角色 |
|---|---|---|
| **引擎** | Claude Code CLI(`claude -p`,經 bridge) | 大腦 + 手(Bash / Edit / Write / MCP)= 完整 dev agent |
| **編排** | n8n(Docker) | 排程 / webhook / 表單 / 流程圖 |
| **真相** | vault(markdown-on-git) | 唯一 source of truth;零鎖定、易 clone |
| **殼** | cockpit(模組註冊表驅動) | 控制 + 審閱介面;加減模組免重編 |
| **橋** | bridge(本機服務,跑 CLI + 資料/寫入/dev 端點) | 把 app ↔ CLI ↔ vault ↔ n8n 接起來 |

## 治理(三區共用)

- **角色分工**:人 = 導演(意圖 + 判真假 + 拍板)· agent = 手 · vault = 真相 · app = 控制 + 審閱。
- **提案 → 核准 → 套用**:批次改動走此閘;人手即時編輯走「小確認」;git(自動 commit)當還原網。
- **風險分層**(按「能不能還原」):讀(免確認)→ 可逆操作(小確認)→ 結構編輯(快照 → 改 → 驗 → rollback)→ 破壞(先備份再做)。
- **寫 = 確定性編輯**:只動 frontmatter、不碰內文;改名只改 `title`、不動檔名(免斷 `[[連結]]`)。
- **審與信才是真產品**:寫成本歸零後,review / 核准 / ground-truth 是命門 —— 別讓 vault 爛成「看起來很對的胡說八道」。詳見 [[原則]]。

## 同步模型(Work / Research 如何接進來)

**vault(markdown-on-git)= 整合層。** 所有節點共用同一個 vault,靠「命名空間 + frontmatter `app:`」分區,永不互撞:

- **分區寫入(強制)**:每個節點**只寫自己的命名空間**(`記憶/<zone>/` + `超級 App/<Zone>.md`);`共用/` 是唯一共寫區,改前留意。Manager 不碰 `work/`,反之亦然。
- **讓自動 sync 收尾**:Obsidian Git 每 ~5 分自動 commit/pull/push;**agent 不在 vault 跑 git**(免跟外掛打架);大批寫入前先確認沒有別處未提交變更;寧可多檔小批。
- **新節點上線步驟**:① clone vault → ② 讀本 README(框架)+ [[原則]](治理)→ ③ 認領自己的命名空間(`記憶/<zone>/`、`超級 App/<Zone>.md`)→ ④ 照角色架起自己的 bridge + n8n + cockpit 實例 → ⑤ 共用骨幹照搬、角色差異寫進自己區。

## 複製化(對外可賣)

整套架構**與客戶無關**:bridge + n8n + vault + cockpit。markdown-on-git = 零鎖定。賣的是「駕駛艙框架 + 模組庫 + 治理」,客戶自帶 AI 引擎(走 **Claude API / Teams / Enterprise**,不是個人訂閱 headless)。per-客戶 = 實例化(套 schema + 做 workflow + 建模組 + auth)。詳見 [[複製化路線]]。

## 區內檔案

- [[Manager]] — 經理區現況(完整總結)
- [[Work]] — 工作區(待 Work 端填)
- [[Research]] — 研究區(待開)
- [[_index|記憶索引]] · [[_policy|記憶政策]] · [[原則|共用治理原則]] · [[複製化路線]]
- [[Entity_Map]] — 實體邊界正典
