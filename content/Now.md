# Now — 當前焦點

_最後更新: 2026-04-29 22:30_

## 本週焦點(Sprint [[02 Products/Visustwin/sprints/2026-W18|2026-W18]])

### 專案(客戶向)
- [[01 Projects/visionbase/README|visionbase]] 進駐 — 區網盤點完成、監控站搭建中

### 產品(自家向)
- [[01 Projects/visionbase/visionbase-monitor|visionbase-monitor]] Phase 1 收尾(視覺細節微調)
- [[02 Products/Visustwin/Plugins/ventilation/README|visustwin.ventilation]] extension 已推 GitHub mirror(commit `08e0b61`)
- vault 自身整補:Plugins 漂移修正 + scrum templates 建立

## 進行中
- visionbase-monitor 視覺細節微調(卡片 hover / SegmentedToggle / HUD 字體節奏)
- vault 結構整補(`01 Projects/visionbase/` 已建立 4 篇)

## 等待 / blocked
- **KUKA 控制器(KRC)接上 visionbase 區網** — 目前 `192.168.0.0/24` 沒看到真控制器,只有旁邊的 Windows 工作站
- **ACTi / Tapo 攝影機 RTSP 帳密** — vision 頁卡住等帳密
- **Jantek 4 台 Windows(`0.91-94`)用途** — 待 visionbase 端確認

## 近期要啟動
- visionbase-monitor `/vision` 頁(YOLO 攝影機,等 RTSP 帳密 → 否則先 mock)
- visionbase-monitor `/kuka` 頁 mock skeleton(三 panel:狀態 / 變數 / 命令日誌)
- 區網掃描歷史趨勢:寫進 Synology NAS 或本機 SQLite,做上下線時序圖
- visustwin-extensions 的 README 漂移修正(17 → 19 ext + 補 light.compass / ventilation)

## 今日 daily log
- [[02 Products/Visustwin/sprints/2026-W18/2026-04-29|2026-04-29]]
