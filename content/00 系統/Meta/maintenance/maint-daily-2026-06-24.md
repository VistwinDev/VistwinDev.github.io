---
title: 維護提案 daily 2026-06-24
type: maintenance-proposal
created: 2026-06-24
status: consumed
tags: [system, meta, maintenance-proposal, daily]
---

# 🔍 三庫維護提案 — daily 2026-06-24

## daily 日誌 (`daily-journal`)

讀完了。今天的 `2026-06-25.md` 是 01:39 建的「回補 6/22–6/24」篇,但之後到 03:45 這場維護 session 本身又產生了實際變動,daily 沒收進去。以下是提案(只提案、不寫檔):

## 今日 daily 補錄提案

- **新增「決策」一條:n8n / 自動化堆疊 ROI 定調**。今天 03:33 新建 `98 資料/Strategy/2026-06-25_n8n-stack-ROI.md`(與 Claude 的策略討論),結論已成形:**n8n 當薄殼編排 + Claude 當大腦**,且標了 `todo: 做成 VISION BASE 簡報 / P2 / owner:Francis`。這是今天最實質的產出,daily「完成項/決策」完全沒提 → 應補一條並連結該檔。

- **「在做項」的 daily/weekly 自動化要改寫**:daily 現在寫「cron 迄今未派出 = 節奏斷根因」,但今天的 commit 顯示維護鏈其實**有在手動跑**(`maint(daily): inbox-triage` / `daily-journal` / `publish-quick` 三段都跑了)。現況不是「全沒動」,而是「**手動補跑 OK、cron 自動派出仍缺**」——建議把這條的狀態與措辭校準。

- **補一條 inbox-triage 結果**:今天對 10 個檔(solar.report / sunlight.studio README、Web 化系列 decisions、Omniverse 評估、Augmented ML Agent 等)批次加了標籤/旗標。屬今日 vault 維護動作,daily 未記 → 可一句帶過「inbox-triage 批次 10 檔上標」。

- **填掉占位欄**:`心情 /10`、`能量 /10`、`一句話:(等使用者填)` 仍是空殼 → 這三格只能你本人填,提醒今天補上。

- **「明日要做」三項建議標主責/期限**:現在是裸 checkbox。尤其「為兩個舊 blocker 重新標期」本身就是明日第一項,但 daily 的 blocker 區仍只描述、未實際標期 → 建議今天就把 DASHBOARD_PAT、org rename **當場降級或標期**,而非再順延到明天。

- **(可選)blocker 區可加一條今天浮現的待驗**:n8n-stack-ROI 檔的 `publish: false`,正好對到 daily 既有的「publish-quick 不看 `publish:` 旗標、只靠 blocklist」隱憂——這份財務/策略檔若不在 exclude 清單內,仍可能被 rsync 帶出。可在 blocker「ExplicitPublish 待確認」那條補一個具體受影響案例。

要不要我把以上挑幾條,實際寫進今天的 daily?(目前為止只做了唯讀提案)


## Inbox 分類 (`inbox-triage`)

讀完了。`00 系統/Inbox/` 實質只有**一篇**:`維護提案-daily-2026-06-24.md`(另一個是空 `.gitkeep`)。以下是這篇的歸檔 + frontmatter 提案(只提案、不寫檔):

## Inbox 歸檔提案(2026-06-25)

- **本質判斷:這不是隨手記,是「昨天三庫維護的產出物」誤丟 Inbox**。Inbox 只該放「外部進來、未處理的零散筆記」;維護報告佔位會讓 Inbox 永遠清不空(也正是健檢「Inbox 0 篇待處理」與現實矛盾的根因)。處置方向是**歸檔**,不是分類成新主題。

- **歸到 `00 系統/Meta/maintenance/`(需新建)**,與既有 `Meta/health/` 同層,讓「健檢報告 + 維護提案」兩類自動產出物集中、可批次 glob。不想新建層的退路:直接放 `00 系統/Meta/`。

- **檔名對齊 health 慣例**:health 用 `health-2026-06-24`,這篇建議改 `maint-daily-2026-06-24`,日後好掃描。

- **補日期與標籤(目前只有 `title`+`type`,無法被索引)**:
  - `created: 2026-06-24`
  - `tags: [system, meta, maintenance-proposal, daily]`
  - `type: maintenance-proposal` **保留**(這欄選得好,可定為此類產出的標準 type)

- **加 `status: consumed`(或 `archived`)** —— 這篇第 12–28 行的提案幾乎都已落進今天的 `2026-06-25.md`,內容已被消化;且它寫「今天 daily 還沒建」但其實已建好,**內容已過期**。不標狀態日後會被誤當待辦再跑一次。

- **流程層根因修補:改規則,維護提案預設寫 `Meta/maintenance/`、別再寫進 Inbox**。不改規則,下一輪維護又會在 Inbox 生一篇,Inbox 職責永遠不乾淨。

- **搬檔前留意第 90 行的 `localhost:5678` 核准表單連結**:這篇若移出/改名,該 n8n form webhook 會變死連結。搬之前先確認此提案是否已透過該表單核准結案;結案就移除連結或標註已失效。

- **需求釐清:扣掉這篇,Inbox 沒有任何真正的隨手記**。若你近期有桌面/手機隨手記,可能落在 vault 外(Drive / Gmail 草稿 / Apple Notes)。要的話下一輪我可去 Drive/Gmail 撈,再提案歸檔點。

最關鍵一條:**移出 Inbox → 改名對齊 health → 補 `status: consumed`**,三動作一次到位,Inbox 才真正歸零。要我實際執行嗎?(目前依指示僅提案,未動任何檔。)


## 發布快檢 (`publish-quick`)

掃完了。確認結果如下(只提案、不寫檔):

## 發布健康快檢(2026-06-25)

- **誤公開風險 — 零。全庫唯一 `publish: true` 是 `index.md`,且乾淨**:內文只有標題+「allowlist 發佈、預設不公開」說明,連 Vault Home 是純文字「私有,不公開」**無任何 `[[連結]]`**,不會把內部頁帶上線。allowlist 模型成立,維持現狀。

- **客戶/私密區零誤標**:全庫只有 3 個 `publish:` 旗標 —— `index.md: true`、`98 資料/Strategy/2026-06-25_n8n-stack-ROI.md: false`、`02 技術/Visustwin/INTEGRATION_PLAN.md: false`。`01 專案/`(寶舖 showcase / welltek)、`03 公司/`(登記/商標/財務/合約)**全區沒有任何 `publish:` 旗標**,沒有誤標公開。寶舖客戶頁與公司財務頁安全。

- **壞連結是大宗,且可一鍵修**:`技術/VisTwin/`(少一個 `us`)共 **60 處、散在 37 個檔**,而 `02 技術/VisTwin/` 資料夾**確認不存在**,全是孤兒連結。最密集:`技術/VisTwin/README`(22)、`Plugins/README`(15)、`Backlog`(3)。**建議全庫批次取代 `技術/VisTwin/` → `技術/Visustwin/`**,一次清掉這批(對應健檢「243 孤兒連結」最大可一鍵修區塊)。

- **批次取代必須排除三類**(否則改了反而失真):① `99 封存/`(legacy 凍結區);② `00 系統/Meta/health/` 健檢報告與 `00 系統/Inbox/維護提案-*` —— 這些是在**引述**這個壞連結當案例,不是真要連過去;③ Templates 內 `sprints/{{sprint}}/planning`、`{{prev_sprint}}/retro` 兩條帶 Templater 佔位符,取代時**只改 `VisTwin→Visustwin`、保留 `{{sprint}}` 佔位符**。建議範圍限定 `02 技術/`(排除 Templates 那兩行的佔位符)、`01 專案/`、`00 系統/GitHub Overview`。

- **唯一需到 site 端查證的真風險**:本 vault 根目錄無 quartz/全域發布設定,理論上只 `index.md` 出去;但實際 sync 走手動 rsync(`-av --delete` + 排除式 blocklist,**不看 `publish:` 旗標**)。守門其實落在 site repo 的 Quartz 設定 —— **若用 RemoveDrafts 而非 ExplicitPublish,allowlist 形同虛設**。本 vault 無法驗,建議列待辦去 site 端確認。這是目前唯一的發布風險點。

- **預防提醒(尚未發生但很快會碰到)**:寶舖 showcase 6/22–24 大改,日後若 flip `publish: true` 對外,務必先檢查頁內 `[[連結]]` 不會把 `_控管/`、財務、合約等私密頁帶上線。

最高槓桿:**批次修 `VisTwin→Visustwin`(60 處,排除封存/健檢/Inbox 引述 + 保留佔位符)**;最該查證:**site 端 rsync 是否真按 `publish:` 過濾**。要我實際執行批次取代嗎?(目前依指示僅提案,未動任何檔。)



---
## ✅ 核准（已結案 — `status: consumed`）

> ⚠️ 本提案已於 2026-06-25 消化:daily-journal 段落已落進 `2026-06-25.md`,本檔已從 Inbox 歸檔至 `Meta/maintenance/`。下方 n8n form-waiting 核准連結為一次性 webhook,已失效,僅留存備查。

~~http://localhost:5678/form-waiting/21?signature=bcfe9723e97bdec0b9b76a490b2f478f6d19400a8ddc023a69bfe39286e5d424~~
