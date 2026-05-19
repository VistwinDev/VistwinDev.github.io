---
tags: [projects, dashboard, gantt]
created: 2026-04-11
updated: 2026-04-18
last-synced: 2026-04-18T08:00+08:00
---

# 📊 Projects Dashboard

> 這份檔案是所有進行中專案的總覽 + 甘特圖。
> 資料主要由排程 agent 從 Google Calendar 同步,使用者也可以手動編輯。
> 甘特圖用 Obsidian 原生 Mermaid `gantt`,不需要任何 plugin。

## 🎯 當前專案 (Active Projects)

| 專案 | 狀態 | 起始 | 預計結束 | 備註 |
|---|---|---|---|---|
| Workflow 重整 | #doing | 2026-04-11 | 2026-04-11 | vault 最小化 + 排程 agent |

## 📅 甘特圖 (Gantt)

> 下方 mermaid block 是 agent 會自動維護的區塊。使用者手動改也可以,agent 會以 `%% AUTO-SYNC %%` 註解為界,只動自動區。

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {
  'taskBkgColor': '#fad165',
  'taskBorderColor': '#c9a830',
  'activeTaskBkgColor': '#1e8449',
  'activeTaskBorderColor': '#145a32',
  'critBkgColor': '#c0392b',
  'critBorderColor': '#7b241c',
  'doneTaskBkgColor': '#7f8c8d',
  'doneTaskBorderColor': '#616a6b',
  'taskTextColor': '#fff',
  'taskTextDarkColor': '#fff',
  'taskTextOutsideColor': '#333',
  'todayLineColor': '#e74c3c'
}}}%%
gantt
    title MetaArche Projects Timeline
    dateFormat  YYYY-MM-DD
    axisFormat  %m/%d

    %% === 手動區:使用者自己加的里程碑 === %%
    section Workflow Reset
    Vault 重整 (Phase 1-2)   :done,    wf1, 2026-04-11, 1d
    排程 agent 上線 (Phase 3) :active,  wf2, 2026-04-11, 1d

    %% === AUTO-SYNC 區:agent 從 gcal 拉的事件會放這裡 === %%
    %% AUTO-SYNC START %%
    section Calendar Events (04-18)
    %% ⚠️ Google Calendar MCP 尚未連接於本次 session，無法取得今日事件 %%
    %% 上次成功同步: 2026-04-13 %%
    %% AUTO-SYNC END %%
```

## 📥 來自 Google Calendar 的事件 (Auto-synced)

> 這個區塊由 agent 每日晨間更新。格式是方便人讀的清單。

**最後同步:** 2026-04-18 — ⚠️ Google Calendar MCP 未於本次 session 連接，本次同步未取得事件 (vault-morning-sync)

### 📅 今日 (2026-04-18 週六)

- ⚠️ 無法取得行事曆事件 — 本次 agent 執行時無 Google Calendar MCP 工具可用，請確認 connector 已啟用

### 📆 本週剩餘 (04-18 ~ 04-19)

- ⚠️ 無法取得 — 同上

### 👥 共享行事曆提醒 (Francis)

- ⚠️ 無法取得 — 同上

## 🧭 使用說明

- **新增里程碑:** 直接編輯上面的 mermaid block 的「手動區」,用 Obsidian 預覽模式就能看到 gantt 渲染
- **狀態標記:** `done` = 完成, `active` = 進行中, `crit` = 關鍵路徑, (空) = 尚未開始
- **不要動 AUTO-SYNC 區塊**:那是 agent 的地盤,手動改會被下次同步覆蓋

## 🔗 相關

- [[01 Projects MOC]] — 進行中專案索引
- [[Workflow]] — 整體工作流說明
- [[Claude Memory]] — 使用者偏好與行事曆對應表

---

*初始化於 2026-04-11*
