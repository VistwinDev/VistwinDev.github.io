# CLAUDE.md — vault entry point

任何 Claude session 在 `D:\VisTwin\vistwin-vault\` 起手時，第一動作：

1. 讀 [[00 系統/技能/working-with-frncs/SKILL.md|working-with-frncs]] §0-§18 工作原則
2. 讀 [[00 系統/Entity_Map.md|Entity_Map]] — VisTwin / 實踐 / 寶舖實體邊界，含**主線 A/B 雙軌定義**

這兩份是 vault 的「正典」，下游所有判斷以此為基。

## vault 結構（2026-06-18 極簡化：8 區 → 6 區）
- `00 系統/` — 機制層：Entity_Map / Templates / Workflows / Meta / `技能`（可觸發 skill 集合）
- `01 專案/` — **專案線**：各專案管理（寶鋪 / Physical_AI / visionbase）
- `02 技術/` — **技術線**：技術開發（Plugins / decisions / Design-System / Web）
- `03 公司/` — **公司線**：公司檔案管理（登記 / 商標 / 財務 / 合約），輕量
- `98 資料/` — 技術資料冷藏（Ontology / Omniverse / Gaussian-Splatting 等，退出日常視野）
- `99 封存/` — legacy 凍結區

## §13 強制條款
任何 task 開始前必跑 pre-flight：read CLAUDE.md + working-with-frncs SKILL.md + 對應專案 doc，**不憑記憶**。
